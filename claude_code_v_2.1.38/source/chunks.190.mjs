
// @from(Ln 492141, Col 0)
function eGz(A) {
    if (typeof A !== "object" || A === null) return {};
    let q = A,
        K = q.teammateMode;
    return {
        agentId: typeof q.agentId === "string" ? q.agentId : void 0,
        agentName: typeof q.agentName === "string" ? q.agentName : void 0,
        teamName: typeof q.teamName === "string" ? q.teamName : void 0,
        agentColor: typeof q.agentColor === "string" ? q.agentColor : void 0,
        planModeRequired: typeof q.planModeRequired === "boolean" ? q.planModeRequired : void 0,
        parentSessionId: typeof q.parentSessionId === "string" ? q.parentSessionId : void 0,
        teammateMode: K === "auto" || K === "tmux" || K === "in-process" ? K : void 0,
        agentType: typeof q.agentType === "string" ? q.agentType : void 0
    }
}
// @from(Ln 492156, Col 4)
wO
// @from(Ln 492156, Col 8)
mRq = () => (Cz(), ay(d7A))
// @from(Ln 492157, Col 4)
CGz = () => ay(Sb4)
// @from(Ln 492158, Col 4)
SGz = () => (KW1(), ay(jEA))
// @from(Ln 492159, Col 4)
hGz = null
// @from(Ln 492160, Col 4)
pRq = v(() => {
    Fl();
    nS();
    lC1();
    N8();
    m6();
    v3();
    YDq();
    U4();
    Hc1();
    IQ();
    rT6();
    JDq();
    yFA();
    q3();
    rn1();
    Uz();
    TR();
    k26();
    oFA();
    TM1();
    Pc();
    uq6();
    mV();
    Om1();
    $P();
    nB();
    S9();
    J7();
    $R1();
    cA();
    NB1();
    OJ();
    x3();
    Hm1();
    Oa();
    m6();
    aFA();
    hZ();
    nu();
    y6();
    lq();
    sFA();
    cIA();
    ZDq();
    qd();
    dD();
    tFA();
    e7();
    Dp1();
    p8();
    c$();
    uv();
    hA();
    B6();
    G51();
    eFA();
    G2();
    r91();
    lp1();
    h9();
    AH();
    tR();
    mM();
    lq();
    AQA();
    Sh();
    U4();
    u6();
    YQA();
    IDq();
    bDq();
    FDq();
    v71();
    SW();
    cDq();
    we();
    nW1();
    OQA();
    oj();
    qp();
    ix();
    Rt();
    vw();
    oDq();
    sDq();
    yN6();
    xCA();
    nW();
    XQA();
    at();
    kI();
    Tz();
    Mq1();
    N7();
    Z6();
    qH();
    _8();
    w$();
    Jc1();
    E$();
    VI();
    B6();
    Y0q();
    w0q();
    D0q();
    V0q();
    qc1();
    N0q();
    Tj();
    v0q();
    k0q();
    L0q();
    y0q();
    S0q();
    NQA();
    Ot();
    mG1();
    d8();
    Av6();
    Wk();
    f0();
    WQA();
    VJ();
    uZ1();
    k2();
    Im();
    UR();
    tD1();
    pB();
    _71();
    Et();
    wO = o(X1(), 1);
    EK("main_tsx_entry");
    EK("main_tsx_imports_loaded");
    if (BGz()) process.exit(1)
})
// @from(Ln 492302, Col 0)
async function qZz() {
    let A = process.argv.slice(2);
    if (A.length === 1 && (A[0] === "--version" || A[0] === "-v" || A[0] === "-V")) {
        console.log(`${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.38",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-02-10T00:04:56Z"}.VERSION} (Claude Code)`);
        return
    }
    let {
        profileCheckpoint: q
    } = await Promise.resolve().then(() => (Fl(), XiA));
    if (q("cli_entry"), A[0] === "--mcp-cli") {
        let {
            isMcpCliEnabled: w
        } = await Promise.resolve().then(() => (Tj(), $Xq));
        if (w()) {
            let H = A.slice(1),
                {
                    mcpCliMain: $
                } = await Promise.resolve().then(() => (mXq(), BXq));
            process.exit(await $(H))
        }
    }
    if (A[0] === "--ripgrep") {
        q("cli_ripgrep_path");
        let w = A.slice(1),
            {
                ripgrepMain: H
            } = await Promise.resolve().then(() => (QXq(), FXq));
        process.exitCode = H(w);
        return
    }
    if (process.argv[2] === "--claude-in-chrome-mcp") {
        q("cli_claude_in_chrome_mcp_path");
        let {
            runClaudeInChromeMcpServer: w
        } = await Promise.resolve().then(() => (dXq(), pXq));
        await w();
        return
    } else if (process.argv[2] === "--chrome-native-host") {
        q("cli_chrome_native_host_path");
        let {
            runChromeNativeHost: w
        } = await Promise.resolve().then(() => (aXq(), oXq));
        await w();
        return
    }
    let K = A.includes("--tmux") || A.includes("--tmux=classic");
    if (A.length === 1 && (A[0] === "--update" || A[0] === "--upgrade")) process.argv = [process.argv[0], process.argv[1], "update"];
    let {
        startCapturingEarlyInput: Y
    } = await Promise.resolve().then(() => (lC1(), T77));
    Y(), q("cli_before_main_import");
    let {
        main: z
    } = await Promise.resolve().then(() => (pRq(), URq));
    q("cli_after_main_import"), await z(), q("cli_after_main_complete")
}