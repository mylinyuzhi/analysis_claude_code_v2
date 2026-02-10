
// @from(Ln 354034, Col 0)
function Zd4(A, q) {
    if (!A || A.length === 0) return "No references found. This may occur if the symbol has no usages, or if the LSP server has not fully indexed the workspace.";
    let K = A.filter((H) => !H || !H.uri);
    if (K.length > 0) h(`formatFindReferencesResult: Filtering out ${K.length} invalid location(s) - this should have been caught earlier`, {
        level: "warn"
    });
    let Y = A.filter((H) => H && H.uri);
    if (Y.length === 0) return "No references found. This may occur if the symbol has no usages, or if the LSP server has not fully indexed the workspace.";
    if (Y.length === 1) return `Found 1 reference:
  ${yW6(Y[0],q)}`;
    let z = Gd4(Y, q),
        w = [`Found ${Y.length} references across ${z.size} files:`];
    for (let [H, $] of z) {
        w.push(`
${H}:`);
        for (let O of $) {
            let _ = O.range.start.line + 1,
                J = O.range.start.character + 1;
            w.push(`  Line ${_}:${J}`)
        }
    }
    return w.join(`
`)
}
// @from(Ln 354059, Col 0)
function fCY(A) {
    if (Array.isArray(A)) return A.map((q) => {
        if (typeof q === "string") return q;
        return q.value
    }).join(`

`);
    if (typeof A === "string") return A;
    if ("kind" in A) return A.value;
    return A.value
}
// @from(Ln 354071, Col 0)
function fd4(A, q) {
    if (!A) return "No hover information available. This may occur if the cursor is not on a symbol, or if the LSP server has not fully indexed the file.";
    let K = fCY(A.contents);
    if (A.range) {
        let Y = A.range.start.line + 1,
            z = A.range.start.character + 1;
        return `Hover info at ${Y}:${z}:

${K}`
    }
    return K
}
// @from(Ln 354084, Col 0)
function cW1(A) {
    return {
        [1]: "File",
        [2]: "Module",
        [3]: "Namespace",
        [4]: "Package",
        [5]: "Class",
        [6]: "Method",
        [7]: "Property",
        [8]: "Field",
        [9]: "Constructor",
        [10]: "Enum",
        [11]: "Interface",
        [12]: "Function",
        [13]: "Variable",
        [14]: "Constant",
        [15]: "String",
        [16]: "Number",
        [17]: "Boolean",
        [18]: "Array",
        [19]: "Object",
        [20]: "Key",
        [21]: "Null",
        [22]: "EnumMember",
        [23]: "Struct",
        [24]: "Event",
        [25]: "Operator",
        [26]: "TypeParameter"
    } [A] || "Unknown"
}
// @from(Ln 354115, Col 0)
function Vd4(A, q = 0) {
    let K = [],
        Y = "  ".repeat(q),
        z = cW1(A.kind),
        w = `${Y}${A.name} (${z})`;
    if (A.detail) w += ` ${A.detail}`;
    let H = A.range.start.line + 1;
    if (w += ` - Line ${H}`, K.push(w), A.children && A.children.length > 0)
        for (let $ of A.children) K.push(...Vd4($, q + 1));
    return K
}
// @from(Ln 354127, Col 0)
function Nd4(A, q) {
    if (!A || A.length === 0) return "No symbols found in document. This may occur if the file is empty, not supported by the LSP server, or if the server has not fully indexed the file.";
    let K = A[0];
    if (K && "location" in K) return fRA(A, q);
    let z = ["Document symbols:"];
    for (let w of A) z.push(...Vd4(w));
    return z.join(`
`)
}
// @from(Ln 354137, Col 0)
function fRA(A, q) {
    if (!A || A.length === 0) return "No symbols found in workspace. This may occur if the workspace is empty, or if the LSP server has not finished indexing the project.";
    let K = A.filter((H) => !H || !H.location || !H.location.uri);
    if (K.length > 0) h(`formatWorkspaceSymbolResult: Filtering out ${K.length} invalid symbol(s) - this should have been caught earlier`, {
        level: "warn"
    });
    let Y = A.filter((H) => H && H.location && H.location.uri);
    if (Y.length === 0) return "No symbols found in workspace. This may occur if the workspace is empty, or if the LSP server has not finished indexing the project.";
    let z = [`Found ${Y.length} symbol${Y.length===1?"":"s"} in workspace:`],
        w = Gd4(Y, q);
    for (let [H, $] of w) {
        z.push(`
${H}:`);
        for (let O of $) {
            let _ = cW1(O.kind),
                J = O.location.range.start.line + 1,
                X = `  ${O.name} (${_}) - Line ${J}`;
            if (O.containerName) X += ` in ${O.containerName}`;
            z.push(X)
        }
    }
    return z.join(`
`)
}
// @from(Ln 354162, Col 0)
function Wd4(A, q) {
    if (!A.uri) return h("formatCallHierarchyItem: CallHierarchyItem has undefined URI", {
        level: "warn"
    }), `${A.name} (${cW1(A.kind)}) - <unknown location>`;
    let K = Eg1(A.uri, q),
        Y = A.range.start.line + 1,
        z = cW1(A.kind),
        w = `${A.name} (${z}) - ${K}:${Y}`;
    if (A.detail) w += ` [${A.detail}]`;
    return w
}
// @from(Ln 354174, Col 0)
function Td4(A, q) {
    if (!A || A.length === 0) return "No call hierarchy item found at this position";
    if (A.length === 1) return `Call hierarchy item: ${Wd4(A[0],q)}`;
    let K = [`Found ${A.length} call hierarchy items:`];
    for (let Y of A) K.push(`  ${Wd4(Y,q)}`);
    return K.join(`
`)
}
// @from(Ln 354183, Col 0)
function vd4(A, q) {
    if (!A || A.length === 0) return "No incoming calls found (nothing calls this function)";
    let K = [`Found ${A.length} incoming call${A.length===1?"":"s"}:`],
        Y = new Map;
    for (let z of A) {
        if (!z.from) {
            h("formatIncomingCallsResult: CallHierarchyIncomingCall has undefined from field", {
                level: "warn"
            });
            continue
        }
        let w = Eg1(z.from.uri, q),
            H = Y.get(w);
        if (H) H.push(z);
        else Y.set(w, [z])
    }
    for (let [z, w] of Y) {
        K.push(`
${z}:`);
        for (let H of w) {
            if (!H.from) continue;
            let $ = cW1(H.from.kind),
                O = H.from.range.start.line + 1,
                _ = `  ${H.from.name} (${$}) - Line ${O}`;
            if (H.fromRanges && H.fromRanges.length > 0) {
                let J = H.fromRanges.map((X) => `${X.start.line+1}:${X.start.character+1}`).join(", ");
                _ += ` [calls at: ${J}]`
            }
            K.push(_)
        }
    }
    return K.join(`
`)
}
// @from(Ln 354218, Col 0)
function Ed4(A, q) {
    if (!A || A.length === 0) return "No outgoing calls found (this function calls nothing)";
    let K = [`Found ${A.length} outgoing call${A.length===1?"":"s"}:`],
        Y = new Map;
    for (let z of A) {
        if (!z.to) {
            h("formatOutgoingCallsResult: CallHierarchyOutgoingCall has undefined to field", {
                level: "warn"
            });
            continue
        }
        let w = Eg1(z.to.uri, q),
            H = Y.get(w);
        if (H) H.push(z);
        else Y.set(w, [z])
    }
    for (let [z, w] of Y) {
        K.push(`
${z}:`);
        for (let H of w) {
            if (!H.to) continue;
            let $ = cW1(H.to.kind),
                O = H.to.range.start.line + 1,
                _ = `  ${H.to.name} (${$}) - Line ${O}`;
            if (H.fromRanges && H.fromRanges.length > 0) {
                let J = H.fromRanges.map((X) => `${X.start.line+1}:${X.start.character+1}`).join(", ");
                _ += ` [called from: ${J}]`
            }
            K.push(_)
        }
    }
    return K.join(`
`)
}
// @from(Ln 354252, Col 4)
kd4 = v(() => {
    Z6()
})
// @from(Ln 354255, Col 4)
VRA = "LSP"
// @from(Ln 354256, Col 4)
NRA = `Interact with Language Server Protocol (LSP) servers to get code intelligence features.

Supported operations:
- goToDefinition: Find where a symbol is defined
- findReferences: Find all references to a symbol
- hover: Get hover information (documentation, type info) for a symbol
- documentSymbol: Get all symbols (functions, classes, variables) in a document
- workspaceSymbol: Search for symbols across the entire workspace
- goToImplementation: Find implementations of an interface or abstract method
- prepareCallHierarchy: Get call hierarchy item at a position (functions/methods)
- incomingCalls: Find all functions/methods that call the function at a position
- outgoingCalls: Find all functions/methods called by the function at a position

All operations require:
- filePath: The file to operate on
- line: The line number (1-based, as shown in editors)
- character: The character offset (1-based, as shown in editors)

Note: LSP servers must be configured for the file type. If no server is available, an error will be returned.`
// @from(Ln 354276, Col 0)
function Ld4(A, q, K) {
    try {
        let Y = b1(),
            z = g4(A);
        if (!Y.existsSync(z)) return null;
        let H = Y.readFileSync(z, {
            encoding: "utf-8"
        }).split(`
`);
        if (q < 0 || q >= H.length) return null;
        let $ = H[q];
        if (!$ || K < 0 || K >= $.length) return null;
        let O = /[\w$'!]+|[+\-*/%&|^~<>=]+/g,
            _;
        while ((_ = O.exec($)) !== null) {
            let J = _.index,
                X = J + _[0].length;
            if (K >= J && K < X) {
                let D = _[0];
                return D.length > 30 ? D.slice(0, 27) + "..." : D
            }
        }
        return null
    } catch (Y) {
        if (Y instanceof Error) h(`Symbol extraction failed for ${A}:${q}:${K}: ${Y.message}`, {
            level: "warn"
        });
        return null
    }
}
// @from(Ln 354306, Col 4)
Rd4 = v(() => {
    _8();
    Ez();
    Z6()
})
// @from(Ln 354312, Col 0)
function NCY(A) {
    let q = e(23),
        {
            operation: K,
            resultCount: Y,
            fileCount: z,
            content: w,
            verbose: H
        } = A,
        $;
    if (q[0] !== K) $ = VCY[K] || {
        singular: "result",
        plural: "results"
    }, q[0] = K, q[1] = $;
    else $ = q[1];
    let O = $,
        _ = Y === 1 ? O.singular : O.plural,
        J;
    if (q[2] !== _ || q[3] !== O.special || q[4] !== K || q[5] !== Y) J = K === "hover" && Y > 0 && O.special ? IJ.default.createElement(V, null, "Hover info ", O.special) : IJ.default.createElement(V, null, "Found ", IJ.default.createElement(V, {
        bold: !0
    }, Y, " "), _), q[2] = _, q[3] = O.special, q[4] = K, q[5] = Y, q[6] = J;
    else J = q[6];
    let X = J,
        D;
    if (q[7] !== z) D = z > 1 ? IJ.default.createElement(V, null, " ", "across ", IJ.default.createElement(V, {
        bold: !0
    }, z, " "), "files") : null, q[7] = z, q[8] = D;
    else D = q[8];
    let j = D;
    if (H) {
        let W;
        if (q[9] !== X || q[10] !== j) W = IJ.default.createElement(I, {
            flexDirection: "row"
        }, IJ.default.createElement(V, null, "  ⎿  ", X, j)), q[9] = X, q[10] = j, q[11] = W;
        else W = q[11];
        let G;
        if (q[12] !== w) G = IJ.default.createElement(I, {
            marginLeft: 5
        }, IJ.default.createElement(V, null, w)), q[12] = w, q[13] = G;
        else G = q[13];
        let f;
        if (q[14] !== W || q[15] !== G) f = IJ.default.createElement(I, {
            flexDirection: "column"
        }, W, G), q[14] = W, q[15] = G, q[16] = f;
        else f = q[16];
        return f
    }
    let M;
    if (q[17] !== Y) M = Y > 0 && IJ.default.createElement(aS, null), q[17] = Y, q[18] = M;
    else M = q[18];
    let P;
    if (q[19] !== X || q[20] !== j || q[21] !== M) P = IJ.default.createElement(HA, {
        height: 1
    }, IJ.default.createElement(V, null, X, j, " ", M)), q[19] = X, q[20] = j, q[21] = M, q[22] = P;
    else P = q[22];
    return P
}
// @from(Ln 354370, Col 0)
function yd4() {
    return "LSP"
}
// @from(Ln 354374, Col 0)
function Cd4(A, {
    verbose: q
}) {
    if (!A.operation) return null;
    let K = [];
    if ((A.operation === "goToDefinition" || A.operation === "findReferences" || A.operation === "hover" || A.operation === "goToImplementation") && A.filePath && A.line !== void 0 && A.character !== void 0) {
        let Y = Ld4(A.filePath, A.line - 1, A.character - 1),
            z = q ? A.filePath : L3(A.filePath);
        if (Y) K.push(`operation: "${A.operation}"`), K.push(`symbol: "${Y}"`), K.push(`in: "${z}"`);
        else K.push(`operation: "${A.operation}"`), K.push(`file: "${z}"`), K.push(`position: ${A.line}:${A.character}`);
        return K.join(", ")
    }
    if (K.push(`operation: "${A.operation}"`), A.filePath) {
        let Y = q ? A.filePath : L3(A.filePath);
        K.push(`file: "${Y}"`)
    }
    return K.join(", ")
}
// @from(Ln 354393, Col 0)
function Sd4() {
    return IJ.default.createElement(Y9, null)
}
// @from(Ln 354397, Col 0)
function hd4(A, {
    verbose: q
}) {
    if (!q && typeof A === "string" && C4(A, "tool_use_error")) return IJ.default.createElement(HA, null, IJ.default.createElement(V, {
        color: "error"
    }, "LSP operation failed"));
    return IJ.default.createElement(z5, {
        result: A,
        verbose: q
    })
}
// @from(Ln 354409, Col 0)
function Id4() {
    return null
}
// @from(Ln 354413, Col 0)
function xd4(A, q, {
    verbose: K
}) {
    if (A.resultCount !== void 0 && A.fileCount !== void 0) return IJ.default.createElement(NCY, {
        operation: A.operation,
        resultCount: A.resultCount,
        fileCount: A.fileCount,
        content: A.result,
        verbose: K
    });
    return IJ.default.createElement(HA, null, IJ.default.createElement(V, null, A.result))
}
// @from(Ln 354425, Col 4)
IJ
// @from(Ln 354425, Col 8)
VCY
// @from(Ln 354426, Col 4)
bd4 = v(() => {
    i1();
    m1();
    CX();
    UO();
    eq();
    no();
    N8();
    wq();
    Rd4();
    IJ = o(X1(), 1), VCY = {
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
// @from(Ln 354484, Col 0)
function LCY(A, q) {
    let K = vCY(q).href,
        Y = {
            line: A.line - 1,
            character: A.character - 1
        };
    switch (A.operation) {
        case "goToDefinition":
            return {
                method: "textDocument/definition", params: {
                    textDocument: {
                        uri: K
                    },
                    position: Y
                }
            };
        case "findReferences":
            return {
                method: "textDocument/references", params: {
                    textDocument: {
                        uri: K
                    },
                    position: Y,
                    context: {
                        includeDeclaration: !0
                    }
                }
            };
        case "hover":
            return {
                method: "textDocument/hover", params: {
                    textDocument: {
                        uri: K
                    },
                    position: Y
                }
            };
        case "documentSymbol":
            return {
                method: "textDocument/documentSymbol", params: {
                    textDocument: {
                        uri: K
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
                        uri: K
                    },
                    position: Y
                }
            };
        case "prepareCallHierarchy":
            return {
                method: "textDocument/prepareCallHierarchy", params: {
                    textDocument: {
                        uri: K
                    },
                    position: Y
                }
            };
        case "incomingCalls":
            return {
                method: "textDocument/prepareCallHierarchy", params: {
                    textDocument: {
                        uri: K
                    },
                    position: Y
                }
            };
        case "outgoingCalls":
            return {
                method: "textDocument/prepareCallHierarchy", params: {
                    textDocument: {
                        uri: K
                    },
                    position: Y
                }
            }
    }
}
// @from(Ln 354574, Col 0)
function Bd4(A) {
    let q = A.length;
    for (let K of A)
        if (K.children && K.children.length > 0) q += Bd4(K.children);
    return q
}
// @from(Ln 354581, Col 0)
function CW6(A) {
    return new Set(A.map((q) => q.uri)).size
}
// @from(Ln 354585, Col 0)
function RCY(A) {
    return "targetUri" in A
}
// @from(Ln 354589, Col 0)
function ud4(A) {
    if (RCY(A)) return {
        uri: A.targetUri,
        range: A.targetSelectionRange || A.targetRange
    };
    return A
}
// @from(Ln 354597, Col 0)
function yCY(A, q, K) {
    switch (A) {
        case "goToDefinition": {
            let z = (Array.isArray(q) ? q : q ? [q] : []).map(ud4),
                w = z.filter(($) => !$ || !$.uri);
            if (w.length > 0) K1(Error(`LSP server returned ${w.length} location(s) with undefined URI for goToDefinition on ${K}. This indicates malformed data from the LSP server.`));
            let H = z.filter(($) => $ && $.uri);
            return {
                formatted: ZRA(q, K),
                resultCount: H.length,
                fileCount: CW6(H)
            }
        }
        case "findReferences": {
            let Y = q || [],
                z = Y.filter((H) => !H || !H.uri);
            if (z.length > 0) K1(Error(`LSP server returned ${z.length} location(s) with undefined URI for findReferences on ${K}. This indicates malformed data from the LSP server.`));
            let w = Y.filter((H) => H && H.uri);
            return {
                formatted: Zd4(q, K),
                resultCount: w.length,
                fileCount: CW6(w)
            }
        }
        case "hover":
            return {
                formatted: fd4(q, K), resultCount: q ? 1 : 0, fileCount: q ? 1 : 0
            };
        case "documentSymbol": {
            let Y = q || [],
                w = Y.length > 0 && Y[0] && "range" in Y[0] ? Bd4(Y) : Y.length;
            return {
                formatted: Nd4(q, K),
                resultCount: w,
                fileCount: Y.length > 0 ? 1 : 0
            }
        }
        case "workspaceSymbol": {
            let Y = q || [],
                z = Y.filter(($) => !$ || !$.location || !$.location.uri);
            if (z.length > 0) K1(Error(`LSP server returned ${z.length} symbol(s) with undefined location URI for workspaceSymbol on ${K}. This indicates malformed data from the LSP server.`));
            let w = Y.filter(($) => $ && $.location && $.location.uri),
                H = w.map(($) => $.location);
            return {
                formatted: fRA(q, K),
                resultCount: w.length,
                fileCount: CW6(H)
            }
        }
        case "goToImplementation": {
            let z = (Array.isArray(q) ? q : q ? [q] : []).map(ud4),
                w = z.filter(($) => !$ || !$.uri);
            if (w.length > 0) K1(Error(`LSP server returned ${w.length} location(s) with undefined URI for goToImplementation on ${K}. This indicates malformed data from the LSP server.`));
            let H = z.filter(($) => $ && $.uri);
            return {
                formatted: ZRA(q, K),
                resultCount: H.length,
                fileCount: CW6(H)
            }
        }
        case "prepareCallHierarchy": {
            let Y = q || [];
            return {
                formatted: Td4(q, K),
                resultCount: Y.length,
                fileCount: Y.length > 0 ? CCY(Y) : 0
            }
        }
        case "incomingCalls": {
            let Y = q || [];
            return {
                formatted: vd4(q, K),
                resultCount: Y.length,
                fileCount: Y.length > 0 ? SCY(Y) : 0
            }
        }
        case "outgoingCalls": {
            let Y = q || [];
            return {
                formatted: Ed4(q, K),
                resultCount: Y.length,
                fileCount: Y.length > 0 ? hCY(Y) : 0
            }
        }
    }
}
// @from(Ln 354684, Col 0)
function CCY(A) {
    let q = A.map((K) => K.uri).filter((K) => K);
    return new Set(q).size
}
// @from(Ln 354689, Col 0)
function SCY(A) {
    let q = A.map((K) => K.from?.uri).filter((K) => K);
    return new Set(q).size
}
// @from(Ln 354694, Col 0)
function hCY(A) {
    let q = A.map((K) => K.to?.uri).filter((K) => K);
    return new Set(q).size
}
// @from(Ln 354698, Col 4)
ECY
// @from(Ln 354698, Col 9)
kCY
// @from(Ln 354698, Col 14)
vRA
// @from(Ln 354699, Col 4)
md4 = v(() => {
    i7();
    jd4();
    kd4();
    Ot();
    Ez();
    N7();
    _8();
    E2();
    y6();
    Z6();
    bd4();
    ECY = z7(() => u.strictObject({
        operation: u.enum(["goToDefinition", "findReferences", "hover", "documentSymbol", "workspaceSymbol", "goToImplementation", "prepareCallHierarchy", "incomingCalls", "outgoingCalls"]).describe("The LSP operation to perform"),
        filePath: u.string().describe("The absolute or relative path to the file"),
        line: u.number().int().positive().describe("The line number (1-based, as shown in editors)"),
        character: u.number().int().positive().describe("The character offset (1-based, as shown in editors)")
    })), kCY = z7(() => u.object({
        operation: u.enum(["goToDefinition", "findReferences", "hover", "documentSymbol", "workspaceSymbol", "goToImplementation", "prepareCallHierarchy", "incomingCalls", "outgoingCalls"]).describe("The LSP operation that was performed"),
        result: u.string().describe("The formatted result of the LSP operation"),
        filePath: u.string().describe("The file path the operation was performed on"),
        resultCount: u.number().int().nonnegative().optional().describe("Number of results (definitions, references, symbols)"),
        fileCount: u.number().int().nonnegative().optional().describe("Number of files containing results")
    })), vRA = {
        name: VRA,
        maxResultSizeChars: 1e5,
        isLsp: !0,
        async description() {
            return NRA
        },
        userFacingName: yd4,
        isEnabled() {
            if (W51().status === "failed") return !1;
            let q = md();
            if (!q) return !1;
            let K = q.getAllServers();
            if (K.size === 0) return !1;
            return Array.from(K.values()).some((z) => z.state !== "error")
        },
        get inputSchema() {
            return ECY()
        },
        get outputSchema() {
            return kCY()
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        getPath({
            filePath: A
        }) {
            return g4(A)
        },
        async validateInput(A) {
            let q = Dd4.safeParse(A);
            if (!q.success) return {
                result: !1,
                message: `Invalid input: ${q.error.message}`,
                errorCode: 3
            };
            let K = b1(),
                Y = g4(A.filePath);
            if (Y.startsWith("\\\\") || Y.startsWith("//")) return {
                result: !0
            };
            if (!K.existsSync(Y)) return {
                result: !1,
                message: `File does not exist: ${A.filePath}`,
                errorCode: 1
            };
            try {
                if (!K.statSync(Y).isFile()) return {
                    result: !1,
                    message: `Path is not a file: ${A.filePath}`,
                    errorCode: 2
                }
            } catch (z) {
                let w = z instanceof Error ? z : Error(String(z));
                return K1(Error(`Failed to access file stats for LSP operation on ${A.filePath}: ${w.message}`)), {
                    result: !1,
                    message: `Cannot access file: ${A.filePath}. ${w.message}`,
                    errorCode: 4
                }
            }
            return {
                result: !0
            }
        },
        async checkPermissions(A, q) {
            let K = await q.getAppState();
            return ro(vRA, A, K.toolPermissionContext)
        },
        async prompt() {
            return NRA
        },
        renderToolUseMessage: Cd4,
        renderToolUseRejectedMessage: Sd4,
        renderToolUseErrorMessage: hd4,
        renderToolUseProgressMessage: Id4,
        renderToolResultMessage: xd4,
        async call(A, q) {
            let K = g4(A.filePath),
                Y = h6();
            if (W51().status === "pending") await qF4();
            let w = md();
            if (!w) return K1(Error("LSP server manager not initialized when tool was called")), {
                data: {
                    operation: A.operation,
                    result: "LSP server manager not initialized. This may indicate a startup issue.",
                    filePath: A.filePath
                }
            };
            let {
                method: H,
                params: $
            } = LCY(A, K);
            try {
                if (!w.isFileOpen(K)) {
                    let j = await TCY(K, "utf-8");
                    await w.openFile(K, j)
                }
                let O = await w.sendRequest(K, H, $);
                if (O === void 0) return h(`No LSP server available for file type ${TRA.extname(K)} for operation ${A.operation} on file ${A.filePath}`), {
                    data: {
                        operation: A.operation,
                        result: `No LSP server available for file type: ${TRA.extname(K)}`,
                        filePath: A.filePath
                    }
                };
                if (A.operation === "incomingCalls" || A.operation === "outgoingCalls") {
                    let j = O;
                    if (!j || j.length === 0) return {
                        data: {
                            operation: A.operation,
                            result: "No call hierarchy item found at this position",
                            filePath: A.filePath,
                            resultCount: 0,
                            fileCount: 0
                        }
                    };
                    let M = A.operation === "incomingCalls" ? "callHierarchy/incomingCalls" : "callHierarchy/outgoingCalls";
                    if (O = await w.sendRequest(K, M, {
                            item: j[0]
                        }), O === void 0) h(`LSP server returned undefined for ${M} on ${A.filePath}`)
                }
                let {
                    formatted: _,
                    resultCount: J,
                    fileCount: X
                } = yCY(A.operation, O, Y);
                return {
                    data: {
                        operation: A.operation,
                        result: _,
                        filePath: A.filePath,
                        resultCount: J,
                        fileCount: X
                    }
                }
            } catch (O) {
                let J = (O instanceof Error ? O : Error(String(O))).message;
                return K1(Error(`LSP tool request failed for ${A.operation} on ${A.filePath}: ${J}`)), {
                    data: {
                        operation: A.operation,
                        result: `Error performing ${A.operation}: ${J}`,
                        filePath: A.filePath
                    }
                }
            }
        },
        mapToolResultToToolResultBlockParam(A, q) {
            return {
                tool_use_id: q,
                type: "tool_result",
                content: A.result
            }
        }
    }
})
// @from(Ln 354881, Col 4)
ERA = "ListMcpResourcesTool"
// @from(Ln 354882, Col 4)
Fd4 = `
Lists available resources from configured MCP servers.
Each resource object includes a 'server' field indicating which server it's from.

Usage examples:
- List all resources from all servers: \`listMcpResources\`
- List resources from a specific server: \`listMcpResources({ server: "myserver" })\`
`
// @from(Ln 354890, Col 4)
Qd4 = `
List available resources from configured MCP servers.
Each returned resource will include all standard MCP resource fields plus a 'server' field 
indicating which server the resource belongs to.

Parameters:
- server (optional): The name of a specific MCP server to get resources from. If not provided,
  resources from all servers will be returned.
`
// @from(Ln 354900, Col 0)
function gd4(A) {
    return A.server ? `List MCP resources from server "${A.server}"` : "List all MCP resources"
}
// @from(Ln 354904, Col 0)
function Ud4() {
    return fI.createElement(Y9, null)
}
// @from(Ln 354908, Col 0)
function pd4(A, {
    verbose: q
}) {
    return fI.createElement(z5, {
        result: A,
        verbose: q
    })
}
// @from(Ln 354917, Col 0)
function dd4() {
    return null
}
// @from(Ln 354921, Col 0)
function cd4(A, q, {
    verbose: K
}) {
    if (!A || A.length === 0) return fI.createElement(HA, {
        height: 1
    }, fI.createElement(V, {
        dimColor: !0
    }, "(No resources found)"));
    let Y = Q1(A, null, 2);
    return fI.createElement(PB, {
        content: Y,
        verbose: K
    })
}
// @from(Ln 354935, Col 4)
fI
// @from(Ln 354936, Col 4)
ld4 = v(() => {
    m1();
    CX();
    UO();
    eq();
    H01();
    m6();
    fI = o(X1(), 1)
})
// @from(Ln 354945, Col 4)
ICY
// @from(Ln 354945, Col 9)
xCY
// @from(Ln 354945, Col 14)
cd
// @from(Ln 354946, Col 4)
SW6 = v(() => {
    i7();
    gD();
    y6();
    SW();
    ld4();
    m6();
    ICY = z7(() => u.object({
        server: u.string().optional().describe("Optional server name to filter resources by")
    })), xCY = z7(() => u.array(u.object({
        uri: u.string().describe("Resource URI"),
        name: u.string().describe("Resource name"),
        mimeType: u.string().optional().describe("MIME type of the resource"),
        description: u.string().optional().describe("Resource description"),
        server: u.string().describe("Server that provides this resource")
    }))), cd = {
        isEnabled() {
            return !0
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        shouldDefer: !0,
        name: ERA,
        maxResultSizeChars: 1e5,
        async description() {
            return Fd4
        },
        async prompt() {
            return Qd4
        },
        get inputSchema() {
            return ICY()
        },
        get outputSchema() {
            return xCY()
        },
        async call(A, {
            options: {
                mcpClients: q
            }
        }) {
            let K = [],
                {
                    server: Y
                } = A,
                z = Y ? q.filter((w) => w.name === Y) : q;
            if (Y && z.length === 0) throw Error(`Server "${Y}" not found. Available servers: ${q.map((w)=>w.name).join(", ")}`);
            for (let w of z) {
                if (w.type !== "connected") continue;
                try {
                    if (!w.capabilities?.resources) continue;
                    let $ = await (await lW1(w)).client.request({
                        method: "resources/list"
                    }, Vq1);
                    if (!$.resources) continue;
                    let O = $.resources.map((_) => ({
                        ..._,
                        server: w.name
                    }));
                    K.push(...O)
                } catch (H) {
                    Kz(w.name, `Failed to fetch resources: ${H instanceof Error?H.message:String(H)}`)
                }
            }
            return {
                data: K
            }
        },
        async checkPermissions(A) {
            return {
                behavior: "allow",
                updatedInput: A
            }
        },
        renderToolUseMessage: gd4,
        userFacingName: () => "listMcpResources",
        renderToolUseRejectedMessage: Ud4,
        renderToolUseErrorMessage: pd4,
        renderToolUseProgressMessage: dd4,
        renderToolResultMessage: cd4,
        mapToolResultToToolResultBlockParam(A, q) {
            if (!A || A.length === 0) return {
                tool_use_id: q,
                type: "tool_result",
                content: "No resources found. MCP servers may still provide tools even if they have no resources."
            };
            return {
                tool_use_id: q,
                type: "tool_result",
                content: Q1(A)
            }
        }
    }
})
// @from(Ln 355044, Col 4)
id4 = `
Reads a specific resource from an MCP server.
- server: The name of the MCP server to read from
- uri: The URI of the resource to read

Usage examples:
- Read a resource from a server: \`readMcpResource({ server: "myserver", uri: "my-resource-uri" })\`
`
// @from(Ln 355052, Col 4)
nd4 = `
Reads a specific resource from an MCP server, identified by server name and resource URI.

Parameters:
- server (required): The name of the MCP server from which to read the resource
- uri (required): The URI of the resource to read
`
// @from(Ln 355060, Col 0)
function rd4(A) {
    if (!A.uri || !A.server) return null;
    return `Read resource "${A.uri}" from server "${A.server}"`
}
// @from(Ln 355065, Col 0)
function od4() {
    return "readMcpResource"
}
// @from(Ln 355069, Col 0)
function ad4() {
    return KE.createElement(Y9, null)
}
// @from(Ln 355073, Col 0)
function sd4(A, {
    verbose: q
}) {
    return KE.createElement(z5, {
        result: A,
        verbose: q
    })
}
// @from(Ln 355082, Col 0)
function td4() {
    return null
}
// @from(Ln 355086, Col 0)
function ed4(A, q, {
    verbose: K
}) {
    if (!A || !A.contents || A.contents.length === 0) return KE.createElement(I, {
        justifyContent: "space-between",
        overflowX: "hidden",
        width: "100%"
    }, KE.createElement(HA, {
        height: 1
    }, KE.createElement(V, {
        dimColor: !0
    }, "(No content)")));
    let Y = Q1(A, null, 2);
    return KE.createElement(PB, {
        content: Y,
        verbose: K
    })
}
// @from(Ln 355104, Col 4)
KE
// @from(Ln 355105, Col 4)
Ac4 = v(() => {
    m1();
    CX();
    UO();
    eq();
    H01();
    m6();
    KE = o(X1(), 1)
})
// @from(Ln 355114, Col 4)
bCY
// @from(Ln 355114, Col 9)
uCY
// @from(Ln 355114, Col 14)
ld
// @from(Ln 355115, Col 4)
hW6 = v(() => {
    i7();
    gD();
    SW();
    Ac4();
    m6();
    bCY = z7(() => u.object({
        server: u.string().describe("The MCP server name"),
        uri: u.string().describe("The resource URI to read")
    })), uCY = z7(() => u.object({
        contents: u.array(u.object({
            uri: u.string().describe("Resource URI"),
            mimeType: u.string().optional().describe("MIME type of the content"),
            text: u.string().optional().describe("Text content of the resource")
        }))
    })), ld = {
        isEnabled() {
            return !0
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        shouldDefer: !0,
        name: "ReadMcpResourceTool",
        maxResultSizeChars: 1e5,
        async description() {
            return id4
        },
        async prompt() {
            return nd4
        },
        get inputSchema() {
            return bCY()
        },
        get outputSchema() {
            return uCY()
        },
        async call(A, {
            options: {
                mcpClients: q
            }
        }) {
            let {
                server: K,
                uri: Y
            } = A, z = q.find(($) => $.name === K);
            if (!z) throw Error(`Server "${K}" not found. Available servers: ${q.map(($)=>$.name).join(", ")}`);
            if (z.type !== "connected") throw Error(`Server "${K}" is not connected`);
            if (!z.capabilities?.resources) throw Error(`Server "${K}" does not support resources`);
            return {
                data: await (await lW1(z)).client.request({
                    method: "resources/read",
                    params: {
                        uri: Y
                    }
                }, Nq1)
            }
        },
        async checkPermissions(A) {
            return {
                behavior: "allow",
                updatedInput: A
            }
        },
        renderToolUseMessage: rd4,
        userFacingName: od4,
        renderToolUseRejectedMessage: ad4,
        renderToolUseErrorMessage: sd4,
        renderToolUseProgressMessage: td4,
        renderToolResultMessage: ed4,
        mapToolResultToToolResultBlockParam(A, q) {
            return {
                tool_use_id: q,
                type: "tool_result",
                content: Q1(A)
            }
        }
    }
})
// @from(Ln 355198, Col 0)
function qc4(A) {
    return `Search tools: "${A.query??"..."}"`
}
// @from(Ln 355202, Col 0)
function Kc4() {
    return id.createElement(Y9, null)
}
// @from(Ln 355206, Col 0)
function Yc4(A) {
    let q = typeof A === "string" ? A : Array.isArray(A) ? A.filter((K) => K.type === "text").map((K) => ("text" in K) ? K.text : "").join(`
`) : "Unknown error";
    return id.createElement(V, {
        color: "error"
    }, q)
}
// @from(Ln 355214, Col 0)
function zc4() {
    return null
}
// @from(Ln 355218, Col 0)
function wc4(A) {
    return null
}
// @from(Ln 355222, Col 0)
function Hc4(A) {
    return id.createElement(V, {
        dimColor: !0
    }, "Loaded ", id.createElement(V, {
        bold: !0
    }, A), " ", A === 1 ? "tool" : "tools", " ·", " ", "/context")
}
// @from(Ln 355229, Col 4)
id
// @from(Ln 355230, Col 4)
$c4 = v(() => {
    m1();
    CX();
    id = o(X1(), 1)
})
// @from(Ln 355236, Col 0)
function FCY(A) {
    return A.map((q) => q.name).sort().join(",")
}
// @from(Ln 355240, Col 0)
function QCY(A) {
    let q = FCY(A);
    if (Oc4 !== q) h("ToolSearchTool: cache invalidated - deferred tools changed"), LRA.cache.clear?.(), Oc4 = q
}
// @from(Ln 355245, Col 0)
function kRA(A, q, K) {
    return {
        data: {
            matches: A,
            query: q,
            total_deferred_tools: K
        }
    }
}
// @from(Ln 355255, Col 0)
function _c4(A) {
    if (A.startsWith("mcp__")) {
        let K = A.replace(/^mcp__/, "").toLowerCase();
        return {
            parts: K.split("__").flatMap((z) => z.split("_")).filter(Boolean),
            full: K.replace(/__/g, " ").replace(/_/g, " "),
            isMcp: !0
        }
    }
    let q = A.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " ").toLowerCase().split(/\s+/).filter(Boolean);
    return {
        parts: q,
        full: q.join(" "),
        isMcp: !1
    }
}
// @from(Ln 355272, Col 0)
function Jc4(A, q) {
    return new RegExp(`\\b${q.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\b`).test(A)
}
// @from(Ln 355275, Col 0)
async function gCY(A, q, K, Y) {
    let z = A.toLowerCase().trim(),
        w = q.find((D) => D.name.toLowerCase() === z);
    if (w) return [w.name];
    if (z.startsWith("mcp__") && z.length > 5) {
        let D = q.filter((j) => j.name.toLowerCase().startsWith(z)).slice(0, Y).map((j) => j.name);
        if (D.length > 0) return D
    }
    let H = z.split(/\s+/).filter((D) => D.length > 0),
        $ = [],
        O = [];
    for (let D of H)
        if (D.startsWith("+") && D.length > 1) $.push(D.slice(1));
        else O.push(D);
    let _ = q;
    if ($.length > 0) _ = (await Promise.all(q.map(async (j) => {
        let M = _c4(j.name),
            W = (await LRA(j.name, K)).toLowerCase();
        return $.every((f) => M.parts.includes(f) || M.parts.some((Z) => Z.includes(f)) || Jc4(W, f)) ? j : null
    }))).filter((j) => j !== null);
    let J = $.length > 0 ? [...$, ...O] : H;
    return (await Promise.all(_.map(async (D) => {
        let j = _c4(D.name),
            P = (await LRA(D.name, K)).toLowerCase(),
            W = 0;
        for (let G of J) {
            if (j.parts.includes(G)) W += j.isMcp ? 12 : 10;
            else if (j.parts.some((f) => f.includes(G))) W += j.isMcp ? 6 : 5;
            if (j.full.includes(G) && W === 0) W += 3;
            if (Jc4(P, G)) W += 2
        }
        return {
            name: D.name,
            score: W
        }
    }))).filter((D) => D.score > 0).sort((D, j) => j.score - D.score).slice(0, Y).map((D) => D.name)
}
// @from(Ln 355312, Col 4)
BCY
// @from(Ln 355312, Col 9)
mCY
// @from(Ln 355312, Col 14)
Oc4 = null
// @from(Ln 355313, Col 4)
LRA
// @from(Ln 355313, Col 9)
IW6
// @from(Ln 355314, Col 4)
RRA = v(() => {
    i7();
    la();
    $c4();
    oL();
    Z6();
    u6();
    zq();
    BCY = z7(() => u.object({
        query: u.string().describe('Query to find deferred tools. Use "select:<tool_name>" for direct selection, or keywords to search.'),
        max_results: u.number().optional().default(5).describe("Maximum number of results to return (default: 5)")
    })), mCY = z7(() => u.object({
        matches: u.array(u.string()),
        query: u.string(),
        total_deferred_tools: u.number()
    }));
    LRA = KA(async (A, q) => {
        let K = q.find((Y) => Y.name === A);
        if (!K) return "";
        return K.prompt({
            getToolPermissionContext: async () => ({
                mode: "default",
                additionalWorkingDirectories: new Map,
                alwaysAllowRules: {},
                alwaysDenyRules: {},
                alwaysAskRules: {},
                isBypassPermissionsModeAvailable: !1
            }),
            tools: q,
            agents: []
        })
    }, (A) => A);
    IW6 = {
        isEnabled() {
            return Fp()
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        name: dM,
        maxResultSizeChars: 1e5,
        async description(A, {
            tools: q
        }) {
            return E_6(q)
        },
        async prompt({
            tools: A
        }) {
            return E_6(A)
        },
        get inputSchema() {
            return BCY()
        },
        get outputSchema() {
            return mCY()
        },
        async call(A, {
            options: {
                tools: q
            },
            addNotification: K
        }) {
            let {
                query: Y,
                max_results: z = 5
            } = A, w = q.filter(BW);
            QCY(w);

            function H(J) {
                if (J.length === 0) return;
                K?.({
                    key: `tool-search-${Date.now()}`,
                    jsx: Hc4(J.length),
                    priority: "immediate",
                    timeoutMs: 3000
                })
            }

            function $(J, X) {
                c("tengu_tool_search_outcome", {
                    query: Y,
                    queryType: X,
                    matchCount: J.length,
                    totalDeferredTools: w.length,
                    maxResults: z,
                    hasMatches: J.length > 0
                })
            }
            let O = Y.match(/^select:(.+)$/i);
            if (O) {
                let J = O[1].trim(),
                    X = w.find((D) => D.name === J);
                if (!X) return h(`ToolSearchTool: select failed - tool not found: ${J}`), $([], "select"), kRA([], Y, w.length);
                return h(`ToolSearchTool: selected "${J}"`), $([X.name], "select"), H([X.name]), kRA([X.name], Y, w.length)
            }
            let _ = await gCY(Y, w, q, z);
            return h(`ToolSearchTool: keyword search for "${Y}", found ${_.length} matches`), $(_, "keyword"), H(_), kRA(_, Y, w.length)
        },
        async checkPermissions(A) {
            return {
                behavior: "allow",
                updatedInput: A
            }
        },
        renderToolUseMessage: qc4,
        userFacingName: () => "",
        renderToolUseRejectedMessage: Kc4,
        renderToolUseErrorMessage: Yc4,
        renderToolUseProgressMessage: zc4,
        renderToolResultMessage: wc4,
        mapToolResultToToolResultBlockParam(A, q) {
            if (A.matches.length === 0) return {
                type: "tool_result",
                tool_use_id: q,
                content: "No matching deferred tools found"
            };
            return {
                type: "tool_result",
                tool_use_id: q,
                content: A.matches.map((K) => ({
                    type: "tool_reference",
                    tool_name: K
                }))
            }
        }
    }
})
// @from(Ln 355446, Col 0)
function Xc4() {
    if (process.env.CLAUDE_CODE_PLAN_V2_AGENT_COUNT) {
        let K = parseInt(process.env.CLAUDE_CODE_PLAN_V2_AGENT_COUNT, 10);
        if (!isNaN(K) && K > 0 && K <= 10) return K
    }
    let A = dK(),
        q = Sn();
    if (A === "max" && q === "default_claude_max_20x") return 3;
    if (A === "enterprise" || A === "team") return 3;
    return 1
}
// @from(Ln 355458, Col 0)
function Dc4() {
    if (process.env.CLAUDE_CODE_PLAN_V2_EXPLORE_AGENT_COUNT) {
        let A = parseInt(process.env.CLAUDE_CODE_PLAN_V2_EXPLORE_AGENT_COUNT, 10);
        if (!isNaN(A) && A > 0 && A <= 10) return A
    }
    return 3
}
// @from(Ln 355466, Col 0)
function sO() {
    let A = process.env.CLAUDE_CODE_PLAN_MODE_INTERVIEW_PHASE;
    if (J6(A)) return !0;
    if (FY(A)) return !1;
    return x8("tengu_plan_mode_interview_phase", !1)
}
// @from(Ln 355472, Col 4)
S51 = v(() => {
    U4();
    J7();
    hA()
})
// @from(Ln 355478, Col 0)
function pCY() {
    let A = sO() ? "" : UCY;
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
   - If you would use ${TH} to clarify the approach, use EnterPlanMode instead
   - Plan mode lets you explore first, then present options with context

## When NOT to Use This Tool

Only skip EnterPlanMode for simple tasks:
- Single-line or few-line fixes (typos, obvious bugs, small tweaks)
- Adding a single function with clear requirements
- Tasks where the user has given very specific, detailed instructions
- Pure research/exploration tasks (use the Task tool with explore agent instead)

${A}## Examples

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
// @from(Ln 355558, Col 0)
function jc4() {
    return pCY()
}
// @from(Ln 355561, Col 4)
UCY
// @from(Ln 355562, Col 4)
Mc4 = v(() => {
    S51();
    UCY = `## What Happens in Plan Mode

In plan mode, you'll:
1. Thoroughly explore the codebase using Glob, Grep, and Read tools
2. Understand existing patterns and architecture
3. Design an implementation approach
4. Present your plan to the user for approval
5. Use ${TH} if you need to clarify approaches
6. Exit plan mode with ExitPlanMode when ready to implement

`
})
// @from(Ln 355577, Col 0)
function Pc4() {
    return null
}
// @from(Ln 355581, Col 0)
function Wc4() {
    return null
}
// @from(Ln 355585, Col 0)
function Gc4(A, q, K) {
    return sD.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, sD.createElement(I, {
        flexDirection: "row"
    }, sD.createElement(V, {
        color: cP("plan")
    }, gY), sD.createElement(V, null, " Entered plan mode")), sD.createElement(I, {
        paddingLeft: 2
    }, sD.createElement(V, {
        dimColor: !0
    }, "Claude is now exploring and designing an implementation approach.")))
}
// @from(Ln 355600, Col 0)
function Zc4() {
    return sD.createElement(I, {
        flexDirection: "row",
        marginTop: 1
    }, sD.createElement(V, {
        color: cP("default")
    }, gY), sD.createElement(V, null, " User declined to enter plan mode"))
}
// @from(Ln 355609, Col 0)
function fc4() {
    return null
}
// @from(Ln 355612, Col 4)
sD
// @from(Ln 355613, Col 4)
Vc4 = v(() => {
    m1();
    jW();
    oj();
    sD = o(X1(), 1)
})
// @from(Ln 355619, Col 4)
dCY
// @from(Ln 355619, Col 9)
cCY
// @from(Ln 355619, Col 14)
kg1
// @from(Ln 355620, Col 4)
yRA = v(() => {
    i7();
    CO();
    B6();
    Mc4();
    Vc4();
    S51();
    dCY = z7(() => u.strictObject({})), cCY = z7(() => u.object({
        message: u.string().describe("Confirmation that plan mode was entered")
    })), kg1 = {
        name: N_6,
        maxResultSizeChars: 1e5,
        async description() {
            return "Requests permission to enter plan mode for complex tasks requiring exploration and design"
        },
        async prompt() {
            return jc4()
        },
        get inputSchema() {
            return dCY()
        },
        get outputSchema() {
            return cCY()
        },
        userFacingName() {
            return ""
        },
        isEnabled() {
            return !0
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        async checkPermissions(A) {
            return {
                behavior: "allow",
                updatedInput: A
            }
        },
        renderToolUseMessage: Pc4,
        renderToolUseProgressMessage: Wc4,
        renderToolResultMessage: Gc4,
        renderToolUseRejectedMessage: Zc4,
        renderToolUseErrorMessage: fc4,
        async call(A, q) {
            if (q.agentId) throw Error("EnterPlanMode tool cannot be used in agent contexts");
            let K = await q.getAppState();
            return ey(K.toolPermissionContext.mode, "plan"), q.setAppState((Y) => ({
                ...Y,
                toolPermissionContext: {
                    ...a2(Y.toolPermissionContext, {
                        type: "setMode",
                        mode: "plan",
                        destination: "session"
                    }),
                    prePlanMode: Y.toolPermissionContext.mode
                }
            })), {
                data: {
                    message: "Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach."
                }
            }
        },
        mapToolResultToToolResultBlockParam({
            message: A
        }, q) {
            return {
                type: "tool_result",
                content: sO() ? `${A}

DO NOT write or edit any files except the plan file. Detailed workflow instructions will follow.` : `${A}

In plan mode, you should:
1. Thoroughly explore the codebase to understand existing patterns
2. Identify similar features and architectural approaches
3. Consider multiple approaches and their trade-offs
4. Use AskUserQuestion if you need to clarify the approach
5. Design a concrete implementation strategy
6. When ready, use ExitPlanMode to present your plan for approval

Remember: DO NOT write or edit any files yet. This is a read-only exploration and planning phase.`,
                tool_use_id: q
            }
        }
    }
})
// @from(Ln 355709, Col 4)
lCY
// @from(Ln 355710, Col 4)
Nc4 = v(() => {
    m1();
    lCY = o(X1(), 1)
})
// @from(Ln 355715, Col 0)
function CRA(A) {
    if (/\d\s*<<\s*\d/.test(A) || /\[\[\s*\d+\s*<<\s*\d+\s*\]\]/.test(A) || /\$\(\(.*<<.*\)\)/.test(A)) return !1;
    return /<<-?\s*(?:(['"]?)(\w+)\1|\\(\w+))/.test(A)
}
// @from(Ln 355720, Col 0)
function iCY(A) {
    let q = /'(?:[^'\\]|\\.)*\n(?:[^'\\]|\\.)*'/,
        K = /"(?:[^"\\]|\\.)*\n(?:[^"\\]|\\.)*"/;
    return q.test(A) || K.test(A)
}
// @from(Ln 355726, Col 0)
function Tc4(A, q = !0) {
    if (CRA(A) || iCY(A)) {
        let Y = `'${A.replace(/'/g,`'"'"'`)}'`;
        if (CRA(A)) return Y;
        return q ? `${Y} < /dev/null` : Y
    }
    if (q) return R7([A, "<", "/dev/null"]);
    return R7([A])
}
// @from(Ln 355736, Col 0)
function nCY(A) {
    return /(?:^|[\s;&|])<(?![<(])\s*\S+/.test(A)
}
// @from(Ln 355740, Col 0)
function vc4(A) {
    if (CRA(A)) return !1;
    if (nCY(A)) return !1;
    return !0
}
// @from(Ln 355745, Col 4)
Ec4 = v(() => {
    M_()
})
// @from(Ln 355749, Col 0)
function Lc4(A) {
    if (A.includes("`")) return R7([A, "<", "/dev/null"]);
    if (A.includes("$(")) return R7([A, "<", "/dev/null"]);
    if (sCY(A)) return R7([A, "<", "/dev/null"]);
    let q = pz(A);
    if (!q.success) return R7([A, "<", "/dev/null"]);
    let K = q.tokens,
        Y = rCY(K);
    if (Y <= 0) return R7([A, "<", "/dev/null"]);
    let z = [...kc4(K, 0, Y), "< /dev/null", ...kc4(K, Y, K.length)];
    return R7([z.join(" ")])
}
// @from(Ln 355762, Col 0)
function rCY(A) {
    for (let q = 0; q < A.length; q++) {
        let K = A[q];
        if (SRA(K, "|")) return q
    }
    return -1
}
// @from(Ln 355770, Col 0)
function kc4(A, q, K) {
    let Y = [],
        z = !1;
    for (let w = q; w < K; w++) {
        let H = A[w];
        if (typeof H === "string" && /^[012]$/.test(H) && w + 2 < K && SRA(A[w + 1])) {
            let $ = A[w + 1],
                O = A[w + 2];
            if ($.op === ">&" && typeof O === "string" && /^[012]$/.test(O)) {
                Y.push(`${H}>&${O}`), w += 2;
                continue
            }
            if ($.op === ">" && O === "/dev/null") {
                Y.push(`${H}>/dev/null`), w += 2;
                continue
            }
            if ($.op === ">" && typeof O === "string" && O.startsWith("&")) {
                let _ = O.slice(1);
                if (/^[012]$/.test(_)) {
                    Y.push(`${H}>&${_}`), w += 2;
                    continue
                }
            }
        }
        if (typeof H === "string")
            if (!z && oCY(H)) {
                let O = H.indexOf("="),
                    _ = H.slice(0, O),
                    J = H.slice(O + 1),
                    X = R7([J]);
                Y.push(`${_}=${X}`)
            } else z = !0, Y.push(R7([H]));
        else if (SRA(H)) {
            if (H.op === "glob" && "pattern" in H) Y.push(H.pattern);
            else if (Y.push(H.op), aCY(H.op)) z = !1
        }
    }
    return Y
}
// @from(Ln 355810, Col 0)
function oCY(A) {
    return /^[A-Za-z_][A-Za-z0-9_]*=/.test(A)
}
// @from(Ln 355814, Col 0)
function aCY(A) {
    return A === "&&" || A === "||" || A === ";"
}
// @from(Ln 355818, Col 0)
function SRA(A, q) {
    if (!A || typeof A !== "object" || !("op" in A)) return !1;
    return q ? A.op === q : !0
}
// @from(Ln 355823, Col 0)
function sCY(A) {
    return /\b(for|while|until|if|case|select)\s/.test(A)
}
// @from(Ln 355826, Col 4)
Rc4 = v(() => {
    M_()
})
// @from(Ln 355843, Col 0)
function KSY() {
    let A = uw1(),
        q = R7([A.rgPath]);
    if (A.argv0) return {
        type: "function",
        snippet: ["function rg {", "  if [[ -n $ZSH_VERSION ]]; then", `    ARGV0=rg ${q} "$@"`, '  elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then', `    ARGV0=rg ${q} "$@"`, "  elif [[ $BASHPID != $$ ]]; then", `    exec -a rg ${q} "$@"`, "  else", `    (exec -a rg ${q} "$@")`, "  fi", "}"].join(`
`)
    };
    let K = A.rgArgs.map((z) => R7([z]));
    return {
        type: "alias",
        snippet: A.rgArgs.length > 0 ? `${q} ${K.join(" ")}` : q
    }
}
// @from(Ln 355858, Col 0)
function xRA(A) {
    let q = A.includes("zsh") ? ".zshrc" : A.includes("bash") ? ".bashrc" : ".profile";
    return IRA(xW6.homedir(), q)
}
// @from(Ln 355863, Col 0)
function YSY(A) {
    let q = A.endsWith(".zshrc"),
        K = "";
    if (q) K += `
      echo "# Functions" >> "$SNAPSHOT_FILE"

      # Force autoload all functions first
      typeset -f > /dev/null 2>&1

      # Now get user function names - filter system ones and write directly to file
      typeset +f | grep -vE '^(_|__)' | while read func; do
        typeset -f "$func" >> "$SNAPSHOT_FILE"
      done
    `;
    else K += `
      echo "# Functions" >> "$SNAPSHOT_FILE"

      # Force autoload all functions first
      declare -f > /dev/null 2>&1

      # Now get user function names - filter system ones and give the rest to eval in b64 encoding
      declare -F | cut -d' ' -f3 | grep -vE '^(_|__)' | while read func; do
        # Encode the function to base64, preserving all special characters
        encoded_func=$(declare -f "$func" | base64 )
        # Write the function definition to the snapshot
        echo "eval ${hRA}"${hRA}$(echo '$encoded_func' | base64 -d)${hRA}" > /dev/null 2>&1" >> "$SNAPSHOT_FILE"
      done
    `;
    if (q) K += `
      echo "# Shell Options" >> "$SNAPSHOT_FILE"
      setopt | sed 's/^/setopt /' | head -n 1000 >> "$SNAPSHOT_FILE"
    `;
    else K += `
      echo "# Shell Options" >> "$SNAPSHOT_FILE"
      shopt -p | head -n 1000 >> "$SNAPSHOT_FILE"
      set -o | grep "on" | awk '{print "set -o " $1}' | head -n 1000 >> "$SNAPSHOT_FILE"
      echo "shopt -s expand_aliases" >> "$SNAPSHOT_FILE"
    `;
    return K += `
      echo "# Aliases" >> "$SNAPSHOT_FILE"
      # Filter out winpty aliases on Windows to avoid "stdin is not a tty" errors
      # Git Bash automatically creates aliases like "alias node='winpty node.exe'" for
      # programs that need Win32 Console in mintty, but winpty fails when there's no TTY
      if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        alias | grep -v "='winpty " | sed 's/^alias //g' | sed 's/^/alias -- /' | head -n 1000 >> "$SNAPSHOT_FILE"
      else
        alias | sed 's/^alias //g' | sed 's/^/alias -- /' | head -n 1000 >> "$SNAPSHOT_FILE"
      fi
  `, K
}
// @from(Ln 355914, Col 0)
function zSY() {
    if (!O$()) return null;
    try {
        let A = D9() ? process.execPath : process.argv[1];
        if (!A) return null;
        try {
            A = ASY(A)
        } catch {}
        if (eA() === "windows") A = px(A);
        return {
            cliPath: A,
            args: ["--mcp-cli"]
        }
    } catch (A) {
        return K1(A instanceof Error ? A : Error(String(A))), null
    }
}
// @from(Ln 355931, Col 0)
async function wSY() {
    let A = process.env.PATH;
    if (eA() === "windows") {
        let z = await XY("echo $PATH", {
            shell: !0,
            reject: !1
        });
        if (z.exitCode === 0 && z.stdout) A = z.stdout.trim()
    }
    let q = KSY(),
        K = zSY(),
        Y = "";
    if (Y += `
      # Check for rg availability
      echo "# Check for rg availability" >> "$SNAPSHOT_FILE"
      echo "if ! (unalias rg 2>/dev/null; command -v rg) >/dev/null 2>&1; then" >> "$SNAPSHOT_FILE"
  `, q.type === "function") Y += `
      cat >> "$SNAPSHOT_FILE" << 'RIPGREP_FUNC_END'
  ${q.snippet}
RIPGREP_FUNC_END
    `;
    else {
        let z = q.snippet.replace(/'/g, "'\\''");
        Y += `
      echo '  alias rg='"'${z}'" >> "$SNAPSHOT_FILE"
    `
    }
    if (Y += `
      echo "fi" >> "$SNAPSHOT_FILE"
  `, K) {
        let z = R7([K.cliPath]),
            w = K.args.map(($) => R7([$])),
            H = `${z} ${w.join(" ")}`;
        Y += `

      # Check for mcp-cli availability
      echo "# Check for mcp-cli availability" >> "$SNAPSHOT_FILE"
      echo "if ! command -v mcp-cli >/dev/null 2>&1; then" >> "$SNAPSHOT_FILE"
      echo '  alias mcp-cli='"'${H.replace(/'/g,"'\\''")}'" >> "$SNAPSHOT_FILE"
      echo "fi" >> "$SNAPSHOT_FILE"
    `
    }
    return Y += `

      # Add PATH to the file
      echo "export PATH=${R7([A||""])}" >> "$SNAPSHOT_FILE"
  `, Y
}
// @from(Ln 355979, Col 0)
async function HSY(A, q, K) {
    let Y = xRA(A),
        z = Y.endsWith(".zshrc"),
        w = K ? YSY(Y) : !z ? 'echo "shopt -s expand_aliases" >> "$SNAPSHOT_FILE"' : "",
        H = await wSY();
    return `SNAPSHOT_FILE=${R7([q])}
      ${K?`source "${Y}" < /dev/null`:"# No user config file to source"}

      # First, create/clear the snapshot file
      echo "# Snapshot file" >| "$SNAPSHOT_FILE"

      # When this file is sourced, we first unalias to avoid conflicts
      # This is necessary because aliases get "frozen" inside function definitions at definition time,
      # which can cause unexpected behavior when functions use commands that conflict with aliases
      echo "# Unset all aliases to avoid conflicts with functions" >> "$SNAPSHOT_FILE"
      echo "unalias -a 2>/dev/null || true" >> "$SNAPSHOT_FILE"

      ${w}

      ${H}

      # Exit silently on success, only report errors
      if [ ! -f "$SNAPSHOT_FILE" ]; then
        echo "Error: Snapshot file was not created at $SNAPSHOT_FILE" >&2
        exit 1
      fi
    `
}
// @from(Ln 356007, Col 4)
hRA = "\\"
// @from(Ln 356008, Col 4)
yc4 = 1e4
// @from(Ln 356009, Col 4)
Cc4 = async (A) => {
        let q = A.includes("zsh") ? "zsh" : A.includes("bash") ? "bash" : "sh";
        return h(`Creating shell snapshot for ${q} (${A})`), new Promise(async (K) => {
            try {
                let Y = xRA(A);
                h(`Looking for shell config file: ${Y}`);
                let z = Lg1(Y);
                if (!z) h(`Shell config file not found: ${Y}, creating snapshot with Claude Code defaults only`);
                let w = Date.now(),
                    H = Math.random().toString(36).substring(2, 8),
                    $ = IRA(O8(), "shell-snapshots");
                h(`Snapshots directory: ${$}`);
                let O = IRA($, `snapshot-${q}-${w}-${H}.sh`);
                eCY($, {
                    recursive: !0
                });
                let _ = await HSY(A, O, z);
                h(`Creating snapshot at: ${O}`), h(`Shell binary exists: ${Lg1(A)}`), h(`Execution timeout: ${yc4}ms`), qSY(A, ["-c", "-l", _], {
                    env: {
                        ...process.env.CLAUDE_CODE_DONT_INHERIT_ENV ? {} : process.env,
                        SHELL: A,
                        GIT_EDITOR: "true",
                        CLAUDECODE: "1"
                    },
                    timeout: yc4,
                    maxBuffer: 1048576,
                    encoding: "utf8"
                }, async (J, X, D) => {
                    if (J) {
                        let j = J;
                        if (h(`Shell snapshot creation failed: ${J.message}`), h("Error details:"), h(`  - Error code: ${j?.code}`), h(`  - Error signal: ${j?.signal}`), h(`  - Error killed: ${j?.killed}`), h(`  - Shell path: ${A}`), h(`  - Config file: ${xRA(A)}`), h(`  - Config file exists: ${z}`), h(`  - Working directory: ${h6()}`), h(`  - Claude home: ${O8()}`), h(`Full snapshot script:
${_}`), X) h(`stdout output (${X.length} chars):
${X}`);
                        else h("No stdout output captured");
                        if (D) h(`stderr output (${D.length} chars): ${D}`);
                        else h("No stderr output captured");
                        K1(Error(`Failed to create shell snapshot: ${J.message}`));
                        let M = j?.signal ? xW6.constants.signals[j.signal] : void 0;
                        c("tengu_shell_snapshot_failed", {
                            stderr_length: D?.length || 0,
                            has_error_code: !!j?.code,
                            error_signal_number: M,
                            error_killed: j?.killed
                        }), K(void 0)
                    } else if (Lg1(O)) {
                        let j = tCY(O).size;
                        h(`Shell snapshot created successfully (${j} bytes)`), Tq(async () => {
                            try {
                                if (Lg1(O)) b1().unlinkSync(O), h(`Cleaned up session snapshot: ${O}`)
                            } catch (M) {
                                h(`Error cleaning up session snapshot: ${M}`)
                            }
                        }), K(O)
                    } else {
                        h(`Shell snapshot file not found after creation: ${O}`), h(`Checking if parent directory still exists: ${$}`);
                        let j = Lg1($);
                        if (h(`Parent directory exists: ${j}`), j) try {
                            let M = b1().readdirSync($);
                            h(`Directory contains ${M.length} files`)
                        } catch (M) {
                            h(`Could not read directory contents: ${M}`)
                        }
                        c("tengu_shell_unknown_error", {}), K(void 0)
                    }
                })
            } catch (Y) {
                if (h(`Unexpected error during snapshot creation: ${Y}`), Y instanceof Error) h(`Error stack trace: ${Y.stack}`);
                K1(Y instanceof Error ? Y : Error(String(Y))), c("tengu_shell_snapshot_error", {}), K(void 0)
            }
        })
    }
// @from(Ln 356080, Col 4)
Sc4 = v(() => {
    M_();
    Bf();
    y6();
    u6();
    hA();
    Tz();
    _8();
    x3();
    Z6();
    ix();
    N7();
    Sw1();
    Tj()
})
// @from(Ln 356096, Col 0)
function xc4() {
    if (!hc4 || Ic4 === null) return null;
    return `${hc4},${Ic4},0`
}
// @from(Ln 356100, Col 4)
hc4 = null
// @from(Ln 356101, Col 4)
Ic4 = null
// @from(Ln 356102, Col 4)
bc4 = v(() => {
    tq();
    Z6();
    y6();
    Tz()
})
// @from(Ln 356130, Col 0)
function uRA(A) {
    try {
        return PSY(A, $SY.X_OK), !0
    } catch (q) {
        try {
            return XSY(A, ["--version"], {
                timeout: 1000,
                stdio: "ignore"
            }), !0
        } catch {
            return !1
        }
    }
}
// @from(Ln 356145, Col 0)
function GSY(A) {
    if (process.env.CLAUDE_CODE_SHELL_PREFIX) return "{ shopt -u extglob || setopt NO_EXTENDED_GLOB; } >/dev/null 2>&1 || true";
    if (A.includes("bash")) return "shopt -u extglob 2>/dev/null || true";
    else if (A.includes("zsh")) return "setopt NO_EXTENDED_GLOB 2>/dev/null || true";
    return null
}
// @from(Ln 356151, Col 0)
async function ZSY() {
    let A = process.env.CLAUDE_CODE_SHELL;
    if (A)
        if ((A.includes("bash") || A.includes("zsh")) && uRA(A)) return h(`Using shell override: ${A}`), A;
        else h(`CLAUDE_CODE_SHELL="${A}" is not a valid bash/zsh path, falling back to detection`);
    let q = process.env.SHELL,
        K = q && (q.includes("bash") || q.includes("zsh")),
        Y = q?.includes("bash"),
        [z, w] = await Promise.all([mf("zsh"), mf("bash")]),
        H = ["/bin", "/usr/bin", "/usr/local/bin", "/opt/homebrew/bin"],
        O = (Y ? ["bash", "zsh"] : ["zsh", "bash"]).flatMap((J) => H.map((X) => `${X}/${J}`));
    if (Y) {
        if (w) O.unshift(w);
        if (z) O.push(z)
    } else {
        if (z) O.unshift(z);
        if (w) O.push(w)
    }
    if (K && uRA(q)) O.unshift(q);
    let _ = O.find((J) => J && uRA(J));
    if (!_) {
        let J = "No suitable shell found. Claude CLI requires a Posix shell environment. Please ensure you have a valid shell installed and the SHELL environment variable set.";
        throw K1(Error(J)), Error(J)
    }
    return _
}
// @from(Ln 356177, Col 0)
async function fSY() {
    let A = await ZSY(),
        q;
    try {
        q = await Cc4(A)
    } catch (K) {
        h(`Failed to create shell snapshot: ${K}`), q = void 0
    }
    return {
        binShell: A,
        snapshotFilePath: q
    }
}
// @from(Ln 356190, Col 0)
async function bW6(A, q, K, Y, z, w, H, $) {
    let O = K || WSY,
        {
            binShell: _,
            snapshotFilePath: J
        } = await BRA();
    if (Y) _ = Y, J = void 0;
    let X = Math.floor(Math.random() * 65536).toString(16).padStart(4, "0"),
        D = uc4.tmpdir();
    if (eA() === "windows") D = px(D);
    let j = bRA(process.env.CLAUDE_CODE_TMPDIR || "/tmp", mRA()),
        M = H ? bRA(j, `cwd-${X}`) : bRA(D, `claude-${X}-cwd`),
        P = vc4(A),
        W = Tc4(A, P);
    if (!H && A.includes("|") && P) W = Lc4(A);
    let G = [];
    if (J) {
        if (!_SY(J)) h(`Snapshot file missing, recreating: ${J}`), BRA.cache?.clear?.(), J = (await BRA()).snapshotFilePath;
        if (J) {
            let B = eA() === "windows" ? px(J) : J;
            G.push(`source ${R7([B])}`)
        }
    }
    let f = xd7();
    if (f) G.push(f);
    let Z = GSY(_);
    if (Z) G.push(Z);
    G.push(`eval ${W}`), G.push(`pwd -P >| ${M}`);
    let N = G.join(" && ");
    if (process.env.CLAUDE_CODE_SHELL_PREFIX) N = Q_6(process.env.CLAUDE_CODE_SHELL_PREFIX, N);
    let T = io1();
    if (q.aborted) return Rd7();
    if (H) {
        N = await b8.wrapWithSandbox(N, _, void 0, q);
        try {
            b1().mkdirSync(j, {
                mode: 448
            })
        } catch (B) {
            h(`Failed to create ${j} directory: ${B}`)
        }
    }
    let k = J6(process.env.CLAUDE_BASH_NO_LOGIN) && J !== void 0,
        y = ["-c", ...k ? [] : ["-l"], N];
    if (k) h("Spawning shell without login (-l flag skipped)");
    try {
        let B = A.includes("tmux"),
            S = xc4(),
            m = DSY(_, y, {
                env: {
                    ...process.env,
                    SHELL: _,
                    GIT_EDITOR: "true",
                    CLAUDECODE: "1",
                    ...{},
                    ...H ? {
                        TMPDIR: j,
                        CLAUDE_CODE_TMPDIR: j
                    } : {},
                    ...S ? {
                        TMUX: S
                    } : {}
                },
                cwd: T,
                detached: !0,
                windowsHide: !0
            }),
            b = F_6(m, q, O, z, $);
        return b.result.then(async (g) => {
            if (g && !w && !g.backgroundTaskId) try {
                lZ(OSY(M, {
                    encoding: "utf8"
                }).trim(), T)
            } catch {
                c("tengu_shell_set_cwd", {
                    success: !1
                })
            }
            try {
                JSY(M)
            } catch {}
        }), b
    } catch (B) {
        return h(`Shell exec error: ${B instanceof Error?B.message:String(B)}`), {
            status: "killed",
            background: () => null,
            kill: () => {},
            cleanup: () => {},
            result: Promise.resolve({
                code: 126,
                stdout: "",
                stderr: B instanceof Error ? B.message : String(B),
                interrupted: !1
            })
        }
    }
}
// @from(Ln 356288, Col 0)
function lZ(A, q) {
    let K = jSY(A) ? A : MSY(q || b1().cwd(), A);
    if (!b1().existsSync(K)) throw Error(`Path "${K}" does not exist`);
    let Y = b1().realpathSync(K);
    PL6(Y);
    try {
        c("tengu_shell_set_cwd", {
            success: !0
        })
    } catch (z) {}
}
// @from(Ln 356299, Col 4)
WSY = 1800000
// @from(Ln 356300, Col 4)
BRA
// @from(Ln 356301, Col 4)
VI = v(() => {
    M_();
    ujA();
    Ec4();
    WQ();
    y6();
    u6();
    bjA();
    _8();
    B6();
    Sw1();
    x3();
    Z6();
    Rc4();
    Sc4();
    zq();
    N7();
    k2();
    g_6();
    E2();
    bc4();
    hA();
    BRA = KA(fSY)
})
// @from(Ln 356325, Col 0)
async function Bc4() {
    let {
        code: A
    } = await IA("tmux", ["-V"]);
    return A === 0
}
// @from(Ln 356332, Col 0)
function mc4() {
    switch (eA()) {
        case "macos":
            return "Install tmux with: brew install tmux";
        case "linux":
        case "wsl":
            return "Install tmux with: sudo apt install tmux (Debian/Ubuntu) or sudo dnf install tmux (Fedora/RHEL)";
        case "windows":
            return "tmux is not natively available on Windows. Consider using WSL or Cygwin.";
        default:
            return "Install tmux using your system package manager."
    }
}
// @from(Ln 356345, Col 4)
Et = v(() => {
    tq();
    N7();
    _8();
    h9();
    Z6();
    cA();
    p8();
    x3();
    Lm();
    Ez()
})
// @from(Ln 356357, Col 4)
e_H
// @from(Ln 356357, Col 9)
AJH
// @from(Ln 356358, Col 4)
Fc4 = v(() => {
    i7();
    Nc4();
    h9();
    N7();
    VI();
    B6();
    dD();
    Et();
    mX();
    tq();
    u6();
    e_H = z7(() => u.strictObject({
        name: u.string().optional().describe("Optional name for the worktree. A random name is generated if not provided.")
    })), AJH = z7(() => u.object({
        worktreePath: u.string(),
        worktreeBranch: u.string(),
        message: u.string()
    }))
})
// @from(Ln 356378, Col 4)
FRA
// @from(Ln 356378, Col 9)
QRA
// @from(Ln 356378, Col 14)
Qc4
// @from(Ln 356379, Col 4)
gRA = v(() => {
    FRA = ["auto", "iterm2", "iterm2_with_bell", "terminal_bell", "kitty", "notifications_disabled"], QRA = ["normal", "vim"], Qc4 = ["auto", "tmux", "in-process"]
})
// @from(Ln 356383, Col 0)
function TSY(A) {
    let q = A.find((z) => z.role === "user");
    if (!q) return "";
    let K = q.content;
    if (typeof K === "string") return K;
    let Y = K.find((z) => z.type === "text");
    return Y?.type === "text" ? Y.text : ""
}
// @from(Ln 356391, Col 0)
async function h51(A) {
    let {
        model: q,
        system: K,
        messages: Y,
        tools: z,
        tool_choice: w,
        output_format: H,
        max_tokens: $ = 1024,
        maxRetries: O = 2,
        signal: _,
        skipSystemPromptPrefix: J,
        temperature: X,
        thinking: D
    } = A, j = await US({
        maxRetries: O,
        model: q
    }), M = [...vT(q)];
    if (H && !M.includes(hl)) M.push(hl);
    let P = TSY(Y),
        W = m7A(P, {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.38",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-02-10T00:04:56Z"
        }.VERSION),
        G = lq6(W),
        f = [G ? {
            type: "text",
            text: G
        } : null, ...J ? [] : [{
            type: "text",
            text: cq6({
                isNonInteractive: !1,
                hasAppendSystemPrompt: !1
            })
        }], ...Array.isArray(K) ? K : K ? [{
            type: "text",
            text: K
        }] : []].filter((T) => T !== null),
        Z = D ? {
            type: "enabled",
            budget_tokens: D
        } : void 0;
    return await j.beta.messages.create({
        model: dg(q),
        max_tokens: $,
        system: f,
        messages: Y,
        ...z && {
            tools: z
        },
        ...w && {
            tool_choice: w
        },
        ...H && {
            output_config: {
                format: H
            }
        },
        ...X !== void 0 && {
            temperature: X
        },
        ...Z && {
            thinking: Z
        },
        ...M.length > 0 && {
            betas: M
        },
        metadata: ko()
    }, {
        signal: _
    })
}
// @from(Ln 356467, Col 4)
Rg1 = v(() => {
    Ax1();
    yw();
    Wk();
    e11();
    iq6();
    F7A();
    e7()
})
// @from(Ln 356476, Col 0)
async function uW6(A) {
    let q = A.trim();
    if (!q) return {
        valid: !1,
        error: "Model name cannot be empty"
    };
    let K = q.toLowerCase();
    if (g_1.includes(K)) return {
        valid: !0
    };
    if (gc4.has(q)) return {
        valid: !0
    };
    try {
        return await h51({
            model: q,
            max_tokens: 1,
            maxRetries: 0,
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
        }), gc4.set(q, !0), {
            valid: !0
        }
    } catch (Y) {
        return vSY(Y, q)
    }
}
// @from(Ln 356512, Col 0)
function vSY(A, q) {
    if (A instanceof b81) return {
        valid: !1,
        error: `Model '${q}' not found`
    };
    if (A instanceof k4) {
        if (A instanceof x81) return {
            valid: !1,
            error: "Authentication failed. Please check your API credentials."
        };
        if (A instanceof OW) return {
            valid: !1,
            error: "Network error. Please check your internet connection."
        };
        let Y = A.error;
        if (Y && typeof Y === "object" && "type" in Y && Y.type === "not_found_error" && "message" in Y && typeof Y.message === "string" && Y.message.includes("model:")) return {
            valid: !1,
            error: `Model '${q}' not found`
        };
        return {
            valid: !1,
            error: `API error: ${A.message}`
        }
    }
    return {
        valid: !1,
        error: `Unable to validate model: ${A instanceof Error?A.message:String(A)}`
    }
}
// @from(Ln 356541, Col 4)
gc4
// @from(Ln 356542, Col 4)
URA = v(() => {
    e7();
    Rg1();
    GV();
    gc4 = new Map
})
// @from(Ln 356548, Col 4)
ESY
// @from(Ln 356549, Col 4)
pRA = v(() => {
    Wu();
    gRA();
    URA();
    e7();
    ESY = {
        theme: {
            source: "global",
            type: "string",
            description: "Color theme for the UI",
            options: eA7
        },
        editorMode: {
            source: "global",
            type: "string",
            description: "Key binding mode",
            options: QRA
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
            options: FRA
        },
        autoCompactEnabled: {
            source: "global",
            type: "boolean",
            description: "Auto-compact when context is full"
        },
        autoMemoryEnabled: {
            source: "settings",
            type: "boolean",
            description: "Enable auto-memory (research preview)"
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
                    return O71().filter((A) => A.value !== null).map((A) => A.value)
                } catch {
                    return ["sonnet", "opus", "haiku"]
                }
            },
            validateOnWrite: (A) => uW6(String(A)),
            formatOnRead: (A) => A === null ? "default" : A
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
            options: ["default", "plan", "acceptEdits", "dontAsk"]
        },
        language: {
            source: "settings",
            type: "string",
            description: 'Preferred language for Claude responses (e.g., "japanese", "spanish")'
        },
        teammateMode: {
            source: "global",
            type: "string",
            description: 'How to spawn teammates: "tmux" for traditional tmux, "in-process" for same process, "auto" to choose automatically',
            options: Qc4
        },
        ...{}
    }
})
// @from(Ln 356645, Col 4)
Uc4 = v(() => {
    pRA();
    e7()
})
// @from(Ln 356649, Col 4)
LSY
// @from(Ln 356650, Col 4)
pc4 = v(() => {
    m1();
    UO();
    eq();
    m6();
    LSY = o(X1(), 1)
})
// @from(Ln 356657, Col 4)
qXH
// @from(Ln 356657, Col 9)
KXH
// @from(Ln 356658, Col 4)
dc4 = v(() => {
    i7();
    Uc4();
    pRA();
    pc4();
    cA();
    p8();
    u6();
    y6();
    m6();
    T_6();
    qXH = z7(() => u.strictObject({
        setting: u.string().describe('The setting key (e.g., "theme", "model", "permissions.defaultMode")'),
        value: u.union([u.string(), u.boolean(), u.number()]).optional().describe("The new value. Omit to get current value.")
    })), KXH = z7(() => u.object({
        success: u.boolean(),
        operation: u.enum(["get", "set"]).optional(),
        setting: u.string().optional(),
        value: u.unknown().optional(),
        previousValue: u.unknown().optional(),
        newValue: u.unknown().optional(),
        error: u.string().optional()
    }))
})
// @from(Ln 356683, Col 0)
function lc4() {
    let A = l8() ? " and potentially assigned to teammates" : "",
        q = l8() ? "- New tasks are created with status 'pending' and no owner - use TaskUpdate with the `owner` parameter to assign them\n" : "";
    return `Use this tool to create a structured task list for your current coding session. This helps you track progress, organize complex tasks, and demonstrate thoroughness to the user.
It also helps the user understand the progress of the task and overall progress of their requests.

## When to Use This Tool

Use this tool proactively in these scenarios:

- Complex multi-step tasks - When a task requires 3 or more distinct steps or actions
- Non-trivial and complex tasks - Tasks that require careful planning or multiple operations${A}
- Plan mode - When using plan mode, create a task list to track the work
- User explicitly requests todo list - When the user directly asks you to use the todo list
- User provides multiple tasks - When users provide a list of things to be done (numbered or comma-separated)
- After receiving new instructions - Immediately capture user requirements as tasks
- When you start working on a task - Mark it as in_progress BEFORE beginning work
- After completing a task - Mark it as completed and add any new follow-up tasks discovered during implementation

## When NOT to Use This Tool

Skip using this tool when:
- There is only a single, straightforward task
- The task is trivial and tracking it provides no organizational benefit
- The task can be completed in less than 3 trivial steps
- The task is purely conversational or informational

NOTE that you should not use this tool if there is only one trivial task to do. In this case you are better off just doing the task directly.

## Task Fields

- **subject**: A brief, actionable title in imperative form (e.g., "Fix authentication bug in login flow")
- **description**: Detailed description of what needs to be done, including context and acceptance criteria
- **activeForm**: Present continuous form shown in spinner when task is in_progress (e.g., "Fixing authentication bug"). This is displayed to the user while you work on the task.

**IMPORTANT**: Always provide activeForm when creating tasks. The subject should be imperative ("Run tests") while activeForm should be present continuous ("Running tests"). All tasks are created with status \`pending\`.

## Tips

- Create tasks with clear, specific subjects that describe the outcome
- Include enough detail in the description for another agent to understand and complete the task
- After creating tasks, use TaskUpdate to set up dependencies (blocks/blockedBy) if needed
${q}- Check TaskList first to avoid creating duplicate tasks
`
}
// @from(Ln 356728, Col 4)
cc4 = "Create a new task in the task list"
// @from(Ln 356729, Col 4)
ic4 = v(() => {
    S9()
})
// @from(Ln 356733, Col 0)
function nc4() {
    return null
}
// @from(Ln 356737, Col 0)
function rc4() {
    return null
}
// @from(Ln 356741, Col 0)
function oc4() {
    return null
}
// @from(Ln 356745, Col 0)
function ac4() {
    return null
}
// @from(Ln 356749, Col 0)
function sc4(A) {
    return null
}
// @from(Ln 356752, Col 4)
RSY
// @from(Ln 356752, Col 9)
ySY
// @from(Ln 356752, Col 14)
tc4
// @from(Ln 356753, Col 4)
ec4 = v(() => {
    i7();
    ic4();
    vw();
    RSY = z7(() => u.strictObject({
        subject: u.string().describe("A brief title for the task"),
        description: u.string().describe("A detailed description of what needs to be done"),
        activeForm: u.string().optional().describe('Present continuous form shown in spinner when in_progress (e.g., "Running tests")'),
        metadata: u.record(u.string(), u.unknown()).optional().describe("Arbitrary metadata to attach to the task")
    })), ySY = z7(() => u.object({
        task: u.object({
            id: u.string(),
            subject: u.string()
        })
    })), tc4 = {
        name: Nh,
        maxResultSizeChars: 1e5,
        async description() {
            return cc4
        },
        async prompt() {
            return lc4()
        },
        get inputSchema() {
            return RSY()
        },
        get outputSchema() {
            return ySY()
        },
        userFacingName() {
            return "TaskCreate"
        },
        isEnabled() {
            return jH()
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !1
        },
        async checkPermissions(A) {
            return {
                behavior: "allow",
                updatedInput: A
            }
        },
        renderToolUseMessage: nc4,
        renderToolUseProgressMessage: rc4,
        renderToolUseRejectedMessage: oc4,
        renderToolUseErrorMessage: ac4,
        renderToolResultMessage: sc4,
        async call({
            subject: A,
            description: q,
            activeForm: K,
            metadata: Y
        }, z) {
            let w = n_1(WM(), {
                subject: A,
                description: q,
                activeForm: K,
                status: "pending",
                owner: void 0,
                blocks: [],
                blockedBy: [],
                metadata: Y
            });
            return z.setAppState((H) => {
                if (H.expandedView === "tasks") return H;
                return {
                    ...H,
                    expandedView: "tasks"
                }
            }), {
                data: {
                    task: {
                        id: w,
                        subject: A
                    }
                }
            }
        },
        mapToolResultToToolResultBlockParam(A, q) {
            let {
                task: K
            } = A;
            return {
                tool_use_id: q,
                type: "tool_result",
                content: `Task #${K.id} created successfully: ${K.subject}`
            }
        }
    }
})
// @from(Ln 356848, Col 4)
Al4 = "Get a task by ID from the task list"
// @from(Ln 356849, Col 4)
ql4 = `Use this tool to retrieve a task by its ID from the task list.

## When to Use This Tool

- When you need the full description and context before starting work on a task
- To understand task dependencies (what it blocks, what blocks it)
- After being assigned a task, to get complete requirements

## Output

Returns full task details:
- **subject**: Task title
- **description**: Detailed requirements and context
- **status**: 'pending', 'in_progress', or 'completed'
- **blocks**: Tasks waiting on this one to complete
- **blockedBy**: Tasks that must complete before this one can start

## Tips

- After fetching a task, verify its blockedBy list is empty before beginning work.
- Use TaskList to see all tasks in summary form.
`
// @from(Ln 356872, Col 0)
function Kl4() {
    return null
}
// @from(Ln 356876, Col 0)
function Yl4() {
    return null
}
// @from(Ln 356880, Col 0)
function zl4() {
    return null
}
// @from(Ln 356884, Col 0)
function wl4() {
    return null
}
// @from(Ln 356888, Col 0)
function Hl4() {
    return null
}
// @from(Ln 356891, Col 4)
CSY
// @from(Ln 356891, Col 9)
SSY
// @from(Ln 356891, Col 14)
$l4
// @from(Ln 356892, Col 4)
Ol4 = v(() => {
    i7();
    vw();
    CSY = z7(() => u.strictObject({
        taskId: u.string().describe("The ID of the task to retrieve")
    })), SSY = z7(() => u.object({
        task: u.object({
            id: u.string(),
            subject: u.string(),
            description: u.string(),
            status: J71,
            blocks: u.array(u.string()),
            blockedBy: u.array(u.string())
        }).nullable()
    })), $l4 = {
        name: NK1,
        maxResultSizeChars: 1e5,
        async description() {
            return Al4
        },
        async prompt() {
            return ql4
        },
        get inputSchema() {
            return CSY()
        },
        get outputSchema() {
            return SSY()
        },
        userFacingName() {
            return "TaskGet"
        },
        isEnabled() {
            return jH()
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        async checkPermissions(A) {
            return {
                behavior: "allow",
                updatedInput: A
            }
        },
        renderToolUseMessage: Kl4,
        renderToolUseProgressMessage: Yl4,
        renderToolUseRejectedMessage: zl4,
        renderToolUseErrorMessage: wl4,
        renderToolResultMessage: Hl4,
        async call({
            taskId: A
        }) {
            let q = WM(),
                K = lg(q, A);
            if (!K) return {
                data: {
                    task: null
                }
            };
            return {
                data: {
                    task: {
                        id: K.id,
                        subject: K.subject,
                        description: K.description,
                        status: K.status,
                        blocks: K.blocks,
                        blockedBy: K.blockedBy
                    }
                }
            }
        },
        mapToolResultToToolResultBlockParam(A, q) {
            let {
                task: K
            } = A;
            if (!K) return {
                tool_use_id: q,
                type: "tool_result",
                content: "Task not found"
            };
            let Y = [`Task #${K.id}: ${K.subject}`, `Status: ${K.status}`, `Description: ${K.description}`];
            if (K.blockedBy.length > 0) Y.push(`Blocked by: ${K.blockedBy.map((z)=>`#${z}`).join(", ")}`);
            if (K.blocks.length > 0) Y.push(`Blocks: ${K.blocks.map((z)=>`#${z}`).join(", ")}`);
            return {
                tool_use_id: q,
                type: "tool_result",
                content: Y.join(`
`)
            }
        }
    }
})
// @from(Ln 356988, Col 4)
_l4 = "Update a task in the task list"
// @from(Ln 356989, Col 4)
Jl4 = `Use this tool to update a task in the task list.

## When to Use This Tool

**Mark tasks as resolved:**
- When you have completed the work described in a task
- When a task is no longer needed or has been superseded
- IMPORTANT: Always mark your assigned tasks as resolved when you finish them
- After resolving, call TaskList to find your next task

- ONLY mark a task as completed when you have FULLY accomplished it
- If you encounter errors, blockers, or cannot finish, keep the task as in_progress
- When blocked, create a new task describing what needs to be resolved
- Never mark a task as completed if:
  - Tests are failing
  - Implementation is partial
  - You encountered unresolved errors
  - You couldn't find necessary files or dependencies

**Delete tasks:**
- When a task is no longer relevant or was created in error
- Setting status to \`deleted\` permanently removes the task

**Update task details:**
- When requirements change or become clearer
- When establishing dependencies between tasks

## Fields You Can Update

- **status**: The task status (see Status Workflow below)
- **subject**: Change the task title (imperative form, e.g., "Run tests")
- **description**: Change the task description
- **activeForm**: Present continuous form shown in spinner when in_progress (e.g., "Running tests")
- **owner**: Change the task owner (agent name)
- **metadata**: Merge metadata keys into the task (set a key to null to delete it)
- **addBlocks**: Mark tasks that cannot start until this one completes
- **addBlockedBy**: Mark tasks that must complete before this one can start

## Status Workflow

Status progresses: \`pending\` → \`in_progress\` → \`completed\`

Use \`deleted\` to permanently remove a task.

## Staleness

Make sure to read a task's latest state using \`TaskGet\` before updating it.

## Examples

Mark task as in progress when starting work:
\`\`\`json
{"taskId": "1", "status": "in_progress"}
\`\`\`

Mark task as completed after finishing work:
\`\`\`json
{"taskId": "1", "status": "completed"}
\`\`\`

Delete a task:
\`\`\`json
{"taskId": "1", "status": "deleted"}
\`\`\`

Claim a task by setting owner:
\`\`\`json
{"taskId": "1", "owner": "my-name"}
\`\`\`

Set up task dependencies:
\`\`\`json
{"taskId": "2", "addBlockedBy": ["1"]}
\`\`\`
`
// @from(Ln 357065, Col 0)
function Xl4() {
    return null
}
// @from(Ln 357069, Col 0)
function Dl4() {
    return null
}
// @from(Ln 357073, Col 0)
function jl4() {
    return null
}
// @from(Ln 357077, Col 0)
function Ml4() {
    return null
}
// @from(Ln 357081, Col 0)
function Pl4(A) {
    return null
}
// @from(Ln 357084, Col 4)
hSY
// @from(Ln 357084, Col 9)
ISY
// @from(Ln 357084, Col 14)
Wl4