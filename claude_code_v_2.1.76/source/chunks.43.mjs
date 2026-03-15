
// @from(Ln 106558, Col 4)
zI6 = E(() => {
    t46();
    p38 = WV({
        command: CA(),
        args: VH(CA()).optional(),
        env: NS(CA(), CA()).optional()
    }), _z7 = WV({
        name: CA(),
        email: CA().email().optional(),
        url: CA().url().optional()
    }), wz7 = WV({
        type: CA(),
        url: CA().url()
    }), Oz7 = p38.partial(), $z7 = p38.extend({
        platform_overrides: NS(CA(), Oz7).optional()
    }), Hz7 = WV({
        type: VS(["python", "node", "binary"]),
        entry_point: CA(),
        mcp_config: $z7
    }), jz7 = WV({
        claude_desktop: CA().optional(),
        platforms: VH(VS(["darwin", "win32", "linux"])).optional(),
        runtimes: WV({
            python: CA().optional(),
            node: CA().optional()
        }).optional()
    }).passthrough(), Jz7 = WV({
        name: CA(),
        description: CA().optional()
    }), Mz7 = WV({
        name: CA(),
        description: CA().optional(),
        arguments: VH(CA()).optional(),
        text: CA()
    }), Dz7 = WV({
        type: VS(["string", "number", "boolean", "directory", "file"]),
        title: CA(),
        description: CA(),
        required: CD().optional(),
        default: hA6([CA(), Yy(), CD(), VH(CA())]).optional(),
        multiple: CD().optional(),
        sensitive: CD().optional(),
        min: Yy().optional(),
        max: Yy().optional()
    }), bH3 = NS(CA(), hA6([CA(), Yy(), CD(), VH(CA())])), YI6 = WV({
        $schema: CA().optional(),
        dxt_version: CA().optional().describe("@deprecated Use manifest_version instead"),
        manifest_version: CA().optional(),
        name: CA(),
        display_name: CA().optional(),
        version: CA(),
        description: CA(),
        long_description: CA().optional(),
        author: _z7,
        repository: wz7.optional(),
        homepage: CA().url().optional(),
        documentation: CA().url().optional(),
        support: CA().url().optional(),
        icon: CA().optional(),
        screenshots: VH(CA()).optional(),
        server: Hz7,
        tools: VH(Jz7).optional(),
        tools_generated: CD().optional(),
        prompts: VH(Mz7).optional(),
        prompts_generated: CD().optional(),
        keywords: VH(CA()).optional(),
        license: CA().optional(),
        privacy_policies: VH(CA()).optional(),
        compatibility: jz7.optional(),
        user_config: NS(CA(), Dz7).optional()
    }).refine((A) => !!(A.dxt_version || A.manifest_version), {
        message: "Either 'dxt_version' (deprecated) or 'manifest_version' must be provided"
    }), xH3 = WV({
        status: VS(["signed", "unsigned", "self-signed"]),
        publisher: CA().optional(),
        issuer: CA().optional(),
        valid_from: CA().optional(),
        valid_to: CA().optional(),
        fingerprint: CA().optional()
    })
})
// @from(Ln 106650, Col 0)
function Zz7(A) {
    let q = Wz7(A, "package.json");
    if (Xz7(q)) try {
        return JSON.parse(uH3(q, "utf-8"))
    } catch (K) {}
    return {}
}
// @from(Ln 106658, Col 0)
function Q38(A) {
    if (typeof A.author === "string") return A.author;
    return A.author?.name || ""
}
// @from(Ln 106663, Col 0)
function U38(A) {
    if (typeof A.author === "object") return A.author?.email || "";
    return ""
}
// @from(Ln 106668, Col 0)
function d38(A) {
    if (typeof A.author === "object") return A.author?.url || "";
    return ""
}
// @from(Ln 106673, Col 0)
function Gz7(A) {
    if (typeof A.repository === "string") return A.repository;
    return A.repository?.url || ""
}
// @from(Ln 106678, Col 0)
function fz7(A, q) {
    let K = A.name || Pz7(q),
        Y = Q38(A) || "Unknown Author",
        z = K,
        _ = A.version || "1.0.0",
        w = A.description || "A MCPB bundle";
    return {
        name: K,
        authorName: Y,
        displayName: z,
        version: _,
        description: w
    }
}
// @from(Ln 106693, Col 0)
function Tz7(A) {
    return {
        authorEmail: U38(A),
        authorUrl: d38(A)
    }
}
// @from(Ln 106700, Col 0)
function vz7(A) {
    let K = l38("node", A),
        Y = c38("node", K);
    return {
        serverType: "node",
        entryPoint: K,
        mcp_config: Y
    }
}
// @from(Ln 106710, Col 0)
function Nz7(A) {
    return {
        keywords: "",
        license: A.license || "MIT",
        repository: void 0
    }
}
// @from(Ln 106718, Col 0)
function c38(A, q) {
    switch (A) {
        case "node":
            return {
                command: "node", args: ["${__dirname}/" + q], env: {}
            };
        case "python":
            return {
                command: "python", args: ["${__dirname}/" + q], env: {
                    PYTHONPATH: "${__dirname}/server/lib"
                }
            };
        case "binary":
            return {
                command: "${__dirname}/" + q, args: [], env: {}
            }
    }
}
// @from(Ln 106737, Col 0)
function l38(A, q) {
    switch (A) {
        case "node":
            return q?.main || "server/index.js";
        case "python":
            return "server/main.py";
        case "binary":
            return "server/my-server"
    }
}
// @from(Ln 106747, Col 0)
async function Vz7(A, q) {
    let K = A.name || Pz7(q),
        Y = await hY({
            message: "Extension name:",
            default: K,
            validate: ($) => $.trim().length > 0 || "Name is required"
        }),
        z = await hY({
            message: "Author name:",
            default: Q38(A),
            validate: ($) => $.trim().length > 0 || "Author name is required"
        }),
        _ = await hY({
            message: "Display name (optional):",
            default: Y
        }),
        w = await hY({
            message: "Version:",
            default: A.version || "1.0.0",
            validate: ($) => {
                if (!$.trim()) return "Version is required";
                if (!/^\d+\.\d+\.\d+/.test($)) return "Version must follow semantic versioning (e.g., 1.0.0)";
                return !0
            }
        }),
        O = await hY({
            message: "Description:",
            default: A.description || "",
            validate: ($) => $.trim().length > 0 || "Description is required"
        });
    return {
        name: Y,
        authorName: z,
        displayName: _,
        version: w,
        description: O
    }
}
// @from(Ln 106785, Col 0)
async function kz7(A) {
    let q = await hY({
            message: "Author email (optional):",
            default: U38(A)
        }),
        K = await hY({
            message: "Author URL (optional):",
            default: d38(A)
        });
    return {
        authorEmail: q,
        authorUrl: K
    }
}
// @from(Ln 106799, Col 0)
async function Ez7(A) {
    let q = await S91({
            message: "Server type:",
            choices: [{
                name: "Node.js",
                value: "node"
            }, {
                name: "Python",
                value: "python"
            }, {
                name: "Binary",
                value: "binary"
            }],
            default: "node"
        }),
        K = await hY({
            message: "Entry point:",
            default: l38(q, A)
        }),
        Y = c38(q, K);
    return {
        serverType: q,
        entryPoint: K,
        mcp_config: Y
    }
}
// @from(Ln 106825, Col 0)
async function yz7() {
    let A = await B_({
            message: "Does your MCP Server provide tools you want to advertise (optional)?",
            default: !0
        }),
        q = [],
        K = !1;
    if (A) {
        let Y = !0;
        while (Y) {
            let z = await hY({
                    message: "Tool name:",
                    validate: (w) => w.trim().length > 0 || "Tool name is required"
                }),
                _ = await hY({
                    message: "Tool description (optional):"
                });
            q.push({
                name: z,
                ..._ ? {
                    description: _
                } : {}
            }), Y = await B_({
                message: "Add another tool?",
                default: !1
            })
        }
        K = await B_({
            message: "Does your server generate additional tools at runtime?",
            default: !1
        })
    }
    return {
        tools: q,
        toolsGenerated: K
    }
}
// @from(Ln 106862, Col 0)
async function Lz7() {
    let A = await B_({
            message: "Does your MCP Server provide prompts you want to advertise (optional)?",
            default: !1
        }),
        q = [],
        K = !1;
    if (A) {
        let Y = !0;
        while (Y) {
            let z = await hY({
                    message: "Prompt name:",
                    validate: (H) => H.trim().length > 0 || "Prompt name is required"
                }),
                _ = await hY({
                    message: "Prompt description (optional):"
                }),
                w = await B_({
                    message: "Does this prompt have arguments?",
                    default: !1
                }),
                O = [];
            if (w) {
                let H = !0;
                while (H) {
                    let j = await hY({
                        message: "Argument name:",
                        validate: (J) => {
                            if (!J.trim()) return "Argument name is required";
                            if (O.includes(J)) return "Argument names must be unique";
                            return !0
                        }
                    });
                    O.push(j), H = await B_({
                        message: "Add another argument?",
                        default: !1
                    })
                }
            }
            let $ = await hY({
                message: w ? `Prompt text (use \${arguments.name} for arguments: ${O.join(", ")}):` : "Prompt text:",
                validate: (H) => H.trim().length > 0 || "Prompt text is required"
            });
            q.push({
                name: z,
                ..._ ? {
                    description: _
                } : {},
                ...O.length > 0 ? {
                    arguments: O
                } : {},
                text: $
            }), Y = await B_({
                message: "Add another prompt?",
                default: !1
            })
        }
        K = await B_({
            message: "Does your server generate additional prompts at runtime?",
            default: !1
        })
    }
    return {
        prompts: q,
        promptsGenerated: K
    }
}
// @from(Ln 106929, Col 0)
async function Rz7(A) {
    let q = await hY({
            message: "Keywords (comma-separated, optional):",
            default: ""
        }),
        K = await hY({
            message: "License:",
            default: A.license || "MIT"
        }),
        Y = await B_({
            message: "Add repository information?",
            default: !!A.repository
        }),
        z;
    if (Y) {
        let _ = await hY({
            message: "Repository URL:",
            default: Gz7(A)
        });
        if (_) z = {
            type: "git",
            url: _
        }
    }
    return {
        keywords: q,
        license: K,
        repository: z
    }
}
// @from(Ln 106959, Col 0)
async function hz7(A) {
    if (await B_({
            message: "Add a detailed long description?",
            default: !1
        })) return await hY({
        message: "Long description (supports basic markdown):",
        default: A
    });
    return
}
// @from(Ln 106969, Col 0)
async function Sz7() {
    let A = await hY({
            message: "Homepage URL (optional):",
            validate: (Y) => {
                if (!Y.trim()) return !0;
                try {
                    return new URL(Y), !0
                } catch {
                    return "Must be a valid URL (e.g., https://example.com)"
                }
            }
        }),
        q = await hY({
            message: "Documentation URL (optional):",
            validate: (Y) => {
                if (!Y.trim()) return !0;
                try {
                    return new URL(Y), !0
                } catch {
                    return "Must be a valid URL"
                }
            }
        }),
        K = await hY({
            message: "Support URL (optional):",
            validate: (Y) => {
                if (!Y.trim()) return !0;
                try {
                    return new URL(Y), !0
                } catch {
                    return "Must be a valid URL"
                }
            }
        });
    return {
        homepage: A,
        documentation: q,
        support: K
    }
}
// @from(Ln 107009, Col 0)
async function Cz7() {
    let A = await hY({
            message: "Icon file path (optional, relative to manifest):",
            validate: (Y) => {
                if (!Y.trim()) return !0;
                if (Y.includes("..")) return "Relative paths cannot include '..'";
                return !0
            }
        }),
        q = await B_({
            message: "Add screenshots?",
            default: !1
        }),
        K = [];
    if (q) {
        let Y = !0;
        while (Y) {
            let z = await hY({
                message: "Screenshot file path (relative to manifest):",
                validate: (_) => {
                    if (!_.trim()) return "Screenshot path is required";
                    if (_.includes("..")) return "Relative paths cannot include '..'";
                    return !0
                }
            });
            K.push(z), Y = await B_({
                message: "Add another screenshot?",
                default: !1
            })
        }
    }
    return {
        icon: A,
        screenshots: K
    }
}
// @from(Ln 107045, Col 0)
async function Iz7(A) {
    if (!await B_({
            message: "Add compatibility constraints?",
            default: !1
        })) return;
    let K = await B_({
            message: "Specify supported platforms?",
            default: !1
        }),
        Y;
    if (K) {
        let _ = [];
        if (await B_({
                message: "Support macOS (darwin)?",
                default: !0
            })) _.push("darwin");
        if (await B_({
                message: "Support Windows (win32)?",
                default: !0
            })) _.push("win32");
        if (await B_({
                message: "Support Linux?",
                default: !0
            })) _.push("linux");
        Y = _.length > 0 ? _ : void 0
    }
    let z;
    if (A !== "binary") {
        if (await B_({
                message: "Specify runtime version constraints?",
                default: !1
            })) {
            if (A === "python") z = {
                python: await hY({
                    message: "Python version constraint (e.g., >=3.8,<4.0):",
                    validate: (O) => O.trim().length > 0 || "Python version constraint is required"
                })
            };
            else if (A === "node") z = {
                node: await hY({
                    message: "Node.js version constraint (e.g., >=16.0.0):",
                    validate: (O) => O.trim().length > 0 || "Node.js version constraint is required"
                })
            }
        }
    }
    return {
        ...Y ? {
            platforms: Y
        } : {},
        ...z ? {
            runtimes: z
        } : {}
    }
}
// @from(Ln 107100, Col 0)
async function bz7() {
    if (!await B_({
            message: "Add user-configurable options?",
            default: !1
        })) return {};
    let q = {},
        K = !0;
    while (K) {
        let Y = await hY({
                message: "Configuration option key (unique identifier):",
                validate: (j) => {
                    if (!j.trim()) return "Key is required";
                    if (q[j]) return "Key must be unique";
                    return !0
                }
            }),
            z = await S91({
                message: "Option type:",
                choices: [{
                    name: "String",
                    value: "string"
                }, {
                    name: "Number",
                    value: "number"
                }, {
                    name: "Boolean",
                    value: "boolean"
                }, {
                    name: "Directory",
                    value: "directory"
                }, {
                    name: "File",
                    value: "file"
                }]
            }),
            _ = await hY({
                message: "Option title (human-readable name):",
                validate: (j) => j.trim().length > 0 || "Title is required"
            }),
            w = await hY({
                message: "Option description:",
                validate: (j) => j.trim().length > 0 || "Description is required"
            }),
            O = await B_({
                message: "Is this option required?",
                default: !1
            }),
            $ = await B_({
                message: "Is this option sensitive (like a password)?",
                default: !1
            }),
            H = {
                type: z,
                title: _,
                description: w,
                required: O,
                sensitive: $
            };
        if (!O) {
            let j;
            if (z === "boolean") j = await B_({
                message: "Default value:",
                default: !1
            });
            else if (z === "number") {
                let J = await hY({
                    message: "Default value (number):",
                    validate: (M) => {
                        if (!M.trim()) return !0;
                        return !isNaN(Number(M)) || "Must be a valid number"
                    }
                });
                j = J ? Number(J) : void 0
            } else j = await hY({
                message: "Default value (optional):"
            });
            if (j !== void 0 && j !== "") H.default = j
        }
        if (z === "number") {
            if (await B_({
                    message: "Add min/max constraints?",
                    default: !1
                })) {
                let J = await hY({
                        message: "Minimum value (optional):",
                        validate: (D) => {
                            if (!D.trim()) return !0;
                            return !isNaN(Number(D)) || "Must be a valid number"
                        }
                    }),
                    M = await hY({
                        message: "Maximum value (optional):",
                        validate: (D) => {
                            if (!D.trim()) return !0;
                            return !isNaN(Number(D)) || "Must be a valid number"
                        }
                    });
                if (J) H.min = Number(J);
                if (M) H.max = Number(M)
            }
        }
        q[Y] = H, K = await B_({
            message: "Add another configuration option?",
            default: !1
        })
    }
    return q
}
// @from(Ln 107209, Col 0)
function xz7(A, q, K, Y, z, _, w, O, $, H, j, J, M) {
    let {
        name: D,
        displayName: X,
        version: P,
        description: W,
        authorName: Z
    } = A, {
        authorEmail: G,
        authorUrl: f
    } = K, {
        serverType: v,
        entryPoint: N,
        mcp_config: V
    } = _, {
        keywords: L,
        license: h,
        repository: R
    } = M;
    return {
        manifest_version: e46,
        name: D,
        ...X && X !== D ? {
            display_name: X
        } : {},
        version: P,
        description: W,
        ...q ? {
            long_description: q
        } : {},
        author: {
            name: Z,
            ...G ? {
                email: G
            } : {},
            ...f ? {
                url: f
            } : {}
        },
        ...Y.homepage ? {
            homepage: Y.homepage
        } : {},
        ...Y.documentation ? {
            documentation: Y.documentation
        } : {},
        ...Y.support ? {
            support: Y.support
        } : {},
        ...z.icon ? {
            icon: z.icon
        } : {},
        ...z.screenshots.length > 0 ? {
            screenshots: z.screenshots
        } : {},
        server: {
            type: v,
            entry_point: N,
            mcp_config: V
        },
        ...w.length > 0 ? {
            tools: w
        } : {},
        ...O ? {
            tools_generated: !0
        } : {},
        ...$.length > 0 ? {
            prompts: $
        } : {},
        ...H ? {
            prompts_generated: !0
        } : {},
        ...j ? {
            compatibility: j
        } : {},
        ...Object.keys(J).length > 0 ? {
            user_config: J
        } : {},
        ...L ? {
            keywords: L.split(",").map((u) => u.trim()).filter((u) => u)
        } : {},
        ...h ? {
            license: h
        } : {},
        ...R ? {
            repository: R
        } : {}
    }
}
// @from(Ln 107298, Col 0)
function uz7() {
    console.log(`
Next steps:`), console.log("1. Ensure all your production dependencies are in this directory"), console.log("2. Run 'mcpb pack' to create your .mcpb file")
}
// @from(Ln 107302, Col 0)
async function i38(A = process.cwd(), q = !1) {
    let K = BH3(A),
        Y = Wz7(K, "manifest.json");
    if (Xz7(Y)) {
        if (q) return console.log("manifest.json already exists. Use --force to overwrite in non-interactive mode."), !1;
        if (!await B_({
                message: "manifest.json already exists. Overwrite?",
                default: !1
            })) return console.log("Cancelled"), !1
    }
    if (!q) console.log("This utility will help you create a manifest.json file for your MCPB bundle."), console.log(`Press ^C at any time to quit.
`);
    else console.log("Creating manifest.json with default values...");
    try {
        let z = Zz7(K),
            _ = q ? fz7(z, K) : await Vz7(z, K),
            w = q ? void 0 : await hz7(_.description),
            O = q ? Tz7(z) : await kz7(z),
            $ = q ? {
                homepage: "",
                documentation: "",
                support: ""
            } : await Sz7(),
            H = q ? {
                icon: "",
                screenshots: []
            } : await Cz7(),
            j = q ? vz7(z) : await Ez7(z),
            J = q ? {
                tools: [],
                toolsGenerated: !1
            } : await yz7(),
            M = q ? {
                prompts: [],
                promptsGenerated: !1
            } : await Lz7(),
            D = q ? void 0 : await Iz7(j.serverType),
            X = q ? {} : await bz7(),
            P = q ? Nz7(z) : await Rz7(z),
            W = xz7(_, w, O, $, H, j, J.tools, J.toolsGenerated, M.prompts, M.promptsGenerated, D, X, P);
        return mH3(Y, JSON.stringify(W, null, 2) + `
`), console.log(`
Created manifest.json at ${Y}`), uz7(), !0
    } catch (z) {
        if (z instanceof Error && z.message.includes("User force closed")) return console.log(`
Cancelled`), !1;
        throw z
    }
}
// @from(Ln 107351, Col 4)
n38 = E(() => {
    F38();
    zI6()
})
// @from(Ln 107355, Col 4)
f98 = {}
// @from(Ln 107411, Col 0)
function qq6(A, q) {
    if (typeof A == "function") q = A, A = {};
    return this.ondata = q, A
}
// @from(Ln 107416, Col 0)
function Y_7(A, q, K) {
    if (!K) K = q, q = {};
    if (typeof K != "function") Tq(7);
    return oJ6(A, q, [rJ6], function(Y) {
        return Fo(JI6(Y.data[0], Y.data[1]))
    }, 0, K)
}
// @from(Ln 107424, Col 0)
function JI6(A, q) {
    return Aq6(A, q || {}, 0, 0)
}
// @from(Ln 107428, Col 0)
function D98(A, q, K) {
    if (!K) K = q, q = {};
    if (typeof K != "function") Tq(7);
    return oJ6(A, q, [nJ6], function(Y) {
        return Fo(sJ6(Y.data[0], w98(Y.data[1])))
    }, 1, K)
}
// @from(Ln 107436, Col 0)
function sJ6(A, q) {
    return HI6(A, {
        i: 2
    }, q && q.out, q && q.dictionary)
}
// @from(Ln 107442, Col 0)
function lH3(A, q, K) {
    if (!K) K = q, q = {};
    if (typeof K != "function") Tq(7);
    return oJ6(A, q, [rJ6, sz7, function() {
        return [e38]
    }], function(Y) {
        return Fo(e38(Y.data[0], Y.data[1]))
    }, 2, K)
}
// @from(Ln 107452, Col 0)
function e38(A, q) {
    if (!q) q = {};
    var K = iJ6(),
        Y = A.length;
    K.p(A);
    var z = Aq6(A, q, H98(q), 8),
        _ = z.length;
    return O98(z, q), pz(z, _ - 8, K.d()), pz(z, _ - 4, Y), z
}
// @from(Ln 107462, Col 0)
function __7(A, q, K) {
    if (!K) K = q, q = {};
    if (typeof K != "function") Tq(7);
    return oJ6(A, q, [nJ6, tz7, function() {
        return [F91]
    }], function(Y) {
        return Fo(F91(Y.data[0], Y.data[1]))
    }, 3, K)
}
// @from(Ln 107472, Col 0)
function F91(A, q) {
    var K = $98(A);
    if (K + 8 > A.length) Tq(6, "invalid gzip data");
    return HI6(A.subarray(K, -8), {
        i: 2
    }, q && q.out || new Y3(q_7(A)), q && q.dictionary)
}
// @from(Ln 107480, Col 0)
function nH3(A, q, K) {
    if (!K) K = q, q = {};
    if (typeof K != "function") Tq(7);
    return oJ6(A, q, [rJ6, ez7, function() {
        return [q98]
    }], function(Y) {
        return Fo(q98(Y.data[0], Y.data[1]))
    }, 4, K)
}
// @from(Ln 107490, Col 0)
function q98(A, q) {
    if (!q) q = {};
    var K = d91();
    K.p(A);
    var Y = Aq6(A, q, q.dictionary ? 6 : 2, 4);
    return j98(Y, q), pz(Y, Y.length - 4, K.d()), Y
}
// @from(Ln 107498, Col 0)
function O_7(A, q, K) {
    if (!K) K = q, q = {};
    if (typeof K != "function") Tq(7);
    return oJ6(A, q, [nJ6, A_7, function() {
        return [Q91]
    }], function(Y) {
        return Fo(Q91(Y.data[0], w98(Y.data[1])))
    }, 5, K)
}
// @from(Ln 107508, Col 0)
function Q91(A, q) {
    return HI6(A.subarray(J98(A, q && q.dictionary), -4), {
        i: 2
    }, q && q.out, q && q.dictionary)
}
// @from(Ln 107514, Col 0)
function oH3(A, q, K) {
    if (!K) K = q, q = {};
    if (typeof K != "function") Tq(7);
    return A[0] == 31 && A[1] == 139 && A[2] == 8 ? __7(A, q, K) : (A[0] & 15) != 8 || A[0] >> 4 > 7 || (A[0] << 8 | A[1]) % 31 ? D98(A, q, K) : O_7(A, q, K)
}
// @from(Ln 107520, Col 0)
function aH3(A, q) {
    return A[0] == 31 && A[1] == 139 && A[2] == 8 ? F91(A, q) : (A[0] & 15) != 8 || A[0] >> 4 > 7 || (A[0] << 8 | A[1]) % 31 ? sJ6(A, q) : Q91(A, q)
}
// @from(Ln 107524, Col 0)
function go(A, q) {
    if (q) {
        var K = new Y3(A.length);
        for (var Y = 0; Y < A.length; ++Y) K[Y] = A.charCodeAt(Y);
        return K
    }
    if (Bz7) return Bz7.encode(A);
    var z = A.length,
        _ = new Y3(A.length + (A.length >> 1)),
        w = 0,
        O = function(j) {
            _[w++] = j
        };
    for (var Y = 0; Y < z; ++Y) {
        if (w + 5 > _.length) {
            var $ = new Y3(w + 8 + (z - Y << 1));
            $.set(_), _ = $
        }
        var H = A.charCodeAt(Y);
        if (H < 128 || q) O(H);
        else if (H < 2048) O(192 | H >> 6), O(128 | H & 63);
        else if (H > 55295 && H < 57344) H = 65536 + (H & 1047552) | A.charCodeAt(++Y) & 1023, O(240 | H >> 18), O(128 | H >> 12 & 63), O(128 | H >> 6 & 63), O(128 | H & 63);
        else O(224 | H >> 12), O(128 | H >> 6 & 63), O(128 | H & 63)
    }
    return _L(_, 0, w)
}
// @from(Ln 107551, Col 0)
function P98(A, q) {
    if (q) {
        var K = "";
        for (var Y = 0; Y < A.length; Y += 16384) K += String.fromCharCode.apply(null, A.subarray(Y, Y + 16384));
        return K
    } else if (Y98) return Y98.decode(A);
    else {
        var z = H_7(A),
            _ = z.s,
            K = z.r;
        if (K.length) Tq(8);
        return _
    }
}
// @from(Ln 107566, Col 0)
function Kj3(A, q, K) {
    if (!K) K = q, q = {};
    if (typeof K != "function") Tq(7);
    var Y = {};
    X98(A, "", Y, q);
    var z = Object.keys(Y),
        _ = z.length,
        w = 0,
        O = 0,
        $ = _,
        H = Array(_),
        j = [],
        J = function() {
            for (var W = 0; W < j.length; ++W) j[W]()
        },
        M = function(W, Z) {
            U91(function() {
                K(W, Z)
            })
        };
    U91(function() {
        M = K
    });
    var D = function() {
        var W = new Y3(O + 22),
            Z = w,
            G = O - w;
        O = 0;
        for (var f = 0; f < $; ++f) {
            var v = H[f];
            try {
                var N = v.c.length;
                UJ6(W, O, v, v.f, v.u, N);
                var V = 30 + v.f.length + Bo(v.extra),
                    L = O + V;
                W.set(v.c, L), UJ6(W, w, v, v.f, v.u, N, O, v.m), w += 16 + V + (v.m ? v.m.length : 0), O = L + N
            } catch (h) {
                return M(h, null)
            }
        }
        W98(W, w, H.length, G, Z), M(null, W)
    };
    if (!_) D();
    var X = function(W) {
        var Z = z[W],
            G = Y[Z],
            f = G[0],
            v = G[1],
            N = iJ6(),
            V = f.length;
        N.p(f);
        var L = go(Z),
            h = L.length,
            R = v.comment,
            u = R && go(R),
            I = u && u.length,
            g = Bo(v.extra),
            B = v.level == 0 ? 0 : 8,
            b = function(p, Q) {
                if (p) J(), M(p, null);
                else {
                    var U = Q.length;
                    if (H[W] = jI6(v, {
                            size: V,
                            crc: N.d(),
                            c: Q,
                            f: L,
                            m: u,
                            u: h != Z.length || u && R.length != I,
                            compression: B
                        }), w += 30 + h + g + U, O += 76 + 2 * (h + g) + (I || 0) + U, !--_) D()
                }
            };
        if (h > 65535) b(Tq(11, 0, 1), null);
        if (!B) b(null, f);
        else if (V < 160000) try {
            b(null, JI6(f, v))
        } catch (p) {
            b(p, null)
        } else j.push(Y_7(f, v, b))
    };
    for (var P = 0; P < $; ++P) X(P);
    return J
}
// @from(Ln 107651, Col 0)
function Z98(A, q) {
    if (!q) q = {};
    var K = {},
        Y = [];
    X98(A, "", K, q);
    var z = 0,
        _ = 0;
    for (var w in K) {
        var O = K[w],
            $ = O[0],
            H = O[1],
            j = H.level == 0 ? 0 : 8,
            J = go(w),
            M = J.length,
            D = H.comment,
            X = D && go(D),
            P = X && X.length,
            W = Bo(H.extra);
        if (M > 65535) Tq(11);
        var Z = j ? JI6($, H) : $,
            G = Z.length,
            f = iJ6();
        f.p($), Y.push(jI6(H, {
            size: $.length,
            crc: f.d(),
            c: Z,
            f: J,
            m: X,
            u: M != w.length || X && D.length != P,
            o: z,
            compression: j
        })), z += 30 + M + W + G, _ += 76 + 2 * (M + W) + (P || 0) + G
    }
    var v = new Y3(_ + 22),
        N = z,
        V = _ - z;
    for (var L = 0; L < Y.length; ++L) {
        var J = Y[L];
        UJ6(v, J.o, J, J.f, J.u, J.c.length);
        var h = 30 + J.f.length + Bo(J.extra);
        v.set(J.c, J.o + h), UJ6(v, z, J, J.f, J.u, J.c.length, J.o, J.m), z += 16 + h + (J.m ? J.m.length : 0)
    }
    return W98(v, z, Y.length, V, N), v
}
// @from(Ln 107696, Col 0)
function wj3(A, q, K) {
    if (!K) K = q, q = {};
    if (typeof K != "function") Tq(7);
    var Y = [],
        z = function() {
            for (var W = 0; W < Y.length; ++W) Y[W]()
        },
        _ = {},
        w = function(W, Z) {
            U91(function() {
                K(W, Z)
            })
        };
    U91(function() {
        w = K
    });
    var O = A.length - 22;
    for (; Ej(A, O) != 101010256; --O)
        if (!O || A.length - O > 65558) return w(Tq(13, 0, 1), null), z;
    var $ = hG(A, O + 8);
    if ($) {
        var H = $,
            j = Ej(A, O + 16),
            J = j == 4294967295 || H == 65535;
        if (J) {
            var M = Ej(A, O - 12);
            if (J = Ej(A, M) == 101075792, J) H = $ = Ej(A, M + 32), j = Ej(A, M + 48)
        }
        var D = q && q.filter,
            X = function(W) {
                var Z = M_7(A, j, J),
                    G = Z[0],
                    f = Z[1],
                    v = Z[2],
                    N = Z[3],
                    V = Z[4],
                    L = Z[5],
                    h = J_7(A, L);
                j = V;
                var R = function(I, g) {
                    if (I) z(), w(I, null);
                    else {
                        if (g) _[N] = g;
                        if (!--$) w(null, _)
                    }
                };
                if (!D || D({
                        name: N,
                        size: f,
                        originalSize: v,
                        compression: G
                    }))
                    if (!G) R(null, _L(A, h, h + f));
                    else if (G == 8) {
                    var u = A.subarray(h, h + f);
                    if (v < 524288 || f > 0.8 * v) try {
                        R(null, sJ6(u, {
                            out: new Y3(v)
                        }))
                    } catch (I) {
                        R(I, null)
                    } else Y.push(D98(u, {
                        size: v
                    }, R))
                } else R(Tq(14, "unknown compression type " + G, 1), null);
                else R(null, null)
            };
        for (var P = 0; P < H; ++P) X(P)
    } else w(null, {});
    return z
}
// @from(Ln 107768, Col 0)
function G98(A, q) {
    var K = {},
        Y = A.length - 22;
    for (; Ej(A, Y) != 101010256; --Y)
        if (!Y || A.length - Y > 65558) Tq(13);
    var z = hG(A, Y + 8);
    if (!z) return {};
    var _ = Ej(A, Y + 16),
        w = _ == 4294967295 || z == 65535;
    if (w) {
        var O = Ej(A, Y - 12);
        if (w = Ej(A, O) == 101075792, w) z = Ej(A, O + 32), _ = Ej(A, O + 48)
    }
    var $ = q && q.filter;
    for (var H = 0; H < z; ++H) {
        var j = M_7(A, _, w),
            J = j[0],
            M = j[1],
            D = j[2],
            X = j[3],
            P = j[4],
            W = j[5],
            Z = J_7(A, W);
        if (_ = P, !$ || $({
                name: X,
                size: M,
                originalSize: D,
                compression: J
            }))
            if (!J) K[X] = _L(A, Z, Z + M);
            else if (J == 8) K[X] = sJ6(A.subarray(Z, Z + M), {
            out: new Y3(D)
        });
        else Tq(14, "unknown compression type " + J)
    }
    return K
}
// @from(Ln 107805, Col 4)
FH3
// @from(Ln 107805, Col 9)
I91
// @from(Ln 107805, Col 14)
pH3 = ";var __w=require('worker_threads');__w.parentPort.on('message',function(m){onmessage({data:m})}),postMessage=function(m,t){__w.parentPort.postMessage(m,t)},close=process.exit;self=global"
// @from(Ln 107806, Col 4)
QH3
// @from(Ln 107806, Col 9)
Y3
// @from(Ln 107806, Col 13)
SG
// @from(Ln 107806, Col 17)
$I6
// @from(Ln 107806, Col 22)
dJ6
// @from(Ln 107806, Col 27)
cJ6
// @from(Ln 107806, Col 32)
_I6
// @from(Ln 107806, Col 37)
gz7 = function(A, q) {
        var K = new SG(31);
        for (var Y = 0; Y < 31; ++Y) K[Y] = q += 1 << A[Y - 1];
        var z = new $I6(K[30]);
        for (var Y = 1; Y < 30; ++Y)
            for (var _ = K[Y]; _ < K[Y + 1]; ++_) z[_] = _ - K[Y] << 5 | Y;
        return {
            b: K,
            r: z
        }
    }
// @from(Ln 107817, Col 4)
Fz7
// @from(Ln 107817, Col 9)
z98
// @from(Ln 107817, Col 14)
m91
// @from(Ln 107817, Col 19)
pz7
// @from(Ln 107817, Col 24)
Qz7
// @from(Ln 107817, Col 29)
o38
// @from(Ln 107817, Col 34)
wI6
// @from(Ln 107817, Col 39)
Uu
// @from(Ln 107817, Col 43)
G9
// @from(Ln 107817, Col 47)
zL = function(A, q, K) {
        var Y = A.length,
            z = 0,
            _ = new SG(q);
        for (; z < Y; ++z)
            if (A[z]) ++_[A[z] - 1];
        var w = new SG(q);
        for (z = 1; z < q; ++z) w[z] = w[z - 1] + _[z - 1] << 1;
        var O;
        if (K) {
            O = new SG(1 << q);
            var $ = 15 - q;
            for (z = 0; z < Y; ++z)
                if (A[z]) {
                    var H = z << 4 | A[z],
                        j = q - A[z],
                        J = w[A[z] - 1]++ << j;
                    for (var M = J | (1 << j) - 1; J <= M; ++J) O[wI6[J] >> $] = H
                }
        } else {
            O = new SG(Y);
            for (z = 0; z < Y; ++z)
                if (A[z]) O[z] = wI6[w[A[z] - 1]++] >> 15 - A[z]
        }
        return O
    }
// @from(Ln 107843, Col 4)
nQ
// @from(Ln 107843, Col 24)
QJ6
// @from(Ln 107843, Col 33)
Uz7
// @from(Ln 107843, Col 38)
dz7
// @from(Ln 107843, Col 43)
cz7
// @from(Ln 107843, Col 48)
lz7
// @from(Ln 107843, Col 53)
b91 = function(A) {
        var q = A[0];
        for (var K = 1; K < A.length; ++K)
            if (A[K] > q) q = A[K];
        return q
    }
// @from(Ln 107849, Col 4)
YL = function(A, q, K) {
        var Y = q / 8 | 0;
        return (A[Y] | A[Y + 1] << 8) >> (q & 7) & K
    }
// @from(Ln 107853, Col 4)
x91 = function(A, q) {
        var K = q / 8 | 0;
        return (A[K] | A[K + 1] << 8 | A[K + 2] << 16) >> (q & 7)
    }
// @from(Ln 107857, Col 4)
lJ6 = function(A) {
        return (A + 7) / 8 | 0
    }
// @from(Ln 107860, Col 4)
_L = function(A, q, K) {
        if (q == null || q < 0) q = 0;
        if (K == null || K > A.length) K = A.length;
        return new Y3(A.subarray(q, K))
    }
// @from(Ln 107865, Col 4)
UH3
// @from(Ln 107865, Col 9)
iz7
// @from(Ln 107865, Col 14)
Tq = function(A, q, K) {
        var Y = Error(q || iz7[A]);
        if (Y.code = A, Error.captureStackTrace) Error.captureStackTrace(Y, Tq);
        if (!K) throw Y;
        return Y
    }
// @from(Ln 107871, Col 4)
HI6 = function(A, q, K, Y) {
        var z = A.length,
            _ = Y ? Y.length : 0;
        if (!z || q.f && !q.l) return K || new Y3(0);
        var w = !K,
            O = w || q.i != 2,
            $ = q.i;
        if (w) K = new Y3(z * 3);
        var H = function(a) {
                var i = K.length;
                if (a > i) {
                    var l = new Y3(Math.max(i * 2, a));
                    l.set(K), K = l
                }
            },
            j = q.f || 0,
            J = q.p || 0,
            M = q.b || 0,
            D = q.l,
            X = q.d,
            P = q.m,
            W = q.n,
            Z = z * 8;
        do {
            if (!D) {
                j = YL(A, J, 1);
                var G = YL(A, J + 1, 3);
                if (J += 3, !G) {
                    var f = lJ6(J) + 4,
                        v = A[f - 4] | A[f - 3] << 8,
                        N = f + v;
                    if (N > z) {
                        if ($) Tq(0);
                        break
                    }
                    if (O) H(M + v);
                    K.set(A.subarray(f, N), M), q.b = M += v, q.p = J = N * 8, q.f = j;
                    continue
                } else if (G == 1) D = dz7, X = lz7, P = 9, W = 5;
                else if (G == 2) {
                    var V = YL(A, J, 31) + 257,
                        L = YL(A, J + 10, 15) + 4,
                        h = V + YL(A, J + 5, 31) + 1;
                    J += 14;
                    var R = new Y3(h),
                        u = new Y3(19);
                    for (var I = 0; I < L; ++I) u[_I6[I]] = YL(A, J + I * 3, 7);
                    J += L * 3;
                    var g = b91(u),
                        B = (1 << g) - 1,
                        b = zL(u, g, 1);
                    for (var I = 0; I < h;) {
                        var p = b[YL(A, J, B)];
                        J += p & 15;
                        var f = p >> 4;
                        if (f < 16) R[I++] = f;
                        else {
                            var Q = 0,
                                U = 0;
                            if (f == 16) U = 3 + YL(A, J, 3), J += 2, Q = R[I - 1];
                            else if (f == 17) U = 3 + YL(A, J, 7), J += 3;
                            else if (f == 18) U = 11 + YL(A, J, 127), J += 7;
                            while (U--) R[I++] = Q
                        }
                    }
                    var r = R.subarray(0, V),
                        e = R.subarray(V);
                    P = b91(r), W = b91(e), D = zL(r, P, 1), X = zL(e, W, 1)
                } else Tq(1);
                if (J > Z) {
                    if ($) Tq(0);
                    break
                }
            }
            if (O) H(M + 131072);
            var Y6 = (1 << P) - 1,
                H6 = (1 << W) - 1,
                J6 = J;
            for (;; J6 = J) {
                var Q = D[x91(A, J) & Y6],
                    K6 = Q >> 4;
                if (J += Q & 15, J > Z) {
                    if ($) Tq(0);
                    break
                }
                if (!Q) Tq(2);
                if (K6 < 256) K[M++] = K6;
                else if (K6 == 256) {
                    J6 = J, D = null;
                    break
                } else {
                    var s = K6 - 254;
                    if (K6 > 264) {
                        var I = K6 - 257,
                            X6 = dJ6[I];
                        s = YL(A, J, (1 << X6) - 1) + z98[I], J += X6
                    }
                    var z6 = X[x91(A, J) & H6],
                        N6 = z6 >> 4;
                    if (!z6) Tq(3);
                    J += z6 & 15;
                    var e = Qz7[N6];
                    if (N6 > 3) {
                        var X6 = cJ6[N6];
                        e += x91(A, J) & (1 << X6) - 1, J += X6
                    }
                    if (J > Z) {
                        if ($) Tq(0);
                        break
                    }
                    if (O) H(M + 131072);
                    var $6 = M + s;
                    if (M < e) {
                        var n = _ - e,
                            o = Math.min(e, $6);
                        if (n + M < 0) Tq(3);
                        for (; M < o; ++M) K[M] = Y[n + M]
                    }
                    for (; M < $6; ++M) K[M] = K[M - e]
                }
            }
            if (q.l = D, q.p = J6, q.b = M, q.f = j, D) j = 1, q.m = P, q.d = X, q.n = W
        } while (!j);
        return M != K.length && w ? _L(K, 0, M) : K.subarray(0, M)
    }
// @from(Ln 107996, Col 4)
du = function(A, q, K) {
        K <<= q & 7;
        var Y = q / 8 | 0;
        A[Y] |= K, A[Y + 1] |= K >> 8
    }
// @from(Ln 108001, Col 4)
FJ6 = function(A, q, K) {
        K <<= q & 7;
        var Y = q / 8 | 0;
        A[Y] |= K, A[Y + 1] |= K >> 8, A[Y + 2] |= K >> 16
    }
// @from(Ln 108006, Col 4)
u91 = function(A, q) {
        var K = [];
        for (var Y = 0; Y < A.length; ++Y)
            if (A[Y]) K.push({
                s: Y,
                f: A[Y]
            });
        var z = K.length,
            _ = K.slice();
        if (!z) return {
            t: mo,
            l: 0
        };
        if (z == 1) {
            var w = new Y3(K[0].s + 1);
            return w[K[0].s] = 1, {
                t: w,
                l: 1
            }
        }
        K.sort(function(N, V) {
            return N.f - V.f
        }), K.push({
            s: -1,
            f: 25001
        });
        var O = K[0],
            $ = K[1],
            H = 0,
            j = 1,
            J = 2;
        K[0] = {
            s: -1,
            f: O.f + $.f,
            l: O,
            r: $
        };
        while (j != z - 1) O = K[K[H].f < K[J].f ? H++ : J++], $ = K[H != j && K[H].f < K[J].f ? H++ : J++], K[j++] = {
            s: -1,
            f: O.f + $.f,
            l: O,
            r: $
        };
        var M = _[0].s;
        for (var Y = 1; Y < z; ++Y)
            if (_[Y].s > M) M = _[Y].s;
        var D = new SG(M + 1),
            X = B91(K[j - 1], D, 0);
        if (X > q) {
            var Y = 0,
                P = 0,
                W = X - q,
                Z = 1 << W;
            _.sort(function(V, L) {
                return D[L.s] - D[V.s] || V.f - L.f
            });
            for (; Y < z; ++Y) {
                var G = _[Y].s;
                if (D[G] > q) P += Z - (1 << X - D[G]), D[G] = q;
                else break
            }
            P >>= W;
            while (P > 0) {
                var f = _[Y].s;
                if (D[f] < q) P -= 1 << q - D[f]++ - 1;
                else ++Y
            }
            for (; Y >= 0 && P; --Y) {
                var v = _[Y].s;
                if (D[v] == q) --D[v], ++P
            }
            X = q
        }
        return {
            t: new Y3(D),
            l: X
        }
    }
// @from(Ln 108084, Col 4)
B91 = function(A, q, K) {
        return A.s == -1 ? Math.max(B91(A.l, q, K + 1), B91(A.r, q, K + 1)) : q[A.s] = K
    }
// @from(Ln 108087, Col 4)
a38 = function(A) {
        var q = A.length;
        while (q && !A[--q]);
        var K = new SG(++q),
            Y = 0,
            z = A[0],
            _ = 1,
            w = function($) {
                K[Y++] = $
            };
        for (var O = 1; O <= q; ++O)
            if (A[O] == z && O != q) ++_;
            else {
                if (!z && _ > 2) {
                    for (; _ > 138; _ -= 138) w(32754);
                    if (_ > 2) w(_ > 10 ? _ - 11 << 5 | 28690 : _ - 3 << 5 | 12305), _ = 0
                } else if (_ > 3) {
                    w(z), --_;
                    for (; _ > 6; _ -= 6) w(8304);
                    if (_ > 2) w(_ - 3 << 5 | 8208), _ = 0
                }
                while (_--) w(z);
                _ = 1, z = A[O]
            } return {
            c: K.subarray(0, Y),
            n: q
        }
    }
// @from(Ln 108115, Col 4)
pJ6 = function(A, q) {
        var K = 0;
        for (var Y = 0; Y < q.length; ++Y) K += A[Y] * q[Y];
        return K
    }
// @from(Ln 108120, Col 4)
_98 = function(A, q, K) {
        var Y = K.length,
            z = lJ6(q + 2);
        A[z] = Y & 255, A[z + 1] = Y >> 8, A[z + 2] = A[z] ^ 255, A[z + 3] = A[z + 1] ^ 255;
        for (var _ = 0; _ < Y; ++_) A[z + _ + 4] = K[_];
        return (z + 4 + Y) * 8
    }
// @from(Ln 108127, Col 4)
s38 = function(A, q, K, Y, z, _, w, O, $, H, j) {
        du(q, j++, K), ++z[256];
        var J = u91(z, 15),
            M = J.t,
            D = J.l,
            X = u91(_, 15),
            P = X.t,
            W = X.l,
            Z = a38(M),
            G = Z.c,
            f = Z.n,
            v = a38(P),
            N = v.c,
            V = v.n,
            L = new SG(19);
        for (var h = 0; h < G.length; ++h) ++L[G[h] & 31];
        for (var h = 0; h < N.length; ++h) ++L[N[h] & 31];
        var R = u91(L, 7),
            u = R.t,
            I = R.l,
            g = 19;
        for (; g > 4 && !u[_I6[g - 1]]; --g);
        var B = H + 5 << 3,
            b = pJ6(z, nQ) + pJ6(_, QJ6) + w,
            p = pJ6(z, M) + pJ6(_, P) + w + 14 + 3 * g + pJ6(L, u) + 2 * L[16] + 3 * L[17] + 7 * L[18];
        if ($ >= 0 && B <= b && B <= p) return _98(q, j, A.subarray($, $ + H));
        var Q, U, r, e;
        if (du(q, j, 1 + (p < b)), j += 2, p < b) {
            Q = zL(M, D, 0), U = M, r = zL(P, W, 0), e = P;
            var Y6 = zL(u, I, 0);
            du(q, j, f - 257), du(q, j + 5, V - 1), du(q, j + 10, g - 4), j += 14;
            for (var h = 0; h < g; ++h) du(q, j + 3 * h, u[_I6[h]]);
            j += 3 * g;
            var H6 = [G, N];
            for (var J6 = 0; J6 < 2; ++J6) {
                var K6 = H6[J6];
                for (var h = 0; h < K6.length; ++h) {
                    var s = K6[h] & 31;
                    if (du(q, j, Y6[s]), j += u[s], s > 15) du(q, j, K6[h] >> 5 & 127), j += K6[h] >> 12
                }
            }
        } else Q = Uz7, U = nQ, r = cz7, e = QJ6;
        for (var h = 0; h < O; ++h) {
            var X6 = Y[h];
            if (X6 > 255) {
                var s = X6 >> 18 & 31;
                if (FJ6(q, j, Q[s + 257]), j += U[s + 257], s > 7) du(q, j, X6 >> 23 & 31), j += dJ6[s];
                var z6 = X6 & 31;
                if (FJ6(q, j, r[z6]), j += e[z6], z6 > 3) FJ6(q, j, X6 >> 5 & 8191), j += cJ6[z6]
            } else FJ6(q, j, Q[X6]), j += U[X6]
        }
        return FJ6(q, j, Q[256]), j + U[256]
    }
// @from(Ln 108180, Col 4)
nz7
// @from(Ln 108180, Col 9)
mo
// @from(Ln 108180, Col 13)
rz7 = function(A, q, K, Y, z, _) {
        var w = _.z || A.length,
            O = new Y3(Y + w + 5 * (1 + Math.ceil(w / 7000)) + z),
            $ = O.subarray(Y, O.length - z),
            H = _.l,
            j = (_.r || 0) & 7;
        if (q) {
            if (j) $[0] = _.r >> 3;
            var J = nz7[q - 1],
                M = J >> 13,
                D = J & 8191,
                X = (1 << K) - 1,
                P = _.p || new SG(32768),
                W = _.h || new SG(X + 1),
                Z = Math.ceil(K / 3),
                G = 2 * Z,
                f = function(q6) {
                    return (A[q6] ^ A[q6 + 1] << Z ^ A[q6 + 2] << G) & X
                },
                v = new $I6(25000),
                N = new SG(288),
                V = new SG(32),
                L = 0,
                h = 0,
                R = _.i || 0,
                u = 0,
                I = _.w || 0,
                g = 0;
            for (; R + 2 < w; ++R) {
                var B = f(R),
                    b = R & 32767,
                    p = W[B];
                if (P[b] = p, W[B] = b, I <= R) {
                    var Q = w - R;
                    if ((L > 7000 || u > 24576) && (Q > 423 || !H)) {
                        j = s38(A, $, 0, v, N, V, h, u, g, R - g, j), u = L = h = 0, g = R;
                        for (var U = 0; U < 286; ++U) N[U] = 0;
                        for (var U = 0; U < 30; ++U) V[U] = 0
                    }
                    var r = 2,
                        e = 0,
                        Y6 = D,
                        H6 = b - p & 32767;
                    if (Q > 2 && B == f(R - H6)) {
                        var J6 = Math.min(M, Q) - 1,
                            K6 = Math.min(32767, R),
                            s = Math.min(258, Q);
                        while (H6 <= K6 && --Y6 && b != p) {
                            if (A[R + r] == A[R + r - H6]) {
                                var X6 = 0;
                                for (; X6 < s && A[R + X6] == A[R + X6 - H6]; ++X6);
                                if (X6 > r) {
                                    if (r = X6, e = H6, X6 > J6) break;
                                    var z6 = Math.min(H6, X6 - 2),
                                        N6 = 0;
                                    for (var U = 0; U < z6; ++U) {
                                        var $6 = R - H6 + U & 32767,
                                            n = P[$6],
                                            o = $6 - n & 32767;
                                        if (o > N6) N6 = o, p = $6
                                    }
                                }
                            }
                            b = p, p = P[b], H6 += b - p & 32767
                        }
                    }
                    if (e) {
                        v[u++] = 268435456 | m91[r] << 18 | o38[e];
                        var a = m91[r] & 31,
                            i = o38[e] & 31;
                        h += dJ6[a] + cJ6[i], ++N[257 + a], ++V[i], I = R + r, ++L
                    } else v[u++] = A[R], ++N[A[R]]
                }
            }
            for (R = Math.max(R, I); R < w; ++R) v[u++] = A[R], ++N[A[R]];
            if (j = s38(A, $, H, v, N, V, h, u, g, R - g, j), !H) _.r = j & 7 | $[j / 8 | 0] << 3, j -= 7, _.h = W, _.p = P, _.i = R, _.w = I
        } else {
            for (var R = _.w || 0; R < w + H; R += 65535) {
                var l = R + 65535;
                if (l >= w) $[j / 8 | 0] = H, l = w;
                j = _98($, j + 1, A.subarray(R, l))
            }
            _.i = w
        }
        return _L(O, 0, Y + lJ6(j) + z)
    }
// @from(Ln 108266, Col 4)
oz7
// @from(Ln 108266, Col 9)
iJ6 = function() {
        var A = -1;
        return {
            p: function(q) {
                var K = A;
                for (var Y = 0; Y < q.length; ++Y) K = oz7[K & 255 ^ q[Y]] ^ K >>> 8;
                A = K
            },
            d: function() {
                return ~A
            }
        }
    }
// @from(Ln 108279, Col 4)
d91 = function() {
        var A = 1,
            q = 0;
        return {
            p: function(K) {
                var Y = A,
                    z = q,
                    _ = K.length | 0;
                for (var w = 0; w != _;) {
                    var O = Math.min(w + 2655, _);
                    for (; w < O; ++w) z += Y += K[w];
                    Y = (Y & 65535) + 15 * (Y >> 16), z = (z & 65535) + 15 * (z >> 16)
                }
                A = Y, q = z
            },
            d: function() {
                return A %= 65521, q %= 65521, (A & 255) << 24 | (A & 65280) << 8 | (q & 255) << 8 | q >> 8
            }
        }
    }
// @from(Ln 108299, Col 4)
Aq6 = function(A, q, K, Y, z) {
        if (!z) {
            if (z = {
                    l: 1
                }, q.dictionary) {
                var _ = q.dictionary.subarray(-32768),
                    w = new Y3(_.length + A.length);
                w.set(_), w.set(A, _.length), A = w, z.w = _.length
            }
        }
        return rz7(A, q.level == null ? 6 : q.level, q.mem == null ? z.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(A.length))) * 1.5) : 20 : 12 + q.mem, K, Y, z)
    }
// @from(Ln 108311, Col 4)
jI6 = function(A, q) {
        var K = {};
        for (var Y in A) K[Y] = A[Y];
        for (var Y in q) K[Y] = q[Y];
        return K
    }
// @from(Ln 108317, Col 4)
mz7 = function(A, q, K) {
        var Y = A(),
            z = A.toString(),
            _ = z.slice(z.indexOf("[") + 1, z.lastIndexOf("]")).replace(/\s+/g, "").split(",");
        for (var w = 0; w < Y.length; ++w) {
            var O = Y[w],
                $ = _[w];
            if (typeof O == "function") {
                q += ";" + $ + "=";
                var H = O.toString();
                if (O.prototype)
                    if (H.indexOf("[native code]") != -1) {
                        var j = H.indexOf(" ", 8) + 1;
                        q += H.slice(j, H.indexOf("(", j))
                    } else {
                        q += H;
                        for (var J in O.prototype) q += ";" + $ + ".prototype." + J + "=" + O.prototype[J].toString()
                    }
                else q += H
            } else K[$] = O
        }
        return q
    }
// @from(Ln 108340, Col 4)
C91
// @from(Ln 108340, Col 9)
dH3 = function(A) {
        var q = [];
        for (var K in A)
            if (A[K].buffer) q.push((A[K] = new A[K].constructor(A[K])).buffer);
        return q
    }
// @from(Ln 108346, Col 4)
az7 = function(A, q, K, Y) {
        if (!C91[K]) {
            var z = "",
                _ = {},
                w = A.length - 1;
            for (var O = 0; O < w; ++O) z = mz7(A[O], z, _);
            C91[K] = {
                c: mz7(A[w], z, _),
                e: _
            }
        }
        var $ = jI6({}, C91[K].e);
        return QH3(C91[K].c + ";onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage=" + q.toString() + "}", K, $, dH3($), Y)
    }
// @from(Ln 108360, Col 4)
nJ6 = function() {
        return [Y3, SG, $I6, dJ6, cJ6, _I6, z98, Qz7, dz7, lz7, wI6, iz7, zL, b91, YL, x91, lJ6, _L, Tq, HI6, sJ6, Fo, w98]
    }
// @from(Ln 108363, Col 4)
rJ6 = function() {
        return [Y3, SG, $I6, dJ6, cJ6, _I6, m91, o38, Uz7, nQ, cz7, QJ6, wI6, nz7, mo, zL, du, FJ6, u91, B91, a38, pJ6, _98, s38, lJ6, _L, rz7, Aq6, JI6, Fo]
    }
// @from(Ln 108366, Col 4)
sz7 = function() {
        return [O98, H98, pz, iJ6, oz7]
    }
// @from(Ln 108369, Col 4)
tz7 = function() {
        return [$98, q_7]
    }
// @from(Ln 108372, Col 4)
ez7 = function() {
        return [j98, pz, d91]
    }
// @from(Ln 108375, Col 4)
A_7 = function() {
        return [J98]
    }
// @from(Ln 108378, Col 4)
Fo = function(A) {
        return postMessage(A, [A.buffer])
    }
// @from(Ln 108381, Col 4)
w98 = function(A) {
        return A && {
            out: A.size && new Y3(A.size),
            dictionary: A.dictionary
        }
    }
// @from(Ln 108387, Col 4)
oJ6 = function(A, q, K, Y, z, _) {
        var w = az7(K, Y, z, function(O, $) {
            w.terminate(), _(O, $)
        });
        return w.postMessage([A, q], q.consume ? [A.buffer] : []),
            function() {
                w.terminate()
            }
    }
// @from(Ln 108396, Col 4)
OL = function(A) {
        return A.ondata = function(q, K) {
                return postMessage([q, K], [q.buffer])
            },
            function(q) {
                if (q.data.length) A.push(q.data[0], q.data[1]), postMessage([q.data[0].length]);
                else A.flush()
            }
    }
// @from(Ln 108405, Col 4)
aJ6 = function(A, q, K, Y, z, _, w) {
        var O, $ = az7(A, Y, z, function(H, j) {
            if (H) $.terminate(), q.ondata.call(q, H);
            else if (!Array.isArray(j)) w(j);
            else if (j.length == 1) {
                if (q.queuedSize -= j[0], q.ondrain) q.ondrain(j[0])
            } else {
                if (j[1]) $.terminate();
                q.ondata.call(q, H, j[0], j[1])
            }
        });
        if ($.postMessage(K), q.queuedSize = 0, q.push = function(H, j) {
                if (!q.ondata) Tq(5);
                if (O) q.ondata(Tq(4, 0, 1), null, !!j);
                q.queuedSize += H.length, $.postMessage([H, O = j], [H.buffer])
            }, q.terminate = function() {
                $.terminate()
            }, _) q.flush = function() {
            $.postMessage([])
        }
    }
// @from(Ln 108426, Col 4)
hG = function(A, q) {
        return A[q] | A[q + 1] << 8
    }
// @from(Ln 108429, Col 4)
Ej = function(A, q) {
        return (A[q] | A[q + 1] << 8 | A[q + 2] << 16 | A[q + 3] << 24) >>> 0
    }
// @from(Ln 108432, Col 4)
r38 = function(A, q) {
        return Ej(A, q) + Ej(A, q + 4) * 4294967296
    }
// @from(Ln 108435, Col 4)
pz = function(A, q, K) {
        for (; K; ++q) A[q] = K, K >>>= 8
    }
// @from(Ln 108438, Col 4)
O98 = function(A, q) {
        var K = q.filename;
        if (A[0] = 31, A[1] = 139, A[2] = 8, A[8] = q.level < 2 ? 4 : q.level == 9 ? 2 : 0, A[9] = 3, q.mtime != 0) pz(A, 4, Math.floor(new Date(q.mtime || Date.now()) / 1000));
        if (K) {
            A[3] = 8;
            for (var Y = 0; Y <= K.length; ++Y) A[Y + 10] = K.charCodeAt(Y)
        }
    }
// @from(Ln 108446, Col 4)
$98 = function(A) {
        if (A[0] != 31 || A[1] != 139 || A[2] != 8) Tq(6, "invalid gzip data");
        var q = A[3],
            K = 10;
        if (q & 4) K += (A[10] | A[11] << 8) + 2;
        for (var Y = (q >> 3 & 1) + (q >> 4 & 1); Y > 0; Y -= !A[K++]);
        return K + (q & 2)
    }
// @from(Ln 108454, Col 4)
q_7 = function(A) {
        var q = A.length;
        return (A[q - 4] | A[q - 3] << 8 | A[q - 2] << 16 | A[q - 1] << 24) >>> 0
    }
// @from(Ln 108458, Col 4)
H98 = function(A) {
        return 10 + (A.filename ? A.filename.length + 1 : 0)
    }
// @from(Ln 108461, Col 4)
j98 = function(A, q) {
        var K = q.level,
            Y = K == 0 ? 0 : K < 6 ? 1 : K == 9 ? 3 : 2;
        if (A[0] = 120, A[1] = Y << 6 | (q.dictionary && 32), A[1] |= 31 - (A[0] << 8 | A[1]) % 31, q.dictionary) {
            var z = d91();
            z.p(q.dictionary), pz(A, 2, z.d())
        }
    }
// @from(Ln 108469, Col 4)
J98 = function(A, q) {
        if ((A[0] & 15) != 8 || A[0] >> 4 > 7 || (A[0] << 8 | A[1]) % 31) Tq(6, "invalid zlib data");
        if ((A[1] >> 5 & 1) == +!q) Tq(6, "invalid zlib data: " + (A[1] & 32 ? "need" : "unexpected") + " dictionary");
        return (A[1] >> 3 & 4) + 2
    }
// @from(Ln 108474, Col 4)
wL
// @from(Ln 108474, Col 8)
K_7
// @from(Ln 108474, Col 13)
aT
// @from(Ln 108474, Col 17)
M98
// @from(Ln 108474, Col 22)
t38
// @from(Ln 108474, Col 27)
cH3
// @from(Ln 108474, Col 32)
g91
// @from(Ln 108474, Col 37)
z_7
// @from(Ln 108474, Col 42)
A98
// @from(Ln 108474, Col 47)
iH3
// @from(Ln 108474, Col 52)
p91
// @from(Ln 108474, Col 57)
w_7
// @from(Ln 108474, Col 62)
K98
// @from(Ln 108474, Col 67)
rH3
// @from(Ln 108474, Col 72)
X98 = function(A, q, K, Y) {
        for (var z in A) {
            var _ = A[z],
                w = q + z,
                O = Y;
            if (Array.isArray(_)) O = jI6(Y, _[1]), _ = _[0];
            if (_ instanceof Y3) K[w] = [_, O];
            else K[w += "/"] = [new Y3(0), O], X98(_, w, K, Y)
        }
    }
// @from(Ln 108484, Col 4)
Bz7
// @from(Ln 108484, Col 9)
Y98
// @from(Ln 108484, Col 14)
$_7 = 0
// @from(Ln 108485, Col 4)
H_7 = function(A) {
        for (var q = "", K = 0;;) {
            var Y = A[K++],
                z = (Y > 127) + (Y > 223) + (Y > 239);
            if (K + z > A.length) return {
                s: q,
                r: _L(A, K - 1)
            };
            if (!z) q += String.fromCharCode(Y);
            else if (z == 3) Y = ((Y & 15) << 18 | (A[K++] & 63) << 12 | (A[K++] & 63) << 6 | A[K++] & 63) - 65536, q += String.fromCharCode(55296 | Y >> 10, 56320 | Y & 1023);
            else if (z & 1) q += String.fromCharCode((Y & 31) << 6 | A[K++] & 63);
            else q += String.fromCharCode((Y & 15) << 12 | (A[K++] & 63) << 6 | A[K++] & 63)
        }
    }
// @from(Ln 108499, Col 4)
sH3
// @from(Ln 108499, Col 9)
tH3
// @from(Ln 108499, Col 14)
j_7 = function(A) {
        return A == 1 ? 3 : A < 6 ? 2 : A == 9 ? 1 : 0
    }
// @from(Ln 108502, Col 4)
J_7 = function(A, q) {
        return q + 30 + hG(A, q + 26) + hG(A, q + 28)
    }
// @from(Ln 108505, Col 4)
M_7 = function(A, q, K) {
        var Y = hG(A, q + 28),
            z = P98(A.subarray(q + 46, q + 46 + Y), !(hG(A, q + 8) & 2048)),
            _ = q + 46 + Y,
            w = Ej(A, q + 20),
            O = K && w == 4294967295 ? D_7(A, _) : [w, Ej(A, q + 24), Ej(A, q + 42)],
            $ = O[0],
            H = O[1],
            j = O[2];
        return [hG(A, q + 10), $, H, z, _ + hG(A, q + 30) + hG(A, q + 32), j]
    }
// @from(Ln 108516, Col 4)
D_7 = function(A, q) {
        for (; hG(A, q) != 1; q += 4 + hG(A, q + 2));
        return [r38(A, q + 12), r38(A, q + 4), r38(A, q + 20)]
    }
// @from(Ln 108520, Col 4)
Bo = function(A) {
        var q = 0;
        if (A)
            for (var K in A) {
                var Y = A[K].length;
                if (Y > 65535) Tq(9);
                q += Y + 4
            }
        return q
    }
// @from(Ln 108530, Col 4)
UJ6 = function(A, q, K, Y, z, _, w, O) {
        var $ = Y.length,
            H = K.extra,
            j = O && O.length,
            J = Bo(H);
        if (pz(A, q, w != null ? 33639248 : 67324752), q += 4, w != null) A[q++] = 20, A[q++] = K.os;
        A[q] = 20, q += 2, A[q++] = K.flag << 1 | (_ < 0 && 8), A[q++] = z && 8, A[q++] = K.compression & 255, A[q++] = K.compression >> 8;
        var M = new Date(K.mtime == null ? Date.now() : K.mtime),
            D = M.getFullYear() - 1980;
        if (D < 0 || D > 119) Tq(10);
        if (pz(A, q, D << 25 | M.getMonth() + 1 << 21 | M.getDate() << 16 | M.getHours() << 11 | M.getMinutes() << 5 | M.getSeconds() >> 1), q += 4, _ != -1) pz(A, q, K.crc), pz(A, q + 4, _ < 0 ? -_ - 2 : _), pz(A, q + 8, K.size);
        if (pz(A, q + 12, $), pz(A, q + 14, J), q += 16, w != null) pz(A, q, j), pz(A, q + 6, K.attrs), pz(A, q + 10, w), q += 14;
        if (A.set(Y, q), q += $, J)
            for (var X in H) {
                var P = H[X],
                    W = P.length;
                pz(A, q, +X), pz(A, q + 2, W), A.set(P, q + 4), q += 4 + W
            }
        if (j) A.set(O, q), q += j;
        return q
    }
// @from(Ln 108551, Col 4)
W98 = function(A, q, K, Y, z) {
        pz(A, q, 101010256), pz(A, q + 8, K), pz(A, q + 10, K), pz(A, q + 12, Y), pz(A, q + 16, z)
    }
// @from(Ln 108554, Col 4)
OI6
// @from(Ln 108554, Col 9)
eH3
// @from(Ln 108554, Col 14)
Aj3
// @from(Ln 108554, Col 19)
qj3
// @from(Ln 108554, Col 24)
X_7
// @from(Ln 108554, Col 29)
Yj3
// @from(Ln 108554, Col 34)
zj3
// @from(Ln 108554, Col 39)
_j3
// @from(Ln 108554, Col 44)
U91
// @from(Ln 108555, Col 4)
MI6 = E(() => {
    FH3 = gH3("/");
    try {
        I91 = FH3("worker_threads").Worker
    } catch (A) {}
    QH3 = I91 ? function(A, q, K, Y, z) {
        var _ = !1,
            w = new I91(A + pH3, {
                eval: !0
            }).on("error", function(O) {
                return z(O, null)
            }).on("message", function(O) {
                return z(null, O)
            }).on("exit", function(O) {
                if (O && !_) z(Error("exited with code " + O), null)
            });
        return w.postMessage(K, Y), w.terminate = function() {
            return _ = !0, I91.prototype.terminate.call(w)
        }, w
    } : function(A, q, K, Y, z) {
        setImmediate(function() {
            return z(Error("async operations unsupported - update to Node 12+ (or Node 10-11 with the --experimental-worker CLI flag)"), null)
        });
        var _ = function() {};
        return {
            terminate: _,
            postMessage: _
        }
    }, Y3 = Uint8Array, SG = Uint16Array, $I6 = Int32Array, dJ6 = new Y3([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0]), cJ6 = new Y3([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0]), _I6 = new Y3([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), Fz7 = gz7(dJ6, 2), z98 = Fz7.b, m91 = Fz7.r;
    z98[28] = 258, m91[258] = 28;
    pz7 = gz7(cJ6, 0), Qz7 = pz7.b, o38 = pz7.r, wI6 = new SG(32768);
    for (G9 = 0; G9 < 32768; ++G9) Uu = (G9 & 43690) >> 1 | (G9 & 21845) << 1, Uu = (Uu & 52428) >> 2 | (Uu & 13107) << 2, Uu = (Uu & 61680) >> 4 | (Uu & 3855) << 4, wI6[G9] = ((Uu & 65280) >> 8 | (Uu & 255) << 8) >> 1;
    nQ = new Y3(288);
    for (G9 = 0; G9 < 144; ++G9) nQ[G9] = 8;
    for (G9 = 144; G9 < 256; ++G9) nQ[G9] = 9;
    for (G9 = 256; G9 < 280; ++G9) nQ[G9] = 7;
    for (G9 = 280; G9 < 288; ++G9) nQ[G9] = 8;
    QJ6 = new Y3(32);
    for (G9 = 0; G9 < 32; ++G9) QJ6[G9] = 5;
    Uz7 = zL(nQ, 9, 0), dz7 = zL(nQ, 9, 1), cz7 = zL(QJ6, 5, 0), lz7 = zL(QJ6, 5, 1), UH3 = {
        UnexpectedEOF: 0,
        InvalidBlockType: 1,
        InvalidLengthLiteral: 2,
        InvalidDistance: 3,
        StreamFinished: 4,
        NoStreamHandler: 5,
        InvalidHeader: 6,
        NoCallback: 7,
        InvalidUTF8: 8,
        ExtraFieldTooLong: 9,
        InvalidDate: 10,
        FilenameTooLong: 11,
        StreamFinishing: 12,
        InvalidZipData: 13,
        UnknownCompressionMethod: 14
    }, iz7 = ["unexpected EOF", "invalid block type", "invalid length/literal", "invalid distance", "stream finished", "no stream handler", , "no callback", "invalid UTF-8 data", "extra field too long", "date not in range 1980-2099", "filename too long", "stream finishing", "invalid zip data"], nz7 = new $I6([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]), mo = new Y3(0), oz7 = function() {
        var A = new Int32Array(256);
        for (var q = 0; q < 256; ++q) {
            var K = q,
                Y = 9;
            while (--Y) K = (K & 1 && -306674912) ^ K >>> 1;
            A[q] = K
        }
        return A
    }(), C91 = [];
    wL = function() {
        function A(q, K) {
            if (typeof q == "function") K = q, q = {};
            if (this.ondata = K, this.o = q || {}, this.s = {
                    l: 0,
                    i: 32768,
                    w: 32768,
                    z: 32768
                }, this.b = new Y3(98304), this.o.dictionary) {
                var Y = this.o.dictionary.subarray(-32768);
                this.b.set(Y, 32768 - Y.length), this.s.i = 32768 - Y.length
            }
        }
        return A.prototype.p = function(q, K) {
            this.ondata(Aq6(q, this.o, 0, 0, this.s), K)
        }, A.prototype.push = function(q, K) {
            if (!this.ondata) Tq(5);
            if (this.s.l) Tq(4);
            var Y = q.length + this.s.z;
            if (Y > this.b.length) {
                if (Y > 2 * this.b.length - 32768) {
                    var z = new Y3(Y & -32768);
                    z.set(this.b.subarray(0, this.s.z)), this.b = z
                }
                var _ = this.b.length - this.s.z;
                this.b.set(q.subarray(0, _), this.s.z), this.s.z = this.b.length, this.p(this.b, !1), this.b.set(this.b.subarray(-32768)), this.b.set(q.subarray(_), 32768), this.s.z = q.length - _ + 32768, this.s.i = 32766, this.s.w = 32768
            } else this.b.set(q, this.s.z), this.s.z += q.length;
            if (this.s.l = K & 1, this.s.z > this.s.w + 8191 || K) this.p(this.b, K || !1), this.s.w = this.s.i, this.s.i -= 2
        }, A.prototype.flush = function() {
            if (!this.ondata) Tq(5);
            if (this.s.l) Tq(4);
            this.p(this.b, !1), this.s.w = this.s.i, this.s.i -= 2
        }, A
    }(), K_7 = function() {
        function A(q, K) {
            aJ6([rJ6, function() {
                return [OL, wL]
            }], this, qq6.call(this, q, K), function(Y) {
                var z = new wL(Y.data);
                onmessage = OL(z)
            }, 6, 1)
        }
        return A
    }();
    aT = function() {
        function A(q, K) {
            if (typeof q == "function") K = q, q = {};
            this.ondata = K;
            var Y = q && q.dictionary && q.dictionary.subarray(-32768);
            if (this.s = {
                    i: 0,
                    b: Y ? Y.length : 0
                }, this.o = new Y3(32768), this.p = new Y3(0), Y) this.o.set(Y)
        }
        return A.prototype.e = function(q) {
            if (!this.ondata) Tq(5);
            if (this.d) Tq(4);
            if (!this.p.length) this.p = q;
            else if (q.length) {
                var K = new Y3(this.p.length + q.length);
                K.set(this.p), K.set(q, this.p.length), this.p = K
            }
        }, A.prototype.c = function(q) {
            this.s.i = +(this.d = q || !1);
            var K = this.s.b,
                Y = HI6(this.p, this.s, this.o);
            this.ondata(_L(Y, K, this.s.b), this.d), this.o = _L(Y, this.s.b - 32768), this.s.b = this.o.length, this.p = _L(this.p, this.s.p / 8 | 0), this.s.p &= 7
        }, A.prototype.push = function(q, K) {
            this.e(q), this.c(K)
        }, A
    }(), M98 = function() {
        function A(q, K) {
            aJ6([nJ6, function() {
                return [OL, aT]
            }], this, qq6.call(this, q, K), function(Y) {
                var z = new aT(Y.data);
                onmessage = OL(z)
            }, 7, 0)
        }
        return A
    }();
    t38 = function() {
        function A(q, K) {
            this.c = iJ6(), this.l = 0, this.v = 1, wL.call(this, q, K)
        }
        return A.prototype.push = function(q, K) {
            this.c.p(q), this.l += q.length, wL.prototype.push.call(this, q, K)
        }, A.prototype.p = function(q, K) {
            var Y = Aq6(q, this.o, this.v && H98(this.o), K && 8, this.s);
            if (this.v) O98(Y, this.o), this.v = 0;
            if (K) pz(Y, Y.length - 8, this.c.d()), pz(Y, Y.length - 4, this.l);
            this.ondata(Y, K)
        }, A.prototype.flush = function() {
            wL.prototype.flush.call(this)
        }, A
    }(), cH3 = function() {
        function A(q, K) {
            aJ6([rJ6, sz7, function() {
                return [OL, wL, t38]
            }], this, qq6.call(this, q, K), function(Y) {
                var z = new t38(Y.data);
                onmessage = OL(z)
            }, 8, 1)
        }
        return A
    }();
    g91 = function() {
        function A(q, K) {
            this.v = 1, this.r = 0, aT.call(this, q, K)
        }
        return A.prototype.push = function(q, K) {
            if (aT.prototype.e.call(this, q), this.r += q.length, this.v) {
                var Y = this.p.subarray(this.v - 1),
                    z = Y.length > 3 ? $98(Y) : 4;
                if (z > Y.length) {
                    if (!K) return
                } else if (this.v > 1 && this.onmember) this.onmember(this.r - Y.length);
                this.p = Y.subarray(z), this.v = 0
            }
            if (aT.prototype.c.call(this, K), this.s.f && !this.s.l && !K) this.v = lJ6(this.s.p) + 9, this.s = {
                i: 0
            }, this.o = new Y3(0), this.push(new Y3(0), K)
        }, A
    }(), z_7 = function() {
        function A(q, K) {
            var Y = this;
            aJ6([nJ6, tz7, function() {
                return [OL, aT, g91]
            }], this, qq6.call(this, q, K), function(z) {
                var _ = new g91(z.data);
                _.onmember = function(w) {
                    return postMessage(w)
                }, onmessage = OL(_)
            }, 9, 0, function(z) {
                return Y.onmember && Y.onmember(z)
            })
        }
        return A
    }();
    A98 = function() {
        function A(q, K) {
            this.c = d91(), this.v = 1, wL.call(this, q, K)
        }
        return A.prototype.push = function(q, K) {
            this.c.p(q), wL.prototype.push.call(this, q, K)
        }, A.prototype.p = function(q, K) {
            var Y = Aq6(q, this.o, this.v && (this.o.dictionary ? 6 : 2), K && 4, this.s);
            if (this.v) j98(Y, this.o), this.v = 0;
            if (K) pz(Y, Y.length - 4, this.c.d());
            this.ondata(Y, K)
        }, A.prototype.flush = function() {
            wL.prototype.flush.call(this)
        }, A
    }(), iH3 = function() {
        function A(q, K) {
            aJ6([rJ6, ez7, function() {
                return [OL, wL, A98]
            }], this, qq6.call(this, q, K), function(Y) {
                var z = new A98(Y.data);
                onmessage = OL(z)
            }, 10, 1)
        }
        return A
    }();
    p91 = function() {
        function A(q, K) {
            aT.call(this, q, K), this.v = q && q.dictionary ? 2 : 1
        }
        return A.prototype.push = function(q, K) {
            if (aT.prototype.e.call(this, q), this.v) {
                if (this.p.length < 6 && !K) return;
                this.p = this.p.subarray(J98(this.p, this.v - 1)), this.v = 0
            }
            if (K) {
                if (this.p.length < 4) Tq(6, "invalid zlib data");
                this.p = this.p.subarray(0, -4)
            }
            aT.prototype.c.call(this, K)
        }, A
    }(), w_7 = function() {
        function A(q, K) {
            aJ6([nJ6, A_7, function() {
                return [OL, aT, p91]
            }], this, qq6.call(this, q, K), function(Y) {
                var z = new p91(Y.data);
                onmessage = OL(z)
            }, 11, 0)
        }
        return A
    }();
    K98 = function() {
        function A(q, K) {
            this.o = qq6.call(this, q, K) || {}, this.G = g91, this.I = aT, this.Z = p91
        }
        return A.prototype.i = function() {
            var q = this;
            this.s.ondata = function(K, Y) {
                q.ondata(K, Y)
            }
        }, A.prototype.push = function(q, K) {
            if (!this.ondata) Tq(5);
            if (!this.s) {
                if (this.p && this.p.length) {
                    var Y = new Y3(this.p.length + q.length);
                    Y.set(this.p), Y.set(q, this.p.length)
                } else this.p = q;
                if (this.p.length > 2) this.s = this.p[0] == 31 && this.p[1] == 139 && this.p[2] == 8 ? new this.G(this.o) : (this.p[0] & 15) != 8 || this.p[0] >> 4 > 7 || (this.p[0] << 8 | this.p[1]) % 31 ? new this.I(this.o) : new this.Z(this.o), this.i(), this.s.push(this.p, K), this.p = null
            } else this.s.push(q, K)
        }, A
    }(), rH3 = function() {
        function A(q, K) {
            K98.call(this, q, K), this.queuedSize = 0, this.G = z_7, this.I = M98, this.Z = w_7
        }
        return A.prototype.i = function() {
            var q = this;
            this.s.ondata = function(K, Y, z) {
                q.ondata(K, Y, z)
            }, this.s.ondrain = function(K) {
                if (q.queuedSize -= K, q.ondrain) q.ondrain(K)
            }
        }, A.prototype.push = function(q, K) {
            this.queuedSize += q.length, K98.prototype.push.call(this, q, K)
        }, A
    }();
    Bz7 = typeof TextEncoder < "u" && new TextEncoder, Y98 = typeof TextDecoder < "u" && new TextDecoder;
    try {
        Y98.decode(mo, {
            stream: !0
        }), $_7 = 1
    } catch (A) {}
    sH3 = function() {
        function A(q) {
            if (this.ondata = q, $_7) this.t = new TextDecoder;
            else this.p = mo
        }
        return A.prototype.push = function(q, K) {
            if (!this.ondata) Tq(5);
            if (K = !!K, this.t) {
                if (this.ondata(this.t.decode(q, {
                        stream: !0
                    }), K), K) {
                    if (this.t.decode().length) Tq(8);
                    this.t = null
                }
                return
            }
            if (!this.p) Tq(4);
            var Y = new Y3(this.p.length + q.length);
            Y.set(this.p), Y.set(q, this.p.length);
            var z = H_7(Y),
                _ = z.s,
                w = z.r;
            if (K) {
                if (w.length) Tq(8);
                this.p = null
            } else this.p = w;
            this.ondata(_, K)
        }, A
    }(), tH3 = function() {
        function A(q) {
            this.ondata = q
        }
        return A.prototype.push = function(q, K) {
            if (!this.ondata) Tq(5);
            if (this.d) Tq(4);
            this.ondata(go(q), this.d = K || !1)
        }, A
    }();
    OI6 = function() {
        function A(q) {
            this.filename = q, this.c = iJ6(), this.size = 0, this.compression = 0
        }
        return A.prototype.process = function(q, K) {
            this.ondata(null, q, K)
        }, A.prototype.push = function(q, K) {
            if (!this.ondata) Tq(5);
            if (this.c.p(q), this.size += q.length, K) this.crc = this.c.d();
            this.process(q, K || !1)
        }, A
    }(), eH3 = function() {
        function A(q, K) {
            var Y = this;
            if (!K) K = {};
            OI6.call(this, q), this.d = new wL(K, function(z, _) {
                Y.ondata(null, z, _)
            }), this.compression = 8, this.flag = j_7(K.level)
        }
        return A.prototype.process = function(q, K) {
            try {
                this.d.push(q, K)
            } catch (Y) {
                this.ondata(Y, null, K)
            }
        }, A.prototype.push = function(q, K) {
            OI6.prototype.push.call(this, q, K)
        }, A
    }(), Aj3 = function() {
        function A(q, K) {
            var Y = this;
            if (!K) K = {};
            OI6.call(this, q), this.d = new K_7(K, function(z, _, w) {
                Y.ondata(z, _, w)
            }), this.compression = 8, this.flag = j_7(K.level), this.terminate = this.d.terminate
        }
        return A.prototype.process = function(q, K) {
            this.d.push(q, K)
        }, A.prototype.push = function(q, K) {
            OI6.prototype.push.call(this, q, K)
        }, A
    }(), qj3 = function() {
        function A(q) {
            this.ondata = q, this.u = [], this.d = 1
        }
        return A.prototype.add = function(q) {
            var K = this;
            if (!this.ondata) Tq(5);
            if (this.d & 2) this.ondata(Tq(4 + (this.d & 1) * 8, 0, 1), null, !1);
            else {
                var Y = go(q.filename),
                    z = Y.length,
                    _ = q.comment,
                    w = _ && go(_),
                    O = z != q.filename.length || w && _.length != w.length,
                    $ = z + Bo(q.extra) + 30;
                if (z > 65535) this.ondata(Tq(11, 0, 1), null, !1);
                var H = new Y3($);
                UJ6(H, 0, q, Y, O, -1);
                var j = [H],
                    J = function() {
                        for (var W = 0, Z = j; W < Z.length; W++) {
                            var G = Z[W];
                            K.ondata(null, G, !1)
                        }
                        j = []
                    },
                    M = this.d;
                this.d = 0;
                var D = this.u.length,
                    X = jI6(q, {
                        f: Y,
                        u: O,
                        o: w,
                        t: function() {
                            if (q.terminate) q.terminate()
                        },
                        r: function() {
                            if (J(), M) {
                                var W = K.u[D + 1];
                                if (W) W.r();
                                else K.d = 1
                            }
                            M = 1
                        }
                    }),
                    P = 0;
                q.ondata = function(W, Z, G) {
                    if (W) K.ondata(W, Z, G), K.terminate();
                    else if (P += Z.length, j.push(Z), G) {
                        var f = new Y3(16);
                        if (pz(f, 0, 134695760), pz(f, 4, q.crc), pz(f, 8, P), pz(f, 12, q.size), j.push(f), X.c = P, X.b = $ + P + 16, X.crc = q.crc, X.size = q.size, M) X.r();
                        M = 1
                    } else if (M) J()
                }, this.u.push(X)
            }
        }, A.prototype.end = function() {
            var q = this;
            if (this.d & 2) {
                this.ondata(Tq(4 + (this.d & 1) * 8, 0, 1), null, !0);
                return
            }
            if (this.d) this.e();
            else this.u.push({
                r: function() {
                    if (!(q.d & 1)) return;
                    q.u.splice(-1, 1), q.e()
                },
                t: function() {}
            });
            this.d = 3
        }, A.prototype.e = function() {
            var q = 0,
                K = 0,
                Y = 0;
            for (var z = 0, _ = this.u; z < _.length; z++) {
                var w = _[z];
                Y += 46 + w.f.length + Bo(w.extra) + (w.o ? w.o.length : 0)
            }
            var O = new Y3(Y + 22);
            for (var $ = 0, H = this.u; $ < H.length; $++) {
                var w = H[$];
                UJ6(O, q, w, w.f, w.u, -w.c - 2, K, w.o), q += 46 + w.f.length + Bo(w.extra) + (w.o ? w.o.length : 0), K += w.b
            }
            W98(O, q, this.u.length, Y, K), this.ondata(null, O, !0), this.d = 2
        }, A.prototype.terminate = function() {
            for (var q = 0, K = this.u; q < K.length; q++) {
                var Y = K[q];
                Y.t()
            }
            this.d = 2
        }, A
    }();
    X_7 = function() {
        function A() {}
        return A.prototype.push = function(q, K) {
            this.ondata(null, q, K)
        }, A.compression = 0, A
    }(), Yj3 = function() {
        function A() {
            var q = this;
            this.i = new aT(function(K, Y) {
                q.ondata(null, K, Y)
            })
        }
        return A.prototype.push = function(q, K) {
            try {
                this.i.push(q, K)
            } catch (Y) {
                this.ondata(Y, null, K)
            }
        }, A.compression = 8, A
    }(), zj3 = function() {
        function A(q, K) {
            var Y = this;
            if (K < 320000) this.i = new aT(function(z, _) {
                Y.ondata(null, z, _)
            });
            else this.i = new M98(function(z, _, w) {
                Y.ondata(z, _, w)
            }), this.terminate = this.i.terminate
        }
        return A.prototype.push = function(q, K) {
            if (this.i.terminate) q = _L(q, 0);
            this.i.push(q, K)
        }, A.compression = 8, A
    }(), _j3 = function() {
        function A(q) {
            this.onfile = q, this.k = [], this.o = {
                0: X_7
            }, this.p = mo
        }
        return A.prototype.push = function(q, K) {
            var Y = this;
            if (!this.onfile) Tq(5);
            if (!this.p) Tq(4);
            if (this.c > 0) {
                var z = Math.min(this.c, q.length),
                    _ = q.subarray(0, z);
                if (this.c -= z, this.d) this.d.push(_, !this.c);
                else this.k[0].push(_);
                if (q = q.subarray(z), q.length) return this.push(q, K)
            } else {
                var w = 0,
                    O = 0,
                    $ = void 0,
                    H = void 0;
                if (!this.p.length) H = q;
                else if (!q.length) H = this.p;
                else H = new Y3(this.p.length + q.length), H.set(this.p), H.set(q, this.p.length);
                var j = H.length,
                    J = this.c,
                    M = J && this.d,
                    D = function() {
                        var Z, G = Ej(H, O);
                        if (G == 67324752) {
                            w = 1, $ = O, X.d = null, X.c = 0;
                            var f = hG(H, O + 6),
                                v = hG(H, O + 8),
                                N = f & 2048,
                                V = f & 8,
                                L = hG(H, O + 26),
                                h = hG(H, O + 28);
                            if (j > O + 30 + L + h) {
                                var R = [];
                                X.k.unshift(R), w = 2;
                                var u = Ej(H, O + 18),
                                    I = Ej(H, O + 22),
                                    g = P98(H.subarray(O + 30, O += 30 + L), !N);
                                if (u == 4294967295) Z = V ? [-2] : D_7(H, O), u = Z[0], I = Z[1];
                                else if (V) u = -1;
                                O += h, X.c = u;
                                var B, b = {
                                    name: g,
                                    compression: v,
                                    start: function() {
                                        if (!b.ondata) Tq(5);
                                        if (!u) b.ondata(null, mo, !0);
                                        else {
                                            var p = Y.o[v];
                                            if (!p) b.ondata(Tq(14, "unknown compression type " + v, 1), null, !1);
                                            B = u < 0 ? new p(g) : new p(g, u, I), B.ondata = function(e, Y6, H6) {
                                                b.ondata(e, Y6, H6)
                                            };
                                            for (var Q = 0, U = R; Q < U.length; Q++) {
                                                var r = U[Q];
                                                B.push(r, !1)
                                            }
                                            if (Y.k[0] == R && Y.c) Y.d = B;
                                            else B.push(mo, !0)
                                        }
                                    },
                                    terminate: function() {
                                        if (B && B.terminate) B.terminate()
                                    }
                                };
                                if (u >= 0) b.size = u, b.originalSize = I;
                                X.onfile(b)
                            }
                            return "break"
                        } else if (J) {
                            if (G == 134695760) return $ = O += 12 + (J == -2 && 8), w = 3, X.c = 0, "break";
                            else if (G == 33639248) return $ = O -= 4, w = 3, X.c = 0, "break"
                        }
                    },
                    X = this;
                for (; O < j - 4; ++O) {
                    var P = D();
                    if (P === "break") break
                }
                if (this.p = mo, J < 0) {
                    var W = w ? H.subarray(0, $ - 12 - (J == -2 && 8) - (Ej(H, $ - 16) == 134695760 && 4)) : H.subarray(0, O);
                    if (M) M.push(W, !!w);
                    else this.k[+(w == 2)].push(W)
                }
                if (w & 2) return this.push(H.subarray(O), K);
                this.p = H.subarray(O)
            }
            if (K) {
                if (this.c) Tq(13);
                this.p = null
            }
        }, A.prototype.register = function(q) {
            this.o[q.compression] = q
        }, A
    }(), U91 = typeof queueMicrotask == "function" ? queueMicrotask : typeof setTimeout == "function" ? setTimeout : function(A) {
        A()
    }
})
// @from(Ln 109157, Col 4)
Kq6 = x((nf_, i91) => {
    function Z_7(A) {
        return Array.isArray(A) ? A : [A]
    }
    var Oj3 = void 0,
        v98 = "",
        P_7 = " ",
        T98 = "\\",
        $j3 = /^\s+$/,
        Hj3 = /(?:[^\\]|^)\\$/,
        jj3 = /^\\!/,
        Jj3 = /^\\#/,
        Mj3 = /\r?\n/g,
        Dj3 = /^\.{0,2}\/|^\.{1,2}$/,
        Xj3 = /\/$/,
        tJ6 = "/",
        G_7 = "node-ignore";
    if (typeof Symbol < "u") G_7 = Symbol.for("node-ignore");
    var f_7 = G_7,
        eJ6 = (A, q, K) => {
            return Object.defineProperty(A, q, {
                value: K
            }), K
        },
        Pj3 = /([0-z])-([0-z])/g,
        T_7 = () => !1,
        Wj3 = (A) => A.replace(Pj3, (q, K, Y) => K.charCodeAt(0) <= Y.charCodeAt(0) ? q : v98),
        Zj3 = (A) => {
            let {
                length: q
            } = A;
            return A.slice(0, q - q % 2)
        },
        Gj3 = [
            [/^\uFEFF/, () => v98],
            [/((?:\\\\)*?)(\\?\s+)$/, (A, q, K) => q + (K.indexOf("\\") === 0 ? P_7 : v98)],
            [/(\\+?)\s/g, (A, q) => {
                let {
                    length: K
                } = q;
                return q.slice(0, K - K % 2) + P_7
            }],
            [/[\\$.|*+(){^]/g, (A) => `\\${A}`],
            [/(?!\\)\?/g, () => "[^/]"],
            [/^\//, () => "^"],
            [/\//g, () => "\\/"],
            [/^\^*\\\*\\\*\\\//, () => "^(?:.*\\/)?"],
            [/^(?=[^^])/, function() {
                return !/\/(?!$)/.test(this) ? "(?:^|\\/)" : "^"
            }],
            [/\\\/\\\*\\\*(?=\\\/|$)/g, (A, q, K) => q + 6 < K.length ? "(?:\\/[^\\/]+)*" : "\\/.+"],
            [/(^|[^\\]+)(\\\*)+(?=.+)/g, (A, q, K) => {
                let Y = K.replace(/\\\*/g, "[^\\/]*");
                return q + Y
            }],
            [/\\\\\\(?=[$.|*+(){^])/g, () => T98],
            [/\\\\/g, () => T98],
            [/(\\)?\[([^\]/]*?)(\\*)($|\])/g, (A, q, K, Y, z) => q === T98 ? `\\[${K}${Zj3(Y)}${z}` : z === "]" ? Y.length % 2 === 0 ? `[${Wj3(K)}${Y}]` : "[]" : "[]"],
            [/(?:[^*])$/, (A) => /\/$/.test(A) ? `${A}$` : `${A}(?=$|\\/$)`]
        ],
        fj3 = /(^|\\\/)?\\\*$/,
        DI6 = "regex",
        c91 = "checkRegex",
        W_7 = "_",
        Tj3 = {
            [DI6](A, q) {
                return `${q?`${q}[^/]+`:"[^/]*"}(?=$|\\/$)`
            },
            [c91](A, q) {
                return `${q?`${q}[^/]*`:"[^/]*"}(?=$|\\/$)`
            }
        },
        vj3 = (A) => Gj3.reduce((q, [K, Y]) => q.replace(K, Y.bind(A)), A),
        l91 = (A) => typeof A === "string",
        Nj3 = (A) => A && l91(A) && !$j3.test(A) && !Hj3.test(A) && A.indexOf("#") !== 0,
        Vj3 = (A) => A.split(Mj3).filter(Boolean);
    class v_7 {
        constructor(A, q, K, Y, z, _) {
            this.pattern = A, this.mark = q, this.negative = z, eJ6(this, "body", K), eJ6(this, "ignoreCase", Y), eJ6(this, "regexPrefix", _)
        }
        get regex() {
            let A = W_7 + DI6;
            if (this[A]) return this[A];
            return this._make(DI6, A)
        }
        get checkRegex() {
            let A = W_7 + c91;
            if (this[A]) return this[A];
            return this._make(c91, A)
        }
        _make(A, q) {
            let K = this.regexPrefix.replace(fj3, Tj3[A]),
                Y = this.ignoreCase ? new RegExp(K, "i") : new RegExp(K);
            return eJ6(this, q, Y)
        }
    }
    var kj3 = ({
        pattern: A,
        mark: q
    }, K) => {
        let Y = !1,
            z = A;
        if (z.indexOf("!") === 0) Y = !0, z = z.substr(1);
        z = z.replace(jj3, "!").replace(Jj3, "#");
        let _ = vj3(z);
        return new v_7(A, q, z, K, Y, _)
    };
    class N_7 {
        constructor(A) {
            this._ignoreCase = A, this._rules = []
        }
        _add(A) {
            if (A && A[f_7]) {
                this._rules = this._rules.concat(A._rules._rules), this._added = !0;
                return
            }
            if (l91(A)) A = {
                pattern: A
            };
            if (Nj3(A.pattern)) {
                let q = kj3(A, this._ignoreCase);
                this._added = !0, this._rules.push(q)
            }
        }
        add(A) {
            return this._added = !1, Z_7(l91(A) ? Vj3(A) : A).forEach(this._add, this), this._added
        }
        test(A, q, K) {
            let Y = !1,
                z = !1,
                _;
            this._rules.forEach((O) => {
                let {
                    negative: $
                } = O;
                if (z === $ && Y !== z || $ && !Y && !z && !q) return;
                if (!O[K].test(A)) return;
                Y = !$, z = $, _ = $ ? Oj3 : O
            });
            let w = {
                ignored: Y,
                unignored: z
            };
            if (_) w.rule = _;
            return w
        }
    }
    var Ej3 = (A, q) => {
            throw new q(A)
        },
        rQ = (A, q, K) => {
            if (!l91(A)) return K(`path must be a string, but got \`${q}\``, TypeError);
            if (!A) return K("path must not be empty", TypeError);
            if (rQ.isNotRelative(A)) return K(`path should be a \`path.relative()\`d string, but got "${q}"`, RangeError);
            return !0
        },
        V_7 = (A) => Dj3.test(A);
    rQ.isNotRelative = V_7;
    rQ.convert = (A) => A;
    class k_7 {
        constructor({
            ignorecase: A = !0,
            ignoreCase: q = A,
            allowRelativePaths: K = !1
        } = {}) {
            eJ6(this, f_7, !0), this._rules = new N_7(q), this._strictPathCheck = !K, this._initCache()
        }
        _initCache() {
            this._ignoreCache = Object.create(null), this._testCache = Object.create(null)
        }
        add(A) {
            if (this._rules.add(A)) this._initCache();
            return this
        }
        addPattern(A) {
            return this.add(A)
        }
        _test(A, q, K, Y) {
            let z = A && rQ.convert(A);
            return rQ(z, A, this._strictPathCheck ? Ej3 : T_7), this._t(z, q, K, Y)
        }
        checkIgnore(A) {
            if (!Xj3.test(A)) return this.test(A);
            let q = A.split(tJ6).filter(Boolean);
            if (q.pop(), q.length) {
                let K = this._t(q.join(tJ6) + tJ6, this._testCache, !0, q);
                if (K.ignored) return K
            }
            return this._rules.test(A, !1, c91)
        }
        _t(A, q, K, Y) {
            if (A in q) return q[A];
            if (!Y) Y = A.split(tJ6).filter(Boolean);
            if (Y.pop(), !Y.length) return q[A] = this._rules.test(A, K, DI6);
            let z = this._t(Y.join(tJ6) + tJ6, q, K, Y);
            return q[A] = z.ignored ? z : this._rules.test(A, K, DI6)
        }
        ignores(A) {
            return this._test(A, this._ignoreCache, !1).ignored
        }
        createFilter() {
            return (A) => !this.ignores(A)
        }
        filter(A) {
            return Z_7(A).filter(this.createFilter())
        }
        test(A) {
            return this._test(A, this._testCache, !0)
        }
    }
    var N98 = (A) => new k_7(A),
        yj3 = (A) => rQ(A && rQ.convert(A), A, T_7),
        E_7 = () => {
            let A = (K) => /^\\\\\?\\/.test(K) || /["<>|\u0000-\u001F]+/u.test(K) ? K : K.replace(/\\/g, "/");
            rQ.convert = A;
            let q = /^[a-z]:\//i;
            rQ.isNotRelative = (K) => q.test(K) || V_7(K)
        };
    if (typeof process < "u" && process.platform === "win32") E_7();
    i91.exports = N98;
    N98.default = N98;
    i91.exports.isPathValid = yj3;
    eJ6(i91.exports, Symbol.for("setupWindows"), E_7)
})
// @from(Ln 109393, Col 0)
function E98(A) {
    let q = k98(A, ".mcpbignore");
    if (!Lj3(q)) return [];
    try {
        return V98(q, "utf-8").split(/\r?\n/).map((Y) => Y.trim()).filter((Y) => Y.length > 0 && !Y.startsWith("#"))
    } catch (K) {
        return console.warn(`Warning: Could not read .mcpbignore file: ${K instanceof Error?K.message:"Unknown error"}`), []
    }
}
// @from(Ln 109403, Col 0)
function y98(A) {
    return R_7.default().add(C_7).add(A)
}
// @from(Ln 109407, Col 0)
function Rj3(A, q = []) {
    return y98(q).ignores(A)
}
// @from(Ln 109411, Col 0)
function I_7(A, q = A, K = {}, Y = []) {
    let z = y_7(A),
        _ = y98(Y);
    for (let w of z) {
        let O = k98(A, w),
            $ = h_7(q, O);
        if (_.ignores($)) continue;
        if (L_7(O).isDirectory()) I_7(O, q, K, Y);
        else {
            let j = $.split(S_7).join("/");
            K[j] = V98(O)
        }
    }
    return K
}
// @from(Ln 109427, Col 0)
function n91(A, q = A, K = {}, Y = [], z = 0) {
    let _ = y_7(A),
        w = y98(Y);
    for (let O of _) {
        let $ = k98(A, O),
            H = h_7(q, $);
        if (w.ignores(H)) {
            z++;
            continue
        }
        let j = L_7($);
        if (j.isDirectory()) z = n91($, q, K, Y, z).ignoredCount;
        else {
            let J = H.split(S_7).join("/");
            K[J] = {
                data: V98($),
                mode: j.mode
            }
        }
    }
    return {
        files: K,
        ignoredCount: z
    }
}
// @from(Ln 109452, Col 4)
R_7
// @from(Ln 109452, Col 9)
C_7
// @from(Ln 109453, Col 4)
L98 = E(() => {
    R_7 = t(Kq6(), 1), C_7 = [".DS_Store", "Thumbs.db", ".gitignore", ".git", ".mcpbignore", "*.log", ".env*", ".npm", ".npmrc", ".yarnrc", ".yarn", ".eslintrc", ".editorconfig", ".prettierrc", ".prettierignore", ".eslintignore", ".nycrc", ".babelrc", ".pnp.*", "node_modules/.cache", "node_modules/.bin", "*.map", ".env.local", ".env.*.local", "npm-debug.log*", "yarn-debug.log*", "yarn-error.log*", "package-lock.json", "yarn.lock", "*.mcpb", "*.d.ts", "*.tsbuildinfo", "tsconfig.json"]
})