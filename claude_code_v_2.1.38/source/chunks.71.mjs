
// @from(Ln 190687, Col 4)
uN7 = R((En2, bN7) => {
    var wx1 = Symbol("SemVer ANY");
    class ez6 {
        static get ANY() {
            return wx1
        }
        constructor(A, q) {
            if (q = CN7(q), A instanceof ez6)
                if (A.loose === !!q.loose) return A;
                else A = A.value;
            if (A = A.trim().split(/\s+/).join(" "), SHA("comparator", A, q), this.options = q, this.loose = !!q.loose, this.parse(A), this.semver === wx1) this.value = "";
            else this.value = this.operator + this.semver.version;
            SHA("comp", this)
        }
        parse(A) {
            let q = this.options.loose ? SN7[hN7.COMPARATORLOOSE] : SN7[hN7.COMPARATOR],
                K = A.match(q);
            if (!K) throw TypeError(`Invalid comparator: ${A}`);
            if (this.operator = K[1] !== void 0 ? K[1] : "", this.operator === "=") this.operator = "";
            if (!K[2]) this.semver = wx1;
            else this.semver = new IN7(K[2], this.options.loose)
        }
        toString() {
            return this.value
        }
        test(A) {
            if (SHA("Comparator.test", A, this.options.loose), this.semver === wx1 || A === wx1) return !0;
            if (typeof A === "string") try {
                A = new IN7(A, this.options)
            } catch (q) {
                return !1
            }
            return CHA(A, this.operator, this.semver, this.options)
        }
        intersects(A, q) {
            if (!(A instanceof ez6)) throw TypeError("a Comparator is required");
            if (this.operator === "") {
                if (this.value === "") return !0;
                return new xN7(A.value, q).test(this.value)
            } else if (A.operator === "") {
                if (A.value === "") return !0;
                return new xN7(this.value, q).test(A.semver)
            }
            if (q = CN7(q), q.includePrerelease && (this.value === "<0.0.0-0" || A.value === "<0.0.0-0")) return !1;
            if (!q.includePrerelease && (this.value.startsWith("<0.0.0") || A.value.startsWith("<0.0.0"))) return !1;
            if (this.operator.startsWith(">") && A.operator.startsWith(">")) return !0;
            if (this.operator.startsWith("<") && A.operator.startsWith("<")) return !0;
            if (this.semver.version === A.semver.version && this.operator.includes("=") && A.operator.includes("=")) return !0;
            if (CHA(this.semver, "<", A.semver, q) && this.operator.startsWith(">") && A.operator.startsWith("<")) return !0;
            if (CHA(this.semver, ">", A.semver, q) && this.operator.startsWith("<") && A.operator.startsWith(">")) return !0;
            return !1
        }
    }
    bN7.exports = ez6;
    var CN7 = nz6(),
        {
            safeRe: SN7,
            t: hN7
        } = zx1(),
        CHA = yN7(),
        SHA = Yx1(),
        IN7 = _D1(),
        xN7 = hHA()
})
// @from(Ln 190751, Col 4)
hHA = R((kn2, QN7) => {
    var f89 = /\s+/g;
    class Hx1 {
        constructor(A, q) {
            if (q = N89(q), A instanceof Hx1)
                if (A.loose === !!q.loose && A.includePrerelease === !!q.includePrerelease) return A;
                else return new Hx1(A.raw, q);
            if (A instanceof IHA) return this.raw = A.value, this.set = [
                [A]
            ], this.formatted = void 0, this;
            if (this.options = q, this.loose = !!q.loose, this.includePrerelease = !!q.includePrerelease, this.raw = A.trim().replace(f89, " "), this.set = this.raw.split("||").map((K) => this.parseRange(K.trim())).filter((K) => K.length), !this.set.length) throw TypeError(`Invalid SemVer Range: ${this.raw}`);
            if (this.set.length > 1) {
                let K = this.set[0];
                if (this.set = this.set.filter((Y) => !mN7(Y[0])), this.set.length === 0) this.set = [K];
                else if (this.set.length > 1) {
                    for (let Y of this.set)
                        if (Y.length === 1 && y89(Y[0])) {
                            this.set = [Y];
                            break
                        }
                }
            }
            this.formatted = void 0
        }
        get range() {
            if (this.formatted === void 0) {
                this.formatted = "";
                for (let A = 0; A < this.set.length; A++) {
                    if (A > 0) this.formatted += "||";
                    let q = this.set[A];
                    for (let K = 0; K < q.length; K++) {
                        if (K > 0) this.formatted += " ";
                        this.formatted += q[K].toString().trim()
                    }
                }
            }
            return this.formatted
        }
        format() {
            return this.range
        }
        toString() {
            return this.range
        }
        parseRange(A) {
            let K = ((this.options.includePrerelease && L89) | (this.options.loose && R89)) + ":" + A,
                Y = BN7.get(K);
            if (Y) return Y;
            let z = this.options.loose,
                w = z ? BV[HZ.HYPHENRANGELOOSE] : BV[HZ.HYPHENRANGE];
            A = A.replace(w, F89(this.options.includePrerelease)), eH("hyphen replace", A), A = A.replace(BV[HZ.COMPARATORTRIM], v89), eH("comparator trim", A), A = A.replace(BV[HZ.TILDETRIM], E89), eH("tilde trim", A), A = A.replace(BV[HZ.CARETTRIM], k89), eH("caret trim", A);
            let H = A.split(" ").map((J) => C89(J, this.options)).join(" ").split(/\s+/).map((J) => m89(J, this.options));
            if (z) H = H.filter((J) => {
                return eH("loose invalid filter", J, this.options), !!J.match(BV[HZ.COMPARATORLOOSE])
            });
            eH("range list", H);
            let $ = new Map,
                O = H.map((J) => new IHA(J, this.options));
            for (let J of O) {
                if (mN7(J)) return [J];
                $.set(J.value, J)
            }
            if ($.size > 1 && $.has("")) $.delete("");
            let _ = [...$.values()];
            return BN7.set(K, _), _
        }
        intersects(A, q) {
            if (!(A instanceof Hx1)) throw TypeError("a Range is required");
            return this.set.some((K) => {
                return FN7(K, q) && A.set.some((Y) => {
                    return FN7(Y, q) && K.every((z) => {
                        return Y.every((w) => {
                            return z.intersects(w, q)
                        })
                    })
                })
            })
        }
        test(A) {
            if (!A) return !1;
            if (typeof A === "string") try {
                A = new T89(A, this.options)
            } catch (q) {
                return !1
            }
            for (let q = 0; q < this.set.length; q++)
                if (Q89(this.set[q], A, this.options)) return !0;
            return !1
        }
    }
    QN7.exports = Hx1;
    var V89 = WN7(),
        BN7 = new V89,
        N89 = nz6(),
        IHA = uN7(),
        eH = Yx1(),
        T89 = _D1(),
        {
            safeRe: BV,
            t: HZ,
            comparatorTrimReplace: v89,
            tildeTrimReplace: E89,
            caretTrimReplace: k89
        } = zx1(),
        {
            FLAG_INCLUDE_PRERELEASE: L89,
            FLAG_LOOSE: R89
        } = iz6(),
        mN7 = (A) => A.value === "<0.0.0-0",
        y89 = (A) => A.value === "",
        FN7 = (A, q) => {
            let K = !0,
                Y = A.slice(),
                z = Y.pop();
            while (K && Y.length) K = Y.every((w) => {
                return z.intersects(w, q)
            }), z = Y.pop();
            return K
        },
        C89 = (A, q) => {
            return eH("comp", A, q), A = I89(A, q), eH("caret", A), A = S89(A, q), eH("tildes", A), A = b89(A, q), eH("xrange", A), A = B89(A, q), eH("stars", A), A
        },
        $Z = (A) => !A || A.toLowerCase() === "x" || A === "*",
        S89 = (A, q) => {
            return A.trim().split(/\s+/).map((K) => h89(K, q)).join(" ")
        },
        h89 = (A, q) => {
            let K = q.loose ? BV[HZ.TILDELOOSE] : BV[HZ.TILDE];
            return A.replace(K, (Y, z, w, H, $) => {
                eH("tilde", A, Y, z, w, H, $);
                let O;
                if ($Z(z)) O = "";
                else if ($Z(w)) O = `>=${z}.0.0 <${+z+1}.0.0-0`;
                else if ($Z(H)) O = `>=${z}.${w}.0 <${z}.${+w+1}.0-0`;
                else if ($) eH("replaceTilde pr", $), O = `>=${z}.${w}.${H}-${$} <${z}.${+w+1}.0-0`;
                else O = `>=${z}.${w}.${H} <${z}.${+w+1}.0-0`;
                return eH("tilde return", O), O
            })
        },
        I89 = (A, q) => {
            return A.trim().split(/\s+/).map((K) => x89(K, q)).join(" ")
        },
        x89 = (A, q) => {
            eH("caret", A, q);
            let K = q.loose ? BV[HZ.CARETLOOSE] : BV[HZ.CARET],
                Y = q.includePrerelease ? "-0" : "";
            return A.replace(K, (z, w, H, $, O) => {
                eH("caret", A, z, w, H, $, O);
                let _;
                if ($Z(w)) _ = "";
                else if ($Z(H)) _ = `>=${w}.0.0${Y} <${+w+1}.0.0-0`;
                else if ($Z($))
                    if (w === "0") _ = `>=${w}.${H}.0${Y} <${w}.${+H+1}.0-0`;
                    else _ = `>=${w}.${H}.0${Y} <${+w+1}.0.0-0`;
                else if (O)
                    if (eH("replaceCaret pr", O), w === "0")
                        if (H === "0") _ = `>=${w}.${H}.${$}-${O} <${w}.${H}.${+$+1}-0`;
                        else _ = `>=${w}.${H}.${$}-${O} <${w}.${+H+1}.0-0`;
                else _ = `>=${w}.${H}.${$}-${O} <${+w+1}.0.0-0`;
                else if (eH("no pr"), w === "0")
                    if (H === "0") _ = `>=${w}.${H}.${$}${Y} <${w}.${H}.${+$+1}-0`;
                    else _ = `>=${w}.${H}.${$}${Y} <${w}.${+H+1}.0-0`;
                else _ = `>=${w}.${H}.${$} <${+w+1}.0.0-0`;
                return eH("caret return", _), _
            })
        },
        b89 = (A, q) => {
            return eH("replaceXRanges", A, q), A.split(/\s+/).map((K) => u89(K, q)).join(" ")
        },
        u89 = (A, q) => {
            A = A.trim();
            let K = q.loose ? BV[HZ.XRANGELOOSE] : BV[HZ.XRANGE];
            return A.replace(K, (Y, z, w, H, $, O) => {
                eH("xRange", A, Y, z, w, H, $, O);
                let _ = $Z(w),
                    J = _ || $Z(H),
                    X = J || $Z($),
                    D = X;
                if (z === "=" && D) z = "";
                if (O = q.includePrerelease ? "-0" : "", _)
                    if (z === ">" || z === "<") Y = "<0.0.0-0";
                    else Y = "*";
                else if (z && D) {
                    if (J) H = 0;
                    if ($ = 0, z === ">")
                        if (z = ">=", J) w = +w + 1, H = 0, $ = 0;
                        else H = +H + 1, $ = 0;
                    else if (z === "<=")
                        if (z = "<", J) w = +w + 1;
                        else H = +H + 1;
                    if (z === "<") O = "-0";
                    Y = `${z+w}.${H}.${$}${O}`
                } else if (J) Y = `>=${w}.0.0${O} <${+w+1}.0.0-0`;
                else if (X) Y = `>=${w}.${H}.0${O} <${w}.${+H+1}.0-0`;
                return eH("xRange return", Y), Y
            })
        },
        B89 = (A, q) => {
            return eH("replaceStars", A, q), A.trim().replace(BV[HZ.STAR], "")
        },
        m89 = (A, q) => {
            return eH("replaceGTE0", A, q), A.trim().replace(BV[q.includePrerelease ? HZ.GTE0PRE : HZ.GTE0], "")
        },
        F89 = (A) => (q, K, Y, z, w, H, $, O, _, J, X, D) => {
            if ($Z(Y)) K = "";
            else if ($Z(z)) K = `>=${Y}.0.0${A?"-0":""}`;
            else if ($Z(w)) K = `>=${Y}.${z}.0${A?"-0":""}`;
            else if (H) K = `>=${K}`;
            else K = `>=${K}${A?"-0":""}`;
            if ($Z(_)) O = "";
            else if ($Z(J)) O = `<${+_+1}.0.0-0`;
            else if ($Z(X)) O = `<${_}.${+J+1}.0-0`;
            else if (D) O = `<=${_}.${J}.${X}-${D}`;
            else if (A) O = `<${_}.${J}.${+X+1}-0`;
            else O = `<=${O}`;
            return `${K} ${O}`.trim()
        },
        Q89 = (A, q, K) => {
            for (let Y = 0; Y < A.length; Y++)
                if (!A[Y].test(q)) return !1;
            if (q.prerelease.length && !K.includePrerelease) {
                for (let Y = 0; Y < A.length; Y++) {
                    if (eH(A[Y].semver), A[Y].semver === IHA.ANY) continue;
                    if (A[Y].semver.prerelease.length > 0) {
                        let z = A[Y].semver;
                        if (z.major === q.major && z.minor === q.minor && z.patch === q.patch) return !0
                    }
                }
                return !1
            }
            return !0
        }
})
// @from(Ln 190984, Col 4)
UN7 = R((Ln2, gN7) => {
    var g89 = hHA(),
        U89 = (A, q, K) => {
            try {
                q = new g89(q, K)
            } catch (Y) {
                return !1
            }
            return q.test(A)
        };
    gN7.exports = U89
})
// @from(Ln 190996, Col 4)
xHA = R((Rn2, p89) => {
    p89.exports = {
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
// @from(Ln 191105, Col 4)
uHA = R((yn2, sN7) => {
    var {
        spawnSync: A26
    } = h1("node:child_process"), {
        createHash: d89
    } = h1("node:crypto"), lN7 = JN7(), c89 = yHA(), l89 = UN7(), pN7 = lz6(), {
        config: i89,
        engines: dN7,
        optionalDependencies: n89
    } = xHA(), r89 = process.env.npm_package_config_libvips || i89.libvips, iN7 = lN7(r89).version, o89 = ["darwin-arm64", "darwin-x64", "linux-arm", "linux-arm64", "linux-s390x", "linux-x64", "linuxmusl-arm64", "linuxmusl-x64", "win32-ia32", "win32-x64"], q26 = {
        encoding: "utf8",
        shell: !0
    }, a89 = (A) => {
        if (A instanceof Error) console.error(`sharp: Installation error: ${A.message}`);
        else console.log(`sharp: ${A}`)
    }, nN7 = () => pN7.isNonGlibcLinuxSync() ? pN7.familySync() : "", s89 = () => `${process.platform}${nN7()}-${process.arch}`, JD1 = () => {
        if (rN7()) return "wasm32";
        let {
            npm_config_arch: A,
            npm_config_platform: q,
            npm_config_libc: K
        } = process.env, Y = typeof K === "string" ? K : nN7();
        return `${q||process.platform}${Y}-${A||process.arch}`
    }, t89 = () => {
        try {
            return h1(`@img/sharp-libvips-dev-${JD1()}/include`)
        } catch {
            try {
                return (() => {
                    throw new Error("Cannot require module " + "@img/sharp-libvips-dev/include");
                })()
            } catch {}
        }
        return ""
    }, e89 = () => {
        try {
            return (() => {
                throw new Error("Cannot require module " + "@img/sharp-libvips-dev/cplusplus");
            })()
        } catch {}
        return ""
    }, A79 = () => {
        try {
            return h1(`@img/sharp-libvips-dev-${JD1()}/lib`)
        } catch {
            try {
                return h1(`@img/sharp-libvips-${JD1()}/lib`)
            } catch {}
        }
        return ""
    }, q79 = () => {
        if (process.release?.name === "node" && process.versions) {
            if (!l89(process.versions.node, dN7.node)) return {
                found: process.versions.node,
                expected: dN7.node
            }
        }
    }, rN7 = () => {
        let {
            CC: A
        } = process.env;
        return Boolean(A && A.endsWith("/emcc"))
    }, K79 = () => {
        if (process.platform === "darwin" && process.arch === "x64") return (A26("sysctl sysctl.proc_translated", q26).stdout || "").trim() === "sysctl.proc_translated: 1";
        return !1
    }, cN7 = (A) => d89("sha512").update(A).digest("hex"), Y79 = () => {
        try {
            let A = cN7(`imgsharp-libvips-${JD1()}`),
                q = lN7(n89[`@img/sharp-libvips-${JD1()}`]).version;
            return cN7(`${A}npm:${q}`).slice(0, 10)
        } catch {}
        return ""
    }, z79 = () => A26(`node-gyp rebuild --directory=src ${rN7()?"--nodedir=emscripten":""}`, {
        ...q26,
        stdio: "inherit"
    }).status, oN7 = () => {
        if (process.platform !== "win32") return (A26("pkg-config --modversion vips-cpp", {
            ...q26,
            env: {
                ...process.env,
                PKG_CONFIG_PATH: aN7()
            }
        }).stdout || "").trim();
        else return ""
    }, aN7 = () => {
        if (process.platform !== "win32") return [(A26('which brew >/dev/null 2>&1 && brew environment --plain | grep PKG_CONFIG_LIBDIR | cut -d" " -f2', q26).stdout || "").trim(), process.env.PKG_CONFIG_PATH, "/usr/local/lib/pkgconfig", "/usr/lib/pkgconfig", "/usr/local/libdata/pkgconfig", "/usr/libdata/pkgconfig"].filter(Boolean).join(":");
        else return ""
    }, bHA = (A, q, K) => {
        if (K) K(`Detected ${q}, skipping search for globally-installed libvips`);
        return A
    }, w79 = (A) => {
        if (Boolean(process.env.SHARP_IGNORE_GLOBAL_LIBVIPS) === !0) return bHA(!1, "SHARP_IGNORE_GLOBAL_LIBVIPS", A);
        if (Boolean(process.env.SHARP_FORCE_GLOBAL_LIBVIPS) === !0) return bHA(!0, "SHARP_FORCE_GLOBAL_LIBVIPS", A);
        if (K79()) return bHA(!1, "Rosetta", A);
        let q = oN7();
        return !!q && c89(q, iN7)
    };
    sN7.exports = {
        minimumLibvipsVersion: iN7,
        prebuiltPlatforms: o89,
        buildPlatformArch: JD1,
        buildSharpLibvipsIncludeDir: t89,
        buildSharpLibvipsCPlusPlusDir: e89,
        buildSharpLibvipsLibDir: A79,
        isUnsupportedNodeRuntime: q79,
        runtimePlatformArch: s89,
        log: a89,
        yarnLocator: Y79,
        spawnRebuild: z79,
        globalLibvipsVersion: oN7,
        pkgConfigPath: aN7,
        useGlobalLibvips: w79
    }
})
// @from(Ln 191219, Col 4)
$x1 = R((Sn2, eN7) => {
    var {
        familySync: H79,
        versionSync: $79
    } = lz6(), {
        runtimePlatformArch: O79,
        isUnsupportedNodeRuntime: tN7,
        prebuiltPlatforms: _79,
        minimumLibvipsVersion: J79
    } = uHA(), s41 = O79(), X79 = [`../src/build/Release/sharp-${s41}.node`, "../src/build/Release/sharp-wasm32.node", `@img/sharp-${s41}/sharp.node`, "@img/sharp-wasm32/sharp.node"], BHA, K26 = [];
    for (let A of X79) try {
        BHA = h1(A);
        break
    } catch (q) {
        K26.push(q)
    }
    if (BHA) eN7.exports = BHA;
    else {
        let [A, q, K] = ["linux", "darwin", "win32"].map((w) => s41.startsWith(w)), Y = [`Could not load the "sharp" module using the ${s41} runtime`];
        K26.forEach((w) => {
            if (w.code !== "MODULE_NOT_FOUND") Y.push(`${w.code}: ${w.message}`)
        });
        let z = K26.map((w) => w.message).join(" ");
        if (Y.push("Possible solutions:"), tN7()) {
            let {
                found: w,
                expected: H
            } = tN7();
            Y.push("- Please upgrade Node.js:", `    Found ${w}`, `    Requires ${H}`)
        } else if (_79.includes(s41)) {
            let [w, H] = s41.split("-"), $ = w.endsWith("musl") ? " --libc=musl" : "";
            Y.push("- Ensure optional dependencies can be installed:", "    npm install --include=optional sharp", "- Ensure your package manager supports multi-platform installation:", "    See https://sharp.pixelplumbing.com/install#cross-platform", "- Add platform-specific dependencies:", `    npm install --os=${w.replace("musl","")}${$} --cpu=${H} sharp`)
        } else Y.push(`- Manually install libvips >= ${J79}`, "- Add experimental WebAssembly-based dependencies:", "    npm install --cpu=wasm32 sharp", "    npm install @img/sharp-wasm32");
        if (A && /(symbol not found|CXXABI_)/i.test(z)) try {
            let {
                config: w
            } = h1(`@img/sharp-libvips-${s41}/package`), H = `${H79()} ${$79()}`, $ = `${w.musl?"musl":"glibc"} ${w.musl||w.glibc}`;
            Y.push("- Update your OS:", `    Found ${H}`, `    Requires ${$}`)
        } catch (w) {}
        if (A && /\/snap\/core[0-9]{2}/.test(z)) Y.push("- Remove the Node.js Snap, which does not support native modules", "    snap remove node");
        if (q && /Incompatible library version/.test(z)) Y.push("- Update Homebrew:", "    brew update && brew upgrade vips");
        if (K26.some((w) => w.code === "ERR_DLOPEN_DISABLED")) Y.push("- Run Node.js without using the --no-addons flag");
        if (K && /The specified procedure could not be found/.test(z)) Y.push("- Using the canvas package on Windows?", "    See https://sharp.pixelplumbing.com/install#canvas-and-windows", "- Check for outdated versions of sharp in the dependency tree:", "    npm ls sharp");
        throw Y.push("- Consult the installation documentation:", "    See https://sharp.pixelplumbing.com/install"), Error(Y.join(`
`))
    }
})
// @from(Ln 191266, Col 4)
qT7 = R((In2, AT7) => {
    var D79 = h1("node:util"),
        mHA = h1("node:stream"),
        j79 = ru();
    $x1();
    var M79 = D79.debuglog("sharp"),
        t41 = function(A, q) {
            if (arguments.length === 1 && !j79.defined(A)) throw Error("Invalid input");
            if (!(this instanceof t41)) return new t41(A, q);
            return mHA.Duplex.call(this), this.options = {
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
                debuglog: (K) => {
                    this.emit("warning", K), M79(K)
                },
                queueListener: function(K) {
                    t41.queue.emit("change", K)
                }
            }, this.options.input = this._createInputDescriptor(A, q, {
                allowStream: !0
            }), this
        };
    Object.setPrototypeOf(t41.prototype, mHA.Duplex.prototype);
    Object.setPrototypeOf(t41, mHA.Duplex);

    function P79() {
        let A = this.constructor.call(),
            {
                debuglog: q,
                queueListener: K,
                ...Y
            } = this.options;
        if (A.options = structuredClone(Y), A.options.debuglog = q, A.options.queueListener = K, this._isStreamInput()) this.on("finish", () => {
            this._flattenBufferIn(), A.options.input.buffer = this.options.input.buffer, A.emit("finish")
        });
        return A
    }
    Object.assign(t41.prototype, {
        clone: P79
    });
    AT7.exports = t41
})
// @from(Ln 191471, Col 4)
FHA = R((xn2, KT7) => {
    KT7.exports = {
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
// @from(Ln 191623, Col 4)
zT7 = R((bn2, YT7) => {
    YT7.exports = function(q) {
        if (!q || typeof q === "string") return !1;
        return q instanceof Array || Array.isArray(q) || q.length >= 0 && (q.splice instanceof Function || Object.getOwnPropertyDescriptor(q, q.length - 1) && q.constructor.name !== "String")
    }
})
// @from(Ln 191629, Col 4)
$T7 = R((un2, HT7) => {
    var W79 = zT7(),
        G79 = Array.prototype.concat,
        Z79 = Array.prototype.slice,
        wT7 = HT7.exports = function(q) {
            var K = [];
            for (var Y = 0, z = q.length; Y < z; Y++) {
                var w = q[Y];
                if (W79(w)) K = G79.call(K, Z79.call(w));
                else K.push(w)
            }
            return K
        };
    wT7.wrap = function(A) {
        return function() {
            return A(wT7(arguments))
        }
    }
})
// @from(Ln 191648, Col 4)
XT7 = R((Bn2, JT7) => {
    var _x1 = FHA(),
        Jx1 = $T7(),
        OT7 = Object.hasOwnProperty,
        _T7 = Object.create(null);
    for (Ox1 in _x1)
        if (OT7.call(_x1, Ox1)) _T7[_x1[Ox1]] = Ox1;
    var Ox1, Wv = JT7.exports = {
        to: {},
        get: {}
    };
    Wv.get = function(A) {
        var q = A.substring(0, 3).toLowerCase(),
            K, Y;
        switch (q) {
            case "hsl":
                K = Wv.get.hsl(A), Y = "hsl";
                break;
            case "hwb":
                K = Wv.get.hwb(A), Y = "hwb";
                break;
            default:
                K = Wv.get.rgb(A), Y = "rgb";
                break
        }
        if (!K) return null;
        return {
            model: Y,
            value: K
        }
    };
    Wv.get.rgb = function(A) {
        if (!A) return null;
        var q = /^#([a-f0-9]{3,4})$/i,
            K = /^#([a-f0-9]{6})([a-f0-9]{2})?$/i,
            Y = /^rgba?\(\s*([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)\s*(?:[,|\/]\s*([+-]?[\d\.]+)(%?)\s*)?\)$/,
            z = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,?\s*([+-]?[\d\.]+)\%\s*,?\s*([+-]?[\d\.]+)\%\s*(?:[,|\/]\s*([+-]?[\d\.]+)(%?)\s*)?\)$/,
            w = /^(\w+)$/,
            H = [0, 0, 0, 1],
            $, O, _;
        if ($ = A.match(K)) {
            _ = $[2], $ = $[1];
            for (O = 0; O < 3; O++) {
                var J = O * 2;
                H[O] = parseInt($.slice(J, J + 2), 16)
            }
            if (_) H[3] = parseInt(_, 16) / 255
        } else if ($ = A.match(q)) {
            $ = $[1], _ = $[3];
            for (O = 0; O < 3; O++) H[O] = parseInt($[O] + $[O], 16);
            if (_) H[3] = parseInt(_ + _, 16) / 255
        } else if ($ = A.match(Y)) {
            for (O = 0; O < 3; O++) H[O] = parseInt($[O + 1], 0);
            if ($[4])
                if ($[5]) H[3] = parseFloat($[4]) * 0.01;
                else H[3] = parseFloat($[4])
        } else if ($ = A.match(z)) {
            for (O = 0; O < 3; O++) H[O] = Math.round(parseFloat($[O + 1]) * 2.55);
            if ($[4])
                if ($[5]) H[3] = parseFloat($[4]) * 0.01;
                else H[3] = parseFloat($[4])
        } else if ($ = A.match(w)) {
            if ($[1] === "transparent") return [0, 0, 0, 0];
            if (!OT7.call(_x1, $[1])) return null;
            return H = _x1[$[1]], H[3] = 1, H
        } else return null;
        for (O = 0; O < 3; O++) H[O] = yo(H[O], 0, 255);
        return H[3] = yo(H[3], 0, 1), H
    };
    Wv.get.hsl = function(A) {
        if (!A) return null;
        var q = /^hsla?\(\s*([+-]?(?:\d{0,3}\.)?\d+)(?:deg)?\s*,?\s*([+-]?[\d\.]+)%\s*,?\s*([+-]?[\d\.]+)%\s*(?:[,|\/]\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/,
            K = A.match(q);
        if (K) {
            var Y = parseFloat(K[4]),
                z = (parseFloat(K[1]) % 360 + 360) % 360,
                w = yo(parseFloat(K[2]), 0, 100),
                H = yo(parseFloat(K[3]), 0, 100),
                $ = yo(isNaN(Y) ? 1 : Y, 0, 1);
            return [z, w, H, $]
        }
        return null
    };
    Wv.get.hwb = function(A) {
        if (!A) return null;
        var q = /^hwb\(\s*([+-]?\d{0,3}(?:\.\d+)?)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/,
            K = A.match(q);
        if (K) {
            var Y = parseFloat(K[4]),
                z = (parseFloat(K[1]) % 360 + 360) % 360,
                w = yo(parseFloat(K[2]), 0, 100),
                H = yo(parseFloat(K[3]), 0, 100),
                $ = yo(isNaN(Y) ? 1 : Y, 0, 1);
            return [z, w, H, $]
        }
        return null
    };
    Wv.to.hex = function() {
        var A = Jx1(arguments);
        return "#" + Y26(A[0]) + Y26(A[1]) + Y26(A[2]) + (A[3] < 1 ? Y26(Math.round(A[3] * 255)) : "")
    };
    Wv.to.rgb = function() {
        var A = Jx1(arguments);
        return A.length < 4 || A[3] === 1 ? "rgb(" + Math.round(A[0]) + ", " + Math.round(A[1]) + ", " + Math.round(A[2]) + ")" : "rgba(" + Math.round(A[0]) + ", " + Math.round(A[1]) + ", " + Math.round(A[2]) + ", " + A[3] + ")"
    };
    Wv.to.rgb.percent = function() {
        var A = Jx1(arguments),
            q = Math.round(A[0] / 255 * 100),
            K = Math.round(A[1] / 255 * 100),
            Y = Math.round(A[2] / 255 * 100);
        return A.length < 4 || A[3] === 1 ? "rgb(" + q + "%, " + K + "%, " + Y + "%)" : "rgba(" + q + "%, " + K + "%, " + Y + "%, " + A[3] + ")"
    };
    Wv.to.hsl = function() {
        var A = Jx1(arguments);
        return A.length < 4 || A[3] === 1 ? "hsl(" + A[0] + ", " + A[1] + "%, " + A[2] + "%)" : "hsla(" + A[0] + ", " + A[1] + "%, " + A[2] + "%, " + A[3] + ")"
    };
    Wv.to.hwb = function() {
        var A = Jx1(arguments),
            q = "";
        if (A.length >= 4 && A[3] !== 1) q = ", " + A[3];
        return "hwb(" + A[0] + ", " + A[1] + "%, " + A[2] + "%" + q + ")"
    };
    Wv.to.keyword = function(A) {
        return _T7[A.slice(0, 3)]
    };

    function yo(A, q, K) {
        return Math.min(Math.max(q, A), K)
    }

    function Y26(A) {
        var q = Math.round(A).toString(16).toUpperCase();
        return q.length < 2 ? "0" + q : q
    }
})
// @from(Ln 191783, Col 4)
QHA = R((mn2, jT7) => {
    var Xx1 = FHA(),
        DT7 = {};
    for (let A of Object.keys(Xx1)) DT7[Xx1[A]] = A;
    var Xq = {
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
    jT7.exports = Xq;
    for (let A of Object.keys(Xq)) {
        if (!("channels" in Xq[A])) throw Error("missing channels property: " + A);
        if (!("labels" in Xq[A])) throw Error("missing channel labels property: " + A);
        if (Xq[A].labels.length !== Xq[A].channels) throw Error("channel and label counts mismatch: " + A);
        let {
            channels: q,
            labels: K
        } = Xq[A];
        delete Xq[A].channels, delete Xq[A].labels, Object.defineProperty(Xq[A], "channels", {
            value: q
        }), Object.defineProperty(Xq[A], "labels", {
            value: K
        })
    }
    Xq.rgb.hsl = function(A) {
        let q = A[0] / 255,
            K = A[1] / 255,
            Y = A[2] / 255,
            z = Math.min(q, K, Y),
            w = Math.max(q, K, Y),
            H = w - z,
            $, O;
        if (w === z) $ = 0;
        else if (q === w) $ = (K - Y) / H;
        else if (K === w) $ = 2 + (Y - q) / H;
        else if (Y === w) $ = 4 + (q - K) / H;
        if ($ = Math.min($ * 60, 360), $ < 0) $ += 360;
        let _ = (z + w) / 2;
        if (w === z) O = 0;
        else if (_ <= 0.5) O = H / (w + z);
        else O = H / (2 - w - z);
        return [$, O * 100, _ * 100]
    };
    Xq.rgb.hsv = function(A) {
        let q, K, Y, z, w, H = A[0] / 255,
            $ = A[1] / 255,
            O = A[2] / 255,
            _ = Math.max(H, $, O),
            J = _ - Math.min(H, $, O),
            X = function(D) {
                return (_ - D) / 6 / J + 0.5
            };
        if (J === 0) z = 0, w = 0;
        else {
            if (w = J / _, q = X(H), K = X($), Y = X(O), H === _) z = Y - K;
            else if ($ === _) z = 0.3333333333333333 + q - Y;
            else if (O === _) z = 0.6666666666666666 + K - q;
            if (z < 0) z += 1;
            else if (z > 1) z -= 1
        }
        return [z * 360, w * 100, _ * 100]
    };
    Xq.rgb.hwb = function(A) {
        let q = A[0],
            K = A[1],
            Y = A[2],
            z = Xq.rgb.hsl(A)[0],
            w = 0.00392156862745098 * Math.min(q, Math.min(K, Y));
        return Y = 1 - 0.00392156862745098 * Math.max(q, Math.max(K, Y)), [z, w * 100, Y * 100]
    };
    Xq.rgb.cmyk = function(A) {
        let q = A[0] / 255,
            K = A[1] / 255,
            Y = A[2] / 255,
            z = Math.min(1 - q, 1 - K, 1 - Y),
            w = (1 - q - z) / (1 - z) || 0,
            H = (1 - K - z) / (1 - z) || 0,
            $ = (1 - Y - z) / (1 - z) || 0;
        return [w * 100, H * 100, $ * 100, z * 100]
    };

    function f79(A, q) {
        return (A[0] - q[0]) ** 2 + (A[1] - q[1]) ** 2 + (A[2] - q[2]) ** 2
    }
    Xq.rgb.keyword = function(A) {
        let q = DT7[A];
        if (q) return q;
        let K = 1 / 0,
            Y;
        for (let z of Object.keys(Xx1)) {
            let w = Xx1[z],
                H = f79(A, w);
            if (H < K) K = H, Y = z
        }
        return Y
    };
    Xq.keyword.rgb = function(A) {
        return Xx1[A]
    };
    Xq.rgb.xyz = function(A) {
        let q = A[0] / 255,
            K = A[1] / 255,
            Y = A[2] / 255;
        q = q > 0.04045 ? ((q + 0.055) / 1.055) ** 2.4 : q / 12.92, K = K > 0.04045 ? ((K + 0.055) / 1.055) ** 2.4 : K / 12.92, Y = Y > 0.04045 ? ((Y + 0.055) / 1.055) ** 2.4 : Y / 12.92;
        let z = q * 0.4124 + K * 0.3576 + Y * 0.1805,
            w = q * 0.2126 + K * 0.7152 + Y * 0.0722,
            H = q * 0.0193 + K * 0.1192 + Y * 0.9505;
        return [z * 100, w * 100, H * 100]
    };
    Xq.rgb.lab = function(A) {
        let q = Xq.rgb.xyz(A),
            K = q[0],
            Y = q[1],
            z = q[2];
        K /= 95.047, Y /= 100, z /= 108.883, K = K > 0.008856 ? K ** 0.3333333333333333 : 7.787 * K + 0.13793103448275862, Y = Y > 0.008856 ? Y ** 0.3333333333333333 : 7.787 * Y + 0.13793103448275862, z = z > 0.008856 ? z ** 0.3333333333333333 : 7.787 * z + 0.13793103448275862;
        let w = 116 * Y - 16,
            H = 500 * (K - Y),
            $ = 200 * (Y - z);
        return [w, H, $]
    };
    Xq.hsl.rgb = function(A) {
        let q = A[0] / 360,
            K = A[1] / 100,
            Y = A[2] / 100,
            z, w, H;
        if (K === 0) return H = Y * 255, [H, H, H];
        if (Y < 0.5) z = Y * (1 + K);
        else z = Y + K - Y * K;
        let $ = 2 * Y - z,
            O = [0, 0, 0];
        for (let _ = 0; _ < 3; _++) {
            if (w = q + 0.3333333333333333 * -(_ - 1), w < 0) w++;
            if (w > 1) w--;
            if (6 * w < 1) H = $ + (z - $) * 6 * w;
            else if (2 * w < 1) H = z;
            else if (3 * w < 2) H = $ + (z - $) * (0.6666666666666666 - w) * 6;
            else H = $;
            O[_] = H * 255
        }
        return O
    };
    Xq.hsl.hsv = function(A) {
        let q = A[0],
            K = A[1] / 100,
            Y = A[2] / 100,
            z = K,
            w = Math.max(Y, 0.01);
        Y *= 2, K *= Y <= 1 ? Y : 2 - Y, z *= w <= 1 ? w : 2 - w;
        let H = (Y + K) / 2,
            $ = Y === 0 ? 2 * z / (w + z) : 2 * K / (Y + K);
        return [q, $ * 100, H * 100]
    };
    Xq.hsv.rgb = function(A) {
        let q = A[0] / 60,
            K = A[1] / 100,
            Y = A[2] / 100,
            z = Math.floor(q) % 6,
            w = q - Math.floor(q),
            H = 255 * Y * (1 - K),
            $ = 255 * Y * (1 - K * w),
            O = 255 * Y * (1 - K * (1 - w));
        switch (Y *= 255, z) {
            case 0:
                return [Y, O, H];
            case 1:
                return [$, Y, H];
            case 2:
                return [H, Y, O];
            case 3:
                return [H, $, Y];
            case 4:
                return [O, H, Y];
            case 5:
                return [Y, H, $]
        }
    };
    Xq.hsv.hsl = function(A) {
        let q = A[0],
            K = A[1] / 100,
            Y = A[2] / 100,
            z = Math.max(Y, 0.01),
            w, H;
        H = (2 - K) * Y;
        let $ = (2 - K) * z;
        return w = K * z, w /= $ <= 1 ? $ : 2 - $, w = w || 0, H /= 2, [q, w * 100, H * 100]
    };
    Xq.hwb.rgb = function(A) {
        let q = A[0] / 360,
            K = A[1] / 100,
            Y = A[2] / 100,
            z = K + Y,
            w;
        if (z > 1) K /= z, Y /= z;
        let H = Math.floor(6 * q),
            $ = 1 - Y;
        if (w = 6 * q - H, (H & 1) !== 0) w = 1 - w;
        let O = K + w * ($ - K),
            _, J, X;
        switch (H) {
            default:
            case 6:
            case 0:
                _ = $, J = O, X = K;
                break;
            case 1:
                _ = O, J = $, X = K;
                break;
            case 2:
                _ = K, J = $, X = O;
                break;
            case 3:
                _ = K, J = O, X = $;
                break;
            case 4:
                _ = O, J = K, X = $;
                break;
            case 5:
                _ = $, J = K, X = O;
                break
        }
        return [_ * 255, J * 255, X * 255]
    };
    Xq.cmyk.rgb = function(A) {
        let q = A[0] / 100,
            K = A[1] / 100,
            Y = A[2] / 100,
            z = A[3] / 100,
            w = 1 - Math.min(1, q * (1 - z) + z),
            H = 1 - Math.min(1, K * (1 - z) + z),
            $ = 1 - Math.min(1, Y * (1 - z) + z);
        return [w * 255, H * 255, $ * 255]
    };
    Xq.xyz.rgb = function(A) {
        let q = A[0] / 100,
            K = A[1] / 100,
            Y = A[2] / 100,
            z, w, H;
        return z = q * 3.2406 + K * -1.5372 + Y * -0.4986, w = q * -0.9689 + K * 1.8758 + Y * 0.0415, H = q * 0.0557 + K * -0.204 + Y * 1.057, z = z > 0.0031308 ? 1.055 * z ** 0.4166666666666667 - 0.055 : z * 12.92, w = w > 0.0031308 ? 1.055 * w ** 0.4166666666666667 - 0.055 : w * 12.92, H = H > 0.0031308 ? 1.055 * H ** 0.4166666666666667 - 0.055 : H * 12.92, z = Math.min(Math.max(0, z), 1), w = Math.min(Math.max(0, w), 1), H = Math.min(Math.max(0, H), 1), [z * 255, w * 255, H * 255]
    };
    Xq.xyz.lab = function(A) {
        let q = A[0],
            K = A[1],
            Y = A[2];
        q /= 95.047, K /= 100, Y /= 108.883, q = q > 0.008856 ? q ** 0.3333333333333333 : 7.787 * q + 0.13793103448275862, K = K > 0.008856 ? K ** 0.3333333333333333 : 7.787 * K + 0.13793103448275862, Y = Y > 0.008856 ? Y ** 0.3333333333333333 : 7.787 * Y + 0.13793103448275862;
        let z = 116 * K - 16,
            w = 500 * (q - K),
            H = 200 * (K - Y);
        return [z, w, H]
    };
    Xq.lab.xyz = function(A) {
        let q = A[0],
            K = A[1],
            Y = A[2],
            z, w, H;
        w = (q + 16) / 116, z = K / 500 + w, H = w - Y / 200;
        let $ = w ** 3,
            O = z ** 3,
            _ = H ** 3;
        return w = $ > 0.008856 ? $ : (w - 0.13793103448275862) / 7.787, z = O > 0.008856 ? O : (z - 0.13793103448275862) / 7.787, H = _ > 0.008856 ? _ : (H - 0.13793103448275862) / 7.787, z *= 95.047, w *= 100, H *= 108.883, [z, w, H]
    };
    Xq.lab.lch = function(A) {
        let q = A[0],
            K = A[1],
            Y = A[2],
            z;
        if (z = Math.atan2(Y, K) * 360 / 2 / Math.PI, z < 0) z += 360;
        let H = Math.sqrt(K * K + Y * Y);
        return [q, H, z]
    };
    Xq.lch.lab = function(A) {
        let q = A[0],
            K = A[1],
            z = A[2] / 360 * 2 * Math.PI,
            w = K * Math.cos(z),
            H = K * Math.sin(z);
        return [q, w, H]
    };
    Xq.rgb.ansi16 = function(A, q = null) {
        let [K, Y, z] = A, w = q === null ? Xq.rgb.hsv(A)[2] : q;
        if (w = Math.round(w / 50), w === 0) return 30;
        let H = 30 + (Math.round(z / 255) << 2 | Math.round(Y / 255) << 1 | Math.round(K / 255));
        if (w === 2) H += 60;
        return H
    };
    Xq.hsv.ansi16 = function(A) {
        return Xq.rgb.ansi16(Xq.hsv.rgb(A), A[2])
    };
    Xq.rgb.ansi256 = function(A) {
        let q = A[0],
            K = A[1],
            Y = A[2];
        if (q === K && K === Y) {
            if (q < 8) return 16;
            if (q > 248) return 231;
            return Math.round((q - 8) / 247 * 24) + 232
        }
        return 16 + 36 * Math.round(q / 255 * 5) + 6 * Math.round(K / 255 * 5) + Math.round(Y / 255 * 5)
    };
    Xq.ansi16.rgb = function(A) {
        let q = A % 10;
        if (q === 0 || q === 7) {
            if (A > 50) q += 3.5;
            return q = q / 10.5 * 255, [q, q, q]
        }
        let K = (~~(A > 50) + 1) * 0.5,
            Y = (q & 1) * K * 255,
            z = (q >> 1 & 1) * K * 255,
            w = (q >> 2 & 1) * K * 255;
        return [Y, z, w]
    };
    Xq.ansi256.rgb = function(A) {
        if (A >= 232) {
            let w = (A - 232) * 10 + 8;
            return [w, w, w]
        }
        A -= 16;
        let q, K = Math.floor(A / 36) / 5 * 255,
            Y = Math.floor((q = A % 36) / 6) / 5 * 255,
            z = q % 6 / 5 * 255;
        return [K, Y, z]
    };
    Xq.rgb.hex = function(A) {
        let K = (((Math.round(A[0]) & 255) << 16) + ((Math.round(A[1]) & 255) << 8) + (Math.round(A[2]) & 255)).toString(16).toUpperCase();
        return "000000".substring(K.length) + K
    };
    Xq.hex.rgb = function(A) {
        let q = A.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
        if (!q) return [0, 0, 0];
        let K = q[0];
        if (q[0].length === 3) K = K.split("").map(($) => {
            return $ + $
        }).join("");
        let Y = parseInt(K, 16),
            z = Y >> 16 & 255,
            w = Y >> 8 & 255,
            H = Y & 255;
        return [z, w, H]
    };
    Xq.rgb.hcg = function(A) {
        let q = A[0] / 255,
            K = A[1] / 255,
            Y = A[2] / 255,
            z = Math.max(Math.max(q, K), Y),
            w = Math.min(Math.min(q, K), Y),
            H = z - w,
            $, O;
        if (H < 1) $ = w / (1 - H);
        else $ = 0;
        if (H <= 0) O = 0;
        else if (z === q) O = (K - Y) / H % 6;
        else if (z === K) O = 2 + (Y - q) / H;
        else O = 4 + (q - K) / H;
        return O /= 6, O %= 1, [O * 360, H * 100, $ * 100]
    };
    Xq.hsl.hcg = function(A) {
        let q = A[1] / 100,
            K = A[2] / 100,
            Y = K < 0.5 ? 2 * q * K : 2 * q * (1 - K),
            z = 0;
        if (Y < 1) z = (K - 0.5 * Y) / (1 - Y);
        return [A[0], Y * 100, z * 100]
    };
    Xq.hsv.hcg = function(A) {
        let q = A[1] / 100,
            K = A[2] / 100,
            Y = q * K,
            z = 0;
        if (Y < 1) z = (K - Y) / (1 - Y);
        return [A[0], Y * 100, z * 100]
    };
    Xq.hcg.rgb = function(A) {
        let q = A[0] / 360,
            K = A[1] / 100,
            Y = A[2] / 100;
        if (K === 0) return [Y * 255, Y * 255, Y * 255];
        let z = [0, 0, 0],
            w = q % 1 * 6,
            H = w % 1,
            $ = 1 - H,
            O = 0;
        switch (Math.floor(w)) {
            case 0:
                z[0] = 1, z[1] = H, z[2] = 0;
                break;
            case 1:
                z[0] = $, z[1] = 1, z[2] = 0;
                break;
            case 2:
                z[0] = 0, z[1] = 1, z[2] = H;
                break;
            case 3:
                z[0] = 0, z[1] = $, z[2] = 1;
                break;
            case 4:
                z[0] = H, z[1] = 0, z[2] = 1;
                break;
            default:
                z[0] = 1, z[1] = 0, z[2] = $
        }
        return O = (1 - K) * Y, [(K * z[0] + O) * 255, (K * z[1] + O) * 255, (K * z[2] + O) * 255]
    };
    Xq.hcg.hsv = function(A) {
        let q = A[1] / 100,
            K = A[2] / 100,
            Y = q + K * (1 - q),
            z = 0;
        if (Y > 0) z = q / Y;
        return [A[0], z * 100, Y * 100]
    };
    Xq.hcg.hsl = function(A) {
        let q = A[1] / 100,
            Y = A[2] / 100 * (1 - q) + 0.5 * q,
            z = 0;
        if (Y > 0 && Y < 0.5) z = q / (2 * Y);
        else if (Y >= 0.5 && Y < 1) z = q / (2 * (1 - Y));
        return [A[0], z * 100, Y * 100]
    };
    Xq.hcg.hwb = function(A) {
        let q = A[1] / 100,
            K = A[2] / 100,
            Y = q + K * (1 - q);
        return [A[0], (Y - q) * 100, (1 - Y) * 100]
    };
    Xq.hwb.hcg = function(A) {
        let q = A[1] / 100,
            Y = 1 - A[2] / 100,
            z = Y - q,
            w = 0;
        if (z < 1) w = (Y - z) / (1 - z);
        return [A[0], z * 100, w * 100]
    };
    Xq.apple.rgb = function(A) {
        return [A[0] / 65535 * 255, A[1] / 65535 * 255, A[2] / 65535 * 255]
    };
    Xq.rgb.apple = function(A) {
        return [A[0] / 255 * 65535, A[1] / 255 * 65535, A[2] / 255 * 65535]
    };
    Xq.gray.rgb = function(A) {
        return [A[0] / 100 * 255, A[0] / 100 * 255, A[0] / 100 * 255]
    };
    Xq.gray.hsl = function(A) {
        return [0, 0, A[0]]
    };
    Xq.gray.hsv = Xq.gray.hsl;
    Xq.gray.hwb = function(A) {
        return [0, 100, A[0]]
    };
    Xq.gray.cmyk = function(A) {
        return [0, 0, 0, A[0]]
    };
    Xq.gray.lab = function(A) {
        return [A[0], 0, 0]
    };
    Xq.gray.hex = function(A) {
        let q = Math.round(A[0] / 100 * 255) & 255,
            Y = ((q << 16) + (q << 8) + q).toString(16).toUpperCase();
        return "000000".substring(Y.length) + Y
    };
    Xq.rgb.gray = function(A) {
        return [(A[0] + A[1] + A[2]) / 3 / 255 * 100]
    }
})
// @from(Ln 192302, Col 4)
PT7 = R((Fn2, MT7) => {
    var z26 = QHA();

    function V79() {
        let A = {},
            q = Object.keys(z26);
        for (let K = q.length, Y = 0; Y < K; Y++) A[q[Y]] = {
            distance: -1,
            parent: null
        };
        return A
    }

    function N79(A) {
        let q = V79(),
            K = [A];
        q[A].distance = 0;
        while (K.length) {
            let Y = K.pop(),
                z = Object.keys(z26[Y]);
            for (let w = z.length, H = 0; H < w; H++) {
                let $ = z[H],
                    O = q[$];
                if (O.distance === -1) O.distance = q[Y].distance + 1, O.parent = Y, K.unshift($)
            }
        }
        return q
    }

    function T79(A, q) {
        return function(K) {
            return q(A(K))
        }
    }

    function v79(A, q) {
        let K = [q[A].parent, A],
            Y = z26[q[A].parent][A],
            z = q[A].parent;
        while (q[z].parent) K.unshift(q[z].parent), Y = T79(z26[q[z].parent][z], Y), z = q[z].parent;
        return Y.conversion = K, Y
    }
    MT7.exports = function(A) {
        let q = N79(A),
            K = {},
            Y = Object.keys(q);
        for (let z = Y.length, w = 0; w < z; w++) {
            let H = Y[w];
            if (q[H].parent === null) continue;
            K[H] = v79(H, q)
        }
        return K
    }
})
// @from(Ln 192356, Col 4)
UHA = R((Qn2, WT7) => {
    var gHA = QHA(),
        E79 = PT7(),
        XD1 = {},
        k79 = Object.keys(gHA);

    function L79(A) {
        let q = function(...K) {
            let Y = K[0];
            if (Y === void 0 || Y === null) return Y;
            if (Y.length > 1) K = Y;
            return A(K)
        };
        if ("conversion" in A) q.conversion = A.conversion;
        return q
    }

    function R79(A) {
        let q = function(...K) {
            let Y = K[0];
            if (Y === void 0 || Y === null) return Y;
            if (Y.length > 1) K = Y;
            let z = A(K);
            if (typeof z === "object")
                for (let w = z.length, H = 0; H < w; H++) z[H] = Math.round(z[H]);
            return z
        };
        if ("conversion" in A) q.conversion = A.conversion;
        return q
    }
    k79.forEach((A) => {
        XD1[A] = {}, Object.defineProperty(XD1[A], "channels", {
            value: gHA[A].channels
        }), Object.defineProperty(XD1[A], "labels", {
            value: gHA[A].labels
        });
        let q = E79(A);
        Object.keys(q).forEach((Y) => {
            let z = q[Y];
            XD1[A][Y] = R79(z), XD1[A][Y].raw = L79(z)
        })
    });
    WT7.exports = XD1
})
// @from(Ln 192400, Col 4)
H26 = R((gn2, ZT7) => {
    var DD1 = XT7(),
        Gv = UHA(),
        GT7 = ["keyword", "gray", "hex"],
        pHA = {};
    for (let A of Object.keys(Gv)) pHA[[...Gv[A].labels].sort().join("")] = A;
    var w26 = {};

    function U0(A, q) {
        if (!(this instanceof U0)) return new U0(A, q);
        if (q && q in GT7) q = null;
        if (q && !(q in Gv)) throw Error("Unknown model: " + q);
        let K, Y;
        if (A == null) this.model = "rgb", this.color = [0, 0, 0], this.valpha = 1;
        else if (A instanceof U0) this.model = A.model, this.color = [...A.color], this.valpha = A.valpha;
        else if (typeof A === "string") {
            let z = DD1.get(A);
            if (z === null) throw Error("Unable to parse color from string: " + A);
            this.model = z.model, Y = Gv[this.model].channels, this.color = z.value.slice(0, Y), this.valpha = typeof z.value[Y] === "number" ? z.value[Y] : 1
        } else if (A.length > 0) {
            this.model = q || "rgb", Y = Gv[this.model].channels;
            let z = Array.prototype.slice.call(A, 0, Y);
            this.color = dHA(z, Y), this.valpha = typeof A[Y] === "number" ? A[Y] : 1
        } else if (typeof A === "number") this.model = "rgb", this.color = [A >> 16 & 255, A >> 8 & 255, A & 255], this.valpha = 1;
        else {
            this.valpha = 1;
            let z = Object.keys(A);
            if ("alpha" in A) z.splice(z.indexOf("alpha"), 1), this.valpha = typeof A.alpha === "number" ? A.alpha : 0;
            let w = z.sort().join("");
            if (!(w in pHA)) throw Error("Unable to parse color from object: " + JSON.stringify(A));
            this.model = pHA[w];
            let {
                labels: H
            } = Gv[this.model], $ = [];
            for (K = 0; K < H.length; K++) $.push(A[H[K]]);
            this.color = dHA($)
        }
        if (w26[this.model]) {
            Y = Gv[this.model].channels;
            for (K = 0; K < Y; K++) {
                let z = w26[this.model][K];
                if (z) this.color[K] = z(this.color[K])
            }
        }
        if (this.valpha = Math.max(0, Math.min(1, this.valpha)), Object.freeze) Object.freeze(this)
    }
    U0.prototype = {
        toString() {
            return this.string()
        },
        toJSON() {
            return this[this.model]()
        },
        string(A) {
            let q = this.model in DD1.to ? this : this.rgb();
            q = q.round(typeof A === "number" ? A : 1);
            let K = q.valpha === 1 ? q.color : [...q.color, this.valpha];
            return DD1.to[q.model](K)
        },
        percentString(A) {
            let q = this.rgb().round(typeof A === "number" ? A : 1),
                K = q.valpha === 1 ? q.color : [...q.color, this.valpha];
            return DD1.to.rgb.percent(K)
        },
        array() {
            return this.valpha === 1 ? [...this.color] : [...this.color, this.valpha]
        },
        object() {
            let A = {},
                {
                    channels: q
                } = Gv[this.model],
                {
                    labels: K
                } = Gv[this.model];
            for (let Y = 0; Y < q; Y++) A[K[Y]] = this.color[Y];
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
            return A = Math.max(A || 0, 0), new U0([...this.color.map(C79(A)), this.valpha], this.model)
        },
        alpha(A) {
            if (A !== void 0) return new U0([...this.color, Math.max(0, Math.min(1, A))], this.model);
            return this.valpha
        },
        red: C_("rgb", 0, FD(255)),
        green: C_("rgb", 1, FD(255)),
        blue: C_("rgb", 2, FD(255)),
        hue: C_(["hsl", "hsv", "hsl", "hwb", "hcg"], 0, (A) => (A % 360 + 360) % 360),
        saturationl: C_("hsl", 1, FD(100)),
        lightness: C_("hsl", 2, FD(100)),
        saturationv: C_("hsv", 1, FD(100)),
        value: C_("hsv", 2, FD(100)),
        chroma: C_("hcg", 1, FD(100)),
        gray: C_("hcg", 2, FD(100)),
        white: C_("hwb", 1, FD(100)),
        wblack: C_("hwb", 2, FD(100)),
        cyan: C_("cmyk", 0, FD(100)),
        magenta: C_("cmyk", 1, FD(100)),
        yellow: C_("cmyk", 2, FD(100)),
        black: C_("cmyk", 3, FD(100)),
        x: C_("xyz", 0, FD(95.047)),
        y: C_("xyz", 1, FD(100)),
        z: C_("xyz", 2, FD(108.833)),
        l: C_("lab", 0, FD(100)),
        a: C_("lab", 1),
        b: C_("lab", 2),
        keyword(A) {
            if (A !== void 0) return new U0(A);
            return Gv[this.model].keyword(this.color)
        },
        hex(A) {
            if (A !== void 0) return new U0(A);
            return DD1.to.hex(this.rgb().round().color)
        },
        hexa(A) {
            if (A !== void 0) return new U0(A);
            let q = this.rgb().round().color,
                K = Math.round(this.valpha * 255).toString(16).toUpperCase();
            if (K.length === 1) K = "0" + K;
            return DD1.to.hex(q) + K
        },
        rgbNumber() {
            let A = this.rgb().color;
            return (A[0] & 255) << 16 | (A[1] & 255) << 8 | A[2] & 255
        },
        luminosity() {
            let A = this.rgb().color,
                q = [];
            for (let [K, Y] of A.entries()) {
                let z = Y / 255;
                q[K] = z <= 0.04045 ? z / 12.92 : ((z + 0.055) / 1.055) ** 2.4
            }
            return 0.2126 * q[0] + 0.7152 * q[1] + 0.0722 * q[2]
        },
        contrast(A) {
            let q = this.luminosity(),
                K = A.luminosity();
            if (q > K) return (q + 0.05) / (K + 0.05);
            return (K + 0.05) / (q + 0.05)
        },
        level(A) {
            let q = this.contrast(A);
            if (q >= 7) return "AAA";
            return q >= 4.5 ? "AA" : ""
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
            for (let q = 0; q < 3; q++) A.color[q] = 255 - A.color[q];
            return A
        },
        lighten(A) {
            let q = this.hsl();
            return q.color[2] += q.color[2] * A, q
        },
        darken(A) {
            let q = this.hsl();
            return q.color[2] -= q.color[2] * A, q
        },
        saturate(A) {
            let q = this.hsl();
            return q.color[1] += q.color[1] * A, q
        },
        desaturate(A) {
            let q = this.hsl();
            return q.color[1] -= q.color[1] * A, q
        },
        whiten(A) {
            let q = this.hwb();
            return q.color[1] += q.color[1] * A, q
        },
        blacken(A) {
            let q = this.hwb();
            return q.color[2] += q.color[2] * A, q
        },
        grayscale() {
            let A = this.rgb().color,
                q = A[0] * 0.3 + A[1] * 0.59 + A[2] * 0.11;
            return U0.rgb(q, q, q)
        },
        fade(A) {
            return this.alpha(this.valpha - this.valpha * A)
        },
        opaquer(A) {
            return this.alpha(this.valpha + this.valpha * A)
        },
        rotate(A) {
            let q = this.hsl(),
                K = q.color[0];
            return K = (K + A) % 360, K = K < 0 ? 360 + K : K, q.color[0] = K, q
        },
        mix(A, q) {
            if (!A || !A.rgb) throw Error('Argument to "mix" was not a Color instance, but rather an instance of ' + typeof A);
            let K = A.rgb(),
                Y = this.rgb(),
                z = q === void 0 ? 0.5 : q,
                w = 2 * z - 1,
                H = K.alpha() - Y.alpha(),
                $ = ((w * H === -1 ? w : (w + H) / (1 + w * H)) + 1) / 2,
                O = 1 - $;
            return U0.rgb($ * K.red() + O * Y.red(), $ * K.green() + O * Y.green(), $ * K.blue() + O * Y.blue(), K.alpha() * z + Y.alpha() * (1 - z))
        }
    };
    for (let A of Object.keys(Gv)) {
        if (GT7.includes(A)) continue;
        let {
            channels: q
        } = Gv[A];
        U0.prototype[A] = function(...K) {
            if (this.model === A) return new U0(this);
            if (K.length > 0) return new U0(K, A);
            return new U0([...S79(Gv[this.model][A].raw(this.color)), this.valpha], A)
        }, U0[A] = function(...K) {
            let Y = K[0];
            if (typeof Y === "number") Y = dHA(K, q);
            return new U0(Y, A)
        }
    }

    function y79(A, q) {
        return Number(A.toFixed(q))
    }

    function C79(A) {
        return function(q) {
            return y79(q, A)
        }
    }

    function C_(A, q, K) {
        A = Array.isArray(A) ? A : [A];
        for (let Y of A)(w26[Y] || (w26[Y] = []))[q] = K;
        return A = A[0],
            function(Y) {
                let z;
                if (Y !== void 0) {
                    if (K) Y = K(Y);
                    return z = this[A](), z.color[q] = Y, z
                }
                if (z = this[A]().color[q], K) z = K(z);
                return z
            }
    }

    function FD(A) {
        return function(q) {
            return Math.max(0, Math.min(A, q))
        }
    }

    function S79(A) {
        return Array.isArray(A) ? A : [A]
    }

    function dHA(A, q) {
        for (let K = 0; K < q; K++)
            if (typeof A[K] !== "number") A[K] = 0;
        return A
    }
    ZT7.exports = U0
})
// @from(Ln 192679, Col 4)
NT7 = R((Un2, VT7) => {
    var h79 = H26(),
        rA = ru(),
        Co = $x1(),
        I79 = {
            left: "low",
            center: "centre",
            centre: "centre",
            right: "high"
        };

    function fT7(A) {
        let {
            raw: q,
            density: K,
            limitInputPixels: Y,
            ignoreIcc: z,
            unlimited: w,
            sequentialRead: H,
            failOn: $,
            failOnError: O,
            animated: _,
            page: J,
            pages: X,
            subifd: D
        } = A;
        return [q, K, Y, z, w, H, $, O, _, J, X, D].some(rA.defined) ? {
            raw: q,
            density: K,
            limitInputPixels: Y,
            ignoreIcc: z,
            unlimited: w,
            sequentialRead: H,
            failOn: $,
            failOnError: O,
            animated: _,
            page: J,
            pages: X,
            subifd: D
        } : void 0
    }

    function x79(A, q, K) {
        let Y = {
            failOn: "warning",
            limitInputPixels: Math.pow(16383, 2),
            ignoreIcc: !1,
            unlimited: !1,
            sequentialRead: !0
        };
        if (rA.string(A)) Y.file = A;
        else if (rA.buffer(A)) {
            if (A.length === 0) throw Error("Input Buffer is empty");
            Y.buffer = A
        } else if (rA.arrayBuffer(A)) {
            if (A.byteLength === 0) throw Error("Input bit Array is empty");
            Y.buffer = Buffer.from(A, 0, A.byteLength)
        } else if (rA.typedArray(A)) {
            if (A.length === 0) throw Error("Input Bit Array is empty");
            Y.buffer = Buffer.from(A.buffer, A.byteOffset, A.byteLength)
        } else if (rA.plainObject(A) && !rA.defined(q)) {
            if (q = A, fT7(q)) Y.buffer = []
        } else if (!rA.defined(A) && !rA.defined(q) && rA.object(K) && K.allowStream) Y.buffer = [];
        else throw Error(`Unsupported input '${A}' of type ${typeof A}${rA.defined(q)?` when also providing options of type ${typeof q}`:""}`);
        if (rA.object(q)) {
            if (rA.defined(q.failOnError))
                if (rA.bool(q.failOnError)) Y.failOn = q.failOnError ? "warning" : "none";
                else throw rA.invalidParameterError("failOnError", "boolean", q.failOnError);
            if (rA.defined(q.failOn))
                if (rA.string(q.failOn) && rA.inArray(q.failOn, ["none", "truncated", "error", "warning"])) Y.failOn = q.failOn;
                else throw rA.invalidParameterError("failOn", "one of: none, truncated, error, warning", q.failOn);
            if (rA.defined(q.density))
                if (rA.inRange(q.density, 1, 1e5)) Y.density = q.density;
                else throw rA.invalidParameterError("density", "number between 1 and 100000", q.density);
            if (rA.defined(q.ignoreIcc))
                if (rA.bool(q.ignoreIcc)) Y.ignoreIcc = q.ignoreIcc;
                else throw rA.invalidParameterError("ignoreIcc", "boolean", q.ignoreIcc);
            if (rA.defined(q.limitInputPixels))
                if (rA.bool(q.limitInputPixels)) Y.limitInputPixels = q.limitInputPixels ? Math.pow(16383, 2) : 0;
                else if (rA.integer(q.limitInputPixels) && rA.inRange(q.limitInputPixels, 0, Number.MAX_SAFE_INTEGER)) Y.limitInputPixels = q.limitInputPixels;
            else throw rA.invalidParameterError("limitInputPixels", "positive integer", q.limitInputPixels);
            if (rA.defined(q.unlimited))
                if (rA.bool(q.unlimited)) Y.unlimited = q.unlimited;
                else throw rA.invalidParameterError("unlimited", "boolean", q.unlimited);
            if (rA.defined(q.sequentialRead))
                if (rA.bool(q.sequentialRead)) Y.sequentialRead = q.sequentialRead;
                else throw rA.invalidParameterError("sequentialRead", "boolean", q.sequentialRead);
            if (rA.defined(q.raw))
                if (rA.object(q.raw) && rA.integer(q.raw.width) && q.raw.width > 0 && rA.integer(q.raw.height) && q.raw.height > 0 && rA.integer(q.raw.channels) && rA.inRange(q.raw.channels, 1, 4)) switch (Y.rawWidth = q.raw.width, Y.rawHeight = q.raw.height, Y.rawChannels = q.raw.channels, Y.rawPremultiplied = !!q.raw.premultiplied, A.constructor) {
                    case Uint8Array:
                    case Uint8ClampedArray:
                        Y.rawDepth = "uchar";
                        break;
                    case Int8Array:
                        Y.rawDepth = "char";
                        break;
                    case Uint16Array:
                        Y.rawDepth = "ushort";
                        break;
                    case Int16Array:
                        Y.rawDepth = "short";
                        break;
                    case Uint32Array:
                        Y.rawDepth = "uint";
                        break;
                    case Int32Array:
                        Y.rawDepth = "int";
                        break;
                    case Float32Array:
                        Y.rawDepth = "float";
                        break;
                    case Float64Array:
                        Y.rawDepth = "double";
                        break;
                    default:
                        Y.rawDepth = "uchar";
                        break
                } else throw Error("Expected width, height and channels for raw pixel input");
            if (rA.defined(q.animated))
                if (rA.bool(q.animated)) Y.pages = q.animated ? -1 : 1;
                else throw rA.invalidParameterError("animated", "boolean", q.animated);
            if (rA.defined(q.pages))
                if (rA.integer(q.pages) && rA.inRange(q.pages, -1, 1e5)) Y.pages = q.pages;
                else throw rA.invalidParameterError("pages", "integer between -1 and 100000", q.pages);
            if (rA.defined(q.page))
                if (rA.integer(q.page) && rA.inRange(q.page, 0, 1e5)) Y.page = q.page;
                else throw rA.invalidParameterError("page", "integer between 0 and 100000", q.page);
            if (rA.defined(q.level))
                if (rA.integer(q.level) && rA.inRange(q.level, 0, 256)) Y.level = q.level;
                else throw rA.invalidParameterError("level", "integer between 0 and 256", q.level);
            if (rA.defined(q.subifd))
                if (rA.integer(q.subifd) && rA.inRange(q.subifd, -1, 1e5)) Y.subifd = q.subifd;
                else throw rA.invalidParameterError("subifd", "integer between -1 and 100000", q.subifd);
            if (rA.defined(q.create))
                if (rA.object(q.create) && rA.integer(q.create.width) && q.create.width > 0 && rA.integer(q.create.height) && q.create.height > 0 && rA.integer(q.create.channels)) {
                    if (Y.createWidth = q.create.width, Y.createHeight = q.create.height, Y.createChannels = q.create.channels, rA.defined(q.create.noise)) {
                        if (!rA.object(q.create.noise)) throw Error("Expected noise to be an object");
                        if (!rA.inArray(q.create.noise.type, ["gaussian"])) throw Error("Only gaussian noise is supported at the moment");
                        if (!rA.inRange(q.create.channels, 1, 4)) throw rA.invalidParameterError("create.channels", "number between 1 and 4", q.create.channels);
                        if (Y.createNoiseType = q.create.noise.type, rA.number(q.create.noise.mean) && rA.inRange(q.create.noise.mean, 0, 1e4)) Y.createNoiseMean = q.create.noise.mean;
                        else throw rA.invalidParameterError("create.noise.mean", "number between 0 and 10000", q.create.noise.mean);
                        if (rA.number(q.create.noise.sigma) && rA.inRange(q.create.noise.sigma, 0, 1e4)) Y.createNoiseSigma = q.create.noise.sigma;
                        else throw rA.invalidParameterError("create.noise.sigma", "number between 0 and 10000", q.create.noise.sigma)
                    } else if (rA.defined(q.create.background)) {
                        if (!rA.inRange(q.create.channels, 3, 4)) throw rA.invalidParameterError("create.channels", "number between 3 and 4", q.create.channels);
                        let z = h79(q.create.background);
                        Y.createBackground = [z.red(), z.green(), z.blue(), Math.round(z.alpha() * 255)]
                    } else throw Error("Expected valid noise or background to create a new input image");
                    delete Y.buffer
                } else throw Error("Expected valid width, height and channels to create a new input image");
            if (rA.defined(q.text))
                if (rA.object(q.text) && rA.string(q.text.text)) {
                    if (Y.textValue = q.text.text, rA.defined(q.text.height) && rA.defined(q.text.dpi)) throw Error("Expected only one of dpi or height");
                    if (rA.defined(q.text.font))
                        if (rA.string(q.text.font)) Y.textFont = q.text.font;
                        else throw rA.invalidParameterError("text.font", "string", q.text.font);
                    if (rA.defined(q.text.fontfile))
                        if (rA.string(q.text.fontfile)) Y.textFontfile = q.text.fontfile;
                        else throw rA.invalidParameterError("text.fontfile", "string", q.text.fontfile);
                    if (rA.defined(q.text.width))
                        if (rA.integer(q.text.width) && q.text.width > 0) Y.textWidth = q.text.width;
                        else throw rA.invalidParameterError("text.width", "positive integer", q.text.width);
                    if (rA.defined(q.text.height))
                        if (rA.integer(q.text.height) && q.text.height > 0) Y.textHeight = q.text.height;
                        else throw rA.invalidParameterError("text.height", "positive integer", q.text.height);
                    if (rA.defined(q.text.align))
                        if (rA.string(q.text.align) && rA.string(this.constructor.align[q.text.align])) Y.textAlign = this.constructor.align[q.text.align];
                        else throw rA.invalidParameterError("text.align", "valid alignment", q.text.align);
                    if (rA.defined(q.text.justify))
                        if (rA.bool(q.text.justify)) Y.textJustify = q.text.justify;
                        else throw rA.invalidParameterError("text.justify", "boolean", q.text.justify);
                    if (rA.defined(q.text.dpi))
                        if (rA.integer(q.text.dpi) && rA.inRange(q.text.dpi, 1, 1e6)) Y.textDpi = q.text.dpi;
                        else throw rA.invalidParameterError("text.dpi", "integer between 1 and 1000000", q.text.dpi);
                    if (rA.defined(q.text.rgba))
                        if (rA.bool(q.text.rgba)) Y.textRgba = q.text.rgba;
                        else throw rA.invalidParameterError("text.rgba", "bool", q.text.rgba);
                    if (rA.defined(q.text.spacing))
                        if (rA.integer(q.text.spacing) && rA.inRange(q.text.spacing, -1e6, 1e6)) Y.textSpacing = q.text.spacing;
                        else throw rA.invalidParameterError("text.spacing", "integer between -1000000 and 1000000", q.text.spacing);
                    if (rA.defined(q.text.wrap))
                        if (rA.string(q.text.wrap) && rA.inArray(q.text.wrap, ["word", "char", "word-char", "none"])) Y.textWrap = q.text.wrap;
                        else throw rA.invalidParameterError("text.wrap", "one of: word, char, word-char, none", q.text.wrap);
                    delete Y.buffer
                } else throw Error("Expected a valid string to create an image with text.")
        } else if (rA.defined(q)) throw Error("Invalid input options " + q);
        return Y
    }

    function b79(A, q, K) {
        if (Array.isArray(this.options.input.buffer))
            if (rA.buffer(A)) {
                if (this.options.input.buffer.length === 0) this.on("finish", () => {
                    this.streamInFinished = !0
                });
                this.options.input.buffer.push(A), K()
            } else K(Error("Non-Buffer data on Writable Stream"));
        else K(Error("Unexpected data on Writable Stream"))
    }

    function u79() {
        if (this._isStreamInput()) this.options.input.buffer = Buffer.concat(this.options.input.buffer)
    }

    function B79() {
        return Array.isArray(this.options.input.buffer)
    }

    function m79(A) {
        let q = Error();
        if (rA.fn(A)) {
            if (this._isStreamInput()) this.on("finish", () => {
                this._flattenBufferIn(), Co.metadata(this.options, (K, Y) => {
                    if (K) A(rA.nativeError(K, q));
                    else A(null, Y)
                })
            });
            else Co.metadata(this.options, (K, Y) => {
                if (K) A(rA.nativeError(K, q));
                else A(null, Y)
            });
            return this
        } else if (this._isStreamInput()) return new Promise((K, Y) => {
            let z = () => {
                this._flattenBufferIn(), Co.metadata(this.options, (w, H) => {
                    if (w) Y(rA.nativeError(w, q));
                    else K(H)
                })
            };
            if (this.writableFinished) z();
            else this.once("finish", z)
        });
        else return new Promise((K, Y) => {
            Co.metadata(this.options, (z, w) => {
                if (z) Y(rA.nativeError(z, q));
                else K(w)
            })
        })
    }

    function F79(A) {
        let q = Error();
        if (rA.fn(A)) {
            if (this._isStreamInput()) this.on("finish", () => {
                this._flattenBufferIn(), Co.stats(this.options, (K, Y) => {
                    if (K) A(rA.nativeError(K, q));
                    else A(null, Y)
                })
            });
            else Co.stats(this.options, (K, Y) => {
                if (K) A(rA.nativeError(K, q));
                else A(null, Y)
            });
            return this
        } else if (this._isStreamInput()) return new Promise((K, Y) => {
            this.on("finish", function() {
                this._flattenBufferIn(), Co.stats(this.options, (z, w) => {
                    if (z) Y(rA.nativeError(z, q));
                    else K(w)
                })
            })
        });
        else return new Promise((K, Y) => {
            Co.stats(this.options, (z, w) => {
                if (z) Y(rA.nativeError(z, q));
                else K(w)
            })
        })
    }
    VT7.exports = function(A) {
        Object.assign(A.prototype, {
            _inputOptionsFromObject: fT7,
            _createInputDescriptor: x79,
            _write: b79,
            _flattenBufferIn: u79,
            _isStreamInput: B79,
            metadata: m79,
            stats: F79
        }), A.align = I79
    }
})
// @from(Ln 192960, Col 4)
RT7 = R((pn2, LT7) => {
    var Cq = ru(),
        vT7 = {
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
        ET7 = {
            top: 1,
            right: 2,
            bottom: 3,
            left: 4,
            "right top": 5,
            "right bottom": 6,
            "left bottom": 7,
            "left top": 8
        },
        TT7 = {
            background: "background",
            copy: "copy",
            repeat: "repeat",
            mirror: "mirror"
        },
        kT7 = {
            entropy: 16,
            attention: 17
        },
        cHA = {
            nearest: "nearest",
            linear: "linear",
            cubic: "cubic",
            mitchell: "mitchell",
            lanczos2: "lanczos2",
            lanczos3: "lanczos3"
        },
        Q79 = {
            contain: "contain",
            cover: "cover",
            fill: "fill",
            inside: "inside",
            outside: "outside"
        },
        g79 = {
            contain: "embed",
            cover: "crop",
            fill: "ignore_aspect",
            inside: "max",
            outside: "min"
        };

    function lHA(A) {
        return A.angle % 360 !== 0 || A.useExifOrientation === !0 || A.rotationAngle !== 0
    }

    function $26(A) {
        return A.width !== -1 || A.height !== -1
    }

    function U79(A, q, K) {
        if ($26(this.options)) this.options.debuglog("ignoring previous resize options");
        if (this.options.widthPost !== -1) this.options.debuglog("operation order will be: extract, resize, extract");
        if (Cq.defined(A))
            if (Cq.object(A) && !Cq.defined(K)) K = A;
            else if (Cq.integer(A) && A > 0) this.options.width = A;
        else throw Cq.invalidParameterError("width", "positive integer", A);
        else this.options.width = -1;
        if (Cq.defined(q))
            if (Cq.integer(q) && q > 0) this.options.height = q;
            else throw Cq.invalidParameterError("height", "positive integer", q);
        else this.options.height = -1;
        if (Cq.object(K)) {
            if (Cq.defined(K.width))
                if (Cq.integer(K.width) && K.width > 0) this.options.width = K.width;
                else throw Cq.invalidParameterError("width", "positive integer", K.width);
            if (Cq.defined(K.height))
                if (Cq.integer(K.height) && K.height > 0) this.options.height = K.height;
                else throw Cq.invalidParameterError("height", "positive integer", K.height);
            if (Cq.defined(K.fit)) {
                let Y = g79[K.fit];
                if (Cq.string(Y)) this.options.canvas = Y;
                else throw Cq.invalidParameterError("fit", "valid fit", K.fit)
            }
            if (Cq.defined(K.position)) {
                let Y = Cq.integer(K.position) ? K.position : kT7[K.position] || ET7[K.position] || vT7[K.position];
                if (Cq.integer(Y) && (Cq.inRange(Y, 0, 8) || Cq.inRange(Y, 16, 17))) this.options.position = Y;
                else throw Cq.invalidParameterError("position", "valid position/gravity/strategy", K.position)
            }
            if (this._setBackgroundColourOption("resizeBackground", K.background), Cq.defined(K.kernel))
                if (Cq.string(cHA[K.kernel])) this.options.kernel = cHA[K.kernel];
                else throw Cq.invalidParameterError("kernel", "valid kernel name", K.kernel);
            if (Cq.defined(K.withoutEnlargement)) this._setBooleanOption("withoutEnlargement", K.withoutEnlargement);
            if (Cq.defined(K.withoutReduction)) this._setBooleanOption("withoutReduction", K.withoutReduction);
            if (Cq.defined(K.fastShrinkOnLoad)) this._setBooleanOption("fastShrinkOnLoad", K.fastShrinkOnLoad)
        }
        if (lHA(this.options) && $26(this.options)) this.options.rotateBeforePreExtract = !0;
        return this
    }

    function p79(A) {
        if (Cq.integer(A) && A > 0) this.options.extendTop = A, this.options.extendBottom = A, this.options.extendLeft = A, this.options.extendRight = A;
        else if (Cq.object(A)) {
            if (Cq.defined(A.top))
                if (Cq.integer(A.top) && A.top >= 0) this.options.extendTop = A.top;
                else throw Cq.invalidParameterError("top", "positive integer", A.top);
            if (Cq.defined(A.bottom))
                if (Cq.integer(A.bottom) && A.bottom >= 0) this.options.extendBottom = A.bottom;
                else throw Cq.invalidParameterError("bottom", "positive integer", A.bottom);
            if (Cq.defined(A.left))
                if (Cq.integer(A.left) && A.left >= 0) this.options.extendLeft = A.left;
                else throw Cq.invalidParameterError("left", "positive integer", A.left);
            if (Cq.defined(A.right))
                if (Cq.integer(A.right) && A.right >= 0) this.options.extendRight = A.right;
                else throw Cq.invalidParameterError("right", "positive integer", A.right);
            if (this._setBackgroundColourOption("extendBackground", A.background), Cq.defined(A.extendWith))
                if (Cq.string(TT7[A.extendWith])) this.options.extendWith = TT7[A.extendWith];
                else throw Cq.invalidParameterError("extendWith", "one of: background, copy, repeat, mirror", A.extendWith)
        } else throw Cq.invalidParameterError("extend", "integer or object", A);
        return this
    }

    function d79(A) {
        let q = $26(this.options) || this.options.widthPre !== -1 ? "Post" : "Pre";
        if (this.options[`width${q}`] !== -1) this.options.debuglog("ignoring previous extract options");
        if (["left", "top", "width", "height"].forEach(function(K) {
                let Y = A[K];
                if (Cq.integer(Y) && Y >= 0) this.options[K + (K === "left" || K === "top" ? "Offset" : "") + q] = Y;
                else throw Cq.invalidParameterError(K, "integer", Y)
            }, this), lHA(this.options) && !$26(this.options)) {
            if (this.options.widthPre === -1 || this.options.widthPost === -1) this.options.rotateBeforePreExtract = !0
        }
        return this
    }

    function c79(A) {
        if (this.options.trimThreshold = 10, Cq.defined(A))
            if (Cq.object(A)) {
                if (Cq.defined(A.background)) this._setBackgroundColourOption("trimBackground", A.background);
                if (Cq.defined(A.threshold))
                    if (Cq.number(A.threshold) && A.threshold >= 0) this.options.trimThreshold = A.threshold;
                    else throw Cq.invalidParameterError("threshold", "positive number", A.threshold);
                if (Cq.defined(A.lineArt)) this._setBooleanOption("trimLineArt", A.lineArt)
            } else throw Cq.invalidParameterError("trim", "object", A);
        if (lHA(this.options)) this.options.rotateBeforePreExtract = !0;
        return this
    }
    LT7.exports = function(A) {
        Object.assign(A.prototype, {
            resize: U79,
            extend: p79,
            extract: d79,
            trim: c79
        }), A.gravity = vT7, A.strategy = kT7, A.kernel = cHA, A.fit = Q79, A.position = ET7
    }
})