
// @from(Ln 123753, Col 0)
async function EG5(A) {
    if (Or) return Or;
    if (!Nq6()) return;
    let q = C8(),
        K = n8A(q);
    return Or = (async () => {
        try {
            await hO.initialize(K, A), r8A = zX.subscribe(() => {
                let Y = C8(),
                    z = n8A(Y);
                hO.updateConfig(z), h("Sandbox configuration updated from settings change")
            })
        } catch (Y) {
            Or = void 0, h(`Failed to initialize sandbox: ${Y instanceof Error?Y.message:String(Y)}`)
        }
    })(), Or
}
// @from(Ln 123771, Col 0)
function kG5() {
    if (!Nq6()) return;
    let A = C8(),
        q = n8A(A);
    hO.updateConfig(q)
}
// @from(Ln 123777, Col 0)
async function LG5() {
    return r8A?.(), r8A = void 0, ce8.cache.clear?.(), ie8.cache.clear?.(), ne8.cache.clear?.(), re8.cache.clear?.(), o8A.cache.clear?.(), a8A.cache.clear?.(), Or = void 0, hO.reset()
}
// @from(Ln 123781, Col 0)
function ae8(A, q) {
    let K = y7("localSettings"),
        Y = K?.sandbox?.excludedCommands || [],
        z = A;
    if (q) {
        let w = q.filter((H) => H.type === "addRules" && H.rules.some(($) => $.toolName === h4));
        if (w.length > 0 && w[0].type === "addRules") {
            let H = w[0].rules.find(($) => $.toolName === h4);
            if (H?.ruleContent) z = WG5(H.ruleContent) || H.ruleContent
        }
    }
    if (!Y.includes(z)) Z7("localSettings", {
        sandbox: {
            ...K?.sandbox,
            excludedCommands: [...Y, z]
        }
    });
    return z
}
// @from(Ln 123800, Col 4)
Or
// @from(Ln 123800, Col 8)
r8A
// @from(Ln 123800, Col 13)
o8A
// @from(Ln 123800, Col 18)
ce8
// @from(Ln 123800, Col 23)
ie8
// @from(Ln 123800, Col 28)
ne8
// @from(Ln 123800, Col 33)
a8A
// @from(Ln 123800, Col 38)
re8
// @from(Ln 123800, Col 43)
b8
// @from(Ln 123801, Col 4)
k2 = v(() => {
    ge8();
    x3();
    p8();
    E$();
    B6();
    Z6();
    IQ();
    an1();
    _H();
    ix();
    E2();
    o8A = KA(() => {
        let {
            rgPath: A,
            rgArgs: q
        } = uw1();
        return hO.checkDependencies({
            command: A,
            args: q
        })
    }), ce8 = KA((A) => {
        return A?.sandbox?.enabled ?? !1
    });
    ie8 = KA((A) => {
        return A?.sandbox?.autoAllowBashIfSandboxed ?? !0
    });
    ne8 = KA((A) => {
        return A?.sandbox?.allowUnsandboxedCommands ?? !0
    });
    a8A = KA(() => {
        return hO.isSupportedPlatform()
    }), re8 = KA((A) => {
        let q = A?.sandbox?.enabledPlatforms;
        if (q === void 0) return !0;
        if (q.length === 0) return !1;
        let K = eA();
        return q.includes(K)
    });
    b8 = {
        initialize: EG5,
        isSandboxingEnabled: Nq6,
        isSandboxEnabledInSettings: le8,
        isPlatformInEnabledList: oe8,
        isAutoAllowBashIfSandboxedEnabled: GG5,
        areUnsandboxedCommandsAllowed: ZG5,
        areSandboxSettingsLockedByPolicy: VG5,
        setSandboxSettings: NG5,
        getExcludedCommands: TG5,
        wrapWithSandbox: vG5,
        refreshConfig: kG5,
        reset: LG5,
        checkDependencies: o8A,
        getFsReadConfig: hO.getFsReadConfig,
        getFsWriteConfig: hO.getFsWriteConfig,
        getNetworkRestrictionConfig: hO.getNetworkRestrictionConfig,
        getIgnoreViolations: hO.getIgnoreViolations,
        getLinuxGlobPatternWarnings: fG5,
        isSupportedPlatform: a8A,
        getAllowUnixSockets: hO.getAllowUnixSockets,
        getAllowLocalBinding: hO.getAllowLocalBinding,
        getEnableWeakerNestedSandbox: hO.getEnableWeakerNestedSandbox,
        getProxyPort: hO.getProxyPort,
        getSocksProxyPort: hO.getSocksProxyPort,
        getLinuxHttpSocketPath: hO.getLinuxHttpSocketPath,
        getLinuxSocksSocketPath: hO.getLinuxSocksSocketPath,
        waitForNetworkInitialization: hO.waitForNetworkInitialization,
        getSandboxViolationStore: hO.getSandboxViolationStore,
        annotateStderrWithSandboxFailures: hO.annotateStderrWithSandboxFailures
    }
})
// @from(Ln 123872, Col 4)
X1 = R((dG5) => {
    var e8A = Symbol.for("react.transitional.element"),
        RG5 = Symbol.for("react.portal"),
        yG5 = Symbol.for("react.fragment"),
        CG5 = Symbol.for("react.strict_mode"),
        SG5 = Symbol.for("react.profiler"),
        hG5 = Symbol.for("react.consumer"),
        IG5 = Symbol.for("react.context"),
        xG5 = Symbol.for("react.forward_ref"),
        bG5 = Symbol.for("react.suspense"),
        uG5 = Symbol.for("react.memo"),
        q17 = Symbol.for("react.lazy"),
        BG5 = Symbol.for("react.activity"),
        se8 = Symbol.iterator;

    function mG5(A) {
        if (A === null || typeof A !== "object") return null;
        return A = se8 && A[se8] || A["@@iterator"], typeof A === "function" ? A : null
    }
    var K17 = {
            isMounted: function() {
                return !1
            },
            enqueueForceUpdate: function() {},
            enqueueReplaceState: function() {},
            enqueueSetState: function() {}
        },
        Y17 = Object.assign,
        z17 = {};

    function S_1(A, q, K) {
        this.props = A, this.context = q, this.refs = z17, this.updater = K || K17
    }
    S_1.prototype.isReactComponent = {};
    S_1.prototype.setState = function(A, q) {
        if (typeof A !== "object" && typeof A !== "function" && A != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, A, q, "setState")
    };
    S_1.prototype.forceUpdate = function(A) {
        this.updater.enqueueForceUpdate(this, A, "forceUpdate")
    };

    function w17() {}
    w17.prototype = S_1.prototype;

    function A7A(A, q, K) {
        this.props = A, this.context = q, this.refs = z17, this.updater = K || K17
    }
    var q7A = A7A.prototype = new w17;
    q7A.constructor = A7A;
    Y17(q7A, S_1.prototype);
    q7A.isPureReactComponent = !0;
    var te8 = Array.isArray;

    function t8A() {}
    var cH = {
            H: null,
            A: null,
            T: null,
            S: null
        },
        H17 = Object.prototype.hasOwnProperty;

    function K7A(A, q, K) {
        var Y = K.ref;
        return {
            $$typeof: e8A,
            type: A,
            key: q,
            ref: Y !== void 0 ? Y : null,
            props: K
        }
    }

    function FG5(A, q) {
        return K7A(A.type, q, A.props)
    }

    function Y7A(A) {
        return typeof A === "object" && A !== null && A.$$typeof === e8A
    }

    function QG5(A) {
        var q = {
            "=": "=0",
            ":": "=2"
        };
        return "$" + A.replace(/[=:]/g, function(K) {
            return q[K]
        })
    }
    var ee8 = /\/+/g;

    function s8A(A, q) {
        return typeof A === "object" && A !== null && A.key != null ? QG5("" + A.key) : q.toString(36)
    }

    function gG5(A) {
        switch (A.status) {
            case "fulfilled":
                return A.value;
            case "rejected":
                throw A.reason;
            default:
                switch (typeof A.status === "string" ? A.then(t8A, t8A) : (A.status = "pending", A.then(function(q) {
                        A.status === "pending" && (A.status = "fulfilled", A.value = q)
                    }, function(q) {
                        A.status === "pending" && (A.status = "rejected", A.reason = q)
                    })), A.status) {
                    case "fulfilled":
                        return A.value;
                    case "rejected":
                        throw A.reason
                }
        }
        throw A
    }

    function C_1(A, q, K, Y, z) {
        var w = typeof A;
        if (w === "undefined" || w === "boolean") A = null;
        var H = !1;
        if (A === null) H = !0;
        else switch (w) {
            case "bigint":
            case "string":
            case "number":
                H = !0;
                break;
            case "object":
                switch (A.$$typeof) {
                    case e8A:
                    case RG5:
                        H = !0;
                        break;
                    case q17:
                        return H = A._init, C_1(H(A._payload), q, K, Y, z)
                }
        }
        if (H) return z = z(A), H = Y === "" ? "." + s8A(A, 0) : Y, te8(z) ? (K = "", H != null && (K = H.replace(ee8, "$&/") + "/"), C_1(z, q, K, "", function(_) {
            return _
        })) : z != null && (Y7A(z) && (z = FG5(z, K + (z.key == null || A && A.key === z.key ? "" : ("" + z.key).replace(ee8, "$&/") + "/") + H)), q.push(z)), 1;
        H = 0;
        var $ = Y === "" ? "." : Y + ":";
        if (te8(A))
            for (var O = 0; O < A.length; O++) Y = A[O], w = $ + s8A(Y, O), H += C_1(Y, q, K, w, z);
        else if (O = mG5(A), typeof O === "function")
            for (A = O.call(A), O = 0; !(Y = A.next()).done;) Y = Y.value, w = $ + s8A(Y, O++), H += C_1(Y, q, K, w, z);
        else if (w === "object") {
            if (typeof A.then === "function") return C_1(gG5(A), q, K, Y, z);
            throw q = String(A), Error("Objects are not valid as a React child (found: " + (q === "[object Object]" ? "object with keys {" + Object.keys(A).join(", ") + "}" : q) + "). If you meant to render a collection of children, use an array instead.")
        }
        return H
    }

    function Tq6(A, q, K) {
        if (A == null) return A;
        var Y = [],
            z = 0;
        return C_1(A, Y, "", "", function(w) {
            return q.call(K, w, z++)
        }), Y
    }

    function UG5(A) {
        if (A._status === -1) {
            var q = A._result;
            q = q(), q.then(function(K) {
                if (A._status === 0 || A._status === -1) A._status = 1, A._result = K
            }, function(K) {
                if (A._status === 0 || A._status === -1) A._status = 2, A._result = K
            }), A._status === -1 && (A._status = 0, A._result = q)
        }
        if (A._status === 1) return A._result.default;
        throw A._result
    }
    var A17 = typeof reportError === "function" ? reportError : function(A) {
            if (typeof window === "object" && typeof window.ErrorEvent === "function") {
                var q = new window.ErrorEvent("error", {
                    bubbles: !0,
                    cancelable: !0,
                    message: typeof A === "object" && A !== null && typeof A.message === "string" ? String(A.message) : String(A),
                    error: A
                });
                if (!window.dispatchEvent(q)) return
            } else if (typeof process === "object" && typeof process.emit === "function") {
                process.emit("uncaughtException", A);
                return
            }
            console.error(A)
        },
        pG5 = {
            map: Tq6,
            forEach: function(A, q, K) {
                Tq6(A, function() {
                    q.apply(this, arguments)
                }, K)
            },
            count: function(A) {
                var q = 0;
                return Tq6(A, function() {
                    q++
                }), q
            },
            toArray: function(A) {
                return Tq6(A, function(q) {
                    return q
                }) || []
            },
            only: function(A) {
                if (!Y7A(A)) throw Error("React.Children.only expected to receive a single React element child.");
                return A
            }
        };
    dG5.Activity = BG5;
    dG5.Children = pG5;
    dG5.Component = S_1;
    dG5.Fragment = yG5;
    dG5.Profiler = SG5;
    dG5.PureComponent = A7A;
    dG5.StrictMode = CG5;
    dG5.Suspense = bG5;
    dG5.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = cH;
    dG5.__COMPILER_RUNTIME = {
        __proto__: null,
        c: function(A) {
            return cH.H.useMemoCache(A)
        }
    };
    dG5.cache = function(A) {
        return function() {
            return A.apply(null, arguments)
        }
    };
    dG5.cacheSignal = function() {
        return null
    };
    dG5.cloneElement = function(A, q, K) {
        if (A === null || A === void 0) throw Error("The argument must be a React element, but you passed " + A + ".");
        var Y = Y17({}, A.props),
            z = A.key;
        if (q != null)
            for (w in q.key !== void 0 && (z = "" + q.key), q) !H17.call(q, w) || w === "key" || w === "__self" || w === "__source" || w === "ref" && q.ref === void 0 || (Y[w] = q[w]);
        var w = arguments.length - 2;
        if (w === 1) Y.children = K;
        else if (1 < w) {
            for (var H = Array(w), $ = 0; $ < w; $++) H[$] = arguments[$ + 2];
            Y.children = H
        }
        return K7A(A.type, z, Y)
    };
    dG5.createContext = function(A) {
        return A = {
            $$typeof: IG5,
            _currentValue: A,
            _currentValue2: A,
            _threadCount: 0,
            Provider: null,
            Consumer: null
        }, A.Provider = A, A.Consumer = {
            $$typeof: hG5,
            _context: A
        }, A
    };
    dG5.createElement = function(A, q, K) {
        var Y, z = {},
            w = null;
        if (q != null)
            for (Y in q.key !== void 0 && (w = "" + q.key), q) H17.call(q, Y) && Y !== "key" && Y !== "__self" && Y !== "__source" && (z[Y] = q[Y]);
        var H = arguments.length - 2;
        if (H === 1) z.children = K;
        else if (1 < H) {
            for (var $ = Array(H), O = 0; O < H; O++) $[O] = arguments[O + 2];
            z.children = $
        }
        if (A && A.defaultProps)
            for (Y in H = A.defaultProps, H) z[Y] === void 0 && (z[Y] = H[Y]);
        return K7A(A, w, z)
    };
    dG5.createRef = function() {
        return {
            current: null
        }
    };
    dG5.forwardRef = function(A) {
        return {
            $$typeof: xG5,
            render: A
        }
    };
    dG5.isValidElement = Y7A;
    dG5.lazy = function(A) {
        return {
            $$typeof: q17,
            _payload: {
                _status: -1,
                _result: A
            },
            _init: UG5
        }
    };
    dG5.memo = function(A, q) {
        return {
            $$typeof: uG5,
            type: A,
            compare: q === void 0 ? null : q
        }
    };
    dG5.startTransition = function(A) {
        var q = cH.T,
            K = {};
        cH.T = K;
        try {
            var Y = A(),
                z = cH.S;
            z !== null && z(K, Y), typeof Y === "object" && Y !== null && typeof Y.then === "function" && Y.then(t8A, A17)
        } catch (w) {
            A17(w)
        } finally {
            q !== null && K.types !== null && (q.types = K.types), cH.T = q
        }
    };
    dG5.unstable_useCacheRefresh = function() {
        return cH.H.useCacheRefresh()
    };
    dG5.use = function(A) {
        return cH.H.use(A)
    };
    dG5.useActionState = function(A, q, K) {
        return cH.H.useActionState(A, q, K)
    };
    dG5.useCallback = function(A, q) {
        return cH.H.useCallback(A, q)
    };
    dG5.useContext = function(A) {
        return cH.H.useContext(A)
    };
    dG5.useDebugValue = function() {};
    dG5.useDeferredValue = function(A, q) {
        return cH.H.useDeferredValue(A, q)
    };
    dG5.useEffect = function(A, q) {
        return cH.H.useEffect(A, q)
    };
    dG5.useEffectEvent = function(A) {
        return cH.H.useEffectEvent(A)
    };
    dG5.useId = function() {
        return cH.H.useId()
    };
    dG5.useImperativeHandle = function(A, q, K) {
        return cH.H.useImperativeHandle(A, q, K)
    };
    dG5.useInsertionEffect = function(A, q) {
        return cH.H.useInsertionEffect(A, q)
    };
    dG5.useLayoutEffect = function(A, q) {
        return cH.H.useLayoutEffect(A, q)
    };
    dG5.useMemo = function(A, q) {
        return cH.H.useMemo(A, q)
    };
    dG5.useOptimistic = function(A, q) {
        return cH.H.useOptimistic(A, q)
    };
    dG5.useReducer = function(A, q, K) {
        return cH.H.useReducer(A, q, K)
    };
    dG5.useRef = function(A) {
        return cH.H.useRef(A)
    };
    dG5.useState = function(A) {
        return cH.H.useState(A)
    };
    dG5.useSyncExternalStore = function(A, q, K) {
        return cH.H.useSyncExternalStore(A, q, K)
    };
    dG5.useTransition = function() {
        return cH.H.useTransition()
    };
    dG5.version = "19.2.0"
})
// @from(Ln 124255, Col 0)
function z7(A) {
    let q;
    return () => q ??= A()
}
// @from(Ln 124259, Col 4)
Jz = "Glob"
// @from(Ln 124260, Col 4)
z7A = `- Fast file pattern matching tool that works with any codebase size
- Supports glob patterns like "**/*.js" or "src/**/*.ts"
- Returns matching file paths sorted by modification time
- Use this tool when you need to find files by name patterns
- When you are doing an open ended search that may require multiple rounds of globbing and grepping, use the Agent tool instead
- You can call multiple tools in a single response. It is always better to speculatively perform multiple searches in parallel if they are potentially useful.`
// @from(Ln 124266, Col 4)
fK = "Task"
// @from(Ln 124268, Col 0)
function w7A() {
    return `A powerful search tool built on ripgrep

  Usage:
  - ALWAYS use ${s9} for search tasks. NEVER invoke \`grep\` or \`rg\` as a ${h4} command. The ${s9} tool has been optimized for correct permissions and access.
  - Supports full regex syntax (e.g., "log.*Error", "function\\s+\\w+")
  - Filter files with glob parameter (e.g., "*.js", "**/*.tsx") or type parameter (e.g., "js", "py", "rust")
  - Output modes: "content" shows matching lines, "files_with_matches" shows only file paths (default), "count" shows match counts
  - Use ${fK} tool for open-ended searches requiring multiple rounds
  - Pattern syntax: Uses ripgrep (not grep) - literal braces need escaping (use \`interface\\{\\}\` to find \`interface{}\` in Go code)
  - Multiline matching: By default patterns match within single lines only. For cross-line patterns like \`struct \\{[\\s\\S]*?field\`, use \`multiline: true\`
`
}
// @from(Ln 124281, Col 4)
s9 = "Grep"
// @from(Ln 124282, Col 4)
DW = () => {}
// @from(Ln 124284, Col 0)
function IZ5() {
    return `
- If this is an existing file, you MUST use the ${Jq} tool first to read the file's contents. This tool will fail if you did not read the file first.`
}
// @from(Ln 124289, Col 0)
function $17() {
    return `Writes a file to the local filesystem.

Usage:
- This tool will overwrite the existing file if there is one at the provided path.${IZ5()}
- ALWAYS prefer editing existing files in the codebase. NEVER write new files unless explicitly required.
- NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
- Only use emojis if the user explicitly requests it. Avoid writing emojis to files unless asked.`
}
// @from(Ln 124298, Col 4)
f5 = "Write"
// @from(Ln 124299, Col 4)
SD = v(() => {
    _H()
})
// @from(Ln 124302, Col 4)
jM = "NotebookEdit"
// @from(Ln 124304, Col 0)
function h_1() {
    let A = new Date,
        q = A.getFullYear(),
        K = String(A.getMonth() + 1).padStart(2, "0"),
        Y = String(A.getDate()).padStart(2, "0");
    return `${q}-${K}-${Y}`
}
// @from(Ln 124312, Col 0)
function O17() {
    let A = Number(h_1().slice(0, 4));
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
  - Today's date is ${h_1()}. You MUST use this year when searching for recent information, documentation, or current events.
  - Example: If the user asks for "latest React docs", search for "React documentation ${A}", NOT "React documentation ${A-1}"
`
}
// @from(Ln 124342, Col 4)
JL = "WebSearch"
// @from(Ln 124343, Col 4)
t81 = () => {}
// @from(Ln 124345, Col 0)
function X17(A) {
    let {
        hasThinking: q = !1
    } = A ?? {}, K = [];
    if (q && x8("tengu_marble_anvil", !1)) K.push({
        type: "clear_thinking_20251015",
        keep: "all"
    });
    return K.length > 0 ? {
        edits: K
    } : void 0
}
// @from(Ln 124357, Col 4)
_17 = 180000
// @from(Ln 124358, Col 4)
J17 = 40000
// @from(Ln 124359, Col 4)
xZ5
// @from(Ln 124359, Col 9)
bZ5
// @from(Ln 124360, Col 4)
D17 = v(() => {
    hA();
    U4();
    DW();
    _H();
    SD();
    t81();
    xZ5 = [h4, Jz, s9, Jq, xO, JL], bZ5 = [bq, f5, jM]
})
// @from(Ln 124370, Col 0)
function i4() {
    return x8("tengu_penguins_enabled", !0)
}
// @from(Ln 124374, Col 0)
function HS() {
    let A = x8("tengu_penguin_mode_promo", {
        discountPercent: 50,
        endDate: "Feb 16"
    });
    if (!A || A.discountPercent === 0) return null;
    return A
}
// @from(Ln 124383, Col 0)
function lH() {
    if (!i4()) return !1;
    return kq6() === null
}
// @from(Ln 124388, Col 0)
function uZ5(A, q) {
    switch (A) {
        case "free":
            return q === "oauth" ? "Fast mode requires a paid subscription" : "Fast mode unavailable during evaluation. Please purchase credits.";
        case "preference":
            return "Fast mode has been disabled by your organization";
        case "extra_usage_disabled":
            return "Fast mode requires extra usage billing · /extra-usage to enable"
    }
}
// @from(Ln 124399, Col 0)
function kq6() {
    if (!i4()) return "Fast mode is not available";
    if (!D9()) return "Fast mode requires the native binary · Install from: https://claude.com/product/claude-code";
    let A = x8("tengu_penguins_off", null);
    if (A !== null) return h(`Fast mode unavailable: ${A}`), A;
    if (w4() && _N1()) return h("Fast mode unavailable: Fast mode is not available in the Agent SDK"), "Fast mode is not available in the Agent SDK";
    if (E4() !== "firstParty") return h("Fast mode unavailable: Fast mode is not available on Bedrock, Vertex, or Foundry"), "Fast mode is not available on Bedrock, Vertex, or Foundry";
    if (b_1) {
        let q = a4() !== null ? "oauth" : "api-key",
            K = uZ5(b_1, q);
        return h(`Fast mode unavailable: ${K}`), K
    }
    return null
}
// @from(Ln 124414, Col 0)
function _7A(A) {
    if (!i4()) return !1;
    if (!lH()) return !1;
    if (!x$(A)) return !1;
    return l4().fastMode === !0
}
// @from(Ln 124421, Col 0)
function x$(A) {
    if (!i4()) return !1;
    let q = A ?? u_1();
    return t9(q).toLowerCase().includes("opus-4-6")
}
// @from(Ln 124427, Col 0)
function M17(A) {
    return vq6.add(A), () => {
        vq6.delete(A)
    }
}
// @from(Ln 124433, Col 0)
function J7A() {
    if (I_1.status === "cooldown" && Date.now() >= I_1.resetAt) {
        if (i4() && !H7A) {
            h("Fast mode cooldown expired, re-enabling fast mode"), H7A = !0;
            for (let A of vq6) A.onCooldownExpired()
        }
        I_1 = {
            status: "active"
        }
    }
    return I_1
}
// @from(Ln 124446, Col 0)
function P17(A) {
    if (!i4()) return;
    I_1 = {
        status: "cooldown",
        resetAt: A
    }, H7A = !1;
    let q = A - Date.now();
    h(`Fast mode cooldown triggered, duration ${Math.round(q/1000)}s`), c("tengu_fast_mode_fallback_triggered", {
        cooldown_duration_ms: q
    });
    for (let K of vq6) K.onCooldownTriggered(A)
}
// @from(Ln 124459, Col 0)
function e81() {
    I_1 = {
        status: "active"
    }
}
// @from(Ln 124465, Col 0)
function W17() {
    if (x_1 === !1) return;
    x_1 = !1, b_1 = "preference", Z7("userSettings", {
        fastMode: void 0
    }), jA((A) => ({
        ...A,
        penguinModeOrgEnabled: !1
    }));
    for (let A of Eq6) A(!1)
}
// @from(Ln 124476, Col 0)
function G17(A) {
    return $7A.add(A), () => {
        $7A.delete(A)
    }
}
// @from(Ln 124482, Col 0)
function BZ5(A) {
    switch (A) {
        case "out_of_credits":
            return "Fast mode disabled · extra usage credits exhausted";
        case "org_level_disabled":
        case "org_service_level_disabled":
            return "Fast mode disabled · extra usage disabled by your organization";
        case "org_level_disabled_until":
            return "Fast mode disabled · extra usage temporarily unavailable";
        case "member_level_disabled":
            return "Fast mode disabled · extra usage disabled for your account";
        case "seat_tier_level_disabled":
        case "seat_tier_zero_credit_limit":
        case "member_zero_credit_limit":
            return "Fast mode disabled · extra usage not available for your plan";
        case "overage_not_provisioned":
        case "no_limits_configured":
            return "Fast mode requires extra usage billing · /extra-usage to enable";
        default:
            return "Fast mode disabled · extra usage not available"
    }
}
// @from(Ln 124505, Col 0)
function Z17(A) {
    let q = BZ5(A);
    h(`Fast mode overage rejection: ${A??"unknown"} — ${q}`), c("tengu_fast_mode_overage_rejected", {
        overage_disabled_reason: A ?? "unknown"
    }), Z7("userSettings", {
        fastMode: void 0
    }), jA((K) => ({
        ...K,
        penguinModeOrgEnabled: !1
    }));
    for (let K of $7A) K(q)
}
// @from(Ln 124518, Col 0)
function Kv() {
    return J7A().status === "cooldown"
}
// @from(Ln 124522, Col 0)
function f17(A) {
    return Eq6.add(A), () => {
        Eq6.delete(A)
    }
}
// @from(Ln 124527, Col 0)
async function mZ5(A) {
    let q = `${P4().BASE_API_URL}/api/claude_code_penguin_mode`,
        K = "accessToken" in A ? {
            Authorization: `Bearer ${A.accessToken}`,
            "anthropic-beta": uf
        } : {
            "x-api-key": A.apiKey
        };
    return (await sA.get(q, {
        headers: K
    })).data
}
// @from(Ln 124539, Col 0)
async function Lq6() {
    if (!i4()) return;
    let A = Date.now();
    if (A - j17 < FZ5) {
        h("Skipping penguin mode prefetch, fetched recently");
        return
    }
    j17 = A;
    let q = a4(),
        K = Mk(),
        Y = q?.accessToken ? {
            accessToken: q.accessToken
        } : K ? {
            apiKey: K
        } : null;
    if (!Y) return;
    try {
        let z = await mZ5(Y),
            w = x_1 ?? f6().penguinModeOrgEnabled;
        if (x_1 = z.enabled, b_1 = z.disabled_reason ?? null, w !== z.enabled) {
            if (!z.enabled) Z7("userSettings", {
                fastMode: void 0
            });
            jA((H) => ({
                ...H,
                penguinModeOrgEnabled: z.enabled
            }));
            for (let H of Eq6) H(z.enabled)
        }
        h(`Org penguin mode: ${z.enabled?"enabled":`disabled (${b_1??"unknown"})`}`)
    } catch {
        x_1 = !1, b_1 = null, h(`Failed to fetch org penguin mode status, defaulting to ${x_1?"enabled":"disabled"}`), c("tengu_org_penguin_mode_fetch_failed", {})
    }
}
// @from(Ln 124573, Col 4)
zC1 = "opus"
// @from(Ln 124574, Col 4)
$S = "Opus 4.6"
// @from(Ln 124575, Col 4)
O7A = "Billed at a premium rate"
// @from(Ln 124576, Col 4)
I_1
// @from(Ln 124576, Col 9)
H7A = !1
// @from(Ln 124577, Col 4)
vq6
// @from(Ln 124577, Col 9)
$7A
// @from(Ln 124577, Col 14)
x_1
// @from(Ln 124577, Col 19)
b_1 = null
// @from(Ln 124578, Col 4)
Eq6
// @from(Ln 124578, Col 9)
FZ5 = 30000
// @from(Ln 124579, Col 4)
j17 = 0
// @from(Ln 124580, Col 4)
OJ = v(() => {
    y5();
    p8();
    u6();
    Z6();
    B6();
    J7();
    UH();
    e7();
    U4();
    Uz();
    cA();
    I_1 = {
        status: "active"
    }, vq6 = new Set;
    $7A = new Set;
    Eq6 = new Set
})
// @from(Ln 124599, Col 0)
function X7A({
    onlyFirst: A = !1
} = {}) {
    let K = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?(?:\\u0007|\\u001B\\u005C|\\u009C))", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))"].join("|");
    return new RegExp(K, A ? void 0 : "g")
}
// @from(Ln 124606, Col 0)
function JH(A) {
    if (typeof A !== "string") throw TypeError(`Expected a \`string\`, got \`${typeof A}\``);
    return A.replace(QZ5, "")
}
// @from(Ln 124610, Col 4)
QZ5
// @from(Ln 124611, Col 4)
XL = v(() => {
    QZ5 = X7A()
})
// @from(Ln 124615, Col 0)
function V17(A) {
    return A === 161 || A === 164 || A === 167 || A === 168 || A === 170 || A === 173 || A === 174 || A >= 176 && A <= 180 || A >= 182 && A <= 186 || A >= 188 && A <= 191 || A === 198 || A === 208 || A === 215 || A === 216 || A >= 222 && A <= 225 || A === 230 || A >= 232 && A <= 234 || A === 236 || A === 237 || A === 240 || A === 242 || A === 243 || A >= 247 && A <= 250 || A === 252 || A === 254 || A === 257 || A === 273 || A === 275 || A === 283 || A === 294 || A === 295 || A === 299 || A >= 305 && A <= 307 || A === 312 || A >= 319 && A <= 322 || A === 324 || A >= 328 && A <= 331 || A === 333 || A === 338 || A === 339 || A === 358 || A === 359 || A === 363 || A === 462 || A === 464 || A === 466 || A === 468 || A === 470 || A === 472 || A === 474 || A === 476 || A === 593 || A === 609 || A === 708 || A === 711 || A >= 713 && A <= 715 || A === 717 || A === 720 || A >= 728 && A <= 731 || A === 733 || A === 735 || A >= 768 && A <= 879 || A >= 913 && A <= 929 || A >= 931 && A <= 937 || A >= 945 && A <= 961 || A >= 963 && A <= 969 || A === 1025 || A >= 1040 && A <= 1103 || A === 1105 || A === 8208 || A >= 8211 && A <= 8214 || A === 8216 || A === 8217 || A === 8220 || A === 8221 || A >= 8224 && A <= 8226 || A >= 8228 && A <= 8231 || A === 8240 || A === 8242 || A === 8243 || A === 8245 || A === 8251 || A === 8254 || A === 8308 || A === 8319 || A >= 8321 && A <= 8324 || A === 8364 || A === 8451 || A === 8453 || A === 8457 || A === 8467 || A === 8470 || A === 8481 || A === 8482 || A === 8486 || A === 8491 || A === 8531 || A === 8532 || A >= 8539 && A <= 8542 || A >= 8544 && A <= 8555 || A >= 8560 && A <= 8569 || A === 8585 || A >= 8592 && A <= 8601 || A === 8632 || A === 8633 || A === 8658 || A === 8660 || A === 8679 || A === 8704 || A === 8706 || A === 8707 || A === 8711 || A === 8712 || A === 8715 || A === 8719 || A === 8721 || A === 8725 || A === 8730 || A >= 8733 && A <= 8736 || A === 8739 || A === 8741 || A >= 8743 && A <= 8748 || A === 8750 || A >= 8756 && A <= 8759 || A === 8764 || A === 8765 || A === 8776 || A === 8780 || A === 8786 || A === 8800 || A === 8801 || A >= 8804 && A <= 8807 || A === 8810 || A === 8811 || A === 8814 || A === 8815 || A === 8834 || A === 8835 || A === 8838 || A === 8839 || A === 8853 || A === 8857 || A === 8869 || A === 8895 || A === 8978 || A >= 9312 && A <= 9449 || A >= 9451 && A <= 9547 || A >= 9552 && A <= 9587 || A >= 9600 && A <= 9615 || A >= 9618 && A <= 9621 || A === 9632 || A === 9633 || A >= 9635 && A <= 9641 || A === 9650 || A === 9651 || A === 9654 || A === 9655 || A === 9660 || A === 9661 || A === 9664 || A === 9665 || A >= 9670 && A <= 9672 || A === 9675 || A >= 9678 && A <= 9681 || A >= 9698 && A <= 9701 || A === 9711 || A === 9733 || A === 9734 || A === 9737 || A === 9742 || A === 9743 || A === 9756 || A === 9758 || A === 9792 || A === 9794 || A === 9824 || A === 9825 || A >= 9827 && A <= 9829 || A >= 9831 && A <= 9834 || A === 9836 || A === 9837 || A === 9839 || A === 9886 || A === 9887 || A === 9919 || A >= 9926 && A <= 9933 || A >= 9935 && A <= 9939 || A >= 9941 && A <= 9953 || A === 9955 || A === 9960 || A === 9961 || A >= 9963 && A <= 9969 || A === 9972 || A >= 9974 && A <= 9977 || A === 9979 || A === 9980 || A === 9982 || A === 9983 || A === 10045 || A >= 10102 && A <= 10111 || A >= 11094 && A <= 11097 || A >= 12872 && A <= 12879 || A >= 57344 && A <= 63743 || A >= 65024 && A <= 65039 || A === 65533 || A >= 127232 && A <= 127242 || A >= 127248 && A <= 127277 || A >= 127280 && A <= 127337 || A >= 127344 && A <= 127373 || A === 127375 || A === 127376 || A >= 127387 && A <= 127404 || A >= 917760 && A <= 917999 || A >= 983040 && A <= 1048573 || A >= 1048576 && A <= 1114109
}
// @from(Ln 124619, Col 0)
function wC1(A) {
    return A === 12288 || A >= 65281 && A <= 65376 || A >= 65504 && A <= 65510
}
// @from(Ln 124623, Col 0)
function HC1(A) {
    return A >= 4352 && A <= 4447 || A === 8986 || A === 8987 || A === 9001 || A === 9002 || A >= 9193 && A <= 9196 || A === 9200 || A === 9203 || A === 9725 || A === 9726 || A === 9748 || A === 9749 || A >= 9776 && A <= 9783 || A >= 9800 && A <= 9811 || A === 9855 || A >= 9866 && A <= 9871 || A === 9875 || A === 9889 || A === 9898 || A === 9899 || A === 9917 || A === 9918 || A === 9924 || A === 9925 || A === 9934 || A === 9940 || A === 9962 || A === 9970 || A === 9971 || A === 9973 || A === 9978 || A === 9981 || A === 9989 || A === 9994 || A === 9995 || A === 10024 || A === 10060 || A === 10062 || A >= 10067 && A <= 10069 || A === 10071 || A >= 10133 && A <= 10135 || A === 10160 || A === 10175 || A === 11035 || A === 11036 || A === 11088 || A === 11093 || A >= 11904 && A <= 11929 || A >= 11931 && A <= 12019 || A >= 12032 && A <= 12245 || A >= 12272 && A <= 12287 || A >= 12289 && A <= 12350 || A >= 12353 && A <= 12438 || A >= 12441 && A <= 12543 || A >= 12549 && A <= 12591 || A >= 12593 && A <= 12686 || A >= 12688 && A <= 12773 || A >= 12783 && A <= 12830 || A >= 12832 && A <= 12871 || A >= 12880 && A <= 42124 || A >= 42128 && A <= 42182 || A >= 43360 && A <= 43388 || A >= 44032 && A <= 55203 || A >= 63744 && A <= 64255 || A >= 65040 && A <= 65049 || A >= 65072 && A <= 65106 || A >= 65108 && A <= 65126 || A >= 65128 && A <= 65131 || A >= 94176 && A <= 94180 || A >= 94192 && A <= 94198 || A >= 94208 && A <= 101589 || A >= 101631 && A <= 101662 || A >= 101760 && A <= 101874 || A >= 110576 && A <= 110579 || A >= 110581 && A <= 110587 || A === 110589 || A === 110590 || A >= 110592 && A <= 110882 || A === 110898 || A >= 110928 && A <= 110930 || A === 110933 || A >= 110948 && A <= 110951 || A >= 110960 && A <= 111355 || A >= 119552 && A <= 119638 || A >= 119648 && A <= 119670 || A === 126980 || A === 127183 || A === 127374 || A >= 127377 && A <= 127386 || A >= 127488 && A <= 127490 || A >= 127504 && A <= 127547 || A >= 127552 && A <= 127560 || A === 127568 || A === 127569 || A >= 127584 && A <= 127589 || A >= 127744 && A <= 127776 || A >= 127789 && A <= 127797 || A >= 127799 && A <= 127868 || A >= 127870 && A <= 127891 || A >= 127904 && A <= 127946 || A >= 127951 && A <= 127955 || A >= 127968 && A <= 127984 || A === 127988 || A >= 127992 && A <= 128062 || A === 128064 || A >= 128066 && A <= 128252 || A >= 128255 && A <= 128317 || A >= 128331 && A <= 128334 || A >= 128336 && A <= 128359 || A === 128378 || A === 128405 || A === 128406 || A === 128420 || A >= 128507 && A <= 128591 || A >= 128640 && A <= 128709 || A === 128716 || A >= 128720 && A <= 128722 || A >= 128725 && A <= 128728 || A >= 128732 && A <= 128735 || A === 128747 || A === 128748 || A >= 128756 && A <= 128764 || A >= 128992 && A <= 129003 || A === 129008 || A >= 129292 && A <= 129338 || A >= 129340 && A <= 129349 || A >= 129351 && A <= 129535 || A >= 129648 && A <= 129660 || A >= 129664 && A <= 129674 || A >= 129678 && A <= 129734 || A === 129736 || A >= 129741 && A <= 129756 || A >= 129759 && A <= 129770 || A >= 129775 && A <= 129784 || A >= 131072 && A <= 196605 || A >= 196608 && A <= 262141
}
// @from(Ln 124626, Col 4)
D7A = () => {}
// @from(Ln 124628, Col 0)
function gZ5(A) {
    if (!Number.isSafeInteger(A)) throw TypeError(`Expected a code point, got \`${typeof A}\`.`)
}
// @from(Ln 124632, Col 0)
function A71(A, {
    ambiguousAsWide: q = !1
} = {}) {
    if (gZ5(A), wC1(A) || HC1(A) || q && V17(A)) return 2;
    return 1
}
// @from(Ln 124638, Col 4)
$C1 = v(() => {
    D7A();
    D7A()
})
// @from(Ln 124642, Col 4)
T17 = R((_02, N17) => {
    N17.exports = function() {
        return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F|\uD83D\uDC68(?:\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68\uD83C\uDFFB|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|[\u2695\u2696\u2708]\uFE0F|\uD83D[\uDC66\uDC67]|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708])\uFE0F|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C[\uDFFB-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)\uD83C\uDFFB|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB\uDFFC])|\uD83D\uDC69(?:\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB-\uDFFD])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83C\uDFF4\u200D\u2620)\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDF6\uD83C\uDDE6|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5\uDEEB\uDEEC\uDEF4-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g
    }
})
// @from(Ln 124648, Col 0)
function T_() {
    if (!j7A) j7A = new Intl.Segmenter(void 0, {
        granularity: "grapheme"
    });
    return j7A
}
// @from(Ln 124655, Col 0)
function OC1(A) {
    if (!A) return "";
    return T_().segment(A)[Symbol.iterator]().next().value?.segment ?? ""
}
// @from(Ln 124660, Col 0)
function pg(A) {
    if (!A) return "";
    let q = "";
    for (let {
            segment: K
        }
        of T_().segment(A)) q = K;
    return q
}
// @from(Ln 124670, Col 0)
function E17() {
    if (!M7A) M7A = new Intl.Segmenter(void 0, {
        granularity: "word"
    });
    return M7A
}
// @from(Ln 124677, Col 0)
function W7A(A, q) {
    let K = `${A}:${q}`,
        Y = v17.get(K);
    if (!Y) Y = new Intl.RelativeTimeFormat("en", {
        style: A,
        numeric: q
    }), v17.set(K, Y);
    return Y
}
// @from(Ln 124687, Col 0)
function G7A() {
    if (!P7A) P7A = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return P7A
}
// @from(Ln 124691, Col 4)
j7A = null
// @from(Ln 124692, Col 4)
M7A = null
// @from(Ln 124693, Col 4)
v17
// @from(Ln 124693, Col 9)
P7A = null
// @from(Ln 124694, Col 4)
OS = v(() => {
    v17 = new Map
})
// @from(Ln 124698, Col 0)
function L17(A) {
    if (typeof A !== "string" || A.length === 0) return 0;
    let q = !0;
    for (let Y = 0; Y < A.length; Y++) {
        let z = A.charCodeAt(Y);
        if (z >= 127 || z === 27) {
            q = !1;
            break
        }
    }
    if (q) {
        let Y = 0;
        for (let z = 0; z < A.length; z++)
            if (A.charCodeAt(z) > 31) Y++;
        return Y
    }
    if (A.includes("\x1B")) {
        if (A = JH(A), A.length === 0) return 0
    }
    if (!UZ5(A)) {
        let Y = 0;
        for (let z of A) {
            let w = z.codePointAt(0);
            if (!R17(w)) Y += A71(w, {
                ambiguousAsWide: !1
            })
        }
        return Y
    }
    let K = 0;
    for (let {
            segment: Y
        }
        of T_().segment(A)) {
        if (k17.lastIndex = 0, k17.test(Y)) {
            K += pZ5(Y);
            continue
        }
        for (let z of Y) {
            let w = z.codePointAt(0);
            if (!R17(w)) {
                K += A71(w, {
                    ambiguousAsWide: !1
                });
                break
            }
        }
    }
    return K
}
// @from(Ln 124749, Col 0)
function UZ5(A) {
    for (let q of A) {
        let K = q.codePointAt(0);
        if (K >= 127744 && K <= 129791) return !0;
        if (K >= 9728 && K <= 10175) return !0;
        if (K >= 127462 && K <= 127487) return !0;
        if (K >= 65024 && K <= 65039) return !0;
        if (K === 8205) return !0
    }
    return !1
}
// @from(Ln 124761, Col 0)
function pZ5(A) {
    let q = A.codePointAt(0);
    if (q >= 127462 && q <= 127487) {
        let K = 0;
        for (let Y of A) K++;
        return K === 1 ? 1 : 2
    }
    if (A.length === 2) {
        if (A.codePointAt(1) === 65039 && (q >= 48 && q <= 57 || q === 35 || q === 42)) return 1
    }
    return 2
}
// @from(Ln 124774, Col 0)
function R17(A) {
    if (A >= 32 && A < 127) return !1;
    if (A >= 160 && A < 768) return A === 173;
    if (A <= 31 || A >= 127 && A <= 159) return !0;
    if (A >= 8203 && A <= 8205 || A === 65279 || A >= 8288 && A <= 8292) return !0;
    if (A >= 65024 && A <= 65039 || A >= 917760 && A <= 917999) return !0;
    if (A >= 768 && A <= 879 || A >= 6832 && A <= 6911 || A >= 7616 && A <= 7679 || A >= 8400 && A <= 8447 || A >= 65056 && A <= 65071) return !0;
    if (A >= 2304 && A <= 3407) {
        let q = A & 127;
        if (q <= 3) return !0;
        if (q >= 58 && q <= 79) return !0;
        if (q >= 81 && q <= 87) return !0;
        if (q >= 98 && q <= 99) return !0
    }
    if (A === 3633 || A >= 3636 && A <= 3642 || A >= 3655 && A <= 3662 || A === 3761 || A >= 3764 && A <= 3772 || A >= 3784 && A <= 3789) return !0;
    if (A >= 1536 && A <= 1541 || A === 1757 || A === 1807 || A === 2274) return !0;
    if (A >= 55296 && A <= 57343) return !0;
    if (A >= 917504 && A <= 917631) return !0;
    return !1
}
// @from(Ln 124795, Col 0)
function dZ5(A) {
    let q = 0;
    for (let K = 0; K < A.length; K++) {
        let Y = A.charCodeAt(K);
        if (Y === 3634 || Y === 3635 || Y === 3762 || Y === 3763) return !0;
        if (Y === 8205) {
            if (q === 2381 || q === 2509 || q === 2637 || q === 2765 || q === 2893 || q === 3021 || q === 3149 || q === 3277 || q === 3405) return !0
        }
        q = Y
    }
    return !1
}
// @from(Ln 124808, Col 0)
function UA(A) {
    if (typeof Bun < "u") {
        if (dZ5(A)) return L17(A);
        return Bun.stringWidth(A, {
            ambiguousIsNarrow: !0
        })
    }
    return L17(A)
}
// @from(Ln 124817, Col 4)
y17
// @from(Ln 124817, Col 9)
k17
// @from(Ln 124818, Col 4)
LY = v(() => {
    XL();
    $C1();
    OS();
    y17 = o(T17(), 1), k17 = y17.default()
})
// @from(Ln 124825, Col 0)
function C17(A, q) {
    if (UA(A) <= q) return A;
    if (q <= 0) return "…";
    if (q < 5) return K3(A, q);
    let K = A.lastIndexOf("/"),
        Y = K >= 0 ? A.slice(K) : A,
        z = K >= 0 ? A.slice(0, K) : "",
        w = UA(Y);
    if (w >= q - 1) return Rq6(A, q);
    let H = q - 1 - w;
    if (H <= 0) return Rq6(Y, q);
    return B_1(z, H) + "…" + Y
}
// @from(Ln 124839, Col 0)
function K3(A, q) {
    if (UA(A) <= q) return A;
    if (q <= 1) return "…";
    let K = 0,
        Y = "";
    for (let {
            segment: z
        }
        of T_().segment(A)) {
        let w = UA(z);
        if (K + w > q - 1) break;
        Y += z, K += w
    }
    return Y + "…"
}
// @from(Ln 124855, Col 0)
function Rq6(A, q) {
    if (UA(A) <= q) return A;
    if (q <= 1) return "…";
    let K = [...T_().segment(A)],
        Y = 0,
        z = K.length;
    for (let w = K.length - 1; w >= 0; w--) {
        let H = UA(K[w].segment);
        if (Y + H > q - 1) break;
        Y += H, z = w
    }
    return "…" + K.slice(z).map((w) => w.segment).join("")
}
// @from(Ln 124869, Col 0)
function B_1(A, q) {
    if (UA(A) <= q) return A;
    if (q <= 0) return "";
    let K = 0,
        Y = "";
    for (let {
            segment: z
        }
        of T_().segment(A)) {
        let w = UA(z);
        if (K + w > q) break;
        Y += z, K += w
    }
    return Y
}
// @from(Ln 124885, Col 0)
function DY(A, q, K = !1) {
    let Y = A;
    if (K) {
        let z = A.indexOf(`
`);
        if (z !== -1) {
            if (Y = A.substring(0, z), UA(Y) + 1 > q) return K3(Y, q);
            return `${Y}…`
        }
    }
    if (UA(Y) <= q) return Y;
    return K3(Y, q)
}
// @from(Ln 124899, Col 0)
function Xz(A, q) {
    if (A < 60000) {
        if (A === 0) return "0s";
        if (A < 1) return `${(A/1000).toFixed(1)}s`;
        return `${Math.round(A/1000).toString()}s`
    }
    let K = Math.floor(A / 86400000),
        Y = Math.floor(A % 86400000 / 3600000),
        z = Math.floor(A % 3600000 / 60000),
        w = Math.round(A % 60000 / 1000);
    if (w === 60) w = 0, z++;
    if (z === 60) z = 0, Y++;
    if (Y === 24) Y = 0, K++;
    let H = q?.hideTrailingZeros;
    if (q?.mostSignificantOnly) {
        if (K > 0) return `${K}d`;
        if (Y > 0) return `${Y}h`;
        if (z > 0) return `${z}m`;
        return `${w}s`
    }
    if (K > 0) {
        if (H && Y === 0 && z === 0) return `${K}d`;
        if (H && z === 0) return `${K}d ${Y}h`;
        return `${K}d ${Y}h ${z}m`
    }
    if (Y > 0) {
        if (H && z === 0 && w === 0) return `${Y}h`;
        if (H && w === 0) return `${Y}h ${z}m`;
        return `${Y}h ${z}m ${w}s`
    }
    if (z > 0) {
        if (H && w === 0) return `${z}m`;
        return `${z}m ${w}s`
    }
    return `${w}s`
}
// @from(Ln 124936, Col 0)
function Y3(A) {
    let q = A >= 1000;
    return cZ5(q).format(A).toLowerCase()
}
// @from(Ln 124941, Col 0)
function yq6(A, q = {}) {
    let {
        style: K = "narrow",
        numeric: Y = "always",
        now: z = new Date
    } = q, w = A.getTime() - z.getTime(), H = Math.trunc(w / 1000), $ = [{
        unit: "year",
        seconds: 31536000,
        shortUnit: "y"
    }, {
        unit: "month",
        seconds: 2592000,
        shortUnit: "mo"
    }, {
        unit: "week",
        seconds: 604800,
        shortUnit: "w"
    }, {
        unit: "day",
        seconds: 86400,
        shortUnit: "d"
    }, {
        unit: "hour",
        seconds: 3600,
        shortUnit: "h"
    }, {
        unit: "minute",
        seconds: 60,
        shortUnit: "m"
    }, {
        unit: "second",
        seconds: 1,
        shortUnit: "s"
    }];
    for (let {
            unit: O,
            seconds: _,
            shortUnit: J
        }
        of $)
        if (Math.abs(H) >= _) {
            let X = Math.trunc(H / _);
            if (K === "narrow") return H < 0 ? `${Math.abs(X)}${J} ago` : `in ${X}${J}`;
            return W7A("long", Y).format(X, O)
        } if (K === "narrow") return H <= 0 ? "0s ago" : "in 0s";
    return W7A(K, Y).format(0, "second")
}
// @from(Ln 124989, Col 0)
function q71(A, q = {}) {
    let {
        now: K = new Date,
        ...Y
    } = q;
    if (A > K) return yq6(A, {
        ...Y,
        now: K
    });
    return yq6(A, {
        ...Y,
        numeric: "always",
        now: K
    })
}
// @from(Ln 125005, Col 0)
function lZ5(A) {
    if (A < 1024) return `${A} B`;
    if (A < 1048576) return `${(A/1024).toFixed(1)} KB`;
    return `${(A/1048576).toFixed(1)} MB`
}
// @from(Ln 125011, Col 0)
function _C1(A) {
    let q = A.fileSize !== void 0 ? lZ5(A.fileSize) : `${A.messageCount} messages`,
        K = [q71(A.modified, {
            style: "short"
        }), ...A.gitBranch ? [A.gitBranch] : [], q];
    if (A.tag) K.push(`#${A.tag}`);
    if (A.agentSetting) K.push(`agent:${A.agentSetting}`);
    if (A.prNumber) {
        let Y = A.prRepository ? `${A.prRepository.split("/")[1]}#${A.prNumber}` : `PR #${A.prNumber}`;
        K.push(Y)
    }
    return K.join(" · ")
}
// @from(Ln 125025, Col 0)
function m_1(A, q = !1, K = !0) {
    if (!A) return;
    let Y = new Date(A * 1000),
        z = new Date,
        w = Y.getMinutes();
    if ((Y.getTime() - z.getTime()) / 3600000 > 24) {
        let O = {
            month: "short",
            day: "numeric",
            hour: K ? "numeric" : void 0,
            minute: !K || w === 0 ? void 0 : "2-digit",
            hour12: K ? !0 : void 0
        };
        if (Y.getFullYear() !== z.getFullYear()) O.year = "numeric";
        return Y.toLocaleString("en-US", O).replace(/ ([AP]M)/i, (J, X) => X.toLowerCase()) + (q ? ` (${G7A()})` : "")
    }
    return Y.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: w === 0 ? void 0 : "2-digit",
        hour12: !0
    }).replace(/ ([AP]M)/i, (O, _) => _.toLowerCase()) + (q ? ` (${G7A()})` : "")
}
// @from(Ln 125048, Col 0)
function hD(A) {
    if (A < 1000) return String(A);
    let K = (A / 1000).toFixed(1);
    if (K.endsWith(".0")) return `${K.slice(0,-2)}k`;
    return `${K}k`
}
// @from(Ln 125055, Col 0)
function S17(A, q = !1, K = !0) {
    let Y = new Date(A);
    return `${m_1(Math.floor(Y.getTime()/1000),q,K)}`
}
// @from(Ln 125059, Col 4)
Z7A = null
// @from(Ln 125060, Col 4)
f7A = null
// @from(Ln 125061, Col 4)
cZ5 = (A) => {
        if (A) {
            if (!Z7A) Z7A = new Intl.NumberFormat("en-US", {
                notation: "compact",
                maximumFractionDigits: 1,
                minimumFractionDigits: 1
            });
            return Z7A
        } else {
            if (!f7A) f7A = new Intl.NumberFormat("en-US", {
                notation: "compact",
                maximumFractionDigits: 1,
                minimumFractionDigits: 0
            });
            return f7A
        }
    }
// @from(Ln 125078, Col 4)
vq = v(() => {
    LY();
    OS()
})
// @from(Ln 125083, Col 0)
function V7A(A) {
    let q = sz();
    if (q.lastSessionId !== A) return;
    let K;
    if (q.lastModelUsage) K = Object.fromEntries(Object.entries(q.lastModelUsage).map(([Y, z]) => [Y, {
        ...z,
        contextWindow: yG(Y, FP()),
        maxOutputTokens: nz1(Y)
    }]));
    return {
        totalCostUSD: q.lastCost ?? 0,
        totalAPIDuration: q.lastAPIDuration ?? 0,
        totalAPIDurationWithoutRetries: q.lastAPIDurationWithoutRetries ?? 0,
        totalToolDuration: q.lastToolDuration ?? 0,
        totalLinesAdded: q.lastLinesAdded ?? 0,
        totalLinesRemoved: q.lastLinesRemoved ?? 0,
        lastDuration: q.lastDuration,
        modelUsage: K
    }
}
// @from(Ln 125104, Col 0)
function Cq6(A) {
    let q = V7A(A);
    if (!q) return !1;
    return zN1(q), !0
}
// @from(Ln 125110, Col 0)
function N7A(A) {
    iH((q) => ({
        ...q,
        lastCost: W0(),
        lastAPIDuration: wT(),
        lastAPIDurationWithoutRetries: fL6(),
        lastToolDuration: VL6(),
        lastDuration: oz1(),
        lastLinesAdded: q61(),
        lastLinesRemoved: K61(),
        lastTotalInputTokens: AN1(),
        lastTotalOutputTokens: qN1(),
        lastTotalCacheCreationInputTokens: TL6(),
        lastTotalCacheReadInputTokens: NL6(),
        lastTotalWebSearchRequests: vL6(),
        lastFpsAverage: A?.averageFps,
        lastFpsLow1Pct: A?.low1PctFps,
        lastModelUsage: Object.fromEntries(Object.entries(ty()).map(([K, Y]) => [K, {
            inputTokens: Y.inputTokens,
            outputTokens: Y.outputTokens,
            cacheReadInputTokens: Y.cacheReadInputTokens,
            cacheCreationInputTokens: Y.cacheCreationInputTokens,
            webSearchRequests: Y.webSearchRequests,
            costUSD: Y.costUSD
        }])),
        lastSessionId: U6()
    }))
}
// @from(Ln 125139, Col 0)
function JC1(A, q = 4) {
    return `$${A>0.5?nZ5(A,100).toFixed(2):A.toFixed(q)}`
}
// @from(Ln 125143, Col 0)
function iZ5() {
    let A = ty();
    if (Object.keys(A).length === 0) return "Usage:                 0 input, 0 output, 0 cache read, 0 cache write";
    let q = {};
    for (let [Y, z] of Object.entries(A)) {
        let w = v_(Y);
        if (!q[w]) q[w] = {
            inputTokens: 0,
            outputTokens: 0,
            cacheReadInputTokens: 0,
            cacheCreationInputTokens: 0,
            webSearchRequests: 0,
            costUSD: 0,
            contextWindow: 0,
            maxOutputTokens: 0
        };
        let H = q[w];
        H.inputTokens += z.inputTokens, H.outputTokens += z.outputTokens, H.cacheReadInputTokens += z.cacheReadInputTokens, H.cacheCreationInputTokens += z.cacheCreationInputTokens, H.webSearchRequests += z.webSearchRequests, H.costUSD += z.costUSD
    }
    let K = "Usage by model:";
    for (let [Y, z] of Object.entries(q)) {
        let w = `  ${Y3(z.inputTokens)} input, ${Y3(z.outputTokens)} output, ${Y3(z.cacheReadInputTokens)} cache read, ${Y3(z.cacheCreationInputTokens)} cache write` + (z.webSearchRequests > 0 ? `, ${Y3(z.webSearchRequests)} web search` : "") + ` (${JC1(z.costUSD)})`;
        K += `
` + `${Y}:`.padStart(21) + w
    }
    return K
}
// @from(Ln 125171, Col 0)
function T7A() {
    let A = JC1(W0()) + (EL6() ? " (costs may be inaccurate due to usage of unknown models)" : ""),
        q = iZ5();
    return H6.dim(`Total cost:            ${A}
Total duration (API):  ${Xz(wT())}
Total duration (wall): ${Xz(oz1())}
Total code changes:    ${q61()} ${q61()===1?"line":"lines"} added, ${K61()} ${K61()===1?"line":"lines"} removed
${q}`)
}
// @from(Ln 125181, Col 0)
function I17(A) {
    h17.useEffect(() => {
        let q = () => {
            if (hq6()) process.stdout.write(`
` + T7A() + `
`);
            N7A(A?.())
        };
        return process.on("exit", q), () => {
            process.off("exit", q)
        }
    }, [])
}
// @from(Ln 125195, Col 0)
function nZ5(A, q) {
    return Math.round(A * q) / q
}
// @from(Ln 125199, Col 0)
function Sq6(A, q, K) {
    ZL6(A, q, K);
    let Y = i4() && q.research_preview_2026_02 ? {
        model: K,
        speed: "fast"
    } : {
        model: K
    };
    SL6()?.add(A, Y), tz1()?.add(q.input_tokens, {
        ...Y,
        type: "input"
    }), tz1()?.add(q.output_tokens, {
        ...Y,
        type: "output"
    }), tz1()?.add(q.cache_read_input_tokens ?? 0, {
        ...Y,
        type: "cacheRead"
    }), tz1()?.add(q.cache_creation_input_tokens ?? 0, {
        ...Y,
        type: "cacheCreation"
    })
}
// @from(Ln 125221, Col 4)
h17
// @from(Ln 125222, Col 4)
DL = v(() => {
    q3();
    OJ();
    vq();
    e7();
    cA();
    B6();
    B6();
    B6();
    hf();
    B6();
    h17 = o(X1(), 1)
})
// @from(Ln 125236, Col 0)
function _r(A, q) {
    if (i4() && q) {
        let K = A ? E7A : v7A,
            Y = HS();
        if (Y) return aZ5(K, Y.discountPercent);
        return K
    }
    return A ? B17 : Y71
}
// @from(Ln 125246, Col 0)
function rZ5(A, q) {
    return q.input_tokens / 1e6 * A.inputTokens + q.output_tokens / 1e6 * A.outputTokens + (q.cache_read_input_tokens ?? 0) / 1e6 * A.promptCacheReadTokens + (q.cache_creation_input_tokens ?? 0) / 1e6 * A.promptCacheWriteTokens + (q.server_tool_use?.web_search_requests ?? 0) * A.webSearchRequests
}
// @from(Ln 125250, Col 0)
function x17(A) {
    return A.input_tokens + (A.cache_read_input_tokens ?? 0) + (A.cache_creation_input_tokens ?? 0)
}
// @from(Ln 125254, Col 0)
function oZ5(A, q) {
    let K = v_(A);
    if (K === v_(yn.firstParty)) {
        let z = q.research_preview_2026_02 !== void 0,
            w = x17(q) > 200000;
        return _r(w, z)
    }
    let Y = xq6[K];
    if (!Y) return b17(A, K), xq6[v_(m17)];
    if (x17(q) > 200000) {
        if (Y === K71) return k7A;
        if (Y === Y71) return B17;
        b17(A, K)
    }
    return Y
}
// @from(Ln 125271, Col 0)
function b17(A, q) {
    c("tengu_unknown_model_cost", {
        model: A,
        shortName: q
    }), Dn1()
}
// @from(Ln 125278, Col 0)
function bq6(A, q) {
    let K = oZ5(A, q);
    return rZ5(K, q)
}
// @from(Ln 125283, Col 0)
function u17(A) {
    if (Number.isInteger(A)) return `$${A}`;
    return `$${A.toFixed(2)}`
}
// @from(Ln 125288, Col 0)
function VV(A) {
    return `${u17(A.inputTokens)}/${u17(A.outputTokens)} per Mtok`
}
// @from(Ln 125292, Col 0)
function aZ5(A, q) {
    let K = (100 - q) / 100;
    return {
        inputTokens: A.inputTokens * K,
        outputTokens: A.outputTokens * K,
        promptCacheWriteTokens: A.promptCacheWriteTokens * K,
        promptCacheReadTokens: A.promptCacheReadTokens * K,
        webSearchRequests: A.webSearchRequests
    }
}
// @from(Ln 125302, Col 4)
K71
// @from(Ln 125302, Col 9)
Iq6
// @from(Ln 125302, Col 14)
Y71
// @from(Ln 125302, Col 19)
B17
// @from(Ln 125302, Col 24)
v7A
// @from(Ln 125302, Col 29)
E7A
// @from(Ln 125302, Col 34)
k7A
// @from(Ln 125302, Col 39)
L7A
// @from(Ln 125302, Col 44)
R7A
// @from(Ln 125302, Col 49)
xq6
// @from(Ln 125303, Col 4)
F_1 = v(() => {
    DL();
    u6();
    OJ();
    vO1();
    e7();
    K71 = {
        inputTokens: 3,
        outputTokens: 15,
        promptCacheWriteTokens: 3.75,
        promptCacheReadTokens: 0.3,
        webSearchRequests: 0.01
    }, Iq6 = {
        inputTokens: 15,
        outputTokens: 75,
        promptCacheWriteTokens: 18.75,
        promptCacheReadTokens: 1.5,
        webSearchRequests: 0.01
    }, Y71 = {
        inputTokens: 5,
        outputTokens: 25,
        promptCacheWriteTokens: 6.25,
        promptCacheReadTokens: 0.5,
        webSearchRequests: 0.01
    }, B17 = {
        inputTokens: 10,
        outputTokens: 37.5,
        promptCacheWriteTokens: 12.5,
        promptCacheReadTokens: 1,
        webSearchRequests: 0.01
    }, v7A = {
        inputTokens: 30,
        outputTokens: 150,
        promptCacheWriteTokens: 37.5,
        promptCacheReadTokens: 3,
        webSearchRequests: 0.01
    }, E7A = {
        inputTokens: 60,
        outputTokens: 225,
        promptCacheWriteTokens: 75,
        promptCacheReadTokens: 6,
        webSearchRequests: 0.01
    }, k7A = {
        inputTokens: 6,
        outputTokens: 22.5,
        promptCacheWriteTokens: 7.5,
        promptCacheReadTokens: 0.6,
        webSearchRequests: 0.01
    }, L7A = {
        inputTokens: 0.8,
        outputTokens: 4,
        promptCacheWriteTokens: 1,
        promptCacheReadTokens: 0.08,
        webSearchRequests: 0.01
    }, R7A = {
        inputTokens: 1,
        outputTokens: 5,
        promptCacheWriteTokens: 1.25,
        promptCacheReadTokens: 0.1,
        webSearchRequests: 0.01
    };
    xq6 = {
        [v_(AR1.firstParty)]: L7A,
        [v_(qR1.firstParty)]: R7A,
        [v_(eL1.firstParty)]: K71,
        [v_(tL1.firstParty)]: K71,
        [v_(v81.firstParty)]: K71,
        [v_(KR1.firstParty)]: Y71,
        [v_(YR1.firstParty)]: Iq6,
        [v_(zR1.firstParty)]: Iq6,
        [v_(wR1.firstParty)]: Y71,
        [v_(yn.firstParty)]: Y71
    }
})
// @from(Ln 125378, Col 0)
function Jr() {
    let A = process.env.CLAUDE_AGENT_SDK_VERSION ? `, agent-sdk/${process.env.CLAUDE_AGENT_SDK_VERSION}` : "";
    return `claude-cli/${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.38",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-02-10T00:04:56Z"}.VERSION} (external, ${process.env.CLAUDE_CODE_ENTRYPOINT}${A})`
}
// @from(Ln 125383, Col 0)
function Xr() {
    return `claude-code/${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.38",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-02-10T00:04:56Z"}.VERSION}`
}
// @from(Ln 125387, Col 0)
function XH() {
    return `claude-code/${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.38",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-02-10T00:04:56Z"}.VERSION}`
}
// @from(Ln 125391, Col 0)
function DH() {
    if (i8()) {
        let q = a4();
        if (!q?.accessToken) return {
            headers: {},
            error: "No OAuth token available"
        };
        return {
            headers: {
                Authorization: `Bearer ${q.accessToken}`,
                "anthropic-beta": uf
            }
        }
    }
    let A = Mk();
    if (!A) return {
        headers: {},
        error: "No API key available"
    };
    return {
        headers: {
            "x-api-key": A
        }
    }
}
// @from(Ln 125416, Col 4)
B0 = v(() => {
    J7();
    Uz()
})
// @from(Ln 125420, Col 0)
async function tZ5() {
    let A = u3()?.organizationUuid;
    if (!A) throw Error("No organization ID available");
    let q = DH();
    if (q.error) throw Error(`Auth error: ${q.error}`);
    let K = {
        "Content-Type": "application/json",
        "User-Agent": XH(),
        ...q.headers
    };
    try {
        let Y = `https://api.anthropic.com/api/organization/${A}/claude_code_sonnet_1m_access`,
            z = await sA.get(Y, {
                headers: K,
                timeout: 5000
            });
        return {
            hasAccess: z.data.has_access,
            hasAccessNotAsDefault: z.data.has_access_not_as_default,
            hasError: !1
        }
    } catch (Y) {
        return K1(Y), {
            hasAccess: !1,
            hasError: !0
        }
    }
}
// @from(Ln 125448, Col 0)
async function Af5() {
    try {
        return await eZ5()
    } catch (A) {
        return h("Sonnet-1M access check failed, defaulting to no access"), {
            hasAccess: !1,
            hasError: !0
        }
    }
}
// @from(Ln 125459, Col 0)
function z71() {
    let A = u3()?.organizationUuid;
    if (!A) return {
        hasAccess: !1,
        wasPartOfDefaultRollout: !1,
        needsRefresh: !1
    };
    let q = f6(),
        K = (i8() ? q.s1mAccessCache : q.s1mNonSubscriberAccessCache)?.[A],
        Y = Date.now();
    if (!K) return {
        hasAccess: !1,
        wasPartOfDefaultRollout: !1,
        needsRefresh: !0
    };
    let {
        hasAccess: z,
        hasAccessNotAsDefault: w,
        timestamp: H
    } = K, $ = Y - H > qf5;
    return {
        hasAccess: z || (w ?? !1),
        wasPartOfDefaultRollout: z,
        needsRefresh: $
    }
}
// @from(Ln 125485, Col 0)
async function F17() {
    let {
        needsRefresh: A
    } = z71();
    if (A) Kf5()
}
// @from(Ln 125491, Col 0)
async function Kf5() {
    let A = u3()?.organizationUuid;
    if (!A) return;
    if (!i8()) {
        let q = await os1();
        if (!q) return;
        let {
            uuid: K,
            rate_limit_tier: Y
        } = q.organization, z = {
            hasAccess: Y === "auto_prepaid_tier_3" || Y === "manual_tier_3",
            timestamp: Date.now()
        };
        jA((w) => ({
            ...w,
            s1mNonSubscriberAccessCache: {
                ...w.s1mNonSubscriberAccessCache,
                [K]: z
            }
        }));
        return
    }
    try {
        let {
            hasAccess: q,
            hasAccessNotAsDefault: K
        } = await Af5(), Y = {
            hasAccess: q,
            hasAccessNotAsDefault: K,
            timestamp: Date.now()
        };
        jA((z) => ({
            ...z,
            s1mAccessCache: {
                ...z.s1mAccessCache,
                [A]: Y
            }
        }))
    } catch (q) {
        h("Failed to fetch and cache Sonnet-1M access"), K1(q)
    }
}
// @from(Ln 125533, Col 4)
sZ5 = 3600000
// @from(Ln 125534, Col 4)
eZ5
// @from(Ln 125534, Col 9)
qf5 = 3600000
// @from(Ln 125535, Col 4)
uq6 = v(() => {
    y5();
    Rw1();
    B0();
    Z6();
    y6();
    cA();
    J7();
    pv1();
    eZ5 = Lw1(tZ5, sZ5)
})
// @from(Ln 125547, Col 0)
function Q_1() {
    if (x8("tengu_marble_lantern_disabled", !1)) return {
        hasAccess: !1
    };
    return {
        hasAccess: !i8()
    }
}
// @from(Ln 125555, Col 4)
y7A = v(() => {
    U4();
    J7()
})
// @from(Ln 125559, Col 4)
gY
// @from(Ln 125559, Col 8)
XC1 = "✻"
// @from(Ln 125560, Col 4)
Ou = "↯"
// @from(Ln 125561, Col 4)
jW = v(() => {
    G5();
    gY = xA.platform === "darwin" ? "⏺" : "●"
})
// @from(Ln 125566, Col 0)
function Bq6() {
    return "inherit"
}
// @from(Ln 125570, Col 0)
function _J() {
    return process.env.ANTHROPIC_SMALL_FAST_MODEL || I7A()
}
// @from(Ln 125574, Col 0)
function p_1(A) {
    return A === HH().opus40 || A === HH().opus41 || A === HH().opus45 || A === HH().opus46
}
// @from(Ln 125578, Col 0)
function mq6(A) {
    return A.includes("opus")
}
// @from(Ln 125582, Col 0)
function Fq6() {
    let A, q = HT();
    if (q !== void 0) A = q;
    else {
        let K = C8() || {};
        A = process.env.ANTHROPIC_MODEL || K.model || void 0
    }
    if (i8() && !tk() && A && mq6(A)) return;
    return A
}
// @from(Ln 125593, Col 0)
function H71(A = {}) {
    let q = Fq6();
    if (q !== null && q !== void 0) return q;
    let {
        forDisplay: K = !1
    } = A;
    return d17(K)
}
// @from(Ln 125602, Col 0)
function l3() {
    let A = H71();
    if (A !== void 0 && A !== null) return t9(A);
    return ML()
}
// @from(Ln 125608, Col 0)
function jL() {
    if (process.env.ANTHROPIC_DEFAULT_SONNET_MODEL) return process.env.ANTHROPIC_DEFAULT_SONNET_MODEL;
    return HH().sonnet45
}
// @from(Ln 125613, Col 0)
function S7A() {
    return dK() === "max"
}
// @from(Ln 125617, Col 0)
function h7A() {
    return dK() === "team"
}
// @from(Ln 125621, Col 0)
function DC1() {
    return dK() === "pro"
}
// @from(Ln 125625, Col 0)
function _u() {
    if (process.env.ANTHROPIC_DEFAULT_OPUS_MODEL) return process.env.ANTHROPIC_DEFAULT_OPUS_MODEL;
    if (E4() === "firstParty") return HH().opus46;
    return HH().opus41
}
// @from(Ln 125631, Col 0)
function zf5() {
    return _u()
}
// @from(Ln 125635, Col 0)
function I7A() {
    if (process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL) return process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL;
    return HH().haiku45
}
// @from(Ln 125640, Col 0)
function $71(A) {
    let {
        permissionMode: q,
        mainLoopModel: K,
        exceeds200kTokens: Y = !1
    } = A;
    if (H71() === "opusplan" && q === "plan" && !Y) return _u();
    if (H71() === "haiku" && q === "plan") return jL();
    return K
}
// @from(Ln 125651, Col 0)
function U17() {
    return null
}
// @from(Ln 125655, Col 0)
function p17(A) {
    return
}
// @from(Ln 125659, Col 0)
function d17(A) {
    let q = wf5();
    if (q !== null && q.name) return A ? q.displayName ?? q.name : q.name;
    return
}
// @from(Ln 125665, Col 0)
function u_1(A = {}) {
    let {
        forDisplay: q = !1
    } = A, K = d17(q);
    if (K !== void 0) return K;
    if (S7A() || h7A() || DC1()) return _u();
    return jL()
}
// @from(Ln 125674, Col 0)
function ML(A = {}) {
    return t9(u_1(A))
}
// @from(Ln 125678, Col 0)
function v_(A) {
    if (A.includes("claude-opus-4-6")) return "claude-opus-4-6";
    if (A.includes("claude-opus-4-5")) return "claude-opus-4-5";
    if (A.includes("claude-opus-4-1")) return "claude-opus-4-1";
    if (A.includes("claude-opus-4")) return "claude-opus-4";
    if (A.includes("claude-sonnet-4-5")) return "claude-sonnet-4-5";
    if (A.includes("claude-sonnet-4")) return "claude-sonnet-4";
    if (A.includes("claude-haiku-4-5")) return "claude-haiku-4-5";
    let q = A.match(/(claude-(\d+-\d+-)?\w+)/);
    if (q && q[1]) return q[1];
    return A
}
// @from(Ln 125690, Col 0)
async function c17() {
    try {
        if (f6().claudeCodeFirstTokenDate !== void 0) return;
        let q = DH();
        if (q.error) {
            K1(Error(`Failed to get auth headers: ${q.error}`));
            return
        }
        let Y = `${P4().BASE_API_URL}/api/organization/claude_code_first_token_date`,
            w = (await sA.get(Y, {
                headers: {
                    ...q.headers,
                    "User-Agent": XH()
                }
            })).data?.first_token_date ?? null;
        if (w !== null) {
            let H = new Date(w).getTime();
            if (isNaN(H)) {
                K1(Error(`Received invalid first_token_date from API: ${w}`));
                return
            }
        }
        jA((H) => ({
            ...H,
            claudeCodeFirstTokenDate: w
        }))
    } catch (A) {
        K1(A instanceof Error ? A : Error(String(A)))
    }
}
// @from(Ln 125721, Col 0)
function Qq6(A = !1) {
    if (S7A() || h7A() || DC1()) return `Opus 4.6 · Most capable for complex work${b7A(!1,A)}`;
    return "Sonnet 4.5 · Best for everyday tasks"
}
// @from(Ln 125726, Col 0)
function Hf5(A) {
    if (A === "opusplan") return "Opus 4.6 in plan mode, else Sonnet 4.5";
    return dG(t9(A))
}
// @from(Ln 125731, Col 0)
function l17(A) {
    if (A === "opusplan") return "Opus Plan";
    if (u7A(A)) return A.charAt(0).toUpperCase() + A.slice(1);
    return dG(A)
}
// @from(Ln 125737, Col 0)
function gq6(A) {
    switch (A) {
        case HH().opus46:
            return "Opus 4.6";
        case HH().opus46 + "[1m]":
            return "Opus 4.6 (1M context)";
        case HH().opus45:
            return "Opus 4.5";
        case HH().opus41:
            return "Opus 4.1";
        case HH().opus40:
            return "Opus 4";
        case HH().sonnet45 + "[1m]":
            return "Sonnet 4.5 (1M context)";
        case HH().sonnet45:
            return "Sonnet 4.5";
        case HH().sonnet40:
            return "Sonnet 4";
        case HH().sonnet40 + "[1m]":
            return "Sonnet 4 (1M context)";
        case HH().sonnet37:
            return "Sonnet 3.7";
        case HH().sonnet35:
            return "Sonnet 3.5";
        case HH().haiku45:
            return "Haiku 4.5";
        case HH().haiku35:
            return "Haiku 3.5";
        default:
            return null
    }
}
// @from(Ln 125770, Col 0)
function dG(A) {
    let q = gq6(A);
    if (q) return q;
    return A
}
// @from(Ln 125776, Col 0)
function i17(A) {
    let q = gq6(A);
    if (q) return `Claude ${q}`;
    return `Claude (${A})`
}
// @from(Ln 125782, Col 0)
function w71(A = !1) {
    if (i8()) {
        if (!tk()) return {
            value: null,
            label: "Sonnet",
            description: x7A().description
        };
        return {
            value: null,
            label: "Default (recommended)",
            description: Qq6(A)
        }
    }
    let q = E4() !== "firstParty";
    return {
        value: null,
        label: "Default (recommended)",
        description: `Use the default model (currently ${Hf5(u_1({forDisplay:!0}))})${q?"":` · ${VV(K71)}`}`
    }
}
// @from(Ln 125803, Col 0)
function x7A() {
    return {
        value: "sonnet",
        label: "Sonnet",
        description: `Sonnet 4.5 · Best for everyday tasks${E4()!=="firstParty"?"":` · ${VV(K71)}`}`,
        descriptionForModel: "Sonnet 4.5 - best for everyday tasks. Generally recommended for most coding tasks"
    }
}
// @from(Ln 125812, Col 0)
function b7A(A, q) {
    if (!q) return "";
    let K = VV(_r(A, !0)),
        Y = HS(),
        z = Y ? ` (${Y.discountPercent}% off)` : "";
    return ` · (${Ou}) ${K}${z}`
}
// @from(Ln 125820, Col 0)
function r17() {
    return {
        value: "sonnet[1m]",
        label: "Sonnet (1M context)",
        description: `Sonnet 4.5 for long sessions${E4()!=="firstParty"?"":` · ${VV(k7A)}`}`,
        descriptionForModel: "Sonnet 4.5 with 1M context window - for long sessions with large codebases"
    }
}
// @from(Ln 125829, Col 0)
function o17(A = !1) {
    let q = E4() !== "firstParty",
        K = A && !q ? ` (${Ou})` : "",
        Y = A && !q ? HS() : null,
        z = Y ? ` (${Y.discountPercent}% off)` : "";
    return {
        value: q ? "claude-opus-4-6[1m]" : "opus[1m]",
        label: "Opus (1M context)",
        description: `Opus 4.6 for long sessions${q?"":` ·${K} ${VV(_r(!0,A))}${z}`}`,
        descriptionForModel: "Opus 4.6 with 1M context window - for long sessions with large codebases"
    }
}
// @from(Ln 125842, Col 0)
function a17() {
    return {
        value: "haiku",
        label: "Haiku",
        description: `Haiku 4.5 · Fastest for quick answers${E4()!=="firstParty"?"":` · ${VV(R7A)}`}`,
        descriptionForModel: "Haiku 4.5 - fastest for quick answers. Lower cost but less capable than Sonnet 4.5."
    }
}
// @from(Ln 125851, Col 0)
function Of5() {
    return {
        value: "haiku",
        label: "Haiku",
        description: `Haiku 3.5 for simple tasks${E4()!=="firstParty"?"":` · ${VV(L7A)}`}`,
        descriptionForModel: "Haiku 3.5 - faster and lower cost, but less capable than Sonnet. Use for simple tasks."
    }
}
// @from(Ln 125860, Col 0)
function _f5() {
    return I7A() === HH().haiku45 ? a17() : Of5()
}
// @from(Ln 125864, Col 0)
function Jf5(A = !1) {
    return {
        value: "opus",
        label: "Opus",
        description: `Opus 4.6 · Most capable for complex work${b7A(!1,A)}`
    }
}
// @from(Ln 125872, Col 0)
function g17(A = !1) {
    return {
        value: "opus[1m]",
        label: "Opus (1M context)",
        description: `Opus 4.6 with 1M context · Uses rate limits faster${b7A(!0,A)}`
    }
}
// @from(Ln 125880, Col 0)
function jf5(A = !1) {
    if (i8()) {
        if (!tk()) return [w71(), C7A];
        if (S7A() || h7A() || DC1()) {
            let Y = [w71(A)];
            if (Q_1().hasAccess) Y.push(g17(A));
            if (Y.push(Xf5), z71().hasAccess) Y.push(Q17);
            return Y.push(C7A), Y
        }
        let K = [w71(), Jf5(A)];
        if (Q_1().hasAccess) K.push(g17(A));
        if (z71().hasAccess) K.push(Q17);
        return K.push(C7A), K
    }
    let q = [w71(), n17(A)];
    if (E4() !== "firstParty") q.push($f5());
    if (Q_1().hasAccess) q.push(o17(A));
    if (z71().hasAccess) q.push(r17());
    return q.push(a17()), q
}
// @from(Ln 125901, Col 0)
function O71(A = !1) {
    let q = jf5(A),
        K = null,
        Y = Fq6(),
        z = YN1();
    if (Y !== void 0 && Y !== null) K = Y;
    else if (z !== null) K = z;
    if (K === null || q.some((w) => w.value === K)) return q;
    if (K === "opusplan") return [...q, Df5()];
    if (!i8() && u7A(K))
        if (K === "sonnet") q.push(x7A());
        else if (K === "sonnet[1m]") q.push(r17());
    else if (K === "opus[1m]") q.push(o17(A));
    else if (K === "opus") q.push(n17(A));
    else if (K === "haiku") q.push(_f5());
    else q.push({
        value: K,
        label: K,
        description: "Custom model"
    });
    else q.push({
        value: K,
        label: K,
        description: "Custom model"
    });
    return q
}
// @from(Ln 125929, Col 0)
function u7A(A) {
    return g_1.includes(A)
}
// @from(Ln 125933, Col 0)
function t9(A) {
    let q = A.trim(),
        K = q.toLowerCase(),
        Y = K.endsWith("[1m]"),
        z = Y ? K.replace(/\[1m]$/i, "").trim() : K;
    if (u7A(z)) switch (z) {
        case "opusplan":
            return jL() + (Y ? "[1m]" : "");
        case "sonnet":
            return jL() + (Y ? "[1m]" : "");
        case "haiku":
            return I7A() + (Y ? "[1m]" : "");
        case "opus":
            return _u() + (Y ? "[1m]" : "");
        case "best":
            return zf5();
        default:
    }
    if (Y) return q.replace(/\[1m\]$/i, "").trim() + "[1m]";
    return q
}
// @from(Ln 125955, Col 0)
function _S(A) {
    if (A === null) {
        if (i8() && !tk()) return `Sonnet (${x7A().description})`;
        else if (i8()) return `Default (${Qq6()})`;
        return `Default (${ML({forDisplay:!0})})`
    }
    let q = t9(A);
    return A === q ? q : `${A} (${q})`
}
// @from(Ln 125965, Col 0)
function Uq6(A, q, K, Y, z) {
    if (process.env.CLAUDE_CODE_SUBAGENT_MODEL) return t9(process.env.CLAUDE_CODE_SUBAGENT_MODEL);
    let w = E1A(q),
        H = (O) => {
            if (w && E4() === "bedrock") return dl8(O, w);
            return O
        };
    if (K) return H(t9(K));
    let $ = A ?? Bq6();
    if (!$) return H(t9(Bq6()));
    if ($ === "inherit") return $71({
        permissionMode: Y ?? "default",
        mainLoopModel: q,
        exceeds200kTokens: !1
    });
    return H(t9($))
}
// @from(Ln 125983, Col 0)
function pq6(A) {
    if (!A) return "Inherit (default)";
    if (A === "inherit") return "Inherit from parent";
    return A.charAt(0).toUpperCase() + A.slice(1)
}
// @from(Ln 125989, Col 0)
function s17() {
    let A = [{
        value: "sonnet",
        label: "Sonnet",
        description: "Balanced performance - best for most agents"
    }];
    if (tk()) A.push({
        value: "opus",
        label: "Opus",
        description: "Most capable for complex reasoning tasks"
    });
    return A.push({
        value: "haiku",
        label: "Haiku",
        description: "Fast and efficient for simple tasks"
    }, {
        value: "inherit",
        label: "Inherit from parent",
        description: "Use the same model as the main conversation"
    }), A
}
// @from(Ln 126011, Col 0)
function dg(A) {
    return A.replace(/\[(1|2)m\]/gi, "")
}
// @from(Ln 126014, Col 4)
g_1
// @from(Ln 126014, Col 9)
Yf5
// @from(Ln 126014, Col 14)
m17
// @from(Ln 126014, Col 19)
U_1
// @from(Ln 126014, Col 24)
wf5
// @from(Ln 126014, Col 29)
n17 = (A = !1) => {
        let q = E4() !== "firstParty",
            K = q ? "4.1" : "4.6",
            Y = q ? Iq6 : _r(!1, A),
            z = q ? "Legacy" : "Most capable for complex work",
            w = A && !q ? ` (${Ou})` : "",
            H = A && !q ? HS() : null,
            $ = H ? ` (${H.discountPercent}% off)` : "";
        return {
            value: "opus",
            label: q ? "Opus 4.1" : "Opus",
            description: `Opus ${K} · ${z}${q?"":` ·${w} ${VV(Y)}${$}`}`,
            descriptionForModel: q ? "Opus 4.1 - legacy version" : "Opus 4.6 - most capable for complex work"
        }
    }
// @from(Ln 126029, Col 4)
$f5 = () => {
        let A = E4() !== "firstParty";
        return {
            value: HH().opus46,
            label: "Opus 4.6",
            description: `Opus 4.6 · Most capable for complex work${A?"":` · ${VV(Y71)}`}`,
            descriptionForModel: "Opus 4.6 - most capable for complex work"
        }
    }
// @from(Ln 126038, Col 4)
Q17
// @from(Ln 126038, Col 9)
Xf5
// @from(Ln 126038, Col 14)
C7A
// @from(Ln 126038, Col 19)
Df5 = () => {
        return {
            value: "opusplan",
            label: "Opus Plan Mode",
            description: "Use Opus 4.6 in plan mode, Sonnet 4.5 otherwise"
        }
    }
// @from(Ln 126045, Col 4)
e7 = v(() => {
    zq();
    cA();
    B6();
    J7();
    vO1();
    c86();
    F_1();
    OJ();
    p8();
    _71();
    y5();
    Uz();
    y6();
    B0();
    uq6();
    y7A();
    UH();
    sL1();
    U4();
    jW();
    g_1 = ["sonnet", "opus", "haiku", "best", "sonnet[1m]", "opus[1m]", "opusplan"], Yf5 = v81, m17 = Yf5.firstParty, U_1 = [...g_1, "inherit"];
    wf5 = KA(() => {
        return null
    });
    Q17 = {
        value: "sonnet[1m]",
        label: "Sonnet (1M context)",
        description: "Sonnet 4.5 with 1M context · Uses rate limits faster"
    };
    Xf5 = {
        value: "sonnet",
        label: "Sonnet",
        description: "Sonnet 4.5 · Best for everyday tasks"
    }, C7A = {
        value: "haiku",
        label: "Haiku",
        description: "Haiku 4.5 · Fastest for quick answers"
    }
})
// @from(Ln 126086, Col 0)
function cq6(A) {
    if (E4() === "vertex") return B7A;
    if (A?.isNonInteractive) {
        if (A.hasAppendSystemPrompt) return t17;
        return e17
    }
    return B7A
}
// @from(Ln 126095, Col 0)
function Pf5() {
    if (FY(process.env.CLAUDE_CODE_ATTRIBUTION_HEADER)) return !1;
    return x8("tengu_attribution_header", !0)
}
// @from(Ln 126100, Col 0)
function lq6(A) {
    if (!Pf5()) return "";
    let q = `${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.38",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-02-10T00:04:56Z"}.VERSION}.${A}`,
        K = process.env.CLAUDE_CODE_ENTRYPOINT ?? "unknown",
        z = `x-anthropic-billing-header: cc_version=${q}; cc_entrypoint=${K};${" cch=00000;"}`;
    return h(`attribution header ${z}`), z
}
// @from(Ln 126107, Col 4)
B7A = "You are Claude Code, Anthropic's official CLI for Claude."
// @from(Ln 126108, Col 4)
t17 = "You are Claude Code, Anthropic's official CLI for Claude, running within the Claude Agent SDK."
// @from(Ln 126109, Col 4)
e17 = "You are a Claude agent, built on Anthropic's Claude Agent SDK."
// @from(Ln 126110, Col 4)
Mf5
// @from(Ln 126110, Col 9)
dq6
// @from(Ln 126111, Col 4)
iq6 = v(() => {
    UH();
    Z6();
    U4();
    hA();
    Mf5 = [B7A, t17, e17], dq6 = new Set(Mf5)
})
// @from(Ln 126122, Col 0)
function Zf5(A) {
    let q = A.find((Y) => Y.type === "user");
    if (!q) return "";
    let K = q.message.content;
    if (typeof K === "string") return K;
    if (Array.isArray(K)) {
        let Y = K.find((z) => z.type === "text");
        if (Y && Y.type === "text") return Y.text
    }
    return ""
}
// @from(Ln 126134, Col 0)
function m7A(A, q) {
    let Y = [4, 7, 20].map((H) => A[H] || "0").join(""),
        z = `${Gf5}${Y}${q}`;
    return Wf5("sha256").update(z).digest("hex").slice(0, 3)
}
// @from(Ln 126140, Col 0)
function A67(A) {
    let q = Zf5(A);
    return m7A(q, {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.38",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-02-10T00:04:56Z"
    }.VERSION)
}
// @from(Ln 126151, Col 4)
Gf5 = "59cf53e54c78"
// @from(Ln 126152, Col 4)
F7A = () => {}
// @from(Ln 126153, Col 4)
q67
// @from(Ln 126153, Col 9)
K67 = "Update the todo list for the current session. To be used proactively and often to track progress and pending tasks. Make sure that at least one task is in_progress at all times. Always provide both content (imperative) and activeForm (present continuous) for each task."