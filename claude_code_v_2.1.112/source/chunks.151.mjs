
// @from(Ln 388686, Col 0)
function QGK(q, K, _) {
    try {
        let z = V8(),
            Y = Wq(q),
            {
                buffer: A,
                bytesRead: O
            } = z.readSync(Y, {
                length: UGK
            }),
            $ = A.toString("utf-8", 0, O).split(`
`);
        if (K < 0 || K >= $.length) return null;
        if (O === UGK && K === $.length - 1) return null;
        let j = $[K];
        if (!j || _ < 0 || _ >= j.length) return null;
        let H = /[\w$'!]+|[+\-*/%&|^~<>=]+/g,
            J;
        while ((J = H.exec(j)) !== null) {
            let X = J.index,
                M = X + J[0].length;
            if (_ >= X && _ < M) {
                let P = J[0];
                return w5(P, 30)
            }
        }
        return null
    } catch (z) {
        if (z instanceof Error) E(`Symbol extraction failed for ${q}:${K}:${_}: ${z.message}`, {
            level: "warn"
        });
        return null
    }
}
// @from(Ln 388720, Col 4)
UGK = 65536
// @from(Ln 388721, Col 4)
dGK = L(() => {
    K8();
    c7();
    Yq();
    b9()
})
// @from(Ln 388728, Col 0)
function OjY(q) {
    let K = s(24),
        {
            operation: _,
            resultCount: z,
            fileCount: Y,
            content: A,
            verbose: O
        } = q,
        w;
    if (K[0] !== _) w = AjY[_] || {
        singular: "result",
        plural: "results"
    }, K[0] = _, K[1] = w;
    else w = K[1];
    let $ = w,
        j = z === 1 ? $.singular : $.plural,
        H;
    if (K[2] !== j || K[3] !== $.special || K[4] !== _ || K[5] !== z) H = _ === "hover" && z > 0 && $.special ? xM.default.createElement(T, null, "Hover info ", $.special) : xM.default.createElement(T, null, "Found ", xM.default.createElement(T, {
        bold: !0
    }, z, " "), j), K[2] = j, K[3] = $.special, K[4] = _, K[5] = z, K[6] = H;
    else H = K[6];
    let J = H,
        X;
    if (K[7] !== Y) X = Y > 1 ? xM.default.createElement(T, null, " ", "across ", xM.default.createElement(T, {
        bold: !0
    }, Y, " "), "files") : null, K[7] = Y, K[8] = X;
    else X = K[8];
    let M = X;
    if (O) {
        let D;
        if (K[9] === Symbol.for("react.memo_cache_sentinel")) D = xM.default.createElement(T, {
            dimColor: !0
        }, "  ⎿  "), K[9] = D;
        else D = K[9];
        let Z;
        if (K[10] !== J || K[11] !== M) Z = xM.default.createElement(u, {
            flexDirection: "row"
        }, xM.default.createElement(T, null, D, J, M)), K[10] = J, K[11] = M, K[12] = Z;
        else Z = K[12];
        let G;
        if (K[13] !== A) G = xM.default.createElement(u, {
            marginLeft: 5
        }, xM.default.createElement(T, null, A)), K[13] = A, K[14] = G;
        else G = K[14];
        let f;
        if (K[15] !== Z || K[16] !== G) f = xM.default.createElement(u, {
            flexDirection: "column"
        }, Z, G), K[15] = Z, K[16] = G, K[17] = f;
        else f = K[17];
        return f
    }
    let P;
    if (K[18] !== z) P = z > 0 && xM.default.createElement(U2, null), K[18] = z, K[19] = P;
    else P = K[19];
    let W;
    if (K[20] !== J || K[21] !== M || K[22] !== P) W = xM.default.createElement(_1, {
        height: 1
    }, xM.default.createElement(T, null, J, M, " ", P)), K[20] = J, K[21] = M, K[22] = P, K[23] = W;
    else W = K[23];
    return W
}
// @from(Ln 388791, Col 0)
function cGK() {
    return "LSP"
}
// @from(Ln 388795, Col 0)
function lGK(q, {
    verbose: K
}) {
    if (!q.operation) return null;
    let _ = [];
    if ((q.operation === "goToDefinition" || q.operation === "findReferences" || q.operation === "hover" || q.operation === "goToImplementation") && q.filePath && q.line !== void 0 && q.character !== void 0) {
        let z = QGK(q.filePath, q.line - 1, q.character - 1),
            Y = K ? q.filePath : S3(q.filePath);
        if (z) _.push(`operation: "${q.operation}"`), _.push(`symbol: "${z}"`), _.push(`in: "${Y}"`);
        else _.push(`operation: "${q.operation}"`), _.push(`file: "${Y}"`), _.push(`position: ${q.line}:${q.character}`);
        return _.join(", ")
    }
    if (_.push(`operation: "${q.operation}"`), q.filePath) {
        let z = K ? q.filePath : S3(q.filePath);
        _.push(`file: "${z}"`)
    }
    return _.join(", ")
}
// @from(Ln 388814, Col 0)
function nGK(q, {
    verbose: K
}) {
    if (!K && typeof q === "string" && vK(q, "tool_use_error")) return xM.default.createElement(_1, null, xM.default.createElement(T, {
        color: "error"
    }, "LSP operation failed"));
    return xM.default.createElement(d$, {
        result: q,
        verbose: K
    })
}
// @from(Ln 388826, Col 0)
function iGK(q, K, {
    verbose: _
}) {
    if (q.resultCount !== void 0 && q.fileCount !== void 0) return xM.default.createElement(OjY, {
        operation: q.operation,
        resultCount: q.resultCount,
        fileCount: q.fileCount,
        content: q.result,
        verbose: _
    });
    return xM.default.createElement(_1, null, xM.default.createElement(T, null, q.result))
}
// @from(Ln 388838, Col 4)
xM
// @from(Ln 388838, Col 8)
AjY
// @from(Ln 388839, Col 4)
rGK = L(() => {
    o6();
    kk();
    ny();
    GK();
    g6();
    eK();
    _7();
    dGK();
    xM = K6(P6(), 1), AjY = {
        goToDefinition: {
            singular: "definition",
            plural: "definitions"
        },
        findReferences: {
            singular: "reference",
            plural: "references"
        },
        documentSymbol: {
            singular: "symbol",
            plural: "symbols"
        },
        workspaceSymbol: {
            singular: "symbol",
            plural: "symbols"
        },
        hover: {
            singular: "hover info",
            plural: "hover info",
            special: "available"
        },
        goToImplementation: {
            singular: "implementation",
            plural: "implementations"
        },
        prepareCallHierarchy: {
            singular: "call item",
            plural: "call items"
        },
        incomingCalls: {
            singular: "caller",
            plural: "callers"
        },
        outgoingCalls: {
            singular: "callee",
            plural: "callees"
        }
    }
})
// @from(Ln 388896, Col 0)
function XjY(q, K) {
    let _ = $jY(K).href,
        z = {
            line: q.line - 1,
            character: q.character - 1
        };
    switch (q.operation) {
        case "goToDefinition":
            return {
                method: "textDocument/definition", params: {
                    textDocument: {
                        uri: _
                    },
                    position: z
                }
            };
        case "findReferences":
            return {
                method: "textDocument/references", params: {
                    textDocument: {
                        uri: _
                    },
                    position: z,
                    context: {
                        includeDeclaration: !0
                    }
                }
            };
        case "hover":
            return {
                method: "textDocument/hover", params: {
                    textDocument: {
                        uri: _
                    },
                    position: z
                }
            };
        case "documentSymbol":
            return {
                method: "textDocument/documentSymbol", params: {
                    textDocument: {
                        uri: _
                    }
                }
            };
        case "workspaceSymbol":
            return {
                method: "workspace/symbol", params: {
                    query: ""
                }
            };
        case "goToImplementation":
            return {
                method: "textDocument/implementation", params: {
                    textDocument: {
                        uri: _
                    },
                    position: z
                }
            };
        case "prepareCallHierarchy":
            return {
                method: "textDocument/prepareCallHierarchy", params: {
                    textDocument: {
                        uri: _
                    },
                    position: z
                }
            };
        case "incomingCalls":
            return {
                method: "textDocument/prepareCallHierarchy", params: {
                    textDocument: {
                        uri: _
                    },
                    position: z
                }
            };
        case "outgoingCalls":
            return {
                method: "textDocument/prepareCallHierarchy", params: {
                    textDocument: {
                        uri: _
                    },
                    position: z
                }
            }
    }
}
// @from(Ln 388986, Col 0)
function aGK(q) {
    let K = q.length;
    for (let _ of q)
        if (_.children && _.children.length > 0) K += aGK(_.children);
    return K
}
// @from(Ln 388993, Col 0)
function Pd8(q) {
    return new Set(q.map((K) => K.uri)).size
}
// @from(Ln 388997, Col 0)
function MjY(q) {
    let K = q.replace(/^file:\/\//, "");
    if (/^\/[A-Za-z]:/.test(K)) K = K.slice(1);
    try {
        K = decodeURIComponent(K)
    } catch {}
    return K
}
// @from(Ln 389005, Col 0)
async function oGK(q, K) {
    if (q.length === 0) return q;
    let _ = new Map;
    for (let O of q)
        if (O.uri && !_.has(O.uri)) _.set(O.uri, MjY(O.uri));
    let z = F4(_.values());
    if (z.length === 0) return q;
    let Y = new Set,
        A = 50;
    for (let O = 0; O < z.length; O += A) {
        let w = z.slice(O, O + A),
            $ = await M7("git", ["check-ignore", ...w], {
                cwd: K,
                preserveOutputOnError: !1,
                timeout: 5000
            });
        if ($.code === 0 && $.stdout)
            for (let j of $.stdout.split(`
`)) {
                let H = j.trim();
                if (H) Y.add(H)
            }
    }
    if (Y.size === 0) return q;
    return q.filter((O) => {
        let w = _.get(O.uri);
        return !w || !Y.has(w)
    })
}
// @from(Ln 389035, Col 0)
function PjY(q) {
    return "targetUri" in q
}
// @from(Ln 389039, Col 0)
function Wd8(q) {
    if (PjY(q)) return {
        uri: q.targetUri,
        range: q.targetSelectionRange || q.targetRange
    };
    return q
}
// @from(Ln 389047, Col 0)
function WjY(q, K, _) {
    switch (q) {
        case "goToDefinition": {
            let Y = (Array.isArray(K) ? K : K ? [K] : []).map(Wd8),
                A = Y.filter((w) => !w || !w.uri);
            if (A.length > 0) j6(Error(`LSP server returned ${A.length} location(s) with undefined URI for goToDefinition on ${_}. This indicates malformed data from the LSP server.`));
            let O = Y.filter((w) => w && w.uri);
            return {
                formatted: W37(K, _),
                resultCount: O.length,
                fileCount: Pd8(O)
            }
        }
        case "findReferences": {
            let z = K || [],
                Y = z.filter((O) => !O || !O.uri);
            if (Y.length > 0) j6(Error(`LSP server returned ${Y.length} location(s) with undefined URI for findReferences on ${_}. This indicates malformed data from the LSP server.`));
            let A = z.filter((O) => O && O.uri);
            return {
                formatted: CGK(K, _),
                resultCount: A.length,
                fileCount: Pd8(A)
            }
        }
        case "hover":
            return {
                formatted: bGK(K, _), resultCount: K ? 1 : 0, fileCount: K ? 1 : 0
            };
        case "documentSymbol": {
            let z = K || [],
                A = z.length > 0 && z[0] && "range" in z[0] ? aGK(z) : z.length;
            return {
                formatted: xGK(K, _),
                resultCount: A,
                fileCount: z.length > 0 ? 1 : 0
            }
        }
        case "workspaceSymbol": {
            let z = K || [],
                Y = z.filter((w) => !w || !w.location || !w.location.uri);
            if (Y.length > 0) j6(Error(`LSP server returned ${Y.length} symbol(s) with undefined location URI for workspaceSymbol on ${_}. This indicates malformed data from the LSP server.`));
            let A = z.filter((w) => w && w.location && w.location.uri),
                O = A.map((w) => w.location);
            return {
                formatted: D37(K, _),
                resultCount: A.length,
                fileCount: Pd8(O)
            }
        }
        case "goToImplementation": {
            let Y = (Array.isArray(K) ? K : K ? [K] : []).map(Wd8),
                A = Y.filter((w) => !w || !w.uri);
            if (A.length > 0) j6(Error(`LSP server returned ${A.length} location(s) with undefined URI for goToImplementation on ${_}. This indicates malformed data from the LSP server.`));
            let O = Y.filter((w) => w && w.uri);
            return {
                formatted: W37(K, _),
                resultCount: O.length,
                fileCount: Pd8(O)
            }
        }
        case "prepareCallHierarchy": {
            let z = K || [];
            return {
                formatted: uGK(K, _),
                resultCount: z.length,
                fileCount: z.length > 0 ? DjY(z) : 0
            }
        }
        case "incomingCalls": {
            let z = K || [];
            return {
                formatted: mGK(K, _),
                resultCount: z.length,
                fileCount: z.length > 0 ? ZjY(z) : 0
            }
        }
        case "outgoingCalls": {
            let z = K || [];
            return {
                formatted: BGK(K, _),
                resultCount: z.length,
                fileCount: z.length > 0 ? fjY(z) : 0
            }
        }
    }
}
// @from(Ln 389134, Col 0)
function DjY(q) {
    let K = q.map((_) => _.uri).filter((_) => _);
    return new Set(K).size
}
// @from(Ln 389139, Col 0)
function ZjY(q) {
    let K = q.map((_) => _.from?.uri).filter((_) => _);
    return new Set(K).size
}
// @from(Ln 389144, Col 0)
function fjY(q) {
    let K = q.map((_) => _.to?.uri).filter((_) => _);
    return new Set(K).size
}
// @from(Ln 389148, Col 4)
jjY = 1e7
// @from(Ln 389149, Col 4)
HjY
// @from(Ln 389149, Col 9)
JjY
// @from(Ln 389149, Col 14)
f37
// @from(Ln 389150, Col 4)
sGK = L(() => {
    p7();
    nl();
    gq();
    n7();
    K8();
    m8();
    Q4();
    Yq();
    U8();
    b9();
    Sz();
    pGK();
    gGK();
    rGK();
    HjY = C6(() => y.strictObject({
        operation: y.enum(["goToDefinition", "findReferences", "hover", "documentSymbol", "workspaceSymbol", "goToImplementation", "prepareCallHierarchy", "incomingCalls", "outgoingCalls"]).describe("The LSP operation to perform"),
        filePath: y.string().describe("The absolute or relative path to the file"),
        line: y.number().int().positive().describe("The line number (1-based, as shown in editors)"),
        character: y.number().int().positive().describe("The character offset (1-based, as shown in editors)")
    })), JjY = C6(() => y.object({
        operation: y.enum(["goToDefinition", "findReferences", "hover", "documentSymbol", "workspaceSymbol", "goToImplementation", "prepareCallHierarchy", "incomingCalls", "outgoingCalls"]).describe("The LSP operation that was performed"),
        result: y.string().describe("The formatted result of the LSP operation"),
        filePath: y.string().describe("The file path the operation was performed on"),
        resultCount: y.number().int().nonnegative().optional().describe("Number of results (definitions, references, symbols)"),
        fileCount: y.number().int().nonnegative().optional().describe("Number of files containing results")
    })), f37 = Iq({
        name: dC6,
        searchHint: "code intelligence (definitions, references, symbols, hover)",
        maxResultSizeChars: 1e5,
        isLsp: !0,
        async description() {
            return I77
        },
        userFacingName: cGK,
        shouldDefer: !0,
        isEnabled() {
            return TMK()
        },
        get inputSchema() {
            return HjY()
        },
        get outputSchema() {
            return JjY()
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        getPath({
            filePath: q
        }) {
            return Wq(q)
        },
        async validateInput(q) {
            let K = FGK().safeParse(q);
            if (!K.success) return {
                result: !1,
                message: `Invalid input: ${K.error.message}`,
                errorCode: 3
            };
            let _ = V8(),
                z = Wq(q.filePath);
            if (z.startsWith("\\\\") || z.startsWith("//")) return {
                result: !0
            };
            let Y;
            try {
                Y = await _.stat(z)
            } catch (A) {
                if (t1(A)) return {
                    result: !1,
                    message: `File does not exist: ${q.filePath}`,
                    errorCode: 1
                };
                let O = r1(A);
                return j6(Error(`Failed to access file stats for LSP operation on ${q.filePath}: ${O.message}`)), {
                    result: !1,
                    message: `Cannot access file: ${q.filePath}. ${O.message}`,
                    errorCode: 4
                }
            }
            if (!Y.isFile()) return {
                result: !1,
                message: `Path is not a file: ${q.filePath}`,
                errorCode: 2
            };
            return {
                result: !0
            }
        },
        async checkPermissions(q, K) {
            let _ = K.getAppState();
            return l96(f37, q, _.toolPermissionContext)
        },
        async prompt() {
            return I77
        },
        renderToolUseMessage: lGK,
        renderToolUseErrorMessage: nGK,
        renderToolResultMessage: iGK,
        async call(q, K) {
            let _ = Wq(q.filePath),
                z = b8();
            if (Db6().status === "pending") await VMK();
            let A = F96();
            if (!A) return j6(Error("LSP server manager not initialized when tool was called")), {
                data: {
                    operation: q.operation,
                    result: "LSP server manager not initialized. This may indicate a startup issue.",
                    filePath: q.filePath
                }
            };
            let {
                method: O,
                params: w
            } = XjY(q, _);
            try {
                if (!A.isFileOpen(_)) {
                    let M = await wjY(_, "r");
                    try {
                        let P = await M.stat();
                        if (P.size > jjY) return {
                            data: {
                                operation: q.operation,
                                result: `File too large for LSP analysis (${Math.ceil(P.size/1e6)}MB exceeds 10MB limit)`,
                                filePath: q.filePath
                            }
                        };
                        let W = await M.readFile({
                            encoding: "utf-8"
                        });
                        await A.openFile(_, W)
                    } finally {
                        await M.close()
                    }
                }
                let $ = await A.sendRequest(_, O, w);
                if ($ === void 0) return E(`No LSP server available for file type ${Z37.extname(_)} for operation ${q.operation} on file ${q.filePath}`), {
                    data: {
                        operation: q.operation,
                        result: `No LSP server available for file type: ${Z37.extname(_)}`,
                        filePath: q.filePath
                    }
                };
                if (q.operation === "incomingCalls" || q.operation === "outgoingCalls") {
                    let M = $;
                    if (!M || M.length === 0) return {
                        data: {
                            operation: q.operation,
                            result: "No call hierarchy item found at this position",
                            filePath: q.filePath,
                            resultCount: 0,
                            fileCount: 0
                        }
                    };
                    let P = q.operation === "incomingCalls" ? "callHierarchy/incomingCalls" : "callHierarchy/outgoingCalls";
                    if ($ = await A.sendRequest(_, P, {
                            item: M[0]
                        }), $ === void 0) E(`LSP server returned undefined for ${P} on ${q.filePath}`)
                }
                if ($ && Array.isArray($) && (q.operation === "findReferences" || q.operation === "goToDefinition" || q.operation === "goToImplementation" || q.operation === "workspaceSymbol"))
                    if (q.operation === "workspaceSymbol") {
                        let M = $,
                            P = M.filter((Z) => Z?.location?.uri).map((Z) => Z.location),
                            W = await oGK(P, z),
                            D = new Set(W.map((Z) => Z.uri));
                        $ = M.filter((Z) => !Z?.location?.uri || D.has(Z.location.uri))
                    } else {
                        let M = $.map(Wd8),
                            P = await oGK(M, z),
                            W = new Set(P.map((D) => D.uri));
                        $ = $.filter((D) => {
                            let Z = Wd8(D);
                            return !Z.uri || W.has(Z.uri)
                        })
                    } let {
                    formatted: j,
                    resultCount: H,
                    fileCount: J
                } = WjY(q.operation, $, z);
                return {
                    data: {
                        operation: q.operation,
                        result: j,
                        filePath: q.filePath,
                        resultCount: H,
                        fileCount: J
                    }
                }
            } catch ($) {
                let H = r1($).message;
                return j6(Error(`LSP tool request failed for ${q.operation} on ${q.filePath}: ${H}`)), {
                    data: {
                        operation: q.operation,
                        result: `Error performing ${q.operation}: ${H}`,
                        filePath: q.filePath
                    }
                }
            }
        },
        mapToolResultToToolResultBlockParam(q, K) {
            return {
                tool_use_id: K,
                type: "tool_result",
                content: q.result
            }
        }
    })
})
// @from(Ln 389363, Col 0)
function tGK(q) {
    if (!q.uri || !q.server) return null;
    return `Read resource "${q.uri}" from server "${q.server}"`
}
// @from(Ln 389368, Col 0)
function eGK() {
    return "readMcpResource"
}
// @from(Ln 389372, Col 0)
function qvK(q, K, {
    verbose: _
}) {
    if (!q || !q.contents || q.contents.length === 0) return We.createElement(u, {
        justifyContent: "space-between",
        overflowX: "hidden",
        width: "100%"
    }, We.createElement(_1, {
        height: 1
    }, We.createElement(T, {
        dimColor: !0
    }, "(No content)")));
    let z = I6(q, null, 2);
    return We.createElement(LR, {
        content: z,
        verbose: _
    })
}
// @from(Ln 389390, Col 4)
We
// @from(Ln 389391, Col 4)
KvK = L(() => {
    GK();
    Bj6();
    g6();
    e8();
    We = K6(P6(), 1)
})
// @from(Ln 389398, Col 4)
GjY
// @from(Ln 389398, Col 9)
vjY
// @from(Ln 389398, Col 14)
De
// @from(Ln 389399, Col 4)
Dd8 = L(() => {
    _P();
    p7();
    oW();
    gq();
    zQ8();
    e8();
    mj6();
    KvK();
    GjY = C6(() => y.object({
        server: y.string().describe("The MCP server name"),
        uri: y.string().describe("The resource URI to read")
    })), vjY = C6(() => y.object({
        contents: y.array(y.object({
            uri: y.string().describe("Resource URI"),
            mimeType: y.string().optional().describe("MIME type of the content"),
            text: y.string().optional().describe("Text content of the resource"),
            blobSavedTo: y.string().optional().describe("Path where binary blob content was saved")
        }))
    })), De = Iq({
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        toAutoClassifierInput(q) {
            return `${q.server} ${q.uri}`
        },
        shouldDefer: !0,
        name: "ReadMcpResourceTool",
        searchHint: "read a specific MCP resource by URI",
        maxResultSizeChars: 1e5,
        async description() {
            return Z2K
        },
        async prompt() {
            return f2K
        },
        get inputSchema() {
            return GjY()
        },
        get outputSchema() {
            return vjY()
        },
        async call(q, {
            options: {
                mcpClients: K
            }
        }) {
            let {
                server: _,
                uri: z
            } = q, Y = K.find(($) => $.name === _);
            if (!Y) throw Error(`Server "${_}" not found. Available servers: ${K.map(($)=>$.name).join(", ")}`);
            if (Y.type !== "connected") throw Error(`Server "${_}" is not connected`);
            if (!Y.capabilities?.resources) throw Error(`Server "${_}" does not support resources`);
            let O = await (await Fy6(Y)).client.request({
                method: "resources/read",
                params: {
                    uri: z
                }
            }, hg6);
            return {
                data: {
                    contents: await Promise.all(O.contents.map(async ($, j) => {
                        if ("text" in $) return {
                            uri: $.uri,
                            mimeType: $.mimeType,
                            text: $.text
                        };
                        if (!("blob" in $) || typeof $.blob !== "string") return {
                            uri: $.uri,
                            mimeType: $.mimeType
                        };
                        let H = `mcp-resource-${Date.now()}-${j}-${Math.random().toString(36).slice(2,8)}`,
                            J = await Cb6(Buffer.from($.blob, "base64"), $.mimeType, H);
                        if ("error" in J) return {
                            uri: $.uri,
                            mimeType: $.mimeType,
                            text: `Binary content could not be saved to disk: ${J.error}`
                        };
                        return {
                            uri: $.uri,
                            mimeType: $.mimeType,
                            blobSavedTo: J.filepath,
                            text: _Q8(J.filepath, $.mimeType, J.size, `[Resource from ${_} at ${$.uri}] `)
                        }
                    }))
                }
            }
        },
        renderToolUseMessage: tGK,
        userFacingName: eGK,
        renderToolResultMessage: qvK,
        isResultTruncated(q) {
            return yR(I6(q))
        },
        mapToolResultToToolResultBlockParam(q, K) {
            return {
                tool_use_id: K,
                type: "tool_result",
                content: I6(q)
            }
        }
    })
})
// @from(Ln 389506, Col 4)
AvK = {}
// @from(Ln 389514, Col 0)
function TjY(q) {
    return q.map((K) => K.name).sort().join(",")
}
// @from(Ln 389518, Col 0)
function VjY(q) {
    let K = TjY(q);
    if (G37 !== K) E("ToolSearchTool: cache invalidated - deferred tools changed"), fd8.cache.clear?.(), G37 = K
}
// @from(Ln 389523, Col 0)
function kjY() {
    fd8.cache.clear?.(), G37 = null
}
// @from(Ln 389527, Col 0)
function Zd8(q, K, _, z) {
    return {
        data: {
            matches: q,
            query: K,
            total_deferred_tools: _,
            ...z && z.length > 0 && {
                pending_mcp_servers: z
            }
        }
    }
}
// @from(Ln 389540, Col 0)
function _vK(q) {
    let K = q.name,
        _ = q.mcpInfo ? [q.mcpInfo.serverName, q.mcpInfo.toolName] : K.startsWith("mcp__") ? K.replace(/^mcp__/, "").split("__") : void 0;
    if (_) {
        let Y = _.flatMap((A) => A.toLowerCase().split(/[\s_.]+/)).filter(Boolean);
        return {
            parts: Y,
            full: Y.join(" "),
            isMcp: !0
        }
    }
    let z = K.replace(/([a-z])([A-Z])/g, "$1 $2").replaceAll("_", " ").toLowerCase().split(/\s+/).filter(Boolean);
    return {
        parts: z,
        full: z.join(" "),
        isMcp: !1
    }
}
// @from(Ln 389559, Col 0)
function NjY(q) {
    let K = new Map;
    for (let _ of q)
        if (!K.has(_)) K.set(_, new RegExp(`\\b${E16(_)}\\b`));
    return K
}
// @from(Ln 389565, Col 0)
async function EjY(q, K, _, z) {
    let Y = q.toLowerCase().trim(),
        A = K.find((M) => M.name.toLowerCase() === Y) ?? _.find((M) => M.name.toLowerCase() === Y);
    if (A) return [A.name];
    if (Y.startsWith("mcp__") && Y.length > 5) {
        let M = K.filter((P) => P.name.toLowerCase().startsWith(Y)).slice(0, z).map((P) => P.name);
        if (M.length > 0) return M
    }
    let O = Y.split(/\s+/).filter((M) => M.length > 0),
        w = [],
        $ = [];
    for (let M of O)
        if (M.startsWith("+") && M.length > 1) w.push(M.slice(1));
        else $.push(M);
    let j = w.length > 0 ? [...w, ...$] : O,
        H = NjY(j),
        J = K;
    if (w.length > 0) J = (await Promise.all(K.map(async (P) => {
        let W = _vK(P),
            Z = (await fd8(P.name, _)).toLowerCase(),
            G = P.searchHint?.toLowerCase() ?? "";
        return w.every((v) => {
            let V = H.get(v);
            return W.parts.includes(v) || W.parts.some((k) => k.includes(v)) || V.test(Z) || G && V.test(G)
        }) ? P : null
    }))).filter((P) => P !== null);
    return (await Promise.all(J.map(async (M) => {
        let P = _vK(M),
            D = (await fd8(M.name, _)).toLowerCase(),
            Z = M.searchHint?.toLowerCase() ?? "",
            G = 0;
        for (let f of j) {
            let v = H.get(f);
            if (P.parts.includes(f)) G += P.isMcp ? 12 : 10;
            else if (P.parts.some((V) => V.includes(f))) G += P.isMcp ? 6 : 5;
            if (P.full.includes(f) && G === 0) G += 3;
            if (Z && v.test(Z)) G += 4;
            if (v.test(D)) G += 2
        }
        return {
            name: M.name,
            score: G
        }
    }))).filter((M) => M.score > 0).sort((M, P) => P.score - M.score).slice(0, z).map((M) => M.name)
}
// @from(Ln 389610, Col 4)
zvK
// @from(Ln 389610, Col 9)
YvK
// @from(Ln 389610, Col 14)
G37 = null
// @from(Ln 389611, Col 4)
fd8
// @from(Ln 389611, Col 9)
r58
// @from(Ln 389612, Col 4)
Gd8 = L(() => {
    U4();
    p7();
    C8();
    gq();
    K8();
    Ix();
    Kc();
    zvK = C6(() => y.object({
        query: y.string().describe('Query to find deferred tools. Use "select:<tool_name>" for direct selection, or keywords to search.'),
        max_results: y.number().optional().default(5).describe("Maximum number of results to return (default: 5)")
    })), YvK = C6(() => y.object({
        matches: y.array(y.string()),
        query: y.string(),
        total_deferred_tools: y.number(),
        pending_mcp_servers: y.array(y.string()).optional()
    }));
    fd8 = P1(async (q, K) => {
        let _ = rK(K, q);
        if (!_) return "";
        return _.prompt({
            getToolPermissionContext: async () => ({
                mode: "default",
                additionalWorkingDirectories: new Map,
                alwaysAllowRules: {},
                alwaysDenyRules: {},
                alwaysAskRules: {},
                isBypassPermissionsModeAvailable: !1
            }),
            tools: K,
            agents: []
        })
    }, (q) => q);
    r58 = Iq({
        isEnabled() {
            return GS()
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        name: Zj,
        maxResultSizeChars: 1e5,
        async description() {
            return lR8()
        },
        async prompt() {
            return lR8()
        },
        get inputSchema() {
            return zvK()
        },
        get outputSchema() {
            return YvK()
        },
        async call(q, {
            options: {
                tools: K
            },
            getAppState: _
        }) {
            let {
                query: z,
                max_results: Y = 5
            } = q, A = K.filter(nI);
            VjY(A);

            function O() {
                let J = _().mcp.clients.filter((X) => X.type === "pending");
                return J.length > 0 ? J.map((X) => X.name) : void 0
            }

            function w(H, J) {
                let X = _().mcp;
                d("tengu_tool_search_outcome", {
                    query: z,
                    queryType: J,
                    matchCount: H.length,
                    totalDeferredTools: A.length,
                    maxResults: Y,
                    hasMatches: H.length > 0,
                    mcpServersConfigured: X.clients.length,
                    mcpServersConnected: w7(X.clients, (M) => M.type === "connected"),
                    mcpServersPending: w7(X.clients, (M) => M.type === "pending"),
                    mcpToolsInPool: w7(K, (M) => !!M.mcpInfo)
                })
            }
            let $ = z.match(/^select:(.+)$/i);
            if ($) {
                let H = $[1].split(",").map((M) => M.trim()).filter(Boolean),
                    J = [],
                    X = [];
                for (let M of H) {
                    let P = rK(A, M) ?? rK(K, M);
                    if (P) {
                        if (!J.includes(P.name)) J.push(P.name)
                    } else X.push(M)
                }
                if (J.length === 0) {
                    E(`ToolSearchTool: select failed — none found: ${X.join(", ")}`), w([], "select");
                    let M = O();
                    return Zd8([], z, A.length, M)
                }
                if (X.length > 0) E(`ToolSearchTool: partial select — found: ${J.join(", ")}, missing: ${X.join(", ")}`);
                else E(`ToolSearchTool: selected ${J.join(", ")}`);
                return w(J, "select"), Zd8(J, z, A.length)
            }
            let j = await EjY(z, A, K, Y);
            if (E(`ToolSearchTool: keyword search for "${z}", found ${j.length} matches`), w(j, "keyword"), j.length === 0) {
                let H = O();
                return Zd8(j, z, A.length, H)
            }
            return Zd8(j, z, A.length)
        },
        renderToolUseMessage() {
            return null
        },
        userFacingName: () => "",
        mapToolResultToToolResultBlockParam(q, K) {
            if (q.matches.length === 0) {
                let _ = "No matching deferred tools found";
                if (q.pending_mcp_servers && q.pending_mcp_servers.length > 0) _ += `. Some MCP servers are still connecting: ${q.pending_mcp_servers.join(", ")}. Their tools will become available shortly — try searching again.`;
                return {
                    type: "tool_result",
                    tool_use_id: K,
                    content: _
                }
            }
            return {
                type: "tool_result",
                tool_use_id: K,
                content: q.matches.map((_) => ({
                    type: "tool_reference",
                    tool_name: _
                }))
            }
        }
    })
})
// @from(Ln 389754, Col 0)
function OvK() {
    if (process.env.CLAUDE_CODE_PLAN_V2_AGENT_COUNT) {
        let _ = parseInt(process.env.CLAUDE_CODE_PLAN_V2_AGENT_COUNT, 10);
        if (!isNaN(_) && _ > 0 && _ <= 10) return _
    }
    let q = MK(),
        K = tQ();
    if (q === "max" && K === "default_claude_max_20x") return 3;
    if (q === "enterprise" || q === "team") return 3;
    return 1
}
// @from(Ln 389766, Col 0)
function wvK() {
    if (process.env.CLAUDE_CODE_PLAN_V2_EXPLORE_AGENT_COUNT) {
        let q = parseInt(process.env.CLAUDE_CODE_PLAN_V2_EXPLORE_AGENT_COUNT, 10);
        if (!isNaN(q) && q > 0 && q <= 10) return q
    }
    return 3
}
// @from(Ln 389774, Col 0)
function Sj() {
    let q = process.env.CLAUDE_CODE_PLAN_MODE_INTERVIEW_PHASE;
    if (S6(q)) return !0;
    if (c5(q)) return !1;
    return u8("tengu_plan_mode_interview_phase", !1)
}
// @from(Ln 389781, Col 0)
function vd8() {
    let q = u8("tengu_pewter_ledger", null);
    if (q === "trim" || q === "cut" || q === "cap") return q;
    return null
}
// @from(Ln 389786, Col 4)
e96 = L(() => {
    B1();
    T7();
    Q8()
})
// @from(Ln 389792, Col 0)
function LjY() {
    let q = Sj() ? "" : yjY;
    return `Use this tool proactively when you're about to start a non-trivial implementation task. Getting user sign-off on your approach before writing code prevents wasted effort and ensures alignment. This tool transitions you into plan mode where you can explore the codebase and design an implementation approach for user approval.

## When to Use This Tool

**Prefer using EnterPlanMode** for implementation tasks unless they're simple. Use it when ANY of these conditions apply:

1. **New Feature Implementation**: Adding meaningful new functionality
   - Example: "Add a logout button" - where should it go? What should happen on click?
   - Example: "Add form validation" - what rules? What error messages?

2. **Multiple Valid Approaches**: The task can be solved in several different ways
   - Example: "Add caching to the API" - could use Redis, in-memory, file-based, etc.
   - Example: "Improve performance" - many optimization strategies possible

3. **Code Modifications**: Changes that affect existing behavior or structure
   - Example: "Update the login flow" - what exactly should change?
   - Example: "Refactor this component" - what's the target architecture?

4. **Architectural Decisions**: The task requires choosing between patterns or technologies
   - Example: "Add real-time updates" - WebSockets vs SSE vs polling
   - Example: "Implement state management" - Redux vs Context vs custom solution

5. **Multi-File Changes**: The task will likely touch more than 2-3 files
   - Example: "Refactor the authentication system"
   - Example: "Add a new API endpoint with tests"

6. **Unclear Requirements**: You need to explore before understanding the full scope
   - Example: "Make the app faster" - need to profile and identify bottlenecks
   - Example: "Fix the bug in checkout" - need to investigate root cause

7. **User Preferences Matter**: The implementation could reasonably go multiple ways
   - If you would use ${AO} to clarify the approach, use EnterPlanMode instead
   - Plan mode lets you explore first, then present options with context

## When NOT to Use This Tool

Only skip EnterPlanMode for simple tasks:
- Single-line or few-line fixes (typos, obvious bugs, small tweaks)
- Adding a single function with clear requirements
- Tasks where the user has given very specific, detailed instructions
- Pure research/exploration tasks (use the Agent tool with explore agent instead)

${q}## Examples

### GOOD - Use EnterPlanMode:
User: "Add user authentication to the app"
- Requires architectural decisions (session vs JWT, where to store tokens, middleware structure)

User: "Optimize the database queries"
- Multiple approaches possible, need to profile first, significant impact

User: "Implement dark mode"
- Architectural decision on theme system, affects many components

User: "Add a delete button to the user profile"
- Seems simple but involves: where to place it, confirmation dialog, API call, error handling, state updates

User: "Update the error handling in the API"
- Affects multiple files, user should approve the approach

### BAD - Don't use EnterPlanMode:
User: "Fix the typo in the README"
- Straightforward, no planning needed

User: "Add a console.log to debug this function"
- Simple, obvious implementation

User: "What files handle routing?"
- Research task, not implementation planning

## Important Notes

- This tool REQUIRES user approval - they must consent to entering plan mode
- If unsure whether to use it, err on the side of planning - it's better to get alignment upfront than to redo work
- Users appreciate being consulted before significant changes are made to their codebase
`
}
// @from(Ln 389872, Col 0)
function $vK() {
    return LjY()
}
// @from(Ln 389875, Col 4)
yjY
// @from(Ln 389876, Col 4)
jvK = L(() => {
    e96();
    cp();
    yjY = `## What Happens in Plan Mode

In plan mode, you'll:
1. Thoroughly explore the codebase using Glob, Grep, and Read tools
2. Understand existing patterns and architecture
3. Design an implementation approach
4. Present your plan to the user for approval
5. Use ${AO} if you need to clarify approaches
6. Exit plan mode with ExitPlanMode when ready to implement

`
})
// @from(Ln 389892, Col 0)
function HvK() {
    return null
}
// @from(Ln 389896, Col 0)
function JvK(q, K, _) {
    return J0.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, J0.createElement(u, {
        flexDirection: "row"
    }, J0.createElement(T, {
        color: LV("plan")
    }, $9), J0.createElement(T, null, " Entered plan mode")), J0.createElement(u, {
        paddingLeft: 2
    }, J0.createElement(T, {
        dimColor: !0
    }, "Claude is now exploring and designing an implementation approach.")))
}
// @from(Ln 389911, Col 0)
function XvK() {
    return J0.createElement(u, {
        flexDirection: "row",
        marginTop: 1
    }, J0.createElement(T, {
        color: LV("default")
    }, $9), J0.createElement(T, null, " User declined to enter plan mode"))
}
// @from(Ln 389919, Col 4)
J0
// @from(Ln 389920, Col 4)
MvK = L(() => {
    A3();
    OP();
    g6();
    J0 = K6(P6(), 1)
})
// @from(Ln 389926, Col 4)
RjY
// @from(Ln 389926, Col 9)
SjY
// @from(Ln 389926, Col 14)
o58
// @from(Ln 389927, Col 4)
v37 = L(() => {
    p7();
    y8();
    gq();
    MH();
    vX();
    e96();
    jvK();
    MvK();
    RjY = C6(() => y.strictObject({})), SjY = C6(() => y.object({
        message: y.string().describe("Confirmation that plan mode was entered")
    })), o58 = Iq({
        name: d56,
        searchHint: "switch to plan mode to design an approach before coding",
        maxResultSizeChars: 1e5,
        async description() {
            return "Requests permission to enter plan mode for complex tasks requiring exploration and design"
        },
        async prompt() {
            return $vK()
        },
        get inputSchema() {
            return RjY()
        },
        get outputSchema() {
            return SjY()
        },
        userFacingName() {
            return ""
        },
        shouldDefer: !0,
        isEnabled() {
            if (qj().length > 0) return !1;
            return !0
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        renderToolUseMessage: HvK,
        renderToolResultMessage: JvK,
        renderToolUseRejectedMessage: XvK,
        async call(q, K) {
            if (K.agentId) throw Error("EnterPlanMode tool cannot be used in agent contexts");
            let _ = K.getAppState();
            return bi(_.toolPermissionContext.mode, "plan"), K.setToolPermissionContext((z) => EY(zI6(z), {
                type: "setMode",
                mode: "plan",
                destination: "session"
            })), {
                data: {
                    message: "Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach."
                }
            }
        },
        mapToolResultToToolResultBlockParam({
            message: q
        }, K) {
            return {
                type: "tool_result",
                content: Sj() ? `${q}

DO NOT write or edit any files except the plan file. Detailed workflow instructions will follow.` : `${q}

In plan mode, you should:
1. Thoroughly explore the codebase to understand existing patterns
2. Identify similar features and architectural approaches
3. Consider multiple approaches and their trade-offs
4. Use AskUserQuestion if you need to clarify the approach
5. Design a concrete implementation strategy
6. When ready, use ExitPlanMode to present your plan for approval

Remember: DO NOT write or edit any files yet. This is a read-only exploration and planning phase.`,
                tool_use_id: K
            }
        }
    })
})
// @from(Ln 390008, Col 0)
function PvK() {
    return `Use this tool ONLY when explicitly instructed to work in a worktree — either by the user directly, or by project instructions (CLAUDE.md / memory). This tool creates an isolated git worktree and switches the current session into it.

## When to Use

- The user explicitly says "worktree" (e.g., "start a worktree", "work in a worktree", "create a worktree", "use a worktree")
- CLAUDE.md or memory instructions direct you to work in a worktree for the current task

## When NOT to Use

- The user asks to create a branch, switch branches, or work on a different branch — use git commands instead
- The user asks to fix a bug or work on a feature — use normal git workflow unless worktrees are explicitly requested by the user or project instructions
- Never use this tool unless "worktree" is explicitly mentioned by the user or in CLAUDE.md / memory instructions

## Requirements

- Must be in a git repository, OR have WorktreeCreate/WorktreeRemove hooks configured in settings.json
- Must not already be in a worktree

## Behavior

- In a git repository: creates a new git worktree inside \`.claude/worktrees/\` with a new branch based on HEAD
- Outside a git repository: delegates to WorktreeCreate/WorktreeRemove hooks for VCS-agnostic isolation
- Switches the session's working directory to the new worktree
- Use ExitWorktree to leave the worktree mid-session (keep or remove). On session exit, if still in the worktree, the user will be prompted to keep or remove it

## Entering an existing worktree

Pass \`path\` instead of \`name\` to switch the session into a worktree that already exists (e.g., one you just created with \`git worktree add\`). The path must appear in \`git worktree list\` for the current repository — paths that are not registered worktrees of this repo are rejected. ExitWorktree will not remove a worktree entered this way; use \`action: "keep"\` to return to the original directory.

## Parameters

- \`name\` (optional): A name for a new worktree. If neither \`name\` nor \`path\` is provided, a random name is generated.
- \`path\` (optional): Path to an existing worktree of the current repository to enter instead of creating one. Mutually exclusive with \`name\`.
`
}
// @from(Ln 390045, Col 0)
function WvK({
    name: q,
    path: K
}) {
    return K ?? q ?? ""
}
// @from(Ln 390052, Col 0)
function DvK(q, K, _) {
    return vS.createElement(_1, null, vS.createElement(u, {
        flexDirection: "column"
    }, vS.createElement(T, null, "Switched to worktree", q.worktreeBranch ? vS.createElement(T, null, " ", "on branch ", vS.createElement(T, {
        bold: !0
    }, q.worktreeBranch)) : null), vS.createElement(T, {
        dimColor: !0
    }, q.worktreePath)))
}
// @from(Ln 390061, Col 4)
vS
// @from(Ln 390062, Col 4)
ZvK = L(() => {
    GK();
    g6();
    vS = K6(P6(), 1)
})
// @from(Ln 390067, Col 4)
CjY
// @from(Ln 390067, Col 9)
bjY
// @from(Ln 390067, Col 14)
fvK
// @from(Ln 390068, Col 4)
GvK = L(() => {
    p7();
    y8();
    OR6();
    C8();
    gq();
    PM();
    n7();
    m8();
    pK();
    NJ();
    $G();
    g4();
    tD();
    ZvK();
    CjY = C6(() => y.strictObject({
        name: y.string().superRefine((q, K) => {
            try {
                YI6(q)
            } catch (_) {
                K.addIssue({
                    code: "custom",
                    message: b6(_)
                })
            }
        }).optional().describe('Optional name for a new worktree. Each "/"-separated segment may contain only letters, digits, dots, underscores, and dashes; max 64 chars total. A random name is generated if not provided. Mutually exclusive with `path`.'),
        path: y.string().optional().describe("Path to an existing worktree of the current repository to switch into instead of creating a new one. Must appear in `git worktree list` for the current repo. Mutually exclusive with `name`.")
    }).refine((q) => !(q.name && q.path), {
        message: "Provide at most one of `name` or `path`, not both."
    })), bjY = C6(() => y.object({
        worktreePath: y.string(),
        worktreeBranch: y.string().optional(),
        message: y.string()
    })), fvK = Iq({
        name: YI8,
        searchHint: "create an isolated git worktree and switch into it",
        maxResultSizeChars: 1e5,
        async description() {
            return "Creates an isolated worktree (via git or configured hooks) and switches the session into it"
        },
        async prompt() {
            return PvK()
        },
        get inputSchema() {
            return CjY()
        },
        get outputSchema() {
            return bjY()
        },
        userFacingName(q) {
            return q?.path ? "Entering worktree" : "Creating worktree"
        },
        shouldDefer: !0,
        toAutoClassifierInput(q) {
            return q.path ?? q.name ?? ""
        },
        async validateInput() {
            if (Sf6()) return {
                result: !1,
                message: `EnterWorktree cannot be called from a subagent with a cwd override (isolation: "worktree" or explicit cwd) — it would mutate the parent session's process-wide working directory. This agent is already isolated in its own working copy.`,
                errorCode: 1
            };
            if (sO()) return {
                result: !1,
                message: "Already in a worktree session. Use ExitWorktree to leave it before entering another.",
                errorCode: 2
            };
            return {
                result: !0
            }
        },
        renderToolUseMessage: WvK,
        renderToolResultMessage: DvK,
        async call(q) {
            if (sO()) throw Error("Already in a worktree session");
            let K;
            if (q.path) K = await T37(I8(), q.path);
            else {
                let Y = zj(b8());
                if (Y && Y !== b8()) process.chdir(Y), l$(Y);
                K = await a58(I8(), q.name ?? g56())
            }
            process.chdir(K.worktreePath), l$(K.worktreePath), dL(b8()), zL(K), nc(), Lk(), aO.cache.clear?.(), d(q.path ? "tengu_worktree_entered_existing" : "tengu_worktree_created", {
                mid_session: !0
            });
            let _ = K.worktreeBranch ? ` on branch ${K.worktreeBranch}` : "",
                z = q.path ? "Entered" : "Created";
            return {
                data: {
                    worktreePath: K.worktreePath,
                    worktreeBranch: K.worktreeBranch,
                    message: `${z} worktree at ${K.worktreePath}${_}. The session is now working in the worktree. Use ExitWorktree to leave mid-session, or exit the session to be prompted.`
                }
            }
        },
        mapToolResultToToolResultBlockParam({
            message: q
        }, K) {
            return {
                type: "tool_result",
                content: q,
                tool_use_id: K
            }
        }
    })
})
// @from(Ln 390175, Col 0)
function vvK() {
    return `Exit a worktree session created by EnterWorktree and return the session to the original working directory.

## Scope

This tool ONLY operates on worktrees created by EnterWorktree in this session. It will NOT touch:
- Worktrees you created manually with \`git worktree add\`
- Worktrees from a previous session (even if created by EnterWorktree then)
- The directory you're in if EnterWorktree was never called

If called outside an EnterWorktree session, the tool is a **no-op**: it reports that no worktree session is active and takes no action. Filesystem state is unchanged.

## When to Use

- The user explicitly asks to "exit the worktree", "leave the worktree", "go back", or otherwise end the worktree session
- Do NOT call this proactively — only when the user asks

## Parameters

- \`action\` (required): \`"keep"\` or \`"remove"\`
  - \`"keep"\` — leave the worktree directory and branch intact on disk. Use this if the user wants to come back to the work later, or if there are changes to preserve.
  - \`"remove"\` — delete the worktree directory and its branch. Use this for a clean exit when the work is done or abandoned.
- \`discard_changes\` (optional, default false): only meaningful with \`action: "remove"\`. If the worktree has uncommitted files or commits not on the original branch, the tool will REFUSE to remove it unless this is set to \`true\`. If the tool returns an error listing changes, confirm with the user before re-invoking with \`discard_changes: true\`.

## Behavior

- Restores the session's working directory to where it was before EnterWorktree
- Clears CWD-dependent caches (system prompt sections, memory files, plans directory) so the session state reflects the original directory
- If a tmux session was attached to the worktree: killed on \`remove\`, left running on \`keep\` (its name is returned so the user can reattach)
- Once exited, EnterWorktree can be called again to create a fresh worktree
`
}
// @from(Ln 390208, Col 0)
function TvK({
    action: q
}) {
    return q ?? ""
}
// @from(Ln 390214, Col 0)
function VvK(q, K, _) {
    let z = q.action === "keep" ? "Kept worktree" : "Removed worktree";
    return ST.createElement(_1, null, ST.createElement(u, {
        flexDirection: "column"
    }, ST.createElement(T, null, z, q.worktreeBranch ? ST.createElement(ST.Fragment, null, " ", "(branch ", ST.createElement(T, {
        bold: !0
    }, q.worktreeBranch), ")") : null), ST.createElement(T, {
        dimColor: !0
    }, "Returned to ", q.originalCwd)))
}
// @from(Ln 390224, Col 4)
ST
// @from(Ln 390225, Col 4)
kvK = L(() => {
    GK();
    g6();
    ST = K6(P6(), 1)
})
// @from(Ln 390230, Col 0)
async function NvK(q, K) {
    let _ = await w1("git", ["-C", q, "status", "--porcelain"]);
    if (_.code !== 0) return null;
    let z = w7(_.stdout.split(`
`), (O) => O.trim() !== "");
    if (!K) return null;
    let Y = await w1("git", ["-C", q, "rev-list", "--count", `${K}..HEAD`]);
    if (Y.code !== 0) return null;
    let A = parseInt(Y.stdout.trim(), 10) || 0;
    return {
        changedFiles: z,
        commits: A
    }
}
// @from(Ln 390245, Col 0)
function EvK(q, K) {
    if (l$(q), dL(q), K) pB6(q), KR6();
    zL(null), nc(), Lk(), aO.cache.clear?.()
}
// @from(Ln 390249, Col 4)
IjY
// @from(Ln 390249, Col 9)
xjY
// @from(Ln 390249, Col 14)
yvK
// @from(Ln 390250, Col 4)
LvK = L(() => {
    p7();
    y8();
    OR6();
    C8();
    gq();
    PM();
    n7();
    Q4();
    Bc();
    NJ();
    $G();
    g4();
    tD();
    kvK();
    IjY = C6(() => y.strictObject({
        action: y.enum(["keep", "remove"]).describe('"keep" leaves the worktree and branch on disk; "remove" deletes both.'),
        discard_changes: y.boolean().optional().describe('Required true when action is "remove" and the worktree has uncommitted files or unmerged commits. The tool will refuse and list them otherwise.')
    })), xjY = C6(() => y.object({
        action: y.enum(["keep", "remove"]),
        originalCwd: y.string(),
        worktreePath: y.string(),
        worktreeBranch: y.string().optional(),
        tmuxSessionName: y.string().optional(),
        discardedFiles: y.number().optional(),
        discardedCommits: y.number().optional(),
        message: y.string()
    }));
    yvK = Iq({
        name: AI8,
        searchHint: "exit a worktree session and return to the original directory",
        maxResultSizeChars: 1e5,
        async description() {
            return "Exits a worktree session created by EnterWorktree and restores the original working directory"
        },
        async prompt() {
            return vvK()
        },
        get inputSchema() {
            return IjY()
        },
        get outputSchema() {
            return xjY()
        },
        userFacingName() {
            return "Exiting worktree"
        },
        shouldDefer: !0,
        isDestructive(q) {
            return q.action === "remove"
        },
        toAutoClassifierInput(q) {
            return q.action
        },
        async validateInput(q) {
            if (Sf6()) return {
                result: !1,
                message: 'ExitWorktree cannot be called from a subagent with a cwd override (isolation: "worktree" or explicit cwd) — it would mutate the parent session\'s process-wide working directory. This agent is already isolated; use Bash with `cd` for directory changes within it.',
                errorCode: 5
            };
            let K = sO();
            if (!K) return {
                result: !1,
                message: "No-op: there is no active EnterWorktree session to exit. This tool only operates on worktrees created by EnterWorktree in the current session — it will not touch worktrees created manually or in a previous session. No filesystem changes were made.",
                errorCode: 1
            };
            if (q.action === "remove" && K.enteredExisting) return {
                result: !1,
                message: `This session entered an existing worktree (${K.worktreePath}); it was not created by EnterWorktree, so this tool will not remove it. Use action: "keep" to return to ${K.originalCwd}, then remove the worktree manually with \`git worktree remove\` if desired.`,
                errorCode: 4
            };
            if (q.action === "remove" && !q.discard_changes) {
                let _ = await NvK(K.worktreePath, K.originalHeadCommit);
                if (_ === null) return {
                    result: !1,
                    message: `Could not verify worktree state at ${K.worktreePath}. Refusing to remove without explicit confirmation. Re-invoke with discard_changes: true to proceed — or use action: "keep" to preserve the worktree.`,
                    errorCode: 3
                };
                let {
                    changedFiles: z,
                    commits: Y
                } = _;
                if (z > 0 || Y > 0) {
                    let A = [];
                    if (z > 0) A.push(`${z} uncommitted ${z===1?"file":"files"}`);
                    if (Y > 0) A.push(`${Y} ${Y===1?"commit":"commits"} on ${K.worktreeBranch??"the worktree branch"}`);
                    return {
                        result: !1,
                        message: `Worktree has ${A.join(" and ")}. Removing will discard this work permanently. Confirm with the user, then re-invoke with discard_changes: true — or use action: "keep" to preserve the worktree.`,
                        errorCode: 2
                    }
                }
            }
            return {
                result: !0
            }
        },
        renderToolUseMessage: TvK,
        renderToolResultMessage: VvK,
        async call(q) {
            let K = sO();
            if (!K) throw Error("Not in a worktree session");
            let {
                originalCwd: _,
                worktreePath: z,
                worktreeBranch: Y,
                tmuxSessionName: A,
                originalHeadCommit: O
            } = K, w = c9() === Y7(), {
                changedFiles: $,
                commits: j
            } = await NvK(z, O) ?? {
                changedFiles: 0,
                commits: 0
            };
            if (q.action === "keep") {
                await hM6(), EvK(_, w), d("tengu_worktree_kept", {
                    mid_session: !0,
                    commits: j,
                    changed_files: $
                });
                let X = A ? ` Tmux session ${A} is still running; reattach with: tmux attach -t ${A}` : "";
                return {
                    data: {
                        action: "keep",
                        originalCwd: _,
                        worktreePath: z,
                        worktreeBranch: Y,
                        tmuxSessionName: A,
                        message: `Exited worktree. Your work is preserved at ${z}${Y?` on branch ${Y}`:""}. Session is now back in ${_}.${X}`
                    }
                }
            }
            if (A) await AI6(A);
            await OI6(), EvK(_, w), d("tengu_worktree_removed", {
                source: "exit_tool",
                mid_session: !0,
                commits: j,
                changed_files: $
            });
            let H = [];
            if (j > 0) H.push(`${j} ${j===1?"commit":"commits"}`);
            if ($ > 0) H.push(`${$} uncommitted ${$===1?"file":"files"}`);
            let J = H.length > 0 ? ` Discarded ${H.join(" and ")}.` : "";
            return {
                data: {
                    action: "remove",
                    originalCwd: _,
                    worktreePath: z,
                    worktreeBranch: Y,
                    discardedFiles: $,
                    discardedCommits: j,
                    message: `Exited and removed worktree at ${z}.${J} Session is now back in ${_}.`
                }
            }
        },
        mapToolResultToToolResultBlockParam({
            message: q
        }, K) {
            return {
                type: "tool_result",
                content: q,
                tool_use_id: K
            }
        }
    })
})
// @from(Ln 390417, Col 4)
hvK = "Config"
// @from(Ln 390419, Col 0)
function Td8(q = !1) {
    if (i7()) return {
        value: null,
        label: "Default (recommended)",
        description: uT6(q)
    };
    let K = !KA();
    return {
        value: null,
        label: K ? "Default" : "Default (recommended)",
        description: `Use the default model (currently ${Hn6(hv())})${K?"":` · ${Yf(GQ)}`}`
    }
}
// @from(Ln 390433, Col 0)
function ujY() {
    let q = !KA(),
        K = process.env.ANTHROPIC_DEFAULT_SONNET_MODEL;
    if (q && K) {
        let _ = DP(K);
        return {
            value: "sonnet",
            label: process.env.ANTHROPIC_DEFAULT_SONNET_MODEL_NAME ?? K,
            description: process.env.ANTHROPIC_DEFAULT_SONNET_MODEL_DESCRIPTION ?? `Custom Sonnet model${_?" (1M context)":""}`,
            descriptionForModel: `${process.env.ANTHROPIC_DEFAULT_SONNET_MODEL_DESCRIPTION??`Custom Sonnet model${_?" with 1M context":""}`} (${K})`
        }
    }
}
// @from(Ln 390447, Col 0)
function mjY() {
    let q = !KA();
    return {
        value: q ? ZO().sonnet46 : "sonnet",
        label: "Sonnet",
        description: `Sonnet 4.6 · Best for everyday tasks${q?"":` · ${Yf(GQ)}`}`,
        descriptionForModel: "Sonnet 4.6 - best for everyday tasks. Generally recommended for most coding tasks"
    }
}
// @from(Ln 390457, Col 0)
function BjY() {
    let q = !KA(),
        K = process.env.ANTHROPIC_DEFAULT_OPUS_MODEL;
    if (q && K) {
        let _ = DP(K);
        return {
            value: "opus",
            label: process.env.ANTHROPIC_DEFAULT_OPUS_MODEL_NAME ?? K,
            description: process.env.ANTHROPIC_DEFAULT_OPUS_MODEL_DESCRIPTION ?? `Custom Opus model${_?" (1M context)":""}`,
            descriptionForModel: `${process.env.ANTHROPIC_DEFAULT_OPUS_MODEL_DESCRIPTION??`Custom Opus model${_?" with 1M context":""}`} (${K})`
        }
    }
}
// @from(Ln 390471, Col 0)
function pjY() {
    return {
        value: "opus",
        label: "Opus 4.1",
        description: "Opus 4.1 · Legacy",
        descriptionForModel: "Opus 4.1 - legacy version"
    }
}
// @from(Ln 390480, Col 0)
function uvK(q = !1, K = !0) {
    return {
        value: !KA() ? ZO().opus46 : "claude-opus-4-6",
        label: "Opus 4.6",
        description: `Opus 4.6 · Most capable for complex work${K?QZ8(q):""}`,
        descriptionForModel: "Opus 4.6 - most capable for complex work"
    }
}
// @from(Ln 390489, Col 0)
function RvK() {
    let q = !KA();
    return {
        value: q ? ZO().opus47 : "opus",
        label: "Opus",
        description: `Opus 4.7 · Most capable for complex work${q?"":` · ${Yf(jB)}`}`,
        descriptionForModel: "Opus 4.7 - most capable for complex work"
    }
}
// @from(Ln 390499, Col 0)
function SvK() {
    let q = !KA();
    return {
        value: q ? ZO().sonnet46 + "[1m]" : "sonnet[1m]",
        label: "Sonnet (1M context)",
        description: `Sonnet 4.6 for long sessions${q?"":` · ${Yf(GQ)}`}`,
        descriptionForModel: "Sonnet 4.6 with 1M context window - for long sessions with large codebases"
    }
}
// @from(Ln 390509, Col 0)
function mvK(q = !1, K = !0) {
    return {
        value: !KA() ? ZO().opus46 + "[1m]" : "claude-opus-4-6[1m]",
        label: "Opus 4.6 (1M context)",
        description: `Opus 4.6 for long sessions${K?QZ8(q):""}`,
        descriptionForModel: "Opus 4.6 with 1M context window - for long sessions with large codebases"
    }
}
// @from(Ln 390518, Col 0)
function CvK() {
    let q = !KA();
    return {
        value: q ? ZO().opus47 + "[1m]" : "opus[1m]",
        label: "Opus (1M context)",
        description: `Opus 4.7 for long sessions${q?"":` · ${Yf(jB)}`}`,
        descriptionForModel: "Opus 4.7 with 1M context window - for long sessions with large codebases"
    }
}
// @from(Ln 390528, Col 0)
function FjY() {
    let q = !KA(),
        K = process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL;
    if (q && K) return {
        value: "haiku",
        label: process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL_NAME ?? K,
        description: process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL_DESCRIPTION ?? "Custom Haiku model",
        descriptionForModel: `${process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL_DESCRIPTION??"Custom Haiku model"} (${K})`
    }
}
// @from(Ln 390539, Col 0)
function BvK() {
    return {
        value: "haiku",
        label: "Haiku",
        description: `Haiku 4.5 · Fastest for quick answers${!KA()?"":` · ${Yf(_T1)}`}`,
        descriptionForModel: "Haiku 4.5 - fastest for quick answers. Lower cost but less capable than Sonnet 4.6."
    }
}
// @from(Ln 390548, Col 0)
function gjY() {
    return {
        value: "haiku",
        label: "Haiku",
        description: `Haiku 3.5 for simple tasks${!KA()?"":` · ${Yf(KT1)}`}`,
        descriptionForModel: "Haiku 3.5 - faster and lower cost, but less capable than Sonnet. Use for simple tasks."
    }
}
// @from(Ln 390557, Col 0)
function UjY() {
    return xT6() === ZO().haiku45 ? BvK() : gjY()
}
// @from(Ln 390561, Col 0)
function k37() {
    if (MK() === "pro" && u8("tengu_gypsum_kite", !1)) return " · ~2× usage vs Sonnet";
    return ""
}
// @from(Ln 390566, Col 0)
function pvK(q = !1) {
    let K = !KA();
    return {
        value: "opus",
        label: "Opus",
        description: `Opus 4.7 · Most capable for complex work${k37()}${K||!q?"":` · ${Yf(jB)}`}`
    }
}
// @from(Ln 390575, Col 0)
function bvK() {
    let q = !KA(),
        K = i7() ? " · Billed as extra usage" : "";
    return {
        value: "sonnet[1m]",
        label: "Sonnet (1M context)",
        description: `Sonnet 4.6 with 1M context${K}${!(K!==""&&!q)?"":` · ${Yf(GQ)}`}`
    }
}
// @from(Ln 390585, Col 0)
function IvK() {
    let q = !KA(),
        K = i7() ? " · Billed as extra usage" : "",
        _ = K !== "" && !q;
    return {
        value: "opus[1m]",
        label: "Opus (1M context)",
        description: `Opus 4.7 with 1M context${k37()}${K}${!_?"":` · ${Yf(jB)}`}`
    }
}
// @from(Ln 390596, Col 0)
function V37(q = !1) {
    let K = !KA();
    return {
        value: K ? ZO().opus47 + "[1m]" : "opus[1m]",
        label: "Opus (1M context)",
        description: `Opus 4.7 with 1M context · Most capable for complex work${k37()}${K||!q?"":` · ${Yf(jB)}`}`,
        descriptionForModel: "Opus 4.7 with 1M context - most capable for complex work"
    }
}
// @from(Ln 390606, Col 0)
function djY() {
    return {
        value: "opusplan",
        label: "Opus Plan Mode",
        description: "Use Opus in plan mode, Sonnet otherwise"
    }
}
// @from(Ln 390614, Col 0)
function cjY(q = !1) {
    if (i7()) {
        if (ch() || Yq6()) {
            let O = [Td8(q)];
            if (!YX() && Ql()) O.push(IvK());
            if (O.push(QjY), rt()) O.push(bvK());
            return O.push(xvK), O
        }
        let A = [Td8(q)];
        if (rt()) A.push(bvK());
        if (YX()) A.push(V37(!1));
        else if (A.push(pvK(!1)), Ql()) A.push(IvK());
        return A.push(xvK), A
    }
    if (KA()) {
        let A = [Td8(q)];
        if (rt()) A.push(SvK());
        if (YX()) A.push(V37(!0));
        else if (A.push(RvK()), Ql()) A.push(CvK());
        return A.push(BvK()), A
    }
    let K = [Td8(q)],
        _ = ujY();
    if (_ !== void 0) K.push(_);
    else if (K.push(mjY()), rt()) K.push(SvK());
    let z = BjY();
    if (z !== void 0) K.push(z);
    else {
        if (K.push(pjY()), K.push(RvK()), Ql()) K.push(CvK());
        if (K.push(uvK(q, !1)), Ql()) K.push(mvK(q))
    }
    let Y = FjY();
    if (Y !== void 0) K.push(Y);
    else K.push(UjY());
    return K
}
// @from(Ln 390651, Col 0)
function ljY(q) {
    let K = o5(q);
    if (K.includes("claude-sonnet-4-6") || K.includes("claude-sonnet-4-5") || K.includes("claude-sonnet-4-") || K.includes("claude-3-7-sonnet") || K.includes("claude-3-5-sonnet")) {
        let _ = xW(Af());
        if (_) return {
            alias: "Sonnet",
            currentVersionName: _
        }
    }
    if (K.includes("claude-opus-4")) {
        let _ = xW(LE());
        if (_) return {
            alias: "Opus",
            currentVersionName: _
        }
    }
    if (K.includes("claude-haiku") || K.includes("claude-3-5-haiku")) {
        let _ = xW(xT6());
        if (_) return {
            alias: "Haiku",
            currentVersionName: _
        }
    }
    return null
}
// @from(Ln 390677, Col 0)
function njY(q) {
    let K = xW(q);
    if (!K) return null;
    let _ = ljY(q);
    if (!_) return {
        value: q,
        label: K,
        description: q
    };
    if (K !== _.currentVersionName) return {
        value: q,
        label: K,
        description: `Newer version available · select ${_.alias} for ${_.currentVersionName}`
    };
    return {
        value: q,
        label: K,
        description: q
    }
}
// @from(Ln 390698, Col 0)
function q_6(q = !1) {
    let K = cjY(q),
        _ = process.env.ANTHROPIC_CUSTOM_MODEL_OPTION;
    if (_ && !K.some((w) => w.value === _)) K.push({
        value: _,
        label: process.env.ANTHROPIC_CUSTOM_MODEL_OPTION_NAME ?? _,
        description: process.env.ANTHROPIC_CUSTOM_MODEL_OPTION_DESCRIPTION ?? `Custom model (${_})`
    });
    for (let w of H8().additionalModelOptionsCache ?? [])
        if (!K.some(($) => $.value === w.value)) K.push(w);
    let {
        availableModels: z
    } = y7() ?? {};
    if (z)
        for (let w of z) {
            let $ = w.trim();
            if (!$.startsWith("anthropic.") || K.some((j) => j.value === $)) continue;
            K.push({
                value: $,
                label: $,
                description: "Custom model"
            })
        }
    let Y = null,
        A = Ub(),
        O = cB6();
    if (A !== void 0 && A !== null) Y = A;
    else if (O !== null) Y = O;
    if (Y === null || K.some((w) => w.value === Y)) return RM6(K);
    else if (Y === "opusplan") return RM6([...K, djY()]);
    else if (Y === "opus" && KA()) return RM6([...K, pvK(!1)]);
    else if (Y === "opus[1m]" && KA()) return RM6([...K, V37(!1)]);
    else if (Y === "claude-opus-4-6" && KA()) return RM6([...K, uvK(q, !1)]);
    else if (Y === "claude-opus-4-6[1m]" && KA()) return RM6([...K, mvK(q, !1)]);
    else {
        let w = njY(Y);
        if (w) K.push(w);
        else K.push({
            value: Y,
            label: Y,
            description: "Custom model"
        });
        return RM6(K)
    }
}
// @from(Ln 390744, Col 0)
function RM6(q) {
    if (!(y7() || {}).availableModels) return q;
    return q.filter((_) => _.value === null || _.value !== null && Kq6(_.value))
}
// @from(Ln 390748, Col 4)
QjY
// @from(Ln 390748, Col 9)
xvK
// @from(Ln 390749, Col 4)
s58 = L(() => {
    y8();
    B1();
    T7();
    jQ();
    fo();
    a1();
    bg8();
    x9();
    jn6();
    Sq();
    AJ();
    h1();
    QjY = {
        value: "sonnet",
        label: "Sonnet",
        description: "Sonnet 4.6 · Best for everyday tasks"
    }, xvK = {
        value: "haiku",
        label: "Haiku",
        description: "Haiku 4.5 · Fastest for quick answers"
    }
})
// @from(Ln 390772, Col 4)
N37 = {}
// @from(Ln 390779, Col 0)
function K_6() {
    return !u8("tengu_amber_quartz_disabled", !1)
}
// @from(Ln 390783, Col 0)
function Vd8() {
    if (!jX()) return !1;
    let q = o7();
    return Boolean(q?.accessToken)
}
// @from(Ln 390789, Col 0)
function SM6() {
    return Vd8() && K_6()
}
// @from(Ln 390792, Col 4)
__6 = L(() => {
    B1();
    T7()
})
// @from(Ln 390796, Col 0)
async function wI6(q) {
    let K = q.trim();
    if (!K) return {
        valid: !1,
        error: "Model name cannot be empty"
    };
    if (!Kq6(K)) return {
        valid: !1,
        error: `Model '${K}' is not in the list of available models`
    };
    let _ = K.toLowerCase();
    if (Yw6.includes(_)) return {
        valid: !0
    };
    if (K === process.env.ANTHROPIC_CUSTOM_MODEL_OPTION) return {
        valid: !0
    };
    if (FvK.has(K)) return {
        valid: !0
    };
    try {
        return await dR({
            model: K,
            max_tokens: 1,
            maxRetries: 0,
            querySource: "model_validation",
            messages: [{
                role: "user",
                content: [{
                    type: "text",
                    text: "Hi",
                    cache_control: {
                        type: "ephemeral"
                    }
                }]
            }]
        }), FvK.set(K, !0), {
            valid: !0
        }
    } catch (z) {
        return ijY(z, K)
    }
}
// @from(Ln 390840, Col 0)
function ijY(q, K) {
    if (q instanceof fY6) {
        let z = rjY(K),
            Y = z ? `. Try '${z}' instead` : "";
        return {
            valid: !1,
            error: `Model '${K}' not found${Y}`
        }
    }
    if (q instanceof vq) {
        if (q instanceof ZY6) return {
            valid: !1,
            error: "Authentication failed. Please check your API credentials."
        };
        if (q instanceof bZ) return {
            valid: !1,
            error: "Network error. Please check your internet connection."
        };
        let z = q.error;
        if (z && typeof z === "object" && "type" in z && z.type === "not_found_error" && "message" in z && typeof z.message === "string" && z.message.includes("model:")) return {
            valid: !1,
            error: `Model '${K}' not found`
        };
        return {
            valid: !1,
            error: `API error: ${q.message}`
        }
    }
    return {
        valid: !1,
        error: `Unable to validate model: ${q instanceof Error?q.message:String(q)}`
    }
}
// @from(Ln 390874, Col 0)
function rjY(q) {
    if (KA()) return;
    let K = q.toLowerCase();
    if (K.includes("opus-4-7") || K.includes("opus_4_7")) return ZO().opus41;
    if (K.includes("opus-4-6") || K.includes("opus_4_6")) return ZO().opus41;
    if (K.includes("opus-4-5") || K.includes("opus_4_5")) return ZO().opus41;
    if (K.includes("sonnet-4-6") || K.includes("sonnet_4_6")) return ZO().sonnet45;
    if (K.includes("sonnet-4-5") || K.includes("sonnet_4_5")) return ZO().sonnet40;
    return
}
// @from(Ln 390884, Col 4)
FvK
// @from(Ln 390885, Col 4)
kd8 = L(() => {
    IT6();
    jn6();
    x9();
    tH6();
    eG();
    jQ();
    FvK = new Map
})
// @from(Ln 390895, Col 0)
function gvK(q) {
    return q in $I6
}
// @from(Ln 390899, Col 0)
function UvK(q) {
    return $I6[q]
}
// @from(Ln 390903, Col 0)
function Nd8(q) {
    let K = $I6[q];
    if (!K) return;
    if (K.options) return [...K.options];
    if (K.getOptions) return K.getOptions();
    return
}
// @from(Ln 390911, Col 0)
function QvK(q) {
    return $I6[q]?.path ?? q.split(".")
}
// @from(Ln 390914, Col 4)
$I6
// @from(Ln 390915, Col 4)
y37 = L(() => {
    h1();
    $b1();
    s58();
    kd8();
    tB();
    $I6 = {
        theme: {
            source: "global",
            type: "string",
            description: "Color theme for the UI",
            options: ZY4
        },
        editorMode: {
            source: "global",
            type: "string",
            description: "Key binding mode",
            options: Ck8
        },
        verbose: {
            source: "global",
            type: "boolean",
            description: "Show detailed debug output",
            appStateKey: "verbose"
        },
        preferredNotifChannel: {
            source: "global",
            type: "string",
            description: "Preferred notification channel",
            options: Sk8
        },
        autoCompactEnabled: {
            source: "global",
            type: "boolean",
            description: "Auto-compact when context is full"
        },
        autoScrollEnabled: {
            source: "global",
            type: "boolean",
            description: "Auto-scroll conversation to bottom (fullscreen mode only)"
        },
        autoMemoryEnabled: {
            source: "settings",
            type: "boolean",
            description: "Enable auto-memory"
        },
        autoDreamEnabled: {
            source: "settings",
            type: "boolean",
            description: "Enable background memory consolidation"
        },
        fileCheckpointingEnabled: {
            source: "global",
            type: "boolean",
            description: "Enable file checkpointing for code rewind"
        },
        showTurnDuration: {
            source: "global",
            type: "boolean",
            description: 'Show turn duration message after responses (e.g., "Cooked for 1m 6s")'
        },
        terminalProgressBarEnabled: {
            source: "global",
            type: "boolean",
            description: "Show OSC 9;4 progress indicator in supported terminals"
        },
        todoFeatureEnabled: {
            source: "global",
            type: "boolean",
            description: "Enable todo/task tracking"
        },
        model: {
            source: "settings",
            type: "string",
            description: "Override the default model",
            appStateKey: "mainLoopModel",
            getOptions: () => {
                try {
                    return q_6().filter((q) => q.value !== null).map((q) => q.value)
                } catch {
                    return ["sonnet", "opus", "haiku"]
                }
            },
            validateOnWrite: (q) => wI6(String(q)),
            formatOnRead: (q) => q === null ? "default" : q
        },
        alwaysThinkingEnabled: {
            source: "settings",
            type: "boolean",
            description: "Enable extended thinking (false to disable)",
            appStateKey: "thinkingEnabled"
        },
        "permissions.defaultMode": {
            source: "settings",
            type: "string",
            description: "Default permission mode for tool usage",
            options: ["default", "plan", "acceptEdits", "dontAsk", "auto"]
        },
        language: {
            source: "settings",
            type: "string",
            description: 'Preferred language for Claude responses and voice dictation (e.g., "japanese", "spanish")'
        },
        teammateMode: {
            source: "global",
            type: "string",
            description: 'How to spawn teammates: "tmux" for traditional tmux, "in-process" for same process, "auto" to choose automatically',
            options: Nq4
        },
        tui: {
            source: "settings",
            type: "string",
            description: 'Terminal UI renderer: "fullscreen" for flicker-free alt-screen rendering, "default" for the classic renderer',
            options: ["default", "fullscreen"]
        },
        ...!1,
        ...{
            voiceEnabled: {
                source: "settings",
                type: "boolean",
                description: "Enable voice dictation (hold-to-talk)"
            }
        },
        remoteControlAtStartup: {
            source: "global",
            type: "boolean",
            description: "Enable Remote Control for all sessions (true | false | default)",
            formatOnRead: () => zd()
        },
        ...{
            inputNeededNotifEnabled: {
                source: "global",
                type: "boolean",
                description: "Push to your mobile device when a permission prompt or question is waiting (requires Remote Control)"
            },
            agentPushNotifEnabled: {
                source: "global",
                type: "boolean",
                description: "Allow Claude to push to your mobile device when it deems it appropriate (requires Remote Control)"
            }
        }
    }
})
// @from(Ln 391059, Col 0)
function cvK() {
    let q = [],
        K = [];
    for (let [z, Y] of Object.entries($I6)) {
        if (z === "model") continue;
        if (z === "voiceEnabled" && !K_6()) continue;
        let A = Nd8(z),
            O = `- ${z}`;
        if (A) O += `: ${A.map((w)=>`"${w}"`).join(", ")}`;
        else if (Y.type === "boolean") O += ": true/false";
        if (O += ` - ${Y.description}`, Y.source === "global") q.push(O);
        else K.push(O)
    }
    let _ = ojY();
    return `Get or set Claude Code configuration settings.

  View or change Claude Code settings. Use when the user requests configuration changes, asks about current settings, or when adjusting a setting would benefit them.


## Usage
- **Get current value:** Omit the "value" parameter
- **Set new value:** Include the "value" parameter

## Configurable settings list
The following settings are available for you to change:

### Global Settings (stored in ~/.claude.json)
${q.join(`
`)}

### Project Settings (stored in settings.json)
${K.join(`
`)}

${_}
## Examples
- Get theme: { "setting": "theme" }
- Set dark theme: { "setting": "theme", "value": "dark" }
- Enable vim mode: { "setting": "editorMode", "value": "vim" }
- Enable verbose: { "setting": "verbose", "value": true }
- Change model: { "setting": "model", "value": "opus" }
- Change permission mode: { "setting": "permissions.defaultMode", "value": "plan" }
`
}
// @from(Ln 391104, Col 0)
function ojY() {
    try {
        return `## Model
- model - Override the default model. Available options:
${q_6().map((_)=>{return`  - ${_.value===null?'null/"default"':`"${_.value}"`}: ${_.descriptionForModel??_.description}`}).join(`
        `)}`
    } catch {
        return `## Model
- model - Override the default model (sonnet, opus, haiku, best, or full model ID)`
    }
}
// @from(Ln 391115, Col 4)
dvK = "Get or set Claude Code configuration settings."
// @from(Ln 391116, Col 4)
lvK = L(() => {
    s58();
    __6();
    y37()
})
// @from(Ln 391122, Col 0)
function nvK(q) {
    if (!q.setting) return null;
    if (q.value === void 0) return TS.default.createElement(T, {
        dimColor: !0
    }, "Getting ", q.setting);
    return TS.default.createElement(T, {
        dimColor: !0
    }, "Setting ", q.setting, " to ", I6(q.value))
}
// @from(Ln 391132, Col 0)
function ivK(q) {
    if (!q.success) return TS.default.createElement(_1, null, TS.default.createElement(T, {
        color: "error"
    }, "Failed: ", q.error));
    if (q.operation === "get") return TS.default.createElement(_1, null, TS.default.createElement(T, null, TS.default.createElement(T, {
        bold: !0
    }, q.setting), " = ", I6(q.value)));
    return TS.default.createElement(_1, null, TS.default.createElement(T, null, "Set ", TS.default.createElement(T, {
        bold: !0
    }, q.setting), " to", " ", TS.default.createElement(T, {
        bold: !0
    }, I6(q.newValue))))
}
// @from(Ln 391146, Col 0)
function rvK() {
    return TS.default.createElement(T, {
        color: "warning"
    }, "Config change rejected")
}
// @from(Ln 391151, Col 4)
TS
// @from(Ln 391152, Col 4)
ovK = L(() => {
    GK();
    g6();
    e8();
    TS = K6(P6(), 1)
})
// @from(Ln 391158, Col 4)
R37 = {}
// @from(Ln 391165, Col 0)
function h37() {
    if (!jX()) return !1;
    let q = o7();
    return q !== null && q.accessToken !== null
}
// @from(Ln 391170, Col 0)
async function Ed8(q, K) {
    await _Y();
    let _ = o7();
    if (!_?.accessToken) return E("[voice_stream] No OAuth token available"), null;
    let z = process.env.VOICE_STREAM_BASE_URL || r7().BASE_API_URL.replace("https://", "wss://").replace("http://", "ws://");
    if (process.env.VOICE_STREAM_BASE_URL) E(`[voice_stream] Using VOICE_STREAM_BASE_URL override: ${process.env.VOICE_STREAM_BASE_URL}`);
    let Y = new URLSearchParams({
        encoding: "linear16",
        sample_rate: "16000",
        channels: "1",
        endpointing_ms: "300",
        utterance_end_ms: "1000",
        language: K?.language ?? "en",
        use_conversation_engine: "true",
        stt_provider: "deepgram-nova3"
    });
    if (K?.keyterms?.length)
        for (let f of K.keyterms) Y.append("keyterms", f);
    let A = `${z}${sjY}?${Y.toString()}`;
    E(`[voice_stream] Connecting to ${A}`);
    let O = {
            Authorization: `Bearer ${_.accessToken}`,
            "User-Agent": OI(),
            "x-app": "cli"
        },
        w = OE(),
        $ = typeof Bun < "u" ? {
            headers: O,
            proxy: Tb(A),
            tls: w || void 0
        } : {
            headers: O,
            agent: vb(A),
            ...w
        },
        j = new xZ(A, $),
        H = null,
        J = !1,
        X = !1,
        M = !1,
        P = !1,
        W = null,
        D = null,
        Z = {
            send(f) {
                if (j.readyState !== xZ.OPEN) return;
                if (X) {
                    E(`[voice_stream] Dropping audio chunk after CloseStream: ${String(f.length)} bytes`);
                    return
                }
                E(`[voice_stream] Sending audio chunk: ${String(f.length)} bytes`), j.send(Buffer.from(f))
            },
            finalize() {
                if (M || X) return Promise.resolve("ws_already_closed");
                return M = !0, new Promise((f) => {
                    let v = setTimeout(() => W?.("safety_timeout"), L37.safety),
                        V = setTimeout(() => W?.("no_data_timeout"), L37.noData);
                    if (D = () => {
                            clearTimeout(V), D = null
                        }, W = (k) => {
                            if (clearTimeout(v), clearTimeout(V), W = null, D = null, G) {
                                E(`[voice_stream] Promoting unreported interim before ${k} resolve`);
                                let N = G;
                                G = "", q.onTranscript(N, !0)
                            }
                            E(`[voice_stream] Finalize resolved via ${k}`), f(k)
                        }, j.readyState === xZ.CLOSED || j.readyState === xZ.CLOSING) {
                        W("ws_already_closed");
                        return
                    }
                    setTimeout(() => {
                        if (X = !0, j.readyState === xZ.OPEN) E("[voice_stream] Sending CloseStream (finalize)"), j.send(ajY)
                    }, 0)
                })
            },
            close() {
                if (X = !0, H) clearInterval(H), H = null;
                if (J = !1, j.readyState === xZ.OPEN) j.close()
            },
            isConnected() {
                return J && j.readyState === xZ.OPEN
            }
        };
    j.on("open", () => {
        E("[voice_stream] WebSocket connected"), J = !0, E("[voice_stream] Sending initial KeepAlive"), j.send(avK), H = setInterval((f) => {
            if (f.readyState === xZ.OPEN) E("[voice_stream] Sending periodic KeepAlive"), f.send(avK)
        }, tjY, j), q.onReady(Z)
    });
    let G = "";
    return j.on("message", (f) => {
        let v = f.toString();
        E(`[voice_stream] Message received (${String(v.length)} chars): ${v.slice(0,200)}`);
        let V;
        try {
            V = n8(v)
        } catch {
            return
        }
        switch (V.type) {
            case "TranscriptText": {
                let k = V.data;
                if (E(`[voice_stream] TranscriptText: "${k??""}"`), X) D?.();
                if (k) G = k, q.onTranscript(k, !1);
                break
            }
            case "TranscriptEndpoint": {
                E(`[voice_stream] TranscriptEndpoint received, lastTranscriptText="${G}"`);
                let k = G;
                if (G = "", k) q.onTranscript(k, !0);
                if (X) W?.("post_closestream_endpoint");
                break
            }
            case "TranscriptError": {
                let k = V.description ?? V.error_code ?? "unknown transcription error";
                if (E(`[voice_stream] TranscriptError: ${k}`), !M) q.onError(k);
                break
            }
            case "error": {
                let k = V.message ?? I6(V);
                if (E(`[voice_stream] Server error: ${k}`), !M) q.onError(k);
                break
            }
            default:
                break
        }
    }), j.on("close", (f, v) => {
        let V = v?.toString() ?? "";
        if (E(`[voice_stream] WebSocket closed: code=${String(f)} reason="${V}"`), J = !1, H) clearInterval(H), H = null;
        if (G) {
            E("[voice_stream] Promoting unreported interim transcript to final on close");
            let k = G;
            G = "", q.onTranscript(k, !0)
        }
        if (W?.("ws_close"), !M && !P && f !== 1000 && f !== 1005) q.onError(`Connection closed: code ${String(f)}${V?` — ${V}`:""}`);
        q.onClose()
    }), j.on("unexpected-response", (f, v) => {
        let V = v.statusCode ?? 0;
        if (V === 101) {
            E("[voice_stream] unexpected-response fired with 101; ignoring");
            return
        }
        if (E(`[voice_stream] Upgrade rejected: status=${String(V)} cf-mitigated=${String(v.headers["cf-mitigated"])} cf-ray=${String(v.headers["cf-ray"])}`), P = !0, v.resume(), f.destroy(), M) return;
        q.onError(`WebSocket upgrade rejected with HTTP ${String(V)}`, {
            fatal: V >= 400 && V < 500
        })
    }), j.on("error", (f) => {
        if (j6(f), E(`[voice_stream] WebSocket error: ${f.message}`), !M) q.onError(`Voice stream connection error: ${f.message}`)
    }), Z
}
// @from(Ln 391319, Col 4)
avK = '{"type":"KeepAlive"}'
// @from(Ln 391320, Col 4)
ajY = '{"type":"CloseStream"}'
// @from(Ln 391321, Col 4)
sjY = "/api/ws/speech_to_text/voice_stream"
// @from(Ln 391322, Col 4)
tjY = 8000
// @from(Ln 391323, Col 4)
L37
// @from(Ln 391324, Col 4)
yd8 = L(() => {
    xY6();
    z3();
    T7();
    K8();
    Zf();
    U8();
    Qm();
    _M();
    e8();
    L37 = {
        safety: 5000,
        noData: 1500
    }
})
// @from(Ln 391339, Col 4)
tvK = {}
// @from(Ln 391352, Col 0)
function Ze() {
    if (svK) return t58;
    svK = !0;
    let q = process.platform;
    if (q !== "darwin" && q !== "linux" && q !== "win32") return null;
    if (process.env.AUDIO_CAPTURE_NODE_PATH) try {
        return t58 = d6(process.env.AUDIO_CAPTURE_NODE_PATH), t58
    } catch {}
    let K = `${process.arch}-${q}`,
        _ = [`./vendor/audio-capture/${K}/audio-capture.node`, `../audio-capture/${K}/audio-capture.node`];
    for (let z of _) try {
        return t58 = d6(z), t58
    } catch {}
    return null
}
// @from(Ln 391368, Col 0)
function ejY() {
    return Ze() !== null
}
// @from(Ln 391372, Col 0)
function qHY(q, K) {
    let _ = Ze();
    if (!_) return !1;
    return _.startRecording(q, K)
}
// @from(Ln 391378, Col 0)
function KHY() {
    let q = Ze();
    if (!q) return;
    q.stopRecording()
}
// @from(Ln 391384, Col 0)
function _HY() {
    let q = Ze();
    if (!q) return !1;
    return q.isRecording()
}
// @from(Ln 391390, Col 0)
function zHY(q, K) {
    let _ = Ze();
    if (!_) return !1;
    return _.startPlayback(q, K)
}
// @from(Ln 391396, Col 0)
function YHY(q) {
    let K = Ze();
    if (!K) return;
    K.writePlaybackData(q)
}
// @from(Ln 391402, Col 0)
function AHY() {
    let q = Ze();
    if (!q) return;
    q.stopPlayback()
}
// @from(Ln 391408, Col 0)
function OHY() {
    let q = Ze();
    if (!q) return !1;
    return q.isPlaying()
}
// @from(Ln 391414, Col 0)
function wHY() {
    let q = Ze();
    if (!q || !q.microphoneAuthorizationStatus) return 0;
    return q.microphoneAuthorizationStatus()
}
// @from(Ln 391419, Col 4)
t58 = null
// @from(Ln 391420, Col 4)
svK = !1
// @from(Ln 391421, Col 4)
evK = () => {}
// @from(Ln 391422, Col 4)
HI6 = {}
// @from(Ln 391440, Col 0)
function Ld8() {
    return qTK ??= (async () => {
        let q = Date.now(),
            K = await Promise.resolve().then(() => (evK(), tvK));
        return K.isNativeAudioAvailable(), S37 = K, E(`[voice] audio-capture-napi loaded in ${Date.now()-q}ms`), K
    })(), qTK
}
// @from(Ln 391448, Col 0)
function fe(q) {
    return $HY(q, ["--version"], {
        stdio: "ignore",
        timeout: 3000
    }).error === void 0
}
// @from(Ln 391455, Col 0)
function _TK() {
    return C37 ??= new Promise((q) => {
        let K = I37("arecord", ["-f", "S16_LE", "-r", String(x37), "-c", String(u37), "-t", "raw", "/dev/null"], {
                stdio: ["ignore", "ignore", "pipe"]
            }),
            _ = "";
        K.stderr?.on("data", (Y) => {
            _ += Y.toString()
        });
        let z = setTimeout((Y, A) => {
            Y.kill("SIGTERM"), A({
                ok: !0,
                stderr: ""
            })
        }, 150, K, q);
        K.once("close", (Y) => {
            clearTimeout(z), q({
                ok: Y === 0,
                stderr: _.trim()
            })
        }), K.once("error", () => {
            clearTimeout(z), q({
                ok: !1,
                stderr: "arecord: command not found"
            })
        })
    }), C37
}
// @from(Ln 391484, Col 0)
function JHY() {
    C37 = null
}
// @from(Ln 391488, Col 0)
function XHY() {
    return b37 ??= jHY("/proc/asound/cards", "utf8").then((q) => {
        let K = q.trim();
        return K !== "" && !K.includes("no soundcards")
    }, () => !1), b37
}
// @from(Ln 391495, Col 0)
function MHY() {
    b37 = null
}
// @from(Ln 391499, Col 0)
function zTK() {
    if (process.platform === "darwin") {
        if (fe("brew")) return {
            cmd: "brew",
            args: ["install", "sox"],
            displayCommand: "brew install sox"
        };
        return null
    }
    if (process.platform === "linux") {
        if (fe("apt-get")) return {
            cmd: "sudo",
            args: ["apt-get", "install", "-y", "sox"],
            displayCommand: "sudo apt-get install sox"
        };
        if (fe("dnf")) return {
            cmd: "sudo",
            args: ["dnf", "install", "-y", "sox"],
            displayCommand: "sudo dnf install sox"
        };
        if (fe("pacman")) return {
            cmd: "sudo",
            args: ["pacman", "-S", "--noconfirm", "sox"],
            displayCommand: "sudo pacman -S sox"
        }
    }
    return null
}
// @from(Ln 391527, Col 0)
async function PHY() {
    if ((await Ld8()).isNativeAudioAvailable()) return {
        available: !0,
        missing: [],
        installCommand: null
    };
    if (process.platform === "win32") return {
        available: !1,
        missing: ["Voice mode requires the native audio module (not loaded)"],
        installCommand: null
    };
    if (process.platform === "linux" && fe("arecord")) return {
        available: !0,
        missing: [],
        installCommand: null
    };
    let K = [];
    if (!fe("rec")) K.push("sox (rec command)");
    let _ = K.length > 0 ? zTK() : null;
    return {
        available: K.length === 0,
        missing: K,
        installCommand: _?.displayCommand ?? null
    }
}
// @from(Ln 391552, Col 0)
async function WHY() {
    if (!(await Ld8()).isNativeAudioAvailable()) return !0;
    if (await YTK((_) => {}, () => {}, {
            silenceDetection: !1
        })) return ATK(), !0;
    return !1
}
// @from(Ln 391559, Col 0)
async function DHY() {
    if (CZ() || S6(process.env.CLAUDE_CODE_REMOTE)) return {
        available: !1,
        reason: `Voice mode requires microphone access, but no audio device is available in this environment.

To use voice mode, run Claude Code locally instead.`
    };
    if ((await Ld8()).isNativeAudioAvailable()) return {
        available: !0,
        reason: null
    };
    if (process.platform === "win32") return {
        available: !1,
        reason: "Voice recording requires the native audio module, which could not be loaded."
    };
    let K = `Voice mode could not access an audio device in WSL.

WSL2 with WSLg (Windows 11) provides audio via PulseAudio — if you are on Windows 10 or WSL1, run Claude Code in native Windows instead.`;
    if (process.platform === "linux" && fe("arecord")) {
        let _ = await _TK();
        if (_.ok) return {
            available: !0,
            reason: null
        };
        if (y1() === "wsl") return {
            available: !1,
            reason: K
        };
        E(`[voice] arecord probe failed: ${_.stderr}`)
    }
    if (!fe("rec")) {
        if (y1() === "wsl") return {
            available: !1,
            reason: K
        };
        let _ = zTK();
        return {
            available: !1,
            reason: _ ? `Voice mode requires SoX for audio recording. Install it with: ${_.displayCommand}` : `Voice mode requires SoX for audio recording. Install SoX manually:
  macOS: brew install sox
  Ubuntu/Debian: sudo apt-get install sox
  Fedora: sudo dnf install sox`
        }
    }
    return {
        available: !0,
        reason: null
    }
}
// @from(Ln 391608, Col 0)
async function YTK(q, K, _) {
    E(`[voice] startRecording called, platform=${process.platform}`);
    let z = await Ld8(),
        Y = z.isNativeAudioAvailable() && (process.platform !== "linux" || await XHY()),
        A = _?.silenceDetection !== !1;
    if (Y) {
        if (jI6 || z.isNativeRecordingActive()) z.stopNativeRecording(), jI6 = !1;
        if (z.startNativeRecording((w) => {
                q(w)
            }, () => {
                if (A) jI6 = !1, K()
            })) return jI6 = !0, !0
    }
    if (process.platform === "win32") return E("[voice] Windows native recording unavailable, no fallback"), !1;
    if (process.platform === "linux" && fe("arecord") && (await _TK()).ok) return fHY(q, K);
    return ZHY(q, K, _)
}