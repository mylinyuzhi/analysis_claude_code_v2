
// @from(Ln 235507, Col 4)
du1 = v(() => {
    c$();
    Z6();
    y6();
    c$();
    an1();
    vz();
    d0A = KA(async (A) => {
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
- If you see a <${SG}> tag in the current conversation turn, the skill has ALREADY been loaded - follow the instructions directly instead of calling this tool again
`
    })
})
// @from(Ln 235540, Col 0)
function sO6() {
    let A = process.env.CLAUDE_CODE_ENVIRONMENT_KIND;
    if (A === "byoc" || A === "anthropic_cloud") return A;
    return null
}
// @from(Ln 235545, Col 4)
c0A = v(() => {
    Z6()
})
// @from(Ln 235552, Col 0)
function $T9(A) {
    return HT9(4).readUInt32BE(0) % A
}
// @from(Ln 235556, Col 0)
function l0A(A) {
    return A[$T9(A.length)]
}
// @from(Ln 235560, Col 0)
function tO6() {
    let A = l0A(gU7),
        q = l0A(pU7),
        K = l0A(UU7);
    return `${A}-${q}-${K}`
}
// @from(Ln 235566, Col 4)
gU7
// @from(Ln 235566, Col 9)
UU7
// @from(Ln 235566, Col 14)
pU7
// @from(Ln 235566, Col 19)
DDw
// @from(Ln 235567, Col 4)
i0A = v(() => {
    gU7 = ["abundant", "ancient", "bright", "calm", "cheerful", "clever", "cozy", "curious", "dapper", "dazzling", "deep", "delightful", "eager", "elegant", "enchanted", "fancy", "fluffy", "gentle", "gleaming", "golden", "graceful", "happy", "hidden", "humble", "jolly", "joyful", "keen", "kind", "lively", "lovely", "lucky", "luminous", "magical", "majestic", "mellow", "merry", "mighty", "misty", "noble", "peaceful", "playful", "polished", "precious", "proud", "quiet", "quirky", "radiant", "rosy", "serene", "shiny", "silly", "sleepy", "smooth", "snazzy", "snug", "snuggly", "soft", "sparkling", "spicy", "splendid", "sprightly", "starry", "steady", "sunny", "swift", "tender", "tidy", "toasty", "tranquil", "twinkly", "valiant", "vast", "velvet", "vivid", "warm", "whimsical", "wild", "wise", "witty", "wondrous", "zany", "zesty", "zippy", "breezy", "bubbly", "buzzing", "cheeky", "cosmic", "cozy", "crispy", "crystalline", "cuddly", "drifting", "dreamy", "effervescent", "ethereal", "fizzy", "flickering", "floating", "floofy", "fluttering", "foamy", "frolicking", "fuzzy", "giggly", "glimmering", "glistening", "glittery", "glowing", "goofy", "groovy", "harmonic", "hazy", "humming", "iridescent", "jaunty", "jazzy", "jiggly", "melodic", "moonlit", "mossy", "nifty", "peppy", "prancy", "purrfect", "purring", "quizzical", "rippling", "rustling", "shimmering", "shimmying", "snappy", "snoopy", "squishy", "swirling", "ticklish", "tingly", "twinkling", "velvety", "wiggly", "wobbly", "woolly", "zazzy", "abstract", "adaptive", "agile", "async", "atomic", "binary", "cached", "compiled", "composed", "compressed", "concurrent", "cryptic", "curried", "declarative", "delegated", "distributed", "dynamic", "eager", "elegant", "encapsulated", "enumerated", "eventual", "expressive", "federated", "functional", "generic", "greedy", "hashed", "idempotent", "immutable", "imperative", "indexed", "inherited", "iterative", "lazy", "lexical", "linear", "linked", "logical", "memoized", "modular", "mutable", "nested", "optimized", "parallel", "parsed", "partitioned", "piped", "polymorphic", "pure", "reactive", "recursive", "refactored", "reflective", "replicated", "resilient", "robust", "scalable", "sequential", "serialized", "sharded", "sorted", "staged", "stateful", "stateless", "streamed", "structured", "synchronous", "synthetic", "temporal", "transient", "typed", "unified", "validated", "vectorized", "virtual"], UU7 = ["aurora", "avalanche", "blossom", "breeze", "brook", "bubble", "canyon", "cascade", "cloud", "clover", "comet", "coral", "cosmos", "creek", "crescent", "crystal", "dawn", "dewdrop", "dusk", "eclipse", "ember", "feather", "fern", "firefly", "flame", "flurry", "fog", "forest", "frost", "galaxy", "garden", "glacier", "glade", "grove", "harbor", "horizon", "island", "lagoon", "lake", "leaf", "lightning", "meadow", "meteor", "mist", "moon", "moonbeam", "mountain", "nebula", "nova", "ocean", "orbit", "pebble", "petal", "pine", "planet", "pond", "puddle", "quasar", "rain", "rainbow", "reef", "ripple", "river", "shore", "sky", "snowflake", "spark", "spring", "star", "stardust", "starlight", "storm", "stream", "summit", "sun", "sunbeam", "sunrise", "sunset", "thunder", "tide", "twilight", "valley", "volcano", "waterfall", "wave", "willow", "wind", "alpaca", "axolotl", "badger", "bear", "beaver", "bee", "bird", "bumblebee", "bunny", "cat", "chipmunk", "crab", "crane", "deer", "dolphin", "dove", "dragon", "dragonfly", "duckling", "eagle", "elephant", "falcon", "finch", "flamingo", "fox", "frog", "giraffe", "goose", "hamster", "hare", "hedgehog", "hippo", "hummingbird", "jellyfish", "kitten", "koala", "ladybug", "lark", "lemur", "llama", "lobster", "lynx", "manatee", "meerkat", "moth", "narwhal", "newt", "octopus", "otter", "owl", "panda", "parrot", "peacock", "pelican", "penguin", "phoenix", "piglet", "platypus", "pony", "porcupine", "puffin", "puppy", "quail", "quokka", "rabbit", "raccoon", "raven", "robin", "salamander", "seahorse", "seal", "sloth", "snail", "sparrow", "sphinx", "squid", "squirrel", "starfish", "swan", "tiger", "toucan", "turtle", "unicorn", "walrus", "whale", "wolf", "wombat", "wren", "yeti", "zebra", "acorn", "anchor", "balloon", "beacon", "biscuit", "blanket", "bonbon", "book", "boot", "cake", "candle", "candy", "castle", "charm", "clock", "cocoa", "cookie", "crayon", "crown", "cupcake", "donut", "dream", "fairy", "fiddle", "flask", "flute", "fountain", "gadget", "gem", "gizmo", "globe", "goblet", "hammock", "harp", "haven", "hearth", "honey", "journal", "kazoo", "kettle", "key", "kite", "lantern", "lemon", "lighthouse", "locket", "lollipop", "mango", "map", "marble", "marshmallow", "melody", "mitten", "mochi", "muffin", "music", "nest", "noodle", "oasis", "origami", "pancake", "parasol", "peach", "pearl", "pebble", "pie", "pillow", "pinwheel", "pixel", "pizza", "plum", "popcorn", "pretzel", "prism", "pudding", "pumpkin", "puzzle", "quiche", "quill", "quilt", "riddle", "rocket", "rose", "scone", "scroll", "shell", "sketch", "snowglobe", "sonnet", "sparkle", "spindle", "sprout", "sundae", "swing", "taco", "teacup", "teapot", "thimble", "toast", "token", "tome", "tower", "treasure", "treehouse", "trinket", "truffle", "tulip", "umbrella", "waffle", "wand", "whisper", "whistle", "widget", "wreath", "zephyr", "abelson", "adleman", "aho", "allen", "babbage", "bachman", "backus", "barto", "bengio", "bentley", "blum", "boole", "brooks", "catmull", "cerf", "cherny", "church", "clarke", "cocke", "codd", "conway", "cook", "corbato", "cray", "curry", "dahl", "diffie", "dijkstra", "dongarra", "eich", "emerson", "engelbart", "feigenbaum", "floyd", "gosling", "graham", "gray", "hamming", "hanrahan", "hartmanis", "hejlsberg", "hellman", "hennessy", "hickey", "hinton", "hoare", "hollerith", "hopcroft", "hopper", "iverson", "kahan", "kahn", "karp", "kay", "kernighan", "knuth", "kurzweil", "lamport", "lampson", "lecun", "lerdorf", "liskov", "lovelace", "matsumoto", "mccarthy", "metcalfe", "micali", "milner", "minsky", "moler", "moore", "naur", "neumann", "newell", "nygaard", "papert", "parnas", "pascal", "patterson", "pearl", "perlis", "pike", "pnueli", "rabin", "reddy", "ritchie", "rivest", "rossum", "russell", "scott", "sedgewick", "shamir", "shannon", "sifakis", "simon", "stallman", "stearns", "steele", "stonebraker", "stroustrup", "sutherland", "sutton", "tarjan", "thacker", "thompson", "torvalds", "turing", "ullman", "valiant", "wadler", "wall", "wigderson", "wilkes", "wilkinson", "wirth", "wozniak", "yao"], pU7 = ["baking", "beaming", "booping", "bouncing", "brewing", "bubbling", "chasing", "churning", "coalescing", "conjuring", "cooking", "crafting", "crunching", "cuddling", "dancing", "dazzling", "discovering", "doodling", "dreaming", "drifting", "enchanting", "exploring", "finding", "floating", "fluttering", "foraging", "forging", "frolicking", "gathering", "giggling", "gliding", "greeting", "growing", "hatching", "herding", "honking", "hopping", "hugging", "humming", "imagining", "inventing", "jingling", "juggling", "jumping", "kindling", "knitting", "launching", "leaping", "mapping", "marinating", "meandering", "mixing", "moseying", "munching", "napping", "nibbling", "noodling", "orbiting", "painting", "percolating", "petting", "plotting", "pondering", "popping", "prancing", "purring", "puzzling", "questing", "riding", "roaming", "rolling", "sauteeing", "scribbling", "seeking", "shimmying", "singing", "skipping", "sleeping", "snacking", "sniffing", "snuggling", "soaring", "sparking", "spinning", "splashing", "sprouting", "squishing", "stargazing", "stirring", "strolling", "swimming", "swinging", "tickling", "tinkering", "toasting", "tumbling", "twirling", "waddling", "wandering", "watching", "weaving", "whistling", "wibbling", "wiggling", "wishing", "wobbling", "wondering", "yawning", "zooming"];
    DDw = gU7.length * pU7.length * UU7.length
})
// @from(Ln 235571, Col 4)
eO6 = "ExitPlanMode"
// @from(Ln 235572, Col 4)
bW = "ExitPlanMode"
// @from(Ln 235585, Col 0)
function Rj1(A) {
    let q = A ?? U6(),
        K = _61(),
        Y = K.get(q);
    if (!Y) {
        let z = UM();
        for (let w = 0; w < DT9; w++) {
            Y = tO6();
            let H = da(z, `${Y}.md`);
            if (!b1().existsSync(H)) break
        }
        K.set(q, Y)
    }
    return Y
}
// @from(Ln 235601, Col 0)
function n0A(A, q) {
    _61().set(A, q)
}
// @from(Ln 235605, Col 0)
function dU7(A) {
    let q = A ?? U6();
    _61().delete(q)
}
// @from(Ln 235610, Col 0)
function UM() {
    let q = l4().plansDirectory,
        K;
    if (q) {
        let Y = h6(),
            z = _T9(Y, q);
        if (!z.startsWith(Y + JT9) && z !== Y) K1(Error(`plansDirectory must be within project root: ${q}`)), K = da(O8(), "plans");
        else K = z
    } else K = da(O8(), "plans");
    if (!b1().existsSync(K)) try {
        b1().mkdirSync(K)
    } catch (Y) {
        K1(Y instanceof Error ? Y : Error(String(Y)))
    }
    return K
}
// @from(Ln 235627, Col 0)
function uW(A) {
    let q = Rj1(U6());
    if (!A) return da(UM(), `${q}.md`);
    return da(UM(), `${q}-agent-${A}.md`)
}
// @from(Ln 235633, Col 0)
function pD(A) {
    let q = uW(A);
    if (!b1().existsSync(q)) return null;
    try {
        return b1().readFileSync(q, {
            encoding: "utf-8"
        })
    } catch (K) {
        return K1(K instanceof Error ? K : Error(String(K))), null
    }
}
// @from(Ln 235644, Col 0)
async function A_6(A, q) {
    let K = A.messages.find((w) => w.slug)?.slug;
    if (!K) return !1;
    let Y = q ?? U6();
    n0A(Y, K);
    let z = da(UM(), `${K}.md`);
    try {
        return b1().readFileSync(z, {
            encoding: "utf-8"
        }), !0
    } catch {
        if (sO6() === null) return !1;
        K1(Error(`Plan file missing during resume: ${z}. Attempting recovery.`));
        let w = MT9(A.messages, "plan"),
            H = null;
        if (w && w.content.length > 0) H = w.content, K1(Error(`Plan recovered from file snapshot, ${H.length} chars`));
        else if (H = jT9(A), H) K1(Error(`Plan recovered from message history, ${H.length} chars`));
        if (H) try {
            return await XT9(z, H, {
                encoding: "utf-8"
            }), !0
        } catch ($) {
            return K1($ instanceof Error ? $ : Error(String($))), !1
        }
        return K1(Error("Plan file recovery failed: no file snapshot or plan content found in message history")), !1
    }
}
// @from(Ln 235672, Col 0)
function jT9(A) {
    for (let q = A.messages.length - 1; q >= 0; q--) {
        let K = A.messages[q];
        if (!K) continue;
        if (K.type === "assistant") {
            let {
                content: Y
            } = K.message;
            if (Array.isArray(Y)) {
                for (let z of Y)
                    if (z.type === "tool_use" && z.name === bW) {
                        let H = z.input?.plan;
                        if (typeof H === "string" && H.length > 0) return H
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
// @from(Ln 235703, Col 0)
function MT9(A, q) {
    for (let K = A.length - 1; K >= 0; K--) {
        let Y = A[K];
        if (Y?.type === "system" && "subtype" in Y && Y.subtype === "file_snapshot" && "snapshotFiles" in Y) return Y.snapshotFiles.find((w) => w.key === q)
    }
    return
}
// @from(Ln 235710, Col 0)
async function q_6() {
    if (sO6() === null) return;
    try {
        let A = [],
            q = pD();
        if (q) A.push({
            key: "plan",
            path: uW(),
            content: q
        });
        let K = da(O8(), "todos"),
            Y = U6();
        try {
            let $ = da(K, `${Y}-agent-${Y}.json`),
                O = b1().readFileSync($, {
                    encoding: "utf-8"
                });
            if (O && O !== "[]") A.push({
                key: "todo",
                path: $,
                content: O
            })
        } catch {}
        if (A.length === 0) return;
        let z = A.map(($) => $.key).join(", ");
        K1(Error(`File snapshot: persisting ${A.length} file(s) to transcript [${z}]`));
        let w = {
                type: "system",
                subtype: "file_snapshot",
                content: "File snapshot",
                level: "info",
                isMeta: !0,
                timestamp: new Date().toISOString(),
                uuid: OT9(),
                snapshotFiles: A
            },
            {
                recordTranscript: H
            } = await Promise.resolve().then(() => (lq(), r0A));
        await H([w])
    } catch (A) {
        K1(A instanceof Error ? A : Error(`File snapshot persistence failed: ${A}`))
    }
}
// @from(Ln 235754, Col 4)
DT9 = 10
// @from(Ln 235755, Col 4)
mX = v(() => {
    B6();
    _8();
    hA();
    c0A();
    y6();
    i0A();
    N7();
    p8()
})
// @from(Ln 235775, Col 0)
function o0A() {
    let A = K_6(O8(), "todos");
    if (!b1().existsSync(A)) b1().mkdirSync(A);
    return A
}
// @from(Ln 235781, Col 0)
function Lp(A) {
    let q = `${U6()}-agent-${A}.json`;
    return K_6(o0A(), q)
}
// @from(Ln 235786, Col 0)
function UB(A) {
    return cU7(Lp(A))
}
// @from(Ln 235790, Col 0)
function $K1(A, q) {
    lU7(A, Lp(q)), q_6()
}
// @from(Ln 235793, Col 0)
async function Y_6(A) {
    let q = !1,
        K = ZT9(A.messages);
    if (K && K.content.length > 0) try {
        let Y = Lp(U6());
        await WT9(Y, K.content), q = !0
    } catch {}
    if (!q && A.messages.length > 0) {
        let Y = A.messages[0];
        if (Y && "sessionId" in Y) GT9(Y.sessionId, U6())
    }
    a0A()
}
// @from(Ln 235807, Col 0)
function GT9(A, q) {
    let K = K_6(o0A(), `${A}-agent-${A}.json`),
        Y = K_6(o0A(), `${q}-agent-${q}.json`);
    try {
        let z = cU7(K);
        if (z.length === 0) return !1;
        return lU7(z, Y), !0
    } catch (z) {
        return K1(z instanceof Error ? z : Error(String(z))), !1
    }
}
// @from(Ln 235819, Col 0)
function cU7(A) {
    if (!b1().existsSync(A)) return [];
    try {
        let q = _A(b1().readFileSync(A, {
            encoding: "utf-8"
        }));
        return d_1.parse(q)
    } catch (q) {
        return K1(q instanceof Error ? q : Error(String(q))), []
    }
}
// @from(Ln 235831, Col 0)
function lU7(A, q) {
    try {
        PT9(q, Q1(A, null, 2))
    } catch (K) {
        K1(K instanceof Error ? K : Error(String(K)))
    }
}
// @from(Ln 235839, Col 0)
function a0A() {
    if (!jH()) return;
    let A = U6(),
        q = WM(),
        K = WX(q);
    if (K.length > 0) {
        h(`[Todo Migration] Skipping migration - ${K.length} tasks already exist`);
        return
    }
    let Y = UB(A);
    if (Y.length === 0) return;
    h(`[Todo Migration] Migrating ${Y.length} todos to v2`);
    for (let z of Y) n_1(q, {
        subject: z.content,
        description: "",
        activeForm: z.activeForm,
        status: z.status,
        blocks: [],
        blockedBy: []
    });
    $K1([], A), h(`[Todo Migration] Successfully migrated ${Y.length} todos to v2`)
}
// @from(Ln 235862, Col 0)
function ZT9(A) {
    for (let q = A.length - 1; q >= 0; q--) {
        let K = A[q];
        if (K?.type === "system" && "subtype" in K && K.subtype === "file_snapshot" && "snapshotFiles" in K) return K.snapshotFiles.find((z) => z.key === "todo")
    }
    return
}
// @from(Ln 235869, Col 4)
pB = v(() => {
    B6();
    _8();
    hA();
    y6();
    Z6();
    mX();
    Q7A();
    m6();
    vw()
})
// @from(Ln 235880, Col 4)
Nh = "TaskCreate"
// @from(Ln 235881, Col 4)
DR = "TaskUpdate"
// @from(Ln 235883, Col 0)
function t0A() {
    return {
        async: !1,
        breaks: !1,
        extensions: null,
        gfm: !0,
        hooks: null,
        pedantic: !1,
        renderer: null,
        silent: !1,
        tokenizer: null,
        walkTokens: null
    }
}
// @from(Ln 235898, Col 0)
function sU7(A) {
    _K1 = A
}
// @from(Ln 235902, Col 0)
function C2(A, q = "") {
    let K = typeof A === "string" ? A : A.source,
        Y = {
            replace: (z, w) => {
                let H = typeof w === "string" ? w : w.source;
                return H = H.replace(CZ.caret, "$1"), K = K.replace(z, H), Y
            },
            getRegex: () => {
                return new RegExp(K, q)
            }
        };
    return Y
}
// @from(Ln 235916, Col 0)
function dB(A, q) {
    if (q) {
        if (CZ.escapeTest.test(A)) return A.replace(CZ.escapeReplace, nU7)
    } else if (CZ.escapeTestNoEncode.test(A)) return A.replace(CZ.escapeReplaceNoEncode, nU7);
    return A
}
// @from(Ln 235923, Col 0)
function rU7(A) {
    try {
        A = encodeURI(A).replace(CZ.percentDecode, "%")
    } catch {
        return null
    }
    return A
}
// @from(Ln 235932, Col 0)
function oU7(A, q) {
    let K = A.replace(CZ.findPipe, (w, H, $) => {
            let O = !1,
                _ = H;
            while (--_ >= 0 && $[_] === "\\") O = !O;
            if (O) return "|";
            else return " |"
        }),
        Y = K.split(CZ.splitPipe),
        z = 0;
    if (!Y[0].trim()) Y.shift();
    if (Y.length > 0 && !Y.at(-1)?.trim()) Y.pop();
    if (q)
        if (Y.length > q) Y.splice(q);
        else
            while (Y.length < q) Y.push("");
    for (; z < Y.length; z++) Y[z] = Y[z].trim().replace(CZ.slashPipe, "|");
    return Y
}
// @from(Ln 235952, Col 0)
function lu1(A, q, K) {
    let Y = A.length;
    if (Y === 0) return "";
    let z = 0;
    while (z < Y)
        if (A.charAt(Y - z - 1) === q) z++;
        else break;
    return A.slice(0, Y - z)
}
// @from(Ln 235962, Col 0)
function sT9(A, q) {
    if (A.indexOf(q[1]) === -1) return -1;
    let K = 0;
    for (let Y = 0; Y < A.length; Y++)
        if (A[Y] === "\\") Y++;
        else if (A[Y] === q[0]) K++;
    else if (A[Y] === q[1]) {
        if (K--, K < 0) return Y
    }
    return -1
}
// @from(Ln 235974, Col 0)
function aU7(A, q, K, Y, z) {
    let w = q.href,
        H = q.title || null,
        $ = A[1].replace(z.other.outputLinkReplace, "$1");
    if (A[0].charAt(0) !== "!") {
        Y.state.inLink = !0;
        let O = {
            type: "link",
            raw: K,
            href: w,
            title: H,
            text: $,
            tokens: Y.inlineTokens($)
        };
        return Y.state.inLink = !1, O
    }
    return {
        type: "image",
        raw: K,
        href: w,
        title: H,
        text: $
    }
}
// @from(Ln 235999, Col 0)
function tT9(A, q, K) {
    let Y = A.match(K.other.indentCodeCompensation);
    if (Y === null) return q;
    let z = Y[1];
    return q.split(`
`).map((w) => {
        let H = w.match(K.other.beginningSpace);
        if (H === null) return w;
        let [$] = H;
        if ($.length >= z.length) return w.slice(z.length);
        return w
    }).join(`
`)
}
// @from(Ln 236013, Col 0)
class ru1 {
    options;
    rules;
    lexer;
    constructor(A) {
        this.options = A || _K1
    }
    space(A) {
        let q = this.rules.block.newline.exec(A);
        if (q && q[0].length > 0) return {
            type: "space",
            raw: q[0]
        }
    }
    code(A) {
        let q = this.rules.block.code.exec(A);
        if (q) {
            let K = q[0].replace(this.rules.other.codeRemoveIndent, "");
            return {
                type: "code",
                raw: q[0],
                codeBlockStyle: "indented",
                text: !this.options.pedantic ? lu1(K, `
`) : K
            }
        }
    }
    fences(A) {
        let q = this.rules.block.fences.exec(A);
        if (q) {
            let K = q[0],
                Y = tT9(K, q[3] || "", this.rules);
            return {
                type: "code",
                raw: K,
                lang: q[2] ? q[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : q[2],
                text: Y
            }
        }
    }
    heading(A) {
        let q = this.rules.block.heading.exec(A);
        if (q) {
            let K = q[2].trim();
            if (this.rules.other.endingHash.test(K)) {
                let Y = lu1(K, "#");
                if (this.options.pedantic) K = Y.trim();
                else if (!Y || this.rules.other.endingSpaceChar.test(Y)) K = Y.trim()
            }
            return {
                type: "heading",
                raw: q[0],
                depth: q[1].length,
                text: K,
                tokens: this.lexer.inline(K)
            }
        }
    }
    hr(A) {
        let q = this.rules.block.hr.exec(A);
        if (q) return {
            type: "hr",
            raw: lu1(q[0], `
`)
        }
    }
    blockquote(A) {
        let q = this.rules.block.blockquote.exec(A);
        if (q) {
            let K = lu1(q[0], `
`).split(`
`),
                Y = "",
                z = "",
                w = [];
            while (K.length > 0) {
                let H = !1,
                    $ = [],
                    O;
                for (O = 0; O < K.length; O++)
                    if (this.rules.other.blockquoteStart.test(K[O])) $.push(K[O]), H = !0;
                    else if (!H) $.push(K[O]);
                else break;
                K = K.slice(O);
                let _ = $.join(`
`),
                    J = _.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
                Y = Y ? `${Y}
${_}` : _, z = z ? `${z}
${J}` : J;
                let X = this.lexer.state.top;
                if (this.lexer.state.top = !0, this.lexer.blockTokens(J, w, !0), this.lexer.state.top = X, K.length === 0) break;
                let D = w.at(-1);
                if (D?.type === "code") break;
                else if (D?.type === "blockquote") {
                    let j = D,
                        M = j.raw + `
` + K.join(`
`),
                        P = this.blockquote(M);
                    w[w.length - 1] = P, Y = Y.substring(0, Y.length - j.raw.length) + P.raw, z = z.substring(0, z.length - j.text.length) + P.text;
                    break
                } else if (D?.type === "list") {
                    let j = D,
                        M = j.raw + `
` + K.join(`
`),
                        P = this.list(M);
                    w[w.length - 1] = P, Y = Y.substring(0, Y.length - D.raw.length) + P.raw, z = z.substring(0, z.length - j.raw.length) + P.raw, K = M.substring(w.at(-1).raw.length).split(`
`);
                    continue
                }
            }
            return {
                type: "blockquote",
                raw: Y,
                tokens: w,
                text: z
            }
        }
    }
    list(A) {
        let q = this.rules.block.list.exec(A);
        if (q) {
            let K = q[1].trim(),
                Y = K.length > 1,
                z = {
                    type: "list",
                    raw: "",
                    ordered: Y,
                    start: Y ? +K.slice(0, -1) : "",
                    loose: !1,
                    items: []
                };
            if (K = Y ? `\\d{1,9}\\${K.slice(-1)}` : `\\${K}`, this.options.pedantic) K = Y ? K : "[*+-]";
            let w = this.rules.other.listItemRegex(K),
                H = !1;
            while (A) {
                let O = !1,
                    _ = "",
                    J = "";
                if (!(q = w.exec(A))) break;
                if (this.rules.block.hr.test(A)) break;
                _ = q[0], A = A.substring(_.length);
                let X = q[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (G) => " ".repeat(3 * G.length)),
                    D = A.split(`
`, 1)[0],
                    j = !X.trim(),
                    M = 0;
                if (this.options.pedantic) M = 2, J = X.trimStart();
                else if (j) M = q[1].length + 1;
                else M = q[2].search(this.rules.other.nonSpaceChar), M = M > 4 ? 1 : M, J = X.slice(M), M += q[1].length;
                if (j && this.rules.other.blankLine.test(D)) _ += D + `
`, A = A.substring(D.length + 1), O = !0;
                if (!O) {
                    let G = this.rules.other.nextBulletRegex(M),
                        f = this.rules.other.hrRegex(M),
                        Z = this.rules.other.fencesBeginRegex(M),
                        N = this.rules.other.headingBeginRegex(M),
                        T = this.rules.other.htmlBeginRegex(M);
                    while (A) {
                        let k = A.split(`
`, 1)[0],
                            y;
                        if (D = k, this.options.pedantic) D = D.replace(this.rules.other.listReplaceNesting, "  "), y = D;
                        else y = D.replace(this.rules.other.tabCharGlobal, "    ");
                        if (Z.test(D)) break;
                        if (N.test(D)) break;
                        if (T.test(D)) break;
                        if (G.test(D)) break;
                        if (f.test(D)) break;
                        if (y.search(this.rules.other.nonSpaceChar) >= M || !D.trim()) J += `
` + y.slice(M);
                        else {
                            if (j) break;
                            if (X.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4) break;
                            if (Z.test(X)) break;
                            if (N.test(X)) break;
                            if (f.test(X)) break;
                            J += `
` + D
                        }
                        if (!j && !D.trim()) j = !0;
                        _ += k + `
`, A = A.substring(k.length + 1), X = y.slice(M)
                    }
                }
                if (!z.loose) {
                    if (H) z.loose = !0;
                    else if (this.rules.other.doubleBlankLine.test(_)) H = !0
                }
                let P = null,
                    W;
                if (this.options.gfm) {
                    if (P = this.rules.other.listIsTask.exec(J), P) W = P[0] !== "[ ] ", J = J.replace(this.rules.other.listReplaceTask, "")
                }
                z.items.push({
                    type: "list_item",
                    raw: _,
                    task: !!P,
                    checked: W,
                    loose: !1,
                    text: J,
                    tokens: []
                }), z.raw += _
            }
            let $ = z.items.at(-1);
            if ($) $.raw = $.raw.trimEnd(), $.text = $.text.trimEnd();
            else return;
            z.raw = z.raw.trimEnd();
            for (let O = 0; O < z.items.length; O++)
                if (this.lexer.state.top = !1, z.items[O].tokens = this.lexer.blockTokens(z.items[O].text, []), !z.loose) {
                    let _ = z.items[O].tokens.filter((X) => X.type === "space"),
                        J = _.length > 0 && _.some((X) => this.rules.other.anyLine.test(X.raw));
                    z.loose = J
                } if (z.loose)
                for (let O = 0; O < z.items.length; O++) z.items[O].loose = !0;
            return z
        }
    }
    html(A) {
        let q = this.rules.block.html.exec(A);
        if (q) return {
            type: "html",
            block: !0,
            raw: q[0],
            pre: q[1] === "pre" || q[1] === "script" || q[1] === "style",
            text: q[0]
        }
    }
    def(A) {
        let q = this.rules.block.def.exec(A);
        if (q) {
            let K = q[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "),
                Y = q[2] ? q[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "",
                z = q[3] ? q[3].substring(1, q[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : q[3];
            return {
                type: "def",
                tag: K,
                raw: q[0],
                href: Y,
                title: z
            }
        }
    }
    table(A) {
        let q = this.rules.block.table.exec(A);
        if (!q) return;
        if (!this.rules.other.tableDelimiter.test(q[2])) return;
        let K = oU7(q[1]),
            Y = q[2].replace(this.rules.other.tableAlignChars, "").split("|"),
            z = q[3]?.trim() ? q[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [],
            w = {
                type: "table",
                raw: q[0],
                header: [],
                align: [],
                rows: []
            };
        if (K.length !== Y.length) return;
        for (let H of Y)
            if (this.rules.other.tableAlignRight.test(H)) w.align.push("right");
            else if (this.rules.other.tableAlignCenter.test(H)) w.align.push("center");
        else if (this.rules.other.tableAlignLeft.test(H)) w.align.push("left");
        else w.align.push(null);
        for (let H = 0; H < K.length; H++) w.header.push({
            text: K[H],
            tokens: this.lexer.inline(K[H]),
            header: !0,
            align: w.align[H]
        });
        for (let H of z) w.rows.push(oU7(H, w.header.length).map(($, O) => {
            return {
                text: $,
                tokens: this.lexer.inline($),
                header: !1,
                align: w.align[O]
            }
        }));
        return w
    }
    lheading(A) {
        let q = this.rules.block.lheading.exec(A);
        if (q) return {
            type: "heading",
            raw: q[0],
            depth: q[2].charAt(0) === "=" ? 1 : 2,
            text: q[1],
            tokens: this.lexer.inline(q[1])
        }
    }
    paragraph(A) {
        let q = this.rules.block.paragraph.exec(A);
        if (q) {
            let K = q[1].charAt(q[1].length - 1) === `
` ? q[1].slice(0, -1) : q[1];
            return {
                type: "paragraph",
                raw: q[0],
                text: K,
                tokens: this.lexer.inline(K)
            }
        }
    }
    text(A) {
        let q = this.rules.block.text.exec(A);
        if (q) return {
            type: "text",
            raw: q[0],
            text: q[0],
            tokens: this.lexer.inline(q[0])
        }
    }
    escape(A) {
        let q = this.rules.inline.escape.exec(A);
        if (q) return {
            type: "escape",
            raw: q[0],
            text: q[1]
        }
    }
    tag(A) {
        let q = this.rules.inline.tag.exec(A);
        if (q) {
            if (!this.lexer.state.inLink && this.rules.other.startATag.test(q[0])) this.lexer.state.inLink = !0;
            else if (this.lexer.state.inLink && this.rules.other.endATag.test(q[0])) this.lexer.state.inLink = !1;
            if (!this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(q[0])) this.lexer.state.inRawBlock = !0;
            else if (this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(q[0])) this.lexer.state.inRawBlock = !1;
            return {
                type: "html",
                raw: q[0],
                inLink: this.lexer.state.inLink,
                inRawBlock: this.lexer.state.inRawBlock,
                block: !1,
                text: q[0]
            }
        }
    }
    link(A) {
        let q = this.rules.inline.link.exec(A);
        if (q) {
            let K = q[2].trim();
            if (!this.options.pedantic && this.rules.other.startAngleBracket.test(K)) {
                if (!this.rules.other.endAngleBracket.test(K)) return;
                let w = lu1(K.slice(0, -1), "\\");
                if ((K.length - w.length) % 2 === 0) return
            } else {
                let w = sT9(q[2], "()");
                if (w > -1) {
                    let $ = (q[0].indexOf("!") === 0 ? 5 : 4) + q[1].length + w;
                    q[2] = q[2].substring(0, w), q[0] = q[0].substring(0, $).trim(), q[3] = ""
                }
            }
            let Y = q[2],
                z = "";
            if (this.options.pedantic) {
                let w = this.rules.other.pedanticHrefTitle.exec(Y);
                if (w) Y = w[1], z = w[3]
            } else z = q[3] ? q[3].slice(1, -1) : "";
            if (Y = Y.trim(), this.rules.other.startAngleBracket.test(Y))
                if (this.options.pedantic && !this.rules.other.endAngleBracket.test(K)) Y = Y.slice(1);
                else Y = Y.slice(1, -1);
            return aU7(q, {
                href: Y ? Y.replace(this.rules.inline.anyPunctuation, "$1") : Y,
                title: z ? z.replace(this.rules.inline.anyPunctuation, "$1") : z
            }, q[0], this.lexer, this.rules)
        }
    }
    reflink(A, q) {
        let K;
        if ((K = this.rules.inline.reflink.exec(A)) || (K = this.rules.inline.nolink.exec(A))) {
            let Y = (K[2] || K[1]).replace(this.rules.other.multipleSpaceGlobal, " "),
                z = q[Y.toLowerCase()];
            if (!z) {
                let w = K[0].charAt(0);
                return {
                    type: "text",
                    raw: w,
                    text: w
                }
            }
            return aU7(K, z, K[0], this.lexer, this.rules)
        }
    }
    emStrong(A, q, K = "") {
        let Y = this.rules.inline.emStrongLDelim.exec(A);
        if (!Y) return;
        if (Y[3] && K.match(this.rules.other.unicodeAlphaNumeric)) return;
        if (!(Y[1] || Y[2]) || !K || this.rules.inline.punctuation.exec(K)) {
            let w = [...Y[0]].length - 1,
                H, $, O = w,
                _ = 0,
                J = Y[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
            J.lastIndex = 0, q = q.slice(-1 * A.length + w);
            while ((Y = J.exec(q)) != null) {
                if (H = Y[1] || Y[2] || Y[3] || Y[4] || Y[5] || Y[6], !H) continue;
                if ($ = [...H].length, Y[3] || Y[4]) {
                    O += $;
                    continue
                } else if (Y[5] || Y[6]) {
                    if (w % 3 && !((w + $) % 3)) {
                        _ += $;
                        continue
                    }
                }
                if (O -= $, O > 0) continue;
                $ = Math.min($, $ + O + _);
                let X = [...Y[0]][0].length,
                    D = A.slice(0, w + Y.index + X + $);
                if (Math.min(w, $) % 2) {
                    let M = D.slice(1, -1);
                    return {
                        type: "em",
                        raw: D,
                        text: M,
                        tokens: this.lexer.inlineTokens(M)
                    }
                }
                let j = D.slice(2, -2);
                return {
                    type: "strong",
                    raw: D,
                    text: j,
                    tokens: this.lexer.inlineTokens(j)
                }
            }
        }
    }
    codespan(A) {
        let q = this.rules.inline.code.exec(A);
        if (q) {
            let K = q[2].replace(this.rules.other.newLineCharGlobal, " "),
                Y = this.rules.other.nonSpaceChar.test(K),
                z = this.rules.other.startingSpaceChar.test(K) && this.rules.other.endingSpaceChar.test(K);
            if (Y && z) K = K.substring(1, K.length - 1);
            return {
                type: "codespan",
                raw: q[0],
                text: K
            }
        }
    }
    br(A) {
        let q = this.rules.inline.br.exec(A);
        if (q) return {
            type: "br",
            raw: q[0]
        }
    }
    del(A) {
        let q = this.rules.inline.del.exec(A);
        if (q) return {
            type: "del",
            raw: q[0],
            text: q[2],
            tokens: this.lexer.inlineTokens(q[2])
        }
    }
    autolink(A) {
        let q = this.rules.inline.autolink.exec(A);
        if (q) {
            let K, Y;
            if (q[2] === "@") K = q[1], Y = "mailto:" + K;
            else K = q[1], Y = K;
            return {
                type: "link",
                raw: q[0],
                text: K,
                href: Y,
                tokens: [{
                    type: "text",
                    raw: K,
                    text: K
                }]
            }
        }
    }
    url(A) {
        let q;
        if (q = this.rules.inline.url.exec(A)) {
            let K, Y;
            if (q[2] === "@") K = q[0], Y = "mailto:" + K;
            else {
                let z;
                do z = q[0], q[0] = this.rules.inline._backpedal.exec(q[0])?.[0] ?? ""; while (z !== q[0]);
                if (K = q[0], q[1] === "www.") Y = "http://" + q[0];
                else Y = q[0]
            }
            return {
                type: "link",
                raw: q[0],
                text: K,
                href: Y,
                tokens: [{
                    type: "text",
                    raw: K,
                    text: K
                }]
            }
        }
    }
    inlineText(A) {
        let q = this.rules.inline.text.exec(A);
        if (q) {
            let K = this.lexer.state.inRawBlock;
            return {
                type: "text",
                raw: q[0],
                text: q[0],
                escaped: K
            }
        }
    }
}
// @from(Ln 236530, Col 0)
class SZ {
    tokens;
    options;
    state;
    tokenizer;
    inlineQueue;
    constructor(A) {
        this.tokens = [], this.tokens.links = Object.create(null), this.options = A || _K1, this.options.tokenizer = this.options.tokenizer || new ru1, this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
            inLink: !1,
            inRawBlock: !1,
            top: !0
        };
        let q = {
            other: CZ,
            block: z_6.normal,
            inline: cu1.normal
        };
        if (this.options.pedantic) q.block = z_6.pedantic, q.inline = cu1.pedantic;
        else if (this.options.gfm)
            if (q.block = z_6.gfm, this.options.breaks) q.inline = cu1.breaks;
            else q.inline = cu1.gfm;
        this.tokenizer.rules = q
    }
    static get rules() {
        return {
            block: z_6,
            inline: cu1
        }
    }
    static lex(A, q) {
        return new SZ(q).lex(A)
    }
    static lexInline(A, q) {
        return new SZ(q).inlineTokens(A)
    }
    lex(A) {
        A = A.replace(CZ.carriageReturn, `
`), this.blockTokens(A, this.tokens);
        for (let q = 0; q < this.inlineQueue.length; q++) {
            let K = this.inlineQueue[q];
            this.inlineTokens(K.src, K.tokens)
        }
        return this.inlineQueue = [], this.tokens
    }
    blockTokens(A, q = [], K = !1) {
        if (this.options.pedantic) A = A.replace(CZ.tabCharGlobal, "    ").replace(CZ.spaceLine, "");
        while (A) {
            let Y;
            if (this.options.extensions?.block?.some((w) => {
                    if (Y = w.call({
                            lexer: this
                        }, A, q)) return A = A.substring(Y.raw.length), q.push(Y), !0;
                    return !1
                })) continue;
            if (Y = this.tokenizer.space(A)) {
                A = A.substring(Y.raw.length);
                let w = q.at(-1);
                if (Y.raw.length === 1 && w !== void 0) w.raw += `
`;
                else q.push(Y);
                continue
            }
            if (Y = this.tokenizer.code(A)) {
                A = A.substring(Y.raw.length);
                let w = q.at(-1);
                if (w?.type === "paragraph" || w?.type === "text") w.raw += `
` + Y.raw, w.text += `
` + Y.text, this.inlineQueue.at(-1).src = w.text;
                else q.push(Y);
                continue
            }
            if (Y = this.tokenizer.fences(A)) {
                A = A.substring(Y.raw.length), q.push(Y);
                continue
            }
            if (Y = this.tokenizer.heading(A)) {
                A = A.substring(Y.raw.length), q.push(Y);
                continue
            }
            if (Y = this.tokenizer.hr(A)) {
                A = A.substring(Y.raw.length), q.push(Y);
                continue
            }
            if (Y = this.tokenizer.blockquote(A)) {
                A = A.substring(Y.raw.length), q.push(Y);
                continue
            }
            if (Y = this.tokenizer.list(A)) {
                A = A.substring(Y.raw.length), q.push(Y);
                continue
            }
            if (Y = this.tokenizer.html(A)) {
                A = A.substring(Y.raw.length), q.push(Y);
                continue
            }
            if (Y = this.tokenizer.def(A)) {
                A = A.substring(Y.raw.length);
                let w = q.at(-1);
                if (w?.type === "paragraph" || w?.type === "text") w.raw += `
` + Y.raw, w.text += `
` + Y.raw, this.inlineQueue.at(-1).src = w.text;
                else if (!this.tokens.links[Y.tag]) this.tokens.links[Y.tag] = {
                    href: Y.href,
                    title: Y.title
                };
                continue
            }
            if (Y = this.tokenizer.table(A)) {
                A = A.substring(Y.raw.length), q.push(Y);
                continue
            }
            if (Y = this.tokenizer.lheading(A)) {
                A = A.substring(Y.raw.length), q.push(Y);
                continue
            }
            let z = A;
            if (this.options.extensions?.startBlock) {
                let w = 1 / 0,
                    H = A.slice(1),
                    $;
                if (this.options.extensions.startBlock.forEach((O) => {
                        if ($ = O.call({
                                lexer: this
                            }, H), typeof $ === "number" && $ >= 0) w = Math.min(w, $)
                    }), w < 1 / 0 && w >= 0) z = A.substring(0, w + 1)
            }
            if (this.state.top && (Y = this.tokenizer.paragraph(z))) {
                let w = q.at(-1);
                if (K && w?.type === "paragraph") w.raw += `
` + Y.raw, w.text += `
` + Y.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = w.text;
                else q.push(Y);
                K = z.length !== A.length, A = A.substring(Y.raw.length);
                continue
            }
            if (Y = this.tokenizer.text(A)) {
                A = A.substring(Y.raw.length);
                let w = q.at(-1);
                if (w?.type === "text") w.raw += `
` + Y.raw, w.text += `
` + Y.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = w.text;
                else q.push(Y);
                continue
            }
            if (A) {
                let w = "Infinite loop on byte: " + A.charCodeAt(0);
                if (this.options.silent) {
                    console.error(w);
                    break
                } else throw Error(w)
            }
        }
        return this.state.top = !0, q
    }
    inline(A, q = []) {
        return this.inlineQueue.push({
            src: A,
            tokens: q
        }), q
    }
    inlineTokens(A, q = []) {
        let K = A,
            Y = null;
        if (this.tokens.links) {
            let H = Object.keys(this.tokens.links);
            if (H.length > 0) {
                while ((Y = this.tokenizer.rules.inline.reflinkSearch.exec(K)) != null)
                    if (H.includes(Y[0].slice(Y[0].lastIndexOf("[") + 1, -1))) K = K.slice(0, Y.index) + "[" + "a".repeat(Y[0].length - 2) + "]" + K.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex)
            }
        }
        while ((Y = this.tokenizer.rules.inline.blockSkip.exec(K)) != null) K = K.slice(0, Y.index) + "[" + "a".repeat(Y[0].length - 2) + "]" + K.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
        while ((Y = this.tokenizer.rules.inline.anyPunctuation.exec(K)) != null) K = K.slice(0, Y.index) + "++" + K.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
        let z = !1,
            w = "";
        while (A) {
            if (!z) w = "";
            z = !1;
            let H;
            if (this.options.extensions?.inline?.some((O) => {
                    if (H = O.call({
                            lexer: this
                        }, A, q)) return A = A.substring(H.raw.length), q.push(H), !0;
                    return !1
                })) continue;
            if (H = this.tokenizer.escape(A)) {
                A = A.substring(H.raw.length), q.push(H);
                continue
            }
            if (H = this.tokenizer.tag(A)) {
                A = A.substring(H.raw.length), q.push(H);
                continue
            }
            if (H = this.tokenizer.link(A)) {
                A = A.substring(H.raw.length), q.push(H);
                continue
            }
            if (H = this.tokenizer.reflink(A, this.tokens.links)) {
                A = A.substring(H.raw.length);
                let O = q.at(-1);
                if (H.type === "text" && O?.type === "text") O.raw += H.raw, O.text += H.text;
                else q.push(H);
                continue
            }
            if (H = this.tokenizer.emStrong(A, K, w)) {
                A = A.substring(H.raw.length), q.push(H);
                continue
            }
            if (H = this.tokenizer.codespan(A)) {
                A = A.substring(H.raw.length), q.push(H);
                continue
            }
            if (H = this.tokenizer.br(A)) {
                A = A.substring(H.raw.length), q.push(H);
                continue
            }
            if (H = this.tokenizer.del(A)) {
                A = A.substring(H.raw.length), q.push(H);
                continue
            }
            if (H = this.tokenizer.autolink(A)) {
                A = A.substring(H.raw.length), q.push(H);
                continue
            }
            if (!this.state.inLink && (H = this.tokenizer.url(A))) {
                A = A.substring(H.raw.length), q.push(H);
                continue
            }
            let $ = A;
            if (this.options.extensions?.startInline) {
                let O = 1 / 0,
                    _ = A.slice(1),
                    J;
                if (this.options.extensions.startInline.forEach((X) => {
                        if (J = X.call({
                                lexer: this
                            }, _), typeof J === "number" && J >= 0) O = Math.min(O, J)
                    }), O < 1 / 0 && O >= 0) $ = A.substring(0, O + 1)
            }
            if (H = this.tokenizer.inlineText($)) {
                if (A = A.substring(H.raw.length), H.raw.slice(-1) !== "_") w = H.raw.slice(-1);
                z = !0;
                let O = q.at(-1);
                if (O?.type === "text") O.raw += H.raw, O.text += H.text;
                else q.push(H);
                continue
            }
            if (A) {
                let O = "Infinite loop on byte: " + A.charCodeAt(0);
                if (this.options.silent) {
                    console.error(O);
                    break
                } else throw Error(O)
            }
        }
        return q
    }
}
// @from(Ln 236787, Col 0)
class ou1 {
    options;
    parser;
    constructor(A) {
        this.options = A || _K1
    }
    space(A) {
        return ""
    }
    code({
        text: A,
        lang: q,
        escaped: K
    }) {
        let Y = (q || "").match(CZ.notSpaceStart)?.[0],
            z = A.replace(CZ.endingNewline, "") + `
`;
        if (!Y) return "<pre><code>" + (K ? z : dB(z, !0)) + `</code></pre>
`;
        return '<pre><code class="language-' + dB(Y) + '">' + (K ? z : dB(z, !0)) + `</code></pre>
`
    }
    blockquote({
        tokens: A
    }) {
        return `<blockquote>
${this.parser.parse(A)}</blockquote>
`
    }
    html({
        text: A
    }) {
        return A
    }
    heading({
        tokens: A,
        depth: q
    }) {
        return `<h${q}>${this.parser.parseInline(A)}</h${q}>
`
    }
    hr(A) {
        return `<hr>
`
    }
    list(A) {
        let {
            ordered: q,
            start: K
        } = A, Y = "";
        for (let H = 0; H < A.items.length; H++) {
            let $ = A.items[H];
            Y += this.listitem($)
        }
        let z = q ? "ol" : "ul",
            w = q && K !== 1 ? ' start="' + K + '"' : "";
        return "<" + z + w + `>
` + Y + "</" + z + `>
`
    }
    listitem(A) {
        let q = "";
        if (A.task) {
            let K = this.checkbox({
                checked: !!A.checked
            });
            if (A.loose)
                if (A.tokens[0]?.type === "paragraph") {
                    if (A.tokens[0].text = K + " " + A.tokens[0].text, A.tokens[0].tokens && A.tokens[0].tokens.length > 0 && A.tokens[0].tokens[0].type === "text") A.tokens[0].tokens[0].text = K + " " + dB(A.tokens[0].tokens[0].text), A.tokens[0].tokens[0].escaped = !0
                } else A.tokens.unshift({
                    type: "text",
                    raw: K + " ",
                    text: K + " ",
                    escaped: !0
                });
            else q += K + " "
        }
        return q += this.parser.parse(A.tokens, !!A.loose), `<li>${q}</li>
`
    }
    checkbox({
        checked: A
    }) {
        return "<input " + (A ? 'checked="" ' : "") + 'disabled="" type="checkbox">'
    }
    paragraph({
        tokens: A
    }) {
        return `<p>${this.parser.parseInline(A)}</p>
`
    }
    table(A) {
        let q = "",
            K = "";
        for (let z = 0; z < A.header.length; z++) K += this.tablecell(A.header[z]);
        q += this.tablerow({
            text: K
        });
        let Y = "";
        for (let z = 0; z < A.rows.length; z++) {
            let w = A.rows[z];
            K = "";
            for (let H = 0; H < w.length; H++) K += this.tablecell(w[H]);
            Y += this.tablerow({
                text: K
            })
        }
        if (Y) Y = `<tbody>${Y}</tbody>`;
        return `<table>
<thead>
` + q + `</thead>
` + Y + `</table>
`
    }
    tablerow({
        text: A
    }) {
        return `<tr>
${A}</tr>
`
    }
    tablecell(A) {
        let q = this.parser.parseInline(A.tokens),
            K = A.header ? "th" : "td";
        return (A.align ? `<${K} align="${A.align}">` : `<${K}>`) + q + `</${K}>
`
    }
    strong({
        tokens: A
    }) {
        return `<strong>${this.parser.parseInline(A)}</strong>`
    }
    em({
        tokens: A
    }) {
        return `<em>${this.parser.parseInline(A)}</em>`
    }
    codespan({
        text: A
    }) {
        return `<code>${dB(A,!0)}</code>`
    }
    br(A) {
        return "<br>"
    }
    del({
        tokens: A
    }) {
        return `<del>${this.parser.parseInline(A)}</del>`
    }
    link({
        href: A,
        title: q,
        tokens: K
    }) {
        let Y = this.parser.parseInline(K),
            z = rU7(A);
        if (z === null) return Y;
        A = z;
        let w = '<a href="' + A + '"';
        if (q) w += ' title="' + dB(q) + '"';
        return w += ">" + Y + "</a>", w
    }
    image({
        href: A,
        title: q,
        text: K
    }) {
        let Y = rU7(A);
        if (Y === null) return dB(K);
        A = Y;
        let z = `<img src="${A}" alt="${K}"`;
        if (q) z += ` title="${dB(q)}"`;
        return z += ">", z
    }
    text(A) {
        return "tokens" in A && A.tokens ? this.parser.parseInline(A.tokens) : ("escaped" in A) && A.escaped ? A.text : dB(A.text)
    }
}
// @from(Ln 236966, Col 0)
class O_6 {
    strong({
        text: A
    }) {
        return A
    }
    em({
        text: A
    }) {
        return A
    }
    codespan({
        text: A
    }) {
        return A
    }
    del({
        text: A
    }) {
        return A
    }
    html({
        text: A
    }) {
        return A
    }
    text({
        text: A
    }) {
        return A
    }
    link({
        text: A
    }) {
        return "" + A
    }
    image({
        text: A
    }) {
        return "" + A
    }
    br() {
        return ""
    }
}
// @from(Ln 237011, Col 0)
class jR {
    options;
    renderer;
    textRenderer;
    constructor(A) {
        this.options = A || _K1, this.options.renderer = this.options.renderer || new ou1, this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new O_6
    }
    static parse(A, q) {
        return new jR(q).parse(A)
    }
    static parseInline(A, q) {
        return new jR(q).parseInline(A)
    }
    parse(A, q = !0) {
        let K = "";
        for (let Y = 0; Y < A.length; Y++) {
            let z = A[Y];
            if (this.options.extensions?.renderers?.[z.type]) {
                let H = z,
                    $ = this.options.extensions.renderers[H.type].call({
                        parser: this
                    }, H);
                if ($ !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(H.type)) {
                    K += $ || "";
                    continue
                }
            }
            let w = z;
            switch (w.type) {
                case "space": {
                    K += this.renderer.space(w);
                    continue
                }
                case "hr": {
                    K += this.renderer.hr(w);
                    continue
                }
                case "heading": {
                    K += this.renderer.heading(w);
                    continue
                }
                case "code": {
                    K += this.renderer.code(w);
                    continue
                }
                case "table": {
                    K += this.renderer.table(w);
                    continue
                }
                case "blockquote": {
                    K += this.renderer.blockquote(w);
                    continue
                }
                case "list": {
                    K += this.renderer.list(w);
                    continue
                }
                case "html": {
                    K += this.renderer.html(w);
                    continue
                }
                case "paragraph": {
                    K += this.renderer.paragraph(w);
                    continue
                }
                case "text": {
                    let H = w,
                        $ = this.renderer.text(H);
                    while (Y + 1 < A.length && A[Y + 1].type === "text") H = A[++Y], $ += `
` + this.renderer.text(H);
                    if (q) K += this.renderer.paragraph({
                        type: "paragraph",
                        raw: $,
                        text: $,
                        tokens: [{
                            type: "text",
                            raw: $,
                            text: $,
                            escaped: !0
                        }]
                    });
                    else K += $;
                    continue
                }
                default: {
                    let H = 'Token with "' + w.type + '" type was not found.';
                    if (this.options.silent) return console.error(H), "";
                    else throw Error(H)
                }
            }
        }
        return K
    }
    parseInline(A, q = this.renderer) {
        let K = "";
        for (let Y = 0; Y < A.length; Y++) {
            let z = A[Y];
            if (this.options.extensions?.renderers?.[z.type]) {
                let H = this.options.extensions.renderers[z.type].call({
                    parser: this
                }, z);
                if (H !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(z.type)) {
                    K += H || "";
                    continue
                }
            }
            let w = z;
            switch (w.type) {
                case "escape": {
                    K += q.text(w);
                    break
                }
                case "html": {
                    K += q.html(w);
                    break
                }
                case "link": {
                    K += q.link(w);
                    break
                }
                case "image": {
                    K += q.image(w);
                    break
                }
                case "strong": {
                    K += q.strong(w);
                    break
                }
                case "em": {
                    K += q.em(w);
                    break
                }
                case "codespan": {
                    K += q.codespan(w);
                    break
                }
                case "br": {
                    K += q.br(w);
                    break
                }
                case "del": {
                    K += q.del(w);
                    break
                }
                case "text": {
                    K += q.text(w);
                    break
                }
                default: {
                    let H = 'Token with "' + w.type + '" type was not found.';
                    if (this.options.silent) return console.error(H), "";
                    else throw Error(H)
                }
            }
        }
        return K
    }
}
// @from(Ln 237169, Col 0)
class Op7 {
    defaults = t0A();
    options = this.setOptions;
    parse = this.parseMarkdown(!0);
    parseInline = this.parseMarkdown(!1);
    Parser = jR;
    Renderer = ou1;
    TextRenderer = O_6;
    Lexer = SZ;
    Tokenizer = ru1;
    Hooks = nu1;
    constructor(...A) {
        this.use(...A)
    }
    walkTokens(A, q) {
        let K = [];
        for (let Y of A) switch (K = K.concat(q.call(this, Y)), Y.type) {
            case "table": {
                let z = Y;
                for (let w of z.header) K = K.concat(this.walkTokens(w.tokens, q));
                for (let w of z.rows)
                    for (let H of w) K = K.concat(this.walkTokens(H.tokens, q));
                break
            }
            case "list": {
                let z = Y;
                K = K.concat(this.walkTokens(z.items, q));
                break
            }
            default: {
                let z = Y;
                if (this.defaults.extensions?.childTokens?.[z.type]) this.defaults.extensions.childTokens[z.type].forEach((w) => {
                    let H = z[w].flat(1 / 0);
                    K = K.concat(this.walkTokens(H, q))
                });
                else if (z.tokens) K = K.concat(this.walkTokens(z.tokens, q))
            }
        }
        return K
    }
    use(...A) {
        let q = this.defaults.extensions || {
            renderers: {},
            childTokens: {}
        };
        return A.forEach((K) => {
            let Y = {
                ...K
            };
            if (Y.async = this.defaults.async || Y.async || !1, K.extensions) K.extensions.forEach((z) => {
                if (!z.name) throw Error("extension name required");
                if ("renderer" in z) {
                    let w = q.renderers[z.name];
                    if (w) q.renderers[z.name] = function(...H) {
                        let $ = z.renderer.apply(this, H);
                        if ($ === !1) $ = w.apply(this, H);
                        return $
                    };
                    else q.renderers[z.name] = z.renderer
                }
                if ("tokenizer" in z) {
                    if (!z.level || z.level !== "block" && z.level !== "inline") throw Error("extension level must be 'block' or 'inline'");
                    let w = q[z.level];
                    if (w) w.unshift(z.tokenizer);
                    else q[z.level] = [z.tokenizer];
                    if (z.start) {
                        if (z.level === "block")
                            if (q.startBlock) q.startBlock.push(z.start);
                            else q.startBlock = [z.start];
                        else if (z.level === "inline")
                            if (q.startInline) q.startInline.push(z.start);
                            else q.startInline = [z.start]
                    }
                }
                if ("childTokens" in z && z.childTokens) q.childTokens[z.name] = z.childTokens
            }), Y.extensions = q;
            if (K.renderer) {
                let z = this.defaults.renderer || new ou1(this.defaults);
                for (let w in K.renderer) {
                    if (!(w in z)) throw Error(`renderer '${w}' does not exist`);
                    if (["options", "parser"].includes(w)) continue;
                    let H = w,
                        $ = K.renderer[H],
                        O = z[H];
                    z[H] = (..._) => {
                        let J = $.apply(z, _);
                        if (J === !1) J = O.apply(z, _);
                        return J || ""
                    }
                }
                Y.renderer = z
            }
            if (K.tokenizer) {
                let z = this.defaults.tokenizer || new ru1(this.defaults);
                for (let w in K.tokenizer) {
                    if (!(w in z)) throw Error(`tokenizer '${w}' does not exist`);
                    if (["options", "rules", "lexer"].includes(w)) continue;
                    let H = w,
                        $ = K.tokenizer[H],
                        O = z[H];
                    z[H] = (..._) => {
                        let J = $.apply(z, _);
                        if (J === !1) J = O.apply(z, _);
                        return J
                    }
                }
                Y.tokenizer = z
            }
            if (K.hooks) {
                let z = this.defaults.hooks || new nu1;
                for (let w in K.hooks) {
                    if (!(w in z)) throw Error(`hook '${w}' does not exist`);
                    if (["options", "block"].includes(w)) continue;
                    let H = w,
                        $ = K.hooks[H],
                        O = z[H];
                    if (nu1.passThroughHooks.has(w)) z[H] = (_) => {
                        if (this.defaults.async) return Promise.resolve($.call(z, _)).then((X) => {
                            return O.call(z, X)
                        });
                        let J = $.call(z, _);
                        return O.call(z, J)
                    };
                    else z[H] = (..._) => {
                        let J = $.apply(z, _);
                        if (J === !1) J = O.apply(z, _);
                        return J
                    }
                }
                Y.hooks = z
            }
            if (K.walkTokens) {
                let z = this.defaults.walkTokens,
                    w = K.walkTokens;
                Y.walkTokens = function(H) {
                    let $ = [];
                    if ($.push(w.call(this, H)), z) $ = $.concat(z.call(this, H));
                    return $
                }
            }
            this.defaults = {
                ...this.defaults,
                ...Y
            }
        }), this
    }
    setOptions(A) {
        return this.defaults = {
            ...this.defaults,
            ...A
        }, this
    }
    lexer(A, q) {
        return SZ.lex(A, q ?? this.defaults)
    }
    parser(A, q) {
        return jR.parse(A, q ?? this.defaults)
    }
    parseMarkdown(A) {
        return (K, Y) => {
            let z = {
                    ...Y
                },
                w = {
                    ...this.defaults,
                    ...z
                },
                H = this.onError(!!w.silent, !!w.async);
            if (this.defaults.async === !0 && z.async === !1) return H(Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
            if (typeof K > "u" || K === null) return H(Error("marked(): input parameter is undefined or null"));
            if (typeof K !== "string") return H(Error("marked(): input parameter is of type " + Object.prototype.toString.call(K) + ", string expected"));
            if (w.hooks) w.hooks.options = w, w.hooks.block = A;
            let $ = w.hooks ? w.hooks.provideLexer() : A ? SZ.lex : SZ.lexInline,
                O = w.hooks ? w.hooks.provideParser() : A ? jR.parse : jR.parseInline;
            if (w.async) return Promise.resolve(w.hooks ? w.hooks.preprocess(K) : K).then((_) => $(_, w)).then((_) => w.hooks ? w.hooks.processAllTokens(_) : _).then((_) => w.walkTokens ? Promise.all(this.walkTokens(_, w.walkTokens)).then(() => _) : _).then((_) => O(_, w)).then((_) => w.hooks ? w.hooks.postprocess(_) : _).catch(H);
            try {
                if (w.hooks) K = w.hooks.preprocess(K);
                let _ = $(K, w);
                if (w.hooks) _ = w.hooks.processAllTokens(_);
                if (w.walkTokens) this.walkTokens(_, w.walkTokens);
                let J = O(_, w);
                if (w.hooks) J = w.hooks.postprocess(J);
                return J
            } catch (_) {
                return H(_)
            }
        }
    }
    onError(A, q) {
        return (K) => {
            if (K.message += `
Please report this to https://github.com/markedjs/marked.`, A) {
                let Y = "<p>An error occurred:</p><pre>" + dB(K.message + "", !0) + "</pre>";
                if (q) return Promise.resolve(Y);
                return Y
            }
            if (q) return Promise.reject(K);
            throw K
        }
    }
}
// @from(Ln 237371, Col 0)
function jz(A, q) {
    return OK1.parse(A, q)
}
// @from(Ln 237374, Col 4)
_K1
// @from(Ln 237374, Col 9)
iu1
// @from(Ln 237374, Col 14)
CZ
// @from(Ln 237374, Col 18)
fT9
// @from(Ln 237374, Col 23)
VT9
// @from(Ln 237374, Col 28)
NT9
// @from(Ln 237374, Col 33)
au1
// @from(Ln 237374, Col 38)
TT9
// @from(Ln 237374, Col 43)
tU7
// @from(Ln 237374, Col 48)
eU7
// @from(Ln 237374, Col 53)
e0A
// @from(Ln 237374, Col 58)
vT9
// @from(Ln 237374, Col 63)
AjA
// @from(Ln 237374, Col 68)
ET9
// @from(Ln 237374, Col 73)
kT9
// @from(Ln 237374, Col 78)
H_6 = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul"
// @from(Ln 237375, Col 4)
qjA
// @from(Ln 237375, Col 9)
LT9
// @from(Ln 237375, Col 14)
Ap7
// @from(Ln 237375, Col 19)
RT9
// @from(Ln 237375, Col 24)
KjA
// @from(Ln 237375, Col 29)
iU7
// @from(Ln 237375, Col 34)
yT9
// @from(Ln 237375, Col 39)
CT9
// @from(Ln 237375, Col 44)
ST9
// @from(Ln 237375, Col 49)
hT9
// @from(Ln 237375, Col 54)
qp7
// @from(Ln 237375, Col 59)
IT9
// @from(Ln 237375, Col 64)
$_6
// @from(Ln 237375, Col 69)
YjA
// @from(Ln 237375, Col 74)
Kp7
// @from(Ln 237375, Col 79)
xT9
// @from(Ln 237375, Col 84)
Yp7
// @from(Ln 237375, Col 89)
bT9
// @from(Ln 237375, Col 94)
uT9
// @from(Ln 237375, Col 99)
BT9
// @from(Ln 237375, Col 104)
zp7
// @from(Ln 237375, Col 109)
mT9
// @from(Ln 237375, Col 114)
FT9
// @from(Ln 237375, Col 119)
wp7 = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)"
// @from(Ln 237376, Col 4)
QT9
// @from(Ln 237376, Col 9)
gT9
// @from(Ln 237376, Col 14)
UT9
// @from(Ln 237376, Col 19)
pT9
// @from(Ln 237376, Col 24)
dT9
// @from(Ln 237376, Col 29)
cT9
// @from(Ln 237376, Col 34)
lT9
// @from(Ln 237376, Col 39)
w_6
// @from(Ln 237376, Col 44)
iT9
// @from(Ln 237376, Col 49)
Hp7
// @from(Ln 237376, Col 54)
$p7
// @from(Ln 237376, Col 59)
nT9
// @from(Ln 237376, Col 64)
zjA
// @from(Ln 237376, Col 69)
rT9
// @from(Ln 237376, Col 74)
s0A
// @from(Ln 237376, Col 79)
oT9
// @from(Ln 237376, Col 84)
z_6
// @from(Ln 237376, Col 89)
cu1
// @from(Ln 237376, Col 94)
aT9
// @from(Ln 237376, Col 99)
nU7 = (A) => aT9[A]
// @from(Ln 237377, Col 4)
nu1
// @from(Ln 237377, Col 9)
OK1
// @from(Ln 237377, Col 14)
dDw
// @from(Ln 237377, Col 19)
cDw
// @from(Ln 237377, Col 24)
lDw
// @from(Ln 237377, Col 29)
iDw
// @from(Ln 237377, Col 34)
nDw
// @from(Ln 237377, Col 39)
rDw
// @from(Ln 237377, Col 44)
oDw
// @from(Ln 237378, Col 4)
__6 = v(() => {
    _K1 = t0A();
    iu1 = {
        exec: () => null
    };
    CZ = {
        codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm,
        outputLinkReplace: /\\([\[\]])/g,
        indentCodeCompensation: /^(\s+)(?:```)/,
        beginningSpace: /^\s+/,
        endingHash: /#$/,
        startingSpaceChar: /^ /,
        endingSpaceChar: / $/,
        nonSpaceChar: /[^ ]/,
        newLineCharGlobal: /\n/g,
        tabCharGlobal: /\t/g,
        multipleSpaceGlobal: /\s+/g,
        blankLine: /^[ \t]*$/,
        doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
        blockquoteStart: /^ {0,3}>/,
        blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
        blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
        listReplaceTabs: /^\t+/,
        listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
        listIsTask: /^\[[ xX]\] /,
        listReplaceTask: /^\[[ xX]\] +/,
        anyLine: /\n.*\n/,
        hrefBrackets: /^<(.*)>$/,
        tableDelimiter: /[:|]/,
        tableAlignChars: /^\||\| *$/g,
        tableRowBlankLine: /\n[ \t]*$/,
        tableAlignRight: /^ *-+: *$/,
        tableAlignCenter: /^ *:-+: *$/,
        tableAlignLeft: /^ *:-+ *$/,
        startATag: /^<a /i,
        endATag: /^<\/a>/i,
        startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
        endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
        startAngleBracket: /^</,
        endAngleBracket: />$/,
        pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
        unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
        escapeTest: /[&<>"']/,
        escapeReplace: /[&<>"']/g,
        escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
        escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
        unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,
        caret: /(^|[^\[])\^/g,
        percentDecode: /%25/g,
        findPipe: /\|/g,
        splitPipe: / \|/,
        slashPipe: /\\\|/g,
        carriageReturn: /\r\n|\r/g,
        spaceLine: /^ +$/gm,
        notSpaceStart: /^\S*/,
        endingNewline: /\n$/,
        listItemRegex: (A) => new RegExp(`^( {0,3}${A})((?:[	 ][^\\n]*)?(?:\\n|$))`),
        nextBulletRegex: (A) => new RegExp(`^ {0,${Math.min(3,A-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),
        hrRegex: (A) => new RegExp(`^ {0,${Math.min(3,A-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),
        fencesBeginRegex: (A) => new RegExp(`^ {0,${Math.min(3,A-1)}}(?:\`\`\`|~~~)`),
        headingBeginRegex: (A) => new RegExp(`^ {0,${Math.min(3,A-1)}}#`),
        htmlBeginRegex: (A) => new RegExp(`^ {0,${Math.min(3,A-1)}}<(?:[a-z].*>|!--)`, "i")
    }, fT9 = /^(?:[ \t]*(?:\n|$))+/, VT9 = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, NT9 = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, au1 = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, TT9 = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, tU7 = /(?:[*+-]|\d{1,9}[.)])/, eU7 = C2(/^(?!bull |blockCode|fences|blockquote|heading|html)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html))+?)\n {0,3}(=+|-+) *(?:\n+|$)/).replace(/bull/g, tU7).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).getRegex(), e0A = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, vT9 = /^[^\n]+/, AjA = /(?!\s*\])(?:\\.|[^\[\]\\])+/, ET9 = C2(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", AjA).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), kT9 = C2(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, tU7).getRegex(), qjA = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, LT9 = C2("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$))", "i").replace("comment", qjA).replace("tag", H_6).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Ap7 = C2(e0A).replace("hr", au1).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", H_6).getRegex(), RT9 = C2(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Ap7).getRegex(), KjA = {
        blockquote: RT9,
        code: VT9,
        def: ET9,
        fences: NT9,
        heading: TT9,
        hr: au1,
        html: LT9,
        lheading: eU7,
        list: kT9,
        newline: fT9,
        paragraph: Ap7,
        table: iu1,
        text: vT9
    }, iU7 = C2("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", au1).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}\t)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", H_6).getRegex(), yT9 = {
        ...KjA,
        table: iU7,
        paragraph: C2(e0A).replace("hr", au1).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", iU7).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", H_6).getRegex()
    }, CT9 = {
        ...KjA,
        html: C2(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", qjA).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
        def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
        heading: /^(#{1,6})(.*)(?:\n+|$)/,
        fences: iu1,
        lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
        paragraph: C2(e0A).replace("hr", au1).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", eU7).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
    }, ST9 = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, hT9 = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, qp7 = /^( {2,}|\\)\n(?!\s*$)/, IT9 = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, $_6 = /[\p{P}\p{S}]/u, YjA = /[\s\p{P}\p{S}]/u, Kp7 = /[^\s\p{P}\p{S}]/u, xT9 = C2(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, YjA).getRegex(), Yp7 = /(?!~)[\p{P}\p{S}]/u, bT9 = /(?!~)[\s\p{P}\p{S}]/u, uT9 = /(?:[^\s\p{P}\p{S}]|~)/u, BT9 = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g, zp7 = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, mT9 = C2(zp7, "u").replace(/punct/g, $_6).getRegex(), FT9 = C2(zp7, "u").replace(/punct/g, Yp7).getRegex(), QT9 = C2(wp7, "gu").replace(/notPunctSpace/g, Kp7).replace(/punctSpace/g, YjA).replace(/punct/g, $_6).getRegex(), gT9 = C2(wp7, "gu").replace(/notPunctSpace/g, uT9).replace(/punctSpace/g, bT9).replace(/punct/g, Yp7).getRegex(), UT9 = C2("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, Kp7).replace(/punctSpace/g, YjA).replace(/punct/g, $_6).getRegex(), pT9 = C2(/\\(punct)/, "gu").replace(/punct/g, $_6).getRegex(), dT9 = C2(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), cT9 = C2(qjA).replace("(?:-->|$)", "-->").getRegex(), lT9 = C2("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", cT9).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), w_6 = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, iT9 = C2(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/).replace("label", w_6).replace("href", /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Hp7 = C2(/^!?\[(label)\]\[(ref)\]/).replace("label", w_6).replace("ref", AjA).getRegex(), $p7 = C2(/^!?\[(ref)\](?:\[\])?/).replace("ref", AjA).getRegex(), nT9 = C2("reflink|nolink(?!\\()", "g").replace("reflink", Hp7).replace("nolink", $p7).getRegex(), zjA = {
        _backpedal: iu1,
        anyPunctuation: pT9,
        autolink: dT9,
        blockSkip: BT9,
        br: qp7,
        code: hT9,
        del: iu1,
        emStrongLDelim: mT9,
        emStrongRDelimAst: QT9,
        emStrongRDelimUnd: UT9,
        escape: ST9,
        link: iT9,
        nolink: $p7,
        punctuation: xT9,
        reflink: Hp7,
        reflinkSearch: nT9,
        tag: lT9,
        text: IT9,
        url: iu1
    }, rT9 = {
        ...zjA,
        link: C2(/^!?\[(label)\]\((.*?)\)/).replace("label", w_6).getRegex(),
        reflink: C2(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", w_6).getRegex()
    }, s0A = {
        ...zjA,
        emStrongRDelimAst: gT9,
        emStrongLDelim: FT9,
        url: C2(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
        _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
        del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
        text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
    }, oT9 = {
        ...s0A,
        br: C2(qp7).replace("{2,}", "*").getRegex(),
        text: C2(s0A.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
    }, z_6 = {
        normal: KjA,
        gfm: yT9,
        pedantic: CT9
    }, cu1 = {
        normal: zjA,
        gfm: s0A,
        breaks: oT9,
        pedantic: rT9
    }, aT9 = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    };
    nu1 = class nu1 {
        options;
        block;
        constructor(A) {
            this.options = A || _K1
        }
        static passThroughHooks = new Set(["preprocess", "postprocess", "processAllTokens"]);
        preprocess(A) {
            return A
        }
        postprocess(A) {
            return A
        }
        processAllTokens(A) {
            return A
        }
        provideLexer() {
            return this.block ? SZ.lex : SZ.lexInline
        }
        provideParser() {
            return this.block ? jR.parse : jR.parseInline
        }
    };
    OK1 = new Op7;
    jz.options = jz.setOptions = function(A) {
        return OK1.setOptions(A), jz.defaults = OK1.defaults, sU7(jz.defaults), jz
    };
    jz.getDefaults = t0A;
    jz.defaults = _K1;
    jz.use = function(...A) {
        return OK1.use(...A), jz.defaults = OK1.defaults, sU7(jz.defaults), jz
    };
    jz.walkTokens = function(A, q) {
        return OK1.walkTokens(A, q)
    };
    jz.parseInline = OK1.parseInline;
    jz.Parser = jR;
    jz.parser = jR.parse;
    jz.Renderer = ou1;
    jz.TextRenderer = O_6;
    jz.Lexer = SZ;
    jz.lexer = SZ.lex;
    jz.Tokenizer = ru1;
    jz.Hooks = nu1;
    jz.parse = jz;
    dDw = jz.options, cDw = jz.setOptions, lDw = jz.use, iDw = jz.walkTokens, nDw = jz.parseInline, rDw = jR.parse, oDw = SZ.lex
})
// @from(Ln 237569, Col 0)
class _p7 {
    cache;
    constructor(A, q) {
        this.cache = new ZT({
            max: A,
            maxSize: q,
            sizeCalculation: (K) => Math.max(1, Buffer.byteLength(K.content))
        })
    }
    get(A) {
        return this.cache.get(J_6(A))
    }
    set(A, q) {
        return this.cache.set(J_6(A), q), this
    }
    has(A) {
        return this.cache.has(J_6(A))
    }
    delete(A) {
        return this.cache.delete(J_6(A))
    }
    clear() {
        this.cache.clear()
    }
    get size() {
        return this.cache.size
    }
    get max() {
        return this.cache.max
    }
    get maxSize() {
        return this.cache.maxSize
    }
    get calculatedSize() {
        return this.cache.calculatedSize
    }
    keys() {
        return this.cache.keys()
    }
    entries() {
        return this.cache.entries()
    }
    dump() {
        return this.cache.dump()
    }
    load(A) {
        this.cache.load(A)
    }
}
// @from(Ln 237619, Col 0)
function Rp(A, q = eT9) {
    return new _p7(A, q)
}
// @from(Ln 237623, Col 0)
function wjA(A) {
    return Object.fromEntries(A.entries())
}
// @from(Ln 237627, Col 0)
function Th(A) {
    return Array.from(A.keys())
}
// @from(Ln 237631, Col 0)
function yp(A) {
    let q = Rp(A.max, A.maxSize);
    return q.load(A.dump()), q
}
// @from(Ln 237636, Col 0)
function yj1(A, q) {
    let K = yp(A);
    for (let [Y, z] of q.entries()) {
        let w = K.get(Y);
        if (!w || z.timestamp > w.timestamp) K.set(Y, z)
    }
    return K
}
// @from(Ln 237644, Col 4)
JK1 = 100
// @from(Ln 237645, Col 4)
eT9 = 26214400
// @from(Ln 237646, Col 4)
pM = v(() => {
    kw1()
})
// @from(Ln 237660, Col 0)
function Xp7(A) {
    return Sp(A, y8())
}
// @from(Ln 237664, Col 0)
function Hv9(A) {
    let {
        frontmatter: q,
        content: K
    } = yD(A);
    if (!q.paths) return {
        content: K
    };
    let Y = F76(q.paths).map((z) => {
        return z.endsWith("/**") ? z.slice(0, -3) : z
    }).filter((z) => z.length > 0);
    if (Y.length === 0 || Y.every((z) => z === "**")) return {
        content: K
    };
    return {
        content: K,
        paths: Y
    }
}
// @from(Ln 237684, Col 0)
function HjA(A, q) {
    try {
        let K = b1();
        if (!K.existsSync(A) || !K.statSync(A).isFile()) return null;
        let Y = Yv9(A).toLowerCase();
        if (Y && !wv9.has(Y)) return h(`Skipping non-text file in @include: ${A}`), null;
        let z = K.readFileSync(A, {
                encoding: "utf-8"
            }),
            {
                content: w,
                paths: H
            } = Hv9(z);
        return {
            path: A,
            type: q,
            content: w,
            globs: H
        }
    } catch (K) {
        if (K instanceof Error && K.message.includes("EACCES")) c("tengu_claude_md_permission_error", {
            is_access_error: 1,
            has_home_dir: A.includes(O8()) ? 1 : 0
        })
    }
    return null
}
// @from(Ln 237712, Col 0)
function $v9(A, q) {
    let K = new Set,
        z = new SZ({
            gfm: !1
        }).lex(A);

    function w(H) {
        for (let $ of H) {
            if ($.type === "code" || $.type === "codespan") continue;
            if ($.type === "text") {
                let O = $.text || "",
                    _ = /(?:^|\s)@((?:[^\s\\]|\\ )+)/g,
                    J;
                while ((J = _.exec(O)) !== null) {
                    let X = J[1];
                    if (!X) continue;
                    if (X = X.replace(/\\ /g, " "), X) {
                        if (X.startsWith("./") || X.startsWith("~/") || X.startsWith("/") && X !== "/" || !X.startsWith("@") && !X.match(/^[#%^&*()]+/) && X.match(/^[a-zA-Z0-9._-]/)) {
                            let j = g4(X, X_6(q));
                            K.add(j)
                        }
                    }
                }
            }
            if ($.tokens) w($.tokens);
            if ($.items) w($.items)
        }
    }
    return w(z), [...K]
}
// @from(Ln 237743, Col 0)
function MR(A, q, K, Y, z = 0, w) {
    if (K.has(A) || z >= Ov9) return [];
    let {
        resolvedPath: H,
        isSymlink: $
    } = QH(b1(), A);
    if (K.add(A), $) K.add(H);
    let O = HjA(A, q);
    if (!O || !O.content.trim()) return [];
    if (w) O.parent = w;
    let _ = [];
    _.push(O);
    let J = $v9(O.content, H);
    for (let X of J) {
        if (!Xp7(X) && !Y) continue;
        let j = MR(X, q, K, Y, z + 1, A);
        _.push(...j)
    }
    return _
}
// @from(Ln 237764, Col 0)
function XK1({
    rulesDir: A,
    type: q,
    processedPaths: K,
    includeExternal: Y,
    conditionalRule: z,
    visitedDirs: w = new Set
}) {
    if (w.has(A)) return [];
    try {
        let H = b1();
        if (!H.existsSync(A) || !H.statSync(A).isDirectory()) return [];
        let {
            resolvedPath: $,
            isSymlink: O
        } = QH(H, A);
        if (w.add(A), O) w.add($);
        let _ = [],
            J = H.readdirSync($);
        for (let X of J) {
            let D = Iv(A, X.name),
                {
                    resolvedPath: j,
                    isSymlink: M
                } = QH(H, D),
                P = M ? H.statSync(j) : null,
                W = P ? P.isDirectory() : X.isDirectory(),
                G = P ? P.isFile() : X.isFile();
            if (W) _.push(...XK1({
                rulesDir: j,
                type: q,
                processedPaths: K,
                includeExternal: Y,
                conditionalRule: z,
                visitedDirs: w
            }));
            else if (G && X.name.endsWith(".md")) {
                let f = MR(j, q, K, Y);
                _.push(...f.filter((Z) => z ? Z.globs : !Z.globs))
            }
        }
        return _
    } catch (H) {
        if (H instanceof Error && H.message.includes("EACCES")) c("tengu_claude_rules_md_permission_error", {
            is_access_error: 1,
            has_home_dir: A.includes(O8()) ? 1 : 0
        });
        return []
    }
}
// @from(Ln 237815, Col 0)
function DK1() {
    return I_().filter((A) => A.content.length > Cp)
}
// @from(Ln 237819, Col 0)
function jK1() {
    return null
}
// @from(Ln 237823, Col 0)
function $jA() {
    return []
}
// @from(Ln 237827, Col 0)
function jp7(A, q) {
    let K = [],
        Y = _jA();
    if (K.push(...D_6(A, Y, "Managed", q, !1)), qX("userSettings")) {
        let z = JjA();
        K.push(...D_6(A, z, "User", q, !0))
    }
    return K
}
// @from(Ln 237837, Col 0)
function Mp7(A, q, K) {
    let Y = [];
    if (qX("projectSettings")) {
        let H = Iv(A, "CLAUDE.md");
        Y.push(...MR(H, "Project", K, !1));
        let $ = Iv(A, ".claude", "CLAUDE.md");
        Y.push(...MR($, "Project", K, !1))
    }
    if (qX("localSettings")) {
        let H = Iv(A, "CLAUDE.local.md");
        Y.push(...MR(H, "Local", K, !1))
    }
    let z = Iv(A, ".claude", "rules"),
        w = new Set(K);
    Y.push(...XK1({
        rulesDir: z,
        type: "Project",
        processedPaths: w,
        includeExternal: !1,
        conditionalRule: !1
    })), Y.push(...D_6(q, z, "Project", K, !1));
    for (let H of w) K.add(H);
    return Y
}
// @from(Ln 237862, Col 0)
function Pp7(A, q, K) {
    let Y = Iv(A, ".claude", "rules");
    return D_6(q, Y, "Project", K, !1)
}
// @from(Ln 237867, Col 0)
function D_6(A, q, K, Y, z) {
    return XK1({
        rulesDir: q,
        type: K,
        processedPaths: Y,
        includeExternal: z,
        conditionalRule: !0
    }).filter((H) => {
        if (!H.globs || H.globs.length === 0) return !1;
        let $ = K === "Project" ? X_6(X_6(q)) : y8(),
            O = Kv9(A) ? qv9($, A) : A;
        return Jp7.default().add(H.globs).ignores(O)
    })
}
// @from(Ln 237882, Col 0)
function su1() {
    let A = [];
    for (let q of I_(!0))
        if (q.type !== "User" && q.parent && !Xp7(q.path)) A.push({
            path: q.path,
            parent: q.parent
        });
    return A
}
// @from(Ln 237892, Col 0)
function OjA() {
    return su1().length > 0
}
// @from(Ln 237895, Col 0)
async function Wp7() {
    let A = sz();
    if (A.hasClaudeMdExternalIncludesApproved || A.hasClaudeMdExternalIncludesWarningShown) return !1;
    return OjA()
}
// @from(Ln 237900, Col 4)
Jp7
// @from(Ln 237900, Col 9)
zv9 = "Codebase and user instructions are shown below. Be sure to adhere to these instructions. IMPORTANT: These instructions OVERRIDE any default behavior and you MUST follow them exactly as written."
// @from(Ln 237901, Col 4)
Cp = 40000
// @from(Ln 237902, Col 4)
Cj1 = 3000
// @from(Ln 237903, Col 4)
wv9
// @from(Ln 237903, Col 9)
Ov9 = 5
// @from(Ln 237904, Col 4)
I_
// @from(Ln 237904, Col 8)
Dp7 = () => {
        let A = I_(),
            q = [];
        for (let K of A)
            if (K.content) {
                let Y = K.type === "Project" ? " (project instructions, checked into the codebase)" : K.type === "Local" ? " (user's private project instructions, not checked in)" : " (user's private global instructions for all projects)";
                q.push(`Contents of ${K.path}${Y}:

${K.content}`)
            } if (q.length === 0) return "";
        return `${zv9}

${q.join(`

`)}`
    }
// @from(Ln 237920, Col 4)
dD = v(() => {
    zq();
    B6();
    _8();
    Ez();
    u6();
    __6();
    E$();
    E2();
    cA();
    hA();
    Lg();
    pM();
    Z6();
    f0();
    xW();
    xW();
    Jp7 = o(Aj1(), 1), wv9 = new Set([".md", ".txt", ".text", ".json", ".yaml", ".yml", ".toml", ".xml", ".csv", ".html", ".htm", ".css", ".scss", ".sass", ".less", ".js", ".ts", ".tsx", ".jsx", ".mjs", ".cjs", ".mts", ".cts", ".py", ".pyi", ".pyw", ".rb", ".erb", ".rake", ".go", ".rs", ".java", ".kt", ".kts", ".scala", ".c", ".cpp", ".cc", ".cxx", ".h", ".hpp", ".hxx", ".cs", ".swift", ".sh", ".bash", ".zsh", ".fish", ".ps1", ".bat", ".cmd", ".env", ".ini", ".cfg", ".conf", ".config", ".properties", ".sql", ".graphql", ".gql", ".proto", ".vue", ".svelte", ".astro", ".ejs", ".hbs", ".pug", ".jade", ".php", ".pl", ".pm", ".lua", ".r", ".R", ".dart", ".ex", ".exs", ".erl", ".hrl", ".clj", ".cljs", ".cljc", ".edn", ".hs", ".lhs", ".elm", ".ml", ".mli", ".f", ".f90", ".f95", ".for", ".cmake", ".make", ".makefile", ".gradle", ".sbt", ".rst", ".adoc", ".asciidoc", ".org", ".tex", ".latex", ".lock", ".log", ".diff", ".patch"]);
    I_ = KA((A = !1) => {
        let q = Date.now();
        H8("info", "memory_files_started");
        let K = [],
            Y = new Set,
            z = sz(),
            w = A || z.hasClaudeMdExternalIncludesApproved || !1,
            H = cB("Managed");
        K.push(...MR(H, "Managed", Y, w));
        let $ = _jA();
        if (K.push(...XK1({
                rulesDir: $,
                type: "Managed",
                processedPaths: Y,
                includeExternal: w,
                conditionalRule: !1
            })), qX("userSettings")) {
            let J = cB("User");
            K.push(...MR(J, "User", Y, !0));
            let X = JjA();
            K.push(...XK1({
                rulesDir: X,
                type: "User",
                processedPaths: Y,
                includeExternal: !0,
                conditionalRule: !1
            }))
        }
        let O = [],
            _ = y8();
        while (_ !== Av9(_).root) O.push(_), _ = X_6(_);
        for (let J of O.reverse()) {
            if (qX("projectSettings")) {
                let X = Iv(J, "CLAUDE.md");
                K.push(...MR(X, "Project", Y, w));
                let D = Iv(J, ".claude", "CLAUDE.md");
                K.push(...MR(D, "Project", Y, w));
                let j = Iv(J, ".claude", "rules");
                K.push(...XK1({
                    rulesDir: j,
                    type: "Project",
                    processedPaths: Y,
                    includeExternal: w,
                    conditionalRule: !1
                }))
            }
            if (qX("localSettings")) {
                let X = Iv(J, "CLAUDE.local.md");
                K.push(...MR(X, "Local", Y, w))
            }
        }
        if (J6(process.env.CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD)) {
            let J = qC();
            for (let X of J) {
                let D = Iv(X, "CLAUDE.md");
                K.push(...MR(D, "Project", Y, w));
                let j = Iv(X, ".claude", "CLAUDE.md");
                K.push(...MR(j, "Project", Y, w));
                let M = Iv(X, ".claude", "rules");
                K.push(...XK1({
                    rulesDir: M,
                    type: "Project",
                    processedPaths: Y,
                    includeExternal: w,
                    conditionalRule: !1
                }))
            }
        }
        if (y2()) {
            let J = HjA(lO6(), "AutoMem");
            if (J && !Y.has(J.path)) Y.add(J.path), K.push(J)
        }
        return H8("info", "memory_files_completed", {
            duration_ms: Date.now() - q,
            file_count: K.length,
            total_content_length: K.reduce((J, X) => J + X.content.length, 0)
        }), K
    })
})
// @from(Ln 238018, Col 0)
function pO(A) {
    return typeof A === "object" && A !== null && "type" in A && A.type === "in_process_teammate"
}
// @from(Ln 238022, Col 0)
function PR(A) {
    let {
        viewingAgentTaskId: q,
        tasks: K
    } = A;
    if (!q) return;
    let Y = K[q];
    if (!Y) return;
    if (!pO(Y)) return;
    return Y
}
// @from(Ln 238034, Col 0)
function Gp7(A) {
    let q = PR(A);
    if (q) return {
        type: "viewed",
        task: q
    };
    return {
        type: "leader"
    }
}
// @from(Ln 238045, Col 0)
function Zp7(A) {
    return PR(A) !== void 0
}
// @from(Ln 238048, Col 4)
MK1 = () => {}
// @from(Ln 238050, Col 0)
function fp7(A) {
    return A.replaceAll(_v9, "'").replaceAll(Jv9, "'").replaceAll(Xv9, '"').replaceAll(Dv9, '"')
}
// @from(Ln 238054, Col 0)
function XjA(A) {
    let q = A.split(/(\r\n|\n|\r)/),
        K = "";
    for (let Y = 0; Y < q.length; Y++) {
        let z = q[Y];
        if (z !== void 0)
            if (Y % 2 === 0) K += z.replace(/\s+$/, "");
            else K += z
    }
    return K
}
// @from(Ln 238066, Col 0)
function PK1(A, q) {
    if (A.includes(q)) return q;
    let K = fp7(q),
        z = fp7(A).indexOf(K);
    if (z !== -1) return A.substring(z, z + q.length);
    return null
}
// @from(Ln 238074, Col 0)
function jv9(A, q, K, Y = !1) {
    let z = Y ? (H, $, O) => H.replaceAll($, () => O) : (H, $, O) => H.replace($, () => O);
    if (K !== "") return z(A, q, K);
    return !q.endsWith(`
`) && A.includes(q + `
`) ? z(A, q + `
`, K) : z(A, q, K)
}
// @from(Ln 238083, Col 0)
function j_6({
    filePath: A,
    fileContents: q,
    oldString: K,
    newString: Y,
    replaceAll: z = !1
}) {
    return tu1({
        filePath: A,
        fileContents: q,
        edits: [{
            old_string: K,
            new_string: Y,
            replace_all: z
        }]
    })
}