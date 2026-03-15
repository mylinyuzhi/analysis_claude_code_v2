
// @from(Ln 30811, Col 4)
c_A = E(() => {
    d_A = [{
        name: "SIGHUP",
        number: 1,
        action: "terminate",
        description: "Terminal closed",
        standard: "posix"
    }, {
        name: "SIGINT",
        number: 2,
        action: "terminate",
        description: "User interruption with CTRL-C",
        standard: "ansi"
    }, {
        name: "SIGQUIT",
        number: 3,
        action: "core",
        description: "User interruption with CTRL-\\",
        standard: "posix"
    }, {
        name: "SIGILL",
        number: 4,
        action: "core",
        description: "Invalid machine instruction",
        standard: "ansi"
    }, {
        name: "SIGTRAP",
        number: 5,
        action: "core",
        description: "Debugger breakpoint",
        standard: "posix"
    }, {
        name: "SIGABRT",
        number: 6,
        action: "core",
        description: "Aborted",
        standard: "ansi"
    }, {
        name: "SIGIOT",
        number: 6,
        action: "core",
        description: "Aborted",
        standard: "bsd"
    }, {
        name: "SIGBUS",
        number: 7,
        action: "core",
        description: "Bus error due to misaligned, non-existing address or paging error",
        standard: "bsd"
    }, {
        name: "SIGEMT",
        number: 7,
        action: "terminate",
        description: "Command should be emulated but is not implemented",
        standard: "other"
    }, {
        name: "SIGFPE",
        number: 8,
        action: "core",
        description: "Floating point arithmetic error",
        standard: "ansi"
    }, {
        name: "SIGKILL",
        number: 9,
        action: "terminate",
        description: "Forced termination",
        standard: "posix",
        forced: !0
    }, {
        name: "SIGUSR1",
        number: 10,
        action: "terminate",
        description: "Application-specific signal",
        standard: "posix"
    }, {
        name: "SIGSEGV",
        number: 11,
        action: "core",
        description: "Segmentation fault",
        standard: "ansi"
    }, {
        name: "SIGUSR2",
        number: 12,
        action: "terminate",
        description: "Application-specific signal",
        standard: "posix"
    }, {
        name: "SIGPIPE",
        number: 13,
        action: "terminate",
        description: "Broken pipe or socket",
        standard: "posix"
    }, {
        name: "SIGALRM",
        number: 14,
        action: "terminate",
        description: "Timeout or timer",
        standard: "posix"
    }, {
        name: "SIGTERM",
        number: 15,
        action: "terminate",
        description: "Termination",
        standard: "ansi"
    }, {
        name: "SIGSTKFLT",
        number: 16,
        action: "terminate",
        description: "Stack is empty or overflowed",
        standard: "other"
    }, {
        name: "SIGCHLD",
        number: 17,
        action: "ignore",
        description: "Child process terminated, paused or unpaused",
        standard: "posix"
    }, {
        name: "SIGCLD",
        number: 17,
        action: "ignore",
        description: "Child process terminated, paused or unpaused",
        standard: "other"
    }, {
        name: "SIGCONT",
        number: 18,
        action: "unpause",
        description: "Unpaused",
        standard: "posix",
        forced: !0
    }, {
        name: "SIGSTOP",
        number: 19,
        action: "pause",
        description: "Paused",
        standard: "posix",
        forced: !0
    }, {
        name: "SIGTSTP",
        number: 20,
        action: "pause",
        description: 'Paused using CTRL-Z or "suspend"',
        standard: "posix"
    }, {
        name: "SIGTTIN",
        number: 21,
        action: "pause",
        description: "Background process cannot read terminal input",
        standard: "posix"
    }, {
        name: "SIGBREAK",
        number: 21,
        action: "terminate",
        description: "User interruption with CTRL-BREAK",
        standard: "other"
    }, {
        name: "SIGTTOU",
        number: 22,
        action: "pause",
        description: "Background process cannot write to terminal output",
        standard: "posix"
    }, {
        name: "SIGURG",
        number: 23,
        action: "ignore",
        description: "Socket received out-of-band data",
        standard: "bsd"
    }, {
        name: "SIGXCPU",
        number: 24,
        action: "core",
        description: "Process timed out",
        standard: "bsd"
    }, {
        name: "SIGXFSZ",
        number: 25,
        action: "core",
        description: "File too big",
        standard: "bsd"
    }, {
        name: "SIGVTALRM",
        number: 26,
        action: "terminate",
        description: "Timeout or timer",
        standard: "bsd"
    }, {
        name: "SIGPROF",
        number: 27,
        action: "terminate",
        description: "Timeout or timer",
        standard: "bsd"
    }, {
        name: "SIGWINCH",
        number: 28,
        action: "ignore",
        description: "Terminal window size changed",
        standard: "bsd"
    }, {
        name: "SIGIO",
        number: 29,
        action: "terminate",
        description: "I/O is available",
        standard: "other"
    }, {
        name: "SIGPOLL",
        number: 29,
        action: "terminate",
        description: "Watched event",
        standard: "other"
    }, {
        name: "SIGINFO",
        number: 29,
        action: "ignore",
        description: "Request for process information",
        standard: "other"
    }, {
        name: "SIGPWR",
        number: 30,
        action: "terminate",
        description: "Device running out of power",
        standard: "systemv"
    }, {
        name: "SIGSYS",
        number: 31,
        action: "core",
        description: "Invalid system call",
        standard: "other"
    }, {
        name: "SIGUNUSED",
        number: 31,
        action: "terminate",
        description: "Invalid system call",
        standard: "other"
    }]
})
// @from(Ln 31048, Col 4)
Rd1 = () => {
        let A = Q_A();
        return [...d_A, ...A].map(A9K)
    }
// @from(Ln 31052, Col 4)
A9K = ({
        name: A,
        number: q,
        description: K,
        action: Y,
        forced: z = !1,
        standard: _
    }) => {
        let {
            signals: {
                [A]: w
            }
        } = e3K, O = w !== void 0;
        return {
            name: A,
            number: O ? w : q,
            description: K,
            supported: O,
            action: Y,
            forced: z,
            standard: _
        }
    }
// @from(Ln 31075, Col 4)
l_A = E(() => {
    c_A()
})
// @from(Ln 31081, Col 4)
K9K = () => {
        let A = Rd1();
        return Object.fromEntries(A.map(Y9K))
    }
// @from(Ln 31085, Col 4)
Y9K = ({
        name: A,
        number: q,
        description: K,
        supported: Y,
        action: z,
        forced: _,
        standard: w
    }) => [A, {
        name: A,
        number: q,
        description: K,
        supported: Y,
        action: z,
        forced: _,
        standard: w
    }]
// @from(Ln 31102, Col 4)
i_A
// @from(Ln 31102, Col 9)
z9K = () => {
        let A = Rd1(),
            q = Ld1 + 1,
            K = Array.from({
                length: q
            }, (Y, z) => _9K(z, A));
        return Object.assign({}, ...K)
    }
// @from(Ln 31110, Col 4)
_9K = (A, q) => {
        let K = w9K(A, q);
        if (K === void 0) return {};
        let {
            name: Y,
            description: z,
            supported: _,
            action: w,
            forced: O,
            standard: $
        } = K;
        return {
            [A]: {
                name: Y,
                number: A,
                description: z,
                supported: _,
                action: w,
                forced: O,
                standard: $
            }
        }
    }
// @from(Ln 31133, Col 4)
w9K = (A, q) => {
        let K = q.find(({
            name: Y
        }) => q9K.signals[Y] === A);
        if (K !== void 0) return K;
        return q.find((Y) => Y.number === A)
    }
// @from(Ln 31140, Col 4)
KUz
// @from(Ln 31141, Col 4)
n_A = E(() => {
    l_A();
    i_A = K9K(), KUz = z9K()
})
// @from(Ln 31146, Col 4)
$9K = ({
        timedOut: A,
        timeout: q,
        errorCode: K,
        signal: Y,
        signalDescription: z,
        exitCode: _,
        isCanceled: w
    }) => {
        if (A) return `timed out after ${q} milliseconds`;
        if (w) return "was canceled";
        if (K !== void 0) return `failed with ${K}`;
        if (Y !== void 0) return `was killed with ${Y} (${z})`;
        if (_ !== void 0) return `failed with exit code ${_}`;
        return "failed"
    }
// @from(Ln 31162, Col 4)
$L6 = ({
        stdout: A,
        stderr: q,
        all: K,
        error: Y,
        signal: z,
        exitCode: _,
        command: w,
        escapedCommand: O,
        timedOut: $,
        isCanceled: H,
        killed: j,
        parsed: {
            options: {
                timeout: J,
                cwd: M = O9K.cwd()
            }
        }
    }) => {
        _ = _ === null ? void 0 : _, z = z === null ? void 0 : z;
        let D = z === void 0 ? void 0 : i_A[z].description,
            X = Y && Y.code,
            W = `Command ${$9K({timedOut:$,timeout:J,errorCode:X,signal:z,signalDescription:D,exitCode:_,isCanceled:H})}: ${w}`,
            Z = Object.prototype.toString.call(Y) === "[object Error]",
            G = Z ? `${W}
${Y.message}` : W,
            f = [G, q, A].filter(Boolean).join(`
`);
        if (Z) Y.originalMessage = Y.message, Y.message = f;
        else Y = Error(f);
        if (Y.shortMessage = G, Y.command = w, Y.escapedCommand = O, Y.exitCode = _, Y.signal = z, Y.signalDescription = D, Y.stdout = A, Y.stderr = q, Y.cwd = M, K !== void 0) Y.all = K;
        if ("bufferedData" in Y) delete Y.bufferedData;
        return Y.failed = !0, Y.timedOut = Boolean($), Y.isCanceled = H, Y.killed = j && !$, Y
    }
// @from(Ln 31196, Col 4)
r_A = E(() => {
    n_A()
})
// @from(Ln 31199, Col 4)
C11
// @from(Ln 31199, Col 9)
H9K = (A) => C11.some((q) => A[q] !== void 0)
// @from(Ln 31200, Col 4)
o_A = (A) => {
        if (!A) return;
        let {
            stdio: q
        } = A;
        if (q === void 0) return C11.map((Y) => A[Y]);
        if (H9K(A)) throw Error(`It's not possible to provide \`stdio\` in combination with one of ${C11.map((Y)=>`\`${Y}\``).join(", ")}`);
        if (typeof q === "string") return q;
        if (!Array.isArray(q)) throw TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof q}\``);
        let K = Math.max(q.length, C11.length);
        return Array.from({
            length: K
        }, (Y, z) => q[z])
    }
// @from(Ln 31214, Col 4)
a_A = E(() => {
    C11 = ["stdin", "stdout", "stderr"]
})
// @from(Ln 31217, Col 4)
mA6
// @from(Ln 31218, Col 4)
s_A = E(() => {
    mA6 = [];
    mA6.push("SIGHUP", "SIGINT", "SIGTERM");
    if (process.platform !== "win32") mA6.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
    if (process.platform === "linux") mA6.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT")
})
// @from(Ln 31224, Col 0)
class t_A {
    emitted = {
        afterExit: !1,
        exit: !1
    };
    listeners = {
        afterExit: [],
        exit: []
    };
    count = 0;
    id = Math.random();
    constructor() {
        if (Sd1[hd1]) return Sd1[hd1];
        j9K(Sd1, hd1, {
            value: this,
            writable: !1,
            enumerable: !1,
            configurable: !1
        })
    }
    on(A, q) {
        this.listeners[A].push(q)
    }
    removeListener(A, q) {
        let K = this.listeners[A],
            Y = K.indexOf(q);
        if (Y === -1) return;
        if (Y === 0 && K.length === 1) K.length = 0;
        else K.splice(Y, 1)
    }
    emit(A, q, K) {
        if (this.emitted[A]) return !1;
        this.emitted[A] = !0;
        let Y = !1;
        for (let z of this.listeners[A]) Y = z(q, K) === !0 || Y;
        if (A === "exit") Y = this.emit("afterExit", q, K) || Y;
        return Y
    }
}
// @from(Ln 31263, Col 0)
class Id1 {}
// @from(Ln 31264, Col 4)
I11 = (A) => !!A && typeof A === "object" && typeof A.removeListener === "function" && typeof A.emit === "function" && typeof A.reallyExit === "function" && typeof A.listeners === "function" && typeof A.kill === "function" && typeof A.pid === "number" && typeof A.on === "function"
// @from(Ln 31265, Col 4)
hd1
// @from(Ln 31265, Col 9)
Sd1
// @from(Ln 31265, Col 14)
j9K
// @from(Ln 31265, Col 19)
J9K = (A) => {
        return {
            onExit(q, K) {
                return A.onExit(q, K)
            },
            load() {
                return A.load()
            },
            unload() {
                return A.unload()
            }
        }
    }
// @from(Ln 31278, Col 4)
e_A
// @from(Ln 31278, Col 9)
A2A
// @from(Ln 31278, Col 14)
Cd1
// @from(Ln 31278, Col 19)
sn
// @from(Ln 31278, Col 23)
jUz
// @from(Ln 31278, Col 28)
JUz
// @from(Ln 31279, Col 4)
HL6 = E(() => {
    s_A();
    hd1 = Symbol.for("signal-exit emitter"), Sd1 = globalThis, j9K = Object.defineProperty.bind(Object);
    e_A = class e_A extends Id1 {
        onExit() {
            return () => {}
        }
        load() {}
        unload() {}
    };
    A2A = class A2A extends Id1 {
        #A = Cd1.platform === "win32" ? "SIGINT" : "SIGHUP";
        #q = new t_A;
        #K;
        #z;
        #Y;
        #w = {};
        #_ = !1;
        constructor(A) {
            super();
            this.#K = A, this.#w = {};
            for (let q of mA6) this.#w[q] = () => {
                let K = this.#K.listeners(q),
                    {
                        count: Y
                    } = this.#q,
                    z = A;
                if (typeof z.__signal_exit_emitter__ === "object" && typeof z.__signal_exit_emitter__.count === "number") Y += z.__signal_exit_emitter__.count;
                if (K.length === Y) {
                    this.unload();
                    let _ = this.#q.emit("exit", null, q),
                        w = q === "SIGHUP" ? this.#A : q;
                    if (!_) A.kill(A.pid, w)
                }
            };
            this.#Y = A.reallyExit, this.#z = A.emit
        }
        onExit(A, q) {
            if (!I11(this.#K)) return () => {};
            if (this.#_ === !1) this.load();
            let K = q?.alwaysLast ? "afterExit" : "exit";
            return this.#q.on(K, A), () => {
                if (this.#q.removeListener(K, A), this.#q.listeners.exit.length === 0 && this.#q.listeners.afterExit.length === 0) this.unload()
            }
        }
        load() {
            if (this.#_) return;
            this.#_ = !0, this.#q.count += 1;
            for (let A of mA6) try {
                let q = this.#w[A];
                if (q) this.#K.on(A, q)
            } catch (q) {}
            this.#K.emit = (A, ...q) => {
                return this.#H(A, ...q)
            }, this.#K.reallyExit = (A) => {
                return this.#$(A)
            }
        }
        unload() {
            if (!this.#_) return;
            this.#_ = !1, mA6.forEach((A) => {
                let q = this.#w[A];
                if (!q) throw Error("Listener not defined for signal: " + A);
                try {
                    this.#K.removeListener(A, q)
                } catch (K) {}
            }), this.#K.emit = this.#z, this.#K.reallyExit = this.#Y, this.#q.count -= 1
        }
        #$(A) {
            if (!I11(this.#K)) return 0;
            return this.#K.exitCode = A || 0, this.#q.emit("exit", this.#K.exitCode, null), this.#Y.call(this.#K, this.#K.exitCode)
        }
        #H(A, ...q) {
            let K = this.#z;
            if (A === "exit" && I11(this.#K)) {
                if (typeof q[0] === "number") this.#K.exitCode = q[0];
                let Y = K.call(this.#K, A, ...q);
                return this.#q.emit("exit", this.#K.exitCode, null), Y
            } else return K.call(this.#K, A, ...q)
        }
    };
    Cd1 = globalThis.process, {
        onExit: sn,
        load: jUz,
        unload: JUz
    } = J9K(I11(Cd1) ? new A2A(Cd1) : new e_A)
})
// @from(Ln 31367, Col 4)
D9K = 5000
// @from(Ln 31368, Col 4)
q2A = (A, q = "SIGTERM", K = {}) => {
        let Y = A(q);
        return X9K(A, q, K, Y), Y
    }
// @from(Ln 31372, Col 4)
X9K = (A, q, K, Y) => {
        if (!P9K(q, K, Y)) return;
        let z = Z9K(K),
            _ = setTimeout(() => {
                A("SIGKILL")
            }, z);
        if (_.unref) _.unref()
    }
// @from(Ln 31380, Col 4)
P9K = (A, {
        forceKillAfterTimeout: q
    }, K) => W9K(A) && q !== !1 && K
// @from(Ln 31383, Col 4)
W9K = (A) => A === M9K.constants.signals.SIGTERM || typeof A === "string" && A.toUpperCase() === "SIGTERM"
// @from(Ln 31384, Col 4)
Z9K = ({
        forceKillAfterTimeout: A = !0
    }) => {
        if (A === !0) return D9K;
        if (!Number.isFinite(A) || A < 0) throw TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${A}\` (${typeof A})`);
        return A
    }
// @from(Ln 31391, Col 4)
K2A = (A, q) => {
        if (A.kill()) q.isCanceled = !0
    }
// @from(Ln 31394, Col 4)
G9K = (A, q, K) => {
        A.kill(q), K(Object.assign(Error("Timed out"), {
            timedOut: !0,
            signal: q
        }))
    }
// @from(Ln 31400, Col 4)
Y2A = (A, {
        timeout: q,
        killSignal: K = "SIGTERM"
    }, Y) => {
        if (q === 0 || q === void 0) return Y;
        let z, _ = new Promise((O, $) => {
                z = setTimeout(() => {
                    G9K(A, K, $)
                }, q)
            }),
            w = Y.finally(() => {
                clearTimeout(z)
            });
        return Promise.race([_, w])
    }
// @from(Ln 31415, Col 4)
z2A = ({
        timeout: A
    }) => {
        if (A !== void 0 && (!Number.isFinite(A) || A < 0)) throw TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${A}\` (${typeof A})`)
    }
// @from(Ln 31420, Col 4)
_2A = async (A, {
        cleanup: q,
        detached: K
    }, Y) => {
        if (!q || K) return Y;
        let z = sn(() => {
            A.kill()
        });
        return Y.finally(() => {
            z()
        })
    }
// @from(Ln 31432, Col 4)
w2A = E(() => {
    HL6()
})
// @from(Ln 31436, Col 0)
function b11(A) {
    return A !== null && typeof A === "object" && typeof A.pipe === "function"
}
// @from(Ln 31440, Col 0)
function bd1(A) {
    return b11(A) && A.writable !== !1 && typeof A._write === "function" && typeof A._writableState === "object"
}
// @from(Ln 31449, Col 4)
v9K = (A) => A instanceof T9K && typeof A.then === "function"
// @from(Ln 31450, Col 4)
xd1 = (A, q, K) => {
        if (typeof K === "string") return A[q].pipe(f9K(K)), A;
        if (bd1(K)) return A[q].pipe(K), A;
        if (!v9K(K)) throw TypeError("The second argument must be a string, a stream or an Execa child process.");
        if (!bd1(K.stdin)) throw TypeError("The target child process's stdin must be available.");
        return A[q].pipe(K.stdin), K
    }
// @from(Ln 31457, Col 4)
O2A = (A) => {
        if (A.stdout !== null) A.pipeStdout = xd1.bind(void 0, A, "stdout");
        if (A.stderr !== null) A.pipeStderr = xd1.bind(void 0, A, "stderr");
        if (A.all !== void 0) A.pipeAll = xd1.bind(void 0, A, "all")
    }
// @from(Ln 31462, Col 4)
$2A = () => {}
// @from(Ln 31463, Col 4)
jL6 = async (A, {
    init: q,
    convertChunk: K,
    getSize: Y,
    truncateChunk: z,
    addChunk: _,
    getFinalChunk: w,
    finalize: O
}, {
    maxBuffer: $ = Number.POSITIVE_INFINITY
} = {}) => {
    if (!V9K(A)) throw Error("The first argument must be a Readable, a ReadableStream, or an async iterable.");
    let H = q();
    H.length = 0;
    try {
        for await (let j of A) {
            let J = k9K(j),
                M = K[J](j, H);
            J2A({
                convertedChunk: M,
                state: H,
                getSize: Y,
                truncateChunk: z,
                addChunk: _,
                maxBuffer: $
            })
        }
        return N9K({
            state: H,
            convertChunk: K,
            getSize: Y,
            truncateChunk: z,
            addChunk: _,
            getFinalChunk: w,
            maxBuffer: $
        }), O(H)
    } catch (j) {
        throw j.bufferedData = O(H), j
    }
}
// @from(Ln 31502, Col 3)
N9K = ({
    state: A,
    getSize: q,
    truncateChunk: K,
    addChunk: Y,
    getFinalChunk: z,
    maxBuffer: _
}) => {
    let w = z(A);
    if (w !== void 0) J2A({
        convertedChunk: w,
        state: A,
        getSize: q,
        truncateChunk: K,
        addChunk: Y,
        maxBuffer: _
    })
}
// @from(Ln 31519, Col 3)
J2A = ({
    convertedChunk: A,
    state: q,
    getSize: K,
    truncateChunk: Y,
    addChunk: z,
    maxBuffer: _
}) => {
    let w = K(A),
        O = q.length + w;
    if (O <= _) {
        H2A(A, q, z, O);
        return
    }
    let $ = Y(A, _ - q.length);
    if ($ !== void 0) H2A($, q, z, _);
    throw new ud1
}
// @from(Ln 31536, Col 3)
H2A = (A, q, K, Y) => {
    q.contents = K(A, q, Y), q.length = Y
}
// @from(Ln 31538, Col 3)
V9K = (A) => typeof A === "object" && A !== null && typeof A[Symbol.asyncIterator] === "function"
// @from(Ln 31538, Col 102)
k9K = (A) => {
    let q = typeof A;
    if (q === "string") return "string";
    if (q !== "object" || A === null) return "others";
    if (globalThis.Buffer?.isBuffer(A)) return "buffer";
    let K = j2A.call(A);
    if (K === "[object ArrayBuffer]") return "arrayBuffer";
    if (K === "[object DataView]") return "dataView";
    if (Number.isInteger(A.byteLength) && Number.isInteger(A.byteOffset) && j2A.call(A.buffer) === "[object ArrayBuffer]") return "typedArray";
    return "others"
}
// @from(Ln 31548, Col 3)
j2A
// @from(Ln 31548, Col 8)
ud1
// @from(Ln 31549, Col 4)
JL6 = E(() => {
    ({
        toString: j2A
    } = Object.prototype);
    ud1 = class ud1 extends Error {
        name = "MaxBufferError";
        constructor() {
            super("maxBuffer exceeded")
        }
    }
})
// @from(Ln 31560, Col 4)
md1 = (A) => A
// @from(Ln 31561, Col 4)
Bd1 = () => {
        return
    }
// @from(Ln 31564, Col 4)
gd1 = ({
        contents: A
    }) => A
// @from(Ln 31567, Col 4)
x11 = (A) => {
        throw Error(`Streams in object mode are not supported: ${String(A)}`)
    }
// @from(Ln 31570, Col 4)
u11 = (A) => A.length
// @from(Ln 31571, Col 4)
M2A = E(() => {
    JL6()
})
// @from(Ln 31574, Col 0)
async function Fd1(A, q) {
    return jL6(A, b9K, q)
}
// @from(Ln 31577, Col 4)
E9K = () => ({
        contents: new ArrayBuffer(0)
    })
// @from(Ln 31580, Col 4)
y9K = (A) => L9K.encode(A)
// @from(Ln 31581, Col 4)
L9K
// @from(Ln 31581, Col 9)
D2A = (A) => new Uint8Array(A)
// @from(Ln 31582, Col 4)
X2A = (A) => new Uint8Array(A.buffer, A.byteOffset, A.byteLength)
// @from(Ln 31583, Col 4)
R9K = (A, q) => A.slice(0, q)
// @from(Ln 31584, Col 4)
h9K = (A, {
        contents: q,
        length: K
    }, Y) => {
        let z = Z2A() ? C9K(q, Y) : S9K(q, Y);
        return new Uint8Array(z).set(A, K), z
    }
// @from(Ln 31591, Col 4)
S9K = (A, q) => {
        if (q <= A.byteLength) return A;
        let K = new ArrayBuffer(W2A(q));
        return new Uint8Array(K).set(new Uint8Array(A), 0), K
    }
// @from(Ln 31596, Col 4)
C9K = (A, q) => {
        if (q <= A.maxByteLength) return A.resize(q), A;
        let K = new ArrayBuffer(q, {
            maxByteLength: W2A(q)
        });
        return new Uint8Array(K).set(new Uint8Array(A), 0), K
    }
// @from(Ln 31603, Col 4)
W2A = (A) => P2A ** Math.ceil(Math.log(A) / Math.log(P2A))
// @from(Ln 31604, Col 4)
P2A = 2
// @from(Ln 31605, Col 4)
I9K = ({
        contents: A,
        length: q
    }) => Z2A() ? A : A.slice(0, q)
// @from(Ln 31609, Col 4)
Z2A = () => ("resize" in ArrayBuffer.prototype)
// @from(Ln 31610, Col 4)
b9K
// @from(Ln 31611, Col 4)
pd1 = E(() => {
    JL6();
    L9K = new TextEncoder, b9K = {
        init: E9K,
        convertChunk: {
            string: y9K,
            buffer: D2A,
            arrayBuffer: D2A,
            dataView: X2A,
            typedArray: X2A,
            others: x11
        },
        getSize: u11,
        truncateChunk: R9K,
        addChunk: h9K,
        getFinalChunk: Bd1,
        finalize: I9K
    }
})
// @from(Ln 31630, Col 0)
async function m11(A, q) {
    if (!("Buffer" in globalThis)) throw Error("getStreamAsBuffer() is only supported in Node.js");
    try {
        return G2A(await Fd1(A, q))
    } catch (K) {
        if (K.bufferedData !== void 0) K.bufferedData = G2A(K.bufferedData);
        throw K
    }
}
// @from(Ln 31639, Col 4)
G2A = (A) => globalThis.Buffer.from(A)
// @from(Ln 31640, Col 4)
f2A = E(() => {
    pd1()
})
// @from(Ln 31643, Col 0)
async function Qd1(A, q) {
    return jL6(A, g9K, q)
}
// @from(Ln 31646, Col 4)
x9K = () => ({
        contents: "",
        textDecoder: new TextDecoder
    })
// @from(Ln 31650, Col 4)
B11 = (A, {
        textDecoder: q
    }) => q.decode(A, {
        stream: !0
    })
// @from(Ln 31655, Col 4)
u9K = (A, {
        contents: q
    }) => q + A
// @from(Ln 31658, Col 4)
m9K = (A, q) => A.slice(0, q)
// @from(Ln 31659, Col 4)
B9K = ({
        textDecoder: A
    }) => {
        let q = A.decode();
        return q === "" ? void 0 : q
    }
// @from(Ln 31665, Col 4)
g9K
// @from(Ln 31666, Col 4)
T2A = E(() => {
    JL6();
    g9K = {
        init: x9K,
        convertChunk: {
            string: md1,
            buffer: B11,
            arrayBuffer: B11,
            dataView: B11,
            typedArray: B11,
            others: x11
        },
        getSize: u11,
        truncateChunk: m9K,
        addChunk: u9K,
        getFinalChunk: B9K,
        finalize: gd1
    }
})
// @from(Ln 31685, Col 4)
v2A = E(() => {
    M2A();
    pd1();
    f2A();
    T2A();
    JL6()
})
// @from(Ln 31692, Col 4)
V2A = x((QUz, N2A) => {
    var {
        PassThrough: F9K
    } = x6("stream");
    N2A.exports = function() {
        var A = [],
            q = new F9K({
                objectMode: !0
            });
        return q.setMaxListeners(0), q.add = K, q.isEmpty = Y, q.on("unpipe", z), Array.prototype.slice.call(arguments).forEach(K), q;

        function K(_) {
            if (Array.isArray(_)) return _.forEach(K), this;
            return A.push(_), _.once("end", z.bind(null, _)), _.once("error", q.emit.bind(q, "error")), _.pipe(q, {
                end: !1
            }), this
        }

        function Y() {
            return A.length == 0
        }

        function z(_) {
            if (A = A.filter(function(w) {
                    return w !== _
                }), !A.length && q.readable) q.end()
        }
    }
})
// @from(Ln 31728, Col 4)
k2A
// @from(Ln 31728, Col 9)
E2A = (A) => {
        if (A !== void 0) throw TypeError("The `input` and `inputFile` options cannot be both set.")
    }
// @from(Ln 31731, Col 4)
d9K = ({
        input: A,
        inputFile: q
    }) => {
        if (typeof q !== "string") return A;
        return E2A(A), Q9K(q)
    }
// @from(Ln 31738, Col 4)
y2A = (A) => {
        let q = d9K(A);
        if (b11(q)) throw TypeError("The `input` option cannot be a stream in sync mode");
        return q
    }
// @from(Ln 31743, Col 4)
c9K = ({
        input: A,
        inputFile: q
    }) => {
        if (typeof q !== "string") return A;
        return E2A(A), p9K(q)
    }
// @from(Ln 31750, Col 4)
L2A = (A, q) => {
        let K = c9K(q);
        if (K === void 0) return;
        if (b11(K)) K.pipe(A.stdin);
        else A.stdin.end(K)
    }
// @from(Ln 31756, Col 4)
R2A = (A, {
        all: q
    }) => {
        if (!q || !A.stdout && !A.stderr) return;
        let K = k2A.default();
        if (A.stdout) K.add(A.stdout);
        if (A.stderr) K.add(A.stderr);
        return K
    }
// @from(Ln 31765, Col 4)
Ud1 = async (A, q) => {
        if (!A || q === void 0) return;
        await U9K(0), A.destroy();
        try {
            return await q
        } catch (K) {
            return K.bufferedData
        }
    }
// @from(Ln 31773, Col 7)
dd1 = (A, {
        encoding: q,
        buffer: K,
        maxBuffer: Y
    }) => {
        if (!A || !K) return;
        if (q === "utf8" || q === "utf-8") return Qd1(A, {
            maxBuffer: Y
        });
        if (q === null || q === "buffer") return m11(A, {
            maxBuffer: Y
        });
        return l9K(A, Y, q)
    }
// @from(Ln 31786, Col 7)
l9K = async (A, q, K) => {
        return (await m11(A, {
            maxBuffer: q
        })).toString(K)
    }
// @from(Ln 31790, Col 7)
h2A = async ({
        stdout: A,
        stderr: q,
        all: K
    }, {
        encoding: Y,
        buffer: z,
        maxBuffer: _
    }, w) => {
        let O = dd1(A, {
                encoding: Y,
                buffer: z,
                maxBuffer: _
            }),
            $ = dd1(q, {
                encoding: Y,
                buffer: z,
                maxBuffer: _
            }),
            H = dd1(K, {
                encoding: Y,
                buffer: z,
                maxBuffer: _ * 2
            });
        try {
            return await Promise.all([w, O, $, H])
        } catch (j) {
            return Promise.all([{
                error: j,
                signal: j.signal,
                timedOut: j.timedOut
            }, Ud1(A, O), Ud1(q, $), Ud1(K, H)])
        }
    }
// @from(Ln 31824, Col 4)
S2A = E(() => {
    v2A();
    k2A = t(V2A(), 1)
})
// @from(Ln 31828, Col 4)
i9K
// @from(Ln 31828, Col 9)
n9K
// @from(Ln 31828, Col 14)
cd1 = (A, q) => {
        for (let [K, Y] of n9K) {
            let z = typeof q === "function" ? (..._) => Reflect.apply(Y.value, q(), _) : Y.value.bind(q);
            Reflect.defineProperty(A, K, {
                ...Y,
                value: z
            })
        }
    }
// @from(Ln 31837, Col 4)
C2A = (A) => new Promise((q, K) => {
        if (A.on("exit", (Y, z) => {
                q({
                    exitCode: Y,
                    signal: z
                })
            }), A.on("error", (Y) => {
                K(Y)
            }), A.stdin) A.stdin.on("error", (Y) => {
            K(Y)
        })
    })
// @from(Ln 31849, Col 4)
I2A = E(() => {
    i9K = (async () => {})().constructor.prototype, n9K = ["then", "catch", "finally"].map((A) => [A, Reflect.getOwnPropertyDescriptor(i9K, A)])
})
// @from(Ln 31858, Col 4)
u2A = (A, q = []) => {
        if (!Array.isArray(q)) return [A];
        return [A, ...q]
    }
// @from(Ln 31862, Col 4)
a9K
// @from(Ln 31862, Col 9)
s9K = (A) => {
        if (typeof A !== "string" || a9K.test(A)) return A;
        return `"${A.replaceAll('"',"\\\"")}"`
    }
// @from(Ln 31866, Col 4)
ld1 = (A, q) => u2A(A, q).join(" ")
// @from(Ln 31867, Col 4)
id1 = (A, q) => u2A(A, q).map((K) => s9K(K)).join(" ")
// @from(Ln 31868, Col 4)
t9K
// @from(Ln 31868, Col 9)
b2A = (A) => {
        let q = typeof A;
        if (q === "string") return A;
        if (q === "number") return String(A);
        if (q === "object" && A !== null && !(A instanceof o9K) && "stdout" in A) {
            let K = typeof A.stdout;
            if (K === "string") return A.stdout;
            if (r9K.isBuffer(A.stdout)) return A.stdout.toString();
            throw TypeError(`Unexpected "${K}" stdout in template expression`)
        }
        throw TypeError(`Unexpected "${q}" in template expression`)
    }
// @from(Ln 31880, Col 4)
x2A = (A, q, K) => K || A.length === 0 || q.length === 0 ? [...A, ...q] : [...A.slice(0, -1), `${A.at(-1)}${q[0]}`, ...q.slice(1)]
// @from(Ln 31881, Col 4)
e9K = ({
        templates: A,
        expressions: q,
        tokens: K,
        index: Y,
        template: z
    }) => {
        let _ = z ?? A.raw[Y],
            w = _.split(t9K).filter(Boolean),
            O = x2A(K, w, _.startsWith(" "));
        if (Y === q.length) return O;
        let $ = q[Y],
            H = Array.isArray($) ? $.map((j) => b2A(j)) : [b2A($)];
        return x2A(O, H, _.endsWith(" "))
    }
// @from(Ln 31896, Col 4)
nd1 = (A, q) => {
        let K = [];
        for (let [Y, z] of A.entries()) K = e9K({
            templates: A,
            expressions: q,
            tokens: K,
            index: Y,
            template: z
        });
        return K
    }
// @from(Ln 31907, Col 4)
m2A = E(() => {
    a9K = /^[\w.-]+$/, t9K = / +/g
})
// @from(Ln 31914, Col 4)
B2A
// @from(Ln 31914, Col 9)
g11 = (A, q) => String(A).padStart(q, "0")
// @from(Ln 31915, Col 4)
KYK = () => {
        let A = new Date;
        return `${g11(A.getHours(),2)}:${g11(A.getMinutes(),2)}:${g11(A.getSeconds(),2)}.${g11(A.getMilliseconds(),3)}`
    }
// @from(Ln 31919, Col 4)
rd1 = (A, {
        verbose: q
    }) => {
        if (!q) return;
        qYK.stderr.write(`[${KYK()}] ${A}
`)
    }
// @from(Ln 31926, Col 4)
g2A = E(() => {
    B2A = AYK("execa").enabled
})
// @from(Ln 31936, Col 0)
function q9(A, q, K) {
    let Y = Q2A(A, q, K),
        z = ld1(A, q),
        _ = id1(A, q);
    rd1(_, Y.options), z2A(Y.options);
    let w;
    try {
        w = od1.spawn(Y.file, Y.args, Y.options)
    } catch (D) {
        let X = new od1.ChildProcess,
            P = Promise.reject($L6({
                error: D,
                stdout: "",
                stderr: "",
                all: "",
                command: z,
                escapedCommand: _,
                parsed: Y,
                timedOut: !1,
                isCanceled: !1,
                killed: !1
            }));
        return cd1(X, P), X
    }
    let O = C2A(w),
        $ = Y2A(w, Y.options, O),
        H = _2A(w, Y.options, $),
        j = {
            isCanceled: !1
        };
    w.kill = q2A.bind(null, w.kill.bind(w)), w.cancel = K2A.bind(null, w, j);
    let M = F_A(async () => {
        let [{
            error: D,
            exitCode: X,
            signal: P,
            timedOut: W
        }, Z, G, f] = await h2A(w, Y.options, H), v = ML6(Y.options, Z), N = ML6(Y.options, G), V = ML6(Y.options, f);
        if (D || X !== 0 || P !== null) {
            let L = $L6({
                error: D,
                exitCode: X,
                signal: P,
                stdout: v,
                stderr: N,
                all: V,
                command: z,
                escapedCommand: _,
                parsed: Y,
                timedOut: W,
                isCanceled: j.isCanceled || (Y.options.signal ? Y.options.signal.aborted : !1),
                killed: w.killed
            });
            if (!Y.options.reject) return L;
            throw L
        }
        return {
            command: z,
            escapedCommand: _,
            exitCode: 0,
            stdout: v,
            stderr: N,
            all: V,
            failed: !1,
            timedOut: !1,
            isCanceled: !1,
            killed: !1
        }
    });
    return L2A(w, Y.options), w.all = R2A(w, Y.options), O2A(w), cd1(w, M), w
}
// @from(Ln 32008, Col 0)
function BA6(A, q, K) {
    let Y = Q2A(A, q, K),
        z = ld1(A, q),
        _ = id1(A, q);
    rd1(_, Y.options);
    let w = y2A(Y.options),
        O;
    try {
        O = od1.spawnSync(Y.file, Y.args, {
            ...Y.options,
            input: w
        })
    } catch (j) {
        throw $L6({
            error: j,
            stdout: "",
            stderr: "",
            all: "",
            command: z,
            escapedCommand: _,
            parsed: Y,
            timedOut: !1,
            isCanceled: !1,
            killed: !1
        })
    }
    let $ = ML6(Y.options, O.stdout, O.error),
        H = ML6(Y.options, O.stderr, O.error);
    if (O.error || O.status !== 0 || O.signal !== null) {
        let j = $L6({
            stdout: $,
            stderr: H,
            error: O.error,
            signal: O.signal,
            exitCode: O.status,
            command: z,
            escapedCommand: _,
            parsed: Y,
            timedOut: O.error && O.error.code === "ETIMEDOUT",
            isCanceled: !1,
            killed: O.signal !== null
        });
        if (!Y.options.reject) return j;
        throw j
    }
    return {
        command: z,
        escapedCommand: _,
        exitCode: 0,
        stdout: $,
        stderr: H,
        failed: !1,
        timedOut: !1,
        isCanceled: !1,
        killed: !1
    }
}
// @from(Ln 32066, Col 0)
function U2A(A) {
    function q(K, ...Y) {
        if (!Array.isArray(K)) return U2A({
            ...A,
            ...K
        });
        let [z, ..._] = nd1(K, Y);
        return q9(z, _, F2A(A))
    }
    return q.sync = (K, ...Y) => {
        if (!Array.isArray(K)) throw TypeError("Please use $(options).sync`command` instead of $.sync(options)`command`.");
        let [z, ..._] = nd1(K, Y);
        return BA6(z, _, F2A(A))
    }, q
}
// @from(Ln 32081, Col 4)
p2A
// @from(Ln 32081, Col 9)
_YK = 1e8
// @from(Ln 32082, Col 4)
wYK = ({
        env: A,
        extendEnv: q,
        preferLocal: K,
        localDir: Y,
        execPath: z
    }) => {
        let _ = q ? {
            ...F11.env,
            ...A
        } : A;
        if (K) return u_A({
            env: _,
            cwd: Y,
            execPath: z
        });
        return _
    }
// @from(Ln 32100, Col 4)
Q2A = (A, q, K = {}) => {
        let Y = p2A.default._parse(A, q, K);
        if (A = Y.command, q = Y.args, K = Y.options, K = {
                maxBuffer: _YK,
                buffer: !0,
                stripFinalNewline: !0,
                extendEnv: !0,
                preferLocal: !1,
                localDir: K.cwd || F11.cwd(),
                execPath: F11.execPath,
                encoding: "utf8",
                reject: !0,
                cleanup: !0,
                all: !1,
                windowsHide: !0,
                verbose: B2A,
                ...K
            }, K.env = wYK(K), K.stdio = o_A(K), F11.platform === "win32" && zYK.basename(A, ".exe") === "cmd") q.unshift("/q");
        return {
            file: A,
            args: q,
            options: K,
            parsed: Y
        }
    }
// @from(Ln 32125, Col 4)
ML6 = (A, q, K) => {
        if (typeof q !== "string" && !YYK.isBuffer(q)) return K === void 0 ? void 0 : "";
        if (A.stripFinalNewline) return Ed1(q);
        return q
    }
// @from(Ln 32130, Col 4)
OYK = ({
        input: A,
        inputFile: q,
        stdio: K
    }) => A === void 0 && q === void 0 && K === void 0 ? {
        stdin: "inherit"
    } : {}
// @from(Ln 32137, Col 4)
F2A = (A = {}) => ({
        preferLocal: !0,
        ...OYK(A),
        ...A
    })
// @from(Ln 32142, Col 4)
Zdz
// @from(Ln 32143, Col 4)
WW = E(() => {
    m_A();
    p_A();
    r_A();
    a_A();
    w2A();
    $2A();
    S2A();
    I2A();
    m2A();
    g2A();
    p2A = t(kd1(), 1);
    Zdz = U2A()
})
// @from(Ln 32161, Col 0)
function tn(A, q) {
    let Y = [];
    try {
        const K = TY(Y, E_`execSync: ${A.slice(0,100)}`, 0);
        return $YK(A, q)
    } catch (z) {
        var _ = z,
            w = 1
    } finally {
        vY(Y, _, w)
    }
}
// @from(Ln 32173, Col 4)
p11 = E(() => {
    g1()
})
// @from(Ln 32176, Col 0)
async function HYK(A) {
    if (process.platform === "win32") {
        let K = await q9(`where.exe ${A}`, {
            shell: !0,
            stderr: "ignore",
            reject: !1
        });
        if (K.exitCode !== 0 || !K.stdout) return null;
        return K.stdout.trim().split(/\r?\n/)[0] || null
    }
    let q = await q9(`which ${A}`, {
        shell: !0,
        stderr: "ignore",
        reject: !1
    });
    if (q.exitCode !== 0 || !q.stdout) return null;
    return q.stdout.trim()
}
// @from(Ln 32195, Col 0)
function jYK(A) {
    if (process.platform === "win32") try {
        return tn(`where.exe ${A}`, {
            encoding: "utf-8",
            stdio: ["ignore", "pipe", "ignore"]
        }).toString().trim().split(/\r?\n/)[0] || null
    } catch {
        return null
    }
    try {
        return tn(`which ${A}`, {
            encoding: "utf-8",
            stdio: ["ignore", "pipe", "ignore"]
        }).toString().trim() || null
    } catch {
        return null
    }
}
// @from(Ln 32213, Col 4)
ad1
// @from(Ln 32213, Col 9)
EM
// @from(Ln 32213, Col 13)
eO6
// @from(Ln 32214, Col 4)
Oy = E(() => {
    WW();
    p11();
    ad1 = typeof Bun < "u" && typeof Bun.which === "function" ? Bun.which : null, EM = ad1 ? async (A) => ad1(A): HYK, eO6 = ad1 ?? jYK
})
// @from(Ln 32220, Col 0)
function Q11(A, q) {
    return {
        cmd: eO6(A) ?? A,
        args: q
    }
}
// @from(Ln 32226, Col 4)
sd1 = E(() => {
    Oy()
})
// @from(Ln 32230, Col 0)
function A$6() {
    return process.versions.bun !== void 0
}
// @from(Ln 32234, Col 0)
function rY() {
    return typeof Bun < "u" && Array.isArray(Bun.embeddedFiles) && Bun.embeddedFiles.length > 0
}
// @from(Ln 32237, Col 4)
q$6 = {}
// @from(Ln 32249, Col 0)
function c2A() {
    return "prod"
}
// @from(Ln 32253, Col 0)
function td1() {
    if (process.env.CLAUDE_CODE_CUSTOM_OAUTH_URL) return "-custom-oauth";
    switch (c2A()) {
        case "local":
            return "-local-oauth";
        case "staging":
            return "-staging-oauth";
        case "prod":
            return ""
    }
}
// @from(Ln 32265, Col 0)
function P7() {
    let A = (() => {
            switch (c2A()) {
                case "local":
                    return DYK;
                case "staging":
                    return MYK ?? d2A;
                case "prod":
                    return d2A
            }
        })(),
        q = process.env.CLAUDE_CODE_CUSTOM_OAUTH_URL;
    if (q) {
        let Y = q.replace(/\/$/, "");
        if (!XYK.includes(Y)) throw Error("CLAUDE_CODE_CUSTOM_OAUTH_URL is not an approved endpoint.");
        A = {
            ...A,
            BASE_API_URL: Y,
            CONSOLE_AUTHORIZE_URL: `${Y}/oauth/authorize`,
            CLAUDE_AI_AUTHORIZE_URL: `${Y}/oauth/authorize`,
            TOKEN_URL: `${Y}/v1/oauth/token`,
            API_KEY_URL: `${Y}/api/oauth/claude_cli/create_api_key`,
            ROLES_URL: `${Y}/api/oauth/claude_cli/roles`,
            CONSOLE_SUCCESS_URL: `${Y}/oauth/code/success?app=claude-code`,
            CLAUDEAI_SUCCESS_URL: `${Y}/oauth/code/success?app=claude-code`,
            MANUAL_REDIRECT_URL: `${Y}/oauth/code/callback`,
            OAUTH_FILE_SUFFIX: "-custom-oauth"
        }
    }
    let K = process.env.CLAUDE_CODE_OAUTH_CLIENT_ID;
    if (K) A = {
        ...A,
        CLIENT_ID: K
    };
    return A
}
// @from(Ln 32301, Col 4)
ZV = "user:inference"
// @from(Ln 32302, Col 4)
pp = "user:profile"
// @from(Ln 32303, Col 4)
JYK = "org:create_api_key"
// @from(Ln 32304, Col 4)
DP = "oauth-2025-04-20"
// @from(Ln 32305, Col 4)
l2A
// @from(Ln 32305, Col 9)
U11
// @from(Ln 32305, Col 14)
ed1
// @from(Ln 32305, Col 19)
d2A
// @from(Ln 32305, Col 24)
MYK = void 0
// @from(Ln 32306, Col 4)
DYK
// @from(Ln 32306, Col 9)
XYK
// @from(Ln 32307, Col 4)
F5 = E(() => {
    A8();
    l2A = [JYK, pp], U11 = [pp, ZV, "user:sessions:claude_code", "user:mcp_servers", "user:file_upload"], ed1 = Array.from(new Set([...l2A, ...U11])), d2A = {
        BASE_API_URL: "https://api.anthropic.com",
        CONSOLE_AUTHORIZE_URL: "https://platform.claude.com/oauth/authorize",
        CLAUDE_AI_AUTHORIZE_URL: "https://claude.ai/oauth/authorize",
        TOKEN_URL: "https://platform.claude.com/v1/oauth/token",
        API_KEY_URL: "https://api.anthropic.com/api/oauth/claude_cli/create_api_key",
        ROLES_URL: "https://api.anthropic.com/api/oauth/claude_cli/roles",
        CONSOLE_SUCCESS_URL: "https://platform.claude.com/buy_credits?returnUrl=/oauth/code/success%3Fapp%3Dclaude-code",
        CLAUDEAI_SUCCESS_URL: "https://platform.claude.com/oauth/code/success?app=claude-code",
        MANUAL_REDIRECT_URL: "https://platform.claude.com/oauth/code/callback",
        CLIENT_ID: "9d1c250a-e61b-44d9-88ed-5944d1962f5e",
        OAUTH_FILE_SUFFIX: "",
        MCP_PROXY_URL: "https://mcp-proxy.anthropic.com",
        MCP_PROXY_PATH: "/v1/mcp/{server_id}"
    }, DYK = {
        BASE_API_URL: "http://localhost:3000",
        CONSOLE_AUTHORIZE_URL: "http://localhost:3000/oauth/authorize",
        CLAUDE_AI_AUTHORIZE_URL: "http://localhost:4000/oauth/authorize",
        TOKEN_URL: "http://localhost:3000/v1/oauth/token",
        API_KEY_URL: "http://localhost:3000/api/oauth/claude_cli/create_api_key",
        ROLES_URL: "http://localhost:3000/api/oauth/claude_cli/roles",
        CONSOLE_SUCCESS_URL: "http://localhost:3000/buy_credits?returnUrl=/oauth/code/success%3Fapp%3Dclaude-code",
        CLAUDEAI_SUCCESS_URL: "http://localhost:3000/oauth/code/success?app=claude-code",
        MANUAL_REDIRECT_URL: "https://console.staging.ant.dev/oauth/code/callback",
        CLIENT_ID: "22422756-60c9-4084-8eb7-27705fd5cf9a",
        OAUTH_FILE_SUFFIX: "-local-oauth",
        MCP_PROXY_URL: "http://localhost:8205",
        MCP_PROXY_PATH: "/v1/toolbox/shttp/mcp/{server_id}"
    }, XYK = ["https://beacon.claude-ai.staging.ant.dev", "https://claude.fedstart.com", "https://claude-staging.fedstart.com"]
})
// @from(Ln 32340, Col 0)
function DL6(A, q) {
    return function() {
        return A.apply(q, arguments)
    }
}
// @from(Ln 32346, Col 0)
function WYK(A) {
    return A !== null && !XL6(A) && A.constructor !== null && !XL6(A.constructor) && GV(A.constructor.isBuffer) && A.constructor.isBuffer(A)
}
// @from(Ln 32350, Col 0)
function ZYK(A) {
    let q;
    if (typeof ArrayBuffer < "u" && ArrayBuffer.isView) q = ArrayBuffer.isView(A);
    else q = A && A.buffer && n2A(A.buffer);
    return q
}
// @from(Ln 32357, Col 0)
function PL6(A, q, {
    allOwnKeys: K = !1
} = {}) {
    if (A === null || typeof A > "u") return;
    let Y, z;
    if (typeof A !== "object") A = [A];
    if (K$6(A))
        for (Y = 0, z = A.length; Y < z; Y++) q.call(null, A[Y], Y, A);
    else {
        let _ = K ? Object.getOwnPropertyNames(A) : Object.keys(A),
            w = _.length,
            O;
        for (Y = 0; Y < w; Y++) O = _[Y], q.call(null, A[O], O, A)
    }
}
// @from(Ln 32373, Col 0)
function o2A(A, q) {
    q = q.toLowerCase();
    let K = Object.keys(A),
        Y = K.length,
        z;
    while (Y-- > 0)
        if (z = K[Y], q === z.toLowerCase()) return z;
    return null
}
// @from(Ln 32383, Col 0)
function Ac1() {
    let {
        caseless: A
    } = a2A(this) && this || {}, q = {}, K = (Y, z) => {
        let _ = A && o2A(q, z) || z;
        if (d11(q[_]) && d11(Y)) q[_] = Ac1(q[_], Y);
        else if (d11(Y)) q[_] = Ac1({}, Y);
        else if (K$6(Y)) q[_] = Y.slice();
        else q[_] = Y
    };
    for (let Y = 0, z = arguments.length; Y < z; Y++) arguments[Y] && PL6(arguments[Y], K);
    return q
}
// @from(Ln 32397, Col 0)
function rYK(A) {
    return !!(A && GV(A.append) && A[Symbol.toStringTag] === "FormData" && A[Symbol.iterator])
}
// @from(Ln 32400, Col 4)
PYK
// @from(Ln 32400, Col 9)
qc1
// @from(Ln 32400, Col 14)
c11
// @from(Ln 32400, Col 19)
SS = (A) => {
        return A = A.toLowerCase(), (q) => c11(q) === A
    }
// @from(Ln 32403, Col 4)
l11 = (A) => (q) => typeof q === A
// @from(Ln 32404, Col 4)
K$6
// @from(Ln 32404, Col 9)
XL6
// @from(Ln 32404, Col 14)
n2A
// @from(Ln 32404, Col 19)
GYK
// @from(Ln 32404, Col 24)
GV
// @from(Ln 32404, Col 28)
r2A
// @from(Ln 32404, Col 33)
i11 = (A) => A !== null && typeof A === "object"
// @from(Ln 32405, Col 4)
fYK = (A) => A === !0 || A === !1
// @from(Ln 32406, Col 4)
d11 = (A) => {
        if (c11(A) !== "object") return !1;
        let q = qc1(A);
        return (q === null || q === Object.prototype || Object.getPrototypeOf(q) === null) && !(Symbol.toStringTag in A) && !(Symbol.iterator in A)
    }
// @from(Ln 32411, Col 4)
TYK
// @from(Ln 32411, Col 9)
vYK
// @from(Ln 32411, Col 14)
NYK
// @from(Ln 32411, Col 19)
VYK
// @from(Ln 32411, Col 24)
kYK = (A) => i11(A) && GV(A.pipe)
// @from(Ln 32412, Col 4)
EYK = (A) => {
        let q;
        return A && (typeof FormData === "function" && A instanceof FormData || GV(A.append) && ((q = c11(A)) === "formdata" || q === "object" && GV(A.toString) && A.toString() === "[object FormData]"))
    }
// @from(Ln 32416, Col 4)
yYK
// @from(Ln 32416, Col 9)
LYK
// @from(Ln 32416, Col 14)
RYK
// @from(Ln 32416, Col 19)
hYK
// @from(Ln 32416, Col 24)
SYK
// @from(Ln 32416, Col 29)
CYK = (A) => A.trim ? A.trim() : A.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "")
// @from(Ln 32417, Col 4)
gA6
// @from(Ln 32417, Col 9)
a2A = (A) => !XL6(A) && A !== gA6
// @from(Ln 32418, Col 4)
IYK = (A, q, K, {
        allOwnKeys: Y
    } = {}) => {
        return PL6(q, (z, _) => {
            if (K && GV(z)) A[_] = DL6(z, K);
            else A[_] = z
        }, {
            allOwnKeys: Y
        }), A
    }
// @from(Ln 32428, Col 4)
bYK = (A) => {
        if (A.charCodeAt(0) === 65279) A = A.slice(1);
        return A
    }
// @from(Ln 32432, Col 4)
xYK = (A, q, K, Y) => {
        A.prototype = Object.create(q.prototype, Y), A.prototype.constructor = A, Object.defineProperty(A, "super", {
            value: q.prototype
        }), K && Object.assign(A.prototype, K)
    }
// @from(Ln 32437, Col 4)
uYK = (A, q, K, Y) => {
        let z, _, w, O = {};
        if (q = q || {}, A == null) return q;
        do {
            z = Object.getOwnPropertyNames(A), _ = z.length;
            while (_-- > 0)
                if (w = z[_], (!Y || Y(w, A, q)) && !O[w]) q[w] = A[w], O[w] = !0;
            A = K !== !1 && qc1(A)
        } while (A && (!K || K(A, q)) && A !== Object.prototype);
        return q
    }
// @from(Ln 32448, Col 4)
mYK = (A, q, K) => {
        if (A = String(A), K === void 0 || K > A.length) K = A.length;
        K -= q.length;
        let Y = A.indexOf(q, K);
        return Y !== -1 && Y === K
    }
// @from(Ln 32454, Col 4)
BYK = (A) => {
        if (!A) return null;
        if (K$6(A)) return A;
        let q = A.length;
        if (!r2A(q)) return null;
        let K = Array(q);
        while (q-- > 0) K[q] = A[q];
        return K
    }
// @from(Ln 32463, Col 4)
gYK
// @from(Ln 32463, Col 9)
FYK = (A, q) => {
        let Y = (A && A[Symbol.iterator]).call(A),
            z;
        while ((z = Y.next()) && !z.done) {
            let _ = z.value;
            q.call(A, _[0], _[1])
        }
    }
// @from(Ln 32471, Col 4)
pYK = (A, q) => {
        let K, Y = [];
        while ((K = A.exec(q)) !== null) Y.push(K);
        return Y
    }
// @from(Ln 32476, Col 4)
QYK
// @from(Ln 32476, Col 9)
UYK = (A) => {
        return A.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function(K, Y, z) {
            return Y.toUpperCase() + z
        })
    }
// @from(Ln 32481, Col 4)
i2A
// @from(Ln 32481, Col 9)
dYK
// @from(Ln 32481, Col 14)
s2A = (A, q) => {
        let K = Object.getOwnPropertyDescriptors(A),
            Y = {};
        PL6(K, (z, _) => {
            let w;
            if ((w = q(z, _, A)) !== !1) Y[_] = w || z
        }), Object.defineProperties(A, Y)
    }
// @from(Ln 32489, Col 4)
cYK = (A) => {
        s2A(A, (q, K) => {
            if (GV(A) && ["arguments", "caller", "callee"].indexOf(K) !== -1) return !1;
            let Y = A[K];
            if (!GV(Y)) return;
            if (q.enumerable = !1, "writable" in q) {
                q.writable = !1;
                return
            }
            if (!q.set) q.set = () => {
                throw Error("Can not rewrite read-only method '" + K + "'")
            }
        })
    }
// @from(Ln 32503, Col 4)
lYK = (A, q) => {
        let K = {},
            Y = (z) => {
                z.forEach((_) => {
                    K[_] = !0
                })
            };
        return K$6(A) ? Y(A) : Y(String(A).split(q)), K
    }
// @from(Ln 32512, Col 4)
iYK = () => {}
// @from(Ln 32513, Col 4)
nYK = (A, q) => {
        return A != null && Number.isFinite(A = +A) ? A : q
    }
// @from(Ln 32516, Col 4)
oYK = (A) => {
        let q = [, , , , , , , , , , ],
            K = (Y, z) => {
                if (i11(Y)) {
                    if (q.indexOf(Y) >= 0) return;
                    if (!("toJSON" in Y)) {
                        q[z] = Y;
                        let _ = K$6(Y) ? [] : {};
                        return PL6(Y, (w, O) => {
                            let $ = K(w, z + 1);
                            !XL6($) && (_[O] = $)
                        }), q[z] = void 0, _
                    }
                }
                return Y
            };
        return K(A, 0)
    }
// @from(Ln 32534, Col 4)
aYK
// @from(Ln 32534, Col 9)
sYK = (A) => A && (i11(A) || GV(A)) && GV(A.then) && GV(A.catch)
// @from(Ln 32535, Col 4)
t2A
// @from(Ln 32535, Col 9)
tYK
// @from(Ln 32535, Col 14)
c1
// @from(Ln 32536, Col 4)
u2 = E(() => {
    ({
        toString: PYK
    } = Object.prototype), {
        getPrototypeOf: qc1
    } = Object, c11 = ((A) => (q) => {
        let K = PYK.call(q);
        return A[K] || (A[K] = K.slice(8, -1).toLowerCase())
    })(Object.create(null)), {
        isArray: K$6
    } = Array, XL6 = l11("undefined");
    n2A = SS("ArrayBuffer");
    GYK = l11("string"), GV = l11("function"), r2A = l11("number"), TYK = SS("Date"), vYK = SS("File"), NYK = SS("Blob"), VYK = SS("FileList"), yYK = SS("URLSearchParams"), [LYK, RYK, hYK, SYK] = ["ReadableStream", "Request", "Response", "Headers"].map(SS);
    gA6 = (() => {
        if (typeof globalThis < "u") return globalThis;
        return typeof self < "u" ? self : typeof window < "u" ? window : global
    })();
    gYK = ((A) => {
        return (q) => {
            return A && q instanceof A
        }
    })(typeof Uint8Array < "u" && qc1(Uint8Array)), QYK = SS("HTMLFormElement"), i2A = (({
        hasOwnProperty: A
    }) => (q, K) => A.call(q, K))(Object.prototype), dYK = SS("RegExp");
    aYK = SS("AsyncFunction"), t2A = ((A, q) => {
        if (A) return setImmediate;
        return q ? ((K, Y) => {
            return gA6.addEventListener("message", ({
                source: z,
                data: _
            }) => {
                if (z === gA6 && _ === K) Y.length && Y.shift()()
            }, !1), (z) => {
                Y.push(z), gA6.postMessage(K, "*")
            }
        })(`axios@${Math.random()}`, []) : (K) => setTimeout(K)
    })(typeof setImmediate === "function", GV(gA6.postMessage)), tYK = typeof queueMicrotask < "u" ? queueMicrotask.bind(gA6) : typeof process < "u" && process.nextTick || t2A, c1 = {
        isArray: K$6,
        isArrayBuffer: n2A,
        isBuffer: WYK,
        isFormData: EYK,
        isArrayBufferView: ZYK,
        isString: GYK,
        isNumber: r2A,
        isBoolean: fYK,
        isObject: i11,
        isPlainObject: d11,
        isReadableStream: LYK,
        isRequest: RYK,
        isResponse: hYK,
        isHeaders: SYK,
        isUndefined: XL6,
        isDate: TYK,
        isFile: vYK,
        isBlob: NYK,
        isRegExp: dYK,
        isFunction: GV,
        isStream: kYK,
        isURLSearchParams: yYK,
        isTypedArray: gYK,
        isFileList: VYK,
        forEach: PL6,
        merge: Ac1,
        extend: IYK,
        trim: CYK,
        stripBOM: bYK,
        inherits: xYK,
        toFlatObject: uYK,
        kindOf: c11,
        kindOfTest: SS,
        endsWith: mYK,
        toArray: BYK,
        forEachEntry: FYK,
        matchAll: pYK,
        isHTMLForm: QYK,
        hasOwnProperty: i2A,
        hasOwnProp: i2A,
        reduceDescriptors: s2A,
        freezeMethods: cYK,
        toObjectSet: lYK,
        toCamelCase: UYK,
        noop: iYK,
        toFiniteNumber: nYK,
        findKey: o2A,
        global: gA6,
        isContextDefined: a2A,
        isSpecCompliantForm: rYK,
        toJSONObject: oYK,
        isAsyncFn: aYK,
        isThenable: sYK,
        setImmediate: t2A,
        asap: tYK
    }
})
// @from(Ln 32631, Col 0)
function Y$6(A, q, K, Y, z) {
    if (Error.call(this), Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
    else this.stack = Error().stack;
    if (this.message = A, this.name = "AxiosError", q && (this.code = q), K && (this.config = K), Y && (this.request = Y), z) this.response = z, this.status = z.status ? z.status : null
}
// @from(Ln 32636, Col 4)
e2A
// @from(Ln 32636, Col 9)
AwA
// @from(Ln 32636, Col 14)
A4
// @from(Ln 32637, Col 4)
fV = E(() => {
    u2();
    c1.inherits(Y$6, Error, {
        toJSON: function() {
            return {
                message: this.message,
                name: this.name,
                description: this.description,
                number: this.number,
                fileName: this.fileName,
                lineNumber: this.lineNumber,
                columnNumber: this.columnNumber,
                stack: this.stack,
                config: c1.toJSONObject(this.config),
                code: this.code,
                status: this.status
            }
        }
    });
    e2A = Y$6.prototype, AwA = {};
    ["ERR_BAD_OPTION_VALUE", "ERR_BAD_OPTION", "ECONNABORTED", "ETIMEDOUT", "ERR_NETWORK", "ERR_FR_TOO_MANY_REDIRECTS", "ERR_DEPRECATED", "ERR_BAD_RESPONSE", "ERR_BAD_REQUEST", "ERR_CANCELED", "ERR_NOT_SUPPORT", "ERR_INVALID_URL"].forEach((A) => {
        AwA[A] = {
            value: A
        }
    });
    Object.defineProperties(Y$6, AwA);
    Object.defineProperty(e2A, "isAxiosError", {
        value: !0
    });
    Y$6.from = (A, q, K, Y, z, _) => {
        let w = Object.create(e2A);
        return c1.toFlatObject(A, w, function($) {
            return $ !== Error.prototype
        }, (O) => {
            return O !== "isAxiosError"
        }), Y$6.call(w, A.message, q, K, Y, z), w.cause = A, w.name = A.name, _ && Object.assign(w, _), w
    };
    A4 = Y$6
})
// @from(Ln 32676, Col 4)
YwA = x((mdz, KwA) => {
    var qwA = x6("stream").Stream,
        eYK = x6("util");
    KwA.exports = CS;

    function CS() {
        this.source = null, this.dataSize = 0, this.maxDataSize = 1048576, this.pauseStream = !0, this._maxDataSizeExceeded = !1, this._released = !1, this._bufferedEvents = []
    }
    eYK.inherits(CS, qwA);
    CS.create = function(A, q) {
        var K = new this;
        q = q || {};
        for (var Y in q) K[Y] = q[Y];
        K.source = A;
        var z = A.emit;
        if (A.emit = function() {
                return K._handleEmit(arguments), z.apply(A, arguments)
            }, A.on("error", function() {}), K.pauseStream) A.pause();
        return K
    };
    Object.defineProperty(CS.prototype, "readable", {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this.source.readable
        }
    });
    CS.prototype.setEncoding = function() {
        return this.source.setEncoding.apply(this.source, arguments)
    };
    CS.prototype.resume = function() {
        if (!this._released) this.release();
        this.source.resume()
    };
    CS.prototype.pause = function() {
        this.source.pause()
    };
    CS.prototype.release = function() {
        this._released = !0, this._bufferedEvents.forEach(function(A) {
            this.emit.apply(this, A)
        }.bind(this)), this._bufferedEvents = []
    };
    CS.prototype.pipe = function() {
        var A = qwA.prototype.pipe.apply(this, arguments);
        return this.resume(), A
    };
    CS.prototype._handleEmit = function(A) {
        if (this._released) {
            this.emit.apply(this, A);
            return
        }
        if (A[0] === "data") this.dataSize += A[1].length, this._checkIfMaxDataSizeExceeded();
        this._bufferedEvents.push(A)
    };
    CS.prototype._checkIfMaxDataSizeExceeded = function() {
        if (this._maxDataSizeExceeded) return;
        if (this.dataSize <= this.maxDataSize) return;
        this._maxDataSizeExceeded = !0;
        var A = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
        this.emit("error", Error(A))
    }
})
// @from(Ln 32738, Col 4)
OwA = x((Bdz, wwA) => {
    var AzK = x6("util"),
        _wA = x6("stream").Stream,
        zwA = YwA();
    wwA.exports = kH;

    function kH() {
        this.writable = !1, this.readable = !0, this.dataSize = 0, this.maxDataSize = 2097152, this.pauseStreams = !0, this._released = !1, this._streams = [], this._currentStream = null, this._insideLoop = !1, this._pendingNext = !1
    }
    AzK.inherits(kH, _wA);
    kH.create = function(A) {
        var q = new this;
        A = A || {};
        for (var K in A) q[K] = A[K];
        return q
    };
    kH.isStreamLike = function(A) {
        return typeof A !== "function" && typeof A !== "string" && typeof A !== "boolean" && typeof A !== "number" && !Buffer.isBuffer(A)
    };
    kH.prototype.append = function(A) {
        var q = kH.isStreamLike(A);
        if (q) {
            if (!(A instanceof zwA)) {
                var K = zwA.create(A, {
                    maxDataSize: 1 / 0,
                    pauseStream: this.pauseStreams
                });
                A.on("data", this._checkDataSize.bind(this)), A = K
            }
            if (this._handleErrors(A), this.pauseStreams) A.pause()
        }
        return this._streams.push(A), this
    };
    kH.prototype.pipe = function(A, q) {
        return _wA.prototype.pipe.call(this, A, q), this.resume(), A
    };
    kH.prototype._getNext = function() {
        if (this._currentStream = null, this._insideLoop) {
            this._pendingNext = !0;
            return
        }
        this._insideLoop = !0;
        try {
            do this._pendingNext = !1, this._realGetNext(); while (this._pendingNext)
        } finally {
            this._insideLoop = !1
        }
    };
    kH.prototype._realGetNext = function() {
        var A = this._streams.shift();
        if (typeof A > "u") {
            this.end();
            return
        }
        if (typeof A !== "function") {
            this._pipeNext(A);
            return
        }
        var q = A;
        q(function(K) {
            var Y = kH.isStreamLike(K);
            if (Y) K.on("data", this._checkDataSize.bind(this)), this._handleErrors(K);
            this._pipeNext(K)
        }.bind(this))
    };
    kH.prototype._pipeNext = function(A) {
        this._currentStream = A;
        var q = kH.isStreamLike(A);
        if (q) {
            A.on("end", this._getNext.bind(this)), A.pipe(this, {
                end: !1
            });
            return
        }
        var K = A;
        this.write(K), this._getNext()
    };
    kH.prototype._handleErrors = function(A) {
        var q = this;
        A.on("error", function(K) {
            q._emitError(K)
        })
    };
    kH.prototype.write = function(A) {
        this.emit("data", A)
    };
    kH.prototype.pause = function() {
        if (!this.pauseStreams) return;
        if (this.pauseStreams && this._currentStream && typeof this._currentStream.pause == "function") this._currentStream.pause();
        this.emit("pause")
    };
    kH.prototype.resume = function() {
        if (!this._released) this._released = !0, this.writable = !0, this._getNext();
        if (this.pauseStreams && this._currentStream && typeof this._currentStream.resume == "function") this._currentStream.resume();
        this.emit("resume")
    };
    kH.prototype.end = function() {
        this._reset(), this.emit("end")
    };
    kH.prototype.destroy = function() {
        this._reset(), this.emit("close")
    };
    kH.prototype._reset = function() {
        this.writable = !1, this._streams = [], this._currentStream = null
    };
    kH.prototype._checkDataSize = function() {
        if (this._updateDataSize(), this.dataSize <= this.maxDataSize) return;
        var A = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
        this._emitError(Error(A))
    };
    kH.prototype._updateDataSize = function() {
        this.dataSize = 0;
        var A = this;
        if (this._streams.forEach(function(q) {
                if (!q.dataSize) return;
                A.dataSize += q.dataSize
            }), this._currentStream && this._currentStream.dataSize) this.dataSize += this._currentStream.dataSize
    };
    kH.prototype._emitError = function(A) {
        this._reset(), this.emit("error", A)
    }
})
// @from(Ln 32860, Col 4)
HwA = x((gdz, $wA) => {
    var WL6 = (A) => () => {
        throw Error("mime-types." + A + "() is stubbed in this build. Do not rely on axios auto-multipart serialization (plain object + Content-Type: multipart/form-data). Use native FormData or hand-roll the multipart body instead. See scripts/build-with-plugins.ts stubMimeTypes plugin.")
    };
    $wA.exports = {
        lookup: WL6("lookup"),
        contentType: WL6("contentType"),
        extension: WL6("extension"),
        charset: WL6("charset"),
        extensions: Object.create(null),
        types: Object.create(null),
        charsets: {
            lookup: WL6("charsets.lookup")
        }
    }
})
// @from(Ln 32876, Col 4)
JwA = x((Fdz, jwA) => {
    jwA.exports = qzK;

    function qzK(A) {
        var q = typeof setImmediate == "function" ? setImmediate : typeof process == "object" && typeof process.nextTick == "function" ? process.nextTick : null;
        if (q) q(A);
        else setTimeout(A, 0)
    }
})
// @from(Ln 32885, Col 4)
Kc1 = x((pdz, DwA) => {
    var MwA = JwA();
    DwA.exports = KzK;

    function KzK(A) {
        var q = !1;
        return MwA(function() {
                q = !0
            }),
            function(Y, z) {
                if (q) A(Y, z);
                else MwA(function() {
                    A(Y, z)
                })
            }
    }
})
// @from(Ln 32902, Col 4)
Yc1 = x((Qdz, XwA) => {
    XwA.exports = YzK;

    function YzK(A) {
        Object.keys(A.jobs).forEach(zzK.bind(A)), A.jobs = {}
    }

    function zzK(A) {
        if (typeof this.jobs[A] == "function") this.jobs[A]()
    }
})
// @from(Ln 32913, Col 4)
zc1 = x((Udz, WwA) => {
    var PwA = Kc1(),
        _zK = Yc1();
    WwA.exports = wzK;

    function wzK(A, q, K, Y) {
        var z = K.keyedList ? K.keyedList[K.index] : K.index;
        K.jobs[z] = OzK(q, z, A[z], function(_, w) {
            if (!(z in K.jobs)) return;
            if (delete K.jobs[z], _) _zK(K);
            else K.results[z] = w;
            Y(_, K.results)
        })
    }

    function OzK(A, q, K, Y) {
        var z;
        if (A.length == 2) z = A(K, PwA(Y));
        else z = A(K, q, PwA(Y));
        return z
    }
})
// @from(Ln 32935, Col 4)
_c1 = x((ddz, ZwA) => {
    ZwA.exports = $zK;

    function $zK(A, q) {
        var K = !Array.isArray(A),
            Y = {
                index: 0,
                keyedList: K || q ? Object.keys(A) : null,
                jobs: {},
                results: K ? {} : [],
                size: K ? Object.keys(A).length : A.length
            };
        if (q) Y.keyedList.sort(K ? q : function(z, _) {
            return q(A[z], A[_])
        });
        return Y
    }
})
// @from(Ln 32953, Col 4)
wc1 = x((cdz, GwA) => {
    var HzK = Yc1(),
        jzK = Kc1();
    GwA.exports = JzK;

    function JzK(A) {
        if (!Object.keys(this.jobs).length) return;
        this.index = this.size, HzK(this), jzK(A)(null, this.results)
    }
})
// @from(Ln 32963, Col 4)
TwA = x((ldz, fwA) => {
    var MzK = zc1(),
        DzK = _c1(),
        XzK = wc1();
    fwA.exports = PzK;

    function PzK(A, q, K) {
        var Y = DzK(A);
        while (Y.index < (Y.keyedList || A).length) MzK(A, q, Y, function(z, _) {
            if (z) {
                K(z, _);
                return
            }
            if (Object.keys(Y.jobs).length === 0) {
                K(null, Y.results);
                return
            }
        }), Y.index++;
        return XzK.bind(Y, K)
    }
})
// @from(Ln 32984, Col 4)
Oc1 = x((idz, n11) => {
    var vwA = zc1(),
        WzK = _c1(),
        ZzK = wc1();
    n11.exports = GzK;
    n11.exports.ascending = NwA;
    n11.exports.descending = fzK;

    function GzK(A, q, K, Y) {
        var z = WzK(A, K);
        return vwA(A, q, z, function _(w, O) {
            if (w) {
                Y(w, O);
                return
            }
            if (z.index++, z.index < (z.keyedList || A).length) {
                vwA(A, q, z, _);
                return
            }
            Y(null, z.results)
        }), ZzK.bind(z, Y)
    }

    function NwA(A, q) {
        return A < q ? -1 : A > q ? 1 : 0
    }

    function fzK(A, q) {
        return -1 * NwA(A, q)
    }
})
// @from(Ln 33015, Col 4)
kwA = x((ndz, VwA) => {
    var TzK = Oc1();
    VwA.exports = vzK;

    function vzK(A, q, K) {
        return TzK(A, q, null, K)
    }
})
// @from(Ln 33023, Col 4)
ywA = x((rdz, EwA) => {
    EwA.exports = {
        parallel: TwA(),
        serial: kwA(),
        serialOrdered: Oc1()
    }
})
// @from(Ln 33030, Col 4)
$c1 = x((odz, LwA) => {
    LwA.exports = Object
})
// @from(Ln 33033, Col 4)
hwA = x((adz, RwA) => {
    RwA.exports = Error
})
// @from(Ln 33036, Col 4)
CwA = x((sdz, SwA) => {
    SwA.exports = EvalError
})
// @from(Ln 33039, Col 4)
bwA = x((tdz, IwA) => {
    IwA.exports = RangeError
})
// @from(Ln 33042, Col 4)
uwA = x((edz, xwA) => {
    xwA.exports = ReferenceError
})
// @from(Ln 33045, Col 4)
BwA = x((Acz, mwA) => {
    mwA.exports = SyntaxError
})
// @from(Ln 33048, Col 4)
r11 = x((qcz, gwA) => {
    gwA.exports = TypeError
})
// @from(Ln 33051, Col 4)
pwA = x((Kcz, FwA) => {
    FwA.exports = URIError
})
// @from(Ln 33054, Col 4)
UwA = x((Ycz, QwA) => {
    QwA.exports = Math.abs
})
// @from(Ln 33057, Col 4)
cwA = x((zcz, dwA) => {
    dwA.exports = Math.floor
})
// @from(Ln 33060, Col 4)
iwA = x((_cz, lwA) => {
    lwA.exports = Math.max
})
// @from(Ln 33063, Col 4)
rwA = x((wcz, nwA) => {
    nwA.exports = Math.min
})
// @from(Ln 33066, Col 4)
awA = x((Ocz, owA) => {
    owA.exports = Math.pow
})
// @from(Ln 33069, Col 4)
twA = x(($cz, swA) => {
    swA.exports = Math.round
})
// @from(Ln 33072, Col 4)
AOA = x((Hcz, ewA) => {
    ewA.exports = Number.isNaN || function(q) {
        return q !== q
    }
})
// @from(Ln 33077, Col 4)
KOA = x((jcz, qOA) => {
    var NzK = AOA();
    qOA.exports = function(q) {
        if (NzK(q) || q === 0) return q;
        return q < 0 ? -1 : 1
    }
})
// @from(Ln 33084, Col 4)
zOA = x((Jcz, YOA) => {
    YOA.exports = Object.getOwnPropertyDescriptor
})
// @from(Ln 33087, Col 4)
Hc1 = x((Mcz, _OA) => {
    var o11 = zOA();
    if (o11) try {
        o11([], "length")
    } catch (A) {
        o11 = null
    }
    _OA.exports = o11
})
// @from(Ln 33096, Col 4)
OOA = x((Dcz, wOA) => {
    var a11 = Object.defineProperty || !1;
    if (a11) try {
        a11({}, "a", {
            value: 1
        })
    } catch (A) {
        a11 = !1
    }
    wOA.exports = a11
})
// @from(Ln 33107, Col 4)
jc1 = x((Xcz, $OA) => {
    $OA.exports = function() {
        if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") return !1;
        if (typeof Symbol.iterator === "symbol") return !0;
        var q = {},
            K = Symbol("test"),
            Y = Object(K);
        if (typeof K === "string") return !1;
        if (Object.prototype.toString.call(K) !== "[object Symbol]") return !1;
        if (Object.prototype.toString.call(Y) !== "[object Symbol]") return !1;
        var z = 42;
        q[K] = z;
        for (var _ in q) return !1;
        if (typeof Object.keys === "function" && Object.keys(q).length !== 0) return !1;
        if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(q).length !== 0) return !1;
        var w = Object.getOwnPropertySymbols(q);
        if (w.length !== 1 || w[0] !== K) return !1;
        if (!Object.prototype.propertyIsEnumerable.call(q, K)) return !1;
        if (typeof Object.getOwnPropertyDescriptor === "function") {
            var O = Object.getOwnPropertyDescriptor(q, K);
            if (O.value !== z || O.enumerable !== !0) return !1
        }
        return !0
    }
})
// @from(Ln 33132, Col 4)
JOA = x((Pcz, jOA) => {
    var HOA = typeof Symbol < "u" && Symbol,
        VzK = jc1();
    jOA.exports = function() {
        if (typeof HOA !== "function") return !1;
        if (typeof Symbol !== "function") return !1;
        if (typeof HOA("foo") !== "symbol") return !1;
        if (typeof Symbol("bar") !== "symbol") return !1;
        return VzK()
    }
})
// @from(Ln 33143, Col 4)
Jc1 = x((Wcz, MOA) => {
    MOA.exports = typeof Reflect < "u" && Reflect.getPrototypeOf || null
})
// @from(Ln 33146, Col 4)
Mc1 = x((Zcz, DOA) => {
    var kzK = $c1();
    DOA.exports = kzK.getPrototypeOf || null
})
// @from(Ln 33150, Col 4)
WOA = x((Gcz, POA) => {
    var EzK = "Function.prototype.bind called on incompatible ",
        yzK = Object.prototype.toString,
        LzK = Math.max,
        RzK = "[object Function]",
        XOA = function(q, K) {
            var Y = [];
            for (var z = 0; z < q.length; z += 1) Y[z] = q[z];
            for (var _ = 0; _ < K.length; _ += 1) Y[_ + q.length] = K[_];
            return Y
        },
        hzK = function(q, K) {
            var Y = [];
            for (var z = K || 0, _ = 0; z < q.length; z += 1, _ += 1) Y[_] = q[z];
            return Y
        },
        SzK = function(A, q) {
            var K = "";
            for (var Y = 0; Y < A.length; Y += 1)
                if (K += A[Y], Y + 1 < A.length) K += q;
            return K
        };
    POA.exports = function(q) {
        var K = this;
        if (typeof K !== "function" || yzK.apply(K) !== RzK) throw TypeError(EzK + K);
        var Y = hzK(arguments, 1),
            z, _ = function() {
                if (this instanceof z) {
                    var j = K.apply(this, XOA(Y, arguments));
                    if (Object(j) === j) return j;
                    return this
                }
                return K.apply(q, XOA(Y, arguments))
            },
            w = LzK(0, K.length - Y.length),
            O = [];
        for (var $ = 0; $ < w; $++) O[$] = "$" + $;
        if (z = Function("binder", "return function (" + SzK(O, ",") + "){ return binder.apply(this,arguments); }")(_), K.prototype) {
            var H = function() {};
            H.prototype = K.prototype, z.prototype = new H, H.prototype = null
        }
        return z
    }
})
// @from(Ln 33194, Col 4)
ZL6 = x((fcz, ZOA) => {
    var CzK = WOA();
    ZOA.exports = Function.prototype.bind || CzK
})
// @from(Ln 33198, Col 4)
s11 = x((Tcz, GOA) => {
    GOA.exports = Function.prototype.call
})
// @from(Ln 33201, Col 4)
Dc1 = x((vcz, fOA) => {
    fOA.exports = Function.prototype.apply
})
// @from(Ln 33204, Col 4)
vOA = x((Ncz, TOA) => {
    TOA.exports = typeof Reflect < "u" && Reflect && Reflect.apply
})
// @from(Ln 33207, Col 4)
VOA = x((Vcz, NOA) => {
    var IzK = ZL6(),
        bzK = Dc1(),
        xzK = s11(),
        uzK = vOA();
    NOA.exports = uzK || IzK.call(xzK, bzK)
})
// @from(Ln 33214, Col 4)
EOA = x((kcz, kOA) => {
    var mzK = ZL6(),
        BzK = r11(),
        gzK = s11(),
        FzK = VOA();
    kOA.exports = function(q) {
        if (q.length < 1 || typeof q[0] !== "function") throw new BzK("a function is required");
        return FzK(mzK, gzK, q)
    }
})
// @from(Ln 33224, Col 4)
COA = x((Ecz, SOA) => {
    var pzK = EOA(),
        yOA = Hc1(),
        ROA;
    try {
        ROA = [].__proto__ === Array.prototype
    } catch (A) {
        if (!A || typeof A !== "object" || !("code" in A) || A.code !== "ERR_PROTO_ACCESS") throw A
    }
    var Xc1 = !!ROA && yOA && yOA(Object.prototype, "__proto__"),
        hOA = Object,
        LOA = hOA.getPrototypeOf;
    SOA.exports = Xc1 && typeof Xc1.get === "function" ? pzK([Xc1.get]) : typeof LOA === "function" ? function(q) {
        return LOA(q == null ? q : hOA(q))
    } : !1
})
// @from(Ln 33240, Col 4)
mOA = x((ycz, uOA) => {
    var IOA = Jc1(),
        bOA = Mc1(),
        xOA = COA();
    uOA.exports = IOA ? function(q) {
        return IOA(q)
    } : bOA ? function(q) {
        if (!q || typeof q !== "object" && typeof q !== "function") throw TypeError("getProto: not an object");
        return bOA(q)
    } : xOA ? function(q) {
        return xOA(q)
    } : null
})
// @from(Ln 33253, Col 4)
Pc1 = x((Lcz, BOA) => {
    var QzK = Function.prototype.call,
        UzK = Object.prototype.hasOwnProperty,
        dzK = ZL6();
    BOA.exports = dzK.call(QzK, UzK)
})
// @from(Ln 33259, Col 4)
dOA = x((Rcz, UOA) => {
    var W9, czK = $c1(),
        lzK = hwA(),
        izK = CwA(),
        nzK = bwA(),
        rzK = uwA(),
        O$6 = BwA(),
        w$6 = r11(),
        ozK = pwA(),
        azK = UwA(),
        szK = cwA(),
        tzK = iwA(),
        ezK = rwA(),
        A_K = awA(),
        q_K = twA(),
        K_K = KOA(),
        pOA = Function,
        Wc1 = function(A) {
            try {
                return pOA('"use strict"; return (' + A + ").constructor;")()
            } catch (q) {}
        },
        GL6 = Hc1(),
        Y_K = OOA(),
        Zc1 = function() {
            throw new w$6
        },
        z_K = GL6 ? function() {
            try {
                return arguments.callee, Zc1
            } catch (A) {
                try {
                    return GL6(arguments, "callee").get
                } catch (q) {
                    return Zc1
                }
            }
        }() : Zc1,
        z$6 = JOA()(),
        ID = mOA(),
        __K = Mc1(),
        w_K = Jc1(),
        QOA = Dc1(),
        fL6 = s11(),
        _$6 = {},
        O_K = typeof Uint8Array > "u" || !ID ? W9 : ID(Uint8Array),
        FA6 = {
            __proto__: null,
            "%AggregateError%": typeof AggregateError > "u" ? W9 : AggregateError,
            "%Array%": Array,
            "%ArrayBuffer%": typeof ArrayBuffer > "u" ? W9 : ArrayBuffer,
            "%ArrayIteratorPrototype%": z$6 && ID ? ID([][Symbol.iterator]()) : W9,
            "%AsyncFromSyncIteratorPrototype%": W9,
            "%AsyncFunction%": _$6,
            "%AsyncGenerator%": _$6,
            "%AsyncGeneratorFunction%": _$6,
            "%AsyncIteratorPrototype%": _$6,
            "%Atomics%": typeof Atomics > "u" ? W9 : Atomics,
            "%BigInt%": typeof BigInt > "u" ? W9 : BigInt,
            "%BigInt64Array%": typeof BigInt64Array > "u" ? W9 : BigInt64Array,
            "%BigUint64Array%": typeof BigUint64Array > "u" ? W9 : BigUint64Array,
            "%Boolean%": Boolean,
            "%DataView%": typeof DataView > "u" ? W9 : DataView,
            "%Date%": Date,
            "%decodeURI%": decodeURI,
            "%decodeURIComponent%": decodeURIComponent,
            "%encodeURI%": encodeURI,
            "%encodeURIComponent%": encodeURIComponent,
            "%Error%": lzK,
            "%eval%": eval,
            "%EvalError%": izK,
            "%Float16Array%": typeof Float16Array > "u" ? W9 : Float16Array,
            "%Float32Array%": typeof Float32Array > "u" ? W9 : Float32Array,
            "%Float64Array%": typeof Float64Array > "u" ? W9 : Float64Array,
            "%FinalizationRegistry%": typeof FinalizationRegistry > "u" ? W9 : FinalizationRegistry,
            "%Function%": pOA,
            "%GeneratorFunction%": _$6,
            "%Int8Array%": typeof Int8Array > "u" ? W9 : Int8Array,
            "%Int16Array%": typeof Int16Array > "u" ? W9 : Int16Array,
            "%Int32Array%": typeof Int32Array > "u" ? W9 : Int32Array,
            "%isFinite%": isFinite,
            "%isNaN%": isNaN,
            "%IteratorPrototype%": z$6 && ID ? ID(ID([][Symbol.iterator]())) : W9,
            "%JSON%": typeof JSON === "object" ? JSON : W9,
            "%Map%": typeof Map > "u" ? W9 : Map,
            "%MapIteratorPrototype%": typeof Map > "u" || !z$6 || !ID ? W9 : ID(new Map()[Symbol.iterator]()),
            "%Math%": Math,
            "%Number%": Number,
            "%Object%": czK,
            "%Object.getOwnPropertyDescriptor%": GL6,
            "%parseFloat%": parseFloat,
            "%parseInt%": parseInt,
            "%Promise%": typeof Promise > "u" ? W9 : Promise,
            "%Proxy%": typeof Proxy > "u" ? W9 : Proxy,
            "%RangeError%": nzK,
            "%ReferenceError%": rzK,
            "%Reflect%": typeof Reflect > "u" ? W9 : Reflect,
            "%RegExp%": RegExp,
            "%Set%": typeof Set > "u" ? W9 : Set,
            "%SetIteratorPrototype%": typeof Set > "u" || !z$6 || !ID ? W9 : ID(new Set()[Symbol.iterator]()),
            "%SharedArrayBuffer%": typeof SharedArrayBuffer > "u" ? W9 : SharedArrayBuffer,
            "%String%": String,
            "%StringIteratorPrototype%": z$6 && ID ? ID("" [Symbol.iterator]()) : W9,
            "%Symbol%": z$6 ? Symbol : W9,
            "%SyntaxError%": O$6,
            "%ThrowTypeError%": z_K,
            "%TypedArray%": O_K,
            "%TypeError%": w$6,
            "%Uint8Array%": typeof Uint8Array > "u" ? W9 : Uint8Array,
            "%Uint8ClampedArray%": typeof Uint8ClampedArray > "u" ? W9 : Uint8ClampedArray,
            "%Uint16Array%": typeof Uint16Array > "u" ? W9 : Uint16Array,
            "%Uint32Array%": typeof Uint32Array > "u" ? W9 : Uint32Array,
            "%URIError%": ozK,
            "%WeakMap%": typeof WeakMap > "u" ? W9 : WeakMap,
            "%WeakRef%": typeof WeakRef > "u" ? W9 : WeakRef,
            "%WeakSet%": typeof WeakSet > "u" ? W9 : WeakSet,
            "%Function.prototype.call%": fL6,
            "%Function.prototype.apply%": QOA,
            "%Object.defineProperty%": Y_K,
            "%Object.getPrototypeOf%": __K,
            "%Math.abs%": azK,
            "%Math.floor%": szK,
            "%Math.max%": tzK,
            "%Math.min%": ezK,
            "%Math.pow%": A_K,
            "%Math.round%": q_K,
            "%Math.sign%": K_K,
            "%Reflect.getPrototypeOf%": w_K
        };
    if (ID) try {
        null.error
    } catch (A) {
        Gc1 = ID(ID(A)), FA6["%Error.prototype%"] = Gc1
    }
    var Gc1, $_K = function A(q) {
            var K;
            if (q === "%AsyncFunction%") K = Wc1("async function () {}");
            else if (q === "%GeneratorFunction%") K = Wc1("function* () {}");
            else if (q === "%AsyncGeneratorFunction%") K = Wc1("async function* () {}");
            else if (q === "%AsyncGenerator%") {
                var Y = A("%AsyncGeneratorFunction%");
                if (Y) K = Y.prototype
            } else if (q === "%AsyncIteratorPrototype%") {
                var z = A("%AsyncGenerator%");
                if (z && ID) K = ID(z.prototype)
            }
            return FA6[q] = K, K
        },
        gOA = {
            __proto__: null,
            "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
            "%ArrayPrototype%": ["Array", "prototype"],
            "%ArrayProto_entries%": ["Array", "prototype", "entries"],
            "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
            "%ArrayProto_keys%": ["Array", "prototype", "keys"],
            "%ArrayProto_values%": ["Array", "prototype", "values"],
            "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
            "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
            "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
            "%BooleanPrototype%": ["Boolean", "prototype"],
            "%DataViewPrototype%": ["DataView", "prototype"],
            "%DatePrototype%": ["Date", "prototype"],
            "%ErrorPrototype%": ["Error", "prototype"],
            "%EvalErrorPrototype%": ["EvalError", "prototype"],
            "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
            "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
            "%FunctionPrototype%": ["Function", "prototype"],
            "%Generator%": ["GeneratorFunction", "prototype"],
            "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
            "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
            "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
            "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
            "%JSONParse%": ["JSON", "parse"],
            "%JSONStringify%": ["JSON", "stringify"],
            "%MapPrototype%": ["Map", "prototype"],
            "%NumberPrototype%": ["Number", "prototype"],
            "%ObjectPrototype%": ["Object", "prototype"],
            "%ObjProto_toString%": ["Object", "prototype", "toString"],
            "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
            "%PromisePrototype%": ["Promise", "prototype"],
            "%PromiseProto_then%": ["Promise", "prototype", "then"],
            "%Promise_all%": ["Promise", "all"],
            "%Promise_reject%": ["Promise", "reject"],
            "%Promise_resolve%": ["Promise", "resolve"],
            "%RangeErrorPrototype%": ["RangeError", "prototype"],
            "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
            "%RegExpPrototype%": ["RegExp", "prototype"],
            "%SetPrototype%": ["Set", "prototype"],
            "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
            "%StringPrototype%": ["String", "prototype"],
            "%SymbolPrototype%": ["Symbol", "prototype"],
            "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
            "%TypedArrayPrototype%": ["TypedArray", "prototype"],
            "%TypeErrorPrototype%": ["TypeError", "prototype"],
            "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
            "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
            "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
            "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
            "%URIErrorPrototype%": ["URIError", "prototype"],
            "%WeakMapPrototype%": ["WeakMap", "prototype"],
            "%WeakSetPrototype%": ["WeakSet", "prototype"]
        },
        TL6 = ZL6(),
        t11 = Pc1(),
        H_K = TL6.call(fL6, Array.prototype.concat),
        j_K = TL6.call(QOA, Array.prototype.splice),
        FOA = TL6.call(fL6, String.prototype.replace),
        e11 = TL6.call(fL6, String.prototype.slice),
        J_K = TL6.call(fL6, RegExp.prototype.exec),
        M_K = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g,
        D_K = /\\(\\)?/g,
        X_K = function(q) {
            var K = e11(q, 0, 1),
                Y = e11(q, -1);
            if (K === "%" && Y !== "%") throw new O$6("invalid intrinsic syntax, expected closing `%`");
            else if (Y === "%" && K !== "%") throw new O$6("invalid intrinsic syntax, expected opening `%`");
            var z = [];
            return FOA(q, M_K, function(_, w, O, $) {
                z[z.length] = O ? FOA($, D_K, "$1") : w || _
            }), z
        },
        P_K = function(q, K) {
            var Y = q,
                z;
            if (t11(gOA, Y)) z = gOA[Y], Y = "%" + z[0] + "%";
            if (t11(FA6, Y)) {
                var _ = FA6[Y];
                if (_ === _$6) _ = $_K(Y);
                if (typeof _ > "u" && !K) throw new w$6("intrinsic " + q + " exists, but is not available. Please file an issue!");
                return {
                    alias: z,
                    name: Y,
                    value: _
                }
            }
            throw new O$6("intrinsic " + q + " does not exist!")
        };
    UOA.exports = function(q, K) {
        if (typeof q !== "string" || q.length === 0) throw new w$6("intrinsic name must be a non-empty string");
        if (arguments.length > 1 && typeof K !== "boolean") throw new w$6('"allowMissing" argument must be a boolean');
        if (J_K(/^%?[^%]*%?$/, q) === null) throw new O$6("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
        var Y = X_K(q),
            z = Y.length > 0 ? Y[0] : "",
            _ = P_K("%" + z + "%", K),
            w = _.name,
            O = _.value,
            $ = !1,
            H = _.alias;
        if (H) z = H[0], j_K(Y, H_K([0, 1], H));
        for (var j = 1, J = !0; j < Y.length; j += 1) {
            var M = Y[j],
                D = e11(M, 0, 1),
                X = e11(M, -1);
            if ((D === '"' || D === "'" || D === "`" || (X === '"' || X === "'" || X === "`")) && D !== X) throw new O$6("property names with quotes must have matching quotes");
            if (M === "constructor" || !J) $ = !0;
            if (z += "." + M, w = "%" + z + "%", t11(FA6, w)) O = FA6[w];
            else if (O != null) {
                if (!(M in O)) {
                    if (!K) throw new w$6("base intrinsic for " + q + " exists, but the property is not available.");
                    return
                }
                if (GL6 && j + 1 >= Y.length) {
                    var P = GL6(O, M);
                    if (J = !!P, J && "get" in P && !("originalValue" in P.get)) O = P.get;
                    else O = O[M]
                } else J = t11(O, M), O = O[M];
                if (J && !$) FA6[w] = O
            }
        }
        return O
    }
})
// @from(Ln 33531, Col 4)
lOA = x((hcz, cOA) => {
    var W_K = jc1();
    cOA.exports = function() {
        return W_K() && !!Symbol.toStringTag
    }
})
// @from(Ln 33537, Col 4)
rOA = x((Scz, nOA) => {
    var Z_K = dOA(),
        iOA = Z_K("%Object.defineProperty%", !0),
        G_K = lOA()(),
        f_K = Pc1(),
        T_K = r11(),
        A81 = G_K ? Symbol.toStringTag : null;
    nOA.exports = function(q, K) {
        var Y = arguments.length > 2 && !!arguments[2] && arguments[2].force,
            z = arguments.length > 2 && !!arguments[2] && arguments[2].nonConfigurable;
        if (typeof Y < "u" && typeof Y !== "boolean" || typeof z < "u" && typeof z !== "boolean") throw new T_K("if provided, the `overrideIfSet` and `nonConfigurable` options must be booleans");
        if (A81 && (Y || !f_K(q, A81)))
            if (iOA) iOA(q, A81, {
                configurable: !z,
                enumerable: !1,
                value: K,
                writable: !1
            });
            else q[A81] = K
    }
})
// @from(Ln 33558, Col 4)
aOA = x((Ccz, oOA) => {
    oOA.exports = function(A, q) {
        return Object.keys(q).forEach(function(K) {
            A[K] = A[K] || q[K]
        }), A
    }
})
// @from(Ln 33565, Col 4)
tOA = x((Icz, sOA) => {
    var Nc1 = OwA(),
        v_K = x6("util"),
        fc1 = x6("path"),
        N_K = x6("http"),
        V_K = x6("https"),
        k_K = x6("url").parse,
        E_K = x6("fs"),
        y_K = x6("stream").Stream,
        Tc1 = HwA(),
        L_K = ywA(),
        R_K = rOA(),
        vc1 = aOA();
    sOA.exports = kY;
    v_K.inherits(kY, Nc1);

    function kY(A) {
        if (!(this instanceof kY)) return new kY(A);
        this._overheadLength = 0, this._valueLength = 0, this._valuesToMeasure = [], Nc1.call(this), A = A || {};
        for (var q in A) this[q] = A[q]
    }
    kY.LINE_BREAK = `\r
`;
    kY.DEFAULT_CONTENT_TYPE = "application/octet-stream";
    kY.prototype.append = function(A, q, K) {
        if (K = K || {}, typeof K == "string") K = {
            filename: K
        };
        var Y = Nc1.prototype.append.bind(this);
        if (typeof q == "number") q = "" + q;
        if (Array.isArray(q)) {
            this._error(Error("Arrays are not supported."));
            return
        }
        var z = this._multiPartHeader(A, q, K),
            _ = this._multiPartFooter();
        Y(z), Y(q), Y(_), this._trackLength(z, q, K)
    };
    kY.prototype._trackLength = function(A, q, K) {
        var Y = 0;
        if (K.knownLength != null) Y += +K.knownLength;
        else if (Buffer.isBuffer(q)) Y = q.length;
        else if (typeof q === "string") Y = Buffer.byteLength(q);
        if (this._valueLength += Y, this._overheadLength += Buffer.byteLength(A) + kY.LINE_BREAK.length, !q || !q.path && !(q.readable && Object.prototype.hasOwnProperty.call(q, "httpVersion")) && !(q instanceof y_K)) return;
        if (!K.knownLength) this._valuesToMeasure.push(q)
    };
    kY.prototype._lengthRetriever = function(A, q) {
        if (Object.prototype.hasOwnProperty.call(A, "fd"))
            if (A.end != null && A.end != 1 / 0 && A.start != null) q(null, A.end + 1 - (A.start ? A.start : 0));
            else E_K.stat(A.path, function(K, Y) {
                var z;
                if (K) {
                    q(K);
                    return
                }
                z = Y.size - (A.start ? A.start : 0), q(null, z)
            });
        else if (Object.prototype.hasOwnProperty.call(A, "httpVersion")) q(null, +A.headers["content-length"]);
        else if (Object.prototype.hasOwnProperty.call(A, "httpModule")) A.on("response", function(K) {
            A.pause(), q(null, +K.headers["content-length"])
        }), A.resume();
        else q("Unknown stream")
    };
    kY.prototype._multiPartHeader = function(A, q, K) {
        if (typeof K.header == "string") return K.header;
        var Y = this._getContentDisposition(q, K),
            z = this._getContentType(q, K),
            _ = "",
            w = {
                "Content-Disposition": ["form-data", 'name="' + A + '"'].concat(Y || []),
                "Content-Type": [].concat(z || [])
            };
        if (typeof K.header == "object") vc1(w, K.header);
        var O;
        for (var $ in w)
            if (Object.prototype.hasOwnProperty.call(w, $)) {
                if (O = w[$], O == null) continue;
                if (!Array.isArray(O)) O = [O];
                if (O.length) _ += $ + ": " + O.join("; ") + kY.LINE_BREAK
            } return "--" + this.getBoundary() + kY.LINE_BREAK + _ + kY.LINE_BREAK
    };
    kY.prototype._getContentDisposition = function(A, q) {
        var K, Y;
        if (typeof q.filepath === "string") K = fc1.normalize(q.filepath).replace(/\\/g, "/");
        else if (q.filename || A.name || A.path) K = fc1.basename(q.filename || A.name || A.path);
        else if (A.readable && Object.prototype.hasOwnProperty.call(A, "httpVersion")) K = fc1.basename(A.client._httpMessage.path || "");
        if (K) Y = 'filename="' + K + '"';
        return Y
    };
    kY.prototype._getContentType = function(A, q) {
        var K = q.contentType;
        if (!K && A.name) K = Tc1.lookup(A.name);
        if (!K && A.path) K = Tc1.lookup(A.path);
        if (!K && A.readable && Object.prototype.hasOwnProperty.call(A, "httpVersion")) K = A.headers["content-type"];
        if (!K && (q.filepath || q.filename)) K = Tc1.lookup(q.filepath || q.filename);
        if (!K && typeof A == "object") K = kY.DEFAULT_CONTENT_TYPE;
        return K
    };
    kY.prototype._multiPartFooter = function() {
        return function(A) {
            var q = kY.LINE_BREAK,
                K = this._streams.length === 0;
            if (K) q += this._lastBoundary();
            A(q)
        }.bind(this)
    };
    kY.prototype._lastBoundary = function() {
        return "--" + this.getBoundary() + "--" + kY.LINE_BREAK
    };
    kY.prototype.getHeaders = function(A) {
        var q, K = {
            "content-type": "multipart/form-data; boundary=" + this.getBoundary()
        };
        for (q in A)
            if (Object.prototype.hasOwnProperty.call(A, q)) K[q.toLowerCase()] = A[q];
        return K
    };
    kY.prototype.setBoundary = function(A) {
        this._boundary = A
    };
    kY.prototype.getBoundary = function() {
        if (!this._boundary) this._generateBoundary();
        return this._boundary
    };
    kY.prototype.getBuffer = function() {
        var A = new Buffer.alloc(0),
            q = this.getBoundary();
        for (var K = 0, Y = this._streams.length; K < Y; K++)
            if (typeof this._streams[K] !== "function") {
                if (Buffer.isBuffer(this._streams[K])) A = Buffer.concat([A, this._streams[K]]);
                else A = Buffer.concat([A, Buffer.from(this._streams[K])]);
                if (typeof this._streams[K] !== "string" || this._streams[K].substring(2, q.length + 2) !== q) A = Buffer.concat([A, Buffer.from(kY.LINE_BREAK)])
            } return Buffer.concat([A, Buffer.from(this._lastBoundary())])
    };
    kY.prototype._generateBoundary = function() {
        var A = "--------------------------";
        for (var q = 0; q < 24; q++) A += Math.floor(Math.random() * 10).toString(16);
        this._boundary = A
    };
    kY.prototype.getLengthSync = function() {
        var A = this._overheadLength + this._valueLength;
        if (this._streams.length) A += this._lastBoundary().length;
        if (!this.hasKnownLength()) this._error(Error("Cannot calculate proper length in synchronous way."));
        return A
    };
    kY.prototype.hasKnownLength = function() {
        var A = !0;
        if (this._valuesToMeasure.length) A = !1;
        return A
    };
    kY.prototype.getLength = function(A) {
        var q = this._overheadLength + this._valueLength;
        if (this._streams.length) q += this._lastBoundary().length;
        if (!this._valuesToMeasure.length) {
            process.nextTick(A.bind(this, null, q));
            return
        }
        L_K.parallel(this._valuesToMeasure, this._lengthRetriever, function(K, Y) {
            if (K) {
                A(K);
                return
            }
            Y.forEach(function(z) {
                q += z
            }), A(null, q)
        })
    };
    kY.prototype.submit = function(A, q) {
        var K, Y, z = {
            method: "post"
        };
        if (typeof A == "string") A = k_K(A), Y = vc1({
            port: A.port,
            path: A.pathname,
            host: A.hostname,
            protocol: A.protocol
        }, z);
        else if (Y = vc1(A, z), !Y.port) Y.port = Y.protocol == "https:" ? 443 : 80;
        if (Y.headers = this.getHeaders(A.headers), Y.protocol == "https:") K = V_K.request(Y);
        else K = N_K.request(Y);
        return this.getLength(function(_, w) {
            if (_ && _ !== "Unknown stream") {
                this._error(_);
                return
            }
            if (w) K.setHeader("Content-Length", w);
            if (this.pipe(K), q) {
                var O, $ = function(H, j) {
                    return K.removeListener("error", $), K.removeListener("response", O), q.call(this, H, j)
                };
                O = $.bind(this, null), K.on("error", $), K.on("response", O)
            }
        }.bind(this)), K
    };
    kY.prototype._error = function(A) {
        if (!this.error) this.error = A, this.pause(), this.emit("error", A)
    };
    kY.prototype.toString = function() {
        return "[object FormData]"
    };
    R_K(kY, "FormData")
})
// @from(Ln 33767, Col 4)
eOA
// @from(Ln 33767, Col 9)
q81
// @from(Ln 33768, Col 4)
Vc1 = E(() => {
    eOA = t(tOA(), 1), q81 = eOA.default
})
// @from(Ln 33772, Col 0)
function kc1(A) {
    return c1.isPlainObject(A) || c1.isArray(A)
}
// @from(Ln 33776, Col 0)
function q$A(A) {
    return c1.endsWith(A, "[]") ? A.slice(0, -2) : A
}
// @from(Ln 33780, Col 0)
function A$A(A, q, K) {
    if (!A) return q;
    return A.concat(q).map(function(z, _) {
        return z = q$A(z), !K && _ ? "[" + z + "]" : z
    }).join(K ? "." : "")
}
// @from(Ln 33787, Col 0)
function h_K(A) {
    return c1.isArray(A) && !A.some(kc1)
}