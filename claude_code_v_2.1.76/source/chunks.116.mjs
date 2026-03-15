
// @from(Ln 284241, Col 9)
Uf4 = ({
    isDisabled: A = !1,
    disableSelection: q = !1,
    state: K,
    options: Y,
    isMultiSelect: z = !1,
    onUpFromFirstItem: _,
    onDownFromLastItem: w,
    onInputModeToggle: O,
    inputValues: $,
    imagesSelected: H = !1,
    onEnterImageSelection: j
}) => {
    oj("select", !!K.onCancel);
    let J = hL8.useMemo(() => {
            return Y.find((X) => X.value === K.focusedValue)?.type === "input"
        }, [Y, K.focusedValue]),
        M = hL8.useMemo(() => {
            let D = {};
            if (!J) D["select:next"] = () => {
                if (w) {
                    let X = Y[Y.length - 1];
                    if (X && K.focusedValue === X.value) {
                        w();
                        return
                    }
                }
                K.focusNextOption()
            }, D["select:previous"] = () => {
                if (_ && K.visibleFromIndex === 0) {
                    let X = Y[0];
                    if (X && K.focusedValue === X.value) {
                        _();
                        return
                    }
                }
                K.focusPreviousOption()
            }, D["select:accept"] = () => {
                if (q === !0) return;
                if (K.focusedValue === void 0) return;
                if (Y.find((P) => P.value === K.focusedValue)?.disabled === !0) return;
                K.selectFocusedOption?.(), K.onChange?.(K.focusedValue)
            };
            if (K.onCancel) D["select:cancel"] = () => {
                K.onCancel()
            };
            return D
        }, [Y, K, w, _, J, q]);
    tA(M, {
        context: "Select",
        isActive: !A
    }), jA((D, X, P) => {
        let W = MC(D),
            Z = Y.find((f) => f.value === K.focusedValue),
            G = Z?.type === "input";
        if (X.tab && O && K.focusedValue !== void 0) {
            O(K.focusedValue);
            return
        }
        if (G) {
            if (H) return;
            if (X.downArrow && j?.()) {
                P.stopImmediatePropagation();
                return
            }
            if (X.downArrow || X.ctrl && D === "n") {
                if (w) {
                    let f = Y[Y.length - 1];
                    if (f && K.focusedValue === f.value) {
                        w(), P.stopImmediatePropagation();
                        return
                    }
                }
                K.focusNextOption(), P.stopImmediatePropagation();
                return
            }
            if (X.upArrow || X.ctrl && D === "p") {
                if (_ && K.visibleFromIndex === 0) {
                    let f = Y[0];
                    if (f && K.focusedValue === f.value) {
                        _(), P.stopImmediatePropagation();
                        return
                    }
                }
                K.focusPreviousOption(), P.stopImmediatePropagation();
                return
            }
            return
        }
        if (X.pageDown) K.focusNextPage();
        if (X.pageUp) K.focusPreviousPage();
        if (q !== !0) {
            if (z && _91(D) === " " && K.focusedValue !== void 0) {
                if (Z?.disabled !== !0) K.selectFocusedOption?.(), K.onChange?.(K.focusedValue)
            }
            if (q !== "numeric" && /^[0-9]+$/.test(W)) {
                let f = parseInt(W) - 1;
                if (f >= 0 && f < K.options.length) {
                    let v = K.options[f];
                    if (v.disabled === !0) return;
                    if (v.type === "input") {
                        if (($?.get(v.value) ?? "").trim()) {
                            K.onChange?.(v.value);
                            return
                        }
                        if (v.allowEmptySubmitToCancel) {
                            K.onChange?.(v.value);
                            return
                        }
                        K.focusOption(v.value);
                        return
                    }
                    K.onChange?.(v.value);
                    return
                }
            }
        }
    }, {
        isActive: !A
    })
}
// @from(Ln 284362, Col 4)
df4 = E(() => {
    i6();
    fZ();
    _7();
    hL8 = t(P6(), 1)
})
// @from(Ln 284378, Col 0)
function cf4() {
    let A = process.platform,
        q = process.env.CLAUDE_CODE_TMPDIR || (A === "win32" ? process.env.TEMP || "C:\\Temp" : "/tmp"),
        K = "claude_cli_latest_screenshot.png",
        Y = {
            darwin: SL8(q, "claude_cli_latest_screenshot.png"),
            linux: SL8(q, "claude_cli_latest_screenshot.png"),
            win32: SL8(q, "claude_cli_latest_screenshot.png")
        },
        z = Y[A] || Y.linux,
        _ = {
            darwin: {
                checkImage: "osascript -e 'the clipboard as «class PNGf»'",
                saveImage: `osascript -e 'set png_data to (the clipboard as «class PNGf»)' -e 'set fp to open for access POSIX file "${z}" with write permission' -e 'write png_data to fp' -e 'close access fp'`,
                getPath: "osascript -e 'get POSIX path of (the clipboard as «class furl»)'",
                deleteFile: `rm -f "${z}"`
            },
            linux: {
                checkImage: 'xclip -selection clipboard -t TARGETS -o 2>/dev/null | grep -E "image/(png|jpeg|jpg|gif|webp|bmp)" || wl-paste -l 2>/dev/null | grep -E "image/(png|jpeg|jpg|gif|webp|bmp)"',
                saveImage: `xclip -selection clipboard -t image/png -o > "${z}" 2>/dev/null || wl-paste --type image/png > "${z}" 2>/dev/null || xclip -selection clipboard -t image/bmp -o > "${z}" 2>/dev/null || wl-paste --type image/bmp > "${z}"`,
                getPath: "xclip -selection clipboard -t text/plain -o 2>/dev/null || wl-paste 2>/dev/null",
                deleteFile: `rm -f "${z}"`
            },
            win32: {
                checkImage: 'powershell -NoProfile -Command "(Get-Clipboard -Format Image) -ne $null"',
                saveImage: `powershell -NoProfile -Command "$img = Get-Clipboard -Format Image; if ($img) { $img.Save('${z.replace(/\\/g,"\\\\")}', [System.Drawing.Imaging.ImageFormat]::Png) }"`,
                getPath: 'powershell -NoProfile -Command "Get-Clipboard"',
                deleteFile: `del /f "${z}"`
            }
        };
    return {
        commands: _[A] || _.linux,
        screenshotPath: z
    }
}
// @from(Ln 284413, Col 0)
async function lf4() {
    if (process.platform !== "darwin") return !1;
    if (w8("tengu_collage_kaleidoscope", !0)) try {
        let {
            getNativeModule: q
        } = await Promise.resolve().then(() => (kX1(), VX1)), K = q()?.hasClipboardImage;
        if (K) return K()
    } catch (q) {
        _6(q)
    }
    return (await RA("osascript", ["-e", "the clipboard as «class PNGf»"])).code === 0
}
// @from(Ln 284425, Col 0)
async function oZ6() {
    if (process.platform === "darwin" && w8("tengu_collage_kaleidoscope", !0)) try {
        let {
            getNativeModule: K
        } = await Promise.resolve().then(() => (kX1(), VX1)), Y = K()?.readClipboardImage;
        if (!Y) throw Error("native clipboard reader unavailable");
        let z = Y(WB, ZB);
        if (!z) return null;
        let _ = z.png;
        if (_.length > xk) {
            let w = await Bk(_, _.length, "png");
            return {
                base64: w.buffer.toString("base64"),
                mediaType: `image/${w.mediaType}`,
                dimensions: {
                    originalWidth: z.originalWidth,
                    originalHeight: z.originalHeight,
                    displayWidth: w.dimensions?.displayWidth ?? z.width,
                    displayHeight: w.dimensions?.displayHeight ?? z.height
                }
            }
        }
        return {
            base64: _.toString("base64"),
            mediaType: "image/png",
            dimensions: {
                originalWidth: z.originalWidth,
                originalHeight: z.originalHeight,
                displayWidth: z.width,
                displayHeight: z.height
            }
        }
    } catch (K) {
        _6(K)
    }
    let {
        commands: A,
        screenshotPath: q
    } = cf4();
    try {
        if ((await q9(A.checkImage, {
                shell: !0,
                reject: !1
            })).exitCode !== 0) return null;
        if ((await q9(A.saveImage, {
                shell: !0,
                reject: !1
            })).exitCode !== 0) return null;
        let z = $1().readFileBytesSync(q);
        if (z.length >= 2 && z[0] === 66 && z[1] === 77) z = await (await _W6())(z).png().toBuffer();
        let _ = await Bk(z, z.length, "png"),
            w = _.buffer.toString("base64"),
            O = fv8(w);
        return q9(A.deleteFile, {
            shell: !0,
            reject: !1
        }), {
            base64: w,
            mediaType: O,
            dimensions: _.dimensions
        }
    } catch {
        return null
    }
}
// @from(Ln 284490, Col 0)
async function W8Y() {
    let {
        commands: A
    } = cf4();
    try {
        let q = await q9(A.getPath, {
            shell: !0,
            reject: !1
        });
        if (q.exitCode !== 0 || !q.stdout) return null;
        return q.stdout.trim()
    } catch (q) {
        return _6(q), null
    }
}
// @from(Ln 284506, Col 0)
function if4(A) {
    if (A.startsWith('"') && A.endsWith('"') || A.startsWith("'") && A.endsWith("'")) return A.slice(1, -1);
    return A
}
// @from(Ln 284511, Col 0)
function nf4(A) {
    if (process.platform === "win32") return A;
    let Y = `__DOUBLE_BACKSLASH_${J8Y(8).toString("hex")}__`;
    return A.replace(/\\\\/g, Y).replace(/\\(.)/g, "$1").replace(new RegExp(Y, "g"), "\\")
}
// @from(Ln 284517, Col 0)
function PG1(A) {
    let q = if4(A.trim()),
        K = nf4(q);
    return XG1.test(K)
}
// @from(Ln 284523, Col 0)
function Z8Y(A) {
    let q = if4(A.trim()),
        K = nf4(q);
    if (XG1.test(K)) return K;
    return null
}
// @from(Ln 284529, Col 0)
async function rf4(A) {
    let q = Z8Y(A);
    if (!q) return null;
    let K = q,
        Y;
    try {
        if (X8Y(K)) Y = $1().readFileBytesSync(K);
        else {
            let $ = await W8Y();
            if ($ && K === M8Y($)) Y = $1().readFileBytesSync($)
        }
    } catch ($) {
        return _6($), null
    }
    if (!Y) return null;
    if (Y.length >= 2 && Y[0] === 66 && Y[1] === 77) Y = await (await _W6())(Y).png().toBuffer();
    let z = D8Y(K).slice(1).toLowerCase() || "png",
        _ = await Bk(Y, Y.length, z),
        w = _.buffer.toString("base64"),
        O = fv8(w);
    return {
        path: K,
        base64: w,
        mediaType: O,
        dimensions: _.dimensions
    }
}
// @from(Ln 284556, Col 4)
DG1 = 800
// @from(Ln 284557, Col 4)
XG1
// @from(Ln 284558, Col 4)
aZ6 = E(() => {
    Eq();
    WW();
    SA();
    k1();
    jR();
    Gv8();
    HA();
    XG1 = /\.(png|jpe?g|gif|webp|bmp)$/i
})
// @from(Ln 284576, Col 0)
function af4() {
    return WG1(c8(), of4, R1())
}
// @from(Ln 284579, Col 0)
async function v8Y() {
    let A = af4();
    await f8Y(A, {
        recursive: !0
    })
}
// @from(Ln 284586, Col 0)
function sf4(A, q) {
    let K = q.split("/")[1] || "png";
    return WG1(af4(), `${A}.${K}`)
}
// @from(Ln 284591, Col 0)
function sZ6(A) {
    if (A.type !== "image") return null;
    let q = sf4(A.id, A.mediaType || "image/png");
    return AT4(), d96.set(A.id, q), q
}
// @from(Ln 284596, Col 0)
async function c96(A) {
    if (A.type !== "image") return null;
    try {
        await v8Y();
        let q = sf4(A.id, A.mediaType || "image/png"),
            K = await G8Y(q, "w", 384);
        try {
            await K.writeFile(A.content, {
                encoding: "base64"
            }), await K.datasync()
        } finally {
            await K.close()
        }
        return AT4(), d96.set(A.id, q), k(`Stored image ${A.id} to ${q}`), q
    } catch (q) {
        return k(`Failed to store image: ${q}`), null
    }
}
// @from(Ln 284614, Col 0)
async function tf4(A) {
    let q = new Map;
    for (let [K, Y] of Object.entries(A))
        if (Y.type === "image") {
            let z = await c96(Y);
            if (z) q.set(Number(K), z)
        } return q
}
// @from(Ln 284623, Col 0)
function ZG1(A) {
    return d96.get(A) ?? null
}
// @from(Ln 284627, Col 0)
function ef4() {
    d96.clear()
}
// @from(Ln 284631, Col 0)
function AT4() {
    while (d96.size >= T8Y) {
        let A = d96.keys().next().value;
        if (A !== void 0) d96.delete(A);
        else break
    }
}
// @from(Ln 284638, Col 0)
async function qT4() {
    let A = $1(),
        q = WG1(c8(), of4),
        K = R1();
    try {
        let Y;
        try {
            Y = await A.readdir(q)
        } catch {
            return
        }
        for (let z of Y) {
            if (z.name === K) continue;
            let _ = WG1(q, z.name);
            try {
                await A.rm(_, {
                    recursive: !0,
                    force: !0
                }), k(`Cleaned up old image cache: ${_}`)
            } catch {}
        }
        try {
            if ((await A.readdir(q)).length === 0) await A.rmdir(q)
        } catch {}
    } catch {}
}
// @from(Ln 284664, Col 4)
of4 = "image-cache"
// @from(Ln 284665, Col 4)
T8Y = 200
// @from(Ln 284666, Col 4)
d96
// @from(Ln 284667, Col 4)
Sc = E(() => {
    A8();
    T1();
    SA();
    H1();
    d96 = new Map
})
// @from(Ln 284678, Col 0)
function GG1(A) {
    let q = A6(13),
        {
            imageId: K,
            backgroundColor: Y,
            isSelected: z
        } = A,
        _ = z === void 0 ? !1 : z,
        w = ZG1(K),
        O = `[Image #${K}]`;
    if (w && cG()) {
        let H = N8Y(w).href,
            j, J;
        if (q[0] !== Y || q[1] !== O || q[2] !== _) j = Cc.createElement(T, {
            backgroundColor: Y,
            inverse: _
        }, O), J = Cc.createElement(T, {
            backgroundColor: Y,
            inverse: _,
            bold: _
        }, O), q[0] = Y, q[1] = O, q[2] = _, q[3] = j, q[4] = J;
        else j = q[3], J = q[4];
        let M;
        if (q[5] !== H || q[6] !== j || q[7] !== J) M = Cc.createElement(y7, {
            url: H,
            fallback: j
        }, J), q[5] = H, q[6] = j, q[7] = J, q[8] = M;
        else M = q[8];
        return M
    }
    let $;
    if (q[9] !== Y || q[10] !== O || q[11] !== _) $ = Cc.createElement(T, {
        backgroundColor: Y,
        inverse: _
    }, O), q[9] = Y, q[10] = O, q[11] = _, q[12] = $;
    else $ = q[12];
    return $
}
// @from(Ln 284716, Col 4)
Cc
// @from(Ln 284717, Col 4)
CL8 = E(() => {
    e6();
    i6();
    IK6();
    Sc();
    mU();
    Cc = t(P6(), 1)
})
// @from(Ln 284726, Col 0)
function tZ6(A) {
    let q = A6(100),
        {
            option: K,
            isFocused: Y,
            isSelected: z,
            shouldShowDownArrow: _,
            shouldShowUpArrow: w,
            maxIndexWidth: O,
            index: $,
            inputValue: H,
            onInputChange: j,
            onSubmit: J,
            onExit: M,
            layout: D,
            children: X,
            showLabel: P,
            onOpenEditor: W,
            resetCursorOnUpdate: Z,
            onImagePaste: G,
            pastedContents: f,
            onRemoveImage: v,
            imagesSelected: N,
            selectedImageIndex: V,
            onImagesSelectedChange: L,
            onSelectedImageIndexChange: h
        } = A,
        R = P === void 0 ? !1 : P,
        u = Z === void 0 ? !1 : Z,
        I = V === void 0 ? 0 : V,
        g;
    if (q[0] !== f) g = f ? Object.values(f).filter(V8Y) : [], q[0] = f, q[1] = g;
    else g = q[1];
    let B = g,
        b = R || K.showLabelWithValue === !0,
        [p, Q] = r9.useState(H.length),
        U = r9.useRef(!1),
        r;
    if (q[2] !== H.length || q[3] !== Y || q[4] !== u) r = () => {
        if (u && Y)
            if (U.current) U.current = !1;
            else Q(H.length)
    }, q[2] = H.length, q[3] = Y, q[4] = u, q[5] = r;
    else r = q[5];
    let e;
    if (q[6] !== H || q[7] !== Y || q[8] !== u) e = [u, Y, H], q[6] = H, q[7] = Y, q[8] = u, q[9] = e;
    else e = q[9];
    r9.useEffect(r, e);
    let Y6;
    if (q[10] !== H || q[11] !== j || q[12] !== W) Y6 = () => {
        W?.(H, j)
    }, q[10] = H, q[11] = j, q[12] = W, q[13] = Y6;
    else Y6 = q[13];
    let H6 = Y && !!W,
        J6;
    if (q[14] !== H6) J6 = {
        context: "Chat",
        isActive: H6
    }, q[14] = H6, q[15] = J6;
    else J6 = q[15];
    D8("chat:externalEditor", Y6, J6);
    let K6;
    if (q[16] !== G) K6 = () => {
        if (!G) return;
        oZ6().then((c6) => {
            if (c6) G(c6.base64, c6.mediaType, void 0, c6.dimensions)
        })
    }, q[16] = G, q[17] = K6;
    else K6 = q[17];
    let s = Y && !!G,
        X6;
    if (q[18] !== s) X6 = {
        context: "Chat",
        isActive: s
    }, q[18] = s, q[19] = X6;
    else X6 = q[19];
    D8("chat:imagePaste", K6, X6);
    let z6;
    if (q[20] !== B || q[21] !== v) z6 = () => {
        if (B.length > 0 && v) v(B[B.length - 1].id)
    }, q[20] = B, q[21] = v, q[22] = z6;
    else z6 = q[22];
    let N6 = Y && !N && H === "" && B.length > 0 && !!v,
        $6;
    if (q[23] !== N6) $6 = {
        context: "Attachments",
        isActive: N6
    }, q[23] = N6, q[24] = $6;
    else $6 = q[24];
    D8("attachments:remove", z6, $6);
    let n, o;
    if (q[25] !== B.length || q[26] !== h || q[27] !== I) n = () => {
        if (B.length > 1) h?.((I + 1) % B.length)
    }, o = () => {
        if (B.length > 1) h?.((I - 1 + B.length) % B.length)
    }, q[25] = B.length, q[26] = h, q[27] = I, q[28] = n, q[29] = o;
    else n = q[28], o = q[29];
    let a;
    if (q[30] !== B || q[31] !== L || q[32] !== v || q[33] !== h || q[34] !== I) a = () => {
        let c6 = B[I];
        if (c6 && v)
            if (v(c6.id), B.length <= 1) L?.(!1);
            else h?.(Math.min(I, B.length - 2))
    }, q[30] = B, q[31] = L, q[32] = v, q[33] = h, q[34] = I, q[35] = a;
    else a = q[35];
    let i;
    if (q[36] !== L) i = () => {
        L?.(!1)
    }, q[36] = L, q[37] = i;
    else i = q[37];
    let l;
    if (q[38] !== n || q[39] !== o || q[40] !== a || q[41] !== i) l = {
        "attachments:next": n,
        "attachments:previous": o,
        "attachments:remove": a,
        "attachments:exit": i
    }, q[38] = n, q[39] = o, q[40] = a, q[41] = i, q[42] = l;
    else l = q[42];
    let q6 = Y && !!N,
        w6;
    if (q[43] !== q6) w6 = {
        context: "Attachments",
        isActive: q6
    }, q[43] = q6, q[44] = w6;
    else w6 = q[44];
    tA(l, w6);
    let O6;
    if (q[45] !== L) O6 = (c6, K1) => {
        if (K1.upArrow) L?.(!1)
    }, q[45] = L, q[46] = O6;
    else O6 = q[46];
    let L6 = Y && !!N,
        y6;
    if (q[47] !== L6) y6 = {
        isActive: L6
    }, q[47] = L6, q[48] = y6;
    else y6 = q[48];
    jA(O6, y6);
    let G6, R6;
    if (q[49] !== N || q[50] !== Y || q[51] !== L) G6 = () => {
        if (!Y && N) L?.(!1)
    }, R6 = [Y, N, L], q[49] = N, q[50] = Y, q[51] = L, q[52] = G6, q[53] = R6;
    else G6 = q[52], R6 = q[53];
    r9.useEffect(G6, R6);
    let T6 = D === "expanded" ? O + 3 : O + 4,
        D6 = D === "compact" ? 0 : void 0,
        Q6 = `${$}.`,
        k6;
    if (q[54] !== O || q[55] !== Q6) k6 = Q6.padEnd(O + 2), q[54] = O, q[55] = Q6, q[56] = k6;
    else k6 = q[56];
    let Z6;
    if (q[57] !== k6) Z6 = r9.default.createElement(T, {
        dimColor: !0
    }, k6), q[57] = k6, q[58] = Z6;
    else Z6 = q[58];
    let u6;
    if (q[59] !== p || q[60] !== N || q[61] !== H || q[62] !== Y || q[63] !== M || q[64] !== G || q[65] !== j || q[66] !== J || q[67] !== K || q[68] !== b) u6 = b ? r9.default.createElement(r9.default.Fragment, null, r9.default.createElement(T, {
        color: Y ? "suggestion" : void 0
    }, K.label), Y ? r9.default.createElement(r9.default.Fragment, null, r9.default.createElement(T, {
        color: "suggestion"
    }, K.labelValueSeparator ?? ", "), r9.default.createElement(J5, {
        value: H,
        onChange: (c6) => {
            U.current = !0, j(c6), K.onChange(c6)
        },
        onSubmit: J,
        onExit: M,
        placeholder: K.placeholder,
        focus: !N,
        showCursor: !0,
        multiline: !0,
        cursorOffset: p,
        onChangeCursorOffset: Q,
        columns: 80,
        onImagePaste: G,
        onPaste: (c6) => {
            U.current = !0;
            let K1 = H.slice(0, p),
                j6 = H.slice(p),
                W6 = K1 + c6 + j6;
            j(W6), K.onChange(W6), Q(K1.length + c6.length)
        }
    })) : H && r9.default.createElement(T, null, K.labelValueSeparator ?? ", ", H)) : Y ? r9.default.createElement(J5, {
        value: H,
        onChange: (c6) => {
            U.current = !0, j(c6), K.onChange(c6)
        },
        onSubmit: J,
        onExit: M,
        placeholder: K.placeholder || (typeof K.label === "string" ? K.label : void 0),
        focus: !N,
        showCursor: !0,
        multiline: !0,
        cursorOffset: p,
        onChangeCursorOffset: Q,
        columns: 80,
        onImagePaste: G,
        onPaste: (c6) => {
            U.current = !0;
            let K1 = H.slice(0, p),
                j6 = H.slice(p),
                W6 = K1 + c6 + j6;
            j(W6), K.onChange(W6), Q(K1.length + c6.length)
        }
    }) : r9.default.createElement(T, {
        color: H ? void 0 : "inactive"
    }, H || K.placeholder || K.label), q[59] = p, q[60] = N, q[61] = H, q[62] = Y, q[63] = M, q[64] = G, q[65] = j, q[66] = J, q[67] = K, q[68] = b, q[69] = u6;
    else u6 = q[69];
    let C6;
    if (q[70] !== X || q[71] !== D6 || q[72] !== Z6 || q[73] !== u6) C6 = r9.default.createElement(m, {
        flexDirection: "row",
        flexShrink: D6
    }, Z6, X, u6), q[70] = X, q[71] = D6, q[72] = Z6, q[73] = u6, q[74] = C6;
    else C6 = q[74];
    let o6;
    if (q[75] !== Y || q[76] !== z || q[77] !== _ || q[78] !== w || q[79] !== C6) o6 = r9.default.createElement(Re, {
        isFocused: Y,
        isSelected: z,
        shouldShowDownArrow: _,
        shouldShowUpArrow: w
    }, C6), q[75] = Y, q[76] = z, q[77] = _, q[78] = w, q[79] = C6, q[80] = o6;
    else o6 = q[80];
    let V6;
    if (q[81] !== T6 || q[82] !== Y || q[83] !== z || q[84] !== K.description || q[85] !== K.dimDescription) V6 = K.description && r9.default.createElement(m, {
        paddingLeft: T6
    }, r9.default.createElement(T, {
        dimColor: K.dimDescription !== !1,
        color: z ? "success" : Y ? "suggestion" : void 0
    }, K.description)), q[81] = T6, q[82] = Y, q[83] = z, q[84] = K.description, q[85] = K.dimDescription, q[86] = V6;
    else V6 = q[86];
    let b6;
    if (q[87] !== T6 || q[88] !== B || q[89] !== N || q[90] !== Y || q[91] !== I) b6 = B.length > 0 && r9.default.createElement(m, {
        flexDirection: "row",
        gap: 1,
        paddingLeft: T6
    }, B.map((c6, K1) => r9.default.createElement(GG1, {
        key: c6.id,
        imageId: c6.id,
        isSelected: !!N && K1 === I
    })), r9.default.createElement(m, {
        flexGrow: 1,
        justifyContent: "flex-start",
        flexDirection: "row"
    }, r9.default.createElement(T, {
        dimColor: !0
    }, N ? r9.default.createElement(C8, null, B.length > 1 && r9.default.createElement(r9.default.Fragment, null, r9.default.createElement(O8, {
        action: "attachments:next",
        context: "Attachments",
        fallback: "→",
        description: "next"
    }), r9.default.createElement(O8, {
        action: "attachments:previous",
        context: "Attachments",
        fallback: "←",
        description: "prev"
    })), r9.default.createElement(O8, {
        action: "attachments:remove",
        context: "Attachments",
        fallback: "backspace",
        description: "remove"
    }), r9.default.createElement(O8, {
        action: "attachments:exit",
        context: "Attachments",
        fallback: "esc",
        description: "cancel"
    })) : Y ? "(↓ to select)" : null))), q[87] = T6, q[88] = B, q[89] = N, q[90] = Y, q[91] = I, q[92] = b6;
    else b6 = q[92];
    let E6;
    if (q[93] !== D) E6 = D === "expanded" && r9.default.createElement(T, null, " "), q[93] = D, q[94] = E6;
    else E6 = q[94];
    let U6;
    if (q[95] !== o6 || q[96] !== V6 || q[97] !== b6 || q[98] !== E6) U6 = r9.default.createElement(m, {
        flexDirection: "column",
        flexShrink: 0
    }, o6, V6, b6, E6), q[95] = o6, q[96] = V6, q[97] = b6, q[98] = E6, q[99] = U6;
    else U6 = q[99];
    return U6
}
// @from(Ln 285005, Col 0)
function V8Y(A) {
    return A.type === "image"
}
// @from(Ln 285008, Col 4)
r9
// @from(Ln 285009, Col 4)
IL8 = E(() => {
    e6();
    i6();
    $G1();
    AH();
    _7();
    aZ6();
    CL8();
    OK();
    Xq();
    r9 = t(P6(), 1)
})
// @from(Ln 285022, Col 0)
function fG1(A) {
    if (typeof A === "string") return A;
    if (typeof A === "number") return String(A);
    if (!A) return "";
    if (Array.isArray(A)) return A.map(fG1).join("");
    if (F4.default.isValidElement(A)) return fG1(A.props.children);
    return ""
}
// @from(Ln 285031, Col 0)
function T8(A) {
    let q = A6(72),
        {
            isDisabled: K,
            hideIndexes: Y,
            visibleOptionCount: z,
            highlightText: _,
            options: w,
            defaultValue: O,
            onCancel: $,
            onChange: H,
            onFocus: j,
            defaultFocusValue: J,
            layout: M,
            disableSelection: D,
            inlineDescriptions: X,
            onUpFromFirstItem: P,
            onDownFromLastItem: W,
            onInputModeToggle: Z,
            onOpenEditor: G,
            onImagePaste: f,
            pastedContents: v,
            onRemoveImage: N
        } = A,
        V = K === void 0 ? !1 : K,
        L = Y === void 0 ? !1 : Y,
        h = z === void 0 ? 5 : z,
        R = M === void 0 ? "compact" : M,
        u = D === void 0 ? !1 : D,
        I = X === void 0 ? !1 : X,
        [g, B] = F4.useState(!1),
        [b, p] = F4.useState(0),
        Q;
    if (q[0] !== w) Q = () => {
        let l = new Map;
        return w.forEach((q6) => {
            if (q6.type === "input" && q6.initialValue) l.set(q6.value, q6.initialValue)
        }), l
    }, q[0] = w, q[1] = Q;
    else Q = q[1];
    let [U, r] = F4.useState(Q), e;
    if (q[2] === Symbol.for("react.memo_cache_sentinel")) e = new Map, q[2] = e;
    else e = q[2];
    let Y6 = F4.useRef(e),
        H6, J6;
    if (q[3] !== U || q[4] !== w) J6 = () => {
        for (let l of w)
            if (l.type === "input" && l.initialValue !== void 0) {
                let q6 = Y6.current.get(l.value) ?? "",
                    w6 = U.get(l.value) ?? "",
                    O6 = l.initialValue;
                if (O6 !== q6 && w6 === q6) r((L6) => {
                    let y6 = new Map(L6);
                    return y6.set(l.value, O6), y6
                });
                Y6.current.set(l.value, O6)
            }
    }, H6 = [w, U], q[3] = U, q[4] = w, q[5] = H6, q[6] = J6;
    else H6 = q[5], J6 = q[6];
    F4.useEffect(J6, H6);
    let K6;
    if (q[7] !== J || q[8] !== O || q[9] !== $ || q[10] !== H || q[11] !== j || q[12] !== w || q[13] !== h) K6 = {
        visibleOptionCount: h,
        options: w,
        defaultValue: O,
        onChange: H,
        onCancel: $,
        onFocus: j,
        focusValue: J
    }, q[7] = J, q[8] = O, q[9] = $, q[10] = H, q[11] = j, q[12] = w, q[13] = h, q[14] = K6;
    else K6 = q[14];
    let s = Ff4(K6),
        X6 = u || (L ? "numeric" : !1),
        z6;
    if (q[15] !== v) z6 = () => {
        if (v && Object.values(v).some(I8Y)) {
            let l = Object.values(v).filter(C8Y).length;
            return B(!0), p(l - 1), !0
        }
        return !1
    }, q[15] = v, q[16] = z6;
    else z6 = q[16];
    let N6;
    if (q[17] !== g || q[18] !== U || q[19] !== V || q[20] !== W || q[21] !== Z || q[22] !== P || q[23] !== w || q[24] !== s || q[25] !== X6 || q[26] !== z6) N6 = {
        isDisabled: V,
        disableSelection: X6,
        state: s,
        options: w,
        isMultiSelect: !1,
        onUpFromFirstItem: P,
        onDownFromLastItem: W,
        onInputModeToggle: Z,
        inputValues: U,
        imagesSelected: g,
        onEnterImageSelection: z6
    }, q[17] = g, q[18] = U, q[19] = V, q[20] = W, q[21] = Z, q[22] = P, q[23] = w, q[24] = s, q[25] = X6, q[26] = z6, q[27] = N6;
    else N6 = q[27];
    Uf4(N6);
    let $6, n, o, a;
    if (q[28] !== L || q[29] !== _ || q[30] !== g || q[31] !== I || q[32] !== U || q[33] !== V || q[34] !== R || q[35] !== $ || q[36] !== H || q[37] !== f || q[38] !== G || q[39] !== N || q[40] !== w.length || q[41] !== v || q[42] !== b || q[43] !== s.focusedValue || q[44] !== s.options || q[45] !== s.value || q[46] !== s.visibleFromIndex || q[47] !== s.visibleOptions || q[48] !== s.visibleToIndex) {
        a = Symbol.for("react.early_return_sentinel");
        A: {
            let l = {
                container: S8Y,
                highlightedText: h8Y
            };
            if (R === "expanded") {
                let G6;
                if (q[53] !== s.options.length) G6 = s.options.length.toString(), q[53] = s.options.length, q[54] = G6;
                else G6 = q[54];
                let R6 = G6.length;
                a = F4.default.createElement(m, {
                    ...l.container()
                }, s.visibleOptions.map((T6, D6) => {
                    let Q6 = T6.index === s.visibleFromIndex,
                        k6 = T6.index === s.visibleToIndex - 1,
                        Z6 = s.visibleToIndex < w.length,
                        u6 = s.visibleFromIndex > 0,
                        C6 = s.visibleFromIndex + D6 + 1,
                        o6 = !V && s.focusedValue === T6.value,
                        V6 = s.value === T6.value;
                    if (T6.type === "input") {
                        let c6 = U.has(T6.value) ? U.get(T6.value) : T6.initialValue || "";
                        return F4.default.createElement(tZ6, {
                            key: String(T6.value),
                            option: T6,
                            isFocused: o6,
                            isSelected: V6,
                            shouldShowDownArrow: Z6 && k6,
                            shouldShowUpArrow: u6 && Q6,
                            maxIndexWidth: R6,
                            index: C6,
                            inputValue: c6,
                            onInputChange: (K1) => {
                                r((j6) => {
                                    let W6 = new Map(j6);
                                    return W6.set(T6.value, K1), W6
                                })
                            },
                            onSubmit: (K1) => {
                                let j6 = v && Object.values(v).some(R8Y);
                                if (K1.trim() || j6 || T6.allowEmptySubmitToCancel) H?.(T6.value);
                                else $?.()
                            },
                            onExit: $,
                            layout: "expanded",
                            showLabel: I,
                            onOpenEditor: G,
                            resetCursorOnUpdate: T6.resetCursorOnUpdate,
                            onImagePaste: f,
                            pastedContents: v,
                            onRemoveImage: N,
                            imagesSelected: g,
                            selectedImageIndex: b,
                            onImagesSelectedChange: B,
                            onSelectedImageIndexChange: p
                        })
                    }
                    let b6 = T6.label;
                    if (typeof T6.label === "string" && _ && T6.label.includes(_)) {
                        let c6 = T6.label,
                            K1 = c6.indexOf(_);
                        b6 = F4.default.createElement(F4.default.Fragment, null, c6.slice(0, K1), F4.default.createElement(T, {
                            ...l.highlightedText()
                        }, _), c6.slice(K1 + _.length))
                    }
                    let E6 = T6.disabled === !0,
                        U6 = E6 ? void 0 : V6 ? "success" : o6 ? "suggestion" : void 0;
                    return F4.default.createElement(m, {
                        key: String(T6.value),
                        flexDirection: "column",
                        flexShrink: 0
                    }, F4.default.createElement(Re, {
                        isFocused: o6,
                        isSelected: V6,
                        shouldShowDownArrow: Z6 && k6,
                        shouldShowUpArrow: u6 && Q6
                    }, F4.default.createElement(T, {
                        dimColor: E6,
                        color: U6
                    }, b6)), T6.description && F4.default.createElement(m, {
                        paddingLeft: 2
                    }, F4.default.createElement(T, {
                        dimColor: E6 || T6.dimDescription !== !1,
                        color: U6
                    }, F4.default.createElement(wK, null, T6.description))), F4.default.createElement(T, null, " "))
                }));
                break A
            }
            if (R === "compact-vertical") {
                let G6;
                if (q[55] !== L || q[56] !== s.options) G6 = L ? 0 : s.options.length.toString().length, q[55] = L, q[56] = s.options, q[57] = G6;
                else G6 = q[57];
                let R6 = G6;
                a = F4.default.createElement(m, {
                    ...l.container()
                }, s.visibleOptions.map((T6, D6) => {
                    let Q6 = T6.index === s.visibleFromIndex,
                        k6 = T6.index === s.visibleToIndex - 1,
                        Z6 = s.visibleToIndex < w.length,
                        u6 = s.visibleFromIndex > 0,
                        C6 = s.visibleFromIndex + D6 + 1,
                        o6 = !V && s.focusedValue === T6.value,
                        V6 = s.value === T6.value;
                    if (T6.type === "input") {
                        let U6 = U.has(T6.value) ? U.get(T6.value) : T6.initialValue || "";
                        return F4.default.createElement(tZ6, {
                            key: String(T6.value),
                            option: T6,
                            isFocused: o6,
                            isSelected: V6,
                            shouldShowDownArrow: Z6 && k6,
                            shouldShowUpArrow: u6 && Q6,
                            maxIndexWidth: R6,
                            index: C6,
                            inputValue: U6,
                            onInputChange: (c6) => {
                                r((K1) => {
                                    let j6 = new Map(K1);
                                    return j6.set(T6.value, c6), j6
                                })
                            },
                            onSubmit: (c6) => {
                                let K1 = v && Object.values(v).some(L8Y);
                                if (c6.trim() || K1 || T6.allowEmptySubmitToCancel) H?.(T6.value);
                                else $?.()
                            },
                            onExit: $,
                            layout: "compact",
                            showLabel: I,
                            onOpenEditor: G,
                            resetCursorOnUpdate: T6.resetCursorOnUpdate,
                            onImagePaste: f,
                            pastedContents: v,
                            onRemoveImage: N,
                            imagesSelected: g,
                            selectedImageIndex: b,
                            onImagesSelectedChange: B,
                            onSelectedImageIndexChange: p
                        })
                    }
                    let b6 = T6.label;
                    if (typeof T6.label === "string" && _ && T6.label.includes(_)) {
                        let U6 = T6.label,
                            c6 = U6.indexOf(_);
                        b6 = F4.default.createElement(F4.default.Fragment, null, U6.slice(0, c6), F4.default.createElement(T, {
                            ...l.highlightedText()
                        }, _), U6.slice(c6 + _.length))
                    }
                    let E6 = T6.disabled === !0;
                    return F4.default.createElement(m, {
                        key: String(T6.value),
                        flexDirection: "column",
                        flexShrink: 0
                    }, F4.default.createElement(Re, {
                        isFocused: o6,
                        isSelected: V6,
                        shouldShowDownArrow: Z6 && k6,
                        shouldShowUpArrow: u6 && Q6
                    }, F4.default.createElement(F4.default.Fragment, null, !L && F4.default.createElement(T, {
                        dimColor: !0
                    }, `${C6}.`.padEnd(R6 + 1)), F4.default.createElement(T, {
                        dimColor: E6,
                        color: E6 ? void 0 : V6 ? "success" : o6 ? "suggestion" : void 0
                    }, b6))), T6.description && F4.default.createElement(m, {
                        paddingLeft: L ? 4 : R6 + 4
                    }, F4.default.createElement(T, {
                        dimColor: E6 || T6.dimDescription !== !1,
                        color: E6 ? void 0 : V6 ? "success" : o6 ? "suggestion" : void 0
                    }, F4.default.createElement(wK, null, T6.description))))
                }));
                break A
            }
            let q6;
            if (q[58] !== L || q[59] !== s.options) q6 = L ? 0 : s.options.length.toString().length,
            q[58] = L,
            q[59] = s.options,
            q[60] = q6;
            else q6 = q[60];
            let w6 = q6,
                O6 = s.visibleOptions.some(y8Y),
                L6 = !I && !O6 && s.visibleOptions.some(E8Y),
                y6 = s.visibleOptions.map((G6, R6) => {
                    let T6 = G6.index === s.visibleFromIndex,
                        D6 = G6.index === s.visibleToIndex - 1,
                        Q6 = s.visibleToIndex < w.length,
                        k6 = s.visibleFromIndex > 0,
                        Z6 = s.visibleFromIndex + R6 + 1,
                        u6 = !V && s.focusedValue === G6.value,
                        C6 = s.value === G6.value,
                        o6 = G6.disabled === !0,
                        V6 = G6.label;
                    if (typeof G6.label === "string" && _ && G6.label.includes(_)) {
                        let b6 = G6.label,
                            E6 = b6.indexOf(_);
                        V6 = F4.default.createElement(F4.default.Fragment, null, b6.slice(0, E6), F4.default.createElement(T, {
                            ...l.highlightedText()
                        }, _), b6.slice(E6 + _.length))
                    }
                    return {
                        option: G6,
                        index: Z6,
                        label: V6,
                        isFocused: u6,
                        isSelected: C6,
                        isOptionDisabled: o6,
                        shouldShowDownArrow: Q6 && D6,
                        shouldShowUpArrow: k6 && T6
                    }
                });
            if (L6) {
                let G6;
                if (q[61] !== L || q[62] !== w6) G6 = (D6) => {
                    if (D6.option.type === "input") return 0;
                    let Q6 = fG1(D6.option.label),
                        k6 = L ? 0 : w6 + 2,
                        Z6 = D6.isSelected ? 2 : 0;
                    return 2 + k6 + f8(Q6) + Z6
                }, q[61] = L, q[62] = w6, q[63] = G6;
                else G6 = q[63];
                let R6 = Math.max(...y6.map(G6)),
                    T6;
                if (q[64] !== L || q[65] !== w6 || q[66] !== R6) T6 = (D6) => {
                    if (D6.option.type === "input") return null;
                    let Q6 = fG1(D6.option.label),
                        k6 = L ? 0 : w6 + 2,
                        Z6 = D6.isSelected ? 2 : 0,
                        u6 = 2 + k6 + f8(Q6) + Z6,
                        C6 = R6 - u6;
                    return F4.default.createElement(m, {
                        key: String(D6.option.value),
                        flexDirection: "row"
                    }, F4.default.createElement(m, {
                        flexDirection: "row",
                        flexShrink: 0
                    }, D6.isFocused ? F4.default.createElement(T, {
                        color: "suggestion"
                    }, a6.pointer) : D6.shouldShowDownArrow ? F4.default.createElement(T, {
                        dimColor: !0
                    }, a6.arrowDown) : D6.shouldShowUpArrow ? F4.default.createElement(T, {
                        dimColor: !0
                    }, a6.arrowUp) : F4.default.createElement(T, null, " "), F4.default.createElement(T, null, " "), F4.default.createElement(T, {
                        dimColor: D6.isOptionDisabled,
                        color: D6.isOptionDisabled ? void 0 : D6.isSelected ? "success" : D6.isFocused ? "suggestion" : void 0
                    }, !L && F4.default.createElement(T, {
                        dimColor: !0
                    }, `${D6.index}.`.padEnd(w6 + 2)), D6.label), D6.isSelected && F4.default.createElement(T, {
                        color: "success"
                    }, " ", a6.tick), C6 > 0 && F4.default.createElement(T, null, " ".repeat(C6))), F4.default.createElement(m, {
                        flexGrow: 1,
                        marginLeft: 2
                    }, F4.default.createElement(T, {
                        wrap: "wrap",
                        dimColor: D6.isOptionDisabled || D6.option.dimDescription !== !1,
                        color: D6.isOptionDisabled ? void 0 : D6.isSelected ? "success" : D6.isFocused ? "suggestion" : void 0
                    }, F4.default.createElement(wK, null, D6.option.description || " "))))
                }, q[64] = L, q[65] = w6, q[66] = R6, q[67] = T6;
                else T6 = q[67];
                a = F4.default.createElement(m, {
                    ...l.container()
                }, y6.map(T6));
                break A
            }
            $6 = m,
            n = l.container(),
            o = s.visibleOptions.map((G6, R6) => {
                if (G6.type === "input") {
                    let b6 = U.has(G6.value) ? U.get(G6.value) : G6.initialValue || "",
                        E6 = G6.index === s.visibleFromIndex,
                        U6 = G6.index === s.visibleToIndex - 1,
                        c6 = s.visibleToIndex < w.length,
                        K1 = s.visibleFromIndex > 0,
                        j6 = s.visibleFromIndex + R6 + 1,
                        W6 = !V && s.focusedValue === G6.value,
                        n6 = s.value === G6.value;
                    return F4.default.createElement(tZ6, {
                        key: String(G6.value),
                        option: G6,
                        isFocused: W6,
                        isSelected: n6,
                        shouldShowDownArrow: c6 && U6,
                        shouldShowUpArrow: K1 && E6,
                        maxIndexWidth: w6,
                        index: j6,
                        inputValue: b6,
                        onInputChange: (d6) => {
                            r((S6) => {
                                let g6 = new Map(S6);
                                return g6.set(G6.value, d6), g6
                            })
                        },
                        onSubmit: (d6) => {
                            let S6 = v && Object.values(v).some(k8Y);
                            if (d6.trim() || S6 || G6.allowEmptySubmitToCancel) H?.(G6.value);
                            else $?.()
                        },
                        onExit: $,
                        layout: "compact",
                        showLabel: I,
                        onOpenEditor: G,
                        resetCursorOnUpdate: G6.resetCursorOnUpdate,
                        onImagePaste: f,
                        pastedContents: v,
                        onRemoveImage: N,
                        imagesSelected: g,
                        selectedImageIndex: b,
                        onImagesSelectedChange: B,
                        onSelectedImageIndexChange: p
                    })
                }
                let T6 = G6.label;
                if (typeof G6.label === "string" && _ && G6.label.includes(_)) {
                    let b6 = G6.label,
                        E6 = b6.indexOf(_);
                    T6 = F4.default.createElement(F4.default.Fragment, null, b6.slice(0, E6), F4.default.createElement(T, {
                        ...l.highlightedText()
                    }, _), b6.slice(E6 + _.length))
                }
                let D6 = G6.index === s.visibleFromIndex,
                    Q6 = G6.index === s.visibleToIndex - 1,
                    k6 = s.visibleToIndex < w.length,
                    Z6 = s.visibleFromIndex > 0,
                    u6 = s.visibleFromIndex + R6 + 1,
                    C6 = !V && s.focusedValue === G6.value,
                    o6 = s.value === G6.value,
                    V6 = G6.disabled === !0;
                return F4.default.createElement(Re, {
                    key: String(G6.value),
                    isFocused: C6,
                    isSelected: o6,
                    shouldShowDownArrow: k6 && Q6,
                    shouldShowUpArrow: Z6 && D6
                }, F4.default.createElement(m, {
                    flexDirection: "row",
                    flexShrink: 0
                }, !L && F4.default.createElement(T, {
                    dimColor: !0
                }, `${u6}.`.padEnd(w6 + 2)), F4.default.createElement(T, {
                    dimColor: V6,
                    color: V6 ? void 0 : o6 ? "success" : C6 ? "suggestion" : void 0
                }, T6, I && G6.description && F4.default.createElement(T, {
                    dimColor: V6 || G6.dimDescription !== !1
                }, " ", G6.description))), !I && G6.description && F4.default.createElement(m, {
                    flexShrink: 99,
                    marginLeft: 2
                }, F4.default.createElement(T, {
                    wrap: "wrap-trim",
                    dimColor: V6 || G6.dimDescription !== !1,
                    color: V6 ? void 0 : o6 ? "success" : C6 ? "suggestion" : void 0
                }, F4.default.createElement(wK, null, G6.description))))
            })
        }
        q[28] = L, q[29] = _, q[30] = g, q[31] = I, q[32] = U, q[33] = V, q[34] = R, q[35] = $, q[36] = H, q[37] = f, q[38] = G, q[39] = N, q[40] = w.length, q[41] = v, q[42] = b, q[43] = s.focusedValue, q[44] = s.options, q[45] = s.value, q[46] = s.visibleFromIndex, q[47] = s.visibleOptions, q[48] = s.visibleToIndex, q[49] = $6, q[50] = n, q[51] = o, q[52] = a
    } else $6 = q[49], n = q[50], o = q[51], a = q[52];
    if (a !== Symbol.for("react.early_return_sentinel")) return a;
    let i;
    if (q[68] !== $6 || q[69] !== n || q[70] !== o) i = F4.default.createElement($6, {
        ...n
    }, o), q[68] = $6, q[69] = n, q[70] = o, q[71] = i;
    else i = q[71];
    return i
}
// @from(Ln 285494, Col 0)
function k8Y(A) {
    return A.type === "image"
}
// @from(Ln 285498, Col 0)
function E8Y(A) {
    return A.description
}
// @from(Ln 285502, Col 0)
function y8Y(A) {
    return A.type === "input"
}
// @from(Ln 285506, Col 0)
function L8Y(A) {
    return A.type === "image"
}
// @from(Ln 285510, Col 0)
function R8Y(A) {
    return A.type === "image"
}
// @from(Ln 285514, Col 0)
function h8Y() {
    return {
        bold: !0
    }
}
// @from(Ln 285520, Col 0)
function S8Y() {
    return {
        flexDirection: "column"
    }
}
// @from(Ln 285526, Col 0)
function C8Y(A) {
    return A.type === "image"
}
// @from(Ln 285530, Col 0)
function I8Y(A) {
    return A.type === "image"
}
// @from(Ln 285533, Col 4)
F4
// @from(Ln 285534, Col 4)
v3 = E(() => {
    e6();
    i6();
    $G1();
    pf4();
    df4();
    b7();
    IL8();
    q3();
    F4 = t(P6(), 1)
})
// @from(Ln 285549, Col 0)
function KT4(A) {
    return A.replace(/[A-Z]/g, (q) => `_${q.toLowerCase()}`)
}
// @from(Ln 285552, Col 0)
async function bL8() {
    if (PU6.length === 0) return;
    let A = [...PU6];
    PU6 = [];
    try {
        await X8.post(x8Y, A, {
            headers: {
                "Content-Type": "application/json",
                "DD-API-KEY": u8Y
            },
            timeout: g8Y
        })
    } catch (q) {
        _6(q)
    }
}
// @from(Ln 285569, Col 0)
function Q8Y() {
    if (Ic) return;
    Ic = setTimeout(() => {
        Ic = null, bL8()
    }, l8Y()).unref()
}
// @from(Ln 285575, Col 0)
async function vG1() {
    if (Ic) clearTimeout(Ic), Ic = null;
    await bL8()
}
// @from(Ln 285579, Col 0)
async function xL8(A, q) {
    if (QA() !== "firstParty") return;
    let K = TG1;
    if (K === null) K = await U8Y();
    if (!K || !F8Y.has(A)) return;
    try {
        let Y = await eZ6({
                model: q.model,
                betas: q.betas
            }),
            {
                envContext: z,
                ..._
            } = Y,
            w = {
                ..._,
                ...z,
                ...q,
                userBucket: c8Y()
            };
        if (typeof w.toolName === "string" && w.toolName.startsWith("mcp__")) w.toolName = "mcp";
        if (typeof w.model === "string") {
            let j = IY(w.model.replace(/\[1m]$/i, ""));
            w.model = j in XD1 ? j : "other"
        }
        if (typeof w.version === "string") w.version = w.version.replace(/^(\d+\.\d+\.\d+-dev\.\d{8})\.t\d+\.sha[a-f0-9]+$/, "$1");
        if (w.status !== void 0 && w.status !== null) {
            let j = String(w.status);
            w.http_status = j;
            let J = j.charAt(0);
            if (J >= "1" && J <= "5") w.http_status_range = `${J}xx`;
            delete w.status
        }
        let O = w,
            H = {
                ddsource: "nodejs",
                ddtags: [`event:${A}`, ...p8Y.filter((j) => O[j] !== void 0 && O[j] !== null).map((j) => `${KT4(j)}:${O[j]}`)].join(","),
                message: A,
                service: "claude-code",
                hostname: "claude-code",
                env: "external"
            };
        for (let [j, J] of Object.entries(w))
            if (J !== void 0 && J !== null) H[KT4(j)] = J;
        if (PU6.push(H), PU6.length >= B8Y) {
            if (Ic) clearTimeout(Ic), Ic = null;
            bL8()
        } else Q8Y()
    } catch (Y) {
        _6(Y)
    }
}
// @from(Ln 285632, Col 0)
function l8Y() {
    return parseInt(process.env.CLAUDE_CODE_DATADOG_FLUSH_INTERVAL_MS || "", 10) || m8Y
}
// @from(Ln 285635, Col 4)
x8Y = "https://http-intake.logs.us5.datadoghq.com/api/v2/logs"
// @from(Ln 285636, Col 4)
u8Y = "pubbbf48e6d78dae54bceaa4acf463299bf"
// @from(Ln 285637, Col 4)
m8Y = 15000
// @from(Ln 285638, Col 4)
B8Y = 100
// @from(Ln 285639, Col 4)
g8Y = 5000
// @from(Ln 285640, Col 4)
F8Y
// @from(Ln 285640, Col 9)
p8Y
// @from(Ln 285640, Col 14)
PU6
// @from(Ln 285640, Col 19)
Ic = null
// @from(Ln 285641, Col 4)
TG1 = null
// @from(Ln 285642, Col 4)
U8Y
// @from(Ln 285642, Col 9)
d8Y = 30
// @from(Ln 285643, Col 4)
c8Y
// @from(Ln 285644, Col 4)
NG1 = E(() => {
    kK();
    U4();
    k1();
    k8();
    z4();
    Mt();
    Nz();
    o$();
    ip();
    F8Y = new Set(["chrome_bridge_connection_succeeded", "chrome_bridge_connection_failed", "chrome_bridge_disconnected", "chrome_bridge_tool_call_completed", "chrome_bridge_tool_call_error", "chrome_bridge_tool_call_started", "chrome_bridge_tool_call_timeout", "tengu_api_error", "tengu_api_success", "tengu_brief_mode_toggled", "tengu_brief_send", "tengu_cancel", "tengu_compact_failed", "tengu_exit", "tengu_flicker", "tengu_init", "tengu_model_fallback_triggered", "tengu_oauth_error", "tengu_oauth_success", "tengu_oauth_token_refresh_failure", "tengu_oauth_token_refresh_success", "tengu_oauth_token_refresh_lock_acquiring", "tengu_oauth_token_refresh_lock_acquired", "tengu_oauth_token_refresh_starting", "tengu_oauth_token_refresh_completed", "tengu_oauth_token_refresh_lock_releasing", "tengu_oauth_token_refresh_lock_released", "tengu_query_error", "tengu_repo_text_file_size", "tengu_session_file_read", "tengu_started", "tengu_tool_use_error", "tengu_tool_use_granted_in_prompt_permanent", "tengu_tool_use_granted_in_prompt_temporary", "tengu_tool_use_rejected_in_prompt", "tengu_tool_use_success", "tengu_uncaught_exception", "tengu_unhandled_rejection", "tengu_voice_recording_started", "tengu_voice_toggled", "tengu_team_mem_sync_pull", "tengu_team_mem_sync_push", "tengu_team_mem_sync_started", "tengu_team_mem_entries_capped"]), p8Y = ["arch", "clientType", "errorType", "http_status_range", "http_status", "kairosActive", "model", "platform", "provider", "subscriptionType", "toolName", "userBucket", "userType", "version", "versionBase"];
    PU6 = [];
    U8Y = e1(async () => {
        if (My()) return TG1 = !1, !1;
        try {
            return TG1 = !0, !0
        } catch (A) {
            return _6(A), TG1 = !1, !1
        }
    });
    c8Y = e1(() => {
        let A = Jy(),
            q = b8Y("sha256").update(A).digest("hex");
        return parseInt(q.slice(0, 8), 16) % d8Y
    })
})
// @from(Ln 285670, Col 4)
zT4 = x((YT4) => {
    Object.defineProperty(YT4, "__esModule", {
        value: !0
    })
})
// @from(Ln 285675, Col 4)
wT4 = x((_T4) => {
    Object.defineProperty(_T4, "__esModule", {
        value: !0
    })
})
// @from(Ln 285680, Col 4)
uL8 = x((OT4) => {
    Object.defineProperty(OT4, "__esModule", {
        value: !0
    })
})
// @from(Ln 285685, Col 4)
mL8 = x((n8Y) => {
    function i8Y(A, q, K) {
        q.split && (q = q.split("."));
        var Y = 0,
            z = q.length,
            _ = A,
            w, O;
        while (Y < z) {
            if (O = "" + q[Y++], O === "__proto__" || O === "constructor" || O === "prototype") break;
            _ = _[O] = Y === z ? K : typeof(w = _[O]) === typeof q ? w : q[Y] * 0 !== 0 || !!~("" + q[Y]).indexOf(".") ? {} : []
        }
    }
    n8Y.dset = i8Y
})
// @from(Ln 285699, Col 4)
jT4 = x(($T4) => {
    Object.defineProperty($T4, "__esModule", {
        value: !0
    });
    $T4.pickBy = void 0;
    var o8Y = function(A, q) {
        return Object.keys(A).filter(function(K) {
            return q(K, A[K])
        }).reduce(function(K, Y) {
            return K[Y] = A[Y], K
        }, {})
    };
    $T4.pickBy = o8Y
})
// @from(Ln 285713, Col 4)
BL8 = x((JT4) => {
    Object.defineProperty(JT4, "__esModule", {
        value: !0
    });
    JT4.ValidationError = void 0;
    var a8Y = _2(),
        s8Y = function(A) {
            a8Y.__extends(q, A);

            function q(K, Y) {
                var z = A.call(this, "".concat(K, " ").concat(Y)) || this;
                return z.field = K, z
            }
            return q
        }(Error);
    JT4.ValidationError = s8Y
})
// @from(Ln 285730, Col 4)
gL8 = x((DT4) => {
    Object.defineProperty(DT4, "__esModule", {
        value: !0
    });
    DT4.isPlainObject = DT4.exists = DT4.isFunction = DT4.isNumber = DT4.isString = void 0;

    function t8Y(A) {
        return typeof A === "string"
    }
    DT4.isString = t8Y;

    function e8Y(A) {
        return typeof A === "number"
    }
    DT4.isNumber = e8Y;

    function AAY(A) {
        return typeof A === "function"
    }
    DT4.isFunction = AAY;

    function qAY(A) {
        return A !== void 0 && A !== null
    }
    DT4.exists = qAY;

    function KAY(A) {
        return Object.prototype.toString.call(A).slice(8, -1).toLowerCase() === "object"
    }
    DT4.isPlainObject = KAY
})
// @from(Ln 285761, Col 4)
QL8 = x((NT4) => {
    Object.defineProperty(NT4, "__esModule", {
        value: !0
    });
    NT4.validateEvent = NT4.assertTraits = NT4.assertTrackEventProperties = NT4.assertTrackEventName = NT4.assertEventType = NT4.assertEventExists = NT4.assertUserIdentity = void 0;
    var Se = BL8(),
        l96 = gL8(),
        FL8 = "is not a string",
        pL8 = "is not an object",
        PT4 = "is nil";

    function WT4(A) {
        var q = ".userId/anonymousId/previousId/groupId",
            K = function(z) {
                var _, w, O;
                return (O = (w = (_ = z.userId) !== null && _ !== void 0 ? _ : z.anonymousId) !== null && w !== void 0 ? w : z.groupId) !== null && O !== void 0 ? O : z.previousId
            },
            Y = K(A);
        if (!(0, l96.exists)(Y)) throw new Se.ValidationError(q, PT4);
        else if (!(0, l96.isString)(Y)) throw new Se.ValidationError(q, FL8)
    }
    NT4.assertUserIdentity = WT4;

    function ZT4(A) {
        if (!(0, l96.exists)(A)) throw new Se.ValidationError("Event", PT4);
        if (typeof A !== "object") throw new Se.ValidationError("Event", pL8)
    }
    NT4.assertEventExists = ZT4;

    function GT4(A) {
        if (!(0, l96.isString)(A.type)) throw new Se.ValidationError(".type", FL8)
    }
    NT4.assertEventType = GT4;

    function fT4(A) {
        if (!(0, l96.isString)(A.event)) throw new Se.ValidationError(".event", FL8)
    }
    NT4.assertTrackEventName = fT4;

    function TT4(A) {
        if (!(0, l96.isPlainObject)(A.properties)) throw new Se.ValidationError(".properties", pL8)
    }
    NT4.assertTrackEventProperties = TT4;

    function vT4(A) {
        if (!(0, l96.isPlainObject)(A.traits)) throw new Se.ValidationError(".traits", pL8)
    }
    NT4.assertTraits = vT4;

    function OAY(A) {
        if (ZT4(A), GT4(A), A.type === "track") fT4(A), TT4(A);
        if (["group", "identify"].includes(A.type)) vT4(A);
        WT4(A)
    }
    NT4.validateEvent = OAY
})
// @from(Ln 285817, Col 4)
yT4 = x((UL8) => {
    Object.defineProperty(UL8, "__esModule", {
        value: !0
    });
    UL8.EventFactory = void 0;
    var _9 = _2();
    _9.__exportStar(uL8(), UL8);
    var kT4 = mL8(),
        XAY = jT4(),
        PAY = QL8(),
        WAY = function() {
            function A(q) {
                this.user = q.user, this.createMessageId = q.createMessageId
            }
            return A.prototype.track = function(q, K, Y, z) {
                return this.normalize(_9.__assign(_9.__assign({}, this.baseEvent()), {
                    event: q,
                    type: "track",
                    properties: K !== null && K !== void 0 ? K : {},
                    options: _9.__assign({}, Y),
                    integrations: _9.__assign({}, z)
                }))
            }, A.prototype.page = function(q, K, Y, z, _) {
                var w, O = {
                    type: "page",
                    properties: _9.__assign({}, Y),
                    options: _9.__assign({}, z),
                    integrations: _9.__assign({}, _)
                };
                if (q !== null) O.category = q, O.properties = (w = O.properties) !== null && w !== void 0 ? w : {}, O.properties.category = q;
                if (K !== null) O.name = K;
                return this.normalize(_9.__assign(_9.__assign({}, this.baseEvent()), O))
            }, A.prototype.screen = function(q, K, Y, z, _) {
                var w = {
                    type: "screen",
                    properties: _9.__assign({}, Y),
                    options: _9.__assign({}, z),
                    integrations: _9.__assign({}, _)
                };
                if (q !== null) w.category = q;
                if (K !== null) w.name = K;
                return this.normalize(_9.__assign(_9.__assign({}, this.baseEvent()), w))
            }, A.prototype.identify = function(q, K, Y, z) {
                return this.normalize(_9.__assign(_9.__assign({}, this.baseEvent()), {
                    type: "identify",
                    userId: q,
                    traits: K !== null && K !== void 0 ? K : {},
                    options: _9.__assign({}, Y),
                    integrations: z
                }))
            }, A.prototype.group = function(q, K, Y, z) {
                return this.normalize(_9.__assign(_9.__assign({}, this.baseEvent()), {
                    type: "group",
                    traits: K !== null && K !== void 0 ? K : {},
                    options: _9.__assign({}, Y),
                    integrations: _9.__assign({}, z),
                    groupId: q
                }))
            }, A.prototype.alias = function(q, K, Y, z) {
                var _ = {
                    userId: q,
                    type: "alias",
                    options: _9.__assign({}, Y),
                    integrations: _9.__assign({}, z)
                };
                if (K !== null) _.previousId = K;
                if (q === void 0) return this.normalize(_9.__assign(_9.__assign({}, _), this.baseEvent()));
                return this.normalize(_9.__assign(_9.__assign({}, this.baseEvent()), _))
            }, A.prototype.baseEvent = function() {
                var q = {
                    integrations: {},
                    options: {}
                };
                if (!this.user) return q;
                var K = this.user;
                if (K.id()) q.userId = K.id();
                if (K.anonymousId()) q.anonymousId = K.anonymousId();
                return q
            }, A.prototype.context = function(q) {
                var K, Y = ["userId", "anonymousId", "timestamp"];
                delete q.integrations;
                var z = Object.keys(q),
                    _ = (K = q.context) !== null && K !== void 0 ? K : {},
                    w = {};
                return z.forEach(function(O) {
                    if (O === "context") return;
                    if (Y.includes(O))(0, kT4.dset)(w, O, q[O]);
                    else(0, kT4.dset)(_, O, q[O])
                }), [_, w]
            }, A.prototype.normalize = function(q) {
                var K, Y, z = Object.keys((K = q.integrations) !== null && K !== void 0 ? K : {}).reduce(function(D, X) {
                    var P, W;
                    return _9.__assign(_9.__assign({}, D), (P = {}, P[X] = Boolean((W = q.integrations) === null || W === void 0 ? void 0 : W[X]), P))
                }, {});
                q.options = (0, XAY.pickBy)(q.options || {}, function(D, X) {
                    return X !== void 0
                });
                var _ = _9.__assign(_9.__assign({}, z), (Y = q.options) === null || Y === void 0 ? void 0 : Y.integrations),
                    w = q.options ? this.context(q.options) : [],
                    O = w[0],
                    $ = w[1],
                    H = q.options,
                    j = _9.__rest(q, ["options"]),
                    J = _9.__assign(_9.__assign(_9.__assign({
                        timestamp: new Date
                    }, j), {
                        integrations: _,
                        context: O
                    }), $),
                    M = _9.__assign(_9.__assign({}, J), {
                        messageId: this.createMessageId()
                    });
                return (0, PAY.validateEvent)(M), M
            }, A
        }();
    UL8.EventFactory = WAY
})
// @from(Ln 285934, Col 4)
dL8 = x((hT4) => {
    Object.defineProperty(hT4, "__esModule", {
        value: !0
    });
    hT4.invokeCallback = hT4.sleep = hT4.pTimeout = void 0;

    function LT4(A, q) {
        return new Promise(function(K, Y) {
            var z = setTimeout(function() {
                Y(Error("Promise timed out"))
            }, q);
            A.then(function(_) {
                return clearTimeout(z), K(_)
            }).catch(Y)
        })
    }
    hT4.pTimeout = LT4;

    function RT4(A) {
        return new Promise(function(q) {
            return setTimeout(q, A)
        })
    }
    hT4.sleep = RT4;

    function ZAY(A, q, K) {
        var Y = function() {
            try {
                return Promise.resolve(q(A))
            } catch (z) {
                return Promise.reject(z)
            }
        };
        return RT4(K).then(function() {
            return LT4(Y(), 1000)
        }).catch(function(z) {
            A === null || A === void 0 || A.log("warn", "Callback Error", {
                error: z
            }), A === null || A === void 0 || A.stats.increment("callback_error")
        }).then(function() {
            return A
        })
    }
    hT4.invokeCallback = ZAY
})
// @from(Ln 285979, Col 4)
bT4 = x((CT4) => {
    Object.defineProperty(CT4, "__esModule", {
        value: !0
    });
    CT4.createDeferred = void 0;
    var TAY = function() {
        var A, q, K = new Promise(function(Y, z) {
            A = Y, q = z
        });
        return {
            resolve: A,
            reject: q,
            promise: K
        }
    };
    CT4.createDeferred = TAY
})
// @from(Ln 285996, Col 4)
xT4 = x((cL8) => {
    Object.defineProperty(cL8, "__esModule", {
        value: !0
    });
    var vAY = _2();
    vAY.__exportStar(bT4(), cL8)
})
// @from(Ln 286003, Col 4)
BT4 = x((uT4) => {
    Object.defineProperty(uT4, "__esModule", {
        value: !0
    });
    uT4.Emitter = void 0;
    var NAY = function() {
        function A(q) {
            var K;
            this.callbacks = {}, this.warned = !1, this.maxListeners = (K = q === null || q === void 0 ? void 0 : q.maxListeners) !== null && K !== void 0 ? K : 10
        }
        return A.prototype.warnIfPossibleMemoryLeak = function(q) {
            if (this.warned) return;
            if (this.maxListeners && this.callbacks[q].length > this.maxListeners) console.warn("Event Emitter: Possible memory leak detected; ".concat(String(q), " has exceeded ").concat(this.maxListeners, " listeners.")), this.warned = !0
        }, A.prototype.on = function(q, K) {
            if (!this.callbacks[q]) this.callbacks[q] = [K];
            else this.callbacks[q].push(K), this.warnIfPossibleMemoryLeak(q);
            return this
        }, A.prototype.once = function(q, K) {
            var Y = this,
                z = function() {
                    var _ = [];
                    for (var w = 0; w < arguments.length; w++) _[w] = arguments[w];
                    Y.off(q, z), K.apply(Y, _)
                };
            return this.on(q, z), this
        }, A.prototype.off = function(q, K) {
            var Y, z = (Y = this.callbacks[q]) !== null && Y !== void 0 ? Y : [],
                _ = z.filter(function(w) {
                    return w !== K
                });
            return this.callbacks[q] = _, this
        }, A.prototype.emit = function(q) {
            var K = this,
                Y, z = [];
            for (var _ = 1; _ < arguments.length; _++) z[_ - 1] = arguments[_];
            var w = (Y = this.callbacks[q]) !== null && Y !== void 0 ? Y : [];
            return w.forEach(function(O) {
                O.apply(K, z)
            }), this
        }, A
    }();
    uT4.Emitter = NAY
})
// @from(Ln 286046, Col 4)
gT4 = x((lL8) => {
    Object.defineProperty(lL8, "__esModule", {
        value: !0
    });
    var VAY = _2();
    VAY.__exportStar(BT4(), lL8)
})
// @from(Ln 286053, Col 4)
AG6 = x((VG1) => {
    Object.defineProperty(VG1, "__esModule", {
        value: !0
    });
    var FT4 = _2();
    FT4.__exportStar(xT4(), VG1);
    FT4.__exportStar(gT4(), VG1)
})
// @from(Ln 286061, Col 4)
iL8 = x((pT4) => {
    Object.defineProperty(pT4, "__esModule", {
        value: !0
    });
    pT4.backoff = void 0;

    function kAY(A) {
        var q = Math.random() + 1,
            K = A.minTimeout,
            Y = K === void 0 ? 500 : K,
            z = A.factor,
            _ = z === void 0 ? 2 : z,
            w = A.attempt,
            O = A.maxTimeout,
            $ = O === void 0 ? 1 / 0 : O;
        return Math.min(q * Y * Math.pow(_, w), $)
    }
    pT4.backoff = kAY
})
// @from(Ln 286080, Col 4)
nL8 = x((UT4) => {
    Object.defineProperty(UT4, "__esModule", {
        value: !0
    });
    UT4.PriorityQueue = UT4.ON_REMOVE_FROM_FUTURE = void 0;
    var EAY = _2(),
        yAY = AG6(),
        LAY = iL8();
    UT4.ON_REMOVE_FROM_FUTURE = "onRemoveFromFuture";
    var RAY = function(A) {
        EAY.__extends(q, A);

        function q(K, Y, z) {
            var _ = A.call(this) || this;
            return _.future = [], _.maxAttempts = K, _.queue = Y, _.seen = z !== null && z !== void 0 ? z : {}, _
        }
        return q.prototype.push = function() {
            var K = this,
                Y = [];
            for (var z = 0; z < arguments.length; z++) Y[z] = arguments[z];
            var _ = Y.map(function(w) {
                var O = K.updateAttempts(w);
                if (O > K.maxAttempts || K.includes(w)) return !1;
                return K.queue.push(w), !0
            });
            return this.queue = this.queue.sort(function(w, O) {
                return K.getAttempts(w) - K.getAttempts(O)
            }), _
        }, q.prototype.pushWithBackoff = function(K) {
            var Y = this;
            if (this.getAttempts(K) === 0) return this.push(K)[0];
            var z = this.updateAttempts(K);
            if (z > this.maxAttempts || this.includes(K)) return !1;
            var _ = (0, LAY.backoff)({
                attempt: z - 1
            });
            return setTimeout(function() {
                Y.queue.push(K), Y.future = Y.future.filter(function(w) {
                    return w.id !== K.id
                }), Y.emit(UT4.ON_REMOVE_FROM_FUTURE)
            }, _), this.future.push(K), !0
        }, q.prototype.getAttempts = function(K) {
            var Y;
            return (Y = this.seen[K.id]) !== null && Y !== void 0 ? Y : 0
        }, q.prototype.updateAttempts = function(K) {
            return this.seen[K.id] = this.getAttempts(K) + 1, this.getAttempts(K)
        }, q.prototype.includes = function(K) {
            return this.queue.includes(K) || this.future.includes(K) || Boolean(this.queue.find(function(Y) {
                return Y.id === K.id
            })) || Boolean(this.future.find(function(Y) {
                return Y.id === K.id
            }))
        }, q.prototype.pop = function() {
            return this.queue.shift()
        }, Object.defineProperty(q.prototype, "length", {
            get: function() {
                return this.queue.length
            },
            enumerable: !1,
            configurable: !0
        }), Object.defineProperty(q.prototype, "todo", {
            get: function() {
                return this.queue.length + this.future.length
            },
            enumerable: !1,
            configurable: !0
        }), q
    }(yAY.Emitter);
    UT4.PriorityQueue = RAY
})
// @from(Ln 286150, Col 4)
rL8 = x((SAY) => {
    var i96 = 256,
        EG1 = [],
        kG1;
    while (i96--) EG1[i96] = (i96 + 256).toString(16).substring(1);

    function hAY() {
        var A = 0,
            q, K = "";
        if (!kG1 || i96 + 16 > 256) {
            kG1 = Array(A = 256);
            while (A--) kG1[A] = 256 * Math.random() | 0;
            A = i96 = 0
        }
        for (; A < 16; A++) {
            if (q = kG1[i96 + A], A == 6) K += EG1[q & 15 | 64];
            else if (A == 8) K += EG1[q & 63 | 128];
            else K += EG1[q];
            if (A & 1 && A > 1 && A < 11) K += "-"
        }
        return i96++, K
    }
    SAY.v4 = hAY
})
// @from(Ln 286174, Col 4)
oL8 = x((lT4) => {
    Object.defineProperty(lT4, "__esModule", {
        value: !0
    });
    lT4.CoreLogger = void 0;
    var yG1 = _2(),
        IAY = function() {
            function A() {
                this._logs = []
            }
            return A.prototype.log = function(q, K, Y) {
                var z = new Date;
                this._logs.push({
                    level: q,
                    message: K,
                    time: z,
                    extras: Y
                })
            }, Object.defineProperty(A.prototype, "logs", {
                get: function() {
                    return this._logs
                },
                enumerable: !1,
                configurable: !0
            }), A.prototype.flush = function() {
                if (this.logs.length > 1) {
                    var q = this._logs.reduce(function(K, Y) {
                        var z, _, w, O = yG1.__assign(yG1.__assign({}, Y), {
                            json: JSON.stringify(Y.extras, null, " "),
                            extras: Y.extras
                        });
                        delete O.time;
                        var $ = (w = (_ = Y.time) === null || _ === void 0 ? void 0 : _.toISOString()) !== null && w !== void 0 ? w : "";
                        if (K[$]) $ = "".concat($, "-").concat(Math.random());
                        return yG1.__assign(yG1.__assign({}, K), (z = {}, z[$] = O, z))
                    }, {});
                    if (console.table) console.table(q);
                    else console.log(q)
                } else this.logs.forEach(function(K) {
                    var {
                        level: Y,
                        message: z,
                        extras: _
                    } = K;
                    if (Y === "info" || Y === "debug") console.log(z, _ !== null && _ !== void 0 ? _ : "");
                    else console[Y](z, _ !== null && _ !== void 0 ? _ : "")
                });
                this._logs = []
            }, A
        }();
    lT4.CoreLogger = IAY
})
// @from(Ln 286226, Col 4)
sL8 = x((rT4) => {
    Object.defineProperty(rT4, "__esModule", {
        value: !0
    });
    rT4.NullStats = rT4.CoreStats = void 0;
    var aL8 = _2(),
        bAY = function(A) {
            var q = {
                gauge: "g",
                counter: "c"
            };
            return q[A]
        },
        nT4 = function() {
            function A() {
                this.metrics = []
            }
            return A.prototype.increment = function(q, K, Y) {
                if (K === void 0) K = 1;
                this.metrics.push({
                    metric: q,
                    value: K,
                    tags: Y !== null && Y !== void 0 ? Y : [],
                    type: "counter",
                    timestamp: Date.now()
                })
            }, A.prototype.gauge = function(q, K, Y) {
                this.metrics.push({
                    metric: q,
                    value: K,
                    tags: Y !== null && Y !== void 0 ? Y : [],
                    type: "gauge",
                    timestamp: Date.now()
                })
            }, A.prototype.flush = function() {
                var q = this.metrics.map(function(K) {
                    return aL8.__assign(aL8.__assign({}, K), {
                        tags: K.tags.join(",")
                    })
                });
                if (console.table) console.table(q);
                else console.log(q);
                this.metrics = []
            }, A.prototype.serialize = function() {
                return this.metrics.map(function(q) {
                    return {
                        m: q.metric,
                        v: q.value,
                        t: q.tags,
                        k: bAY(q.type),
                        e: q.timestamp
                    }
                })
            }, A
        }();
    rT4.CoreStats = nT4;
    var xAY = function(A) {
        aL8.__extends(q, A);

        function q() {
            return A !== null && A.apply(this, arguments) || this
        }
        return q.prototype.gauge = function() {
            var K = [];
            for (var Y = 0; Y < arguments.length; Y++) K[Y] = arguments[Y]
        }, q.prototype.increment = function() {
            var K = [];
            for (var Y = 0; Y < arguments.length; Y++) K[Y] = arguments[Y]
        }, q.prototype.flush = function() {
            var K = [];
            for (var Y = 0; Y < arguments.length; Y++) K[Y] = arguments[Y]
        }, q.prototype.serialize = function() {
            var K = [];
            for (var Y = 0; Y < arguments.length; Y++) K[Y] = arguments[Y];
            return []
        }, q
    }(nT4);
    rT4.NullStats = xAY
})
// @from(Ln 286305, Col 4)
LG1 = x((sT4) => {
    Object.defineProperty(sT4, "__esModule", {
        value: !0
    });
    sT4.CoreContext = sT4.ContextCancelation = void 0;
    var mAY = rL8(),
        BAY = mL8(),
        gAY = oL8(),
        FAY = sL8(),
        aT4 = function() {
            function A(q) {
                var K, Y, z;
                this.retry = (K = q.retry) !== null && K !== void 0 ? K : !0, this.type = (Y = q.type) !== null && Y !== void 0 ? Y : "plugin Error", this.reason = (z = q.reason) !== null && z !== void 0 ? z : ""
            }
            return A
        }();
    sT4.ContextCancelation = aT4;
    var pAY = function() {
        function A(q, K, Y, z) {
            if (K === void 0) K = (0, mAY.v4)();
            if (Y === void 0) Y = new FAY.NullStats;
            if (z === void 0) z = new gAY.CoreLogger;
            this.attempts = 0, this.event = q, this._id = K, this.logger = z, this.stats = Y
        }
        return A.system = function() {}, A.prototype.isSame = function(q) {
            return q.id === this.id
        }, A.prototype.cancel = function(q) {
            if (q) throw q;
            throw new aT4({
                reason: "Context Cancel"
            })
        }, A.prototype.log = function(q, K, Y) {
            this.logger.log(q, K, Y)
        }, Object.defineProperty(A.prototype, "id", {
            get: function() {
                return this._id
            },
            enumerable: !1,
            configurable: !0
        }), A.prototype.updateEvent = function(q, K) {
            var Y;
            if (q.split(".")[0] === "integrations") {
                var z = q.split(".")[1];
                if (((Y = this.event.integrations) === null || Y === void 0 ? void 0 : Y[z]) === !1) return this.event
            }
            return (0, BAY.dset)(this.event, q, K), this.event
        }, A.prototype.failedDelivery = function() {
            return this._failedDelivery
        }, A.prototype.setFailedDelivery = function(q) {
            this._failedDelivery = q
        }, A.prototype.logs = function() {
            return this.logger.logs
        }, A.prototype.flush = function() {
            this.logger.flush(), this.stats.flush()
        }, A.prototype.toJSON = function() {
            return {
                id: this._id,
                event: this.event,
                logs: this.logger.logs,
                metrics: this.stats.metrics
            }
        }, A
    }();
    sT4.CoreContext = pAY
})
// @from(Ln 286370, Col 4)
Kv4 = x((Av4) => {
    Object.defineProperty(Av4, "__esModule", {
        value: !0
    });
    Av4.groupBy = void 0;
    var eT4 = _2();

    function UAY(A, q) {
        var K = {};
        return A.forEach(function(Y) {
            var z, _ = void 0;
            if (typeof q === "string") {
                var w = Y[q];
                _ = typeof w !== "string" ? JSON.stringify(w) : w
            } else if (q instanceof Function) _ = q(Y);
            if (_ === void 0) return;
            K[_] = eT4.__spreadArray(eT4.__spreadArray([], (z = K[_]) !== null && z !== void 0 ? z : [], !0), [Y], !1)
        }), K
    }
    Av4.groupBy = UAY
})
// @from(Ln 286391, Col 4)
_v4 = x((Yv4) => {
    Object.defineProperty(Yv4, "__esModule", {
        value: !0
    });
    Yv4.isThenable = void 0;
    var dAY = function(A) {
        return typeof A === "object" && A !== null && "then" in A && typeof A.then === "function"
    };
    Yv4.isThenable = dAY
})
// @from(Ln 286401, Col 4)
$v4 = x((wv4) => {
    Object.defineProperty(wv4, "__esModule", {
        value: !0
    });
    wv4.createTaskGroup = void 0;
    var cAY = _v4(),
        lAY = function() {
            var A, q, K = 0;
            return {
                done: function() {
                    return A
                },
                run: function(Y) {
                    var z = Y();
                    if ((0, cAY.isThenable)(z)) {
                        if (++K === 1) A = new Promise(function(_) {
                            return q = _
                        });
                        z.finally(function() {
                            return --K === 0 && q()
                        })
                    }
                    return z
                }
            }
        };
    wv4.createTaskGroup = lAY
})
// @from(Ln 286429, Col 4)
eL8 = x((Jv4) => {
    Object.defineProperty(Jv4, "__esModule", {
        value: !0
    });
    Jv4.ensure = Jv4.attempt = void 0;
    var Hv4 = _2(),
        tL8 = LG1();

    function iAY(A) {
        return Hv4.__awaiter(this, void 0, void 0, function() {
            var q;
            return Hv4.__generator(this, function(K) {
                switch (K.label) {
                    case 0:
                        return K.trys.push([0, 2, , 3]), [4, A()];
                    case 1:
                        return [2, K.sent()];
                    case 2:
                        return q = K.sent(), [2, Promise.reject(q)];
                    case 3:
                        return [2]
                }
            })
        })
    }

    function jv4(A, q) {
        A.log("debug", "plugin", {
            plugin: q.name
        });
        var K = new Date().getTime(),
            Y = q[A.event.type];
        if (Y === void 0) return Promise.resolve(A);
        var z = iAY(function() {
            return Y.apply(q, [A])
        }).then(function(_) {
            var w = new Date().getTime() - K;
            return _.stats.gauge("plugin_time", w, ["plugin:".concat(q.name)]), _
        }).catch(function(_) {
            if (_ instanceof tL8.ContextCancelation && _.type === "middleware_cancellation") throw _;
            if (_ instanceof tL8.ContextCancelation) return A.log("warn", _.type, {
                plugin: q.name,
                error: _
            }), _;
            return A.log("error", "plugin Error", {
                plugin: q.name,
                error: _
            }), A.stats.increment("plugin_error", 1, ["plugin:".concat(q.name)]), _
        });
        return z
    }
    Jv4.attempt = jv4;

    function nAY(A, q) {
        return jv4(A, q).then(function(K) {
            if (K instanceof tL8.CoreContext) return K;
            A.log("debug", "Context canceled"), A.stats.increment("context_canceled"), A.cancel(K)
        })
    }
    Jv4.ensure = nAY
})
// @from(Ln 286490, Col 4)
Pv4 = x((Dv4) => {
    Object.defineProperty(Dv4, "__esModule", {
        value: !0
    });
    Dv4.CoreEventQueue = void 0;
    var f0 = _2(),
        oAY = Kv4(),
        aAY = nL8(),
        AR8 = LG1(),
        sAY = AG6(),
        tAY = $v4(),
        RG1 = eL8(),
        eAY = function(A) {
            f0.__extends(q, A);

            function q(K) {
                var Y = A.call(this) || this;
                return Y.criticalTasks = (0, tAY.createTaskGroup)(), Y.plugins = [], Y.failedInitializations = [], Y.flushing = !1, Y.queue = K, Y.queue.on(aAY.ON_REMOVE_FROM_FUTURE, function() {
                    Y.scheduleFlush(0)
                }), Y
            }
            return q.prototype.register = function(K, Y, z) {
                return f0.__awaiter(this, void 0, void 0, function() {
                    var _ = this;
                    return f0.__generator(this, function(w) {
                        switch (w.label) {
                            case 0:
                                return [4, Promise.resolve(Y.load(K, z)).then(function() {
                                    _.plugins.push(Y)
                                }).catch(function(O) {
                                    if (Y.type === "destination") {
                                        _.failedInitializations.push(Y.name), console.warn(Y.name, O), K.log("warn", "Failed to load destination", {
                                            plugin: Y.name,
                                            error: O
                                        });
                                        return
                                    }
                                    throw O
                                })];
                            case 1:
                                return w.sent(), [2]
                        }
                    })
                })
            }, q.prototype.deregister = function(K, Y, z) {
                return f0.__awaiter(this, void 0, void 0, function() {
                    var _;
                    return f0.__generator(this, function(w) {
                        switch (w.label) {
                            case 0:
                                if (w.trys.push([0, 3, , 4]), !Y.unload) return [3, 2];
                                return [4, Promise.resolve(Y.unload(K, z))];
                            case 1:
                                w.sent(), w.label = 2;
                            case 2:
                                return this.plugins = this.plugins.filter(function(O) {
                                    return O.name !== Y.name
                                }), [3, 4];
                            case 3:
                                return _ = w.sent(), K.log("warn", "Failed to unload destination", {
                                    plugin: Y.name,
                                    error: _
                                }), [3, 4];
                            case 4:
                                return [2]
                        }
                    })
                })
            }, q.prototype.dispatch = function(K) {
                return f0.__awaiter(this, void 0, void 0, function() {
                    var Y;
                    return f0.__generator(this, function(z) {
                        return K.log("debug", "Dispatching"), K.stats.increment("message_dispatched"), this.queue.push(K), Y = this.subscribeToDelivery(K), this.scheduleFlush(0), [2, Y]
                    })
                })
            }, q.prototype.subscribeToDelivery = function(K) {
                return f0.__awaiter(this, void 0, void 0, function() {
                    var Y = this;
                    return f0.__generator(this, function(z) {
                        return [2, new Promise(function(_) {
                            var w = function(O, $) {
                                if (O.isSame(K))
                                    if (Y.off("flush", w), $) _(O);
                                    else _(O)
                            };
                            Y.on("flush", w)
                        })]
                    })
                })
            }, q.prototype.dispatchSingle = function(K) {
                return f0.__awaiter(this, void 0, void 0, function() {
                    var Y = this;
                    return f0.__generator(this, function(z) {
                        return K.log("debug", "Dispatching"), K.stats.increment("message_dispatched"), this.queue.updateAttempts(K), K.attempts = 1, [2, this.deliver(K).catch(function(_) {
                            var w = Y.enqueuRetry(_, K);
                            if (!w) return K.setFailedDelivery({
                                reason: _
                            }), K;
                            return Y.subscribeToDelivery(K)
                        })]
                    })
                })
            }, q.prototype.isEmpty = function() {
                return this.queue.length === 0
            }, q.prototype.scheduleFlush = function(K) {
                var Y = this;
                if (K === void 0) K = 500;
                if (this.flushing) return;
                this.flushing = !0, setTimeout(function() {
                    Y.flush().then(function() {
                        setTimeout(function() {
                            if (Y.flushing = !1, Y.queue.length) Y.scheduleFlush(0)
                        }, 0)
                    })
                }, K)
            }, q.prototype.deliver = function(K) {
                return f0.__awaiter(this, void 0, void 0, function() {
                    var Y, z, _, w;
                    return f0.__generator(this, function(O) {
                        switch (O.label) {
                            case 0:
                                return [4, this.criticalTasks.done()];
                            case 1:
                                O.sent(), Y = Date.now(), O.label = 2;
                            case 2:
                                return O.trys.push([2, 4, , 5]), [4, this.flushOne(K)];
                            case 3:
                                return K = O.sent(), z = Date.now() - Y, this.emit("delivery_success", K), K.stats.gauge("delivered", z), K.log("debug", "Delivered", K.event), [2, K];
                            case 4:
                                throw _ = O.sent(), w = _, K.log("error", "Failed to deliver", w), this.emit("delivery_failure", K, w), K.stats.increment("delivery_failed"), _;
                            case 5:
                                return [2]
                        }
                    })
                })
            }, q.prototype.enqueuRetry = function(K, Y) {
                var z = !(K instanceof AR8.ContextCancelation) || K.retry;
                if (!z) return !1;
                return this.queue.pushWithBackoff(Y)
            }, q.prototype.flush = function() {
                return f0.__awaiter(this, void 0, void 0, function() {
                    var K, Y, z;
                    return f0.__generator(this, function(_) {
                        switch (_.label) {
                            case 0:
                                if (this.queue.length === 0) return [2, []];
                                if (K = this.queue.pop(), !K) return [2, []];
                                K.attempts = this.queue.getAttempts(K), _.label = 1;
                            case 1:
                                return _.trys.push([1, 3, , 4]), [4, this.deliver(K)];
                            case 2:
                                return K = _.sent(), this.emit("flush", K, !0), [3, 4];
                            case 3:
                                if (Y = _.sent(), z = this.enqueuRetry(Y, K), !z) K.setFailedDelivery({
                                    reason: Y
                                }), this.emit("flush", K, !1);
                                return [2, []];
                            case 4:
                                return [2, [K]]
                        }
                    })
                })
            }, q.prototype.isReady = function() {
                return !0
            }, q.prototype.availableExtensions = function(K) {
                var Y = this.plugins.filter(function(D) {
                        var X, P, W;
                        if (D.type !== "destination" && D.name !== "Segment.io") return !0;
                        var Z = void 0;
                        return (X = D.alternativeNames) === null || X === void 0 || X.forEach(function(G) {
                            if (K[G] !== void 0) Z = K[G]
                        }), (W = (P = K[D.name]) !== null && P !== void 0 ? P : Z) !== null && W !== void 0 ? W : (D.name === "Segment.io" ? !0 : K.All) !== !1
                    }),
                    z = (0, oAY.groupBy)(Y, "type"),
                    _ = z.before,
                    w = _ === void 0 ? [] : _,
                    O = z.enrichment,
                    $ = O === void 0 ? [] : O,
                    H = z.destination,
                    j = H === void 0 ? [] : H,
                    J = z.after,
                    M = J === void 0 ? [] : J;
                return {
                    before: w,
                    enrichment: $,
                    destinations: j,
                    after: M
                }
            }, q.prototype.flushOne = function(K) {
                var Y, z;
                return f0.__awaiter(this, void 0, void 0, function() {
                    var _, w, O, $, H, j, X, J, M, D, X, P, W, Z, G;
                    return f0.__generator(this, function(f) {
                        switch (f.label) {
                            case 0:
                                if (!this.isReady()) throw Error("Not ready");
                                if (K.attempts > 1) this.emit("delivery_retry", K);
                                _ = this.availableExtensions((Y = K.event.integrations) !== null && Y !== void 0 ? Y : {}), w = _.before, O = _.enrichment, $ = 0, H = w, f.label = 1;
                            case 1:
                                if (!($ < H.length)) return [3, 4];
                                return j = H[$], [4, (0, RG1.ensure)(K, j)];
                            case 2:
                                if (X = f.sent(), X instanceof AR8.CoreContext) K = X;
                                this.emit("message_enriched", K, j), f.label = 3;
                            case 3:
                                return $++, [3, 1];
                            case 4:
                                J = 0, M = O, f.label = 5;
                            case 5:
                                if (!(J < M.length)) return [3, 8];
                                return D = M[J], [4, (0, RG1.attempt)(K, D)];
                            case 6:
                                if (X = f.sent(), X instanceof AR8.CoreContext) K = X;
                                this.emit("message_enriched", K, D), f.label = 7;
                            case 7:
                                return J++, [3, 5];
                            case 8:
                                return P = this.availableExtensions((z = K.event.integrations) !== null && z !== void 0 ? z : {}), W = P.destinations, Z = P.after, [4, new Promise(function(v, N) {
                                    setTimeout(function() {
                                        var V = W.map(function(L) {
                                            return (0, RG1.attempt)(K, L)
                                        });
                                        Promise.all(V).then(v).catch(N)
                                    }, 0)
                                })];
                            case 9:
                                return f.sent(), K.stats.increment("message_delivered"), this.emit("message_delivered", K), G = Z.map(function(v) {
                                    return (0, RG1.attempt)(K, v)
                                }), [4, Promise.all(G)];
                            case 10:
                                return f.sent(), [2, K]
                        }
                    })
                })
            }, q
        }(sAY.Emitter);
    Dv4.CoreEventQueue = eAY
})
// @from(Ln 286728, Col 4)
Zv4 = x((Wv4) => {
    Object.defineProperty(Wv4, "__esModule", {
        value: !0
    })
})
// @from(Ln 286733, Col 4)
Nv4 = x((fv4) => {
    Object.defineProperty(fv4, "__esModule", {
        value: !0
    });
    fv4.dispatch = fv4.getDelay = void 0;
    var Gv4 = _2(),
        A7Y = dL8(),
        q7Y = function(A, q) {
            var K = Date.now() - A;
            return Math.max((q !== null && q !== void 0 ? q : 300) - K, 0)
        };
    fv4.getDelay = q7Y;

    function K7Y(A, q, K, Y) {
        return Gv4.__awaiter(this, void 0, void 0, function() {
            var z, _;
            return Gv4.__generator(this, function(w) {
                switch (w.label) {
                    case 0:
                        if (K.emit("dispatch_start", A), z = Date.now(), !q.isEmpty()) return [3, 2];
                        return [4, q.dispatchSingle(A)];
                    case 1:
                        return _ = w.sent(), [3, 4];
                    case 2:
                        return [4, q.dispatch(A)];
                    case 3:
                        _ = w.sent(), w.label = 4;
                    case 4:
                        if (!(Y === null || Y === void 0 ? void 0 : Y.callback)) return [3, 6];
                        return [4, (0, A7Y.invokeCallback)(_, Y.callback, fv4.getDelay(z, Y.timeout))];
                    case 5:
                        _ = w.sent(), w.label = 6;
                    case 6:
                        if (Y === null || Y === void 0 ? void 0 : Y.debug) _.flush();
                        return [2, _]
                }
            })
        })
    }
    fv4.dispatch = K7Y
})
// @from(Ln 286774, Col 4)
Ev4 = x((Vv4) => {
    Object.defineProperty(Vv4, "__esModule", {
        value: !0
    });
    Vv4.bindAll = void 0;

    function Y7Y(A) {
        var q = A.constructor.prototype;
        for (var K = 0, Y = Object.getOwnPropertyNames(q); K < Y.length; K++) {
            var z = Y[K];
            if (z !== "constructor") {
                var _ = Object.getOwnPropertyDescriptor(A.constructor.prototype, z);
                if (!!_ && typeof _.value === "function") A[z] = A[z].bind(A)
            }
        }
        return A
    }
    Vv4.bindAll = Y7Y
})
// @from(Ln 286793, Col 4)
Ce = x((_M) => {
    Object.defineProperty(_M, "__esModule", {
        value: !0
    });
    _M.CoreLogger = _M.backoff = void 0;
    var TZ = _2();
    TZ.__exportStar(zT4(), _M);
    TZ.__exportStar(wT4(), _M);
    TZ.__exportStar(uL8(), _M);
    TZ.__exportStar(yT4(), _M);
    TZ.__exportStar(dL8(), _M);
    TZ.__exportStar(nL8(), _M);
    var z7Y = iL8();
    Object.defineProperty(_M, "backoff", {
        enumerable: !0,
        get: function() {
            return z7Y.backoff
        }
    });
    TZ.__exportStar(LG1(), _M);
    TZ.__exportStar(Pv4(), _M);
    TZ.__exportStar(Zv4(), _M);
    TZ.__exportStar(Nv4(), _M);
    TZ.__exportStar(gL8(), _M);
    TZ.__exportStar(BL8(), _M);
    TZ.__exportStar(QL8(), _M);
    TZ.__exportStar(Ev4(), _M);
    TZ.__exportStar(sL8(), _M);
    var _7Y = oL8();
    Object.defineProperty(_M, "CoreLogger", {
        enumerable: !0,
        get: function() {
            return _7Y.CoreLogger
        }
    });
    TZ.__exportStar(eL8(), _M)
})
// @from(Ln 286830, Col 4)
Rv4 = x((yv4) => {
    Object.defineProperty(yv4, "__esModule", {
        value: !0
    });
    yv4.validateSettings = void 0;
    var O7Y = Ce(),
        $7Y = (A) => {
            if (!A.writeKey) throw new O7Y.ValidationError("writeKey", "writeKey is missing.")
        };
    yv4.validateSettings = $7Y
})
// @from(Ln 286841, Col 4)
qR8 = x((hv4) => {
    Object.defineProperty(hv4, "__esModule", {
        value: !0
    });
    hv4.version = void 0;
    hv4.version = "1.3.0"
})
// @from(Ln 286848, Col 4)
bv4 = x((Cv4) => {
    Object.defineProperty(Cv4, "__esModule", {
        value: !0
    });
    Cv4.tryCreateFormattedUrl = void 0;
    var H7Y = (A) => A.replace(/\/$/, ""),
        j7Y = (A, q) => {
            return H7Y(new URL(q || "", A).href)
        };
    Cv4.tryCreateFormattedUrl = j7Y
})