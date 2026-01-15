
// @from(Ln 15241, Col 2)
Er0 = async (A, {
    cleanup: Q,
    detached: B
  }, G) => {
    if (!Q || B) return G;
    let Z = ocA(() => {
      A.kill()
    });
    return G.finally(() => {
      Z()
    })
  }
// @from(Ln 15253, Col 4)
zr0 = w(() => {
  PL1()
})
// @from(Ln 15257, Col 0)
function rcA(A) {
  return A !== null && typeof A === "object" && typeof A.pipe === "function"
}
// @from(Ln 15261, Col 0)
function SL1(A) {
  return rcA(A) && A.writable !== !1 && typeof A._write === "function" && typeof A._writableState === "object"
}
// @from(Ln 15270, Col 4)
fe9 = (A) => A instanceof be9 && typeof A.then === "function"
// @from(Ln 15271, Col 2)
xL1 = (A, Q, B) => {
    if (typeof B === "string") return A[Q].pipe(ke9(B)), A;
    if (SL1(B)) return A[Q].pipe(B), A;
    if (!fe9(B)) throw TypeError("The second argument must be a string, a stream or an Execa child process.");
    if (!SL1(B.stdin)) throw TypeError("The target child process's stdin must be available.");
    return A[Q].pipe(B.stdin), B
  }
// @from(Ln 15278, Col 2)
$r0 = (A) => {
    if (A.stdout !== null) A.pipeStdout = xL1.bind(void 0, A, "stdout");
    if (A.stderr !== null) A.pipeStderr = xL1.bind(void 0, A, "stderr");
    if (A.all !== void 0) A.pipeAll = xL1.bind(void 0, A, "all")
  }
// @from(Ln 15283, Col 4)
Cr0 = () => {}
// @from(Ln 15284, Col 4)
XUA = async (A, {
  init: Q,
  convertChunk: B,
  getSize: G,
  truncateChunk: Z,
  addChunk: Y,
  getFinalChunk: J,
  finalize: X
}, {
  maxBuffer: I = Number.POSITIVE_INFINITY
} = {}) => {
  if (!ge9(A)) throw Error("The first argument must be a Readable, a ReadableStream, or an async iterable.");
  let D = Q();
  D.length = 0;
  try {
    for await (let W of A) {
      let K = ue9(W),
        V = B[K](W, D);
      Nr0({
        convertedChunk: V,
        state: D,
        getSize: G,
        truncateChunk: Z,
        addChunk: Y,
        maxBuffer: I
      })
    }
    return he9({
      state: D,
      convertChunk: B,
      getSize: G,
      truncateChunk: Z,
      addChunk: Y,
      getFinalChunk: J,
      maxBuffer: I
    }), X(D)
  } catch (W) {
    throw W.bufferedData = X(D), W
  }
}
// @from(Ln 15323, Col 3)
he9 = ({
  state: A,
  getSize: Q,
  truncateChunk: B,
  addChunk: G,
  getFinalChunk: Z,
  maxBuffer: Y
}) => {
  let J = Z(A);
  if (J !== void 0) Nr0({
    convertedChunk: J,
    state: A,
    getSize: Q,
    truncateChunk: B,
    addChunk: G,
    maxBuffer: Y
  })
}
// @from(Ln 15340, Col 3)
Nr0 = ({
  convertedChunk: A,
  state: Q,
  getSize: B,
  truncateChunk: G,
  addChunk: Z,
  maxBuffer: Y
}) => {
  let J = B(A),
    X = Q.length + J;
  if (X <= Y) {
    Ur0(A, Q, Z, X);
    return
  }
  let I = G(A, Y - Q.length);
  if (I !== void 0) Ur0(I, Q, Z, Y);
  throw new yL1
}
// @from(Ln 15357, Col 3)
Ur0 = (A, Q, B, G) => {
  Q.contents = B(A, Q, G), Q.length = G
}
// @from(Ln 15359, Col 3)
ge9 = (A) => typeof A === "object" && A !== null && typeof A[Symbol.asyncIterator] === "function"
// @from(Ln 15359, Col 102)
ue9 = (A) => {
  let Q = typeof A;
  if (Q === "string") return "string";
  if (Q !== "object" || A === null) return "others";
  if (globalThis.Buffer?.isBuffer(A)) return "buffer";
  let B = qr0.call(A);
  if (B === "[object ArrayBuffer]") return "arrayBuffer";
  if (B === "[object DataView]") return "dataView";
  if (Number.isInteger(A.byteLength) && Number.isInteger(A.byteOffset) && qr0.call(A.buffer) === "[object ArrayBuffer]") return "typedArray";
  return "others"
}
// @from(Ln 15369, Col 3)
qr0
// @from(Ln 15369, Col 8)
yL1
// @from(Ln 15370, Col 4)
IUA = w(() => {
  ({
    toString: qr0
  } = Object.prototype);
  yL1 = class yL1 extends Error {
    name = "MaxBufferError";
    constructor() {
      super("maxBuffer exceeded")
    }
  }
})
// @from(Ln 15381, Col 4)
vL1 = (A) => A
// @from(Ln 15382, Col 2)
kL1 = () => {
    return
  }
// @from(Ln 15385, Col 2)
bL1 = ({
    contents: A
  }) => A
// @from(Ln 15388, Col 2)
scA = (A) => {
    throw Error(`Streams in object mode are not supported: ${String(A)}`)
  }
// @from(Ln 15391, Col 2)
tcA = (A) => A.length
// @from(Ln 15392, Col 4)
wr0 = w(() => {
  IUA()
})
// @from(Ln 15395, Col 0)
async function fL1(A, Q) {
  return XUA(A, oe9, Q)
}
// @from(Ln 15398, Col 4)
me9 = () => ({
    contents: new ArrayBuffer(0)
  })
// @from(Ln 15401, Col 2)
de9 = (A) => ce9.encode(A)
// @from(Ln 15402, Col 2)
ce9
// @from(Ln 15402, Col 7)
Lr0 = (A) => new Uint8Array(A)
// @from(Ln 15403, Col 2)
Or0 = (A) => new Uint8Array(A.buffer, A.byteOffset, A.byteLength)
// @from(Ln 15404, Col 2)
pe9 = (A, Q) => A.slice(0, Q)
// @from(Ln 15405, Col 2)
le9 = (A, {
    contents: Q,
    length: B
  }, G) => {
    let Z = _r0() ? ne9(Q, G) : ie9(Q, G);
    return new Uint8Array(Z).set(A, B), Z
  }
// @from(Ln 15412, Col 2)
ie9 = (A, Q) => {
    if (Q <= A.byteLength) return A;
    let B = new ArrayBuffer(Rr0(Q));
    return new Uint8Array(B).set(new Uint8Array(A), 0), B
  }
// @from(Ln 15417, Col 2)
ne9 = (A, Q) => {
    if (Q <= A.maxByteLength) return A.resize(Q), A;
    let B = new ArrayBuffer(Q, {
      maxByteLength: Rr0(Q)
    });
    return new Uint8Array(B).set(new Uint8Array(A), 0), B
  }
// @from(Ln 15424, Col 2)
Rr0 = (A) => Mr0 ** Math.ceil(Math.log(A) / Math.log(Mr0))
// @from(Ln 15425, Col 2)
Mr0 = 2
// @from(Ln 15426, Col 2)
ae9 = ({
    contents: A,
    length: Q
  }) => _r0() ? A : A.slice(0, Q)
// @from(Ln 15430, Col 2)
_r0 = () => ("resize" in ArrayBuffer.prototype)
// @from(Ln 15431, Col 2)
oe9
// @from(Ln 15432, Col 4)
hL1 = w(() => {
  IUA();
  ce9 = new TextEncoder, oe9 = {
    init: me9,
    convertChunk: {
      string: de9,
      buffer: Lr0,
      arrayBuffer: Lr0,
      dataView: Or0,
      typedArray: Or0,
      others: scA
    },
    getSize: tcA,
    truncateChunk: pe9,
    addChunk: le9,
    getFinalChunk: kL1,
    finalize: ae9
  }
})
// @from(Ln 15451, Col 0)
async function ecA(A, Q) {
  if (!("Buffer" in globalThis)) throw Error("getStreamAsBuffer() is only supported in Node.js");
  try {
    return jr0(await fL1(A, Q))
  } catch (B) {
    if (B.bufferedData !== void 0) B.bufferedData = jr0(B.bufferedData);
    throw B
  }
}
// @from(Ln 15460, Col 4)
jr0 = (A) => globalThis.Buffer.from(A)
// @from(Ln 15461, Col 4)
Tr0 = w(() => {
  hL1()
})
// @from(Ln 15464, Col 0)
async function gL1(A, Q) {
  return XUA(A, AA4, Q)
}
// @from(Ln 15467, Col 4)
re9 = () => ({
    contents: "",
    textDecoder: new TextDecoder
  })
// @from(Ln 15471, Col 2)
ApA = (A, {
    textDecoder: Q
  }) => Q.decode(A, {
    stream: !0
  })
// @from(Ln 15476, Col 2)
se9 = (A, {
    contents: Q
  }) => Q + A
// @from(Ln 15479, Col 2)
te9 = (A, Q) => A.slice(0, Q)
// @from(Ln 15480, Col 2)
ee9 = ({
    textDecoder: A
  }) => {
    let Q = A.decode();
    return Q === "" ? void 0 : Q
  }
// @from(Ln 15486, Col 2)
AA4
// @from(Ln 15487, Col 4)
Pr0 = w(() => {
  IUA();
  AA4 = {
    init: re9,
    convertChunk: {
      string: vL1,
      buffer: ApA,
      arrayBuffer: ApA,
      dataView: ApA,
      typedArray: ApA,
      others: scA
    },
    getSize: tcA,
    truncateChunk: te9,
    addChunk: se9,
    getFinalChunk: ee9,
    finalize: bL1
  }
})
// @from(Ln 15506, Col 4)
Sr0 = w(() => {
  wr0();
  hL1();
  Tr0();
  Pr0();
  IUA()
})
// @from(Ln 15513, Col 4)
yr0 = U((Jl7, xr0) => {
  var {
    PassThrough: QA4
  } = NA("stream");
  xr0.exports = function () {
    var A = [],
      Q = new QA4({
        objectMode: !0
      });
    return Q.setMaxListeners(0), Q.add = B, Q.isEmpty = G, Q.on("unpipe", Z), Array.prototype.slice.call(arguments).forEach(B), Q;

    function B(Y) {
      if (Array.isArray(Y)) return Y.forEach(B), this;
      return A.push(Y), Y.once("end", Z.bind(null, Y)), Y.once("error", Q.emit.bind(Q, "error")), Y.pipe(Q, {
        end: !1
      }), this
    }

    function G() {
      return A.length == 0
    }

    function Z(Y) {
      if (A = A.filter(function (J) {
          return J !== Y
        }), !A.length && Q.readable) Q.end()
    }
  }
})
// @from(Ln 15549, Col 4)
vr0
// @from(Ln 15549, Col 9)
kr0 = (A) => {
    if (A !== void 0) throw TypeError("The `input` and `inputFile` options cannot be both set.")
  }
// @from(Ln 15552, Col 2)
YA4 = ({
    input: A,
    inputFile: Q
  }) => {
    if (typeof Q !== "string") return A;
    return kr0(A), GA4(Q)
  }
// @from(Ln 15559, Col 2)
br0 = (A) => {
    let Q = YA4(A);
    if (rcA(Q)) throw TypeError("The `input` option cannot be a stream in sync mode");
    return Q
  }
// @from(Ln 15564, Col 2)
JA4 = ({
    input: A,
    inputFile: Q
  }) => {
    if (typeof Q !== "string") return A;
    return kr0(A), BA4(Q)
  }
// @from(Ln 15571, Col 2)
fr0 = (A, Q) => {
    let B = JA4(Q);
    if (B === void 0) return;
    if (rcA(B)) B.pipe(A.stdin);
    else A.stdin.end(B)
  }
// @from(Ln 15577, Col 2)
hr0 = (A, {
    all: Q
  }) => {
    if (!Q || !A.stdout && !A.stderr) return;
    let B = vr0.default();
    if (A.stdout) B.add(A.stdout);
    if (A.stderr) B.add(A.stderr);
    return B
  }
// @from(Ln 15586, Col 2)
uL1 = async (A, Q) => {
    if (!A || Q === void 0) return;
    await ZA4(0), A.destroy();
    try {
      return await Q
    } catch (B) {
      return B.bufferedData
    }
  }
// @from(Ln 15594, Col 5)
mL1 = (A, {
    encoding: Q,
    buffer: B,
    maxBuffer: G
  }) => {
    if (!A || !B) return;
    if (Q === "utf8" || Q === "utf-8") return gL1(A, {
      maxBuffer: G
    });
    if (Q === null || Q === "buffer") return ecA(A, {
      maxBuffer: G
    });
    return XA4(A, G, Q)
  }
// @from(Ln 15607, Col 5)
XA4 = async (A, Q, B) => {
    return (await ecA(A, {
      maxBuffer: Q
    })).toString(B)
  }
// @from(Ln 15611, Col 5)
gr0 = async ({
    stdout: A,
    stderr: Q,
    all: B
  }, {
    encoding: G,
    buffer: Z,
    maxBuffer: Y
  }, J) => {
    let X = mL1(A, {
        encoding: G,
        buffer: Z,
        maxBuffer: Y
      }),
      I = mL1(Q, {
        encoding: G,
        buffer: Z,
        maxBuffer: Y
      }),
      D = mL1(B, {
        encoding: G,
        buffer: Z,
        maxBuffer: Y * 2
      });
    try {
      return await Promise.all([J, X, I, D])
    } catch (W) {
      return Promise.all([{
        error: W,
        signal: W.signal,
        timedOut: W.timedOut
      }, uL1(A, X), uL1(Q, I), uL1(B, D)])
    }
  }
// @from(Ln 15645, Col 4)
ur0 = w(() => {
  Sr0();
  vr0 = c(yr0(), 1)
})
// @from(Ln 15649, Col 4)
IA4
// @from(Ln 15649, Col 9)
DA4
// @from(Ln 15649, Col 14)
dL1 = (A, Q) => {
    for (let [B, G] of DA4) {
      let Z = typeof Q === "function" ? (...Y) => Reflect.apply(G.value, Q(), Y) : G.value.bind(Q);
      Reflect.defineProperty(A, B, {
        ...G,
        value: Z
      })
    }
  }
// @from(Ln 15658, Col 2)
mr0 = (A) => new Promise((Q, B) => {
    if (A.on("exit", (G, Z) => {
        Q({
          exitCode: G,
          signal: Z
        })
      }), A.on("error", (G) => {
        B(G)
      }), A.stdin) A.stdin.on("error", (G) => {
      B(G)
    })
  })
// @from(Ln 15670, Col 4)
dr0 = w(() => {
  IA4 = (async () => {})().constructor.prototype, DA4 = ["then", "catch", "finally"].map((A) => [A, Reflect.getOwnPropertyDescriptor(IA4, A)])
})
// @from(Ln 15679, Col 4)
lr0 = (A, Q = []) => {
    if (!Array.isArray(Q)) return [A];
    return [A, ...Q]
  }
// @from(Ln 15683, Col 2)
VA4
// @from(Ln 15683, Col 7)
FA4 = (A) => {
    if (typeof A !== "string" || VA4.test(A)) return A;
    return `"${A.replaceAll('"',"\\\"")}"`
  }
// @from(Ln 15687, Col 2)
cL1 = (A, Q) => lr0(A, Q).join(" ")
// @from(Ln 15688, Col 2)
pL1 = (A, Q) => lr0(A, Q).map((B) => FA4(B)).join(" ")
// @from(Ln 15689, Col 2)
HA4
// @from(Ln 15689, Col 7)
cr0 = (A) => {
    let Q = typeof A;
    if (Q === "string") return A;
    if (Q === "number") return String(A);
    if (Q === "object" && A !== null && !(A instanceof KA4) && "stdout" in A) {
      let B = typeof A.stdout;
      if (B === "string") return A.stdout;
      if (WA4.isBuffer(A.stdout)) return A.stdout.toString();
      throw TypeError(`Unexpected "${B}" stdout in template expression`)
    }
    throw TypeError(`Unexpected "${Q}" in template expression`)
  }
// @from(Ln 15701, Col 2)
pr0 = (A, Q, B) => B || A.length === 0 || Q.length === 0 ? [...A, ...Q] : [...A.slice(0, -1), `${A.at(-1)}${Q[0]}`, ...Q.slice(1)]
// @from(Ln 15702, Col 2)
EA4 = ({
    templates: A,
    expressions: Q,
    tokens: B,
    index: G,
    template: Z
  }) => {
    let Y = Z ?? A.raw[G],
      J = Y.split(HA4).filter(Boolean),
      X = pr0(B, J, Y.startsWith(" "));
    if (G === Q.length) return X;
    let I = Q[G],
      D = Array.isArray(I) ? I.map((W) => cr0(W)) : [cr0(I)];
    return pr0(X, D, Y.endsWith(" "))
  }
// @from(Ln 15717, Col 2)
lL1 = (A, Q) => {
    let B = [];
    for (let [G, Z] of A.entries()) B = EA4({
      templates: A,
      expressions: Q,
      tokens: B,
      index: G,
      template: Z
    });
    return B
  }
// @from(Ln 15728, Col 4)
ir0 = w(() => {
  VA4 = /^[\w.-]+$/, HA4 = / +/g
})
// @from(Ln 15735, Col 4)
nr0
// @from(Ln 15735, Col 9)
QpA = (A, Q) => String(A).padStart(Q, "0")
// @from(Ln 15736, Col 2)
CA4 = () => {
    let A = new Date;
    return `${QpA(A.getHours(),2)}:${QpA(A.getMinutes(),2)}:${QpA(A.getSeconds(),2)}.${QpA(A.getMilliseconds(),3)}`
  }
// @from(Ln 15740, Col 2)
iL1 = (A, {
    verbose: Q
  }) => {
    if (!Q) return;
    $A4.stderr.write(`[${CA4()}] ${A}
`)
  }
// @from(Ln 15747, Col 4)
ar0 = w(() => {
  nr0 = zA4("execa").enabled
})
// @from(Ln 15757, Col 0)
function e5(A, Q, B) {
  let G = sr0(A, Q, B),
    Z = cL1(A, Q),
    Y = pL1(A, Q);
  iL1(Y, G.options), Hr0(G.options);
  let J;
  try {
    J = nL1.spawn(G.file, G.args, G.options)
  } catch (F) {
    let H = new nL1.ChildProcess,
      E = Promise.reject(JUA({
        error: F,
        stdout: "",
        stderr: "",
        all: "",
        command: Z,
        escapedCommand: Y,
        parsed: G,
        timedOut: !1,
        isCanceled: !1,
        killed: !1
      }));
    return dL1(H, E), H
  }
  let X = mr0(J),
    I = Fr0(J, G.options, X),
    D = Er0(J, G.options, I),
    W = {
      isCanceled: !1
    };
  J.kill = Kr0.bind(null, J.kill.bind(J)), J.cancel = Vr0.bind(null, J, W);
  let V = oo0(async () => {
    let [{
      error: F,
      exitCode: H,
      signal: E,
      timedOut: z
    }, $, O, L] = await gr0(J, G.options, D), M = DUA(G.options, $), _ = DUA(G.options, O), j = DUA(G.options, L);
    if (F || H !== 0 || E !== null) {
      let x = JUA({
        error: F,
        exitCode: H,
        signal: E,
        stdout: M,
        stderr: _,
        all: j,
        command: Z,
        escapedCommand: Y,
        parsed: G,
        timedOut: z,
        isCanceled: W.isCanceled || (G.options.signal ? G.options.signal.aborted : !1),
        killed: J.killed
      });
      if (!G.options.reject) return x;
      throw x
    }
    return {
      command: Z,
      escapedCommand: Y,
      exitCode: 0,
      stdout: M,
      stderr: _,
      all: j,
      failed: !1,
      timedOut: !1,
      isCanceled: !1,
      killed: !1
    }
  });
  return fr0(J, G.options), J.all = hr0(J, G.options), $r0(J), dL1(J, V), J
}
// @from(Ln 15829, Col 0)
function BGA(A, Q, B) {
  let G = sr0(A, Q, B),
    Z = cL1(A, Q),
    Y = pL1(A, Q);
  iL1(Y, G.options);
  let J = br0(G.options),
    X;
  try {
    X = nL1.spawnSync(G.file, G.args, {
      ...G.options,
      input: J
    })
  } catch (W) {
    throw JUA({
      error: W,
      stdout: "",
      stderr: "",
      all: "",
      command: Z,
      escapedCommand: Y,
      parsed: G,
      timedOut: !1,
      isCanceled: !1,
      killed: !1
    })
  }
  let I = DUA(G.options, X.stdout, X.error),
    D = DUA(G.options, X.stderr, X.error);
  if (X.error || X.status !== 0 || X.signal !== null) {
    let W = JUA({
      stdout: I,
      stderr: D,
      error: X.error,
      signal: X.signal,
      exitCode: X.status,
      command: Z,
      escapedCommand: Y,
      parsed: G,
      timedOut: X.error && X.error.code === "ETIMEDOUT",
      isCanceled: !1,
      killed: X.signal !== null
    });
    if (!G.options.reject) return W;
    throw W
  }
  return {
    command: Z,
    escapedCommand: Y,
    exitCode: 0,
    stdout: I,
    stderr: D,
    failed: !1,
    timedOut: !1,
    isCanceled: !1,
    killed: !1
  }
}
// @from(Ln 15887, Col 0)
function tr0(A) {
  function Q(B, ...G) {
    if (!Array.isArray(B)) return tr0({
      ...A,
      ...B
    });
    let [Z, ...Y] = lL1(B, G);
    return e5(Z, Y, or0(A))
  }
  return Q.sync = (B, ...G) => {
    if (!Array.isArray(B)) throw TypeError("Please use $(options).sync`command` instead of $.sync(options)`command`.");
    let [Z, ...Y] = lL1(B, G);
    return BGA(Z, Y, or0(A))
  }, Q
}
// @from(Ln 15902, Col 4)
rr0
// @from(Ln 15902, Col 9)
NA4 = 1e8
// @from(Ln 15903, Col 2)
wA4 = ({
    env: A,
    extendEnv: Q,
    preferLocal: B,
    localDir: G,
    execPath: Z
  }) => {
    let Y = Q ? {
      ...BpA.env,
      ...A
    } : A;
    if (B) return lo0({
      env: Y,
      cwd: G,
      execPath: Z
    });
    return Y
  }
// @from(Ln 15921, Col 2)
sr0 = (A, Q, B = {}) => {
    let G = rr0.default._parse(A, Q, B);
    if (A = G.command, Q = G.args, B = G.options, B = {
        maxBuffer: NA4,
        buffer: !0,
        stripFinalNewline: !0,
        extendEnv: !0,
        preferLocal: !1,
        localDir: B.cwd || BpA.cwd(),
        execPath: BpA.execPath,
        encoding: "utf8",
        reject: !0,
        cleanup: !0,
        all: !1,
        windowsHide: !0,
        verbose: nr0,
        ...B
      }, B.env = wA4(B), B.stdio = Yr0(B), BpA.platform === "win32" && qA4.basename(A, ".exe") === "cmd") Q.unshift("/q");
    return {
      file: A,
      args: Q,
      options: B,
      parsed: G
    }
  }
// @from(Ln 15946, Col 2)
DUA = (A, Q, B) => {
    if (typeof Q !== "string" && !UA4.isBuffer(Q)) return B === void 0 ? void 0 : "";
    if (A.stripFinalNewline) return wL1(Q);
    return Q
  }
// @from(Ln 15951, Col 2)
LA4 = ({
    input: A,
    inputFile: Q,
    stdio: B
  }) => A === void 0 && Q === void 0 && B === void 0 ? {
    stdin: "inherit"
  } : {}
// @from(Ln 15958, Col 2)
or0 = (A = {}) => ({
    preferLocal: !0,
    ...LA4(A),
    ...A
  })
// @from(Ln 15963, Col 2)
bl7
// @from(Ln 15964, Col 4)
Vq = w(() => {
  io0();
  ro0();
  Zr0();
  Jr0();
  zr0();
  Cr0();
  ur0();
  dr0();
  ir0();
  ar0();
  rr0 = c(NL1(), 1);
  bl7 = tr0()
})
// @from(Ln 15979, Col 0)
function aL1() {
  return _y()
}
// @from(Ln 15983, Col 0)
function o1() {
  try {
    return aL1()
  } catch {
    return EQ()
  }
}
// @from(Ln 15990, Col 4)
V2 = w(() => {
  C0()
})
// @from(Ln 15994, Col 0)
function NH(A, Q, B = 10 * As0 * er0) {
  let G;
  if (Q === void 0) G = {};
  else if (Q instanceof AbortSignal) G = {
    abortSignal: Q,
    timeout: B
  };
  else G = Q;
  let {
    abortSignal: Z,
    timeout: Y = 10 * As0 * er0,
    input: J,
    stdio: X = ["ignore", "pipe", "pipe"]
  } = G;
  Z?.throwIfAborted();
  let I = performance.now();
  try {
    let D = BGA(A, {
      env: process.env,
      maxBuffer: 1e6,
      timeout: Y,
      cwd: o1(),
      stdio: X,
      shell: !0,
      reject: !1,
      input: J
    });
    if (performance.now() - I > Bg, !D.stdout) return null;
    return D.stdout.trim() || null
  } catch {
    return performance.now() - I > Bg, null
  }
}
// @from(Ln 16027, Col 4)
er0 = 1000
// @from(Ln 16028, Col 2)
As0 = 60
// @from(Ln 16029, Col 4)
oL1 = w(() => {
  Vq();
  V2();
  T1();
  A0();
  C0()
})
// @from(Ln 16037, Col 0)
function TQ(A, Q, B = {
  timeout: 10 * sL1 * rL1,
  preserveOutputOnError: !0,
  useCwd: !0
}) {
  return J2(A, Q, {
    abortSignal: B.abortSignal,
    timeout: B.timeout,
    preserveOutputOnError: B.preserveOutputOnError,
    cwd: B.useCwd ? o1() : void 0,
    env: B.env,
    stdin: B.stdin
  })
}
// @from(Ln 16052, Col 0)
function OA4(A, Q) {
  if (A.shortMessage) return A.shortMessage;
  if (typeof A.signal === "string") return A.signal;
  return String(Q)
}
// @from(Ln 16058, Col 0)
function J2(A, Q, {
  abortSignal: B,
  timeout: G = 10 * sL1 * rL1,
  preserveOutputOnError: Z = !0,
  cwd: Y,
  env: J,
  maxBuffer: X,
  shell: I,
  stdin: D
} = {
  timeout: 10 * sL1 * rL1,
  preserveOutputOnError: !0,
  maxBuffer: 1e6
}) {
  return new Promise((W) => {
    e5(A, Q, {
      maxBuffer: X,
      signal: B,
      timeout: G,
      cwd: Y,
      env: J,
      shell: I,
      stdin: D,
      reject: !1
    }).then((K) => {
      if (K.failed)
        if (Z) {
          let V = K.exitCode ?? 1;
          W({
            stdout: K.stdout || "",
            stderr: K.stderr || "",
            code: V,
            error: OA4(K, V)
          })
        } else W({
          stdout: "",
          stderr: "",
          code: K.exitCode ?? 1
        });
      else W({
        stdout: K.stdout,
        stderr: K.stderr,
        code: 0
      })
    }).catch((K) => {
      e(K), W({
        stdout: "",
        stderr: "",
        code: 1
      })
    })
  })
}
// @from(Ln 16111, Col 4)
rL1 = 1000
// @from(Ln 16112, Col 2)
sL1 = 60
// @from(Ln 16113, Col 4)
t4 = w(() => {
  Vq();
  V2();
  v1();
  oL1()
})
// @from(Ln 16120, Col 0)
function G1A() {
  return process.versions.bun !== void 0
}
// @from(Ln 16124, Col 0)
function LG() {
  return G1A() && Array.isArray(Bun?.embeddedFiles) && Bun.embeddedFiles.length > 0
}
// @from(Ln 16127, Col 4)
tL1
// @from(Ln 16127, Col 9)
$Q
// @from(Ln 16127, Col 13)
Z1A
// @from(Ln 16127, Col 18)
Qs0
// @from(Ln 16128, Col 4)
c3 = w(() => {
  Y9();
  v1();
  DQ();
  tL1 = ["macos", "wsl"], $Q = W0(() => {
    try {
      if (process.platform === "darwin") return "macos";
      if (process.platform === "win32") return "windows";
      if (process.platform === "linux") {
        try {
          let A = vA().readFileSync("/proc/version", {
            encoding: "utf8"
          });
          if (A.toLowerCase().includes("microsoft") || A.toLowerCase().includes("wsl")) return "wsl"
        } catch (A) {
          e(A instanceof Error ? A : Error(String(A)))
        }
        return "linux"
      }
      return "unknown"
    } catch (A) {
      return e(A instanceof Error ? A : Error(String(A))), "unknown"
    }
  }), Z1A = W0(() => {
    if (process.platform !== "linux") return;
    try {
      let A = vA().readFileSync("/proc/version", {
          encoding: "utf8"
        }),
        Q = A.match(/WSL(\d+)/i);
      if (Q && Q[1]) return Q[1];
      if (A.toLowerCase().includes("microsoft")) return "1";
      return
    } catch (A) {
      e(A instanceof Error ? A : Error(String(A)));
      return
    }
  }), Qs0 = $Q() !== "windows"
})
// @from(Ln 16178, Col 0)
function GGA() {
  let A = ZpA();
  return {
    rgPath: A.command,
    rgArgs: A.args
  }
}
// @from(Ln 16186, Col 0)
function SA4(A) {
  return A.includes("os error 11") || A.includes("Resource temporarily unavailable")
}
// @from(Ln 16190, Col 0)
function Bs0(A, Q, B, G, Z = !1) {
  let {
    rgPath: Y,
    rgArgs: J
  } = GGA(), X = Z || Ys0 ? ["-j", "1"] : [];
  return _A4(Y, [...J, ...X, ...A, Q], {
    maxBuffer: PA4,
    signal: B,
    timeout: $Q() === "wsl" ? 60000 : 1e4
  }, G)
}
// @from(Ln 16201, Col 0)
async function gy(A, Q, B) {
  if (!LG()) await yA4();
  return xA4().catch((G) => {
    e(G instanceof Error ? G : Error(String(G)))
  }), new Promise((G, Z) => {
    let Y = (J, X, I, D) => {
      if (!J) {
        G(X.trim().split(`
`).filter(Boolean));
        return
      }
      if (J.code === 1) {
        G([]);
        return
      }
      if (["ENOENT", "EACCES", "EPERM"].includes(J.code)) {
        Z(J);
        return
      }
      if (!D && SA4(I)) {
        k("rg EAGAIN error detected, retrying with single-threaded mode (-j 1)"), Ys0 = !0, l("tengu_ripgrep_eagain_retry", {}), Bs0(A, Q, B, ($, O, L) => {
          Y($, O, L, !0)
        }, !0);
        return
      }
      let K = X && X.trim().length > 0,
        V = J.signal === "SIGTERM" || J.code === "ABORT_ERR",
        F = J.code === "ERR_CHILD_PROCESS_STDIO_MAXBUFFER",
        H = J.code === 2,
        E = (V || F || H) && K,
        z = [];
      if (E) {
        if (z = X.trim().split(`
`).filter(Boolean), z.length > 0 && (V || F)) z = z.slice(0, -1)
      }
      if (k(`rg error (signal=${J.signal}, code=${J.code}, stderr: ${I}), ${z.length} results`), J.code !== 2) e(J);
      G(z)
    };
    Bs0(A, Q, B, (J, X, I) => {
      Y(J, X, I, !1)
    })
  })
}
// @from(Ln 16244, Col 0)
async function Js0(A, Q, B) {
  try {
    return (await gy(["-l", "."], A, Q)).slice(0, B)
  } catch {
    return []
  }
}
// @from(Ln 16252, Col 0)
function Xs0() {
  let A = ZpA();
  return {
    mode: A.mode,
    path: A.command,
    working: GpA?.working ?? null
  }
}
// @from(Ln 16260, Col 0)
async function yA4() {
  if (process.platform !== "darwin" || Gs0) return;
  Gs0 = !0;
  let A = ZpA();
  if (A.mode !== "builtin" || LG()) return;
  let Q = A.command;
  if (!(await TQ("codesign", ["-vv", "-d", Q], {
      preserveOutputOnError: !1
    })).stdout.split(`
`).find((Z) => Z.includes("linker-signed"))) return;
  try {
    let Z = await TQ("codesign", ["--sign", "-", "--force", "--preserve-metadata=entitlements,requirements,flags,runtime", Q]);
    if (Z.code !== 0) e(Error(`Failed to sign ripgrep: ${Z.stdout} ${Z.stderr}`));
    let Y = await TQ("xattr", ["-d", "com.apple.quarantine", Q]);
    if (Y.code !== 0) e(Error(`Failed to remove quarantine: ${Y.stdout} ${Y.stderr}`))
  } catch (Z) {
    e(Z)
  }
}
// @from(Ln 16279, Col 4)
Zs0
// @from(Ln 16279, Col 9)
jA4
// @from(Ln 16279, Col 14)
TA4
// @from(Ln 16279, Col 19)
ZpA
// @from(Ln 16279, Col 24)
PA4 = 20000000
// @from(Ln 16280, Col 2)
Ys0 = !1
// @from(Ln 16281, Col 2)
YpA
// @from(Ln 16281, Col 7)
GpA = null
// @from(Ln 16282, Col 2)
xA4
// @from(Ln 16282, Col 7)
Gs0 = !1
// @from(Ln 16283, Col 4)
uy = w(() => {
  Y9();
  v1();
  t4();
  T1();
  fQ();
  Z0();
  c3();
  A0();
  Zs0 = c(dcA(), 1), jA4 = MA4(import.meta.url), TA4 = Ii.join(jA4, "../"), ZpA = W0(() => {
    if (iX(process.env.USE_BUILTIN_RIPGREP)) {
      let {
        cmd: G
      } = Zs0.findActualExecutable("rg", []);
      if (G !== "rg") return {
        mode: "system",
        command: "rg",
        args: []
      }
    }
    if (LG()) return {
      mode: "builtin",
      command: process.execPath,
      args: ["--ripgrep"]
    };
    let Q = Ii.resolve(TA4, "vendor", "ripgrep");
    return {
      mode: "builtin",
      command: process.platform === "win32" ? Ii.resolve(Q, "x64-win32", "rg.exe") : Ii.resolve(Q, `${process.arch}-${process.platform}`, "rg"),
      args: []
    }
  });
  YpA = W0(async (A, Q, B = []) => {
    if (Ii.resolve(A) === Ii.resolve(RA4())) return;
    try {
      let G = ["--files", "--hidden"];
      B.forEach((I) => {
        G.push("--glob", `!${I}`)
      });
      let Y = (await gy(G, A, Q)).length;
      if (Y === 0) return 0;
      let J = Math.floor(Math.log10(Y)),
        X = Math.pow(10, J);
      return Math.round(Y / X) * X
    } catch (G) {
      e(G instanceof Error ? G : Error(String(G)))
    }
  });
  xA4 = W0(async () => {
    if (GpA !== null) return;
    let A = ZpA();
    try {
      let Q = await TQ(A.command, [...A.args, "--version"], {
          timeout: 5000
        }),
        B = Q.code === 0 && !!Q.stdout && Q.stdout.startsWith("ripgrep ");
      GpA = {
        working: B,
        lastTested: Date.now(),
        config: A
      }, k(`Ripgrep first use test: ${B?"PASSED":"FAILED"} (mode=${A.mode}, path=${A.command})`), l("tengu_ripgrep_availability", {
        working: B ? 1 : 0,
        using_system: A.mode === "system" ? 1 : 0
      })
    } catch (Q) {
      GpA = {
        working: !1,
        lastTested: Date.now(),
        config: A
      }, e(Q instanceof Error ? Q : Error(String(Q)))
    }
  })
})
// @from(Ln 16356, Col 4)
Os0 = U((Ui7, Ls0) => {
  function GO1(A) {
    if (A instanceof Map) A.clear = A.delete = A.set = function () {
      throw Error("map is read-only")
    };
    else if (A instanceof Set) A.add = A.clear = A.delete = function () {
      throw Error("set is read-only")
    };
    return Object.freeze(A), Object.getOwnPropertyNames(A).forEach(function (Q) {
      var B = A[Q];
      if (typeof B == "object" && !Object.isFrozen(B)) GO1(B)
    }), A
  }
  var Hs0 = GO1,
    vA4 = GO1;
  Hs0.default = vA4;
  class QO1 {
    constructor(A) {
      if (A.data === void 0) A.data = {};
      this.data = A.data, this.isMatchIgnored = !1
    }
    ignoreMatch() {
      this.isMatchIgnored = !0
    }
  }

  function ZGA(A) {
    return A.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;")
  }

  function Di(A, ...Q) {
    let B = Object.create(null);
    for (let G in A) B[G] = A[G];
    return Q.forEach(function (G) {
      for (let Z in G) B[Z] = G[Z]
    }), B
  }
  var kA4 = "</span>",
    Is0 = (A) => {
      return !!A.kind
    };
  class Es0 {
    constructor(A, Q) {
      this.buffer = "", this.classPrefix = Q.classPrefix, A.walk(this)
    }
    addText(A) {
      this.buffer += ZGA(A)
    }
    openNode(A) {
      if (!Is0(A)) return;
      let Q = A.kind;
      if (!A.sublanguage) Q = `${this.classPrefix}${Q}`;
      this.span(Q)
    }
    closeNode(A) {
      if (!Is0(A)) return;
      this.buffer += kA4
    }
    value() {
      return this.buffer
    }
    span(A) {
      this.buffer += `<span class="${A}">`
    }
  }
  class ZO1 {
    constructor() {
      this.rootNode = {
        children: []
      }, this.stack = [this.rootNode]
    }
    get top() {
      return this.stack[this.stack.length - 1]
    }
    get root() {
      return this.rootNode
    }
    add(A) {
      this.top.children.push(A)
    }
    openNode(A) {
      let Q = {
        kind: A,
        children: []
      };
      this.add(Q), this.stack.push(Q)
    }
    closeNode() {
      if (this.stack.length > 1) return this.stack.pop();
      return
    }
    closeAllNodes() {
      while (this.closeNode());
    }
    toJSON() {
      return JSON.stringify(this.rootNode, null, 4)
    }
    walk(A) {
      return this.constructor._walk(A, this.rootNode)
    }
    static _walk(A, Q) {
      if (typeof Q === "string") A.addText(Q);
      else if (Q.children) A.openNode(Q), Q.children.forEach((B) => this._walk(A, B)), A.closeNode(Q);
      return A
    }
    static _collapse(A) {
      if (typeof A === "string") return;
      if (!A.children) return;
      if (A.children.every((Q) => typeof Q === "string")) A.children = [A.children.join("")];
      else A.children.forEach((Q) => {
        ZO1._collapse(Q)
      })
    }
  }
  class zs0 extends ZO1 {
    constructor(A) {
      super();
      this.options = A
    }
    addKeyword(A, Q) {
      if (A === "") return;
      this.openNode(Q), this.addText(A), this.closeNode()
    }
    addText(A) {
      if (A === "") return;
      this.add(A)
    }
    addSublanguage(A, Q) {
      let B = A.root;
      B.kind = Q, B.sublanguage = !0, this.add(B)
    }
    toHTML() {
      return new Es0(this, this.options).value()
    }
    finalize() {
      return !0
    }
  }

  function bA4(A) {
    return new RegExp(A.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"), "m")
  }

  function WUA(A) {
    if (!A) return null;
    if (typeof A === "string") return A;
    return A.source
  }

  function fA4(...A) {
    return A.map((B) => WUA(B)).join("")
  }

  function hA4(...A) {
    return "(" + A.map((B) => WUA(B)).join("|") + ")"
  }

  function gA4(A) {
    return new RegExp(A.toString() + "|").exec("").length - 1
  }

  function uA4(A, Q) {
    let B = A && A.exec(Q);
    return B && B.index === 0
  }
  var mA4 = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;

  function dA4(A, Q = "|") {
    let B = 0;
    return A.map((G) => {
      B += 1;
      let Z = B,
        Y = WUA(G),
        J = "";
      while (Y.length > 0) {
        let X = mA4.exec(Y);
        if (!X) {
          J += Y;
          break
        }
        if (J += Y.substring(0, X.index), Y = Y.substring(X.index + X[0].length), X[0][0] === "\\" && X[1]) J += "\\" + String(Number(X[1]) + Z);
        else if (J += X[0], X[0] === "(") B++
      }
      return J
    }).map((G) => `(${G})`).join(Q)
  }
  var cA4 = /\b\B/,
    $s0 = "[a-zA-Z]\\w*",
    YO1 = "[a-zA-Z_]\\w*",
    JO1 = "\\b\\d+(\\.\\d+)?",
    Cs0 = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",
    Us0 = "\\b(0b[01]+)",
    pA4 = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",
    lA4 = (A = {}) => {
      let Q = /^#![ ]*\//;
      if (A.binary) A.begin = fA4(Q, /.*\b/, A.binary, /\b.*/);
      return Di({
        className: "meta",
        begin: Q,
        end: /$/,
        relevance: 0,
        "on:begin": (B, G) => {
          if (B.index !== 0) G.ignoreMatch()
        }
      }, A)
    },
    KUA = {
      begin: "\\\\[\\s\\S]",
      relevance: 0
    },
    iA4 = {
      className: "string",
      begin: "'",
      end: "'",
      illegal: "\\n",
      contains: [KUA]
    },
    nA4 = {
      className: "string",
      begin: '"',
      end: '"',
      illegal: "\\n",
      contains: [KUA]
    },
    qs0 = {
      begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
    },
    XpA = function (A, Q, B = {}) {
      let G = Di({
        className: "comment",
        begin: A,
        end: Q,
        contains: []
      }, B);
      return G.contains.push(qs0), G.contains.push({
        className: "doctag",
        begin: "(?:TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):",
        relevance: 0
      }), G
    },
    aA4 = XpA("//", "$"),
    oA4 = XpA("/\\*", "\\*/"),
    rA4 = XpA("#", "$"),
    sA4 = {
      className: "number",
      begin: JO1,
      relevance: 0
    },
    tA4 = {
      className: "number",
      begin: Cs0,
      relevance: 0
    },
    eA4 = {
      className: "number",
      begin: Us0,
      relevance: 0
    },
    A14 = {
      className: "number",
      begin: JO1 + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
      relevance: 0
    },
    Q14 = {
      begin: /(?=\/[^/\n]*\/)/,
      contains: [{
        className: "regexp",
        begin: /\//,
        end: /\/[gimuy]*/,
        illegal: /\n/,
        contains: [KUA, {
          begin: /\[/,
          end: /\]/,
          relevance: 0,
          contains: [KUA]
        }]
      }]
    },
    B14 = {
      className: "title",
      begin: $s0,
      relevance: 0
    },
    G14 = {
      className: "title",
      begin: YO1,
      relevance: 0
    },
    Z14 = {
      begin: "\\.\\s*" + YO1,
      relevance: 0
    },
    Y14 = function (A) {
      return Object.assign(A, {
        "on:begin": (Q, B) => {
          B.data._beginMatch = Q[1]
        },
        "on:end": (Q, B) => {
          if (B.data._beginMatch !== Q[1]) B.ignoreMatch()
        }
      })
    },
    JpA = Object.freeze({
      __proto__: null,
      MATCH_NOTHING_RE: cA4,
      IDENT_RE: $s0,
      UNDERSCORE_IDENT_RE: YO1,
      NUMBER_RE: JO1,
      C_NUMBER_RE: Cs0,
      BINARY_NUMBER_RE: Us0,
      RE_STARTERS_RE: pA4,
      SHEBANG: lA4,
      BACKSLASH_ESCAPE: KUA,
      APOS_STRING_MODE: iA4,
      QUOTE_STRING_MODE: nA4,
      PHRASAL_WORDS_MODE: qs0,
      COMMENT: XpA,
      C_LINE_COMMENT_MODE: aA4,
      C_BLOCK_COMMENT_MODE: oA4,
      HASH_COMMENT_MODE: rA4,
      NUMBER_MODE: sA4,
      C_NUMBER_MODE: tA4,
      BINARY_NUMBER_MODE: eA4,
      CSS_NUMBER_MODE: A14,
      REGEXP_MODE: Q14,
      TITLE_MODE: B14,
      UNDERSCORE_TITLE_MODE: G14,
      METHOD_GUARD: Z14,
      END_SAME_AS_BEGIN: Y14
    });

  function J14(A, Q) {
    if (A.input[A.index - 1] === ".") Q.ignoreMatch()
  }

  function X14(A, Q) {
    if (!Q) return;
    if (!A.beginKeywords) return;
    if (A.begin = "\\b(" + A.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", A.__beforeBegin = J14, A.keywords = A.keywords || A.beginKeywords, delete A.beginKeywords, A.relevance === void 0) A.relevance = 0
  }

  function I14(A, Q) {
    if (!Array.isArray(A.illegal)) return;
    A.illegal = hA4(...A.illegal)
  }

  function D14(A, Q) {
    if (!A.match) return;
    if (A.begin || A.end) throw Error("begin & end are not supported with match");
    A.begin = A.match, delete A.match
  }

  function W14(A, Q) {
    if (A.relevance === void 0) A.relevance = 1
  }
  var K14 = ["of", "and", "for", "in", "not", "or", "if", "then", "parent", "list", "value"],
    V14 = "keyword";

  function Ns0(A, Q, B = V14) {
    let G = {};
    if (typeof A === "string") Z(B, A.split(" "));
    else if (Array.isArray(A)) Z(B, A);
    else Object.keys(A).forEach(function (Y) {
      Object.assign(G, Ns0(A[Y], Q, Y))
    });
    return G;

    function Z(Y, J) {
      if (Q) J = J.map((X) => X.toLowerCase());
      J.forEach(function (X) {
        let I = X.split("|");
        G[I[0]] = [Y, F14(I[0], I[1])]
      })
    }
  }

  function F14(A, Q) {
    if (Q) return Number(Q);
    return H14(A) ? 0 : 1
  }

  function H14(A) {
    return K14.includes(A.toLowerCase())
  }

  function E14(A, {
    plugins: Q
  }) {
    function B(X, I) {
      return new RegExp(WUA(X), "m" + (A.case_insensitive ? "i" : "") + (I ? "g" : ""))
    }
    class G {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0
      }
      addRule(X, I) {
        I.position = this.position++, this.matchIndexes[this.matchAt] = I, this.regexes.push([I, X]), this.matchAt += gA4(X) + 1
      }
      compile() {
        if (this.regexes.length === 0) this.exec = () => null;
        let X = this.regexes.map((I) => I[1]);
        this.matcherRe = B(dA4(X), !0), this.lastIndex = 0
      }
      exec(X) {
        this.matcherRe.lastIndex = this.lastIndex;
        let I = this.matcherRe.exec(X);
        if (!I) return null;
        let D = I.findIndex((K, V) => V > 0 && K !== void 0),
          W = this.matchIndexes[D];
        return I.splice(0, D), Object.assign(I, W)
      }
    }
    class Z {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0
      }
      getMatcher(X) {
        if (this.multiRegexes[X]) return this.multiRegexes[X];
        let I = new G;
        return this.rules.slice(X).forEach(([D, W]) => I.addRule(D, W)), I.compile(), this.multiRegexes[X] = I, I
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0
      }
      considerAll() {
        this.regexIndex = 0
      }
      addRule(X, I) {
        if (this.rules.push([X, I]), I.type === "begin") this.count++
      }
      exec(X) {
        let I = this.getMatcher(this.regexIndex);
        I.lastIndex = this.lastIndex;
        let D = I.exec(X);
        if (this.resumingScanAtSamePosition())
          if (D && D.index === this.lastIndex);
          else {
            let W = this.getMatcher(0);
            W.lastIndex = this.lastIndex + 1, D = W.exec(X)
          } if (D) {
          if (this.regexIndex += D.position + 1, this.regexIndex === this.count) this.considerAll()
        }
        return D
      }
    }

    function Y(X) {
      let I = new Z;
      if (X.contains.forEach((D) => I.addRule(D.begin, {
          rule: D,
          type: "begin"
        })), X.terminatorEnd) I.addRule(X.terminatorEnd, {
        type: "end"
      });
      if (X.illegal) I.addRule(X.illegal, {
        type: "illegal"
      });
      return I
    }

    function J(X, I) {
      let D = X;
      if (X.isCompiled) return D;
      [D14].forEach((K) => K(X, I)), A.compilerExtensions.forEach((K) => K(X, I)), X.__beforeBegin = null, [X14, I14, W14].forEach((K) => K(X, I)), X.isCompiled = !0;
      let W = null;
      if (typeof X.keywords === "object") W = X.keywords.$pattern, delete X.keywords.$pattern;
      if (X.keywords) X.keywords = Ns0(X.keywords, A.case_insensitive);
      if (X.lexemes && W) throw Error("ERR: Prefer `keywords.$pattern` to `mode.lexemes`, BOTH are not allowed. (see mode reference) ");
      if (W = W || X.lexemes || /\w+/, D.keywordPatternRe = B(W, !0), I) {
        if (!X.begin) X.begin = /\B|\b/;
        if (D.beginRe = B(X.begin), X.endSameAsBegin) X.end = X.begin;
        if (!X.end && !X.endsWithParent) X.end = /\B|\b/;
        if (X.end) D.endRe = B(X.end);
        if (D.terminatorEnd = WUA(X.end) || "", X.endsWithParent && I.terminatorEnd) D.terminatorEnd += (X.end ? "|" : "") + I.terminatorEnd
      }
      if (X.illegal) D.illegalRe = B(X.illegal);
      if (!X.contains) X.contains = [];
      if (X.contains = [].concat(...X.contains.map(function (K) {
          return z14(K === "self" ? X : K)
        })), X.contains.forEach(function (K) {
          J(K, D)
        }), X.starts) J(X.starts, I);
      return D.matcher = Y(D), D
    }
    if (!A.compilerExtensions) A.compilerExtensions = [];
    if (A.contains && A.contains.includes("self")) throw Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return A.classNameAliases = Di(A.classNameAliases || {}), J(A)
  }

  function ws0(A) {
    if (!A) return !1;
    return A.endsWithParent || ws0(A.starts)
  }

  function z14(A) {
    if (A.variants && !A.cachedVariants) A.cachedVariants = A.variants.map(function (Q) {
      return Di(A, {
        variants: null
      }, Q)
    });
    if (A.cachedVariants) return A.cachedVariants;
    if (ws0(A)) return Di(A, {
      starts: A.starts ? Di(A.starts) : null
    });
    if (Object.isFrozen(A)) return Di(A);
    return A
  }
  var $14 = "10.7.3";

  function C14(A) {
    return Boolean(A || A === "")
  }

  function U14(A) {
    let Q = {
      props: ["language", "code", "autodetect"],
      data: function () {
        return {
          detectedLanguage: "",
          unknownLanguage: !1
        }
      },
      computed: {
        className() {
          if (this.unknownLanguage) return "";
          return "hljs " + this.detectedLanguage
        },
        highlighted() {
          if (!this.autoDetect && !A.getLanguage(this.language)) return console.warn(`The language "${this.language}" you specified could not be found.`), this.unknownLanguage = !0, ZGA(this.code);
          let G = {};
          if (this.autoDetect) G = A.highlightAuto(this.code), this.detectedLanguage = G.language;
          else G = A.highlight(this.language, this.code, this.ignoreIllegals), this.detectedLanguage = this.language;
          return G.value
        },
        autoDetect() {
          return !this.language || C14(this.autodetect)
        },
        ignoreIllegals() {
          return !0
        }
      },
      render(G) {
        return G("pre", {}, [G("code", {
          class: this.className,
          domProps: {
            innerHTML: this.highlighted
          }
        })])
      }
    };
    return {
      Component: Q,
      VuePlugin: {
        install(G) {
          G.component("highlightjs", Q)
        }
      }
    }
  }
  var q14 = {
    "after:highlightElement": ({
      el: A,
      result: Q,
      text: B
    }) => {
      let G = Ds0(A);
      if (!G.length) return;
      let Z = document.createElement("div");
      Z.innerHTML = Q.value, Q.value = N14(G, Ds0(Z), B)
    }
  };

  function BO1(A) {
    return A.nodeName.toLowerCase()
  }

  function Ds0(A) {
    let Q = [];
    return function B(G, Z) {
      for (let Y = G.firstChild; Y; Y = Y.nextSibling)
        if (Y.nodeType === 3) Z += Y.nodeValue.length;
        else if (Y.nodeType === 1) {
        if (Q.push({
            event: "start",
            offset: Z,
            node: Y
          }), Z = B(Y, Z), !BO1(Y).match(/br|hr|img|input/)) Q.push({
          event: "stop",
          offset: Z,
          node: Y
        })
      }
      return Z
    }(A, 0), Q
  }

  function N14(A, Q, B) {
    let G = 0,
      Z = "",
      Y = [];

    function J() {
      if (!A.length || !Q.length) return A.length ? A : Q;
      if (A[0].offset !== Q[0].offset) return A[0].offset < Q[0].offset ? A : Q;
      return Q[0].event === "start" ? A : Q
    }

    function X(W) {
      function K(V) {
        return " " + V.nodeName + '="' + ZGA(V.value) + '"'
      }
      Z += "<" + BO1(W) + [].map.call(W.attributes, K).join("") + ">"
    }

    function I(W) {
      Z += "</" + BO1(W) + ">"
    }

    function D(W) {
      (W.event === "start" ? X : I)(W.node)
    }
    while (A.length || Q.length) {
      let W = J();
      if (Z += ZGA(B.substring(G, W[0].offset)), G = W[0].offset, W === A) {
        Y.reverse().forEach(I);
        do D(W.splice(0, 1)[0]), W = J(); while (W === A && W.length && W[0].offset === G);
        Y.reverse().forEach(X)
      } else {
        if (W[0].event === "start") Y.push(W[0].node);
        else Y.pop();
        D(W.splice(0, 1)[0])
      }
    }
    return Z + ZGA(B.substr(G))
  }
  var Ws0 = {},
    eL1 = (A) => {
      console.error(A)
    },
    Ks0 = (A, ...Q) => {
      console.log(`WARN: ${A}`, ...Q)
    },
    fM = (A, Q) => {
      if (Ws0[`${A}/${Q}`]) return;
      console.log(`Deprecated as of ${A}. ${Q}`), Ws0[`${A}/${Q}`] = !0
    },
    AO1 = ZGA,
    Vs0 = Di,
    Fs0 = Symbol("nomatch"),
    w14 = function (A) {
      let Q = Object.create(null),
        B = Object.create(null),
        G = [],
        Z = !0,
        Y = /(^(<[^>]+>|\t|)+|\n)/gm,
        J = "Could not find the language '{}', did you forget to load/include a language module?",
        X = {
          disableAutodetect: !0,
          name: "Plain text",
          contains: []
        },
        I = {
          noHighlightRe: /^(no-?highlight)$/i,
          languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
          classPrefix: "hljs-",
          tabReplace: null,
          useBR: !1,
          languages: null,
          __emitter: zs0
        };

      function D(IA) {
        return I.noHighlightRe.test(IA)
      }

      function W(IA) {
        let HA = IA.className + " ";
        HA += IA.parentNode ? IA.parentNode.className : "";
        let ZA = I.languageDetectRe.exec(HA);
        if (ZA) {
          let zA = p(ZA[1]);
          if (!zA) Ks0(J.replace("{}", ZA[1])), Ks0("Falling back to no-highlight mode for this block.", IA);
          return zA ? ZA[1] : "no-highlight"
        }
        return HA.split(/\s+/).find((zA) => D(zA) || p(zA))
      }

      function K(IA, HA, ZA, zA) {
        let wA = "",
          _A = "";
        if (typeof HA === "object") wA = IA, ZA = HA.ignoreIllegals, _A = HA.language, zA = void 0;
        else fM("10.7.0", "highlight(lang, code, ...args) has been deprecated."), fM("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), _A = IA, wA = HA;
        let s = {
          code: wA,
          language: _A
        };
        bA("before:highlight", s);
        let t = s.result ? s.result : V(s.language, s.code, ZA, zA);
        return t.code = s.code, bA("after:highlight", t), t
      }

      function V(IA, HA, ZA, zA) {
        function wA($1, i1) {
          let Q0 = SA.case_insensitive ? i1[0].toLowerCase() : i1[0];
          return Object.prototype.hasOwnProperty.call($1.keywords, Q0) && $1.keywords[Q0]
        }

        function _A() {
          if (!S1.keywords) {
            VQ.addText(t0);
            return
          }
          let $1 = 0;
          S1.keywordPatternRe.lastIndex = 0;
          let i1 = S1.keywordPatternRe.exec(t0),
            Q0 = "";
          while (i1) {
            Q0 += t0.substring($1, i1.index);
            let c0 = wA(S1, i1);
            if (c0) {
              let [b0, UA] = c0;
              if (VQ.addText(Q0), Q0 = "", QQ += UA, b0.startsWith("_")) Q0 += i1[0];
              else {
                let RA = SA.classNameAliases[b0] || b0;
                VQ.addKeyword(i1[0], RA)
              }
            } else Q0 += i1[0];
            $1 = S1.keywordPatternRe.lastIndex, i1 = S1.keywordPatternRe.exec(t0)
          }
          Q0 += t0.substr($1), VQ.addText(Q0)
        }

        function s() {
          if (t0 === "") return;
          let $1 = null;
          if (typeof S1.subLanguage === "string") {
            if (!Q[S1.subLanguage]) {
              VQ.addText(t0);
              return
            }
            $1 = V(S1.subLanguage, t0, !0, L0[S1.subLanguage]), L0[S1.subLanguage] = $1.top
          } else $1 = H(t0, S1.subLanguage.length ? S1.subLanguage : null);
          if (S1.relevance > 0) QQ += $1.relevance;
          VQ.addSublanguage($1.emitter, $1.language)
        }

        function t() {
          if (S1.subLanguage != null) s();
          else _A();
          t0 = ""
        }

        function BA($1) {
          if ($1.className) VQ.openNode(SA.classNameAliases[$1.className] || $1.className);
          return S1 = Object.create($1, {
            parent: {
              value: S1
            }
          }), S1
        }

        function DA($1, i1, Q0) {
          let c0 = uA4($1.endRe, Q0);
          if (c0) {
            if ($1["on:end"]) {
              let b0 = new QO1($1);
              if ($1["on:end"](i1, b0), b0.isMatchIgnored) c0 = !1
            }
            if (c0) {
              while ($1.endsParent && $1.parent) $1 = $1.parent;
              return $1
            }
          }
          if ($1.endsWithParent) return DA($1.parent, i1, Q0)
        }

        function CA($1) {
          if (S1.matcher.regexIndex === 0) return t0 += $1[0], 1;
          else return K1 = !0, 0
        }

        function FA($1) {
          let i1 = $1[0],
            Q0 = $1.rule,
            c0 = new QO1(Q0),
            b0 = [Q0.__beforeBegin, Q0["on:begin"]];
          for (let UA of b0) {
            if (!UA) continue;
            if (UA($1, c0), c0.isMatchIgnored) return CA(i1)
          }
          if (Q0 && Q0.endSameAsBegin) Q0.endRe = bA4(i1);
          if (Q0.skip) t0 += i1;
          else {
            if (Q0.excludeBegin) t0 += i1;
            if (t(), !Q0.returnBegin && !Q0.excludeBegin) t0 = i1
          }
          return BA(Q0), Q0.returnBegin ? 0 : i1.length
        }

        function xA($1) {
          let i1 = $1[0],
            Q0 = HA.substr($1.index),
            c0 = DA(S1, $1, Q0);
          if (!c0) return Fs0;
          let b0 = S1;
          if (b0.skip) t0 += i1;
          else {
            if (!(b0.returnEnd || b0.excludeEnd)) t0 += i1;
            if (t(), b0.excludeEnd) t0 = i1
          }
          do {
            if (S1.className) VQ.closeNode();
            if (!S1.skip && !S1.subLanguage) QQ += S1.relevance;
            S1 = S1.parent
          } while (S1 !== c0.parent);
          if (c0.starts) {
            if (c0.endSameAsBegin) c0.starts.endRe = c0.endRe;
            BA(c0.starts)
          }
          return b0.returnEnd ? 0 : i1.length
        }

        function mA() {
          let $1 = [];
          for (let i1 = S1; i1 !== SA; i1 = i1.parent)
            if (i1.className) $1.unshift(i1.className);
          $1.forEach((i1) => VQ.openNode(i1))
        }
        let G1 = {};

        function J1($1, i1) {
          let Q0 = i1 && i1[0];
          if (t0 += $1, Q0 == null) return t(), 0;
          if (G1.type === "begin" && i1.type === "end" && G1.index === i1.index && Q0 === "") {
            if (t0 += HA.slice(i1.index, i1.index + 1), !Z) {
              let c0 = Error("0 width match regex");
              throw c0.languageName = IA, c0.badRule = G1.rule, c0
            }
            return 1
          }
          if (G1 = i1, i1.type === "begin") return FA(i1);
          else if (i1.type === "illegal" && !ZA) {
            let c0 = Error('Illegal lexeme "' + Q0 + '" for mode "' + (S1.className || "<unnamed>") + '"');
            throw c0.mode = S1, c0
          } else if (i1.type === "end") {
            let c0 = xA(i1);
            if (c0 !== Fs0) return c0
          }
          if (i1.type === "illegal" && Q0 === "") return 1;
          if (qQ > 1e5 && qQ > i1.index * 3) throw Error("potential infinite loop, way more iterations than matches");
          return t0 += Q0, Q0.length
        }
        let SA = p(IA);
        if (!SA) throw eL1(J.replace("{}", IA)), Error('Unknown language: "' + IA + '"');
        let A1 = E14(SA, {
            plugins: G
          }),
          n1 = "",
          S1 = zA || A1,
          L0 = {},
          VQ = new I.__emitter(I);
        mA();
        let t0 = "",
          QQ = 0,
          y1 = 0,
          qQ = 0,
          K1 = !1;
        try {
          S1.matcher.considerAll();
          for (;;) {
            if (qQ++, K1) K1 = !1;
            else S1.matcher.considerAll();
            S1.matcher.lastIndex = y1;
            let $1 = S1.matcher.exec(HA);
            if (!$1) break;
            let i1 = HA.substring(y1, $1.index),
              Q0 = J1(i1, $1);
            y1 = $1.index + Q0
          }
          return J1(HA.substr(y1)), VQ.closeAllNodes(), VQ.finalize(), n1 = VQ.toHTML(), {
            relevance: Math.floor(QQ),
            value: n1,
            language: IA,
            illegal: !1,
            emitter: VQ,
            top: S1
          }
        } catch ($1) {
          if ($1.message && $1.message.includes("Illegal")) return {
            illegal: !0,
            illegalBy: {
              msg: $1.message,
              context: HA.slice(y1 - 100, y1 + 100),
              mode: $1.mode
            },
            sofar: n1,
            relevance: 0,
            value: AO1(HA),
            emitter: VQ
          };
          else if (Z) return {
            illegal: !1,
            relevance: 0,
            value: AO1(HA),
            emitter: VQ,
            language: IA,
            top: S1,
            errorRaised: $1
          };
          else throw $1
        }
      }

      function F(IA) {
        let HA = {
          relevance: 0,
          emitter: new I.__emitter(I),
          value: AO1(IA),
          illegal: !1,
          top: X
        };
        return HA.emitter.addText(IA), HA
      }

      function H(IA, HA) {
        HA = HA || I.languages || Object.keys(Q);
        let ZA = F(IA),
          zA = HA.filter(p).filter(WA).map((BA) => V(BA, IA, !1));
        zA.unshift(ZA);
        let wA = zA.sort((BA, DA) => {
            if (BA.relevance !== DA.relevance) return DA.relevance - BA.relevance;
            if (BA.language && DA.language) {
              if (p(BA.language).supersetOf === DA.language) return 1;
              else if (p(DA.language).supersetOf === BA.language) return -1
            }
            return 0
          }),
          [_A, s] = wA,
          t = _A;
        return t.second_best = s, t
      }

      function E(IA) {
        if (!(I.tabReplace || I.useBR)) return IA;
        return IA.replace(Y, (HA) => {
          if (HA === `
`) return I.useBR ? "<br>" : HA;
          else if (I.tabReplace) return HA.replace(/\t/g, I.tabReplace);
          return HA
        })
      }

      function z(IA, HA, ZA) {
        let zA = HA ? B[HA] : ZA;
        if (IA.classList.add("hljs"), zA) IA.classList.add(zA)
      }
      let $ = {
          "before:highlightElement": ({
            el: IA
          }) => {
            if (I.useBR) IA.innerHTML = IA.innerHTML.replace(/\n/g, "").replace(/<br[ /]*>/g, `
`)
          },
          "after:highlightElement": ({
            result: IA
          }) => {
            if (I.useBR) IA.value = IA.value.replace(/\n/g, "<br>")
          }
        },
        O = /^(<[^>]+>|\t)+/gm,
        L = {
          "after:highlightElement": ({
            result: IA
          }) => {
            if (I.tabReplace) IA.value = IA.value.replace(O, (HA) => HA.replace(/\t/g, I.tabReplace))
          }
        };

      function M(IA) {
        let HA = null,
          ZA = W(IA);
        if (D(ZA)) return;
        bA("before:highlightElement", {
          el: IA,
          language: ZA
        }), HA = IA;
        let zA = HA.textContent,
          wA = ZA ? K(zA, {
            language: ZA,
            ignoreIllegals: !0
          }) : H(zA);
        if (bA("after:highlightElement", {
            el: IA,
            result: wA,
            text: zA
          }), IA.innerHTML = wA.value, z(IA, ZA, wA.language), IA.result = {
            language: wA.language,
            re: wA.relevance,
            relavance: wA.relevance
          }, wA.second_best) IA.second_best = {
          language: wA.second_best.language,
          re: wA.second_best.relevance,
          relavance: wA.second_best.relevance
        }
      }

      function _(IA) {
        if (IA.useBR) fM("10.3.0", "'useBR' will be removed entirely in v11.0"), fM("10.3.0", "Please see https://github.com/highlightjs/highlight.js/issues/2559");
        I = Vs0(I, IA)
      }
      let j = () => {
        if (j.called) return;
        j.called = !0, fM("10.6.0", "initHighlighting() is deprecated.  Use highlightAll() instead."), document.querySelectorAll("pre code").forEach(M)
      };

      function x() {
        fM("10.6.0", "initHighlightingOnLoad() is deprecated.  Use highlightAll() instead."), b = !0
      }
      let b = !1;

      function S() {
        if (document.readyState === "loading") {
          b = !0;
          return
        }
        document.querySelectorAll("pre code").forEach(M)
      }

      function u() {
        if (b) S()
      }
      if (typeof window < "u" && window.addEventListener) window.addEventListener("DOMContentLoaded", u, !1);

      function f(IA, HA) {
        let ZA = null;
        try {
          ZA = HA(A)
        } catch (zA) {
          if (eL1("Language definition for '{}' could not be registered.".replace("{}", IA)), !Z) throw zA;
          else eL1(zA);
          ZA = X
        }
        if (!ZA.name) ZA.name = IA;
        if (Q[IA] = ZA, ZA.rawDefinition = HA.bind(null, A), ZA.aliases) GA(ZA.aliases, {
          languageName: IA
        })
      }

      function AA(IA) {
        delete Q[IA];
        for (let HA of Object.keys(B))
          if (B[HA] === IA) delete B[HA]
      }

      function n() {
        return Object.keys(Q)
      }

      function y(IA) {
        fM("10.4.0", "requireLanguage will be removed entirely in v11."), fM("10.4.0", "Please see https://github.com/highlightjs/highlight.js/pull/2844");
        let HA = p(IA);
        if (HA) return HA;
        throw Error("The '{}' language is required, but not loaded.".replace("{}", IA))
      }

      function p(IA) {
        return IA = (IA || "").toLowerCase(), Q[IA] || Q[B[IA]]
      }

      function GA(IA, {
        languageName: HA
      }) {
        if (typeof IA === "string") IA = [IA];
        IA.forEach((ZA) => {
          B[ZA.toLowerCase()] = HA
        })
      }

      function WA(IA) {
        let HA = p(IA);
        return HA && !HA.disableAutodetect
      }

      function MA(IA) {
        if (IA["before:highlightBlock"] && !IA["before:highlightElement"]) IA["before:highlightElement"] = (HA) => {
          IA["before:highlightBlock"](Object.assign({
            block: HA.el
          }, HA))
        };
        if (IA["after:highlightBlock"] && !IA["after:highlightElement"]) IA["after:highlightElement"] = (HA) => {
          IA["after:highlightBlock"](Object.assign({
            block: HA.el
          }, HA))
        }
      }

      function TA(IA) {
        MA(IA), G.push(IA)
      }

      function bA(IA, HA) {
        let ZA = IA;
        G.forEach(function (zA) {
          if (zA[ZA]) zA[ZA](HA)
        })
      }

      function jA(IA) {
        return fM("10.2.0", "fixMarkup will be removed entirely in v11.0"), fM("10.2.0", "Please see https://github.com/highlightjs/highlight.js/issues/2534"), E(IA)
      }

      function OA(IA) {
        return fM("10.7.0", "highlightBlock will be removed entirely in v12.0"), fM("10.7.0", "Please use highlightElement now."), M(IA)
      }
      Object.assign(A, {
        highlight: K,
        highlightAuto: H,
        highlightAll: S,
        fixMarkup: jA,
        highlightElement: M,
        highlightBlock: OA,
        configure: _,
        initHighlighting: j,
        initHighlightingOnLoad: x,
        registerLanguage: f,
        unregisterLanguage: AA,
        listLanguages: n,
        getLanguage: p,
        registerAliases: GA,
        requireLanguage: y,
        autoDetection: WA,
        inherit: Vs0,
        addPlugin: TA,
        vuePlugin: U14(A).VuePlugin
      }), A.debugMode = function () {
        Z = !1
      }, A.safeMode = function () {
        Z = !0
      }, A.versionString = $14;
      for (let IA in JpA)
        if (typeof JpA[IA] === "object") Hs0(JpA[IA]);
      return Object.assign(A, JpA), A.addPlugin($), A.addPlugin(q14), A.addPlugin(L), A
    },
    L14 = w14({});
  Ls0.exports = L14
})
// @from(Ln 17503, Col 4)
Rs0 = U((qi7, Ms0) => {
  function O14(A) {
    var Q = "[A-Za-zА-Яа-яёЁ_][A-Za-zА-Яа-яёЁ_0-9]+",
      B = "далее ",
      G = "возврат вызватьисключение выполнить для если и из или иначе иначеесли исключение каждого конецесли " + "конецпопытки конеццикла не новый перейти перем по пока попытка прервать продолжить тогда цикл экспорт ",
      Z = B + G,
      Y = "загрузитьизфайла ",
      J = "вебклиент вместо внешнеесоединение клиент конецобласти мобильноеприложениеклиент мобильноеприложениесервер " + "наклиенте наклиентенасервере наклиентенасерверебезконтекста насервере насерверебезконтекста область перед " + "после сервер толстыйклиентобычноеприложение толстыйклиентуправляемоеприложение тонкийклиент ",
      X = Y + J,
      I = "разделительстраниц разделительстрок символтабуляции ",
      D = "ansitooem oemtoansi ввестивидсубконто ввестиперечисление ввестипериод ввестиплансчетов выбранныйплансчетов " + "датагод датамесяц датачисло заголовоксистемы значениевстроку значениеизстроки каталогиб каталогпользователя " + "кодсимв конгода конецпериодаби конецрассчитанногопериодаби конецстандартногоинтервала конквартала конмесяца " + "коннедели лог лог10 максимальноеколичествосубконто названиеинтерфейса названиенабораправ назначитьвид " + "назначитьсчет найтиссылки началопериодаби началостандартногоинтервала начгода начквартала начмесяца " + "начнедели номерднягода номерднянедели номернеделигода обработкаожидания основнойжурналрасчетов " + "основнойплансчетов основнойязык очиститьокносообщений периодстр получитьвремята получитьдатута " + "получитьдокументта получитьзначенияотбора получитьпозициюта получитьпустоезначение получитьта " + "префиксавтонумерации пропись пустоезначение разм разобратьпозициюдокумента рассчитатьрегистрына " + "рассчитатьрегистрыпо симв создатьобъект статусвозврата стрколичествострок сформироватьпозициюдокумента " + "счетпокоду текущеевремя типзначения типзначениястр установитьтана установитьтапо фиксшаблон шаблон ",
      W = "acos asin atan base64значение base64строка cos exp log log10 pow sin sqrt tan xmlзначение xmlстрока " + "xmlтип xmlтипзнч активноеокно безопасныйрежим безопасныйрежимразделенияданных булево ввестидату ввестизначение " + "ввестистроку ввестичисло возможностьчтенияxml вопрос восстановитьзначение врег выгрузитьжурналрегистрации " + "выполнитьобработкуоповещения выполнитьпроверкуправдоступа вычислить год данныеформывзначение дата день деньгода " + "деньнедели добавитьмесяц заблокироватьданныедляредактирования заблокироватьработупользователя завершитьработусистемы " + "загрузитьвнешнююкомпоненту закрытьсправку записатьjson записатьxml записатьдатуjson записьжурналарегистрации " + "заполнитьзначениясвойств запроситьразрешениепользователя запуститьприложение запуститьсистему зафиксироватьтранзакцию " + "значениевданныеформы значениевстрокувнутр значениевфайл значениезаполнено значениеизстрокивнутр значениеизфайла " + "изxmlтипа импортмоделиxdto имякомпьютера имяпользователя инициализироватьпредопределенныеданные информацияобошибке " + "каталогбиблиотекимобильногоустройства каталогвременныхфайлов каталогдокументов каталогпрограммы кодироватьстроку " + "кодлокализацииинформационнойбазы кодсимвола командасистемы конецгода конецдня конецквартала конецмесяца конецминуты " + "конецнедели конецчаса конфигурациябазыданныхизмененадинамически конфигурацияизменена копироватьданныеформы " + "копироватьфайл краткоепредставлениеошибки лев макс местноевремя месяц мин минута монопольныйрежим найти " + "найтинедопустимыесимволыxml найтиокнопонавигационнойссылке найтипомеченныенаудаление найтипоссылкам найтифайлы " + "началогода началодня началоквартала началомесяца началоминуты началонедели началочаса начатьзапросразрешенияпользователя " + "начатьзапускприложения начатькопированиефайла начатьперемещениефайла начатьподключениевнешнейкомпоненты " + "начатьподключениерасширенияработыскриптографией начатьподключениерасширенияработысфайлами начатьпоискфайлов " + "начатьполучениекаталогавременныхфайлов начатьполучениекаталогадокументов начатьполучениерабочегокаталогаданныхпользователя " + "начатьполучениефайлов начатьпомещениефайла начатьпомещениефайлов начатьсозданиедвоичныхданныхизфайла начатьсозданиекаталога " + "начатьтранзакцию начатьудалениефайлов начатьустановкувнешнейкомпоненты начатьустановкурасширенияработыскриптографией " + "начатьустановкурасширенияработысфайлами неделягода необходимостьзавершениясоединения номерсеансаинформационнойбазы " + "номерсоединенияинформационнойбазы нрег нстр обновитьинтерфейс обновитьнумерациюобъектов обновитьповторноиспользуемыезначения " + "обработкапрерыванияпользователя объединитьфайлы окр описаниеошибки оповестить оповеститьобизменении " + "отключитьобработчикзапросанастроекклиенталицензирования отключитьобработчикожидания отключитьобработчикоповещения " + "открытьзначение открытьиндекссправки открытьсодержаниесправки открытьсправку открытьформу открытьформумодально " + "отменитьтранзакцию очиститьжурналрегистрации очиститьнастройкипользователя очиститьсообщения параметрыдоступа " + "перейтипонавигационнойссылке переместитьфайл подключитьвнешнююкомпоненту " + "подключитьобработчикзапросанастроекклиенталицензирования подключитьобработчикожидания подключитьобработчикоповещения " + "подключитьрасширениеработыскриптографией подключитьрасширениеработысфайлами подробноепредставлениеошибки " + "показатьвводдаты показатьвводзначения показатьвводстроки показатьвводчисла показатьвопрос показатьзначение " + "показатьинформациюобошибке показатьнакарте показатьоповещениепользователя показатьпредупреждение полноеимяпользователя " + "получитьcomобъект получитьxmlтип получитьадреспоместоположению получитьблокировкусеансов получитьвремязавершенияспящегосеанса " + "получитьвремязасыпанияпассивногосеанса получитьвремяожиданияблокировкиданных получитьданныевыбора " + "получитьдополнительныйпараметрклиенталицензирования получитьдопустимыекодылокализации получитьдопустимыечасовыепояса " + "получитьзаголовокклиентскогоприложения получитьзаголовоксистемы получитьзначенияотборажурналарегистрации " + "получитьидентификаторконфигурации получитьизвременногохранилища получитьимявременногофайла " + "получитьимяклиенталицензирования получитьинформациюэкрановклиента получитьиспользованиежурналарегистрации " + "получитьиспользованиесобытияжурналарегистрации получитькраткийзаголовокприложения получитьмакетоформления " + "получитьмаскувсефайлы получитьмаскувсефайлыклиента получитьмаскувсефайлысервера получитьместоположениепоадресу " + "получитьминимальнуюдлинупаролейпользователей получитьнавигационнуюссылку получитьнавигационнуюссылкуинформационнойбазы " + "получитьобновлениеконфигурациибазыданных получитьобновлениепредопределенныхданныхинформационнойбазы получитьобщиймакет " + "получитьобщуюформу получитьокна получитьоперативнуюотметкувремени получитьотключениебезопасногорежима " + "получитьпараметрыфункциональныхопцийинтерфейса получитьполноеимяпредопределенногозначения " + "получитьпредставлениянавигационныхссылок получитьпроверкусложностипаролейпользователей получитьразделительпути " + "получитьразделительпутиклиента получитьразделительпутисервера получитьсеансыинформационнойбазы " + "получитьскоростьклиентскогосоединения получитьсоединенияинформационнойбазы получитьсообщенияпользователю " + "получитьсоответствиеобъектаиформы получитьсоставстандартногоинтерфейсаodata получитьструктурухранениябазыданных " + "получитьтекущийсеансинформационнойбазы получитьфайл получитьфайлы получитьформу получитьфункциональнуюопцию " + "получитьфункциональнуюопциюинтерфейса получитьчасовойпоясинформационнойбазы пользователиос поместитьвовременноехранилище " + "поместитьфайл поместитьфайлы прав праводоступа предопределенноезначение представлениекодалокализации представлениепериода " + "представлениеправа представлениеприложения представлениесобытияжурналарегистрации представлениечасовогопояса предупреждение " + "прекратитьработусистемы привилегированныйрежим продолжитьвызов прочитатьjson прочитатьxml прочитатьдатуjson пустаястрока " + "рабочийкаталогданныхпользователя разблокироватьданныедляредактирования разделитьфайл разорватьсоединениесвнешнимисточникомданных " + "раскодироватьстроку рольдоступна секунда сигнал символ скопироватьжурналрегистрации смещениелетнеговремени " + "смещениестандартноговремени соединитьбуферыдвоичныхданных создатькаталог создатьфабрикуxdto сокрл сокрлп сокрп сообщить " + "состояние сохранитьзначение сохранитьнастройкипользователя сред стрдлина стрзаканчиваетсяна стрзаменить стрнайти стрначинаетсяс " + "строка строкасоединенияинформационнойбазы стрполучитьстроку стрразделить стрсоединить стрсравнить стрчисловхождений " + "стрчислострок стршаблон текущаядата текущаядатасеанса текущаяуниверсальнаядата текущаяуниверсальнаядатавмиллисекундах " + "текущийвариантинтерфейсаклиентскогоприложения текущийвариантосновногошрифтаклиентскогоприложения текущийкодлокализации " + "текущийрежимзапуска текущийязык текущийязыксистемы тип типзнч транзакцияактивна трег удалитьданныеинформационнойбазы " + "удалитьизвременногохранилища удалитьобъекты удалитьфайлы универсальноевремя установитьбезопасныйрежим " + "установитьбезопасныйрежимразделенияданных установитьблокировкусеансов установитьвнешнююкомпоненту " + "установитьвремязавершенияспящегосеанса установитьвремязасыпанияпассивногосеанса установитьвремяожиданияблокировкиданных " + "установитьзаголовокклиентскогоприложения установитьзаголовоксистемы установитьиспользованиежурналарегистрации " + "установитьиспользованиесобытияжурналарегистрации установитькраткийзаголовокприложения " + "установитьминимальнуюдлинупаролейпользователей установитьмонопольныйрежим установитьнастройкиклиенталицензирования " + "установитьобновлениепредопределенныхданныхинформационнойбазы установитьотключениебезопасногорежима " + "установитьпараметрыфункциональныхопцийинтерфейса установитьпривилегированныйрежим " + "установитьпроверкусложностипаролейпользователей установитьрасширениеработыскриптографией " + "установитьрасширениеработысфайлами установитьсоединениесвнешнимисточникомданных установитьсоответствиеобъектаиформы " + "установитьсоставстандартногоинтерфейсаodata установитьчасовойпоясинформационнойбазы установитьчасовойпояссеанса " + "формат цел час часовойпояс часовойпояссеанса число числопрописью этоадресвременногохранилища ",
      K = "wsссылки библиотекакартинок библиотекамакетовоформлениякомпоновкиданных библиотекастилей бизнеспроцессы " + "внешниеисточникиданных внешниеобработки внешниеотчеты встроенныепокупки главныйинтерфейс главныйстиль " + "документы доставляемыеуведомления журналыдокументов задачи информацияобинтернетсоединении использованиерабочейдаты " + "историяработыпользователя константы критерииотбора метаданные обработки отображениерекламы отправкадоставляемыхуведомлений " + "отчеты панельзадачос параметрзапуска параметрысеанса перечисления планывидоврасчета планывидовхарактеристик " + "планыобмена планысчетов полнотекстовыйпоиск пользователиинформационнойбазы последовательности проверкавстроенныхпокупок " + "рабочаядата расширенияконфигурации регистрыбухгалтерии регистрынакопления регистрырасчета регистрысведений " + "регламентныезадания сериализаторxdto справочники средствагеопозиционирования средствакриптографии средствамультимедиа " + "средстваотображениярекламы средствапочты средствателефонии фабрикаxdto файловыепотоки фоновыезадания хранилищанастроек " + "хранилищевариантовотчетов хранилищенастроекданныхформ хранилищеобщихнастроек хранилищепользовательскихнастроекдинамическихсписков " + "хранилищепользовательскихнастроекотчетов хранилищесистемныхнастроек ",
      V = I + D + W + K,
      F = "webцвета windowsцвета windowsшрифты библиотекакартинок рамкистиля символы цветастиля шрифтыстиля ",
      H = "автоматическоесохранениеданныхформывнастройках автонумерациявформе автораздвижениесерий " + "анимациядиаграммы вариантвыравниванияэлементовизаголовков вариантуправлениявысотойтаблицы " + "вертикальнаяпрокруткаформы вертикальноеположение вертикальноеположениеэлемента видгруппыформы " + "виддекорацииформы виддополненияэлементаформы видизмененияданных видкнопкиформы видпереключателя " + "видподписейкдиаграмме видполяформы видфлажка влияниеразмеранапузырекдиаграммы горизонтальноеположение " + "горизонтальноеположениеэлемента группировкаколонок группировкаподчиненныхэлементовформы " + "группыиэлементы действиеперетаскивания дополнительныйрежимотображения допустимыедействияперетаскивания " + "интервалмеждуэлементамиформы использованиевывода использованиеполосыпрокрутки " + "используемоезначениеточкибиржевойдиаграммы историявыборапривводе источникзначенийоситочекдиаграммы " + "источникзначенияразмерапузырькадиаграммы категориягруппыкоманд максимумсерий начальноеотображениедерева " + "начальноеотображениесписка обновлениетекстаредактирования ориентациядендрограммы ориентациядиаграммы " + "ориентацияметокдиаграммы ориентацияметоксводнойдиаграммы ориентацияэлементаформы отображениевдиаграмме " + "отображениевлегендедиаграммы отображениегруппыкнопок отображениезаголовкашкалыдиаграммы " + "отображениезначенийсводнойдиаграммы отображениезначенияизмерительнойдиаграммы " + "отображениеинтерваладиаграммыганта отображениекнопки отображениекнопкивыбора отображениеобсужденийформы " + "отображениеобычнойгруппы отображениеотрицательныхзначенийпузырьковойдиаграммы отображениепанелипоиска " + "отображениеподсказки отображениепредупрежденияприредактировании отображениеразметкиполосырегулирования " + "отображениестраницформы отображениетаблицы отображениетекстазначениядиаграммыганта " + "отображениеуправленияобычнойгруппы отображениефигурыкнопки палитрацветовдиаграммы поведениеобычнойгруппы " + "поддержкамасштабадендрограммы поддержкамасштабадиаграммыганта поддержкамасштабасводнойдиаграммы " + "поисквтаблицепривводе положениезаголовкаэлементаформы положениекартинкикнопкиформы " + "положениекартинкиэлементаграфическойсхемы положениекоманднойпанелиформы положениекоманднойпанелиэлементаформы " + "положениеопорнойточкиотрисовки положениеподписейкдиаграмме положениеподписейшкалызначенийизмерительнойдиаграммы " + "положениесостоянияпросмотра положениестрокипоиска положениетекстасоединительнойлинии положениеуправленияпоиском " + "положениешкалывремени порядокотображенияточекгоризонтальнойгистограммы порядоксерийвлегендедиаграммы " + "размеркартинки расположениезаголовкашкалыдиаграммы растягиваниеповертикалидиаграммыганта " + "режимавтоотображениясостояния режимвводастроктаблицы режимвыборанезаполненного режимвыделениядаты " + "режимвыделениястрокитаблицы режимвыделениятаблицы режимизмененияразмера режимизменениясвязанногозначения " + "режимиспользованиядиалогапечати режимиспользованияпараметракоманды режиммасштабированияпросмотра " + "режимосновногоокнаклиентскогоприложения режимоткрытияокнаформы режимотображениявыделения " + "режимотображениягеографическойсхемы режимотображениязначенийсерии режимотрисовкисеткиграфическойсхемы " + "режимполупрозрачностидиаграммы режимпробеловдиаграммы режимразмещениянастранице режимредактированияколонки " + "режимсглаживаниядиаграммы режимсглаживанияиндикатора режимсписказадач сквозноевыравнивание " + "сохранениеданныхформывнастройках способзаполнениятекстазаголовкашкалыдиаграммы " + "способопределенияограничивающегозначениядиаграммы стандартнаягруппакоманд стандартноеоформление " + "статусоповещенияпользователя стильстрелки типаппроксимациилиниитрендадиаграммы типдиаграммы " + "типединицышкалывремени типимпортасерийслоягеографическойсхемы типлиниигеографическойсхемы типлиниидиаграммы " + "типмаркерагеографическойсхемы типмаркерадиаграммы типобластиоформления " + "типорганизацииисточникаданныхгеографическойсхемы типотображениясериислоягеографическойсхемы " + "типотображенияточечногообъектагеографическойсхемы типотображенияшкалыэлементалегендыгеографическойсхемы " + "типпоискаобъектовгеографическойсхемы типпроекциигеографическойсхемы типразмещенияизмерений " + "типразмещенияреквизитовизмерений типрамкиэлементауправления типсводнойдиаграммы " + "типсвязидиаграммыганта типсоединениязначенийпосериямдиаграммы типсоединенияточекдиаграммы " + "типсоединительнойлинии типстороныэлементаграфическойсхемы типформыотчета типшкалырадарнойдиаграммы " + "факторлиниитрендадиаграммы фигуракнопки фигурыграфическойсхемы фиксациявтаблице форматдняшкалывремени " + "форматкартинки ширинаподчиненныхэлементовформы ",
      E = "виддвижениябухгалтерии виддвижениянакопления видпериодарегистрарасчета видсчета видточкимаршрутабизнеспроцесса " + "использованиеагрегатарегистранакопления использованиегруппиэлементов использованиережимапроведения " + "использованиесреза периодичностьагрегатарегистранакопления режимавтовремя режимзаписидокумента режимпроведениядокумента ",
      z = "авторегистрацияизменений допустимыйномерсообщения отправкаэлементаданных получениеэлементаданных ",
      $ = "использованиерасшифровкитабличногодокумента ориентациястраницы положениеитоговколоноксводнойтаблицы " + "положениеитоговстроксводнойтаблицы положениетекстаотносительнокартинки расположениезаголовкагруппировкитабличногодокумента " + "способчтениязначенийтабличногодокумента типдвустороннейпечати типзаполненияобластитабличногодокумента " + "типкурсоровтабличногодокумента типлиниирисункатабличногодокумента типлинииячейкитабличногодокумента " + "типнаправленияпереходатабличногодокумента типотображениявыделениятабличногодокумента типотображениялинийсводнойтаблицы " + "типразмещениятекстатабличногодокумента типрисункатабличногодокумента типсмещениятабличногодокумента " + "типузоратабличногодокумента типфайлатабличногодокумента точностьпечати чередованиерасположениястраниц ",
      O = "отображениевремениэлементовпланировщика ",
      L = "типфайлаформатированногодокумента ",
      M = "обходрезультатазапроса типзаписизапроса ",
      _ = "видзаполнениярасшифровкипостроителяотчета типдобавленияпредставлений типизмеренияпостроителяотчета типразмещенияитогов ",
      j = "доступкфайлу режимдиалогавыборафайла режимоткрытияфайла ",
      x = "типизмеренияпостроителязапроса ",
      b = "видданныханализа методкластеризации типединицыинтервалавременианализаданных типзаполнениятаблицырезультатаанализаданных " + "типиспользованиячисловыхзначенийанализаданных типисточникаданныхпоискаассоциаций типколонкианализаданныхдереворешений " + "типколонкианализаданныхкластеризация типколонкианализаданныхобщаястатистика типколонкианализаданныхпоискассоциаций " + "типколонкианализаданныхпоискпоследовательностей типколонкимоделипрогноза типмерырасстоянияанализаданных " + "типотсеченияправилассоциации типполяанализаданных типстандартизациианализаданных типупорядочиванияправилассоциациианализаданных " + "типупорядочиванияшаблоновпоследовательностейанализаданных типупрощениядереварешений ",
      S = "wsнаправлениепараметра вариантxpathxs вариантзаписидатыjson вариантпростоготипаxs видгруппымоделиxs видфасетаxdto " + "действиепостроителяdom завершенностьпростоготипаxs завершенностьсоставноготипаxs завершенностьсхемыxs запрещенныеподстановкиxs " + "исключениягруппподстановкиxs категорияиспользованияатрибутаxs категорияограниченияидентичностиxs категорияограниченияпространствименxs " + "методнаследованияxs модельсодержимогоxs назначениетипаxml недопустимыеподстановкиxs обработкапробельныхсимволовxs обработкасодержимогоxs " + "ограничениезначенияxs параметрыотбораузловdom переносстрокjson позициявдокументеdom пробельныесимволыxml типатрибутаxml типзначенияjson " + "типканоническогоxml типкомпонентыxs типпроверкиxml типрезультатаdomxpath типузлаdom типузлаxml формаxml формапредставленияxs " + "форматдатыjson экранированиесимволовjson ",
      u = "видсравнениякомпоновкиданных действиеобработкирасшифровкикомпоновкиданных направлениесортировкикомпоновкиданных " + "расположениевложенныхэлементоврезультатакомпоновкиданных расположениеитоговкомпоновкиданных расположениегруппировкикомпоновкиданных " + "расположениеполейгруппировкикомпоновкиданных расположениеполякомпоновкиданных расположениереквизитовкомпоновкиданных " + "расположениересурсовкомпоновкиданных типбухгалтерскогоостаткакомпоновкиданных типвыводатекстакомпоновкиданных " + "типгруппировкикомпоновкиданных типгруппыэлементовотборакомпоновкиданных типдополненияпериодакомпоновкиданных " + "типзаголовкаполейкомпоновкиданных типмакетагруппировкикомпоновкиданных типмакетаобластикомпоновкиданных типостаткакомпоновкиданных " + "типпериодакомпоновкиданных типразмещениятекстакомпоновкиданных типсвязинаборовданныхкомпоновкиданных типэлементарезультатакомпоновкиданных " + "расположениелегендыдиаграммыкомпоновкиданных типпримененияотборакомпоновкиданных режимотображенияэлементанастройкикомпоновкиданных " + "режимотображениянастроеккомпоновкиданных состояниеэлементанастройкикомпоновкиданных способвосстановлениянастроеккомпоновкиданных " + "режимкомпоновкирезультата использованиепараметракомпоновкиданных автопозицияресурсовкомпоновкиданных " + "вариантиспользованиягруппировкикомпоновкиданных расположениересурсоввдиаграммекомпоновкиданных фиксациякомпоновкиданных " + "использованиеусловногооформлениякомпоновкиданных ",
      f = "важностьинтернетпочтовогосообщения обработкатекстаинтернетпочтовогосообщения способкодированияинтернетпочтовоговложения " + "способкодированиянеasciiсимволовинтернетпочтовогосообщения типтекстапочтовогосообщения протоколинтернетпочты " + "статусразборапочтовогосообщения ",
      AA = "режимтранзакциизаписижурналарегистрации статустранзакциизаписижурналарегистрации уровеньжурналарегистрации ",
      n = "расположениехранилищасертификатовкриптографии режимвключениясертификатовкриптографии режимпроверкисертификатакриптографии " + "типхранилищасертификатовкриптографии ",
      y = "кодировкаименфайловвzipфайле методсжатияzip методшифрованияzip режимвосстановленияпутейфайловzip режимобработкиподкаталоговzip " + "режимсохраненияпутейzip уровеньсжатияzip ",
      p = "звуковоеоповещение направлениепереходакстроке позициявпотоке порядокбайтов режимблокировкиданных режимуправленияблокировкойданных " + "сервисвстроенныхпокупок состояниефоновогозадания типподписчикадоставляемыхуведомлений уровеньиспользованиязащищенногосоединенияftp ",
      GA = "направлениепорядкасхемызапроса типдополненияпериодамисхемызапроса типконтрольнойточкисхемызапроса типобъединениясхемызапроса " + "типпараметрадоступнойтаблицысхемызапроса типсоединениясхемызапроса ",
      WA = "httpметод автоиспользованиеобщегореквизита автопрефиксномеразадачи вариантвстроенногоязыка видиерархии видрегистранакопления " + "видтаблицывнешнегоисточникаданных записьдвиженийприпроведении заполнениепоследовательностей индексирование " + "использованиебазыпланавидоврасчета использованиебыстроговыбора использованиеобщегореквизита использованиеподчинения " + "использованиеполнотекстовогопоиска использованиеразделяемыхданныхобщегореквизита использованиереквизита " + "назначениеиспользованияприложения назначениерасширенияконфигурации направлениепередачи обновлениепредопределенныхданных " + "оперативноепроведение основноепредставлениевидарасчета основноепредставлениевидахарактеристики основноепредставлениезадачи " + "основноепредставлениепланаобмена основноепредставлениесправочника основноепредставлениесчета перемещениеграницыприпроведении " + "периодичностьномерабизнеспроцесса периодичностьномерадокумента периодичностьрегистрарасчета периодичностьрегистрасведений " + "повторноеиспользованиевозвращаемыхзначений полнотекстовыйпоискпривводепостроке принадлежностьобъекта проведение " + "разделениеаутентификацииобщегореквизита разделениеданныхобщегореквизита разделениерасширенийконфигурацииобщегореквизита " + "режимавтонумерацииобъектов режимзаписирегистра режимиспользованиямодальности " + "режимиспользованиясинхронныхвызововрасширенийплатформыивнешнихкомпонент режимповторногоиспользованиясеансов " + "режимполученияданныхвыборапривводепостроке режимсовместимости режимсовместимостиинтерфейса " + "режимуправленияблокировкойданныхпоумолчанию сериикодовпланавидовхарактеристик сериикодовпланасчетов " + "сериикодовсправочника созданиепривводе способвыбора способпоискастрокипривводепостроке способредактирования " + "типданныхтаблицывнешнегоисточникаданных типкодапланавидоврасчета типкодасправочника типмакета типномерабизнеспроцесса " + "типномерадокумента типномеразадачи типформы удалениедвижений ",
      MA = "важностьпроблемыприменениярасширенияконфигурации вариантинтерфейсаклиентскогоприложения вариантмасштабаформклиентскогоприложения " + "вариантосновногошрифтаклиентскогоприложения вариантстандартногопериода вариантстандартнойдатыначала видграницы видкартинки " + "видотображенияполнотекстовогопоиска видрамки видсравнения видцвета видчисловогозначения видшрифта допустимаядлина допустимыйзнак " + "использованиеbyteordermark использованиеметаданныхполнотекстовогопоиска источникрасширенийконфигурации клавиша кодвозвратадиалога " + "кодировкаxbase кодировкатекста направлениепоиска направлениесортировки обновлениепредопределенныхданных обновлениеприизмененииданных " + "отображениепанелиразделов проверказаполнения режимдиалогавопрос режимзапускаклиентскогоприложения режимокругления режимоткрытияформприложения " + "режимполнотекстовогопоиска скоростьклиентскогосоединения состояниевнешнегоисточникаданных состояниеобновленияконфигурациибазыданных " + "способвыборасертификатаwindows способкодированиястроки статуссообщения типвнешнейкомпоненты типплатформы типповеденияклавишиenter " + "типэлементаинформацииовыполненииобновленияконфигурациибазыданных уровеньизоляциитранзакций хешфункция частидаты",
      TA = F + H + E + z + $ + O + L + M + _ + j + x + b + S + u + f + AA + n + y + p + GA + WA + MA,
      bA = "comобъект ftpсоединение httpзапрос httpсервисответ httpсоединение wsопределения wsпрокси xbase анализданных аннотацияxs " + "блокировкаданных буфердвоичныхданных включениеxs выражениекомпоновкиданных генераторслучайныхчисел географическаясхема " + "географическиекоординаты графическаясхема группамоделиxs данныерасшифровкикомпоновкиданных двоичныеданные дендрограмма " + "диаграмма диаграммаганта диалогвыборафайла диалогвыборацвета диалогвыборашрифта диалограсписаниярегламентногозадания " + "диалогредактированиястандартногопериода диапазон документdom документhtml документацияxs доставляемоеуведомление " + "записьdom записьfastinfoset записьhtml записьjson записьxml записьzipфайла записьданных записьтекста записьузловdom " + "запрос защищенноесоединениеopenssl значенияполейрасшифровкикомпоновкиданных извлечениетекста импортxs интернетпочта " + "интернетпочтовоесообщение интернетпочтовыйпрофиль интернетпрокси интернетсоединение информациядляприложенияxs " + "использованиеатрибутаxs использованиесобытияжурналарегистрации источникдоступныхнастроеккомпоновкиданных " + "итераторузловdom картинка квалификаторыдаты квалификаторыдвоичныхданных квалификаторыстроки квалификаторычисла " + "компоновщикмакетакомпоновкиданных компоновщикнастроеккомпоновкиданных конструктормакетаоформлениякомпоновкиданных " + "конструкторнастроеккомпоновкиданных конструкторформатнойстроки линия макеткомпоновкиданных макетобластикомпоновкиданных " + "макетоформлениякомпоновкиданных маскаxs менеджеркриптографии наборсхемxml настройкикомпоновкиданных настройкисериализацииjson " + "обработкакартинок обработкарасшифровкикомпоновкиданных обходдереваdom объявлениеатрибутаxs объявлениенотацииxs " + "объявлениеэлементаxs описаниеиспользованиясобытиядоступжурналарегистрации " + "описаниеиспользованиясобытияотказвдоступежурналарегистрации описаниеобработкирасшифровкикомпоновкиданных " + "описаниепередаваемогофайла описаниетипов определениегруппыатрибутовxs определениегруппымоделиxs " + "определениеограниченияидентичностиxs определениепростоготипаxs определениесоставноготипаxs определениетипадокументаdom " + "определенияxpathxs отборкомпоновкиданных пакетотображаемыхдокументов параметрвыбора параметркомпоновкиданных " + "параметрызаписиjson параметрызаписиxml параметрычтенияxml переопределениеxs планировщик полеанализаданных " + "полекомпоновкиданных построительdom построительзапроса построительотчета построительотчетаанализаданных " + "построительсхемxml поток потоквпамяти почта почтовоесообщение преобразованиеxsl преобразованиекканоническомуxml " + "процессорвыводарезультатакомпоновкиданныхвколлекциюзначений процессорвыводарезультатакомпоновкиданныхвтабличныйдокумент " + "процессоркомпоновкиданных разыменовательпространствименdom рамка расписаниерегламентногозадания расширенноеимяxml " + "результатчтенияданных своднаядиаграмма связьпараметравыбора связьпотипу связьпотипукомпоновкиданных сериализаторxdto " + "сертификатклиентаwindows сертификатклиентафайл сертификаткриптографии сертификатыудостоверяющихцентровwindows " + "сертификатыудостоверяющихцентровфайл сжатиеданных системнаяинформация сообщениепользователю сочетаниеклавиш " + "сравнениезначений стандартнаядатаначала стандартныйпериод схемаxml схемакомпоновкиданных табличныйдокумент " + "текстовыйдокумент тестируемоеприложение типданныхxml уникальныйидентификатор фабрикаxdto файл файловыйпоток " + "фасетдлиныxs фасетколичестваразрядовдробнойчастиxs фасетмаксимальноговключающегозначенияxs " + "фасетмаксимальногоисключающегозначенияxs фасетмаксимальнойдлиныxs фасетминимальноговключающегозначенияxs " + "фасетминимальногоисключающегозначенияxs фасетминимальнойдлиныxs фасетобразцаxs фасетобщегоколичестваразрядовxs " + "фасетперечисленияxs фасетпробельныхсимволовxs фильтрузловdom форматированнаястрока форматированныйдокумент " + "фрагментxs хешированиеданных хранилищезначения цвет чтениеfastinfoset чтениеhtml чтениеjson чтениеxml чтениеzipфайла " + "чтениеданных чтениетекста чтениеузловdom шрифт элементрезультатакомпоновкиданных ",
      jA = "comsafearray деревозначений массив соответствие списокзначений структура таблицазначений фиксированнаяструктура " + "фиксированноесоответствие фиксированныймассив ",
      OA = bA + jA,
      IA = "null истина ложь неопределено",
      HA = A.inherit(A.NUMBER_MODE),
      ZA = {
        className: "string",
        begin: '"|\\|',
        end: '"|$',
        contains: [{
          begin: '""'
        }]
      },
      zA = {
        begin: "'",
        end: "'",
        excludeBegin: !0,
        excludeEnd: !0,
        contains: [{
          className: "number",
          begin: "\\d{4}([\\.\\\\/:-]?\\d{2}){0,5}"
        }]
      },
      wA = A.inherit(A.C_LINE_COMMENT_MODE),
      _A = {
        className: "meta",
        begin: "#|&",
        end: "$",
        keywords: {
          $pattern: Q,
          "meta-keyword": Z + X
        },
        contains: [wA]
      },
      s = {
        className: "symbol",
        begin: "~",
        end: ";|:",
        excludeEnd: !0
      },
      t = {
        className: "function",
        variants: [{
          begin: "процедура|функция",
          end: "\\)",
          keywords: "процедура функция"
        }, {
          begin: "конецпроцедуры|конецфункции",
          keywords: "конецпроцедуры конецфункции"
        }],
        contains: [{
          begin: "\\(",
          end: "\\)",
          endsParent: !0,
          contains: [{
            className: "params",
            begin: Q,
            end: ",",
            excludeEnd: !0,
            endsWithParent: !0,
            keywords: {
              $pattern: Q,
              keyword: "знач",
              literal: IA
            },
            contains: [HA, ZA, zA]
          }, wA]
        }, A.inherit(A.TITLE_MODE, {
          begin: Q
        })]
      };
    return {
      name: "1C:Enterprise",
      case_insensitive: !0,
      keywords: {
        $pattern: Q,
        keyword: Z,
        built_in: V,
        class: TA,
        type: OA,
        literal: IA
      },
      contains: [_A, t, wA, s, HA, ZA, zA]
    }
  }
  Ms0.exports = O14
})
// @from(Ln 17627, Col 4)
js0 = U((Ni7, _s0) => {
  function M14(A) {
    if (!A) return null;
    if (typeof A === "string") return A;
    return A.source
  }

  function R14(...A) {
    return A.map((B) => M14(B)).join("")
  }

  function _14(A) {
    let Q = {
        ruleDeclaration: /^[a-zA-Z][a-zA-Z0-9-]*/,
        unexpectedChars: /[!@#$^&',?+~`|:]/
      },
      B = ["ALPHA", "BIT", "CHAR", "CR", "CRLF", "CTL", "DIGIT", "DQUOTE", "HEXDIG", "HTAB", "LF", "LWSP", "OCTET", "SP", "VCHAR", "WSP"],
      G = A.COMMENT(/;/, /$/),
      Z = {
        className: "symbol",
        begin: /%b[0-1]+(-[0-1]+|(\.[0-1]+)+){0,1}/
      },
      Y = {
        className: "symbol",
        begin: /%d[0-9]+(-[0-9]+|(\.[0-9]+)+){0,1}/
      },
      J = {
        className: "symbol",
        begin: /%x[0-9A-F]+(-[0-9A-F]+|(\.[0-9A-F]+)+){0,1}/
      },
      X = {
        className: "symbol",
        begin: /%[si]/
      },
      I = {
        className: "attribute",
        begin: R14(Q.ruleDeclaration, /(?=\s*=)/)
      };
    return {
      name: "Augmented Backus-Naur Form",
      illegal: Q.unexpectedChars,
      keywords: B,
      contains: [I, G, Z, Y, J, X, A.QUOTE_STRING_MODE, A.NUMBER_MODE]
    }
  }
  _s0.exports = _14
})
// @from(Ln 17674, Col 4)
Ss0 = U((wi7, Ps0) => {
  function Ts0(A) {
    if (!A) return null;
    if (typeof A === "string") return A;
    return A.source
  }

  function j14(...A) {
    return A.map((B) => Ts0(B)).join("")
  }

  function T14(...A) {
    return "(" + A.map((B) => Ts0(B)).join("|") + ")"
  }

  function P14(A) {
    let Q = ["GET", "POST", "HEAD", "PUT", "DELETE", "CONNECT", "OPTIONS", "PATCH", "TRACE"];
    return {
      name: "Apache Access Log",
      contains: [{
        className: "number",
        begin: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d{1,5})?\b/,
        relevance: 5
      }, {
        className: "number",
        begin: /\b\d+\b/,
        relevance: 0
      }, {
        className: "string",
        begin: j14(/"/, T14(...Q)),
        end: /"/,
        keywords: Q,
        illegal: /\n/,
        relevance: 5,
        contains: [{
          begin: /HTTP\/[12]\.\d'/,
          relevance: 5
        }]
      }, {
        className: "string",
        begin: /\[\d[^\]\n]{8,}\]/,
        illegal: /\n/,
        relevance: 1
      }, {
        className: "string",
        begin: /\[/,
        end: /\]/,
        illegal: /\n/,
        relevance: 0
      }, {
        className: "string",
        begin: /"Mozilla\/\d\.\d \(/,
        end: /"/,
        illegal: /\n/,
        relevance: 3
      }, {
        className: "string",
        begin: /"/,
        end: /"/,
        illegal: /\n/,
        relevance: 0
      }]
    }
  }
  Ps0.exports = P14
})
// @from(Ln 17740, Col 4)
ys0 = U((Li7, xs0) => {
  function S14(A) {
    if (!A) return null;
    if (typeof A === "string") return A;
    return A.source
  }

  function x14(...A) {
    return A.map((B) => S14(B)).join("")
  }

  function y14(A) {
    let Q = /[a-zA-Z_$][a-zA-Z0-9_$]*/,
      B = /([*]|[a-zA-Z_$][a-zA-Z0-9_$]*)/,
      G = {
        className: "rest_arg",
        begin: /[.]{3}/,
        end: Q,
        relevance: 10
      };
    return {
      name: "ActionScript",
      aliases: ["as"],
      keywords: {
        keyword: "as break case catch class const continue default delete do dynamic each else extends final finally for function get if implements import in include instanceof interface internal is namespace native new override package private protected public return set static super switch this throw try typeof use var void while with",
        literal: "true false null undefined"
      },
      contains: [A.APOS_STRING_MODE, A.QUOTE_STRING_MODE, A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE, A.C_NUMBER_MODE, {
        className: "class",
        beginKeywords: "package",
        end: /\{/,
        contains: [A.TITLE_MODE]
      }, {
        className: "class",
        beginKeywords: "class interface",
        end: /\{/,
        excludeEnd: !0,
        contains: [{
          beginKeywords: "extends implements"
        }, A.TITLE_MODE]
      }, {
        className: "meta",
        beginKeywords: "import include",
        end: /;/,
        keywords: {
          "meta-keyword": "import include"
        }
      }, {
        className: "function",
        beginKeywords: "function",
        end: /[{;]/,
        excludeEnd: !0,
        illegal: /\S/,
        contains: [A.TITLE_MODE, {
          className: "params",
          begin: /\(/,
          end: /\)/,
          contains: [A.APOS_STRING_MODE, A.QUOTE_STRING_MODE, A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE, G]
        }, {
          begin: x14(/:\s*/, B)
        }]
      }, A.METHOD_GUARD],
      illegal: /#/
    }
  }
  xs0.exports = y14
})