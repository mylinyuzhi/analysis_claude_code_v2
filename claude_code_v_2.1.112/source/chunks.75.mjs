
// @from(Ln 196446, Col 0)
async function zs(q, K, _, z) {
    if (q.length === 0) throw new xd("Image file is empty (0 bytes)");
    try {
        let Y = await i$6(),
            O = await Y(q).metadata(),
            w = O.format ?? _,
            $ = w === "jpg" ? "jpeg" : w;
        if (!O.width || !O.height) {
            if (K > z.targetRawSize) return d("tengu_image_resize", {
                over_byte_limit: !0,
                over_dimension_limit: !1,
                original_size_bytes: K
            }), {
                buffer: await Y(q).jpeg({
                    quality: 80
                }).toBuffer(),
                mediaType: "jpeg"
            };
            return {
                buffer: q,
                mediaType: $
            }
        }
        let {
            width: j,
            height: H
        } = O, J = j, X = H;
        if (K <= z.targetRawSize && J <= z.maxWidth && X <= z.maxHeight) return {
            buffer: q,
            mediaType: $,
            dimensions: {
                originalWidth: j,
                originalHeight: H,
                displayWidth: J,
                displayHeight: X
            }
        };
        let M = J > z.maxWidth || X > z.maxHeight,
            P = $ === "png";
        if (d("tengu_image_resize", {
                over_byte_limit: K > z.targetRawSize,
                over_dimension_limit: M,
                original_size_bytes: K,
                original_width: j,
                original_height: H
            }), !M && K > z.targetRawSize) {
            if (P) {
                let D = await Y(q).png({
                    compressionLevel: 9,
                    palette: !0
                }).toBuffer();
                if (D.length <= z.targetRawSize) return {
                    buffer: D,
                    mediaType: "png",
                    dimensions: {
                        originalWidth: j,
                        originalHeight: H,
                        displayWidth: J,
                        displayHeight: X
                    }
                }
            }
            for (let D of [80, 60, 40, 20]) {
                let Z = await Y(q).jpeg({
                    quality: D
                }).toBuffer();
                if (Z.length <= z.targetRawSize) return {
                    buffer: Z,
                    mediaType: "jpeg",
                    dimensions: {
                        originalWidth: j,
                        originalHeight: H,
                        displayWidth: J,
                        displayHeight: X
                    }
                }
            }
        }
        if (J > z.maxWidth) X = Math.round(X * z.maxWidth / J), J = z.maxWidth;
        if (X > z.maxHeight) J = Math.round(J * z.maxHeight / X), X = z.maxHeight;
        E(`Resizing to ${J}x${X}`);
        let W = await Y(q).resize(J, X, {
            fit: "inside",
            withoutEnlargement: !0
        }).toBuffer();
        if (W.length > z.targetRawSize) {
            if (P) {
                let f = await Y(q).resize(J, X, {
                    fit: "inside",
                    withoutEnlargement: !0
                }).png({
                    compressionLevel: 9,
                    palette: !0
                }).toBuffer();
                if (f.length <= z.targetRawSize) return {
                    buffer: f,
                    mediaType: "png",
                    dimensions: {
                        originalWidth: j,
                        originalHeight: H,
                        displayWidth: J,
                        displayHeight: X
                    }
                }
            }
            for (let f of [80, 60, 40, 20]) {
                let v = await Y(q).resize(J, X, {
                    fit: "inside",
                    withoutEnlargement: !0
                }).jpeg({
                    quality: f
                }).toBuffer();
                if (v.length <= z.targetRawSize) return {
                    buffer: v,
                    mediaType: "jpeg",
                    dimensions: {
                        originalWidth: j,
                        originalHeight: H,
                        displayWidth: J,
                        displayHeight: X
                    }
                }
            }
            let D = Math.min(J, 1000),
                Z = Math.round(X * D / Math.max(J, 1));
            E("Still too large, compressing with JPEG");
            let G = await Y(q).resize(D, Z, {
                fit: "inside",
                withoutEnlargement: !0
            }).jpeg({
                quality: 20
            }).toBuffer();
            return E(`JPEG compressed buffer size: ${G.length}`), {
                buffer: G,
                mediaType: "jpeg",
                dimensions: {
                    originalWidth: j,
                    originalHeight: H,
                    displayWidth: D,
                    displayHeight: Z
                }
            }
        }
        return {
            buffer: W,
            mediaType: $,
            dimensions: {
                originalWidth: j,
                originalHeight: H,
                displayWidth: J,
                displayHeight: X
            }
        }
    } catch (Y) {
        j6(Y);
        let A = C24(Y),
            O = b6(Y);
        d("tengu_image_resize_failed", {
            original_size_bytes: K,
            error_type: A,
            error_message_hash: b24(O)
        });
        let $ = fE6(q).slice(6),
            j = Math.ceil(K * 4 / 3),
            H = q.length >= 24 && q[0] === 137 && q[1] === 80 && q[2] === 78 && q[3] === 71 && (q.readUInt32BE(16) > z.maxWidth || q.readUInt32BE(20) > z.maxHeight);
        if (j <= z.maxBase64Size && !H) return d("tengu_image_resize_fallback", {
            original_size_bytes: K,
            base64_size_bytes: j,
            error_type: A
        }), {
            buffer: q,
            mediaType: $
        };
        throw new xd(H ? `Unable to resize image — dimensions exceed the ${z.maxWidth}x${z.maxHeight}px limit and image processing failed. Please resize the image to reduce its pixel dimensions.` : `Unable to resize image (${o4(K)} raw, ${o4(j)} base64). The image exceeds the ${o4(z.maxBase64Size)} API limit and compression failed. Please resize the image manually or use a smaller image.`)
    }
}
// @from(Ln 196622, Col 0)
async function AQ_(q, K, _) {
    let z = await i$6(),
        Y = (H) => z(q).jpeg({
            quality: H
        }).toBuffer(),
        A = q,
        O = 90;
    if (!/jpe?g/i.test(_)) {
        let H = await Y(90);
        if (H.length < A.length) A = H;
        if (H.length <= K) return H;
        O = 89
    }
    let $ = 1,
        j;
    for (let H = 0; H < 5; H++) {
        let J = Math.floor(($ + O) / 2),
            X = await Y(J);
        if (X.length < A.length) A = X;
        if (X.length <= K) j = X, $ = J + 1;
        else O = J - 1;
        if ($ > O) break
    }
    return j ?? A
}
// @from(Ln 196647, Col 0)
async function sE({
    data: q,
    mediaType: K,
    limits: _
}) {
    let z = Buffer.isBuffer(q) ? q : Buffer.from(q, "base64"),
        Y = K?.includes("/") ? K.split("/")[1] || "png" : K || "png",
        A = await zs(z, z.length, Y, _),
        O = A.buffer,
        w = `image/${A.mediaType}`;
    if (O.length > Fm1) try {
        O = await AQ_(A.buffer, Fm1, A.mediaType), w = "image/jpeg"
    } catch ($) {
        j6($)
    }
    return {
        block: {
            type: "image",
            source: {
                type: "base64",
                media_type: w,
                data: O.toString("base64")
            }
        },
        dimensions: A.dimensions
    }
}
// @from(Ln 196674, Col 0)
async function I24(q, K) {
    if (q.source.type !== "base64") return {
        block: q
    };
    return sE({
        data: q.source.data,
        mediaType: q.source.media_type,
        limits: K
    })
}
// @from(Ln 196684, Col 0)
async function x24(q, K, _) {
    let z = _?.split("/")[1] || "jpeg",
        Y = z === "jpg" ? "jpeg" : z;
    try {
        let A = await i$6(),
            O = await A(q).metadata(),
            w = O.format || Y,
            $ = q.length,
            j = {
                imageBuffer: q,
                metadata: O,
                format: w,
                maxBytes: K,
                originalSize: $
            };
        if ($ <= K) return Ls6(q, w, $);
        let H = await OQ_(j, A);
        if (H) return H;
        if (w === "png") {
            let X = await $Q_(j, A);
            if (X) return X
        }
        let J = await jQ_(j, 50, A);
        if (J) return J;
        return await HQ_(j, A)
    } catch (A) {
        j6(A);
        let O = C24(A),
            w = b6(A);
        if (d("tengu_image_compress_failed", {
                original_size_bytes: q.length,
                max_bytes: K,
                error_type: O,
                error_message_hash: b24(w)
            }), q.length <= K) {
            let $ = fE6(q);
            return {
                base64: q.toString("base64"),
                mediaType: $,
                originalSize: q.length
            }
        }
        throw new xd(`Unable to compress image (${o4(q.length)}) to fit within ${o4(K)}. Please use a smaller image.`)
    }
}
// @from(Ln 196729, Col 0)
async function u24(q, K, _) {
    let z = Math.floor(K / 0.125),
        Y = Math.floor(z * 0.75);
    return x24(q, Y, _)
}
// @from(Ln 196734, Col 0)
async function m24(q, K) {
    if (q.source.type !== "base64") return q;
    let _ = Buffer.from(q.source.data, "base64");
    if (_.length <= K) return q;
    let z = await x24(_, K);
    return {
        type: "image",
        source: {
            type: "base64",
            media_type: z.mediaType,
            data: z.base64
        }
    }
}
// @from(Ln 196749, Col 0)
function Ls6(q, K, _) {
    let z = K === "jpg" ? "jpeg" : K;
    return {
        base64: q.toString("base64"),
        mediaType: `image/${z}`,
        originalSize: _
    }
}
// @from(Ln 196757, Col 0)
async function OQ_(q, K) {
    let _ = [1, 0.75, 0.5, 0.25];
    for (let z of _) {
        let Y = Math.round((q.metadata.width || 2000) * z),
            A = Math.round((q.metadata.height || 2000) * z),
            O = K(q.imageBuffer).resize(Y, A, {
                fit: "inside",
                withoutEnlargement: !0
            });
        O = wQ_(O, q.format);
        let w = await O.toBuffer();
        if (w.length <= q.maxBytes) return Ls6(w, q.format, q.originalSize)
    }
    return null
}
// @from(Ln 196773, Col 0)
function wQ_(q, K) {
    switch (K) {
        case "png":
            return q.png({
                compressionLevel: 9,
                palette: !0
            });
        case "jpeg":
        case "jpg":
            return q.jpeg({
                quality: 80
            });
        case "webp":
            return q.webp({
                quality: 80
            });
        default:
            return q
    }
}
// @from(Ln 196793, Col 0)
async function $Q_(q, K) {
    let _ = await K(q.imageBuffer).resize(800, 800, {
        fit: "inside",
        withoutEnlargement: !0
    }).png({
        compressionLevel: 9,
        palette: !0,
        colors: 64
    }).toBuffer();
    if (_.length <= q.maxBytes) return Ls6(_, "png", q.originalSize);
    return null
}
// @from(Ln 196805, Col 0)
async function jQ_(q, K, _) {
    let z = await _(q.imageBuffer).resize(600, 600, {
        fit: "inside",
        withoutEnlargement: !0
    }).jpeg({
        quality: K
    }).toBuffer();
    if (z.length <= q.maxBytes) return Ls6(z, "jpeg", q.originalSize);
    return null
}
// @from(Ln 196815, Col 0)
async function HQ_(q, K) {
    let _ = await K(q.imageBuffer).resize(400, 400, {
        fit: "inside",
        withoutEnlargement: !0
    }).jpeg({
        quality: 20
    }).toBuffer();
    return Ls6(_, "jpeg", q.originalSize)
}
// @from(Ln 196825, Col 0)
function GE6(q, K) {
    let {
        originalWidth: _,
        originalHeight: z,
        displayWidth: Y,
        displayHeight: A
    } = q;
    if (!_ || !z || !Y || !A || Y <= 0 || A <= 0) {
        if (K) return `[Image source: ${K}]`;
        return null
    }
    let O = _ !== Y || z !== A;
    if (!O && !K) return null;
    let w = [];
    if (K) w.push(`source: ${K}`);
    if (O) {
        let $ = _ / Y;
        w.push(`original ${_}x${z}, displayed at ${Y}x${A}. Multiply coordinates by ${$.toFixed(2)} to map to original image.`)
    }
    return `[Image: ${w.join(", ")}]`
}
// @from(Ln 196846, Col 4)
R24 = 1
// @from(Ln 196847, Col 4)
eU_ = 2
// @from(Ln 196848, Col 4)
qQ_ = 3
// @from(Ln 196849, Col 4)
KQ_ = 4
// @from(Ln 196850, Col 4)
S24 = 5
// @from(Ln 196851, Col 4)
_Q_ = 6
// @from(Ln 196852, Col 4)
zQ_ = 7
// @from(Ln 196853, Col 4)
YQ_ = 8
// @from(Ln 196854, Col 4)
xd
// @from(Ln 196855, Col 4)
CI = L(() => {
    _s();
    C8();
    pm1();
    K8();
    m8();
    c7();
    U8();
    xd = class xd extends Error {
        constructor(q) {
            super(q);
            this.name = "ImageResizeError"
        }
    }
})
// @from(Ln 196881, Col 0)
function z2() {
    if (process.env.CLAUDE_CODE_TMPDIR) return process.env.CLAUDE_CODE_TMPDIR;
    if (process.platform === "darwin") return "/tmp";
    return MQ_()
}
// @from(Ln 196887, Col 0)
function vE6(q = "claude-prompt", K = ".md", _) {
    let z = _?.contentHash ? JQ_("sha256").update(_.contentHash).digest("hex").slice(0, 16) : XQ_();
    return PQ_(z2(), `${q}-${z}${K}`)
}
// @from(Ln 196891, Col 4)
cW = () => {}
// @from(Ln 196902, Col 0)
function B24() {
    let q = process.platform,
        K = z2(),
        _ = "claude_cli_latest_screenshot.png",
        z = {
            darwin: Um1(K, "claude_cli_latest_screenshot.png"),
            linux: Um1(K, "claude_cli_latest_screenshot.png"),
            win32: Um1(K, "claude_cli_latest_screenshot.png")
        },
        Y = z[q] || z.linux,
        A = {
            darwin: {
                checkImage: "osascript -e 'the clipboard as «class PNGf»'",
                saveImage: `osascript -e 'set png_data to (the clipboard as «class PNGf»)' -e 'set fp to open for access POSIX file "${Y}" with write permission' -e 'write png_data to fp' -e 'close access fp'`,
                getPath: "osascript -e 'get POSIX path of (the clipboard as «class furl»)'",
                deleteFile: `rm -f "${Y}"`
            },
            linux: {
                checkImage: 'xclip -selection clipboard -t TARGETS -o 2>/dev/null | grep -E "image/(png|jpeg|jpg|gif|webp|bmp)" || wl-paste -l 2>/dev/null | grep -E "image/(png|jpeg|jpg|gif|webp|bmp)"',
                saveImage: `xclip -selection clipboard -t image/png -o > "${Y}" 2>/dev/null || wl-paste --type image/png > "${Y}" 2>/dev/null || xclip -selection clipboard -t image/bmp -o > "${Y}" 2>/dev/null || wl-paste --type image/bmp > "${Y}"`,
                getPath: "xclip -selection clipboard -t text/plain -o 2>/dev/null || wl-paste 2>/dev/null",
                deleteFile: `rm -f "${Y}"`
            },
            win32: {
                checkImage: 'powershell -NoProfile -Command "(Get-Clipboard -Format Image) -ne $null"',
                saveImage: `powershell -NoProfile -Command "$img = Get-Clipboard -Format Image; if ($img) { $img.Save('${Y.replace(/\\/g,"\\\\")}', [System.Drawing.Imaging.ImageFormat]::Png) }"`,
                getPath: 'powershell -NoProfile -Command "Get-Clipboard"',
                deleteFile: `del /f "${Y}"`
            }
        };
    return {
        commands: A[q] || A.linux,
        screenshotPath: Y
    }
}
// @from(Ln 196937, Col 0)
async function p24() {
    if (process.platform !== "darwin") return !1;
    try {
        let {
            getNativeModule: K
        } = await Promise.resolve().then(() => (_y8(), Ky8)), _ = K()?.hasClipboardImage;
        if (_) return _()
    } catch (K) {
        j6(K)
    }
    return (await M7("osascript", ["-e", "the clipboard as «class PNGf»"])).code === 0
}
// @from(Ln 196949, Col 0)
async function TE6(q) {
    if (process.platform === "darwin") try {
        let {
            getNativeModule: z
        } = await Promise.resolve().then(() => (_y8(), Ky8)), Y = z()?.readClipboardImage;
        if (!Y) throw Error("native clipboard reader unavailable");
        let A = Y(q.maxWidth, q.maxHeight);
        if (!A) return null;
        let O = A.png;
        if (O.length > q.targetRawSize) {
            let w = await zs(O, O.length, "png", q);
            return {
                base64: w.buffer.toString("base64"),
                mediaType: `image/${w.mediaType}`,
                dimensions: {
                    originalWidth: A.originalWidth,
                    originalHeight: A.originalHeight,
                    displayWidth: w.dimensions?.displayWidth ?? A.width,
                    displayHeight: w.dimensions?.displayHeight ?? A.height
                }
            }
        }
        return {
            base64: O.toString("base64"),
            mediaType: "image/png",
            dimensions: {
                originalWidth: A.originalWidth,
                originalHeight: A.originalHeight,
                displayWidth: A.width,
                displayHeight: A.height
            }
        }
    } catch (z) {
        j6(z)
    }
    let {
        commands: K,
        screenshotPath: _
    } = B24();
    try {
        if ((await ij(K.checkImage, {
                reject: !1
            })).exitCode !== 0) return null;
        if ((await ij(K.saveImage, {
                reject: !1
            })).exitCode !== 0) return null;
        let A = V8().readFileBytesSync(_);
        if (A.length >= 2 && A[0] === 66 && A[1] === 77) A = await (await i$6())(A).png().toBuffer();
        let O = await zs(A, A.length, "png", q),
            w = O.buffer.toString("base64"),
            $ = Es6(w);
        return ij(K.deleteFile, {
            reject: !1
        }), {
            base64: w,
            mediaType: $,
            dimensions: O.dimensions
        }
    } catch {
        return null
    }
}
// @from(Ln 197011, Col 0)
async function GQ_() {
    let {
        commands: q
    } = B24();
    try {
        let K = await ij(q.getPath, {
            reject: !1
        });
        if (K.exitCode !== 0 || !K.stdout) return null;
        return K.stdout.trim()
    } catch (K) {
        return j6(K), null
    }
}
// @from(Ln 197026, Col 0)
function F24(q) {
    if (q.startsWith('"') && q.endsWith('"') || q.startsWith("'") && q.endsWith("'")) return q.slice(1, -1);
    return q
}
// @from(Ln 197031, Col 0)
function g24(q) {
    if (process.platform === "win32") return q;
    let z = `__DOUBLE_BACKSLASH_${WQ_(8).toString("hex")}__`;
    return q.replaceAll("\\\\", z).replace(/\\(.)/g, "$1").replace(new RegExp(z, "g"), "\\")
}
// @from(Ln 197037, Col 0)
function Qm1(q) {
    let K = F24(q.trim()),
        _ = g24(K);
    return ky8.test(_)
}
// @from(Ln 197043, Col 0)
function vQ_(q) {
    let K = F24(q.trim()),
        _ = g24(K);
    if (ky8.test(_)) return _;
    return null
}
// @from(Ln 197049, Col 0)
async function U24(q, K) {
    let _ = vQ_(q);
    if (!_) return null;
    let z = _,
        Y;
    try {
        if (fQ_(z)) Y = V8().readFileBytesSync(z);
        else {
            let j = await GQ_();
            if (j && z === DQ_(j)) Y = V8().readFileBytesSync(j)
        }
    } catch (j) {
        return j6(j), null
    }
    if (!Y) return null;
    if (Y.length === 0) return E(`Image file is empty: ${z}`, {
        level: "warn"
    }), null;
    if (Y.length >= 2 && Y[0] === 66 && Y[1] === 77) Y = await (await i$6())(Y).png().toBuffer();
    let A = ZQ_(z).slice(1).toLowerCase() || "png",
        O = await zs(Y, Y.length, A, K),
        w = O.buffer.toString("base64"),
        $ = Es6(w);
    return {
        path: z,
        base64: w,
        mediaType: $,
        dimensions: O.dimensions
    }
}
// @from(Ln 197079, Col 4)
Vy8 = 800
// @from(Ln 197080, Col 4)
ky8
// @from(Ln 197081, Col 4)
VE6 = L(() => {
    pm1();
    K8();
    Q4();
    Yq();
    CI();
    U8();
    NV();
    cW();
    ky8 = /\.(png|jpe?g|gif|webp)$/i
})
// @from(Ln 197093, Col 0)
function Ny8(q, K) {
    let {
        addNotification: _
    } = EK(), z = kE6.useRef(q), Y = kE6.useRef(0), A = kE6.useRef(null);
    kE6.useEffect(() => {
        let O = z.current;
        if (z.current = q, !K || !q || O) return;
        if (A.current) clearTimeout(A.current);
        return A.current = setTimeout(async (w, $, j) => {
            w.current = null;
            let H = Date.now();
            if (H - $.current < kQ_) return;
            if (await p24()) $.current = H, j({
                key: TQ_,
                text: `Image in clipboard · ${WJ("chat:imagePaste","Chat","ctrl+v")} to paste`,
                priority: "immediate",
                timeoutMs: 8000
            })
        }, VQ_, A, Y, _), () => {
            if (A.current) clearTimeout(A.current), A.current = null
        }
    }, [q, K, _])
}
// @from(Ln 197116, Col 4)
kE6
// @from(Ln 197116, Col 9)
TQ_ = "clipboard-image-hint"
// @from(Ln 197117, Col 4)
VQ_ = 1000
// @from(Ln 197118, Col 4)
kQ_ = 30000
// @from(Ln 197119, Col 4)
dm1 = L(() => {
    kY();
    zp();
    VE6();
    kE6 = K6(P6(), 1)
})
// @from(Ln 197126, Col 0)
function iO() {
    return M8((q) => q.settings)
}
// @from(Ln 197129, Col 4)
tE = L(() => {
    N7()
})
// @from(Ln 197133, Col 0)
function Q24(q, K) {
    switch (K) {
        case "bash":
            return `!${q}`;
        default:
            return q
    }
}
// @from(Ln 197142, Col 0)
function ZR(q) {
    if (q.startsWith("!")) return "bash";
    return "prompt"
}
// @from(Ln 197147, Col 0)
function Ap(q) {
    if (ZR(q) === "prompt") return q;
    return q.slice(1)
}
// @from(Ln 197152, Col 0)
function d24(q) {
    return q === "!"
}
// @from(Ln 197159, Col 0)
function cm1() {
    let q = V8().existsSync(NQ_(b8(), "CLAUDE.md")),
        K = om7(b8());
    return [{
        key: "workspace",
        text: "Ask Claude to create a new app or clone a repository",
        isComplete: !1,
        isCompletable: !0,
        isEnabled: K
    }, {
        key: "claudemd",
        text: "Run /init to create a CLAUDE.md file with instructions for Claude",
        isComplete: q,
        isCompletable: !0,
        isEnabled: !K
    }]
}
// @from(Ln 197177, Col 0)
function c24() {
    return cm1().filter(({
        isCompletable: q,
        isEnabled: K
    }) => q && K).every(({
        isComplete: q
    }) => q)
}
// @from(Ln 197186, Col 0)
function NE6() {
    if (Ew().hasCompletedProjectOnboarding) return;
    if (c24()) u2((q) => ({
        ...q,
        hasCompletedProjectOnboarding: !0
    }))
}
// @from(Ln 197194, Col 0)
function n24() {
    u2((q) => ({
        ...q,
        projectOnboardingSeenCount: q.projectOnboardingSeenCount + 1
    }))
}
// @from(Ln 197200, Col 4)
l24
// @from(Ln 197201, Col 4)
hs6 = L(() => {
    U4();
    h1();
    n7();
    eK();
    Yq();
    l24 = P1(() => {
        let q = Ew();
        if (q.hasCompletedProjectOnboarding || q.projectOnboardingSeenCount >= 4 || process.env.IS_DEMO) return !1;
        return !c24()
    })
})
// @from(Ln 197223, Col 0)
function LQ_(q) {
    d8((K) => ({
        ...K,
        appleTerminalSetupInProgress: !0,
        appleTerminalBackupPath: q
    }))
}
// @from(Ln 197231, Col 0)
function EE6() {
    d8((q) => ({
        ...q,
        appleTerminalSetupInProgress: !1
    }))
}
// @from(Ln 197238, Col 0)
function hQ_() {
    let q = H8();
    return {
        inProgress: q.appleTerminalSetupInProgress ?? !1,
        backupPath: q.appleTerminalBackupPath || null
    }
}
// @from(Ln 197246, Col 0)
function yE6() {
    return yQ_(EQ_(), "Library", "Preferences", "com.apple.Terminal.plist")
}
// @from(Ln 197249, Col 0)
async function r24() {
    let q = yE6(),
        K = `${q}.bak`;
    try {
        let {
            code: _
        } = await w1("defaults", ["export", "com.apple.Terminal", q]);
        if (_ !== 0) return null;
        try {
            await i24(q)
        } catch {
            return null
        }
        return await w1("defaults", ["export", "com.apple.Terminal", K]), LQ_(K), K
    } catch (_) {
        return j6(_), null
    }
}
// @from(Ln 197267, Col 0)
async function Ey8() {
    let {
        inProgress: q,
        backupPath: K
    } = hQ_();
    if (!q) return {
        status: "no_backup"
    };
    if (!K) return EE6(), {
        status: "no_backup"
    };
    try {
        await i24(K)
    } catch {
        return EE6(), {
            status: "no_backup"
        }
    }
    try {
        let {
            code: _
        } = await w1("defaults", ["import", "com.apple.Terminal", K]);
        if (_ !== 0) return {
            status: "failed",
            backupPath: K
        };
        return await w1("killall", ["cfprefsd"]), EE6(), {
            status: "restored"
        }
    } catch (_) {
        return j6(Error(`Failed to restore Terminal.app settings with: ${_}`)), EE6(), {
            status: "failed",
            backupPath: K
        }
    }
}
// @from(Ln 197303, Col 4)
lm1 = L(() => {
    h1();
    Q4();
    U8()
})
// @from(Ln 197316, Col 0)
function SQ_() {
    let q = process.env.SHELL || "",
        K = RQ_(),
        _ = Q46(K, ".claude");
    if (q.endsWith("/zsh") || q.endsWith("/zsh.exe")) {
        let z = Q46(_, "completion.zsh");
        return {
            name: "zsh",
            rcFile: Q46(K, ".zshrc"),
            cacheFile: z,
            completionLine: `[[ -f "${z}" ]] && source "${z}"`,
            shellFlag: "zsh"
        }
    }
    if (q.endsWith("/bash") || q.endsWith("/bash.exe")) {
        let z = Q46(_, "completion.bash");
        return {
            name: "bash",
            rcFile: Q46(K, ".bashrc"),
            cacheFile: z,
            completionLine: `[ -f "${z}" ] && source "${z}"`,
            shellFlag: "bash"
        }
    }
    if (q.endsWith("/fish") || q.endsWith("/fish.exe")) {
        let z = process.env.XDG_CONFIG_HOME || Q46(K, ".config"),
            Y = Q46(_, "completion.fish");
        return {
            name: "fish",
            rcFile: Q46(z, "fish", "config.fish"),
            cacheFile: Y,
            completionLine: `[ -f "${Y}" ] && source "${Y}"`,
            shellFlag: "fish"
        }
    }
    return null
}
// @from(Ln 197353, Col 0)
async function nm1() {
    let q = SQ_();
    if (!q) return;
    E(`update: Regenerating ${q.name} completion cache`);
    let K = process.argv[1] || "claude";
    if ((await w1(K, ["completion", q.shellFlag, "--output", q.cacheFile])).code !== 0) {
        E(`update: Failed to regenerate ${q.name} completion cache`);
        return
    }
    E(`update: Regenerated ${q.name} completion cache at ${q.cacheFile}`)
}
// @from(Ln 197364, Col 4)
im1 = L(() => {
    u$6();
    vd();
    K8();
    m8();
    Q4();
    U8()
})
// @from(Ln 197372, Col 4)
s24 = {}
// @from(Ln 197403, Col 0)
function IQ_() {
    let q = process.env.VSCODE_GIT_ASKPASS_MAIN ?? "",
        K = process.env.PATH ?? "";
    return q.includes(".vscode-server") || q.includes(".cursor-server") || q.includes(".windsurf-server") || K.includes(".vscode-server") || K.includes(".cursor-server") || K.includes(".windsurf-server")
}
// @from(Ln 197409, Col 0)
function KB1() {
    if (!X7.terminal || !(X7.terminal in Ly8)) return null;
    return Ly8[X7.terminal] ?? null
}
// @from(Ln 197414, Col 0)
function bI(q) {
    if (!Vf()) return q;
    return `\x1B]8;;${bQ_(q).href}\x07${q}\x1B]8;;\x07`
}
// @from(Ln 197419, Col 0)
function LE6() {
    return yy8() === "darwin" && X7.terminal === "Apple_Terminal" || X7.terminal === "vscode" || X7.terminal === "cursor" || X7.terminal === "windsurf" || X7.terminal === "alacritty" || X7.terminal === "zed"
}
// @from(Ln 197422, Col 0)
async function hy8(q) {
    let K = "";
    switch (X7.terminal) {
        case "Apple_Terminal":
            K = await uQ_(q);
            break;
        case "vscode":
            K = await rm1("VSCode", q);
            break;
        case "cursor":
            K = await rm1("Cursor", q);
            break;
        case "windsurf":
            K = await rm1("Windsurf", q);
            break;
        case "alacritty":
            K = await mQ_(q);
            break;
        case "zed":
            K = await BQ_(q);
            break;
        case null:
            break
    }
    return d8((_) => {
        if (["vscode", "cursor", "windsurf", "alacritty", "zed"].includes(X7.terminal ?? "")) {
            if (_.shiftEnterKeyBindingInstalled === !0) return _;
            return {
                ..._,
                shiftEnterKeyBindingInstalled: !0
            }
        } else if (X7.terminal === "Apple_Terminal") {
            if (_.optionAsMetaKeyInstalled === !0) return _;
            return {
                ..._,
                optionAsMetaKeyInstalled: !0
            }
        }
        return _
    }), NE6(), K
}
// @from(Ln 197464, Col 0)
function _B1() {
    return H8().shiftEnterKeyBindingInstalled === !0
}
// @from(Ln 197468, Col 0)
function zB1() {
    return H8().hasUsedBackslashReturn === !0
}
// @from(Ln 197472, Col 0)
function YB1() {
    if (!H8().hasUsedBackslashReturn) d8((K) => ({
        ...K,
        hasUsedBackslashReturn: !0
    }))
}
// @from(Ln 197478, Col 0)
async function xQ_(q, K, _) {
    if (X7.terminal && X7.terminal in Ly8) {
        let Y = `Shift+Enter is natively supported in ${Ly8[X7.terminal]}.

No configuration needed. Just use Shift+Enter to add newlines.`;
        return q(Y), null
    }
    if (!LE6()) {
        let Y = X7.terminal || "your current terminal",
            A = y1(),
            O = "";
        if (A === "macos") O = `   • macOS: Apple Terminal
`;
        else if (A === "windows") O = `   • Windows: Windows Terminal
`;
        let w = `Terminal setup cannot be run from ${Y}.

This command configures a convenient Shift+Enter shortcut for multi-line prompts.
${Y8.dim("Note: You can already use backslash (\\\\) + return to add newlines.")}

To set up the shortcut (optional):
1. Exit tmux/screen temporarily
2. Run /terminal-setup directly in one of these terminals:
${O}   • IDE: VSCode, Cursor, Windsurf, Zed
   • Other: Alacritty
3. Return to tmux/screen - settings will persist

${Y8.dim("Note: iTerm2, WezTerm, Ghostty, Kitty, and Warp support Shift+Enter natively.")}`;
        return q(w), null
    }
    let z = await hy8(K.options.theme);
    return q(z), null
}
// @from(Ln 197511, Col 0)
async function rm1(q = "VSCode", K) {
    if (IQ_()) return `${d7("warning",K)(`Cannot install keybindings from a remote ${q} session.`)}${OY}${OY}${q} keybindings must be installed on your local machine, not the remote server.${OY}${OY}To install the Shift+Enter keybinding:${OY}1. Open ${q} on your local machine (not connected to remote)${OY}2. Open the Command Palette (Cmd/Ctrl+Shift+P) → "Preferences: Open Keyboard Shortcuts (JSON)"${OY}3. Add this keybinding (the file must be a JSON array):${OY}${OY}${Y8.dim(`[
  {
    "key": "shift+enter",
    "command": "workbench.action.terminal.sendSequence",
    "args": { "text": "\\u001b\\r" },
    "when": "terminalFocus"
  }
]`)}${OY}`;
    let _ = q === "VSCode" ? "Code" : q,
        z = ud(qB1(), yy8() === "win32" ? ud("AppData", "Roaming", _, "User") : yy8() === "darwin" ? ud("Library", "Application Support", _, "User") : ud(".config", _, "User")),
        Y = ud(z, "keybindings.json");
    try {
        await sm1(z, {
            recursive: !0
        });
        let A = "[]",
            O = [],
            w = !1;
        try {
            A = await tm1(Y, {
                encoding: "utf-8"
            }), w = !0, O = uF7(A) ?? []
        } catch (J) {
            if (!D5(J)) throw J
        }
        if (w) {
            let J = om1(4).toString("hex"),
                X = `${Y}.${J}.bak`;
            try {
                await am1(Y, X)
            } catch {
                return `${d7("warning",K)(`Error backing up existing ${q} terminal keybindings. Bailing out.`)}${OY}${Y8.dim(`See ${bI(Y)}`)}${OY}${Y8.dim(`Backup path: ${bI(X)}`)}${OY}`
            }
        }
        if (O.find((J) => J.key === "shift+enter" && J.command === "workbench.action.terminal.sendSequence" && J.when === "terminalFocus")) return `${d7("warning",K)(`Found existing ${q} terminal Shift+Enter key binding. Remove it to continue.`)}${OY}${Y8.dim(`See ${bI(Y)}`)}${OY}`;
        let H = BF7(A, {
            key: "shift+enter",
            command: "workbench.action.terminal.sendSequence",
            args: {
                text: "\x1B\r"
            },
            when: "terminalFocus"
        });
        return await em1(Y, H, {
            encoding: "utf-8"
        }), `${d7("success",K)(`Installed ${q} terminal Shift+Enter key binding`)}${OY}${Y8.dim(`See ${bI(Y)}`)}${OY}`
    } catch (A) {
        throw j6(A), Error(`Failed to install ${q} terminal Shift+Enter key binding`)
    }
}
// @from(Ln 197562, Col 0)
async function o24(q) {
    let {
        code: K
    } = await w1("/usr/libexec/PlistBuddy", ["-c", `Add :'Window Settings':'${q}':useOptionAsMetaKey bool true`, yE6()]);
    if (K !== 0) {
        let {
            code: _
        } = await w1("/usr/libexec/PlistBuddy", ["-c", `Set :'Window Settings':'${q}':useOptionAsMetaKey true`, yE6()]);
        if (_ !== 0) return j6(Error(`Failed to enable Option as Meta key for Terminal.app profile: ${q}`)), !1
    }
    return !0
}
// @from(Ln 197574, Col 0)
async function a24(q) {
    let {
        code: K
    } = await w1("/usr/libexec/PlistBuddy", ["-c", `Add :'Window Settings':'${q}':Bell bool false`, yE6()]);
    if (K !== 0) {
        let {
            code: _
        } = await w1("/usr/libexec/PlistBuddy", ["-c", `Set :'Window Settings':'${q}':Bell false`, yE6()]);
        if (_ !== 0) return j6(Error(`Failed to disable audio bell for Terminal.app profile: ${q}`)), !1
    }
    return !0
}
// @from(Ln 197586, Col 0)
async function uQ_(q) {
    let K = (Vm7() ?? 0) >= 27;
    try {
        if (!await r24()) throw Error("Failed to create backup of Terminal.app preferences, bailing out");
        let {
            stdout: z,
            code: Y
        } = await w1("defaults", ["read", "com.apple.Terminal", "Default Window Settings"]);
        if (Y !== 0 || !z.trim()) throw Error("Failed to read default Terminal.app profile");
        let {
            stdout: A,
            code: O
        } = await w1("defaults", ["read", "com.apple.Terminal", "Startup Window Settings"]);
        if (O !== 0 || !A.trim()) throw Error("Failed to read startup Terminal.app profile");
        let w = !1,
            $ = z.trim(),
            j = K ? !1 : await o24($),
            H = await a24($);
        if (j || H) w = !0;
        let J = A.trim();
        if (J !== $) {
            let P = K ? !1 : await o24(J),
                W = await a24(J);
            if (P || W) w = !0
        }
        if (!w) throw Error("Failed to enable Option as Meta key or disable audio bell for any Terminal.app profile");
        await w1("killall", ["cfprefsd"]), EE6();
        let X = [d7("success", q)("Configured Terminal.app settings:")];
        if (!K) X.push(d7("success", q)('- Enabled "Use Option as Meta key"'));
        X.push(d7("success", q)("- Switched to visual bell"));
        let M = K ? Y8.dim("Shift+Return will now enter a newline.") : Y8.dim("Option+Enter will now enter a newline.");
        return `${X.join(OY)}${OY}${M}${OY}${Y8.dim("You must restart Terminal.app for changes to take effect.")}${OY}`
    } catch (_) {
        j6(_);
        let z = await Ey8(),
            Y = "Failed to enable Option as Meta key for Terminal.app.";
        if (z.status === "restored") throw Error(`${Y} Your settings have been restored from backup.`);
        else if (z.status === "failed") throw Error(`${Y} Restoring from backup failed, try manually with: defaults import com.apple.Terminal ${z.backupPath}`);
        else throw Error(`${Y} No backup was available to restore from.`)
    }
}
// @from(Ln 197627, Col 0)
async function mQ_(q) {
    let _ = [],
        z = process.env.XDG_CONFIG_HOME;
    if (z) _.push(ud(z, "alacritty", "alacritty.toml"));
    else _.push(ud(qB1(), ".config", "alacritty", "alacritty.toml"));
    if (yy8() === "win32") {
        let w = process.env.APPDATA;
        if (w) _.push(ud(w, "alacritty", "alacritty.toml"))
    }
    let Y = null,
        A = "",
        O = !1;
    for (let w of _) try {
        A = await tm1(w, {
            encoding: "utf-8"
        }), Y = w, O = !0;
        break
    } catch ($) {
        if (!D5($)) throw $
    }
    if (!Y) Y = _[0] ?? null;
    if (!Y) throw Error("No valid config path found for Alacritty");
    try {
        if (O) {
            if (A.includes('mods = "Shift"') && A.includes('key = "Return"')) return `${d7("warning",q)("Found existing Alacritty Shift+Enter key binding. Remove it to continue.")}${OY}${Y8.dim(`See ${bI(Y)}`)}${OY}`;
            let $ = om1(4).toString("hex"),
                j = `${Y}.${$}.bak`;
            try {
                await am1(Y, j)
            } catch {
                return `${d7("warning",q)("Error backing up existing Alacritty config. Bailing out.")}${OY}${Y8.dim(`See ${bI(Y)}`)}${OY}${Y8.dim(`Backup path: ${bI(j)}`)}${OY}`
            }
        } else await sm1(CQ_(Y), {
            recursive: !0
        });
        let w = A;
        if (A && !A.endsWith(`
`)) w += `
`;
        return w += `
[[keyboard.bindings]]
key = "Return"
mods = "Shift"
chars = "\\u001B\\r"
`, await em1(Y, w, {
            encoding: "utf-8"
        }), `${d7("success",q)("Installed Alacritty Shift+Enter key binding")}${OY}${d7("success",q)("You may need to restart Alacritty for changes to take effect")}${OY}${Y8.dim(`See ${bI(Y)}`)}${OY}`
    } catch (w) {
        throw j6(w), Error("Failed to install Alacritty Shift+Enter key binding")
    }
}
// @from(Ln 197678, Col 0)
async function BQ_(q) {
    let K = ud(qB1(), ".config", "zed"),
        _ = ud(K, "keymap.json");
    try {
        await sm1(K, {
            recursive: !0
        });
        let z = "[]",
            Y = !1;
        try {
            z = await tm1(_, {
                encoding: "utf-8"
            }), Y = !0
        } catch (O) {
            if (!D5(O)) throw O
        }
        if (Y) {
            if (z.includes("shift-enter")) return `${d7("warning",q)("Found existing Zed Shift+Enter key binding. Remove it to continue.")}${OY}${Y8.dim(`See ${bI(_)}`)}${OY}`;
            let O = om1(4).toString("hex"),
                w = `${_}.${O}.bak`;
            try {
                await am1(_, w)
            } catch {
                return `${d7("warning",q)("Error backing up existing Zed keymap. Bailing out.")}${OY}${Y8.dim(`See ${bI(_)}`)}${OY}${Y8.dim(`Backup path: ${bI(w)}`)}${OY}`
            }
        }
        let A;
        try {
            if (A = n8(z), !Array.isArray(A)) A = []
        } catch {
            A = []
        }
        return A.push({
            context: "Terminal",
            bindings: {
                "shift-enter": ["terminal::SendText", "\x1B\r"]
            }
        }), await em1(_, I6(A, null, 2) + `
`, {
            encoding: "utf-8"
        }), `${d7("success",q)("Installed Zed Shift+Enter key binding")}${OY}${Y8.dim(`See ${bI(_)}`)}${OY}`
    } catch (z) {
        throw j6(z), Error("Failed to install Zed Shift+Enter key binding")
    }
}
// @from(Ln 197723, Col 4)
OY = `
`
// @from(Ln 197725, Col 4)
Ly8
// @from(Ln 197726, Col 4)
o$6 = L(() => {
    Y3();
    vd();
    g6();
    hs6();
    lm1();
    im1();
    h1();
    D_();
    m8();
    Q4();
    mO();
    U8();
    NK();
    e8();
    Ly8 = {
        ghostty: "Ghostty",
        kitty: "Kitty",
        "iTerm.app": "iTerm2",
        WezTerm: "WezTerm",
        WarpTerminal: "Warp"
    }
})
// @from(Ln 197750, Col 0)
function gQ_(q, K) {
    switch (K.type) {
        case "kill": {
            if (K.text.length === 0) return q;
            return {
                ring: q.mode.type === "killing" && q.ring.length > 0 ? [K.direction === "prepend" ? K.text + q.ring[0] : q.ring[0] + K.text, ...q.ring.slice(1)] : [K.text, ...q.ring].slice(0, pQ_),
                mode: {
                    type: "killing"
                }
            }
        }
        case "yank":
            return {
                ...q, mode: {
                    type: "yanked",
                    start: K.start,
                    length: K.length,
                    index: 0
                }
            };
        case "yankPop": {
            if (q.mode.type !== "yanked" || q.ring.length <= 1) return q;
            let _ = (q.mode.index + 1) % q.ring.length;
            return {
                ...q,
                mode: {
                    ...q.mode,
                    index: _
                }
            }
        }
        case "updateYankLength":
            if (q.mode.type !== "yanked") return q;
            return {
                ...q, mode: {
                    ...q.mode,
                    length: K.length
                }
            };
        case "interrupt":
            if (q.mode.type === "idle") return q;
            return {
                ...q, mode: {
                    type: "idle"
                }
            }
    }
}
// @from(Ln 197799, Col 0)
function Ry8(q) {
    return q.ring[0] ?? ""
}
// @from(Ln 197803, Col 0)
function Sy8(q) {
    if (q.mode.type !== "yanked" || q.ring.length <= 1) return null;
    let K = (q.mode.index + 1) % q.ring.length,
        {
            start: _,
            length: z
        } = q.mode;
    return {
        text: q.ring[K] ?? "",
        start: _,
        length: z
    }
}
// @from(Ln 197817, Col 0)
function t24() {
    let q = FQ_;
    return {
        get state() {
            return q
        },
        dispatch(K) {
            q = gQ_(q, K)
        }
    }
}
// @from(Ln 197829, Col 0)
function q$4({
    children: q
}) {
    let K = d46.useRef(null);
    if (K.current === null) K.current = t24();
    return d46.default.createElement(e24.Provider, {
        value: K.current
    }, q)
}
// @from(Ln 197839, Col 0)
function Cy8() {
    return d46.useContext(e24)
}
// @from(Ln 197842, Col 4)
d46
// @from(Ln 197842, Col 9)
pQ_ = 10
// @from(Ln 197843, Col 4)
FQ_
// @from(Ln 197843, Col 9)
e24
// @from(Ln 197844, Col 4)
by8 = L(() => {
    d46 = K6(P6(), 1), FQ_ = {
        ring: [],
        mode: {
            type: "idle"
        }
    };
    e24 = d46.createContext(t24())
})
// @from(Ln 197868, Col 0)
function OB1() {
    return AB1(A7(), rQ_)
}
// @from(Ln 197872, Col 0)
function K$4(q) {
    return UQ_("sha256").update(q).digest("hex").slice(0, 16)
}
// @from(Ln 197876, Col 0)
function _$4(q) {
    return AB1(OB1(), `${q}.txt`)
}
// @from(Ln 197879, Col 0)
async function z$4(q, K) {
    try {
        let _ = OB1();
        await QQ_(_, {
            recursive: !0
        });
        let z = _$4(q);
        await iQ_(z, K, {
            encoding: "utf8",
            mode: 384
        }), E(`Stored paste ${q} to ${z}`)
    } catch (_) {
        E(`Failed to store paste: ${_}`)
    }
}
// @from(Ln 197894, Col 0)
async function Y$4(q) {
    try {
        let K = _$4(q);
        return await cQ_(K, {
            encoding: "utf8"
        })
    } catch (K) {
        if (!t1(K)) E(`Failed to retrieve paste ${q}: ${K}`);
        return null
    }
}
// @from(Ln 197905, Col 0)
async function A$4(q) {
    let K = OB1(),
        _;
    try {
        _ = await dQ_(K)
    } catch {
        return
    }
    let z = q.getTime();
    for (let Y of _) {
        if (!Y.endsWith(".txt")) continue;
        let A = AB1(K, Y);
        try {
            if ((await lQ_(A)).mtimeMs < z) await nQ_(A), E(`Cleaned up old paste: ${A}`)
        } catch {}
    }
}
// @from(Ln 197922, Col 4)
rQ_ = "paste-cache"
// @from(Ln 197923, Col 4)
wB1 = L(() => {
    K8();
    Q8();
    m8()
})
// @from(Ln 197936, Col 0)
function hE6(q) {
    return (q.match(/\r\n|\r|\n/g) || []).length
}
// @from(Ln 197940, Col 0)
function uy8(q, K) {
    if (K === 0) return `[Pasted text #${q}]`;
    return `[Pasted text #${q} +${K} lines]`
}
// @from(Ln 197945, Col 0)
function j$4(q) {
    return `[Image #${q}]`
}
// @from(Ln 197949, Col 0)
function md(q) {
    if (!q) return [];
    let K = /\[(Pasted text|Image|\.\.\.Truncated text) #(\d+)(?: \+\d+ lines)?(\.)*\]/g;
    return [...q.matchAll(K)].map((z) => ({
        id: parseInt(z[2] || "0"),
        match: z[0],
        index: z.index
    })).filter((z) => z.id > 0)
}
// @from(Ln 197959, Col 0)
function RE6(q, K) {
    let _ = md(q),
        z = q;
    for (let Y = _.length - 1; Y >= 0; Y--) {
        let A = _[Y],
            O = K[A.id];
        if (O?.type !== "text") continue;
        z = z.slice(0, A.index) + O.content + z.slice(A.index + A.match.length)
    }
    return z
}
// @from(Ln 197971, Col 0)
function tQ_(q) {
    return n8(q)
}
// @from(Ln 197974, Col 0)
async function* H$4() {
    let q = I8();
    for (let _ = Op.length - 1; _ >= 0; _--) yield Op[_];
    let K = $$4(A7(), "history.jsonl");
    try {
        for await (let _ of ow8(K)) try {
            let z = tQ_(_);
            if (z.sessionId === q && J$4.has(z.timestamp)) continue;
            yield z
        } catch (z) {
            E(`Failed to parse history line: ${z}`)
        }
    } catch (_) {
        if (Q1(_) === "ENOENT") return;
        throw _
    }
}
// @from(Ln 197991, Col 0)
async function* HB1() {
    for await (let q of H$4()) yield await jB1(q)
}
// @from(Ln 197994, Col 0)
async function* my8() {
    let q = c9(),
        K = I8(),
        _ = [],
        z = 0;
    for await (let Y of H$4()) {
        if (!Y || typeof Y.project !== "string") continue;
        if (Y.project !== q) continue;
        if (Y.sessionId === K) yield await jB1(Y), z++;
        else _.push(Y);
        if (z + _.length >= O$4) break
    }
    for (let Y of _) {
        if (z >= O$4) return;
        yield await jB1(Y), z++
    }
}
// @from(Ln 198011, Col 0)
async function eQ_(q) {
    if (q.content) return {
        id: q.id,
        type: q.type,
        content: q.content,
        mediaType: q.mediaType,
        filename: q.filename
    };
    if (q.contentHash) {
        let K = await Y$4(q.contentHash);
        if (K) return {
            id: q.id,
            type: q.type,
            content: K,
            mediaType: q.mediaType,
            filename: q.filename
        }
    }
    return null
}
// @from(Ln 198031, Col 0)
async function jB1(q) {
    let K = {};
    for (let [_, z] of Object.entries(q.pastedContents || {})) {
        let Y = await eQ_(z);
        if (Y) K[Number(_)] = Y
    }
    return {
        display: q.display,
        pastedContents: K
    }
}
// @from(Ln 198042, Col 0)
async function X$4() {
    if (Op.length === 0) return;
    let q;
    try {
        let K = $$4(A7(), "history.jsonl");
        await aQ_(K, "", {
            encoding: "utf8",
            mode: 384,
            flag: "a"
        }), q = await Jj(K, {
            stale: 1e4,
            retries: {
                retries: 3,
                minTimeout: 50
            }
        });
        let _ = Op.map((z) => I6(z) + `
`);
        Op = [], await oQ_(K, _.join(""), {
            mode: 384
        })
    } catch (K) {
        E(`Failed to write prompt history: ${K}`)
    } finally {
        if (q) await q()
    }
}
// @from(Ln 198069, Col 0)
async function M$4(q) {
    if ($B1 || Op.length === 0) return;
    if (q > 5) return;
    $B1 = !0;
    try {
        await X$4()
    } finally {
        if ($B1 = !1, Op.length > 0) await l7(500), M$4(q + 1)
    }
}
// @from(Ln 198079, Col 0)
async function qd_(q) {
    let K = typeof q === "string" ? {
            display: q,
            pastedContents: {}
        } : q,
        _ = {};
    if (K.pastedContents)
        for (let [Y, A] of Object.entries(K.pastedContents)) {
            if (A.type === "image") continue;
            if (A.content.length <= sQ_) _[Number(Y)] = {
                id: A.id,
                type: A.type,
                content: A.content,
                mediaType: A.mediaType,
                filename: A.filename
            };
            else {
                let O = K$4(A.content);
                _[Number(Y)] = {
                    id: A.id,
                    type: A.type,
                    contentHash: O,
                    mediaType: A.mediaType,
                    filename: A.filename
                }, z$4(O, A.content)
            }
        }
    let z = {
        ...K,
        pastedContents: _,
        timestamp: Date.now(),
        project: c9(),
        sessionId: I8()
    };
    Op.push(z), Iy8 = z, xy8 = M$4(0)
}
// @from(Ln 198116, Col 0)
function SE6(q) {
    if (S6(process.env.CLAUDE_CODE_SKIP_PROMPT_HISTORY)) return;
    if (!w$4) w$4 = !0, eq(async () => {
        if (xy8) await xy8;
        if (Op.length > 0) await X$4()
    });
    qd_(q)
}
// @from(Ln 198125, Col 0)
function P$4() {
    if (!Iy8) return;
    let q = Iy8;
    Iy8 = null;
    let K = Op.lastIndexOf(q);
    if (K !== -1) Op.splice(K, 1);
    else J$4.add(q.timestamp)
}
// @from(Ln 198133, Col 4)
O$4 = 100
// @from(Ln 198134, Col 4)
sQ_ = 1024
// @from(Ln 198135, Col 4)
Op
// @from(Ln 198135, Col 8)
$B1 = !1
// @from(Ln 198136, Col 4)
xy8 = null
// @from(Ln 198137, Col 4)
w$4 = !1
// @from(Ln 198138, Col 4)
Iy8 = null
// @from(Ln 198139, Col 4)
J$4
// @from(Ln 198140, Col 4)
II = L(() => {
    y8();
    R9();
    K8();
    Q8();
    m8();
    Yq();
    wB1();
    e8();
    Op = [], J$4 = new Set
})
// @from(Ln 198151, Col 0)
class FK {
    measuredText;
    selection;
    offset;
    constructor(q, K = 0, _ = 0) {
        this.measuredText = q;
        this.selection = _;
        this.offset = Math.max(0, Math.min(this.text.length, K))
    }
    static fromText(q, K, _ = 0, z = 0) {
        return new FK(new W$4(q, K - 1), _, z)
    }
    getViewportStartLine(q) {
        if (q === void 0 || q <= 0) return 0;
        let {
            line: K
        } = this.getPosition(), _ = this.measuredText.getWrappedText();
        if (_.length <= q) return 0;
        let z = Math.floor(q / 2),
            Y = Math.max(0, K - z),
            A = Math.min(_.length, Y + q);
        if (A - Y < q) Y = Math.max(0, A - q);
        return Y
    }
    getViewportCharOffset(q) {
        let K = this.getViewportStartLine(q);
        if (K === 0) return 0;
        return this.measuredText.getWrappedLines()[K]?.startOffset ?? 0
    }
    getViewportCharEnd(q) {
        let K = this.getViewportStartLine(q),
            _ = this.measuredText.getWrappedLines();
        if (q === void 0 || q <= 0) return this.text.length;
        let z = Math.min(_.length, K + q);
        if (z >= _.length) return this.text.length;
        return _[z]?.startOffset ?? this.text.length
    }
    render(q, K, _, z, Y) {
        let {
            line: A,
            column: O
        } = this.getPosition(), w = this.measuredText.getWrappedText(), $ = this.getViewportStartLine(Y), j = Y !== void 0 && Y > 0 ? Math.min(w.length, $ + Y) : w.length;
        return w.slice($, j).map((H, J) => {
            let X = J + $,
                M = H;
            if (K) {
                let V = Array.from(rH().segment(H));
                if (X === w.length - 1) {
                    let k = Math.min(6, V.length),
                        N = V.length - k,
                        R = V.length > k ? V[N].index : 0;
                    M = K.repeat(N) + H.slice(R)
                } else M = K.repeat(V.length)
            }
            if (A !== X) return M.trimEnd();
            let P = "",
                W = q,
                D = "",
                Z = 0,
                G = !1;
            for (let {
                    segment: V
                }
                of rH().segment(M)) {
                if (G) {
                    D += V;
                    continue
                }
                let k = Z + N1(V);
                if (k > O) W = V, G = !0;
                else Z = k, P += V
            }
            let f, v = "";
            if (z && X === w.length - 1 && this.isAtEnd() && z.text.length > 0) {
                let V = KF6(z.text) || z.text[0];
                f = q ? _(V) : V;
                let k = z.text.slice(V.length);
                if (k.length > 0) v = z.dim(k)
            } else f = q ? _(W) : W;
            return P + f + v + D.trimEnd()
        }).join(`
`)
    }
    left() {
        if (this.offset === 0) return this;
        let q = this.imageRefEndingAt(this.offset);
        if (q) return new FK(this.measuredText, q.start);
        let K = this.measuredText.prevOffset(this.offset);
        return new FK(this.measuredText, K)
    }
    right() {
        if (this.offset >= this.text.length) return this;
        let q = this.imageRefStartingAt(this.offset);
        if (q) return new FK(this.measuredText, q.end);
        let K = this.measuredText.nextOffset(this.offset);
        return new FK(this.measuredText, Math.min(K, this.text.length))
    }
    imageRefEndingAt(q) {
        let K = this.text.slice(0, q).match(/\[Image #\d+\]$/);
        return K ? {
            start: q - K[0].length,
            end: q
        } : null
    }
    imageRefStartingAt(q) {
        let K = this.text.slice(q).match(/^\[Image #\d+\]/);
        return K ? {
            start: q,
            end: q + K[0].length
        } : null
    }
    snapOutOfImageRef(q, K) {
        let _ = /\[Image #\d+\]/g,
            z;
        while ((z = _.exec(this.text)) !== null) {
            let Y = z.index,
                A = Y + z[0].length;
            if (q > Y && q < A) return K === "start" ? Y : A
        }
        return q
    }
    up() {
        let {
            line: q,
            column: K
        } = this.getPosition();
        if (q === 0) return this;
        let _ = this.measuredText.getWrappedText()[q - 1];
        if (_ === void 0) return this;
        let z = N1(_);
        if (K > z) {
            let A = this.getOffset({
                line: q - 1,
                column: z
            });
            return new FK(this.measuredText, A, 0)
        }
        let Y = this.getOffset({
            line: q - 1,
            column: K
        });
        return new FK(this.measuredText, Y, 0)
    }
    down() {
        let {
            line: q,
            column: K
        } = this.getPosition();
        if (q >= this.measuredText.lineCount - 1) return this;
        let _ = this.measuredText.getWrappedText()[q + 1];
        if (_ === void 0) return this;
        let z = N1(_);
        if (K > z) {
            let A = this.getOffset({
                line: q + 1,
                column: z
            });
            return new FK(this.measuredText, A, 0)
        }
        let Y = this.getOffset({
            line: q + 1,
            column: K
        });
        return new FK(this.measuredText, Y, 0)
    }
    startOfCurrentLine() {
        let {
            line: q
        } = this.getPosition();
        return new FK(this.measuredText, this.getOffset({
            line: q,
            column: 0
        }), 0)
    }
    startOfLine() {
        let {
            line: q,
            column: K
        } = this.getPosition();
        if (K === 0 && q > 0) return new FK(this.measuredText, this.getOffset({
            line: q - 1,
            column: 0
        }), 0);
        return this.startOfCurrentLine()
    }
    firstNonBlankInLine() {
        let {
            line: q
        } = this.getPosition(), _ = (this.measuredText.getWrappedText()[q] || "").match(/^\s*\S/), z = _?.index ? _.index + _[0].length - 1 : 0, Y = this.getOffset({
            line: q,
            column: z
        });
        return new FK(this.measuredText, Y, 0)
    }
    endOfLine() {
        let {
            line: q,
            column: K
        } = this.getPosition(), _ = this.measuredText.getLineLength(q);
        if (K >= _ && q < this.measuredText.lineCount - 1) {
            let Y = this.measuredText.getLineLength(q + 1),
                A = this.getOffset({
                    line: q + 1,
                    column: Y
                });
            return new FK(this.measuredText, A, 0)
        }
        let z = this.getOffset({
            line: q,
            column: _
        });
        return new FK(this.measuredText, z, 0)
    }
    findLogicalLineStart(q = this.offset) {
        if (q === 0) return 0;
        let K = this.text.lastIndexOf(`
`, q - 1);
        return K === -1 ? 0 : K + 1
    }
    findLogicalLineEnd(q = this.offset) {
        let K = this.text.indexOf(`
`, q);
        return K === -1 ? this.text.length : K
    }
    getLogicalLineBounds() {
        return {
            start: this.findLogicalLineStart(),
            end: this.findLogicalLineEnd()
        }
    }
    createCursorWithColumn(q, K, _) {
        let z = K - q,
            Y = Math.min(_, z),
            A = q + Y,
            O = this.measuredText.snapToGraphemeBoundary(A);
        return new FK(this.measuredText, O, 0)
    }
    endOfLogicalLine() {
        return new FK(this.measuredText, this.findLogicalLineEnd(), 0)
    }
    startOfLogicalLine() {
        return new FK(this.measuredText, this.findLogicalLineStart(), 0)
    }
    firstNonBlankInLogicalLine() {
        let {
            start: q,
            end: K
        } = this.getLogicalLineBounds(), z = this.text.slice(q, K).match(/\S/), Y = q + (z?.index ?? 0);
        return new FK(this.measuredText, Y, 0)
    }
    upLogicalLine() {
        let {
            start: q
        } = this.getLogicalLineBounds();
        if (q === 0) return new FK(this.measuredText, 0, 0);
        let K = this.offset - q,
            _ = q - 1,
            z = this.findLogicalLineStart(_);
        return this.createCursorWithColumn(z, _, K)
    }
    downLogicalLine() {
        let {
            start: q,
            end: K
        } = this.getLogicalLineBounds();
        if (K >= this.text.length) return new FK(this.measuredText, this.text.length, 0);
        let _ = this.offset - q,
            z = K + 1,
            Y = this.findLogicalLineEnd(z);
        return this.createCursorWithColumn(z, Y, _)
    }
    nextWord() {
        if (this.isAtEnd()) return this;
        let q = this.measuredText.getWordBoundaries();
        for (let K of q)
            if (K.isWordLike && K.start > this.offset) return new FK(this.measuredText, K.start);
        return new FK(this.measuredText, this.text.length)
    }
    endOfWord() {
        if (this.isAtEnd()) return this;
        let q = this.measuredText.getWordBoundaries();
        for (let K of q) {
            if (!K.isWordLike) continue;
            if (this.offset >= K.start && this.offset < K.end - 1) return new FK(this.measuredText, K.end - 1);
            if (this.offset === K.end - 1) {
                for (let _ of q)
                    if (_.isWordLike && _.start > this.offset) return new FK(this.measuredText, _.end - 1);
                return this
            }
        }
        for (let K of q)
            if (K.isWordLike && K.start > this.offset) return new FK(this.measuredText, K.end - 1);
        return this
    }
    prevWord() {
        if (this.isAtStart()) return this;
        let q = this.measuredText.getWordBoundaries(),
            K = null;
        for (let _ of q) {
            if (!_.isWordLike) continue;
            if (_.start < this.offset) {
                if (this.offset > _.start && this.offset <= _.end) return new FK(this.measuredText, _.start);
                K = _.start
            }
        }
        if (K !== null) return new FK(this.measuredText, K);
        return new FK(this.measuredText, 0)
    }
    nextVimWord() {
        if (this.isAtEnd()) return this;
        let q = this.offset,
            K = (z) => this.measuredText.nextOffset(z),
            _ = this.graphemeAt(q);
        if (!_) return this;
        if (Ys(_))
            while (q < this.text.length && Ys(this.graphemeAt(q))) q = K(q);
        else if (c46(_))
            while (q < this.text.length && c46(this.graphemeAt(q))) q = K(q);
        while (q < this.text.length && Rs6.test(this.graphemeAt(q))) q = K(q);
        return new FK(this.measuredText, q)
    }
    endOfVimWord() {
        if (this.isAtEnd()) return this;
        let q = this.text,
            K = this.offset,
            _ = (Y) => this.measuredText.nextOffset(Y);
        if (this.graphemeAt(K) === "") return this;
        K = _(K);
        while (K < q.length && Rs6.test(this.graphemeAt(K))) K = _(K);
        if (K >= q.length) return new FK(this.measuredText, q.length);
        let z = this.graphemeAt(K);
        if (Ys(z))
            while (K < q.length) {
                let Y = _(K);
                if (Y >= q.length || !Ys(this.graphemeAt(Y))) break;
                K = Y
            } else if (c46(z))
                while (K < q.length) {
                    let Y = _(K);
                    if (Y >= q.length || !c46(this.graphemeAt(Y))) break;
                    K = Y
                }
        return new FK(this.measuredText, K)
    }
    prevVimWord() {
        if (this.isAtStart()) return this;
        let q = this.offset,
            K = (z) => this.measuredText.prevOffset(z);
        q = K(q);
        while (q > 0 && Rs6.test(this.graphemeAt(q))) q = K(q);
        if (q === 0 && Rs6.test(this.graphemeAt(0))) return new FK(this.measuredText, 0);
        let _ = this.graphemeAt(q);
        if (Ys(_))
            while (q > 0) {
                let z = K(q);
                if (!Ys(this.graphemeAt(z))) break;
                q = z
            } else if (c46(_))
                while (q > 0) {
                    let z = K(q);
                    if (!c46(this.graphemeAt(z))) break;
                    q = z
                }
        return new FK(this.measuredText, q)
    }
    nextWORD() {
        let q = this;
        while (!q.isOverWhitespace() && !q.isAtEnd()) q = q.right();
        while (q.isOverWhitespace() && !q.isAtEnd()) q = q.right();
        return q
    }
    endOfWORD() {
        if (this.isAtEnd()) return this;
        let q = this;
        if (!q.isOverWhitespace() && (q.right().isOverWhitespace() || q.right().isAtEnd())) return q = q.right(), q.endOfWORD();
        if (q.isOverWhitespace()) q = q.nextWORD();
        while (!q.right().isOverWhitespace() && !q.isAtEnd()) q = q.right();
        return q
    }
    prevWORD() {
        let q = this;
        if (q.left().isOverWhitespace()) q = q.left();
        while (q.isOverWhitespace() && !q.isAtStart()) q = q.left();
        if (!q.isOverWhitespace())
            while (!q.left().isOverWhitespace() && !q.isAtStart()) q = q.left();
        return q
    }
    modifyText(q, K = "") {
        let _ = this.offset,
            z = q.offset,
            Y = this.text.slice(0, _) + K + this.text.slice(z);
        return FK.fromText(Y, this.columns, _ + K.normalize("NFC").length)
    }
    insert(q) {
        return this.modifyText(this, q)
    }
    del() {
        if (this.isAtEnd()) return this;
        return this.modifyText(this.right())
    }
    backspace() {
        if (this.isAtStart()) return this;
        return this.left().modifyText(this)
    }
    deleteToLineStart() {
        if (this.offset > 0 && this.text[this.offset - 1] === `
`) return {
            cursor: this.left().modifyText(this),
            killed: `
`
        };
        let q = this.startOfLine(),
            K = this.text.slice(q.offset, this.offset);
        return {
            cursor: q.modifyText(this),
            killed: K
        }
    }
    deleteToLineEnd() {
        if (this.text[this.offset] === `
`) return {
            cursor: this.modifyText(this.right()),
            killed: `
`
        };
        let q = this.endOfLine(),
            K = this.text.slice(this.offset, q.offset);
        return {
            cursor: this.modifyText(q),
            killed: K
        }
    }
    deleteToLogicalLineEnd() {
        if (this.text[this.offset] === `
`) return this.modifyText(this.right());
        return this.modifyText(this.endOfLogicalLine())
    }
    deleteWordBefore() {
        if (this.isAtStart()) return {
            cursor: this,
            killed: ""
        };
        let q = this.snapOutOfImageRef(this.prevWord().offset, "start"),
            K = new FK(this.measuredText, q),
            _ = this.text.slice(K.offset, this.offset);
        return {
            cursor: K.modifyText(this),
            killed: _
        }
    }
    deleteTokenBefore() {
        let q = this.imageRefStartingAt(this.offset);
        if (q) {
            let Y = this.text[q.end] === " " ? q.end + 1 : q.end;
            return this.modifyText(new FK(this.measuredText, Y))
        }
        if (this.isAtStart()) return null;
        let K = this.text[this.offset];
        if (K !== void 0 && !/\s/.test(K)) return null;
        let z = this.text.slice(0, this.offset).match(/(^|\s)\[(Pasted text #\d+(?: \+\d+ lines)?|Image #\d+|\.\.\.Truncated text #\d+ \+\d+ lines\.\.\.)\]$/);
        if (z) {
            let Y = z.index + z[1].length;
            return new FK(this.measuredText, Y).modifyText(this)
        }
        return null
    }
    deleteWordAfter() {
        if (this.isAtEnd()) return this;
        let q = this.snapOutOfImageRef(this.nextWord().offset, "end");
        return this.modifyText(new FK(this.measuredText, q))
    }
    graphemeAt(q) {
        if (q >= this.text.length) return "";
        let K = this.measuredText.nextOffset(q);
        return this.text.slice(q, K)
    }
    isOverWhitespace() {
        let q = this.text[this.offset] ?? "";
        return /\s/.test(q)
    }
    equals(q) {
        return this.offset === q.offset && this.measuredText === q.measuredText
    }
    isAtStart() {
        return this.offset === 0
    }
    isAtEnd() {
        return this.offset >= this.text.length
    }
    startOfFirstLine() {
        return new FK(this.measuredText, 0, 0)
    }
    startOfLastLine() {
        let q = this.text.lastIndexOf(`
`);
        if (q === -1) return this.startOfLine();
        return new FK(this.measuredText, q + 1, 0)
    }
    goToLine(q) {
        let K = this.text.split(`
`),
            _ = Math.min(Math.max(0, q - 1), K.length - 1),
            z = 0;
        for (let Y = 0; Y < _; Y++) z += (K[Y]?.length ?? 0) + 1;
        return new FK(this.measuredText, z, 0)
    }
    endOfFile() {
        return new FK(this.measuredText, this.text.length, 0)
    }
    get text() {
        return this.measuredText.text
    }
    get columns() {
        return this.measuredText.columns + 1
    }
    getPosition() {
        return this.measuredText.getPositionFromOffset(this.offset)
    }
    getOffset(q) {
        return this.measuredText.getOffsetFromPosition(q)
    }
    findCharacter(q, K, _ = 1) {
        let z = this.text,
            Y = K === "f" || K === "t",
            A = K === "t" || K === "T",
            O = 0;
        if (Y) {
            let w = this.measuredText.nextOffset(this.offset);
            while (w < z.length) {
                if (this.graphemeAt(w) === q) {
                    if (O++, O === _) return A ? Math.max(this.offset, this.measuredText.prevOffset(w)) : w
                }
                w = this.measuredText.nextOffset(w)
            }
        } else {
            if (this.offset === 0) return null;
            let w = this.measuredText.prevOffset(this.offset);
            while (w >= 0) {
                if (this.graphemeAt(w) === q) {
                    if (O++, O === _) return A ? Math.min(this.offset, this.measuredText.nextOffset(w)) : w
                }
                if (w === 0) break;
                w = this.measuredText.prevOffset(w)
            }
        }
        return null
    }
}
// @from(Ln 198699, Col 0)
class By8 {
    text;
    startOffset;
    isPrecededByNewline;
    endsWithNewline;
    constructor(q, K, _, z = !1) {
        this.text = q;
        this.startOffset = K;
        this.isPrecededByNewline = _;
        this.endsWithNewline = z
    }
    equals(q) {
        return this.text === q.text && this.startOffset === q.startOffset
    }
    get length() {
        return this.text.length + (this.endsWithNewline ? 1 : 0)
    }
}
// @from(Ln 198717, Col 0)
class W$4 {
    columns;
    _wrappedLines;
    text;
    navigationCache;
    graphemeBoundaries;
    constructor(q, K) {
        this.columns = K;
        this.text = q.normalize("NFC"), this.navigationCache = new Map
    }
    get wrappedLines() {
        if (!this._wrappedLines) this._wrappedLines = this.measureWrappedText();
        return this._wrappedLines
    }
    getGraphemeBoundaries() {
        if (!this.graphemeBoundaries) {
            this.graphemeBoundaries = [];
            for (let {
                    index: q
                }
                of rH().segment(this.text)) this.graphemeBoundaries.push(q);
            this.graphemeBoundaries.push(this.text.length)
        }
        return this.graphemeBoundaries
    }
    wordBoundariesCache;
    getWordBoundaries() {
        if (!this.wordBoundariesCache) {
            this.wordBoundariesCache = [];
            for (let q of MT7().segment(this.text)) this.wordBoundariesCache.push({
                start: q.index,
                end: q.index + q.segment.length,
                isWordLike: q.isWordLike ?? !1
            })
        }
        return this.wordBoundariesCache
    }
    binarySearchBoundary(q, K, _) {
        let z = 0,
            Y = q.length - 1,
            A = _ ? this.text.length : 0;
        while (z <= Y) {
            let O = Math.floor((z + Y) / 2),
                w = q[O];
            if (w === void 0) break;
            if (_)
                if (w > K) A = w, Y = O - 1;
                else z = O + 1;
            else if (w < K) A = w, z = O + 1;
            else Y = O - 1
        }
        return A
    }
    stringIndexToDisplayWidth(q, K) {
        if (K <= 0) return 0;
        if (K >= q.length) return N1(q);
        return N1(q.substring(0, K))
    }
    displayWidthToStringIndex(q, K) {
        if (K <= 0) return 0;
        if (!q) return 0;
        if (q === this.text) return this.offsetAtDisplayWidth(K);
        let _ = 0,
            z = 0;
        for (let {
                segment: Y,
                index: A
            }
            of rH().segment(q)) {
            let O = N1(Y);
            if (_ + O > K) break;
            _ += O, z = A + Y.length
        }
        return z
    }
    offsetAtDisplayWidth(q) {
        if (q <= 0) return 0;
        let K = 0,
            _ = this.getGraphemeBoundaries();
        for (let z = 0; z < _.length - 1; z++) {
            let Y = _[z],
                A = _[z + 1];
            if (Y === void 0 || A === void 0) continue;
            let O = this.text.substring(Y, A),
                w = N1(O);
            if (K + w > q) return Y;
            K += w
        }
        return this.text.length
    }
    measureWrappedText() {
        let q = E46(this.text, this.columns, {
                hard: !0,
                trim: !1
            }),
            K = [],
            _ = 0,
            z = -1,
            Y = q.split(`
`);
        for (let A = 0; A < Y.length; A++) {
            let O = Y[A],
                w = ($) => A === 0 || $ > 0 && this.text[$ - 1] === `
`;
            if (O.length === 0)
                if (z = this.text.indexOf(`
`, z + 1), z !== -1) {
                    let $ = z,
                        j = !0;
                    K.push(new By8(O, $, w($), !0))
                } else {
                    let $ = this.text.length;
                    K.push(new By8(O, $, w($), !1))
                }
            else {
                let $ = this.text.indexOf(O, _);
                if ($ === -1) throw Error("Failed to find wrapped line in text");
                _ = $ + O.length;
                let j = $ + O.length,
                    H = j < this.text.length && this.text[j] === `
`;
                if (H) z = j;
                K.push(new By8(O, $, w($), H))
            }
        }
        return K
    }
    getWrappedText() {
        return this.wrappedLines.map((q) => q.isPrecededByNewline ? q.text : q.text.trimStart())
    }
    getWrappedLines() {
        return this.wrappedLines
    }
    getLine(q) {
        let K = this.wrappedLines;
        return K[Math.max(0, Math.min(q, K.length - 1))]
    }
    getOffsetFromPosition(q) {
        let K = this.getLine(q.line);
        if (K.text.length === 0 && K.endsWithNewline) return K.startOffset;
        let _ = K.isPrecededByNewline ? 0 : K.text.length - K.text.trimStart().length,
            z = q.column + _,
            Y = this.displayWidthToStringIndex(K.text, z),
            A = K.startOffset + Y,
            O = K.startOffset + K.text.length,
            w = O,
            $ = N1(K.text);
        if (K.endsWithNewline && q.column > $) w = O + 1;
        return Math.min(A, w)
    }
    getLineLength(q) {
        let K = this.getLine(q);
        return N1(K.text)
    }
    getPositionFromOffset(q) {
        let K = this.wrappedLines;
        for (let Y = 0; Y < K.length; Y++) {
            let A = K[Y],
                O = K[Y + 1];
            if (q >= A.startOffset && (!O || q < O.startOffset)) {
                let w = q - A.startOffset,
                    $;
                if (A.isPrecededByNewline) $ = this.stringIndexToDisplayWidth(A.text, w);
                else {
                    let j = A.text.length - A.text.trimStart().length;
                    if (w < j) $ = 0;
                    else {
                        let H = A.text.trimStart(),
                            J = w - j;
                        $ = this.stringIndexToDisplayWidth(H, J)
                    }
                }
                return {
                    line: Y,
                    column: Math.max(0, $)
                }
            }
        }
        let _ = K.length - 1,
            z = this.wrappedLines[_];
        return {
            line: _,
            column: N1(z.text)
        }
    }
    get lineCount() {
        return this.wrappedLines.length
    }
    withCache(q, K) {
        let _ = this.navigationCache.get(q);
        if (_ !== void 0) return _;
        let z = K();
        return this.navigationCache.set(q, z), z
    }
    nextOffset(q) {
        return this.withCache(`next:${q}`, () => {
            let K = this.getGraphemeBoundaries();
            return this.binarySearchBoundary(K, q, !0)
        })
    }
    prevOffset(q) {
        if (q <= 0) return 0;
        return this.withCache(`prev:${q}`, () => {
            let K = this.getGraphemeBoundaries();
            return this.binarySearchBoundary(K, q, !1)
        })
    }
    snapToGraphemeBoundary(q) {
        if (q <= 0) return 0;
        if (q >= this.text.length) return this.text.length;
        let K = this.getGraphemeBoundaries(),
            _ = 0,
            z = K.length - 1;
        while (_ < z) {
            let Y = _ + z + 1 >> 1;
            if (K[Y] <= q) _ = Y;
            else z = Y - 1
        }
        return K[_]
    }
}
// @from(Ln 198938, Col 4)
Kd_
// @from(Ln 198938, Col 9)
Rs6
// @from(Ln 198938, Col 14)
Ys = (q) => Kd_.test(q)
// @from(Ln 198939, Col 4)
py8 = (q) => Rs6.test(q)
// @from(Ln 198940, Col 4)
c46 = (q) => q.length > 0 && !py8(q) && !Ys(q)
// @from(Ln 198941, Col 4)
a$6 = L(() => {
    n5();
    ha6();
    IZ();
    Kd_ = /^[\p{L}\p{N}\p{M}_]$/u, Rs6 = /\s/
})
// @from(Ln 198947, Col 4)
XB1 = {}
// @from(Ln 198964, Col 0)
function JB1() {
    if (Ss6) return Ss6;
    if (process.platform !== "darwin") return null;
    try {
        if (process.env.MODIFIERS_NODE_PATH) Ss6 = d6(process.env.MODIFIERS_NODE_PATH);
        else {
            let q = Ad_(Yd_(zd_(import.meta.url)), "..", "modifiers-napi", `${process.arch}-darwin`, "modifiers.node");
            Ss6 = _d_(import.meta.url)(q)
        }
        return Ss6
    } catch {
        return null
    }
}
// @from(Ln 198979, Col 0)
function Od_() {
    let q = JB1();
    if (!q) return [];
    return q.getModifiers()
}
// @from(Ln 198985, Col 0)
function wd_(q) {
    let K = JB1();
    if (!K) return !1;
    return K.isModifierPressed(q)
}
// @from(Ln 198991, Col 0)
function $d_() {
    JB1()
}
// @from(Ln 198994, Col 4)
Ss6 = null
// @from(Ln 198995, Col 4)
MB1 = () => {}
// @from(Ln 198997, Col 0)
function Z$4() {
    if (D$4 || process.platform !== "darwin") return;
    D$4 = !0;
    try {
        let {
            prewarm: q
        } = (MB1(), B7(XB1));
        q()
    } catch {}
}
// @from(Ln 199008, Col 0)
function f$4(q) {
    if (process.platform !== "darwin") return !1;
    let {
        isModifierPressed: K
    } = (MB1(), B7(XB1));
    return K(q)
}
// @from(Ln 199015, Col 4)
D$4 = !1
// @from(Ln 199017, Col 0)
function wp(q, K, _) {
    let z = l46.useRef(0),
        Y = l46.useRef(void 0),
        A = l46.useCallback(() => {
            if (Y.current) clearTimeout(Y.current), Y.current = void 0
        }, []);
    return l46.useEffect(() => {
        return () => {
            A()
        }
    }, [A]), l46.useCallback(() => {
        let O = Date.now();
        if (O - z.current <= G$4 && Y.current !== void 0) A(), q(!1), K();
        else _?.(), q(!0), A(), Y.current = setTimeout((j, H) => {
            j(!1), H.current = void 0
        }, G$4, q, Y);
        z.current = O
    }, [q, K, _, A])
}
// @from(Ln 199036, Col 4)
l46
// @from(Ln 199036, Col 9)
G$4 = 800
// @from(Ln 199037, Col 4)
Cs6 = L(() => {
    l46 = K6(P6(), 1)
})
// @from(Ln 199041, Col 0)
function v$4(q) {
    let K = new Map(q);
    return function(_) {
        return (K.get(_) ?? jd_)(_)
    }
}
// @from(Ln 199048, Col 0)
function Fy8({
    value: q,
    onChange: K,
    onSubmit: _,
    onExit: z,
    onExitMessage: Y,
    onLeftArrowOnEmpty: A,
    onHistoryUp: O,
    onHistoryDown: w,
    onHistoryReset: $,
    onClearInput: j,
    mask: H = "",
    multiline: J = !1,
    cursorChar: X,
    invert: M,
    columns: P,
    onImagePaste: W,
    disableCursorMovementForUpDownKeys: D = !1,
    disableEscapeDoublePress: Z = !1,
    maxVisibleLines: G,
    externalOffset: f,
    onOffsetChange: v,
    inputFilter: V,
    inlineGhostText: k,
    dim: N,
    killRing: R
}) {
    let h = Cy8(),
        C = R ?? h;
    if (X7.terminal === "Apple_Terminal") Z$4();
    let x = f,
        B = v,
        m = FK.fromText(q, P, x),
        S = !1,
        {
            addNotification: F,
            removeNotification: U
        } = EK(),
        g = wp((V6) => {
            Y?.(V6, "Ctrl-C")
        }, () => z?.(), () => {
            if (q) K(""), B(0), $?.()
        }),
        c = wp((V6) => {
            if (!q || !V6) return;
            F({
                key: "escape-again-to-clear",
                text: "Esc again to clear",
                priority: "immediate",
                timeoutMs: 1000
            })
        }, () => {
            if (U("escape-again-to-clear"), j?.(), q) {
                if (q.trim() !== "") SE6(q);
                K(""), B(0), $?.()
            }
        }),
        n = wp((V6) => {
            if (q !== "") return;
            Y?.(V6, "Ctrl-D")
        }, () => {
            if (q !== "") return;
            z?.()
        });

    function l() {
        if (m.text === "") return n(), m;
        return m.del()
    }

    function z6() {
        let {
            cursor: V6,
            killed: f6
        } = m.deleteToLineEnd();
        return C.dispatch({
            type: "kill",
            text: f6,
            direction: "append"
        }), V6
    }

    function A6() {
        let {
            cursor: V6,
            killed: f6
        } = m.deleteToLineStart();
        return C.dispatch({
            type: "kill",
            text: f6,
            direction: "prepend"
        }), V6
    }

    function e() {
        if (m.text === "") return m;
        return C.dispatch({
            type: "kill",
            text: m.text,
            direction: "prepend"
        }), FK.fromText("", P, 0)
    }

    function i() {
        let {
            cursor: V6,
            killed: f6
        } = m.deleteWordBefore();
        return C.dispatch({
            type: "kill",
            text: f6,
            direction: "prepend"
        }), V6
    }

    function O6() {
        let V6 = Ry8(C.state);
        if (V6.length > 0) {
            let f6 = m.offset,
                G6 = m.insert(V6);
            return C.dispatch({
                type: "yank",
                start: f6,
                length: V6.length
            }), G6
        }
        return m
    }

    function J6() {
        let V6 = Sy8(C.state);
        if (!V6) return m;
        let {
            text: f6,
            start: G6,
            length: k6
        } = V6;
        C.dispatch({
            type: "yankPop"
        });
        let T6 = m.text.slice(0, G6),
            v6 = m.text.slice(G6 + k6),
            L6 = T6 + f6 + v6,
            y6 = G6 + f6.length;
        return C.dispatch({
            type: "updateYankLength",
            length: f6.length
        }), FK.fromText(L6, P, y6)
    }
    let $6 = v$4([
            ["a", () => m.startOfLine()],
            ["b", () => m.left()],
            ["c", () => {
                return g(), m
            }],
            ["d", l],
            ["e", () => m.endOfLine()],
            ["f", () => m.right()],
            ["h", () => m.deleteTokenBefore() ?? m.backspace()],
            ["k", z6],
            ["n", () => _6()],
            ["p", () => o()],
            ["u", e],
            ["w", i],
            ["y", O6]
        ]),
        H6 = v$4([
            ["b", () => m.prevWord()],
            ["f", () => m.nextWord()],
            ["d", () => m.deleteWordAfter()],
            ["y", J6]
        ]);

    function q6({
        meta: V6,
        shift: f6
    }) {
        if (J && m.offset > 0 && m.text[m.offset - 1] === "\\") return YB1(), m.backspace().insert(`
`);
        if (V6 || f6) return m.insert(`
`);
        if (X7.terminal === "Apple_Terminal" && f$4("shift")) return m.insert(`
`);
        if (_) _(m.text), S = !0;
        return m
    }

    function o() {
        if (D) return O?.(), m;
        let V6 = m.up();
        if (!V6.equals(m)) return V6;
        if (J) {
            let f6 = m.upLogicalLine();
            if (!f6.equals(m)) return f6
        }
        return O?.(), m
    }

    function _6() {
        if (D) return w?.(), m;
        let V6 = m.down();
        if (!V6.equals(m)) return V6;
        if (J) {
            let f6 = m.downLogicalLine();
            if (!f6.equals(m)) return f6
        }
        return w?.(), m
    }

    function r(V6) {
        if (V6.ctrl && (V6.key === "k" || V6.key === "u" || V6.key === "w")) return !0;
        if (V6.key === "backspace" && (V6.meta || V6.superKey || V6.ctrl)) return !0;
        if (V6.key === "delete" && (V6.meta || V6.superKey)) return !0;
        return !1
    }

    function t(V6) {
        return (V6.ctrl || V6.meta) && V6.key === "y"
    }

    function Y6(V6, f6) {
        switch (V6.key) {
            case "escape":
                if (Z) return;
                return c(), m;
            case "left":
                if (V6.ctrl || V6.meta || V6.fn) return m.prevWord();
                if (A && !V6.shift && m.text === "") return A(), m;
                return m.left();
            case "right":
                if (V6.ctrl || V6.meta || V6.fn) return m.nextWord();
                return m.right();
            case "up":
                if (V6.shift || V6.ctrl || V6.meta) return;
                return o();
            case "down":
                if (V6.shift || V6.ctrl || V6.meta) return;
                return _6();
            case "backspace":
                if (V6.superKey) return A6();
                if (V6.meta || V6.ctrl) return i();
                return m.deleteTokenBefore() ?? m.backspace();
            case "delete":
                if (V6.superKey) return z6();
                if (V6.meta) return z6();
                return m.del();
            case "home":
                if (V6.ctrl) return;
                return m.startOfLine();
            case "end":
                if (V6.ctrl) return;
                return m.endOfLine();
            case "pagedown":
                if (lq() || V6.ctrl) return;
                return m.endOfLine();
            case "pageup":
                if (lq() || V6.ctrl) return;
                return m.startOfLine();
            case "return":
                if (V6.ctrl) return;
                return q6(V6);
            case "enter":
                return m.insert(`
`);
            case "tab":
                return
        }
        if (V6.ctrl) return $6(V6.key);
        if (V6.meta) return H6(V6.key);
        if (Hd_.has(V6.key)) return;
        if (f6.length === 0) return;
        if (m.isAtStart() && d24(f6)) return m.insert(f6).left();
        return m.insert(f6)
    }

    function X6(V6) {
        let f6 = V ? V(V6.key, V6) : V6.key;
        if (f6 === "" && V6.key !== "") {
            V6.preventDefault();
            return
        }
        if (!r(V6) && !t(V6)) C.dispatch({
            type: "interrupt"
        });
        let G6 = Y6(V6, f6);
        if (G6 === void 0) return;
        if (V6.preventDefault(), !m.equals(G6)) {
            if (m.text !== G6.text) K(G6.text);
            B(G6.offset), m = G6
        }
        if (S) S = !1, m = FK.fromText("", P, 0)
    }
    let M6 = k && N && k.insertPosition === x ? {
            text: k.text,
            dim: N
        } : void 0,
        W6 = m.getPosition();
    return {
        handleKeyDown: X6,
        renderedValue: m.render(X, H, M, M6, G),
        offset: x,
        setOffset: B,
        cursorLine: W6.line - m.getViewportStartLine(G),
        cursorColumn: W6.column,
        viewportCharOffset: m.getViewportCharOffset(G),
        viewportCharEnd: m.getViewportCharEnd(G)
    }
}
// @from(Ln 199356, Col 4)
jd_ = () => {}
// @from(Ln 199357, Col 4)
Hd_
// @from(Ln 199358, Col 4)
PB1 = L(() => {
    kY();
    o$6();
    by8();
    II();
    a$6();
    D_();
    nO();
    Cs6();
    Hd_ = new Set(["insert", "clear", "enter", "center", "undefined", "mouse", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12"])
})
// @from(Ln 199370, Col 0)
function T$4({
    placeholder: q,
    value: K,
    showCursor: _,
    focus: z,
    terminalFocus: Y = !0,
    invert: A = Y8.inverse,
    hidePlaceholderText: O = !1
}) {
    let w = void 0;
    if (q) {
        if (O) w = _ && z && Y ? A(" ") : "";
        else if (w = Y8.dim(q), _ && z && Y) w = q.length > 0 ? A(q[0]) + Y8.dim(q.slice(1)) : A(" ")
    }
    let $ = K.length === 0 && Boolean(q);
    return {
        renderedPlaceholder: w,
        showPlaceholder: $
    }
}
// @from(Ln 199390, Col 4)
V$4 = L(() => {
    Y3()
})
// @from(Ln 199394, Col 0)
function Jd_() {
    return null
}
// @from(Ln 199398, Col 0)
function Xd_() {
    return []
}
// @from(Ln 199402, Col 0)
function k$4(q) {
    return
}
// @from(Ln 199405, Col 4)
WB1 = L(() => {
    B1()
})
// @from(Ln 199409, Col 0)
function vO(q) {
    let K = Pd_(),
        _ = k$4(q)?.imageLimits ?? Md_[o5(q)];
    if (!_) {
        if (K === Ks.maxBase64Size) return Ks;
        return {
            ...Ks,
            maxBase64Size: K,
            targetRawSize: K * 3 / 4
        }
    }
    let z = _.maxBase64Size ?? K;
    return {
        maxWidth: _.maxWidth ?? Ks.maxWidth,
        maxHeight: _.maxHeight ?? Ks.maxHeight,
        maxBase64Size: z,
        targetRawSize: _.targetRawSize ?? z * 3 / 4
    }
}
// @from(Ln 199429, Col 0)
function Pd_() {
    if (pq() === "firstParty" && Aj() && u8("tengu_crimson_vector", !1)) return V24;
    return Ks.maxBase64Size
}
// @from(Ln 199433, Col 4)
Md_
// @from(Ln 199434, Col 4)
Jk = L(() => {
    _s();
    B1();
    WB1();
    Sq();
    x9();
    Md_ = {
        "claude-opus-4-7": {
            maxWidth: 2576,
            maxHeight: 2576
        }
    }
})
// @from(Ln 199451, Col 0)
function N$4() {
    return vO(G5())
}
// @from(Ln 199455, Col 0)
function E$4({
    onPaste: q,
    handleKeyDown: K,
    onImagePaste: _
}) {
    let [z, Y] = s$6.default.useState(!1), A = s$6.default.useRef(!0), O = s$6.default.useRef(!1), w = s$6.default.useMemo(() => y1() === "macos", []);
    s$6.default.useEffect(() => {
        return () => {
            A.current = !1
        }
    }, []);
    let $ = s$6.default.useCallback(() => {
            if (!_ || !A.current) return;
            TE6(N$4()).then((W) => {
                if (W && A.current) _(W.base64, W.mediaType, void 0, W.dimensions)
            }).catch((W) => {
                if (A.current) j6(W)
            }).finally(() => {
                if (A.current) O.current = !1, Y(!1)
            })
        }, [_]),
        j = ra($, Dd_);

    function H(W) {
        if (q) {
            q(W);
            return
        }
        K(new Ks6({
            kind: "key",
            name: void 0,
            sequence: W,
            raw: W,
            ctrl: !1,
            meta: !1,
            shift: !1,
            option: !1,
            super: !1,
            fn: !1,
            isPasted: !0
        }))
    }

    function J() {
        Y(!1), setTimeout((W, D) => {
            if (W.current) D.current = !1
        }, 0, A, O)
    }

    function X(W) {
        O.current = !0;
        let D = W.replace(/\[I$/, "").replace(/\[O$/, "");
        if (D.length === 0 && w && _) {
            j();
            return
        }
        let Z = D.split(/ (?=\/|[A-Za-z]:\\)/).flatMap((f) => f.split(`
`)).filter((f) => f.trim()),
            G = Z.filter((f) => Qm1(f));
        if (_ && G.length > 0) {
            let f = /\/TemporaryItems\/.*screencaptureui.*\/Screenshot/i.test(D),
                v = N$4();
            Promise.all(G.map((V) => U24(V, v))).then((V) => {
                if (!A.current) return;
                let k = V.filter((N) => N !== null);
                if (k.length > 0) {
                    for (let R of k) {
                        let h = Wd_(R.path);
                        _(R.base64, R.mediaType, h, R.dimensions, R.path)
                    }
                    let N = Z.filter((R) => !Qm1(R));
                    if (N.length > 0) H(N.join(`
`));
                    O.current = !1, Y(!1)
                } else if (f && w) j();
                else H(D), O.current = !1, Y(!1)
            });
            return
        }
        H(D), J()
    }

    function M(W) {
        W.preventDefault(), Y(!0), X(W.text)
    }

    function P(W) {
        if (O.current && W.key === "return") {
            W.preventDefault();
            return
        }
        if ((q || _) && !W.ctrl && !W.meta && W.key.length > Vy8 && !W.defaultPrevented) {
            W.preventDefault(), Y(!0), X(W.key);
            return
        }
        K(W)
    }
    return {
        handleKeyDown: P,
        handlePaste: M,
        isPasting: z
    }
}
// @from(Ln 199558, Col 4)
s$6
// @from(Ln 199558, Col 9)
Dd_ = 50
// @from(Ln 199559, Col 4)
y$4 = L(() => {
    U8();
    wk();
    _u1();
    VE6();
    Jk();
    Sq();
    NK();
    s$6 = K6(P6(), 1)
})
// @from(Ln 199570, Col 0)
function n46({
    line: q,
    column: K,
    active: _
}) {
    let z = As.useContext(GE8),
        Y = As.useRef(null),
        A = As.useCallback((O) => {
            Y.current = O
        }, []);
    return As.useLayoutEffect(() => {
        let O = Y.current;
        if (_ && O) z({
            relativeX: K,
            relativeY: q,
            node: O
        });
        else z(null, O)
    }), As.useLayoutEffect(() => {
        return () => {
            z(null, Y.current)
        }
    }, [z]), A
}
// @from(Ln 199594, Col 4)
As
// @from(Ln 199595, Col 4)
bs6 = L(() => {
    tx1();
    As = K6(P6(), 1)
})
// @from(Ln 199600, Col 0)
function h$4(q, K) {
    if (K.length === 0) return [{
        text: q,
        start: 0
    }];
    let _ = [...K].sort((A, O) => {
            if (A.start !== O.start) return A.start - O.start;
            return O.priority - A.priority
        }),
        z = [],
        Y = [];
    for (let A of _) {
        if (A.start === A.end) continue;
        if (!Y.some((w) => A.start >= w.start && A.start < w.end || A.end > w.start && A.end <= w.end || A.start <= w.start && A.end >= w.end)) z.push(A), Y.push({
            start: A.start,
            end: A.end
        })
    }
    return new R$4(q).segment(z)
}
// @from(Ln 199620, Col 0)
class R$4 {
    text;
    tokens;
    visiblePos = 0;
    stringPos = 0;
    tokenIdx = 0;
    charIdx = 0;
    codes = [];
    constructor(q) {
        this.text = q;
        this.tokens = GN6(q)
    }
    segment(q) {
        let K = [];
        for (let z of q) {
            let Y = this.segmentTo(z.start);
            if (Y) K.push(Y);
            let A = this.segmentTo(z.end);
            if (A) A.highlight = z, K.push(A)
        }
        let _ = this.segmentTo(1 / 0);
        if (_) K.push(_);
        return K
    }
    segmentTo(q) {
        if (this.tokenIdx >= this.tokens.length || q <= this.visiblePos) return null;
        let K = this.visiblePos;
        while (this.tokenIdx < this.tokens.length) {
            let $ = this.tokens[this.tokenIdx];
            if ($.type !== "ansi") break;
            this.codes.push($), this.stringPos += $.code.length, this.tokenIdx++
        }
        let _ = this.stringPos,
            z = [...this.codes];
        while (this.visiblePos < q && this.tokenIdx < this.tokens.length) {
            let $ = this.tokens[this.tokenIdx];
            if ($.type === "ansi") this.codes.push($), this.stringPos += $.code.length, this.tokenIdx++;
            else {
                let j = q - this.visiblePos,
                    H = $.value.length - this.charIdx,
                    J = Math.min(j, H);
                if (this.stringPos += J, this.visiblePos += J, this.charIdx += J, this.charIdx >= $.value.length) this.tokenIdx++, this.charIdx = 0
            }
        }
        if (this.stringPos === _) return null;
        let Y = L$4(z),
            A = L$4(this.codes);
        this.codes = A;
        let O = HR(Y),
            w = HR(T$6(A));
        return {
            text: O + this.text.substring(_, this.stringPos) + w,
            start: K
        }
    }
}
// @from(Ln 199677, Col 0)
function L$4(q) {
    return N46(q).filter((K) => K.code !== K.endCode)
}
// @from(Ln 199680, Col 4)
S$4 = L(() => {
    vN6()
})
// @from(Ln 199684, Col 0)
function CE6(q) {
    let K = s(3),
        {
            char: _,
            index: z,
            glimmerIndex: Y,
            messageColor: A,
            shimmerColor: O
        } = q,
        w = z === Y,
        $ = Math.abs(z - Y) === 1,
        H = w || $ ? O : A,
        J;
    if (K[0] !== _ || K[1] !== H) J = DB1.createElement(T, {
        color: H
    }, _), K[0] = _, K[1] = H, K[2] = J;
    else J = K[2];
    return J
}
// @from(Ln 199703, Col 4)
DB1
// @from(Ln 199704, Col 4)
Is6 = L(() => {
    o6();
    g6();
    DB1 = K6(P6(), 1)
})
// @from(Ln 199710, Col 0)
function C$4(q) {
    let K = s(23),
        {
            text: _,
            highlights: z
        } = q,
        Y;
    if (K[0] !== z || K[1] !== _) {
        let f = h$4(_, z);
        Y = [
            []
        ];
        let v = 0;
        for (let V of f) {
            let k = V.text.split(`
`);
            for (let N = 0; N < k.length; N++) {
                if (N > 0) Y.push([]), v = v + 1;
                let R = k[N];
                if (R.length > 0) Y[Y.length - 1].push({
                    text: R,
                    highlight: V.highlight,
                    start: v
                });
                v = v + R.length
            }
        }
        K[0] = z, K[1] = _, K[2] = Y
    } else Y = K[2];
    let A;
    if (K[3] !== z) A = z.some(Zd_), K[3] = z, K[4] = A;
    else A = K[4];
    let O = A,
        w = 0,
        $ = 1;
    if (O) {
        let f = 1 / 0,
            v = -1 / 0;
        if (K[5] !== v || K[6] !== z || K[7] !== f) {
            for (let V of z)
                if (V.shimmerColor) f = Math.min(f, V.start), v = Math.max(v, V.end);
            K[5] = v, K[6] = z, K[7] = f, K[8] = f, K[9] = v
        } else f = K[8], v = K[9];
        w = f - 10, $ = v - f + 20
    }
    let j;
    if (K[10] !== $ || K[11] !== O || K[12] !== Y || K[13] !== w) j = {
        lines: Y,
        hasShimmer: O,
        sweepStart: w,
        cycleLength: $
    }, K[10] = $, K[11] = O, K[12] = Y, K[13] = w, K[14] = j;
    else j = K[14];
    let {
        lines: H,
        hasShimmer: J,
        sweepStart: X,
        cycleLength: M
    } = j, [P, W] = _O(J ? 50 : null), D = J ? X + Math.floor(W / 50) % M : -100, Z;
    if (K[15] !== D || K[16] !== H) {
        let f;
        if (K[18] !== D) f = (v, V) => Xk.createElement(u, {
            key: V
        }, v.length === 0 ? Xk.createElement(T, null, " ") : v.map((k, N) => {
            if (k.highlight?.shimmerColor && k.highlight.color) return Xk.createElement(T, {
                key: N
            }, k.text.split("").map((R, h) => Xk.createElement(CE6, {
                key: h,
                char: R,
                index: k.start + h,
                glimmerIndex: D,
                messageColor: k.highlight.color,
                shimmerColor: k.highlight.shimmerColor
            })));
            return Xk.createElement(T, {
                key: N,
                color: k.highlight?.color,
                dimColor: k.highlight?.dimColor,
                inverse: k.highlight?.inverse
            }, Xk.createElement(v5, null, k.text))
        })), K[18] = D, K[19] = f;
        else f = K[19];
        Z = H.map(f), K[15] = D, K[16] = H, K[17] = Z
    } else Z = K[17];
    let G;
    if (K[20] !== P || K[21] !== Z) G = Xk.createElement(u, {
        ref: P,
        flexDirection: "column"
    }, Z), K[20] = P, K[21] = Z, K[22] = G;
    else G = K[22];
    return G
}
// @from(Ln 199803, Col 0)
function Zd_(q) {
    return q.shimmerColor
}
// @from(Ln 199806, Col 4)
Xk
// @from(Ln 199807, Col 4)
b$4 = L(() => {
    o6();
    g6();
    S$4();
    Is6();
    Xk = K6(P6(), 1)
})