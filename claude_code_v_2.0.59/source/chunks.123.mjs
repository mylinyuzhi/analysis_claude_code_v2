
// @from(Start 11623290, End 11624448)
c_2 = L(() => {
  wF();
  d_2 = `Performs exact string replacements in files. 

Usage:
- You must use your \`${d5}\` tool at least once in the conversation before editing. This tool will error if you attempt an edit without reading the file. 
- When editing text from Read tool output, ensure you preserve the exact indentation (tabs/spaces) as it appears AFTER the line number prefix. The line number prefix format is: spaces + line number + tab. Everything after that tab is the actual file content to match. Never include any part of the line number prefix in the old_string or new_string.
- ALWAYS prefer editing existing files in the codebase. NEVER write new files unless explicitly required.
- Only use emojis if the user explicitly requests it. Avoid adding emojis to files unless asked.
- The edit will FAIL if \`old_string\` is not unique in the file. Either provide a larger string with more surrounding context to make it unique or use \`replace_all\` to change every instance of \`old_string\`. 
- Use \`replace_all\` for replacing and renaming strings across the file. This parameter is useful if you want to rename a variable for instance.`
})
// @from(Start 11624451, End 11624823)
function p_2(A) {
  let Q = mu5.find((G) => G.matches(A));
  if (!Q) return null;
  let B = {
    ...Q.tip
  };
  if (A.code === "invalid_enum_value" && A.enumValues && !B.suggestion) B.suggestion = `Valid values: ${A.enumValues.map((G)=>`"${G}"`).join(", ")}`;
  if (!B.docLink && A.path) {
    let G = A.path.split(".")[0];
    if (G) B.docLink = du5[G]
  }
  return B
}
// @from(Start 11624828, End 11624831)
mu5
// @from(Start 11624833, End 11624836)
du5
// @from(Start 11624842, End 11628117)
l_2 = L(() => {
  mu5 = [{
    matches: (A) => A.path === "permissions.defaultMode" && A.code === "invalid_enum_value",
    tip: {
      suggestion: 'Valid modes: "acceptEdits" (ask before file changes), "plan" (analysis only), "bypassPermissions" (auto-accept all), or "default" (standard behavior)',
      docLink: "https://code.claude.com/docs/en/iam#permission-modes"
    }
  }, {
    matches: (A) => A.path === "apiKeyHelper" && A.code === "invalid_type",
    tip: {
      suggestion: 'Provide a shell command that outputs your API key to stdout. The script should output only the API key. Example: "/bin/generate_temp_api_key.sh"'
    }
  }, {
    matches: (A) => A.path === "cleanupPeriodDays" && A.code === "too_small" && A.expected === "0",
    tip: {
      suggestion: "Must be 0 or greater. Use 0 to disable automatic cleanup and keep chat transcripts forever, or set a positive number for days to retain (default is 30 days)"
    }
  }, {
    matches: (A) => A.path.startsWith("env.") && A.code === "invalid_type",
    tip: {
      suggestion: 'Environment variables must be strings. Wrap numbers and booleans in quotes. Example: "DEBUG": "true", "PORT": "3000"',
      docLink: "https://code.claude.com/docs/en/settings#environment-variables"
    }
  }, {
    matches: (A) => (A.path === "permissions.allow" || A.path === "permissions.deny") && A.code === "invalid_type" && A.expected === "array",
    tip: {
      suggestion: 'Permission rules must be in an array. Format: ["Tool(specifier)"]. Examples: ["Bash(npm run build)", "Edit(docs/**)", "Read(~/.zshrc)"]. Use * for wildcards.'
    }
  }, {
    matches: (A) => A.path.includes("hooks") && A.code === "invalid_type",
    tip: {
      suggestion: 'Hooks use a new format with matchers. Example: {"PostToolUse": [{"matcher": {"tools": ["BashTool"]}, "hooks": [{"type": "command", "command": "echo Done"}]}]}'
    }
  }, {
    matches: (A) => A.code === "invalid_type" && A.expected === "boolean",
    tip: {
      suggestion: 'Use true or false without quotes. Example: "includeCoAuthoredBy": true'
    }
  }, {
    matches: (A) => A.code === "unrecognized_keys",
    tip: {
      suggestion: "Check for typos or refer to the documentation for valid fields",
      docLink: "https://code.claude.com/docs/en/settings"
    }
  }, {
    matches: (A) => A.code === "invalid_enum_value" && A.enumValues !== void 0,
    tip: {
      suggestion: void 0
    }
  }, {
    matches: (A) => A.code === "invalid_type" && A.expected === "object" && A.received === null && A.path === "",
    tip: {
      suggestion: "Check for missing commas, unmatched brackets, or trailing commas. Use a JSON validator to identify the exact syntax error."
    }
  }, {
    matches: (A) => A.path === "permissions.additionalDirectories" && A.code === "invalid_type",
    tip: {
      suggestion: 'Must be an array of directory paths. Example: ["~/projects", "/tmp/workspace"]. You can also use --add-dir flag or /add-dir command',
      docLink: "https://code.claude.com/docs/en/iam#working-directories"
    }
  }], du5 = {
    permissions: "https://code.claude.com/docs/en/iam#configuring-permissions",
    env: "https://code.claude.com/docs/en/settings#environment-variables",
    hooks: "https://code.claude.com/docs/en/hooks"
  }
})
// @from(Start 11628123, End 11628126)
n_2
// @from(Start 11628128, End 11628131)
i_2
// @from(Start 11628133, End 11628216)
a_2 = (A) => typeof A === "string" ? {
  ...i_2,
  name: A
} : {
  ...i_2,
  ...A
}
// @from(Start 11628222, End 11628944)
U51 = L(() => {
  n_2 = Symbol("Let zodToJsonSchema decide on which parser to use"), i_2 = {
    name: void 0,
    $refStrategy: "root",
    basePath: ["#"],
    effectStrategy: "input",
    pipeStrategy: "all",
    dateStrategy: "format:date-time",
    mapStrategy: "entries",
    removeAdditionalStrategy: "passthrough",
    allowedAdditionalProperties: !0,
    rejectedAdditionalProperties: !1,
    definitionPath: "definitions",
    target: "jsonSchema7",
    strictUnions: !1,
    definitions: {},
    errorMessages: !1,
    markdownDescription: !1,
    patternStrategy: "escape",
    applyRegexFlags: !1,
    emailStrategy: "format:email",
    base64Strategy: "contentEncoding:base64",
    nameStrategy: "ref"
  }
})
// @from(Start 11628950, End 11629317)
s_2 = (A) => {
  let Q = a_2(A),
    B = Q.name !== void 0 ? [...Q.basePath, Q.definitionPath, Q.name] : Q.basePath;
  return {
    ...Q,
    currentPath: B,
    propertyPath: void 0,
    seen: new Map(Object.entries(Q.definitions).map(([G, Z]) => [Z._def, {
      def: Z._def,
      path: [...Q.basePath, Q.definitionPath, G],
      jsonSchema: void 0
    }]))
  }
}
// @from(Start 11629323, End 11629349)
M50 = L(() => {
  U51()
})
// @from(Start 11629352, End 11629479)
function O50(A, Q, B, G) {
  if (!G?.errorMessages) return;
  if (B) A.errorMessage = {
    ...A.errorMessage,
    [Q]: B
  }
}
// @from(Start 11629481, End 11629539)
function a5(A, Q, B, G, Z) {
  A[Q] = B, O50(A, Q, G, Z)
}
// @from(Start 11629541, End 11629571)
function r_2() {
  return {}
}
// @from(Start 11629573, End 11630105)
function o_2(A, Q) {
  let B = {
    type: "array"
  };
  if (A.type?._def && A.type?._def?.typeName !== PQ.ZodAny) B.items = U4(A.type._def, {
    ...Q,
    currentPath: [...Q.currentPath, "items"]
  });
  if (A.minLength) a5(B, "minItems", A.minLength.value, A.minLength.message, Q);
  if (A.maxLength) a5(B, "maxItems", A.maxLength.value, A.maxLength.message, Q);
  if (A.exactLength) a5(B, "minItems", A.exactLength.value, A.exactLength.message, Q), a5(B, "maxItems", A.exactLength.value, A.exactLength.message, Q);
  return B
}
// @from(Start 11630110, End 11630143)
R50 = L(() => {
  Q2();
  BV()
})
// @from(Start 11630146, End 11631029)
function t_2(A, Q) {
  let B = {
    type: "integer",
    format: "int64"
  };
  if (!A.checks) return B;
  for (let G of A.checks) switch (G.kind) {
    case "min":
      if (Q.target === "jsonSchema7")
        if (G.inclusive) a5(B, "minimum", G.value, G.message, Q);
        else a5(B, "exclusiveMinimum", G.value, G.message, Q);
      else {
        if (!G.inclusive) B.exclusiveMinimum = !0;
        a5(B, "minimum", G.value, G.message, Q)
      }
      break;
    case "max":
      if (Q.target === "jsonSchema7")
        if (G.inclusive) a5(B, "maximum", G.value, G.message, Q);
        else a5(B, "exclusiveMaximum", G.value, G.message, Q);
      else {
        if (!G.inclusive) B.exclusiveMaximum = !0;
        a5(B, "maximum", G.value, G.message, Q)
      }
      break;
    case "multipleOf":
      a5(B, "multipleOf", G.value, G.message, Q);
      break
  }
  return B
}
// @from(Start 11631034, End 11631048)
T50 = () => {}
// @from(Start 11631051, End 11631104)
function e_2() {
  return {
    type: "boolean"
  }
}
// @from(Start 11631106, End 11631156)
function $51(A, Q) {
  return U4(A.type._def, Q)
}
// @from(Start 11631161, End 11631186)
w51 = L(() => {
  BV()
})
// @from(Start 11631192, End 11631244)
Ak2 = (A, Q) => {
  return U4(A.innerType._def, Q)
}
// @from(Start 11631250, End 11631275)
P50 = L(() => {
  BV()
})
// @from(Start 11631278, End 11631678)
function j50(A, Q, B) {
  let G = B ?? Q.dateStrategy;
  if (Array.isArray(G)) return {
    anyOf: G.map((Z, I) => j50(A, Q, Z))
  };
  switch (G) {
    case "string":
    case "format:date-time":
      return {
        type: "string", format: "date-time"
      };
    case "format:date":
      return {
        type: "string", format: "date"
      };
    case "integer":
      return cu5(A, Q)
  }
}
// @from(Start 11631683, End 11632015)
cu5 = (A, Q) => {
  let B = {
    type: "integer",
    format: "unix-time"
  };
  if (Q.target === "openApi3") return B;
  for (let G of A.checks) switch (G.kind) {
    case "min":
      a5(B, "minimum", G.value, G.message, Q);
      break;
    case "max":
      a5(B, "maximum", G.value, G.message, Q);
      break
  }
  return B
}
// @from(Start 11632021, End 11632035)
S50 = () => {}
// @from(Start 11632038, End 11632137)
function Qk2(A, Q) {
  return {
    ...U4(A.innerType._def, Q),
    default: A.defaultValue()
  }
}
// @from(Start 11632142, End 11632167)
_50 = L(() => {
  BV()
})
// @from(Start 11632170, End 11632258)
function Bk2(A, Q) {
  return Q.effectStrategy === "input" ? U4(A.schema._def, Q) : {}
}
// @from(Start 11632263, End 11632288)
k50 = L(() => {
  BV()
})
// @from(Start 11632291, End 11632376)
function Gk2(A) {
  return {
    type: "string",
    enum: Array.from(A.values)
  }
}
// @from(Start 11632378, End 11633139)
function Zk2(A, Q) {
  let B = [U4(A.left._def, {
      ...Q,
      currentPath: [...Q.currentPath, "allOf", "0"]
    }), U4(A.right._def, {
      ...Q,
      currentPath: [...Q.currentPath, "allOf", "1"]
    })].filter((I) => !!I),
    G = Q.target === "jsonSchema2019-09" ? {
      unevaluatedProperties: !1
    } : void 0,
    Z = [];
  return B.forEach((I) => {
    if (pu5(I)) {
      if (Z.push(...I.allOf), I.unevaluatedProperties === void 0) G = void 0
    } else {
      let Y = I;
      if ("additionalProperties" in I && I.additionalProperties === !1) {
        let {
          additionalProperties: J,
          ...W
        } = I;
        Y = W
      } else G = void 0;
      Z.push(Y)
    }
  }), Z.length ? {
    allOf: Z,
    ...G
  } : void 0
}
// @from(Start 11633144, End 11633235)
pu5 = (A) => {
  if ("type" in A && A.type === "string") return !1;
  return "allOf" in A
}
// @from(Start 11633241, End 11633266)
y50 = L(() => {
  BV()
})
// @from(Start 11633269, End 11633645)
function Ik2(A, Q) {
  let B = typeof A.value;
  if (B !== "bigint" && B !== "number" && B !== "boolean" && B !== "string") return {
    type: Array.isArray(A.value) ? "array" : "object"
  };
  if (Q.target === "openApi3") return {
    type: B === "bigint" ? "integer" : B,
    enum: [A.value]
  };
  return {
    type: B === "bigint" ? "integer" : B,
    const: A.value
  }
}
// @from(Start 11633647, End 11636941)
function q51(A, Q) {
  let B = {
    type: "string"
  };
  if (A.checks)
    for (let G of A.checks) switch (G.kind) {
      case "min":
        a5(B, "minLength", typeof B.minLength === "number" ? Math.max(B.minLength, G.value) : G.value, G.message, Q);
        break;
      case "max":
        a5(B, "maxLength", typeof B.maxLength === "number" ? Math.min(B.maxLength, G.value) : G.value, G.message, Q);
        break;
      case "email":
        switch (Q.emailStrategy) {
          case "format:email":
            _P(B, "email", G.message, Q);
            break;
          case "format:idn-email":
            _P(B, "idn-email", G.message, Q);
            break;
          case "pattern:zod":
            pE(B, SP.email, G.message, Q);
            break
        }
        break;
      case "url":
        _P(B, "uri", G.message, Q);
        break;
      case "uuid":
        _P(B, "uuid", G.message, Q);
        break;
      case "regex":
        pE(B, G.regex, G.message, Q);
        break;
      case "cuid":
        pE(B, SP.cuid, G.message, Q);
        break;
      case "cuid2":
        pE(B, SP.cuid2, G.message, Q);
        break;
      case "startsWith":
        pE(B, RegExp(`^${v50(G.value,Q)}`), G.message, Q);
        break;
      case "endsWith":
        pE(B, RegExp(`${v50(G.value,Q)}$`), G.message, Q);
        break;
      case "datetime":
        _P(B, "date-time", G.message, Q);
        break;
      case "date":
        _P(B, "date", G.message, Q);
        break;
      case "time":
        _P(B, "time", G.message, Q);
        break;
      case "duration":
        _P(B, "duration", G.message, Q);
        break;
      case "length":
        a5(B, "minLength", typeof B.minLength === "number" ? Math.max(B.minLength, G.value) : G.value, G.message, Q), a5(B, "maxLength", typeof B.maxLength === "number" ? Math.min(B.maxLength, G.value) : G.value, G.message, Q);
        break;
      case "includes": {
        pE(B, RegExp(v50(G.value, Q)), G.message, Q);
        break
      }
      case "ip": {
        if (G.version !== "v6") _P(B, "ipv4", G.message, Q);
        if (G.version !== "v4") _P(B, "ipv6", G.message, Q);
        break
      }
      case "base64url":
        pE(B, SP.base64url, G.message, Q);
        break;
      case "jwt":
        pE(B, SP.jwt, G.message, Q);
        break;
      case "cidr": {
        if (G.version !== "v6") pE(B, SP.ipv4Cidr, G.message, Q);
        if (G.version !== "v4") pE(B, SP.ipv6Cidr, G.message, Q);
        break
      }
      case "emoji":
        pE(B, SP.emoji(), G.message, Q);
        break;
      case "ulid": {
        pE(B, SP.ulid, G.message, Q);
        break
      }
      case "base64": {
        switch (Q.base64Strategy) {
          case "format:binary": {
            _P(B, "binary", G.message, Q);
            break
          }
          case "contentEncoding:base64": {
            a5(B, "contentEncoding", "base64", G.message, Q);
            break
          }
          case "pattern:zod": {
            pE(B, SP.base64, G.message, Q);
            break
          }
        }
        break
      }
      case "nanoid":
        pE(B, SP.nanoid, G.message, Q);
      case "toLowerCase":
      case "toUpperCase":
      case "trim":
        break;
      default:
        ((Z) => {})(G)
    }
  return B
}
// @from(Start 11636943, End 11637018)
function v50(A, Q) {
  return Q.patternStrategy === "escape" ? iu5(A) : A
}
// @from(Start 11637020, End 11637156)
function iu5(A) {
  let Q = "";
  for (let B = 0; B < A.length; B++) {
    if (!lu5.has(A[B])) Q += "\\";
    Q += A[B]
  }
  return Q
}
// @from(Start 11637158, End 11637833)
function _P(A, Q, B, G) {
  if (A.format || A.anyOf?.some((Z) => Z.format)) {
    if (!A.anyOf) A.anyOf = [];
    if (A.format) {
      if (A.anyOf.push({
          format: A.format,
          ...A.errorMessage && G.errorMessages && {
            errorMessage: {
              format: A.errorMessage.format
            }
          }
        }), delete A.format, A.errorMessage) {
        if (delete A.errorMessage.format, Object.keys(A.errorMessage).length === 0) delete A.errorMessage
      }
    }
    A.anyOf.push({
      format: Q,
      ...B && G.errorMessages && {
        errorMessage: {
          format: B
        }
      }
    })
  } else a5(A, "format", Q, B, G)
}
// @from(Start 11637835, End 11638538)
function pE(A, Q, B, G) {
  if (A.pattern || A.allOf?.some((Z) => Z.pattern)) {
    if (!A.allOf) A.allOf = [];
    if (A.pattern) {
      if (A.allOf.push({
          pattern: A.pattern,
          ...A.errorMessage && G.errorMessages && {
            errorMessage: {
              pattern: A.errorMessage.pattern
            }
          }
        }), delete A.pattern, A.errorMessage) {
        if (delete A.errorMessage.pattern, Object.keys(A.errorMessage).length === 0) delete A.errorMessage
      }
    }
    A.allOf.push({
      pattern: Yk2(Q, G),
      ...B && G.errorMessages && {
        errorMessage: {
          pattern: B
        }
      }
    })
  } else a5(A, "pattern", Yk2(Q, G), B, G)
}
// @from(Start 11638540, End 11639978)
function Yk2(A, Q) {
  if (!Q.applyRegexFlags || !A.flags) return A.source;
  let B = {
      i: A.flags.includes("i"),
      m: A.flags.includes("m"),
      s: A.flags.includes("s")
    },
    G = B.i ? A.source.toLowerCase() : A.source,
    Z = "",
    I = !1,
    Y = !1,
    J = !1;
  for (let W = 0; W < G.length; W++) {
    if (I) {
      Z += G[W], I = !1;
      continue
    }
    if (B.i) {
      if (Y) {
        if (G[W].match(/[a-z]/)) {
          if (J) Z += G[W], Z += `${G[W-2]}-${G[W]}`.toUpperCase(), J = !1;
          else if (G[W + 1] === "-" && G[W + 2]?.match(/[a-z]/)) Z += G[W], J = !0;
          else Z += `${G[W]}${G[W].toUpperCase()}`;
          continue
        }
      } else if (G[W].match(/[a-z]/)) {
        Z += `[${G[W]}${G[W].toUpperCase()}]`;
        continue
      }
    }
    if (B.m) {
      if (G[W] === "^") {
        Z += `(^|(?<=[\r
]))`;
        continue
      } else if (G[W] === "$") {
        Z += `($|(?=[\r
]))`;
        continue
      }
    }
    if (B.s && G[W] === ".") {
      Z += Y ? `${G[W]}\r
` : `[${G[W]}\r
]`;
      continue
    }
    if (Z += G[W], G[W] === "\\") I = !0;
    else if (Y && G[W] === "]") Y = !1;
    else if (!Y && G[W] === "[") Y = !0
  }
  try {
    new RegExp(Z)
  } catch {
    return console.warn(`Could not convert regex pattern at ${Q.currentPath.join("/")} to a flag-independent form! Falling back to the flag-ignorant source`), A.source
  }
  return Z
}
// @from(Start 11639983, End 11639995)
x50 = void 0
// @from(Start 11639999, End 11640001)
SP
// @from(Start 11640003, End 11640006)
lu5
// @from(Start 11640012, End 11642226)
N51 = L(() => {
  SP = {
    cuid: /^[cC][^\s-]{8,}$/,
    cuid2: /^[0-9a-z]+$/,
    ulid: /^[0-9A-HJKMNP-TV-Z]{26}$/,
    email: /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_'+\-\.]*)[a-zA-Z0-9_+-]@([a-zA-Z0-9][a-zA-Z0-9\-]*\.)+[a-zA-Z]{2,}$/,
    emoji: () => {
      if (x50 === void 0) x50 = RegExp("^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", "u");
      return x50
    },
    uuid: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
    ipv4Cidr: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,
    ipv6: /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/,
    ipv6Cidr: /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
    base64: /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
    base64url: /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,
    nanoid: /^[a-zA-Z0-9_-]{21}$/,
    jwt: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/
  };
  lu5 = new Set("ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789")
})
// @from(Start 11642229, End 11643672)
function L51(A, Q) {
  if (Q.target === "openAi") console.warn("Warning: OpenAI may not support records in schemas! Try an array of key-value pairs instead.");
  if (Q.target === "openApi3" && A.keyType?._def.typeName === PQ.ZodEnum) return {
    type: "object",
    required: A.keyType._def.values,
    properties: A.keyType._def.values.reduce((G, Z) => ({
      ...G,
      [Z]: U4(A.valueType._def, {
        ...Q,
        currentPath: [...Q.currentPath, "properties", Z]
      }) ?? {}
    }), {}),
    additionalProperties: Q.rejectedAdditionalProperties
  };
  let B = {
    type: "object",
    additionalProperties: U4(A.valueType._def, {
      ...Q,
      currentPath: [...Q.currentPath, "additionalProperties"]
    }) ?? Q.allowedAdditionalProperties
  };
  if (Q.target === "openApi3") return B;
  if (A.keyType?._def.typeName === PQ.ZodString && A.keyType._def.checks?.length) {
    let {
      type: G,
      ...Z
    } = q51(A.keyType._def, Q);
    return {
      ...B,
      propertyNames: Z
    }
  } else if (A.keyType?._def.typeName === PQ.ZodEnum) return {
    ...B,
    propertyNames: {
      enum: A.keyType._def.values
    }
  };
  else if (A.keyType?._def.typeName === PQ.ZodBranded && A.keyType._def.type._def.typeName === PQ.ZodString && A.keyType._def.type._def.checks?.length) {
    let {
      type: G,
      ...Z
    } = $51(A.keyType._def, Q);
    return {
      ...B,
      propertyNames: Z
    }
  }
  return B
}
// @from(Start 11643677, End 11643728)
M51 = L(() => {
  Q2();
  BV();
  N51();
  w51()
})
// @from(Start 11643731, End 11644192)
function Jk2(A, Q) {
  if (Q.mapStrategy === "record") return L51(A, Q);
  let B = U4(A.keyType._def, {
      ...Q,
      currentPath: [...Q.currentPath, "items", "items", "0"]
    }) || {},
    G = U4(A.valueType._def, {
      ...Q,
      currentPath: [...Q.currentPath, "items", "items", "1"]
    }) || {};
  return {
    type: "array",
    maxItems: 125,
    items: {
      type: "array",
      items: [B, G],
      minItems: 2,
      maxItems: 2
    }
  }
}
// @from(Start 11644197, End 11644231)
b50 = L(() => {
  BV();
  M51()
})
// @from(Start 11644234, End 11644556)
function Wk2(A) {
  let Q = A.values,
    G = Object.keys(A.values).filter((I) => {
      return typeof Q[Q[I]] !== "number"
    }).map((I) => Q[I]),
    Z = Array.from(new Set(G.map((I) => typeof I)));
  return {
    type: Z.length === 1 ? Z[0] === "string" ? "string" : "number" : ["string", "number"],
    enum: G
  }
}
// @from(Start 11644558, End 11644603)
function Xk2() {
  return {
    not: {}
  }
}
// @from(Start 11644605, End 11644727)
function Vk2(A) {
  return A.target === "openApi3" ? {
    enum: ["null"],
    nullable: !0
  } : {
    type: "null"
  }
}
// @from(Start 11644729, End 11646180)
function Kk2(A, Q) {
  if (Q.target === "openApi3") return Fk2(A, Q);
  let B = A.options instanceof Map ? Array.from(A.options.values()) : A.options;
  if (B.every((G) => (G._def.typeName in iRA) && (!G._def.checks || !G._def.checks.length))) {
    let G = B.reduce((Z, I) => {
      let Y = iRA[I._def.typeName];
      return Y && !Z.includes(Y) ? [...Z, Y] : Z
    }, []);
    return {
      type: G.length > 1 ? G : G[0]
    }
  } else if (B.every((G) => G._def.typeName === "ZodLiteral" && !G.description)) {
    let G = B.reduce((Z, I) => {
      let Y = typeof I._def.value;
      switch (Y) {
        case "string":
        case "number":
        case "boolean":
          return [...Z, Y];
        case "bigint":
          return [...Z, "integer"];
        case "object":
          if (I._def.value === null) return [...Z, "null"];
        case "symbol":
        case "undefined":
        case "function":
        default:
          return Z
      }
    }, []);
    if (G.length === B.length) {
      let Z = G.filter((I, Y, J) => J.indexOf(I) === Y);
      return {
        type: Z.length > 1 ? Z : Z[0],
        enum: B.reduce((I, Y) => {
          return I.includes(Y._def.value) ? I : [...I, Y._def.value]
        }, [])
      }
    }
  } else if (B.every((G) => G._def.typeName === "ZodEnum")) return {
    type: "string",
    enum: B.reduce((G, Z) => [...G, ...Z._def.values.filter((I) => !G.includes(I))], [])
  };
  return Fk2(A, Q)
}
// @from(Start 11646185, End 11646188)
iRA
// @from(Start 11646190, End 11646530)
Fk2 = (A, Q) => {
  let B = (A.options instanceof Map ? Array.from(A.options.values()) : A.options).map((G, Z) => U4(G._def, {
    ...Q,
    currentPath: [...Q.currentPath, "anyOf", `${Z}`]
  })).filter((G) => !!G && (!Q.strictUnions || typeof G === "object" && Object.keys(G).length > 0));
  return B.length ? {
    anyOf: B
  } : void 0
}
// @from(Start 11646536, End 11646699)
O51 = L(() => {
  BV();
  iRA = {
    ZodString: "string",
    ZodNumber: "number",
    ZodBigInt: "integer",
    ZodBoolean: "boolean",
    ZodNull: "null"
  }
})
// @from(Start 11646702, End 11647513)
function Dk2(A, Q) {
  if (["ZodString", "ZodNumber", "ZodBigInt", "ZodBoolean", "ZodNull"].includes(A.innerType._def.typeName) && (!A.innerType._def.checks || !A.innerType._def.checks.length)) {
    if (Q.target === "openApi3") return {
      type: iRA[A.innerType._def.typeName],
      nullable: !0
    };
    return {
      type: [iRA[A.innerType._def.typeName], "null"]
    }
  }
  if (Q.target === "openApi3") {
    let G = U4(A.innerType._def, {
      ...Q,
      currentPath: [...Q.currentPath]
    });
    if (G && "$ref" in G) return {
      allOf: [G],
      nullable: !0
    };
    return G && {
      ...G,
      nullable: !0
    }
  }
  let B = U4(A.innerType._def, {
    ...Q,
    currentPath: [...Q.currentPath, "anyOf", "0"]
  });
  return B && {
    anyOf: [B, {
      type: "null"
    }]
  }
}
// @from(Start 11647518, End 11647552)
f50 = L(() => {
  BV();
  O51()
})
// @from(Start 11647555, End 11648501)
function Hk2(A, Q) {
  let B = {
    type: "number"
  };
  if (!A.checks) return B;
  for (let G of A.checks) switch (G.kind) {
    case "int":
      B.type = "integer", O50(B, "type", G.message, Q);
      break;
    case "min":
      if (Q.target === "jsonSchema7")
        if (G.inclusive) a5(B, "minimum", G.value, G.message, Q);
        else a5(B, "exclusiveMinimum", G.value, G.message, Q);
      else {
        if (!G.inclusive) B.exclusiveMinimum = !0;
        a5(B, "minimum", G.value, G.message, Q)
      }
      break;
    case "max":
      if (Q.target === "jsonSchema7")
        if (G.inclusive) a5(B, "maximum", G.value, G.message, Q);
        else a5(B, "exclusiveMaximum", G.value, G.message, Q);
      else {
        if (!G.inclusive) B.exclusiveMaximum = !0;
        a5(B, "maximum", G.value, G.message, Q)
      }
      break;
    case "multipleOf":
      a5(B, "multipleOf", G.value, G.message, Q);
      break
  }
  return B
}
// @from(Start 11648506, End 11648520)
h50 = () => {}
// @from(Start 11648523, End 11649260)
function Ck2(A, Q) {
  let B = Q.target === "openAi",
    G = {
      type: "object",
      properties: {}
    },
    Z = [],
    I = A.shape();
  for (let J in I) {
    let W = I[J];
    if (W === void 0 || W._def === void 0) continue;
    let X = au5(W);
    if (X && B) {
      if (W instanceof e$) W = W._def.innerType;
      if (!W.isNullable()) W = W.nullable();
      X = !1
    }
    let V = U4(W._def, {
      ...Q,
      currentPath: [...Q.currentPath, "properties", J],
      propertyPath: [...Q.currentPath, "properties", J]
    });
    if (V === void 0) continue;
    if (G.properties[J] = V, !X) Z.push(J)
  }
  if (Z.length) G.required = Z;
  let Y = nu5(A, Q);
  if (Y !== void 0) G.additionalProperties = Y;
  return G
}
// @from(Start 11649262, End 11649735)
function nu5(A, Q) {
  if (A.catchall._def.typeName !== "ZodNever") return U4(A.catchall._def, {
    ...Q,
    currentPath: [...Q.currentPath, "additionalProperties"]
  });
  switch (A.unknownKeys) {
    case "passthrough":
      return Q.allowedAdditionalProperties;
    case "strict":
      return Q.rejectedAdditionalProperties;
    case "strip":
      return Q.removeAdditionalStrategy === "strict" ? Q.allowedAdditionalProperties : Q.rejectedAdditionalProperties
  }
}
// @from(Start 11649737, End 11649820)
function au5(A) {
  try {
    return A.isOptional()
  } catch {
    return !0
  }
}
// @from(Start 11649825, End 11649858)
g50 = L(() => {
  Q2();
  BV()
})
// @from(Start 11649864, End 11650139)
Ek2 = (A, Q) => {
  if (Q.currentPath.toString() === Q.propertyPath?.toString()) return U4(A.innerType._def, Q);
  let B = U4(A.innerType._def, {
    ...Q,
    currentPath: [...Q.currentPath, "anyOf", "1"]
  });
  return B ? {
    anyOf: [{
      not: {}
    }, B]
  } : {}
}
// @from(Start 11650145, End 11650170)
u50 = L(() => {
  BV()
})
// @from(Start 11650176, End 11650586)
zk2 = (A, Q) => {
  if (Q.pipeStrategy === "input") return U4(A.in._def, Q);
  else if (Q.pipeStrategy === "output") return U4(A.out._def, Q);
  let B = U4(A.in._def, {
      ...Q,
      currentPath: [...Q.currentPath, "allOf", "0"]
    }),
    G = U4(A.out._def, {
      ...Q,
      currentPath: [...Q.currentPath, "allOf", B ? "1" : "0"]
    });
  return {
    allOf: [B, G].filter((Z) => Z !== void 0)
  }
}
// @from(Start 11650592, End 11650617)
m50 = L(() => {
  BV()
})
// @from(Start 11650620, End 11650670)
function Uk2(A, Q) {
  return U4(A.type._def, Q)
}
// @from(Start 11650675, End 11650700)
d50 = L(() => {
  BV()
})
// @from(Start 11650703, End 11651043)
function $k2(A, Q) {
  let G = {
    type: "array",
    uniqueItems: !0,
    items: U4(A.valueType._def, {
      ...Q,
      currentPath: [...Q.currentPath, "items"]
    })
  };
  if (A.minSize) a5(G, "minItems", A.minSize.value, A.minSize.message, Q);
  if (A.maxSize) a5(G, "maxItems", A.maxSize.value, A.maxSize.message, Q);
  return G
}
// @from(Start 11651048, End 11651073)
c50 = L(() => {
  BV()
})
// @from(Start 11651076, End 11651734)
function wk2(A, Q) {
  if (A.rest) return {
    type: "array",
    minItems: A.items.length,
    items: A.items.map((B, G) => U4(B._def, {
      ...Q,
      currentPath: [...Q.currentPath, "items", `${G}`]
    })).reduce((B, G) => G === void 0 ? B : [...B, G], []),
    additionalItems: U4(A.rest._def, {
      ...Q,
      currentPath: [...Q.currentPath, "additionalItems"]
    })
  };
  else return {
    type: "array",
    minItems: A.items.length,
    maxItems: A.items.length,
    items: A.items.map((B, G) => U4(B._def, {
      ...Q,
      currentPath: [...Q.currentPath, "items", `${G}`]
    })).reduce((B, G) => G === void 0 ? B : [...B, G], [])
  }
}
// @from(Start 11651739, End 11651764)
p50 = L(() => {
  BV()
})
// @from(Start 11651767, End 11651812)
function qk2() {
  return {
    not: {}
  }
}
// @from(Start 11651814, End 11651844)
function Nk2() {
  return {}
}
// @from(Start 11651849, End 11651901)
Lk2 = (A, Q) => {
  return U4(A.innerType._def, Q)
}
// @from(Start 11651907, End 11651932)
l50 = L(() => {
  BV()
})
// @from(Start 11651938, End 11653626)
Mk2 = (A, Q, B) => {
  switch (Q) {
    case PQ.ZodString:
      return q51(A, B);
    case PQ.ZodNumber:
      return Hk2(A, B);
    case PQ.ZodObject:
      return Ck2(A, B);
    case PQ.ZodBigInt:
      return t_2(A, B);
    case PQ.ZodBoolean:
      return e_2();
    case PQ.ZodDate:
      return j50(A, B);
    case PQ.ZodUndefined:
      return qk2();
    case PQ.ZodNull:
      return Vk2(B);
    case PQ.ZodArray:
      return o_2(A, B);
    case PQ.ZodUnion:
    case PQ.ZodDiscriminatedUnion:
      return Kk2(A, B);
    case PQ.ZodIntersection:
      return Zk2(A, B);
    case PQ.ZodTuple:
      return wk2(A, B);
    case PQ.ZodRecord:
      return L51(A, B);
    case PQ.ZodLiteral:
      return Ik2(A, B);
    case PQ.ZodEnum:
      return Gk2(A);
    case PQ.ZodNativeEnum:
      return Wk2(A);
    case PQ.ZodNullable:
      return Dk2(A, B);
    case PQ.ZodOptional:
      return Ek2(A, B);
    case PQ.ZodMap:
      return Jk2(A, B);
    case PQ.ZodSet:
      return $k2(A, B);
    case PQ.ZodLazy:
      return () => A.getter()._def;
    case PQ.ZodPromise:
      return Uk2(A, B);
    case PQ.ZodNaN:
    case PQ.ZodNever:
      return Xk2();
    case PQ.ZodEffects:
      return Bk2(A, B);
    case PQ.ZodAny:
      return r_2();
    case PQ.ZodUnknown:
      return Nk2();
    case PQ.ZodDefault:
      return Qk2(A, B);
    case PQ.ZodBranded:
      return $51(A, B);
    case PQ.ZodReadonly:
      return Lk2(A, B);
    case PQ.ZodCatch:
      return Ak2(A, B);
    case PQ.ZodPipeline:
      return zk2(A, B);
    case PQ.ZodFunction:
    case PQ.ZodVoid:
    case PQ.ZodSymbol:
      return;
    default:
      return ((G) => {
        return
      })(Q)
  }
}
// @from(Start 11653632, End 11653846)
i50 = L(() => {
  Q2();
  R50();
  T50();
  w51();
  P50();
  S50();
  _50();
  k50();
  y50();
  b50();
  f50();
  h50();
  g50();
  u50();
  m50();
  d50();
  M51();
  c50();
  N51();
  p50();
  O51();
  l50()
})
// @from(Start 11653849, End 11654394)
function U4(A, Q, B = !1) {
  let G = Q.seen.get(A);
  if (Q.override) {
    let J = Q.override?.(A, Q, G, B);
    if (J !== n_2) return J
  }
  if (G && !B) {
    let J = su5(G, Q);
    if (J !== void 0) return J
  }
  let Z = {
    def: A,
    path: Q.currentPath,
    jsonSchema: void 0
  };
  Q.seen.set(A, Z);
  let I = Mk2(A, A.typeName, Q),
    Y = typeof I === "function" ? U4(I(), Q) : I;
  if (Y) ou5(A, Q, Y);
  if (Q.postProcess) {
    let J = Q.postProcess(Y, A, Q);
    return Z.jsonSchema = Y, J
  }
  return Z.jsonSchema = Y, Y
}
// @from(Start 11654399, End 11654939)
su5 = (A, Q) => {
    switch (Q.$refStrategy) {
      case "root":
        return {
          $ref: A.path.join("/")
        };
      case "relative":
        return {
          $ref: ru5(Q.currentPath, A.path)
        };
      case "none":
      case "seen": {
        if (A.path.length < Q.currentPath.length && A.path.every((B, G) => Q.currentPath[G] === B)) return console.warn(`Recursive reference detected at ${Q.currentPath.join("/")}! Defaulting to any`), {};
        return Q.$refStrategy === "seen" ? {} : void 0
      }
    }
  }
// @from(Start 11654943, End 11655121)
ru5 = (A, Q) => {
    let B = 0;
    for (; B < A.length && B < Q.length; B++)
      if (A[B] !== Q[B]) break;
    return [(A.length - B).toString(), ...Q.slice(B)].join("/")
  }
// @from(Start 11655125, End 11655295)
ou5 = (A, Q, B) => {
    if (A.description) {
      if (B.description = A.description, Q.markdownDescription) B.markdownDescription = A.description
    }
    return B
  }
// @from(Start 11655301, End 11655335)
BV = L(() => {
  U51();
  i50()
})
// @from(Start 11655341, End 11655355)
Ok2 = () => {}
// @from(Start 11655361, End 11656706)
nRA = (A, Q) => {
  let B = s_2(Q),
    G = typeof Q === "object" && Q.definitions ? Object.entries(Q.definitions).reduce((W, [X, V]) => ({
      ...W,
      [X]: U4(V._def, {
        ...B,
        currentPath: [...B.basePath, B.definitionPath, X]
      }, !0) ?? {}
    }), {}) : void 0,
    Z = typeof Q === "string" ? Q : Q?.nameStrategy === "title" ? void 0 : Q?.name,
    I = U4(A._def, Z === void 0 ? B : {
      ...B,
      currentPath: [...B.basePath, B.definitionPath, Z]
    }, !1) ?? {},
    Y = typeof Q === "object" && Q.name !== void 0 && Q.nameStrategy === "title" ? Q.name : void 0;
  if (Y !== void 0) I.title = Y;
  let J = Z === void 0 ? G ? {
    ...I,
    [B.definitionPath]: G
  } : I : {
    $ref: [...B.$refStrategy === "relative" ? [] : B.basePath, B.definitionPath, Z].join("/"),
    [B.definitionPath]: {
      ...G,
      [Z]: I
    }
  };
  if (B.target === "jsonSchema7") J.$schema = "http://json-schema.org/draft-07/schema#";
  else if (B.target === "jsonSchema2019-09" || B.target === "openAi") J.$schema = "https://json-schema.org/draft/2019-09/schema#";
  if (B.target === "openAi" && (("anyOf" in J) || ("oneOf" in J) || ("allOf" in J) || ("type" in J) && Array.isArray(J.type))) console.warn("Warning: OpenAI may not support schemas with unions as roots! Try wrapping it in an object property.");
  return J
}
// @from(Start 11656712, End 11656746)
n50 = L(() => {
  BV();
  M50()
})
// @from(Start 11656752, End 11657020)
a50 = L(() => {
  n50();
  U51();
  M50();
  BV();
  Ok2();
  R50();
  T50();
  w51();
  P50();
  S50();
  _50();
  k50();
  y50();
  b50();
  f50();
  h50();
  g50();
  u50();
  m50();
  d50();
  l50();
  M51();
  c50();
  N51();
  p50();
  O51();
  i50();
  n50()
})
// @from(Start 11657023, End 11657161)
function s50() {
  let A = nRA(sAA, {
    name: "ClaudeCodeSettings",
    $refStrategy: "none"
  });
  return JSON.stringify(A, null, 2)
}
// @from(Start 11657166, End 11657201)
Rk2 = L(() => {
  a50();
  PIA()
})
// @from(Start 11657204, End 11657258)
function Tk2(A) {
  return A.code === "invalid_type"
}
// @from(Start 11657260, End 11657317)
function Pk2(A) {
  return A.code === "invalid_literal"
}
// @from(Start 11657319, End 11657379)
function jk2(A) {
  return A.code === "invalid_enum_value"
}
// @from(Start 11657381, End 11657440)
function tu5(A) {
  return A.code === "unrecognized_keys"
}
// @from(Start 11657442, End 11657493)
function Sk2(A) {
  return A.code === "too_small"
}
// @from(Start 11657495, End 11658882)
function r50(A, Q) {
  return A.issues.map((B) => {
    let G = B.path.join("."),
      Z = B.message,
      I, Y, J, W;
    if (jk2(B)) Y = B.options.map((V) => String(V)), W = B.received;
    else if (Pk2(B)) J = String(B.expected), W = B.received;
    else if (Tk2(B)) J = B.expected, W = B.received;
    else if (Sk2(B)) J = String(B.minimum);
    else if (B.code === "custom" && "params" in B) W = B.params.received;
    let X = p_2({
      path: G,
      code: B.code,
      expected: J,
      received: W,
      enumValues: Y,
      message: B.message,
      value: W
    });
    if (Pk2(B)) I = `"${B.expected}"`, Z = `"${B.received}" is not valid. Expected: ${I}`;
    else if (jk2(B)) I = Y?.map((V) => `"${V}"`).join(", "), Z = `"${B.received}" is not valid. Expected one of: ${I}`;
    else if (Tk2(B))
      if (B.expected === "object" && B.received === "null" && G === "") Z = "Invalid or malformed JSON";
      else Z = `Expected ${B.expected}, but received ${B.received}`;
    else if (tu5(B)) {
      let V = B.keys.join(", ");
      Z = `Unrecognized field${B.keys.length>1?"s":""}: ${V}`
    } else if (Sk2(B)) Z = `Number must be greater than or equal to ${B.minimum}`, I = String(B.minimum);
    return {
      file: Q,
      path: G,
      message: Z,
      expected: I,
      invalidValue: W,
      suggestion: X?.suggestion,
      docLink: X?.docLink
    }
  })
}
// @from(Start 11658884, End 11659380)
function o50(A) {
  try {
    let Q = JSON.parse(A),
      B = sAA.strict().safeParse(Q);
    if (B.success) return {
      isValid: !0
    };
    return {
      isValid: !1,
      error: `Settings validation failed:
` + r50(B.error, "settings").map((I) => `- ${I.path}: ${I.message}`).join(`
`),
      fullSchema: s50()
    }
  } catch (Q) {
    return {
      isValid: !1,
      error: `Invalid JSON: ${Q instanceof Error?Q.message:"Unknown parsing error"}`,
      fullSchema: s50()
    }
  }
}
// @from(Start 11659385, End 11659429)
t50 = L(() => {
  PIA();
  l_2();
  Rk2()
})
// @from(Start 11659432, End 11659817)
function _k2(A, Q, B) {
  if (!e50(A)) return null;
  if (!o50(Q).isValid) return null;
  let Z = B(),
    I = o50(Z);
  if (!I.isValid) return {
    result: !1,
    message: `Claude Code settings.json validation failed after edit:
${I.error}

Full schema:
${I.fullSchema}
IMPORTANT: Do not update the env unless explicitly instructed to do so.`,
    errorCode: 10
  };
  return null
}
// @from(Start 11659822, End 11659856)
kk2 = L(() => {
  t50();
  EJ()
})
// @from(Start 11659901, End 11660676)
function yk2({
  file_path: A,
  operation: Q,
  patch: B,
  style: G,
  verbose: Z
}) {
  let {
    columns: I
  } = WB(), Y = pV.createElement(S, {
    flexDirection: "row"
  }, pV.createElement($, {
    color: "error"
  }, "User rejected ", Q, " to "), pV.createElement($, {
    bold: !0,
    color: "error"
  }, Z ? A : eu5(W0(), A)));
  if (G === "condensed" && !Z) return Y;
  return pV.createElement(S0, null, pV.createElement(S, {
    flexDirection: "column"
  }, Y, dV(B.map((J) => pV.createElement(S, {
    flexDirection: "column",
    key: J.newStart
  }, pV.createElement(J$, {
    patch: J,
    dim: !0,
    width: I - 12,
    filePath: A
  }))), (J) => pV.createElement(S, {
    key: `ellipsis-${J}`
  }, pV.createElement($, {
    dimColor: !0
  }, "...")))))
}
// @from(Start 11660681, End 11660683)
pV
// @from(Start 11660689, End 11660766)
xk2 = L(() => {
  hA();
  U2();
  En();
  i8();
  q8();
  pV = BA(VA(), 1)
})
// @from(Start 11660769, End 11660937)
function vk2(A) {
  if (!A) return "Update";
  if (A.file_path?.startsWith(kU())) return "Updated plan";
  if (A.old_string === "") return "Create";
  return "Update"
}
// @from(Start 11660939, End 11661017)
function bk2(A) {
  if (!A?.file_path) return null;
  return Q5(A.file_path)
}
// @from(Start 11661019, End 11661156)
function fk2({
  file_path: A
}, {
  verbose: Q
}) {
  if (!A) return null;
  if (A.startsWith(kU())) return "";
  return Q ? A : Q5(A)
}
// @from(Start 11661158, End 11661190)
function hk2() {
  return null
}
// @from(Start 11661192, End 11661560)
function gk2({
  filePath: A,
  structuredPatch: Q
}, B, {
  style: G,
  verbose: Z
}) {
  if (!Z && A.startsWith(kU())) {
    let I = Q5(A);
    return rY.createElement(S0, null, rY.createElement($, {
      dimColor: !0
    }, "/plan to preview · ", I))
  }
  return rY.createElement(E51, {
    filePath: A,
    structuredPatch: Q,
    style: G,
    verbose: Z
  })
}
// @from(Start 11661562, End 11662283)
function uk2({
  file_path: A,
  old_string: Q,
  new_string: B,
  replace_all: G = !1
}, Z) {
  let {
    style: I,
    verbose: Y
  } = Z;
  try {
    let J = RA().existsSync(A) ? RA().readFileSync(A, {
        encoding: "utf8"
      }) : "",
      W = T1A(J, Q) || Q,
      {
        patch: X
      } = K91({
        filePath: A,
        fileContents: J,
        oldString: W,
        newString: B,
        replaceAll: G
      });
    return rY.createElement(yk2, {
      file_path: A,
      operation: Q === "" ? "write" : "update",
      patch: X,
      style: I,
      verbose: Y
    })
  } catch (J) {
    return AA(J), rY.createElement(S0, {
      height: 1
    }, rY.createElement($, null, "(No changes)"))
  }
}
// @from(Start 11662285, End 11662769)
function mk2(A, Q) {
  let {
    verbose: B
  } = Q;
  if (!B && typeof A === "string" && B9(A, "tool_use_error")) {
    if (B9(A, "tool_use_error")?.includes("File has not been read yet")) return rY.createElement(S0, null, rY.createElement($, {
      dimColor: !0
    }, "File must be read first"));
    return rY.createElement(S0, null, rY.createElement($, {
      color: "error"
    }, "Error editing file"))
  }
  return rY.createElement(Q6, {
    result: A,
    verbose: B
  })
}
// @from(Start 11662774, End 11662776)
rY
// @from(Start 11662782, End 11662910)
dk2 = L(() => {
  hA();
  L50();
  yJ();
  xk2();
  q8();
  R9();
  cQ();
  P1A();
  AQ();
  g1();
  NE();
  rY = BA(VA(), 1)
})
// @from(Start 11663010, End 11663012)
lD
// @from(Start 11663018, End 11670577)
zn = L(() => {
  q0();
  u2();
  Q01();
  R9();
  U2();
  _0();
  Rh();
  c_2();
  P1A();
  EJ();
  yI();
  AQ();
  R1A();
  lRA();
  uMA();
  g1();
  V0();
  U50();
  kk2();
  sU();
  D51();
  dk2();
  lD = {
    name: $5,
    strict: !0,
    async description() {
      return "A tool for editing files"
    },
    async prompt() {
      return d_2
    },
    userFacingName: vk2,
    getToolUseSummary: bk2,
    isEnabled() {
      return !0
    },
    inputSchema: U_2,
    outputSchema: $_2,
    isConcurrencySafe() {
      return !1
    },
    isReadOnly() {
      return !1
    },
    getPath(A) {
      return A.file_path
    },
    async checkPermissions(A, Q) {
      let B = await Q.getAppState();
      return L0A(lD, A, B.toolPermissionContext)
    },
    renderToolUseMessage: fk2,
    renderToolUseProgressMessage: hk2,
    renderToolResultMessage: gk2,
    renderToolUseRejectedMessage: uk2,
    renderToolUseErrorMessage: mk2,
    async validateInput({
      file_path: A,
      old_string: Q,
      new_string: B,
      replace_all: G = !1
    }, Z) {
      if (Q === B) return {
        result: !1,
        behavior: "ask",
        message: "No changes to make: old_string and new_string are exactly the same.",
        errorCode: 1
      };
      let I = R51(A) ? A : Qm5(W0(), A),
        Y = await Z.getAppState();
      if (jD(I, Y.toolPermissionContext, "edit", "deny") !== null) return {
        result: !1,
        behavior: "ask",
        message: "File is in a directory that is denied by your permission settings.",
        errorCode: 2
      };
      let W = RA();
      if (W.existsSync(I) && Q === "") {
        if (W.readFileSync(I, {
            encoding: CH(I)
          }).replaceAll(`\r
`, `
`).trim() !== "") return {
          result: !1,
          behavior: "ask",
          message: "Cannot create new file - file already exists.",
          errorCode: 3
        };
        return {
          result: !0
        }
      }
      if (!W.existsSync(I) && Q === "") return {
        result: !0
      };
      if (!W.existsSync(I)) {
        let H = I01(I),
          C = "File does not exist.",
          E = W0(),
          U = uQ();
        if (E !== U) C += ` Current working directory: ${E}`;
        if (H) C += ` Did you mean ${H}?`;
        return {
          result: !1,
          behavior: "ask",
          message: C,
          errorCode: 4
        }
      }
      if (I.endsWith(".ipynb")) return {
        result: !1,
        behavior: "ask",
        message: `File is a Jupyter Notebook. Use the ${JS} to edit this file.`,
        errorCode: 5
      };
      let X = Z.readFileState.get(I);
      if (!X) return {
        result: !1,
        behavior: "ask",
        message: "File has not been read yet. Read it first before writing to it.",
        meta: {
          isFilePathAbsolute: String(R51(A))
        },
        errorCode: 6
      };
      if (X) {
        if (PD(I) > X.timestamp) return {
          result: !1,
          behavior: "ask",
          message: "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.",
          errorCode: 7
        }
      }
      let V = W.readFileSync(I, {
          encoding: CH(I)
        }).replaceAll(`\r
`, `
`),
        F = T1A(V, Q);
      if (!F) return {
        result: !1,
        behavior: "ask",
        message: `String to replace not found in file.
String: ${Q}`,
        meta: {
          isFilePathAbsolute: String(R51(A))
        },
        errorCode: 8
      };
      let K = V.split(F).length - 1;
      if (K > 1 && !G) return {
        result: !1,
        behavior: "ask",
        message: `Found ${K} matches of the string to replace, but replace_all is false. To replace all occurrences, set replace_all to true. To replace only one occurrence, please provide more context to uniquely identify the instance.
String: ${Q}`,
        meta: {
          isFilePathAbsolute: String(R51(A)),
          actualOldString: F
        },
        errorCode: 9
      };
      let D = _k2(I, V, () => {
        return G ? V.replaceAll(F, B) : V.replace(F, B)
      });
      if (D !== null) return D;
      return {
        result: !0,
        meta: {
          actualOldString: F
        }
      }
    },
    inputsEquivalent(A, Q) {
      return HI2({
        file_path: A.file_path,
        edits: [{
          old_string: A.old_string,
          new_string: A.new_string,
          replace_all: A.replace_all ?? !1
        }]
      }, {
        file_path: Q.file_path,
        edits: [{
          old_string: Q.old_string,
          new_string: Q.new_string,
          replace_all: Q.replace_all ?? !1
        }]
      })
    },
    async call({
      file_path: A,
      old_string: Q,
      new_string: B,
      replace_all: G = !1
    }, {
      readFileState: Z,
      userModified: I,
      updateFileHistoryState: Y,
      setAppState: J
    }, W, X) {
      let V = RA(),
        F = b9(A);
      await Oh.beforeFileEdited(F);
      let K = V.existsSync(F) ? _q(F) : "";
      if (V.existsSync(F)) {
        let R = PD(F),
          T = Z.get(F);
        if (!T || R > T.timestamp) throw Error("File has been unexpectedly modified. Read it again before attempting to write it.")
      }
      if (EG()) await kYA(Y, F, X.uuid);
      let D = T1A(K, Q) || Q,
        {
          patch: H,
          updatedFile: C
        } = K91({
          filePath: F,
          fileContents: K,
          oldString: D,
          newString: B,
          replaceAll: G
        }),
        E = Am5(F);
      V.mkdirSync(E);
      let U = V.existsSync(F) ? M0A(F) : "LF",
        q = V.existsSync(F) ? CH(F) : "utf8";
      KWA(F, C, q, U);
      let w = XWA();
      if (w) H91(`file://${F}`), w.changeFile(F, C).catch((R) => {
        g(`LSP: Failed to notify server of file change for ${F}: ${R.message}`), AA(R)
      }), w.saveFile(F).catch((R) => {
        g(`LSP: Failed to notify server of file save for ${F}: ${R.message}`), AA(R)
      });
      if (Z.set(F, {
          content: C,
          timestamp: PD(F),
          offset: void 0,
          limit: void 0
        }), K51(J), F.endsWith(`${Bm5}CLAUDE.md`)) GA("tengu_write_claudemd", {});
      return fMA(H), Uk({
        operation: "edit",
        tool: "FileEditTool",
        filePath: F
      }), {
        data: {
          filePath: A,
          oldString: D,
          newString: B,
          originalFile: K,
          structuredPatch: H,
          userModified: I ?? !1,
          replaceAll: G
        }
      }
    },
    mapToolResultToToolResultBlockParam({
      filePath: A,
      originalFile: Q,
      oldString: B,
      newString: G,
      userModified: Z,
      replaceAll: I
    }, Y) {
      let J = Z ? ".  The user modified your proposed changes before accepting them. " : "";
      if (I) return {
        tool_use_id: Y,
        type: "tool_result",
        content: `The file ${A} has been updated${J}. All occurrences of '${B}' were successfully replaced with '${G}'.`
      };
      if (BZ("tengu_file_edit_optimization", "enabled", !1)) return {
        tool_use_id: Y,
        type: "tool_result",
        content: `The file ${A} has been updated successfully${J}.`
      };
      let {
        snippet: X,
        startLine: V
      } = FI2(Q || "", B, G);
      return {
        tool_use_id: Y,
        type: "tool_result",
        content: `The file ${A} has been updated${J}. Here's the result of running \`cat -n\` on a snippet of the edited file:
${Sl({content:X,startLine:V})}`
      }
    }
  }
})
// @from(Start 11670583, End 11670653)
ck2 = "Replace the contents of a specific cell in a Jupyter notebook."
// @from(Start 11670657, End 11671178)
pk2 = "Completely replaces the contents of a specific cell in a Jupyter notebook (.ipynb file) with new source. Jupyter notebooks are interactive documents that combine code, text, and visualizations, commonly used for data analysis and scientific computing. The notebook_path parameter must be an absolute path, not a relative path. The cell_number is 0-indexed. Use edit_mode=insert to add a new cell at the index specified by cell_number. Use edit_mode=delete to delete the cell at the index specified by cell_number."
// @from(Start 11671223, End 11672004)
function lk2({
  notebook_path: A,
  cell_id: Q,
  new_source: B,
  cell_type: G,
  edit_mode: Z = "replace",
  verbose: I
}) {
  let Y = Z === "delete" ? "delete" : `${Z} cell in`;
  return lV.createElement(S0, null, lV.createElement(S, {
    flexDirection: "column"
  }, lV.createElement(S, {
    flexDirection: "row"
  }, lV.createElement($, {
    color: "error"
  }, "User rejected ", Y, " "), lV.createElement($, {
    bold: !0,
    color: "error"
  }, I ? A : Gm5(W0(), A)), lV.createElement($, {
    color: "error"
  }, " at cell ", Q)), Z !== "delete" && lV.createElement(S, {
    marginTop: 1,
    flexDirection: "column"
  }, lV.createElement($, {
    dimColor: !0
  }, lV.createElement(CO, {
    code: B,
    language: G === "markdown" ? "markdown" : "python"
  })))))
}
// @from(Start 11672009, End 11672011)
lV
// @from(Start 11672017, End 11672087)
ik2 = L(() => {
  hA();
  U2();
  q8();
  FWA();
  lV = BA(VA(), 1)
})
// @from(Start 11672090, End 11672176)
function nk2(A) {
  if (!A?.notebook_path) return null;
  return Q5(A.notebook_path)
}
// @from(Start 11672178, End 11672461)
function ak2({
  notebook_path: A,
  cell_id: Q,
  new_source: B,
  cell_type: G,
  edit_mode: Z
}, {
  verbose: I
}) {
  if (!A || !B || !G) return null;
  if (I) return `${A}@${Q}, content: ${B.slice(0,30)}…, cell_type: ${G}, edit_mode: ${Z??"replace"}`;
  return `${Q5(A)}@${Q}`
}
// @from(Start 11672463, End 11672699)
function sk2(A, {
  verbose: Q
}) {
  return LI.createElement(lk2, {
    notebook_path: A.notebook_path,
    cell_id: A.cell_id,
    new_source: A.new_source,
    cell_type: A.cell_type,
    edit_mode: A.edit_mode,
    verbose: Q
  })
}
// @from(Start 11672701, End 11672975)
function rk2(A, {
  verbose: Q
}) {
  if (!Q && typeof A === "string" && B9(A, "tool_use_error")) return LI.createElement(S0, null, LI.createElement($, {
    color: "error"
  }, "Error editing notebook"));
  return LI.createElement(Q6, {
    result: A,
    verbose: Q
  })
}
// @from(Start 11672977, End 11673009)
function ok2() {
  return null
}
// @from(Start 11673011, End 11673472)
function tk2({
  cell_id: A,
  new_source: Q,
  language: B,
  error: G
}) {
  if (G) return LI.createElement(S0, null, LI.createElement($, {
    color: "error"
  }, G));
  return LI.createElement(S0, null, LI.createElement(S, {
    flexDirection: "column"
  }, LI.createElement($, null, "Updated cell ", LI.createElement($, {
    bold: !0
  }, A), ":"), LI.createElement(S, {
    marginLeft: 2
  }, LI.createElement(CO, {
    code: Q,
    language: B
  }))))
}
// @from(Start 11673477, End 11673479)
LI
// @from(Start 11673485, End 11673580)
ek2 = L(() => {
  hA();
  FWA();
  ik2();
  q8();
  yJ();
  cQ();
  R9();
  LI = BA(VA(), 1)
})
// @from(Start 11673666, End 11673669)
Im5
// @from(Start 11673671, End 11673674)
Ym5
// @from(Start 11673676, End 11673678)
kP
// @from(Start 11673684, End 11681047)
DWA = L(() => {
  Q2();
  LrA();
  R9();
  LF();
  U2();
  EJ();
  AQ();
  sU();
  ek2();
  Im5 = j.strictObject({
    notebook_path: j.string().describe("The absolute path to the Jupyter notebook file to edit (must be absolute, not relative)"),
    cell_id: j.string().optional().describe("The ID of the cell to edit. When inserting a new cell, the new cell will be inserted after the cell with this ID, or at the beginning if not specified."),
    new_source: j.string().describe("The new source for the cell"),
    cell_type: j.enum(["code", "markdown"]).optional().describe("The type of the cell (code or markdown). If not specified, it defaults to the current cell type. If using edit_mode=insert, this is required."),
    edit_mode: j.enum(["replace", "insert", "delete"]).optional().describe("The type of edit to make (replace, insert, delete). Defaults to replace.")
  }), Ym5 = j.object({
    new_source: j.string().describe("The new source code that was written to the cell"),
    cell_id: j.string().optional().describe("The ID of the cell that was edited"),
    cell_type: j.enum(["code", "markdown"]).describe("The type of the cell"),
    language: j.string().describe("The programming language of the notebook"),
    edit_mode: j.string().describe("The edit mode that was used"),
    error: j.string().optional().describe("Error message if the operation failed")
  }), kP = {
    name: JS,
    async description() {
      return ck2
    },
    async prompt() {
      return pk2
    },
    userFacingName() {
      return "Edit Notebook"
    },
    getToolUseSummary: nk2,
    isEnabled() {
      return !0
    },
    inputSchema: Im5,
    outputSchema: Ym5,
    isConcurrencySafe() {
      return !1
    },
    isReadOnly() {
      return !1
    },
    getPath(A) {
      return A.notebook_path
    },
    async checkPermissions(A, Q) {
      let B = await Q.getAppState();
      return L0A(kP, A, B.toolPermissionContext)
    },
    mapToolResultToToolResultBlockParam({
      cell_id: A,
      edit_mode: Q,
      new_source: B,
      error: G
    }, Z) {
      if (G) return {
        tool_use_id: Z,
        type: "tool_result",
        content: G,
        is_error: !0
      };
      switch (Q) {
        case "replace":
          return {
            tool_use_id: Z, type: "tool_result", content: `Updated cell ${A} with ${B}`
          };
        case "insert":
          return {
            tool_use_id: Z, type: "tool_result", content: `Inserted cell ${A} with ${B}`
          };
        case "delete":
          return {
            tool_use_id: Z, type: "tool_result", content: `Deleted cell ${A}`
          };
        default:
          return {
            tool_use_id: Z, type: "tool_result", content: "Unknown edit mode"
          }
      }
    },
    renderToolUseMessage: ak2,
    renderToolUseRejectedMessage: sk2,
    renderToolUseErrorMessage: rk2,
    renderToolUseProgressMessage: ok2,
    renderToolResultMessage: tk2,
    async validateInput({
      notebook_path: A,
      cell_type: Q,
      cell_id: B,
      edit_mode: G = "replace"
    }) {
      let Z = Ay2(A) ? A : Qy2(W0(), A),
        I = RA();
      if (!I.existsSync(Z)) return {
        result: !1,
        message: "Notebook file does not exist.",
        errorCode: 1
      };
      if (Zm5(Z) !== ".ipynb") return {
        result: !1,
        message: "File must be a Jupyter notebook (.ipynb file). For editing other file types, use the FileEdit tool.",
        errorCode: 2
      };
      if (G !== "replace" && G !== "insert" && G !== "delete") return {
        result: !1,
        message: "Edit mode must be replace, insert, or delete.",
        errorCode: 4
      };
      if (G === "insert" && !Q) return {
        result: !1,
        message: "Cell type is required when using edit_mode=insert.",
        errorCode: 5
      };
      let Y = CH(Z),
        J = I.readFileSync(Z, {
          encoding: Y
        }),
        W = f7(J);
      if (!W) return {
        result: !1,
        message: "Notebook is not valid JSON.",
        errorCode: 6
      };
      if (!B) {
        if (G !== "insert") return {
          result: !1,
          message: "Cell ID must be specified when not inserting a new cell.",
          errorCode: 7
        }
      } else if (W.cells.findIndex((V) => V.id === B) === -1) {
        let V = S$A(B);
        if (V !== void 0) {
          if (!W.cells[V]) return {
            result: !1,
            message: `Cell with index ${V} does not exist in notebook.`,
            errorCode: 7
          }
        } else return {
          result: !1,
          message: `Cell with ID "${B}" not found in notebook.`,
          errorCode: 8
        }
      }
      return {
        result: !0
      }
    },
    async call({
      notebook_path: A,
      new_source: Q,
      cell_id: B,
      cell_type: G,
      edit_mode: Z
    }, {
      updateFileHistoryState: I
    }, Y, J) {
      let W = Ay2(A) ? A : Qy2(W0(), A);
      if (EG()) await kYA(I, W, J.uuid);
      try {
        let X = CH(W),
          V = RA().readFileSync(W, {
            encoding: X
          }),
          F = JSON.parse(V),
          K;
        if (!B) K = 0;
        else {
          if (K = F.cells.findIndex((q) => q.id === B), K === -1) {
            let q = S$A(B);
            if (q !== void 0) K = q
          }
          if (Z === "insert") K += 1
        }
        let D = Z;
        if (D === "replace" && K === F.cells.length) {
          if (D = "insert", !G) G = "code"
        }
        let H = F.metadata.language_info?.name ?? "python",
          C = void 0;
        if (F.nbformat > 4 || F.nbformat === 4 && F.nbformat_minor >= 5) {
          if (D === "insert") C = Math.random().toString(36).substring(2, 15);
          else if (B !== null) C = B
        }
        if (D === "delete") F.cells.splice(K, 1);
        else if (D === "insert") {
          let q;
          if (G === "markdown") q = {
            cell_type: "markdown",
            id: C,
            source: Q,
            metadata: {}
          };
          else q = {
            cell_type: "code",
            id: C,
            source: Q,
            metadata: {},
            execution_count: null,
            outputs: []
          };
          F.cells.splice(K, 0, q)
        } else {
          let q = F.cells[K];
          if (q.source = Q, q.cell_type === "code") q.execution_count = null, q.outputs = [];
          if (G && G !== q.cell_type) q.cell_type = G
        }
        let E = M0A(W);
        return KWA(W, JSON.stringify(F, null, 1), X, E), {
          data: {
            new_source: Q,
            cell_type: G ?? "code",
            language: H,
            edit_mode: D ?? "replace",
            cell_id: C || void 0,
            error: ""
          }
        }
      } catch (X) {
        if (X instanceof Error) return {
          data: {
            new_source: Q,
            cell_type: G ?? "code",
            language: "python",
            edit_mode: "replace",
            error: X.message,
            cell_id: B
          }
        };
        return {
          data: {
            new_source: Q,
            cell_type: G ?? "code",
            language: "python",
            edit_mode: "replace",
            error: "Unknown error occurred while editing notebook",
            cell_id: B
          }
        }
      }
    }
  }
})
// @from(Start 11681050, End 11682034)
function HWA(A, Q, B) {
  function G(J, W) {
    var X;
    Object.defineProperty(J, "_zod", {
      value: J._zod ?? {},
      enumerable: !1
    }), (X = J._zod).traits ?? (X.traits = new Set), J._zod.traits.add(A), Q(J, W);
    for (let V in Y.prototype)
      if (!(V in J)) Object.defineProperty(J, V, {
        value: Y.prototype[V].bind(J)
      });
    J._zod.constr = Y, J._zod.def = W
  }
  let Z = B?.Parent ?? Object;
  class I extends Z {}
  Object.defineProperty(I, "name", {
    value: A
  });

  function Y(J) {
    var W;
    let X = B?.Parent ? new I : this;
    G(X, J), (W = X._zod).deferred ?? (W.deferred = []);
    for (let V of X._zod.deferred) V();
    return X
  }
  return Object.defineProperty(Y, "init", {
    value: G
  }), Object.defineProperty(Y, Symbol.hasInstance, {
    value: (J) => {
      if (B?.Parent && J instanceof B.Parent) return !0;
      return J?._zod?.traits?.has(A)
    }
  }), Object.defineProperty(Y, "name", {
    value: A
  }), Y
}
// @from(Start 11682036, End 11682100)
function A30(A) {
  if (A) Object.assign(By2, A);
  return By2
}
// @from(Start 11682105, End 11682108)
Jm5
// @from(Start 11682110, End 11682113)
Wm5
// @from(Start 11682115, End 11682118)
By2
// @from(Start 11682124, End 11682232)
Q30 = L(() => {
  Jm5 = Object.freeze({
    status: "aborted"
  });
  Wm5 = Symbol("zod_brand"), By2 = {}
})
// @from(Start 11682235, End 11682406)
function Gy2(A) {
  let Q = Object.values(A).filter((G) => typeof G === "number");
  return Object.entries(A).filter(([G, Z]) => Q.indexOf(+G) === -1).map(([G, Z]) => Z)
}
// @from(Start 11682408, End 11682474)
function B30(A, Q = "|") {
  return A.map((B) => G30(B)).join(Q)
}
// @from(Start 11682476, End 11682559)
function Zy2(A, Q) {
  if (typeof Q === "bigint") return Q.toString();
  return Q
}
// @from(Start 11682561, End 11682789)
function Xm5(A) {
  return {
    get value() {
      {
        let B = A();
        return Object.defineProperty(this, "value", {
          value: B
        }), B
      }
      throw Error("cached value already set")
    }
  }
}
// @from(Start 11682791, End 11682928)
function G30(A) {
  if (typeof A === "bigint") return A.toString() + "n";
  if (typeof A === "string") return `"${A}"`;
  return `${A}`
}
// @from(Start 11682933, End 11682936)
W6Z
// @from(Start 11682938, End 11682941)
X6Z
// @from(Start 11682943, End 11682946)
V6Z
// @from(Start 11682952, End 11683538)
aRA = L(() => {
  W6Z = Error.captureStackTrace ? Error.captureStackTrace : (...A) => {}, X6Z = Xm5(() => {
    if (typeof navigator < "u" && navigator?.userAgent?.includes("Cloudflare")) return !1;
    try {
      return new Function(""), !0
    } catch (A) {
      return !1
    }
  });
  V6Z = {
    safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
    int32: [-2147483648, 2147483647],
    uint32: [0, 4294967295],
    float32: [-340282346638528860000000000000000000000, 340282346638528860000000000000000000000],
    float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
  }
})
// @from(Start 11683541, End 11683797)
function I30(A, Q = (B) => B.message) {
  let B = {},
    G = [];
  for (let Z of A.issues)
    if (Z.path.length > 0) B[Z.path[0]] = B[Z.path[0]] || [], B[Z.path[0]].push(Q(Z));
    else G.push(Q(Z));
  return {
    formErrors: G,
    fieldErrors: B
  }
}
// @from(Start 11683799, End 11684669)
function Y30(A, Q) {
  let B = Q || function(I) {
      return I.message
    },
    G = {
      _errors: []
    },
    Z = (I) => {
      for (let Y of I.issues)
        if (Y.code === "invalid_union" && Y.errors.length) Y.errors.map((J) => Z({
          issues: J
        }));
        else if (Y.code === "invalid_key") Z({
        issues: Y.issues
      });
      else if (Y.code === "invalid_element") Z({
        issues: Y.issues
      });
      else if (Y.path.length === 0) G._errors.push(B(Y));
      else {
        let J = G,
          W = 0;
        while (W < Y.path.length) {
          let X = Y.path[W];
          if (W !== Y.path.length - 1) J[X] = J[X] || {
            _errors: []
          };
          else J[X] = J[X] || {
            _errors: []
          }, J[X]._errors.push(B(Y));
          J = J[X], W++
        }
      }
    };
  return Z(A), G
}
// @from(Start 11684674, End 11685018)
Iy2 = (A, Q) => {
    A.name = "$ZodError", Object.defineProperty(A, "_zod", {
      value: A._zod,
      enumerable: !1
    }), Object.defineProperty(A, "issues", {
      value: Q,
      enumerable: !1
    }), Object.defineProperty(A, "message", {
      get() {
        return JSON.stringify(Q, Zy2, 2)
      },
      enumerable: !0
    })
  }
// @from(Start 11685022, End 11685025)
Yy2
// @from(Start 11685027, End 11685030)
K6Z
// @from(Start 11685036, End 11685156)
Jy2 = L(() => {
  Q30();
  aRA();
  Yy2 = HWA("$ZodError", Iy2), K6Z = HWA("$ZodError", Iy2, {
    Parent: Error
  })
})
// @from(Start 11685162, End 11685176)
Wy2 = () => {}
// @from(Start 11685182, End 11685401)
Vm5 = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))"
// @from(Start 11685405, End 11685408)
C6Z
// @from(Start 11685414, End 11685463)
Vy2 = L(() => {
  C6Z = new RegExp(`^${Vm5}$`)
})
// @from(Start 11685469, End 11685483)
Fy2 = () => {}
// @from(Start 11685489, End 11685503)
Ky2 = () => {}
// @from(Start 11685509, End 11685523)
Dy2 = () => {}
// @from(Start 11685526, End 11685582)
function J30() {
  return {
    localeError: Km5()
  }
}
// @from(Start 11685587, End 11685953)
Fm5 = (A) => {
    let Q = typeof A;
    switch (Q) {
      case "number":
        return Number.isNaN(A) ? "NaN" : "number";
      case "object": {
        if (Array.isArray(A)) return "array";
        if (A === null) return "null";
        if (Object.getPrototypeOf(A) !== Object.prototype && A.constructor) return A.constructor.name
      }
    }
    return Q
  }
// @from(Start 11685957, End 11689058)
Km5 = () => {
    let A = {
      string: {
        unit: "characters",
        verb: "to have"
      },
      file: {
        unit: "bytes",
        verb: "to have"
      },
      array: {
        unit: "items",
        verb: "to have"
      },
      set: {
        unit: "items",
        verb: "to have"
      }
    };

    function Q(G) {
      return A[G] ?? null
    }
    let B = {
      regex: "input",
      email: "email address",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO datetime",
      date: "ISO date",
      time: "ISO time",
      duration: "ISO duration",
      ipv4: "IPv4 address",
      ipv6: "IPv6 address",
      cidrv4: "IPv4 range",
      cidrv6: "IPv6 range",
      base64: "base64-encoded string",
      base64url: "base64url-encoded string",
      json_string: "JSON string",
      e164: "E.164 number",
      jwt: "JWT",
      template_literal: "input"
    };
    return (G) => {
      switch (G.code) {
        case "invalid_type":
          return `Invalid input: expected ${G.expected}, received ${Fm5(G.input)}`;
        case "invalid_value":
          if (G.values.length === 1) return `Invalid input: expected ${G30(G.values[0])}`;
          return `Invalid option: expected one of ${B30(G.values,"|")}`;
        case "too_big": {
          let Z = G.inclusive ? "<=" : "<",
            I = Q(G.origin);
          if (I) return `Too big: expected ${G.origin??"value"} to have ${Z}${G.maximum.toString()} ${I.unit??"elements"}`;
          return `Too big: expected ${G.origin??"value"} to be ${Z}${G.maximum.toString()}`
        }
        case "too_small": {
          let Z = G.inclusive ? ">=" : ">",
            I = Q(G.origin);
          if (I) return `Too small: expected ${G.origin} to have ${Z}${G.minimum.toString()} ${I.unit}`;
          return `Too small: expected ${G.origin} to be ${Z}${G.minimum.toString()}`
        }
        case "invalid_format": {
          let Z = G;
          if (Z.format === "starts_with") return `Invalid string: must start with "${Z.prefix}"`;
          if (Z.format === "ends_with") return `Invalid string: must end with "${Z.suffix}"`;
          if (Z.format === "includes") return `Invalid string: must include "${Z.includes}"`;
          if (Z.format === "regex") return `Invalid string: must match pattern ${Z.pattern}`;
          return `Invalid ${B[Z.format]??G.format}`
        }
        case "not_multiple_of":
          return `Invalid number: must be a multiple of ${G.divisor}`;
        case "unrecognized_keys":
          return `Unrecognized key${G.keys.length>1?"s":""}: ${B30(G.keys,", ")}`;
        case "invalid_key":
          return `Invalid key in ${G.origin}`;
        case "invalid_union":
          return "Invalid input";
        case "invalid_element":
          return `Invalid value in ${G.origin}`;
        default:
          return "Invalid input"
      }
    }
  }
// @from(Start 11689064, End 11689090)
Hy2 = L(() => {
  aRA()
})
// @from(Start 11689096, End 11689110)
W30 = () => {}
// @from(Start 11689112, End 11689772)
class T51 {
  constructor() {
    this._map = new WeakMap, this._idmap = new Map
  }
  add(A, ...Q) {
    let B = Q[0];
    if (this._map.set(A, B), B && typeof B === "object" && "id" in B) {
      if (this._idmap.has(B.id)) throw Error(`ID ${B.id} already exists in the registry`);
      this._idmap.set(B.id, A)
    }
    return this
  }
  remove(A) {
    return this._map.delete(A), this
  }
  get(A) {
    let Q = A._zod.parent;
    if (Q) {
      let B = {
        ...this.get(Q) ?? {}
      };
      return delete B.id, {
        ...B,
        ...this._map.get(A)
      }
    }
    return this._map.get(A)
  }
  has(A) {
    return this._map.has(A)
  }
}
// @from(Start 11689774, End 11689809)
function Ey2() {
  return new T51
}
// @from(Start 11689814, End 11689817)
Dm5
// @from(Start 11689819, End 11689822)
Hm5
// @from(Start 11689824, End 11689827)
X30
// @from(Start 11689833, End 11689920)
V30 = L(() => {
  Dm5 = Symbol("ZodOutput"), Hm5 = Symbol("ZodInput");
  X30 = Ey2()
})
// @from(Start 11689926, End 11689940)
zy2 = () => {}
// @from(Start 11689946, End 11689960)
Uy2 = () => {}
// @from(Start 11689962, End 11706425)
class F30 {
  constructor(A) {
    this.counter = 0, this.metadataRegistry = A?.metadata ?? X30, this.target = A?.target ?? "draft-2020-12", this.unrepresentable = A?.unrepresentable ?? "throw", this.override = A?.override ?? (() => {}), this.io = A?.io ?? "output", this.seen = new Map
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
      I = this.seen.get(A);
    if (I) {
      if (I.count++, Q.schemaPath.includes(A)) I.cycle = Q.path;
      return I.schema
    }
    let Y = {
      schema: {},
      count: 1,
      cycle: void 0,
      path: Q.path
    };
    this.seen.set(A, Y);
    let J = A._zod.toJSONSchema?.();
    if (J) Y.schema = J;
    else {
      let V = {
          ...Q,
          schemaPath: [...Q.schemaPath, A],
          path: Q.path
        },
        F = A._zod.parent;
      if (F) Y.ref = F, this.process(F, V), this.seen.get(F).isParent = !0;
      else {
        let K = Y.schema;
        switch (G.type) {
          case "string": {
            let D = K;
            D.type = "string";
            let {
              minimum: H,
              maximum: C,
              format: E,
              patterns: U,
              contentEncoding: q
            } = A._zod.bag;
            if (typeof H === "number") D.minLength = H;
            if (typeof C === "number") D.maxLength = C;
            if (E) {
              if (D.format = Z[E] ?? E, D.format === "") delete D.format
            }
            if (q) D.contentEncoding = q;
            if (U && U.size > 0) {
              let w = [...U];
              if (w.length === 1) D.pattern = w[0].source;
              else if (w.length > 1) Y.schema.allOf = [...w.map((N) => ({
                ...this.target === "draft-7" ? {
                  type: "string"
                } : {},
                pattern: N.source
              }))]
            }
            break
          }
          case "number": {
            let D = K,
              {
                minimum: H,
                maximum: C,
                format: E,
                multipleOf: U,
                exclusiveMaximum: q,
                exclusiveMinimum: w
              } = A._zod.bag;
            if (typeof E === "string" && E.includes("int")) D.type = "integer";
            else D.type = "number";
            if (typeof w === "number") D.exclusiveMinimum = w;
            if (typeof H === "number") {
              if (D.minimum = H, typeof w === "number")
                if (w >= H) delete D.minimum;
                else delete D.exclusiveMinimum
            }
            if (typeof q === "number") D.exclusiveMaximum = q;
            if (typeof C === "number") {
              if (D.maximum = C, typeof q === "number")
                if (q <= C) delete D.maximum;
                else delete D.exclusiveMaximum
            }
            if (typeof U === "number") D.multipleOf = U;
            break
          }
          case "boolean": {
            let D = K;
            D.type = "boolean";
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
            K.type = "null";
            break
          }
          case "any":
            break;
          case "unknown":
            break;
          case "undefined":
          case "never": {
            K.not = {};
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
            let D = K,
              {
                minimum: H,
                maximum: C
              } = A._zod.bag;
            if (typeof H === "number") D.minItems = H;
            if (typeof C === "number") D.maxItems = C;
            D.type = "array", D.items = this.process(G.element, {
              ...V,
              path: [...V.path, "items"]
            });
            break
          }
          case "object": {
            let D = K;
            D.type = "object", D.properties = {};
            let H = G.shape;
            for (let U in H) D.properties[U] = this.process(H[U], {
              ...V,
              path: [...V.path, "properties", U]
            });
            let C = new Set(Object.keys(H)),
              E = new Set([...C].filter((U) => {
                let q = G.shape[U]._zod;
                if (this.io === "input") return q.optin === void 0;
                else return q.optout === void 0
              }));
            if (E.size > 0) D.required = Array.from(E);
            if (G.catchall?._zod.def.type === "never") D.additionalProperties = !1;
            else if (!G.catchall) {
              if (this.io === "output") D.additionalProperties = !1
            } else if (G.catchall) D.additionalProperties = this.process(G.catchall, {
              ...V,
              path: [...V.path, "additionalProperties"]
            });
            break
          }
          case "union": {
            let D = K;
            D.anyOf = G.options.map((H, C) => this.process(H, {
              ...V,
              path: [...V.path, "anyOf", C]
            }));
            break
          }
          case "intersection": {
            let D = K,
              H = this.process(G.left, {
                ...V,
                path: [...V.path, "allOf", 0]
              }),
              C = this.process(G.right, {
                ...V,
                path: [...V.path, "allOf", 1]
              }),
              E = (q) => ("allOf" in q) && Object.keys(q).length === 1,
              U = [...E(H) ? H.allOf : [H], ...E(C) ? C.allOf : [C]];
            D.allOf = U;
            break
          }
          case "tuple": {
            let D = K;
            D.type = "array";
            let H = G.items.map((U, q) => this.process(U, {
              ...V,
              path: [...V.path, "prefixItems", q]
            }));
            if (this.target === "draft-2020-12") D.prefixItems = H;
            else D.items = H;
            if (G.rest) {
              let U = this.process(G.rest, {
                ...V,
                path: [...V.path, "items"]
              });
              if (this.target === "draft-2020-12") D.items = U;
              else D.additionalItems = U
            }
            if (G.rest) D.items = this.process(G.rest, {
              ...V,
              path: [...V.path, "items"]
            });
            let {
              minimum: C,
              maximum: E
            } = A._zod.bag;
            if (typeof C === "number") D.minItems = C;
            if (typeof E === "number") D.maxItems = E;
            break
          }
          case "record": {
            let D = K;
            D.type = "object", D.propertyNames = this.process(G.keyType, {
              ...V,
              path: [...V.path, "propertyNames"]
            }), D.additionalProperties = this.process(G.valueType, {
              ...V,
              path: [...V.path, "additionalProperties"]
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
            let D = K,
              H = Gy2(G.entries);
            if (H.every((C) => typeof C === "number")) D.type = "number";
            if (H.every((C) => typeof C === "string")) D.type = "string";
            D.enum = H;
            break
          }
          case "literal": {
            let D = K,
              H = [];
            for (let C of G.values)
              if (C === void 0) {
                if (this.unrepresentable === "throw") throw Error("Literal `undefined` cannot be represented in JSON Schema")
              } else if (typeof C === "bigint")
              if (this.unrepresentable === "throw") throw Error("BigInt literals cannot be represented in JSON Schema");
              else H.push(Number(C));
            else H.push(C);
            if (H.length === 0);
            else if (H.length === 1) {
              let C = H[0];
              D.type = C === null ? "null" : typeof C, D.const = C
            } else {
              if (H.every((C) => typeof C === "number")) D.type = "number";
              if (H.every((C) => typeof C === "string")) D.type = "string";
              if (H.every((C) => typeof C === "boolean")) D.type = "string";
              if (H.every((C) => C === null)) D.type = "null";
              D.enum = H
            }
            break
          }
          case "file": {
            let D = K,
              H = {
                type: "string",
                format: "binary",
                contentEncoding: "binary"
              },
              {
                minimum: C,
                maximum: E,
                mime: U
              } = A._zod.bag;
            if (C !== void 0) H.minLength = C;
            if (E !== void 0) H.maxLength = E;
            if (U)
              if (U.length === 1) H.contentMediaType = U[0], Object.assign(D, H);
              else D.anyOf = U.map((q) => {
                return {
                  ...H,
                  contentMediaType: q
                }
              });
            else Object.assign(D, H);
            break
          }
          case "transform": {
            if (this.unrepresentable === "throw") throw Error("Transforms cannot be represented in JSON Schema");
            break
          }
          case "nullable": {
            let D = this.process(G.innerType, V);
            K.anyOf = [D, {
              type: "null"
            }];
            break
          }
          case "nonoptional": {
            this.process(G.innerType, V), Y.ref = G.innerType;
            break
          }
          case "success": {
            let D = K;
            D.type = "boolean";
            break
          }
          case "default": {
            this.process(G.innerType, V), Y.ref = G.innerType, K.default = JSON.parse(JSON.stringify(G.defaultValue));
            break
          }
          case "prefault": {
            if (this.process(G.innerType, V), Y.ref = G.innerType, this.io === "input") K._prefault = JSON.parse(JSON.stringify(G.defaultValue));
            break
          }
          case "catch": {
            this.process(G.innerType, V), Y.ref = G.innerType;
            let D;
            try {
              D = G.catchValue(void 0)
            } catch {
              throw Error("Dynamic catch values are not supported in JSON Schema")
            }
            K.default = D;
            break
          }
          case "nan": {
            if (this.unrepresentable === "throw") throw Error("NaN cannot be represented in JSON Schema");
            break
          }
          case "template_literal": {
            let D = K,
              H = A._zod.pattern;
            if (!H) throw Error("Pattern not found in template literal");
            D.type = "string", D.pattern = H.source;
            break
          }
          case "pipe": {
            let D = this.io === "input" ? G.in._zod.def.type === "transform" ? G.out : G.in : G.out;
            this.process(D, V), Y.ref = D;
            break
          }
          case "readonly": {
            this.process(G.innerType, V), Y.ref = G.innerType, K.readOnly = !0;
            break
          }
          case "promise": {
            this.process(G.innerType, V), Y.ref = G.innerType;
            break
          }
          case "optional": {
            this.process(G.innerType, V), Y.ref = G.innerType;
            break
          }
          case "lazy": {
            let D = A._zod.innerType;
            this.process(D, V), Y.ref = D;
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
    let W = this.metadataRegistry.get(A);
    if (W) Object.assign(Y.schema, W);
    if (this.io === "input" && iV(A)) delete Y.schema.examples, delete Y.schema.default;
    if (this.io === "input" && Y.schema._prefault)(B = Y.schema).default ?? (B.default = Y.schema._prefault);
    return delete Y.schema._prefault, this.seen.get(A).schema
  }
  emit(A, Q) {
    let B = {
        cycles: Q?.cycles ?? "ref",
        reused: Q?.reused ?? "inline",
        external: Q?.external ?? void 0
      },
      G = this.seen.get(A);
    if (!G) throw Error("Unprocessed schema. This is a bug in Zod.");
    let Z = (X) => {
        let V = this.target === "draft-2020-12" ? "$defs" : "definitions";
        if (B.external) {
          let H = B.external.registry.get(X[0])?.id;
          if (H) return {
            ref: B.external.uri(H)
          };
          let C = X[1].defId ?? X[1].schema.id ?? `schema${this.counter++}`;
          return X[1].defId = C, {
            defId: C,
            ref: `${B.external.uri("__shared")}#/${V}/${C}`
          }
        }
        if (X[1] === G) return {
          ref: "#"
        };
        let K = `${"#"}/${V}/`,
          D = X[1].schema.id ?? `__schema${this.counter++}`;
        return {
          defId: D,
          ref: K + D
        }
      },
      I = (X) => {
        if (X[1].schema.$ref) return;
        let V = X[1],
          {
            ref: F,
            defId: K
          } = Z(X);
        if (V.def = {
            ...V.schema
          }, K) V.defId = K;
        let D = V.schema;
        for (let H in D) delete D[H];
        D.$ref = F
      };
    for (let X of this.seen.entries()) {
      let V = X[1];
      if (A === X[0]) {
        I(X);
        continue
      }
      if (B.external) {
        let K = B.external.registry.get(X[0])?.id;
        if (A !== X[0] && K) {
          I(X);
          continue
        }
      }
      if (this.metadataRegistry.get(X[0])?.id) {
        I(X);
        continue
      }
      if (V.cycle) {
        if (B.cycles === "throw") throw Error(`Cycle detected: #/${V.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
        else if (B.cycles === "ref") I(X);
        continue
      }
      if (V.count > 1) {
        if (B.reused === "ref") {
          I(X);
          continue
        }
      }
    }
    let Y = (X, V) => {
      let F = this.seen.get(X),
        K = F.def ?? F.schema,
        D = {
          ...K
        };
      if (F.ref === null) return;
      let H = F.ref;
      if (F.ref = null, H) {
        Y(H, V);
        let C = this.seen.get(H).schema;
        if (C.$ref && V.target === "draft-7") K.allOf = K.allOf ?? [], K.allOf.push(C);
        else Object.assign(K, C), Object.assign(K, D)
      }
      if (!F.isParent) this.override({
        zodSchema: X,
        jsonSchema: K,
        path: F.path ?? []
      })
    };
    for (let X of [...this.seen.entries()].reverse()) Y(X[0], {
      target: this.target
    });
    let J = {};
    if (this.target === "draft-2020-12") J.$schema = "https://json-schema.org/draft/2020-12/schema";
    else if (this.target === "draft-7") J.$schema = "http://json-schema.org/draft-07/schema#";
    else console.warn(`Invalid target: ${this.target}`);
    Object.assign(J, G.def);
    let W = B.external?.defs ?? {};
    for (let X of this.seen.entries()) {
      let V = X[1];
      if (V.def && V.defId) W[V.defId] = V.def
    }
    if (!B.external && Object.keys(W).length > 0)
      if (this.target === "draft-2020-12") J.$defs = W;
      else J.definitions = W;
    try {
      return JSON.parse(JSON.stringify(J))
    } catch (X) {
      throw Error("Error converting schema to JSON.")
    }
  }
}
// @from(Start 11706427, End 11707100)
function K30(A, Q) {
  if (A instanceof T51) {
    let G = new F30(Q),
      Z = {};
    for (let J of A._idmap.entries()) {
      let [W, X] = J;
      G.process(X)
    }
    let I = {},
      Y = {
        registry: A,
        uri: Q?.uri || ((J) => J),
        defs: Z
      };
    for (let J of A._idmap.entries()) {
      let [W, X] = J;
      I[W] = G.emit(X, {
        ...Q,
        external: Y
      })
    }
    if (Object.keys(Z).length > 0) {
      let J = G.target === "draft-2020-12" ? "$defs" : "definitions";
      I.__shared = {
        [J]: Z
      }
    }
    return {
      schemas: I
    }
  }
  let B = new F30(Q);
  return B.process(A), B.emit(A, Q)
}
// @from(Start 11707102, End 11708840)
function iV(A, Q) {
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
      return iV(Z.element, B);
    case "object": {
      for (let I in Z.shape)
        if (iV(Z.shape[I], B)) return !0;
      return !1
    }
    case "union": {
      for (let I of Z.options)
        if (iV(I, B)) return !0;
      return !1
    }
    case "intersection":
      return iV(Z.left, B) || iV(Z.right, B);
    case "tuple": {
      for (let I of Z.items)
        if (iV(I, B)) return !0;
      if (Z.rest && iV(Z.rest, B)) return !0;
      return !1
    }
    case "record":
      return iV(Z.keyType, B) || iV(Z.valueType, B);
    case "map":
      return iV(Z.keyType, B) || iV(Z.valueType, B);
    case "set":
      return iV(Z.valueType, B);
    case "promise":
    case "optional":
    case "nonoptional":
    case "nullable":
    case "readonly":
      return iV(Z.innerType, B);
    case "lazy":
      return iV(Z.getter(), B);
    case "default":
      return iV(Z.innerType, B);
    case "prefault":
      return iV(Z.innerType, B);
    case "custom":
      return !1;
    case "transform":
      return !0;
    case "pipe":
      return iV(Z.in, B) || iV(Z.out, B);
    case "success":
      return !1;
    case "catch":
      return !1;
    default:
  }
  throw Error(`Unknown schema type: ${Z.type}`)
}
// @from(Start 11708845, End 11708880)
$y2 = L(() => {
  V30();
  aRA()
})
// @from(Start 11708886, End 11708900)
wy2 = () => {}
// @from(Start 11708906, End 11709049)
CWA = L(() => {
  aRA();
  Vy2();
  W30();
  wy2();
  Q30();
  Wy2();
  Jy2();
  Dy2();
  Fy2();
  Ky2();
  V30();
  Uy2();
  zy2();
  $y2()
})
// @from(Start 11709055, End 11709069)
Ny2 = () => {}
// @from(Start 11709075, End 11709089)
Ly2 = () => {}
// @from(Start 11709095, End 11709534)
My2 = (A, Q) => {
    Yy2.init(A, Q), A.name = "ZodError", Object.defineProperties(A, {
      format: {
        value: (B) => Y30(A, B)
      },
      flatten: {
        value: (B) => I30(A, B)
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
// @from(Start 11709538, End 11709541)
u6Z
// @from(Start 11709543, End 11709546)
m6Z
// @from(Start 11709552, End 11709670)
Oy2 = L(() => {
  CWA();
  CWA();
  u6Z = HWA("ZodError", My2), m6Z = HWA("ZodError", My2, {
    Parent: Error
  })
})
// @from(Start 11709676, End 11709690)
Ry2 = () => {}
// @from(Start 11709696, End 11709710)
Ty2 = () => {}
// @from(Start 11709716, End 11709730)
Py2 = () => {}
// @from(Start 11709736, End 11709750)
jy2 = () => {}
// @from(Start 11709756, End 11709895)
Sy2 = L(() => {
  CWA();
  CWA();
  Hy2();
  CWA();
  W30();
  Ly2();
  jy2();
  Ty2();
  Ny2();
  Oy2();
  Ry2();
  Py2();
  A30(J30())
})
// @from(Start 11709901, End 11709927)
_y2 = L(() => {
  Sy2()
})
// @from(Start 11709933, End 11709959)
ky2 = L(() => {
  _y2()
})
// @from(Start 11709962, End 11710062)
function zm5(A) {
  return A !== null && typeof A === "object" && "_zod" in A && A._zod !== void 0
}
// @from(Start 11710064, End 11710128)
function sRA(A) {
  if (zm5(A)) return K30(A);
  return nRA(A)
}
// @from(Start 11710133, End 11710168)
D30 = L(() => {
  ky2();
  a50()
})
// @from(Start 11710174, End 11710194)
P51 = "ExitPlanMode"
// @from(Start 11710198, End 11710218)
rRA = "ExitPlanMode"
// @from(Start 11710224, End 11711020)
j51 = z((xy2) => {
  Object.defineProperty(xy2, "__esModule", {
    value: !0
  });
  xy2.getDeepKeys = xy2.toJSON = void 0;
  var Um5 = ["function", "symbol", "undefined"],
    $m5 = ["constructor", "prototype", "__proto__"],
    wm5 = Object.getPrototypeOf({});

  function qm5() {
    let A = {},
      Q = this;
    for (let B of yy2(Q))
      if (typeof B === "string") {
        let G = Q[B],
          Z = typeof G;
        if (!Um5.includes(Z)) A[B] = G
      } return A
  }
  xy2.toJSON = qm5;

  function yy2(A, Q = []) {
    let B = [];
    while (A && A !== wm5) B = B.concat(Object.getOwnPropertyNames(A), Object.getOwnPropertySymbols(A)), A = Object.getPrototypeOf(A);
    let G = new Set(B);
    for (let Z of Q.concat($m5)) G.delete(Z);
    return G
  }
  xy2.getDeepKeys = yy2
})
// @from(Start 11711026, End 11711537)
H30 = z((hy2) => {
  Object.defineProperty(hy2, "__esModule", {
    value: !0
  });
  hy2.addInspectMethod = hy2.format = void 0;
  var by2 = UA("util"),
    Lm5 = j51(),
    fy2 = by2.inspect.custom || Symbol.for("nodejs.util.inspect.custom");
  hy2.format = by2.format;

  function Mm5(A) {
    A[fy2] = Om5
  }
  hy2.addInspectMethod = Mm5;

  function Om5() {
    let A = {},
      Q = this;
    for (let B of Lm5.getDeepKeys(Q)) {
      let G = Q[B];
      A[B] = G
    }
    return delete A[fy2], A
  }
})
// @from(Start 11711543, End 11712988)
py2 = z((dy2) => {
  Object.defineProperty(dy2, "__esModule", {
    value: !0
  });
  dy2.lazyJoinStacks = dy2.joinStacks = dy2.isWritableStack = dy2.isLazyStack = void 0;
  var Tm5 = /\r?\n/,
    Pm5 = /\bono[ @]/;

  function jm5(A) {
    return Boolean(A && A.configurable && typeof A.get === "function")
  }
  dy2.isLazyStack = jm5;

  function Sm5(A) {
    return Boolean(!A || A.writable || typeof A.set === "function")
  }
  dy2.isWritableStack = Sm5;

  function uy2(A, Q) {
    let B = my2(A.stack),
      G = Q ? Q.stack : void 0;
    if (B && G) return B + `

` + G;
    else return B || G
  }
  dy2.joinStacks = uy2;

  function _m5(A, Q, B) {
    if (B) Object.defineProperty(Q, "stack", {
      get: () => {
        let G = A.get.apply(Q);
        return uy2({
          stack: G
        }, B)
      },
      enumerable: !1,
      configurable: !0
    });
    else km5(Q, A)
  }
  dy2.lazyJoinStacks = _m5;

  function my2(A) {
    if (A) {
      let Q = A.split(Tm5),
        B;
      for (let G = 0; G < Q.length; G++) {
        let Z = Q[G];
        if (Pm5.test(Z)) {
          if (B === void 0) B = G
        } else if (B !== void 0) {
          Q.splice(B, G - B);
          break
        }
      }
      if (Q.length > 0) return Q.join(`
`)
    }
    return A
  }

  function km5(A, Q) {
    Object.defineProperty(A, "stack", {
      get: () => my2(Q.get.apply(A)),
      enumerable: !1,
      configurable: !0
    })
  }
})
// @from(Start 11712994, End 11713874)
sy2 = z((ny2) => {
  Object.defineProperty(ny2, "__esModule", {
    value: !0
  });
  ny2.extendError = void 0;
  var ly2 = H30(),
    S51 = py2(),
    iy2 = j51(),
    bm5 = ["name", "message", "stack"];

  function fm5(A, Q, B) {
    let G = A;
    if (hm5(G, Q), Q && typeof Q === "object") gm5(G, Q);
    if (G.toJSON = iy2.toJSON, ly2.addInspectMethod) ly2.addInspectMethod(G);
    if (B && typeof B === "object") Object.assign(G, B);
    return G
  }
  ny2.extendError = fm5;

  function hm5(A, Q) {
    let B = Object.getOwnPropertyDescriptor(A, "stack");
    if (S51.isLazyStack(B)) S51.lazyJoinStacks(B, A, Q);
    else if (S51.isWritableStack(B)) A.stack = S51.joinStacks(A, Q)
  }

  function gm5(A, Q) {
    let B = iy2.getDeepKeys(Q, bm5),
      G = A,
      Z = Q;
    for (let I of B)
      if (G[I] === void 0) try {
        G[I] = Z[I]
      } catch (Y) {}
  }
})
// @from(Start 11713880, End 11714853)
ty2 = z((ry2) => {
  Object.defineProperty(ry2, "__esModule", {
    value: !0
  });
  ry2.normalizeArgs = ry2.normalizeOptions = void 0;
  var um5 = H30();

  function mm5(A) {
    return A = A || {}, {
      concatMessages: A.concatMessages === void 0 ? !0 : Boolean(A.concatMessages),
      format: A.format === void 0 ? um5.format : typeof A.format === "function" ? A.format : !1
    }
  }
  ry2.normalizeOptions = mm5;

  function dm5(A, Q) {
    let B, G, Z, I = "";
    if (typeof A[0] === "string") Z = A;
    else if (typeof A[1] === "string") {
      if (A[0] instanceof Error) B = A[0];
      else G = A[0];
      Z = A.slice(1)
    } else B = A[0], G = A[1], Z = A.slice(2);
    if (Z.length > 0)
      if (Q.format) I = Q.format.apply(void 0, Z);
      else I = Z.join(" ");
    if (Q.concatMessages && B && B.message) I += (I ? ` 
` : "") + B.message;
    return {
      originalError: B,
      props: G,
      message: I
    }
  }
  ry2.normalizeArgs = dm5
})
// @from(Start 11714859, End 11715597)
E30 = z((Ax2) => {
  Object.defineProperty(Ax2, "__esModule", {
    value: !0
  });
  Ax2.Ono = void 0;
  var _51 = sy2(),
    ey2 = ty2(),
    pm5 = j51(),
    lm5 = C30;
  Ax2.Ono = lm5;

  function C30(A, Q) {
    Q = ey2.normalizeOptions(Q);

    function B(...G) {
      let {
        originalError: Z,
        props: I,
        message: Y
      } = ey2.normalizeArgs(G, Q), J = new A(Y);
      return _51.extendError(J, Z, I)
    }
    return B[Symbol.species] = A, B
  }
  C30.toJSON = function(Q) {
    return pm5.toJSON.call(Q)
  };
  C30.extend = function(Q, B, G) {
    if (G || B instanceof Error) return _51.extendError(Q, B, G);
    else if (B) return _51.extendError(Q, void 0, B);
    else return _51.extendError(Q)
  }
})