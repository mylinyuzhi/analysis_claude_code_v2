
// @from(Ln 45196, Col 4)
_B7 = p((V7O, KB7) => {
    KB7.exports = qB7;
    qB7.sync = Vd5;
    var tm7 = d6("fs");

    function Td5(q, K) {
        var _ = K.pathExt !== void 0 ? K.pathExt : process.env.PATHEXT;
        if (!_) return !0;
        if (_ = _.split(";"), _.indexOf("") !== -1) return !0;
        for (var z = 0; z < _.length; z++) {
            var Y = _[z].toLowerCase();
            if (Y && q.substr(-Y.length).toLowerCase() === Y) return !0
        }
        return !1
    }

    function em7(q, K, _) {
        if (!q.isSymbolicLink() && !q.isFile()) return !1;
        return Td5(K, _)
    }

    function qB7(q, K, _) {
        tm7.stat(q, function(z, Y) {
            _(z, z ? !1 : em7(Y, q, K))
        })
    }

    function Vd5(q, K) {
        return em7(tm7.statSync(q), q, K)
    }
})
// @from(Ln 45227, Col 4)
wB7 = p((k7O, OB7) => {
    OB7.exports = YB7;
    YB7.sync = kd5;
    var zB7 = d6("fs");

    function YB7(q, K, _) {
        zB7.stat(q, function(z, Y) {
            _(z, z ? !1 : AB7(Y, K))
        })
    }

    function kd5(q, K) {
        return AB7(zB7.statSync(q), K)
    }

    function AB7(q, K) {
        return q.isFile() && Nd5(q, K)
    }

    function Nd5(q, K) {
        var {
            mode: _,
            uid: z,
            gid: Y
        } = q, A = K.uid !== void 0 ? K.uid : process.getuid && process.getuid(), O = K.gid !== void 0 ? K.gid : process.getgid && process.getgid(), w = parseInt("100", 8), $ = parseInt("010", 8), j = parseInt("001", 8), H = w | $, J = _ & j || _ & $ && Y === O || _ & w && z === A || _ & H && A === 0;
        return J
    }
})
// @from(Ln 45255, Col 4)
jB7 = p((E7O, $B7) => {
    var N7O = d6("fs"),
        VJ8;
    if (process.platform === "win32" || global.TESTING_WINDOWS) VJ8 = _B7();
    else VJ8 = wB7();
    $B7.exports = pY1;
    pY1.sync = Ed5;

    function pY1(q, K, _) {
        if (typeof K === "function") _ = K, K = {};
        if (!_) {
            if (typeof Promise !== "function") throw TypeError("callback not provided");
            return new Promise(function(z, Y) {
                pY1(q, K || {}, function(A, O) {
                    if (A) Y(A);
                    else z(O)
                })
            })
        }
        VJ8(q, K || {}, function(z, Y) {
            if (z) {
                if (z.code === "EACCES" || K && K.ignoreErrors) z = null, Y = !1
            }
            _(z, Y)
        })
    }

    function Ed5(q, K) {
        try {
            return VJ8.sync(q, K || {})
        } catch (_) {
            if (K && K.ignoreErrors || _.code === "EACCES") return !1;
            else throw _
        }
    }
})
// @from(Ln 45291, Col 4)
DB7 = p((y7O, WB7) => {
    var Qf6 = process.platform === "win32" || process.env.OSTYPE === "cygwin" || process.env.OSTYPE === "msys",
        HB7 = d6("path"),
        yd5 = Qf6 ? ";" : ":",
        JB7 = jB7(),
        XB7 = (q) => Object.assign(Error(`not found: ${q}`), {
            code: "ENOENT"
        }),
        MB7 = (q, K) => {
            let _ = K.colon || yd5,
                z = q.match(/\//) || Qf6 && q.match(/\\/) ? [""] : [...Qf6 ? [process.cwd()] : [], ...(K.path || process.env.PATH || "").split(_)],
                Y = Qf6 ? K.pathExt || process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM" : "",
                A = Qf6 ? Y.split(_) : [""];
            if (Qf6) {
                if (q.indexOf(".") !== -1 && A[0] !== "") A.unshift("")
            }
            return {
                pathEnv: z,
                pathExt: A,
                pathExtExe: Y
            }
        },
        PB7 = (q, K, _) => {
            if (typeof K === "function") _ = K, K = {};
            if (!K) K = {};
            let {
                pathEnv: z,
                pathExt: Y,
                pathExtExe: A
            } = MB7(q, K), O = [], w = (j) => new Promise((H, J) => {
                if (j === z.length) return K.all && O.length ? H(O) : J(XB7(q));
                let X = z[j],
                    M = /^".*"$/.test(X) ? X.slice(1, -1) : X,
                    P = HB7.join(M, q),
                    W = !M && /^\.[\\\/]/.test(q) ? q.slice(0, 2) + P : P;
                H($(W, j, 0))
            }), $ = (j, H, J) => new Promise((X, M) => {
                if (J === Y.length) return X(w(H + 1));
                let P = Y[J];
                JB7(j + P, {
                    pathExt: A
                }, (W, D) => {
                    if (!W && D)
                        if (K.all) O.push(j + P);
                        else return X(j + P);
                    return X($(j, H, J + 1))
                })
            });
            return _ ? w(0).then((j) => _(null, j), _) : w(0)
        },
        Ld5 = (q, K) => {
            K = K || {};
            let {
                pathEnv: _,
                pathExt: z,
                pathExtExe: Y
            } = MB7(q, K), A = [];
            for (let O = 0; O < _.length; O++) {
                let w = _[O],
                    $ = /^".*"$/.test(w) ? w.slice(1, -1) : w,
                    j = HB7.join($, q),
                    H = !$ && /^\.[\\\/]/.test(q) ? q.slice(0, 2) + j : j;
                for (let J = 0; J < z.length; J++) {
                    let X = H + z[J];
                    try {
                        if (JB7.sync(X, {
                                pathExt: Y
                            }))
                            if (K.all) A.push(X);
                            else return X
                    } catch (M) {}
                }
            }
            if (K.all && A.length) return A;
            if (K.nothrow) return null;
            throw XB7(q)
        };
    WB7.exports = PB7;
    PB7.sync = Ld5
})
// @from(Ln 45371, Col 4)
fB7 = p((L7O, FY1) => {
    var ZB7 = (q = {}) => {
        let K = q.env || process.env;
        if ((q.platform || process.platform) !== "win32") return "PATH";
        return Object.keys(K).reverse().find((z) => z.toUpperCase() === "PATH") || "Path"
    };
    FY1.exports = ZB7;
    FY1.exports.default = ZB7
})
// @from(Ln 45380, Col 4)
VB7 = p((h7O, TB7) => {
    var GB7 = d6("path"),
        hd5 = DB7(),
        Rd5 = fB7();

    function vB7(q, K) {
        let _ = q.options.env || process.env,
            z = process.cwd(),
            Y = q.options.cwd != null,
            A = Y && process.chdir !== void 0 && !process.chdir.disabled;
        if (A) try {
            process.chdir(q.options.cwd)
        } catch (w) {}
        let O;
        try {
            O = hd5.sync(q.command, {
                path: _[Rd5({
                    env: _
                })],
                pathExt: K ? GB7.delimiter : void 0
            })
        } catch (w) {} finally {
            if (A) process.chdir(z)
        }
        if (O) O = GB7.resolve(Y ? q.options.cwd : "", O);
        return O
    }

    function Sd5(q) {
        return vB7(q) || vB7(q, !0)
    }
    TB7.exports = Sd5
})
// @from(Ln 45413, Col 4)
kB7 = p((Id5, UY1) => {
    var gY1 = /([()\][%!^"`<>&|;, *?])/g;

    function Cd5(q) {
        return q = q.replace(gY1, "^$1"), q
    }

    function bd5(q, K) {
        if (q = `${q}`, q = q.replace(/(?=(\\+?)?)\1"/g, "$1$1\\\""), q = q.replace(/(?=(\\+?)?)\1$/, "$1$1"), q = `"${q}"`, q = q.replace(gY1, "^$1"), K) q = q.replace(gY1, "^$1");
        return q
    }
    Id5.command = Cd5;
    Id5.argument = bd5
})
// @from(Ln 45427, Col 4)
EB7 = p((R7O, NB7) => {
    NB7.exports = /^#!(.*)/
})
// @from(Ln 45430, Col 4)
LB7 = p((S7O, yB7) => {
    var md5 = EB7();
    yB7.exports = (q = "") => {
        let K = q.match(md5);
        if (!K) return null;
        let [_, z] = K[0].replace(/#! ?/, "").split(" "), Y = _.split("/").pop();
        if (Y === "env") return z;
        return z ? `${Y} ${z}` : Y
    }
})
// @from(Ln 45440, Col 4)
RB7 = p((C7O, hB7) => {
    var QY1 = d6("fs"),
        Bd5 = LB7();

    function pd5(q) {
        let _ = Buffer.alloc(150),
            z;
        try {
            z = QY1.openSync(q, "r"), QY1.readSync(z, _, 0, 150, 0), QY1.closeSync(z)
        } catch (Y) {}
        return Bd5(_.toString())
    }
    hB7.exports = pd5
})
// @from(Ln 45454, Col 4)
IB7 = p((b7O, bB7) => {
    var Fd5 = d6("path"),
        SB7 = VB7(),
        CB7 = kB7(),
        gd5 = RB7(),
        Ud5 = process.platform === "win32",
        Qd5 = /\.(?:com|exe)$/i,
        dd5 = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;

    function cd5(q) {
        q.file = SB7(q);
        let K = q.file && gd5(q.file);
        if (K) return q.args.unshift(q.file), q.command = K, SB7(q);
        return q.file
    }

    function ld5(q) {
        if (!Ud5) return q;
        let K = cd5(q),
            _ = !Qd5.test(K);
        if (q.options.forceShell || _) {
            let z = dd5.test(K);
            q.command = Fd5.normalize(q.command), q.command = CB7.command(q.command), q.args = q.args.map((A) => CB7.argument(A, z));
            let Y = [q.command].concat(q.args).join(" ");
            q.args = ["/d", "/s", "/c", `"${Y}"`], q.command = process.env.comspec || "cmd.exe", q.options.windowsVerbatimArguments = !0
        }
        return q
    }

    function nd5(q, K, _) {
        if (K && !Array.isArray(K)) _ = K, K = null;
        K = K ? K.slice(0) : [], _ = Object.assign({}, _);
        let z = {
            command: q,
            args: K,
            options: _,
            file: void 0,
            original: {
                command: q,
                args: K
            }
        };
        return _.shell ? z : ld5(z)
    }
    bB7.exports = nd5
})
// @from(Ln 45500, Col 4)
mB7 = p((I7O, uB7) => {
    var dY1 = process.platform === "win32";

    function cY1(q, K) {
        return Object.assign(Error(`${K} ${q.command} ENOENT`), {
            code: "ENOENT",
            errno: "ENOENT",
            syscall: `${K} ${q.command}`,
            path: q.command,
            spawnargs: q.args
        })
    }

    function id5(q, K) {
        if (!dY1) return;
        let _ = q.emit;
        q.emit = function(z, Y) {
            if (z === "exit") {
                let A = xB7(Y, K);
                if (A) return _.call(q, "error", A)
            }
            return _.apply(q, arguments)
        }
    }

    function xB7(q, K) {
        if (dY1 && q === 1 && !K.file) return cY1(K.original, "spawn");
        return null
    }

    function rd5(q, K) {
        if (dY1 && q === 1 && !K.file) return cY1(K.original, "spawnSync");
        return null
    }
    uB7.exports = {
        hookChildProcess: id5,
        verifyENOENT: xB7,
        verifyENOENTSync: rd5,
        notFoundError: cY1
    }
})
// @from(Ln 45541, Col 4)
iY1 = p((x7O, df6) => {
    var BB7 = d6("child_process"),
        lY1 = IB7(),
        nY1 = mB7();

    function pB7(q, K, _) {
        let z = lY1(q, K, _),
            Y = BB7.spawn(z.command, z.args, z.options);
        return nY1.hookChildProcess(Y, z), Y
    }

    function od5(q, K, _) {
        let z = lY1(q, K, _),
            Y = BB7.spawnSync(z.command, z.args, z.options);
        return Y.error = Y.error || nY1.verifyENOENTSync(Y.status, z), Y
    }
    df6.exports = pB7;
    df6.exports.spawn = pB7;
    df6.exports.sync = od5;
    df6.exports._parse = lY1;
    df6.exports._enoent = nY1
})
// @from(Ln 45564, Col 0)
function rY1(q) {
    let K = typeof q === "string" ? `
` : `
`.charCodeAt(),
        _ = typeof q === "string" ? "\r" : "\r".charCodeAt();
    if (q[q.length - 1] === K) q = q.slice(0, -1);
    if (q[q.length - 1] === _) q = q.slice(0, -1);
    return q
}
// @from(Ln 45574, Col 0)
function kJ8(q = {}) {
    let {
        env: K = process.env,
        platform: _ = process.platform
    } = q;
    if (_ !== "win32") return "PATH";
    return Object.keys(K).reverse().find((z) => z.toUpperCase() === "PATH") || "Path"
}
// @from(Ln 45587, Col 4)
ad5 = ({
        cwd: q = NJ8.cwd(),
        path: K = NJ8.env[kJ8()],
        preferLocal: _ = !0,
        execPath: z = NJ8.execPath,
        addExecPath: Y = !0
    } = {}) => {
        let A = q instanceof URL ? FB7(q) : q,
            O = wQ6.resolve(A),
            w = [];
        if (_) sd5(w, O);
        if (Y) td5(w, z, O);
        return [...w, K].join(wQ6.delimiter)
    }
// @from(Ln 45601, Col 4)
sd5 = (q, K) => {
        let _;
        while (_ !== K) q.push(wQ6.join(K, "node_modules/.bin")), _ = K, K = wQ6.resolve(K, "..")
    }
// @from(Ln 45605, Col 4)
td5 = (q, K, _) => {
        let z = K instanceof URL ? FB7(K) : K;
        q.push(wQ6.resolve(_, z, ".."))
    }
// @from(Ln 45609, Col 4)
gB7 = ({
        env: q = NJ8.env,
        ...K
    } = {}) => {
        q = {
            ...q
        };
        let _ = kJ8({
            env: q
        });
        return K.path = q[_], q[_] = ad5(K), q
    }
// @from(Ln 45621, Col 4)
UB7 = () => {}
// @from(Ln 45623, Col 0)
function oY1(q, K, {
    ignoreNonConfigurable: _ = !1
} = {}) {
    let {
        name: z
    } = q;
    for (let Y of Reflect.ownKeys(K)) ed5(q, K, Y, _);
    return Kc5(q, K), Ac5(q, K, z), q
}
// @from(Ln 45632, Col 4)
ed5 = (q, K, _, z) => {
        if (_ === "length" || _ === "prototype") return;
        if (_ === "arguments" || _ === "caller") return;
        let Y = Object.getOwnPropertyDescriptor(q, _),
            A = Object.getOwnPropertyDescriptor(K, _);
        if (!qc5(Y, A) && z) return;
        Object.defineProperty(q, _, A)
    }
// @from(Ln 45640, Col 4)
qc5 = function(q, K) {
        return q === void 0 || q.configurable || q.writable === K.writable && q.enumerable === K.enumerable && q.configurable === K.configurable && (q.writable || q.value === K.value)
    }
// @from(Ln 45643, Col 4)
Kc5 = (q, K) => {
        let _ = Object.getPrototypeOf(K);
        if (_ === Object.getPrototypeOf(q)) return;
        Object.setPrototypeOf(q, _)
    }
// @from(Ln 45648, Col 4)
_c5 = (q, K) => `/* Wrapped ${q}*/
${K}`
// @from(Ln 45650, Col 4)
zc5
// @from(Ln 45650, Col 9)
Yc5
// @from(Ln 45650, Col 14)
Ac5 = (q, K, _) => {
        let z = _ === "" ? "" : `with ${_.trim()}() `,
            Y = _c5.bind(null, z, K.toString());
        Object.defineProperty(Y, "name", Yc5), Object.defineProperty(q, "toString", {
            ...zc5,
            value: Y
        })
    }
// @from(Ln 45658, Col 4)
QB7 = L(() => {
    zc5 = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), Yc5 = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name")
})
// @from(Ln 45661, Col 4)
EJ8
// @from(Ln 45661, Col 9)
dB7 = (q, K = {}) => {
        if (typeof q !== "function") throw TypeError("Expected a function");
        let _, z = 0,
            Y = q.displayName || q.name || "<anonymous>",
            A = function(...O) {
                if (EJ8.set(A, ++z), z === 1) _ = q.apply(this, O), q = null;
                else if (K.throw === !0) throw Error(`Function \`${Y}\` can only be called once`);
                return _
            };
        return oY1(A, q), EJ8.set(A, z), A
    }
// @from(Ln 45672, Col 4)
cB7
// @from(Ln 45673, Col 4)
lB7 = L(() => {
    QB7();
    EJ8 = new WeakMap;
    dB7.callCount = (q) => {
        if (!EJ8.has(q)) throw Error(`The given function \`${q.name}\` is not wrapped by the \`onetime\` package`);
        return EJ8.get(q)
    };
    cB7 = dB7
})
// @from(Ln 45682, Col 4)
nB7 = () => {
        let q = aY1 - iB7 + 1;
        return Array.from({
            length: q
        }, Oc5)
    }
// @from(Ln 45688, Col 4)
Oc5 = (q, K) => ({
        name: `SIGRT${K+1}`,
        number: iB7 + K,
        action: "terminate",
        description: "Application-specific signal (realtime)",
        standard: "posix"
    })
// @from(Ln 45695, Col 4)
iB7 = 34
// @from(Ln 45696, Col 4)
aY1 = 64
// @from(Ln 45697, Col 4)
rB7
// @from(Ln 45698, Col 4)
oB7 = L(() => {
    rB7 = [{
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
// @from(Ln 45935, Col 4)
sY1 = () => {
        let q = nB7();
        return [...rB7, ...q].map($c5)
    }
// @from(Ln 45939, Col 4)
$c5 = ({
        name: q,
        number: K,
        description: _,
        action: z,
        forced: Y = !1,
        standard: A
    }) => {
        let {
            signals: {
                [q]: O
            }
        } = wc5, w = O !== void 0;
        return {
            name: q,
            number: w ? O : K,
            description: _,
            supported: w,
            action: z,
            forced: Y,
            standard: A
        }
    }
// @from(Ln 45962, Col 4)
aB7 = L(() => {
    oB7()
})
// @from(Ln 45968, Col 4)
Hc5 = () => {
        let q = sY1();
        return Object.fromEntries(q.map(Jc5))
    }
// @from(Ln 45972, Col 4)
Jc5 = ({
        name: q,
        number: K,
        description: _,
        supported: z,
        action: Y,
        forced: A,
        standard: O
    }) => [q, {
        name: q,
        number: K,
        description: _,
        supported: z,
        action: Y,
        forced: A,
        standard: O
    }]
// @from(Ln 45989, Col 4)
sB7
// @from(Ln 45989, Col 9)
Xc5 = () => {
        let q = sY1(),
            K = aY1 + 1,
            _ = Array.from({
                length: K
            }, (z, Y) => Mc5(Y, q));
        return Object.assign({}, ..._)
    }
// @from(Ln 45997, Col 4)
Mc5 = (q, K) => {
        let _ = Pc5(q, K);
        if (_ === void 0) return {};
        let {
            name: z,
            description: Y,
            supported: A,
            action: O,
            forced: w,
            standard: $
        } = _;
        return {
            [q]: {
                name: z,
                number: q,
                description: Y,
                supported: A,
                action: O,
                forced: w,
                standard: $
            }
        }
    }
// @from(Ln 46020, Col 4)
Pc5 = (q, K) => {
        let _ = K.find(({
            name: z
        }) => jc5.signals[z] === q);
        if (_ !== void 0) return _;
        return K.find((z) => z.number === q)
    }
// @from(Ln 46027, Col 4)
qqO
// @from(Ln 46028, Col 4)
tB7 = L(() => {
    aB7();
    sB7 = Hc5(), qqO = Xc5()
})
// @from(Ln 46033, Col 4)
Dc5 = ({
        timedOut: q,
        timeout: K,
        errorCode: _,
        signal: z,
        signalDescription: Y,
        exitCode: A,
        isCanceled: O
    }) => {
        if (q) return `timed out after ${K} milliseconds`;
        if (O) return "was canceled";
        if (_ !== void 0) return `failed with ${_}`;
        if (z !== void 0) return `was killed with ${z} (${Y})`;
        if (A !== void 0) return `failed with exit code ${A}`;
        return "failed"
    }
// @from(Ln 46049, Col 4)
$Q6 = ({
        stdout: q,
        stderr: K,
        all: _,
        error: z,
        signal: Y,
        exitCode: A,
        command: O,
        escapedCommand: w,
        timedOut: $,
        isCanceled: j,
        killed: H,
        parsed: {
            options: {
                timeout: J,
                cwd: X = Wc5.cwd()
            }
        }
    }) => {
        A = A === null ? void 0 : A, Y = Y === null ? void 0 : Y;
        let M = Y === void 0 ? void 0 : sB7[Y].description,
            P = z && z.code,
            D = `Command ${Dc5({timedOut:$,timeout:J,errorCode:P,signal:Y,signalDescription:M,exitCode:A,isCanceled:j})}: ${O}`,
            Z = Object.prototype.toString.call(z) === "[object Error]",
            G = Z ? `${D}
${z.message}` : D,
            f = [G, K, q].filter(Boolean).join(`
`);
        if (Z) z.originalMessage = z.message, z.message = f;
        else z = Error(f);
        if (z.shortMessage = G, z.command = O, z.escapedCommand = w, z.exitCode = A, z.signal = Y, z.signalDescription = M, z.stdout = q, z.stderr = K, z.cwd = X, _ !== void 0) z.all = _;
        if ("bufferedData" in z) delete z.bufferedData;
        return z.failed = !0, z.timedOut = Boolean($), z.isCanceled = j, z.killed = H && !$, z
    }
// @from(Ln 46083, Col 4)
eB7 = L(() => {
    tB7()
})
// @from(Ln 46086, Col 4)
yJ8
// @from(Ln 46086, Col 9)
Zc5 = (q) => yJ8.some((K) => q[K] !== void 0)
// @from(Ln 46087, Col 4)
qp7 = (q) => {
        if (!q) return;
        let {
            stdio: K
        } = q;
        if (K === void 0) return yJ8.map((z) => q[z]);
        if (Zc5(q)) throw Error(`It's not possible to provide \`stdio\` in combination with one of ${yJ8.map((z)=>`\`${z}\``).join(", ")}`);
        if (typeof K === "string") return K;
        if (!Array.isArray(K)) throw TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof K}\``);
        let _ = Math.max(K.length, yJ8.length);
        return Array.from({
            length: _
        }, (z, Y) => K[Y])
    }
// @from(Ln 46101, Col 4)
Kp7 = L(() => {
    yJ8 = ["stdin", "stdout", "stderr"]
})
// @from(Ln 46104, Col 4)
SA6
// @from(Ln 46105, Col 4)
_p7 = L(() => {
    SA6 = [];
    SA6.push("SIGHUP", "SIGINT", "SIGTERM");
    if (process.platform !== "win32") SA6.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
    if (process.platform === "linux") SA6.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT")
})
// @from(Ln 46111, Col 0)
class zp7 {
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
        if (eY1[tY1]) return eY1[tY1];
        fc5(eY1, tY1, {
            value: this,
            writable: !1,
            enumerable: !1,
            configurable: !1
        })
    }
    on(q, K) {
        this.listeners[q].push(K)
    }
    removeListener(q, K) {
        let _ = this.listeners[q],
            z = _.indexOf(K);
        if (z === -1) return;
        if (z === 0 && _.length === 1) _.length = 0;
        else _.splice(z, 1)
    }
    emit(q, K, _) {
        if (this.emitted[q]) return !1;
        this.emitted[q] = !0;
        let z = !1;
        for (let Y of this.listeners[q]) z = Y(K, _) === !0 || z;
        if (q === "exit") z = this.emit("afterExit", K, _) || z;
        return z
    }
}
// @from(Ln 46150, Col 0)
class KA1 {}
// @from(Ln 46151, Col 4)
LJ8 = (q) => !!q && typeof q === "object" && typeof q.removeListener === "function" && typeof q.emit === "function" && typeof q.reallyExit === "function" && typeof q.listeners === "function" && typeof q.kill === "function" && typeof q.pid === "number" && typeof q.on === "function"
// @from(Ln 46152, Col 4)
tY1
// @from(Ln 46152, Col 9)
eY1
// @from(Ln 46152, Col 14)
fc5
// @from(Ln 46152, Col 19)
Gc5 = (q) => {
        return {
            onExit(K, _) {
                return q.onExit(K, _)
            },
            load() {
                return q.load()
            },
            unload() {
                return q.unload()
            }
        }
    }
// @from(Ln 46165, Col 4)
Yp7
// @from(Ln 46165, Col 9)
Ap7
// @from(Ln 46165, Col 14)
qA1
// @from(Ln 46165, Col 19)
b16
// @from(Ln 46165, Col 24)
$qO
// @from(Ln 46165, Col 29)
jqO
// @from(Ln 46166, Col 4)
jQ6 = L(() => {
    _p7();
    tY1 = Symbol.for("signal-exit emitter"), eY1 = globalThis, fc5 = Object.defineProperty.bind(Object);
    Yp7 = class Yp7 extends KA1 {
        onExit() {
            return () => {}
        }
        load() {}
        unload() {}
    };
    Ap7 = class Ap7 extends KA1 {
        #q = qA1.platform === "win32" ? "SIGINT" : "SIGHUP";
        #K = new zp7;
        #_;
        #Y;
        #z;
        #w = {};
        #A = !1;
        constructor(q) {
            super();
            this.#_ = q, this.#w = {};
            for (let K of SA6) this.#w[K] = () => {
                let _ = this.#_.listeners(K),
                    {
                        count: z
                    } = this.#K,
                    Y = q;
                if (typeof Y.__signal_exit_emitter__ === "object" && typeof Y.__signal_exit_emitter__.count === "number") z += Y.__signal_exit_emitter__.count;
                if (_.length === z) {
                    this.unload();
                    let A = this.#K.emit("exit", null, K),
                        O = K === "SIGHUP" ? this.#q : K;
                    if (!A) q.kill(q.pid, O)
                }
            };
            this.#z = q.reallyExit, this.#Y = q.emit
        }
        onExit(q, K) {
            if (!LJ8(this.#_)) return () => {};
            if (this.#A === !1) this.load();
            let _ = K?.alwaysLast ? "afterExit" : "exit";
            return this.#K.on(_, q), () => {
                if (this.#K.removeListener(_, q), this.#K.listeners.exit.length === 0 && this.#K.listeners.afterExit.length === 0) this.unload()
            }
        }
        load() {
            if (this.#A) return;
            this.#A = !0, this.#K.count += 1;
            for (let q of SA6) try {
                let K = this.#w[q];
                if (K) this.#_.on(q, K)
            } catch (K) {}
            this.#_.emit = (q, ...K) => {
                return this.#H(q, ...K)
            }, this.#_.reallyExit = (q) => {
                return this.#$(q)
            }
        }
        unload() {
            if (!this.#A) return;
            this.#A = !1, SA6.forEach((q) => {
                let K = this.#w[q];
                if (!K) throw Error("Listener not defined for signal: " + q);
                try {
                    this.#_.removeListener(q, K)
                } catch (_) {}
            }), this.#_.emit = this.#Y, this.#_.reallyExit = this.#z, this.#K.count -= 1
        }
        #$(q) {
            if (!LJ8(this.#_)) return 0;
            return this.#_.exitCode = q || 0, this.#K.emit("exit", this.#_.exitCode, null), this.#z.call(this.#_, this.#_.exitCode)
        }
        #H(q, ...K) {
            let _ = this.#Y;
            if (q === "exit" && LJ8(this.#_)) {
                if (typeof K[0] === "number") this.#_.exitCode = K[0];
                let z = _.call(this.#_, q, ...K);
                return this.#K.emit("exit", this.#_.exitCode, null), z
            } else return _.call(this.#_, q, ...K)
        }
    };
    qA1 = globalThis.process, {
        onExit: b16,
        load: $qO,
        unload: jqO
    } = Gc5(LJ8(qA1) ? new Ap7(qA1) : new Yp7)
})
// @from(Ln 46254, Col 4)
Tc5 = 5000
// @from(Ln 46255, Col 4)
Op7 = (q, K = "SIGTERM", _ = {}) => {
        let z = q(K);
        return Vc5(q, K, _, z), z
    }
// @from(Ln 46259, Col 4)
Vc5 = (q, K, _, z) => {
        if (!kc5(K, _, z)) return;
        let Y = Ec5(_),
            A = setTimeout(() => {
                q("SIGKILL")
            }, Y);
        if (A.unref) A.unref()
    }
// @from(Ln 46267, Col 4)
kc5 = (q, {
        forceKillAfterTimeout: K
    }, _) => Nc5(q) && K !== !1 && _
// @from(Ln 46270, Col 4)
Nc5 = (q) => q === vc5.constants.signals.SIGTERM || typeof q === "string" && q.toUpperCase() === "SIGTERM"
// @from(Ln 46271, Col 4)
Ec5 = ({
        forceKillAfterTimeout: q = !0
    }) => {
        if (q === !0) return Tc5;
        if (!Number.isFinite(q) || q < 0) throw TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${q}\` (${typeof q})`);
        return q
    }
// @from(Ln 46278, Col 4)
wp7 = (q, K) => {
        if (q.kill()) K.isCanceled = !0
    }
// @from(Ln 46281, Col 4)
yc5 = (q, K, _) => {
        q.kill(K), _(Object.assign(Error("Timed out"), {
            timedOut: !0,
            signal: K
        }))
    }
// @from(Ln 46287, Col 4)
$p7 = (q, {
        timeout: K,
        killSignal: _ = "SIGTERM"
    }, z) => {
        if (K === 0 || K === void 0) return z;
        let Y, A = new Promise((w, $) => {
                Y = setTimeout(() => {
                    yc5(q, _, $)
                }, K)
            }),
            O = z.finally(() => {
                clearTimeout(Y)
            });
        return Promise.race([A, O])
    }
// @from(Ln 46302, Col 4)
jp7 = ({
        timeout: q
    }) => {
        if (q !== void 0 && (!Number.isFinite(q) || q < 0)) throw TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${q}\` (${typeof q})`)
    }
// @from(Ln 46307, Col 4)
Hp7 = async (q, {
        cleanup: K,
        detached: _
    }, z) => {
        if (!K || _) return z;
        let Y = b16(() => {
            q.kill()
        });
        return z.finally(() => {
            Y()
        })
    }
// @from(Ln 46319, Col 4)
Jp7 = L(() => {
    jQ6()
})
// @from(Ln 46323, Col 0)
function hJ8(q) {
    return q !== null && typeof q === "object" && typeof q.pipe === "function"
}
// @from(Ln 46327, Col 0)
function _A1(q) {
    return hJ8(q) && q.writable !== !1 && typeof q._write === "function" && typeof q._writableState === "object"
}
// @from(Ln 46336, Col 4)
Rc5 = (q) => q instanceof hc5 && typeof q.then === "function"
// @from(Ln 46337, Col 4)
zA1 = (q, K, _) => {
        if (typeof _ === "string") return q[K].pipe(Lc5(_)), q;
        if (_A1(_)) return q[K].pipe(_), q;
        if (!Rc5(_)) throw TypeError("The second argument must be a string, a stream or an Execa child process.");
        if (!_A1(_.stdin)) throw TypeError("The target child process's stdin must be available.");
        return q[K].pipe(_.stdin), _
    }
// @from(Ln 46344, Col 4)
Xp7 = (q) => {
        if (q.stdout !== null) q.pipeStdout = zA1.bind(void 0, q, "stdout");
        if (q.stderr !== null) q.pipeStderr = zA1.bind(void 0, q, "stderr");
        if (q.all !== void 0) q.pipeAll = zA1.bind(void 0, q, "all")
    }
// @from(Ln 46349, Col 4)
Mp7 = () => {}
// @from(Ln 46350, Col 4)
HQ6 = async (q, {
    init: K,
    convertChunk: _,
    getSize: z,
    truncateChunk: Y,
    addChunk: A,
    getFinalChunk: O,
    finalize: w
}, {
    maxBuffer: $ = Number.POSITIVE_INFINITY
} = {}) => {
    if (!Cc5(q)) throw Error("The first argument must be a Readable, a ReadableStream, or an async iterable.");
    let j = K();
    j.length = 0;
    try {
        for await (let H of q) {
            let J = bc5(H),
                X = _[J](H, j);
            Dp7({
                convertedChunk: X,
                state: j,
                getSize: z,
                truncateChunk: Y,
                addChunk: A,
                maxBuffer: $
            })
        }
        return Sc5({
            state: j,
            convertChunk: _,
            getSize: z,
            truncateChunk: Y,
            addChunk: A,
            getFinalChunk: O,
            maxBuffer: $
        }), w(j)
    } catch (H) {
        throw H.bufferedData = w(j), H
    }
}
// @from(Ln 46389, Col 3)
Sc5 = ({
    state: q,
    getSize: K,
    truncateChunk: _,
    addChunk: z,
    getFinalChunk: Y,
    maxBuffer: A
}) => {
    let O = Y(q);
    if (O !== void 0) Dp7({
        convertedChunk: O,
        state: q,
        getSize: K,
        truncateChunk: _,
        addChunk: z,
        maxBuffer: A
    })
}
// @from(Ln 46406, Col 3)
Dp7 = ({
    convertedChunk: q,
    state: K,
    getSize: _,
    truncateChunk: z,
    addChunk: Y,
    maxBuffer: A
}) => {
    let O = _(q),
        w = K.length + O;
    if (w <= A) {
        Pp7(q, K, Y, w);
        return
    }
    let $ = z(q, A - K.length);
    if ($ !== void 0) Pp7($, K, Y, A);
    throw new YA1
}
// @from(Ln 46423, Col 3)
Pp7 = (q, K, _, z) => {
    K.contents = _(q, K, z), K.length = z
}
// @from(Ln 46425, Col 3)
Cc5 = (q) => typeof q === "object" && q !== null && typeof q[Symbol.asyncIterator] === "function"
// @from(Ln 46425, Col 102)
bc5 = (q) => {
    let K = typeof q;
    if (K === "string") return "string";
    if (K !== "object" || q === null) return "others";
    if (globalThis.Buffer?.isBuffer(q)) return "buffer";
    let _ = Wp7.call(q);
    if (_ === "[object ArrayBuffer]") return "arrayBuffer";
    if (_ === "[object DataView]") return "dataView";
    if (Number.isInteger(q.byteLength) && Number.isInteger(q.byteOffset) && Wp7.call(q.buffer) === "[object ArrayBuffer]") return "typedArray";
    return "others"
}
// @from(Ln 46435, Col 3)
Wp7
// @from(Ln 46435, Col 8)
YA1
// @from(Ln 46436, Col 4)
JQ6 = L(() => {
    ({
        toString: Wp7
    } = Object.prototype);
    YA1 = class YA1 extends Error {
        name = "MaxBufferError";
        constructor() {
            super("maxBuffer exceeded")
        }
    }
})
// @from(Ln 46447, Col 4)
AA1 = (q) => q
// @from(Ln 46448, Col 4)
OA1 = () => {
        return
    }
// @from(Ln 46451, Col 4)
wA1 = ({
        contents: q
    }) => q
// @from(Ln 46454, Col 4)
RJ8 = (q) => {
        throw Error(`Streams in object mode are not supported: ${String(q)}`)
    }
// @from(Ln 46457, Col 4)
SJ8 = (q) => q.length
// @from(Ln 46458, Col 4)
Zp7 = L(() => {
    JQ6()
})
// @from(Ln 46461, Col 0)
async function $A1(q, K) {
    return HQ6(q, Uc5, K)
}
// @from(Ln 46464, Col 4)
Ic5 = () => ({
        contents: new ArrayBuffer(0)
    })
// @from(Ln 46467, Col 4)
xc5 = (q) => uc5.encode(q)
// @from(Ln 46468, Col 4)
uc5
// @from(Ln 46468, Col 9)
fp7 = (q) => new Uint8Array(q)
// @from(Ln 46469, Col 4)
Gp7 = (q) => new Uint8Array(q.buffer, q.byteOffset, q.byteLength)
// @from(Ln 46470, Col 4)
mc5 = (q, K) => q.slice(0, K)
// @from(Ln 46471, Col 4)
Bc5 = (q, {
        contents: K,
        length: _
    }, z) => {
        let Y = Vp7() ? Fc5(K, z) : pc5(K, z);
        return new Uint8Array(Y).set(q, _), Y
    }
// @from(Ln 46478, Col 4)
pc5 = (q, K) => {
        if (K <= q.byteLength) return q;
        let _ = new ArrayBuffer(Tp7(K));
        return new Uint8Array(_).set(new Uint8Array(q), 0), _
    }
// @from(Ln 46483, Col 4)
Fc5 = (q, K) => {
        if (K <= q.maxByteLength) return q.resize(K), q;
        let _ = new ArrayBuffer(K, {
            maxByteLength: Tp7(K)
        });
        return new Uint8Array(_).set(new Uint8Array(q), 0), _
    }
// @from(Ln 46490, Col 4)
Tp7 = (q) => vp7 ** Math.ceil(Math.log(q) / Math.log(vp7))
// @from(Ln 46491, Col 4)
vp7 = 2
// @from(Ln 46492, Col 4)
gc5 = ({
        contents: q,
        length: K
    }) => Vp7() ? q : q.slice(0, K)
// @from(Ln 46496, Col 4)
Vp7 = () => ("resize" in ArrayBuffer.prototype)
// @from(Ln 46497, Col 4)
Uc5
// @from(Ln 46498, Col 4)
jA1 = L(() => {
    JQ6();
    uc5 = new TextEncoder, Uc5 = {
        init: Ic5,
        convertChunk: {
            string: xc5,
            buffer: fp7,
            arrayBuffer: fp7,
            dataView: Gp7,
            typedArray: Gp7,
            others: RJ8
        },
        getSize: SJ8,
        truncateChunk: mc5,
        addChunk: Bc5,
        getFinalChunk: OA1,
        finalize: gc5
    }
})
// @from(Ln 46517, Col 0)
async function CJ8(q, K) {
    if (!("Buffer" in globalThis)) throw Error("getStreamAsBuffer() is only supported in Node.js");
    try {
        return kp7(await $A1(q, K))
    } catch (_) {
        if (_.bufferedData !== void 0) _.bufferedData = kp7(_.bufferedData);
        throw _
    }
}
// @from(Ln 46526, Col 4)
kp7 = (q) => globalThis.Buffer.from(q)
// @from(Ln 46527, Col 4)
Np7 = L(() => {
    jA1()
})
// @from(Ln 46530, Col 0)
async function HA1(q, K) {
    return HQ6(q, nc5, K)
}
// @from(Ln 46533, Col 4)
Qc5 = () => ({
        contents: "",
        textDecoder: new TextDecoder
    })
// @from(Ln 46537, Col 4)
bJ8 = (q, {
        textDecoder: K
    }) => K.decode(q, {
        stream: !0
    })
// @from(Ln 46542, Col 4)
dc5 = (q, {
        contents: K
    }) => K + q
// @from(Ln 46545, Col 4)
cc5 = (q, K) => q.slice(0, K)
// @from(Ln 46546, Col 4)
lc5 = ({
        textDecoder: q
    }) => {
        let K = q.decode();
        return K === "" ? void 0 : K
    }
// @from(Ln 46552, Col 4)
nc5
// @from(Ln 46553, Col 4)
Ep7 = L(() => {
    JQ6();
    nc5 = {
        init: Qc5,
        convertChunk: {
            string: AA1,
            buffer: bJ8,
            arrayBuffer: bJ8,
            dataView: bJ8,
            typedArray: bJ8,
            others: RJ8
        },
        getSize: SJ8,
        truncateChunk: cc5,
        addChunk: dc5,
        getFinalChunk: lc5,
        finalize: wA1
    }
})
// @from(Ln 46572, Col 4)
yp7 = L(() => {
    Zp7();
    jA1();
    Np7();
    Ep7();
    JQ6()
})
// @from(Ln 46579, Col 4)
hp7 = p((FqO, Lp7) => {
    var {
        PassThrough: ic5
    } = d6("stream");
    Lp7.exports = function() {
        var q = [],
            K = new ic5({
                objectMode: !0
            });
        return K.setMaxListeners(0), K.add = _, K.isEmpty = z, K.on("unpipe", Y), Array.prototype.slice.call(arguments).forEach(_), K;

        function _(A) {
            if (Array.isArray(A)) return A.forEach(_), this;
            return q.push(A), A.once("end", Y.bind(null, A)), A.once("error", K.emit.bind(K, "error")), A.pipe(K, {
                end: !1
            }), this
        }

        function z() {
            return q.length == 0
        }

        function Y(A) {
            if (q = q.filter(function(O) {
                    return O !== A
                }), !q.length && K.readable) K.end()
        }
    }
})
// @from(Ln 46615, Col 4)
Rp7
// @from(Ln 46615, Col 9)
Sp7 = (q) => {
        if (q !== void 0) throw TypeError("The `input` and `inputFile` options cannot be both set.")
    }
// @from(Ln 46618, Col 4)
sc5 = ({
        input: q,
        inputFile: K
    }) => {
        if (typeof K !== "string") return q;
        return Sp7(q), oc5(K)
    }
// @from(Ln 46625, Col 4)
Cp7 = (q) => {
        let K = sc5(q);
        if (hJ8(K)) throw TypeError("The `input` option cannot be a stream in sync mode");
        return K
    }
// @from(Ln 46630, Col 4)
tc5 = ({
        input: q,
        inputFile: K
    }) => {
        if (typeof K !== "string") return q;
        return Sp7(q), rc5(K)
    }
// @from(Ln 46637, Col 4)
bp7 = (q, K) => {
        let _ = tc5(K);
        if (_ === void 0) return;
        if (hJ8(_)) _.pipe(q.stdin);
        else q.stdin.end(_)
    }
// @from(Ln 46643, Col 4)
Ip7 = (q, {
        all: K
    }) => {
        if (!K || !q.stdout && !q.stderr) return;
        let _ = Rp7.default();
        if (q.stdout) _.add(q.stdout);
        if (q.stderr) _.add(q.stderr);
        return _
    }
// @from(Ln 46652, Col 4)
JA1 = async (q, K) => {
        if (!q || K === void 0) return;
        await ac5(0), q.destroy();
        try {
            return await K
        } catch (_) {
            return _.bufferedData
        }
    }
// @from(Ln 46660, Col 7)
XA1 = (q, {
        encoding: K,
        buffer: _,
        maxBuffer: z
    }) => {
        if (!q || !_) return;
        if (K === "utf8" || K === "utf-8") return HA1(q, {
            maxBuffer: z
        });
        if (K === null || K === "buffer") return CJ8(q, {
            maxBuffer: z
        });
        return ec5(q, z, K)
    }
// @from(Ln 46673, Col 7)
ec5 = async (q, K, _) => {
        return (await CJ8(q, {
            maxBuffer: K
        })).toString(_)
    }
// @from(Ln 46677, Col 7)
xp7 = async ({
        stdout: q,
        stderr: K,
        all: _
    }, {
        encoding: z,
        buffer: Y,
        maxBuffer: A
    }, O) => {
        let w = XA1(q, {
                encoding: z,
                buffer: Y,
                maxBuffer: A
            }),
            $ = XA1(K, {
                encoding: z,
                buffer: Y,
                maxBuffer: A
            }),
            j = XA1(_, {
                encoding: z,
                buffer: Y,
                maxBuffer: A * 2
            });
        try {
            return await Promise.all([O, w, $, j])
        } catch (H) {
            return Promise.all([{
                error: H,
                signal: H.signal,
                timedOut: H.timedOut
            }, JA1(q, w), JA1(K, $), JA1(_, j)])
        }
    }
// @from(Ln 46711, Col 4)
up7 = L(() => {
    yp7();
    Rp7 = K6(hp7(), 1)
})
// @from(Ln 46715, Col 4)
ql5
// @from(Ln 46715, Col 9)
Kl5
// @from(Ln 46715, Col 14)
MA1 = (q, K) => {
        for (let [_, z] of Kl5) {
            let Y = typeof K === "function" ? (...A) => Reflect.apply(z.value, K(), A) : z.value.bind(K);
            Reflect.defineProperty(q, _, {
                ...z,
                value: Y
            })
        }
    }
// @from(Ln 46724, Col 4)
mp7 = (q) => new Promise((K, _) => {
        if (q.on("exit", (z, Y) => {
                K({
                    exitCode: z,
                    signal: Y
                })
            }), q.on("error", (z) => {
                _(z)
            }), q.stdin) q.stdin.on("error", (z) => {
            _(z)
        })
    })
// @from(Ln 46736, Col 4)
Bp7 = L(() => {
    ql5 = (async () => {})().constructor.prototype, Kl5 = ["then", "catch", "finally"].map((q) => [q, Reflect.getOwnPropertyDescriptor(ql5, q)])
})
// @from(Ln 46745, Col 4)
gp7 = (q, K = []) => {
        if (!Array.isArray(K)) return [q];
        return [q, ...K]
    }
// @from(Ln 46749, Col 4)
Yl5
// @from(Ln 46749, Col 9)
Al5 = (q) => {
        if (typeof q !== "string" || Yl5.test(q)) return q;
        return `"${q.replaceAll('"',"\\\"")}"`
    }
// @from(Ln 46753, Col 4)
PA1 = (q, K) => gp7(q, K).join(" ")
// @from(Ln 46754, Col 4)
WA1 = (q, K) => gp7(q, K).map((_) => Al5(_)).join(" ")
// @from(Ln 46755, Col 4)
Ol5
// @from(Ln 46755, Col 9)
pp7 = (q) => {
        let K = typeof q;
        if (K === "string") return q;
        if (K === "number") return String(q);
        if (K === "object" && q !== null && !(q instanceof zl5) && "stdout" in q) {
            let _ = typeof q.stdout;
            if (_ === "string") return q.stdout;
            if (_l5.isBuffer(q.stdout)) return q.stdout.toString();
            throw TypeError(`Unexpected "${_}" stdout in template expression`)
        }
        throw TypeError(`Unexpected "${K}" in template expression`)
    }
// @from(Ln 46767, Col 4)
Fp7 = (q, K, _) => _ || q.length === 0 || K.length === 0 ? [...q, ...K] : [...q.slice(0, -1), `${q.at(-1)}${K[0]}`, ...K.slice(1)]
// @from(Ln 46768, Col 4)
wl5 = ({
        templates: q,
        expressions: K,
        tokens: _,
        index: z,
        template: Y
    }) => {
        let A = Y ?? q.raw[z],
            O = A.split(Ol5).filter(Boolean),
            w = Fp7(_, O, A.startsWith(" "));
        if (z === K.length) return w;
        let $ = K[z],
            j = Array.isArray($) ? $.map((H) => pp7(H)) : [pp7($)];
        return Fp7(w, j, A.endsWith(" "))
    }
// @from(Ln 46783, Col 4)
DA1 = (q, K) => {
        let _ = [];
        for (let [z, Y] of q.entries()) _ = wl5({
            templates: q,
            expressions: K,
            tokens: _,
            index: z,
            template: Y
        });
        return _
    }
// @from(Ln 46794, Col 4)
Up7 = L(() => {
    Yl5 = /^[\w.-]+$/, Ol5 = / +/g
})
// @from(Ln 46801, Col 4)
Qp7
// @from(Ln 46801, Col 9)
IJ8 = (q, K) => String(q).padStart(K, "0")
// @from(Ln 46802, Col 4)
Hl5 = () => {
        let q = new Date;
        return `${IJ8(q.getHours(),2)}:${IJ8(q.getMinutes(),2)}:${IJ8(q.getSeconds(),2)}.${IJ8(q.getMilliseconds(),3)}`
    }
// @from(Ln 46806, Col 4)
ZA1 = (q, {
        verbose: K
    }) => {
        if (!K) return;
        jl5.stderr.write(`[${Hl5()}] ${q}
`)
    }
// @from(Ln 46813, Col 4)
dp7 = L(() => {
    Qp7 = $l5("execa").enabled
})
// @from(Ln 46823, Col 0)
function WU(q, K, _) {
    let z = np7(q, K, _),
        Y = PA1(q, K),
        A = WA1(q, K);
    ZA1(A, z.options), jp7(z.options);
    let O;
    try {
        O = fA1.spawn(z.file, z.args, z.options)
    } catch (M) {
        let P = new fA1.ChildProcess,
            W = Promise.reject($Q6({
                error: M,
                stdout: "",
                stderr: "",
                all: "",
                command: Y,
                escapedCommand: A,
                parsed: z,
                timedOut: !1,
                isCanceled: !1,
                killed: !1
            }));
        return MA1(P, W), P
    }
    let w = mp7(O),
        $ = $p7(O, z.options, w),
        j = Hp7(O, z.options, $),
        H = {
            isCanceled: !1
        };
    O.kill = Op7.bind(null, O.kill.bind(O)), O.cancel = wp7.bind(null, O, H);
    let X = cB7(async () => {
        let [{
            error: M,
            exitCode: P,
            signal: W,
            timedOut: D
        }, Z, G, f] = await xp7(O, z.options, j), v = XQ6(z.options, Z), V = XQ6(z.options, G), k = XQ6(z.options, f);
        if (M || P !== 0 || W !== null) {
            let N = $Q6({
                error: M,
                exitCode: P,
                signal: W,
                stdout: v,
                stderr: V,
                all: k,
                command: Y,
                escapedCommand: A,
                parsed: z,
                timedOut: D,
                isCanceled: H.isCanceled || (z.options.signal ? z.options.signal.aborted : !1),
                killed: O.killed
            });
            if (!z.options.reject) return N;
            throw N
        }
        return {
            command: Y,
            escapedCommand: A,
            exitCode: 0,
            stdout: v,
            stderr: V,
            all: k,
            failed: !1,
            timedOut: !1,
            isCanceled: !1,
            killed: !1
        }
    });
    return bp7(O, z.options), O.all = Ip7(O, z.options), Xp7(O), MA1(O, X), O
}
// @from(Ln 46895, Col 0)
function MQ6(q, K, _) {
    let z = np7(q, K, _),
        Y = PA1(q, K),
        A = WA1(q, K);
    ZA1(A, z.options);
    let O = Cp7(z.options),
        w;
    try {
        w = fA1.spawnSync(z.file, z.args, {
            ...z.options,
            input: O
        })
    } catch (H) {
        throw $Q6({
            error: H,
            stdout: "",
            stderr: "",
            all: "",
            command: Y,
            escapedCommand: A,
            parsed: z,
            timedOut: !1,
            isCanceled: !1,
            killed: !1
        })
    }
    let $ = XQ6(z.options, w.stdout, w.error),
        j = XQ6(z.options, w.stderr, w.error);
    if (w.error || w.status !== 0 || w.signal !== null) {
        let H = $Q6({
            stdout: $,
            stderr: j,
            error: w.error,
            signal: w.signal,
            exitCode: w.status,
            command: Y,
            escapedCommand: A,
            parsed: z,
            timedOut: w.error && w.error.code === "ETIMEDOUT",
            isCanceled: !1,
            killed: w.signal !== null
        });
        if (!z.options.reject) return H;
        throw H
    }
    return {
        command: Y,
        escapedCommand: A,
        exitCode: 0,
        stdout: $,
        stderr: j,
        failed: !1,
        timedOut: !1,
        isCanceled: !1,
        killed: !1
    }
}
// @from(Ln 46953, Col 0)
function ip7(q) {
    function K(_, ...z) {
        if (!Array.isArray(_)) return ip7({
            ...q,
            ..._
        });
        let [Y, ...A] = DA1(_, z);
        return WU(Y, A, cp7(q))
    }
    return K.sync = (_, ...z) => {
        if (!Array.isArray(_)) throw TypeError("Please use $(options).sync`command` instead of $.sync(options)`command`.");
        let [Y, ...A] = DA1(_, z);
        return MQ6(Y, A, cp7(q))
    }, K
}
// @from(Ln 46968, Col 4)
lp7
// @from(Ln 46968, Col 9)
Ml5 = 1e8
// @from(Ln 46969, Col 4)
Pl5 = ({
        env: q,
        extendEnv: K,
        preferLocal: _,
        localDir: z,
        execPath: Y
    }) => {
        let A = K ? {
            ...xJ8.env,
            ...q
        } : q;
        if (_) return gB7({
            env: A,
            cwd: z,
            execPath: Y
        });
        return A
    }
// @from(Ln 46987, Col 4)
np7 = (q, K, _ = {}) => {
        let z = lp7.default._parse(q, K, _);
        if (q = z.command, K = z.args, _ = z.options, _ = {
                maxBuffer: Ml5,
                buffer: !0,
                stripFinalNewline: !0,
                extendEnv: !0,
                preferLocal: !1,
                localDir: _.cwd || xJ8.cwd(),
                execPath: xJ8.execPath,
                encoding: "utf8",
                reject: !0,
                cleanup: !0,
                all: !1,
                windowsHide: !0,
                verbose: Qp7,
                ..._
            }, _.env = Pl5(_), _.stdio = qp7(_), xJ8.platform === "win32" && Xl5.basename(q, ".exe") === "cmd") K.unshift("/q");
        return {
            file: q,
            args: K,
            options: _,
            parsed: z
        }
    }
// @from(Ln 47012, Col 4)
XQ6 = (q, K, _) => {
        if (typeof K !== "string" && !Jl5.isBuffer(K)) return _ === void 0 ? void 0 : "";
        if (q.stripFinalNewline) return rY1(K);
        return K
    }
// @from(Ln 47017, Col 4)
Wl5 = ({
        input: q,
        inputFile: K,
        stdio: _
    }) => q === void 0 && K === void 0 && _ === void 0 ? {
        stdin: "inherit"
    } : {}
// @from(Ln 47024, Col 4)
cp7 = (q = {}) => ({
        preferLocal: !0,
        ...Wl5(q),
        ...q
    })
// @from(Ln 47029, Col 4)
W4O
// @from(Ln 47030, Col 4)
uJ8 = L(() => {
    UB7();
    lB7();
    eB7();
    Kp7();
    Jp7();
    Mp7();
    up7();
    Bp7();
    Up7();
    dp7();
    lp7 = K6(iY1(), 1);
    W4O = ip7()
})
// @from(Ln 47045, Col 0)
function rp7() {
    return process.platform === "win32"
}
// @from(Ln 47048, Col 0)
async function Xh(q, K = [], _) {
    if (rp7()) {
        let z = KQ6(q);
        if (z === null) throw Error(`Command '${q}' not found or is in an unsafe location (current directory)`);
        return WU(z, K, _)
    }
    return WU(q, K, _)
}
// @from(Ln 47057, Col 0)
function mJ8(q, K = [], _) {
    if (rp7()) {
        let z = KQ6(q);
        if (z === null) throw Error(`Command '${q}' not found or is in an unsafe location (current directory)`);
        return MQ6(z, K, _)
    }
    return MQ6(q, K, _)
}
// @from(Ln 47065, Col 0)
async function ij(q, K) {
    return WU(q, {
        ...K,
        shell: !0
    })
}
// @from(Ln 47072, Col 0)
function op7(q, K) {
    return MQ6(q, {
        ...K,
        shell: !0
    })
}
// @from(Ln 47078, Col 4)
NV = L(() => {
    uJ8();
    JJ8()
})
// @from(Ln 47083, Col 0)
function oC(q, K, _ = 10 * sp7 * ap7) {
    let j = [];
    try {
        let z;
        if (K === void 0) z = {};
        else if (K instanceof AbortSignal) z = {
            abortSignal: K,
            timeout: _
        };
        else z = K;
        let {
            abortSignal: Y,
            timeout: A = 10 * sp7 * ap7,
            input: O,
            stdio: w = ["ignore", "pipe", "pipe"]
        } = z;
        Y?.throwIfAborted();
        const $ = rz(j, Jw`exec: ${q.slice(0,200)}`, 0);
        try {
            let M = op7(q, {
                env: process.env,
                maxBuffer: 1e6,
                timeout: A,
                cwd: b8(),
                stdio: w,
                reject: !1,
                input: O
            });
            if (!M.stdout) return null;
            return M.stdout.trim() || null
        } catch {
            return null
        }
    } catch (H) {
        var J = H,
            X = 1
    } finally {
        oz(j, J, X)
    }
}
// @from(Ln 47123, Col 4)
ap7 = 1000
// @from(Ln 47124, Col 4)
sp7 = 60
// @from(Ln 47125, Col 4)
GA1 = L(() => {
    n7();
    NV();
    e8()
})
// @from(Ln 47131, Col 0)
function w1(q, K, _ = {
    timeout: 10 * TA1 * vA1,
    preserveOutputOnError: !0,
    useCwd: !0
}) {
    return M7(q, K, {
        abortSignal: _.abortSignal,
        timeout: _.timeout,
        preserveOutputOnError: _.preserveOutputOnError,
        cwd: _.useCwd ? b8() : void 0,
        env: _.env,
        stdin: _.stdin,
        input: _.input
    })
}
// @from(Ln 47147, Col 0)
function Dl5(q, K) {
    if (q.shortMessage) return q.shortMessage;
    if (typeof q.signal === "string") return q.signal;
    return String(K)
}
// @from(Ln 47153, Col 0)
function M7(q, K, {
    abortSignal: _,
    timeout: z = 10 * TA1 * vA1,
    preserveOutputOnError: Y = !0,
    cwd: A,
    env: O,
    maxBuffer: w,
    shell: $,
    stdin: j,
    input: H
} = {
    timeout: 10 * TA1 * vA1,
    preserveOutputOnError: !0,
    maxBuffer: 1e6
}) {
    let J = q;
    if (process.platform === "win32" && !$) {
        let X = KQ6(q);
        if (X === null) return Promise.resolve({
            stdout: "",
            stderr: `Command '${q}' not found or is in an unsafe location (current directory)`,
            code: 127,
            error: `Command '${q}' not found or is in an unsafe location (current directory)`
        });
        J = X
    }
    return new Promise((X) => {
        WU(J, K, {
            maxBuffer: w,
            signal: _,
            timeout: z,
            cwd: A,
            env: O,
            shell: $,
            stdin: j,
            input: H,
            reject: !1
        }).then((M) => {
            if (M.failed)
                if (Y) {
                    let P = M.exitCode ?? 1;
                    X({
                        stdout: M.stdout || "",
                        stderr: M.stderr || "",
                        code: P,
                        error: Dl5(M, P)
                    })
                } else X({
                    stdout: "",
                    stderr: "",
                    code: M.exitCode ?? 1
                });
            else X({
                stdout: M.stdout,
                stderr: M.stderr,
                code: 0
            })
        }).catch((M) => {
            j6(M), X({
                stdout: "",
                stderr: "",
                code: 1
            })
        })
    })
}
// @from(Ln 47219, Col 4)
vA1 = 1000
// @from(Ln 47220, Col 4)
TA1 = 60
// @from(Ln 47221, Col 4)
Q4 = L(() => {
    uJ8();
    n7();
    U8();
    JJ8();
    GA1()
})
// @from(Ln 47229, Col 0)
function PQ6(q) {
    let K = q.slice(q.lastIndexOf(".")).toLowerCase();
    return Zl5.has(K)
}
// @from(Ln 47234, Col 0)
function VA1(q) {
    let K = Math.min(q.length, fl5),
        _ = 0;
    for (let z = 0; z < K; z++) {
        let Y = q[z];
        if (Y === 0) return !0;
        if (Y < 32 && Y !== 9 && Y !== 10 && Y !== 13) _++
    }
    return _ / K > 0.1
}
// @from(Ln 47244, Col 4)
Zl5
// @from(Ln 47244, Col 9)
fl5 = 8192
// @from(Ln 47245, Col 4)
BJ8 = L(() => {
    Zl5 = new Set([".png", ".jpg", ".jpeg", ".gif", ".bmp", ".ico", ".webp", ".tiff", ".tif", ".mp4", ".mov", ".avi", ".mkv", ".webm", ".wmv", ".flv", ".m4v", ".mpeg", ".mpg", ".mp3", ".wav", ".ogg", ".flac", ".aac", ".m4a", ".wma", ".aiff", ".opus", ".zip", ".tar", ".gz", ".bz2", ".7z", ".rar", ".xz", ".z", ".tgz", ".iso", ".exe", ".dll", ".so", ".dylib", ".bin", ".o", ".a", ".obj", ".lib", ".app", ".msi", ".deb", ".rpm", ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".odt", ".ods", ".odp", ".ttf", ".otf", ".woff", ".woff2", ".eot", ".pyc", ".pyo", ".class", ".jar", ".war", ".ear", ".node", ".wasm", ".rlib", ".sqlite", ".sqlite3", ".db", ".mdb", ".idx", ".psd", ".ai", ".eps", ".sketch", ".fig", ".xd", ".blend", ".3ds", ".max", ".swf", ".fla", ".lockb", ".dat", ".data"])
})
// @from(Ln 47254, Col 0)
async function WQ6(q, K, _, z) {
    try {
        let Y = await Gl5(vl5(q, "config"), "utf-8");
        return kA1(Y, K, _, z)
    } catch {
        return null
    }
}
// @from(Ln 47263, Col 0)
function kA1(q, K, _, z) {
    let Y = q.split(`
`),
        A = K.toLowerCase(),
        O = z.toLowerCase(),
        w = !1;
    for (let $ of Y) {
        let j = $.trim();
        if (j.length === 0 || j[0] === "#" || j[0] === ";") continue;
        if (j[0] === "[") {
            w = Nl5(j, A, _);
            continue
        }
        if (!w) continue;
        let H = Tl5(j);
        if (H && H.key.toLowerCase() === O) return H.value
    }
    return null
}
// @from(Ln 47283, Col 0)
function Tl5(q) {
    let K = 0;
    while (K < q.length && El5(q[K])) K++;
    if (K === 0) return null;
    let _ = q.slice(0, K);
    while (K < q.length && (q[K] === " " || q[K] === "\t")) K++;
    if (K >= q.length || q[K] !== "=") return null;
    K++;
    while (K < q.length && (q[K] === " " || q[K] === "\t")) K++;
    let z = Vl5(q, K);
    return {
        key: _,
        value: z
    }
}
// @from(Ln 47299, Col 0)
function Vl5(q, K) {
    let _ = "",
        z = !1,
        Y = K;
    while (Y < q.length) {
        let A = q[Y];
        if (!z && (A === "#" || A === ";")) break;
        if (A === '"') {
            z = !z, Y++;
            continue
        }
        if (A === "\\" && Y + 1 < q.length) {
            let O = q[Y + 1];
            if (z) {
                switch (O) {
                    case "n":
                        _ += `
`;
                        break;
                    case "t":
                        _ += "\t";
                        break;
                    case "b":
                        _ += "\b";
                        break;
                    case '"':
                        _ += '"';
                        break;
                    case "\\":
                        _ += "\\";
                        break;
                    default:
                        _ += O;
                        break
                }
                Y += 2;
                continue
            }
            if (O === "\\") {
                _ += "\\", Y += 2;
                continue
            }
        }
        _ += A, Y++
    }
    if (!z) _ = kl5(_);
    return _
}
// @from(Ln 47348, Col 0)
function kl5(q) {
    let K = q.length;
    while (K > 0 && (q[K - 1] === " " || q[K - 1] === "\t")) K--;
    return q.slice(0, K)
}
// @from(Ln 47354, Col 0)
function Nl5(q, K, _) {
    let z = 1;
    while (z < q.length && q[z] !== "]" && q[z] !== " " && q[z] !== "\t" && q[z] !== '"') z++;
    if (q.slice(1, z).toLowerCase() !== K) return !1;
    if (_ === null) return z < q.length && q[z] === "]";
    while (z < q.length && (q[z] === " " || q[z] === "\t")) z++;
    if (z >= q.length || q[z] !== '"') return !1;
    z++;
    let A = "";
    while (z < q.length && q[z] !== '"') {
        if (q[z] === "\\" && z + 1 < q.length) {
            let O = q[z + 1];
            if (O === "\\" || O === '"') {
                A += O, z += 2;
                continue
            }
            A += O, z += 2;
            continue
        }
        A += q[z], z++
    }
    if (z >= q.length || q[z] !== '"') return !1;
    if (z++, z >= q.length || q[z] !== "]") return !1;
    return A === _
}
// @from(Ln 47380, Col 0)
function El5(q) {
    return q >= "a" && q <= "z" || q >= "A" && q <= "Z" || q >= "0" && q <= "9" || q === "-"
}
// @from(Ln 47383, Col 4)
pJ8 = () => {}
// @from(Ln 47384, Col 4)
zF7 = {}
// @from(Ln 47422, Col 0)
function NA1() {
    cf6.clear()
}
// @from(Ln 47425, Col 0)
async function RW(q) {
    let K = FJ8(q ?? b8()),
        _ = cf6.get(K);
    if (_ !== void 0) return _;
    let z = ez(K);
    if (!z) return cf6.set(K, null), null;
    let Y = Mh(z, ".git");
    try {
        if ((await qF7(Y)).isFile()) {
            let O = (await CA6(Y, "utf-8")).trim();
            if (O.startsWith("gitdir:")) {
                let w = O.slice(7).trim(),
                    $ = FJ8(z, w);
                return cf6.set(K, $), $
            }
        }
        return cf6.set(K, Y), Y
    } catch {
        return cf6.set(K, null), null
    }
}
// @from(Ln 47447, Col 0)
function DQ6(q) {
    if (!q || q.startsWith("-") || q.startsWith("/")) return !1;
    if (q.includes("..")) return !1;
    if (q.split("/").some((K) => K === "." || K === "")) return !1;
    if (!/^[a-zA-Z0-9/._+@-]+$/.test(q)) return !1;
    return !0
}
// @from(Ln 47455, Col 0)
function lf6(q) {
    return /^[0-9a-f]{40}$/.test(q) || /^[0-9a-f]{64}$/.test(q)
}
// @from(Ln 47458, Col 0)
async function bA6(q) {
    try {
        let K = (await CA6(Mh(q, "HEAD"), "utf-8")).trim();
        if (K.startsWith("ref:")) {
            let _ = K.slice(4).trim();
            if (_.startsWith("refs/heads/")) {
                let Y = _.slice(11);
                if (!DQ6(Y)) return null;
                return {
                    type: "branch",
                    name: Y
                }
            }
            if (!DQ6(_)) return null;
            let z = await kr(q, _);
            return z ? {
                type: "detached",
                sha: z
            } : {
                type: "detached",
                sha: ""
            }
        }
        if (!lf6(K)) return null;
        return {
            type: "detached",
            sha: K
        }
    } catch {
        return null
    }
}
// @from(Ln 47490, Col 0)
async function kr(q, K) {
    let _ = await ep7(q, K);
    if (_) return _;
    let z = await aC(q);
    if (z && z !== q) return ep7(z, K);
    return null
}
// @from(Ln 47497, Col 0)
async function ep7(q, K) {
    try {
        let _ = (await CA6(Mh(q, K), "utf-8")).trim();
        if (_.startsWith("ref:")) {
            let z = _.slice(4).trim();
            if (!DQ6(z)) return null;
            return kr(q, z)
        }
        if (!lf6(_)) return null;
        return _
    } catch {}
    try {
        let _ = await CA6(Mh(q, "packed-refs"), "utf-8");
        for (let z of _.split(`
`)) {
            if (z.startsWith("#") || z.startsWith("^")) continue;
            let Y = z.indexOf(" ");
            if (Y === -1) continue;
            if (z.slice(Y + 1) === K) {
                let A = z.slice(0, Y);
                return lf6(A) ? A : null
            }
        }
    } catch {}
    return null
}
// @from(Ln 47523, Col 0)
async function aC(q) {
    try {
        let K = (await CA6(Mh(q, "commondir"), "utf-8")).trim();
        return FJ8(q, K)
    } catch {
        return null
    }
}
// @from(Ln 47531, Col 0)
async function KF7(q, K, _) {
    try {
        let z = (await CA6(Mh(q, K), "utf-8")).trim();
        if (z.startsWith("ref:")) {
            let Y = z.slice(4).trim();
            if (Y.startsWith(_)) {
                let A = Y.slice(_.length);
                if (!DQ6(A)) return null;
                return A
            }
        }
    } catch {}
    return null
}
// @from(Ln 47545, Col 0)
class _F7 {
    gitDir = null;
    commonDir = null;
    initialized = !1;
    initPromise = null;
    watchedPaths = [];
    branchRefPath = null;
    cache = new Map;
    repoBranches = new Map;
    repoGitDirs = new Map;
    repoBranchListeners = [];
    async ensureStarted() {
        if (this.initialized) return;
        if (this.initPromise) return this.initPromise;
        return this.initPromise = this.start(), this.initPromise
    }
    async start() {
        if (this.gitDir = await RW(), this.initialized = !0, eq(async () => {
                this.stopWatching()
            }), !this.gitDir) return;
        this.commonDir = await aC(this.gitDir), this.watchPath(Mh(this.gitDir, "HEAD"), () => {
            this.onHeadChanged()
        }), this.watchPath(Mh(this.commonDir ?? this.gitDir, "config"), () => {
            this.invalidate()
        }), await this.watchCurrentBranchRef()
    }
    watchPath(q, K) {
        this.watchedPaths.push(q), yl5(q, {
            interval: hl5
        }, K)
    }
    async watchCurrentBranchRef() {
        if (!this.gitDir) return;
        let q = await bA6(this.gitDir),
            K = this.commonDir ?? this.gitDir,
            _ = q?.type === "branch" ? Mh(K, "refs", "heads", q.name) : null;
        if (_ === this.branchRefPath) return;
        if (this.branchRefPath) tp7(this.branchRefPath), this.watchedPaths = this.watchedPaths.filter((z) => z !== this.branchRefPath);
        if (this.branchRefPath = _, !_) return;
        this.watchPath(_, () => {
            this.invalidate()
        })
    }
    async onHeadChanged() {
        this.invalidate(), await dB6(), await this.watchCurrentBranchRef()
    }
    invalidate() {
        for (let q of this.cache.values()) q.dirty = !0
    }
    stopWatching() {
        for (let q of this.watchedPaths) tp7(q);
        this.watchedPaths = [], this.branchRefPath = null
    }
    async get(q, K) {
        await this.ensureStarted();
        let _ = this.cache.get(q);
        if (_ && !_.dirty) return _.value;
        if (_) _.dirty = !1;
        let z = await K(),
            Y = this.cache.get(q);
        if (Y && !Y.dirty) Y.value = z;
        if (!Y) this.cache.set(q, {
            value: z,
            dirty: !1,
            compute: K
        });
        return z
    }
    async addRepo(q) {
        if (this.repoGitDirs.has(q)) return;
        let K = await RW(q);
        if (!K) return;
        this.repoGitDirs.set(q, K), this.watchPath(Mh(K, "HEAD"), () => {
            this.repoBranches.delete(q);
            for (let _ of this.repoBranchListeners) _()
        })
    }
    onRepoBranchChange(q) {
        return this.repoBranchListeners.push(q), () => {
            let K = this.repoBranchListeners.indexOf(q);
            if (K !== -1) this.repoBranchListeners.splice(K, 1)
        }
    }
    async getBranchForRepo(q) {
        if (this.repoBranches.has(q)) return this.repoBranches.get(q);
        let K = this.repoGitDirs.get(q);
        if (!K) return;
        let _ = await bA6(K),
            z = _?.type === "branch" ? _.name : null;
        return this.repoBranches.set(q, z), z
    }
    reset() {
        this.stopWatching(), this.cache.clear(), this.repoBranches.clear(), this.repoGitDirs.clear(), this.repoBranchListeners = [], this.initialized = !1, this.initPromise = null, this.gitDir = null, this.commonDir = null
    }
}
// @from(Ln 47640, Col 0)
async function Rl5() {
    let q = await RW();
    if (!q) return "HEAD";
    let K = await bA6(q);
    if (!K) return "HEAD";
    return K.type === "branch" ? K.name : "HEAD"
}
// @from(Ln 47647, Col 0)
async function Sl5() {
    let q = await RW();
    if (!q) return "";
    let K = await bA6(q);
    if (!K) return "";
    if (K.type === "branch") return await kr(q, `refs/heads/${K.name}`) ?? "";
    return K.sha
}
// @from(Ln 47655, Col 0)
async function gJ8(q) {
    return await WQ6(q, "remote", "origin", "pushurl") || await WQ6(q, "remote", "origin", "url")
}
// @from(Ln 47658, Col 0)
async function Cl5() {
    let q = await RW();
    if (!q) return null;
    let K = await gJ8(q);
    if (K) return K;
    let _ = await aC(q);
    if (_ && _ !== q) return gJ8(_);
    return null
}
// @from(Ln 47667, Col 0)
async function bl5() {
    let q = await RW();
    if (!q) return "main";
    let K = await aC(q) ?? q,
        _ = await KF7(K, "refs/remotes/origin/HEAD", "refs/remotes/origin/");
    if (_) return _;
    for (let z of ["main", "master"])
        if (await kr(K, `refs/remotes/origin/${z}`)) return z;
    return "main"
}
// @from(Ln 47678, Col 0)
function EA1() {
    return I16.get("branch", Rl5)
}
// @from(Ln 47682, Col 0)
function yA1() {
    return I16.get("head", Sl5)
}
// @from(Ln 47686, Col 0)
function LA1() {
    return I16.get("remoteUrl", Cl5)
}
// @from(Ln 47690, Col 0)
function hA1() {
    return I16.get("defaultBranch", bl5)
}
// @from(Ln 47694, Col 0)
function RA1(q) {
    return I16.addRepo(q)
}
// @from(Ln 47698, Col 0)
function SA1(q) {
    return I16.onRepoBranchChange(q)
}
// @from(Ln 47702, Col 0)
function CA1(q) {
    return I16.getBranchForRepo(q)
}
// @from(Ln 47706, Col 0)
function Il5() {
    I16.reset()
}
// @from(Ln 47709, Col 0)
async function ZQ6(q) {
    let K = await RW(q);
    if (!K) return null;
    let _ = await bA6(K);
    if (!_) return null;
    if (_.type === "branch") return kr(K, `refs/heads/${_.name}`);
    return _.sha
}
// @from(Ln 47717, Col 0)
async function bA1(q) {
    let K;
    try {
        let z = (await CA6(Mh(q, ".git"), "utf-8")).trim();
        if (!z.startsWith("gitdir:")) return null;
        K = FJ8(q, z.slice(7).trim())
    } catch {
        return null
    }
    let _ = await bA6(K);
    if (!_) return null;
    if (_.type === "branch") return kr(K, `refs/heads/${_.name}`);
    return _.sha
}
// @from(Ln 47731, Col 0)
async function fQ6(q) {
    let K = await RW(q);
    if (!K) return null;
    let _ = await gJ8(K);
    if (_) return _;
    let z = await aC(K);
    if (z && z !== K) return gJ8(z);
    return null
}
// @from(Ln 47740, Col 0)
async function IA1() {
    let q = await RW();
    if (!q) return !1;
    let K = await aC(q) ?? q;
    try {
        return await qF7(Mh(K, "shallow")), !0
    } catch {
        return !1
    }
}
// @from(Ln 47750, Col 0)
async function xA1() {
    try {
        let q = await RW();
        if (!q) return 0;
        let K = await aC(q) ?? q;
        return (await Ll5(Mh(K, "worktrees"))).length + 1
    } catch {
        return 1
    }
}
// @from(Ln 47760, Col 4)
cf6
// @from(Ln 47760, Col 9)
hl5 = 1000
// @from(Ln 47761, Col 4)
I16
// @from(Ln 47762, Col 4)
sC = L(() => {
    y8();
    R9();
    n7();
    pK();
    pJ8();
    cf6 = new Map;
    I16 = new _F7
})
// @from(Ln 47782, Col 0)
function uA1(q) {
    let K = process.cwd().toLowerCase();
    return q.filter((_) => {
        let z = Bl5(_).toLowerCase();
        return xl5(z).toLowerCase() !== K && !z.startsWith(K + pl5)
    })
}
// @from(Ln 47790, Col 0)
function AF7() {
    let q = process.env.SYSTEMROOT || "C:\\Windows";
    return ml5(q, "System32", "where.exe")
}
// @from(Ln 47794, Col 0)
async function Fl5(q) {
    if (process.platform === "win32") {
        let _ = await WU(AF7(), [q], {
            reject: !1
        });
        if (_.exitCode !== 0 || !_.stdout) return null;
        let z = _.stdout.trim().split(/\r?\n/).filter(Boolean);
        return uA1(z)[0] || null
    }
    let K = await WU("which", [q], {
        stderr: "ignore",
        reject: !1
    });
    if (K.exitCode !== 0 || !K.stdout) return null;
    return K.stdout.trim()
}
// @from(Ln 47811, Col 0)
function gl5(q) {
    if (process.platform === "win32") try {
        let _ = YF7(AF7(), [q], {
            encoding: "utf-8",
            stdio: ["ignore", "pipe", "ignore"]
        }).trim().split(/\r?\n/).filter(Boolean);
        return uA1(_)[0] || null
    } catch {
        return null
    }
    try {
        return YF7("which", [q], {
            encoding: "utf-8",
            stdio: ["ignore", "pipe", "ignore"]
        }).trim() || null
    } catch {
        return null
    }
}
// @from(Ln 47831, Col 0)
function OF7(q) {
    let K = mA1(q);
    if (!K || process.platform !== "win32") return K;
    if (ul5(q)) return K;
    return uA1([K])[0] ?? null
}
// @from(Ln 47837, Col 4)
mA1
// @from(Ln 47837, Col 9)
oA
// @from(Ln 47837, Col 13)
rN
// @from(Ln 47838, Col 4)
n0 = L(() => {
    uJ8();
    mA1 = typeof Bun < "u" && typeof Bun.which === "function" ? Bun.which : null;
    oA = mA1 ? async (q) => OF7(q): Fl5, rN = mA1 ? OF7 : gl5
})
// @from(Ln 47843, Col 4)
GQ6 = {}
// @from(Ln 47853, Col 0)
function BA1() {
    IA6.clear()
}
// @from(Ln 47856, Col 0)
async function x16() {
    let q = await oN();
    if (!q) return null;
    if (q.host !== "github.com") return null;
    return `${q.owner}/${q.name}`
}
// @from(Ln 47862, Col 0)
async function oN() {
    let q = b8();
    if (IA6.has(q)) return IA6.get(q) ?? null;
    try {
        let K = await DU();
        if (E(`Git remote URL: ${nf6(K)}`), !K) return E("No git remote URL found"), IA6.set(q, null), null;
        let _ = xA6(K);
        return E(`Parsed repository: ${_?`${_.host}/${_.owner}/${_.name}`:null} from URL: ${nf6(K)}`), IA6.set(q, _), _
    } catch (K) {
        return E(`Error detecting repository: ${K}`), IA6.set(q, null), null
    }
}
// @from(Ln 47875, Col 0)
function pA1() {
    let q = IA6.get(b8());
    if (!q || q.host !== "github.com") return null;
    return `${q.owner}/${q.name}`
}
// @from(Ln 47881, Col 0)
function xA6(q) {
    let K = q.trim(),
        _ = K.match(/^git@([^:]+):([^/]+)\/([^/]+?)(?:\.git)?$/);
    if (_?.[1] && _[2] && _[3]) {
        if (!wF7(_[1])) return null;
        return {
            host: _[1],
            owner: _[2],
            name: _[3]
        }
    }
    let z = K.match(/^(https?|ssh|git):\/\/(?:[^@]+@)?([^/:]+(?::\d+)?)\/([^/]+)\/([^/]+?)(?:\.git)?$/);
    if (z?.[1] && z[2] && z[3] && z[4]) {
        let Y = z[1],
            A = z[2],
            O = A.split(":")[0] ?? "";
        if (!wF7(O)) return null;
        return {
            host: Y === "https" || Y === "http" ? A : O,
            owner: z[3],
            name: z[4]
        }
    }
    return null
}
// @from(Ln 47907, Col 0)
function uA6(q) {
    let K = q.trim(),
        _ = xA6(K);
    if (_) {
        if (_.host !== "github.com") return null;
        return `${_.owner}/${_.name}`
    }
    if (!K.includes("://") && !K.includes("@") && K.includes("/")) {
        let z = K.split("/");
        if (z.length === 2 && z[0] && z[1]) {
            let Y = z[1].replace(/\.git$/, "");
            return `${z[0]}/${Y}`
        }
    }
    return E(`Could not parse repository from: ${K}`), null
}
// @from(Ln 47924, Col 0)
function wF7(q) {
    if (!q.includes(".")) return !1;
    let K = q.split(".").pop();
    if (!K) return !1;
    return /^[a-zA-Z]+$/.test(K)
}
// @from(Ln 47930, Col 4)
IA6
// @from(Ln 47931, Col 4)
gZ = L(() => {
    n7();
    K8();
    pK();
    IA6 = new Map
})
// @from(Ln 47937, Col 4)
oJ8 = {}
// @from(Ln 47990, Col 0)
function ll5() {
    function q(K) {
        let _ = XF7(K);
        return _ === ZF7 ? null : _
    }
    return q.cache = XF7.cache, q
}
// @from(Ln 47997, Col 0)
async function gA1(q) {
    let K = await RW(q);
    if (!K || dJ8(K) === ".git" || dJ8(lJ8(K)) !== "worktrees") return null;
    return dJ8(K)
}
// @from(Ln 48003, Col 0)
function nl5() {
    function q(K) {
        let _ = ez(K);
        if (!_) return null;
        return MF7(_)
    }
    return q.cache = MF7.cache, q
}
// @from(Ln 48012, Col 0)
function vQ6(q) {
    return RW(q)
}
// @from(Ln 48015, Col 0)
async function il5() {
    let q = b8(),
        K = ez(q);
    if (!K) return !1;
    try {
        let [_, z] = await Promise.all([HF7(q), HF7(K)]);
        return _ === z
    } catch {
        return q === K
    }
}
// @from(Ln 48027, Col 0)
function nf6(q) {
    return q == null ? q : q.replace(/:\/\/[^/]*@/, "://***@")
}
// @from(Ln 48031, Col 0)
function TQ6(q) {
    let K = q.trim();
    if (!K) return null;
    let _ = K.match(/^git@([^:]+):(.+?)(?:\.git)?$/);
    if (_ && _[1] && _[2]) return `${_[1]}/${_[2]}`.toLowerCase();
    let z = K.match(/^(?:https?|ssh):\/\/(?:[^@]+@)?([^/]+)\/(.+?)(?:\.git)?$/);
    if (z && z[1] && z[2]) {
        let Y = z[1],
            A = z[2];
        if (Kn5(Y) && A.startsWith("git/")) {
            let O = A.slice(4),
                w = O.split("/");
            if (w.length >= 3 && w[0].includes(".")) return O.toLowerCase();
            return `github.com/${O}`.toLowerCase()
        }
        return `${Y}/${A}`.toLowerCase()
    }
    return null
}
// @from(Ln 48051, Col 0)
function rl5(q) {
    for (let K of [aN(q, ".git", "config"), aN(q, "config")]) try {
        return QJ8(K, "utf-8")
    } catch {}
    return null
}
// @from(Ln 48058, Col 0)
function al5(q) {
    let K = ol5(q);
    return K === FA1 ? null : K
}
// @from(Ln 48062, Col 0)
async function nJ8() {
    let q = await DU();
    if (!q) return null;
    let K = TQ6(q);
    if (!K) return null;
    return Ul5("sha256").update(K).digest("hex").substring(0, 16)
}
// @from(Ln 48069, Col 0)
async function dA1() {
    try {
        let [q, K, _, z, Y, A] = await Promise.all([fF7(), rj(), DU(), iJ8(), if6(), rf6()]);
        return {
            commitHash: q,
            branchName: K,
            remoteUrl: _,
            isHeadOnRemote: z,
            isClean: Y,
            worktreeCount: A
        }
    } catch (q) {
        return null
    }
}
// @from(Ln 48084, Col 0)
async function mA6() {
    let {
        parseGitRemote: q
    } = await Promise.resolve().then(() => (gZ(), GQ6)), K = await DU();
    if (!K) return E("Local GitHub repo: unknown"), null;
    let _ = q(K);
    if (_ && _.host === "github.com") {
        let z = `${_.owner}/${_.name}`;
        return E(`Local GitHub repo: ${z}`), z
    }
    return E("Local GitHub repo: unknown"), null
}
// @from(Ln 48096, Col 0)
async function GF7() {
    let {
        stdout: q,
        code: K
    } = await w1(D7(), ["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"], {
        preserveOutputOnError: !1
    });
    if (K === 0 && q.trim()) return q.trim();
    let {
        stdout: _,
        code: z
    } = await w1(D7(), ["remote", "show", "origin", "--", "HEAD"], {
        preserveOutputOnError: !1
    });
    if (z === 0) {
        let A = _.match(/HEAD branch: (\S+)/);
        if (A && A[1]) return `origin/${A[1]}`
    }
    let Y = ["origin/main", "origin/staging", "origin/master"];
    for (let A of Y) {
        let {
            code: O
        } = await w1(D7(), ["rev-parse", "--verify", A], {
            preserveOutputOnError: !1
        });
        if (O === 0) return A
    }
    return null
}
// @from(Ln 48126, Col 0)
function el5() {
    return IA1()
}
// @from(Ln 48129, Col 0)
async function UJ8() {
    let {
        stdout: q,
        code: K
    } = await w1(D7(), ["ls-files", "--others", "--exclude-standard"], {
        preserveOutputOnError: !1
    }), _ = q.trim();
    if (K !== 0 || !_) return [];
    let z = _.split(`
`).filter(Boolean),
        Y = [],
        A = 0;
    for (let O of z) {
        if (Y.length >= DF7) {
            E(`Untracked file capture: reached max file count (${DF7})`);
            break
        }
        if (PQ6(O)) continue;
        try {
            let $ = (await cl5(O)).size;
            if ($ > PF7) {
                E(`Untracked file capture: skipping ${O} (exceeds ${PF7} bytes)`);
                continue
            }
            if (A + $ > WF7) {
                E(`Untracked file capture: reached total size limit (${WF7} bytes)`);
                break
            }
            if ($ === 0) {
                Y.push({
                    path: O,
                    content: ""
                });
                continue
            }
            let j = Math.min(tl5, $),
                H = await Ql5(O, "r");
            try {
                let J = Buffer.alloc(j),
                    {
                        bytesRead: X
                    } = await H.read(J, 0, j, 0),
                    M = J.subarray(0, X);
                if (VA1(M)) continue;
                let P;
                if ($ <= j) P = M.toString("utf-8");
                else P = await dl5(O, "utf-8");
                Y.push({
                    path: O,
                    content: P
                }), A += $
            } finally {
                await H.close()
            }
        } catch (w) {
            E(`Failed to read untracked file ${O}: ${w}`)
        }
    }
    return Y
}
// @from(Ln 48189, Col 0)
async function qn5() {
    try {
        if (!await qX()) return null;
        if (await el5()) {
            E("Shallow clone detected, using HEAD-only mode for issue");
            let [{
                stdout: M
            }, P] = await Promise.all([w1(D7(), ["diff", "HEAD"]), UJ8()]);
            return {
                remote_base_sha: null,
                remote_base: null,
                patch: M || "",
                untracked_files: P,
                format_patch: null,
                head_sha: null,
                branch_name: null
            }
        }
        let K = await GF7();
        if (!K) {
            E("No remote found, using HEAD-only mode for issue");
            let [{
                stdout: M
            }, P] = await Promise.all([w1(D7(), ["diff", "HEAD"]), UJ8()]);
            return {
                remote_base_sha: null,
                remote_base: null,
                patch: M || "",
                untracked_files: P,
                format_patch: null,
                head_sha: null,
                branch_name: null
            }
        }
        let {
            stdout: _,
            code: z
        } = await w1(D7(), ["merge-base", "HEAD", K], {
            preserveOutputOnError: !1
        });
        if (z !== 0 || !_.trim()) {
            E("Merge-base failed, using HEAD-only mode for issue");
            let [{
                stdout: M
            }, P] = await Promise.all([w1(D7(), ["diff", "HEAD"]), UJ8()]);
            return {
                remote_base_sha: null,
                remote_base: null,
                patch: M || "",
                untracked_files: P,
                format_patch: null,
                head_sha: null,
                branch_name: null
            }
        }
        let Y = _.trim(),
            [{
                stdout: A
            }, O, {
                stdout: w,
                code: $
            }, {
                stdout: j
            }, {
                stdout: H
            }] = await Promise.all([w1(D7(), ["diff", Y]), UJ8(), w1(D7(), ["format-patch", `${Y}..HEAD`, "--stdout"]), w1(D7(), ["rev-parse", "HEAD"]), w1(D7(), ["rev-parse", "--abbrev-ref", "HEAD"])]),
            J = null;
        if ($ === 0 && w && w.trim()) J = w;
        let X = H?.trim();
        return {
            remote_base_sha: Y,
            remote_base: K,
            patch: A || "",
            untracked_files: O,
            format_patch: J,
            head_sha: j?.trim() || null,
            branch_name: X && X !== "HEAD" ? X : null
        }
    } catch (q) {
        return j6(q), null
    }
}
// @from(Ln 48272, Col 0)
function Kn5(q) {
    let K = i5(q, ":");
    return K === "localhost" || /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(K)
}
// @from(Ln 48277, Col 0)
function kQ6() {
    let q = V8(),
        K = b8(),
        _ = aN(K, ".git");
    try {
        let z = q.statSync(_);
        if (z.isFile()) return !1;
        if (z.isDirectory()) {
            let Y = aN(_, "HEAD");
            try {
                if (q.statSync(Y).isFile()) return !1
            } catch {}
        }
    } catch {}
    try {
        if (q.statSync(aN(K, "HEAD")).isFile()) return !0
    } catch {}
    try {
        if (q.statSync(aN(K, "objects")).isDirectory()) return !0
    } catch {}
    try {
        if (q.statSync(aN(K, "refs")).isDirectory()) return !0
    } catch {}
    return !1
}
// @from(Ln 48302, Col 4)
ZF7
// @from(Ln 48302, Col 9)
XF7
// @from(Ln 48302, Col 14)
ez
// @from(Ln 48302, Col 18)
MF7
// @from(Ln 48302, Col 23)
zj
// @from(Ln 48302, Col 27)
D7
// @from(Ln 48302, Col 31)
qX
// @from(Ln 48302, Col 35)
UA1 = async (q) => {
    return ez(q) !== null
}
// @from(Ln 48304, Col 3)
fF7 = async () => {
    return yA1()
}
// @from(Ln 48306, Col 3)
rj = async () => {
    return EA1()
}
// @from(Ln 48308, Col 3)
UZ = async () => {
    return hA1()
}
// @from(Ln 48310, Col 3)
DU = async () => {
    return LA1()
}
// @from(Ln 48312, Col 3)
FA1
// @from(Ln 48312, Col 8)
ol5
// @from(Ln 48312, Col 13)
iJ8 = async () => {
    let {
        code: q
    } = await w1(D7(), ["rev-parse", "@{u}"], {
        preserveOutputOnError: !1
    });
    return q === 0
}
// @from(Ln 48319, Col 3)
VQ6 = async () => {
    let {
        stdout: q,
        code: K
    } = await w1(D7(), ["rev-list", "--count", "@{u}..HEAD"], {
        preserveOutputOnError: !1
    });
    return K === 0 && parseInt(q.trim(), 10) > 0
}
// @from(Ln 48327, Col 3)
if6 = async (q) => {
    let K = ["--no-optional-locks", "status", "--porcelain"];
    if (q?.ignoreUntracked) K.push("-uno");
    let {
        stdout: _
    } = await w1(D7(), K, {
        preserveOutputOnError: !1
    });
    return _.trim().length === 0
}
// @from(Ln 48336, Col 3)
sl5 = async () => {
    let {
        stdout: q
    } = await w1(D7(), ["--no-optional-locks", "status", "--porcelain"], {
        preserveOutputOnError: !1
    });
    return q.trim().split(`
`).map((K) => K.trim().split(" ", 2)[1]?.trim()).filter((K) => typeof K === "string")
}
// @from(Ln 48344, Col 3)
rJ8 = async () => {
    let {
        stdout: q
    } = await w1(D7(), ["--no-optional-locks", "status", "--porcelain"], {
        preserveOutputOnError: !1
    }), K = [], _ = [];
    return q.trim().split(`
`).filter((z) => z.length > 0).forEach((z) => {
        let Y = z.substring(0, 2),
            A = z.substring(2).trim();
        if (Y === "??") _.push(A);
        else if (A) K.push(A)
    }), {
        tracked: K,
        untracked: _
    }
}
// @from(Ln 48360, Col 3)
rf6 = async () => {
    return xA1()
}
// @from(Ln 48362, Col 3)
QA1 = async (q) => {
    try {
        let K = q || `Claude Code auto-stash - ${new Date().toISOString()}`,
            {
                untracked: _
            } = await rJ8();
        if (_.length > 0) {
            let {
                code: Y
            } = await w1(D7(), ["add", ..._], {
                preserveOutputOnError: !1
            });
            if (Y !== 0) return !1
        }
        let {
            code: z
        } = await w1(D7(), ["stash", "push", "--message", K], {
            preserveOutputOnError: !1
        });
        return z === 0
    } catch (K) {
        return !1
    }
}
// @from(Ln 48385, Col 3)
PF7 = 524288000
// @from(Ln 48385, Col 20)
WF7 = 5368709120
// @from(Ln 48385, Col 38)
DF7 = 20000
// @from(Ln 48385, Col 51)
tl5 = 65536
// @from(Ln 48386, Col 4)
pK = L(() => {
    U4();
    BJ8();
    n7();
    K8();
    VA();
    Q4();
    Yq();
    pJ8();
    sC();
    U8();
    Lm();
    n0();
    ZF7 = Symbol("git-root-not-found"), XF7 = aX((q) => {
        let K = Date.now();
        j1("info", "find_git_root_started");
        let _ = cJ8(q),
            z = _.substring(0, _.indexOf(JF7) + 1) || JF7,
            Y = 0;
        while (_ !== z) {
            try {
                let O = aN(_, ".git");
                Y++;
                let w = jF7(O);
                if (w.isDirectory() || w.isFile()) return j1("info", "find_git_root_completed", {
                    duration_ms: Date.now() - K,
                    stat_count: Y,
                    found: !0
                }), _.normalize("NFC")
            } catch {}
            let A = lJ8(_);
            if (A === _) break;
            _ = A
        }
        try {
            let A = aN(z, ".git");
            Y++;
            let O = jF7(A);
            if (O.isDirectory() || O.isFile()) return j1("info", "find_git_root_completed", {
                duration_ms: Date.now() - K,
                stat_count: Y,
                found: !0
            }), z.normalize("NFC")
        } catch {}
        return j1("info", "find_git_root_completed", {
            duration_ms: Date.now() - K,
            stat_count: Y,
            found: !1
        }), ZF7
    }, (q) => q, 50), ez = ll5();
    MF7 = aX((q) => {
        try {
            let K = QJ8(aN(q, ".git"), "utf-8").trim();
            if (!K.startsWith("gitdir:")) return q;
            let _ = cJ8(q, K.slice(7).trim()),
                z = cJ8(_, QJ8(aN(_, "commondir"), "utf-8").trim());
            if (cJ8(lJ8(_)) !== aN(z, "worktrees")) return q;
            if ($F7(QJ8(aN(_, "gitdir"), "utf-8").trim()) !== aN($F7(q), ".git")) return q;
            if (dJ8(z) !== ".git") return z.normalize("NFC");
            return lJ8(z).normalize("NFC")
        } catch {
            return q
        }
    }, (q) => q, 50), zj = nl5();
    D7 = P1(() => {
        return rN("git") || "git"
    }), qX = P1(async () => {
        let q = Date.now();
        j1("info", "is_git_check_started");
        let K = ez(b8()) !== null;
        return j1("info", "is_git_check_completed", {
            duration_ms: Date.now() - q,
            is_git: K
        }), K
    });
    FA1 = Symbol("remote-slug-not-found");
    ol5 = aX((q) => {
        let K = rl5(q);
        if (!K) return FA1;
        let _ = (z) => {
            let Y = kA1(K, "remote", "origin", z);
            return Y ? TQ6(Y) : null
        };
        return _("pushurl") ?? _("url") ?? FA1
    }, (q) => q, 50)
})
// @from(Ln 48485, Col 0)
async function cA1(q, K) {
    let {
        code: _
    } = await M7("git", ["check-ignore", q], {
        preserveOutputOnError: !1,
        cwd: K
    });
    return _ === 0
}
// @from(Ln 48495, Col 0)
function jn5() {
    return $n5(On5(), ".config", "git", "ignore")
}
// @from(Ln 48498, Col 0)
async function vF7(q, K = b8()) {
    try {
        if (!await UA1(K)) return;
        let _ = `**/${q}`,
            z = q.endsWith("/") ? `${q}sample-file.txt` : q;
        if (await cA1(z, K)) return;
        let Y = jn5(),
            A = wn5(Y);
        await zn5(A, {
            recursive: !0
        });
        try {
            if ((await Yn5(Y, {
                    encoding: "utf-8"
                })).includes(_)) return;
            await _n5(Y, `
${_}
`)
        } catch (O) {
            if (Q1(O) === "ENOENT") await An5(Y, `${_}
`, "utf-8");
            else throw O
        }
    } catch (_) {
        j6(_)
    }
}
// @from(Ln 48525, Col 4)
lA1 = L(() => {
    n7();
    m8();
    Q4();
    pK();
    U8()
})