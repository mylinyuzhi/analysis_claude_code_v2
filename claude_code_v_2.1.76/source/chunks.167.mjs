
// @from(Ln 429516, Col 0)
function ZWq(A) {
    let q = A6(9),
        {
            dateRange: K,
            isLoading: Y
        } = A,
        z;
    if (q[0] !== K) z = vh1.map(($, H) => DA.default.createElement(T, {
        key: $
    }, H > 0 && DA.default.createElement(T, {
        dimColor: !0
    }, " · "), $ === K ? DA.default.createElement(T, {
        bold: !0,
        color: "claude"
    }, DWq[$]) : DA.default.createElement(T, {
        dimColor: !0
    }, DWq[$]))), q[0] = K, q[1] = z;
    else z = q[1];
    let _;
    if (q[2] !== z) _ = DA.default.createElement(m, null, z), q[2] = z, q[3] = _;
    else _ = q[3];
    let w;
    if (q[4] !== Y) w = Y && DA.default.createElement(Wq, null), q[4] = Y, q[5] = w;
    else w = q[5];
    let O;
    if (q[6] !== _ || q[7] !== w) O = DA.default.createElement(m, {
        marginBottom: 1,
        gap: 1
    }, _, w), q[6] = _, q[7] = w, q[8] = O;
    else O = q[8];
    return O
}
// @from(Ln 429549, Col 0)
function Hqz({
    stats: A,
    allTimeStats: q,
    dateRange: K,
    isLoading: Y
}) {
    let {
        columns: z
    } = KA(), _ = Object.entries(A.modelUsage).sort(([, J], [, M]) => M.inputTokens + M.outputTokens - (J.inputTokens + J.outputTokens)), w = _[0], O = _.reduce((J, [, M]) => J + M.inputTokens + M.outputTokens, 0), $ = of.useMemo(() => GWq(A, O), [A, O]), H = K === "7d" ? 7 : K === "30d" ? 30 : A.totalDays, j = null;
    return DA.default.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, q.dailyActivity.length > 0 && DA.default.createElement(m, {
        flexDirection: "column",
        marginBottom: 1
    }, DA.default.createElement(wK, null, Oi8(q.dailyActivity, {
        terminalWidth: z
    }))), DA.default.createElement(ZWq, {
        dateRange: K,
        isLoading: Y
    }), DA.default.createElement(m, {
        flexDirection: "row",
        gap: 4,
        marginBottom: 1
    }, DA.default.createElement(m, {
        flexDirection: "column",
        width: 28
    }, w && DA.default.createElement(T, {
        wrap: "truncate"
    }, "Favorite model:", " ", DA.default.createElement(T, {
        color: "claude",
        bold: !0
    }, qJ(w[0])))), DA.default.createElement(m, {
        flexDirection: "column",
        width: 28
    }, DA.default.createElement(T, {
        wrap: "truncate"
    }, "Total tokens:", " ", DA.default.createElement(T, {
        color: "claude"
    }, fq(O))))), DA.default.createElement(m, {
        flexDirection: "row",
        gap: 4
    }, DA.default.createElement(m, {
        flexDirection: "column",
        width: 28
    }, DA.default.createElement(T, {
        wrap: "truncate"
    }, "Sessions:", " ", DA.default.createElement(T, {
        color: "claude"
    }, fq(A.totalSessions)))), DA.default.createElement(m, {
        flexDirection: "column",
        width: 28
    }, A.longestSession && DA.default.createElement(T, {
        wrap: "truncate"
    }, "Longest session:", " ", DA.default.createElement(T, {
        color: "claude"
    }, UK(A.longestSession.duration))))), DA.default.createElement(m, {
        flexDirection: "row",
        gap: 4
    }, DA.default.createElement(m, {
        flexDirection: "column",
        width: 28
    }, DA.default.createElement(T, {
        wrap: "truncate"
    }, "Active days: ", DA.default.createElement(T, {
        color: "claude"
    }, A.activeDays), DA.default.createElement(T, {
        color: "subtle"
    }, "/", H))), DA.default.createElement(m, {
        flexDirection: "column",
        width: 28
    }, DA.default.createElement(T, {
        wrap: "truncate"
    }, "Longest streak:", " ", DA.default.createElement(T, {
        color: "claude",
        bold: !0
    }, A.streaks.longestStreak), " ", A.streaks.longestStreak === 1 ? "day" : "days"))), DA.default.createElement(m, {
        flexDirection: "row",
        gap: 4
    }, DA.default.createElement(m, {
        flexDirection: "column",
        width: 28
    }, A.peakActivityDay && DA.default.createElement(T, {
        wrap: "truncate"
    }, "Most active day:", " ", DA.default.createElement(T, {
        color: "claude"
    }, zqz(A.peakActivityDay)))), DA.default.createElement(m, {
        flexDirection: "column",
        width: 28
    }, DA.default.createElement(T, {
        wrap: "truncate"
    }, "Current streak:", " ", DA.default.createElement(T, {
        color: "claude",
        bold: !0
    }, q.streaks.currentStreak), " ", q.streaks.currentStreak === 1 ? "day" : "days"))), !1, !1, j && DA.default.createElement(DA.default.Fragment, null, DA.default.createElement(m, {
        marginTop: 1
    }, DA.default.createElement(T, null, "Shot distribution")), DA.default.createElement(m, {
        flexDirection: "row",
        gap: 4
    }, DA.default.createElement(m, {
        flexDirection: "column",
        width: 28
    }, DA.default.createElement(T, {
        wrap: "truncate"
    }, j.buckets[0].label, ":", " ", DA.default.createElement(T, {
        color: "claude"
    }, j.buckets[0].count), DA.default.createElement(T, {
        color: "subtle"
    }, " (", j.buckets[0].pct, "%)"))), DA.default.createElement(m, {
        flexDirection: "column",
        width: 28
    }, DA.default.createElement(T, {
        wrap: "truncate"
    }, j.buckets[1].label, ":", " ", DA.default.createElement(T, {
        color: "claude"
    }, j.buckets[1].count), DA.default.createElement(T, {
        color: "subtle"
    }, " (", j.buckets[1].pct, "%)")))), DA.default.createElement(m, {
        flexDirection: "row",
        gap: 4
    }, DA.default.createElement(m, {
        flexDirection: "column",
        width: 28
    }, DA.default.createElement(T, {
        wrap: "truncate"
    }, j.buckets[2].label, ":", " ", DA.default.createElement(T, {
        color: "claude"
    }, j.buckets[2].count), DA.default.createElement(T, {
        color: "subtle"
    }, " (", j.buckets[2].pct, "%)"))), DA.default.createElement(m, {
        flexDirection: "column",
        width: 28
    }, DA.default.createElement(T, {
        wrap: "truncate"
    }, j.buckets[3].label, ":", " ", DA.default.createElement(T, {
        color: "claude"
    }, j.buckets[3].count), DA.default.createElement(T, {
        color: "subtle"
    }, " (", j.buckets[3].pct, "%)")))), DA.default.createElement(m, {
        flexDirection: "row",
        gap: 4
    }, DA.default.createElement(m, {
        flexDirection: "column",
        width: 28
    }, DA.default.createElement(T, {
        wrap: "truncate"
    }, "Avg/session:", " ", DA.default.createElement(T, {
        color: "claude"
    }, j.avgShots))))), $ && DA.default.createElement(m, {
        marginTop: 1
    }, DA.default.createElement(T, {
        color: "suggestion"
    }, $)))
}
// @from(Ln 429704, Col 0)
function GWq(A, q) {
    let K = [];
    if (q > 0) {
        let z = jqz.filter((_) => q >= _.tokens);
        for (let _ of z) {
            let w = q / _.tokens;
            if (w >= 2) K.push(`You've used ~${Math.floor(w)}x more tokens than ${_.name}`);
            else K.push(`You've used the same number of tokens as ${_.name}`)
        }
    }
    if (A.longestSession) {
        let z = A.longestSession.duration / 60000;
        for (let _ of Jqz) {
            let w = z / _.minutes;
            if (w >= 2) K.push(`Your longest session is ~${Math.floor(w)}x longer than ${_.name}`)
        }
    }
    if (K.length === 0) return "";
    let Y = Math.floor(Math.random() * K.length);
    return K[Y]
}
// @from(Ln 429726, Col 0)
function Mqz(A) {
    let q = A6(13),
        {
            stats: K,
            dateRange: Y,
            isLoading: z
        } = A,
        [_, w] = of.useState(0),
        {
            columns: O
        } = KA(),
        $ = Object.entries(K.modelUsage).sort(Zqz);
    if (jA((R, u) => {
            if (u.downArrow && _ < $.length - 4) w((I) => Math.min(I + 2, $.length - 4));
            if (u.upArrow && _ > 0) w(Wqz)
        }), $.length === 0) {
        let R;
        if (q[0] === Symbol.for("react.memo_cache_sentinel")) R = DA.default.createElement(m, null, DA.default.createElement(T, {
            color: "subtle"
        }, "No model usage data available")), q[0] = R;
        else R = q[0];
        return R
    }
    let H = $.reduce(Pqz, 0),
        j = fWq(K.dailyModelTokens, $.map(Xqz), O),
        J = $.slice(_, _ + 4),
        M = Math.ceil(J.length / 2),
        D = J.slice(0, M),
        X = J.slice(M),
        P = _ > 0,
        W = _ < $.length - 4,
        Z = $.length > 4,
        G;
    if (q[1] !== Y || q[2] !== z) G = DA.default.createElement(ZWq, {
        dateRange: Y,
        isLoading: z
    }), q[1] = Y, q[2] = z, q[3] = G;
    else G = q[3];
    let f = m,
        v = "column",
        N = 36,
        V = X.map((R) => {
            let [u, I] = R;
            return DA.default.createElement(XWq, {
                key: u,
                model: u,
                usage: I,
                totalTokens: H
            })
        }),
        L;
    if (q[4] !== f || q[5] !== V) L = DA.default.createElement(f, {
        flexDirection: v,
        width: N
    }, V), q[4] = f, q[5] = V, q[6] = L;
    else L = q[6];
    let h;
    if (q[7] !== W || q[8] !== P || q[9] !== $ || q[10] !== _ || q[11] !== Z) h = Z && DA.default.createElement(m, {
        marginTop: 1
    }, DA.default.createElement(T, {
        color: "subtle"
    }, P ? a6.arrowUp : " ", " ", W ? a6.arrowDown : " ", " ", _ + 1, "-", Math.min(_ + 4, $.length), " of", " ", $.length, " models (↑↓ to scroll)")), q[7] = W, q[8] = P, q[9] = $, q[10] = _, q[11] = Z, q[12] = h;
    else h = q[12];
    return DA.default.createElement(m, {
        flexDirection: "column",
        marginTop: 1
    }, j && DA.default.createElement(m, {
        flexDirection: "column",
        marginBottom: 1
    }, DA.default.createElement(T, {
        bold: !0
    }, "Tokens per Day"), DA.default.createElement(wK, null, j.chart), DA.default.createElement(T, {
        color: "subtle"
    }, j.xAxisLabels), DA.default.createElement(m, null, j.legend.map(Dqz))), G, DA.default.createElement(m, {
        flexDirection: "row",
        gap: 4
    }, DA.default.createElement(m, {
        flexDirection: "column",
        width: 36
    }, D.map((R) => {
        let [u, I] = R;
        return DA.default.createElement(XWq, {
            key: u,
            model: u,
            usage: I,
            totalTokens: H
        })
    })), L), h)
}
// @from(Ln 429816, Col 0)
function Dqz(A, q) {
    return DA.default.createElement(T, {
        key: A.model
    }, q > 0 ? " · " : "", DA.default.createElement(wK, null, A.coloredBullet), " ", A.model)
}
// @from(Ln 429822, Col 0)
function Xqz(A) {
    let [q] = A;
    return q
}
// @from(Ln 429827, Col 0)
function Pqz(A, q) {
    let [, K] = q;
    return A + K.inputTokens + K.outputTokens
}
// @from(Ln 429832, Col 0)
function Wqz(A) {
    return Math.max(A - 2, 0)
}
// @from(Ln 429836, Col 0)
function Zqz(A, q) {
    let [, K] = A, [, Y] = q;
    return Y.inputTokens + Y.outputTokens - (K.inputTokens + K.outputTokens)
}
// @from(Ln 429841, Col 0)
function XWq(A) {
    let q = A6(21),
        {
            model: K,
            usage: Y,
            totalTokens: z
        } = A,
        w = (Y.inputTokens + Y.outputTokens) / z * 100,
        O;
    if (q[0] !== w) O = w.toFixed(1), q[0] = w, q[1] = O;
    else O = q[1];
    let $ = O,
        H;
    if (q[2] !== K) H = qJ(K), q[2] = K, q[3] = H;
    else H = q[3];
    let j;
    if (q[4] !== H) j = DA.default.createElement(T, {
        bold: !0
    }, H), q[4] = H, q[5] = j;
    else j = q[5];
    let J;
    if (q[6] !== $) J = DA.default.createElement(T, {
        color: "subtle"
    }, "(", $, "%)"), q[6] = $, q[7] = J;
    else J = q[7];
    let M;
    if (q[8] !== j || q[9] !== J) M = DA.default.createElement(T, null, a6.bullet, " ", j, " ", J), q[8] = j, q[9] = J, q[10] = M;
    else M = q[10];
    let D;
    if (q[11] !== Y.inputTokens) D = fq(Y.inputTokens), q[11] = Y.inputTokens, q[12] = D;
    else D = q[12];
    let X;
    if (q[13] !== Y.outputTokens) X = fq(Y.outputTokens), q[13] = Y.outputTokens, q[14] = X;
    else X = q[14];
    let P;
    if (q[15] !== D || q[16] !== X) P = DA.default.createElement(T, {
        color: "subtle"
    }, "  ", "In: ", D, " · Out:", " ", X), q[15] = D, q[16] = X, q[17] = P;
    else P = q[17];
    let W;
    if (q[18] !== M || q[19] !== P) W = DA.default.createElement(m, {
        flexDirection: "column"
    }, M, P), q[18] = M, q[19] = P, q[20] = W;
    else W = q[20];
    return W
}
// @from(Ln 429888, Col 0)
function fWq(A, q, K) {
    if (A.length < 2 || q.length === 0) return null;
    let Y = 7,
        z = K - Y,
        _ = Math.min(52, Math.max(20, z)),
        w;
    if (A.length >= _) w = A.slice(-_);
    else {
        let X = Math.floor(_ / A.length);
        w = [];
        for (let P of A)
            for (let W = 0; W < X; W++) w.push(P)
    }
    let O = QW(km(X1().theme)),
        $ = [z$1(O.suggestion), z$1(O.success), z$1(O.warning)],
        H = [],
        j = [],
        J = q.slice(0, 3);
    for (let X = 0; X < J.length; X++) {
        let P = J[X],
            W = w.map((Z) => Z.tokensByModel[P] || 0);
        if (W.some((Z) => Z > 0)) {
            H.push(W);
            let Z = [O.suggestion, O.success, O.warning];
            j.push({
                model: qJ(P),
                coloredBullet: CU(a6.bullet, Z[X % Z.length])
            })
        }
    }
    if (H.length === 0) return null;
    let M = PWq.plot(H, {
            height: 8,
            colors: $.slice(0, H.length),
            format: (X) => {
                let P;
                if (X >= 1e6) P = (X / 1e6).toFixed(1) + "M";
                else if (X >= 1000) P = (X / 1000).toFixed(0) + "k";
                else P = X.toFixed(0);
                return P.padStart(6)
            }
        }),
        D = Gqz(w, w.length, Y);
    return {
        chart: M,
        legend: j,
        xAxisLabels: D
    }
}
// @from(Ln 429938, Col 0)
function Gqz(A, q, K) {
    if (A.length === 0) return "";
    let Y = Math.min(4, Math.max(2, Math.floor(A.length / 8))),
        z = A.length - 6,
        _ = Math.floor(z / (Y - 1)) || 1,
        w = [];
    for (let H = 0; H < Y; H++) {
        let j = Math.min(H * _, A.length - 1),
            M = new Date(A[j].date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric"
            });
        w.push({
            pos: j,
            label: M
        })
    }
    let O = " ".repeat(K),
        $ = 0;
    for (let {
            pos: H,
            label: j
        }
        of w) {
        let J = Math.max(1, H - $);
        O += " ".repeat(J) + j, $ = H + j.length
    }
    return O
}
// @from(Ln 429967, Col 0)
async function fqz(A, q, K) {
    K("copying…");
    let Y = Tqz(A, q),
        z = await JWq(Y);
    K(z.success ? "copied!" : "copy failed"), setTimeout(K, 2000, null)
}
// @from(Ln 429974, Col 0)
function Tqz(A, q) {
    let K = [];
    if (q === "Overview") K.push(...vqz(A));
    else K.push(...Nqz(A));
    while (K.length > 0 && sY(K[K.length - 1]).trim() === "") K.pop();
    if (K.length > 0) {
        let Y = K[K.length - 1],
            z = f8(Y),
            _ = q === "Overview" ? 70 : 80,
            w = "/stats",
            O = Math.max(2, _ - z - 6);
        K[K.length - 1] = Y + " ".repeat(O) + O1.gray("/stats")
    }
    return K.join(`
`)
}
// @from(Ln 429991, Col 0)
function vqz(A) {
    let q = [],
        K = QW(km(X1().theme)),
        Y = (W) => CU(W, K.claude),
        z = 18,
        _ = 40,
        w = 18,
        O = (W, Z, G, f) => {
            let v = (W + ":").padEnd(18),
                N = v.length + Z.length,
                V = Math.max(2, 40 - N),
                L = (G + ":").padEnd(18);
            return v + Y(Z) + " ".repeat(V) + L + Y(f)
        };
    if (A.dailyActivity.length > 0) q.push(Oi8(A.dailyActivity, {
        terminalWidth: 56
    })), q.push("");
    let $ = Object.entries(A.modelUsage).sort(([, W], [, Z]) => Z.inputTokens + Z.outputTokens - (W.inputTokens + W.outputTokens)),
        H = $[0],
        j = $.reduce((W, [, Z]) => W + Z.inputTokens + Z.outputTokens, 0);
    if (H) q.push(O("Favorite model", qJ(H[0]), "Total tokens", fq(j)));
    q.push(""), q.push(O("Sessions", fq(A.totalSessions), "Longest session", A.longestSession ? UK(A.longestSession.duration) : "N/A"));
    let J = `${A.streaks.currentStreak} ${A.streaks.currentStreak===1?"day":"days"}`,
        M = `${A.streaks.longestStreak} ${A.streaks.longestStreak===1?"day":"days"}`;
    q.push(O("Current streak", J, "Longest streak", M));
    let D = `${A.activeDays}/${A.totalDays}`,
        X = A.peakActivityHour !== null ? `${A.peakActivityHour}:00-${A.peakActivityHour+1}:00` : "N/A";
    q.push(O("Active days", D, "Peak hour", X)), q.push("");
    let P = GWq(A, j);
    return q.push(Y(P)), q.push(O1.gray(`Stats from the last ${A.totalDays} days`)), q
}
// @from(Ln 430023, Col 0)
function Nqz(A) {
    let q = [],
        K = Object.entries(A.modelUsage).sort(([, O], [, $]) => $.inputTokens + $.outputTokens - (O.inputTokens + O.outputTokens));
    if (K.length === 0) return q.push(O1.gray("No model usage data available")), q;
    let Y = K[0],
        z = K.reduce((O, [, $]) => O + $.inputTokens + $.outputTokens, 0),
        _ = fWq(A.dailyModelTokens, K.map(([O]) => O), 80);
    if (_) {
        q.push(O1.bold("Tokens per Day")), q.push(_.chart), q.push(O1.gray(_.xAxisLabels));
        let O = _.legend.map(($) => `${$.coloredBullet} ${$.model}`).join(" · ");
        q.push(O), q.push("")
    }
    q.push(`${a6.star} Favorite: ${O1.magenta.bold(qJ(Y?.[0]||""))} · ${a6.circle} Total: ${O1.magenta(fq(z))} tokens`), q.push("");
    let w = K.slice(0, 3);
    for (let [O, $] of w) {
        let j = (($.inputTokens + $.outputTokens) / z * 100).toFixed(1);
        q.push(`${a6.bullet} ${O1.bold(qJ(O))} ${O1.gray(`(${j}%)`)}`), q.push(O1.dim(`  In: ${fq($.inputTokens)} · Out: ${fq($.outputTokens)}`))
    }
    return q
}
// @from(Ln 430043, Col 4)
DA
// @from(Ln 430043, Col 8)
of
// @from(Ln 430043, Col 12)
PWq
// @from(Ln 430043, Col 17)
DWq
// @from(Ln 430043, Col 22)
vh1
// @from(Ln 430043, Col 27)
jqz
// @from(Ln 430043, Col 32)
Jqz
// @from(Ln 430044, Col 4)
TWq = E(() => {
    e6();
    i6();
    _7();
    LO();
    FJ();
    oz6();
    b7();
    aK();
    t0q();
    e0q();
    M4();
    T1();
    LG();
    q3();
    MWq();
    z4();
    k8();
    EX6();
    ym();
    OX6();
    _q();
    DA = t(P6(), 1), of = t(P6(), 1), PWq = t(d0q(), 1);
    DWq = {
        "7d": "Last 7 days",
        "30d": "Last 30 days",
        all: "All time"
    }, vh1 = ["all", "7d", "30d"];
    jqz = [{
        name: "The Little Prince",
        tokens: 22000
    }, {
        name: "The Old Man and the Sea",
        tokens: 35000
    }, {
        name: "A Christmas Carol",
        tokens: 37000
    }, {
        name: "Animal Farm",
        tokens: 39000
    }, {
        name: "Fahrenheit 451",
        tokens: 60000
    }, {
        name: "The Great Gatsby",
        tokens: 62000
    }, {
        name: "Slaughterhouse-Five",
        tokens: 64000
    }, {
        name: "Brave New World",
        tokens: 83000
    }, {
        name: "The Catcher in the Rye",
        tokens: 95000
    }, {
        name: "Harry Potter and the Philosopher's Stone",
        tokens: 103000
    }, {
        name: "The Hobbit",
        tokens: 123000
    }, {
        name: "1984",
        tokens: 123000
    }, {
        name: "To Kill a Mockingbird",
        tokens: 130000
    }, {
        name: "Pride and Prejudice",
        tokens: 156000
    }, {
        name: "Dune",
        tokens: 244000
    }, {
        name: "Moby-Dick",
        tokens: 268000
    }, {
        name: "Crime and Punishment",
        tokens: 274000
    }, {
        name: "A Game of Thrones",
        tokens: 381000
    }, {
        name: "Anna Karenina",
        tokens: 468000
    }, {
        name: "Don Quixote",
        tokens: 520000
    }, {
        name: "The Lord of the Rings",
        tokens: 576000
    }, {
        name: "The Count of Monte Cristo",
        tokens: 603000
    }, {
        name: "Les Misérables",
        tokens: 689000
    }, {
        name: "War and Peace",
        tokens: 730000
    }], Jqz = [{
        name: "a TED talk",
        minutes: 18
    }, {
        name: "an episode of The Office",
        minutes: 22
    }, {
        name: "listening to Abbey Road",
        minutes: 47
    }, {
        name: "a yoga class",
        minutes: 60
    }, {
        name: "a World Cup soccer match",
        minutes: 90
    }, {
        name: "a half marathon (average time)",
        minutes: 120
    }, {
        name: "the movie Inception",
        minutes: 148
    }, {
        name: "watching Titanic",
        minutes: 195
    }, {
        name: "a transatlantic flight",
        minutes: 420
    }, {
        name: "a full night of sleep",
        minutes: 480
    }]
})
// @from(Ln 430176, Col 4)
vWq = {}
// @from(Ln 430180, Col 4)
Wi8
// @from(Ln 430180, Col 9)
Vqz = async (A) => {
    return Wi8.createElement(WWq, {
        onClose: A
    })
}
// @from(Ln 430185, Col 4)
NWq = E(() => {
    TWq();
    Wi8 = t(P6(), 1)
})
// @from(Ln 430189, Col 4)
kqz
// @from(Ln 430189, Col 9)
VWq
// @from(Ln 430190, Col 4)
kWq = E(() => {
    kqz = {
        type: "local-jsx",
        name: "stats",
        description: "Show your Claude Code usage statistics and activity",
        isEnabled: () => !0,
        isHidden: !1,
        load: () => Promise.resolve().then(() => (NWq(), vWq)),
        userFacingName() {
            return "stats"
        }
    }, VWq = kqz
})
// @from(Ln 430215, Col 0)
function LWq() {
    return GN()
}
// @from(Ln 430219, Col 0)
function Rqz() {
    return GN()
}
// @from(Ln 430223, Col 0)
function Vh1() {
    return Xi(c8(), "usage-data")
}
// @from(Ln 430227, Col 0)
function kh1() {
    return Xi(Vh1(), "facets")
}
// @from(Ln 430231, Col 0)
function Gi8() {
    return Xi(Vh1(), "session-meta")
}
// @from(Ln 430235, Col 0)
function Iqz(A) {
    let q = Eqz(A).toLowerCase();
    return hqz[q] || null
}
// @from(Ln 430240, Col 0)
function bqz(A) {
    let q = {},
        K = {},
        Y = 0,
        z = 0,
        _ = 0,
        w = 0,
        O = 0,
        $ = [],
        H = 0,
        j = {},
        J = !1,
        M = 0,
        D = 0,
        X = new Set,
        P = [],
        W = [],
        Z = !1,
        G = !1,
        f = !1,
        v = null;
    for (let N of A.messages) {
        let V = N.timestamp;
        if (N.type === "assistant" && N.message) {
            if (V) v = V;
            let L = N.message.usage;
            if (L) _ += L.input_tokens || 0, w += L.output_tokens || 0;
            let h = N.message.content;
            if (Array.isArray(h)) {
                for (let R of h)
                    if (R.type === "tool_use" && "name" in R) {
                        let u = R.name;
                        if (q[u] = (q[u] || 0) + 1, u === r4 || u === I46) J = !0;
                        if (u.startsWith("mcp__")) Z = !0;
                        if (u === "WebSearch") G = !0;
                        if (u === "WebFetch") f = !0;
                        let I = R.input;
                        if (I) {
                            let g = I.file_path || "";
                            if (g) {
                                let b = Iqz(g);
                                if (b) K[b] = (K[b] || 0) + 1;
                                if (u === "Edit" || u === "Write") X.add(g)
                            }
                            if (u === "Edit") {
                                let b = I.old_string || "",
                                    p = I.new_string || "";
                                for (let Q of na(b, p)) {
                                    if (Q.added) M += Q.count || 0;
                                    if (Q.removed) D += Q.count || 0
                                }
                            }
                            if (u === "Write") {
                                let b = I.content || "";
                                if (b) M += b.split(`
`).length
                            }
                            let B = I.command || "";
                            if (B.includes("git commit")) Y++;
                            if (B.includes("git push")) z++
                        }
                    }
            }
        }
        if (N.type === "user" && N.message) {
            let L = N.message.content,
                h = !1;
            if (typeof L === "string" && L.trim()) h = !0;
            else if (Array.isArray(L)) {
                for (let R of L)
                    if (R.type === "text" && "text" in R) {
                        h = !0;
                        break
                    }
            }
            if (h) {
                if (V) try {
                    let u = new Date(V).getHours();
                    P.push(u), W.push(V)
                } catch {}
                if (v && V) {
                    let R = new Date(v).getTime(),
                        I = (new Date(V).getTime() - R) / 1000;
                    if (I > 2 && I < 3600) $.push(I)
                }
            }
            if (Array.isArray(L)) {
                for (let R of L)
                    if (R.type === "tool_result" && "content" in R) {
                        if (R.is_error) {
                            H++;
                            let I = R.content,
                                g = "Other";
                            if (typeof I === "string") {
                                let B = I.toLowerCase();
                                if (B.includes("exit code")) g = "Command Failed";
                                else if (B.includes("rejected") || B.includes("doesn't want")) g = "User Rejected";
                                else if (B.includes("string to replace not found") || B.includes("no changes")) g = "Edit Failed";
                                else if (B.includes("modified since read")) g = "File Changed";
                                else if (B.includes("exceeds maximum") || B.includes("too large")) g = "File Too Large";
                                else if (B.includes("file not found") || B.includes("does not exist")) g = "File Not Found"
                            }
                            j[g] = (j[g] || 0) + 1
                        }
                    }
            }
            if (typeof L === "string") {
                if (L.includes("[Request interrupted by user")) O++
            } else if (Array.isArray(L)) {
                for (let R of L)
                    if (R.type === "text" && "text" in R && R.text.includes("[Request interrupted by user")) {
                        O++;
                        break
                    }
            }
        }
    }
    return {
        toolCounts: q,
        languages: K,
        gitCommits: Y,
        gitPushes: z,
        inputTokens: _,
        outputTokens: w,
        userInterruptions: O,
        userResponseTimes: $,
        toolErrors: H,
        toolErrorCategories: j,
        usesTaskAgent: J,
        usesMcp: Z,
        usesWebSearch: G,
        usesWebFetch: f,
        linesAdded: M,
        linesRemoved: D,
        filesModified: X,
        messageHours: P,
        userMessageTimestamps: W
    }
}
// @from(Ln 430380, Col 0)
function xqz(A) {
    return !Number.isNaN(A.created.getTime()) && !Number.isNaN(A.modified.getTime())
}
// @from(Ln 430384, Col 0)
function vi8(A) {
    let q = bqz(A),
        K = n_(A) || "unknown",
        Y = A.created.toISOString(),
        z = Math.round((A.modified.getTime() - A.created.getTime()) / 1000 / 60),
        _ = 0,
        w = 0;
    for (let O of A.messages) {
        if (O.type === "assistant") w++;
        if (O.type === "user" && O.message) {
            let $ = O.message.content,
                H = !1;
            if (typeof $ === "string" && $.trim()) H = !0;
            else if (Array.isArray($)) {
                for (let j of $)
                    if (j.type === "text" && "text" in j) {
                        H = !0;
                        break
                    }
            }
            if (H) _++
        }
    }
    return {
        session_id: K,
        project_path: A.projectPath || "",
        start_time: Y,
        duration_minutes: z,
        user_message_count: _,
        assistant_message_count: w,
        tool_counts: q.toolCounts,
        languages: q.languages,
        git_commits: q.gitCommits,
        git_pushes: q.gitPushes,
        input_tokens: q.inputTokens,
        output_tokens: q.outputTokens,
        first_prompt: A.firstPrompt || "",
        summary: A.summary,
        user_interruptions: q.userInterruptions,
        user_response_times: q.userResponseTimes,
        tool_errors: q.toolErrors,
        tool_error_categories: q.toolErrorCategories,
        uses_task_agent: q.usesTaskAgent,
        uses_mcp: q.usesMcp,
        uses_web_search: q.usesWebSearch,
        uses_web_fetch: q.usesWebFetch,
        lines_added: q.linesAdded,
        lines_removed: q.linesRemoved,
        files_modified: q.filesModified.size,
        message_hours: q.messageHours,
        user_message_timestamps: q.userMessageTimestamps
    }
}
// @from(Ln 430438, Col 0)
function uqz(A) {
    let q = [],
        K = vi8(A);
    q.push(`Session: ${K.session_id.slice(0,8)}`), q.push(`Date: ${K.start_time}`), q.push(`Project: ${K.project_path}`), q.push(`Duration: ${K.duration_minutes} min`), q.push("");
    for (let Y of A.messages)
        if (Y.type === "user" && Y.message) {
            let z = Y.message.content;
            if (typeof z === "string") q.push(`[User]: ${z.slice(0,500)}`);
            else if (Array.isArray(z)) {
                for (let _ of z)
                    if (_.type === "text" && "text" in _) q.push(`[User]: ${_.text.slice(0,500)}`)
            }
        } else if (Y.type === "assistant" && Y.message) {
        let z = Y.message.content;
        if (Array.isArray(z)) {
            for (let _ of z)
                if (_.type === "text" && "text" in _) q.push(`[Assistant]: ${_.text.slice(0,300)}`);
                else if (_.type === "tool_use" && "name" in _) q.push(`[Tool: ${_.name}]`)
        }
    }
    return q.join(`
`)
}
// @from(Ln 430461, Col 0)
async function Bqz(A) {
    try {
        return (await Eh1({
            systemPrompt: uq([]),
            userPrompt: mqz + A,
            signal: new AbortController().signal,
            options: {
                model: LWq(),
                querySource: "insights",
                agents: [],
                isNonInteractiveSession: !0,
                hasAppendSystemPrompt: !1,
                mcpTools: [],
                maxOutputTokensOverride: 500
            }
        })).message.content.filter((Y) => Y.type === "text").map((Y) => Y.text).join("") || A.slice(0, 2000)
    } catch {
        return A.slice(0, 2000)
    }
}
// @from(Ln 430481, Col 0)
async function gqz(A) {
    let q = uqz(A);
    if (q.length <= 30000) return q;
    let K = 25000,
        Y = [];
    for (let O = 0; O < q.length; O += K) Y.push(q.slice(O, O + K));
    let z = await Promise.all(Y.map(Bqz)),
        _ = vi8(A);
    return [`Session: ${_.session_id.slice(0,8)}`, `Date: ${_.start_time}`, `Project: ${_.project_path}`, `Duration: ${_.duration_minutes} min`, `[Long session - ${Y.length} parts summarized]`, ""].join(`
`) + z.join(`

---

`)
}
// @from(Ln 430496, Col 0)
async function Fqz(A) {
    let q = Xi(kh1(), `${A}.json`);
    try {
        let K = await yWq(q, {
                encoding: "utf-8"
            }),
            Y = i1(K);
        if (!RWq(Y)) {
            try {
                await Lqz(q)
            } catch {}
            return null
        }
        return Y
    } catch {
        return null
    }
}
// @from(Ln 430514, Col 0)
async function pqz(A) {
    try {
        await fi8(kh1(), {
            recursive: !0
        })
    } catch {}
    let q = Xi(kh1(), `${A.session_id}.json`);
    await Ti8(q, B6(A, null, 2), {
        encoding: "utf-8",
        mode: 384
    })
}
// @from(Ln 430526, Col 0)
async function Qqz(A) {
    let q = Xi(Gi8(), `${A}.json`);
    try {
        let K = await yWq(q, {
            encoding: "utf-8"
        });
        return i1(K)
    } catch {
        return null
    }
}
// @from(Ln 430537, Col 0)
async function Uqz(A) {
    try {
        await fi8(Gi8(), {
            recursive: !0
        })
    } catch {}
    let q = Xi(Gi8(), `${A.session_id}.json`);
    await Ti8(q, B6(A, null, 2), {
        encoding: "utf-8",
        mode: 384
    })
}
// @from(Ln 430549, Col 0)
async function dqz(A, q) {
    try {
        let K = await gqz(A),
            Y = `${Cqz}${K}

RESPOND WITH ONLY A VALID JSON OBJECT matching this schema:
{
  "underlying_goal": "What the user fundamentally wanted to achieve",
  "goal_categories": {"category_name": count, ...},
  "outcome": "fully_achieved|mostly_achieved|partially_achieved|not_achieved|unclear_from_transcript",
  "user_satisfaction_counts": {"level": count, ...},
  "claude_helpfulness": "unhelpful|slightly_helpful|moderately_helpful|very_helpful|essential",
  "session_type": "single_task|multi_task|iterative_refinement|exploration|quick_question",
  "friction_counts": {"friction_type": count, ...},
  "friction_detail": "One sentence describing friction or empty",
  "primary_success": "none|fast_accurate_search|correct_code_edits|good_explanations|proactive_help|multi_file_changes|good_debugging",
  "brief_summary": "One sentence: what user wanted and whether they got it"
}`,
            w = (await Eh1({
                systemPrompt: uq([]),
                userPrompt: Y,
                signal: new AbortController().signal,
                options: {
                    model: LWq(),
                    querySource: "insights",
                    agents: [],
                    isNonInteractiveSession: !0,
                    hasAppendSystemPrompt: !1,
                    mcpTools: [],
                    maxOutputTokensOverride: 4096
                }
            })).message.content.filter((H) => H.type === "text").map((H) => H.text).join("").match(/\{[\s\S]*\}/);
        if (!w) return null;
        let O = i1(w[0]);
        if (!RWq(O)) return null;
        return {
            ...O,
            session_id: q
        }
    } catch (K) {
        return _6(K instanceof Error ? K : Error("Facet extraction failed")), null
    }
}
// @from(Ln 430593, Col 0)
function cqz(A) {
    let K = [];
    for (let $ of A)
        for (let H of $.user_message_timestamps) try {
            let j = new Date(H).getTime();
            K.push({
                ts: j,
                sessionId: $.session_id
            })
        } catch {}
    K.sort(($, H) => $.ts - H.ts);
    let Y = new Set,
        z = new Set,
        _ = 0,
        w = new Map;
    for (let $ = 0; $ < K.length; $++) {
        let H = K[$];
        while (_ < $ && H.ts - K[_].ts > 1800000) {
            let J = K[_];
            if (w.get(J.sessionId) === _) w.delete(J.sessionId);
            _++
        }
        let j = w.get(H.sessionId);
        if (j !== void 0)
            for (let J = j + 1; J < $; J++) {
                let M = K[J];
                if (M.sessionId !== H.sessionId) {
                    let D = [H.sessionId, M.sessionId].sort().join(":");
                    Y.add(D), z.add(`${K[j].ts}:${H.sessionId}`), z.add(`${M.ts}:${M.sessionId}`), z.add(`${H.ts}:${H.sessionId}`);
                    break
                }
            }
        w.set(H.sessionId, $)
    }
    let O = new Set;
    for (let $ of Y) {
        let [H, j] = $.split(":");
        if (H) O.add(H);
        if (j) O.add(j)
    }
    return {
        overlap_events: Y.size,
        sessions_involved: O.size,
        user_messages_during: z.size
    }
}
// @from(Ln 430640, Col 0)
function lqz(A, q) {
    let K = {
            total_sessions: A.length,
            sessions_with_facets: q.size,
            date_range: {
                start: "",
                end: ""
            },
            total_messages: 0,
            total_duration_hours: 0,
            total_input_tokens: 0,
            total_output_tokens: 0,
            tool_counts: {},
            languages: {},
            git_commits: 0,
            git_pushes: 0,
            projects: {},
            goal_categories: {},
            outcomes: {},
            satisfaction: {},
            helpfulness: {},
            session_types: {},
            friction: {},
            success: {},
            session_summaries: [],
            total_interruptions: 0,
            total_tool_errors: 0,
            tool_error_categories: {},
            user_response_times: [],
            median_response_time: 0,
            avg_response_time: 0,
            sessions_using_task_agent: 0,
            sessions_using_mcp: 0,
            sessions_using_web_search: 0,
            sessions_using_web_fetch: 0,
            total_lines_added: 0,
            total_lines_removed: 0,
            total_files_modified: 0,
            days_active: 0,
            messages_per_day: 0,
            message_hours: [],
            multi_clauding: {
                overlap_events: 0,
                sessions_involved: 0,
                user_messages_during: 0
            }
        },
        Y = [],
        z = [],
        _ = [];
    for (let O of A) {
        Y.push(O.start_time), K.total_messages += O.user_message_count, K.total_duration_hours += O.duration_minutes / 60, K.total_input_tokens += O.input_tokens, K.total_output_tokens += O.output_tokens, K.git_commits += O.git_commits, K.git_pushes += O.git_pushes, K.total_interruptions += O.user_interruptions, K.total_tool_errors += O.tool_errors;
        for (let [H, j] of Object.entries(O.tool_error_categories)) K.tool_error_categories[H] = (K.tool_error_categories[H] || 0) + j;
        if (z.push(...O.user_response_times), O.uses_task_agent) K.sessions_using_task_agent++;
        if (O.uses_mcp) K.sessions_using_mcp++;
        if (O.uses_web_search) K.sessions_using_web_search++;
        if (O.uses_web_fetch) K.sessions_using_web_fetch++;
        K.total_lines_added += O.lines_added, K.total_lines_removed += O.lines_removed, K.total_files_modified += O.files_modified, _.push(...O.message_hours);
        for (let [H, j] of Object.entries(O.tool_counts)) K.tool_counts[H] = (K.tool_counts[H] || 0) + j;
        for (let [H, j] of Object.entries(O.languages)) K.languages[H] = (K.languages[H] || 0) + j;
        if (O.project_path) K.projects[O.project_path] = (K.projects[O.project_path] || 0) + 1;
        let $ = q.get(O.session_id);
        if ($) {
            for (let [H, j] of Zi8($.goal_categories))
                if (j > 0) K.goal_categories[H] = (K.goal_categories[H] || 0) + j;
            K.outcomes[$.outcome] = (K.outcomes[$.outcome] || 0) + 1;
            for (let [H, j] of Zi8($.user_satisfaction_counts))
                if (j > 0) K.satisfaction[H] = (K.satisfaction[H] || 0) + j;
            K.helpfulness[$.claude_helpfulness] = (K.helpfulness[$.claude_helpfulness] || 0) + 1, K.session_types[$.session_type] = (K.session_types[$.session_type] || 0) + 1;
            for (let [H, j] of Zi8($.friction_counts))
                if (j > 0) K.friction[H] = (K.friction[H] || 0) + j;
            if ($.primary_success !== "none") K.success[$.primary_success] = (K.success[$.primary_success] || 0) + 1
        }
        if (K.session_summaries.length < 50) K.session_summaries.push({
            id: O.session_id.slice(0, 8),
            date: O.start_time.split("T")[0] || "",
            summary: O.summary || O.first_prompt.slice(0, 100),
            goal: $?.underlying_goal
        })
    }
    if (Y.sort(), K.date_range.start = Y[0]?.split("T")[0] || "", K.date_range.end = Y[Y.length - 1]?.split("T")[0] || "", K.user_response_times = z, z.length > 0) {
        let O = [...z].sort(($, H) => $ - H);
        K.median_response_time = O[Math.floor(O.length / 2)] || 0, K.avg_response_time = z.reduce(($, H) => $ + H, 0) / z.length
    }
    let w = new Set(Y.map((O) => O.split("T")[0]));
    return K.days_active = w.size, K.messages_per_day = K.days_active > 0 ? Math.round(K.total_messages / K.days_active * 10) / 10 : 0, K.message_hours = _, K.multi_clauding = cqz(A), K
}
// @from(Ln 430727, Col 0)
async function EWq(A, q) {
    try {
        let Y = (await Eh1({
            systemPrompt: uq([]),
            userPrompt: A.prompt + `

DATA:
` + q,
            signal: new AbortController().signal,
            options: {
                model: Rqz(),
                querySource: "insights",
                agents: [],
                isNonInteractiveSession: !0,
                hasAppendSystemPrompt: !1,
                mcpTools: [],
                maxOutputTokensOverride: A.maxTokens
            }
        })).message.content.filter((z) => z.type === "text").map((z) => z.text).join("");
        if (Y) {
            let z = Y.match(/\{[\s\S]*\}/);
            if (z) try {
                return {
                    name: A.name,
                    result: i1(z[0])
                }
            } catch {
                return {
                    name: A.name,
                    result: null
                }
            }
        }
        return {
            name: A.name,
            result: null
        }
    } catch (K) {
        return _6(K instanceof Error ? K : Error(`${A.name} failed`)), {
            name: A.name,
            result: null
        }
    }
}
// @from(Ln 430771, Col 0)
async function nqz(A, q) {
    let K = Array.from(q.values()).slice(0, 50).map((G) => `- ${G.brief_summary} (${G.outcome}, ${G.claude_helpfulness})`).join(`
`),
        Y = Array.from(q.values()).filter((G) => G.friction_detail).slice(0, 20).map((G) => `- ${G.friction_detail}`).join(`
`),
        z = Array.from(q.values()).flatMap((G) => G.user_instructions_to_claude || []).slice(0, 15).map((G) => `- ${G}`).join(`
`),
        w = B6({
            sessions: A.total_sessions,
            analyzed: A.sessions_with_facets,
            date_range: A.date_range,
            messages: A.total_messages,
            hours: Math.round(A.total_duration_hours),
            commits: A.git_commits,
            top_tools: Object.entries(A.tool_counts).sort((G, f) => f[1] - G[1]).slice(0, 8),
            top_goals: Object.entries(A.goal_categories).sort((G, f) => f[1] - G[1]).slice(0, 8),
            outcomes: A.outcomes,
            satisfaction: A.satisfaction,
            friction: A.friction,
            success: A.success,
            languages: A.languages
        }, null, 2) + `

SESSION SUMMARIES:
` + K + `

FRICTION DETAILS:
` + Y + `

USER INSTRUCTIONS TO CLAUDE:
` + (z || "None captured"),
        O = await Promise.all(iqz.map((G) => EWq(G, w))),
        $ = {};
    for (let {
            name: G,
            result: f
        }
        of O)
        if (f) $[G] = f;
    let H = $.project_areas?.areas?.map((G) => `- ${G.name}: ${G.description}`).join(`
`) || "",
        j = $.what_works?.impressive_workflows?.map((G) => `- ${G.title}: ${G.description}`).join(`
`) || "",
        J = $.friction_analysis?.categories?.map((G) => `- ${G.category}: ${G.description}`).join(`
`) || "",
        M = $.suggestions?.features_to_try?.map((G) => `- ${G.feature}: ${G.one_liner}`).join(`
`) || "",
        D = $.suggestions?.usage_patterns?.map((G) => `- ${G.title}: ${G.suggestion}`).join(`
`) || "",
        X = $.on_the_horizon?.opportunities?.map((G) => `- ${G.title}: ${G.whats_possible}`).join(`
`) || "",
        W = {
            name: "at_a_glance",
            prompt: `You're writing an "At a Glance" summary for a Claude Code usage insights report for Claude Code users. The goal is to help them understand their usage and improve how they can use Claude better, especially as models improve.

Use this 4-part structure:

1. **What's working** - What is the user's unique style of interacting with Claude and what are some impactful things they've done? You can include one or two details, but keep it high level since things might not be fresh in the user's memory. Don't be fluffy or overly complimentary. Also, don't focus on the tool calls they use.

2. **What's hindering you** - Split into (a) Claude's fault (misunderstandings, wrong approaches, bugs) and (b) user-side friction (not providing enough context, environment issues -- ideally more general than just one project). Be honest but constructive.

3. **Quick wins to try** - Specific Claude Code features they could try from the examples below, or a workflow technique if you think it's really compelling. (Avoid stuff like "Ask Claude to confirm before taking actions" or "Type out more context up front" which are less compelling.)

4. **Ambitious workflows for better models** - As we move to much more capable models over the next 3-6 months, what should they prepare for? What workflows that seem impossible now will become possible? Draw from the appropriate section below.

Keep each section to 2-3 not-too-long sentences. Don't overwhelm the user. Don't mention specific numerical stats or underlined_categories from the session data below. Use a coaching tone.

RESPOND WITH ONLY A VALID JSON OBJECT:
{
  "whats_working": "(refer to instructions above)",
  "whats_hindering": "(refer to instructions above)",
  "quick_wins": "(refer to instructions above)",
  "ambitious_workflows": "(refer to instructions above)"
}

SESSION DATA:
${w}

## Project Areas (what user works on)
${H}

## Big Wins (impressive accomplishments)
${j}

## Friction Categories (where things go wrong)
${J}

## Features to Try
${M}

## Usage Patterns to Adopt
${D}

## On the Horizon (ambitious workflows for better models)
${X}`,
            maxTokens: 8192
        },
        Z = await EWq(W, "");
    if (Z.result) $.at_a_glance = Z.result;
    return $
}
// @from(Ln 430873, Col 0)
function H9(A) {
    return A.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}
// @from(Ln 430877, Col 0)
function Nh1(A) {
    return H9(A).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
}
// @from(Ln 430881, Col 0)
function Di(A, q, K = 6, Y) {
    let z;
    if (Y) z = Y.filter((w) => (w in A) && (A[w] ?? 0) > 0).map((w) => [w, A[w] ?? 0]);
    else z = Object.entries(A).sort((w, O) => O[1] - w[1]).slice(0, K);
    if (z.length === 0) return '<p class="empty">No data</p>';
    let _ = Math.max(...z.map((w) => w[1]));
    return z.map(([w, O]) => {
        let $ = O / _ * 100,
            H = Sqz[w] || w.replace(/_/g, " ").replace(/\b\w/g, (j) => j.toUpperCase());
        return `<div class="bar-row">
        <div class="bar-label">${H9(H)}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${$}%;background:${q}"></div></div>
        <div class="bar-value">${O}</div>
      </div>`
    }).join(`
`)
}
// @from(Ln 430899, Col 0)
function aqz(A) {
    if (A.length === 0) return '<p class="empty">No response time data</p>';
    let q = {
        "2-10s": 0,
        "10-30s": 0,
        "30s-1m": 0,
        "1-2m": 0,
        "2-5m": 0,
        "5-15m": 0,
        ">15m": 0
    };
    for (let Y of A)
        if (Y < 10) q["2-10s"] = (q["2-10s"] ?? 0) + 1;
        else if (Y < 30) q["10-30s"] = (q["10-30s"] ?? 0) + 1;
    else if (Y < 60) q["30s-1m"] = (q["30s-1m"] ?? 0) + 1;
    else if (Y < 120) q["1-2m"] = (q["1-2m"] ?? 0) + 1;
    else if (Y < 300) q["2-5m"] = (q["2-5m"] ?? 0) + 1;
    else if (Y < 900) q["5-15m"] = (q["5-15m"] ?? 0) + 1;
    else q[">15m"] = (q[">15m"] ?? 0) + 1;
    let K = Math.max(...Object.values(q));
    if (K === 0) return '<p class="empty">No response time data</p>';
    return Object.entries(q).map(([Y, z]) => {
        let _ = z / K * 100;
        return `<div class="bar-row">
        <div class="bar-label">${Y}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${_}%;background:#6366f1"></div></div>
        <div class="bar-value">${z}</div>
      </div>`
    }).join(`
`)
}
// @from(Ln 430931, Col 0)
function sqz(A) {
    if (A.length === 0) return '<p class="empty">No time data</p>';
    let q = [{
            label: "Morning (6-12)",
            range: [6, 7, 8, 9, 10, 11]
        }, {
            label: "Afternoon (12-18)",
            range: [12, 13, 14, 15, 16, 17]
        }, {
            label: "Evening (18-24)",
            range: [18, 19, 20, 21, 22, 23]
        }, {
            label: "Night (0-6)",
            range: [0, 1, 2, 3, 4, 5]
        }],
        K = {};
    for (let w of A) K[w] = (K[w] || 0) + 1;
    let Y = q.map((w) => ({
            label: w.label,
            count: w.range.reduce((O, $) => O + (K[$] || 0), 0)
        })),
        z = Math.max(...Y.map((w) => w.count)) || 1;
    return `<div id="hour-histogram">${Y.map((w)=>`
      <div class="bar-row">
        <div class="bar-label">${w.label}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${w.count/z*100}%;background:#8b5cf6"></div></div>
        <div class="bar-value">${w.count}</div>
      </div>`).join(`
`)}</div>`
}
// @from(Ln 430962, Col 0)
function tqz(A) {
    let q = {};
    for (let K of A) q[K] = (q[K] || 0) + 1;
    return B6(q)
}
// @from(Ln 430968, Col 0)
function eqz(A, q) {
    let K = (R) => {
            if (!R) return "";
            return R.split(`

`).map((u) => {
                let I = H9(u);
                return I = I.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"), I = I.replace(/^- /gm, "• "), I = I.replace(/\n/g, "<br>"), `<p>${I}</p>`
            }).join(`
`)
        },
        Y = q.at_a_glance,
        z = Y ? `
    <div class="at-a-glance">
      <div class="glance-title">At a Glance</div>
      <div class="glance-sections">
        ${Y.whats_working?`<div class="glance-section"><strong>What's working:</strong> ${Nh1(Y.whats_working)} <a href="#section-wins" class="see-more">Impressive Things You Did →</a></div>`:""}
        ${Y.whats_hindering?`<div class="glance-section"><strong>What's hindering you:</strong> ${Nh1(Y.whats_hindering)} <a href="#section-friction" class="see-more">Where Things Go Wrong →</a></div>`:""}
        ${Y.quick_wins?`<div class="glance-section"><strong>Quick wins to try:</strong> ${Nh1(Y.quick_wins)} <a href="#section-features" class="see-more">Features to Try →</a></div>`:""}
        ${Y.ambitious_workflows?`<div class="glance-section"><strong>Ambitious workflows:</strong> ${Nh1(Y.ambitious_workflows)} <a href="#section-horizon" class="see-more">On the Horizon →</a></div>`:""}
      </div>
    </div>
    ` : "",
        _ = q.project_areas?.areas || [],
        w = _.length > 0 ? `
    <h2 id="section-work">What You Work On</h2>
    <div class="project-areas">
      ${_.map((R)=>`
        <div class="project-area">
          <div class="area-header">
            <span class="area-name">${H9(R.name)}</span>
            <span class="area-count">~${R.session_count} sessions</span>
          </div>
          <div class="area-desc">${H9(R.description)}</div>
        </div>
      `).join("")}
    </div>
    ` : "",
        O = q.interaction_style,
        $ = O?.narrative ? `
    <h2 id="section-usage">How You Use Claude Code</h2>
    <div class="narrative">
      ${K(O.narrative)}
      ${O.key_pattern?`<div class="key-insight"><strong>Key pattern:</strong> ${H9(O.key_pattern)}</div>`:""}
    </div>
    ` : "",
        H = q.what_works,
        j = H?.impressive_workflows && H.impressive_workflows.length > 0 ? `
    <h2 id="section-wins">Impressive Things You Did</h2>
    ${H.intro?`<p class="section-intro">${H9(H.intro)}</p>`:""}
    <div class="big-wins">
      ${H.impressive_workflows.map((R)=>`
        <div class="big-win">
          <div class="big-win-title">${H9(R.title||"")}</div>
          <div class="big-win-desc">${H9(R.description||"")}</div>
        </div>
      `).join("")}
    </div>
    ` : "",
        J = q.friction_analysis,
        M = J?.categories && J.categories.length > 0 ? `
    <h2 id="section-friction">Where Things Go Wrong</h2>
    ${J.intro?`<p class="section-intro">${H9(J.intro)}</p>`:""}
    <div class="friction-categories">
      ${J.categories.map((R)=>`
        <div class="friction-category">
          <div class="friction-title">${H9(R.category||"")}</div>
          <div class="friction-desc">${H9(R.description||"")}</div>
          ${R.examples?`<ul class="friction-examples">${R.examples.map((u)=>`<li>${H9(u)}</li>`).join("")}</ul>`:""}
        </div>
      `).join("")}
    </div>
    ` : "",
        D = q.suggestions,
        X = D ? `
    ${D.claude_md_additions&&D.claude_md_additions.length>0?`
    <h2 id="section-features">Existing CC Features to Try</h2>
    <div class="claude-md-section">
      <h3>Suggested CLAUDE.md Additions</h3>
      <p style="font-size: 12px; color: #64748b; margin-bottom: 12px;">Just copy this into Claude Code to add it to your CLAUDE.md.</p>
      <div class="claude-md-actions">
        <button class="copy-all-btn" onclick="copyAllCheckedClaudeMd()">Copy All Checked</button>
      </div>
      ${D.claude_md_additions.map((R,u)=>`
        <div class="claude-md-item">
          <input type="checkbox" id="cmd-${u}" class="cmd-checkbox" checked data-text="${H9(R.prompt_scaffold||R.where||"Add to CLAUDE.md")}\\n\\n${H9(R.addition)}">
          <label for="cmd-${u}">
            <code class="cmd-code">${H9(R.addition)}</code>
            <button class="copy-btn" onclick="copyCmdItem(${u})">Copy</button>
          </label>
          <div class="cmd-why">${H9(R.why)}</div>
        </div>
      `).join("")}
    </div>
    `:""}
    ${D.features_to_try&&D.features_to_try.length>0?`
    <p style="font-size: 13px; color: #64748b; margin-bottom: 12px;">Just copy this into Claude Code and it'll set it up for you.</p>
    <div class="features-section">
      ${D.features_to_try.map((R)=>`
        <div class="feature-card">
          <div class="feature-title">${H9(R.feature||"")}</div>
          <div class="feature-oneliner">${H9(R.one_liner||"")}</div>
          <div class="feature-why"><strong>Why for you:</strong> ${H9(R.why_for_you||"")}</div>
          ${R.example_code?`
          <div class="feature-examples">
            <div class="feature-example">
              <div class="example-code-row">
                <code class="example-code">${H9(R.example_code)}</code>
                <button class="copy-btn" onclick="copyText(this)">Copy</button>
              </div>
            </div>
          </div>
          `:""}
        </div>
      `).join("")}
    </div>
    `:""}
    ${D.usage_patterns&&D.usage_patterns.length>0?`
    <h2 id="section-patterns">New Ways to Use Claude Code</h2>
    <p style="font-size: 13px; color: #64748b; margin-bottom: 12px;">Just copy this into Claude Code and it'll walk you through it.</p>
    <div class="patterns-section">
      ${D.usage_patterns.map((R)=>`
        <div class="pattern-card">
          <div class="pattern-title">${H9(R.title||"")}</div>
          <div class="pattern-summary">${H9(R.suggestion||"")}</div>
          ${R.detail?`<div class="pattern-detail">${H9(R.detail)}</div>`:""}
          ${R.copyable_prompt?`
          <div class="copyable-prompt-section">
            <div class="prompt-label">Paste into Claude Code:</div>
            <div class="copyable-prompt-row">
              <code class="copyable-prompt">${H9(R.copyable_prompt)}</code>
              <button class="copy-btn" onclick="copyText(this)">Copy</button>
            </div>
          </div>
          `:""}
        </div>
      `).join("")}
    </div>
    `:""}
    ` : "",
        P = q.on_the_horizon,
        W = P?.opportunities && P.opportunities.length > 0 ? `
    <h2 id="section-horizon">On the Horizon</h2>
    ${P.intro?`<p class="section-intro">${H9(P.intro)}</p>`:""}
    <div class="horizon-section">
      ${P.opportunities.map((R)=>`
        <div class="horizon-card">
          <div class="horizon-title">${H9(R.title||"")}</div>
          <div class="horizon-possible">${H9(R.whats_possible||"")}</div>
          ${R.how_to_try?`<div class="horizon-tip"><strong>Getting started:</strong> ${H9(R.how_to_try)}</div>`:""}
          ${R.copyable_prompt?`<div class="pattern-prompt"><div class="prompt-label">Paste into Claude Code:</div><code>${H9(R.copyable_prompt)}</code><button class="copy-btn" onclick="copyText(this)">Copy</button></div>`:""}
        </div>
      `).join("")}
    </div>
    ` : "",
        Z = [],
        G = [],
        f = Z.length > 0 || G.length > 0 ? `
    <h2 id="section-feedback" class="feedback-header">Closing the Loop: Feedback for Other Teams</h2>
    <p class="feedback-intro">Suggestions for the CC product and model teams based on your usage patterns. Click to expand.</p>
    ${Z.length>0?`
    <div class="collapsible-section">
      <div class="collapsible-header" onclick="toggleCollapsible(this)">
        <span class="collapsible-arrow">▶</span>
        <h3>Product Improvements for CC Team</h3>
      </div>
      <div class="collapsible-content">
        <div class="suggestions-section">
          ${Z.map((R)=>`
            <div class="feedback-card team-card">
              <div class="feedback-title">${H9(R.title||"")}</div>
              <div class="feedback-detail">${H9(R.detail||"")}</div>
              ${R.evidence?`<div class="feedback-evidence"><em>Evidence:</em> ${H9(R.evidence)}</div>`:""}
            </div>
          `).join("")}
        </div>
      </div>
    </div>
    `:""}
    ${G.length>0?`
    <div class="collapsible-section">
      <div class="collapsible-header" onclick="toggleCollapsible(this)">
        <span class="collapsible-arrow">▶</span>
        <h3>Model Behavior Improvements</h3>
      </div>
      <div class="collapsible-content">
        <div class="suggestions-section">
          ${G.map((R)=>`
            <div class="feedback-card model-card">
              <div class="feedback-title">${H9(R.title||"")}</div>
              <div class="feedback-detail">${H9(R.detail||"")}</div>
              ${R.evidence?`<div class="feedback-evidence"><em>Evidence:</em> ${H9(R.evidence)}</div>`:""}
            </div>
          `).join("")}
        </div>
      </div>
    </div>
    `:""}
    ` : "",
        v = q.fun_ending,
        N = v?.headline ? `
    <div class="fun-ending">
      <div class="fun-headline">"${H9(v.headline)}"</div>
      ${v.detail?`<div class="fun-detail">${H9(v.detail)}</div>`:""}
    </div>
    ` : "",
        V = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: #f8fafc; color: #334155; line-height: 1.65; padding: 48px 24px; }
    .container { max-width: 800px; margin: 0 auto; }
    h1 { font-size: 32px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
    h2 { font-size: 20px; font-weight: 600; color: #0f172a; margin-top: 48px; margin-bottom: 16px; }
    .subtitle { color: #64748b; font-size: 15px; margin-bottom: 32px; }
    .nav-toc { display: flex; flex-wrap: wrap; gap: 8px; margin: 24px 0 32px 0; padding: 16px; background: white; border-radius: 8px; border: 1px solid #e2e8f0; }
    .nav-toc a { font-size: 12px; color: #64748b; text-decoration: none; padding: 6px 12px; border-radius: 6px; background: #f1f5f9; transition: all 0.15s; }
    .nav-toc a:hover { background: #e2e8f0; color: #334155; }
    .stats-row { display: flex; gap: 24px; margin-bottom: 40px; padding: 20px 0; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; flex-wrap: wrap; }
    .stat { text-align: center; }
    .stat-value { font-size: 24px; font-weight: 700; color: #0f172a; }
    .stat-label { font-size: 11px; color: #64748b; text-transform: uppercase; }
    .at-a-glance { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 1px solid #f59e0b; border-radius: 12px; padding: 20px 24px; margin-bottom: 32px; }
    .glance-title { font-size: 16px; font-weight: 700; color: #92400e; margin-bottom: 16px; }
    .glance-sections { display: flex; flex-direction: column; gap: 12px; }
    .glance-section { font-size: 14px; color: #78350f; line-height: 1.6; }
    .glance-section strong { color: #92400e; }
    .see-more { color: #b45309; text-decoration: none; font-size: 13px; white-space: nowrap; }
    .see-more:hover { text-decoration: underline; }
    .project-areas { display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; }
    .project-area { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; }
    .area-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .area-name { font-weight: 600; font-size: 15px; color: #0f172a; }
    .area-count { font-size: 12px; color: #64748b; background: #f1f5f9; padding: 2px 8px; border-radius: 4px; }
    .area-desc { font-size: 14px; color: #475569; line-height: 1.5; }
    .narrative { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 24px; }
    .narrative p { margin-bottom: 12px; font-size: 14px; color: #475569; line-height: 1.7; }
    .key-insight { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; margin-top: 12px; font-size: 14px; color: #166534; }
    .section-intro { font-size: 14px; color: #64748b; margin-bottom: 16px; }
    .big-wins { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
    .big-win { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; }
    .big-win-title { font-weight: 600; font-size: 15px; color: #166534; margin-bottom: 8px; }
    .big-win-desc { font-size: 14px; color: #15803d; line-height: 1.5; }
    .friction-categories { display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; }
    .friction-category { background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 16px; }
    .friction-title { font-weight: 600; font-size: 15px; color: #991b1b; margin-bottom: 6px; }
    .friction-desc { font-size: 13px; color: #7f1d1d; margin-bottom: 10px; }
    .friction-examples { margin: 0 0 0 20px; font-size: 13px; color: #334155; }
    .friction-examples li { margin-bottom: 4px; }
    .claude-md-section { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin-bottom: 20px; }
    .claude-md-section h3 { font-size: 14px; font-weight: 600; color: #1e40af; margin: 0 0 12px 0; }
    .claude-md-actions { margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #dbeafe; }
    .copy-all-btn { background: #2563eb; color: white; border: none; border-radius: 4px; padding: 6px 12px; font-size: 12px; cursor: pointer; font-weight: 500; transition: all 0.2s; }
    .copy-all-btn:hover { background: #1d4ed8; }
    .copy-all-btn.copied { background: #16a34a; }
    .claude-md-item { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 8px; padding: 10px 0; border-bottom: 1px solid #dbeafe; }
    .claude-md-item:last-child { border-bottom: none; }
    .cmd-checkbox { margin-top: 2px; }
    .cmd-code { background: white; padding: 8px 12px; border-radius: 4px; font-size: 12px; color: #1e40af; border: 1px solid #bfdbfe; font-family: monospace; display: block; white-space: pre-wrap; word-break: break-word; flex: 1; }
    .cmd-why { font-size: 12px; color: #64748b; width: 100%; padding-left: 24px; margin-top: 4px; }
    .features-section, .patterns-section { display: flex; flex-direction: column; gap: 12px; margin: 16px 0; }
    .feature-card { background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 16px; }
    .pattern-card { background: #f0f9ff; border: 1px solid #7dd3fc; border-radius: 8px; padding: 16px; }
    .feature-title, .pattern-title { font-weight: 600; font-size: 15px; color: #0f172a; margin-bottom: 6px; }
    .feature-oneliner { font-size: 14px; color: #475569; margin-bottom: 8px; }
    .pattern-summary { font-size: 14px; color: #475569; margin-bottom: 8px; }
    .feature-why, .pattern-detail { font-size: 13px; color: #334155; line-height: 1.5; }
    .feature-examples { margin-top: 12px; }
    .feature-example { padding: 8px 0; border-top: 1px solid #d1fae5; }
    .feature-example:first-child { border-top: none; }
    .example-desc { font-size: 13px; color: #334155; margin-bottom: 6px; }
    .example-code-row { display: flex; align-items: flex-start; gap: 8px; }
    .example-code { flex: 1; background: #f1f5f9; padding: 8px 12px; border-radius: 4px; font-family: monospace; font-size: 12px; color: #334155; overflow-x: auto; white-space: pre-wrap; }
    .copyable-prompt-section { margin-top: 12px; padding-top: 12px; border-top: 1px solid #e2e8f0; }
    .copyable-prompt-row { display: flex; align-items: flex-start; gap: 8px; }
    .copyable-prompt { flex: 1; background: #f8fafc; padding: 10px 12px; border-radius: 4px; font-family: monospace; font-size: 12px; color: #334155; border: 1px solid #e2e8f0; white-space: pre-wrap; line-height: 1.5; }
    .feature-code { background: #f8fafc; padding: 12px; border-radius: 6px; margin-top: 12px; border: 1px solid #e2e8f0; display: flex; align-items: flex-start; gap: 8px; }
    .feature-code code { flex: 1; font-family: monospace; font-size: 12px; color: #334155; white-space: pre-wrap; }
    .pattern-prompt { background: #f8fafc; padding: 12px; border-radius: 6px; margin-top: 12px; border: 1px solid #e2e8f0; }
    .pattern-prompt code { font-family: monospace; font-size: 12px; color: #334155; display: block; white-space: pre-wrap; margin-bottom: 8px; }
    .prompt-label { font-size: 11px; font-weight: 600; text-transform: uppercase; color: #64748b; margin-bottom: 6px; }
    .copy-btn { background: #e2e8f0; border: none; border-radius: 4px; padding: 4px 8px; font-size: 11px; cursor: pointer; color: #475569; flex-shrink: 0; }
    .copy-btn:hover { background: #cbd5e1; }
    .charts-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: 24px 0; }
    .chart-card { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; }
    .chart-title { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; margin-bottom: 12px; }
    .bar-row { display: flex; align-items: center; margin-bottom: 6px; }
    .bar-label { width: 100px; font-size: 11px; color: #475569; flex-shrink: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .bar-track { flex: 1; height: 6px; background: #f1f5f9; border-radius: 3px; margin: 0 8px; }
    .bar-fill { height: 100%; border-radius: 3px; }
    .bar-value { width: 28px; font-size: 11px; font-weight: 500; color: #64748b; text-align: right; }
    .empty { color: #94a3b8; font-size: 13px; }
    .horizon-section { display: flex; flex-direction: column; gap: 16px; }
    .horizon-card { background: linear-gradient(135deg, #faf5ff 0%, #f5f3ff 100%); border: 1px solid #c4b5fd; border-radius: 8px; padding: 16px; }
    .horizon-title { font-weight: 600; font-size: 15px; color: #5b21b6; margin-bottom: 8px; }
    .horizon-possible { font-size: 14px; color: #334155; margin-bottom: 10px; line-height: 1.5; }
    .horizon-tip { font-size: 13px; color: #6b21a8; background: rgba(255,255,255,0.6); padding: 8px 12px; border-radius: 4px; }
    .feedback-header { margin-top: 48px; color: #64748b; font-size: 16px; }
    .feedback-intro { font-size: 13px; color: #94a3b8; margin-bottom: 16px; }
    .feedback-section { margin-top: 16px; }
    .feedback-section h3 { font-size: 14px; font-weight: 600; color: #475569; margin-bottom: 12px; }
    .feedback-card { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 12px; }
    .feedback-card.team-card { background: #eff6ff; border-color: #bfdbfe; }
    .feedback-card.model-card { background: #faf5ff; border-color: #e9d5ff; }
    .feedback-title { font-weight: 600; font-size: 14px; color: #0f172a; margin-bottom: 6px; }
    .feedback-detail { font-size: 13px; color: #475569; line-height: 1.5; }
    .feedback-evidence { font-size: 12px; color: #64748b; margin-top: 8px; }
    .fun-ending { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 1px solid #fbbf24; border-radius: 12px; padding: 24px; margin-top: 40px; text-align: center; }
    .fun-headline { font-size: 18px; font-weight: 600; color: #78350f; margin-bottom: 8px; }
    .fun-detail { font-size: 14px; color: #92400e; }
    .collapsible-section { margin-top: 16px; }
    .collapsible-header { display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
    .collapsible-header h3 { margin: 0; font-size: 14px; font-weight: 600; color: #475569; }
    .collapsible-arrow { font-size: 12px; color: #94a3b8; transition: transform 0.2s; }
    .collapsible-content { display: none; padding-top: 16px; }
    .collapsible-content.open { display: block; }
    .collapsible-header.open .collapsible-arrow { transform: rotate(90deg); }
    @media (max-width: 640px) { .charts-row { grid-template-columns: 1fr; } .stats-row { justify-content: center; } }
  `,
        h = `
    function toggleCollapsible(header) {
      header.classList.toggle('open');
      const content = header.nextElementSibling;
      content.classList.toggle('open');
    }
    function copyText(btn) {
      const code = btn.previousElementSibling;
      navigator.clipboard.writeText(code.textContent).then(() => {
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
      });
    }
    function copyCmdItem(idx) {
      const checkbox = document.getElementById('cmd-' + idx);
      if (checkbox) {
        const text = checkbox.dataset.text;
        navigator.clipboard.writeText(text).then(() => {
          const btn = checkbox.nextElementSibling.querySelector('.copy-btn');
          if (btn) { btn.textContent = 'Copied!'; setTimeout(() => { btn.textContent = 'Copy'; }, 2000); }
        });
      }
    }
    function copyAllCheckedClaudeMd() {
      const checkboxes = document.querySelectorAll('.cmd-checkbox:checked');
      const texts = [];
      checkboxes.forEach(cb => {
        if (cb.dataset.text) { texts.push(cb.dataset.text); }
      });
      const combined = texts.join('\\n');
      const btn = document.querySelector('.copy-all-btn');
      if (btn) {
        navigator.clipboard.writeText(combined).then(() => {
          btn.textContent = 'Copied ' + texts.length + ' items!';
          btn.classList.add('copied');
          setTimeout(() => { btn.textContent = 'Copy All Checked'; btn.classList.remove('copied'); }, 2000);
        });
      }
    }
    // Timezone selector for time of day chart (data is from our own analytics, not user input)
    const rawHourCounts = ${tqz(A.message_hours)};
    function updateHourHistogram(offsetFromPT) {
      const periods = [
        { label: "Morning (6-12)", range: [6,7,8,9,10,11] },
        { label: "Afternoon (12-18)", range: [12,13,14,15,16,17] },
        { label: "Evening (18-24)", range: [18,19,20,21,22,23] },
        { label: "Night (0-6)", range: [0,1,2,3,4,5] }
      ];
      const adjustedCounts = {};
      for (const [hour, count] of Object.entries(rawHourCounts)) {
        const newHour = (parseInt(hour) + offsetFromPT + 24) % 24;
        adjustedCounts[newHour] = (adjustedCounts[newHour] || 0) + count;
      }
      const periodCounts = periods.map(p => ({
        label: p.label,
        count: p.range.reduce((sum, h) => sum + (adjustedCounts[h] || 0), 0)
      }));
      const maxCount = Math.max(...periodCounts.map(p => p.count)) || 1;
      const container = document.getElementById('hour-histogram');
      container.textContent = '';
      periodCounts.forEach(p => {
        const row = document.createElement('div');
        row.className = 'bar-row';
        const label = document.createElement('div');
        label.className = 'bar-label';
        label.textContent = p.label;
        const track = document.createElement('div');
        track.className = 'bar-track';
        const fill = document.createElement('div');
        fill.className = 'bar-fill';
        fill.style.width = (p.count / maxCount) * 100 + '%';
        fill.style.background = '#8b5cf6';
        track.appendChild(fill);
        const value = document.createElement('div');
        value.className = 'bar-value';
        value.textContent = p.count;
        row.appendChild(label);
        row.appendChild(track);
        row.appendChild(value);
        container.appendChild(row);
      });
    }
    document.getElementById('timezone-select').addEventListener('change', function() {
      const customInput = document.getElementById('custom-offset');
      if (this.value === 'custom') {
        customInput.style.display = 'inline-block';
        customInput.focus();
      } else {
        customInput.style.display = 'none';
        updateHourHistogram(parseInt(this.value));
      }
    });
    document.getElementById('custom-offset').addEventListener('change', function() {
      const offset = parseInt(this.value) + 8;
      updateHourHistogram(offset);
    });
  `;
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Claude Code Insights</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: #f8fafc; color: #334155; line-height: 1.65; padding: 48px 24px; }
    .container { max-width: 800px; margin: 0 auto; }
    h1 { font-size: 32px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
    h2 { font-size: 20px; font-weight: 600; color: #0f172a; margin-top: 48px; margin-bottom: 16px; }
    .subtitle { color: #64748b; font-size: 15px; margin-bottom: 32px; }
    .nav-toc { display: flex; flex-wrap: wrap; gap: 8px; margin: 24px 0 32px 0; padding: 16px; background: white; border-radius: 8px; border: 1px solid #e2e8f0; }
    .nav-toc a { font-size: 12px; color: #64748b; text-decoration: none; padding: 6px 12px; border-radius: 6px; background: #f1f5f9; transition: all 0.15s; }
    .nav-toc a:hover { background: #e2e8f0; color: #334155; }
    .stats-row { display: flex; gap: 24px; margin-bottom: 40px; padding: 20px 0; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; flex-wrap: wrap; }
    .stat { text-align: center; }
    .stat-value { font-size: 24px; font-weight: 700; color: #0f172a; }
    .stat-label { font-size: 11px; color: #64748b; text-transform: uppercase; }
    .at-a-glance { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 1px solid #f59e0b; border-radius: 12px; padding: 20px 24px; margin-bottom: 32px; }
    .glance-title { font-size: 16px; font-weight: 700; color: #92400e; margin-bottom: 16px; }
    .glance-sections { display: flex; flex-direction: column; gap: 12px; }
    .glance-section { font-size: 14px; color: #78350f; line-height: 1.6; }
    .glance-section strong { color: #92400e; }
    .see-more { color: #b45309; text-decoration: none; font-size: 13px; white-space: nowrap; }
    .see-more:hover { text-decoration: underline; }
    .project-areas { display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; }
    .project-area { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; }
    .area-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .area-name { font-weight: 600; font-size: 15px; color: #0f172a; }
    .area-count { font-size: 12px; color: #64748b; background: #f1f5f9; padding: 2px 8px; border-radius: 4px; }
    .area-desc { font-size: 14px; color: #475569; line-height: 1.5; }
    .narrative { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 24px; }
    .narrative p { margin-bottom: 12px; font-size: 14px; color: #475569; line-height: 1.7; }
    .key-insight { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; margin-top: 12px; font-size: 14px; color: #166534; }
    .section-intro { font-size: 14px; color: #64748b; margin-bottom: 16px; }
    .big-wins { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
    .big-win { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; }
    .big-win-title { font-weight: 600; font-size: 15px; color: #166534; margin-bottom: 8px; }
    .big-win-desc { font-size: 14px; color: #15803d; line-height: 1.5; }
    .friction-categories { display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; }
    .friction-category { background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 16px; }
    .friction-title { font-weight: 600; font-size: 15px; color: #991b1b; margin-bottom: 6px; }
    .friction-desc { font-size: 13px; color: #7f1d1d; margin-bottom: 10px; }
    .friction-examples { margin: 0 0 0 20px; font-size: 13px; color: #334155; }
    .friction-examples li { margin-bottom: 4px; }
    .claude-md-section { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin-bottom: 20px; }
    .claude-md-section h3 { font-size: 14px; font-weight: 600; color: #1e40af; margin: 0 0 12px 0; }
    .claude-md-actions { margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #dbeafe; }
    .copy-all-btn { background: #2563eb; color: white; border: none; border-radius: 4px; padding: 6px 12px; font-size: 12px; cursor: pointer; font-weight: 500; transition: all 0.2s; }
    .copy-all-btn:hover { background: #1d4ed8; }
    .copy-all-btn.copied { background: #16a34a; }
    .claude-md-item { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 8px; padding: 10px 0; border-bottom: 1px solid #dbeafe; }
    .claude-md-item:last-child { border-bottom: none; }
    .cmd-checkbox { margin-top: 2px; }
    .cmd-code { background: white; padding: 8px 12px; border-radius: 4px; font-size: 12px; color: #1e40af; border: 1px solid #bfdbfe; font-family: monospace; display: block; white-space: pre-wrap; word-break: break-word; flex: 1; }
    .cmd-why { font-size: 12px; color: #64748b; width: 100%; padding-left: 24px; margin-top: 4px; }
    .features-section, .patterns-section { display: flex; flex-direction: column; gap: 12px; margin: 16px 0; }
    .feature-card { background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 16px; }
    .pattern-card { background: #f0f9ff; border: 1px solid #7dd3fc; border-radius: 8px; padding: 16px; }
    .feature-title, .pattern-title { font-weight: 600; font-size: 15px; color: #0f172a; margin-bottom: 6px; }
    .feature-oneliner { font-size: 14px; color: #475569; margin-bottom: 8px; }
    .pattern-summary { font-size: 14px; color: #475569; margin-bottom: 8px; }
    .feature-why, .pattern-detail { font-size: 13px; color: #334155; line-height: 1.5; }
    .feature-examples { margin-top: 12px; }
    .feature-example { padding: 8px 0; border-top: 1px solid #d1fae5; }
    .feature-example:first-child { border-top: none; }
    .example-desc { font-size: 13px; color: #334155; margin-bottom: 6px; }
    .example-code-row { display: flex; align-items: flex-start; gap: 8px; }
    .example-code { flex: 1; background: #f1f5f9; padding: 8px 12px; border-radius: 4px; font-family: monospace; font-size: 12px; color: #334155; overflow-x: auto; white-space: pre-wrap; }
    .copyable-prompt-section { margin-top: 12px; padding-top: 12px; border-top: 1px solid #e2e8f0; }
    .copyable-prompt-row { display: flex; align-items: flex-start; gap: 8px; }
    .copyable-prompt { flex: 1; background: #f8fafc; padding: 10px 12px; border-radius: 4px; font-family: monospace; font-size: 12px; color: #334155; border: 1px solid #e2e8f0; white-space: pre-wrap; line-height: 1.5; }
    .feature-code { background: #f8fafc; padding: 12px; border-radius: 6px; margin-top: 12px; border: 1px solid #e2e8f0; display: flex; align-items: flex-start; gap: 8px; }
    .feature-code code { flex: 1; font-family: monospace; font-size: 12px; color: #334155; white-space: pre-wrap; }
    .pattern-prompt { background: #f8fafc; padding: 12px; border-radius: 6px; margin-top: 12px; border: 1px solid #e2e8f0; }
    .pattern-prompt code { font-family: monospace; font-size: 12px; color: #334155; display: block; white-space: pre-wrap; margin-bottom: 8px; }
    .prompt-label { font-size: 11px; font-weight: 600; text-transform: uppercase; color: #64748b; margin-bottom: 6px; }
    .copy-btn { background: #e2e8f0; border: none; border-radius: 4px; padding: 4px 8px; font-size: 11px; cursor: pointer; color: #475569; flex-shrink: 0; }
    .copy-btn:hover { background: #cbd5e1; }
    .charts-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: 24px 0; }
    .chart-card { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; }
    .chart-title { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; margin-bottom: 12px; }
    .bar-row { display: flex; align-items: center; margin-bottom: 6px; }
    .bar-label { width: 100px; font-size: 11px; color: #475569; flex-shrink: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .bar-track { flex: 1; height: 6px; background: #f1f5f9; border-radius: 3px; margin: 0 8px; }
    .bar-fill { height: 100%; border-radius: 3px; }
    .bar-value { width: 28px; font-size: 11px; font-weight: 500; color: #64748b; text-align: right; }
    .empty { color: #94a3b8; font-size: 13px; }
    .horizon-section { display: flex; flex-direction: column; gap: 16px; }
    .horizon-card { background: linear-gradient(135deg, #faf5ff 0%, #f5f3ff 100%); border: 1px solid #c4b5fd; border-radius: 8px; padding: 16px; }
    .horizon-title { font-weight: 600; font-size: 15px; color: #5b21b6; margin-bottom: 8px; }
    .horizon-possible { font-size: 14px; color: #334155; margin-bottom: 10px; line-height: 1.5; }
    .horizon-tip { font-size: 13px; color: #6b21a8; background: rgba(255,255,255,0.6); padding: 8px 12px; border-radius: 4px; }
    .feedback-header { margin-top: 48px; color: #64748b; font-size: 16px; }
    .feedback-intro { font-size: 13px; color: #94a3b8; margin-bottom: 16px; }
    .feedback-section { margin-top: 16px; }
    .feedback-section h3 { font-size: 14px; font-weight: 600; color: #475569; margin-bottom: 12px; }
    .feedback-card { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 12px; }
    .feedback-card.team-card { background: #eff6ff; border-color: #bfdbfe; }
    .feedback-card.model-card { background: #faf5ff; border-color: #e9d5ff; }
    .feedback-title { font-weight: 600; font-size: 14px; color: #0f172a; margin-bottom: 6px; }
    .feedback-detail { font-size: 13px; color: #475569; line-height: 1.5; }
    .feedback-evidence { font-size: 12px; color: #64748b; margin-top: 8px; }
    .fun-ending { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 1px solid #fbbf24; border-radius: 12px; padding: 24px; margin-top: 40px; text-align: center; }
    .fun-headline { font-size: 18px; font-weight: 600; color: #78350f; margin-bottom: 8px; }
    .fun-detail { font-size: 14px; color: #92400e; }
    .collapsible-section { margin-top: 16px; }
    .collapsible-header { display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
    .collapsible-header h3 { margin: 0; font-size: 14px; font-weight: 600; color: #475569; }
    .collapsible-arrow { font-size: 12px; color: #94a3b8; transition: transform 0.2s; }
    .collapsible-content { display: none; padding-top: 16px; }
    .collapsible-content.open { display: block; }
    .collapsible-header.open .collapsible-arrow { transform: rotate(90deg); }
    @media (max-width: 640px) { .charts-row { grid-template-columns: 1fr; } .stats-row { justify-content: center; } }
  </style>
</head>
<body>
  <div class="container">
    <h1>Claude Code Insights</h1>
    <p class="subtitle">${A.total_messages.toLocaleString()} messages across ${A.total_sessions} sessions${A.total_sessions_scanned&&A.total_sessions_scanned>A.total_sessions?` (${A.total_sessions_scanned.toLocaleString()} total)`:""} | ${A.date_range.start} to ${A.date_range.end}</p>

    ${z}

    <nav class="nav-toc">
      <a href="#section-work">What You Work On</a>
      <a href="#section-usage">How You Use CC</a>
      <a href="#section-wins">Impressive Things</a>
      <a href="#section-friction">Where Things Go Wrong</a>
      <a href="#section-features">Features to Try</a>
      <a href="#section-patterns">New Usage Patterns</a>
      <a href="#section-horizon">On the Horizon</a>
      <a href="#section-feedback">Team Feedback</a>
    </nav>

    <div class="stats-row">
      <div class="stat"><div class="stat-value">${A.total_messages.toLocaleString()}</div><div class="stat-label">Messages</div></div>
      <div class="stat"><div class="stat-value">+${A.total_lines_added.toLocaleString()}/-${A.total_lines_removed.toLocaleString()}</div><div class="stat-label">Lines</div></div>
      <div class="stat"><div class="stat-value">${A.total_files_modified}</div><div class="stat-label">Files</div></div>
      <div class="stat"><div class="stat-value">${A.days_active}</div><div class="stat-label">Days</div></div>
      <div class="stat"><div class="stat-value">${A.messages_per_day}</div><div class="stat-label">Msgs/Day</div></div>
    </div>

    ${w}

    <div class="charts-row">
      <div class="chart-card">
        <div class="chart-title">What You Wanted</div>
        ${Di(A.goal_categories,"#2563eb")}
      </div>
      <div class="chart-card">
        <div class="chart-title">Top Tools Used</div>
        ${Di(A.tool_counts,"#0891b2")}
      </div>
    </div>

    <div class="charts-row">
      <div class="chart-card">
        <div class="chart-title">Languages</div>
        ${Di(A.languages,"#10b981")}
      </div>
      <div class="chart-card">
        <div class="chart-title">Session Types</div>
        ${Di(A.session_types||{},"#8b5cf6")}
      </div>
    </div>

    ${$}

    <!-- Response Time Distribution -->
    <div class="chart-card" style="margin: 24px 0;">
      <div class="chart-title">User Response Time Distribution</div>
      ${aqz(A.user_response_times)}
      <div style="font-size: 12px; color: #64748b; margin-top: 8px;">
        Median: ${A.median_response_time.toFixed(1)}s &bull; Average: ${A.avg_response_time.toFixed(1)}s
      </div>
    </div>

    <!-- Multi-clauding Section (matching Python reference) -->
    <div class="chart-card" style="margin: 24px 0;">
      <div class="chart-title">Multi-Clauding (Parallel Sessions)</div>
      ${A.multi_clauding.overlap_events===0?`
        <p style="font-size: 14px; color: #64748b; padding: 8px 0;">
          No parallel session usage detected. You typically work with one Claude Code session at a time.
        </p>
      `:`
        <div style="display: flex; gap: 24px; margin: 12px 0;">
          <div style="text-align: center;">
            <div style="font-size: 24px; font-weight: 700; color: #7c3aed;">${A.multi_clauding.overlap_events}</div>
            <div style="font-size: 11px; color: #64748b; text-transform: uppercase;">Overlap Events</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 24px; font-weight: 700; color: #7c3aed;">${A.multi_clauding.sessions_involved}</div>
            <div style="font-size: 11px; color: #64748b; text-transform: uppercase;">Sessions Involved</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 24px; font-weight: 700; color: #7c3aed;">${A.total_messages>0?Math.round(100*A.multi_clauding.user_messages_during/A.total_messages):0}%</div>
            <div style="font-size: 11px; color: #64748b; text-transform: uppercase;">Of Messages</div>
          </div>
        </div>
        <p style="font-size: 13px; color: #475569; margin-top: 12px;">
          You run multiple Claude Code sessions simultaneously. Multi-clauding is detected when sessions
          overlap in time, suggesting parallel workflows.
        </p>
      `}
    </div>

    <!-- Time of Day & Tool Errors -->
    <div class="charts-row">
      <div class="chart-card">
        <div class="chart-title" style="display: flex; align-items: center; gap: 12px;">
          User Messages by Time of Day
          <select id="timezone-select" style="font-size: 12px; padding: 4px 8px; border-radius: 4px; border: 1px solid #e2e8f0;">
            <option value="0">PT (UTC-8)</option>
            <option value="3">ET (UTC-5)</option>
            <option value="8">London (UTC)</option>
            <option value="9">CET (UTC+1)</option>
            <option value="17">Tokyo (UTC+9)</option>
            <option value="custom">Custom offset...</option>
          </select>
          <input type="number" id="custom-offset" placeholder="UTC offset" style="display: none; width: 80px; font-size: 12px; padding: 4px; border-radius: 4px; border: 1px solid #e2e8f0;">
        </div>
        ${sqz(A.message_hours)}
      </div>
      <div class="chart-card">
        <div class="chart-title">Tool Errors Encountered</div>
        ${Object.keys(A.tool_error_categories).length>0?Di(A.tool_error_categories,"#dc2626"):'<p class="empty">No tool errors</p>'}
      </div>
    </div>

    ${j}

    <div class="charts-row">
      <div class="chart-card">
        <div class="chart-title">What Helped Most (Claude's Capabilities)</div>
        ${Di(A.success,"#16a34a")}
      </div>
      <div class="chart-card">
        <div class="chart-title">Outcomes</div>
        ${Di(A.outcomes,"#8b5cf6",6,oqz)}
      </div>
    </div>

    ${M}

    <div class="charts-row">
      <div class="chart-card">
        <div class="chart-title">Primary Friction Types</div>
        ${Di(A.friction,"#dc2626")}
      </div>
      <div class="chart-card">
        <div class="chart-title">Inferred Satisfaction (model-estimated)</div>
        ${Di(A.satisfaction,"#eab308",6,rqz)}
      </div>
    </div>

    ${X}

    ${W}

    ${N}

    ${f}
  </div>
  <script>${h}</script>
</body>
</html>`
}
// @from(Ln 431651, Col 0)
async function AKz() {
    let A = sb(),
        q;
    try {
        q = await yqz(A, {
            withFileTypes: !0
        })
    } catch {
        return []
    }
    let K = q.filter((z) => z.isDirectory()).map((z) => Xi(A, z.name)),
        Y = [];
    for (let z = 0; z < K.length; z++) {
        let _ = yr6(K[z]);
        for (let [w, O] of _) Y.push({
            sessionId: w,
            path: O.path,
            mtime: O.mtime,
            size: O.size
        });
        if (z % 10 === 9) await new Promise((w) => setImmediate(w))
    }
    return Y.sort((z, _) => _.mtime - z.mtime), Y
}
// @from(Ln 431675, Col 0)
async function qKz(A) {
    let q, K = await AKz(),
        Y = K.length,
        z = 50,
        _ = 200,
        w = [],
        O = [];
    for (let I = 0; I < K.length; I += z) {
        let g = K.slice(I, I + z),
            B = await Promise.all(g.map(async (b) => ({
                sessionInfo: b,
                cached: await Qqz(b.sessionId)
            })));
        for (let {
                sessionInfo: b,
                cached: p
            }
            of B)
            if (p) w.push(p);
            else if (O.length < _) O.push(b)
    }
    let $ = new Map,
        H = (I) => {
            for (let g of I.messages.slice(0, 5))
                if (g.type === "user" && g.message) {
                    let B = g.message.content;
                    if (typeof B === "string") {
                        if (B.includes("RESPOND WITH ONLY A VALID JSON OBJECT") || B.includes("record_facets")) return !0
                    }
                } return !1
        },
        j = 10;
    for (let I = 0; I < O.length; I += j) {
        let g = O.slice(I, I + j),
            B = await Promise.all(g.map(async (p) => {
                try {
                    return await yh1(p.path)
                } catch {
                    return []
                }
            })),
            b = [];
        for (let p of B)
            for (let Q of p) {
                if (H(Q) || !xqz(Q)) continue;
                let U = vi8(Q);
                w.push(U), b.push(U), $.set(U.session_id, Q)
            }
        await Promise.all(b.map((p) => Uqz(p)))
    }
    let J = new Map;
    for (let I of w) {
        let g = J.get(I.session_id);
        if (!g || I.user_message_count > g.user_message_count || I.user_message_count === g.user_message_count && I.duration_minutes > g.duration_minutes) J.set(I.session_id, I)
    }
    let M = new Set(J.keys());
    w = [...J.values()];
    for (let I of $.keys())
        if (!M.has(I)) $.delete(I);
    w.sort((I, g) => g.start_time.localeCompare(I.start_time));
    let D = (I) => {
            if (I.user_message_count < 2) return !1;
            if (I.duration_minutes < 1) return !1;
            return !0
        },
        X = w.filter(D),
        P = new Map,
        W = [],
        Z = 50,
        G = await Promise.all(X.map(async (I) => ({
            sessionId: I.session_id,
            cached: await Fqz(I.session_id)
        })));
    for (let {
            sessionId: I,
            cached: g
        }
        of G)
        if (g) P.set(I, g);
        else {
            let B = $.get(I);
            if (B && W.length < Z) W.push({
                log: B,
                sessionId: I
            })
        } let f = 50;
    for (let I = 0; I < W.length; I += f) {
        let g = W.slice(I, I + f),
            B = await Promise.all(g.map(async ({
                log: p,
                sessionId: Q
            }) => {
                let U = await dqz(p, Q);
                return {
                    sessionId: Q,
                    newFacets: U
                }
            })),
            b = [];
        for (let {
                sessionId: p,
                newFacets: Q
            }
            of B)
            if (Q) P.set(p, Q), b.push(Q);
        await Promise.all(b.map((p) => pqz(p)))
    }
    let v = (I) => {
            let g = P.get(I);
            if (!g) return !1;
            let B = g.goal_categories,
                b = KKz(B).filter((p) => (B[p] ?? 0) > 0);
            return b.length === 1 && b[0] === "warmup_minimal"
        },
        N = X.filter((I) => !v(I.session_id)),
        V = new Map;
    for (let [I, g] of P)
        if (!v(I)) V.set(I, g);
    let L = lqz(N, V);
    L.total_sessions_scanned = Y;
    let h = await nqz(L, P),
        R = eqz(L, h);
    try {
        await fi8(Vh1(), {
            recursive: !0
        })
    } catch {}
    let u = Xi(Vh1(), "report.html");
    return await Ti8(u, R, {
        encoding: "utf-8",
        mode: 384
    }), {
        insights: h,
        htmlPath: u,
        data: L,
        remoteStats: q,
        facets: V
    }
}
// @from(Ln 431815, Col 0)
function Zi8(A) {
    return A ? Object.entries(A) : []
}
// @from(Ln 431819, Col 0)
function KKz(A) {
    return A ? Object.keys(A) : []
}
// @from(Ln 431823, Col 0)
function RWq(A) {
    if (!A || typeof A !== "object") return !1;
    let q = A;
    return typeof q.underlying_goal === "string" && typeof q.outcome === "string" && typeof q.brief_summary === "string" && q.goal_categories !== null && typeof q.goal_categories === "object" && q.user_satisfaction_counts !== null && typeof q.user_satisfaction_counts === "object" && q.friction_counts !== null && typeof q.friction_counts === "object"
}
// @from(Ln 431828, Col 4)
hqz
// @from(Ln 431828, Col 9)
Sqz
// @from(Ln 431828, Col 14)
Cqz = `Analyze this Claude Code session and extract structured facets.

CRITICAL GUIDELINES:

1. **goal_categories**: Count ONLY what the USER explicitly asked for.
   - DO NOT count Claude's autonomous codebase exploration
   - DO NOT count work Claude decided to do on its own
   - ONLY count when user says "can you...", "please...", "I need...", "let's..."

2. **user_satisfaction_counts**: Base ONLY on explicit user signals.
   - "Yay!", "great!", "perfect!" → happy
   - "thanks", "looks good", "that works" → satisfied
   - "ok, now let's..." (continuing without complaint) → likely_satisfied
   - "that's not right", "try again" → dissatisfied
   - "this is broken", "I give up" → frustrated

3. **friction_counts**: Be specific about what went wrong.
   - misunderstood_request: Claude interpreted incorrectly
   - wrong_approach: Right goal, wrong solution method
   - buggy_code: Code didn't work correctly
   - user_rejected_action: User said no/stop to a tool call
   - excessive_changes: Over-engineered or changed too much

4. If very short or just warmup, use warmup_minimal for goal_category

SESSION:
`
// @from(Ln 431855, Col 4)
mqz = `Summarize this portion of a Claude Code session transcript. Focus on:
1. What the user asked for
2. What Claude did (tools used, files modified)
3. Any friction or issues
4. The outcome

Keep it concise - 3-5 sentences. Preserve specific details like file names, error messages, and user feedback.

TRANSCRIPT CHUNK:
`
// @from(Ln 431865, Col 4)
iqz
// @from(Ln 431865, Col 9)
rqz
// @from(Ln 431865, Col 14)
oqz
// @from(Ln 431865, Col 19)
YKz
// @from(Ln 431865, Col 24)
hWq