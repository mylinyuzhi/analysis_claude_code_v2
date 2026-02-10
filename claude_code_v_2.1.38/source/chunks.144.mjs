
// @from(Ln 366266, Col 0)
class VG6 {
    ws;
    started = !1;
    opened;
    isBun = typeof Bun < "u";
    constructor(A) {
        this.ws = A;
        if (this.opened = new Promise((q, K) => {
                if (this.ws.readyState === fG6) q();
                else if (this.isBun) {
                    let Y = this.ws,
                        z = () => {
                            Y.removeEventListener("open", z), Y.removeEventListener("error", w), q()
                        },
                        w = (H) => {
                            Y.removeEventListener("open", z), Y.removeEventListener("error", w), H8("error", "mcp_websocket_connect_fail"), K(H)
                        };
                    Y.addEventListener("open", z), Y.addEventListener("error", w)
                } else {
                    let Y = this.ws;
                    Y.on("open", () => {
                        q()
                    }), Y.on("error", (z) => {
                        H8("error", "mcp_websocket_connect_fail"), K(z)
                    })
                }
            }), this.isBun) {
            let q = this.ws;
            q.addEventListener("message", this.onBunMessage), q.addEventListener("error", this.onBunError), q.addEventListener("close", this.onBunClose)
        } else {
            let q = this.ws;
            q.on("message", this.onNodeMessage), q.on("error", this.onNodeError), q.on("close", this.onNodeClose)
        }
    }
    onclose;
    onerror;
    onmessage;
    onBunMessage = (A) => {
        try {
            let q = typeof A.data === "string" ? A.data : String(A.data),
                K = _A(q),
                Y = Ah.parse(K);
            this.onmessage?.(Y)
        } catch (q) {
            this.handleError(q)
        }
    };
    onBunError = () => {
        this.handleError(Error("WebSocket error"))
    };
    onBunClose = () => {
        this.handleCloseCleanup()
    };
    onNodeMessage = (A) => {
        try {
            let q = _A(A.toString("utf-8")),
                K = Ah.parse(q);
            this.onmessage?.(K)
        } catch (q) {
            this.handleError(q)
        }
    };
    onNodeError = (A) => {
        this.handleError(A)
    };
    onNodeClose = () => {
        this.handleCloseCleanup()
    };
    handleError(A) {
        H8("error", "mcp_websocket_message_fail"), this.onerror?.(A instanceof Error ? A : Error("Failed to process message"))
    }
    handleCloseCleanup() {
        if (this.onclose?.(), this.isBun) {
            let A = this.ws;
            A.removeEventListener("message", this.onBunMessage), A.removeEventListener("error", this.onBunError), A.removeEventListener("close", this.onBunClose)
        } else {
            let A = this.ws;
            A.off("message", this.onNodeMessage), A.off("error", this.onNodeError), A.off("close", this.onNodeClose)
        }
    }
    async start() {
        if (this.started) throw Error("Start can only be called once per transport.");
        if (await this.opened, this.ws.readyState !== fG6) throw H8("error", "mcp_websocket_start_not_opened"), Error("WebSocket is not open. Cannot start transport.");
        this.started = !0
    }
    async close() {
        if (this.ws.readyState === fG6 || this.ws.readyState === RxY) this.ws.close();
        this.handleCloseCleanup()
    }
    async send(A) {
        if (this.ws.readyState !== fG6) throw H8("error", "mcp_websocket_send_not_opened"), Error("WebSocket is not open. Cannot send message.");
        let q = Q1(A);
        try {
            if (this.isBun) this.ws.send(q);
            else await new Promise((K, Y) => {
                this.ws.send(q, (z) => {
                    if (z) Y(z);
                    else K()
                })
            })
        } catch (K) {
            throw this.handleError(K), K
        }
    }
}
// @from(Ln 366371, Col 4)
RxY = 0
// @from(Ln 366372, Col 4)
fG6 = 1
// @from(Ln 366373, Col 4)
mn4 = v(() => {
    gD();
    f0();
    m6()
})
// @from(Ln 366378, Col 4)
Fn4 = ""
// @from(Ln 366379, Col 4)
Qn4 = ""
// @from(Ln 366381, Col 0)
function ig1(A) {
    let q = e(13),
        {
            ratio: K,
            width: Y,
            fillColor: z,
            emptyColor: w
        } = A,
        H = Math.min(1, Math.max(0, K)),
        $ = Math.floor(H * Y),
        O;
    if (q[0] !== $) O = lg1[lg1.length - 1].repeat($), q[0] = $, q[1] = O;
    else O = q[1];
    let _;
    if (q[2] !== H || q[3] !== O || q[4] !== $ || q[5] !== Y) {
        if (_ = [O], $ < Y) {
            let D = H * Y - $,
                j = Math.floor(D * lg1.length);
            _.push(lg1[j]);
            let M = Y - $ - 1;
            if (M > 0) {
                let P;
                if (q[7] !== M) P = lg1[0].repeat(M), q[7] = M, q[8] = P;
                else P = q[8];
                _.push(P)
            }
        }
        q[2] = H, q[3] = O, q[4] = $, q[5] = Y, q[6] = _
    } else _ = q[6];
    let J = _.join(""),
        X;
    if (q[9] !== w || q[10] !== z || q[11] !== J) X = gn4.default.createElement(V, {
        color: z,
        backgroundColor: w
    }, J), q[9] = w, q[10] = z, q[11] = J, q[12] = X;
    else X = q[12];
    return X
}
// @from(Ln 366419, Col 4)
gn4
// @from(Ln 366419, Col 9)
lg1
// @from(Ln 366420, Col 4)
iyA = v(() => {
    i1();
    m1();
    gn4 = o(X1(), 1), lg1 = [" ", "▏", "▎", "▍", "▌", "▋", "▊", "▉", "█"]
})
// @from(Ln 366426, Col 0)
function Un4(A) {
    if (Object.keys(A).length === 0) return "";
    return Object.entries(A).map(([q, K]) => `${q}: ${Q1(K)}`).join(", ")
}
// @from(Ln 366431, Col 0)
function pn4() {
    return PK.createElement(Y9, null)
}
// @from(Ln 366435, Col 0)
function dn4(A, {
    verbose: q
}) {
    return PK.createElement(z5, {
        result: A,
        verbose: q
    })
}
// @from(Ln 366444, Col 0)
function cn4(A) {
    let q = A.at(-1);
    if (!q?.data) return PK.createElement(HA, {
        height: 1
    }, PK.createElement(V, {
        dimColor: !0
    }, "Running…"));
    let {
        progress: K,
        total: Y,
        progressMessage: z
    } = q.data;
    if (K === void 0) return PK.createElement(HA, {
        height: 1
    }, PK.createElement(V, {
        dimColor: !0
    }, "Running…"));
    if (Y !== void 0 && Y > 0) {
        let w = Math.min(1, Math.max(0, K / Y)),
            H = Math.round(w * 100);
        return PK.createElement(HA, null, PK.createElement(I, {
            flexDirection: "column"
        }, z && PK.createElement(V, {
            dimColor: !0
        }, z), PK.createElement(I, {
            flexDirection: "row",
            gap: 1
        }, PK.createElement(ig1, {
            ratio: w,
            width: 20
        }), PK.createElement(V, {
            dimColor: !0
        }, H, "%"))))
    }
    return PK.createElement(HA, {
        height: 1
    }, PK.createElement(V, {
        dimColor: !0
    }, z ?? `Processing… ${K}`))
}
// @from(Ln 366485, Col 0)
function NG6(A, q, {
    verbose: K
}) {
    let Y = A,
        z = MXA(Y),
        H = z > yxY ? `${l1.warning} Large MCP response (~${Y3(z)} tokens), this can fill up context quickly` : null,
        $;
    if (Array.isArray(Y)) {
        let O = Y.map((_, J) => {
            if (_.type === "image") return PK.createElement(I, {
                key: J,
                justifyContent: "space-between",
                overflowX: "hidden",
                width: "100%"
            }, PK.createElement(HA, {
                height: 1
            }, PK.createElement(V, null, "[Image]")));
            let X = _.type === "text" && "text" in _ && _.text !== null && _.text !== void 0 ? String(_.text) : "";
            return PK.createElement(PB, {
                key: J,
                content: X,
                verbose: K
            })
        });
        $ = PK.createElement(I, {
            flexDirection: "column",
            width: "100%"
        }, O)
    } else if (!Y) $ = PK.createElement(I, {
        justifyContent: "space-between",
        overflowX: "hidden",
        width: "100%"
    }, PK.createElement(HA, {
        height: 1
    }, PK.createElement(V, {
        dimColor: !0
    }, "(No content)")));
    else $ = PK.createElement(PB, {
        content: Y,
        verbose: K
    });
    if (H) return PK.createElement(I, {
        flexDirection: "column"
    }, PK.createElement(HA, {
        height: 1
    }, PK.createElement(V, {
        color: "warning"
    }, H)), $);
    return $
}
// @from(Ln 366535, Col 4)
PK
// @from(Ln 366535, Col 8)
yxY = 1e4
// @from(Ln 366536, Col 4)
nyA = v(() => {
    m1();
    CX();
    UO();
    H01();
    eq();
    vq();
    b7();
    k$6();
    m6();
    iyA();
    PK = o(X1(), 1)
})
// @from(Ln 366549, Col 4)
CxY
// @from(Ln 366549, Col 9)
SxY
// @from(Ln 366549, Col 14)
ln4
// @from(Ln 366550, Col 4)
in4 = v(() => {
    i7();
    nyA();
    CxY = z7(() => u.object({}).passthrough()), SxY = z7(() => u.string().describe("MCP tool execution result")), ln4 = {
        isMcp: !0,
        isEnabled() {
            return !0
        },
        isConcurrencySafe() {
            return !1
        },
        isReadOnly() {
            return !1
        },
        isDestructive() {
            return !1
        },
        isOpenWorld() {
            return !1
        },
        name: "mcp",
        maxResultSizeChars: 1e5,
        async description() {
            return Qn4
        },
        async prompt() {
            return Fn4
        },
        get inputSchema() {
            return CxY()
        },
        get outputSchema() {
            return SxY()
        },
        async call() {
            return {
                data: ""
            }
        },
        async checkPermissions() {
            return {
                behavior: "passthrough",
                message: "MCPTool requires permission."
            }
        },
        renderToolUseMessage: Un4,
        userFacingName: () => "mcp",
        renderToolUseRejectedMessage: pn4,
        renderToolUseErrorMessage: dn4,
        renderToolUseProgressMessage: cn4,
        renderToolResultMessage: NG6,
        mapToolResultToToolResultBlockParam(A, q) {
            return {
                tool_use_id: q,
                type: "tool_result",
                content: A
            }
        }
    }
})
// @from(Ln 366610, Col 4)
ryA = R((uxY) => {
    function nn4() {
        var A = {};
        return A["align-content"] = !1, A["align-items"] = !1, A["align-self"] = !1, A["alignment-adjust"] = !1, A["alignment-baseline"] = !1, A.all = !1, A["anchor-point"] = !1, A.animation = !1, A["animation-delay"] = !1, A["animation-direction"] = !1, A["animation-duration"] = !1, A["animation-fill-mode"] = !1, A["animation-iteration-count"] = !1, A["animation-name"] = !1, A["animation-play-state"] = !1, A["animation-timing-function"] = !1, A.azimuth = !1, A["backface-visibility"] = !1, A.background = !0, A["background-attachment"] = !0, A["background-clip"] = !0, A["background-color"] = !0, A["background-image"] = !0, A["background-origin"] = !0, A["background-position"] = !0, A["background-repeat"] = !0, A["background-size"] = !0, A["baseline-shift"] = !1, A.binding = !1, A.bleed = !1, A["bookmark-label"] = !1, A["bookmark-level"] = !1, A["bookmark-state"] = !1, A.border = !0, A["border-bottom"] = !0, A["border-bottom-color"] = !0, A["border-bottom-left-radius"] = !0, A["border-bottom-right-radius"] = !0, A["border-bottom-style"] = !0, A["border-bottom-width"] = !0, A["border-collapse"] = !0, A["border-color"] = !0, A["border-image"] = !0, A["border-image-outset"] = !0, A["border-image-repeat"] = !0, A["border-image-slice"] = !0, A["border-image-source"] = !0, A["border-image-width"] = !0, A["border-left"] = !0, A["border-left-color"] = !0, A["border-left-style"] = !0, A["border-left-width"] = !0, A["border-radius"] = !0, A["border-right"] = !0, A["border-right-color"] = !0, A["border-right-style"] = !0, A["border-right-width"] = !0, A["border-spacing"] = !0, A["border-style"] = !0, A["border-top"] = !0, A["border-top-color"] = !0, A["border-top-left-radius"] = !0, A["border-top-right-radius"] = !0, A["border-top-style"] = !0, A["border-top-width"] = !0, A["border-width"] = !0, A.bottom = !1, A["box-decoration-break"] = !0, A["box-shadow"] = !0, A["box-sizing"] = !0, A["box-snap"] = !0, A["box-suppress"] = !0, A["break-after"] = !0, A["break-before"] = !0, A["break-inside"] = !0, A["caption-side"] = !1, A.chains = !1, A.clear = !0, A.clip = !1, A["clip-path"] = !1, A["clip-rule"] = !1, A.color = !0, A["color-interpolation-filters"] = !0, A["column-count"] = !1, A["column-fill"] = !1, A["column-gap"] = !1, A["column-rule"] = !1, A["column-rule-color"] = !1, A["column-rule-style"] = !1, A["column-rule-width"] = !1, A["column-span"] = !1, A["column-width"] = !1, A.columns = !1, A.contain = !1, A.content = !1, A["counter-increment"] = !1, A["counter-reset"] = !1, A["counter-set"] = !1, A.crop = !1, A.cue = !1, A["cue-after"] = !1, A["cue-before"] = !1, A.cursor = !1, A.direction = !1, A.display = !0, A["display-inside"] = !0, A["display-list"] = !0, A["display-outside"] = !0, A["dominant-baseline"] = !1, A.elevation = !1, A["empty-cells"] = !1, A.filter = !1, A.flex = !1, A["flex-basis"] = !1, A["flex-direction"] = !1, A["flex-flow"] = !1, A["flex-grow"] = !1, A["flex-shrink"] = !1, A["flex-wrap"] = !1, A.float = !1, A["float-offset"] = !1, A["flood-color"] = !1, A["flood-opacity"] = !1, A["flow-from"] = !1, A["flow-into"] = !1, A.font = !0, A["font-family"] = !0, A["font-feature-settings"] = !0, A["font-kerning"] = !0, A["font-language-override"] = !0, A["font-size"] = !0, A["font-size-adjust"] = !0, A["font-stretch"] = !0, A["font-style"] = !0, A["font-synthesis"] = !0, A["font-variant"] = !0, A["font-variant-alternates"] = !0, A["font-variant-caps"] = !0, A["font-variant-east-asian"] = !0, A["font-variant-ligatures"] = !0, A["font-variant-numeric"] = !0, A["font-variant-position"] = !0, A["font-weight"] = !0, A.grid = !1, A["grid-area"] = !1, A["grid-auto-columns"] = !1, A["grid-auto-flow"] = !1, A["grid-auto-rows"] = !1, A["grid-column"] = !1, A["grid-column-end"] = !1, A["grid-column-start"] = !1, A["grid-row"] = !1, A["grid-row-end"] = !1, A["grid-row-start"] = !1, A["grid-template"] = !1, A["grid-template-areas"] = !1, A["grid-template-columns"] = !1, A["grid-template-rows"] = !1, A["hanging-punctuation"] = !1, A.height = !0, A.hyphens = !1, A.icon = !1, A["image-orientation"] = !1, A["image-resolution"] = !1, A["ime-mode"] = !1, A["initial-letters"] = !1, A["inline-box-align"] = !1, A["justify-content"] = !1, A["justify-items"] = !1, A["justify-self"] = !1, A.left = !1, A["letter-spacing"] = !0, A["lighting-color"] = !0, A["line-box-contain"] = !1, A["line-break"] = !1, A["line-grid"] = !1, A["line-height"] = !1, A["line-snap"] = !1, A["line-stacking"] = !1, A["line-stacking-ruby"] = !1, A["line-stacking-shift"] = !1, A["line-stacking-strategy"] = !1, A["list-style"] = !0, A["list-style-image"] = !0, A["list-style-position"] = !0, A["list-style-type"] = !0, A.margin = !0, A["margin-bottom"] = !0, A["margin-left"] = !0, A["margin-right"] = !0, A["margin-top"] = !0, A["marker-offset"] = !1, A["marker-side"] = !1, A.marks = !1, A.mask = !1, A["mask-box"] = !1, A["mask-box-outset"] = !1, A["mask-box-repeat"] = !1, A["mask-box-slice"] = !1, A["mask-box-source"] = !1, A["mask-box-width"] = !1, A["mask-clip"] = !1, A["mask-image"] = !1, A["mask-origin"] = !1, A["mask-position"] = !1, A["mask-repeat"] = !1, A["mask-size"] = !1, A["mask-source-type"] = !1, A["mask-type"] = !1, A["max-height"] = !0, A["max-lines"] = !1, A["max-width"] = !0, A["min-height"] = !0, A["min-width"] = !0, A["move-to"] = !1, A["nav-down"] = !1, A["nav-index"] = !1, A["nav-left"] = !1, A["nav-right"] = !1, A["nav-up"] = !1, A["object-fit"] = !1, A["object-position"] = !1, A.opacity = !1, A.order = !1, A.orphans = !1, A.outline = !1, A["outline-color"] = !1, A["outline-offset"] = !1, A["outline-style"] = !1, A["outline-width"] = !1, A.overflow = !1, A["overflow-wrap"] = !1, A["overflow-x"] = !1, A["overflow-y"] = !1, A.padding = !0, A["padding-bottom"] = !0, A["padding-left"] = !0, A["padding-right"] = !0, A["padding-top"] = !0, A.page = !1, A["page-break-after"] = !1, A["page-break-before"] = !1, A["page-break-inside"] = !1, A["page-policy"] = !1, A.pause = !1, A["pause-after"] = !1, A["pause-before"] = !1, A.perspective = !1, A["perspective-origin"] = !1, A.pitch = !1, A["pitch-range"] = !1, A["play-during"] = !1, A.position = !1, A["presentation-level"] = !1, A.quotes = !1, A["region-fragment"] = !1, A.resize = !1, A.rest = !1, A["rest-after"] = !1, A["rest-before"] = !1, A.richness = !1, A.right = !1, A.rotation = !1, A["rotation-point"] = !1, A["ruby-align"] = !1, A["ruby-merge"] = !1, A["ruby-position"] = !1, A["shape-image-threshold"] = !1, A["shape-outside"] = !1, A["shape-margin"] = !1, A.size = !1, A.speak = !1, A["speak-as"] = !1, A["speak-header"] = !1, A["speak-numeral"] = !1, A["speak-punctuation"] = !1, A["speech-rate"] = !1, A.stress = !1, A["string-set"] = !1, A["tab-size"] = !1, A["table-layout"] = !1, A["text-align"] = !0, A["text-align-last"] = !0, A["text-combine-upright"] = !0, A["text-decoration"] = !0, A["text-decoration-color"] = !0, A["text-decoration-line"] = !0, A["text-decoration-skip"] = !0, A["text-decoration-style"] = !0, A["text-emphasis"] = !0, A["text-emphasis-color"] = !0, A["text-emphasis-position"] = !0, A["text-emphasis-style"] = !0, A["text-height"] = !0, A["text-indent"] = !0, A["text-justify"] = !0, A["text-orientation"] = !0, A["text-overflow"] = !0, A["text-shadow"] = !0, A["text-space-collapse"] = !0, A["text-transform"] = !0, A["text-underline-position"] = !0, A["text-wrap"] = !0, A.top = !1, A.transform = !1, A["transform-origin"] = !1, A["transform-style"] = !1, A.transition = !1, A["transition-delay"] = !1, A["transition-duration"] = !1, A["transition-property"] = !1, A["transition-timing-function"] = !1, A["unicode-bidi"] = !1, A["vertical-align"] = !1, A.visibility = !1, A["voice-balance"] = !1, A["voice-duration"] = !1, A["voice-family"] = !1, A["voice-pitch"] = !1, A["voice-range"] = !1, A["voice-rate"] = !1, A["voice-stress"] = !1, A["voice-volume"] = !1, A.volume = !1, A["white-space"] = !1, A.widows = !1, A.width = !0, A["will-change"] = !1, A["word-break"] = !0, A["word-spacing"] = !0, A["word-wrap"] = !0, A["wrap-flow"] = !1, A["wrap-through"] = !1, A["writing-mode"] = !1, A["z-index"] = !1, A
    }

    function hxY(A, q, K) {}

    function IxY(A, q, K) {}
    var xxY = /javascript\s*\:/img;

    function bxY(A, q) {
        if (xxY.test(q)) return "";
        return q
    }
    uxY.whiteList = nn4();
    uxY.getDefaultWhiteList = nn4;
    uxY.onAttr = hxY;
    uxY.onIgnoreAttr = IxY;
    uxY.safeAttrValue = bxY
})
// @from(Ln 366631, Col 4)
oyA = R((jVH, rn4) => {
    rn4.exports = {
        indexOf: function(A, q) {
            var K, Y;
            if (Array.prototype.indexOf) return A.indexOf(q);
            for (K = 0, Y = A.length; K < Y; K++)
                if (A[K] === q) return K;
            return -1
        },
        forEach: function(A, q, K) {
            var Y, z;
            if (Array.prototype.forEach) return A.forEach(q, K);
            for (Y = 0, z = A.length; Y < z; Y++) q.call(K, A[Y], Y, A)
        },
        trim: function(A) {
            if (String.prototype.trim) return A.trim();
            return A.replace(/(^\s*)|(\s*$)/g, "")
        },
        trimRight: function(A) {
            if (String.prototype.trimRight) return A.trimRight();
            return A.replace(/(\s*$)/g, "")
        }
    }
})
// @from(Ln 366655, Col 4)
an4 = R((MVH, on4) => {
    var ng1 = oyA();

    function UxY(A, q) {
        if (A = ng1.trimRight(A), A[A.length - 1] !== ";") A += ";";
        var K = A.length,
            Y = !1,
            z = 0,
            w = 0,
            H = "";

        function $() {
            if (!Y) {
                var J = ng1.trim(A.slice(z, w)),
                    X = J.indexOf(":");
                if (X !== -1) {
                    var D = ng1.trim(J.slice(0, X)),
                        j = ng1.trim(J.slice(X + 1));
                    if (D) {
                        var M = q(z, H.length, D, j, J);
                        if (M) H += M + "; "
                    }
                }
            }
            z = w + 1
        }
        for (; w < K; w++) {
            var O = A[w];
            if (O === "/" && A[w + 1] === "*") {
                var _ = A.indexOf("*/", w + 2);
                if (_ === -1) break;
                w = _ + 1, z = w + 1, Y = !1
            } else if (O === "(") Y = !0;
            else if (O === ")") Y = !1;
            else if (O === ";")
                if (Y);
                else $();
            else if (O === `
`) $()
        }
        return ng1.trim(H)
    }
    on4.exports = UxY
})
// @from(Ln 366699, Col 4)
Ar4 = R((WVH, en4) => {
    var TG6 = ryA(),
        pxY = an4(),
        PVH = oyA();

    function sn4(A) {
        return A === void 0 || A === null
    }

    function dxY(A) {
        var q = {};
        for (var K in A) q[K] = A[K];
        return q
    }

    function tn4(A) {
        A = dxY(A || {}), A.whiteList = A.whiteList || TG6.whiteList, A.onAttr = A.onAttr || TG6.onAttr, A.onIgnoreAttr = A.onIgnoreAttr || TG6.onIgnoreAttr, A.safeAttrValue = A.safeAttrValue || TG6.safeAttrValue, this.options = A
    }
    tn4.prototype.process = function(A) {
        if (A = A || "", A = A.toString(), !A) return "";
        var q = this,
            K = q.options,
            Y = K.whiteList,
            z = K.onAttr,
            w = K.onIgnoreAttr,
            H = K.safeAttrValue,
            $ = pxY(A, function(O, _, J, X, D) {
                var j = Y[J],
                    M = !1;
                if (j === !0) M = j;
                else if (typeof j === "function") M = j(X);
                else if (j instanceof RegExp) M = j.test(X);
                if (M !== !0) M = !1;
                if (X = H(J, X), !X) return;
                var P = {
                    position: _,
                    sourcePosition: O,
                    source: D,
                    isWhite: M
                };
                if (M) {
                    var W = z(J, X, P);
                    if (sn4(W)) return J + ":" + X;
                    else return W
                } else {
                    var W = w(J, X, P);
                    if (!sn4(W)) return W
                }
            });
        return $
    };
    en4.exports = tn4
})
// @from(Ln 366752, Col 4)
kG6 = R((EG6, ayA) => {
    var qr4 = ryA(),
        Kr4 = Ar4();

    function cxY(A, q) {
        var K = new Kr4(q);
        return K.process(A)
    }
    EG6 = ayA.exports = cxY;
    EG6.FilterCSS = Kr4;
    for (vG6 in qr4) EG6[vG6] = qr4[vG6];
    var vG6;
    if (typeof window < "u") window.filterCSS = ayA.exports
})
// @from(Ln 366766, Col 4)
LG6 = R((GVH, Yr4) => {
    Yr4.exports = {
        indexOf: function(A, q) {
            var K, Y;
            if (Array.prototype.indexOf) return A.indexOf(q);
            for (K = 0, Y = A.length; K < Y; K++)
                if (A[K] === q) return K;
            return -1
        },
        forEach: function(A, q, K) {
            var Y, z;
            if (Array.prototype.forEach) return A.forEach(q, K);
            for (Y = 0, z = A.length; Y < z; Y++) q.call(K, A[Y], Y, A)
        },
        trim: function(A) {
            if (String.prototype.trim) return A.trim();
            return A.replace(/(^\s*)|(\s*$)/g, "")
        },
        spaceIndex: function(A) {
            var q = /\s|\n|\t/,
                K = q.exec(A);
            return K ? K.index : -1
        }
    }
})
// @from(Ln 366791, Col 4)
syA = R((_bY) => {
    var lxY = kG6().FilterCSS,
        ixY = kG6().getDefaultWhiteList,
        yG6 = LG6();

    function Hr4() {
        return {
            a: ["target", "href", "title"],
            abbr: ["title"],
            address: [],
            area: ["shape", "coords", "href", "alt"],
            article: [],
            aside: [],
            audio: ["autoplay", "controls", "crossorigin", "loop", "muted", "preload", "src"],
            b: [],
            bdi: ["dir"],
            bdo: ["dir"],
            big: [],
            blockquote: ["cite"],
            br: [],
            caption: [],
            center: [],
            cite: [],
            code: [],
            col: ["align", "valign", "span", "width"],
            colgroup: ["align", "valign", "span", "width"],
            dd: [],
            del: ["datetime"],
            details: ["open"],
            div: [],
            dl: [],
            dt: [],
            em: [],
            figcaption: [],
            figure: [],
            font: ["color", "size", "face"],
            footer: [],
            h1: [],
            h2: [],
            h3: [],
            h4: [],
            h5: [],
            h6: [],
            header: [],
            hr: [],
            i: [],
            img: ["src", "alt", "title", "width", "height", "loading"],
            ins: ["datetime"],
            kbd: [],
            li: [],
            mark: [],
            nav: [],
            ol: [],
            p: [],
            pre: [],
            s: [],
            section: [],
            small: [],
            span: [],
            sub: [],
            summary: [],
            sup: [],
            strong: [],
            strike: [],
            table: ["width", "border", "align", "valign"],
            tbody: ["align", "valign"],
            td: ["width", "rowspan", "colspan", "align", "valign"],
            tfoot: ["align", "valign"],
            th: ["width", "rowspan", "colspan", "align", "valign"],
            thead: ["align", "valign"],
            tr: ["rowspan", "align", "valign"],
            tt: [],
            u: [],
            ul: [],
            video: ["autoplay", "controls", "crossorigin", "loop", "muted", "playsinline", "poster", "preload", "src", "height", "width"]
        }
    }
    var $r4 = new lxY;

    function nxY(A, q, K) {}

    function rxY(A, q, K) {}

    function oxY(A, q, K) {}

    function axY(A, q, K) {}

    function Or4(A) {
        return A.replace(txY, "&lt;").replace(exY, "&gt;")
    }

    function sxY(A, q, K, Y) {
        if (K = Mr4(K), q === "href" || q === "src") {
            if (K = yG6.trim(K), K === "#") return "#";
            if (!(K.substr(0, 7) === "http://" || K.substr(0, 8) === "https://" || K.substr(0, 7) === "mailto:" || K.substr(0, 4) === "tel:" || K.substr(0, 11) === "data:image/" || K.substr(0, 6) === "ftp://" || K.substr(0, 2) === "./" || K.substr(0, 3) === "../" || K[0] === "#" || K[0] === "/")) return ""
        } else if (q === "background") {
            if (RG6.lastIndex = 0, RG6.test(K)) return ""
        } else if (q === "style") {
            if (zr4.lastIndex = 0, zr4.test(K)) return "";
            if (wr4.lastIndex = 0, wr4.test(K)) {
                if (RG6.lastIndex = 0, RG6.test(K)) return ""
            }
            if (Y !== !1) Y = Y || $r4, K = Y.process(K)
        }
        return K = Pr4(K), K
    }
    var txY = /</g,
        exY = />/g,
        AbY = /"/g,
        qbY = /&quot;/g,
        KbY = /&#([a-zA-Z0-9]*);?/gim,
        YbY = /&colon;?/gim,
        zbY = /&newline;?/gim,
        RG6 = /((j\s*a\s*v\s*a|v\s*b|l\s*i\s*v\s*e)\s*s\s*c\s*r\s*i\s*p\s*t\s*|m\s*o\s*c\s*h\s*a):/gi,
        zr4 = /e\s*x\s*p\s*r\s*e\s*s\s*s\s*i\s*o\s*n\s*\(.*/gi,
        wr4 = /u\s*r\s*l\s*\(.*/gi;

    function _r4(A) {
        return A.replace(AbY, "&quot;")
    }

    function Jr4(A) {
        return A.replace(qbY, '"')
    }

    function Xr4(A) {
        return A.replace(KbY, function(K, Y) {
            return Y[0] === "x" || Y[0] === "X" ? String.fromCharCode(parseInt(Y.substr(1), 16)) : String.fromCharCode(parseInt(Y, 10))
        })
    }

    function Dr4(A) {
        return A.replace(YbY, ":").replace(zbY, " ")
    }

    function jr4(A) {
        var q = "";
        for (var K = 0, Y = A.length; K < Y; K++) q += A.charCodeAt(K) < 32 ? " " : A.charAt(K);
        return yG6.trim(q)
    }

    function Mr4(A) {
        return A = Jr4(A), A = Xr4(A), A = Dr4(A), A = jr4(A), A
    }

    function Pr4(A) {
        return A = _r4(A), A = Or4(A), A
    }

    function wbY() {
        return ""
    }

    function HbY(A, q) {
        if (typeof q !== "function") q = function() {};
        var K = !Array.isArray(A);

        function Y(H) {
            if (K) return !0;
            return yG6.indexOf(A, H) !== -1
        }
        var z = [],
            w = !1;
        return {
            onIgnoreTag: function(H, $, O) {
                if (Y(H))
                    if (O.isClosing) {
                        var _ = "[/removed]",
                            J = O.position + _.length;
                        return z.push([w !== !1 ? w : O.position, J]), w = !1, _
                    } else {
                        if (!w) w = O.position;
                        return "[removed]"
                    }
                else return q(H, $, O)
            },
            remove: function(H) {
                var $ = "",
                    O = 0;
                return yG6.forEach(z, function(_) {
                    $ += H.slice(O, _[0]), O = _[1]
                }), $ += H.slice(O), $
            }
        }
    }

    function $bY(A) {
        var q = "",
            K = 0;
        while (K < A.length) {
            var Y = A.indexOf("<!--", K);
            if (Y === -1) {
                q += A.slice(K);
                break
            }
            q += A.slice(K, Y);
            var z = A.indexOf("-->", Y);
            if (z === -1) break;
            K = z + 3
        }
        return q
    }

    function ObY(A) {
        var q = A.split("");
        return q = q.filter(function(K) {
            var Y = K.charCodeAt(0);
            if (Y === 127) return !1;
            if (Y <= 31) {
                if (Y === 10 || Y === 13) return !0;
                return !1
            }
            return !0
        }), q.join("")
    }
    _bY.whiteList = Hr4();
    _bY.getDefaultWhiteList = Hr4;
    _bY.onTag = nxY;
    _bY.onIgnoreTag = rxY;
    _bY.onTagAttr = oxY;
    _bY.onIgnoreTagAttr = axY;
    _bY.safeAttrValue = sxY;
    _bY.escapeHtml = Or4;
    _bY.escapeQuote = _r4;
    _bY.unescapeQuote = Jr4;
    _bY.escapeHtmlEntities = Xr4;
    _bY.escapeDangerHtml5Entities = Dr4;
    _bY.clearNonPrintableCharacter = jr4;
    _bY.friendlyAttrValue = Mr4;
    _bY.escapeAttrValue = Pr4;
    _bY.onIgnoreTagStripAll = wbY;
    _bY.StripTagBody = HbY;
    _bY.stripCommentTag = $bY;
    _bY.stripBlankChar = ObY;
    _bY.attributeWrapSign = '"';
    _bY.cssFilter = $r4;
    _bY.getDefaultCSSWhiteList = ixY
})
// @from(Ln 367029, Col 4)
tyA = R((UbY) => {
    var It = LG6();

    function IbY(A) {
        var q = It.spaceIndex(A),
            K;
        if (q === -1) K = A.slice(1, -1);
        else K = A.slice(1, q + 1);
        if (K = It.trim(K).toLowerCase(), K.slice(0, 1) === "/") K = K.slice(1);
        if (K.slice(-1) === "/") K = K.slice(0, -1);
        return K
    }

    function xbY(A) {
        return A.slice(0, 2) === "</"
    }

    function bbY(A, q, K) {
        var Y = "",
            z = 0,
            w = !1,
            H = !1,
            $ = 0,
            O = A.length,
            _ = "",
            J = "";
        A: for ($ = 0; $ < O; $++) {
            var X = A.charAt($);
            if (w === !1) {
                if (X === "<") {
                    w = $;
                    continue
                }
            } else if (H === !1) {
                if (X === "<") {
                    Y += K(A.slice(z, $)), w = $, z = $;
                    continue
                }
                if (X === ">" || $ === O - 1) {
                    Y += K(A.slice(z, w)), J = A.slice(w, $ + 1), _ = IbY(J), Y += q(w, Y.length, _, J, xbY(J)), z = $ + 1, w = !1;
                    continue
                }
                if (X === '"' || X === "'") {
                    var D = 1,
                        j = A.charAt($ - D);
                    while (j.trim() === "" || j === "=") {
                        if (j === "=") {
                            H = X;
                            continue A
                        }
                        j = A.charAt($ - ++D)
                    }
                }
            } else if (X === H) {
                H = !1;
                continue
            }
        }
        if (z < O) Y += K(A.substr(z));
        return Y
    }
    var ubY = /[^a-zA-Z0-9\\_:.-]/gim;

    function BbY(A, q) {
        var K = 0,
            Y = 0,
            z = [],
            w = !1,
            H = A.length;

        function $(D, j) {
            if (D = It.trim(D), D = D.replace(ubY, "").toLowerCase(), D.length < 1) return;
            var M = q(D, j || "");
            if (M) z.push(M)
        }
        for (var O = 0; O < H; O++) {
            var _ = A.charAt(O),
                J, X;
            if (w === !1 && _ === "=") {
                w = A.slice(K, O), K = O + 1, Y = A.charAt(K) === '"' || A.charAt(K) === "'" ? K : FbY(A, O + 1);
                continue
            }
            if (w !== !1) {
                if (O === Y)
                    if (X = A.indexOf(_, O + 1), X === -1) break;
                    else {
                        J = It.trim(A.slice(Y + 1, X)), $(w, J), w = !1, O = X, K = O + 1;
                        continue
                    }
            }
            if (/\s|\n|\t/.test(_))
                if (A = A.replace(/\s|\n|\t/g, " "), w === !1)
                    if (X = mbY(A, O), X === -1) {
                        J = It.trim(A.slice(K, O)), $(J), w = !1, K = O + 1;
                        continue
                    } else {
                        O = X - 1;
                        continue
                    }
            else if (X = QbY(A, O - 1), X === -1) {
                J = It.trim(A.slice(K, O)), J = Wr4(J), $(w, J), w = !1, K = O + 1;
                continue
            } else continue
        }
        if (K < A.length)
            if (w === !1) $(A.slice(K));
            else $(w, Wr4(It.trim(A.slice(K))));
        return It.trim(z.join(" "))
    }

    function mbY(A, q) {
        for (; q < A.length; q++) {
            var K = A[q];
            if (K === " ") continue;
            if (K === "=") return q;
            return -1
        }
    }

    function FbY(A, q) {
        for (; q < A.length; q++) {
            var K = A[q];
            if (K === " ") continue;
            if (K === "'" || K === '"') return q;
            return -1
        }
    }

    function QbY(A, q) {
        for (; q > 0; q--) {
            var K = A[q];
            if (K === " ") continue;
            if (K === "=") return q;
            return -1
        }
    }

    function gbY(A) {
        if (A[0] === '"' && A[A.length - 1] === '"' || A[0] === "'" && A[A.length - 1] === "'") return !0;
        else return !1
    }

    function Wr4(A) {
        if (gbY(A)) return A.substr(1, A.length - 2);
        else return A
    }
    UbY.parseTag = bbY;
    UbY.parseAttr = BbY
})
// @from(Ln 367178, Col 4)
Vr4 = R((VVH, fr4) => {
    var cbY = kG6().FilterCSS,
        Ky = syA(),
        Gr4 = tyA(),
        lbY = Gr4.parseTag,
        ibY = Gr4.parseAttr,
        SG6 = LG6();

    function CG6(A) {
        return A === void 0 || A === null
    }

    function nbY(A) {
        var q = SG6.spaceIndex(A);
        if (q === -1) return {
            html: "",
            closing: A[A.length - 2] === "/"
        };
        A = SG6.trim(A.slice(q + 1, -1));
        var K = A[A.length - 1] === "/";
        if (K) A = SG6.trim(A.slice(0, -1));
        return {
            html: A,
            closing: K
        }
    }

    function rbY(A) {
        var q = {};
        for (var K in A) q[K] = A[K];
        return q
    }

    function obY(A) {
        var q = {};
        for (var K in A)
            if (Array.isArray(A[K])) q[K.toLowerCase()] = A[K].map(function(Y) {
                return Y.toLowerCase()
            });
            else q[K.toLowerCase()] = A[K];
        return q
    }

    function Zr4(A) {
        if (A = rbY(A || {}), A.stripIgnoreTag) {
            if (A.onIgnoreTag) console.error('Notes: cannot use these two options "stripIgnoreTag" and "onIgnoreTag" at the same time');
            A.onIgnoreTag = Ky.onIgnoreTagStripAll
        }
        if (A.whiteList || A.allowList) A.whiteList = obY(A.whiteList || A.allowList);
        else A.whiteList = Ky.whiteList;
        if (this.attributeWrapSign = A.singleQuotedAttributeValue === !0 ? "'" : Ky.attributeWrapSign, A.onTag = A.onTag || Ky.onTag, A.onTagAttr = A.onTagAttr || Ky.onTagAttr, A.onIgnoreTag = A.onIgnoreTag || Ky.onIgnoreTag, A.onIgnoreTagAttr = A.onIgnoreTagAttr || Ky.onIgnoreTagAttr, A.safeAttrValue = A.safeAttrValue || Ky.safeAttrValue, A.escapeHtml = A.escapeHtml || Ky.escapeHtml, this.options = A, A.css === !1) this.cssFilter = !1;
        else A.css = A.css || {}, this.cssFilter = new cbY(A.css)
    }
    Zr4.prototype.process = function(A) {
        if (A = A || "", A = A.toString(), !A) return "";
        var q = this,
            K = q.options,
            Y = K.whiteList,
            z = K.onTag,
            w = K.onIgnoreTag,
            H = K.onTagAttr,
            $ = K.onIgnoreTagAttr,
            O = K.safeAttrValue,
            _ = K.escapeHtml,
            J = q.attributeWrapSign,
            X = q.cssFilter;
        if (K.stripBlankChar) A = Ky.stripBlankChar(A);
        if (!K.allowCommentTag) A = Ky.stripCommentTag(A);
        var D = !1;
        if (K.stripIgnoreTagBody) D = Ky.StripTagBody(K.stripIgnoreTagBody, w), w = D.onIgnoreTag;
        var j = lbY(A, function(M, P, W, G, f) {
            var Z = {
                    sourcePosition: M,
                    position: P,
                    isClosing: f,
                    isWhite: Object.prototype.hasOwnProperty.call(Y, W)
                },
                N = z(W, G, Z);
            if (!CG6(N)) return N;
            if (Z.isWhite) {
                if (Z.isClosing) return "</" + W + ">";
                var T = nbY(G),
                    k = Y[W],
                    y = ibY(T.html, function(B, S) {
                        var m = SG6.indexOf(k, B) !== -1,
                            b = H(W, B, S, m);
                        if (!CG6(b)) return b;
                        if (m)
                            if (S = O(W, B, S, X), S) return B + "=" + J + S + J;
                            else return B;
                        else {
                            if (b = $(W, B, S, m), !CG6(b)) return b;
                            return
                        }
                    });
                if (G = "<" + W, y) G += " " + y;
                if (T.closing) G += " /";
                return G += ">", G
            } else {
                if (N = w(W, G, Z), !CG6(N)) return N;
                return _(G)
            }
        }, _);
        if (D) j = D.remove(j);
        return j
    };
    fr4.exports = Zr4
})
// @from(Ln 367286, Col 4)
kr4 = R(($G1, hG6) => {
    var Nr4 = syA(),
        Tr4 = tyA(),
        vr4 = Vr4();

    function Er4(A, q) {
        var K = new vr4(q);
        return K.process(A)
    }
    $G1 = hG6.exports = Er4;
    $G1.filterXSS = Er4;
    $G1.FilterXSS = vr4;
    (function() {
        for (var A in Nr4) $G1[A] = Nr4[A];
        for (var q in Tr4) $G1[q] = Tr4[q]
    })();
    if (typeof window < "u") window.filterXSS = hG6.exports;

    function abY() {
        return typeof self < "u" && typeof DedicatedWorkerGlobalScope < "u" && self instanceof DedicatedWorkerGlobalScope
    }
    if (abY()) self.filterXSS = hG6.exports
})
// @from(Ln 367320, Col 0)
function Lr4(A) {
    try {
        let q = new URL(A);
        for (let K of quY)
            if (q.searchParams.has(K)) q.searchParams.set(K, "[REDACTED]");
        return q.toString()
    } catch {
        return A
    }
}
// @from(Ln 367331, Col 0)
function KuY() {
    return async (A, q) => {
        let K = AbortSignal.timeout(AuY);
        if (!q?.signal) return fetch(A, {
            ...q,
            signal: K
        });
        let Y = new AbortController,
            z = () => Y.abort();
        q.signal.addEventListener("abort", z), K.addEventListener("abort", z);
        let w = () => {
            q.signal?.removeEventListener("abort", z), K.removeEventListener("abort", z)
        };
        if (q.signal.aborted) Y.abort();
        try {
            let H = await fetch(A, {
                ...q,
                signal: Y.signal
            });
            return w(), H
        } catch (H) {
            throw w(), H
        }
    }
}
// @from(Ln 367357, Col 0)
function yr4(A = qCA) {
    return `http://localhost:${A}/callback`
}
// @from(Ln 367361, Col 0)
function zuY() {
    let A = parseInt(process.env.MCP_OAUTH_CALLBACK_PORT || "", 10);
    return A > 0 ? A : void 0
}
// @from(Ln 367365, Col 0)
async function wuY() {
    let A = zuY();
    if (A) return A;
    let {
        min: q,
        max: K
    } = YuY, Y = K - q + 1, z = Math.min(Y, 100);
    for (let w = 0; w < z; w++) {
        let H = q + Math.floor(Math.random() * Y);
        try {
            return await new Promise(($, O) => {
                let _ = eyA();
                _.once("error", O), _.listen(H, () => {
                    _.close(() => $())
                })
            }), H
        } catch {
            continue
        }
    }
    try {
        return await new Promise((w, H) => {
            let $ = eyA();
            $.once("error", H), $.listen(qCA, () => {
                $.close(() => w())
            })
        }), qCA
    } catch {
        throw Error("No available ports for OAuth redirect")
    }
}
// @from(Ln 367397, Col 0)
function LI(A, q) {
    let K = Q1({
            type: q.type,
            url: q.url,
            headers: q.headers || {}
        }),
        Y = tbY("sha256").update(K).digest("hex").substring(0, 16);
    return `${A}|${Y}`
}
// @from(Ln 367406, Col 0)
async function Rr4({
    serverName: A,
    endpoint: q,
    token: K,
    tokenTypeHint: Y,
    clientId: z,
    accessToken: w
}) {
    let H = new URLSearchParams;
    if (H.set("token", K), H.set("token_type_hint", Y), z) H.set("client_id", z);
    else SA(A, `No client_id available for ${Y} revocation - server may reject`);
    let $ = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    try {
        await sA.post(q, H, {
            headers: $
        }), SA(A, `Successfully revoked ${Y}`)
    } catch (O) {
        if (sA.isAxiosError(O) && O.response?.status === 401 && w) SA(A, `Got 401, retrying ${Y} revocation with Bearer auth`), await sA.post(q, H, {
            headers: {
                ...$,
                Authorization: `Bearer ${w}`
            }
        }), SA(A, `Successfully revoked ${Y} with Bearer auth`);
        else throw O
    }
}
// @from(Ln 367434, Col 0)
async function YCA(A, q) {
    let Y = T0().read();
    if (!Y?.mcpOAuth) return;
    let z = LI(A, q),
        w = Y.mcpOAuth[z];
    if (!w?.accessToken && !w?.refreshToken) {
        SA(A, "No tokens to revoke");
        return
    }
    try {
        let H = await Bb1(q.url);
        if (!H) {
            SA(A, "No OAuth metadata found");
            return
        }
        let $ = "revocation_endpoint" in H ? H.revocation_endpoint : null;
        if (!$) {
            SA(A, "Server does not support token revocation");
            return
        }
        let O = String($);
        if (SA(A, `Revoking tokens via ${O}`), w.refreshToken) try {
            await Rr4({
                serverName: A,
                endpoint: O,
                token: w.refreshToken,
                tokenTypeHint: "refresh_token",
                clientId: w.clientId,
                accessToken: w.accessToken
            })
        } catch (_) {
            SA(A, `Failed to revoke refresh token: ${_ instanceof Error?_.message:String(_)}`)
        }
        if (w.accessToken) try {
            await Rr4({
                serverName: A,
                endpoint: $,
                token: w.accessToken,
                tokenTypeHint: "access_token",
                clientId: w.clientId,
                accessToken: w.accessToken
            })
        } catch (_) {
            SA(A, `Failed to revoke access token: ${_ instanceof Error?_.message:String(_)}`)
        }
    } catch (H) {
        SA(A, `Failed to revoke tokens: ${H instanceof Error?H.message:String(H)}`)
    }
    IG6(A, q)
}
// @from(Ln 367485, Col 0)
function IG6(A, q) {
    let K = T0(),
        Y = K.read();
    if (!Y?.mcpOAuth) return;
    let z = LI(A, q);
    if (Y.mcpOAuth[z]) delete Y.mcpOAuth[z], K.update(Y), SA(A, "Cleared stored tokens")
}
// @from(Ln 367492, Col 0)
async function xG6(A, q, K, Y) {
    IG6(A, q), c("tengu_mcp_oauth_flow_start", {
        isOAuthFlow: !0,
        transportType: q.type,
        ...U_(q) ? {
            mcpServerBaseUrl: U_(q)
        } : {}
    });
    let z = q.oauth?.callbackPort,
        w = z ?? await wuY(),
        H = yr4(w);
    SA(A, `Using redirect port: ${w}${z?" (from config)":""}`);
    let $ = new Q51(A, q, H, !0, K);
    try {
        let j = await Bb1(q.url);
        if (j) $.setMetadata(j), SA(A, `Fetched OAuth metadata with scope: ${KCA(j)||"NONE"}`)
    } catch (j) {
        SA(A, `Failed to fetch OAuth metadata: ${j instanceof Error?j.message:String(j)}`)
    }
    let O = await $.state(),
        _ = null,
        J = null,
        X = () => {
            if (_) _.close(), _ = null;
            if (J) clearTimeout(J), J = null;
            SA(A, "MCP OAuth server cleaned up")
        },
        D = await new Promise((j, M) => {
            if (Y) {
                let P = () => {
                    X(), M(new OG1)
                };
                if (Y.aborted) {
                    P();
                    return
                }
                Y.addEventListener("abort", P)
            }
            _ = eyA((P, W) => {
                let G = sbY(P.url || "", !0);
                if (G.pathname === "/callback") {
                    let f = G.query.code,
                        Z = G.query.state,
                        N = G.query.error,
                        T = G.query.error_description,
                        k = G.query.error_uri;
                    if (!N && Z !== O) {
                        W.writeHead(400, {
                            "Content-Type": "text/html"
                        }), W.end("<h1>Authentication Error</h1><p>Invalid state parameter. Please try again.</p><p>You can close this window.</p>"), X(), M(Error("OAuth state mismatch - possible CSRF attack"));
                        return
                    }
                    if (N) {
                        W.writeHead(200, {
                            "Content-Type": "text/html"
                        });
                        let y = ACA.default(String(N)),
                            B = T ? ACA.default(String(T)) : "";
                        W.end(`<h1>Authentication Error</h1><p>${y}: ${B}</p><p>You can close this window.</p>`), X();
                        let S = `OAuth error: ${N}`;
                        if (T) S += ` - ${T}`;
                        if (k) S += ` (See: ${k})`;
                        M(Error(S));
                        return
                    }
                    if (f) W.writeHead(200, {
                        "Content-Type": "text/html"
                    }), W.end("<h1>Authentication Successful</h1><p>You can close this window. Return to Claude Code.</p>"), X(), j(f)
                }
            }), _.listen(w, async () => {
                try {
                    SA(A, "Starting SDK auth"), SA(A, `Server URL: ${q.url}`);
                    let P = await AR($, {
                        serverUrl: q.url
                    });
                    if (SA(A, `Initial auth result: ${P}`), P !== "REDIRECT") SA(A, `Unexpected auth result, expected REDIRECT: ${P}`)
                } catch (P) {
                    SA(A, `SDK auth error: ${P}`), X(), M(P)
                }
            }), J = setTimeout(() => {
                X(), M(Error("Authentication timeout"))
            }, 300000)
        });
    try {
        SA(A, "Completing auth flow with authorization code");
        let j = await AR($, {
            serverUrl: q.url,
            authorizationCode: D
        });
        if (SA(A, `Auth result: ${j}`), j === "AUTHORIZED") {
            let M = await $.tokens();
            if (SA(A, `Tokens after auth: ${M?"Present":"Missing"}`), M) SA(A, `Token access_token length: ${M.access_token?.length}`), SA(A, `Token expires_in: ${M.expires_in}`);
            c("tengu_mcp_oauth_flow_success", {
                transportType: q.type,
                ...U_(q) ? {
                    mcpServerBaseUrl: U_(q)
                } : {}
            })
        } else throw Error("Unexpected auth result: " + j)
    } catch (j) {
        if (SA(A, `Error during auth completion: ${j}`), sA.isAxiosError(j)) try {
            let M = A$6.parse(j.response?.data);
            if (M.error === "invalid_client" && M.error_description?.includes("Client not found")) {
                let P = T0(),
                    W = P.read() || {},
                    G = LI(A, q);
                if (W.mcpOAuth?.[G]) delete W.mcpOAuth[G].clientId, delete W.mcpOAuth[G].clientSecret, P.update(W)
            }
        } catch {}
        throw c("tengu_mcp_oauth_flow_error", {
            transportType: q.type,
            ...U_(q) ? {
                mcpServerBaseUrl: U_(q)
            } : {}
        }), j
    }
}
// @from(Ln 367609, Col 0)
class Q51 {
    serverName;
    serverConfig;
    redirectUri;
    handleRedirection;
    _codeVerifier;
    _authorizationUrl;
    _state;
    _scopes;
    _metadata;
    _refreshInProgress;
    onAuthorizationUrlCallback;
    constructor(A, q, K = yr4(), Y = !1, z) {
        this.serverName = A, this.serverConfig = q, this.redirectUri = K, this.handleRedirection = Y, this.onAuthorizationUrlCallback = z
    }
    get redirectUrl() {
        return this.redirectUri
    }
    get authorizationUrl() {
        return this._authorizationUrl
    }
    get clientMetadata() {
        let A = {
                client_name: `Claude Code (${this.serverName})`,
                redirect_uris: [this.redirectUri],
                grant_types: ["authorization_code", "refresh_token"],
                response_types: ["code"],
                token_endpoint_auth_method: "none"
            },
            q = KCA(this._metadata);
        if (q) A.scope = q, SA(this.serverName, `Using scope from metadata: ${A.scope}`);
        return A
    }
    setMetadata(A) {
        this._metadata = A
    }
    async state() {
        if (!this._state) this._state = ebY(32).toString("base64url"), SA(this.serverName, "Generated new OAuth state");
        return this._state
    }
    async clientInformation() {
        let q = T0().read(),
            K = LI(this.serverName, this.serverConfig),
            Y = q?.mcpOAuth?.[K];
        if (Y?.clientId) return SA(this.serverName, "Found client info"), {
            client_id: Y.clientId,
            client_secret: Y.clientSecret
        };
        let z = this.serverConfig.oauth?.clientId;
        if (z) {
            let w = q?.mcpOAuthClientConfig?.[K];
            return SA(this.serverName, "Using pre-configured client ID"), {
                client_id: z,
                client_secret: w?.clientSecret
            }
        }
        SA(this.serverName, "No client info found");
        return
    }
    async saveClientInformation(A) {
        let q = T0(),
            K = q.read() || {},
            Y = LI(this.serverName, this.serverConfig),
            z = {
                ...K,
                mcpOAuth: {
                    ...K.mcpOAuth,
                    [Y]: {
                        ...K.mcpOAuth?.[Y],
                        serverName: this.serverName,
                        serverUrl: this.serverConfig.url,
                        clientId: A.client_id,
                        clientSecret: A.client_secret,
                        accessToken: K.mcpOAuth?.[Y]?.accessToken || "",
                        expiresAt: K.mcpOAuth?.[Y]?.expiresAt || 0
                    }
                }
            };
        q.update(z)
    }
    async tokens() {
        let q = T0().read(),
            K = LI(this.serverName, this.serverConfig),
            Y = q?.mcpOAuth?.[K];
        if (!Y) {
            SA(this.serverName, "No token data found");
            return
        }
        let z = (Y.expiresAt - Date.now()) / 1000;
        if (z <= 0 && !Y.refreshToken) {
            SA(this.serverName, "Token expired without refresh token");
            return
        }
        if (z <= 300 && Y.refreshToken) {
            if (!this._refreshInProgress) SA(this.serverName, `Token expires in ${Math.floor(z)}s, attempting proactive refresh`), this._refreshInProgress = this.refreshAuthorization(Y.refreshToken).finally(() => {
                this._refreshInProgress = void 0
            });
            else SA(this.serverName, "Token refresh already in progress, reusing existing promise");
            try {
                let H = await this._refreshInProgress;
                if (H) return SA(this.serverName, "Token refreshed successfully"), H;
                SA(this.serverName, "Token refresh failed, returning current tokens")
            } catch (H) {
                SA(this.serverName, `Token refresh error: ${H instanceof Error?H.message:String(H)}`)
            }
        }
        let w = {
            access_token: Y.accessToken,
            refresh_token: Y.refreshToken,
            expires_in: z,
            scope: Y.scope,
            token_type: "Bearer"
        };
        return SA(this.serverName, "Returning tokens"), SA(this.serverName, `Token length: ${w.access_token?.length}`), SA(this.serverName, `Has refresh token: ${!!w.refresh_token}`), SA(this.serverName, `Expires in: ${Math.floor(z)}s`), w
    }
    async saveTokens(A) {
        let q = T0(),
            K = q.read() || {},
            Y = LI(this.serverName, this.serverConfig);
        SA(this.serverName, "Saving tokens"), SA(this.serverName, `Token expires in: ${A.expires_in}`), SA(this.serverName, `Has refresh token: ${!!A.refresh_token}`);
        let z = {
            ...K,
            mcpOAuth: {
                ...K.mcpOAuth,
                [Y]: {
                    ...K.mcpOAuth?.[Y],
                    serverName: this.serverName,
                    serverUrl: this.serverConfig.url,
                    accessToken: A.access_token,
                    refreshToken: A.refresh_token,
                    expiresAt: Date.now() + (A.expires_in || 3600) * 1000,
                    scope: A.scope
                }
            }
        };
        q.update(z)
    }
    async redirectToAuthorization(A) {
        this._authorizationUrl = A.toString();
        let q = A.searchParams.get("scope");
        if (SA(this.serverName, `Authorization URL: ${Lr4(A.toString())}`), SA(this.serverName, `Scopes in URL: ${q||"NOT FOUND"}`), q) this._scopes = q, SA(this.serverName, `Captured scopes from authorization URL: ${q}`);
        else {
            let w = KCA(this._metadata);
            if (w) this._scopes = w, SA(this.serverName, `Using scopes from metadata: ${w}`);
            else SA(this.serverName, "No scopes available from URL or metadata")
        }
        if (!this.handleRedirection) {
            SA(this.serverName, "Redirection handling is disabled, skipping redirect");
            return
        }
        let K = A.toString();
        if (!K.startsWith("http://") && !K.startsWith("https://")) throw Error("Invalid authorization URL: must use http:// or https:// scheme");
        SA(this.serverName, "Redirecting to authorization URL");
        let Y = Lr4(K);
        if (SA(this.serverName, `Authorization URL: ${Y}`), this.onAuthorizationUrlCallback) this.onAuthorizationUrlCallback(K);
        if (SA(this.serverName, `Opening authorization URL: ${Y}`), !await zY(K)) SA(this.serverName, "Browser didn't open automatically. URL is shown in UI.")
    }
    async saveCodeVerifier(A) {
        SA(this.serverName, "Saving code verifier"), this._codeVerifier = A
    }
    async codeVerifier() {
        if (!this._codeVerifier) throw SA(this.serverName, "No code verifier saved"), Error("No code verifier saved");
        return SA(this.serverName, "Returning code verifier"), this._codeVerifier
    }
    async invalidateCredentials(A) {
        let q = T0(),
            K = q.read();
        if (!K?.mcpOAuth) return;
        let Y = LI(this.serverName, this.serverConfig),
            z = K.mcpOAuth[Y];
        if (!z) return;
        switch (A) {
            case "all":
                delete K.mcpOAuth[Y];
                break;
            case "client":
                z.clientId = void 0, z.clientSecret = void 0;
                break;
            case "tokens":
                z.accessToken = "", z.refreshToken = void 0, z.expiresAt = 0;
                break;
            case "verifier":
                this._codeVerifier = void 0;
                return
        }
        q.update(K), SA(this.serverName, `Invalidated credentials (scope: ${A})`)
    }
    async refreshAuthorization(A) {
        for (let K = 1; K <= 3; K++) try {
            SA(this.serverName, "Starting token refresh");
            let Y = KuY(),
                z = await Bb1(new URL(this.serverConfig.url), {
                    fetchFn: Y
                });
            if (!z) {
                SA(this.serverName, "Failed to discover OAuth metadata");
                return
            }
            let w = await this.clientInformation();
            if (!w) {
                SA(this.serverName, "No client information available");
                return
            }
            let H = await eJA(new URL(this.serverConfig.url), {
                metadata: z,
                clientInformation: w,
                refreshToken: A,
                resource: new URL(this.serverConfig.url),
                fetchFn: Y
            });
            if (H) return SA(this.serverName, "Token refresh successful"), await this.saveTokens(H), H;
            SA(this.serverName, "Token refresh returned no tokens");
            return
        } catch (Y) {
            if (Y instanceof Ha) {
                SA(this.serverName, `Token refresh failed with invalid_grant: ${Y.message}. Clearing stored tokens.`), await this.invalidateCredentials("tokens");
                return
            }
            let z = Y instanceof Error && /timeout|timed out|etimedout|econnreset/i.test(Y.message),
                w = Y instanceof TB || Y instanceof u01 || Y instanceof B01;
            if (!(z || w) || K >= 3) {
                SA(this.serverName, `Token refresh failed: ${Y instanceof Error?Y.message:String(Y)}`);
                return
            }
            let $ = 1000 * Math.pow(2, K - 1);
            SA(this.serverName, `Token refresh failed, retrying in ${$}ms (attempt ${K}/3)`), await new Promise((O) => setTimeout(O, $))
        }
        return
    }
}
// @from(Ln 367839, Col 0)
async function rg1() {
    let A = process.env.MCP_CLIENT_SECRET;
    if (A) return A;
    if (!process.stdin.isTTY) throw Error("No TTY available to prompt for client secret. Set MCP_CLIENT_SECRET env var instead.");
    return new Promise((q, K) => {
        process.stderr.write("Enter OAuth client secret: "), process.stdin.setRawMode?.(!0);
        let Y = "",
            z = (w) => {
                let H = w.toString();
                if (H === `
` || H === "\r") process.stdin.setRawMode?.(!1), process.stdin.removeListener("data", z), process.stderr.write(`
`), q(Y);
                else if (H === "\x03") process.stdin.setRawMode?.(!1), process.stdin.removeListener("data", z), K(Error("Cancelled"));
                else if (H === "" || H === "\b") Y = Y.slice(0, -1);
                else Y += H
            };
        process.stdin.on("data", z)
    })
}
// @from(Ln 367859, Col 0)
function og1(A, q, K) {
    let Y = T0(),
        z = Y.read() || {},
        w = LI(A, q);
    Y.update({
        ...z,
        mcpOAuthClientConfig: {
            ...z.mcpOAuthClientConfig,
            [w]: {
                clientSecret: K
            }
        }
    })
}
// @from(Ln 367874, Col 0)
function Cr4(A, q) {
    let K = T0(),
        Y = K.read();
    if (!Y?.mcpOAuthClientConfig) return;
    let z = LI(A, q);
    if (Y.mcpOAuthClientConfig[z]) delete Y.mcpOAuthClientConfig[z], K.update(Y)
}
// @from(Ln 367882, Col 0)
function zCA(A, q) {
    let Y = T0().read(),
        z = LI(A, q);
    return Y?.mcpOAuthClientConfig?.[z]
}
// @from(Ln 367888, Col 0)
function KCA(A) {
    if (!A) return;
    if ("scope" in A && typeof A.scope === "string") return A.scope;
    if ("default_scope" in A && typeof A.default_scope === "string") return A.default_scope;
    if (A.scopes_supported && Array.isArray(A.scopes_supported)) return A.scopes_supported.join(" ");
    return
}
// @from(Ln 367895, Col 4)
ACA
// @from(Ln 367895, Col 9)
AuY = 30000
// @from(Ln 367896, Col 4)
quY
// @from(Ln 367896, Col 9)
OG1
// @from(Ln 367896, Col 14)
YuY
// @from(Ln 367896, Col 19)
qCA = 3118
// @from(Ln 367897, Col 4)
g51 = v(() => {
    ns1();
    u6();
    q$6();
    mb1();
    nJA();
    Oj();
    y5();
    y6();
    tX();
    x3();
    m6();
    ACA = o(kr4(), 1), quY = ["state", "nonce", "code_challenge", "code_verifier", "code"];
    OG1 = class OG1 extends Error {
        constructor() {
            super("Authentication was cancelled");
            this.name = "AuthenticationCancelledError"
        }
    };
    YuY = eA() === "windows" ? {
        min: 39152,
        max: 49151
    } : {
        min: 49152,
        max: 65535
    }
})
// @from(Ln 367925, Col 0)
function HuY(A) {
    return A.scope === "project" || A.scope === "local"
}
// @from(Ln 367928, Col 0)
async function $uY(A, q) {
    if (!q.headersHelper) return null;
    if ("scope" in q && HuY(q) && !w4()) {
        if (!$H(!0)) {
            let Y = Error(`Security: headersHelper for MCP server '${A}' executed before workspace trust is confirmed. If you see this message, post in ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.38",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-02-10T00:04:56Z"}.FEEDBACK_CHANNEL}.`);
            return Yk("MCP headersHelper invoked before trust check", Y), c("tengu_mcp_headersHelper_missing_trust", {}), null
        }
    }
    try {
        SA(A, "Executing headersHelper to get dynamic headers");
        let K = await d4(q.headersHelper, [], {
            shell: !0,
            timeout: 1e4
        });
        if (K.code !== 0 || !K.stdout) throw Error(`headersHelper for MCP server '${A}' did not return a valid value`);
        let Y = K.stdout.trim(),
            z = _A(Y);
        if (typeof z !== "object" || z === null || Array.isArray(z)) throw Error(`headersHelper for MCP server '${A}' must return a JSON object with string key-value pairs`);
        for (let [w, H] of Object.entries(z))
            if (typeof H !== "string") throw Error(`headersHelper for MCP server '${A}' returned non-string value for key "${w}": ${typeof H}`);
        return SA(A, `Successfully retrieved ${Object.keys(z).length} headers from headersHelper`), z
    } catch (K) {
        return Kz(A, `Error getting headers from headersHelper: ${K instanceof Error?K.message:String(K)}`), K1(Error(`Error getting MCP headers from headersHelper for server '${A}': ${K instanceof Error?K.message:String(K)}`)), null
    }
}
// @from(Ln 367953, Col 0)
async function bG6(A, q) {
    let K = q.headers || {},
        Y = await $uY(A, q) || {};
    return {
        ...K,
        ...Y
    }
}
// @from(Ln 367961, Col 4)
Sr4 = v(() => {
    tq();
    cA();
    y6();
    Z6();
    u6();
    B6();
    m6()
})
// @from(Ln 367970, Col 0)
class wCA {
    serverName;
    sendMcpMessage;
    isClosed = !1;
    onclose;
    onerror;
    onmessage;
    constructor(A, q) {
        this.serverName = A;
        this.sendMcpMessage = q
    }
    async start() {}
    async send(A) {
        if (this.isClosed) throw Error("Transport is closed");
        let q = await this.sendMcpMessage(this.serverName, A);
        if (this.onmessage) this.onmessage(q)
    }
    async close() {
        if (this.isClosed) return;
        this.isClosed = !0, this.onclose?.()
    }
}
// @from(Ln 367993, Col 0)
function _uY(A, q, K) {
    let Y = A.tabId;
    if (typeof Y === "number") Nn4(Y);
    let z = [];
    switch (q) {
        case "navigate":
            if (typeof A.url === "string") try {
                let w = new URL(A.url);
                z.push(w.hostname)
            } catch {
                z.push(K3(A.url, 30))
            }
            break;
        case "find":
            if (typeof A.query === "string") z.push(`pattern: ${K3(A.query,30)}`);
            break;
        case "computer":
            if (typeof A.action === "string") {
                let w = A.action;
                if (w === "left_click" || w === "right_click" || w === "double_click" || w === "middle_click")
                    if (typeof A.ref === "string") z.push(`${w} on ${A.ref}`);
                    else if (Array.isArray(A.coordinate)) z.push(`${w} at (${A.coordinate.join(", ")})`);
                else z.push(w);
                else if (w === "type" && typeof A.text === "string") z.push(`type "${K3(A.text,15)}"`);
                else if (w === "key" && typeof A.text === "string") z.push(`key ${A.text}`);
                else if (w === "scroll" && typeof A.scroll_direction === "string") z.push(`scroll ${A.scroll_direction}`);
                else if (w === "wait" && typeof A.duration === "number") z.push(`wait ${A.duration}s`);
                else if (w === "left_click_drag") z.push("drag");
                else z.push(w)
            }
            break;
        case "gif_creator":
            if (typeof A.action === "string") z.push(`${A.action}`);
            break;
        case "resize_window":
            if (typeof A.width === "number" && typeof A.height === "number") z.push(`${A.width}x${A.height}`);
            break;
        case "read_console_messages":
            if (typeof A.pattern === "string") z.push(`pattern: ${K3(A.pattern,20)}`);
            if (A.onlyErrors === !0) z.push("errors only");
            break;
        case "read_network_requests":
            if (typeof A.urlPattern === "string") z.push(`pattern: ${K3(A.urlPattern,20)}`);
            break;
        case "shortcuts_execute":
            if (typeof A.shortcutId === "string") z.push(`shortcut_id: ${A.shortcutId}`);
            break;
        case "javascript_tool":
            if (K && typeof A.text === "string") return A.text;
            return "";
        case "tabs_create_mcp":
        case "tabs_context_mcp":
        case "form_input":
        case "shortcuts_list":
        case "read_page":
        case "upload_image":
        case "get_page_text":
        case "update_plan":
            return ""
    }
    return z.join(", ") || null
}
// @from(Ln 368056, Col 0)
function JuY(A) {
    if (!Vv()) return null;
    if (typeof A !== "object" || A === null || !("tabId" in A)) return null;
    let q = typeof A.tabId === "number" ? A.tabId : typeof A.tabId === "string" ? parseInt(A.tabId, 10) : NaN;
    if (isNaN(q)) return null;
    let K = `${OuY}${q}`;
    return RI.createElement(V, null, " ", RI.createElement(d7, {
        url: K
    }, RI.createElement(V, {
        color: "subtle"
    }, "[View Tab]")))
}
// @from(Ln 368069, Col 0)
function XuY(A, q, K) {
    if (K) return NG6(A, [], {
        verbose: K
    });
    let Y = null;
    switch (q) {
        case "navigate":
            Y = "Navigation completed";
            break;
        case "tabs_create_mcp":
            Y = "Tab created";
            break;
        case "tabs_context_mcp":
            Y = "Tabs read";
            break;
        case "form_input":
            Y = "Input completed";
            break;
        case "computer":
            Y = "Action completed";
            break;
        case "resize_window":
            Y = "Window resized";
            break;
        case "find":
            Y = "Search completed";
            break;
        case "gif_creator":
            Y = "GIF action completed";
            break;
        case "read_console_messages":
            Y = "Console messages retrieved";
            break;
        case "read_network_requests":
            Y = "Network requests retrieved";
            break;
        case "shortcuts_list":
            Y = "Shortcuts retrieved";
            break;
        case "shortcuts_execute":
            Y = "Shortcut executed";
            break;
        case "javascript_tool":
            Y = "Script executed";
            break;
        case "read_page":
            Y = "Page read";
            break;
        case "upload_image":
            Y = "Image uploaded";
            break;
        case "get_page_text":
            Y = "Page text retrieved";
            break;
        case "update_plan":
            Y = "Plan updated";
            break
    }
    if (Y) return RI.createElement(HA, {
        height: 1
    }, RI.createElement(V, {
        dimColor: !0
    }, Y));
    return null
}
// @from(Ln 368135, Col 0)
function hr4(A) {
    return {
        userFacingName(q) {
            return `Claude in Chrome[${A.replace(/_mcp$/,"")}]`
        },
        renderToolUseMessage(q, {
            verbose: K
        }) {
            return _uY(q, A, K)
        },
        renderToolUseTag(q) {
            return JuY(q)
        },
        renderToolResultMessage(q, K, {
            verbose: Y
        }) {
            if (!DuY(q)) return null;
            return XuY(q, A, Y)
        }
    }
}
// @from(Ln 368157, Col 0)
function DuY(A) {
    return typeof A === "object" && A !== null
}
// @from(Ln 368160, Col 4)
RI
// @from(Ln 368160, Col 8)
OuY = "https://clau.de/chrome/tab/"
// @from(Ln 368161, Col 4)
Ir4 = v(() => {
    m1();
    eq();
    xo();
    vq();
    nyA();
    kI();
    RI = o(X1(), 1)
})
// @from(Ln 368170, Col 4)
sd = R((tVH, ur4) => {
    var xr4 = ["nodebuffer", "arraybuffer", "fragments"],
        br4 = typeof Blob < "u";
    if (br4) xr4.push("blob");
    ur4.exports = {
        BINARY_TYPES: xr4,
        EMPTY_BUFFER: Buffer.alloc(0),
        GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
        hasBlob: br4,
        kForOnEventAttribute: Symbol("kIsForOnEventAttribute"),
        kListener: Symbol("kListener"),
        kStatusCode: Symbol("status-code"),
        kWebSocket: Symbol("websocket"),
        NOOP: () => {}
    }
})
// @from(Ln 368186, Col 4)
ag1 = R((eVH, uG6) => {
    var {
        EMPTY_BUFFER: juY
    } = sd(), HCA = Buffer[Symbol.species];

    function MuY(A, q) {
        if (A.length === 0) return juY;
        if (A.length === 1) return A[0];
        let K = Buffer.allocUnsafe(q),
            Y = 0;
        for (let z = 0; z < A.length; z++) {
            let w = A[z];
            K.set(w, Y), Y += w.length
        }
        if (Y < q) return new HCA(K.buffer, K.byteOffset, Y);
        return K
    }

    function Br4(A, q, K, Y, z) {
        for (let w = 0; w < z; w++) K[Y + w] = A[w] ^ q[w & 3]
    }

    function mr4(A, q) {
        for (let K = 0; K < A.length; K++) A[K] ^= q[K & 3]
    }

    function PuY(A) {
        if (A.length === A.buffer.byteLength) return A.buffer;
        return A.buffer.slice(A.byteOffset, A.byteOffset + A.length)
    }

    function $CA(A) {
        if ($CA.readOnly = !0, Buffer.isBuffer(A)) return A;
        let q;
        if (A instanceof ArrayBuffer) q = new HCA(A);
        else if (ArrayBuffer.isView(A)) q = new HCA(A.buffer, A.byteOffset, A.byteLength);
        else q = Buffer.from(A), $CA.readOnly = !1;
        return q
    }
    uG6.exports = {
        concat: MuY,
        mask: Br4,
        toArrayBuffer: PuY,
        toBuffer: $CA,
        unmask: mr4
    };
    if (!process.env.WS_NO_BUFFER_UTIL) try {
        let A = (() => {
            throw new Error("Cannot require module " + "bufferutil");
        })();
        uG6.exports.mask = function(q, K, Y, z, w) {
            if (w < 48) Br4(q, K, Y, z, w);
            else A.mask(q, K, Y, z, w)
        }, uG6.exports.unmask = function(q, K) {
            if (q.length < 32) mr4(q, K);
            else A.unmask(q, K)
        }
    } catch (A) {}
})
// @from(Ln 368245, Col 4)
Ur4 = R((ANH, gr4) => {
    var Fr4 = Symbol("kDone"),
        OCA = Symbol("kRun");
    class Qr4 {
        constructor(A) {
            this[Fr4] = () => {
                this.pending--, this[OCA]()
            }, this.concurrency = A || 1 / 0, this.jobs = [], this.pending = 0
        }
        add(A) {
            this.jobs.push(A), this[OCA]()
        } [OCA]() {
            if (this.pending === this.concurrency) return;
            if (this.jobs.length) {
                let A = this.jobs.shift();
                this.pending++, A(this[Fr4])
            }
        }
    }
    gr4.exports = Qr4
})
// @from(Ln 368266, Col 4)
tg1 = R((qNH, ir4) => {
    var sg1 = h1("zlib"),
        pr4 = ag1(),
        WuY = Ur4(),
        {
            kStatusCode: dr4
        } = sd(),
        GuY = Buffer[Symbol.species],
        ZuY = Buffer.from([0, 0, 255, 255]),
        mG6 = Symbol("permessage-deflate"),
        td = Symbol("total-length"),
        _G1 = Symbol("callback"),
        xt = Symbol("buffers"),
        JG1 = Symbol("error"),
        BG6;
    class cr4 {
        constructor(A, q, K) {
            if (this._maxPayload = K | 0, this._options = A || {}, this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024, this._isServer = !!q, this._deflate = null, this._inflate = null, this.params = null, !BG6) {
                let Y = this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10;
                BG6 = new WuY(Y)
            }
        }
        static get extensionName() {
            return "permessage-deflate"
        }
        offer() {
            let A = {};
            if (this._options.serverNoContextTakeover) A.server_no_context_takeover = !0;
            if (this._options.clientNoContextTakeover) A.client_no_context_takeover = !0;
            if (this._options.serverMaxWindowBits) A.server_max_window_bits = this._options.serverMaxWindowBits;
            if (this._options.clientMaxWindowBits) A.client_max_window_bits = this._options.clientMaxWindowBits;
            else if (this._options.clientMaxWindowBits == null) A.client_max_window_bits = !0;
            return A
        }
        accept(A) {
            return A = this.normalizeParams(A), this.params = this._isServer ? this.acceptAsServer(A) : this.acceptAsClient(A), this.params
        }
        cleanup() {
            if (this._inflate) this._inflate.close(), this._inflate = null;
            if (this._deflate) {
                let A = this._deflate[_G1];
                if (this._deflate.close(), this._deflate = null, A) A(Error("The deflate stream was closed while data was being processed"))
            }
        }
        acceptAsServer(A) {
            let q = this._options,
                K = A.find((Y) => {
                    if (q.serverNoContextTakeover === !1 && Y.server_no_context_takeover || Y.server_max_window_bits && (q.serverMaxWindowBits === !1 || typeof q.serverMaxWindowBits === "number" && q.serverMaxWindowBits > Y.server_max_window_bits) || typeof q.clientMaxWindowBits === "number" && !Y.client_max_window_bits) return !1;
                    return !0
                });
            if (!K) throw Error("None of the extension offers can be accepted");
            if (q.serverNoContextTakeover) K.server_no_context_takeover = !0;
            if (q.clientNoContextTakeover) K.client_no_context_takeover = !0;
            if (typeof q.serverMaxWindowBits === "number") K.server_max_window_bits = q.serverMaxWindowBits;
            if (typeof q.clientMaxWindowBits === "number") K.client_max_window_bits = q.clientMaxWindowBits;
            else if (K.client_max_window_bits === !0 || q.clientMaxWindowBits === !1) delete K.client_max_window_bits;
            return K
        }
        acceptAsClient(A) {
            let q = A[0];
            if (this._options.clientNoContextTakeover === !1 && q.client_no_context_takeover) throw Error('Unexpected parameter "client_no_context_takeover"');
            if (!q.client_max_window_bits) {
                if (typeof this._options.clientMaxWindowBits === "number") q.client_max_window_bits = this._options.clientMaxWindowBits
            } else if (this._options.clientMaxWindowBits === !1 || typeof this._options.clientMaxWindowBits === "number" && q.client_max_window_bits > this._options.clientMaxWindowBits) throw Error('Unexpected or invalid parameter "client_max_window_bits"');
            return q
        }
        normalizeParams(A) {
            return A.forEach((q) => {
                Object.keys(q).forEach((K) => {
                    let Y = q[K];
                    if (Y.length > 1) throw Error(`Parameter "${K}" must have only a single value`);
                    if (Y = Y[0], K === "client_max_window_bits") {
                        if (Y !== !0) {
                            let z = +Y;
                            if (!Number.isInteger(z) || z < 8 || z > 15) throw TypeError(`Invalid value for parameter "${K}": ${Y}`);
                            Y = z
                        } else if (!this._isServer) throw TypeError(`Invalid value for parameter "${K}": ${Y}`)
                    } else if (K === "server_max_window_bits") {
                        let z = +Y;
                        if (!Number.isInteger(z) || z < 8 || z > 15) throw TypeError(`Invalid value for parameter "${K}": ${Y}`);
                        Y = z
                    } else if (K === "client_no_context_takeover" || K === "server_no_context_takeover") {
                        if (Y !== !0) throw TypeError(`Invalid value for parameter "${K}": ${Y}`)
                    } else throw Error(`Unknown parameter "${K}"`);
                    q[K] = Y
                })
            }), A
        }
        decompress(A, q, K) {
            BG6.add((Y) => {
                this._decompress(A, q, (z, w) => {
                    Y(), K(z, w)
                })
            })
        }
        compress(A, q, K) {
            BG6.add((Y) => {
                this._compress(A, q, (z, w) => {
                    Y(), K(z, w)
                })
            })
        }
        _decompress(A, q, K) {
            let Y = this._isServer ? "client" : "server";
            if (!this._inflate) {
                let z = `${Y}_max_window_bits`,
                    w = typeof this.params[z] !== "number" ? sg1.Z_DEFAULT_WINDOWBITS : this.params[z];
                this._inflate = sg1.createInflateRaw({
                    ...this._options.zlibInflateOptions,
                    windowBits: w
                }), this._inflate[mG6] = this, this._inflate[td] = 0, this._inflate[xt] = [], this._inflate.on("error", VuY), this._inflate.on("data", lr4)
            }
            if (this._inflate[_G1] = K, this._inflate.write(A), q) this._inflate.write(ZuY);
            this._inflate.flush(() => {
                let z = this._inflate[JG1];
                if (z) {
                    this._inflate.close(), this._inflate = null, K(z);
                    return
                }
                let w = pr4.concat(this._inflate[xt], this._inflate[td]);
                if (this._inflate._readableState.endEmitted) this._inflate.close(), this._inflate = null;
                else if (this._inflate[td] = 0, this._inflate[xt] = [], q && this.params[`${Y}_no_context_takeover`]) this._inflate.reset();
                K(null, w)
            })
        }
        _compress(A, q, K) {
            let Y = this._isServer ? "server" : "client";
            if (!this._deflate) {
                let z = `${Y}_max_window_bits`,
                    w = typeof this.params[z] !== "number" ? sg1.Z_DEFAULT_WINDOWBITS : this.params[z];
                this._deflate = sg1.createDeflateRaw({
                    ...this._options.zlibDeflateOptions,
                    windowBits: w
                }), this._deflate[td] = 0, this._deflate[xt] = [], this._deflate.on("data", fuY)
            }
            this._deflate[_G1] = K, this._deflate.write(A), this._deflate.flush(sg1.Z_SYNC_FLUSH, () => {
                if (!this._deflate) return;
                let z = pr4.concat(this._deflate[xt], this._deflate[td]);
                if (q) z = new GuY(z.buffer, z.byteOffset, z.length - 4);
                if (this._deflate[_G1] = null, this._deflate[td] = 0, this._deflate[xt] = [], q && this.params[`${Y}_no_context_takeover`]) this._deflate.reset();
                K(null, z)
            })
        }
    }
    ir4.exports = cr4;

    function fuY(A) {
        this[xt].push(A), this[td] += A.length
    }

    function lr4(A) {
        if (this[td] += A.length, this[mG6]._maxPayload < 1 || this[td] <= this[mG6]._maxPayload) {
            this[xt].push(A);
            return
        }
        this[JG1] = RangeError("Max payload size exceeded"), this[JG1].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH", this[JG1][dr4] = 1009, this.removeListener("data", lr4), this.reset()
    }

    function VuY(A) {
        if (this[mG6]._inflate = null, this[JG1]) {
            this[_G1](this[JG1]);
            return
        }
        A[dr4] = 1007, this[_G1](A)
    }
})
// @from(Ln 368432, Col 4)
XG1 = R((KNH, FG6) => {
    var {
        isUtf8: nr4
    } = h1("buffer"), {
        hasBlob: NuY
    } = sd(), TuY = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0];

    function vuY(A) {
        return A >= 1000 && A <= 1014 && A !== 1004 && A !== 1005 && A !== 1006 || A >= 3000 && A <= 4999
    }

    function _CA(A) {
        let q = A.length,
            K = 0;
        while (K < q)
            if ((A[K] & 128) === 0) K++;
            else if ((A[K] & 224) === 192) {
            if (K + 1 === q || (A[K + 1] & 192) !== 128 || (A[K] & 254) === 192) return !1;
            K += 2
        } else if ((A[K] & 240) === 224) {
            if (K + 2 >= q || (A[K + 1] & 192) !== 128 || (A[K + 2] & 192) !== 128 || A[K] === 224 && (A[K + 1] & 224) === 128 || A[K] === 237 && (A[K + 1] & 224) === 160) return !1;
            K += 3
        } else if ((A[K] & 248) === 240) {
            if (K + 3 >= q || (A[K + 1] & 192) !== 128 || (A[K + 2] & 192) !== 128 || (A[K + 3] & 192) !== 128 || A[K] === 240 && (A[K + 1] & 240) === 128 || A[K] === 244 && A[K + 1] > 143 || A[K] > 244) return !1;
            K += 4
        } else return !1;
        return !0
    }

    function EuY(A) {
        return NuY && typeof A === "object" && typeof A.arrayBuffer === "function" && typeof A.type === "string" && typeof A.stream === "function" && (A[Symbol.toStringTag] === "Blob" || A[Symbol.toStringTag] === "File")
    }
    FG6.exports = {
        isBlob: EuY,
        isValidStatusCode: vuY,
        isValidUTF8: _CA,
        tokenChars: TuY
    };
    if (nr4) FG6.exports.isValidUTF8 = function(A) {
        return A.length < 24 ? _CA(A) : nr4(A)
    };
    else if (!process.env.WS_NO_UTF_8_VALIDATE) try {
        let A = (() => {
            throw new Error("Cannot require module " + "utf-8-validate");
        })();
        FG6.exports.isValidUTF8 = function(q) {
            return q.length < 32 ? _CA(q) : A(q)
        }
    } catch (A) {}
})
// @from(Ln 368482, Col 4)
XCA = R((YNH, tr4) => {
    var {
        Writable: kuY
    } = h1("stream"), rr4 = tg1(), {
        BINARY_TYPES: LuY,
        EMPTY_BUFFER: or4,
        kStatusCode: RuY,
        kWebSocket: yuY
    } = sd(), {
        concat: JCA,
        toArrayBuffer: CuY,
        unmask: SuY
    } = ag1(), {
        isValidStatusCode: huY,
        isValidUTF8: ar4
    } = XG1(), QG6 = Buffer[Symbol.species];
    class sr4 extends kuY {
        constructor(A = {}) {
            super();
            this._allowSynchronousEvents = A.allowSynchronousEvents !== void 0 ? A.allowSynchronousEvents : !0, this._binaryType = A.binaryType || LuY[0], this._extensions = A.extensions || {}, this._isServer = !!A.isServer, this._maxPayload = A.maxPayload | 0, this._skipUTF8Validation = !!A.skipUTF8Validation, this[yuY] = void 0, this._bufferedBytes = 0, this._buffers = [], this._compressed = !1, this._payloadLength = 0, this._mask = void 0, this._fragmented = 0, this._masked = !1, this._fin = !1, this._opcode = 0, this._totalPayloadLength = 0, this._messageLength = 0, this._fragments = [], this._errored = !1, this._loop = !1, this._state = 0
        }
        _write(A, q, K) {
            if (this._opcode === 8 && this._state == 0) return K();
            this._bufferedBytes += A.length, this._buffers.push(A), this.startLoop(K)
        }
        consume(A) {
            if (this._bufferedBytes -= A, A === this._buffers[0].length) return this._buffers.shift();
            if (A < this._buffers[0].length) {
                let K = this._buffers[0];
                return this._buffers[0] = new QG6(K.buffer, K.byteOffset + A, K.length - A), new QG6(K.buffer, K.byteOffset, A)
            }
            let q = Buffer.allocUnsafe(A);
            do {
                let K = this._buffers[0],
                    Y = q.length - A;
                if (A >= K.length) q.set(this._buffers.shift(), Y);
                else q.set(new Uint8Array(K.buffer, K.byteOffset, A), Y), this._buffers[0] = new QG6(K.buffer, K.byteOffset + A, K.length - A);
                A -= K.length
            } while (A > 0);
            return q
        }
        startLoop(A) {
            this._loop = !0;
            do switch (this._state) {
                case 0:
                    this.getInfo(A);
                    break;
                case 1:
                    this.getPayloadLength16(A);
                    break;
                case 2:
                    this.getPayloadLength64(A);
                    break;
                case 3:
                    this.getMask();
                    break;
                case 4:
                    this.getData(A);
                    break;
                case 5:
                case 6:
                    this._loop = !1;
                    return
            }
            while (this._loop);
            if (!this._errored) A()
        }
        getInfo(A) {
            if (this._bufferedBytes < 2) {
                this._loop = !1;
                return
            }
            let q = this.consume(2);
            if ((q[0] & 48) !== 0) {
                let Y = this.createError(RangeError, "RSV2 and RSV3 must be clear", !0, 1002, "WS_ERR_UNEXPECTED_RSV_2_3");
                A(Y);
                return
            }
            let K = (q[0] & 64) === 64;
            if (K && !this._extensions[rr4.extensionName]) {
                let Y = this.createError(RangeError, "RSV1 must be clear", !0, 1002, "WS_ERR_UNEXPECTED_RSV_1");
                A(Y);
                return
            }
            if (this._fin = (q[0] & 128) === 128, this._opcode = q[0] & 15, this._payloadLength = q[1] & 127, this._opcode === 0) {
                if (K) {
                    let Y = this.createError(RangeError, "RSV1 must be clear", !0, 1002, "WS_ERR_UNEXPECTED_RSV_1");
                    A(Y);
                    return
                }
                if (!this._fragmented) {
                    let Y = this.createError(RangeError, "invalid opcode 0", !0, 1002, "WS_ERR_INVALID_OPCODE");
                    A(Y);
                    return
                }
                this._opcode = this._fragmented
            } else if (this._opcode === 1 || this._opcode === 2) {
                if (this._fragmented) {
                    let Y = this.createError(RangeError, `invalid opcode ${this._opcode}`, !0, 1002, "WS_ERR_INVALID_OPCODE");
                    A(Y);
                    return
                }
                this._compressed = K
            } else if (this._opcode > 7 && this._opcode < 11) {
                if (!this._fin) {
                    let Y = this.createError(RangeError, "FIN must be set", !0, 1002, "WS_ERR_EXPECTED_FIN");
                    A(Y);
                    return
                }
                if (K) {
                    let Y = this.createError(RangeError, "RSV1 must be clear", !0, 1002, "WS_ERR_UNEXPECTED_RSV_1");
                    A(Y);
                    return
                }
                if (this._payloadLength > 125 || this._opcode === 8 && this._payloadLength === 1) {
                    let Y = this.createError(RangeError, `invalid payload length ${this._payloadLength}`, !0, 1002, "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH");
                    A(Y);
                    return
                }
            } else {
                let Y = this.createError(RangeError, `invalid opcode ${this._opcode}`, !0, 1002, "WS_ERR_INVALID_OPCODE");
                A(Y);
                return
            }
            if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
            if (this._masked = (q[1] & 128) === 128, this._isServer) {
                if (!this._masked) {
                    let Y = this.createError(RangeError, "MASK must be set", !0, 1002, "WS_ERR_EXPECTED_MASK");
                    A(Y);
                    return
                }
            } else if (this._masked) {
                let Y = this.createError(RangeError, "MASK must be clear", !0, 1002, "WS_ERR_UNEXPECTED_MASK");
                A(Y);
                return
            }
            if (this._payloadLength === 126) this._state = 1;
            else if (this._payloadLength === 127) this._state = 2;
            else this.haveLength(A)
        }
        getPayloadLength16(A) {
            if (this._bufferedBytes < 2) {
                this._loop = !1;
                return
            }
            this._payloadLength = this.consume(2).readUInt16BE(0), this.haveLength(A)
        }
        getPayloadLength64(A) {
            if (this._bufferedBytes < 8) {
                this._loop = !1;
                return
            }
            let q = this.consume(8),
                K = q.readUInt32BE(0);
            if (K > Math.pow(2, 21) - 1) {
                let Y = this.createError(RangeError, "Unsupported WebSocket frame: payload length > 2^53 - 1", !1, 1009, "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH");
                A(Y);
                return
            }
            this._payloadLength = K * Math.pow(2, 32) + q.readUInt32BE(4), this.haveLength(A)
        }
        haveLength(A) {
            if (this._payloadLength && this._opcode < 8) {
                if (this._totalPayloadLength += this._payloadLength, this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
                    let q = this.createError(RangeError, "Max payload size exceeded", !1, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH");
                    A(q);
                    return
                }
            }
            if (this._masked) this._state = 3;
            else this._state = 4
        }
        getMask() {
            if (this._bufferedBytes < 4) {
                this._loop = !1;
                return
            }
            this._mask = this.consume(4), this._state = 4
        }
        getData(A) {
            let q = or4;
            if (this._payloadLength) {
                if (this._bufferedBytes < this._payloadLength) {
                    this._loop = !1;
                    return
                }
                if (q = this.consume(this._payloadLength), this._masked && (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0) SuY(q, this._mask)
            }
            if (this._opcode > 7) {
                this.controlMessage(q, A);
                return
            }
            if (this._compressed) {
                this._state = 5, this.decompress(q, A);
                return
            }
            if (q.length) this._messageLength = this._totalPayloadLength, this._fragments.push(q);
            this.dataMessage(A)
        }
        decompress(A, q) {
            this._extensions[rr4.extensionName].decompress(A, this._fin, (Y, z) => {
                if (Y) return q(Y);
                if (z.length) {
                    if (this._messageLength += z.length, this._messageLength > this._maxPayload && this._maxPayload > 0) {
                        let w = this.createError(RangeError, "Max payload size exceeded", !1, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH");
                        q(w);
                        return
                    }
                    this._fragments.push(z)
                }
                if (this.dataMessage(q), this._state === 0) this.startLoop(q)
            })
        }
        dataMessage(A) {
            if (!this._fin) {
                this._state = 0;
                return
            }
            let q = this._messageLength,
                K = this._fragments;
            if (this._totalPayloadLength = 0, this._messageLength = 0, this._fragmented = 0, this._fragments = [], this._opcode === 2) {
                let Y;
                if (this._binaryType === "nodebuffer") Y = JCA(K, q);
                else if (this._binaryType === "arraybuffer") Y = CuY(JCA(K, q));
                else if (this._binaryType === "blob") Y = new Blob(K);
                else Y = K;
                if (this._allowSynchronousEvents) this.emit("message", Y, !0), this._state = 0;
                else this._state = 6, setImmediate(() => {
                    this.emit("message", Y, !0), this._state = 0, this.startLoop(A)
                })
            } else {
                let Y = JCA(K, q);
                if (!this._skipUTF8Validation && !ar4(Y)) {
                    let z = this.createError(Error, "invalid UTF-8 sequence", !0, 1007, "WS_ERR_INVALID_UTF8");
                    A(z);
                    return
                }
                if (this._state === 5 || this._allowSynchronousEvents) this.emit("message", Y, !1), this._state = 0;
                else this._state = 6, setImmediate(() => {
                    this.emit("message", Y, !1), this._state = 0, this.startLoop(A)
                })
            }
        }
        controlMessage(A, q) {
            if (this._opcode === 8) {
                if (A.length === 0) this._loop = !1, this.emit("conclude", 1005, or4), this.end();
                else {
                    let K = A.readUInt16BE(0);
                    if (!huY(K)) {
                        let z = this.createError(RangeError, `invalid status code ${K}`, !0, 1002, "WS_ERR_INVALID_CLOSE_CODE");
                        q(z);
                        return
                    }
                    let Y = new QG6(A.buffer, A.byteOffset + 2, A.length - 2);
                    if (!this._skipUTF8Validation && !ar4(Y)) {
                        let z = this.createError(Error, "invalid UTF-8 sequence", !0, 1007, "WS_ERR_INVALID_UTF8");
                        q(z);
                        return
                    }
                    this._loop = !1, this.emit("conclude", K, Y), this.end()
                }
                this._state = 0;
                return
            }
            if (this._allowSynchronousEvents) this.emit(this._opcode === 9 ? "ping" : "pong", A), this._state = 0;
            else this._state = 6, setImmediate(() => {
                this.emit(this._opcode === 9 ? "ping" : "pong", A), this._state = 0, this.startLoop(q)
            })
        }
        createError(A, q, K, Y, z) {
            this._loop = !1, this._errored = !0;
            let w = new A(K ? `Invalid WebSocket frame: ${q}` : q);
            return Error.captureStackTrace(w, this.createError), w.code = z, w[RuY] = Y, w
        }
    }
    tr4.exports = sr4
})