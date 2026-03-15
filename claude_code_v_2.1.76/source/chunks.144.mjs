
// @from(Ln 363714, Col 4)
I1q = E(() => {
    K7();
    C1q = F6(() => {
        let A = C.strictObject({
                operation: C.literal("goToDefinition"),
                filePath: C.string().describe("The absolute or relative path to the file"),
                line: C.number().int().positive().describe("The line number (1-based, as shown in editors)"),
                character: C.number().int().positive().describe("The character offset (1-based, as shown in editors)")
            }),
            q = C.strictObject({
                operation: C.literal("findReferences"),
                filePath: C.string().describe("The absolute or relative path to the file"),
                line: C.number().int().positive().describe("The line number (1-based, as shown in editors)"),
                character: C.number().int().positive().describe("The character offset (1-based, as shown in editors)")
            }),
            K = C.strictObject({
                operation: C.literal("hover"),
                filePath: C.string().describe("The absolute or relative path to the file"),
                line: C.number().int().positive().describe("The line number (1-based, as shown in editors)"),
                character: C.number().int().positive().describe("The character offset (1-based, as shown in editors)")
            }),
            Y = C.strictObject({
                operation: C.literal("documentSymbol"),
                filePath: C.string().describe("The absolute or relative path to the file"),
                line: C.number().int().positive().describe("The line number (1-based, as shown in editors)"),
                character: C.number().int().positive().describe("The character offset (1-based, as shown in editors)")
            }),
            z = C.strictObject({
                operation: C.literal("workspaceSymbol"),
                filePath: C.string().describe("The absolute or relative path to the file"),
                line: C.number().int().positive().describe("The line number (1-based, as shown in editors)"),
                character: C.number().int().positive().describe("The character offset (1-based, as shown in editors)")
            }),
            _ = C.strictObject({
                operation: C.literal("goToImplementation"),
                filePath: C.string().describe("The absolute or relative path to the file"),
                line: C.number().int().positive().describe("The line number (1-based, as shown in editors)"),
                character: C.number().int().positive().describe("The character offset (1-based, as shown in editors)")
            }),
            w = C.strictObject({
                operation: C.literal("prepareCallHierarchy"),
                filePath: C.string().describe("The absolute or relative path to the file"),
                line: C.number().int().positive().describe("The line number (1-based, as shown in editors)"),
                character: C.number().int().positive().describe("The character offset (1-based, as shown in editors)")
            }),
            O = C.strictObject({
                operation: C.literal("incomingCalls"),
                filePath: C.string().describe("The absolute or relative path to the file"),
                line: C.number().int().positive().describe("The line number (1-based, as shown in editors)"),
                character: C.number().int().positive().describe("The character offset (1-based, as shown in editors)")
            }),
            $ = C.strictObject({
                operation: C.literal("outgoingCalls"),
                filePath: C.string().describe("The absolute or relative path to the file"),
                line: C.number().int().positive().describe("The line number (1-based, as shown in editors)"),
                character: C.number().int().positive().describe("The character offset (1-based, as shown in editors)")
            });
        return C.discriminatedUnion("operation", [A, q, K, Y, z, _, w, O, $])
    })
})
// @from(Ln 363778, Col 0)
function el6(A, q) {
    if (!A) return k("formatUri called with undefined URI - indicates malformed LSP server response", {
        level: "warn"
    }), "<unknown location>";
    let K = A.replace(/^file:\/\//, "");
    if (/^\/[A-Za-z]:/.test(K)) K = K.slice(1);
    try {
        K = decodeURIComponent(K)
    } catch (Y) {
        let z = _1(Y);
        k(`Failed to decode LSP URI '${A}': ${z}. Using un-decoded path: ${K}`, {
            level: "warn"
        })
    }
    if (q) {
        let Y = $IY(q, K).replaceAll("\\", "/");
        if (Y.length < K.length && !Y.startsWith("../../")) return Y
    }
    return K.replaceAll("\\", "/")
}
// @from(Ln 363799, Col 0)
function m1q(A, q) {
    let K = new Map;
    for (let Y of A) {
        let z = "uri" in Y ? Y.uri : Y.location.uri,
            _ = el6(z, q),
            w = K.get(_);
        if (w) w.push(Y);
        else K.set(_, [Y])
    }
    return K
}
// @from(Ln 363811, Col 0)
function rk1(A, q) {
    let K = el6(A.uri, q),
        Y = A.range.start.line + 1,
        z = A.range.start.character + 1;
    return `${K}:${Y}:${z}`
}
// @from(Ln 363818, Col 0)
function b1q(A) {
    return {
        uri: A.targetUri,
        range: A.targetSelectionRange || A.targetRange
    }
}
// @from(Ln 363825, Col 0)
function x1q(A) {
    return "targetUri" in A
}
// @from(Ln 363829, Col 0)
function KF8(A, q) {
    if (!A) return "No definition found. This may occur if the cursor is not on a symbol, or if the definition is in an external library not indexed by the LSP server.";
    if (Array.isArray(A)) {
        let Y = A.map((O) => x1q(O) ? b1q(O) : O),
            z = Y.filter((O) => !O || !O.uri);
        if (z.length > 0) k(`formatGoToDefinitionResult: Filtering out ${z.length} invalid location(s) - this should have been caught earlier`, {
            level: "warn"
        });
        let _ = Y.filter((O) => O && O.uri);
        if (_.length === 0) return "No definition found. This may occur if the cursor is not on a symbol, or if the definition is in an external library not indexed by the LSP server.";
        if (_.length === 1) return `Defined in ${rk1(_[0],q)}`;
        let w = _.map((O) => `  ${rk1(O,q)}`).join(`
`);
        return `Found ${_.length} definitions:
${w}`
    }
    let K = x1q(A) ? b1q(A) : A;
    return `Defined in ${rk1(K,q)}`
}
// @from(Ln 363849, Col 0)
function B1q(A, q) {
    if (!A || A.length === 0) return "No references found. This may occur if the symbol has no usages, or if the LSP server has not fully indexed the workspace.";
    let K = A.filter((w) => !w || !w.uri);
    if (K.length > 0) k(`formatFindReferencesResult: Filtering out ${K.length} invalid location(s) - this should have been caught earlier`, {
        level: "warn"
    });
    let Y = A.filter((w) => w && w.uri);
    if (Y.length === 0) return "No references found. This may occur if the symbol has no usages, or if the LSP server has not fully indexed the workspace.";
    if (Y.length === 1) return `Found 1 reference:
  ${rk1(Y[0],q)}`;
    let z = m1q(Y, q),
        _ = [`Found ${Y.length} references across ${z.size} files:`];
    for (let [w, O] of z) {
        _.push(`
${w}:`);
        for (let $ of O) {
            let H = $.range.start.line + 1,
                j = $.range.start.character + 1;
            _.push(`  Line ${H}:${j}`)
        }
    }
    return _.join(`
`)
}
// @from(Ln 363874, Col 0)
function HIY(A) {
    if (Array.isArray(A)) return A.map((q) => {
        if (typeof q === "string") return q;
        return q.value
    }).join(`

`);
    if (typeof A === "string") return A;
    if ("kind" in A) return A.value;
    return A.value
}
// @from(Ln 363886, Col 0)
function g1q(A, q) {
    if (!A) return "No hover information available. This may occur if the cursor is not on a symbol, or if the LSP server has not fully indexed the file.";
    let K = HIY(A.contents);
    if (A.range) {
        let Y = A.range.start.line + 1,
            z = A.range.start.character + 1;
        return `Hover info at ${Y}:${z}:

${K}`
    }
    return K
}
// @from(Ln 363899, Col 0)
function ET6(A) {
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
// @from(Ln 363930, Col 0)
function F1q(A, q = 0) {
    let K = [],
        Y = "  ".repeat(q),
        z = ET6(A.kind),
        _ = `${Y}${A.name} (${z})`;
    if (A.detail) _ += ` ${A.detail}`;
    let w = A.range.start.line + 1;
    if (_ += ` - Line ${w}`, K.push(_), A.children && A.children.length > 0)
        for (let O of A.children) K.push(...F1q(O, q + 1));
    return K
}
// @from(Ln 363942, Col 0)
function p1q(A, q) {
    if (!A || A.length === 0) return "No symbols found in document. This may occur if the file is empty, not supported by the LSP server, or if the server has not fully indexed the file.";
    let K = A[0];
    if (K && "location" in K) return YF8(A, q);
    let z = ["Document symbols:"];
    for (let _ of A) z.push(...F1q(_));
    return z.join(`
`)
}
// @from(Ln 363952, Col 0)
function YF8(A, q) {
    if (!A || A.length === 0) return "No symbols found in workspace. This may occur if the workspace is empty, or if the LSP server has not finished indexing the project.";
    let K = A.filter((w) => !w || !w.location || !w.location.uri);
    if (K.length > 0) k(`formatWorkspaceSymbolResult: Filtering out ${K.length} invalid symbol(s) - this should have been caught earlier`, {
        level: "warn"
    });
    let Y = A.filter((w) => w && w.location && w.location.uri);
    if (Y.length === 0) return "No symbols found in workspace. This may occur if the workspace is empty, or if the LSP server has not finished indexing the project.";
    let z = [`Found ${Y.length} symbol${Y.length===1?"":"s"} in workspace:`],
        _ = m1q(Y, q);
    for (let [w, O] of _) {
        z.push(`
${w}:`);
        for (let $ of O) {
            let H = ET6($.kind),
                j = $.location.range.start.line + 1,
                J = `  ${$.name} (${H}) - Line ${j}`;
            if ($.containerName) J += ` in ${$.containerName}`;
            z.push(J)
        }
    }
    return z.join(`
`)
}
// @from(Ln 363977, Col 0)
function u1q(A, q) {
    if (!A.uri) return k("formatCallHierarchyItem: CallHierarchyItem has undefined URI", {
        level: "warn"
    }), `${A.name} (${ET6(A.kind)}) - <unknown location>`;
    let K = el6(A.uri, q),
        Y = A.range.start.line + 1,
        z = ET6(A.kind),
        _ = `${A.name} (${z}) - ${K}:${Y}`;
    if (A.detail) _ += ` [${A.detail}]`;
    return _
}
// @from(Ln 363989, Col 0)
function Q1q(A, q) {
    if (!A || A.length === 0) return "No call hierarchy item found at this position";
    if (A.length === 1) return `Call hierarchy item: ${u1q(A[0],q)}`;
    let K = [`Found ${A.length} call hierarchy items:`];
    for (let Y of A) K.push(`  ${u1q(Y,q)}`);
    return K.join(`
`)
}
// @from(Ln 363998, Col 0)
function U1q(A, q) {
    if (!A || A.length === 0) return "No incoming calls found (nothing calls this function)";
    let K = [`Found ${A.length} incoming call${A.length===1?"":"s"}:`],
        Y = new Map;
    for (let z of A) {
        if (!z.from) {
            k("formatIncomingCallsResult: CallHierarchyIncomingCall has undefined from field", {
                level: "warn"
            });
            continue
        }
        let _ = el6(z.from.uri, q),
            w = Y.get(_);
        if (w) w.push(z);
        else Y.set(_, [z])
    }
    for (let [z, _] of Y) {
        K.push(`
${z}:`);
        for (let w of _) {
            if (!w.from) continue;
            let O = ET6(w.from.kind),
                $ = w.from.range.start.line + 1,
                H = `  ${w.from.name} (${O}) - Line ${$}`;
            if (w.fromRanges && w.fromRanges.length > 0) {
                let j = w.fromRanges.map((J) => `${J.start.line+1}:${J.start.character+1}`).join(", ");
                H += ` [calls at: ${j}]`
            }
            K.push(H)
        }
    }
    return K.join(`
`)
}
// @from(Ln 364033, Col 0)
function d1q(A, q) {
    if (!A || A.length === 0) return "No outgoing calls found (this function calls nothing)";
    let K = [`Found ${A.length} outgoing call${A.length===1?"":"s"}:`],
        Y = new Map;
    for (let z of A) {
        if (!z.to) {
            k("formatOutgoingCallsResult: CallHierarchyOutgoingCall has undefined to field", {
                level: "warn"
            });
            continue
        }
        let _ = el6(z.to.uri, q),
            w = Y.get(_);
        if (w) w.push(z);
        else Y.set(_, [z])
    }
    for (let [z, _] of Y) {
        K.push(`
${z}:`);
        for (let w of _) {
            if (!w.to) continue;
            let O = ET6(w.to.kind),
                $ = w.to.range.start.line + 1,
                H = `  ${w.to.name} (${O}) - Line ${$}`;
            if (w.fromRanges && w.fromRanges.length > 0) {
                let j = w.fromRanges.map((J) => `${J.start.line+1}:${J.start.character+1}`).join(", ");
                H += ` [called from: ${j}]`
            }
            K.push(H)
        }
    }
    return K.join(`
`)
}
// @from(Ln 364067, Col 4)
c1q = E(() => {
    H1();
    s8()
})
// @from(Ln 364071, Col 4)
Ai6 = "LSP"
// @from(Ln 364072, Col 4)
zF8 = `Interact with Language Server Protocol (LSP) servers to get code intelligence features.

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
// @from(Ln 364092, Col 0)
function i1q(A, q, K) {
    try {
        let Y = $1(),
            z = L4(A),
            {
                buffer: _,
                bytesRead: w
            } = Y.readSync(z, {
                length: l1q
            }),
            $ = _.toString("utf-8", 0, w).split(`
`);
        if (q < 0 || q >= $.length) return null;
        if (w === l1q && q === $.length - 1) return null;
        let H = $[q];
        if (!H || K < 0 || K >= H.length) return null;
        let j = /[\w$'!]+|[+\-*/%&|^~<>=]+/g,
            J;
        while ((J = j.exec(H)) !== null) {
            let M = J.index,
                D = M + J[0].length;
            if (K >= M && K < D) {
                let X = J[0];
                return X.length > 30 ? X.slice(0, 27) + "..." : X
            }
        }
        return null
    } catch (Y) {
        if (Y instanceof Error) k(`Symbol extraction failed for ${A}:${q}:${K}: ${Y.message}`, {
            level: "warn"
        });
        return null
    }
}
// @from(Ln 364126, Col 4)
l1q = 65536
// @from(Ln 364127, Col 4)
n1q = E(() => {
    SA();
    F9();
    H1()
})
// @from(Ln 364133, Col 0)
function JIY(A) {
    let q = A6(23),
        {
            operation: K,
            resultCount: Y,
            fileCount: z,
            content: _,
            verbose: w
        } = A,
        O;
    if (q[0] !== K) O = jIY[K] || {
        singular: "result",
        plural: "results"
    }, q[0] = K, q[1] = O;
    else O = q[1];
    let $ = O,
        H = Y === 1 ? $.singular : $.plural,
        j;
    if (q[2] !== H || q[3] !== $.special || q[4] !== K || q[5] !== Y) j = K === "hover" && Y > 0 && $.special ? YJ.default.createElement(T, null, "Hover info ", $.special) : YJ.default.createElement(T, null, "Found ", YJ.default.createElement(T, {
        bold: !0
    }, Y, " "), H), q[2] = H, q[3] = $.special, q[4] = K, q[5] = Y, q[6] = j;
    else j = q[6];
    let J = j,
        M;
    if (q[7] !== z) M = z > 1 ? YJ.default.createElement(T, null, " ", "across ", YJ.default.createElement(T, {
        bold: !0
    }, z, " "), "files") : null, q[7] = z, q[8] = M;
    else M = q[8];
    let D = M;
    if (w) {
        let W;
        if (q[9] !== J || q[10] !== D) W = YJ.default.createElement(m, {
            flexDirection: "row"
        }, YJ.default.createElement(T, null, "  ⎿  ", J, D)), q[9] = J, q[10] = D, q[11] = W;
        else W = q[11];
        let Z;
        if (q[12] !== _) Z = YJ.default.createElement(m, {
            marginLeft: 5
        }, YJ.default.createElement(T, null, _)), q[12] = _, q[13] = Z;
        else Z = q[13];
        let G;
        if (q[14] !== W || q[15] !== Z) G = YJ.default.createElement(m, {
            flexDirection: "column"
        }, W, Z), q[14] = W, q[15] = Z, q[16] = G;
        else G = q[16];
        return G
    }
    let X;
    if (q[17] !== Y) X = Y > 0 && YJ.default.createElement(oJ, null), q[17] = Y, q[18] = X;
    else X = q[18];
    let P;
    if (q[19] !== J || q[20] !== D || q[21] !== X) P = YJ.default.createElement(t1, {
        height: 1
    }, YJ.default.createElement(T, null, J, D, " ", X)), q[19] = J, q[20] = D, q[21] = X, q[22] = P;
    else P = q[22];
    return P
}
// @from(Ln 364191, Col 0)
function r1q() {
    return "LSP"
}
// @from(Ln 364195, Col 0)
function o1q(A, {
    verbose: q
}) {
    if (!A.operation) return null;
    let K = [];
    if ((A.operation === "goToDefinition" || A.operation === "findReferences" || A.operation === "hover" || A.operation === "goToImplementation") && A.filePath && A.line !== void 0 && A.character !== void 0) {
        let Y = i1q(A.filePath, A.line - 1, A.character - 1),
            z = q ? A.filePath : $K(A.filePath);
        if (Y) K.push(`operation: "${A.operation}"`), K.push(`symbol: "${Y}"`), K.push(`in: "${z}"`);
        else K.push(`operation: "${A.operation}"`), K.push(`file: "${z}"`), K.push(`position: ${A.line}:${A.character}`);
        return K.join(", ")
    }
    if (K.push(`operation: "${A.operation}"`), A.filePath) {
        let Y = q ? A.filePath : $K(A.filePath);
        K.push(`file: "${Y}"`)
    }
    return K.join(", ")
}
// @from(Ln 364214, Col 0)
function a1q() {
    return YJ.default.createElement(T3, null)
}
// @from(Ln 364218, Col 0)
function s1q(A, {
    verbose: q
}) {
    if (!q && typeof A === "string" && d4(A, "tool_use_error")) return YJ.default.createElement(t1, null, YJ.default.createElement(T, {
        color: "error"
    }, "LSP operation failed"));
    return YJ.default.createElement(eK, {
        result: A,
        verbose: q
    })
}
// @from(Ln 364230, Col 0)
function t1q() {
    return null
}
// @from(Ln 364234, Col 0)
function e1q(A, q, {
    verbose: K
}) {
    if (A.resultCount !== void 0 && A.fileCount !== void 0) return YJ.default.createElement(JIY, {
        operation: A.operation,
        resultCount: A.resultCount,
        fileCount: A.fileCount,
        content: A.result,
        verbose: K
    });
    return YJ.default.createElement(t1, null, YJ.default.createElement(T, null, A.result))
}
// @from(Ln 364246, Col 4)
YJ
// @from(Ln 364246, Col 8)
jIY
// @from(Ln 364247, Col 4)
A8q = E(() => {
    e6();
    i6();
    gj();
    kO();
    iq();
    GR();
    JA();
    Z7();
    n1q();
    YJ = t(P6(), 1), jIY = {
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
// @from(Ln 364305, Col 0)
function WIY(A, q) {
    let K = DIY(q).href,
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
// @from(Ln 364395, Col 0)
function K8q(A) {
    let q = A.length;
    for (let K of A)
        if (K.children && K.children.length > 0) q += K8q(K.children);
    return q
}
// @from(Ln 364402, Col 0)
function ok1(A) {
    return new Set(A.map((q) => q.uri)).size
}
// @from(Ln 364406, Col 0)
function ZIY(A) {
    let q = A.replace(/^file:\/\//, "");
    if (/^\/[A-Za-z]:/.test(q)) q = q.slice(1);
    try {
        q = decodeURIComponent(q)
    } catch {}
    return q
}
// @from(Ln 364414, Col 0)
async function q8q(A, q) {
    if (A.length === 0) return A;
    let K = new Map;
    for (let w of A)
        if (w.uri && !K.has(w.uri)) K.set(w.uri, ZIY(w.uri));
    let Y = [...new Set(K.values())];
    if (Y.length === 0) return A;
    let z = new Set,
        _ = 50;
    for (let w = 0; w < Y.length; w += _) {
        let O = Y.slice(w, w + _),
            $ = await RA("git", ["check-ignore", ...O], {
                cwd: q,
                preserveOutputOnError: !1,
                timeout: 5000
            });
        if ($.code === 0 && $.stdout)
            for (let H of $.stdout.split(`
`)) {
                let j = H.trim();
                if (j) z.add(j)
            }
    }
    if (z.size === 0) return A;
    return A.filter((w) => {
        let O = K.get(w.uri);
        return !O || !z.has(O)
    })
}
// @from(Ln 364444, Col 0)
function GIY(A) {
    return "targetUri" in A
}
// @from(Ln 364448, Col 0)
function ak1(A) {
    if (GIY(A)) return {
        uri: A.targetUri,
        range: A.targetSelectionRange || A.targetRange
    };
    return A
}
// @from(Ln 364456, Col 0)
function fIY(A, q, K) {
    switch (A) {
        case "goToDefinition": {
            let z = (Array.isArray(q) ? q : q ? [q] : []).map(ak1),
                _ = z.filter((O) => !O || !O.uri);
            if (_.length > 0) _6(Error(`LSP server returned ${_.length} location(s) with undefined URI for goToDefinition on ${K}. This indicates malformed data from the LSP server.`));
            let w = z.filter((O) => O && O.uri);
            return {
                formatted: KF8(q, K),
                resultCount: w.length,
                fileCount: ok1(w)
            }
        }
        case "findReferences": {
            let Y = q || [],
                z = Y.filter((w) => !w || !w.uri);
            if (z.length > 0) _6(Error(`LSP server returned ${z.length} location(s) with undefined URI for findReferences on ${K}. This indicates malformed data from the LSP server.`));
            let _ = Y.filter((w) => w && w.uri);
            return {
                formatted: B1q(q, K),
                resultCount: _.length,
                fileCount: ok1(_)
            }
        }
        case "hover":
            return {
                formatted: g1q(q, K), resultCount: q ? 1 : 0, fileCount: q ? 1 : 0
            };
        case "documentSymbol": {
            let Y = q || [],
                _ = Y.length > 0 && Y[0] && "range" in Y[0] ? K8q(Y) : Y.length;
            return {
                formatted: p1q(q, K),
                resultCount: _,
                fileCount: Y.length > 0 ? 1 : 0
            }
        }
        case "workspaceSymbol": {
            let Y = q || [],
                z = Y.filter((O) => !O || !O.location || !O.location.uri);
            if (z.length > 0) _6(Error(`LSP server returned ${z.length} symbol(s) with undefined location URI for workspaceSymbol on ${K}. This indicates malformed data from the LSP server.`));
            let _ = Y.filter((O) => O && O.location && O.location.uri),
                w = _.map((O) => O.location);
            return {
                formatted: YF8(q, K),
                resultCount: _.length,
                fileCount: ok1(w)
            }
        }
        case "goToImplementation": {
            let z = (Array.isArray(q) ? q : q ? [q] : []).map(ak1),
                _ = z.filter((O) => !O || !O.uri);
            if (_.length > 0) _6(Error(`LSP server returned ${_.length} location(s) with undefined URI for goToImplementation on ${K}. This indicates malformed data from the LSP server.`));
            let w = z.filter((O) => O && O.uri);
            return {
                formatted: KF8(q, K),
                resultCount: w.length,
                fileCount: ok1(w)
            }
        }
        case "prepareCallHierarchy": {
            let Y = q || [];
            return {
                formatted: Q1q(q, K),
                resultCount: Y.length,
                fileCount: Y.length > 0 ? TIY(Y) : 0
            }
        }
        case "incomingCalls": {
            let Y = q || [];
            return {
                formatted: U1q(q, K),
                resultCount: Y.length,
                fileCount: Y.length > 0 ? vIY(Y) : 0
            }
        }
        case "outgoingCalls": {
            let Y = q || [];
            return {
                formatted: d1q(q, K),
                resultCount: Y.length,
                fileCount: Y.length > 0 ? NIY(Y) : 0
            }
        }
    }
}
// @from(Ln 364543, Col 0)
function TIY(A) {
    let q = A.map((K) => K.uri).filter((K) => K);
    return new Set(q).size
}
// @from(Ln 364548, Col 0)
function vIY(A) {
    let q = A.map((K) => K.from?.uri).filter((K) => K);
    return new Set(q).size
}
// @from(Ln 364553, Col 0)
function NIY(A) {
    let q = A.map((K) => K.to?.uri).filter((K) => K);
    return new Set(q).size
}
// @from(Ln 364557, Col 4)
XIY
// @from(Ln 364557, Col 9)
PIY
// @from(Ln 364557, Col 14)
wF8
// @from(Ln 364558, Col 4)
Y8q = E(() => {
    K7();
    I1q();
    c1q();
    Ib();
    F9();
    lA();
    SA();
    RY();
    k1();
    H1();
    Eq();
    A8q();
    XIY = F6(() => C.strictObject({
        operation: C.enum(["goToDefinition", "findReferences", "hover", "documentSymbol", "workspaceSymbol", "goToImplementation", "prepareCallHierarchy", "incomingCalls", "outgoingCalls"]).describe("The LSP operation to perform"),
        filePath: C.string().describe("The absolute or relative path to the file"),
        line: C.number().int().positive().describe("The line number (1-based, as shown in editors)"),
        character: C.number().int().positive().describe("The character offset (1-based, as shown in editors)")
    })), PIY = F6(() => C.object({
        operation: C.enum(["goToDefinition", "findReferences", "hover", "documentSymbol", "workspaceSymbol", "goToImplementation", "prepareCallHierarchy", "incomingCalls", "outgoingCalls"]).describe("The LSP operation that was performed"),
        result: C.string().describe("The formatted result of the LSP operation"),
        filePath: C.string().describe("The file path the operation was performed on"),
        resultCount: C.number().int().nonnegative().optional().describe("Number of results (definitions, references, symbols)"),
        fileCount: C.number().int().nonnegative().optional().describe("Number of files containing results")
    })), wF8 = {
        name: Ai6,
        searchHint: "code intelligence (definitions, references, symbols, hover)",
        maxResultSizeChars: 1e5,
        isLsp: !0,
        async description() {
            return zF8
        },
        userFacingName: r1q,
        shouldDefer: !0,
        isEnabled() {
            return ja4()
        },
        get inputSchema() {
            return XIY()
        },
        get outputSchema() {
            return PIY()
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        toAutoClassifierInput() {
            return ""
        },
        getPath({
            filePath: A
        }) {
            return L4(A)
        },
        async validateInput(A) {
            let q = C1q().safeParse(A);
            if (!q.success) return {
                result: !1,
                message: `Invalid input: ${q.error.message}`,
                errorCode: 3
            };
            let K = $1(),
                Y = L4(A.filePath);
            if (Y.startsWith("\\\\") || Y.startsWith("//")) return {
                result: !0
            };
            let z;
            try {
                z = await K.stat(Y)
            } catch (_) {
                if (_.code === "ENOENT") return {
                    result: !1,
                    message: `File does not exist: ${A.filePath}`,
                    errorCode: 1
                };
                let w = _ instanceof Error ? _ : Error(String(_));
                return _6(Error(`Failed to access file stats for LSP operation on ${A.filePath}: ${w.message}`)), {
                    result: !1,
                    message: `Cannot access file: ${A.filePath}. ${w.message}`,
                    errorCode: 4
                }
            }
            if (!z.isFile()) return {
                result: !1,
                message: `Path is not a file: ${A.filePath}`,
                errorCode: 2
            };
            return {
                result: !0
            }
        },
        async checkPermissions(A, q) {
            let K = q.getAppState();
            return gt(wF8, A, K.toolPermissionContext)
        },
        async prompt() {
            return zF8
        },
        renderToolUseMessage: o1q,
        renderToolUseRejectedMessage: a1q,
        renderToolUseErrorMessage: s1q,
        renderToolUseProgressMessage: t1q,
        renderToolResultMessage: e1q,
        async call(A, q) {
            let K = L4(A.filePath),
                Y = G1();
            if (qT6().status === "pending") await Ja4();
            let _ = vl();
            if (!_) return _6(Error("LSP server manager not initialized when tool was called")), {
                data: {
                    operation: A.operation,
                    result: "LSP server manager not initialized. This may indicate a startup issue.",
                    filePath: A.filePath
                }
            };
            let {
                method: w,
                params: O
            } = WIY(A, K);
            try {
                if (!_.isFileOpen(K)) {
                    let D = await MIY(K, "utf-8");
                    await _.openFile(K, D)
                }
                let $ = await _.sendRequest(K, w, O);
                if ($ === void 0) return k(`No LSP server available for file type ${_F8.extname(K)} for operation ${A.operation} on file ${A.filePath}`), {
                    data: {
                        operation: A.operation,
                        result: `No LSP server available for file type: ${_F8.extname(K)}`,
                        filePath: A.filePath
                    }
                };
                if (A.operation === "incomingCalls" || A.operation === "outgoingCalls") {
                    let D = $;
                    if (!D || D.length === 0) return {
                        data: {
                            operation: A.operation,
                            result: "No call hierarchy item found at this position",
                            filePath: A.filePath,
                            resultCount: 0,
                            fileCount: 0
                        }
                    };
                    let X = A.operation === "incomingCalls" ? "callHierarchy/incomingCalls" : "callHierarchy/outgoingCalls";
                    if ($ = await _.sendRequest(K, X, {
                            item: D[0]
                        }), $ === void 0) k(`LSP server returned undefined for ${X} on ${A.filePath}`)
                }
                if ($ && Array.isArray($) && (A.operation === "findReferences" || A.operation === "goToDefinition" || A.operation === "goToImplementation" || A.operation === "workspaceSymbol"))
                    if (A.operation === "workspaceSymbol") {
                        let D = $,
                            X = D.filter((Z) => Z?.location?.uri).map((Z) => Z.location),
                            P = await q8q(X, Y),
                            W = new Set(P.map((Z) => Z.uri));
                        $ = D.filter((Z) => !Z?.location?.uri || W.has(Z.location.uri))
                    } else {
                        let D = $.map(ak1),
                            X = await q8q(D, Y),
                            P = new Set(X.map((W) => W.uri));
                        $ = $.filter((W) => {
                            let Z = ak1(W);
                            return !Z.uri || P.has(Z.uri)
                        })
                    } let {
                    formatted: H,
                    resultCount: j,
                    fileCount: J
                } = fIY(A.operation, $, Y);
                return {
                    data: {
                        operation: A.operation,
                        result: H,
                        filePath: A.filePath,
                        resultCount: j,
                        fileCount: J
                    }
                }
            } catch ($) {
                let j = ($ instanceof Error ? $ : Error(String($))).message;
                return _6(Error(`LSP tool request failed for ${A.operation} on ${A.filePath}: ${j}`)), {
                    data: {
                        operation: A.operation,
                        result: `Error performing ${A.operation}: ${j}`,
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
// @from(Ln 364758, Col 4)
qi6 = "ListMcpResourcesTool"
// @from(Ln 364759, Col 4)
z8q = `
Lists available resources from configured MCP servers.
Each resource object includes a 'server' field indicating which server it's from.

Usage examples:
- List all resources from all servers: \`listMcpResources\`
- List resources from a specific server: \`listMcpResources({ server: "myserver" })\`
`
// @from(Ln 364767, Col 4)
_8q = `
List available resources from configured MCP servers.
Each returned resource will include all standard MCP resource fields plus a 'server' field 
indicating which server the resource belongs to.

Parameters:
- server (optional): The name of a specific MCP server to get resources from. If not provided,
  resources from all servers will be returned.
`
// @from(Ln 364777, Col 0)
function w8q(A) {
    return A.server ? `List MCP resources from server "${A.server}"` : "List all MCP resources"
}
// @from(Ln 364781, Col 0)
function O8q() {
    return Bb.createElement(T3, null)
}
// @from(Ln 364785, Col 0)
function $8q(A, {
    verbose: q
}) {
    return Bb.createElement(eK, {
        result: A,
        verbose: q
    })
}
// @from(Ln 364794, Col 0)
function H8q() {
    return null
}
// @from(Ln 364798, Col 0)
function j8q(A, q, {
    verbose: K
}) {
    if (!A || A.length === 0) return Bb.createElement(t1, {
        height: 1
    }, Bb.createElement(T, {
        dimColor: !0
    }, "(No resources found)"));
    let Y = B6(A, null, 2);
    return Bb.createElement(IB, {
        content: Y,
        verbose: K
    })
}
// @from(Ln 364812, Col 4)
Bb
// @from(Ln 364813, Col 4)
J8q = E(() => {
    i6();
    gj();
    kO();
    iq();
    WW6();
    g1();
    Bb = t(P6(), 1)
})
// @from(Ln 364822, Col 4)
VIY
// @from(Ln 364822, Col 9)
kIY
// @from(Ln 364822, Col 14)
Ll
// @from(Ln 364823, Col 4)
sk1 = E(() => {
    K7();
    QP();
    k1();
    s8();
    J8q();
    g1();
    VIY = F6(() => C.object({
        server: C.string().optional().describe("Optional server name to filter resources by")
    })), kIY = F6(() => C.array(C.object({
        uri: C.string().describe("Resource URI"),
        name: C.string().describe("Resource name"),
        mimeType: C.string().optional().describe("MIME type of the resource"),
        description: C.string().optional().describe("Resource description"),
        server: C.string().describe("Server that provides this resource")
    }))), Ll = {
        isEnabled() {
            return !0
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        toAutoClassifierInput(A) {
            return A.server ?? ""
        },
        shouldDefer: !0,
        name: qi6,
        searchHint: "list resources from connected MCP servers",
        maxResultSizeChars: 1e5,
        async description() {
            return z8q
        },
        async prompt() {
            return _8q
        },
        get inputSchema() {
            return VIY()
        },
        get outputSchema() {
            return kIY()
        },
        async call(A, {
            options: {
                mcpClients: q
            }
        }) {
            let {
                server: K
            } = A, Y = K ? q.filter((_) => _.name === K) : q;
            if (K && Y.length === 0) throw Error(`Server "${K}" not found. Available servers: ${q.map((_)=>_.name).join(", ")}`);
            return {
                data: (await Promise.all(Y.map(async (_) => {
                    if (_.type !== "connected") return [];
                    try {
                        let w = await yT6(_);
                        return await Rl(w)
                    } catch (w) {
                        return EY(_.name, _1(w)), []
                    }
                }))).flat()
            }
        },
        async checkPermissions(A) {
            return {
                behavior: "allow",
                updatedInput: A
            }
        },
        renderToolUseMessage: w8q,
        userFacingName: () => "listMcpResources",
        renderToolUseRejectedMessage: O8q,
        renderToolUseErrorMessage: $8q,
        renderToolUseProgressMessage: H8q,
        renderToolResultMessage: j8q,
        mapToolResultToToolResultBlockParam(A, q) {
            if (!A || A.length === 0) return {
                tool_use_id: q,
                type: "tool_result",
                content: "No resources found. MCP servers may still provide tools even if they have no resources."
            };
            return {
                tool_use_id: q,
                type: "tool_result",
                content: B6(A)
            }
        }
    }
})
// @from(Ln 364914, Col 4)
M8q = `
Reads a specific resource from an MCP server.
- server: The name of the MCP server to read from
- uri: The URI of the resource to read

Usage examples:
- Read a resource from a server: \`readMcpResource({ server: "myserver", uri: "my-resource-uri" })\`
`
// @from(Ln 364922, Col 4)
D8q = `
Reads a specific resource from an MCP server, identified by server name and resource URI.

Parameters:
- server (required): The name of the MCP server from which to read the resource
- uri (required): The URI of the resource to read
`
// @from(Ln 364930, Col 0)
function X8q(A) {
    if (!A.uri || !A.server) return null;
    return `Read resource "${A.uri}" from server "${A.server}"`
}
// @from(Ln 364935, Col 0)
function P8q() {
    return "readMcpResource"
}
// @from(Ln 364939, Col 0)
function W8q() {
    return ZE.createElement(T3, null)
}
// @from(Ln 364943, Col 0)
function Z8q(A, {
    verbose: q
}) {
    return ZE.createElement(eK, {
        result: A,
        verbose: q
    })
}
// @from(Ln 364952, Col 0)
function G8q() {
    return null
}
// @from(Ln 364956, Col 0)
function f8q(A, q, {
    verbose: K
}) {
    if (!A || !A.contents || A.contents.length === 0) return ZE.createElement(m, {
        justifyContent: "space-between",
        overflowX: "hidden",
        width: "100%"
    }, ZE.createElement(t1, {
        height: 1
    }, ZE.createElement(T, {
        dimColor: !0
    }, "(No content)")));
    let Y = B6(A, null, 2);
    return ZE.createElement(IB, {
        content: Y,
        verbose: K
    })
}
// @from(Ln 364974, Col 4)
ZE
// @from(Ln 364975, Col 4)
T8q = E(() => {
    i6();
    gj();
    kO();
    iq();
    WW6();
    g1();
    ZE = t(P6(), 1)
})
// @from(Ln 364984, Col 4)
EIY
// @from(Ln 364984, Col 9)
yIY
// @from(Ln 364984, Col 14)
hl
// @from(Ln 364985, Col 4)
tk1 = E(() => {
    K7();
    hD();
    qk1();
    QP();
    T8q();
    g1();
    EIY = F6(() => C.object({
        server: C.string().describe("The MCP server name"),
        uri: C.string().describe("The resource URI to read")
    })), yIY = F6(() => C.object({
        contents: C.array(C.object({
            uri: C.string().describe("Resource URI"),
            mimeType: C.string().optional().describe("MIME type of the content"),
            text: C.string().optional().describe("Text content of the resource"),
            blobSavedTo: C.string().optional().describe("Path where binary blob content was saved")
        }))
    })), hl = {
        isEnabled() {
            return !0
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        toAutoClassifierInput(A) {
            return `${A.server} ${A.uri}`
        },
        shouldDefer: !0,
        name: "ReadMcpResourceTool",
        searchHint: "read a specific MCP resource by URI",
        maxResultSizeChars: 1e5,
        async description() {
            return M8q
        },
        async prompt() {
            return D8q
        },
        get inputSchema() {
            return EIY()
        },
        get outputSchema() {
            return yIY()
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
            let w = await (await yT6(z)).client.request({
                method: "resources/read",
                params: {
                    uri: Y
                }
            }, Yy6);
            return {
                data: {
                    contents: await Promise.all(w.contents.map(async ($, H) => {
                        if ("text" in $) return {
                            uri: $.uri,
                            mimeType: $.mimeType,
                            text: $.text
                        };
                        if (!("blob" in $) || typeof $.blob !== "string") return {
                            uri: $.uri,
                            mimeType: $.mimeType
                        };
                        let j = `mcp-resource-${Date.now()}-${H}-${Math.random().toString(36).slice(2,8)}`,
                            J = await _T6(Buffer.from($.blob, "base64"), $.mimeType, j);
                        if ("error" in J) return {
                            uri: $.uri,
                            mimeType: $.mimeType,
                            text: `Binary content could not be saved to disk: ${J.error}`
                        };
                        return {
                            uri: $.uri,
                            mimeType: $.mimeType,
                            blobSavedTo: J.filepath,
                            text: Ak1(J.filepath, $.mimeType, J.size, `[Resource from ${K} at ${$.uri}] `)
                        }
                    }))
                }
            }
        },
        async checkPermissions(A) {
            return {
                behavior: "allow",
                updatedInput: A
            }
        },
        renderToolUseMessage: X8q,
        userFacingName: P8q,
        renderToolUseRejectedMessage: W8q,
        renderToolUseErrorMessage: Z8q,
        renderToolUseProgressMessage: G8q,
        renderToolResultMessage: f8q,
        mapToolResultToToolResultBlockParam(A, q) {
            return {
                tool_use_id: q,
                type: "tool_result",
                content: B6(A)
            }
        }
    }
})
// @from(Ln 365100, Col 0)
function RIY() {
    let A = rO() ? "" : LIY;
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
   - If you would use ${Fw} to clarify the approach, use EnterPlanMode instead
   - Plan mode lets you explore first, then present options with context

## When NOT to Use This Tool

Only skip EnterPlanMode for simple tasks:
- Single-line or few-line fixes (typos, obvious bugs, small tweaks)
- Adding a single function with clear requirements
- Tasks where the user has given very specific, detailed instructions
- Pure research/exploration tasks (use the Agent tool with explore agent instead)

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
// @from(Ln 365180, Col 0)
function v8q() {
    return RIY()
}
// @from(Ln 365183, Col 4)
LIY
// @from(Ln 365184, Col 4)
N8q = E(() => {
    ct();
    Xa();
    LIY = `## What Happens in Plan Mode

In plan mode, you'll:
1. Thoroughly explore the codebase using Glob, Grep, and Read tools
2. Understand existing patterns and architecture
3. Design an implementation approach
4. Present your plan to the user for approval
5. Use ${Fw} if you need to clarify approaches
6. Exit plan mode with ExitPlanMode when ready to implement

`
})
// @from(Ln 365200, Col 0)
function V8q() {
    return null
}
// @from(Ln 365204, Col 0)
function k8q() {
    return null
}
// @from(Ln 365208, Col 0)
function E8q(A, q, K) {
    return _D.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, _D.createElement(m, {
        flexDirection: "row"
    }, _D.createElement(T, {
        color: kG("plan")
    }, I3), _D.createElement(T, null, " Entered plan mode")), _D.createElement(m, {
        paddingLeft: 2
    }, _D.createElement(T, {
        dimColor: !0
    }, "Claude is now exploring and designing an implementation approach.")))
}
// @from(Ln 365223, Col 0)
function y8q() {
    return _D.createElement(m, {
        flexDirection: "row",
        marginTop: 1
    }, _D.createElement(T, {
        color: kG("default")
    }, I3), _D.createElement(T, null, " User declined to enter plan mode"))
}
// @from(Ln 365232, Col 0)
function L8q() {
    return null
}
// @from(Ln 365235, Col 4)
_D
// @from(Ln 365236, Col 4)
R8q = E(() => {
    i6();
    qw();
    rD();
    _D = t(P6(), 1)
})
// @from(Ln 365242, Col 4)
hIY
// @from(Ln 365242, Col 9)
SIY
// @from(Ln 365242, Col 14)
Ki6
// @from(Ln 365243, Col 4)
OF8 = E(() => {
    rJ();
    K7();
    F$();
    T1();
    N8q();
    R8q();
    Xa();
    hIY = F6(() => C.strictObject({})), SIY = F6(() => C.object({
        message: C.string().describe("Confirmation that plan mode was entered")
    })), Ki6 = {
        name: dt,
        searchHint: "switch to plan mode to design an approach before coding",
        maxResultSizeChars: 1e5,
        async description() {
            return "Requests permission to enter plan mode for complex tasks requiring exploration and design"
        },
        async prompt() {
            return v8q()
        },
        get inputSchema() {
            return hIY()
        },
        get outputSchema() {
            return SIY()
        },
        userFacingName() {
            return ""
        },
        shouldDefer: !0,
        isEnabled() {
            return !0
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        toAutoClassifierInput() {
            return ""
        },
        async checkPermissions(A) {
            return {
                behavior: "allow",
                updatedInput: A
            }
        },
        renderToolUseMessage: V8q,
        renderToolUseProgressMessage: k8q,
        renderToolResultMessage: E8q,
        renderToolUseRejectedMessage: y8q,
        renderToolUseErrorMessage: L8q,
        async call(A, q) {
            if (q.agentId) throw Error("EnterPlanMode tool cannot be used in agent contexts");
            let K = q.getAppState();
            return Dp(K.toolPermissionContext.mode, "plan"), q.setAppState((Y) => ({
                ...Y,
                toolPermissionContext: Ez(LT6(Y.toolPermissionContext), {
                    type: "setMode",
                    mode: "plan",
                    destination: "session"
                })
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
                content: rO() ? `${A}

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
// @from(Ln 365336, Col 0)
function h8q() {
    return `Use this tool ONLY when the user explicitly asks to work in a worktree. This tool creates an isolated git worktree and switches the current session into it.

## When to Use

- The user explicitly says "worktree" (e.g., "start a worktree", "work in a worktree", "create a worktree", "use a worktree")

## When NOT to Use

- The user asks to create a branch, switch branches, or work on a different branch — use git commands instead
- The user asks to fix a bug or work on a feature — use normal git workflow unless they specifically mention worktrees
- Never use this tool unless the user explicitly mentions "worktree"

## Requirements

- Must be in a git repository, OR have WorktreeCreate/WorktreeRemove hooks configured in settings.json
- Must not already be in a worktree

## Behavior

- In a git repository: creates a new git worktree inside \`.claude/worktrees/\` with a new branch based on HEAD
- Outside a git repository: delegates to WorktreeCreate/WorktreeRemove hooks for VCS-agnostic isolation
- Switches the session's working directory to the new worktree
- Use ExitWorktree to leave the worktree mid-session (keep or remove). On session exit, if still in the worktree, the user will be prompted to keep or remove it

## Parameters

- \`name\` (optional): A name for the worktree. If not provided, a random name is generated.
`
}
// @from(Ln 365367, Col 0)
function S8q() {
    return "Creating worktree…"
}
// @from(Ln 365371, Col 0)
function C8q() {
    return null
}
// @from(Ln 365375, Col 0)
function I8q(A, q, K) {
    return Sl.createElement(m, {
        flexDirection: "column"
    }, Sl.createElement(T, null, "Switched to worktree on branch ", Sl.createElement(T, {
        bold: !0
    }, A.worktreeBranch)), Sl.createElement(T, {
        dimColor: !0
    }, A.worktreePath))
}
// @from(Ln 365385, Col 0)
function b8q() {
    return null
}
// @from(Ln 365389, Col 0)
function x8q() {
    return null
}
// @from(Ln 365392, Col 4)
Sl
// @from(Ln 365393, Col 4)
u8q = E(() => {
    i6();
    Sl = t(P6(), 1)
})
// @from(Ln 365398, Col 0)
function AF(A, q) {
    return {
        name: A,
        compute: q,
        cacheBreak: !1
    }
}
// @from(Ln 365406, Col 0)
function m8q(A, q, K) {
    return {
        name: A,
        compute: q,
        cacheBreak: !0
    }
}
// @from(Ln 365413, Col 0)
async function B8q(A) {
    let q = ou1();
    return Promise.all(A.map(async (K) => {
        if (!K.cacheBreak && q.has(K.name)) return q.get(K.name) ?? null;
        let Y = await K.compute();
        return au1(K.name, Y), Y
    }))
}
// @from(Ln 365422, Col 0)
function RT6() {
    su1()
}
// @from(Ln 365425, Col 4)
Yi6 = E(() => {
    T1()
})
// @from(Ln 365428, Col 4)
CIY
// @from(Ln 365428, Col 9)
IIY
// @from(Ln 365428, Col 14)
g8q
// @from(Ln 365429, Col 4)
F8q = E(() => {
    K7();
    u8q();
    lA();
    WR();
    T1();
    Yi6();
    lM();
    jN();
    $5();
    rH();
    V1();
    CIY = F6(() => C.strictObject({
        name: C.string().optional().describe("Optional name for the worktree. A random name is generated if not provided.")
    })), IIY = F6(() => C.object({
        worktreePath: C.string(),
        worktreeBranch: C.string().optional(),
        message: C.string()
    })), g8q = {
        name: sP1,
        searchHint: "create an isolated git worktree and switch into it",
        maxResultSizeChars: 1e5,
        async description() {
            return "Creates an isolated worktree (via git or configured hooks) and switches the session into it"
        },
        async prompt() {
            return h8q()
        },
        get inputSchema() {
            return CIY()
        },
        get outputSchema() {
            return IIY()
        },
        userFacingName() {
            return "Creating worktree"
        },
        shouldDefer: !0,
        isEnabled() {
            return !0
        },
        isConcurrencySafe() {
            return !1
        },
        isReadOnly() {
            return !1
        },
        toAutoClassifierInput(A) {
            return A.name ?? ""
        },
        async checkPermissions(A) {
            return {
                behavior: "allow",
                updatedInput: A
            }
        },
        renderToolUseMessage: S8q,
        renderToolUseProgressMessage: C8q,
        renderToolResultMessage: I8q,
        renderToolUseRejectedMessage: b8q,
        renderToolUseErrorMessage: x8q,
        async call(A) {
            if (S0()) throw Error("Already in a worktree session");
            let q = LJ(G1());
            if (q && q !== G1()) process.chdir(q), VO(q);
            let K = A.name ?? bB(),
                Y = await Yl6(R1(), K);
            process.chdir(Y.worktreePath), VO(Y.worktreePath), Jp(G1()), _A6(!0), RT6(), vO.cache.clear?.(), t2.cache.clear?.(), d("tengu_worktree_created", {
                mid_session: !0
            });
            let z = Y.worktreeBranch ? ` on branch ${Y.worktreeBranch}` : "";
            return {
                data: {
                    worktreePath: Y.worktreePath,
                    worktreeBranch: Y.worktreeBranch,
                    message: `Created worktree at ${Y.worktreePath}${z}. The session is now working in the worktree. Use ExitWorktree to leave mid-session, or exit the session to be prompted.`
                }
            }
        },
        mapToolResultToToolResultBlockParam({
            message: A
        }, q) {
            return {
                type: "tool_result",
                content: A,
                tool_use_id: q
            }
        }
    }
})
// @from(Ln 365520, Col 0)
function p8q() {
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
// @from(Ln 365553, Col 0)
function Q8q() {
    return "Exiting worktree…"
}
// @from(Ln 365557, Col 0)
function U8q() {
    return null
}
// @from(Ln 365561, Col 0)
function d8q(A, q, K) {
    let Y = A.action === "keep" ? "Kept worktree" : "Removed worktree";
    return ZN.createElement(m, {
        flexDirection: "column"
    }, ZN.createElement(T, null, Y, A.worktreeBranch ? ZN.createElement(ZN.Fragment, null, " ", "(branch ", ZN.createElement(T, {
        bold: !0
    }, A.worktreeBranch), ")") : null), ZN.createElement(T, {
        dimColor: !0
    }, "Returned to ", A.originalCwd))
}
// @from(Ln 365572, Col 0)
function c8q() {
    return null
}
// @from(Ln 365576, Col 0)
function l8q() {
    return null
}
// @from(Ln 365579, Col 4)
ZN
// @from(Ln 365580, Col 4)
i8q = E(() => {
    i6();
    ZN = t(P6(), 1)
})
// @from(Ln 365584, Col 0)
async function n8q(A, q) {
    let K = await z8("git", ["-C", A, "status", "--porcelain"]);
    if (K.code !== 0) return null;
    let Y = K.stdout.split(`
`).filter((w) => w.trim() !== "").length;
    if (!q) return null;
    let z = await z8("git", ["-C", A, "rev-list", "--count", `${q}..HEAD`]);
    if (z.code !== 0) return null;
    let _ = parseInt(z.stdout.trim(), 10) || 0;
    return {
        changedFiles: Y,
        commits: _
    }
}
// @from(Ln 365599, Col 0)
function r8q(A) {
    VO(A), Jp(A), _A6(!1), RT6(), vO.cache.clear?.(), t2.cache.clear?.()
}
// @from(Ln 365602, Col 4)
bIY
// @from(Ln 365602, Col 9)
xIY
// @from(Ln 365602, Col 14)
o8q
// @from(Ln 365603, Col 4)
a8q = E(() => {
    K7();
    i8q();
    WR();
    T1();
    Yi6();
    lM();
    jN();
    rH();
    V1();
    Eq();
    bIY = F6(() => C.strictObject({
        action: C.enum(["keep", "remove"]).describe('"keep" leaves the worktree and branch on disk; "remove" deletes both.'),
        discard_changes: C.boolean().optional().describe('Required true when action is "remove" and the worktree has uncommitted files or unmerged commits. The tool will refuse and list them otherwise.')
    })), xIY = F6(() => C.object({
        action: C.enum(["keep", "remove"]),
        originalCwd: C.string(),
        worktreePath: C.string(),
        worktreeBranch: C.string().optional(),
        tmuxSessionName: C.string().optional(),
        discardedFiles: C.number().optional(),
        discardedCommits: C.number().optional(),
        message: C.string()
    }));
    o8q = {
        name: tP1,
        searchHint: "exit a worktree session and return to the original directory",
        maxResultSizeChars: 1e5,
        async description() {
            return "Exits a worktree session created by EnterWorktree and restores the original working directory"
        },
        async prompt() {
            return p8q()
        },
        get inputSchema() {
            return bIY()
        },
        get outputSchema() {
            return xIY()
        },
        userFacingName() {
            return "Exiting worktree"
        },
        shouldDefer: !0,
        isEnabled() {
            return !0
        },
        isConcurrencySafe() {
            return !1
        },
        isReadOnly() {
            return !1
        },
        isDestructive(A) {
            return A.action === "remove"
        },
        toAutoClassifierInput(A) {
            return A.action
        },
        async checkPermissions(A) {
            return {
                behavior: "allow",
                updatedInput: A
            }
        },
        async validateInput(A) {
            let q = S0();
            if (!q) return {
                result: !1,
                message: "No-op: there is no active EnterWorktree session to exit. This tool only operates on worktrees created by EnterWorktree in the current session — it will not touch worktrees created manually or in a previous session. No filesystem changes were made.",
                errorCode: 1
            };
            if (A.action === "remove" && !A.discard_changes) {
                let K = await n8q(q.worktreePath, q.originalHeadCommit);
                if (K === null) return {
                    result: !1,
                    message: `Could not verify worktree state at ${q.worktreePath}. Refusing to remove without explicit confirmation. Re-invoke with discard_changes: true to proceed — or use action: "keep" to preserve the worktree.`,
                    errorCode: 3
                };
                let {
                    changedFiles: Y,
                    commits: z
                } = K;
                if (Y > 0 || z > 0) {
                    let _ = [];
                    if (Y > 0) _.push(`${Y} uncommitted ${Y===1?"file":"files"}`);
                    if (z > 0) _.push(`${z} ${z===1?"commit":"commits"} on ${q.worktreeBranch??"the worktree branch"}`);
                    return {
                        result: !1,
                        message: `Worktree has ${_.join(" and ")}. Removing will discard this work permanently. Confirm with the user, then re-invoke with discard_changes: true — or use action: "keep" to preserve the worktree.`,
                        errorCode: 2
                    }
                }
            }
            return {
                result: !0
            }
        },
        renderToolUseMessage: Q8q,
        renderToolUseProgressMessage: U8q,
        renderToolResultMessage: d8q,
        renderToolUseRejectedMessage: c8q,
        renderToolUseErrorMessage: l8q,
        async call(A) {
            let q = S0();
            if (!q) throw Error("Not in a worktree session");
            let {
                originalCwd: K,
                worktreePath: Y,
                worktreeBranch: z,
                tmuxSessionName: _,
                originalHeadCommit: w
            } = q, {
                changedFiles: O,
                commits: $
            } = await n8q(Y, w) ?? {
                changedFiles: 0,
                commits: 0
            };
            if (A.action === "keep") {
                await Uf6(), r8q(K), d("tengu_worktree_kept", {
                    mid_session: !0,
                    commits: $,
                    changed_files: O
                });
                let J = _ ? ` Tmux session ${_} is still running; reattach with: tmux attach -t ${_}` : "";
                return {
                    data: {
                        action: "keep",
                        originalCwd: K,
                        worktreePath: Y,
                        worktreeBranch: z,
                        tmuxSessionName: _,
                        message: `Exited worktree. Your work is preserved at ${Y}${z?` on branch ${z}`:""}. Session is now back in ${K}.${J}`
                    }
                }
            }
            if (_) await Qf6(_);
            await df6(), r8q(K), d("tengu_worktree_removed", {
                mid_session: !0,
                commits: $,
                changed_files: O
            });
            let H = [];
            if ($ > 0) H.push(`${$} ${$===1?"commit":"commits"}`);
            if (O > 0) H.push(`${O} uncommitted ${O===1?"file":"files"}`);
            let j = H.length > 0 ? ` Discarded ${H.join(" and ")}.` : "";
            return {
                data: {
                    action: "remove",
                    originalCwd: K,
                    worktreePath: Y,
                    worktreeBranch: z,
                    discardedFiles: O,
                    discardedCommits: $,
                    message: `Exited and removed worktree at ${Y}.${j} Session is now back in ${K}.`
                }
            }
        },
        mapToolResultToToolResultBlockParam({
            message: A
        }, q) {
            return {
                type: "tool_result",
                content: A,
                tool_use_id: q
            }
        }
    }
})
// @from(Ln 365773, Col 4)
ek1
// @from(Ln 365773, Col 9)
AE1
// @from(Ln 365773, Col 14)
s8q
// @from(Ln 365774, Col 4)
$F8 = E(() => {
    ek1 = ["auto", "iterm2", "iterm2_with_bell", "terminal_bell", "kitty", "notifications_disabled"], AE1 = ["normal", "vim"], s8q = ["auto", "tmux", "in-process"]
})
// @from(Ln 365778, Col 0)
function uIY(A, q) {
    if (A.includes(q)) return !0;
    if (zc(A)) return H5(A).toLowerCase().includes(q);
    return !1
}
// @from(Ln 365784, Col 0)
function t8q(A, q) {
    if (!A.startsWith(q)) return !1;
    return A.length === q.length || A[q.length] === "-"
}
// @from(Ln 365789, Col 0)
function mIY(A, q) {
    let K = zc(A) ? H5(A).toLowerCase() : A;
    if (t8q(K, q)) return !0;
    if (!q.startsWith("claude-") && t8q(K, `claude-${q}`)) return !0;
    return !1
}
// @from(Ln 365796, Col 0)
function e8q(A, q) {
    for (let K of q) {
        if (UW6(K)) continue;
        let Y = K.indexOf(A);
        if (Y === -1) continue;
        let z = Y + A.length;
        if (z === K.length || K[z] === "-") return !0
    }
    return !1
}
// @from(Ln 365807, Col 0)
function s66(A) {
    let q = PA() || {},
        {
            availableModels: K
        } = q;
    if (!K) return !0;
    if (K.length === 0) return !1;
    let z = qE1(A).trim().toLowerCase(),
        _ = K.map((w) => w.trim().toLowerCase());
    if (_.includes(z)) {
        if (!UW6(z) || !e8q(z, _)) return !0
    }
    for (let w of _)
        if (UW6(w) && !e8q(w, _) && uIY(z, w)) return !0;
    if (zc(z)) {
        let w = H5(z).toLowerCase();
        if (_.includes(w)) return !0
    }
    for (let w of _)
        if (!UW6(w) && zc(w)) {
            if (H5(w).toLowerCase() === z) return !0
        } for (let w of _)
        if (!UW6(w) && !zc(w)) {
            if (mIY(z, w)) return !0
        } return !1
}
// @from(Ln 365833, Col 4)
zi6 = E(() => {
    i8();
    dW6();
    z4();
    ht()
})
// @from(Ln 365839, Col 0)
async function KE1(A) {
    let q = A.trim();
    if (!q) return {
        valid: !1,
        error: "Model name cannot be empty"
    };
    if (!s66(q)) return {
        valid: !1,
        error: `Model '${q}' is not in the list of available models`
    };
    let K = q.toLowerCase();
    if (e36.includes(K)) return {
        valid: !0
    };
    if (AAq.has(q)) return {
        valid: !0
    };
    try {
        return await _h({
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
        }), AAq.set(q, !0), {
            valid: !0
        }
    } catch (Y) {
        return BIY(Y, q)
    }
}
// @from(Ln 365879, Col 0)
function BIY(A, q) {
    if (A instanceof Lq6) {
        let Y = gIY(q),
            z = Y ? `. Try '${Y}' instead` : "";
        return {
            valid: !1,
            error: `Model '${q}' not found${z}`
        }
    }
    if (A instanceof a7) {
        if (A instanceof yq6) return {
            valid: !1,
            error: "Authentication failed. Please check your API credentials."
        };
        if (A instanceof mW) return {
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
// @from(Ln 365913, Col 0)
function gIY(A) {
    if (QA() === "firstParty") return;
    let q = A.toLowerCase();
    if (q.includes("opus-4-6") || q.includes("opus_4_6")) return _3().opus41;
    if (q.includes("sonnet-4-6") || q.includes("sonnet_4_6")) return _3().sonnet45;
    if (q.includes("sonnet-4-5") || q.includes("sonnet_4_5")) return _3().sonnet40;
    return
}
// @from(Ln 365921, Col 4)
AAq
// @from(Ln 365922, Col 4)
HF8 = E(() => {
    dW6();
    zi6();
    Nz();
    tY6();
    wv();
    ht();
    AAq = new Map
})
// @from(Ln 365932, Col 0)
function YE1(A = !1) {
    if (iA()) return {
        value: null,
        label: "Default (recommended)",
        description: Of6(A)
    };
    let q = QA() !== "firstParty";
    return {
        value: null,
        label: "Default (recommended)",
        description: `Use the default model (currently ${Oi6(Mv())})${q?"":` · ${zR(OB)}`}`
    }
}
// @from(Ln 365946, Col 0)
function FIY() {
    let A = QA() !== "firstParty",
        q = process.env.ANTHROPIC_DEFAULT_SONNET_MODEL;
    if (A && q) {
        let K = Cf(q);
        return {
            value: "sonnet",
            label: q,
            description: "Custom Sonnet model" + (K ? " (1M context)" : ""),
            descriptionForModel: `Custom Sonnet model (${q})` + (K ? " with 1M context" : "")
        }
    }
}
// @from(Ln 365960, Col 0)
function pIY() {
    let A = QA() !== "firstParty";
    return {
        value: A ? _3().sonnet46 : "sonnet",
        label: "Sonnet",
        description: `Sonnet 4.6 · Best for everyday tasks${A?"":` · ${zR(OB)}`}`,
        descriptionForModel: "Sonnet 4.6 - best for everyday tasks. Generally recommended for most coding tasks"
    }
}
// @from(Ln 365970, Col 0)
function QIY() {
    let A = QA() !== "firstParty",
        q = process.env.ANTHROPIC_DEFAULT_OPUS_MODEL;
    if (A && q) {
        let K = Cf(q);
        return {
            value: "opus",
            label: q,
            description: "Custom Opus model" + (K ? " (1M context)" : ""),
            descriptionForModel: `Custom Opus model (${q})` + (K ? " with 1M context" : "")
        }
    }
}
// @from(Ln 365984, Col 0)
function UIY() {
    return {
        value: "opus",
        label: "Opus 4.1",
        description: "Opus 4.1 · Legacy",
        descriptionForModel: "Opus 4.1 - legacy version"
    }
}
// @from(Ln 365993, Col 0)
function qAq(A = !1) {
    return {
        value: QA() !== "firstParty" ? _3().opus46 : "opus",
        label: "Opus",
        description: `Opus 4.6 · Most capable for complex work${Il(A)}`,
        descriptionForModel: "Opus 4.6 - most capable for complex work"
    }
}
// @from(Ln 366002, Col 0)
function KAq() {
    let A = QA() !== "firstParty";
    return {
        value: A ? _3().sonnet46 + "[1m]" : "sonnet[1m]",
        label: "Sonnet (1M context)",
        description: `Sonnet 4.6 for long sessions${A?"":` · ${zR(OB)}`}`,
        descriptionForModel: "Sonnet 4.6 with 1M context window - for long sessions with large codebases"
    }
}
// @from(Ln 366012, Col 0)
function YAq(A = !1) {
    return {
        value: QA() !== "firstParty" ? _3().opus46 + "[1m]" : "opus[1m]",
        label: "Opus (1M context)",
        description: `Opus 4.6 for long sessions${Il(A)}`,
        descriptionForModel: "Opus 4.6 with 1M context window - for long sessions with large codebases"
    }
}
// @from(Ln 366021, Col 0)
function dIY() {
    let A = QA() !== "firstParty",
        q = process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL;
    if (A && q) return {
        value: "haiku",
        label: q,
        description: "Custom Haiku model",
        descriptionForModel: `Custom Haiku model (${q})`
    }
}
// @from(Ln 366032, Col 0)
function OAq() {
    return {
        value: "haiku",
        label: "Haiku",
        description: `Haiku 4.5 · Fastest for quick answers${QA()!=="firstParty"?"":` · ${zR(Zf8)}`}`,
        descriptionForModel: "Haiku 4.5 - fastest for quick answers. Lower cost but less capable than Sonnet 4.6."
    }
}
// @from(Ln 366041, Col 0)
function cIY() {
    return {
        value: "haiku",
        label: "Haiku",
        description: `Haiku 3.5 for simple tasks${QA()!=="firstParty"?"":` · ${zR(Wf8)}`}`,
        descriptionForModel: "Haiku 3.5 - faster and lower cost, but less capable than Sonnet. Use for simple tasks."
    }
}
// @from(Ln 366050, Col 0)
function lIY() {
    return hT6() === _3().haiku45 ? OAq() : cIY()
}
// @from(Ln 366054, Col 0)
function $Aq(A = !1) {
    return {
        value: "opus",
        label: "Opus",
        description: `Opus 4.6 · Most capable for complex work${A?Il(!0):""}`
    }
}
// @from(Ln 366062, Col 0)
function zAq() {
    let A = QA() !== "firstParty";
    return {
        value: "sonnet[1m]",
        label: "Sonnet (1M context)",
        description: `Sonnet 4.6 with 1M context · ${iA()?"Billed as extra usage":"Billed at premium rate"}${A?"":` · ${zR(OB)}`}`
    }
}
// @from(Ln 366071, Col 0)
function _Aq(A = !1) {
    return {
        value: "opus[1m]",
        label: "Opus (1M context)",
        description: `Opus 4.6 with 1M context · ${iA()?"Billed as extra usage":"Billed at premium rate"}${Il(A)}`
    }
}
// @from(Ln 366079, Col 0)
function jF8(A = !1) {
    let q = QA() !== "firstParty";
    return {
        value: q ? _3().opus46 + "[1m]" : "opus[1m]",
        label: "Opus (1M context)",
        description: `Opus 4.6 with 1M context [NEW] · Most capable for complex work${!q&&A?Il(A):""}`,
        descriptionForModel: "Opus 4.6 with 1M context - most capable for complex work"
    }
}
// @from(Ln 366089, Col 0)
function rIY(A = !1) {
    if (iA()) {
        if (RL() || t66()) {
            let w = [YE1(A)];
            if (!pH() && fc()) w.push(_Aq(A));
            if (w.push(iIY), Tc()) w.push(zAq());
            return w.push(wAq), w
        }
        let _ = [YE1(A)];
        if (Tc()) _.push(zAq());
        if (pH()) _.push(jF8(A));
        else if (_.push($Aq(A)), fc()) _.push(_Aq(A));
        return _.push(wAq), _
    }
    if (QA() === "firstParty") {
        let _ = [YE1(A)];
        if (Tc()) _.push(KAq());
        if (pH()) _.push(jF8(A));
        else if (_.push(qAq(A)), fc()) _.push(YAq(A));
        return _.push(OAq()), _
    }
    let q = [YE1(A)],
        K = FIY();
    if (K !== void 0) q.push(K);
    else if (q.push(pIY()), Tc()) q.push(KAq());
    let Y = QIY();
    if (Y !== void 0) q.push(Y);
    else if (q.push(UIY()), q.push(qAq(A)), fc()) q.push(YAq(A));
    let z = dIY();
    if (z !== void 0) q.push(z);
    else q.push(lIY());
    return q
}
// @from(Ln 366123, Col 0)
function oIY(A) {
    let q = IY(A);
    if (q.includes("claude-sonnet-4-6") || q.includes("claude-sonnet-4-5") || q.includes("claude-sonnet-4-") || q.includes("claude-3-7-sonnet") || q.includes("claude-3-5-sonnet")) {
        let K = Cl(Ef());
        if (K) return {
            alias: "Sonnet",
            currentVersionName: K
        }
    }
    if (q.includes("claude-opus-4")) {
        let K = Cl(GN());
        if (K) return {
            alias: "Opus",
            currentVersionName: K
        }
    }
    if (q.includes("claude-haiku") || q.includes("claude-3-5-haiku")) {
        let K = Cl(hT6());
        if (K) return {
            alias: "Haiku",
            currentVersionName: K
        }
    }
    return null
}
// @from(Ln 366149, Col 0)
function aIY(A) {
    let q = Cl(A);
    if (!q) return null;
    let K = oIY(A);
    if (!K) return {
        value: A,
        label: q,
        description: A
    };
    if (q !== K.currentVersionName) return {
        value: A,
        label: q,
        description: `Newer version available · select ${K.alias} for ${K.currentVersionName}`
    };
    return {
        value: A,
        label: q,
        description: A
    }
}
// @from(Ln 366170, Col 0)
function Ez6(A = !1) {
    let q = rIY(A),
        K = null,
        Y = uR(),
        z = xw6();
    if (Y !== void 0 && Y !== null) K = Y;
    else if (z !== null) K = z;
    if (K === null || q.some((_) => _.value === K)) return _i6(q);
    else if (K === "opusplan") return _i6([...q, nIY()]);
    else if (K === "opus" && QA() === "firstParty") return _i6([...q, $Aq(A)]);
    else if (K === "opus[1m]" && QA() === "firstParty") return _i6([...q, jF8(A)]);
    else {
        let _ = aIY(K);
        if (_) q.push(_);
        else q.push({
            value: K,
            label: K,
            description: "Custom model"
        });
        return _i6(q)
    }
}
// @from(Ln 366193, Col 0)
function _i6(A) {
    if (!(PA() || {}).availableModels) return A;
    return A.filter((K) => K.value === null || K.value !== null && s66(K.value))
}
// @from(Ln 366197, Col 4)
iIY
// @from(Ln 366197, Col 9)
wAq
// @from(Ln 366197, Col 14)
nIY = () => {
    return {
        value: "opusplan",
        label: "Opus Plan Mode",
        description: "Use Opus 4.6 in plan mode, Sonnet 4.6 otherwise"
    }
}
// @from(Ln 366204, Col 4)
wi6 = E(() => {
    T1();
    fA();
    ht();
    Mt();
    i8();
    PZ1();
    Nz();
    zi6();
    z4();
    xJ();
    iIY = {
        value: "sonnet",
        label: "Sonnet",
        description: "Sonnet 4.6 · Best for everyday tasks"
    }, wAq = {
        value: "haiku",
        label: "Haiku",
        description: "Haiku 4.5 · Fastest for quick answers"
    }
})
// @from(Ln 366225, Col 4)
sIY
// @from(Ln 366226, Col 4)
MF8 = E(() => {
    ym();
    $F8();
    HF8();
    wi6();
    k8();
    sIY = {
        theme: {
            source: "global",
            type: "string",
            description: "Color theme for the UI",
            options: Lj8
        },
        editorMode: {
            source: "global",
            type: "string",
            description: "Key binding mode",
            options: AE1
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
            options: ek1
        },
        autoCompactEnabled: {
            source: "global",
            type: "boolean",
            description: "Auto-compact when context is full"
        },
        autoMemoryEnabled: {
            source: "settings",
            type: "boolean",
            description: "Enable auto-memory"
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
                    return Ez6().filter((A) => A.value !== null).map((A) => A.value)
                } catch {
                    return ["sonnet", "opus", "haiku"]
                }
            },
            validateOnWrite: (A) => KE1(String(A)),
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
            options: s8q
        },
        ...{},
        ...{
            voiceEnabled: {
                source: "settings",
                type: "boolean",
                description: "Enable voice dictation (hold-to-talk)"
            }
        },
        ...{
            remoteControlAtStartup: {
                source: "global",
                type: "boolean",
                description: "Enable Remote Control for all sessions (true | false | default)",
                formatOnRead: () => e66()
            }
        }
    }
})
// @from(Ln 366338, Col 4)
HAq = E(() => {
    MF8();
    wi6();
    Id()
})
// @from(Ln 366343, Col 4)
eIY
// @from(Ln 366344, Col 4)
jAq = E(() => {
    i6();
    kO();
    iq();
    g1();
    eIY = t(P6(), 1)
})
// @from(Ln 366351, Col 4)
B1O
// @from(Ln 366351, Col 9)
g1O
// @from(Ln 366352, Col 4)
JAq = E(() => {
    K7();
    HAq();
    MF8();
    jAq();
    k8();
    i8();
    V1();
    k1();
    g1();
    s8();
    B1O = F6(() => C.strictObject({
        setting: C.string().describe('The setting key (e.g., "theme", "model", "permissions.defaultMode")'),
        value: C.union([C.string(), C.boolean(), C.number()]).optional().describe("The new value. Omit to get current value.")
    })), g1O = F6(() => C.object({
        success: C.boolean(),
        operation: C.enum(["get", "set"]).optional(),
        setting: C.string().optional(),
        value: C.unknown().optional(),
        previousValue: C.unknown().optional(),
        newValue: C.unknown().optional(),
        error: C.string().optional()
    }))
})
// @from(Ln 366377, Col 0)
function DAq() {
    let A = E7() ? " and potentially assigned to teammates" : "",
        q = E7() ? "- New tasks are created with status 'pending' and no owner - use TaskUpdate with the `owner` parameter to assign them\n" : "";
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
- **activeForm** (optional): Present continuous form shown in the spinner when the task is in_progress (e.g., "Fixing authentication bug"). If omitted, the spinner shows the subject instead.

All tasks are created with status \`pending\`.

## Tips

- Create tasks with clear, specific subjects that describe the outcome
- Include enough detail in the description for another agent to understand and complete the task
- After creating tasks, use TaskUpdate to set up dependencies (blocks/blockedBy) if needed
${q}- Check TaskList first to avoid creating duplicate tasks
`
}
// @from(Ln 366422, Col 4)
MAq = "Create a new task in the task list"
// @from(Ln 366423, Col 4)
XAq = E(() => {
    Qz()
})
// @from(Ln 366427, Col 0)
function PAq() {
    return null
}
// @from(Ln 366431, Col 0)
function WAq() {
    return null
}
// @from(Ln 366435, Col 0)
function ZAq() {
    return null
}
// @from(Ln 366439, Col 0)
function GAq() {
    return null
}
// @from(Ln 366443, Col 0)
function fAq(A) {
    return null
}
// @from(Ln 366446, Col 4)
AbY
// @from(Ln 366446, Col 9)
qbY
// @from(Ln 366446, Col 14)
TAq
// @from(Ln 366447, Col 4)
vAq = E(() => {
    K7();
    XAq();
    Bw();
    AbY = F6(() => C.strictObject({
        subject: C.string().describe("A brief title for the task"),
        description: C.string().describe("A detailed description of what needs to be done"),
        activeForm: C.string().optional().describe('Present continuous form shown in spinner when in_progress (e.g., "Running tests")'),
        metadata: C.record(C.string(), C.unknown()).optional().describe("Arbitrary metadata to attach to the task")
    })), qbY = F6(() => C.object({
        task: C.object({
            id: C.string(),
            subject: C.string()
        })
    })), TAq = {
        name: TR,
        searchHint: "create a task in the task list",
        maxResultSizeChars: 1e5,
        async description() {
            return MAq
        },
        async prompt() {
            return DAq()
        },
        get inputSchema() {
            return AbY()
        },
        get outputSchema() {
            return qbY()
        },
        userFacingName() {
            return "TaskCreate"
        },
        shouldDefer: !0,
        isEnabled() {
            return r$()
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !1
        },
        toAutoClassifierInput(A) {
            return A.subject
        },
        async checkPermissions(A) {
            return {
                behavior: "allow",
                updatedInput: A
            }
        },
        renderToolUseMessage: PAq,
        renderToolUseProgressMessage: WAq,
        renderToolUseRejectedMessage: ZAq,
        renderToolUseErrorMessage: GAq,
        renderToolResultMessage: fAq,
        async call({
            subject: A,
            description: q,
            activeForm: K,
            metadata: Y
        }, z) {
            let _ = await aD1(jf(), {
                subject: A,
                description: q,
                activeForm: K,
                status: "pending",
                owner: void 0,
                blocks: [],
                blockedBy: [],
                metadata: Y
            });
            return z.setAppState((w) => {
                if (w.expandedView === "tasks") return w;
                return {
                    ...w,
                    expandedView: "tasks"
                }
            }), {
                data: {
                    task: {
                        id: _,
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
// @from(Ln 366547, Col 4)
NAq = "Get a task by ID from the task list"
// @from(Ln 366548, Col 4)
VAq = `Use this tool to retrieve a task by its ID from the task list.

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
// @from(Ln 366571, Col 0)
function kAq() {
    return null
}
// @from(Ln 366575, Col 0)
function EAq() {
    return null
}
// @from(Ln 366579, Col 0)
function yAq() {
    return null
}
// @from(Ln 366583, Col 0)
function LAq() {
    return null
}
// @from(Ln 366587, Col 0)
function RAq() {
    return null
}
// @from(Ln 366590, Col 4)
KbY
// @from(Ln 366590, Col 9)
YbY
// @from(Ln 366590, Col 14)
hAq
// @from(Ln 366591, Col 4)
SAq = E(() => {
    K7();
    Bw();
    KbY = F6(() => C.strictObject({
        taskId: C.string().describe("The ID of the task to retrieve")
    })), YbY = F6(() => C.object({
        task: C.object({
            id: C.string(),
            subject: C.string(),
            description: C.string(),
            status: H36(),
            blocks: C.array(C.string()),
            blockedBy: C.array(C.string())
        }).nullable()
    })), hAq = {
        name: lt,
        searchHint: "retrieve a task by ID",
        maxResultSizeChars: 1e5,
        async description() {
            return NAq
        },
        async prompt() {
            return VAq
        },
        get inputSchema() {
            return KbY()
        },
        get outputSchema() {
            return YbY()
        },
        userFacingName() {
            return "TaskGet"
        },
        shouldDefer: !0,
        isEnabled() {
            return r$()
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        toAutoClassifierInput(A) {
            return A.taskId
        },
        async checkPermissions(A) {
            return {
                behavior: "allow",
                updatedInput: A
            }
        },
        renderToolUseMessage: kAq,
        renderToolUseProgressMessage: EAq,
        renderToolUseRejectedMessage: yAq,
        renderToolUseErrorMessage: LAq,
        renderToolResultMessage: RAq,
        async call({
            taskId: A
        }) {
            let q = jf(),
                K = await DB(q, A);
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
// @from(Ln 366692, Col 4)
CAq = "Update a task in the task list"