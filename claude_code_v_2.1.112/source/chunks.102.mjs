
// @from(Ln 268976, Col 0)
function Bx4(q) {
    let K = q.filter((z) => z.tier === "read").length,
        _ = q.filter((z) => z.tier === "click").length;
    return {
        ...K > 0 && {
            denied_browser_count: K
        },
        ..._ > 0 && {
            denied_terminal_count: _
        }
    }
}
// @from(Ln 268988, Col 0)
async function iDz(q, K, _, z) {
    if (!_.onTeachPermissionRequest) return X4("Teach mode is not available in this session.", "feature_unavailable");
    if (_.getTeachModeActive?.()) return X4("Teach mode is already active. To add more apps, end the current tour first, then call request_teach_access again with the full app list.", "teach_mode_conflict");
    let Y = tc(K, "reason");
    if (Y instanceof Error) return X4(Y.message, "bad_args");
    if (z) {
        let f = {
            requestId: Bx8(),
            reason: Y,
            apps: [],
            screenshotFiltering: q.executor.capabilities.screenshotFiltering,
            tccState: z
        };
        await _.onTeachPermissionRequest(f);
        let v = await q.ensureOsPermissions();
        if (v.granted) return X4("macOS Accessibility and Screen Recording are now both granted. " + "Call request_teach_access again immediately — the next call will " + "show the app selection list.");
        let V = [];
        if (!v.accessibility) V.push("Accessibility");
        if (!v.screenRecording) V.push("Screen Recording");
        return X4(`macOS ${V.join(" and ")} permission(s) not yet granted. The permission panel has been shown. Once the user grants the missing permission(s), call request_teach_access again.`, "tcc_not_granted")
    }
    let A = K.apps;
    if (!Array.isArray(A) || !A.every((f) => typeof f === "string")) return X4('"apps" must be an array of strings.', "bad_args");
    let O = A,
        {
            needDialog: w,
            skipDialogGrants: $,
            willHide: j,
            tieredApps: H,
            userDenied: J,
            policyDenied: X
        } = await ux4(q, O, _.allowedApps, new Set(_.userDeniedBundleIds), _.selectedDisplayId);
    if (w.length === 0 && $.length === 0) return nf({
        granted: [],
        denied: [],
        ...X.length > 0 && {
            policyDenied: {
                apps: X,
                guidance: Sr1(X)
            }
        },
        ...J.length > 0 && {
            userDenied: {
                apps: J,
                guidance: Rr1(J)
            }
        },
        teachModeActive: !1,
        screenshotFiltering: q.executor.capabilities.screenshotFiltering
    }, {
        granted_count: 0,
        denied_count: 0
    });
    let M = {
            requestId: Bx8(),
            reason: Y,
            apps: w,
            screenshotFiltering: q.executor.capabilities.screenshotFiltering,
            ...j.length > 0 && {
                willHide: j,
                autoUnhideEnabled: q.getAutoUnhideEnabled()
            }
        },
        P = await _.onTeachPermissionRequest(M),
        W = [...$, ...P.granted],
        D = P.userConsented === !0 && W.length > 0;
    if (D) _.onTeachModeActivated?.();
    let Z = new Set(W.map((f) => f.bundleId)),
        G = H.filter((f) => Z.has(f.bundleId));
    return nf({
        granted: W,
        denied: P.denied,
        ...X.length > 0 && {
            policyDenied: {
                apps: X,
                guidance: Sr1(X)
            }
        },
        ...J.length > 0 && {
            userDenied: {
                apps: J,
                guidance: Rr1(J)
            }
        },
        ...G.length > 0 && {
            tierGuidance: mx4(G)
        },
        teachModeActive: D,
        screenshotFiltering: q.executor.capabilities.screenshotFiltering
    }, {
        granted_count: P.granted.length,
        denied_count: P.denied.length,
        ...Bx4(G)
    })
}
// @from(Ln 269083, Col 0)
async function px4(q, K, _, z) {
    let Y = tc(q, "explanation");
    if (Y instanceof Error) return Error(`${z}: ${Y.message}`);
    let A = tc(q, "next_preview");
    if (A instanceof Error) return Error(`${z}: ${A.message}`);
    let O = q.actions;
    if (!Array.isArray(O)) return Error(`${z}: "actions" must be an array (empty is allowed).`);
    for (let [$, j] of O.entries()) {
        if (typeof j !== "object" || j === null) return Error(`${z}: actions[${$}] must be an object`);
        let H = j.action;
        if (typeof H !== "string") return Error(`${z}: actions[${$}].action must be a string`);
        if (!Fx8.has(H)) return Error(`${z}: actions[${$}].action="${H}" is not allowed. Allowed: ${[...Fx8].join(", ")}.`)
    }
    let w;
    if (q.anchor !== void 0) {
        let $ = q.anchor;
        if (!Array.isArray($) || $.length !== 2 || typeof $[0] !== "number" || typeof $[1] !== "number" || !Number.isFinite($[0]) || !Number.isFinite($[1])) return Error(`${z}: "anchor" must be a [x, y] number tuple or omitted.`);
        let j = await K.executor.getDisplaySize(_.selectedDisplayId);
        w = GR6($[0], $[1], _.coordinateMode, j, _.lastScreenshot, K.logger)
    }
    return {
        explanation: Y,
        nextPreview: A,
        anchorLogical: w,
        actions: O
    }
}
// @from(Ln 269110, Col 0)
async function Fx4(q, K, _, z) {
    if ((await _.onTeachStep({
            explanation: q.explanation,
            nextPreview: q.nextPreview,
            anchorLogical: q.anchorLogical
        })).action === "exit") return await c18(K), {
        kind: "exit"
    };
    if (_.onTeachWorking?.(), q.actions.length === 0) return {
        kind: "ok",
        results: []
    };
    if (z.hideBeforeAction) {
        let w = await K.executor.prepareForAction(_.allowedApps.map(($) => $.bundleId), _.selectedDisplayId);
        if (w.length > 0) _.onAppsHidden?.(w)
    }
    let A = {
            ...z,
            hideBeforeAction: !1,
            pixelValidation: !1,
            autoTargetDisplay: !1
        },
        O = [];
    for (let [w, $] of q.actions.entries()) {
        if (_.isAborted?.()) return await c18(K), {
            kind: "exit"
        };
        if (w > 0) await Ux8(10);
        let j = $.action,
            {
                screenshot: H,
                ...J
            } = await Ir1(j, $, K, _, A),
            X = dx4(J),
            M = {
                action: j,
                ok: !J.isError,
                output: X
            };
        if (O.push(M), J.isError) return await c18(K), {
            kind: "action_error",
            executed: O.length - 1,
            failed: M,
            remaining: q.actions.length - O.length,
            telemetry: J.telemetry
        }
    }
    return {
        kind: "ok",
        results: O
    }
}
// @from(Ln 269162, Col 0)
async function gx4(q, K, _, z) {
    let Y = await Qx4(K, _, z);
    if (Y.isError) return nf(q);
    return {
        content: [{
            type: "text",
            text: JSON.stringify(q)
        }, ...Y.content],
        screenshot: Y.screenshot
    }
}
// @from(Ln 269173, Col 0)
async function rDz(q, K, _, z) {
    if (!_.onTeachStep) return X4("Teach mode is not active. Call request_teach_access first.", "teach_mode_not_active");
    let Y = await px4(K, q, _, "teach_step");
    if (Y instanceof Error) return X4(Y.message, "bad_args");
    let A = await Fx4(Y, q, _, z);
    if (A.kind === "exit") return nf({
        exited: !0
    });
    if (A.kind === "action_error") return nf({
        executed: A.executed,
        failed: A.failed,
        remaining: A.remaining
    }, A.telemetry);
    if (Y.actions.length === 0) return nf({
        executed: 0,
        results: []
    });
    return gx4({
        executed: A.results.length,
        results: A.results
    }, q, _, z)
}
// @from(Ln 269195, Col 0)
async function oDz(q, K, _, z) {
    if (!_.onTeachStep) return X4("Teach mode is not active. Call request_teach_access first.", "teach_mode_not_active");
    let Y = K.steps;
    if (!Array.isArray(Y) || Y.length < 1) return X4('"steps" must be a non-empty array.', "bad_args");
    let A = [];
    for (let [j, H] of Y.entries()) {
        if (typeof H !== "object" || H === null) return X4(`steps[${j}] must be an object`, "bad_args");
        let J = await px4(H, q, _, `steps[${j}]`);
        if (J instanceof Error) return X4(J.message, "bad_args");
        A.push(J)
    }
    let O = [];
    for (let [j, H] of A.entries()) {
        let J = await Fx4(H, q, _, z);
        if (J.kind === "exit") return nf({
            exited: !0,
            stepsCompleted: j
        });
        if (J.kind === "action_error") return nf({
            stepsCompleted: j,
            stepFailed: j,
            executed: J.executed,
            failed: J.failed,
            remaining: J.remaining,
            results: O
        }, J.telemetry);
        O.push(J.results)
    }
    let w = A.some((j) => j.actions.length > 0),
        $ = {
            stepsCompleted: A.length,
            results: O
        };
    if (!w) return nf($);
    return gx4($, q, _, z)
}
// @from(Ln 269231, Col 0)
async function Rx4(q, K) {
    if (K.length === 0) return;
    let _ = await q.executor.listRunningApps(),
        z = new Map(_.map((w) => [w.bundleId, w.displayName])),
        Y = K.map((w) => z.get(w) ?? w),
        A = Y.map((w) => `"${w}"`).join(", "),
        O = Y.length === 1;
    return `${A} ${O?"was":"were"} open and got hidden before this screenshot (not in the session allowlist). If a previous action was meant to open ${O?"it":"one of them"}, that's why you don't see it — call ` + `request_access to add ${O?"it":"them"} to the allowlist.`
}
// @from(Ln 269241, Col 0)
function Ux4(q) {
    let K = [...q].sort((Y, A) => Y.displayId - A.displayId),
        _ = new Map,
        z = new Map;
    for (let Y of K) {
        let A = Y.label ?? `display ${Y.displayId}`,
            O = (_.get(A) ?? 0) + 1;
        _.set(A, O), z.set(Y.displayId, O === 1 ? A : `${A} (${O})`)
    }
    return z
}
// @from(Ln 269252, Col 0)
async function Sx4(q, K, _, z) {
    let Y;
    try {
        Y = await q.executor.listDisplays()
    } catch (J) {
        q.logger.warn(`[computer-use] listDisplays failed: ${String(J)}`);
        return
    }
    if (Y.length < 2) return;
    let A = Ux4(Y),
        O = (J) => A.get(J) ?? `display ${J}`,
        w = O(K),
        $ = Y.filter((J) => J.displayId !== K).map((J) => O(J.displayId)),
        j = z ? " Use switch_display to capture a different monitor." : "",
        H = $.length > 0 ? ` Other attached monitors: ${$.map((J)=>`"${J}"`).join(", ")}.` + j : "";
    if (_ === void 0 || _ === 0) return `This screenshot was taken on monitor "${w}".` + H;
    if (_ !== K) {
        let J = O(_);
        return `This screenshot was taken on monitor "${w}", which is different from your previous screenshot (taken on "${J}").` + H
    }
    return
}
// @from(Ln 269274, Col 0)
async function Qx4(q, K, _) {
    if (K.allowedApps.length === 0) return X4("No applications are granted for this session. Call request_access first.", "allowlist_empty");
    if (_.autoTargetDisplay) {
        let $ = K.allowedApps.map((Z) => Z.bundleId),
            j = $.slice().sort().join(","),
            H = j !== K.displayResolvedForApps,
            J = !K.displayPinnedByModel && H,
            X = await q.executor.resolvePrepareCapture({
                allowedBundleIds: $,
                preferredDisplayId: K.selectedDisplayId,
                autoResolve: J,
                doHide: _.hideBeforeAction
            });
        if (X.captureError === void 0 && px8(X.base64) < Ix4) q.logger.warn(`[computer-use] resolvePrepareCapture result implausibly small (${px8(X.base64)} bytes decoded) — possible transient display state`);
        if (X.displayId !== K.selectedDisplayId) q.logger.debug(`[computer-use] resolver: preferred=${K.selectedDisplayId} resolved=${X.displayId}`), K.onResolvedDisplayUpdated?.(X.displayId);
        if (J) K.onDisplayResolvedForApps?.(j);
        let M = [];
        if (K.lastScreenshot !== void 0) M = X.hidden;
        if (X.hidden.length > 0) K.onAppsHidden?.(X.hidden);
        if (X.captureError !== void 0) return X4(X.captureError, "capture_failed");
        let P = await Rx4(q, M),
            W = {
                base64: X.base64,
                width: X.width,
                height: X.height,
                displayWidth: X.displayWidth,
                displayHeight: X.displayHeight,
                displayId: X.displayId,
                originX: X.originX,
                originY: X.originY
            },
            D = await Sx4(q, W.displayId, K.lastScreenshot?.displayId, K.onDisplayPinned !== void 0);
        return {
            content: [...D ? [{
                type: "text",
                text: D
            }] : [], ...P ? [{
                type: "text",
                text: P
            }] : [], {
                type: "image",
                data: W.base64,
                mimeType: "image/jpeg"
            }],
            screenshot: W
        }
    }
    let z = [];
    if (_.hideBeforeAction) {
        let $ = await q.executor.prepareForAction(K.allowedApps.map((j) => j.bundleId), K.selectedDisplayId);
        if (K.lastScreenshot !== void 0) z = $;
        if ($.length > 0) K.onAppsHidden?.($)
    }
    let Y = K.allowedApps.map(($) => $.bundleId),
        A = await gDz(q.executor, Y, q.logger, K.selectedDisplayId),
        O = await Rx4(q, z),
        w = await Sx4(q, A.displayId, K.lastScreenshot?.displayId, K.onDisplayPinned !== void 0);
    return {
        content: [...w ? [{
            type: "text",
            text: w
        }] : [], ...O ? [{
            type: "text",
            text: O
        }] : [], {
            type: "image",
            data: A.base64,
            mimeType: "image/jpeg"
        }],
        screenshot: A
    }
}
// @from(Ln 269346, Col 0)
async function aDz(q, K, _) {
    let z = K.region;
    if (!Array.isArray(z) || z.length !== 4) return X4("region must be an array of length 4: [x0, y0, x1, y1]", "bad_args");
    let [Y, A, O, w] = z;
    if (![Y, A, O, w].every((P) => typeof P === "number" && P >= 0)) return X4("region values must be non-negative numbers", "bad_args");
    if (O <= Y) return X4("region x1 must be greater than x0", "bad_args");
    if (w <= A) return X4("region y1 must be greater than y0", "bad_args");
    let $ = _.lastScreenshot;
    if (!$) return X4("take a screenshot before zooming (region coords are relative to it)", "state_conflict");
    if (O > $.width || w > $.height) return X4(`region exceeds screenshot bounds (${$.width}×${$.height})`, "bad_args");
    let j = $.displayWidth / $.width,
        H = $.displayHeight / $.height,
        J = {
            x: Y * j,
            y: A * H,
            w: (O - Y) * j,
            h: (w - A) * H
        },
        X = _.allowedApps.map((P) => P.bundleId);
    return {
        content: [{
            type: "image",
            data: (await q.executor.zoom(J, X, $.displayId)).base64,
            mimeType: "image/jpeg"
        }]
    }
}
// @from(Ln 269373, Col 0)
async function d18(q, K, _, z, Y, A) {
    if (PT) await q.executor.mouseUp(), PT = !1, sc = !1;
    let O = l18(K);
    if (O instanceof Error) return X4(O.message, "bad_args");
    let [w, $] = O, j;
    if (K.text !== void 0) {
        if (typeof K.text !== "string") return X4("text must be a string", "bad_args");
        if (mx8(K.text, q.executor.capabilities.platform) && !_.grantFlags.systemKeyCombos) return X4(`The modifier chord "${K.text}" would fire a system shortcut. Request the systemKeyCombos grant flag via request_access, or use only modifier keys (shift, ctrl, alt, cmd) in the text parameter.`, "grant_flag_required");
        j = xx4(K.text)
    }
    let H = Y !== "left" || j !== void 0 && j.length > 0 ? "mouse_full" : "mouse",
        J = await At(q, _, z, H);
    if (J) return J;
    let X = await q.executor.getDisplaySize(_.selectedDisplayId);
    if (z.pixelValidation) {
        let {
            xPct: D,
            yPct: Z
        } = FDz(w, $, _.coordinateMode, _.lastScreenshot), G = await kx4(q.cropRawPatch, _.lastScreenshot, D, Z, async () => {
            let f = _.allowedApps.map((v) => v.bundleId);
            try {
                return await q.executor.screenshot({
                    allowedBundleIds: f,
                    displayId: _.lastScreenshot?.displayId
                })
            } catch {
                return null
            }
        }, q.logger);
        if (!G.valid && G.warning) return rf(G.warning)
    }
    let {
        x: M,
        y: P
    } = GR6(w, $, _.coordinateMode, X, _.lastScreenshot, q.logger), W = await WJ6(q, _, z, M, P, H);
    if (W) return W;
    return await q.executor.click(M, P, Y, A, j), rf("Clicked.")
}
// @from(Ln 269411, Col 0)
async function sDz(q, K, _, z) {
    let Y = tc(K, "text");
    if (Y instanceof Error) return X4(Y.message, "bad_args");
    let A = await At(q, _, z, "keyboard");
    if (A) return A;
    if (Y.includes(`
`) && _.grantFlags.clipboardWrite && z.clipboardPasteMultiline) return await q.executor.type(Y, {
        viaClipboard: !0
    }), rf("Typed (via clipboard).");
    let w = QDz(Y);
    for (let [$, j] of w.entries()) {
        if (_.isAborted?.()) return X4(`Typing aborted after ${$} of ${w.length} graphemes (user interrupt).`);
        if (await Ux8(UDz), j === `
` || j === "\r" || j === `\r
`) await q.executor.key("return");
        else if (j === "\t") await q.executor.key("tab");
        else await q.executor.type(j, {
            viaClipboard: !1
        })
    }
    return rf(`Typed ${w.length} grapheme(s).`)
}
// @from(Ln 269433, Col 0)
async function tDz(q, K, _, z) {
    let Y = tc(K, "text");
    if (Y instanceof Error) return X4("text is required", "bad_args");
    let A;
    if (K.repeat !== void 0) {
        if (typeof K.repeat !== "number" || !Number.isInteger(K.repeat) || K.repeat < 1) return X4("repeat must be a positive integer", "bad_args");
        if (K.repeat > 100) return X4("repeat exceeds maximum of 100", "bad_args");
        A = K.repeat
    }
    if (mx8(Y, q.executor.capabilities.platform) && !_.grantFlags.systemKeyCombos) return X4(`"${Y}" is a system-level shortcut. Request the \`systemKeyCombos\` grant via request_access to use it.`, "grant_flag_required");
    let O = await At(q, _, z, "keyboard");
    if (O) return O;
    return await q.executor.key(Y, A), rf("Key pressed.")
}
// @from(Ln 269447, Col 0)
async function eDz(q, K, _, z) {
    let Y = l18(K);
    if (Y instanceof Error) return X4(Y.message, "bad_args");
    let [A, O] = Y, w = K.scroll_direction;
    if (w !== "up" && w !== "down" && w !== "left" && w !== "right") return X4("scroll_direction must be 'up', 'down', 'left', or 'right'", "bad_args");
    let $ = K.scroll_amount;
    if (typeof $ !== "number" || !Number.isInteger($) || $ < 0) return X4("scroll_amount must be a non-negative int", "bad_args");
    if ($ > 100) return X4("scroll_amount exceeds maximum of 100", "bad_args");
    let j = w === "left" ? -$ : w === "right" ? $ : 0,
        H = w === "up" ? -$ : w === "down" ? $ : 0,
        J = await At(q, _, z, "mouse");
    if (J) return J;
    let X = await q.executor.getDisplaySize(_.selectedDisplayId),
        {
            x: M,
            y: P
        } = GR6(A, O, _.coordinateMode, X, _.lastScreenshot, q.logger),
        W = await WJ6(q, _, z, M, P, PT ? "mouse_full" : "mouse");
    if (W) return W;
    if (PT) sc = !0;
    return await q.executor.scroll(M, P, j, H), rf("Scrolled.")
}
// @from(Ln 269469, Col 0)
async function qZz(q, K, _, z) {
    if (PT) await q.executor.mouseUp(), PT = !1, sc = !1;
    let Y = l18(K, "coordinate");
    if (Y instanceof Error) return X4(Y.message, "bad_args");
    let A = Y,
        O;
    if (K.start_coordinate !== void 0) {
        let P = l18(K, "start_coordinate");
        if (P instanceof Error) return X4(P.message, "bad_args");
        O = P
    }
    let w = await At(q, _, z, "mouse");
    if (w) return w;
    let $ = await q.executor.getDisplaySize(_.selectedDisplayId),
        j = O === void 0 ? void 0 : GR6(O[0], O[1], _.coordinateMode, $, _.lastScreenshot, q.logger),
        H = GR6(A[0], A[1], _.coordinateMode, $, _.lastScreenshot, q.logger),
        J = j ?? await q.executor.getCursorPosition(),
        X = await WJ6(q, _, z, J.x, J.y, "mouse");
    if (X) return X;
    let M = await WJ6(q, _, z, H.x, H.y, "mouse_full");
    if (M) return M;
    return await q.executor.drag(j, H), rf("Dragged.")
}
// @from(Ln 269492, Col 0)
async function KZz(q, K, _, z) {
    let Y = l18(K);
    if (Y instanceof Error) return X4(Y.message, "bad_args");
    let [A, O] = Y, $ = await At(q, _, z, PT ? "mouse" : "mouse_position");
    if ($) return $;
    let j = await q.executor.getDisplaySize(_.selectedDisplayId),
        {
            x: H,
            y: J
        } = GR6(A, O, _.coordinateMode, j, _.lastScreenshot, q.logger);
    if (PT) {
        let X = await WJ6(q, _, z, H, J, "mouse_full");
        if (X) return X
    }
    if (await q.executor.moveMouse(H, J), PT) sc = !0;
    return rf("Moved.")
}
// @from(Ln 269509, Col 0)
async function _Zz(q, K, _) {
    let z = tc(K, "app");
    if (z instanceof Error) return X4(z.message, "bad_args");
    let Y = new Set(_.allowedApps.map((O) => O.bundleId)),
        A;
    if (hr1(z) && Y.has(z)) A = z;
    else A = _.allowedApps.find((w) => w.displayName.toLowerCase() === z.toLowerCase())?.bundleId;
    if (!A || !Y.has(A)) return X4(`"${z}" is not granted for this session. Call request_access first.`, "app_not_granted");
    if (await q.executor.openApp(A), _.onDisplayPinned !== void 0) {
        let O = 1;
        try {
            O = (await q.executor.listDisplays()).length
        } catch {}
        if (O >= 2) return rf(`Opened "${z}". If it isn't visible in the next screenshot, it may ` + "have opened on a different monitor — use switch_display to check.")
    }
    return rf(`Opened "${z}".`)
}
// @from(Ln 269526, Col 0)
async function zZz(q, K, _) {
    let z = tc(K, "display");
    if (z instanceof Error) return X4(z.message, "bad_args");
    if (!_.onDisplayPinned) return X4("Display switching is not available in this session.", "feature_unavailable");
    if (z.toLowerCase() === "auto") return _.onDisplayPinned(void 0), rf("Returned to automatic monitor selection. Call screenshot to continue.");
    let Y;
    try {
        Y = await q.executor.listDisplays()
    } catch ($) {
        return X4(`Failed to enumerate displays: ${String($)}`, "display_error")
    }
    if (Y.length < 2) return X4("Only one monitor is connected. There is nothing to switch to.", "bad_args");
    let A = Ux4(Y),
        O = z.toLowerCase(),
        w = Y.find(($) => A.get($.displayId)?.toLowerCase() === O);
    if (!w) {
        let $ = Y.map((j) => `"${A.get(j.displayId)}"`).join(", ");
        return X4(`No monitor named "${z}" is connected. Available monitors: ${$}.`, "bad_args")
    }
    return _.onDisplayPinned(w.displayId), rf(`Switched to monitor "${A.get(w.displayId)}". Call screenshot to see it.`)
}
// @from(Ln 269548, Col 0)
function YZz(q) {
    return nf({
        allowedApps: q.allowedApps,
        grantFlags: q.grantFlags
    })
}
// @from(Ln 269554, Col 0)
async function AZz(q, K, _) {
    if (!K.grantFlags.clipboardRead) return X4("Clipboard read is not granted. Request `clipboardRead` via request_access.", "grant_flag_required");
    if (_.clipboardGuard) {
        let Y = await q.executor.getFrontmostApp(),
            A = new Map(K.allowedApps.map((w) => [w.bundleId, w.tier])),
            O = Y ? A.get(Y.bundleId) : void 0;
        await gx8(q, K, O === "click")
    }
    let z = await q.executor.readClipboard();
    return nf({
        text: z
    })
}
// @from(Ln 269567, Col 0)
async function OZz(q, K, _, z) {
    if (!_.grantFlags.clipboardWrite) return X4("Clipboard write is not granted. Request `clipboardWrite` via request_access.", "grant_flag_required");
    let Y = tc(K, "text");
    if (Y instanceof Error) return X4(Y.message, "bad_args");
    if (z.clipboardGuard) {
        let A = await q.executor.getFrontmostApp(),
            O = new Map(_.allowedApps.map(($) => [$.bundleId, $.tier])),
            w = A ? O.get(A.bundleId) : void 0;
        if (A && w === "click") return X4(`"${A.displayName}" is a tier-"click" app and currently frontmost. write_clipboard is blocked because the next action ` + "would clear the clipboard anyway — a UI Paste button in this " + 'app cannot be used to inject text. Bring a tier-"full" app forward before writing to the clipboard.' + PJ6, "tier_insufficient");
        await gx8(q, _, w === "click")
    }
    return await q.executor.writeClipboard(Y), rf("Clipboard written.")
}
// @from(Ln 269580, Col 0)
async function wZz(q) {
    let K = q.duration;
    if (typeof K !== "number" || !Number.isFinite(K)) return X4("duration must be a number", "bad_args");
    if (K < 0) return X4("duration must be non-negative", "bad_args");
    if (K > 100) return X4("duration is too long. Duration is in seconds.", "bad_args");
    return await Ux8(K * 1000), rf(`Waited ${K}s.`)
}
// @from(Ln 269587, Col 0)
async function $Zz(q, K) {
    let _ = await q.executor.getCursorPosition(),
        z = K.lastScreenshot;
    if (z) {
        let Y = _.x - z.originX,
            A = _.y - z.originY;
        if (Y < 0 || Y > z.displayWidth || A < 0 || A > z.displayHeight) return nf({
            x: _.x,
            y: _.y,
            coordinateSpace: "logical_points",
            note: "cursor is on a different monitor than your last screenshot; take a fresh screenshot"
        });
        let O = Math.round(Y * (z.width / z.displayWidth)),
            w = Math.round(A * (z.height / z.displayHeight));
        return nf({
            x: O,
            y: w,
            coordinateSpace: "image_pixels"
        })
    }
    return nf({
        x: _.x,
        y: _.y,
        coordinateSpace: "logical_points",
        note: "take a screenshot first for image-pixel coordinates"
    })
}
// @from(Ln 269614, Col 0)
async function jZz(q, K, _, z) {
    let Y = tc(K, "text");
    if (Y instanceof Error) return X4(Y.message, "bad_args");
    let A = K.duration;
    if (typeof A !== "number" || !Number.isFinite(A)) return X4("duration must be a number", "bad_args");
    if (A < 0) return X4("duration must be non-negative", "bad_args");
    if (A > 100) return X4("duration is too long. Duration is in seconds.", "bad_args");
    if (mx8(Y, q.executor.capabilities.platform) && !_.grantFlags.systemKeyCombos) return X4(`"${Y}" is a system-level shortcut. Request the \`systemKeyCombos\` grant via request_access to use it.`, "grant_flag_required");
    let O = await At(q, _, z, "keyboard");
    if (O) return O;
    let w = xx4(Y);
    return await q.executor.holdKey(w, A * 1000), rf("Key held.")
}
// @from(Ln 269627, Col 0)
async function HZz(q, K, _) {
    if (PT) return X4("mouse button already held, call left_mouse_up first", "state_conflict");
    let z = await At(q, K, _, "mouse");
    if (z) return z;
    let Y = await q.executor.getCursorPosition(),
        A = await WJ6(q, K, _, Y.x, Y.y, "mouse");
    if (A) return A;
    return await q.executor.mouseDown(), PT = !0, sc = !1, rf("Mouse button pressed.")
}
// @from(Ln 269636, Col 0)
async function JZz(q, K, _) {
    let z = async (w) => {
        return await q.executor.mouseUp(), PT = !1, sc = !1, w
    }, Y = await At(q, K, _, "mouse");
    if (Y) return z(Y);
    let A = await q.executor.getCursorPosition(),
        O = await WJ6(q, K, _, A.x, A.y, sc ? "mouse_full" : "mouse");
    if (O) return z(O);
    return await q.executor.mouseUp(), PT = !1, sc = !1, rf("Mouse button released.")
}
// @from(Ln 269646, Col 0)
async function XZz(q, K, _, z) {
    let Y = K.actions;
    if (!Array.isArray(Y) || Y.length === 0) return X4("actions must be a non-empty array", "bad_args");
    for (let [w, $] of Y.entries()) {
        if (typeof $ !== "object" || $ === null) return X4(`actions[${w}] must be an object`, "bad_args");
        let j = $.action;
        if (typeof j !== "string") return X4(`actions[${w}].action must be a string`, "bad_args");
        if (!Fx8.has(j)) return X4(`actions[${w}].action="${j}" is not allowed in a batch. Allowed: ${[...Fx8].join(", ")}.`, "bad_args")
    }
    if (z.hideBeforeAction) {
        let w = await q.executor.prepareForAction(_.allowedApps.map(($) => $.bundleId), _.selectedDisplayId);
        if (w.length > 0) _.onAppsHidden?.(w)
    }
    let A = {
            ...z,
            hideBeforeAction: !1,
            pixelValidation: !1,
            autoTargetDisplay: !1
        },
        O = [];
    for (let [w, $] of Y.entries()) {
        if (_.isAborted?.()) return await c18(q), X4(`Batch aborted after ${O.length} of ${Y.length} actions (user interrupt).`);
        if (w > 0) await Ux8(10);
        let j = $,
            H = j.action,
            {
                screenshot: J,
                ...X
            } = await Ir1(H, j, q, _, A),
            M = dx4(X),
            P = {
                action: H,
                ok: !X.isError,
                output: M
            };
        if (O.push(P), X.isError) return await c18(q), nf({
            completed: O.slice(0, -1),
            failed: P,
            remaining: Y.length - O.length
        }, X.telemetry)
    }
    return nf({
        completed: O
    })
}
// @from(Ln 269692, Col 0)
function dx4(q) {
    let K = q.content[0];
    return K && K.type === "text" ? K.text : ""
}
// @from(Ln 269696, Col 0)
async function Ir1(q, K, _, z, Y) {
    switch (q) {
        case "screenshot":
            return Qx4(_, z, Y);
        case "zoom":
            return aDz(_, K, z);
        case "left_click":
            return d18(_, K, z, Y, "left", 1);
        case "double_click":
            return d18(_, K, z, Y, "left", 2);
        case "triple_click":
            return d18(_, K, z, Y, "left", 3);
        case "right_click":
            return d18(_, K, z, Y, "right", 1);
        case "middle_click":
            return d18(_, K, z, Y, "middle", 1);
        case "type":
            return sDz(_, K, z, Y);
        case "key":
            return tDz(_, K, z, Y);
        case "scroll":
            return eDz(_, K, z, Y);
        case "left_click_drag":
            return qZz(_, K, z, Y);
        case "mouse_move":
            return KZz(_, K, z, Y);
        case "wait":
            return wZz(K);
        case "cursor_position":
            return $Zz(_, z);
        case "hold_key":
            return jZz(_, K, z, Y);
        case "left_mouse_down":
            return HZz(_, z, Y);
        case "left_mouse_up":
            return JZz(_, z, Y);
        case "open_application":
            return _Zz(_, K, z);
        case "switch_display":
            return zZz(_, K, z);
        case "list_granted_applications":
            return YZz(z);
        case "read_clipboard":
            return AZz(_, z, Y);
        case "write_clipboard":
            return OZz(_, K, z, Y);
        case "computer_batch":
            return XZz(_, K, z, Y);
        default:
            return X4(`Unknown tool "${q}".`, "bad_args")
    }
}
// @from(Ln 269748, Col 0)
async function cx4(q, K, _, z) {
    let {
        logger: Y,
        serverName: A
    } = q, O = new Set(z.userDeniedBundleIds), w = z.allowedApps.some((P) => P.tier === void 0 || O.has(P.bundleId) || ux8(P.bundleId, P.displayName)) ? {
        ...z,
        allowedApps: z.allowedApps.filter((P) => !O.has(P.bundleId)).filter((P) => !ux8(P.bundleId, P.displayName)).map((P) => P.tier !== void 0 ? P : {
            ...P,
            tier: yr1(P.bundleId, P.displayName)
        })
    } : z;
    if (q.isDisabled()) return X4("Computer control is disabled in Settings. Enable it and try again.", "other");
    let $ = await q.ensureOsPermissions(),
        j;
    if (!$.granted) {
        if (K !== "request_access" && K !== "request_teach_access") return X4("Accessibility and Screen Recording permissions are required. Call request_access to show the permission panel.", "tcc_not_granted");
        j = {
            accessibility: $.accessibility,
            screenRecording: $.screenRecording
        }
    }
    let H = br1(K),
        J = w.checkCuLock?.();
    if (J) {
        if (J.holder !== void 0 && !J.isSelf) return X4("Another Claude session is currently using the computer. Wait for the user to acknowledge it is finished (stop button in the Claude window), or find a non-computer-use approach if one is readily apparent.", "cu_lock_held");
        if (J.holder === void 0 && !H) w.acquireCuLock?.(), Cr1()
    }
    let X = q.getSubGates(),
        M = pDz(_);
    Y.silly(`[${A}] tool=${K} args=${JSON.stringify(M).slice(0,200)}`);
    try {
        if (K === "request_access") return await lDz(q, M, w, j);
        if (K === "request_teach_access") return await iDz(q, M, w, j);
        if (K === "teach_step") return await rDz(q, M, w, X);
        if (K === "teach_batch") return await oDz(q, M, w, X);
        return await Ir1(K, M, q, w, X)
    } catch (P) {
        let W = P instanceof Error ? P.message : String(P);
        return Y.error(`[${A}] tool=${K} threw: ${W}`, P), X4(`Tool "${K}" failed: ${W}`, "executor_threw")
    }
}
// @from(Ln 269789, Col 4)
Cx4 = "com.apple.finder"
// @from(Ln 269790, Col 4)
PJ6
// @from(Ln 269790, Col 9)
Ix4 = 1024
// @from(Ln 269791, Col 4)
UDz = 8
// @from(Ln 269792, Col 4)
PT = !1
// @from(Ln 269793, Col 4)
sc = !1
// @from(Ln 269794, Col 4)
dDz
// @from(Ln 269794, Col 9)
Fx8
// @from(Ln 269795, Col 4)
lx4 = L(() => {
    vx4();
    Vx4();
    Lr1();
    PJ6 = " Do not attempt to work around this restriction — never use AppleScript, " + "System Events, shell commands, or any other method to send clicks or keystrokes to this app.";
    dDz = /^[A-Za-z0-9][\w.-]*\.[A-Za-z0-9][\w.-]*$/;
    Fx8 = new Set(["key", "type", "mouse_move", "left_click", "left_click_drag", "right_click", "middle_click", "double_click", "triple_click", "scroll", "hold_key", "screenshot", "cursor_position", "left_mouse_down", "left_mouse_up", "wait"])
})
// @from(Ln 269804, Col 0)
function DJ6(q, K, _) {
    let z = MZz[K],
        Y = _ && _.length > 0 ? ` Available applications on this machine: ${_.join(", ")}.` : "",
        A = {
            type: "array",
            items: {
                type: "number"
            },
            minItems: 2,
            maxItems: 2,
            description: `(x, y): ${z.x}`
        },
        O = {
            type: "string",
            description: 'Modifier keys to hold during the click (e.g. "shift", "ctrl+shift"). Supports the same syntax as the key tool.'
        },
        w = q.screenshotFiltering === "native" ? "Take a screenshot of the primary display. Applications not in the session allowlist are excluded at the compositor level — only granted apps and the desktop are visible." : "Take a screenshot of the primary display. On this platform, screenshots are NOT filtered — all open windows are visible. Input actions targeting apps not in the session allowlist are rejected.";
    return [{
        name: "request_access",
        description: "Request user permission to control a set of applications for this session. Must be called before any other tool in this server. The user sees a single dialog listing all requested apps and either allows the whole set or denies it. Call this again mid-session to add more apps; previously granted apps remain granted. Returns the granted apps, denied apps, and screenshot filtering capability.",
        inputSchema: {
            type: "object",
            properties: {
                apps: {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    description: 'Application display names (e.g. "Slack", "Calendar") or bundle identifiers (e.g. "com.tinyspeck.slackmacgap"). Display names are resolved case-insensitively against installed apps.' + Y
                },
                reason: {
                    type: "string",
                    description: "One-sentence explanation shown to the user in the approval dialog. Explain the task, not the mechanism."
                },
                clipboardRead: {
                    type: "boolean",
                    description: "Also request permission to read the user's clipboard (separate checkbox in the dialog)."
                },
                clipboardWrite: {
                    type: "boolean",
                    description: "Also request permission to write the user's clipboard. When granted, multi-line `type` calls use the clipboard fast path."
                },
                systemKeyCombos: {
                    type: "boolean",
                    description: "Also request permission to send system-level key combos (quit app, switch app, lock screen). Without this, those specific combos are blocked."
                }
            },
            required: ["apps", "reason"]
        }
    }, {
        name: "screenshot",
        description: w + " Returns an error if the allowlist is empty. The returned image is what subsequent click coordinates are relative to.",
        inputSchema: {
            type: "object",
            properties: {
                save_to_disk: {
                    type: "boolean",
                    description: "Save the image to disk so it can be attached to a message for the user. Returns the saved path in the tool result. Only set this when you intend to share the image — screenshots you're just looking at don't need saving."
                }
            },
            required: []
        }
    }, {
        name: "zoom",
        description: "Take a higher-resolution screenshot of a specific region of the last full-screen screenshot. Use this liberally to inspect small text, button labels, or fine UI details that are hard to read in the downsampled full-screen image. IMPORTANT: Coordinates in subsequent click calls always refer to the full-screen screenshot, never the zoomed image. This tool is read-only for inspecting detail.",
        inputSchema: {
            type: "object",
            properties: {
                region: {
                    type: "array",
                    items: {
                        type: "integer"
                    },
                    minItems: 4,
                    maxItems: 4,
                    description: "(x0, y0, x1, y1): Rectangle to zoom into, in the coordinate space of the most recent full-screen screenshot. x0,y0 = top-left, x1,y1 = bottom-right."
                },
                save_to_disk: {
                    type: "boolean",
                    description: "Save the image to disk so it can be attached to a message for the user. Returns the saved path in the tool result. Only set this when you intend to share the image."
                }
            },
            required: ["region"]
        }
    }, {
        name: "left_click",
        description: "Left-click at the given coordinates. The frontmost application must be in the session allowlist at the time of this call, or this tool returns an error and does nothing.",
        inputSchema: {
            type: "object",
            properties: {
                coordinate: A,
                text: O
            },
            required: ["coordinate"]
        }
    }, {
        name: "double_click",
        description: "Double-click at the given coordinates. Selects a word in most text editors. The frontmost application must be in the session allowlist at the time of this call, or this tool returns an error and does nothing.",
        inputSchema: {
            type: "object",
            properties: {
                coordinate: A,
                text: O
            },
            required: ["coordinate"]
        }
    }, {
        name: "triple_click",
        description: "Triple-click at the given coordinates. Selects a line in most text editors. The frontmost application must be in the session allowlist at the time of this call, or this tool returns an error and does nothing.",
        inputSchema: {
            type: "object",
            properties: {
                coordinate: A,
                text: O
            },
            required: ["coordinate"]
        }
    }, {
        name: "right_click",
        description: "Right-click at the given coordinates. Opens a context menu in most applications. The frontmost application must be in the session allowlist at the time of this call, or this tool returns an error and does nothing.",
        inputSchema: {
            type: "object",
            properties: {
                coordinate: A,
                text: O
            },
            required: ["coordinate"]
        }
    }, {
        name: "middle_click",
        description: "Middle-click (scroll-wheel click) at the given coordinates. The frontmost application must be in the session allowlist at the time of this call, or this tool returns an error and does nothing.",
        inputSchema: {
            type: "object",
            properties: {
                coordinate: A,
                text: O
            },
            required: ["coordinate"]
        }
    }, {
        name: "type",
        description: "Type text into whatever currently has keyboard focus. The frontmost application must be in the session allowlist at the time of this call, or this tool returns an error and does nothing. Newlines are supported. For keyboard shortcuts use `key` instead.",
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Text to type."
                }
            },
            required: ["text"]
        }
    }, {
        name: "key",
        description: 'Press a key or key combination (e.g. "return", "escape", "cmd+a", "ctrl+shift+tab"). The frontmost application must be in the session allowlist at the time of this call, or this tool returns an error and does nothing. ' + "System-level combos (quit app, switch app, lock screen) require the `systemKeyCombos` grant — without it they return an error. All other combos work.",
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: 'Modifiers joined with "+", e.g. "cmd+shift+a".'
                },
                repeat: {
                    type: "integer",
                    minimum: 1,
                    maximum: 100,
                    description: "Number of times to repeat the key press. Default is 1."
                }
            },
            required: ["text"]
        }
    }, {
        name: "scroll",
        description: "Scroll at the given coordinates. The frontmost application must be in the session allowlist at the time of this call, or this tool returns an error and does nothing.",
        inputSchema: {
            type: "object",
            properties: {
                coordinate: A,
                scroll_direction: {
                    type: "string",
                    enum: ["up", "down", "left", "right"],
                    description: "Direction to scroll."
                },
                scroll_amount: {
                    type: "integer",
                    minimum: 0,
                    maximum: 100,
                    description: "Number of scroll ticks."
                }
            },
            required: ["coordinate", "scroll_direction", "scroll_amount"]
        }
    }, {
        name: "left_click_drag",
        description: "Press, move to target, and release. The frontmost application must be in the session allowlist at the time of this call, or this tool returns an error and does nothing.",
        inputSchema: {
            type: "object",
            properties: {
                coordinate: {
                    ...A,
                    description: `(x, y) end point: ${z.x}`
                },
                start_coordinate: {
                    ...A,
                    description: `(x, y) start point. If omitted, drags from the current cursor position. ${z.x}`
                }
            },
            required: ["coordinate"]
        }
    }, {
        name: "mouse_move",
        description: "Move the mouse cursor without clicking. Useful for triggering hover states. The frontmost application must be in the session allowlist at the time of this call, or this tool returns an error and does nothing.",
        inputSchema: {
            type: "object",
            properties: {
                coordinate: A
            },
            required: ["coordinate"]
        }
    }, {
        name: "open_application",
        description: "Bring an application to the front, launching it if necessary. The target application must already be in the session allowlist — call request_access first.",
        inputSchema: {
            type: "object",
            properties: {
                app: {
                    type: "string",
                    description: 'Display name (e.g. "Slack") or bundle identifier (e.g. "com.tinyspeck.slackmacgap").'
                }
            },
            required: ["app"]
        }
    }, {
        name: "switch_display",
        description: "Switch which monitor subsequent screenshots capture. Use this when the application you need is on a different monitor than the one shown. The screenshot tool tells you which monitor it captured and lists " + "other attached monitors by name — pass one of those names here. " + 'After switching, call screenshot to see the new monitor. Pass "auto" to return to automatic monitor selection.',
        inputSchema: {
            type: "object",
            properties: {
                display: {
                    type: "string",
                    description: 'Monitor name from the screenshot note (e.g. "Built-in Retina Display", "LG UltraFine"), or "auto" to re-enable automatic selection.'
                }
            },
            required: ["display"]
        }
    }, {
        name: "list_granted_applications",
        description: "List the applications currently in the session allowlist, plus the active grant flags and coordinate mode. No side effects.",
        inputSchema: {
            type: "object",
            properties: {},
            required: []
        }
    }, {
        name: "read_clipboard",
        description: "Read the current clipboard contents as text. Requires the `clipboardRead` grant.",
        inputSchema: {
            type: "object",
            properties: {},
            required: []
        }
    }, {
        name: "write_clipboard",
        description: "Write text to the clipboard. Requires the `clipboardWrite` grant.",
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string"
                }
            },
            required: ["text"]
        }
    }, {
        name: "wait",
        description: "Wait for a specified duration.",
        inputSchema: {
            type: "object",
            properties: {
                duration: {
                    type: "number",
                    description: "Duration in seconds (0–100)."
                }
            },
            required: ["duration"]
        }
    }, {
        name: "cursor_position",
        description: "Get the current mouse cursor position. Returns image-pixel coordinates relative to the most recent screenshot, or logical points if no screenshot has been taken.",
        inputSchema: {
            type: "object",
            properties: {},
            required: []
        }
    }, {
        name: "hold_key",
        description: "Press and hold a key or key combination for the specified duration, then release. The frontmost application must be in the session allowlist at the time of this call, or this tool returns an error and does nothing. System-level combos require the `systemKeyCombos` grant.",
        inputSchema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: 'Key or chord to hold, e.g. "space", "shift+down".'
                },
                duration: {
                    type: "number",
                    description: "Duration in seconds (0–100)."
                }
            },
            required: ["text", "duration"]
        }
    }, {
        name: "left_mouse_down",
        description: "Press the left mouse button at the current cursor position and leave it held. The frontmost application must be in the session allowlist at the time of this call, or this tool returns an error and does nothing. Use mouse_move first to position the cursor. Call left_mouse_up to release. Errors if the button is already held.",
        inputSchema: {
            type: "object",
            properties: {},
            required: []
        }
    }, {
        name: "left_mouse_up",
        description: "Release the left mouse button at the current cursor position. The frontmost application must be in the session allowlist at the time of this call, or this tool returns an error and does nothing. Pairs with left_mouse_down. Safe to call even if the button is not currently held.",
        inputSchema: {
            type: "object",
            properties: {},
            required: []
        }
    }, {
        name: "computer_batch",
        description: "Execute a sequence of actions in ONE tool call. Each individual tool call requires a model→API round trip (seconds); " + "batching a predictable sequence eliminates all but one. Use this whenever you can predict the outcome of several actions ahead — " + `e.g. click a field, type into it, press Return. Actions execute sequentially and stop on the first error. ${"The frontmost application must be in the session allowlist at the time of this call, or this tool returns an error and does nothing."} The frontmost check runs before EACH action inside the batch — if an action opens a non-allowed app, the next action's gate fires and the batch stops there. ` + "Mid-batch screenshot actions are allowed for inspection but coordinates in subsequent clicks always refer to the PRE-BATCH full-screen screenshot.",
        inputSchema: {
            type: "object",
            properties: {
                actions: {
                    type: "array",
                    minItems: 1,
                    items: nx4,
                    description: 'List of actions. Example: [{"action":"left_click","coordinate":[100,200]},{"action":"type","text":"hello"},{"action":"key","text":"Return"}]'
                }
            },
            required: ["actions"]
        }
    }, ...q.teachMode ? PZz(z, Y) : []]
}
// @from(Ln 270149, Col 0)
function PZz(q, K) {
    let _ = {
        explanation: {
            type: "string",
            description: "Tooltip body text. Explain what the user is looking at and why it matters. " + "This is the ONLY place the user sees your words — be complete but concise."
        },
        next_preview: {
            type: "string",
            description: `One line describing exactly what will happen when the user clicks Next. Example: "Next: I'll click Create Bucket and type the name." Shown below the explanation in a smaller font.`
        },
        anchor: {
            type: "array",
            items: {
                type: "number"
            },
            minItems: 2,
            maxItems: 2,
            description: `(x, y) — where the tooltip arrow points. ${q.x} Omit to center the tooltip with no arrow (for general-context steps).`
        },
        actions: {
            type: "array",
            items: nx4,
            description: "Actions to execute when the user clicks Next. Same item schema as computer_batch.actions. Empty array is valid for purely explanatory steps. Actions run sequentially and stop on first error."
        }
    };
    return [{
        name: "request_teach_access",
        description: 'Request permission to guide the user through a task step-by-step with on-screen tooltips. Use this INSTEAD OF request_access when the user wants to LEARN how to do something (phrases like "teach me", "walk me through", "show me how", "help me learn"). On approval the main Claude window hides and a fullscreen tooltip overlay appears. You then call teach_step repeatedly; each call shows one tooltip and waits for the user to click Next. Same app-allowlist semantics as request_access, but no clipboard/system-key flags. Teach mode ends automatically when your turn ends.',
        inputSchema: {
            type: "object",
            properties: {
                apps: {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    description: 'Application display names (e.g. "Slack", "Calendar") or bundle identifiers. Resolved case-insensitively against installed apps.' + K
                },
                reason: {
                    type: "string",
                    description: 'What you will be teaching. Shown in the approval dialog as "Claude wants to guide you through {reason}". Keep it short and task-focused.'
                }
            },
            required: ["apps", "reason"]
        }
    }, {
        name: "teach_step",
        description: "Show one guided-tour tooltip and wait for the user to click Next. On Next, execute the actions, " + "take a fresh screenshot, and return both — you do NOT need a separate screenshot call between steps. " + "The returned image shows the state after your actions ran; anchor the next teach_step against it. " + "IMPORTANT — the user only sees the tooltip during teach mode. Put ALL narration in `explanation`. " + "Text you emit outside teach_step calls is NOT visible until teach mode ends. " + "Pack as many actions as possible into each step's `actions` array — the user waits through " + "the whole round trip between clicks, so one step that fills a form beats five steps that fill one field each. " + "Returns {exited:true} if the user clicks Exit — do not call teach_step again after that. " + "Take an initial screenshot before your FIRST teach_step to anchor it.",
        inputSchema: {
            type: "object",
            properties: _,
            required: ["explanation", "next_preview", "actions"]
        }
    }, {
        name: "teach_batch",
        description: "Queue multiple teach steps in one tool call. Parallels computer_batch: " + "N steps → one model↔API round trip instead of N. Each step still shows a tooltip " + "and waits for the user's Next click, but YOU aren't waiting for a round trip between steps. " + "You can call teach_batch multiple times in one tour — treat each batch as one predictable " + "SEGMENT (typically: all the steps on one page). The returned screenshot shows the state after the batch's final actions; anchor the NEXT teach_batch against it. WITHIN a batch, all anchors and click coordinates refer to the PRE-BATCH screenshot " + "(same invariant as computer_batch) — for steps 2+ in a batch, either omit anchor " + "(centered tooltip) or target elements you know won't have moved. " + "Good pattern: batch 5 tooltips on page A (last step navigates) → read returned screenshot → " + "batch 3 tooltips on page B → done. " + "Returns {exited:true, stepsCompleted:N} if the user clicks Exit — do NOT call again after that; " + "{stepsCompleted, stepFailed, ...} if an action errors mid-batch; otherwise {stepsCompleted, results:[...]} plus a final screenshot. Fall back to individual teach_step calls when you need to react to each intermediate screenshot.",
        inputSchema: {
            type: "object",
            properties: {
                steps: {
                    type: "array",
                    minItems: 1,
                    items: {
                        type: "object",
                        properties: _,
                        required: ["explanation", "next_preview", "actions"]
                    },
                    description: "Ordered steps. Validated upfront — a typo in step 5 errors before any tooltip shows."
                }
            },
            required: ["steps"]
        }
    }]
}
// @from(Ln 270223, Col 4)
MZz
// @from(Ln 270223, Col 9)
nx4
// @from(Ln 270224, Col 4)
xr1 = L(() => {
    MZz = {
        pixels: {
            x: "Horizontal pixel position read directly from the most recent screenshot image, measured from the left edge. The server handles all scaling.",
            y: "Vertical pixel position read directly from the most recent screenshot image, measured from the top edge. The server handles all scaling."
        },
        normalized_0_100: {
            x: "Horizontal position as a percentage of screen width, 0.0–100.0 (0 = left edge, 100 = right edge).",
            y: "Vertical position as a percentage of screen height, 0.0–100.0 (0 = top edge, 100 = bottom edge)."
        }
    }, nx4 = {
        type: "object",
        properties: {
            action: {
                type: "string",
                enum: ["key", "type", "mouse_move", "left_click", "left_click_drag", "right_click", "middle_click", "double_click", "triple_click", "scroll", "hold_key", "screenshot", "cursor_position", "left_mouse_down", "left_mouse_up", "wait"],
                description: "The action to perform."
            },
            coordinate: {
                type: "array",
                items: {
                    type: "number"
                },
                minItems: 2,
                maxItems: 2,
                description: "(x, y) for click/mouse_move/scroll/left_click_drag end point."
            },
            start_coordinate: {
                type: "array",
                items: {
                    type: "number"
                },
                minItems: 2,
                maxItems: 2,
                description: "(x, y) drag start — left_click_drag only. Omit to drag from current cursor."
            },
            text: {
                type: "string",
                description: "For type: the text. For key/hold_key: the chord string. For click/scroll: modifier keys to hold."
            },
            scroll_direction: {
                type: "string",
                enum: ["up", "down", "left", "right"]
            },
            scroll_amount: {
                type: "integer",
                minimum: 0,
                maximum: 100
            },
            duration: {
                type: "number",
                description: "Seconds (0–100). For hold_key/wait."
            },
            repeat: {
                type: "integer",
                minimum: 1,
                maximum: 100,
                description: "For key: repeat count."
            }
        },
        required: ["action"]
    }
})
// @from(Ln 270288, Col 0)
function rx4(q, K, _) {
    let z = new Set(q.map((w) => w.bundleId)),
        Y = [...q, ..._.granted.filter((w) => !z.has(w.bundleId))],
        A = Object.fromEntries(Object.entries(_.flags).filter(([, w]) => w === !0)),
        O = {
            ...ac,
            ...K,
            ...A
        };
    return {
        apps: Y,
        flags: O
    }
}
// @from(Ln 270303, Col 0)
function Qx8(q, K, _) {
    let {
        logger: z,
        serverName: Y
    } = q, A, O = _.onPermissionRequest ? async ($, j) => {
        let H = await _.onPermissionRequest($, j),
            {
                apps: J,
                flags: X
            } = rx4(_.getAllowedApps(), _.getGrantFlags(), H);
        return z.debug(`[${Y}] permission result: granted=${H.granted.length} denied=${H.denied.length}`), _.onAllowedAppsChanged?.(J, X), H
    }: void 0, w = _.onTeachPermissionRequest ? async ($, j) => {
        let H = await _.onTeachPermissionRequest($, j);
        z.debug(`[${Y}] teach permission result: granted=${H.granted.length} denied=${H.denied.length}`);
        let {
            apps: J
        } = rx4(_.getAllowedApps(), _.getGrantFlags(), H);
        return _.onAllowedAppsChanged?.(J, {
            ...ac,
            ..._.getGrantFlags()
        }), H
    }: void 0;
    return async ($, j) => {
        if (_.checkCuLock) {
            let M = await _.checkCuLock();
            if (M.holder !== void 0 && !M.isSelf) return {
                content: [{
                    type: "text",
                    text: _.formatLockHeldMessage?.(M.holder) ?? ix4
                }],
                isError: !0,
                telemetry: {
                    error_kind: "cu_lock_held"
                }
            };
            if (M.holder === void 0 && !br1($)) {
                await _.acquireCuLock?.();
                let P = await _.checkCuLock();
                if (P.holder !== void 0 && !P.isSelf) return {
                    content: [{
                        type: "text",
                        text: _.formatLockHeldMessage?.(P.holder) ?? ix4
                    }],
                    isError: !0,
                    telemetry: {
                        error_kind: "cu_lock_held"
                    }
                };
                Cr1()
            }
        }
        let H = A ? void 0 : _.getLastScreenshotDims?.(),
            J = new AbortController,
            X = {
                allowedApps: [..._.getAllowedApps()],
                grantFlags: _.getGrantFlags(),
                userDeniedBundleIds: _.getUserDeniedBundleIds(),
                coordinateMode: K,
                selectedDisplayId: _.getSelectedDisplayId(),
                displayPinnedByModel: _.getDisplayPinnedByModel?.(),
                displayResolvedForApps: _.getDisplayResolvedForApps?.(),
                lastScreenshot: A ?? (H ? {
                    ...H,
                    base64: ""
                } : void 0),
                onPermissionRequest: O ? (M) => O(M, J.signal) : void 0,
                onTeachPermissionRequest: w ? (M) => w(M, J.signal) : void 0,
                onAppsHidden: _.onAppsHidden,
                getClipboardStash: _.getClipboardStash,
                onClipboardStashChanged: _.onClipboardStashChanged,
                onResolvedDisplayUpdated: _.onResolvedDisplayUpdated,
                onDisplayPinned: _.onDisplayPinned,
                onDisplayResolvedForApps: _.onDisplayResolvedForApps,
                onTeachModeActivated: _.onTeachModeActivated,
                onTeachStep: _.onTeachStep,
                onTeachWorking: _.onTeachWorking,
                getTeachModeActive: _.getTeachModeActive,
                checkCuLock: void 0,
                acquireCuLock: void 0,
                isAborted: _.isAborted
            };
        z.debug(`[${Y}] tool=${$} allowedApps=${X.allowedApps.length} coordMode=${K}`);
        try {
            let M = await cx4(q, $, j, X);
            if (M.screenshot) {
                A = M.screenshot;
                let {
                    base64: P,
                    ...W
                } = M.screenshot;
                z.debug(`[${Y}] screenshot dims: ${JSON.stringify(W)}`), _.onScreenshotCaptured?.(W)
            }
            return M
        } finally {
            J.abort()
        }
    }
}
// @from(Ln 270402, Col 0)
function ur1(q, K, _) {
    let {
        serverName: z,
        logger: Y
    } = q, A = new zA6({
        name: z,
        version: "0.1.3"
    }, {
        capabilities: {
            tools: {},
            logging: {}
        }
    }), O = DJ6(q.executor.capabilities, K);
    if (A.setRequestHandler(wr, async () => q.isDisabled() ? {
            tools: []
        } : {
            tools: O
        }), _) {
        let w = Qx8(q, K, _);
        return A.setRequestHandler(YU, async ($) => {
            let {
                screenshot: j,
                telemetry: H,
                ...J
            } = await w($.params.name, $.params.arguments ?? {});
            return J
        }), A
    }
    return A.setRequestHandler(YU, async (w) => {
        return Y.warn(`[${z}] tool call "${w.params.name}" reached the stub handler — no session context bound. Per-session state unavailable.`), {
            content: [{
                type: "text",
                text: "This computer-use server instance is not wired to a session. Per-session app permissions are not available on this code path."
            }],
            isError: !0
        }
    }), A
}
// @from(Ln 270440, Col 4)
ix4 = "Another Claude session is currently using the computer. Wait for that session to finish, or find a non-computer-use approach."
// @from(Ln 270441, Col 4)
ox4 = L(() => {
    mj8();
    _P();
    lx4();
    xr1();
    Ix8()
})
// @from(Ln 270448, Col 4)
n18 = L(() => {
    Ix8();
    Gx4();
    ox4();
    xr1()
})
// @from(Ln 270454, Col 4)
ax4 = p((znw, mr1) => {
    var __dirname = "/home/runner/code/tmp/claude-cli-external-build-2239/node_modules/@ant/computer-use-input/js",
        WZz = d6("path");
    if (process.platform !== "darwin") mr1.exports = {
        isSupported: !1
    };
    else {
        let q = d6(process.env.COMPUTER_USE_INPUT_NODE_PATH ?? WZz.resolve(__dirname, "../prebuilds/computer-use-input.node"));
        mr1.exports = {
            isSupported: !0,
            ...q
        }
    }
})
// @from(Ln 270469, Col 0)
function xx() {
    if (Br1) return Br1;
    let q = ax4();
    if (!q.isSupported) throw Error("@ant/computer-use-input is not supported on this platform");
    return Br1 = q
}
// @from(Ln 270475, Col 4)
Br1
// @from(Ln 270476, Col 4)
ex4 = {}
// @from(Ln 270482, Col 0)
function Fr1(q, K, _) {
    let z = Math.round(q * _),
        Y = Math.round(K * _);
    return xx8(z, Y, Er1)
}
// @from(Ln 270487, Col 0)
async function gr1() {
    let {
        stdout: q,
        code: K
    } = await w1("pbpaste", [], {
        useCwd: !1
    });
    if (K !== 0) throw Error(`pbpaste exited with code ${K}`);
    return q
}
// @from(Ln 270497, Col 0)
async function Ur1(q) {
    let {
        code: K
    } = await w1("pbcopy", [], {
        input: q,
        useCwd: !1
    });
    if (K !== 0) throw Error(`pbcopy exited with code ${K}`)
}
// @from(Ln 270507, Col 0)
function sx4(q) {
    if (q.length !== 1) return !1;
    let K = q[0].toLowerCase();
    return K === "escape" || K === "esc"
}
// @from(Ln 270512, Col 0)
async function vR6(q, K, _) {
    await q.moveMouse(K, _, !1), await l7(Qr1)
}
// @from(Ln 270515, Col 0)
async function tx4(q, K) {
    let _;
    while ((_ = K.pop()) !== void 0) try {
        await q.key(_, "release")
    } catch {}
}
// @from(Ln 270521, Col 0)
async function DZz(q, K, _) {
    let z = [];
    try {
        for (let Y of K) await q.key(Y, "press"), z.push(Y);
        return await _()
    } finally {
        await tx4(q, z)
    }
}
// @from(Ln 270530, Col 0)
async function ZZz(q, K) {
    let _;
    try {
        _ = await gr1()
    } catch {
        E("[computer-use] pbpaste before paste failed; proceeding without restore")
    }
    try {
        if (await Ur1(K), await gr1() !== K) throw Error("Clipboard write did not round-trip.");
        await q.keys(["command", "v"]), await l7(100)
    } finally {
        if (typeof _ === "string") try {
            await Ur1(_)
        } catch {
            E("[computer-use] clipboard restore after paste failed")
        }
    }
}
// @from(Ln 270548, Col 0)
async function fZz(q, K, _, z) {
    if (!z) {
        await vR6(q, K, _);
        return
    }
    let Y = await q.mouseLocation(),
        A = K - Y.x,
        O = _ - Y.y,
        w = Math.hypot(A, O);
    if (w < 1) return;
    let $ = Math.min(w / 2000, 0.5);
    if ($ < 0.03) {
        await vR6(q, K, _);
        return
    }
    let j = 60,
        H = 1000 / j,
        J = Math.floor($ * j);
    for (let X = 1; X <= J; X++) {
        let M = X / J,
            P = 1 - Math.pow(1 - M, 3);
        if (await q.moveMouse(Math.round(Y.x + A * P), Math.round(Y.y + O * P), !1), X < J) await l7(H)
    }
    await l7(Qr1)
}
// @from(Ln 270574, Col 0)
function dr1(q) {
    if (process.platform !== "darwin") throw Error(`createCliExecutor called on ${process.platform}. Computer control is macOS-only.`);
    let K = oR(),
        {
            getMouseAnimationEnabled: _,
            getHideBeforeActionEnabled: z
        } = q,
        Y = n74(),
        A = Y ?? cC1,
        O = (w) => Y === null ? [...w] : w.filter(($) => $ !== Y);
    return E(Y ? `[computer-use] terminal ${Y} → surrogate host (hide-exempt, activate-skip, screenshot-excluded)` : "[computer-use] terminal not detected; falling back to sentinel host"), {
        capabilities: {
            ...Dk8,
            hostBundleId: cC1
        },
        async prepareForAction(w, $) {
            if (!z()) return [];
            return zF(async () => {
                try {
                    let j = await K.apps.prepareDisplay(w, A, $);
                    if (j.activated) E(`[computer-use] prepareForAction: activated ${j.activated}`);
                    return j.hidden
                } catch (j) {
                    return E(`[computer-use] prepareForAction failed; continuing to action: ${b6(j)}`, {
                        level: "warn"
                    }), []
                }
            })
        },
        async previewHideSet(w, $) {
            return K.apps.previewHideSet([...w, A], $)
        },
        async getDisplaySize(w) {
            return K.display.getSize(w)
        },
        async listDisplays() {
            return K.display.listAll()
        },
        async findWindowDisplays(w) {
            return K.apps.findWindowDisplays(w)
        },
        async resolvePrepareCapture(w) {
            let $ = K.display.getSize(w.preferredDisplayId),
                [j, H] = Fr1($.width, $.height, $.scaleFactor);
            return zF(() => K.resolvePrepareCapture(O(w.allowedBundleIds), A, pr1, j, H, w.preferredDisplayId, w.autoResolve, w.doHide))
        },
        async screenshot(w) {
            let $ = K.display.getSize(w.displayId),
                [j, H] = Fr1($.width, $.height, $.scaleFactor);
            return zF(() => K.screenshot.captureExcluding(O(w.allowedBundleIds), pr1, j, H, w.displayId))
        },
        async zoom(w, $, j) {
            let H = K.display.getSize(j),
                [J, X] = Fr1(w.w, w.h, H.scaleFactor);
            return zF(() => K.screenshot.captureRegion(O($), w.x, w.y, w.w, w.h, J, X, pr1, j))
        },
        async key(w, $) {
            let j = xx(),
                H = w.split("+").filter((M) => M.length > 0),
                J = sx4(H),
                X = $ ?? 1;
            await zF(async () => {
                for (let M = 0; M < X; M++) {
                    if (M > 0) await l7(8);
                    if (J) Nr1();
                    await j.keys(H)
                }
            })
        },
        async holdKey(w, $) {
            let j = xx(),
                H = [],
                J = !1;
            try {
                await zF(async () => {
                    for (let X of w) {
                        if (J) return;
                        if (sx4([X])) Nr1();
                        await j.key(X, "press"), H.push(X)
                    }
                }), await l7($)
            } finally {
                J = !0, await zF(() => tx4(j, H))
            }
        },
        async type(w, $) {
            let j = xx();
            if ($.viaClipboard) {
                await zF(() => ZZz(j, w));
                return
            }
            await j.typeText(w)
        },
        readClipboard: gr1,
        writeClipboard: Ur1,
        async moveMouse(w, $) {
            await vR6(xx(), w, $)
        },
        async click(w, $, j, H, J) {
            let X = xx();
            if (await vR6(X, w, $), J && J.length > 0) await zF(() => DZz(X, J, () => X.mouseButton(j, "click", H)));
            else await X.mouseButton(j, "click", H)
        },
        async mouseDown() {
            await xx().mouseButton("left", "press")
        },
        async mouseUp() {
            await xx().mouseButton("left", "release")
        },
        async getCursorPosition() {
            return xx().mouseLocation()
        },
        async drag(w, $) {
            let j = xx();
            if (w !== void 0) await vR6(j, w.x, w.y);
            await j.mouseButton("left", "press"), await l7(Qr1);
            try {
                await fZz(j, $.x, $.y, _())
            } finally {
                await j.mouseButton("left", "release")
            }
        },
        async scroll(w, $, j, H) {
            let J = xx();
            if (await vR6(J, w, $), H !== 0) await J.mouseScroll(H, "vertical");
            if (j !== 0) await J.mouseScroll(j, "horizontal")
        },
        async getFrontmostApp() {
            let w = xx().getFrontmostAppInfo();
            if (!w || !w.bundleId) return null;
            return {
                bundleId: w.bundleId,
                displayName: w.appName
            }
        },
        async appUnderPoint(w, $) {
            return K.apps.appUnderPoint(w, $)
        },
        async listInstalledApps() {
            return zF(() => K.apps.listInstalled())
        },
        async getAppIcon(w) {
            return K.apps.iconDataUrl(w) ?? void 0
        },
        async listRunningApps() {
            return K.apps.listRunning()
        },
        async openApp(w) {
            await K.apps.open(w)
        }
    }
}
// @from(Ln 270726, Col 0)
async function GZz(q) {
    if (q.length === 0) return;
    await oR().apps.unhide([...q])
}
// @from(Ln 270730, Col 4)
pr1 = 0.75
// @from(Ln 270731, Col 4)
Qr1 = 50
// @from(Ln 270732, Col 4)
cr1 = L(() => {
    n18();
    K8();
    m8();
    Q4();
    Va();
    kr1();
    bx8()
})
// @from(Ln 270741, Col 0)
async function i18(q) {
    let _ = q.getAppState().computerUseMcpState?.hiddenDuringTurn;
    if (_ && _.size > 0) {
        let {
            unhideComputerUseApps: z
        } = await Promise.resolve().then(() => (cr1(), ex4)), Y = z([..._]).catch((w) => E(`[Computer Use MCP] auto-unhide failed: ${b6(w)}`)), A = Rx8(), O = setTimeout(A.resolve, vZz);
        await Promise.race([Y, A.promise]).finally(() => clearTimeout(O)), q.setComputerUseMcpState?.((w) => w?.hiddenDuringTurn === void 0 ? w : {
            ...w,
            hiddenDuringTurn: void 0
        })
    }
    if (!Ox4()) return;
    try {
        Dx4()
    } catch (z) {
        E(`[Computer Use MCP] unregisterEscHotkey failed: ${b6(z)}`)
    }
    if (await Tr1()) q.sendOSNotification?.({
        message: "Claude is done using your computer",
        notificationType: "computer_use_exit"
    })
}
// @from(Ln 270763, Col 4)
vZz = 5000
// @from(Ln 270764, Col 4)
lr1 = L(() => {
    K8();
    m8();
    Vr1();
    bx8()
})
// @from(Ln 270771, Col 0)
function VZz() {
    let q = _h(),
        K = q.getEntriesByType("mark");
    for (let _ of K)
        if (_.name.startsWith(o18)) q.clearMarks(_.name)
}
// @from(Ln 270778, Col 0)
function ir1() {
    if (!I7()) return;
    if (!nr1) return;
    if (r18++, VZz(), _h().mark(`${o18}turn_start`), dx8) E(`[headlessProfiler] Started turn ${r18}`)
}
// @from(Ln 270784, Col 0)
function GM(q) {
    if (!I7()) return;
    if (!nr1) return;
    let K = _h();
    if (K.mark(`${o18}${q}`), dx8) E(`[headlessProfiler] Checkpoint: ${q} at ${K.now().toFixed(1)}ms`)
}
// @from(Ln 270791, Col 0)
function rr1() {
    if (!I7()) return;
    if (!nr1) return;
    let _ = _h().getEntriesByType("mark").filter((H) => H.name.startsWith(o18));
    if (_.length === 0) return;
    let z = new Map;
    for (let H of _) {
        let J = H.name.slice(o18.length);
        z.set(J, H.startTime)
    }
    let Y = z.get("turn_start");
    if (Y === void 0) return;
    let A = {
            turn_number: r18
        },
        O = z.get("system_message_yielded");
    if (O !== void 0 && r18 === 0) A.time_to_system_message_ms = Math.round(O);
    let w = z.get("query_started");
    if (w !== void 0) A.time_to_query_start_ms = Math.round(w - Y);
    let $ = z.get("first_chunk");
    if ($ !== void 0) A.time_to_first_response_ms = Math.round($ - Y);
    let j = z.get("api_request_sent");
    if (w !== void 0 && j !== void 0) A.query_overhead_ms = Math.round(j - w);
    if (A.checkpoint_count = _.length, process.env.CLAUDE_CODE_ENTRYPOINT) A.entrypoint = process.env.CLAUDE_CODE_ENTRYPOINT;
    if (qu4) d("tengu_headless_latency", A);
    if (dx8) E(`[headlessProfiler] Turn ${r18} metrics: ${I6(A)}`)
}
// @from(Ln 270818, Col 4)
dx8
// @from(Ln 270818, Col 9)
TZz = 0.05
// @from(Ln 270819, Col 4)
qu4
// @from(Ln 270819, Col 9)
nr1
// @from(Ln 270819, Col 14)
o18 = "headless_"
// @from(Ln 270820, Col 4)
r18 = -1
// @from(Ln 270821, Col 4)
a18 = L(() => {
    y8();
    C8();
    K8();
    Q8();
    A28();
    e8();
    dx8 = S6(process.env.CLAUDE_CODE_PROFILE_STARTUP), qu4 = Math.random() < TZz, nr1 = dx8 || qu4
})
// @from(Ln 270831, Col 0)
function _u4(q) {
    Ku4.push(q)
}
// @from(Ln 270834, Col 0)
async function zu4(q, K, _, z, Y, A) {
    let O = {
        messages: q,
        systemPrompt: K,
        userContext: _,
        systemContext: z,
        toolUseContext: Y,
        querySource: A
    };
    for (let w of Ku4) try {
        await w(O)
    } catch ($) {
        j6(r1($))
    }
}
// @from(Ln 270849, Col 4)
Ku4
// @from(Ln 270850, Col 4)
or1 = L(() => {
    m8();
    U8();
    Ku4 = []
})
// @from(Ln 270866, Col 0)
function yZz(q) {
    return kZz("sha256").update(q).digest("hex")
}
// @from(Ln 270870, Col 0)
function s18(q) {
    cx8.delete(q)
}
// @from(Ln 270874, Col 0)
function Au4() {
    cx8.clear()
}
// @from(Ln 270878, Col 0)
function hZz(q) {
    let K = q.messages;
    if (!Array.isArray(K)) return q;
    let _ = K.map((z) => {
        if (!z || typeof z !== "object") return z;
        let Y = z.content;
        if (!Array.isArray(Y)) return z;
        return {
            ...z,
            content: Y.map(Ou4)
        }
    });
    return {
        ...q,
        messages: _
    }
}
// @from(Ln 270896, Col 0)
function Ou4(q) {
    if (!q || typeof q !== "object") return q;
    let K = q,
        _ = K.source;
    if (_ && typeof _ === "object") {
        let z = _;
        if (typeof z.data === "string" && z.data.length > 256) return {
            ...K,
            source: {
                ...z,
                data: `[${z.data.length} base64 chars]`
            }
        }
    }
    if (Array.isArray(K.content)) return {
        ...K,
        content: K.content.map(Ou4)
    };
    return q
}
// @from(Ln 270917, Col 0)
function RZz(q) {
    return
}
// @from(Ln 270921, Col 0)
function SZz(q) {
    return EZz(A7(), "dump-prompts", `${q??I8()}.jsonl`)
}
// @from(Ln 270925, Col 0)
function CZz(q, K) {
    if (K.length === 0) return;
    Yu4.mkdir(NZz(q), {
        recursive: !0
    }).then(() => Yu4.appendFile(q, K.join(`
`) + `
`)).catch(() => {})
}
// @from(Ln 270934, Col 0)
function bZz(q) {
    let {
        tools: K,
        system: _
    } = q, z = typeof _ === "string" ? _ : Array.isArray(_) ? _.map((A) => I6(A)).join("\x00") : "", Y = K ? K.map((A) => I6(A)).join("\x00") : "";
    return `${q.model}|${nU6(Y)}|${nU6(z)}`
}
// @from(Ln 270942, Col 0)
function IZz(q, K, _, z) {
    try {
        let Y = n8(q);
        RZz(Y);
        return
    } catch {}
}
// @from(Ln 270950, Col 0)
function wu4(q) {
    let K = SZz(q);
    return async (_, z) => {
        let Y = cx8.get(q) ?? {
            initialized: !1,
            messageCountSeen: 0,
            lastInitDataHash: "",
            lastInitFingerprint: ""
        };
        if (cx8.set(q, Y), z?.method === "POST" && z.body) {
            let A = new Date().toISOString();
            setImmediate(IZz, z.body, A, Y, K)
        }
        return globalThis.fetch(_, z)
    }
}
// @from(Ln 270966, Col 4)
LZz = 5
// @from(Ln 270967, Col 4)
ar1
// @from(Ln 270967, Col 9)
cx8
// @from(Ln 270968, Col 4)
_36 = L(() => {
    y8();
    Q8();
    e8();
    ar1 = [], cx8 = new Map
})
// @from(Ln 270974, Col 4)
xZz = (q) => ({
        name: "Cedar",
        aliases: ["cedarpolicy"],
        keywords: {
            keyword: "permit forbid when unless if then else in has like is",
            built_in: "principal action resource context decimal ip contains containsAll containsAny",
            literal: "true false"
        },
        contains: [q.QUOTE_STRING_MODE, q.C_NUMBER_MODE, q.C_LINE_COMMENT_MODE, {
            className: "meta",
            begin: /@\w+/
        }, {
            className: "type",
            begin: /\b[A-Z]\w*(::[A-Z]\w*)*/
        }]
    })
// @from(Ln 270990, Col 4)
$u4
// @from(Ln 270991, Col 4)
ju4 = L(() => {
    $u4 = xZz
})
// @from(Ln 270995, Col 0)
function Hu4(q) {
    for (let [K, _] of Object.entries(uZz))
        if (!q.getLanguage(K)) q.registerLanguage(K, _)
}
// @from(Ln 270999, Col 4)
uZz
// @from(Ln 271000, Col 4)
Ju4 = L(() => {
    ju4();
    uZz = {
        cedar: $u4
    }
})