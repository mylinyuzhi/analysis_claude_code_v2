
// @from(Ln 49565, Col 4)
ds1 = v(() => {
    yH8();
    uH8(); /*! chokidar - MIT License (c) 2012 Paul Miller (paulmillr.com) */
    r_K = /\\/g, BH8 = /\/\//, o_K = /\..*\.(sw[px])$|~$|\.subl.*\.tmp/, a_K = /^\.[/\\]/;
    qJK = Object.freeze(new Set);
    kF6 = class kF6 extends c_K {
        constructor(A = {}) {
            super();
            this.closed = !1, this._closers = new Map, this._ignoredPaths = new Set, this._throttled = new Map, this._streams = new Set, this._symlinkPaths = new Map, this._watched = new Map, this._pendingWrites = new Map, this._pendingUnlinks = new Map, this._readyCount = 0, this._readyEmitted = !1;
            let q = A.awaitWriteFinish,
                K = {
                    stabilityThreshold: 2000,
                    pollInterval: 100
                },
                Y = {
                    persistent: !0,
                    ignoreInitial: !1,
                    ignorePermissionErrors: !1,
                    interval: 100,
                    binaryInterval: 300,
                    followSymlinks: !0,
                    usePolling: !1,
                    atomic: !0,
                    ...A,
                    ignored: A.ignored ? ps1(A.ignored) : ps1([]),
                    awaitWriteFinish: q === !0 ? K : typeof q === "object" ? {
                        ...K,
                        ...q
                    } : !1
                };
            if (xH8) Y.usePolling = !0;
            if (Y.atomic === void 0) Y.atomic = !Y.usePolling;
            let z = process.env.CHOKIDAR_USEPOLLING;
            if (z !== void 0) {
                let $ = z.toLowerCase();
                if ($ === "false" || $ === "0") Y.usePolling = !1;
                else if ($ === "true" || $ === "1") Y.usePolling = !0;
                else Y.usePolling = !!$
            }
            let w = process.env.CHOKIDAR_INTERVAL;
            if (w) Y.interval = Number.parseInt(w, 10);
            let H = 0;
            this._emitReady = () => {
                if (H++, H >= this._readyCount) this._emitReady = gs1, this._readyEmitted = !0, process.nextTick(() => this.emit(gH.READY))
            }, this._emitRaw = (...$) => this.emit(gH.RAW, ...$), this._boundRemove = this._remove.bind(this), this.options = Y, this._nodeFsHandler = new TF6(this), Object.freeze(Y)
        }
        _addIgnoredPath(A) {
            if (EF6(A)) {
                for (let q of this._ignoredPaths)
                    if (EF6(q) && q.path === A.path && q.recursive === A.recursive) return
            }
            this._ignoredPaths.add(A)
        }
        _removeIgnoredPath(A) {
            if (this._ignoredPaths.delete(A), typeof A === "string") {
                for (let q of this._ignoredPaths)
                    if (EF6(q) && q.path === A) this._ignoredPaths.delete(q)
            }
        }
        add(A, q, K) {
            let {
                cwd: Y
            } = this.options;
            this.closed = !1, this._closePromise = void 0;
            let z = FH8(A);
            if (Y) z = z.map((w) => {
                return AJK(w, Y)
            });
            if (z.forEach((w) => {
                    this._removeIgnoredPath(w)
                }), this._userIgnored = void 0, !this._readyCount) this._readyCount = 0;
            return this._readyCount += z.length, Promise.all(z.map(async (w) => {
                let H = await this._nodeFsHandler._addToNodeFs(w, !K, void 0, 0, q);
                if (H) this._emitReady();
                return H
            })).then((w) => {
                if (this.closed) return;
                w.forEach((H) => {
                    if (H) this.add(I9.dirname(H), I9.basename(q || H))
                })
            }), this
        }
        unwatch(A) {
            if (this.closed) return this;
            let q = FH8(A),
                {
                    cwd: K
                } = this.options;
            return q.forEach((Y) => {
                if (!I9.isAbsolute(Y) && !this._closers.has(Y)) {
                    if (K) Y = I9.join(K, Y);
                    Y = I9.resolve(Y)
                }
                if (this._closePath(Y), this._addIgnoredPath(Y), this._watched.has(Y)) this._addIgnoredPath({
                    path: Y,
                    recursive: !0
                });
                this._userIgnored = void 0
            }), this
        }
        close() {
            if (this._closePromise) return this._closePromise;
            this.closed = !0, this.removeAllListeners();
            let A = [];
            return this._closers.forEach((q) => q.forEach((K) => {
                let Y = K();
                if (Y instanceof Promise) A.push(Y)
            })), this._streams.forEach((q) => q.destroy()), this._userIgnored = void 0, this._readyCount = 0, this._readyEmitted = !1, this._watched.forEach((q) => q.dispose()), this._closers.clear(), this._watched.clear(), this._streams.clear(), this._symlinkPaths.clear(), this._throttled.clear(), this._closePromise = A.length ? Promise.all(A).then(() => {
                return
            }) : Promise.resolve(), this._closePromise
        }
        getWatched() {
            let A = {};
            return this._watched.forEach((q, K) => {
                let z = (this.options.cwd ? I9.relative(this.options.cwd, K) : K) || UH8;
                A[z] = q.getChildren().sort()
            }), A
        }
        emitWithAll(A, q) {
            if (this.emit(A, ...q), A !== gH.ERROR) this.emit(gH.ALL, A, ...q)
        }
        async _emit(A, q, K) {
            if (this.closed) return;
            let Y = this.options;
            if (NF6) q = I9.normalize(q);
            if (Y.cwd) q = I9.relative(Y.cwd, q);
            let z = [q];
            if (K != null) z.push(K);
            let w = Y.awaitWriteFinish,
                H;
            if (w && (H = this._pendingWrites.get(q))) return H.lastChange = new Date, this;
            if (Y.atomic) {
                if (A === gH.UNLINK) return this._pendingUnlinks.set(q, [A, ...z]), setTimeout(() => {
                    this._pendingUnlinks.forEach(($, O) => {
                        this.emit(...$), this.emit(gH.ALL, ...$), this._pendingUnlinks.delete(O)
                    })
                }, typeof Y.atomic === "number" ? Y.atomic : 100), this;
                if (A === gH.ADD && this._pendingUnlinks.has(q)) A = gH.CHANGE, this._pendingUnlinks.delete(q)
            }
            if (w && (A === gH.ADD || A === gH.CHANGE) && this._readyEmitted) {
                let $ = (O, _) => {
                    if (O) A = gH.ERROR, z[0] = O, this.emitWithAll(A, z);
                    else if (_) {
                        if (z.length > 1) z[1] = _;
                        else z.push(_);
                        this.emitWithAll(A, z)
                    }
                };
                return this._awaitWriteFinish(q, w.stabilityThreshold, A, $), this
            }
            if (A === gH.CHANGE) {
                if (!this._throttle(gH.CHANGE, q, 50)) return this
            }
            if (Y.alwaysStat && K === void 0 && (A === gH.ADD || A === gH.ADD_DIR || A === gH.CHANGE)) {
                let $ = Y.cwd ? I9.join(Y.cwd, q) : q,
                    O;
                try {
                    O = await p_K($)
                } catch (_) {}
                if (!O || this.closed) return;
                z.push(O)
            }
            return this.emitWithAll(A, z), this
        }
        _handleError(A) {
            let q = A && A.code;
            if (A && q !== "ENOENT" && q !== "ENOTDIR" && (!this.options.ignorePermissionErrors || q !== "EPERM" && q !== "EACCES")) this.emit(gH.ERROR, A);
            return A || this.closed
        }
        _throttle(A, q, K) {
            if (!this._throttled.has(A)) this._throttled.set(A, new Map);
            let Y = this._throttled.get(A);
            if (!Y) throw Error("invalid throttle");
            let z = Y.get(q);
            if (z) return z.count++, !1;
            let w, H = () => {
                let O = Y.get(q),
                    _ = O ? O.count : 0;
                if (Y.delete(q), clearTimeout(w), O) clearTimeout(O.timeoutObject);
                return _
            };
            w = setTimeout(H, K);
            let $ = {
                timeoutObject: w,
                clear: H,
                count: 0
            };
            return Y.set(q, $), $
        }
        _incrReadyCount() {
            return this._readyCount++
        }
        _awaitWriteFinish(A, q, K, Y) {
            let z = this.options.awaitWriteFinish;
            if (typeof z !== "object") return;
            let w = z.pollInterval,
                H, $ = A;
            if (this.options.cwd && !I9.isAbsolute(A)) $ = I9.join(this.options.cwd, A);
            let O = new Date,
                _ = this._pendingWrites;

            function J(X) {
                U_K($, (D, j) => {
                    if (D || !_.has(A)) {
                        if (D && D.code !== "ENOENT") Y(D);
                        return
                    }
                    let M = Number(new Date);
                    if (X && j.size !== X.size) _.get(A).lastChange = M;
                    let P = _.get(A);
                    if (M - P.lastChange >= q) _.delete(A), Y(void 0, j);
                    else H = setTimeout(J, w, j)
                })
            }
            if (!_.has(A)) _.set(A, {
                lastChange: O,
                cancelWait: () => {
                    return _.delete(A), clearTimeout(H), K
                }
            }), H = setTimeout(J, w)
        }
        _isIgnored(A, q) {
            if (this.options.atomic && o_K.test(A)) return !0;
            if (!this._userIgnored) {
                let {
                    cwd: K
                } = this.options, z = (this.options.ignored || []).map(gH8(K)), H = [...[...this._ignoredPaths].map(gH8(K)), ...z];
                this._userIgnored = e_K(H, void 0)
            }
            return this._userIgnored(A, q)
        }
        _isntIgnored(A, q) {
            return !this._isIgnored(A, q)
        }
        _getWatchHelpers(A) {
            return new cH8(A, this.options.followSymlinks, this)
        }
        _getWatchedDir(A) {
            let q = I9.resolve(A);
            if (!this._watched.has(q)) this._watched.set(q, new dH8(q, this._boundRemove));
            return this._watched.get(q)
        }
        _hasReadPermissions(A) {
            if (this.options.ignorePermissionErrors) return !0;
            return Boolean(Number(A.mode) & 256)
        }
        _remove(A, q, K) {
            let Y = I9.join(A, q),
                z = I9.resolve(Y);
            if (K = K != null ? K : this._watched.has(Y) || this._watched.has(z), !this._throttle("remove", Y, 100)) return;
            if (!K && this._watched.size === 1) this.add(A, q, !0);
            this._getWatchedDir(Y).getChildren().forEach((X) => this._remove(Y, X));
            let $ = this._getWatchedDir(A),
                O = $.has(q);
            if ($.remove(q), this._symlinkPaths.has(z)) this._symlinkPaths.delete(z);
            let _ = Y;
            if (this.options.cwd) _ = I9.relative(this.options.cwd, Y);
            if (this.options.awaitWriteFinish && this._pendingWrites.has(_)) {
                if (this._pendingWrites.get(_).cancelWait() === gH.ADD) return
            }
            this._watched.delete(Y), this._watched.delete(z);
            let J = K ? gH.UNLINK_DIR : gH.UNLINK;
            if (O && !this._isIgnored(Y)) this._emit(J, Y);
            this._closePath(Y)
        }
        _closePath(A) {
            this._closeFile(A);
            let q = I9.dirname(A);
            this._getWatchedDir(q).remove(I9.basename(A))
        }
        _closeFile(A) {
            let q = this._closers.get(A);
            if (!q) return;
            q.forEach((K) => K()), this._closers.delete(A)
        }
        _addPathCloser(A, q) {
            if (!q) return;
            let K = this._closers.get(A);
            if (!K) K = [], this._closers.set(A, K);
            K.push(q)
        }
        _readdirp(A, q) {
            if (this.closed) return;
            let K = {
                    type: gH.ALL,
                    alwaysStat: !0,
                    lstat: !0,
                    ...q,
                    depth: 0
                },
                Y = RH8(A, K);
            return this._streams.add(Y), Y.once(IH8, () => {
                Y = void 0
            }), Y.once(VF6, () => {
                if (Y) this._streams.delete(Y), Y = void 0
            }), Y
        }
    };
    wH1 = {
        watch: zJK,
        FSWatcher: kF6
    }
})
// @from(Ln 49870, Col 0)
function OJK() {
    if (Nq()) return;
    if (LF6 || yF6) return;
    LF6 = !0;
    let {
        dirs: A,
        settingsFiles: q
    } = XJK();
    if (A.length === 0) return;
    h(`Watching for changes in setting files ${[...q].join(", ")}...`), HH1 = wH1.watch(A, {
        persistent: !0,
        ignoreInitial: !0,
        depth: 0,
        awaitWriteFinish: {
            stabilityThreshold: RF6?.stabilityThreshold ?? wJK,
            pollInterval: RF6?.pollInterval ?? HJK
        },
        ignored: (K, Y) => {
            if (Y && !Y.isFile() && !Y.isDirectory()) return !0;
            if (K.split(_A1.sep).some((z) => z === ".git")) return !0;
            if (!Y || Y.isDirectory()) return !1;
            return !q.has(_A1.normalize(K))
        },
        ignorePermissionErrors: !0,
        usePolling: !1,
        atomic: !0
    }), HH1.on("change", DJK), HH1.on("unlink", jJK), Tq(async () => lH8())
}
// @from(Ln 49899, Col 0)
function lH8() {
    if (yF6 = !0, HH1) HH1.close(), HH1 = null;
    cs1.clear(), $H1.clear()
}
// @from(Ln 49904, Col 0)
function _JK(A) {
    return $H1.add(A), () => {
        $H1.delete(A)
    }
}
// @from(Ln 49910, Col 0)
function JJK(A) {
    let q = Vw(A);
    if (q) cs1.set(q, Date.now())
}
// @from(Ln 49915, Col 0)
function XJK() {
    let A = b1(),
        q = new Map,
        K = new Set;
    for (let z of gf) {
        if (z === "flagSettings") continue;
        let w = Vw(z);
        if (!w) continue;
        let H = _A1.dirname(w);
        if (!q.has(H)) q.set(H, new Set);
        q.get(H).add(w);
        try {
            if (A.statSync(w).isFile()) K.add(H)
        } catch {}
    }
    let Y = new Set;
    for (let z of K) {
        let w = q.get(z);
        if (w)
            for (let H of w) Y.add(H)
    }
    return {
        dirs: [...K],
        settingsFiles: Y
    }
}
// @from(Ln 49942, Col 0)
function DJK(A) {
    let q = iH8(A);
    if (!q) return;
    let K = cs1.get(A);
    if (K && Date.now() - K < $JK) {
        cs1.delete(A);
        return
    }
    h(`Detected change to ${A}`), $H1.forEach((Y) => Y(q))
}
// @from(Ln 49953, Col 0)
function jJK(A) {
    let q = iH8(A);
    if (!q) return;
    h(`Detected deletion of ${A}`), $H1.forEach((K) => K(q))
}
// @from(Ln 49959, Col 0)
function iH8(A) {
    let q = _A1.normalize(A);
    return gf.find((K) => Vw(K) === q)
}
// @from(Ln 49964, Col 0)
function MJK(A) {
    h(`Programmatic settings change notification for ${A}`), $H1.forEach((q) => q(A))
}
// @from(Ln 49968, Col 0)
function PJK(A) {
    LF6 = !1, yF6 = !1, RF6 = A ?? null
}
// @from(Ln 49971, Col 4)
wJK = 1000
// @from(Ln 49972, Col 4)
HJK = 500
// @from(Ln 49973, Col 4)
$JK = 5000
// @from(Ln 49974, Col 4)
HH1 = null
// @from(Ln 49975, Col 4)
LF6 = !1
// @from(Ln 49976, Col 4)
yF6 = !1
// @from(Ln 49977, Col 4)
cs1
// @from(Ln 49977, Col 9)
$H1
// @from(Ln 49977, Col 14)
RF6 = null
// @from(Ln 49978, Col 4)
zX
// @from(Ln 49979, Col 4)
IQ = v(() => {
    ds1();
    B6();
    Z6();
    _8();
    p8();
    E$();
    Tz();
    cs1 = new Map, $H1 = new Set;
    zX = {
        initialize: OJK,
        dispose: lH8,
        subscribe: _JK,
        markInternalWrite: JJK,
        notifyChange: MJK,
        resetForTesting: PJK
    }
})
// @from(Ln 49998, Col 0)
function E4() {
    return J6(process.env.CLAUDE_CODE_USE_BEDROCK) ? "bedrock" : J6(process.env.CLAUDE_CODE_USE_VERTEX) ? "vertex" : J6(process.env.CLAUDE_CODE_USE_FOUNDRY) ? "foundry" : "firstParty"
}
// @from(Ln 50002, Col 0)
function qb() {
    return E4()
}
// @from(Ln 50006, Col 0)
function OH1() {
    let A = process.env.ANTHROPIC_BASE_URL;
    if (!A) return !0;
    try {
        let q = new URL(A).host;
        return ["api.anthropic.com"].includes(q)
    } catch {
        return !1
    }
}
// @from(Ln 50016, Col 4)
UH = v(() => {
    hA()
})
// @from(Ln 50020, Col 0)
function ZJK() {
    let A = new Map;
    for (let [q, K] of Object.entries(L$)) {
        for (let [Y, z] of Object.entries(K)) L$[Y] = {
            open: `\x1B[${z[0]}m`,
            close: `\x1B[${z[1]}m`
        }, K[Y] = L$[Y], A.set(z[0], z[1]);
        Object.defineProperty(L$, q, {
            value: K,
            enumerable: !1
        })
    }
    return Object.defineProperty(L$, "codes", {
        value: A,
        enumerable: !1
    }), L$.color.close = "\x1B[39m", L$.bgColor.close = "\x1B[49m", L$.color.ansi = nH8(), L$.color.ansi256 = rH8(), L$.color.ansi16m = oH8(), L$.bgColor.ansi = nH8(10), L$.bgColor.ansi256 = rH8(10), L$.bgColor.ansi16m = oH8(10), Object.defineProperties(L$, {
        rgbToAnsi256: {
            value(q, K, Y) {
                if (q === K && K === Y) {
                    if (q < 8) return 16;
                    if (q > 248) return 231;
                    return Math.round((q - 8) / 247 * 24) + 232
                }
                return 16 + 36 * Math.round(q / 255 * 5) + 6 * Math.round(K / 255 * 5) + Math.round(Y / 255 * 5)
            },
            enumerable: !1
        },
        hexToRgb: {
            value(q) {
                let K = /[a-f\d]{6}|[a-f\d]{3}/i.exec(q.toString(16));
                if (!K) return [0, 0, 0];
                let [Y] = K;
                if (Y.length === 3) Y = [...Y].map((w) => w + w).join("");
                let z = Number.parseInt(Y, 16);
                return [z >> 16 & 255, z >> 8 & 255, z & 255]
            },
            enumerable: !1
        },
        hexToAnsi256: {
            value: (q) => L$.rgbToAnsi256(...L$.hexToRgb(q)),
            enumerable: !1
        },
        ansi256ToAnsi: {
            value(q) {
                if (q < 8) return 30 + q;
                if (q < 16) return 90 + (q - 8);
                let K, Y, z;
                if (q >= 232) K = ((q - 232) * 10 + 8) / 255, Y = K, z = K;
                else {
                    q -= 16;
                    let $ = q % 36;
                    K = Math.floor(q / 36) / 5, Y = Math.floor($ / 6) / 5, z = $ % 6 / 5
                }
                let w = Math.max(K, Y, z) * 2;
                if (w === 0) return 30;
                let H = 30 + (Math.round(z) << 2 | Math.round(Y) << 1 | Math.round(K));
                if (w === 2) H += 60;
                return H
            },
            enumerable: !1
        },
        rgbToAnsi: {
            value: (q, K, Y) => L$.ansi256ToAnsi(L$.rgbToAnsi256(q, K, Y)),
            enumerable: !1
        },
        hexToAnsi: {
            value: (q) => L$.ansi256ToAnsi(L$.hexToAnsi256(q)),
            enumerable: !1
        }
    }), L$
}
// @from(Ln 50091, Col 4)
nH8 = (A = 0) => (q) => `\x1B[${q+A}m`
// @from(Ln 50092, Col 4)
rH8 = (A = 0) => (q) => `\x1B[${38+A};5;${q}m`
// @from(Ln 50093, Col 4)
oH8 = (A = 0) => (q, K, Y) => `\x1B[${38+A};2;${q};${K};${Y}m`
// @from(Ln 50094, Col 4)
L$
// @from(Ln 50094, Col 8)
Esz
// @from(Ln 50094, Col 13)
WJK
// @from(Ln 50094, Col 18)
GJK
// @from(Ln 50094, Col 23)
ksz
// @from(Ln 50094, Col 28)
fJK
// @from(Ln 50094, Col 33)
PC
// @from(Ln 50095, Col 4)
aH8 = v(() => {
    L$ = {
        modifier: {
            reset: [0, 0],
            bold: [1, 22],
            dim: [2, 22],
            italic: [3, 23],
            underline: [4, 24],
            overline: [53, 55],
            inverse: [7, 27],
            hidden: [8, 28],
            strikethrough: [9, 29]
        },
        color: {
            black: [30, 39],
            red: [31, 39],
            green: [32, 39],
            yellow: [33, 39],
            blue: [34, 39],
            magenta: [35, 39],
            cyan: [36, 39],
            white: [37, 39],
            blackBright: [90, 39],
            gray: [90, 39],
            grey: [90, 39],
            redBright: [91, 39],
            greenBright: [92, 39],
            yellowBright: [93, 39],
            blueBright: [94, 39],
            magentaBright: [95, 39],
            cyanBright: [96, 39],
            whiteBright: [97, 39]
        },
        bgColor: {
            bgBlack: [40, 49],
            bgRed: [41, 49],
            bgGreen: [42, 49],
            bgYellow: [43, 49],
            bgBlue: [44, 49],
            bgMagenta: [45, 49],
            bgCyan: [46, 49],
            bgWhite: [47, 49],
            bgBlackBright: [100, 49],
            bgGray: [100, 49],
            bgGrey: [100, 49],
            bgRedBright: [101, 49],
            bgGreenBright: [102, 49],
            bgYellowBright: [103, 49],
            bgBlueBright: [104, 49],
            bgMagentaBright: [105, 49],
            bgCyanBright: [106, 49],
            bgWhiteBright: [107, 49]
        }
    }, Esz = Object.keys(L$.modifier), WJK = Object.keys(L$.color), GJK = Object.keys(L$.bgColor), ksz = [...WJK, ...GJK];
    fJK = ZJK(), PC = fJK
})
// @from(Ln 50155, Col 0)
function jk(A, q = globalThis.Deno ? globalThis.Deno.args : CF6.argv) {
    let K = A.startsWith("-") ? "" : A.length === 1 ? "-" : "--",
        Y = q.indexOf(K + A),
        z = q.indexOf("--");
    return Y !== -1 && (z === -1 || Y < z)
}
// @from(Ln 50162, Col 0)
function NJK() {
    if ("FORCE_COLOR" in W_) {
        if (W_.FORCE_COLOR === "true") return 1;
        if (W_.FORCE_COLOR === "false") return 0;
        return W_.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(W_.FORCE_COLOR, 10), 3)
    }
}
// @from(Ln 50170, Col 0)
function TJK(A) {
    if (A === 0) return !1;
    return {
        level: A,
        hasBasic: !0,
        has256: A >= 2,
        has16m: A >= 3
    }
}
// @from(Ln 50180, Col 0)
function vJK(A, {
    streamIsTTY: q,
    sniffFlags: K = !0
} = {}) {
    let Y = NJK();
    if (Y !== void 0) ls1 = Y;
    let z = K ? ls1 : Y;
    if (z === 0) return 0;
    if (K) {
        if (jk("color=16m") || jk("color=full") || jk("color=truecolor")) return 3;
        if (jk("color=256")) return 2
    }
    if ("TF_BUILD" in W_ && "AGENT_NAME" in W_) return 1;
    if (A && !q && z === void 0) return 0;
    let w = z || 0;
    if (W_.TERM === "dumb") return w;
    if (CF6.platform === "win32") {
        let H = VJK.release().split(".");
        if (Number(H[0]) >= 10 && Number(H[2]) >= 10586) return Number(H[2]) >= 14931 ? 3 : 2;
        return 1
    }
    if ("CI" in W_) {
        if (["GITHUB_ACTIONS", "GITEA_ACTIONS", "CIRCLECI"].some((H) => (H in W_))) return 3;
        if (["TRAVIS", "APPVEYOR", "GITLAB_CI", "BUILDKITE", "DRONE"].some((H) => (H in W_)) || W_.CI_NAME === "codeship") return 1;
        return w
    }
    if ("TEAMCITY_VERSION" in W_) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(W_.TEAMCITY_VERSION) ? 1 : 0;
    if (W_.COLORTERM === "truecolor") return 3;
    if (W_.TERM === "xterm-kitty") return 3;
    if ("TERM_PROGRAM" in W_) {
        let H = Number.parseInt((W_.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
        switch (W_.TERM_PROGRAM) {
            case "iTerm.app":
                return H >= 3 ? 3 : 2;
            case "Apple_Terminal":
                return 2
        }
    }
    if (/-256(color)?$/i.test(W_.TERM)) return 2;
    if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(W_.TERM)) return 1;
    if ("COLORTERM" in W_) return 1;
    return w
}
// @from(Ln 50224, Col 0)
function tH8(A, q = {}) {
    let K = vJK(A, {
        streamIsTTY: A && A.isTTY,
        ...q
    });
    return TJK(K)
}
// @from(Ln 50231, Col 4)
W_
// @from(Ln 50231, Col 8)
ls1
// @from(Ln 50231, Col 13)
EJK
// @from(Ln 50231, Col 18)
eH8
// @from(Ln 50232, Col 4)
A$8 = v(() => {
    ({
        env: W_
    } = CF6);
    if (jk("no-color") || jk("no-colors") || jk("color=false") || jk("color=never")) ls1 = 0;
    else if (jk("color") || jk("colors") || jk("color=true") || jk("color=always")) ls1 = 1;
    EJK = {
        stdout: tH8({
            isTTY: sH8.isatty(1)
        }),
        stderr: tH8({
            isTTY: sH8.isatty(2)
        })
    }, eH8 = EJK
})
// @from(Ln 50248, Col 0)
function q$8(A, q, K) {
    let Y = A.indexOf(q);
    if (Y === -1) return A;
    let z = q.length,
        w = 0,
        H = "";
    do H += A.slice(w, Y) + q + K, w = Y + z, Y = A.indexOf(q, w); while (Y !== -1);
    return H += A.slice(w), H
}
// @from(Ln 50258, Col 0)
function K$8(A, q, K, Y) {
    let z = 0,
        w = "";
    do {
        let H = A[Y - 1] === "\r";
        w += A.slice(z, H ? Y - 1 : Y) + q + (H ? `\r
` : `
`) + K, z = Y + 1, Y = A.indexOf(`
`, z)
    } while (Y !== -1);
    return w += A.slice(z), w
}
// @from(Ln 50270, Col 0)
class xF6 {
    constructor(A) {
        return H$8(A)
    }
}
// @from(Ln 50276, Col 0)
function gv1(A) {
    return H$8(A)
}
// @from(Ln 50279, Col 4)
Y$8
// @from(Ln 50279, Col 9)
z$8
// @from(Ln 50279, Col 14)
SF6
// @from(Ln 50279, Col 19)
_H1
// @from(Ln 50279, Col 24)
Qv1
// @from(Ln 50279, Col 29)
w$8
// @from(Ln 50279, Col 34)
JH1
// @from(Ln 50279, Col 39)
kJK = (A, q = {}) => {
        if (q.level && !(Number.isInteger(q.level) && q.level >= 0 && q.level <= 3)) throw Error("The `level` option should be an integer from 0 to 3");
        let K = Y$8 ? Y$8.level : 0;
        A.level = q.level === void 0 ? K : q.level
    }
// @from(Ln 50284, Col 4)
H$8 = (A) => {
        let q = (...K) => K.join(" ");
        return kJK(q, A), Object.setPrototypeOf(q, gv1.prototype), q
    }
// @from(Ln 50288, Col 4)
hF6 = (A, q, K, ...Y) => {
        if (A === "rgb") {
            if (q === "ansi16m") return PC[K].ansi16m(...Y);
            if (q === "ansi256") return PC[K].ansi256(PC.rgbToAnsi256(...Y));
            return PC[K].ansi(PC.rgbToAnsi(...Y))
        }
        if (A === "hex") return hF6("rgb", q, K, ...PC.hexToRgb(...Y));
        return PC[K][A](...Y)
    }
// @from(Ln 50297, Col 4)
LJK
// @from(Ln 50297, Col 9)
RJK
// @from(Ln 50297, Col 14)
IF6 = (A, q, K) => {
        let Y, z;
        if (K === void 0) Y = A, z = q;
        else Y = K.openAll + A, z = q + K.closeAll;
        return {
            open: A,
            close: q,
            openAll: Y,
            closeAll: z,
            parent: K
        }
    }
// @from(Ln 50309, Col 4)
is1 = (A, q, K) => {
        let Y = (...z) => yJK(Y, z.length === 1 ? "" + z[0] : z.join(" "));
        return Object.setPrototypeOf(Y, RJK), Y[SF6] = A, Y[_H1] = q, Y[Qv1] = K, Y
    }
// @from(Ln 50313, Col 4)
yJK = (A, q) => {
        if (A.level <= 0 || !q) return A[Qv1] ? "" : q;
        let K = A[_H1];
        if (K === void 0) return q;
        let {
            openAll: Y,
            closeAll: z
        } = K;
        if (q.includes("\x1B"))
            while (K !== void 0) q = q$8(q, K.close, K.open), K = K.parent;
        let w = q.indexOf(`
`);
        if (w !== -1) q = K$8(q, z, Y, w);
        return Y + q + z
    }
// @from(Ln 50328, Col 4)
CJK
// @from(Ln 50328, Col 9)
usz
// @from(Ln 50328, Col 14)
H6
// @from(Ln 50329, Col 4)
q3 = v(() => {
    aH8();
    A$8();
    ({
        stdout: Y$8,
        stderr: z$8
    } = eH8), SF6 = Symbol("GENERATOR"), _H1 = Symbol("STYLER"), Qv1 = Symbol("IS_EMPTY"), w$8 = ["ansi", "ansi", "ansi256", "ansi16m"], JH1 = Object.create(null);
    Object.setPrototypeOf(gv1.prototype, Function.prototype);
    for (let [A, q] of Object.entries(PC)) JH1[A] = {
        get() {
            let K = is1(this, IF6(q.open, q.close, this[_H1]), this[Qv1]);
            return Object.defineProperty(this, A, {
                value: K
            }), K
        }
    };
    JH1.visible = {
        get() {
            let A = is1(this, this[_H1], !0);
            return Object.defineProperty(this, "visible", {
                value: A
            }), A
        }
    };
    LJK = ["rgb", "hex", "ansi256"];
    for (let A of LJK) {
        JH1[A] = {
            get() {
                let {
                    level: K
                } = this;
                return function(...Y) {
                    let z = IF6(hF6(A, w$8[K], "color", ...Y), PC.color.close, this[_H1]);
                    return is1(this, z, this[Qv1])
                }
            }
        };
        let q = "bg" + A[0].toUpperCase() + A.slice(1);
        JH1[q] = {
            get() {
                let {
                    level: K
                } = this;
                return function(...Y) {
                    let z = IF6(hF6(A, w$8[K], "bgColor", ...Y), PC.bgColor.close, this[_H1]);
                    return is1(this, z, this[Qv1])
                }
            }
        }
    }
    RJK = Object.defineProperties(() => {}, {
        ...JH1,
        level: {
            enumerable: !0,
            get() {
                return this[SF6].level
            },
            set(A) {
                this[SF6].level = A
            }
        }
    });
    Object.defineProperties(gv1.prototype, JH1);
    CJK = gv1(), usz = gv1({
        level: z$8 ? z$8.level : 0
    }), H6 = CJK
})
// @from(Ln 50397, Col 0)
function $$8(A, q) {
    return {
        name: `${A.name}-with-${q.name}-fallback`,
        read() {
            let K = A.read();
            if (K !== null && K !== void 0) return K;
            return q.read() || {}
        },
        async readAsync() {
            let K = await A.readAsync();
            if (K !== null && K !== void 0) return K;
            return await q.readAsync() || {}
        },
        update(K) {
            let Y = A.read(),
                z = A.update(K);
            if (z.success) {
                if (Y === null) q.delete();
                return z
            }
            let w = q.update(K);
            if (w.success) return {
                success: !0,
                warning: w.warning
            };
            return {
                success: !1
            }
        },
        delete() {
            let K = A.delete(),
                Y = q.delete();
            return K || Y
        }
    }
}
// @from(Ln 50440, Col 0)
function xQ(A = "") {
    let q = O8(),
        Y = !process.env.CLAUDE_CONFIG_DIR ? "" : `-${SJK("sha256").update(q).digest("hex").substring(0,8)}`;
    return `Claude Code${P4().OAUTH_FILE_SUFFIX}${A}${Y}`
}
// @from(Ln 50446, Col 0)
function XH1() {
    try {
        return process.env.USER || hJK().username
    } catch {
        return "claude-code-user"
    }
}
// @from(Ln 50454, Col 0)
function Ri() {
    WC = {
        data: null,
        valid: !1
    }
}
// @from(Ln 50461, Col 0)
function _$8() {
    if (process.platform !== "darwin") return !1;
    try {
        return Aw1("security", ["show-keychain-info"], {
            reject: !1,
            stdio: ["ignore", "pipe", "pipe"]
        }).exitCode === 36
    } catch {
        return !1
    }
}
// @from(Ln 50472, Col 4)
WC
// @from(Ln 50472, Col 8)
O$8
// @from(Ln 50473, Col 4)
Uv1 = v(() => {
    Wx6();
    tq();
    hA();
    Uz();
    Bf();
    m6();
    WC = {
        data: null,
        valid: !1
    };
    O$8 = {
        name: "keychain",
        read() {
            if (WC.valid) return WC.data;
            try {
                let A = xQ("-credentials"),
                    q = XH1(),
                    K = Qf(`security find-generic-password -a "${q}" -w -s "${A}"`);
                if (K) {
                    let Y = _A(K);
                    return WC = {
                        data: Y,
                        valid: !0
                    }, Y
                }
            } catch (A) {
                return WC = {
                    data: null,
                    valid: !0
                }, null
            }
            return WC = {
                data: null,
                valid: !0
            }, null
        },
        async readAsync() {
            if (WC.valid) return WC.data;
            try {
                let A = xQ("-credentials"),
                    q = XH1(),
                    {
                        stdout: K,
                        code: Y
                    } = await IA("security", ["find-generic-password", "-a", q, "-w", "-s", A], {
                        useCwd: !1,
                        preserveOutputOnError: !1
                    });
                if (Y === 0 && K) {
                    let z = _A(K.trim());
                    return WC = {
                        data: z,
                        valid: !0
                    }, z
                }
            } catch (A) {}
            return WC = {
                data: null,
                valid: !0
            }, null
        },
        update(A) {
            Ri();
            try {
                let q = xQ("-credentials"),
                    K = XH1(),
                    Y = Q1(A),
                    z = Buffer.from(Y, "utf-8").toString("hex"),
                    w = `add-generic-password -U -a "${K}" -s "${q}" -X "${z}"
`;
                if (Aw1("security", ["-i"], {
                        input: w,
                        stdio: ["pipe", "pipe", "pipe"],
                        reject: !1
                    }).exitCode !== 0) return {
                    success: !1
                };
                return WC = {
                    data: A,
                    valid: !0
                }, {
                    success: !0
                }
            } catch (q) {
                return {
                    success: !1
                }
            }
        },
        delete() {
            Ri();
            try {
                let A = xQ("-credentials"),
                    q = XH1();
                return Qf(`security delete-generic-password -a "${q}" -s "${A}"`), !0
            } catch (A) {
                return !1
            }
        }
    }
})
// @from(Ln 50582, Col 0)
function bF6() {
    let A = O8(),
        q = ".credentials.json";
    return {
        storageDir: A,
        storagePath: IJK(A, ".credentials.json")
    }
}
// @from(Ln 50590, Col 4)
uF6
// @from(Ln 50591, Col 4)
J$8 = v(() => {
    _8();
    hA();
    m6();
    m6();
    uF6 = {
        name: "plaintext",
        read() {
            let {
                storagePath: A
            } = bF6();
            if (b1().existsSync(A)) try {
                let q = b1().readFileSync(A, {
                    encoding: "utf8"
                });
                return _A(q)
            } catch (q) {
                return null
            }
            return null
        },
        async readAsync() {
            return this.read()
        },
        update(A) {
            try {
                let {
                    storageDir: q,
                    storagePath: K
                } = bF6();
                if (!b1().existsSync(q)) b1().mkdirSync(q);
                return c8(K, Q1(A), {
                    encoding: "utf8",
                    flush: !1
                }), xJK(K, 384), {
                    success: !0,
                    warning: "Warning: Storing credentials in plaintext."
                }
            } catch (q) {
                return {
                    success: !1
                }
            }
        },
        delete() {
            let {
                storagePath: A
            } = bF6();
            if (b1().existsSync(A)) try {
                return b1().unlinkSync(A), !0
            } catch (q) {
                return !1
            }
            return !0
        }
    }
})
// @from(Ln 50649, Col 0)
function T0() {
    if (process.platform === "darwin") return $$8(O$8, uF6);
    return uF6
}
// @from(Ln 50653, Col 4)
ns1 = v(() => {
    Uv1();
    J$8()
})
// @from(Ln 50658, Col 0)
function rs1() {
    let A = FL6();
    if (A !== void 0) return A;
    let q = process.env.CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR;
    if (!q) return w61(null), null;
    let K = parseInt(q, 10);
    if (Number.isNaN(K)) return h(`CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR must be a valid file descriptor number, got: ${q}`, {
        level: "error"
    }), w61(null), null;
    try {
        let Y = b1(),
            z = process.platform === "darwin" || process.platform === "freebsd" ? `/dev/fd/${K}` : `/proc/self/fd/${K}`,
            w = Y.readFileSync(z, {
                encoding: "utf8"
            }).trim();
        if (!w) return h("File descriptor contained empty OAuth token", {
            level: "error"
        }), w61(null), null;
        return h(`Successfully read OAuth token from file descriptor ${K}`), w61(w), w
    } catch (Y) {
        return h(`Failed to read OAuth token from file descriptor ${K}: ${Y instanceof Error?Y.message:String(Y)}`, {
            level: "error"
        }), w61(null), null
    }
}
// @from(Ln 50684, Col 0)
function BF6() {
    let A = QL6();
    if (A !== void 0) return A;
    let q = process.env.CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR;
    if (!q) return H61(null), null;
    let K = parseInt(q, 10);
    if (Number.isNaN(K)) return h(`CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR must be a valid file descriptor number, got: ${q}`, {
        level: "error"
    }), H61(null), null;
    try {
        let Y = b1(),
            z = process.platform === "darwin" || process.platform === "freebsd" ? `/dev/fd/${K}` : `/proc/self/fd/${K}`,
            w = Y.readFileSync(z, {
                encoding: "utf8"
            }).trim();
        if (!w) return h("File descriptor contained empty API key", {
            level: "error"
        }), H61(null), null;
        return h(`Successfully read API key from file descriptor ${K}`), H61(w), w
    } catch (Y) {
        return h(`Failed to read API key from file descriptor ${K}: ${Y instanceof Error?Y.message:String(Y)}`, {
            level: "error"
        }), H61(null), null
    }
}
// @from(Ln 50709, Col 4)
X$8 = v(() => {
    Z6();
    _8();
    B6()
})
// @from(Ln 50714, Col 0)
async function os1() {
    let q = f6().oauthAccount?.accountUuid,
        K = Mk();
    if (!q || !K) return;
    let Y = `${P4().BASE_API_URL}/api/claude_cli_profile`;
    try {
        return (await sA.get(Y, {
            headers: {
                "x-api-key": K,
                "anthropic-beta": uf
            },
            params: {
                account_uuid: q
            }
        })).data
    } catch (z) {
        K1(z)
    }
}
// @from(Ln 50733, Col 0)
async function DH1(A) {
    let q = `${P4().BASE_API_URL}/api/oauth/profile`;
    try {
        return (await sA.get(q, {
            headers: {
                Authorization: `Bearer ${A}`,
                "Content-Type": "application/json"
            }
        })).data
    } catch (K) {
        K1(K)
    }
}
// @from(Ln 50746, Col 4)
pv1 = v(() => {
    y5();
    Uz();
    J7();
    cA();
    y6()
})
// @from(Ln 50754, Col 0)
function bQ(A) {
    return Boolean(A?.includes(Fx))
}
// @from(Ln 50758, Col 0)
function as1(A) {
    return A?.split(" ").filter(Boolean) ?? []
}
// @from(Ln 50762, Col 0)
function mF6({
    codeChallenge: A,
    state: q,
    port: K,
    isManual: Y,
    loginWithClaudeAi: z,
    inferenceOnly: w,
    orgUUID: H
}) {
    let $ = z ? P4().CLAUDE_AI_AUTHORIZE_URL : P4().CONSOLE_AUTHORIZE_URL,
        O = new URL($);
    O.searchParams.append("code", "true"), O.searchParams.append("client_id", P4().CLIENT_ID), O.searchParams.append("response_type", "code"), O.searchParams.append("redirect_uri", Y ? P4().MANUAL_REDIRECT_URL : `http://localhost:${K}/callback`);
    let _ = w ? [Fx] : H48;
    if (O.searchParams.append("scope", _.join(" ")), O.searchParams.append("code_challenge", A), O.searchParams.append("code_challenge_method", "S256"), O.searchParams.append("state", q), H) O.searchParams.append("orgUUID", H);
    return O.toString()
}
// @from(Ln 50778, Col 0)
async function D$8(A, q, K, Y, z = !1, w) {
    let H = {
        grant_type: "authorization_code",
        code: A,
        redirect_uri: z ? P4().MANUAL_REDIRECT_URL : `http://localhost:${Y}/callback`,
        client_id: P4().CLIENT_ID,
        code_verifier: K,
        state: q
    };
    if (w !== void 0) H.expires_in = w;
    let $ = await sA.post(P4().TOKEN_URL, H, {
        headers: {
            "Content-Type": "application/json"
        }
    });
    if ($.status !== 200) throw Error($.status === 401 ? "Authentication failed: Invalid authorization code" : `Token exchange failed (${$.status}): ${$.statusText}`);
    return c("tengu_oauth_token_exchange_success", {}), $.data
}
// @from(Ln 50796, Col 0)
async function j$8(A) {
    let q = {
        grant_type: "refresh_token",
        refresh_token: A,
        client_id: P4().CLIENT_ID,
        scope: QS6.join(" ")
    };
    try {
        let K = await sA.post(P4().TOKEN_URL, q, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (K.status !== 200) throw Error(`Token refresh failed: ${K.statusText}`);
        let Y = K.data,
            {
                access_token: z,
                refresh_token: w = A,
                expires_in: H
            } = Y,
            $ = Date.now() + H * 1000,
            O = as1(Y.scope);
        c("tengu_oauth_token_refresh_success", {});
        let _ = await FF6(z);
        if (f6().oauthAccount) {
            let X = {};
            if (_.displayName !== void 0) X.displayName = _.displayName;
            if (typeof _.hasExtraUsageEnabled === "boolean") X.hasExtraUsageEnabled = _.hasExtraUsageEnabled;
            if (_.billingType !== null) X.billingType = _.billingType;
            if (_.accountCreatedAt !== void 0) X.accountCreatedAt = _.accountCreatedAt;
            if (_.subscriptionCreatedAt !== void 0) X.subscriptionCreatedAt = _.subscriptionCreatedAt;
            if (Object.keys(X).length > 0) jA((D) => ({
                ...D,
                oauthAccount: D.oauthAccount ? {
                    ...D.oauthAccount,
                    ...X
                } : D.oauthAccount
            }))
        }
        return {
            accessToken: z,
            refreshToken: w,
            expiresAt: $,
            scopes: O,
            subscriptionType: _.subscriptionType,
            rateLimitTier: _.rateLimitTier
        }
    } catch (K) {
        throw c("tengu_oauth_token_refresh_failure", {
            error: K.message
        }), K
    }
}
// @from(Ln 50849, Col 0)
async function M$8(A) {
    let q = await sA.get(P4().ROLES_URL, {
        headers: {
            Authorization: `Bearer ${A}`
        }
    });
    if (q.status !== 200) throw Error(`Failed to fetch user roles: ${q.statusText}`);
    let K = q.data;
    if (!f6().oauthAccount) throw Error("OAuth account information not found in config");
    jA((z) => ({
        ...z,
        oauthAccount: z.oauthAccount ? {
            ...z.oauthAccount,
            organizationRole: K.organization_role,
            workspaceRole: K.workspace_role,
            organizationName: K.organization_name
        } : z.oauthAccount
    })), c("tengu_oauth_roles_stored", {
        org_role: K.organization_role
    })
}
// @from(Ln 50870, Col 0)
async function P$8(A) {
    try {
        let q = await sA.post(P4().API_KEY_URL, null, {
                headers: {
                    Authorization: `Bearer ${A}`
                }
            }),
            K = q.data?.raw_key;
        if (K) return await G$8(K), c("tengu_oauth_api_key", {
            status: "success",
            statusCode: q.status
        }), K;
        return null
    } catch (q) {
        throw c("tengu_oauth_api_key", {
            status: "failure",
            error: q instanceof Error ? q.message : String(q)
        }), q
    }
}
// @from(Ln 50891, Col 0)
function uQ(A) {
    if (A === null) return !1;
    let q = 300000;
    return Date.now() + q >= A
}
// @from(Ln 50896, Col 0)
async function FF6(A) {
    let q = await DH1(A),
        K = q?.organization?.organization_type,
        Y = null;
    switch (K) {
        case "claude_max":
            Y = "max";
            break;
        case "claude_pro":
            Y = "pro";
            break;
        case "claude_enterprise":
            Y = "enterprise";
            break;
        case "claude_team":
            Y = "team";
            break;
        default:
            Y = null;
            break
    }
    let z = {
        subscriptionType: Y,
        rateLimitTier: q?.organization?.rate_limit_tier ?? null,
        hasExtraUsageEnabled: q?.organization?.has_extra_usage_enabled ?? null,
        billingType: q?.organization?.billing_type ?? null
    };
    if (q?.account?.display_name) z.displayName = q.account.display_name;
    if (q?.account?.created_at) z.accountCreatedAt = q.account.created_at;
    if (q?.organization?.subscription_created_at) z.subscriptionCreatedAt = q.organization.subscription_created_at;
    return c("tengu_oauth_profile_fetch_success", {}), z
}
// @from(Ln 50928, Col 0)
async function Kb() {
    let q = f6().oauthAccount?.organizationUuid;
    if (q) return q;
    let K = a4()?.accessToken;
    if (K === void 0) return null;
    let z = (await DH1(K))?.organization?.uuid;
    if (!z) return null;
    return z
}
// @from(Ln 50937, Col 0)
async function W$8() {
    let A = f6();
    if (A.oauthAccount && A.oauthAccount.billingType !== void 0 && A.oauthAccount.accountCreatedAt !== void 0 && A.oauthAccount.subscriptionCreatedAt !== void 0 || !i8()) return !1;
    let q = a4();
    if (q?.accessToken) {
        let K = await DH1(q.accessToken);
        if (K) return QF6({
            accountUuid: K.account.uuid,
            emailAddress: K.account.email,
            organizationUuid: K.organization.uuid,
            displayName: K.account.display_name || void 0,
            hasExtraUsageEnabled: K.organization.has_extra_usage_enabled ?? !1,
            billingType: K.organization.billing_type ?? void 0,
            accountCreatedAt: K.account.created_at,
            subscriptionCreatedAt: K.organization.subscription_created_at ?? void 0
        }), !0
    }
    return !1
}
// @from(Ln 50957, Col 0)
function QF6({
    accountUuid: A,
    emailAddress: q,
    organizationUuid: K,
    displayName: Y,
    hasExtraUsageEnabled: z,
    billingType: w,
    accountCreatedAt: H,
    subscriptionCreatedAt: $
}) {
    let O = {
        accountUuid: A,
        emailAddress: q,
        organizationUuid: K,
        hasExtraUsageEnabled: z,
        billingType: w,
        accountCreatedAt: H,
        subscriptionCreatedAt: $
    };
    if (Y) O.displayName = Y;
    jA((_) => {
        if (_.oauthAccount?.accountUuid === O.accountUuid && _.oauthAccount?.emailAddress === O.emailAddress && _.oauthAccount?.organizationUuid === O.organizationUuid && _.oauthAccount?.displayName === O.displayName && _.oauthAccount?.hasExtraUsageEnabled === O.hasExtraUsageEnabled && _.oauthAccount?.billingType === O.billingType && _.oauthAccount?.accountCreatedAt === O.accountCreatedAt && _.oauthAccount?.subscriptionCreatedAt === O.subscriptionCreatedAt) return _;
        return {
            ..._,
            oauthAccount: O
        }
    })
}
// @from(Ln 50985, Col 4)
Pk = v(() => {
    y5();
    Uz();
    u6();
    cA();
    J7();
    pv1()
})
// @from(Ln 50994, Col 0)
function f$8() {
    return null
}
// @from(Ln 50998, Col 0)
function V$8(A) {
    let q = f$8();
    if (!q) return A;
    let K = new globalThis.Headers(A);
    return Object.entries(q).forEach(([Y, z]) => {
        if (z !== void 0) K.set(Y, z)
    }), K
}
// @from(Ln 51007, Col 0)
function jH1() {
    return ss1 && !1
}
// @from(Ln 51011, Col 0)
function N$8() {
    return null
}
// @from(Ln 51015, Col 0)
function T$8() {
    return ss1 && Z$8 !== null && !1
}
// @from(Ln 51018, Col 4)
uJK
// @from(Ln 51018, Col 9)
ss1 = !1
// @from(Ln 51019, Col 4)
Z$8 = null
// @from(Ln 51020, Col 4)
BJK = "max"
// @from(Ln 51021, Col 4)
gF6 = v(() => {
    cA();
    uJK = {}
})
// @from(Ln 51026, Col 0)
function mJK(A) {
    let q = [],
        K = [];
    for (let Y of A)
        if (v$8.includes(Y)) q.push(Y);
        else K.push(Y);
    return {
        allowed: q,
        disallowed: K
    }
}
// @from(Ln 51038, Col 0)
function E$8(A) {
    if (!A || A.length === 0) return;
    if (i8()) {
        console.warn("Warning: Custom betas are only available for API key users. Ignoring provided betas.");
        return
    }
    let {
        allowed: q,
        disallowed: K
    } = mJK(A);
    for (let Y of K) console.warn(`Warning: Beta header '${Y}' is not allowed. Only the following betas are supported: ${v$8.join(", ")}`);
    return q.length > 0 ? q : void 0
}
// @from(Ln 51052, Col 0)
function FJK(A) {
    let q = E4();
    if (q === "foundry") return !0;
    if (q === "firstParty") return !A.includes("claude-3-");
    return A.includes("claude-opus-4") || A.includes("claude-sonnet-4")
}
// @from(Ln 51059, Col 0)
function QJK(A) {
    let q = A.toLowerCase();
    return q.includes("claude-opus-4") || q.includes("claude-sonnet-4") || q.includes("claude-haiku-4")
}
// @from(Ln 51064, Col 0)
function gJK(A) {
    let q = E4();
    if (q === "foundry") return !0;
    if (q === "firstParty") return !A.includes("claude-3-");
    return A.includes("claude-opus-4") || A.includes("claude-sonnet-4") || A.includes("claude-haiku-4")
}
// @from(Ln 51071, Col 0)
function UF6(A) {
    let q = E4();
    if (q !== "firstParty" && q !== "foundry") return !1;
    return A.includes("claude-sonnet-4-5") || A.includes("claude-opus-4-1") || A.includes("claude-opus-4-5") || A.includes("claude-opus-4-6") || A.includes("claude-haiku-4-5")
}
// @from(Ln 51077, Col 0)
function k$8() {
    let A = E4();
    if (A === "vertex" || A === "bedrock") return ucA;
    return bcA
}
// @from(Ln 51083, Col 0)
function ts1() {
    return (E4() === "firstParty" || E4() === "foundry") && !J6(process.env.CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS)
}
// @from(Ln 51087, Col 0)
function es1(A) {
    let q = vT(A),
        K = FP();
    if (!K || K.length === 0) return q;
    return [...q, ...K.filter((Y) => !q.includes(Y))]
}
// @from(Ln 51094, Col 0)
function At1() {
    pF6.cache?.clear?.(), vT.cache?.clear?.(), dF6.cache?.clear?.()
}
// @from(Ln 51097, Col 4)
v$8
// @from(Ln 51097, Col 9)
pF6
// @from(Ln 51097, Col 14)
vT
// @from(Ln 51097, Col 18)
dF6
// @from(Ln 51098, Col 4)
Wk = v(() => {
    zq();
    B6();
    e11();
    U4();
    Uz();
    J7();
    hA();
    UH();
    U4();
    v$8 = [sV1];
    pF6 = KA((A) => {
        let q = [],
            K = A.includes("haiku"),
            Y = E4(),
            z = ts1();
        if (!K) q.push(xcA);
        if (i8()) q.push(uf);
        if (A.includes("[1m]")) q.push(sV1);
        if (!J6(process.env.DISABLE_INTERLEAVED_THINKING) && FJK(A)) q.push(Hn1);
        let w = J6(process.env.USE_API_CONTEXT_MANAGEMENT) && !1,
            H = gJK(A) && x8("tengu_marble_anvil", !1);
        if (ts1() && (w || H)) q.push($n1);
        let $ = i2("tengu_tool_pear");
        if (UF6(A) && $) q.push(hl);
        if (z && x8("tengu_scarf_coffee", !1)) q.push(On1);
        if (Y === "vertex" && QJK(A)) q.push(wL6);
        if (Y === "foundry") q.push(wL6);
        if (z) q.push(tV1);
        if (process.env.ANTHROPIC_BETAS && !K) q.push(...process.env.ANTHROPIC_BETAS.split(",").map((O) => O.trim()).filter(Boolean));
        return q
    }), vT = KA((A) => {
        let q = pF6(A);
        if (E4() === "bedrock") return q.filter((K) => !OL6.has(K));
        return q
    }), dF6 = KA((A) => {
        return pF6(A).filter((K) => OL6.has(K))
    })
})
// @from(Ln 51137, Col 4)
L$8 = R((iJK) => {
    iJK.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(iJK.HttpAuthLocation || (iJK.HttpAuthLocation = {}));
    iJK.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(iJK.HttpApiKeyAuthLocation || (iJK.HttpApiKeyAuthLocation = {}));
    iJK.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(iJK.EndpointURLScheme || (iJK.EndpointURLScheme = {}));
    iJK.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(iJK.AlgorithmId || (iJK.AlgorithmId = {}));
    var UJK = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => iJK.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => iJK.AlgorithmId.MD5,
                checksumConstructor: () => A.md5
            });
            return {
                addChecksumAlgorithm(K) {
                    q.push(K)
                },
                checksumAlgorithms() {
                    return q
                }
            }
        },
        pJK = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        dJK = (A) => {
            return UJK(A)
        },
        cJK = (A) => {
            return pJK(A)
        };
    iJK.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(iJK.FieldPosition || (iJK.FieldPosition = {}));
    var lJK = "__smithy_context";
    iJK.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(iJK.IniSectionType || (iJK.IniSectionType = {}));
    iJK.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(iJK.RequestHandlerProtocol || (iJK.RequestHandlerProtocol = {}));
    iJK.SMITHY_CONTEXT_KEY = lJK;
    iJK.getDefaultClientConfiguration = dJK;
    iJK.resolveDefaultRuntimeConfig = cJK
})
// @from(Ln 51202, Col 4)
S$8 = R((qXK) => {
    var aJK = L$8(),
        sJK = (A) => {
            return {
                setHttpHandler(q) {
                    A.httpHandler = q
                },
                httpHandler() {
                    return A.httpHandler
                },
                updateHttpClientConfig(q, K) {
                    A.httpHandler?.updateHttpClientConfig(q, K)
                },
                httpHandlerConfigs() {
                    return A.httpHandler.httpHandlerConfigs()
                }
            }
        },
        tJK = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class R$8 {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = aJK.FieldPosition.HEADER,
            values: K = []
        }) {
            this.name = A, this.kind = q, this.values = K
        }
        add(A) {
            this.values.push(A)
        }
        set(A) {
            this.values = A
        }
        remove(A) {
            this.values = this.values.filter((q) => q !== A)
        }
        toString() {
            return this.values.map((A) => A.includes(",") || A.includes(" ") ? `"${A}"` : A).join(", ")
        }
        get() {
            return this.values
        }
    }
    class y$8 {
        entries = {};
        encoding;
        constructor({
            fields: A = [],
            encoding: q = "utf-8"
        }) {
            A.forEach(this.setField.bind(this)), this.encoding = q
        }
        setField(A) {
            this.entries[A.name.toLowerCase()] = A
        }
        getField(A) {
            return this.entries[A.toLowerCase()]
        }
        removeField(A) {
            delete this.entries[A.toLowerCase()]
        }
        getByType(A) {
            return Object.values(this.entries).filter((q) => q.kind === A)
        }
    }
    class qt1 {
        method;
        protocol;
        hostname;
        port;
        path;
        query;
        headers;
        username;
        password;
        fragment;
        body;
        constructor(A) {
            this.method = A.method || "GET", this.hostname = A.hostname || "localhost", this.port = A.port, this.query = A.query || {}, this.headers = A.headers || {}, this.body = A.body, this.protocol = A.protocol ? A.protocol.slice(-1) !== ":" ? `${A.protocol}:` : A.protocol : "https:", this.path = A.path ? A.path.charAt(0) !== "/" ? `/${A.path}` : A.path : "/", this.username = A.username, this.password = A.password, this.fragment = A.fragment
        }
        static clone(A) {
            let q = new qt1({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = eJK(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return qt1.clone(this)
        }
    }

    function eJK(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class C$8 {
        statusCode;
        reason;
        headers;
        body;
        constructor(A) {
            this.statusCode = A.statusCode, this.reason = A.reason, this.headers = A.headers || {}, this.body = A.body
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return typeof q.statusCode === "number" && typeof q.headers === "object"
        }
    }

    function AXK(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    qXK.Field = R$8;
    qXK.Fields = y$8;
    qXK.HttpRequest = qt1;
    qXK.HttpResponse = C$8;
    qXK.getHttpHandlerExtensionConfiguration = sJK;
    qXK.isValidHostname = AXK;
    qXK.resolveHttpHandlerRuntimeConfig = tJK
})
// @from(Ln 51344, Col 4)
BQ = R((DXK) => {
    var _XK = S$8();

    function JXK(A) {
        return A
    }
    var h$8 = (A) => (q) => async (K) => {
        if (!_XK.HttpRequest.isInstance(K.request)) return q(K);
        let {
            request: Y
        } = K, {
            handlerProtocol: z = ""
        } = A.requestHandler.metadata || {};
        if (z.indexOf("h2") >= 0 && !Y.headers[":authority"]) delete Y.headers.host, Y.headers[":authority"] = Y.hostname + (Y.port ? ":" + Y.port : "");
        else if (!Y.headers.host) {
            let w = Y.hostname;
            if (Y.port != null) w += `:${Y.port}`;
            Y.headers.host = w
        }
        return q(K)
    }, I$8 = {
        name: "hostHeaderMiddleware",
        step: "build",
        priority: "low",
        tags: ["HOST"],
        override: !0
    }, XXK = (A) => ({
        applyToStack: (q) => {
            q.add(h$8(A), I$8)
        }
    });
    DXK.getHostHeaderPlugin = XXK;
    DXK.hostHeaderMiddleware = h$8;
    DXK.hostHeaderMiddlewareOptions = I$8;
    DXK.resolveHostHeaderConfig = JXK
})
// @from(Ln 51380, Col 4)
mQ = R((ZXK) => {
    var x$8 = () => (A, q) => async (K) => {
        try {
            let Y = await A(K),
                {
                    clientName: z,
                    commandName: w,
                    logger: H,
                    dynamoDbDocumentClientOptions: $ = {}
                } = q,
                {
                    overrideInputFilterSensitiveLog: O,
                    overrideOutputFilterSensitiveLog: _
                } = $,
                J = O ?? q.inputFilterSensitiveLog,
                X = _ ?? q.outputFilterSensitiveLog,
                {
                    $metadata: D,
                    ...j
                } = Y.output;
            return H?.info?.({
                clientName: z,
                commandName: w,
                input: J(K.input),
                output: X(j),
                metadata: D
            }), Y
        } catch (Y) {
            let {
                clientName: z,
                commandName: w,
                logger: H,
                dynamoDbDocumentClientOptions: $ = {}
            } = q, {
                overrideInputFilterSensitiveLog: O
            } = $, _ = O ?? q.inputFilterSensitiveLog;
            throw H?.error?.({
                clientName: z,
                commandName: w,
                input: _(K.input),
                error: Y,
                metadata: Y.$metadata
            }), Y
        }
    }, b$8 = {
        name: "loggerMiddleware",
        tags: ["LOGGER"],
        step: "initialize",
        override: !0
    }, GXK = (A) => ({
        applyToStack: (q) => {
            q.add(x$8(), b$8)
        }
    });
    ZXK.getLoggerPlugin = GXK;
    ZXK.loggerMiddleware = x$8;
    ZXK.loggerMiddlewareOptions = b$8
})
// @from(Ln 51438, Col 4)
B$8 = R((TXK) => {
    var cv1 = {
            REQUEST_ID: Symbol.for("_AWS_LAMBDA_REQUEST_ID"),
            X_RAY_TRACE_ID: Symbol.for("_AWS_LAMBDA_X_RAY_TRACE_ID"),
            TENANT_ID: Symbol.for("_AWS_LAMBDA_TENANT_ID")
        },
        aF6 = ["true", "1"].includes(process.env?.AWS_LAMBDA_NODEJS_NO_GLOBAL_AWSLAMBDA ?? "");
    if (!aF6) globalThis.awslambda = globalThis.awslambda || {};
    class Kt1 {
        static PROTECTED_KEYS = cv1;
        isProtectedKey(A) {
            return Object.values(cv1).includes(A)
        }
        getRequestId() {
            return this.get(cv1.REQUEST_ID) ?? "-"
        }
        getXRayTraceId() {
            return this.get(cv1.X_RAY_TRACE_ID)
        }
        getTenantId() {
            return this.get(cv1.TENANT_ID)
        }
    }
    class u$8 extends Kt1 {
        currentContext;
        getContext() {
            return this.currentContext
        }
        hasContext() {
            return this.currentContext !== void 0
        }
        get(A) {
            return this.currentContext?.[A]
        }
        set(A, q) {
            if (this.isProtectedKey(A)) throw Error(`Cannot modify protected Lambda context field: ${String(A)}`);
            this.currentContext = this.currentContext || {}, this.currentContext[A] = q
        }
        run(A, q) {
            this.currentContext = A;
            try {
                return q()
            } finally {
                this.currentContext = void 0
            }
        }
    }
    class tF6 extends Kt1 {
        als;
        static async create() {
            let A = new tF6,
                q = await import("node:async_hooks");
            return A.als = new q.AsyncLocalStorage, A
        }
        getContext() {
            return this.als.getStore()
        }
        hasContext() {
            return this.als.getStore() !== void 0
        }
        get(A) {
            return this.als.getStore()?.[A]
        }
        set(A, q) {
            if (this.isProtectedKey(A)) throw Error(`Cannot modify protected Lambda context field: ${String(A)}`);
            let K = this.als.getStore();
            if (!K) throw Error("No context available");
            K[A] = q
        }
        run(A, q) {
            return this.als.run(A, q)
        }
    }
    TXK.InvokeStore = void 0;
    (function(A) {
        let q = null;
        async function K() {
            if (!q) q = (async () => {
                let z = "AWS_LAMBDA_MAX_CONCURRENCY" in process.env ? await tF6.create() : new u$8;
                if (!aF6 && globalThis.awslambda?.InvokeStore) return globalThis.awslambda.InvokeStore;
                else if (!aF6 && globalThis.awslambda) return globalThis.awslambda.InvokeStore = z, z;
                else return z
            })();
            return q
        }
        A.getInstanceAsync = K, A._testing = process.env.AWS_LAMBDA_BENCHMARK_MODE === "1" ? {
            reset: () => {
                if (q = null, globalThis.awslambda?.InvokeStore) delete globalThis.awslambda.InvokeStore;
                globalThis.awslambda = {}
            }
        } : void 0
    })(TXK.InvokeStore || (TXK.InvokeStore = {}));
    TXK.InvokeStoreBase = Kt1
})
// @from(Ln 51532, Col 4)
m$8 = R((CXK) => {
    CXK.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(CXK.HttpAuthLocation || (CXK.HttpAuthLocation = {}));
    CXK.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(CXK.HttpApiKeyAuthLocation || (CXK.HttpApiKeyAuthLocation = {}));
    CXK.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(CXK.EndpointURLScheme || (CXK.EndpointURLScheme = {}));
    CXK.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(CXK.AlgorithmId || (CXK.AlgorithmId = {}));
    var EXK = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => CXK.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => CXK.AlgorithmId.MD5,
                checksumConstructor: () => A.md5
            });
            return {
                addChecksumAlgorithm(K) {
                    q.push(K)
                },
                checksumAlgorithms() {
                    return q
                }
            }
        },
        kXK = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        LXK = (A) => {
            return EXK(A)
        },
        RXK = (A) => {
            return kXK(A)
        };
    CXK.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(CXK.FieldPosition || (CXK.FieldPosition = {}));
    var yXK = "__smithy_context";
    CXK.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(CXK.IniSectionType || (CXK.IniSectionType = {}));
    CXK.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(CXK.RequestHandlerProtocol || (CXK.RequestHandlerProtocol = {}));
    CXK.SMITHY_CONTEXT_KEY = yXK;
    CXK.getDefaultClientConfiguration = LXK;
    CXK.resolveDefaultRuntimeConfig = RXK
})
// @from(Ln 51597, Col 4)
U$8 = R((FXK) => {
    var xXK = m$8(),
        bXK = (A) => {
            return {
                setHttpHandler(q) {
                    A.httpHandler = q
                },
                httpHandler() {
                    return A.httpHandler
                },
                updateHttpClientConfig(q, K) {
                    A.httpHandler?.updateHttpClientConfig(q, K)
                },
                httpHandlerConfigs() {
                    return A.httpHandler.httpHandlerConfigs()
                }
            }
        },
        uXK = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class F$8 {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = xXK.FieldPosition.HEADER,
            values: K = []
        }) {
            this.name = A, this.kind = q, this.values = K
        }
        add(A) {
            this.values.push(A)
        }
        set(A) {
            this.values = A
        }
        remove(A) {
            this.values = this.values.filter((q) => q !== A)
        }
        toString() {
            return this.values.map((A) => A.includes(",") || A.includes(" ") ? `"${A}"` : A).join(", ")
        }
        get() {
            return this.values
        }
    }
    class Q$8 {
        entries = {};
        encoding;
        constructor({
            fields: A = [],
            encoding: q = "utf-8"
        }) {
            A.forEach(this.setField.bind(this)), this.encoding = q
        }
        setField(A) {
            this.entries[A.name.toLowerCase()] = A
        }
        getField(A) {
            return this.entries[A.toLowerCase()]
        }
        removeField(A) {
            delete this.entries[A.toLowerCase()]
        }
        getByType(A) {
            return Object.values(this.entries).filter((q) => q.kind === A)
        }
    }
    class Yt1 {
        method;
        protocol;
        hostname;
        port;
        path;
        query;
        headers;
        username;
        password;
        fragment;
        body;
        constructor(A) {
            this.method = A.method || "GET", this.hostname = A.hostname || "localhost", this.port = A.port, this.query = A.query || {}, this.headers = A.headers || {}, this.body = A.body, this.protocol = A.protocol ? A.protocol.slice(-1) !== ":" ? `${A.protocol}:` : A.protocol : "https:", this.path = A.path ? A.path.charAt(0) !== "/" ? `/${A.path}` : A.path : "/", this.username = A.username, this.password = A.password, this.fragment = A.fragment
        }
        static clone(A) {
            let q = new Yt1({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = BXK(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return Yt1.clone(this)
        }
    }

    function BXK(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class g$8 {
        statusCode;
        reason;
        headers;
        body;
        constructor(A) {
            this.statusCode = A.statusCode, this.reason = A.reason, this.headers = A.headers || {}, this.body = A.body
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return typeof q.statusCode === "number" && typeof q.headers === "object"
        }
    }

    function mXK(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    FXK.Field = F$8;
    FXK.Fields = Q$8;
    FXK.HttpRequest = Yt1;
    FXK.HttpResponse = g$8;
    FXK.getHttpHandlerExtensionConfiguration = bXK;
    FXK.isValidHostname = mXK;
    FXK.resolveHttpHandlerRuntimeConfig = uXK
})
// @from(Ln 51739, Col 4)
c$8 = R((p$8) => {
    Object.defineProperty(p$8, "__esModule", {
        value: !0
    });
    p$8.recursionDetectionMiddleware = void 0;
    var iXK = B$8(),
        nXK = U$8(),
        wQ6 = "X-Amzn-Trace-Id",
        rXK = "AWS_LAMBDA_FUNCTION_NAME",
        oXK = "_X_AMZN_TRACE_ID",
        aXK = () => (A) => async (q) => {
            let {
                request: K
            } = q;
            if (!nXK.HttpRequest.isInstance(K)) return A(q);
            let Y = Object.keys(K.headers ?? {}).find((J) => J.toLowerCase() === wQ6.toLowerCase()) ?? wQ6;
            if (K.headers.hasOwnProperty(Y)) return A(q);
            let z = process.env[rXK],
                w = process.env[oXK],
                O = (await iXK.InvokeStore.getInstanceAsync())?.getXRayTraceId() ?? w,
                _ = (J) => typeof J === "string" && J.length > 0;
            if (_(z) && _(O)) K.headers[wQ6] = O;
            return A({
                ...q,
                request: K
            })
        };
    p$8.recursionDetectionMiddleware = aXK
})
// @from(Ln 51768, Col 4)
FQ = R(($Q6) => {
    var HQ6 = c$8(),
        sXK = {
            step: "build",
            tags: ["RECURSION_DETECTION"],
            name: "recursionDetectionMiddleware",
            override: !0,
            priority: "low"
        },
        tXK = (A) => ({
            applyToStack: (q) => {
                q.add(HQ6.recursionDetectionMiddleware(), sXK)
            }
        });
    $Q6.getRecursionDetectionPlugin = tXK;
    Object.keys(HQ6).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call($Q6, A)) Object.defineProperty($Q6, A, {
            enumerable: !0,
            get: function() {
                return HQ6[A]
            }
        })
    })
})
// @from(Ln 51792, Col 4)
MQ6 = R((wDK) => {
    wDK.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(wDK.HttpAuthLocation || (wDK.HttpAuthLocation = {}));
    wDK.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(wDK.HttpApiKeyAuthLocation || (wDK.HttpApiKeyAuthLocation = {}));
    wDK.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(wDK.EndpointURLScheme || (wDK.EndpointURLScheme = {}));
    wDK.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(wDK.AlgorithmId || (wDK.AlgorithmId = {}));
    var ADK = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => wDK.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => wDK.AlgorithmId.MD5,
                checksumConstructor: () => A.md5
            });
            return {
                addChecksumAlgorithm(K) {
                    q.push(K)
                },
                checksumAlgorithms() {
                    return q
                }
            }
        },
        qDK = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        KDK = (A) => {
            return ADK(A)
        },
        YDK = (A) => {
            return qDK(A)
        };
    wDK.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(wDK.FieldPosition || (wDK.FieldPosition = {}));
    var zDK = "__smithy_context";
    wDK.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(wDK.IniSectionType || (wDK.IniSectionType = {}));
    wDK.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(wDK.RequestHandlerProtocol || (wDK.RequestHandlerProtocol = {}));
    wDK.SMITHY_CONTEXT_KEY = zDK;
    wDK.getDefaultClientConfiguration = KDK;
    wDK.resolveDefaultRuntimeConfig = YDK
})
// @from(Ln 51857, Col 4)
l$8 = R((MDK) => {
    MDK.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(MDK.HttpAuthLocation || (MDK.HttpAuthLocation = {}));
    MDK.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(MDK.HttpApiKeyAuthLocation || (MDK.HttpApiKeyAuthLocation = {}));
    MDK.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(MDK.EndpointURLScheme || (MDK.EndpointURLScheme = {}));
    MDK.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(MDK.AlgorithmId || (MDK.AlgorithmId = {}));
    var _DK = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => MDK.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => MDK.AlgorithmId.MD5,
                checksumConstructor: () => A.md5
            });
            return {
                addChecksumAlgorithm(K) {
                    q.push(K)
                },
                checksumAlgorithms() {
                    return q
                }
            }
        },
        JDK = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        XDK = (A) => {
            return _DK(A)
        },
        DDK = (A) => {
            return JDK(A)
        };
    MDK.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(MDK.FieldPosition || (MDK.FieldPosition = {}));
    var jDK = "__smithy_context";
    MDK.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(MDK.IniSectionType || (MDK.IniSectionType = {}));
    MDK.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(MDK.RequestHandlerProtocol || (MDK.RequestHandlerProtocol = {}));
    MDK.SMITHY_CONTEXT_KEY = jDK;
    MDK.getDefaultClientConfiguration = XDK;
    MDK.resolveDefaultRuntimeConfig = DDK
})
// @from(Ln 51922, Col 4)
iP = R((VDK) => {
    var i$8 = l$8(),
        ZDK = (A) => A[i$8.SMITHY_CONTEXT_KEY] || (A[i$8.SMITHY_CONTEXT_KEY] = {}),
        fDK = (A) => {
            if (typeof A === "function") return A;
            let q = Promise.resolve(A);
            return () => q
        };
    VDK.getSmithyContext = ZDK;
    VDK.normalizeProvider = fDK
})
// @from(Ln 51933, Col 4)
n$8 = R((yDK) => {
    yDK.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(yDK.HttpAuthLocation || (yDK.HttpAuthLocation = {}));
    yDK.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(yDK.HttpApiKeyAuthLocation || (yDK.HttpApiKeyAuthLocation = {}));
    yDK.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(yDK.EndpointURLScheme || (yDK.EndpointURLScheme = {}));
    yDK.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(yDK.AlgorithmId || (yDK.AlgorithmId = {}));
    var vDK = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => yDK.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => yDK.AlgorithmId.MD5,
                checksumConstructor: () => A.md5
            });
            return {
                addChecksumAlgorithm(K) {
                    q.push(K)
                },
                checksumAlgorithms() {
                    return q
                }
            }
        },
        EDK = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        kDK = (A) => {
            return vDK(A)
        },
        LDK = (A) => {
            return EDK(A)
        };
    yDK.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(yDK.FieldPosition || (yDK.FieldPosition = {}));
    var RDK = "__smithy_context";
    yDK.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(yDK.IniSectionType || (yDK.IniSectionType = {}));
    yDK.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(yDK.RequestHandlerProtocol || (yDK.RequestHandlerProtocol = {}));
    yDK.SMITHY_CONTEXT_KEY = RDK;
    yDK.getDefaultClientConfiguration = kDK;
    yDK.resolveDefaultRuntimeConfig = LDK
})
// @from(Ln 51998, Col 4)
s$8 = R((mDK) => {
    var IDK = n$8(),
        xDK = (A) => {
            return {
                setHttpHandler(q) {
                    A.httpHandler = q
                },
                httpHandler() {
                    return A.httpHandler
                },
                updateHttpClientConfig(q, K) {
                    A.httpHandler?.updateHttpClientConfig(q, K)
                },
                httpHandlerConfigs() {
                    return A.httpHandler.httpHandlerConfigs()
                }
            }
        },
        bDK = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class r$8 {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = IDK.FieldPosition.HEADER,
            values: K = []
        }) {
            this.name = A, this.kind = q, this.values = K
        }
        add(A) {
            this.values.push(A)
        }
        set(A) {
            this.values = A
        }
        remove(A) {
            this.values = this.values.filter((q) => q !== A)
        }
        toString() {
            return this.values.map((A) => A.includes(",") || A.includes(" ") ? `"${A}"` : A).join(", ")
        }
        get() {
            return this.values
        }
    }
    class o$8 {
        entries = {};
        encoding;
        constructor({
            fields: A = [],
            encoding: q = "utf-8"
        }) {
            A.forEach(this.setField.bind(this)), this.encoding = q
        }
        setField(A) {
            this.entries[A.name.toLowerCase()] = A
        }
        getField(A) {
            return this.entries[A.toLowerCase()]
        }
        removeField(A) {
            delete this.entries[A.toLowerCase()]
        }
        getByType(A) {
            return Object.values(this.entries).filter((q) => q.kind === A)
        }
    }
    class zt1 {
        method;
        protocol;
        hostname;
        port;
        path;
        query;
        headers;
        username;
        password;
        fragment;
        body;
        constructor(A) {
            this.method = A.method || "GET", this.hostname = A.hostname || "localhost", this.port = A.port, this.query = A.query || {}, this.headers = A.headers || {}, this.body = A.body, this.protocol = A.protocol ? A.protocol.slice(-1) !== ":" ? `${A.protocol}:` : A.protocol : "https:", this.path = A.path ? A.path.charAt(0) !== "/" ? `/${A.path}` : A.path : "/", this.username = A.username, this.password = A.password, this.fragment = A.fragment
        }
        static clone(A) {
            let q = new zt1({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = uDK(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return zt1.clone(this)
        }
    }

    function uDK(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class a$8 {
        statusCode;
        reason;
        headers;
        body;
        constructor(A) {
            this.statusCode = A.statusCode, this.reason = A.reason, this.headers = A.headers || {}, this.body = A.body
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return typeof q.statusCode === "number" && typeof q.headers === "object"
        }
    }

    function BDK(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    mDK.Field = r$8;
    mDK.Fields = o$8;
    mDK.HttpRequest = zt1;
    mDK.HttpResponse = a$8;
    mDK.getHttpHandlerExtensionConfiguration = xDK;
    mDK.isValidHostname = BDK;
    mDK.resolveHttpHandlerRuntimeConfig = bDK
})
// @from(Ln 52140, Col 4)
yQ6 = R((nDK) => {
    var lDK = s$8(),
        t$8 = (A, q) => (K, Y) => async (z) => {
            let {
                response: w
            } = await K(z);
            try {
                let H = await q(w, A);
                return {
                    response: w,
                    output: H
                }
            } catch (H) {
                if (Object.defineProperty(H, "$response", {
                        value: w,
                        enumerable: !1,
                        writable: !1,
                        configurable: !1
                    }), !("$metadata" in H)) {
                    try {
                        H.message += `
  Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.`
                    } catch (O) {
                        if (!Y.logger || Y.logger?.constructor?.name === "NoOpLogger") console.warn("Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.");
                        else Y.logger?.warn?.("Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.")
                    }
                    if (typeof H.$responseBodyText < "u") {
                        if (H.$response) H.$response.body = H.$responseBodyText
                    }
                    try {
                        if (lDK.HttpResponse.isInstance(w)) {
                            let {
                                headers: O = {}
                            } = w, _ = Object.entries(O);
                            H.$metadata = {
                                httpStatusCode: w.statusCode,
                                requestId: RQ6(/^x-[\w-]+-request-?id$/, _),
                                extendedRequestId: RQ6(/^x-[\w-]+-id-2$/, _),
                                cfId: RQ6(/^x-[\w-]+-cf-id$/, _)
                            }
                        }
                    } catch (O) {}
                }
                throw H
            }
        }, RQ6 = (A, q) => {
            return (q.find(([K]) => {
                return K.match(A)
            }) || [void 0, void 0])[1]
        }, e$8 = (A, q) => (K, Y) => async (z) => {
            let w = A,
                H = Y.endpointV2?.url && w.urlParser ? async () => w.urlParser(Y.endpointV2.url): w.endpoint;
            if (!H) throw Error("No valid endpoint provider available.");
            let $ = await q(z.input, {
                ...A,
                endpoint: H
            });
            return K({
                ...z,
                request: $
            })
        }, AO8 = {
            name: "deserializerMiddleware",
            step: "deserialize",
            tags: ["DESERIALIZER"],
            override: !0
        }, qO8 = {
            name: "serializerMiddleware",
            step: "serialize",
            tags: ["SERIALIZER"],
            override: !0
        };

    function iDK(A, q, K) {
        return {
            applyToStack: (Y) => {
                Y.add(t$8(A, K), AO8), Y.add(e$8(A, q), qO8)
            }
        }
    }
    nDK.deserializerMiddleware = t$8;
    nDK.deserializerMiddlewareOption = AO8;
    nDK.getSerdePlugin = iDK;
    nDK.serializerMiddleware = e$8;
    nDK.serializerMiddlewareOption = qO8
})
// @from(Ln 52226, Col 4)
ov1 = R((z0K) => {
    var eDK = MQ6(),
        A0K = (A) => {
            return {
                setHttpHandler(q) {
                    A.httpHandler = q
                },
                httpHandler() {
                    return A.httpHandler
                },
                updateHttpClientConfig(q, K) {
                    A.httpHandler?.updateHttpClientConfig(q, K)
                },
                httpHandlerConfigs() {
                    return A.httpHandler.httpHandlerConfigs()
                }
            }
        },
        q0K = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class KO8 {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = eDK.FieldPosition.HEADER,
            values: K = []
        }) {
            this.name = A, this.kind = q, this.values = K
        }
        add(A) {
            this.values.push(A)
        }
        set(A) {
            this.values = A
        }
        remove(A) {
            this.values = this.values.filter((q) => q !== A)
        }
        toString() {
            return this.values.map((A) => A.includes(",") || A.includes(" ") ? `"${A}"` : A).join(", ")
        }
        get() {
            return this.values
        }
    }
    class YO8 {
        entries = {};
        encoding;
        constructor({
            fields: A = [],
            encoding: q = "utf-8"
        }) {
            A.forEach(this.setField.bind(this)), this.encoding = q
        }
        setField(A) {
            this.entries[A.name.toLowerCase()] = A
        }
        getField(A) {
            return this.entries[A.toLowerCase()]
        }
        removeField(A) {
            delete this.entries[A.toLowerCase()]
        }
        getByType(A) {
            return Object.values(this.entries).filter((q) => q.kind === A)
        }
    }
    class wt1 {
        method;
        protocol;
        hostname;
        port;
        path;
        query;
        headers;
        username;
        password;
        fragment;
        body;
        constructor(A) {
            this.method = A.method || "GET", this.hostname = A.hostname || "localhost", this.port = A.port, this.query = A.query || {}, this.headers = A.headers || {}, this.body = A.body, this.protocol = A.protocol ? A.protocol.slice(-1) !== ":" ? `${A.protocol}:` : A.protocol : "https:", this.path = A.path ? A.path.charAt(0) !== "/" ? `/${A.path}` : A.path : "/", this.username = A.username, this.password = A.password, this.fragment = A.fragment
        }
        static clone(A) {
            let q = new wt1({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = K0K(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return wt1.clone(this)
        }
    }

    function K0K(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class zO8 {
        statusCode;
        reason;
        headers;
        body;
        constructor(A) {
            this.statusCode = A.statusCode, this.reason = A.reason, this.headers = A.headers || {}, this.body = A.body
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return typeof q.statusCode === "number" && typeof q.headers === "object"
        }
    }

    function Y0K(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    z0K.Field = KO8;
    z0K.Fields = YO8;
    z0K.HttpRequest = wt1;
    z0K.HttpResponse = zO8;
    z0K.getHttpHandlerExtensionConfiguration = A0K;
    z0K.isValidHostname = Y0K;
    z0K.resolveHttpHandlerRuntimeConfig = q0K
})
// @from(Ln 52368, Col 4)
wO8 = R((j0K) => {
    var D0K = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
    j0K.isArrayBuffer = D0K
})
// @from(Ln 52372, Col 4)
Ht1 = R((Z0K) => {
    var P0K = wO8(),
        CQ6 = h1("buffer"),
        W0K = (A, q = 0, K = A.byteLength - q) => {
            if (!P0K.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
            return CQ6.Buffer.from(A, q, K)
        },
        G0K = (A, q) => {
            if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
            return q ? CQ6.Buffer.from(A, q) : CQ6.Buffer.from(A)
        };
    Z0K.fromArrayBuffer = W0K;
    Z0K.fromString = G0K
})
// @from(Ln 52386, Col 4)
OO8 = R((HO8) => {
    Object.defineProperty(HO8, "__esModule", {
        value: !0
    });
    HO8.fromBase64 = void 0;
    var N0K = Ht1(),
        T0K = /^[A-Za-z0-9+/]*={0,2}$/,
        v0K = (A) => {
            if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
            if (!T0K.exec(A)) throw TypeError("Invalid base64 string.");
            let q = (0, N0K.fromString)(A, "base64");
            return new Uint8Array(q.buffer, q.byteOffset, q.byteLength)
        };
    HO8.fromBase64 = v0K
})
// @from(Ln 52401, Col 4)
_O8 = R((k0K) => {
    var E0K = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
    k0K.isArrayBuffer = E0K
})
// @from(Ln 52405, Col 4)
JO8 = R((S0K) => {
    var R0K = _O8(),
        SQ6 = h1("buffer"),
        y0K = (A, q = 0, K = A.byteLength - q) => {
            if (!R0K.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
            return SQ6.Buffer.from(A, q, K)
        },
        C0K = (A, q) => {
            if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
            return q ? SQ6.Buffer.from(A, q) : SQ6.Buffer.from(A)
        };
    S0K.fromArrayBuffer = y0K;
    S0K.fromString = C0K
})
// @from(Ln 52419, Col 4)
Z2 = R((u0K) => {
    var XO8 = JO8(),
        DO8 = (A) => {
            let q = XO8.fromString(A, "utf8");
            return new Uint8Array(q.buffer, q.byteOffset, q.byteLength / Uint8Array.BYTES_PER_ELEMENT)
        },
        x0K = (A) => {
            if (typeof A === "string") return DO8(A);
            if (ArrayBuffer.isView(A)) return new Uint8Array(A.buffer, A.byteOffset, A.byteLength / Uint8Array.BYTES_PER_ELEMENT);
            return new Uint8Array(A)
        },
        b0K = (A) => {
            if (typeof A === "string") return A;
            if (typeof A !== "object" || typeof A.byteOffset !== "number" || typeof A.byteLength !== "number") throw Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
            return XO8.fromArrayBuffer(A.buffer, A.byteOffset, A.byteLength).toString("utf8")
        };
    u0K.fromUtf8 = DO8;
    u0K.toUint8Array = x0K;
    u0K.toUtf8 = b0K
})
// @from(Ln 52439, Col 4)
PO8 = R((jO8) => {
    Object.defineProperty(jO8, "__esModule", {
        value: !0
    });
    jO8.toBase64 = void 0;
    var Q0K = Ht1(),
        g0K = Z2(),
        U0K = (A) => {
            let q;
            if (typeof A === "string") q = (0, g0K.fromUtf8)(A);
            else q = A;
            if (typeof q !== "object" || typeof q.byteOffset !== "number" || typeof q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
            return (0, Q0K.fromArrayBuffer)(q.buffer, q.byteOffset, q.byteLength).toString("base64")
        };
    jO8.toBase64 = U0K
})
// @from(Ln 52455, Col 4)
MH1 = R((av1) => {
    var WO8 = OO8(),
        GO8 = PO8();
    Object.keys(WO8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(av1, A)) Object.defineProperty(av1, A, {
            enumerable: !0,
            get: function() {
                return WO8[A]
            }
        })
    });
    Object.keys(GO8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(av1, A)) Object.defineProperty(av1, A, {
            enumerable: !0,
            get: function() {
                return GO8[A]
            }
        })
    })
})
// @from(Ln 52475, Col 4)
hQ6 = R((fO8) => {
    Object.defineProperty(fO8, "__esModule", {
        value: !0
    });
    fO8.ChecksumStream = void 0;
    var p0K = MH1(),
        d0K = h1("stream");
    class ZO8 extends d0K.Duplex {
        expectedChecksum;
        checksumSourceLocation;
        checksum;
        source;
        base64Encoder;
        constructor({
            expectedChecksum: A,
            checksum: q,
            source: K,
            checksumSourceLocation: Y,
            base64Encoder: z
        }) {
            super();
            if (typeof K.pipe === "function") this.source = K;
            else throw Error(`@smithy/util-stream: unsupported source type ${K?.constructor?.name??K} in ChecksumStream.`);
            this.base64Encoder = z ?? p0K.toBase64, this.expectedChecksum = A, this.checksum = q, this.checksumSourceLocation = Y, this.source.pipe(this)
        }
        _read(A) {}
        _write(A, q, K) {
            try {
                this.checksum.update(A), this.push(A)
            } catch (Y) {
                return K(Y)
            }
            return K()
        }
        async _final(A) {
            try {
                let q = await this.checksum.digest(),
                    K = this.base64Encoder(q);
                if (this.expectedChecksum !== K) return A(Error(`Checksum mismatch: expected "${this.expectedChecksum}" but received "${K}" in response header "${this.checksumSourceLocation}".`))
            } catch (q) {
                return A(q)
            }
            return this.push(null), A()
        }
    }
    fO8.ChecksumStream = ZO8
})
// @from(Ln 52522, Col 4)
yi = R((NO8) => {
    Object.defineProperty(NO8, "__esModule", {
        value: !0
    });
    NO8.isBlob = NO8.isReadableStream = void 0;
    var c0K = (A) => typeof ReadableStream === "function" && (A?.constructor?.name === ReadableStream.name || A instanceof ReadableStream);
    NO8.isReadableStream = c0K;
    var l0K = (A) => {
        return typeof Blob === "function" && (A?.constructor?.name === Blob.name || A instanceof Blob)
    };
    NO8.isBlob = l0K
})
// @from(Ln 52534, Col 4)
LO8 = R((EO8) => {
    Object.defineProperty(EO8, "__esModule", {
        value: !0
    });
    EO8.ChecksumStream = void 0;
    var n0K = typeof ReadableStream === "function" ? ReadableStream : function() {};
    class vO8 extends n0K {}
    EO8.ChecksumStream = vO8
})