
// @from(Ln 426255, Col 0)
function q0q({
    content: A,
    defaultFilename: q,
    onDone: K
}) {
    let [, Y] = l16.useState(null), [z, _] = l16.useState(q), [w, O] = l16.useState(q.length), [$, H] = l16.useState(!1), {
        columns: j
    } = KA(), J = l16.useCallback(() => {
        H(!1), Y(null)
    }, []), M = async (Z) => {
        if (Z === "clipboard")
            if (await ZZ(A)) K({
                success: !0,
                message: "Conversation copied to clipboard"
            });
            else K({
                success: !1,
                message: C96()
            });
        else if (Z === "file") Y("file"), H(!0)
    }, D = () => {
        let Z = z.endsWith(".txt") ? z : z.replace(/\.[^.]+$/, "") + ".txt",
            G = V7z(G1(), Z);
        try {
            fz(G, A, {
                encoding: "utf-8",
                flush: !0
            }), K({
                success: !0,
                message: `Conversation exported to: ${G}`
            })
        } catch (f) {
            K({
                success: !1,
                message: `Failed to export conversation: ${f instanceof Error?f.message:"Unknown error"}`
            })
        }
    }, X = l16.useCallback(() => {
        if ($) J();
        else K({
            success: !1,
            message: "Export cancelled"
        })
    }, [$, J, K]), P = [{
        label: "Copy to clipboard",
        value: "clipboard",
        description: "Copy the conversation to your system clipboard"
    }, {
        label: "Save to file",
        value: "file",
        description: "Save the conversation to a file in the current directory"
    }];

    function W(Z) {
        if ($) return hE.default.createElement(C8, null, hE.default.createElement(a1, {
            shortcut: "Enter",
            action: "save"
        }), hE.default.createElement(O8, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "go back"
        }));
        if (Z.pending) return hE.default.createElement(T, null, "Press ", Z.keyName, " again to exit");
        return hE.default.createElement(O8, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "cancel"
        })
    }
    return D8("confirm:no", X, {
        context: "Settings",
        isActive: $
    }), hE.default.createElement(m8, {
        title: "Export Conversation",
        subtitle: "Select export method:",
        color: "permission",
        onCancel: X,
        inputGuide: W,
        isCancelActive: !$
    }, !$ ? hE.default.createElement(T8, {
        options: P,
        onChange: M,
        onCancel: X
    }) : hE.default.createElement(m, {
        flexDirection: "column"
    }, hE.default.createElement(T, null, "Enter filename:"), hE.default.createElement(m, {
        flexDirection: "row",
        gap: 1,
        marginTop: 1
    }, hE.default.createElement(T, null, ">"), hE.default.createElement(J5, {
        value: z,
        onChange: _,
        onSubmit: D,
        focus: !0,
        showCursor: !0,
        columns: j,
        cursorOffset: w,
        onChangeCursorOffset: O
    }))))
}
// @from(Ln 426357, Col 4)
hE
// @from(Ln 426357, Col 8)
l16
// @from(Ln 426358, Col 4)
K0q = E(() => {
    i6();
    v3();
    AH();
    lA();
    g1();
    vc();
    Lq();
    OK();
    Xq();
    _q();
    wq();
    _7();
    hE = t(P6(), 1), l16 = t(P6(), 1)
})
// @from(Ln 426374, Col 0)
function k7z({
    children: A
}) {
    let {
        bindings: q
    } = $p6(), K = vF.useRef(null), Y = vF.useRef(new Map), z = vF.useRef(new Set).current;
    return vF.default.createElement(G$1, {
        bindings: q,
        pendingChordRef: K,
        pendingChord: null,
        setPendingChord: () => {},
        activeContexts: z,
        registerActiveContext: () => {},
        unregisterActiveContext: () => {},
        handlerRegistryRef: Y
    }, A)
}
// @from(Ln 426391, Col 0)
async function Y0q(A, q = []) {
    return Fy1(vF.default.createElement(() => {
        let Y = A6(4),
            z;
        if (Y[0] === Symbol.for("react.memo_cache_sentinel")) z = [], Y[0] = z;
        else z = Y[0];
        let _, w;
        if (Y[1] === Symbol.for("react.memo_cache_sentinel")) _ = [], w = new Set, Y[1] = _, Y[2] = w;
        else _ = Y[1], w = Y[2];
        let O;
        if (Y[3] === Symbol.for("react.memo_cache_sentinel")) O = vF.default.createElement(Yj, null, vF.default.createElement(k7z, null, vF.default.createElement(G_6, {
            messages: A,
            tools: q,
            commands: z,
            verbose: !1,
            toolJSX: null,
            toolUseConfirmQueue: _,
            inProgressToolUseIDs: w,
            isMessageSelectorVisible: !1,
            conversationId: "export",
            screen: "prompt",
            streamingToolUses: [],
            showAllInTranscript: !0,
            disableRenderCap: !0,
            isLoading: !1
        }))), Y[3] = O;
        else O = Y[3];
        return O
    }, null))
}
// @from(Ln 426421, Col 4)
vF
// @from(Ln 426422, Col 4)
z0q = E(() => {
    e6();
    py1();
    en6();
    NA();
    Rm();
    cd();
    vF = t(P6(), 1)
})
// @from(Ln 426431, Col 4)
$0q = {}
// @from(Ln 426441, Col 0)
function y7z(A) {
    let q = A.getFullYear(),
        K = String(A.getMonth() + 1).padStart(2, "0"),
        Y = String(A.getDate()).padStart(2, "0"),
        z = String(A.getHours()).padStart(2, "0"),
        _ = String(A.getMinutes()).padStart(2, "0"),
        w = String(A.getSeconds()).padStart(2, "0");
    return `${q}-${K}-${Y}-${z}${_}${w}`
}
// @from(Ln 426451, Col 0)
function w0q(A) {
    let q = A.find((z) => z.type === "user");
    if (!q || q.type !== "user") return "";
    let K = q.message?.content,
        Y = "";
    if (typeof K === "string") Y = K.trim();
    else if (Array.isArray(K)) {
        let z = K.find((_) => _.type === "text");
        if (z && "text" in z) Y = z.text.trim()
    }
    if (Y = Y.split(`
`)[0] || "", Y.length > 50) Y = Y.substring(0, 50) + "...";
    return Y
}
// @from(Ln 426466, Col 0)
function O0q(A) {
    return A.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
}
// @from(Ln 426469, Col 0)
async function L7z(A) {
    let q = A.options.tools || [];
    return Y0q(A.messages, q)
}
// @from(Ln 426473, Col 0)
async function R7z(A, q, K) {
    let Y = await L7z(q);
    if (K.trim()) {
        let O = K.trim(),
            $ = O.endsWith(".txt") ? O : O.replace(/\.[^.]+$/, "") + ".txt",
            H = E7z(G1(), $);
        try {
            return fz(H, Y, {
                encoding: "utf-8",
                flush: !0
            }), A(`Conversation exported to: ${H}`), null
        } catch (j) {
            return A(`Failed to export conversation: ${j instanceof Error?j.message:"Unknown error"}`), null
        }
    }
    let z = w0q(q.messages),
        _ = y7z(new Date),
        w;
    if (z) {
        let O = O0q(z);
        w = O ? `${_}-${O}.txt` : `conversation-${_}.txt`
    } else w = `conversation-${_}.txt`;
    return _0q.default.createElement(q0q, {
        content: Y,
        defaultFilename: w,
        onDone: (O) => {
            A(O.message)
        }
    })
}
// @from(Ln 426503, Col 4)
_0q
// @from(Ln 426504, Col 4)
H0q = E(() => {
    K0q();
    z0q();
    lA();
    g1();
    _0q = t(P6(), 1)
})
// @from(Ln 426511, Col 4)
h7z
// @from(Ln 426511, Col 9)
j0q
// @from(Ln 426512, Col 4)
J0q = E(() => {
    h7z = {
        type: "local-jsx",
        name: "export",
        description: "Export the current conversation to a file or clipboard",
        isEnabled: () => !0,
        isHidden: !1,
        argumentHint: "[filename]",
        load: () => Promise.resolve().then(() => (H0q(), $0q)),
        userFacingName() {
            return "export"
        }
    }, j0q = h7z
})
// @from(Ln 426526, Col 4)
M0q = {}
// @from(Ln 426531, Col 0)
function S7z(A) {
    let q = A6(17),
        {
            onDone: K
        } = A,
        Y = M1(x7z),
        z = M1(b7z),
        _ = M1(I7z),
        w = xA(),
        O;
    if (q[0] !== Y || q[1] !== K) O = function() {
        d("tengu_model_command_menu", {
            action: "cancel"
        });
        let X = fr6(Y);
        K(`Kept model as ${O1.bold(X)}`, {
            display: "system"
        })
    }, q[0] = Y, q[1] = K, q[2] = O;
    else O = q[2];
    let $ = O,
        H;
    if (q[3] !== _ || q[4] !== Y || q[5] !== K || q[6] !== w) H = function(X, P) {
        d("tengu_model_command_menu", {
            action: X,
            from_model: Y,
            to_model: X
        }), w((G) => ({
            ...G,
            mainLoopModel: X,
            mainLoopModelForSession: null
        }));
        let W = `Set model to ${O1.bold(fr6(X))}`;
        if (P !== void 0) W = W + ` with ${O1.bold(P)} effort`;
        let Z = void 0;
        if (Dq()) {
            if (aq6(), !FH(X) && _) w(C7z), Z = !1;
            else if (FH(X) && yj() && _) W = W + " · Fast mode ON", Z = !0
        }
        if (az6(X, Z === !0, pH())) W = W + " · Billed as extra usage";
        if (Z === !1) W = W + " · Fast mode OFF";
        K(W)
    }, q[3] = _, q[4] = Y, q[5] = K, q[6] = w, q[7] = H;
    else H = q[7];
    let j = H,
        J;
    if (q[8] !== _ || q[9] !== Y) J = Dq() && _ && FH(Y) && yj(), q[8] = _, q[9] = Y, q[10] = J;
    else J = q[10];
    let M;
    if (q[11] !== $ || q[12] !== j || q[13] !== Y || q[14] !== z || q[15] !== J) M = ob.createElement(fv6, {
        initial: Y,
        sessionModel: z,
        onSelect: j,
        onCancel: $,
        isStandaloneCommand: !0,
        showFastModeNotice: J
    }), q[11] = $, q[12] = j, q[13] = Y, q[14] = z, q[15] = J, q[16] = M;
    else M = q[16];
    return M
}
// @from(Ln 426592, Col 0)
function C7z(A) {
    return {
        ...A,
        fastMode: !1
    }
}
// @from(Ln 426599, Col 0)
function I7z(A) {
    return A.fastMode
}
// @from(Ln 426603, Col 0)
function b7z(A) {
    return A.mainLoopModelForSession
}
// @from(Ln 426607, Col 0)
function x7z(A) {
    return A.mainLoopModel
}
// @from(Ln 426611, Col 0)
function u7z({
    args: A,
    onDone: q
}) {
    let K = M1((_) => _.fastMode),
        Y = xA(),
        z = A === "default" ? null : A;
    return ob.useEffect(() => {
        async function _() {
            if (z && !s66(z)) {
                q(`Model '${z}' is not available. Your organization restricts model selection.`, {
                    display: "system"
                });
                return
            }
            if (z && B7z(z)) {
                q("Opus 4.6 with 1M context is not available for your account. Learn more: https://code.claude.com/docs/en/model-config#extended-context-with-1m", {
                    display: "system"
                });
                return
            }
            if (z && g7z(z)) {
                q("Sonnet 4.6 with 1M context is not available for your account. Learn more: https://code.claude.com/docs/en/model-config#extended-context-with-1m", {
                    display: "system"
                });
                return
            }
            if (!z) {
                w(null);
                return
            }
            if (m7z(z)) {
                w(z);
                return
            }
            try {
                let {
                    valid: O,
                    error: $
                } = await KE1(z);
                if (O) w(z);
                else q($ || `Model '${z}' not found`, {
                    display: "system"
                })
            } catch (O) {
                q(`Failed to validate model: ${O.message}`, {
                    display: "system"
                })
            }
        }

        function w(O) {
            Y((j) => ({
                ...j,
                mainLoopModel: O,
                mainLoopModelForSession: null
            }));
            let $ = `Set model to ${O1.bold(fr6(O))}`,
                H = void 0;
            if (Dq()) {
                if (aq6(), !FH(O) && K) Y((j) => ({
                    ...j,
                    fastMode: !1
                })), H = !1;
                else if (FH(O) && K) $ += " · Fast mode ON", H = !0
            }
            if (az6(O, H === !0, pH())) $ += " · Billed as extra usage";
            if (H === !1) $ += " · Fast mode OFF";
            q($)
        }
        _()
    }, [z, q, Y]), null
}
// @from(Ln 426685, Col 0)
function m7z(A) {
    return e36.includes(A.toLowerCase().trim())
}
// @from(Ln 426689, Col 0)
function B7z(A) {
    let q = A.toLowerCase();
    return !fc() && !pH() && q.includes("opus") && q.includes("[1m]")
}
// @from(Ln 426694, Col 0)
function g7z(A) {
    let q = A.toLowerCase();
    return !Tc() && (q.includes("sonnet[1m]") || q.includes("sonnet-4-6[1m]"))
}
// @from(Ln 426699, Col 0)
function F7z(A) {
    let {
        onDone: q
    } = A, K = M1(U7z), Y = M1(Q7z), z = M1(p7z), _ = fr6(K), w = z !== void 0 ? ` (effort: ${z})` : "";
    if (Y) q(`Current model: ${O1.bold(fr6(Y))} (session override from plan mode)
Base model: ${_}${w}`);
    else q(`Current model: ${_}${w}`);
    return null
}
// @from(Ln 426709, Col 0)
function p7z(A) {
    return A.effortValue
}
// @from(Ln 426713, Col 0)
function Q7z(A) {
    return A.mainLoopModelForSession
}
// @from(Ln 426717, Col 0)
function U7z(A) {
    return A.mainLoopModel
}
// @from(Ln 426721, Col 0)
function fr6(A) {
    let q = Oi6(A ?? Mv());
    return A === null ? `${q} (default)` : q
}
// @from(Ln 426725, Col 4)
ob
// @from(Ln 426725, Col 8)
d7z = async (A, q, K) => {
    if (K = K?.trim() || "", C81.includes(K)) return d("tengu_model_command_inline_help", {
        args: K
    }), ob.createElement(F7z, {
        onDone: A
    });
    if (S81.includes(K)) {
        A("Run /model to open the model selection menu, or /model [modelName] to set the model.", {
            display: "system"
        });
        return
    }
    if (K) return d("tengu_model_command_inline", {
        args: K
    }), ob.createElement(u7z, {
        args: K,
        onDone: A
    });
    return ob.createElement(S7z, {
        onDone: A
    })
}
// @from(Ln 426747, Col 4)
D0q = E(() => {
    e6();
    xy1();
    NA();
    z4();
    uy1();
    dW6();
    zi6();
    HF8();
    V1();
    aK();
    PZ1();
    vz();
    FW();
    ob = t(P6(), 1)
})
// @from(Ln 426763, Col 4)
X0q
// @from(Ln 426764, Col 4)
P0q = E(() => {
    mR1();
    z4();
    X0q = {
        type: "local-jsx",
        name: "model",
        userFacingName() {
            return "model"
        },
        get description() {
            return `Set the AI model for Claude Code (currently ${qJ(cK())})`
        },
        isEnabled: () => !0,
        isHidden: !1,
        argumentHint: "[model]",
        get immediate() {
            return XN6()
        },
        load: () => Promise.resolve().then(() => (D0q(), M0q))
    }
})
// @from(Ln 426785, Col 4)
Z0q = {}
// @from(Ln 426790, Col 0)
function c7z(A) {
    let q = A6(11),
        {
            tagName: K,
            onConfirm: Y,
            onCancel: z
        } = A,
        _ = `Current tag: #${K}`,
        w;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) w = JH.createElement(T, null, "This will remove the tag from the current session."), q[0] = w;
    else w = q[0];
    let O;
    if (q[1] !== z || q[2] !== Y) O = (J) => J === "yes" ? Y() : z(), q[1] = z, q[2] = Y, q[3] = O;
    else O = q[3];
    let $;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) $ = [{
        label: "Yes, remove tag",
        value: "yes"
    }, {
        label: "No, keep tag",
        value: "no"
    }], q[4] = $;
    else $ = q[4];
    let H;
    if (q[5] !== O) H = JH.createElement(m, {
        flexDirection: "column",
        gap: 1
    }, w, JH.createElement(T8, {
        onChange: O,
        options: $
    })), q[5] = O, q[6] = H;
    else H = q[6];
    let j;
    if (q[7] !== z || q[8] !== _ || q[9] !== H) j = JH.createElement(m8, {
        title: "Remove tag?",
        subtitle: _,
        onCancel: z,
        color: "warning"
    }, H), q[7] = z, q[8] = _, q[9] = H, q[10] = j;
    else j = q[10];
    return j
}
// @from(Ln 426833, Col 0)
function l7z(A) {
    let q = A6(17),
        {
            tagName: K,
            onDone: Y
        } = A,
        [z, _] = JH.useState(!1),
        [w, O] = JH.useState(null),
        $;
    if (q[0] !== K) $ = Ws(K).trim(), q[0] = K, q[1] = $;
    else $ = q[1];
    let H = $,
        j, J;
    if (q[2] !== H || q[3] !== Y) j = () => {
        let M = R1();
        if (!M) {
            Y("No active session to tag", {
                display: "system"
            });
            return
        }
        if (!H) {
            Y("Tag name cannot be empty", {
                display: "system"
            });
            return
        }
        O(M);
        let D = ol8(M);
        if (D === H) d("tengu_tag_command_remove_prompt", {}), _(!0);
        else d("tengu_tag_command_add", {
            is_replacing: !!D
        }), (async () => {
            let P = Cz();
            await Oh1(M, H, P), Y(`Tagged session with ${O1.cyan(`#${H}`)}`, {
                display: "system"
            })
        })()
    }, J = [H, Y], q[2] = H, q[3] = Y, q[4] = j, q[5] = J;
    else j = q[4], J = q[5];
    if (JH.useEffect(j, J), z && w) {
        let M;
        if (q[6] !== H || q[7] !== Y || q[8] !== w) M = async () => {
            d("tengu_tag_command_remove_confirmed", {});
            let P = Cz();
            await Oh1(w, "", P), Y(`Removed tag ${O1.cyan(`#${H}`)}`, {
                display: "system"
            })
        }, q[6] = H, q[7] = Y, q[8] = w, q[9] = M;
        else M = q[9];
        let D;
        if (q[10] !== H || q[11] !== Y) D = () => {
            d("tengu_tag_command_remove_cancelled", {}), Y(`Kept tag ${O1.cyan(`#${H}`)}`, {
                display: "system"
            })
        }, q[10] = H, q[11] = Y, q[12] = D;
        else D = q[12];
        let X;
        if (q[13] !== H || q[14] !== M || q[15] !== D) X = JH.createElement(c7z, {
            tagName: H,
            onConfirm: M,
            onCancel: D
        }), q[13] = H, q[14] = M, q[15] = D, q[16] = X;
        else X = q[16];
        return X
    }
    return null
}
// @from(Ln 426902, Col 0)
function W0q(A) {
    let q = A6(3),
        {
            onDone: K
        } = A,
        Y, z;
    if (q[0] !== K) Y = () => {
        K(`Usage: /tag <tag-name>

Toggle a searchable tag on the current session.
Run the same command again to remove the tag.
Tags are displayed after the branch name in /resume and can be searched with /.

Examples:
  /tag bugfix        # Add tag
  /tag bugfix        # Remove tag (toggle)
  /tag feature-auth
  /tag wip`, {
            display: "system"
        })
    }, z = [K], q[0] = K, q[1] = Y, q[2] = z;
    else Y = q[1], z = q[2];
    return JH.useEffect(Y, z), null
}
// @from(Ln 426926, Col 0)
async function i7z(A, q, K) {
    if (K = K?.trim() || "", C81.includes(K) || S81.includes(K)) return JH.createElement(W0q, {
        onDone: A
    });
    if (!K) return JH.createElement(W0q, {
        onDone: A
    });
    return JH.createElement(l7z, {
        tagName: K,
        onDone: A
    })
}
// @from(Ln 426938, Col 4)
JH
// @from(Ln 426939, Col 4)
G0q = E(() => {
    e6();
    i6();
    T1();
    Oq();
    aK();
    vz();
    v3();
    wq();
    V1();
    JH = t(P6(), 1)
})
// @from(Ln 426951, Col 4)
n7z
// @from(Ln 426951, Col 9)
f0q
// @from(Ln 426952, Col 4)
T0q = E(() => {
    n7z = {
        type: "local-jsx",
        name: "tag",
        userFacingName() {
            return "tag"
        },
        description: "Toggle a searchable tag on the current session",
        isEnabled: () => !1,
        isHidden: !1,
        argumentHint: "<tag-name>",
        load: () => Promise.resolve().then(() => (G0q(), Z0q))
    }, f0q = n7z
})
// @from(Ln 426966, Col 4)
v0q = {}
// @from(Ln 426970, Col 0)
async function r7z(A) {
    A("/output-style has been deprecated. Use /config to change your output style, or set it in your settings file. Changes take effect on the next session.", {
        display: "system"
    })
}
// @from(Ln 426975, Col 4)
o7z
// @from(Ln 426975, Col 9)
N0q
// @from(Ln 426976, Col 4)
V0q = E(() => {
    o7z = {
        type: "local-jsx",
        name: "output-style",
        userFacingName() {
            return "output-style"
        },
        description: "Deprecated: use /config to change output style",
        isEnabled: () => !0,
        isHidden: !0,
        load: () => Promise.resolve().then(() => v0q)
    }, N0q = o7z
})
// @from(Ln 426989, Col 0)
async function k0q() {
    let A = await jl6();
    if (A.length === 0) return {
        availableEnvironments: [],
        selectedEnvironment: null,
        selectedEnvironmentSource: null
    };
    let K = PA()?.remote?.defaultEnvironmentId,
        Y = A.find((_) => _.kind !== "bridge") ?? A[0],
        z = null;
    if (K) {
        let _ = A.find((w) => w.environment_id === K);
        if (_) {
            Y = _;
            for (let w = VG.length - 1; w >= 0; w--) {
                let O = VG[w];
                if (!O || O === "flagSettings") continue;
                if (L8(O)?.remote?.defaultEnvironmentId === K) {
                    z = O;
                    break
                }
            }
        }
    }
    return {
        availableEnvironments: A,
        selectedEnvironment: Y,
        selectedEnvironmentSource: z
    }
}
// @from(Ln 427019, Col 4)
E0q = E(() => {
    i8();
    O2();
    wV1()
})
// @from(Ln 427025, Col 0)
function y0q(A) {
    let q = A6(27),
        {
            onDone: K
        } = A,
        [Y, z] = i16.useState("loading"),
        _;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) _ = [], q[0] = _;
    else _ = q[0];
    let [w, O] = i16.useState(_), [$, H] = i16.useState(null), [j, J] = i16.useState(null), [M, D] = i16.useState(null), X, P;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) X = () => {
        (async function() {
            try {
                let N = await k0q();
                O(N.availableEnvironments), H(N.selectedEnvironment), J(N.selectedEnvironmentSource), z(null)
            } catch (N) {
                let V = N,
                    L = V instanceof Error ? V.message : String(V);
                _6(V instanceof Error ? V : Error(L)), D(L), z(null)
            }
        })()
    }, P = [], q[1] = X, q[2] = P;
    else X = q[1], P = q[2];
    i16.useEffect(X, P);
    let W;
    if (q[3] !== w || q[4] !== K) W = function(v) {
        if (v === "cancel") {
            K();
            return
        }
        z("updating");
        let N = w.find((V) => V.environment_id === v);
        if (!N) {
            K("Error: Selected environment not found");
            return
        }
        TA("localSettings", {
            remote: {
                defaultEnvironmentId: N.environment_id
            }
        }), K(`Set default remote environment to ${O1.bold(N.name)} (${N.environment_id})`)
    }, q[3] = w, q[4] = K, q[5] = W;
    else W = q[5];
    let Z = W;
    if (Y === "loading") {
        let f;
        if (q[6] === Symbol.for("react.memo_cache_sentinel")) f = NK.createElement(Ul, {
            message: "Loading environments…"
        }), q[6] = f;
        else f = q[6];
        let v;
        if (q[7] !== K) v = NK.createElement(m8, {
            title: Tr6,
            onCancel: K,
            hideInputGuide: !0
        }, f), q[7] = K, q[8] = v;
        else v = q[8];
        return v
    }
    if (M) {
        let f;
        if (q[9] !== M) f = NK.createElement(T, {
            color: "error"
        }, "Error: ", M), q[9] = M, q[10] = f;
        else f = q[10];
        let v;
        if (q[11] !== K || q[12] !== f) v = NK.createElement(m8, {
            title: Tr6,
            onCancel: K
        }, f), q[11] = K, q[12] = f, q[13] = v;
        else v = q[13];
        return v
    }
    if (!$) {
        let f;
        if (q[14] === Symbol.for("react.memo_cache_sentinel")) f = NK.createElement(T, null, "No remote environments available."), q[14] = f;
        else f = q[14];
        let v;
        if (q[15] !== K) v = NK.createElement(m8, {
            title: Tr6,
            subtitle: al8,
            onCancel: K
        }, f), q[15] = K, q[16] = v;
        else v = q[16];
        return v
    }
    if (w.length === 1) {
        let f;
        if (q[17] !== K || q[18] !== $) f = NK.createElement(s7z, {
            environment: $,
            onDone: K
        }), q[17] = K, q[18] = $, q[19] = f;
        else f = q[19];
        return f
    }
    let G;
    if (q[20] !== w || q[21] !== Z || q[22] !== Y || q[23] !== K || q[24] !== $ || q[25] !== j) G = NK.createElement(t7z, {
        environments: w,
        selectedEnvironment: $,
        selectedEnvironmentSource: j,
        loadingState: Y,
        onSelect: Z,
        onCancel: K
    }), q[20] = w, q[21] = Z, q[22] = Y, q[23] = K, q[24] = $, q[25] = j, q[26] = G;
    else G = q[26];
    return G
}
// @from(Ln 427133, Col 0)
function a7z(A) {
    let q = A6(7),
        {
            environment: K
        } = A,
        Y;
    if (q[0] !== K.name) Y = NK.createElement(T, {
        bold: !0
    }, K.name), q[0] = K.name, q[1] = Y;
    else Y = q[1];
    let z;
    if (q[2] !== K.environment_id) z = NK.createElement(T, {
        dimColor: !0
    }, "(", K.environment_id, ")"), q[2] = K.environment_id, q[3] = z;
    else z = q[3];
    let _;
    if (q[4] !== Y || q[5] !== z) _ = NK.createElement(T, null, a6.tick, " Using ", Y, " ", z), q[4] = Y, q[5] = z, q[6] = _;
    else _ = q[6];
    return _
}
// @from(Ln 427154, Col 0)
function s7z(A) {
    let q = A6(6),
        {
            environment: K,
            onDone: Y
        } = A,
        z;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) z = {
        context: "Confirmation"
    }, q[0] = z;
    else z = q[0];
    D8("confirm:yes", Y, z);
    let _;
    if (q[1] !== K) _ = NK.createElement(a7z, {
        environment: K
    }), q[1] = K, q[2] = _;
    else _ = q[2];
    let w;
    if (q[3] !== Y || q[4] !== _) w = NK.createElement(m8, {
        title: Tr6,
        subtitle: al8,
        onCancel: Y
    }, _), q[3] = Y, q[4] = _, q[5] = w;
    else w = q[5];
    return w
}
// @from(Ln 427181, Col 0)
function t7z(A) {
    let q = A6(18),
        {
            environments: K,
            selectedEnvironment: Y,
            selectedEnvironmentSource: z,
            loadingState: _,
            onSelect: w,
            onCancel: O
        } = A,
        $;
    if (q[0] !== z) $ = z && z !== "localSettings" ? ` (from ${vo(z)} settings)` : "", q[0] = z, q[1] = $;
    else $ = q[1];
    let H = $,
        j;
    if (q[2] !== Y.name) j = NK.createElement(T, {
        bold: !0
    }, Y.name), q[2] = Y.name, q[3] = j;
    else j = q[3];
    let J;
    if (q[4] !== H || q[5] !== j) J = NK.createElement(T, null, "Currently using: ", j, H), q[4] = H, q[5] = j, q[6] = J;
    else J = q[6];
    let M = J,
        D;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) D = NK.createElement(T, {
        dimColor: !0
    }, al8), q[7] = D;
    else D = q[7];
    let X;
    if (q[8] !== K || q[9] !== _ || q[10] !== w || q[11] !== Y.environment_id) X = _ === "updating" ? NK.createElement(Ul, {
        message: "Updating…"
    }) : NK.createElement(T8, {
        options: K.map(e7z),
        defaultValue: Y.environment_id,
        onChange: w,
        onCancel: () => w("cancel"),
        layout: "compact-vertical"
    }), q[8] = K, q[9] = _, q[10] = w, q[11] = Y.environment_id, q[12] = X;
    else X = q[12];
    let P;
    if (q[13] === Symbol.for("react.memo_cache_sentinel")) P = NK.createElement(T, {
        dimColor: !0
    }, NK.createElement(C8, null, NK.createElement(a1, {
        shortcut: "Enter",
        action: "select"
    }), NK.createElement(O8, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    }))), q[13] = P;
    else P = q[13];
    let W;
    if (q[14] !== O || q[15] !== M || q[16] !== X) W = NK.createElement(m8, {
        title: Tr6,
        subtitle: M,
        onCancel: O,
        hideInputGuide: !0
    }, D, X, P), q[14] = O, q[15] = M, q[16] = X, q[17] = W;
    else W = q[17];
    return W
}
// @from(Ln 427244, Col 0)
function e7z(A) {
    return {
        label: NK.createElement(T, null, A.name, " ", NK.createElement(T, {
            dimColor: !0
        }, "(", A.environment_id, ")")),
        value: A.environment_id
    }
}
// @from(Ln 427252, Col 4)
NK
// @from(Ln 427252, Col 8)
i16
// @from(Ln 427252, Col 13)
Tr6 = "Select Remote Environment"
// @from(Ln 427253, Col 4)
al8 = "Configure environments at: https://claude.ai/code"
// @from(Ln 427254, Col 4)
L0q = E(() => {
    e6();
    i6();
    _7();
    wq();
    v3();
    b7();
    Zv6();
    E0q();
    i8();
    k1();
    aK();
    O2();
    Lq();
    OK();
    Xq();
    NK = t(P6(), 1), i16 = t(P6(), 1)
})
// @from(Ln 427272, Col 4)
R0q = {}
// @from(Ln 427276, Col 0)
async function A4z(A) {
    return sl8.createElement(y0q, {
        onDone: A
    })
}
// @from(Ln 427281, Col 4)
sl8
// @from(Ln 427282, Col 4)
h0q = E(() => {
    L0q();
    sl8 = t(P6(), 1)
})
// @from(Ln 427286, Col 4)
S0q
// @from(Ln 427287, Col 4)
C0q = E(() => {
    fA();
    AN();
    S0q = {
        type: "local-jsx",
        name: "remote-env",
        userFacingName() {
            return "remote-env"
        },
        description: "Configure the default remote environment for teleport sessions",
        isEnabled: () => iA() && qD("allow_remote_sessions"),
        get isHidden() {
            return !iA() || !qD("allow_remote_sessions")
        },
        load: () => Promise.resolve().then(() => (h0q(), R0q))
    }
})
// @from(Ln 427304, Col 4)
I0q = {}
// @from(Ln 427308, Col 0)
async function el8(A, q) {
    try {
        if (iA()) {
            let Y = sA(),
                z = !1;
            if (Y?.subscriptionType && Y?.rateLimitTier) z = Y.subscriptionType === "max" && Y.rateLimitTier === "default_claude_max_20x";
            else if (Y?.accessToken) {
                let _ = await Kg(Y.accessToken);
                z = _?.organization?.organization_type === "claude_max" && _?.organization?.rate_limit_tier === "default_claude_max_20x"
            }
            if (z) return setTimeout(A, 0, "You are already on the highest Max subscription plan. For additional usage, run /login to switch to an API usage-billed account."), null
        }
        return await R9("https://claude.ai/upgrade/max"), tl8.createElement(Hf6, {
            startingMessage: "Starting new login following /upgrade. Exit with Ctrl-C to use existing account.",
            onDone: (Y) => {
                q.onChangeAPIKey(), A(Y ? "Login successful" : "Login interrupted")
            }
        })
    } catch (K) {
        _6(K), setTimeout(A, 0, "Failed to open browser. Please visit https://claude.ai/upgrade/max to upgrade.")
    }
    return null
}
// @from(Ln 427331, Col 4)
tl8
// @from(Ln 427332, Col 4)
Ai8 = E(() => {
    k1();
    fA();
    kX();
    xv1();
    RZ6();
    tl8 = t(P6(), 1)
})
// @from(Ln 427340, Col 4)
q4z
// @from(Ln 427340, Col 9)
$h1
// @from(Ln 427341, Col 4)
qi8 = E(() => {
    fA();
    q4z = {
        type: "local-jsx",
        name: "upgrade",
        description: "Upgrade to Max for higher rate limits and more Opus",
        isEnabled: () => !process.env.DISABLE_UPGRADE_COMMAND && !uI() && CK() !== "enterprise",
        isHidden: !1,
        load: () => Promise.resolve().then(() => (Ai8(), I0q)),
        userFacingName() {
            return "upgrade"
        }
    }, $h1 = q4z
})
// @from(Ln 427355, Col 4)
x0q = {}
// @from(Ln 427360, Col 0)
function K4z(A) {
    let q = A6(21),
        {
            onDone: K,
            context: Y
        } = A,
        [z, _] = b0q.useState(null),
        w = j66(),
        O;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) O = CK(), q[0] = O;
    else O = q[0];
    let $ = O,
        H;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) H = ox(), q[1] = H;
    else H = q[1];
    let j = H,
        J = L3()?.hasExtraUsageEnabled === !0,
        D = $ === "max" && j === "default_claude_max_20x",
        X = $ === "team" || $ === "enterprise",
        P;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) P = {
        label: "Stop and wait for limit to reset",
        value: "cancel"
    }, q[2] = P;
    else P = q[2];
    let W;
    if (q[3] !== w.overageDisabledReason || q[4] !== w.overageStatus) {
        if (W = [P], H66.isEnabled()) {
            let h = fI(),
                R = X && !h,
                u = w.overageDisabledReason === "out_of_credits" || w.overageDisabledReason === "org_level_disabled_until" || w.overageDisabledReason === "org_service_zero_credit_limit";
            if (R && u);
            else {
                let I = w.overageStatus === "rejected" || w.overageStatus === "allowed_warning",
                    g;
                if (R) g = I ? "Request more" : "Request extra usage";
                else g = J ? "Add funds to continue with extra usage" : "Switch to extra usage";
                let B;
                if (q[6] !== g) B = {
                    label: g,
                    value: "extra-usage"
                }, q[6] = g, q[7] = B;
                else B = q[7];
                W.push(B)
            }
        }
        if (!D && !X && $h1.isEnabled()) {
            let h;
            if (q[8] === Symbol.for("react.memo_cache_sentinel")) h = {
                label: "Upgrade your plan",
                value: "upgrade"
            }, q[8] = h;
            else h = q[8];
            W.push(h)
        }
        q[3] = w.overageDisabledReason, q[4] = w.overageStatus, q[5] = W
    } else W = q[5];
    let Z = W,
        G;
    if (q[9] !== K) G = function() {
        d("tengu_rate_limit_options_menu_cancel", {}), K(void 0, {
            display: "skip"
        })
    }, q[9] = K, q[10] = G;
    else G = q[10];
    let f = G,
        v;
    if (q[11] !== Y || q[12] !== f || q[13] !== K) v = function(R) {
        if (R === "upgrade") d("tengu_rate_limit_options_menu_select_upgrade", {}), el8(K, Y).then((u) => {
            if (u) _(u)
        });
        else if (R === "extra-usage") d("tengu_rate_limit_options_menu_select_extra_usage", {}), Kx8(K, Y).then((u) => {
            if (u) _(u)
        });
        else if (R === "cancel") f()
    }, q[11] = Y, q[12] = f, q[13] = K, q[14] = v;
    else v = q[14];
    let N = v;
    if (z) return z;
    let V;
    if (q[15] !== N || q[16] !== Z) V = Hh1.default.createElement(T8, {
        options: Z,
        onChange: N,
        visibleOptionCount: Z.length
    }), q[15] = N, q[16] = Z, q[17] = V;
    else V = q[17];
    let L;
    if (q[18] !== f || q[19] !== V) L = Hh1.default.createElement(m8, {
        title: "What do you want to do?",
        onCancel: f,
        color: "suggestion"
    }, V), q[18] = f, q[19] = V, q[20] = L;
    else L = q[20];
    return L
}
// @from(Ln 427455, Col 0)
async function Y4z(A, q) {
    return Hh1.default.createElement(K4z, {
        onDone: A,
        context: q
    })
}
// @from(Ln 427461, Col 4)
Hh1
// @from(Ln 427461, Col 9)
b0q
// @from(Ln 427462, Col 4)
u0q = E(() => {
    e6();
    v3();
    wq();
    V1();
    fA();
    qi8();
    Ai8();
    Pc6();
    Yx8();
    k8();
    Wc6();
    Hh1 = t(P6(), 1), b0q = t(P6(), 1)
})
// @from(Ln 427476, Col 4)
z4z
// @from(Ln 427476, Col 9)
m0q
// @from(Ln 427477, Col 4)
B0q = E(() => {
    fA();
    z4z = {
        type: "local-jsx",
        name: "rate-limit-options",
        userFacingName() {
            return "rate-limit-options"
        },
        description: "Show options when rate limit is reached",
        isEnabled: () => {
            if (!iA()) return !1;
            return !0
        },
        isHidden: !0,
        load: () => Promise.resolve().then(() => (u0q(), x0q))
    }, m0q = z4z
})
// @from(Ln 427494, Col 4)
_4z
// @from(Ln 427494, Col 9)
Ki8
// @from(Ln 427495, Col 4)
g0q = E(() => {
    _4z = {
        type: "prompt",
        description: "Set up Claude Code's status line UI",
        contentLength: 0,
        aliases: [],
        isEnabled: () => !0,
        isHidden: !1,
        name: "statusline",
        progressMessage: "setting up statusLine",
        allowedTools: [r4, "Read(~/**)", "Edit(~/.claude/settings.json)"],
        source: "builtin",
        disableNonInteractive: !0,
        async getPromptForCommand(A) {
            let q = A.trim() || "Configure my statusLine from my shell PS1 configuration";
            return [{
                type: "text",
                text: `Create an ${r4} with subagent_type "statusline-setup" and the prompt "${q}"`
            }]
        },
        userFacingName() {
            return "statusline"
        }
    }, Ki8 = _4z
})
// @from(Ln 427520, Col 4)
F0q = {}
// @from(Ln 427525, Col 0)
function O4z(A) {
    let q = nq6(A);
    if (q !== void 0) {
        let z = TA("userSettings", {
            effortLevel: q
        });
        if (z.error) return {
            message: `Failed to set effort level: ${z.error.message}`
        }
    }
    let K = KO8(A);
    return {
        message: `Set effort level to ${A}${q!==void 0?"":" (this session only)"}: ${K}`,
        effortUpdate: {
            value: A
        }
    }
}
// @from(Ln 427544, Col 0)
function $4z(A) {
    let q = qO8(),
        K = q === null ? void 0 : q ?? A;
    if (K === void 0) return {
        message: "Effort level: auto"
    };
    let Y = KO8(K);
    return {
        message: `Current effort level: ${K} (${Y})`
    }
}
// @from(Ln 427556, Col 0)
function H4z() {
    let A = TA("userSettings", {
        effortLevel: void 0
    });
    if (A.error) return {
        message: `Failed to set effort level: ${A.error.message}`
    };
    return {
        message: "Effort level set to auto",
        effortUpdate: {
            value: void 0
        }
    }
}
// @from(Ln 427571, Col 0)
function j4z(A) {
    let q = A.toLowerCase();
    if (q === "auto" || q === "unset") return H4z();
    if (!b21(q)) return {
        message: `Invalid argument: ${A}. Valid options are: low, medium, high, max, auto`
    };
    return O4z(q)
}
// @from(Ln 427580, Col 0)
function J4z(A) {
    let {
        onDone: q
    } = A, K = M1(M4z), {
        message: Y
    } = $4z(K);
    return q(Y), null
}
// @from(Ln 427589, Col 0)
function M4z(A) {
    return A.effortValue
}
// @from(Ln 427593, Col 0)
function D4z(A) {
    let {
        result: q,
        onDone: K
    } = A, Y = xA();
    if (q.effortUpdate) Y((z) => ({
        ...z,
        effortValue: q.effortUpdate.value
    }));
    return K(q.message), null
}
// @from(Ln 427604, Col 0)
async function X4z(A, q, K) {
    if (K = K?.trim() || "", w4z.includes(K)) {
        A(`Usage: /effort [low|medium|high|max|auto]

Effort levels:
- low: Quick, straightforward implementation
- medium: Balanced approach with standard testing
- high: Comprehensive implementation with extensive testing
- max: Maximum capability with deepest reasoning (Opus 4.6 only)
- auto: Use the default effort level for your model`);
        return
    }
    if (!K || K === "current" || K === "status") return vr6.createElement(J4z, {
        onDone: A
    });
    let Y = j4z(K);
    return vr6.createElement(D4z, {
        result: Y,
        onDone: A
    })
}
// @from(Ln 427625, Col 4)
vr6
// @from(Ln 427625, Col 9)
w4z
// @from(Ln 427626, Col 4)
p0q = E(() => {
    wk();
    i8();
    NA();
    vr6 = t(P6(), 1), w4z = ["help", "-h", "--help"]
})
// @from(Ln 427632, Col 4)
Q0q
// @from(Ln 427633, Col 4)
U0q = E(() => {
    mR1();
    Q0q = {
        type: "local-jsx",
        name: "effort",
        description: "Set effort level for model usage",
        isEnabled: () => !0,
        isHidden: !1,
        argumentHint: "[low|medium|high|max|auto]",
        get immediate() {
            return XN6()
        },
        load: () => Promise.resolve().then(() => (p0q(), F0q)),
        userFacingName() {
            return "effort"
        }
    }
})
// @from(Ln 427651, Col 4)
d0q = x((jh1) => {
    (function(A) {
        A.black = "\x1B[30m", A.red = "\x1B[31m", A.green = "\x1B[32m", A.yellow = "\x1B[33m", A.blue = "\x1B[34m", A.magenta = "\x1B[35m", A.cyan = "\x1B[36m", A.lightgray = "\x1B[37m", A.default = "\x1B[39m", A.darkgray = "\x1B[90m", A.lightred = "\x1B[91m", A.lightgreen = "\x1B[92m", A.lightyellow = "\x1B[93m", A.lightblue = "\x1B[94m", A.lightmagenta = "\x1B[95m", A.lightcyan = "\x1B[96m", A.white = "\x1B[97m", A.reset = "\x1B[0m";

        function q(K, Y) {
            return Y === void 0 ? K : Y + K + A.reset
        }
        A.colored = q, A.plot = function(K, Y = void 0) {
            if (typeof K[0] == "number") K = [K];
            Y = typeof Y < "u" ? Y : {};
            let z = typeof Y.min < "u" ? Y.min : K[0][0],
                _ = typeof Y.max < "u" ? Y.max : K[0][0];
            for (let v = 0; v < K.length; v++)
                for (let N = 0; N < K[v].length; N++) z = Math.min(z, K[v][N]), _ = Math.max(_, K[v][N]);
            let w = ["┼", "┤", "╶", "╴", "─", "╰", "╭", "╮", "╯", "│"],
                O = Math.abs(_ - z),
                $ = typeof Y.offset < "u" ? Y.offset : 3,
                H = typeof Y.padding < "u" ? Y.padding : "           ",
                j = typeof Y.height < "u" ? Y.height : O,
                J = typeof Y.colors < "u" ? Y.colors : [],
                M = O !== 0 ? j / O : 1,
                D = Math.round(z * M),
                X = Math.round(_ * M),
                P = Math.abs(X - D),
                W = 0;
            for (let v = 0; v < K.length; v++) W = Math.max(W, K[v].length);
            W = W + $;
            let Z = typeof Y.symbols < "u" ? Y.symbols : w,
                G = typeof Y.format < "u" ? Y.format : function(v) {
                    return (H + v.toFixed(2)).slice(-H.length)
                },
                f = Array(P + 1);
            for (let v = 0; v <= P; v++) {
                f[v] = Array(W);
                for (let N = 0; N < W; N++) f[v][N] = " "
            }
            for (let v = D; v <= X; ++v) {
                let N = G(P > 0 ? _ - (v - D) * O / P : v, v - D);
                f[v - D][Math.max($ - N.length, 0)] = N, f[v - D][$ - 1] = v == 0 ? Z[0] : Z[1]
            }
            for (let v = 0; v < K.length; v++) {
                let N = J[v % J.length],
                    V = Math.round(K[v][0] * M) - D;
                f[P - V][$ - 1] = q(Z[0], N);
                for (let L = 0; L < K[v].length - 1; L++) {
                    let h = Math.round(K[v][L + 0] * M) - D,
                        R = Math.round(K[v][L + 1] * M) - D;
                    if (h == R) f[P - h][L + $] = q(Z[4], N);
                    else {
                        f[P - R][L + $] = q(h > R ? Z[5] : Z[6], N), f[P - h][L + $] = q(h > R ? Z[7] : Z[8], N);
                        let u = Math.min(h, R),
                            I = Math.max(h, R);
                        for (let g = u + 1; g < I; g++) f[P - g][L + $] = q(Z[9], N)
                    }
                }
            }
            return f.map(function(v) {
                return v.join("")
            }).join(`
`)
        }
    })(typeof jh1 > "u" ? jh1.asciichart = {} : jh1)
})
// @from(Ln 427723, Col 0)
async function c0q(A) {
    while (Jh1) await Jh1;
    let q;
    Jh1 = new Promise((K) => {
        q = K
    });
    try {
        return await A()
    } finally {
        Jh1 = null, q?.()
    }
}
// @from(Ln 427736, Col 0)
function l0q() {
    return W4z(c8(), f4z)
}
// @from(Ln 427740, Col 0)
function Yi8() {
    return {
        version: Mh1,
        lastComputedDate: null,
        dailyActivity: [],
        dailyModelTokens: [],
        modelUsage: {},
        totalSessions: 0,
        totalMessages: 0,
        longestSession: null,
        firstSessionDate: null,
        hourCounts: {},
        totalSpeculationTimeSavedMs: 0,
        shotDistribution: {}
    }
}
// @from(Ln 427756, Col 0)
async function i0q() {
    let A = $1(),
        q = l0q();
    try {
        let K = await A.readFile(q, {
                encoding: "utf-8"
            }),
            Y = i1(K);
        if (Y.version !== Mh1) return k(`Stats cache version mismatch (got ${Y.version}, expected ${Mh1}), returning empty cache`), Yi8();
        if (!Array.isArray(Y.dailyActivity) || !Array.isArray(Y.dailyModelTokens) || typeof Y.totalSessions !== "number" || typeof Y.totalMessages !== "number") return k("Stats cache has invalid structure, returning empty cache"), Yi8();
        return Y
    } catch (K) {
        return k(`Failed to load stats cache: ${_1(K)}`), Yi8()
    }
}
// @from(Ln 427771, Col 0)
async function Dh1(A) {
    let q = $1(),
        K = l0q(),
        Y = `${K}.${G4z(8).toString("hex")}.tmp`;
    try {
        let z = c8();
        try {
            await q.mkdir(z)
        } catch {}
        let _ = B6(A, null, 2),
            w = await Z4z(Y, "w", 384);
        try {
            await w.writeFile(_, {
                encoding: "utf-8"
            }), await w.sync()
        } finally {
            await w.close()
        }
        await q.rename(Y, K), k(`Stats cache saved successfully (lastComputedDate: ${A.lastComputedDate})`)
    } catch (z) {
        _6(z);
        try {
            await q.unlink(Y)
        } catch {}
    }
}
// @from(Ln 427798, Col 0)
function zi8(A, q, K) {
    let Y = new Map;
    for (let M of A.dailyActivity) Y.set(M.date, {
        ...M
    });
    for (let M of q.dailyActivity) {
        let D = Y.get(M.date);
        if (D) D.messageCount += M.messageCount, D.sessionCount += M.sessionCount, D.toolCallCount += M.toolCallCount;
        else Y.set(M.date, {
            ...M
        })
    }
    let z = new Map;
    for (let M of A.dailyModelTokens) z.set(M.date, {
        ...M.tokensByModel
    });
    for (let M of q.dailyModelTokens) {
        let D = z.get(M.date);
        if (D)
            for (let [X, P] of Object.entries(M.tokensByModel)) D[X] = (D[X] || 0) + P;
        else z.set(M.date, {
            ...M.tokensByModel
        })
    }
    let _ = {
        ...A.modelUsage
    };
    for (let [M, D] of Object.entries(q.modelUsage))
        if (_[M]) _[M] = {
            inputTokens: _[M].inputTokens + D.inputTokens,
            outputTokens: _[M].outputTokens + D.outputTokens,
            cacheReadInputTokens: _[M].cacheReadInputTokens + D.cacheReadInputTokens,
            cacheCreationInputTokens: _[M].cacheCreationInputTokens + D.cacheCreationInputTokens,
            webSearchRequests: _[M].webSearchRequests + D.webSearchRequests,
            costUSD: _[M].costUSD + D.costUSD,
            contextWindow: Math.max(_[M].contextWindow, D.contextWindow),
            maxOutputTokens: Math.max(_[M].maxOutputTokens, D.maxOutputTokens)
        };
        else _[M] = {
            ...D
        };
    let w = {
        ...A.hourCounts
    };
    for (let [M, D] of Object.entries(q.hourCounts)) {
        let X = parseInt(M, 10);
        w[X] = (w[X] || 0) + D
    }
    let O = A.totalSessions + q.sessionStats.length,
        $ = A.totalMessages + q.sessionStats.reduce((M, D) => M + D.messageCount, 0),
        H = A.longestSession;
    for (let M of q.sessionStats)
        if (!H || M.duration > H.duration) H = M;
    let j = A.firstSessionDate;
    for (let M of q.sessionStats)
        if (!j || M.timestamp < j) j = M.timestamp;
    return {
        version: Mh1,
        lastComputedDate: K,
        dailyActivity: Array.from(Y.values()).sort((M, D) => M.date.localeCompare(D.date)),
        dailyModelTokens: Array.from(z.entries()).map(([M, D]) => ({
            date: M,
            tokensByModel: D
        })).sort((M, D) => M.date.localeCompare(D.date)),
        modelUsage: _,
        totalSessions: O,
        totalMessages: $,
        longestSession: H,
        firstSessionDate: j,
        hourCounts: w,
        totalSpeculationTimeSavedMs: A.totalSpeculationTimeSavedMs + q.totalSpeculationTimeSavedMs
    }
}
// @from(Ln 427872, Col 0)
function ab(A) {
    let K = A.toISOString().split("T")[0];
    if (!K) throw Error("Invalid ISO date string");
    return K
}
// @from(Ln 427878, Col 0)
function n0q() {
    return ab(new Date)
}
// @from(Ln 427882, Col 0)
function r0q() {
    let A = new Date;
    return A.setDate(A.getDate() - 1), ab(A)
}
// @from(Ln 427887, Col 0)
function EN6(A, q) {
    return A < q
}
// @from(Ln 427890, Col 4)
Mh1 = 2
// @from(Ln 427891, Col 4)
f4z = "stats-cache.json"
// @from(Ln 427892, Col 4)
Jh1 = null
// @from(Ln 427893, Col 4)
_i8 = E(() => {
    A8();
    SA();
    H1();
    k1();
    g1();
    s8()
})
// @from(Ln 427908, Col 0)
async function Wh1(A, q = {}) {
    let {
        fromDate: K,
        toDate: Y
    } = q, z = $1(), _ = new Map, w = new Map, O = [], $ = new Map, H = 0, j = 0, J = {}, M = void 0, D = new Set, X = 20;
    for (let P = 0; P < A.length; P += X) {
        let W = A.slice(P, P + X),
            Z = await Promise.all(W.map(async (G) => {
                try {
                    if (K) {
                        let v = 0;
                        try {
                            let N = await z.stat(G),
                                V = ab(N.mtime);
                            if (EN6(V, K)) return {
                                sessionFile: G,
                                entries: null,
                                error: null,
                                skipped: !0
                            };
                            v = N.size
                        } catch {}
                        if (v > 65536) {
                            let N = await L4z(G);
                            if (N && EN6(N, K)) return {
                                sessionFile: G,
                                entries: null,
                                error: null,
                                skipped: !0
                            }
                        }
                    }
                    let f = await x$6(G);
                    return {
                        sessionFile: G,
                        entries: f,
                        error: null,
                        skipped: !1
                    }
                } catch (f) {
                    return {
                        sessionFile: G,
                        entries: null,
                        error: f,
                        skipped: !1
                    }
                }
            }));
        for (let {
                sessionFile: G,
                entries: f,
                error: v,
                skipped: N
            }
            of Z) {
            if (N) continue;
            if (v || !f) {
                k(`Failed to read session file ${G}: ${_1(v)}`);
                continue
            }
            let V = v4z(G, ".jsonl"),
                L = [];
            for (let U of f)
                if (Wl(U)) L.push(U);
                else if (U.type === "speculation-accept") j += U.timeSavedMs;
            if (L.length === 0) continue;
            let h = L.filter((U) => !U.isSidechain);
            if (h.length === 0) continue;
            let R = h[0],
                u = h[h.length - 1],
                I = new Date(R.timestamp),
                g = new Date(u.timestamp);
            if (isNaN(I.getTime()) || isNaN(g.getTime())) {
                k(`Skipping session with invalid timestamp: ${G}`);
                continue
            }
            let B = ab(I);
            if (K && EN6(B, K)) continue;
            if (Y && EN6(Y, B)) continue;
            let b = g.getTime() - I.getTime();
            O.push({
                sessionId: V,
                duration: b,
                messageCount: h.length,
                timestamp: R.timestamp
            }), H += h.length;
            let p = _.get(B) || {
                date: B,
                messageCount: 0,
                sessionCount: 0,
                toolCallCount: 0
            };
            p.sessionCount++, p.messageCount += h.length, _.set(B, p);
            let Q = I.getHours();
            $.set(Q, ($.get(Q) || 0) + 1);
            for (let U of h)
                if (U.type === "assistant") {
                    let r = U.message?.content;
                    if (Array.isArray(r)) {
                        for (let e of r)
                            if (e.type === "tool_use") {
                                let Y6 = _.get(B);
                                Y6.toolCallCount++
                            }
                    }
                    if (U.message?.usage) {
                        let e = U.message.usage,
                            Y6 = U.message.model || "unknown";
                        if (Y6 === $36) continue;
                        if (!J[Y6]) J[Y6] = {
                            inputTokens: 0,
                            outputTokens: 0,
                            cacheReadInputTokens: 0,
                            cacheCreationInputTokens: 0,
                            webSearchRequests: 0,
                            costUSD: 0,
                            contextWindow: 0,
                            maxOutputTokens: 0
                        };
                        J[Y6].inputTokens += e.input_tokens || 0, J[Y6].outputTokens += e.output_tokens || 0, J[Y6].cacheReadInputTokens += e.cache_read_input_tokens || 0, J[Y6].cacheCreationInputTokens += e.cache_creation_input_tokens || 0;
                        let H6 = (e.input_tokens || 0) + (e.output_tokens || 0);
                        if (H6 > 0) {
                            let J6 = w.get(B) || {};
                            J6[Y6] = (J6[Y6] || 0) + H6, w.set(B, J6)
                        }
                    }
                }
        }
    }
    return {
        dailyActivity: Array.from(_.values()).sort((P, W) => P.date.localeCompare(W.date)),
        dailyModelTokens: Array.from(w.entries()).map(([P, W]) => ({
            date: P,
            tokensByModel: W
        })).sort((P, W) => P.date.localeCompare(W.date)),
        modelUsage: J,
        sessionStats: O,
        hourCounts: Object.fromEntries($),
        totalMessages: H,
        totalSpeculationTimeSavedMs: j,
        ...{}
    }
}
// @from(Ln 428051, Col 0)
async function o0q() {
    let A = sb(),
        q = $1();
    try {
        await q.stat(A)
    } catch {
        return []
    }
    let Y = (await q.readdir(A)).filter((_) => _.isDirectory()).map((_) => Xh1(A, _.name));
    return (await Promise.all(Y.map(async (_) => {
        try {
            let w = await q.readdir(_),
                O = w.filter((j) => j.isFile() && j.name.endsWith(".jsonl")).map((j) => Xh1(_, j.name)),
                $ = w.filter((j) => j.isDirectory()),
                H = await Promise.all($.map(async (j) => {
                    let J = Xh1(_, j.name, "subagents");
                    try {
                        return (await q.readdir(J)).filter((D) => D.isFile() && D.name.endsWith(".jsonl") && D.name.startsWith("agent-")).map((D) => Xh1(J, D.name))
                    } catch {
                        return []
                    }
                }));
            return [...O, ...H.flat()]
        } catch (w) {
            return k(`Failed to read project directory ${_}: ${_1(w)}`), []
        }
    }))).flat()
}
// @from(Ln 428080, Col 0)
function N4z(A, q) {
    let K = new Map;
    for (let f of A.dailyActivity) K.set(f.date, {
        ...f
    });
    if (q)
        for (let f of q.dailyActivity) {
            let v = K.get(f.date);
            if (v) v.messageCount += f.messageCount, v.sessionCount += f.sessionCount, v.toolCallCount += f.toolCallCount;
            else K.set(f.date, {
                ...f
            })
        }
    let Y = new Map;
    for (let f of A.dailyModelTokens) Y.set(f.date, {
        ...f.tokensByModel
    });
    if (q)
        for (let f of q.dailyModelTokens) {
            let v = Y.get(f.date);
            if (v)
                for (let [N, V] of Object.entries(f.tokensByModel)) v[N] = (v[N] || 0) + V;
            else Y.set(f.date, {
                ...f.tokensByModel
            })
        }
    let z = {
        ...A.modelUsage
    };
    if (q)
        for (let [f, v] of Object.entries(q.modelUsage))
            if (z[f]) z[f] = {
                inputTokens: z[f].inputTokens + v.inputTokens,
                outputTokens: z[f].outputTokens + v.outputTokens,
                cacheReadInputTokens: z[f].cacheReadInputTokens + v.cacheReadInputTokens,
                cacheCreationInputTokens: z[f].cacheCreationInputTokens + v.cacheCreationInputTokens,
                webSearchRequests: z[f].webSearchRequests + v.webSearchRequests,
                costUSD: z[f].costUSD + v.costUSD,
                contextWindow: Math.max(z[f].contextWindow, v.contextWindow),
                maxOutputTokens: Math.max(z[f].maxOutputTokens, v.maxOutputTokens)
            };
            else z[f] = {
                ...v
            };
    let _ = new Map;
    for (let [f, v] of Object.entries(A.hourCounts)) _.set(parseInt(f, 10), v);
    if (q)
        for (let [f, v] of Object.entries(q.hourCounts)) {
            let N = parseInt(f, 10);
            _.set(N, (_.get(N) || 0) + v)
        }
    let w = Array.from(K.values()).sort((f, v) => f.date.localeCompare(v.date)),
        O = a0q(w),
        $ = Array.from(Y.entries()).map(([f, v]) => ({
            date: f,
            tokensByModel: v
        })).sort((f, v) => f.date.localeCompare(v.date)),
        H = A.totalSessions + (q?.sessionStats.length || 0),
        j = A.totalMessages + (q?.totalMessages || 0),
        J = A.longestSession;
    if (q) {
        for (let f of q.sessionStats)
            if (!J || f.duration > J.duration) J = f
    }
    let M = A.firstSessionDate,
        D = null;
    if (q)
        for (let f of q.sessionStats) {
            if (!M || f.timestamp < M) M = f.timestamp;
            if (!D || f.timestamp > D) D = f.timestamp
        }
    if (!D && w.length > 0) D = w[w.length - 1].date;
    let X = w.length > 0 ? w.reduce((f, v) => v.messageCount > f.messageCount ? v : f).date : null,
        P = _.size > 0 ? Array.from(_.entries()).reduce((f, [v, N]) => N > f[1] ? [v, N] : f)[0] : null,
        W = M && D ? Math.ceil((new Date(D).getTime() - new Date(M).getTime()) / 86400000) + 1 : 0,
        Z = A.totalSpeculationTimeSavedMs + (q?.totalSpeculationTimeSavedMs || 0);
    return {
        totalSessions: H,
        totalMessages: j,
        totalDays: W,
        activeDays: K.size,
        streaks: O,
        dailyActivity: w,
        dailyModelTokens: $,
        longestSession: J,
        modelUsage: z,
        firstSessionDate: M,
        lastSessionDate: D,
        peakActivityDay: X,
        peakActivityHour: P,
        totalSpeculationTimeSavedMs: Z
    }
}
// @from(Ln 428173, Col 0)
async function V4z() {
    let A = await o0q();
    if (A.length === 0) return s0q();
    let q = await c0q(async () => {
            let z = await i0q(),
                _ = r0q(),
                w = z;
            if (!z.lastComputedDate) {
                k("Stats cache empty, processing all historical data");
                let O = await Wh1(A, {
                    toDate: _
                });
                if (O.sessionStats.length > 0) w = zi8(z, O, _), await Dh1(w)
            } else if (EN6(z.lastComputedDate, _)) {
                let O = E4z(z.lastComputedDate);
                k(`Stats cache stale (${z.lastComputedDate}), processing ${O} to ${_}`);
                let $ = await Wh1(A, {
                    fromDate: O,
                    toDate: _
                });
                if ($.sessionStats.length > 0 || $.dailyActivity.length > 0) w = zi8(z, $, _), await Dh1(w);
                else w = {
                    ...z,
                    lastComputedDate: _
                }, await Dh1(w)
            }
            return w
        }),
        K = n0q(),
        Y = await Wh1(A, {
            fromDate: K,
            toDate: K
        });
    return N4z(q, Y)
}
// @from(Ln 428208, Col 0)
async function wi8(A) {
    if (A === "all") return V4z();
    let q = await o0q();
    if (q.length === 0) return s0q();
    let K = new Date,
        Y = A === "7d" ? 7 : 30,
        z = new Date(K);
    z.setDate(K.getDate() - Y + 1);
    let _ = ab(z),
        w = await Wh1(q, {
            fromDate: _
        });
    return k4z(w)
}
// @from(Ln 428223, Col 0)
function k4z(A) {
    let q = [...A.dailyActivity].sort((M, D) => M.date.localeCompare(D.date)),
        K = [...A.dailyModelTokens].sort((M, D) => M.date.localeCompare(D.date)),
        Y = a0q(q),
        z = null;
    for (let M of A.sessionStats)
        if (!z || M.duration > z.duration) z = M;
    let _ = null,
        w = null;
    for (let M of A.sessionStats) {
        if (!_ || M.timestamp < _) _ = M.timestamp;
        if (!w || M.timestamp > w) w = M.timestamp
    }
    let O = q.length > 0 ? q.reduce((M, D) => D.messageCount > M.messageCount ? D : M).date : null,
        $ = Object.entries(A.hourCounts),
        H = $.length > 0 ? parseInt($.reduce((M, [D, X]) => X > parseInt(M[1].toString()) ? [D, X] : M)[0], 10) : null,
        j = _ && w ? Math.ceil((new Date(w).getTime() - new Date(_).getTime()) / 86400000) + 1 : 0;
    return {
        totalSessions: A.sessionStats.length,
        totalMessages: A.totalMessages,
        totalDays: j,
        activeDays: A.dailyActivity.length,
        streaks: Y,
        dailyActivity: q,
        dailyModelTokens: K,
        longestSession: z,
        modelUsage: A.modelUsage,
        firstSessionDate: _,
        lastSessionDate: w,
        peakActivityDay: O,
        peakActivityHour: H,
        totalSpeculationTimeSavedMs: A.totalSpeculationTimeSavedMs
    }
}
// @from(Ln 428258, Col 0)
function E4z(A) {
    let q = new Date(A);
    return q.setDate(q.getDate() + 1), ab(q)
}
// @from(Ln 428263, Col 0)
function a0q(A) {
    if (A.length === 0) return {
        currentStreak: 0,
        longestStreak: 0,
        currentStreakStart: null,
        longestStreakStart: null,
        longestStreakEnd: null
    };
    let q = new Date;
    q.setHours(0, 0, 0, 0);
    let K = 0,
        Y = null,
        z = new Date(q),
        _ = new Set(A.map((H) => H.date));
    while (!0) {
        let H = ab(z);
        if (!_.has(H)) break;
        K++, Y = H, z.setDate(z.getDate() - 1)
    }
    let w = 0,
        O = null,
        $ = null;
    if (A.length > 0) {
        let H = Array.from(_).sort(),
            j = 1,
            J = H[0];
        for (let M = 1; M < H.length; M++) {
            let D = new Date(H[M - 1]),
                X = new Date(H[M]);
            if (Math.round((X.getTime() - D.getTime()) / 86400000) === 1) j++;
            else {
                if (j > w) w = j, O = J, $ = H[M - 1];
                j = 1, J = H[M]
            }
        }
        if (j > w) w = j, O = J, $ = H[H.length - 1]
    }
    return {
        currentStreak: K,
        longestStreak: w,
        currentStreakStart: Y,
        longestStreakStart: O,
        longestStreakEnd: $
    }
}
// @from(Ln 428308, Col 0)
async function L4z(A) {
    try {
        let q = await T4z(A, "r");
        try {
            let K = Buffer.allocUnsafe(4096),
                {
                    bytesRead: Y
                } = await q.read(K, 0, K.length, 0);
            if (Y === 0) return null;
            let z = K.toString("utf8", 0, Y),
                _ = z.lastIndexOf(`
`);
            if (_ < 0) return null;
            for (let w of z.slice(0, _).split(`
`)) {
                if (!w) continue;
                let O;
                try {
                    O = i1(w)
                } catch {
                    continue
                }
                if (typeof O.type !== "string") continue;
                if (!y4z.has(O.type)) continue;
                if (O.isSidechain === !0) continue;
                if (typeof O.timestamp !== "string") return null;
                let $ = new Date(O.timestamp);
                if (Number.isNaN($.getTime())) return null;
                return ab($)
            }
            return null
        } finally {
            await q.close()
        }
    } catch {
        return null
    }
}
// @from(Ln 428347, Col 0)
function s0q() {
    return {
        totalSessions: 0,
        totalMessages: 0,
        totalDays: 0,
        activeDays: 0,
        streaks: {
            currentStreak: 0,
            longestStreak: 0,
            currentStreakStart: null,
            longestStreakStart: null,
            longestStreakEnd: null
        },
        dailyActivity: [],
        dailyModelTokens: [],
        longestSession: null,
        modelUsage: {},
        firstSessionDate: null,
        lastSessionDate: null,
        peakActivityDay: null,
        peakActivityHour: null,
        totalSpeculationTimeSavedMs: 0
    }
}
// @from(Ln 428371, Col 4)
y4z
// @from(Ln 428372, Col 4)
t0q = E(() => {
    Oq();
    SA();
    K_();
    g1();
    H1();
    ZD6();
    _i8();
    JA();
    s8();
    y4z = new Set(["user", "assistant", "attachment", "system", "progress"])
})
// @from(Ln 428385, Col 0)
function R4z(A) {
    let q = A.map((K) => K.messageCount).filter((K) => K > 0).sort((K, Y) => K - Y);
    if (q.length === 0) return null;
    return {
        p25: q[Math.floor(q.length * 0.25)],
        p50: q[Math.floor(q.length * 0.5)],
        p75: q[Math.floor(q.length * 0.75)]
    }
}
// @from(Ln 428395, Col 0)
function Oi8(A, q = {}) {
    let {
        terminalWidth: K = 80,
        showMonthLabels: Y = !0
    } = q, z = 4, _ = K - 4, w = Math.min(52, Math.max(10, _)), O = new Map;
    for (let G of A) O.set(G.date, G);
    let $ = R4z(A),
        H = new Date;
    H.setHours(0, 0, 0, 0);
    let j = new Date(H);
    j.setDate(H.getDate() - H.getDay());
    let J = new Date(j);
    J.setDate(J.getDate() - (w - 1) * 7);
    let M = Array.from({
            length: 7
        }, () => Array(w).fill("")),
        D = [],
        X = -1,
        P = new Date(J);
    for (let G = 0; G < w; G++)
        for (let f = 0; f < 7; f++) {
            if (P > H) {
                M[f][G] = " ", P.setDate(P.getDate() + 1);
                continue
            }
            let v = ab(P),
                N = O.get(v);
            if (f === 0) {
                let L = P.getMonth();
                if (L !== X) D.push({
                    month: L,
                    week: G
                }), X = L
            }
            let V = h4z(N?.messageCount || 0, $);
            M[f][G] = S4z(V), P.setDate(P.getDate() + 1)
        }
    let W = [];
    if (Y) {
        let G = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            f = D.map((V) => V.month),
            v = Math.floor(w / Math.max(f.length, 1)),
            N = f.map((V) => G[V].padEnd(v)).join("");
        W.push("    " + N)
    }
    let Z = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let G = 0; G < 7; G++) {
        let v = ([1, 3, 5].includes(G) ? Z[G].padEnd(3) : "   ") + " " + M[G].join("");
        W.push(v)
    }
    return W.push(""), W.push("    Less " + [n16("░"), n16("▒"), n16("▓"), n16("█")].join(" ") + " More"), W.join(`
`)
}
// @from(Ln 428449, Col 0)
function h4z(A, q) {
    if (A === 0 || !q) return 0;
    if (A >= q.p75) return 4;
    if (A >= q.p50) return 3;
    if (A >= q.p25) return 2;
    return 1
}
// @from(Ln 428457, Col 0)
function S4z(A) {
    switch (A) {
        case 0:
            return O1.gray("·");
        case 1:
            return n16("░");
        case 2:
            return n16("▒");
        case 3:
            return n16("▓");
        case 4:
            return n16("█");
        default:
            return O1.gray("·")
    }
}
// @from(Ln 428473, Col 4)
n16
// @from(Ln 428474, Col 4)
e0q = E(() => {
    _i8();
    aK();
    n16 = O1.hex("#da7756")
})
// @from(Ln 428480, Col 0)
function SN(A) {
    if (kr6 === Ji.length) Ji.push(Ji.length + 1);
    let q = kr6;
    return kr6 = Ji[q], Ji[q] = A, q
}
// @from(Ln 428486, Col 0)
function rf(A) {
    return Ji[A]
}
// @from(Ln 428490, Col 0)
function C4z(A) {
    if (A < 132) return;
    Ji[A] = kr6, kr6 = A
}
// @from(Ln 428495, Col 0)
function Mi(A) {
    let q = rf(A);
    return C4z(A), q
}
// @from(Ln 428500, Col 0)
function Zh1() {
    if (Nr6 === null || Nr6.byteLength === 0) Nr6 = new Uint8Array(Qq.memory.buffer);
    return Nr6
}
// @from(Ln 428505, Col 0)
function Hi8(A, q, K) {
    if (K === void 0) {
        let O = Gh1.encode(A),
            $ = q(O.length, 1) >>> 0;
        return Zh1().subarray($, $ + O.length).set(O), Er6 = O.length, $
    }
    let Y = A.length,
        z = q(Y, 1) >>> 0,
        _ = Zh1(),
        w = 0;
    for (; w < Y; w++) {
        let O = A.charCodeAt(w);
        if (O > 127) break;
        _[z + w] = O
    }
    if (w !== Y) {
        if (w !== 0) A = A.slice(w);
        z = K(z, Y, Y = w + A.length * 3, 1) >>> 0;
        let O = Zh1().subarray(z + w, z + Y),
            $ = I4z(A, O);
        w += $.written, z = K(z, Y, w, 1) >>> 0
    }
    return Er6 = w, z
}
// @from(Ln 428530, Col 0)
function ji8(A) {
    return A === void 0 || A === null
}
// @from(Ln 428534, Col 0)
function rX() {
    if (Vr6 === null || Vr6.byteLength === 0) Vr6 = new Int32Array(Qq.memory.buffer);
    return Vr6
}
// @from(Ln 428539, Col 0)
function fh1(A, q) {
    return A = A >>> 0, KWq.decode(Zh1().subarray(A, A + q))
}
// @from(Ln 428543, Col 0)
function b4z(A, q) {
    if (!(A instanceof q)) throw Error(`expected instance of ${q.name}`);
    return A.ptr
}
// @from(Ln 428548, Col 0)
function x4z(A, q) {
    try {
        return A.apply(this, q)
    } catch (K) {
        Qq.__wbindgen_exn_store(SN(K))
    }
}
// @from(Ln 428555, Col 0)
async function g4z(A, q) {
    if (typeof Response === "function" && A instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === "function") try {
            return await WebAssembly.instantiateStreaming(A, q)
        } catch (Y) {
            if (A.headers.get("Content-Type") != "application/wasm") console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", Y);
            else throw Y
        }
        let K = await A.arrayBuffer();
        return await WebAssembly.instantiate(K, q)
    } else {
        let K = await WebAssembly.instantiate(A, q);
        if (K instanceof WebAssembly.Instance) return {
            instance: K,
            module: A
        };
        else return K
    }
}
// @from(Ln 428575, Col 0)
function F4z() {
    let A = {};
    return A.wbg = {}, A.wbg.__wbg_new_28c511d9baebfa89 = function(q, K) {
        let Y = Error(fh1(q, K));
        return SN(Y)
    }, A.wbg.__wbindgen_memory = function() {
        let q = Qq.memory;
        return SN(q)
    }, A.wbg.__wbg_buffer_12d079cc21e14bdb = function(q) {
        let K = rf(q).buffer;
        return SN(K)
    }, A.wbg.__wbg_newwithbyteoffsetandlength_aa4a17c33a06e5cb = function(q, K, Y) {
        let z = new Uint8Array(rf(q), K >>> 0, Y >>> 0);
        return SN(z)
    }, A.wbg.__wbindgen_object_drop_ref = function(q) {
        Mi(q)
    }, A.wbg.__wbg_new_63b92bc8671ed464 = function(q) {
        let K = new Uint8Array(rf(q));
        return SN(K)
    }, A.wbg.__wbg_values_839f3396d5aac002 = function(q) {
        let K = rf(q).values();
        return SN(K)
    }, A.wbg.__wbg_next_196c84450b364254 = function() {
        return x4z(function(q) {
            let K = rf(q).next();
            return SN(K)
        }, arguments)
    }, A.wbg.__wbg_done_298b57d23c0fc80c = function(q) {
        return rf(q).done
    }, A.wbg.__wbg_value_d93c65011f51a456 = function(q) {
        let K = rf(q).value;
        return SN(K)
    }, A.wbg.__wbg_instanceof_Uint8Array_2b3bbecd033d19f6 = function(q) {
        let K;
        try {
            K = rf(q) instanceof Uint8Array
        } catch (z) {
            K = !1
        }
        return K
    }, A.wbg.__wbindgen_string_get = function(q, K) {
        let Y = rf(K),
            z = typeof Y === "string" ? Y : void 0;
        var _ = ji8(z) ? 0 : Hi8(z, Qq.__wbindgen_malloc, Qq.__wbindgen_realloc),
            w = Er6;
        rX()[q / 4 + 1] = w, rX()[q / 4 + 0] = _
    }, A.wbg.__wbg_new_16b304a2cfa7ff4a = function() {
        return SN([])
    }, A.wbg.__wbindgen_string_new = function(q, K) {
        let Y = fh1(q, K);
        return SN(Y)
    }, A.wbg.__wbg_push_a5b05aedc7234f9f = function(q, K) {
        return rf(q).push(rf(K))
    }, A.wbg.__wbg_length_c20a40f15020d68a = function(q) {
        return rf(q).length
    }, A.wbg.__wbg_set_a47bac70306a19a7 = function(q, K, Y) {
        rf(q).set(rf(K), Y >>> 0)
    }, A.wbg.__wbindgen_throw = function(q, K) {
        throw Error(fh1(q, K))
    }, A
}
// @from(Ln 428637, Col 0)
function p4z(A, q) {}
// @from(Ln 428639, Col 0)
function Q4z(A, q) {
    return Qq = A.exports, YWq.__wbindgen_wasm_module = q, Vr6 = null, Nr6 = null, Qq
}
// @from(Ln 428642, Col 0)
async function YWq(A) {
    if (Qq !== void 0) return Qq;
    if (typeof A > "u") A = new URL("index_bg.wasm", void 0);
    let q = F4z();
    if (typeof A === "string" || typeof Request === "function" && A instanceof Request || typeof URL === "function" && A instanceof URL) A = fetch(A);
    p4z(q);
    let {
        instance: K,
        module: Y
    } = await g4z(await A, q);
    return Q4z(K, Y)
}
// @from(Ln 428655, Col 0)
function d4z(A) {
    return Object.prototype.hasOwnProperty.call(A, "fontBuffers")
}
// @from(Ln 428658, Col 4)
Qq
// @from(Ln 428658, Col 8)
Ji
// @from(Ln 428658, Col 12)
kr6
// @from(Ln 428658, Col 17)
Er6 = 0
// @from(Ln 428659, Col 4)
Nr6 = null
// @from(Ln 428660, Col 4)
Gh1
// @from(Ln 428660, Col 9)
I4z
// @from(Ln 428660, Col 14)
Vr6 = null
// @from(Ln 428661, Col 4)
KWq
// @from(Ln 428661, Col 9)
AWq
// @from(Ln 428661, Col 14)
$i8 = class A {
        static __wrap(q) {
            q = q >>> 0;
            let K = Object.create(A.prototype);
            return K.__wbg_ptr = q, AWq.register(K, K.__wbg_ptr, K), K
        }
        __destroy_into_raw() {
            let q = this.__wbg_ptr;
            return this.__wbg_ptr = 0, AWq.unregister(this), q
        }
        free() {
            let q = this.__destroy_into_raw();
            Qq.__wbg_bbox_free(q)
        }
        get x() {
            return Qq.__wbg_get_bbox_x(this.__wbg_ptr)
        }
        set x(q) {
            Qq.__wbg_set_bbox_x(this.__wbg_ptr, q)
        }
        get y() {
            return Qq.__wbg_get_bbox_y(this.__wbg_ptr)
        }
        set y(q) {
            Qq.__wbg_set_bbox_y(this.__wbg_ptr, q)
        }
        get width() {
            return Qq.__wbg_get_bbox_width(this.__wbg_ptr)
        }
        set width(q) {
            Qq.__wbg_set_bbox_width(this.__wbg_ptr, q)
        }
        get height() {
            return Qq.__wbg_get_bbox_height(this.__wbg_ptr)
        }
        set height(q) {
            Qq.__wbg_set_bbox_height(this.__wbg_ptr, q)
        }
    }
// @from(Ln 428700, Col 4)
qWq
// @from(Ln 428700, Col 9)
u4z = class A {
        static __wrap(q) {
            q = q >>> 0;
            let K = Object.create(A.prototype);
            return K.__wbg_ptr = q, qWq.register(K, K.__wbg_ptr, K), K
        }
        __destroy_into_raw() {
            let q = this.__wbg_ptr;
            return this.__wbg_ptr = 0, qWq.unregister(this), q
        }
        free() {
            let q = this.__destroy_into_raw();
            Qq.__wbg_renderedimage_free(q)
        }
        get width() {
            return Qq.renderedimage_width(this.__wbg_ptr) >>> 0
        }
        get height() {
            return Qq.renderedimage_height(this.__wbg_ptr) >>> 0
        }
        asPng() {
            try {
                let z = Qq.__wbindgen_add_to_stack_pointer(-16);
                Qq.renderedimage_asPng(z, this.__wbg_ptr);
                var q = rX()[z / 4 + 0],
                    K = rX()[z / 4 + 1],
                    Y = rX()[z / 4 + 2];
                if (Y) throw Mi(K);
                return Mi(q)
            } finally {
                Qq.__wbindgen_add_to_stack_pointer(16)
            }
        }
        get pixels() {
            let q = Qq.renderedimage_pixels(this.__wbg_ptr);
            return Mi(q)
        }
    }
// @from(Ln 428738, Col 4)
m4z
// @from(Ln 428738, Col 9)
B4z = class {
        __destroy_into_raw() {
            let A = this.__wbg_ptr;
            return this.__wbg_ptr = 0, m4z.unregister(this), A
        }
        free() {
            let A = this.__destroy_into_raw();
            Qq.__wbg_resvg_free(A)
        }
        constructor(A, q, K) {
            try {
                let $ = Qq.__wbindgen_add_to_stack_pointer(-16);
                var Y = ji8(q) ? 0 : Hi8(q, Qq.__wbindgen_malloc, Qq.__wbindgen_realloc),
                    z = Er6;
                Qq.resvg_new($, SN(A), Y, z, ji8(K) ? 0 : SN(K));
                var _ = rX()[$ / 4 + 0],
                    w = rX()[$ / 4 + 1],
                    O = rX()[$ / 4 + 2];
                if (O) throw Mi(w);
                return this.__wbg_ptr = _ >>> 0, this
            } finally {
                Qq.__wbindgen_add_to_stack_pointer(16)
            }
        }
        get width() {
            return Qq.resvg_width(this.__wbg_ptr)
        }
        get height() {
            return Qq.resvg_height(this.__wbg_ptr)
        }
        render() {
            try {
                let Y = Qq.__wbindgen_add_to_stack_pointer(-16);
                Qq.resvg_render(Y, this.__wbg_ptr);
                var A = rX()[Y / 4 + 0],
                    q = rX()[Y / 4 + 1],
                    K = rX()[Y / 4 + 2];
                if (K) throw Mi(q);
                return u4z.__wrap(A)
            } finally {
                Qq.__wbindgen_add_to_stack_pointer(16)
            }
        }
        toString() {
            let A, q;
            try {
                let z = Qq.__wbindgen_add_to_stack_pointer(-16);
                Qq.resvg_toString(z, this.__wbg_ptr);
                var K = rX()[z / 4 + 0],
                    Y = rX()[z / 4 + 1];
                return A = K, q = Y, fh1(K, Y)
            } finally {
                Qq.__wbindgen_add_to_stack_pointer(16), Qq.__wbindgen_free(A, q, 1)
            }
        }
        innerBBox() {
            let A = Qq.resvg_innerBBox(this.__wbg_ptr);
            return A === 0 ? void 0 : $i8.__wrap(A)
        }
        getBBox() {
            let A = Qq.resvg_getBBox(this.__wbg_ptr);
            return A === 0 ? void 0 : $i8.__wrap(A)
        }
        cropByBBox(A) {
            b4z(A, $i8), Qq.resvg_cropByBBox(this.__wbg_ptr, A.__wbg_ptr)
        }
        imagesToResolve() {
            try {
                let Y = Qq.__wbindgen_add_to_stack_pointer(-16);
                Qq.resvg_imagesToResolve(Y, this.__wbg_ptr);
                var A = rX()[Y / 4 + 0],
                    q = rX()[Y / 4 + 1],
                    K = rX()[Y / 4 + 2];
                if (K) throw Mi(q);
                return Mi(A)
            } finally {
                Qq.__wbindgen_add_to_stack_pointer(16)
            }
        }
        resolveImage(A, q) {
            try {
                let z = Qq.__wbindgen_add_to_stack_pointer(-16),
                    _ = Hi8(A, Qq.__wbindgen_malloc, Qq.__wbindgen_realloc),
                    w = Er6;
                Qq.resvg_resolveImage(z, this.__wbg_ptr, _, w, SN(q));
                var K = rX()[z / 4 + 0],
                    Y = rX()[z / 4 + 1];
                if (Y) throw Mi(K)
            } finally {
                Qq.__wbindgen_add_to_stack_pointer(16)
            }
        }
    }
// @from(Ln 428831, Col 4)
U4z
// @from(Ln 428831, Col 9)
Ji8 = !1
// @from(Ln 428832, Col 4)
Mi8 = async (A) => {
        if (Ji8) throw Error("Already initialized. The `initWasm()` function can be used only once.");
        await U4z(await A), Ji8 = !0
    }
// @from(Ln 428835, Col 7)
zWq
// @from(Ln 428836, Col 4)
_Wq = E(() => {
    Ji = Array(128).fill(void 0);
    Ji.push(void 0, null, !0, !1);
    kr6 = Ji.length;
    Gh1 = typeof TextEncoder < "u" ? new TextEncoder("utf-8") : {
        encode: () => {
            throw Error("TextEncoder not available")
        }
    }, I4z = typeof Gh1.encodeInto === "function" ? function(A, q) {
        return Gh1.encodeInto(A, q)
    } : function(A, q) {
        let K = Gh1.encode(A);
        return q.set(K), {
            read: A.length,
            written: K.length
        }
    };
    KWq = typeof TextDecoder < "u" ? new TextDecoder("utf-8", {
        ignoreBOM: !0,
        fatal: !0
    }) : {
        decode: () => {
            throw Error("TextDecoder not available")
        }
    };
    if (typeof TextDecoder < "u") KWq.decode();
    AWq = typeof FinalizationRegistry > "u" ? {
        register: () => {},
        unregister: () => {}
    } : new FinalizationRegistry((A) => Qq.__wbg_bbox_free(A >>> 0)), qWq = typeof FinalizationRegistry > "u" ? {
        register: () => {},
        unregister: () => {}
    } : new FinalizationRegistry((A) => Qq.__wbg_renderedimage_free(A >>> 0)), m4z = typeof FinalizationRegistry > "u" ? {
        register: () => {},
        unregister: () => {}
    } : new FinalizationRegistry((A) => Qq.__wbg_resvg_free(A >>> 0));
    U4z = YWq, zWq = class extends B4z {
        constructor(A, q) {
            if (!Ji8) throw Error("Wasm has not been initialized. Call `initWasm()` function.");
            let K = q?.font;
            if (!!K && d4z(K)) {
                let Y = {
                    ...q,
                    font: {
                        ...K,
                        fontBuffers: void 0
                    }
                };
                super(A, JSON.stringify(Y), K.fontBuffers)
            } else super(A, JSON.stringify(q))
        }
    }
})
// @from(Ln 428890, Col 0)
function c4z(A) {
    let q = [],
        K = A.split(`
`);
    for (let Y of K) {
        let z = [],
            _ = h_6,
            w = !1,
            O = 0;
        while (O < Y.length) {
            if (Y[O] === "\x1B" && Y[O + 1] === "[") {
                let j = O + 2;
                while (j < Y.length && !/[A-Za-z]/.test(Y[j])) j++;
                if (Y[j] === "m") {
                    let J = Y.slice(O + 2, j).split(";").map(Number),
                        M = 0;
                    while (M < J.length) {
                        let D = J[M];
                        if (D === 0) _ = h_6, w = !1;
                        else if (D === 1) w = !0;
                        else if (D >= 30 && D <= 37) _ = wWq[D] || h_6;
                        else if (D >= 90 && D <= 97) _ = wWq[D] || h_6;
                        else if (D === 39) _ = h_6;
                        else if (D === 38) {
                            if (J[M + 1] === 5 && J[M + 2] !== void 0) {
                                let X = J[M + 2];
                                _ = l4z(X), M += 2
                            } else if (J[M + 1] === 2 && J[M + 2] !== void 0 && J[M + 3] !== void 0 && J[M + 4] !== void 0) _ = {
                                r: J[M + 2],
                                g: J[M + 3],
                                b: J[M + 4]
                            }, M += 4
                        }
                        M++
                    }
                }
                O = j + 1;
                continue
            }
            let $ = O;
            while (O < Y.length && Y[O] !== "\x1B") O++;
            let H = Y.slice($, O);
            if (H) z.push({
                text: H,
                color: _,
                bold: w
            })
        }
        if (z.length === 0) z.push({
            text: "",
            color: h_6,
            bold: !1
        });
        q.push(z)
    }
    return q
}
// @from(Ln 428948, Col 0)
function l4z(A) {
    if (A < 16) return [{
        r: 0,
        g: 0,
        b: 0
    }, {
        r: 128,
        g: 0,
        b: 0
    }, {
        r: 0,
        g: 128,
        b: 0
    }, {
        r: 128,
        g: 128,
        b: 0
    }, {
        r: 0,
        g: 0,
        b: 128
    }, {
        r: 128,
        g: 0,
        b: 128
    }, {
        r: 0,
        g: 128,
        b: 128
    }, {
        r: 192,
        g: 192,
        b: 192
    }, {
        r: 128,
        g: 128,
        b: 128
    }, {
        r: 255,
        g: 0,
        b: 0
    }, {
        r: 0,
        g: 255,
        b: 0
    }, {
        r: 255,
        g: 255,
        b: 0
    }, {
        r: 0,
        g: 0,
        b: 255
    }, {
        r: 255,
        g: 0,
        b: 255
    }, {
        r: 0,
        g: 255,
        b: 255
    }, {
        r: 255,
        g: 255,
        b: 255
    }][A] || h_6;
    if (A < 232) {
        let K = A - 16,
            Y = Math.floor(K / 36),
            z = Math.floor(K % 36 / 6),
            _ = K % 6;
        return {
            r: Y === 0 ? 0 : 55 + Y * 40,
            g: z === 0 ? 0 : 55 + z * 40,
            b: _ === 0 ? 0 : 55 + _ * 40
        }
    }
    let q = (A - 232) * 10 + 8;
    return {
        r: q,
        g: q,
        b: q
    }
}
// @from(Ln 429033, Col 0)
function i4z(A) {
    return A.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;")
}
// @from(Ln 429037, Col 0)
function OWq(A, q = {}) {
    let {
        fontFamily: K = "Menlo, Monaco, monospace",
        fontSize: Y = 14,
        lineHeight: z = 22,
        paddingX: _ = 24,
        paddingY: w = 24,
        backgroundColor: O = `rgb(${Di8.r}, ${Di8.g}, ${Di8.b})`,
        borderRadius: $ = 8
    } = q, H = c4z(A);
    while (H.length > 0 && H[H.length - 1].every((P) => P.text.trim() === "")) H.pop();
    let j = Y * 0.6,
        J = Math.max(...H.map((P) => P.reduce((W, Z) => W + Z.text.length, 0))),
        M = Math.ceil(J * j + _ * 2),
        D = H.length * z + w * 2,
        X = `<svg xmlns="http://www.w3.org/2000/svg" width="${M}" height="${D}" viewBox="0 0 ${M} ${D}">
`;
    X += `  <rect width="100%" height="100%" fill="${O}" rx="${$}" ry="${$}"/>
`, X += `  <style>
`, X += `    text { font-family: ${K}; font-size: ${Y}px; white-space: pre; }
`, X += `    .b { font-weight: bold; }
`, X += `  </style>
`;
    for (let P = 0; P < H.length; P++) {
        let W = H[P],
            Z = w + (P + 1) * z - (z - Y) / 2;
        X += `  <text x="${_}" y="${Z}" xml:space="preserve">`;
        for (let G of W) {
            if (!G.text) continue;
            let f = `rgb(${G.color.r}, ${G.color.g}, ${G.color.b})`,
                v = G.bold ? ' class="b"' : "";
            X += `<tspan fill="${f}"${v}>${i4z(G.text)}</tspan>`
        }
        X += `</text>
`
    }
    return X += "</svg>", X
}
// @from(Ln 429075, Col 4)
wWq
// @from(Ln 429075, Col 9)
h_6
// @from(Ln 429075, Col 14)
Di8
// @from(Ln 429076, Col 4)
$Wq = E(() => {
    wWq = {
        30: {
            r: 0,
            g: 0,
            b: 0
        },
        31: {
            r: 205,
            g: 49,
            b: 49
        },
        32: {
            r: 13,
            g: 188,
            b: 121
        },
        33: {
            r: 229,
            g: 229,
            b: 16
        },
        34: {
            r: 36,
            g: 114,
            b: 200
        },
        35: {
            r: 188,
            g: 63,
            b: 188
        },
        36: {
            r: 17,
            g: 168,
            b: 205
        },
        37: {
            r: 229,
            g: 229,
            b: 229
        },
        90: {
            r: 102,
            g: 102,
            b: 102
        },
        91: {
            r: 241,
            g: 76,
            b: 76
        },
        92: {
            r: 35,
            g: 209,
            b: 139
        },
        93: {
            r: 245,
            g: 245,
            b: 67
        },
        94: {
            r: 59,
            g: 142,
            b: 234
        },
        95: {
            r: 214,
            g: 112,
            b: 214
        },
        96: {
            r: 41,
            g: 184,
            b: 219
        },
        97: {
            r: 255,
            g: 255,
            b: 255
        }
    }, h_6 = {
        r: 229,
        g: 229,
        b: 229
    }, Di8 = {
        r: 30,
        g: 30,
        b: 30
    }
})
// @from(Ln 429185, Col 0)
function t4z() {
    let A = HWq(s4z(import.meta.url));
    return Pi8(HWq(gb8()), "resvg.wasm")
}
// @from(Ln 429190, Col 0)
function e4z() {
    if (!rY() || typeof Bun > "u" || !Bun.embeddedFiles) return null;
    for (let A of Bun.embeddedFiles) {
        let q = A.name;
        if (q && q.endsWith("resvg.wasm")) return A
    }
    return null
}
// @from(Ln 429198, Col 0)
async function Aqz() {
    if (Xi8) return;
    if (rY()) {
        let K = e4z();
        if (K) {
            let Y = await K.arrayBuffer();
            await Mi8(new Uint8Array(Y)), Xi8 = !0;
            return
        }
    }
    let A = t4z(),
        q = await jWq(A);
    await Mi8(q), Xi8 = !0
}
// @from(Ln 429212, Col 0)
async function qqz() {
    if (Th1) return [Th1];
    let A = y8(),
        q = [];
    if (A === "macos") q.push("/System/Library/Fonts/Menlo.ttc", "/System/Library/Fonts/Monaco.dfont", "/Library/Fonts/Courier New.ttf");
    else if (A === "linux") q.push("/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf", "/usr/share/fonts/TTF/DejaVuSansMono.ttf", "/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf", "/usr/share/fonts/truetype/ubuntu/UbuntuMono-R.ttf");
    else if (A === "windows") q.push("C:\\Windows\\Fonts\\consola.ttf", "C:\\Windows\\Fonts\\cour.ttf");
    for (let K of q) try {
        return Th1 = await jWq(K), [Th1]
    } catch {}
    return []
}
// @from(Ln 429224, Col 0)
async function JWq(A, q) {
    if (!rY()) return {
        success: !1,
        message: "Screenshot copying is not available in this build"
    };
    try {
        await Aqz();
        let K = Pi8(a4z(), "claude-code-screenshots");
        await o4z(K, {
            recursive: !0
        });
        let Y = Date.now(),
            z = OWq(A, q),
            _ = Pi8(K, `screenshot-${Y}.png`),
            w = await qqz(),
            H = new zWq(z, {
                fitTo: {
                    mode: "zoom",
                    value: 4
                },
                font: {
                    fontBuffers: w,
                    defaultFontFamily: "Menlo",
                    monospaceFamily: "Menlo"
                }
            }).render().asPng();
        await n4z(_, H);
        let j = await Kqz(_);
        try {
            await r4z(_)
        } catch {}
        return j
    } catch (K) {
        return _6(K), {
            success: !1,
            message: `Failed to copy screenshot: ${K instanceof Error?K.message:"Unknown error"}`
        }
    }
}
// @from(Ln 429263, Col 0)
async function Kqz(A) {
    let q = y8();
    if (q === "macos") {
        let Y = `set the clipboard to (read (POSIX file "${A.replace(/\\/g,"\\\\").replace(/"/g,"\\\"")}") as «class PNGf»)`,
            z = await RA("osascript", ["-e", Y], {
                timeout: 5000
            });
        if (z.code === 0) return {
            success: !0,
            message: "Screenshot copied to clipboard"
        };
        return {
            success: !1,
            message: `Failed to copy to clipboard: ${z.stderr}`
        }
    }
    if (q === "linux") {
        if ((await RA("xclip", ["-selection", "clipboard", "-t", "image/png", "-i", A], {
                timeout: 5000
            })).code === 0) return {
            success: !0,
            message: "Screenshot copied to clipboard"
        };
        if ((await RA("xsel", ["--clipboard", "--input", "--type", "image/png"], {
                timeout: 5000
            })).code === 0) return {
            success: !0,
            message: "Screenshot copied to clipboard"
        };
        return {
            success: !1,
            message: "Failed to copy to clipboard. Please install xclip or xsel: sudo apt install xclip"
        }
    }
    if (q === "windows") {
        let K = `Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Clipboard]::SetImage([System.Drawing.Image]::FromFile('${A.replace(/'/g,"''")}'))`,
            Y = await RA("powershell", ["-NoProfile", "-Command", K], {
                timeout: 5000
            });
        if (Y.code === 0) return {
            success: !0,
            message: "Screenshot copied to clipboard"
        };
        return {
            success: !1,
            message: `Failed to copy to clipboard: ${Y.stderr}`
        }
    }
    return {
        success: !1,
        message: `Screenshot to clipboard is not supported on ${q}`
    }
}
// @from(Ln 429316, Col 4)
Xi8 = !1
// @from(Ln 429317, Col 4)
Th1 = null
// @from(Ln 429318, Col 4)
MWq = E(() => {
    _Wq();
    YK();
    $Wq();
    k1();
    Eq();
    tc()
})
// @from(Ln 429327, Col 0)
function zqz(A) {
    return new Date(A).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
    })
}
// @from(Ln 429334, Col 0)
function _qz(A) {
    let q = vh1.indexOf(A);
    return vh1[(q + 1) % vh1.length]
}
// @from(Ln 429339, Col 0)
function wqz() {
    return wi8("all").then((A) => {
        if (!A || A.totalSessions === 0) return {
            type: "empty"
        };
        return {
            type: "success",
            data: A
        }
    }).catch((A) => {
        return {
            type: "error",
            message: A instanceof Error ? A.message : "Failed to load stats"
        }
    })
}
// @from(Ln 429356, Col 0)
function WWq(A) {
    let q = A6(4),
        {
            onClose: K
        } = A,
        Y;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) Y = wqz(), q[0] = Y;
    else Y = q[0];
    let z = Y,
        _;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) _ = DA.default.createElement(m, {
        marginTop: 1
    }, DA.default.createElement(Wq, null), DA.default.createElement(T, null, " Loading your Claude Code stats…")), q[1] = _;
    else _ = q[1];
    let w;
    if (q[2] !== K) w = DA.default.createElement(of.Suspense, {
        fallback: _
    }, DA.default.createElement(Oqz, {
        allTimePromise: z,
        onClose: K
    })), q[2] = K, q[3] = w;
    else w = q[3];
    return w
}
// @from(Ln 429381, Col 0)
function Oqz(A) {
    let q = A6(36),
        {
            allTimePromise: K,
            onClose: Y
        } = A,
        z = of.use(K),
        [_, w] = of.useState("all"),
        O;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) O = {}, q[0] = O;
    else O = q[0];
    let [$, H] = of.useState(O), [j, J] = of.useState(!1), [M, D] = of.useState("Overview"), [X, P] = of.useState(null), W, Z;
    if (q[1] !== _ || q[2] !== $) W = () => {
        if (_ === "all") return;
        if ($[_]) return;
        let b = !1;
        return J(!0), wi8(_).then((p) => {
            if (!b) H((Q) => ({
                ...Q,
                [_]: p
            })), J(!1)
        }).catch(() => {
            if (!b) J(!1)
        }), () => {
            b = !0
        }
    }, Z = [_, $], q[1] = _, q[2] = $, q[3] = W, q[4] = Z;
    else W = q[3], Z = q[4];
    of.useEffect(W, Z);
    let G = _ === "all" ? z.type === "success" ? z.data : null : $[_] ?? (z.type === "success" ? z.data : null),
        f = z.type === "success" ? z.data : null,
        v;
    if (q[5] !== Y) v = () => {
        Y("Stats dialog dismissed", {
            display: "system"
        })
    }, q[5] = Y, q[6] = v;
    else v = q[6];
    let N = v,
        V;
    if (q[7] === Symbol.for("react.memo_cache_sentinel")) V = {
        context: "Confirmation"
    }, q[7] = V;
    else V = q[7];
    D8("confirm:no", N, V);
    let L;
    if (q[8] !== M || q[9] !== _ || q[10] !== G || q[11] !== Y) L = (b, p) => {
        if (p.ctrl && (b === "c" || b === "d")) Y("Stats dialog dismissed", {
            display: "system"
        });
        if (p.tab) D($qz);
        if (b === "r" && !p.ctrl && !p.meta) w(_qz(_));
        if (rY() && p.ctrl && b === "s" && G) fqz(G, M, P)
    }, q[8] = M, q[9] = _, q[10] = G, q[11] = Y, q[12] = L;
    else L = q[12];
    if (jA(L), z.type === "error") {
        let b;
        if (q[13] !== z.message) b = DA.default.createElement(m, {
            marginTop: 1
        }, DA.default.createElement(T, {
            color: "error"
        }, "Failed to load stats: ", z.message)), q[13] = z.message, q[14] = b;
        else b = q[14];
        return b
    }
    if (z.type === "empty") {
        let b;
        if (q[15] === Symbol.for("react.memo_cache_sentinel")) b = DA.default.createElement(m, {
            marginTop: 1
        }, DA.default.createElement(T, {
            color: "warning"
        }, "No stats available yet. Start using Claude Code!")), q[15] = b;
        else b = q[15];
        return b
    }
    if (!G || !f) {
        let b;
        if (q[16] === Symbol.for("react.memo_cache_sentinel")) b = DA.default.createElement(m, {
            marginTop: 1
        }, DA.default.createElement(Wq, null), DA.default.createElement(T, null, " Loading stats…")), q[16] = b;
        else b = q[16];
        return b
    }
    let h;
    if (q[17] !== f || q[18] !== _ || q[19] !== G || q[20] !== j) h = DA.default.createElement(Hw, {
        title: "Overview"
    }, DA.default.createElement(Hqz, {
        stats: G,
        allTimeStats: f,
        dateRange: _,
        isLoading: j
    })), q[17] = f, q[18] = _, q[19] = G, q[20] = j, q[21] = h;
    else h = q[21];
    let R;
    if (q[22] !== _ || q[23] !== G || q[24] !== j) R = DA.default.createElement(Hw, {
        title: "Models"
    }, DA.default.createElement(Mqz, {
        stats: G,
        dateRange: _,
        isLoading: j
    })), q[22] = _, q[23] = G, q[24] = j, q[25] = R;
    else R = q[25];
    let u;
    if (q[26] !== h || q[27] !== R) u = DA.default.createElement(m, {
        flexDirection: "row",
        gap: 1,
        marginBottom: 1
    }, DA.default.createElement(Gh, {
        title: "",
        color: "claude",
        defaultTab: "Overview"
    }, h, R)), q[26] = h, q[27] = R, q[28] = u;
    else u = q[28];
    let I;
    if (q[29] !== X) I = rY() && DA.default.createElement(DA.default.Fragment, null, " · ctrl+s to copy", X ? ` · ${X}` : ""), q[29] = X, q[30] = I;
    else I = q[30];
    let g;
    if (q[31] !== I) g = DA.default.createElement(m, {
        paddingLeft: 2
    }, DA.default.createElement(T, {
        dimColor: !0
    }, "Esc to cancel · r to cycle dates", I)), q[31] = I, q[32] = g;
    else g = q[32];
    let B;
    if (q[33] !== g || q[34] !== u) B = DA.default.createElement(S3, {
        color: "claude"
    }, u, g), q[33] = g, q[34] = u, q[35] = B;
    else B = q[35];
    return B
}
// @from(Ln 429512, Col 0)
function $qz(A) {
    return A === "Overview" ? "Models" : "Overview"
}