
// @from(Start 6467950, End 6473006)
class kNB {
  columns;
  _wrappedLines;
  text;
  navigationCache;
  graphemeBoundaries;
  constructor(A, Q) {
    this.columns = Q;
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
        of du1.segment(this.text)) this.graphemeBoundaries.push(A);
      this.graphemeBoundaries.push(this.text.length)
    }
    return this.graphemeBoundaries
  }
  binarySearchBoundary(A, Q, B) {
    let G = 0,
      Z = A.length - 1,
      I = B ? this.text.length : 0;
    while (G <= Z) {
      let Y = Math.floor((G + Z) / 2),
        J = A[Y];
      if (J === void 0) break;
      if (B)
        if (J > Q) I = J, Z = Y - 1;
        else G = Y + 1;
      else if (J < Q) I = J, G = Y + 1;
      else Z = Y - 1
    }
    return I
  }
  stringIndexToDisplayWidth(A, Q) {
    if (Q <= 0) return 0;
    if (Q >= A.length) return xZ(A);
    return xZ(A.substring(0, Q))
  }
  displayWidthToStringIndex(A, Q) {
    if (Q <= 0) return 0;
    if (!A) return 0;
    if (A === this.text) return this.offsetAtDisplayWidth(Q);
    let B = 0,
      G = 0;
    for (let {
        segment: Z,
        index: I
      }
      of du1.segment(A)) {
      let Y = xZ(Z);
      if (B + Y > Q) break;
      B += Y, G = I + Z.length
    }
    return G
  }
  offsetAtDisplayWidth(A) {
    if (A <= 0) return 0;
    let Q = 0,
      B = this.getGraphemeBoundaries();
    for (let G = 0; G < B.length - 1; G++) {
      let Z = B[G],
        I = B[G + 1];
      if (Z === void 0 || I === void 0) continue;
      let Y = this.text.substring(Z, I),
        J = xZ(Y);
      if (Q + J > A) return Z;
      Q += J
    }
    return this.text.length
  }
  measureWrappedText() {
    let A = U7A(this.text, this.columns, {
        hard: !0,
        trim: !1
      }),
      Q = [],
      B = 0,
      G = -1,
      Z = A.split(`
`);
    for (let I = 0; I < Z.length; I++) {
      let Y = Z[I],
        J = (W) => I === 0 || W > 0 && this.text[W - 1] === `
`;
      if (Y.length === 0)
        if (G = this.text.indexOf(`
`, G + 1), G !== -1) {
          let W = G,
            X = !0;
          Q.push(new jsA(Y, W, J(W), !0))
        } else {
          let W = this.text.length;
          Q.push(new jsA(Y, W, J(W), !1))
        }
      else {
        let W = this.text.indexOf(Y, B);
        if (W === -1) throw Error("Failed to find wrapped line in text");
        B = W + Y.length;
        let X = W + Y.length,
          V = X < this.text.length && this.text[X] === `
`;
        if (V) G = X;
        Q.push(new jsA(Y, W, J(W), V))
      }
    }
    return Q
  }
  getWrappedText() {
    return this.wrappedLines.map((A) => A.isPrecededByNewline ? A.text : A.text.trimStart())
  }
  getWrappedLines() {
    return this.wrappedLines
  }
  getLine(A) {
    let Q = this.wrappedLines;
    return Q[Math.max(0, Math.min(A, Q.length - 1))]
  }
  getOffsetFromPosition(A) {
    let Q = this.getLine(A.line);
    if (Q.text.length === 0 && Q.endsWithNewline) return Q.startOffset;
    let B = Q.isPrecededByNewline ? 0 : Q.text.length - Q.text.trimStart().length,
      G = A.column + B,
      Z = this.displayWidthToStringIndex(Q.text, G),
      I = Q.startOffset + Z,
      Y = Q.startOffset + Q.text.length,
      J = Y,
      W = xZ(Q.text);
    if (Q.endsWithNewline && A.column > W) J = Y + 1;
    return Math.min(I, J)
  }
  getLineLength(A) {
    let Q = this.getLine(A);
    return xZ(Q.text)
  }
  getPositionFromOffset(A) {
    let Q = this.wrappedLines;
    for (let Z = 0; Z < Q.length; Z++) {
      let I = Q[Z],
        Y = Q[Z + 1];
      if (A >= I.startOffset && (!Y || A < Y.startOffset)) {
        let J = A - I.startOffset,
          W;
        if (I.isPrecededByNewline) W = this.stringIndexToDisplayWidth(I.text, J);
        else {
          let X = I.text.length - I.text.trimStart().length;
          if (J < X) W = 0;
          else {
            let V = I.text.trimStart(),
              F = J - X;
            W = this.stringIndexToDisplayWidth(V, F)
          }
        }
        return {
          line: Z,
          column: Math.max(0, W)
        }
      }
    }
    let B = Q.length - 1,
      G = this.wrappedLines[B];
    return {
      line: B,
      column: xZ(G.text)
    }
  }
  get lineCount() {
    return this.wrappedLines.length
  }
  withCache(A, Q) {
    let B = this.navigationCache.get(A);
    if (B !== void 0) return B;
    let G = Q();
    return this.navigationCache.set(A, G), G
  }
  nextOffset(A) {
    return this.withCache(`next:${A}`, () => {
      let Q = this.getGraphemeBoundaries();
      return this.binarySearchBoundary(Q, A, !0)
    })
  }
  prevOffset(A) {
    if (A <= 0) return 0;
    return this.withCache(`prev:${A}`, () => {
      let Q = this.getGraphemeBoundaries();
      return this.binarySearchBoundary(Q, A, !1)
    })
  }
}
// @from(Start 6473011, End 6473019)
PsA = ""
// @from(Start 6473023, End 6473031)
mu1 = !1
// @from(Start 6473035, End 6473038)
du1
// @from(Start 6473044, End 6473150)
cu1 = L(() => {
  ah1();
  E7A();
  du1 = new Intl.Segmenter(void 0, {
    granularity: "grapheme"
  })
})
// @from(Start 6473156, End 6474905)
b_ = z((us7, xNB) => {
  var yNB = function(A) {
      return typeof A < "u" && A !== null
    },
    gH6 = function(A) {
      return typeof A === "object"
    },
    uH6 = function(A) {
      return Object.prototype.toString.call(A) === "[object Object]"
    },
    mH6 = function(A) {
      return typeof A === "function"
    },
    dH6 = function(A) {
      return typeof A === "boolean"
    },
    cH6 = function(A) {
      return A instanceof Buffer
    },
    pH6 = function(A) {
      if (yNB(A)) switch (A.constructor) {
        case Uint8Array:
        case Uint8ClampedArray:
        case Int8Array:
        case Uint16Array:
        case Int16Array:
        case Uint32Array:
        case Int32Array:
        case Float32Array:
        case Float64Array:
          return !0
      }
      return !1
    },
    lH6 = function(A) {
      return A instanceof ArrayBuffer
    },
    iH6 = function(A) {
      return typeof A === "string" && A.length > 0
    },
    nH6 = function(A) {
      return typeof A === "number" && !Number.isNaN(A)
    },
    aH6 = function(A) {
      return Number.isInteger(A)
    },
    sH6 = function(A, Q, B) {
      return A >= Q && A <= B
    },
    rH6 = function(A, Q) {
      return Q.includes(A)
    },
    oH6 = function(A, Q, B) {
      return Error(`Expected ${Q} for ${A} but received ${B} of type ${typeof B}`)
    },
    tH6 = function(A, Q) {
      return Q.message = A.message, Q
    };
  xNB.exports = {
    defined: yNB,
    object: gH6,
    plainObject: uH6,
    fn: mH6,
    bool: dH6,
    buffer: cH6,
    typedArray: pH6,
    arrayBuffer: lH6,
    string: iH6,
    number: nH6,
    integer: aH6,
    inRange: sH6,
    inArray: rH6,
    invalidParameterError: oH6,
    nativeError: tH6
  }
})
// @from(Start 6474911, End 6475345)
fNB = z((ms7, bNB) => {
  var vNB = () => process.platform === "linux",
    ksA = null,
    eH6 = () => {
      if (!ksA)
        if (vNB() && process.report) {
          let A = process.report.excludeNetwork;
          process.report.excludeNetwork = !0, ksA = process.report.getReport(), process.report.excludeNetwork = A
        } else ksA = {};
      return ksA
    };
  bNB.exports = {
    isLinux: vNB,
    getReport: eH6
  }
})
// @from(Start 6475351, End 6475679)
uNB = z((ds7, gNB) => {
  var hNB = UA("fs"),
    AC6 = (A) => hNB.readFileSync(A, "utf-8"),
    QC6 = (A) => new Promise((Q, B) => {
      hNB.readFile(A, "utf-8", (G, Z) => {
        if (G) B(G);
        else Q(Z)
      })
    });
  gNB.exports = {
    LDD_PATH: "/usr/bin/ldd",
    readFileSync: AC6,
    readFile: QC6
  }
})
// @from(Start 6475685, End 6479265)
xsA = z((cs7, BLB) => {
  var dNB = UA("child_process"),
    {
      isLinux: u7A,
      getReport: cNB
    } = fNB(),
    {
      LDD_PATH: ysA,
      readFile: pNB,
      readFileSync: lNB
    } = uNB(),
    f_, h_, Vp = "",
    iNB = () => {
      if (!Vp) return new Promise((A) => {
        dNB.exec("getconf GNU_LIBC_VERSION 2>&1 || true; ldd --version 2>&1 || true", (Q, B) => {
          Vp = Q ? " " : B, A(Vp)
        })
      });
      return Vp
    },
    nNB = () => {
      if (!Vp) try {
        Vp = dNB.execSync("getconf GNU_LIBC_VERSION 2>&1 || true; ldd --version 2>&1 || true", {
          encoding: "utf8"
        })
      } catch (A) {
        Vp = " "
      }
      return Vp
    },
    Fp = "glibc",
    aNB = /LIBC[a-z0-9 \-).]*?(\d+\.\d+)/i,
    g7A = "musl",
    BC6 = (A) => A.includes("libc.musl-") || A.includes("ld-musl-"),
    sNB = () => {
      let A = cNB();
      if (A.header && A.header.glibcVersionRuntime) return Fp;
      if (Array.isArray(A.sharedObjects)) {
        if (A.sharedObjects.some(BC6)) return g7A
      }
      return null
    },
    rNB = (A) => {
      let [Q, B] = A.split(/[\r\n]+/);
      if (Q && Q.includes(Fp)) return Fp;
      if (B && B.includes(g7A)) return g7A;
      return null
    },
    oNB = (A) => {
      if (A.includes("musl")) return g7A;
      if (A.includes("GNU C Library")) return Fp;
      return null
    },
    GC6 = async () => {
      if (f_ !== void 0) return f_;
      f_ = null;
      try {
        let A = await pNB(ysA);
        f_ = oNB(A)
      } catch (A) {}
      return f_
    }, ZC6 = () => {
      if (f_ !== void 0) return f_;
      f_ = null;
      try {
        let A = lNB(ysA);
        f_ = oNB(A)
      } catch (A) {}
      return f_
    }, tNB = async () => {
      let A = null;
      if (u7A()) {
        if (A = await GC6(), !A) A = sNB();
        if (!A) {
          let Q = await iNB();
          A = rNB(Q)
        }
      }
      return A
    }, eNB = () => {
      let A = null;
      if (u7A()) {
        if (A = ZC6(), !A) A = sNB();
        if (!A) {
          let Q = nNB();
          A = rNB(Q)
        }
      }
      return A
    }, IC6 = async () => u7A() && await tNB() !== Fp, YC6 = () => u7A() && eNB() !== Fp, JC6 = async () => {
      if (h_ !== void 0) return h_;
      h_ = null;
      try {
        let Q = (await pNB(ysA)).match(aNB);
        if (Q) h_ = Q[1]
      } catch (A) {}
      return h_
    }, WC6 = () => {
      if (h_ !== void 0) return h_;
      h_ = null;
      try {
        let Q = lNB(ysA).match(aNB);
        if (Q) h_ = Q[1]
      } catch (A) {}
      return h_
    }, ALB = () => {
      let A = cNB();
      if (A.header && A.header.glibcVersionRuntime) return A.header.glibcVersionRuntime;
      return null
    }, mNB = (A) => A.trim().split(/\s+/)[1], QLB = (A) => {
      let [Q, B, G] = A.split(/[\r\n]+/);
      if (Q && Q.includes(Fp)) return mNB(Q);
      if (B && G && B.includes(g7A)) return mNB(G);
      return null
    }, XC6 = async () => {
      let A = null;
      if (u7A()) {
        if (A = await JC6(), !A) A = ALB();
        if (!A) {
          let Q = await iNB();
          A = QLB(Q)
        }
      }
      return A
    }, VC6 = () => {
      let A = null;
      if (u7A()) {
        if (A = WC6(), !A) A = ALB();
        if (!A) {
          let Q = nNB();
          A = QLB(Q)
        }
      }
      return A
    };
  BLB.exports = {
    GLIBC: Fp,
    MUSL: g7A,
    family: tNB,
    familySync: eNB,
    isNonGlibcLinux: IC6,
    isNonGlibcLinuxSync: YC6,
    version: XC6,
    versionSync: VC6
  }
})
// @from(Start 6479271, End 6486546)
pu1 = z((ps7, FC6) => {
  FC6.exports = {
    name: "sharp",
    description: "High performance Node.js image processing, the fastest module to resize JPEG, PNG, WebP, GIF, AVIF and TIFF images",
    version: "0.33.5",
    author: "Lovell Fuller <npm@lovell.info>",
    homepage: "https://sharp.pixelplumbing.com",
    contributors: ["Pierre Inglebert <pierre.inglebert@gmail.com>", "Jonathan Ong <jonathanrichardong@gmail.com>", "Chanon Sajjamanochai <chanon.s@gmail.com>", "Juliano Julio <julianojulio@gmail.com>", "Daniel Gasienica <daniel@gasienica.ch>", "Julian Walker <julian@fiftythree.com>", "Amit Pitaru <pitaru.amit@gmail.com>", "Brandon Aaron <hello.brandon@aaron.sh>", "Andreas Lind <andreas@one.com>", "Maurus Cuelenaere <mcuelenaere@gmail.com>", "Linus Unnebäck <linus@folkdatorn.se>", "Victor Mateevitsi <mvictoras@gmail.com>", "Alaric Holloway <alaric.holloway@gmail.com>", "Bernhard K. Weisshuhn <bkw@codingforce.com>", "Chris Riley <criley@primedia.com>", "David Carley <dacarley@gmail.com>", "John Tobin <john@limelightmobileinc.com>", "Kenton Gray <kentongray@gmail.com>", "Felix Bünemann <Felix.Buenemann@gmail.com>", "Samy Al Zahrani <samyalzahrany@gmail.com>", "Chintan Thakkar <lemnisk8@gmail.com>", "F. Orlando Galashan <frulo@gmx.de>", "Kleis Auke Wolthuizen <info@kleisauke.nl>", "Matt Hirsch <mhirsch@media.mit.edu>", "Matthias Thoemmes <thoemmes@gmail.com>", "Patrick Paskaris <patrick@paskaris.gr>", "Jérémy Lal <kapouer@melix.org>", "Rahul Nanwani <r.nanwani@gmail.com>", "Alice Monday <alice0meta@gmail.com>", "Kristo Jorgenson <kristo.jorgenson@gmail.com>", "YvesBos <yves_bos@outlook.com>", "Guy Maliar <guy@tailorbrands.com>", "Nicolas Coden <nicolas@ncoden.fr>", "Matt Parrish <matt.r.parrish@gmail.com>", "Marcel Bretschneider <marcel.bretschneider@gmail.com>", "Matthew McEachen <matthew+github@mceachen.org>", "Jarda Kotěšovec <jarda.kotesovec@gmail.com>", "Kenric D'Souza <kenric.dsouza@gmail.com>", "Oleh Aleinyk <oleg.aleynik@gmail.com>", "Marcel Bretschneider <marcel.bretschneider@gmail.com>", "Andrea Bianco <andrea.bianco@unibas.ch>", "Rik Heywood <rik@rik.org>", "Thomas Parisot <hi@oncletom.io>", "Nathan Graves <nathanrgraves+github@gmail.com>", "Tom Lokhorst <tom@lokhorst.eu>", "Espen Hovlandsdal <espen@hovlandsdal.com>", "Sylvain Dumont <sylvain.dumont35@gmail.com>", "Alun Davies <alun.owain.davies@googlemail.com>", "Aidan Hoolachan <ajhoolachan21@gmail.com>", "Axel Eirola <axel.eirola@iki.fi>", "Freezy <freezy@xbmc.org>", "Daiz <taneli.vatanen@gmail.com>", "Julian Aubourg <j@ubourg.net>", "Keith Belovay <keith@picthrive.com>", "Michael B. Klein <mbklein@gmail.com>", "Jordan Prudhomme <jordan@raboland.fr>", "Ilya Ovdin <iovdin@gmail.com>", "Andargor <andargor@yahoo.com>", "Paul Neave <paul.neave@gmail.com>", "Brendan Kennedy <brenwken@gmail.com>", "Brychan Bennett-Odlum <git@brychan.io>", "Edward Silverton <e.silverton@gmail.com>", "Roman Malieiev <aromaleev@gmail.com>", "Tomas Szabo <tomas.szabo@deftomat.com>", "Robert O'Rourke <robert@o-rourke.org>", "Guillermo Alfonso Varela Chouciño <guillevch@gmail.com>", "Christian Flintrup <chr@gigahost.dk>", "Manan Jadhav <manan@motionden.com>", "Leon Radley <leon@radley.se>", "alza54 <alza54@thiocod.in>", "Jacob Smith <jacob@frende.me>", "Michael Nutt <michael@nutt.im>", "Brad Parham <baparham@gmail.com>", "Taneli Vatanen <taneli.vatanen@gmail.com>", "Joris Dugué <zaruike10@gmail.com>", "Chris Banks <christopher.bradley.banks@gmail.com>", "Ompal Singh <ompal.hitm09@gmail.com>", "Brodan <christopher.hranj@gmail.com>", "Ankur Parihar <ankur.github@gmail.com>", "Brahim Ait elhaj <brahima@gmail.com>", "Mart Jansink <m.jansink@gmail.com>", "Lachlan Newman <lachnewman007@gmail.com>", "Dennis Beatty <dennis@dcbeatty.com>", "Ingvar Stepanyan <me@rreverser.com>", "Don Denton <don@happycollision.com>"],
    scripts: {
      install: "node install/check",
      clean: "rm -rf src/build/ .nyc_output/ coverage/ test/fixtures/output.*",
      test: "npm run test-lint && npm run test-unit && npm run test-licensing && npm run test-types",
      "test-lint": "semistandard && cpplint",
      "test-unit": "nyc --reporter=lcov --reporter=text --check-coverage --branches=100 mocha",
      "test-licensing": 'license-checker --production --summary --onlyAllow="Apache-2.0;BSD;ISC;LGPL-3.0-or-later;MIT"',
      "test-leak": "./test/leak/leak.sh",
      "test-types": "tsd",
      "package-from-local-build": "node npm/from-local-build",
      "package-from-github-release": "node npm/from-github-release",
      "docs-build": "node docs/build && node docs/search-index/build",
      "docs-serve": "cd docs && npx serve",
      "docs-publish": "cd docs && npx firebase-tools deploy --project pixelplumbing --only hosting:pixelplumbing-sharp"
    },
    type: "commonjs",
    main: "lib/index.js",
    types: "lib/index.d.ts",
    files: ["install", "lib", "src/*.{cc,h,gyp}"],
    repository: {
      type: "git",
      url: "git://github.com/lovell/sharp.git"
    },
    keywords: ["jpeg", "png", "webp", "avif", "tiff", "gif", "svg", "jp2", "dzi", "image", "resize", "thumbnail", "crop", "embed", "libvips", "vips"],
    dependencies: {
      color: "^4.2.3",
      "detect-libc": "^2.0.3",
      semver: "^7.6.3"
    },
    optionalDependencies: {
      "@img/sharp-darwin-arm64": "0.33.5",
      "@img/sharp-darwin-x64": "0.33.5",
      "@img/sharp-libvips-darwin-arm64": "1.0.4",
      "@img/sharp-libvips-darwin-x64": "1.0.4",
      "@img/sharp-libvips-linux-arm": "1.0.5",
      "@img/sharp-libvips-linux-arm64": "1.0.4",
      "@img/sharp-libvips-linux-s390x": "1.0.4",
      "@img/sharp-libvips-linux-x64": "1.0.4",
      "@img/sharp-libvips-linuxmusl-arm64": "1.0.4",
      "@img/sharp-libvips-linuxmusl-x64": "1.0.4",
      "@img/sharp-linux-arm": "0.33.5",
      "@img/sharp-linux-arm64": "0.33.5",
      "@img/sharp-linux-s390x": "0.33.5",
      "@img/sharp-linux-x64": "0.33.5",
      "@img/sharp-linuxmusl-arm64": "0.33.5",
      "@img/sharp-linuxmusl-x64": "0.33.5",
      "@img/sharp-wasm32": "0.33.5",
      "@img/sharp-win32-ia32": "0.33.5",
      "@img/sharp-win32-x64": "0.33.5"
    },
    devDependencies: {
      "@emnapi/runtime": "^1.2.0",
      "@img/sharp-libvips-dev": "1.0.4",
      "@img/sharp-libvips-dev-wasm32": "1.0.5",
      "@img/sharp-libvips-win32-ia32": "1.0.4",
      "@img/sharp-libvips-win32-x64": "1.0.4",
      "@types/node": "*",
      async: "^3.2.5",
      cc: "^3.0.1",
      emnapi: "^1.2.0",
      "exif-reader": "^2.0.1",
      "extract-zip": "^2.0.1",
      icc: "^3.0.0",
      "jsdoc-to-markdown": "^8.0.3",
      "license-checker": "^25.0.1",
      mocha: "^10.7.3",
      "node-addon-api": "^8.1.0",
      nyc: "^17.0.0",
      prebuild: "^13.0.1",
      semistandard: "^17.0.0",
      "tar-fs": "^3.0.6",
      tsd: "^0.31.1"
    },
    license: "Apache-2.0",
    engines: {
      node: "^18.17.0 || ^20.3.0 || >=21.0.0"
    },
    config: {
      libvips: ">=8.15.3"
    },
    funding: {
      url: "https://opencollective.com/libvips"
    },
    binary: {
      napi_versions: [9]
    },
    semistandard: {
      env: ["mocha"]
    },
    cc: {
      linelength: "120",
      filter: ["build/include"]
    },
    nyc: {
      include: ["lib"]
    },
    tsd: {
      directory: "test/types/"
    }
  }
})
// @from(Start 6486552, End 6490727)
iu1 = z((ls7, KLB) => {
  var {
    spawnSync: vsA
  } = UA("node:child_process"), {
    createHash: KC6
  } = UA("node:crypto"), YLB = Hu1(), DC6 = I$A(), HC6 = v7A(), GLB = xsA(), {
    config: CC6,
    engines: ZLB,
    optionalDependencies: EC6
  } = pu1(), zC6 = process.env.npm_package_config_libvips || CC6.libvips, JLB = YLB(zC6).version, UC6 = ["darwin-arm64", "darwin-x64", "linux-arm", "linux-arm64", "linux-s390x", "linux-x64", "linuxmusl-arm64", "linuxmusl-x64", "win32-ia32", "win32-x64"], bsA = {
    encoding: "utf8",
    shell: !0
  }, $C6 = (A) => {
    if (A instanceof Error) console.error(`sharp: Installation error: ${A.message}`);
    else console.log(`sharp: ${A}`)
  }, WLB = () => GLB.isNonGlibcLinuxSync() ? GLB.familySync() : "", wC6 = () => `${process.platform}${WLB()}-${process.arch}`, m7A = () => {
    if (XLB()) return "wasm32";
    let {
      npm_config_arch: A,
      npm_config_platform: Q,
      npm_config_libc: B
    } = process.env, G = typeof B === "string" ? B : WLB();
    return `${Q||process.platform}${G}-${A||process.arch}`
  }, qC6 = () => {
    try {
      return UA(`@img/sharp-libvips-dev-${m7A()}/include`)
    } catch {
      try {
        return (() => {
          throw new Error("Cannot require module " + "@img/sharp-libvips-dev/include");
        })()
      } catch {}
    }
    return ""
  }, NC6 = () => {
    try {
      return (() => {
        throw new Error("Cannot require module " + "@img/sharp-libvips-dev/cplusplus");
      })()
    } catch {}
    return ""
  }, LC6 = () => {
    try {
      return UA(`@img/sharp-libvips-dev-${m7A()}/lib`)
    } catch {
      try {
        return UA(`@img/sharp-libvips-${m7A()}/lib`)
      } catch {}
    }
    return ""
  }, MC6 = () => {
    if (process.release?.name === "node" && process.versions) {
      if (!HC6(process.versions.node, ZLB.node)) return {
        found: process.versions.node,
        expected: ZLB.node
      }
    }
  }, XLB = () => {
    let {
      CC: A
    } = process.env;
    return Boolean(A && A.endsWith("/emcc"))
  }, OC6 = () => {
    if (process.platform === "darwin" && process.arch === "x64") return (vsA("sysctl sysctl.proc_translated", bsA).stdout || "").trim() === "sysctl.proc_translated: 1";
    return !1
  }, ILB = (A) => KC6("sha512").update(A).digest("hex"), RC6 = () => {
    try {
      let A = ILB(`imgsharp-libvips-${m7A()}`),
        Q = YLB(EC6[`@img/sharp-libvips-${m7A()}`]).version;
      return ILB(`${A}npm:${Q}`).slice(0, 10)
    } catch {}
    return ""
  }, TC6 = () => vsA(`node-gyp rebuild --directory=src ${XLB()?"--nodedir=emscripten":""}`, {
    ...bsA,
    stdio: "inherit"
  }).status, VLB = () => {
    if (process.platform !== "win32") return (vsA("pkg-config --modversion vips-cpp", {
      ...bsA,
      env: {
        ...process.env,
        PKG_CONFIG_PATH: FLB()
      }
    }).stdout || "").trim();
    else return ""
  }, FLB = () => {
    if (process.platform !== "win32") return [(vsA('which brew >/dev/null 2>&1 && brew environment --plain | grep PKG_CONFIG_LIBDIR | cut -d" " -f2', bsA).stdout || "").trim(), process.env.PKG_CONFIG_PATH, "/usr/local/lib/pkgconfig", "/usr/lib/pkgconfig", "/usr/local/libdata/pkgconfig", "/usr/libdata/pkgconfig"].filter(Boolean).join(":");
    else return ""
  }, lu1 = (A, Q, B) => {
    if (B) B(`Detected ${Q}, skipping search for globally-installed libvips`);
    return A
  }, PC6 = (A) => {
    if (Boolean(process.env.SHARP_IGNORE_GLOBAL_LIBVIPS) === !0) return lu1(!1, "SHARP_IGNORE_GLOBAL_LIBVIPS", A);
    if (Boolean(process.env.SHARP_FORCE_GLOBAL_LIBVIPS) === !0) return lu1(!0, "SHARP_FORCE_GLOBAL_LIBVIPS", A);
    if (OC6()) return lu1(!1, "Rosetta", A);
    let Q = VLB();
    return !!Q && DC6(Q, JLB)
  };
  KLB.exports = {
    minimumLibvipsVersion: JLB,
    prebuiltPlatforms: UC6,
    buildPlatformArch: m7A,
    buildSharpLibvipsIncludeDir: qC6,
    buildSharpLibvipsCPlusPlusDir: NC6,
    buildSharpLibvipsLibDir: LC6,
    isUnsupportedNodeRuntime: MC6,
    runtimePlatformArch: wC6,
    log: $C6,
    yarnLocator: RC6,
    spawnRebuild: TC6,
    globalLibvipsVersion: VLB,
    pkgConfigPath: FLB,
    useGlobalLibvips: PC6
  }
})
// @from(Start 6490733, End 6493532)
H$A = z((ns7, HLB) => {
  var {
    familySync: jC6,
    versionSync: SC6
  } = xsA(), {
    runtimePlatformArch: _C6,
    isUnsupportedNodeRuntime: DLB,
    prebuiltPlatforms: kC6,
    minimumLibvipsVersion: yC6
  } = iu1(), at = _C6(), xC6 = [`../src/build/Release/sharp-${at}.node`, "../src/build/Release/sharp-wasm32.node", `@img/sharp-${at}/sharp.node`, "@img/sharp-wasm32/sharp.node"], nu1, fsA = [];
  for (let A of xC6) try {
    nu1 = UA(A);
    break
  } catch (Q) {
    fsA.push(Q)
  }
  if (nu1) HLB.exports = nu1;
  else {
    let [A, Q, B] = ["linux", "darwin", "win32"].map((I) => at.startsWith(I)), G = [`Could not load the "sharp" module using the ${at} runtime`];
    fsA.forEach((I) => {
      if (I.code !== "MODULE_NOT_FOUND") G.push(`${I.code}: ${I.message}`)
    });
    let Z = fsA.map((I) => I.message).join(" ");
    if (G.push("Possible solutions:"), DLB()) {
      let {
        found: I,
        expected: Y
      } = DLB();
      G.push("- Please upgrade Node.js:", `    Found ${I}`, `    Requires ${Y}`)
    } else if (kC6.includes(at)) {
      let [I, Y] = at.split("-"), J = I.endsWith("musl") ? " --libc=musl" : "";
      G.push("- Ensure optional dependencies can be installed:", "    npm install --include=optional sharp", "- Ensure your package manager supports multi-platform installation:", "    See https://sharp.pixelplumbing.com/install#cross-platform", "- Add platform-specific dependencies:", `    npm install --os=${I.replace("musl","")}${J} --cpu=${Y} sharp`)
    } else G.push(`- Manually install libvips >= ${yC6}`, "- Add experimental WebAssembly-based dependencies:", "    npm install --cpu=wasm32 sharp", "    npm install @img/sharp-wasm32");
    if (A && /(symbol not found|CXXABI_)/i.test(Z)) try {
      let {
        config: I
      } = UA(`@img/sharp-libvips-${at}/package`), Y = `${jC6()} ${SC6()}`, J = `${I.musl?"musl":"glibc"} ${I.musl||I.glibc}`;
      G.push("- Update your OS:", `    Found ${Y}`, `    Requires ${J}`)
    } catch (I) {}
    if (A && /\/snap\/core[0-9]{2}/.test(Z)) G.push("- Remove the Node.js Snap, which does not support native modules", "    snap remove node");
    if (Q && /Incompatible library version/.test(Z)) G.push("- Update Homebrew:", "    brew update && brew upgrade vips");
    if (fsA.some((I) => I.code === "ERR_DLOPEN_DISABLED")) G.push("- Run Node.js without using the --no-addons flag");
    if (B && /The specified procedure could not be found/.test(Z)) G.push("- Using the canvas package on Windows?", "    See https://sharp.pixelplumbing.com/install#canvas-and-windows", "- Check for outdated versions of sharp in the dependency tree:", "    npm ls sharp");
    throw G.push("- Consult the installation documentation:", "    See https://sharp.pixelplumbing.com/install"), Error(G.join(`
`))
  }
})
// @from(Start 6493538, End 6499239)
ELB = z((ss7, CLB) => {
  var vC6 = UA("node:util"),
    au1 = UA("node:stream"),
    bC6 = b_();
  H$A();
  var fC6 = vC6.debuglog("sharp"),
    st = function(A, Q) {
      if (arguments.length === 1 && !bC6.defined(A)) throw Error("Invalid input");
      if (!(this instanceof st)) return new st(A, Q);
      return au1.Duplex.call(this), this.options = {
        topOffsetPre: -1,
        leftOffsetPre: -1,
        widthPre: -1,
        heightPre: -1,
        topOffsetPost: -1,
        leftOffsetPost: -1,
        widthPost: -1,
        heightPost: -1,
        width: -1,
        height: -1,
        canvas: "crop",
        position: 0,
        resizeBackground: [0, 0, 0, 255],
        useExifOrientation: !1,
        angle: 0,
        rotationAngle: 0,
        rotationBackground: [0, 0, 0, 255],
        rotateBeforePreExtract: !1,
        flip: !1,
        flop: !1,
        extendTop: 0,
        extendBottom: 0,
        extendLeft: 0,
        extendRight: 0,
        extendBackground: [0, 0, 0, 255],
        extendWith: "background",
        withoutEnlargement: !1,
        withoutReduction: !1,
        affineMatrix: [],
        affineBackground: [0, 0, 0, 255],
        affineIdx: 0,
        affineIdy: 0,
        affineOdx: 0,
        affineOdy: 0,
        affineInterpolator: this.constructor.interpolators.bilinear,
        kernel: "lanczos3",
        fastShrinkOnLoad: !0,
        tint: [-1, 0, 0, 0],
        flatten: !1,
        flattenBackground: [0, 0, 0],
        unflatten: !1,
        negate: !1,
        negateAlpha: !0,
        medianSize: 0,
        blurSigma: 0,
        precision: "integer",
        minAmpl: 0.2,
        sharpenSigma: 0,
        sharpenM1: 1,
        sharpenM2: 2,
        sharpenX1: 2,
        sharpenY2: 10,
        sharpenY3: 20,
        threshold: 0,
        thresholdGrayscale: !0,
        trimBackground: [],
        trimThreshold: -1,
        trimLineArt: !1,
        gamma: 0,
        gammaOut: 0,
        greyscale: !1,
        normalise: !1,
        normaliseLower: 1,
        normaliseUpper: 99,
        claheWidth: 0,
        claheHeight: 0,
        claheMaxSlope: 3,
        brightness: 1,
        saturation: 1,
        hue: 0,
        lightness: 0,
        booleanBufferIn: null,
        booleanFileIn: "",
        joinChannelIn: [],
        extractChannel: -1,
        removeAlpha: !1,
        ensureAlpha: -1,
        colourspace: "srgb",
        colourspacePipeline: "last",
        composite: [],
        fileOut: "",
        formatOut: "input",
        streamOut: !1,
        keepMetadata: 0,
        withMetadataOrientation: -1,
        withMetadataDensity: 0,
        withIccProfile: "",
        withExif: {},
        withExifMerge: !0,
        resolveWithObject: !1,
        jpegQuality: 80,
        jpegProgressive: !1,
        jpegChromaSubsampling: "4:2:0",
        jpegTrellisQuantisation: !1,
        jpegOvershootDeringing: !1,
        jpegOptimiseScans: !1,
        jpegOptimiseCoding: !0,
        jpegQuantisationTable: 0,
        pngProgressive: !1,
        pngCompressionLevel: 6,
        pngAdaptiveFiltering: !1,
        pngPalette: !1,
        pngQuality: 100,
        pngEffort: 7,
        pngBitdepth: 8,
        pngDither: 1,
        jp2Quality: 80,
        jp2TileHeight: 512,
        jp2TileWidth: 512,
        jp2Lossless: !1,
        jp2ChromaSubsampling: "4:4:4",
        webpQuality: 80,
        webpAlphaQuality: 100,
        webpLossless: !1,
        webpNearLossless: !1,
        webpSmartSubsample: !1,
        webpPreset: "default",
        webpEffort: 4,
        webpMinSize: !1,
        webpMixed: !1,
        gifBitdepth: 8,
        gifEffort: 7,
        gifDither: 1,
        gifInterFrameMaxError: 0,
        gifInterPaletteMaxError: 3,
        gifReuse: !0,
        gifProgressive: !1,
        tiffQuality: 80,
        tiffCompression: "jpeg",
        tiffPredictor: "horizontal",
        tiffPyramid: !1,
        tiffMiniswhite: !1,
        tiffBitdepth: 8,
        tiffTile: !1,
        tiffTileHeight: 256,
        tiffTileWidth: 256,
        tiffXres: 1,
        tiffYres: 1,
        tiffResolutionUnit: "inch",
        heifQuality: 50,
        heifLossless: !1,
        heifCompression: "av1",
        heifEffort: 4,
        heifChromaSubsampling: "4:4:4",
        heifBitdepth: 8,
        jxlDistance: 1,
        jxlDecodingTier: 0,
        jxlEffort: 7,
        jxlLossless: !1,
        rawDepth: "uchar",
        tileSize: 256,
        tileOverlap: 0,
        tileContainer: "fs",
        tileLayout: "dz",
        tileFormat: "last",
        tileDepth: "last",
        tileAngle: 0,
        tileSkipBlanks: -1,
        tileBackground: [255, 255, 255, 255],
        tileCentre: !1,
        tileId: "https://example.com/iiif",
        tileBasename: "",
        timeoutSeconds: 0,
        linearA: [],
        linearB: [],
        debuglog: (B) => {
          this.emit("warning", B), fC6(B)
        },
        queueListener: function(B) {
          st.queue.emit("change", B)
        }
      }, this.options.input = this._createInputDescriptor(A, Q, {
        allowStream: !0
      }), this
    };
  Object.setPrototypeOf(st.prototype, au1.Duplex.prototype);
  Object.setPrototypeOf(st, au1.Duplex);

  function hC6() {
    let A = this.constructor.call(),
      {
        debuglog: Q,
        queueListener: B,
        ...G
      } = this.options;
    if (A.options = structuredClone(G), A.options.debuglog = Q, A.options.queueListener = B, this._isStreamInput()) this.on("finish", () => {
      this._flattenBufferIn(), A.options.input.buffer = this.options.input.buffer, A.emit("finish")
    });
    return A
  }
  Object.assign(st.prototype, {
    clone: hC6
  });
  CLB.exports = st
})
// @from(Start 6499245, End 6503870)
su1 = z((rs7, zLB) => {
  zLB.exports = {
    aliceblue: [240, 248, 255],
    antiquewhite: [250, 235, 215],
    aqua: [0, 255, 255],
    aquamarine: [127, 255, 212],
    azure: [240, 255, 255],
    beige: [245, 245, 220],
    bisque: [255, 228, 196],
    black: [0, 0, 0],
    blanchedalmond: [255, 235, 205],
    blue: [0, 0, 255],
    blueviolet: [138, 43, 226],
    brown: [165, 42, 42],
    burlywood: [222, 184, 135],
    cadetblue: [95, 158, 160],
    chartreuse: [127, 255, 0],
    chocolate: [210, 105, 30],
    coral: [255, 127, 80],
    cornflowerblue: [100, 149, 237],
    cornsilk: [255, 248, 220],
    crimson: [220, 20, 60],
    cyan: [0, 255, 255],
    darkblue: [0, 0, 139],
    darkcyan: [0, 139, 139],
    darkgoldenrod: [184, 134, 11],
    darkgray: [169, 169, 169],
    darkgreen: [0, 100, 0],
    darkgrey: [169, 169, 169],
    darkkhaki: [189, 183, 107],
    darkmagenta: [139, 0, 139],
    darkolivegreen: [85, 107, 47],
    darkorange: [255, 140, 0],
    darkorchid: [153, 50, 204],
    darkred: [139, 0, 0],
    darksalmon: [233, 150, 122],
    darkseagreen: [143, 188, 143],
    darkslateblue: [72, 61, 139],
    darkslategray: [47, 79, 79],
    darkslategrey: [47, 79, 79],
    darkturquoise: [0, 206, 209],
    darkviolet: [148, 0, 211],
    deeppink: [255, 20, 147],
    deepskyblue: [0, 191, 255],
    dimgray: [105, 105, 105],
    dimgrey: [105, 105, 105],
    dodgerblue: [30, 144, 255],
    firebrick: [178, 34, 34],
    floralwhite: [255, 250, 240],
    forestgreen: [34, 139, 34],
    fuchsia: [255, 0, 255],
    gainsboro: [220, 220, 220],
    ghostwhite: [248, 248, 255],
    gold: [255, 215, 0],
    goldenrod: [218, 165, 32],
    gray: [128, 128, 128],
    green: [0, 128, 0],
    greenyellow: [173, 255, 47],
    grey: [128, 128, 128],
    honeydew: [240, 255, 240],
    hotpink: [255, 105, 180],
    indianred: [205, 92, 92],
    indigo: [75, 0, 130],
    ivory: [255, 255, 240],
    khaki: [240, 230, 140],
    lavender: [230, 230, 250],
    lavenderblush: [255, 240, 245],
    lawngreen: [124, 252, 0],
    lemonchiffon: [255, 250, 205],
    lightblue: [173, 216, 230],
    lightcoral: [240, 128, 128],
    lightcyan: [224, 255, 255],
    lightgoldenrodyellow: [250, 250, 210],
    lightgray: [211, 211, 211],
    lightgreen: [144, 238, 144],
    lightgrey: [211, 211, 211],
    lightpink: [255, 182, 193],
    lightsalmon: [255, 160, 122],
    lightseagreen: [32, 178, 170],
    lightskyblue: [135, 206, 250],
    lightslategray: [119, 136, 153],
    lightslategrey: [119, 136, 153],
    lightsteelblue: [176, 196, 222],
    lightyellow: [255, 255, 224],
    lime: [0, 255, 0],
    limegreen: [50, 205, 50],
    linen: [250, 240, 230],
    magenta: [255, 0, 255],
    maroon: [128, 0, 0],
    mediumaquamarine: [102, 205, 170],
    mediumblue: [0, 0, 205],
    mediumorchid: [186, 85, 211],
    mediumpurple: [147, 112, 219],
    mediumseagreen: [60, 179, 113],
    mediumslateblue: [123, 104, 238],
    mediumspringgreen: [0, 250, 154],
    mediumturquoise: [72, 209, 204],
    mediumvioletred: [199, 21, 133],
    midnightblue: [25, 25, 112],
    mintcream: [245, 255, 250],
    mistyrose: [255, 228, 225],
    moccasin: [255, 228, 181],
    navajowhite: [255, 222, 173],
    navy: [0, 0, 128],
    oldlace: [253, 245, 230],
    olive: [128, 128, 0],
    olivedrab: [107, 142, 35],
    orange: [255, 165, 0],
    orangered: [255, 69, 0],
    orchid: [218, 112, 214],
    palegoldenrod: [238, 232, 170],
    palegreen: [152, 251, 152],
    paleturquoise: [175, 238, 238],
    palevioletred: [219, 112, 147],
    papayawhip: [255, 239, 213],
    peachpuff: [255, 218, 185],
    peru: [205, 133, 63],
    pink: [255, 192, 203],
    plum: [221, 160, 221],
    powderblue: [176, 224, 230],
    purple: [128, 0, 128],
    rebeccapurple: [102, 51, 153],
    red: [255, 0, 0],
    rosybrown: [188, 143, 143],
    royalblue: [65, 105, 225],
    saddlebrown: [139, 69, 19],
    salmon: [250, 128, 114],
    sandybrown: [244, 164, 96],
    seagreen: [46, 139, 87],
    seashell: [255, 245, 238],
    sienna: [160, 82, 45],
    silver: [192, 192, 192],
    skyblue: [135, 206, 235],
    slateblue: [106, 90, 205],
    slategray: [112, 128, 144],
    slategrey: [112, 128, 144],
    snow: [255, 250, 250],
    springgreen: [0, 255, 127],
    steelblue: [70, 130, 180],
    tan: [210, 180, 140],
    teal: [0, 128, 128],
    thistle: [216, 191, 216],
    tomato: [255, 99, 71],
    turquoise: [64, 224, 208],
    violet: [238, 130, 238],
    wheat: [245, 222, 179],
    white: [255, 255, 255],
    whitesmoke: [245, 245, 245],
    yellow: [255, 255, 0],
    yellowgreen: [154, 205, 50]
  }
})
// @from(Start 6503876, End 6504172)
$LB = z((os7, ULB) => {
  ULB.exports = function(Q) {
    if (!Q || typeof Q === "string") return !1;
    return Q instanceof Array || Array.isArray(Q) || Q.length >= 0 && (Q.splice instanceof Function || Object.getOwnPropertyDescriptor(Q, Q.length - 1) && Q.constructor.name !== "String")
  }
})
// @from(Start 6504178, End 6504613)
NLB = z((ts7, qLB) => {
  var gC6 = $LB(),
    uC6 = Array.prototype.concat,
    mC6 = Array.prototype.slice,
    wLB = qLB.exports = function(Q) {
      var B = [];
      for (var G = 0, Z = Q.length; G < Z; G++) {
        var I = Q[G];
        if (gC6(I)) B = uC6.call(B, mC6.call(I));
        else B.push(I)
      }
      return B
    };
  wLB.wrap = function(A) {
    return function() {
      return A(wLB(arguments))
    }
  }
})
// @from(Start 6504619, End 6509308)
RLB = z((es7, OLB) => {
  var E$A = su1(),
    z$A = NLB(),
    LLB = Object.hasOwnProperty,
    MLB = Object.create(null);
  for (C$A in E$A)
    if (LLB.call(E$A, C$A)) MLB[E$A[C$A]] = C$A;
  var C$A, ew = OLB.exports = {
    to: {},
    get: {}
  };
  ew.get = function(A) {
    var Q = A.substring(0, 3).toLowerCase(),
      B, G;
    switch (Q) {
      case "hsl":
        B = ew.get.hsl(A), G = "hsl";
        break;
      case "hwb":
        B = ew.get.hwb(A), G = "hwb";
        break;
      default:
        B = ew.get.rgb(A), G = "rgb";
        break
    }
    if (!B) return null;
    return {
      model: G,
      value: B
    }
  };
  ew.get.rgb = function(A) {
    if (!A) return null;
    var Q = /^#([a-f0-9]{3,4})$/i,
      B = /^#([a-f0-9]{6})([a-f0-9]{2})?$/i,
      G = /^rgba?\(\s*([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)\s*(?:[,|\/]\s*([+-]?[\d\.]+)(%?)\s*)?\)$/,
      Z = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,?\s*([+-]?[\d\.]+)\%\s*,?\s*([+-]?[\d\.]+)\%\s*(?:[,|\/]\s*([+-]?[\d\.]+)(%?)\s*)?\)$/,
      I = /^(\w+)$/,
      Y = [0, 0, 0, 1],
      J, W, X;
    if (J = A.match(B)) {
      X = J[2], J = J[1];
      for (W = 0; W < 3; W++) {
        var V = W * 2;
        Y[W] = parseInt(J.slice(V, V + 2), 16)
      }
      if (X) Y[3] = parseInt(X, 16) / 255
    } else if (J = A.match(Q)) {
      J = J[1], X = J[3];
      for (W = 0; W < 3; W++) Y[W] = parseInt(J[W] + J[W], 16);
      if (X) Y[3] = parseInt(X + X, 16) / 255
    } else if (J = A.match(G)) {
      for (W = 0; W < 3; W++) Y[W] = parseInt(J[W + 1], 0);
      if (J[4])
        if (J[5]) Y[3] = parseFloat(J[4]) * 0.01;
        else Y[3] = parseFloat(J[4])
    } else if (J = A.match(Z)) {
      for (W = 0; W < 3; W++) Y[W] = Math.round(parseFloat(J[W + 1]) * 2.55);
      if (J[4])
        if (J[5]) Y[3] = parseFloat(J[4]) * 0.01;
        else Y[3] = parseFloat(J[4])
    } else if (J = A.match(I)) {
      if (J[1] === "transparent") return [0, 0, 0, 0];
      if (!LLB.call(E$A, J[1])) return null;
      return Y = E$A[J[1]], Y[3] = 1, Y
    } else return null;
    for (W = 0; W < 3; W++) Y[W] = Kp(Y[W], 0, 255);
    return Y[3] = Kp(Y[3], 0, 1), Y
  };
  ew.get.hsl = function(A) {
    if (!A) return null;
    var Q = /^hsla?\(\s*([+-]?(?:\d{0,3}\.)?\d+)(?:deg)?\s*,?\s*([+-]?[\d\.]+)%\s*,?\s*([+-]?[\d\.]+)%\s*(?:[,|\/]\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/,
      B = A.match(Q);
    if (B) {
      var G = parseFloat(B[4]),
        Z = (parseFloat(B[1]) % 360 + 360) % 360,
        I = Kp(parseFloat(B[2]), 0, 100),
        Y = Kp(parseFloat(B[3]), 0, 100),
        J = Kp(isNaN(G) ? 1 : G, 0, 1);
      return [Z, I, Y, J]
    }
    return null
  };
  ew.get.hwb = function(A) {
    if (!A) return null;
    var Q = /^hwb\(\s*([+-]?\d{0,3}(?:\.\d+)?)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/,
      B = A.match(Q);
    if (B) {
      var G = parseFloat(B[4]),
        Z = (parseFloat(B[1]) % 360 + 360) % 360,
        I = Kp(parseFloat(B[2]), 0, 100),
        Y = Kp(parseFloat(B[3]), 0, 100),
        J = Kp(isNaN(G) ? 1 : G, 0, 1);
      return [Z, I, Y, J]
    }
    return null
  };
  ew.to.hex = function() {
    var A = z$A(arguments);
    return "#" + hsA(A[0]) + hsA(A[1]) + hsA(A[2]) + (A[3] < 1 ? hsA(Math.round(A[3] * 255)) : "")
  };
  ew.to.rgb = function() {
    var A = z$A(arguments);
    return A.length < 4 || A[3] === 1 ? "rgb(" + Math.round(A[0]) + ", " + Math.round(A[1]) + ", " + Math.round(A[2]) + ")" : "rgba(" + Math.round(A[0]) + ", " + Math.round(A[1]) + ", " + Math.round(A[2]) + ", " + A[3] + ")"
  };
  ew.to.rgb.percent = function() {
    var A = z$A(arguments),
      Q = Math.round(A[0] / 255 * 100),
      B = Math.round(A[1] / 255 * 100),
      G = Math.round(A[2] / 255 * 100);
    return A.length < 4 || A[3] === 1 ? "rgb(" + Q + "%, " + B + "%, " + G + "%)" : "rgba(" + Q + "%, " + B + "%, " + G + "%, " + A[3] + ")"
  };
  ew.to.hsl = function() {
    var A = z$A(arguments);
    return A.length < 4 || A[3] === 1 ? "hsl(" + A[0] + ", " + A[1] + "%, " + A[2] + "%)" : "hsla(" + A[0] + ", " + A[1] + "%, " + A[2] + "%, " + A[3] + ")"
  };
  ew.to.hwb = function() {
    var A = z$A(arguments),
      Q = "";
    if (A.length >= 4 && A[3] !== 1) Q = ", " + A[3];
    return "hwb(" + A[0] + ", " + A[1] + "%, " + A[2] + "%" + Q + ")"
  };
  ew.to.keyword = function(A) {
    return MLB[A.slice(0, 3)]
  };

  function Kp(A, Q, B) {
    return Math.min(Math.max(Q, A), B)
  }

  function hsA(A) {
    var Q = Math.round(A).toString(16).toUpperCase();
    return Q.length < 2 ? "0" + Q : Q
  }
})
// @from(Start 6509314, End 6523738)
ru1 = z((Ar7, PLB) => {
  var U$A = su1(),
    TLB = {};
  for (let A of Object.keys(U$A)) TLB[U$A[A]] = A;
  var m2 = {
    rgb: {
      channels: 3,
      labels: "rgb"
    },
    hsl: {
      channels: 3,
      labels: "hsl"
    },
    hsv: {
      channels: 3,
      labels: "hsv"
    },
    hwb: {
      channels: 3,
      labels: "hwb"
    },
    cmyk: {
      channels: 4,
      labels: "cmyk"
    },
    xyz: {
      channels: 3,
      labels: "xyz"
    },
    lab: {
      channels: 3,
      labels: "lab"
    },
    lch: {
      channels: 3,
      labels: "lch"
    },
    hex: {
      channels: 1,
      labels: ["hex"]
    },
    keyword: {
      channels: 1,
      labels: ["keyword"]
    },
    ansi16: {
      channels: 1,
      labels: ["ansi16"]
    },
    ansi256: {
      channels: 1,
      labels: ["ansi256"]
    },
    hcg: {
      channels: 3,
      labels: ["h", "c", "g"]
    },
    apple: {
      channels: 3,
      labels: ["r16", "g16", "b16"]
    },
    gray: {
      channels: 1,
      labels: ["gray"]
    }
  };
  PLB.exports = m2;
  for (let A of Object.keys(m2)) {
    if (!("channels" in m2[A])) throw Error("missing channels property: " + A);
    if (!("labels" in m2[A])) throw Error("missing channel labels property: " + A);
    if (m2[A].labels.length !== m2[A].channels) throw Error("channel and label counts mismatch: " + A);
    let {
      channels: Q,
      labels: B
    } = m2[A];
    delete m2[A].channels, delete m2[A].labels, Object.defineProperty(m2[A], "channels", {
      value: Q
    }), Object.defineProperty(m2[A], "labels", {
      value: B
    })
  }
  m2.rgb.hsl = function(A) {
    let Q = A[0] / 255,
      B = A[1] / 255,
      G = A[2] / 255,
      Z = Math.min(Q, B, G),
      I = Math.max(Q, B, G),
      Y = I - Z,
      J, W;
    if (I === Z) J = 0;
    else if (Q === I) J = (B - G) / Y;
    else if (B === I) J = 2 + (G - Q) / Y;
    else if (G === I) J = 4 + (Q - B) / Y;
    if (J = Math.min(J * 60, 360), J < 0) J += 360;
    let X = (Z + I) / 2;
    if (I === Z) W = 0;
    else if (X <= 0.5) W = Y / (I + Z);
    else W = Y / (2 - I - Z);
    return [J, W * 100, X * 100]
  };
  m2.rgb.hsv = function(A) {
    let Q, B, G, Z, I, Y = A[0] / 255,
      J = A[1] / 255,
      W = A[2] / 255,
      X = Math.max(Y, J, W),
      V = X - Math.min(Y, J, W),
      F = function(K) {
        return (X - K) / 6 / V + 0.5
      };
    if (V === 0) Z = 0, I = 0;
    else {
      if (I = V / X, Q = F(Y), B = F(J), G = F(W), Y === X) Z = G - B;
      else if (J === X) Z = 0.3333333333333333 + Q - G;
      else if (W === X) Z = 0.6666666666666666 + B - Q;
      if (Z < 0) Z += 1;
      else if (Z > 1) Z -= 1
    }
    return [Z * 360, I * 100, X * 100]
  };
  m2.rgb.hwb = function(A) {
    let Q = A[0],
      B = A[1],
      G = A[2],
      Z = m2.rgb.hsl(A)[0],
      I = 0.00392156862745098 * Math.min(Q, Math.min(B, G));
    return G = 1 - 0.00392156862745098 * Math.max(Q, Math.max(B, G)), [Z, I * 100, G * 100]
  };
  m2.rgb.cmyk = function(A) {
    let Q = A[0] / 255,
      B = A[1] / 255,
      G = A[2] / 255,
      Z = Math.min(1 - Q, 1 - B, 1 - G),
      I = (1 - Q - Z) / (1 - Z) || 0,
      Y = (1 - B - Z) / (1 - Z) || 0,
      J = (1 - G - Z) / (1 - Z) || 0;
    return [I * 100, Y * 100, J * 100, Z * 100]
  };

  function dC6(A, Q) {
    return (A[0] - Q[0]) ** 2 + (A[1] - Q[1]) ** 2 + (A[2] - Q[2]) ** 2
  }
  m2.rgb.keyword = function(A) {
    let Q = TLB[A];
    if (Q) return Q;
    let B = 1 / 0,
      G;
    for (let Z of Object.keys(U$A)) {
      let I = U$A[Z],
        Y = dC6(A, I);
      if (Y < B) B = Y, G = Z
    }
    return G
  };
  m2.keyword.rgb = function(A) {
    return U$A[A]
  };
  m2.rgb.xyz = function(A) {
    let Q = A[0] / 255,
      B = A[1] / 255,
      G = A[2] / 255;
    Q = Q > 0.04045 ? ((Q + 0.055) / 1.055) ** 2.4 : Q / 12.92, B = B > 0.04045 ? ((B + 0.055) / 1.055) ** 2.4 : B / 12.92, G = G > 0.04045 ? ((G + 0.055) / 1.055) ** 2.4 : G / 12.92;
    let Z = Q * 0.4124 + B * 0.3576 + G * 0.1805,
      I = Q * 0.2126 + B * 0.7152 + G * 0.0722,
      Y = Q * 0.0193 + B * 0.1192 + G * 0.9505;
    return [Z * 100, I * 100, Y * 100]
  };
  m2.rgb.lab = function(A) {
    let Q = m2.rgb.xyz(A),
      B = Q[0],
      G = Q[1],
      Z = Q[2];
    B /= 95.047, G /= 100, Z /= 108.883, B = B > 0.008856 ? B ** 0.3333333333333333 : 7.787 * B + 0.13793103448275862, G = G > 0.008856 ? G ** 0.3333333333333333 : 7.787 * G + 0.13793103448275862, Z = Z > 0.008856 ? Z ** 0.3333333333333333 : 7.787 * Z + 0.13793103448275862;
    let I = 116 * G - 16,
      Y = 500 * (B - G),
      J = 200 * (G - Z);
    return [I, Y, J]
  };
  m2.hsl.rgb = function(A) {
    let Q = A[0] / 360,
      B = A[1] / 100,
      G = A[2] / 100,
      Z, I, Y;
    if (B === 0) return Y = G * 255, [Y, Y, Y];
    if (G < 0.5) Z = G * (1 + B);
    else Z = G + B - G * B;
    let J = 2 * G - Z,
      W = [0, 0, 0];
    for (let X = 0; X < 3; X++) {
      if (I = Q + 0.3333333333333333 * -(X - 1), I < 0) I++;
      if (I > 1) I--;
      if (6 * I < 1) Y = J + (Z - J) * 6 * I;
      else if (2 * I < 1) Y = Z;
      else if (3 * I < 2) Y = J + (Z - J) * (0.6666666666666666 - I) * 6;
      else Y = J;
      W[X] = Y * 255
    }
    return W
  };
  m2.hsl.hsv = function(A) {
    let Q = A[0],
      B = A[1] / 100,
      G = A[2] / 100,
      Z = B,
      I = Math.max(G, 0.01);
    G *= 2, B *= G <= 1 ? G : 2 - G, Z *= I <= 1 ? I : 2 - I;
    let Y = (G + B) / 2,
      J = G === 0 ? 2 * Z / (I + Z) : 2 * B / (G + B);
    return [Q, J * 100, Y * 100]
  };
  m2.hsv.rgb = function(A) {
    let Q = A[0] / 60,
      B = A[1] / 100,
      G = A[2] / 100,
      Z = Math.floor(Q) % 6,
      I = Q - Math.floor(Q),
      Y = 255 * G * (1 - B),
      J = 255 * G * (1 - B * I),
      W = 255 * G * (1 - B * (1 - I));
    switch (G *= 255, Z) {
      case 0:
        return [G, W, Y];
      case 1:
        return [J, G, Y];
      case 2:
        return [Y, G, W];
      case 3:
        return [Y, J, G];
      case 4:
        return [W, Y, G];
      case 5:
        return [G, Y, J]
    }
  };
  m2.hsv.hsl = function(A) {
    let Q = A[0],
      B = A[1] / 100,
      G = A[2] / 100,
      Z = Math.max(G, 0.01),
      I, Y;
    Y = (2 - B) * G;
    let J = (2 - B) * Z;
    return I = B * Z, I /= J <= 1 ? J : 2 - J, I = I || 0, Y /= 2, [Q, I * 100, Y * 100]
  };
  m2.hwb.rgb = function(A) {
    let Q = A[0] / 360,
      B = A[1] / 100,
      G = A[2] / 100,
      Z = B + G,
      I;
    if (Z > 1) B /= Z, G /= Z;
    let Y = Math.floor(6 * Q),
      J = 1 - G;
    if (I = 6 * Q - Y, (Y & 1) !== 0) I = 1 - I;
    let W = B + I * (J - B),
      X, V, F;
    switch (Y) {
      default:
      case 6:
      case 0:
        X = J, V = W, F = B;
        break;
      case 1:
        X = W, V = J, F = B;
        break;
      case 2:
        X = B, V = J, F = W;
        break;
      case 3:
        X = B, V = W, F = J;
        break;
      case 4:
        X = W, V = B, F = J;
        break;
      case 5:
        X = J, V = B, F = W;
        break
    }
    return [X * 255, V * 255, F * 255]
  };
  m2.cmyk.rgb = function(A) {
    let Q = A[0] / 100,
      B = A[1] / 100,
      G = A[2] / 100,
      Z = A[3] / 100,
      I = 1 - Math.min(1, Q * (1 - Z) + Z),
      Y = 1 - Math.min(1, B * (1 - Z) + Z),
      J = 1 - Math.min(1, G * (1 - Z) + Z);
    return [I * 255, Y * 255, J * 255]
  };
  m2.xyz.rgb = function(A) {
    let Q = A[0] / 100,
      B = A[1] / 100,
      G = A[2] / 100,
      Z, I, Y;
    return Z = Q * 3.2406 + B * -1.5372 + G * -0.4986, I = Q * -0.9689 + B * 1.8758 + G * 0.0415, Y = Q * 0.0557 + B * -0.204 + G * 1.057, Z = Z > 0.0031308 ? 1.055 * Z ** 0.4166666666666667 - 0.055 : Z * 12.92, I = I > 0.0031308 ? 1.055 * I ** 0.4166666666666667 - 0.055 : I * 12.92, Y = Y > 0.0031308 ? 1.055 * Y ** 0.4166666666666667 - 0.055 : Y * 12.92, Z = Math.min(Math.max(0, Z), 1), I = Math.min(Math.max(0, I), 1), Y = Math.min(Math.max(0, Y), 1), [Z * 255, I * 255, Y * 255]
  };
  m2.xyz.lab = function(A) {
    let Q = A[0],
      B = A[1],
      G = A[2];
    Q /= 95.047, B /= 100, G /= 108.883, Q = Q > 0.008856 ? Q ** 0.3333333333333333 : 7.787 * Q + 0.13793103448275862, B = B > 0.008856 ? B ** 0.3333333333333333 : 7.787 * B + 0.13793103448275862, G = G > 0.008856 ? G ** 0.3333333333333333 : 7.787 * G + 0.13793103448275862;
    let Z = 116 * B - 16,
      I = 500 * (Q - B),
      Y = 200 * (B - G);
    return [Z, I, Y]
  };
  m2.lab.xyz = function(A) {
    let Q = A[0],
      B = A[1],
      G = A[2],
      Z, I, Y;
    I = (Q + 16) / 116, Z = B / 500 + I, Y = I - G / 200;
    let J = I ** 3,
      W = Z ** 3,
      X = Y ** 3;
    return I = J > 0.008856 ? J : (I - 0.13793103448275862) / 7.787, Z = W > 0.008856 ? W : (Z - 0.13793103448275862) / 7.787, Y = X > 0.008856 ? X : (Y - 0.13793103448275862) / 7.787, Z *= 95.047, I *= 100, Y *= 108.883, [Z, I, Y]
  };
  m2.lab.lch = function(A) {
    let Q = A[0],
      B = A[1],
      G = A[2],
      Z;
    if (Z = Math.atan2(G, B) * 360 / 2 / Math.PI, Z < 0) Z += 360;
    let Y = Math.sqrt(B * B + G * G);
    return [Q, Y, Z]
  };
  m2.lch.lab = function(A) {
    let Q = A[0],
      B = A[1],
      Z = A[2] / 360 * 2 * Math.PI,
      I = B * Math.cos(Z),
      Y = B * Math.sin(Z);
    return [Q, I, Y]
  };
  m2.rgb.ansi16 = function(A, Q = null) {
    let [B, G, Z] = A, I = Q === null ? m2.rgb.hsv(A)[2] : Q;
    if (I = Math.round(I / 50), I === 0) return 30;
    let Y = 30 + (Math.round(Z / 255) << 2 | Math.round(G / 255) << 1 | Math.round(B / 255));
    if (I === 2) Y += 60;
    return Y
  };
  m2.hsv.ansi16 = function(A) {
    return m2.rgb.ansi16(m2.hsv.rgb(A), A[2])
  };
  m2.rgb.ansi256 = function(A) {
    let Q = A[0],
      B = A[1],
      G = A[2];
    if (Q === B && B === G) {
      if (Q < 8) return 16;
      if (Q > 248) return 231;
      return Math.round((Q - 8) / 247 * 24) + 232
    }
    return 16 + 36 * Math.round(Q / 255 * 5) + 6 * Math.round(B / 255 * 5) + Math.round(G / 255 * 5)
  };
  m2.ansi16.rgb = function(A) {
    let Q = A % 10;
    if (Q === 0 || Q === 7) {
      if (A > 50) Q += 3.5;
      return Q = Q / 10.5 * 255, [Q, Q, Q]
    }
    let B = (~~(A > 50) + 1) * 0.5,
      G = (Q & 1) * B * 255,
      Z = (Q >> 1 & 1) * B * 255,
      I = (Q >> 2 & 1) * B * 255;
    return [G, Z, I]
  };
  m2.ansi256.rgb = function(A) {
    if (A >= 232) {
      let I = (A - 232) * 10 + 8;
      return [I, I, I]
    }
    A -= 16;
    let Q, B = Math.floor(A / 36) / 5 * 255,
      G = Math.floor((Q = A % 36) / 6) / 5 * 255,
      Z = Q % 6 / 5 * 255;
    return [B, G, Z]
  };
  m2.rgb.hex = function(A) {
    let B = (((Math.round(A[0]) & 255) << 16) + ((Math.round(A[1]) & 255) << 8) + (Math.round(A[2]) & 255)).toString(16).toUpperCase();
    return "000000".substring(B.length) + B
  };
  m2.hex.rgb = function(A) {
    let Q = A.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
    if (!Q) return [0, 0, 0];
    let B = Q[0];
    if (Q[0].length === 3) B = B.split("").map((J) => {
      return J + J
    }).join("");
    let G = parseInt(B, 16),
      Z = G >> 16 & 255,
      I = G >> 8 & 255,
      Y = G & 255;
    return [Z, I, Y]
  };
  m2.rgb.hcg = function(A) {
    let Q = A[0] / 255,
      B = A[1] / 255,
      G = A[2] / 255,
      Z = Math.max(Math.max(Q, B), G),
      I = Math.min(Math.min(Q, B), G),
      Y = Z - I,
      J, W;
    if (Y < 1) J = I / (1 - Y);
    else J = 0;
    if (Y <= 0) W = 0;
    else if (Z === Q) W = (B - G) / Y % 6;
    else if (Z === B) W = 2 + (G - Q) / Y;
    else W = 4 + (Q - B) / Y;
    return W /= 6, W %= 1, [W * 360, Y * 100, J * 100]
  };
  m2.hsl.hcg = function(A) {
    let Q = A[1] / 100,
      B = A[2] / 100,
      G = B < 0.5 ? 2 * Q * B : 2 * Q * (1 - B),
      Z = 0;
    if (G < 1) Z = (B - 0.5 * G) / (1 - G);
    return [A[0], G * 100, Z * 100]
  };
  m2.hsv.hcg = function(A) {
    let Q = A[1] / 100,
      B = A[2] / 100,
      G = Q * B,
      Z = 0;
    if (G < 1) Z = (B - G) / (1 - G);
    return [A[0], G * 100, Z * 100]
  };
  m2.hcg.rgb = function(A) {
    let Q = A[0] / 360,
      B = A[1] / 100,
      G = A[2] / 100;
    if (B === 0) return [G * 255, G * 255, G * 255];
    let Z = [0, 0, 0],
      I = Q % 1 * 6,
      Y = I % 1,
      J = 1 - Y,
      W = 0;
    switch (Math.floor(I)) {
      case 0:
        Z[0] = 1, Z[1] = Y, Z[2] = 0;
        break;
      case 1:
        Z[0] = J, Z[1] = 1, Z[2] = 0;
        break;
      case 2:
        Z[0] = 0, Z[1] = 1, Z[2] = Y;
        break;
      case 3:
        Z[0] = 0, Z[1] = J, Z[2] = 1;
        break;
      case 4:
        Z[0] = Y, Z[1] = 0, Z[2] = 1;
        break;
      default:
        Z[0] = 1, Z[1] = 0, Z[2] = J
    }
    return W = (1 - B) * G, [(B * Z[0] + W) * 255, (B * Z[1] + W) * 255, (B * Z[2] + W) * 255]
  };
  m2.hcg.hsv = function(A) {
    let Q = A[1] / 100,
      B = A[2] / 100,
      G = Q + B * (1 - Q),
      Z = 0;
    if (G > 0) Z = Q / G;
    return [A[0], Z * 100, G * 100]
  };
  m2.hcg.hsl = function(A) {
    let Q = A[1] / 100,
      G = A[2] / 100 * (1 - Q) + 0.5 * Q,
      Z = 0;
    if (G > 0 && G < 0.5) Z = Q / (2 * G);
    else if (G >= 0.5 && G < 1) Z = Q / (2 * (1 - G));
    return [A[0], Z * 100, G * 100]
  };
  m2.hcg.hwb = function(A) {
    let Q = A[1] / 100,
      B = A[2] / 100,
      G = Q + B * (1 - Q);
    return [A[0], (G - Q) * 100, (1 - G) * 100]
  };
  m2.hwb.hcg = function(A) {
    let Q = A[1] / 100,
      G = 1 - A[2] / 100,
      Z = G - Q,
      I = 0;
    if (Z < 1) I = (G - Z) / (1 - Z);
    return [A[0], Z * 100, I * 100]
  };
  m2.apple.rgb = function(A) {
    return [A[0] / 65535 * 255, A[1] / 65535 * 255, A[2] / 65535 * 255]
  };
  m2.rgb.apple = function(A) {
    return [A[0] / 255 * 65535, A[1] / 255 * 65535, A[2] / 255 * 65535]
  };
  m2.gray.rgb = function(A) {
    return [A[0] / 100 * 255, A[0] / 100 * 255, A[0] / 100 * 255]
  };
  m2.gray.hsl = function(A) {
    return [0, 0, A[0]]
  };
  m2.gray.hsv = m2.gray.hsl;
  m2.gray.hwb = function(A) {
    return [0, 100, A[0]]
  };
  m2.gray.cmyk = function(A) {
    return [0, 0, 0, A[0]]
  };
  m2.gray.lab = function(A) {
    return [A[0], 0, 0]
  };
  m2.gray.hex = function(A) {
    let Q = Math.round(A[0] / 100 * 255) & 255,
      G = ((Q << 16) + (Q << 8) + Q).toString(16).toUpperCase();
    return "000000".substring(G.length) + G
  };
  m2.rgb.gray = function(A) {
    return [(A[0] + A[1] + A[2]) / 3 / 255 * 100]
  }
})
// @from(Start 6523744, End 6524911)
SLB = z((Qr7, jLB) => {
  var gsA = ru1();

  function cC6() {
    let A = {},
      Q = Object.keys(gsA);
    for (let B = Q.length, G = 0; G < B; G++) A[Q[G]] = {
      distance: -1,
      parent: null
    };
    return A
  }

  function pC6(A) {
    let Q = cC6(),
      B = [A];
    Q[A].distance = 0;
    while (B.length) {
      let G = B.pop(),
        Z = Object.keys(gsA[G]);
      for (let I = Z.length, Y = 0; Y < I; Y++) {
        let J = Z[Y],
          W = Q[J];
        if (W.distance === -1) W.distance = Q[G].distance + 1, W.parent = G, B.unshift(J)
      }
    }
    return Q
  }

  function lC6(A, Q) {
    return function(B) {
      return Q(A(B))
    }
  }

  function iC6(A, Q) {
    let B = [Q[A].parent, A],
      G = gsA[Q[A].parent][A],
      Z = Q[A].parent;
    while (Q[Z].parent) B.unshift(Q[Z].parent), G = lC6(gsA[Q[Z].parent][Z], G), Z = Q[Z].parent;
    return G.conversion = B, G
  }
  jLB.exports = function(A) {
    let Q = pC6(A),
      B = {},
      G = Object.keys(Q);
    for (let Z = G.length, I = 0; I < Z; I++) {
      let Y = G[I];
      if (Q[Y].parent === null) continue;
      B[Y] = iC6(Y, Q)
    }
    return B
  }
})
// @from(Start 6524917, End 6525996)
tu1 = z((Br7, _LB) => {
  var ou1 = ru1(),
    nC6 = SLB(),
    d7A = {},
    aC6 = Object.keys(ou1);

  function sC6(A) {
    let Q = function(...B) {
      let G = B[0];
      if (G === void 0 || G === null) return G;
      if (G.length > 1) B = G;
      return A(B)
    };
    if ("conversion" in A) Q.conversion = A.conversion;
    return Q
  }

  function rC6(A) {
    let Q = function(...B) {
      let G = B[0];
      if (G === void 0 || G === null) return G;
      if (G.length > 1) B = G;
      let Z = A(B);
      if (typeof Z === "object")
        for (let I = Z.length, Y = 0; Y < I; Y++) Z[Y] = Math.round(Z[Y]);
      return Z
    };
    if ("conversion" in A) Q.conversion = A.conversion;
    return Q
  }
  aC6.forEach((A) => {
    d7A[A] = {}, Object.defineProperty(d7A[A], "channels", {
      value: ou1[A].channels
    }), Object.defineProperty(d7A[A], "labels", {
      value: ou1[A].labels
    });
    let Q = nC6(A);
    Object.keys(Q).forEach((G) => {
      let Z = Q[G];
      d7A[A][G] = rC6(Z), d7A[A][G].raw = sC6(Z)
    })
  });
  _LB.exports = d7A
})
// @from(Start 6526002, End 6534553)
msA = z((Gr7, yLB) => {
  var c7A = RLB(),
    Aq = tu1(),
    kLB = ["keyword", "gray", "hex"],
    eu1 = {};
  for (let A of Object.keys(Aq)) eu1[[...Aq[A].labels].sort().join("")] = A;
  var usA = {};

  function fF(A, Q) {
    if (!(this instanceof fF)) return new fF(A, Q);
    if (Q && Q in kLB) Q = null;
    if (Q && !(Q in Aq)) throw Error("Unknown model: " + Q);
    let B, G;
    if (A == null) this.model = "rgb", this.color = [0, 0, 0], this.valpha = 1;
    else if (A instanceof fF) this.model = A.model, this.color = [...A.color], this.valpha = A.valpha;
    else if (typeof A === "string") {
      let Z = c7A.get(A);
      if (Z === null) throw Error("Unable to parse color from string: " + A);
      this.model = Z.model, G = Aq[this.model].channels, this.color = Z.value.slice(0, G), this.valpha = typeof Z.value[G] === "number" ? Z.value[G] : 1
    } else if (A.length > 0) {
      this.model = Q || "rgb", G = Aq[this.model].channels;
      let Z = Array.prototype.slice.call(A, 0, G);
      this.color = Am1(Z, G), this.valpha = typeof A[G] === "number" ? A[G] : 1
    } else if (typeof A === "number") this.model = "rgb", this.color = [A >> 16 & 255, A >> 8 & 255, A & 255], this.valpha = 1;
    else {
      this.valpha = 1;
      let Z = Object.keys(A);
      if ("alpha" in A) Z.splice(Z.indexOf("alpha"), 1), this.valpha = typeof A.alpha === "number" ? A.alpha : 0;
      let I = Z.sort().join("");
      if (!(I in eu1)) throw Error("Unable to parse color from object: " + JSON.stringify(A));
      this.model = eu1[I];
      let {
        labels: Y
      } = Aq[this.model], J = [];
      for (B = 0; B < Y.length; B++) J.push(A[Y[B]]);
      this.color = Am1(J)
    }
    if (usA[this.model]) {
      G = Aq[this.model].channels;
      for (B = 0; B < G; B++) {
        let Z = usA[this.model][B];
        if (Z) this.color[B] = Z(this.color[B])
      }
    }
    if (this.valpha = Math.max(0, Math.min(1, this.valpha)), Object.freeze) Object.freeze(this)
  }
  fF.prototype = {
    toString() {
      return this.string()
    },
    toJSON() {
      return this[this.model]()
    },
    string(A) {
      let Q = this.model in c7A.to ? this : this.rgb();
      Q = Q.round(typeof A === "number" ? A : 1);
      let B = Q.valpha === 1 ? Q.color : [...Q.color, this.valpha];
      return c7A.to[Q.model](B)
    },
    percentString(A) {
      let Q = this.rgb().round(typeof A === "number" ? A : 1),
        B = Q.valpha === 1 ? Q.color : [...Q.color, this.valpha];
      return c7A.to.rgb.percent(B)
    },
    array() {
      return this.valpha === 1 ? [...this.color] : [...this.color, this.valpha]
    },
    object() {
      let A = {},
        {
          channels: Q
        } = Aq[this.model],
        {
          labels: B
        } = Aq[this.model];
      for (let G = 0; G < Q; G++) A[B[G]] = this.color[G];
      if (this.valpha !== 1) A.alpha = this.valpha;
      return A
    },
    unitArray() {
      let A = this.rgb().color;
      if (A[0] /= 255, A[1] /= 255, A[2] /= 255, this.valpha !== 1) A.push(this.valpha);
      return A
    },
    unitObject() {
      let A = this.rgb().object();
      if (A.r /= 255, A.g /= 255, A.b /= 255, this.valpha !== 1) A.alpha = this.valpha;
      return A
    },
    round(A) {
      return A = Math.max(A || 0, 0), new fF([...this.color.map(tC6(A)), this.valpha], this.model)
    },
    alpha(A) {
      if (A !== void 0) return new fF([...this.color, Math.max(0, Math.min(1, A))], this.model);
      return this.valpha
    },
    red: PJ("rgb", 0, SV(255)),
    green: PJ("rgb", 1, SV(255)),
    blue: PJ("rgb", 2, SV(255)),
    hue: PJ(["hsl", "hsv", "hsl", "hwb", "hcg"], 0, (A) => (A % 360 + 360) % 360),
    saturationl: PJ("hsl", 1, SV(100)),
    lightness: PJ("hsl", 2, SV(100)),
    saturationv: PJ("hsv", 1, SV(100)),
    value: PJ("hsv", 2, SV(100)),
    chroma: PJ("hcg", 1, SV(100)),
    gray: PJ("hcg", 2, SV(100)),
    white: PJ("hwb", 1, SV(100)),
    wblack: PJ("hwb", 2, SV(100)),
    cyan: PJ("cmyk", 0, SV(100)),
    magenta: PJ("cmyk", 1, SV(100)),
    yellow: PJ("cmyk", 2, SV(100)),
    black: PJ("cmyk", 3, SV(100)),
    x: PJ("xyz", 0, SV(95.047)),
    y: PJ("xyz", 1, SV(100)),
    z: PJ("xyz", 2, SV(108.833)),
    l: PJ("lab", 0, SV(100)),
    a: PJ("lab", 1),
    b: PJ("lab", 2),
    keyword(A) {
      if (A !== void 0) return new fF(A);
      return Aq[this.model].keyword(this.color)
    },
    hex(A) {
      if (A !== void 0) return new fF(A);
      return c7A.to.hex(this.rgb().round().color)
    },
    hexa(A) {
      if (A !== void 0) return new fF(A);
      let Q = this.rgb().round().color,
        B = Math.round(this.valpha * 255).toString(16).toUpperCase();
      if (B.length === 1) B = "0" + B;
      return c7A.to.hex(Q) + B
    },
    rgbNumber() {
      let A = this.rgb().color;
      return (A[0] & 255) << 16 | (A[1] & 255) << 8 | A[2] & 255
    },
    luminosity() {
      let A = this.rgb().color,
        Q = [];
      for (let [B, G] of A.entries()) {
        let Z = G / 255;
        Q[B] = Z <= 0.04045 ? Z / 12.92 : ((Z + 0.055) / 1.055) ** 2.4
      }
      return 0.2126 * Q[0] + 0.7152 * Q[1] + 0.0722 * Q[2]
    },
    contrast(A) {
      let Q = this.luminosity(),
        B = A.luminosity();
      if (Q > B) return (Q + 0.05) / (B + 0.05);
      return (B + 0.05) / (Q + 0.05)
    },
    level(A) {
      let Q = this.contrast(A);
      if (Q >= 7) return "AAA";
      return Q >= 4.5 ? "AA" : ""
    },
    isDark() {
      let A = this.rgb().color;
      return (A[0] * 2126 + A[1] * 7152 + A[2] * 722) / 1e4 < 128
    },
    isLight() {
      return !this.isDark()
    },
    negate() {
      let A = this.rgb();
      for (let Q = 0; Q < 3; Q++) A.color[Q] = 255 - A.color[Q];
      return A
    },
    lighten(A) {
      let Q = this.hsl();
      return Q.color[2] += Q.color[2] * A, Q
    },
    darken(A) {
      let Q = this.hsl();
      return Q.color[2] -= Q.color[2] * A, Q
    },
    saturate(A) {
      let Q = this.hsl();
      return Q.color[1] += Q.color[1] * A, Q
    },
    desaturate(A) {
      let Q = this.hsl();
      return Q.color[1] -= Q.color[1] * A, Q
    },
    whiten(A) {
      let Q = this.hwb();
      return Q.color[1] += Q.color[1] * A, Q
    },
    blacken(A) {
      let Q = this.hwb();
      return Q.color[2] += Q.color[2] * A, Q
    },
    grayscale() {
      let A = this.rgb().color,
        Q = A[0] * 0.3 + A[1] * 0.59 + A[2] * 0.11;
      return fF.rgb(Q, Q, Q)
    },
    fade(A) {
      return this.alpha(this.valpha - this.valpha * A)
    },
    opaquer(A) {
      return this.alpha(this.valpha + this.valpha * A)
    },
    rotate(A) {
      let Q = this.hsl(),
        B = Q.color[0];
      return B = (B + A) % 360, B = B < 0 ? 360 + B : B, Q.color[0] = B, Q
    },
    mix(A, Q) {
      if (!A || !A.rgb) throw Error('Argument to "mix" was not a Color instance, but rather an instance of ' + typeof A);
      let B = A.rgb(),
        G = this.rgb(),
        Z = Q === void 0 ? 0.5 : Q,
        I = 2 * Z - 1,
        Y = B.alpha() - G.alpha(),
        J = ((I * Y === -1 ? I : (I + Y) / (1 + I * Y)) + 1) / 2,
        W = 1 - J;
      return fF.rgb(J * B.red() + W * G.red(), J * B.green() + W * G.green(), J * B.blue() + W * G.blue(), B.alpha() * Z + G.alpha() * (1 - Z))
    }
  };
  for (let A of Object.keys(Aq)) {
    if (kLB.includes(A)) continue;
    let {
      channels: Q
    } = Aq[A];
    fF.prototype[A] = function(...B) {
      if (this.model === A) return new fF(this);
      if (B.length > 0) return new fF(B, A);
      return new fF([...eC6(Aq[this.model][A].raw(this.color)), this.valpha], A)
    }, fF[A] = function(...B) {
      let G = B[0];
      if (typeof G === "number") G = Am1(B, Q);
      return new fF(G, A)
    }
  }

  function oC6(A, Q) {
    return Number(A.toFixed(Q))
  }

  function tC6(A) {
    return function(Q) {
      return oC6(Q, A)
    }
  }

  function PJ(A, Q, B) {
    A = Array.isArray(A) ? A : [A];
    for (let G of A)(usA[G] || (usA[G] = []))[Q] = B;
    return A = A[0],
      function(G) {
        let Z;
        if (G !== void 0) {
          if (B) G = B(G);
          return Z = this[A](), Z.color[Q] = G, Z
        }
        if (Z = this[A]().color[Q], B) Z = B(Z);
        return Z
      }
  }

  function SV(A) {
    return function(Q) {
      return Math.max(0, Math.min(A, Q))
    }
  }

  function eC6(A) {
    return Array.isArray(A) ? A : [A]
  }

  function Am1(A, Q) {
    for (let B = 0; B < Q; B++)
      if (typeof A[B] !== "number") A[B] = 0;
    return A
  }
  yLB.exports = fF
})
// @from(Start 6534559, End 6547433)
bLB = z((Zr7, vLB) => {
  var AE6 = msA(),
    j0 = b_(),
    Dp = H$A(),
    QE6 = {
      left: "low",
      center: "centre",
      centre: "centre",
      right: "high"
    };

  function xLB(A) {
    let {
      raw: Q,
      density: B,
      limitInputPixels: G,
      ignoreIcc: Z,
      unlimited: I,
      sequentialRead: Y,
      failOn: J,
      failOnError: W,
      animated: X,
      page: V,
      pages: F,
      subifd: K
    } = A;
    return [Q, B, G, Z, I, Y, J, W, X, V, F, K].some(j0.defined) ? {
      raw: Q,
      density: B,
      limitInputPixels: G,
      ignoreIcc: Z,
      unlimited: I,
      sequentialRead: Y,
      failOn: J,
      failOnError: W,
      animated: X,
      page: V,
      pages: F,
      subifd: K
    } : void 0
  }

  function BE6(A, Q, B) {
    let G = {
      failOn: "warning",
      limitInputPixels: Math.pow(16383, 2),
      ignoreIcc: !1,
      unlimited: !1,
      sequentialRead: !0
    };
    if (j0.string(A)) G.file = A;
    else if (j0.buffer(A)) {
      if (A.length === 0) throw Error("Input Buffer is empty");
      G.buffer = A
    } else if (j0.arrayBuffer(A)) {
      if (A.byteLength === 0) throw Error("Input bit Array is empty");
      G.buffer = Buffer.from(A, 0, A.byteLength)
    } else if (j0.typedArray(A)) {
      if (A.length === 0) throw Error("Input Bit Array is empty");
      G.buffer = Buffer.from(A.buffer, A.byteOffset, A.byteLength)
    } else if (j0.plainObject(A) && !j0.defined(Q)) {
      if (Q = A, xLB(Q)) G.buffer = []
    } else if (!j0.defined(A) && !j0.defined(Q) && j0.object(B) && B.allowStream) G.buffer = [];
    else throw Error(`Unsupported input '${A}' of type ${typeof A}${j0.defined(Q)?` when also providing options of type ${typeof Q}`:""}`);
    if (j0.object(Q)) {
      if (j0.defined(Q.failOnError))
        if (j0.bool(Q.failOnError)) G.failOn = Q.failOnError ? "warning" : "none";
        else throw j0.invalidParameterError("failOnError", "boolean", Q.failOnError);
      if (j0.defined(Q.failOn))
        if (j0.string(Q.failOn) && j0.inArray(Q.failOn, ["none", "truncated", "error", "warning"])) G.failOn = Q.failOn;
        else throw j0.invalidParameterError("failOn", "one of: none, truncated, error, warning", Q.failOn);
      if (j0.defined(Q.density))
        if (j0.inRange(Q.density, 1, 1e5)) G.density = Q.density;
        else throw j0.invalidParameterError("density", "number between 1 and 100000", Q.density);
      if (j0.defined(Q.ignoreIcc))
        if (j0.bool(Q.ignoreIcc)) G.ignoreIcc = Q.ignoreIcc;
        else throw j0.invalidParameterError("ignoreIcc", "boolean", Q.ignoreIcc);
      if (j0.defined(Q.limitInputPixels))
        if (j0.bool(Q.limitInputPixels)) G.limitInputPixels = Q.limitInputPixels ? Math.pow(16383, 2) : 0;
        else if (j0.integer(Q.limitInputPixels) && j0.inRange(Q.limitInputPixels, 0, Number.MAX_SAFE_INTEGER)) G.limitInputPixels = Q.limitInputPixels;
      else throw j0.invalidParameterError("limitInputPixels", "positive integer", Q.limitInputPixels);
      if (j0.defined(Q.unlimited))
        if (j0.bool(Q.unlimited)) G.unlimited = Q.unlimited;
        else throw j0.invalidParameterError("unlimited", "boolean", Q.unlimited);
      if (j0.defined(Q.sequentialRead))
        if (j0.bool(Q.sequentialRead)) G.sequentialRead = Q.sequentialRead;
        else throw j0.invalidParameterError("sequentialRead", "boolean", Q.sequentialRead);
      if (j0.defined(Q.raw))
        if (j0.object(Q.raw) && j0.integer(Q.raw.width) && Q.raw.width > 0 && j0.integer(Q.raw.height) && Q.raw.height > 0 && j0.integer(Q.raw.channels) && j0.inRange(Q.raw.channels, 1, 4)) switch (G.rawWidth = Q.raw.width, G.rawHeight = Q.raw.height, G.rawChannels = Q.raw.channels, G.rawPremultiplied = !!Q.raw.premultiplied, A.constructor) {
          case Uint8Array:
          case Uint8ClampedArray:
            G.rawDepth = "uchar";
            break;
          case Int8Array:
            G.rawDepth = "char";
            break;
          case Uint16Array:
            G.rawDepth = "ushort";
            break;
          case Int16Array:
            G.rawDepth = "short";
            break;
          case Uint32Array:
            G.rawDepth = "uint";
            break;
          case Int32Array:
            G.rawDepth = "int";
            break;
          case Float32Array:
            G.rawDepth = "float";
            break;
          case Float64Array:
            G.rawDepth = "double";
            break;
          default:
            G.rawDepth = "uchar";
            break
        } else throw Error("Expected width, height and channels for raw pixel input");
      if (j0.defined(Q.animated))
        if (j0.bool(Q.animated)) G.pages = Q.animated ? -1 : 1;
        else throw j0.invalidParameterError("animated", "boolean", Q.animated);
      if (j0.defined(Q.pages))
        if (j0.integer(Q.pages) && j0.inRange(Q.pages, -1, 1e5)) G.pages = Q.pages;
        else throw j0.invalidParameterError("pages", "integer between -1 and 100000", Q.pages);
      if (j0.defined(Q.page))
        if (j0.integer(Q.page) && j0.inRange(Q.page, 0, 1e5)) G.page = Q.page;
        else throw j0.invalidParameterError("page", "integer between 0 and 100000", Q.page);
      if (j0.defined(Q.level))
        if (j0.integer(Q.level) && j0.inRange(Q.level, 0, 256)) G.level = Q.level;
        else throw j0.invalidParameterError("level", "integer between 0 and 256", Q.level);
      if (j0.defined(Q.subifd))
        if (j0.integer(Q.subifd) && j0.inRange(Q.subifd, -1, 1e5)) G.subifd = Q.subifd;
        else throw j0.invalidParameterError("subifd", "integer between -1 and 100000", Q.subifd);
      if (j0.defined(Q.create))
        if (j0.object(Q.create) && j0.integer(Q.create.width) && Q.create.width > 0 && j0.integer(Q.create.height) && Q.create.height > 0 && j0.integer(Q.create.channels)) {
          if (G.createWidth = Q.create.width, G.createHeight = Q.create.height, G.createChannels = Q.create.channels, j0.defined(Q.create.noise)) {
            if (!j0.object(Q.create.noise)) throw Error("Expected noise to be an object");
            if (!j0.inArray(Q.create.noise.type, ["gaussian"])) throw Error("Only gaussian noise is supported at the moment");
            if (!j0.inRange(Q.create.channels, 1, 4)) throw j0.invalidParameterError("create.channels", "number between 1 and 4", Q.create.channels);
            if (G.createNoiseType = Q.create.noise.type, j0.number(Q.create.noise.mean) && j0.inRange(Q.create.noise.mean, 0, 1e4)) G.createNoiseMean = Q.create.noise.mean;
            else throw j0.invalidParameterError("create.noise.mean", "number between 0 and 10000", Q.create.noise.mean);
            if (j0.number(Q.create.noise.sigma) && j0.inRange(Q.create.noise.sigma, 0, 1e4)) G.createNoiseSigma = Q.create.noise.sigma;
            else throw j0.invalidParameterError("create.noise.sigma", "number between 0 and 10000", Q.create.noise.sigma)
          } else if (j0.defined(Q.create.background)) {
            if (!j0.inRange(Q.create.channels, 3, 4)) throw j0.invalidParameterError("create.channels", "number between 3 and 4", Q.create.channels);
            let Z = AE6(Q.create.background);
            G.createBackground = [Z.red(), Z.green(), Z.blue(), Math.round(Z.alpha() * 255)]
          } else throw Error("Expected valid noise or background to create a new input image");
          delete G.buffer
        } else throw Error("Expected valid width, height and channels to create a new input image");
      if (j0.defined(Q.text))
        if (j0.object(Q.text) && j0.string(Q.text.text)) {
          if (G.textValue = Q.text.text, j0.defined(Q.text.height) && j0.defined(Q.text.dpi)) throw Error("Expected only one of dpi or height");
          if (j0.defined(Q.text.font))
            if (j0.string(Q.text.font)) G.textFont = Q.text.font;
            else throw j0.invalidParameterError("text.font", "string", Q.text.font);
          if (j0.defined(Q.text.fontfile))
            if (j0.string(Q.text.fontfile)) G.textFontfile = Q.text.fontfile;
            else throw j0.invalidParameterError("text.fontfile", "string", Q.text.fontfile);
          if (j0.defined(Q.text.width))
            if (j0.integer(Q.text.width) && Q.text.width > 0) G.textWidth = Q.text.width;
            else throw j0.invalidParameterError("text.width", "positive integer", Q.text.width);
          if (j0.defined(Q.text.height))
            if (j0.integer(Q.text.height) && Q.text.height > 0) G.textHeight = Q.text.height;
            else throw j0.invalidParameterError("text.height", "positive integer", Q.text.height);
          if (j0.defined(Q.text.align))
            if (j0.string(Q.text.align) && j0.string(this.constructor.align[Q.text.align])) G.textAlign = this.constructor.align[Q.text.align];
            else throw j0.invalidParameterError("text.align", "valid alignment", Q.text.align);
          if (j0.defined(Q.text.justify))
            if (j0.bool(Q.text.justify)) G.textJustify = Q.text.justify;
            else throw j0.invalidParameterError("text.justify", "boolean", Q.text.justify);
          if (j0.defined(Q.text.dpi))
            if (j0.integer(Q.text.dpi) && j0.inRange(Q.text.dpi, 1, 1e6)) G.textDpi = Q.text.dpi;
            else throw j0.invalidParameterError("text.dpi", "integer between 1 and 1000000", Q.text.dpi);
          if (j0.defined(Q.text.rgba))
            if (j0.bool(Q.text.rgba)) G.textRgba = Q.text.rgba;
            else throw j0.invalidParameterError("text.rgba", "bool", Q.text.rgba);
          if (j0.defined(Q.text.spacing))
            if (j0.integer(Q.text.spacing) && j0.inRange(Q.text.spacing, -1e6, 1e6)) G.textSpacing = Q.text.spacing;
            else throw j0.invalidParameterError("text.spacing", "integer between -1000000 and 1000000", Q.text.spacing);
          if (j0.defined(Q.text.wrap))
            if (j0.string(Q.text.wrap) && j0.inArray(Q.text.wrap, ["word", "char", "word-char", "none"])) G.textWrap = Q.text.wrap;
            else throw j0.invalidParameterError("text.wrap", "one of: word, char, word-char, none", Q.text.wrap);
          delete G.buffer
        } else throw Error("Expected a valid string to create an image with text.")
    } else if (j0.defined(Q)) throw Error("Invalid input options " + Q);
    return G
  }

  function GE6(A, Q, B) {
    if (Array.isArray(this.options.input.buffer))
      if (j0.buffer(A)) {
        if (this.options.input.buffer.length === 0) this.on("finish", () => {
          this.streamInFinished = !0
        });
        this.options.input.buffer.push(A), B()
      } else B(Error("Non-Buffer data on Writable Stream"));
    else B(Error("Unexpected data on Writable Stream"))
  }

  function ZE6() {
    if (this._isStreamInput()) this.options.input.buffer = Buffer.concat(this.options.input.buffer)
  }

  function IE6() {
    return Array.isArray(this.options.input.buffer)
  }

  function YE6(A) {
    let Q = Error();
    if (j0.fn(A)) {
      if (this._isStreamInput()) this.on("finish", () => {
        this._flattenBufferIn(), Dp.metadata(this.options, (B, G) => {
          if (B) A(j0.nativeError(B, Q));
          else A(null, G)
        })
      });
      else Dp.metadata(this.options, (B, G) => {
        if (B) A(j0.nativeError(B, Q));
        else A(null, G)
      });
      return this
    } else if (this._isStreamInput()) return new Promise((B, G) => {
      let Z = () => {
        this._flattenBufferIn(), Dp.metadata(this.options, (I, Y) => {
          if (I) G(j0.nativeError(I, Q));
          else B(Y)
        })
      };
      if (this.writableFinished) Z();
      else this.once("finish", Z)
    });
    else return new Promise((B, G) => {
      Dp.metadata(this.options, (Z, I) => {
        if (Z) G(j0.nativeError(Z, Q));
        else B(I)
      })
    })
  }

  function JE6(A) {
    let Q = Error();
    if (j0.fn(A)) {
      if (this._isStreamInput()) this.on("finish", () => {
        this._flattenBufferIn(), Dp.stats(this.options, (B, G) => {
          if (B) A(j0.nativeError(B, Q));
          else A(null, G)
        })
      });
      else Dp.stats(this.options, (B, G) => {
        if (B) A(j0.nativeError(B, Q));
        else A(null, G)
      });
      return this
    } else if (this._isStreamInput()) return new Promise((B, G) => {
      this.on("finish", function() {
        this._flattenBufferIn(), Dp.stats(this.options, (Z, I) => {
          if (Z) G(j0.nativeError(Z, Q));
          else B(I)
        })
      })
    });
    else return new Promise((B, G) => {
      Dp.stats(this.options, (Z, I) => {
        if (Z) G(j0.nativeError(Z, Q));
        else B(I)
      })
    })
  }
  vLB.exports = function(A) {
    Object.assign(A.prototype, {
      _inputOptionsFromObject: xLB,
      _createInputDescriptor: BE6,
      _write: GE6,
      _flattenBufferIn: ZE6,
      _isStreamInput: IE6,
      metadata: YE6,
      stats: JE6
    }), A.align = QE6
  }
})
// @from(Start 6547439, End 6553926)
dLB = z((Ir7, mLB) => {
  var Q9 = b_(),
    hLB = {
      center: 0,
      centre: 0,
      north: 1,
      east: 2,
      south: 3,
      west: 4,
      northeast: 5,
      southeast: 6,
      southwest: 7,
      northwest: 8
    },
    gLB = {
      top: 1,
      right: 2,
      bottom: 3,
      left: 4,
      "right top": 5,
      "right bottom": 6,
      "left bottom": 7,
      "left top": 8
    },
    fLB = {
      background: "background",
      copy: "copy",
      repeat: "repeat",
      mirror: "mirror"
    },
    uLB = {
      entropy: 16,
      attention: 17
    },
    Qm1 = {
      nearest: "nearest",
      linear: "linear",
      cubic: "cubic",
      mitchell: "mitchell",
      lanczos2: "lanczos2",
      lanczos3: "lanczos3"
    },
    WE6 = {
      contain: "contain",
      cover: "cover",
      fill: "fill",
      inside: "inside",
      outside: "outside"
    },
    XE6 = {
      contain: "embed",
      cover: "crop",
      fill: "ignore_aspect",
      inside: "max",
      outside: "min"
    };

  function Bm1(A) {
    return A.angle % 360 !== 0 || A.useExifOrientation === !0 || A.rotationAngle !== 0
  }

  function dsA(A) {
    return A.width !== -1 || A.height !== -1
  }

  function VE6(A, Q, B) {
    if (dsA(this.options)) this.options.debuglog("ignoring previous resize options");
    if (this.options.widthPost !== -1) this.options.debuglog("operation order will be: extract, resize, extract");
    if (Q9.defined(A))
      if (Q9.object(A) && !Q9.defined(B)) B = A;
      else if (Q9.integer(A) && A > 0) this.options.width = A;
    else throw Q9.invalidParameterError("width", "positive integer", A);
    else this.options.width = -1;
    if (Q9.defined(Q))
      if (Q9.integer(Q) && Q > 0) this.options.height = Q;
      else throw Q9.invalidParameterError("height", "positive integer", Q);
    else this.options.height = -1;
    if (Q9.object(B)) {
      if (Q9.defined(B.width))
        if (Q9.integer(B.width) && B.width > 0) this.options.width = B.width;
        else throw Q9.invalidParameterError("width", "positive integer", B.width);
      if (Q9.defined(B.height))
        if (Q9.integer(B.height) && B.height > 0) this.options.height = B.height;
        else throw Q9.invalidParameterError("height", "positive integer", B.height);
      if (Q9.defined(B.fit)) {
        let G = XE6[B.fit];
        if (Q9.string(G)) this.options.canvas = G;
        else throw Q9.invalidParameterError("fit", "valid fit", B.fit)
      }
      if (Q9.defined(B.position)) {
        let G = Q9.integer(B.position) ? B.position : uLB[B.position] || gLB[B.position] || hLB[B.position];
        if (Q9.integer(G) && (Q9.inRange(G, 0, 8) || Q9.inRange(G, 16, 17))) this.options.position = G;
        else throw Q9.invalidParameterError("position", "valid position/gravity/strategy", B.position)
      }
      if (this._setBackgroundColourOption("resizeBackground", B.background), Q9.defined(B.kernel))
        if (Q9.string(Qm1[B.kernel])) this.options.kernel = Qm1[B.kernel];
        else throw Q9.invalidParameterError("kernel", "valid kernel name", B.kernel);
      if (Q9.defined(B.withoutEnlargement)) this._setBooleanOption("withoutEnlargement", B.withoutEnlargement);
      if (Q9.defined(B.withoutReduction)) this._setBooleanOption("withoutReduction", B.withoutReduction);
      if (Q9.defined(B.fastShrinkOnLoad)) this._setBooleanOption("fastShrinkOnLoad", B.fastShrinkOnLoad)
    }
    if (Bm1(this.options) && dsA(this.options)) this.options.rotateBeforePreExtract = !0;
    return this
  }

  function FE6(A) {
    if (Q9.integer(A) && A > 0) this.options.extendTop = A, this.options.extendBottom = A, this.options.extendLeft = A, this.options.extendRight = A;
    else if (Q9.object(A)) {
      if (Q9.defined(A.top))
        if (Q9.integer(A.top) && A.top >= 0) this.options.extendTop = A.top;
        else throw Q9.invalidParameterError("top", "positive integer", A.top);
      if (Q9.defined(A.bottom))
        if (Q9.integer(A.bottom) && A.bottom >= 0) this.options.extendBottom = A.bottom;
        else throw Q9.invalidParameterError("bottom", "positive integer", A.bottom);
      if (Q9.defined(A.left))
        if (Q9.integer(A.left) && A.left >= 0) this.options.extendLeft = A.left;
        else throw Q9.invalidParameterError("left", "positive integer", A.left);
      if (Q9.defined(A.right))
        if (Q9.integer(A.right) && A.right >= 0) this.options.extendRight = A.right;
        else throw Q9.invalidParameterError("right", "positive integer", A.right);
      if (this._setBackgroundColourOption("extendBackground", A.background), Q9.defined(A.extendWith))
        if (Q9.string(fLB[A.extendWith])) this.options.extendWith = fLB[A.extendWith];
        else throw Q9.invalidParameterError("extendWith", "one of: background, copy, repeat, mirror", A.extendWith)
    } else throw Q9.invalidParameterError("extend", "integer or object", A);
    return this
  }

  function KE6(A) {
    let Q = dsA(this.options) || this.options.widthPre !== -1 ? "Post" : "Pre";
    if (this.options[`width${Q}`] !== -1) this.options.debuglog("ignoring previous extract options");
    if (["left", "top", "width", "height"].forEach(function(B) {
        let G = A[B];
        if (Q9.integer(G) && G >= 0) this.options[B + (B === "left" || B === "top" ? "Offset" : "") + Q] = G;
        else throw Q9.invalidParameterError(B, "integer", G)
      }, this), Bm1(this.options) && !dsA(this.options)) {
      if (this.options.widthPre === -1 || this.options.widthPost === -1) this.options.rotateBeforePreExtract = !0
    }
    return this
  }

  function DE6(A) {
    if (this.options.trimThreshold = 10, Q9.defined(A))
      if (Q9.object(A)) {
        if (Q9.defined(A.background)) this._setBackgroundColourOption("trimBackground", A.background);
        if (Q9.defined(A.threshold))
          if (Q9.number(A.threshold) && A.threshold >= 0) this.options.trimThreshold = A.threshold;
          else throw Q9.invalidParameterError("threshold", "positive number", A.threshold);
        if (Q9.defined(A.lineArt)) this._setBooleanOption("trimLineArt", A.lineArt)
      } else throw Q9.invalidParameterError("trim", "object", A);
    if (Bm1(this.options)) this.options.rotateBeforePreExtract = !0;
    return this
  }
  mLB.exports = function(A) {
    Object.assign(A.prototype, {
      resize: VE6,
      extend: FE6,
      extract: KE6,
      trim: DE6
    }), A.gravity = hLB, A.strategy = uLB, A.kernel = Qm1, A.fit = WE6, A.position = gLB
  }
})
// @from(Start 6553932, End 6556759)
pLB = z((Yr7, cLB) => {
  var kG = b_(),
    Gm1 = {
      clear: "clear",
      source: "source",
      over: "over",
      in: "in",
      out: "out",
      atop: "atop",
      dest: "dest",
      "dest-over": "dest-over",
      "dest-in": "dest-in",
      "dest-out": "dest-out",
      "dest-atop": "dest-atop",
      xor: "xor",
      add: "add",
      saturate: "saturate",
      multiply: "multiply",
      screen: "screen",
      overlay: "overlay",
      darken: "darken",
      lighten: "lighten",
      "colour-dodge": "colour-dodge",
      "color-dodge": "colour-dodge",
      "colour-burn": "colour-burn",
      "color-burn": "colour-burn",
      "hard-light": "hard-light",
      "soft-light": "soft-light",
      difference: "difference",
      exclusion: "exclusion"
    };

  function HE6(A) {
    if (!Array.isArray(A)) throw kG.invalidParameterError("images to composite", "array", A);
    return this.options.composite = A.map((Q) => {
      if (!kG.object(Q)) throw kG.invalidParameterError("image to composite", "object", Q);
      let B = this._inputOptionsFromObject(Q),
        G = {
          input: this._createInputDescriptor(Q.input, B, {
            allowStream: !1
          }),
          blend: "over",
          tile: !1,
          left: 0,
          top: 0,
          hasOffset: !1,
          gravity: 0,
          premultiplied: !1
        };
      if (kG.defined(Q.blend))
        if (kG.string(Gm1[Q.blend])) G.blend = Gm1[Q.blend];
        else throw kG.invalidParameterError("blend", "valid blend name", Q.blend);
      if (kG.defined(Q.tile))
        if (kG.bool(Q.tile)) G.tile = Q.tile;
        else throw kG.invalidParameterError("tile", "boolean", Q.tile);
      if (kG.defined(Q.left))
        if (kG.integer(Q.left)) G.left = Q.left;
        else throw kG.invalidParameterError("left", "integer", Q.left);
      if (kG.defined(Q.top))
        if (kG.integer(Q.top)) G.top = Q.top;
        else throw kG.invalidParameterError("top", "integer", Q.top);
      if (kG.defined(Q.top) !== kG.defined(Q.left)) throw Error("Expected both left and top to be set");
      else G.hasOffset = kG.integer(Q.top) && kG.integer(Q.left);
      if (kG.defined(Q.gravity))
        if (kG.integer(Q.gravity) && kG.inRange(Q.gravity, 0, 8)) G.gravity = Q.gravity;
        else if (kG.string(Q.gravity) && kG.integer(this.constructor.gravity[Q.gravity])) G.gravity = this.constructor.gravity[Q.gravity];
      else throw kG.invalidParameterError("gravity", "valid gravity", Q.gravity);
      if (kG.defined(Q.premultiplied))
        if (kG.bool(Q.premultiplied)) G.premultiplied = Q.premultiplied;
        else throw kG.invalidParameterError("premultiplied", "boolean", Q.premultiplied);
      return G
    }), this
  }
  cLB.exports = function(A) {
    A.prototype.composite = HE6, A.blend = Gm1
  }
})