
// @from(Ln 413196, Col 0)
function bLK(q, {
    verbose: K
}) {
    if (Object.keys(q).length === 0) return "";
    return Object.entries(q).map(([_, z]) => {
        let Y = I6(z);
        return `${_}: ${Y}`
    }).join(", ")
}
// @from(Ln 413206, Col 0)
function ILK(q) {
    let K = q.at(-1);
    if (!K?.data) return J5.createElement(_1, {
        height: 1
    }, J5.createElement(T, {
        dimColor: !0
    }, "Running…"));
    let {
        progress: _,
        total: z,
        progressMessage: Y
    } = K.data;
    if (_ === void 0) return J5.createElement(_1, {
        height: 1
    }, J5.createElement(T, {
        dimColor: !0
    }, "Running…"));
    if (z !== void 0 && z > 0) {
        let A = Math.min(1, Math.max(0, _ / z)),
            O = Math.round(A * 100);
        return J5.createElement(_1, null, J5.createElement(u, {
            flexDirection: "column"
        }, Y && J5.createElement(T, {
            dimColor: !0
        }, Y), J5.createElement(u, {
            flexDirection: "row",
            gap: 1
        }, J5.createElement(wP6, {
            ratio: A,
            width: 20
        }), J5.createElement(T, {
            dimColor: !0
        }, O, "%"))))
    }
    return J5.createElement(_1, {
        height: 1
    }, J5.createElement(T, {
        dimColor: !0
    }, Y ?? `Processing… ${_}`))
}
// @from(Ln 413247, Col 0)
function Xl8(q, K, {
    verbose: _,
    input: z
}) {
    let Y = q;
    if (!_) {
        let j = CZY(Y, z);
        if (j !== null) return J5.createElement(_1, {
            height: 1
        }, J5.createElement(T, null, "Sent a message to", " ", J5.createElement(v5, null, qc(j.url, j.channel))))
    }
    let A = r38(Y),
        w = A > LZY ? `${e6.warning} Large MCP response (~${iK(A)} tokens), this can fill up context quickly` : null,
        $;
    if (Array.isArray(Y)) {
        let j = Y.map((H, J) => {
            if (H.type === "image") return J5.createElement(u, {
                key: J,
                justifyContent: "space-between",
                overflowX: "hidden",
                width: "100%"
            }, J5.createElement(_1, {
                height: 1
            }, J5.createElement(T, null, "[Image]")));
            return J5.createElement(hZY, {
                key: J,
                item: H,
                verbose: _
            })
        });
        $ = J5.createElement(u, {
            flexDirection: "column",
            width: "100%"
        }, j)
    } else if (!Y) $ = J5.createElement(u, {
        justifyContent: "space-between",
        overflowX: "hidden",
        width: "100%"
    }, J5.createElement(_1, {
        height: 1
    }, J5.createElement(T, {
        dimColor: !0
    }, "(No content)")));
    else $ = J5.createElement(LR, {
        content: Y,
        verbose: _
    });
    if (w) return J5.createElement(u, {
        flexDirection: "column"
    }, J5.createElement(_1, {
        height: 1
    }, J5.createElement(T, {
        color: "warning"
    }, w)), $);
    return $
}
// @from(Ln 413304, Col 0)
function hZY(q) {
    let K = s(7),
        {
            item: _,
            verbose: z
        } = q,
        Y = _.type === "text" && "text" in _ && _.text !== null && _.text !== void 0 ? String(_.text) : "",
        A;
    if (K[4] !== Y || K[5] !== z) A = J5.createElement(LR, {
        content: Y,
        verbose: z
    }), K[4] = Y, K[5] = z, K[6] = A;
    else A = K[6];
    return A
}
// @from(Ln 413320, Col 0)
function RZY(q, {
    maxChars: K,
    maxKeys: _
}) {
    let z = q.trim();
    if (z.length === 0 || z.length > K || z[0] !== "{") return null;
    let Y;
    try {
        Y = n8(z)
    } catch {
        return null
    }
    if (Y === null || typeof Y !== "object" || Array.isArray(Y)) return null;
    let A = Object.entries(Y);
    if (A.length === 0 || A.length > _) return null;
    return A
}
// @from(Ln 413338, Col 0)
function CZY(q, K) {
    let _ = q;
    if (Array.isArray(q)) {
        let j = q.find((H) => H.type === "text");
        _ = j && "text" in j ? j.text : void 0
    }
    if (typeof _ !== "string" || !_.includes('"message_link"')) return null;
    let Y = RZY(_, {
        maxChars: 2000,
        maxKeys: 6
    })?.find(([j]) => j === "message_link")?.[1];
    if (typeof Y !== "string") return null;
    let A = SZY.exec(Y);
    if (!A) return null;
    let O = K,
        w = O?.channel_id ?? O?.channel ?? A[1],
        $ = typeof w === "string" && w ? w : "slack";
    return {
        channel: $.startsWith("#") ? $ : `#${$}`,
        url: Y
    }
}
// @from(Ln 413360, Col 4)
J5
// @from(Ln 413360, Col 8)
LZY = 1e4
// @from(Ln 413361, Col 4)
SZY
// @from(Ln 413362, Col 4)
Dz7 = L(() => {
    o6();
    Qq();
    Jl8();
    CLK();
    GK();
    Bj6();
    n5();
    g6();
    c7();
    De6();
    Hl8();
    e8();
    J5 = K6(P6(), 1);
    SZY = /^https:\/\/[a-z0-9-]+\.slack\.com\/archives\/([A-Z0-9]+)\/p\d+$/
})
// @from(Ln 413378, Col 4)
bZY
// @from(Ln 413378, Col 9)
IZY
// @from(Ln 413378, Col 14)
Zz7
// @from(Ln 413379, Col 4)
xLK = L(() => {
    p7();
    gq();
    Hl8();
    mj6();
    Dz7();
    bZY = C6(() => y.object({}).passthrough()), IZY = C6(() => y.string().describe("MCP tool execution result")), Zz7 = Iq({
        isMcp: !0,
        isOpenWorld() {
            return !1
        },
        name: "mcp",
        maxResultSizeChars: 1e5,
        async description() {
            return RLK
        },
        async prompt() {
            return hLK
        },
        get inputSchema() {
            return bZY()
        },
        get outputSchema() {
            return IZY()
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
        renderToolUseMessage: bLK,
        userFacingName: () => "mcp",
        renderToolUseProgressMessage: ILK,
        renderToolResultMessage: Xl8,
        isResultTruncated(q) {
            let K = q;
            if (typeof K === "string") return yR(K);
            if (Array.isArray(K)) return K.some((_) => _.type === "text" && yR(_.text));
            return !1
        },
        mapToolResultToToolResultBlockParam(q, K) {
            return {
                tool_use_id: K,
                type: "tool_result",
                content: i38(q)
            }
        }
    })
})
// @from(Ln 413435, Col 0)
function xZY(q, K) {
    return function(_, z) {
        if (_ == null) return _;
        if (!gg(_)) return q(_, z);
        var Y = _.length,
            A = K ? Y : -1,
            O = Object(_);
        while (K ? A-- : ++A < Y)
            if (z(O[A], A, O) === !1) break;
        return _
    }
}
// @from(Ln 413447, Col 4)
uLK
// @from(Ln 413448, Col 4)
mLK = L(() => {
    XD6();
    uLK = xZY
})
// @from(Ln 413452, Col 4)
uZY
// @from(Ln 413452, Col 9)
Ml8
// @from(Ln 413453, Col 4)
fz7 = L(() => {
    zY1();
    mLK();
    uZY = uLK(QH8), Ml8 = uZY
})
// @from(Ln 413459, Col 0)
function mZY(q, K) {
    var _ = [];
    return Ml8(q, function(z, Y, A) {
        if (K(z, Y, A)) _.push(z)
    }), _
}
// @from(Ln 413465, Col 4)
BLK
// @from(Ln 413466, Col 4)
pLK = L(() => {
    fz7();
    BLK = mZY
})
// @from(Ln 413471, Col 0)
function pZY(q) {
    if (typeof q != "function") throw TypeError(BZY);
    return function() {
        var K = arguments;
        switch (K.length) {
            case 0:
                return !q.call(this);
            case 1:
                return !q.call(this, K[0]);
            case 2:
                return !q.call(this, K[0], K[1]);
            case 3:
                return !q.call(this, K[0], K[1], K[2])
        }
        return !q.apply(this, K)
    }
}
// @from(Ln 413488, Col 4)
BZY = "Expected a function"
// @from(Ln 413489, Col 4)
Pl8
// @from(Ln 413490, Col 4)
Gz7 = L(() => {
    Pl8 = pZY
})
// @from(Ln 413494, Col 0)
function FZY(q, K) {
    var _ = uO(q) ? OO8 : BLK;
    return _(q, Pl8(xN(K, 3)))
}
// @from(Ln 413498, Col 4)
PG
// @from(Ln 413499, Col 4)
Wl8 = L(() => {
    A61();
    pLK();
    N86();
    YV();
    Gz7();
    PG = FZY
})
// @from(Ln 413507, Col 4)
vz7 = p((cZY) => {
    function FLK() {
        var q = {};
        return q["align-content"] = !1, q["align-items"] = !1, q["align-self"] = !1, q["alignment-adjust"] = !1, q["alignment-baseline"] = !1, q.all = !1, q["anchor-point"] = !1, q.animation = !1, q["animation-delay"] = !1, q["animation-direction"] = !1, q["animation-duration"] = !1, q["animation-fill-mode"] = !1, q["animation-iteration-count"] = !1, q["animation-name"] = !1, q["animation-play-state"] = !1, q["animation-timing-function"] = !1, q.azimuth = !1, q["backface-visibility"] = !1, q.background = !0, q["background-attachment"] = !0, q["background-clip"] = !0, q["background-color"] = !0, q["background-image"] = !0, q["background-origin"] = !0, q["background-position"] = !0, q["background-repeat"] = !0, q["background-size"] = !0, q["baseline-shift"] = !1, q.binding = !1, q.bleed = !1, q["bookmark-label"] = !1, q["bookmark-level"] = !1, q["bookmark-state"] = !1, q.border = !0, q["border-bottom"] = !0, q["border-bottom-color"] = !0, q["border-bottom-left-radius"] = !0, q["border-bottom-right-radius"] = !0, q["border-bottom-style"] = !0, q["border-bottom-width"] = !0, q["border-collapse"] = !0, q["border-color"] = !0, q["border-image"] = !0, q["border-image-outset"] = !0, q["border-image-repeat"] = !0, q["border-image-slice"] = !0, q["border-image-source"] = !0, q["border-image-width"] = !0, q["border-left"] = !0, q["border-left-color"] = !0, q["border-left-style"] = !0, q["border-left-width"] = !0, q["border-radius"] = !0, q["border-right"] = !0, q["border-right-color"] = !0, q["border-right-style"] = !0, q["border-right-width"] = !0, q["border-spacing"] = !0, q["border-style"] = !0, q["border-top"] = !0, q["border-top-color"] = !0, q["border-top-left-radius"] = !0, q["border-top-right-radius"] = !0, q["border-top-style"] = !0, q["border-top-width"] = !0, q["border-width"] = !0, q.bottom = !1, q["box-decoration-break"] = !0, q["box-shadow"] = !0, q["box-sizing"] = !0, q["box-snap"] = !0, q["box-suppress"] = !0, q["break-after"] = !0, q["break-before"] = !0, q["break-inside"] = !0, q["caption-side"] = !1, q.chains = !1, q.clear = !0, q.clip = !1, q["clip-path"] = !1, q["clip-rule"] = !1, q.color = !0, q["color-interpolation-filters"] = !0, q["column-count"] = !1, q["column-fill"] = !1, q["column-gap"] = !1, q["column-rule"] = !1, q["column-rule-color"] = !1, q["column-rule-style"] = !1, q["column-rule-width"] = !1, q["column-span"] = !1, q["column-width"] = !1, q.columns = !1, q.contain = !1, q.content = !1, q["counter-increment"] = !1, q["counter-reset"] = !1, q["counter-set"] = !1, q.crop = !1, q.cue = !1, q["cue-after"] = !1, q["cue-before"] = !1, q.cursor = !1, q.direction = !1, q.display = !0, q["display-inside"] = !0, q["display-list"] = !0, q["display-outside"] = !0, q["dominant-baseline"] = !1, q.elevation = !1, q["empty-cells"] = !1, q.filter = !1, q.flex = !1, q["flex-basis"] = !1, q["flex-direction"] = !1, q["flex-flow"] = !1, q["flex-grow"] = !1, q["flex-shrink"] = !1, q["flex-wrap"] = !1, q.float = !1, q["float-offset"] = !1, q["flood-color"] = !1, q["flood-opacity"] = !1, q["flow-from"] = !1, q["flow-into"] = !1, q.font = !0, q["font-family"] = !0, q["font-feature-settings"] = !0, q["font-kerning"] = !0, q["font-language-override"] = !0, q["font-size"] = !0, q["font-size-adjust"] = !0, q["font-stretch"] = !0, q["font-style"] = !0, q["font-synthesis"] = !0, q["font-variant"] = !0, q["font-variant-alternates"] = !0, q["font-variant-caps"] = !0, q["font-variant-east-asian"] = !0, q["font-variant-ligatures"] = !0, q["font-variant-numeric"] = !0, q["font-variant-position"] = !0, q["font-weight"] = !0, q.grid = !1, q["grid-area"] = !1, q["grid-auto-columns"] = !1, q["grid-auto-flow"] = !1, q["grid-auto-rows"] = !1, q["grid-column"] = !1, q["grid-column-end"] = !1, q["grid-column-start"] = !1, q["grid-row"] = !1, q["grid-row-end"] = !1, q["grid-row-start"] = !1, q["grid-template"] = !1, q["grid-template-areas"] = !1, q["grid-template-columns"] = !1, q["grid-template-rows"] = !1, q["hanging-punctuation"] = !1, q.height = !0, q.hyphens = !1, q.icon = !1, q["image-orientation"] = !1, q["image-resolution"] = !1, q["ime-mode"] = !1, q["initial-letters"] = !1, q["inline-box-align"] = !1, q["justify-content"] = !1, q["justify-items"] = !1, q["justify-self"] = !1, q.left = !1, q["letter-spacing"] = !0, q["lighting-color"] = !0, q["line-box-contain"] = !1, q["line-break"] = !1, q["line-grid"] = !1, q["line-height"] = !1, q["line-snap"] = !1, q["line-stacking"] = !1, q["line-stacking-ruby"] = !1, q["line-stacking-shift"] = !1, q["line-stacking-strategy"] = !1, q["list-style"] = !0, q["list-style-image"] = !0, q["list-style-position"] = !0, q["list-style-type"] = !0, q.margin = !0, q["margin-bottom"] = !0, q["margin-left"] = !0, q["margin-right"] = !0, q["margin-top"] = !0, q["marker-offset"] = !1, q["marker-side"] = !1, q.marks = !1, q.mask = !1, q["mask-box"] = !1, q["mask-box-outset"] = !1, q["mask-box-repeat"] = !1, q["mask-box-slice"] = !1, q["mask-box-source"] = !1, q["mask-box-width"] = !1, q["mask-clip"] = !1, q["mask-image"] = !1, q["mask-origin"] = !1, q["mask-position"] = !1, q["mask-repeat"] = !1, q["mask-size"] = !1, q["mask-source-type"] = !1, q["mask-type"] = !1, q["max-height"] = !0, q["max-lines"] = !1, q["max-width"] = !0, q["min-height"] = !0, q["min-width"] = !0, q["move-to"] = !1, q["nav-down"] = !1, q["nav-index"] = !1, q["nav-left"] = !1, q["nav-right"] = !1, q["nav-up"] = !1, q["object-fit"] = !1, q["object-position"] = !1, q.opacity = !1, q.order = !1, q.orphans = !1, q.outline = !1, q["outline-color"] = !1, q["outline-offset"] = !1, q["outline-style"] = !1, q["outline-width"] = !1, q.overflow = !1, q["overflow-wrap"] = !1, q["overflow-x"] = !1, q["overflow-y"] = !1, q.padding = !0, q["padding-bottom"] = !0, q["padding-left"] = !0, q["padding-right"] = !0, q["padding-top"] = !0, q.page = !1, q["page-break-after"] = !1, q["page-break-before"] = !1, q["page-break-inside"] = !1, q["page-policy"] = !1, q.pause = !1, q["pause-after"] = !1, q["pause-before"] = !1, q.perspective = !1, q["perspective-origin"] = !1, q.pitch = !1, q["pitch-range"] = !1, q["play-during"] = !1, q.position = !1, q["presentation-level"] = !1, q.quotes = !1, q["region-fragment"] = !1, q.resize = !1, q.rest = !1, q["rest-after"] = !1, q["rest-before"] = !1, q.richness = !1, q.right = !1, q.rotation = !1, q["rotation-point"] = !1, q["ruby-align"] = !1, q["ruby-merge"] = !1, q["ruby-position"] = !1, q["shape-image-threshold"] = !1, q["shape-outside"] = !1, q["shape-margin"] = !1, q.size = !1, q.speak = !1, q["speak-as"] = !1, q["speak-header"] = !1, q["speak-numeral"] = !1, q["speak-punctuation"] = !1, q["speech-rate"] = !1, q.stress = !1, q["string-set"] = !1, q["tab-size"] = !1, q["table-layout"] = !1, q["text-align"] = !0, q["text-align-last"] = !0, q["text-combine-upright"] = !0, q["text-decoration"] = !0, q["text-decoration-color"] = !0, q["text-decoration-line"] = !0, q["text-decoration-skip"] = !0, q["text-decoration-style"] = !0, q["text-emphasis"] = !0, q["text-emphasis-color"] = !0, q["text-emphasis-position"] = !0, q["text-emphasis-style"] = !0, q["text-height"] = !0, q["text-indent"] = !0, q["text-justify"] = !0, q["text-orientation"] = !0, q["text-overflow"] = !0, q["text-shadow"] = !0, q["text-space-collapse"] = !0, q["text-transform"] = !0, q["text-underline-position"] = !0, q["text-wrap"] = !0, q.top = !1, q.transform = !1, q["transform-origin"] = !1, q["transform-style"] = !1, q.transition = !1, q["transition-delay"] = !1, q["transition-duration"] = !1, q["transition-property"] = !1, q["transition-timing-function"] = !1, q["unicode-bidi"] = !1, q["vertical-align"] = !1, q.visibility = !1, q["voice-balance"] = !1, q["voice-duration"] = !1, q["voice-family"] = !1, q["voice-pitch"] = !1, q["voice-range"] = !1, q["voice-rate"] = !1, q["voice-stress"] = !1, q["voice-volume"] = !1, q.volume = !1, q["white-space"] = !1, q.widows = !1, q.width = !0, q["will-change"] = !1, q["word-break"] = !0, q["word-spacing"] = !0, q["word-wrap"] = !0, q["wrap-flow"] = !1, q["wrap-through"] = !1, q["writing-mode"] = !1, q["z-index"] = !1, q
    }

    function gZY(q, K, _) {}

    function UZY(q, K, _) {}
    var QZY = /javascript\s*\:/img;

    function dZY(q, K) {
        if (QZY.test(K)) return "";
        return K
    }
    cZY.whiteList = FLK();
    cZY.getDefaultWhiteList = FLK;
    cZY.onAttr = gZY;
    cZY.onIgnoreAttr = UZY;
    cZY.safeAttrValue = dZY
})
// @from(Ln 413528, Col 4)
Tz7 = p((h0$, gLK) => {
    gLK.exports = {
        indexOf: function(q, K) {
            var _, z;
            if (Array.prototype.indexOf) return q.indexOf(K);
            for (_ = 0, z = q.length; _ < z; _++)
                if (q[_] === K) return _;
            return -1
        },
        forEach: function(q, K, _) {
            var z, Y;
            if (Array.prototype.forEach) return q.forEach(K, _);
            for (z = 0, Y = q.length; z < Y; z++) K.call(_, q[z], z, q)
        },
        trim: function(q) {
            if (String.prototype.trim) return q.trim();
            return q.replace(/(^\s*)|(\s*$)/g, "")
        },
        trimRight: function(q) {
            if (String.prototype.trimRight) return q.trimRight();
            return q.replace(/(\s*$)/g, "")
        }
    }
})
// @from(Ln 413552, Col 4)
QLK = p((R0$, ULK) => {
    var a38 = Tz7();

    function aZY(q, K) {
        if (q = a38.trimRight(q), q[q.length - 1] !== ";") q += ";";
        var _ = q.length,
            z = !1,
            Y = 0,
            A = 0,
            O = "";

        function w() {
            if (!z) {
                var H = a38.trim(q.slice(Y, A)),
                    J = H.indexOf(":");
                if (J !== -1) {
                    var X = a38.trim(H.slice(0, J)),
                        M = a38.trim(H.slice(J + 1));
                    if (X) {
                        var P = K(Y, O.length, X, M, H);
                        if (P) O += P + "; "
                    }
                }
            }
            Y = A + 1
        }
        for (; A < _; A++) {
            var $ = q[A];
            if ($ === "/" && q[A + 1] === "*") {
                var j = q.indexOf("*/", A + 2);
                if (j === -1) break;
                A = j + 1, Y = A + 1, z = !1
            } else if ($ === "(") z = !0;
            else if ($ === ")") z = !1;
            else if ($ === ";")
                if (z);
                else w();
            else if ($ === `
`) w()
        }
        return a38.trim(O)
    }
    ULK.exports = aZY
})
// @from(Ln 413596, Col 4)
nLK = p((C0$, lLK) => {
    var Dl8 = vz7(),
        sZY = QLK(),
        S0$ = Tz7();

    function dLK(q) {
        return q === void 0 || q === null
    }

    function tZY(q) {
        var K = {};
        for (var _ in q) K[_] = q[_];
        return K
    }

    function cLK(q) {
        q = tZY(q || {}), q.whiteList = q.whiteList || Dl8.whiteList, q.onAttr = q.onAttr || Dl8.onAttr, q.onIgnoreAttr = q.onIgnoreAttr || Dl8.onIgnoreAttr, q.safeAttrValue = q.safeAttrValue || Dl8.safeAttrValue, this.options = q
    }
    cLK.prototype.process = function(q) {
        if (q = q || "", q = q.toString(), !q) return "";
        var K = this,
            _ = K.options,
            z = _.whiteList,
            Y = _.onAttr,
            A = _.onIgnoreAttr,
            O = _.safeAttrValue,
            w = sZY(q, function($, j, H, J, X) {
                var M = z[H],
                    P = !1;
                if (M === !0) P = M;
                else if (typeof M === "function") P = M(J);
                else if (M instanceof RegExp) P = M.test(J);
                if (P !== !0) P = !1;
                if (J = O(H, J), !J) return;
                var W = {
                    position: j,
                    sourcePosition: $,
                    source: X,
                    isWhite: P
                };
                if (P) {
                    var D = Y(H, J, W);
                    if (dLK(D)) return H + ":" + J;
                    else return D
                } else {
                    var D = A(H, J, W);
                    if (!dLK(D)) return D
                }
            });
        return w
    };
    lLK.exports = cLK
})
// @from(Ln 413649, Col 4)
Gl8 = p((fl8, Vz7) => {
    var iLK = vz7(),
        rLK = nLK();

    function eZY(q, K) {
        var _ = new rLK(K);
        return _.process(q)
    }
    fl8 = Vz7.exports = eZY;
    fl8.FilterCSS = rLK;
    for (Zl8 in iLK) fl8[Zl8] = iLK[Zl8];
    var Zl8;
    if (typeof window < "u") window.filterCSS = Vz7.exports
})
// @from(Ln 413663, Col 4)
vl8 = p((b0$, oLK) => {
    oLK.exports = {
        indexOf: function(q, K) {
            var _, z;
            if (Array.prototype.indexOf) return q.indexOf(K);
            for (_ = 0, z = q.length; _ < z; _++)
                if (q[_] === K) return _;
            return -1
        },
        forEach: function(q, K, _) {
            var z, Y;
            if (Array.prototype.forEach) return q.forEach(K, _);
            for (z = 0, Y = q.length; z < Y; z++) K.call(_, q[z], z, q)
        },
        trim: function(q) {
            if (String.prototype.trim) return q.trim();
            return q.replace(/(^\s*)|(\s*$)/g, "")
        },
        spaceIndex: function(q) {
            var K = /\s|\n|\t/,
                _ = K.exec(q);
            return _ ? _.index : -1
        }
    }
})
// @from(Ln 413688, Col 4)
kz7 = p((ffY) => {
    var qfY = Gl8().FilterCSS,
        KfY = Gl8().getDefaultWhiteList,
        Vl8 = vl8();

    function tLK() {
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
    var eLK = new qfY;

    function _fY(q, K, _) {}

    function zfY(q, K, _) {}

    function YfY(q, K, _) {}

    function AfY(q, K, _) {}

    function qhK(q) {
        return q.replace(wfY, "&lt;").replace($fY, "&gt;")
    }

    function OfY(q, K, _, z) {
        if (_ = OhK(_), K === "href" || K === "src") {
            if (_ = Vl8.trim(_), _ === "#") return "#";
            if (!(_.substr(0, 7) === "http://" || _.substr(0, 8) === "https://" || _.substr(0, 7) === "mailto:" || _.substr(0, 4) === "tel:" || _.substr(0, 11) === "data:image/" || _.substr(0, 6) === "ftp://" || _.substr(0, 2) === "./" || _.substr(0, 3) === "../" || _[0] === "#" || _[0] === "/")) return ""
        } else if (K === "background") {
            if (Tl8.lastIndex = 0, Tl8.test(_)) return ""
        } else if (K === "style") {
            if (aLK.lastIndex = 0, aLK.test(_)) return "";
            if (sLK.lastIndex = 0, sLK.test(_)) {
                if (Tl8.lastIndex = 0, Tl8.test(_)) return ""
            }
            if (z !== !1) z = z || eLK, _ = z.process(_)
        }
        return _ = whK(_), _
    }
    var wfY = /</g,
        $fY = />/g,
        jfY = /"/g,
        HfY = /&quot;/g,
        JfY = /&#([a-zA-Z0-9]*);?/gim,
        XfY = /&colon;?/gim,
        MfY = /&newline;?/gim,
        Tl8 = /((j\s*a\s*v\s*a|v\s*b|l\s*i\s*v\s*e)\s*s\s*c\s*r\s*i\s*p\s*t\s*|m\s*o\s*c\s*h\s*a):/gi,
        aLK = /e\s*x\s*p\s*r\s*e\s*s\s*s\s*i\s*o\s*n\s*\(.*/gi,
        sLK = /u\s*r\s*l\s*\(.*/gi;

    function KhK(q) {
        return q.replace(jfY, "&quot;")
    }

    function _hK(q) {
        return q.replace(HfY, '"')
    }

    function zhK(q) {
        return q.replace(JfY, function(_, z) {
            return z[0] === "x" || z[0] === "X" ? String.fromCharCode(parseInt(z.substr(1), 16)) : String.fromCharCode(parseInt(z, 10))
        })
    }

    function YhK(q) {
        return q.replace(XfY, ":").replace(MfY, " ")
    }

    function AhK(q) {
        var K = "";
        for (var _ = 0, z = q.length; _ < z; _++) K += q.charCodeAt(_) < 32 ? " " : q.charAt(_);
        return Vl8.trim(K)
    }

    function OhK(q) {
        return q = _hK(q), q = zhK(q), q = YhK(q), q = AhK(q), q
    }

    function whK(q) {
        return q = KhK(q), q = qhK(q), q
    }

    function PfY() {
        return ""
    }

    function WfY(q, K) {
        if (typeof K !== "function") K = function() {};
        var _ = !Array.isArray(q);

        function z(O) {
            if (_) return !0;
            return Vl8.indexOf(q, O) !== -1
        }
        var Y = [],
            A = !1;
        return {
            onIgnoreTag: function(O, w, $) {
                if (z(O))
                    if ($.isClosing) {
                        var j = "[/removed]",
                            H = $.position + j.length;
                        return Y.push([A !== !1 ? A : $.position, H]), A = !1, j
                    } else {
                        if (!A) A = $.position;
                        return "[removed]"
                    }
                else return K(O, w, $)
            },
            remove: function(O) {
                var w = "",
                    $ = 0;
                return Vl8.forEach(Y, function(j) {
                    w += O.slice($, j[0]), $ = j[1]
                }), w += O.slice($), w
            }
        }
    }

    function DfY(q) {
        var K = "",
            _ = 0;
        while (_ < q.length) {
            var z = q.indexOf("<!--", _);
            if (z === -1) {
                K += q.slice(_);
                break
            }
            K += q.slice(_, z);
            var Y = q.indexOf("-->", z);
            if (Y === -1) break;
            _ = Y + 3
        }
        return K
    }

    function ZfY(q) {
        var K = q.split("");
        return K = K.filter(function(_) {
            var z = _.charCodeAt(0);
            if (z === 127) return !1;
            if (z <= 31) {
                if (z === 10 || z === 13) return !0;
                return !1
            }
            return !0
        }), K.join("")
    }
    ffY.whiteList = tLK();
    ffY.getDefaultWhiteList = tLK;
    ffY.onTag = _fY;
    ffY.onIgnoreTag = zfY;
    ffY.onTagAttr = YfY;
    ffY.onIgnoreTagAttr = AfY;
    ffY.safeAttrValue = OfY;
    ffY.escapeHtml = qhK;
    ffY.escapeQuote = KhK;
    ffY.unescapeQuote = _hK;
    ffY.escapeHtmlEntities = zhK;
    ffY.escapeDangerHtml5Entities = YhK;
    ffY.clearNonPrintableCharacter = AhK;
    ffY.friendlyAttrValue = OhK;
    ffY.escapeAttrValue = whK;
    ffY.onIgnoreTagStripAll = PfY;
    ffY.StripTagBody = WfY;
    ffY.stripCommentTag = DfY;
    ffY.stripBlankChar = ZfY;
    ffY.attributeWrapSign = '"';
    ffY.cssFilter = eLK;
    ffY.getDefaultCSSWhiteList = KfY
})
// @from(Ln 413926, Col 4)
Nz7 = p((afY) => {
    var G_6 = vl8();

    function UfY(q) {
        var K = G_6.spaceIndex(q),
            _;
        if (K === -1) _ = q.slice(1, -1);
        else _ = q.slice(1, K + 1);
        if (_ = G_6.trim(_).toLowerCase(), _.slice(0, 1) === "/") _ = _.slice(1);
        if (_.slice(-1) === "/") _ = _.slice(0, -1);
        return _
    }

    function QfY(q) {
        return q.slice(0, 2) === "</"
    }

    function dfY(q, K, _) {
        var z = "",
            Y = 0,
            A = !1,
            O = !1,
            w = 0,
            $ = q.length,
            j = "",
            H = "";
        q: for (w = 0; w < $; w++) {
            var J = q.charAt(w);
            if (A === !1) {
                if (J === "<") {
                    A = w;
                    continue
                }
            } else if (O === !1) {
                if (J === "<") {
                    z += _(q.slice(Y, w)), A = w, Y = w;
                    continue
                }
                if (J === ">" || w === $ - 1) {
                    z += _(q.slice(Y, A)), H = q.slice(A, w + 1), j = UfY(H), z += K(A, z.length, j, H, QfY(H)), Y = w + 1, A = !1;
                    continue
                }
                if (J === '"' || J === "'") {
                    var X = 1,
                        M = q.charAt(w - X);
                    while (M.trim() === "" || M === "=") {
                        if (M === "=") {
                            O = J;
                            continue q
                        }
                        M = q.charAt(w - ++X)
                    }
                }
            } else if (J === O) {
                O = !1;
                continue
            }
        }
        if (Y < $) z += _(q.substr(Y));
        return z
    }
    var cfY = /[^a-zA-Z0-9\\_:.-]/gim;

    function lfY(q, K) {
        var _ = 0,
            z = 0,
            Y = [],
            A = !1,
            O = q.length;

        function w(X, M) {
            if (X = G_6.trim(X), X = X.replace(cfY, "").toLowerCase(), X.length < 1) return;
            var P = K(X, M || "");
            if (P) Y.push(P)
        }
        for (var $ = 0; $ < O; $++) {
            var j = q.charAt($),
                H, J;
            if (A === !1 && j === "=") {
                A = q.slice(_, $), _ = $ + 1, z = q.charAt(_) === '"' || q.charAt(_) === "'" ? _ : ifY(q, $ + 1);
                continue
            }
            if (A !== !1) {
                if ($ === z)
                    if (J = q.indexOf(j, $ + 1), J === -1) break;
                    else {
                        H = G_6.trim(q.slice(z + 1, J)), w(A, H), A = !1, $ = J, _ = $ + 1;
                        continue
                    }
            }
            if (/\s|\n|\t/.test(j))
                if (q = q.replace(/\s|\n|\t/g, " "), A === !1)
                    if (J = nfY(q, $), J === -1) {
                        H = G_6.trim(q.slice(_, $)), w(H), A = !1, _ = $ + 1;
                        continue
                    } else {
                        $ = J - 1;
                        continue
                    }
            else if (J = rfY(q, $ - 1), J === -1) {
                H = G_6.trim(q.slice(_, $)), H = $hK(H), w(A, H), A = !1, _ = $ + 1;
                continue
            } else continue
        }
        if (_ < q.length)
            if (A === !1) w(q.slice(_));
            else w(A, $hK(G_6.trim(q.slice(_))));
        return G_6.trim(Y.join(" "))
    }

    function nfY(q, K) {
        for (; K < q.length; K++) {
            var _ = q[K];
            if (_ === " ") continue;
            if (_ === "=") return K;
            return -1
        }
    }

    function ifY(q, K) {
        for (; K < q.length; K++) {
            var _ = q[K];
            if (_ === " ") continue;
            if (_ === "'" || _ === '"') return K;
            return -1
        }
    }

    function rfY(q, K) {
        for (; K > 0; K--) {
            var _ = q[K];
            if (_ === " ") continue;
            if (_ === "=") return K;
            return -1
        }
    }

    function ofY(q) {
        if (q[0] === '"' && q[q.length - 1] === '"' || q[0] === "'" && q[q.length - 1] === "'") return !0;
        else return !1
    }

    function $hK(q) {
        if (ofY(q)) return q.substr(1, q.length - 2);
        else return q
    }
    afY.parseTag = dfY;
    afY.parseAttr = lfY
})
// @from(Ln 414075, Col 4)
XhK = p((u0$, JhK) => {
    var efY = Gl8().FilterCSS,
        Ju = kz7(),
        jhK = Nz7(),
        qGY = jhK.parseTag,
        KGY = jhK.parseAttr,
        Nl8 = vl8();

    function kl8(q) {
        return q === void 0 || q === null
    }

    function _GY(q) {
        var K = Nl8.spaceIndex(q);
        if (K === -1) return {
            html: "",
            closing: q[q.length - 2] === "/"
        };
        q = Nl8.trim(q.slice(K + 1, -1));
        var _ = q[q.length - 1] === "/";
        if (_) q = Nl8.trim(q.slice(0, -1));
        return {
            html: q,
            closing: _
        }
    }

    function zGY(q) {
        var K = {};
        for (var _ in q) K[_] = q[_];
        return K
    }

    function YGY(q) {
        var K = {};
        for (var _ in q)
            if (Array.isArray(q[_])) K[_.toLowerCase()] = q[_].map(function(z) {
                return z.toLowerCase()
            });
            else K[_.toLowerCase()] = q[_];
        return K
    }

    function HhK(q) {
        if (q = zGY(q || {}), q.stripIgnoreTag) {
            if (q.onIgnoreTag) console.error('Notes: cannot use these two options "stripIgnoreTag" and "onIgnoreTag" at the same time');
            q.onIgnoreTag = Ju.onIgnoreTagStripAll
        }
        if (q.whiteList || q.allowList) q.whiteList = YGY(q.whiteList || q.allowList);
        else q.whiteList = Ju.whiteList;
        if (this.attributeWrapSign = q.singleQuotedAttributeValue === !0 ? "'" : Ju.attributeWrapSign, q.onTag = q.onTag || Ju.onTag, q.onTagAttr = q.onTagAttr || Ju.onTagAttr, q.onIgnoreTag = q.onIgnoreTag || Ju.onIgnoreTag, q.onIgnoreTagAttr = q.onIgnoreTagAttr || Ju.onIgnoreTagAttr, q.safeAttrValue = q.safeAttrValue || Ju.safeAttrValue, q.escapeHtml = q.escapeHtml || Ju.escapeHtml, this.options = q, q.css === !1) this.cssFilter = !1;
        else q.css = q.css || {}, this.cssFilter = new efY(q.css)
    }
    HhK.prototype.process = function(q) {
        if (q = q || "", q = q.toString(), !q) return "";
        var K = this,
            _ = K.options,
            z = _.whiteList,
            Y = _.onTag,
            A = _.onIgnoreTag,
            O = _.onTagAttr,
            w = _.onIgnoreTagAttr,
            $ = _.safeAttrValue,
            j = _.escapeHtml,
            H = K.attributeWrapSign,
            J = K.cssFilter;
        if (_.stripBlankChar) q = Ju.stripBlankChar(q);
        if (!_.allowCommentTag) q = Ju.stripCommentTag(q);
        var X = !1;
        if (_.stripIgnoreTagBody) X = Ju.StripTagBody(_.stripIgnoreTagBody, A), A = X.onIgnoreTag;
        var M = qGY(q, function(P, W, D, Z, G) {
            var f = {
                    sourcePosition: P,
                    position: W,
                    isClosing: G,
                    isWhite: Object.prototype.hasOwnProperty.call(z, D)
                },
                v = Y(D, Z, f);
            if (!kl8(v)) return v;
            if (f.isWhite) {
                if (f.isClosing) return "</" + D + ">";
                var V = _GY(Z),
                    k = z[D],
                    N = KGY(V.html, function(R, h) {
                        var C = Nl8.indexOf(k, R) !== -1,
                            x = O(D, R, h, C);
                        if (!kl8(x)) return x;
                        if (C)
                            if (h = $(D, R, h, J), h) return R + "=" + H + h + H;
                            else return R;
                        else {
                            if (x = w(D, R, h, C), !kl8(x)) return x;
                            return
                        }
                    });
                if (Z = "<" + D, N) Z += " " + N;
                if (V.closing) Z += " /";
                return Z += ">", Z
            } else {
                if (v = A(D, Z, f), !kl8(v)) return v;
                return j(Z)
            }
        }, j);
        if (X) M = X.remove(M);
        return M
    };
    JhK.exports = HhK
})
// @from(Ln 414183, Col 4)
Ez7 = p((lI6, El8) => {
    var MhK = kz7(),
        PhK = Nz7(),
        WhK = XhK();

    function DhK(q, K) {
        var _ = new WhK(K);
        return _.process(q)
    }
    lI6 = El8.exports = DhK;
    lI6.filterXSS = DhK;
    lI6.FilterXSS = WhK;
    (function() {
        for (var q in MhK) lI6[q] = MhK[q];
        for (var K in PhK) lI6[K] = PhK[K]
    })();
    if (typeof window < "u") window.filterXSS = El8.exports;

    function AGY() {
        return typeof self < "u" && typeof DedicatedWorkerGlobalScope < "u" && self instanceof DedicatedWorkerGlobalScope
    }
    if (AGY()) self.filterXSS = El8.exports
})
// @from(Ln 414210, Col 0)
function s38(q = yz7) {
    return `http://localhost:${q}/callback`
}
// @from(Ln 414214, Col 0)
function wGY() {
    let q = parseInt(process.env.MCP_OAUTH_CALLBACK_PORT || "", 10);
    return q > 0 ? q : void 0
}
// @from(Ln 414218, Col 0)
async function yl8() {
    let q = wGY();
    if (q) return q;
    let {
        min: K,
        max: _
    } = OGY, z = _ - K + 1, Y = Math.min(z, 100);
    for (let A = 0; A < Y; A++) {
        let O = K + Math.floor(Math.random() * z);
        try {
            return await new Promise((w, $) => {
                let j = ZhK();
                j.once("error", $), j.listen(O, () => {
                    j.close(() => w())
                })
            }), O
        } catch {
            continue
        }
    }
    try {
        return await new Promise((A, O) => {
            let w = ZhK();
            w.once("error", O), w.listen(yz7, () => {
                w.close(() => A())
            })
        }), yz7
    } catch {
        throw Error("No available ports for OAuth redirect")
    }
}
// @from(Ln 414249, Col 4)
OGY
// @from(Ln 414249, Col 9)
yz7 = 3118
// @from(Ln 414250, Col 4)
Lz7 = L(() => {
    NK();
    OGY = y1() === "windows" ? {
        min: 39152,
        max: 49151
    } : {
        min: 49152,
        max: 65535
    }
})
// @from(Ln 414261, Col 0)
function vhK(q) {
    return (K, _) => {
        let z = AbortSignal.timeout($GY),
            Y = q ? AbortSignal.any([z, q]) : z;
        return fetch(K, {
            ..._,
            signal: Y
        })
    }
}
// @from(Ln 414272, Col 0)
function Ll8(q) {
    try {
        return new URL(q).href.replace(/\/$/, "")
    } catch {
        return q.replace(/\/$/, "")
    }
}
// @from(Ln 414280, Col 0)
function t38(q) {
    return (typeof q === "string" ? q : I6(q)).replace(JGY, (_, z) => `"${z}":"[REDACTED]"`)
}
// @from(Ln 414283, Col 0)
async function PGY(q, K) {
    let _;
    try {
        _ = await bR8(q, void 0, K?.fetchFn ?? hl8)
    } catch (z) {
        throw Error(`XAA: PRM discovery failed: ${z instanceof Error?z.message:String(z)}`)
    }
    if (!_.resource || !_.authorization_servers?.[0]) throw Error("XAA: PRM discovery failed: PRM missing resource or authorization_servers");
    if (Ll8(_.resource) !== Ll8(q)) throw Error(`XAA: PRM discovery failed: PRM resource mismatch: expected ${q}, got ${_.resource}`);
    return {
        resource: _.resource,
        authorization_servers: _.authorization_servers
    }
}
// @from(Ln 414297, Col 0)
async function WGY(q, K) {
    let _ = await bj6(q, {
        fetchFn: K?.fetchFn ?? hl8
    });
    if (!_?.issuer || !_.token_endpoint) throw Error(`XAA: AS metadata discovery failed: no valid metadata at ${q}`);
    if (Ll8(_.issuer) !== Ll8(q)) throw Error(`XAA: AS metadata discovery failed: issuer mismatch: expected ${q}, got ${_.issuer}`);
    if (new URL(_.token_endpoint).protocol !== "https:") throw Error(`XAA: refusing non-HTTPS token endpoint: ${_.token_endpoint}`);
    return {
        issuer: _.issuer,
        token_endpoint: _.token_endpoint,
        grant_types_supported: _.grant_types_supported,
        token_endpoint_auth_methods_supported: _.token_endpoint_auth_methods_supported
    }
}
// @from(Ln 414311, Col 0)
async function DGY(q) {
    let K = q.fetchFn ?? hl8,
        _ = new URLSearchParams({
            grant_type: jGY,
            requested_token_type: fhK,
            audience: q.audience,
            resource: q.resource,
            subject_token: q.idToken,
            subject_token_type: HGY,
            client_id: q.clientId
        });
    if (q.clientSecret) _.set("client_secret", q.clientSecret);
    if (q.scope) _.set("scope", q.scope);
    let z = await K(q.tokenEndpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: _
    });
    if (!z.ok) {
        let w = t38(await z.text()).slice(0, 200),
            $ = z.status < 500;
        throw new Ie(`XAA: token exchange failed: HTTP ${z.status}: ${w}`, $)
    }
    let Y;
    try {
        Y = await z.json()
    } catch {
        throw new Ie(`XAA: token exchange returned non-JSON (captive portal?) at ${q.tokenEndpoint}`, !1)
    }
    let A = XGY().safeParse(Y);
    if (!A.success) throw new Ie(`XAA: token exchange response did not match expected shape: ${t38(Y)}`, !0);
    let O = A.data;
    if (!O.access_token) throw new Ie(`XAA: token exchange response missing access_token: ${t38(O)}`, !0);
    if (O.issued_token_type !== fhK) throw new Ie(`XAA: token exchange returned unexpected issued_token_type: ${O.issued_token_type}`, !0);
    return {
        jwtAuthGrant: O.access_token,
        expiresIn: O.expires_in,
        scope: O.scope
    }
}
// @from(Ln 414353, Col 0)
async function ZGY(q) {
    let K = q.fetchFn ?? hl8,
        _ = q.authMethod ?? "client_secret_basic",
        z = new URLSearchParams({
            grant_type: GhK,
            assertion: q.assertion
        });
    if (q.scope) z.set("scope", q.scope);
    let Y = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    if (_ === "client_secret_basic") {
        let $ = Buffer.from(`${encodeURIComponent(q.clientId)}:${encodeURIComponent(q.clientSecret)}`).toString("base64");
        Y.Authorization = `Basic ${$}`
    } else z.set("client_id", q.clientId), z.set("client_secret", q.clientSecret);
    let A = await K(q.tokenEndpoint, {
        method: "POST",
        headers: Y,
        body: z
    });
    if (!A.ok) {
        let $ = t38(await A.text()).slice(0, 200);
        throw Error(`XAA: jwt-bearer grant failed: HTTP ${A.status}: ${$}`)
    }
    let O;
    try {
        O = await A.json()
    } catch {
        throw Error(`XAA: jwt-bearer grant returned non-JSON (captive portal?) at ${q.tokenEndpoint}`)
    }
    let w = MGY().safeParse(O);
    if (!w.success) throw Error(`XAA: jwt-bearer response did not match expected shape: ${t38(O)}`);
    return w.data
}
// @from(Ln 414387, Col 0)
async function hz7(q, K, _ = "xaa", z) {
    let Y = vhK(z);
    i8(_, `XAA: discovering PRM for ${q}`);
    let A = await PGY(q, {
        fetchFn: Y
    });
    i8(_, `XAA: discovered resource=${A.resource} ASes=[${A.authorization_servers.join(", ")}]`);
    let O, w = [];
    for (let X of A.authorization_servers) {
        let M;
        try {
            M = await WGY(X, {
                fetchFn: Y
            })
        } catch (P) {
            if (z?.aborted) throw P;
            w.push(`${X}: ${P instanceof Error?P.message:String(P)}`);
            continue
        }
        if (M.grant_types_supported && !M.grant_types_supported.includes(GhK)) {
            w.push(`${X}: does not advertise jwt-bearer grant (supported: ${M.grant_types_supported.join(", ")})`);
            continue
        }
        O = M;
        break
    }
    if (!O) throw Error(`XAA: no authorization server supports jwt-bearer. Tried: ${w.join("; ")}`);
    let $ = O.token_endpoint_auth_methods_supported,
        j = $ && !$.includes("client_secret_basic") && $.includes("client_secret_post") ? "client_secret_post" : "client_secret_basic";
    i8(_, `XAA: AS issuer=${O.issuer} token_endpoint=${O.token_endpoint} auth_method=${j}`), i8(_, "XAA: exchanging id_token for ID-JAG at IdP");
    let H = await DGY({
        tokenEndpoint: K.idpTokenEndpoint,
        audience: O.issuer,
        resource: A.resource,
        idToken: K.idpIdToken,
        clientId: K.idpClientId,
        clientSecret: K.idpClientSecret,
        fetchFn: Y
    });
    i8(_, "XAA: ID-JAG obtained"), i8(_, "XAA: exchanging ID-JAG for access_token at AS");
    let J = await ZGY({
        tokenEndpoint: O.token_endpoint,
        assertion: H.jwtAuthGrant,
        clientId: K.clientId,
        clientSecret: K.clientSecret,
        authMethod: j,
        fetchFn: Y
    });
    return i8(_, "XAA: access_token obtained"), {
        ...J,
        authorizationServerUrl: O.issuer
    }
}
// @from(Ln 414440, Col 4)
$GY = 30000
// @from(Ln 414441, Col 4)
jGY = "urn:ietf:params:oauth:grant-type:token-exchange"
// @from(Ln 414442, Col 4)
GhK = "urn:ietf:params:oauth:grant-type:jwt-bearer"
// @from(Ln 414443, Col 4)
fhK = "urn:ietf:params:oauth:token-type:id-jag"
// @from(Ln 414444, Col 4)
HGY = "urn:ietf:params:oauth:token-type:id_token"
// @from(Ln 414445, Col 4)
hl8
// @from(Ln 414445, Col 9)
Ie
// @from(Ln 414445, Col 13)
JGY
// @from(Ln 414445, Col 18)
XGY
// @from(Ln 414445, Col 23)
MGY
// @from(Ln 414446, Col 4)
ThK = L(() => {
    Ij6();
    p7();
    U8();
    e8();
    hl8 = vhK();
    Ie = class Ie extends Error {
        shouldClearIdToken;
        constructor(q, K) {
            super(q);
            this.name = "XaaTokenExchangeError", this.shouldClearIdToken = K
        }
    };
    JGY = /"(access_token|refresh_token|id_token|assertion|subject_token|client_secret)"\s*:\s*"[^"]*"/g;
    XGY = C6(() => y.object({
        access_token: y.string().optional(),
        issued_token_type: y.string().optional(),
        expires_in: y.coerce.number().optional(),
        scope: y.string().optional()
    })), MGY = C6(() => y.object({
        access_token: y.string().min(1),
        token_type: y.string().default("Bearer"),
        expires_in: y.coerce.number().optional(),
        scope: y.string().optional(),
        refresh_token: y.string().optional()
    }))
})
// @from(Ln 414483, Col 0)
function xe() {
    return S6(process.env.CLAUDE_CODE_ENABLE_XAA)
}
// @from(Ln 414487, Col 0)
function Xn() {
    return v7().xaaIdp
}
// @from(Ln 414491, Col 0)
function ue(q) {
    try {
        let K = new URL(q);
        return K.pathname = K.pathname.replace(/\/+$/, ""), K.host = K.host.toLowerCase(), K.toString()
    } catch {
        return q.replace(/\/+$/, "")
    }
}
// @from(Ln 414500, Col 0)
function $P6(q) {
    let z = t3().read()?.mcpXaaIdp?.[ue(q)];
    if (!z) return;
    if (z.expiresAt - Date.now() <= VGY * 1000) return;
    return z.idToken
}
// @from(Ln 414507, Col 0)
function khK(q, K, _) {
    let z = t3(),
        Y = z.read() || {};
    z.update({
        ...Y,
        mcpXaaIdp: {
            ...Y.mcpXaaIdp,
            [ue(q)]: {
                idToken: K,
                expiresAt: _
            }
        }
    })
}
// @from(Ln 414522, Col 0)
function NhK(q, K) {
    let _ = yhK(K),
        z = _ ? _ * 1000 : Date.now() + 3600000;
    return khK(q, K, z), z
}
// @from(Ln 414528, Col 0)
function v_6(q) {
    let K = t3(),
        _ = K.read(),
        z = ue(q);
    if (!_?.mcpXaaIdp?.[z]) return;
    delete _.mcpXaaIdp[z], K.update(_)
}
// @from(Ln 414536, Col 0)
function EhK(q, K) {
    let _ = t3(),
        z = _.read() || {};
    return _.update({
        ...z,
        mcpXaaIdpConfig: {
            ...z.mcpXaaIdpConfig,
            [ue(q)]: {
                clientSecret: K
            }
        }
    })
}
// @from(Ln 414550, Col 0)
function nI6(q) {
    return t3().read()?.mcpXaaIdpConfig?.[ue(q)]?.clientSecret
}
// @from(Ln 414554, Col 0)
function Rl8(q) {
    let K = t3(),
        _ = K.read(),
        z = ue(q);
    if (!_?.mcpXaaIdpConfig?.[z]) return;
    delete _.mcpXaaIdpConfig[z], K.update(_)
}
// @from(Ln 414561, Col 0)
async function Sl8(q) {
    let K = q.endsWith("/") ? q : q + "/",
        _ = new URL(".well-known/openid-configuration", K),
        z = await fetch(_, {
            headers: {
                Accept: "application/json"
            },
            signal: AbortSignal.timeout(VhK)
        });
    if (!z.ok) throw Error(`XAA IdP: OIDC discovery failed: HTTP ${z.status} at ${_}`);
    let Y;
    try {
        Y = await z.json()
    } catch {
        throw Error(`XAA IdP: OIDC discovery returned non-JSON at ${_} (captive portal or proxy?)`)
    }
    let A = GR8.safeParse(Y);
    if (!A.success) throw Error(`XAA IdP: invalid OIDC metadata: ${A.error.message}`);
    if (new URL(A.data.token_endpoint).protocol !== "https:") throw Error(`XAA IdP: refusing non-HTTPS token endpoint: ${A.data.token_endpoint}`);
    return A.data
}
// @from(Ln 414583, Col 0)
function yhK(q) {
    let K = q.split(".");
    if (K.length !== 3) return;
    try {
        let _ = n8(Buffer.from(K[1], "base64url").toString("utf-8"));
        return typeof _.exp === "number" ? _.exp : void 0
    } catch {
        return
    }
}
// @from(Ln 414594, Col 0)
function kGY(q, K, _, z) {
    let Y = null,
        A = null,
        O = null,
        w = () => {
            if (Y?.removeAllListeners(), Y?.on("error", () => {}), Y?.close(), Y = null, A) clearTimeout(A), A = null;
            if (_ && O) _.removeEventListener("abort", O), O = null
        };
    return new Promise(($, j) => {
        let H = !1,
            J = (M) => {
                if (H) return;
                H = !0, w(), $(M)
            },
            X = (M) => {
                if (H) return;
                H = !0, w(), j(M)
            };
        if (_) {
            if (O = () => X(Error("XAA IdP: login cancelled")), _.aborted) {
                O();
                return
            }
            _.addEventListener("abort", O, {
                once: !0
            })
        }
        Y = GGY((M, P) => {
            let W = vGY(M.url || "", !0);
            if (W.pathname !== "/callback") {
                P.writeHead(404), P.end();
                return
            }
            let D = W.query.code,
                Z = W.query.state,
                G = W.query.error;
            if (G) {
                let f = W.query.error_description,
                    v = Rz7.default(G),
                    V = f ? Rz7.default(f) : "";
                P.writeHead(400, {
                    "Content-Type": "text/html"
                }), P.end(`<html><body><h3>IdP login failed</h3><p>${v}</p><p>${V}</p></body></html>`), X(Error(`XAA IdP: ${G}${f?` — ${f}`:""}`));
                return
            }
            if (Z !== K) {
                P.writeHead(400, {
                    "Content-Type": "text/html"
                }), P.end("<html><body><h3>State mismatch</h3></body></html>"), X(Error("XAA IdP: state mismatch (possible CSRF)"));
                return
            }
            if (!D) {
                P.writeHead(400, {
                    "Content-Type": "text/html"
                }), P.end("<html><body><h3>Missing code</h3></body></html>"), X(Error("XAA IdP: callback missing code"));
                return
            }
            P.writeHead(200, {
                "Content-Type": "text/html"
            }), P.end("<html><body><h3>IdP login complete — you can close this window.</h3></body></html>"), J(D)
        }), Y.on("error", (M) => {
            if (M.code === "EADDRINUSE") {
                let P = y1() === "windows" ? `netstat -ano | findstr :${q}` : `lsof -ti:${q} -sTCP:LISTEN`;
                X(Error(`XAA IdP: callback port ${q} is already in use. Run \`${P}\` to find the holder.`))
            } else X(Error(`XAA IdP: callback server failed: ${M.message}`))
        }), Y.listen(q, "127.0.0.1", () => {
            try {
                z()
            } catch (M) {
                X(r1(M))
            }
        }), Y.unref(), A = setTimeout((M) => M(Error("XAA IdP: login timed out")), TGY, X), A.unref()
    })
}
// @from(Ln 414668, Col 0)
async function Cl8(q) {
    let {
        idpIssuer: K,
        idpClientId: _
    } = q, z = $P6(K);
    if (z) return i8("xaa", `Using cached id_token for ${K}`), z;
    i8("xaa", `No cached id_token for ${K}; starting OIDC login`);
    let Y = await Sl8(K),
        A = q.callbackPort ?? await yl8(),
        O = s38(A),
        w = fGY(32).toString("base64url"),
        $ = {
            client_id: _,
            ...q.idpClientSecret ? {
                client_secret: q.idpClientSecret
            } : {}
        },
        {
            authorizationUrl: j,
            codeVerifier: H
        } = await sg1(K, {
            metadata: Y,
            clientInformation: $,
            redirectUrl: O,
            scope: "openid",
            state: w
        }),
        J = await kGY(A, w, q.abortSignal, () => {
            if (q.onAuthorizationUrl) q.onAuthorizationUrl(j.toString());
            if (!q.skipBrowserOpen) i8("xaa", "Opening browser to IdP authorization endpoint"), J3(j.toString())
        }),
        X = await IW4(K, {
            metadata: Y,
            clientInformation: $,
            authorizationCode: J,
            codeVerifier: H,
            redirectUri: O,
            fetchFn: (W, D) => fetch(W, {
                ...D,
                signal: AbortSignal.timeout(VhK)
            })
        });
    if (!X.id_token) throw Error("XAA IdP: token response missing id_token (check scope=openid)");
    let M = yhK(X.id_token),
        P = M ? M * 1000 : Date.now() + (X.expires_in ?? 3600) * 1000;
    return khK(K, X.id_token, P), i8("xaa", `Cached id_token for ${K} (expires ${new Date(P).toISOString()})`), X.id_token
}
// @from(Ln 414715, Col 4)
Rz7
// @from(Ln 414715, Col 9)
TGY = 300000
// @from(Ln 414716, Col 4)
VhK = 30000
// @from(Ln 414717, Col 4)
VGY = 60
// @from(Ln 414718, Col 4)
e38 = L(() => {
    Ij6();
    Je6();
    Nj();
    Q8();
    m8();
    U8();
    NK();
    _46();
    a1();
    e8();
    Lz7();
    Rz7 = K6(Ez7(), 1)
})
// @from(Ln 414750, Col 0)
function LhK(q) {
    try {
        let K = new URL(q);
        for (let _ of bGY)
            if (K.searchParams.has(_)) K.searchParams.set(_, "[REDACTED]");
        return K.toString()
    } catch {
        return q
    }
}
// @from(Ln 414760, Col 0)
async function hhK(q) {
    if (!q.ok) return q;
    let K = await q.text(),
        _;
    try {
        _ = n8(K)
    } catch {
        return new Response(K, q)
    }
    if (vR8.safeParse(_).success) return new Response(K, q);
    let z = TR8.safeParse(_);
    if (!z.success) return new Response(K, q);
    let Y = IGY.has(z.data.error) ? {
        error: "invalid_grant",
        error_description: z.data.error_description ?? `Server returned non-standard error code: ${z.data.error}`
    } : z.data;
    return new Response(I6(Y), {
        status: 400,
        statusText: "Bad Request",
        headers: q.headers
    })
}
// @from(Ln 414783, Col 0)
function ShK() {
    return async (q, K) => {
        let _ = AbortSignal.timeout(CGY),
            z = K?.method?.toUpperCase() === "POST";
        if (!K?.signal) {
            let w = await fetch(q, {
                ...K,
                signal: _
            });
            return z ? hhK(w) : w
        }
        let Y = new AbortController,
            A = () => Y.abort();
        K.signal.addEventListener("abort", A), _.addEventListener("abort", A);
        let O = () => {
            K.signal?.removeEventListener("abort", A), _.removeEventListener("abort", A)
        };
        if (K.signal.aborted) Y.abort();
        try {
            let w = await fetch(q, {
                ...K,
                signal: Y.signal
            });
            return O(), z ? hhK(w) : w
        } catch (w) {
            throw O(), w
        }
    }
}
// @from(Ln 414812, Col 0)
async function ml8(q, K, _, z, Y) {
    if (_) {
        if (!_.startsWith("https://")) throw Error(`authServerMetadataUrl must use https:// (got: ${_})`);
        let w = await (z ?? ShK())(_, {
            headers: {
                Accept: "application/json"
            }
        });
        if (w.ok) return He6.parse(await w.json());
        throw Error(`HTTP ${w.status} fetching configured auth server metadata from ${_}`)
    }
    try {
        let {
            authorizationServerMetadata: O
        } = await ag1(K, {
            ...z && {
                fetchFn: z
            },
            ...Y && {
                resourceMetadataUrl: Y
            }
        });
        if (O) return O
    } catch (O) {
        i8(q, `RFC 9728 discovery failed, falling back: ${b6(O)}`)
    }
    let A = new URL(K);
    if (A.pathname === "/") return;
    return bj6(A, {
        ...z && {
            fetchFn: z
        }
    })
}
// @from(Ln 414847, Col 0)
function Bl8(q) {
    return Il8.get(q)
}
// @from(Ln 414851, Col 0)
function pl8(q, K) {
    xl8.set(q, K), K.finally(() => {
        if (xl8.get(q) === K) xl8.delete(q)
    })
}
// @from(Ln 414857, Col 0)
function Fl8(q) {
    return xl8.get(q)
}
// @from(Ln 414861, Col 0)
function IX(q, K) {
    let _ = I6({
            type: K.type,
            url: K.url,
            headers: K.headers || {}
        }),
        z = NGY("sha256").update(_).digest("hex").substring(0, 16);
    return `${q}|${z}`
}
// @from(Ln 414871, Col 0)
function ChK(q, K) {
    if (xe() && K.oauth?.xaa) return !1;
    let _ = IX(q, K),
        z = t3().read()?.mcpOAuth?.[_];
    return z !== void 0 && !z.accessToken && !z.refreshToken && z.discoveryState?.oauthMetadataFound === !0
}
// @from(Ln 414878, Col 0)
function bz7(q, K) {
    let _ = IX(q, K),
        z = t3().read()?.mcpOAuth?.[_];
    if (z && !z.accessToken && !z.refreshToken) K98(q, K)
}
// @from(Ln 414883, Col 0)
async function RhK({
    serverName: q,
    endpoint: K,
    token: _,
    tokenTypeHint: z,
    clientId: Y,
    clientSecret: A,
    accessToken: O,
    authMethod: w = "client_secret_basic"
}) {
    let $ = new URLSearchParams;
    $.set("token", _), $.set("token_type_hint", z);
    let j = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    if (Y && A)
        if (w === "client_secret_post") $.set("client_id", Y), $.set("client_secret", A);
        else {
            let H = Buffer.from(`${encodeURIComponent(Y)}:${encodeURIComponent(A)}`).toString("base64");
            j.Authorization = `Basic ${H}`
        }
    else if (Y) $.set("client_id", Y);
    else i8(q, `No client_id available for ${z} revocation - server may reject`);
    try {
        await Z1.post(K, $, {
            headers: j
        }), i8(q, `Successfully revoked ${z}`)
    } catch (H) {
        if (Z1.isAxiosError(H) && H.response?.status === 401 && O) i8(q, `Got 401, retrying ${z} revocation with Bearer auth`), $.delete("client_id"), $.delete("client_secret"), await Z1.post(K, $, {
            headers: {
                ...j,
                Authorization: `Bearer ${O}`
            }
        }), i8(q, `Successfully revoked ${z} with Bearer auth`);
        else throw H
    }
}
// @from(Ln 414920, Col 0)
async function q98(q, K, {
    preserveStepUpState: _ = !1
} = {}) {
    let z = t3(),
        Y = z.read();
    if (!Y?.mcpOAuth) return;
    let A = IX(q, K),
        O = Y.mcpOAuth[A];
    if (O?.accessToken || O?.refreshToken) try {
        let w = O.discoveryState?.authorizationServerUrl ?? K.url,
            $ = await ml8(q, w, K.oauth?.authServerMetadataUrl);
        if (!$) i8(q, "No OAuth metadata found");
        else {
            let j = "revocation_endpoint" in $ ? $.revocation_endpoint : null;
            if (!j) i8(q, "Server does not support token revocation");
            else {
                let H = String(j),
                    J = ("revocation_endpoint_auth_methods_supported" in $ ? $.revocation_endpoint_auth_methods_supported : void 0) ?? ("token_endpoint_auth_methods_supported" in $ ? $.token_endpoint_auth_methods_supported : void 0),
                    X = J && !J.includes("client_secret_basic") && J.includes("client_secret_post") ? "client_secret_post" : "client_secret_basic";
                if (i8(q, `Revoking tokens via ${H} (${X})`), O.refreshToken) try {
                    await RhK({
                        serverName: q,
                        endpoint: H,
                        token: O.refreshToken,
                        tokenTypeHint: "refresh_token",
                        clientId: O.clientId,
                        clientSecret: O.clientSecret,
                        accessToken: O.accessToken,
                        authMethod: X
                    })
                } catch (M) {
                    i8(q, `Failed to revoke refresh token: ${b6(M)}`)
                }
                if (O.accessToken) try {
                    await RhK({
                        serverName: q,
                        endpoint: H,
                        token: O.accessToken,
                        tokenTypeHint: "access_token",
                        clientId: O.clientId,
                        clientSecret: O.clientSecret,
                        accessToken: O.accessToken,
                        authMethod: X
                    })
                } catch (M) {
                    i8(q, `Failed to revoke access token: ${b6(M)}`)
                }
            }
        }
    } catch (w) {
        i8(q, `Failed to revoke tokens: ${b6(w)}`)
    } else i8(q, "No tokens to revoke");
    if (K98(q, K), _ && O && (O.stepUpScope || O.discoveryState)) {
        let w = z.read() || {},
            $ = {
                ...w,
                mcpOAuth: {
                    ...w.mcpOAuth,
                    [A]: {
                        ...w.mcpOAuth?.[A],
                        serverName: q,
                        serverUrl: K.url,
                        accessToken: w.mcpOAuth?.[A]?.accessToken ?? "",
                        expiresAt: w.mcpOAuth?.[A]?.expiresAt ?? 0,
                        ...O.stepUpScope && {
                            stepUpScope: O.stepUpScope
                        },
                        ...O.discoveryState && {
                            discoveryState: {
                                authorizationServerUrl: O.discoveryState.authorizationServerUrl,
                                resourceMetadataUrl: O.discoveryState.resourceMetadataUrl,
                                oauthMetadataFound: O.discoveryState.oauthMetadataFound
                            }
                        }
                    }
                }
            };
        z.update($), i8(q, "Preserved step-up auth state across revocation")
    }
}
// @from(Ln 415001, Col 0)
function K98(q, K) {
    let _ = t3(),
        z = _.read();
    if (!z?.mcpOAuth) return;
    let Y = IX(q, K);
    if (z.mcpOAuth[Y]) delete z.mcpOAuth[Y], _.update(z), i8(q, "Cleared stored tokens")
}
// @from(Ln 415008, Col 0)
async function xGY(q, K, _, z, Y) {
    if (!K.oauth?.xaa) throw Error("XAA: oauth.xaa must be set");
    let A = Xn();
    if (!A) throw Error("XAA: no IdP connection configured. Run 'claude mcp xaa setup --issuer <url> --client-id <id> --client-secret' to configure.");
    let O = K.oauth?.clientId;
    if (!O) throw Error(`XAA: server '${q}' needs an AS client_id. Re-add with --client-id.`);
    let $ = gl8(q, K)?.clientSecret;
    if (!$) {
        let X = IX(q, K),
            M = Object.keys(t3().read()?.mcpOAuthClientConfig ?? {}),
            P = c0(K.headers ?? {}, (W, D) => D.toLowerCase() === "authorization" ? "[REDACTED]" : W);
        throw i8(q, `XAA: secret lookup miss. wanted=${X} have=[${M.join(", ")}] configHeaders=${I6(P)}`), Error(`XAA: AS client secret not found for '${q}'. Re-add with --client-secret.`)
    }
    i8(q, "XAA: starting cross-app access flow");
    let j = nI6(A.issuer),
        H = $P6(A.issuer) !== void 0,
        J = "idp_login";
    try {
        let X;
        try {
            X = await Cl8({
                idpIssuer: A.issuer,
                idpClientId: A.clientId,
                idpClientSecret: j,
                callbackPort: A.callbackPort,
                onAuthorizationUrl: _,
                skipBrowserOpen: Y,
                abortSignal: z
            })
        } catch (f) {
            if (z?.aborted) throw new Xu;
            throw f
        }
        J = "discovery";
        let M = await Sl8(A.issuer);
        J = "token_exchange";
        let P;
        try {
            P = await hz7(K.url, {
                clientId: O,
                clientSecret: $,
                idpClientId: A.clientId,
                idpClientSecret: j,
                idpIdToken: X,
                idpTokenEndpoint: M.token_endpoint
            }, q, z)
        } catch (f) {
            if (z?.aborted) throw new Xu;
            let v = b6(f);
            if (f instanceof Ie) {
                if (f.shouldClearIdToken) v_6(A.issuer), i8(q, "XAA: cleared cached id_token after token-exchange failure")
            } else if (v.includes("PRM discovery failed") || v.includes("AS metadata discovery failed") || v.includes("no authorization server supports jwt-bearer")) J = "discovery";
            else if (v.includes("jwt-bearer")) J = "jwt_bearer";
            throw f
        }
        let W = t3(),
            D = W.read() || {},
            Z = IX(q, K),
            G = D.mcpOAuth?.[Z];
        W.update({
            ...D,
            mcpOAuth: {
                ...D.mcpOAuth,
                [Z]: {
                    ...G,
                    serverName: q,
                    serverUrl: K.url,
                    accessToken: P.access_token,
                    refreshToken: P.refresh_token ?? G?.refreshToken,
                    expiresAt: Date.now() + (P.expires_in || 3600) * 1000,
                    scope: P.scope,
                    clientId: O,
                    clientSecret: $,
                    discoveryState: {
                        authorizationServerUrl: P.authorizationServerUrl
                    }
                }
            }
        }), i8(q, "XAA: tokens saved"), d("tengu_mcp_oauth_flow_success", {
            authMethod: "xaa",
            idTokenCacheHit: H
        })
    } catch (X) {
        if (X instanceof Xu) throw X;
        throw d("tengu_mcp_oauth_flow_failure", {
            authMethod: "xaa",
            xaaFailureStage: J,
            idTokenCacheHit: H
        }), X
    }
}
// @from(Ln 415099, Col 0)
async function T_6(q, K, _, z, Y) {
    if (K.oauth?.xaa) {
        if (!xe()) throw Error(`XAA is not enabled (set CLAUDE_CODE_ENABLE_XAA=1). Remove 'oauth.xaa' from server '${q}' to use the standard consent flow.`);
        d("tengu_mcp_oauth_flow_start", {
            isOAuthFlow: !0,
            authMethod: "xaa",
            transportType: K.type,
            ...uy(K) && {
                mcpServerBaseUrl: uy(K)
            }
        }), await xGY(q, K, _, z, Y?.skipBrowserOpen);
        return
    }
    let A = t3(),
        O = IX(q, K),
        w = A.read()?.mcpOAuth?.[O],
        $ = w?.stepUpScope,
        j = w?.discoveryState?.resourceMetadataUrl;
    K98(q, K);
    let H;
    if (j) try {
        H = new URL(j)
    } catch {
        i8(q, `Invalid cached resourceMetadataUrl: ${j}`)
    }
    let J = {
            scope: $,
            resourceMetadataUrl: H
        },
        X = yGY();
    d("tengu_mcp_oauth_flow_start", {
        flowAttemptId: X,
        isOAuthFlow: !0,
        transportType: K.type,
        ...uy(K) && {
            mcpServerBaseUrl: uy(K)
        }
    });
    let M = !1;
    try {
        let P = K.oauth?.callbackPort,
            W = P ?? await yl8(),
            D = s38(W);
        i8(q, `Using redirect port: ${W}${P?" (from config)":""}`), bl8.get(W)?.abort();
        let Z = new AbortController;
        bl8.set(W, Z);
        let G = new jP6(q, K, D, !0, _, Y?.skipBrowserOpen),
            f = Boolean(K.oauth?.scopes || K.oauth?.authServerMetadataUrl);
        if (J.scope && !f) G.markStepUpPending(J.scope);
        try {
            let B = await ml8(q, K.url, K.oauth?.authServerMetadataUrl, void 0, J.resourceMetadataUrl);
            if (B) G.setMetadata(B), i8(q, `Fetched OAuth metadata with scope: ${ul8(B)||"NONE"}`)
        } catch (B) {
            i8(q, `Failed to fetch OAuth metadata: ${b6(B)}`)
        }
        let v = await G.state(),
            V = null,
            k = null,
            N = null,
            R = null,
            h = () => {
                if (V) V.removeAllListeners(), V.on("error", () => {}), V.close(), V = null;
                if (k) clearTimeout(k), k = null;
                if (N) z?.removeEventListener("abort", N), Z.signal.removeEventListener("abort", N), N = null;
                if (bl8.get(W) === Z) bl8.delete(W);
                if (Il8.get(q) === R) Il8.delete(q);
                i8(q, "MCP OAuth server cleaned up")
            },
            C = await new Promise((B, m) => {
                let S = !1,
                    F = (g) => {
                        if (S) return;
                        S = !0, B(g)
                    },
                    U = (g) => {
                        if (S) return;
                        S = !0, m(g)
                    };
                if (N = () => {
                        h(), U(new Xu)
                    }, z?.aborted || Z.signal.aborted) {
                    N();
                    return
                }
                z?.addEventListener("abort", N), Z.signal.addEventListener("abort", N);
                {
                    let g = (c) => {
                        try {
                            let n = new URL(c),
                                l = n.searchParams.get("code"),
                                z6 = n.searchParams.get("state"),
                                A6 = n.searchParams.get("error");
                            if (A6) {
                                let e = n.searchParams.get("error_description") || "";
                                h(), U(Error(`OAuth error: ${A6} - ${e}`));
                                return
                            }
                            if (!l) return;
                            if (z6 !== v) {
                                h(), U(Error("OAuth state mismatch - possible CSRF attack"));
                                return
                            }
                            i8(q, "Received auth code via manual callback URL"), h(), F(l)
                        } catch {}
                    };
                    R = g, Il8.set(q, g), Y?.onWaitingForCallback?.(g)
                }
                V = hGY((g, c) => {
                    let n = SGY(g.url || "", !0);
                    if (n.pathname === "/callback") {
                        let l = n.query.code,
                            z6 = n.query.state,
                            A6 = n.query.error,
                            e = n.query.error_description,
                            i = n.query.error_uri;
                        if (!A6 && z6 !== v) {
                            c.writeHead(400, {
                                "Content-Type": "text/html"
                            }), c.end("<h1>Authentication Error</h1><p>Invalid state parameter. Please try again.</p><p>You can close this window.</p>"), h(), U(Error("OAuth state mismatch - possible CSRF attack"));
                            return
                        }
                        if (A6) {
                            c.writeHead(200, {
                                "Content-Type": "text/html"
                            });
                            let O6 = Cz7.default(String(A6)),
                                J6 = e ? Cz7.default(String(e)) : "";
                            c.end(`<h1>Authentication Error</h1><p>${O6}: ${J6}</p><p>You can close this window.</p>`), h();
                            let $6 = `OAuth error: ${A6}`;
                            if (e) $6 += ` - ${e}`;
                            if (i) $6 += ` (See: ${i})`;
                            U(Error($6));
                            return
                        }
                        if (l) c.writeHead(200, {
                            "Content-Type": "text/html"
                        }), c.end("<h1>Authentication Successful</h1><p>You can close this window. Return to Claude Code.</p>"), h(), F(l)
                    }
                }), V.on("error", (g) => {
                    if (h(), g.code === "EADDRINUSE") {
                        let c = y1() === "windows" ? `netstat -ano | findstr :${W}` : `lsof -ti:${W} -sTCP:LISTEN`;
                        U(Error(`OAuth callback port ${W} is already in use — another process may be holding it. ` + `Run \`${c}\` to find it.`))
                    } else U(Error(`OAuth callback server failed: ${g.message}`))
                }), V.listen(W, "127.0.0.1", async () => {
                    try {
                        i8(q, "Starting SDK auth"), i8(q, `Server URL: ${K.url}`);
                        let g = await lI(G, {
                            serverUrl: K.url,
                            scope: J.scope,
                            resourceMetadataUrl: J.resourceMetadataUrl
                        });
                        if (i8(q, `Initial auth result: ${g}`), g !== "REDIRECT") i8(q, `Unexpected auth result, expected REDIRECT: ${g}`)
                    } catch (g) {
                        i8(q, `SDK auth error: ${g}`), h(), U(Error(`SDK auth failed: ${b6(g)}`))
                    }
                }), V.unref(), k = setTimeout((g, c) => {
                    g(), c(Error("Authentication timeout"))
                }, 300000, h, U), k.unref()
            });
        M = !0, i8(q, "Completing auth flow with authorization code");
        let x = await lI(G, {
            serverUrl: K.url,
            authorizationCode: C,
            resourceMetadataUrl: J.resourceMetadataUrl
        });
        if (i8(q, `Auth result: ${x}`), x === "AUTHORIZED") {
            let B = await G.tokens();
            if (i8(q, `Tokens after auth: ${B?"Present":"Missing"}`), B) i8(q, `Token access_token length: ${B.access_token?.length}`), i8(q, `Token expires_in: ${B.expires_in}`);
            d("tengu_mcp_oauth_flow_success", {
                flowAttemptId: X,
                transportType: K.type,
                ...uy(K) && {
                    mcpServerBaseUrl: uy(K)
                }
            })
        } else throw Error("Unexpected auth result: " + x)
    } catch (P) {
        i8(q, `Error during auth completion: ${P}`);
        let W = "unknown",
            D, Z;
        if (P instanceof Xu) W = "cancelled";
        else if (M) W = "token_exchange_failed";
        else {
            let G = b6(P);
            if (G.includes("Authentication timeout")) W = "timeout";
            else if (G.includes("OAuth state mismatch")) W = "state_mismatch";
            else if (G.includes("OAuth error:")) W = "provider_denied";
            else if (G.includes("already in use") || G.includes("EADDRINUSE") || G.includes("callback server failed") || G.includes("No available port")) W = "port_unavailable";
            else if (G.includes("SDK auth failed")) W = "sdk_auth_failed"
        }
        if (P instanceof XX) {
            D = P.errorCode;
            let G = P.message.match(/^HTTP (\d{3}):/);
            if (G) Z = Number(G[1]);
            if (P.errorCode === "invalid_client" && P.message.includes("Client not found")) {
                let f = t3(),
                    v = f.read() || {},
                    V = IX(q, K);
                if (v.mcpOAuth?.[V]) delete v.mcpOAuth[V].clientId, delete v.mcpOAuth[V].clientSecret, f.update(v)
            }
        }
        throw d("tengu_mcp_oauth_flow_error", {
            flowAttemptId: X,
            reason: W,
            error_code: D,
            http_status: Z?.toString(),
            transportType: K.type,
            ...uy(K) && {
                mcpServerBaseUrl: uy(K)
            }
        }), P
    }
}
// @from(Ln 415313, Col 0)
function Iz7(q, K) {
    return async (_, z) => {
        let Y = await q(_, z);
        if (Y.status === 403) {
            let A = Y.headers.get("WWW-Authenticate");
            if (A?.includes("insufficient_scope")) {
                let O = A.match(/scope=(?:"([^"]+)"|([^\s,]+))/),
                    w = O?.[1] ?? O?.[2];
                if (w) K.markStepUpPending(w)
            }
        }
        return Y
    }
}
// @from(Ln 415327, Col 0)
class jP6 {
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
    _pendingStepUpScope;
    onAuthorizationUrlCallback;
    skipBrowserOpen;
    constructor(q, K, _ = s38(), z = !1, Y, A) {
        this.serverName = q, this.serverConfig = K, this.redirectUri = _, this.handleRedirection = z, this.onAuthorizationUrlCallback = Y, this.skipBrowserOpen = A ?? !1
    }
    get redirectUrl() {
        return this.redirectUri
    }
    get authorizationUrl() {
        return this._authorizationUrl
    }
    get clientMetadata() {
        let q = {
                client_name: `Claude Code (${this.serverName})`,
                redirect_uris: [this.redirectUri],
                grant_types: ["authorization_code", "refresh_token"],
                response_types: ["code"],
                token_endpoint_auth_method: "none"
            },
            K = ul8(this._metadata);
        if (K) q.scope = K, i8(this.serverName, `Using scope from metadata: ${q.scope}`);
        return q
    }
    get clientMetadataUrl() {
        let q = process.env.MCP_OAUTH_CLIENT_METADATA_URL;
        if (q) return i8(this.serverName, `Using CIMD URL from env: ${q}`), q;
        return OY1
    }
    setMetadata(q) {
        this._metadata = q
    }
    markStepUpPending(q) {
        this._pendingStepUpScope = q, i8(this.serverName, `Marked step-up pending: ${q}`)
    }
    async state() {
        if (!this._state) this._state = EGY(32).toString("base64url"), i8(this.serverName, "Generated new OAuth state");
        return this._state
    }
    async clientInformation() {
        let K = t3().read(),
            _ = IX(this.serverName, this.serverConfig),
            z = K?.mcpOAuth?.[_];
        if (z?.clientId) return i8(this.serverName, "Found client info"), {
            client_id: z.clientId,
            client_secret: z.clientSecret
        };
        let Y = this.serverConfig.oauth?.clientId;
        if (Y) {
            let A = K?.mcpOAuthClientConfig?.[_];
            return i8(this.serverName, "Using pre-configured client ID"), {
                client_id: Y,
                client_secret: A?.clientSecret
            }
        }
        i8(this.serverName, "No client info found");
        return
    }
    async saveClientInformation(q) {
        let K = t3(),
            _ = K.read() || {},
            z = IX(this.serverName, this.serverConfig),
            Y = {
                ..._,
                mcpOAuth: {
                    ..._.mcpOAuth,
                    [z]: {
                        ..._.mcpOAuth?.[z],
                        serverName: this.serverName,
                        serverUrl: this.serverConfig.url,
                        clientId: q.client_id,
                        clientSecret: q.client_secret,
                        accessToken: _.mcpOAuth?.[z]?.accessToken || "",
                        expiresAt: _.mcpOAuth?.[z]?.expiresAt || 0
                    }
                }
            };
        K.update(Y)
    }
    async tokens() {
        let K = await t3().readAsync(),
            _ = IX(this.serverName, this.serverConfig),
            z = K?.mcpOAuth?.[_];
        if (xe() && this.serverConfig.oauth?.xaa && !z?.refreshToken && (!z?.accessToken || (z.expiresAt - Date.now()) / 1000 <= 300)) {
            if (!this._refreshInProgress) i8(this.serverName, z ? "XAA: access_token expiring, attempting silent exchange" : "XAA: no access_token yet, attempting silent exchange"), this._refreshInProgress = this.xaaRefresh().finally(() => {
                this._refreshInProgress = void 0
            });
            try {
                let $ = await this._refreshInProgress;
                if ($) return $
            } catch ($) {
                i8(this.serverName, `XAA silent exchange failed: ${b6($)}`)
            }
        }
        if (!z) {
            i8(this.serverName, "No token data found");
            return
        }
        let Y = (z.expiresAt - Date.now()) / 1000,
            A = z.scope?.split(" ") ?? [],
            O = this._pendingStepUpScope !== void 0 && this._pendingStepUpScope.split(" ").some(($) => !A.includes($));
        if (O) i8(this.serverName, `Step-up pending (${this._pendingStepUpScope}), omitting refresh_token`);
        if (Y <= 0 && !z.refreshToken) {
            i8(this.serverName, "Token expired without refresh token");
            return
        }
        if (Y <= 300 && z.refreshToken && !O) {
            if (!this._refreshInProgress) i8(this.serverName, `Token expires in ${Math.floor(Y)}s, attempting proactive refresh`), this._refreshInProgress = this.refreshAuthorization(z.refreshToken).finally(() => {
                this._refreshInProgress = void 0
            });
            else i8(this.serverName, "Token refresh already in progress, reusing existing promise");
            try {
                let $ = await this._refreshInProgress;
                if ($) return i8(this.serverName, "Token refreshed successfully"), $;
                i8(this.serverName, "Token refresh failed, returning current tokens")
            } catch ($) {
                i8(this.serverName, `Token refresh error: ${b6($)}`)
            }
        }
        let w = {
            access_token: z.accessToken,
            refresh_token: O ? void 0 : z.refreshToken,
            expires_in: Y,
            scope: z.scope,
            token_type: "Bearer"
        };
        return i8(this.serverName, "Returning tokens"), i8(this.serverName, `Token length: ${w.access_token?.length}`), i8(this.serverName, `Has refresh token: ${!!w.refresh_token}`), i8(this.serverName, `Expires in: ${Math.floor(Y)}s`), w
    }
    async saveTokens(q) {
        this._pendingStepUpScope = void 0;
        let K = t3(),
            _ = K.read() || {},
            z = IX(this.serverName, this.serverConfig);
        i8(this.serverName, "Saving tokens"), i8(this.serverName, `Token expires in: ${q.expires_in}`), i8(this.serverName, `Has refresh token: ${!!q.refresh_token}`);
        let Y = {
            ..._,
            mcpOAuth: {
                ..._.mcpOAuth,
                [z]: {
                    ..._.mcpOAuth?.[z],
                    serverName: this.serverName,
                    serverUrl: this.serverConfig.url,
                    accessToken: q.access_token,
                    refreshToken: q.refresh_token,
                    expiresAt: Date.now() + (q.expires_in || 3600) * 1000,
                    scope: q.scope
                }
            }
        };
        K.update(Y)
    }
    async xaaRefresh() {
        let q = Xn();
        if (!q) return;
        let K = $P6(q.issuer);
        if (!K) {
            i8(this.serverName, "XAA: id_token not cached, needs interactive re-auth");
            return
        }
        let _ = this.serverConfig.oauth?.clientId,
            z = gl8(this.serverName, this.serverConfig);
        if (!_ || !z?.clientSecret) {
            i8(this.serverName, "XAA: missing clientId or clientSecret in config — skipping silent refresh");
            return
        }
        let Y = nI6(q.issuer),
            A;
        try {
            A = await Sl8(q.issuer)
        } catch (O) {
            i8(this.serverName, `XAA: OIDC discovery failed in silent refresh: ${b6(O)}`);
            return
        }
        try {
            let O = await hz7(this.serverConfig.url, {
                    clientId: _,
                    clientSecret: z.clientSecret,
                    idpClientId: q.clientId,
                    idpClientSecret: Y,
                    idpIdToken: K,
                    idpTokenEndpoint: A.token_endpoint
                }, this.serverName),
                w = t3(),
                $ = w.read() || {},
                j = IX(this.serverName, this.serverConfig),
                H = $.mcpOAuth?.[j];
            return w.update({
                ...$,
                mcpOAuth: {
                    ...$.mcpOAuth,
                    [j]: {
                        ...H,
                        serverName: this.serverName,
                        serverUrl: this.serverConfig.url,
                        accessToken: O.access_token,
                        refreshToken: O.refresh_token ?? H?.refreshToken,
                        expiresAt: Date.now() + (O.expires_in || 3600) * 1000,
                        scope: O.scope,
                        clientId: _,
                        clientSecret: z.clientSecret,
                        discoveryState: {
                            authorizationServerUrl: O.authorizationServerUrl
                        }
                    }
                }
            }), {
                access_token: O.access_token,
                token_type: "Bearer",
                expires_in: O.expires_in,
                scope: O.scope,
                refresh_token: O.refresh_token
            }
        } catch (O) {
            if (O instanceof Ie && O.shouldClearIdToken) v_6(q.issuer), i8(this.serverName, "XAA: cleared id_token after exchange failure");
            throw O
        }
    }
    async redirectToAuthorization(q) {
        let K = this._pendingStepUpScope ? void 0 : this.serverConfig.oauth?.scopes || (this.serverConfig.oauth?.authServerMetadataUrl ? ul8(this._metadata) : void 0),
            _ = q.searchParams.get("scope"),
            z = K ?? _;
        if (z !== _) i8(this.serverName, `Overrode authorization scope from ${_||"NONE"} to configured: ${z}`);
        let Y = uGY(z, this._metadata);
        if (Y !== null && Y !== _) {
            if (q.searchParams.set("scope", Y), Y !== K) i8(this.serverName, "Appended offline_access to authorization scope")
        }
        this._authorizationUrl = q.toString();
        let A = q.searchParams.get("scope");
        if (i8(this.serverName, `Authorization URL: ${LhK(q.toString())}`), i8(this.serverName, `Scopes in URL: ${A||"NOT FOUND"}`), A) this._scopes = A, i8(this.serverName, `Captured scopes from authorization URL: ${A}`);
        else {
            let $ = ul8(this._metadata);
            if ($) this._scopes = $, i8(this.serverName, `Using scopes from metadata: ${$}`);
            else i8(this.serverName, "No scopes available from URL or metadata")
        }
        if (this._scopes && !this.handleRedirection && this._pendingStepUpScope) {
            let $ = t3(),
                j = $.read() || {},
                H = IX(this.serverName, this.serverConfig),
                J = j.mcpOAuth?.[H];
            if (J) J.stepUpScope = this._scopes, $.update(j), i8(this.serverName, `Persisted step-up scope: ${this._scopes}`)
        }
        if (!this.handleRedirection) {
            i8(this.serverName, "Redirection handling is disabled, skipping redirect");
            return
        }
        let O = q.toString();
        if (!O.startsWith("http://") && !O.startsWith("https://")) throw Error("Invalid authorization URL: must use http:// or https:// scheme");
        i8(this.serverName, "Redirecting to authorization URL");
        let w = LhK(O);
        if (i8(this.serverName, `Authorization URL: ${w}`), this.onAuthorizationUrlCallback) this.onAuthorizationUrlCallback(O);
        if (!this.skipBrowserOpen) {
            if (i8(this.serverName, `Opening authorization URL: ${w}`), !await J3(O)) i8(this.serverName, "Browser didn't open automatically. URL is shown in UI.")
        } else i8(this.serverName, `Skipping browser open (skipBrowserOpen=true). URL: ${w}`)
    }
    async saveCodeVerifier(q) {
        i8(this.serverName, "Saving code verifier"), this._codeVerifier = q
    }
    async codeVerifier() {
        if (!this._codeVerifier) throw i8(this.serverName, "No code verifier saved"), Error("No code verifier saved");
        return i8(this.serverName, "Returning code verifier"), this._codeVerifier
    }
    async invalidateCredentials(q) {
        let K = t3(),
            _ = K.read();
        if (!_?.mcpOAuth) return;
        let z = IX(this.serverName, this.serverConfig),
            Y = _.mcpOAuth[z];
        if (!Y) return;
        switch (q) {
            case "all":
                delete _.mcpOAuth[z];
                break;
            case "client":
                Y.clientId = void 0, Y.clientSecret = void 0;
                break;
            case "tokens":
                Y.accessToken = "", Y.refreshToken = void 0, Y.expiresAt = 0;
                break;
            case "verifier":
                this._codeVerifier = void 0;
                return;
            case "discovery":
                Y.discoveryState = void 0, Y.stepUpScope = void 0;
                break
        }
        K.update(_), i8(this.serverName, `Invalidated credentials (scope: ${q})`)
    }
    async saveDiscoveryState(q) {
        let K = t3(),
            _ = K.read() || {},
            z = IX(this.serverName, this.serverConfig);
        i8(this.serverName, `Saving discovery state (authServer: ${q.authorizationServerUrl})`);
        let Y = {
            ..._,
            mcpOAuth: {
                ..._.mcpOAuth,
                [z]: {
                    ..._.mcpOAuth?.[z],
                    serverName: this.serverName,
                    serverUrl: this.serverConfig.url,
                    accessToken: _.mcpOAuth?.[z]?.accessToken || "",
                    expiresAt: _.mcpOAuth?.[z]?.expiresAt || 0,
                    discoveryState: {
                        authorizationServerUrl: q.authorizationServerUrl,
                        resourceMetadataUrl: q.resourceMetadataUrl,
                        oauthMetadataFound: !!q.authorizationServerMetadata
                    }
                }
            }
        };
        K.update(Y)
    }
    async discoveryState() {
        let q = this.serverConfig.oauth?.authServerMetadataUrl;
        if (q) {
            i8(this.serverName, `Fetching metadata from configured URL: ${q}`);
            try {
                let A = await ml8(this.serverName, this.serverConfig.url, q);
                if (A) return {
                    authorizationServerUrl: A.issuer,
                    authorizationServerMetadata: A
                }
            } catch (A) {
                i8(this.serverName, `Failed to fetch from configured metadata URL: ${b6(A)}`)
            }
            return
        }
        let _ = t3().read(),
            z = IX(this.serverName, this.serverConfig),
            Y = _?.mcpOAuth?.[z]?.discoveryState;
        if (Y?.authorizationServerUrl) return i8(this.serverName, `Returning cached discovery state (authServer: ${Y.authorizationServerUrl})`), {
            authorizationServerUrl: Y.authorizationServerUrl,
            resourceMetadataUrl: Y.resourceMetadataUrl,
            resourceMetadata: Y.resourceMetadata,
            authorizationServerMetadata: Y.authorizationServerMetadata
        };
        return
    }
    async refreshAuthorization(q) {
        let K = IX(this.serverName, this.serverConfig),
            _ = A7();
        await LGY(_, {
            recursive: !0
        });
        let z = K.replace(/[^a-zA-Z0-9]/g, "_"),
            Y = RGY(_, `mcp-refresh-${z}.lock`),
            A;
        for (let O = 0; O < Sz7; O++) try {
            i8(this.serverName, `Acquiring refresh lock (attempt ${O+1})`), A = await Jj(Y, {
                realpath: !1,
                onCompromised: () => {
                    i8(this.serverName, "Refresh lock was compromised")
                }
            }), i8(this.serverName, "Acquired refresh lock");
            break
        } catch (w) {
            let $ = Q1(w);
            if ($ === "ELOCKED") {
                i8(this.serverName, `Refresh lock held by another process, waiting (attempt ${O+1}/${Sz7})`), await l7(1000 + Math.random() * 1000);
                continue
            }
            i8(this.serverName, `Failed to acquire refresh lock: ${$}, proceeding without lock`);
            break
        }
        if (!A) i8(this.serverName, `Could not acquire refresh lock after ${Sz7} retries, proceeding without lock`);
        try {
            TE();
            let $ = t3().read()?.mcpOAuth?.[K];
            if ($) {
                let j = ($.expiresAt - Date.now()) / 1000;
                if (j > 300) return i8(this.serverName, `Another process already refreshed tokens (expires in ${Math.floor(j)}s)`), {
                    access_token: $.accessToken,
                    refresh_token: $.refreshToken,
                    expires_in: j,
                    scope: $.scope,
                    token_type: "Bearer"
                };
                if ($.refreshToken) q = $.refreshToken
            }
            return await this._doRefresh(q)
        } finally {
            if (A) try {
                await A(), i8(this.serverName, "Released refresh lock")
            } catch {
                i8(this.serverName, "Failed to release refresh lock")
            }
        }
    }
    async _doRefresh(q) {
        let _ = uy(this.serverConfig),
            z = (Y, A) => {
                d(Y === "success" ? "tengu_mcp_oauth_refresh_success" : "tengu_mcp_oauth_refresh_failure", {
                    transportType: this.serverConfig.type,
                    ..._ && {
                        mcpServerBaseUrl: _
                    },
                    ...A && {
                        reason: A
                    }
                })
            };
        for (let Y = 1; Y <= 3; Y++) try {
            i8(this.serverName, "Starting token refresh");
            let A = ShK(),
                O = this._metadata;
            if (!O) {
                let j = await this.discoveryState();
                if (j?.authorizationServerMetadata) O = j.authorizationServerMetadata;
                else if (j?.authorizationServerUrl) i8(this.serverName, `Re-discovering metadata from persisted auth server URL: ${j.authorizationServerUrl}`), O = await bj6(j.authorizationServerUrl, {
                    fetchFn: A
                })
            }
            if (!O) O = await ml8(this.serverName, this.serverConfig.url, this.serverConfig.oauth?.authServerMetadataUrl, A);
            if (!O) {
                i8(this.serverName, "Failed to discover OAuth metadata"), z("failure", "metadata_discovery_failed");
                return
            }
            this._metadata = O;
            let w = await this.clientInformation();
            if (!w) {
                i8(this.serverName, "No client information available"), z("failure", "no_client_info");
                return
            }
            let $ = await eg1(new URL(this.serverConfig.url), {
                metadata: O,
                clientInformation: w,
                refreshToken: q,
                resource: new URL(this.serverConfig.url),
                fetchFn: A
            });
            if ($) return i8(this.serverName, "Token refresh successful"), await this.saveTokens($), z("success"), $;
            i8(this.serverName, "Token refresh returned no tokens"), z("failure", "no_tokens_returned");
            return
        } catch (A) {
            if (A instanceof RK6) {
                i8(this.serverName, `Token refresh failed with invalid_grant: ${A.message}`), TE();
                let J = t3().read(),
                    X = IX(this.serverName, this.serverConfig),
                    M = J?.mcpOAuth?.[X];
                if (M) {
                    let P = (M.expiresAt - Date.now()) / 1000;
                    if (P > 300) return i8(this.serverName, "Another process refreshed tokens, using those"), {
                        access_token: M.accessToken,
                        refresh_token: M.refreshToken,
                        expires_in: P,
                        scope: M.scope,
                        token_type: "Bearer"
                    }
                }
                i8(this.serverName, "No valid tokens in storage, clearing stored tokens"), await this.invalidateCredentials("tokens"), z("failure", "invalid_grant");
                return
            }
            let O = A instanceof Error && /timeout|timed out|etimedout|econnreset/i.test(A.message),
                w = A instanceof ed || A instanceof by6 || A instanceof Iy6,
                $ = O || w;
            if (!$ || Y >= 3) {
                i8(this.serverName, `Token refresh failed: ${b6(A)}`), z("failure", $ ? "transient_retries_exhausted" : "request_failed");
                return
            }
            let j = 1000 * Math.pow(2, Y - 1);
            i8(this.serverName, `Token refresh failed, retrying in ${j}ms (attempt ${Y}/3)`), await l7(j)
        }
        return
    }
}
// @from(Ln 415803, Col 0)
async function _98() {
    let q = process.env.MCP_CLIENT_SECRET;
    if (q) return q;
    if (!process.stdin.isTTY) throw Error("No TTY available to prompt for client secret. Set MCP_CLIENT_SECRET env var instead.");
    return new Promise((K, _) => {
        process.stderr.write("Enter OAuth client secret: "), process.stdin.setRawMode?.(!0);
        let z = "",
            Y = (A) => {
                let O = A.toString();
                if (O === `
` || O === "\r") process.stdin.setRawMode?.(!1), process.stdin.removeListener("data", Y), process.stderr.write(`
`), K(z);
                else if (O === "\x03") process.stdin.setRawMode?.(!1), process.stdin.removeListener("data", Y), _(Error("Cancelled"));
                else if (O === "" || O === "\b") z = z.slice(0, -1);
                else z += O
            };
        process.stdin.on("data", Y)
    })
}
// @from(Ln 415823, Col 0)
function z98(q, K, _) {
    let z = t3(),
        Y = z.read() || {},
        A = IX(q, K);
    z.update({
        ...Y,
        mcpOAuthClientConfig: {
            ...Y.mcpOAuthClientConfig,
            [A]: {
                clientSecret: _
            }
        }
    })
}
// @from(Ln 415838, Col 0)
function bhK(q, K) {
    let _ = t3(),
        z = _.read();
    if (!z?.mcpOAuthClientConfig) return;
    let Y = IX(q, K);
    if (z.mcpOAuthClientConfig[Y]) delete z.mcpOAuthClientConfig[Y], _.update(z)
}
// @from(Ln 415846, Col 0)
function gl8(q, K) {
    let z = t3().read(),
        Y = IX(q, K);
    return z?.mcpOAuthClientConfig?.[Y]
}