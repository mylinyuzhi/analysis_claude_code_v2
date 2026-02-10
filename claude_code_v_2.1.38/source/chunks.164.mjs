
// @from(Ln 422566, Col 0)
function C2q(A) {
    let q = e(188),
        {
            toolNames: K,
            onExit: Y
        } = A,
        z;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) z = [], q[0] = z;
    else z = q[0];
    let [w, H] = iI.useState(z), $;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) $ = {
        mode: "select-event"
    }, q[1] = $;
    else $ = q[1];
    let [O, _] = iI.useState($), [J, X] = iI.useState(g4z), [D, j] = iI.useState(Q4z), M;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) M = (G6) => {
        if (G6 === "policySettings") {
            let OA = C8()?.disableAllHooks === !0;
            X(OA && y7("policySettings")?.disableAllHooks === !0), j(y7("policySettings")?.allowManagedHooksOnly === !0)
        }
    }, q[2] = M;
    else M = q[2];
    bD1(M);
    let [P, W] = iI.useState(""), [G, f] = iI.useState(""), Z = O.mode, N = "event" in O ? O.event : "PreToolUse", T = "matcher" in O ? O.matcher : null, k = v6(F4z), y = B_(), B;
    if (q[3] !== k.tools || q[4] !== K) B = [...K, ...k.tools.map(m4z)], q[3] = k.tools, q[4] = K, q[5] = B;
    else B = q[5];
    let S = B,
        m;
    if (q[6] !== y || q[7] !== S) m = () => CN6(y.getState(), S), q[6] = y, q[7] = S, q[8] = m;
    else m = q[8];
    let [b, g] = iI.useState(m), U, x;
    if (q[9] !== y || q[10] !== S) U = () => {
        g(CN6(y.getState(), S))
    }, x = [S, y], q[9] = y, q[10] = S, q[11] = U, q[12] = x;
    else U = q[11], x = q[12];
    iI.useEffect(U, x);
    let p;
    if (q[13] !== y || q[14] !== S) p = () => {
        g(CN6(y.getState(), S))
    }, q[13] = y, q[14] = S, q[15] = p;
    else p = q[15];
    let l = p,
        r;
    if (q[16] !== b || q[17] !== N) r = k2q(b, N), q[16] = b, q[17] = N, q[18] = r;
    else r = q[18];
    let s = r,
        O1;
    if (q[19] !== b || q[20] !== N || q[21] !== T) O1 = L2q(b, N, T), q[19] = b, q[20] = N, q[21] = T, q[22] = O1;
    else O1 = q[22];
    let T1 = O1,
        N1;
    if (q[23] !== w || q[24] !== Y) N1 = () => {
        if (w.length > 0) Y(w.join(`
`));
        else Y("Hooks dialog dismissed", {
            display: "system"
        })
    }, q[23] = w, q[24] = Y, q[25] = N1;
    else N1 = q[25];
    let j1 = Z === "select-event",
        q1;
    if (q[26] !== j1) q1 = {
        context: "Confirmation",
        isActive: j1
    }, q[26] = j1, q[27] = q1;
    else q1 = q[27];
    DA("confirm:no", N1, q1);
    let t;
    if (q[28] === Symbol.for("react.memo_cache_sentinel")) t = () => {
        _({
            mode: "select-event"
        })
    }, q[28] = t;
    else t = q[28];
    let J1 = Z === "select-matcher",
        D1;
    if (q[29] !== J1) D1 = {
        context: "Confirmation",
        isActive: J1
    }, q[29] = J1, q[30] = D1;
    else D1 = q[30];
    DA("confirm:no", t, D1);
    let Z1;
    if (q[31] !== O) Z1 = () => {
        if ("event" in O && "matcherMetadata" in O) _({
            mode: "select-matcher",
            event: O.event,
            matcherMetadata: O.matcherMetadata
        });
        f("")
    }, q[31] = O, q[32] = Z1;
    else Z1 = q[32];
    let E1 = Z === "add-matcher",
        a;
    if (q[33] !== E1) a = {
        context: "Confirmation",
        isActive: E1
    }, q[33] = E1, q[34] = a;
    else a = q[34];
    DA("confirm:no", Z1, a);
    let A1;
    if (q[35] !== O) A1 = () => {
        if ("event" in O && "matcherMetadata" in O) _({
            mode: "select-matcher",
            event: O.event,
            matcherMetadata: O.matcherMetadata
        })
    }, q[35] = O, q[36] = A1;
    else A1 = q[36];
    let M1 = Z === "delete-matcher",
        z1;
    if (q[37] !== M1) z1 = {
        context: "Confirmation",
        isActive: M1
    }, q[37] = M1, q[38] = z1;
    else z1 = q[38];
    DA("confirm:no", A1, z1);
    let Y1;
    if (q[39] !== S || q[40] !== O) Y1 = () => {
        if ("event" in O) {
            let G6 = Ce(O.event, S);
            if (G6 !== void 0) _({
                mode: "select-matcher",
                event: O.event,
                matcherMetadata: G6
            });
            else _({
                mode: "select-event"
            })
        }
    }, q[39] = S, q[40] = O, q[41] = Y1;
    else Y1 = q[41];
    let _1 = Z === "select-hook",
        $1;
    if (q[42] !== _1) $1 = {
        context: "Confirmation",
        isActive: _1
    }, q[42] = _1, q[43] = $1;
    else $1 = q[43];
    DA("confirm:no", Y1, $1);
    let G1;
    if (q[44] !== O) G1 = () => {
        if ("event" in O && "matcher" in O) _({
            mode: "select-hook",
            event: O.event,
            matcher: O.matcher
        });
        W("")
    }, q[44] = O, q[45] = G1;
    else G1 = q[45];
    let L1 = Z === "add-hook",
        x1;
    if (q[46] !== L1) x1 = {
        context: "Confirmation",
        isActive: L1
    }, q[46] = L1, q[47] = x1;
    else x1 = q[47];
    DA("confirm:no", G1, x1);
    let f1;
    if (q[48] !== O) f1 = () => {
        if ("event" in O && O.mode === "delete-hook") {
            let {
                hook: G6
            } = O;
            _({
                mode: "select-hook",
                event: O.event,
                matcher: G6.matcher || ""
            })
        }
    }, q[48] = O, q[49] = f1;
    else f1 = q[49];
    let R1 = Z === "delete-hook",
        H1;
    if (q[50] !== R1) H1 = {
        context: "Confirmation",
        isActive: R1
    }, q[50] = R1, q[51] = H1;
    else H1 = q[51];
    DA("confirm:no", f1, H1);
    let y1;
    if (q[52] !== S || q[53] !== P || q[54] !== Z || q[55] !== O || q[56] !== G) y1 = (G6, L6) => {
        if (Z === "save-hook") return;
        A: switch (Z) {
            case "add-matcher": {
                if (L6.return && G.trim() && "event" in O) _({
                    mode: "select-hook",
                    event: O.event,
                    matcher: G.trim()
                });
                break A
            }
            case "add-hook": {
                if (L6.return && P.trim() && "event" in O && "matcher" in O) {
                    let OA = {
                        event: O.event,
                        config: {
                            type: "command",
                            command: P.trim()
                        },
                        matcher: Ce(O.event, S) !== void 0 ? O.matcher : ""
                    };
                    _({
                        mode: "save-hook",
                        event: O.event,
                        hookToSave: OA
                    })
                }
                break A
            }
            case "select-event":
            case "delete-matcher":
            case "delete-hook":
            case "select-matcher":
            case "select-hook":
        }
    }, q[52] = S, q[53] = P, q[54] = Z, q[55] = O, q[56] = G, q[57] = y1;
    else y1 = q[57];
    D8(y1);
    let B1;
    if (q[58] !== O || q[59] !== l) B1 = () => {
        if (O.mode === "save-hook") {
            let {
                hookToSave: G6
            } = O;
            H((L6) => [...L6, `Added ${G6.event} hook: ${H6.bold(MZ(G6.config))}`]), _({
                mode: "select-hook",
                event: G6.event,
                matcher: G6.matcher
            })
        }
        W(""), GO(), l()
    }, q[58] = O, q[59] = l, q[60] = B1;
    else B1 = q[60];
    let A6 = B1,
        O6;
    if (q[61] !== O) O6 = () => {
        if (O.mode === "save-hook") {
            let {
                hookToSave: G6
            } = O;
            _({
                mode: "select-hook",
                event: G6.event,
                matcher: G6.matcher
            })
        }
        W("")
    }, q[61] = O, q[62] = O6;
    else O6 = q[62];
    let P6 = O6,
        V6;
    if (q[63] !== S || q[64] !== b || q[65] !== O || q[66] !== l) V6 = async () => {
        if (O.mode !== "delete-hook") return;
        let {
            hook: G6,
            event: L6
        } = O;
        await Bk7(G6), c("tengu_hook_deleted", {
            event: G6.event,
            source: G6.source,
            has_matcher: G6.matcher ? 1 : 0
        }), H((lA) => [...lA, `Deleted ${G6.event} hook: ${H6.bold(MZ(G6.config))}`]), GO(), l();
        let OA = G6.matcher || "",
            bA = b[L6]?.[OA]?.filter((lA) => !nD1(lA.config, G6.config));
        if (!bA || bA.length === 0) {
            let lA = Ce(L6, S);
            if (lA !== void 0) _({
                mode: "select-matcher",
                event: L6,
                matcherMetadata: lA
            });
            else _({
                mode: "select-event"
            })
        } else _({
            mode: "select-hook",
            event: L6,
            matcher: OA
        })
    }, q[63] = S, q[64] = b, q[65] = O, q[66] = l, q[67] = V6;
    else V6 = q[67];
    let q6 = V6,
        p1;
    if (q[68] !== O) p1 = () => {
        if (O.mode === "delete-matcher") {
            let {
                matcher: G6,
                event: L6
            } = O;
            H((OA) => [...OA, `Deleted matcher: ${H6.bold(G6)}`]), _({
                mode: "select-matcher",
                event: L6,
                matcherMetadata: O.matcherMetadata
            })
        }
    }, q[68] = O, q[69] = p1;
    else p1 = q[69];
    let K6 = p1,
        j6;
    if (q[70] !== S) j6 = Md1(S), q[70] = S, q[71] = j6;
    else j6 = q[71];
    let M6 = j6,
        N6;
    if (q[72] === Symbol.for("react.memo_cache_sentinel")) N6 = gk7(), q[72] = N6;
    else N6 = q[72];
    let F6 = N6,
        P1;
    if (q[73] === Symbol.for("react.memo_cache_sentinel")) P1 = [], q[73] = P1;
    else P1 = q[73];
    iI.useEffect(B4z, P1);
    let o1 = C8()?.disableAllHooks === !0,
        _6;
    if (q[74] !== w || q[75] !== Y) _6 = () => {
        Y(w.length > 0 ? w.join(`
`) : "Hooks dialog dismissed", {
            display: w.length === 0 ? "system" : void 0
        })
    }, q[74] = w, q[75] = Y, q[76] = _6;
    else _6 = q[76];
    let z6 = _6,
        w6;
    if (q[77] !== b) w6 = Object.values(b).reduce(b4z, 0), q[77] = b, q[78] = w6;
    else w6 = q[78];
    let r6 = w6;
    if (o1) {
        let G6;
        if (q[79] === Symbol.for("react.memo_cache_sentinel")) G6 = U3.createElement(V, {
            bold: !0
        }, "disabled"), q[79] = G6;
        else G6 = q[79];
        let L6 = J && " by a managed settings file",
            OA;
        if (q[80] !== r6) OA = U3.createElement(V, {
            bold: !0
        }, r6), q[80] = r6, q[81] = OA;
        else OA = q[81];
        let bA = r6 !== 1 ? "s" : "",
            lA = r6 !== 1 ? "are" : "is",
            E7;
        if (q[82] !== L6 || q[83] !== OA || q[84] !== bA || q[85] !== lA) E7 = U3.createElement(V, null, "All hooks are currently ", G6, L6, ". You have", " ", OA, " configured hook", bA, " that", " ", lA, " not running."), q[82] = L6, q[83] = OA, q[84] = bA, q[85] = lA, q[86] = E7;
        else E7 = q[86];
        let V4, RA, O7, tK;
        if (q[87] === Symbol.for("react.memo_cache_sentinel")) V4 = U3.createElement(I, {
            marginTop: 1
        }, U3.createElement(V, {
            dimColor: !0
        }, "When hooks are disabled:")), RA = U3.createElement(V, {
            dimColor: !0
        }, "• No hook commands will execute"), O7 = U3.createElement(V, {
            dimColor: !0
        }, "• StatusLine will not be displayed"), tK = U3.createElement(V, {
            dimColor: !0
        }, "• Tool operations will proceed without hook validation"), q[87] = V4, q[88] = RA, q[89] = O7, q[90] = tK;
        else V4 = q[87], RA = q[88], O7 = q[89], tK = q[90];
        let gq;
        if (q[91] !== E7) gq = U3.createElement(I, {
            flexDirection: "column"
        }, E7, V4, RA, O7, tK), q[91] = E7, q[92] = gq;
        else gq = q[92];
        let xq;
        if (q[93] !== J || q[94] !== z6 || q[95] !== Y) xq = !J && U3.createElement(I, {
            flexDirection: "column"
        }, U3.createElement(V, {
            bold: !0
        }, "Options:"), U3.createElement(kA, {
            options: [{
                label: "Re-enable all hooks",
                value: "enable"
            }, {
                label: "Exit",
                value: "exit"
            }],
            onChange: (O3) => {
                if (O3 === "enable") Z7("localSettings", {
                    disableAllHooks: !1
                }), Y("Re-enabled all hooks");
                else z6()
            },
            onCancel: z6
        })), q[93] = J, q[94] = z6, q[95] = Y, q[96] = xq;
        else xq = q[96];
        let U8;
        if (q[97] !== gq || q[98] !== xq) U8 = U3.createElement(I, {
            flexDirection: "column",
            gap: 1
        }, gq, xq), q[97] = gq, q[98] = xq, q[99] = U8;
        else U8 = q[99];
        let R4;
        if (q[100] !== J || q[101] !== z6 || q[102] !== U8) R4 = U3.createElement(w8, {
            title: "Hook Configuration - Disabled",
            onCancel: z6,
            borderDimColor: !1,
            hideInputGuide: J
        }, U8), q[100] = J, q[101] = z6, q[102] = U8, q[103] = R4;
        else R4 = q[103];
        return R4
    }
    switch (O.mode) {
        case "save-hook": {
            let G6 = M6[O.hookToSave.event],
                L6;
            if (q[104] !== P6 || q[105] !== A6 || q[106] !== O.hookToSave.config || q[107] !== O.hookToSave.event || q[108] !== O.hookToSave.matcher || q[109] !== G6.summary) L6 = U3.createElement(_2q, {
                event: O.hookToSave.event,
                eventSummary: G6.summary,
                config: O.hookToSave.config,
                matcher: O.hookToSave.matcher,
                onSuccess: A6,
                onCancel: P6
            }), q[104] = P6, q[105] = A6, q[106] = O.hookToSave.config, q[107] = O.hookToSave.event, q[108] = O.hookToSave.matcher, q[109] = G6.summary, q[110] = L6;
            else L6 = q[110];
            return L6
        }
        case "select-event": {
            let G6;
            if (q[111] !== S || q[112] !== Y) G6 = (OA) => {
                if (OA === "disable-all") Z7("localSettings", {
                    disableAllHooks: !0
                }), Y("All hooks have been disabled");
                else {
                    let bA = Ce(OA, S);
                    if (bA !== void 0) _({
                        mode: "select-matcher",
                        event: OA,
                        matcherMetadata: bA
                    });
                    else _({
                        mode: "select-hook",
                        event: OA,
                        matcher: ""
                    })
                }
            }, q[111] = S, q[112] = Y, q[113] = G6;
            else G6 = q[113];
            let L6;
            if (q[114] !== z6 || q[115] !== M6 || q[116] !== D || q[117] !== G6 || q[118] !== r6) L6 = U3.createElement(X2q, {
                hookEventMetadata: M6,
                totalHooksCount: r6,
                configDifference: F6,
                restrictedByPolicy: D,
                onSelectEvent: G6,
                onCancel: z6
            }), q[114] = z6, q[115] = M6, q[116] = D, q[117] = G6, q[118] = r6, q[119] = L6;
            else L6 = q[119];
            return L6
        }
        case "select-matcher": {
            let G6 = M6[O.event],
                L6;
            if (q[120] !== b || q[121] !== O.event || q[122] !== O.matcherMetadata) L6 = (lA) => {
                if (lA === null) _({
                    mode: "add-matcher",
                    event: O.event,
                    matcherMetadata: O.matcherMetadata
                });
                else if ((b[O.event]?.[lA] || []).length === 0 && lA !== "") _({
                    mode: "delete-matcher",
                    event: O.event,
                    matcher: lA,
                    matcherMetadata: O.matcherMetadata
                });
                else _({
                    mode: "select-hook",
                    event: O.event,
                    matcher: lA
                })
            }, q[120] = b, q[121] = O.event, q[122] = O.matcherMetadata, q[123] = L6;
            else L6 = q[123];
            let OA;
            if (q[124] === Symbol.for("react.memo_cache_sentinel")) OA = () => {
                _({
                    mode: "select-event"
                })
            }, q[124] = OA;
            else OA = q[124];
            let bA;
            if (q[125] !== b || q[126] !== O.event || q[127] !== s || q[128] !== G6.description || q[129] !== L6) bA = U3.createElement(j2q, {
                selectedEvent: O.event,
                matchersForSelectedEvent: s,
                hooksByEventAndMatcher: b,
                eventDescription: G6.description,
                onSelect: L6,
                onCancel: OA
            }), q[125] = b, q[126] = O.event, q[127] = s, q[128] = G6.description, q[129] = L6, q[130] = bA;
            else bA = q[130];
            return bA
        }
        case "add-matcher": {
            let G6 = M6[O.event],
                L6;
            if (q[131] !== O.event || q[132] !== O.matcherMetadata) L6 = () => {
                _({
                    mode: "select-matcher",
                    event: O.event,
                    matcherMetadata: O.matcherMetadata
                }), f("")
            }, q[131] = O.event, q[132] = O.matcherMetadata, q[133] = L6;
            else L6 = q[133];
            let OA;
            if (q[134] !== O.event || q[135] !== O.matcherMetadata || q[136] !== G || q[137] !== G6.description || q[138] !== L6) OA = U3.createElement(P2q, {
                selectedEvent: O.event,
                newMatcher: G,
                onChangeNewMatcher: f,
                eventDescription: G6.description,
                matcherMetadata: O.matcherMetadata,
                onCancel: L6
            }), q[134] = O.event, q[135] = O.matcherMetadata, q[136] = G, q[137] = G6.description, q[138] = L6, q[139] = OA;
            else OA = q[139];
            return OA
        }
        case "delete-matcher": {
            let G6;
            if (q[140] !== O.event || q[141] !== O.matcherMetadata) G6 = () => _({
                mode: "select-matcher",
                event: O.event,
                matcherMetadata: O.matcherMetadata
            }), q[140] = O.event, q[141] = O.matcherMetadata, q[142] = G6;
            else G6 = q[142];
            let L6;
            if (q[143] !== K6 || q[144] !== O.event || q[145] !== O.matcher || q[146] !== G6) L6 = U3.createElement(f2q, {
                selectedMatcher: O.matcher,
                selectedEvent: O.event,
                onDelete: K6,
                onCancel: G6
            }), q[143] = K6, q[144] = O.event, q[145] = O.matcher, q[146] = G6, q[147] = L6;
            else L6 = q[147];
            return L6
        }
        case "select-hook": {
            let G6 = M6[O.event],
                L6;
            if (q[148] !== O.event || q[149] !== O.matcher) L6 = (lA) => {
                if (lA === null) _({
                    mode: "add-hook",
                    event: O.event,
                    matcher: O.matcher
                });
                else _({
                    mode: "delete-hook",
                    event: O.event,
                    hook: lA
                })
            }, q[148] = O.event, q[149] = O.matcher, q[150] = L6;
            else L6 = q[150];
            let OA;
            if (q[151] !== S || q[152] !== O.event) OA = () => {
                let lA = Ce(O.event, S);
                if (lA !== void 0) _({
                    mode: "select-matcher",
                    event: O.event,
                    matcherMetadata: lA
                });
                else _({
                    mode: "select-event"
                })
            }, q[151] = S, q[152] = O.event, q[153] = OA;
            else OA = q[153];
            let bA;
            if (q[154] !== T1 || q[155] !== O.event || q[156] !== O.matcher || q[157] !== G6 || q[158] !== L6 || q[159] !== OA) bA = U3.createElement(N2q, {
                selectedEvent: O.event,
                selectedMatcher: O.matcher,
                hooksForSelectedMatcher: T1,
                hookEventMetadata: G6,
                onSelect: L6,
                onCancel: OA
            }), q[154] = T1, q[155] = O.event, q[156] = O.matcher, q[157] = G6, q[158] = L6, q[159] = OA, q[160] = bA;
            else bA = q[160];
            return bA
        }
        case "add-hook": {
            let {
                event: G6,
                matcher: L6
            } = O, OA;
            if (q[161] !== S || q[162] !== O.event) OA = R2q(O.event, S), q[161] = S, q[162] = O.event, q[163] = OA;
            else OA = q[163];
            let bA = M6[O.event],
                lA = bA.description,
                E7;
            if (q[164] !== S || q[165] !== O.event) E7 = Ce(O.event, S), q[164] = S, q[165] = O.event, q[166] = E7;
            else E7 = q[166];
            let V4 = E7 !== void 0,
                RA;
            if (q[167] !== O.event || q[168] !== O.matcher) RA = () => {
                _({
                    mode: "select-hook",
                    event: O.event,
                    matcher: O.matcher
                }), W("")
            }, q[167] = O.event, q[168] = O.matcher, q[169] = RA;
            else RA = q[169];
            let O7;
            if (q[170] !== P || q[171] !== O.event || q[172] !== O.matcher || q[173] !== OA || q[174] !== bA.description || q[175] !== V4 || q[176] !== RA) O7 = U3.createElement(G2q, {
                selectedEvent: G6,
                selectedMatcher: L6,
                eventDescription: OA,
                fullDescription: lA,
                supportsMatcher: V4,
                command: P,
                onChangeCommand: W,
                onCancel: RA
            }), q[170] = P, q[171] = O.event, q[172] = O.matcher, q[173] = OA, q[174] = bA.description, q[175] = V4, q[176] = RA, q[177] = O7;
            else O7 = q[177];
            return O7
        }
        case "delete-hook": {
            let G6 = O.hook,
                L6;
            if (q[178] !== S || q[179] !== O.event) L6 = Ce(O.event, S), q[178] = S, q[179] = O.event, q[180] = L6;
            else L6 = q[180];
            let OA = L6 !== void 0,
                bA;
            if (q[181] !== O) bA = () => {
                let {
                    event: E7,
                    hook: V4
                } = O;
                _({
                    mode: "select-hook",
                    event: E7,
                    matcher: V4.matcher || ""
                })
            }, q[181] = O, q[182] = bA;
            else bA = q[182];
            let lA;
            if (q[183] !== q6 || q[184] !== O.hook || q[185] !== OA || q[186] !== bA) lA = U3.createElement(v2q, {
                selectedHook: G6,
                eventSupportsMatcher: OA,
                onDelete: q6,
                onCancel: bA
            }), q[183] = q6, q[184] = O.hook, q[185] = OA, q[186] = bA, q[187] = lA;
            else lA = q[187];
            return lA
        }
    }
}
// @from(Ln 423203, Col 0)
function b4z(A, q) {
    return A + Object.values(q).reduce(u4z, 0)
}
// @from(Ln 423207, Col 0)
function u4z(A, q) {
    return A + q.length
}
// @from(Ln 423211, Col 0)
function B4z() {
    Dq1()
}
// @from(Ln 423215, Col 0)
function m4z(A) {
    return A.name
}
// @from(Ln 423219, Col 0)
function F4z(A) {
    return A.mcp
}
// @from(Ln 423223, Col 0)
function Q4z() {
    return y7("policySettings")?.allowManagedHooksOnly === !0
}
// @from(Ln 423227, Col 0)
function g4z() {
    return C8()?.disableAllHooks === !0 && y7("policySettings")?.disableAllHooks === !0
}
// @from(Ln 423230, Col 4)
U3
// @from(Ln 423230, Col 8)
iI
// @from(Ln 423231, Col 4)
S2q = v(() => {
    i1();
    q3();
    m1();
    K7();
    XB();
    J2q();
    D2q();
    M2q();
    W2q();
    Z2q();
    V2q();
    T2q();
    E2q();
    wY();
    y2q();
    jq1();
    d8();
    Bq();
    p8();
    o26();
    u6();
    U3 = o(X1(), 1), iI = o(X1(), 1)
})
// @from(Ln 423255, Col 4)
h2q = {}
// @from(Ln 423259, Col 4)
LuA
// @from(Ln 423259, Col 9)
U4z = async (A, q) => {
    c("tengu_hooks_command", {});
    let Y = (await q.getAppState()).toolPermissionContext,
        z = tD(Y).map((w) => w.name);
    return LuA.createElement(C2q, {
        toolNames: z,
        onExit: A
    })
}
// @from(Ln 423268, Col 4)
I2q = v(() => {
    S2q();
    $P();
    u6();
    LuA = o(X1(), 1)
})
// @from(Ln 423274, Col 4)
p4z
// @from(Ln 423274, Col 9)
x2q
// @from(Ln 423275, Col 4)
b2q = v(() => {
    p4z = {
        type: "local-jsx",
        name: "hooks",
        description: "Manage hook configurations for tool events",
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (I2q(), h2q)),
        userFacingName() {
            return "hooks"
        }
    }, x2q = p4z
})
// @from(Ln 423288, Col 4)
u2q = {}
// @from(Ln 423295, Col 0)
async function c4z(A, q) {
    let K = q.readFileState ? Th(q.readFileState) : [];
    if (K.length === 0) return {
        type: "text",
        value: "No files in context"
    };
    return {
        type: "text",
        value: `Files in context:
${K.map((z)=>d4z(h6(),z)).join(`
`)}`
    }
}
// @from(Ln 423308, Col 4)
B2q = v(() => {
    N7();
    pM()
})
// @from(Ln 423312, Col 4)
l4z
// @from(Ln 423312, Col 9)
m2q
// @from(Ln 423313, Col 4)
F2q = v(() => {
    l4z = {
        type: "local",
        name: "files",
        description: "List all files currently in context",
        isEnabled: () => !1,
        isHidden: !1,
        supportsNonInteractive: !0,
        load: () => Promise.resolve().then(() => (B2q(), u2q)),
        userFacingName() {
            return "files"
        }
    }, m2q = l4z
})
// @from(Ln 423327, Col 4)
Q2q = {}
// @from(Ln 423339, Col 0)
async function a4z(A) {
    let q = i4z(),
        K = U6(),
        Y = fJ(y8()),
        z = a$(q),
        w = dO();
    await r4z(Y, {
        recursive: !0,
        mode: 448
    });
    let H;
    try {
        H = await n4z(w)
    } catch {
        throw Error("No conversation to fork")
    }
    if (H.length === 0) throw Error("No conversation to fork");
    let O = Q61(H).filter((D) => !D.isSidechain && vI(D));
    if (O.length === 0) throw Error("No messages to fork");
    let _ = null,
        J = [],
        X = [];
    for (let D of O) {
        let j = {
                ...D,
                sessionId: q,
                parentUuid: _,
                isSidechain: !1,
                forkedFrom: {
                    sessionId: K,
                    messageUuid: D.uuid
                }
            },
            M = {
                ...D,
                sessionId: q
            };
        X.push(M), J.push(Q1(j)), _ = D.uuid
    }
    return await o4z(z, J.join(`
`) + `
`, {
        encoding: "utf8",
        mode: 384
    }), {
        sessionId: q,
        title: A,
        forkPath: z,
        serializedMessages: X
    }
}
// @from(Ln 423390, Col 0)
async function s4z(A) {
    let q = `${A} (Fork)`;
    if ((await $F(q, {
            exact: !0
        })).length === 0) return q;
    let Y = await $F(`${A} (Fork`),
        z = new Set([1]),
        w = new RegExp(`^${t4z(A)} \\(Fork(?: (\\d+))?\\)$`);
    for (let $ of Y) {
        let O = $.customTitle?.match(w);
        if (O)
            if (O[1]) z.add(parseInt(O[1], 10));
            else z.add(1)
    }
    let H = 2;
    while (z.has(H)) H++;
    return `${A} (Fork ${H})`
}
// @from(Ln 423409, Col 0)
function t4z(A) {
    return A.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
// @from(Ln 423412, Col 0)
async function e4z(A, q, K) {
    u8("fork");
    let Y = K?.trim() || void 0,
        z = U6();
    try {
        let {
            sessionId: w,
            title: H,
            forkPath: $,
            serializedMessages: O
        } = await a4z(Y), _ = new Date, J = O.find((f) => f.type === "user"), X = (() => {
            let f = J?.message?.content;
            if (!f) return "Forked conversation";
            if (typeof f === "string") return f.slice(0, 100);
            return f.find((N) => N.type === "text")?.text?.slice(0, 100) ?? "Forked conversation"
        })(), j = await s4z(H ?? X);
        await Q91(w, j, $), c("tengu_conversation_forked", {
            message_count: O.length,
            has_custom_title: !!H
        });
        let M = {
                date: _.toISOString().split("T")[0],
                messages: O,
                fullPath: $,
                value: _.getTime(),
                created: _,
                modified: _,
                firstPrompt: X,
                messageCount: O.length,
                isSidechain: !1,
                sessionId: w,
                customTitle: j
            },
            P = H ? ` "${H}"` : "",
            W = `
To resume the original: claude -r ${z}`,
            G = `Forked conversation${P}. You are now in the fork.${W}`;
        if (q.resume) await q.resume(w, M, "fork"), A(G, {
            display: "system"
        });
        else A(`Forked conversation${P}. Resume with: /resume ${w}`);
        return null
    } catch (w) {
        let H = w instanceof Error ? w.message : "Unknown error occurred";
        return A(`Failed to fork conversation: ${H}`), null
    }
}
// @from(Ln 423459, Col 4)
g2q = v(() => {
    lq();
    B6();
    m6();
    AH();
    v3();
    u6()
})
// @from(Ln 423467, Col 4)
Aqz
// @from(Ln 423467, Col 9)
U2q
// @from(Ln 423468, Col 4)
p2q = v(() => {
    Aqz = {
        type: "local-jsx",
        name: "fork",
        description: "Create a fork of the current conversation at this point",
        argumentHint: "[name]",
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (g2q(), Q2q)),
        userFacingName() {
            return "fork"
        }
    }, U2q = Aqz
})
// @from(Ln 423482, Col 4)
_F
// @from(Ln 423483, Col 4)
d2q = v(() => {
    _F = {
        FOLDER_NAME: ".claude",
        AGENTS_DIR: "agents"
    }
})
// @from(Ln 423493, Col 0)
function c2q(A, q, K, Y, z, w, H, $) {
    let O = q.replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\n/g, "\\\\n"),
        J = K === void 0 || K.length === 1 && K[0] === "*" ? "" : `
tools: ${K.join(", ")}`,
        X = w ? `
model: ${w}` : "",
        D = $ !== void 0 ? `
effort: ${$}` : "",
        j = z ? `
color: ${z}` : "",
        M = H ? `
memory: ${H}` : "";
    return `---
name: ${A}
description: "${O}"${J}${X}${D}${j}${M}
---

${Y}
`
}
// @from(Ln 423514, Col 0)
function SN6(A) {
    switch (A) {
        case "flagSettings":
            throw Error(`Cannot get directory path for ${A} agents`);
        case "userSettings":
            return Nc(O8(), _F.AGENTS_DIR);
        case "projectSettings":
            return Nc(h6(), _F.FOLDER_NAME, _F.AGENTS_DIR);
        case "policySettings":
            return Nc(df(), _F.FOLDER_NAME, _F.AGENTS_DIR);
        case "localSettings":
            return Nc(h6(), _F.FOLDER_NAME, _F.AGENTS_DIR)
    }
}
// @from(Ln 423529, Col 0)
function l2q(A) {
    switch (A) {
        case "projectSettings":
            return Nc(".", _F.FOLDER_NAME, _F.AGENTS_DIR);
        default:
            return SN6(A)
    }
}
// @from(Ln 423538, Col 0)
function RuA(A) {
    let q = SN6(A.source);
    return Nc(q, `${A.agentType}.md`)
}
// @from(Ln 423543, Col 0)
function hN6(A) {
    if (A.source === "built-in") return "Built-in";
    if (A.source === "plugin") throw Error("Cannot get file path for plugin agents");
    let q = SN6(A.source),
        K = A.filename || A.agentType;
    return Nc(q, `${K}.md`)
}
// @from(Ln 423551, Col 0)
function i2q(A) {
    if (A.source === "built-in") return "Built-in";
    let q = l2q(A.source);
    return Nc(q, `${A.agentType}.md`)
}
// @from(Ln 423557, Col 0)
function n2q(A) {
    if (iD(A)) return "Built-in";
    if (ZJ6(A)) return `Plugin: ${A.plugin||"Unknown"}`;
    let q = l2q(A.source),
        K = A.filename || A.agentType;
    return Nc(q, `${K}.md`)
}
// @from(Ln 423565, Col 0)
function qqz(A) {
    let q = SN6(A),
        K = b1();
    if (!K.existsSync(q)) K.mkdirSync(q);
    return q
}
// @from(Ln 423571, Col 0)
async function r2q(A, q, K, Y, z, w = !0, H, $, O, _) {
    if (A === "built-in") throw Error("Cannot save built-in agents");
    qqz(A);
    let J = RuA({
            source: A,
            agentType: q
        }),
        X = b1();
    if (w && X.existsSync(J)) throw Error(`Agent file already exists: ${J}`);
    let D = c2q(q, K, Y, z, H, $, O, _);
    c8(J, D, {
        encoding: "utf-8",
        flush: !0
    })
}
// @from(Ln 423586, Col 0)
async function o2q(A, q, K, Y, z, w, H, $) {
    if (A.source === "built-in") throw Error("Cannot update built-in agents");
    let O = hN6(A),
        _ = c2q(A.agentType, q, K, Y, z, w, H, $);
    c8(O, _, {
        encoding: "utf-8",
        flush: !0
    })
}
// @from(Ln 423595, Col 0)
async function a2q(A) {
    if (A.source === "built-in") throw Error("Cannot delete built-in agents");
    let q = b1(),
        K = hN6(A);
    if (q.existsSync(K)) q.unlinkSync(K)
}
// @from(Ln 423601, Col 4)
gZ1 = v(() => {
    _8();
    N7();
    m6();
    hA();
    uv();
    d2q();
    $A1()
})
// @from(Ln 423611, Col 0)
function IN6(A) {
    let q = e(15),
        {
            title: K,
            titleColor: Y,
            subtitle: z,
            borderColor: w,
            borderDimColor: H,
            children: $,
            footer: O,
            titleSuffix: _
        } = A,
        J = Y === void 0 ? "text" : Y,
        X = w === void 0 ? "suggestion" : w,
        D = H === void 0 ? !1 : H,
        j;
    if (q[0] !== z || q[1] !== K || q[2] !== J || q[3] !== _) j = K && Se.default.createElement(I, {
        flexDirection: "column",
        paddingX: 1
    }, Se.default.createElement(V, {
        bold: !0,
        color: J
    }, K, _), z && Se.default.createElement(V, {
        dimColor: !0
    }, z)), q[0] = z, q[1] = K, q[2] = J, q[3] = _, q[4] = j;
    else j = q[4];
    let M;
    if (q[5] !== $) M = Se.default.createElement(I, {
        paddingX: 1,
        flexDirection: "column"
    }, $), q[5] = $, q[6] = M;
    else M = q[6];
    let P;
    if (q[7] !== X || q[8] !== D || q[9] !== j || q[10] !== M) P = Se.default.createElement(I, {
        borderStyle: "round",
        borderColor: X,
        borderDimColor: D,
        flexDirection: "column"
    }, j, M), q[7] = X, q[8] = D, q[9] = j, q[10] = M, q[11] = P;
    else P = q[11];
    let W;
    if (q[12] !== O || q[13] !== P) W = Se.default.createElement(Se.default.Fragment, null, P, O), q[12] = O, q[13] = P, q[14] = W;
    else W = q[14];
    return W
}
// @from(Ln 423656, Col 4)
Se
// @from(Ln 423657, Col 4)
yuA = v(() => {
    i1();
    m1();
    Se = o(X1(), 1)
})
// @from(Ln 423663, Col 0)
function he(A) {
    let q = e(6),
        {
            title: K,
            titleColor: Y,
            borderColor: z,
            children: w,
            subtitle: H
        } = A,
        $ = Y === void 0 ? "text" : Y,
        O = z === void 0 ? "suggestion" : z,
        _;
    if (q[0] !== O || q[1] !== w || q[2] !== H || q[3] !== K || q[4] !== $) _ = CuA.createElement(IN6, {
        title: K,
        titleColor: $,
        borderColor: O,
        subtitle: H
    }, w), q[0] = O, q[1] = w, q[2] = H, q[3] = K, q[4] = $, q[5] = _;
    else _ = q[5];
    return _
}
// @from(Ln 423684, Col 4)
CuA
// @from(Ln 423685, Col 4)
SuA = v(() => {
    i1();
    yuA();
    CuA = o(X1(), 1)
})
// @from(Ln 423691, Col 0)
function UZ1(A) {
    if (A === "all") return "Agents";
    if (A === "built-in") return "Built-in agents";
    if (A === "plugin") return "Plugin agents";
    return _Q(vi(A))
}
// @from(Ln 423697, Col 4)
xN6 = v(() => {
    TN1();
    E$()
})
// @from(Ln 423702, Col 0)
function s2q(A) {
    let q = e(66),
        {
            source: K,
            agents: Y,
            onBack: z,
            onSelect: w,
            onCreateNew: H,
            changes: $
        } = A,
        [O, _] = t8.useState(null),
        [J, X] = t8.useState(!0),
        D;
    if (q[0] !== Y) D = [...Y].sort(fqz), q[0] = Y, q[1] = D;
    else D = q[1];
    let j = D,
        M = Zqz,
        P;
    if (q[2] !== J) P = () => t8.createElement(I, null, t8.createElement(V, {
        color: J ? "suggestion" : void 0
    }, J ? `${l1.pointer} ` : "  "), t8.createElement(V, {
        color: J ? "suggestion" : void 0
    }, "Create new agent")), q[2] = J, q[3] = P;
    else P = q[3];
    let W = P,
        G;
    if (q[4] !== J || q[5] !== O?.agentType || q[6] !== O?.source) G = (q1) => {
        let t = q1.source === "built-in",
            J1 = !t && !J && O?.agentType === q1.agentType && O?.source === q1.source,
            {
                isOverridden: D1,
                overriddenBy: Z1
            } = M(q1),
            E1 = t || D1,
            a = !t && J1 ? "suggestion" : void 0,
            A1 = q1.model || Bq6();
        return t8.createElement(I, {
            key: `${q1.agentType}-${q1.source}`
        }, t8.createElement(V, {
            dimColor: E1 && !J1,
            color: a
        }, t ? "" : J1 ? `${l1.pointer} ` : "  "), t8.createElement(V, {
            dimColor: E1 && !J1,
            color: a
        }, q1.agentType), A1 && t8.createElement(V, {
            dimColor: !0,
            color: a
        }, " · ", A1 === "inherit" ? "inherit" : A1), q1.memory && t8.createElement(V, {
            dimColor: !0,
            color: a
        }, " · ", q1.memory, " memory"), Z1 && t8.createElement(V, {
            dimColor: !J1,
            color: J1 ? "warning" : void 0
        }, " ", l1.warning, " overridden by ", Z1))
    }, q[4] = J, q[5] = O?.agentType, q[6] = O?.source, q[7] = G;
    else G = q[7];
    let f = G,
        Z;
    if (q[8] !== j || q[9] !== K) {
        A: {
            let q1 = j.filter(Gqz);
            if (K === "all") {
                Z = [...q1.filter(Wqz), ...q1.filter(Pqz), ...q1.filter(Mqz)];
                break A
            }
            Z = q1
        }
        q[8] = j,
        q[9] = K,
        q[10] = Z
    }
    else Z = q[10];
    let N = Z,
        T, k;
    if (q[11] !== J || q[12] !== H || q[13] !== N || q[14] !== O) T = () => {
        if (!O && !J && N.length > 0)
            if (H) X(!0);
            else _(N[0] || null)
    }, k = [N, O, J, H], q[11] = J, q[12] = H, q[13] = N, q[14] = O, q[15] = T, q[16] = k;
    else T = q[15], k = q[16];
    t8.useEffect(T, k);
    let y;
    if (q[17] === Symbol.for("react.memo_cache_sentinel")) y = {
        context: "Confirmation"
    }, q[17] = y;
    else y = q[17];
    DA("confirm:no", z, y);
    let B;
    if (q[18] !== J || q[19] !== H || q[20] !== w || q[21] !== N || q[22] !== O) B = (q1, t) => {
        if (t.return) {
            if (J && H) H();
            else if (O) w(O);
            return
        }
        if (!t.upArrow && !t.downArrow) return;
        let J1 = !!H,
            D1 = N.length + (J1 ? 1 : 0);
        if (D1 === 0) return;
        let Z1 = 0;
        if (!J && O) {
            let a = N.findIndex((A1) => A1.agentType === O.agentType && A1.source === O.source);
            if (a >= 0) Z1 = J1 ? a + 1 : a
        }
        let E1 = t.upArrow ? Z1 === 0 ? D1 - 1 : Z1 - 1 : Z1 === D1 - 1 ? 0 : Z1 + 1;
        if (J1 && E1 === 0) X(!0), _(null);
        else {
            let a = J1 ? E1 - 1 : E1,
                A1 = N[a];
            if (A1) X(!1), _(A1)
        }
    }, q[18] = J, q[19] = H, q[20] = w, q[21] = N, q[22] = O, q[23] = B;
    else B = q[23];
    D8(B);
    let S;
    if (q[24] !== f || q[25] !== j) S = (q1) => {
        let t = q1 === void 0 ? "Built-in (always available):" : q1,
            J1 = j.filter(jqz);
        return t8.createElement(I, {
            flexDirection: "column",
            marginBottom: 1,
            paddingLeft: 2
        }, t8.createElement(V, {
            bold: !0,
            dimColor: !0
        }, t), J1.map(f))
    }, q[24] = f, q[25] = j, q[26] = S;
    else S = q[26];
    let m = S,
        b;
    if (q[27] !== f) b = (q1, t) => {
        if (!t.length) return null;
        let J1 = t[0]?.baseDir;
        return t8.createElement(I, {
            flexDirection: "column",
            marginBottom: 1
        }, t8.createElement(I, {
            paddingLeft: 2
        }, t8.createElement(V, {
            bold: !0,
            dimColor: !0
        }, q1), J1 && t8.createElement(V, {
            dimColor: !0
        }, " (", J1, ")")), t.map((D1) => f(D1)))
    }, q[27] = f, q[28] = b;
    else b = q[28];
    let g = b,
        U;
    if (q[29] !== K) U = UZ1(K), q[29] = K, q[30] = U;
    else U = q[30];
    let x = U;
    if (!j.length || K !== "built-in" && !j.some(Dqz)) {
        let q1;
        if (q[31] !== H || q[32] !== W) q1 = H && t8.createElement(I, {
            marginY: 1
        }, W()), q[31] = H, q[32] = W, q[33] = q1;
        else q1 = q[33];
        let t, J1, D1;
        if (q[34] === Symbol.for("react.memo_cache_sentinel")) t = t8.createElement(V, {
            dimColor: !0
        }, "No agents found. Create specialized subagents that Claude can delegate to."), J1 = t8.createElement(V, {
            dimColor: !0
        }, "Each subagent has its own context window, custom system prompt, and specific tools."), D1 = t8.createElement(V, {
            dimColor: !0
        }, "Try creating: Code Reviewer, Code Simplifier, Security Reviewer, Tech Lead, or UX Reviewer."), q[34] = t, q[35] = J1, q[36] = D1;
        else t = q[34], J1 = q[35], D1 = q[36];
        let Z1;
        if (q[37] !== m || q[38] !== j || q[39] !== K) Z1 = K !== "built-in" && j.some(Xqz) && t8.createElement(t8.Fragment, null, t8.createElement(I, {
            marginTop: 1
        }, t8.createElement(CY, null)), m()), q[37] = m, q[38] = j, q[39] = K, q[40] = Z1;
        else Z1 = q[40];
        let E1;
        if (q[41] !== x || q[42] !== q1 || q[43] !== Z1) E1 = t8.createElement(he, {
            title: x,
            subtitle: "No agents found"
        }, q1, t, J1, D1, Z1), q[41] = x, q[42] = q1, q[43] = Z1, q[44] = E1;
        else E1 = q[44];
        return E1
    }
    let l;
    if (q[45] !== j) l = j.filter(Jqz), q[45] = j, q[46] = l;
    else l = q[46];
    let r = `${l.length} agents`,
        s;
    if (q[47] !== $) s = $ && $.length > 0 && t8.createElement(I, {
        marginTop: 1
    }, t8.createElement(V, {
        dimColor: !0
    }, $[$.length - 1])), q[47] = $, q[48] = s;
    else s = q[48];
    let O1;
    if (q[49] !== H || q[50] !== W) O1 = H && t8.createElement(I, {
        marginBottom: 1
    }, W()), q[49] = H, q[50] = W, q[51] = O1;
    else O1 = q[51];
    let T1;
    if (q[52] !== f || q[53] !== g || q[54] !== m || q[55] !== j || q[56] !== K) T1 = K === "all" ? t8.createElement(t8.Fragment, null, g("User agents", j.filter(_qz)), g("Project agents", j.filter(Oqz)), g("Managed agents", j.filter($qz)), g("Plugin agents", j.filter(Hqz)), g("CLI arg agents", j.filter(wqz)), (() => {
        let q1 = j.filter(zqz);
        return q1.length > 0 ? t8.createElement(I, {
            flexDirection: "column",
            marginBottom: 1,
            paddingLeft: 2
        }, t8.createElement(V, {
            dimColor: !0
        }, t8.createElement(V, {
            bold: !0
        }, "Built-in agents"), " (always available)"), q1.map(f)) : null
    })()) : K === "built-in" ? t8.createElement(t8.Fragment, null, t8.createElement(V, {
        dimColor: !0,
        italic: !0
    }, "Built-in agents are provided by default and cannot be modified."), t8.createElement(I, {
        marginTop: 1,
        flexDirection: "column"
    }, j.map((q1) => f(q1)))) : t8.createElement(t8.Fragment, null, j.filter(Yqz).map((q1) => f(q1)), j.some(Kqz) && t8.createElement(t8.Fragment, null, t8.createElement(I, {
        marginTop: 1
    }, t8.createElement(CY, null)), m())), q[52] = f, q[53] = g, q[54] = m, q[55] = j, q[56] = K, q[57] = T1;
    else T1 = q[57];
    let N1;
    if (q[58] !== O1 || q[59] !== T1) N1 = t8.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, O1, T1), q[58] = O1, q[59] = T1, q[60] = N1;
    else N1 = q[60];
    let j1;
    if (q[61] !== x || q[62] !== r || q[63] !== s || q[64] !== N1) j1 = t8.createElement(he, {
        title: x,
        subtitle: r
    }, s, N1), q[61] = x, q[62] = r, q[63] = s, q[64] = N1, q[65] = j1;
    else j1 = q[65];
    return j1
}
// @from(Ln 423933, Col 0)
function Kqz(A) {
    return A.source === "built-in"
}
// @from(Ln 423937, Col 0)
function Yqz(A) {
    return A.source !== "built-in"
}
// @from(Ln 423941, Col 0)
function zqz(A) {
    return A.source === "built-in"
}
// @from(Ln 423945, Col 0)
function wqz(A) {
    return A.source === "flagSettings"
}
// @from(Ln 423949, Col 0)
function Hqz(A) {
    return A.source === "plugin"
}
// @from(Ln 423953, Col 0)
function $qz(A) {
    return A.source === "policySettings"
}
// @from(Ln 423957, Col 0)
function Oqz(A) {
    return A.source === "projectSettings"
}
// @from(Ln 423961, Col 0)
function _qz(A) {
    return A.source === "userSettings"
}
// @from(Ln 423965, Col 0)
function Jqz(A) {
    return !A.overriddenBy
}
// @from(Ln 423969, Col 0)
function Xqz(A) {
    return A.source === "built-in"
}
// @from(Ln 423973, Col 0)
function Dqz(A) {
    return A.source !== "built-in"
}
// @from(Ln 423977, Col 0)
function jqz(A) {
    return A.source === "built-in"
}
// @from(Ln 423981, Col 0)
function Mqz(A) {
    return A.source === "policySettings"
}
// @from(Ln 423985, Col 0)
function Pqz(A) {
    return A.source === "projectSettings"
}
// @from(Ln 423989, Col 0)
function Wqz(A) {
    return A.source === "userSettings"
}
// @from(Ln 423993, Col 0)
function Gqz(A) {
    return A.source !== "built-in"
}
// @from(Ln 423997, Col 0)
function Zqz(A) {
    return {
        isOverridden: !!A.overriddenBy,
        overriddenBy: A.overriddenBy || null
    }
}
// @from(Ln 424004, Col 0)
function fqz(A, q) {
    return A.agentType.localeCompare(q.agentType, void 0, {
        sensitivity: "base"
    })
}
// @from(Ln 424009, Col 4)
t8
// @from(Ln 424010, Col 4)
t2q = v(() => {
    i1();
    m1();
    m1();
    b7();
    kW();
    SuA();
    e7();
    xN6();
    K7();
    t8 = o(X1(), 1)
})
// @from(Ln 424023, Col 0)
function IuA(A) {
    let q = e(38),
        {
            steps: K,
            initialData: Y,
            onComplete: z,
            onCancel: w,
            children: H,
            title: $,
            showStepCounter: O
        } = A,
        _;
    if (q[0] !== Y) _ = Y === void 0 ? {} : Y, q[0] = Y, q[1] = _;
    else _ = q[1];
    let J = _,
        X = O === void 0 ? !0 : O,
        [D, j] = jy.useState(0),
        [M, P] = jy.useState(J),
        [W, G] = jy.useState(!1),
        f;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) f = [], q[2] = f;
    else f = q[2];
    let [Z, N] = jy.useState(f);
    uq();
    let T, k;
    if (q[3] !== W || q[4] !== z || q[5] !== M) T = () => {
        if (W) N([]), z(M)
    }, k = [W, M, z], q[3] = W, q[4] = z, q[5] = M, q[6] = T, q[7] = k;
    else T = q[6], k = q[7];
    jy.useEffect(T, k);
    let y;
    if (q[8] !== D || q[9] !== Z || q[10] !== K.length) y = () => {
        if (D < K.length - 1) {
            if (Z.length > 0) N((j1) => [...j1, D]);
            j(Tqz)
        } else G(!0)
    }, q[8] = D, q[9] = Z, q[10] = K.length, q[11] = y;
    else y = q[11];
    let B = y,
        S;
    if (q[12] !== D || q[13] !== Z || q[14] !== w) S = () => {
        if (Z.length > 0) {
            let j1 = Z[Z.length - 1];
            if (j1 !== void 0) N(Nqz), j(j1)
        } else if (D > 0) j(Vqz);
        else if (w) w()
    }, q[12] = D, q[13] = Z, q[14] = w, q[15] = S;
    else S = q[15];
    let m = S,
        b;
    if (q[16] !== D || q[17] !== K.length) b = (j1) => {
        if (j1 >= 0 && j1 < K.length) N((q1) => [...q1, D]), j(j1)
    }, q[16] = D, q[17] = K.length, q[18] = b;
    else b = q[18];
    let g = b,
        U;
    if (q[19] !== w) U = () => {
        if (N([]), w) w()
    }, q[19] = w, q[20] = U;
    else U = q[20];
    let x = U,
        p;
    if (q[21] === Symbol.for("react.memo_cache_sentinel")) p = (j1) => {
        P((q1) => ({
            ...q1,
            ...j1
        }))
    }, q[21] = p;
    else p = q[21];
    let l = p,
        r;
    if (q[22] !== x || q[23] !== D || q[24] !== m || q[25] !== B || q[26] !== g || q[27] !== X || q[28] !== K.length || q[29] !== $ || q[30] !== M) r = {
        currentStepIndex: D,
        totalSteps: K.length,
        wizardData: M,
        setWizardData: P,
        updateWizardData: l,
        goNext: B,
        goBack: m,
        goToStep: g,
        cancel: x,
        title: $,
        showStepCounter: X
    }, q[22] = x, q[23] = D, q[24] = m, q[25] = B, q[26] = g, q[27] = X, q[28] = K.length, q[29] = $, q[30] = M, q[31] = r;
    else r = q[31];
    let s = r,
        O1 = K[D];
    if (!O1 || W) return null;
    let T1;
    if (q[32] !== O1 || q[33] !== H) T1 = H || jy.default.createElement(O1, null), q[32] = O1, q[33] = H, q[34] = T1;
    else T1 = q[34];
    let N1;
    if (q[35] !== s || q[36] !== T1) N1 = jy.default.createElement(huA.Provider, {
        value: s
    }, T1), q[35] = s, q[36] = T1, q[37] = N1;
    else N1 = q[37];
    return N1
}
// @from(Ln 424122, Col 0)
function Vqz(A) {
    return A - 1
}
// @from(Ln 424126, Col 0)
function Nqz(A) {
    return A.slice(0, -1)
}
// @from(Ln 424130, Col 0)
function Tqz(A) {
    return A + 1
}
// @from(Ln 424133, Col 4)
jy
// @from(Ln 424133, Col 8)
huA
// @from(Ln 424134, Col 4)
xuA = v(() => {
    i1();
    R2();
    jy = o(X1(), 1), huA = jy.createContext(null)
})
// @from(Ln 424140, Col 0)
function dw() {
    let A = e2q.useContext(huA);
    if (!A) throw Error("useWizard must be used within a WizardProvider");
    return A
}
// @from(Ln 424145, Col 4)
e2q
// @from(Ln 424146, Col 4)
buA = v(() => {
    xuA();
    e2q = o(X1(), 1)
})
// @from(Ln 424151, Col 0)
function uuA({
    instructions: A = l91.default.createElement(oA, null, l91.default.createElement(YA, {
        shortcut: "↑↓",
        action: "navigate"
    }), l91.default.createElement(YA, {
        shortcut: "Enter",
        action: "select"
    }), l91.default.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "go back"
    }))
}) {
    let q = uq();
    return l91.default.createElement(I, {
        marginLeft: 3
    }, l91.default.createElement(V, {
        dimColor: !0
    }, q.pending ? `Press ${q.keyName} again to exit` : A))
}
// @from(Ln 424172, Col 4)
l91
// @from(Ln 424173, Col 4)
BuA = v(() => {
    m1();
    R2();
    wK();
    BK();
    HK();
    l91 = o(X1(), 1)
})
// @from(Ln 424182, Col 0)
function AO(A) {
    let q = e(10),
        {
            title: K,
            titleColor: Y,
            borderColor: z,
            children: w,
            subtitle: H,
            footerText: $
        } = A,
        O = Y === void 0 ? "text" : Y,
        _ = z === void 0 ? "suggestion" : z,
        {
            currentStepIndex: J,
            totalSteps: X,
            title: D,
            showStepCounter: j
        } = dw(),
        M = K || D || "Wizard",
        P = j !== !1 ? ` (${J+1}/${X})` : void 0,
        W;
    if (q[0] !== $) W = muA.default.createElement(uuA, {
        instructions: $
    }), q[0] = $, q[1] = W;
    else W = q[1];
    let G;
    if (q[2] !== _ || q[3] !== w || q[4] !== H || q[5] !== P || q[6] !== W || q[7] !== M || q[8] !== O) G = muA.default.createElement(IN6, {
        title: M,
        titleColor: O,
        borderColor: _,
        subtitle: H,
        titleSuffix: P,
        footer: W
    }, w), q[2] = _, q[3] = w, q[4] = H, q[5] = P, q[6] = W, q[7] = M, q[8] = O, q[9] = G;
    else G = q[9];
    return G
}
// @from(Ln 424219, Col 4)
muA
// @from(Ln 424220, Col 4)
VE = v(() => {
    i1();
    buA();
    BuA();
    yuA();
    muA = o(X1(), 1)
})
// @from(Ln 424227, Col 4)
xN = v(() => {
    xuA();
    buA();
    VE();
    BuA()
})
// @from(Ln 424234, Col 0)
function Awq() {
    let A = e(11),
        {
            goNext: q,
            updateWizardData: K,
            cancel: Y
        } = dw(),
        z;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) z = {
        label: "Project (.claude/agents/)",
        value: "projectSettings"
    }, A[0] = z;
    else z = A[0];
    let w;
    if (A[1] === Symbol.for("react.memo_cache_sentinel")) w = [z, {
        label: "Personal (~/.claude/agents/)",
        value: "userSettings"
    }], A[1] = w;
    else w = A[1];
    let H = w,
        $;
    if (A[2] === Symbol.for("react.memo_cache_sentinel")) $ = Ie.default.createElement(oA, null, Ie.default.createElement(YA, {
        shortcut: "↑↓",
        action: "navigate"
    }), Ie.default.createElement(YA, {
        shortcut: "Enter",
        action: "select"
    }), Ie.default.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "cancel"
    })), A[2] = $;
    else $ = A[2];
    let O;
    if (A[3] !== q || A[4] !== K) O = (X) => {
        K({
            location: X
        }), q()
    }, A[3] = q, A[4] = K, A[5] = O;
    else O = A[5];
    let _;
    if (A[6] !== Y) _ = () => Y(), A[6] = Y, A[7] = _;
    else _ = A[7];
    let J;
    if (A[8] !== O || A[9] !== _) J = Ie.default.createElement(AO, {
        subtitle: "Choose location",
        footerText: $
    }, Ie.default.createElement(I, {
        marginTop: 1
    }, Ie.default.createElement(kA, {
        key: "location-select",
        options: H,
        onChange: O,
        onCancel: _
    }))), A[8] = O, A[9] = _, A[10] = J;
    else J = A[10];
    return J
}
// @from(Ln 424293, Col 4)
Ie
// @from(Ln 424294, Col 4)
qwq = v(() => {
    i1();
    m1();
    U5();
    VE();
    xN();
    wK();
    BK();
    HK();
    Ie = o(X1(), 1)
})
// @from(Ln 424306, Col 0)
function Kwq() {
    let A = e(11),
        {
            goNext: q,
            goBack: K,
            updateWizardData: Y,
            goToStep: z
        } = dw(),
        w;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) w = [{
        label: "Generate with Claude (recommended)",
        value: "generate"
    }, {
        label: "Manual configuration",
        value: "manual"
    }], A[0] = w;
    else w = A[0];
    let H = w,
        $;
    if (A[1] === Symbol.for("react.memo_cache_sentinel")) $ = xe.default.createElement(oA, null, xe.default.createElement(YA, {
        shortcut: "↑↓",
        action: "navigate"
    }), xe.default.createElement(YA, {
        shortcut: "Enter",
        action: "select"
    }), xe.default.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "go back"
    })), A[1] = $;
    else $ = A[1];
    let O;
    if (A[2] !== q || A[3] !== z || A[4] !== Y) O = (X) => {
        let D = X;
        if (Y({
                method: D,
                wasGenerated: D === "generate"
            }), D === "generate") q();
        else z(3)
    }, A[2] = q, A[3] = z, A[4] = Y, A[5] = O;
    else O = A[5];
    let _;
    if (A[6] !== K) _ = () => K(), A[6] = K, A[7] = _;
    else _ = A[7];
    let J;
    if (A[8] !== O || A[9] !== _) J = xe.default.createElement(AO, {
        subtitle: "Creation method",
        footerText: $
    }, xe.default.createElement(I, {
        marginTop: 1
    }, xe.default.createElement(kA, {
        key: "method-select",
        options: H,
        onChange: O,
        onCancel: _
    }))), A[8] = O, A[9] = _, A[10] = J;
    else J = A[10];
    return J
}
// @from(Ln 424366, Col 4)
xe
// @from(Ln 424367, Col 4)
Ywq = v(() => {
    i1();
    m1();
    U5();
    VE();
    xN();
    wK();
    BK();
    HK();
    xe = o(X1(), 1)
})
// @from(Ln 424378, Col 0)
async function wwq(A, q, K, Y) {
    let z = K.length > 0 ? `

IMPORTANT: The following identifiers already exist and must NOT be used: ${K.join(", ")}` : "",
        w = `Create an agent configuration based on this request: "${A}".${z}
  Return ONLY the JSON object, no other text.`,
        H = c6({
            content: w
        }),
        $ = await i$(),
        O = bG1([H], $),
        _ = y2() ? zwq + vqz : zwq,
        D = (await mp({
            messages: WJ(O),
            systemPrompt: [_],
            maxThinkingTokens: 0,
            tools: [],
            signal: Y,
            options: {
                getToolPermissionContext: async () => QD(),
                model: q,
                toolChoice: void 0,
                agents: [],
                isNonInteractiveSession: !1,
                hasAppendSystemPrompt: !1,
                querySource: "agent_creation",
                mcpTools: []
            }
        })).message.content.filter((M) => M.type === "text").map((M) => M.text).join(`
`),
        j;
    try {
        j = _A(D.trim())
    } catch {
        let M = D.match(/\{[\s\S]*\}/);
        if (!M) throw Error("No JSON object found in response");
        j = _A(M[0])
    }
    if (!j.identifier || !j.whenToUse || !j.systemPrompt) throw Error("Invalid agent configuration generated");
    return c("tengu_agent_definition_generated", {
        agent_identifier: j.identifier
    }), {
        identifier: j.identifier,
        whenToUse: j.whenToUse,
        systemPrompt: j.systemPrompt
    }
}
// @from(Ln 424425, Col 4)
zwq
// @from(Ln 424425, Col 9)
vqz = `

7. **Agent Memory Instructions**: If the user mentions "memory", "remember", "learn", "persist", or similar concepts, OR if the agent would benefit from building up knowledge across conversations (e.g., code reviewers learning patterns, architects learning codebase structure, etc.), include domain-specific memory update instructions in the systemPrompt.

   Add a section like this to the systemPrompt, tailored to the agent's specific domain:

   "**Update your agent memory** as you discover [domain-specific items]. This builds up institutional knowledge across conversations. Write concise notes about what you found and where.

   Examples of what to record:
   - [domain-specific item 1]
   - [domain-specific item 2]
   - [domain-specific item 3]"

   Examples of domain-specific memory instructions:
   - For a code-reviewer: "Update your agent memory as you discover code patterns, style conventions, common issues, and architectural decisions in this codebase."
   - For a test-runner: "Update your agent memory as you discover test patterns, common failure modes, flaky tests, and testing best practices."
   - For an architect: "Update your agent memory as you discover codepaths, library locations, key architectural decisions, and component relationships."
   - For a documentation writer: "Update your agent memory as you discover documentation patterns, API structures, and terminology conventions."

   The memory instructions should be specific to what the agent would naturally learn while performing its core tasks.
`
// @from(Ln 424446, Col 4)
Hwq = v(() => {
    xW();
    yw();
    N8();
    TR();
    u6();
    at();
    m6();
    zwq = `You are an elite AI agent architect specializing in crafting high-performance agent configurations. Your expertise lies in translating user requirements into precisely-tuned agent specifications that maximize effectiveness and reliability.

**Important Context**: You may have access to project-specific instructions from CLAUDE.md files and other context that may include coding standards, project structure, and custom requirements. Consider this context when creating agents to ensure they align with the project's established patterns and practices.

When a user describes what they want an agent to do, you will:

1. **Extract Core Intent**: Identify the fundamental purpose, key responsibilities, and success criteria for the agent. Look for both explicit requirements and implicit needs. Consider any project-specific context from CLAUDE.md files. For agents that are meant to review code, you should assume that the user is asking to review recently written code and not the whole codebase, unless the user has explicitly instructed you otherwise.

2. **Design Expert Persona**: Create a compelling expert identity that embodies deep domain knowledge relevant to the task. The persona should inspire confidence and guide the agent's decision-making approach.

3. **Architect Comprehensive Instructions**: Develop a system prompt that:
   - Establishes clear behavioral boundaries and operational parameters
   - Provides specific methodologies and best practices for task execution
   - Anticipates edge cases and provides guidance for handling them
   - Incorporates any specific requirements or preferences mentioned by the user
   - Defines output format expectations when relevant
   - Aligns with project-specific coding standards and patterns from CLAUDE.md

4. **Optimize for Performance**: Include:
   - Decision-making frameworks appropriate to the domain
   - Quality control mechanisms and self-verification steps
   - Efficient workflow patterns
   - Clear escalation or fallback strategies

5. **Create Identifier**: Design a concise, descriptive identifier that:
   - Uses lowercase letters, numbers, and hyphens only
   - Is typically 2-4 words joined by hyphens
   - Clearly indicates the agent's primary function
   - Is memorable and easy to type
   - Avoids generic terms like "helper" or "assistant"

6 **Example agent descriptions**:
  - in the 'whenToUse' field of the JSON object, you should include examples of when this agent should be used.
  - examples should be of the form:
    - <example>
      Context: The user is creating a test-runner agent that should be called after a logical chunk of code is written.
      user: "Please write a function that checks if a number is prime"
      assistant: "Here is the relevant function: "
      <function call omitted for brevity only for this example>
      <commentary>
      Since a significant piece of code was written, use the ${fK} tool to launch the test-runner agent to run the tests.
      </commentary>
      assistant: "Now let me use the test-runner agent to run the tests"
    </example>
    - <example>
      Context: User is creating an agent to respond to the word "hello" with a friendly jok.
      user: "Hello"
      assistant: "I'm going to use the ${fK} tool to launch the greeting-responder agent to respond with a friendly joke"
      <commentary>
      Since the user is greeting, use the greeting-responder agent to respond with a friendly joke. 
      </commentary>
    </example>
  - If the user mentioned or implied that the agent should be used proactively, you should include examples of this.
- NOTE: Ensure that in the examples, you are making the assistant use the Agent tool and not simply respond directly to the task.

Your output must be a valid JSON object with exactly these fields:
{
  "identifier": "A unique, descriptive identifier using lowercase letters, numbers, and hyphens (e.g., 'test-runner', 'api-docs-writer', 'code-formatter')",
  "whenToUse": "A precise, actionable description starting with 'Use this agent when...' that clearly defines the triggering conditions and use cases. Ensure you include examples as described above.",
  "systemPrompt": "The complete system prompt that will govern the agent's behavior, written in second person ('You are...', 'You will...') and structured for maximum clarity and effectiveness"
}

Key principles for your system prompts:
- Be specific rather than generic - avoid vague instructions
- Include concrete examples when they would clarify behavior
- Balance comprehensiveness with clarity - every instruction should add value
- Ensure the agent has enough context to handle variations of the core task
- Make the agent proactive in seeking clarification when needed
- Build in quality assurance and self-correction mechanisms

Remember: The agents you create should be autonomous experts capable of handling their designated tasks with minimal additional guidance. Your system prompts are their complete operational manual.
`
})
// @from(Ln 424528, Col 0)
function $wq() {
    let {
        updateWizardData: A,
        goBack: q,
        goToStep: K,
        wizardData: Y
    } = dw(), [z, w] = qO.useState(Y.generationPrompt || ""), [H, $] = qO.useState(!1), [O, _] = qO.useState(null), [J, X] = qO.useState(z.length), D = is(), j = qO.useRef(null), M = qO.useCallback(() => {
        if (j.current) j.current.abort(), j.current = null, $(!1), _("Generation cancelled")
    }, []);
    DA("confirm:no", M, {
        context: "Settings",
        isActive: H
    });
    let P = qO.useCallback(() => {
        A({
            generationPrompt: "",
            agentType: "",
            systemPrompt: "",
            whenToUse: "",
            generatedAgent: void 0,
            wasGenerated: !1
        }), w(""), _(null), q()
    }, [A, q]);
    DA("confirm:no", P, {
        context: "Settings",
        isActive: !H
    });
    let W = async () => {
        let f = z.trim();
        if (!f) {
            _("Please describe what the agent should do");
            return
        }
        _(null), $(!0), A({
            generationPrompt: f,
            isGenerating: !0
        });
        let Z = Aq();
        j.current = Z;
        try {
            let N = await wwq(f, D, [], Z.signal);
            A({
                agentType: N.identifier,
                whenToUse: N.whenToUse,
                systemPrompt: N.systemPrompt,
                generatedAgent: N,
                isGenerating: !1,
                wasGenerated: !0
            }), K(6)
        } catch (N) {
            if (N instanceof Oz);
            else if (N instanceof Error && !N.message.includes("No assistant message found")) _(N.message || "Failed to generate agent");
            A({
                isGenerating: !1
            })
        } finally {
            $(!1), j.current = null
        }
    }, G = "Describe what this agent should do and when it should be used (be comprehensive for best results)";
    if (H) return qO.default.createElement(AO, {
        subtitle: G,
        footerText: qO.default.createElement(NA, {
            action: "confirm:no",
            context: "Settings",
            fallback: "Esc",
            description: "cancel"
        })
    }, qO.default.createElement(I, {
        marginTop: 1,
        flexDirection: "row",
        alignItems: "center"
    }, qO.default.createElement(c4, null), qO.default.createElement(V, {
        color: "suggestion"
    }, " Generating agent from description...")));
    return qO.default.createElement(AO, {
        subtitle: G,
        footerText: qO.default.createElement(oA, null, qO.default.createElement(NA, {
            action: "confirm:yes",
            context: "Confirmation",
            fallback: "Enter",
            description: "submit"
        }), qO.default.createElement(NA, {
            action: "confirm:no",
            context: "Settings",
            fallback: "Esc",
            description: "go back"
        }))
    }, qO.default.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, O && qO.default.createElement(I, {
        marginBottom: 1
    }, qO.default.createElement(V, {
        color: "error"
    }, O)), qO.default.createElement(k3, {
        value: z,
        onChange: w,
        onSubmit: W,
        placeholder: "e.g., Help me write unit tests for my code...",
        columns: 80,
        cursorOffset: J,
        onChangeCursorOffset: X,
        focus: !0,
        showCursor: !0
    })))
}
// @from(Ln 424634, Col 4)
qO
// @from(Ln 424635, Col 4)
Owq = v(() => {
    m1();
    K7();
    gO();
    VE();
    xN();
    x2();
    Hwq();
    tF1();
    G2();
    BK();
    HK();
    GV();
    qO = o(X1(), 1)
})
// @from(Ln 424651, Col 0)
function FuA(A) {
    if (!A) return "Agent type is required";
    if (!/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$/.test(A)) return "Agent type must start and end with alphanumeric characters and contain only letters, numbers, and hyphens";
    if (A.length < 3) return "Agent type must be at least 3 characters long";
    if (A.length > 50) return "Agent type must be less than 50 characters";
    return null
}
// @from(Ln 424659, Col 0)
function _wq(A, q, K) {
    let Y = [],
        z = [];
    if (!A.agentType) Y.push("Agent type is required");
    else {
        let H = FuA(A.agentType);
        if (H) Y.push(H);
        let $ = K.find((O) => O.agentType === A.agentType && O.source !== A.source);
        if ($) Y.push(`Agent type "${A.agentType}" already exists in ${UZ1($.source)}`)
    }
    if (!A.whenToUse) Y.push("Description (description) is required");
    else if (A.whenToUse.length < 10) z.push("Description should be more descriptive (at least 10 characters)");
    else if (A.whenToUse.length > 5000) z.push("Description is very long (over 5000 characters)");
    if (A.tools !== void 0 && !Array.isArray(A.tools)) Y.push("Tools must be an array");
    else {
        if (A.tools === void 0) z.push("Agent has access to all tools");
        else if (A.tools.length === 0) z.push("No tools selected - agent will have very limited capabilities");
        let H = qs(A, q, !1);
        if (H.invalidTools.length > 0) Y.push(`Invalid tools: ${H.invalidTools.join(", ")}`)
    }
    let w = A.getSystemPrompt();
    if (!w) Y.push("System prompt is required");
    else if (w.length < 20) Y.push("System prompt is too short (minimum 20 characters)");
    else if (w.length > 1e4) z.push("System prompt is very long (over 10,000 characters)");
    return {
        isValid: Y.length === 0,
        errors: Y,
        warnings: z
    }
}
// @from(Ln 424689, Col 4)
QuA = v(() => {
    bK1();
    xN6()
})
// @from(Ln 424694, Col 0)
function Jwq(A) {
    let q = e(15),
        {
            goNext: K,
            goBack: Y,
            updateWizardData: z,
            wizardData: w
        } = dw(),
        [H, $] = JG.useState(w.agentType || ""),
        [O, _] = JG.useState(null),
        [J, X] = JG.useState(H.length),
        D;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) D = {
        context: "Settings"
    }, q[0] = D;
    else D = q[0];
    DA("confirm:no", Y, D);
    let j;
    if (q[1] !== K || q[2] !== z) j = (N) => {
        let T = N.trim(),
            k = FuA(T);
        if (k) {
            _(k);
            return
        }
        _(null), z({
            agentType: T
        }), K()
    }, q[1] = K, q[2] = z, q[3] = j;
    else j = q[3];
    let M = j,
        P;
    if (q[4] === Symbol.for("react.memo_cache_sentinel")) P = JG.default.createElement(oA, null, JG.default.createElement(YA, {
        shortcut: "Type",
        action: "enter text"
    }), JG.default.createElement(YA, {
        shortcut: "Enter",
        action: "continue"
    }), JG.default.createElement(NA, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "go back"
    })), q[4] = P;
    else P = q[4];
    let W;
    if (q[5] === Symbol.for("react.memo_cache_sentinel")) W = JG.default.createElement(V, null, "Enter a unique identifier for your agent:"), q[5] = W;
    else W = q[5];
    let G;
    if (q[6] !== H || q[7] !== J || q[8] !== M) G = JG.default.createElement(I, {
        marginTop: 1
    }, JG.default.createElement(k3, {
        value: H,
        onChange: $,
        onSubmit: M,
        placeholder: "e.g., test-runner, tech-lead, etc",
        columns: 60,
        cursorOffset: J,
        onChangeCursorOffset: X,
        focus: !0,
        showCursor: !0
    })), q[6] = H, q[7] = J, q[8] = M, q[9] = G;
    else G = q[9];
    let f;
    if (q[10] !== O) f = O && JG.default.createElement(I, {
        marginTop: 1
    }, JG.default.createElement(V, {
        color: "error"
    }, O)), q[10] = O, q[11] = f;
    else f = q[11];
    let Z;
    if (q[12] !== G || q[13] !== f) Z = JG.default.createElement(AO, {
        subtitle: "Agent type (identifier)",
        footerText: P
    }, JG.default.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, W, G, f)), q[12] = G, q[13] = f, q[14] = Z;
    else Z = q[14];
    return Z
}
// @from(Ln 424775, Col 4)
JG
// @from(Ln 424776, Col 4)
Xwq = v(() => {
    i1();
    m1();
    gO();
    VE();
    xN();
    QuA();
    wK();
    BK();
    HK();
    K7();
    JG = o(X1(), 1)
})
// @from(Ln 424790, Col 0)
function Dwq() {
    let A = e(17),
        {
            goNext: q,
            goBack: K,
            updateWizardData: Y,
            wizardData: z
        } = dw(),
        [w, H] = VP.useState(z.systemPrompt || ""),
        [$, O] = VP.useState(w.length),
        [_, J] = VP.useState(null),
        X;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) X = {
        context: "Settings"
    }, A[0] = X;
    else X = A[0];
    DA("confirm:no", K, X);
    let D;
    if (A[1] !== q || A[2] !== w || A[3] !== Y) D = () => {
        let N = w.trim();
        if (!N) {
            J("System prompt is required");
            return
        }
        J(null), Y({
            systemPrompt: N
        }), q()
    }, A[1] = q, A[2] = w, A[3] = Y, A[4] = D;
    else D = A[4];
    let j = D,
        M;
    if (A[5] === Symbol.for("react.memo_cache_sentinel")) M = VP.default.createElement(oA, null, VP.default.createElement(YA, {
        shortcut: "Type",
        action: "enter text"
    }), VP.default.createElement(YA, {
        shortcut: "Enter",
        action: "continue"
    }), VP.default.createElement(NA, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "go back"
    })), A[5] = M;
    else M = A[5];
    let P, W;
    if (A[6] === Symbol.for("react.memo_cache_sentinel")) P = VP.default.createElement(V, null, "Enter the system prompt for your agent:"), W = VP.default.createElement(V, {
        dimColor: !0
    }, "Be comprehensive for best results"), A[6] = P, A[7] = W;
    else P = A[6], W = A[7];
    let G;
    if (A[8] !== $ || A[9] !== j || A[10] !== w) G = VP.default.createElement(I, {
        marginTop: 1
    }, VP.default.createElement(k3, {
        value: w,
        onChange: H,
        onSubmit: j,
        placeholder: "You are a helpful code reviewer who...",
        columns: 80,
        cursorOffset: $,
        onChangeCursorOffset: O,
        focus: !0,
        showCursor: !0
    })), A[8] = $, A[9] = j, A[10] = w, A[11] = G;
    else G = A[11];
    let f;
    if (A[12] !== _) f = _ && VP.default.createElement(I, {
        marginTop: 1
    }, VP.default.createElement(V, {
        color: "error"
    }, _)), A[12] = _, A[13] = f;
    else f = A[13];
    let Z;
    if (A[14] !== G || A[15] !== f) Z = VP.default.createElement(AO, {
        subtitle: "System prompt",
        footerText: M
    }, VP.default.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, P, W, G, f)), A[14] = G, A[15] = f, A[16] = Z;
    else Z = A[16];
    return Z
}
// @from(Ln 424872, Col 4)
VP
// @from(Ln 424873, Col 4)
jwq = v(() => {
    i1();
    m1();
    gO();
    VE();
    xN();
    wK();
    BK();
    HK();
    K7();
    VP = o(X1(), 1)
})
// @from(Ln 424886, Col 0)
function Mwq() {
    let A = e(15),
        {
            goNext: q,
            goBack: K,
            updateWizardData: Y,
            wizardData: z
        } = dw(),
        [w, H] = XG.useState(z.whenToUse || ""),
        [$, O] = XG.useState(w.length),
        [_, J] = XG.useState(null),
        X;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) X = {
        context: "Settings"
    }, A[0] = X;
    else X = A[0];
    DA("confirm:no", K, X);
    let D;
    if (A[1] !== q || A[2] !== Y) D = (Z) => {
        let N = Z.trim();
        if (!N) {
            J("Description is required");
            return
        }
        J(null), Y({
            whenToUse: N
        }), q()
    }, A[1] = q, A[2] = Y, A[3] = D;
    else D = A[3];
    let j = D,
        M;
    if (A[4] === Symbol.for("react.memo_cache_sentinel")) M = XG.default.createElement(oA, null, XG.default.createElement(YA, {
        shortcut: "Type",
        action: "enter text"
    }), XG.default.createElement(YA, {
        shortcut: "Enter",
        action: "continue"
    }), XG.default.createElement(NA, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "go back"
    })), A[4] = M;
    else M = A[4];
    let P;
    if (A[5] === Symbol.for("react.memo_cache_sentinel")) P = XG.default.createElement(V, null, "When should Claude use this agent?"), A[5] = P;
    else P = A[5];
    let W;
    if (A[6] !== $ || A[7] !== j || A[8] !== w) W = XG.default.createElement(I, {
        marginTop: 1
    }, XG.default.createElement(k3, {
        value: w,
        onChange: H,
        onSubmit: j,
        placeholder: "e.g., use this agent after you're done writing code...",
        columns: 80,
        cursorOffset: $,
        onChangeCursorOffset: O,
        focus: !0,
        showCursor: !0
    })), A[6] = $, A[7] = j, A[8] = w, A[9] = W;
    else W = A[9];
    let G;
    if (A[10] !== _) G = _ && XG.default.createElement(I, {
        marginTop: 1
    }, XG.default.createElement(V, {
        color: "error"
    }, _)), A[10] = _, A[11] = G;
    else G = A[11];
    let f;
    if (A[12] !== W || A[13] !== G) f = XG.default.createElement(AO, {
        subtitle: "Description (tell Claude when to use this agent)",
        footerText: M
    }, XG.default.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, P, W, G)), A[12] = W, A[13] = G, A[14] = f;
    else f = A[14];
    return f
}
// @from(Ln 424966, Col 4)
XG
// @from(Ln 424967, Col 4)
Pwq = v(() => {
    i1();
    m1();
    gO();
    VE();
    xN();
    wK();
    BK();
    HK();
    K7();
    XG = o(X1(), 1)
})
// @from(Ln 424980, Col 0)
function be(A) {
    let q = e(7),
        {
            width: K,
            color: Y,
            char: z,
            padding: w
        } = A,
        H = z === void 0 ? "─" : z,
        $ = w === void 0 ? 0 : w,
        {
            columns: O
        } = Z8(),
        _ = Math.max(0, (K ?? O) - $),
        J = !Y,
        X;
    if (q[0] !== H || q[1] !== _) X = H.repeat(_), q[0] = H, q[1] = _, q[2] = X;
    else X = q[2];
    let D;
    if (q[3] !== Y || q[4] !== J || q[5] !== X) D = Wwq.default.createElement(V, {
        color: Y,
        dimColor: J
    }, X), q[3] = Y, q[4] = J, q[5] = X, q[6] = D;
    else D = q[6];
    return D
}
// @from(Ln 425006, Col 4)
Wwq
// @from(Ln 425007, Col 4)
guA = v(() => {
    i1();
    m1();
    mq();
    Wwq = o(X1(), 1)
})
// @from(Ln 425014, Col 0)
function Eqz(A) {
    let q = new Map;
    return A.forEach((K) => {
        if ($E(K)) {
            let Y = VD(K.name);
            if (Y?.serverName) {
                let z = q.get(Y.serverName) || [];
                z.push(K), q.set(Y.serverName, z)
            }
        }
    }), Array.from(q.entries()).map(([K, Y]) => ({
        serverName: K,
        tools: Y
    })).sort((K, Y) => K.serverName.localeCompare(Y.serverName))
}
// @from(Ln 425030, Col 0)
function bN6(A) {
    let q = e(68),
        {
            tools: K,
            initialTools: Y,
            onComplete: z,
            onCancel: w
        } = A,
        H;
    if (q[0] !== K) H = oMA({
        tools: K,
        isBuiltIn: !1,
        isAsync: !1
    }), q[0] = K, q[1] = H;
    else H = q[1];
    let $ = H,
        O;
    if (q[2] !== $ || q[3] !== Y) O = !Y || Y.includes("*") ? $.map(Iqz) : Y, q[2] = $, q[3] = Y, q[4] = O;
    else O = q[4];
    let _ = O,
        [J, X] = wf.useState(_),
        [D, j] = wf.useState(0),
        [M, P] = wf.useState(!1),
        W;
    if (q[5] !== $) W = new Set($.map(hqz)), q[5] = $, q[6] = W;
    else W = q[6];
    let G = W,
        f;
    if (q[7] !== J || q[8] !== G) {
        let z1;
        if (q[10] !== G) z1 = (Y1) => G.has(Y1), q[10] = G, q[11] = z1;
        else z1 = q[11];
        f = J.filter(z1), q[7] = J, q[8] = G, q[9] = f
    } else f = q[9];
    let Z = f,
        N;
    if (q[12] !== Z) N = new Set(Z), q[12] = Z, q[13] = N;
    else N = q[13];
    let T = N,
        k = Z.length === $.length && $.length > 0,
        y;
    if (q[14] === Symbol.for("react.memo_cache_sentinel")) y = (z1) => {
        if (!z1) return;
        X((Y1) => Y1.includes(z1) ? Y1.filter((_1) => _1 !== z1) : [...Y1, z1])
    }, q[14] = y;
    else y = q[14];
    let B = y,
        S;
    if (q[15] === Symbol.for("react.memo_cache_sentinel")) S = (z1, Y1) => {
        X((_1) => {
            if (Y1) {
                let $1 = z1.filter((G1) => !_1.includes(G1));
                return [..._1, ...$1]
            } else return _1.filter(($1) => !z1.includes($1))
        })
    }, q[15] = S;
    else S = q[15];
    let m = S,
        b;
    if (q[16] !== $ || q[17] !== z || q[18] !== Z) b = () => {
        let z1 = $.map(Sqz),
            _1 = Z.length === z1.length && z1.every(($1) => Z.includes($1)) ? void 0 : Z;
        z(_1)
    }, q[16] = $, q[17] = z, q[18] = Z, q[19] = b;
    else b = q[19];
    let g = b,
        U;
    if (q[20] !== $) {
        let z1 = Gwq();
        U = {
            readOnly: [],
            edit: [],
            execution: [],
            mcp: [],
            other: []
        }, $.forEach((Y1) => {
            if ($E(Y1)) U.mcp.push(Y1);
            else if (z1.READ_ONLY.toolNames.has(Y1.name)) U.readOnly.push(Y1);
            else if (z1.EDIT.toolNames.has(Y1.name)) U.edit.push(Y1);
            else if (z1.EXECUTION.toolNames.has(Y1.name)) U.execution.push(Y1);
            else if (Y1.name !== fK) U.other.push(Y1)
        }), q[20] = $, q[21] = U
    } else U = q[21];
    let x = U,
        p;
    if (q[22] !== T) p = (z1) => {
        let _1 = z1.filter(($1) => T.has($1.name)).length < z1.length;
        return () => {
            let $1 = z1.map(Cqz);
            m($1, _1)
        }
    }, q[22] = T, q[23] = p;
    else p = q[23];
    let l = p,
        r;
    if (q[24] !== l || q[25] !== $ || q[26] !== D || q[27] !== g || q[28] !== k || q[29] !== T || q[30] !== M || q[31] !== x.edit || q[32] !== x.execution || q[33] !== x.mcp || q[34] !== x.other || q[35] !== x.readOnly) {
        r = [], r.push({
            id: "continue",
            label: "Continue",
            action: g,
            isContinue: !0
        });
        let z1;
        if (q[37] !== $ || q[38] !== k) z1 = () => {
            let x1 = $.map(yqz);
            m(x1, !k)
        }, q[37] = $, q[38] = k, q[39] = z1;
        else z1 = q[39];
        r.push({
            id: "bucket-all",
            label: `${k?l1.checkboxOn:l1.checkboxOff} All tools`,
            action: z1
        });
        let Y1 = Gwq();
        [{
            id: "bucket-readonly",
            name: Y1.READ_ONLY.name,
            tools: x.readOnly
        }, {
            id: "bucket-edit",
            name: Y1.EDIT.name,
            tools: x.edit
        }, {
            id: "bucket-execution",
            name: Y1.EXECUTION.name,
            tools: x.execution
        }, {
            id: "bucket-mcp",
            name: Y1.MCP.name,
            tools: x.mcp
        }, {
            id: "bucket-other",
            name: Y1.OTHER.name,
            tools: x.other
        }].forEach((x1) => {
            let {
                id: f1,
                name: R1,
                tools: H1
            } = x1;
            if (H1.length === 0) return;
            let B1 = H1.filter((A6) => T.has(A6.name)).length === H1.length;
            r.push({
                id: f1,
                label: `${B1?l1.checkboxOn:l1.checkboxOff} ${R1}`,
                action: l(H1)
            })
        });
        let $1 = r.length,
            G1;
        if (q[40] !== D || q[41] !== M || q[42] !== $1) G1 = () => {
            if (P(!M), M && D > $1) j($1)
        }, q[40] = D, q[41] = M, q[42] = $1, q[43] = G1;
        else G1 = q[43];
        r.push({
            id: "toggle-individual",
            label: M ? "Hide advanced options" : "Show advanced options",
            action: G1,
            isToggle: !0
        });
        let L1 = Eqz($);
        if (M) {
            if (L1.length > 0) r.push({
                id: "mcp-servers-header",
                label: "MCP Servers:",
                action: Rqz,
                isHeader: !0
            }), L1.forEach((x1) => {
                let {
                    serverName: f1,
                    tools: R1
                } = x1, y1 = R1.filter((B1) => T.has(B1.name)).length === R1.length;
                r.push({
                    id: `mcp-server-${f1}`,
                    label: `${y1?l1.checkboxOn:l1.checkboxOff} ${f1} (${R1.length} tool${R1.length===1?"":"s"})`,
                    action: () => {
                        let B1 = R1.map(Lqz);
                        m(B1, !y1)
                    }
                })
            }), r.push({
                id: "tools-header",
                label: "Individual Tools:",
                action: kqz,
                isHeader: !0
            });
            $.forEach((x1) => {
                let f1 = x1.name;
                if (x1.name.startsWith("mcp__")) {
                    let R1 = VD(x1.name);
                    f1 = R1 ? `${R1.toolName} (${R1.serverName})` : x1.name
                }
                r.push({
                    id: `tool-${x1.name}`,
                    label: `${T.has(x1.name)?l1.checkboxOn:l1.checkboxOff} ${f1}`,
                    action: () => B(x1.name)
                })
            })
        }
        q[24] = l, q[25] = $, q[26] = D, q[27] = g, q[28] = k, q[29] = T, q[30] = M, q[31] = x.edit, q[32] = x.execution, q[33] = x.mcp, q[34] = x.other, q[35] = x.readOnly, q[36] = r
    } else r = q[36];
    let s;
    if (q[44] !== Y || q[45] !== w || q[46] !== z) s = () => {
        if (w) w();
        else z(Y)
    }, q[44] = Y, q[45] = w, q[46] = z, q[47] = s;
    else s = q[47];
    let O1 = s,
        T1;
    if (q[48] === Symbol.for("react.memo_cache_sentinel")) T1 = {
        context: "Confirmation"
    }, q[48] = T1;
    else T1 = q[48];
    DA("confirm:no", O1, T1);
    let N1;
    if (q[49] !== D || q[50] !== r) N1 = (z1, Y1) => {
        if (Y1.return) {
            let _1 = r[D];
            if (_1 && !_1.isHeader) _1.action()
        } else if (Y1.upArrow) {
            let _1 = D - 1;
            while (_1 > 0 && r[_1]?.isHeader) _1--;
            j(Math.max(0, _1))
        } else if (Y1.downArrow) {
            let _1 = D + 1;
            while (_1 < r.length - 1 && r[_1]?.isHeader) _1++;
            j(Math.min(r.length - 1, _1))
        }
    }, q[49] = D, q[50] = r, q[51] = N1;
    else N1 = q[51];
    D8(N1);
    let j1 = D === 0 ? "suggestion" : void 0,
        q1 = D === 0,
        t = D === 0 ? `${l1.pointer} ` : "  ",
        J1;
    if (q[52] !== j1 || q[53] !== q1 || q[54] !== t) J1 = wf.default.createElement(V, {
        color: j1,
        bold: q1
    }, t, "[ Continue ]"), q[52] = j1, q[53] = q1, q[54] = t, q[55] = J1;
    else J1 = q[55];
    let D1;
    if (q[56] === Symbol.for("react.memo_cache_sentinel")) D1 = wf.default.createElement(be, {
        width: 40
    }), q[56] = D1;
    else D1 = q[56];
    let Z1;
    if (q[57] !== r) Z1 = r.slice(1), q[57] = r, q[58] = Z1;
    else Z1 = q[58];
    let E1;
    if (q[59] !== D || q[60] !== Z1) E1 = Z1.map((z1, Y1) => {
        let _1 = Y1 + 1 === D,
            $1 = z1.isToggle,
            G1 = z1.isHeader;
        return wf.default.createElement(wf.default.Fragment, {
            key: z1.id
        }, $1 && wf.default.createElement(be, {
            width: 40
        }), G1 && Y1 > 0 && wf.default.createElement(I, {
            marginTop: 1
        }), wf.default.createElement(V, {
            color: G1 ? void 0 : _1 ? "suggestion" : void 0,
            dimColor: G1,
            bold: $1 && _1
        }, G1 ? "" : _1 ? `${l1.pointer} ` : "  ", $1 ? `[ ${z1.label} ]` : z1.label))
    }), q[59] = D, q[60] = Z1, q[61] = E1;
    else E1 = q[61];
    let a = k ? "All tools selected" : `${T.size} of ${$.length} tools selected`,
        A1;
    if (q[62] !== a) A1 = wf.default.createElement(I, {
        marginTop: 1,
        flexDirection: "column"
    }, wf.default.createElement(V, {
        dimColor: !0
    }, a)), q[62] = a, q[63] = A1;
    else A1 = q[63];
    let M1;
    if (q[64] !== J1 || q[65] !== E1 || q[66] !== A1) M1 = wf.default.createElement(I, {
        flexDirection: "column",
        marginTop: 1
    }, J1, D1, E1, A1), q[64] = J1, q[65] = E1, q[66] = A1, q[67] = M1;
    else M1 = q[67];
    return M1
}
// @from(Ln 425314, Col 0)
function kqz() {}
// @from(Ln 425316, Col 0)
function Lqz(A) {
    return A.name
}
// @from(Ln 425320, Col 0)
function Rqz() {}
// @from(Ln 425322, Col 0)
function yqz(A) {
    return A.name
}
// @from(Ln 425326, Col 0)
function Cqz(A) {
    return A.name
}
// @from(Ln 425330, Col 0)
function Sqz(A) {
    return A.name
}
// @from(Ln 425334, Col 0)
function hqz(A) {
    return A.name
}
// @from(Ln 425338, Col 0)
function Iqz(A) {
    return A.name
}
// @from(Ln 425341, Col 4)
wf
// @from(Ln 425341, Col 8)
Gwq = () => ({
    READ_ONLY: {
        name: "Read-only tools",
        toolNames: new Set([WB.name, tS.name, Nj.name, i5.name, Vj.name, bO.name, LW6.name, vW6.name, kW6.name, cd.name, ld.name])
    },
    EDIT: {
        name: "Edit tools",
        toolNames: new Set([sW.name, vj.name, gd.name])
    },
    EXECUTION: {
        name: "Execution tools",
        toolNames: new Set([qq.name, void 0].filter(Boolean))
    },
    MCP: {
        name: "MCP tools",
        toolNames: new Set,
        isMcp: !0
    },
    OTHER: {
        name: "Other tools",
        toolNames: new Set
    }
})
// @from(Ln 425364, Col 4)
UuA = v(() => {
    i1();
    m1();
    m1();
    K7();
    b7();
    guA();
    _T();
    tX();
    cx1();
    $01();
    Tg1();
    YE();
    gW1();
    r_1();
    GRA();
    DRA();
    PRA();
    SW6();
    hW6();
    V51();
    Lt();
    tQ1();
    i0();
    bK1();
    wf = o(X1(), 1)
})
// @from(Ln 425392, Col 0)
function Zwq(A) {
    let q = e(9),
        {
            tools: K
        } = A,
        {
            goNext: Y,
            goBack: z,
            updateWizardData: w,
            wizardData: H
        } = dw(),
        $;
    if (q[0] !== Y || q[1] !== w) $ = (D) => {
        w({
            selectedTools: D
        }), Y()
    }, q[0] = Y, q[1] = w, q[2] = $;
    else $ = q[2];
    let O = $,
        _ = H.selectedTools,
        J;
    if (q[3] === Symbol.for("react.memo_cache_sentinel")) J = i91.default.createElement(oA, null, i91.default.createElement(YA, {
        shortcut: "Enter",
        action: "toggle selection"
    }), i91.default.createElement(YA, {
        shortcut: "↑↓",
        action: "navigate"
    }), i91.default.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "go back"
    })), q[3] = J;
    else J = q[3];
    let X;
    if (q[4] !== z || q[5] !== O || q[6] !== _ || q[7] !== K) X = i91.default.createElement(AO, {
        subtitle: "Select tools",
        footerText: J
    }, i91.default.createElement(bN6, {
        tools: K,
        initialTools: _,
        onComplete: O,
        onCancel: z
    })), q[4] = z, q[5] = O, q[6] = _, q[7] = K, q[8] = X;
    else X = q[8];
    return X
}
// @from(Ln 425439, Col 4)
i91
// @from(Ln 425440, Col 4)
fwq = v(() => {
    i1();
    UuA();
    VE();
    xN();
    wK();
    BK();
    HK();
    i91 = o(X1(), 1)
})
// @from(Ln 425451, Col 0)
function uN6(A) {
    let q = e(12),
        {
            initialModel: K,
            onComplete: Y,
            onCancel: z
        } = A,
        w;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) w = s17(), q[0] = w;
    else w = q[0];
    let H = w,
        $;
    A: {
        if (K && H.some((j) => j.value === K)) {
            $ = K;
            break A
        }
        $ = "sonnet"
    }
    let O = $,
        _;
    if (q[1] === Symbol.for("react.memo_cache_sentinel")) _ = Tc.createElement(I, {
        marginBottom: 1
    }, Tc.createElement(V, {
        dimColor: !0
    }, "Model determines the agent's reasoning capabilities and speed.")), q[1] = _;
    else _ = q[1];
    let J;
    if (q[2] !== Y) J = (j) => {
        Y(j)
    }, q[2] = Y, q[3] = J;
    else J = q[3];
    let X;
    if (q[4] !== K || q[5] !== z || q[6] !== Y) X = () => z ? z() : Y(K), q[4] = K, q[5] = z, q[6] = Y, q[7] = X;
    else X = q[7];
    let D;
    if (q[8] !== O || q[9] !== J || q[10] !== X) D = Tc.createElement(I, {
        flexDirection: "column"
    }, _, Tc.createElement(kA, {
        options: H,
        defaultValue: O,
        onChange: J,
        onCancel: X
    })), q[8] = O, q[9] = J, q[10] = X, q[11] = D;
    else D = q[11];
    return D
}
// @from(Ln 425498, Col 4)
Tc
// @from(Ln 425499, Col 4)
puA = v(() => {
    i1();
    m1();
    U5();
    e7();
    Tc = o(X1(), 1)
})
// @from(Ln 425507, Col 0)
function Vwq() {
    let A = e(8),
        {
            goNext: q,
            goBack: K,
            updateWizardData: Y,
            wizardData: z
        } = dw(),
        w;
    if (A[0] !== q || A[1] !== Y) w = (_) => {
        Y({
            selectedModel: _
        }), q()
    }, A[0] = q, A[1] = Y, A[2] = w;
    else w = A[2];
    let H = w,
        $;
    if (A[3] === Symbol.for("react.memo_cache_sentinel")) $ = n91.default.createElement(oA, null, n91.default.createElement(YA, {
        shortcut: "↑↓",
        action: "navigate"
    }), n91.default.createElement(YA, {
        shortcut: "Enter",
        action: "select"
    }), n91.default.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "go back"
    })), A[3] = $;
    else $ = A[3];
    let O;
    if (A[4] !== K || A[5] !== H || A[6] !== z.selectedModel) O = n91.default.createElement(AO, {
        subtitle: "Select model",
        footerText: $
    }, n91.default.createElement(uN6, {
        initialModel: z.selectedModel,
        onComplete: H,
        onCancel: K
    })), A[4] = K, A[5] = H, A[6] = z.selectedModel, A[7] = O;
    else O = A[7];
    return O
}
// @from(Ln 425549, Col 4)
n91
// @from(Ln 425550, Col 4)
Nwq = v(() => {
    i1();
    puA();
    VE();
    xN();
    wK();
    BK();
    HK();
    n91 = o(X1(), 1)
})
// @from(Ln 425561, Col 0)
function BN6(A) {
    let q = e(16),
        {
            agentName: K,
            currentColor: Y,
            onConfirm: z
        } = A,
        w = Y === void 0 ? "automatic" : Y,
        H;
    if (q[0] !== w) H = pZ1.findIndex((W) => W === w), q[0] = w, q[1] = H;
    else H = q[1];
    let [$, O] = Twq.useState(Math.max(0, H)), _;
    if (q[2] !== z || q[3] !== $) _ = (W, G) => {
        if (G.upArrow) O(bqz);
        else if (G.downArrow) O(xqz);
        else if (G.return) {
            let f = pZ1[$];
            z(f === "automatic" ? void 0 : f)
        }
    }, q[2] = z, q[3] = $, q[4] = _;
    else _ = q[4];
    D8(_);
    let J = pZ1[$],
        X;
    if (q[5] !== $) X = pZ1.map((W, G) => {
        let f = G === $;
        return NE.default.createElement(I, {
            key: W,
            flexDirection: "row",
            gap: 1
        }, NE.default.createElement(V, {
            color: f ? "suggestion" : void 0
        }, f ? l1.pointer : " "), W === "automatic" ? NE.default.createElement(V, {
            bold: f
        }, "Automatic color") : NE.default.createElement(I, {
            gap: 1
        }, NE.default.createElement(V, {
            backgroundColor: lO[W],
            color: "inverseText"
        }, " "), NE.default.createElement(V, {
            bold: f
        }, W.charAt(0).toUpperCase() + W.slice(1))))
    }), q[5] = $, q[6] = X;
    else X = q[6];
    let D;
    if (q[7] !== X) D = NE.default.createElement(I, {
        flexDirection: "column"
    }, X), q[7] = X, q[8] = D;
    else D = q[8];
    let j;
    if (q[9] === Symbol.for("react.memo_cache_sentinel")) j = NE.default.createElement(V, null, "Preview: "), q[9] = j;
    else j = q[9];
    let M;
    if (q[10] !== K || q[11] !== J) M = NE.default.createElement(I, {
        marginTop: 1
    }, j, J === void 0 || J === "automatic" ? NE.default.createElement(V, {
        inverse: !0,
        bold: !0
    }, " ", "@", K, " ") : NE.default.createElement(V, {
        backgroundColor: lO[J],
        color: "inverseText",
        bold: !0
    }, " ", "@", K, " ")), q[10] = K, q[11] = J, q[12] = M;
    else M = q[12];
    let P;
    if (q[13] !== D || q[14] !== M) P = NE.default.createElement(I, {
        flexDirection: "column",
        gap: 1
    }, D, M), q[13] = D, q[14] = M, q[15] = P;
    else P = q[15];
    return P
}
// @from(Ln 425634, Col 0)
function xqz(A) {
    return A < pZ1.length - 1 ? A + 1 : 0
}
// @from(Ln 425638, Col 0)
function bqz(A) {
    return A > 0 ? A - 1 : pZ1.length - 1
}
// @from(Ln 425641, Col 4)
NE
// @from(Ln 425641, Col 8)
Twq
// @from(Ln 425641, Col 13)
pZ1
// @from(Ln 425642, Col 4)
duA = v(() => {
    i1();
    m1();
    lM();
    b7();
    NE = o(X1(), 1), Twq = o(X1(), 1), pZ1 = ["automatic", ...cO]
})
// @from(Ln 425650, Col 0)
function vwq() {
    let A = e(14),
        {
            goNext: q,
            goBack: K,
            updateWizardData: Y,
            wizardData: z
        } = dw(),
        w;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) w = {
        context: "Confirmation"
    }, A[0] = w;
    else w = A[0];
    DA("confirm:no", K, w);
    let H;
    if (A[1] !== q || A[2] !== Y || A[3] !== z.agentType || A[4] !== z.location || A[5] !== z.selectedModel || A[6] !== z.selectedTools || A[7] !== z.systemPrompt || A[8] !== z.whenToUse) H = (X) => {
        Y({
            selectedColor: X,
            finalAgent: {
                agentType: z.agentType,
                whenToUse: z.whenToUse,
                getSystemPrompt: () => z.systemPrompt,
                tools: z.selectedTools,
                ...z.selectedModel ? {
                    model: z.selectedModel
                } : {},
                ...X ? {
                    color: X
                } : {},
                source: z.location
            }
        }), q()
    }, A[1] = q, A[2] = Y, A[3] = z.agentType, A[4] = z.location, A[5] = z.selectedModel, A[6] = z.selectedTools, A[7] = z.systemPrompt, A[8] = z.whenToUse, A[9] = H;
    else H = A[9];
    let $ = H,
        O;
    if (A[10] === Symbol.for("react.memo_cache_sentinel")) O = ue.default.createElement(oA, null, ue.default.createElement(YA, {
        shortcut: "↑↓",
        action: "navigate"
    }), ue.default.createElement(YA, {
        shortcut: "Enter",
        action: "select"
    }), ue.default.createElement(NA, {
        action: "confirm:no",
        context: "Confirmation",
        fallback: "Esc",
        description: "go back"
    })), A[10] = O;
    else O = A[10];
    let _ = z.agentType || "agent",
        J;
    if (A[11] !== $ || A[12] !== _) J = ue.default.createElement(AO, {
        subtitle: "Choose background color",
        footerText: O
    }, ue.default.createElement(I, {
        marginTop: 1
    }, ue.default.createElement(BN6, {
        agentName: _,
        currentColor: "automatic",
        onConfirm: $
    }))), A[11] = $, A[12] = _, A[13] = J;
    else J = A[13];
    return J
}
// @from(Ln 425714, Col 4)
ue
// @from(Ln 425715, Col 4)
Ewq = v(() => {
    i1();
    m1();
    duA();
    VE();
    xN();
    wK();
    BK();
    HK();
    K7();
    ue = o(X1(), 1)
})