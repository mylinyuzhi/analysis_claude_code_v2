
// @from(Start 352793, End 353121)
Uj0 = (A, {
    timeout: Q,
    killSignal: B = "SIGTERM"
  }, G) => {
    if (Q === 0 || Q === void 0) return G;
    let Z, I = new Promise((J, W) => {
        Z = setTimeout(() => {
          as9(A, B, W)
        }, Q)
      }),
      Y = G.finally(() => {
        clearTimeout(Z)
      });
    return Promise.race([I, Y])
  }
// @from(Start 353125, End 353326)
$j0 = ({
    timeout: A
  }) => {
    if (A !== void 0 && (!Number.isFinite(A) || A < 0)) throw TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${A}\` (${typeof A})`)
  }
// @from(Start 353330, End 353516)
wj0 = async (A, {
    cleanup: Q,
    detached: B
  }, G) => {
    if (!Q || B) return G;
    let Z = SyA(() => {
      A.kill()
    });
    return G.finally(() => {
      Z()
    })
  }
// @from(Start 353522, End 353548)
qj0 = L(() => {
  AD1()
})
// @from(Start 353551, End 353647)
function _yA(A) {
  return A !== null && typeof A === "object" && typeof A.pipe === "function"
}
// @from(Start 353649, End 353779)
function QD1(A) {
  return _yA(A) && A.writable !== !1 && typeof A._write === "function" && typeof A._writableState === "object"
}
// @from(Start 353898, End 353959)
os9 = (A) => A instanceof rs9 && typeof A.then === "function"
// @from(Start 353963, End 354326)
BD1 = (A, Q, B) => {
    if (typeof B === "string") return A[Q].pipe(ss9(B)), A;
    if (QD1(B)) return A[Q].pipe(B), A;
    if (!os9(B)) throw TypeError("The second argument must be a string, a stream or an Execa child process.");
    if (!QD1(B.stdin)) throw TypeError("The target child process's stdin must be available.");
    return A[Q].pipe(B.stdin), B
  }
// @from(Start 354330, End 354559)
Nj0 = (A) => {
    if (A.stdout !== null) A.pipeStdout = BD1.bind(void 0, A, "stdout");
    if (A.stderr !== null) A.pipeStderr = BD1.bind(void 0, A, "stderr");
    if (A.all !== void 0) A.pipeAll = BD1.bind(void 0, A, "all")
  }
// @from(Start 354565, End 354579)
Lj0 = () => {}
// @from(Start 354585, End 355389)
iFA = async (A, {
  init: Q,
  convertChunk: B,
  getSize: G,
  truncateChunk: Z,
  addChunk: I,
  getFinalChunk: Y,
  finalize: J
}, {
  maxBuffer: W = Number.POSITIVE_INFINITY
} = {}) => {
  if (!es9(A)) throw Error("The first argument must be a Readable, a ReadableStream, or an async iterable.");
  let X = Q();
  X.length = 0;
  try {
    for await (let V of A) {
      let F = Ar9(V),
        K = B[F](V, X);
      Rj0({
        convertedChunk: K,
        state: X,
        getSize: G,
        truncateChunk: Z,
        addChunk: I,
        maxBuffer: W
      })
    }
    return ts9({
      state: X,
      convertChunk: B,
      getSize: G,
      truncateChunk: Z,
      addChunk: I,
      getFinalChunk: Y,
      maxBuffer: W
    }), J(X)
  } catch (V) {
    throw V.bufferedData = J(X), V
  }
}
// @from(Start 355391, End 355661)
ts9 = ({
  state: A,
  getSize: Q,
  truncateChunk: B,
  addChunk: G,
  getFinalChunk: Z,
  maxBuffer: I
}) => {
  let Y = Z(A);
  if (Y !== void 0) Rj0({
    convertedChunk: Y,
    state: A,
    getSize: Q,
    truncateChunk: B,
    addChunk: G,
    maxBuffer: I
  })
}
// @from(Start 355663, End 355951)
Rj0 = ({
  convertedChunk: A,
  state: Q,
  getSize: B,
  truncateChunk: G,
  addChunk: Z,
  maxBuffer: I
}) => {
  let Y = B(A),
    J = Q.length + Y;
  if (J <= I) {
    Mj0(A, Q, Z, J);
    return
  }
  let W = G(A, I - Q.length);
  if (W !== void 0) Mj0(W, Q, Z, I);
  throw new GD1
}
// @from(Start 355953, End 356018)
Mj0 = (A, Q, B, G) => {
  Q.contents = B(A, Q, G), Q.length = G
}
// @from(Start 356020, End 356117)
es9 = (A) => typeof A === "object" && A !== null && typeof A[Symbol.asyncIterator] === "function"
// @from(Start 356119, End 356595)
Ar9 = (A) => {
  let Q = typeof A;
  if (Q === "string") return "string";
  if (Q !== "object" || A === null) return "others";
  if (globalThis.Buffer?.isBuffer(A)) return "buffer";
  let B = Oj0.call(A);
  if (B === "[object ArrayBuffer]") return "arrayBuffer";
  if (B === "[object DataView]") return "dataView";
  if (Number.isInteger(A.byteLength) && Number.isInteger(A.byteOffset) && Oj0.call(A.buffer) === "[object ArrayBuffer]") return "typedArray";
  return "others"
}
// @from(Start 356597, End 356600)
Oj0
// @from(Start 356602, End 356605)
GD1
// @from(Start 356611, End 356804)
nFA = L(() => {
  ({
    toString: Oj0
  } = Object.prototype);
  GD1 = class GD1 extends Error {
    name = "MaxBufferError";
    constructor() {
      super("maxBuffer exceeded")
    }
  }
})
// @from(Start 356810, End 356824)
ZD1 = (A) => A
// @from(Start 356828, End 356856)
ID1 = () => {
    return
  }
// @from(Start 356860, End 356894)
YD1 = ({
    contents: A
  }) => A
// @from(Start 356898, End 356990)
kyA = (A) => {
    throw Error(`Streams in object mode are not supported: ${String(A)}`)
  }
// @from(Start 356994, End 357015)
yyA = (A) => A.length
// @from(Start 357021, End 357047)
Tj0 = L(() => {
  nFA()
})
// @from(Start 357049, End 357101)
async function JD1(A, Q) {
  return iFA(A, Xr9, Q)
}
// @from(Start 357106, End 357158)
Qr9 = () => ({
    contents: new ArrayBuffer(0)
  })
// @from(Start 357162, End 357188)
Br9 = (A) => Gr9.encode(A)
// @from(Start 357192, End 357195)
Gr9
// @from(Start 357197, End 357227)
Pj0 = (A) => new Uint8Array(A)
// @from(Start 357231, End 357296)
jj0 = (A) => new Uint8Array(A.buffer, A.byteOffset, A.byteLength)
// @from(Start 357300, End 357329)
Zr9 = (A, Q) => A.slice(0, Q)
// @from(Start 357333, End 357477)
Ir9 = (A, {
    contents: Q,
    length: B
  }, G) => {
    let Z = kj0() ? Jr9(Q, G) : Yr9(Q, G);
    return new Uint8Array(Z).set(A, B), Z
  }
// @from(Start 357481, End 357634)
Yr9 = (A, Q) => {
    if (Q <= A.byteLength) return A;
    let B = new ArrayBuffer(_j0(Q));
    return new Uint8Array(B).set(new Uint8Array(A), 0), B
  }
// @from(Start 357638, End 357839)
Jr9 = (A, Q) => {
    if (Q <= A.maxByteLength) return A.resize(Q), A;
    let B = new ArrayBuffer(Q, {
      maxByteLength: _j0(Q)
    });
    return new Uint8Array(B).set(new Uint8Array(A), 0), B
  }
// @from(Start 357843, End 357901)
_j0 = (A) => Sj0 ** Math.ceil(Math.log(A) / Math.log(Sj0))
// @from(Start 357905, End 357912)
Sj0 = 2
// @from(Start 357916, End 357989)
Wr9 = ({
    contents: A,
    length: Q
  }) => kj0() ? A : A.slice(0, Q)
// @from(Start 357993, End 358040)
kj0 = () => ("resize" in ArrayBuffer.prototype)
// @from(Start 358044, End 358047)
Xr9
// @from(Start 358053, End 358386)
WD1 = L(() => {
  nFA();
  Gr9 = new TextEncoder, Xr9 = {
    init: Qr9,
    convertChunk: {
      string: Br9,
      buffer: Pj0,
      arrayBuffer: Pj0,
      dataView: jj0,
      typedArray: jj0,
      others: kyA
    },
    getSize: yyA,
    truncateChunk: Zr9,
    addChunk: Ir9,
    getFinalChunk: ID1,
    finalize: Wr9
  }
})
// @from(Start 358388, End 358659)
async function xyA(A, Q) {
  if (!("Buffer" in globalThis)) throw Error("getStreamAsBuffer() is only supported in Node.js");
  try {
    return yj0(await JD1(A, Q))
  } catch (B) {
    if (B.bufferedData !== void 0) B.bufferedData = yj0(B.bufferedData);
    throw B
  }
}
// @from(Start 358664, End 358702)
yj0 = (A) => globalThis.Buffer.from(A)
// @from(Start 358708, End 358734)
xj0 = L(() => {
  WD1()
})
// @from(Start 358736, End 358788)
async function XD1(A, Q) {
  return iFA(A, Hr9, Q)
}
// @from(Start 358793, End 358863)
Vr9 = () => ({
    contents: "",
    textDecoder: new TextDecoder
  })
// @from(Start 358867, End 358939)
vyA = (A, {
    textDecoder: Q
  }) => Q.decode(A, {
    stream: !0
  })
// @from(Start 358943, End 358984)
Fr9 = (A, {
    contents: Q
  }) => Q + A
// @from(Start 358988, End 359017)
Kr9 = (A, Q) => A.slice(0, Q)
// @from(Start 359021, End 359119)
Dr9 = ({
    textDecoder: A
  }) => {
    let Q = A.decode();
    return Q === "" ? void 0 : Q
  }
// @from(Start 359123, End 359126)
Hr9
// @from(Start 359132, End 359442)
vj0 = L(() => {
  nFA();
  Hr9 = {
    init: Vr9,
    convertChunk: {
      string: ZD1,
      buffer: vyA,
      arrayBuffer: vyA,
      dataView: vyA,
      typedArray: vyA,
      others: kyA
    },
    getSize: yyA,
    truncateChunk: Kr9,
    addChunk: Fr9,
    getFinalChunk: Dr9,
    finalize: YD1
  }
})
// @from(Start 359448, End 359510)
bj0 = L(() => {
  Tj0();
  WD1();
  xj0();
  vj0();
  nFA()
})
// @from(Start 359516, End 360234)
hj0 = z((BQ7, fj0) => {
  var {
    PassThrough: Cr9
  } = UA("stream");
  fj0.exports = function() {
    var A = [],
      Q = new Cr9({
        objectMode: !0
      });
    return Q.setMaxListeners(0), Q.add = B, Q.isEmpty = G, Q.on("unpipe", Z), Array.prototype.slice.call(arguments).forEach(B), Q;

    function B(I) {
      if (Array.isArray(I)) return I.forEach(B), this;
      return A.push(I), I.once("end", Z.bind(null, I)), I.once("error", Q.emit.bind(Q, "error")), I.pipe(Q, {
        end: !1
      }), this
    }

    function G() {
      return A.length == 0
    }

    function Z(I) {
      if (A = A.filter(function(Y) {
          return Y !== I
        }), !A.length && Q.readable) Q.end()
    }
  }
})
// @from(Start 360376, End 360379)
gj0
// @from(Start 360381, End 360496)
uj0 = (A) => {
    if (A !== void 0) throw TypeError("The `input` and `inputFile` options cannot be both set.")
  }
// @from(Start 360500, End 360620)
$r9 = ({
    input: A,
    inputFile: Q
  }) => {
    if (typeof Q !== "string") return A;
    return uj0(A), zr9(Q)
  }
// @from(Start 360624, End 360762)
mj0 = (A) => {
    let Q = $r9(A);
    if (_yA(Q)) throw TypeError("The `input` option cannot be a stream in sync mode");
    return Q
  }
// @from(Start 360766, End 360886)
wr9 = ({
    input: A,
    inputFile: Q
  }) => {
    if (typeof Q !== "string") return A;
    return uj0(A), Er9(Q)
  }
// @from(Start 360890, End 361018)
dj0 = (A, Q) => {
    let B = wr9(Q);
    if (B === void 0) return;
    if (_yA(B)) B.pipe(A.stdin);
    else A.stdin.end(B)
  }
// @from(Start 361022, End 361214)
cj0 = (A, {
    all: Q
  }) => {
    if (!Q || !A.stdout && !A.stderr) return;
    let B = gj0.default();
    if (A.stdout) B.add(A.stdout);
    if (A.stderr) B.add(A.stderr);
    return B
  }
// @from(Start 361218, End 361395)
VD1 = async (A, Q) => {
    if (!A || Q === void 0) return;
    await Ur9(0), A.destroy();
    try {
      return await Q
    } catch (B) {
      return B.bufferedData
    }
  }
// @from(Start 361397, End 361684)
FD1 = (A, {
    encoding: Q,
    buffer: B,
    maxBuffer: G
  }) => {
    if (!A || !B) return;
    if (Q === "utf8" || Q === "utf-8") return XD1(A, {
      maxBuffer: G
    });
    if (Q === null || Q === "buffer") return xyA(A, {
      maxBuffer: G
    });
    return qr9(A, G, Q)
  }
// @from(Start 361686, End 361782)
qr9 = async (A, Q, B) => {
    return (await xyA(A, {
      maxBuffer: Q
    })).toString(B)
  }
// @from(Start 361784, End 362411)
pj0 = async ({
    stdout: A,
    stderr: Q,
    all: B
  }, {
    encoding: G,
    buffer: Z,
    maxBuffer: I
  }, Y) => {
    let J = FD1(A, {
        encoding: G,
        buffer: Z,
        maxBuffer: I
      }),
      W = FD1(Q, {
        encoding: G,
        buffer: Z,
        maxBuffer: I
      }),
      X = FD1(B, {
        encoding: G,
        buffer: Z,
        maxBuffer: I * 2
      });
    try {
      return await Promise.all([Y, J, W, X])
    } catch (V) {
      return Promise.all([{
        error: V,
        signal: V.signal,
        timedOut: V.timedOut
      }, VD1(A, J), VD1(Q, W), VD1(B, X)])
    }
  }
// @from(Start 362417, End 362465)
lj0 = L(() => {
  bj0();
  gj0 = BA(hj0(), 1)
})
// @from(Start 362471, End 362474)
Nr9
// @from(Start 362476, End 362479)
Lr9
// @from(Start 362481, End 362715)
KD1 = (A, Q) => {
    for (let [B, G] of Lr9) {
      let Z = typeof Q === "function" ? (...I) => Reflect.apply(G.value, Q(), I) : G.value.bind(Q);
      Reflect.defineProperty(A, B, {
        ...G,
        value: Z
      })
    }
  }
// @from(Start 362719, End 362971)
ij0 = (A) => new Promise((Q, B) => {
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
// @from(Start 362977, End 363138)
nj0 = L(() => {
  Nr9 = (async () => {})().constructor.prototype, Lr9 = ["then", "catch", "finally"].map((A) => [A, Reflect.getOwnPropertyDescriptor(Nr9, A)])
})
// @from(Start 363251, End 363337)
rj0 = (A, Q = []) => {
    if (!Array.isArray(Q)) return [A];
    return [A, ...Q]
  }
// @from(Start 363341, End 363344)
Rr9
// @from(Start 363346, End 363463)
Tr9 = (A) => {
    if (typeof A !== "string" || Rr9.test(A)) return A;
    return `"${A.replaceAll('"',"\\\"")}"`
  }
// @from(Start 363467, End 363502)
DD1 = (A, Q) => rj0(A, Q).join(" ")
// @from(Start 363506, End 363560)
HD1 = (A, Q) => rj0(A, Q).map((B) => Tr9(B)).join(" ")
// @from(Start 363564, End 363567)
Pr9
// @from(Start 363569, End 364044)
aj0 = (A) => {
    let Q = typeof A;
    if (Q === "string") return A;
    if (Q === "number") return String(A);
    if (Q === "object" && A !== null && !(A instanceof Or9) && "stdout" in A) {
      let B = typeof A.stdout;
      if (B === "string") return A.stdout;
      if (Mr9.isBuffer(A.stdout)) return A.stdout.toString();
      throw TypeError(`Unexpected "${B}" stdout in template expression`)
    }
    throw TypeError(`Unexpected "${Q}" in template expression`)
  }
// @from(Start 364048, End 364178)
sj0 = (A, Q, B) => B || A.length === 0 || Q.length === 0 ? [...A, ...Q] : [...A.slice(0, -1), `${A.at(-1)}${Q[0]}`, ...Q.slice(1)]
// @from(Start 364182, End 364546)
jr9 = ({
    templates: A,
    expressions: Q,
    tokens: B,
    index: G,
    template: Z
  }) => {
    let I = Z ?? A.raw[G],
      Y = I.split(Pr9).filter(Boolean),
      J = sj0(B, Y, I.startsWith(" "));
    if (G === Q.length) return J;
    let W = Q[G],
      X = Array.isArray(W) ? W.map((V) => aj0(V)) : [aj0(W)];
    return sj0(J, X, I.endsWith(" "))
  }
// @from(Start 364550, End 364747)
CD1 = (A, Q) => {
    let B = [];
    for (let [G, Z] of A.entries()) B = jr9({
      templates: A,
      expressions: Q,
      tokens: B,
      index: G,
      template: Z
    });
    return B
  }
// @from(Start 364753, End 364804)
oj0 = L(() => {
  Rr9 = /^[\w.-]+$/, Pr9 = / +/g
})
// @from(Start 364889, End 364892)
tj0
// @from(Start 364894, End 364936)
byA = (A, Q) => String(A).padStart(Q, "0")
// @from(Start 364940, End 365095)
kr9 = () => {
    let A = new Date;
    return `${byA(A.getHours(),2)}:${byA(A.getMinutes(),2)}:${byA(A.getSeconds(),2)}.${byA(A.getMilliseconds(),3)}`
  }
// @from(Start 365099, End 365200)
ED1 = (A, {
    verbose: Q
  }) => {
    if (!Q) return;
    _r9.stderr.write(`[${kr9()}] ${A}
`)
  }
// @from(Start 365206, End 365253)
ej0 = L(() => {
  tj0 = Sr9("execa").enabled
})
// @from(Start 365402, End 367056)
function us(A, Q, B) {
  let G = BS0(A, Q, B),
    Z = DD1(A, Q),
    I = HD1(A, Q);
  ED1(I, G.options), $j0(G.options);
  let Y;
  try {
    Y = zD1.spawn(G.file, G.args, G.options)
  } catch (D) {
    let H = new zD1.ChildProcess,
      C = Promise.reject(lFA({
        error: D,
        stdout: "",
        stderr: "",
        all: "",
        command: Z,
        escapedCommand: I,
        parsed: G,
        timedOut: !1,
        isCanceled: !1,
        killed: !1
      }));
    return KD1(H, C), H
  }
  let J = ij0(Y),
    W = Uj0(Y, G.options, J),
    X = wj0(Y, G.options, W),
    V = {
      isCanceled: !1
    };
  Y.kill = Ej0.bind(null, Y.kill.bind(Y)), Y.cancel = zj0.bind(null, Y, V);
  let K = Aj0(async () => {
    let [{
      error: D,
      exitCode: H,
      signal: C,
      timedOut: E
    }, U, q, w] = await pj0(Y, G.options, X), N = aFA(G.options, U), R = aFA(G.options, q), T = aFA(G.options, w);
    if (D || H !== 0 || C !== null) {
      let y = lFA({
        error: D,
        exitCode: H,
        signal: C,
        stdout: N,
        stderr: R,
        all: T,
        command: Z,
        escapedCommand: I,
        parsed: G,
        timedOut: E,
        isCanceled: V.isCanceled || (G.options.signal ? G.options.signal.aborted : !1),
        killed: Y.killed
      });
      if (!G.options.reject) return y;
      throw y
    }
    return {
      command: Z,
      escapedCommand: I,
      exitCode: 0,
      stdout: N,
      stderr: R,
      all: T,
      failed: !1,
      timedOut: !1,
      isCanceled: !1,
      killed: !1
    }
  });
  return dj0(Y, G.options), Y.all = cj0(Y, G.options), Nj0(Y), KD1(Y, K), Y
}
// @from(Start 367058, End 368188)
function I9A(A, Q, B) {
  let G = BS0(A, Q, B),
    Z = DD1(A, Q),
    I = HD1(A, Q);
  ED1(I, G.options);
  let Y = mj0(G.options),
    J;
  try {
    J = zD1.spawnSync(G.file, G.args, {
      ...G.options,
      input: Y
    })
  } catch (V) {
    throw lFA({
      error: V,
      stdout: "",
      stderr: "",
      all: "",
      command: Z,
      escapedCommand: I,
      parsed: G,
      timedOut: !1,
      isCanceled: !1,
      killed: !1
    })
  }
  let W = aFA(G.options, J.stdout, J.error),
    X = aFA(G.options, J.stderr, J.error);
  if (J.error || J.status !== 0 || J.signal !== null) {
    let V = lFA({
      stdout: W,
      stderr: X,
      error: J.error,
      signal: J.signal,
      exitCode: J.status,
      command: Z,
      escapedCommand: I,
      parsed: G,
      timedOut: J.error && J.error.code === "ETIMEDOUT",
      isCanceled: !1,
      killed: J.signal !== null
    });
    if (!G.options.reject) return V;
    throw V
  }
  return {
    command: Z,
    escapedCommand: I,
    exitCode: 0,
    stdout: W,
    stderr: X,
    failed: !1,
    timedOut: !1,
    isCanceled: !1,
    killed: !1
  }
}
// @from(Start 368190, End 368587)
function GS0(A) {
  function Q(B, ...G) {
    if (!Array.isArray(B)) return GS0({
      ...A,
      ...B
    });
    let [Z, ...I] = CD1(B, G);
    return us(Z, I, AS0(A))
  }
  return Q.sync = (B, ...G) => {
    if (!Array.isArray(B)) throw TypeError("Please use $(options).sync`command` instead of $.sync(options)`command`.");
    let [Z, ...I] = CD1(B, G);
    return I9A(Z, I, AS0(A))
  }, Q
}
// @from(Start 368592, End 368595)
QS0
// @from(Start 368597, End 368606)
vr9 = 1e8
// @from(Start 368610, End 368864)
br9 = ({
    env: A,
    extendEnv: Q,
    preferLocal: B,
    localDir: G,
    execPath: Z
  }) => {
    let I = Q ? {
      ...fyA.env,
      ...A
    } : A;
    if (B) return rP0({
      env: I,
      cwd: G,
      execPath: Z
    });
    return I
  }
// @from(Start 368868, End 369537)
BS0 = (A, Q, B = {}) => {
    let G = QS0.default._parse(A, Q, B);
    if (A = G.command, Q = G.args, B = G.options, B = {
        maxBuffer: vr9,
        buffer: !0,
        stripFinalNewline: !0,
        extendEnv: !0,
        preferLocal: !1,
        localDir: B.cwd || fyA.cwd(),
        execPath: fyA.execPath,
        encoding: "utf8",
        reject: !0,
        cleanup: !0,
        all: !1,
        windowsHide: !0,
        verbose: tj0,
        ...B
      }, B.env = br9(B), B.stdio = Vj0(B), fyA.platform === "win32" && xr9.basename(A, ".exe") === "cmd") Q.unshift("/q");
    return {
      file: A,
      args: Q,
      options: B,
      parsed: G
    }
  }
// @from(Start 369541, End 369708)
aFA = (A, Q, B) => {
    if (typeof Q !== "string" && !yr9.isBuffer(Q)) return B === void 0 ? void 0 : "";
    if (A.stripFinalNewline) return iK1(Q);
    return Q
  }
// @from(Start 369712, End 369852)
fr9 = ({
    input: A,
    inputFile: Q,
    stdio: B
  }) => A === void 0 && Q === void 0 && B === void 0 ? {
    stdin: "inherit"
  } : {}
// @from(Start 369856, End 369926)
AS0 = (A = {}) => ({
    preferLocal: !0,
    ...fr9(A),
    ...A
  })
// @from(Start 369930, End 369933)
kQ7
// @from(Start 369939, End 370083)
sFA = L(() => {
  oP0();
  Qj0();
  Xj0();
  Fj0();
  qj0();
  Lj0();
  lj0();
  nj0();
  oj0();
  ej0();
  QS0 = BA(lK1(), 1);
  kQ7 = GS0()
})
// @from(Start 370086, End 370119)
function UD1() {
  return I2A()
}
// @from(Start 370121, End 370195)
function W0() {
  try {
    return UD1()
  } catch {
    return uQ()
  }
}
// @from(Start 370200, End 370224)
U2 = L(() => {
  _0()
})
// @from(Start 370227, End 370834)
function tG(A, Q, B = 10 * wD1 * $D1) {
  let G;
  if (Q === void 0) G = {};
  else if (Q instanceof AbortSignal) G = {
    abortSignal: Q,
    timeout: B
  };
  else G = Q;
  let {
    abortSignal: Z,
    timeout: I = 10 * wD1 * $D1,
    input: Y,
    stdio: J = ["ignore", "pipe", "pipe"]
  } = G;
  Z?.throwIfAborted();
  try {
    let W = I9A(A, {
      env: process.env,
      maxBuffer: 1e6,
      timeout: I,
      cwd: W0(),
      stdio: J,
      shell: !0,
      reject: !1,
      input: Y
    });
    if (!W.stdout) return null;
    return W.stdout.trim() || null
  } catch {
    return null
  }
}
// @from(Start 370835, End 371233)
async function rFA(A, Q = {}) {
  let {
    abortSignal: B,
    timeout: G = 10 * wD1 * $D1
  } = Q;
  B?.throwIfAborted();
  try {
    let Z = await us(A, {
      env: process.env,
      maxBuffer: 1e6,
      signal: B,
      timeout: G,
      cwd: W0(),
      shell: !0,
      reject: !1
    });
    if (!Z.stdout) return null;
    return Z.stdout.trim() || null
  } catch {
    return null
  }
}
// @from(Start 371238, End 371248)
$D1 = 1000
// @from(Start 371252, End 371260)
wD1 = 60
// @from(Start 371266, End 371300)
hyA = L(() => {
  sFA();
  U2()
})
// @from(Start 371303, End 371585)
function QQ(A, Q, B = {
  timeout: 10 * ND1 * qD1,
  preserveOutputOnError: !0,
  useCwd: !0
}) {
  return A3(A, Q, {
    abortSignal: B.abortSignal,
    timeout: B.timeout,
    preserveOutputOnError: B.preserveOutputOnError,
    cwd: B.useCwd ? W0() : void 0,
    env: B.env
  })
}
// @from(Start 371587, End 372581)
function A3(A, Q, {
  abortSignal: B,
  timeout: G = 10 * ND1 * qD1,
  preserveOutputOnError: Z = !0,
  cwd: I,
  env: Y,
  maxBuffer: J,
  shell: W
} = {
  timeout: 10 * ND1 * qD1,
  preserveOutputOnError: !0,
  maxBuffer: 1e6
}) {
  return new Promise((X) => {
    us(A, Q, {
      maxBuffer: J,
      signal: B,
      timeout: G,
      cwd: I,
      env: Y,
      shell: W,
      reject: !1
    }).then((V) => {
      if (V.failed)
        if (Z) {
          let F = V.exitCode ?? 1;
          X({
            stdout: V.stdout || "",
            stderr: V.stderr || "",
            code: F,
            error: typeof V.signal === "string" ? V.signal : String(F)
          })
        } else X({
          stdout: "",
          stderr: "",
          code: V.exitCode ?? 1
        });
      else X({
        stdout: V.stdout,
        stderr: V.stderr,
        code: 0
      })
    }).catch((V) => {
      AA(V), X({
        stdout: "",
        stderr: "",
        code: 1
      })
    })
  })
}
// @from(Start 372586, End 372596)
qD1 = 1000
// @from(Start 372600, End 372608)
ND1 = 60
// @from(Start 372614, End 372664)
_8 = L(() => {
  sFA();
  U2();
  g1();
  hyA()
})
// @from(Start 372667, End 372725)
function ms() {
  return process.versions.bun !== void 0
}
// @from(Start 372727, End 372827)
function UX() {
  return ms() && Array.isArray(Bun?.embeddedFiles) && Bun.embeddedFiles.length > 0
}
// @from(Start 372832, End 372835)
LD1
// @from(Start 372837, End 372839)
dQ
// @from(Start 372841, End 372843)
ds
// @from(Start 372845, End 372848)
ZS0
// @from(Start 372854, End 373984)
Q3 = L(() => {
  l2();
  g1();
  AQ();
  LD1 = ["macos", "wsl"], dQ = s1(() => {
    try {
      if (process.platform === "darwin") return "macos";
      if (process.platform === "win32") return "windows";
      if (process.platform === "linux") {
        try {
          let A = RA().readFileSync("/proc/version", {
            encoding: "utf8"
          });
          if (A.toLowerCase().includes("microsoft") || A.toLowerCase().includes("wsl")) return "wsl"
        } catch (A) {
          AA(A instanceof Error ? A : Error(String(A)))
        }
        return "linux"
      }
      return "unknown"
    } catch (A) {
      return AA(A instanceof Error ? A : Error(String(A))), "unknown"
    }
  }), ds = s1(() => {
    if (process.platform !== "linux") return;
    try {
      let A = RA().readFileSync("/proc/version", {
          encoding: "utf8"
        }),
        Q = A.match(/WSL(\d+)/i);
      if (Q && Q[1]) return Q[1];
      if (A.toLowerCase().includes("microsoft")) return "1";
      return
    } catch (A) {
      AA(A instanceof Error ? A : Error(String(A)));
      return
    }
  }), ZS0 = dQ() !== "windows"
})
// @from(Start 374166, End 374258)
function Y9A() {
  let A = uyA();
  return {
    rgPath: A.command,
    rgArgs: A.args
  }
}
// @from(Start 374260, End 374458)
function pr9(A, Q, B, G) {
  let {
    rgPath: Z,
    rgArgs: I
  } = Y9A();
  return ur9(Z, [...I, ...A, Q], {
    maxBuffer: cr9,
    signal: B,
    timeout: dQ() === "wsl" ? 60000 : 1e4
  }, G)
}
// @from(Start 374459, End 375303)
async function aj(A, Q, B) {
  if (!UX()) await ir9();
  return lr9().catch((G) => {
    AA(G instanceof Error ? G : Error(String(G)))
  }), new Promise((G) => {
    pr9(A, Q, B, (Z, I, Y) => {
      if (!Z) {
        G(I.trim().split(`
`).filter(Boolean));
        return
      }
      if (Z.code === 1) {
        G([]);
        return
      }
      let J = I && I.trim().length > 0,
        W = Z.signal === "SIGTERM" || Z.code === "ABORT_ERR",
        X = Z.code === "ERR_CHILD_PROCESS_STDIO_MAXBUFFER",
        V = Z.code === 2,
        F = (W || X || V) && J,
        K = [];
      if (F) {
        if (K = I.trim().split(`
`).filter(Boolean), K.length > 0 && (W || X)) K = K.slice(0, -1)
      }
      if (g(`rg error (signal=${Z.signal}, code=${Z.code}, stderr: ${Y}), ${K.length} results`), Z.code !== 2) AA(Z);
      G(K)
    })
  })
}
// @from(Start 375304, End 375426)
async function JS0(A, Q, B) {
  try {
    return (await aj(["-l", "."], A, Q)).slice(0, B)
  } catch {
    return []
  }
}
// @from(Start 375428, End 375551)
function WS0() {
  let A = uyA();
  return {
    mode: A.mode,
    path: A.command,
    working: gyA?.working ?? null
  }
}
// @from(Start 375552, End 376283)
async function ir9() {
  if (process.platform !== "darwin" || IS0) return;
  IS0 = !0;
  let A = uyA();
  if (A.mode !== "builtin" || UX()) return;
  let Q = A.command;
  if (!(await QQ("codesign", ["-vv", "-d", Q], {
      preserveOutputOnError: !1
    })).stdout.split(`
`).find((Z) => Z.includes("linker-signed"))) return;
  try {
    let Z = await QQ("codesign", ["--sign", "-", "--force", "--preserve-metadata=entitlements,requirements,flags,runtime", Q]);
    if (Z.code !== 0) AA(Error(`Failed to sign ripgrep: ${Z.stdout} ${Z.stderr}`));
    let I = await QQ("xattr", ["-d", "com.apple.quarantine", Q]);
    if (I.code !== 0) AA(Error(`Failed to remove quarantine: ${I.stdout} ${I.stderr}`))
  } catch (Z) {
    AA(Z)
  }
}
// @from(Start 376288, End 376291)
YS0
// @from(Start 376293, End 376296)
mr9
// @from(Start 376298, End 376301)
dr9
// @from(Start 376303, End 376306)
uyA
// @from(Start 376308, End 376322)
cr9 = 20000000
// @from(Start 376326, End 376329)
myA
// @from(Start 376331, End 376341)
gyA = null
// @from(Start 376345, End 376348)
lr9
// @from(Start 376350, End 376358)
IS0 = !1
// @from(Start 376364, End 378326)
sj = L(() => {
  l2();
  g1();
  _8();
  V0();
  hQ();
  q0();
  Q3();
  YS0 = BA(vK1(), 1), mr9 = hr9(import.meta.url), dr9 = Rm.join(mr9, "../"), uyA = s1(() => {
    if (_j(process.env.USE_BUILTIN_RIPGREP)) {
      let {
        cmd: G
      } = YS0.findActualExecutable("rg", []);
      if (G !== "rg") return {
        mode: "system",
        command: "rg",
        args: []
      }
    }
    if (UX()) return {
      mode: "builtin",
      command: process.execPath,
      args: ["--ripgrep"]
    };
    let Q = Rm.resolve(dr9, "vendor", "ripgrep");
    return {
      mode: "builtin",
      command: process.platform === "win32" ? Rm.resolve(Q, "x64-win32", "rg.exe") : Rm.resolve(Q, `${process.arch}-${process.platform}`, "rg"),
      args: []
    }
  });
  myA = s1(async (A, Q, B = []) => {
    if (Rm.resolve(A) === Rm.resolve(gr9())) return;
    try {
      let G = ["--files", "--hidden"];
      B.forEach((W) => {
        G.push("--glob", `!${W}`)
      });
      let I = (await aj(G, A, Q)).length;
      if (I === 0) return 0;
      let Y = Math.floor(Math.log10(I)),
        J = Math.pow(10, Y);
      return Math.round(I / J) * J
    } catch (G) {
      AA(G instanceof Error ? G : Error(String(G)))
    }
  });
  lr9 = s1(async () => {
    if (gyA !== null) return;
    let A = uyA();
    try {
      let Q = await QQ(A.command, [...A.args, "--version"], {
          timeout: 5000
        }),
        B = Q.code === 0 && !!Q.stdout && Q.stdout.startsWith("ripgrep ");
      gyA = {
        working: B,
        lastTested: Date.now(),
        config: A
      }, g(`Ripgrep first use test: ${B?"PASSED":"FAILED"} (mode=${A.mode}, path=${A.command})`), GA("tengu_ripgrep_availability", {
        working: B ? 1 : 0,
        using_system: A.mode === "system" ? 1 : 0
      })
    } catch (Q) {
      gyA = {
        working: !1,
        lastTested: Date.now(),
        config: A
      }, AA(Q instanceof Error ? Q : Error(String(Q)))
    }
  })
})
// @from(Start 378332, End 411372)
OS0 = z((JB7, MS0) => {
  function PD1(A) {
    if (A instanceof Map) A.clear = A.delete = A.set = function() {
      throw Error("map is read-only")
    };
    else if (A instanceof Set) A.add = A.clear = A.delete = function() {
      throw Error("set is read-only")
    };
    return Object.freeze(A), Object.getOwnPropertyNames(A).forEach(function(Q) {
      var B = A[Q];
      if (typeof B == "object" && !Object.isFrozen(B)) PD1(B)
    }), A
  }
  var CS0 = PD1,
    nr9 = PD1;
  CS0.default = nr9;
  class RD1 {
    constructor(A) {
      if (A.data === void 0) A.data = {};
      this.data = A.data, this.isMatchIgnored = !1
    }
    ignoreMatch() {
      this.isMatchIgnored = !0
    }
  }

  function J9A(A) {
    return A.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;")
  }

  function Tm(A, ...Q) {
    let B = Object.create(null);
    for (let G in A) B[G] = A[G];
    return Q.forEach(function(G) {
      for (let Z in G) B[Z] = G[Z]
    }), B
  }
  var ar9 = "</span>",
    XS0 = (A) => {
      return !!A.kind
    };
  class ES0 {
    constructor(A, Q) {
      this.buffer = "", this.classPrefix = Q.classPrefix, A.walk(this)
    }
    addText(A) {
      this.buffer += J9A(A)
    }
    openNode(A) {
      if (!XS0(A)) return;
      let Q = A.kind;
      if (!A.sublanguage) Q = `${this.classPrefix}${Q}`;
      this.span(Q)
    }
    closeNode(A) {
      if (!XS0(A)) return;
      this.buffer += ar9
    }
    value() {
      return this.buffer
    }
    span(A) {
      this.buffer += `<span class="${A}">`
    }
  }
  class jD1 {
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
        jD1._collapse(Q)
      })
    }
  }
  class zS0 extends jD1 {
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
      return new ES0(this, this.options).value()
    }
    finalize() {
      return !0
    }
  }

  function sr9(A) {
    return new RegExp(A.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"), "m")
  }

  function oFA(A) {
    if (!A) return null;
    if (typeof A === "string") return A;
    return A.source
  }

  function rr9(...A) {
    return A.map((B) => oFA(B)).join("")
  }

  function or9(...A) {
    return "(" + A.map((B) => oFA(B)).join("|") + ")"
  }

  function tr9(A) {
    return new RegExp(A.toString() + "|").exec("").length - 1
  }

  function er9(A, Q) {
    let B = A && A.exec(Q);
    return B && B.index === 0
  }
  var Ao9 = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;

  function Qo9(A, Q = "|") {
    let B = 0;
    return A.map((G) => {
      B += 1;
      let Z = B,
        I = oFA(G),
        Y = "";
      while (I.length > 0) {
        let J = Ao9.exec(I);
        if (!J) {
          Y += I;
          break
        }
        if (Y += I.substring(0, J.index), I = I.substring(J.index + J[0].length), J[0][0] === "\\" && J[1]) Y += "\\" + String(Number(J[1]) + Z);
        else if (Y += J[0], J[0] === "(") B++
      }
      return Y
    }).map((G) => `(${G})`).join(Q)
  }
  var Bo9 = /\b\B/,
    US0 = "[a-zA-Z]\\w*",
    SD1 = "[a-zA-Z_]\\w*",
    _D1 = "\\b\\d+(\\.\\d+)?",
    $S0 = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",
    wS0 = "\\b(0b[01]+)",
    Go9 = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",
    Zo9 = (A = {}) => {
      let Q = /^#![ ]*\//;
      if (A.binary) A.begin = rr9(Q, /.*\b/, A.binary, /\b.*/);
      return Tm({
        className: "meta",
        begin: Q,
        end: /$/,
        relevance: 0,
        "on:begin": (B, G) => {
          if (B.index !== 0) G.ignoreMatch()
        }
      }, A)
    },
    tFA = {
      begin: "\\\\[\\s\\S]",
      relevance: 0
    },
    Io9 = {
      className: "string",
      begin: "'",
      end: "'",
      illegal: "\\n",
      contains: [tFA]
    },
    Yo9 = {
      className: "string",
      begin: '"',
      end: '"',
      illegal: "\\n",
      contains: [tFA]
    },
    qS0 = {
      begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
    },
    cyA = function(A, Q, B = {}) {
      let G = Tm({
        className: "comment",
        begin: A,
        end: Q,
        contains: []
      }, B);
      return G.contains.push(qS0), G.contains.push({
        className: "doctag",
        begin: "(?:TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):",
        relevance: 0
      }), G
    },
    Jo9 = cyA("//", "$"),
    Wo9 = cyA("/\\*", "\\*/"),
    Xo9 = cyA("#", "$"),
    Vo9 = {
      className: "number",
      begin: _D1,
      relevance: 0
    },
    Fo9 = {
      className: "number",
      begin: $S0,
      relevance: 0
    },
    Ko9 = {
      className: "number",
      begin: wS0,
      relevance: 0
    },
    Do9 = {
      className: "number",
      begin: _D1 + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
      relevance: 0
    },
    Ho9 = {
      begin: /(?=\/[^/\n]*\/)/,
      contains: [{
        className: "regexp",
        begin: /\//,
        end: /\/[gimuy]*/,
        illegal: /\n/,
        contains: [tFA, {
          begin: /\[/,
          end: /\]/,
          relevance: 0,
          contains: [tFA]
        }]
      }]
    },
    Co9 = {
      className: "title",
      begin: US0,
      relevance: 0
    },
    Eo9 = {
      className: "title",
      begin: SD1,
      relevance: 0
    },
    zo9 = {
      begin: "\\.\\s*" + SD1,
      relevance: 0
    },
    Uo9 = function(A) {
      return Object.assign(A, {
        "on:begin": (Q, B) => {
          B.data._beginMatch = Q[1]
        },
        "on:end": (Q, B) => {
          if (B.data._beginMatch !== Q[1]) B.ignoreMatch()
        }
      })
    },
    dyA = Object.freeze({
      __proto__: null,
      MATCH_NOTHING_RE: Bo9,
      IDENT_RE: US0,
      UNDERSCORE_IDENT_RE: SD1,
      NUMBER_RE: _D1,
      C_NUMBER_RE: $S0,
      BINARY_NUMBER_RE: wS0,
      RE_STARTERS_RE: Go9,
      SHEBANG: Zo9,
      BACKSLASH_ESCAPE: tFA,
      APOS_STRING_MODE: Io9,
      QUOTE_STRING_MODE: Yo9,
      PHRASAL_WORDS_MODE: qS0,
      COMMENT: cyA,
      C_LINE_COMMENT_MODE: Jo9,
      C_BLOCK_COMMENT_MODE: Wo9,
      HASH_COMMENT_MODE: Xo9,
      NUMBER_MODE: Vo9,
      C_NUMBER_MODE: Fo9,
      BINARY_NUMBER_MODE: Ko9,
      CSS_NUMBER_MODE: Do9,
      REGEXP_MODE: Ho9,
      TITLE_MODE: Co9,
      UNDERSCORE_TITLE_MODE: Eo9,
      METHOD_GUARD: zo9,
      END_SAME_AS_BEGIN: Uo9
    });

  function $o9(A, Q) {
    if (A.input[A.index - 1] === ".") Q.ignoreMatch()
  }

  function wo9(A, Q) {
    if (!Q) return;
    if (!A.beginKeywords) return;
    if (A.begin = "\\b(" + A.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", A.__beforeBegin = $o9, A.keywords = A.keywords || A.beginKeywords, delete A.beginKeywords, A.relevance === void 0) A.relevance = 0
  }

  function qo9(A, Q) {
    if (!Array.isArray(A.illegal)) return;
    A.illegal = or9(...A.illegal)
  }

  function No9(A, Q) {
    if (!A.match) return;
    if (A.begin || A.end) throw Error("begin & end are not supported with match");
    A.begin = A.match, delete A.match
  }

  function Lo9(A, Q) {
    if (A.relevance === void 0) A.relevance = 1
  }
  var Mo9 = ["of", "and", "for", "in", "not", "or", "if", "then", "parent", "list", "value"],
    Oo9 = "keyword";

  function NS0(A, Q, B = Oo9) {
    let G = {};
    if (typeof A === "string") Z(B, A.split(" "));
    else if (Array.isArray(A)) Z(B, A);
    else Object.keys(A).forEach(function(I) {
      Object.assign(G, NS0(A[I], Q, I))
    });
    return G;

    function Z(I, Y) {
      if (Q) Y = Y.map((J) => J.toLowerCase());
      Y.forEach(function(J) {
        let W = J.split("|");
        G[W[0]] = [I, Ro9(W[0], W[1])]
      })
    }
  }

  function Ro9(A, Q) {
    if (Q) return Number(Q);
    return To9(A) ? 0 : 1
  }

  function To9(A) {
    return Mo9.includes(A.toLowerCase())
  }

  function Po9(A, {
    plugins: Q
  }) {
    function B(J, W) {
      return new RegExp(oFA(J), "m" + (A.case_insensitive ? "i" : "") + (W ? "g" : ""))
    }
    class G {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0
      }
      addRule(J, W) {
        W.position = this.position++, this.matchIndexes[this.matchAt] = W, this.regexes.push([W, J]), this.matchAt += tr9(J) + 1
      }
      compile() {
        if (this.regexes.length === 0) this.exec = () => null;
        let J = this.regexes.map((W) => W[1]);
        this.matcherRe = B(Qo9(J), !0), this.lastIndex = 0
      }
      exec(J) {
        this.matcherRe.lastIndex = this.lastIndex;
        let W = this.matcherRe.exec(J);
        if (!W) return null;
        let X = W.findIndex((F, K) => K > 0 && F !== void 0),
          V = this.matchIndexes[X];
        return W.splice(0, X), Object.assign(W, V)
      }
    }
    class Z {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0
      }
      getMatcher(J) {
        if (this.multiRegexes[J]) return this.multiRegexes[J];
        let W = new G;
        return this.rules.slice(J).forEach(([X, V]) => W.addRule(X, V)), W.compile(), this.multiRegexes[J] = W, W
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0
      }
      considerAll() {
        this.regexIndex = 0
      }
      addRule(J, W) {
        if (this.rules.push([J, W]), W.type === "begin") this.count++
      }
      exec(J) {
        let W = this.getMatcher(this.regexIndex);
        W.lastIndex = this.lastIndex;
        let X = W.exec(J);
        if (this.resumingScanAtSamePosition())
          if (X && X.index === this.lastIndex);
          else {
            let V = this.getMatcher(0);
            V.lastIndex = this.lastIndex + 1, X = V.exec(J)
          } if (X) {
          if (this.regexIndex += X.position + 1, this.regexIndex === this.count) this.considerAll()
        }
        return X
      }
    }

    function I(J) {
      let W = new Z;
      if (J.contains.forEach((X) => W.addRule(X.begin, {
          rule: X,
          type: "begin"
        })), J.terminatorEnd) W.addRule(J.terminatorEnd, {
        type: "end"
      });
      if (J.illegal) W.addRule(J.illegal, {
        type: "illegal"
      });
      return W
    }

    function Y(J, W) {
      let X = J;
      if (J.isCompiled) return X;
      [No9].forEach((F) => F(J, W)), A.compilerExtensions.forEach((F) => F(J, W)), J.__beforeBegin = null, [wo9, qo9, Lo9].forEach((F) => F(J, W)), J.isCompiled = !0;
      let V = null;
      if (typeof J.keywords === "object") V = J.keywords.$pattern, delete J.keywords.$pattern;
      if (J.keywords) J.keywords = NS0(J.keywords, A.case_insensitive);
      if (J.lexemes && V) throw Error("ERR: Prefer `keywords.$pattern` to `mode.lexemes`, BOTH are not allowed. (see mode reference) ");
      if (V = V || J.lexemes || /\w+/, X.keywordPatternRe = B(V, !0), W) {
        if (!J.begin) J.begin = /\B|\b/;
        if (X.beginRe = B(J.begin), J.endSameAsBegin) J.end = J.begin;
        if (!J.end && !J.endsWithParent) J.end = /\B|\b/;
        if (J.end) X.endRe = B(J.end);
        if (X.terminatorEnd = oFA(J.end) || "", J.endsWithParent && W.terminatorEnd) X.terminatorEnd += (J.end ? "|" : "") + W.terminatorEnd
      }
      if (J.illegal) X.illegalRe = B(J.illegal);
      if (!J.contains) J.contains = [];
      if (J.contains = [].concat(...J.contains.map(function(F) {
          return jo9(F === "self" ? J : F)
        })), J.contains.forEach(function(F) {
          Y(F, X)
        }), J.starts) Y(J.starts, W);
      return X.matcher = I(X), X
    }
    if (!A.compilerExtensions) A.compilerExtensions = [];
    if (A.contains && A.contains.includes("self")) throw Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return A.classNameAliases = Tm(A.classNameAliases || {}), Y(A)
  }

  function LS0(A) {
    if (!A) return !1;
    return A.endsWithParent || LS0(A.starts)
  }

  function jo9(A) {
    if (A.variants && !A.cachedVariants) A.cachedVariants = A.variants.map(function(Q) {
      return Tm(A, {
        variants: null
      }, Q)
    });
    if (A.cachedVariants) return A.cachedVariants;
    if (LS0(A)) return Tm(A, {
      starts: A.starts ? Tm(A.starts) : null
    });
    if (Object.isFrozen(A)) return Tm(A);
    return A
  }
  var So9 = "10.7.3";

  function _o9(A) {
    return Boolean(A || A === "")
  }

  function ko9(A) {
    let Q = {
      props: ["language", "code", "autodetect"],
      data: function() {
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
          if (!this.autoDetect && !A.getLanguage(this.language)) return console.warn(`The language "${this.language}" you specified could not be found.`), this.unknownLanguage = !0, J9A(this.code);
          let G = {};
          if (this.autoDetect) G = A.highlightAuto(this.code), this.detectedLanguage = G.language;
          else G = A.highlight(this.language, this.code, this.ignoreIllegals), this.detectedLanguage = this.language;
          return G.value
        },
        autoDetect() {
          return !this.language || _o9(this.autodetect)
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
  var yo9 = {
    "after:highlightElement": ({
      el: A,
      result: Q,
      text: B
    }) => {
      let G = VS0(A);
      if (!G.length) return;
      let Z = document.createElement("div");
      Z.innerHTML = Q.value, Q.value = xo9(G, VS0(Z), B)
    }
  };

  function TD1(A) {
    return A.nodeName.toLowerCase()
  }

  function VS0(A) {
    let Q = [];
    return function B(G, Z) {
      for (let I = G.firstChild; I; I = I.nextSibling)
        if (I.nodeType === 3) Z += I.nodeValue.length;
        else if (I.nodeType === 1) {
        if (Q.push({
            event: "start",
            offset: Z,
            node: I
          }), Z = B(I, Z), !TD1(I).match(/br|hr|img|input/)) Q.push({
          event: "stop",
          offset: Z,
          node: I
        })
      }
      return Z
    }(A, 0), Q
  }

  function xo9(A, Q, B) {
    let G = 0,
      Z = "",
      I = [];

    function Y() {
      if (!A.length || !Q.length) return A.length ? A : Q;
      if (A[0].offset !== Q[0].offset) return A[0].offset < Q[0].offset ? A : Q;
      return Q[0].event === "start" ? A : Q
    }

    function J(V) {
      function F(K) {
        return " " + K.nodeName + '="' + J9A(K.value) + '"'
      }
      Z += "<" + TD1(V) + [].map.call(V.attributes, F).join("") + ">"
    }

    function W(V) {
      Z += "</" + TD1(V) + ">"
    }

    function X(V) {
      (V.event === "start" ? J : W)(V.node)
    }
    while (A.length || Q.length) {
      let V = Y();
      if (Z += J9A(B.substring(G, V[0].offset)), G = V[0].offset, V === A) {
        I.reverse().forEach(W);
        do X(V.splice(0, 1)[0]), V = Y(); while (V === A && V.length && V[0].offset === G);
        I.reverse().forEach(J)
      } else {
        if (V[0].event === "start") I.push(V[0].node);
        else I.pop();
        X(V.splice(0, 1)[0])
      }
    }
    return Z + J9A(B.substr(G))
  }
  var FS0 = {},
    MD1 = (A) => {
      console.error(A)
    },
    KS0 = (A, ...Q) => {
      console.log(`WARN: ${A}`, ...Q)
    },
    lN = (A, Q) => {
      if (FS0[`${A}/${Q}`]) return;
      console.log(`Deprecated as of ${A}. ${Q}`), FS0[`${A}/${Q}`] = !0
    },
    OD1 = J9A,
    DS0 = Tm,
    HS0 = Symbol("nomatch"),
    vo9 = function(A) {
      let Q = Object.create(null),
        B = Object.create(null),
        G = [],
        Z = !0,
        I = /(^(<[^>]+>|\t|)+|\n)/gm,
        Y = "Could not find the language '{}', did you forget to load/include a language module?",
        J = {
          disableAutodetect: !0,
          name: "Plain text",
          contains: []
        },
        W = {
          noHighlightRe: /^(no-?highlight)$/i,
          languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
          classPrefix: "hljs-",
          tabReplace: null,
          useBR: !1,
          languages: null,
          __emitter: zS0
        };

      function X(wA) {
        return W.noHighlightRe.test(wA)
      }

      function V(wA) {
        let qA = wA.className + " ";
        qA += wA.parentNode ? wA.parentNode.className : "";
        let KA = W.languageDetectRe.exec(qA);
        if (KA) {
          let yA = m(KA[1]);
          if (!yA) KS0(Y.replace("{}", KA[1])), KS0("Falling back to no-highlight mode for this block.", wA);
          return yA ? KA[1] : "no-highlight"
        }
        return qA.split(/\s+/).find((yA) => X(yA) || m(yA))
      }

      function F(wA, qA, KA, yA) {
        let oA = "",
          X1 = "";
        if (typeof qA === "object") oA = wA, KA = qA.ignoreIllegals, X1 = qA.language, yA = void 0;
        else lN("10.7.0", "highlight(lang, code, ...args) has been deprecated."), lN("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), X1 = wA, oA = qA;
        let WA = {
          code: oA,
          language: X1
        };
        NA("before:highlight", WA);
        let EA = WA.result ? WA.result : K(WA.language, WA.code, KA, yA);
        return EA.code = WA.code, NA("after:highlight", EA), EA
      }

      function K(wA, qA, KA, yA) {
        function oA(O1, a1) {
          let C0 = jA.case_insensitive ? a1[0].toLowerCase() : a1[0];
          return Object.prototype.hasOwnProperty.call(O1.keywords, C0) && O1.keywords[C0]
        }

        function X1() {
          if (!v1.keywords) {
            g0.addText(p0);
            return
          }
          let O1 = 0;
          v1.keywordPatternRe.lastIndex = 0;
          let a1 = v1.keywordPatternRe.exec(p0),
            C0 = "";
          while (a1) {
            C0 += p0.substring(O1, a1.index);
            let v0 = oA(v1, a1);
            if (v0) {
              let [k0, f0] = v0;
              if (g0.addText(C0), C0 = "", n0 += f0, k0.startsWith("_")) C0 += a1[0];
              else {
                let G0 = jA.classNameAliases[k0] || k0;
                g0.addKeyword(a1[0], G0)
              }
            } else C0 += a1[0];
            O1 = v1.keywordPatternRe.lastIndex, a1 = v1.keywordPatternRe.exec(p0)
          }
          C0 += p0.substr(O1), g0.addText(C0)
        }

        function WA() {
          if (p0 === "") return;
          let O1 = null;
          if (typeof v1.subLanguage === "string") {
            if (!Q[v1.subLanguage]) {
              g0.addText(p0);
              return
            }
            O1 = K(v1.subLanguage, p0, !0, F0[v1.subLanguage]), F0[v1.subLanguage] = O1.top
          } else O1 = H(p0, v1.subLanguage.length ? v1.subLanguage : null);
          if (v1.relevance > 0) n0 += O1.relevance;
          g0.addSublanguage(O1.emitter, O1.language)
        }

        function EA() {
          if (v1.subLanguage != null) WA();
          else X1();
          p0 = ""
        }

        function MA(O1) {
          if (O1.className) g0.openNode(jA.classNameAliases[O1.className] || O1.className);
          return v1 = Object.create(O1, {
            parent: {
              value: v1
            }
          }), v1
        }

        function DA(O1, a1, C0) {
          let v0 = er9(O1.endRe, C0);
          if (v0) {
            if (O1["on:end"]) {
              let k0 = new RD1(O1);
              if (O1["on:end"](a1, k0), k0.isMatchIgnored) v0 = !1
            }
            if (v0) {
              while (O1.endsParent && O1.parent) O1 = O1.parent;
              return O1
            }
          }
          if (O1.endsWithParent) return DA(O1.parent, a1, C0)
        }

        function $A(O1) {
          if (v1.matcher.regexIndex === 0) return p0 += O1[0], 1;
          else return W1 = !0, 0
        }

        function TA(O1) {
          let a1 = O1[0],
            C0 = O1.rule,
            v0 = new RD1(C0),
            k0 = [C0.__beforeBegin, C0["on:begin"]];
          for (let f0 of k0) {
            if (!f0) continue;
            if (f0(O1, v0), v0.isMatchIgnored) return $A(a1)
          }
          if (C0 && C0.endSameAsBegin) C0.endRe = sr9(a1);
          if (C0.skip) p0 += a1;
          else {
            if (C0.excludeBegin) p0 += a1;
            if (EA(), !C0.returnBegin && !C0.excludeBegin) p0 = a1
          }
          return MA(C0), C0.returnBegin ? 0 : a1.length
        }

        function rA(O1) {
          let a1 = O1[0],
            C0 = qA.substr(O1.index),
            v0 = DA(v1, O1, C0);
          if (!v0) return HS0;
          let k0 = v1;
          if (k0.skip) p0 += a1;
          else {
            if (!(k0.returnEnd || k0.excludeEnd)) p0 += a1;
            if (EA(), k0.excludeEnd) p0 = a1
          }
          do {
            if (v1.className) g0.closeNode();
            if (!v1.skip && !v1.subLanguage) n0 += v1.relevance;
            v1 = v1.parent
          } while (v1 !== v0.parent);
          if (v0.starts) {
            if (v0.endSameAsBegin) v0.starts.endRe = v0.endRe;
            MA(v0.starts)
          }
          return k0.returnEnd ? 0 : a1.length
        }

        function iA() {
          let O1 = [];
          for (let a1 = v1; a1 !== jA; a1 = a1.parent)
            if (a1.className) O1.unshift(a1.className);
          O1.forEach((a1) => g0.openNode(a1))
        }
        let J1 = {};

        function w1(O1, a1) {
          let C0 = a1 && a1[0];
          if (p0 += O1, C0 == null) return EA(), 0;
          if (J1.type === "begin" && a1.type === "end" && J1.index === a1.index && C0 === "") {
            if (p0 += qA.slice(a1.index, a1.index + 1), !Z) {
              let v0 = Error("0 width match regex");
              throw v0.languageName = wA, v0.badRule = J1.rule, v0
            }
            return 1
          }
          if (J1 = a1, a1.type === "begin") return TA(a1);
          else if (a1.type === "illegal" && !KA) {
            let v0 = Error('Illegal lexeme "' + C0 + '" for mode "' + (v1.className || "<unnamed>") + '"');
            throw v0.mode = v1, v0
          } else if (a1.type === "end") {
            let v0 = rA(a1);
            if (v0 !== HS0) return v0
          }
          if (a1.type === "illegal" && C0 === "") return 1;
          if (zQ > 1e5 && zQ > a1.index * 3) throw Error("potential infinite loop, way more iterations than matches");
          return p0 += C0, C0.length
        }
        let jA = m(wA);
        if (!jA) throw MD1(Y.replace("{}", wA)), Error('Unknown language: "' + wA + '"');
        let eA = Po9(jA, {
            plugins: G
          }),
          t1 = "",
          v1 = yA || eA,
          F0 = {},
          g0 = new W.__emitter(W);
        iA();
        let p0 = "",
          n0 = 0,
          _1 = 0,
          zQ = 0,
          W1 = !1;
        try {
          v1.matcher.considerAll();
          for (;;) {
            if (zQ++, W1) W1 = !1;
            else v1.matcher.considerAll();
            v1.matcher.lastIndex = _1;
            let O1 = v1.matcher.exec(qA);
            if (!O1) break;
            let a1 = qA.substring(_1, O1.index),
              C0 = w1(a1, O1);
            _1 = O1.index + C0
          }
          return w1(qA.substr(_1)), g0.closeAllNodes(), g0.finalize(), t1 = g0.toHTML(), {
            relevance: Math.floor(n0),
            value: t1,
            language: wA,
            illegal: !1,
            emitter: g0,
            top: v1
          }
        } catch (O1) {
          if (O1.message && O1.message.includes("Illegal")) return {
            illegal: !0,
            illegalBy: {
              msg: O1.message,
              context: qA.slice(_1 - 100, _1 + 100),
              mode: O1.mode
            },
            sofar: t1,
            relevance: 0,
            value: OD1(qA),
            emitter: g0
          };
          else if (Z) return {
            illegal: !1,
            relevance: 0,
            value: OD1(qA),
            emitter: g0,
            language: wA,
            top: v1,
            errorRaised: O1
          };
          else throw O1
        }
      }

      function D(wA) {
        let qA = {
          relevance: 0,
          emitter: new W.__emitter(W),
          value: OD1(wA),
          illegal: !1,
          top: J
        };
        return qA.emitter.addText(wA), qA
      }

      function H(wA, qA) {
        qA = qA || W.languages || Object.keys(Q);
        let KA = D(wA),
          yA = qA.filter(m).filter(IA).map((MA) => K(MA, wA, !1));
        yA.unshift(KA);
        let oA = yA.sort((MA, DA) => {
            if (MA.relevance !== DA.relevance) return DA.relevance - MA.relevance;
            if (MA.language && DA.language) {
              if (m(MA.language).supersetOf === DA.language) return 1;
              else if (m(DA.language).supersetOf === MA.language) return -1
            }
            return 0
          }),
          [X1, WA] = oA,
          EA = X1;
        return EA.second_best = WA, EA
      }

      function C(wA) {
        if (!(W.tabReplace || W.useBR)) return wA;
        return wA.replace(I, (qA) => {
          if (qA === `
`) return W.useBR ? "<br>" : qA;
          else if (W.tabReplace) return qA.replace(/\t/g, W.tabReplace);
          return qA
        })
      }

      function E(wA, qA, KA) {
        let yA = qA ? B[qA] : KA;
        if (wA.classList.add("hljs"), yA) wA.classList.add(yA)
      }
      let U = {
          "before:highlightElement": ({
            el: wA
          }) => {
            if (W.useBR) wA.innerHTML = wA.innerHTML.replace(/\n/g, "").replace(/<br[ /]*>/g, `
`)
          },
          "after:highlightElement": ({
            result: wA
          }) => {
            if (W.useBR) wA.value = wA.value.replace(/\n/g, "<br>")
          }
        },
        q = /^(<[^>]+>|\t)+/gm,
        w = {
          "after:highlightElement": ({
            result: wA
          }) => {
            if (W.tabReplace) wA.value = wA.value.replace(q, (qA) => qA.replace(/\t/g, W.tabReplace))
          }
        };

      function N(wA) {
        let qA = null,
          KA = V(wA);
        if (X(KA)) return;
        NA("before:highlightElement", {
          el: wA,
          language: KA
        }), qA = wA;
        let yA = qA.textContent,
          oA = KA ? F(yA, {
            language: KA,
            ignoreIllegals: !0
          }) : H(yA);
        if (NA("after:highlightElement", {
            el: wA,
            result: oA,
            text: yA
          }), wA.innerHTML = oA.value, E(wA, KA, oA.language), wA.result = {
            language: oA.language,
            re: oA.relevance,
            relavance: oA.relevance
          }, oA.second_best) wA.second_best = {
          language: oA.second_best.language,
          re: oA.second_best.relevance,
          relavance: oA.second_best.relevance
        }
      }

      function R(wA) {
        if (wA.useBR) lN("10.3.0", "'useBR' will be removed entirely in v11.0"), lN("10.3.0", "Please see https://github.com/highlightjs/highlight.js/issues/2559");
        W = DS0(W, wA)
      }
      let T = () => {
        if (T.called) return;
        T.called = !0, lN("10.6.0", "initHighlighting() is deprecated.  Use highlightAll() instead."), document.querySelectorAll("pre code").forEach(N)
      };

      function y() {
        lN("10.6.0", "initHighlightingOnLoad() is deprecated.  Use highlightAll() instead."), v = !0
      }
      let v = !1;

      function x() {
        if (document.readyState === "loading") {
          v = !0;
          return
        }
        document.querySelectorAll("pre code").forEach(N)
      }

      function p() {
        if (v) x()
      }
      if (typeof window < "u" && window.addEventListener) window.addEventListener("DOMContentLoaded", p, !1);

      function u(wA, qA) {
        let KA = null;
        try {
          KA = qA(A)
        } catch (yA) {
          if (MD1("Language definition for '{}' could not be registered.".replace("{}", wA)), !Z) throw yA;
          else MD1(yA);
          KA = J
        }
        if (!KA.name) KA.name = wA;
        if (Q[wA] = KA, KA.rawDefinition = qA.bind(null, A), KA.aliases) o(KA.aliases, {
          languageName: wA
        })
      }

      function e(wA) {
        delete Q[wA];
        for (let qA of Object.keys(B))
          if (B[qA] === wA) delete B[qA]
      }

      function l() {
        return Object.keys(Q)
      }

      function k(wA) {
        lN("10.4.0", "requireLanguage will be removed entirely in v11."), lN("10.4.0", "Please see https://github.com/highlightjs/highlight.js/pull/2844");
        let qA = m(wA);
        if (qA) return qA;
        throw Error("The '{}' language is required, but not loaded.".replace("{}", wA))
      }

      function m(wA) {
        return wA = (wA || "").toLowerCase(), Q[wA] || Q[B[wA]]
      }

      function o(wA, {
        languageName: qA
      }) {
        if (typeof wA === "string") wA = [wA];
        wA.forEach((KA) => {
          B[KA.toLowerCase()] = qA
        })
      }

      function IA(wA) {
        let qA = m(wA);
        return qA && !qA.disableAutodetect
      }

      function FA(wA) {
        if (wA["before:highlightBlock"] && !wA["before:highlightElement"]) wA["before:highlightElement"] = (qA) => {
          wA["before:highlightBlock"](Object.assign({
            block: qA.el
          }, qA))
        };
        if (wA["after:highlightBlock"] && !wA["after:highlightElement"]) wA["after:highlightElement"] = (qA) => {
          wA["after:highlightBlock"](Object.assign({
            block: qA.el
          }, qA))
        }
      }

      function zA(wA) {
        FA(wA), G.push(wA)
      }

      function NA(wA, qA) {
        let KA = wA;
        G.forEach(function(yA) {
          if (yA[KA]) yA[KA](qA)
        })
      }

      function OA(wA) {
        return lN("10.2.0", "fixMarkup will be removed entirely in v11.0"), lN("10.2.0", "Please see https://github.com/highlightjs/highlight.js/issues/2534"), C(wA)
      }

      function mA(wA) {
        return lN("10.7.0", "highlightBlock will be removed entirely in v12.0"), lN("10.7.0", "Please use highlightElement now."), N(wA)
      }
      Object.assign(A, {
        highlight: F,
        highlightAuto: H,
        highlightAll: x,
        fixMarkup: OA,
        highlightElement: N,
        highlightBlock: mA,
        configure: R,
        initHighlighting: T,
        initHighlightingOnLoad: y,
        registerLanguage: u,
        unregisterLanguage: e,
        listLanguages: l,
        getLanguage: m,
        registerAliases: o,
        requireLanguage: k,
        autoDetection: IA,
        inherit: DS0,
        addPlugin: zA,
        vuePlugin: ko9(A).VuePlugin
      }), A.debugMode = function() {
        Z = !1
      }, A.safeMode = function() {
        Z = !0
      }, A.versionString = So9;
      for (let wA in dyA)
        if (typeof dyA[wA] === "object") CS0(dyA[wA]);
      return Object.assign(A, dyA), A.addPlugin(U), A.addPlugin(yo9), A.addPlugin(w), A
    },
    bo9 = vo9({});
  MS0.exports = bo9
})
// @from(Start 411378, End 442952)
TS0 = z((WB7, RS0) => {
  function fo9(A) {
    var Q = "[A-Za-zА-Яа-яёЁ_][A-Za-zА-Яа-яёЁ_0-9]+",
      B = "далее ",
      G = "возврат вызватьисключение выполнить для если и из или иначе иначеесли исключение каждого конецесли " + "конецпопытки конеццикла не новый перейти перем по пока попытка прервать продолжить тогда цикл экспорт ",
      Z = B + G,
      I = "загрузитьизфайла ",
      Y = "вебклиент вместо внешнеесоединение клиент конецобласти мобильноеприложениеклиент мобильноеприложениесервер " + "наклиенте наклиентенасервере наклиентенасерверебезконтекста насервере насерверебезконтекста область перед " + "после сервер толстыйклиентобычноеприложение толстыйклиентуправляемоеприложение тонкийклиент ",
      J = I + Y,
      W = "разделительстраниц разделительстрок символтабуляции ",
      X = "ansitooem oemtoansi ввестивидсубконто ввестиперечисление ввестипериод ввестиплансчетов выбранныйплансчетов " + "датагод датамесяц датачисло заголовоксистемы значениевстроку значениеизстроки каталогиб каталогпользователя " + "кодсимв конгода конецпериодаби конецрассчитанногопериодаби конецстандартногоинтервала конквартала конмесяца " + "коннедели лог лог10 максимальноеколичествосубконто названиеинтерфейса названиенабораправ назначитьвид " + "назначитьсчет найтиссылки началопериодаби началостандартногоинтервала начгода начквартала начмесяца " + "начнедели номерднягода номерднянедели номернеделигода обработкаожидания основнойжурналрасчетов " + "основнойплансчетов основнойязык очиститьокносообщений периодстр получитьвремята получитьдатута " + "получитьдокументта получитьзначенияотбора получитьпозициюта получитьпустоезначение получитьта " + "префиксавтонумерации пропись пустоезначение разм разобратьпозициюдокумента рассчитатьрегистрына " + "рассчитатьрегистрыпо симв создатьобъект статусвозврата стрколичествострок сформироватьпозициюдокумента " + "счетпокоду текущеевремя типзначения типзначениястр установитьтана установитьтапо фиксшаблон шаблон ",
      V = "acos asin atan base64значение base64строка cos exp log log10 pow sin sqrt tan xmlзначение xmlстрока " + "xmlтип xmlтипзнч активноеокно безопасныйрежим безопасныйрежимразделенияданных булево ввестидату ввестизначение " + "ввестистроку ввестичисло возможностьчтенияxml вопрос восстановитьзначение врег выгрузитьжурналрегистрации " + "выполнитьобработкуоповещения выполнитьпроверкуправдоступа вычислить год данныеформывзначение дата день деньгода " + "деньнедели добавитьмесяц заблокироватьданныедляредактирования заблокироватьработупользователя завершитьработусистемы " + "загрузитьвнешнююкомпоненту закрытьсправку записатьjson записатьxml записатьдатуjson записьжурналарегистрации " + "заполнитьзначениясвойств запроситьразрешениепользователя запуститьприложение запуститьсистему зафиксироватьтранзакцию " + "значениевданныеформы значениевстрокувнутр значениевфайл значениезаполнено значениеизстрокивнутр значениеизфайла " + "изxmlтипа импортмоделиxdto имякомпьютера имяпользователя инициализироватьпредопределенныеданные информацияобошибке " + "каталогбиблиотекимобильногоустройства каталогвременныхфайлов каталогдокументов каталогпрограммы кодироватьстроку " + "кодлокализацииинформационнойбазы кодсимвола командасистемы конецгода конецдня конецквартала конецмесяца конецминуты " + "конецнедели конецчаса конфигурациябазыданныхизмененадинамически конфигурацияизменена копироватьданныеформы " + "копироватьфайл краткоепредставлениеошибки лев макс местноевремя месяц мин минута монопольныйрежим найти " + "найтинедопустимыесимволыxml найтиокнопонавигационнойссылке найтипомеченныенаудаление найтипоссылкам найтифайлы " + "началогода началодня началоквартала началомесяца началоминуты началонедели началочаса начатьзапросразрешенияпользователя " + "начатьзапускприложения начатькопированиефайла начатьперемещениефайла начатьподключениевнешнейкомпоненты " + "начатьподключениерасширенияработыскриптографией начатьподключениерасширенияработысфайлами начатьпоискфайлов " + "начатьполучениекаталогавременныхфайлов начатьполучениекаталогадокументов начатьполучениерабочегокаталогаданныхпользователя " + "начатьполучениефайлов начатьпомещениефайла начатьпомещениефайлов начатьсозданиедвоичныхданныхизфайла начатьсозданиекаталога " + "начатьтранзакцию начатьудалениефайлов начатьустановкувнешнейкомпоненты начатьустановкурасширенияработыскриптографией " + "начатьустановкурасширенияработысфайлами неделягода необходимостьзавершениясоединения номерсеансаинформационнойбазы " + "номерсоединенияинформационнойбазы нрег нстр обновитьинтерфейс обновитьнумерациюобъектов обновитьповторноиспользуемыезначения " + "обработкапрерыванияпользователя объединитьфайлы окр описаниеошибки оповестить оповеститьобизменении " + "отключитьобработчикзапросанастроекклиенталицензирования отключитьобработчикожидания отключитьобработчикоповещения " + "открытьзначение открытьиндекссправки открытьсодержаниесправки открытьсправку открытьформу открытьформумодально " + "отменитьтранзакцию очиститьжурналрегистрации очиститьнастройкипользователя очиститьсообщения параметрыдоступа " + "перейтипонавигационнойссылке переместитьфайл подключитьвнешнююкомпоненту " + "подключитьобработчикзапросанастроекклиенталицензирования подключитьобработчикожидания подключитьобработчикоповещения " + "подключитьрасширениеработыскриптографией подключитьрасширениеработысфайлами подробноепредставлениеошибки " + "показатьвводдаты показатьвводзначения показатьвводстроки показатьвводчисла показатьвопрос показатьзначение " + "показатьинформациюобошибке показатьнакарте показатьоповещениепользователя показатьпредупреждение полноеимяпользователя " + "получитьcomобъект получитьxmlтип получитьадреспоместоположению получитьблокировкусеансов получитьвремязавершенияспящегосеанса " + "получитьвремязасыпанияпассивногосеанса получитьвремяожиданияблокировкиданных получитьданныевыбора " + "получитьдополнительныйпараметрклиенталицензирования получитьдопустимыекодылокализации получитьдопустимыечасовыепояса " + "получитьзаголовокклиентскогоприложения получитьзаголовоксистемы получитьзначенияотборажурналарегистрации " + "получитьидентификаторконфигурации получитьизвременногохранилища получитьимявременногофайла " + "получитьимяклиенталицензирования получитьинформациюэкрановклиента получитьиспользованиежурналарегистрации " + "получитьиспользованиесобытияжурналарегистрации получитькраткийзаголовокприложения получитьмакетоформления " + "получитьмаскувсефайлы получитьмаскувсефайлыклиента получитьмаскувсефайлысервера получитьместоположениепоадресу " + "получитьминимальнуюдлинупаролейпользователей получитьнавигационнуюссылку получитьнавигационнуюссылкуинформационнойбазы " + "получитьобновлениеконфигурациибазыданных получитьобновлениепредопределенныхданныхинформационнойбазы получитьобщиймакет " + "получитьобщуюформу получитьокна получитьоперативнуюотметкувремени получитьотключениебезопасногорежима " + "получитьпараметрыфункциональныхопцийинтерфейса получитьполноеимяпредопределенногозначения " + "получитьпредставлениянавигационныхссылок получитьпроверкусложностипаролейпользователей получитьразделительпути " + "получитьразделительпутиклиента получитьразделительпутисервера получитьсеансыинформационнойбазы " + "получитьскоростьклиентскогосоединения получитьсоединенияинформационнойбазы получитьсообщенияпользователю " + "получитьсоответствиеобъектаиформы получитьсоставстандартногоинтерфейсаodata получитьструктурухранениябазыданных " + "получитьтекущийсеансинформационнойбазы получитьфайл получитьфайлы получитьформу получитьфункциональнуюопцию " + "получитьфункциональнуюопциюинтерфейса получитьчасовойпоясинформационнойбазы пользователиос поместитьвовременноехранилище " + "поместитьфайл поместитьфайлы прав праводоступа предопределенноезначение представлениекодалокализации представлениепериода " + "представлениеправа представлениеприложения представлениесобытияжурналарегистрации представлениечасовогопояса предупреждение " + "прекратитьработусистемы привилегированныйрежим продолжитьвызов прочитатьjson прочитатьxml прочитатьдатуjson пустаястрока " + "рабочийкаталогданныхпользователя разблокироватьданныедляредактирования разделитьфайл разорватьсоединениесвнешнимисточникомданных " + "раскодироватьстроку рольдоступна секунда сигнал символ скопироватьжурналрегистрации смещениелетнеговремени " + "смещениестандартноговремени соединитьбуферыдвоичныхданных создатькаталог создатьфабрикуxdto сокрл сокрлп сокрп сообщить " + "состояние сохранитьзначение сохранитьнастройкипользователя сред стрдлина стрзаканчиваетсяна стрзаменить стрнайти стрначинаетсяс " + "строка строкасоединенияинформационнойбазы стрполучитьстроку стрразделить стрсоединить стрсравнить стрчисловхождений " + "стрчислострок стршаблон текущаядата текущаядатасеанса текущаяуниверсальнаядата текущаяуниверсальнаядатавмиллисекундах " + "текущийвариантинтерфейсаклиентскогоприложения текущийвариантосновногошрифтаклиентскогоприложения текущийкодлокализации " + "текущийрежимзапуска текущийязык текущийязыксистемы тип типзнч транзакцияактивна трег удалитьданныеинформационнойбазы " + "удалитьизвременногохранилища удалитьобъекты удалитьфайлы универсальноевремя установитьбезопасныйрежим " + "установитьбезопасныйрежимразделенияданных установитьблокировкусеансов установитьвнешнююкомпоненту " + "установитьвремязавершенияспящегосеанса установитьвремязасыпанияпассивногосеанса установитьвремяожиданияблокировкиданных " + "установитьзаголовокклиентскогоприложения установитьзаголовоксистемы установитьиспользованиежурналарегистрации " + "установитьиспользованиесобытияжурналарегистрации установитькраткийзаголовокприложения " + "установитьминимальнуюдлинупаролейпользователей установитьмонопольныйрежим установитьнастройкиклиенталицензирования " + "установитьобновлениепредопределенныхданныхинформационнойбазы установитьотключениебезопасногорежима " + "установитьпараметрыфункциональныхопцийинтерфейса установитьпривилегированныйрежим " + "установитьпроверкусложностипаролейпользователей установитьрасширениеработыскриптографией " + "установитьрасширениеработысфайлами установитьсоединениесвнешнимисточникомданных установитьсоответствиеобъектаиформы " + "установитьсоставстандартногоинтерфейсаodata установитьчасовойпоясинформационнойбазы установитьчасовойпояссеанса " + "формат цел час часовойпояс часовойпояссеанса число числопрописью этоадресвременногохранилища ",
      F = "wsссылки библиотекакартинок библиотекамакетовоформлениякомпоновкиданных библиотекастилей бизнеспроцессы " + "внешниеисточникиданных внешниеобработки внешниеотчеты встроенныепокупки главныйинтерфейс главныйстиль " + "документы доставляемыеуведомления журналыдокументов задачи информацияобинтернетсоединении использованиерабочейдаты " + "историяработыпользователя константы критерииотбора метаданные обработки отображениерекламы отправкадоставляемыхуведомлений " + "отчеты панельзадачос параметрзапуска параметрысеанса перечисления планывидоврасчета планывидовхарактеристик " + "планыобмена планысчетов полнотекстовыйпоиск пользователиинформационнойбазы последовательности проверкавстроенныхпокупок " + "рабочаядата расширенияконфигурации регистрыбухгалтерии регистрынакопления регистрырасчета регистрысведений " + "регламентныезадания сериализаторxdto справочники средствагеопозиционирования средствакриптографии средствамультимедиа " + "средстваотображениярекламы средствапочты средствателефонии фабрикаxdto файловыепотоки фоновыезадания хранилищанастроек " + "хранилищевариантовотчетов хранилищенастроекданныхформ хранилищеобщихнастроек хранилищепользовательскихнастроекдинамическихсписков " + "хранилищепользовательскихнастроекотчетов хранилищесистемныхнастроек ",
      K = W + X + V + F,
      D = "webцвета windowsцвета windowsшрифты библиотекакартинок рамкистиля символы цветастиля шрифтыстиля ",
      H = "автоматическоесохранениеданныхформывнастройках автонумерациявформе автораздвижениесерий " + "анимациядиаграммы вариантвыравниванияэлементовизаголовков вариантуправлениявысотойтаблицы " + "вертикальнаяпрокруткаформы вертикальноеположение вертикальноеположениеэлемента видгруппыформы " + "виддекорацииформы виддополненияэлементаформы видизмененияданных видкнопкиформы видпереключателя " + "видподписейкдиаграмме видполяформы видфлажка влияниеразмеранапузырекдиаграммы горизонтальноеположение " + "горизонтальноеположениеэлемента группировкаколонок группировкаподчиненныхэлементовформы " + "группыиэлементы действиеперетаскивания дополнительныйрежимотображения допустимыедействияперетаскивания " + "интервалмеждуэлементамиформы использованиевывода использованиеполосыпрокрутки " + "используемоезначениеточкибиржевойдиаграммы историявыборапривводе источникзначенийоситочекдиаграммы " + "источникзначенияразмерапузырькадиаграммы категориягруппыкоманд максимумсерий начальноеотображениедерева " + "начальноеотображениесписка обновлениетекстаредактирования ориентациядендрограммы ориентациядиаграммы " + "ориентацияметокдиаграммы ориентацияметоксводнойдиаграммы ориентацияэлементаформы отображениевдиаграмме " + "отображениевлегендедиаграммы отображениегруппыкнопок отображениезаголовкашкалыдиаграммы " + "отображениезначенийсводнойдиаграммы отображениезначенияизмерительнойдиаграммы " + "отображениеинтерваладиаграммыганта отображениекнопки отображениекнопкивыбора отображениеобсужденийформы " + "отображениеобычнойгруппы отображениеотрицательныхзначенийпузырьковойдиаграммы отображениепанелипоиска " + "отображениеподсказки отображениепредупрежденияприредактировании отображениеразметкиполосырегулирования " + "отображениестраницформы отображениетаблицы отображениетекстазначениядиаграммыганта " + "отображениеуправленияобычнойгруппы отображениефигурыкнопки палитрацветовдиаграммы поведениеобычнойгруппы " + "поддержкамасштабадендрограммы поддержкамасштабадиаграммыганта поддержкамасштабасводнойдиаграммы " + "поисквтаблицепривводе положениезаголовкаэлементаформы положениекартинкикнопкиформы " + "положениекартинкиэлементаграфическойсхемы положениекоманднойпанелиформы положениекоманднойпанелиэлементаформы " + "положениеопорнойточкиотрисовки положениеподписейкдиаграмме положениеподписейшкалызначенийизмерительнойдиаграммы " + "положениесостоянияпросмотра положениестрокипоиска положениетекстасоединительнойлинии положениеуправленияпоиском " + "положениешкалывремени порядокотображенияточекгоризонтальнойгистограммы порядоксерийвлегендедиаграммы " + "размеркартинки расположениезаголовкашкалыдиаграммы растягиваниеповертикалидиаграммыганта " + "режимавтоотображениясостояния режимвводастроктаблицы режимвыборанезаполненного режимвыделениядаты " + "режимвыделениястрокитаблицы режимвыделениятаблицы режимизмененияразмера режимизменениясвязанногозначения " + "режимиспользованиядиалогапечати режимиспользованияпараметракоманды режиммасштабированияпросмотра " + "режимосновногоокнаклиентскогоприложения режимоткрытияокнаформы режимотображениявыделения " + "режимотображениягеографическойсхемы режимотображениязначенийсерии режимотрисовкисеткиграфическойсхемы " + "режимполупрозрачностидиаграммы режимпробеловдиаграммы режимразмещениянастранице режимредактированияколонки " + "режимсглаживаниядиаграммы режимсглаживанияиндикатора режимсписказадач сквозноевыравнивание " + "сохранениеданныхформывнастройках способзаполнениятекстазаголовкашкалыдиаграммы " + "способопределенияограничивающегозначениядиаграммы стандартнаягруппакоманд стандартноеоформление " + "статусоповещенияпользователя стильстрелки типаппроксимациилиниитрендадиаграммы типдиаграммы " + "типединицышкалывремени типимпортасерийслоягеографическойсхемы типлиниигеографическойсхемы типлиниидиаграммы " + "типмаркерагеографическойсхемы типмаркерадиаграммы типобластиоформления " + "типорганизацииисточникаданныхгеографическойсхемы типотображениясериислоягеографическойсхемы " + "типотображенияточечногообъектагеографическойсхемы типотображенияшкалыэлементалегендыгеографическойсхемы " + "типпоискаобъектовгеографическойсхемы типпроекциигеографическойсхемы типразмещенияизмерений " + "типразмещенияреквизитовизмерений типрамкиэлементауправления типсводнойдиаграммы " + "типсвязидиаграммыганта типсоединениязначенийпосериямдиаграммы типсоединенияточекдиаграммы " + "типсоединительнойлинии типстороныэлементаграфическойсхемы типформыотчета типшкалырадарнойдиаграммы " + "факторлиниитрендадиаграммы фигуракнопки фигурыграфическойсхемы фиксациявтаблице форматдняшкалывремени " + "форматкартинки ширинаподчиненныхэлементовформы ",
      C = "виддвижениябухгалтерии виддвижениянакопления видпериодарегистрарасчета видсчета видточкимаршрутабизнеспроцесса " + "использованиеагрегатарегистранакопления использованиегруппиэлементов использованиережимапроведения " + "использованиесреза периодичностьагрегатарегистранакопления режимавтовремя режимзаписидокумента режимпроведениядокумента ",
      E = "авторегистрацияизменений допустимыйномерсообщения отправкаэлементаданных получениеэлементаданных ",
      U = "использованиерасшифровкитабличногодокумента ориентациястраницы положениеитоговколоноксводнойтаблицы " + "положениеитоговстроксводнойтаблицы положениетекстаотносительнокартинки расположениезаголовкагруппировкитабличногодокумента " + "способчтениязначенийтабличногодокумента типдвустороннейпечати типзаполненияобластитабличногодокумента " + "типкурсоровтабличногодокумента типлиниирисункатабличногодокумента типлинииячейкитабличногодокумента " + "типнаправленияпереходатабличногодокумента типотображениявыделениятабличногодокумента типотображениялинийсводнойтаблицы " + "типразмещениятекстатабличногодокумента типрисункатабличногодокумента типсмещениятабличногодокумента " + "типузоратабличногодокумента типфайлатабличногодокумента точностьпечати чередованиерасположениястраниц ",
      q = "отображениевремениэлементовпланировщика ",
      w = "типфайлаформатированногодокумента ",
      N = "обходрезультатазапроса типзаписизапроса ",
      R = "видзаполнениярасшифровкипостроителяотчета типдобавленияпредставлений типизмеренияпостроителяотчета типразмещенияитогов ",
      T = "доступкфайлу режимдиалогавыборафайла режимоткрытияфайла ",
      y = "типизмеренияпостроителязапроса ",
      v = "видданныханализа методкластеризации типединицыинтервалавременианализаданных типзаполнениятаблицырезультатаанализаданных " + "типиспользованиячисловыхзначенийанализаданных типисточникаданныхпоискаассоциаций типколонкианализаданныхдереворешений " + "типколонкианализаданныхкластеризация типколонкианализаданныхобщаястатистика типколонкианализаданныхпоискассоциаций " + "типколонкианализаданныхпоискпоследовательностей типколонкимоделипрогноза типмерырасстоянияанализаданных " + "типотсеченияправилассоциации типполяанализаданных типстандартизациианализаданных типупорядочиванияправилассоциациианализаданных " + "типупорядочиванияшаблоновпоследовательностейанализаданных типупрощениядереварешений ",
      x = "wsнаправлениепараметра вариантxpathxs вариантзаписидатыjson вариантпростоготипаxs видгруппымоделиxs видфасетаxdto " + "действиепостроителяdom завершенностьпростоготипаxs завершенностьсоставноготипаxs завершенностьсхемыxs запрещенныеподстановкиxs " + "исключениягруппподстановкиxs категорияиспользованияатрибутаxs категорияограниченияидентичностиxs категорияограниченияпространствименxs " + "методнаследованияxs модельсодержимогоxs назначениетипаxml недопустимыеподстановкиxs обработкапробельныхсимволовxs обработкасодержимогоxs " + "ограничениезначенияxs параметрыотбораузловdom переносстрокjson позициявдокументеdom пробельныесимволыxml типатрибутаxml типзначенияjson " + "типканоническогоxml типкомпонентыxs типпроверкиxml типрезультатаdomxpath типузлаdom типузлаxml формаxml формапредставленияxs " + "форматдатыjson экранированиесимволовjson ",
      p = "видсравнениякомпоновкиданных действиеобработкирасшифровкикомпоновкиданных направлениесортировкикомпоновкиданных " + "расположениевложенныхэлементоврезультатакомпоновкиданных расположениеитоговкомпоновкиданных расположениегруппировкикомпоновкиданных " + "расположениеполейгруппировкикомпоновкиданных расположениеполякомпоновкиданных расположениереквизитовкомпоновкиданных " + "расположениересурсовкомпоновкиданных типбухгалтерскогоостаткакомпоновкиданных типвыводатекстакомпоновкиданных " + "типгруппировкикомпоновкиданных типгруппыэлементовотборакомпоновкиданных типдополненияпериодакомпоновкиданных " + "типзаголовкаполейкомпоновкиданных типмакетагруппировкикомпоновкиданных типмакетаобластикомпоновкиданных типостаткакомпоновкиданных " + "типпериодакомпоновкиданных типразмещениятекстакомпоновкиданных типсвязинаборовданныхкомпоновкиданных типэлементарезультатакомпоновкиданных " + "расположениелегендыдиаграммыкомпоновкиданных типпримененияотборакомпоновкиданных режимотображенияэлементанастройкикомпоновкиданных " + "режимотображениянастроеккомпоновкиданных состояниеэлементанастройкикомпоновкиданных способвосстановлениянастроеккомпоновкиданных " + "режимкомпоновкирезультата использованиепараметракомпоновкиданных автопозицияресурсовкомпоновкиданных " + "вариантиспользованиягруппировкикомпоновкиданных расположениересурсоввдиаграммекомпоновкиданных фиксациякомпоновкиданных " + "использованиеусловногооформлениякомпоновкиданных ",
      u = "важностьинтернетпочтовогосообщения обработкатекстаинтернетпочтовогосообщения способкодированияинтернетпочтовоговложения " + "способкодированиянеasciiсимволовинтернетпочтовогосообщения типтекстапочтовогосообщения протоколинтернетпочты " + "статусразборапочтовогосообщения ",
      e = "режимтранзакциизаписижурналарегистрации статустранзакциизаписижурналарегистрации уровеньжурналарегистрации ",
      l = "расположениехранилищасертификатовкриптографии режимвключениясертификатовкриптографии режимпроверкисертификатакриптографии " + "типхранилищасертификатовкриптографии ",
      k = "кодировкаименфайловвzipфайле методсжатияzip методшифрованияzip режимвосстановленияпутейфайловzip режимобработкиподкаталоговzip " + "режимсохраненияпутейzip уровеньсжатияzip ",
      m = "звуковоеоповещение направлениепереходакстроке позициявпотоке порядокбайтов режимблокировкиданных режимуправленияблокировкойданных " + "сервисвстроенныхпокупок состояниефоновогозадания типподписчикадоставляемыхуведомлений уровеньиспользованиязащищенногосоединенияftp ",
      o = "направлениепорядкасхемызапроса типдополненияпериодамисхемызапроса типконтрольнойточкисхемызапроса типобъединениясхемызапроса " + "типпараметрадоступнойтаблицысхемызапроса типсоединениясхемызапроса ",
      IA = "httpметод автоиспользованиеобщегореквизита автопрефиксномеразадачи вариантвстроенногоязыка видиерархии видрегистранакопления " + "видтаблицывнешнегоисточникаданных записьдвиженийприпроведении заполнениепоследовательностей индексирование " + "использованиебазыпланавидоврасчета использованиебыстроговыбора использованиеобщегореквизита использованиеподчинения " + "использованиеполнотекстовогопоиска использованиеразделяемыхданныхобщегореквизита использованиереквизита " + "назначениеиспользованияприложения назначениерасширенияконфигурации направлениепередачи обновлениепредопределенныхданных " + "оперативноепроведение основноепредставлениевидарасчета основноепредставлениевидахарактеристики основноепредставлениезадачи " + "основноепредставлениепланаобмена основноепредставлениесправочника основноепредставлениесчета перемещениеграницыприпроведении " + "периодичностьномерабизнеспроцесса периодичностьномерадокумента периодичностьрегистрарасчета периодичностьрегистрасведений " + "повторноеиспользованиевозвращаемыхзначений полнотекстовыйпоискпривводепостроке принадлежностьобъекта проведение " + "разделениеаутентификацииобщегореквизита разделениеданныхобщегореквизита разделениерасширенийконфигурацииобщегореквизита " + "режимавтонумерацииобъектов режимзаписирегистра режимиспользованиямодальности " + "режимиспользованиясинхронныхвызововрасширенийплатформыивнешнихкомпонент режимповторногоиспользованиясеансов " + "режимполученияданныхвыборапривводепостроке режимсовместимости режимсовместимостиинтерфейса " + "режимуправленияблокировкойданныхпоумолчанию сериикодовпланавидовхарактеристик сериикодовпланасчетов " + "сериикодовсправочника созданиепривводе способвыбора способпоискастрокипривводепостроке способредактирования " + "типданныхтаблицывнешнегоисточникаданных типкодапланавидоврасчета типкодасправочника типмакета типномерабизнеспроцесса " + "типномерадокумента типномеразадачи типформы удалениедвижений ",
      FA = "важностьпроблемыприменениярасширенияконфигурации вариантинтерфейсаклиентскогоприложения вариантмасштабаформклиентскогоприложения " + "вариантосновногошрифтаклиентскогоприложения вариантстандартногопериода вариантстандартнойдатыначала видграницы видкартинки " + "видотображенияполнотекстовогопоиска видрамки видсравнения видцвета видчисловогозначения видшрифта допустимаядлина допустимыйзнак " + "использованиеbyteordermark использованиеметаданныхполнотекстовогопоиска источникрасширенийконфигурации клавиша кодвозвратадиалога " + "кодировкаxbase кодировкатекста направлениепоиска направлениесортировки обновлениепредопределенныхданных обновлениеприизмененииданных " + "отображениепанелиразделов проверказаполнения режимдиалогавопрос режимзапускаклиентскогоприложения режимокругления режимоткрытияформприложения " + "режимполнотекстовогопоиска скоростьклиентскогосоединения состояниевнешнегоисточникаданных состояниеобновленияконфигурациибазыданных " + "способвыборасертификатаwindows способкодированиястроки статуссообщения типвнешнейкомпоненты типплатформы типповеденияклавишиenter " + "типэлементаинформацииовыполненииобновленияконфигурациибазыданных уровеньизоляциитранзакций хешфункция частидаты",
      zA = D + H + C + E + U + q + w + N + R + T + y + v + x + p + u + e + l + k + m + o + IA + FA,
      NA = "comобъект ftpсоединение httpзапрос httpсервисответ httpсоединение wsопределения wsпрокси xbase анализданных аннотацияxs " + "блокировкаданных буфердвоичныхданных включениеxs выражениекомпоновкиданных генераторслучайныхчисел географическаясхема " + "географическиекоординаты графическаясхема группамоделиxs данныерасшифровкикомпоновкиданных двоичныеданные дендрограмма " + "диаграмма диаграммаганта диалогвыборафайла диалогвыборацвета диалогвыборашрифта диалограсписаниярегламентногозадания " + "диалогредактированиястандартногопериода диапазон документdom документhtml документацияxs доставляемоеуведомление " + "записьdom записьfastinfoset записьhtml записьjson записьxml записьzipфайла записьданных записьтекста записьузловdom " + "запрос защищенноесоединениеopenssl значенияполейрасшифровкикомпоновкиданных извлечениетекста импортxs интернетпочта " + "интернетпочтовоесообщение интернетпочтовыйпрофиль интернетпрокси интернетсоединение информациядляприложенияxs " + "использованиеатрибутаxs использованиесобытияжурналарегистрации источникдоступныхнастроеккомпоновкиданных " + "итераторузловdom картинка квалификаторыдаты квалификаторыдвоичныхданных квалификаторыстроки квалификаторычисла " + "компоновщикмакетакомпоновкиданных компоновщикнастроеккомпоновкиданных конструктормакетаоформлениякомпоновкиданных " + "конструкторнастроеккомпоновкиданных конструкторформатнойстроки линия макеткомпоновкиданных макетобластикомпоновкиданных " + "макетоформлениякомпоновкиданных маскаxs менеджеркриптографии наборсхемxml настройкикомпоновкиданных настройкисериализацииjson " + "обработкакартинок обработкарасшифровкикомпоновкиданных обходдереваdom объявлениеатрибутаxs объявлениенотацииxs " + "объявлениеэлементаxs описаниеиспользованиясобытиядоступжурналарегистрации " + "описаниеиспользованиясобытияотказвдоступежурналарегистрации описаниеобработкирасшифровкикомпоновкиданных " + "описаниепередаваемогофайла описаниетипов определениегруппыатрибутовxs определениегруппымоделиxs " + "определениеограниченияидентичностиxs определениепростоготипаxs определениесоставноготипаxs определениетипадокументаdom " + "определенияxpathxs отборкомпоновкиданных пакетотображаемыхдокументов параметрвыбора параметркомпоновкиданных " + "параметрызаписиjson параметрызаписиxml параметрычтенияxml переопределениеxs планировщик полеанализаданных " + "полекомпоновкиданных построительdom построительзапроса построительотчета построительотчетаанализаданных " + "построительсхемxml поток потоквпамяти почта почтовоесообщение преобразованиеxsl преобразованиекканоническомуxml " + "процессорвыводарезультатакомпоновкиданныхвколлекциюзначений процессорвыводарезультатакомпоновкиданныхвтабличныйдокумент " + "процессоркомпоновкиданных разыменовательпространствименdom рамка расписаниерегламентногозадания расширенноеимяxml " + "результатчтенияданных своднаядиаграмма связьпараметравыбора связьпотипу связьпотипукомпоновкиданных сериализаторxdto " + "сертификатклиентаwindows сертификатклиентафайл сертификаткриптографии сертификатыудостоверяющихцентровwindows " + "сертификатыудостоверяющихцентровфайл сжатиеданных системнаяинформация сообщениепользователю сочетаниеклавиш " + "сравнениезначений стандартнаядатаначала стандартныйпериод схемаxml схемакомпоновкиданных табличныйдокумент " + "текстовыйдокумент тестируемоеприложение типданныхxml уникальныйидентификатор фабрикаxdto файл файловыйпоток " + "фасетдлиныxs фасетколичестваразрядовдробнойчастиxs фасетмаксимальноговключающегозначенияxs " + "фасетмаксимальногоисключающегозначенияxs фасетмаксимальнойдлиныxs фасетминимальноговключающегозначенияxs " + "фасетминимальногоисключающегозначенияxs фасетминимальнойдлиныxs фасетобразцаxs фасетобщегоколичестваразрядовxs " + "фасетперечисленияxs фасетпробельныхсимволовxs фильтрузловdom форматированнаястрока форматированныйдокумент " + "фрагментxs хешированиеданных хранилищезначения цвет чтениеfastinfoset чтениеhtml чтениеjson чтениеxml чтениеzipфайла " + "чтениеданных чтениетекста чтениеузловdom шрифт элементрезультатакомпоновкиданных ",
      OA = "comsafearray деревозначений массив соответствие списокзначений структура таблицазначений фиксированнаяструктура " + "фиксированноесоответствие фиксированныймассив ",
      mA = NA + OA,
      wA = "null истина ложь неопределено",
      qA = A.inherit(A.NUMBER_MODE),
      KA = {
        className: "string",
        begin: '"|\\|',
        end: '"|$',
        contains: [{
          begin: '""'
        }]
      },
      yA = {
        begin: "'",
        end: "'",
        excludeBegin: !0,
        excludeEnd: !0,
        contains: [{
          className: "number",
          begin: "\\d{4}([\\.\\\\/:-]?\\d{2}){0,5}"
        }]
      },
      oA = A.inherit(A.C_LINE_COMMENT_MODE),
      X1 = {
        className: "meta",
        begin: "#|&",
        end: "$",
        keywords: {
          $pattern: Q,
          "meta-keyword": Z + J
        },
        contains: [oA]
      },
      WA = {
        className: "symbol",
        begin: "~",
        end: ";|:",
        excludeEnd: !0
      },
      EA = {
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
              literal: wA
            },
            contains: [qA, KA, yA]
          }, oA]
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
        built_in: K,
        class: zA,
        type: mA,
        literal: wA
      },
      contains: [X1, EA, oA, WA, qA, KA, yA]
    }
  }
  RS0.exports = fo9
})
// @from(Start 442958, End 444172)
jS0 = z((XB7, PS0) => {
  function ho9(A) {
    if (!A) return null;
    if (typeof A === "string") return A;
    return A.source
  }

  function go9(...A) {
    return A.map((B) => ho9(B)).join("")
  }

  function uo9(A) {
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
      I = {
        className: "symbol",
        begin: /%d[0-9]+(-[0-9]+|(\.[0-9]+)+){0,1}/
      },
      Y = {
        className: "symbol",
        begin: /%x[0-9A-F]+(-[0-9A-F]+|(\.[0-9A-F]+)+){0,1}/
      },
      J = {
        className: "symbol",
        begin: /%[si]/
      },
      W = {
        className: "attribute",
        begin: go9(Q.ruleDeclaration, /(?=\s*=)/)
      };
    return {
      name: "Augmented Backus-Naur Form",
      illegal: Q.unexpectedChars,
      keywords: B,
      contains: [W, G, Z, I, Y, J, A.QUOTE_STRING_MODE, A.NUMBER_MODE]
    }
  }
  PS0.exports = uo9
})
// @from(Start 444178, End 445645)
kS0 = z((VB7, _S0) => {
  function SS0(A) {
    if (!A) return null;
    if (typeof A === "string") return A;
    return A.source
  }

  function mo9(...A) {
    return A.map((B) => SS0(B)).join("")
  }

  function do9(...A) {
    return "(" + A.map((B) => SS0(B)).join("|") + ")"
  }

  function co9(A) {
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
        begin: mo9(/"/, do9(...Q)),
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
  _S0.exports = co9
})
// @from(Start 445651, End 447675)
xS0 = z((FB7, yS0) => {
  function po9(A) {
    if (!A) return null;
    if (typeof A === "string") return A;
    return A.source
  }

  function lo9(...A) {
    return A.map((B) => po9(B)).join("")
  }

  function io9(A) {
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
          begin: lo9(/:\s*/, B)
        }]
      }, A.METHOD_GUARD],
      illegal: /#/
    }
  }
  yS0.exports = io9
})