
// @from(Ln 144558, Col 17)
Vk = (A) => {
  switch (typeof A) {
    case "undefined":
      return fB.undefined;
    case "string":
      return fB.string;
    case "number":
      return Number.isNaN(A) ? fB.nan : fB.number;
    case "boolean":
      return fB.boolean;
    case "function":
      return fB.function;
    case "bigint":
      return fB.bigint;
    case "symbol":
      return fB.symbol;
    case "object":
      if (Array.isArray(A)) return fB.array;
      if (A === null) return fB.null;
      if (A.then && typeof A.then === "function" && A.catch && typeof A.catch === "function") return fB.promise;
      if (typeof Map < "u" && A instanceof Map) return fB.map;
      if (typeof Set < "u" && A instanceof Set) return fB.set;
      if (typeof Date < "u" && A instanceof Date) return fB.date;
      return fB.object;
    default:
      return fB.unknown
  }
}
// @from(Ln 144586, Col 4)
aMA = w(() => {
  (function (A) {
    A.assertEqual = (Z) => {};

    function Q(Z) {}
    A.assertIs = Q;

    function B(Z) {
      throw Error()
    }
    A.assertNever = B, A.arrayToEnum = (Z) => {
      let Y = {};
      for (let J of Z) Y[J] = J;
      return Y
    }, A.getValidEnumValues = (Z) => {
      let Y = A.objectKeys(Z).filter((X) => typeof Z[Z[X]] !== "number"),
        J = {};
      for (let X of Y) J[X] = Z[X];
      return A.objectValues(J)
    }, A.objectValues = (Z) => {
      return A.objectKeys(Z).map(function (Y) {
        return Z[Y]
      })
    }, A.objectKeys = typeof Object.keys === "function" ? (Z) => Object.keys(Z) : (Z) => {
      let Y = [];
      for (let J in Z)
        if (Object.prototype.hasOwnProperty.call(Z, J)) Y.push(J);
      return Y
    }, A.find = (Z, Y) => {
      for (let J of Z)
        if (Y(J)) return J;
      return
    }, A.isInteger = typeof Number.isInteger === "function" ? (Z) => Number.isInteger(Z) : (Z) => typeof Z === "number" && Number.isFinite(Z) && Math.floor(Z) === Z;

    function G(Z, Y = " | ") {
      return Z.map((J) => typeof J === "string" ? `'${J}'` : J).join(Y)
    }
    A.joinValues = G, A.jsonStringifyReplacer = (Z, Y) => {
      if (typeof Y === "bigint") return Y.toString();
      return Y
    }
  })(G5 || (G5 = {}));
  (function (A) {
    A.mergeShapes = (Q, B) => {
      return {
        ...Q,
        ...B
      }
    }
  })(Nr1 || (Nr1 = {}));
  fB = G5.arrayToEnum(["string", "nan", "number", "integer", "float", "boolean", "date", "bigint", "symbol", "function", "undefined", "null", "array", "object", "unknown", "promise", "void", "never", "map", "set"])
})
// @from(Ln 144638, Col 4)
JB
// @from(Ln 144638, Col 8)
c58 = (A) => {
    return JSON.stringify(A, null, 2).replace(/"([^"]+)":/g, "$1:")
  }
// @from(Ln 144641, Col 2)
oq
// @from(Ln 144642, Col 4)
S01 = w(() => {
  aMA();
  JB = G5.arrayToEnum(["invalid_type", "invalid_literal", "custom", "invalid_union", "invalid_union_discriminator", "invalid_enum_value", "unrecognized_keys", "invalid_arguments", "invalid_return_type", "invalid_date", "invalid_string", "too_small", "too_big", "invalid_intersection_types", "not_multiple_of", "not_finite"]);
  oq = class oq extends Error {
    get errors() {
      return this.issues
    }
    constructor(A) {
      super();
      this.issues = [], this.addIssue = (B) => {
        this.issues = [...this.issues, B]
      }, this.addIssues = (B = []) => {
        this.issues = [...this.issues, ...B]
      };
      let Q = new.target.prototype;
      if (Object.setPrototypeOf) Object.setPrototypeOf(this, Q);
      else this.__proto__ = Q;
      this.name = "ZodError", this.issues = A
    }
    format(A) {
      let Q = A || function (Z) {
          return Z.message
        },
        B = {
          _errors: []
        },
        G = (Z) => {
          for (let Y of Z.issues)
            if (Y.code === "invalid_union") Y.unionErrors.map(G);
            else if (Y.code === "invalid_return_type") G(Y.returnTypeError);
          else if (Y.code === "invalid_arguments") G(Y.argumentsError);
          else if (Y.path.length === 0) B._errors.push(Q(Y));
          else {
            let J = B,
              X = 0;
            while (X < Y.path.length) {
              let I = Y.path[X];
              if (X !== Y.path.length - 1) J[I] = J[I] || {
                _errors: []
              };
              else J[I] = J[I] || {
                _errors: []
              }, J[I]._errors.push(Q(Y));
              J = J[I], X++
            }
          }
        };
      return G(this), B
    }
    static assert(A) {
      if (!(A instanceof oq)) throw Error(`Not a ZodError: ${A}`)
    }
    toString() {
      return this.message
    }
    get message() {
      return JSON.stringify(this.issues, G5.jsonStringifyReplacer, 2)
    }
    get isEmpty() {
      return this.issues.length === 0
    }
    flatten(A = (Q) => Q.message) {
      let Q = {},
        B = [];
      for (let G of this.issues)
        if (G.path.length > 0) {
          let Z = G.path[0];
          Q[Z] = Q[Z] || [], Q[Z].push(A(G))
        } else B.push(A(G));
      return {
        formErrors: B,
        fieldErrors: Q
      }
    }
    get formErrors() {
      return this.flatten()
    }
  };
  oq.create = (A) => {
    return new oq(A)
  }
})
// @from(Ln 144724, Col 4)
p58 = (A, Q) => {
    let B;
    switch (A.code) {
      case JB.invalid_type:
        if (A.received === fB.undefined) B = "Required";
        else B = `Expected ${A.expected}, received ${A.received}`;
        break;
      case JB.invalid_literal:
        B = `Invalid literal value, expected ${JSON.stringify(A.expected,G5.jsonStringifyReplacer)}`;
        break;
      case JB.unrecognized_keys:
        B = `Unrecognized key(s) in object: ${G5.joinValues(A.keys,", ")}`;
        break;
      case JB.invalid_union:
        B = "Invalid input";
        break;
      case JB.invalid_union_discriminator:
        B = `Invalid discriminator value. Expected ${G5.joinValues(A.options)}`;
        break;
      case JB.invalid_enum_value:
        B = `Invalid enum value. Expected ${G5.joinValues(A.options)}, received '${A.received}'`;
        break;
      case JB.invalid_arguments:
        B = "Invalid function arguments";
        break;
      case JB.invalid_return_type:
        B = "Invalid function return type";
        break;
      case JB.invalid_date:
        B = "Invalid date";
        break;
      case JB.invalid_string:
        if (typeof A.validation === "object")
          if ("includes" in A.validation) {
            if (B = `Invalid input: must include "${A.validation.includes}"`, typeof A.validation.position === "number") B = `${B} at one or more positions greater than or equal to ${A.validation.position}`
          } else if ("startsWith" in A.validation) B = `Invalid input: must start with "${A.validation.startsWith}"`;
        else if ("endsWith" in A.validation) B = `Invalid input: must end with "${A.validation.endsWith}"`;
        else G5.assertNever(A.validation);
        else if (A.validation !== "regex") B = `Invalid ${A.validation}`;
        else B = "Invalid";
        break;
      case JB.too_small:
        if (A.type === "array") B = `Array must contain ${A.exact?"exactly":A.inclusive?"at least":"more than"} ${A.minimum} element(s)`;
        else if (A.type === "string") B = `String must contain ${A.exact?"exactly":A.inclusive?"at least":"over"} ${A.minimum} character(s)`;
        else if (A.type === "number") B = `Number must be ${A.exact?"exactly equal to ":A.inclusive?"greater than or equal to ":"greater than "}${A.minimum}`;
        else if (A.type === "bigint") B = `Number must be ${A.exact?"exactly equal to ":A.inclusive?"greater than or equal to ":"greater than "}${A.minimum}`;
        else if (A.type === "date") B = `Date must be ${A.exact?"exactly equal to ":A.inclusive?"greater than or equal to ":"greater than "}${new Date(Number(A.minimum))}`;
        else B = "Invalid input";
        break;
      case JB.too_big:
        if (A.type === "array") B = `Array must contain ${A.exact?"exactly":A.inclusive?"at most":"less than"} ${A.maximum} element(s)`;
        else if (A.type === "string") B = `String must contain ${A.exact?"exactly":A.inclusive?"at most":"under"} ${A.maximum} character(s)`;
        else if (A.type === "number") B = `Number must be ${A.exact?"exactly":A.inclusive?"less than or equal to":"less than"} ${A.maximum}`;
        else if (A.type === "bigint") B = `BigInt must be ${A.exact?"exactly":A.inclusive?"less than or equal to":"less than"} ${A.maximum}`;
        else if (A.type === "date") B = `Date must be ${A.exact?"exactly":A.inclusive?"smaller than or equal to":"smaller than"} ${new Date(Number(A.maximum))}`;
        else B = "Invalid input";
        break;
      case JB.custom:
        B = "Invalid input";
        break;
      case JB.invalid_intersection_types:
        B = "Intersection results could not be merged";
        break;
      case JB.not_multiple_of:
        B = `Number must be a multiple of ${A.multipleOf}`;
        break;
      case JB.not_finite:
        B = "Number must be finite";
        break;
      default:
        B = Q.defaultError, G5.assertNever(A)
    }
    return {
      message: B
    }
  }
// @from(Ln 144800, Col 2)
du
// @from(Ln 144801, Col 4)
wr1 = w(() => {
  S01();
  aMA();
  du = p58
})
// @from(Ln 144807, Col 0)
function l58(A) {
  vHB = A
}
// @from(Ln 144811, Col 0)
function uXA() {
  return vHB
}
// @from(Ln 144814, Col 4)
vHB
// @from(Ln 144815, Col 4)
x01 = w(() => {
  wr1();
  vHB = du
})
// @from(Ln 144820, Col 0)
function X2(A, Q) {
  let B = uXA(),
    G = oMA({
      issueData: Q,
      data: A.data,
      path: A.path,
      errorMaps: [A.common.contextualErrorMap, A.schemaErrorMap, B, B === du ? void 0 : du].filter((Z) => !!Z)
    });
  A.common.issues.push(G)
}
// @from(Ln 144830, Col 0)
class fH {
  constructor() {
    this.value = "valid"
  }
  dirty() {
    if (this.value === "valid") this.value = "dirty"
  }
  abort() {
    if (this.value !== "aborted") this.value = "aborted"
  }
  static mergeArray(A, Q) {
    let B = [];
    for (let G of Q) {
      if (G.status === "aborted") return T4;
      if (G.status === "dirty") A.dirty();
      B.push(G.value)
    }
    return {
      status: A.value,
      value: B
    }
  }
  static async mergeObjectAsync(A, Q) {
    let B = [];
    for (let G of Q) {
      let Z = await G.key,
        Y = await G.value;
      B.push({
        key: Z,
        value: Y
      })
    }
    return fH.mergeObjectSync(A, B)
  }
  static mergeObjectSync(A, Q) {
    let B = {};
    for (let G of Q) {
      let {
        key: Z,
        value: Y
      } = G;
      if (Z.status === "aborted") return T4;
      if (Y.status === "aborted") return T4;
      if (Z.status === "dirty") A.dirty();
      if (Y.status === "dirty") A.dirty();
      if (Z.value !== "__proto__" && (typeof Y.value < "u" || G.alwaysSet)) B[Z.value] = Y.value
    }
    return {
      status: A.value,
      value: B
    }
  }
}
// @from(Ln 144883, Col 4)
oMA = (A) => {
    let {
      data: Q,
      path: B,
      errorMaps: G,
      issueData: Z
    } = A, Y = [...B, ...Z.path || []], J = {
      ...Z,
      path: Y
    };
    if (Z.message !== void 0) return {
      ...Z,
      path: Y,
      message: Z.message
    };
    let X = "",
      I = G.filter((D) => !!D).slice().reverse();
    for (let D of I) X = D(J, {
      data: Q,
      defaultError: X
    }).message;
    return {
      ...Z,
      path: Y,
      message: X
    }
  }
// @from(Ln 144910, Col 2)
i58
// @from(Ln 144910, Col 7)
T4
// @from(Ln 144910, Col 11)
GBA = (A) => ({
    status: "dirty",
    value: A
  })
// @from(Ln 144914, Col 2)
Rz = (A) => ({
    status: "valid",
    value: A
  })
// @from(Ln 144918, Col 2)
y01 = (A) => A.status === "aborted"
// @from(Ln 144919, Col 2)
v01 = (A) => A.status === "dirty"
// @from(Ln 144920, Col 2)
Fa = (A) => A.status === "valid"
// @from(Ln 144921, Col 2)
mXA = (A) => typeof Promise < "u" && A instanceof Promise
// @from(Ln 144922, Col 4)
Lr1 = w(() => {
  x01();
  wr1();
  i58 = [];
  T4 = Object.freeze({
    status: "aborted"
  })
})
// @from(Ln 144930, Col 4)
kHB = () => {}
// @from(Ln 144931, Col 4)
H9
// @from(Ln 144932, Col 4)
bHB = w(() => {
  (function (A) {
    A.errToObj = (Q) => typeof Q === "string" ? {
      message: Q
    } : Q || {}, A.toString = (Q) => typeof Q === "string" ? Q : Q?.message
  })(H9 || (H9 = {}))
})
// @from(Ln 144939, Col 0)
class EP {
  constructor(A, Q, B, G) {
    this._cachedPath = [], this.parent = A, this.data = Q, this._path = B, this._key = G
  }
  get path() {
    if (!this._cachedPath.length)
      if (Array.isArray(this._key)) this._cachedPath.push(...this._path, ...this._key);
      else this._cachedPath.push(...this._path, this._key);
    return this._cachedPath
  }
}
// @from(Ln 144951, Col 0)
function b3(A) {
  if (!A) return {};
  let {
    errorMap: Q,
    invalid_type_error: B,
    required_error: G,
    description: Z
  } = A;
  if (Q && (B || G)) throw Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  if (Q) return {
    errorMap: Q,
    description: Z
  };
  return {
    errorMap: (J, X) => {
      let {
        message: I
      } = A;
      if (J.code === "invalid_enum_value") return {
        message: I ?? X.defaultError
      };
      if (typeof X.data > "u") return {
        message: I ?? G ?? X.defaultError
      };
      if (J.code !== "invalid_type") return {
        message: X.defaultError
      };
      return {
        message: I ?? B ?? X.defaultError
      }
    },
    description: Z
  }
}
// @from(Ln 144985, Col 0)
class L8 {
  get description() {
    return this._def.description
  }
  _getType(A) {
    return Vk(A.data)
  }
  _getOrReturnCtx(A, Q) {
    return Q || {
      common: A.parent.common,
      data: A.data,
      parsedType: Vk(A.data),
      schemaErrorMap: this._def.errorMap,
      path: A.path,
      parent: A.parent
    }
  }
  _processInputParams(A) {
    return {
      status: new fH,
      ctx: {
        common: A.parent.common,
        data: A.data,
        parsedType: Vk(A.data),
        schemaErrorMap: this._def.errorMap,
        path: A.path,
        parent: A.parent
      }
    }
  }
  _parseSync(A) {
    let Q = this._parse(A);
    if (mXA(Q)) throw Error("Synchronous parse encountered promise.");
    return Q
  }
  _parseAsync(A) {
    let Q = this._parse(A);
    return Promise.resolve(Q)
  }
  parse(A, Q) {
    let B = this.safeParse(A, Q);
    if (B.success) return B.data;
    throw B.error
  }
  safeParse(A, Q) {
    let B = {
        common: {
          issues: [],
          async: Q?.async ?? !1,
          contextualErrorMap: Q?.errorMap
        },
        path: Q?.path || [],
        schemaErrorMap: this._def.errorMap,
        parent: null,
        data: A,
        parsedType: Vk(A)
      },
      G = this._parseSync({
        data: A,
        path: B.path,
        parent: B
      });
    return fHB(B, G)
  }
  "~validate"(A) {
    let Q = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: A,
      parsedType: Vk(A)
    };
    if (!this["~standard"].async) try {
      let B = this._parseSync({
        data: A,
        path: [],
        parent: Q
      });
      return Fa(B) ? {
        value: B.value
      } : {
        issues: Q.common.issues
      }
    } catch (B) {
      if (B?.message?.toLowerCase()?.includes("encountered")) this["~standard"].async = !0;
      Q.common = {
        issues: [],
        async: !0
      }
    }
    return this._parseAsync({
      data: A,
      path: [],
      parent: Q
    }).then((B) => Fa(B) ? {
      value: B.value
    } : {
      issues: Q.common.issues
    })
  }
  async parseAsync(A, Q) {
    let B = await this.safeParseAsync(A, Q);
    if (B.success) return B.data;
    throw B.error
  }
  async safeParseAsync(A, Q) {
    let B = {
        common: {
          issues: [],
          contextualErrorMap: Q?.errorMap,
          async: !0
        },
        path: Q?.path || [],
        schemaErrorMap: this._def.errorMap,
        parent: null,
        data: A,
        parsedType: Vk(A)
      },
      G = this._parse({
        data: A,
        path: B.path,
        parent: B
      }),
      Z = await (mXA(G) ? G : Promise.resolve(G));
    return fHB(B, Z)
  }
  refine(A, Q) {
    let B = (G) => {
      if (typeof Q === "string" || typeof Q > "u") return {
        message: Q
      };
      else if (typeof Q === "function") return Q(G);
      else return Q
    };
    return this._refinement((G, Z) => {
      let Y = A(G),
        J = () => Z.addIssue({
          code: JB.custom,
          ...B(G)
        });
      if (typeof Promise < "u" && Y instanceof Promise) return Y.then((X) => {
        if (!X) return J(), !1;
        else return !0
      });
      if (!Y) return J(), !1;
      else return !0
    })
  }
  refinement(A, Q) {
    return this._refinement((B, G) => {
      if (!A(B)) return G.addIssue(typeof Q === "function" ? Q(B, G) : Q), !1;
      else return !0
    })
  }
  _refinement(A) {
    return new zP({
      schema: this,
      typeName: e4.ZodEffects,
      effect: {
        type: "refinement",
        refinement: A
      }
    })
  }
  superRefine(A) {
    return this._refinement(A)
  }
  constructor(A) {
    this.spa = this.safeParseAsync, this._def = A, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this), this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (Q) => this["~validate"](Q)
    }
  }
  optional() {
    return HP.create(this, this._def)
  }
  nullable() {
    return pu.create(this, this._def)
  }
  nullish() {
    return this.nullable().optional()
  }
  array() {
    return FP.create(this)
  }
  promise() {
    return XBA.create(this, this._def)
  }
  or(A) {
    return nXA.create([this, A], this._def)
  }
  and(A) {
    return aXA.create(this, A, this._def)
  }
  transform(A) {
    return new zP({
      ...b3(this._def),
      schema: this,
      typeName: e4.ZodEffects,
      effect: {
        type: "transform",
        transform: A
      }
    })
  }
  default (A) {
    let Q = typeof A === "function" ? A : () => A;
    return new tXA({
      ...b3(this._def),
      innerType: this,
      defaultValue: Q,
      typeName: e4.ZodDefault
    })
  }
  brand() {
    return new b01({
      typeName: e4.ZodBranded,
      type: this,
      ...b3(this._def)
    })
  } catch (A) {
    let Q = typeof A === "function" ? A : () => A;
    return new eXA({
      ...b3(this._def),
      innerType: this,
      catchValue: Q,
      typeName: e4.ZodCatch
    })
  }
  describe(A) {
    return new this.constructor({
      ...this._def,
      description: A
    })
  }
  pipe(A) {
    return QRA.create(this, A)
  }
  readonly() {
    return AIA.create(this)
  }
  isOptional() {
    return this.safeParse(void 0).success
  }
  isNullable() {
    return this.safeParse(null).success
  }
}
// @from(Ln 145239, Col 0)
function uHB(A) {
  let Q = "[0-5]\\d";
  if (A.precision) Q = `${Q}\\.\\d{${A.precision}}`;
  else if (A.precision == null) Q = `${Q}(\\.\\d+)?`;
  let B = A.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${Q})${B}`
}
// @from(Ln 145247, Col 0)
function D78(A) {
  return new RegExp(`^${uHB(A)}$`)
}
// @from(Ln 145251, Col 0)
function mHB(A) {
  let Q = `${gHB}T${uHB(A)}`,
    B = [];
  if (B.push(A.local ? "Z?" : "Z"), A.offset) B.push("([+-]\\d{2}:?\\d{2})");
  return Q = `${Q}(${B.join("|")})`, new RegExp(`^${Q}$`)
}
// @from(Ln 145258, Col 0)
function W78(A, Q) {
  if ((Q === "v4" || !Q) && B78.test(A)) return !0;
  if ((Q === "v6" || !Q) && Z78.test(A)) return !0;
  return !1
}
// @from(Ln 145264, Col 0)
function K78(A, Q) {
  if (!t58.test(A)) return !1;
  try {
    let [B] = A.split(".");
    if (!B) return !1;
    let G = B.replace(/-/g, "+").replace(/_/g, "/").padEnd(B.length + (4 - B.length % 4) % 4, "="),
      Z = JSON.parse(atob(G));
    if (typeof Z !== "object" || Z === null) return !1;
    if ("typ" in Z && Z?.typ !== "JWT") return !1;
    if (!Z.alg) return !1;
    if (Q && Z.alg !== Q) return !1;
    return !0
  } catch {
    return !1
  }
}
// @from(Ln 145281, Col 0)
function V78(A, Q) {
  if ((Q === "v4" || !Q) && G78.test(A)) return !0;
  if ((Q === "v6" || !Q) && Y78.test(A)) return !0;
  return !1
}
// @from(Ln 145287, Col 0)
function F78(A, Q) {
  let B = (A.toString().split(".")[1] || "").length,
    G = (Q.toString().split(".")[1] || "").length,
    Z = B > G ? B : G,
    Y = Number.parseInt(A.toFixed(Z).replace(".", "")),
    J = Number.parseInt(Q.toFixed(Z).replace(".", ""));
  return Y % J / 10 ** Z
}
// @from(Ln 145296, Col 0)
function dXA(A) {
  if (A instanceof JI) {
    let Q = {};
    for (let B in A.shape) {
      let G = A.shape[B];
      Q[B] = HP.create(dXA(G))
    }
    return new JI({
      ...A._def,
      shape: () => Q
    })
  } else if (A instanceof FP) return new FP({
    ...A._def,
    type: dXA(A.element)
  });
  else if (A instanceof HP) return HP.create(dXA(A.unwrap()));
  else if (A instanceof pu) return pu.create(dXA(A.unwrap()));
  else if (A instanceof Hk) return Hk.create(A.items.map((Q) => dXA(Q)));
  else return A
}
// @from(Ln 145317, Col 0)
function Mr1(A, Q) {
  let B = Vk(A),
    G = Vk(Q);
  if (A === Q) return {
    valid: !0,
    data: A
  };
  else if (B === fB.object && G === fB.object) {
    let Z = G5.objectKeys(Q),
      Y = G5.objectKeys(A).filter((X) => Z.indexOf(X) !== -1),
      J = {
        ...A,
        ...Q
      };
    for (let X of Y) {
      let I = Mr1(A[X], Q[X]);
      if (!I.valid) return {
        valid: !1
      };
      J[X] = I.data
    }
    return {
      valid: !0,
      data: J
    }
  } else if (B === fB.array && G === fB.array) {
    if (A.length !== Q.length) return {
      valid: !1
    };
    let Z = [];
    for (let Y = 0; Y < A.length; Y++) {
      let J = A[Y],
        X = Q[Y],
        I = Mr1(J, X);
      if (!I.valid) return {
        valid: !1
      };
      Z.push(I.data)
    }
    return {
      valid: !0,
      data: Z
    }
  } else if (B === fB.date && G === fB.date && +A === +Q) return {
    valid: !0,
    data: A
  };
  else return {
    valid: !1
  }
}
// @from(Ln 145369, Col 0)
function dHB(A, Q) {
  return new $a({
    values: A,
    typeName: e4.ZodEnum,
    ...b3(Q)
  })
}
// @from(Ln 145377, Col 0)
function hHB(A, Q) {
  let B = typeof A === "function" ? A(Q) : typeof A === "string" ? {
    message: A
  } : A;
  return typeof B === "string" ? {
    message: B
  } : B
}
// @from(Ln 145386, Col 0)
function cHB(A, Q = {}, B) {
  if (A) return YBA.create().superRefine((G, Z) => {
    let Y = A(G);
    if (Y instanceof Promise) return Y.then((J) => {
      if (!J) {
        let X = hHB(Q, G),
          I = X.fatal ?? B ?? !0;
        Z.addIssue({
          code: "custom",
          ...X,
          fatal: I
        })
      }
    });
    if (!Y) {
      let J = hHB(Q, G),
        X = J.fatal ?? B ?? !0;
      Z.addIssue({
        code: "custom",
        ...J,
        fatal: X
      })
    }
    return
  });
  return YBA.create()
}
// @from(Ln 145413, Col 4)
fHB = (A, Q) => {
    if (Fa(Q)) return {
      success: !0,
      data: Q.value
    };
    else {
      if (!A.common.issues.length) throw Error("Validation failed but no issues detected.");
      return {
        success: !1,
        get error() {
          if (this._error) return this._error;
          let B = new oq(A.common.issues);
          return this._error = B, this._error
        }
      }
    }
  }
// @from(Ln 145430, Col 2)
n58
// @from(Ln 145430, Col 7)
a58
// @from(Ln 145430, Col 12)
o58
// @from(Ln 145430, Col 17)
r58
// @from(Ln 145430, Col 22)
s58
// @from(Ln 145430, Col 27)
t58
// @from(Ln 145430, Col 32)
e58
// @from(Ln 145430, Col 37)
A78
// @from(Ln 145430, Col 42)
Q78 = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$"
// @from(Ln 145431, Col 2)
Or1
// @from(Ln 145431, Col 7)
B78
// @from(Ln 145431, Col 12)
G78
// @from(Ln 145431, Col 17)
Z78
// @from(Ln 145431, Col 22)
Y78
// @from(Ln 145431, Col 27)
J78
// @from(Ln 145431, Col 32)
X78
// @from(Ln 145431, Col 37)
gHB = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))"
// @from(Ln 145432, Col 2)
I78
// @from(Ln 145432, Col 7)
VP
// @from(Ln 145432, Col 11)
Ea
// @from(Ln 145432, Col 15)
za
// @from(Ln 145432, Col 19)
pXA
// @from(Ln 145432, Col 24)
ZBA
// @from(Ln 145432, Col 29)
rMA
// @from(Ln 145432, Col 34)
lXA
// @from(Ln 145432, Col 39)
iXA
// @from(Ln 145432, Col 44)
YBA
// @from(Ln 145432, Col 49)
Ha
// @from(Ln 145432, Col 53)
Fk
// @from(Ln 145432, Col 57)
sMA
// @from(Ln 145432, Col 62)
FP
// @from(Ln 145432, Col 66)
JI
// @from(Ln 145432, Col 70)
nXA
// @from(Ln 145432, Col 75)
cu = (A) => {
    if (A instanceof oXA) return cu(A.schema);
    else if (A instanceof zP) return cu(A.innerType());
    else if (A instanceof rXA) return [A.value];
    else if (A instanceof $a) return A.options;
    else if (A instanceof sXA) return G5.objectValues(A.enum);
    else if (A instanceof tXA) return cu(A._def.innerType);
    else if (A instanceof lXA) return [void 0];
    else if (A instanceof iXA) return [null];
    else if (A instanceof HP) return [void 0, ...cu(A.unwrap())];
    else if (A instanceof pu) return [null, ...cu(A.unwrap())];
    else if (A instanceof b01) return cu(A.unwrap());
    else if (A instanceof AIA) return cu(A.unwrap());
    else if (A instanceof eXA) return cu(A._def.innerType);
    else return []
  }
// @from(Ln 145448, Col 2)
k01
// @from(Ln 145448, Col 7)
aXA
// @from(Ln 145448, Col 12)
Hk
// @from(Ln 145448, Col 16)
tMA
// @from(Ln 145448, Col 21)
eMA
// @from(Ln 145448, Col 26)
JBA
// @from(Ln 145448, Col 31)
cXA
// @from(Ln 145448, Col 36)
oXA
// @from(Ln 145448, Col 41)
rXA
// @from(Ln 145448, Col 46)
$a
// @from(Ln 145448, Col 50)
sXA
// @from(Ln 145448, Col 55)
XBA
// @from(Ln 145448, Col 60)
zP
// @from(Ln 145448, Col 64)
HP
// @from(Ln 145448, Col 68)
pu
// @from(Ln 145448, Col 72)
tXA
// @from(Ln 145448, Col 77)
eXA
// @from(Ln 145448, Col 82)
ARA
// @from(Ln 145448, Col 87)
H78
// @from(Ln 145448, Col 92)
b01
// @from(Ln 145448, Col 97)
QRA
// @from(Ln 145448, Col 102)
AIA
// @from(Ln 145448, Col 107)
E78
// @from(Ln 145448, Col 112)
e4
// @from(Ln 145448, Col 116)
z78 = (A, Q = {
    message: `Input not instance of ${A.name}`
  }) => cHB((B) => B instanceof A, Q)
// @from(Ln 145451, Col 2)
oQ
// @from(Ln 145451, Col 6)
pR
// @from(Ln 145451, Col 10)
$78
// @from(Ln 145451, Col 15)
C78
// @from(Ln 145451, Col 20)
ZF
// @from(Ln 145451, Col 24)
U78
// @from(Ln 145451, Col 29)
q78
// @from(Ln 145451, Col 34)
N78
// @from(Ln 145451, Col 39)
w78
// @from(Ln 145451, Col 44)
L78
// @from(Ln 145451, Col 49)
O78
// @from(Ln 145451, Col 54)
M78
// @from(Ln 145451, Col 59)
R78
// @from(Ln 145451, Col 64)
dI
// @from(Ln 145451, Col 68)
bL
// @from(Ln 145451, Col 72)
fL
// @from(Ln 145451, Col 76)
IBA
// @from(Ln 145451, Col 81)
_78
// @from(Ln 145451, Col 86)
j78
// @from(Ln 145451, Col 91)
T78
// @from(Ln 145451, Col 96)
$P
// @from(Ln 145451, Col 100)
P78
// @from(Ln 145451, Col 105)
S78
// @from(Ln 145451, Col 110)
x78
// @from(Ln 145451, Col 115)
y78
// @from(Ln 145451, Col 120)
v78
// @from(Ln 145451, Col 125)
CP
// @from(Ln 145451, Col 129)
k78
// @from(Ln 145451, Col 134)
b78
// @from(Ln 145451, Col 139)
f78
// @from(Ln 145451, Col 144)
h78
// @from(Ln 145451, Col 149)
g78
// @from(Ln 145451, Col 154)
u78
// @from(Ln 145451, Col 159)
m78
// @from(Ln 145451, Col 164)
d78 = () => oQ().optional()
// @from(Ln 145452, Col 2)
c78 = () => pR().optional()
// @from(Ln 145453, Col 2)
p78 = () => ZF().optional()
// @from(Ln 145454, Col 2)
l78
// @from(Ln 145454, Col 7)
i78
// @from(Ln 145455, Col 4)
pHB = w(() => {
  S01();
  x01();
  bHB();
  Lr1();
  aMA();
  n58 = /^c[^\s-]{8,}$/i, a58 = /^[0-9a-z]+$/, o58 = /^[0-9A-HJKMNP-TV-Z]{26}$/i, r58 = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, s58 = /^[a-z0-9_-]{21}$/i, t58 = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, e58 = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, A78 = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, B78 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, G78 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, Z78 = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, Y78 = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, J78 = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, X78 = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, I78 = new RegExp(`^${gHB}$`);
  VP = class VP extends L8 {
    _parse(A) {
      if (this._def.coerce) A.data = String(A.data);
      if (this._getType(A) !== fB.string) {
        let Z = this._getOrReturnCtx(A);
        return X2(Z, {
          code: JB.invalid_type,
          expected: fB.string,
          received: Z.parsedType
        }), T4
      }
      let B = new fH,
        G = void 0;
      for (let Z of this._def.checks)
        if (Z.kind === "min") {
          if (A.data.length < Z.value) G = this._getOrReturnCtx(A, G), X2(G, {
            code: JB.too_small,
            minimum: Z.value,
            type: "string",
            inclusive: !0,
            exact: !1,
            message: Z.message
          }), B.dirty()
        } else if (Z.kind === "max") {
        if (A.data.length > Z.value) G = this._getOrReturnCtx(A, G), X2(G, {
          code: JB.too_big,
          maximum: Z.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "length") {
        let Y = A.data.length > Z.value,
          J = A.data.length < Z.value;
        if (Y || J) {
          if (G = this._getOrReturnCtx(A, G), Y) X2(G, {
            code: JB.too_big,
            maximum: Z.value,
            type: "string",
            inclusive: !0,
            exact: !0,
            message: Z.message
          });
          else if (J) X2(G, {
            code: JB.too_small,
            minimum: Z.value,
            type: "string",
            inclusive: !0,
            exact: !0,
            message: Z.message
          });
          B.dirty()
        }
      } else if (Z.kind === "email") {
        if (!A78.test(A.data)) G = this._getOrReturnCtx(A, G), X2(G, {
          validation: "email",
          code: JB.invalid_string,
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "emoji") {
        if (!Or1) Or1 = new RegExp(Q78, "u");
        if (!Or1.test(A.data)) G = this._getOrReturnCtx(A, G), X2(G, {
          validation: "emoji",
          code: JB.invalid_string,
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "uuid") {
        if (!r58.test(A.data)) G = this._getOrReturnCtx(A, G), X2(G, {
          validation: "uuid",
          code: JB.invalid_string,
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "nanoid") {
        if (!s58.test(A.data)) G = this._getOrReturnCtx(A, G), X2(G, {
          validation: "nanoid",
          code: JB.invalid_string,
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "cuid") {
        if (!n58.test(A.data)) G = this._getOrReturnCtx(A, G), X2(G, {
          validation: "cuid",
          code: JB.invalid_string,
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "cuid2") {
        if (!a58.test(A.data)) G = this._getOrReturnCtx(A, G), X2(G, {
          validation: "cuid2",
          code: JB.invalid_string,
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "ulid") {
        if (!o58.test(A.data)) G = this._getOrReturnCtx(A, G), X2(G, {
          validation: "ulid",
          code: JB.invalid_string,
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "url") try {
        new URL(A.data)
      } catch {
        G = this._getOrReturnCtx(A, G), X2(G, {
          validation: "url",
          code: JB.invalid_string,
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "regex") {
        if (Z.regex.lastIndex = 0, !Z.regex.test(A.data)) G = this._getOrReturnCtx(A, G), X2(G, {
          validation: "regex",
          code: JB.invalid_string,
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "trim") A.data = A.data.trim();
      else if (Z.kind === "includes") {
        if (!A.data.includes(Z.value, Z.position)) G = this._getOrReturnCtx(A, G), X2(G, {
          code: JB.invalid_string,
          validation: {
            includes: Z.value,
            position: Z.position
          },
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "toLowerCase") A.data = A.data.toLowerCase();
      else if (Z.kind === "toUpperCase") A.data = A.data.toUpperCase();
      else if (Z.kind === "startsWith") {
        if (!A.data.startsWith(Z.value)) G = this._getOrReturnCtx(A, G), X2(G, {
          code: JB.invalid_string,
          validation: {
            startsWith: Z.value
          },
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "endsWith") {
        if (!A.data.endsWith(Z.value)) G = this._getOrReturnCtx(A, G), X2(G, {
          code: JB.invalid_string,
          validation: {
            endsWith: Z.value
          },
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "datetime") {
        if (!mHB(Z).test(A.data)) G = this._getOrReturnCtx(A, G), X2(G, {
          code: JB.invalid_string,
          validation: "datetime",
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "date") {
        if (!I78.test(A.data)) G = this._getOrReturnCtx(A, G), X2(G, {
          code: JB.invalid_string,
          validation: "date",
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "time") {
        if (!D78(Z).test(A.data)) G = this._getOrReturnCtx(A, G), X2(G, {
          code: JB.invalid_string,
          validation: "time",
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "duration") {
        if (!e58.test(A.data)) G = this._getOrReturnCtx(A, G), X2(G, {
          validation: "duration",
          code: JB.invalid_string,
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "ip") {
        if (!W78(A.data, Z.version)) G = this._getOrReturnCtx(A, G), X2(G, {
          validation: "ip",
          code: JB.invalid_string,
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "jwt") {
        if (!K78(A.data, Z.alg)) G = this._getOrReturnCtx(A, G), X2(G, {
          validation: "jwt",
          code: JB.invalid_string,
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "cidr") {
        if (!V78(A.data, Z.version)) G = this._getOrReturnCtx(A, G), X2(G, {
          validation: "cidr",
          code: JB.invalid_string,
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "base64") {
        if (!J78.test(A.data)) G = this._getOrReturnCtx(A, G), X2(G, {
          validation: "base64",
          code: JB.invalid_string,
          message: Z.message
        }), B.dirty()
      } else if (Z.kind === "base64url") {
        if (!X78.test(A.data)) G = this._getOrReturnCtx(A, G), X2(G, {
          validation: "base64url",
          code: JB.invalid_string,
          message: Z.message
        }), B.dirty()
      } else G5.assertNever(Z);
      return {
        status: B.value,
        value: A.data
      }
    }
    _regex(A, Q, B) {
      return this.refinement((G) => A.test(G), {
        validation: Q,
        code: JB.invalid_string,
        ...H9.errToObj(B)
      })
    }
    _addCheck(A) {
      return new VP({
        ...this._def,
        checks: [...this._def.checks, A]
      })
    }
    email(A) {
      return this._addCheck({
        kind: "email",
        ...H9.errToObj(A)
      })
    }
    url(A) {
      return this._addCheck({
        kind: "url",
        ...H9.errToObj(A)
      })
    }
    emoji(A) {
      return this._addCheck({
        kind: "emoji",
        ...H9.errToObj(A)
      })
    }
    uuid(A) {
      return this._addCheck({
        kind: "uuid",
        ...H9.errToObj(A)
      })
    }
    nanoid(A) {
      return this._addCheck({
        kind: "nanoid",
        ...H9.errToObj(A)
      })
    }
    cuid(A) {
      return this._addCheck({
        kind: "cuid",
        ...H9.errToObj(A)
      })
    }
    cuid2(A) {
      return this._addCheck({
        kind: "cuid2",
        ...H9.errToObj(A)
      })
    }
    ulid(A) {
      return this._addCheck({
        kind: "ulid",
        ...H9.errToObj(A)
      })
    }
    base64(A) {
      return this._addCheck({
        kind: "base64",
        ...H9.errToObj(A)
      })
    }
    base64url(A) {
      return this._addCheck({
        kind: "base64url",
        ...H9.errToObj(A)
      })
    }
    jwt(A) {
      return this._addCheck({
        kind: "jwt",
        ...H9.errToObj(A)
      })
    }
    ip(A) {
      return this._addCheck({
        kind: "ip",
        ...H9.errToObj(A)
      })
    }
    cidr(A) {
      return this._addCheck({
        kind: "cidr",
        ...H9.errToObj(A)
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
        ...H9.errToObj(A?.message)
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
        ...H9.errToObj(A?.message)
      })
    }
    duration(A) {
      return this._addCheck({
        kind: "duration",
        ...H9.errToObj(A)
      })
    }
    regex(A, Q) {
      return this._addCheck({
        kind: "regex",
        regex: A,
        ...H9.errToObj(Q)
      })
    }
    includes(A, Q) {
      return this._addCheck({
        kind: "includes",
        value: A,
        position: Q?.position,
        ...H9.errToObj(Q?.message)
      })
    }
    startsWith(A, Q) {
      return this._addCheck({
        kind: "startsWith",
        value: A,
        ...H9.errToObj(Q)
      })
    }
    endsWith(A, Q) {
      return this._addCheck({
        kind: "endsWith",
        value: A,
        ...H9.errToObj(Q)
      })
    }
    min(A, Q) {
      return this._addCheck({
        kind: "min",
        value: A,
        ...H9.errToObj(Q)
      })
    }
    max(A, Q) {
      return this._addCheck({
        kind: "max",
        value: A,
        ...H9.errToObj(Q)
      })
    }
    length(A, Q) {
      return this._addCheck({
        kind: "length",
        value: A,
        ...H9.errToObj(Q)
      })
    }
    nonempty(A) {
      return this.min(1, H9.errToObj(A))
    }
    trim() {
      return new VP({
        ...this._def,
        checks: [...this._def.checks, {
          kind: "trim"
        }]
      })
    }
    toLowerCase() {
      return new VP({
        ...this._def,
        checks: [...this._def.checks, {
          kind: "toLowerCase"
        }]
      })
    }
    toUpperCase() {
      return new VP({
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
      for (let Q of this._def.checks)
        if (Q.kind === "min") {
          if (A === null || Q.value > A) A = Q.value
        } return A
    }
    get maxLength() {
      let A = null;
      for (let Q of this._def.checks)
        if (Q.kind === "max") {
          if (A === null || Q.value < A) A = Q.value
        } return A
    }
  };
  VP.create = (A) => {
    return new VP({
      checks: [],
      typeName: e4.ZodString,
      coerce: A?.coerce ?? !1,
      ...b3(A)
    })
  };
  Ea = class Ea extends L8 {
    constructor() {
      super(...arguments);
      this.min = this.gte, this.max = this.lte, this.step = this.multipleOf
    }
    _parse(A) {
      if (this._def.coerce) A.data = Number(A.data);
      if (this._getType(A) !== fB.number) {
        let Z = this._getOrReturnCtx(A);
        return X2(Z, {
          code: JB.invalid_type,
          expected: fB.number,
          received: Z.parsedType
        }), T4
      }
      let B = void 0,
        G = new fH;
      for (let Z of this._def.checks)
        if (Z.kind === "int") {
          if (!G5.isInteger(A.data)) B = this._getOrReturnCtx(A, B), X2(B, {
            code: JB.invalid_type,
            expected: "integer",
            received: "float",
            message: Z.message
          }), G.dirty()
        } else if (Z.kind === "min") {
        if (Z.inclusive ? A.data < Z.value : A.data <= Z.value) B = this._getOrReturnCtx(A, B), X2(B, {
          code: JB.too_small,
          minimum: Z.value,
          type: "number",
          inclusive: Z.inclusive,
          exact: !1,
          message: Z.message
        }), G.dirty()
      } else if (Z.kind === "max") {
        if (Z.inclusive ? A.data > Z.value : A.data >= Z.value) B = this._getOrReturnCtx(A, B), X2(B, {
          code: JB.too_big,
          maximum: Z.value,
          type: "number",
          inclusive: Z.inclusive,
          exact: !1,
          message: Z.message
        }), G.dirty()
      } else if (Z.kind === "multipleOf") {
        if (F78(A.data, Z.value) !== 0) B = this._getOrReturnCtx(A, B), X2(B, {
          code: JB.not_multiple_of,
          multipleOf: Z.value,
          message: Z.message
        }), G.dirty()
      } else if (Z.kind === "finite") {
        if (!Number.isFinite(A.data)) B = this._getOrReturnCtx(A, B), X2(B, {
          code: JB.not_finite,
          message: Z.message
        }), G.dirty()
      } else G5.assertNever(Z);
      return {
        status: G.value,
        value: A.data
      }
    }
    gte(A, Q) {
      return this.setLimit("min", A, !0, H9.toString(Q))
    }
    gt(A, Q) {
      return this.setLimit("min", A, !1, H9.toString(Q))
    }
    lte(A, Q) {
      return this.setLimit("max", A, !0, H9.toString(Q))
    }
    lt(A, Q) {
      return this.setLimit("max", A, !1, H9.toString(Q))
    }
    setLimit(A, Q, B, G) {
      return new Ea({
        ...this._def,
        checks: [...this._def.checks, {
          kind: A,
          value: Q,
          inclusive: B,
          message: H9.toString(G)
        }]
      })
    }
    _addCheck(A) {
      return new Ea({
        ...this._def,
        checks: [...this._def.checks, A]
      })
    }
    int(A) {
      return this._addCheck({
        kind: "int",
        message: H9.toString(A)
      })
    }
    positive(A) {
      return this._addCheck({
        kind: "min",
        value: 0,
        inclusive: !1,
        message: H9.toString(A)
      })
    }
    negative(A) {
      return this._addCheck({
        kind: "max",
        value: 0,
        inclusive: !1,
        message: H9.toString(A)
      })
    }
    nonpositive(A) {
      return this._addCheck({
        kind: "max",
        value: 0,
        inclusive: !0,
        message: H9.toString(A)
      })
    }
    nonnegative(A) {
      return this._addCheck({
        kind: "min",
        value: 0,
        inclusive: !0,
        message: H9.toString(A)
      })
    }
    multipleOf(A, Q) {
      return this._addCheck({
        kind: "multipleOf",
        value: A,
        message: H9.toString(Q)
      })
    }
    finite(A) {
      return this._addCheck({
        kind: "finite",
        message: H9.toString(A)
      })
    }
    safe(A) {
      return this._addCheck({
        kind: "min",
        inclusive: !0,
        value: Number.MIN_SAFE_INTEGER,
        message: H9.toString(A)
      })._addCheck({
        kind: "max",
        inclusive: !0,
        value: Number.MAX_SAFE_INTEGER,
        message: H9.toString(A)
      })
    }
    get minValue() {
      let A = null;
      for (let Q of this._def.checks)
        if (Q.kind === "min") {
          if (A === null || Q.value > A) A = Q.value
        } return A
    }
    get maxValue() {
      let A = null;
      for (let Q of this._def.checks)
        if (Q.kind === "max") {
          if (A === null || Q.value < A) A = Q.value
        } return A
    }
    get isInt() {
      return !!this._def.checks.find((A) => A.kind === "int" || A.kind === "multipleOf" && G5.isInteger(A.value))
    }
    get isFinite() {
      let A = null,
        Q = null;
      for (let B of this._def.checks)
        if (B.kind === "finite" || B.kind === "int" || B.kind === "multipleOf") return !0;
        else if (B.kind === "min") {
        if (Q === null || B.value > Q) Q = B.value
      } else if (B.kind === "max") {
        if (A === null || B.value < A) A = B.value
      }
      return Number.isFinite(Q) && Number.isFinite(A)
    }
  };
  Ea.create = (A) => {
    return new Ea({
      checks: [],
      typeName: e4.ZodNumber,
      coerce: A?.coerce || !1,
      ...b3(A)
    })
  };
  za = class za extends L8 {
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
      if (this._getType(A) !== fB.bigint) return this._getInvalidInput(A);
      let B = void 0,
        G = new fH;
      for (let Z of this._def.checks)
        if (Z.kind === "min") {
          if (Z.inclusive ? A.data < Z.value : A.data <= Z.value) B = this._getOrReturnCtx(A, B), X2(B, {
            code: JB.too_small,
            type: "bigint",
            minimum: Z.value,
            inclusive: Z.inclusive,
            message: Z.message
          }), G.dirty()
        } else if (Z.kind === "max") {
        if (Z.inclusive ? A.data > Z.value : A.data >= Z.value) B = this._getOrReturnCtx(A, B), X2(B, {
          code: JB.too_big,
          type: "bigint",
          maximum: Z.value,
          inclusive: Z.inclusive,
          message: Z.message
        }), G.dirty()
      } else if (Z.kind === "multipleOf") {
        if (A.data % Z.value !== BigInt(0)) B = this._getOrReturnCtx(A, B), X2(B, {
          code: JB.not_multiple_of,
          multipleOf: Z.value,
          message: Z.message
        }), G.dirty()
      } else G5.assertNever(Z);
      return {
        status: G.value,
        value: A.data
      }
    }
    _getInvalidInput(A) {
      let Q = this._getOrReturnCtx(A);
      return X2(Q, {
        code: JB.invalid_type,
        expected: fB.bigint,
        received: Q.parsedType
      }), T4
    }
    gte(A, Q) {
      return this.setLimit("min", A, !0, H9.toString(Q))
    }
    gt(A, Q) {
      return this.setLimit("min", A, !1, H9.toString(Q))
    }
    lte(A, Q) {
      return this.setLimit("max", A, !0, H9.toString(Q))
    }
    lt(A, Q) {
      return this.setLimit("max", A, !1, H9.toString(Q))
    }
    setLimit(A, Q, B, G) {
      return new za({
        ...this._def,
        checks: [...this._def.checks, {
          kind: A,
          value: Q,
          inclusive: B,
          message: H9.toString(G)
        }]
      })
    }
    _addCheck(A) {
      return new za({
        ...this._def,
        checks: [...this._def.checks, A]
      })
    }
    positive(A) {
      return this._addCheck({
        kind: "min",
        value: BigInt(0),
        inclusive: !1,
        message: H9.toString(A)
      })
    }
    negative(A) {
      return this._addCheck({
        kind: "max",
        value: BigInt(0),
        inclusive: !1,
        message: H9.toString(A)
      })
    }
    nonpositive(A) {
      return this._addCheck({
        kind: "max",
        value: BigInt(0),
        inclusive: !0,
        message: H9.toString(A)
      })
    }
    nonnegative(A) {
      return this._addCheck({
        kind: "min",
        value: BigInt(0),
        inclusive: !0,
        message: H9.toString(A)
      })
    }
    multipleOf(A, Q) {
      return this._addCheck({
        kind: "multipleOf",
        value: A,
        message: H9.toString(Q)
      })
    }
    get minValue() {
      let A = null;
      for (let Q of this._def.checks)
        if (Q.kind === "min") {
          if (A === null || Q.value > A) A = Q.value
        } return A
    }
    get maxValue() {
      let A = null;
      for (let Q of this._def.checks)
        if (Q.kind === "max") {
          if (A === null || Q.value < A) A = Q.value
        } return A
    }
  };
  za.create = (A) => {
    return new za({
      checks: [],
      typeName: e4.ZodBigInt,
      coerce: A?.coerce ?? !1,
      ...b3(A)
    })
  };
  pXA = class pXA extends L8 {
    _parse(A) {
      if (this._def.coerce) A.data = Boolean(A.data);
      if (this._getType(A) !== fB.boolean) {
        let B = this._getOrReturnCtx(A);
        return X2(B, {
          code: JB.invalid_type,
          expected: fB.boolean,
          received: B.parsedType
        }), T4
      }
      return Rz(A.data)
    }
  };
  pXA.create = (A) => {
    return new pXA({
      typeName: e4.ZodBoolean,
      coerce: A?.coerce || !1,
      ...b3(A)
    })
  };
  ZBA = class ZBA extends L8 {
    _parse(A) {
      if (this._def.coerce) A.data = new Date(A.data);
      if (this._getType(A) !== fB.date) {
        let Z = this._getOrReturnCtx(A);
        return X2(Z, {
          code: JB.invalid_type,
          expected: fB.date,
          received: Z.parsedType
        }), T4
      }
      if (Number.isNaN(A.data.getTime())) {
        let Z = this._getOrReturnCtx(A);
        return X2(Z, {
          code: JB.invalid_date
        }), T4
      }
      let B = new fH,
        G = void 0;
      for (let Z of this._def.checks)
        if (Z.kind === "min") {
          if (A.data.getTime() < Z.value) G = this._getOrReturnCtx(A, G), X2(G, {
            code: JB.too_small,
            message: Z.message,
            inclusive: !0,
            exact: !1,
            minimum: Z.value,
            type: "date"
          }), B.dirty()
        } else if (Z.kind === "max") {
        if (A.data.getTime() > Z.value) G = this._getOrReturnCtx(A, G), X2(G, {
          code: JB.too_big,
          message: Z.message,
          inclusive: !0,
          exact: !1,
          maximum: Z.value,
          type: "date"
        }), B.dirty()
      } else G5.assertNever(Z);
      return {
        status: B.value,
        value: new Date(A.data.getTime())
      }
    }
    _addCheck(A) {
      return new ZBA({
        ...this._def,
        checks: [...this._def.checks, A]
      })
    }
    min(A, Q) {
      return this._addCheck({
        kind: "min",
        value: A.getTime(),
        message: H9.toString(Q)
      })
    }
    max(A, Q) {
      return this._addCheck({
        kind: "max",
        value: A.getTime(),
        message: H9.toString(Q)
      })
    }
    get minDate() {
      let A = null;
      for (let Q of this._def.checks)
        if (Q.kind === "min") {
          if (A === null || Q.value > A) A = Q.value
        } return A != null ? new Date(A) : null
    }
    get maxDate() {
      let A = null;
      for (let Q of this._def.checks)
        if (Q.kind === "max") {
          if (A === null || Q.value < A) A = Q.value
        } return A != null ? new Date(A) : null
    }
  };
  ZBA.create = (A) => {
    return new ZBA({
      checks: [],
      coerce: A?.coerce || !1,
      typeName: e4.ZodDate,
      ...b3(A)
    })
  };
  rMA = class rMA extends L8 {
    _parse(A) {
      if (this._getType(A) !== fB.symbol) {
        let B = this._getOrReturnCtx(A);
        return X2(B, {
          code: JB.invalid_type,
          expected: fB.symbol,
          received: B.parsedType
        }), T4
      }
      return Rz(A.data)
    }
  };
  rMA.create = (A) => {
    return new rMA({
      typeName: e4.ZodSymbol,
      ...b3(A)
    })
  };
  lXA = class lXA extends L8 {
    _parse(A) {
      if (this._getType(A) !== fB.undefined) {
        let B = this._getOrReturnCtx(A);
        return X2(B, {
          code: JB.invalid_type,
          expected: fB.undefined,
          received: B.parsedType
        }), T4
      }
      return Rz(A.data)
    }
  };
  lXA.create = (A) => {
    return new lXA({
      typeName: e4.ZodUndefined,
      ...b3(A)
    })
  };
  iXA = class iXA extends L8 {
    _parse(A) {
      if (this._getType(A) !== fB.null) {
        let B = this._getOrReturnCtx(A);
        return X2(B, {
          code: JB.invalid_type,
          expected: fB.null,
          received: B.parsedType
        }), T4
      }
      return Rz(A.data)
    }
  };
  iXA.create = (A) => {
    return new iXA({
      typeName: e4.ZodNull,
      ...b3(A)
    })
  };
  YBA = class YBA extends L8 {
    constructor() {
      super(...arguments);
      this._any = !0
    }
    _parse(A) {
      return Rz(A.data)
    }
  };
  YBA.create = (A) => {
    return new YBA({
      typeName: e4.ZodAny,
      ...b3(A)
    })
  };
  Ha = class Ha extends L8 {
    constructor() {
      super(...arguments);
      this._unknown = !0
    }
    _parse(A) {
      return Rz(A.data)
    }
  };
  Ha.create = (A) => {
    return new Ha({
      typeName: e4.ZodUnknown,
      ...b3(A)
    })
  };
  Fk = class Fk extends L8 {
    _parse(A) {
      let Q = this._getOrReturnCtx(A);
      return X2(Q, {
        code: JB.invalid_type,
        expected: fB.never,
        received: Q.parsedType
      }), T4
    }
  };
  Fk.create = (A) => {
    return new Fk({
      typeName: e4.ZodNever,
      ...b3(A)
    })
  };
  sMA = class sMA extends L8 {
    _parse(A) {
      if (this._getType(A) !== fB.undefined) {
        let B = this._getOrReturnCtx(A);
        return X2(B, {
          code: JB.invalid_type,
          expected: fB.void,
          received: B.parsedType
        }), T4
      }
      return Rz(A.data)
    }
  };
  sMA.create = (A) => {
    return new sMA({
      typeName: e4.ZodVoid,
      ...b3(A)
    })
  };
  FP = class FP extends L8 {
    _parse(A) {
      let {
        ctx: Q,
        status: B
      } = this._processInputParams(A), G = this._def;
      if (Q.parsedType !== fB.array) return X2(Q, {
        code: JB.invalid_type,
        expected: fB.array,
        received: Q.parsedType
      }), T4;
      if (G.exactLength !== null) {
        let Y = Q.data.length > G.exactLength.value,
          J = Q.data.length < G.exactLength.value;
        if (Y || J) X2(Q, {
          code: Y ? JB.too_big : JB.too_small,
          minimum: J ? G.exactLength.value : void 0,
          maximum: Y ? G.exactLength.value : void 0,
          type: "array",
          inclusive: !0,
          exact: !0,
          message: G.exactLength.message
        }), B.dirty()
      }
      if (G.minLength !== null) {
        if (Q.data.length < G.minLength.value) X2(Q, {
          code: JB.too_small,
          minimum: G.minLength.value,
          type: "array",
          inclusive: !0,
          exact: !1,
          message: G.minLength.message
        }), B.dirty()
      }
      if (G.maxLength !== null) {
        if (Q.data.length > G.maxLength.value) X2(Q, {
          code: JB.too_big,
          maximum: G.maxLength.value,
          type: "array",
          inclusive: !0,
          exact: !1,
          message: G.maxLength.message
        }), B.dirty()
      }
      if (Q.common.async) return Promise.all([...Q.data].map((Y, J) => {
        return G.type._parseAsync(new EP(Q, Y, Q.path, J))
      })).then((Y) => {
        return fH.mergeArray(B, Y)
      });
      let Z = [...Q.data].map((Y, J) => {
        return G.type._parseSync(new EP(Q, Y, Q.path, J))
      });
      return fH.mergeArray(B, Z)
    }
    get element() {
      return this._def.type
    }
    min(A, Q) {
      return new FP({
        ...this._def,
        minLength: {
          value: A,
          message: H9.toString(Q)
        }
      })
    }
    max(A, Q) {
      return new FP({
        ...this._def,
        maxLength: {
          value: A,
          message: H9.toString(Q)
        }
      })
    }
    length(A, Q) {
      return new FP({
        ...this._def,
        exactLength: {
          value: A,
          message: H9.toString(Q)
        }
      })
    }
    nonempty(A) {
      return this.min(1, A)
    }
  };
  FP.create = (A, Q) => {
    return new FP({
      type: A,
      minLength: null,
      maxLength: null,
      exactLength: null,
      typeName: e4.ZodArray,
      ...b3(Q)
    })
  };
  JI = class JI extends L8 {
    constructor() {
      super(...arguments);
      this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend
    }
    _getCached() {
      if (this._cached !== null) return this._cached;
      let A = this._def.shape(),
        Q = G5.objectKeys(A);
      return this._cached = {
        shape: A,
        keys: Q
      }, this._cached
    }
    _parse(A) {
      if (this._getType(A) !== fB.object) {
        let I = this._getOrReturnCtx(A);
        return X2(I, {
          code: JB.invalid_type,
          expected: fB.object,
          received: I.parsedType
        }), T4
      }
      let {
        status: B,
        ctx: G
      } = this._processInputParams(A), {
        shape: Z,
        keys: Y
      } = this._getCached(), J = [];
      if (!(this._def.catchall instanceof Fk && this._def.unknownKeys === "strip")) {
        for (let I in G.data)
          if (!Y.includes(I)) J.push(I)
      }
      let X = [];
      for (let I of Y) {
        let D = Z[I],
          W = G.data[I];
        X.push({
          key: {
            status: "valid",
            value: I
          },
          value: D._parse(new EP(G, W, G.path, I)),
          alwaysSet: I in G.data
        })
      }
      if (this._def.catchall instanceof Fk) {
        let I = this._def.unknownKeys;
        if (I === "passthrough")
          for (let D of J) X.push({
            key: {
              status: "valid",
              value: D
            },
            value: {
              status: "valid",
              value: G.data[D]
            }
          });
        else if (I === "strict") {
          if (J.length > 0) X2(G, {
            code: JB.unrecognized_keys,
            keys: J
          }), B.dirty()
        } else if (I === "strip");
        else throw Error("Internal ZodObject error: invalid unknownKeys value.")
      } else {
        let I = this._def.catchall;
        for (let D of J) {
          let W = G.data[D];
          X.push({
            key: {
              status: "valid",
              value: D
            },
            value: I._parse(new EP(G, W, G.path, D)),
            alwaysSet: D in G.data
          })
        }
      }
      if (G.common.async) return Promise.resolve().then(async () => {
        let I = [];
        for (let D of X) {
          let W = await D.key,
            K = await D.value;
          I.push({
            key: W,
            value: K,
            alwaysSet: D.alwaysSet
          })
        }
        return I
      }).then((I) => {
        return fH.mergeObjectSync(B, I)
      });
      else return fH.mergeObjectSync(B, X)
    }
    get shape() {
      return this._def.shape()
    }
    strict(A) {
      return H9.errToObj, new JI({
        ...this._def,
        unknownKeys: "strict",
        ...A !== void 0 ? {
          errorMap: (Q, B) => {
            let G = this._def.errorMap?.(Q, B).message ?? B.defaultError;
            if (Q.code === "unrecognized_keys") return {
              message: H9.errToObj(A).message ?? G
            };
            return {
              message: G
            }
          }
        } : {}
      })
    }
    strip() {
      return new JI({
        ...this._def,
        unknownKeys: "strip"
      })
    }
    passthrough() {
      return new JI({
        ...this._def,
        unknownKeys: "passthrough"
      })
    }
    extend(A) {
      return new JI({
        ...this._def,
        shape: () => ({
          ...this._def.shape(),
          ...A
        })
      })
    }
    merge(A) {
      return new JI({
        unknownKeys: A._def.unknownKeys,
        catchall: A._def.catchall,
        shape: () => ({
          ...this._def.shape(),
          ...A._def.shape()
        }),
        typeName: e4.ZodObject
      })
    }
    setKey(A, Q) {
      return this.augment({
        [A]: Q
      })
    }
    catchall(A) {
      return new JI({
        ...this._def,
        catchall: A
      })
    }
    pick(A) {
      let Q = {};
      for (let B of G5.objectKeys(A))
        if (A[B] && this.shape[B]) Q[B] = this.shape[B];
      return new JI({
        ...this._def,
        shape: () => Q
      })
    }
    omit(A) {
      let Q = {};
      for (let B of G5.objectKeys(this.shape))
        if (!A[B]) Q[B] = this.shape[B];
      return new JI({
        ...this._def,
        shape: () => Q
      })
    }
    deepPartial() {
      return dXA(this)
    }
    partial(A) {
      let Q = {};
      for (let B of G5.objectKeys(this.shape)) {
        let G = this.shape[B];
        if (A && !A[B]) Q[B] = G;
        else Q[B] = G.optional()
      }
      return new JI({
        ...this._def,
        shape: () => Q
      })
    }
    required(A) {
      let Q = {};
      for (let B of G5.objectKeys(this.shape))
        if (A && !A[B]) Q[B] = this.shape[B];
        else {
          let Z = this.shape[B];
          while (Z instanceof HP) Z = Z._def.innerType;
          Q[B] = Z
        } return new JI({
        ...this._def,
        shape: () => Q
      })
    }
    keyof() {
      return dHB(G5.objectKeys(this.shape))
    }
  };
  JI.create = (A, Q) => {
    return new JI({
      shape: () => A,
      unknownKeys: "strip",
      catchall: Fk.create(),
      typeName: e4.ZodObject,
      ...b3(Q)
    })
  };
  JI.strictCreate = (A, Q) => {
    return new JI({
      shape: () => A,
      unknownKeys: "strict",
      catchall: Fk.create(),
      typeName: e4.ZodObject,
      ...b3(Q)
    })
  };
  JI.lazycreate = (A, Q) => {
    return new JI({
      shape: A,
      unknownKeys: "strip",
      catchall: Fk.create(),
      typeName: e4.ZodObject,
      ...b3(Q)
    })
  };
  nXA = class nXA extends L8 {
    _parse(A) {
      let {
        ctx: Q
      } = this._processInputParams(A), B = this._def.options;

      function G(Z) {
        for (let J of Z)
          if (J.result.status === "valid") return J.result;
        for (let J of Z)
          if (J.result.status === "dirty") return Q.common.issues.push(...J.ctx.common.issues), J.result;
        let Y = Z.map((J) => new oq(J.ctx.common.issues));
        return X2(Q, {
          code: JB.invalid_union,
          unionErrors: Y
        }), T4
      }
      if (Q.common.async) return Promise.all(B.map(async (Z) => {
        let Y = {
          ...Q,
          common: {
            ...Q.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await Z._parseAsync({
            data: Q.data,
            path: Q.path,
            parent: Y
          }),
          ctx: Y
        }
      })).then(G);
      else {
        let Z = void 0,
          Y = [];
        for (let X of B) {
          let I = {
              ...Q,
              common: {
                ...Q.common,
                issues: []
              },
              parent: null
            },
            D = X._parseSync({
              data: Q.data,
              path: Q.path,
              parent: I
            });
          if (D.status === "valid") return D;
          else if (D.status === "dirty" && !Z) Z = {
            result: D,
            ctx: I
          };
          if (I.common.issues.length) Y.push(I.common.issues)
        }
        if (Z) return Q.common.issues.push(...Z.ctx.common.issues), Z.result;
        let J = Y.map((X) => new oq(X));
        return X2(Q, {
          code: JB.invalid_union,
          unionErrors: J
        }), T4
      }
    }
    get options() {
      return this._def.options
    }
  };
  nXA.create = (A, Q) => {
    return new nXA({
      options: A,
      typeName: e4.ZodUnion,
      ...b3(Q)
    })
  };
  k01 = class k01 extends L8 {
    _parse(A) {
      let {
        ctx: Q
      } = this._processInputParams(A);
      if (Q.parsedType !== fB.object) return X2(Q, {
        code: JB.invalid_type,
        expected: fB.object,
        received: Q.parsedType
      }), T4;
      let B = this.discriminator,
        G = Q.data[B],
        Z = this.optionsMap.get(G);
      if (!Z) return X2(Q, {
        code: JB.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [B]
      }), T4;
      if (Q.common.async) return Z._parseAsync({
        data: Q.data,
        path: Q.path,
        parent: Q
      });
      else return Z._parseSync({
        data: Q.data,
        path: Q.path,
        parent: Q
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
    static create(A, Q, B) {
      let G = new Map;
      for (let Z of Q) {
        let Y = cu(Z.shape[A]);
        if (!Y.length) throw Error(`A discriminator value for key \`${A}\` could not be extracted from all schema options`);
        for (let J of Y) {
          if (G.has(J)) throw Error(`Discriminator property ${String(A)} has duplicate value ${String(J)}`);
          G.set(J, Z)
        }
      }
      return new k01({
        typeName: e4.ZodDiscriminatedUnion,
        discriminator: A,
        options: Q,
        optionsMap: G,
        ...b3(B)
      })
    }
  };
  aXA = class aXA extends L8 {
    _parse(A) {
      let {
        status: Q,
        ctx: B
      } = this._processInputParams(A), G = (Z, Y) => {
        if (y01(Z) || y01(Y)) return T4;
        let J = Mr1(Z.value, Y.value);
        if (!J.valid) return X2(B, {
          code: JB.invalid_intersection_types
        }), T4;
        if (v01(Z) || v01(Y)) Q.dirty();
        return {
          status: Q.value,
          value: J.data
        }
      };
      if (B.common.async) return Promise.all([this._def.left._parseAsync({
        data: B.data,
        path: B.path,
        parent: B
      }), this._def.right._parseAsync({
        data: B.data,
        path: B.path,
        parent: B
      })]).then(([Z, Y]) => G(Z, Y));
      else return G(this._def.left._parseSync({
        data: B.data,
        path: B.path,
        parent: B
      }), this._def.right._parseSync({
        data: B.data,
        path: B.path,
        parent: B
      }))
    }
  };
  aXA.create = (A, Q, B) => {
    return new aXA({
      left: A,
      right: Q,
      typeName: e4.ZodIntersection,
      ...b3(B)
    })
  };
  Hk = class Hk extends L8 {
    _parse(A) {
      let {
        status: Q,
        ctx: B
      } = this._processInputParams(A);
      if (B.parsedType !== fB.array) return X2(B, {
        code: JB.invalid_type,
        expected: fB.array,
        received: B.parsedType
      }), T4;
      if (B.data.length < this._def.items.length) return X2(B, {
        code: JB.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), T4;
      if (!this._def.rest && B.data.length > this._def.items.length) X2(B, {
        code: JB.too_big,
        maximum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), Q.dirty();
      let Z = [...B.data].map((Y, J) => {
        let X = this._def.items[J] || this._def.rest;
        if (!X) return null;
        return X._parse(new EP(B, Y, B.path, J))
      }).filter((Y) => !!Y);
      if (B.common.async) return Promise.all(Z).then((Y) => {
        return fH.mergeArray(Q, Y)
      });
      else return fH.mergeArray(Q, Z)
    }
    get items() {
      return this._def.items
    }
    rest(A) {
      return new Hk({
        ...this._def,
        rest: A
      })
    }
  };
  Hk.create = (A, Q) => {
    if (!Array.isArray(A)) throw Error("You must pass an array of schemas to z.tuple([ ... ])");
    return new Hk({
      items: A,
      typeName: e4.ZodTuple,
      rest: null,
      ...b3(Q)
    })
  };
  tMA = class tMA extends L8 {
    get keySchema() {
      return this._def.keyType
    }
    get valueSchema() {
      return this._def.valueType
    }
    _parse(A) {
      let {
        status: Q,
        ctx: B
      } = this._processInputParams(A);
      if (B.parsedType !== fB.object) return X2(B, {
        code: JB.invalid_type,
        expected: fB.object,
        received: B.parsedType
      }), T4;
      let G = [],
        Z = this._def.keyType,
        Y = this._def.valueType;
      for (let J in B.data) G.push({
        key: Z._parse(new EP(B, J, B.path, J)),
        value: Y._parse(new EP(B, B.data[J], B.path, J)),
        alwaysSet: J in B.data
      });
      if (B.common.async) return fH.mergeObjectAsync(Q, G);
      else return fH.mergeObjectSync(Q, G)
    }
    get element() {
      return this._def.valueType
    }
    static create(A, Q, B) {
      if (Q instanceof L8) return new tMA({
        keyType: A,
        valueType: Q,
        typeName: e4.ZodRecord,
        ...b3(B)
      });
      return new tMA({
        keyType: VP.create(),
        valueType: A,
        typeName: e4.ZodRecord,
        ...b3(Q)
      })
    }
  };
  eMA = class eMA extends L8 {
    get keySchema() {
      return this._def.keyType
    }
    get valueSchema() {
      return this._def.valueType
    }
    _parse(A) {
      let {
        status: Q,
        ctx: B
      } = this._processInputParams(A);
      if (B.parsedType !== fB.map) return X2(B, {
        code: JB.invalid_type,
        expected: fB.map,
        received: B.parsedType
      }), T4;
      let G = this._def.keyType,
        Z = this._def.valueType,
        Y = [...B.data.entries()].map(([J, X], I) => {
          return {
            key: G._parse(new EP(B, J, B.path, [I, "key"])),
            value: Z._parse(new EP(B, X, B.path, [I, "value"]))
          }
        });
      if (B.common.async) {
        let J = new Map;
        return Promise.resolve().then(async () => {
          for (let X of Y) {
            let I = await X.key,
              D = await X.value;
            if (I.status === "aborted" || D.status === "aborted") return T4;
            if (I.status === "dirty" || D.status === "dirty") Q.dirty();
            J.set(I.value, D.value)
          }
          return {
            status: Q.value,
            value: J
          }
        })
      } else {
        let J = new Map;
        for (let X of Y) {
          let {
            key: I,
            value: D
          } = X;
          if (I.status === "aborted" || D.status === "aborted") return T4;
          if (I.status === "dirty" || D.status === "dirty") Q.dirty();
          J.set(I.value, D.value)
        }
        return {
          status: Q.value,
          value: J
        }
      }
    }
  };
  eMA.create = (A, Q, B) => {
    return new eMA({
      valueType: Q,
      keyType: A,
      typeName: e4.ZodMap,
      ...b3(B)
    })
  };
  JBA = class JBA extends L8 {
    _parse(A) {
      let {
        status: Q,
        ctx: B
      } = this._processInputParams(A);
      if (B.parsedType !== fB.set) return X2(B, {
        code: JB.invalid_type,
        expected: fB.set,
        received: B.parsedType
      }), T4;
      let G = this._def;
      if (G.minSize !== null) {
        if (B.data.size < G.minSize.value) X2(B, {
          code: JB.too_small,
          minimum: G.minSize.value,
          type: "set",
          inclusive: !0,
          exact: !1,
          message: G.minSize.message
        }), Q.dirty()
      }
      if (G.maxSize !== null) {
        if (B.data.size > G.maxSize.value) X2(B, {
          code: JB.too_big,
          maximum: G.maxSize.value,
          type: "set",
          inclusive: !0,
          exact: !1,
          message: G.maxSize.message
        }), Q.dirty()
      }
      let Z = this._def.valueType;

      function Y(X) {
        let I = new Set;
        for (let D of X) {
          if (D.status === "aborted") return T4;
          if (D.status === "dirty") Q.dirty();
          I.add(D.value)
        }
        return {
          status: Q.value,
          value: I
        }
      }
      let J = [...B.data.values()].map((X, I) => Z._parse(new EP(B, X, B.path, I)));
      if (B.common.async) return Promise.all(J).then((X) => Y(X));
      else return Y(J)
    }
    min(A, Q) {
      return new JBA({
        ...this._def,
        minSize: {
          value: A,
          message: H9.toString(Q)
        }
      })
    }
    max(A, Q) {
      return new JBA({
        ...this._def,
        maxSize: {
          value: A,
          message: H9.toString(Q)
        }
      })
    }
    size(A, Q) {
      return this.min(A, Q).max(A, Q)
    }
    nonempty(A) {
      return this.min(1, A)
    }
  };
  JBA.create = (A, Q) => {
    return new JBA({
      valueType: A,
      minSize: null,
      maxSize: null,
      typeName: e4.ZodSet,
      ...b3(Q)
    })
  };
  cXA = class cXA extends L8 {
    constructor() {
      super(...arguments);
      this.validate = this.implement
    }
    _parse(A) {
      let {
        ctx: Q
      } = this._processInputParams(A);
      if (Q.parsedType !== fB.function) return X2(Q, {
        code: JB.invalid_type,
        expected: fB.function,
        received: Q.parsedType
      }), T4;

      function B(J, X) {
        return oMA({
          data: J,
          path: Q.path,
          errorMaps: [Q.common.contextualErrorMap, Q.schemaErrorMap, uXA(), du].filter((I) => !!I),
          issueData: {
            code: JB.invalid_arguments,
            argumentsError: X
          }
        })
      }

      function G(J, X) {
        return oMA({
          data: J,
          path: Q.path,
          errorMaps: [Q.common.contextualErrorMap, Q.schemaErrorMap, uXA(), du].filter((I) => !!I),
          issueData: {
            code: JB.invalid_return_type,
            returnTypeError: X
          }
        })
      }
      let Z = {
          errorMap: Q.common.contextualErrorMap
        },
        Y = Q.data;
      if (this._def.returns instanceof XBA) {
        let J = this;
        return Rz(async function (...X) {
          let I = new oq([]),
            D = await J._def.args.parseAsync(X, Z).catch((V) => {
              throw I.addIssue(B(X, V)), I
            }),
            W = await Reflect.apply(Y, this, D);
          return await J._def.returns._def.type.parseAsync(W, Z).catch((V) => {
            throw I.addIssue(G(W, V)), I
          })
        })
      } else {
        let J = this;
        return Rz(function (...X) {
          let I = J._def.args.safeParse(X, Z);
          if (!I.success) throw new oq([B(X, I.error)]);
          let D = Reflect.apply(Y, this, I.data),
            W = J._def.returns.safeParse(D, Z);
          if (!W.success) throw new oq([G(D, W.error)]);
          return W.data
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
      return new cXA({
        ...this._def,
        args: Hk.create(A).rest(Ha.create())
      })
    }
    returns(A) {
      return new cXA({
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
    static create(A, Q, B) {
      return new cXA({
        args: A ? A : Hk.create([]).rest(Ha.create()),
        returns: Q || Ha.create(),
        typeName: e4.ZodFunction,
        ...b3(B)
      })
    }
  };
  oXA = class oXA extends L8 {
    get schema() {
      return this._def.getter()
    }
    _parse(A) {
      let {
        ctx: Q
      } = this._processInputParams(A);
      return this._def.getter()._parse({
        data: Q.data,
        path: Q.path,
        parent: Q
      })
    }
  };
  oXA.create = (A, Q) => {
    return new oXA({
      getter: A,
      typeName: e4.ZodLazy,
      ...b3(Q)
    })
  };
  rXA = class rXA extends L8 {
    _parse(A) {
      if (A.data !== this._def.value) {
        let Q = this._getOrReturnCtx(A);
        return X2(Q, {
          received: Q.data,
          code: JB.invalid_literal,
          expected: this._def.value
        }), T4
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
  rXA.create = (A, Q) => {
    return new rXA({
      value: A,
      typeName: e4.ZodLiteral,
      ...b3(Q)
    })
  };
  $a = class $a extends L8 {
    _parse(A) {
      if (typeof A.data !== "string") {
        let Q = this._getOrReturnCtx(A),
          B = this._def.values;
        return X2(Q, {
          expected: G5.joinValues(B),
          received: Q.parsedType,
          code: JB.invalid_type
        }), T4
      }
      if (!this._cache) this._cache = new Set(this._def.values);
      if (!this._cache.has(A.data)) {
        let Q = this._getOrReturnCtx(A),
          B = this._def.values;
        return X2(Q, {
          received: Q.data,
          code: JB.invalid_enum_value,
          options: B
        }), T4
      }
      return Rz(A.data)
    }
    get options() {
      return this._def.values
    }
    get enum() {
      let A = {};
      for (let Q of this._def.values) A[Q] = Q;
      return A
    }
    get Values() {
      let A = {};
      for (let Q of this._def.values) A[Q] = Q;
      return A
    }
    get Enum() {
      let A = {};
      for (let Q of this._def.values) A[Q] = Q;
      return A
    }
    extract(A, Q = this._def) {
      return $a.create(A, {
        ...this._def,
        ...Q
      })
    }
    exclude(A, Q = this._def) {
      return $a.create(this.options.filter((B) => !A.includes(B)), {
        ...this._def,
        ...Q
      })
    }
  };
  $a.create = dHB;
  sXA = class sXA extends L8 {
    _parse(A) {
      let Q = G5.getValidEnumValues(this._def.values),
        B = this._getOrReturnCtx(A);
      if (B.parsedType !== fB.string && B.parsedType !== fB.number) {
        let G = G5.objectValues(Q);
        return X2(B, {
          expected: G5.joinValues(G),
          received: B.parsedType,
          code: JB.invalid_type
        }), T4
      }
      if (!this._cache) this._cache = new Set(G5.getValidEnumValues(this._def.values));
      if (!this._cache.has(A.data)) {
        let G = G5.objectValues(Q);
        return X2(B, {
          received: B.data,
          code: JB.invalid_enum_value,
          options: G
        }), T4
      }
      return Rz(A.data)
    }
    get enum() {
      return this._def.values
    }
  };
  sXA.create = (A, Q) => {
    return new sXA({
      values: A,
      typeName: e4.ZodNativeEnum,
      ...b3(Q)
    })
  };
  XBA = class XBA extends L8 {
    unwrap() {
      return this._def.type
    }
    _parse(A) {
      let {
        ctx: Q
      } = this._processInputParams(A);
      if (Q.parsedType !== fB.promise && Q.common.async === !1) return X2(Q, {
        code: JB.invalid_type,
        expected: fB.promise,
        received: Q.parsedType
      }), T4;
      let B = Q.parsedType === fB.promise ? Q.data : Promise.resolve(Q.data);
      return Rz(B.then((G) => {
        return this._def.type.parseAsync(G, {
          path: Q.path,
          errorMap: Q.common.contextualErrorMap
        })
      }))
    }
  };
  XBA.create = (A, Q) => {
    return new XBA({
      type: A,
      typeName: e4.ZodPromise,
      ...b3(Q)
    })
  };
  zP = class zP extends L8 {
    innerType() {
      return this._def.schema
    }
    sourceType() {
      return this._def.schema._def.typeName === e4.ZodEffects ? this._def.schema.sourceType() : this._def.schema
    }
    _parse(A) {
      let {
        status: Q,
        ctx: B
      } = this._processInputParams(A), G = this._def.effect || null, Z = {
        addIssue: (Y) => {
          if (X2(B, Y), Y.fatal) Q.abort();
          else Q.dirty()
        },
        get path() {
          return B.path
        }
      };
      if (Z.addIssue = Z.addIssue.bind(Z), G.type === "preprocess") {
        let Y = G.transform(B.data, Z);
        if (B.common.async) return Promise.resolve(Y).then(async (J) => {
          if (Q.value === "aborted") return T4;
          let X = await this._def.schema._parseAsync({
            data: J,
            path: B.path,
            parent: B
          });
          if (X.status === "aborted") return T4;
          if (X.status === "dirty") return GBA(X.value);
          if (Q.value === "dirty") return GBA(X.value);
          return X
        });
        else {
          if (Q.value === "aborted") return T4;
          let J = this._def.schema._parseSync({
            data: Y,
            path: B.path,
            parent: B
          });
          if (J.status === "aborted") return T4;
          if (J.status === "dirty") return GBA(J.value);
          if (Q.value === "dirty") return GBA(J.value);
          return J
        }
      }
      if (G.type === "refinement") {
        let Y = (J) => {
          let X = G.refinement(J, Z);
          if (B.common.async) return Promise.resolve(X);
          if (X instanceof Promise) throw Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
          return J
        };
        if (B.common.async === !1) {
          let J = this._def.schema._parseSync({
            data: B.data,
            path: B.path,
            parent: B
          });
          if (J.status === "aborted") return T4;
          if (J.status === "dirty") Q.dirty();
          return Y(J.value), {
            status: Q.value,
            value: J.value
          }
        } else return this._def.schema._parseAsync({
          data: B.data,
          path: B.path,
          parent: B
        }).then((J) => {
          if (J.status === "aborted") return T4;
          if (J.status === "dirty") Q.dirty();
          return Y(J.value).then(() => {
            return {
              status: Q.value,
              value: J.value
            }
          })
        })
      }
      if (G.type === "transform")
        if (B.common.async === !1) {
          let Y = this._def.schema._parseSync({
            data: B.data,
            path: B.path,
            parent: B
          });
          if (!Fa(Y)) return T4;
          let J = G.transform(Y.value, Z);
          if (J instanceof Promise) throw Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
          return {
            status: Q.value,
            value: J
          }
        } else return this._def.schema._parseAsync({
          data: B.data,
          path: B.path,
          parent: B
        }).then((Y) => {
          if (!Fa(Y)) return T4;
          return Promise.resolve(G.transform(Y.value, Z)).then((J) => ({
            status: Q.value,
            value: J
          }))
        });
      G5.assertNever(G)
    }
  };
  zP.create = (A, Q, B) => {
    return new zP({
      schema: A,
      typeName: e4.ZodEffects,
      effect: Q,
      ...b3(B)
    })
  };
  zP.createWithPreprocess = (A, Q, B) => {
    return new zP({
      schema: Q,
      effect: {
        type: "preprocess",
        transform: A
      },
      typeName: e4.ZodEffects,
      ...b3(B)
    })
  };
  HP = class HP extends L8 {
    _parse(A) {
      if (this._getType(A) === fB.undefined) return Rz(void 0);
      return this._def.innerType._parse(A)
    }
    unwrap() {
      return this._def.innerType
    }
  };
  HP.create = (A, Q) => {
    return new HP({
      innerType: A,
      typeName: e4.ZodOptional,
      ...b3(Q)
    })
  };
  pu = class pu extends L8 {
    _parse(A) {
      if (this._getType(A) === fB.null) return Rz(null);
      return this._def.innerType._parse(A)
    }
    unwrap() {
      return this._def.innerType
    }
  };
  pu.create = (A, Q) => {
    return new pu({
      innerType: A,
      typeName: e4.ZodNullable,
      ...b3(Q)
    })
  };
  tXA = class tXA extends L8 {
    _parse(A) {
      let {
        ctx: Q
      } = this._processInputParams(A), B = Q.data;
      if (Q.parsedType === fB.undefined) B = this._def.defaultValue();
      return this._def.innerType._parse({
        data: B,
        path: Q.path,
        parent: Q
      })
    }
    removeDefault() {
      return this._def.innerType
    }
  };
  tXA.create = (A, Q) => {
    return new tXA({
      innerType: A,
      typeName: e4.ZodDefault,
      defaultValue: typeof Q.default === "function" ? Q.default : () => Q.default,
      ...b3(Q)
    })
  };
  eXA = class eXA extends L8 {
    _parse(A) {
      let {
        ctx: Q
      } = this._processInputParams(A), B = {
        ...Q,
        common: {
          ...Q.common,
          issues: []
        }
      }, G = this._def.innerType._parse({
        data: B.data,
        path: B.path,
        parent: {
          ...B
        }
      });
      if (mXA(G)) return G.then((Z) => {
        return {
          status: "valid",
          value: Z.status === "valid" ? Z.value : this._def.catchValue({
            get error() {
              return new oq(B.common.issues)
            },
            input: B.data
          })
        }
      });
      else return {
        status: "valid",
        value: G.status === "valid" ? G.value : this._def.catchValue({
          get error() {
            return new oq(B.common.issues)
          },
          input: B.data
        })
      }
    }
    removeCatch() {
      return this._def.innerType
    }
  };
  eXA.create = (A, Q) => {
    return new eXA({
      innerType: A,
      typeName: e4.ZodCatch,
      catchValue: typeof Q.catch === "function" ? Q.catch : () => Q.catch,
      ...b3(Q)
    })
  };
  ARA = class ARA extends L8 {
    _parse(A) {
      if (this._getType(A) !== fB.nan) {
        let B = this._getOrReturnCtx(A);
        return X2(B, {
          code: JB.invalid_type,
          expected: fB.nan,
          received: B.parsedType
        }), T4
      }
      return {
        status: "valid",
        value: A.data
      }
    }
  };
  ARA.create = (A) => {
    return new ARA({
      typeName: e4.ZodNaN,
      ...b3(A)
    })
  };
  H78 = Symbol("zod_brand");
  b01 = class b01 extends L8 {
    _parse(A) {
      let {
        ctx: Q
      } = this._processInputParams(A), B = Q.data;
      return this._def.type._parse({
        data: B,
        path: Q.path,
        parent: Q
      })
    }
    unwrap() {
      return this._def.type
    }
  };
  QRA = class QRA extends L8 {
    _parse(A) {
      let {
        status: Q,
        ctx: B
      } = this._processInputParams(A);
      if (B.common.async) return (async () => {
        let Z = await this._def.in._parseAsync({
          data: B.data,
          path: B.path,
          parent: B
        });
        if (Z.status === "aborted") return T4;
        if (Z.status === "dirty") return Q.dirty(), GBA(Z.value);
        else return this._def.out._parseAsync({
          data: Z.value,
          path: B.path,
          parent: B
        })
      })();
      else {
        let G = this._def.in._parseSync({
          data: B.data,
          path: B.path,
          parent: B
        });
        if (G.status === "aborted") return T4;
        if (G.status === "dirty") return Q.dirty(), {
          status: "dirty",
          value: G.value
        };
        else return this._def.out._parseSync({
          data: G.value,
          path: B.path,
          parent: B
        })
      }
    }
    static create(A, Q) {
      return new QRA({
        in: A,
        out: Q,
        typeName: e4.ZodPipeline
      })
    }
  };
  AIA = class AIA extends L8 {
    _parse(A) {
      let Q = this._def.innerType._parse(A),
        B = (G) => {
          if (Fa(G)) G.value = Object.freeze(G.value);
          return G
        };
      return mXA(Q) ? Q.then((G) => B(G)) : B(Q)
    }
    unwrap() {
      return this._def.innerType
    }
  };
  AIA.create = (A, Q) => {
    return new AIA({
      innerType: A,
      typeName: e4.ZodReadonly,
      ...b3(Q)
    })
  };
  E78 = {
    object: JI.lazycreate
  };
  (function (A) {
    A.ZodString = "ZodString", A.ZodNumber = "ZodNumber", A.ZodNaN = "ZodNaN", A.ZodBigInt = "ZodBigInt", A.ZodBoolean = "ZodBoolean", A.ZodDate = "ZodDate", A.ZodSymbol = "ZodSymbol", A.ZodUndefined = "ZodUndefined", A.ZodNull = "ZodNull", A.ZodAny = "ZodAny", A.ZodUnknown = "ZodUnknown", A.ZodNever = "ZodNever", A.ZodVoid = "ZodVoid", A.ZodArray = "ZodArray", A.ZodObject = "ZodObject", A.ZodUnion = "ZodUnion", A.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", A.ZodIntersection = "ZodIntersection", A.ZodTuple = "ZodTuple", A.ZodRecord = "ZodRecord", A.ZodMap = "ZodMap", A.ZodSet = "ZodSet", A.ZodFunction = "ZodFunction", A.ZodLazy = "ZodLazy", A.ZodLiteral = "ZodLiteral", A.ZodEnum = "ZodEnum", A.ZodEffects = "ZodEffects", A.ZodNativeEnum = "ZodNativeEnum", A.ZodOptional = "ZodOptional", A.ZodNullable = "ZodNullable", A.ZodDefault = "ZodDefault", A.ZodCatch = "ZodCatch", A.ZodPromise = "ZodPromise", A.ZodBranded = "ZodBranded", A.ZodPipeline = "ZodPipeline", A.ZodReadonly = "ZodReadonly"
  })(e4 || (e4 = {}));
  oQ = VP.create, pR = Ea.create, $78 = ARA.create, C78 = za.create, ZF = pXA.create, U78 = ZBA.create, q78 = rMA.create, N78 = lXA.create, w78 = iXA.create, L78 = YBA.create, O78 = Ha.create, M78 = Fk.create, R78 = sMA.create, dI = FP.create, bL = JI.create, fL = JI.strictCreate, IBA = nXA.create, _78 = k01.create, j78 = aXA.create, T78 = Hk.create, $P = tMA.create, P78 = eMA.create, S78 = JBA.create, x78 = cXA.create, y78 = oXA.create, v78 = rXA.create, CP = $a.create, k78 = sXA.create, b78 = XBA.create, f78 = zP.create, h78 = HP.create, g78 = pu.create, u78 = zP.createWithPreprocess, m78 = QRA.create, l78 = {
    string: (A) => VP.create({
      ...A,
      coerce: !0
    }),
    number: (A) => Ea.create({
      ...A,
      coerce: !0
    }),
    boolean: (A) => pXA.create({
      ...A,
      coerce: !0
    }),
    bigint: (A) => za.create({
      ...A,
      coerce: !0
    }),
    date: (A) => ZBA.create({
      ...A,
      coerce: !0
    })
  }, i78 = T4
})
// @from(Ln 147901, Col 4)
XG = {}
// @from(Ln 148011, Col 4)
Rr1 = w(() => {
  x01();
  Lr1();
  kHB();
  aMA();
  pHB();
  S01()
})
// @from(Ln 148019, Col 4)
f01 = w(() => {
  Rr1();
  Rr1()
})
// @from(Ln 148023, Col 4)
iHB
// @from(Ln 148023, Col 9)
_r1
// @from(Ln 148023, Col 14)
nHB
// @from(Ln 148023, Col 19)
aHB
// @from(Ln 148023, Col 24)
oHB
// @from(Ln 148023, Col 29)
rHB
// @from(Ln 148023, Col 34)
sHB
// @from(Ln 148024, Col 4)
tHB = w(() => {
  f01();
  iHB = XG.string().refine((A) => {
    if (A.includes("://") || A.includes("/") || A.includes(":")) return !1;
    if (A === "localhost") return !0;
    if (A.startsWith("*.")) {
      let Q = A.slice(2);
      if (!Q.includes(".") || Q.startsWith(".") || Q.endsWith(".")) return !1;
      let B = Q.split(".");
      return B.length >= 2 && B.every((G) => G.length > 0)
    }
    if (A.includes("*")) return !1;
    return A.includes(".") && !A.startsWith(".") && !A.endsWith(".")
  }, {
    message: 'Invalid domain pattern. Must be a valid domain (e.g., "example.com") or wildcard (e.g., "*.example.com"). Overly broad patterns like "*.com" or "*" are not allowed for security reasons.'
  }), _r1 = XG.string().min(1, "Path cannot be empty"), nHB = XG.object({
    allowedDomains: XG.array(iHB).describe('List of allowed domains (e.g., ["github.com", "*.npmjs.org"])'),
    deniedDomains: XG.array(iHB).describe("List of denied domains"),
    allowUnixSockets: XG.array(XG.string()).optional().describe("Unix socket paths that are allowed (macOS only)"),
    allowAllUnixSockets: XG.boolean().optional().describe("Allow ALL Unix sockets (Linux only - disables Unix socket blocking)"),
    allowLocalBinding: XG.boolean().optional().describe("Whether to allow binding to local ports (default: false)"),
    httpProxyPort: XG.number().int().min(1).max(65535).optional().describe("Port of an external HTTP proxy to use instead of starting a local one. When provided, the library will skip starting its own HTTP proxy and use this port. The external proxy must handle domain filtering."),
    socksProxyPort: XG.number().int().min(1).max(65535).optional().describe("Port of an external SOCKS proxy to use instead of starting a local one. When provided, the library will skip starting its own SOCKS proxy and use this port. The external proxy must handle domain filtering.")
  }), aHB = XG.object({
    denyRead: XG.array(_r1).describe("Paths denied for reading"),
    allowWrite: XG.array(_r1).describe("Paths allowed for writing"),
    denyWrite: XG.array(_r1).describe("Paths denied for writing (takes precedence over allowWrite)"),
    allowGitConfig: XG.boolean().optional().describe("Allow writes to .git/config files (default: false). Enables git remote URL updates while keeping .git/hooks protected.")
  }), oHB = XG.record(XG.string(), XG.array(XG.string())).describe('Map of command patterns to filesystem paths to ignore violations for. Use "*" to match all commands'), rHB = XG.object({
    command: XG.string().describe('The ripgrep command to execute (e.g., "rg", "claude")'),
    args: XG.array(XG.string()).optional().describe('Additional arguments to pass before ripgrep args (e.g., ["--ripgrep"])')
  }), sHB = XG.object({
    network: nHB.describe("Network restrictions configuration"),
    filesystem: aHB.describe("Filesystem restrictions configuration"),
    ignoreViolations: oHB.optional().describe("Optional configuration for ignoring specific violations"),
    enableWeakerNestedSandbox: XG.boolean().optional().describe("Enable weaker nested sandbox mode (for Docker environments)"),
    ripgrep: rHB.optional().describe('Custom ripgrep configuration (default: { command: "rg" })'),
    mandatoryDenySearchDepth: XG.number().int().min(1).max(10).optional().describe("Maximum directory depth to search for dangerous files on Linux (default: 3). Higher values provide more protection but slower performance."),
    allowPty: XG.boolean().optional().describe("Allow pseudo-terminal (pty) operations (macOS only)")
  })
})
// @from(Ln 148065, Col 4)
eHB = w(() => {
  yHB();
  $r1();
  tHB();
  hXA()
})
// @from(Ln 148087, Col 0)
function XEB(A, Q = {}) {
  let B = Q.entryType || Q.type;
  if (B === "both") B = hL.FILE_DIR_TYPE;
  if (B) Q.type = B;
  if (!A) throw Error("readdirp: root argument is required. Usage: readdirp(root, options)");
  else if (typeof A !== "string") throw TypeError("readdirp: root argument must be a string. Usage: readdirp(root, options)");
  else if (B && !BEB.includes(B)) throw Error(`readdirp: Invalid type passed. Use one of ${BEB.join(", ")}`);
  return Q.root = A, new JEB(Q)
}
// @from(Ln 148096, Col 4)
hL
// @from(Ln 148096, Col 8)
jr1
// @from(Ln 148096, Col 13)
YEB = "READDIRP_RECURSIVE_ERROR"
// @from(Ln 148097, Col 2)
AG8
// @from(Ln 148097, Col 7)
BEB
// @from(Ln 148097, Col 12)
QG8
// @from(Ln 148097, Col 17)
BG8
// @from(Ln 148097, Col 22)
GG8 = (A) => AG8.has(A.code)
// @from(Ln 148098, Col 2)
ZG8
// @from(Ln 148098, Col 7)
GEB = (A) => !0