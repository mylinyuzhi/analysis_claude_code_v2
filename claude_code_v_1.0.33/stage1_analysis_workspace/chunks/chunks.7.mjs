
// @from(Start 543538, End 547153)
i_0 = z((mB7, l_0) => {
  function ct9(A) {
    return {
      name: "Coq",
      keywords: {
        keyword: "_|0 as at cofix else end exists exists2 fix for forall fun if IF in let match mod Prop return Set then Type using where with Abort About Add Admit Admitted All Arguments Assumptions Axiom Back BackTo Backtrack Bind Blacklist Canonical Cd Check Class Classes Close Coercion Coercions CoFixpoint CoInductive Collection Combined Compute Conjecture Conjectures Constant constr Constraint Constructors Context Corollary CreateHintDb Cut Declare Defined Definition Delimit Dependencies Dependent Derive Drop eauto End Equality Eval Example Existential Existentials Existing Export exporting Extern Extract Extraction Fact Field Fields File Fixpoint Focus for From Function Functional Generalizable Global Goal Grab Grammar Graph Guarded Heap Hint HintDb Hints Hypotheses Hypothesis ident Identity If Immediate Implicit Import Include Inductive Infix Info Initial Inline Inspect Instance Instances Intro Intros Inversion Inversion_clear Language Left Lemma Let Libraries Library Load LoadPath Local Locate Ltac ML Mode Module Modules Monomorphic Morphism Next NoInline Notation Obligation Obligations Opaque Open Optimize Options Parameter Parameters Parametric Path Paths pattern Polymorphic Preterm Print Printing Program Projections Proof Proposition Pwd Qed Quit Rec Record Recursive Redirect Relation Remark Remove Require Reserved Reset Resolve Restart Rewrite Right Ring Rings Save Scheme Scope Scopes Script Search SearchAbout SearchHead SearchPattern SearchRewrite Section Separate Set Setoid Show Solve Sorted Step Strategies Strategy Structure SubClass Table Tables Tactic Term Test Theorem Time Timeout Transparent Type Typeclasses Types Undelimit Undo Unfocus Unfocused Unfold Universe Universes Unset Unshelve using Variable Variables Variant Verbose Visibility where with",
        built_in: "abstract absurd admit after apply as assert assumption at auto autorewrite autounfold before bottom btauto by case case_eq cbn cbv change classical_left classical_right clear clearbody cofix compare compute congruence constr_eq constructor contradict contradiction cut cutrewrite cycle decide decompose dependent destruct destruction dintuition discriminate discrR do double dtauto eapply eassumption eauto ecase econstructor edestruct ediscriminate eelim eexact eexists einduction einjection eleft elim elimtype enough equality erewrite eright esimplify_eq esplit evar exact exactly_once exfalso exists f_equal fail field field_simplify field_simplify_eq first firstorder fix fold fourier functional generalize generalizing gfail give_up has_evar hnf idtac in induction injection instantiate intro intro_pattern intros intuition inversion inversion_clear is_evar is_var lapply lazy left lia lra move native_compute nia nsatz omega once pattern pose progress proof psatz quote record red refine reflexivity remember rename repeat replace revert revgoals rewrite rewrite_strat right ring ring_simplify rtauto set setoid_reflexivity setoid_replace setoid_rewrite setoid_symmetry setoid_transitivity shelve shelve_unifiable simpl simple simplify_eq solve specialize split split_Rabs split_Rmult stepl stepr subst sum swap symmetry tactic tauto time timeout top transitivity trivial try tryif unfold unify until using vm_compute with"
      },
      contains: [A.QUOTE_STRING_MODE, A.COMMENT("\\(\\*", "\\*\\)"), A.C_NUMBER_MODE, {
        className: "type",
        excludeBegin: !0,
        begin: "\\|\\s*",
        end: "\\w+"
      }, {
        begin: /[-=]>/
      }]
    }
  }
  l_0.exports = ct9
})
// @from(Start 547159, End 549036)
a_0 = z((dB7, n_0) => {
  function pt9(A) {
    return {
      name: "Caché Object Script",
      case_insensitive: !0,
      aliases: ["cls"],
      keywords: "property parameter class classmethod clientmethod extends as break catch close continue do d|0 else elseif for goto halt hang h|0 if job j|0 kill k|0 lock l|0 merge new open quit q|0 read r|0 return set s|0 tcommit throw trollback try tstart use view while write w|0 xecute x|0 zkill znspace zn ztrap zwrite zw zzdump zzwrite print zbreak zinsert zload zprint zremove zsave zzprint mv mvcall mvcrt mvdim mvprint zquit zsync ascii",
      contains: [{
        className: "number",
        begin: "\\b(\\d+(\\.\\d*)?|\\.\\d+)",
        relevance: 0
      }, {
        className: "string",
        variants: [{
          begin: '"',
          end: '"',
          contains: [{
            begin: '""',
            relevance: 0
          }]
        }]
      }, A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE, {
        className: "comment",
        begin: /;/,
        end: "$",
        relevance: 0
      }, {
        className: "built_in",
        begin: /(?:\$\$?|\.\.)\^?[a-zA-Z]+/
      }, {
        className: "built_in",
        begin: /\$\$\$[a-zA-Z]+/
      }, {
        className: "built_in",
        begin: /%[a-z]+(?:\.[a-z]+)*/
      }, {
        className: "symbol",
        begin: /\^%?[a-zA-Z][\w]*/
      }, {
        className: "keyword",
        begin: /##class|##super|#define|#dim/
      }, {
        begin: /&sql\(/,
        end: /\)/,
        excludeBegin: !0,
        excludeEnd: !0,
        subLanguage: "sql"
      }, {
        begin: /&(js|jscript|javascript)</,
        end: />/,
        excludeBegin: !0,
        excludeEnd: !0,
        subLanguage: "javascript"
      }, {
        begin: /&html<\s*</,
        end: />\s*>/,
        subLanguage: "xml"
      }]
    }
  }
  n_0.exports = pt9
})
// @from(Start 549042, End 556116)
r_0 = z((cB7, s_0) => {
  function lt9(A) {
    if (!A) return null;
    if (typeof A === "string") return A;
    return A.source
  }

  function it9(A) {
    return vD1("(?=", A, ")")
  }

  function nyA(A) {
    return vD1("(", A, ")?")
  }

  function vD1(...A) {
    return A.map((B) => lt9(B)).join("")
  }

  function nt9(A) {
    let Q = A.COMMENT("//", "$", {
        contains: [{
          begin: /\\\n/
        }]
      }),
      B = "decltype\\(auto\\)",
      G = "[a-zA-Z_]\\w*::",
      Z = "<[^<>]+>",
      I = "(decltype\\(auto\\)|" + nyA("[a-zA-Z_]\\w*::") + "[a-zA-Z_]\\w*" + nyA("<[^<>]+>") + ")",
      Y = {
        className: "keyword",
        begin: "\\b[a-z\\d_]*_t\\b"
      },
      J = "\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)",
      W = {
        className: "string",
        variants: [{
          begin: '(u8?|U|L)?"',
          end: '"',
          illegal: "\\n",
          contains: [A.BACKSLASH_ESCAPE]
        }, {
          begin: "(u8?|U|L)?'(\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)|.)",
          end: "'",
          illegal: "."
        }, A.END_SAME_AS_BEGIN({
          begin: /(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,
          end: /\)([^()\\ ]{0,16})"/
        })]
      },
      X = {
        className: "number",
        variants: [{
          begin: "\\b(0b[01']+)"
        }, {
          begin: "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)((ll|LL|l|L)(u|U)?|(u|U)(ll|LL|l|L)?|f|F|b|B)"
        }, {
          begin: "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)"
        }],
        relevance: 0
      },
      V = {
        className: "meta",
        begin: /#\s*[a-z]+\b/,
        end: /$/,
        keywords: {
          "meta-keyword": "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include"
        },
        contains: [{
          begin: /\\\n/,
          relevance: 0
        }, A.inherit(W, {
          className: "meta-string"
        }), {
          className: "meta-string",
          begin: /<.*?>/
        }, Q, A.C_BLOCK_COMMENT_MODE]
      },
      F = {
        className: "title",
        begin: nyA("[a-zA-Z_]\\w*::") + A.IDENT_RE,
        relevance: 0
      },
      K = nyA("[a-zA-Z_]\\w*::") + A.IDENT_RE + "\\s*\\(",
      H = {
        keyword: "int float while private char char8_t char16_t char32_t catch import module export virtual operator sizeof dynamic_cast|10 typedef const_cast|10 const for static_cast|10 union namespace unsigned long volatile static protected bool template mutable if public friend do goto auto void enum else break extern using asm case typeid wchar_t short reinterpret_cast|10 default double register explicit signed typename try this switch continue inline delete alignas alignof constexpr consteval constinit decltype concept co_await co_return co_yield requires noexcept static_assert thread_local restrict final override atomic_bool atomic_char atomic_schar atomic_uchar atomic_short atomic_ushort atomic_int atomic_uint atomic_long atomic_ulong atomic_llong atomic_ullong new throw return and and_eq bitand bitor compl not not_eq or or_eq xor xor_eq",
        built_in: "_Bool _Complex _Imaginary",
        _relevance_hints: ["asin", "atan2", "atan", "calloc", "ceil", "cosh", "cos", "exit", "exp", "fabs", "floor", "fmod", "fprintf", "fputs", "free", "frexp", "auto_ptr", "deque", "list", "queue", "stack", "vector", "map", "set", "pair", "bitset", "multiset", "multimap", "unordered_set", "fscanf", "future", "isalnum", "isalpha", "iscntrl", "isdigit", "isgraph", "islower", "isprint", "ispunct", "isspace", "isupper", "isxdigit", "tolower", "toupper", "labs", "ldexp", "log10", "log", "malloc", "realloc", "memchr", "memcmp", "memcpy", "memset", "modf", "pow", "printf", "putchar", "puts", "scanf", "sinh", "sin", "snprintf", "sprintf", "sqrt", "sscanf", "strcat", "strchr", "strcmp", "strcpy", "strcspn", "strlen", "strncat", "strncmp", "strncpy", "strpbrk", "strrchr", "strspn", "strstr", "tanh", "tan", "unordered_map", "unordered_multiset", "unordered_multimap", "priority_queue", "make_pair", "array", "shared_ptr", "abort", "terminate", "abs", "acos", "vfprintf", "vprintf", "vsprintf", "endl", "initializer_list", "unique_ptr", "complex", "imaginary", "std", "string", "wstring", "cin", "cout", "cerr", "clog", "stdin", "stdout", "stderr", "stringstream", "istringstream", "ostringstream"],
        literal: "true false nullptr NULL"
      },
      C = {
        className: "function.dispatch",
        relevance: 0,
        keywords: H,
        begin: vD1(/\b/, /(?!decltype)/, /(?!if)/, /(?!for)/, /(?!while)/, A.IDENT_RE, it9(/\s*\(/))
      },
      E = [C, V, Y, Q, A.C_BLOCK_COMMENT_MODE, X, W],
      U = {
        variants: [{
          begin: /=/,
          end: /;/
        }, {
          begin: /\(/,
          end: /\)/
        }, {
          beginKeywords: "new throw return else",
          end: /;/
        }],
        keywords: H,
        contains: E.concat([{
          begin: /\(/,
          end: /\)/,
          keywords: H,
          contains: E.concat(["self"]),
          relevance: 0
        }]),
        relevance: 0
      },
      q = {
        className: "function",
        begin: "(" + I + "[\\*&\\s]+)+" + K,
        returnBegin: !0,
        end: /[{;=]/,
        excludeEnd: !0,
        keywords: H,
        illegal: /[^\w\s\*&:<>.]/,
        contains: [{
          begin: "decltype\\(auto\\)",
          keywords: H,
          relevance: 0
        }, {
          begin: K,
          returnBegin: !0,
          contains: [F],
          relevance: 0
        }, {
          begin: /::/,
          relevance: 0
        }, {
          begin: /:/,
          endsWithParent: !0,
          contains: [W, X]
        }, {
          className: "params",
          begin: /\(/,
          end: /\)/,
          keywords: H,
          relevance: 0,
          contains: [Q, A.C_BLOCK_COMMENT_MODE, W, X, Y, {
            begin: /\(/,
            end: /\)/,
            keywords: H,
            relevance: 0,
            contains: ["self", Q, A.C_BLOCK_COMMENT_MODE, W, X, Y]
          }]
        }, Y, Q, A.C_BLOCK_COMMENT_MODE, V]
      };
    return {
      name: "C++",
      aliases: ["cc", "c++", "h++", "hpp", "hh", "hxx", "cxx"],
      keywords: H,
      illegal: "</",
      classNameAliases: {
        "function.dispatch": "built_in"
      },
      contains: [].concat(U, q, C, E, [V, {
        begin: "\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<",
        end: ">",
        keywords: H,
        contains: ["self", Y]
      }, {
        begin: A.IDENT_RE + "::",
        keywords: H
      }, {
        className: "class",
        beginKeywords: "enum class struct union",
        end: /[{;:<>=]/,
        contains: [{
          beginKeywords: "final class struct"
        }, A.TITLE_MODE]
      }]),
      exports: {
        preprocessor: V,
        strings: W,
        keywords: H
      }
    }
  }
  s_0.exports = nt9
})
// @from(Start 556122, End 558384)
t_0 = z((pB7, o_0) => {
  function at9(A) {
    let B = "group clone ms master location colocation order fencing_topology rsc_ticket acl_target acl_group user role tag xml",
      G = "property rsc_defaults op_defaults",
      Z = "params meta operations op rule attributes utilization",
      I = "read write deny defined not_defined in_range date spec in ref reference attribute type xpath version and or lt gt tag lte gte eq ne \\",
      Y = "number string",
      J = "Master Started Slave Stopped start promote demote stop monitor true false";
    return {
      name: "crmsh",
      aliases: ["crm", "pcmk"],
      case_insensitive: !0,
      keywords: {
        keyword: "params meta operations op rule attributes utilization " + I + " number string",
        literal: "Master Started Slave Stopped start promote demote stop monitor true false"
      },
      contains: [A.HASH_COMMENT_MODE, {
        beginKeywords: "node",
        starts: {
          end: "\\s*([\\w_-]+:)?",
          starts: {
            className: "title",
            end: "\\s*[\\$\\w_][\\w_-]*"
          }
        }
      }, {
        beginKeywords: "primitive rsc_template",
        starts: {
          className: "title",
          end: "\\s*[\\$\\w_][\\w_-]*",
          starts: {
            end: "\\s*@?[\\w_][\\w_\\.:-]*"
          }
        }
      }, {
        begin: "\\b(" + B.split(" ").join("|") + ")\\s+",
        keywords: B,
        starts: {
          className: "title",
          end: "[\\$\\w_][\\w_-]*"
        }
      }, {
        beginKeywords: "property rsc_defaults op_defaults",
        starts: {
          className: "title",
          end: "\\s*([\\w_-]+:)?"
        }
      }, A.QUOTE_STRING_MODE, {
        className: "meta",
        begin: "(ocf|systemd|service|lsb):[\\w_:-]+",
        relevance: 0
      }, {
        className: "number",
        begin: "\\b\\d+(\\.\\d+)?(ms|s|h|m)?",
        relevance: 0
      }, {
        className: "literal",
        begin: "[-]?(infinity|inf)",
        relevance: 0
      }, {
        className: "attr",
        begin: /([A-Za-z$_#][\w_-]+)=/,
        relevance: 0
      }, {
        className: "tag",
        begin: "</?",
        end: "/?>",
        relevance: 0
      }]
    }
  }
  o_0.exports = at9
})
// @from(Start 558390, End 564564)
Ak0 = z((lB7, e_0) => {
  function st9(A) {
    let Y = {
        $pattern: "[a-zA-Z_]\\w*[!?=]?",
        keyword: "abstract alias annotation as as? asm begin break case class def do else elsif end ensure enum extend for fun if include instance_sizeof is_a? lib macro module next nil? of out pointerof private protected rescue responds_to? return require select self sizeof struct super then type typeof union uninitialized unless until verbatim when while with yield __DIR__ __END_LINE__ __FILE__ __LINE__",
        literal: "false nil true"
      },
      J = {
        className: "subst",
        begin: /#\{/,
        end: /\}/,
        keywords: Y
      },
      W = {
        className: "template-variable",
        variants: [{
          begin: "\\{\\{",
          end: "\\}\\}"
        }, {
          begin: "\\{%",
          end: "%\\}"
        }],
        keywords: Y
      };

    function X(E, U) {
      let q = [{
        begin: E,
        end: U
      }];
      return q[0].contains = q, q
    }
    let V = {
        className: "string",
        contains: [A.BACKSLASH_ESCAPE, J],
        variants: [{
          begin: /'/,
          end: /'/
        }, {
          begin: /"/,
          end: /"/
        }, {
          begin: /`/,
          end: /`/
        }, {
          begin: "%[Qwi]?\\(",
          end: "\\)",
          contains: X("\\(", "\\)")
        }, {
          begin: "%[Qwi]?\\[",
          end: "\\]",
          contains: X("\\[", "\\]")
        }, {
          begin: "%[Qwi]?\\{",
          end: /\}/,
          contains: X(/\{/, /\}/)
        }, {
          begin: "%[Qwi]?<",
          end: ">",
          contains: X("<", ">")
        }, {
          begin: "%[Qwi]?\\|",
          end: "\\|"
        }, {
          begin: /<<-\w+$/,
          end: /^\s*\w+$/
        }],
        relevance: 0
      },
      F = {
        className: "string",
        variants: [{
          begin: "%q\\(",
          end: "\\)",
          contains: X("\\(", "\\)")
        }, {
          begin: "%q\\[",
          end: "\\]",
          contains: X("\\[", "\\]")
        }, {
          begin: "%q\\{",
          end: /\}/,
          contains: X(/\{/, /\}/)
        }, {
          begin: "%q<",
          end: ">",
          contains: X("<", ">")
        }, {
          begin: "%q\\|",
          end: "\\|"
        }, {
          begin: /<<-'\w+'$/,
          end: /^\s*\w+$/
        }],
        relevance: 0
      },
      K = {
        begin: "(?!%\\})(" + A.RE_STARTERS_RE + "|\\n|\\b(case|if|select|unless|until|when|while)\\b)\\s*",
        keywords: "case if select unless until when while",
        contains: [{
          className: "regexp",
          contains: [A.BACKSLASH_ESCAPE, J],
          variants: [{
            begin: "//[a-z]*",
            relevance: 0
          }, {
            begin: "/(?!\\/)",
            end: "/[a-z]*"
          }]
        }],
        relevance: 0
      },
      D = {
        className: "regexp",
        contains: [A.BACKSLASH_ESCAPE, J],
        variants: [{
          begin: "%r\\(",
          end: "\\)",
          contains: X("\\(", "\\)")
        }, {
          begin: "%r\\[",
          end: "\\]",
          contains: X("\\[", "\\]")
        }, {
          begin: "%r\\{",
          end: /\}/,
          contains: X(/\{/, /\}/)
        }, {
          begin: "%r<",
          end: ">",
          contains: X("<", ">")
        }, {
          begin: "%r\\|",
          end: "\\|"
        }],
        relevance: 0
      },
      H = {
        className: "meta",
        begin: "@\\[",
        end: "\\]",
        contains: [A.inherit(A.QUOTE_STRING_MODE, {
          className: "meta-string"
        })]
      },
      C = [W, V, F, D, K, H, A.HASH_COMMENT_MODE, {
        className: "class",
        beginKeywords: "class module struct",
        end: "$|;",
        illegal: /=/,
        contains: [A.HASH_COMMENT_MODE, A.inherit(A.TITLE_MODE, {
          begin: "[A-Za-z_]\\w*(::\\w+)*(\\?|!)?"
        }), {
          begin: "<"
        }]
      }, {
        className: "class",
        beginKeywords: "lib enum union",
        end: "$|;",
        illegal: /=/,
        contains: [A.HASH_COMMENT_MODE, A.inherit(A.TITLE_MODE, {
          begin: "[A-Za-z_]\\w*(::\\w+)*(\\?|!)?"
        })]
      }, {
        beginKeywords: "annotation",
        end: "$|;",
        illegal: /=/,
        contains: [A.HASH_COMMENT_MODE, A.inherit(A.TITLE_MODE, {
          begin: "[A-Za-z_]\\w*(::\\w+)*(\\?|!)?"
        })],
        relevance: 2
      }, {
        className: "function",
        beginKeywords: "def",
        end: /\B\b/,
        contains: [A.inherit(A.TITLE_MODE, {
          begin: "[a-zA-Z_]\\w*[!?=]?|[-+~]@|<<|>>|[=!]~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~|]|//|//=|&[-+*]=?|&\\*\\*|\\[\\][=?]?",
          endsParent: !0
        })]
      }, {
        className: "function",
        beginKeywords: "fun macro",
        end: /\B\b/,
        contains: [A.inherit(A.TITLE_MODE, {
          begin: "[a-zA-Z_]\\w*[!?=]?|[-+~]@|<<|>>|[=!]~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~|]|//|//=|&[-+*]=?|&\\*\\*|\\[\\][=?]?",
          endsParent: !0
        })],
        relevance: 2
      }, {
        className: "symbol",
        begin: A.UNDERSCORE_IDENT_RE + "(!|\\?)?:",
        relevance: 0
      }, {
        className: "symbol",
        begin: ":",
        contains: [V, {
          begin: "[a-zA-Z_]\\w*[!?=]?|[-+~]@|<<|>>|[=!]~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~|]|//|//=|&[-+*]=?|&\\*\\*|\\[\\][=?]?"
        }],
        relevance: 0
      }, {
        className: "number",
        variants: [{
          begin: "\\b0b([01_]+)(_?[ui](8|16|32|64|128))?"
        }, {
          begin: "\\b0o([0-7_]+)(_?[ui](8|16|32|64|128))?"
        }, {
          begin: "\\b0x([A-Fa-f0-9_]+)(_?[ui](8|16|32|64|128))?"
        }, {
          begin: "\\b([1-9][0-9_]*[0-9]|[0-9])(\\.[0-9][0-9_]*)?([eE]_?[-+]?[0-9_]*)?(_?f(32|64))?(?!_)"
        }, {
          begin: "\\b([1-9][0-9_]*|0)(_?[ui](8|16|32|64|128))?"
        }],
        relevance: 0
      }];
    return J.contains = C, W.contains = C.slice(1), {
      name: "Crystal",
      aliases: ["cr"],
      keywords: Y,
      contains: C
    }
  }
  e_0.exports = st9
})
// @from(Start 564570, End 570463)
Bk0 = z((iB7, Qk0) => {
  function rt9(A) {
    let Q = ["bool", "byte", "char", "decimal", "delegate", "double", "dynamic", "enum", "float", "int", "long", "nint", "nuint", "object", "sbyte", "short", "string", "ulong", "uint", "ushort"],
      B = ["public", "private", "protected", "static", "internal", "protected", "abstract", "async", "extern", "override", "unsafe", "virtual", "new", "sealed", "partial"],
      G = ["default", "false", "null", "true"],
      Z = ["abstract", "as", "base", "break", "case", "class", "const", "continue", "do", "else", "event", "explicit", "extern", "finally", "fixed", "for", "foreach", "goto", "if", "implicit", "in", "interface", "internal", "is", "lock", "namespace", "new", "operator", "out", "override", "params", "private", "protected", "public", "readonly", "record", "ref", "return", "sealed", "sizeof", "stackalloc", "static", "struct", "switch", "this", "throw", "try", "typeof", "unchecked", "unsafe", "using", "virtual", "void", "volatile", "while"],
      I = ["add", "alias", "and", "ascending", "async", "await", "by", "descending", "equals", "from", "get", "global", "group", "init", "into", "join", "let", "nameof", "not", "notnull", "on", "or", "orderby", "partial", "remove", "select", "set", "unmanaged", "value|0", "var", "when", "where", "with", "yield"],
      Y = {
        keyword: Z.concat(I),
        built_in: Q,
        literal: G
      },
      J = A.inherit(A.TITLE_MODE, {
        begin: "[a-zA-Z](\\.?\\w)*"
      }),
      W = {
        className: "number",
        variants: [{
          begin: "\\b(0b[01']+)"
        }, {
          begin: "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)(u|U|l|L|ul|UL|f|F|b|B)"
        }, {
          begin: "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)"
        }],
        relevance: 0
      },
      X = {
        className: "string",
        begin: '@"',
        end: '"',
        contains: [{
          begin: '""'
        }]
      },
      V = A.inherit(X, {
        illegal: /\n/
      }),
      F = {
        className: "subst",
        begin: /\{/,
        end: /\}/,
        keywords: Y
      },
      K = A.inherit(F, {
        illegal: /\n/
      }),
      D = {
        className: "string",
        begin: /\$"/,
        end: '"',
        illegal: /\n/,
        contains: [{
          begin: /\{\{/
        }, {
          begin: /\}\}/
        }, A.BACKSLASH_ESCAPE, K]
      },
      H = {
        className: "string",
        begin: /\$@"/,
        end: '"',
        contains: [{
          begin: /\{\{/
        }, {
          begin: /\}\}/
        }, {
          begin: '""'
        }, F]
      },
      C = A.inherit(H, {
        illegal: /\n/,
        contains: [{
          begin: /\{\{/
        }, {
          begin: /\}\}/
        }, {
          begin: '""'
        }, K]
      });
    F.contains = [H, D, X, A.APOS_STRING_MODE, A.QUOTE_STRING_MODE, W, A.C_BLOCK_COMMENT_MODE], K.contains = [C, D, V, A.APOS_STRING_MODE, A.QUOTE_STRING_MODE, W, A.inherit(A.C_BLOCK_COMMENT_MODE, {
      illegal: /\n/
    })];
    let E = {
        variants: [H, D, X, A.APOS_STRING_MODE, A.QUOTE_STRING_MODE]
      },
      U = {
        begin: "<",
        end: ">",
        contains: [{
          beginKeywords: "in out"
        }, J]
      },
      q = A.IDENT_RE + "(<" + A.IDENT_RE + "(\\s*,\\s*" + A.IDENT_RE + ")*>)?(\\[\\])?",
      w = {
        begin: "@" + A.IDENT_RE,
        relevance: 0
      };
    return {
      name: "C#",
      aliases: ["cs", "c#"],
      keywords: Y,
      illegal: /::/,
      contains: [A.COMMENT("///", "$", {
        returnBegin: !0,
        contains: [{
          className: "doctag",
          variants: [{
            begin: "///",
            relevance: 0
          }, {
            begin: "<!--|-->"
          }, {
            begin: "</?",
            end: ">"
          }]
        }]
      }), A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE, {
        className: "meta",
        begin: "#",
        end: "$",
        keywords: {
          "meta-keyword": "if else elif endif define undef warning error line region endregion pragma checksum"
        }
      }, E, W, {
        beginKeywords: "class interface",
        relevance: 0,
        end: /[{;=]/,
        illegal: /[^\s:,]/,
        contains: [{
          beginKeywords: "where class"
        }, J, U, A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE]
      }, {
        beginKeywords: "namespace",
        relevance: 0,
        end: /[{;=]/,
        illegal: /[^\s:]/,
        contains: [J, A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE]
      }, {
        beginKeywords: "record",
        relevance: 0,
        end: /[{;=]/,
        illegal: /[^\s:]/,
        contains: [J, U, A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE]
      }, {
        className: "meta",
        begin: "^\\s*\\[",
        excludeBegin: !0,
        end: "\\]",
        excludeEnd: !0,
        contains: [{
          className: "meta-string",
          begin: /"/,
          end: /"/
        }]
      }, {
        beginKeywords: "new return throw await else",
        relevance: 0
      }, {
        className: "function",
        begin: "(" + q + "\\s+)+" + A.IDENT_RE + "\\s*(<.+>\\s*)?\\(",
        returnBegin: !0,
        end: /\s*[{;=]/,
        excludeEnd: !0,
        keywords: Y,
        contains: [{
          beginKeywords: B.join(" "),
          relevance: 0
        }, {
          begin: A.IDENT_RE + "\\s*(<.+>\\s*)?\\(",
          returnBegin: !0,
          contains: [A.TITLE_MODE, U],
          relevance: 0
        }, {
          className: "params",
          begin: /\(/,
          end: /\)/,
          excludeBegin: !0,
          excludeEnd: !0,
          keywords: Y,
          relevance: 0,
          contains: [E, W, A.C_BLOCK_COMMENT_MODE]
        }, A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE]
      }, w]
    }
  }
  Qk0.exports = rt9
})
// @from(Start 570469, End 571072)
Zk0 = z((nB7, Gk0) => {
  function ot9(A) {
    return {
      name: "CSP",
      case_insensitive: !1,
      keywords: {
        $pattern: "[a-zA-Z][a-zA-Z0-9_-]*",
        keyword: "base-uri child-src connect-src default-src font-src form-action frame-ancestors frame-src img-src media-src object-src plugin-types report-uri sandbox script-src style-src"
      },
      contains: [{
        className: "string",
        begin: "'",
        end: "'"
      }, {
        className: "attribute",
        begin: "^Content",
        end: ":",
        excludeEnd: !0
      }]
    }
  }
  Gk0.exports = ot9
})
// @from(Start 571078, End 579574)
Yk0 = z((aB7, Ik0) => {
  var tt9 = (A) => {
      return {
        IMPORTANT: {
          className: "meta",
          begin: "!important"
        },
        HEXCOLOR: {
          className: "number",
          begin: "#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})"
        },
        ATTRIBUTE_SELECTOR_MODE: {
          className: "selector-attr",
          begin: /\[/,
          end: /\]/,
          illegal: "$",
          contains: [A.APOS_STRING_MODE, A.QUOTE_STRING_MODE]
        }
      }
    },
    et9 = ["a", "abbr", "address", "article", "aside", "audio", "b", "blockquote", "body", "button", "canvas", "caption", "cite", "code", "dd", "del", "details", "dfn", "div", "dl", "dt", "em", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "html", "i", "iframe", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "mark", "menu", "nav", "object", "ol", "p", "q", "quote", "samp", "section", "span", "strong", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "tr", "ul", "var", "video"],
    Ae9 = ["any-hover", "any-pointer", "aspect-ratio", "color", "color-gamut", "color-index", "device-aspect-ratio", "device-height", "device-width", "display-mode", "forced-colors", "grid", "height", "hover", "inverted-colors", "monochrome", "orientation", "overflow-block", "overflow-inline", "pointer", "prefers-color-scheme", "prefers-contrast", "prefers-reduced-motion", "prefers-reduced-transparency", "resolution", "scan", "scripting", "update", "width", "min-width", "max-width", "min-height", "max-height"],
    Qe9 = ["active", "any-link", "blank", "checked", "current", "default", "defined", "dir", "disabled", "drop", "empty", "enabled", "first", "first-child", "first-of-type", "fullscreen", "future", "focus", "focus-visible", "focus-within", "has", "host", "host-context", "hover", "indeterminate", "in-range", "invalid", "is", "lang", "last-child", "last-of-type", "left", "link", "local-link", "not", "nth-child", "nth-col", "nth-last-child", "nth-last-col", "nth-last-of-type", "nth-of-type", "only-child", "only-of-type", "optional", "out-of-range", "past", "placeholder-shown", "read-only", "read-write", "required", "right", "root", "scope", "target", "target-within", "user-invalid", "valid", "visited", "where"],
    Be9 = ["after", "backdrop", "before", "cue", "cue-region", "first-letter", "first-line", "grammar-error", "marker", "part", "placeholder", "selection", "slotted", "spelling-error"],
    Ge9 = ["align-content", "align-items", "align-self", "animation", "animation-delay", "animation-direction", "animation-duration", "animation-fill-mode", "animation-iteration-count", "animation-name", "animation-play-state", "animation-timing-function", "auto", "backface-visibility", "background", "background-attachment", "background-clip", "background-color", "background-image", "background-origin", "background-position", "background-repeat", "background-size", "border", "border-bottom", "border-bottom-color", "border-bottom-left-radius", "border-bottom-right-radius", "border-bottom-style", "border-bottom-width", "border-collapse", "border-color", "border-image", "border-image-outset", "border-image-repeat", "border-image-slice", "border-image-source", "border-image-width", "border-left", "border-left-color", "border-left-style", "border-left-width", "border-radius", "border-right", "border-right-color", "border-right-style", "border-right-width", "border-spacing", "border-style", "border-top", "border-top-color", "border-top-left-radius", "border-top-right-radius", "border-top-style", "border-top-width", "border-width", "bottom", "box-decoration-break", "box-shadow", "box-sizing", "break-after", "break-before", "break-inside", "caption-side", "clear", "clip", "clip-path", "color", "column-count", "column-fill", "column-gap", "column-rule", "column-rule-color", "column-rule-style", "column-rule-width", "column-span", "column-width", "columns", "content", "counter-increment", "counter-reset", "cursor", "direction", "display", "empty-cells", "filter", "flex", "flex-basis", "flex-direction", "flex-flow", "flex-grow", "flex-shrink", "flex-wrap", "float", "font", "font-display", "font-family", "font-feature-settings", "font-kerning", "font-language-override", "font-size", "font-size-adjust", "font-smoothing", "font-stretch", "font-style", "font-variant", "font-variant-ligatures", "font-variation-settings", "font-weight", "height", "hyphens", "icon", "image-orientation", "image-rendering", "image-resolution", "ime-mode", "inherit", "initial", "justify-content", "left", "letter-spacing", "line-height", "list-style", "list-style-image", "list-style-position", "list-style-type", "margin", "margin-bottom", "margin-left", "margin-right", "margin-top", "marks", "mask", "max-height", "max-width", "min-height", "min-width", "nav-down", "nav-index", "nav-left", "nav-right", "nav-up", "none", "normal", "object-fit", "object-position", "opacity", "order", "orphans", "outline", "outline-color", "outline-offset", "outline-style", "outline-width", "overflow", "overflow-wrap", "overflow-x", "overflow-y", "padding", "padding-bottom", "padding-left", "padding-right", "padding-top", "page-break-after", "page-break-before", "page-break-inside", "perspective", "perspective-origin", "pointer-events", "position", "quotes", "resize", "right", "src", "tab-size", "table-layout", "text-align", "text-align-last", "text-decoration", "text-decoration-color", "text-decoration-line", "text-decoration-style", "text-indent", "text-overflow", "text-rendering", "text-shadow", "text-transform", "text-underline-position", "top", "transform", "transform-origin", "transform-style", "transition", "transition-delay", "transition-duration", "transition-property", "transition-timing-function", "unicode-bidi", "vertical-align", "visibility", "white-space", "widows", "width", "word-break", "word-spacing", "word-wrap", "z-index"].reverse();

  function Ze9(A) {
    if (!A) return null;
    if (typeof A === "string") return A;
    return A.source
  }

  function Ie9(A) {
    return Ye9("(?=", A, ")")
  }

  function Ye9(...A) {
    return A.map((B) => Ze9(B)).join("")
  }

  function Je9(A) {
    let Q = tt9(A),
      B = {
        className: "built_in",
        begin: /[\w-]+(?=\()/
      },
      G = {
        begin: /-(webkit|moz|ms|o)-(?=[a-z])/
      },
      Z = "and or not only",
      I = /@-?\w[\w]*(-\w+)*/,
      Y = "[a-zA-Z-][a-zA-Z0-9_-]*",
      J = [A.APOS_STRING_MODE, A.QUOTE_STRING_MODE];
    return {
      name: "CSS",
      case_insensitive: !0,
      illegal: /[=|'\$]/,
      keywords: {
        keyframePosition: "from to"
      },
      classNameAliases: {
        keyframePosition: "selector-tag"
      },
      contains: [A.C_BLOCK_COMMENT_MODE, G, A.CSS_NUMBER_MODE, {
        className: "selector-id",
        begin: /#[A-Za-z0-9_-]+/,
        relevance: 0
      }, {
        className: "selector-class",
        begin: "\\.[a-zA-Z-][a-zA-Z0-9_-]*",
        relevance: 0
      }, Q.ATTRIBUTE_SELECTOR_MODE, {
        className: "selector-pseudo",
        variants: [{
          begin: ":(" + Qe9.join("|") + ")"
        }, {
          begin: "::(" + Be9.join("|") + ")"
        }]
      }, {
        className: "attribute",
        begin: "\\b(" + Ge9.join("|") + ")\\b"
      }, {
        begin: ":",
        end: "[;}]",
        contains: [Q.HEXCOLOR, Q.IMPORTANT, A.CSS_NUMBER_MODE, ...J, {
          begin: /(url|data-uri)\(/,
          end: /\)/,
          relevance: 0,
          keywords: {
            built_in: "url data-uri"
          },
          contains: [{
            className: "string",
            begin: /[^)]/,
            endsWithParent: !0,
            excludeEnd: !0
          }]
        }, B]
      }, {
        begin: Ie9(/@/),
        end: "[{;]",
        relevance: 0,
        illegal: /:/,
        contains: [{
          className: "keyword",
          begin: I
        }, {
          begin: /\s/,
          endsWithParent: !0,
          excludeEnd: !0,
          relevance: 0,
          keywords: {
            $pattern: /[a-z-]+/,
            keyword: "and or not only",
            attribute: Ae9.join(" ")
          },
          contains: [{
            begin: /[a-z-]+(?=:)/,
            className: "attribute"
          }, ...J, A.CSS_NUMBER_MODE]
        }]
      }, {
        className: "selector-tag",
        begin: "\\b(" + et9.join("|") + ")\\b"
      }]
    }
  }
  Ik0.exports = Je9
})
// @from(Start 579580, End 583034)
Wk0 = z((sB7, Jk0) => {
  function We9(A) {
    let Q = {
        $pattern: A.UNDERSCORE_IDENT_RE,
        keyword: "abstract alias align asm assert auto body break byte case cast catch class const continue debug default delete deprecated do else enum export extern final finally for foreach foreach_reverse|10 goto if immutable import in inout int interface invariant is lazy macro mixin module new nothrow out override package pragma private protected public pure ref return scope shared static struct super switch synchronized template this throw try typedef typeid typeof union unittest version void volatile while with __FILE__ __LINE__ __gshared|10 __thread __traits __DATE__ __EOF__ __TIME__ __TIMESTAMP__ __VENDOR__ __VERSION__",
        built_in: "bool cdouble cent cfloat char creal dchar delegate double dstring float function idouble ifloat ireal long real short string ubyte ucent uint ulong ushort wchar wstring",
        literal: "false null true"
      },
      B = "(0|[1-9][\\d_]*)",
      G = "(0|[1-9][\\d_]*|\\d[\\d_]*|[\\d_]+?\\d)",
      Z = "0[bB][01_]+",
      I = "([\\da-fA-F][\\da-fA-F_]*|_[\\da-fA-F][\\da-fA-F_]*)",
      Y = "0[xX]([\\da-fA-F][\\da-fA-F_]*|_[\\da-fA-F][\\da-fA-F_]*)",
      J = "([eE][+-]?(0|[1-9][\\d_]*|\\d[\\d_]*|[\\d_]+?\\d))",
      W = "((0|[1-9][\\d_]*|\\d[\\d_]*|[\\d_]+?\\d)(\\.\\d*|" + J + ")|\\d+\\.(0|[1-9][\\d_]*|\\d[\\d_]*|[\\d_]+?\\d)|\\.(0|[1-9][\\d_]*)" + J + "?)",
      X = "(0[xX](([\\da-fA-F][\\da-fA-F_]*|_[\\da-fA-F][\\da-fA-F_]*)\\.([\\da-fA-F][\\da-fA-F_]*|_[\\da-fA-F][\\da-fA-F_]*)|\\.?([\\da-fA-F][\\da-fA-F_]*|_[\\da-fA-F][\\da-fA-F_]*))[pP][+-]?(0|[1-9][\\d_]*|\\d[\\d_]*|[\\d_]+?\\d))",
      V = "((0|[1-9][\\d_]*)|0[bB][01_]+|" + Y + ")",
      F = "(" + X + "|" + W + ")",
      K = `\\\\(['"\\?\\\\abfnrtv]|u[\\dA-Fa-f]{4}|[0-7]{1,3}|x[\\dA-Fa-f]{2}|U[\\dA-Fa-f]{8})|&[a-zA-Z\\d]{2,};`,
      D = {
        className: "number",
        begin: "\\b" + V + "(L|u|U|Lu|LU|uL|UL)?",
        relevance: 0
      },
      H = {
        className: "number",
        begin: "\\b(" + F + "([fF]|L|i|[fF]i|Li)?|" + V + "(i|[fF]i|Li))",
        relevance: 0
      },
      C = {
        className: "string",
        begin: "'(" + K + "|.)",
        end: "'",
        illegal: "."
      },
      U = {
        className: "string",
        begin: '"',
        contains: [{
          begin: K,
          relevance: 0
        }],
        end: '"[cwd]?'
      },
      q = {
        className: "string",
        begin: '[rq]"',
        end: '"[cwd]?',
        relevance: 5
      },
      w = {
        className: "string",
        begin: "`",
        end: "`[cwd]?"
      },
      N = {
        className: "string",
        begin: 'x"[\\da-fA-F\\s\\n\\r]*"[cwd]?',
        relevance: 10
      },
      R = {
        className: "string",
        begin: 'q"\\{',
        end: '\\}"'
      },
      T = {
        className: "meta",
        begin: "^#!",
        end: "$",
        relevance: 5
      },
      y = {
        className: "meta",
        begin: "#(line)",
        end: "$",
        relevance: 5
      },
      v = {
        className: "keyword",
        begin: "@[a-zA-Z_][a-zA-Z_\\d]*"
      },
      x = A.COMMENT("\\/\\+", "\\+\\/", {
        contains: ["self"],
        relevance: 10
      });
    return {
      name: "D",
      keywords: Q,
      contains: [A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE, x, N, U, q, w, R, H, D, C, T, y, v]
    }
  }
  Jk0.exports = We9
})
// @from(Start 583040, End 586721)
Vk0 = z((rB7, Xk0) => {
  function Xe9(A) {
    if (!A) return null;
    if (typeof A === "string") return A;
    return A.source
  }

  function Ve9(...A) {
    return A.map((B) => Xe9(B)).join("")
  }

  function Fe9(A) {
    let Q = {
        begin: /<\/?[A-Za-z_]/,
        end: ">",
        subLanguage: "xml",
        relevance: 0
      },
      B = {
        begin: "^[-\\*]{3,}",
        end: "$"
      },
      G = {
        className: "code",
        variants: [{
          begin: "(`{3,})[^`](.|\\n)*?\\1`*[ ]*"
        }, {
          begin: "(~{3,})[^~](.|\\n)*?\\1~*[ ]*"
        }, {
          begin: "```",
          end: "```+[ ]*$"
        }, {
          begin: "~~~",
          end: "~~~+[ ]*$"
        }, {
          begin: "`.+?`"
        }, {
          begin: "(?=^( {4}|\\t))",
          contains: [{
            begin: "^( {4}|\\t)",
            end: "(\\n)$"
          }],
          relevance: 0
        }]
      },
      Z = {
        className: "bullet",
        begin: "^[ \t]*([*+-]|(\\d+\\.))(?=\\s+)",
        end: "\\s+",
        excludeEnd: !0
      },
      I = {
        begin: /^\[[^\n]+\]:/,
        returnBegin: !0,
        contains: [{
          className: "symbol",
          begin: /\[/,
          end: /\]/,
          excludeBegin: !0,
          excludeEnd: !0
        }, {
          className: "link",
          begin: /:\s*/,
          end: /$/,
          excludeBegin: !0
        }]
      },
      J = {
        variants: [{
          begin: /\[.+?\]\[.*?\]/,
          relevance: 0
        }, {
          begin: /\[.+?\]\(((data|javascript|mailto):|(?:http|ftp)s?:\/\/).*?\)/,
          relevance: 2
        }, {
          begin: Ve9(/\[.+?\]\(/, /[A-Za-z][A-Za-z0-9+.-]*/, /:\/\/.*?\)/),
          relevance: 2
        }, {
          begin: /\[.+?\]\([./?&#].*?\)/,
          relevance: 1
        }, {
          begin: /\[.+?\]\(.*?\)/,
          relevance: 0
        }],
        returnBegin: !0,
        contains: [{
          className: "string",
          relevance: 0,
          begin: "\\[",
          end: "\\]",
          excludeBegin: !0,
          returnEnd: !0
        }, {
          className: "link",
          relevance: 0,
          begin: "\\]\\(",
          end: "\\)",
          excludeBegin: !0,
          excludeEnd: !0
        }, {
          className: "symbol",
          relevance: 0,
          begin: "\\]\\[",
          end: "\\]",
          excludeBegin: !0,
          excludeEnd: !0
        }]
      },
      W = {
        className: "strong",
        contains: [],
        variants: [{
          begin: /_{2}/,
          end: /_{2}/
        }, {
          begin: /\*{2}/,
          end: /\*{2}/
        }]
      },
      X = {
        className: "emphasis",
        contains: [],
        variants: [{
          begin: /\*(?!\*)/,
          end: /\*/
        }, {
          begin: /_(?!_)/,
          end: /_/,
          relevance: 0
        }]
      };
    W.contains.push(X), X.contains.push(W);
    let V = [Q, J];
    return W.contains = W.contains.concat(V), X.contains = X.contains.concat(V), V = V.concat(W, X), {
      name: "Markdown",
      aliases: ["md", "mkdown", "mkd"],
      contains: [{
        className: "section",
        variants: [{
          begin: "^#{1,6}",
          end: "$",
          contains: V
        }, {
          begin: "(?=^.+?\\n[=-]{2,}$)",
          contains: [{
            begin: "^[=-]*$"
          }, {
            begin: "^",
            end: "\\n",
            contains: V
          }]
        }]
      }, Q, Z, W, X, {
        className: "quote",
        begin: "^>\\s+",
        contains: V,
        end: "$"
      }, G, B, J, I]
    }
  }
  Xk0.exports = Fe9
})
// @from(Start 586727, End 589613)
Kk0 = z((oB7, Fk0) => {
  function Ke9(A) {
    let Q = {
        className: "subst",
        variants: [{
          begin: "\\$[A-Za-z0-9_]+"
        }]
      },
      B = {
        className: "subst",
        variants: [{
          begin: /\$\{/,
          end: /\}/
        }],
        keywords: "true false null this is new super"
      },
      G = {
        className: "string",
        variants: [{
          begin: "r'''",
          end: "'''"
        }, {
          begin: 'r"""',
          end: '"""'
        }, {
          begin: "r'",
          end: "'",
          illegal: "\\n"
        }, {
          begin: 'r"',
          end: '"',
          illegal: "\\n"
        }, {
          begin: "'''",
          end: "'''",
          contains: [A.BACKSLASH_ESCAPE, Q, B]
        }, {
          begin: '"""',
          end: '"""',
          contains: [A.BACKSLASH_ESCAPE, Q, B]
        }, {
          begin: "'",
          end: "'",
          illegal: "\\n",
          contains: [A.BACKSLASH_ESCAPE, Q, B]
        }, {
          begin: '"',
          end: '"',
          illegal: "\\n",
          contains: [A.BACKSLASH_ESCAPE, Q, B]
        }]
      };
    B.contains = [A.C_NUMBER_MODE, G];
    let Z = ["Comparable", "DateTime", "Duration", "Function", "Iterable", "Iterator", "List", "Map", "Match", "Object", "Pattern", "RegExp", "Set", "Stopwatch", "String", "StringBuffer", "StringSink", "Symbol", "Type", "Uri", "bool", "double", "int", "num", "Element", "ElementList"],
      I = Z.map((J) => `${J}?`);
    return {
      name: "Dart",
      keywords: {
        keyword: "abstract as assert async await break case catch class const continue covariant default deferred do dynamic else enum export extends extension external factory false final finally for Function get hide if implements import in inferface is late library mixin new null on operator part required rethrow return set show static super switch sync this throw true try typedef var void while with yield",
        built_in: Z.concat(I).concat(["Never", "Null", "dynamic", "print", "document", "querySelector", "querySelectorAll", "window"]),
        $pattern: /[A-Za-z][A-Za-z0-9_]*\??/
      },
      contains: [G, A.COMMENT(/\/\*\*(?!\/)/, /\*\//, {
        subLanguage: "markdown",
        relevance: 0
      }), A.COMMENT(/\/{3,} ?/, /$/, {
        contains: [{
          subLanguage: "markdown",
          begin: ".",
          end: "$",
          relevance: 0
        }]
      }), A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE, {
        className: "class",
        beginKeywords: "class interface",
        end: /\{/,
        excludeEnd: !0,
        contains: [{
          beginKeywords: "extends implements"
        }, A.UNDERSCORE_TITLE_MODE]
      }, A.C_NUMBER_MODE, {
        className: "meta",
        begin: "@[A-Za-z]+"
      }, {
        begin: "=>"
      }]
    }
  }
  Fk0.exports = Ke9
})
// @from(Start 589619, End 592233)
Hk0 = z((tB7, Dk0) => {
  function De9(A) {
    let Q = "exports register file shl array record property for mod while set ally label uses raise not stored class safecall var interface or private static exit index inherited to else stdcall override shr asm far resourcestring finalization packed virtual out and protected library do xorwrite goto near function end div overload object unit begin string on inline repeat until destructor write message program with read initialization except default nil if case cdecl in downto threadvar of try pascal const external constructor type public then implementation finally published procedure absolute reintroduce operator as is abstract alias assembler bitpacked break continue cppdecl cvar enumerator experimental platform deprecated unimplemented dynamic export far16 forward generic helper implements interrupt iochecks local name nodefault noreturn nostackframe oldfpccall otherwise saveregisters softfloat specialize strict unaligned varargs ",
      B = [A.C_LINE_COMMENT_MODE, A.COMMENT(/\{/, /\}/, {
        relevance: 0
      }), A.COMMENT(/\(\*/, /\*\)/, {
        relevance: 10
      })],
      G = {
        className: "meta",
        variants: [{
          begin: /\{\$/,
          end: /\}/
        }, {
          begin: /\(\*\$/,
          end: /\*\)/
        }]
      },
      Z = {
        className: "string",
        begin: /'/,
        end: /'/,
        contains: [{
          begin: /''/
        }]
      },
      I = {
        className: "number",
        relevance: 0,
        variants: [{
          begin: "\\$[0-9A-Fa-f]+"
        }, {
          begin: "&[0-7]+"
        }, {
          begin: "%[01]+"
        }]
      },
      Y = {
        className: "string",
        begin: /(#\d+)+/
      },
      J = {
        begin: A.IDENT_RE + "\\s*=\\s*class\\s*\\(",
        returnBegin: !0,
        contains: [A.TITLE_MODE]
      },
      W = {
        className: "function",
        beginKeywords: "function constructor destructor procedure",
        end: /[:;]/,
        keywords: "function constructor|10 destructor|10 procedure|10",
        contains: [A.TITLE_MODE, {
          className: "params",
          begin: /\(/,
          end: /\)/,
          keywords: Q,
          contains: [Z, Y, G].concat(B)
        }, G].concat(B)
      };
    return {
      name: "Delphi",
      aliases: ["dpr", "dfm", "pas", "pascal", "freepascal", "lazarus", "lpr", "lfm"],
      case_insensitive: !0,
      keywords: Q,
      illegal: /"|\$[G-Zg-z]|\/\*|<\/|\|/,
      contains: [Z, Y, A.NUMBER_MODE, I, J, W, G].concat(B)
    }
  }
  Dk0.exports = De9
})
// @from(Start 592239, End 593405)
Ek0 = z((eB7, Ck0) => {
  function He9(A) {
    return {
      name: "Diff",
      aliases: ["patch"],
      contains: [{
        className: "meta",
        relevance: 10,
        variants: [{
          begin: /^@@ +-\d+,\d+ +\+\d+,\d+ +@@/
        }, {
          begin: /^\*\*\* +\d+,\d+ +\*\*\*\*$/
        }, {
          begin: /^--- +\d+,\d+ +----$/
        }]
      }, {
        className: "comment",
        variants: [{
          begin: /Index: /,
          end: /$/
        }, {
          begin: /^index/,
          end: /$/
        }, {
          begin: /={3,}/,
          end: /$/
        }, {
          begin: /^-{3}/,
          end: /$/
        }, {
          begin: /^\*{3} /,
          end: /$/
        }, {
          begin: /^\+{3}/,
          end: /$/
        }, {
          begin: /^\*{15}$/
        }, {
          begin: /^diff --git/,
          end: /$/
        }]
      }, {
        className: "addition",
        begin: /^\+/,
        end: /$/
      }, {
        className: "deletion",
        begin: /^-/,
        end: /$/
      }, {
        className: "addition",
        begin: /^!/,
        end: /$/
      }]
    }
  }
  Ck0.exports = He9
})
// @from(Start 593411, End 595542)
Uk0 = z((A27, zk0) => {
  function Ce9(A) {
    let Q = {
      begin: /\|[A-Za-z]+:?/,
      keywords: {
        name: "truncatewords removetags linebreaksbr yesno get_digit timesince random striptags filesizeformat escape linebreaks length_is ljust rjust cut urlize fix_ampersands title floatformat capfirst pprint divisibleby add make_list unordered_list urlencode timeuntil urlizetrunc wordcount stringformat linenumbers slice date dictsort dictsortreversed default_if_none pluralize lower join center default truncatewords_html upper length phone2numeric wordwrap time addslashes slugify first escapejs force_escape iriencode last safe safeseq truncatechars localize unlocalize localtime utc timezone"
      },
      contains: [A.QUOTE_STRING_MODE, A.APOS_STRING_MODE]
    };
    return {
      name: "Django",
      aliases: ["jinja"],
      case_insensitive: !0,
      subLanguage: "xml",
      contains: [A.COMMENT(/\{%\s*comment\s*%\}/, /\{%\s*endcomment\s*%\}/), A.COMMENT(/\{#/, /#\}/), {
        className: "template-tag",
        begin: /\{%/,
        end: /%\}/,
        contains: [{
          className: "name",
          begin: /\w+/,
          keywords: {
            name: "comment endcomment load templatetag ifchanged endifchanged if endif firstof for endfor ifnotequal endifnotequal widthratio extends include spaceless endspaceless regroup ifequal endifequal ssi now with cycle url filter endfilter debug block endblock else autoescape endautoescape csrf_token empty elif endwith static trans blocktrans endblocktrans get_static_prefix get_media_prefix plural get_current_language language get_available_languages get_current_language_bidi get_language_info get_language_info_list localize endlocalize localtime endlocaltime timezone endtimezone get_current_timezone verbatim"
          },
          starts: {
            endsWithParent: !0,
            keywords: "in by as",
            contains: [Q],
            relevance: 0
          }
        }]
      }, {
        className: "template-variable",
        begin: /\{\{/,
        end: /\}\}/,
        contains: [Q]
      }]
    }
  }
  zk0.exports = Ce9
})
// @from(Start 595548, End 597489)
wk0 = z((Q27, $k0) => {
  function Ee9(A) {
    return {
      name: "DNS Zone",
      aliases: ["bind", "zone"],
      keywords: {
        keyword: "IN A AAAA AFSDB APL CAA CDNSKEY CDS CERT CNAME DHCID DLV DNAME DNSKEY DS HIP IPSECKEY KEY KX LOC MX NAPTR NS NSEC NSEC3 NSEC3PARAM PTR RRSIG RP SIG SOA SRV SSHFP TA TKEY TLSA TSIG TXT"
      },
      contains: [A.COMMENT(";", "$", {
        relevance: 0
      }), {
        className: "meta",
        begin: /^\$(TTL|GENERATE|INCLUDE|ORIGIN)\b/
      }, {
        className: "number",
        begin: "((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:)))\\b"
      }, {
        className: "number",
        begin: "((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\b"
      }, A.inherit(A.NUMBER_MODE, {
        begin: /\b\d+[dhwm]?/
      })]
    }
  }
  $k0.exports = Ee9
})
// @from(Start 597495, End 598041)
Nk0 = z((B27, qk0) => {
  function ze9(A) {
    return {
      name: "Dockerfile",
      aliases: ["docker"],
      case_insensitive: !0,
      keywords: "from maintainer expose env arg user onbuild stopsignal",
      contains: [A.HASH_COMMENT_MODE, A.APOS_STRING_MODE, A.QUOTE_STRING_MODE, A.NUMBER_MODE, {
        beginKeywords: "run cmd entrypoint volume add copy workdir label healthcheck shell",
        starts: {
          end: /[^\\]$/,
          subLanguage: "bash"
        }
      }],
      illegal: "</"
    }
  }
  qk0.exports = ze9
})
// @from(Start 598047, End 599516)
Mk0 = z((G27, Lk0) => {
  function Ue9(A) {
    let Q = A.COMMENT(/^\s*@?rem\b/, /$/, {
      relevance: 10
    });
    return {
      name: "Batch file (DOS)",
      aliases: ["bat", "cmd"],
      case_insensitive: !0,
      illegal: /\/\*/,
      keywords: {
        keyword: "if else goto for in do call exit not exist errorlevel defined equ neq lss leq gtr geq",
        built_in: "prn nul lpt3 lpt2 lpt1 con com4 com3 com2 com1 aux shift cd dir echo setlocal endlocal set pause copy append assoc at attrib break cacls cd chcp chdir chkdsk chkntfs cls cmd color comp compact convert date dir diskcomp diskcopy doskey erase fs find findstr format ftype graftabl help keyb label md mkdir mode more move path pause print popd pushd promt rd recover rem rename replace restore rmdir shift sort start subst time title tree type ver verify vol ping net ipconfig taskkill xcopy ren del"
      },
      contains: [{
        className: "variable",
        begin: /%%[^ ]|%[^ ]+?%|![^ ]+?!/
      }, {
        className: "function",
        begin: {
          className: "symbol",
          begin: "^\\s*[A-Za-z._?][A-Za-z0-9_$#@~.?]*(:|\\s+label)",
          relevance: 0
        }.begin,
        end: "goto:eof",
        contains: [A.inherit(A.TITLE_MODE, {
          begin: "([_a-zA-Z]\\w*\\.)*([_a-zA-Z]\\w*:)?[_a-zA-Z]\\w*"
        }), Q]
      }, {
        className: "number",
        begin: "\\b\\d+",
        relevance: 0
      }, Q]
    }
  }
  Lk0.exports = Ue9
})
// @from(Start 599522, End 600491)
Rk0 = z((Z27, Ok0) => {
  function $e9(A) {
    return {
      keywords: "dsconfig",
      contains: [{
        className: "keyword",
        begin: "^dsconfig",
        end: /\s/,
        excludeEnd: !0,
        relevance: 10
      }, {
        className: "built_in",
        begin: /(list|create|get|set|delete)-(\w+)/,
        end: /\s/,
        excludeEnd: !0,
        illegal: "!@#$%^&*()",
        relevance: 10
      }, {
        className: "built_in",
        begin: /--(\w+)/,
        end: /\s/,
        excludeEnd: !0
      }, {
        className: "string",
        begin: /"/,
        end: /"/
      }, {
        className: "string",
        begin: /'/,
        end: /'/
      }, {
        className: "string",
        begin: /[\w\-?]+:\w+/,
        end: /\W/,
        relevance: 0
      }, {
        className: "string",
        begin: /\w+(\-\w+)*/,
        end: /(?=\W)/,
        relevance: 0
      }, A.HASH_COMMENT_MODE]
    }
  }
  Ok0.exports = $e9
})
// @from(Start 600497, End 602756)
Pk0 = z((I27, Tk0) => {
  function we9(A) {
    let Q = {
        className: "string",
        variants: [A.inherit(A.QUOTE_STRING_MODE, {
          begin: '((u8?|U)|L)?"'
        }), {
          begin: '(u8?|U)?R"',
          end: '"',
          contains: [A.BACKSLASH_ESCAPE]
        }, {
          begin: "'\\\\?.",
          end: "'",
          illegal: "."
        }]
      },
      B = {
        className: "number",
        variants: [{
          begin: "\\b(\\d+(\\.\\d*)?|\\.\\d+)(u|U|l|L|ul|UL|f|F)"
        }, {
          begin: A.C_NUMBER_RE
        }],
        relevance: 0
      },
      G = {
        className: "meta",
        begin: "#",
        end: "$",
        keywords: {
          "meta-keyword": "if else elif endif define undef ifdef ifndef"
        },
        contains: [{
          begin: /\\\n/,
          relevance: 0
        }, {
          beginKeywords: "include",
          end: "$",
          keywords: {
            "meta-keyword": "include"
          },
          contains: [A.inherit(Q, {
            className: "meta-string"
          }), {
            className: "meta-string",
            begin: "<",
            end: ">",
            illegal: "\\n"
          }]
        }, Q, A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE]
      },
      Z = {
        className: "variable",
        begin: /&[a-z\d_]*\b/
      },
      I = {
        className: "meta-keyword",
        begin: "/[a-z][a-z\\d-]*/"
      },
      Y = {
        className: "symbol",
        begin: "^\\s*[a-zA-Z_][a-zA-Z\\d_]*:"
      },
      J = {
        className: "params",
        begin: "<",
        end: ">",
        contains: [B, Z]
      },
      W = {
        className: "class",
        begin: /[a-zA-Z_][a-zA-Z\d_@]*\s\{/,
        end: /[{;=]/,
        returnBegin: !0,
        excludeEnd: !0
      };
    return {
      name: "Device Tree",
      keywords: "",
      contains: [{
        className: "class",
        begin: "/\\s*\\{",
        end: /\};/,
        relevance: 10,
        contains: [Z, I, Y, W, J, A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE, B, Q]
      }, Z, I, Y, W, J, A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE, B, Q, G, {
        begin: A.IDENT_RE + "::",
        keywords: ""
      }]
    }
  }
  Tk0.exports = we9
})
// @from(Start 602762, End 603487)
Sk0 = z((Y27, jk0) => {
  function qe9(A) {
    return {
      name: "Dust",
      aliases: ["dst"],
      case_insensitive: !0,
      subLanguage: "xml",
      contains: [{
        className: "template-tag",
        begin: /\{[#\/]/,
        end: /\}/,
        illegal: /;/,
        contains: [{
          className: "name",
          begin: /[a-zA-Z\.-]+/,
          starts: {
            endsWithParent: !0,
            relevance: 0,
            contains: [A.QUOTE_STRING_MODE]
          }
        }]
      }, {
        className: "template-variable",
        begin: /\{/,
        end: /\}/,
        illegal: /;/,
        keywords: "if eq ne lt lte gt gte select default math sep"
      }]
    }
  }
  jk0.exports = qe9
})
// @from(Start 603493, End 604131)
kk0 = z((J27, _k0) => {
  function Ne9(A) {
    let Q = A.COMMENT(/\(\*/, /\*\)/),
      B = {
        className: "attribute",
        begin: /^[ ]*[a-zA-Z]+([\s_-]+[a-zA-Z]+)*/
      },
      Z = {
        begin: /=/,
        end: /[.;]/,
        contains: [Q, {
          className: "meta",
          begin: /\?.*\?/
        }, {
          className: "string",
          variants: [A.APOS_STRING_MODE, A.QUOTE_STRING_MODE, {
            begin: "`",
            end: "`"
          }]
        }]
      };
    return {
      name: "Extended Backus-Naur Form",
      illegal: /\S/,
      contains: [Q, B, Z]
    }
  }
  _k0.exports = Ne9
})
// @from(Start 604137, End 608367)
xk0 = z((W27, yk0) => {
  function Le9(A) {
    let G = {
        $pattern: "[a-zA-Z_][a-zA-Z0-9_.]*(!|\\?)?",
        keyword: "and false then defined module in return redo retry end for true self when next until do begin unless nil break not case cond alias while ensure or include use alias fn quote require import with|0"
      },
      Z = {
        className: "subst",
        begin: /#\{/,
        end: /\}/,
        keywords: G
      },
      I = {
        className: "number",
        begin: "(\\b0o[0-7_]+)|(\\b0b[01_]+)|(\\b0x[0-9a-fA-F_]+)|(-?\\b[1-9][0-9_]*(\\.[0-9_]+([eE][-+]?[0-9]+)?)?)",
        relevance: 0
      },
      Y = `[/|([{<"']`,
      J = {
        className: "string",
        begin: `~[a-z](?=[/|([{<"'])`,
        contains: [{
          endsParent: !0,
          contains: [{
            contains: [A.BACKSLASH_ESCAPE, Z],
            variants: [{
              begin: /"/,
              end: /"/
            }, {
              begin: /'/,
              end: /'/
            }, {
              begin: /\//,
              end: /\//
            }, {
              begin: /\|/,
              end: /\|/
            }, {
              begin: /\(/,
              end: /\)/
            }, {
              begin: /\[/,
              end: /\]/
            }, {
              begin: /\{/,
              end: /\}/
            }, {
              begin: /</,
              end: />/
            }]
          }]
        }]
      },
      W = {
        className: "string",
        begin: `~[A-Z](?=[/|([{<"'])`,
        contains: [{
          begin: /"/,
          end: /"/
        }, {
          begin: /'/,
          end: /'/
        }, {
          begin: /\//,
          end: /\//
        }, {
          begin: /\|/,
          end: /\|/
        }, {
          begin: /\(/,
          end: /\)/
        }, {
          begin: /\[/,
          end: /\]/
        }, {
          begin: /\{/,
          end: /\}/
        }, {
          begin: /</,
          end: />/
        }]
      },
      X = {
        className: "string",
        contains: [A.BACKSLASH_ESCAPE, Z],
        variants: [{
          begin: /"""/,
          end: /"""/
        }, {
          begin: /'''/,
          end: /'''/
        }, {
          begin: /~S"""/,
          end: /"""/,
          contains: []
        }, {
          begin: /~S"/,
          end: /"/,
          contains: []
        }, {
          begin: /~S'''/,
          end: /'''/,
          contains: []
        }, {
          begin: /~S'/,
          end: /'/,
          contains: []
        }, {
          begin: /'/,
          end: /'/
        }, {
          begin: /"/,
          end: /"/
        }]
      },
      V = {
        className: "function",
        beginKeywords: "def defp defmacro",
        end: /\B\b/,
        contains: [A.inherit(A.TITLE_MODE, {
          begin: "[a-zA-Z_][a-zA-Z0-9_.]*(!|\\?)?",
          endsParent: !0
        })]
      },
      F = A.inherit(V, {
        className: "class",
        beginKeywords: "defimpl defmodule defprotocol defrecord",
        end: /\bdo\b|$|;/
      }),
      K = [X, W, J, A.HASH_COMMENT_MODE, F, V, {
        begin: "::"
      }, {
        className: "symbol",
        begin: ":(?![\\s:])",
        contains: [X, {
          begin: "[a-zA-Z_]\\w*[!?=]?|[-+~]@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?"
        }],
        relevance: 0
      }, {
        className: "symbol",
        begin: "[a-zA-Z_][a-zA-Z0-9_.]*(!|\\?)?:(?!:)",
        relevance: 0
      }, I, {
        className: "variable",
        begin: "(\\$\\W)|((\\$|@@?)(\\w+))"
      }, {
        begin: "->"
      }, {
        begin: "(" + A.RE_STARTERS_RE + ")\\s*",
        contains: [A.HASH_COMMENT_MODE, {
          begin: /\/: (?=\d+\s*[,\]])/,
          relevance: 0,
          contains: [I]
        }, {
          className: "regexp",
          illegal: "\\n",
          contains: [A.BACKSLASH_ESCAPE, Z],
          variants: [{
            begin: "/",
            end: "/[a-z]*"
          }, {
            begin: "%r\\[",
            end: "\\][a-z]*"
          }]
        }],
        relevance: 0
      }];
    return Z.contains = K, {
      name: "Elixir",
      keywords: G,
      contains: K
    }
  }
  yk0.exports = Le9
})
// @from(Start 608373, End 610144)
bk0 = z((X27, vk0) => {
  function Me9(A) {
    let Q = {
        variants: [A.COMMENT("--", "$"), A.COMMENT(/\{-/, /-\}/, {
          contains: ["self"]
        })]
      },
      B = {
        className: "type",
        begin: "\\b[A-Z][\\w']*",
        relevance: 0
      },
      G = {
        begin: "\\(",
        end: "\\)",
        illegal: '"',
        contains: [{
          className: "type",
          begin: "\\b[A-Z][\\w]*(\\((\\.\\.|,|\\w+)\\))?"
        }, Q]
      },
      Z = {
        begin: /\{/,
        end: /\}/,
        contains: G.contains
      },
      I = {
        className: "string",
        begin: "'\\\\?.",
        end: "'",
        illegal: "."
      };
    return {
      name: "Elm",
      keywords: "let in if then else case of where module import exposing type alias as infix infixl infixr port effect command subscription",
      contains: [{
        beginKeywords: "port effect module",
        end: "exposing",
        keywords: "port effect module where command subscription exposing",
        contains: [G, Q],
        illegal: "\\W\\.|;"
      }, {
        begin: "import",
        end: "$",
        keywords: "import as exposing",
        contains: [G, Q],
        illegal: "\\W\\.|;"
      }, {
        begin: "type",
        end: "$",
        keywords: "type alias",
        contains: [B, G, Z, Q]
      }, {
        beginKeywords: "infix infixl infixr",
        end: "$",
        contains: [A.C_NUMBER_MODE, Q]
      }, {
        begin: "port",
        end: "$",
        keywords: "port",
        contains: [Q]
      }, I, A.QUOTE_STRING_MODE, A.C_NUMBER_MODE, B, A.inherit(A.TITLE_MODE, {
        begin: "^[_a-z][\\w']*"
      }), Q, {
        begin: "->|<-"
      }],
      illegal: /;/
    }
  }
  vk0.exports = Me9
})
// @from(Start 610150, End 616192)
gk0 = z((V27, hk0) => {
  function Oe9(A) {
    if (!A) return null;
    if (typeof A === "string") return A;
    return A.source
  }

  function Re9(A) {
    return fk0("(?=", A, ")")
  }

  function fk0(...A) {
    return A.map((B) => Oe9(B)).join("")
  }

  function Te9(A) {
    let B = {
        keyword: "and then defined module in return redo if BEGIN retry end for self when next until do begin unless END rescue else break undef not super class case require yield alias while ensure elsif or include attr_reader attr_writer attr_accessor __FILE__",
        built_in: "proc lambda",
        literal: "true false nil"
      },
      G = {
        className: "doctag",
        begin: "@[A-Za-z]+"
      },
      Z = {
        begin: "#<",
        end: ">"
      },
      I = [A.COMMENT("#", "$", {
        contains: [G]
      }), A.COMMENT("^=begin", "^=end", {
        contains: [G],
        relevance: 10
      }), A.COMMENT("^__END__", "\\n$")],
      Y = {
        className: "subst",
        begin: /#\{/,
        end: /\}/,
        keywords: B
      },
      J = {
        className: "string",
        contains: [A.BACKSLASH_ESCAPE, Y],
        variants: [{
          begin: /'/,
          end: /'/
        }, {
          begin: /"/,
          end: /"/
        }, {
          begin: /`/,
          end: /`/
        }, {
          begin: /%[qQwWx]?\(/,
          end: /\)/
        }, {
          begin: /%[qQwWx]?\[/,
          end: /\]/
        }, {
          begin: /%[qQwWx]?\{/,
          end: /\}/
        }, {
          begin: /%[qQwWx]?</,
          end: />/
        }, {
          begin: /%[qQwWx]?\//,
          end: /\//
        }, {
          begin: /%[qQwWx]?%/,
          end: /%/
        }, {
          begin: /%[qQwWx]?-/,
          end: /-/
        }, {
          begin: /%[qQwWx]?\|/,
          end: /\|/
        }, {
          begin: /\B\?(\\\d{1,3})/
        }, {
          begin: /\B\?(\\x[A-Fa-f0-9]{1,2})/
        }, {
          begin: /\B\?(\\u\{?[A-Fa-f0-9]{1,6}\}?)/
        }, {
          begin: /\B\?(\\M-\\C-|\\M-\\c|\\c\\M-|\\M-|\\C-\\M-)[\x20-\x7e]/
        }, {
          begin: /\B\?\\(c|C-)[\x20-\x7e]/
        }, {
          begin: /\B\?\\?\S/
        }, {
          begin: /<<[-~]?'?(\w+)\n(?:[^\n]*\n)*?\s*\1\b/,
          returnBegin: !0,
          contains: [{
            begin: /<<[-~]?'?/
          }, A.END_SAME_AS_BEGIN({
            begin: /(\w+)/,
            end: /(\w+)/,
            contains: [A.BACKSLASH_ESCAPE, Y]
          })]
        }]
      },
      W = "[1-9](_?[0-9])*|0",
      X = "[0-9](_?[0-9])*",
      V = {
        className: "number",
        relevance: 0,
        variants: [{
          begin: "\\b([1-9](_?[0-9])*|0)(\\.([0-9](_?[0-9])*))?([eE][+-]?([0-9](_?[0-9])*)|r)?i?\\b"
        }, {
          begin: "\\b0[dD][0-9](_?[0-9])*r?i?\\b"
        }, {
          begin: "\\b0[bB][0-1](_?[0-1])*r?i?\\b"
        }, {
          begin: "\\b0[oO][0-7](_?[0-7])*r?i?\\b"
        }, {
          begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*r?i?\\b"
        }, {
          begin: "\\b0(_?[0-7])+r?i?\\b"
        }]
      },
      F = {
        className: "params",
        begin: "\\(",
        end: "\\)",
        endsParent: !0,
        keywords: B
      },
      K = [J, {
        className: "class",
        beginKeywords: "class module",
        end: "$|;",
        illegal: /=/,
        contains: [A.inherit(A.TITLE_MODE, {
          begin: "[A-Za-z_]\\w*(::\\w+)*(\\?|!)?"
        }), {
          begin: "<\\s*",
          contains: [{
            begin: "(" + A.IDENT_RE + "::)?" + A.IDENT_RE,
            relevance: 0
          }]
        }].concat(I)
      }, {
        className: "function",
        begin: fk0(/def\s+/, Re9("([a-zA-Z_]\\w*[!?=]?|[-+~]@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?)\\s*(\\(|;|$)")),
        relevance: 0,
        keywords: "def",
        end: "$|;",
        contains: [A.inherit(A.TITLE_MODE, {
          begin: "([a-zA-Z_]\\w*[!?=]?|[-+~]@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?)"
        }), F].concat(I)
      }, {
        begin: A.IDENT_RE + "::"
      }, {
        className: "symbol",
        begin: A.UNDERSCORE_IDENT_RE + "(!|\\?)?:",
        relevance: 0
      }, {
        className: "symbol",
        begin: ":(?!\\s)",
        contains: [J, {
          begin: "([a-zA-Z_]\\w*[!?=]?|[-+~]@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?)"
        }],
        relevance: 0
      }, V, {
        className: "variable",
        begin: "(\\$\\W)|((\\$|@@?)(\\w+))(?=[^@$?])(?![A-Za-z])(?![@$?'])"
      }, {
        className: "params",
        begin: /\|/,
        end: /\|/,
        relevance: 0,
        keywords: B
      }, {
        begin: "(" + A.RE_STARTERS_RE + "|unless)\\s*",
        keywords: "unless",
        contains: [{
          className: "regexp",
          contains: [A.BACKSLASH_ESCAPE, Y],
          illegal: /\n/,
          variants: [{
            begin: "/",
            end: "/[a-z]*"
          }, {
            begin: /%r\{/,
            end: /\}[a-z]*/
          }, {
            begin: "%r\\(",
            end: "\\)[a-z]*"
          }, {
            begin: "%r!",
            end: "![a-z]*"
          }, {
            begin: "%r\\[",
            end: "\\][a-z]*"
          }]
        }].concat(Z, I),
        relevance: 0
      }].concat(Z, I);
    Y.contains = K, F.contains = K;
    let D = "[>?]>",
      H = "[\\w#]+\\(\\w+\\):\\d+:\\d+>",
      C = "(\\w+-)?\\d+\\.\\d+\\.\\d+(p\\d+)?[^\\d][^>]+>",
      E = [{
        begin: /^\s*=>/,
        starts: {
          end: "$",
          contains: K
        }
      }, {
        className: "meta",
        begin: "^(" + D + "|" + H + "|" + C + ")(?=[ ])",
        starts: {
          end: "$",
          contains: K
        }
      }];
    return I.unshift(Z), {
      name: "Ruby",
      aliases: ["rb", "gemspec", "podspec", "thor", "irb"],
      keywords: B,
      illegal: /\/\*/,
      contains: [A.SHEBANG({
        binary: "ruby"
      })].concat(E).concat(I).concat(K)
    }
  }
  hk0.exports = Te9
})
// @from(Start 616198, End 616513)
mk0 = z((F27, uk0) => {
  function Pe9(A) {
    return {
      name: "ERB",
      subLanguage: "xml",
      contains: [A.COMMENT("<%#", "%>"), {
        begin: "<%[%=-]?",
        end: "[%-]?%>",
        subLanguage: "ruby",
        excludeBegin: !0,
        excludeEnd: !0
      }]
    }
  }
  uk0.exports = Pe9
})
// @from(Start 616519, End 617743)
ck0 = z((K27, dk0) => {
  function je9(A) {
    if (!A) return null;
    if (typeof A === "string") return A;
    return A.source
  }

  function Se9(...A) {
    return A.map((B) => je9(B)).join("")
  }

  function _e9(A) {
    return {
      name: "Erlang REPL",
      keywords: {
        built_in: "spawn spawn_link self",
        keyword: "after and andalso|10 band begin bnot bor bsl bsr bxor case catch cond div end fun if let not of or orelse|10 query receive rem try when xor"
      },
      contains: [{
        className: "meta",
        begin: "^[0-9]+> ",
        relevance: 10
      }, A.COMMENT("%", "$"), {
        className: "number",
        begin: "\\b(\\d+(_\\d+)*#[a-fA-F0-9]+(_[a-fA-F0-9]+)*|\\d+(_\\d+)*(\\.\\d+(_\\d+)*)?([eE][-+]?\\d+)?)",
        relevance: 0
      }, A.APOS_STRING_MODE, A.QUOTE_STRING_MODE, {
        begin: Se9(/\?(::)?/, /([A-Z]\w*)/, /((::)[A-Z]\w*)*/)
      }, {
        begin: "->"
      }, {
        begin: "ok"
      }, {
        begin: "!"
      }, {
        begin: "(\\b[a-z'][a-zA-Z0-9_']*:[a-z'][a-zA-Z0-9_']*)|(\\b[a-z'][a-zA-Z0-9_']*)",
        relevance: 0
      }, {
        begin: "[A-Z][a-zA-Z0-9_']*",
        relevance: 0
      }]
    }
  }
  dk0.exports = _e9
})
// @from(Start 617749, End 620865)
lk0 = z((D27, pk0) => {
  function ke9(A) {
    let B = "([a-z'][a-zA-Z0-9_']*:[a-z'][a-zA-Z0-9_']*|[a-z'][a-zA-Z0-9_']*)",
      G = {
        keyword: "after and andalso|10 band begin bnot bor bsl bzr bxor case catch cond div end fun if let not of orelse|10 query receive rem try when xor",
        literal: "false true"
      },
      Z = A.COMMENT("%", "$"),
      I = {
        className: "number",
        begin: "\\b(\\d+(_\\d+)*#[a-fA-F0-9]+(_[a-fA-F0-9]+)*|\\d+(_\\d+)*(\\.\\d+(_\\d+)*)?([eE][-+]?\\d+)?)",
        relevance: 0
      },
      Y = {
        begin: "fun\\s+[a-z'][a-zA-Z0-9_']*/\\d+"
      },
      J = {
        begin: B + "\\(",
        end: "\\)",
        returnBegin: !0,
        relevance: 0,
        contains: [{
          begin: B,
          relevance: 0
        }, {
          begin: "\\(",
          end: "\\)",
          endsWithParent: !0,
          returnEnd: !0,
          relevance: 0
        }]
      },
      W = {
        begin: /\{/,
        end: /\}/,
        relevance: 0
      },
      X = {
        begin: "\\b_([A-Z][A-Za-z0-9_]*)?",
        relevance: 0
      },
      V = {
        begin: "[A-Z][a-zA-Z0-9_]*",
        relevance: 0
      },
      F = {
        begin: "#" + A.UNDERSCORE_IDENT_RE,
        relevance: 0,
        returnBegin: !0,
        contains: [{
          begin: "#" + A.UNDERSCORE_IDENT_RE,
          relevance: 0
        }, {
          begin: /\{/,
          end: /\}/,
          relevance: 0
        }]
      },
      K = {
        beginKeywords: "fun receive if try case",
        end: "end",
        keywords: G
      };
    K.contains = [Z, Y, A.inherit(A.APOS_STRING_MODE, {
      className: ""
    }), K, J, A.QUOTE_STRING_MODE, I, W, X, V, F];
    let D = [Z, Y, K, J, A.QUOTE_STRING_MODE, I, W, X, V, F];
    J.contains[1].contains = D, W.contains = D, F.contains[1].contains = D;
    let H = ["-module", "-record", "-undef", "-export", "-ifdef", "-ifndef", "-author", "-copyright", "-doc", "-vsn", "-import", "-include", "-include_lib", "-compile", "-define", "-else", "-endif", "-file", "-behaviour", "-behavior", "-spec"],
      C = {
        className: "params",
        begin: "\\(",
        end: "\\)",
        contains: D
      };
    return {
      name: "Erlang",
      aliases: ["erl"],
      keywords: G,
      illegal: "(</|\\*=|\\+=|-=|/\\*|\\*/|\\(\\*|\\*\\))",
      contains: [{
        className: "function",
        begin: "^[a-z'][a-zA-Z0-9_']*\\s*\\(",
        end: "->",
        returnBegin: !0,
        illegal: "\\(|#|//|/\\*|\\\\|:|;",
        contains: [C, A.inherit(A.TITLE_MODE, {
          begin: "[a-z'][a-zA-Z0-9_']*"
        })],
        starts: {
          end: ";|\\.",
          keywords: G,
          contains: D
        }
      }, Z, {
        begin: "^-",
        end: "\\.",
        relevance: 0,
        excludeEnd: !0,
        returnBegin: !0,
        keywords: {
          $pattern: "-" + A.IDENT_RE,
          keyword: H.map((E) => `${E}|1.5`).join(" ")
        },
        contains: [C]
      }, I, A.QUOTE_STRING_MODE, F, X, V, W, {
        begin: /\.$/
      }]
    }
  }
  pk0.exports = ke9
})
// @from(Start 620871, End 625512)
nk0 = z((H27, ik0) => {
  function ye9(A) {
    return {
      name: "Excel formulae",
      aliases: ["xlsx", "xls"],
      case_insensitive: !0,
      keywords: {
        $pattern: /[a-zA-Z][\w\.]*/,
        built_in: "ABS ACCRINT ACCRINTM ACOS ACOSH ACOT ACOTH AGGREGATE ADDRESS AMORDEGRC AMORLINC AND ARABIC AREAS ASC ASIN ASINH ATAN ATAN2 ATANH AVEDEV AVERAGE AVERAGEA AVERAGEIF AVERAGEIFS BAHTTEXT BASE BESSELI BESSELJ BESSELK BESSELY BETADIST BETA.DIST BETAINV BETA.INV BIN2DEC BIN2HEX BIN2OCT BINOMDIST BINOM.DIST BINOM.DIST.RANGE BINOM.INV BITAND BITLSHIFT BITOR BITRSHIFT BITXOR CALL CEILING CEILING.MATH CEILING.PRECISE CELL CHAR CHIDIST CHIINV CHITEST CHISQ.DIST CHISQ.DIST.RT CHISQ.INV CHISQ.INV.RT CHISQ.TEST CHOOSE CLEAN CODE COLUMN COLUMNS COMBIN COMBINA COMPLEX CONCAT CONCATENATE CONFIDENCE CONFIDENCE.NORM CONFIDENCE.T CONVERT CORREL COS COSH COT COTH COUNT COUNTA COUNTBLANK COUNTIF COUNTIFS COUPDAYBS COUPDAYS COUPDAYSNC COUPNCD COUPNUM COUPPCD COVAR COVARIANCE.P COVARIANCE.S CRITBINOM CSC CSCH CUBEKPIMEMBER CUBEMEMBER CUBEMEMBERPROPERTY CUBERANKEDMEMBER CUBESET CUBESETCOUNT CUBEVALUE CUMIPMT CUMPRINC DATE DATEDIF DATEVALUE DAVERAGE DAY DAYS DAYS360 DB DBCS DCOUNT DCOUNTA DDB DEC2BIN DEC2HEX DEC2OCT DECIMAL DEGREES DELTA DEVSQ DGET DISC DMAX DMIN DOLLAR DOLLARDE DOLLARFR DPRODUCT DSTDEV DSTDEVP DSUM DURATION DVAR DVARP EDATE EFFECT ENCODEURL EOMONTH ERF ERF.PRECISE ERFC ERFC.PRECISE ERROR.TYPE EUROCONVERT EVEN EXACT EXP EXPON.DIST EXPONDIST FACT FACTDOUBLE FALSE|0 F.DIST FDIST F.DIST.RT FILTERXML FIND FINDB F.INV F.INV.RT FINV FISHER FISHERINV FIXED FLOOR FLOOR.MATH FLOOR.PRECISE FORECAST FORECAST.ETS FORECAST.ETS.CONFINT FORECAST.ETS.SEASONALITY FORECAST.ETS.STAT FORECAST.LINEAR FORMULATEXT FREQUENCY F.TEST FTEST FV FVSCHEDULE GAMMA GAMMA.DIST GAMMADIST GAMMA.INV GAMMAINV GAMMALN GAMMALN.PRECISE GAUSS GCD GEOMEAN GESTEP GETPIVOTDATA GROWTH HARMEAN HEX2BIN HEX2DEC HEX2OCT HLOOKUP HOUR HYPERLINK HYPGEOM.DIST HYPGEOMDIST IF IFERROR IFNA IFS IMABS IMAGINARY IMARGUMENT IMCONJUGATE IMCOS IMCOSH IMCOT IMCSC IMCSCH IMDIV IMEXP IMLN IMLOG10 IMLOG2 IMPOWER IMPRODUCT IMREAL IMSEC IMSECH IMSIN IMSINH IMSQRT IMSUB IMSUM IMTAN INDEX INDIRECT INFO INT INTERCEPT INTRATE IPMT IRR ISBLANK ISERR ISERROR ISEVEN ISFORMULA ISLOGICAL ISNA ISNONTEXT ISNUMBER ISODD ISREF ISTEXT ISO.CEILING ISOWEEKNUM ISPMT JIS KURT LARGE LCM LEFT LEFTB LEN LENB LINEST LN LOG LOG10 LOGEST LOGINV LOGNORM.DIST LOGNORMDIST LOGNORM.INV LOOKUP LOWER MATCH MAX MAXA MAXIFS MDETERM MDURATION MEDIAN MID MIDBs MIN MINIFS MINA MINUTE MINVERSE MIRR MMULT MOD MODE MODE.MULT MODE.SNGL MONTH MROUND MULTINOMIAL MUNIT N NA NEGBINOM.DIST NEGBINOMDIST NETWORKDAYS NETWORKDAYS.INTL NOMINAL NORM.DIST NORMDIST NORMINV NORM.INV NORM.S.DIST NORMSDIST NORM.S.INV NORMSINV NOT NOW NPER NPV NUMBERVALUE OCT2BIN OCT2DEC OCT2HEX ODD ODDFPRICE ODDFYIELD ODDLPRICE ODDLYIELD OFFSET OR PDURATION PEARSON PERCENTILE.EXC PERCENTILE.INC PERCENTILE PERCENTRANK.EXC PERCENTRANK.INC PERCENTRANK PERMUT PERMUTATIONA PHI PHONETIC PI PMT POISSON.DIST POISSON POWER PPMT PRICE PRICEDISC PRICEMAT PROB PRODUCT PROPER PV QUARTILE QUARTILE.EXC QUARTILE.INC QUOTIENT RADIANS RAND RANDBETWEEN RANK.AVG RANK.EQ RANK RATE RECEIVED REGISTER.ID REPLACE REPLACEB REPT RIGHT RIGHTB ROMAN ROUND ROUNDDOWN ROUNDUP ROW ROWS RRI RSQ RTD SEARCH SEARCHB SEC SECH SECOND SERIESSUM SHEET SHEETS SIGN SIN SINH SKEW SKEW.P SLN SLOPE SMALL SQL.REQUEST SQRT SQRTPI STANDARDIZE STDEV STDEV.P STDEV.S STDEVA STDEVP STDEVPA STEYX SUBSTITUTE SUBTOTAL SUM SUMIF SUMIFS SUMPRODUCT SUMSQ SUMX2MY2 SUMX2PY2 SUMXMY2 SWITCH SYD T TAN TANH TBILLEQ TBILLPRICE TBILLYIELD T.DIST T.DIST.2T T.DIST.RT TDIST TEXT TEXTJOIN TIME TIMEVALUE T.INV T.INV.2T TINV TODAY TRANSPOSE TREND TRIM TRIMMEAN TRUE|0 TRUNC T.TEST TTEST TYPE UNICHAR UNICODE UPPER VALUE VAR VAR.P VAR.S VARA VARP VARPA VDB VLOOKUP WEBSERVICE WEEKDAY WEEKNUM WEIBULL WEIBULL.DIST WORKDAY WORKDAY.INTL XIRR XNPV XOR YEAR YEARFRAC YIELD YIELDDISC YIELDMAT Z.TEST ZTEST"
      },
      contains: [{
        begin: /^=/,
        end: /[^=]/,
        returnEnd: !0,
        illegal: /=/,
        relevance: 10
      }, {
        className: "symbol",
        begin: /\b[A-Z]{1,2}\d+\b/,
        end: /[^\d]/,
        excludeEnd: !0,
        relevance: 0
      }, {
        className: "symbol",
        begin: /[A-Z]{0,2}\d*:[A-Z]{0,2}\d*/,
        relevance: 0
      }, A.BACKSLASH_ESCAPE, A.QUOTE_STRING_MODE, {
        className: "number",
        begin: A.NUMBER_RE + "(%)?",
        relevance: 0
      }, A.COMMENT(/\bN\(/, /\)/, {
        excludeBegin: !0,
        excludeEnd: !0,
        illegal: /\n/
      })]
    }
  }
  ik0.exports = ye9
})
// @from(Start 625518, End 626165)
sk0 = z((C27, ak0) => {
  function xe9(A) {
    return {
      name: "FIX",
      contains: [{
        begin: /[^\u2401\u0001]+/,
        end: /[\u2401\u0001]/,
        excludeEnd: !0,
        returnBegin: !0,
        returnEnd: !1,
        contains: [{
          begin: /([^\u2401\u0001=]+)/,
          end: /=([^\u2401\u0001=]+)/,
          returnEnd: !0,
          returnBegin: !1,
          className: "attr"
        }, {
          begin: /=/,
          end: /([\u2401\u0001])/,
          excludeEnd: !0,
          excludeBegin: !0,
          className: "string"
        }]
      }],
      case_insensitive: !0
    }
  }
  ak0.exports = xe9
})
// @from(Start 626171, End 627084)
ok0 = z((E27, rk0) => {
  function ve9(A) {
    let Q = {
        className: "string",
        begin: /'(.|\\[xXuU][a-zA-Z0-9]+)'/
      },
      B = {
        className: "string",
        variants: [{
          begin: '"',
          end: '"'
        }]
      },
      Z = {
        className: "function",
        beginKeywords: "def",
        end: /[:={\[(\n;]/,
        excludeEnd: !0,
        contains: [{
          className: "title",
          relevance: 0,
          begin: /[^0-9\n\t "'(),.`{}\[\]:;][^\n\t "'(),.`{}\[\]:;]+|[^0-9\n\t "'(),.`{}\[\]:;=]/
        }]
      };
    return {
      name: "Flix",
      keywords: {
        literal: "true false",
        keyword: "case class def else enum if impl import in lat rel index let match namespace switch type yield with"
      },
      contains: [A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE, Q, B, Z, A.C_NUMBER_MODE]
    }
  }
  rk0.exports = ve9
})
// @from(Start 627090, End 632482)
ek0 = z((z27, tk0) => {
  function be9(A) {
    if (!A) return null;
    if (typeof A === "string") return A;
    return A.source
  }

  function bD1(...A) {
    return A.map((B) => be9(B)).join("")
  }

  function fe9(A) {
    let Q = {
        className: "params",
        begin: "\\(",
        end: "\\)"
      },
      B = {
        variants: [A.COMMENT("!", "$", {
          relevance: 0
        }), A.COMMENT("^C[ ]", "$", {
          relevance: 0
        }), A.COMMENT("^C$", "$", {
          relevance: 0
        })]
      },
      G = /(_[a-z_\d]+)?/,
      Z = /([de][+-]?\d+)?/,
      I = {
        className: "number",
        variants: [{
          begin: bD1(/\b\d+/, /\.(\d*)/, Z, G)
        }, {
          begin: bD1(/\b\d+/, Z, G)
        }, {
          begin: bD1(/\.\d+/, Z, G)
        }],
        relevance: 0
      },
      Y = {
        className: "function",
        beginKeywords: "subroutine function program",
        illegal: "[${=\\n]",
        contains: [A.UNDERSCORE_TITLE_MODE, Q]
      },
      J = {
        className: "string",
        relevance: 0,
        variants: [A.APOS_STRING_MODE, A.QUOTE_STRING_MODE]
      };
    return {
      name: "Fortran",
      case_insensitive: !0,
      aliases: ["f90", "f95"],
      keywords: {
        literal: ".False. .True.",
        keyword: "kind do concurrent local shared while private call intrinsic where elsewhere type endtype endmodule endselect endinterface end enddo endif if forall endforall only contains default return stop then block endblock endassociate public subroutine|10 function program .and. .or. .not. .le. .eq. .ge. .gt. .lt. goto save else use module select case access blank direct exist file fmt form formatted iostat name named nextrec number opened rec recl sequential status unformatted unit continue format pause cycle exit c_null_char c_alert c_backspace c_form_feed flush wait decimal round iomsg synchronous nopass non_overridable pass protected volatile abstract extends import non_intrinsic value deferred generic final enumerator class associate bind enum c_int c_short c_long c_long_long c_signed_char c_size_t c_int8_t c_int16_t c_int32_t c_int64_t c_int_least8_t c_int_least16_t c_int_least32_t c_int_least64_t c_int_fast8_t c_int_fast16_t c_int_fast32_t c_int_fast64_t c_intmax_t C_intptr_t c_float c_double c_long_double c_float_complex c_double_complex c_long_double_complex c_bool c_char c_null_ptr c_null_funptr c_new_line c_carriage_return c_horizontal_tab c_vertical_tab iso_c_binding c_loc c_funloc c_associated  c_f_pointer c_ptr c_funptr iso_fortran_env character_storage_size error_unit file_storage_size input_unit iostat_end iostat_eor numeric_storage_size output_unit c_f_procpointer ieee_arithmetic ieee_support_underflow_control ieee_get_underflow_mode ieee_set_underflow_mode newunit contiguous recursive pad position action delim readwrite eor advance nml interface procedure namelist include sequence elemental pure impure integer real character complex logical codimension dimension allocatable|10 parameter external implicit|10 none double precision assign intent optional pointer target in out common equivalence data",
        built_in: "alog alog10 amax0 amax1 amin0 amin1 amod cabs ccos cexp clog csin csqrt dabs dacos dasin datan datan2 dcos dcosh ddim dexp dint dlog dlog10 dmax1 dmin1 dmod dnint dsign dsin dsinh dsqrt dtan dtanh float iabs idim idint idnint ifix isign max0 max1 min0 min1 sngl algama cdabs cdcos cdexp cdlog cdsin cdsqrt cqabs cqcos cqexp cqlog cqsin cqsqrt dcmplx dconjg derf derfc dfloat dgamma dimag dlgama iqint qabs qacos qasin qatan qatan2 qcmplx qconjg qcos qcosh qdim qerf qerfc qexp qgamma qimag qlgama qlog qlog10 qmax1 qmin1 qmod qnint qsign qsin qsinh qsqrt qtan qtanh abs acos aimag aint anint asin atan atan2 char cmplx conjg cos cosh exp ichar index int log log10 max min nint sign sin sinh sqrt tan tanh print write dim lge lgt lle llt mod nullify allocate deallocate adjustl adjustr all allocated any associated bit_size btest ceiling count cshift date_and_time digits dot_product eoshift epsilon exponent floor fraction huge iand ibclr ibits ibset ieor ior ishft ishftc lbound len_trim matmul maxexponent maxloc maxval merge minexponent minloc minval modulo mvbits nearest pack present product radix random_number random_seed range repeat reshape rrspacing scale scan selected_int_kind selected_real_kind set_exponent shape size spacing spread sum system_clock tiny transpose trim ubound unpack verify achar iachar transfer dble entry dprod cpu_time command_argument_count get_command get_command_argument get_environment_variable is_iostat_end ieee_arithmetic ieee_support_underflow_control ieee_get_underflow_mode ieee_set_underflow_mode is_iostat_eor move_alloc new_line selected_char_kind same_type_as extends_type_of acosh asinh atanh bessel_j0 bessel_j1 bessel_jn bessel_y0 bessel_y1 bessel_yn erf erfc erfc_scaled gamma log_gamma hypot norm2 atomic_define atomic_ref execute_command_line leadz trailz storage_size merge_bits bge bgt ble blt dshiftl dshiftr findloc iall iany iparity image_index lcobound ucobound maskl maskr num_images parity popcnt poppar shifta shiftl shiftr this_image sync change team co_broadcast co_max co_min co_sum co_reduce"
      },
      illegal: /\/\*/,
      contains: [J, Y, {
        begin: /^C\s*=(?!=)/,
        relevance: 0
      }, B, I]
    }
  }
  tk0.exports = fe9
})
// @from(Start 632488, End 634051)
Qy0 = z((U27, Ay0) => {
  function he9(A) {
    let Q = {
      begin: "<",
      end: ">",
      contains: [A.inherit(A.TITLE_MODE, {
        begin: /'[a-zA-Z0-9_]+/
      })]
    };
    return {
      name: "F#",
      aliases: ["fs"],
      keywords: "abstract and as assert base begin class default delegate do done downcast downto elif else end exception extern false finally for fun function global if in inherit inline interface internal lazy let match member module mutable namespace new null of open or override private public rec return sig static struct then to true try type upcast use val void when while with yield",
      illegal: /\/\*/,
      contains: [{
        className: "keyword",
        begin: /\b(yield|return|let|do)!/
      }, {
        className: "string",
        begin: '@"',
        end: '"',
        contains: [{
          begin: '""'
        }]
      }, {
        className: "string",
        begin: '"""',
        end: '"""'
      }, A.COMMENT("\\(\\*(\\s)", "\\*\\)", {
        contains: ["self"]
      }), {
        className: "class",
        beginKeywords: "type",
        end: "\\(|=|$",
        excludeEnd: !0,
        contains: [A.UNDERSCORE_TITLE_MODE, Q]
      }, {
        className: "meta",
        begin: "\\[<",
        end: ">\\]",
        relevance: 10
      }, {
        className: "symbol",
        begin: "\\B('[A-Za-z])\\b",
        contains: [A.BACKSLASH_ESCAPE]
      }, A.C_LINE_COMMENT_MODE, A.inherit(A.QUOTE_STRING_MODE, {
        illegal: null
      }), A.C_NUMBER_MODE]
    }
  }
  Ay0.exports = he9
})
// @from(Start 634057, End 638080)
Gy0 = z(($27, By0) => {
  function ge9(A) {
    if (!A) return null;
    if (typeof A === "string") return A;
    return A.source
  }

  function ue9(A) {
    return fD1("(", A, ")*")
  }

  function fD1(...A) {
    return A.map((B) => ge9(B)).join("")
  }

  function me9(A) {
    let Q = {
        keyword: "abort acronym acronyms alias all and assign binary card diag display else eq file files for free ge gt if integer le loop lt maximizing minimizing model models ne negative no not option options or ord positive prod put putpage puttl repeat sameas semicont semiint smax smin solve sos1 sos2 sum system table then until using while xor yes",
        literal: "eps inf na",
        built_in: "abs arccos arcsin arctan arctan2 Beta betaReg binomial ceil centropy cos cosh cvPower div div0 eDist entropy errorf execSeed exp fact floor frac gamma gammaReg log logBeta logGamma log10 log2 mapVal max min mod ncpCM ncpF ncpVUpow ncpVUsin normal pi poly power randBinomial randLinear randTriangle round rPower sigmoid sign signPower sin sinh slexp sllog10 slrec sqexp sqlog10 sqr sqrec sqrt tan tanh trunc uniform uniformInt vcPower bool_and bool_eqv bool_imp bool_not bool_or bool_xor ifThen rel_eq rel_ge rel_gt rel_le rel_lt rel_ne gday gdow ghour gleap gmillisec gminute gmonth gsecond gyear jdate jnow jstart jtime errorLevel execError gamsRelease gamsVersion handleCollect handleDelete handleStatus handleSubmit heapFree heapLimit heapSize jobHandle jobKill jobStatus jobTerminate licenseLevel licenseStatus maxExecError sleep timeClose timeComp timeElapsed timeExec timeStart"
      },
      B = {
        className: "params",
        begin: /\(/,
        end: /\)/,
        excludeBegin: !0,
        excludeEnd: !0
      },
      G = {
        className: "symbol",
        variants: [{
          begin: /=[lgenxc]=/
        }, {
          begin: /\$/
        }]
      },
      Z = {
        className: "comment",
        variants: [{
          begin: "'",
          end: "'"
        }, {
          begin: '"',
          end: '"'
        }],
        illegal: "\\n",
        contains: [A.BACKSLASH_ESCAPE]
      },
      I = {
        begin: "/",
        end: "/",
        keywords: Q,
        contains: [Z, A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE, A.QUOTE_STRING_MODE, A.APOS_STRING_MODE, A.C_NUMBER_MODE]
      },
      Y = /[a-z0-9&#*=?@\\><:,()$[\]_.{}!+%^-]+/,
      J = {
        begin: /[a-z][a-z0-9_]*(\([a-z0-9_, ]*\))?[ \t]+/,
        excludeBegin: !0,
        end: "$",
        endsWithParent: !0,
        contains: [Z, I, {
          className: "comment",
          begin: fD1(Y, ue9(fD1(/[ ]+/, Y))),
          relevance: 0
        }]
      };
    return {
      name: "GAMS",
      aliases: ["gms"],
      case_insensitive: !0,
      keywords: Q,
      contains: [A.COMMENT(/^\$ontext/, /^\$offtext/), {
        className: "meta",
        begin: "^\\$[a-z0-9]+",
        end: "$",
        returnBegin: !0,
        contains: [{
          className: "meta-keyword",
          begin: "^\\$[a-z0-9]+"
        }]
      }, A.COMMENT("^\\*", "$"), A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE, A.QUOTE_STRING_MODE, A.APOS_STRING_MODE, {
        beginKeywords: "set sets parameter parameters variable variables scalar scalars equation equations",
        end: ";",
        contains: [A.COMMENT("^\\*", "$"), A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE, A.QUOTE_STRING_MODE, A.APOS_STRING_MODE, I, J]
      }, {
        beginKeywords: "table",
        end: ";",
        returnBegin: !0,
        contains: [{
          beginKeywords: "table",
          end: "$",
          contains: [J]
        }, A.COMMENT("^\\*", "$"), A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE, A.QUOTE_STRING_MODE, A.APOS_STRING_MODE, A.C_NUMBER_MODE]
      }, {
        className: "function",
        begin: /^[a-z][a-z0-9_,\-+' ()$]+\.{2}/,
        returnBegin: !0,
        contains: [{
          className: "title",
          begin: /^[a-z0-9_]+/
        }, B, G]
      }, A.C_NUMBER_MODE, G]
    }
  }
  By0.exports = me9
})