
// @from(Ln 230248, Col 0)
async function* _P1(A, q, K) {
    let Y = mb9(K),
        z = {
            model: K.model,
            thinkingConfig: K.thinkingConfig,
            ...Dq() ? {
                fastMode: K.fastMode
            } : {}
        },
        _ = null,
        w = K.initialConsecutive529Errors ?? 0,
        O;
    for (let $ = 1; $ <= Y + 1; $++) {
        if (K.signal?.aborted) throw new Az;
        let H = Dq() ? z.fastMode && !Jm() : !1;
        try {
            if (_ === null || O instanceof a7 && O.status === 401 || TN8(O) || H54(O) || j54(O)) {
                if (O instanceof a7 && O.status === 401 || TN8(O)) {
                    let j = sA()?.accessToken;
                    if (j) await DG(j)
                }
                _ = await A()
            }
            return await q(_, $, z)
        } catch (j) {
            if (O = j, k(`API error (attempt ${$}/${Y+1}): ${j instanceof a7?`${j.status} ${j.message}`:_1(j)}`, {
                    level: "error"
                }), H && j instanceof a7 && (j.status === 429 || iF6(j))) {
                let X = j.headers?.get("anthropic-ratelimit-unified-overage-disabled-reason");
                if (X !== null && X !== void 0) {
                    Lf7(X), z.fastMode = !1;
                    continue
                }
                let P = pb9(j);
                if (P !== null && P < gb9) {
                    await uk(P, K.signal);
                    continue
                }
                let W = Math.max(P ?? Bb9, Fb9),
                    Z = iF6(j) ? "overloaded" : "rate_limit";
                if (kf7(Date.now() + W, Z), Dq()) z.fastMode = !1;
                continue
            }
            if (H && Cb9(j)) {
                Ef7(), z.fastMode = !1;
                continue
            }
            if (iF6(j) && (process.env.FALLBACK_FOR_ALL_PRIMARY_MODELS || !iA() && V36(K.model))) {
                if (w++, w >= hb9) {
                    if (K.fallbackModel) throw d("tengu_api_opus_fallback_triggered", {
                        original_model: K.model,
                        fallback_model: K.fallbackModel,
                        provider: k76()
                    }), new R36(K.model, K.fallbackModel);
                    if (!process.env.IS_SANDBOX) throw d("tengu_api_custom_529_overloaded_error", {}), new RB(Error(Vv8), z)
                }
            }
            if ($ > Y) throw new RB(j, z);
            if (!(Ib9(j) || xb9(j)) && (!(j instanceof a7) || !ub9(j))) throw new RB(j, z);
            if (j instanceof a7) {
                let X = $54(j);
                if (X) {
                    let {
                        inputTokens: P,
                        contextLimit: W
                    } = X, Z = 1000, G = Math.max(0, W - P - 1000);
                    if (G < fN8) throw _6(Error(`availableContext ${G} is less than FLOOR_OUTPUT_TOKENS ${fN8}`)), j;
                    let f = (z.thinkingConfig.type === "enabled" ? z.thinkingConfig.budgetTokens : 0) + 1,
                        v = Math.max(fN8, G, f);
                    z.maxTokensOverride = v, d("tengu_max_tokens_context_overflow_adjustment", {
                        inputTokens: P,
                        contextLimit: W,
                        adjustedMaxTokens: v,
                        attempt: $
                    });
                    continue
                }
            }
            let M = O54(j),
                D = VI($, M);
            if (j instanceof a7) yield J54(j, D, $, Y);
            d("tengu_api_retry", {
                attempt: $,
                delayMs: D,
                error: j.message,
                status: j.status,
                provider: k76()
            }), await uk(D, K.signal)
        }
    }
    throw new RB(O, z)
}
// @from(Ln 230341, Col 0)
function O54(A) {
    return (A.headers?.["retry-after"] || A.headers?.get?.("retry-after")) ?? null
}
// @from(Ln 230345, Col 0)
function VI(A, q) {
    if (q) {
        let z = parseInt(q, 10);
        if (!isNaN(z)) return z * 1000
    }
    let K = Math.min(Sb9 * Math.pow(2, A - 1), 32000),
        Y = Math.random() * 0.25 * K;
    return K + Y
}
// @from(Ln 230355, Col 0)
function $54(A) {
    if (A.status !== 400 || !A.message) return;
    if (!A.message.includes("input length and `max_tokens` exceed context limit")) return;
    let q = /input length and `max_tokens` exceed context limit: (\d+) \+ (\d+) > (\d+)/,
        K = A.message.match(q);
    if (!K || K.length !== 4) return;
    if (!K[1] || !K[2] || !K[3]) {
        _6(Error("Unable to parse max_tokens from max_tokens exceed context limit error message"));
        return
    }
    let Y = parseInt(K[1], 10),
        z = parseInt(K[2], 10),
        _ = parseInt(K[3], 10);
    if (isNaN(Y) || isNaN(z) || isNaN(_)) return;
    return {
        inputTokens: Y,
        maxTokens: z,
        contextLimit: _
    }
}
// @from(Ln 230376, Col 0)
function Cb9(A) {
    if (!(A instanceof a7)) return !1;
    return A.status === 400 && (A.message?.includes("Fast mode is not enabled") ?? !1)
}
// @from(Ln 230381, Col 0)
function iF6(A) {
    if (!(A instanceof a7)) return !1;
    return A.status === 529 || (A.message?.includes('"type":"overloaded_error"') ?? !1)
}
// @from(Ln 230386, Col 0)
function TN8(A) {
    return A instanceof a7 && A.status === 403 && (A.message?.includes("OAuth token has been revoked") ?? !1)
}
// @from(Ln 230390, Col 0)
function H54(A) {
    if (t6(process.env.CLAUDE_CODE_USE_BEDROCK)) {
        if (z54(A) || A instanceof a7 && A.status === 403) return !0
    }
    return !1
}
// @from(Ln 230397, Col 0)
function Ib9(A) {
    if (H54(A)) return oF6(), !0;
    return !1
}
// @from(Ln 230402, Col 0)
function bb9(A) {
    if (!(A instanceof Error)) return !1;
    let q = A.message;
    return q.includes("Could not load the default credentials") || q.includes("Could not refresh access token") || q.includes("invalid_grant")
}
// @from(Ln 230408, Col 0)
function j54(A) {
    if (t6(process.env.CLAUDE_CODE_USE_VERTEX)) {
        if (bb9(A)) return !0;
        if (A instanceof a7 && A.status === 401) return !0
    }
    return !1
}
// @from(Ln 230416, Col 0)
function xb9(A) {
    if (j54(A)) return aF6(), !0;
    return !1
}
// @from(Ln 230421, Col 0)
function ub9(A) {
    if (OA4(A)) return !1;
    if (A.message?.includes('"type":"overloaded_error"')) return !0;
    if ($54(A)) return !0;
    let q = A.headers?.get("x-should-retry");
    if (q === "true" && !iA()) return !0;
    if (q === "false") {
        let K = A.status !== void 0 && A.status >= 500;
        return !1
    }
    if (A instanceof mW) return !0;
    if (!A.status) return !1;
    if (A.status === 408) return !0;
    if (A.status === 409) return !0;
    if (A.status === 429) return !iA();
    if (A.status === 401) return rF6(), !0;
    if (TN8(A)) return !0;
    if (A.status && A.status >= 500) return !0;
    return !1
}
// @from(Ln 230442, Col 0)
function nF6() {
    if (process.env.CLAUDE_CODE_MAX_RETRIES) return parseInt(process.env.CLAUDE_CODE_MAX_RETRIES, 10);
    return Rb9
}
// @from(Ln 230447, Col 0)
function mb9(A) {
    return A.maxRetries ?? nF6()
}
// @from(Ln 230451, Col 0)
function pb9(A) {
    let q = O54(A);
    if (q) {
        let K = parseInt(q, 10);
        if (!isNaN(K)) return K * 1000
    }
    return null
}
// @from(Ln 230459, Col 4)
Rb9 = 10
// @from(Ln 230460, Col 4)
fN8 = 3000
// @from(Ln 230461, Col 4)
hb9 = 3
// @from(Ln 230462, Col 4)
Sb9 = 500
// @from(Ln 230463, Col 4)
RB
// @from(Ln 230463, Col 8)
R36
// @from(Ln 230463, Col 13)
Bb9 = 1800000
// @from(Ln 230464, Col 4)
gb9 = 20000
// @from(Ln 230465, Col 4)
Fb9 = 600000
// @from(Ln 230466, Col 4)
Ud = E(() => {
    wv();
    k1();
    H1();
    z4();
    Nz();
    fA();
    V1();
    yB();
    GN8();
    IF6();
    JA();
    uv();
    A8();
    FW();
    s8();
    RB = class RB extends Error {
        originalError;
        retryContext;
        constructor(A, q) {
            let K = _1(A);
            super(K);
            this.originalError = A;
            this.retryContext = q;
            if (this.name = "RetryError", A instanceof Error && A.stack) this.stack = A.stack
        }
    };
    R36 = class R36 extends Error {
        originalModel;
        fallbackModel;
        constructor(A, q) {
            super(`Model fallback triggered: ${A} -> ${q}`);
            this.originalModel = A;
            this.fallbackModel = q;
            this.name = "FallbackTriggeredError"
        }
    }
})
// @from(Ln 230505, Col 0)
function Qb9(A, q, K, Y) {
    var z = A.length,
        _ = K + (Y ? 1 : -1);
    while (Y ? _-- : ++_ < z)
        if (q(A[_], _, A)) return _;
    return -1
}
// @from(Ln 230512, Col 4)
M54
// @from(Ln 230513, Col 4)
D54 = E(() => {
    M54 = Qb9
})
// @from(Ln 230517, Col 0)
function Ub9(A) {
    return A !== A
}
// @from(Ln 230520, Col 4)
X54
// @from(Ln 230521, Col 4)
P54 = E(() => {
    X54 = Ub9
})
// @from(Ln 230525, Col 0)
function db9(A, q, K) {
    var Y = K - 1,
        z = A.length;
    while (++Y < z)
        if (A[Y] === q) return Y;
    return -1
}
// @from(Ln 230532, Col 4)
W54
// @from(Ln 230533, Col 4)
Z54 = E(() => {
    W54 = db9
})
// @from(Ln 230537, Col 0)
function cb9(A, q, K) {
    return q === q ? W54(A, q, K) : M54(A, X54, K)
}
// @from(Ln 230540, Col 4)
G54
// @from(Ln 230541, Col 4)
f54 = E(() => {
    D54();
    P54();
    Z54();
    G54 = cb9
})
// @from(Ln 230548, Col 0)
function lb9(A, q) {
    var K = A == null ? 0 : A.length;
    return !!K && G54(A, q, 0) > -1
}
// @from(Ln 230552, Col 4)
T54
// @from(Ln 230553, Col 4)
v54 = E(() => {
    f54();
    T54 = lb9
})
// @from(Ln 230558, Col 0)
function ib9(A, q, K) {
    var Y = -1,
        z = A == null ? 0 : A.length;
    while (++Y < z)
        if (K(q, A[Y])) return !0;
    return !1
}
// @from(Ln 230565, Col 4)
N54
// @from(Ln 230566, Col 4)
V54 = E(() => {
    N54 = ib9
})
// @from(Ln 230569, Col 4)
nb9 = 1 / 0
// @from(Ln 230570, Col 4)
rb9
// @from(Ln 230570, Col 9)
k54
// @from(Ln 230571, Col 4)
E54 = E(() => {
    px1();
    vj8();
    gs6();
    rb9 = !(Tn && 1 / Pw6(new Tn([, -0]))[1] == nb9) ? uU : function(A) {
        return new Tn(A)
    }, k54 = rb9
})
// @from(Ln 230580, Col 0)
function ab9(A, q, K) {
    var Y = -1,
        z = T54,
        _ = A.length,
        w = !0,
        O = [],
        $ = O;
    if (K) w = !1, z = N54;
    else if (_ >= ob9) {
        var H = q ? null : k54(A);
        if (H) return Pw6(H);
        w = !1, z = ms6, $ = new us6
    } else $ = q ? [] : O;
    A: while (++Y < _) {
        var j = A[Y],
            J = q ? q(j) : j;
        if (j = K || j !== 0 ? j : 0, w && J === J) {
            var M = $.length;
            while (M--)
                if ($[M] === J) continue A;
            if (q) $.push(J);
            O.push(j)
        } else if (!z($, J, K)) {
            if ($ !== O) $.push(J);
            O.push(j)
        }
    }
    return O
}
// @from(Ln 230609, Col 4)
ob9 = 200
// @from(Ln 230610, Col 4)
y54
// @from(Ln 230611, Col 4)
L54 = E(() => {
    Lx1();
    v54();
    V54();
    Rx1();
    E54();
    gs6();
    y54 = ab9
})
// @from(Ln 230621, Col 0)
function sb9(A, q) {
    return A && A.length ? y54(A, Ex(q, 2)) : []
}
// @from(Ln 230624, Col 4)
K0
// @from(Ln 230625, Col 4)
dd = E(() => {
    Sw6();
    L54();
    K0 = sb9
})
// @from(Ln 230631, Col 0)
function uq(A) {
    return A
}
// @from(Ln 230635, Col 0)
function R54() {
    tb9.clear()
}
// @from(Ln 230638, Col 4)
tb9
// @from(Ln 230639, Col 4)
bt = E(() => {
    H1();
    V1();
    g1();
    k1();
    RY();
    tb9 = new Map
})
// @from(Ln 230648, Col 0)
function h54(A) {
    return w8("tengu_lean_cast", !1) ? Kx9 : A
}
// @from(Ln 230652, Col 0)
function S54(A) {
    let q = zx9.replace(wP1, h54(qx9));
    if (A && A.trim() !== "") q += `

Additional Instructions:
${A}`;
    return q += `

IMPORTANT: Do NOT use any tools. You MUST respond with ONLY the <summary>...</summary> block as your text output.`, q
}
// @from(Ln 230663, Col 0)
function C54(A) {
    let q = Yx9.replace(wP1, h54(Ax9));
    if (A && A.trim() !== "") q += `

Additional Instructions:
${A}`;
    return q += `

IMPORTANT: Do NOT use any tools. You MUST respond with ONLY the <summary>...</summary> block as your text output.`, q
}
// @from(Ln 230674, Col 0)
function _x9(A) {
    let q = A;
    q = q.replace(/<analysis>[\s\S]*?<\/analysis>/, "");
    let K = q.match(/<summary>([\s\S]*?)<\/summary>/);
    if (K) {
        let Y = K[1] || "";
        q = q.replace(/<summary>[\s\S]*?<\/summary>/, `Summary:
${Y.trim()}`)
    }
    return q = q.replace(/\n\n+/g, `

`), q.trim()
}
// @from(Ln 230688, Col 0)
function sF6(A, q, K, Y) {
    let _ = `This session is being continued from a previous conversation that ran out of context. The summary below covers the earlier portion of the conversation.

${_x9(A)}`;
    if (K) _ += `

If you need specific details from before compaction (like exact code snippets, error messages, or content you generated), read the full transcript at: ${K}`;
    if (Y) _ += `

Recent messages are preserved verbatim.`;
    if (q) return `${_}
Continue the conversation from where it left off without asking the user any further questions. Resume directly — do not acknowledge the summary, do not recap what was happening, do not preface with "I'll continue" or similar. Pick up the last task as if the break never happened.`;
    return _
}
// @from(Ln 230702, Col 4)
Ax9 = `Before providing your final summary, wrap your analysis in <analysis> tags to organize your thoughts and ensure you've covered all necessary points. In your analysis process:

1. Chronologically analyze each message and section of the conversation. For each section thoroughly identify:
   - The user's explicit requests and intents
   - Your approach to addressing the user's requests
   - Key decisions, technical concepts and code patterns
   - Specific details like:
     - file names
     - full code snippets
     - function signatures
     - file edits
   - Errors that you ran into and how you fixed them
   - Pay special attention to specific user feedback that you received, especially if the user told you to do something differently.
2. Double-check for technical accuracy and completeness, addressing each required element thoroughly.`
// @from(Ln 230716, Col 4)
qx9 = `Before providing your final summary, wrap your analysis in <analysis> tags to organize your thoughts and ensure you've covered all necessary points. In your analysis process:

1. Analyze the recent messages chronologically. For each section thoroughly identify:
   - The user's explicit requests and intents
   - Your approach to addressing the user's requests
   - Key decisions, technical concepts and code patterns
   - Specific details like:
     - file names
     - full code snippets
     - function signatures
     - file edits
   - Errors that you ran into and how you fixed them
   - Pay special attention to specific user feedback that you received, especially if the user told you to do something differently.
2. Double-check for technical accuracy and completeness, addressing each required element thoroughly.`
// @from(Ln 230730, Col 4)
Kx9 = `Before providing your final summary, wrap your analysis in <analysis> tags. Treat this as a private planning scratchpad — it is not the place for content meant to reach the user. Use it to plan, not to draft:

- Walk through chronologically and note (in a line or two each) what belongs in each of the 9 sections below
- Flag anything you might otherwise forget: a user correction, an unresolved error, the exact task in flight
- Do NOT write code snippets, file contents, or verbatim quotes here — save those for <summary> where they will actually be kept

The goal of <analysis> is coverage, not detail. The detail goes in <summary>.`
// @from(Ln 230737, Col 4)
wP1 = "<<ANALYSIS_INSTRUCTION>>"
// @from(Ln 230738, Col 4)
Yx9
// @from(Ln 230738, Col 9)
zx9
// @from(Ln 230739, Col 4)
vN8 = E(() => {
    HA();
    Yx9 = `Your task is to create a detailed summary of the conversation so far, paying close attention to the user's explicit requests and your previous actions.
This summary should be thorough in capturing technical details, code patterns, and architectural decisions that would be essential for continuing development work without losing context.

${wP1}

Your summary should include the following sections:

1. Primary Request and Intent: Capture all of the user's explicit requests and intents in detail
2. Key Technical Concepts: List all important technical concepts, technologies, and frameworks discussed.
3. Files and Code Sections: Enumerate specific files and code sections examined, modified, or created. Pay special attention to the most recent messages and include full code snippets where applicable and include a summary of why this file read or edit is important.
4. Errors and fixes: List all errors that you ran into, and how you fixed them. Pay special attention to specific user feedback that you received, especially if the user told you to do something differently.
5. Problem Solving: Document problems solved and any ongoing troubleshooting efforts.
6. All user messages: List ALL user messages that are not tool results. These are critical for understanding the users' feedback and changing intent.
7. Pending Tasks: Outline any pending tasks that you have explicitly been asked to work on.
8. Current Work: Describe in detail precisely what was being worked on immediately before this summary request, paying special attention to the most recent messages from both user and assistant. Include file names and code snippets where applicable.
9. Optional Next Step: List the next step that you will take that is related to the most recent work you were doing. IMPORTANT: ensure that this step is DIRECTLY in line with the user's most recent explicit requests, and the task you were working on immediately before this summary request. If your last task was concluded, then only list next steps if they are explicitly in line with the users request. Do not start on tangential requests or really old requests that were already completed without confirming with the user first.
                       If there is a next step, include direct quotes from the most recent conversation showing exactly what task you were working on and where you left off. This should be verbatim to ensure there's no drift in task interpretation.

Here's an example of how your output should be structured:

<example>
<analysis>
[Your thought process, ensuring all points are covered thoroughly and accurately]
</analysis>

<summary>
1. Primary Request and Intent:
   [Detailed description]

2. Key Technical Concepts:
   - [Concept 1]
   - [Concept 2]
   - [...]

3. Files and Code Sections:
   - [File Name 1]
      - [Summary of why this file is important]
      - [Summary of the changes made to this file, if any]
      - [Important Code Snippet]
   - [File Name 2]
      - [Important Code Snippet]
   - [...]

4. Errors and fixes:
    - [Detailed description of error 1]:
      - [How you fixed the error]
      - [User feedback on the error if any]
    - [...]

5. Problem Solving:
   [Description of solved problems and ongoing troubleshooting]

6. All user messages: 
    - [Detailed non tool use user message]
    - [...]

7. Pending Tasks:
   - [Task 1]
   - [Task 2]
   - [...]

8. Current Work:
   [Precise description of current work]

9. Optional Next Step:
   [Optional Next step to take]

</summary>
</example>

Please provide your summary based on the conversation so far, following this structure and ensuring precision and thoroughness in your response. 

There may be additional summarization instructions provided in the included context. If so, remember to follow these instructions when creating the above summary. Examples of instructions include:
<example>
## Compact Instructions
When summarizing the conversation focus on typescript code changes and also remember the mistakes you made and how you fixed them.
</example>

<example>
# Summary instructions
When you are using compact - please focus on test output and code changes. Include file reads verbatim.
</example>
`, zx9 = `Your task is to create a detailed summary of the RECENT portion of the conversation — the messages that follow earlier retained context. The earlier messages are being kept intact and do NOT need to be summarized. Focus your summary on what was discussed, learned, and accomplished in the recent messages only.

${wP1}

Your summary should include the following sections:

1. Primary Request and Intent: Capture the user's explicit requests and intents from the recent messages
2. Key Technical Concepts: List important technical concepts, technologies, and frameworks discussed recently.
3. Files and Code Sections: Enumerate specific files and code sections examined, modified, or created. Include full code snippets where applicable and include a summary of why this file read or edit is important.
4. Errors and fixes: List errors encountered and how they were fixed.
5. Problem Solving: Document problems solved and any ongoing troubleshooting efforts.
6. All user messages: List ALL user messages from the recent portion that are not tool results.
7. Pending Tasks: Outline any pending tasks from the recent messages.
8. Current Work: Describe precisely what was being worked on immediately before this summary request.
9. Optional Next Step: List the next step related to the most recent work. Include direct quotes from the most recent conversation.

Here's an example of how your output should be structured:

<example>
<analysis>
[Your thought process, ensuring all points are covered thoroughly and accurately]
</analysis>

<summary>
1. Primary Request and Intent:
   [Detailed description]

2. Key Technical Concepts:
   - [Concept 1]
   - [Concept 2]

3. Files and Code Sections:
   - [File Name 1]
      - [Summary of why this file is important]
      - [Important Code Snippet]

4. Errors and fixes:
    - [Error description]:
      - [How you fixed it]

5. Problem Solving:
   [Description]

6. All user messages:
    - [Detailed non tool use user message]

7. Pending Tasks:
   - [Task 1]

8. Current Work:
   [Precise description of current work]

9. Optional Next Step:
   [Optional Next step to take]

</summary>
</example>

Please provide your summary based on the RECENT messages only (after the retained earlier context), following this structure and ensuring precision and thoroughness in your response.
`
})
// @from(Ln 230892, Col 0)
async function h36(A, q = 0, K, Y, z, _) {
    z?.throwIfAborted();
    let w = _?.truncateOnByteLimit ?? !1,
        O = await Hx9(A);
    if (O.isDirectory()) throw Error(`EISDIR: illegal operation on a directory, read '${A}'`);
    if (O.isFile() && O.size < jx9) {
        if (!w && Y !== void 0 && O.size > Y) throw new tF6(O.size, Y);
        let $ = await $x9(A, {
            encoding: "utf8",
            signal: z
        });
        return Jx9($, O.mtimeMs, q, K, w ? Y : void 0)
    }
    return Px9(A, q, K, Y, w, z)
}
// @from(Ln 230908, Col 0)
function Jx9(A, q, K, Y, z) {
    let _ = Y !== void 0 ? K + Y : 1 / 0,
        w = A.charCodeAt(0) === 65279 ? A.slice(1) : A,
        O = [],
        $ = 0,
        H = 0,
        j, J = 0,
        M = !1;

    function D(P) {
        if (z !== void 0) {
            let W = O.length > 0 ? 1 : 0,
                Z = J + W + Buffer.byteLength(P);
            if (Z > z) return M = !0, !1;
            J = Z
        }
        return O.push(P), !0
    }
    while ((j = w.indexOf(`
`, H)) !== -1) {
        if ($ >= K && $ < _ && !M) {
            let P = w.slice(H, j);
            if (P.endsWith("\r")) P = P.slice(0, -1);
            D(P)
        }
        $++, H = j + 1
    }
    if ($ >= K && $ < _ && !M) {
        let P = w.slice(H);
        if (P.endsWith("\r")) P = P.slice(0, -1);
        D(P)
    }
    $++;
    let X = O.join(`
`);
    return {
        content: X,
        lineCount: O.length,
        totalLines: $,
        totalBytes: Buffer.byteLength(w, "utf8"),
        readBytes: Buffer.byteLength(X, "utf8"),
        mtimeMs: q,
        ...M ? {
            truncatedByBytes: !0
        } : {}
    }
}
// @from(Ln 230956, Col 0)
function Mx9(A) {
    Ox9(A, (q, K) => {
        this.resolveMtime(q ? 0 : K.mtimeMs)
    })
}
// @from(Ln 230962, Col 0)
function Dx9(A) {
    if (this.isFirstChunk) {
        if (this.isFirstChunk = !1, A.charCodeAt(0) === 65279) A = A.slice(1)
    }
    if (this.totalBytesRead += Buffer.byteLength(A), !this.truncateOnByteLimit && this.maxBytes !== void 0 && this.totalBytesRead > this.maxBytes) {
        this.stream.destroy(new tF6(this.totalBytesRead, this.maxBytes));
        return
    }
    let q = this.partial.length > 0 ? this.partial + A : A;
    this.partial = "";
    let K = 0,
        Y;
    while ((Y = q.indexOf(`
`, K)) !== -1) {
        if (this.currentLineIndex >= this.offset && this.currentLineIndex < this.endLine) {
            let z = q.slice(K, Y);
            if (z.endsWith("\r")) z = z.slice(0, -1);
            if (this.truncateOnByteLimit && this.maxBytes !== void 0) {
                let _ = this.selectedLines.length > 0 ? 1 : 0,
                    w = this.selectedBytes + _ + Buffer.byteLength(z);
                if (w > this.maxBytes) this.truncatedByBytes = !0, this.endLine = this.currentLineIndex;
                else this.selectedBytes = w, this.selectedLines.push(z)
            } else this.selectedLines.push(z)
        }
        this.currentLineIndex++, K = Y + 1
    }
    if (K < q.length) {
        if (this.currentLineIndex >= this.offset && this.currentLineIndex < this.endLine) {
            let z = q.slice(K);
            if (this.truncateOnByteLimit && this.maxBytes !== void 0) {
                let _ = this.selectedLines.length > 0 ? 1 : 0;
                if (this.selectedBytes + _ + Buffer.byteLength(z) > this.maxBytes) {
                    this.truncatedByBytes = !0, this.endLine = this.currentLineIndex;
                    return
                }
            }
            this.partial = z
        }
    }
}
// @from(Ln 231003, Col 0)
function Xx9() {
    let A = this.partial;
    if (A.endsWith("\r")) A = A.slice(0, -1);
    if (this.currentLineIndex >= this.offset && this.currentLineIndex < this.endLine)
        if (this.truncateOnByteLimit && this.maxBytes !== void 0) {
            let Y = this.selectedLines.length > 0 ? 1 : 0;
            if (this.selectedBytes + Y + Buffer.byteLength(A) > this.maxBytes) this.truncatedByBytes = !0;
            else this.selectedLines.push(A)
        } else this.selectedLines.push(A);
    this.currentLineIndex++;
    let q = this.selectedLines.join(`
`),
        K = this.truncatedByBytes;
    this.mtimeReady.then((Y) => {
        this.resolve({
            content: q,
            lineCount: this.selectedLines.length,
            totalLines: this.currentLineIndex,
            totalBytes: this.totalBytesRead,
            readBytes: Buffer.byteLength(q, "utf8"),
            mtimeMs: Y,
            ...K ? {
                truncatedByBytes: !0
            } : {}
        })
    })
}
// @from(Ln 231031, Col 0)
function Px9(A, q, K, Y, z, _) {
    return new Promise((w, O) => {
        let $ = {
            stream: wx9(A, {
                encoding: "utf8",
                highWaterMark: 524288,
                ..._ ? {
                    signal: _
                } : void 0
            }),
            offset: q,
            endLine: K !== void 0 ? q + K : 1 / 0,
            maxBytes: Y,
            truncateOnByteLimit: z,
            resolve: w,
            totalBytesRead: 0,
            selectedBytes: 0,
            truncatedByBytes: !1,
            currentLineIndex: 0,
            selectedLines: [],
            partial: "",
            isFirstChunk: !0,
            resolveMtime: () => {},
            mtimeReady: null
        };
        $.mtimeReady = new Promise((H) => {
            $.resolveMtime = H
        }), $.stream.once("open", Mx9.bind($)), $.stream.on("data", Dx9.bind($)), $.stream.once("end", Xx9.bind($)), $.stream.once("error", O)
    })
}
// @from(Ln 231061, Col 4)
jx9 = 10485760
// @from(Ln 231062, Col 4)
tF6
// @from(Ln 231063, Col 4)
eF6 = E(() => {
    Z7();
    tF6 = class tF6 extends Error {
        sizeInBytes;
        maxSizeBytes;
        constructor(A, q) {
            super(`File content (${xq(A)}) exceeds maximum allowed size (${xq(q)}). Use offset and limit parameters to read specific portions of the file, or search for specific content instead of reading the whole file.`);
            this.sizeInBytes = A;
            this.maxSizeBytes = q;
            this.name = "FileTooLargeError"
        }
    }
})
// @from(Ln 231077, Col 0)
function NN8(A) {
    if (/\d\s*<<\s*\d/.test(A) || /\[\[\s*\d+\s*<<\s*\d+\s*\]\]/.test(A) || /\$\(\(.*<<.*\)\)/.test(A)) return !1;
    return /<<-?\s*(?:(['"]?)(\w+)\1|\\(\w+))/.test(A)
}
// @from(Ln 231082, Col 0)
function Wx9(A) {
    let q = /'(?:[^'\\]|\\.)*\n(?:[^'\\]|\\.)*'/,
        K = /"(?:[^"\\]|\\.)*\n(?:[^"\\]|\\.)*"/;
    return q.test(A) || K.test(A)
}
// @from(Ln 231088, Col 0)
function I54(A, q = !0) {
    if (NN8(A) || Wx9(A)) {
        let Y = `'${A.replace(/'/g,`'"'"'`)}'`;
        if (NN8(A)) return Y;
        return q ? `${Y} < /dev/null` : Y
    }
    if (q) return j4([A, "<", "/dev/null"]);
    return j4([A])
}
// @from(Ln 231098, Col 0)
function Zx9(A) {
    return /(?:^|[\s;&|])<(?![<(])\s*\S+/.test(A)
}
// @from(Ln 231102, Col 0)
function b54(A) {
    if (NN8(A)) return !1;
    if (Zx9(A)) return !1;
    return !0
}
// @from(Ln 231108, Col 0)
function x54(A) {
    return A.replace(Gx9, "$1/dev/null")
}
// @from(Ln 231111, Col 4)
Gx9
// @from(Ln 231112, Col 4)
u54 = E(() => {
    RJ();
    Gx9 = /(\d?&?>+\s*)[Nn][Uu][Ll](?=\s|$|[|&;)\n])/g
})
// @from(Ln 231117, Col 0)
function B54(A) {
    if (A.includes("`")) return jW6(A);
    if (A.includes("$(")) return jW6(A);
    if (Nx9(A)) return jW6(A);
    let q = Vx9(A);
    if (q.includes(`
`)) return jW6(A);
    let K = Fz(q);
    if (!K.success) return jW6(A);
    let Y = K.tokens,
        z = fx9(Y);
    if (z <= 0) return jW6(A);
    let _ = [...m54(Y, 0, z), "< /dev/null", ...m54(Y, z, Y.length)];
    return g54(_.join(" "))
}
// @from(Ln 231133, Col 0)
function fx9(A) {
    for (let q = 0; q < A.length; q++) {
        let K = A[q];
        if (VN8(K, "|")) return q
    }
    return -1
}
// @from(Ln 231141, Col 0)
function m54(A, q, K) {
    let Y = [],
        z = !1;
    for (let _ = q; _ < K; _++) {
        let w = A[_];
        if (typeof w === "string" && /^[012]$/.test(w) && _ + 2 < K && VN8(A[_ + 1])) {
            let O = A[_ + 1],
                $ = A[_ + 2];
            if (O.op === ">&" && typeof $ === "string" && /^[012]$/.test($)) {
                Y.push(`${w}>&${$}`), _ += 2;
                continue
            }
            if (O.op === ">" && $ === "/dev/null") {
                Y.push(`${w}>/dev/null`), _ += 2;
                continue
            }
            if (O.op === ">" && typeof $ === "string" && $.startsWith("&")) {
                let H = $.slice(1);
                if (/^[012]$/.test(H)) {
                    Y.push(`${w}>&${H}`), _ += 2;
                    continue
                }
            }
        }
        if (typeof w === "string")
            if (!z && Tx9(w)) {
                let $ = w.indexOf("="),
                    H = w.slice(0, $),
                    j = w.slice($ + 1),
                    J = j4([j]);
                Y.push(`${H}=${J}`)
            } else z = !0, Y.push(j4([w]));
        else if (VN8(w)) {
            if (w.op === "glob" && "pattern" in w) Y.push(w.pattern);
            else if (Y.push(w.op), vx9(w.op)) z = !1
        }
    }
    return Y
}
// @from(Ln 231181, Col 0)
function Tx9(A) {
    return /^[A-Za-z_][A-Za-z0-9_]*=/.test(A)
}
// @from(Ln 231185, Col 0)
function vx9(A) {
    return A === "&&" || A === "||" || A === ";"
}
// @from(Ln 231189, Col 0)
function VN8(A, q) {
    if (!A || typeof A !== "object" || !("op" in A)) return !1;
    return q ? A.op === q : !0
}
// @from(Ln 231194, Col 0)
function Nx9(A) {
    return /\b(for|while|until|if|case|select)\s/.test(A)
}
// @from(Ln 231198, Col 0)
function jW6(A) {
    return g54(A) + " < /dev/null"
}
// @from(Ln 231202, Col 0)
function g54(A) {
    return "'" + A.replace(/'/g, `'"'"'`) + "'"
}
// @from(Ln 231206, Col 0)
function Vx9(A) {
    return A.replace(/\\+\n/g, (q) => {
        let K = q.length - 1;
        if (K % 2 === 1) return "\\".repeat(K - 1);
        else return q
    })
}
// @from(Ln 231213, Col 4)
F54 = E(() => {
    RJ()
})
// @from(Ln 231228, Col 0)
function yN8(A, q, K, Y = []) {
    let z = j4([K]),
        _ = Y.length > 0 ? `${Y.join(" ")} "$@"` : '"$@"';
    return [`function ${A} {`, "  if [[ -n $ZSH_VERSION ]]; then", `    ARGV0=${q} ${z} ${_}`, '  elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then', `    ARGV0=${q} ${z} ${_}`, "  elif [[ $BASHPID != $$ ]]; then", `    exec -a ${q} ${z} ${_}`, "  else", `    (exec -a ${q} ${z} ${_})`, "  fi", "}"].join(`
`)
}
// @from(Ln 231235, Col 0)
function Lx9() {
    let A = p$6();
    if (A.argv0) return {
        type: "function",
        snippet: yN8("rg", A.argv0, A.rgPath)
    };
    let q = j4([A.rgPath]),
        K = A.rgArgs.map((z) => j4([z]));
    return {
        type: "alias",
        snippet: A.rgArgs.length > 0 ? `${q} ${K.join(" ")}` : q
    }
}
// @from(Ln 231249, Col 0)
function hx9() {
    if (!n$()) return null;
    let A = C14();
    return ["unalias find 2>/dev/null || true", "unalias grep 2>/dev/null || true", yN8("find", "bfs", A, ["-regextype", "findutils-default"]), yN8("grep", "ugrep", A, ["-G", "--ignore-files", "--hidden", "-I", ...Rx9.map((q) => `--exclude-dir=${q}`)])].join(`
`)
}
// @from(Ln 231256, Col 0)
function LN8(A) {
    let q = A.includes("zsh") ? ".zshrc" : A.includes("bash") ? ".bashrc" : ".profile";
    return EN8(OP1.homedir(), q)
}
// @from(Ln 231261, Col 0)
function Sx9(A) {
    let q = A.endsWith(".zshrc"),
        K = "";
    if (q) K += `
      echo "# Functions" >> "$SNAPSHOT_FILE"

      # Force autoload all functions first
      typeset -f > /dev/null 2>&1

      # Now get user function names - filter completion functions (single underscore prefix)
      # but keep double-underscore helpers (e.g. __zsh_like_cd from mise, __pyenv_init)
      typeset +f | grep -vE '^_[^_]' | while read func; do
        typeset -f "$func" >> "$SNAPSHOT_FILE"
      done
    `;
    else K += `
      echo "# Functions" >> "$SNAPSHOT_FILE"

      # Force autoload all functions first
      declare -f > /dev/null 2>&1

      # Now get user function names - filter completion functions (single underscore prefix)
      # but keep double-underscore helpers (e.g. __zsh_like_cd from mise, __pyenv_init)
      declare -F | cut -d' ' -f3 | grep -vE '^_[^_]' | while read func; do
        # Encode the function to base64, preserving all special characters
        encoded_func=$(declare -f "$func" | base64 )
        # Write the function definition to the snapshot
        echo "eval ${kN8}"${kN8}$(echo '$encoded_func' | base64 -d)${kN8}" > /dev/null 2>&1" >> "$SNAPSHOT_FILE"
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
// @from(Ln 231313, Col 0)
async function Cx9() {
    let A = process.env.PATH;
    if (y8() === "windows") {
        let z = await q9("echo $PATH", {
            shell: !0,
            reject: !1
        });
        if (z.exitCode === 0 && z.stdout) A = z.stdout.trim()
    }
    let q = Lx9(),
        K = "";
    if (K += `
      # Check for rg availability
      echo "# Check for rg availability" >> "$SNAPSHOT_FILE"
      echo "if ! (unalias rg 2>/dev/null; command -v rg) >/dev/null 2>&1; then" >> "$SNAPSHOT_FILE"
  `, q.type === "function") K += `
      cat >> "$SNAPSHOT_FILE" << 'RIPGREP_FUNC_END'
  ${q.snippet}
RIPGREP_FUNC_END
    `;
    else {
        let z = q.snippet.replace(/'/g, "'\\''");
        K += `
      echo '  alias rg='"'${z}'" >> "$SNAPSHOT_FILE"
    `
    }
    K += `
      echo "fi" >> "$SNAPSHOT_FILE"
  `;
    let Y = hx9();
    if (Y !== null) K += `
      # Shadow find/grep with embedded bfs/ugrep (ant-native only)
      echo "# Shadow find/grep with embedded bfs/ugrep" >> "$SNAPSHOT_FILE"
      cat >> "$SNAPSHOT_FILE" << 'FIND_GREP_FUNC_END'
${Y}
FIND_GREP_FUNC_END
    `;
    return K += `

      # Add PATH to the file
      echo "export PATH=${j4([A||""])}" >> "$SNAPSHOT_FILE"
  `, K
}
// @from(Ln 231356, Col 0)
async function Ix9(A, q, K) {
    let Y = LN8(A),
        z = Y.endsWith(".zshrc"),
        _ = K ? Sx9(Y) : !z ? 'echo "shopt -s expand_aliases" >> "$SNAPSHOT_FILE"' : "",
        w = await Cx9();
    return `SNAPSHOT_FILE=${j4([q])}
      ${K?`source "${Y}" < /dev/null`:"# No user config file to source"}

      # First, create/clear the snapshot file
      echo "# Snapshot file" >| "$SNAPSHOT_FILE"

      # When this file is sourced, we first unalias to avoid conflicts
      # This is necessary because aliases get "frozen" inside function definitions at definition time,
      # which can cause unexpected behavior when functions use commands that conflict with aliases
      echo "# Unset all aliases to avoid conflicts with functions" >> "$SNAPSHOT_FILE"
      echo "unalias -a 2>/dev/null || true" >> "$SNAPSHOT_FILE"

      ${_}

      ${w}

      # Exit silently on success, only report errors
      if [ ! -f "$SNAPSHOT_FILE" ]; then
        echo "Error: Snapshot file was not created at $SNAPSHOT_FILE" >&2
        exit 1
      fi
    `
}
// @from(Ln 231384, Col 4)
kN8 = "\\"
// @from(Ln 231385, Col 4)
p54 = 1e4
// @from(Ln 231386, Col 4)
Rx9
// @from(Ln 231386, Col 9)
RN8 = async (A) => {
        let q = A.includes("zsh") ? "zsh" : A.includes("bash") ? "bash" : "sh";
        return k(`Creating shell snapshot for ${q} (${A})`), new Promise(async (K) => {
            try {
                let Y = LN8(A);
                k(`Looking for shell config file: ${Y}`);
                let z = await uK(Y);
                if (!z) k(`Shell config file not found: ${Y}, creating snapshot with Claude Code defaults only`);
                let _ = Date.now(),
                    w = Math.random().toString(36).substring(2, 8),
                    O = EN8(c8(), "shell-snapshots");
                k(`Snapshots directory: ${O}`);
                let $ = EN8(O, `snapshot-${q}-${_}-${w}.sh`);
                await kx9(O, {
                    recursive: !0
                });
                let H = await Ix9(A, $, z);
                k(`Creating snapshot at: ${$}`), k(`Execution timeout: ${p54}ms`), yx9(A, ["-c", "-l", H], {
                    env: {
                        ...process.env.CLAUDE_CODE_DONT_INHERIT_ENV ? {} : process.env,
                        SHELL: A,
                        GIT_EDITOR: "true",
                        CLAUDECODE: "1"
                    },
                    timeout: p54,
                    maxBuffer: 1048576,
                    encoding: "utf8"
                }, async (j, J, M) => {
                    if (j) {
                        let D = j;
                        if (k(`Shell snapshot creation failed: ${j.message}`), k("Error details:"), k(`  - Error code: ${D?.code}`), k(`  - Error signal: ${D?.signal}`), k(`  - Error killed: ${D?.killed}`), k(`  - Shell path: ${A}`), k(`  - Config file: ${LN8(A)}`), k(`  - Config file exists: ${z}`), k(`  - Working directory: ${G1()}`), k(`  - Claude home: ${c8()}`), k(`Full snapshot script:
${H}`), J) k(`stdout output (${J.length} chars):
${J}`);
                        else k("No stdout output captured");
                        if (M) k(`stderr output (${M.length} chars): ${M}`);
                        else k("No stderr output captured");
                        _6(Error(`Failed to create shell snapshot: ${j.message}`));
                        let X = D?.signal ? OP1.constants.signals[D.signal] : void 0;
                        d("tengu_shell_snapshot_failed", {
                            stderr_length: M?.length || 0,
                            has_error_code: !!D?.code,
                            error_signal_number: X,
                            error_killed: D?.killed
                        }), K(void 0)
                    } else {
                        let D;
                        try {
                            D = (await Ex9($)).size
                        } catch {}
                        if (D !== void 0) k(`Shell snapshot created successfully (${D} bytes)`), E4(async () => {
                            try {
                                await $1().unlink($), k(`Cleaned up session snapshot: ${$}`)
                            } catch (X) {
                                k(`Error cleaning up session snapshot: ${X}`)
                            }
                        }), K($);
                        else {
                            k(`Shell snapshot file not found after creation: ${$}`), k(`Checking if parent directory still exists: ${O}`);
                            try {
                                let X = await $1().readdir(O);
                                k(`Directory contains ${X.length} files`)
                            } catch {
                                k(`Parent directory does not exist or is not accessible: ${O}`)
                            }
                            d("tengu_shell_unknown_error", {}), K(void 0)
                        }
                    }
                })
            } catch (Y) {
                if (k(`Unexpected error during snapshot creation: ${Y}`), Y instanceof Error) k(`Error stack trace: ${Y.stack}`);
                _6(Y), d("tengu_shell_snapshot_error", {}), K(void 0)
            }
        })
    }
// @from(Ln 231460, Col 4)
Q54 = E(() => {
    Z7();
    RJ();
    WW();
    k1();
    V1();
    A8();
    KY();
    SA();
    YK();
    H1();
    jy();
    XI();
    lA();
    Rx9 = [".git", ".svn", ".hg", ".bzr"]
})
// @from(Ln 231477, Col 0)
function d54() {
    return U54
}
// @from(Ln 231481, Col 0)
function c54() {
    U54.clear()
}
// @from(Ln 231484, Col 4)
U54
// @from(Ln 231485, Col 4)
hN8 = E(() => {
    U54 = new Map
})
// @from(Ln 231489, Col 0)
function n54() {
    if (!l54 || i54 === null) return null;
    return `${l54},${i54},0`
}
// @from(Ln 231493, Col 4)
l54 = null
// @from(Ln 231494, Col 4)
i54 = null
// @from(Ln 231495, Col 4)
r54 = E(() => {
    Eq();
    H1();
    k1();
    KY()
})
// @from(Ln 231514, Col 0)
function mx9(A) {
    if (process.env.CLAUDE_CODE_SHELL_PREFIX) return "{ shopt -u extglob || setopt NO_EXTENDED_GLOB; } >/dev/null 2>&1 || true";
    if (A.includes("bash")) return "shopt -u extglob 2>/dev/null || true";
    else if (A.includes("zsh")) return "setopt NO_EXTENDED_GLOB 2>/dev/null || true";
    return null
}
// @from(Ln 231520, Col 0)
async function o54(A, q) {
    let K, Y = q?.skipSnapshot ? Promise.resolve(void 0) : RN8(A).catch((_) => {
            k(`Failed to create shell snapshot: ${_}`);
            return
        }),
        z;
    return {
        type: "bash",
        shellPath: A,
        detached: !0,
        async buildExecCommand(_, w) {
            let O = await Y;
            if (O) try {
                await bx9(O)
            } catch {
                k(`Snapshot file missing, recreating: ${O}`), Y = RN8(A).catch((v) => {
                    k(`Failed to recreate shell snapshot: ${v}`);
                    return
                }), O = await Y
            }
            z = O, K = w.sandboxTmpDir;
            let $ = ux9(),
                j = y8() === "windows" ? GP($) : $,
                J = w.useSandbox ? $P1(w.sandboxTmpDir, `cwd-${w.id}`) : $P1(j, `claude-${w.id}-cwd`),
                M = w.useSandbox ? $P1(w.sandboxTmpDir, `cwd-${w.id}`) : xx9($, `claude-${w.id}-cwd`),
                D = x54(_),
                X = b54(D),
                P = I54(D, X);
            if (!w.useSandbox && D.includes("|") && X) P = B54(D);
            let W = [];
            if (O) {
                let v = y8() === "windows" ? GP(O) : O;
                W.push(`source ${j4([v])}`)
            }
            let Z = await F97();
            if (Z) W.push(Z);
            let G = mx9(A);
            if (G) W.push(G);
            W.push(`eval ${P}`), W.push(`pwd -P >| ${J}`);
            let f = W.join(" && ");
            if (process.env.CLAUDE_CODE_SHELL_PREFIX) f = M91(process.env.CLAUDE_CODE_SHELL_PREFIX, f);
            return {
                commandString: f,
                cwdFilePath: M
            }
        },
        getSpawnArgs(_) {
            let w = z !== void 0;
            if (w) k("Spawning shell without login (-l flag skipped)");
            return ["-c", ...w ? [] : ["-l"], _]
        },
        async getEnvironmentOverrides(_) {
            let w = _.includes("tmux"),
                O = n54(),
                $ = {};
            if (O) $.TMUX = O;
            if (K) {
                let H = K;
                if (y8() === "windows") H = GP(H);
                $.TMPDIR = H, $.CLAUDE_CODE_TMPDIR = H, $.TMPPREFIX = $P1(H, "zsh")
            }
            for (let [H, j] of d54()) $[H] = j;
            return $
        }
    }
}
// @from(Ln 231586, Col 4)
a54 = E(() => {
    RJ();
    P38();
    u54();
    F54();
    Q54();
    D91();
    YK();
    lx();
    H1();
    hN8();
    r54()
})
// @from(Ln 231606, Col 0)
function s54(A) {
    return {
        type: "powershell",
        shellPath: A,
        detached: !1,
        async buildExecCommand(q, K) {
            let Y = Bx9(gx9(), `claude-pwd-ps-${K.id}`),
                _ = `
; $_ec = if (!$?) { if ($LASTEXITCODE) { $LASTEXITCODE } else { 1 } } else { 0 }
; (Get-Location).Path | Out-File -FilePath '${Y.replace(/'/g,"''")}' -Encoding utf8 -NoNewline
; exit $_ec`;
            return {
                commandString: q + _,
                cwdFilePath: Y
            }
        },
        getSpawnArgs(q) {
            return ["-NoProfile", "-NonInteractive", "-Command", q]
        },
        async getEnvironmentOverrides() {
            return {}
        }
    }
}
// @from(Ln 231630, Col 4)
t54 = () => {}
// @from(Ln 231631, Col 0)
async function Fx9() {
    let A = await EM("pwsh");
    if (A) return A;
    let q = await EM("powershell");
    if (q) return q;
    return null
}
// @from(Ln 231639, Col 0)
function e54() {
    if (!SN8) SN8 = Fx9();
    return SN8
}
// @from(Ln 231643, Col 4)
SN8 = null
// @from(Ln 231644, Col 4)
A34 = E(() => {
    Oy()
})
// @from(Ln 231673, Col 0)
function CN8(A) {
    try {
        return ox9(A, Ap6.X_OK), !0
    } catch (q) {
        try {
            return cx9(A, ["--version"], {
                timeout: 1000,
                stdio: "ignore"
            }), !0
        } catch {
            return !1
        }
    }
}
// @from(Ln 231687, Col 0)
async function sx9() {
    let A = process.env.CLAUDE_CODE_SHELL;
    if (A)
        if ((A.includes("bash") || A.includes("zsh")) && CN8(A)) return k(`Using shell override: ${A}`), A;
        else k(`CLAUDE_CODE_SHELL="${A}" is not a valid bash/zsh path, falling back to detection`);
    let q = process.env.SHELL,
        K = q && (q.includes("bash") || q.includes("zsh")),
        Y = q?.includes("bash"),
        [z, _] = await Promise.all([EM("zsh"), EM("bash")]),
        w = ["/bin", "/usr/bin", "/usr/local/bin", "/opt/homebrew/bin"],
        $ = (Y ? ["bash", "zsh"] : ["zsh", "bash"]).flatMap((j) => w.map((J) => `${J}/${j}`));
    if (Y) {
        if (_) $.unshift(_);
        if (z) $.push(z)
    } else {
        if (z) $.unshift(z);
        if (_) $.push(_)
    }
    if (K && CN8(q)) $.unshift(q);
    let H = $.find((j) => j && CN8(j));
    if (!H) {
        let j = "No suitable shell found. Claude CLI requires a Posix shell environment. Please ensure you have a valid shell installed and the SHELL environment variable set.";
        throw _6(Error(j)), Error(j)
    }
    return H
}
// @from(Ln 231713, Col 0)
async function tx9() {
    let A = await sx9();
    return {
        provider: await o54(A)
    }
}
// @from(Ln 231719, Col 0)
async function HP1(A, q, K, Y) {
    let {
        timeout: z,
        onProgress: _,
        preventCwdChanges: w,
        shouldUseSandbox: O,
        shouldAutoBackground: $,
        onStdout: H
    } = Y ?? {}, j = z || ax9, J = await Au9[K](), M = Math.floor(Math.random() * 65536).toString(16).padStart(4, "0"), D = rx9(process.env.CLAUDE_CODE_TMPDIR || "/tmp", IN8()), {
        commandString: X,
        cwdFilePath: P
    } = await J.buildExecCommand(A, {
        id: M,
        sandboxTmpDir: O ? D : void 0,
        useSandbox: O ?? !1
    }), W = X, Z = k81();
    try {
        q34(Z)
    } catch {
        let R = AA();
        k(`Shell CWD "${Z}" no longer exists, recovering to "${R}"`);
        try {
            q34(R), Xt6(R), Z = R
        } catch {
            return E97(`Working directory "${Z}" no longer exists. Please restart Claude from an existing directory.`)
        }
    }
    if (q.aborted) return J38();
    let G = J.shellPath;
    if (O) {
        W = await vA.wrapWithSandbox(W, G, void 0, q);
        try {
            $1().mkdirSync(D, {
                mode: 448
            })
        } catch (R) {
            k(`Failed to create ${D} directory: ${R}`)
        }
    }
    let f = J.getSpawnArgs(W),
        v = await J.getEnvironmentOverrides(A),
        N = !!H,
        V = oV("local_bash"),
        L = new kw(V, _ ?? null, !N);
    await dx9(yJ6(), {
        recursive: !0
    });
    let h;
    if (!N) {
        let R = Ap6.O_NOFOLLOW ?? 0;
        h = Ux9(L.path, process.platform === "win32" ? "w" : Ap6.O_WRONLY | Ap6.O_CREAT | Ap6.O_APPEND | R)
    }
    try {
        let R = lx9(G, f, {
            env: {
                ...process.env,
                SHELL: K === "bash" ? G : void 0,
                GIT_EDITOR: "true",
                CLAUDECODE: "1",
                ...v,
                ...{}
            },
            cwd: Z,
            stdio: N ? ["pipe", "pipe", "pipe"] : ["pipe", h, h],
            detached: J.detached,
            windowsHide: !0
        });
        if (h !== void 0) K34(h);
        let u = H91(R, q, j, L, $);
        if (R.stdout && H) R.stdout.on("data", (g) => {
            H(typeof g === "string" ? g : g.toString())
        });
        let I = y8() === "windows" ? tA6(P) : P;
        return u.result.then(async (g) => {
            if (O) vA.cleanupAfterCommand();
            if (g && !w && !g.backgroundTaskId) try {
                let B = px9(I, {
                    encoding: "utf8"
                }).trim();
                if (y8() === "windows") B = tA6(B);
                VO(B, Z)
            } catch {
                d("tengu_shell_set_cwd", {
                    success: !1
                })
            }
            try {
                Qx9(I)
            } catch {}
        }), u
    } catch (R) {
        if (h !== void 0) try {
            K34(h)
        } catch {}
        return L.clear(), k(`Shell exec error: ${_1(R)}`), J38(void 0, {
            code: 126,
            stderr: _1(R)
        })
    }
}
// @from(Ln 231820, Col 0)
function VO(A, q) {
    let K = ix9(A) ? A : nx9(q || $1().cwd(), A);
    if (!$1().existsSync(K)) throw Error(`Path "${K}" does not exist`);
    let Y = $1().realpathSync(K);
    Xt6(Y);
    try {
        d("tengu_shell_set_cwd", {
            success: !0
        })
    } catch (z) {}
}
// @from(Ln 231831, Col 4)
ax9 = 1800000
// @from(Ln 231832, Col 4)
ex9
// @from(Ln 231832, Col 9)
Au9
// @from(Ln 231833, Col 4)
WR = E(() => {
    Oy();
    k1();
    V1();
    M38();
    qL();
    oC6();
    SM();
    SA();
    T1();
    H1();
    U4();
    lA();
    s8();
    RY();
    a54();
    t54();
    A34();
    Lz();
    lx();
    YK();
    ex9 = e1(tx9), Au9 = {
        bash: async () => (await ex9()).provider,
        powershell: async () => {
            let A = await e54();
            if (!A) throw Error("PowerShell is not available");
            return s54(A)
        }
    }
})
// @from(Ln 231864, Col 0)
function Y34(A) {
    let q = A.split(`
`),
        K = 0;
    while (K < q.length && q[K]?.trim() === "") K++;
    let Y = q.length - 1;
    while (Y >= 0 && q[Y]?.trim() === "") Y--;
    if (K > Y) return "";
    return q.slice(K, Y + 1).join(`
`)
}
// @from(Ln 231876, Col 0)
function bN8(A) {
    return /^data:image\/[a-z0-9.+_-]+;base64,/i.test(A)
}
// @from(Ln 231880, Col 0)
function z34(A) {
    let q = bN8(A);
    if (q) return {
        totalLines: 1,
        truncatedContent: A,
        isImage: q
    };
    let K = O91();
    if (A.length <= K) return {
        totalLines: A.split(`
`).length,
        truncatedContent: A,
        isImage: q
    };
    let Y = A.slice(0, K),
        z = A.slice(K).split(`
`).length,
        _ = `${Y}

... [${z} lines truncated] ...`;
    return {
        totalLines: A.split(`
`).length,
        truncatedContent: _,
        isImage: q
    }
}
// @from(Ln 231908, Col 0)
function JP1(A) {
    let q = G1(),
        K = AA(),
        Y = pAA();
    if (Y || q !== K && !kI(q, A)) {
        if (VO(K), !Y) return d("tengu_bash_tool_reset_to_original_dir", {}), !0
    }
    return !1
}
// @from(Ln 231917, Col 4)
jP1 = (A) => `${A.trim()}
Shell cwd was reset to ${AA()}`
// @from(Ln 231919, Col 4)
qp6 = E(() => {
    A8();
    $91();
    RY();
    T1();
    V1();
    lA();
    WR()
})
// @from(Ln 231929, Col 0)
function xN8(A) {
    if (!A) return "";
    let q = Array.isArray(A) ? A.join("") : A,
        {
            truncatedContent: K
        } = z34(q);
    return K
}
// @from(Ln 231938, Col 0)
function Ku9(A) {
    if (typeof A["image/png"] === "string") return {
        image_data: A["image/png"].replace(/\s/g, ""),
        media_type: "image/png"
    };
    if (typeof A["image/jpeg"] === "string") return {
        image_data: A["image/jpeg"].replace(/\s/g, ""),
        media_type: "image/jpeg"
    };
    return
}
// @from(Ln 231950, Col 0)
function Yu9(A) {
    switch (A.output_type) {
        case "stream":
            return {
                output_type: A.output_type, text: xN8(A.text)
            };
        case "execute_result":
        case "display_data":
            return {
                output_type: A.output_type, text: xN8(A.data?.["text/plain"]), image: A.data && Ku9(A.data)
            };
        case "error":
            return {
                output_type: A.output_type, text: xN8(`${A.ename}: ${A.evalue}
${A.traceback.join(`
`)}`)
            }
    }
}
// @from(Ln 231970, Col 0)
function _34(A, q, K, Y) {
    let z = A.id ?? `cell-${q}`,
        _ = {
            cellType: A.cell_type,
            source: Array.isArray(A.source) ? A.source.join("") : A.source,
            execution_count: A.cell_type === "code" ? A.execution_count || void 0 : void 0,
            cell_id: z
        };
    if (A.cell_type === "code") _.language = K;
    if (A.cell_type === "code" && A.outputs?.length) {
        let w = A.outputs.map(Yu9);
        if (!Y && B6(w).length > 1e4) _.outputs = [{
            output_type: "stream",
            text: `Outputs are too large to include. Use ${Q7} with: cat <notebook_path> | jq '.cells[${q}].outputs'`
        }];
        else _.outputs = w
    }
    return _
}
// @from(Ln 231990, Col 0)
function zu9(A) {
    let q = [];
    if (A.cellType !== "code") q.push(`<cell_type>${A.cellType}</cell_type>`);
    if (A.language !== "python" && A.cellType === "code") q.push(`<language>${A.language}</language>`);
    return {
        text: `<cell id="${A.cell_id}">${q.join("")}${A.source}</cell id="${A.cell_id}">`,
        type: "text"
    }
}
// @from(Ln 232000, Col 0)
function _u9(A) {
    let q = [];
    if (A.text) q.push({
        text: `
${A.text}`,
        type: "text"
    });
    if (A.image) q.push({
        type: "image",
        source: {
            data: A.image.image_data,
            media_type: A.image.media_type,
            type: "base64"
        }
    });
    return q
}
// @from(Ln 232018, Col 0)
function wu9(A) {
    let q = zu9(A),
        K = A.outputs?.flatMap(_u9);
    return [q, ...K ?? []]
}
// @from(Ln 232023, Col 0)
async function w34(A, q) {
    let K = L4(A),
        z = (await $1().readFileBytes(K)).toString("utf-8"),
        _ = i1(z),
        w = _.metadata.language_info?.name ?? "python";
    if (q) {
        let O = _.cells.find(($) => $.id === q);
        if (!O) throw Error(`Cell with ID "${q}" not found in notebook`);
        return [_34(O, _.cells.indexOf(O), w, !0)]
    }
    return _.cells.map((O, $) => _34(O, $, w, !1))
}
// @from(Ln 232036, Col 0)
function O34(A, q) {
    let K = A.flatMap(wu9);
    return {
        tool_use_id: q,
        type: "tool_result",
        content: K.reduce((Y, z) => {
            if (Y.length === 0) return [z];
            let _ = Y[Y.length - 1];
            if (_ && _.type === "text" && z.type === "text") return _.text += `
` + z.text, Y;
            return Y.push(z), Y
        }, [])
    }
}
// @from(Ln 232051, Col 0)
function Kp6(A) {
    let q = A.match(/^cell-(\d+)$/);
    if (q && q[1]) {
        let K = parseInt(q[1], 10);
        return isNaN(K) ? void 0 : K
    }
    return
}
// @from(Ln 232059, Col 4)
MP1 = E(() => {
    qp6();
    F9();
    SA();
    g1()
})
// @from(Ln 232066, Col 0)
function $u9() {
    let A = process.env.CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS;
    if (A) {
        let q = parseInt(A, 10);
        if (!isNaN(q) && q > 0) return q
    }
    return
}
// @from(Ln 232074, Col 4)
Ou9 = 25000
// @from(Ln 232075, Col 4)
S36
// @from(Ln 232076, Col 4)
uN8 = E(() => {
    U4();
    HA();
    Z7();
    S36 = e1(() => {
        let A = w8("tengu_amber_wren", {}),
            q = typeof A?.maxSizeBytes === "number" && Number.isFinite(A.maxSizeBytes) && A.maxSizeBytes > 0 ? A.maxSizeBytes : mN8,
            Y = $u9() ?? (typeof A?.maxTokens === "number" && Number.isFinite(A.maxTokens) && A.maxTokens > 0 ? A.maxTokens : Ou9),
            z = typeof A?.includeMaxSizeInPrompt === "boolean" ? A.includeMaxSizeInPrompt : void 0,
            _ = typeof A?.targetedRangeNudge === "boolean" ? A.targetedRangeNudge : void 0;
        return {
            maxSizeBytes: q,
            maxTokens: Y,
            includeMaxSizeInPrompt: z,
            targetedRangeNudge: _
        }
    })
})
// @from(Ln 232094, Col 4)
$34 = 50000
// @from(Ln 232095, Col 4)
Yp6 = 4
// @from(Ln 232096, Col 4)
H34 = 400000
// @from(Ln 232097, Col 4)
j34 = 200000
// @from(Ln 232098, Col 4)
EI = 50
// @from(Ln 232108, Col 0)
function M34(A, q) {
    let Y = w8(Du9, {})?.[A];
    if (typeof Y === "number" && Number.isFinite(Y) && Y > 0) return Y;
    return Math.min(q, $34)
}
// @from(Ln 232114, Col 0)
function Xu9() {
    return BN8(mj(AA()), R1())
}
// @from(Ln 232118, Col 0)
function xt() {
    return BN8(Xu9(), gN8)
}
// @from(Ln 232122, Col 0)
function FN8(A, q) {
    let K = q ? "json" : "txt";
    return BN8(xt(), `${A}.${K}`)
}
// @from(Ln 232126, Col 0)
async function zp6() {
    try {
        await Hu9(xt(), {
            recursive: !0
        })
    } catch {}
}
// @from(Ln 232133, Col 0)
async function XP1(A, q) {
    let K = Array.isArray(A);
    if (K) {
        if (A.some((H) => H.type !== "text")) return {
            error: "Cannot persist tool results containing non-text content"
        }
    }
    await zp6();
    let Y = FN8(q, K),
        z = K ? B6(A, null, 2) : A,
        _ = !1;
    try {
        await Ju9(Y), _ = !0
    } catch {}
    if (!_) {
        try {
            await ju9(Y, z, "utf-8")
        } catch ($) {
            let H = $ instanceof Error ? $ : Error(String($));
            return _6(H), {
                error: ku9(H)
            }
        }
        k(`Persisted tool result to ${Y} (${xq(z.length)})`)
    }
    let {
        preview: w,
        hasMore: O
    } = pN8(z, DP1);
    return {
        filepath: Y,
        originalSize: z.length,
        isJson: K,
        preview: w,
        hasMore: O
    }
}
// @from(Ln 232171, Col 0)
function PP1(A) {
    let q = `${J34}
`;
    return q += `Output too large (${xq(A.originalSize)}). Full output saved to: ${A.filepath}

`, q += `Preview (first ${xq(DP1)}):
`, q += A.preview, q += A.hasMore ? `
...
` : `
`, q += Mu9, q
}
// @from(Ln 232182, Col 0)
async function JW6(A, q, K) {
    let Y = A.mapToolResultToToolResultBlockParam(q, K);
    return X34(Y, A.name, M34(A.name, A.maxResultSizeChars))
}
// @from(Ln 232186, Col 0)
async function D34(A, q, K) {
    return X34(A, q, M34(q, K))
}
// @from(Ln 232190, Col 0)
function Pu9(A) {
    if (!A) return !0;
    if (typeof A === "string") return A.trim() === "";
    if (!Array.isArray(A)) return !1;
    if (A.length === 0) return !0;
    return A.every((q) => typeof q === "object" && ("type" in q) && q.type === "text" && ("text" in q) && (typeof q.text !== "string" || q.text.trim() === ""))
}
// @from(Ln 232197, Col 0)
async function X34(A, q, K) {
    let Y = A.content;
    if (Pu9(Y)) return d("tengu_tool_empty_result", {
        toolName: hq(q)
    }), {
        ...A,
        content: `(${q} completed with no output)`
    };
    if (!Y) return A;
    if (Z34(Y)) return A;
    let z = G34(Y),
        _ = K ?? H34;
    if (z <= _) return A;
    let w = await XP1(Y, A.tool_use_id);
    if (WP1(w)) return A;
    let O = PP1(w);
    return d("tengu_tool_result_persisted", {
        toolName: hq(q),
        originalSizeBytes: w.originalSize,
        persistedSizeBytes: O.length,
        estimatedOriginalTokens: Math.ceil(w.originalSize / Yp6),
        estimatedPersistedTokens: Math.ceil(O.length / Yp6),
        thresholdUsed: _
    }), {
        ...A,
        content: O
    }
}
// @from(Ln 232226, Col 0)
function pN8(A, q) {
    if (A.length <= q) return {
        preview: A,
        hasMore: !1
    };
    let Y = A.slice(0, q).lastIndexOf(`
`),
        z = Y > q * 0.5 ? Y : q;
    return {
        preview: A.slice(0, z),
        hasMore: !0
    }
}
// @from(Ln 232240, Col 0)
function WP1(A) {
    return "error" in A
}
// @from(Ln 232244, Col 0)
function P34() {
    return {
        seenIds: new Set,
        replacements: new Map
    }
}
// @from(Ln 232251, Col 0)
function Wu9() {
    let A = w8("tengu_hawthorn_window", null);
    if (typeof A === "number" && Number.isFinite(A) && A > 0) return A;
    return j34
}
// @from(Ln 232257, Col 0)
function W34(A, q) {
    if (!w8("tengu_hawthorn_steeple", !1)) return;
    if (A) return QN8(A, q ?? []);
    return P34()
}
// @from(Ln 232263, Col 0)
function Zu9(A) {
    return typeof A === "string" && A.startsWith(J34)
}
// @from(Ln 232267, Col 0)
function Z34(A) {
    return Array.isArray(A) && A.some((q) => typeof q === "object" && ("type" in q) && q.type === "image")
}
// @from(Ln 232271, Col 0)
function G34(A) {
    if (typeof A === "string") return A.length;
    return A.reduce((q, K) => q + (K.type === "text" ? K.text.length : 0), 0)
}
// @from(Ln 232276, Col 0)
function Gu9(A) {
    if (A.type !== "user" || !Array.isArray(A.message.content)) return [];
    return A.message.content.flatMap((q) => {
        if (q.type !== "tool_result" || !q.content) return [];
        if (Zu9(q.content)) return [];
        if (Z34(q.content)) return [];
        return [{
            toolUseId: q.tool_use_id,
            content: q.content,
            size: G34(q.content)
        }]
    })
}
// @from(Ln 232290, Col 0)
function f34(A) {
    let q = [],
        K = [],
        Y = () => {
            if (K.length > 0) q.push(K);
            K = []
        },
        z = new Set;
    for (let _ of A)
        if (_.type === "user") K.push(...Gu9(_));
        else if (_.type === "assistant") {
        if (!z.has(_.message.id)) Y(), z.add(_.message.id)
    }
    return Y(), q
}
// @from(Ln 232306, Col 0)
function fu9(A, q) {
    return A.reduce((K, Y) => {
        let z = q.replacements.get(Y.toolUseId);
        if (z !== void 0) K.mustReapply.push({
            ...Y,
            replacement: z
        });
        else if (q.seenIds.has(Y.toolUseId)) K.frozen.push(Y);
        else K.fresh.push(Y);
        return K
    }, {
        mustReapply: [],
        frozen: [],
        fresh: []
    })
}
// @from(Ln 232323, Col 0)
function Tu9(A, q, K) {
    let Y = [...A].sort((w, O) => O.size - w.size),
        z = [],
        _ = q + A.reduce((w, O) => w + O.size, 0);
    for (let w of Y) {
        if (_ <= K) break;
        z.push(w), _ -= w.size
    }
    return z
}
// @from(Ln 232334, Col 0)
function vu9(A, q) {
    return A.map((K) => {
        if (K.type !== "user" || !Array.isArray(K.message.content)) return K;
        let Y = K.message.content;
        if (!Y.some((_) => _.type === "tool_result" && q.has(_.tool_use_id))) return K;
        return {
            ...K,
            message: {
                ...K.message,
                content: Y.map((_) => {
                    if (_.type !== "tool_result") return _;
                    let w = q.get(_.tool_use_id);
                    return w === void 0 ? _ : {
                        ..._,
                        content: w
                    }
                })
            }
        }
    })
}
// @from(Ln 232355, Col 0)
async function Nu9(A) {
    let q = await XP1(A.content, A.toolUseId);
    if (WP1(q)) return null;
    return {
        content: PP1(q),
        originalSize: q.originalSize
    }
}
// @from(Ln 232363, Col 0)
async function Vu9(A, q) {
    let K = f34(A),
        Y = Wu9(),
        z = new Map,
        _ = [],
        w = 0,
        O = 0;
    for (let J of K) {
        let {
            mustReapply: M,
            frozen: D,
            fresh: X
        } = fu9(J, q);
        if (M.forEach((f) => z.set(f.toolUseId, f.replacement)), w += M.length, X.length === 0) {
            J.forEach((f) => q.seenIds.add(f.toolUseId));
            continue
        }
        let P = D.reduce((f, v) => f + v.size, 0),
            W = X.reduce((f, v) => f + v.size, 0),
            Z = P + W > Y ? Tu9(X, P, Y) : [],
            G = new Set(Z.map((f) => f.toolUseId));
        if (J.filter((f) => !G.has(f.toolUseId)).forEach((f) => q.seenIds.add(f.toolUseId)), Z.length === 0) continue;
        O++, _.push(...Z)
    }
    if (z.size === 0 && _.length === 0) return {
        messages: A,
        newlyReplaced: []
    };
    let $ = await Promise.all(_.map(async (J) => [J, await Nu9(J)])),
        H = [],
        j = 0;
    for (let [J, M] of $) {
        if (q.seenIds.add(J.toolUseId), M === null) continue;
        j += J.size, z.set(J.toolUseId, M.content), q.replacements.set(J.toolUseId, M.content), H.push({
            kind: "tool-result",
            toolUseId: J.toolUseId,
            replacement: M.content
        }), d("tengu_tool_result_persisted_message_budget", {
            originalSizeBytes: M.originalSize,
            persistedSizeBytes: M.content.length,
            estimatedOriginalTokens: Math.ceil(M.originalSize / Yp6),
            estimatedPersistedTokens: Math.ceil(M.content.length / Yp6)
        })
    }
    if (z.size === 0) return {
        messages: A,
        newlyReplaced: []
    };
    if (H.length > 0) k(`Per-message budget: persisted ${H.length} tool results across ${O} over-budget message(s), shed ~${xq(j)}, ${w} re-applied`), d("tengu_message_level_tool_result_budget_enforced", {
        resultsPersisted: H.length,
        messagesOverBudget: O,
        replacedSizeBytes: j,
        reapplied: w
    });
    return {
        messages: vu9(A, z),
        newlyReplaced: H
    }
}
// @from(Ln 232422, Col 0)
async function T34(A, q, K, Y) {
    if (!q) return A;
    let z = await Vu9(A, q);
    if (z.newlyReplaced.length > 0 && K.startsWith("repl_main_thread")) Y(z.newlyReplaced);
    return z.messages
}
// @from(Ln 232429, Col 0)
function QN8(A, q) {
    let K = P34(),
        Y = new Set(f34(A).flat().map((z) => z.toolUseId));
    for (let z of Y) K.seenIds.add(z);
    for (let z of q)
        if (z.kind === "tool-result" && Y.has(z.toolUseId)) K.replacements.set(z.toolUseId, z.replacement);
    return K
}
// @from(Ln 232438, Col 0)
function ku9(A) {
    let q = A;
    if (q.code) switch (q.code) {
        case "ENOENT":
            return `Directory not found: ${q.path??"unknown path"}`;
        case "EACCES":
            return `Permission denied: ${q.path??"unknown path"}`;
        case "ENOSPC":
            return "No space left on device";
        case "EROFS":
            return "Read-only file system";
        case "EMFILE":
            return "Too many open files";
        case "EEXIST":
            return `File already exists: ${q.path??"unknown path"}`;
        default:
            return `${q.code}: ${q.message}`
    }
    return A.message
}
// @from(Ln 232458, Col 4)
gN8 = "tool-results"
// @from(Ln 232459, Col 4)
J34 = "<persisted-output>"
// @from(Ln 232460, Col 4)
Mu9 = "</persisted-output>"
// @from(Ln 232461, Col 4)
Du9 = "tengu_satin_quoll"
// @from(Ln 232462, Col 4)
DP1 = 2000
// @from(Ln 232463, Col 4)
ZR = E(() => {
    H1();
    k1();
    Z7();
    V1();
    o$();
    HA();
    T1();
    Oq();
    g1()
})
// @from(Ln 232485, Col 0)
async function N34(A) {
    try {
        let Y = (await $1().stat(A)).size;
        if (Y === 0) return {
            success: !1,
            error: {
                reason: "empty",
                message: `PDF file is empty: ${A}`
            }
        };
        if (Y > c06) return {
            success: !1,
            error: {
                reason: "too_large",
                message: `PDF file exceeds maximum allowed size of ${xq(c06)}.`
            }
        };
        let z = await Ru9(A);
        if (!z.subarray(0, 5).toString("ascii").startsWith("%PDF-")) return {
            success: !1,
            error: {
                reason: "corrupted",
                message: `File is not a valid PDF (missing %PDF- header): ${A}`
            }
        };
        let w = z.toString("base64");
        return {
            success: !0,
            data: {
                type: "pdf",
                file: {
                    filePath: A,
                    base64: w,
                    originalSize: Y
                }
            }
        }
    } catch (q) {
        return {
            success: !1,
            error: {
                reason: "unknown",
                message: _1(q)
            }
        }
    }
}
// @from(Ln 232532, Col 0)
async function GP1(A) {
    let {
        code: q,
        stdout: K
    } = await z8("pdfinfo", [A], {
        timeout: 1e4,
        useCwd: !1
    });
    if (q !== 0) return null;
    let Y = /^Pages:\s+(\d+)/m.exec(K);
    if (!Y) return null;
    let z = parseInt(Y[1], 10);
    return isNaN(z) ? null : z
}
// @from(Ln 232546, Col 0)
async function hu9() {
    if (ZP1 !== void 0) return ZP1;
    let {
        code: A,
        stderr: q
    } = await z8("pdftoppm", ["-v"], {
        timeout: 5000,
        useCwd: !1
    });
    return ZP1 = A === 0 || q.length > 0, ZP1
}
// @from(Ln 232557, Col 0)
async function UN8(A, q) {
    try {
        let z = (await $1().stat(A)).size;
        if (z === 0) return {
            success: !1,
            error: {
                reason: "empty",
                message: `PDF file is empty: ${A}`
            }
        };
        if (z > cT8) return {
            success: !1,
            error: {
                reason: "too_large",
                message: `PDF file exceeds maximum allowed size for text extraction (${xq(cT8)}).`
            }
        };
        if (!await hu9()) return {
            success: !1,
            error: {
                reason: "unavailable",
                message: "pdftoppm is not installed. Install poppler-utils (e.g. `brew install poppler` or `apt-get install poppler-utils`) to enable PDF page rendering."
            }
        };
        let w = Eu9(),
            O = v34(xt(), `pdf-${w}`);
        await yu9(O, {
            recursive: !0
        });
        let $ = v34(O, "page"),
            H = ["-jpeg", "-r", "100"];
        if (q?.firstPage) H.push("-f", String(q.firstPage));
        if (q?.lastPage && q.lastPage !== 1 / 0) H.push("-l", String(q.lastPage));
        H.push(A, $);
        let {
            code: j,
            stderr: J
        } = await z8("pdftoppm", H, {
            timeout: 120000,
            useCwd: !1
        });
        if (j !== 0) {
            if (/password/i.test(J)) return {
                success: !1,
                error: {
                    reason: "password_protected",
                    message: "PDF is password-protected. Please provide an unprotected version."
                }
            };
            if (/damaged|corrupt|invalid/i.test(J)) return {
                success: !1,
                error: {
                    reason: "corrupted",
                    message: "PDF file is corrupted or invalid."
                }
            };
            return {
                success: !1,
                error: {
                    reason: "unknown",
                    message: `pdftoppm failed: ${J}`
                }
            }
        }
        let D = (await Lu9(O)).filter((W) => W.endsWith(".jpg")).sort();
        if (D.length === 0) return {
            success: !1,
            error: {
                reason: "corrupted",
                message: "pdftoppm produced no output pages. The PDF may be invalid."
            }
        };
        let P = D.length;
        return {
            success: !0,
            data: {
                type: "parts",
                file: {
                    filePath: A,
                    originalSize: z,
                    outputDir: O,
                    count: P
                }
            }
        }
    } catch (K) {
        return {
            success: !1,
            error: {
                reason: "unknown",
                message: _1(K)
            }
        }
    }
}
// @from(Ln 232652, Col 4)
ZP1
// @from(Ln 232653, Col 4)
dN8 = E(() => {
    SA();
    Z7();
    ZR();
    Eq();
    s8()
})
// @from(Ln 232661, Col 0)
function V34(A) {
    let q = A6(10),
        {
            children: K,
            lock: Y
        } = A,
        z = Y === void 0 ? "always" : Y,
        [_, w] = Ds(),
        {
            isVisible: O
        } = w,
        {
            rows: $
        } = KA(),
        H = hB.useRef(null),
        j = hB.useRef(0),
        [J, M] = hB.useState(0),
        D;
    if (q[0] !== _) D = (v) => {
        _(v)
    }, q[0] = _, q[1] = D;
    else D = q[1];
    let X = D,
        P = z === "always" || !O,
        W;
    if (q[2] !== $) W = () => {
        if (!H.current) return;
        let {
            height: v
        } = bX6(H.current);
        if (v > j.current) j.current = Math.min(v, $), M(j.current)
    }, q[2] = $, q[3] = W;
    else W = q[3];
    hB.useLayoutEffect(W);
    let Z = P ? J : void 0,
        G;
    if (q[4] !== K) G = hB.default.createElement(m, {
        ref: H,
        flexDirection: "column"
    }, K), q[4] = K, q[5] = G;
    else G = q[5];
    let f;
    if (q[6] !== X || q[7] !== Z || q[8] !== G) f = hB.default.createElement(m, {
        minHeight: Z,
        ref: X
    }, G), q[6] = X, q[7] = Z, q[8] = G, q[9] = f;
    else f = q[9];
    return f
}
// @from(Ln 232710, Col 4)
hB
// @from(Ln 232711, Col 4)
k34 = E(() => {
    e6();
    i6();
    _q();
    gu6();
    hB = t(P6(), 1)
})
// @from(Ln 232719, Col 0)
function t1(A) {
    let q = A6(8),
        {
            children: K,
            height: Y
        } = A;
    if (E34.useContext(y34)) return K;
    let _;
    if (q[0] === Symbol.for("react.memo_cache_sentinel")) _ = Wf.createElement(T, null, "  ", "⎿  "), q[0] = _;
    else _ = q[0];
    let w;
    if (q[1] !== K) w = Wf.createElement(m, {
        flexShrink: 1,
        flexGrow: 1
    }, K), q[1] = K, q[2] = w;
    else w = q[2];
    let O;
    if (q[3] !== Y || q[4] !== w) O = Wf.createElement(Su9, null, Wf.createElement(m, {
        flexDirection: "row",
        height: Y,
        overflowY: "hidden"
    }, _, w)), q[3] = Y, q[4] = w, q[5] = O;
    else O = q[5];
    let $ = O;
    if (Y !== void 0) return $;
    let H;
    if (q[6] !== $) H = Wf.createElement(V34, {
        lock: "offscreen"
    }, $), q[6] = $, q[7] = H;
    else H = q[7];
    return H
}
// @from(Ln 232752, Col 0)
function Su9(A) {
    let q = A6(2),
        {
            children: K
        } = A,
        Y;
    if (q[0] !== K) Y = Wf.createElement(y34.Provider, {
        value: !0
    }, K), q[0] = K, q[1] = Y;
    else Y = q[1];
    return Y
}
// @from(Ln 232764, Col 4)
Wf
// @from(Ln 232764, Col 8)
E34
// @from(Ln 232764, Col 13)
y34
// @from(Ln 232765, Col 4)
iq = E(() => {
    e6();
    i6();
    k34();
    Wf = t(P6(), 1), E34 = t(P6(), 1);
    y34 = Wf.createContext(!1)
})
// @from(Ln 232773, Col 0)
function CB() {
    let A = A6(1),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) q = SB.createElement(SB.Fragment, null, SB.createElement(T, {
        dimColor: !0
    }, "Interrupted "), SB.createElement(T, {
        dimColor: !0
    }, "· What should Claude do instead?")), A[0] = q;
    else q = A[0];
    return q
}
// @from(Ln 232784, Col 4)
SB
// @from(Ln 232785, Col 4)
MW6 = E(() => {
    e6();
    i6();
    SB = t(P6(), 1)
})
// @from(Ln 232791, Col 0)
function T3() {
    let A = A6(1),
        q;
    if (A[0] === Symbol.for("react.memo_cache_sentinel")) q = _p6.createElement(t1, {
        height: 1
    }, _p6.createElement(CB, null)), A[0] = q;
    else q = A[0];
    return q
}
// @from(Ln 232800, Col 4)
_p6
// @from(Ln 232801, Col 4)
gj = E(() => {
    e6();
    iq();
    MW6();
    _p6 = t(P6(), 1)
})
// @from(Ln 232807, Col 4)
Cu9
// @from(Ln 232807, Col 9)
Iu9
// @from(Ln 232807, Col 14)
bu9
// @from(Ln 232807, Col 19)
XW6
// @from(Ln 232808, Col 4)
fP1 = E(() => {
    YK();
    Cu9 = y8() === "windows" ? "alt+v" : "ctrl+v", Iu9 = y8() !== "windows" || (A$6() ? Z$8(process.versions.bun, ">=1.2.23") : Z$8(process.versions.node, ">=22.17.0 <23.0.0 || >=24.2.0")), bu9 = Iu9 ? "shift+tab" : "meta+m", XW6 = [{
        context: "Global",
        bindings: {
            "ctrl+c": "app:interrupt",
            "ctrl+d": "app:exit",
            "ctrl+t": "app:toggleTodos",
            "ctrl+o": "app:toggleTranscript",
            ...{
                "ctrl+shift+b": "app:toggleBrief"
            },
            "ctrl+shift+o": "app:toggleTeammatePreview",
            "ctrl+r": "history:search",
            ...{},
            ...{},
            ...{}
        }
    }, {
        context: "Chat",
        bindings: {
            escape: "chat:cancel",
            "ctrl+f": "chat:killAgents",
            [bu9]: "chat:cycleMode",
            "meta+p": "chat:modelPicker",
            "meta+o": "chat:fastMode",
            "meta+t": "chat:thinkingToggle",
            enter: "chat:submit",
            up: "history:previous",
            down: "history:next",
            "ctrl+_": "chat:undo",
            "ctrl+shift+-": "chat:undo",
            "ctrl+g": "chat:externalEditor",
            "ctrl+s": "chat:stash",
            [Cu9]: "chat:imagePaste",
            ...{
                space: "voice:pushToTalk"
            }
        }
    }, {
        context: "Autocomplete",
        bindings: {
            tab: "autocomplete:accept",
            escape: "autocomplete:dismiss",
            up: "autocomplete:previous",
            down: "autocomplete:next"
        }
    }, {
        context: "Settings",
        bindings: {
            escape: "confirm:no",
            up: "select:previous",
            down: "select:next",
            k: "select:previous",
            j: "select:next",
            "ctrl+p": "select:previous",
            "ctrl+n": "select:next",
            space: "select:accept",
            enter: "settings:close",
            "/": "settings:search",
            r: "settings:retry"
        }
    }, {
        context: "Confirmation",
        bindings: {
            y: "confirm:yes",
            n: "confirm:no",
            enter: "confirm:yes",
            escape: "confirm:no",
            up: "confirm:previous",
            down: "confirm:next",
            tab: "confirm:nextField",
            space: "confirm:toggle",
            "shift+tab": "confirm:cycleMode",
            "ctrl+e": "confirm:toggleExplanation",
            "ctrl+d": "permission:toggleDebug"
        }
    }, {
        context: "Tabs",
        bindings: {
            tab: "tabs:next",
            "shift+tab": "tabs:previous",
            right: "tabs:next",
            left: "tabs:previous"
        }
    }, {
        context: "Transcript",
        bindings: {
            "ctrl+e": "transcript:toggleShowAll",
            "ctrl+c": "transcript:exit",
            escape: "transcript:exit"
        }
    }, {
        context: "HistorySearch",
        bindings: {
            "ctrl+r": "historySearch:next",
            escape: "historySearch:accept",
            tab: "historySearch:accept",
            "ctrl+c": "historySearch:cancel",
            enter: "historySearch:execute"
        }
    }, {
        context: "Task",
        bindings: {
            "ctrl+b": "task:background"
        }
    }, {
        context: "ThemePicker",
        bindings: {
            "ctrl+t": "theme:toggleSyntaxHighlighting"
        }
    }, ...[], {
        context: "Help",
        bindings: {
            escape: "help:dismiss"
        }
    }, {
        context: "Attachments",
        bindings: {
            right: "attachments:next",
            left: "attachments:previous",
            backspace: "attachments:remove",
            delete: "attachments:remove",
            down: "attachments:exit",
            escape: "attachments:exit"
        }
    }, {
        context: "Footer",
        bindings: {
            right: "footer:next",
            left: "footer:previous",
            enter: "footer:openSelected",
            escape: "footer:clearSelection"
        }
    }, {
        context: "MessageSelector",
        bindings: {
            up: "messageSelector:up",
            down: "messageSelector:down",
            k: "messageSelector:up",
            j: "messageSelector:down",
            "ctrl+p": "messageSelector:up",
            "ctrl+n": "messageSelector:down",
            "ctrl+up": "messageSelector:top",
            "shift+up": "messageSelector:top",
            "meta+up": "messageSelector:top",
            "shift+k": "messageSelector:top",
            "ctrl+down": "messageSelector:bottom",
            "shift+down": "messageSelector:bottom",
            "meta+down": "messageSelector:bottom",
            "shift+j": "messageSelector:bottom",
            enter: "messageSelector:select"
        }
    }, {
        context: "DiffDialog",
        bindings: {
            escape: "diff:dismiss",
            left: "diff:previousSource",
            right: "diff:nextSource",
            up: "diff:previousFile",
            down: "diff:nextFile",
            enter: "diff:viewDetails"
        }
    }, {
        context: "ModelPicker",
        bindings: {
            left: "modelPicker:decreaseEffort",
            right: "modelPicker:increaseEffort"
        }
    }, {
        context: "Select",
        bindings: {
            up: "select:previous",
            down: "select:next",
            j: "select:next",
            k: "select:previous",
            "ctrl+n": "select:next",
            "ctrl+p": "select:previous",
            enter: "select:accept",
            escape: "select:cancel"
        }
    }, {
        context: "Plugin",
        bindings: {
            space: "plugin:toggle",
            i: "plugin:install"
        }
    }]
})
// @from(Ln 232998, Col 0)
function L34() {
    let A = y8(),
        q = [...wp6, ...cN8];
    if (A === "macos") q.push(...lN8);
    return q
}
// @from(Ln 233005, Col 0)
function C36(A) {
    let q = A.split("+"),
        K = [],
        Y = "";
    for (let z of q) {
        let w = z.trim().toLowerCase();
        if (["ctrl", "control", "alt", "opt", "option", "meta", "cmd", "command", "shift"].includes(w))
            if (w === "control") K.push("ctrl");
            else if (w === "option" || w === "opt") K.push("alt");
        else if (w === "command" || w === "cmd") K.push("cmd");
        else K.push(w);
        else Y = w
    }
    return K.sort(), [...K, Y].join("+")
}
// @from(Ln 233020, Col 4)
wp6
// @from(Ln 233020, Col 9)
cN8
// @from(Ln 233020, Col 14)
lN8
// @from(Ln 233021, Col 4)
TP1 = E(() => {
    YK();
    wp6 = [{
        key: "ctrl+c",
        reason: "Cannot be rebound - used for interrupt/exit (hardcoded)",
        severity: "error"
    }, {
        key: "ctrl+d",
        reason: "Cannot be rebound - used for exit (hardcoded)",
        severity: "error"
    }, {
        key: "ctrl+m",
        reason: "Cannot be rebound - identical to Enter in terminals (both send CR)",
        severity: "error"
    }], cN8 = [{
        key: "ctrl+z",
        reason: "Unix process suspend (SIGTSTP)",
        severity: "warning"
    }, {
        key: "ctrl+\\",
        reason: "Terminal quit signal (SIGQUIT)",
        severity: "error"
    }], lN8 = [{
        key: "cmd+c",
        reason: "macOS system copy",
        severity: "error"
    }, {
        key: "cmd+v",
        reason: "macOS system paste",
        severity: "error"
    }, {
        key: "cmd+x",
        reason: "macOS system cut",
        severity: "error"
    }, {
        key: "cmd+q",
        reason: "macOS quit application",
        severity: "error"
    }, {
        key: "cmd+w",
        reason: "macOS close window/tab",
        severity: "error"
    }, {
        key: "cmd+tab",
        reason: "macOS app switcher",
        severity: "error"
    }, {
        key: "cmd+space",
        reason: "macOS Spotlight",
        severity: "error"
    }]
})
// @from(Ln 233074, Col 0)
function xu9(A) {
    if (typeof A !== "object" || A === null) return !1;
    let q = A;
    return typeof q.context === "string" && typeof q.bindings === "object" && q.bindings !== null
}
// @from(Ln 233080, Col 0)
function uu9(A) {
    return Array.isArray(A) && A.every(xu9)
}
// @from(Ln 233084, Col 0)
function mu9(A) {
    return R34.includes(A)
}
// @from(Ln 233088, Col 0)
function Bu9(A) {
    let q = A.toLowerCase().split("+");
    for (let Y of q)
        if (!Y.trim()) return {
            type: "parse_error",
            severity: "error",
            message: `Empty key part in "${A}"`,
            key: A,
            suggestion: 'Remove extra "+" characters'
        };
    let K = Qu6(A);
    if (!K.key && !K.ctrl && !K.alt && !K.shift && !K.meta) return {
        type: "parse_error",
        severity: "error",
        message: `Could not parse keystroke "${A}"`,
        key: A
    };
    return null
}
// @from(Ln 233108, Col 0)
function gu9(A, q) {
    let K = [];
    if (typeof A !== "object" || A === null) return K.push({
        type: "parse_error",
        severity: "error",
        message: `Keybinding block ${q+1} is not an object`
    }), K;
    let Y = A,
        z = Y.context,
        _;
    if (typeof z !== "string") K.push({
        type: "parse_error",
        severity: "error",
        message: `Keybinding block ${q+1} missing "context" field`
    });
    else if (!mu9(z)) K.push({
        type: "invalid_context",
        severity: "error",
        message: `Unknown context "${z}"`,
        context: z,
        suggestion: `Valid contexts: ${R34.join(", ")}`
    });
    else _ = z;
    if (typeof Y.bindings !== "object" || Y.bindings === null) return K.push({
        type: "parse_error",
        severity: "error",
        message: `Keybinding block ${q+1} missing "bindings" field`
    }), K;
    let w = Y.bindings;
    for (let [O, $] of Object.entries(w)) {
        let H = Bu9(O);
        if (H) H.context = _, K.push(H);
        if ($ !== null && typeof $ !== "string") K.push({
            type: "invalid_action",
            severity: "error",
            message: `Invalid action for "${O}": must be a string or null`,
            key: O,
            context: _
        });
        else if (typeof $ === "string" && $.startsWith("command:")) {
            if (!/^command:[a-zA-Z0-9:\-_]+$/.test($)) K.push({
                type: "invalid_action",
                severity: "warning",
                message: `Invalid command binding "${$}" for "${O}": command name may only contain alphanumeric characters, colons, hyphens, and underscores`,
                key: O,
                context: _,
                action: $
            });
            if (_ && _ !== "Chat") K.push({
                type: "invalid_action",
                severity: "warning",
                message: `Command binding "${$}" must be in "Chat" context, not "${_}"`,
                key: O,
                context: _,
                action: $,
                suggestion: 'Move this binding to a block with "context": "Chat"'
            })
        } else if ($ === "voice:pushToTalk") {
            let j = pj8(O)[0];
            if (j && !j.ctrl && !j.alt && !j.shift && !j.meta && /^[a-z]$/.test(j.key)) K.push({
                type: "invalid_action",
                severity: "warning",
                message: `Binding "${O}" to voice:pushToTalk prints into the input during warmup; use space or a modifier combo like meta+k`,
                key: O,
                context: _,
                action: $
            })
        }
    }
    return K
}
// @from(Ln 233180, Col 0)
function iN8(A) {
    let q = [],
        K = /"bindings"\s*:\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g,
        Y;
    while ((Y = K.exec(A)) !== null) {
        let z = Y[1];
        if (!z) continue;
        let O = A.slice(0, Y.index).match(/"context"\s*:\s*"([^"]+)"[^{]*$/)?.[1] ?? "unknown",
            $ = /"([^"]+)"\s*:/g,
            H = new Map,
            j;
        while ((j = $.exec(z)) !== null) {
            let J = j[1];
            if (!J) continue;
            let M = (H.get(J) ?? 0) + 1;
            if (H.set(J, M), M === 2) q.push({
                type: "duplicate",
                severity: "warning",
                message: `Duplicate key "${J}" in ${O} bindings`,
                key: J,
                context: O,
                suggestion: "This key appears multiple times in the same context. JSON uses the last value, earlier values are ignored."
            })
        }
    }
    return q
}
// @from(Ln 233208, Col 0)
function Fu9(A) {
    let q = [];
    if (!Array.isArray(A)) return q.push({
        type: "parse_error",
        severity: "error",
        message: "keybindings.json must contain an array",
        suggestion: "Wrap your bindings in [ ]"
    }), q;
    for (let K = 0; K < A.length; K++) q.push(...gu9(A[K], K));
    return q
}
// @from(Ln 233220, Col 0)
function pu9(A) {
    let q = [],
        K = new Map;
    for (let Y of A) {
        let z = K.get(Y.context) ?? new Map;
        K.set(Y.context, z);
        for (let [_, w] of Object.entries(Y.bindings)) {
            let O = C36(_),
                $ = z.get(O);
            if ($ && $ !== w) q.push({
                type: "duplicate",
                severity: "warning",
                message: `Duplicate binding "${_}" in ${Y.context} context`,
                key: _,
                context: Y.context,
                action: w ?? "null (unbind)",
                suggestion: `Previously bound to "${$}". Only the last binding will be used.`
            });
            z.set(O, w ?? "null")
        }
    }
    return q
}
// @from(Ln 233244, Col 0)
function Qu9(A) {
    let q = [],
        K = L34();
    for (let Y of A) {
        let z = D$1(Y.chord),
            _ = C36(z);
        for (let w of K)
            if (C36(w.key) === _) q.push({
                type: "reserved",
                severity: w.severity,
                message: `"${z}" may not work: ${w.reason}`,
                key: z,
                context: Y.context,
                action: Y.action ?? void 0
            })
    }
    return q
}
// @from(Ln 233263, Col 0)
function Uu9(A) {
    let q = [];
    for (let K of A)
        for (let [Y, z] of Object.entries(K.bindings)) {
            let _ = Y.split(" ").map((w) => Qu6(w));
            q.push({
                chord: _,
                action: z,
                context: K.context
            })
        }
    return q
}
// @from(Ln 233277, Col 0)
function nN8(A, q) {
    let K = [];
    if (K.push(...Fu9(A)), uu9(A)) {
        K.push(...pu9(A));
        let z = Uu9(A);
        K.push(...Qu9(z))
    }
    let Y = new Set;
    return K.filter((z) => {
        let _ = `${z.type}:${z.key}:${z.context}`;
        if (Y.has(_)) return !1;
        return Y.add(_), !0
    })
}
// @from(Ln 233291, Col 4)
R34
// @from(Ln 233292, Col 4)
h34 = E(() => {
    TP1();
    R34 = ["Global", "Chat", "Autocomplete", "Confirmation", "Help", "Transcript", "HistorySearch", "Task", "ThemePicker", "Settings", "Tabs", "Attachments", "Footer", "MessageSelector", "DiffDialog", "ModelPicker", "Select", "Plugin"]
})
// @from(Ln 233308, Col 0)
function pk() {
    return w8("tengu_keybinding_customization_release", !1)
}
// @from(Ln 233312, Col 0)
function x34(A) {
    let q = new Date().toISOString().slice(0, 10);
    if (C34 === q) return;
    C34 = q, d("tengu_custom_keybindings_loaded", {
        user_binding_count: A
    })
}
// @from(Ln 233320, Col 0)
function au9(A) {
    return typeof A === "object" && A !== null && "code" in A && typeof A.code === "string"
}
// @from(Ln 233324, Col 0)
function su9(A) {
    if (typeof A !== "object" || A === null) return !1;
    let q = A;
    return typeof q.context === "string" && typeof q.bindings === "object" && q.bindings !== null
}
// @from(Ln 233330, Col 0)
function u34(A) {
    return Array.isArray(A) && A.every(su9)
}
// @from(Ln 233334, Col 0)
function b36() {
    return iu9(c8(), "keybindings.json")
}
// @from(Ln 233338, Col 0)
function rN8() {
    return X$1(XW6)
}
// @from(Ln 233341, Col 0)
async function tu9() {
    let A = rN8();
    if (!pk()) return {
        bindings: A,
        warnings: []
    };
    let q = b36();
    try {
        let K = await du9(q, "utf-8"),
            Y = i1(K),
            z;
        if (typeof Y === "object" && Y !== null && "bindings" in Y) z = Y.bindings;
        else return k('[keybindings] Invalid keybindings.json: keybindings.json must have a "bindings" array'), {
            bindings: A,
            warnings: [{
                type: "parse_error",
                severity: "error",
                message: 'keybindings.json must have a "bindings" array',
                suggestion: 'Use format: { "bindings": [ ... ] }'
            }]
        };
        if (!u34(z)) {
            let H = !Array.isArray(z) ? '"bindings" must be an array' : "keybindings.json contains invalid block structure",
                j = !Array.isArray(z) ? 'Set "bindings" to an array of keybinding blocks' : 'Each block must have "context" (string) and "bindings" (object)';
            return k(`[keybindings] Invalid keybindings.json: ${H}`), {
                bindings: A,
                warnings: [{
                    type: "parse_error",
                    severity: "error",
                    message: H,
                    suggestion: j
                }]
            }
        }
        let _ = X$1(z);
        k(`[keybindings] Loaded ${_.length} user bindings from ${q}`);
        let w = [...A, ..._];
        x34(_.length);
        let $ = [...iN8(K), ...nN8(z, w)];
        if ($.length > 0) k(`[keybindings] Found ${$.length} validation issue(s)`);
        return {
            bindings: w,
            warnings: $
        }
    } catch (K) {
        if (au9(K) && K.code === "ENOENT") return {
            bindings: A,
            warnings: []
        };
        return k(`[keybindings] Error loading ${q}: ${_1(K)}`), {
            bindings: A,
            warnings: [{
                type: "parse_error",
                severity: "error",
                message: `Failed to parse keybindings.json: ${_1(K)}`
            }]
        }
    }
}
// @from(Ln 233401, Col 0)
function m34() {
    if (Y0) return Y0;
    return $p6().bindings
}
// @from(Ln 233406, Col 0)
function $p6() {
    if (Y0) return {
        bindings: Y0,
        warnings: _Z
    };
    let A = rN8();
    if (!pk()) return Y0 = A, _Z = [], {
        bindings: Y0,
        warnings: _Z
    };
    let q = b36();
    try {
        let K = lu9(q, "utf-8"),
            Y = i1(K),
            z;
        if (typeof Y === "object" && Y !== null && "bindings" in Y) z = Y.bindings;
        else return Y0 = A, _Z = [{
            type: "parse_error",
            severity: "error",
            message: 'keybindings.json must have a "bindings" array',
            suggestion: 'Use format: { "bindings": [ ... ] }'
        }], {
            bindings: Y0,
            warnings: _Z
        };
        if (!u34(z)) {
            let O = !Array.isArray(z) ? '"bindings" must be an array' : "keybindings.json contains invalid block structure",
                $ = !Array.isArray(z) ? 'Set "bindings" to an array of keybinding blocks' : 'Each block must have "context" (string) and "bindings" (object)';
            return Y0 = A, _Z = [{
                type: "parse_error",
                severity: "error",
                message: O,
                suggestion: $
            }], {
                bindings: Y0,
                warnings: _Z
            }
        }
        let _ = X$1(z);
        if (k(`[keybindings] Loaded ${_.length} user bindings from ${q}`), Y0 = [...A, ..._], x34(_.length), _Z = [...iN8(K), ...nN8(z, Y0)], _Z.length > 0) k(`[keybindings] Found ${_Z.length} validation issue(s)`);
        return {
            bindings: Y0,
            warnings: _Z
        }
    } catch {
        return Y0 = A, _Z = [], {
            bindings: Y0,
            warnings: _Z
        }
    }
}
// @from(Ln 233457, Col 0)
async function B34() {
    if (S34 || b34) return;
    if (!pk()) {
        k("[keybindings] Skipping file watcher - user customization disabled");
        return
    }
    let A = b36(),
        q = nu9(A);
    try {
        if (!(await cu9(q)).isDirectory()) {
            k(`[keybindings] Not watching: ${q} is not a directory`);
            return
        }
    } catch {
        k(`[keybindings] Not watching: ${q} does not exist`);
        return
    }
    S34 = !0, k(`[keybindings] Watching for changes to ${A}`), I36 = g46.watch(A, {
        persistent: !0,
        ignoreInitial: !0,
        awaitWriteFinish: {
            stabilityThreshold: ru9,
            pollInterval: ou9
        },
        ignorePermissionErrors: !0,
        usePolling: !1,
        atomic: !0
    }), I36.on("add", I34), I36.on("change", I34), I36.on("unlink", Am9), E4(async () => eu9())
}