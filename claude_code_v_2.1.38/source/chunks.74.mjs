
// @from(Ln 198668, Col 0)
class NE7 {
    columns;
    _wrappedLines;
    text;
    navigationCache;
    graphemeBoundaries;
    constructor(A, q) {
        this.columns = q;
        this.text = A.normalize("NFC"), this.navigationCache = new Map
    }
    get wrappedLines() {
        if (!this._wrappedLines) this._wrappedLines = this.measureWrappedText();
        return this._wrappedLines
    }
    getGraphemeBoundaries() {
        if (!this.graphemeBoundaries) {
            this.graphemeBoundaries = [];
            for (let {
                    index: A
                }
                of T_().segment(this.text)) this.graphemeBoundaries.push(A);
            this.graphemeBoundaries.push(this.text.length)
        }
        return this.graphemeBoundaries
    }
    wordBoundariesCache;
    getWordBoundaries() {
        if (!this.wordBoundariesCache) {
            this.wordBoundariesCache = [];
            for (let A of E17().segment(this.text)) this.wordBoundariesCache.push({
                start: A.index,
                end: A.index + A.segment.length,
                isWordLike: A.isWordLike ?? !1
            })
        }
        return this.wordBoundariesCache
    }
    binarySearchBoundary(A, q, K) {
        let Y = 0,
            z = A.length - 1,
            w = K ? this.text.length : 0;
        while (Y <= z) {
            let H = Math.floor((Y + z) / 2),
                $ = A[H];
            if ($ === void 0) break;
            if (K)
                if ($ > q) w = $, z = H - 1;
                else Y = H + 1;
            else if ($ < q) w = $, Y = H + 1;
            else z = H - 1
        }
        return w
    }
    stringIndexToDisplayWidth(A, q) {
        if (q <= 0) return 0;
        if (q >= A.length) return UA(A);
        return UA(A.substring(0, q))
    }
    displayWidthToStringIndex(A, q) {
        if (q <= 0) return 0;
        if (!A) return 0;
        if (A === this.text) return this.offsetAtDisplayWidth(q);
        let K = 0,
            Y = 0;
        for (let {
                segment: z,
                index: w
            }
            of T_().segment(A)) {
            let H = UA(z);
            if (K + H > q) break;
            K += H, Y = w + z.length
        }
        return Y
    }
    offsetAtDisplayWidth(A) {
        if (A <= 0) return 0;
        let q = 0,
            K = this.getGraphemeBoundaries();
        for (let Y = 0; Y < K.length - 1; Y++) {
            let z = K[Y],
                w = K[Y + 1];
            if (z === void 0 || w === void 0) continue;
            let H = this.text.substring(z, w),
                $ = UA(H);
            if (q + $ > A) return z;
            q += $
        }
        return this.text.length
    }
    measureWrappedText() {
        let A = Gr(this.text, this.columns, {
                hard: !0,
                trim: !1
            }),
            q = [],
            K = 0,
            Y = -1,
            z = A.split(`
`);
        for (let w = 0; w < z.length; w++) {
            let H = z[w],
                $ = (O) => w === 0 || O > 0 && this.text[O - 1] === `
`;
            if (H.length === 0)
                if (Y = this.text.indexOf(`
`, Y + 1), Y !== -1) {
                    let O = Y,
                        _ = !0;
                    q.push(new x26(H, O, $(O), !0))
                } else {
                    let O = this.text.length;
                    q.push(new x26(H, O, $(O), !1))
                }
            else {
                let O = this.text.indexOf(H, K);
                if (O === -1) throw Error("Failed to find wrapped line in text");
                K = O + H.length;
                let _ = O + H.length,
                    J = _ < this.text.length && this.text[_] === `
`;
                if (J) Y = _;
                q.push(new x26(H, O, $(O), J))
            }
        }
        return q
    }
    getWrappedText() {
        return this.wrappedLines.map((A) => A.isPrecededByNewline ? A.text : A.text.trimStart())
    }
    getWrappedLines() {
        return this.wrappedLines
    }
    getLine(A) {
        let q = this.wrappedLines;
        return q[Math.max(0, Math.min(A, q.length - 1))]
    }
    getOffsetFromPosition(A) {
        let q = this.getLine(A.line);
        if (q.text.length === 0 && q.endsWithNewline) return q.startOffset;
        let K = q.isPrecededByNewline ? 0 : q.text.length - q.text.trimStart().length,
            Y = A.column + K,
            z = this.displayWidthToStringIndex(q.text, Y),
            w = q.startOffset + z,
            H = q.startOffset + q.text.length,
            $ = H,
            O = UA(q.text);
        if (q.endsWithNewline && A.column > O) $ = H + 1;
        return Math.min(w, $)
    }
    getLineLength(A) {
        let q = this.getLine(A);
        return UA(q.text)
    }
    getPositionFromOffset(A) {
        let q = this.wrappedLines;
        for (let z = 0; z < q.length; z++) {
            let w = q[z],
                H = q[z + 1];
            if (A >= w.startOffset && (!H || A < H.startOffset)) {
                let $ = A - w.startOffset,
                    O;
                if (w.isPrecededByNewline) O = this.stringIndexToDisplayWidth(w.text, $);
                else {
                    let _ = w.text.length - w.text.trimStart().length;
                    if ($ < _) O = 0;
                    else {
                        let J = w.text.trimStart(),
                            X = $ - _;
                        O = this.stringIndexToDisplayWidth(J, X)
                    }
                }
                return {
                    line: z,
                    column: Math.max(0, O)
                }
            }
        }
        let K = q.length - 1,
            Y = this.wrappedLines[K];
        return {
            line: K,
            column: UA(Y.text)
        }
    }
    get lineCount() {
        return this.wrappedLines.length
    }
    withCache(A, q) {
        let K = this.navigationCache.get(A);
        if (K !== void 0) return K;
        let Y = q();
        return this.navigationCache.set(A, Y), Y
    }
    nextOffset(A) {
        return this.withCache(`next:${A}`, () => {
            let q = this.getGraphemeBoundaries();
            return this.binarySearchBoundary(q, A, !0)
        })
    }
    prevOffset(A) {
        if (A <= 0) return 0;
        return this.withCache(`prev:${A}`, () => {
            let q = this.getGraphemeBoundaries();
            return this.binarySearchBoundary(q, A, !1)
        })
    }
    snapToGraphemeBoundary(A) {
        if (A <= 0) return 0;
        if (A >= this.text.length) return this.text.length;
        let q = this.getGraphemeBoundaries(),
            K = 0,
            Y = q.length - 1;
        while (K < Y) {
            let z = K + Y + 1 >> 1;
            if (q[z] <= A) K = z;
            else Y = z - 1
        }
        return q[K]
    }
}
// @from(Ln 198889, Col 4)
tK9 = 10
// @from(Ln 198890, Col 4)
iL
// @from(Ln 198890, Col 8)
I26 = 0
// @from(Ln 198891, Col 4)
N$A = !1
// @from(Ln 198892, Col 4)
VE7 = 0
// @from(Ln 198893, Col 4)
T$A = 0
// @from(Ln 198894, Col 4)
b26 = !1
// @from(Ln 198895, Col 4)
eK9
// @from(Ln 198895, Col 9)
Vx1
// @from(Ln 198895, Col 14)
nU = (A) => eK9.test(A)
// @from(Ln 198896, Col 4)
Q26 = (A) => Vx1.test(A)
// @from(Ln 198897, Col 4)
mo = (A) => A.length > 0 && !Q26(A) && !nU(A)
// @from(Ln 198898, Col 4)
RD1 = v(() => {
    DK6();
    LY();
    OS();
    iL = [];
    eK9 = /^[\p{L}\p{N}\p{M}_]$/u, Vx1 = /\s/
})
// @from(Ln 198906, Col 0)
function g26(A) {
    let q = e(7),
        {
            children: K
        } = A,
        {
            marker: Y
        } = Fo.useContext(A39),
        z;
    if (q[0] !== Y) z = Fo.default.createElement(V, {
        dimColor: !0
    }, Y), q[0] = Y, q[1] = z;
    else z = q[1];
    let w;
    if (q[2] !== K) w = Fo.default.createElement(I, {
        flexDirection: "column"
    }, K), q[2] = K, q[3] = w;
    else w = q[3];
    let H;
    if (q[4] !== z || q[5] !== w) H = Fo.default.createElement(I, {
        gap: 1
    }, z, w), q[4] = z, q[5] = w, q[6] = H;
    else H = q[6];
    return H
}
// @from(Ln 198931, Col 4)
Fo
// @from(Ln 198931, Col 8)
A39
// @from(Ln 198932, Col 4)
TE7 = v(() => {
    i1();
    m1();
    Fo = o(X1(), 1), A39 = Fo.createContext({
        marker: ""
    })
})
// @from(Ln 198940, Col 0)
function EE7(A) {
    let q = e(9),
        {
            children: K
        } = A,
        {
            marker: Y
        } = FV.useContext(vE7),
        z = 0;
    for (let O of FV.default.Children.toArray(K)) {
        if (!FV.isValidElement(O) || O.type !== g26) continue;
        z++
    }
    let w = String(z).length,
        H;
    if (q[0] !== K || q[1] !== w || q[2] !== Y) {
        let O;
        if (q[4] !== w || q[5] !== Y) O = (_, J) => {
            if (!FV.isValidElement(_) || _.type !== g26) return _;
            let X = `${String(J+1).padStart(w)}.`,
                D = `${Y}${X}`;
            return FV.default.createElement(vE7.Provider, {
                value: {
                    marker: D
                }
            }, FV.default.createElement(q39.Provider, {
                value: {
                    marker: D
                }
            }, _))
        }, q[4] = w, q[5] = Y, q[6] = O;
        else O = q[6];
        H = FV.default.Children.map(K, O), q[0] = K, q[1] = w, q[2] = Y, q[3] = H
    } else H = q[3];
    let $;
    if (q[7] !== H) $ = FV.default.createElement(I, {
        flexDirection: "column"
    }, H), q[7] = H, q[8] = $;
    else $ = q[8];
    return $
}
// @from(Ln 198981, Col 4)
FV
// @from(Ln 198981, Col 8)
vE7
// @from(Ln 198981, Col 13)
q39
// @from(Ln 198981, Col 18)
vx1
// @from(Ln 198982, Col 4)
v$A = v(() => {
    i1();
    m1();
    TE7();
    FV = o(X1(), 1), vE7 = FV.createContext({
        marker: ""
    }), q39 = FV.createContext({
        marker: ""
    });
    EE7.Item = g26;
    vx1 = EE7
})
// @from(Ln 198998, Col 0)
function LE7() {
    return E$A().filter(({
        isCompletable: A,
        isEnabled: q
    }) => A && q).every(({
        isComplete: A
    }) => A)
}
// @from(Ln 199007, Col 0)
function yD1() {
    let A = sz();
    if (LE7() && !A.hasCompletedProjectOnboarding) iH((q) => ({
        ...q,
        hasCompletedProjectOnboarding: !0
    }))
}
// @from(Ln 199015, Col 0)
function E$A() {
    let A = b1().existsSync(Y39(h6(), "CLAUDE.md")),
        q = CE7(h6());
    return [{
        key: "workspace",
        text: "Ask Claude to create a new app or clone a repository",
        isComplete: !1,
        isCompletable: !0,
        isEnabled: q
    }, {
        key: "claudemd",
        text: "Run /init to create a CLAUDE.md file with instructions for Claude",
        isComplete: A,
        isCompletable: !0,
        isEnabled: !q
    }]
}
// @from(Ln 199033, Col 0)
function yE7() {
    iH((A) => ({
        ...A,
        projectOnboardingSeenCount: A.projectOnboardingSeenCount + 1
    }))
}
// @from(Ln 199039, Col 4)
K39
// @from(Ln 199039, Col 9)
kE7
// @from(Ln 199039, Col 14)
RE7
// @from(Ln 199040, Col 4)
Ex1 = v(() => {
    v$A();
    m1();
    cA();
    wq();
    N7();
    _8();
    zq();
    K39 = o(X1(), 1), kE7 = o(X1(), 1);
    RE7 = KA(() => {
        if (LE7() || sz().projectOnboardingSeenCount >= 4 || process.env.IS_DEMO) return !1;
        return !0
    })
})
// @from(Ln 199061, Col 0)
function H39(A) {
    jA((q) => ({
        ...q,
        appleTerminalSetupInProgress: !0,
        appleTerminalBackupPath: A
    }))
}
// @from(Ln 199069, Col 0)
function kx1() {
    jA((A) => ({
        ...A,
        appleTerminalSetupInProgress: !1
    }))
}
// @from(Ln 199076, Col 0)
function $39() {
    let A = f6();
    return {
        inProgress: A.appleTerminalSetupInProgress ?? !1,
        backupPath: A.appleTerminalBackupPath || null
    }
}
// @from(Ln 199084, Col 0)
function CD1() {
    return w39(z39(), "Library", "Preferences", "com.apple.Terminal.plist")
}
// @from(Ln 199087, Col 0)
async function SE7() {
    let A = CD1(),
        q = `${A}.bak`;
    try {
        let {
            code: K
        } = await IA("defaults", ["export", "com.apple.Terminal", A]);
        if (K !== 0) return null;
        if (b1().existsSync(A)) return await IA("defaults", ["export", "com.apple.Terminal", q]), H39(q), q;
        return null
    } catch (K) {
        return K1(K instanceof Error ? K : Error(String(K))), null
    }
}
// @from(Ln 199101, Col 0)
async function U26() {
    let {
        inProgress: A,
        backupPath: q
    } = $39();
    if (!A) return {
        status: "no_backup"
    };
    if (!q || !b1().existsSync(q)) return kx1(), {
        status: "no_backup"
    };
    try {
        let {
            code: K
        } = await IA("defaults", ["import", "com.apple.Terminal", q]);
        if (K !== 0) return {
            status: "failed",
            backupPath: q
        };
        return await IA("killall", ["cfprefsd"]), kx1(), {
            status: "restored"
        }
    } catch (K) {
        return K1(Error(`Failed to restore Terminal.app settings with: ${K}`)), kx1(), {
            status: "failed",
            backupPath: q
        }
    }
}
// @from(Ln 199130, Col 4)
k$A = v(() => {
    tq();
    y6();
    cA();
    _8()
})
// @from(Ln 199145, Col 0)
function _39() {
    let A = process.env.SHELL || "",
        q = O39(),
        K = Qo(q, ".claude");
    if (A.endsWith("/zsh") || A.endsWith("/zsh.exe")) {
        let Y = Qo(K, "completion.zsh");
        return {
            name: "zsh",
            rcFile: Qo(q, ".zshrc"),
            cacheFile: Y,
            completionLine: `[[ -f "${Y}" ]] && source "${Y}"`,
            shellFlag: "zsh"
        }
    }
    if (A.endsWith("/bash") || A.endsWith("/bash.exe")) {
        let Y = Qo(K, "completion.bash");
        return {
            name: "bash",
            rcFile: Qo(q, ".bashrc"),
            cacheFile: Y,
            completionLine: `[ -f "${Y}" ] && source "${Y}"`,
            shellFlag: "bash"
        }
    }
    if (A.endsWith("/fish") || A.endsWith("/fish.exe")) {
        let Y = process.env.XDG_CONFIG_HOME || Qo(q, ".config"),
            z = Qo(K, "completion.fish");
        return {
            name: "fish",
            rcFile: Qo(Y, "fish", "config.fish"),
            cacheFile: z,
            completionLine: `[ -f "${z}" ] && source "${z}"`,
            shellFlag: "fish"
        }
    }
    return null
}
// @from(Ln 199182, Col 0)
async function L$A() {
    let A = _39();
    if (!A) return;
    h(`update: Regenerating ${A.name} completion cache`);
    let q = process.argv[1] || "claude";
    if ((await IA(q, ["completion", A.shellFlag, "--output", A.cacheFile])).code !== 0) {
        h(`update: Failed to regenerate ${A.name} completion cache`);
        return
    }
    h(`update: Regenerated ${A.name} completion cache at ${A.cacheFile}`)
}
// @from(Ln 199193, Col 4)
R$A = v(() => {
    m1();
    xo();
    Z6();
    tq();
    _8();
    y6();
    m6()
})
// @from(Ln 199202, Col 4)
xE7 = {}
// @from(Ln 199230, Col 0)
function D39() {
    let A = process.env.VSCODE_GIT_ASKPASS_MAIN ?? "",
        q = process.env.PATH ?? "";
    return A.includes(".vscode-server") || A.includes(".cursor-server") || A.includes(".windsurf-server") || q.includes(".vscode-server") || q.includes(".cursor-server") || q.includes(".windsurf-server")
}
// @from(Ln 199236, Col 0)
function j39() {
    return xA.terminal !== null && xA.terminal in Rx1
}
// @from(Ln 199240, Col 0)
function h$A() {
    if (!xA.terminal || !(xA.terminal in Rx1)) return null;
    return Rx1[xA.terminal] ?? null
}
// @from(Ln 199245, Col 0)
function nL(A) {
    if (!Vv()) return A;
    return `\x1B]8;;${X39(A).href}\x07${A}\x1B]8;;\x07`
}
// @from(Ln 199250, Col 0)
function SD1() {
    return Lx1() === "darwin" && xA.terminal === "Apple_Terminal" || xA.terminal === "vscode" || xA.terminal === "cursor" || xA.terminal === "windsurf" || xA.terminal === "alacritty" || xA.terminal === "WarpTerminal" || xA.terminal === "zed"
}
// @from(Ln 199253, Col 0)
async function p26(A) {
    let q = "";
    switch (xA.terminal) {
        case "Apple_Terminal":
            q = await W39(A);
            break;
        case "vscode":
            q = y$A("VSCode", A);
            break;
        case "cursor":
            q = y$A("Cursor", A);
            break;
        case "windsurf":
            q = y$A("Windsurf", A);
            break;
        case "alacritty":
            q = await G39(A);
            break;
        case "WarpTerminal":
            q = Z39(A);
            break;
        case "zed":
            q = f39(A);
            break;
        case null:
            break
    }
    return jA((K) => {
        if (["vscode", "cursor", "windsurf", "alacritty", "WarpTerminal", "zed"].includes(xA.terminal ?? "")) {
            if (K.shiftEnterKeyBindingInstalled === !0) return K;
            return {
                ...K,
                shiftEnterKeyBindingInstalled: !0
            }
        } else if (xA.terminal === "Apple_Terminal") {
            if (K.optionAsMetaKeyInstalled === !0) return K;
            return {
                ...K,
                optionAsMetaKeyInstalled: !0
            }
        }
        return K
    }), yD1(), q
}
// @from(Ln 199298, Col 0)
function I$A() {
    return f6().shiftEnterKeyBindingInstalled === !0
}
// @from(Ln 199302, Col 0)
function M39() {
    return f6().optionAsMetaKeyInstalled === !0
}
// @from(Ln 199306, Col 0)
function x$A() {
    return f6().hasUsedBackslashReturn === !0
}
// @from(Ln 199310, Col 0)
function b$A() {
    if (!f6().hasUsedBackslashReturn) jA((q) => ({
        ...q,
        hasUsedBackslashReturn: !0
    }))
}
// @from(Ln 199316, Col 0)
async function P39(A, q, K) {
    if (xA.terminal && xA.terminal in Rx1) {
        let z = `Shift+Enter is natively supported in ${Rx1[xA.terminal]}.

No configuration needed. Just use Shift+Enter to add newlines.`;
        return A(z), null
    }
    if (!SD1()) {
        let z = xA.terminal || "your current terminal",
            w = eA(),
            H = "";
        if (w === "macos") H = `   • macOS: Apple Terminal
`;
        else if (w === "windows") H = `   • Windows: Windows Terminal
`;
        let $ = `Terminal setup cannot be run from ${z}.

This command configures a convenient Shift+Enter shortcut for multi-line prompts.
${H6.dim("Note: You can already use backslash (\\\\) + return to add newlines.")}

To set up the shortcut (optional):
1. Exit tmux/screen temporarily
2. Run /terminal-setup directly in one of these terminals:
${H}   • IDE: VSCode, Cursor, Windsurf, Zed
   • Other: Alacritty, Warp
3. Return to tmux/screen - settings will persist

${H6.dim("Note: iTerm2, WezTerm, Ghostty, and Kitty support Shift+Enter natively.")}`;
        return A($), null
    }
    let Y = await p26(q.options.theme);
    return A(Y), null
}
// @from(Ln 199350, Col 0)
function y$A(A = "VSCode", q) {
    if (D39()) return `${k8("warning",q)(`Cannot install keybindings from a remote ${A} session.`)}${E3}${E3}${A} keybindings must be installed on your local machine, not the remote server.${E3}${E3}To install the Shift+Enter keybinding:${E3}1. Open ${A} on your local machine (not connected to remote)${E3}2. Open the Command Palette (Cmd/Ctrl+Shift+P) → "Preferences: Open Keyboard Shortcuts (JSON)"${E3}3. Add this keybinding (the file must be a JSON array):${E3}${E3}${H6.dim(`[
  {
    "key": "shift+enter",
    "command": "workbench.action.terminal.sendSequence",
    "args": { "text": "\\u001b\\r" },
    "when": "terminalFocus"
  }
]`)}${E3}`;
    let K = A === "VSCode" ? "Code" : A,
        Y = $B(S$A(), Lx1() === "win32" ? $B("AppData", "Roaming", K, "User") : Lx1() === "darwin" ? $B("Library", "Application Support", K, "User") : $B(".config", K, "User")),
        z = $B(Y, "keybindings.json");
    try {
        let w = "[]",
            H = [];
        if (!b1().existsSync(Y)) b1().mkdirSync(Y);
        if (b1().existsSync(z)) {
            w = b1().readFileSync(z, {
                encoding: "utf-8"
            }), H = DY8(w) ?? [];
            let J = C$A(4).toString("hex"),
                X = `${z}.${J}.bak`;
            try {
                b1().copyFileSync(z, X)
            } catch {
                return `${k8("warning",q)(`Error backing up existing ${A} terminal keybindings. Bailing out.`)}${E3}${H6.dim(`See ${nL(z)}`)}${E3}${H6.dim(`Backup path: ${nL(X)}`)}${E3}`
            }
        }
        if (H.find((J) => J.key === "shift+enter" && J.command === "workbench.action.terminal.sendSequence" && J.when === "terminalFocus")) return `${k8("warning",q)(`Found existing ${A} terminal Shift+Enter key binding. Remove it to continue.`)}${E3}${H6.dim(`See ${nL(z)}`)}${E3}`;
        let _ = MY8(w, {
            key: "shift+enter",
            command: "workbench.action.terminal.sendSequence",
            args: {
                text: "\x1B\r"
            },
            when: "terminalFocus"
        });
        return c8(z, _, {
            encoding: "utf-8"
        }), `${k8("success",q)(`Installed ${A} terminal Shift+Enter key binding`)}${E3}${H6.dim(`See ${nL(z)}`)}${E3}`
    } catch (w) {
        throw K1(w instanceof Error ? w : Error(String(w))), Error(`Failed to install ${A} terminal Shift+Enter key binding`)
    }
}
// @from(Ln 199394, Col 0)
async function hE7(A) {
    let {
        code: q
    } = await IA("/usr/libexec/PlistBuddy", ["-c", `Add :'Window Settings':'${A}':useOptionAsMetaKey bool true`, CD1()]);
    if (q !== 0) {
        let {
            code: K
        } = await IA("/usr/libexec/PlistBuddy", ["-c", `Set :'Window Settings':'${A}':useOptionAsMetaKey true`, CD1()]);
        if (K !== 0) return K1(Error(`Failed to enable Option as Meta key for Terminal.app profile: ${A}`)), !1
    }
    return !0
}
// @from(Ln 199406, Col 0)
async function IE7(A) {
    let {
        code: q
    } = await IA("/usr/libexec/PlistBuddy", ["-c", `Add :'Window Settings':'${A}':Bell bool false`, CD1()]);
    if (q !== 0) {
        let {
            code: K
        } = await IA("/usr/libexec/PlistBuddy", ["-c", `Set :'Window Settings':'${A}':Bell false`, CD1()]);
        if (K !== 0) return K1(Error(`Failed to disable audio bell for Terminal.app profile: ${A}`)), !1
    }
    return !0
}
// @from(Ln 199418, Col 0)
async function W39(A) {
    try {
        if (!await SE7()) throw Error("Failed to create backup of Terminal.app preferences, bailing out");
        let {
            stdout: K,
            code: Y
        } = await IA("defaults", ["read", "com.apple.Terminal", "Default Window Settings"]);
        if (Y !== 0 || !K.trim()) throw Error("Failed to read default Terminal.app profile");
        let {
            stdout: z,
            code: w
        } = await IA("defaults", ["read", "com.apple.Terminal", "Startup Window Settings"]);
        if (w !== 0 || !z.trim()) throw Error("Failed to read startup Terminal.app profile");
        let H = !1,
            $ = K.trim(),
            O = await hE7($),
            _ = await IE7($);
        if (O || _) H = !0;
        let J = z.trim();
        if (J !== $) {
            let X = await hE7(J),
                D = await IE7(J);
            if (X || D) H = !0
        }
        if (!H) throw Error("Failed to enable Option as Meta key or disable audio bell for any Terminal.app profile");
        return await IA("killall", ["cfprefsd"]), kx1(), `${k8("success",A)("Configured Terminal.app settings:")}${E3}${k8("success",A)('- Enabled "Use Option as Meta key"')}${E3}${k8("success",A)("- Switched to visual bell")}${E3}${H6.dim("Option+Enter will now enter a newline.")}${E3}${H6.dim("You must restart Terminal.app for changes to take effect.",A)}${E3}`
    } catch (q) {
        K1(q instanceof Error ? q : Error(String(q)));
        let K = await U26(),
            Y = "Failed to enable Option as Meta key for Terminal.app.";
        if (K.status === "restored") throw Error(`${Y} Your settings have been restored from backup.`);
        else if (K.status === "failed") throw Error(`${Y} Restoring from backup failed, try manually with: defaults import com.apple.Terminal ${K.backupPath}`);
        else throw Error(`${Y} No backup was available to restore from.`)
    }
}
// @from(Ln 199453, Col 0)
async function G39(A) {
    let K = [],
        Y = process.env.XDG_CONFIG_HOME;
    if (Y) K.push($B(Y, "alacritty", "alacritty.toml"));
    else K.push($B(S$A(), ".config", "alacritty", "alacritty.toml"));
    if (Lx1() === "win32") {
        let H = process.env.APPDATA;
        if (H) K.push($B(H, "alacritty", "alacritty.toml"))
    }
    let z = null,
        w = !1;
    for (let H of K)
        if (b1().existsSync(H)) {
            z = H, w = !0;
            break
        } if (!z) z = K[0] ?? null, w = !1;
    if (!z) throw Error("No valid config path found for Alacritty");
    try {
        let H = "";
        if (w) {
            if (H = b1().readFileSync(z, {
                    encoding: "utf-8"
                }), H.includes('mods = "Shift"') && H.includes('key = "Return"')) return `${k8("warning",A)("Found existing Alacritty Shift+Enter key binding. Remove it to continue.")}${E3}${H6.dim(`See ${nL(z)}`)}${E3}`;
            let O = C$A(4).toString("hex"),
                _ = `${z}.${O}.bak`;
            try {
                b1().copyFileSync(z, _)
            } catch {
                return `${k8("warning",A)("Error backing up existing Alacritty config. Bailing out.")}${E3}${H6.dim(`See ${nL(z)}`)}${E3}${H6.dim(`Backup path: ${nL(_)}`)}${E3}`
            }
        } else {
            let O = J39(z);
            if (!b1().existsSync(O)) b1().mkdirSync(O)
        }
        let $ = H;
        if (H && !H.endsWith(`
`)) $ += `
`;
        return $ += `
[[keyboard.bindings]]
key = "Return"
mods = "Shift"
chars = "\\x1b\\r"
`, c8(z, $, {
            encoding: "utf-8"
        }), `${k8("success",A)("Installed Alacritty Shift+Enter key binding")}${E3}${k8("success",A)("You may need to restart Alacritty for changes to take effect")}${E3}${H6.dim(`See ${nL(z)}`)}${E3}`
    } catch (H) {
        throw K1(H instanceof Error ? H : Error(String(H))), Error("Failed to install Alacritty Shift+Enter key binding")
    }
}
// @from(Ln 199504, Col 0)
function Z39(A) {
    if (Lx1() === "darwin") return `${k8("warning",A)("Warp requires manual configuration:")}${E3}${E3}${k8("success",A)("For Alt+T (thinking) and Alt+P (model picker):")}${E3}  Settings → Features → Enable "Left Option key is meta"${E3}${E3}${H6.dim("Note: Warp does not support custom Shift+Enter keybindings.")}${E3}${H6.dim("Use backslash (\\\\) + Enter for multi-line input.")}${E3}`;
    return `${k8("warning",A)("Warp does not support custom Shift+Enter keybindings.")}${E3}${H6.dim("Use backslash (\\\\) + Enter for multi-line input.")}${E3}`
}
// @from(Ln 199509, Col 0)
function f39(A) {
    let q = $B(S$A(), ".config", "zed"),
        K = $B(q, "keymap.json");
    try {
        let Y = "[]";
        if (!b1().existsSync(q)) b1().mkdirSync(q);
        if (b1().existsSync(K)) {
            if (Y = b1().readFileSync(K, {
                    encoding: "utf-8"
                }), Y.includes("shift-enter")) return `${k8("warning",A)("Found existing Zed Shift+Enter key binding. Remove it to continue.")}${E3}${H6.dim(`See ${nL(K)}`)}${E3}`;
            let w = C$A(4).toString("hex"),
                H = `${K}.${w}.bak`;
            try {
                b1().copyFileSync(K, H)
            } catch {
                return `${k8("warning",A)("Error backing up existing Zed keymap. Bailing out.")}${E3}${H6.dim(`See ${nL(K)}`)}${E3}${H6.dim(`Backup path: ${nL(H)}`)}${E3}`
            }
        }
        let z;
        try {
            if (z = _A(Y), !Array.isArray(z)) z = []
        } catch {
            z = []
        }
        return z.push({
            context: "Terminal",
            bindings: {
                "shift-enter": ["terminal::SendText", "\x1B\r"]
            }
        }), c8(K, Q1(z, null, 2) + `
`, {
            encoding: "utf-8"
        }), `${k8("success",A)("Installed Zed Shift+Enter key binding")}${E3}${H6.dim(`See ${nL(K)}`)}${E3}`
    } catch (Y) {
        throw K1(Y instanceof Error ? Y : Error(String(Y))), Error("Failed to install Zed Shift+Enter key binding")
    }
}
// @from(Ln 199546, Col 4)
Rx1
// @from(Ln 199547, Col 4)
Oq1 = v(() => {
    q3();
    xo();
    Ex1();
    k$A();
    cA();
    G5();
    tq();
    _8();
    m6();
    AH();
    y6();
    m1();
    x3();
    m6();
    R$A();
    Rx1 = {
        ghostty: "Ghostty",
        kitty: "Kitty",
        "iTerm.app": "iTerm2",
        WezTerm: "WezTerm"
    }
})
// @from(Ln 199585, Col 0)
function B$A() {
    return u$A(O8(), R39)
}
// @from(Ln 199589, Col 0)
function bE7(A) {
    return V39("sha256").update(A).digest("hex").slice(0, 16)
}
// @from(Ln 199593, Col 0)
function uE7(A) {
    return u$A(B$A(), `${A}.txt`)
}
// @from(Ln 199596, Col 0)
async function BE7(A, q) {
    try {
        let K = B$A();
        await N39(K, {
            recursive: !0
        });
        let Y = uE7(A);
        await T39(Y, q, {
            encoding: "utf8",
            mode: 384
        }), h(`Stored paste ${A} to ${Y}`)
    } catch (K) {
        h(`Failed to store paste: ${K}`)
    }
}
// @from(Ln 199611, Col 0)
async function mE7(A) {
    try {
        let q = uE7(A);
        return await v39(q, {
            encoding: "utf8"
        })
    } catch (q) {
        if (q && typeof q === "object" && "code" in q) {
            if (q.code !== "ENOENT") h(`Failed to retrieve paste ${A}: ${q}`)
        }
        return null
    }
}
// @from(Ln 199624, Col 0)
async function FE7(A) {
    let q = B$A(),
        K;
    try {
        K = await E39(q)
    } catch {
        return
    }
    let Y = A.getTime();
    for (let z of K) {
        if (!z.endsWith(".txt")) continue;
        let w = u$A(q, z);
        try {
            if ((await k39(w)).mtimeMs < Y) await L39(w), h(`Cleaned up old paste: ${w}`)
        } catch {}
    }
}
// @from(Ln 199641, Col 4)
R39 = "paste-cache"
// @from(Ln 199642, Col 4)
m$A = v(() => {
    hA();
    Z6()
})
// @from(Ln 199650, Col 0)
function hD1(A) {
    return (A.match(/\r\n|\r|\n/g) || []).length
}
// @from(Ln 199654, Col 0)
function c26(A, q) {
    if (q === 0) return `[Pasted text #${A}]`;
    return `[Pasted text #${A} +${q} lines]`
}
// @from(Ln 199659, Col 0)
function ID1(A) {
    let q = /\[(Pasted text|Image|\.\.\.Truncated text) #(\d+)(?: \+\d+ lines)?(\.)*\]/g;
    return [...A.matchAll(q)].map((Y) => ({
        id: parseInt(Y[2] || "0"),
        match: Y[0]
    })).filter((Y) => Y.id > 0)
}
// @from(Ln 199667, Col 0)
function S39(A) {
    return _A(A)
}
// @from(Ln 199670, Col 0)
async function* pE7() {
    for (let K = oU.length - 1; K >= 0; K--) yield oU[K];
    let A = gE7(O8(), "history.jsonl");
    if (!b1().existsSync(A)) return;
    for await (let K of olA(A)) try {
        yield S39(K)
    } catch (Y) {
        h(`Failed to parse history line: ${Y}`)
    }
}
// @from(Ln 199680, Col 0)
async function* Q$A() {
    for await (let A of pE7()) yield await dE7(A)
}
// @from(Ln 199683, Col 0)
async function* l26() {
    let A = ZO(),
        q = 0;
    for await (let K of pE7()) {
        if (!K || typeof K.project !== "string") continue;
        if (K.project === A) {
            if (yield await dE7(K), q++, q >= y39) break
        }
    }
}
// @from(Ln 199693, Col 0)
async function h39(A) {
    if (A.content) return {
        id: A.id,
        type: A.type,
        content: A.content,
        mediaType: A.mediaType,
        filename: A.filename
    };
    if (A.contentHash) {
        let q = await mE7(A.contentHash);
        if (q) return {
            id: A.id,
            type: A.type,
            content: q,
            mediaType: A.mediaType,
            filename: A.filename
        }
    }
    return null
}
// @from(Ln 199713, Col 0)
async function dE7(A) {
    let q = {};
    for (let [K, Y] of Object.entries(A.pastedContents || {})) {
        let z = await h39(Y);
        if (z) q[Number(K)] = z
    }
    return {
        display: A.display,
        pastedContents: q
    }
}
// @from(Ln 199724, Col 0)
async function cE7() {
    if (oU.length === 0) return;
    let A;
    try {
        let q = gE7(O8(), "history.jsonl"),
            K = b1();
        if (!K.existsSync(q)) c8(q, "", {
            encoding: "utf8",
            flush: !0,
            mode: 384
        });
        A = await UE7.lock(q, {
            stale: 1e4,
            retries: {
                retries: 3,
                minTimeout: 50
            }
        });
        let Y = oU.map((z) => Q1(z) + `
`);
        oU = [], K.appendFileSync(q, Y.join(""), {
            mode: 384
        })
    } catch (q) {
        h(`Failed to write prompt history: ${q}`)
    } finally {
        if (A) await A()
    }
}
// @from(Ln 199753, Col 0)
async function lE7(A) {
    if (F$A || oU.length === 0) return;
    if (A > 5) return;
    F$A = !0;
    try {
        await cE7()
    } finally {
        if (F$A = !1, oU.length > 0) await new Promise((q) => setTimeout(q, 500)), lE7(A + 1)
    }
}
// @from(Ln 199763, Col 0)
async function I39(A) {
    let q = typeof A === "string" ? {
            display: A,
            pastedContents: {}
        } : A,
        K = {};
    if (q.pastedContents)
        for (let [z, w] of Object.entries(q.pastedContents)) {
            if (w.type === "image") continue;
            if (w.content.length <= C39) K[Number(z)] = {
                id: w.id,
                type: w.type,
                content: w.content,
                mediaType: w.mediaType,
                filename: w.filename
            };
            else {
                let H = bE7(w.content);
                K[Number(z)] = {
                    id: w.id,
                    type: w.type,
                    contentHash: H,
                    mediaType: w.mediaType,
                    filename: w.filename
                }, BE7(H, w.content)
            }
        }
    let Y = {
        ...q,
        pastedContents: K,
        timestamp: Date.now(),
        project: ZO(),
        sessionId: U6()
    };
    oU.push(Y), d26 = lE7(0)
}
// @from(Ln 199800, Col 0)
function _q1(A) {
    if (process.env.CLAUDE_CODE_SKIP_PROMPT_HISTORY === "true") return;
    if (!QE7) QE7 = !0, Tq(async () => {
        if (d26) await d26;
        if (oU.length > 0) await cE7()
    });
    I39(A)
}
// @from(Ln 199808, Col 4)
UE7
// @from(Ln 199808, Col 9)
y39 = 100
// @from(Ln 199809, Col 4)
C39 = 1024
// @from(Ln 199810, Col 4)
oU
// @from(Ln 199810, Col 8)
F$A = !1
// @from(Ln 199811, Col 4)
d26 = null
// @from(Ln 199812, Col 4)
QE7 = !1
// @from(Ln 199813, Col 4)
nS = v(() => {
    hA();
    _8();
    m6();
    B6();
    Z6();
    Tz();
    m6();
    m$A();
    UE7 = o(NQ(), 1);
    oU = []
})
// @from(Ln 199825, Col 0)
async function b39() {
    let A = eA(),
        q = x39[A];
    for (let K of q) try {
        let Y = K.split(" ")[0];
        return await XY(A === "windows" ? "where" : "which", [Y], {
            timeout: 1000,
            reject: !0
        }), K
    } catch {
        continue
    }
    return null
}
// @from(Ln 199839, Col 0)
async function iE7() {
    if (!process.stdout.isTTY) return !1;
    try {
        if ((await XY("tput", ["Ms"], {
                timeout: 1000,
                reject: !0
            })).stdout.includes("]52")) return !0
    } catch {}
    let A = ["ITERM_SESSION_ID", "WT_SESSION", "KONSOLE_VERSION"];
    for (let q of A)
        if (process.env[q]) return !0;
    return !1
}
// @from(Ln 199852, Col 0)
async function u39() {
    if (rS !== null) return rS;
    let A = !!(process.env.SSH_CLIENT || process.env.SSH_TTY),
        q = await iE7(),
        K = await b39();
    i26 = K;
    let Y = K !== null;
    if (A && q) rS = "osc52";
    else if (A && Y) rS = "native";
    else if (A && process.stdout.isTTY) rS = "osc52";
    else if (!A && Y) rS = "native";
    else if (q) rS = "osc52";
    else rS = "none";
    return rS
}
// @from(Ln 199868, Col 0)
function B39(A) {
    if (process.env.TMUX) return `\x1BPtmux;${A.replaceAll("\x1B","\x1B\x1B")}\x1B\\`;
    if (process.env.STY) return `\x1BP${A}\x1B\\`;
    return A
}
// @from(Ln 199873, Col 0)
async function m39(A) {
    if (!process.stdout.isTTY) return !1;
    try {
        let K = `\x1B]52;c;${Buffer.from(A).toString("base64")}\x07`,
            Y = B39(K),
            {
                promise: z,
                resolve: w,
                reject: H
            } = Promise.withResolvers();
        return process.stdout.write(Y, ($) => $ ? H($) : w()), await z, !0
    } catch (q) {
        return K1(Error(`Failed to copy via OSC52: ${q}`)), rS = i26 ? "native" : "none", !1
    }
}
// @from(Ln 199888, Col 0)
async function F39(A, q) {
    try {
        return await XY(q, {
            input: A,
            shell: !0,
            reject: !0
        }), !0
    } catch (K) {
        return K1(Error(`Failed to execute clipboard command "${q}": ${K}`)), rS = await iE7() ? "osc52" : "none", !1
    }
}
// @from(Ln 199899, Col 0)
async function l0(A) {
    switch (await u39()) {
        case "osc52":
            return m39(A);
        case "native":
            if (i26) return F39(A, i26);
            return !1;
        case "none":
            return K1(Error("No clipboard method available")), !1
    }
}
// @from(Ln 199911, Col 0)
function xD1() {
    let A = eA();
    if (!!(process.env.SSH_CLIENT || process.env.SSH_TTY)) return "Failed to copy to clipboard. Over SSH, clipboard access requires a terminal that supports OSC52 (iTerm2, Kitty, Ghostty, WezTerm, Alacritty, etc.). If using tmux, ensure `set-clipboard` is enabled and `allow-passthrough` is on.";
    return {
        macos: "Failed to copy to clipboard. Make sure the `pbcopy` command is available on your system and try again.",
        windows: "Failed to copy to clipboard. Make sure the `clip` command is available on your system and try again.",
        wsl: "Failed to copy to clipboard. Make sure the `clip.exe` command is available in your WSL environment and try again.",
        linux: "Failed to copy to clipboard. Make sure `xclip` or `wl-copy` is installed on your system and try again.",
        unknown: "Failed to copy to clipboard. Make sure `xclip` or `wl-copy` is installed on your system and try again."
    } [A]
}
// @from(Ln 199922, Col 4)
x39
// @from(Ln 199922, Col 9)
rS = null
// @from(Ln 199923, Col 4)
i26 = null
// @from(Ln 199924, Col 4)
OB = v(() => {
    Bf();
    y6();
    x3();
    x39 = {
        macos: ["pbcopy"],
        linux: ["xclip -selection clipboard", "wl-copy"],
        wsl: ["clip.exe"],
        windows: ["clip"],
        unknown: ["xclip -selection clipboard", "wl-copy"]
    }
})
// @from(Ln 199947, Col 0)
function aE7() {
    return x8("tengu_snippet_save", !1) || J6(process.env.CLAUDE_CODE_SNIPPET_SAVE)
}
// @from(Ln 199951, Col 0)
function sE7(A) {
    g$A = A
}
// @from(Ln 199955, Col 0)
function p39(A) {
    let q = A.split(`
`)[0]?.trim() ?? "";
    if (!q) return "snippet";
    let K = [],
        Y = q.split(/\s+/);
    for (let w of Y) {
        if (K.length >= 3) break;
        if (w.startsWith("-")) continue;
        if (/^[A-Z_]+=/.test(w)) continue;
        if (w === "|" || w === ">" || w === ">>" || w === "<") break;
        if (w === ";" || w === "&&" || w === "||") break;
        let H = w.replace(/^["'`]+|["'`]+$/g, "");
        if (!H) continue;
        K.push(H)
    }
    if (K.length === 0) return "snippet";
    let z = K.join("-");
    if (z = z.replace(/[^a-zA-Z0-9._-]/g, "-"), z = z.replace(/-{2,}/g, "-"), z = z.replace(/^-+|-+$/g, ""), z.length > nE7) z = z.slice(0, nE7).replace(/-+$/, "");
    return z || "snippet"
}
// @from(Ln 199977, Col 0)
function tE7(A, q) {
    let K = p39(A),
        Y = K,
        z = 2;
    while (q.has(Y)) Y = `${K}-${z}`, z++;
    return q.add(Y), rE7(oE7, `${Y}.sh`)
}
// @from(Ln 199984, Col 0)
async function eE7() {
    if (g$A) c("tengu_snippet_copy", {}), await l0(g$A.code)
}
// @from(Ln 199987, Col 0)
async function Ak7(A, q) {
    try {
        await Q39(oE7, {
            recursive: !0
        }), await g39(A, q, "utf-8")
    } catch {}
}
// @from(Ln 199994, Col 4)
oE7
// @from(Ln 199994, Col 9)
nE7 = 40
// @from(Ln 199995, Col 4)
g$A = null
// @from(Ln 199996, Col 4)
n26 = v(() => {
    U4();
    OB();
    hA();
    u6();
    oE7 = rE7(U39(), "claude")
})
// @from(Ln 200004, Col 0)
function qk7(A, q) {
    switch (q) {
        case "bash":
            return `!${A}`;
        case "background":
            return `&${A}`;
        default:
            return A
    }
}
// @from(Ln 200015, Col 0)
function _B(A) {
    if (A.startsWith("!")) return "bash";
    if (A.startsWith("&")) return "background";
    return "prompt"
}
// @from(Ln 200021, Col 0)
function Jq1(A) {
    if (_B(A) === "prompt") return A;
    return A.slice(1)
}
// @from(Ln 200026, Col 0)
function Kk7(A) {
    return A === "!" || A === "&"
}
// @from(Ln 200030, Col 0)
function go(A) {
    return A.filter((q) => q.data?.type !== "hook_progress")
}
// @from(Ln 200034, Col 0)
function d39(A, q) {
    return A.name === q || (A.aliases?.includes(q) ?? !1)
}
// @from(Ln 200038, Col 0)
function Tv(A, q) {
    return A.find((K) => d39(K, q))
}
// @from(Ln 200041, Col 4)
QD = () => ({
    mode: "default",
    additionalWorkingDirectories: new Map,
    alwaysAllowRules: {},
    alwaysDenyRules: {},
    alwaysAskRules: {},
    isBypassPermissionsModeAvailable: !1
})
// @from(Ln 200050, Col 0)
function bD1(A) {
    let q = r26.useCallback((K) => {
        GO();
        let Y = C8();
        A(K, Y)
    }, [A]);
    r26.useEffect(() => zX.subscribe(q), [q])
}
// @from(Ln 200058, Col 4)
r26
// @from(Ln 200059, Col 4)
o26 = v(() => {
    IQ();
    p8();
    r26 = o(X1(), 1)
})
// @from(Ln 200065, Col 0)
function uD1(A) {
    let q = e(29),
        {
            isFocused: K,
            isSelected: Y,
            children: z,
            description: w,
            showScrollDown: H,
            showScrollUp: $,
            styled: O,
            disabled: _
        } = A,
        J = Y === void 0 ? !1 : Y,
        X = O === void 0 ? !0 : O,
        D = _ === void 0 ? !1 : _,
        j;
    if (q[0] !== D || q[1] !== K || q[2] !== H || q[3] !== $) j = function() {
        if (D) return rL.default.createElement(V, null, " ");
        if (K) return rL.default.createElement(V, {
            color: "suggestion"
        }, l1.pointer);
        if (H) return rL.default.createElement(V, {
            dimColor: !0
        }, l1.arrowDown);
        if ($) return rL.default.createElement(V, {
            dimColor: !0
        }, l1.arrowUp);
        return rL.default.createElement(V, null, " ")
    }, q[0] = D, q[1] = K, q[2] = H, q[3] = $, q[4] = j;
    else j = q[4];
    let M = j,
        P;
    if (q[5] !== D || q[6] !== K || q[7] !== J || q[8] !== X) P = function() {
        if (D) return "inactive";
        if (!X) return;
        if (J) return "success";
        if (K) return "suggestion"
    }(), q[5] = D, q[6] = K, q[7] = J, q[8] = X, q[9] = P;
    else P = q[9];
    let W = P,
        G;
    if (q[10] !== M) G = M(), q[10] = M, q[11] = G;
    else G = q[11];
    let f;
    if (q[12] !== z || q[13] !== D || q[14] !== X || q[15] !== W) f = X ? rL.default.createElement(V, {
        color: W,
        dimColor: D
    }, z) : z, q[12] = z, q[13] = D, q[14] = X, q[15] = W, q[16] = f;
    else f = q[16];
    let Z;
    if (q[17] !== D || q[18] !== J) Z = J && !D && rL.default.createElement(V, {
        color: "success"
    }, l1.tick), q[17] = D, q[18] = J, q[19] = Z;
    else Z = q[19];
    let N;
    if (q[20] !== G || q[21] !== f || q[22] !== Z) N = rL.default.createElement(I, {
        flexDirection: "row",
        gap: 1
    }, G, f, Z), q[20] = G, q[21] = f, q[22] = Z, q[23] = N;
    else N = q[23];
    let T;
    if (q[24] !== w) T = w && rL.default.createElement(I, {
        paddingLeft: 2
    }, rL.default.createElement(V, {
        color: "inactive"
    }, w)), q[24] = w, q[25] = T;
    else T = q[25];
    let k;
    if (q[26] !== T || q[27] !== N) k = rL.default.createElement(I, {
        flexDirection: "column"
    }, N, T), q[26] = T, q[27] = N, q[28] = k;
    else k = q[28];
    return k
}
// @from(Ln 200139, Col 4)
rL
// @from(Ln 200140, Col 4)
a26 = v(() => {
    i1();
    m1();
    b7();
    rL = o(X1(), 1)
})
// @from(Ln 200147, Col 0)
function Uo(A) {
    let q = e(7),
        {
            isFocused: K,
            isSelected: Y,
            children: z,
            description: w,
            shouldShowDownArrow: H,
            shouldShowUpArrow: $
        } = A,
        O;
    if (q[0] !== z || q[1] !== w || q[2] !== K || q[3] !== Y || q[4] !== H || q[5] !== $) O = Yk7.default.createElement(uD1, {
        isFocused: K,
        isSelected: Y,
        description: w,
        showScrollDown: H,
        showScrollUp: $,
        styled: !1
    }, z), q[0] = z, q[1] = w, q[2] = K, q[3] = Y, q[4] = H, q[5] = $, q[6] = O;
    else O = q[6];
    return O
}
// @from(Ln 200169, Col 4)
Yk7
// @from(Ln 200170, Col 4)
s26 = v(() => {
    i1();
    a26();
    Yk7 = o(X1(), 1)
})
// @from(Ln 200175, Col 4)
t26
// @from(Ln 200176, Col 4)
zk7 = v(() => {
    t26 = class t26 extends Map {
        first;
        last;
        constructor(A) {
            let q = [],
                K, Y, z, w = 0;
            for (let H of A) {
                let $ = {
                    label: H.label,
                    value: H.value,
                    description: H.description,
                    previous: z,
                    next: void 0,
                    index: w
                };
                if (z) z.next = $;
                K ||= $, Y = $, q.push([H.value, $]), w++, z = $
            }
            super(q);
            this.first = K, this.last = Y
        }
    }
})
// @from(Ln 200204, Col 0)
function e26({
    visibleOptionCount: A = 5,
    options: q,
    initialFocusValue: K,
    onFocus: Y,
    focusValue: z
}) {
    let [w, H] = yX.useReducer(l39, {
        visibleOptionCount: A,
        options: q,
        initialFocusValue: z || K
    }, wk7), $ = yX.useRef(Y);
    $.current = Y;
    let [O, _] = yX.useState(q);
    if (q !== O && !c39(q, O)) H({
        type: "reset",
        state: wk7({
            visibleOptionCount: A,
            options: q,
            initialFocusValue: z ?? w.focusedValue ?? K,
            currentViewport: {
                visibleFromIndex: w.visibleFromIndex,
                visibleToIndex: w.visibleToIndex
            }
        })
    }), _(q);
    let J = yX.useCallback(() => {
            H({
                type: "focus-next-option"
            })
        }, []),
        X = yX.useCallback(() => {
            H({
                type: "focus-previous-option"
            })
        }, []),
        D = yX.useCallback(() => {
            H({
                type: "focus-next-page"
            })
        }, []),
        j = yX.useCallback(() => {
            H({
                type: "focus-previous-page"
            })
        }, []),
        M = yX.useCallback((Z) => {
            if (Z !== void 0) H({
                type: "set-focus",
                value: Z
            })
        }, []),
        P = yX.useMemo(() => {
            return q.map((Z, N) => ({
                ...Z,
                index: N
            })).slice(w.visibleFromIndex, w.visibleToIndex)
        }, [q, w.visibleFromIndex, w.visibleToIndex]),
        W = yX.useMemo(() => {
            if (w.focusedValue === void 0) return;
            if (q.some((N) => N.value === w.focusedValue)) return w.focusedValue;
            return q[0]?.value
        }, [w.focusedValue, q]),
        G = yX.useMemo(() => {
            return q.find((N) => N.value === W)?.type === "input"
        }, [W, q]);
    yX.useEffect(() => {
        if (W !== void 0) $.current?.(W)
    }, [W]), yX.useEffect(() => {
        if (z !== void 0) H({
            type: "set-focus",
            value: z
        })
    }, [z]);
    let f = yX.useMemo(() => {
        if (W === void 0) return 0;
        let Z = q.findIndex((N) => N.value === W);
        return Z >= 0 ? Z + 1 : 0
    }, [W, q]);
    return {
        focusedValue: W,
        focusedIndex: f,
        visibleFromIndex: w.visibleFromIndex,
        visibleToIndex: w.visibleToIndex,
        visibleOptions: P,
        isInInput: G ?? !1,
        focusNextOption: J,
        focusPreviousOption: X,
        focusNextPage: D,
        focusPreviousPage: j,
        focusOption: M,
        options: q
    }
}
// @from(Ln 200298, Col 4)
yX
// @from(Ln 200298, Col 8)
l39 = (A, q) => {
        switch (q.type) {
            case "focus-next-option": {
                if (A.focusedValue === void 0) return A;
                let K = A.optionMap.get(A.focusedValue);
                if (!K) return A;
                let Y = K.next || A.optionMap.first;
                if (!Y) return A;
                if (!K.next && Y === A.optionMap.first) return {
                    ...A,
                    focusedValue: Y.value,
                    visibleFromIndex: 0,
                    visibleToIndex: A.visibleOptionCount
                };
                if (!(Y.index >= A.visibleToIndex)) return {
                    ...A,
                    focusedValue: Y.value
                };
                let w = Math.min(A.optionMap.size, A.visibleToIndex + 1),
                    H = w - A.visibleOptionCount;
                return {
                    ...A,
                    focusedValue: Y.value,
                    visibleFromIndex: H,
                    visibleToIndex: w
                }
            }
            case "focus-previous-option": {
                if (A.focusedValue === void 0) return A;
                let K = A.optionMap.get(A.focusedValue);
                if (!K) return A;
                let Y = K.previous || A.optionMap.last;
                if (!Y) return A;
                if (!K.previous && Y === A.optionMap.last) {
                    let $ = A.optionMap.size,
                        O = Math.max(0, $ - A.visibleOptionCount);
                    return {
                        ...A,
                        focusedValue: Y.value,
                        visibleFromIndex: O,
                        visibleToIndex: $
                    }
                }
                if (!(Y.index <= A.visibleFromIndex)) return {
                    ...A,
                    focusedValue: Y.value
                };
                let w = Math.max(0, A.visibleFromIndex - 1),
                    H = w + A.visibleOptionCount;
                return {
                    ...A,
                    focusedValue: Y.value,
                    visibleFromIndex: w,
                    visibleToIndex: H
                }
            }
            case "focus-next-page": {
                if (A.focusedValue === void 0) return A;
                let K = A.optionMap.get(A.focusedValue);
                if (!K) return A;
                let Y = Math.min(A.optionMap.size - 1, K.index + A.visibleOptionCount),
                    z = A.optionMap.first;
                while (z && z.index < Y)
                    if (z.next) z = z.next;
                    else break;
                if (!z) return A;
                let w = Math.min(A.optionMap.size, z.index + 1),
                    H = Math.max(0, w - A.visibleOptionCount);
                return {
                    ...A,
                    focusedValue: z.value,
                    visibleFromIndex: H,
                    visibleToIndex: w
                }
            }
            case "focus-previous-page": {
                if (A.focusedValue === void 0) return A;
                let K = A.optionMap.get(A.focusedValue);
                if (!K) return A;
                let Y = Math.max(0, K.index - A.visibleOptionCount),
                    z = A.optionMap.first;
                while (z && z.index < Y)
                    if (z.next) z = z.next;
                    else break;
                if (!z) return A;
                let w = Math.max(0, z.index),
                    H = Math.min(A.optionMap.size, w + A.visibleOptionCount);
                return {
                    ...A,
                    focusedValue: z.value,
                    visibleFromIndex: w,
                    visibleToIndex: H
                }
            }
            case "reset":
                return q.state;
            case "set-focus": {
                if (A.focusedValue === q.value) return A;
                let K = A.optionMap.get(q.value);
                if (!K) return A;
                if (K.index >= A.visibleFromIndex && K.index < A.visibleToIndex) return {
                    ...A,
                    focusedValue: q.value
                };
                let Y, z;
                if (K.index < A.visibleFromIndex) Y = K.index, z = Math.min(A.optionMap.size, Y + A.visibleOptionCount);
                else z = Math.min(A.optionMap.size, K.index + 1), Y = Math.max(0, z - A.visibleOptionCount);
                return {
                    ...A,
                    focusedValue: q.value,
                    visibleFromIndex: Y,
                    visibleToIndex: z
                }
            }
        }
    }
// @from(Ln 200414, Col 4)
wk7 = ({
        visibleOptionCount: A,
        options: q,
        initialFocusValue: K,
        currentViewport: Y
    }) => {
        let z = typeof A === "number" ? Math.min(A, q.length) : q.length,
            w = new t26(q),
            H = K !== void 0 && w.get(K),
            $ = H ? K : w.first?.value,
            O = 0,
            _ = z;
        if (H) {
            let J = H.index;
            if (Y)
                if (J >= Y.visibleFromIndex && J < Y.visibleToIndex) O = Y.visibleFromIndex, _ = Math.min(w.size, Y.visibleToIndex);
                else if (J < Y.visibleFromIndex) O = J, _ = Math.min(w.size, O + z);
            else _ = Math.min(w.size, J + 1), O = Math.max(0, _ - z);
            else if (J >= z) _ = Math.min(w.size, J + 1), O = Math.max(0, _ - z);
            O = Math.max(0, Math.min(O, w.size - 1)), _ = Math.min(w.size, Math.max(z, _))
        }
        return {
            optionMap: w,
            visibleOptionCount: z,
            focusedValue: $,
            visibleFromIndex: O,
            visibleToIndex: _
        }
    }
// @from(Ln 200443, Col 4)
U$A = v(() => {
    zk7();
    yX = o(X1(), 1)
})
// @from(Ln 200448, Col 0)
function Hk7({
    visibleOptionCount: A = 5,
    options: q,
    defaultValue: K,
    onChange: Y,
    onCancel: z,
    onFocus: w,
    focusValue: H
}) {
    let [$, O] = Aw6.useState(K), _ = e26({
        visibleOptionCount: A,
        options: q,
        initialFocusValue: void 0,
        onFocus: w,
        focusValue: H
    }), J = Aw6.useCallback(() => {
        O(_.focusedValue)
    }, [_.focusedValue]);
    return {
        ..._,
        value: $,
        selectFocusedOption: J,
        onChange: Y,
        onCancel: z
    }
}
// @from(Ln 200474, Col 4)
Aw6
// @from(Ln 200475, Col 4)
$k7 = v(() => {
    U$A();
    Aw6 = o(X1(), 1)
})
// @from(Ln 200480, Col 0)
function Ok7() {
    p$A.forEach((A) => A())
}
// @from(Ln 200484, Col 0)
function _k7(A) {
    return p$A.add(A), () => {
        p$A.delete(A)
    }
}
// @from(Ln 200490, Col 0)
function i39() {
    return qw6.size > 0
}
// @from(Ln 200494, Col 0)
function r39() {
    for (let A of qw6)
        if (!n39.has(A)) return !0;
    return !1
}
// @from(Ln 200500, Col 0)
function DZ(A, q) {
    let K = e(4),
        Y = q === void 0 ? !0 : q,
        z, w;
    if (K[0] !== Y || K[1] !== A) z = () => {
        if (!Y) return;
        return qw6.add(A), Ok7(), () => {
            qw6.delete(A), Ok7()
        }
    }, w = [A, Y], K[0] = Y, K[1] = A, K[2] = z, K[3] = w;
    else z = K[2], w = K[3];
    yx1.useEffect(z, w)
}
// @from(Ln 200514, Col 0)
function Jk7() {
    return yx1.useSyncExternalStore(_k7, i39)
}
// @from(Ln 200518, Col 0)
function BD1() {
    return yx1.useSyncExternalStore(_k7, r39)
}
// @from(Ln 200521, Col 4)
yx1
// @from(Ln 200521, Col 9)
qw6
// @from(Ln 200521, Col 14)
p$A
// @from(Ln 200521, Col 19)
n39
// @from(Ln 200522, Col 4)
oS = v(() => {
    i1();
    yx1 = o(X1(), 1), qw6 = new Set, p$A = new Set;
    n39 = new Set(["autocomplete"])
})
// @from(Ln 200528, Col 0)
function mD1(A) {
    return A.replace(/[０-９]/g, (q) => String.fromCharCode(q.charCodeAt(0) - 65248))
}
// @from(Ln 200532, Col 0)
function Kw6(A) {
    return A.replace(/\u3000/g, " ")
}
// @from(Ln 200536, Col 0)
function d$A(A, q = ",", K = Xk7) {
    let z = "";
    for (let w of A) {
        let H = z ? q : "",
            $ = H + w;
        if (z.length + $.length <= K) z += $;
        else {
            let O = K - z.length - H.length - 14;
            if (O > 0) z += H + w.slice(0, O) + "...[truncated]";
            else z += "...[truncated]";
            return z
        }
    }
    return z
}
// @from(Ln 200551, Col 0)
class FD1 {
    maxSize;
    content = "";
    isTruncated = !1;
    totalBytesReceived = 0;
    constructor(A = Xk7) {
        this.maxSize = A
    }
    append(A) {
        let q = typeof A === "string" ? A : A.toString();
        if (this.totalBytesReceived += q.length, this.isTruncated && this.content.length >= this.maxSize) return;
        if (this.content.length + q.length > this.maxSize) {
            let K = this.maxSize - this.content.length;
            if (K > 0) this.content += q.slice(0, K);
            this.isTruncated = !0
        } else this.content += q
    }
    toString() {
        if (!this.isTruncated) return this.content;
        let A = this.totalBytesReceived - this.maxSize,
            q = Math.round(A / 1024);
        return this.content + `
... [output truncated - ${q}KB removed]`
    }
    clear() {
        this.content = "", this.isTruncated = !1, this.totalBytesReceived = 0
    }
    get length() {
        return this.content.length
    }
    get truncated() {
        return this.isTruncated
    }
    get totalBytes() {
        return this.totalBytesReceived
    }
}
// @from(Ln 200589, Col 0)
function Dk7(A, q) {
    let K = A.split(`
`);
    if (K.length <= q) return A;
    return K.slice(0, q).join(`
`) + "…"
}
// @from(Ln 200596, Col 4)
Xk7 = 67108736
// @from(Ln 200597, Col 4)
c$A
// @from(Ln 200597, Col 9)
jk7 = ({
    isDisabled: A = !1,
    disableSelection: q = !1,
    state: K,
    options: Y,
    isMultiSelect: z = !1,
    onUpFromFirstItem: w,
    onDownFromLastItem: H,
    onInputModeToggle: $,
    inputValues: O,
    imagesSelected: _ = !1,
    onEnterImageSelection: J
}) => {
    DZ("select", !!K.onCancel);
    let X = c$A.useMemo(() => {
            return Y.find((M) => M.value === K.focusedValue)?.type === "input"
        }, [Y, K.focusedValue]),
        D = c$A.useMemo(() => {
            let j = {};
            if (!X) j["select:next"] = () => {
                if (H) {
                    let M = Y[Y.length - 1];
                    if (M && K.focusedValue === M.value) {
                        H();
                        return
                    }
                }
                K.focusNextOption()
            }, j["select:previous"] = () => {
                if (w && K.visibleFromIndex === 0) {
                    let M = Y[0];
                    if (M && K.focusedValue === M.value) {
                        w();
                        return
                    }
                }
                K.focusPreviousOption()
            }, j["select:accept"] = () => {
                if (q === !0) return;
                if (K.focusedValue === void 0) return;
                if (Y.find((P) => P.value === K.focusedValue)?.disabled === !0) return;
                K.selectFocusedOption?.(), K.onChange?.(K.focusedValue)
            };
            if (K.onCancel) j["select:cancel"] = () => {
                K.onCancel()
            };
            return j
        }, [Y, K, H, w, X, q]);
    c7(D, {
        context: "Select",
        isActive: !A
    }), D8((j, M, P) => {
        let W = mD1(j),
            G = Y.find((Z) => Z.value === K.focusedValue),
            f = G?.type === "input";
        if (M.tab && $ && K.focusedValue !== void 0) {
            $(K.focusedValue);
            return
        }
        if (f) {
            if (_) return;
            if (M.downArrow && J?.()) {
                P.stopImmediatePropagation();
                return
            }
            if (M.downArrow || M.ctrl && j === "n") {
                if (H) {
                    let Z = Y[Y.length - 1];
                    if (Z && K.focusedValue === Z.value) {
                        H(), P.stopImmediatePropagation();
                        return
                    }
                }
                K.focusNextOption(), P.stopImmediatePropagation();
                return
            }
            if (M.upArrow || M.ctrl && j === "p") {
                if (w && K.visibleFromIndex === 0) {
                    let Z = Y[0];
                    if (Z && K.focusedValue === Z.value) {
                        w(), P.stopImmediatePropagation();
                        return
                    }
                }
                K.focusPreviousOption(), P.stopImmediatePropagation();
                return
            }
            if (/^[0-9]$/.test(W) && G?.type === "input") {
                if ((O?.get(K.focusedValue) ?? "").trim()) return
            } else return
        }
        if (M.pageDown) K.focusNextPage();
        if (M.pageUp) K.focusPreviousPage();
        if (q !== !0) {
            if (z && Kw6(j) === " " && K.focusedValue !== void 0) {
                if (G?.disabled !== !0) K.selectFocusedOption?.(), K.onChange?.(K.focusedValue)
            }
            if (q !== "numeric" && /^[0-9]+$/.test(W)) {
                let Z = parseInt(W) - 1;
                if (Z >= 0 && Z < K.options.length) {
                    let N = K.options[Z];
                    if (N.disabled === !0) return;
                    if (N.type === "input") {
                        let T = O?.get(N.value) ?? "";
                        if (N.allowEmptySubmitToCancel && !T.trim()) {
                            K.onChange?.(N.value);
                            return
                        }
                        K.focusOption(N.value);
                        return
                    }
                    K.onChange?.(N.value);
                    return
                }
            }
        }
    }, {
        isActive: !A
    })
}
// @from(Ln 200717, Col 4)
Mk7 = v(() => {
    m1();
    oS();
    K7();
    c$A = o(X1(), 1)
})
// @from(Ln 200733, Col 0)
function e39() {
    let A = process.platform,
        q = {
            darwin: "No image found in clipboard. Use Cmd + Ctrl + Shift + 4 to copy a screenshot to clipboard.",
            win32: "No image found in clipboard. Use Print Screen to copy a screenshot to clipboard.",
            linux: "No image found in clipboard. Use appropriate screenshot tool to copy a screenshot to clipboard."
        };
    return q[A] || q.linux
}
// @from(Ln 200743, Col 0)
function Pk7() {
    let A = process.platform,
        q = process.env.CLAUDE_CODE_TMPDIR || (A === "win32" ? process.env.TEMP || "C:\\Temp" : "/tmp"),
        K = "claude_cli_latest_screenshot.png",
        Y = {
            darwin: l$A(q, "claude_cli_latest_screenshot.png"),
            linux: l$A(q, "claude_cli_latest_screenshot.png"),
            win32: l$A(q, "claude_cli_latest_screenshot.png")
        },
        z = Y[A] || Y.linux,
        w = {
            darwin: {
                checkImage: "osascript -e 'the clipboard as «class PNGf»'",
                saveImage: `osascript -e 'set png_data to (the clipboard as «class PNGf»)' -e 'set fp to open for access POSIX file "${z}" with write permission' -e 'write png_data to fp' -e 'close access fp'`,
                getPath: "osascript -e 'get POSIX path of (the clipboard as «class furl»)'",
                deleteFile: `rm -f "${z}"`
            },
            linux: {
                checkImage: 'xclip -selection clipboard -t TARGETS -o 2>/dev/null | grep -E "image/(png|jpeg|jpg|gif|webp)" || wl-paste -l 2>/dev/null | grep -E "image/(png|jpeg|jpg|gif|webp)"',
                saveImage: `xclip -selection clipboard -t image/png -o > "${z}" 2>/dev/null || wl-paste --type image/png > "${z}"`,
                getPath: "xclip -selection clipboard -t text/plain -o 2>/dev/null || wl-paste 2>/dev/null",
                deleteFile: `rm -f "${z}"`
            },
            win32: {
                checkImage: 'powershell -NoProfile -Command "(Get-Clipboard -Format Image) -ne $null"',
                saveImage: `powershell -NoProfile -Command "$img = Get-Clipboard -Format Image; if ($img) { $img.Save('${z.replace(/\\/g,"\\\\")}', [System.Drawing.Imaging.ImageFormat]::Png) }"`,
                getPath: 'powershell -NoProfile -Command "Get-Clipboard"',
                deleteFile: `del /f "${z}"`
            }
        };
    return {
        commands: w[A] || w.linux,
        screenshotPath: z
    }
}
// @from(Ln 200778, Col 0)
async function Wk7() {
    if (process.platform !== "darwin") return !1;
    return (await d4("osascript", ["-e", "the clipboard as «class PNGf»"])).code === 0
}
// @from(Ln 200782, Col 0)
async function QD1() {
    let {
        commands: A,
        screenshotPath: q
    } = Pk7();
    try {
        if ((await XY(A.checkImage, {
                shell: !0,
                reject: !1
            })).exitCode !== 0) return null;
        if ((await XY(A.saveImage, {
                shell: !0,
                reject: !1
            })).exitCode !== 0) return null;
        let z = b1().readFileBytesSync(q),
            w = await eu(z, z.length, "png"),
            H = w.buffer.toString("base64"),
            $ = sHA(H);
        return XY(A.deleteFile, {
            shell: !0,
            reject: !1
        }), {
            base64: H,
            mediaType: $,
            dimensions: w.dimensions
        }
    } catch {
        return null
    }
}
// @from(Ln 200812, Col 0)
async function A59() {
    let {
        commands: A
    } = Pk7();
    try {
        let q = await XY(A.getPath, {
            shell: !0,
            reject: !1
        });
        if (q.exitCode !== 0 || !q.stdout) return null;
        return q.stdout.trim()
    } catch (q) {
        return K1(q), null
    }
}
// @from(Ln 200828, Col 0)
function Zk7(A) {
    if (A.startsWith('"') && A.endsWith('"') || A.startsWith("'") && A.endsWith("'")) return A.slice(1, -1);
    return A
}
// @from(Ln 200833, Col 0)
function fk7(A) {
    if (process.platform === "win32") return A;
    let Y = `__DOUBLE_BACKSLASH_${o39(8).toString("hex")}__`;
    return A.replace(/\\\\/g, Y).replace(/\\(.)/g, "$1").replace(new RegExp(Y, "g"), "\\")
}
// @from(Ln 200839, Col 0)
function zw6(A) {
    let q = Zk7(A.trim()),
        K = fk7(q);
    return Gk7.test(K)
}
// @from(Ln 200845, Col 0)
function q59(A) {
    let q = Zk7(A.trim()),
        K = fk7(q);
    if (Gk7.test(K)) return K;
    return null
}
// @from(Ln 200851, Col 0)
async function Vk7(A) {
    let q = q59(A);
    if (!q) return null;
    let K = q,
        Y;
    try {
        if (t39(K)) Y = b1().readFileBytesSync(K);
        else {
            let O = await A59();
            if (O && K === a39(O)) Y = b1().readFileBytesSync(O)
        }
    } catch (O) {
        return K1(O), null
    }
    if (!Y) return null;
    let z = s39(K).slice(1).toLowerCase() || "png",
        w = await eu(Y, Y.length, z),
        H = w.buffer.toString("base64"),
        $ = sHA(H);
    return {
        path: K,
        base64: H,
        mediaType: $,
        dimensions: w.dimensions
    }
}
// @from(Ln 200877, Col 4)
i1w
// @from(Ln 200877, Col 9)
Yw6 = 800
// @from(Ln 200878, Col 4)
Gk7
// @from(Ln 200879, Col 4)
Cx1 = v(() => {
    tq();
    Bf();
    _8();
    y6();
    dL();
    i1w = e39();
    Gk7 = /\.(png|jpe?g|gif|webp)$/i
})
// @from(Ln 200893, Col 0)
function Tk7() {
    return ww6(O8(), Nk7, U6())
}
// @from(Ln 200897, Col 0)
function vk7(A, q) {
    if (A.existsSync(q)) return;
    let K = K59(q);
    if (K !== q) vk7(A, K);
    A.mkdirSync(q)
}
// @from(Ln 200904, Col 0)
function Y59() {
    let A = b1(),
        q = Tk7();
    vk7(A, q)
}
// @from(Ln 200910, Col 0)
function Ek7(A, q) {
    let K = q.split("/")[1] || "png";
    return ww6(Tk7(), `${A}.${K}`)
}
// @from(Ln 200915, Col 0)
function gD1(A) {
    if (A.type !== "image") return null;
    let q = Ek7(A.id, A.mediaType || "image/png");
    return i$A.set(A.id, q), q
}
// @from(Ln 200921, Col 0)
function Xq1(A) {
    if (A.type !== "image") return null;
    try {
        Y59();
        let q = Ek7(A.id, A.mediaType || "image/png");
        return c8(q, A.content, {
            encoding: "base64",
            flush: !0,
            mode: 384
        }), i$A.set(A.id, q), h(`Stored image ${A.id} to ${q}`), q
    } catch (q) {
        return h(`Failed to store image: ${q}`), null
    }
}
// @from(Ln 200936, Col 0)
function kk7(A) {
    let q = new Map;
    for (let [K, Y] of Object.entries(A))
        if (Y.type === "image") {
            let z = Xq1(Y);
            if (z) q.set(Number(K), z)
        } return q
}
// @from(Ln 200945, Col 0)
function Hw6(A) {
    return i$A.get(A) ?? null
}
// @from(Ln 200948, Col 0)
async function Lk7() {
    let A = b1(),
        q = ww6(O8(), Nk7),
        K = U6();
    try {
        let Y;
        try {
            Y = await A.readdir(q)
        } catch {
            return
        }
        for (let z of Y) {
            if (z.name === K) continue;
            let w = ww6(q, z.name);
            try {
                await A.rm(w, {
                    recursive: !0,
                    force: !0
                }), h(`Cleaned up old image cache: ${w}`)
            } catch {}
        }
        try {
            if ((await A.readdir(q)).length === 0) await A.rmdir(q)
        } catch {}
    } catch {}
}
// @from(Ln 200974, Col 4)
Nk7 = "image-cache"
// @from(Ln 200975, Col 4)
i$A
// @from(Ln 200976, Col 4)
po = v(() => {
    hA();
    B6();
    _8();
    Z6();
    m6();
    i$A = new Map
})
// @from(Ln 200988, Col 0)
function $w6(A) {
    let q = e(13),
        {
            imageId: K,
            backgroundColor: Y,
            isSelected: z
        } = A,
        w = z === void 0 ? !1 : z,
        H = Hw6(K),
        $ = `[Image #${K}]`;
    if (H && Vv()) {
        let _ = z59(H).href,
            J, X;
        if (q[0] !== Y || q[1] !== $ || q[2] !== w) J = aU.createElement(V, {
            backgroundColor: Y,
            inverse: w
        }, $), X = aU.createElement(V, {
            backgroundColor: Y,
            inverse: w,
            bold: w
        }, $), q[0] = Y, q[1] = $, q[2] = w, q[3] = J, q[4] = X;
        else J = q[3], X = q[4];
        let D;
        if (q[5] !== _ || q[6] !== J || q[7] !== X) D = aU.createElement(d7, {
            url: _,
            fallback: J
        }, X), q[5] = _, q[6] = J, q[7] = X, q[8] = D;
        else D = q[8];
        return D
    }
    let O;
    if (q[9] !== Y || q[10] !== $ || q[11] !== w) O = aU.createElement(V, {
        backgroundColor: Y,
        inverse: w
    }, $), q[9] = Y, q[10] = $, q[11] = w, q[12] = O;
    else O = q[12];
    return O
}
// @from(Ln 201026, Col 4)
aU
// @from(Ln 201027, Col 4)
n$A = v(() => {
    i1();
    m1();
    VD1();
    po();
    xo();
    aU = o(X1(), 1)
})
// @from(Ln 201036, Col 0)
function YA(A) {
    let q = e(9),
        {
            shortcut: K,
            action: Y,
            parens: z,
            bold: w
        } = A,
        H = z === void 0 ? !1 : z,
        $ = w === void 0 ? !1 : w,
        O;
    if (q[0] !== $ || q[1] !== K) O = $ ? Ow6.default.createElement(E_, {
        bold: !0
    }, K) : K, q[0] = $, q[1] = K, q[2] = O;
    else O = q[2];
    let _ = O;
    if (H) {
        let X;
        if (q[3] !== Y || q[4] !== _) X = Ow6.default.createElement(E_, null, "(", _, " to ", Y, ")"), q[3] = Y, q[4] = _, q[5] = X;
        else X = q[5];
        return X
    }
    let J;
    if (q[6] !== Y || q[7] !== _) J = Ow6.default.createElement(E_, null, _, " to ", Y), q[6] = Y, q[7] = _, q[8] = J;
    else J = q[8];
    return J
}
// @from(Ln 201063, Col 4)
Ow6
// @from(Ln 201064, Col 4)
wK = v(() => {
    i1();
    PJ1();
    Ow6 = o(X1(), 1)
})
// @from(Ln 201070, Col 0)
function NA(A) {
    let q = e(5),
        {
            action: K,
            context: Y,
            fallback: z,
            description: w,
            parens: H,
            bold: $
        } = A,
        O = RK(K, Y, z),
        _;
    if (q[0] !== $ || q[1] !== w || q[2] !== H || q[3] !== O) _ = r$A.createElement(YA, {
        shortcut: O,
        action: w,
        parens: H,
        bold: $
    }), q[0] = $, q[1] = w, q[2] = H, q[3] = O, q[4] = _;
    else _ = q[4];
    return _
}
// @from(Ln 201091, Col 4)
r$A
// @from(Ln 201092, Col 4)
BK = v(() => {
    i1();
    wK();
    s2();
    r$A = o(X1(), 1)
})
// @from(Ln 201099, Col 0)
function oA(A) {
    let q = e(5),
        {
            children: K
        } = A,
        Y, z;
    if (q[0] !== K) {
        z = Symbol.for("react.early_return_sentinel");
        A: {
            let H = JB.Children.toArray(K);
            if (H.length === 0) {
                z = null;
                break A
            }
            Y = H.map(w59)
        }
        q[0] = K, q[1] = Y, q[2] = z
    } else Y = q[1], z = q[2];
    if (z !== Symbol.for("react.early_return_sentinel")) return z;
    let w;
    if (q[3] !== Y) w = JB.default.createElement(JB.default.Fragment, null, Y), q[3] = Y, q[4] = w;
    else w = q[4];
    return w
}
// @from(Ln 201124, Col 0)
function w59(A, q) {
    return JB.default.createElement(JB.default.Fragment, {
        key: JB.isValidElement(A) ? A.key ?? q : q
    }, q > 0 && JB.default.createElement(V, {
        dimColor: !0
    }, " · "), A)
}
// @from(Ln 201131, Col 4)
JB
// @from(Ln 201132, Col 4)
HK = v(() => {
    i1();
    m1();
    JB = o(X1(), 1)
})
// @from(Ln 201138, Col 0)
function UD1(A) {
    let q = e(100),
        {
            option: K,
            isFocused: Y,
            isSelected: z,
            shouldShowDownArrow: w,
            shouldShowUpArrow: H,
            maxIndexWidth: $,
            index: O,
            inputValue: _,
            onInputChange: J,
            onSubmit: X,
            onExit: D,
            layout: j,
            children: M,
            showLabel: P,
            onOpenEditor: W,
            resetCursorOnUpdate: G,
            onImagePaste: f,
            pastedContents: Z,
            onRemoveImage: N,
            imagesSelected: T,
            selectedImageIndex: k,
            onImagesSelectedChange: y,
            onSelectedImageIndexChange: B
        } = A,
        S = P === void 0 ? !1 : P,
        m = G === void 0 ? !1 : G,
        b = k === void 0 ? 0 : k,
        g;
    if (q[0] !== Z) g = Z ? Object.values(Z).filter(H59) : [], q[0] = Z, q[1] = g;
    else g = q[1];
    let U = g,
        x = S || K.showLabelWithValue === !0,
        [p, l] = yY.useState(_.length),
        r;
    if (q[2] !== _.length || q[3] !== Y || q[4] !== m) r = () => {
        if (m && Y) l(_.length)
    }, q[2] = _.length, q[3] = Y, q[4] = m, q[5] = r;
    else r = q[5];
    let s;
    if (q[6] !== _ || q[7] !== Y || q[8] !== m) s = [m, Y, _], q[6] = _, q[7] = Y, q[8] = m, q[9] = s;
    else s = q[9];
    yY.useEffect(r, s);
    let O1;
    if (q[10] !== _ || q[11] !== J || q[12] !== W) O1 = () => {
        W?.(_, J)
    }, q[10] = _, q[11] = J, q[12] = W, q[13] = O1;
    else O1 = q[13];
    let T1 = Y && !!W,
        N1;
    if (q[14] !== T1) N1 = {
        context: "Chat",
        isActive: T1
    }, q[14] = T1, q[15] = N1;
    else N1 = q[15];
    DA("chat:externalEditor", O1, N1);
    let j1;
    if (q[16] !== f) j1 = () => {
        if (!f) return;
        QD1().then((M6) => {
            if (M6) f(M6.base64, M6.mediaType, void 0, M6.dimensions)
        })
    }, q[16] = f, q[17] = j1;
    else j1 = q[17];
    let q1 = Y && !!f,
        t;
    if (q[18] !== q1) t = {
        context: "Chat",
        isActive: q1
    }, q[18] = q1, q[19] = t;
    else t = q[19];
    DA("chat:imagePaste", j1, t);
    let J1;
    if (q[20] !== U || q[21] !== N) J1 = () => {
        if (U.length > 0 && N) N(U[U.length - 1].id)
    }, q[20] = U, q[21] = N, q[22] = J1;
    else J1 = q[22];
    let D1 = Y && !T && _ === "" && U.length > 0 && !!N,
        Z1;
    if (q[23] !== D1) Z1 = {
        context: "Attachments",
        isActive: D1
    }, q[23] = D1, q[24] = Z1;
    else Z1 = q[24];
    DA("attachments:remove", J1, Z1);
    let E1, a;
    if (q[25] !== U.length || q[26] !== B || q[27] !== b) E1 = () => {
        if (U.length > 1) B?.((b + 1) % U.length)
    }, a = () => {
        if (U.length > 1) B?.((b - 1 + U.length) % U.length)
    }, q[25] = U.length, q[26] = B, q[27] = b, q[28] = E1, q[29] = a;
    else E1 = q[28], a = q[29];
    let A1;
    if (q[30] !== U || q[31] !== y || q[32] !== N || q[33] !== B || q[34] !== b) A1 = () => {
        let M6 = U[b];
        if (M6 && N)
            if (N(M6.id), U.length <= 1) y?.(!1);
            else B?.(Math.min(b, U.length - 2))
    }, q[30] = U, q[31] = y, q[32] = N, q[33] = B, q[34] = b, q[35] = A1;
    else A1 = q[35];
    let M1;
    if (q[36] !== y) M1 = () => {
        y?.(!1)
    }, q[36] = y, q[37] = M1;
    else M1 = q[37];
    let z1;
    if (q[38] !== E1 || q[39] !== a || q[40] !== A1 || q[41] !== M1) z1 = {
        "attachments:next": E1,
        "attachments:previous": a,
        "attachments:remove": A1,
        "attachments:exit": M1
    }, q[38] = E1, q[39] = a, q[40] = A1, q[41] = M1, q[42] = z1;
    else z1 = q[42];
    let Y1 = Y && !!T,
        _1;
    if (q[43] !== Y1) _1 = {
        context: "Attachments",
        isActive: Y1
    }, q[43] = Y1, q[44] = _1;
    else _1 = q[44];
    c7(z1, _1);
    let $1;
    if (q[45] !== y) $1 = (M6, N6) => {
        if (N6.upArrow) y?.(!1)
    }, q[45] = y, q[46] = $1;
    else $1 = q[46];
    let G1 = Y && !!T,
        L1;
    if (q[47] !== G1) L1 = {
        isActive: G1
    }, q[47] = G1, q[48] = L1;
    else L1 = q[48];
    D8($1, L1);
    let x1, f1;
    if (q[49] !== T || q[50] !== Y || q[51] !== y) x1 = () => {
        if (!Y && T) y?.(!1)
    }, f1 = [Y, T, y], q[49] = T, q[50] = Y, q[51] = y, q[52] = x1, q[53] = f1;
    else x1 = q[52], f1 = q[53];
    yY.useEffect(x1, f1);
    let R1 = j === "expanded" ? $ + 3 : $ + 4,
        H1 = j === "compact" ? 0 : void 0,
        y1 = `${O}.`,
        B1;
    if (q[54] !== $ || q[55] !== y1) B1 = y1.padEnd($ + 2), q[54] = $, q[55] = y1, q[56] = B1;
    else B1 = q[56];
    let A6;
    if (q[57] !== B1) A6 = yY.default.createElement(V, {
        dimColor: !0
    }, B1), q[57] = B1, q[58] = A6;
    else A6 = q[58];
    let O6;
    if (q[59] !== p || q[60] !== T || q[61] !== _ || q[62] !== Y || q[63] !== D || q[64] !== f || q[65] !== J || q[66] !== X || q[67] !== K || q[68] !== x) O6 = x ? yY.default.createElement(yY.default.Fragment, null, yY.default.createElement(V, {
        color: Y ? "suggestion" : void 0
    }, K.label), Y ? yY.default.createElement(yY.default.Fragment, null, yY.default.createElement(V, {
        color: "suggestion"
    }, K.labelValueSeparator ?? ", "), yY.default.createElement(k3, {
        value: _,
        onChange: (M6) => {
            J(M6), K.onChange(M6)
        },
        onSubmit: X,
        onExit: D,
        placeholder: K.placeholder,
        focus: !T,
        showCursor: !0,
        cursorOffset: p,
        onChangeCursorOffset: l,
        columns: 80,
        onImagePaste: f,
        onPaste: (M6) => {
            let N6 = _.slice(0, p),
                F6 = _.slice(p),
                P1 = N6 + M6 + F6;
            J(P1), K.onChange(P1), l(N6.length + M6.length)
        }
    })) : _ && yY.default.createElement(V, null, K.labelValueSeparator ?? ", ", _)) : Y ? yY.default.createElement(k3, {
        value: _,
        onChange: (M6) => {
            J(M6), K.onChange(M6)
        },
        onSubmit: X,
        onExit: D,
        placeholder: K.placeholder || (typeof K.label === "string" ? K.label : void 0),
        focus: !T,
        showCursor: !0,
        cursorOffset: p,
        onChangeCursorOffset: l,
        columns: 80,
        onImagePaste: f,
        onPaste: (M6) => {
            let N6 = _.slice(0, p),
                F6 = _.slice(p),
                P1 = N6 + M6 + F6;
            J(P1), K.onChange(P1), l(N6.length + M6.length)
        }
    }) : yY.default.createElement(V, {
        color: _ ? void 0 : "inactive"
    }, _ || K.placeholder || K.label), q[59] = p, q[60] = T, q[61] = _, q[62] = Y, q[63] = D, q[64] = f, q[65] = J, q[66] = X, q[67] = K, q[68] = x, q[69] = O6;
    else O6 = q[69];
    let P6;
    if (q[70] !== M || q[71] !== H1 || q[72] !== A6 || q[73] !== O6) P6 = yY.default.createElement(I, {
        flexDirection: "row",
        flexShrink: H1
    }, A6, M, O6), q[70] = M, q[71] = H1, q[72] = A6, q[73] = O6, q[74] = P6;
    else P6 = q[74];
    let V6;
    if (q[75] !== Y || q[76] !== z || q[77] !== w || q[78] !== H || q[79] !== P6) V6 = yY.default.createElement(Uo, {
        isFocused: Y,
        isSelected: z,
        shouldShowDownArrow: w,
        shouldShowUpArrow: H
    }, P6), q[75] = Y, q[76] = z, q[77] = w, q[78] = H, q[79] = P6, q[80] = V6;
    else V6 = q[80];
    let q6;
    if (q[81] !== R1 || q[82] !== Y || q[83] !== z || q[84] !== K.description || q[85] !== K.dimDescription) q6 = K.description && yY.default.createElement(I, {
        paddingLeft: R1
    }, yY.default.createElement(V, {
        dimColor: K.dimDescription !== !1,
        color: z ? "success" : Y ? "suggestion" : void 0
    }, K.description)), q[81] = R1, q[82] = Y, q[83] = z, q[84] = K.description, q[85] = K.dimDescription, q[86] = q6;
    else q6 = q[86];
    let p1;
    if (q[87] !== R1 || q[88] !== U || q[89] !== T || q[90] !== Y || q[91] !== b) p1 = U.length > 0 && yY.default.createElement(I, {
        flexDirection: "row",
        gap: 1,
        paddingLeft: R1
    }, U.map((M6, N6) => yY.default.createElement($w6, {
        key: M6.id,
        imageId: M6.id,
        isSelected: !!T && N6 === b
    })), yY.default.createElement(I, {
        flexGrow: 1,
        justifyContent: "flex-start",
        flexDirection: "row"
    }, yY.default.createElement(V, {
        dimColor: !0
    }, T ? yY.default.createElement(oA, null, U.length > 1 && yY.default.createElement(yY.default.Fragment, null, yY.default.createElement(NA, {
        action: "attachments:next",
        context: "Attachments",
        fallback: "→",
        description: "next"
    }), yY.default.createElement(NA, {
        action: "attachments:previous",
        context: "Attachments",
        fallback: "←",
        description: "prev"
    })), yY.default.createElement(NA, {
        action: "attachments:remove",
        context: "Attachments",
        fallback: "backspace",
        description: "remove"
    }), yY.default.createElement(NA, {
        action: "attachments:exit",
        context: "Attachments",
        fallback: "esc",
        description: "cancel"
    })) : Y ? "(↓ to select)" : null))), q[87] = R1, q[88] = U, q[89] = T, q[90] = Y, q[91] = b, q[92] = p1;
    else p1 = q[92];
    let K6;
    if (q[93] !== j) K6 = j === "expanded" && yY.default.createElement(V, null, " "), q[93] = j, q[94] = K6;
    else K6 = q[94];
    let j6;
    if (q[95] !== V6 || q[96] !== q6 || q[97] !== p1 || q[98] !== K6) j6 = yY.default.createElement(I, {
        flexDirection: "column",
        flexShrink: 0
    }, V6, q6, p1, K6), q[95] = V6, q[96] = q6, q[97] = p1, q[98] = K6, q[99] = j6;
    else j6 = q[99];
    return j6
}
// @from(Ln 201410, Col 0)
function H59(A) {
    return A.type === "image"
}
// @from(Ln 201413, Col 4)
yY
// @from(Ln 201414, Col 4)
o$A = v(() => {
    i1();
    m1();
    s26();
    gO();
    K7();
    Cx1();
    n$A();
    BK();
    HK();
    yY = o(X1(), 1)
})
// @from(Ln 201427, Col 0)
function _w6(A) {
    if (typeof A === "string") return A;
    if (typeof A === "number") return String(A);
    if (!A) return "";
    if (Array.isArray(A)) return A.map(_w6).join("");
    if (p4.default.isValidElement(A)) return _w6(A.props.children);
    return ""
}