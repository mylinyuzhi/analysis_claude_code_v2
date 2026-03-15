
// @from(Ln 233487, Col 0)
function eu9() {
    if (b34 = !0, I36) I36.close(), I36 = null;
    Op6.clear()
}
// @from(Ln 233492, Col 0)
function g34(A) {
    return Op6.add(A), () => {
        Op6.delete(A)
    }
}
// @from(Ln 233497, Col 0)
async function I34(A) {
    k(`[keybindings] Detected change to ${A}`);
    try {
        let q = await tu9();
        Y0 = q.bindings, _Z = q.warnings, Op6.forEach((K) => K(q))
    } catch (q) {
        k(`[keybindings] Error reloading: ${_1(q)}`)
    }
}
// @from(Ln 233507, Col 0)
function Am9(A) {
    k(`[keybindings] Detected deletion of ${A}`);
    let q = rN8();
    Y0 = q, _Z = [], Op6.forEach((K) => K({
        bindings: q,
        warnings: []
    }))
}
// @from(Ln 233516, Col 0)
function F34() {
    return _Z
}
// @from(Ln 233519, Col 4)
ru9 = 500
// @from(Ln 233520, Col 4)
ou9 = 200
// @from(Ln 233521, Col 4)
I36 = null
// @from(Ln 233522, Col 4)
S34 = !1
// @from(Ln 233523, Col 4)
b34 = !1
// @from(Ln 233524, Col 4)
Y0 = null
// @from(Ln 233525, Col 4)
_Z
// @from(Ln 233525, Col 8)
Op6
// @from(Ln 233525, Col 13)
C34 = null
// @from(Ln 233526, Col 4)
cd = E(() => {
    F46();
    A8();
    H1();
    KY();
    g1();
    HA();
    V1();
    fP1();
    h34();
    s8();
    _Z = [], Op6 = new Set
})
// @from(Ln 233540, Col 0)
function PX(A, q, K) {
    let Y = m34(),
        z = P$1(A, q, Y);
    if (z === void 0) {
        let _ = `${A}:${q}`;
        if (!p34.has(_)) p34.add(_), d("tengu_keybinding_fallback_used", {
            action: A,
            context: q,
            fallback: K,
            reason: "action_not_found"
        });
        return K
    }
    return z
}
// @from(Ln 233555, Col 4)
p34
// @from(Ln 233556, Col 4)
ld = E(() => {
    cd();
    Uu6();
    V1();
    p34 = new Set
})
// @from(Ln 233563, Col 0)
function Hp6(A) {
    let q = A6(2),
        {
            children: K
        } = A,
        Y;
    if (q[0] !== K) Y = x36.default.createElement(Q34.Provider, {
        value: !0
    }, K), q[0] = K, q[1] = Y;
    else Y = q[1];
    return Y
}
// @from(Ln 233576, Col 0)
function oJ() {
    let A = A6(2),
        q = x36.useContext(Q34),
        K = Rq("app:toggleTranscript", "Global", "ctrl+o");
    if (q) return null;
    let Y;
    if (A[0] !== K) Y = x36.default.createElement(T, {
        dimColor: !0
    }, x36.default.createElement(a1, {
        shortcut: K,
        action: "expand",
        parens: !0
    })), A[0] = K, A[1] = Y;
    else Y = A[1];
    return Y
}
// @from(Ln 233593, Col 0)
function U34() {
    let A = PX("app:toggleTranscript", "Global", "ctrl+o");
    return O1.dim(`(${A} to expand)`)
}
// @from(Ln 233597, Col 4)
x36
// @from(Ln 233597, Col 9)
Q34
// @from(Ln 233598, Col 4)
GR = E(() => {
    e6();
    i6();
    aK();
    Lq();
    Rj();
    ld();
    x36 = t(P6(), 1), Q34 = x36.default.createContext(!1)
})
// @from(Ln 233607, Col 0)
async function d34(A) {
    if (A.startsWith(`<${WP}>`)) return null;
    try {
        let K = (await WX({
                systemPrompt: uq(["Analyze if this message indicates a new conversation topic. If it does, extract a 2-3 word title that captures the new topic. Format your response as a JSON object with two fields: 'isNewTopic' (boolean) and 'title' (string, or null if isNewTopic is false)."]),
                userPrompt: A,
                outputFormat: {
                    type: "json_schema",
                    schema: {
                        type: "object",
                        properties: {
                            isNewTopic: {
                                type: "boolean"
                            },
                            title: {
                                anyOf: [{
                                    type: "string"
                                }, {
                                    type: "null"
                                }]
                            }
                        },
                        required: ["isNewTopic", "title"],
                        additionalProperties: !1
                    }
                },
                signal: new AbortController().signal,
                options: {
                    querySource: "terminal_update_title",
                    agents: [],
                    isNonInteractiveSession: !1,
                    hasAppendSystemPrompt: !1,
                    mcpTools: []
                }
            })).message.content.filter((z) => z.type === "text").map((z) => z.text).join(""),
            Y = WK(K);
        if (Y && typeof Y === "object" && "isNewTopic" in Y && "title" in Y && Y.isNewTopic && typeof Y.title === "string") return Y.title
    } catch (q) {
        _6(q)
    }
    return null
}
// @from(Ln 233650, Col 0)
function Km9(A, q) {
    let K = A.split(`
`),
        Y = [];
    for (let _ of K) {
        let w = f8(_);
        if (w <= q) Y.push(_.trimEnd());
        else {
            let O = 0;
            while (O < w) {
                let $ = Xk(_, O, O + q);
                Y.push($.trimEnd()), O += q
            }
        }
    }
    let z = Y.length - jp6;
    if (z === 1) return {
        aboveTheFold: Y.slice(0, jp6 + 1).join(`
`).trimEnd(),
        remainingLines: 0
    };
    return {
        aboveTheFold: Y.slice(0, jp6).join(`
`).trimEnd(),
        remainingLines: Math.max(0, z)
    }
}
// @from(Ln 233678, Col 0)
function c34(A, q) {
    let K = A.trimEnd();
    if (!K) return "";
    let Y = Math.max(q - qm9, 10),
        z = jp6 * Y * 4,
        _ = K.length > z,
        w = _ ? K.slice(0, z) : K,
        {
            aboveTheFold: O,
            remainingLines: $
        } = Km9(w, Y),
        H = _ ? Math.max($, Math.ceil(K.length / Y) - jp6) : $;
    return [O, H > 0 ? O1.dim(`… +${H} lines ${U34()}`) : ""].filter(Boolean).join(`
`)
}
// @from(Ln 233693, Col 4)
jp6 = 3
// @from(Ln 233694, Col 4)
qm9 = 10
// @from(Ln 233695, Col 4)
oN8 = E(() => {
    gw();
    K_();
    k1();
    aK();
    GR();
    vz();
    XX6();
    q3()
})
// @from(Ln 233706, Col 0)
function n34(A) {
    let q = A6(2),
        {
            children: K
        } = A,
        Y;
    if (q[0] !== K) Y = Jp6.createElement(i34.Provider, {
        value: !0
    }, K), q[0] = K, q[1] = Y;
    else Y = q[1];
    return Y
}
// @from(Ln 233719, Col 0)
function r34() {
    return l34.useContext(i34)
}
// @from(Ln 233722, Col 4)
Jp6
// @from(Ln 233722, Col 9)
l34
// @from(Ln 233722, Col 14)
i34
// @from(Ln 233723, Col 4)
aN8 = E(() => {
    e6();
    Jp6 = t(P6(), 1), l34 = t(P6(), 1), i34 = Jp6.createContext(!1)
})
// @from(Ln 233728, Col 0)
function PW6(A, q, K) {
    if (!(K?.supportsHyperlinks ?? cG())) return A;
    let z = q ?? A,
        _ = O1.blue(z);
    return `${o34}${A}${a34}${_}${o34}${a34}`
}
// @from(Ln 233734, Col 4)
o34 = "\x1B]8;;"
// @from(Ln 233735, Col 4)
a34 = "\x07"
// @from(Ln 233736, Col 4)
sN8 = E(() => {
    aK();
    mU()
})
// @from(Ln 233741, Col 0)
function Ym9(A) {
    try {
        let q = i1(A),
            K = B6(q),
            Y = A.replace(/\\\//g, "/").replace(/\s+/g, ""),
            z = K.replace(/\s+/g, "");
        if (Y !== z) return A;
        return B6(q, null, 2)
    } catch {
        return A
    }
}
// @from(Ln 233754, Col 0)
function _m9(A) {
    if (A.length > zm9) return A;
    return A.split(`
`).map(Ym9).join(`
`)
}
// @from(Ln 233761, Col 0)
function s34(A) {
    return A.replace(wm9, (q) => PW6(q))
}
// @from(Ln 233765, Col 0)
function IB(A) {
    let q = A6(10),
        {
            content: K,
            verbose: Y,
            isError: z,
            isWarning: _,
            linkifyUrls: w
        } = A,
        {
            columns: O
        } = KA(),
        $ = r34(),
        H = Y || $,
        j;
    if (q[0] !== O || q[1] !== K || q[2] !== w || q[3] !== H) {
        A: {
            let P = _m9(K);
            if (w) P = s34(P);
            if (H) {
                j = vP1(P);
                break A
            }
            j = vP1(c34(P, O))
        }
        q[0] = O,
        q[1] = K,
        q[2] = w,
        q[3] = H,
        q[4] = j
    }
    else j = q[4];
    let J = j,
        M = z ? "error" : _ ? "warning" : void 0,
        D;
    if (q[5] !== J) D = u36.createElement(wK, null, J), q[5] = J, q[6] = D;
    else D = q[6];
    let X;
    if (q[7] !== M || q[8] !== D) X = u36.createElement(t1, null, u36.createElement(T, {
        color: M
    }, D)), q[7] = M, q[8] = D, q[9] = X;
    else X = q[9];
    return X
}
// @from(Ln 233810, Col 0)
function vP1(A) {
    return A.replace(/\u001b\[([0-9]+;)*4(;[0-9]+)*m|\u001b\[4(;[0-9]+)*m|\u001b\[([0-9]+;)*4m/g, "")
}
// @from(Ln 233813, Col 4)
u36
// @from(Ln 233813, Col 9)
zm9 = 1e4
// @from(Ln 233814, Col 4)
wm9
// @from(Ln 233815, Col 4)
WW6 = E(() => {
    e6();
    i6();
    iq();
    _q();
    oN8();
    g1();
    aN8();
    sN8();
    u36 = t(P6(), 1);
    wm9 = /https?:\/\/[^\s"'<>\\]+/g
})
// @from(Ln 233828, Col 0)
function NP1(A) {
    return A.replace(/<sandbox_violations>[\s\S]*?<\/sandbox_violations>/g, "")
}
// @from(Ln 233832, Col 0)
function eK(A) {
    let q = A6(16),
        {
            result: K,
            verbose: Y
        } = A,
        z = Rq("app:toggleTranscript", "Global", "ctrl+o"),
        _, w, O, $, H;
    if (q[0] !== K || q[1] !== z || q[2] !== Y) {
        let M;
        if (typeof K !== "string") M = "Tool execution failed";
        else {
            let X = d4(K, "tool_use_error") ?? K,
                Z = NP1(X).replace(/<\/?error>/g, "").trim();
            if (!Y && Z.includes("InputValidationError: ")) M = "Invalid tool parameters";
            else if (Z.startsWith("Error: ") || Z.startsWith("Cancelled: ")) M = Z;
            else M = `Error: ${Z}`
        }
        let D = M.split(`
`).length - tN8;
        w = t1, _ = m, O = "column", $ = z0.createElement(T, {
            color: "error"
        }, vP1(Y ? M : M.split(`
`).slice(0, tN8).join(`
`))), H = !Y && M.split(`
`).length > tN8 && z0.createElement(m, null, z0.createElement(T, {
            dimColor: !0
        }, "… +", D, " ", D === 1 ? "line" : "lines", " ("), z0.createElement(T, {
            dimColor: !0,
            bold: !0
        }, z), z0.createElement(T, null, " "), z0.createElement(T, {
            dimColor: !0
        }, "to see all)")), q[0] = K, q[1] = z, q[2] = Y, q[3] = _, q[4] = w, q[5] = O, q[6] = $, q[7] = H
    } else _ = q[3], w = q[4], O = q[5], $ = q[6], H = q[7];
    let j;
    if (q[8] !== _ || q[9] !== O || q[10] !== $ || q[11] !== H) j = z0.createElement(_, {
        flexDirection: O
    }, $, H), q[8] = _, q[9] = O, q[10] = $, q[11] = H, q[12] = j;
    else j = q[12];
    let J;
    if (q[13] !== w || q[14] !== j) J = z0.createElement(w, null, j), q[13] = w, q[14] = j, q[15] = J;
    else J = q[15];
    return J
}
// @from(Ln 233876, Col 4)
z0
// @from(Ln 233876, Col 8)
tN8 = 10
// @from(Ln 233877, Col 4)
kO = E(() => {
    e6();
    i6();
    iq();
    JA();
    WW6();
    Rj();
    z0 = t(P6(), 1)
})
// @from(Ln 233890, Col 0)
function Qk(A) {
    let q = A6(5),
        {
            filePath: K,
            children: Y
        } = A,
        z;
    if (q[0] !== K) z = Om9(K), q[0] = K, q[1] = z;
    else z = q[1];
    let _ = Y ?? K,
        w;
    if (q[2] !== z.href || q[3] !== _) w = t34.default.createElement(y7, {
        url: z.href
    }, _), q[2] = z.href, q[3] = _, q[4] = w;
    else w = q[4];
    return w
}
// @from(Ln 233907, Col 4)
t34
// @from(Ln 233908, Col 4)
ZW6 = E(() => {
    e6();
    IK6();
    t34 = t(P6(), 1)
})
// @from(Ln 233914, Col 0)
function VP1() {
    let A = process.env.CLAUDE_CODE_ENVIRONMENT_KIND;
    if (A === "byoc" || A === "anthropic_cloud") return A;
    return null
}
// @from(Ln 233919, Col 4)
eN8 = E(() => {
    H1()
})
// @from(Ln 233926, Col 0)
function Mm9(A) {
    return $m9(4).readUInt32BE(0) % A
}
// @from(Ln 233930, Col 0)
function AV8(A) {
    return A[Mm9(A.length)]
}
// @from(Ln 233934, Col 0)
function kP1() {
    let A = AV8(Hm9),
        q = AV8(Jm9),
        K = AV8(jm9);
    return `${A}-${q}-${K}`
}
// @from(Ln 233940, Col 4)
Hm9
// @from(Ln 233940, Col 9)
jm9
// @from(Ln 233940, Col 14)
Jm9
// @from(Ln 233941, Col 4)
qV8 = E(() => {
    Hm9 = ["abundant", "ancient", "bright", "calm", "cheerful", "clever", "cozy", "curious", "dapper", "dazzling", "deep", "delightful", "eager", "elegant", "enchanted", "fancy", "fluffy", "gentle", "gleaming", "golden", "graceful", "happy", "hidden", "humble", "jolly", "joyful", "keen", "kind", "lively", "lovely", "lucky", "luminous", "magical", "majestic", "mellow", "merry", "mighty", "misty", "noble", "peaceful", "playful", "polished", "precious", "proud", "quiet", "quirky", "radiant", "rosy", "serene", "shiny", "silly", "sleepy", "smooth", "snazzy", "snug", "snuggly", "soft", "sparkling", "spicy", "splendid", "sprightly", "starry", "steady", "sunny", "swift", "tender", "tidy", "toasty", "tranquil", "twinkly", "valiant", "vast", "velvet", "vivid", "warm", "whimsical", "wild", "wise", "witty", "wondrous", "zany", "zesty", "zippy", "breezy", "bubbly", "buzzing", "cheeky", "cosmic", "cozy", "crispy", "crystalline", "cuddly", "drifting", "dreamy", "effervescent", "ethereal", "fizzy", "flickering", "floating", "floofy", "fluttering", "foamy", "frolicking", "fuzzy", "giggly", "glimmering", "glistening", "glittery", "glowing", "goofy", "groovy", "harmonic", "hazy", "humming", "iridescent", "jaunty", "jazzy", "jiggly", "melodic", "moonlit", "mossy", "nifty", "peppy", "prancy", "purrfect", "purring", "quizzical", "rippling", "rustling", "shimmering", "shimmying", "snappy", "snoopy", "squishy", "swirling", "ticklish", "tingly", "twinkling", "velvety", "wiggly", "wobbly", "woolly", "zazzy", "abstract", "adaptive", "agile", "async", "atomic", "binary", "cached", "compiled", "composed", "compressed", "concurrent", "cryptic", "curried", "declarative", "delegated", "distributed", "dynamic", "eager", "elegant", "encapsulated", "enumerated", "eventual", "expressive", "federated", "functional", "generic", "greedy", "hashed", "idempotent", "immutable", "imperative", "indexed", "inherited", "iterative", "lazy", "lexical", "linear", "linked", "logical", "memoized", "modular", "mutable", "nested", "optimized", "parallel", "parsed", "partitioned", "piped", "polymorphic", "pure", "reactive", "recursive", "refactored", "reflective", "replicated", "resilient", "robust", "scalable", "sequential", "serialized", "sharded", "sorted", "staged", "stateful", "stateless", "streamed", "structured", "synchronous", "synthetic", "temporal", "transient", "typed", "unified", "validated", "vectorized", "virtual"], jm9 = ["aurora", "avalanche", "blossom", "breeze", "brook", "bubble", "canyon", "cascade", "cloud", "clover", "comet", "coral", "cosmos", "creek", "crescent", "crystal", "dawn", "dewdrop", "dusk", "eclipse", "ember", "feather", "fern", "firefly", "flame", "flurry", "fog", "forest", "frost", "galaxy", "garden", "glacier", "glade", "grove", "harbor", "horizon", "island", "lagoon", "lake", "leaf", "lightning", "meadow", "meteor", "mist", "moon", "moonbeam", "mountain", "nebula", "nova", "ocean", "orbit", "pebble", "petal", "pine", "planet", "pond", "puddle", "quasar", "rain", "rainbow", "reef", "ripple", "river", "shore", "sky", "snowflake", "spark", "spring", "star", "stardust", "starlight", "storm", "stream", "summit", "sun", "sunbeam", "sunrise", "sunset", "thunder", "tide", "twilight", "valley", "volcano", "waterfall", "wave", "willow", "wind", "alpaca", "axolotl", "badger", "bear", "beaver", "bee", "bird", "bumblebee", "bunny", "cat", "chipmunk", "crab", "crane", "deer", "dolphin", "dove", "dragon", "dragonfly", "duckling", "eagle", "elephant", "falcon", "finch", "flamingo", "fox", "frog", "giraffe", "goose", "hamster", "hare", "hedgehog", "hippo", "hummingbird", "jellyfish", "kitten", "koala", "ladybug", "lark", "lemur", "llama", "lobster", "lynx", "manatee", "meerkat", "moth", "narwhal", "newt", "octopus", "otter", "owl", "panda", "parrot", "peacock", "pelican", "penguin", "phoenix", "piglet", "platypus", "pony", "porcupine", "puffin", "puppy", "quail", "quokka", "rabbit", "raccoon", "raven", "robin", "salamander", "seahorse", "seal", "sloth", "snail", "sparrow", "sphinx", "squid", "squirrel", "starfish", "swan", "tiger", "toucan", "turtle", "unicorn", "walrus", "whale", "wolf", "wombat", "wren", "yeti", "zebra", "acorn", "anchor", "balloon", "beacon", "biscuit", "blanket", "bonbon", "book", "boot", "cake", "candle", "candy", "castle", "charm", "clock", "cocoa", "cookie", "crayon", "crown", "cupcake", "donut", "dream", "fairy", "fiddle", "flask", "flute", "fountain", "gadget", "gem", "gizmo", "globe", "goblet", "hammock", "harp", "haven", "hearth", "honey", "journal", "kazoo", "kettle", "key", "kite", "lantern", "lemon", "lighthouse", "locket", "lollipop", "mango", "map", "marble", "marshmallow", "melody", "mitten", "mochi", "muffin", "music", "nest", "noodle", "oasis", "origami", "pancake", "parasol", "peach", "pearl", "pebble", "pie", "pillow", "pinwheel", "pixel", "pizza", "plum", "popcorn", "pretzel", "prism", "pudding", "pumpkin", "puzzle", "quiche", "quill", "quilt", "riddle", "rocket", "rose", "scone", "scroll", "shell", "sketch", "snowglobe", "sonnet", "sparkle", "spindle", "sprout", "sundae", "swing", "taco", "teacup", "teapot", "thimble", "toast", "token", "tome", "tower", "treasure", "treehouse", "trinket", "truffle", "tulip", "umbrella", "waffle", "wand", "whisper", "whistle", "widget", "wreath", "zephyr", "abelson", "adleman", "aho", "allen", "babbage", "bachman", "backus", "barto", "bengio", "bentley", "blum", "boole", "brooks", "catmull", "cerf", "cherny", "church", "clarke", "cocke", "codd", "conway", "cook", "corbato", "cray", "curry", "dahl", "diffie", "dijkstra", "dongarra", "eich", "emerson", "engelbart", "feigenbaum", "floyd", "gosling", "graham", "gray", "hamming", "hanrahan", "hartmanis", "hejlsberg", "hellman", "hennessy", "hickey", "hinton", "hoare", "hollerith", "hopcroft", "hopper", "iverson", "kahan", "kahn", "karp", "kay", "kernighan", "knuth", "kurzweil", "lamport", "lampson", "lecun", "lerdorf", "liskov", "lovelace", "matsumoto", "mccarthy", "metcalfe", "micali", "milner", "minsky", "moler", "moore", "naur", "neumann", "newell", "nygaard", "papert", "parnas", "pascal", "patterson", "pearl", "perlis", "pike", "pnueli", "rabin", "reddy", "ritchie", "rivest", "rossum", "russell", "scott", "sedgewick", "shamir", "shannon", "sifakis", "simon", "stallman", "stearns", "steele", "stonebraker", "stroustrup", "sutherland", "sutton", "tarjan", "thacker", "thompson", "torvalds", "turing", "ullman", "valiant", "wadler", "wall", "wigderson", "wilkes", "wilkinson", "wirth", "wozniak", "yao"], Jm9 = ["baking", "beaming", "booping", "bouncing", "brewing", "bubbling", "chasing", "churning", "coalescing", "conjuring", "cooking", "crafting", "crunching", "cuddling", "dancing", "dazzling", "discovering", "doodling", "dreaming", "drifting", "enchanting", "exploring", "finding", "floating", "fluttering", "foraging", "forging", "frolicking", "gathering", "giggling", "gliding", "greeting", "growing", "hatching", "herding", "honking", "hopping", "hugging", "humming", "imagining", "inventing", "jingling", "juggling", "jumping", "kindling", "knitting", "launching", "leaping", "mapping", "marinating", "meandering", "mixing", "moseying", "munching", "napping", "nibbling", "noodling", "orbiting", "painting", "percolating", "petting", "plotting", "pondering", "popping", "prancing", "purring", "puzzling", "questing", "riding", "roaming", "rolling", "sauteeing", "scribbling", "seeking", "shimmying", "singing", "skipping", "sleeping", "snacking", "sniffing", "snuggling", "soaring", "sparking", "spinning", "splashing", "sprouting", "squishing", "stargazing", "stirring", "strolling", "swimming", "swinging", "tickling", "tinkering", "toasting", "tumbling", "twirling", "waddling", "wandering", "watching", "weaving", "whistling", "wibbling", "wiggling", "wishing", "wobbling", "wondering", "yawning", "zooming"]
})
// @from(Ln 233944, Col 4)
Uk = "ExitPlanMode"
// @from(Ln 233945, Col 4)
aJ = "ExitPlanMode"
// @from(Ln 233959, Col 0)
function bB(A) {
    let q = A ?? R1(),
        K = YA6(),
        Y = K.get(q);
    if (!Y) {
        let z = t2();
        for (let _ = 0; _ < Gm9; _++) {
            Y = kP1();
            let w = ut(z, `${Y}.md`);
            if (!$1().existsSync(w)) break
        }
        K.set(q, Y)
    }
    return Y
}
// @from(Ln 233975, Col 0)
function KV8(A, q) {
    YA6().set(A, q)
}
// @from(Ln 233979, Col 0)
function e34() {
    YA6().clear()
}
// @from(Ln 233983, Col 0)
function Fj(A) {
    let q = bB(R1());
    if (!A) return ut(t2(), `${q}.md`);
    return ut(t2(), `${q}-agent-${A}.md`)
}
// @from(Ln 233989, Col 0)
function sJ(A) {
    let q = Fj(A);
    try {
        return $1().readFileSync(q, {
            encoding: "utf-8"
        })
    } catch (K) {
        if (K.code === "ENOENT") return null;
        return _6(K), null
    }
}
// @from(Ln 234001, Col 0)
function A94(A) {
    return A.messages.find((q) => q.slug)?.slug
}
// @from(Ln 234004, Col 0)
async function EP1(A, q) {
    let K = A94(A);
    if (!K) return !1;
    let Y = q ?? R1();
    KV8(Y, K);
    let z = ut(t2(), `${K}.md`);
    try {
        return await $1().stat(z), !0
    } catch {
        if (VP1() === null) return !1;
        k(`Plan file missing during resume: ${z}. Attempting recovery.`);
        let _ = Tm9(A.messages, "plan"),
            w = null;
        if (_ && _.content.length > 0) w = _.content, k(`Plan recovered from file snapshot, ${w.length} chars`, {
            level: "info"
        });
        else if (w = fm9(A), w) k(`Plan recovered from message history, ${w.length} chars`, {
            level: "info"
        });
        if (w) try {
            return await Zm9(z, w, {
                encoding: "utf-8"
            }), !0
        } catch (O) {
            return _6(O), !1
        }
        return k("Plan file recovery failed: no file snapshot or plan content found in message history"), !1
    }
}
// @from(Ln 234033, Col 0)
async function q94(A, q) {
    let K = A94(A);
    if (!K) return !1;
    let Y = t2(),
        z = ut(Y, `${K}.md`),
        _ = bB(q),
        w = ut(Y, `${_}.md`);
    try {
        return await Wm9(z, w), !0
    } catch (O) {
        if (O.code === "ENOENT") return !1;
        return _6(O), !1
    }
}
// @from(Ln 234048, Col 0)
function fm9(A) {
    for (let q = A.messages.length - 1; q >= 0; q--) {
        let K = A.messages[q];
        if (!K) continue;
        if (K.type === "assistant") {
            let {
                content: Y
            } = K.message;
            if (Array.isArray(Y)) {
                for (let z of Y)
                    if (z.type === "tool_use" && z.name === aJ) {
                        let w = z.input?.plan;
                        if (typeof w === "string" && w.length > 0) return w
                    }
            }
        }
        if (K.type === "user") {
            let Y = K;
            if (typeof Y.planContent === "string" && Y.planContent.length > 0) return Y.planContent
        }
        if (K.type === "attachment") {
            let Y = K;
            if (Y.attachment?.type === "plan_file_reference") {
                let z = Y.attachment.planContent;
                if (typeof z === "string" && z.length > 0) return z
            }
        }
    }
    return null
}
// @from(Ln 234079, Col 0)
function Tm9(A, q) {
    for (let K = A.length - 1; K >= 0; K--) {
        let Y = A[K];
        if (Y?.type === "system" && "subtype" in Y && Y.subtype === "file_snapshot" && "snapshotFiles" in Y) return Y.snapshotFiles.find((_) => _.key === q)
    }
    return
}
// @from(Ln 234086, Col 0)
async function K94() {
    if (VP1() === null) return;
    try {
        let A = [],
            q = sJ();
        if (q) A.push({
            key: "plan",
            path: Fj(),
            content: q
        });
        if (A.length === 0) return;
        let K = {
                type: "system",
                subtype: "file_snapshot",
                content: "File snapshot",
                level: "info",
                isMeta: !0,
                timestamp: new Date().toISOString(),
                uuid: Dm9(),
                snapshotFiles: A
            },
            {
                recordTranscript: Y
            } = await Promise.resolve().then(() => (Oq(), YV8));
        await Y([K])
    } catch (A) {
        _6(A instanceof Error ? A : Error(`File snapshot persistence failed: ${A}`))
    }
}
// @from(Ln 234115, Col 4)
Gm9 = 10
// @from(Ln 234116, Col 4)
t2
// @from(Ln 234117, Col 4)
rH = E(() => {
    U4();
    T1();
    SA();
    A8();
    eN8();
    k1();
    H1();
    qV8();
    lA();
    i8();
    t2 = e1(function() {
        let K = mA().plansDirectory,
            Y;
        if (K) {
            let z = G1(),
                _ = Xm9(z, K);
            if (!_.startsWith(z + Pm9) && _ !== z) _6(Error(`plansDirectory must be within project root: ${K}`)), Y = ut(c8(), "plans");
            else Y = _
        } else Y = ut(c8(), "plans");
        try {
            $1().mkdirSync(Y)
        } catch (z) {
            _6(z)
        }
        return Y
    })
})
// @from(Ln 234146, Col 0)
function yP1(A) {
    let q = `${yJ6()}/`,
        K = ".output";
    if (A.startsWith(q) && A.endsWith(".output")) {
        let Y = A.slice(q.length, -7);
        if (Y.length > 0 && Y.length <= 20 && /^[a-zA-Z0-9_-]+$/.test(Y)) return Y
    }
    return null
}
// @from(Ln 234156, Col 0)
function Y94({
    file_path: A,
    offset: q,
    limit: K,
    pages: Y
}, {
    verbose: z
}) {
    if (!A) return null;
    if (yP1(A)) return "";
    let _ = z ? A : $K(A);
    if (Y) return Nq.createElement(Nq.Fragment, null, Nq.createElement(Qk, {
        filePath: A
    }, _), ` · pages ${Y}`);
    if (z && (q || K)) {
        let w = q ?? 1,
            O = K ? `lines ${w}-${w+K-1}` : `from line ${w}`;
        return Nq.createElement(Nq.Fragment, null, Nq.createElement(Qk, {
            filePath: A
        }, _), ` · ${O}`)
    }
    return Nq.createElement(Qk, {
        filePath: A
    }, _)
}
// @from(Ln 234182, Col 0)
function z94({
    file_path: A
}) {
    let q = A ? yP1(A) : null;
    if (!q) return null;
    return Nq.createElement(T, {
        dimColor: !0
    }, " ", q)
}
// @from(Ln 234192, Col 0)
function _94() {
    return null
}
// @from(Ln 234196, Col 0)
function w94(A) {
    switch (A.type) {
        case "image": {
            let {
                originalSize: q
            } = A.file, K = xq(q);
            return Nq.createElement(t1, {
                height: 1
            }, Nq.createElement(T, null, "Read image (", K, ")"))
        }
        case "notebook": {
            let {
                cells: q
            } = A.file;
            if (!q || q.length < 1) return Nq.createElement(T, {
                color: "error"
            }, "No cells found in notebook");
            return Nq.createElement(t1, {
                height: 1
            }, Nq.createElement(T, null, "Read ", Nq.createElement(T, {
                bold: !0
            }, q.length), " cells"))
        }
        case "pdf": {
            let {
                originalSize: q
            } = A.file, K = xq(q);
            return Nq.createElement(t1, {
                height: 1
            }, Nq.createElement(T, null, "Read PDF (", K, ")"))
        }
        case "parts":
            return Nq.createElement(t1, {
                height: 1
            }, Nq.createElement(T, null, "Read ", Nq.createElement(T, {
                bold: !0
            }, A.file.count), " ", A.file.count === 1 ? "page" : "pages", " (", xq(A.file.originalSize), ")"));
        case "text": {
            let {
                numLines: q
            } = A.file;
            return Nq.createElement(t1, {
                height: 1
            }, Nq.createElement(T, null, "Read ", Nq.createElement(T, {
                bold: !0
            }, q), " ", q === 1 ? "line" : "lines"))
        }
    }
}
// @from(Ln 234246, Col 0)
function O94() {
    return Nq.createElement(T3, null)
}
// @from(Ln 234250, Col 0)
function $94(A, {
    verbose: q
}) {
    if (!q && typeof A === "string") {
        if (A.includes(wZ)) return Nq.createElement(t1, null, Nq.createElement(T, {
            color: "error"
        }, "File not found"));
        if (d4(A, "tool_use_error")) return Nq.createElement(t1, null, Nq.createElement(T, {
            color: "error"
        }, "Error reading file"))
    }
    return Nq.createElement(eK, {
        result: A,
        verbose: q
    })
}
// @from(Ln 234267, Col 0)
function H94(A) {
    if (A?.file_path?.startsWith(t2())) return "Reading Plan";
    if (A?.file_path && yP1(A.file_path)) return "Read agent output";
    return "Read"
}
// @from(Ln 234273, Col 0)
function zV8(A) {
    if (!A?.file_path) return null;
    let q = yP1(A.file_path);
    if (q) return q;
    return $K(A.file_path)
}
// @from(Ln 234279, Col 4)
Nq
// @from(Ln 234280, Col 4)
j94 = E(() => {
    i6();
    gj();
    kO();
    ZW6();
    iq();
    Z7();
    JA();
    rH();
    SM();
    Nq = t(P6(), 1)
})
// @from(Ln 234298, Col 0)
function Nm9(A) {
    return A.replace(/:/g, "-")
}
// @from(Ln 234302, Col 0)
function J94(A) {
    if (process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) return id(process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR, "projects", BD(LJ(qY()) ?? qY()), "agent-memory-local", A) + xB;
    return id(G1(), ".claude", "agent-memory-local", A) + xB
}
// @from(Ln 234307, Col 0)
function GW6(A, q) {
    let K = Nm9(A);
    switch (q) {
        case "project":
            return id(G1(), ".claude", "agent-memory", K) + xB;
        case "local":
            return J94(K);
        case "user":
            return id(Ma(), "agent-memory", K) + xB
    }
}
// @from(Ln 234319, Col 0)
function Mp6(A) {
    let q = vm9(A),
        K = Ma();
    if (q.startsWith(id(K, "agent-memory") + xB)) return !0;
    if (q.startsWith(id(G1(), ".claude", "agent-memory") + xB)) return !0;
    if (process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) {
        if (q.includes(xB + "agent-memory-local" + xB) && q.startsWith(id(process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR, "projects") + xB)) return !0
    } else if (q.startsWith(id(G1(), ".claude", "agent-memory-local") + xB)) return !0;
    return !1
}
// @from(Ln 234330, Col 0)
function LP1(A) {
    switch (A) {
        case "user":
            return `User (${id(Ma(),"agent-memory")}/)`;
        case "project":
            return "Project (.claude/agent-memory/)";
        case "local":
            return `Local (${J94("...")})`;
        default:
            return "None"
    }
}
// @from(Ln 234343, Col 0)
function m36(A, q) {
    let K;
    switch (q) {
        case "user":
            K = "- Since this memory is user-scope, keep learnings general since they apply across all projects";
            break;
        case "project":
            K = "- Since this memory is project-scope and shared with your team via version control, tailor your memories to this project";
            break;
        case "local":
            K = "- Since this memory is local-scope (not checked into version control), tailor your memories to this project and machine";
            break
    }
    let Y = GW6(A, q);
    return CD1(Y), (w8("tengu_swinburne_dune", !1) ? d14 : Q14)({
        displayName: "Persistent Agent Memory",
        memoryDir: Y,
        extraGuidelines: [K]
    })
}
// @from(Ln 234363, Col 4)
yI = E(() => {
    T1();
    lA();
    $5();
    k06();
    HA();
    mH();
    F9()
})
// @from(Ln 234378, Col 0)
function km9(A) {
    return A.split(X94.sep).join(D94.sep)
}
// @from(Ln 234382, Col 0)
function nd(A) {
    let q = km9(A);
    return wV8 ? q.toLowerCase() : q
}
// @from(Ln 234387, Col 0)
function Dp6(A) {
    let q = c8(),
        K = nd(A),
        Y = nd(q);
    if (!K.startsWith(Y)) return null;
    if (K.includes("/session-memory/") && K.endsWith(".md")) return "session_memory";
    if (K.includes("/projects/") && K.endsWith(".jsonl")) return "session_transcript";
    return null
}
// @from(Ln 234397, Col 0)
function RP1(A) {
    let q = A.split(X94.sep).join(D94.sep);
    if (q.includes("session-memory") && (q.includes(".md") || q.endsWith("*"))) return "session_memory";
    if (q.includes(".jsonl") || q.includes("projects") && q.includes("*.jsonl")) return "session_transcript";
    return null
}
// @from(Ln 234404, Col 0)
function fW6(A) {
    if (Z3()) return Da(A);
    return !1
}
// @from(Ln 234409, Col 0)
function Em9(A) {
    if (Z3()) return Mp6(A);
    return !1
}
// @from(Ln 234414, Col 0)
function Xp6(A) {
    if (fW6(A)) return !0;
    if (_V8.isTeamMemFile(A)) return !0;
    if (Dp6(A) !== null) return !0;
    if (Em9(A)) return !0;
    return !1
}
// @from(Ln 234422, Col 0)
function OV8(A) {
    let q = Vm9(A),
        K = nd(q);
    if (Z3() && (K.includes("/agent-memory/") || K.includes("/agent-memory-local/"))) return !0;
    if (_V8.isTeamMemoryEnabled() && _V8.isTeamMemPath(q)) return !0;
    if (Z3()) {
        let O = uH(),
            $ = nd(O.replace(/[/\\]+$/, "")),
            H = nd(O);
        if (K === $ || K.startsWith(H)) return !0
    }
    let Y = nd(c8()),
        z = nd(Ma()),
        _ = K.startsWith(Y),
        w = K.startsWith(z);
    if (!_ && !w) return !1;
    if (K.includes("/session-memory/")) return !0;
    if (_ && K.includes("/projects/")) return !0;
    if (Z3() && K.includes("/memory/")) return !0;
    return !1
}
// @from(Ln 234444, Col 0)
function P94(A) {
    let q = c8(),
        K = Ma(),
        Y = Z3() ? uH().replace(/[/\\]+$/, "") : "",
        z = nd(A);
    if (![q, K, Y].filter(Boolean).some(($) => {
            if (z.includes(nd($))) return !0;
            if (wV8) return z.includes(GP($).toLowerCase());
            return !1
        })) return !1;
    let O = A.match(/(?:[A-Za-z]:[/\\]|\/)[^\s'"]+/g);
    if (!O) return !1;
    for (let $ of O) {
        let H = $.replace(/[,;|&>]+$/, ""),
            j = wV8 ? tA6(H) : H;
        if (Xp6(j) || OV8(j)) return !0
    }
    return !1
}
// @from(Ln 234464, Col 0)
function W94(A) {
    if (RP1(A) !== null) return !0;
    if (Z3() && (A.replace(/\\/g, "/").includes("agent-memory/") || A.replace(/\\/g, "/").includes("agent-memory-local/"))) return !0;
    return !1
}
// @from(Ln 234469, Col 4)
_V8
// @from(Ln 234469, Col 9)
wV8
// @from(Ln 234470, Col 4)
hP1 = E(() => {
    A8();
    lx();
    mH();
    yI();
    _V8 = (Rk(), k4(Ld)), wV8 = process.platform === "win32"
})
// @from(Ln 234480, Col 0)
async function uB(A, q, K) {
    let Y = A;
    return await Promise.all([...A.matchAll(Lm9), ...A.matchAll(Rm9)].map(async (z) => {
        let _ = z[1]?.trim();
        if (_) try {
            let w = await tJ(J4, {
                command: _
            }, q, $Z({
                content: []
            }), "");
            if (w.behavior !== "allow") throw k(`Bash command permission check failed for command in ${K}: ${_}. Error: ${w.message}`), new ix(`Bash command permission check failed for pattern "${z[0]}": ${w.message||"Permission denied"}`);
            let {
                data: O
            } = await J4.call({
                command: _
            }, q), $ = await JW6(J4, O, ym9()), H = typeof $.content === "string" ? $.content : Z94(O.stdout, O.stderr);
            Y = Y.replace(z[0], H)
        } catch (w) {
            if (w instanceof ix) throw w;
            hm9(w, z[0])
        }
    })), Y
}
// @from(Ln 234504, Col 0)
function Z94(A, q, K = !1) {
    let Y = [];
    if (A.trim()) Y.push(A.trim());
    if (q.trim())
        if (K) Y.push(`[stderr: ${q.trim()}]`);
        else Y.push(`[stderr]
${q.trim()}`);
    return Y.join(K ? " " : `
`)
}
// @from(Ln 234515, Col 0)
function hm9(A, q, K = !1) {
    if (A instanceof uS) {
        if (A.interrupted) throw new ix(`Bash command interrupted for pattern "${q}": [Command interrupted]`);
        let _ = Z94(A.stdout, A.stderr, K);
        throw new ix(`Bash command failed for pattern "${q}": ${_}`)
    }
    let Y = _1(A),
        z = K ? `[Error: ${Y}]` : `[Error]
${Y}`;
    throw new ix(z)
}
// @from(Ln 234526, Col 4)
Lm9
// @from(Ln 234526, Col 9)
Rm9
// @from(Ln 234527, Col 4)
TW6 = E(() => {
    OZ();
    s8();
    H1();
    Bj();
    JA();
    ZR();
    Lm9 = /```!\s*\n?([\s\S]*?)\n?```/g, Rm9 = /(?<=^|\s)!`([^`]+)`/gm
})
// @from(Ln 234537, Col 0)
function $V8(A) {
    if (!A || !A.trim()) return [];
    let q = Fz(A, (K) => `$${K}`);
    if (!q.success) return A.split(/\s+/).filter(Boolean);
    return q.tokens.filter((K) => typeof K === "string")
}
// @from(Ln 234544, Col 0)
function Pp6(A) {
    if (!A) return [];
    let q = (K) => typeof K === "string" && K.trim() !== "" && !/^\d+$/.test(K);
    if (Array.isArray(A)) return A.filter(q);
    if (typeof A === "string") return A.split(/\s+/).filter(q);
    return []
}
// @from(Ln 234552, Col 0)
function G94(A, q) {
    let K = A.slice(q.length);
    if (K.length === 0) return;
    return K.map((Y) => `[${Y}]`).join(" ")
}
// @from(Ln 234558, Col 0)
function vW6(A, q, K = !0, Y = []) {
    if (q === void 0 || q === null) return A;
    let z = $V8(q),
        _ = A;
    for (let w = 0; w < Y.length; w++) {
        let O = Y[w];
        if (!O) continue;
        A = A.replace(new RegExp(`\\$${O}(?![\\[\\w])`, "g"), z[w] ?? "")
    }
    if (A = A.replace(/\$ARGUMENTS\[(\d+)\]/g, (w, O) => {
            let $ = parseInt(O, 10);
            return z[$] ?? ""
        }), A = A.replace(/\$(\d+)(?!\w)/g, (w, O) => {
            let $ = parseInt(O, 10);
            return z[$] ?? ""
        }), A = A.replaceAll("$ARGUMENTS", q), A === _ && K && q) A = A + `

ARGUMENTS: ${q}`;
    return A
}
// @from(Ln 234578, Col 4)
Wp6 = E(() => {
    RJ()
})
// @from(Ln 234593, Col 0)
function Bt(A, q) {
    switch (A) {
        case "policySettings":
            return mt(bW(), ".claude", q);
        case "userSettings":
            return mt(c8(), q);
        case "projectSettings":
            return `.claude/${q}`;
        case "plugin":
            return "plugin";
        default:
            return ""
    }
}
// @from(Ln 234608, Col 0)
function kW6(A) {
    let q = [A.name, A.description, A.whenToUse].filter(Boolean).join(" ");
    return j5(q)
}
// @from(Ln 234612, Col 0)
async function bm9(A) {
    try {
        return await Sm9(A)
    } catch {
        return null
    }
}
// @from(Ln 234620, Col 0)
function T94(A, q) {
    if (!A.hooks) return;
    let K = ty().safeParse(A.hooks);
    if (!K.success) {
        k(`Invalid hooks in skill '${q}': ${K.error.message}`);
        return
    }
    return K.data
}
// @from(Ln 234630, Col 0)
function xm9(A) {
    if (!A.paths || typeof A.paths !== "string") return;
    let q = sz1(A.paths).map((K) => {
        return K.endsWith("/**") ? K.slice(0, -3) : K
    }).filter((K) => K.length > 0);
    if (q.length === 0 || q.every((K) => K === "**")) return;
    return q
}
// @from(Ln 234639, Col 0)
function v94({
    skillName: A,
    displayName: q,
    description: K,
    hasUserSpecifiedDescription: Y,
    markdownContent: z,
    allowedTools: _,
    argumentHint: w,
    argumentNames: O,
    whenToUse: $,
    version: H,
    model: j,
    disableModelInvocation: J,
    userInvocable: M,
    source: D,
    baseDir: X,
    loadedFrom: P,
    hooks: W,
    executionContext: Z,
    agent: G,
    paths: f
}) {
    return {
        type: "prompt",
        name: A,
        description: K,
        hasUserSpecifiedDescription: Y,
        allowedTools: _,
        argumentHint: w,
        argNames: O.length > 0 ? O : void 0,
        whenToUse: $,
        version: H,
        model: j,
        disableModelInvocation: J,
        userInvocable: M,
        context: Z,
        agent: G,
        paths: f,
        contentLength: z.length,
        isEnabled: () => !0,
        isHidden: !M,
        progressMessage: "running",
        userFacingName() {
            return q || A
        },
        source: D,
        loadedFrom: P,
        hooks: W,
        skillRoot: X,
        async getPromptForCommand(v, N) {
            let V = X ? `Base directory for this skill: ${X}

${z}` : z;
            if (V = vW6(V, v, !0, O), X) {
                let L = process.platform === "win32" ? X.replace(/\\/g, "/") : X;
                V = V.replace(/\$\{CLAUDE_SKILL_DIR\}/g, L)
            }
            return V = V.replace(/\$\{CLAUDE_SESSION_ID\}/g, R1()), V = await uB(V, {
                ...N,
                getAppState() {
                    let L = N.getAppState();
                    return {
                        ...L,
                        toolPermissionContext: {
                            ...L.toolPermissionContext,
                            alwaysAllowRules: {
                                ...L.toolPermissionContext.alwaysAllowRules,
                                command: _
                            }
                        }
                    }
                }
            }, `/${A}`), [{
                type: "text",
                text: V
            }]
        }
    }
}
// @from(Ln 234718, Col 0)
async function Zp6(A, q) {
    let K = $1(),
        Y;
    try {
        Y = await K.readdir(A)
    } catch (_) {
        let w = _.code;
        if (w !== "ENOENT" && w !== "EACCES" && w !== "EPERM") _6(_);
        return []
    }
    return (await Promise.all(Y.map(async (_) => {
        try {
            if (!_.isDirectory() && !_.isSymbolicLink()) return null;
            let w = mt(A, _.name),
                O = mt(w, "SKILL.md"),
                $;
            try {
                $ = await K.readFile(O, {
                    encoding: "utf-8"
                })
            } catch {
                return null
            }
            let {
                frontmatter: H,
                content: j
            } = BH($, O), J = _.name, M = NL(H.description, J), D = M ?? ad(j, "Skill"), X = LI(H["allowed-tools"]), P = H["user-invocable"] === void 0 ? !0 : ka(H["user-invocable"]), W = ka(H["disable-model-invocation"]), Z = H.model === "inherit" ? void 0 : H.model ? H5(H.model) : void 0, G = T94(H, J), f = H.context === "fork" ? "fork" : void 0, v = H.agent, N = Pp6(H.arguments), V = xm9(H);
            return {
                skill: v94({
                    skillName: J,
                    displayName: H.name != null ? String(H.name) : void 0,
                    description: D,
                    hasUserSpecifiedDescription: M !== null,
                    markdownContent: j,
                    allowedTools: X,
                    argumentHint: H["argument-hint"] != null ? String(H["argument-hint"]) : void 0,
                    argumentNames: N,
                    whenToUse: H.when_to_use,
                    version: H.version,
                    model: Z,
                    disableModelInvocation: W,
                    userInvocable: P,
                    source: q,
                    baseDir: w,
                    loadedFrom: "skills",
                    hooks: G,
                    executionContext: f,
                    agent: v,
                    paths: V
                }),
                filePath: O
            }
        } catch (w) {
            return _6(w), null
        }
    }))).filter((_) => _ !== null)
}
// @from(Ln 234776, Col 0)
function jV8(A) {
    return /^skill\.md$/i.test(SP1(A))
}
// @from(Ln 234780, Col 0)
function um9(A) {
    let q = new Map;
    for (let Y of A) {
        let z = B36(Y.filePath),
            _ = q.get(z) ?? [];
        _.push(Y), q.set(z, _)
    }
    let K = [];
    for (let [Y, z] of q) {
        let _ = z.filter((w) => jV8(w.filePath));
        if (_.length > 0) {
            let w = _[0];
            if (_.length > 1) k(`Multiple skill files found in ${Y}, using ${SP1(w.filePath)}`);
            K.push(w)
        } else K.push(...z)
    }
    return K
}
// @from(Ln 234799, Col 0)
function N94(A, q) {
    let K = q.endsWith(NW6) ? q.slice(0, -1) : q;
    if (A === K) return "";
    let Y = A.slice(K.length + 1);
    return Y ? Y.split(NW6).join(":") : ""
}
// @from(Ln 234806, Col 0)
function mm9(A, q) {
    let K = B36(A),
        Y = B36(K),
        z = SP1(K),
        _ = N94(Y, q);
    return _ ? `${_}:${z}` : z
}
// @from(Ln 234814, Col 0)
function Bm9(A, q) {
    let K = SP1(A),
        Y = B36(A),
        z = K.replace(/\.md$/, ""),
        _ = N94(Y, q);
    return _ ? `${_}:${z}` : z
}
// @from(Ln 234822, Col 0)
function gm9(A) {
    return jV8(A.filePath) ? mm9(A.filePath, A.baseDir) : Bm9(A.filePath, A.baseDir)
}
// @from(Ln 234825, Col 0)
async function Fm9(A) {
    try {
        let q = await sd("commands", A),
            K = um9(q),
            Y = [];
        for (let {
                baseDir: z,
                filePath: _,
                frontmatter: w,
                content: O,
                source: $
            }
            of K) try {
            let j = jV8(_) ? B36(_) : void 0,
                J = gm9({
                    baseDir: z,
                    filePath: _,
                    frontmatter: w,
                    content: O,
                    source: $
                }),
                M = NL(w.description, J),
                D = M ?? ad(O, "Custom command"),
                X = LI(w["allowed-tools"]),
                P = w["user-invocable"] === void 0 ? !0 : ka(w["user-invocable"]),
                W = ka(w["disable-model-invocation"]),
                Z = w.model === "inherit" ? void 0 : w.model ? H5(w.model) : void 0,
                G = w.context === "fork" ? "fork" : void 0,
                f = w.agent,
                v = T94(w, J),
                N = Pp6(w.arguments);
            Y.push({
                skill: v94({
                    skillName: J,
                    displayName: void 0,
                    description: D,
                    hasUserSpecifiedDescription: M !== null,
                    markdownContent: O,
                    allowedTools: X,
                    argumentHint: w["argument-hint"] != null ? String(w["argument-hint"]) : void 0,
                    argumentNames: N,
                    whenToUse: w.when_to_use,
                    version: w.version,
                    model: Z,
                    disableModelInvocation: W,
                    userInvocable: P,
                    source: $,
                    baseDir: j,
                    loadedFrom: "commands_DEPRECATED",
                    hooks: v,
                    executionContext: G,
                    agent: f,
                    paths: void 0
                }),
                filePath: _
            })
        } catch (H) {
            _6(H)
        }
        return Y
    } catch (q) {
        return _6(q), []
    }
}
// @from(Ln 234890, Col 0)
function CP1() {
    JV8.cache?.clear?.(), sd.cache?.clear?.(), VW6.clear(), IP1.clear()
}
// @from(Ln 234894, Col 0)
function V94(A) {
    MV8.push(A)
}
// @from(Ln 234897, Col 0)
async function EW6(A, q) {
    let K = $1(),
        Y = q.endsWith(NW6) ? q.slice(0, -1) : q,
        z = [];
    for (let _ of A) {
        let w = B36(_);
        while (w.startsWith(Y + NW6)) {
            let O = mt(w, ".claude", "skills");
            if (!HV8.has(O)) {
                HV8.add(O);
                try {
                    if (await K.stat(O), await S58(w, Y)) {
                        k(`[skills] Skipped gitignored skills dir: ${O}`);
                        continue
                    }
                    z.push(O)
                } catch {}
            }
            let $ = B36(w);
            if ($ === w) break;
            w = $
        }
    }
    return z.sort((_, w) => w.split(NW6).length - _.split(NW6).length)
}
// @from(Ln 234922, Col 0)
async function yW6(A) {
    if (!SH("projectSettings")) {
        k("[skills] Dynamic skill discovery skipped: projectSettings source disabled");
        return
    }
    if (A.length === 0) return;
    let q = new Set(rd.keys()),
        K = await Promise.all(A.map((z) => Zp6(z, "projectSettings")));
    for (let z = K.length - 1; z >= 0; z--)
        for (let {
                skill: _
            }
            of K[z] ?? [])
            if (_.type === "prompt") rd.set(_.name, _);
    let Y = K.flat().length;
    if (Y > 0) {
        let z = [...rd.keys()].filter((_) => !q.has(_));
        if (k(`[skills] Dynamically discovered ${Y} skills from ${A.length} directories`), z.length > 0) d("tengu_dynamic_skills_changed", {
            source: "file_operation",
            previousCount: q.size,
            newCount: rd.size,
            addedCount: z.length,
            directoryCount: A.length
        })
    }
    for (let z of MV8) try {
        z()
    } catch (_) {
        _6(_)
    }
}
// @from(Ln 234954, Col 0)
function k94() {
    return Array.from(rd.values())
}
// @from(Ln 234958, Col 0)
function LW6(A, q) {
    if (VW6.size === 0) return [];
    let K = [];
    for (let [Y, z] of VW6) {
        if (z.type !== "prompt" || !z.paths || z.paths.length === 0) continue;
        let _ = f94.default().add(z.paths);
        for (let w of A) {
            let O = Cm9(w) ? Im9(q, w) : w;
            if (_.ignores(O)) {
                rd.set(Y, z), VW6.delete(Y), IP1.add(Y), K.push(Y), k(`[skills] Activated conditional skill '${Y}' (matched path: ${O})`);
                break
            }
        }
    }
    if (K.length > 0) {
        d("tengu_dynamic_skills_changed", {
            source: "conditional_paths",
            previousCount: rd.size - K.length,
            newCount: rd.size,
            addedCount: K.length,
            directoryCount: 0
        });
        for (let Y of MV8) try {
            Y()
        } catch (z) {
            _6(z)
        }
    }
    return K
}
// @from(Ln 234989, Col 0)
function E94() {
    HV8.clear(), rd.clear(), VW6.clear(), IP1.clear()
}
// @from(Ln 234992, Col 4)
f94
// @from(Ln 234992, Col 9)
JV8
// @from(Ln 234992, Col 14)
HV8
// @from(Ln 234992, Col 19)
rd
// @from(Ln 234992, Col 23)
VW6
// @from(Ln 234992, Col 28)
IP1
// @from(Ln 234992, Col 33)
MV8
// @from(Ln 234993, Col 4)
od = E(() => {
    U4();
    k1();
    H1();
    BG();
    V1();
    TW6();
    td();
    SA();
    BG();
    A8();
    So();
    O2();
    C58();
    z4();
    jC();
    Hf();
    T1();
    Wp6();
    f94 = t(Kq6(), 1);
    JV8 = e1(async (A) => {
        let q = mt(c8(), "skills"),
            K = mt(bW(), ".claude", "skills"),
            Y = DV8("skills", A);
        k(`Loading skills from: managed=${K}, user=${q}, project=[${Y.join(", ")}]`);
        let z = XT(),
            _ = SH("projectSettings"),
            [w, O, $, H, j] = await Promise.all([Zp6(K, "policySettings"), SH("userSettings") ? Zp6(q, "userSettings") : Promise.resolve([]), _ ? Promise.all(Y.map((G) => Zp6(G, "projectSettings"))) : Promise.resolve([]), _ ? Promise.all(z.map((G) => Zp6(mt(G, ".claude", "skills"), "projectSettings"))) : Promise.resolve([]), Fm9(A)]),
            J = [...w, ...O, ...$.flat(), ...H.flat(), ...j],
            M = await Promise.all(J.map(({
                skill: G,
                filePath: f
            }) => G.type === "prompt" ? bm9(f) : Promise.resolve(null))),
            D = new Map,
            X = [];
        for (let G = 0; G < J.length; G++) {
            let f = J[G];
            if (f === void 0 || f.skill.type !== "prompt") continue;
            let {
                skill: v
            } = f, N = M[G];
            if (N === null || N === void 0) {
                X.push(v);
                continue
            }
            let V = D.get(N);
            if (V !== void 0) {
                k(`Skipping duplicate skill '${v.name}' from ${v.source} (same file already loaded from ${V})`);
                continue
            }
            D.set(N, v.source), X.push(v)
        }
        let P = J.length - X.length;
        if (P > 0) k(`Deduplicated ${P} skills (same file)`);
        let W = [],
            Z = [];
        for (let G of X)
            if (G.type === "prompt" && G.paths && G.paths.length > 0 && !IP1.has(G.name)) Z.push(G);
            else W.push(G);
        for (let G of Z) VW6.set(G.name, G);
        if (Z.length > 0) k(`[skills] ${Z.length} conditional skills stored (activated when matching files are touched)`);
        return k(`Loaded ${X.length} unique skills (${W.length} unconditional, ${Z.length} conditional, managed: ${w.length}, user: ${O.length}, project: ${$.flat().length}, additional: ${H.flat().length}, legacy commands: ${j.length})`), W
    });
    HV8 = new Set, rd = new Map, VW6 = new Map, IP1 = new Set, MV8 = []
})
// @from(Ln 235071, Col 0)
function nm9(A) {
    if (im9.has(A)) return !0;
    if (A.startsWith("/proc/") && (A.endsWith("/fd/0") || A.endsWith("/fd/1") || A.endsWith("/fd/2"))) return !0;
    return !1
}
// @from(Ln 235077, Col 0)
function om9(A) {
    let q = g36.basename(A),
        K = /^(.+)([ \u202F])(AM|PM)(\.png)$/,
        Y = q.match(K);
    if (!Y) return;
    let z = Y[2],
        _ = z === " " ? rm9 : " ";
    return A.replace(`${z}${Y[3]}${Y[4]}`, `${_}${Y[3]}${Y[4]}`)
}
// @from(Ln 235087, Col 0)
function sm9(A) {
    let q = c8();
    if (!A.startsWith(q)) return null;
    let K = A.split(cm9.sep).join(dm9.sep);
    if (K.includes("/session-memory/") && K.endsWith(".md")) return "session_memory";
    if (K.includes("/projects/") && K.endsWith(".jsonl")) return "session_transcript";
    return null
}
// @from(Ln 235096, Col 0)
function AB9() {
    return WG7
}
// @from(Ln 235100, Col 0)
function qB9(A) {
    return Kw1(A)
}
// @from(Ln 235104, Col 0)
function zB9() {
    let A = IY(cK());
    return !YB9.has(A)
}
// @from(Ln 235109, Col 0)
function _B9(A) {
    let q = h94.get(A);
    if (q === void 0) return "";
    return lJ7(q)
}
// @from(Ln 235114, Col 0)
async function y94(A, q, K) {
    let Y = K ?? S36().maxTokens,
        z = C94(A, q);
    if (!z || z <= Y / 4) return;
    let w = await S94(A) ?? z;
    if (w > Y) throw new xP1(w, Y)
}
// @from(Ln 235122, Col 0)
function bP1(A, q, K, Y) {
    return {
        type: "image",
        file: {
            base64: A.toString("base64"),
            type: `image/${q}`,
            originalSize: K,
            dimensions: Y
        }
    }
}
// @from(Ln 235133, Col 0)
async function L94(A, q, K, Y, z, _, w, O, $, H, j, J) {
    if (Y === "ipynb") {
        let u = await w34(K),
            I = B6(u),
            g = Buffer.byteLength(I);
        if (g > O) throw Error(`Notebook content (${xq(g)}) exceeds maximum allowed size (${xq(O)}). Use ${Q7} with jq to read specific portions:
  cat "${A}" | jq '.cells[:20]' # First 20 cells
  cat "${A}" | jq '.cells[100:120]' # Cells 100-120
  cat "${A}" | jq '.cells | length' # Count total cells
  cat "${A}" | jq '.cells[] | select(.cell_type=="code") | .source' # All code sources`);
        await y94(I, Y, $);
        let B = await $1().stat(K);
        H.set(q, {
            content: I,
            timestamp: Math.floor(B.mtimeMs),
            offset: z,
            limit: _
        }), j.nestedMemoryAttachmentTriggers?.add(q);
        let b = {
            type: "notebook",
            file: {
                filePath: A,
                cells: u
            }
        };
        return RC({
            operation: "read",
            tool: "FileReadTool",
            filePath: q,
            content: I
        }), {
            data: b
        }
    }
    if (R94.has(Y)) {
        let u = await XV8(K, $);
        j.nestedMemoryAttachmentTriggers?.add(q), RC({
            operation: "read",
            tool: "FileReadTool",
            filePath: q,
            content: u.file.base64
        });
        let I = u.file.dimensions ? wW6(u.file.dimensions) : null;
        return {
            data: u,
            ...I && {
                newMessages: [p1({
                    content: I,
                    isMeta: !0
                })]
            }
        }
    }
    if (JD6(Y)) {
        if (w) {
            let Q = gw8(w),
                U = await UN8(K, Q ?? void 0);
            if (!U.success) throw Error(U.error.message);
            d("tengu_pdf_page_extraction", {
                success: !0,
                pageCount: U.data.file.count,
                fileSize: U.data.file.originalSize,
                hasPageRange: !0
            }), RC({
                operation: "read",
                tool: "FileReadTool",
                filePath: q,
                content: `PDF pages ${w}`
            });
            let e = (await pm9(U.data.file.outputDir)).filter((H6) => H6.endsWith(".jpg")).sort(),
                Y6 = await Promise.all(e.map(async (H6) => {
                    let J6 = g36.join(U.data.file.outputDir, H6),
                        K6 = await Qm9(J6),
                        s = await Bk(K6, K6.length, "jpeg");
                    return {
                        type: "image",
                        source: {
                            type: "base64",
                            media_type: `image/${s.mediaType}`,
                            data: s.buffer.toString("base64")
                        }
                    }
                }));
            return {
                data: U.data,
                ...Y6.length > 0 && {
                    newMessages: [p1({
                        content: Y6,
                        isMeta: !0
                    })]
                }
            }
        }
        let u = await GP1(K);
        if (u !== null && u > TX1) throw Error(`This PDF has ${u} pages, which is too many to read at once. Use the pages parameter to read specific page ranges (e.g., pages: "1-5"). Maximum ${P36} pages per request.`);
        let g = await $1().stat(K);
        if (!yx6() || g.size > XA4) {
            let Q = await UN8(K);
            if (Q.success) d("tengu_pdf_page_extraction", {
                success: !0,
                pageCount: Q.data.file.count,
                fileSize: Q.data.file.originalSize
            });
            else d("tengu_pdf_page_extraction", {
                success: !1,
                available: Q.error.reason !== "unavailable",
                fileSize: g.size
            })
        }
        if (!yx6()) throw Error(`Reading full PDFs is only supported with the Anthropic API. Use the pages parameter to read specific page ranges (e.g., pages: "1-5", maximum ${P36} pages per request). This requires poppler-utils: install with \`brew install poppler\` on macOS or \`apt-get install poppler-utils\` on Debian/Ubuntu.`);
        let b = await N34(K);
        if (!b.success) throw Error(b.error.message);
        let p = b.data;
        return RC({
            operation: "read",
            tool: "FileReadTool",
            filePath: q,
            content: p.file.base64
        }), {
            data: p,
            newMessages: [p1({
                content: [{
                    type: "document",
                    source: {
                        type: "base64",
                        media_type: "application/pdf",
                        data: p.file.base64
                    }
                }],
                isMeta: !0
            })]
        }
    }
    let M = _ !== void 0 && w8("tengu_pewter_gull", !1),
        D = M ? Math.min(O, $ * PV8(Y)) : _ === void 0 ? O : void 0,
        X = z === 0 ? 0 : z - 1,
        {
            content: P,
            lineCount: W,
            totalLines: Z,
            totalBytes: G,
            readBytes: f,
            mtimeMs: v,
            truncatedByBytes: N
        } = await h36(K, X, _, D, j.abortController.signal, M ? {
            truncateOnByteLimit: !0
        } : void 0);
    if (!N) await y94(P, Y, $);
    H.set(q, {
        content: P,
        timestamp: Math.floor(v),
        offset: z,
        limit: _
    }), j.nestedMemoryAttachmentTriggers?.add(q);
    for (let u of am9) u(K, P);
    let V = {
        type: "text",
        file: {
            filePath: A,
            content: P,
            numLines: W,
            startLine: z,
            totalLines: Z,
            ...N ? {
                resultWasTruncated: !0
            } : {}
        }
    };
    if (fW6(q)) h94.set(V, v);
    RC({
        operation: "read",
        tool: "FileReadTool",
        filePath: q,
        content: P
    });
    let L = sm9(q),
        h = F36(q),
        R = Um9("sha256").update(q).digest("hex").slice(0, 16);
    return d("tengu_session_file_read", {
        totalLines: Z,
        readLines: W,
        totalBytes: G,
        readBytes: f,
        offset: z,
        ..._ !== void 0 && {
            limit: _
        },
        ...h !== void 0 && {
            ext: h
        },
        ph: R,
        ...J !== void 0 && {
            messageID: J
        },
        is_session_memory: L === "session_memory",
        is_session_transcript: L === "session_transcript"
    }), {
        data: V
    }
}
// @from(Ln 235333, Col 0)
async function XV8(A, q = S36().maxTokens, K) {
    let Y = await $1().readFileBytes(A, K),
        z = Y.length;
    if (z === 0) throw Error(`Image file is empty: ${A}`);
    let _ = pF6(Y),
        w = _.split("/")[1] || "png",
        O;
    try {
        let H = await Bk(Y, z, w);
        O = bP1(H.buffer, H.mediaType, z, H.dimensions)
    } catch (H) {
        if (H instanceof pd) throw H;
        _6(H), O = bP1(Y, w, z)
    }
    if (Math.ceil(O.file.base64.length * 0.125) > q) try {
        let H = await d44(Y, q, _);
        return {
            type: "image",
            file: {
                base64: H.base64,
                type: H.mediaType,
                originalSize: z
            }
        }
    } catch (H) {
        _6(H);
        try {
            let j = await Promise.resolve().then(() => t(Zv8(), 1)),
                M = await (j.default || j)(Y).resize(400, 400, {
                    fit: "inside",
                    withoutEnlargement: !0
                }).jpeg({
                    quality: 20
                }).toBuffer();
            return bP1(M, "jpeg", z)
        } catch (j) {
            return _6(j), bP1(Y, w, z)
        }
    }
    return O
}
// @from(Ln 235374, Col 4)
im9
// @from(Ln 235374, Col 9)
rm9
// @from(Ln 235374, Col 14)
am9
// @from(Ln 235374, Col 19)
xP1
// @from(Ln 235374, Col 24)
R94
// @from(Ln 235374, Col 29)
tm9
// @from(Ln 235374, Col 34)
em9
// @from(Ln 235374, Col 39)
L9
// @from(Ln 235374, Col 43)
KB9 = `

<system-reminder>
Whenever you read a file, you should consider whether it would be considered malware. You CAN and SHOULD provide analysis of malware, what it is doing. But you MUST refuse to improve or augment the code. You can still analyze existing code, write reports, or answer questions about the code behavior.
</system-reminder>
`
// @from(Ln 235380, Col 4)
YB9
// @from(Ln 235380, Col 9)
h94
// @from(Ln 235381, Col 4)
RI = E(() => {
    K7();
    lA();
    A8();
    jR();
    Z7();
    VU();
    eF6();
    F9();
    MP1();
    k1();
    J_();
    uN8();
    RY();
    L21();
    T58();
    dN8();
    JA();
    Hf();
    SA();
    j94();
    F21();
    V1();
    hP1();
    HA();
    o$();
    z4();
    g1();
    od();
    im9 = new Set(["/dev/zero", "/dev/random", "/dev/urandom", "/dev/full", "/dev/stdin", "/dev/tty", "/dev/console", "/dev/stdout", "/dev/stderr", "/dev/fd/0", "/dev/fd/1", "/dev/fd/2"]);
    rm9 = String.fromCharCode(8239);
    am9 = [];
    xP1 = class xP1 extends Error {
        tokenCount;
        maxTokens;
        constructor(A, q) {
            super(`File content (${A} tokens) exceeds maximum allowed tokens (${q}). Use offset and limit parameters to read specific portions of the file, or search for specific content instead of reading the whole file.`);
            this.tokenCount = A;
            this.maxTokens = q;
            this.name = "MaxFileReadTokenExceededError"
        }
    };
    R94 = new Set(["png", "jpg", "jpeg", "gif", "webp"]);
    tm9 = F6(() => C.strictObject({
        file_path: C.string().describe("The absolute path to the file to read"),
        offset: C.number().optional().describe("The line number to start reading from. Only provide if the file is too large to read at once"),
        limit: C.number().optional().describe("The number of lines to read. Only provide if the file is too large to read at once."),
        pages: C.string().optional().describe(`Page range for PDF files (e.g., "1-5", "3", "10-20"). Only applicable to PDF files. Maximum ${P36} pages per request.`)
    })), em9 = F6(() => {
        let A = C.enum(["image/jpeg", "image/png", "image/gif", "image/webp"]);
        return C.discriminatedUnion("type", [C.object({
            type: C.literal("text"),
            file: C.object({
                filePath: C.string().describe("The path to the file that was read"),
                content: C.string().describe("The content of the file"),
                numLines: C.number().describe("Number of lines in the returned content"),
                startLine: C.number().describe("The starting line number"),
                totalLines: C.number().describe("Total number of lines in the file"),
                resultWasTruncated: C.boolean().optional().describe("True when output was clipped to the byte cap (partial content)")
            })
        }), C.object({
            type: C.literal("image"),
            file: C.object({
                base64: C.string().describe("Base64-encoded image data"),
                type: A.describe("The MIME type of the image"),
                originalSize: C.number().describe("Original file size in bytes"),
                dimensions: C.object({
                    originalWidth: C.number().optional().describe("Original image width in pixels"),
                    originalHeight: C.number().optional().describe("Original image height in pixels"),
                    displayWidth: C.number().optional().describe("Displayed image width in pixels (after resizing)"),
                    displayHeight: C.number().optional().describe("Displayed image height in pixels (after resizing)")
                }).optional().describe("Image dimension info for coordinate mapping")
            })
        }), C.object({
            type: C.literal("notebook"),
            file: C.object({
                filePath: C.string().describe("The path to the notebook file"),
                cells: C.array(C.any()).describe("Array of notebook cells")
            })
        }), C.object({
            type: C.literal("pdf"),
            file: C.object({
                filePath: C.string().describe("The path to the PDF file"),
                base64: C.string().describe("Base64-encoded PDF data"),
                originalSize: C.number().describe("Original file size in bytes")
            })
        }), C.object({
            type: C.literal("parts"),
            file: C.object({
                filePath: C.string().describe("The path to the PDF file"),
                originalSize: C.number().describe("Original file size in bytes"),
                count: C.number().describe("Number of pages extracted"),
                outputDir: C.string().describe("Directory containing extracted page images")
            })
        })])
    }), L9 = {
        name: s7,
        searchHint: "read files, images, PDFs, notebooks",
        maxResultSizeChars: 1e5,
        strict: !0,
        input_examples: [{
            file_path: "/Users/username/project/src/index.ts"
        }, {
            file_path: "/Users/username/project/README.md",
            limit: 100,
            offset: 50
        }],
        async description() {
            return PG7
        },
        async prompt() {
            let A = S36(),
                q = A.includeMaxSizeInPrompt ? `. Files larger than ${xq(A.maxSizeBytes)} will return an error; use offset and limit for larger files` : "",
                K = A.targetedRangeNudge ? GG7 : ZG7;
            return fG7(AB9(), q, K)
        },
        get inputSchema() {
            return tm9()
        },
        inputParamAliases: {
            filePath: "file_path",
            filepath: "file_path",
            path: "file_path"
        },
        get outputSchema() {
            return em9()
        },
        userFacingName: H94,
        getToolUseSummary: zV8,
        getActivityDescription(A) {
            let q = zV8(A);
            return q ? `Reading ${q}` : "Reading file"
        },
        isEnabled() {
            return !0
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        toAutoClassifierInput(A) {
            return A.file_path
        },
        isSearchOrReadCommand() {
            return {
                isSearch: !1,
                isRead: !0
            }
        },
        getPath({
            file_path: A
        }) {
            return A || G1()
        },
        async checkPermissions(A, q) {
            let K = q.getAppState();
            return gt(L9, A, K.toolPermissionContext)
        },
        renderToolUseMessage: Y94,
        renderToolUseTag: z94,
        renderToolUseProgressMessage: _94,
        renderToolResultMessage: w94,
        renderToolUseRejectedMessage: O94,
        renderToolUseErrorMessage: $94,
        async validateInput({
            file_path: A,
            pages: q
        }, K) {
            if (q !== void 0) {
                let $ = gw8(q);
                if (!$) return {
                    result: !1,
                    message: `Invalid pages parameter: "${q}". Use formats like "1-5", "3", or "10-20". Pages are 1-indexed.`,
                    errorCode: 7
                };
                if (($.lastPage === 1 / 0 ? P36 + 1 : $.lastPage - $.firstPage + 1) > P36) return {
                    result: !1,
                    message: `Page range "${q}" exceeds maximum of ${P36} pages per request. Please use a smaller range.`,
                    errorCode: 8
                }
            }
            let Y = L4(A),
                z = K.getAppState();
            if (ZX(Y, z.toolPermissionContext, "read", "deny") !== null) return {
                result: !1,
                message: "File is in a directory that is denied by your permission settings.",
                errorCode: 1
            };
            if (Y.startsWith("\\\\") || Y.startsWith("//")) return {
                result: !0
            };
            let O = g36.extname(Y).toLowerCase();
            if (p31(Y) && !JD6(O) && !R94.has(O.slice(1))) return {
                result: !1,
                message: `This tool cannot read binary files. The file appears to be a binary ${O} file. Please use appropriate tools for binary file analysis.`,
                errorCode: 4
            };
            if (nm9(Y)) return {
                result: !1,
                message: `Cannot read '${A}': this device file would block or produce infinite output.`,
                errorCode: 9
            };
            return {
                result: !0
            }
        },
        async call({
            file_path: A,
            offset: q = 1,
            limit: K = void 0,
            pages: Y
        }, z, _, w) {
            let {
                readFileState: O,
                fileReadingLimits: $
            } = z, H = S36(), j = $?.maxSizeBytes ?? H.maxSizeBytes, J = $?.maxTokens ?? H.maxTokens;
            if ($ !== void 0) d("tengu_file_read_limits_override", {
                hasMaxTokens: $.maxTokens !== void 0,
                hasMaxSizeBytes: $.maxSizeBytes !== void 0
            });
            let M = g36.extname(A).toLowerCase().slice(1),
                D = L4(A),
                X = G1();
            if (!t6(process.env.CLAUDE_CODE_SIMPLE)) {
                let P = await EW6([D], X);
                if (P.length > 0) {
                    for (let W of P) z.dynamicSkillDirTriggers?.add(W);
                    yW6(P).catch(() => {})
                }
                LW6([D], X)
            }
            try {
                return await L94(A, D, D, M, q, K, Y, j, J, O, z, w?.message.id)
            } catch (P) {
                if (P.code === "ENOENT") {
                    let Z = om9(D);
                    if (Z) try {
                        return await L94(A, D, Z, M, q, K, Y, j, J, O, z, w?.message.id)
                    } catch (N) {
                        if (N.code !== "ENOENT") throw N
                    }
                    let G = uP1(D),
                        f = await Ft(D),
                        v = `File does not exist. ${wZ} ${G1()}.`;
                    if (f) v += ` Did you mean ${f}?`;
                    else if (G) v += ` Did you mean ${G}?`;
                    throw Error(v)
                }
                throw P
            }
        },
        mapToolResultToToolResultBlockParam(A, q) {
            switch (A.type) {
                case "image":
                    return {
                        tool_use_id: q, type: "tool_result", content: [{
                            type: "image",
                            source: {
                                type: "base64",
                                data: A.file.base64,
                                media_type: A.file.type
                            }
                        }]
                    };
                case "notebook":
                    return O34(A.file.cells, q);
                case "pdf":
                    return {
                        tool_use_id: q, type: "tool_result", content: `PDF file read: ${A.file.filePath} (${xq(A.file.originalSize)})`
                    };
                case "parts":
                    return {
                        tool_use_id: q, type: "tool_result", content: `PDF pages extracted: ${A.file.count} page(s) from ${A.file.filePath} (${xq(A.file.originalSize)})`
                    };
                case "text": {
                    let K;
                    if (A.file.content || A.file.resultWasTruncated) {
                        if (K = A.file.content ? _B9(A) + qB9(A.file) : "", A.file.resultWasTruncated) K += `

... [output truncated at byte cap — ${A.file.numLines} of ${A.file.totalLines} lines shown. Use a smaller limit or different offset to read more.] ...`;
                        if (zB9()) K += KB9
                    } else K = A.file.totalLines === 0 ? "<system-reminder>Warning: the file exists but the contents are empty.</system-reminder>" : `<system-reminder>Warning: the file exists but is shorter than the provided offset (${A.file.startLine}). The file has ${A.file.totalLines} lines.</system-reminder>`;
                    return {
                        tool_use_id: q,
                        type: "tool_result",
                        content: K
                    }
                }
            }
        }
    };
    YB9 = new Set(["claude-opus-4-6"]);
    h94 = new WeakMap
})
// @from(Ln 235677, Col 4)
x94 = {}
// @from(Ln 235686, Col 0)
function OB9() {
    return w8("tengu_glacier_2xr", !1) ? "Deferred tools appear by name in <system-reminder> messages." : "Deferred tools appear by name in <available-deferred-tools> messages."
}
// @from(Ln 235690, Col 0)
function GX(A) {
    if (A.isMcp === !0) return !0;
    if (A.name === HZ) return !1;
    if (I94 && A.name === I94) return !1;
    if (w8("tengu_defer_all_bn4", !0)) return !0;
    return A.shouldDefer === !0
}
// @from(Ln 235698, Col 0)
function b94() {
    if (t6(process.env.CLAUDE_CODE_SEARCH_HINTS_IN_LIST)) return !0;
    if (xz(process.env.CLAUDE_CODE_SEARCH_HINTS_IN_LIST)) return !1;
    return w8("tengu_tst_hint_m7r", !1)
}
// @from(Ln 235704, Col 0)
function fp6(A) {
    if (b94() && A.searchHint) return `${A.name} — ${A.searchHint}`;
    return A.name
}
// @from(Ln 235709, Col 0)
function mP1() {
    return wB9 + OB9() + $B9
}
// @from(Ln 235712, Col 4)
I94
// @from(Ln 235712, Col 9)
HZ = "ToolSearch"
// @from(Ln 235713, Col 4)
wB9 = `Fetches full schema definitions for deferred tools so they can be called.

`
// @from(Ln 235716, Col 4)
$B9 = ` Until fetched, only the name is known — there is no parameter schema, so the tool cannot be invoked. This tool takes a query, matches it against the deferred tool list, and returns the matched tools' complete JSONSchema definitions inside a <functions> block. Once a tool's schema appears in that result, it is callable exactly like any tool defined at the top of the prompt.

Result format: each matched tool appears as one <function>{"description": "...", "name": "...", "parameters": {...}}</function> line inside the <functions> block — the same encoding as the tool list at the top of this prompt.

Query forms:
- "select:Read,Edit,Grep" — fetch these exact tools by name
- "notebook jupyter" — keyword search, up to max_results best matches
- "+slack send" — require "slack" in the name, rank by remaining terms`
// @from(Ln 235724, Col 4)
pt = E(() => {
    HA();
    A8();
    T1();
    I94 = (gu(), k4(UQ)).BRIEF_TOOL_NAME
})
// @from(Ln 235731, Col 0)
function u94() {
    return null
}
// @from(Ln 235735, Col 0)
function m94() {
    return null
}
// @from(Ln 235739, Col 0)
function B94() {
    return null
}
// @from(Ln 235743, Col 0)
function g94() {
    return null
}
// @from(Ln 235747, Col 0)
function F94() {
    return null
}
// @from(Ln 235750, Col 4)
d94 = {}
// @from(Ln 235758, Col 0)
function HB9(A) {
    return A.map((q) => q.name).sort().join(",")
}
// @from(Ln 235762, Col 0)
function jB9(A) {
    let q = HB9(A);
    if (WV8 !== q) k("ToolSearchTool: cache invalidated - deferred tools changed"), FP1.cache.clear?.(), WV8 = q
}
// @from(Ln 235767, Col 0)
function JB9() {
    FP1.cache.clear?.(), WV8 = null
}
// @from(Ln 235771, Col 0)
function BP1(A, q, K, Y) {
    return {
        data: {
            matches: A,
            query: q,
            total_deferred_tools: K,
            ...Y && Y.length > 0 ? {
                pending_mcp_servers: Y
            } : {}
        }
    }
}
// @from(Ln 235784, Col 0)
function p94(A) {
    if (A.startsWith("mcp__")) {
        let K = A.replace(/^mcp__/, "").toLowerCase();
        return {
            parts: K.split("__").flatMap((z) => z.split("_")).filter(Boolean),
            full: K.replace(/__/g, " ").replace(/_/g, " "),
            isMcp: !0
        }
    }
    let q = A.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " ").toLowerCase().split(/\s+/).filter(Boolean);
    return {
        parts: q,
        full: q.join(" "),
        isMcp: !1
    }
}
// @from(Ln 235801, Col 0)
function gP1(A, q) {
    return new RegExp(`\\b${RJ6(q)}\\b`).test(A)
}
// @from(Ln 235804, Col 0)
async function MB9(A, q, K, Y) {
    let z = A.toLowerCase().trim(),
        _ = q.find((M) => M.name.toLowerCase() === z) ?? K.find((M) => M.name.toLowerCase() === z);
    if (_) return [_.name];
    if (z.startsWith("mcp__") && z.length > 5) {
        let M = q.filter((D) => D.name.toLowerCase().startsWith(z)).slice(0, Y).map((D) => D.name);
        if (M.length > 0) return M
    }
    let w = z.split(/\s+/).filter((M) => M.length > 0),
        O = [],
        $ = [];
    for (let M of w)
        if (M.startsWith("+") && M.length > 1) O.push(M.slice(1));
        else $.push(M);
    let H = q;
    if (O.length > 0) H = (await Promise.all(q.map(async (D) => {
        let X = p94(D.name),
            W = (await FP1(D.name, K)).toLowerCase(),
            Z = D.searchHint?.toLowerCase() ?? "";
        return O.every((f) => X.parts.includes(f) || X.parts.some((v) => v.includes(f)) || gP1(W, f) || Z && gP1(Z, f)) ? D : null
    }))).filter((D) => D !== null);
    let j = O.length > 0 ? [...O, ...$] : w;
    return (await Promise.all(H.map(async (M) => {
        let D = p94(M.name),
            P = (await FP1(M.name, K)).toLowerCase(),
            W = M.searchHint?.toLowerCase() ?? "",
            Z = 0;
        for (let G of j) {
            if (D.parts.includes(G)) Z += D.isMcp ? 12 : 10;
            else if (D.parts.some((f) => f.includes(G))) Z += D.isMcp ? 6 : 5;
            if (D.full.includes(G) && Z === 0) Z += 3;
            if (W && gP1(W, G)) Z += 4;
            if (gP1(P, G)) Z += 2
        }
        return {
            name: M.name,
            score: Z
        }
    }))).filter((M) => M.score > 0).sort((M, D) => D.score - M.score).slice(0, Y).map((M) => M.name)
}
// @from(Ln 235844, Col 4)
Q94
// @from(Ln 235844, Col 9)
U94
// @from(Ln 235844, Col 14)
WV8 = null
// @from(Ln 235845, Col 4)
FP1
// @from(Ln 235845, Col 9)
Tp6
// @from(Ln 235846, Col 4)
pP1 = E(() => {
    K7();
    pt();
    fR();
    H1();
    V1();
    U4();
    Q94 = F6(() => C.object({
        query: C.string().describe('Query to find deferred tools. Use "select:<tool_name>" for direct selection, or keywords to search.'),
        max_results: C.number().optional().default(5).describe("Maximum number of results to return (default: 5)")
    })), U94 = F6(() => C.object({
        matches: C.array(C.string()),
        query: C.string(),
        total_deferred_tools: C.number(),
        pending_mcp_servers: C.array(C.string()).optional()
    }));
    FP1 = e1(async (A, q) => {
        let K = dK(q, A);
        if (!K) return "";
        return K.prompt({
            getToolPermissionContext: async () => ({
                mode: "default",
                additionalWorkingDirectories: new Map,
                alwaysAllowRules: {},
                alwaysDenyRules: {},
                alwaysAskRules: {},
                isBypassPermissionsModeAvailable: !1
            }),
            tools: q,
            agents: []
        })
    }, (A) => A);
    Tp6 = {
        isEnabled() {
            return dk()
        },
        isConcurrencySafe() {
            return !0
        },
        isReadOnly() {
            return !0
        },
        toAutoClassifierInput() {
            return ""
        },
        name: HZ,
        maxResultSizeChars: 1e5,
        async description() {
            return mP1()
        },
        async prompt() {
            return mP1()
        },
        get inputSchema() {
            return Q94()
        },
        get outputSchema() {
            return U94()
        },
        async call(A, {
            options: {
                tools: q
            },
            getAppState: K
        }) {
            let {
                query: Y,
                max_results: z = 5
            } = A, _ = q.filter(GX);
            jB9(_);
            async function w() {
                let J = K().mcp.clients.filter((M) => M.type === "pending");
                return J.length > 0 ? J.map((M) => M.name) : void 0
            }

            function O(j, J) {
                d("tengu_tool_search_outcome", {
                    query: Y,
                    queryType: J,
                    matchCount: j.length,
                    totalDeferredTools: _.length,
                    maxResults: z,
                    hasMatches: j.length > 0
                })
            }
            let $ = Y.match(/^select:(.+)$/i);
            if ($) {
                let j = $[1].split(",").map((D) => D.trim()).filter(Boolean),
                    J = [],
                    M = [];
                for (let D of j) {
                    let X = dK(_, D) ?? dK(q, D);
                    if (X) {
                        if (!J.includes(X.name)) J.push(X.name)
                    } else M.push(D)
                }
                if (J.length === 0) {
                    k(`ToolSearchTool: select failed — none found: ${M.join(", ")}`), O([], "select");
                    let D = await w();
                    return BP1([], Y, _.length, D)
                }
                if (M.length > 0) k(`ToolSearchTool: partial select — found: ${J.join(", ")}, missing: ${M.join(", ")}`);
                else k(`ToolSearchTool: selected ${J.join(", ")}`);
                return O(J, "select"), BP1(J, Y, _.length)
            }
            let H = await MB9(Y, _, q, z);
            if (k(`ToolSearchTool: keyword search for "${Y}", found ${H.length} matches`), O(H, "keyword"), H.length === 0) {
                let j = await w();
                return BP1(H, Y, _.length, j)
            }
            return BP1(H, Y, _.length)
        },
        async checkPermissions(A) {
            return {
                behavior: "allow",
                updatedInput: A
            }
        },
        renderToolUseMessage: u94,
        userFacingName: () => "",
        renderToolUseRejectedMessage: m94,
        renderToolUseErrorMessage: B94,
        renderToolUseProgressMessage: g94,
        renderToolResultMessage: F94,
        mapToolResultToToolResultBlockParam(A, q) {
            if (A.matches.length === 0) {
                let K = "No matching deferred tools found";
                if (A.pending_mcp_servers && A.pending_mcp_servers.length > 0) K += `. Some MCP servers are still connecting: ${A.pending_mcp_servers.join(", ")}. Their tools will become available shortly — try searching again.`;
                return {
                    type: "tool_result",
                    tool_use_id: q,
                    content: K
                }
            }
            return {
                type: "tool_result",
                tool_use_id: q,
                content: A.matches.map((K) => ({
                    type: "tool_reference",
                    tool_name: K
                }))
            }
        }
    }
})
// @from(Ln 235994, Col 0)
async function QP1(A, q) {
    return
}
// @from(Ln 235997, Col 4)
DB9
// @from(Ln 235997, Col 9)
XB9
// @from(Ln 235998, Col 4)
ZV8 = E(() => {
    V1();
    U4();
    g1();
    DB9 = e1(async () => {
        return null
    }), XB9 = e1(async () => {
        return null
    })
})
// @from(Ln 236008, Col 4)
TR = "TaskCreate"
// @from(Ln 236009, Col 4)
ck = "TaskUpdate"
// @from(Ln 236010, Col 4)
oH = "Skill"
// @from(Ln 236012, Col 0)
function M$(A) {
    return typeof A === "object" && A !== null && "type" in A && A.type === "in_process_teammate"
}
// @from(Ln 236016, Col 0)
function vR(A) {
    let {
        viewingAgentTaskId: q,
        tasks: K
    } = A;
    if (!q) return;
    let Y = K[q];
    if (!Y) return;
    if (!M$(Y)) return;
    return Y
}
// @from(Ln 236028, Col 0)
function l94(A) {
    let q = vR(A);
    if (q) return {
        type: "viewed",
        task: q
    };
    return {
        type: "leader"
    }
}
// @from(Ln 236039, Col 0)
function i94(A) {
    return vR(A) !== void 0
}
// @from(Ln 236042, Col 4)
p36 = () => {}
// @from(Ln 236044, Col 0)
function n94(A) {
    if (!A) return;
    let q = Object.values(A).filter((K) => K.type === "image").map((K) => K.id);
    return q.length > 0 ? q : void 0
}
// @from(Ln 236049, Col 4)
s94 = {}
// @from(Ln 236063, Col 0)
function UP1(A) {
    if (Number(process.env.SLASH_COMMAND_TOOL_CHAR_BUDGET)) return Number(process.env.SLASH_COMMAND_TOOL_CHAR_BUDGET);
    if (A) return Math.floor(A * o94 * r94);
    return a94
}
// @from(Ln 236069, Col 0)
function GV8(A) {
    return A.whenToUse ? `${A.description} - ${A.whenToUse}` : A.description
}
// @from(Ln 236073, Col 0)
function PB9(A) {
    if (A.name !== A.userFacingName() && A.type === "prompt" && A.source === "plugin") k(`Skill prompt: showing "${A.name}" (userFacingName="${A.userFacingName()}")`);
    return `- ${A.name}: ${GV8(A)}`
}
// @from(Ln 236078, Col 0)
function fV8(A, q) {
    if (A.length === 0) return "";
    let K = UP1(q),
        Y = A.map((D) => ({
            cmd: D,
            full: PB9(D)
        }));
    if (Y.reduce((D, X) => D + X.full.length, 0) + (Y.length - 1) <= K) return Y.map((D) => D.full).join(`
`);
    let _ = new Set,
        w = [];
    for (let D = 0; D < A.length; D++) {
        let X = A[D];
        if (X.type === "prompt" && X.source === "bundled") _.add(D);
        else w.push(X)
    }
    let O = Y.reduce((D, X, P) => _.has(P) ? D + X.full.length + 1 : D, 0),
        $ = K - O;
    if (w.length === 0) return Y.map((D) => D.full).join(`
`);
    let H = w.reduce((D, X) => D + X.name.length + 4, 0) + (w.length - 1),
        j = $ - H,
        J = Math.floor(j / w.length);
    if (J < WB9) return A.map((D, X) => _.has(X) ? Y[X].full : `- ${D.name}`).join(`
`);
    let M = w.filter((D) => GV8(D).length > J).length;
    return A.map((D, X) => {
        if (_.has(X)) return Y[X].full;
        let P = GV8(D),
            W = P.length > J ? P.slice(0, J - 1) + "…" : P;
        return `- ${D.name}: ${W}`
    }).join(`
`)
}
// @from(Ln 236112, Col 0)
async function TV8(A) {
    let q = await NR(A);
    return {
        totalCommands: q.length,
        includedCommands: q.length
    }
}
// @from(Ln 236120, Col 0)
function vV8(A) {
    return NR(A)
}
// @from(Ln 236124, Col 0)
function NV8() {
    dP1.cache?.clear?.()
}
// @from(Ln 236127, Col 0)
async function ZB9(A) {
    try {
        let q = await vp6(A);
        return {
            totalSkills: q.length,
            includedSkills: q.length
        }
    } catch (q) {
        return _6(q instanceof Error ? q : Error("Failed to get skill info")), {
            totalSkills: 0,
            includedSkills: 0
        }
    }
}
// @from(Ln 236141, Col 4)
r94 = 0.02
// @from(Ln 236142, Col 4)
o94 = 4
// @from(Ln 236143, Col 4)
a94 = 16000
// @from(Ln 236144, Col 4)
WB9 = 20
// @from(Ln 236145, Col 4)
dP1
// @from(Ln 236146, Col 4)
Q36 = E(() => {
    D$();
    H1();
    k1();
    D$();
    eL6();
    vz();
    V1();
    dP1 = e1(async (A) => {
        return `Execute a skill within the main conversation

When users ask you to perform tasks, check if any of the available skills match. Skills provide specialized capabilities and domain knowledge.

When users reference a "slash command" or "/<something>" (e.g., "/commit", "/review-pr"), they are referring to a skill. Use this tool to invoke it.

How to invoke:
- Use this tool with the skill name and optional arguments
- Examples:
  - \`skill: "pdf"\` - invoke the pdf skill
  - \`skill: "commit", args: "-m 'Fix bug'"\` - invoke with arguments
  - \`skill: "review-pr", args: "123"\` - invoke with arguments
  - \`skill: "ms-office-suite:pdf"\` - invoke using fully qualified name

Important:
- Available skills are listed in system-reminder messages in the conversation
- When a skill matches the user's request, this is a BLOCKING REQUIREMENT: invoke the relevant Skill tool BEFORE generating any other response about the task
- NEVER mention a skill without actually calling this tool
- Do not invoke a skill that is already running
- Do not use this tool for built-in CLI commands (like /help, /clear, etc.)
- If you see a <${XP}> tag in the current conversation turn, the skill has ALREADY been loaded - follow the instructions directly instead of calling this tool again
`
    })
})
// @from(Ln 236180, Col 0)
function t94(A, q) {
    let K = Object.create(null),
        Y = 0;
    for (let z of A) {
        let _ = q(z, Y++);
        if (K[_] === void 0) K[_] = [];
        K[_].push(z)
    }
    return K
}
// @from(Ln 236191, Col 0)
function U36(A, q) {
    let K = R1(),
        Y = {
            type: "queue-operation",
            operation: A,
            timestamp: new Date().toISOString(),
            sessionId: K,
            ...q !== void 0 && {
                content: q
            }
        };
    kV8(Y)
}
// @from(Ln 236205, Col 0)
function Qt() {
    e94 = Object.freeze([...xY]);
    for (let A of VV8) A()
}
// @from(Ln 236210, Col 0)
function hW6(A) {
    return VV8.add(A), () => {
        VV8.delete(A)
    }
}
// @from(Ln 236216, Col 0)
function cP1() {
    return e94
}
// @from(Ln 236220, Col 0)
function AY4() {
    return [...xY]
}
// @from(Ln 236224, Col 0)
function qY4() {
    return xY.length
}
// @from(Ln 236228, Col 0)
function d36() {
    return xY.length > 0
}
// @from(Ln 236232, Col 0)
function _0(A) {
    xY.push({
        ...A,
        priority: A.priority ?? "next"
    }), Qt(), U36("enqueue", typeof A.value === "string" ? A.value : void 0)
}
// @from(Ln 236239, Col 0)
function w0(A) {
    xY.push({
        ...A,
        priority: A.priority ?? "later"
    }), Qt(), U36("enqueue", typeof A.value === "string" ? A.value : void 0)
}
// @from(Ln 236246, Col 0)
function lP1() {
    if (xY.length === 0) return;
    let A = 0,
        q = RW6[xY[0].priority ?? "next"];
    for (let Y = 1; Y < xY.length; Y++) {
        let z = RW6[xY[Y].priority ?? "next"];
        if (z < q) A = Y, q = z
    }
    let [K] = xY.splice(A, 1);
    return Qt(), U36("dequeue"), K
}
// @from(Ln 236258, Col 0)
function KY4() {
    if (xY.length === 0) return;
    let A = 0,
        q = RW6[xY[0].priority ?? "next"];
    for (let K = 1; K < xY.length; K++) {
        let Y = RW6[xY[K].priority ?? "next"];
        if (Y < q) A = K, q = Y
    }
    return xY[A]
}
// @from(Ln 236269, Col 0)
function iP1(A) {
    let q = [],
        K = [];
    for (let Y of xY)
        if (A(Y)) q.push(Y);
        else K.push(Y);
    if (q.length === 0) return [];
    xY.length = 0, xY.push(...K), Qt();
    for (let Y of q) U36("dequeue");
    return q
}
// @from(Ln 236281, Col 0)
function YY4(A) {
    if (A.length === 0) return;
    let q = xY.length;
    for (let K = xY.length - 1; K >= 0; K--)
        if (A.some((Y) => Y.value === xY[K].value)) xY.splice(K, 1);
    if (xY.length !== q) Qt();
    for (let K of A) U36("remove")
}
// @from(Ln 236290, Col 0)
function zY4(A) {
    let q = [];
    for (let K = xY.length - 1; K >= 0; K--)
        if (A(xY[K])) q.unshift(xY.splice(K, 1)[0]);
    if (q.length > 0) {
        Qt();
        for (let K of q) U36("remove")
    }
    return q
}
// @from(Ln 236301, Col 0)
function _Y4() {
    if (xY.length === 0) return;
    xY.length = 0, Qt()
}
// @from(Ln 236306, Col 0)
function fB9(A) {
    return !GB9.has(A)
}
// @from(Ln 236310, Col 0)
function Ut(A) {
    return fB9(A.mode) && !A.isMeta
}
// @from(Ln 236314, Col 0)
function TB9(A) {
    if (typeof A === "string") return A;
    let q = [];
    for (let K of A)
        if (K.type === "text") q.push(K.text);
    return q.join(`
`)
}
// @from(Ln 236323, Col 0)
function vB9(A, q) {
    if (typeof A === "string") return [];
    let K = [],
        Y = 0;
    for (let z of A)
        if (z.type === "image" && z.source.type === "base64") K.push({
            id: q + Y,
            type: "image",
            content: z.source.data,
            mediaType: z.source.media_type,
            filename: `image${Y+1}`
        }), Y++;
    return K
}
// @from(Ln 236338, Col 0)
function nP1(A, q) {
    if (xY.length === 0) return;
    let {
        editable: K = [],
        nonEditable: Y = []
    } = t94([...xY], (H) => Ut(H) ? "editable" : "nonEditable");
    if (K.length === 0) return;
    let z = K.map((H) => TB9(H.value)),
        _ = [...z, A].filter(Boolean).join(`
`),
        w = z.join(`
`).length + 1 + q,
        O = [],
        $ = Date.now();
    for (let H of K) {
        if (H.pastedContents) {
            for (let J of Object.values(H.pastedContents))
                if (J.type === "image") O.push(J)
        }
        let j = vB9(H.value, $);
        O.push(...j), $ += j.length
    }
    for (let H of K) U36("popAll", typeof H.value === "string" ? H.value : void 0);
    return xY.length = 0, xY.push(...Y), Qt(), {
        text: _,
        cursorOffset: w,
        images: O
    }
}
// @from(Ln 236368, Col 0)
function rP1(A) {
    let q = RW6[A];
    return xY.filter((K) => RW6[K.priority ?? "next"] <= q)
}
// @from(Ln 236372, Col 4)
xY
// @from(Ln 236372, Col 8)
e94
// @from(Ln 236372, Col 13)
VV8
// @from(Ln 236372, Col 18)
RW6
// @from(Ln 236372, Col 23)
GB9
// @from(Ln 236373, Col 4)
aH = E(() => {
    Oq();
    T1();
    xY = [], e94 = Object.freeze([]), VV8 = new Set;
    RW6 = {
        now: 0,
        next: 1,
        later: 2
    };
    GB9 = new Set(["task-notification"])
})
// @from(Ln 236388, Col 0)
function c36(A) {
    if (!q7()) return;
    if (Np6.length >= VB9) Np6.shift();
    Np6.push(A)
}
// @from(Ln 236394, Col 0)
function oP1() {
    if (Np6.length === 0) return [];
    return Np6.splice(0).map((q) => ({
        ...q,
        uuid: NB9(),
        session_id: R1()
    }))
}
// @from(Ln 236402, Col 4)
VB9 = 1000
// @from(Ln 236403, Col 4)
Np6
// @from(Ln 236404, Col 4)
Vp6 = E(() => {
    T1();
    Np6 = []
})
// @from(Ln 236409, Col 0)
function i9(A, q, K) {
    q((Y) => {
        let z = Y.tasks?.[A];
        if (!z) return Y;
        let _ = K(z);
        if (_ === z) return Y;
        return {
            ...Y,
            tasks: {
                ...Y.tasks,
                [A]: _
            }
        }
    })
}
// @from(Ln 236425, Col 0)
function Zf(A, q) {
    q((K) => ({
        ...K,
        tasks: {
            ...K.tasks,
            [A.id]: A
        }
    })), c36({
        type: "system",
        subtype: "task_started",
        task_id: A.id,
        tool_use_id: A.toolUseId,
        description: A.description,
        task_type: A.type,
        prompt: "prompt" in A ? A.prompt : void 0
    })
}
// @from(Ln 236443, Col 0)
function VR(A, q) {
    q((K) => {
        let Y = K.tasks?.[A];
        if (!Y) return K;
        if (!LJ6(Y.status)) return K;
        if (!Y.notified) return K;
        let {
            [A]: z, ..._
        } = K.tasks;
        return {
            ...K,
            tasks: _
        }
    })
}
// @from(Ln 236459, Col 0)
function EV8(A) {
    let q = A.tasks ?? {};
    return Object.values(q).filter((K) => K.status === "running")
}
// @from(Ln 236463, Col 0)
async function wY4(A) {
    let q = [],
        K = {},
        Y = [],
        z = A.tasks ?? {};
    for (let _ of Object.values(z)) {
        if (_.notified) switch (_.status) {
            case "completed":
            case "failed":
            case "killed":
                Y.push(_.id);
                continue;
            case "pending":
                continue;
            case "running":
                break
        }
        if (_.status === "running") {
            let w = await Z97(_.id, _.outputOffset);
            if (w.content) K[_.id] = w.newOffset
        }
    }
    return {
        attachments: q,
        updatedTaskOffsets: K,
        evictedTaskIds: Y
    }
}
// @from(Ln 236492, Col 0)
function OY4(A, q, K) {
    let Y = Object.keys(q);
    if (Y.length === 0 && K.length === 0) return;
    A((z) => {
        let _ = !1,
            w = {
                ...z.tasks
            };
        for (let O of Y) {
            let $ = w[O];
            if ($?.status === "running") w[O] = {
                ...$,
                outputOffset: q[O]
            }, _ = !0
        }
        for (let O of K)
            if (w[O]) delete w[O], _ = !0;
        return _ ? {
            ...z,
            tasks: w
        } : z
    })
}
// @from(Ln 236515, Col 4)
mB = 3000
// @from(Ln 236516, Col 4)
O0 = E(() => {
    qL();
    SM();
    aH();
    Vp6();
    vz()
})
// @from(Ln 236523, Col 4)
dt = "EnterPlanMode"
// @from(Ln 236524, Col 4)
Fw = "AskUserQuestion"
// @from(Ln 236525, Col 4)
$Y4 = 12
// @from(Ln 236526, Col 4)
HY4 = "Asks the user multiple choice questions to gather information, clarify ambiguity, understand preferences, make decisions or offer them choices."
// @from(Ln 236527, Col 4)
jY4
// @from(Ln 236527, Col 9)
yV8