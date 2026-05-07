
// @from(Ln 368096, Col 4)
DM6 = L(() => {
    cy();
    p7();
    gq();
    m8();
    eK();
    nN();
    Yq();
    mO();
    qQ8();
    b9();
    Sz();
    e8();
    WWK();
    czY = C6(() => y.strictObject({
        notebook_path: y.string().describe("The absolute path to the Jupyter notebook file to edit (must be absolute, not relative)"),
        cell_id: y.string().optional().describe("The ID of the cell to edit. When inserting a new cell, the new cell will be inserted after the cell with this ID, or at the beginning if not specified."),
        new_source: y.string().describe("The new source for the cell"),
        cell_type: y.enum(["code", "markdown"]).optional().describe("The type of the cell (code or markdown). If not specified, it defaults to the current cell type. If using edit_mode=insert, this is required."),
        edit_mode: y.enum(["replace", "insert", "delete"]).optional().describe("The type of edit to make (replace, insert, delete). Defaults to replace.")
    })), lzY = C6(() => y.object({
        new_source: y.string().describe("The new source code that was written to the cell"),
        cell_id: y.string().optional().describe("The ID of the cell that was edited"),
        cell_type: y.enum(["code", "markdown"]).describe("The type of the cell"),
        language: y.string().describe("The programming language of the notebook"),
        edit_mode: y.string().describe("The edit mode that was used"),
        error: y.string().optional().describe("Error message if the operation failed"),
        notebook_path: y.string().describe("The path to the notebook file"),
        original_file: y.string().describe("The original notebook content before modification"),
        updated_file: y.string().describe("The updated notebook content after modification")
    })), Ou = Iq({
        name: HJ,
        searchHint: "edit Jupyter notebook cells (.ipynb)",
        maxResultSizeChars: 1e5,
        shouldDefer: !0,
        async description() {
            return wWK
        },
        async prompt() {
            return $WK
        },
        backfillObservableInput(q) {
            if (typeof q.notebook_path === "string") q.notebook_path = Wq(q.notebook_path)
        },
        userFacingName() {
            return "Edit Notebook"
        },
        getToolUseSummary: qK7,
        getActivityDescription(q) {
            let K = qK7(q);
            return K ? `Editing notebook ${K}` : "Editing notebook"
        },
        get inputSchema() {
            return czY()
        },
        get outputSchema() {
            return lzY()
        },
        toAutoClassifierInput(q) {
            {
                let K = q.edit_mode ?? "replace";
                return `${q.notebook_path} ${K}: ${q.new_source}`
            }
            return ""
        },
        getPath(q) {
            return q.notebook_path
        },
        async checkPermissions(q, K) {
            let _ = K.getAppState();
            return PM6(Ou, q, _.toolPermissionContext)
        },
        mapToolResultToToolResultBlockParam({
            cell_id: q,
            edit_mode: K,
            new_source: _,
            error: z
        }, Y) {
            if (z) return {
                tool_use_id: Y,
                type: "tool_result",
                content: z,
                is_error: !0
            };
            switch (K) {
                case "replace":
                    return {
                        tool_use_id: Y, type: "tool_result", content: `Updated cell ${q} with ${_}`
                    };
                case "insert":
                    return {
                        tool_use_id: Y, type: "tool_result", content: `Inserted cell ${q} with ${_}`
                    };
                case "delete":
                    return {
                        tool_use_id: Y, type: "tool_result", content: `Deleted cell ${q}`
                    };
                default:
                    return {
                        tool_use_id: Y, type: "tool_result", content: "Unknown edit mode"
                    }
            }
        },
        renderToolUseMessage: JWK,
        renderToolUseRejectedMessage: XWK,
        renderToolUseErrorMessage: MWK,
        renderToolResultMessage: PWK,
        async validateInput({
            notebook_path: q,
            cell_type: K,
            cell_id: _,
            edit_mode: z = "replace"
        }, Y) {
            let A = Wq(q);
            if (A.startsWith("\\\\") || A.startsWith("//")) return {
                result: !0
            };
            if (dzY(A) !== ".ipynb") return {
                result: !1,
                message: "File must be a Jupyter notebook (.ipynb file). For editing other file types, use the FileEdit tool.",
                errorCode: 2
            };
            if (z !== "replace" && z !== "insert" && z !== "delete") return {
                result: !1,
                message: "Edit mode must be replace, insert, or delete.",
                errorCode: 4
            };
            if (z === "insert" && !K) return {
                result: !1,
                message: "Cell type is required when using edit_mode=insert.",
                errorCode: 5
            };
            let O = Y.readFileState.get(A);
            if (!O) return {
                result: !1,
                message: "File has not been read yet. Read it first before writing to it.",
                errorCode: 9
            };
            if (mY1()) try {
                let {
                    mode: j
                } = await V8().stat(A);
                if (gf6(j)) return {
                    result: !1,
                    message: Ff6,
                    errorCode: 11
                }
            } catch (j) {
                if (!t1(j)) throw j
            }
            if (Av(A) > O.timestamp) return {
                result: !1,
                message: "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.",
                errorCode: 10
            };
            let w;
            try {
                w = iC(A).content
            } catch (j) {
                if (t1(j)) return {
                    result: !1,
                    message: "Notebook file does not exist.",
                    errorCode: 1
                };
                throw j
            }
            let $ = k5(w);
            if (!$) return {
                result: !1,
                message: "Notebook is not valid JSON.",
                errorCode: 6
            };
            if (!_) {
                if (z !== "insert") return {
                    result: !1,
                    message: "Cell ID must be specified when not inserting a new cell.",
                    errorCode: 7
                }
            } else if ($.cells.findIndex((H) => H.id === _) === -1) {
                let H = Z58(_);
                if (H !== void 0) {
                    if (!$.cells[H]) return {
                        result: !1,
                        message: `Cell with index ${H} does not exist in notebook.`,
                        errorCode: 7
                    }
                } else return {
                    result: !1,
                    message: `Cell with ID "${_}" not found in notebook.`,
                    errorCode: 8
                }
            }
            return {
                result: !0
            }
        },
        async call({
            notebook_path: q,
            new_source: K,
            cell_id: _,
            cell_type: z,
            edit_mode: Y
        }, {
            readFileState: A,
            getFileHistoryState: O,
            applyFileHistoryOp: w
        }, $, j) {
            let H = Wq(q);
            if (kO()) await M96(O, w, H, j.uuid);
            try {
                let {
                    content: J,
                    encoding: X,
                    lineEndings: M
                } = iC(H), P;
                try {
                    P = n8(J)
                } catch {
                    return {
                        data: {
                            new_source: K,
                            cell_type: z ?? "code",
                            language: "python",
                            edit_mode: "replace",
                            error: "Notebook is not valid JSON.",
                            cell_id: _,
                            notebook_path: H,
                            original_file: "",
                            updated_file: ""
                        }
                    }
                }
                let W;
                if (!_) W = 0;
                else {
                    if (W = P.cells.findIndex((k) => k.id === _), W === -1) {
                        let k = Z58(_);
                        if (k !== void 0) W = k
                    }
                    if (Y === "insert") W += 1
                }
                let D = Y;
                if (D === "replace" && W === P.cells.length) {
                    if (D = "insert", !z) z = "code"
                }
                let Z = P.metadata.language_info?.name ?? "python",
                    G = void 0;
                if (P.nbformat > 4 || P.nbformat === 4 && P.nbformat_minor >= 5) {
                    if (D === "insert") G = QzY().slice(0, 8);
                    else if (_ !== null) G = _
                }
                if (D === "delete") P.cells.splice(W, 1);
                else if (D === "insert") {
                    let k;
                    if (z === "markdown") k = {
                        cell_type: "markdown",
                        id: G,
                        source: K,
                        metadata: {}
                    };
                    else k = {
                        cell_type: "code",
                        id: G,
                        source: K,
                        metadata: {},
                        execution_count: null,
                        outputs: []
                    };
                    P.cells.splice(W, 0, k)
                } else {
                    let k = P.cells[W];
                    if (k.source = K, k.cell_type === "code") k.execution_count = null, k.outputs = [];
                    if (z && z !== k.cell_type) k.cell_type = z
                }
                let v = I6(P, null, 1);
                return S16(H, v, X, M), A.set(H, {
                    content: v,
                    timestamp: Av(H),
                    offset: void 0,
                    limit: void 0
                }), {
                    data: {
                        new_source: K,
                        cell_type: z ?? "code",
                        language: Z,
                        edit_mode: D ?? "replace",
                        cell_id: G || void 0,
                        error: "",
                        notebook_path: H,
                        original_file: J,
                        updated_file: v
                    }
                }
            } catch (J) {
                if (J instanceof Error) return {
                    data: {
                        new_source: K,
                        cell_type: z ?? "code",
                        language: "python",
                        edit_mode: "replace",
                        error: J.message,
                        cell_id: _,
                        notebook_path: H,
                        original_file: "",
                        updated_file: ""
                    }
                };
                return {
                    data: {
                        new_source: K,
                        cell_type: z ?? "code",
                        language: "python",
                        edit_mode: "replace",
                        error: "Unknown error occurred while editing notebook",
                        cell_id: _,
                        notebook_path: H,
                        original_file: "",
                        updated_file: ""
                    }
                }
            }
        }
    })
})
// @from(Ln 368421, Col 0)
function KQ8(q, K) {
    if (izY.has(q)) return !0;
    let _ = rzY.get(q);
    if (_) {
        for (let z of _)
            if (K === z || K.startsWith(z + "/")) return !0
    }
    return !1
}
// @from(Ln 368430, Col 4)
nzY
// @from(Ln 368430, Col 9)
izY
// @from(Ln 368430, Col 14)
rzY
// @from(Ln 368431, Col 4)
KK7 = L(() => {
    nzY = new Set(["platform.claude.com", "code.claude.com", "modelcontextprotocol.io", "github.com/anthropics", "agentskills.io", "docs.python.org", "en.cppreference.com", "docs.oracle.com", "learn.microsoft.com", "developer.mozilla.org", "go.dev", "pkg.go.dev", "www.php.net", "docs.swift.org", "kotlinlang.org", "ruby-doc.org", "doc.rust-lang.org", "www.typescriptlang.org", "react.dev", "angular.io", "vuejs.org", "nextjs.org", "expressjs.com", "nodejs.org", "bun.sh", "jquery.com", "getbootstrap.com", "tailwindcss.com", "d3js.org", "threejs.org", "redux.js.org", "webpack.js.org", "jestjs.io", "reactrouter.com", "docs.djangoproject.com", "flask.palletsprojects.com", "fastapi.tiangolo.com", "pandas.pydata.org", "numpy.org", "www.tensorflow.org", "pytorch.org", "scikit-learn.org", "matplotlib.org", "requests.readthedocs.io", "jupyter.org", "laravel.com", "symfony.com", "wordpress.org", "docs.spring.io", "hibernate.org", "tomcat.apache.org", "gradle.org", "maven.apache.org", "asp.net", "dotnet.microsoft.com", "nuget.org", "blazor.net", "reactnative.dev", "docs.flutter.dev", "developer.apple.com", "developer.android.com", "keras.io", "spark.apache.org", "huggingface.co", "www.kaggle.com", "www.mongodb.com", "redis.io", "www.postgresql.org", "dev.mysql.com", "www.sqlite.org", "graphql.org", "prisma.io", "docs.aws.amazon.com", "cloud.google.com", "learn.microsoft.com", "kubernetes.io", "www.docker.com", "www.terraform.io", "www.ansible.com", "vercel.com/docs", "docs.netlify.com", "devcenter.heroku.com", "cypress.io", "selenium.dev", "docs.unity.com", "docs.unrealengine.com", "git-scm.com", "nginx.org", "httpd.apache.org"]), {
        HOSTNAME_ONLY: izY,
        PATH_PREFIXES: rzY
    } = (() => {
        let q = new Set,
            K = new Map;
        for (let _ of nzY) {
            let z = _.indexOf("/");
            if (z === -1) q.add(_);
            else {
                let Y = _.slice(0, z),
                    A = _.slice(z),
                    O = K.get(Y);
                if (O) O.push(A);
                else K.set(Y, [A])
            }
        }
        return {
            HOSTNAME_ONLY: q,
            PATH_PREFIXES: K
        }
    })()
})
// @from(Ln 368456, Col 0)
function DWK({
    url: q,
    prompt: K
}, {
    verbose: _
}) {
    if (!q) return null;
    if (_) return `url: "${q}"${_&&K?`, prompt: "${K}"`:""}`;
    return q
}
// @from(Ln 368467, Col 0)
function ZWK() {
    return wu.default.createElement(_1, {
        height: 1
    }, wu.default.createElement(T, {
        dimColor: !0
    }, "Fetching…"))
}
// @from(Ln 368475, Col 0)
function fWK({
    bytes: q,
    code: K,
    codeText: _,
    result: z
}, Y, {
    verbose: A
}) {
    let O = o4(q);
    if (A) return wu.default.createElement(u, {
        flexDirection: "column"
    }, wu.default.createElement(_1, {
        height: 1
    }, wu.default.createElement(T, null, "Received ", wu.default.createElement(T, {
        bold: !0
    }, O), " (", K, " ", _, ")")), wu.default.createElement(u, {
        flexDirection: "column"
    }, wu.default.createElement(T, null, z)));
    return wu.default.createElement(_1, {
        height: 1
    }, wu.default.createElement(T, null, "Received ", wu.default.createElement(T, {
        bold: !0
    }, O), " (", K, " ", _, ")"))
}
// @from(Ln 368500, Col 0)
function _K7(q) {
    if (!q?.url) return null;
    return w5(q.url, av)
}
// @from(Ln 368504, Col 4)
wu
// @from(Ln 368505, Col 4)
GWK = L(() => {
    GK();
    g6();
    c7();
    wu = K6(P6(), 1)
})
// @from(Ln 368518, Col 0)
function zK7() {
    let q = process.env.MCP_TRUNCATION_PROMPT_OVERRIDE;
    return q ? q !== "legacy" : u8("tengu_mcp_subagent_prompt", !1)
}
// @from(Ln 368523, Col 0)
function YK7(q, K) {
    switch (q) {
        case "toolResult":
            return "Plain text";
        case "structuredContent":
            return K ? `JSON with schema: ${K}` : "JSON";
        case "contentArray":
            return K ? `JSON array with schema: ${K}` : "JSON array"
    }
}
// @from(Ln 368534, Col 0)
function vWK(q, K, _, z, Y) {
    let O = `Error: result (${Y!==void 0?`${K.toLocaleString()} characters across ${Y.count.toLocaleString()} ${Y.count===1?"line":"lines"}`:`${K.toLocaleString()} characters`}) exceeds maximum allowed tokens. Output has been saved to ${q}.
Format: ${_}
`,
        w = Math.floor(as().maxTokens * 4 * 0.8),
        $ = 8,
        j = Y !== void 0 && Y.count > 1 && Y.maxLen <= w,
        H = j ? Math.max(1, Math.floor(w / (Y.maxLen + 8))) : void 0;
    if (!zK7()) return O + `Use offset and limit parameters to read specific portions of the file, search within it for specific content, and jq to make structured queries.
REQUIREMENTS FOR SUMMARIZATION/ANALYSIS/REVIEW:
` + szY(q, z);
    let J, X, M;
    if (Y === void 0) J = `- For targeted queries (find a value, filter by field): use jq on the file directly.
`, X = `first probe the structure (e.g., jq 'type, length, keys?' ${q}), then extract slices with jq or python — Read's line-based offset/limit will not chunk this file.`, M = `${q} is ${_}; probe the structure with jq (type/length/keys), then extract and read the content in full with jq or python, then summarize and quote any key findings verbatim.`;
    else if (!j) {
        let P = w.toLocaleString();
        J = `- For targeted searches (find a string): use grep on the file directly.
`, X = `the file's lines are too long for Read's offset/limit. Slice by character range via Bash instead — e.g. python3 -c "print(open('${q}').read()[A:B])" in ~${P}-char spans until you have read 100% of it.`, M = `Slice ${q} in ~${P}-char spans via python (read()[A:B]) until you have read all ${K.toLocaleString()} characters, then summarize and quote any key findings verbatim.`
    } else J = `- For targeted searches (find a line, locate a string): use grep on the file directly.
`, X = `read ${q} in chunks of ~${H} lines using offset/limit until you have read 100% of it.`, M = `Read ${q} in chunks of ~${H} lines using offset/limit until you have read all ${Y.count.toLocaleString()} lines, then summarize and quote any key findings verbatim.`;
    return O + J + `- For analysis or summarization that requires reading the full content: ${X}
- If the ${T4} tool is available, do this inside a subagent so the full output stays out of your main context. Give it the instruction above verbatim, and be explicit about what it must return — e.g. "${M}" A vague "summarize this" may lose detail.
`
}
// @from(Ln 368559, Col 0)
function szY(q, K) {
    let _ = K ? `- If you receive truncation warnings when reading the file ("[N lines truncated]"), reduce the chunk size until you have read 100% of the content without truncation ***DO NOT PROCEED UNTIL YOU HAVE DONE THIS***. Bash output is limited to ${K.toLocaleString()} chars.
` : `- If you receive truncation warnings when reading the file, reduce the chunk size until you have read 100% of the content without truncation.
`;
    return `- You MUST read the content from the file at ${q} in sequential chunks until 100% of the content has been read.
` + _ + `- Before producing ANY summary or analysis, you MUST explicitly describe what portion of the content you have read. ***If you did not read the entire content, you MUST explicitly state this.***
`
}
// @from(Ln 368568, Col 0)
function tzY(q) {
    if (!q) return "bin";
    switch (i5(q, ";").trim().toLowerCase()) {
        case "application/pdf":
            return "pdf";
        case "application/json":
            return "json";
        case "text/csv":
            return "csv";
        case "text/plain":
            return "txt";
        case "text/html":
            return "html";
        case "text/markdown":
            return "md";
        case "application/zip":
            return "zip";
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            return "docx";
        case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
            return "xlsx";
        case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
            return "pptx";
        case "application/msword":
            return "doc";
        case "application/vnd.ms-excel":
            return "xls";
        case "audio/mpeg":
            return "mp3";
        case "audio/wav":
            return "wav";
        case "audio/ogg":
            return "ogg";
        case "video/mp4":
            return "mp4";
        case "video/webm":
            return "webm";
        case "image/png":
            return "png";
        case "image/jpeg":
            return "jpg";
        case "image/gif":
            return "gif";
        case "image/webp":
            return "webp";
        case "image/svg+xml":
            return "svg";
        default:
            return "bin"
    }
}
// @from(Ln 368620, Col 0)
function TWK(q) {
    if (!q) return !1;
    let K = i5(q, ";").trim().toLowerCase();
    if (K.startsWith("text/")) return !1;
    if (K.endsWith("+json") || K === "application/json") return !1;
    if (K.endsWith("+xml") || K === "application/xml") return !1;
    if (K.startsWith("application/javascript")) return !1;
    if (K === "application/x-www-form-urlencoded") return !1;
    return !0
}
// @from(Ln 368630, Col 0)
async function Cb6(q, K, _) {
    await tj6();
    let z = tzY(K),
        Y = azY(cK6(), `${_}.${z}`);
    try {
        await ozY(Y, q)
    } catch (A) {
        let O = r1(A);
        return j6(O), {
            error: O.message
        }
    }
    return d("tengu_binary_content_persisted", {
        mimeType: K ?? "unknown",
        sizeBytes: q.length,
        ext: z
    }), {
        filepath: Y,
        size: q.length,
        ext: z
    }
}
// @from(Ln 368653, Col 0)
function _Q8(q, K, _, z) {
    return `${z}Binary content (${K||"unknown type"}, ${o4(_)}) saved to ${q}`
}
// @from(Ln 368656, Col 4)
zQ8 = L(() => {
    B1();
    C8();
    sY();
    HI8();
    m8();
    c7();
    U8();
    ND()
})
// @from(Ln 368666, Col 4)
bb6 = p((rc2, VWK) => {
    VWK.exports = ZM6;
    ZM6.CAPTURING_PHASE = 1;
    ZM6.AT_TARGET = 2;
    ZM6.BUBBLING_PHASE = 3;

    function ZM6(q, K) {
        if (this.type = "", this.target = null, this.currentTarget = null, this.eventPhase = ZM6.AT_TARGET, this.bubbles = !1, this.cancelable = !1, this.isTrusted = !1, this.defaultPrevented = !1, this.timeStamp = Date.now(), this._propagationStopped = !1, this._immediatePropagationStopped = !1, this._initialized = !0, this._dispatching = !1, q) this.type = q;
        if (K)
            for (var _ in K) this[_] = K[_]
    }
    ZM6.prototype = Object.create(Object.prototype, {
        constructor: {
            value: ZM6
        },
        stopPropagation: {
            value: function() {
                this._propagationStopped = !0
            }
        },
        stopImmediatePropagation: {
            value: function() {
                this._propagationStopped = !0, this._immediatePropagationStopped = !0
            }
        },
        preventDefault: {
            value: function() {
                if (this.cancelable) this.defaultPrevented = !0
            }
        },
        initEvent: {
            value: function(K, _, z) {
                if (this._initialized = !0, this._dispatching) return;
                this._propagationStopped = !1, this._immediatePropagationStopped = !1, this.defaultPrevented = !1, this.isTrusted = !1, this.target = null, this.type = K, this.bubbles = _, this.cancelable = z
            }
        }
    })
})
// @from(Ln 368704, Col 4)
OK7 = p((oc2, NWK) => {
    var kWK = bb6();
    NWK.exports = AK7;

    function AK7() {
        kWK.call(this), this.view = null, this.detail = 0
    }
    AK7.prototype = Object.create(kWK.prototype, {
        constructor: {
            value: AK7
        },
        initUIEvent: {
            value: function(q, K, _, z, Y) {
                this.initEvent(q, K, _), this.view = z, this.detail = Y
            }
        }
    })
})
// @from(Ln 368722, Col 4)
$K7 = p((ac2, yWK) => {
    var EWK = OK7();
    yWK.exports = wK7;

    function wK7() {
        EWK.call(this), this.screenX = this.screenY = this.clientX = this.clientY = 0, this.ctrlKey = this.altKey = this.shiftKey = this.metaKey = !1, this.button = 0, this.buttons = 1, this.relatedTarget = null
    }
    wK7.prototype = Object.create(EWK.prototype, {
        constructor: {
            value: wK7
        },
        initMouseEvent: {
            value: function(q, K, _, z, Y, A, O, w, $, j, H, J, X, M, P) {
                switch (this.initEvent(q, K, _, z, Y), this.screenX = A, this.screenY = O, this.clientX = w, this.clientY = $, this.ctrlKey = j, this.altKey = H, this.shiftKey = J, this.metaKey = X, this.button = M, M) {
                    case 0:
                        this.buttons = 1;
                        break;
                    case 1:
                        this.buttons = 4;
                        break;
                    case 2:
                        this.buttons = 2;
                        break;
                    default:
                        this.buttons = 0;
                        break
                }
                this.relatedTarget = P
            }
        },
        getModifierState: {
            value: function(q) {
                switch (q) {
                    case "Alt":
                        return this.altKey;
                    case "Control":
                        return this.ctrlKey;
                    case "Shift":
                        return this.shiftKey;
                    case "Meta":
                        return this.metaKey;
                    default:
                        return !1
                }
            }
        }
    })
})
// @from(Ln 368770, Col 4)
OQ8 = p((sc2, hWK) => {
    hWK.exports = AQ8;
    var ezY = 1,
        qYY = 3,
        KYY = 4,
        _YY = 5,
        zYY = 7,
        YYY = 8,
        AYY = 9,
        OYY = 11,
        wYY = 12,
        $YY = 13,
        jYY = 14,
        HYY = 15,
        JYY = 17,
        XYY = 18,
        MYY = 19,
        PYY = 20,
        WYY = 21,
        DYY = 22,
        ZYY = 23,
        fYY = 24,
        GYY = 25,
        vYY = [null, "INDEX_SIZE_ERR", null, "HIERARCHY_REQUEST_ERR", "WRONG_DOCUMENT_ERR", "INVALID_CHARACTER_ERR", null, "NO_MODIFICATION_ALLOWED_ERR", "NOT_FOUND_ERR", "NOT_SUPPORTED_ERR", "INUSE_ATTRIBUTE_ERR", "INVALID_STATE_ERR", "SYNTAX_ERR", "INVALID_MODIFICATION_ERR", "NAMESPACE_ERR", "INVALID_ACCESS_ERR", null, "TYPE_MISMATCH_ERR", "SECURITY_ERR", "NETWORK_ERR", "ABORT_ERR", "URL_MISMATCH_ERR", "QUOTA_EXCEEDED_ERR", "TIMEOUT_ERR", "INVALID_NODE_TYPE_ERR", "DATA_CLONE_ERR"],
        TYY = [null, "INDEX_SIZE_ERR (1): the index is not in the allowed range", null, "HIERARCHY_REQUEST_ERR (3): the operation would yield an incorrect nodes model", "WRONG_DOCUMENT_ERR (4): the object is in the wrong Document, a call to importNode is required", "INVALID_CHARACTER_ERR (5): the string contains invalid characters", null, "NO_MODIFICATION_ALLOWED_ERR (7): the object can not be modified", "NOT_FOUND_ERR (8): the object can not be found here", "NOT_SUPPORTED_ERR (9): this operation is not supported", "INUSE_ATTRIBUTE_ERR (10): setAttributeNode called on owned Attribute", "INVALID_STATE_ERR (11): the object is in an invalid state", "SYNTAX_ERR (12): the string did not match the expected pattern", "INVALID_MODIFICATION_ERR (13): the object can not be modified in this way", "NAMESPACE_ERR (14): the operation is not allowed by Namespaces in XML", "INVALID_ACCESS_ERR (15): the object does not support the operation or argument", null, "TYPE_MISMATCH_ERR (17): the type of the object does not match the expected type", "SECURITY_ERR (18): the operation is insecure", "NETWORK_ERR (19): a network error occurred", "ABORT_ERR (20): the user aborted an operation", "URL_MISMATCH_ERR (21): the given URL does not match another URL", "QUOTA_EXCEEDED_ERR (22): the quota has been exceeded", "TIMEOUT_ERR (23): a timeout occurred", "INVALID_NODE_TYPE_ERR (24): the supplied node is invalid or has an invalid ancestor for this operation", "DATA_CLONE_ERR (25): the object can not be cloned."],
        LWK = {
            INDEX_SIZE_ERR: ezY,
            DOMSTRING_SIZE_ERR: 2,
            HIERARCHY_REQUEST_ERR: qYY,
            WRONG_DOCUMENT_ERR: KYY,
            INVALID_CHARACTER_ERR: _YY,
            NO_DATA_ALLOWED_ERR: 6,
            NO_MODIFICATION_ALLOWED_ERR: zYY,
            NOT_FOUND_ERR: YYY,
            NOT_SUPPORTED_ERR: AYY,
            INUSE_ATTRIBUTE_ERR: 10,
            INVALID_STATE_ERR: OYY,
            SYNTAX_ERR: wYY,
            INVALID_MODIFICATION_ERR: $YY,
            NAMESPACE_ERR: jYY,
            INVALID_ACCESS_ERR: HYY,
            VALIDATION_ERR: 16,
            TYPE_MISMATCH_ERR: JYY,
            SECURITY_ERR: XYY,
            NETWORK_ERR: MYY,
            ABORT_ERR: PYY,
            URL_MISMATCH_ERR: WYY,
            QUOTA_EXCEEDED_ERR: DYY,
            TIMEOUT_ERR: ZYY,
            INVALID_NODE_TYPE_ERR: fYY,
            DATA_CLONE_ERR: GYY
        };

    function AQ8(q) {
        Error.call(this), Error.captureStackTrace(this, this.constructor), this.code = q, this.message = TYY[q], this.name = vYY[q]
    }
    AQ8.prototype.__proto__ = Error.prototype;
    for (f58 in LWK) YQ8 = {
        value: LWK[f58]
    }, Object.defineProperty(AQ8, f58, YQ8), Object.defineProperty(AQ8.prototype, f58, YQ8);
    var YQ8, f58
})
// @from(Ln 368832, Col 4)
wQ8 = p((VYY) => {
    VYY.isApiWritable = !globalThis.__domino_frozen__
})
// @from(Ln 368835, Col 4)
CX = p((EYY) => {
    var SX = OQ8(),
        IM = SX,
        NYY = wQ8().isApiWritable;
    EYY.NAMESPACE = {
        HTML: "http://www.w3.org/1999/xhtml",
        XML: "http://www.w3.org/XML/1998/namespace",
        XMLNS: "http://www.w3.org/2000/xmlns/",
        MATHML: "http://www.w3.org/1998/Math/MathML",
        SVG: "http://www.w3.org/2000/svg",
        XLINK: "http://www.w3.org/1999/xlink"
    };
    EYY.IndexSizeError = function() {
        throw new SX(IM.INDEX_SIZE_ERR)
    };
    EYY.HierarchyRequestError = function() {
        throw new SX(IM.HIERARCHY_REQUEST_ERR)
    };
    EYY.WrongDocumentError = function() {
        throw new SX(IM.WRONG_DOCUMENT_ERR)
    };
    EYY.InvalidCharacterError = function() {
        throw new SX(IM.INVALID_CHARACTER_ERR)
    };
    EYY.NoModificationAllowedError = function() {
        throw new SX(IM.NO_MODIFICATION_ALLOWED_ERR)
    };
    EYY.NotFoundError = function() {
        throw new SX(IM.NOT_FOUND_ERR)
    };
    EYY.NotSupportedError = function() {
        throw new SX(IM.NOT_SUPPORTED_ERR)
    };
    EYY.InvalidStateError = function() {
        throw new SX(IM.INVALID_STATE_ERR)
    };
    EYY.SyntaxError = function() {
        throw new SX(IM.SYNTAX_ERR)
    };
    EYY.InvalidModificationError = function() {
        throw new SX(IM.INVALID_MODIFICATION_ERR)
    };
    EYY.NamespaceError = function() {
        throw new SX(IM.NAMESPACE_ERR)
    };
    EYY.InvalidAccessError = function() {
        throw new SX(IM.INVALID_ACCESS_ERR)
    };
    EYY.TypeMismatchError = function() {
        throw new SX(IM.TYPE_MISMATCH_ERR)
    };
    EYY.SecurityError = function() {
        throw new SX(IM.SECURITY_ERR)
    };
    EYY.NetworkError = function() {
        throw new SX(IM.NETWORK_ERR)
    };
    EYY.AbortError = function() {
        throw new SX(IM.ABORT_ERR)
    };
    EYY.UrlMismatchError = function() {
        throw new SX(IM.URL_MISMATCH_ERR)
    };
    EYY.QuotaExceededError = function() {
        throw new SX(IM.QUOTA_EXCEEDED_ERR)
    };
    EYY.TimeoutError = function() {
        throw new SX(IM.TIMEOUT_ERR)
    };
    EYY.InvalidNodeTypeError = function() {
        throw new SX(IM.INVALID_NODE_TYPE_ERR)
    };
    EYY.DataCloneError = function() {
        throw new SX(IM.DATA_CLONE_ERR)
    };
    EYY.nyi = function() {
        throw Error("NotYetImplemented")
    };
    EYY.shouldOverride = function() {
        throw Error("Abstract function; should be overriding in subclass.")
    };
    EYY.assert = function(q, K) {
        if (!q) throw Error("Assertion failed: " + (K || "") + `
` + Error().stack)
    };
    EYY.expose = function(q, K) {
        for (var _ in q) Object.defineProperty(K.prototype, _, {
            value: q[_],
            writable: NYY
        })
    };
    EYY.merge = function(q, K) {
        for (var _ in K) q[_] = K[_]
    };
    EYY.documentOrder = function(q, K) {
        return 3 - (q.compareDocumentPosition(K) & 6)
    };
    EYY.toASCIILowerCase = function(q) {
        return q.replace(/[A-Z]+/g, function(K) {
            return K.toLowerCase()
        })
    };
    EYY.toASCIIUpperCase = function(q) {
        return q.replace(/[a-z]+/g, function(K) {
            return K.toUpperCase()
        })
    }
})
// @from(Ln 368943, Col 4)
jK7 = p((ql2, SWK) => {
    var fM6 = bb6(),
        _AY = $K7(),
        zAY = CX();
    SWK.exports = RWK;

    function RWK() {}
    RWK.prototype = {
        addEventListener: function(K, _, z) {
            if (!_) return;
            if (z === void 0) z = !1;
            if (!this._listeners) this._listeners = Object.create(null);
            if (!this._listeners[K]) this._listeners[K] = [];
            var Y = this._listeners[K];
            for (var A = 0, O = Y.length; A < O; A++) {
                var w = Y[A];
                if (w.listener === _ && w.capture === z) return
            }
            var $ = {
                listener: _,
                capture: z
            };
            if (typeof _ === "function") $.f = _;
            Y.push($)
        },
        removeEventListener: function(K, _, z) {
            if (z === void 0) z = !1;
            if (this._listeners) {
                var Y = this._listeners[K];
                if (Y)
                    for (var A = 0, O = Y.length; A < O; A++) {
                        var w = Y[A];
                        if (w.listener === _ && w.capture === z) {
                            if (Y.length === 1) this._listeners[K] = void 0;
                            else Y.splice(A, 1);
                            return
                        }
                    }
            }
        },
        dispatchEvent: function(K) {
            return this._dispatchEvent(K, !1)
        },
        _dispatchEvent: function(K, _) {
            if (typeof _ !== "boolean") _ = !1;

            function z(j, H) {
                var {
                    type: J,
                    eventPhase: X
                } = H;
                if (H.currentTarget = j, X !== fM6.CAPTURING_PHASE && j._handlers && j._handlers[J]) {
                    var M = j._handlers[J],
                        P;
                    if (typeof M === "function") P = M.call(H.currentTarget, H);
                    else {
                        var W = M.handleEvent;
                        if (typeof W !== "function") throw TypeError("handleEvent property of event handler object isnot a function.");
                        P = W.call(M, H)
                    }
                    switch (H.type) {
                        case "mouseover":
                            if (P === !0) H.preventDefault();
                            break;
                        case "beforeunload":
                        default:
                            if (P === !1) H.preventDefault();
                            break
                    }
                }
                var D = j._listeners && j._listeners[J];
                if (!D) return;
                D = D.slice();
                for (var Z = 0, G = D.length; Z < G; Z++) {
                    if (H._immediatePropagationStopped) return;
                    var f = D[Z];
                    if (X === fM6.CAPTURING_PHASE && !f.capture || X === fM6.BUBBLING_PHASE && f.capture) continue;
                    if (f.f) f.f.call(H.currentTarget, H);
                    else {
                        var v = f.listener.handleEvent;
                        if (typeof v !== "function") throw TypeError("handleEvent property of event listener object is not a function.");
                        v.call(f.listener, H)
                    }
                }
            }
            if (!K._initialized || K._dispatching) zAY.InvalidStateError();
            K.isTrusted = _, K._dispatching = !0, K.target = this;
            var Y = [];
            for (var A = this.parentNode; A; A = A.parentNode) Y.push(A);
            K.eventPhase = fM6.CAPTURING_PHASE;
            for (var O = Y.length - 1; O >= 0; O--)
                if (z(Y[O], K), K._propagationStopped) break;
            if (!K._propagationStopped) K.eventPhase = fM6.AT_TARGET, z(this, K);
            if (K.bubbles && !K._propagationStopped) {
                K.eventPhase = fM6.BUBBLING_PHASE;
                for (var w = 0, $ = Y.length; w < $; w++)
                    if (z(Y[w], K), K._propagationStopped) break
            }
            if (K._dispatching = !1, K.eventPhase = fM6.AT_TARGET, K.currentTarget = null, _ && !K.defaultPrevented && K instanceof _AY) switch (K.type) {
                case "mousedown":
                    this._armed = {
                        x: K.clientX,
                        y: K.clientY,
                        t: K.timeStamp
                    };
                    break;
                case "mouseout":
                case "mouseover":
                    this._armed = null;
                    break;
                case "mouseup":
                    if (this._isClick(K)) this._doClick(K);
                    this._armed = null;
                    break
            }
            return !K.defaultPrevented
        },
        _isClick: function(q) {
            return this._armed !== null && q.type === "mouseup" && q.isTrusted && q.button === 0 && q.timeStamp - this._armed.t < 1000 && Math.abs(q.clientX - this._armed.x) < 10 && Math.abs(q.clientY - this._armed.Y) < 10
        },
        _doClick: function(q) {
            if (this._click_in_progress) return;
            this._click_in_progress = !0;
            var K = this;
            while (K && !K._post_click_activation_steps) K = K.parentNode;
            if (K && K._pre_click_activation_steps) K._pre_click_activation_steps();
            var _ = this.ownerDocument.createEvent("MouseEvent");
            _.initMouseEvent("click", !0, !0, this.ownerDocument.defaultView, 1, q.screenX, q.screenY, q.clientX, q.clientY, q.ctrlKey, q.altKey, q.shiftKey, q.metaKey, q.button, null);
            var z = this._dispatchEvent(_, !0);
            if (K) {
                if (z) {
                    if (K._post_click_activation_steps) K._post_click_activation_steps(_)
                } else if (K._cancelled_activation_steps) K._cancelled_activation_steps()
            }
        },
        _setEventHandler: function(K, _) {
            if (!this._handlers) this._handlers = Object.create(null);
            this._handlers[K] = _
        },
        _getEventHandler: function(K) {
            return this._handlers && this._handlers[K] || null
        }
    }
})
// @from(Ln 369087, Col 4)
HK7 = p((Kl2, CWK) => {
    var je = CX(),
        $u = CWK.exports = {
            valid: function(q) {
                return je.assert(q, "list falsy"), je.assert(q._previousSibling, "previous falsy"), je.assert(q._nextSibling, "next falsy"), !0
            },
            insertBefore: function(q, K) {
                je.assert($u.valid(q) && $u.valid(K));
                var _ = q,
                    z = q._previousSibling,
                    Y = K,
                    A = K._previousSibling;
                _._previousSibling = A, z._nextSibling = Y, A._nextSibling = _, Y._previousSibling = z, je.assert($u.valid(q) && $u.valid(K))
            },
            replace: function(q, K) {
                if (je.assert($u.valid(q) && (K === null || $u.valid(K))), K !== null) $u.insertBefore(K, q);
                $u.remove(q), je.assert($u.valid(q) && (K === null || $u.valid(K)))
            },
            remove: function(q) {
                je.assert($u.valid(q));
                var K = q._previousSibling;
                if (K === q) return;
                var _ = q._nextSibling;
                K._nextSibling = _, _._previousSibling = K, q._previousSibling = q._nextSibling = q, je.assert($u.valid(q))
            }
        }
})
// @from(Ln 369114, Col 4)
JK7 = p((_l2, FWK) => {
    FWK.exports = {
        serializeOne: HAY,
        ɵescapeMatchingClosingTag: mWK,
        ɵescapeClosingCommentTag: BWK,
        ɵescapeProcessingInstructionContent: pWK
    };
    var uWK = CX(),
        GM6 = uWK.NAMESPACE,
        bWK = {
            STYLE: !0,
            SCRIPT: !0,
            XMP: !0,
            IFRAME: !0,
            NOEMBED: !0,
            NOFRAMES: !0,
            PLAINTEXT: !0
        },
        YAY = {
            area: !0,
            base: !0,
            basefont: !0,
            bgsound: !0,
            br: !0,
            col: !0,
            embed: !0,
            frame: !0,
            hr: !0,
            img: !0,
            input: !0,
            keygen: !0,
            link: !0,
            meta: !0,
            param: !0,
            source: !0,
            track: !0,
            wbr: !0
        },
        AAY = {},
        IWK = /[&<>\u00A0]/g,
        xWK = /[&"<>\u00A0]/g;

    function OAY(q) {
        if (!IWK.test(q)) return q;
        return q.replace(IWK, (K) => {
            switch (K) {
                case "&":
                    return "&amp;";
                case "<":
                    return "&lt;";
                case ">":
                    return "&gt;";
                case " ":
                    return "&nbsp;"
            }
        })
    }

    function wAY(q) {
        if (!xWK.test(q)) return q;
        return q.replace(xWK, (K) => {
            switch (K) {
                case "<":
                    return "&lt;";
                case ">":
                    return "&gt;";
                case "&":
                    return "&amp;";
                case '"':
                    return "&quot;";
                case " ":
                    return "&nbsp;"
            }
        })
    }

    function $AY(q) {
        var K = q.namespaceURI;
        if (!K) return q.localName;
        if (K === GM6.XML) return "xml:" + q.localName;
        if (K === GM6.XLINK) return "xlink:" + q.localName;
        if (K === GM6.XMLNS)
            if (q.localName === "xmlns") return "xmlns";
            else return "xmlns:" + q.localName;
        return q.name
    }

    function mWK(q, K) {
        let _ = "</" + K;
        if (!q.toLowerCase().includes(_)) return q;
        let z = [...q],
            Y = q.matchAll(new RegExp(_, "ig"));
        for (let A of Y) z[A.index] = "&lt;";
        return z.join("")
    }
    var jAY = /--!?>/;

    function BWK(q) {
        if (!jAY.test(q)) return q;
        return q.replace(/(--\!?)>/g, "$1&gt;")
    }

    function pWK(q) {
        return q.includes(">") ? q.replaceAll(">", "&gt;") : q
    }

    function HAY(q, K) {
        var _ = "";
        switch (q.nodeType) {
            case 1:
                var z = q.namespaceURI,
                    Y = z === GM6.HTML,
                    A = Y || z === GM6.SVG || z === GM6.MATHML ? q.localName : q.tagName;
                _ += "<" + A;
                for (var O = 0, w = q._numattrs; O < w; O++) {
                    var $ = q._attr(O);
                    if (_ += " " + $AY($), $.value !== void 0) _ += '="' + wAY($.value) + '"'
                }
                if (_ += ">", !(Y && YAY[A])) {
                    var j = q.serialize();
                    if (bWK[A.toUpperCase()]) j = mWK(j, A);
                    if (Y && AAY[A] && j.charAt(0) === `
`) _ += `
`;
                    _ += j, _ += "</" + A + ">"
                }
                break;
            case 3:
            case 4:
                var H;
                if (K.nodeType === 1 && K.namespaceURI === GM6.HTML) H = K.tagName;
                else H = "";
                if (bWK[H] || H === "NOSCRIPT" && K.ownerDocument._scripting_enabled) _ += q.data;
                else _ += OAY(q.data);
                break;
            case 8:
                _ += "<!--" + BWK(q.data) + "-->";
                break;
            case 7:
                let J = pWK(q.data);
                _ += "<?" + q.target + " " + J + "?>";
                break;
            case 10:
                _ += "<!DOCTYPE " + q.name, _ += ">";
                break;
            default:
                uWK.InvalidStateError()
        }
        return _
    }
})
// @from(Ln 369265, Col 4)
HG = p((zl2, lWK) => {
    lWK.exports = RH;
    var cWK = jK7(),
        $Q8 = HK7(),
        gWK = JK7(),
        yO = CX();

    function RH() {
        cWK.call(this), this.parentNode = null, this._nextSibling = this._previousSibling = this, this._index = void 0
    }
    var KL = RH.ELEMENT_NODE = 1,
        XK7 = RH.ATTRIBUTE_NODE = 2,
        jQ8 = RH.TEXT_NODE = 3,
        JAY = RH.CDATA_SECTION_NODE = 4,
        XAY = RH.ENTITY_REFERENCE_NODE = 5,
        MK7 = RH.ENTITY_NODE = 6,
        UWK = RH.PROCESSING_INSTRUCTION_NODE = 7,
        QWK = RH.COMMENT_NODE = 8,
        G58 = RH.DOCUMENT_NODE = 9,
        ju = RH.DOCUMENT_TYPE_NODE = 10,
        n96 = RH.DOCUMENT_FRAGMENT_NODE = 11,
        PK7 = RH.NOTATION_NODE = 12,
        WK7 = RH.DOCUMENT_POSITION_DISCONNECTED = 1,
        DK7 = RH.DOCUMENT_POSITION_PRECEDING = 2,
        ZK7 = RH.DOCUMENT_POSITION_FOLLOWING = 4,
        dWK = RH.DOCUMENT_POSITION_CONTAINS = 8,
        fK7 = RH.DOCUMENT_POSITION_CONTAINED_BY = 16,
        GK7 = RH.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32;
    RH.prototype = Object.create(cWK.prototype, {
        baseURI: {
            get: yO.nyi
        },
        parentElement: {
            get: function() {
                return this.parentNode && this.parentNode.nodeType === KL ? this.parentNode : null
            }
        },
        hasChildNodes: {
            value: yO.shouldOverride
        },
        firstChild: {
            get: yO.shouldOverride
        },
        lastChild: {
            get: yO.shouldOverride
        },
        isConnected: {
            get: function() {
                let q = this;
                while (q != null) {
                    if (q.nodeType === RH.DOCUMENT_NODE) return !0;
                    if (q = q.parentNode, q != null && q.nodeType === RH.DOCUMENT_FRAGMENT_NODE) q = q.host
                }
                return !1
            }
        },
        previousSibling: {
            get: function() {
                var q = this.parentNode;
                if (!q) return null;
                if (this === q.firstChild) return null;
                return this._previousSibling
            }
        },
        nextSibling: {
            get: function() {
                var q = this.parentNode,
                    K = this._nextSibling;
                if (!q) return null;
                if (K === q.firstChild) return null;
                return K
            }
        },
        textContent: {
            get: function() {
                return null
            },
            set: function(q) {}
        },
        innerText: {
            get: function() {
                return null
            },
            set: function(q) {}
        },
        _countChildrenOfType: {
            value: function(q) {
                var K = 0;
                for (var _ = this.firstChild; _ !== null; _ = _.nextSibling)
                    if (_.nodeType === q) K++;
                return K
            }
        },
        _ensureInsertValid: {
            value: function(K, _, z) {
                var Y = this,
                    A, O;
                if (!K.nodeType) throw TypeError("not a node");
                switch (Y.nodeType) {
                    case G58:
                    case n96:
                    case KL:
                        break;
                    default:
                        yO.HierarchyRequestError()
                }
                if (K.isAncestor(Y)) yO.HierarchyRequestError();
                if (_ !== null || !z) {
                    if (_.parentNode !== Y) yO.NotFoundError()
                }
                switch (K.nodeType) {
                    case n96:
                    case ju:
                    case KL:
                    case jQ8:
                    case UWK:
                    case QWK:
                        break;
                    default:
                        yO.HierarchyRequestError()
                }
                if (Y.nodeType === G58) switch (K.nodeType) {
                    case jQ8:
                        yO.HierarchyRequestError();
                        break;
                    case n96:
                        if (K._countChildrenOfType(jQ8) > 0) yO.HierarchyRequestError();
                        switch (K._countChildrenOfType(KL)) {
                            case 0:
                                break;
                            case 1:
                                if (_ !== null) {
                                    if (z && _.nodeType === ju) yO.HierarchyRequestError();
                                    for (O = _.nextSibling; O !== null; O = O.nextSibling)
                                        if (O.nodeType === ju) yO.HierarchyRequestError()
                                }
                                if (A = Y._countChildrenOfType(KL), z) {
                                    if (A > 0) yO.HierarchyRequestError()
                                } else if (A > 1 || A === 1 && _.nodeType !== KL) yO.HierarchyRequestError();
                                break;
                            default:
                                yO.HierarchyRequestError()
                        }
                        break;
                    case KL:
                        if (_ !== null) {
                            if (z && _.nodeType === ju) yO.HierarchyRequestError();
                            for (O = _.nextSibling; O !== null; O = O.nextSibling)
                                if (O.nodeType === ju) yO.HierarchyRequestError()
                        }
                        if (A = Y._countChildrenOfType(KL), z) {
                            if (A > 0) yO.HierarchyRequestError()
                        } else if (A > 1 || A === 1 && _.nodeType !== KL) yO.HierarchyRequestError();
                        break;
                    case ju:
                        if (_ === null) {
                            if (Y._countChildrenOfType(KL)) yO.HierarchyRequestError()
                        } else
                            for (O = Y.firstChild; O !== null; O = O.nextSibling) {
                                if (O === _) break;
                                if (O.nodeType === KL) yO.HierarchyRequestError()
                            }
                        if (A = Y._countChildrenOfType(ju), z) {
                            if (A > 0) yO.HierarchyRequestError()
                        } else if (A > 1 || A === 1 && _.nodeType !== ju) yO.HierarchyRequestError();
                        break
                } else if (K.nodeType === ju) yO.HierarchyRequestError()
            }
        },
        insertBefore: {
            value: function(K, _) {
                var z = this;
                z._ensureInsertValid(K, _, !0);
                var Y = _;
                if (Y === K) Y = K.nextSibling;
                return z.doc.adoptNode(K), K._insertOrReplace(z, Y, !1), K
            }
        },
        appendChild: {
            value: function(q) {
                return this.insertBefore(q, null)
            }
        },
        _appendChild: {
            value: function(q) {
                q._insertOrReplace(this, null, !1)
            }
        },
        removeChild: {
            value: function(K) {
                var _ = this;
                if (!K.nodeType) throw TypeError("not a node");
                if (K.parentNode !== _) yO.NotFoundError();
                return K.remove(), K
            }
        },
        replaceChild: {
            value: function(K, _) {
                var z = this;
                if (z._ensureInsertValid(K, _, !1), K.doc !== z.doc) z.doc.adoptNode(K);
                return K._insertOrReplace(z, _, !0), _
            }
        },
        contains: {
            value: function(K) {
                if (K === null) return !1;
                if (this === K) return !0;
                return (this.compareDocumentPosition(K) & fK7) !== 0
            }
        },
        compareDocumentPosition: {
            value: function(K) {
                if (this === K) return 0;
                if (this.doc !== K.doc || this.rooted !== K.rooted) return WK7 + GK7;
                var _ = [],
                    z = [];
                for (var Y = this; Y !== null; Y = Y.parentNode) _.push(Y);
                for (Y = K; Y !== null; Y = Y.parentNode) z.push(Y);
                if (_.reverse(), z.reverse(), _[0] !== z[0]) return WK7 + GK7;
                Y = Math.min(_.length, z.length);
                for (var A = 1; A < Y; A++)
                    if (_[A] !== z[A])
                        if (_[A].index < z[A].index) return ZK7;
                        else return DK7;
                if (_.length < z.length) return ZK7 + fK7;
                else return DK7 + dWK
            }
        },
        isSameNode: {
            value: function(K) {
                return this === K
            }
        },
        isEqualNode: {
            value: function(K) {
                if (!K) return !1;
                if (K.nodeType !== this.nodeType) return !1;
                if (!this.isEqual(K)) return !1;
                for (var _ = this.firstChild, z = K.firstChild; _ && z; _ = _.nextSibling, z = z.nextSibling)
                    if (!_.isEqualNode(z)) return !1;
                return _ === null && z === null
            }
        },
        cloneNode: {
            value: function(q) {
                var K = this.clone();
                if (q)
                    for (var _ = this.firstChild; _ !== null; _ = _.nextSibling) K._appendChild(_.cloneNode(!0));
                return K
            }
        },
        lookupPrefix: {
            value: function(K) {
                var _;
                if (K === "" || K === null || K === void 0) return null;
                switch (this.nodeType) {
                    case KL:
                        return this._lookupNamespacePrefix(K, this);
                    case G58:
                        return _ = this.documentElement, _ ? _.lookupPrefix(K) : null;
                    case MK7:
                    case PK7:
                    case n96:
                    case ju:
                        return null;
                    case XK7:
                        return _ = this.ownerElement, _ ? _.lookupPrefix(K) : null;
                    default:
                        return _ = this.parentElement, _ ? _.lookupPrefix(K) : null
                }
            }
        },
        lookupNamespaceURI: {
            value: function(K) {
                if (K === "" || K === void 0) K = null;
                var _;
                switch (this.nodeType) {
                    case KL:
                        return yO.shouldOverride();
                    case G58:
                        return _ = this.documentElement, _ ? _.lookupNamespaceURI(K) : null;
                    case MK7:
                    case PK7:
                    case ju:
                    case n96:
                        return null;
                    case XK7:
                        return _ = this.ownerElement, _ ? _.lookupNamespaceURI(K) : null;
                    default:
                        return _ = this.parentElement, _ ? _.lookupNamespaceURI(K) : null
                }
            }
        },
        isDefaultNamespace: {
            value: function(K) {
                if (K === "" || K === void 0) K = null;
                var _ = this.lookupNamespaceURI(null);
                return _ === K
            }
        },
        index: {
            get: function() {
                var q = this.parentNode;
                if (this === q.firstChild) return 0;
                var K = q.childNodes;
                if (this._index === void 0 || K[this._index] !== this) {
                    for (var _ = 0; _ < K.length; _++) K[_]._index = _;
                    yO.assert(K[this._index] === this)
                }
                return this._index
            }
        },
        isAncestor: {
            value: function(q) {
                if (this.doc !== q.doc) return !1;
                if (this.rooted !== q.rooted) return !1;
                for (var K = q; K; K = K.parentNode)
                    if (K === this) return !0;
                return !1
            }
        },
        ensureSameDoc: {
            value: function(q) {
                if (q.ownerDocument === null) q.ownerDocument = this.doc;
                else if (q.ownerDocument !== this.doc) yO.WrongDocumentError()
            }
        },
        removeChildren: {
            value: yO.shouldOverride
        },
        _insertOrReplace: {
            value: function(K, _, z) {
                var Y = this,
                    A, O;
                if (Y.nodeType === n96 && Y.rooted) yO.HierarchyRequestError();
                if (K._childNodes) {
                    if (A = _ === null ? K._childNodes.length : _.index, Y.parentNode === K) {
                        var w = Y.index;
                        if (w < A) A--
                    }
                }
                if (z) {
                    if (_.rooted) _.doc.mutateRemove(_);
                    _.parentNode = null
                }
                var $ = _;
                if ($ === null) $ = K.firstChild;
                var j = Y.rooted && K.rooted;
                if (Y.nodeType === n96) {
                    var H = [0, z ? 1 : 0],
                        J;
                    for (var X = Y.firstChild; X !== null; X = J) J = X.nextSibling, H.push(X), X.parentNode = K;
                    var M = H.length;
                    if (z) $Q8.replace($, M > 2 ? H[2] : null);
                    else if (M > 2 && $ !== null) $Q8.insertBefore(H[2], $);
                    if (K._childNodes) {
                        H[0] = _ === null ? K._childNodes.length : _._index, K._childNodes.splice.apply(K._childNodes, H);
                        for (O = 2; O < M; O++) H[O]._index = H[0] + (O - 2)
                    } else if (K._firstChild === _) {
                        if (M > 2) K._firstChild = H[2];
                        else if (z) K._firstChild = null
                    }
                    if (Y._childNodes) Y._childNodes.length = 0;
                    else Y._firstChild = null;
                    if (K.rooted) {
                        K.modify();
                        for (O = 2; O < M; O++) K.doc.mutateInsert(H[O])
                    }
                } else {
                    if (_ === Y) return;
                    if (j) Y._remove();
                    else if (Y.parentNode) Y.remove();
                    if (Y.parentNode = K, z) {
                        if ($Q8.replace($, Y), K._childNodes) Y._index = A, K._childNodes[A] = Y;
                        else if (K._firstChild === _) K._firstChild = Y
                    } else {
                        if ($ !== null) $Q8.insertBefore(Y, $);
                        if (K._childNodes) Y._index = A, K._childNodes.splice(A, 0, Y);
                        else if (K._firstChild === _) K._firstChild = Y
                    }
                    if (j) K.modify(), K.doc.mutateMove(Y);
                    else if (K.rooted) K.modify(), K.doc.mutateInsert(Y)
                }
            }
        },
        lastModTime: {
            get: function() {
                if (!this._lastModTime) this._lastModTime = this.doc.modclock;
                return this._lastModTime
            }
        },
        modify: {
            value: function() {
                if (this.doc.modclock) {
                    var q = ++this.doc.modclock;
                    for (var K = this; K; K = K.parentElement)
                        if (K._lastModTime) K._lastModTime = q
                }
            }
        },
        doc: {
            get: function() {
                return this.ownerDocument || this
            }
        },
        rooted: {
            get: function() {
                return !!this._nid
            }
        },
        normalize: {
            value: function() {
                var q;
                for (var K = this.firstChild; K !== null; K = q) {
                    if (q = K.nextSibling, K.normalize) K.normalize();
                    if (K.nodeType !== RH.TEXT_NODE) continue;
                    if (K.nodeValue === "") {
                        this.removeChild(K);
                        continue
                    }
                    var _ = K.previousSibling;
                    if (_ === null) continue;
                    else if (_.nodeType === RH.TEXT_NODE) _.appendData(K.nodeValue), this.removeChild(K)
                }
            }
        },
        serialize: {
            value: function() {
                if (this._innerHTML) return this._innerHTML;
                var q = "";
                for (var K = this.firstChild; K !== null; K = K.nextSibling) q += gWK.serializeOne(K, this);
                return q
            }
        },
        outerHTML: {
            get: function() {
                return gWK.serializeOne(this, {
                    nodeType: 0
                })
            },
            set: yO.nyi
        },
        ELEMENT_NODE: {
            value: KL
        },
        ATTRIBUTE_NODE: {
            value: XK7
        },
        TEXT_NODE: {
            value: jQ8
        },
        CDATA_SECTION_NODE: {
            value: JAY
        },
        ENTITY_REFERENCE_NODE: {
            value: XAY
        },
        ENTITY_NODE: {
            value: MK7
        },
        PROCESSING_INSTRUCTION_NODE: {
            value: UWK
        },
        COMMENT_NODE: {
            value: QWK
        },
        DOCUMENT_NODE: {
            value: G58
        },
        DOCUMENT_TYPE_NODE: {
            value: ju
        },
        DOCUMENT_FRAGMENT_NODE: {
            value: n96
        },
        NOTATION_NODE: {
            value: PK7
        },
        DOCUMENT_POSITION_DISCONNECTED: {
            value: WK7
        },
        DOCUMENT_POSITION_PRECEDING: {
            value: DK7
        },
        DOCUMENT_POSITION_FOLLOWING: {
            value: ZK7
        },
        DOCUMENT_POSITION_CONTAINS: {
            value: dWK
        },
        DOCUMENT_POSITION_CONTAINED_BY: {
            value: fK7
        },
        DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: {
            value: GK7
        }
    })
})
// @from(Ln 369763, Col 4)
iWK = p((Yl2, nWK) => {
    nWK.exports = class extends Array {
        constructor(K) {
            super(K && K.length || 0);
            if (K)
                for (var _ in K) this[_] = K[_]
        }
        item(K) {
            return this[K] || null
        }
    }
})
// @from(Ln 369775, Col 4)
oWK = p((Al2, rWK) => {
    function MAY(q) {
        return this[q] || null
    }

    function PAY(q) {
        if (!q) q = [];
        return q.item = MAY, q
    }
    rWK.exports = PAY
})
// @from(Ln 369786, Col 4)
vM6 = p((Ol2, aWK) => {
    var vK7;
    try {
        vK7 = iWK()
    } catch (q) {
        vK7 = oWK()
    }
    aWK.exports = vK7
})
// @from(Ln 369795, Col 4)
HQ8 = p((wl2, eWK) => {
    eWK.exports = tWK;
    var sWK = HG(),
        WAY = vM6();

    function tWK() {
        sWK.call(this), this._firstChild = this._childNodes = null
    }
    tWK.prototype = Object.create(sWK.prototype, {
        hasChildNodes: {
            value: function() {
                if (this._childNodes) return this._childNodes.length > 0;
                return this._firstChild !== null
            }
        },
        childNodes: {
            get: function() {
                return this._ensureChildNodes(), this._childNodes
            }
        },
        firstChild: {
            get: function() {
                if (this._childNodes) return this._childNodes.length === 0 ? null : this._childNodes[0];
                return this._firstChild
            }
        },
        lastChild: {
            get: function() {
                var q = this._childNodes,
                    K;
                if (q) return q.length === 0 ? null : q[q.length - 1];
                if (K = this._firstChild, K === null) return null;
                return K._previousSibling
            }
        },
        _ensureChildNodes: {
            value: function() {
                if (this._childNodes) return;
                var q = this._firstChild,
                    K = q,
                    _ = this._childNodes = new WAY;
                if (q)
                    do _.push(K), K = K._nextSibling; while (K !== q);
                this._firstChild = null
            }
        },
        removeChildren: {
            value: function() {
                var K = this.rooted ? this.ownerDocument : null,
                    _ = this.firstChild,
                    z;
                while (_ !== null) {
                    if (z = _, _ = z.nextSibling, K) K.mutateRemove(z);
                    z.parentNode = null
                }
                if (this._childNodes) this._childNodes.length = 0;
                else this._firstChild = null;
                this.modify()
            }
        }
    })
})
// @from(Ln 369857, Col 4)
JQ8 = p((NAY) => {
    NAY.isValidName = VAY;
    NAY.isValidQName = kAY;
    var DAY = /^[_:A-Za-z][-.:\w]+$/,
        ZAY = /^([_A-Za-z][-.\w]+|[_A-Za-z][-.\w]+:[_A-Za-z][-.\w]+)$/,
        v58 = "_A-Za-zÀ-ÖØ-öø-˿Ͱ-ͽͿ-῿‌-‍⁰-↏Ⰰ-⿯、-퟿豈-﷏ﷰ-�",
        T58 = "-._A-Za-z0-9·À-ÖØ-öø-˿̀-ͽͿ-῿‌‍‿⁀⁰-↏Ⰰ-⿯、-퟿豈-﷏ﷰ-�",
        TM6 = "[" + v58 + "][" + T58 + "]*",
        TK7 = v58 + ":",
        VK7 = T58 + ":",
        fAY = new RegExp("^[" + TK7 + "][" + VK7 + "]*$"),
        GAY = new RegExp("^(" + TM6 + "|" + TM6 + ":" + TM6 + ")$"),
        q0K = /[\uD800-\uDB7F\uDC00-\uDFFF]/,
        K0K = /[\uD800-\uDB7F\uDC00-\uDFFF]/g,
        _0K = /[\uD800-\uDB7F][\uDC00-\uDFFF]/g;
    v58 += "\uD800-\uDB7F\uDC00-\uDFFF";
    T58 += "\uD800-\uDB7F\uDC00-\uDFFF";
    TM6 = "[" + v58 + "][" + T58 + "]*";
    TK7 = v58 + ":";
    VK7 = T58 + ":";
    var vAY = new RegExp("^[" + TK7 + "][" + VK7 + "]*$"),
        TAY = new RegExp("^(" + TM6 + "|" + TM6 + ":" + TM6 + ")$");

    function VAY(q) {
        if (DAY.test(q)) return !0;
        if (fAY.test(q)) return !0;
        if (!q0K.test(q)) return !1;
        if (!vAY.test(q)) return !1;
        var K = q.match(K0K),
            _ = q.match(_0K);
        return _ !== null && 2 * _.length === K.length
    }

    function kAY(q) {
        if (ZAY.test(q)) return !0;
        if (GAY.test(q)) return !0;
        if (!q0K.test(q)) return !1;
        if (!TAY.test(q)) return !1;
        var K = q.match(K0K),
            _ = q.match(_0K);
        return _ !== null && 2 * _.length === K.length
    }
})
// @from(Ln 369900, Col 4)
kK7 = p((hAY) => {
    var z0K = CX();
    hAY.property = function(q) {
        if (Array.isArray(q.type)) {
            var K = Object.create(null);
            q.type.forEach(function(Y) {
                K[Y.value || Y] = Y.alias || Y
            });
            var _ = q.missing;
            if (_ === void 0) _ = null;
            var z = q.invalid;
            if (z === void 0) z = _;
            return {
                get: function() {
                    var Y = this._getattr(q.name);
                    if (Y === null) return _;
                    if (Y = K[Y.toLowerCase()], Y !== void 0) return Y;
                    if (z !== null) return z;
                    return Y
                },
                set: function(Y) {
                    this._setattr(q.name, Y)
                }
            }
        } else if (q.type === Boolean) return {
            get: function() {
                return this.hasAttribute(q.name)
            },
            set: function(Y) {
                if (Y) this._setattr(q.name, "");
                else this.removeAttribute(q.name)
            }
        };
        else if (q.type === Number || q.type === "long" || q.type === "unsigned long" || q.type === "limited unsigned long with fallback") return LAY(q);
        else if (!q.type || q.type === String) return {
            get: function() {
                return this._getattr(q.name) || ""
            },
            set: function(Y) {
                if (q.treatNullAsEmptyString && Y === null) Y = "";
                this._setattr(q.name, Y)
            }
        };
        else if (typeof q.type === "function") return q.type(q.name, q);
        throw Error("Invalid attribute definition")
    };

    function LAY(q) {
        var K;
        if (typeof q.default === "function") K = q.default;
        else if (typeof q.default === "number") K = function() {
            return q.default
        };
        else K = function() {
            z0K.assert(!1, typeof q.default)
        };
        var _ = q.type === "unsigned long",
            z = q.type === "long",
            Y = q.type === "limited unsigned long with fallback",
            A = q.min,
            O = q.max,
            w = q.setmin;
        if (A === void 0) {
            if (_) A = 0;
            if (z) A = -2147483648;
            if (Y) A = 1
        }
        if (O === void 0) {
            if (_ || z || Y) O = 2147483647
        }
        return {
            get: function() {
                var $ = this._getattr(q.name),
                    j = q.float ? parseFloat($) : parseInt($, 10);
                if ($ === null || !isFinite(j) || A !== void 0 && j < A || O !== void 0 && j > O) return K.call(this);
                if (_ || z || Y) {
                    if (!/^[ \t\n\f\r]*[-+]?[0-9]/.test($)) return K.call(this);
                    j = j | 0
                }
                return j
            },
            set: function($) {
                if (!q.float) $ = Math.floor($);
                if (w !== void 0 && $ < w) z0K.IndexSizeError(q.name + " set to " + $);
                if (_) $ = $ < 0 || $ > 2147483647 ? K.call(this) : $ | 0;
                else if (Y) $ = $ < 1 || $ > 2147483647 ? K.call(this) : $ | 0;
                else if (z) $ = $ < -2147483648 || $ > 2147483647 ? K.call(this) : $ | 0;
                this._setattr(q.name, String($))
            }
        }
    }
    hAY.registerChangeHandler = function(q, K, _) {
        var z = q.prototype;
        if (!Object.prototype.hasOwnProperty.call(z, "_attributeChangeHandlers")) z._attributeChangeHandlers = Object.create(z._attributeChangeHandlers || null);
        z._attributeChangeHandlers[K] = _
    }
})
// @from(Ln 369997, Col 4)
O0K = p((Hl2, A0K) => {
    A0K.exports = Y0K;
    var CAY = HG();

    function Y0K(q, K) {
        this.root = q, this.filter = K, this.lastModTime = q.lastModTime, this.done = !1, this.cache = [], this.traverse()
    }
    Y0K.prototype = Object.create(Object.prototype, {
        length: {
            get: function() {
                if (this.checkcache(), !this.done) this.traverse();
                return this.cache.length
            }
        },
        item: {
            value: function(q) {
                if (this.checkcache(), !this.done && q >= this.cache.length) this.traverse();
                return this.cache[q]
            }
        },
        checkcache: {
            value: function() {
                if (this.lastModTime !== this.root.lastModTime) {
                    for (var q = this.cache.length - 1; q >= 0; q--) this[q] = void 0;
                    this.cache.length = 0, this.done = !1, this.lastModTime = this.root.lastModTime
                }
            }
        },
        traverse: {
            value: function(q) {
                if (q !== void 0) q++;
                var K;
                while ((K = this.next()) !== null)
                    if (this[this.cache.length] = K, this.cache.push(K), q && this.cache.length === q) return;
                this.done = !0
            }
        },
        next: {
            value: function() {
                var q = this.cache.length === 0 ? this.root : this.cache[this.cache.length - 1],
                    K;
                if (q.nodeType === CAY.DOCUMENT_NODE) K = q.documentElement;
                else K = q.nextElement(this.root);
                while (K) {
                    if (this.filter(K)) return K;
                    K = K.nextElement(this.root)
                }
                return null
            }
        }
    })
})
// @from(Ln 370049, Col 4)
EK7 = p((Jl2, j0K) => {
    var NK7 = CX();
    j0K.exports = $0K;

    function $0K(q, K) {
        this._getString = q, this._setString = K, this._length = 0, this._lastStringValue = "", this._update()
    }
    Object.defineProperties($0K.prototype, {
        length: {
            get: function() {
                return this._length
            }
        },
        item: {
            value: function(q) {
                var K = Ib6(this);
                if (q < 0 || q >= K.length) return null;
                return K[q]
            }
        },
        contains: {
            value: function(q) {
                q = String(q);
                var K = Ib6(this);
                return K.indexOf(q) > -1
            }
        },
        add: {
            value: function() {
                var q = Ib6(this);
                for (var K = 0, _ = arguments.length; K < _; K++) {
                    var z = V58(arguments[K]);
                    if (q.indexOf(z) < 0) q.push(z)
                }
                this._update(q)
            }
        },
        remove: {
            value: function() {
                var q = Ib6(this);
                for (var K = 0, _ = arguments.length; K < _; K++) {
                    var z = V58(arguments[K]),
                        Y = q.indexOf(z);
                    if (Y > -1) q.splice(Y, 1)
                }
                this._update(q)
            }
        },
        toggle: {
            value: function(K, _) {
                if (K = V58(K), this.contains(K)) {
                    if (_ === void 0 || _ === !1) return this.remove(K), !1;
                    return !0
                } else {
                    if (_ === void 0 || _ === !0) return this.add(K), !0;
                    return !1
                }
            }
        },
        replace: {
            value: function(K, _) {
                if (String(_) === "") NK7.SyntaxError();
                K = V58(K), _ = V58(_);
                var z = Ib6(this),
                    Y = z.indexOf(K);
                if (Y < 0) return !1;
                var A = z.indexOf(_);
                if (A < 0) z[Y] = _;
                else if (Y < A) z[Y] = _, z.splice(A, 1);
                else z.splice(Y, 1);
                return this._update(z), !0
            }
        },
        toString: {
            value: function() {
                return this._getString()
            }
        },
        value: {
            get: function() {
                return this._getString()
            },
            set: function(q) {
                this._setString(q), this._update()
            }
        },
        _update: {
            value: function(q) {
                if (q) w0K(this, q), this._setString(q.join(" ").trim());
                else w0K(this, Ib6(this));
                this._lastStringValue = this._getString()
            }
        }
    });

    function w0K(q, K) {
        var _ = q._length,
            z;
        q._length = K.length;
        for (z = 0; z < K.length; z++) q[z] = K[z];
        for (; z < _; z++) q[z] = void 0
    }

    function V58(q) {
        if (q = String(q), q === "") NK7.SyntaxError();
        if (/[ \t\r\n\f]/.test(q)) NK7.InvalidCharacterError();
        return q
    }

    function bAY(q) {
        var K = q._length,
            _ = Array(K);
        for (var z = 0; z < K; z++) _[z] = q[z];
        return _
    }

    function Ib6(q) {
        var K = q._getString();
        if (K === q._lastStringValue) return bAY(q);
        var _ = K.replace(/(^[ \t\r\n\f]+)|([ \t\r\n\f]+$)/g, "");
        if (_ === "") return [];
        else {
            var z = Object.create(null);
            return _.split(/[ \t\r\n\f]+/g).filter(function(Y) {
                var A = "$" + Y;
                if (z[A]) return !1;
                return z[A] = !0, !0
            })
        }
    }
})
// @from(Ln 370180, Col 4)
WQ8 = p((mb6, W0K) => {
    var XQ8 = Object.create(null, {
            location: {
                get: function() {
                    throw Error("window.location is not supported.")
                }
            }
        }),
        IAY = function(q, K) {
            return q.compareDocumentPosition(K)
        },
        xAY = function(q, K) {
            return IAY(q, K) & 2 ? 1 : -1
        },
        PQ8 = function(q) {
            while ((q = q.nextSibling) && q.nodeType !== 1);
            return q
        },
        ub6 = function(q) {
            while ((q = q.previousSibling) && q.nodeType !== 1);
            return q
        },
        uAY = function(q) {
            if (q = q.firstChild)
                while (q.nodeType !== 1 && (q = q.nextSibling));
            return q
        },
        mAY = function(q) {
            if (q = q.lastChild)
                while (q.nodeType !== 1 && (q = q.previousSibling));
            return q
        },
        xb6 = function(q) {
            if (!q.parentNode) return !1;
            var K = q.parentNode.nodeType;
            return K === 1 || K === 9
        },
        H0K = function(q) {
            if (!q) return q;
            var K = q[0];
            if (K === '"' || K === "'") {
                if (q[q.length - 1] === K) q = q.slice(1, -1);
                else q = q.slice(1);
                return q.replace(g3.str_escape, function(_) {
                    var z = /^\\(?:([0-9A-Fa-f]+)|([\r\n\f]+))/.exec(_);
                    if (!z) return _.slice(1);
                    if (z[2]) return "";
                    var Y = parseInt(z[1], 16);
                    return String.fromCodePoint ? String.fromCodePoint(Y) : String.fromCharCode(Y)
                })
            } else if (g3.ident.test(q)) return i96(q);
            else return q
        },
        i96 = function(q) {
            return q.replace(g3.escape, function(K) {
                var _ = /^\\([0-9A-Fa-f]+)/.exec(K);
                if (!_) return K[1];
                var z = parseInt(_[1], 16);
                return String.fromCodePoint ? String.fromCodePoint(z) : String.fromCharCode(z)
            })
        },
        BAY = function() {
            if (Array.prototype.indexOf) return Array.prototype.indexOf;
            return function(q, K) {
                var _ = this.length;
                while (_--)
                    if (this[_] === K) return _;
                return -1
            }
        }(),
        X0K = function(q, K) {
            var _ = g3.inside.source.replace(/</g, q).replace(/>/g, K);
            return new RegExp(_)
        },
        _L = function(q, K, _) {
            return q = q.source, q = q.replace(K, _.source || _), new RegExp(q)
        },
        J0K = function(q, K) {
            return q.replace(/^(?:\w+:\/\/|\/+)/, "").replace(/(?:\/+|\/*#.*?)$/, "").split("/", K).join("/")
        },
        pAY = function(q, K) {
            var _ = q.replace(/\s+/g, ""),
                z;
            if (_ === "even") _ = "2n+0";
            else if (_ === "odd") _ = "2n+1";
            else if (_.indexOf("n") === -1) _ = "0n" + _;
            return z = /^([+-])?(\d+)?n([+-])?(\d+)?$/.exec(_), {
                group: z[1] === "-" ? -(z[2] || 1) : +(z[2] || 1),
                offset: z[4] ? z[3] === "-" ? -z[4] : +z[4] : 0
            }
        },
        yK7 = function(q, K, _) {
            var z = pAY(q),
                Y = z.group,
                A = z.offset,
                O = !_ ? uAY : mAY,
                w = !_ ? PQ8 : ub6;
            return function($) {
                if (!xb6($)) return;
                var j = O($.parentNode),
                    H = 0;
                while (j) {
                    if (K(j, $)) H++;
                    if (j === $) return H -= A, Y && H ? H % Y === 0 && H < 0 === Y < 0 : !H;
                    j = w(j)
                }
            }
        },
        qZ = {
            "*": function() {
                return function() {
                    return !0
                }
            }(),
            type: function(q) {
                return q = q.toLowerCase(),
                    function(K) {
                        return K.nodeName.toLowerCase() === q
                    }
            },
            attr: function(q, K, _, z) {
                return K = M0K[K],
                    function(Y) {
                        var A;
                        switch (q) {
                            case "for":
                                A = Y.htmlFor;
                                break;
                            case "class":
                                if (A = Y.className, A === "" && Y.getAttribute("class") == null) A = null;
                                break;
                            case "href":
                            case "src":
                                A = Y.getAttribute(q, 2);
                                break;
                            case "title":
                                A = Y.getAttribute("title") || null;
                                break;
                            case "id":
                            case "lang":
                            case "dir":
                            case "accessKey":
                            case "hidden":
                            case "tabIndex":
                            case "style":
                                if (Y.getAttribute) {
                                    A = Y.getAttribute(q);
                                    break
                                }
                            default:
                                if (Y.hasAttribute && !Y.hasAttribute(q)) break;
                                A = Y[q] != null ? Y[q] : Y.getAttribute && Y.getAttribute(q);
                                break
                        }
                        if (A == null) return;
                        if (A = A + "", z) A = A.toLowerCase(), _ = _.toLowerCase();
                        return K(A, _)
                    }
            },
            ":first-child": function(q) {
                return !ub6(q) && xb6(q)
            },
            ":last-child": function(q) {
                return !PQ8(q) && xb6(q)
            },
            ":only-child": function(q) {
                return !ub6(q) && !PQ8(q) && xb6(q)
            },
            ":nth-child": function(q, K) {
                return yK7(q, function() {
                    return !0
                }, K)
            },
            ":nth-last-child": function(q) {
                return qZ[":nth-child"](q, !0)
            },
            ":root": function(q) {
                return q.ownerDocument.documentElement === q
            },
            ":empty": function(q) {
                return !q.firstChild
            },
            ":not": function(q) {
                var K = hK7(q);
                return function(_) {
                    return !K(_)
                }
            },
            ":first-of-type": function(q) {
                if (!xb6(q)) return;
                var K = q.nodeName;
                while (q = ub6(q))
                    if (q.nodeName === K) return;
                return !0
            },
            ":last-of-type": function(q) {
                if (!xb6(q)) return;
                var K = q.nodeName;
                while (q = PQ8(q))
                    if (q.nodeName === K) return;
                return !0
            },
            ":only-of-type": function(q) {
                return qZ[":first-of-type"](q) && qZ[":last-of-type"](q)
            },
            ":nth-of-type": function(q, K) {
                return yK7(q, function(_, z) {
                    return _.nodeName === z.nodeName
                }, K)
            },
            ":nth-last-of-type": function(q) {
                return qZ[":nth-of-type"](q, !0)
            },
            ":checked": function(q) {
                return !!(q.checked || q.selected)
            },
            ":indeterminate": function(q) {
                return !qZ[":checked"](q)
            },
            ":enabled": function(q) {
                return !q.disabled && q.type !== "hidden"
            },
            ":disabled": function(q) {
                return !!q.disabled
            },
            ":target": function(q) {
                return q.id === XQ8.location.hash.substring(1)
            },
            ":focus": function(q) {
                return q === q.ownerDocument.activeElement
            },
            ":is": function(q) {
                return hK7(q)
            },
            ":matches": function(q) {
                return qZ[":is"](q)
            },
            ":nth-match": function(q, K) {
                var _ = q.split(/\s*,\s*/),
                    z = _.shift(),
                    Y = hK7(_.join(","));
                return yK7(z, Y, K)
            },
            ":nth-last-match": function(q) {
                return qZ[":nth-match"](q, !0)
            },
            ":links-here": function(q) {
                return q + "" === XQ8.location + ""
            },
            ":lang": function(q) {
                return function(K) {
                    while (K) {
                        if (K.lang) return K.lang.indexOf(q) === 0;
                        K = K.parentNode
                    }
                }
            },
            ":dir": function(q) {
                return function(K) {
                    while (K) {
                        if (K.dir) return K.dir === q;
                        K = K.parentNode
                    }
                }
            },
            ":scope": function(q, K) {
                var _ = K || q.ownerDocument;
                if (_.nodeType === 9) return q === _.documentElement;
                return q === _
            },
            ":any-link": function(q) {
                return typeof q.href === "string"
            },
            ":local-link": function(q) {
                if (q.nodeName) return q.href && q.host === XQ8.location.host;
                var K = +q + 1;
                return function(_) {
                    if (!_.href) return;
                    var z = XQ8.location + "",
                        Y = _ + "";
                    return J0K(z, K) === J0K(Y, K)
                }
            },
            ":default": function(q) {
                return !!q.defaultSelected
            },
            ":valid": function(q) {
                return q.willValidate || q.validity && q.validity.valid
            },
            ":invalid": function(q) {
                return !qZ[":valid"](q)
            },
            ":in-range": function(q) {
                return q.value > q.min && q.value <= q.max
            },
            ":out-of-range": function(q) {
                return !qZ[":in-range"](q)
            },
            ":required": function(q) {
                return !!q.required
            },
            ":optional": function(q) {
                return !q.required
            },
            ":read-only": function(q) {
                if (q.readOnly) return !0;
                var K = q.getAttribute("contenteditable"),
                    _ = q.contentEditable,
                    z = q.nodeName.toLowerCase();
                return z = z !== "input" && z !== "textarea", (z || q.disabled) && K == null && _ !== "true"
            },
            ":read-write": function(q) {
                return !qZ[":read-only"](q)
            },
            ":hover": function() {
                throw Error(":hover is not supported.")
            },
            ":active": function() {
                throw Error(":active is not supported.")
            },
            ":link": function() {
                throw Error(":link is not supported.")
            },
            ":visited": function() {
                throw Error(":visited is not supported.")
            },
            ":column": function() {
                throw Error(":column is not supported.")
            },
            ":nth-column": function() {
                throw Error(":nth-column is not supported.")
            },
            ":nth-last-column": function() {
                throw Error(":nth-last-column is not supported.")
            },
            ":current": function() {
                throw Error(":current is not supported.")
            },
            ":past": function() {
                throw Error(":past is not supported.")
            },
            ":future": function() {
                throw Error(":future is not supported.")
            },
            ":contains": function(q) {
                return function(K) {
                    var _ = K.innerText || K.textContent || K.value || "";
                    return _.indexOf(q) !== -1
                }
            },
            ":has": function(q) {
                return function(K) {
                    return P0K(q, K).length > 0
                }
            }
        },
        M0K = {
            "-": function() {
                return !0
            },
            "=": function(q, K) {
                return q === K
            },
            "*=": function(q, K) {
                return q.indexOf(K) !== -1
            },
            "~=": function(q, K) {
                var _, z, Y, A;
                for (z = 0;; z = _ + 1) {
                    if (_ = q.indexOf(K, z), _ === -1) return !1;
                    if (Y = q[_ - 1], A = q[_ + K.length], (!Y || Y === " ") && (!A || A === " ")) return !0
                }
            },
            "|=": function(q, K) {
                var _ = q.indexOf(K),
                    z;
                if (_ !== 0) return;
                return z = q[_ + K.length], z === "-" || !z
            },
            "^=": function(q, K) {
                return q.indexOf(K) === 0
            },
            "$=": function(q, K) {
                var _ = q.lastIndexOf(K);
                return _ !== -1 && _ + K.length === q.length
            },
            "!=": function(q, K) {
                return q !== K
            }
        },
        k58 = {
            " ": function(q) {
                return function(K) {
                    while (K = K.parentNode)
                        if (q(K)) return K
                }
            },
            ">": function(q) {
                return function(K) {
                    if (K = K.parentNode) return q(K) && K
                }
            },
            "+": function(q) {
                return function(K) {
                    if (K = ub6(K)) return q(K) && K
                }
            },
            "~": function(q) {
                return function(K) {
                    while (K = ub6(K))
                        if (q(K)) return K
                }
            },
            noop: function(q) {
                return function(K) {
                    return q(K) && K
                }
            },
            ref: function(q, K) {
                var _;

                function z(Y) {
                    var A = Y.ownerDocument,
                        O = A.getElementsByTagName("*"),
                        w = O.length;
                    while (w--)
                        if (_ = O[w], z.test(Y)) return _ = null, !0;
                    _ = null
                }
                return z.combinator = function(Y) {
                    if (!_ || !_.getAttribute) return;
                    var A = _.getAttribute(K) || "";
                    if (A[0] === "#") A = A.substring(1);
                    if (A === Y.id && q(_)) return _
                }, z
            }
        },
        g3 = {
            escape: /\\(?:[^0-9A-Fa-f\r\n]|[0-9A-Fa-f]{1,6}[\r\n\t ]?)/g,
            str_escape: /(escape)|\\(\n|\r\n?|\f)/g,
            nonascii: /[\u00A0-\uFFFF]/,
            cssid: /(?:(?!-?[0-9])(?:escape|nonascii|[-_a-zA-Z0-9])+)/,
            qname: /^ *(cssid|\*)/,
            simple: /^(?:([.#]cssid)|pseudo|attr)/,
            ref: /^ *\/(cssid)\/ */,
            combinator: /^(?: +([^ \w*.#\\]) +|( )+|([^ \w*.#\\]))(?! *$)/,
            attr: /^\[(cssid)(?:([^\w]?=)(inside))?\]/,
            pseudo: /^(:cssid)(?:\((inside)\))?/,
            inside: /(?:"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|<[^"'>]*>|\\["'>]|[^"'>])*/,
            ident: /^(cssid)$/
        };
    g3.cssid = _L(g3.cssid, "nonascii", g3.nonascii);
    g3.cssid = _L(g3.cssid, "escape", g3.escape);
    g3.qname = _L(g3.qname, "cssid", g3.cssid);
    g3.simple = _L(g3.simple, "cssid", g3.cssid);
    g3.ref = _L(g3.ref, "cssid", g3.cssid);
    g3.attr = _L(g3.attr, "cssid", g3.cssid);
    g3.pseudo = _L(g3.pseudo, "cssid", g3.cssid);
    g3.inside = _L(g3.inside, `[^"'>]*`, g3.inside);
    g3.attr = _L(g3.attr, "inside", X0K("\\[", "\\]"));
    g3.pseudo = _L(g3.pseudo, "inside", X0K("\\(", "\\)"));
    g3.simple = _L(g3.simple, "pseudo", g3.pseudo);
    g3.simple = _L(g3.simple, "attr", g3.attr);
    g3.ident = _L(g3.ident, "cssid", g3.cssid);
    g3.str_escape = _L(g3.str_escape, "escape", g3.escape);
    var N58 = function(q) {
            var K = q.replace(/^\s+|\s+$/g, ""),
                _, z = [],
                Y = [],
                A, O, w, $, j;
            while (K) {
                if (w = g3.qname.exec(K)) K = K.substring(w[0].length), O = i96(w[1]), Y.push(MQ8(O, !0));
                else if (w = g3.simple.exec(K)) K = K.substring(w[0].length), O = "*", Y.push(MQ8(O, !0)), Y.push(MQ8(w));
                else throw SyntaxError("Invalid selector.");
                while (w = g3.simple.exec(K)) K = K.substring(w[0].length), Y.push(MQ8(w));
                if (K[0] === "!") K = K.substring(1), A = gAY(), A.qname = O, Y.push(A.simple);
                if (w = g3.ref.exec(K)) {
                    K = K.substring(w[0].length), j = k58.ref(LK7(Y), i96(w[1])), z.push(j.combinator), Y = [];
                    continue
                }
                if (w = g3.combinator.exec(K)) {
                    if (K = K.substring(w[0].length), $ = w[1] || w[2] || w[3], $ === ",") {
                        z.push(k58.noop(LK7(Y)));
                        break
                    }
                } else $ = "noop";
                if (!k58[$]) throw SyntaxError("Bad combinator.");
                z.push(k58[$](LK7(Y))), Y = []
            }
            if (_ = FAY(z), _.qname = O, _.sel = K, A) A.lname = _.qname, A.test = _, A.qname = A.qname, A.sel = _.sel, _ = A;
            if (j) j.test = _, j.qname = _.qname, j.sel = _.sel, _ = j;
            return _
        },
        MQ8 = function(q, K) {
            if (K) return q === "*" ? qZ["*"] : qZ.type(q);
            if (q[1]) return q[1][0] === "." ? qZ.attr("class", "~=", i96(q[1].substring(1)), !1) : qZ.attr("id", "=", i96(q[1].substring(1)), !1);
            if (q[2]) return q[3] ? qZ[i96(q[2])](H0K(q[3])) : qZ[i96(q[2])];
            if (q[4]) {
                var _ = q[6],
                    z = /["'\s]\s*I$/i.test(_);
                if (z) _ = _.replace(/\s*I$/i, "");
                return qZ.attr(i96(q[4]), q[5] || "-", H0K(_), z)
            }
            throw SyntaxError("Unknown Selector.")
        },
        LK7 = function(q) {
            var K = q.length,
                _;
            if (K < 2) return q[0];
            return function(z) {
                if (!z) return;
                for (_ = 0; _ < K; _++)
                    if (!q[_](z)) return;
                return !0
            }
        },
        FAY = function(q) {
            if (q.length < 2) return function(K) {
                return !!q[0](K)
            };
            return function(K) {
                var _ = q.length;
                while (_--)
                    if (!(K = q[_](K))) return;
                return !0
            }
        },
        gAY = function() {
            var q;

            function K(_) {
                var z = _.ownerDocument,
                    Y = z.getElementsByTagName(K.lname),
                    A = Y.length;
                while (A--)
                    if (K.test(Y[A]) && q === _) return q = null, !0;
                q = null
            }
            return K.simple = function(_) {
                return q = _, !0
            }, K
        },
        hK7 = function(q) {
            var K = N58(q),
                _ = [K];
            while (K.sel) K = N58(K.sel), _.push(K);
            if (_.length < 2) return K;
            return function(z) {
                var Y = _.length,
                    A = 0;
                for (; A < Y; A++)
                    if (_[A](z)) return !0
            }
        },
        P0K = function(q, K) {
            var _ = [],
                z = N58(q),
                Y = K.getElementsByTagName(z.qname),
                A = 0,
                O;
            while (O = Y[A++])
                if (z(O)) _.push(O);
            if (z.sel) {
                while (z.sel) {
                    z = N58(z.sel), Y = K.getElementsByTagName(z.qname), A = 0;
                    while (O = Y[A++])
                        if (z(O) && BAY.call(_, O) === -1) _.push(O)
                }
                _.sort(xAY)
            }
            return _
        };
    W0K.exports = mb6 = function(q, K) {
        var _, z;
        if (K.nodeType !== 11 && q.indexOf(" ") === -1) {
            if (q[0] === "#" && K.rooted && /^#[A-Z_][-A-Z0-9_]*$/i.test(q)) {
                if (K.doc._hasMultipleElementsWithId) {
                    if (_ = q.substring(1), !K.doc._hasMultipleElementsWithId(_)) return z = K.doc.getElementById(_), z ? [z] : []
                }
            }
            if (q[0] === "." && /^\.\w+$/.test(q)) return K.getElementsByClassName(q.substring(1));
            if (/^\w+$/.test(q)) return K.getElementsByTagName(q)
        }
        return P0K(q, K)
    };
    mb6.selectors = qZ;
    mb6.operators = M0K;
    mb6.combinators = k58;
    mb6.matches = function(q, K) {
        var _ = {
            sel: K
        };
        do
            if (_ = N58(_.sel), _(q)) return !0; while (_.sel);
        return !1
    }
})