
// @from(Ln 517590, Col 0)
function oX7(q) {
    let K = s(122),
        {
            toolUseConfirm: _,
            onDone: z,
            onReject: Y,
            highlight: A
        } = q,
        O;
    if (K[0] !== _.input) O = KI6.inputSchema.safeParse(_.input), K[0] = _.input, K[1] = O;
    else O = K[1];
    let w = O,
        $;
    if (K[2] !== w.data || K[3] !== w.success) $ = w.success ? w.data.questions || [] : [], K[2] = w.data, K[3] = w.success, K[4] = $;
    else $ = K[4];
    let j = $,
        {
            rows: H
        } = s1(),
        [J] = Zq(),
        X = 0,
        M = 0,
        P = Math.max(q45, H - J4A);
    if (K[5] !== A || K[6] !== P || K[7] !== X || K[8] !== M || K[9] !== j || K[10] !== J) {
        for (let W8 of j)
            if (W8.options.some(f4A)) {
                let s6 = Math.max(1, P - 11),
                    u6 = 0;
                for (let x6 of W8.options)
                    if (x6.preview) {
                        let v8 = Sg8(x6.preview, J, A).split(`
`),
                            f1 = v8.length > s6,
                            g8 = f1 ? s6 : v8.length;
                        u6 = Math.max(u6, g8 + (f1 ? 1 : 0) + 2);
                        for (let w6 of v8) M = Math.max(M, N1(w6))
                    } let h6 = u6 + 2,
                    _8 = W8.options.length + 2,
                    R8 = Math.max(_8, h6);
                X = Math.max(X, R8 + 7)
            } else X = Math.max(X, W8.options.length + 3 + 7);
        K[5] = A, K[6] = P, K[7] = X, K[8] = M, K[9] = j, K[10] = J, K[11] = X
    } else X = K[11];
    let W = Math.min(Math.max(X, q45), P),
        D = Math.max(M, H4A),
        Z;
    if (K[12] !== W || K[13] !== D) Z = {
        globalContentHeight: W,
        globalContentWidth: D
    }, K[12] = W, K[13] = D, K[14] = Z;
    else Z = K[14];
    let {
        globalContentHeight: G,
        globalContentWidth: f
    } = Z, v = w.success ? w.data.metadata?.source : void 0, V;
    if (K[15] === Symbol.for("react.memo_cache_sentinel")) V = {}, K[15] = V;
    else V = K[15];
    let [k, N] = jW.useState(V), R = jW.useRef(0), h = R7(), C;
    if (K[16] !== h) C = function(G8, s6, u6, h6, _8, R8) {
        R.current = R.current + 1;
        let x6 = R.current,
            i6 = {
                id: x6,
                type: "image",
                content: s6,
                mediaType: u6 || "image/png",
                filename: h6 || "Pasted image",
                dimensions: _8
            };
        eu6(i6, h), qm6(i6, h), N((v8) => ({
            ...v8,
            [G8]: {
                ...v8[G8] ?? {},
                [x6]: i6
            }
        }))
    }, K[16] = h, K[17] = C;
    else C = K[17];
    let x = C,
        B;
    if (K[18] === Symbol.for("react.memo_cache_sentinel")) B = (W8, G8) => {
        N((s6) => {
            let u6 = {
                ...s6[W8] ?? {}
            };
            return delete u6[G8], {
                ...s6,
                [W8]: u6
            }
        })
    }, K[18] = B;
    else B = K[18];
    let m = B,
        S;
    if (K[19] !== k) S = Object.values(k).flatMap(Z4A).filter(D4A), K[19] = k, K[20] = S;
    else S = K[20];
    let F = S,
        U = M8(W4A),
        g = s2(),
        c;
    if (K[21] !== g) c = vO(g), K[21] = g, K[22] = c;
    else c = K[22];
    let n = c,
        l = U === "plan",
        z6;
    if (K[23] !== l) z6 = l ? eW() : void 0, K[23] = l, K[24] = z6;
    else z6 = K[24];
    let A6 = z6,
        e = tq5(),
        {
            currentQuestionIndex: i,
            answers: O6,
            questionStates: J6,
            isInTextInput: $6,
            nextQuestion: H6,
            prevQuestion: q6,
            updateQuestionState: o,
            setAnswer: _6,
            setTextInputMode: r
        } = e,
        t = i < (j?.length || 0) ? j?.[i] : null,
        Y6 = i === (j?.length || 0),
        X6;
    if (K[25] !== O6 || K[26] !== j) X6 = j?.every((W8) => W8?.question && !!O6[W8.question]) ?? !1, K[25] = O6, K[26] = j, K[27] = X6;
    else X6 = K[27];
    let M6 = X6,
        W6 = j.length === 1 && !j[0]?.multiSelect,
        V6;
    if (K[28] !== l || K[29] !== v || K[30] !== z || K[31] !== Y || K[32] !== j.length || K[33] !== _) V6 = () => {
        if (v) d("tengu_ask_user_question_rejected", {
            source: v,
            questionCount: j.length,
            isInPlanMode: l,
            interviewPhaseEnabled: l && Sj()
        });
        z(), Y(), _.onReject()
    }, K[28] = l, K[29] = v, K[30] = z, K[31] = Y, K[32] = j.length, K[33] = _, K[34] = V6;
    else V6 = K[34];
    let f6 = V6,
        G6;
    if (K[35] !== F || K[36] !== O6 || K[37] !== n || K[38] !== l || K[39] !== v || K[40] !== z || K[41] !== j || K[42] !== _) G6 = async () => {
        let G8 = `The user wants to clarify these questions.
    This means they may have additional information, context or questions for you.
    Take their response into account and then reformulate the questions if appropriate.
    Start by asking them what they would like to clarify.

    Questions asked:
${j.map((u6)=>{let h6=O6[u6.question];if(h6)return`- "${u6.question}"
  Answer: ${h6}`;return`- "${u6.question}"
  (No answer provided)`}).join(`
        `)}`;
        if (v) d("tengu_ask_user_question_respond_to_claude", {
            source: v,
            questionCount: j.length,
            isInPlanMode: l,
            interviewPhaseEnabled: l && Sj()
        });
        let s6 = await rX7(F, n);
        z(), _.onReject(G8, s6 && s6.length > 0 ? s6 : void 0)
    }, K[35] = F, K[36] = O6, K[37] = n, K[38] = l, K[39] = v, K[40] = z, K[41] = j, K[42] = _, K[43] = G6;
    else G6 = K[43];
    let k6 = G6,
        T6;
    if (K[44] !== F || K[45] !== O6 || K[46] !== n || K[47] !== l || K[48] !== v || K[49] !== z || K[50] !== j || K[51] !== _) T6 = async () => {
        let G8 = `The user has indicated they have provided enough answers for the plan interview.
Stop asking clarifying questions and proceed to finish the plan with the information you have.

Questions asked and answers provided:
${j.map((u6)=>{let h6=O6[u6.question];if(h6)return`- "${u6.question}"
  Answer: ${h6}`;return`- "${u6.question}"
  (No answer provided)`}).join(`
        `)}`;
        if (v) d("tengu_ask_user_question_finish_plan_interview", {
            source: v,
            questionCount: j.length,
            isInPlanMode: l,
            interviewPhaseEnabled: l && Sj()
        });
        let s6 = await rX7(F, n);
        z(), _.onReject(G8, s6 && s6.length > 0 ? s6 : void 0)
    }, K[44] = F, K[45] = O6, K[46] = n, K[47] = l, K[48] = v, K[49] = z, K[50] = j, K[51] = _, K[52] = T6;
    else T6 = K[52];
    let v6 = T6,
        L6;
    if (K[53] !== F || K[54] !== n || K[55] !== l || K[56] !== v || K[57] !== z || K[58] !== J6 || K[59] !== j || K[60] !== _) L6 = async (W8) => {
        if (v) d("tengu_ask_user_question_accepted", {
            source: v,
            questionCount: j.length,
            answerCount: Object.keys(W8).length,
            isInPlanMode: l,
            interviewPhaseEnabled: l && Sj()
        });
        let G8 = {};
        for (let h6 of j) {
            let _8 = W8[h6.question],
                R8 = J6[h6.question]?.textInputValue,
                i6 = (_8 ? h6.options.find((v8) => v8.label === _8) : void 0)?.preview;
            if (i6 || R8?.trim()) G8[h6.question] = {
                ...i6 && {
                    preview: i6
                },
                ...R8?.trim() && {
                    notes: R8.trim()
                }
            }
        }
        let s6 = {
                ..._.input,
                answers: W8,
                ...Object.keys(G8).length > 0 && {
                    annotations: G8
                }
            },
            u6 = await rX7(F, n);
        z(), _.onAllow(s6, [], void 0, u6 && u6.length > 0 ? u6 : void 0)
    }, K[53] = F, K[54] = n, K[55] = l, K[56] = v, K[57] = z, K[58] = J6, K[59] = j, K[60] = _, K[61] = L6;
    else L6 = K[61];
    let y6 = L6,
        c6;
    if (K[62] !== O6 || K[63] !== k || K[64] !== j.length || K[65] !== _6 || K[66] !== y6) c6 = (W8, G8, s6, u6) => {
        let h6 = u6 === void 0 ? !0 : u6,
            _8, R8 = Array.isArray(G8);
        if (R8) _8 = G8.join(", ");
        else if (s6) _8 = Object.values(k[W8] ?? {}).filter(P4A).length > 0 ? `${s6} (Image attached)` : s6;
        else if (G8 === "__other__") _8 = Object.values(k[W8] ?? {}).filter(M4A).length > 0 ? "(Image attached)" : G8;
        else _8 = G8;
        let x6 = j.length === 1;
        if (!R8 && x6 && h6) {
            let i6 = {
                ...O6,
                [W8]: _8
            };
            y6(i6).catch(j6);
            return
        }
        _6(W8, _8, h6)
    }, K[62] = O6, K[63] = k, K[64] = j.length, K[65] = _6, K[66] = y6, K[67] = c6;
    else c6 = K[67];
    let Z8 = c6,
        N8;
    if (K[68] !== O6 || K[69] !== f6 || K[70] !== y6) N8 = function(G8) {
        if (G8 === "cancel") {
            f6();
            return
        }
        if (G8 === "submit") y6(O6).catch(j6)
    }, K[68] = O6, K[69] = f6, K[70] = y6, K[71] = N8;
    else N8 = K[71];
    let R6 = N8,
        p6 = W6 ? (j?.length || 1) - 1 : j?.length || 0,
        q8;
    if (K[72] !== i || K[73] !== q6) q8 = () => {
        if (i > 0) q6()
    }, K[72] = i, K[73] = q6, K[74] = q8;
    else q8 = K[74];
    let L8 = q8,
        w8;
    if (K[75] !== i || K[76] !== p6 || K[77] !== H6) w8 = () => {
        if (i < p6) H6()
    }, K[75] = i, K[76] = p6, K[77] = H6, K[78] = w8;
    else w8 = K[78];
    let x8 = w8,
        a6;
    if (K[79] !== x8 || K[80] !== L8) a6 = {
        "tabs:previous": L8,
        "tabs:next": x8
    }, K[79] = x8, K[80] = L8, K[81] = a6;
    else a6 = K[81];
    let D8 = !($6 && !Y6),
        Q6;
    if (K[82] !== D8) Q6 = {
        context: "Tabs",
        isActive: D8
    }, K[82] = D8, K[83] = Q6;
    else Q6 = K[83];
    if (L7(a6, Q6), t) {
        let W8;
        if (K[84] !== t.question || K[85] !== x) W8 = (h6, _8, R8, x6, i6) => x(t.question, h6, _8, R8, x6, i6), K[84] = t.question, K[85] = x, K[86] = W8;
        else W8 = K[86];
        let G8;
        if (K[87] !== t.question || K[88] !== k) G8 = k[t.question] ?? {}, K[87] = t.question, K[88] = k, K[89] = G8;
        else G8 = K[89];
        let s6;
        if (K[90] !== t.question) s6 = (h6) => m(t.question, h6), K[90] = t.question, K[91] = s6;
        else s6 = K[91];
        let u6;
        if (K[92] !== O6 || K[93] !== t || K[94] !== i || K[95] !== G || K[96] !== f || K[97] !== f6 || K[98] !== v6 || K[99] !== Z8 || K[100] !== k6 || K[101] !== x8 || K[102] !== L8 || K[103] !== W6 || K[104] !== H6 || K[105] !== A6 || K[106] !== J6 || K[107] !== j || K[108] !== r || K[109] !== W8 || K[110] !== G8 || K[111] !== s6 || K[112] !== o) u6 = jW.default.createElement(jW.default.Fragment, null, jW.default.createElement(rq5, {
            question: t,
            questions: j,
            currentQuestionIndex: i,
            answers: O6,
            questionStates: J6,
            hideSubmitTab: W6,
            minContentHeight: G,
            minContentWidth: f,
            planFilePath: A6,
            onUpdateQuestionState: o,
            onAnswer: Z8,
            onTextInputFocus: r,
            onCancel: f6,
            onSubmit: H6,
            onTabPrev: L8,
            onTabNext: x8,
            onRespondToClaude: k6,
            onFinishPlanInterview: v6,
            onImagePaste: W8,
            pastedContents: G8,
            onRemoveImage: s6
        })), K[92] = O6, K[93] = t, K[94] = i, K[95] = G, K[96] = f, K[97] = f6, K[98] = v6, K[99] = Z8, K[100] = k6, K[101] = x8, K[102] = L8, K[103] = W6, K[104] = H6, K[105] = A6, K[106] = J6, K[107] = j, K[108] = r, K[109] = W8, K[110] = G8, K[111] = s6, K[112] = o, K[113] = u6;
        else u6 = K[113];
        return u6
    }
    if (Y6) {
        let W8;
        if (K[114] !== M6 || K[115] !== O6 || K[116] !== i || K[117] !== G || K[118] !== R6 || K[119] !== j || K[120] !== _.permissionResult) W8 = jW.default.createElement(jW.default.Fragment, null, jW.default.createElement(aq5, {
            questions: j,
            currentQuestionIndex: i,
            answers: O6,
            allQuestionsAnswered: M6,
            permissionResult: _.permissionResult,
            minContentHeight: G,
            onFinalResponse: R6
        })), K[114] = M6, K[115] = O6, K[116] = i, K[117] = G, K[118] = R6, K[119] = j, K[120] = _.permissionResult, K[121] = W8;
        else W8 = K[121];
        return W8
    }
    return null
}
// @from(Ln 517919, Col 0)
function M4A(q) {
    return q.type === "image"
}
// @from(Ln 517923, Col 0)
function P4A(q) {
    return q.type === "image"
}
// @from(Ln 517927, Col 0)
function W4A(q) {
    return q.toolPermissionContext.mode
}
// @from(Ln 517931, Col 0)
function D4A(q) {
    return q.type === "image"
}
// @from(Ln 517935, Col 0)
function Z4A(q) {
    return Object.values(q)
}
// @from(Ln 517939, Col 0)
function f4A(q) {
    return q.preview
}
// @from(Ln 517942, Col 0)
async function rX7(q, K) {
    if (q.length === 0) return;
    return Promise.all(q.map(async (_) => {
        let {
            block: z
        } = await sE({
            data: _.content,
            mediaType: _.mediaType,
            limits: K
        });
        return z
    }))
}
// @from(Ln 517955, Col 4)
jW
// @from(Ln 517955, Col 8)
q45 = 12
// @from(Ln 517956, Col 4)
H4A = 40
// @from(Ln 517957, Col 4)
J4A = 15
// @from(Ln 517958, Col 4)
_45 = L(() => {
    o6();
    oy();
    tE();
    I4();
    n5();
    g6();
    C7();
    C8();
    N7();
    Xd8();
    fJ6();
    CI();
    Km6();
    U8();
    vK8();
    Jk();
    e96();
    NJ();
    oq5();
    sq5();
    eq5();
    jW = K6(P6(), 1)
})
// @from(Ln 517983, Col 0)
function z45(q) {
    for (let {
            pattern: K,
            warning: _
        }
        of G4A)
        if (K.test(q)) return _;
    return null
}
// @from(Ln 517992, Col 4)
G4A
// @from(Ln 517993, Col 4)
Y45 = L(() => {
    G4A = [{
        pattern: /\bgit\s+reset\s+--hard\b/,
        warning: "Note: may discard uncommitted changes"
    }, {
        pattern: /\bgit\s+push\b[^;&|\n]*[ \t](--force|--force-with-lease|-f)\b/,
        warning: "Note: may overwrite remote history"
    }, {
        pattern: /\bgit\s+clean\b(?![^;&|\n]*(?:-[a-zA-Z]*n|--dry-run))[^;&|\n]*-[a-zA-Z]*f/,
        warning: "Note: may permanently delete untracked files"
    }, {
        pattern: /\bgit\s+checkout\s+(--\s+)?\.[ \t]*($|[;&|\n])/,
        warning: "Note: may discard all working tree changes"
    }, {
        pattern: /\bgit\s+restore\s+(--\s+)?\.[ \t]*($|[;&|\n])/,
        warning: "Note: may discard all working tree changes"
    }, {
        pattern: /\bgit\s+stash[ \t]+(drop|clear)\b/,
        warning: "Note: may permanently remove stashed changes"
    }, {
        pattern: /\bgit\s+branch\s+(-D[ \t]|--delete\s+--force|--force\s+--delete)\b/,
        warning: "Note: may force-delete a branch"
    }, {
        pattern: /\bgit\s+(commit|push|merge)\b[^;&|\n]*--no-verify\b/,
        warning: "Note: may skip safety hooks"
    }, {
        pattern: /\bgit\s+commit\b[^;&|\n]*--amend\b/,
        warning: "Note: may rewrite the last commit"
    }, {
        pattern: /(^|[;&|\n]\s*)rm\s+-[a-zA-Z]*[rR][a-zA-Z]*f|(^|[;&|\n]\s*)rm\s+-[a-zA-Z]*f[a-zA-Z]*[rR]/,
        warning: "Note: may recursively force-remove files"
    }, {
        pattern: /(^|[;&|\n]\s*)rm\s+-[a-zA-Z]*[rR]/,
        warning: "Note: may recursively remove files"
    }, {
        pattern: /(^|[;&|\n]\s*)rm\s+-[a-zA-Z]*f/,
        warning: "Note: may force-remove files"
    }, {
        pattern: /\b(DROP|TRUNCATE)\s+(TABLE|DATABASE|SCHEMA)\b/i,
        warning: "Note: may drop or truncate database objects"
    }, {
        pattern: /\bDELETE\s+FROM\s+\w+[ \t]*(;|"|'|\n|$)/i,
        warning: "Note: may delete all rows from a database table"
    }, {
        pattern: /\bkubectl\s+delete\b/,
        warning: "Note: may delete Kubernetes resources"
    }, {
        pattern: /\bterraform\s+destroy\b/,
        warning: "Note: may destroy Terraform infrastructure"
    }]
})
// @from(Ln 518045, Col 0)
function aX7(q, K) {
    if (!K?.subcommands?.length) return !1;
    let _ = q.toLowerCase();
    return K.subcommands.some((z) => Array.isArray(z.name) ? z.name.some((Y) => Y.toLowerCase() === _) : z.name.toLowerCase() === _)
}
// @from(Ln 518051, Col 0)
function A45(q, K, _) {
    if (_?.options) {
        let z = _.options.find((Y) => Array.isArray(Y.name) ? Y.name.includes(q) : Y.name === q);
        if (z) return !!z.args
    }
    if (_?.subcommands?.length && K && !K.startsWith("-")) return !aX7(K, _);
    return !1
}
// @from(Ln 518060, Col 0)
function T4A(q, K) {
    for (let _ = 0; _ < q.length; _++) {
        let z = q[_];
        if (!z) continue;
        if (z.startsWith("-")) {
            if (A45(z, q[_ + 1], K)) _++;
            continue
        }
        if (!K?.subcommands?.length) return z;
        if (aX7(z, K)) return z
    }
    return
}
// @from(Ln 518073, Col 0)
async function ea8(q, K, _) {
    let z = await V4A(q, K, _),
        Y = [q],
        A = !!_?.subcommands?.length,
        O = !1;
    for (let w = 0; w < K.length; w++) {
        let $ = K[w];
        if (!$ || Y.length >= z) break;
        if ($.startsWith("-")) {
            if ($ === "-c" && ["python", "python3"].includes(q.toLowerCase())) break;
            if (_?.options) {
                let j = _.options.find((H) => Array.isArray(H.name) ? H.name.includes($) : H.name === $);
                if (j?.args && Ym6(j.args).some((H) => H?.isCommand || H?.isModule)) {
                    Y.push($);
                    continue
                }
            }
            if (A && !O) {
                if (A45($, K[w + 1], _)) w++;
                continue
            }
            break
        }
        if (await k4A($, K.slice(0, w), _)) break;
        if (A && !O) O = aX7($, _);
        Y.push($)
    }
    return Y.join(" ")
}
// @from(Ln 518102, Col 0)
async function V4A(q, K, _) {
    let z = T4A(K, _),
        Y = q.toLowerCase(),
        A = z ? `${Y} ${z.toLowerCase()}` : Y;
    if (xW6[A]) return xW6[A];
    if (xW6[Y]) return xW6[Y];
    if (!_) return 2;
    if (_.options && K.some((O) => O?.startsWith("-")))
        for (let O of K) {
            if (!O?.startsWith("-")) continue;
            let w = _.options.find(($) => Array.isArray($.name) ? $.name.includes(O) : $.name === O);
            if (w?.args && Ym6(w.args).some(($) => $?.isCommand || $?.isModule)) return 3
        }
    if (z && _.subcommands?.length) {
        let O = z.toLowerCase(),
            w = _.subcommands.find(($) => Array.isArray($.name) ? $.name.some((j) => j.toLowerCase() === O) : $.name.toLowerCase() === O);
        if (w) {
            if (w.args) {
                let $ = Ym6(w.args);
                if ($.some((j) => j?.isCommand)) return 3;
                if ($.some((j) => j?.isVariadic)) return 2
            }
            if (w.subcommands?.length) return 4;
            if (!w.args) return 2;
            return 3
        }
    }
    if (_.args) {
        let O = Ym6(_.args);
        if (O.some((w) => w?.isCommand)) return !Array.isArray(_.args) && _.args.isCommand ? 2 : Math.min(2 + O.findIndex((w) => w?.isCommand), 3);
        if (!_.subcommands?.length) {
            if (O.some((w) => w?.isVariadic)) return 1;
            if (O[0] && !O[0].isOptional) return 2
        }
    }
    return _.args && Ym6(_.args).some((O) => O?.isDangerous) ? 3 : 2
}
// @from(Ln 518139, Col 0)
async function k4A(q, K, _) {
    if (q.startsWith("-")) return !0;
    let z = q.lastIndexOf("."),
        Y = z > 0 && z < q.length - 1 && !q.substring(z + 1).includes(":"),
        A = q.includes("/") || Y,
        O = v4A.some((w) => q.startsWith(w));
    if (!A && !O) return !1;
    if (_?.options && K.length > 0 && K[K.length - 1] === "-m") {
        let w = _.options.find(($) => Array.isArray($.name) ? $.name.includes("-m") : $.name === "-m");
        if (w?.args && Ym6(w.args).some(($) => $?.isModule)) return !1
    }
    return !0
}
// @from(Ln 518152, Col 4)
v4A
// @from(Ln 518152, Col 9)
xW6
// @from(Ln 518152, Col 14)
Ym6 = (q) => Array.isArray(q) ? q : [q]
// @from(Ln 518153, Col 4)
sX7 = L(() => {
    v4A = ["http://", "https://", "ftp://"], xW6 = {
        rg: 2,
        "pre-commit": 2,
        gcloud: 4,
        "gcloud compute": 6,
        "gcloud beta": 6,
        aws: 4,
        az: 4,
        kubectl: 3,
        docker: 3,
        dotnet: 3,
        "git push": 2
    }
})
// @from(Ln 518168, Col 4)
N4A
// @from(Ln 518168, Col 9)
O45
// @from(Ln 518169, Col 4)
w45 = L(() => {
    N4A = {
        name: "alias",
        description: "Create or list command aliases",
        args: {
            name: "definition",
            description: "Alias definition in the form name=value",
            isOptional: !0,
            isVariadic: !0
        }
    }, O45 = N4A
})
// @from(Ln 518181, Col 4)
E4A
// @from(Ln 518181, Col 9)
$45
// @from(Ln 518182, Col 4)
j45 = L(() => {
    E4A = {
        name: "nohup",
        description: "Run a command immune to hangups",
        args: {
            name: "command",
            description: "Command to run with nohup",
            isCommand: !0
        }
    }, $45 = E4A
})
// @from(Ln 518193, Col 4)
H45
// @from(Ln 518194, Col 4)
J45 = L(() => {
    H45 = {
        name: "pyright",
        description: "Type checker for Python",
        options: [{
            name: ["--help", "-h"],
            description: "Show help message"
        }, {
            name: "--version",
            description: "Print pyright version and exit"
        }, {
            name: ["--watch", "-w"],
            description: "Continue to run and watch for changes"
        }, {
            name: ["--project", "-p"],
            description: "Use the configuration file at this location",
            args: {
                name: "FILE OR DIRECTORY"
            }
        }, {
            name: "-",
            description: "Read file or directory list from stdin"
        }, {
            name: "--createstub",
            description: "Create type stub file(s) for import",
            args: {
                name: "IMPORT"
            }
        }, {
            name: ["--typeshedpath", "-t"],
            description: "Use typeshed type stubs at this location",
            args: {
                name: "DIRECTORY"
            }
        }, {
            name: "--verifytypes",
            description: "Verify completeness of types in py.typed package",
            args: {
                name: "IMPORT"
            }
        }, {
            name: "--ignoreexternal",
            description: "Ignore external imports for --verifytypes"
        }, {
            name: "--pythonpath",
            description: "Path to the Python interpreter",
            args: {
                name: "FILE"
            }
        }, {
            name: "--pythonplatform",
            description: "Analyze for platform",
            args: {
                name: "PLATFORM"
            }
        }, {
            name: "--pythonversion",
            description: "Analyze for Python version",
            args: {
                name: "VERSION"
            }
        }, {
            name: ["--venvpath", "-v"],
            description: "Directory that contains virtual environments",
            args: {
                name: "DIRECTORY"
            }
        }, {
            name: "--outputjson",
            description: "Output results in JSON format"
        }, {
            name: "--verbose",
            description: "Emit verbose diagnostics"
        }, {
            name: "--stats",
            description: "Print detailed performance stats"
        }, {
            name: "--dependencies",
            description: "Emit import dependency information"
        }, {
            name: "--level",
            description: "Minimum diagnostic level",
            args: {
                name: "LEVEL"
            }
        }, {
            name: "--skipunannotated",
            description: "Skip type analysis of unannotated functions"
        }, {
            name: "--warnings",
            description: "Use exit code of 1 if warnings are reported"
        }, {
            name: "--threads",
            description: "Use up to N threads to parallelize type checking",
            args: {
                name: "N",
                isOptional: !0
            }
        }],
        args: {
            name: "files",
            description: "Specify files or directories to analyze (overrides config file)",
            isVariadic: !0,
            isOptional: !0
        }
    }
})
// @from(Ln 518301, Col 4)
y4A
// @from(Ln 518301, Col 9)
X45
// @from(Ln 518302, Col 4)
M45 = L(() => {
    y4A = {
        name: "sleep",
        description: "Delay for a specified amount of time",
        args: {
            name: "duration",
            description: "Duration to sleep (seconds or with suffix like 5s, 2m, 1h)",
            isOptional: !1
        }
    }, X45 = y4A
})
// @from(Ln 518313, Col 4)
L4A
// @from(Ln 518313, Col 9)
P45
// @from(Ln 518314, Col 4)
W45 = L(() => {
    L4A = {
        name: "srun",
        description: "Run a command on SLURM cluster nodes",
        options: [{
            name: ["-n", "--ntasks"],
            description: "Number of tasks",
            args: {
                name: "count",
                description: "Number of tasks to run"
            }
        }, {
            name: ["-N", "--nodes"],
            description: "Number of nodes",
            args: {
                name: "count",
                description: "Number of nodes to allocate"
            }
        }],
        args: {
            name: "command",
            description: "Command to run on the cluster",
            isCommand: !0
        }
    }, P45 = L4A
})
// @from(Ln 518340, Col 4)
h4A
// @from(Ln 518340, Col 9)
D45
// @from(Ln 518341, Col 4)
Z45 = L(() => {
    h4A = {
        name: "time",
        description: "Time a command",
        args: {
            name: "command",
            description: "Command to time",
            isCommand: !0
        }
    }, D45 = h4A
})
// @from(Ln 518352, Col 4)
R4A
// @from(Ln 518352, Col 9)
f45
// @from(Ln 518353, Col 4)
G45 = L(() => {
    R4A = {
        name: "timeout",
        description: "Run a command with a time limit",
        args: [{
            name: "duration",
            description: "Duration to wait before timing out (e.g., 10, 5s, 2m)",
            isOptional: !1
        }, {
            name: "command",
            description: "Command to run",
            isCommand: !0
        }]
    }, f45 = R4A
})
// @from(Ln 518368, Col 4)
tX7
// @from(Ln 518369, Col 4)
v45 = L(() => {
    w45();
    j45();
    J45();
    M45();
    W45();
    Z45();
    G45();
    tX7 = [H45, f45, X45, O45, $45, D45, P45]
})
// @from(Ln 518379, Col 0)
async function S4A(q) {
    if (!q || q.includes("/") || q.includes("\\")) return null;
    if (q.includes("..")) return null;
    if (q.startsWith("-") && q !== "-") return null;
    try {
        let K = await import(`@withfig/autocomplete/build/${q}.js`);
        return K.default || K
    } catch {
        return null
    }
}
// @from(Ln 518390, Col 4)
Am6
// @from(Ln 518391, Col 4)
eX7 = L(() => {
    Lm();
    v45();
    Am6 = aX(async (q) => {
        return tX7.find((_) => _.name === q) || await S4A(q) || null
    }, (q) => q)
})
// @from(Ln 518399, Col 0)
function I4A(q, K) {
    if (!K?.subcommands?.length) return !1;
    return K.subcommands.some((_) => Array.isArray(_.name) ? _.name.includes(q) : _.name === q)
}
// @from(Ln 518403, Col 0)
async function qs8(q, K = 0, _ = 0) {
    if (_ > 2 || K > 10) return null;
    let z = await Yg1(q);
    if (!z) return null;
    if (!z.commandNode) return {
        commandPrefix: null
    };
    let {
        envVars: Y,
        commandNode: A
    } = z, O = Ut6(A), [w, ...$] = O;
    if (!w) return {
        commandPrefix: null
    };
    let j = await Am6(w),
        H = b4A.has(w) || j?.args && V45(j.args).some((M) => M?.isCommand);
    if (H && $[0] && I4A($[0], j)) H = !1;
    let J = H ? await x4A(w, $, K, _) : await ea8(w, $, j);
    if (J === null && K === 0 && H) return null;
    let X = Y.length ? `${Y.join(" ")} ` : "";
    return {
        commandPrefix: J ? X + J : null
    }
}
// @from(Ln 518427, Col 0)
async function x4A(q, K, _, z) {
    let Y = await Am6(q);
    if (Y?.args) {
        let w = V45(Y.args).findIndex(($) => $?.isCommand);
        if (w !== -1) {
            let $ = [q];
            for (let j = 0; j < K.length && j <= w; j++)
                if (j === w) {
                    let H = await qs8(K.slice(j).join(" "), _ + 1, z + 1);
                    if (H?.commandPrefix) return $.push(...H.commandPrefix.split(" ")), $.join(" ");
                    break
                } else if (K[j] && !K[j].startsWith("-") && !T45.test(K[j])) $.push(K[j])
        }
    }
    let A = K.find((w) => !w.startsWith("-") && !C4A.test(w) && !T45.test(w));
    if (!A) return q;
    let O = await qs8(K.slice(K.indexOf(A)).join(" "), _ + 1, z + 1);
    return !O?.commandPrefix ? null : `${q} ${O.commandPrefix}`
}
// @from(Ln 518446, Col 0)
async function k45(q, K) {
    let _ = TO(q);
    if (_.length <= 1) {
        let O = await qs8(q);
        return O?.commandPrefix ? [O.commandPrefix] : []
    }
    let z = [];
    for (let O of _) {
        let w = O.trim();
        if (K?.(w)) continue;
        let $ = await qs8(w);
        if ($?.commandPrefix) z.push($.commandPrefix)
    }
    if (z.length === 0) return [];
    let Y = new Map;
    for (let O of z) {
        let w = O.split(" ")[0],
            $ = Y.get(w);
        if ($) $.push(O);
        else Y.set(w, [O])
    }
    let A = [];
    for (let [, O] of Y) A.push(u4A(O));
    return A
}
// @from(Ln 518472, Col 0)
function u4A(q) {
    if (q.length === 0) return "";
    if (q.length === 1) return q[0];
    let _ = q[0].split(" "),
        z = _.length;
    for (let Y = 1; Y < q.length; Y++) {
        let A = q[Y].split(" "),
            O = 0;
        while (O < z && O < A.length && _[O] === A[O]) O++;
        z = O
    }
    return _.slice(0, Math.max(1, z)).join(" ")
}
// @from(Ln 518485, Col 4)
C4A
// @from(Ln 518485, Col 9)
T45
// @from(Ln 518485, Col 14)
b4A
// @from(Ln 518485, Col 19)
V45 = (q) => Array.isArray(q) ? q : [q]
// @from(Ln 518486, Col 4)
N45 = L(() => {
    sX7();
    vD();
    kj6();
    eX7();
    C4A = /^\d+$/, T45 = /^[A-Za-z_][A-Za-z0-9_]*=/, b4A = new Set(["nice"])
})
// @from(Ln 518493, Col 0)
async function bG(q) {
    d("tengu_unary_event", {
        event: q.event,
        completion_type: q.completion_type,
        language_name: await q.metadata.language_name,
        message_id: q.metadata.message_id,
        platform: q.metadata.platform,
        ...q.metadata.hasFeedback !== void 0 && {
            hasFeedback: q.metadata.hasFeedback
        }
    })
}
// @from(Ln 518505, Col 4)
Om6 = L(() => {
    C8()
})
// @from(Ln 518509, Col 0)
function TL(q, K) {
    let _ = R7(),
        z = Ks8.useRef(null);
    Ks8.useEffect(() => {
        if (z.current === q.toolUseID) return;
        z.current = q.toolUseID, _((A) => ({
            ...A,
            attribution: {
                ...A.attribution,
                permissionPromptCount: A.attribution.permissionPromptCount + 1
            }
        }));
        let Y = q.toolUseContext.getAppState().toolPermissionContext.mode;
        d("tengu_tool_use_show_permission_request", {
            messageID: q.assistantMessage.message.id,
            toolName: PK(q.tool.name),
            isMcp: q.tool.isMcp ?? !1,
            decisionReasonType: q.permissionResult.decisionReason?.type,
            sandboxEnabled: Z7.isSandboxingEnabled(),
            permissionMode: Y
        }), bG({
            completion_type: K.completion_type,
            event: "response",
            metadata: {
                language_name: K.language_name,
                message_id: q.assistantMessage.message.id,
                platform: X7.platform
            }
        })
    }, [q, K, _])
}
// @from(Ln 518540, Col 4)
Ks8
// @from(Ln 518541, Col 4)
fz6 = L(() => {
    C8();
    q2();
    AZ();
    vD();
    MH();
    cZ();
    yY();
    N7();
    D_();
    e8();
    Om6();
    Ks8 = K6(P6(), 1)
})
// @from(Ln 518556, Col 0)
function E45(q) {
    if (q.type === "classifier") return `${Y8.bold(q.classifier)} classifier: ${q.reason}`;
    switch (q.type) {
        case "rule":
            return `${Y8.bold(I9(q.rule.ruleValue))} rule from ${qX8(q.rule.source)}`;
        case "mode":
            return `${yr(q.mode)} mode`;
        case "sandboxOverride":
            return "Requires permission to bypass sandbox";
        case "workingDir":
            return q.reason;
        case "safetyCheck":
        case "other":
            return q.reason;
        case "permissionPromptTool":
            return `${Y8.bold(q.permissionPromptToolName)} permission prompt tool`;
        case "hook":
            return q.reason ? `${Y8.bold(q.hookName)} hook: ${q.reason}` : `${Y8.bold(q.hookName)} hook`;
        case "asyncAgent":
            return q.reason;
        default:
            return ""
    }
}
// @from(Ln 518581, Col 0)
function B4A(q) {
    let K = s(10),
        {
            title: _,
            decisionReason: z
        } = q,
        [Y] = Zq(),
        A;
    if (K[0] !== z || K[1] !== Y) A = function() {
        switch (z.type) {
            case "subcommandResults":
                return hK.default.createElement(u, {
                    flexDirection: "column"
                }, Array.from(z.reasons.entries()).map((J) => {
                    let [X, M] = J, P = M.behavior === "allow" ? d7("success", Y)(e6.tick) : d7("error", Y)(e6.cross);
                    return hK.default.createElement(u, {
                        flexDirection: "column",
                        key: X
                    }, hK.default.createElement(T, null, P, " ", X), M.decisionReason !== void 0 && M.decisionReason.type !== "subcommandResults" && hK.default.createElement(T, null, hK.default.createElement(T, {
                        dimColor: !0
                    }, "  ", "⎿", "  "), hK.default.createElement(v5, null, E45(M.decisionReason))), M.behavior === "ask" && hK.default.createElement(p4A, {
                        suggestions: M.suggestions
                    }))
                }));
            default:
                return hK.default.createElement(T, null, hK.default.createElement(v5, null, E45(z)))
        }
    }, K[0] = z, K[1] = Y, K[2] = A;
    else A = K[2];
    let O = A,
        w;
    if (K[3] !== _) w = _ && hK.default.createElement(T, null, _), K[3] = _, K[4] = w;
    else w = K[4];
    let $;
    if (K[5] !== O) $ = O(), K[5] = O, K[6] = $;
    else $ = K[6];
    let j;
    if (K[7] !== w || K[8] !== $) j = hK.default.createElement(u, {
        flexDirection: "column"
    }, w, $), K[7] = w, K[8] = $, K[9] = j;
    else j = K[9];
    return j
}
// @from(Ln 518625, Col 0)
function p4A(q) {
    let K = s(18),
        {
            suggestions: _
        } = q,
        z, Y, A, O, w, $, j;
    if (K[0] !== _) {
        j = Symbol.for("react.early_return_sentinel");
        q: {
            let X = gd(_);
            if (X.length === 0) {
                j = null;
                break q
            }
            if (Y = T, K[8] === Symbol.for("react.memo_cache_sentinel")) O = hK.default.createElement(T, {
                dimColor: !0
            }, "  ", "⎿", "  "),
            K[8] = O;
            else O = K[8];w = "Suggested rules:",
            $ = " ",
            z = v5,
            A = X.map(F4A).join(", ")
        }
        K[0] = _, K[1] = z, K[2] = Y, K[3] = A, K[4] = O, K[5] = w, K[6] = $, K[7] = j
    } else z = K[1], Y = K[2], A = K[3], O = K[4], w = K[5], $ = K[6], j = K[7];
    if (j !== Symbol.for("react.early_return_sentinel")) return j;
    let H;
    if (K[9] !== z || K[10] !== A) H = hK.default.createElement(z, null, A), K[9] = z, K[10] = A, K[11] = H;
    else H = K[11];
    let J;
    if (K[12] !== Y || K[13] !== O || K[14] !== w || K[15] !== $ || K[16] !== H) J = hK.default.createElement(Y, null, O, w, $, H), K[12] = Y, K[13] = O, K[14] = w, K[15] = $, K[16] = H, K[17] = J;
    else J = K[17];
    return J
}
// @from(Ln 518660, Col 0)
function F4A(q) {
    return Y8.bold(I9(q))
}
// @from(Ln 518664, Col 0)
function g4A(q) {
    if (!q) return [];
    return q.flatMap((K) => {
        switch (K.type) {
            case "addDirectories":
                return K.directories;
            default:
                return []
        }
    })
}
// @from(Ln 518676, Col 0)
function U4A(q) {
    if (!q) return;
    let K = q.findLast((_) => _.type === "setMode");
    return K?.type === "setMode" ? K.mode : void 0
}
// @from(Ln 518682, Col 0)
function Q4A(q) {
    let K = s(22),
        {
            suggestions: _,
            width: z
        } = q;
    if (!_ || _.length === 0) {
        let O;
        if (K[0] === Symbol.for("react.memo_cache_sentinel")) O = hK.default.createElement(T, {
            dimColor: !0
        }, "Suggestions "), K[0] = O;
        else O = K[0];
        let w;
        if (K[1] !== z) w = hK.default.createElement(u, {
            justifyContent: "flex-end",
            minWidth: z
        }, O), K[1] = z, K[2] = w;
        else w = K[2];
        let $;
        if (K[3] === Symbol.for("react.memo_cache_sentinel")) $ = hK.default.createElement(T, null, "None"), K[3] = $;
        else $ = K[3];
        let j;
        if (K[4] !== w) j = hK.default.createElement(u, {
            flexDirection: "row"
        }, w, $), K[4] = w, K[5] = j;
        else j = K[5];
        return j
    }
    let Y, A;
    if (K[6] !== _ || K[7] !== z) {
        A = Symbol.for("react.early_return_sentinel");
        q: {
            let O = gd(_),
                w = g4A(_),
                $ = U4A(_);
            if (O.length === 0 && w.length === 0 && !$) {
                let M;
                if (K[10] === Symbol.for("react.memo_cache_sentinel")) M = hK.default.createElement(T, {
                    dimColor: !0
                }, "Suggestion "), K[10] = M;
                else M = K[10];
                let P;
                if (K[11] !== z) P = hK.default.createElement(u, {
                    justifyContent: "flex-end",
                    minWidth: z
                }, M), K[11] = z, K[12] = P;
                else P = K[12];
                let W;
                if (K[13] === Symbol.for("react.memo_cache_sentinel")) W = hK.default.createElement(T, null, "None"), K[13] = W;
                else W = K[13];
                let D;
                if (K[14] !== P) D = hK.default.createElement(u, {
                    flexDirection: "row"
                }, P, W), K[14] = P, K[15] = D;
                else D = K[15];
                A = D;
                break q
            }
            let j;
            if (K[16] === Symbol.for("react.memo_cache_sentinel")) j = hK.default.createElement(T, {
                dimColor: !0
            }, "Suggestions "),
            K[16] = j;
            else j = K[16];
            let H;
            if (K[17] !== z) H = hK.default.createElement(u, {
                justifyContent: "flex-end",
                minWidth: z
            }, j),
            K[17] = z,
            K[18] = H;
            else H = K[18];
            let J;
            if (K[19] === Symbol.for("react.memo_cache_sentinel")) J = hK.default.createElement(T, null, " "),
            K[19] = J;
            else J = K[19];
            let X;
            if (K[20] !== H) X = hK.default.createElement(u, {
                flexDirection: "row"
            }, H, J),
            K[20] = H,
            K[21] = X;
            else X = K[21];Y = hK.default.createElement(u, {
                flexDirection: "column"
            }, X, O.length > 0 && hK.default.createElement(u, {
                flexDirection: "row"
            }, hK.default.createElement(u, {
                justifyContent: "flex-end",
                minWidth: z
            }, hK.default.createElement(T, {
                dimColor: !0
            }, " Rules ")), hK.default.createElement(u, {
                flexDirection: "column"
            }, O.map(c4A))), w.length > 0 && hK.default.createElement(u, {
                flexDirection: "row"
            }, hK.default.createElement(u, {
                justifyContent: "flex-end",
                minWidth: z
            }, hK.default.createElement(T, {
                dimColor: !0
            }, " Directories ")), hK.default.createElement(u, {
                flexDirection: "column"
            }, w.map(d4A))), $ && hK.default.createElement(u, {
                flexDirection: "row"
            }, hK.default.createElement(u, {
                justifyContent: "flex-end",
                minWidth: z
            }, hK.default.createElement(T, {
                dimColor: !0
            }, " Mode ")), hK.default.createElement(T, null, yr($))))
        }
        K[6] = _, K[7] = z, K[8] = Y, K[9] = A
    } else Y = K[8], A = K[9];
    if (A !== Symbol.for("react.early_return_sentinel")) return A;
    return Y
}
// @from(Ln 518799, Col 0)
function d4A(q, K) {
    return hK.default.createElement(T, {
        key: K
    }, e6.bullet, " ", q)
}
// @from(Ln 518805, Col 0)
function c4A(q, K) {
    return hK.default.createElement(T, {
        key: K
    }, e6.bullet, " ", I9(q))
}
// @from(Ln 518811, Col 0)
function _s8(q) {
    let K = s(25),
        {
            permissionResult: _,
            toolName: z
        } = q,
        Y = M8(n4A),
        A = _.decisionReason,
        O = "suggestions" in _ ? _.suggestions : void 0,
        w;
    if (K[0] !== O || K[1] !== z || K[2] !== Y) {
        q: {
            let Z = Z7.isSandboxingEnabled() && Z7.isAutoAllowBashIfSandboxedEnabled(),
                G = Tx6(Y, {
                    sandboxAutoAllowEnabled: Z
                }),
                f = gd(O);
            if (f.length > 0) {
                w = G.filter((v) => f.some((V) => V.toolName === v.rule.ruleValue.toolName && V.ruleContent === v.rule.ruleValue.ruleContent));
                break q
            }
            if (z) {
                let v;
                if (K[4] !== z) v = (V) => V.rule.ruleValue.toolName === z, K[4] = z, K[5] = v;
                else v = K[5];
                w = G.filter(v);
                break q
            }
            w = G
        }
        K[0] = O,
        K[1] = z,
        K[2] = Y,
        K[3] = w
    }
    else w = K[3];
    let $ = w,
        j;
    if (K[6] === Symbol.for("react.memo_cache_sentinel")) j = hK.default.createElement(u, {
        justifyContent: "flex-end",
        minWidth: 10
    }, hK.default.createElement(T, {
        dimColor: !0
    }, "Behavior ")), K[6] = j;
    else j = K[6];
    let H;
    if (K[7] !== _.behavior) H = hK.default.createElement(u, {
        flexDirection: "row"
    }, j, hK.default.createElement(T, null, _.behavior)), K[7] = _.behavior, K[8] = H;
    else H = K[8];
    let J;
    if (K[9] !== _.behavior || K[10] !== _.message) J = _.behavior !== "allow" && hK.default.createElement(u, {
        flexDirection: "row"
    }, hK.default.createElement(u, {
        justifyContent: "flex-end",
        minWidth: 10
    }, hK.default.createElement(T, {
        dimColor: !0
    }, "Message ")), hK.default.createElement(T, null, _.message)), K[9] = _.behavior, K[10] = _.message, K[11] = J;
    else J = K[11];
    let X;
    if (K[12] === Symbol.for("react.memo_cache_sentinel")) X = hK.default.createElement(u, {
        justifyContent: "flex-end",
        minWidth: 10
    }, hK.default.createElement(T, {
        dimColor: !0
    }, "Reason ")), K[12] = X;
    else X = K[12];
    let M;
    if (K[13] !== A) M = hK.default.createElement(u, {
        flexDirection: "row"
    }, X, A === void 0 ? hK.default.createElement(T, null, "undefined") : hK.default.createElement(B4A, {
        decisionReason: A
    })), K[13] = A, K[14] = M;
    else M = K[14];
    let P;
    if (K[15] !== O) P = hK.default.createElement(Q4A, {
        suggestions: O,
        width: 10
    }), K[15] = O, K[16] = P;
    else P = K[16];
    let W;
    if (K[17] !== $) W = $.length > 0 && hK.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, hK.default.createElement(T, {
        color: "warning"
    }, e6.warning, " Unreachable Rules (", $.length, ")"), $.map(l4A)), K[17] = $, K[18] = W;
    else W = K[18];
    let D;
    if (K[19] !== H || K[20] !== J || K[21] !== M || K[22] !== P || K[23] !== W) D = hK.default.createElement(u, {
        flexDirection: "column"
    }, H, J, M, P, W), K[19] = H, K[20] = J, K[21] = M, K[22] = P, K[23] = W, K[24] = D;
    else D = K[24];
    return D
}
// @from(Ln 518908, Col 0)
function l4A(q, K) {
    return hK.default.createElement(u, {
        key: K,
        flexDirection: "column",
        marginLeft: 2
    }, hK.default.createElement(T, {
        color: "warning"
    }, I9(q.rule.ruleValue)), hK.default.createElement(T, {
        dimColor: !0
    }, "  ", q.reason), hK.default.createElement(T, {
        dimColor: !0
    }, "  ", "Fix: ", q.fix))
}
// @from(Ln 518922, Col 0)
function n4A(q) {
    return q.toolPermissionContext
}
// @from(Ln 518925, Col 4)
hK
// @from(Ln 518926, Col 4)
qM7 = L(() => {
    o6();
    Y3();
    Qq();
    g6();
    N7();
    OP();
    MH();
    cZ();
    Gi8();
    yY();
    aY();
    hK = K6(P6(), 1)
})
// @from(Ln 518941, Col 0)
function qKA(q) {
    if (typeof q === "string") return q;
    try {
        return I6(q, null, 2)
    } catch {
        return String(q)
    }
}
// @from(Ln 518950, Col 0)
function KKA(q, K = 1000) {
    let _ = q.filter((A) => A.type === "assistant").slice(-3),
        z = [],
        Y = 0;
    for (let A of _.reverse()) {
        let O = A.message.content.filter((w) => w.type === "text").map((w) => ("text" in w) ? w.text : "").join(" ");
        if (O && Y < K) {
            let w = K - Y,
                $ = O.length > w ? O.slice(0, w) + "..." : O;
            z.unshift($), Y += $.length
        }
    }
    return z.join(`

`)
}
// @from(Ln 518967, Col 0)
function KM7() {
    return H8().permissionExplainerEnabled !== !1
}
// @from(Ln 518970, Col 0)
async function y45({
    toolName: q,
    toolInput: K,
    toolDescription: _,
    messages: z,
    signal: Y
}) {
    if (!KM7()) return null;
    let A = Date.now();
    try {
        let O = qKA(K),
            w = z?.length ? KKA(z) : "",
            $ = `Tool: ${q}
${_?`Description: ${_}
`:""}
Input:
${O}
${w?`
Recent conversation context:
${w}`:""}

Explain this command in context.`,
            j = G5(),
            H = await dR({
                model: j,
                system: s4A,
                messages: [{
                    role: "user",
                    content: $
                }],
                tools: [t4A],
                tool_choice: {
                    type: "tool",
                    name: "explain_command"
                },
                signal: Y,
                querySource: "permission_explainer"
            }),
            J = Date.now() - A;
        E(`Permission explainer: API returned in ${J}ms, stop_reason=${H.stop_reason}`);
        let X = H.content.find((M) => M.type === "tool_use");
        if (X && X.type === "tool_use") {
            E(`Permission explainer: tool input: ${I6(X.input).slice(0,500)}`);
            let M = e4A().safeParse(X.input);
            if (M.success) {
                let P = {
                    riskLevel: M.data.riskLevel,
                    explanation: M.data.explanation,
                    reasoning: M.data.reasoning,
                    risk: M.data.risk
                };
                return d("tengu_permission_explainer_generated", {
                    tool_name: PK(q),
                    risk_level: i4A[P.riskLevel],
                    latency_ms: J
                }), E(`Permission explainer: ${P.riskLevel} risk for ${q} (${J}ms)`), P
            }
        }
        return d("tengu_permission_explainer_error", {
            tool_name: PK(q),
            error_type: r4A,
            latency_ms: J
        }), E("Permission explainer: no parsed output in response"), null
    } catch (O) {
        let w = Date.now() - A;
        if (Y.aborted) return E(`Permission explainer: request aborted for ${q}`), null;
        return E(`Permission explainer error: ${b6(O)}`), j6(O), d("tengu_permission_explainer_error", {
            tool_name: PK(q),
            error_type: O instanceof Error && O.name === "AbortError" ? o4A : a4A,
            latency_ms: w
        }), null
    }
}
// @from(Ln 519043, Col 4)
i4A
// @from(Ln 519043, Col 9)
r4A = 1
// @from(Ln 519044, Col 4)
o4A = 2
// @from(Ln 519045, Col 4)
a4A = 3
// @from(Ln 519046, Col 4)
s4A = "Analyze shell commands and explain what they do, why you're running them, and potential risks."
// @from(Ln 519047, Col 4)
t4A
// @from(Ln 519047, Col 9)
e4A
// @from(Ln 519048, Col 4)
L45 = L(() => {
    p7();
    C8();
    q2();
    h1();
    K8();
    m8();
    U8();
    Sq();
    tH6();
    e8();
    i4A = {
        LOW: 1,
        MEDIUM: 2,
        HIGH: 3
    }, t4A = {
        name: "explain_command",
        description: "Provide an explanation of a shell command",
        input_schema: {
            type: "object",
            properties: {
                explanation: {
                    type: "string",
                    description: "What this command does (1-2 sentences)"
                },
                reasoning: {
                    type: "string",
                    description: 'Why YOU are running this command. Start with "I" - e.g. "I need to check the file contents"'
                },
                risk: {
                    type: "string",
                    description: "What could go wrong, under 15 words"
                },
                riskLevel: {
                    type: "string",
                    enum: ["LOW", "MEDIUM", "HIGH"],
                    description: "LOW (safe dev workflows), MEDIUM (recoverable changes), HIGH (dangerous/irreversible)"
                }
            },
            required: ["explanation", "reasoning", "risk", "riskLevel"]
        }
    }, e4A = C6(() => y.object({
        riskLevel: y.enum(["LOW", "MEDIUM", "HIGH"]),
        explanation: y.string(),
        reasoning: y.string(),
        risk: y.string()
    }))
})
// @from(Ln 519097, Col 0)
function _KA() {
    let q = s(7),
        [K, _] = hF8("responding", h45, !1),
        z;
    if (q[0] !== _) z = h45.split("").map((O, w) => Bj.default.createElement(CE6, {
        key: w,
        char: O,
        index: w,
        glimmerIndex: _,
        messageColor: "inactive",
        shimmerColor: "text"
    })), q[0] = _, q[1] = z;
    else z = q[1];
    let Y;
    if (q[2] !== z) Y = Bj.default.createElement(T, null, z), q[2] = z, q[3] = Y;
    else Y = q[3];
    let A;
    if (q[4] !== K || q[5] !== Y) A = Bj.default.createElement(u, {
        ref: K
    }, Y), q[4] = K, q[5] = Y, q[6] = A;
    else A = q[6];
    return A
}
// @from(Ln 519121, Col 0)
function zKA(q) {
    switch (q) {
        case "LOW":
            return "success";
        case "MEDIUM":
            return "warning";
        case "HIGH":
            return "error"
    }
}
// @from(Ln 519132, Col 0)
function YKA(q) {
    switch (q) {
        case "LOW":
            return "Low risk";
        case "MEDIUM":
            return "Med risk";
        case "HIGH":
            return "High risk"
    }
}
// @from(Ln 519143, Col 0)
function AKA(q) {
    return y45({
        toolName: q.toolName,
        toolInput: q.toolInput,
        toolDescription: q.toolDescription,
        messages: q.messages,
        signal: new AbortController().signal
    }).catch(() => null)
}
// @from(Ln 519153, Col 0)
function zs8(q) {
    let K = s(9),
        _;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) _ = KM7(), K[0] = _;
    else _ = K[0];
    let z = _,
        [Y, A] = Bj.useState(!1),
        [O, w] = Bj.useState(null),
        $;
    if (K[1] !== O || K[2] !== q || K[3] !== Y) $ = () => {
        if (!Y) {
            if (d("tengu_permission_explainer_shortcut_used", {}), !O) w(AKA(q))
        }
        A(OKA)
    }, K[1] = O, K[2] = q, K[3] = Y, K[4] = $;
    else $ = K[4];
    let j;
    if (K[5] === Symbol.for("react.memo_cache_sentinel")) j = {
        context: "Confirmation",
        isActive: z
    }, K[5] = j;
    else j = K[5];
    G1("confirm:toggleExplanation", $, j);
    let H;
    if (K[6] !== O || K[7] !== Y) H = {
        visible: Y,
        enabled: z,
        promise: O
    }, K[6] = O, K[7] = Y, K[8] = H;
    else H = K[8];
    return H
}
// @from(Ln 519186, Col 0)
function OKA(q) {
    return !q
}
// @from(Ln 519190, Col 0)
function wKA(q) {
    let K = s(21),
        {
            promise: _
        } = q,
        z = Bj.use(_);
    if (!z) {
        let X;
        if (K[0] === Symbol.for("react.memo_cache_sentinel")) X = Bj.default.createElement(u, {
            marginTop: 1
        }, Bj.default.createElement(T, {
            dimColor: !0
        }, "Explanation unavailable")), K[0] = X;
        else X = K[0];
        return X
    }
    let Y;
    if (K[1] !== z.explanation) Y = Bj.default.createElement(T, null, z.explanation), K[1] = z.explanation, K[2] = Y;
    else Y = K[2];
    let A;
    if (K[3] !== z.reasoning) A = Bj.default.createElement(u, {
        marginTop: 1
    }, Bj.default.createElement(T, null, z.reasoning)), K[3] = z.reasoning, K[4] = A;
    else A = K[4];
    let O;
    if (K[5] !== z.riskLevel) O = zKA(z.riskLevel), K[5] = z.riskLevel, K[6] = O;
    else O = K[6];
    let w;
    if (K[7] !== z.riskLevel) w = YKA(z.riskLevel), K[7] = z.riskLevel, K[8] = w;
    else w = K[8];
    let $;
    if (K[9] !== O || K[10] !== w) $ = Bj.default.createElement(T, {
        color: O
    }, w, ":"), K[9] = O, K[10] = w, K[11] = $;
    else $ = K[11];
    let j;
    if (K[12] !== z.risk) j = Bj.default.createElement(T, null, " ", z.risk), K[12] = z.risk, K[13] = j;
    else j = K[13];
    let H;
    if (K[14] !== $ || K[15] !== j) H = Bj.default.createElement(u, {
        marginTop: 1
    }, Bj.default.createElement(T, null, $, j)), K[14] = $, K[15] = j, K[16] = H;
    else H = K[16];
    let J;
    if (K[17] !== Y || K[18] !== A || K[19] !== H) J = Bj.default.createElement(u, {
        flexDirection: "column",
        marginTop: 1
    }, Y, A, H), K[17] = Y, K[18] = A, K[19] = H, K[20] = J;
    else J = K[20];
    return J
}
// @from(Ln 519242, Col 0)
function Ys8(q) {
    let K = s(3),
        {
            visible: _,
            promise: z
        } = q;
    if (!_ || !z) return null;
    let Y;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) Y = Bj.default.createElement(u, {
        marginTop: 1
    }, Bj.default.createElement(_KA, null)), K[0] = Y;
    else Y = K[0];
    let A;
    if (K[1] !== z) A = Bj.default.createElement(Bj.Suspense, {
        fallback: Y
    }, Bj.default.createElement(wKA, {
        promise: z
    })), K[1] = z, K[2] = A;
    else A = K[2];
    return A
}
// @from(Ln 519263, Col 4)
Bj
// @from(Ln 519263, Col 8)
h45 = "Loading explanation…"
// @from(Ln 519264, Col 4)
_M7 = L(() => {
    o6();
    g6();
    C7();
    C8();
    L45();
    Is6();
    RF8();
    Bj = K6(P6(), 1)
})
// @from(Ln 519275, Col 0)
function As8(q) {
    let K = s(7),
        _;
    if (K[0] !== q.edits || K[1] !== q.file_path) _ = () => jKA(q.file_path, q.edits), K[0] = q.edits, K[1] = q.file_path, K[2] = _;
    else _ = K[2];
    let [z] = wm6.useState(_), Y;
    if (K[3] === Symbol.for("react.memo_cache_sentinel")) Y = IG.createElement(S45, {
        placeholder: !0
    }), K[3] = Y;
    else Y = K[3];
    let A;
    if (K[4] !== z || K[5] !== q.file_path) A = IG.createElement(wm6.Suspense, {
        fallback: Y
    }, IG.createElement($KA, {
        promise: z,
        file_path: q.file_path
    })), K[4] = z, K[5] = q.file_path, K[6] = A;
    else A = K[6];
    return A
}
// @from(Ln 519296, Col 0)
function $KA(q) {
    let K = s(6),
        {
            promise: _,
            file_path: z
        } = q,
        {
            patch: Y,
            firstLine: A,
            fileContent: O
        } = wm6.use(_),
        {
            columns: w
        } = s1(),
        $;
    if (K[0] !== w || K[1] !== O || K[2] !== z || K[3] !== A || K[4] !== Y) $ = IG.createElement(S45, null, IG.createElement(JM6, {
        hunks: Y,
        dim: !1,
        width: w,
        filePath: z,
        firstLine: A,
        fileContent: O
    })), K[0] = w, K[1] = O, K[2] = z, K[3] = A, K[4] = Y, K[5] = $;
    else $ = K[5];
    return $
}
// @from(Ln 519323, Col 0)
function S45(q) {
    let K = s(5),
        {
            children: _,
            placeholder: z
        } = q,
        Y;
    if (K[0] !== _ || K[1] !== z) Y = z ? IG.createElement(T, {
        dimColor: !0
    }, "…") : _, K[0] = _, K[1] = z, K[2] = Y;
    else Y = K[2];
    let A;
    if (K[3] !== Y) A = IG.createElement(u, {
        flexDirection: "column"
    }, IG.createElement(u, {
        borderColor: "subtle",
        borderStyle: "dashed",
        flexDirection: "column",
        borderLeft: !1,
        borderRight: !1
    }, Y)), K[3] = Y, K[4] = A;
    else A = K[4];
    return A
}
// @from(Ln 519347, Col 0)
async function jKA(q, K) {
    let _ = K.filter((Y) => Y.old_string != null && Y.new_string != null),
        z = _.length === 1 ? _[0] : void 0;
    if (z && z.old_string.length >= d96) return gz8(q, [z]);
    try {
        let Y = await $58(q);
        if (Y === null) return gz8(q, _);
        try {
            if (!z || z.old_string === "") {
                let $ = await pU8(Y);
                if ($ === null) return gz8(q, _);
                let j = _.map((H) => R45($, H));
                return {
                    patch: Vx({
                        filePath: q,
                        fileContents: $,
                        edits: j
                    }),
                    firstLine: oY($),
                    fileContent: $
                }
            }
            let A = await R47(Y, z.old_string, hh6);
            if (A.truncated || A.content === "") return gz8(q, [z]);
            let O = R45(A.content, z),
                w = Vx({
                    filePath: q,
                    fileContents: A.content,
                    edits: [O]
                });
            return {
                patch: _I8(w, A.lineOffset - 1),
                firstLine: A.lineOffset === 1 ? oY(A.content) : null,
                fileContent: A.content
            }
        } finally {
            await Y.close()
        }
    } catch (Y) {
        return j6(Y), gz8(q, _)
    }
}
// @from(Ln 519390, Col 0)
function gz8(q, K) {
    return {
        patch: K.flatMap((_) => Vx({
            filePath: q,
            fileContents: _.old_string,
            edits: [_]
        })),
        firstLine: null,
        fileContent: void 0
    }
}
// @from(Ln 519402, Col 0)
function R45(q, K) {
    let _ = lH6(q, K.old_string) || K.old_string,
        z = Rh6(K.old_string, _, K.new_string);
    return {
        ...K,
        old_string: _,
        new_string: z
    }
}
// @from(Ln 519411, Col 4)
IG
// @from(Ln 519411, Col 8)
wm6
// @from(Ln 519412, Col 4)
zM7 = L(() => {
    o6();
    I4();
    g6();
    Q56();
    Rc();
    U8();
    FU8();
    w58();
    IG = K6(P6(), 1), wm6 = K6(P6(), 1)
})
// @from(Ln 519430, Col 0)
function C45({
    onChange: q,
    toolUseContext: K,
    filePath: _,
    edits: z,
    editMode: Y
}) {
    let A = k66.useRef(!1),
        [O, w] = k66.useState(!1),
        $ = k66.useMemo(() => HKA().slice(0, 6), []),
        j = k66.useMemo(() => `✻ [Claude Code] ${JKA(_)} (${$}) ⧉`, [_, $]),
        H = rb8(K.options.mcpClients) && H8().diffTool === "auto" && !_.endsWith(".ipynb"),
        J = ob8(K.options.mcpClients) ?? "IDE";
    async function X() {
        if (!H) return;
        try {
            d("tengu_ext_will_show_diff", {});
            let {
                oldContent: M,
                newContent: P
            } = await MKA(_, z, K, j);
            if (A.current) return;
            d("tengu_ext_diff_accepted", {});
            let W = XKA(_, M, P, Y);
            if (W.length === 0) {
                d("tengu_ext_diff_rejected", {});
                let D = ky(K.options.mcpClients);
                if (D) await YM7(j, D);
                q({
                    type: "reject"
                }, {
                    file_path: _,
                    edits: z
                });
                return
            }
            q({
                type: "accept-once"
            }, {
                file_path: _,
                edits: W
            })
        } catch (M) {
            j6(M), w(!0)
        }
    }
    return k66.useEffect(() => {
        return X(), () => {
            A.current = !0
        }
    }, []), {
        closeTabInIDE() {
            let M = ky(K.options.mcpClients);
            if (!M) return Promise.resolve();
            return YM7(j, M)
        },
        showingDiffInIDE: H && !O,
        ideName: J,
        hasError: O
    }
}
// @from(Ln 519492, Col 0)
function XKA(q, K, _, z) {
    let Y = z === "single",
        A = U56({
            filePath: q,
            oldContent: K,
            newContent: _,
            singleHunk: Y
        });
    if (A.length === 0) return [];
    if (Y && A.length > 1) j6(Error(`Unexpected number of hunks: ${A.length}. Expected 1 hunk.`));
    return RS4(A)
}
// @from(Ln 519504, Col 0)
async function MKA(q, K, _, z) {
    let Y = !1,
        A = Wq(q),
        O = "";
    try {
        O = VV(A)
    } catch (j) {
        if (!t1(j)) throw j
    }
    async function w() {
        if (Y) return;
        Y = !0;
        try {
            await YM7(z, $)
        } catch (j) {
            j6(j)
        }
        process.off("beforeExit", w), _.abortController.signal.removeEventListener("abort", w)
    }
    _.abortController.signal.addEventListener("abort", w), process.on("beforeExit", w);
    let $ = ky(_.options.mcpClients);
    try {
        let {
            updatedFile: j
        } = U88({
            filePath: A,
            fileContents: O,
            edits: K
        });
        if (!$ || $.type !== "connected") throw Error("IDE client not available");
        let H = A,
            J = $.config.ideRunningInWindows === !0;
        if (y1() === "wsl" && J && process.env.WSL_DISTRO_NAME) H = new fh6(process.env.WSL_DISTRO_NAME).toIDEPath(A);
        let X = await Qp("openDiff", {
                old_file_path: H,
                new_file_path: H,
                new_file_contents: j,
                tab_name: z
            }, $),
            M = Array.isArray(X) ? X : [X];
        if (DKA(M)) return w(), {
            oldContent: O,
            newContent: M[1].text
        };
        else if (PKA(M)) return w(), {
            oldContent: O,
            newContent: j
        };
        else if (WKA(M)) return w(), {
            oldContent: O,
            newContent: O
        };
        throw Error("Not accepted")
    } catch (j) {
        throw j6(j), w(), j
    }
}
// @from(Ln 519561, Col 0)
async function YM7(q, K) {
    try {
        if (!K || K.type !== "connected") throw Error("IDE client not available");
        await Qp("close_tab", {
            tab_name: q
        }, K)
    } catch (_) {
        j6(_)
    }
}
// @from(Ln 519572, Col 0)
function PKA(q) {
    return Array.isArray(q) && typeof q[0] === "object" && q[0] !== null && "type" in q[0] && q[0].type === "text" && "text" in q[0] && q[0].text === "TAB_CLOSED"
}
// @from(Ln 519576, Col 0)
function WKA(q) {
    return Array.isArray(q) && typeof q[0] === "object" && q[0] !== null && "type" in q[0] && q[0].type === "text" && "text" in q[0] && q[0].text === "DIFF_REJECTED"
}
// @from(Ln 519580, Col 0)
function DKA(q) {
    return Array.isArray(q) && q[0]?.type === "text" && q[0].text === "FILE_SAVED" && typeof q[1].text === "string"
}
// @from(Ln 519583, Col 4)
k66
// @from(Ln 519584, Col 4)
b45 = L(() => {
    C8();
    nN();
    b9();
    Q56();
    h1();
    Rc();
    m8();
    kj();
    Zn1();
    U8();
    NK();
    k66 = K6(P6(), 1)
})
// @from(Ln 519603, Col 0)
function I45(q) {
    let K = s(41),
        {
            onChange: _,
            options: z,
            input: Y,
            filePath: A,
            ideName: O,
            symlinkTarget: w,
            rejectFeedback: $,
            acceptFeedback: j,
            setFocusedOption: H,
            onInputModeToggle: J,
            focusedOption: X,
            yesInputMode: M,
            noInputMode: P
        } = q,
        W;
    if (K[0] !== O) W = ZN.default.createElement(T, {
        bold: !0,
        color: "permission"
    }, "Opened changes in ", O, " ⧉"), K[0] = O, K[1] = W;
    else W = K[1];
    let D;
    if (K[2] !== w) D = w && ZN.default.createElement(T, {
        color: "warning"
    }, fKA(b8(), w).startsWith("..") ? `This will modify ${w} (outside working directory) via a symlink` : `Symlink target: ${w}`), K[2] = w, K[3] = D;
    else D = K[3];
    let Z;
    if (K[4] === Symbol.for("react.memo_cache_sentinel")) Z = C88() && ZN.default.createElement(T, {
        dimColor: !0
    }, "Save file to continue…"), K[4] = Z;
    else Z = K[4];
    let G;
    if (K[5] !== A) G = ZKA(A), K[5] = A, K[6] = G;
    else G = K[6];
    let f;
    if (K[7] !== G) f = ZN.default.createElement(T, null, "Do you want to make this edit to", " ", ZN.default.createElement(T, {
        bold: !0
    }, G), "?"), K[7] = G, K[8] = f;
    else f = K[8];
    let v;
    if (K[9] !== j || K[10] !== Y || K[11] !== _ || K[12] !== z || K[13] !== $) v = (m) => {
        let S = z.find((F) => F.value === m);
        if (S) {
            if (S.option.type === "reject") {
                let F = $.trim();
                _(S.option, Y, F || void 0);
                return
            }
            if (S.option.type === "accept-once") {
                let F = j.trim();
                _(S.option, Y, F || void 0);
                return
            }
            _(S.option, Y)
        }
    }, K[9] = j, K[10] = Y, K[11] = _, K[12] = z, K[13] = $, K[14] = v;
    else v = K[14];
    let V;
    if (K[15] !== Y || K[16] !== _) V = () => _({
        type: "reject"
    }, Y), K[15] = Y, K[16] = _, K[17] = V;
    else V = K[17];
    let k;
    if (K[18] !== H) k = (m) => H(m), K[18] = H, K[19] = k;
    else k = K[19];
    let N;
    if (K[20] !== J || K[21] !== z || K[22] !== v || K[23] !== V || K[24] !== k) N = ZN.default.createElement(A1, {
        options: z,
        inlineDescriptions: !0,
        onChange: v,
        onCancel: V,
        onFocus: k,
        onInputModeToggle: J
    }), K[20] = J, K[21] = z, K[22] = v, K[23] = V, K[24] = k, K[25] = N;
    else N = K[25];
    let R;
    if (K[26] !== f || K[27] !== N) R = ZN.default.createElement(u, {
        flexDirection: "column"
    }, f, N), K[26] = f, K[27] = N, K[28] = R;
    else R = K[28];
    let h;
    if (K[29] === Symbol.for("react.memo_cache_sentinel")) h = ZN.default.createElement(A8, {
        chord: "escape",
        action: "cancel"
    }), K[29] = h;
    else h = K[29];
    let C;
    if (K[30] !== X || K[31] !== P || K[32] !== M) C = (X === "yes" && !M || X === "no" && !P) && ZN.default.createElement(A8, {
        chord: "tab",
        action: "amend"
    }), K[30] = X, K[31] = P, K[32] = M, K[33] = C;
    else C = K[33];
    let x;
    if (K[34] !== C) x = ZN.default.createElement(u, {
        marginTop: 1
    }, ZN.default.createElement(T, {
        dimColor: !0
    }, ZN.default.createElement(z1, null, h, C))), K[34] = C, K[35] = x;
    else x = K[35];
    let B;
    if (K[36] !== W || K[37] !== R || K[38] !== x || K[39] !== D) B = ZN.default.createElement(A_, {
        color: "permission"
    }, ZN.default.createElement(u, {
        flexDirection: "column",
        gap: 1
    }, W, D, Z, R, x)), K[36] = W, K[37] = R, K[38] = x, K[39] = D, K[40] = B;
    else B = K[40];
    return B
}
// @from(Ln 519714, Col 4)
ZN
// @from(Ln 519715, Col 4)
x45 = L(() => {
    o6();
    g6();
    n7();
    kj();
    g_();
    Nq();
    u7();
    DJ();
    ZN = K6(P6(), 1)
})
// @from(Ln 519735, Col 0)
function VKA(q) {
    let K = Wq(q),
        _ = Wq(`${Y7()}/.claude`),
        z = pM(K),
        Y = pM(_);
    return z.startsWith(Y + u45.toLowerCase()) || z.startsWith(Y + "/")
}
// @from(Ln 519743, Col 0)
function kKA(q) {
    let K = Wq(q),
        _ = TKA(GKA(), ".claude"),
        z = pM(K),
        Y = pM(_);
    return z.startsWith(Y + u45.toLowerCase()) || z.startsWith(Y + "/")
}
// @from(Ln 519751, Col 0)
function m45({
    filePath: q,
    toolPermissionContext: K,
    operationType: _ = "write",
    onRejectFeedbackChange: z,
    onAcceptFeedbackChange: Y,
    yesInputMode: A = !1,
    noInputMode: O = !1
}) {
    let w = [],
        $ = WJ("chat:cycleMode", "Chat", "shift+tab");
    if (A && Y) w.push({
        type: "input",
        label: "Yes",
        value: "yes",
        placeholder: "and tell Claude what to do next",
        onChange: Y,
        allowEmptySubmitToCancel: !0,
        option: {
            type: "accept-once"
        }
    });
    else w.push({
        label: "Yes",
        value: "yes",
        option: {
            type: "accept-once"
        }
    });
    let j = Tk(q, K),
        H = VKA(q),
        J = kKA(q);
    if ((H || J) && _ !== "read") w.push({
        label: "Yes, and allow Claude to edit its own settings for this session",
        value: "yes-claude-folder",
        option: {
            type: "accept-session",
            scope: J ? "global-claude-folder" : "claude-folder"
        }
    });
    else {
        let X;
        if (j)
            if (_ === "read") X = "Yes, during this session";
            else X = Gz6.default.createElement(T, null, "Yes, allow all edits during this session", " ", Gz6.default.createElement(T, {
                bold: !0
            }, "(", $, ")"));
        else {
            let M = Yv(q),
                P = vKA(M) || "this directory";
            if (_ === "read") X = Gz6.default.createElement(T, null, "Yes, allow reading from ", Gz6.default.createElement(T, {
                bold: !0
            }, P, "/"), " during this session");
            else X = Gz6.default.createElement(T, null, "Yes, allow all edits in ", Gz6.default.createElement(T, {
                bold: !0
            }, P, "/"), " during this session ", Gz6.default.createElement(T, {
                bold: !0
            }, "(", $, ")"))
        }
        w.push({
            label: X,
            value: "yes-session",
            option: {
                type: "accept-session"
            }
        })
    }
    if (O && z) w.push({
        type: "input",
        label: "No",
        value: "no",
        placeholder: "and tell Claude what to do differently",
        onChange: z,
        allowEmptySubmitToCancel: !0,
        option: {
            type: "reject"
        }
    });
    else w.push({
        label: "No",
        value: "no",
        option: {
            type: "reject"
        }
    });
    return w
}
// @from(Ln 519838, Col 4)
Gz6
// @from(Ln 519839, Col 4)
B45 = L(() => {
    y8();
    g6();
    zp();
    b9();
    Sz();
    Gz6 = K6(P6(), 1)
})
// @from(Ln 519848, Col 0)
function AM7(q, K, _, z, Y) {
    bG({
        completion_type: K,
        event: q,
        metadata: {
            language_name: _,
            message_id: z,
            platform: X7.platform,
            hasFeedback: Y ?? !1
        }
    })
}
// @from(Ln 519861, Col 0)
function NKA(q, K) {
    let {
        messageId: _,
        toolUseConfirm: z,
        onDone: Y,
        completionType: A,
        languageName: O
    } = q;
    AM7("accept", A, O, _), d("tengu_accept_submitted", {
        toolName: PK(z.tool.name),
        isMcp: z.tool.isMcp ?? !1,
        has_instructions: !!K?.feedback,
        instructions_length: K?.feedback?.length ?? 0,
        entered_feedback_mode: K?.enteredFeedbackMode ?? !1
    }), Y(), z.onAllow(z.input, [], K?.feedback)
}
// @from(Ln 519878, Col 0)
function EKA(q, K) {
    let {
        messageId: _,
        path: z,
        toolUseConfirm: Y,
        toolPermissionContext: A,
        onDone: O,
        completionType: w,
        languageName: $,
        operationType: j
    } = q;
    if (AM7("accept", w, $, _), K?.scope === "claude-folder" || K?.scope === "global-claude-folder") {
        let J = K.scope === "global-claude-folder" ? kL8 : VL8,
            X = [{
                type: "addRules",
                rules: [{
                    toolName: J4,
                    ruleContent: J
                }],
                behavior: "allow",
                destination: "session"
            }];
        O(), Y.onAllow(Y.input, X);
        return
    }
    let H = z ? Gz8(z, j, A) : [];
    O(), Y.onAllow(Y.input, H)
}
// @from(Ln 519907, Col 0)
function yKA(q, K) {
    let {
        messageId: _,
        toolUseConfirm: z,
        onDone: Y,
        onReject: A,
        completionType: O,
        languageName: w
    } = q;
    AM7("reject", O, w, _, K?.hasFeedback), d("tengu_reject_submitted", {
        toolName: PK(z.tool.name),
        isMcp: z.tool.isMcp ?? !1,
        has_instructions: !!K?.feedback,
        instructions_length: K?.feedback?.length ?? 0,
        entered_feedback_mode: K?.enteredFeedbackMode ?? !1
    }), Y(), A(), z.onReject(K?.feedback)
}
// @from(Ln 519924, Col 4)
p45
// @from(Ln 519925, Col 4)
F45 = L(() => {
    C8();
    q2();
    D_();
    Sz();
    Om6();
    p45 = {
        "accept-once": NKA,
        "accept-session": EKA,
        reject: yKA
    }
})
// @from(Ln 519938, Col 0)
function g45({
    filePath: q,
    completionType: K,
    languageName: _,
    toolUseConfirm: z,
    onDone: Y,
    onReject: A,
    parseInput: O,
    operationType: w = "write"
}) {
    let $ = M8((B) => B.toolPermissionContext),
        [j, H] = fN.useState(""),
        [J, X] = fN.useState(""),
        [M, P] = fN.useState("yes"),
        [W, D] = fN.useState(!1),
        [Z, G] = fN.useState(!1),
        [f, v] = fN.useState(!1),
        [V, k] = fN.useState(!1),
        N = fN.useMemo(() => m45({
            filePath: q,
            toolPermissionContext: $,
            operationType: w,
            onRejectFeedbackChange: X,
            onAcceptFeedbackChange: H,
            yesInputMode: W,
            noInputMode: Z
        }), [q, $, w, W, Z]),
        R = fN.useCallback((B, m, S) => {
            let F = {
                    messageId: z.assistantMessage.message.id,
                    path: q,
                    toolUseConfirm: z,
                    toolPermissionContext: $,
                    onDone: Y,
                    onReject: A,
                    completionType: K,
                    languageName: _,
                    operationType: w
                },
                U = z.onAllow;
            z.onAllow = (c, n, l) => {
                U(m, n, l)
            };
            let g = p45[B.type];
            g(F, {
                feedback: S,
                hasFeedback: !!S,
                enteredFeedbackMode: B.type === "accept-once" ? f : V,
                scope: B.type === "accept-session" ? B.scope : void 0
            })
        }, [q, K, _, z, $, Y, A, w, f, V]),
        h = fN.useCallback(() => {
            let B = N.find((m) => m.option.type === "accept-session");
            if (B) {
                let m = O(z.input);
                R(B.option, m)
            }
        }, [N, O, z.input, R]);
    L7({
        "confirm:cycleMode": h
    }, {
        context: "Confirmation"
    });
    let C = fN.useCallback((B) => {
            if (B !== "yes" && W && !j.trim()) D(!1);
            if (B !== "no" && Z && !J.trim()) G(!1);
            P(B)
        }, [W, Z, j, J]),
        x = fN.useCallback((B) => {
            let m = {
                toolName: PK(z.tool.name),
                isMcp: z.tool.isMcp ?? !1
            };
            if (B === "yes")
                if (W) D(!1), d("tengu_accept_feedback_mode_collapsed", m);
                else D(!0), v(!0), d("tengu_accept_feedback_mode_entered", m);
            else if (B === "no")
                if (Z) G(!1), d("tengu_reject_feedback_mode_collapsed", m);
                else G(!0), k(!0), d("tengu_reject_feedback_mode_entered", m)
        }, [W, Z, z]);
    return {
        options: N,
        onChange: R,
        acceptFeedback: j,
        rejectFeedback: J,
        focusedOption: M,
        setFocusedOption: C,
        handleInputModeToggle: x,
        yesInputMode: W,
        noInputMode: Z
    }
}
// @from(Ln 520030, Col 4)
fN
// @from(Ln 520031, Col 4)
U45 = L(() => {
    N7();
    C7();
    C8();
    q2();
    B45();
    F45();
    fN = K6(P6(), 1)
})
// @from(Ln 520044, Col 0)
function Qn({
    toolUseConfirm: q,
    toolUseContext: K,
    onDone: _,
    onReject: z,
    title: Y,
    subtitle: A,
    question: O = "Do you want to proceed?",
    content: w,
    completionType: $ = "tool_use_single",
    path: j,
    parseInput: H,
    operationType: J = "write",
    ideDiffSupport: X,
    workerBadge: M,
    languageName: P
}) {
    let W = HW.useMemo(() => P ?? (j ? Au8(j) : "none"), [P, j]),
        D = HW.useMemo(() => ({
            completion_type: $,
            language_name: W
        }), [$, W]);
    TL(q, D);
    let Z = HW.useMemo(() => {
            if (!j || J === "read") return null;
            let l = Wq(j),
                z6 = V8(),
                {
                    resolvedPath: A6,
                    isSymlink: e
                } = vA(z6, l);
            if (e) return A6;
            return null
        }, [j, J]),
        G = g45({
            filePath: j || "",
            completionType: $,
            languageName: W,
            toolUseConfirm: q,
            onDone: _,
            onReject: z,
            parseInput: H,
            operationType: J
        }),
        {
            options: f,
            acceptFeedback: v,
            rejectFeedback: V,
            setFocusedOption: k,
            handleInputModeToggle: N,
            focusedOption: R,
            yesInputMode: h,
            noInputMode: C
        } = G,
        x = H(q.input),
        B = HW.useMemo(() => X ? X.getConfig(H(q.input)) : null, [X, q.input]),
        m = B ? {
            onChange: (l, z6) => {
                let A6 = X.applyChanges(x, z6.edits);
                G.onChange(l, A6)
            },
            toolUseContext: K,
            filePath: B.filePath,
            edits: (B.edits || []).map((l) => ({
                old_string: l.old_string,
                new_string: l.new_string,
                replace_all: l.replace_all || !1
            })),
            editMode: B.editMode || "single"
        } : {
            onChange: () => {},
            toolUseContext: K,
            filePath: "",
            edits: [],
            editMode: "single"
        },
        {
            closeTabInIDE: S,
            showingDiffInIDE: F,
            ideName: U
        } = C45(m),
        g = (l, z6) => {
            S?.(), G.onChange(l, x, z6?.trim())
        };
    if (F && B && j) return HW.default.createElement(I45, {
        onChange: (l, z6, A6) => g(l, A6),
        options: f,
        filePath: j,
        input: x,
        ideName: U,
        symlinkTarget: Z,
        rejectFeedback: V,
        acceptFeedback: v,
        setFocusedOption: k,
        onInputModeToggle: N,
        focusedOption: R,
        yesInputMode: h,
        noInputMode: C
    });
    let c = Z != null && LKA(b8(), Z).startsWith(".."),
        n = Z ? HW.default.createElement(u, {
            paddingX: 1,
            marginBottom: 1
        }, HW.default.createElement(T, {
            color: "warning"
        }, c ? `This will modify ${Z} (outside working directory) via a symlink` : `Symlink target: ${Z}`)) : null;
    return HW.default.createElement(HW.default.Fragment, null, HW.default.createElement(IY, {
        title: Y,
        subtitle: A,
        innerPaddingX: 0,
        workerBadge: M
    }, n, w, HW.default.createElement(u, {
        flexDirection: "column",
        paddingX: 1
    }, typeof O === "string" ? HW.default.createElement(T, null, O) : O, HW.default.createElement(A1, {
        options: f,
        inlineDescriptions: !0,
        onChange: (l) => {
            let z6 = f.find((A6) => A6.value === l);
            if (z6) {
                if (z6.option.type === "reject") {
                    let A6 = V.trim();
                    g(z6.option, A6 || void 0);
                    return
                }
                if (z6.option.type === "accept-once") {
                    let A6 = v.trim();
                    g(z6.option, A6 || void 0);
                    return
                }
                g(z6.option)
            }
        },
        onCancel: () => g({
            type: "reject"
        }),
        onFocus: (l) => k(l),
        onInputModeToggle: N
    }))), HW.default.createElement(u, {
        paddingX: 1,
        marginTop: 1
    }, HW.default.createElement(T, {
        dimColor: !0
    }, HW.default.createElement(z1, null, HW.default.createElement(A8, {
        chord: "escape",
        action: "cancel"
    }), (R === "yes" && !h || R === "no" && !C) && HW.default.createElement(A8, {
        chord: "tab",
        action: "amend"
    })))))
}
// @from(Ln 520195, Col 4)
HW
// @from(Ln 520196, Col 4)
$m6 = L(() => {
    b45();
    g6();
    fJ6();
    n7();
    Yq();
    b9();
    g_();
    Nq();
    u7();
    x45();
    fz6();
    pD();
    U45();
    HW = K6(P6(), 1)
})
// @from(Ln 520217, Col 0)
function Q45(q) {
    let K = s(9),
        _, z;
    if (K[0] !== q)({
        sedInfo: z,
        ..._
    } = q), K[0] = q, K[1] = _, K[2] = z;
    else _ = K[1], z = K[2];
    let {
        filePath: Y
    } = z, A;
    if (K[3] !== Y) A = (async () => {
        let $ = aU6(Y);
        return {
            oldContent: (await V8().readFile(Y, {
                encoding: $
            })).replaceAll(`\r
`, `
`),
            fileExists: !0
        }
    })().catch(SKA), K[3] = Y, K[4] = A;
    else A = K[4];
    let O = A,
        w;
    if (K[5] !== O || K[6] !== _ || K[7] !== z) w = uu.default.createElement(uu.Suspense, {
        fallback: null
    }, uu.default.createElement(CKA, {
        sedInfo: z,
        contentPromise: O,
        ..._
    })), K[5] = O, K[6] = _, K[7] = z, K[8] = w;
    else w = K[8];
    return w
}
// @from(Ln 520253, Col 0)
function SKA(q) {
    if (!t1(q)) throw q;
    return {
        oldContent: "",
        fileExists: !1
    }
}
// @from(Ln 520261, Col 0)
function CKA(q) {
    let K = s(35),
        _, z, Y;
    if (K[0] !== q)({
        sedInfo: Y,
        contentPromise: _,
        ...z
    } = q), K[0] = q, K[1] = _, K[2] = z, K[3] = Y;
    else _ = K[1], z = K[2], Y = K[3];
    let {
        filePath: A
    } = Y, {
        oldContent: O,
        fileExists: w
    } = uu.use(_), $;
    if (K[4] !== O || K[5] !== Y) $ = pwK(O, Y), K[4] = O, K[5] = Y, K[6] = $;
    else $ = K[6];
    let j = $,
        H;
    q: {
        if (O === j) {
            let C;
            if (K[7] === Symbol.for("react.memo_cache_sentinel")) C = [], K[7] = C;
            else C = K[7];
            H = C;
            break q
        }
        let h;
        if (K[8] !== j || K[9] !== O) h = [{
            old_string: O,
            new_string: j,
            replace_all: !1
        }],
        K[8] = j,
        K[9] = O,
        K[10] = h;
        else h = K[10];H = h
    }
    let J = H,
        X;
    q: {
        if (!w) {
            X = "File does not exist";
            break q
        }
        X = "Pattern did not match any content"
    }
    let M = X,
        P;
    if (K[11] !== A || K[12] !== j) P = (h) => {
        return {
            ...KK.inputSchema.parse(h),
            _simulatedSedEdit: {
                filePath: A,
                newContent: j
            }
        }
    }, K[11] = A, K[12] = j, K[13] = P;
    else P = K[13];
    let W = P,
        D = z.toolUseConfirm,
        Z = z.toolUseContext,
        G = z.onDone,
        f = z.onReject,
        v;
    if (K[14] !== A) v = RKA(b8(), A), K[14] = A, K[15] = v;
    else v = K[15];
    let V;
    if (K[16] !== A) V = hKA(A), K[16] = A, K[17] = V;
    else V = K[17];
    let k;
    if (K[18] !== V) k = uu.default.createElement(T, null, "Do you want to make this edit to", " ", uu.default.createElement(T, {
        bold: !0
    }, V), "?"), K[18] = V, K[19] = k;
    else k = K[19];
    let N;
    if (K[20] !== J || K[21] !== A || K[22] !== M) N = J.length > 0 ? uu.default.createElement(As8, {
        file_path: A,
        edits: J
    }) : uu.default.createElement(T, {
        dimColor: !0
    }, M), K[20] = J, K[21] = A, K[22] = M, K[23] = N;
    else N = K[23];
    let R;
    if (K[24] !== A || K[25] !== W || K[26] !== z.onDone || K[27] !== z.onReject || K[28] !== z.toolUseConfirm || K[29] !== z.toolUseContext || K[30] !== z.workerBadge || K[31] !== k || K[32] !== N || K[33] !== v) R = uu.default.createElement(Qn, {
        toolUseConfirm: D,
        toolUseContext: Z,
        onDone: G,
        onReject: f,
        title: "Edit file",
        subtitle: v,
        question: k,
        content: N,
        path: A,
        completionType: "str_replace_single",
        parseInput: W,
        workerBadge: z.workerBadge
    }), K[24] = A, K[25] = W, K[26] = z.onDone, K[27] = z.onReject, K[28] = z.toolUseConfirm, K[29] = z.toolUseContext, K[30] = z.workerBadge, K[31] = k, K[32] = N, K[33] = v, K[34] = R;
    else R = K[34];
    return R
}
// @from(Ln 520362, Col 4)
uu
// @from(Ln 520363, Col 4)
d45 = L(() => {
    o6();
    zM7();
    n7();
    m8();
    nN();
    Yq();
    g6();
    AZ();
    OK8();
    $m6();
    uu = K6(P6(), 1)
})
// @from(Ln 520377, Col 0)
function y0(q, {
    assistantMessage: {
        message: {
            id: K
        }
    }
}, _, z) {
    bG({
        completion_type: q,
        event: _,
        metadata: {
            language_name: "none",
            message_id: K,
            platform: ef6(),
            hasFeedback: z ?? !1
        }
    })
}
// @from(Ln 520395, Col 4)
jm6 = L(() => {
    D_();
    Om6()
})
// @from(Ln 520400, Col 0)
function Os8({
    toolUseConfirm: q,
    onDone: K,
    onReject: _,
    explainerVisible: z
}) {
    let Y = R7(),
        [A, O] = vz6.useState(""),
        [w, $] = vz6.useState(""),
        [j, H] = vz6.useState(!1),
        [J, X] = vz6.useState(!1),
        [M, P] = vz6.useState("yes"),
        [W, D] = vz6.useState(!1),
        [Z, G] = vz6.useState(!1);

    function f(k) {
        q.onUserInteraction();
        let N = {
            toolName: PK(q.tool.name),
            isMcp: q.tool.isMcp ?? !1
        };
        if (k === "yes")
            if (j) H(!1), d("tengu_accept_feedback_mode_collapsed", N);
            else H(!0), D(!0), d("tengu_accept_feedback_mode_entered", N);
        else if (k === "no")
            if (J) X(!1), d("tengu_reject_feedback_mode_collapsed", N);
            else X(!0), G(!0), d("tengu_reject_feedback_mode_entered", N)
    }

    function v(k) {
        let N = k?.trim(),
            R = !!N;
        if (!R) d("tengu_permission_request_escape", {
            explainer_visible: z
        }), Y((h) => ({
            ...h,
            attribution: {
                ...h.attribution,
                escapeCount: h.attribution.escapeCount + 1
            }
        }));
        if (y0("tool_use_single", q, "reject", R), N) q.onReject(N);
        else q.onReject();
        _(), K()
    }

    function V(k) {
        if (k !== M) q.onUserInteraction();
        if (k !== "yes" && j && !w.trim()) H(!1);
        if (k !== "no" && J && !A.trim()) X(!1);
        P(k)
    }
    return {
        yesInputMode: j,
        noInputMode: J,
        yesFeedbackModeEntered: W,
        noFeedbackModeEntered: Z,
        acceptFeedback: w,
        rejectFeedback: A,
        setAcceptFeedback: $,
        setRejectFeedback: O,
        focusedOption: M,
        handleInputModeToggle: f,
        handleReject: v,
        handleFocus: V
    }
}
// @from(Ln 520467, Col 4)
vz6
// @from(Ln 520468, Col 4)
OM7 = L(() => {
    C8();
    q2();
    N7();
    jm6();
    vz6 = K6(P6(), 1)
})
// @from(Ln 520480, Col 0)
function bKA(q) {
    switch (q.length) {
        case 0:
            return "";
        case 1:
            return Y$.default.createElement(T, {
                bold: !0
            }, q[0]);
        case 2:
            return Y$.default.createElement(T, null, Y$.default.createElement(T, {
                bold: !0
            }, q[0]), " and ", Y$.default.createElement(T, {
                bold: !0
            }, q[1]));
        default:
            return Y$.default.createElement(T, null, Y$.default.createElement(T, {
                bold: !0
            }, q.slice(0, -1).join(", ")), ", and", " ", Y$.default.createElement(T, {
                bold: !0
            }, q.slice(-1)[0]))
    }
}
// @from(Ln 520503, Col 0)
function wM7(q) {
    if (q.join(", ").length > 50) return "similar";
    return bKA(q)
}
// @from(Ln 520508, Col 0)
function Uz8(q) {
    if (q.length === 0) return "";
    let K = q.map((_) => $M7(_) || _);
    if (K.length === 1) return Y$.default.createElement(T, null, Y$.default.createElement(T, {
        bold: !0
    }, K[0]), uW6);
    if (K.length === 2) return Y$.default.createElement(T, null, Y$.default.createElement(T, {
        bold: !0
    }, K[0]), uW6, " and ", Y$.default.createElement(T, {
        bold: !0
    }, K[1]), uW6);
    return Y$.default.createElement(T, null, Y$.default.createElement(T, {
        bold: !0
    }, K[0]), uW6, ", ", Y$.default.createElement(T, {
        bold: !0
    }, K[1]), uW6, " and ", q.length - 2, " more")
}
// @from(Ln 520526, Col 0)
function ws8(q, K, _) {
    let z = q.filter((X) => X.type === "addRules").flatMap((X) => X.rules || []),
        Y = z.filter((X) => X.toolName === "Read"),
        A = z.filter((X) => X.toolName === K),
        O = q.filter((X) => X.type === "addDirectories").flatMap((X) => X.directories || []),
        w = Y.map((X) => X.ruleContent?.replace("/**", "") || "").filter((X) => X),
        $ = F4(A.flatMap((X) => {
            if (!X.ruleContent) return [];
            let M = X.ruleContent.endsWith(":*") || X.ruleContent.endsWith(" *") ? X.ruleContent.slice(0, -2) : X.ruleContent;
            return _ ? _(M) : M
        })),
        j = O.length > 0,
        H = w.length > 0,
        J = $.length > 0;
    if (H && !j && !J) {
        if (w.length === 1) {
            let X = w[0],
                M = $M7(X) || X;
            return Y$.default.createElement(T, null, "Yes, allow reading from ", Y$.default.createElement(T, {
                bold: !0
            }, M), uW6, " from this project")
        }
        return Y$.default.createElement(T, null, "Yes, allow reading from ", Uz8(w), " from this project")
    }
    if (j && !H && !J) {
        if (O.length === 1) {
            let X = O[0],
                M = $M7(X) || X;
            return Y$.default.createElement(T, null, "Yes, and always allow access to ", Y$.default.createElement(T, {
                bold: !0
            }, M), uW6, " from this project")
        }
        return Y$.default.createElement(T, null, "Yes, and always allow access to ", Uz8(O), " from this project")
    }
    if (J && !j && !H) return Y$.default.createElement(T, null, "Yes, and don't ask again for ", wM7($), " commands in", " ", Y$.default.createElement(T, {
        bold: !0
    }, Y7()));
    if ((j || H) && !J) {
        let X = [...O, ...w];
        if (j && H) return Y$.default.createElement(T, null, "Yes, and always allow access to ", Uz8(X), " from this project")
    }
    if ((j || H) && J) {
        let X = [...O, ...w];
        if (X.length === 1 && $.length === 1) return Y$.default.createElement(T, null, "Yes, and allow access to ", Uz8(X), " and", " ", wM7($), " commands");
        return Y$.default.createElement(T, null, "Yes, and allow ", Uz8(X), " access and", " ", wM7($), " commands")
    }
    return null
}
// @from(Ln 520574, Col 4)
Y$
// @from(Ln 520575, Col 4)
jM7 = L(() => {
    y8();
    g6();
    Y$ = K6(P6(), 1)
})
// @from(Ln 520581, Col 0)
function IKA(q) {
    let {
        commandWithoutRedirections: K,
        redirections: _
    } = od(q);
    return _.length > 0 ? K : q
}
// @from(Ln 520589, Col 0)
function c45({
    suggestions: q = [],
    decisionReason: K,
    onRejectFeedbackChange: _,
    onAcceptFeedbackChange: z,
    onClassifierDescriptionChange: Y,
    classifierDescription: A,
    initialClassifierDescriptionEmpty: O = !1,
    existingAllowDescriptions: w = [],
    yesInputMode: $ = !1,
    noInputMode: j = !1,
    editablePrefix: H,
    onEditablePrefixChange: J
}) {
    let X = [];
    if ($) X.push({
        type: "input",
        label: "Yes",
        value: "yes",
        placeholder: "and tell Claude what to do next",
        onChange: z,
        allowEmptySubmitToCancel: !0
    });
    else X.push({
        label: "Yes",
        value: "yes"
    });
    if (xI()) {
        let M = q.some((W) => W.type === "addDirectories" || W.type === "addRules" && W.rules?.some((D) => D.toolName !== S7));
        if (H !== void 0 && J && !M && q.length > 0) X.push({
            type: "input",
            label: "Yes, and don’t ask again for",
            value: "yes-prefix-edited",
            placeholder: "command prefix (e.g., npm run *)",
            initialValue: H,
            onChange: J,
            allowEmptySubmitToCancel: !0,
            showLabelWithValue: !0,
            labelValueSeparator: ": ",
            resetCursorOnUpdate: !0
        });
        else if (q.length > 0) {
            let W = ws8(q, S7, IKA);
            if (W) X.push({
                label: W,
                value: "yes-apply-suggestions"
            })
        }
        let P = X.some((W) => W.value === "yes-prefix-edited")
    }
    if (j) X.push({
        type: "input",
        label: "No",
        value: "no",
        placeholder: "and tell Claude what to do differently",
        onChange: _,
        allowEmptySubmitToCancel: !0
    });
    else X.push({
        label: "No",
        value: "no"
    });
    return X
}
// @from(Ln 520653, Col 4)
l45 = L(() => {
    vD();
    uI();
    jM7()
})
// @from(Ln 520659, Col 0)
function n45(q) {
    let K = s(21),
        {
            toolUseConfirm: _,
            toolUseContext: z,
            onDone: Y,
            onReject: A,
            verbose: O,
            workerBadge: w
        } = q,
        $, j, H;
    if (K[0] !== _.input)({
        command: $,
        description: j
    } = KK.inputSchema.parse(_.input)), H = UC6($), K[0] = _.input, K[1] = $, K[2] = j, K[3] = H;
    else $ = K[1], j = K[2], H = K[3];
    let J = H;
    if (J) {
        let M;
        if (K[4] !== Y || K[5] !== A || K[6] !== J || K[7] !== _ || K[8] !== z || K[9] !== O || K[10] !== w) M = y3.default.createElement(Q45, {
            toolUseConfirm: _,
            toolUseContext: z,
            onDone: Y,
            onReject: A,
            verbose: O,
            workerBadge: w,
            sedInfo: J
        }), K[4] = Y, K[5] = A, K[6] = J, K[7] = _, K[8] = z, K[9] = O, K[10] = w, K[11] = M;
        else M = K[11];
        return M
    }
    let X;
    if (K[12] !== $ || K[13] !== j || K[14] !== Y || K[15] !== A || K[16] !== _ || K[17] !== z || K[18] !== O || K[19] !== w) X = y3.default.createElement(xKA, {
        toolUseConfirm: _,
        toolUseContext: z,
        onDone: Y,
        onReject: A,
        verbose: O,
        workerBadge: w,
        command: $,
        description: j
    }), K[12] = $, K[13] = j, K[14] = Y, K[15] = A, K[16] = _, K[17] = z, K[18] = O, K[19] = w, K[20] = X;
    else X = K[20];
    return X
}