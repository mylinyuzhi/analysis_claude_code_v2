
// @from(Start 1631663, End 1642317)
hd0 = L(() => {
  wd0();
  Td0(); /*! chokidar - MIT License (c) 2012 Paul Miller (paulmillr.com) */
  U64 = /\\/g, Pd0 = /\/\//, $64 = /\..*\.(sw[px])$|~$|\.subl.*\.tmp/, w64 = /^\.[/\\]/;
  O64 = Object.freeze(new Set);
  nH1 = class nH1 extends H64 {
    constructor(A = {}) {
      super();
      this.closed = !1, this._closers = new Map, this._ignoredPaths = new Set, this._throttled = new Map, this._streams = new Set, this._symlinkPaths = new Map, this._watched = new Map, this._pendingWrites = new Map, this._pendingUnlinks = new Map, this._readyCount = 0, this._readyEmitted = !1;
      let Q = A.awaitWriteFinish,
        B = {
          stabilityThreshold: 2000,
          pollInterval: 100
        },
        G = {
          persistent: !0,
          ignoreInitial: !1,
          ignorePermissionErrors: !1,
          interval: 100,
          binaryInterval: 300,
          followSymlinks: !0,
          usePolling: !1,
          atomic: !0,
          ...A,
          ignored: A.ignored ? cxA(A.ignored) : cxA([]),
          awaitWriteFinish: Q === !0 ? B : typeof Q === "object" ? {
            ...B,
            ...Q
          } : !1
        };
      if (Od0) G.usePolling = !0;
      if (G.atomic === void 0) G.atomic = !G.usePolling;
      let Z = process.env.CHOKIDAR_USEPOLLING;
      if (Z !== void 0) {
        let J = Z.toLowerCase();
        if (J === "false" || J === "0") G.usePolling = !1;
        else if (J === "true" || J === "1") G.usePolling = !0;
        else G.usePolling = !!J
      }
      let I = process.env.CHOKIDAR_INTERVAL;
      if (I) G.interval = Number.parseInt(I, 10);
      let Y = 0;
      this._emitReady = () => {
        if (Y++, Y >= this._readyCount) this._emitReady = mxA, this._readyEmitted = !0, process.nextTick(() => this.emit(VI.READY))
      }, this._emitRaw = (...J) => this.emit(VI.RAW, ...J), this._boundRemove = this._remove.bind(this), this.options = G, this._nodeFsHandler = new pH1(this), Object.freeze(G)
    }
    _addIgnoredPath(A) {
      if (iH1(A)) {
        for (let Q of this._ignoredPaths)
          if (iH1(Q) && Q.path === A.path && Q.recursive === A.recursive) return
      }
      this._ignoredPaths.add(A)
    }
    _removeIgnoredPath(A) {
      if (this._ignoredPaths.delete(A), typeof A === "string") {
        for (let Q of this._ignoredPaths)
          if (iH1(Q) && Q.path === A) this._ignoredPaths.delete(Q)
      }
    }
    add(A, Q, B) {
      let {
        cwd: G
      } = this.options;
      this.closed = !1, this._closePromise = void 0;
      let Z = Sd0(A);
      if (G) Z = Z.map((I) => {
        return M64(I, G)
      });
      if (Z.forEach((I) => {
          this._removeIgnoredPath(I)
        }), this._userIgnored = void 0, !this._readyCount) this._readyCount = 0;
      return this._readyCount += Z.length, Promise.all(Z.map(async (I) => {
        let Y = await this._nodeFsHandler._addToNodeFs(I, !B, void 0, 0, Q);
        if (Y) this._emitReady();
        return Y
      })).then((I) => {
        if (this.closed) return;
        I.forEach((Y) => {
          if (Y) this.add(n6.dirname(Y), n6.basename(Q || Y))
        })
      }), this
    }
    unwatch(A) {
      if (this.closed) return this;
      let Q = Sd0(A),
        {
          cwd: B
        } = this.options;
      return Q.forEach((G) => {
        if (!n6.isAbsolute(G) && !this._closers.has(G)) {
          if (B) G = n6.join(B, G);
          G = n6.resolve(G)
        }
        if (this._closePath(G), this._addIgnoredPath(G), this._watched.has(G)) this._addIgnoredPath({
          path: G,
          recursive: !0
        });
        this._userIgnored = void 0
      }), this
    }
    close() {
      if (this._closePromise) return this._closePromise;
      this.closed = !0, this.removeAllListeners();
      let A = [];
      return this._closers.forEach((Q) => Q.forEach((B) => {
        let G = B();
        if (G instanceof Promise) A.push(G)
      })), this._streams.forEach((Q) => Q.destroy()), this._userIgnored = void 0, this._readyCount = 0, this._readyEmitted = !1, this._watched.forEach((Q) => Q.dispose()), this._closers.clear(), this._watched.clear(), this._streams.clear(), this._symlinkPaths.clear(), this._throttled.clear(), this._closePromise = A.length ? Promise.all(A).then(() => {
        return
      }) : Promise.resolve(), this._closePromise
    }
    getWatched() {
      let A = {};
      return this._watched.forEach((Q, B) => {
        let Z = (this.options.cwd ? n6.relative(this.options.cwd, B) : B) || yd0;
        A[Z] = Q.getChildren().sort()
      }), A
    }
    emitWithAll(A, Q) {
      if (this.emit(A, ...Q), A !== VI.ERROR) this.emit(VI.ALL, A, ...Q)
    }
    async _emit(A, Q, B) {
      if (this.closed) return;
      let G = this.options;
      if (cH1) Q = n6.normalize(Q);
      if (G.cwd) Q = n6.relative(G.cwd, Q);
      let Z = [Q];
      if (B != null) Z.push(B);
      let I = G.awaitWriteFinish,
        Y;
      if (I && (Y = this._pendingWrites.get(Q))) return Y.lastChange = new Date, this;
      if (G.atomic) {
        if (A === VI.UNLINK) return this._pendingUnlinks.set(Q, [A, ...Z]), setTimeout(() => {
          this._pendingUnlinks.forEach((J, W) => {
            this.emit(...J), this.emit(VI.ALL, ...J), this._pendingUnlinks.delete(W)
          })
        }, typeof G.atomic === "number" ? G.atomic : 100), this;
        if (A === VI.ADD && this._pendingUnlinks.has(Q)) A = VI.CHANGE, this._pendingUnlinks.delete(Q)
      }
      if (I && (A === VI.ADD || A === VI.CHANGE) && this._readyEmitted) {
        let J = (W, X) => {
          if (W) A = VI.ERROR, Z[0] = W, this.emitWithAll(A, Z);
          else if (X) {
            if (Z.length > 1) Z[1] = X;
            else Z.push(X);
            this.emitWithAll(A, Z)
          }
        };
        return this._awaitWriteFinish(Q, I.stabilityThreshold, A, J), this
      }
      if (A === VI.CHANGE) {
        if (!this._throttle(VI.CHANGE, Q, 50)) return this
      }
      if (G.alwaysStat && B === void 0 && (A === VI.ADD || A === VI.ADD_DIR || A === VI.CHANGE)) {
        let J = G.cwd ? n6.join(G.cwd, Q) : Q,
          W;
        try {
          W = await K64(J)
        } catch (X) {}
        if (!W || this.closed) return;
        Z.push(W)
      }
      return this.emitWithAll(A, Z), this
    }
    _handleError(A) {
      let Q = A && A.code;
      if (A && Q !== "ENOENT" && Q !== "ENOTDIR" && (!this.options.ignorePermissionErrors || Q !== "EPERM" && Q !== "EACCES")) this.emit(VI.ERROR, A);
      return A || this.closed
    }
    _throttle(A, Q, B) {
      if (!this._throttled.has(A)) this._throttled.set(A, new Map);
      let G = this._throttled.get(A);
      if (!G) throw Error("invalid throttle");
      let Z = G.get(Q);
      if (Z) return Z.count++, !1;
      let I, Y = () => {
        let W = G.get(Q),
          X = W ? W.count : 0;
        if (G.delete(Q), clearTimeout(I), W) clearTimeout(W.timeoutObject);
        return X
      };
      I = setTimeout(Y, B);
      let J = {
        timeoutObject: I,
        clear: Y,
        count: 0
      };
      return G.set(Q, J), J
    }
    _incrReadyCount() {
      return this._readyCount++
    }
    _awaitWriteFinish(A, Q, B, G) {
      let Z = this.options.awaitWriteFinish;
      if (typeof Z !== "object") return;
      let I = Z.pollInterval,
        Y, J = A;
      if (this.options.cwd && !n6.isAbsolute(A)) J = n6.join(this.options.cwd, A);
      let W = new Date,
        X = this._pendingWrites;

      function V(F) {
        F64(J, (K, D) => {
          if (K || !X.has(A)) {
            if (K && K.code !== "ENOENT") G(K);
            return
          }
          let H = Number(new Date);
          if (F && D.size !== F.size) X.get(A).lastChange = H;
          let C = X.get(A);
          if (H - C.lastChange >= Q) X.delete(A), G(void 0, D);
          else Y = setTimeout(V, I, D)
        })
      }
      if (!X.has(A)) X.set(A, {
        lastChange: W,
        cancelWait: () => {
          return X.delete(A), clearTimeout(Y), B
        }
      }), Y = setTimeout(V, I)
    }
    _isIgnored(A, Q) {
      if (this.options.atomic && $64.test(A)) return !0;
      if (!this._userIgnored) {
        let {
          cwd: B
        } = this.options, Z = (this.options.ignored || []).map(kd0(B)), Y = [...[...this._ignoredPaths].map(kd0(B)), ...Z];
        this._userIgnored = L64(Y, void 0)
      }
      return this._userIgnored(A, Q)
    }
    _isntIgnored(A, Q) {
      return !this._isIgnored(A, Q)
    }
    _getWatchHelpers(A) {
      return new bd0(A, this.options.followSymlinks, this)
    }
    _getWatchedDir(A) {
      let Q = n6.resolve(A);
      if (!this._watched.has(Q)) this._watched.set(Q, new vd0(Q, this._boundRemove));
      return this._watched.get(Q)
    }
    _hasReadPermissions(A) {
      if (this.options.ignorePermissionErrors) return !0;
      return Boolean(Number(A.mode) & 256)
    }
    _remove(A, Q, B) {
      let G = n6.join(A, Q),
        Z = n6.resolve(G);
      if (B = B != null ? B : this._watched.has(G) || this._watched.has(Z), !this._throttle("remove", G, 100)) return;
      if (!B && this._watched.size === 1) this.add(A, Q, !0);
      this._getWatchedDir(G).getChildren().forEach((F) => this._remove(G, F));
      let J = this._getWatchedDir(A),
        W = J.has(Q);
      if (J.remove(Q), this._symlinkPaths.has(Z)) this._symlinkPaths.delete(Z);
      let X = G;
      if (this.options.cwd) X = n6.relative(this.options.cwd, G);
      if (this.options.awaitWriteFinish && this._pendingWrites.has(X)) {
        if (this._pendingWrites.get(X).cancelWait() === VI.ADD) return
      }
      this._watched.delete(G), this._watched.delete(Z);
      let V = B ? VI.UNLINK_DIR : VI.UNLINK;
      if (W && !this._isIgnored(G)) this._emit(V, G);
      this._closePath(G)
    }
    _closePath(A) {
      this._closeFile(A);
      let Q = n6.dirname(A);
      this._getWatchedDir(Q).remove(n6.basename(A))
    }
    _closeFile(A) {
      let Q = this._closers.get(A);
      if (!Q) return;
      Q.forEach((B) => B()), this._closers.delete(A)
    }
    _addPathCloser(A, Q) {
      if (!Q) return;
      let B = this._closers.get(A);
      if (!B) B = [], this._closers.set(A, B);
      B.push(Q)
    }
    _readdirp(A, Q) {
      if (this.closed) return;
      let B = {
          type: VI.ALL,
          alwaysStat: !0,
          lstat: !0,
          ...Q,
          depth: 0
        },
        G = $d0(A, B);
      return this._streams.add(G), G.once(Md0, () => {
        G = void 0
      }), G.once(dH1, () => {
        if (G) this._streams.delete(G), G = void 0
      }), G
    }
  };
  fd0 = {
    watch: P64,
    FSWatcher: nH1
  }
})
// @from(Start 1642349, End 1642872)
function k64() {
  if (gd0 || md0) return;
  gd0 = !0;
  let A = v64();
  if (A.length === 0) return;
  g(`Watching for changes in setting files ${A.join(", ")}...`), h9A = fd0.watch(A, {
    persistent: !0,
    ignoreInitial: !0,
    awaitWriteFinish: {
      stabilityThreshold: j64,
      pollInterval: S64
    },
    ignored: (Q) => Q.split(ud0.sep).some((B) => B === ".git"),
    ignorePermissionErrors: !0,
    usePolling: !1,
    atomic: !0
  }), h9A.on("change", b64), h9A.on("unlink", f64), PG(async () => dd0())
}
// @from(Start 1642874, End 1642965)
function dd0() {
  if (md0 = !0, h9A) h9A.close(), h9A = null;
  pxA.clear(), wKA.clear()
}
// @from(Start 1642967, End 1643037)
function y64(A) {
  return wKA.add(A), () => {
    wKA.delete(A)
  }
}
// @from(Start 1643039, End 1643107)
function x64(A) {
  let Q = Gw(A);
  if (Q) pxA.set(Q, Date.now())
}
// @from(Start 1643109, End 1643338)
function v64() {
  let A = RA();
  return iN.map((Q) => {
    let B = Gw(Q);
    if (!B) return;
    try {
      if (!A.statSync(B).isFile()) return
    } catch {
      return
    }
    return B
  }).filter((Q) => Q !== void 0)
}
// @from(Start 1643340, End 1643543)
function b64(A) {
  let Q = cd0(A);
  if (!Q) return;
  let B = pxA.get(A);
  if (B && Date.now() - B < _64) {
    pxA.delete(A);
    return
  }
  g(`Detected change to ${A}`), wKA.forEach((G) => G(Q))
}
// @from(Start 1643545, End 1643659)
function f64(A) {
  let Q = cd0(A);
  if (!Q) return;
  g(`Detected deletion of ${A}`), wKA.forEach((B) => B(Q))
}
// @from(Start 1643661, End 1643717)
function cd0(A) {
  return iN.find((Q) => Gw(Q) === A)
}
// @from(Start 1643722, End 1643732)
j64 = 1000
// @from(Start 1643736, End 1643745)
S64 = 500
// @from(Start 1643749, End 1643759)
_64 = 5000
// @from(Start 1643763, End 1643773)
h9A = null
// @from(Start 1643777, End 1643785)
gd0 = !1
// @from(Start 1643789, End 1643797)
md0 = !1
// @from(Start 1643801, End 1643804)
pxA
// @from(Start 1643806, End 1643809)
wKA
// @from(Start 1643811, End 1643813)
fm
// @from(Start 1643819, End 1644017)
qKA = L(() => {
  hd0();
  V0();
  AQ();
  MB();
  LV();
  HH();
  pxA = new Map, wKA = new Set;
  fm = {
    initialize: k64,
    dispose: dd0,
    subscribe: y64,
    markInternalWrite: x64
  }
})
// @from(Start 1644020, End 1644589)
function ld0(A, Q) {
  return `
Web page content:
---
${A}
---

${Q}

Provide a concise response based only on the content above. In your response:
 - Enforce a strict 125-character maximum for quotes from any source document. Open Source Software is ok as long as we respect the license.
 - Use quotation marks for exact language from articles; any language outside of the quotation should never be word-for-word the same.
 - You are not a lawyer and never comment on the legality of your own prompts and responses.
 - Never produce or reproduce exact song lyrics.
`
}
// @from(Start 1644594, End 1644609)
$X = "WebFetch"
// @from(Start 1644613, End 1645776)
pd0 = `
- Fetches content from a specified URL and processes it using an AI model
- Takes a URL and a prompt as input
- Fetches the URL content, converts HTML to markdown
- Processes the content with the prompt using a small, fast model
- Returns the model's response about the content
- Use this tool when you need to retrieve and analyze web content

Usage notes:
  - IMPORTANT: If an MCP-provided web fetch tool is available, prefer using that tool instead of this one, as it may have fewer restrictions. All MCP-provided tools start with "mcp__".
  - The URL must be a fully-formed valid URL
  - HTTP URLs will be automatically upgraded to HTTPS
  - The prompt should describe what information you want to extract from the page
  - This tool is read-only and does not modify any files
  - Results may be summarized if the content is very large
  - Includes a self-cleaning 15-minute cache for faster responses when repeatedly accessing the same URL
  - When a URL redirects to a different host, the tool will inform you and provide the redirect URL in a special format. You should then make a new WebFetch request with the redirect URL to fetch the content.
`
// @from(Start 1645782, End 1645793)
$5 = "Edit"
// @from(Start 1645796, End 1645995)
function V6() {
  return Y0(process.env.CLAUDE_CODE_USE_BEDROCK) ? "bedrock" : Y0(process.env.CLAUDE_CODE_USE_VERTEX) ? "vertex" : Y0(process.env.CLAUDE_CODE_USE_FOUNDRY) ? "foundry" : "firstParty"
}
// @from(Start 1645997, End 1646028)
function _R() {
  return V6()
}
// @from(Start 1646033, End 1646057)
lK = L(() => {
  hQ()
})
// @from(Start 1646060, End 1646109)
function g9A() {
  return V6() === "firstParty"
}
// @from(Start 1646111, End 1646210)
function lxA(A) {
  let Q = A.startsWith(".") ? A.slice(1) : A;
  return h64.has(Q.toLowerCase())
}
// @from(Start 1646211, End 1646629)
async function nd0(A) {
  let Q = RA(),
    G = Q.statSync(A).size;
  if (G === 0) throw Error(`PDF file is empty: ${A}`);
  if (G > id0) throw Error(`PDF file size (${UJ(G)}) exceeds maximum allowed size (${UJ(id0)}). PDF files must be less than 32MB.`);
  let I = Q.readFileBytesSync(A).toString("base64");
  return {
    type: "pdf",
    file: {
      filePath: A,
      base64: I,
      originalSize: G
    }
  }
}
// @from(Start 1646634, End 1646637)
h64
// @from(Start 1646639, End 1646653)
id0 = 33554432
// @from(Start 1646659, End 1646726)
aH1 = L(() => {
  lK();
  AQ();
  R9();
  h64 = new Set(["pdf"])
})
// @from(Start 1646732, End 1646743)
d5 = "Read"
// @from(Start 1646747, End 1646757)
NKA = 2000
// @from(Start 1646761, End 1646771)
g64 = 2000
// @from(Start 1646775, End 1646821)
ad0 = "Read a file from the local filesystem."
// @from(Start 1646825, End 1646828)
sd0
// @from(Start 1646834, End 1648642)
wF = L(() => {
  aH1();
  sd0 = `Reads a file from the local filesystem. You can access any file directly by using this tool.
Assume this tool is able to read all files on the machine. If the User provides a path to a file assume that path is valid. It is okay to read a file that does not exist; an error will be returned.

Usage:
- The file_path parameter must be an absolute path, not a relative path
- By default, it reads up to ${NKA} lines starting from the beginning of the file
- You can optionally specify a line offset and limit (especially handy for long files), but it's recommended to read the whole file by not providing these parameters
- Any lines longer than ${g64} characters will be truncated
- Results are returned using cat -n format, with line numbers starting at 1
- This tool allows Claude Code to read images (eg PNG, JPG, etc). When reading an image file the contents are presented visually as Claude Code is a multimodal LLM.${g9A()?`
- This tool can read PDF files (.pdf). PDFs are processed page by page, extracting both text and visual content for analysis.`:""}
- This tool can read Jupyter notebooks (.ipynb files) and returns all cells with their outputs, combining code, text, and visualizations.
- This tool can only read files, not directories. To read a directory, use an ls command via the ${C9} tool.
- You can call multiple tools in a single response. It is always better to speculatively read multiple potentially useful files in parallel.
- You will regularly be asked to read screenshots. If the user provides a path to a screenshot, ALWAYS use this tool to view the file at the path. This tool will work with all temporary file paths.
- If you read a file that exists but has empty contents you will receive a system reminder warning in place of file contents.`
})
// @from(Start 1648686, End 1648915)
function LKA(A) {
  let Q = A.match(/^([^(]+)\(([^)]+)\)$/);
  if (!Q) return {
    toolName: A
  };
  let B = Q[1],
    G = Q[2];
  if (!B || !G) return {
    toolName: A
  };
  return {
    toolName: B,
    ruleContent: G
  }
}
// @from(Start 1648917, End 1648979)
function u64(A) {
  return A.match(/^(.+):\*$/)?.[1] ?? null
}
// @from(Start 1648981, End 1650728)
function sH1(A) {
  let Q = A.permissions || {},
    B = [],
    G = [];
  for (let F of Q.allow || []) {
    let K = LKA(F);
    if (K.toolName === $X && K.ruleContent?.startsWith("domain:")) B.push(K.ruleContent.substring(7))
  }
  for (let F of Q.deny || []) {
    let K = LKA(F);
    if (K.toolName === $X && K.ruleContent?.startsWith("domain:")) G.push(K.ruleContent.substring(7))
  }
  let Z = ["."],
    I = [],
    Y = [],
    J = iN.map((F) => Gw(F)).filter((F) => F !== void 0);
  I.push(...J);
  let W = I2A(),
    X = uQ();
  if (W !== X) I.push(rd0(W, ".claude", "settings.json")), I.push(rd0(W, ".claude", "settings.local.json"));
  for (let F of Q.allow || []) {
    let K = LKA(F);
    if (K.toolName === $5 && K.ruleContent) Z.push(K.ruleContent)
  }
  for (let F of Q.deny || []) {
    let K = LKA(F);
    if (K.toolName === $5 && K.ruleContent) I.push(K.ruleContent);
    if (K.toolName === d5 && K.ruleContent) Y.push(K.ruleContent)
  }
  let V = A.sandbox?.ripgrep ? A.sandbox.ripgrep : (() => {
    let {
      rgPath: F,
      rgArgs: K
    } = Y9A();
    return {
      command: F,
      args: K
    }
  })();
  return {
    network: {
      allowedDomains: B,
      deniedDomains: G,
      allowUnixSockets: A.sandbox?.network?.allowUnixSockets,
      allowAllUnixSockets: A.sandbox?.network?.allowAllUnixSockets,
      allowLocalBinding: A.sandbox?.network?.allowLocalBinding,
      httpProxyPort: A.sandbox?.network?.httpProxyPort,
      socksProxyPort: A.sandbox?.network?.socksProxyPort
    },
    filesystem: {
      denyRead: Y,
      allowWrite: Z,
      denyWrite: I
    },
    ignoreViolations: A.sandbox?.ignoreViolations,
    enableWeakerNestedSandbox: A.sandbox?.enableWeakerNestedSandbox,
    ripgrep: V
  }
}
// @from(Start 1650730, End 1650879)
function m64() {
  try {
    let A = l0();
    return od0(A)
  } catch (A) {
    return g(`Failed to get settings for sandbox check: ${A}`), !1
  }
}
// @from(Start 1650881, End 1650931)
function d64() {
  let A = l0();
  return td0(A)
}
// @from(Start 1650933, End 1650983)
function c64() {
  let A = l0();
  return ed0(A)
}
// @from(Start 1650985, End 1651139)
function ixA() {
  let A = dQ(),
    Q = A === "wsl" ? "linux" : A;
  if (!xI.isSupportedPlatform(Q)) return !1;
  if (!oH1()) return !1;
  return m64()
}
// @from(Start 1651141, End 1651697)
function p64() {
  if (dQ() !== "linux") return [];
  try {
    let Q = l0();
    if (!Q?.sandbox?.enabled) return [];
    let B = Q?.permissions || {},
      G = [],
      Z = (I) => {
        let Y = I.replace(/\/\*\*$/, "");
        return /[*?[\]]/.test(Y)
      };
    for (let I of [...B.allow || [], ...B.deny || []]) {
      let Y = LKA(I);
      if ((Y.toolName === $5 || Y.toolName === d5) && Y.ruleContent && Z(Y.ruleContent)) G.push(I)
    }
    return G
  } catch (Q) {
    return g(`Failed to get Linux glob pattern warnings: ${Q}`), []
  }
}
// @from(Start 1651699, End 1651971)
function l64() {
  let A = ["flagSettings", "policySettings"];
  for (let Q of A) {
    let B = OB(Q);
    if (B?.sandbox?.enabled !== void 0 || B?.sandbox?.autoAllowBashIfSandboxed !== void 0 || B?.sandbox?.allowUnsandboxedCommands !== void 0) return !0
  }
  return !1
}
// @from(Start 1651972, End 1652413)
async function i64(A) {
  let Q = OB("localSettings");
  cB("localSettings", {
    sandbox: {
      ...Q?.sandbox,
      ...A.enabled !== void 0 && {
        enabled: A.enabled
      },
      ...A.autoAllowBashIfSandboxed !== void 0 && {
        autoAllowBashIfSandboxed: A.autoAllowBashIfSandboxed
      },
      ...A.allowUnsandboxedCommands !== void 0 && {
        allowUnsandboxedCommands: A.allowUnsandboxedCommands
      }
    }
  })
}
// @from(Start 1652415, End 1652480)
function n64() {
  return l0()?.sandbox?.excludedCommands ?? []
}
// @from(Start 1652481, End 1652646)
async function a64(A, Q, B, G) {
  if (ixA())
    if (hm) await hm;
    else throw Error("Sandbox failed to initialize. ");
  return xI.wrapWithSandbox(A, Q, B, G)
}
// @from(Start 1652647, End 1653114)
async function s64(A) {
  if (hm) return hm;
  if (!ixA()) return;
  let Q = l0(),
    B = sH1(Q);
  return hm = (async () => {
    try {
      await xI.initialize(B, A), rH1 = fm.subscribe(() => {
        let G = l0(),
          Z = sH1(G);
        xI.updateConfig(Z), g("Sandbox configuration updated from settings change")
      })
    } catch (G) {
      hm = void 0, g(`Failed to initialize sandbox: ${G instanceof Error?G.message:String(G)}`)
    }
  })(), hm
}
// @from(Start 1653116, End 1653209)
function r64() {
  if (!ixA()) return;
  let A = l0(),
    Q = sH1(A);
  xI.updateConfig(Q)
}
// @from(Start 1653210, End 1653374)
async function o64() {
  return rH1?.(), rH1 = void 0, od0.cache.clear?.(), td0.cache.clear?.(), ed0.cache.clear?.(), oH1.cache.clear?.(), hm = void 0, xI.reset()
}
// @from(Start 1653376, End 1653911)
function Ac0(A, Q) {
  let B = OB("localSettings"),
    G = B?.sandbox?.excludedCommands || [],
    Z = A;
  if (Q) {
    let I = Q.filter((Y) => Y.type === "addRules" && Y.rules.some((J) => J.toolName === C9));
    if (I.length > 0 && I[0].type === "addRules") {
      let Y = I[0].rules.find((J) => J.toolName === C9);
      if (Y?.ruleContent) Z = u64(Y.ruleContent) || Y.ruleContent
    }
  }
  if (!G.includes(Z)) cB("localSettings", {
    sandbox: {
      ...B?.sandbox,
      excludedCommands: [...G, Z]
    }
  });
  return Z
}
// @from(Start 1653916, End 1653918)
hm
// @from(Start 1653920, End 1653923)
rH1
// @from(Start 1653925, End 1653928)
oH1
// @from(Start 1653930, End 1653933)
od0
// @from(Start 1653935, End 1653938)
td0
// @from(Start 1653940, End 1653943)
ed0
// @from(Start 1653945, End 1653947)
nQ
// @from(Start 1653953, End 1655620)
$J = L(() => {
  Fd0();
  Q3();
  MB();
  LV();
  _0();
  V0();
  qKA();
  $9A();
  wF();
  sj();
  oH1 = s1(() => {
    let {
      rgPath: A,
      rgArgs: Q
    } = Y9A();
    return xI.checkDependencies({
      command: A,
      args: Q
    })
  }), od0 = s1((A) => {
    return A?.sandbox?.enabled ?? !1
  });
  td0 = s1((A) => {
    return A?.sandbox?.autoAllowBashIfSandboxed ?? !0
  });
  ed0 = s1((A) => {
    return A?.sandbox?.allowUnsandboxedCommands ?? !0
  });
  nQ = {
    initialize: s64,
    isSandboxingEnabled: ixA,
    isAutoAllowBashIfSandboxedEnabled: d64,
    areUnsandboxedCommandsAllowed: c64,
    areSandboxSettingsLockedByPolicy: l64,
    setSandboxSettings: i64,
    getExcludedCommands: n64,
    wrapWithSandbox: a64,
    refreshConfig: r64,
    reset: o64,
    checkDependencies: oH1,
    getFsReadConfig: xI.getFsReadConfig,
    getFsWriteConfig: xI.getFsWriteConfig,
    getNetworkRestrictionConfig: xI.getNetworkRestrictionConfig,
    getIgnoreViolations: xI.getIgnoreViolations,
    getLinuxGlobPatternWarnings: p64,
    isSupportedPlatform: xI.isSupportedPlatform,
    getAllowUnixSockets: xI.getAllowUnixSockets,
    getAllowLocalBinding: xI.getAllowLocalBinding,
    getEnableWeakerNestedSandbox: xI.getEnableWeakerNestedSandbox,
    getProxyPort: xI.getProxyPort,
    getSocksProxyPort: xI.getSocksProxyPort,
    getLinuxHttpSocketPath: xI.getLinuxHttpSocketPath,
    getLinuxSocksSocketPath: xI.getLinuxSocksSocketPath,
    waitForNetworkInitialization: xI.waitForNetworkInitialization,
    getSandboxViolationStore: xI.getSandboxViolationStore,
    annotateStderrWithSandboxFailures: xI.annotateStderrWithSandboxFailures
  }
})
// @from(Start 1655623, End 1655939)
function nxA(A) {
  switch (A) {
    case "bypassPermissions":
      return "bypassPermissions";
    case "acceptEdits":
      return "acceptEdits";
    case "plan":
      return "plan";
    case "dontAsk":
      return "dontAsk";
    case "default":
      return "default";
    default:
      return "default"
  }
}
// @from(Start 1655941, End 1656228)
function Fv(A) {
  switch (A) {
    case "default":
      return "Default";
    case "plan":
      return "Plan Mode";
    case "acceptEdits":
      return "Accept edits";
    case "bypassPermissions":
      return "Bypass Permissions";
    case "dontAsk":
      return "Don't Ask"
  }
}
// @from(Start 1656230, End 1656290)
function Bc0(A) {
  return A === "default" || A === void 0
}
// @from(Start 1656292, End 1656532)
function Gc0(A) {
  switch (A) {
    case "default":
      return "";
    case "plan":
      return "⏸";
    case "acceptEdits":
      return "⏵⏵";
    case "bypassPermissions":
      return "⏵⏵";
    case "dontAsk":
      return "⏵⏵"
  }
}
// @from(Start 1656534, End 1656798)
function ZS(A) {
  switch (A) {
    case "default":
      return "text";
    case "plan":
      return "planMode";
    case "acceptEdits":
      return "autoAccept";
    case "bypassPermissions":
      return "error";
    case "dontAsk":
      return "error"
  }
}
// @from(Start 1656803, End 1656805)
kR
// @from(Start 1656807, End 1656810)
Qc0
// @from(Start 1656816, End 1656934)
Zw = L(() => {
  Q2();
  kR = ["acceptEdits", "bypassPermissions", "default", "dontAsk", "plan"], Qc0 = W2.enum(kR)
})
// @from(Start 1656937, End 1657344)
function fB(A, Q, B, G, Z) {
  if (G === "m") throw TypeError("Private method is not writable");
  if (G === "a" && !Z) throw TypeError("Private accessor was defined without a setter");
  if (typeof Q === "function" ? A !== Q || !Z : !Q.has(A)) throw TypeError("Cannot write private member to an object whose class did not declare it");
  return G === "a" ? Z.call(A, B) : Z ? Z.value = B : Q.set(A, B), B
}
// @from(Start 1657346, End 1657686)
function N0(A, Q, B, G) {
  if (B === "a" && !G) throw TypeError("Private accessor was defined without a getter");
  if (typeof Q === "function" ? A !== Q || !G : !Q.has(A)) throw TypeError("Cannot read private member from an object whose class did not declare it");
  return B === "m" ? G : B === "a" ? G.call(A) : G ? G.value : Q.get(A)
}
// @from(Start 1657691, End 1657704)
Kv = () => {}
// @from(Start 1657710, End 1659946)
t64 = (A) => {
    let Q = 0,
      B = [];
    while (Q < A.length) {
      let G = A[Q];
      if (G === "\\") {
        Q++;
        continue
      }
      if (G === "{") {
        B.push({
          type: "brace",
          value: "{"
        }), Q++;
        continue
      }
      if (G === "}") {
        B.push({
          type: "brace",
          value: "}"
        }), Q++;
        continue
      }
      if (G === "[") {
        B.push({
          type: "paren",
          value: "["
        }), Q++;
        continue
      }
      if (G === "]") {
        B.push({
          type: "paren",
          value: "]"
        }), Q++;
        continue
      }
      if (G === ":") {
        B.push({
          type: "separator",
          value: ":"
        }), Q++;
        continue
      }
      if (G === ",") {
        B.push({
          type: "delimiter",
          value: ","
        }), Q++;
        continue
      }
      if (G === '"') {
        let J = "",
          W = !1;
        G = A[++Q];
        while (G !== '"') {
          if (Q === A.length) {
            W = !0;
            break
          }
          if (G === "\\") {
            if (Q++, Q === A.length) {
              W = !0;
              break
            }
            J += G + A[Q], G = A[++Q]
          } else J += G, G = A[++Q]
        }
        if (G = A[++Q], !W) B.push({
          type: "string",
          value: J
        });
        continue
      }
      if (G && /\s/.test(G)) {
        Q++;
        continue
      }
      let I = /[0-9]/;
      if (G && I.test(G) || G === "-" || G === ".") {
        let J = "";
        if (G === "-") J += G, G = A[++Q];
        while (G && I.test(G) || G === ".") J += G, G = A[++Q];
        B.push({
          type: "number",
          value: J
        });
        continue
      }
      let Y = /[a-z]/i;
      if (G && Y.test(G)) {
        let J = "";
        while (G && Y.test(G)) {
          if (Q === A.length) break;
          J += G, G = A[++Q]
        }
        if (J == "true" || J == "false" || J === "null") B.push({
          type: "name",
          value: J
        });
        else {
          Q++;
          continue
        }
        continue
      }
      Q++
    }
    return B
  }
// @from(Start 1659950, End 1660655)
u9A = (A) => {
    if (A.length === 0) return A;
    let Q = A[A.length - 1];
    switch (Q.type) {
      case "separator":
        return A = A.slice(0, A.length - 1), u9A(A);
        break;
      case "number":
        let B = Q.value[Q.value.length - 1];
        if (B === "." || B === "-") return A = A.slice(0, A.length - 1), u9A(A);
      case "string":
        let G = A[A.length - 2];
        if (G?.type === "delimiter") return A = A.slice(0, A.length - 1), u9A(A);
        else if (G?.type === "brace" && G.value === "{") return A = A.slice(0, A.length - 1), u9A(A);
        break;
      case "delimiter":
        return A = A.slice(0, A.length - 1), u9A(A);
        break
    }
    return A
  }
// @from(Start 1660659, End 1661201)
e64 = (A) => {
    let Q = [];
    if (A.map((B) => {
        if (B.type === "brace")
          if (B.value === "{") Q.push("}");
          else Q.splice(Q.lastIndexOf("}"), 1);
        if (B.type === "paren")
          if (B.value === "[") Q.push("]");
          else Q.splice(Q.lastIndexOf("]"), 1)
      }), Q.length > 0) Q.reverse().map((B) => {
      if (B === "}") A.push({
        type: "brace",
        value: "}"
      });
      else if (B === "]") A.push({
        type: "paren",
        value: "]"
      })
    });
    return A
  }
// @from(Start 1661205, End 1661440)
A54 = (A) => {
    let Q = "";
    return A.map((B) => {
      switch (B.type) {
        case "string":
          Q += '"' + B.value + '"';
          break;
        default:
          Q += B.value;
          break
      }
    }), Q
  }
// @from(Start 1661444, End 1661490)
axA = (A) => JSON.parse(A54(e64(u9A(t64(A)))))
// @from(Start 1661496, End 1661510)
tH1 = () => {}
// @from(Start 1661513, End 1661705)
function Dv(A) {
  return typeof A === "object" && A !== null && (("name" in A) && A.name === "AbortError" || ("message" in A) && String(A.message).includes("FetchRequestCanceledException"))
}
// @from(Start 1661710, End 1662226)
MKA = (A) => {
  if (A instanceof Error) return A;
  if (typeof A === "object" && A !== null) {
    try {
      if (Object.prototype.toString.call(A) === "[object Error]") {
        let Q = Error(A.message, A.cause ? {
          cause: A.cause
        } : {});
        if (A.stack) Q.stack = A.stack;
        if (A.cause && !Q.cause) Q.cause = A.cause;
        if (A.name) Q.name = A.name;
        return Q
      }
    } catch {}
    try {
      return Error(JSON.stringify(A))
    } catch {}
  }
  return Error(A)
}
// @from(Start 1662232, End 1662234)
vB
// @from(Start 1662236, End 1662238)
n2
// @from(Start 1662240, End 1662242)
yY
// @from(Start 1662244, End 1662246)
cC
// @from(Start 1662248, End 1662250)
IS
// @from(Start 1662252, End 1662255)
OKA
// @from(Start 1662257, End 1662259)
Zr
// @from(Start 1662261, End 1662264)
RKA
// @from(Start 1662266, End 1662268)
Ir
// @from(Start 1662270, End 1662273)
TKA
// @from(Start 1662275, End 1662278)
PKA
// @from(Start 1662280, End 1662283)
jKA
// @from(Start 1662285, End 1662288)
SKA
// @from(Start 1662294, End 1664193)
pC = L(() => {
  vB = class vB extends Error {};
  n2 = class n2 extends vB {
    constructor(A, Q, B, G) {
      super(`${n2.makeMessage(A,Q,B)}`);
      this.status = A, this.headers = G, this.requestID = G?.get("request-id"), this.error = Q
    }
    static makeMessage(A, Q, B) {
      let G = Q?.message ? typeof Q.message === "string" ? Q.message : JSON.stringify(Q.message) : Q ? JSON.stringify(Q) : B;
      if (A && G) return `${A} ${G}`;
      if (A) return `${A} status code (no body)`;
      if (G) return G;
      return "(no status code or body)"
    }
    static generate(A, Q, B, G) {
      if (!A || !G) return new cC({
        message: B,
        cause: MKA(Q)
      });
      let Z = Q;
      if (A === 400) return new OKA(A, Z, B, G);
      if (A === 401) return new Zr(A, Z, B, G);
      if (A === 403) return new RKA(A, Z, B, G);
      if (A === 404) return new Ir(A, Z, B, G);
      if (A === 409) return new TKA(A, Z, B, G);
      if (A === 422) return new PKA(A, Z, B, G);
      if (A === 429) return new jKA(A, Z, B, G);
      if (A >= 500) return new SKA(A, Z, B, G);
      return new n2(A, Z, B, G)
    }
  };
  yY = class yY extends n2 {
    constructor({
      message: A
    } = {}) {
      super(void 0, void 0, A || "Request was aborted.", void 0)
    }
  };
  cC = class cC extends n2 {
    constructor({
      message: A,
      cause: Q
    }) {
      super(void 0, void 0, A || "Connection error.", void 0);
      if (Q) this.cause = Q
    }
  };
  IS = class IS extends cC {
    constructor({
      message: A
    } = {}) {
      super({
        message: A ?? "Request timed out."
      })
    }
  };
  OKA = class OKA extends n2 {};
  Zr = class Zr extends n2 {};
  RKA = class RKA extends n2 {};
  Ir = class Ir extends n2 {};
  TKA = class TKA extends n2 {};
  PKA = class PKA extends n2 {};
  jKA = class jKA extends n2 {};
  SKA = class SKA extends n2 {}
})
// @from(Start 1664199, End 1664223)
Yr = L(() => {
  pC()
})
// @from(Start 1664226, End 1664450)
function Zc0() {
  if (typeof fetch < "u") return fetch;
  throw Error("`fetch` is not defined as a global; Either pass `fetch` to the client, `new Anthropic({ fetch })` or polyfill the global, `globalThis.fetch = fetch`")
}
// @from(Start 1664452, End 1664690)
function eH1(...A) {
  let Q = globalThis.ReadableStream;
  if (typeof Q > "u") throw Error("`ReadableStream` is not defined as a global; You will need to polyfill it, `globalThis.ReadableStream = ReadableStream`");
  return new Q(...A)
}
// @from(Start 1664692, End 1665034)
function sxA(A) {
  let Q = Symbol.asyncIterator in A ? A[Symbol.asyncIterator]() : A[Symbol.iterator]();
  return eH1({
    start() {},
    async pull(B) {
      let {
        done: G,
        value: Z
      } = await Q.next();
      if (G) B.close();
      else B.enqueue(Z)
    },
    async cancel() {
      await Q.return?.()
    }
  })
}
// @from(Start 1665036, End 1665521)
function _KA(A) {
  if (A[Symbol.asyncIterator]) return A;
  let Q = A.getReader();
  return {
    async next() {
      try {
        let B = await Q.read();
        if (B?.done) Q.releaseLock();
        return B
      } catch (B) {
        throw Q.releaseLock(), B
      }
    },
    async return () {
      let B = Q.cancel();
      return Q.releaseLock(), await B, {
        done: !0,
        value: void 0
      }
    },
    [Symbol.asyncIterator]() {
      return this
    }
  }
}
// @from(Start 1665522, End 1665766)
async function Ic0(A) {
  if (A === null || typeof A !== "object") return;
  if (A[Symbol.asyncIterator]) {
    await A[Symbol.asyncIterator]().return?.();
    return
  }
  let Q = A.getReader(),
    B = Q.cancel();
  Q.releaseLock(), await B
}
// @from(Start 1665768, End 1665932)
function Wc0(A) {
  let Q = 0;
  for (let Z of A) Q += Z.length;
  let B = new Uint8Array(Q),
    G = 0;
  for (let Z of A) B.set(Z, G), G += Z.length;
  return B
}
// @from(Start 1665934, End 1666040)
function kKA(A) {
  let Q;
  return (Yc0 ?? (Q = new globalThis.TextEncoder, Yc0 = Q.encode.bind(Q)))(A)
}
// @from(Start 1666042, End 1666148)
function AC1(A) {
  let Q;
  return (Jc0 ?? (Q = new globalThis.TextDecoder, Jc0 = Q.decode.bind(Q)))(A)
}
// @from(Start 1666153, End 1666156)
Yc0
// @from(Start 1666158, End 1666161)
Jc0
// @from(Start 1666163, End 1667322)
class gm {
  constructor() {
    Iw.set(this, void 0), Yw.set(this, void 0), fB(this, Iw, new Uint8Array, "f"), fB(this, Yw, null, "f")
  }
  decode(A) {
    if (A == null) return [];
    let Q = A instanceof ArrayBuffer ? new Uint8Array(A) : typeof A === "string" ? kKA(A) : A;
    fB(this, Iw, Wc0([N0(this, Iw, "f"), Q]), "f");
    let B = [],
      G;
    while ((G = G54(N0(this, Iw, "f"), N0(this, Yw, "f"))) != null) {
      if (G.carriage && N0(this, Yw, "f") == null) {
        fB(this, Yw, G.index, "f");
        continue
      }
      if (N0(this, Yw, "f") != null && (G.index !== N0(this, Yw, "f") + 1 || G.carriage)) {
        B.push(AC1(N0(this, Iw, "f").subarray(0, N0(this, Yw, "f") - 1))), fB(this, Iw, N0(this, Iw, "f").subarray(N0(this, Yw, "f")), "f"), fB(this, Yw, null, "f");
        continue
      }
      let Z = N0(this, Yw, "f") !== null ? G.preceding - 1 : G.preceding,
        I = AC1(N0(this, Iw, "f").subarray(0, Z));
      B.push(I), fB(this, Iw, N0(this, Iw, "f").subarray(G.index), "f"), fB(this, Yw, null, "f")
    }
    return B
  }
  flush() {
    if (!N0(this, Iw, "f").length) return [];
    return this.decode(`
`)
  }
}
// @from(Start 1667324, End 1667599)
function G54(A, Q) {
  for (let Z = Q ?? 0; Z < A.length; Z++) {
    if (A[Z] === 10) return {
      preceding: Z,
      index: Z + 1,
      carriage: !1
    };
    if (A[Z] === 13) return {
      preceding: Z,
      index: Z + 1,
      carriage: !0
    }
  }
  return null
}
// @from(Start 1667601, End 1667898)
function Xc0(A) {
  for (let G = 0; G < A.length - 1; G++) {
    if (A[G] === 10 && A[G + 1] === 10) return G + 2;
    if (A[G] === 13 && A[G + 1] === 13) return G + 2;
    if (A[G] === 13 && A[G + 1] === 10 && G + 3 < A.length && A[G + 2] === 13 && A[G + 3] === 10) return G + 4
  }
  return -1
}
// @from(Start 1667903, End 1667905)
Iw
// @from(Start 1667907, End 1667909)
Yw
// @from(Start 1667915, End 1668059)
QC1 = L(() => {
  Kv();
  Iw = new WeakMap, Yw = new WeakMap;
  gm.NEWLINE_CHARS = new Set([`
`, "\r"]);
  gm.NEWLINE_REGEXP = /\r\n|[\n\r]/g
})
// @from(Start 1668062, End 1668138)
function rxA(A) {
  if (typeof A !== "object") return {};
  return A ?? {}
}
// @from(Start 1668140, End 1668222)
function Fc0(A) {
  if (!A) return !0;
  for (let Q in A) return !1;
  return !0
}
// @from(Start 1668224, End 1668298)
function Kc0(A, Q) {
  return Object.prototype.hasOwnProperty.call(A, Q)
}
// @from(Start 1668303, End 1668306)
Z54
// @from(Start 1668308, End 1668349)
Vc0 = (A) => {
    return Z54.test(A)
  }
// @from(Start 1668353, End 1668395)
BC1 = (A) => (BC1 = Array.isArray, BC1(A))
// @from(Start 1668399, End 1668402)
GC1
// @from(Start 1668404, End 1668598)
Dc0 = (A, Q) => {
    if (typeof Q !== "number" || !Number.isInteger(Q)) throw new vB(`${A} must be an integer`);
    if (Q < 0) throw new vB(`${A} must be a positive integer`);
    return Q
  }
// @from(Start 1668602, End 1668694)
oxA = (A) => {
    try {
      return JSON.parse(A)
    } catch (Q) {
      return
    }
  }
// @from(Start 1668700, End 1668767)
Jr = L(() => {
  pC();
  Z54 = /^[a-z][a-z0-9+.-]*:/i, GC1 = BC1
})
// @from(Start 1668770, End 1668787)
function yKA() {}
// @from(Start 1668789, End 1668882)
function txA(A, Q, B) {
  if (!Q || exA[A] > exA[B]) return yKA;
  else return Q[A].bind(Q)
}
// @from(Start 1668884, End 1669198)
function qF(A) {
  let Q = A.logger,
    B = A.logLevel ?? "off";
  if (!Q) return I54;
  let G = Hc0.get(Q);
  if (G && G[0] === B) return G[1];
  let Z = {
    error: txA("error", Q, B),
    warn: txA("warn", Q, B),
    info: txA("info", Q, B),
    debug: txA("debug", Q, B)
  };
  return Hc0.set(Q, [B, Z]), Z
}
// @from(Start 1669203, End 1669206)
exA
// @from(Start 1669208, End 1669403)
ZC1 = (A, Q, B) => {
    if (!A) return;
    if (Kc0(exA, A)) return A;
    qF(B).warn(`${Q} was set to ${JSON.stringify(A)}, expected one of ${JSON.stringify(Object.keys(exA))}`);
    return
  }
// @from(Start 1669407, End 1669410)
I54
// @from(Start 1669412, End 1669415)
Hc0
// @from(Start 1669417, End 1669980)
Hv = (A) => {
    if (A.options) A.options = {
      ...A.options
    }, delete A.options.headers;
    if (A.headers) A.headers = Object.fromEntries((A.headers instanceof Headers ? [...A.headers] : Object.entries(A.headers)).map(([Q, B]) => [Q, Q.toLowerCase() === "x-api-key" || Q.toLowerCase() === "authorization" || Q.toLowerCase() === "cookie" || Q.toLowerCase() === "set-cookie" ? "***" : B]));
    if ("retryOfRequestLogID" in A) {
      if (A.retryOfRequestLogID) A.retryOf = A.retryOfRequestLogID;
      delete A.retryOfRequestLogID
    }
    return A
  }
// @from(Start 1669986, End 1670194)
AvA = L(() => {
  Jr();
  exA = {
    off: 0,
    error: 200,
    warn: 300,
    info: 400,
    debug: 500
  };
  I54 = {
    error: yKA,
    warn: yKA,
    info: yKA,
    debug: yKA
  }, Hc0 = new WeakMap
})
// @from(Start 1670196, End 1670836)
async function* Y54(A, Q) {
  if (!A.body) {
    if (Q.abort(), typeof globalThis.navigator < "u" && globalThis.navigator.product === "ReactNative") throw new vB("The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api");
    throw new vB("Attempted to iterate over a response with no body")
  }
  let B = new Cc0,
    G = new gm,
    Z = _KA(A.body);
  for await (let I of J54(Z)) for (let Y of G.decode(I)) {
    let J = B.decode(Y);
    if (J) yield J
  }
  for (let I of G.flush()) {
    let Y = B.decode(I);
    if (Y) yield Y
  }
}
// @from(Start 1670837, End 1671239)
async function* J54(A) {
  let Q = new Uint8Array;
  for await (let B of A) {
    if (B == null) continue;
    let G = B instanceof ArrayBuffer ? new Uint8Array(B) : typeof B === "string" ? kKA(B) : B,
      Z = new Uint8Array(Q.length + G.length);
    Z.set(Q), Z.set(G, Q.length), Q = Z;
    let I;
    while ((I = Xc0(Q)) !== -1) yield Q.slice(0, I), Q = Q.slice(I)
  }
  if (Q.length > 0) yield Q
}
// @from(Start 1671240, End 1671908)
class Cc0 {
  constructor() {
    this.event = null, this.data = [], this.chunks = []
  }
  decode(A) {
    if (A.endsWith("\r")) A = A.substring(0, A.length - 1);
    if (!A) {
      if (!this.event && !this.data.length) return null;
      let Z = {
        event: this.event,
        data: this.data.join(`
`),
        raw: this.chunks
      };
      return this.event = null, this.data = [], this.chunks = [], Z
    }
    if (this.chunks.push(A), A.startsWith(":")) return null;
    let [Q, B, G] = W54(A, ":");
    if (G.startsWith(" ")) G = G.substring(1);
    if (Q === "event") this.event = G;
    else if (Q === "data") this.data.push(G);
    return null
  }
}
// @from(Start 1671910, End 1672051)
function W54(A, Q) {
  let B = A.indexOf(Q);
  if (B !== -1) return [A.substring(0, B), Q, A.substring(B + Q.length)];
  return [A, "", ""]
}
// @from(Start 1672056, End 1672059)
xKA
// @from(Start 1672061, End 1672063)
lC
// @from(Start 1672069, End 1675419)
IC1 = L(() => {
  Kv();
  pC();
  QC1();
  Jr();
  AvA();
  pC();
  lC = class lC {
    constructor(A, Q, B) {
      this.iterator = A, xKA.set(this, void 0), this.controller = Q, fB(this, xKA, B, "f")
    }
    static fromSSEResponse(A, Q, B) {
      let G = !1,
        Z = B ? qF(B) : console;
      async function* I() {
        if (G) throw new vB("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
        G = !0;
        let Y = !1;
        try {
          for await (let J of Y54(A, Q)) {
            if (J.event === "completion") try {
              yield JSON.parse(J.data)
            } catch (W) {
              throw Z.error("Could not parse message into JSON:", J.data), Z.error("From chunk:", J.raw), W
            }
            if (J.event === "message_start" || J.event === "message_delta" || J.event === "message_stop" || J.event === "content_block_start" || J.event === "content_block_delta" || J.event === "content_block_stop") try {
              yield JSON.parse(J.data)
            } catch (W) {
              throw Z.error("Could not parse message into JSON:", J.data), Z.error("From chunk:", J.raw), W
            }
            if (J.event === "ping") continue;
            if (J.event === "error") throw new n2(void 0, oxA(J.data) ?? J.data, void 0, A.headers)
          }
          Y = !0
        } catch (J) {
          if (Dv(J)) return;
          throw J
        } finally {
          if (!Y) Q.abort()
        }
      }
      return new lC(I, Q, B)
    }
    static fromReadableStream(A, Q, B) {
      let G = !1;
      async function* Z() {
        let Y = new gm,
          J = _KA(A);
        for await (let W of J) for (let X of Y.decode(W)) yield X;
        for (let W of Y.flush()) yield W
      }
      async function* I() {
        if (G) throw new vB("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
        G = !0;
        let Y = !1;
        try {
          for await (let J of Z()) {
            if (Y) continue;
            if (J) yield JSON.parse(J)
          }
          Y = !0
        } catch (J) {
          if (Dv(J)) return;
          throw J
        } finally {
          if (!Y) Q.abort()
        }
      }
      return new lC(I, Q, B)
    } [(xKA = new WeakMap, Symbol.asyncIterator)]() {
      return this.iterator()
    }
    tee() {
      let A = [],
        Q = [],
        B = this.iterator(),
        G = (Z) => {
          return {
            next: () => {
              if (Z.length === 0) {
                let I = B.next();
                A.push(I), Q.push(I)
              }
              return Z.shift()
            }
          }
        };
      return [new lC(() => G(A), this.controller, N0(this, xKA, "f")), new lC(() => G(Q), this.controller, N0(this, xKA, "f"))]
    }
    toReadableStream() {
      let A = this,
        Q;
      return eH1({
        async start() {
          Q = A[Symbol.asyncIterator]()
        },
        async pull(B) {
          try {
            let {
              value: G,
              done: Z
            } = await Q.next();
            if (Z) return B.close();
            let I = kKA(JSON.stringify(G) + `
`);
            B.enqueue(I)
          } catch (G) {
            B.error(G)
          }
        },
        async cancel() {
          await Q.return?.()
        }
      })
    }
  }
})
// @from(Start 1675425, End 1675451)
QvA = L(() => {
  IC1()
})
// @from(Start 1675454, End 1675735)
function YC1(A, Q) {
  if (!Q || !("parse" in (Q.output_format ?? {}))) return {
    ...A,
    content: A.content.map((B) => {
      if (B.type === "text") return {
        ...B,
        parsed: null
      };
      return B
    }),
    parsed_output: null
  };
  return JC1(A, Q)
}
// @from(Start 1675737, End 1676056)
function JC1(A, Q) {
  let B = null,
    G = A.content.map((Z) => {
      if (Z.type === "text") {
        let I = X54(Q, Z.text);
        if (B === null) B = I;
        return {
          ...Z,
          parsed: I
        }
      }
      return Z
    });
  return {
    ...A,
    content: G,
    parsed_output: B
  }
}
// @from(Start 1676058, End 1676322)
function X54(A, Q) {
  if (A.output_format?.type !== "json_schema") return null;
  try {
    if ("parse" in A.output_format) return A.output_format.parse(Q);
    return JSON.parse(Q)
  } catch (B) {
    throw new vB(`Failed to parse structured output: ${B}`)
  }
}
// @from(Start 1676327, End 1676352)
WC1 = L(() => {
  pC()
})
// @from(Start 1676355, End 1676466)
function $c0(A) {
  return A.type === "tool_use" || A.type === "server_tool_use" || A.type === "mcp_tool_use"
}
// @from(Start 1676468, End 1676486)
function wc0(A) {}
// @from(Start 1676491, End 1676493)
oN
// @from(Start 1676495, End 1676497)
um
// @from(Start 1676499, End 1676502)
m9A
// @from(Start 1676504, End 1676507)
vKA
// @from(Start 1676509, End 1676512)
BvA
// @from(Start 1676514, End 1676517)
bKA
// @from(Start 1676519, End 1676522)
fKA
// @from(Start 1676524, End 1676527)
GvA
// @from(Start 1676529, End 1676532)
hKA
// @from(Start 1676534, End 1676536)
Cv
// @from(Start 1676538, End 1676541)
gKA
// @from(Start 1676543, End 1676546)
ZvA
// @from(Start 1676548, End 1676551)
IvA
// @from(Start 1676553, End 1676556)
d9A
// @from(Start 1676558, End 1676561)
YvA
// @from(Start 1676563, End 1676566)
JvA
// @from(Start 1676568, End 1676571)
XC1
// @from(Start 1676573, End 1676576)
Ec0
// @from(Start 1676578, End 1676581)
WvA
// @from(Start 1676583, End 1676586)
VC1
// @from(Start 1676588, End 1676591)
FC1
// @from(Start 1676593, End 1676596)
KC1
// @from(Start 1676598, End 1676601)
zc0
// @from(Start 1676603, End 1676621)
Uc0 = "__json_buf"
// @from(Start 1676625, End 1676627)
Wr
// @from(Start 1676633, End 1690115)
DC1 = L(() => {
  Kv();
  tH1();
  Yr();
  QvA();
  WC1();
  Wr = class Wr {
    constructor(A) {
      oN.add(this), this.messages = [], this.receivedMessages = [], um.set(this, void 0), m9A.set(this, null), this.controller = new AbortController, vKA.set(this, void 0), BvA.set(this, () => {}), bKA.set(this, () => {}), fKA.set(this, void 0), GvA.set(this, () => {}), hKA.set(this, () => {}), Cv.set(this, {}), gKA.set(this, !1), ZvA.set(this, !1), IvA.set(this, !1), d9A.set(this, !1), YvA.set(this, void 0), JvA.set(this, void 0), WvA.set(this, (Q) => {
        if (fB(this, ZvA, !0, "f"), Dv(Q)) Q = new yY;
        if (Q instanceof yY) return fB(this, IvA, !0, "f"), this._emit("abort", Q);
        if (Q instanceof vB) return this._emit("error", Q);
        if (Q instanceof Error) {
          let B = new vB(Q.message);
          return B.cause = Q, this._emit("error", B)
        }
        return this._emit("error", new vB(String(Q)))
      }), fB(this, vKA, new Promise((Q, B) => {
        fB(this, BvA, Q, "f"), fB(this, bKA, B, "f")
      }), "f"), fB(this, fKA, new Promise((Q, B) => {
        fB(this, GvA, Q, "f"), fB(this, hKA, B, "f")
      }), "f"), N0(this, vKA, "f").catch(() => {}), N0(this, fKA, "f").catch(() => {}), fB(this, m9A, A, "f")
    }
    get response() {
      return N0(this, YvA, "f")
    }
    get request_id() {
      return N0(this, JvA, "f")
    }
    async withResponse() {
      let A = await N0(this, vKA, "f");
      if (!A) throw Error("Could not resolve a `Response` object");
      return {
        data: this,
        response: A,
        request_id: A.headers.get("request-id")
      }
    }
    static fromReadableStream(A) {
      let Q = new Wr(null);
      return Q._run(() => Q._fromReadableStream(A)), Q
    }
    static createMessage(A, Q, B) {
      let G = new Wr(Q);
      for (let Z of Q.messages) G._addMessageParam(Z);
      return fB(G, m9A, {
        ...Q,
        stream: !0
      }, "f"), G._run(() => G._createMessage(A, {
        ...Q,
        stream: !0
      }, {
        ...B,
        headers: {
          ...B?.headers,
          "X-Stainless-Helper-Method": "stream"
        }
      })), G
    }
    _run(A) {
      A().then(() => {
        this._emitFinal(), this._emit("end")
      }, N0(this, WvA, "f"))
    }
    _addMessageParam(A) {
      this.messages.push(A)
    }
    _addMessage(A, Q = !0) {
      if (this.receivedMessages.push(A), Q) this._emit("message", A)
    }
    async _createMessage(A, Q, B) {
      let G = B?.signal,
        Z;
      if (G) {
        if (G.aborted) this.controller.abort();
        Z = this.controller.abort.bind(this.controller), G.addEventListener("abort", Z)
      }
      try {
        N0(this, oN, "m", VC1).call(this);
        let {
          response: I,
          data: Y
        } = await A.create({
          ...Q,
          stream: !0
        }, {
          ...B,
          signal: this.controller.signal
        }).withResponse();
        this._connected(I);
        for await (let J of Y) N0(this, oN, "m", FC1).call(this, J);
        if (Y.controller.signal?.aborted) throw new yY;
        N0(this, oN, "m", KC1).call(this)
      } finally {
        if (G && Z) G.removeEventListener("abort", Z)
      }
    }
    _connected(A) {
      if (this.ended) return;
      fB(this, YvA, A, "f"), fB(this, JvA, A?.headers.get("request-id"), "f"), N0(this, BvA, "f").call(this, A), this._emit("connect")
    }
    get ended() {
      return N0(this, gKA, "f")
    }
    get errored() {
      return N0(this, ZvA, "f")
    }
    get aborted() {
      return N0(this, IvA, "f")
    }
    abort() {
      this.controller.abort()
    }
    on(A, Q) {
      return (N0(this, Cv, "f")[A] || (N0(this, Cv, "f")[A] = [])).push({
        listener: Q
      }), this
    }
    off(A, Q) {
      let B = N0(this, Cv, "f")[A];
      if (!B) return this;
      let G = B.findIndex((Z) => Z.listener === Q);
      if (G >= 0) B.splice(G, 1);
      return this
    }
    once(A, Q) {
      return (N0(this, Cv, "f")[A] || (N0(this, Cv, "f")[A] = [])).push({
        listener: Q,
        once: !0
      }), this
    }
    emitted(A) {
      return new Promise((Q, B) => {
        if (fB(this, d9A, !0, "f"), A !== "error") this.once("error", B);
        this.once(A, Q)
      })
    }
    async done() {
      fB(this, d9A, !0, "f"), await N0(this, fKA, "f")
    }
    get currentMessage() {
      return N0(this, um, "f")
    }
    async finalMessage() {
      return await this.done(), N0(this, oN, "m", XC1).call(this)
    }
    async finalText() {
      return await this.done(), N0(this, oN, "m", Ec0).call(this)
    }
    _emit(A, ...Q) {
      if (N0(this, gKA, "f")) return;
      if (A === "end") fB(this, gKA, !0, "f"), N0(this, GvA, "f").call(this);
      let B = N0(this, Cv, "f")[A];
      if (B) N0(this, Cv, "f")[A] = B.filter((G) => !G.once), B.forEach(({
        listener: G
      }) => G(...Q));
      if (A === "abort") {
        let G = Q[0];
        if (!N0(this, d9A, "f") && !B?.length) Promise.reject(G);
        N0(this, bKA, "f").call(this, G), N0(this, hKA, "f").call(this, G), this._emit("end");
        return
      }
      if (A === "error") {
        let G = Q[0];
        if (!N0(this, d9A, "f") && !B?.length) Promise.reject(G);
        N0(this, bKA, "f").call(this, G), N0(this, hKA, "f").call(this, G), this._emit("end")
      }
    }
    _emitFinal() {
      if (this.receivedMessages.at(-1)) this._emit("finalMessage", N0(this, oN, "m", XC1).call(this))
    }
    async _fromReadableStream(A, Q) {
      let B = Q?.signal,
        G;
      if (B) {
        if (B.aborted) this.controller.abort();
        G = this.controller.abort.bind(this.controller), B.addEventListener("abort", G)
      }
      try {
        N0(this, oN, "m", VC1).call(this), this._connected(null);
        let Z = lC.fromReadableStream(A, this.controller);
        for await (let I of Z) N0(this, oN, "m", FC1).call(this, I);
        if (Z.controller.signal?.aborted) throw new yY;
        N0(this, oN, "m", KC1).call(this)
      } finally {
        if (B && G) B.removeEventListener("abort", G)
      }
    } [(um = new WeakMap, m9A = new WeakMap, vKA = new WeakMap, BvA = new WeakMap, bKA = new WeakMap, fKA = new WeakMap, GvA = new WeakMap, hKA = new WeakMap, Cv = new WeakMap, gKA = new WeakMap, ZvA = new WeakMap, IvA = new WeakMap, d9A = new WeakMap, YvA = new WeakMap, JvA = new WeakMap, WvA = new WeakMap, oN = new WeakSet, XC1 = function() {
      if (this.receivedMessages.length === 0) throw new vB("stream ended without producing a Message with role=assistant");
      return this.receivedMessages.at(-1)
    }, Ec0 = function() {
      if (this.receivedMessages.length === 0) throw new vB("stream ended without producing a Message with role=assistant");
      let Q = this.receivedMessages.at(-1).content.filter((B) => B.type === "text").map((B) => B.text);
      if (Q.length === 0) throw new vB("stream ended without producing a content block with type=text");
      return Q.join(" ")
    }, VC1 = function() {
      if (this.ended) return;
      fB(this, um, void 0, "f")
    }, FC1 = function(Q) {
      if (this.ended) return;
      let B = N0(this, oN, "m", zc0).call(this, Q);
      switch (this._emit("streamEvent", Q, B), Q.type) {
        case "content_block_delta": {
          let G = B.content.at(-1);
          switch (Q.delta.type) {
            case "text_delta": {
              if (G.type === "text") this._emit("text", Q.delta.text, G.text || "");
              break
            }
            case "citations_delta": {
              if (G.type === "text") this._emit("citation", Q.delta.citation, G.citations ?? []);
              break
            }
            case "input_json_delta": {
              if ($c0(G) && G.input) this._emit("inputJson", Q.delta.partial_json, G.input);
              break
            }
            case "thinking_delta": {
              if (G.type === "thinking") this._emit("thinking", Q.delta.thinking, G.thinking);
              break
            }
            case "signature_delta": {
              if (G.type === "thinking") this._emit("signature", G.signature);
              break
            }
            default:
              wc0(Q.delta)
          }
          break
        }
        case "message_stop": {
          this._addMessageParam(B), this._addMessage(YC1(B, N0(this, m9A, "f")), !0);
          break
        }
        case "content_block_stop": {
          this._emit("contentBlock", B.content.at(-1));
          break
        }
        case "message_start": {
          fB(this, um, B, "f");
          break
        }
        case "content_block_start":
        case "message_delta":
          break
      }
    }, KC1 = function() {
      if (this.ended) throw new vB("stream has ended, this shouldn't happen");
      let Q = N0(this, um, "f");
      if (!Q) throw new vB("request ended without sending any chunks");
      return fB(this, um, void 0, "f"), YC1(Q, N0(this, m9A, "f"))
    }, zc0 = function(Q) {
      let B = N0(this, um, "f");
      if (Q.type === "message_start") {
        if (B) throw new vB(`Unexpected event order, got ${Q.type} before receiving "message_stop"`);
        return Q.message
      }
      if (!B) throw new vB(`Unexpected event order, got ${Q.type} before "message_start"`);
      switch (Q.type) {
        case "message_stop":
          return B;
        case "message_delta":
          if (B.container = Q.delta.container, B.stop_reason = Q.delta.stop_reason, B.stop_sequence = Q.delta.stop_sequence, B.usage.output_tokens = Q.usage.output_tokens, B.context_management = Q.context_management, Q.usage.input_tokens != null) B.usage.input_tokens = Q.usage.input_tokens;
          if (Q.usage.cache_creation_input_tokens != null) B.usage.cache_creation_input_tokens = Q.usage.cache_creation_input_tokens;
          if (Q.usage.cache_read_input_tokens != null) B.usage.cache_read_input_tokens = Q.usage.cache_read_input_tokens;
          if (Q.usage.server_tool_use != null) B.usage.server_tool_use = Q.usage.server_tool_use;
          return B;
        case "content_block_start":
          return B.content.push(Q.content_block), B;
        case "content_block_delta": {
          let G = B.content.at(Q.index);
          switch (Q.delta.type) {
            case "text_delta": {
              if (G?.type === "text") B.content[Q.index] = {
                ...G,
                text: (G.text || "") + Q.delta.text
              };
              break
            }
            case "citations_delta": {
              if (G?.type === "text") B.content[Q.index] = {
                ...G,
                citations: [...G.citations ?? [], Q.delta.citation]
              };
              break
            }
            case "input_json_delta": {
              if (G && $c0(G)) {
                let Z = G[Uc0] || "";
                Z += Q.delta.partial_json;
                let I = {
                  ...G
                };
                if (Object.defineProperty(I, Uc0, {
                    value: Z,
                    enumerable: !1,
                    writable: !0
                  }), Z) try {
                  I.input = axA(Z)
                } catch (Y) {
                  let J = new vB(`Unable to parse tool parameter JSON from model. Please retry your request or adjust your prompt. Error: ${Y}. JSON: ${Z}`);
                  N0(this, WvA, "f").call(this, J)
                }
                B.content[Q.index] = I
              }
              break
            }
            case "thinking_delta": {
              if (G?.type === "thinking") B.content[Q.index] = {
                ...G,
                thinking: G.thinking + Q.delta.thinking
              };
              break
            }
            case "signature_delta": {
              if (G?.type === "thinking") B.content[Q.index] = {
                ...G,
                signature: Q.delta.signature
              };
              break
            }
            default:
              wc0(Q.delta)
          }
          return B
        }
        case "content_block_stop":
          return B
      }
    }, Symbol.asyncIterator)]() {
      let A = [],
        Q = [],
        B = !1;
      return this.on("streamEvent", (G) => {
        let Z = Q.shift();
        if (Z) Z.resolve(G);
        else A.push(G)
      }), this.on("end", () => {
        B = !0;
        for (let G of Q) G.resolve(void 0);
        Q.length = 0
      }), this.on("abort", (G) => {
        B = !0;
        for (let Z of Q) Z.reject(G);
        Q.length = 0
      }), this.on("error", (G) => {
        B = !0;
        for (let Z of Q) Z.reject(G);
        Q.length = 0
      }), {
        next: async () => {
          if (!A.length) {
            if (B) return {
              value: void 0,
              done: !0
            };
            return new Promise((Z, I) => Q.push({
              resolve: Z,
              reject: I
            })).then((Z) => Z ? {
              value: Z,
              done: !1
            } : {
              value: void 0,
              done: !0
            })
          }
          return {
            value: A.shift(),
            done: !1
          }
        },
        return: async () => {
          return this.abort(), {
            value: void 0,
            done: !0
          }
        }
      }
    }
    toReadableStream() {
      return new lC(this[Symbol.asyncIterator].bind(this), this.controller).toReadableStream()
    }
  }
})
// @from(Start 1690121, End 1690132)
iK = "Glob"
// @from(Start 1690136, End 1690674)
HC1 = `- Fast file pattern matching tool that works with any codebase size
- Supports glob patterns like "**/*.js" or "src/**/*.ts"
- Returns matching file paths sorted by modification time
- Use this tool when you need to find files by name patterns
- When you are doing an open ended search that may require multiple rounds of globbing and grepping, use the Agent tool instead
- You can call multiple tools in a single response. It is always better to speculatively perform multiple searches in parallel if they are potentially useful.`
// @from(Start 1690680, End 1690691)
A6 = "Task"
// @from(Start 1690694, End 1691612)
function CC1() {
  return `A powerful search tool built on ripgrep

  Usage:
  - ALWAYS use ${xY} for search tasks. NEVER invoke \`grep\` or \`rg\` as a ${C9} command. The ${xY} tool has been optimized for correct permissions and access.
  - Supports full regex syntax (e.g., "log.*Error", "function\\s+\\w+")
  - Filter files with glob parameter (e.g., "*.js", "**/*.tsx") or type parameter (e.g., "js", "py", "rust")
  - Output modes: "content" shows matching lines, "files_with_matches" shows only file paths (default), "count" shows match counts
  - Use ${A6} tool for open-ended searches requiring multiple rounds
  - Pattern syntax: Uses ripgrep (not grep) - literal braces need escaping (use \`interface\\{\\}\` to find \`interface{}\` in Go code)
  - Multiline matching: By default patterns match within single lines only. For cross-line patterns like \`struct \\{[\\s\\S]*?field\`, use \`multiline: true\`
`
}
// @from(Start 1691617, End 1691628)
xY = "Grep"
// @from(Start 1691634, End 1691647)
yR = () => {}
// @from(Start 1691653, End 1691665)
wX = "Write"
// @from(Start 1691669, End 1691672)
qc0
// @from(Start 1691678, End 1692337)
YS = L(() => {
  wF();
  qc0 = `Writes a file to the local filesystem.

Usage:
- This tool will overwrite the existing file if there is one at the provided path.
- If this is an existing file, you MUST use the ${d5} tool first to read the file's contents. This tool will fail if you did not read the file first.
- ALWAYS prefer editing existing files in the codebase. NEVER write new files unless explicitly required.
- NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
- Only use emojis if the user explicitly requests it. Avoid writing emojis to files unless asked.`
})
// @from(Start 1692343, End 1692362)
JS = "NotebookEdit"
// @from(Start 1692365, End 1692551)
function XvA() {
  let A = new Date,
    Q = A.getFullYear(),
    B = String(A.getMonth() + 1).padStart(2, "0"),
    G = String(A.getDate()).padStart(2, "0");
  return `${Q}-${B}-${G}`
}
// @from(Start 1692553, End 1693918)
function Nc0() {
  return `
- Allows Claude to search the web and use the results to inform responses
- Provides up-to-date information for current events and recent data
- Returns search result information formatted as search result blocks, including links as markdown hyperlinks
- Use this tool for accessing information beyond Claude's knowledge cutoff
- Searches are performed automatically within a single API call

CRITICAL REQUIREMENT - You MUST follow this:
  - After answering the user's question, you MUST include a "Sources:" section at the end of your response
  - In the Sources section, list all relevant URLs from the search results as markdown hyperlinks: [Title](URL)
  - This is MANDATORY - never skip including sources in your response
  - Example format:

    [Your answer here]

    Sources:
    - [Source Title 1](https://example.com/1)
    - [Source Title 2](https://example.com/2)

Usage notes:
  - Domain filtering is supported to include or block specific websites
  - Web search is only available in the US

IMPORTANT - Use the correct year in search queries:
  - Today's date is ${XvA()}. You MUST use this year when searching for recent information, documentation, or current events.
  - Example: If today is 2025-07-15 and the user asks for "latest React docs", search for "React documentation 2025", NOT "React documentation 2024"
`
}
// @from(Start 1693923, End 1693939)
WS = "WebSearch"
// @from(Start 1693945, End 1693959)
c9A = () => {}
// @from(Start 1693965, End 1703337)
VA = z((O54) => {
  var uKA = Symbol.for("react.element"),
    V54 = Symbol.for("react.portal"),
    F54 = Symbol.for("react.fragment"),
    K54 = Symbol.for("react.strict_mode"),
    D54 = Symbol.for("react.profiler"),
    H54 = Symbol.for("react.provider"),
    C54 = Symbol.for("react.context"),
    E54 = Symbol.for("react.forward_ref"),
    z54 = Symbol.for("react.suspense"),
    U54 = Symbol.for("react.memo"),
    $54 = Symbol.for("react.lazy"),
    Lc0 = Symbol.iterator;

  function w54(A) {
    if (A === null || typeof A !== "object") return null;
    return A = Lc0 && A[Lc0] || A["@@iterator"], typeof A === "function" ? A : null
  }
  var Rc0 = {
      isMounted: function() {
        return !1
      },
      enqueueForceUpdate: function() {},
      enqueueReplaceState: function() {},
      enqueueSetState: function() {}
    },
    Tc0 = Object.assign,
    Pc0 = {};

  function p9A(A, Q, B) {
    this.props = A, this.context = Q, this.refs = Pc0, this.updater = B || Rc0
  }
  p9A.prototype.isReactComponent = {};
  p9A.prototype.setState = function(A, Q) {
    if (typeof A !== "object" && typeof A !== "function" && A != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, A, Q, "setState")
  };
  p9A.prototype.forceUpdate = function(A) {
    this.updater.enqueueForceUpdate(this, A, "forceUpdate")
  };

  function jc0() {}
  jc0.prototype = p9A.prototype;

  function zC1(A, Q, B) {
    this.props = A, this.context = Q, this.refs = Pc0, this.updater = B || Rc0
  }
  var UC1 = zC1.prototype = new jc0;
  UC1.constructor = zC1;
  Tc0(UC1, p9A.prototype);
  UC1.isPureReactComponent = !0;
  var Mc0 = Array.isArray,
    Sc0 = Object.prototype.hasOwnProperty,
    $C1 = {
      current: null
    },
    _c0 = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    };

  function kc0(A, Q, B) {
    var G, Z = {},
      I = null,
      Y = null;
    if (Q != null)
      for (G in Q.ref !== void 0 && (Y = Q.ref), Q.key !== void 0 && (I = "" + Q.key), Q) Sc0.call(Q, G) && !_c0.hasOwnProperty(G) && (Z[G] = Q[G]);
    var J = arguments.length - 2;
    if (J === 1) Z.children = B;
    else if (1 < J) {
      for (var W = Array(J), X = 0; X < J; X++) W[X] = arguments[X + 2];
      Z.children = W
    }
    if (A && A.defaultProps)
      for (G in J = A.defaultProps, J) Z[G] === void 0 && (Z[G] = J[G]);
    return {
      $$typeof: uKA,
      type: A,
      key: I,
      ref: Y,
      props: Z,
      _owner: $C1.current
    }
  }

  function q54(A, Q) {
    return {
      $$typeof: uKA,
      type: A.type,
      key: Q,
      ref: A.ref,
      props: A.props,
      _owner: A._owner
    }
  }

  function wC1(A) {
    return typeof A === "object" && A !== null && A.$$typeof === uKA
  }

  function N54(A) {
    var Q = {
      "=": "=0",
      ":": "=2"
    };
    return "$" + A.replace(/[=:]/g, function(B) {
      return Q[B]
    })
  }
  var Oc0 = /\/+/g;

  function EC1(A, Q) {
    return typeof A === "object" && A !== null && A.key != null ? N54("" + A.key) : Q.toString(36)
  }

  function FvA(A, Q, B, G, Z) {
    var I = typeof A;
    if (I === "undefined" || I === "boolean") A = null;
    var Y = !1;
    if (A === null) Y = !0;
    else switch (I) {
      case "string":
      case "number":
        Y = !0;
        break;
      case "object":
        switch (A.$$typeof) {
          case uKA:
          case V54:
            Y = !0
        }
    }
    if (Y) return Y = A, Z = Z(Y), A = G === "" ? "." + EC1(Y, 0) : G, Mc0(Z) ? (B = "", A != null && (B = A.replace(Oc0, "$&/") + "/"), FvA(Z, Q, B, "", function(X) {
      return X
    })) : Z != null && (wC1(Z) && (Z = q54(Z, B + (!Z.key || Y && Y.key === Z.key ? "" : ("" + Z.key).replace(Oc0, "$&/") + "/") + A)), Q.push(Z)), 1;
    if (Y = 0, G = G === "" ? "." : G + ":", Mc0(A))
      for (var J = 0; J < A.length; J++) {
        I = A[J];
        var W = G + EC1(I, J);
        Y += FvA(I, Q, B, W, Z)
      } else if (W = w54(A), typeof W === "function")
        for (A = W.call(A), J = 0; !(I = A.next()).done;) I = I.value, W = G + EC1(I, J++), Y += FvA(I, Q, B, W, Z);
      else if (I === "object") throw Q = String(A), Error("Objects are not valid as a React child (found: " + (Q === "[object Object]" ? "object with keys {" + Object.keys(A).join(", ") + "}" : Q) + "). If you meant to render a collection of children, use an array instead.");
    return Y
  }

  function VvA(A, Q, B) {
    if (A == null) return A;
    var G = [],
      Z = 0;
    return FvA(A, G, "", "", function(I) {
      return Q.call(B, I, Z++)
    }), G
  }

  function L54(A) {
    if (A._status === -1) {
      var Q = A._result;
      Q = Q(), Q.then(function(B) {
        if (A._status === 0 || A._status === -1) A._status = 1, A._result = B
      }, function(B) {
        if (A._status === 0 || A._status === -1) A._status = 2, A._result = B
      }), A._status === -1 && (A._status = 0, A._result = Q)
    }
    if (A._status === 1) return A._result.default;
    throw A._result
  }
  var iC = {
      current: null
    },
    KvA = {
      transition: null
    },
    M54 = {
      ReactCurrentDispatcher: iC,
      ReactCurrentBatchConfig: KvA,
      ReactCurrentOwner: $C1
    };

  function yc0() {
    throw Error("act(...) is not supported in production builds of React.")
  }
  O54.Children = {
    map: VvA,
    forEach: function(A, Q, B) {
      VvA(A, function() {
        Q.apply(this, arguments)
      }, B)
    },
    count: function(A) {
      var Q = 0;
      return VvA(A, function() {
        Q++
      }), Q
    },
    toArray: function(A) {
      return VvA(A, function(Q) {
        return Q
      }) || []
    },
    only: function(A) {
      if (!wC1(A)) throw Error("React.Children.only expected to receive a single React element child.");
      return A
    }
  };
  O54.Component = p9A;
  O54.Fragment = F54;
  O54.Profiler = D54;
  O54.PureComponent = zC1;
  O54.StrictMode = K54;
  O54.Suspense = z54;
  O54.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = M54;
  O54.act = yc0;
  O54.cloneElement = function(A, Q, B) {
    if (A === null || A === void 0) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + A + ".");
    var G = Tc0({}, A.props),
      Z = A.key,
      I = A.ref,
      Y = A._owner;
    if (Q != null) {
      if (Q.ref !== void 0 && (I = Q.ref, Y = $C1.current), Q.key !== void 0 && (Z = "" + Q.key), A.type && A.type.defaultProps) var J = A.type.defaultProps;
      for (W in Q) Sc0.call(Q, W) && !_c0.hasOwnProperty(W) && (G[W] = Q[W] === void 0 && J !== void 0 ? J[W] : Q[W])
    }
    var W = arguments.length - 2;
    if (W === 1) G.children = B;
    else if (1 < W) {
      J = Array(W);
      for (var X = 0; X < W; X++) J[X] = arguments[X + 2];
      G.children = J
    }
    return {
      $$typeof: uKA,
      type: A.type,
      key: Z,
      ref: I,
      props: G,
      _owner: Y
    }
  };
  O54.createContext = function(A) {
    return A = {
      $$typeof: C54,
      _currentValue: A,
      _currentValue2: A,
      _threadCount: 0,
      Provider: null,
      Consumer: null,
      _defaultValue: null,
      _globalName: null
    }, A.Provider = {
      $$typeof: H54,
      _context: A
    }, A.Consumer = A
  };
  O54.createElement = kc0;
  O54.createFactory = function(A) {
    var Q = kc0.bind(null, A);
    return Q.type = A, Q
  };
  O54.createRef = function() {
    return {
      current: null
    }
  };
  O54.forwardRef = function(A) {
    return {
      $$typeof: E54,
      render: A
    }
  };
  O54.isValidElement = wC1;
  O54.lazy = function(A) {
    return {
      $$typeof: $54,
      _payload: {
        _status: -1,
        _result: A
      },
      _init: L54
    }
  };
  O54.memo = function(A, Q) {
    return {
      $$typeof: U54,
      type: A,
      compare: Q === void 0 ? null : Q
    }
  };
  O54.startTransition = function(A) {
    var Q = KvA.transition;
    KvA.transition = {};
    try {
      A()
    } finally {
      KvA.transition = Q
    }
  };
  O54.unstable_act = yc0;
  O54.useCallback = function(A, Q) {
    return iC.current.useCallback(A, Q)
  };
  O54.useContext = function(A) {
    return iC.current.useContext(A)
  };
  O54.useDebugValue = function() {};
  O54.useDeferredValue = function(A) {
    return iC.current.useDeferredValue(A)
  };
  O54.useEffect = function(A, Q) {
    return iC.current.useEffect(A, Q)
  };
  O54.useId = function() {
    return iC.current.useId()
  };
  O54.useImperativeHandle = function(A, Q, B) {
    return iC.current.useImperativeHandle(A, Q, B)
  };
  O54.useInsertionEffect = function(A, Q) {
    return iC.current.useInsertionEffect(A, Q)
  };
  O54.useLayoutEffect = function(A, Q) {
    return iC.current.useLayoutEffect(A, Q)
  };
  O54.useMemo = function(A, Q) {
    return iC.current.useMemo(A, Q)
  };
  O54.useReducer = function(A, Q, B) {
    return iC.current.useReducer(A, Q, B)
  };
  O54.useRef = function(A) {
    return iC.current.useRef(A)
  };
  O54.useState = function(A) {
    return iC.current.useState(A)
  };
  O54.useSyncExternalStore = function(A, Q, B) {
    return iC.current.useSyncExternalStore(A, Q, B)
  };
  O54.useTransition = function() {
    return iC.current.useTransition()
  };
  O54.version = "18.3.1"
})
// @from(Start 1703340, End 1703421)
function mKA(A, Q) {
  return function() {
    return A.apply(Q, arguments)
  }
}
// @from(Start 1703423, End 1703581)
function X34(A) {
  return A !== null && !dKA(A) && A.constructor !== null && !dKA(A.constructor) && Jw(A.constructor.isBuffer) && A.constructor.isBuffer(A)
}
// @from(Start 1703583, End 1703746)
function V34(A) {
  let Q;
  if (typeof ArrayBuffer < "u" && ArrayBuffer.isView) Q = ArrayBuffer.isView(A);
  else Q = A && A.buffer && vc0(A.buffer);
  return Q
}
// @from(Start 1703748, End 1704146)
function cKA(A, Q, {
  allOwnKeys: B = !1
} = {}) {
  if (A === null || typeof A > "u") return;
  let G, Z;
  if (typeof A !== "object") A = [A];
  if (l9A(A))
    for (G = 0, Z = A.length; G < Z; G++) Q.call(null, A[G], G, A);
  else {
    let I = B ? Object.getOwnPropertyNames(A) : Object.keys(A),
      Y = I.length,
      J;
    for (G = 0; G < Y; G++) J = I[G], Q.call(null, A[J], J, A)
  }
}
// @from(Start 1704148, End 1704327)
function fc0(A, Q) {
  Q = Q.toLowerCase();
  let B = Object.keys(A),
    G = B.length,
    Z;
  while (G-- > 0)
    if (Z = B[G], Q === Z.toLowerCase()) return Z;
  return null
}
// @from(Start 1704329, End 1704712)
function qC1() {
  let {
    caseless: A
  } = hc0(this) && this || {}, Q = {}, B = (G, Z) => {
    let I = A && fc0(Q, Z) || Z;
    if (DvA(Q[I]) && DvA(G)) Q[I] = qC1(Q[I], G);
    else if (DvA(G)) Q[I] = qC1({}, G);
    else if (l9A(G)) Q[I] = G.slice();
    else Q[I] = G
  };
  for (let G = 0, Z = arguments.length; G < Z; G++) arguments[G] && cKA(arguments[G], B);
  return Q
}
// @from(Start 1704714, End 1704826)
function m34(A) {
  return !!(A && Jw(A.append) && A[Symbol.toStringTag] === "FormData" && A[Symbol.iterator])
}
// @from(Start 1704831, End 1704834)
W34
// @from(Start 1704836, End 1704839)
NC1
// @from(Start 1704841, End 1704844)
HvA
// @from(Start 1704846, End 1704915)
xR = (A) => {
    return A = A.toLowerCase(), (Q) => HvA(Q) === A
  }
// @from(Start 1704919, End 1704953)
CvA = (A) => (Q) => typeof Q === A
// @from(Start 1704957, End 1704960)
l9A
// @from(Start 1704962, End 1704965)
dKA
// @from(Start 1704967, End 1704970)
vc0
// @from(Start 1704972, End 1704975)
F34
// @from(Start 1704977, End 1704979)
Jw
// @from(Start 1704981, End 1704984)
bc0
// @from(Start 1704986, End 1705034)
EvA = (A) => A !== null && typeof A === "object"
// @from(Start 1705038, End 1705071)
K34 = (A) => A === !0 || A === !1
// @from(Start 1705075, End 1705297)
DvA = (A) => {
    if (HvA(A) !== "object") return !1;
    let Q = NC1(A);
    return (Q === null || Q === Object.prototype || Object.getPrototypeOf(Q) === null) && !(Symbol.toStringTag in A) && !(Symbol.iterator in A)
  }
// @from(Start 1705301, End 1705304)
D34
// @from(Start 1705306, End 1705309)
H34
// @from(Start 1705311, End 1705314)
C34
// @from(Start 1705316, End 1705319)
E34
// @from(Start 1705321, End 1705354)
z34 = (A) => EvA(A) && Jw(A.pipe)
// @from(Start 1705358, End 1705586)
U34 = (A) => {
    let Q;
    return A && (typeof FormData === "function" && A instanceof FormData || Jw(A.append) && ((Q = HvA(A)) === "formdata" || Q === "object" && Jw(A.toString) && A.toString() === "[object FormData]"))
  }
// @from(Start 1705590, End 1705593)
$34
// @from(Start 1705595, End 1705598)
w34
// @from(Start 1705600, End 1705603)
q34
// @from(Start 1705605, End 1705608)
N34
// @from(Start 1705610, End 1705613)
L34
// @from(Start 1705615, End 1705699)
M34 = (A) => A.trim ? A.trim() : A.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "")
// @from(Start 1705703, End 1705705)
Xr
// @from(Start 1705707, End 1705739)
hc0 = (A) => !dKA(A) && A !== Xr
// @from(Start 1705743, End 1705926)
O34 = (A, Q, B, {
    allOwnKeys: G
  } = {}) => {
    return cKA(Q, (Z, I) => {
      if (B && Jw(Z)) A[I] = mKA(Z, B);
      else A[I] = Z
    }, {
      allOwnKeys: G
    }), A
  }
// @from(Start 1705930, End 1706012)
R34 = (A) => {
    if (A.charCodeAt(0) === 65279) A = A.slice(1);
    return A
  }
// @from(Start 1706016, End 1706225)
T34 = (A, Q, B, G) => {
    A.prototype = Object.create(Q.prototype, G), A.prototype.constructor = A, Object.defineProperty(A, "super", {
      value: Q.prototype
    }), B && Object.assign(A.prototype, B)
  }
// @from(Start 1706229, End 1706588)
P34 = (A, Q, B, G) => {
    let Z, I, Y, J = {};
    if (Q = Q || {}, A == null) return Q;
    do {
      Z = Object.getOwnPropertyNames(A), I = Z.length;
      while (I-- > 0)
        if (Y = Z[I], (!G || G(Y, A, Q)) && !J[Y]) Q[Y] = A[Y], J[Y] = !0;
      A = B !== !1 && NC1(A)
    } while (A && (!B || B(A, Q)) && A !== Object.prototype);
    return Q
  }
// @from(Start 1706592, End 1706762)
j34 = (A, Q, B) => {
    if (A = String(A), B === void 0 || B > A.length) B = A.length;
    B -= Q.length;
    let G = A.indexOf(Q, B);
    return G !== -1 && G === B
  }
// @from(Start 1706766, End 1706955)
S34 = (A) => {
    if (!A) return null;
    if (l9A(A)) return A;
    let Q = A.length;
    if (!bc0(Q)) return null;
    let B = Array(Q);
    while (Q-- > 0) B[Q] = A[Q];
    return B
  }
// @from(Start 1706959, End 1706962)
_34
// @from(Start 1706964, End 1707138)
k34 = (A, Q) => {
    let G = (A && A[Symbol.iterator]).call(A),
      Z;
    while ((Z = G.next()) && !Z.done) {
      let I = Z.value;
      Q.call(A, I[0], I[1])
    }
  }
// @from(Start 1707142, End 1707243)
y34 = (A, Q) => {
    let B, G = [];
    while ((B = A.exec(Q)) !== null) G.push(B);
    return G
  }
// @from(Start 1707247, End 1707250)
x34
// @from(Start 1707252, End 1707390)
v34 = (A) => {
    return A.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function(B, G, Z) {
      return G.toUpperCase() + Z
    })
  }
// @from(Start 1707394, End 1707397)
xc0
// @from(Start 1707399, End 1707402)
b34
// @from(Start 1707404, End 1707611)
gc0 = (A, Q) => {
    let B = Object.getOwnPropertyDescriptors(A),
      G = {};
    cKA(B, (Z, I) => {
      let Y;
      if ((Y = Q(Z, I, A)) !== !1) G[I] = Y || Z
    }), Object.defineProperties(A, G)
  }
// @from(Start 1707615, End 1707998)
f34 = (A) => {
    gc0(A, (Q, B) => {
      if (Jw(A) && ["arguments", "caller", "callee"].indexOf(B) !== -1) return !1;
      let G = A[B];
      if (!Jw(G)) return;
      if (Q.enumerable = !1, "writable" in Q) {
        Q.writable = !1;
        return
      }
      if (!Q.set) Q.set = () => {
        throw Error("Can not rewrite read-only method '" + B + "'")
      }
    })
  }
// @from(Start 1708002, End 1708177)
h34 = (A, Q) => {
    let B = {},
      G = (Z) => {
        Z.forEach((I) => {
          B[I] = !0
        })
      };
    return l9A(A) ? G(A) : G(String(A).split(Q)), B
  }
// @from(Start 1708181, End 1708195)
g34 = () => {}
// @from(Start 1708199, End 1708276)
u34 = (A, Q) => {
    return A != null && Number.isFinite(A = +A) ? A : Q
  }
// @from(Start 1708280, End 1708722)
d34 = (A) => {
    let Q = [, , , , , , , , , , ],
      B = (G, Z) => {
        if (EvA(G)) {
          if (Q.indexOf(G) >= 0) return;
          if (!("toJSON" in G)) {
            Q[Z] = G;
            let I = l9A(G) ? [] : {};
            return cKA(G, (Y, J) => {
              let W = B(Y, Z + 1);
              !dKA(W) && (I[J] = W)
            }), Q[Z] = void 0, I
          }
        }
        return G
      };
    return B(A, 0)
  }
// @from(Start 1708726, End 1708729)
c34
// @from(Start 1708731, End 1708795)
p34 = (A) => A && (EvA(A) || Jw(A)) && Jw(A.then) && Jw(A.catch)
// @from(Start 1708799, End 1708802)
uc0
// @from(Start 1708804, End 1708807)
l34
// @from(Start 1708809, End 1708811)
b1
// @from(Start 1708817, End 1711522)
QZ = L(() => {
  ({
    toString: W34
  } = Object.prototype), {
    getPrototypeOf: NC1
  } = Object, HvA = ((A) => (Q) => {
    let B = W34.call(Q);
    return A[B] || (A[B] = B.slice(8, -1).toLowerCase())
  })(Object.create(null)), {
    isArray: l9A
  } = Array, dKA = CvA("undefined");
  vc0 = xR("ArrayBuffer");
  F34 = CvA("string"), Jw = CvA("function"), bc0 = CvA("number"), D34 = xR("Date"), H34 = xR("File"), C34 = xR("Blob"), E34 = xR("FileList"), $34 = xR("URLSearchParams"), [w34, q34, N34, L34] = ["ReadableStream", "Request", "Response", "Headers"].map(xR);
  Xr = (() => {
    if (typeof globalThis < "u") return globalThis;
    return typeof self < "u" ? self : typeof window < "u" ? window : global
  })();
  _34 = ((A) => {
    return (Q) => {
      return A && Q instanceof A
    }
  })(typeof Uint8Array < "u" && NC1(Uint8Array)), x34 = xR("HTMLFormElement"), xc0 = (({
    hasOwnProperty: A
  }) => (Q, B) => A.call(Q, B))(Object.prototype), b34 = xR("RegExp");
  c34 = xR("AsyncFunction"), uc0 = ((A, Q) => {
    if (A) return setImmediate;
    return Q ? ((B, G) => {
      return Xr.addEventListener("message", ({
        source: Z,
        data: I
      }) => {
        if (Z === Xr && I === B) G.length && G.shift()()
      }, !1), (Z) => {
        G.push(Z), Xr.postMessage(B, "*")
      }
    })(`axios@${Math.random()}`, []) : (B) => setTimeout(B)
  })(typeof setImmediate === "function", Jw(Xr.postMessage)), l34 = typeof queueMicrotask < "u" ? queueMicrotask.bind(Xr) : typeof process < "u" && process.nextTick || uc0, b1 = {
    isArray: l9A,
    isArrayBuffer: vc0,
    isBuffer: X34,
    isFormData: U34,
    isArrayBufferView: V34,
    isString: F34,
    isNumber: bc0,
    isBoolean: K34,
    isObject: EvA,
    isPlainObject: DvA,
    isReadableStream: w34,
    isRequest: q34,
    isResponse: N34,
    isHeaders: L34,
    isUndefined: dKA,
    isDate: D34,
    isFile: H34,
    isBlob: C34,
    isRegExp: b34,
    isFunction: Jw,
    isStream: z34,
    isURLSearchParams: $34,
    isTypedArray: _34,
    isFileList: E34,
    forEach: cKA,
    merge: qC1,
    extend: O34,
    trim: M34,
    stripBOM: R34,
    inherits: T34,
    toFlatObject: P34,
    kindOf: HvA,
    kindOfTest: xR,
    endsWith: j34,
    toArray: S34,
    forEachEntry: k34,
    matchAll: y34,
    isHTMLForm: x34,
    hasOwnProperty: xc0,
    hasOwnProp: xc0,
    reduceDescriptors: gc0,
    freezeMethods: f34,
    toObjectSet: h34,
    toCamelCase: v34,
    noop: g34,
    toFiniteNumber: u34,
    findKey: fc0,
    global: Xr,
    isContextDefined: hc0,
    isSpecCompliantForm: m34,
    toJSONObject: d34,
    isAsyncFn: c34,
    isThenable: p34,
    setImmediate: uc0,
    asap: l34
  }
})
// @from(Start 1711525, End 1711873)
function i9A(A, Q, B, G, Z) {
  if (Error.call(this), Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
  else this.stack = Error().stack;
  if (this.message = A, this.name = "AxiosError", Q && (this.code = Q), B && (this.config = B), G && (this.request = G), Z) this.response = Z, this.status = Z.status ? Z.status : null
}
// @from(Start 1711878, End 1711881)
mc0
// @from(Start 1711883, End 1711886)
dc0
// @from(Start 1711888, End 1711890)
RB
// @from(Start 1711896, End 1713114)
Ww = L(() => {
  QZ();
  b1.inherits(i9A, Error, {
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
        config: b1.toJSONObject(this.config),
        code: this.code,
        status: this.status
      }
    }
  });
  mc0 = i9A.prototype, dc0 = {};
  ["ERR_BAD_OPTION_VALUE", "ERR_BAD_OPTION", "ECONNABORTED", "ETIMEDOUT", "ERR_NETWORK", "ERR_FR_TOO_MANY_REDIRECTS", "ERR_DEPRECATED", "ERR_BAD_RESPONSE", "ERR_BAD_REQUEST", "ERR_CANCELED", "ERR_NOT_SUPPORT", "ERR_INVALID_URL"].forEach((A) => {
    dc0[A] = {
      value: A
    }
  });
  Object.defineProperties(i9A, dc0);
  Object.defineProperty(mc0, "isAxiosError", {
    value: !0
  });
  i9A.from = (A, Q, B, G, Z, I) => {
    let Y = Object.create(mc0);
    return b1.toFlatObject(A, Y, function(W) {
      return W !== Error.prototype
    }, (J) => {
      return J !== "isAxiosError"
    }), i9A.call(Y, A.message, Q, B, G, Z), Y.cause = A, Y.name = A.name, I && Object.assign(Y, I), Y
  };
  RB = i9A
})
// @from(Start 1713120, End 1715076)
lc0 = z((rI7, pc0) => {
  var cc0 = UA("stream").Stream,
    i34 = UA("util");
  pc0.exports = vR;

  function vR() {
    this.source = null, this.dataSize = 0, this.maxDataSize = 1048576, this.pauseStream = !0, this._maxDataSizeExceeded = !1, this._released = !1, this._bufferedEvents = []
  }
  i34.inherits(vR, cc0);
  vR.create = function(A, Q) {
    var B = new this;
    Q = Q || {};
    for (var G in Q) B[G] = Q[G];
    B.source = A;
    var Z = A.emit;
    if (A.emit = function() {
        return B._handleEmit(arguments), Z.apply(A, arguments)
      }, A.on("error", function() {}), B.pauseStream) A.pause();
    return B
  };
  Object.defineProperty(vR.prototype, "readable", {
    configurable: !0,
    enumerable: !0,
    get: function() {
      return this.source.readable
    }
  });
  vR.prototype.setEncoding = function() {
    return this.source.setEncoding.apply(this.source, arguments)
  };
  vR.prototype.resume = function() {
    if (!this._released) this.release();
    this.source.resume()
  };
  vR.prototype.pause = function() {
    this.source.pause()
  };
  vR.prototype.release = function() {
    this._released = !0, this._bufferedEvents.forEach(function(A) {
      this.emit.apply(this, A)
    }.bind(this)), this._bufferedEvents = []
  };
  vR.prototype.pipe = function() {
    var A = cc0.prototype.pipe.apply(this, arguments);
    return this.resume(), A
  };
  vR.prototype._handleEmit = function(A) {
    if (this._released) {
      this.emit.apply(this, A);
      return
    }
    if (A[0] === "data") this.dataSize += A[1].length, this._checkIfMaxDataSizeExceeded();
    this._bufferedEvents.push(A)
  };
  vR.prototype._checkIfMaxDataSizeExceeded = function() {
    if (this._maxDataSizeExceeded) return;
    if (this.dataSize <= this.maxDataSize) return;
    this._maxDataSizeExceeded = !0;
    var A = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
    this.emit("error", Error(A))
  }
})
// @from(Start 1715082, End 1718911)
sc0 = z((oI7, ac0) => {
  var n34 = UA("util"),
    nc0 = UA("stream").Stream,
    ic0 = lc0();
  ac0.exports = wJ;

  function wJ() {
    this.writable = !1, this.readable = !0, this.dataSize = 0, this.maxDataSize = 2097152, this.pauseStreams = !0, this._released = !1, this._streams = [], this._currentStream = null, this._insideLoop = !1, this._pendingNext = !1
  }
  n34.inherits(wJ, nc0);
  wJ.create = function(A) {
    var Q = new this;
    A = A || {};
    for (var B in A) Q[B] = A[B];
    return Q
  };
  wJ.isStreamLike = function(A) {
    return typeof A !== "function" && typeof A !== "string" && typeof A !== "boolean" && typeof A !== "number" && !Buffer.isBuffer(A)
  };
  wJ.prototype.append = function(A) {
    var Q = wJ.isStreamLike(A);
    if (Q) {
      if (!(A instanceof ic0)) {
        var B = ic0.create(A, {
          maxDataSize: 1 / 0,
          pauseStream: this.pauseStreams
        });
        A.on("data", this._checkDataSize.bind(this)), A = B
      }
      if (this._handleErrors(A), this.pauseStreams) A.pause()
    }
    return this._streams.push(A), this
  };
  wJ.prototype.pipe = function(A, Q) {
    return nc0.prototype.pipe.call(this, A, Q), this.resume(), A
  };
  wJ.prototype._getNext = function() {
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
  wJ.prototype._realGetNext = function() {
    var A = this._streams.shift();
    if (typeof A > "u") {
      this.end();
      return
    }
    if (typeof A !== "function") {
      this._pipeNext(A);
      return
    }
    var Q = A;
    Q(function(B) {
      var G = wJ.isStreamLike(B);
      if (G) B.on("data", this._checkDataSize.bind(this)), this._handleErrors(B);
      this._pipeNext(B)
    }.bind(this))
  };
  wJ.prototype._pipeNext = function(A) {
    this._currentStream = A;
    var Q = wJ.isStreamLike(A);
    if (Q) {
      A.on("end", this._getNext.bind(this)), A.pipe(this, {
        end: !1
      });
      return
    }
    var B = A;
    this.write(B), this._getNext()
  };
  wJ.prototype._handleErrors = function(A) {
    var Q = this;
    A.on("error", function(B) {
      Q._emitError(B)
    })
  };
  wJ.prototype.write = function(A) {
    this.emit("data", A)
  };
  wJ.prototype.pause = function() {
    if (!this.pauseStreams) return;
    if (this.pauseStreams && this._currentStream && typeof this._currentStream.pause == "function") this._currentStream.pause();
    this.emit("pause")
  };
  wJ.prototype.resume = function() {
    if (!this._released) this._released = !0, this.writable = !0, this._getNext();
    if (this.pauseStreams && this._currentStream && typeof this._currentStream.resume == "function") this._currentStream.resume();
    this.emit("resume")
  };
  wJ.prototype.end = function() {
    this._reset(), this.emit("end")
  };
  wJ.prototype.destroy = function() {
    this._reset(), this.emit("close")
  };
  wJ.prototype._reset = function() {
    this.writable = !1, this._streams = [], this._currentStream = null
  };
  wJ.prototype._checkDataSize = function() {
    if (this._updateDataSize(), this.dataSize <= this.maxDataSize) return;
    var A = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
    this._emitError(Error(A))
  };
  wJ.prototype._updateDataSize = function() {
    this.dataSize = 0;
    var A = this;
    if (this._streams.forEach(function(Q) {
        if (!Q.dataSize) return;
        A.dataSize += Q.dataSize
      }), this._currentStream && this._currentStream.dataSize) this.dataSize += this._currentStream.dataSize
  };
  wJ.prototype._emitError = function(A) {
    this._reset(), this.emit("error", A)
  }
})