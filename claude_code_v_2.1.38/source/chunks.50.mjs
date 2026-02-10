
// @from(Ln 133267, Col 4)
G4A = 1
// @from(Ln 133268, Col 4)
Z4A = 32
// @from(Ln 133269, Col 4)
f4A = () => {}
// @from(Ln 133270, Col 4)
V5
// @from(Ln 133270, Col 8)
wK6
// @from(Ln 133270, Col 13)
NV
// @from(Ln 133270, Col 17)
TC1
// @from(Ln 133270, Col 22)
ng
// @from(Ln 133270, Col 26)
X71
// @from(Ln 133270, Col 31)
HK6
// @from(Ln 133270, Col 36)
V4A
// @from(Ln 133270, Col 41)
rg
// @from(Ln 133271, Col 4)
Wr = v(() => {
    V5 = {
        All: "all",
        Horizontal: "horizontal",
        Vertical: "vertical",
        Left: "left",
        Right: "right",
        Top: "top",
        Bottom: "bottom",
        Start: "start",
        End: "end"
    }, wK6 = {
        All: "all",
        Column: "column",
        Row: "row"
    }, NV = {
        Flex: "flex",
        None: "none"
    }, TC1 = {
        Row: "row",
        RowReverse: "row-reverse",
        Column: "column",
        ColumnReverse: "column-reverse"
    }, ng = {
        Auto: "auto",
        Stretch: "stretch",
        FlexStart: "flex-start",
        Center: "center",
        FlexEnd: "flex-end"
    }, X71 = {
        FlexStart: "flex-start",
        Center: "center",
        FlexEnd: "flex-end",
        SpaceBetween: "space-between",
        SpaceAround: "space-around",
        SpaceEvenly: "space-evenly"
    }, HK6 = {
        NoWrap: "nowrap",
        Wrap: "wrap",
        WrapReverse: "wrap-reverse"
    }, V4A = {
        Relative: "relative",
        Absolute: "absolute"
    }, rg = {
        Undefined: "undefined",
        Exactly: "exactly",
        AtMost: "at-most"
    }
})
// @from(Ln 133321, Col 0)
function OK6(A) {
    let q = $K6.get(A);
    if (q !== void 0) return q;
    let K = UA(A);
    if ($K6.size >= Qf5) $K6.clear();
    return $K6.set(A, K), K
}
// @from(Ln 133328, Col 4)
$K6
// @from(Ln 133328, Col 9)
Qf5 = 4096
// @from(Ln 133329, Col 4)
N4A = v(() => {
    LY();
    $K6 = new Map
})
// @from(Ln 133334, Col 0)
function gf5(A, q) {
    if (A.length === 0) return {
        width: 0,
        height: 0
    };
    let K = q <= 0 || !Number.isFinite(q),
        Y = 0,
        z = 0,
        w = 0;
    while (w <= A.length) {
        let H = A.indexOf(`
`, w),
            $ = H === -1 ? A.substring(w) : A.substring(w, H),
            O = OK6($);
        if (z = Math.max(z, O), K) Y++;
        else Y += O === 0 ? 1 : Math.ceil(O / q);
        if (H === -1) break;
        w = H + 1
    }
    return {
        width: z,
        height: Y
    }
}
// @from(Ln 133358, Col 4)
_K6
// @from(Ln 133359, Col 4)
m67 = v(() => {
    N4A();
    _K6 = gf5
})
// @from(Ln 133363, Col 4)
Q67 = R((RM2, F67) => {
    F67.exports = () => {
        return /[#*0-9]\uFE0F?\u20E3|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26AA\u26B0\u26B1\u26BD\u26BE\u26C4\u26C8\u26CF\u26D1\u26E9\u26F0-\u26F5\u26F7\u26F8\u26FA\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B55\u3030\u303D\u3297\u3299]\uFE0F?|[\u261D\u270C\u270D](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?|[\u270A\u270B](?:\uD83C[\uDFFB-\uDFFF])?|[\u23E9-\u23EC\u23F0\u23F3\u25FD\u2693\u26A1\u26AB\u26C5\u26CE\u26D4\u26EA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2795-\u2797\u27B0\u27BF\u2B50]|\u26D3\uFE0F?(?:\u200D\uD83D\uDCA5)?|\u26F9(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|\u2764\uFE0F?(?:\u200D(?:\uD83D\uDD25|\uD83E\uDE79))?|\uD83C(?:[\uDC04\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]\uFE0F?|[\uDF85\uDFC2\uDFC7](?:\uD83C[\uDFFB-\uDFFF])?|[\uDFC4\uDFCA](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDFCB\uDFCC](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF43\uDF45-\uDF4A\uDF4C-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uDDE6\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF]|\uDDE7\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF]|\uDDE8\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF7\uDDFA-\uDDFF]|\uDDE9\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF]|\uDDEA\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA]|\uDDEB\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7]|\uDDEC\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE]|\uDDED\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA]|\uDDEE\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9]|\uDDEF\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5]|\uDDF0\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF]|\uDDF1\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE]|\uDDF2\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF]|\uDDF3\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF]|\uDDF4\uD83C\uDDF2|\uDDF5\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE]|\uDDF6\uD83C\uDDE6|\uDDF7\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC]|\uDDF8\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF]|\uDDF9\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF]|\uDDFA\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF]|\uDDFB\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA]|\uDDFC\uD83C[\uDDEB\uDDF8]|\uDDFD\uD83C\uDDF0|\uDDFE\uD83C[\uDDEA\uDDF9]|\uDDFF\uD83C[\uDDE6\uDDF2\uDDFC]|\uDF44(?:\u200D\uD83D\uDFEB)?|\uDF4B(?:\u200D\uD83D\uDFE9)?|\uDFC3(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDFF3\uFE0F?(?:\u200D(?:\u26A7\uFE0F?|\uD83C\uDF08))?|\uDFF4(?:\u200D\u2620\uFE0F?|\uDB40\uDC67\uDB40\uDC62\uDB40(?:\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDC73\uDB40\uDC63\uDB40\uDC74|\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F)?)|\uD83D(?:[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3]\uFE0F?|[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC](?:\uD83C[\uDFFB-\uDFFF])?|[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4\uDEB5](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD74\uDD90](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?|[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC25\uDC27-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDC8E\uDC90\uDC92-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE2D\uDE2F-\uDE34\uDE37-\uDE41\uDE43\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED7\uDEDC-\uDEDF\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB\uDFF0]|\uDC08(?:\u200D\u2B1B)?|\uDC15(?:\u200D\uD83E\uDDBA)?|\uDC26(?:\u200D(?:\u2B1B|\uD83D\uDD25))?|\uDC3B(?:\u200D\u2744\uFE0F?)?|\uDC41\uFE0F?(?:\u200D\uD83D\uDDE8\uFE0F?)?|\uDC68(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDC68\uDC69]\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFE])))?))?|\uDC69(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?[\uDC68\uDC69]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?|\uDC69\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?))|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFE])))?))?|\uDC6F(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDD75(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDE2E(?:\u200D\uD83D\uDCA8)?|\uDE35(?:\u200D\uD83D\uDCAB)?|\uDE36(?:\u200D\uD83C\uDF2B\uFE0F?)?|\uDE42(?:\u200D[\u2194\u2195]\uFE0F?)?|\uDEB6(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?)|\uD83E(?:[\uDD0C\uDD0F\uDD18-\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5\uDEC3-\uDEC5\uDEF0\uDEF2-\uDEF8](?:\uD83C[\uDFFB-\uDFFF])?|[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD\uDDCF\uDDD4\uDDD6-\uDDDD](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDDDE\uDDDF](?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD0D\uDD0E\uDD10-\uDD17\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCC\uDDD0\uDDE0-\uDDFF\uDE70-\uDE7C\uDE80-\uDE89\uDE8F-\uDEC2\uDEC6\uDECE-\uDEDC\uDEDF-\uDEE9]|\uDD3C(?:\u200D[\u2640\u2642]\uFE0F?|\uD83C[\uDFFB-\uDFFF])?|\uDDCE(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDDD1(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1|\uDDD1\u200D\uD83E\uDDD2(?:\u200D\uD83E\uDDD2)?|\uDDD2(?:\u200D\uD83E\uDDD2)?))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFC-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFD-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFD\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFE]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?))?|\uDEF1(?:\uD83C(?:\uDFFB(?:\u200D\uD83E\uDEF2\uD83C[\uDFFC-\uDFFF])?|\uDFFC(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFD-\uDFFF])?|\uDFFD(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])?|\uDFFE(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFD\uDFFF])?|\uDFFF(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFE])?))?)/g
    }
})
// @from(Ln 133369, Col 0)
function D71(A, q = {}) {
    if (typeof A !== "string" || A.length === 0) return 0;
    let {
        ambiguousIsNarrow: K = !0,
        countAnsiEscapeCodes: Y = !1
    } = q;
    if (!Y) A = JH(A);
    if (A.length === 0) return 0;
    let z = 0,
        w = {
            ambiguousAsWide: !K
        };
    for (let {
            segment: H
        }
        of Uf5.segment(A)) {
        let $ = H.codePointAt(0);
        if ($ <= 31 || $ >= 127 && $ <= 159) continue;
        if ($ >= 8203 && $ <= 8207 || $ === 65279) continue;
        if ($ >= 768 && $ <= 879 || $ >= 6832 && $ <= 6911 || $ >= 7616 && $ <= 7679 || $ >= 8400 && $ <= 8447 || $ >= 65056 && $ <= 65071) continue;
        if ($ >= 55296 && $ <= 57343) continue;
        if ($ >= 65024 && $ <= 65039) continue;
        if (pf5.test(H)) continue;
        if (g67.default().test(H)) {
            z += 2;
            continue
        }
        z += A71($, w)
    }
    return z
}
// @from(Ln 133400, Col 4)
g67
// @from(Ln 133400, Col 9)
Uf5
// @from(Ln 133400, Col 14)
pf5
// @from(Ln 133401, Col 4)
U67 = v(() => {
    XL();
    $C1();
    g67 = o(Q67(), 1), Uf5 = new Intl.Segmenter, pf5 = /^\p{Default_Ignorable_Code_Point}$/u
})
// @from(Ln 133407, Col 0)
function lf5() {
    let A = new Map;
    for (let [q, K] of Object.entries(u$)) {
        for (let [Y, z] of Object.entries(K)) u$[Y] = {
            open: `\x1B[${z[0]}m`,
            close: `\x1B[${z[1]}m`
        }, K[Y] = u$[Y], A.set(z[0], z[1]);
        Object.defineProperty(u$, q, {
            value: K,
            enumerable: !1
        })
    }
    return Object.defineProperty(u$, "codes", {
        value: A,
        enumerable: !1
    }), u$.color.close = "\x1B[39m", u$.bgColor.close = "\x1B[49m", u$.color.ansi = p67(), u$.color.ansi256 = d67(), u$.color.ansi16m = c67(), u$.bgColor.ansi = p67(10), u$.bgColor.ansi256 = d67(10), u$.bgColor.ansi16m = c67(10), Object.defineProperties(u$, {
        rgbToAnsi256: {
            value: (q, K, Y) => {
                if (q === K && K === Y) {
                    if (q < 8) return 16;
                    if (q > 248) return 231;
                    return Math.round((q - 8) / 247 * 24) + 232
                }
                return 16 + 36 * Math.round(q / 255 * 5) + 6 * Math.round(K / 255 * 5) + Math.round(Y / 255 * 5)
            },
            enumerable: !1
        },
        hexToRgb: {
            value: (q) => {
                let K = /[a-f\d]{6}|[a-f\d]{3}/i.exec(q.toString(16));
                if (!K) return [0, 0, 0];
                let [Y] = K;
                if (Y.length === 3) Y = [...Y].map((w) => w + w).join("");
                let z = Number.parseInt(Y, 16);
                return [z >> 16 & 255, z >> 8 & 255, z & 255]
            },
            enumerable: !1
        },
        hexToAnsi256: {
            value: (q) => u$.rgbToAnsi256(...u$.hexToRgb(q)),
            enumerable: !1
        },
        ansi256ToAnsi: {
            value: (q) => {
                if (q < 8) return 30 + q;
                if (q < 16) return 90 + (q - 8);
                let K, Y, z;
                if (q >= 232) K = ((q - 232) * 10 + 8) / 255, Y = K, z = K;
                else {
                    q -= 16;
                    let $ = q % 36;
                    K = Math.floor(q / 36) / 5, Y = Math.floor($ / 6) / 5, z = $ % 6 / 5
                }
                let w = Math.max(K, Y, z) * 2;
                if (w === 0) return 30;
                let H = 30 + (Math.round(z) << 2 | Math.round(Y) << 1 | Math.round(K));
                if (w === 2) H += 60;
                return H
            },
            enumerable: !1
        },
        rgbToAnsi: {
            value: (q, K, Y) => u$.ansi256ToAnsi(u$.rgbToAnsi256(q, K, Y)),
            enumerable: !1
        },
        hexToAnsi: {
            value: (q) => u$.ansi256ToAnsi(u$.hexToAnsi256(q)),
            enumerable: !1
        }
    }), u$
}
// @from(Ln 133478, Col 4)
p67 = (A = 0) => (q) => `\x1B[${q+A}m`
// @from(Ln 133479, Col 4)
d67 = (A = 0) => (q) => `\x1B[${38+A};5;${q}m`
// @from(Ln 133480, Col 4)
c67 = (A = 0) => (q, K, Y) => `\x1B[${38+A};2;${q};${K};${Y}m`
// @from(Ln 133481, Col 4)
u$
// @from(Ln 133481, Col 8)
hM2
// @from(Ln 133481, Col 13)
df5
// @from(Ln 133481, Col 18)
cf5
// @from(Ln 133481, Col 23)
IM2
// @from(Ln 133481, Col 28)
if5
// @from(Ln 133481, Col 33)
JJ
// @from(Ln 133482, Col 4)
vC1 = v(() => {
    u$ = {
        modifier: {
            reset: [0, 0],
            bold: [1, 22],
            dim: [2, 22],
            italic: [3, 23],
            underline: [4, 24],
            overline: [53, 55],
            inverse: [7, 27],
            hidden: [8, 28],
            strikethrough: [9, 29]
        },
        color: {
            black: [30, 39],
            red: [31, 39],
            green: [32, 39],
            yellow: [33, 39],
            blue: [34, 39],
            magenta: [35, 39],
            cyan: [36, 39],
            white: [37, 39],
            blackBright: [90, 39],
            gray: [90, 39],
            grey: [90, 39],
            redBright: [91, 39],
            greenBright: [92, 39],
            yellowBright: [93, 39],
            blueBright: [94, 39],
            magentaBright: [95, 39],
            cyanBright: [96, 39],
            whiteBright: [97, 39]
        },
        bgColor: {
            bgBlack: [40, 49],
            bgRed: [41, 49],
            bgGreen: [42, 49],
            bgYellow: [43, 49],
            bgBlue: [44, 49],
            bgMagenta: [45, 49],
            bgCyan: [46, 49],
            bgWhite: [47, 49],
            bgBlackBright: [100, 49],
            bgGray: [100, 49],
            bgGrey: [100, 49],
            bgRedBright: [101, 49],
            bgGreenBright: [102, 49],
            bgYellowBright: [103, 49],
            bgBlueBright: [104, 49],
            bgMagentaBright: [105, 49],
            bgCyanBright: [106, 49],
            bgWhiteBright: [107, 49]
        }
    }, hM2 = Object.keys(u$.modifier), df5 = Object.keys(u$.color), cf5 = Object.keys(u$.bgColor), IM2 = [...df5, ...cf5];
    if5 = lf5(), JJ = if5
})
// @from(Ln 133539, Col 0)
function Gr(A, q, K) {
    return String(A).normalize().replaceAll(`\r
`, `
`).split(`
`).map((Y) => sf5(Y, q, K)).join(`
`)
}
// @from(Ln 133546, Col 4)
XK6
// @from(Ln 133546, Col 9)
nf5 = 39
// @from(Ln 133547, Col 4)
v4A = "\x07"
// @from(Ln 133548, Col 4)
n67 = "["
// @from(Ln 133549, Col 4)
rf5 = "]"
// @from(Ln 133550, Col 4)
r67 = "m"
// @from(Ln 133551, Col 4)
JK6
// @from(Ln 133551, Col 9)
l67 = (A) => `${XK6.values().next().value}${n67}${A}${r67}`
// @from(Ln 133552, Col 4)
i67 = (A) => `${XK6.values().next().value}${JK6}${A}${v4A}`
// @from(Ln 133553, Col 4)
of5 = (A) => A.split(" ").map((q) => D71(q))
// @from(Ln 133554, Col 4)
T4A = (A, q, K) => {
        let Y = [...q],
            z = !1,
            w = !1,
            H = D71(JH(A.at(-1)));
        for (let [$, O] of Y.entries()) {
            let _ = D71(O);
            if (H + _ <= K) A[A.length - 1] += O;
            else A.push(O), H = 0;
            if (XK6.has(O)) z = !0, w = Y.slice($ + 1, $ + 1 + JK6.length).join("") === JK6;
            if (z) {
                if (w) {
                    if (O === v4A) z = !1, w = !1
                } else if (O === r67) z = !1;
                continue
            }
            if (H += _, H === K && $ < Y.length - 1) A.push(""), H = 0
        }
        if (!H && A.at(-1).length > 0 && A.length > 1) A[A.length - 2] += A.pop()
    }
// @from(Ln 133574, Col 4)
af5 = (A) => {
        let q = A.split(" "),
            K = q.length;
        while (K > 0) {
            if (D71(q[K - 1]) > 0) break;
            K--
        }
        if (K === q.length) return A;
        return q.slice(0, K).join(" ") + q.slice(K).join("")
    }
// @from(Ln 133584, Col 4)
sf5 = (A, q, K = {}) => {
        if (K.trim !== !1 && A.trim() === "") return "";
        let Y = "",
            z, w, H = of5(A),
            $ = [""];
        for (let [X, D] of A.split(" ").entries()) {
            if (K.trim !== !1) $[$.length - 1] = $.at(-1).trimStart();
            let j = D71($.at(-1));
            if (X !== 0) {
                if (j >= q && (K.wordWrap === !1 || K.trim === !1)) $.push(""), j = 0;
                if (j > 0 || K.trim === !1) $[$.length - 1] += " ", j++
            }
            if (K.hard && H[X] > q) {
                let M = q - j,
                    P = 1 + Math.floor((H[X] - M - 1) / q);
                if (Math.floor((H[X] - 1) / q) < P) $.push("");
                T4A($, D, q);
                continue
            }
            if (j + H[X] > q && j > 0 && H[X] > 0) {
                if (K.wordWrap === !1 && j < q) {
                    T4A($, D, q);
                    continue
                }
                $.push("")
            }
            if (j + H[X] > q && K.wordWrap === !1) {
                T4A($, D, q);
                continue
            }
            $[$.length - 1] += D
        }
        if (K.trim !== !1) $ = $.map((X) => af5(X));
        let O = $.join(`
`),
            _ = [...O],
            J = 0;
        for (let [X, D] of _.entries()) {
            if (Y += D, XK6.has(D)) {
                let {
                    groups: M
                } = new RegExp(`(?:\\${n67}(?<code>\\d+)m|\\${JK6}(?<uri>.*)${v4A})`).exec(O.slice(J)) || {
                    groups: {}
                };
                if (M.code !== void 0) {
                    let P = Number.parseFloat(M.code);
                    z = P === nf5 ? void 0 : P
                } else if (M.uri !== void 0) w = M.uri.length === 0 ? void 0 : M.uri
            }
            let j = JJ.codes.get(Number(z));
            if (_[X + 1] === `
`) {
                if (w) Y += i67("");
                if (z && j) Y += l67(j)
            } else if (D === `
`) {
                if (z && j) Y += l67(z);
                if (w) Y += i67(w)
            }
            J += D.length
        }
        return Y
    }
// @from(Ln 133647, Col 4)
DK6 = v(() => {
    U67();
    XL();
    vC1();
    XK6 = new Set(["\x1B", ""]), JK6 = `${rf5}8;;`
})
// @from(Ln 133654, Col 0)
function E4A(A) {
    if (!Number.isInteger(A)) return !1;
    return A >= 4352 && (A <= 4447 || A === 9001 || A === 9002 || 11904 <= A && A <= 12871 && A !== 12351 || 12880 <= A && A <= 19903 || 19968 <= A && A <= 42182 || 43360 <= A && A <= 43388 || 44032 <= A && A <= 55203 || 63744 <= A && A <= 64255 || 65040 <= A && A <= 65049 || 65072 <= A && A <= 65131 || 65281 <= A && A <= 65376 || 65504 <= A && A <= 65510 || 110592 <= A && A <= 110593 || 127488 <= A && A <= 127569 || 131072 <= A && A <= 262141)
}
// @from(Ln 133659, Col 0)
function Du(A, q, K) {
    let Y = [...A],
        z = [],
        w = typeof K === "number" ? K : Y.length,
        H = !1,
        $, O = 0,
        _ = "";
    for (let [J, X] of Y.entries()) {
        let D = !1;
        if (a67.includes(X)) {
            let j = /\d[^m]*/.exec(A.slice(J, J + 18));
            if ($ = j && j.length > 0 ? j[0] : void 0, O < w) {
                if (H = !0, $ !== void 0) z.push($)
            }
        } else if (H && X === "m") H = !1, D = !0;
        if (!H && !D) O++;
        if (!tf5.test(X) && E4A(X.codePointAt())) {
            if (O++, typeof K !== "number") w++
        }
        if (O > q && O <= w) _ += X;
        else if (O === q && !H && $ !== void 0) _ = o67(z);
        else if (O >= w) {
            _ += o67(z, !0, $);
            break
        }
    }
    return _
}
// @from(Ln 133687, Col 4)
tf5
// @from(Ln 133687, Col 9)
a67
// @from(Ln 133687, Col 14)
jK6 = (A) => `${a67[0]}[${A}m`
// @from(Ln 133688, Col 4)
o67 = (A, q, K) => {
        let Y = [];
        A = [...A];
        for (let z of A) {
            let w = z;
            if (z.includes(";")) z = z.split(";")[0][0] + "0";
            let H = JJ.codes.get(Number.parseInt(z, 10));
            if (H) {
                let $ = A.indexOf(H.toString());
                if ($ === -1) Y.push(jK6(q ? H : w));
                else A.splice($, 1)
            } else if (q) {
                Y.push(jK6(0));
                break
            } else Y.push(jK6(w))
        }
        if (q) {
            if (Y = Y.filter((z, w) => Y.indexOf(z) === w), K !== void 0) {
                let z = jK6(JJ.codes.get(Number.parseInt(K, 10)));
                Y = Y.reduce((w, H) => H === z ? [H, ...w] : [...w, H], [])
            }
        }
        return Y.join("")
    }
// @from(Ln 133712, Col 4)
s67 = v(() => {
    vC1();
    tf5 = /^[\uD800-\uDBFF][\uDC00-\uDFFF]$/, a67 = ["\x1B", ""]
})
// @from(Ln 133716, Col 4)
e67 = R((pM2, t67) => {
    t67.exports = () => {
        return /[#*0-9]\uFE0F?\u20E3|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26AA\u26B0\u26B1\u26BD\u26BE\u26C4\u26C8\u26CF\u26D1\u26E9\u26F0-\u26F5\u26F7\u26F8\u26FA\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B55\u3030\u303D\u3297\u3299]\uFE0F?|[\u261D\u270C\u270D](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?|[\u270A\u270B](?:\uD83C[\uDFFB-\uDFFF])?|[\u23E9-\u23EC\u23F0\u23F3\u25FD\u2693\u26A1\u26AB\u26C5\u26CE\u26D4\u26EA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2795-\u2797\u27B0\u27BF\u2B50]|\u26D3\uFE0F?(?:\u200D\uD83D\uDCA5)?|\u26F9(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|\u2764\uFE0F?(?:\u200D(?:\uD83D\uDD25|\uD83E\uDE79))?|\uD83C(?:[\uDC04\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]\uFE0F?|[\uDF85\uDFC2\uDFC7](?:\uD83C[\uDFFB-\uDFFF])?|[\uDFC4\uDFCA](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDFCB\uDFCC](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF43\uDF45-\uDF4A\uDF4C-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uDDE6\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF]|\uDDE7\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF]|\uDDE8\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF7\uDDFA-\uDDFF]|\uDDE9\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF]|\uDDEA\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA]|\uDDEB\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7]|\uDDEC\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE]|\uDDED\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA]|\uDDEE\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9]|\uDDEF\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5]|\uDDF0\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF]|\uDDF1\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE]|\uDDF2\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF]|\uDDF3\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF]|\uDDF4\uD83C\uDDF2|\uDDF5\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE]|\uDDF6\uD83C\uDDE6|\uDDF7\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC]|\uDDF8\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF]|\uDDF9\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF]|\uDDFA\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF]|\uDDFB\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA]|\uDDFC\uD83C[\uDDEB\uDDF8]|\uDDFD\uD83C\uDDF0|\uDDFE\uD83C[\uDDEA\uDDF9]|\uDDFF\uD83C[\uDDE6\uDDF2\uDDFC]|\uDF44(?:\u200D\uD83D\uDFEB)?|\uDF4B(?:\u200D\uD83D\uDFE9)?|\uDFC3(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDFF3\uFE0F?(?:\u200D(?:\u26A7\uFE0F?|\uD83C\uDF08))?|\uDFF4(?:\u200D\u2620\uFE0F?|\uDB40\uDC67\uDB40\uDC62\uDB40(?:\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDC73\uDB40\uDC63\uDB40\uDC74|\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F)?)|\uD83D(?:[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3]\uFE0F?|[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC](?:\uD83C[\uDFFB-\uDFFF])?|[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4\uDEB5](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD74\uDD90](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?|[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC25\uDC27-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDC8E\uDC90\uDC92-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE2D\uDE2F-\uDE34\uDE37-\uDE41\uDE43\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED7\uDEDC-\uDEDF\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB\uDFF0]|\uDC08(?:\u200D\u2B1B)?|\uDC15(?:\u200D\uD83E\uDDBA)?|\uDC26(?:\u200D(?:\u2B1B|\uD83D\uDD25))?|\uDC3B(?:\u200D\u2744\uFE0F?)?|\uDC41\uFE0F?(?:\u200D\uD83D\uDDE8\uFE0F?)?|\uDC68(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDC68\uDC69]\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFE])))?))?|\uDC69(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?[\uDC68\uDC69]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?|\uDC69\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?))|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFE])))?))?|\uDC6F(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDD75(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDE2E(?:\u200D\uD83D\uDCA8)?|\uDE35(?:\u200D\uD83D\uDCAB)?|\uDE36(?:\u200D\uD83C\uDF2B\uFE0F?)?|\uDE42(?:\u200D[\u2194\u2195]\uFE0F?)?|\uDEB6(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?)|\uD83E(?:[\uDD0C\uDD0F\uDD18-\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5\uDEC3-\uDEC5\uDEF0\uDEF2-\uDEF8](?:\uD83C[\uDFFB-\uDFFF])?|[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD\uDDCF\uDDD4\uDDD6-\uDDDD](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDDDE\uDDDF](?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD0D\uDD0E\uDD10-\uDD17\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCC\uDDD0\uDDE0-\uDDFF\uDE70-\uDE7C\uDE80-\uDE89\uDE8F-\uDEC2\uDEC6\uDECE-\uDEDC\uDEDF-\uDEE9]|\uDD3C(?:\u200D[\u2640\u2642]\uFE0F?|\uD83C[\uDFFB-\uDFFF])?|\uDDCE(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDDD1(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1|\uDDD1\u200D\uD83E\uDDD2(?:\u200D\uD83E\uDDD2)?|\uDDD2(?:\u200D\uD83E\uDDD2)?))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFC-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFD-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFD\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFE]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?))?|\uDEF1(?:\uD83C(?:\uDFFB(?:\u200D\uD83E\uDEF2\uD83C[\uDFFC-\uDFFF])?|\uDFFC(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFD-\uDFFF])?|\uDFFD(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])?|\uDFFE(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFD\uDFFF])?|\uDFFF(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFE])?))?)/g
    }
})
// @from(Ln 133722, Col 0)
function s_1(A, q = {}) {
    if (typeof A !== "string" || A.length === 0) return 0;
    let {
        ambiguousIsNarrow: K = !0,
        countAnsiEscapeCodes: Y = !1
    } = q;
    if (!Y) A = JH(A);
    if (A.length === 0) return 0;
    let z = 0,
        w = {
            ambiguousAsWide: !K
        };
    for (let {
            segment: H
        }
        of ef5.segment(A)) {
        let $ = H.codePointAt(0);
        if ($ <= 31 || $ >= 127 && $ <= 159) continue;
        if ($ >= 8203 && $ <= 8207 || $ === 65279) continue;
        if ($ >= 768 && $ <= 879 || $ >= 6832 && $ <= 6911 || $ >= 7616 && $ <= 7679 || $ >= 8400 && $ <= 8447 || $ >= 65056 && $ <= 65071) continue;
        if ($ >= 55296 && $ <= 57343) continue;
        if ($ >= 65024 && $ <= 65039) continue;
        if (AV5.test(H)) continue;
        if (AA7.default().test(H)) {
            z += 2;
            continue
        }
        z += A71($, w)
    }
    return z
}
// @from(Ln 133753, Col 4)
AA7
// @from(Ln 133753, Col 9)
ef5
// @from(Ln 133753, Col 14)
AV5
// @from(Ln 133754, Col 4)
qA7 = v(() => {
    XL();
    $C1();
    AA7 = o(e67(), 1), ef5 = new Intl.Segmenter, AV5 = /^\p{Default_Ignorable_Code_Point}$/u
})
// @from(Ln 133760, Col 0)
function MK6(A, q, K) {
    if (A.charAt(q) === " ") return q;
    let Y = K ? 1 : -1;
    for (let z = 0; z <= 3; z++) {
        let w = q + z * Y;
        if (A.charAt(w) === " ") return w
    }
    return q
}
// @from(Ln 133770, Col 0)
function k4A(A, q, K = {}) {
    let {
        position: Y = "end",
        space: z = !1,
        preferTruncationOnSpace: w = !1
    } = K, {
        truncationCharacter: H = "…"
    } = K;
    if (typeof A !== "string") throw TypeError(`Expected \`input\` to be a string, got ${typeof A}`);
    if (typeof q !== "number") throw TypeError(`Expected \`columns\` to be a number, got ${typeof q}`);
    if (q < 1) return "";
    if (q === 1) return H;
    let $ = s_1(A);
    if ($ <= q) return A;
    if (Y === "start") {
        if (w) {
            let O = MK6(A, $ - q + 1, !0);
            return H + Du(A, O, $).trim()
        }
        if (z === !0) H += " ";
        return H + Du(A, $ - q + s_1(H), $)
    }
    if (Y === "middle") {
        if (z === !0) H = ` ${H} `;
        let O = Math.floor(q / 2);
        if (w) {
            let _ = MK6(A, O),
                J = MK6(A, $ - (q - O) + 1, !0);
            return Du(A, 0, _) + H + Du(A, J, $).trim()
        }
        return Du(A, 0, O) + H + Du(A, $ - (q - O) + s_1(H), $)
    }
    if (Y === "end") {
        if (w) {
            let O = MK6(A, q - 1);
            return Du(A, 0, O) + H
        }
        if (z === !0) H = ` ${H}`;
        return Du(A, 0, q - s_1(H)) + H
    }
    throw Error(`Expected \`options.position\` to be either \`start\`, \`middle\` or \`end\`, got ${Y}`)
}
// @from(Ln 133812, Col 4)
KA7 = v(() => {
    s67();
    qA7()
})
// @from(Ln 133816, Col 4)
YA7
// @from(Ln 133816, Col 9)
qV5 = (A, q, K) => {
        let Y = A + String(q) + String(K),
            z = YA7[Y];
        if (z) return z;
        let w = A;
        if (K === "wrap") w = Gr(A, q, {
            trim: !1,
            hard: !0
        });
        else if (K === "wrap-trim") w = Gr(A, q, {
            trim: !0,
            hard: !0
        });
        if (K.startsWith("truncate")) {
            let H = "end";
            if (K === "truncate-middle") H = "middle";
            if (K === "truncate-start") H = "start";
            w = k4A(A, q, {
                position: H
            })
        }
        return YA7[Y] = w, w
    }
// @from(Ln 133839, Col 4)
TV
// @from(Ln 133840, Col 4)
PK6 = v(() => {
    DK6();
    KA7();
    YA7 = {}, TV = qV5
})
// @from(Ln 133846, Col 0)
function WK6(A, q = {}, K) {
    let Y = [],
        z = A.textStyles ? {
            ...q,
            ...A.textStyles
        } : q;
    for (let w of A.childNodes) {
        if (w === void 0) continue;
        if (w.nodeName === "#text") {
            if (w.nodeValue.length > 0) Y.push({
                text: w.nodeValue,
                styles: z,
                hyperlink: K
            })
        } else if (w.nodeName === "ink-text" || w.nodeName === "ink-virtual-text") Y.push(...WK6(w, z, K));
        else if (w.nodeName === "ink-link") {
            let H = w.attributes.href;
            Y.push(...WK6(w, z, H || K))
        }
    }
    return Y
}
// @from(Ln 133869, Col 0)
function L4A(A) {
    let q = "";
    for (let K of A.childNodes) {
        if (K === void 0) continue;
        if (K.nodeName === "#text") q += K.nodeValue;
        else if (K.nodeName === "ink-text" || K.nodeName === "ink-virtual-text") q += L4A(K);
        else if (K.nodeName === "ink-link") q += L4A(K)
    }
    return q
}
// @from(Ln 133879, Col 4)
zA7
// @from(Ln 133880, Col 4)
R4A = v(() => {
    zA7 = L4A
})
// @from(Ln 133884, Col 0)
function y4A(A) {
    return A >= 48 && A <= 126
}
// @from(Ln 133887, Col 4)
ju
// @from(Ln 133887, Col 8)
Zr = "\x1B"
// @from(Ln 133888, Col 4)
fr = "\x07"
// @from(Ln 133889, Col 4)
Vr = ";"
// @from(Ln 133890, Col 4)
XS
// @from(Ln 133891, Col 4)
j71 = v(() => {
    ju = {
        NUL: 0,
        SOH: 1,
        STX: 2,
        ETX: 3,
        EOT: 4,
        ENQ: 5,
        ACK: 6,
        BEL: 7,
        BS: 8,
        HT: 9,
        LF: 10,
        VT: 11,
        FF: 12,
        CR: 13,
        SO: 14,
        SI: 15,
        DLE: 16,
        DC1: 17,
        DC2: 18,
        DC3: 19,
        DC4: 20,
        NAK: 21,
        SYN: 22,
        ETB: 23,
        CAN: 24,
        EM: 25,
        SUB: 26,
        ESC: 27,
        FS: 28,
        GS: 29,
        RS: 30,
        US: 31,
        DEL: 127
    }, XS = {
        CSI: 91,
        OSC: 93,
        DCS: 80,
        APC: 95,
        PM: 94,
        SOS: 88,
        ST: 92
    }
})
// @from(Ln 133937, Col 0)
function wA7(A) {
    return A >= t_1.PARAM_START && A <= t_1.PARAM_END
}
// @from(Ln 133941, Col 0)
function GK6(A) {
    return A >= t_1.INTERMEDIATE_START && A <= t_1.INTERMEDIATE_END
}
// @from(Ln 133945, Col 0)
function HA7(A) {
    return A >= t_1.FINAL_START && A <= t_1.FINAL_END
}
// @from(Ln 133949, Col 0)
function uO(...A) {
    if (A.length === 0) return C4A;
    if (A.length === 1) return `${C4A}${A[0]}`;
    let q = A.slice(0, -1),
        K = A[A.length - 1];
    return `${C4A}${q.join(Vr)}${K}`
}
// @from(Ln 133957, Col 0)
function _A7(A = 1) {
    return A === 0 ? "" : uO(A, "A")
}
// @from(Ln 133961, Col 0)
function KV5(A = 1) {
    return A === 0 ? "" : uO(A, "B")
}
// @from(Ln 133965, Col 0)
function YV5(A = 1) {
    return A === 0 ? "" : uO(A, "C")
}
// @from(Ln 133969, Col 0)
function zV5(A = 1) {
    return A === 0 ? "" : uO(A, "D")
}
// @from(Ln 133973, Col 0)
function JA7(A) {
    return uO(A, "G")
}
// @from(Ln 133977, Col 0)
function XA7(A, q) {
    let K = "";
    if (A < 0) K += zV5(-A);
    else if (A > 0) K += YV5(A);
    if (q < 0) K += _A7(-q);
    else if (q > 0) K += KV5(q);
    return K
}
// @from(Ln 133986, Col 0)
function DA7(A) {
    if (A <= 0) return "";
    let q = "";
    for (let K = 0; K < A; K++)
        if (q += HV5, K < A - 1) q += _A7(1);
    return q += wV5, q
}
// @from(Ln 133993, Col 4)
C4A
// @from(Ln 133993, Col 9)
t_1
// @from(Ln 133993, Col 14)
B$
// @from(Ln 133993, Col 18)
$A7
// @from(Ln 133993, Col 23)
OA7
// @from(Ln 133993, Col 28)
S4A
// @from(Ln 133993, Col 33)
wV5
// @from(Ln 133993, Col 38)
h4A
// @from(Ln 133993, Col 43)
qP2
// @from(Ln 133993, Col 48)
KP2
// @from(Ln 133993, Col 53)
HV5
// @from(Ln 133993, Col 58)
ZK6
// @from(Ln 133993, Col 63)
I4A
// @from(Ln 133993, Col 68)
jA7
// @from(Ln 133993, Col 73)
MA7
// @from(Ln 133993, Col 78)
PA7
// @from(Ln 133993, Col 83)
WA7
// @from(Ln 133993, Col 88)
GA7
// @from(Ln 133993, Col 93)
e_1
// @from(Ln 133994, Col 4)
Mu = v(() => {
    j71();
    C4A = Zr + String.fromCharCode(XS.CSI), t_1 = {
        PARAM_START: 48,
        PARAM_END: 63,
        INTERMEDIATE_START: 32,
        INTERMEDIATE_END: 47,
        FINAL_START: 64,
        FINAL_END: 126
    };
    B$ = {
        CUU: 65,
        CUD: 66,
        CUF: 67,
        CUB: 68,
        CNL: 69,
        CPL: 70,
        CHA: 71,
        CUP: 72,
        CHT: 73,
        VPA: 100,
        HVP: 102,
        ED: 74,
        EL: 75,
        ECH: 88,
        IL: 76,
        DL: 77,
        ICH: 64,
        DCH: 80,
        SU: 83,
        SD: 84,
        SM: 104,
        RM: 108,
        SGR: 109,
        DSR: 110,
        DECSCUSR: 113,
        DECSTBM: 114,
        SCOSC: 115,
        SCORC: 117,
        CBT: 90
    }, $A7 = ["toEnd", "toStart", "all", "scrollback"], OA7 = ["toEnd", "toStart", "all"], S4A = [{
        style: "block",
        blinking: !0
    }, {
        style: "block",
        blinking: !0
    }, {
        style: "block",
        blinking: !1
    }, {
        style: "underline",
        blinking: !0
    }, {
        style: "underline",
        blinking: !1
    }, {
        style: "bar",
        blinking: !0
    }, {
        style: "bar",
        blinking: !1
    }];
    wV5 = uO("G"), h4A = uO("H");
    qP2 = uO("s"), KP2 = uO("u"), HV5 = uO(2, "K"), ZK6 = uO(2, "J"), I4A = uO(3, "J");
    jA7 = uO("200~"), MA7 = uO("201~"), PA7 = uO("I"), WA7 = uO("O"), GA7 = uO(">1u"), e_1 = uO("<u")
})
// @from(Ln 134061, Col 0)
function AJ1() {
    let A = "ground",
        q = "";
    return {
        feed(K) {
            let Y = ZA7(K, A, q, !1);
            return A = Y.state.state, q = Y.state.buffer, Y.tokens
        },
        flush() {
            let K = ZA7("", A, q, !0);
            return A = K.state.state, q = K.state.buffer, K.tokens
        },
        reset() {
            A = "ground", q = ""
        },
        buffer() {
            return q
        }
    }
}
// @from(Ln 134082, Col 0)
function ZA7(A, q, K, Y) {
    let z = [],
        w = {
            state: q,
            buffer: ""
        },
        H = K + A,
        $ = 0,
        O = 0,
        _ = 0,
        J = () => {
            if ($ > O) {
                let D = H.slice(O, $);
                if (D) z.push({
                    type: "text",
                    value: D
                })
            }
            O = $
        },
        X = (D) => {
            if (D) z.push({
                type: "sequence",
                value: D
            });
            w.state = "ground", O = $
        };
    while ($ < H.length) {
        let D = H.charCodeAt($);
        switch (w.state) {
            case "ground":
                if (D === ju.ESC) J(), _ = $, w.state = "escape", $++;
                else $++;
                break;
            case "escape":
                if (D === XS.CSI) w.state = "csi", $++;
                else if (D === XS.OSC) w.state = "osc", $++;
                else if (D === XS.DCS) w.state = "dcs", $++;
                else if (D === XS.APC) w.state = "apc", $++;
                else if (D === 79) w.state = "ss3", $++;
                else if (GK6(D)) w.state = "escapeIntermediate", $++;
                else if (y4A(D)) $++, X(H.slice(_, $));
                else if (D === ju.ESC) X(H.slice(_, $)), _ = $, w.state = "escape", $++;
                else w.state = "ground", O = _;
                break;
            case "escapeIntermediate":
                if (GK6(D)) $++;
                else if (y4A(D)) $++, X(H.slice(_, $));
                else w.state = "ground", O = _;
                break;
            case "csi":
                if (HA7(D)) $++, X(H.slice(_, $));
                else if (wA7(D) || GK6(D)) $++;
                else w.state = "ground", O = _;
                break;
            case "ss3":
                if (D >= 64 && D <= 126) $++, X(H.slice(_, $));
                else w.state = "ground", O = _;
                break;
            case "osc":
                if (D === ju.BEL) $++, X(H.slice(_, $));
                else if (D === ju.ESC && $ + 1 < H.length && H.charCodeAt($ + 1) === XS.ST) $ += 2, X(H.slice(_, $));
                else $++;
                break;
            case "dcs":
            case "apc":
                if (D === ju.BEL) $++, X(H.slice(_, $));
                else if (D === ju.ESC && $ + 1 < H.length && H.charCodeAt($ + 1) === XS.ST) $ += 2, X(H.slice(_, $));
                else $++;
                break
        }
    }
    if (w.state === "ground") J();
    else if (Y) {
        let D = H.slice(_);
        if (D) z.push({
            type: "sequence",
            value: D
        });
        w.state = "ground"
    } else w.buffer = H.slice(_);
    return {
        tokens: z,
        state: w
    }
}
// @from(Ln 134168, Col 4)
fK6 = v(() => {
    j71();
    Mu()
})
// @from(Ln 134173, Col 0)
function fA7(A, q = $V5) {
    if (!A.includes("\t")) return A;
    let K = AJ1(),
        Y = K.feed(A);
    Y.push(...K.flush());
    let z = "",
        w = 0;
    for (let H of Y)
        if (H.type === "sequence") z += H.value;
        else {
            let $ = H.value.split(/(\t|\n)/);
            for (let O of $)
                if (O === "\t") {
                    let _ = q - w % q;
                    z += " ".repeat(_), w += _
                } else if (O === `
`) z += O, w = 0;
            else z += O, w += UA(O)
        } return z
}
// @from(Ln 134193, Col 4)
$V5 = 8
// @from(Ln 134194, Col 4)
VA7 = v(() => {
    LY();
    fK6()
})
// @from(Ln 134198, Col 4)
Nr
// @from(Ln 134198, Col 8)
qJ1
// @from(Ln 134199, Col 4)
x4A = v(() => {
    Nr = new WeakMap, qJ1 = new WeakMap
})
// @from(Ln 134202, Col 4)
OV5
// @from(Ln 134202, Col 9)
NA7