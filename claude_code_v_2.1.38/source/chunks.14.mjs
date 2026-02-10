
// @from(Ln 43657, Col 4)
MHK = () => {
    let A = {
        string: {
            unit: "ký tự",
            verb: "có"
        },
        file: {
            unit: "byte",
            verb: "có"
        },
        array: {
            unit: "phần tử",
            verb: "có"
        },
        set: {
            unit: "phần tử",
            verb: "có"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let w = typeof z;
            switch (w) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "số";
                case "object": {
                    if (Array.isArray(z)) return "mảng";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return w
        },
        Y = {
            regex: "đầu vào",
            email: "địa chỉ email",
            url: "URL",
            emoji: "emoji",
            uuid: "UUID",
            uuidv4: "UUIDv4",
            uuidv6: "UUIDv6",
            nanoid: "nanoid",
            guid: "GUID",
            cuid: "cuid",
            cuid2: "cuid2",
            ulid: "ULID",
            xid: "XID",
            ksuid: "KSUID",
            datetime: "ngày giờ ISO",
            date: "ngày ISO",
            time: "giờ ISO",
            duration: "khoảng thời gian ISO",
            ipv4: "địa chỉ IPv4",
            ipv6: "địa chỉ IPv6",
            cidrv4: "dải IPv4",
            cidrv6: "dải IPv6",
            base64: "chuỗi mã hóa base64",
            base64url: "chuỗi mã hóa base64url",
            json_string: "chuỗi JSON",
            e164: "số E.164",
            jwt: "JWT",
            template_literal: "đầu vào"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `Đầu vào không hợp lệ: mong đợi ${z.expected}, nhận được ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `Đầu vào không hợp lệ: mong đợi ${Q7(z.values[0])}`;
                return `Tùy chọn không hợp lệ: mong đợi một trong các giá trị ${J8(z.values,"|")}`;
            case "too_big": {
                let w = z.inclusive ? "<=" : "<",
                    H = q(z.origin);
                if (H) return `Quá lớn: mong đợi ${z.origin??"giá trị"} ${H.verb} ${w}${z.maximum.toString()} ${H.unit??"phần tử"}`;
                return `Quá lớn: mong đợi ${z.origin??"giá trị"} ${w}${z.maximum.toString()}`
            }
            case "too_small": {
                let w = z.inclusive ? ">=" : ">",
                    H = q(z.origin);
                if (H) return `Quá nhỏ: mong đợi ${z.origin} ${H.verb} ${w}${z.minimum.toString()} ${H.unit}`;
                return `Quá nhỏ: mong đợi ${z.origin} ${w}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let w = z;
                if (w.format === "starts_with") return `Chuỗi không hợp lệ: phải bắt đầu bằng "${w.prefix}"`;
                if (w.format === "ends_with") return `Chuỗi không hợp lệ: phải kết thúc bằng "${w.suffix}"`;
                if (w.format === "includes") return `Chuỗi không hợp lệ: phải bao gồm "${w.includes}"`;
                if (w.format === "regex") return `Chuỗi không hợp lệ: phải khớp với mẫu ${w.pattern}`;
                return `${Y[w.format]??z.format} không hợp lệ`
            }
            case "not_multiple_of":
                return `Số không hợp lệ: phải là bội số của ${z.divisor}`;
            case "unrecognized_keys":
                return `Khóa không được nhận dạng: ${J8(z.keys,", ")}`;
            case "invalid_key":
                return `Khóa không hợp lệ trong ${z.origin}`;
            case "invalid_union":
                return "Đầu vào không hợp lệ";
            case "invalid_element":
                return `Giá trị không hợp lệ trong ${z.origin}`;
            default:
                return "Đầu vào không hợp lệ"
        }
    }
}
// @from(Ln 43765, Col 4)
S28 = v(() => {
    A3()
})
// @from(Ln 43769, Col 0)
function PB6() {
    return {
        localeError: PHK()
    }
}
// @from(Ln 43774, Col 4)
PHK = () => {
    let A = {
        string: {
            unit: "字符",
            verb: "包含"
        },
        file: {
            unit: "字节",
            verb: "包含"
        },
        array: {
            unit: "项",
            verb: "包含"
        },
        set: {
            unit: "项",
            verb: "包含"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let w = typeof z;
            switch (w) {
                case "number":
                    return Number.isNaN(z) ? "非数字(NaN)" : "数字";
                case "object": {
                    if (Array.isArray(z)) return "数组";
                    if (z === null) return "空值(null)";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return w
        },
        Y = {
            regex: "输入",
            email: "电子邮件",
            url: "URL",
            emoji: "表情符号",
            uuid: "UUID",
            uuidv4: "UUIDv4",
            uuidv6: "UUIDv6",
            nanoid: "nanoid",
            guid: "GUID",
            cuid: "cuid",
            cuid2: "cuid2",
            ulid: "ULID",
            xid: "XID",
            ksuid: "KSUID",
            datetime: "ISO日期时间",
            date: "ISO日期",
            time: "ISO时间",
            duration: "ISO时长",
            ipv4: "IPv4地址",
            ipv6: "IPv6地址",
            cidrv4: "IPv4网段",
            cidrv6: "IPv6网段",
            base64: "base64编码字符串",
            base64url: "base64url编码字符串",
            json_string: "JSON字符串",
            e164: "E.164号码",
            jwt: "JWT",
            template_literal: "输入"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `无效输入：期望 ${z.expected}，实际接收 ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `无效输入：期望 ${Q7(z.values[0])}`;
                return `无效选项：期望以下之一 ${J8(z.values,"|")}`;
            case "too_big": {
                let w = z.inclusive ? "<=" : "<",
                    H = q(z.origin);
                if (H) return `数值过大：期望 ${z.origin??"值"} ${w}${z.maximum.toString()} ${H.unit??"个元素"}`;
                return `数值过大：期望 ${z.origin??"值"} ${w}${z.maximum.toString()}`
            }
            case "too_small": {
                let w = z.inclusive ? ">=" : ">",
                    H = q(z.origin);
                if (H) return `数值过小：期望 ${z.origin} ${w}${z.minimum.toString()} ${H.unit}`;
                return `数值过小：期望 ${z.origin} ${w}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let w = z;
                if (w.format === "starts_with") return `无效字符串：必须以 "${w.prefix}" 开头`;
                if (w.format === "ends_with") return `无效字符串：必须以 "${w.suffix}" 结尾`;
                if (w.format === "includes") return `无效字符串：必须包含 "${w.includes}"`;
                if (w.format === "regex") return `无效字符串：必须满足正则表达式 ${w.pattern}`;
                return `无效${Y[w.format]??z.format}`
            }
            case "not_multiple_of":
                return `无效数字：必须是 ${z.divisor} 的倍数`;
            case "unrecognized_keys":
                return `出现未知的键(key): ${J8(z.keys,", ")}`;
            case "invalid_key":
                return `${z.origin} 中的键(key)无效`;
            case "invalid_union":
                return "无效输入";
            case "invalid_element":
                return `${z.origin} 中包含无效值(value)`;
            default:
                return "无效输入"
        }
    }
}
// @from(Ln 43882, Col 4)
h28 = v(() => {
    A3()
})
// @from(Ln 43886, Col 0)
function WB6() {
    return {
        localeError: WHK()
    }
}
// @from(Ln 43891, Col 4)
WHK = () => {
    let A = {
        string: {
            unit: "字元",
            verb: "擁有"
        },
        file: {
            unit: "位元組",
            verb: "擁有"
        },
        array: {
            unit: "項目",
            verb: "擁有"
        },
        set: {
            unit: "項目",
            verb: "擁有"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let w = typeof z;
            switch (w) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "number";
                case "object": {
                    if (Array.isArray(z)) return "array";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return w
        },
        Y = {
            regex: "輸入",
            email: "郵件地址",
            url: "URL",
            emoji: "emoji",
            uuid: "UUID",
            uuidv4: "UUIDv4",
            uuidv6: "UUIDv6",
            nanoid: "nanoid",
            guid: "GUID",
            cuid: "cuid",
            cuid2: "cuid2",
            ulid: "ULID",
            xid: "XID",
            ksuid: "KSUID",
            datetime: "ISO 日期時間",
            date: "ISO 日期",
            time: "ISO 時間",
            duration: "ISO 期間",
            ipv4: "IPv4 位址",
            ipv6: "IPv6 位址",
            cidrv4: "IPv4 範圍",
            cidrv6: "IPv6 範圍",
            base64: "base64 編碼字串",
            base64url: "base64url 編碼字串",
            json_string: "JSON 字串",
            e164: "E.164 數值",
            jwt: "JWT",
            template_literal: "輸入"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `無效的輸入值：預期為 ${z.expected}，但收到 ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `無效的輸入值：預期為 ${Q7(z.values[0])}`;
                return `無效的選項：預期為以下其中之一 ${J8(z.values,"|")}`;
            case "too_big": {
                let w = z.inclusive ? "<=" : "<",
                    H = q(z.origin);
                if (H) return `數值過大：預期 ${z.origin??"值"} 應為 ${w}${z.maximum.toString()} ${H.unit??"個元素"}`;
                return `數值過大：預期 ${z.origin??"值"} 應為 ${w}${z.maximum.toString()}`
            }
            case "too_small": {
                let w = z.inclusive ? ">=" : ">",
                    H = q(z.origin);
                if (H) return `數值過小：預期 ${z.origin} 應為 ${w}${z.minimum.toString()} ${H.unit}`;
                return `數值過小：預期 ${z.origin} 應為 ${w}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let w = z;
                if (w.format === "starts_with") return `無效的字串：必須以 "${w.prefix}" 開頭`;
                if (w.format === "ends_with") return `無效的字串：必須以 "${w.suffix}" 結尾`;
                if (w.format === "includes") return `無效的字串：必須包含 "${w.includes}"`;
                if (w.format === "regex") return `無效的字串：必須符合格式 ${w.pattern}`;
                return `無效的 ${Y[w.format]??z.format}`
            }
            case "not_multiple_of":
                return `無效的數字：必須為 ${z.divisor} 的倍數`;
            case "unrecognized_keys":
                return `無法識別的鍵值${z.keys.length>1?"們":""}：${J8(z.keys,"、")}`;
            case "invalid_key":
                return `${z.origin} 中有無效的鍵值`;
            case "invalid_union":
                return "無效的輸入值";
            case "invalid_element":
                return `${z.origin} 中有無效的值`;
            default:
                return "無效的輸入值"
        }
    }
}
// @from(Ln 43999, Col 4)
I28 = v(() => {
    A3()
})
// @from(Ln 44002, Col 4)
dw1 = {}
// @from(Ln 44044, Col 4)
ga1 = v(() => {
    nz8();
    rz8();
    az8();
    sz8();
    tz8();
    ez8();
    Fu6();
    A28();
    q28();
    K28();
    Y28();
    z28();
    w28();
    H28();
    $28();
    O28();
    _28();
    J28();
    X28();
    D28();
    j28();
    M28();
    P28();
    W28();
    G28();
    Z28();
    f28();
    V28();
    T28();
    v28();
    E28();
    k28();
    L28();
    R28();
    y28();
    C28();
    S28();
    h28();
    I28()
})
// @from(Ln 44085, Col 0)
class zv1 {
    constructor() {
        this._map = new WeakMap, this._idmap = new Map
    }
    add(A, ...q) {
        let K = q[0];
        if (this._map.set(A, K), K && typeof K === "object" && "id" in K) {
            if (this._idmap.has(K.id)) throw Error(`ID ${K.id} already exists in the registry`);
            this._idmap.set(K.id, A)
        }
        return this
    }
    remove(A) {
        return this._map.delete(A), this
    }
    get(A) {
        let q = A._zod.parent;
        if (q) {
            let K = {
                ...this.get(q) ?? {}
            };
            return delete K.id, {
                ...K,
                ...this._map.get(A)
            }
        }
        return this._map.get(A)
    }
    has(A) {
        return this._map.has(A)
    }
}
// @from(Ln 44118, Col 0)
function Ua1() {
    return new zv1
}
// @from(Ln 44121, Col 4)
GB6
// @from(Ln 44121, Col 9)
ZB6
// @from(Ln 44121, Col 14)
nx
// @from(Ln 44122, Col 4)
fB6 = v(() => {
    GB6 = Symbol("ZodOutput"), ZB6 = Symbol("ZodInput");
    nx = Ua1()
})
// @from(Ln 44127, Col 0)
function VB6(A, q) {
    return new A({
        type: "string",
        ...G7(q)
    })
}
// @from(Ln 44134, Col 0)
function NB6(A, q) {
    return new A({
        type: "string",
        coerce: !0,
        ...G7(q)
    })
}
// @from(Ln 44142, Col 0)
function pa1(A, q) {
    return new A({
        type: "string",
        format: "email",
        check: "string_format",
        abort: !1,
        ...G7(q)
    })
}
// @from(Ln 44152, Col 0)
function wv1(A, q) {
    return new A({
        type: "string",
        format: "guid",
        check: "string_format",
        abort: !1,
        ...G7(q)
    })
}
// @from(Ln 44162, Col 0)
function da1(A, q) {
    return new A({
        type: "string",
        format: "uuid",
        check: "string_format",
        abort: !1,
        ...G7(q)
    })
}
// @from(Ln 44172, Col 0)
function ca1(A, q) {
    return new A({
        type: "string",
        format: "uuid",
        check: "string_format",
        abort: !1,
        version: "v4",
        ...G7(q)
    })
}
// @from(Ln 44183, Col 0)
function la1(A, q) {
    return new A({
        type: "string",
        format: "uuid",
        check: "string_format",
        abort: !1,
        version: "v6",
        ...G7(q)
    })
}
// @from(Ln 44194, Col 0)
function ia1(A, q) {
    return new A({
        type: "string",
        format: "uuid",
        check: "string_format",
        abort: !1,
        version: "v7",
        ...G7(q)
    })
}
// @from(Ln 44205, Col 0)
function na1(A, q) {
    return new A({
        type: "string",
        format: "url",
        check: "string_format",
        abort: !1,
        ...G7(q)
    })
}
// @from(Ln 44215, Col 0)
function ra1(A, q) {
    return new A({
        type: "string",
        format: "emoji",
        check: "string_format",
        abort: !1,
        ...G7(q)
    })
}
// @from(Ln 44225, Col 0)
function oa1(A, q) {
    return new A({
        type: "string",
        format: "nanoid",
        check: "string_format",
        abort: !1,
        ...G7(q)
    })
}
// @from(Ln 44235, Col 0)
function aa1(A, q) {
    return new A({
        type: "string",
        format: "cuid",
        check: "string_format",
        abort: !1,
        ...G7(q)
    })
}
// @from(Ln 44245, Col 0)
function sa1(A, q) {
    return new A({
        type: "string",
        format: "cuid2",
        check: "string_format",
        abort: !1,
        ...G7(q)
    })
}
// @from(Ln 44255, Col 0)
function ta1(A, q) {
    return new A({
        type: "string",
        format: "ulid",
        check: "string_format",
        abort: !1,
        ...G7(q)
    })
}
// @from(Ln 44265, Col 0)
function ea1(A, q) {
    return new A({
        type: "string",
        format: "xid",
        check: "string_format",
        abort: !1,
        ...G7(q)
    })
}
// @from(Ln 44275, Col 0)
function As1(A, q) {
    return new A({
        type: "string",
        format: "ksuid",
        check: "string_format",
        abort: !1,
        ...G7(q)
    })
}
// @from(Ln 44285, Col 0)
function qs1(A, q) {
    return new A({
        type: "string",
        format: "ipv4",
        check: "string_format",
        abort: !1,
        ...G7(q)
    })
}
// @from(Ln 44295, Col 0)
function Ks1(A, q) {
    return new A({
        type: "string",
        format: "ipv6",
        check: "string_format",
        abort: !1,
        ...G7(q)
    })
}
// @from(Ln 44305, Col 0)
function Ys1(A, q) {
    return new A({
        type: "string",
        format: "cidrv4",
        check: "string_format",
        abort: !1,
        ...G7(q)
    })
}
// @from(Ln 44315, Col 0)
function zs1(A, q) {
    return new A({
        type: "string",
        format: "cidrv6",
        check: "string_format",
        abort: !1,
        ...G7(q)
    })
}
// @from(Ln 44325, Col 0)
function ws1(A, q) {
    return new A({
        type: "string",
        format: "base64",
        check: "string_format",
        abort: !1,
        ...G7(q)
    })
}
// @from(Ln 44335, Col 0)
function Hs1(A, q) {
    return new A({
        type: "string",
        format: "base64url",
        check: "string_format",
        abort: !1,
        ...G7(q)
    })
}
// @from(Ln 44345, Col 0)
function $s1(A, q) {
    return new A({
        type: "string",
        format: "e164",
        check: "string_format",
        abort: !1,
        ...G7(q)
    })
}
// @from(Ln 44355, Col 0)
function Os1(A, q) {
    return new A({
        type: "string",
        format: "jwt",
        check: "string_format",
        abort: !1,
        ...G7(q)
    })
}
// @from(Ln 44365, Col 0)
function vB6(A, q) {
    return new A({
        type: "string",
        format: "datetime",
        check: "string_format",
        offset: !1,
        local: !1,
        precision: null,
        ...G7(q)
    })
}
// @from(Ln 44377, Col 0)
function EB6(A, q) {
    return new A({
        type: "string",
        format: "date",
        check: "string_format",
        ...G7(q)
    })
}
// @from(Ln 44386, Col 0)
function kB6(A, q) {
    return new A({
        type: "string",
        format: "time",
        check: "string_format",
        precision: null,
        ...G7(q)
    })
}
// @from(Ln 44396, Col 0)
function LB6(A, q) {
    return new A({
        type: "string",
        format: "duration",
        check: "string_format",
        ...G7(q)
    })
}
// @from(Ln 44405, Col 0)
function RB6(A, q) {
    return new A({
        type: "number",
        checks: [],
        ...G7(q)
    })
}
// @from(Ln 44413, Col 0)
function yB6(A, q) {
    return new A({
        type: "number",
        coerce: !0,
        checks: [],
        ...G7(q)
    })
}
// @from(Ln 44422, Col 0)
function CB6(A, q) {
    return new A({
        type: "number",
        check: "number_format",
        abort: !1,
        format: "safeint",
        ...G7(q)
    })
}
// @from(Ln 44432, Col 0)
function SB6(A, q) {
    return new A({
        type: "number",
        check: "number_format",
        abort: !1,
        format: "float32",
        ...G7(q)
    })
}
// @from(Ln 44442, Col 0)
function hB6(A, q) {
    return new A({
        type: "number",
        check: "number_format",
        abort: !1,
        format: "float64",
        ...G7(q)
    })
}
// @from(Ln 44452, Col 0)
function IB6(A, q) {
    return new A({
        type: "number",
        check: "number_format",
        abort: !1,
        format: "int32",
        ...G7(q)
    })
}
// @from(Ln 44462, Col 0)
function xB6(A, q) {
    return new A({
        type: "number",
        check: "number_format",
        abort: !1,
        format: "uint32",
        ...G7(q)
    })
}
// @from(Ln 44472, Col 0)
function bB6(A, q) {
    return new A({
        type: "boolean",
        ...G7(q)
    })
}
// @from(Ln 44479, Col 0)
function uB6(A, q) {
    return new A({
        type: "boolean",
        coerce: !0,
        ...G7(q)
    })
}
// @from(Ln 44487, Col 0)
function BB6(A, q) {
    return new A({
        type: "bigint",
        ...G7(q)
    })
}
// @from(Ln 44494, Col 0)
function mB6(A, q) {
    return new A({
        type: "bigint",
        coerce: !0,
        ...G7(q)
    })
}
// @from(Ln 44502, Col 0)
function FB6(A, q) {
    return new A({
        type: "bigint",
        check: "bigint_format",
        abort: !1,
        format: "int64",
        ...G7(q)
    })
}
// @from(Ln 44512, Col 0)
function QB6(A, q) {
    return new A({
        type: "bigint",
        check: "bigint_format",
        abort: !1,
        format: "uint64",
        ...G7(q)
    })
}
// @from(Ln 44522, Col 0)
function gB6(A, q) {
    return new A({
        type: "symbol",
        ...G7(q)
    })
}
// @from(Ln 44529, Col 0)
function UB6(A, q) {
    return new A({
        type: "undefined",
        ...G7(q)
    })
}
// @from(Ln 44536, Col 0)
function pB6(A, q) {
    return new A({
        type: "null",
        ...G7(q)
    })
}
// @from(Ln 44543, Col 0)
function dB6(A) {
    return new A({
        type: "any"
    })
}
// @from(Ln 44549, Col 0)
function cw1(A) {
    return new A({
        type: "unknown"
    })
}
// @from(Ln 44555, Col 0)
function cB6(A, q) {
    return new A({
        type: "never",
        ...G7(q)
    })
}
// @from(Ln 44562, Col 0)
function lB6(A, q) {
    return new A({
        type: "void",
        ...G7(q)
    })
}
// @from(Ln 44569, Col 0)
function iB6(A, q) {
    return new A({
        type: "date",
        ...G7(q)
    })
}
// @from(Ln 44576, Col 0)
function nB6(A, q) {
    return new A({
        type: "date",
        coerce: !0,
        ...G7(q)
    })
}
// @from(Ln 44584, Col 0)
function rB6(A, q) {
    return new A({
        type: "nan",
        ...G7(q)
    })
}
// @from(Ln 44591, Col 0)
function EQ(A, q) {
    return new ha1({
        check: "less_than",
        ...G7(q),
        value: A,
        inclusive: !1
    })
}
// @from(Ln 44600, Col 0)
function Jk(A, q) {
    return new ha1({
        check: "less_than",
        ...G7(q),
        value: A,
        inclusive: !0
    })
}
// @from(Ln 44609, Col 0)
function kQ(A, q) {
    return new Ia1({
        check: "greater_than",
        ...G7(q),
        value: A,
        inclusive: !1
    })
}
// @from(Ln 44618, Col 0)
function pf(A, q) {
    return new Ia1({
        check: "greater_than",
        ...G7(q),
        value: A,
        inclusive: !0
    })
}
// @from(Ln 44627, Col 0)
function oB6(A) {
    return kQ(0, A)
}
// @from(Ln 44631, Col 0)
function aB6(A) {
    return EQ(0, A)
}
// @from(Ln 44635, Col 0)
function sB6(A) {
    return Jk(0, A)
}
// @from(Ln 44639, Col 0)
function tB6(A) {
    return pf(0, A)
}
// @from(Ln 44643, Col 0)
function e61(A, q) {
    return new _b6({
        check: "multiple_of",
        ...G7(q),
        value: A
    })
}
// @from(Ln 44651, Col 0)
function lw1(A, q) {
    return new Db6({
        check: "max_size",
        ...G7(q),
        maximum: A
    })
}
// @from(Ln 44659, Col 0)
function AA1(A, q) {
    return new jb6({
        check: "min_size",
        ...G7(q),
        minimum: A
    })
}
// @from(Ln 44667, Col 0)
function Hv1(A, q) {
    return new Mb6({
        check: "size_equals",
        ...G7(q),
        size: A
    })
}
// @from(Ln 44675, Col 0)
function iw1(A, q) {
    return new Pb6({
        check: "max_length",
        ...G7(q),
        maximum: A
    })
}
// @from(Ln 44683, Col 0)
function Li(A, q) {
    return new Wb6({
        check: "min_length",
        ...G7(q),
        minimum: A
    })
}
// @from(Ln 44691, Col 0)
function nw1(A, q) {
    return new Gb6({
        check: "length_equals",
        ...G7(q),
        length: A
    })
}
// @from(Ln 44699, Col 0)
function $v1(A, q) {
    return new Zb6({
        check: "string_format",
        format: "regex",
        ...G7(q),
        pattern: A
    })
}
// @from(Ln 44708, Col 0)
function Ov1(A) {
    return new fb6({
        check: "string_format",
        format: "lowercase",
        ...G7(A)
    })
}
// @from(Ln 44716, Col 0)
function _v1(A) {
    return new Vb6({
        check: "string_format",
        format: "uppercase",
        ...G7(A)
    })
}
// @from(Ln 44724, Col 0)
function Jv1(A, q) {
    return new Nb6({
        check: "string_format",
        format: "includes",
        ...G7(q),
        includes: A
    })
}
// @from(Ln 44733, Col 0)
function Xv1(A, q) {
    return new Tb6({
        check: "string_format",
        format: "starts_with",
        ...G7(q),
        prefix: A
    })
}
// @from(Ln 44742, Col 0)
function Dv1(A, q) {
    return new vb6({
        check: "string_format",
        format: "ends_with",
        ...G7(q),
        suffix: A
    })
}
// @from(Ln 44751, Col 0)
function eB6(A, q, K) {
    return new Eb6({
        check: "property",
        property: A,
        schema: q,
        ...G7(K)
    })
}
// @from(Ln 44760, Col 0)
function jv1(A, q) {
    return new kb6({
        check: "mime_type",
        mime: A,
        ...G7(q)
    })
}
// @from(Ln 44768, Col 0)
function LQ(A) {
    return new Lb6({
        check: "overwrite",
        tx: A
    })
}
// @from(Ln 44775, Col 0)
function Mv1(A) {
    return LQ((q) => q.normalize(A))
}
// @from(Ln 44779, Col 0)
function Pv1() {
    return LQ((A) => A.trim())
}
// @from(Ln 44783, Col 0)
function Wv1() {
    return LQ((A) => A.toLowerCase())
}
// @from(Ln 44787, Col 0)
function Gv1() {
    return LQ((A) => A.toUpperCase())
}
// @from(Ln 44791, Col 0)
function Zv1(A, q, K) {
    return new A({
        type: "array",
        element: q,
        ...G7(K)
    })
}
// @from(Ln 44799, Col 0)
function GHK(A, q, K) {
    return new A({
        type: "union",
        options: q,
        ...G7(K)
    })
}
// @from(Ln 44807, Col 0)
function ZHK(A, q, K, Y) {
    return new A({
        type: "union",
        options: K,
        discriminator: q,
        ...G7(Y)
    })
}
// @from(Ln 44816, Col 0)
function fHK(A, q, K) {
    return new A({
        type: "intersection",
        left: q,
        right: K
    })
}
// @from(Ln 44824, Col 0)
function Am6(A, q, K, Y) {
    let z = K instanceof N3;
    return new A({
        type: "tuple",
        items: q,
        rest: z ? K : null,
        ...G7(z ? Y : K)
    })
}
// @from(Ln 44834, Col 0)
function VHK(A, q, K, Y) {
    return new A({
        type: "record",
        keyType: q,
        valueType: K,
        ...G7(Y)
    })
}
// @from(Ln 44843, Col 0)
function NHK(A, q, K, Y) {
    return new A({
        type: "map",
        keyType: q,
        valueType: K,
        ...G7(Y)
    })
}
// @from(Ln 44852, Col 0)
function THK(A, q, K) {
    return new A({
        type: "set",
        valueType: q,
        ...G7(K)
    })
}
// @from(Ln 44860, Col 0)
function vHK(A, q, K) {
    let Y = Array.isArray(q) ? Object.fromEntries(q.map((z) => [z, z])) : q;
    return new A({
        type: "enum",
        entries: Y,
        ...G7(K)
    })
}
// @from(Ln 44869, Col 0)
function EHK(A, q, K) {
    return new A({
        type: "enum",
        entries: q,
        ...G7(K)
    })
}
// @from(Ln 44877, Col 0)
function kHK(A, q, K) {
    return new A({
        type: "literal",
        values: Array.isArray(q) ? q : [q],
        ...G7(K)
    })
}
// @from(Ln 44885, Col 0)
function qm6(A, q) {
    return new A({
        type: "file",
        ...G7(q)
    })
}
// @from(Ln 44892, Col 0)
function LHK(A, q) {
    return new A({
        type: "transform",
        transform: q
    })
}
// @from(Ln 44899, Col 0)
function RHK(A, q) {
    return new A({
        type: "optional",
        innerType: q
    })
}
// @from(Ln 44906, Col 0)
function yHK(A, q) {
    return new A({
        type: "nullable",
        innerType: q
    })
}
// @from(Ln 44913, Col 0)
function CHK(A, q, K) {
    return new A({
        type: "default",
        innerType: q,
        get defaultValue() {
            return typeof K === "function" ? K() : K
        }
    })
}
// @from(Ln 44923, Col 0)
function SHK(A, q, K) {
    return new A({
        type: "nonoptional",
        innerType: q,
        ...G7(K)
    })
}
// @from(Ln 44931, Col 0)
function hHK(A, q) {
    return new A({
        type: "success",
        innerType: q
    })
}
// @from(Ln 44938, Col 0)
function IHK(A, q, K) {
    return new A({
        type: "catch",
        innerType: q,
        catchValue: typeof K === "function" ? K : () => K
    })
}
// @from(Ln 44946, Col 0)
function xHK(A, q, K) {
    return new A({
        type: "pipe",
        in: q,
        out: K
    })
}
// @from(Ln 44954, Col 0)
function bHK(A, q) {
    return new A({
        type: "readonly",
        innerType: q
    })
}
// @from(Ln 44961, Col 0)
function uHK(A, q, K) {
    return new A({
        type: "template_literal",
        parts: q,
        ...G7(K)
    })
}
// @from(Ln 44969, Col 0)
function BHK(A, q) {
    return new A({
        type: "lazy",
        getter: q
    })
}
// @from(Ln 44976, Col 0)
function mHK(A, q) {
    return new A({
        type: "promise",
        innerType: q
    })
}
// @from(Ln 44983, Col 0)
function Km6(A, q, K) {
    let Y = G7(K);
    return Y.abort ?? (Y.abort = !0), new A({
        type: "custom",
        check: "custom",
        fn: q,
        ...Y
    })
}
// @from(Ln 44993, Col 0)
function Ym6(A, q, K) {
    return new A({
        type: "custom",
        check: "custom",
        fn: q,
        ...G7(K)
    })
}
// @from(Ln 45002, Col 0)
function zm6(A, q) {
    let K = G7(q),
        Y = K.truthy ?? ["true", "1", "yes", "on", "y", "enabled"],
        z = K.falsy ?? ["false", "0", "no", "off", "n", "disabled"];
    if (K.case !== "sensitive") Y = Y.map((M) => typeof M === "string" ? M.toLowerCase() : M), z = z.map((M) => typeof M === "string" ? M.toLowerCase() : M);
    let w = new Set(Y),
        H = new Set(z),
        $ = A.Pipe ?? qv1,
        O = A.Boolean ?? tT1,
        _ = A.String ?? s61,
        X = new(A.Transform ?? Av1)({
            type: "transform",
            transform: (M, P) => {
                let W = M;
                if (K.case !== "sensitive") W = W.toLowerCase();
                if (w.has(W)) return !0;
                else if (H.has(W)) return !1;
                else return P.issues.push({
                    code: "invalid_value",
                    expected: "stringbool",
                    values: [...w, ...H],
                    input: P.value,
                    inst: X
                }), {}
            },
            error: K.error
        }),
        D = new $({
            type: "pipe",
            in: new _({
                type: "string",
                error: K.error
            }),
            out: X,
            error: K.error
        });
    return new $({
        type: "pipe",
        in: D,
        out: new O({
            type: "boolean",
            error: K.error
        }),
        error: K.error
    })
}
// @from(Ln 45049, Col 0)
function wm6(A, q, K, Y = {}) {
    let z = G7(Y),
        w = {
            ...G7(Y),
            check: "string_format",
            type: "string",
            format: q,
            fn: typeof K === "function" ? K : ($) => K.test($),
            ...z
        };
    if (K instanceof RegExp) w.pattern = K;
    return new A(w)
}
// @from(Ln 45062, Col 4)
TB6
// @from(Ln 45063, Col 4)
Hm6 = v(() => {
    xa1();
    Kv1();
    A3();
    TB6 = {
        Any: null,
        Minute: -1,
        Second: 0,
        Millisecond: 3,
        Microsecond: 6
    }
})
// @from(Ln 45075, Col 0)
class $m6 {
    constructor(A) {
        this._def = A, this.def = A
    }
    implement(A) {
        if (typeof A !== "function") throw Error("implement() must be called with a function");
        let q = (...K) => {
            let Y = this._def.input ? oT1(this._def.input, K, void 0, {
                callee: q
            }) : K;
            if (!Array.isArray(Y)) throw Error("Invalid arguments schema: not an array or tuple schema.");
            let z = A(...Y);
            return this._def.output ? oT1(this._def.output, z, void 0, {
                callee: q
            }) : z
        };
        return q
    }
    implementAsync(A) {
        if (typeof A !== "function") throw Error("implement() must be called with a function");
        let q = async (...K) => {
            let Y = this._def.input ? await aT1(this._def.input, K, void 0, {
                callee: q
            }) : K;
            if (!Array.isArray(Y)) throw Error("Invalid arguments schema: not an array or tuple schema.");
            let z = await A(...Y);
            return this._def.output ? aT1(this._def.output, z, void 0, {
                callee: q
            }) : z
        };
        return q
    }
    input(...A) {
        let q = this.constructor;
        if (Array.isArray(A[0])) return new q({
            type: "function",
            input: new t61({
                type: "tuple",
                items: A[0],
                rest: A[1]
            }),
            output: this._def.output
        });
        return new q({
            type: "function",
            input: A[0],
            output: this._def.output
        })
    }
    output(A) {
        return new this.constructor({
            type: "function",
            input: this._def.input,
            output: A
        })
    }
}
// @from(Ln 45133, Col 0)
function Om6(A) {
    return new $m6({
        type: "function",
        input: Array.isArray(A?.input) ? Am6(t61, A?.input) : A?.input ?? Zv1(eT1, cw1(pw1)),
        output: A?.output ?? cw1(pw1)
    })
}
// @from(Ln 45140, Col 4)
x28 = v(() => {
    Hm6();
    ya1();
    Kv1();
    Kv1()
})
// @from(Ln 45146, Col 0)
class _s1 {
    constructor(A) {
        this.counter = 0, this.metadataRegistry = A?.metadata ?? nx, this.target = A?.target ?? "draft-2020-12", this.unrepresentable = A?.unrepresentable ?? "throw", this.override = A?.override ?? (() => {}), this.io = A?.io ?? "output", this.seen = new Map
    }
    process(A, q = {
        path: [],
        schemaPath: []
    }) {
        var K;
        let Y = A._zod.def,
            z = {
                guid: "uuid",
                url: "uri",
                datetime: "date-time",
                json_string: "json-string",
                regex: ""
            },
            w = this.seen.get(A);
        if (w) {
            if (w.count++, q.schemaPath.includes(A)) w.cycle = q.path;
            return w.schema
        }
        let H = {
            schema: {},
            count: 1,
            cycle: void 0,
            path: q.path
        };
        this.seen.set(A, H);
        let $ = A._zod.toJSONSchema?.();
        if ($) H.schema = $;
        else {
            let J = {
                    ...q,
                    schemaPath: [...q.schemaPath, A],
                    path: q.path
                },
                X = A._zod.parent;
            if (X) H.ref = X, this.process(X, J), this.seen.get(X).isParent = !0;
            else {
                let D = H.schema;
                switch (Y.type) {
                    case "string": {
                        let j = D;
                        j.type = "string";
                        let {
                            minimum: M,
                            maximum: P,
                            format: W,
                            patterns: G,
                            contentEncoding: f
                        } = A._zod.bag;
                        if (typeof M === "number") j.minLength = M;
                        if (typeof P === "number") j.maxLength = P;
                        if (W) {
                            if (j.format = z[W] ?? W, j.format === "") delete j.format
                        }
                        if (f) j.contentEncoding = f;
                        if (G && G.size > 0) {
                            let Z = [...G];
                            if (Z.length === 1) j.pattern = Z[0].source;
                            else if (Z.length > 1) H.schema.allOf = [...Z.map((N) => ({
                                ...this.target === "draft-7" ? {
                                    type: "string"
                                } : {},
                                pattern: N.source
                            }))]
                        }
                        break
                    }
                    case "number": {
                        let j = D,
                            {
                                minimum: M,
                                maximum: P,
                                format: W,
                                multipleOf: G,
                                exclusiveMaximum: f,
                                exclusiveMinimum: Z
                            } = A._zod.bag;
                        if (typeof W === "string" && W.includes("int")) j.type = "integer";
                        else j.type = "number";
                        if (typeof Z === "number") j.exclusiveMinimum = Z;
                        if (typeof M === "number") {
                            if (j.minimum = M, typeof Z === "number")
                                if (Z >= M) delete j.minimum;
                                else delete j.exclusiveMinimum
                        }
                        if (typeof f === "number") j.exclusiveMaximum = f;
                        if (typeof P === "number") {
                            if (j.maximum = P, typeof f === "number")
                                if (f <= P) delete j.maximum;
                                else delete j.exclusiveMaximum
                        }
                        if (typeof G === "number") j.multipleOf = G;
                        break
                    }
                    case "boolean": {
                        let j = D;
                        j.type = "boolean";
                        break
                    }
                    case "bigint": {
                        if (this.unrepresentable === "throw") throw Error("BigInt cannot be represented in JSON Schema");
                        break
                    }
                    case "symbol": {
                        if (this.unrepresentable === "throw") throw Error("Symbols cannot be represented in JSON Schema");
                        break
                    }
                    case "null": {
                        D.type = "null";
                        break
                    }
                    case "any":
                        break;
                    case "unknown":
                        break;
                    case "undefined":
                    case "never": {
                        D.not = {};
                        break
                    }
                    case "void": {
                        if (this.unrepresentable === "throw") throw Error("Void cannot be represented in JSON Schema");
                        break
                    }
                    case "date": {
                        if (this.unrepresentable === "throw") throw Error("Date cannot be represented in JSON Schema");
                        break
                    }
                    case "array": {
                        let j = D,
                            {
                                minimum: M,
                                maximum: P
                            } = A._zod.bag;
                        if (typeof M === "number") j.minItems = M;
                        if (typeof P === "number") j.maxItems = P;
                        j.type = "array", j.items = this.process(Y.element, {
                            ...J,
                            path: [...J.path, "items"]
                        });
                        break
                    }
                    case "object": {
                        let j = D;
                        j.type = "object", j.properties = {};
                        let M = Y.shape;
                        for (let G in M) j.properties[G] = this.process(M[G], {
                            ...J,
                            path: [...J.path, "properties", G]
                        });
                        let P = new Set(Object.keys(M)),
                            W = new Set([...P].filter((G) => {
                                let f = Y.shape[G]._zod;
                                if (this.io === "input") return f.optin === void 0;
                                else return f.optout === void 0
                            }));
                        if (W.size > 0) j.required = Array.from(W);
                        if (Y.catchall?._zod.def.type === "never") j.additionalProperties = !1;
                        else if (!Y.catchall) {
                            if (this.io === "output") j.additionalProperties = !1
                        } else if (Y.catchall) j.additionalProperties = this.process(Y.catchall, {
                            ...J,
                            path: [...J.path, "additionalProperties"]
                        });
                        break
                    }
                    case "union": {
                        let j = D;
                        j.anyOf = Y.options.map((M, P) => this.process(M, {
                            ...J,
                            path: [...J.path, "anyOf", P]
                        }));
                        break
                    }
                    case "intersection": {
                        let j = D,
                            M = this.process(Y.left, {
                                ...J,
                                path: [...J.path, "allOf", 0]
                            }),
                            P = this.process(Y.right, {
                                ...J,
                                path: [...J.path, "allOf", 1]
                            }),
                            W = (f) => ("allOf" in f) && Object.keys(f).length === 1,
                            G = [...W(M) ? M.allOf : [M], ...W(P) ? P.allOf : [P]];
                        j.allOf = G;
                        break
                    }
                    case "tuple": {
                        let j = D;
                        j.type = "array";
                        let M = Y.items.map((G, f) => this.process(G, {
                            ...J,
                            path: [...J.path, "prefixItems", f]
                        }));
                        if (this.target === "draft-2020-12") j.prefixItems = M;
                        else j.items = M;
                        if (Y.rest) {
                            let G = this.process(Y.rest, {
                                ...J,
                                path: [...J.path, "items"]
                            });
                            if (this.target === "draft-2020-12") j.items = G;
                            else j.additionalItems = G
                        }
                        if (Y.rest) j.items = this.process(Y.rest, {
                            ...J,
                            path: [...J.path, "items"]
                        });
                        let {
                            minimum: P,
                            maximum: W
                        } = A._zod.bag;
                        if (typeof P === "number") j.minItems = P;
                        if (typeof W === "number") j.maxItems = W;
                        break
                    }
                    case "record": {
                        let j = D;
                        j.type = "object", j.propertyNames = this.process(Y.keyType, {
                            ...J,
                            path: [...J.path, "propertyNames"]
                        }), j.additionalProperties = this.process(Y.valueType, {
                            ...J,
                            path: [...J.path, "additionalProperties"]
                        });
                        break
                    }
                    case "map": {
                        if (this.unrepresentable === "throw") throw Error("Map cannot be represented in JSON Schema");
                        break
                    }
                    case "set": {
                        if (this.unrepresentable === "throw") throw Error("Set cannot be represented in JSON Schema");
                        break
                    }
                    case "enum": {
                        let j = D,
                            M = gT1(Y.entries);
                        if (M.every((P) => typeof P === "number")) j.type = "number";
                        if (M.every((P) => typeof P === "string")) j.type = "string";
                        j.enum = M;
                        break
                    }
                    case "literal": {
                        let j = D,
                            M = [];
                        for (let P of Y.values)
                            if (P === void 0) {
                                if (this.unrepresentable === "throw") throw Error("Literal `undefined` cannot be represented in JSON Schema")
                            } else if (typeof P === "bigint")
                            if (this.unrepresentable === "throw") throw Error("BigInt literals cannot be represented in JSON Schema");
                            else M.push(Number(P));
                        else M.push(P);
                        if (M.length === 0);
                        else if (M.length === 1) {
                            let P = M[0];
                            j.type = P === null ? "null" : typeof P, j.const = P
                        } else {
                            if (M.every((P) => typeof P === "number")) j.type = "number";
                            if (M.every((P) => typeof P === "string")) j.type = "string";
                            if (M.every((P) => typeof P === "boolean")) j.type = "string";
                            if (M.every((P) => P === null)) j.type = "null";
                            j.enum = M
                        }
                        break
                    }
                    case "file": {
                        let j = D,
                            M = {
                                type: "string",
                                format: "binary",
                                contentEncoding: "binary"
                            },
                            {
                                minimum: P,
                                maximum: W,
                                mime: G
                            } = A._zod.bag;
                        if (P !== void 0) M.minLength = P;
                        if (W !== void 0) M.maxLength = W;
                        if (G)
                            if (G.length === 1) M.contentMediaType = G[0], Object.assign(j, M);
                            else j.anyOf = G.map((f) => {
                                return {
                                    ...M,
                                    contentMediaType: f
                                }
                            });
                        else Object.assign(j, M);
                        break
                    }
                    case "transform": {
                        if (this.unrepresentable === "throw") throw Error("Transforms cannot be represented in JSON Schema");
                        break
                    }
                    case "nullable": {
                        let j = this.process(Y.innerType, J);
                        D.anyOf = [j, {
                            type: "null"
                        }];
                        break
                    }
                    case "nonoptional": {
                        this.process(Y.innerType, J), H.ref = Y.innerType;
                        break
                    }
                    case "success": {
                        let j = D;
                        j.type = "boolean";
                        break
                    }
                    case "default": {
                        this.process(Y.innerType, J), H.ref = Y.innerType, D.default = JSON.parse(JSON.stringify(Y.defaultValue));
                        break
                    }
                    case "prefault": {
                        if (this.process(Y.innerType, J), H.ref = Y.innerType, this.io === "input") D._prefault = JSON.parse(JSON.stringify(Y.defaultValue));
                        break
                    }
                    case "catch": {
                        this.process(Y.innerType, J), H.ref = Y.innerType;
                        let j;
                        try {
                            j = Y.catchValue(void 0)
                        } catch {
                            throw Error("Dynamic catch values are not supported in JSON Schema")
                        }
                        D.default = j;
                        break
                    }
                    case "nan": {
                        if (this.unrepresentable === "throw") throw Error("NaN cannot be represented in JSON Schema");
                        break
                    }
                    case "template_literal": {
                        let j = D,
                            M = A._zod.pattern;
                        if (!M) throw Error("Pattern not found in template literal");
                        j.type = "string", j.pattern = M.source;
                        break
                    }
                    case "pipe": {
                        let j = this.io === "input" ? Y.in._zod.def.type === "transform" ? Y.out : Y.in : Y.out;
                        this.process(j, J), H.ref = j;
                        break
                    }
                    case "readonly": {
                        this.process(Y.innerType, J), H.ref = Y.innerType, D.readOnly = !0;
                        break
                    }
                    case "promise": {
                        this.process(Y.innerType, J), H.ref = Y.innerType;
                        break
                    }
                    case "optional": {
                        this.process(Y.innerType, J), H.ref = Y.innerType;
                        break
                    }
                    case "lazy": {
                        let j = A._zod.innerType;
                        this.process(j, J), H.ref = j;
                        break
                    }
                    case "custom": {
                        if (this.unrepresentable === "throw") throw Error("Custom types cannot be represented in JSON Schema");
                        break
                    }
                    default:
                }
            }
        }
        let O = this.metadataRegistry.get(A);
        if (O) Object.assign(H.schema, O);
        if (this.io === "input" && kD(A)) delete H.schema.examples, delete H.schema.default;
        if (this.io === "input" && H.schema._prefault)(K = H.schema).default ?? (K.default = H.schema._prefault);
        return delete H.schema._prefault, this.seen.get(A).schema
    }
    emit(A, q) {
        let K = {
                cycles: q?.cycles ?? "ref",
                reused: q?.reused ?? "inline",
                external: q?.external ?? void 0
            },
            Y = this.seen.get(A);
        if (!Y) throw Error("Unprocessed schema. This is a bug in Zod.");
        let z = (_) => {
                let J = this.target === "draft-2020-12" ? "$defs" : "definitions";
                if (K.external) {
                    let M = K.external.registry.get(_[0])?.id;
                    if (M) return {
                        ref: K.external.uri(M)
                    };
                    let P = _[1].defId ?? _[1].schema.id ?? `schema${this.counter++}`;
                    return _[1].defId = P, {
                        defId: P,
                        ref: `${K.external.uri("__shared")}#/${J}/${P}`
                    }
                }
                if (_[1] === Y) return {
                    ref: "#"
                };
                let D = `${"#"}/${J}/`,
                    j = _[1].schema.id ?? `__schema${this.counter++}`;
                return {
                    defId: j,
                    ref: D + j
                }
            },
            w = (_) => {
                if (_[1].schema.$ref) return;
                let J = _[1],
                    {
                        ref: X,
                        defId: D
                    } = z(_);
                if (J.def = {
                        ...J.schema
                    }, D) J.defId = D;
                let j = J.schema;
                for (let M in j) delete j[M];
                j.$ref = X
            };
        for (let _ of this.seen.entries()) {
            let J = _[1];
            if (A === _[0]) {
                w(_);
                continue
            }
            if (K.external) {
                let D = K.external.registry.get(_[0])?.id;
                if (A !== _[0] && D) {
                    w(_);
                    continue
                }
            }
            if (this.metadataRegistry.get(_[0])?.id) {
                w(_);
                continue
            }
            if (J.cycle) {
                if (K.cycles === "throw") throw Error(`Cycle detected: #/${J.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
                else if (K.cycles === "ref") w(_);
                continue
            }
            if (J.count > 1) {
                if (K.reused === "ref") {
                    w(_);
                    continue
                }
            }
        }
        let H = (_, J) => {
            let X = this.seen.get(_),
                D = X.def ?? X.schema,
                j = {
                    ...D
                };
            if (X.ref === null) return;
            let M = X.ref;
            if (X.ref = null, M) {
                H(M, J);
                let P = this.seen.get(M).schema;
                if (P.$ref && J.target === "draft-7") D.allOf = D.allOf ?? [], D.allOf.push(P);
                else Object.assign(D, P), Object.assign(D, j)
            }
            if (!X.isParent) this.override({
                zodSchema: _,
                jsonSchema: D,
                path: X.path ?? []
            })
        };
        for (let _ of [...this.seen.entries()].reverse()) H(_[0], {
            target: this.target
        });
        let $ = {};
        if (this.target === "draft-2020-12") $.$schema = "https://json-schema.org/draft/2020-12/schema";
        else if (this.target === "draft-7") $.$schema = "http://json-schema.org/draft-07/schema#";
        else console.warn(`Invalid target: ${this.target}`);
        Object.assign($, Y.def);
        let O = K.external?.defs ?? {};
        for (let _ of this.seen.entries()) {
            let J = _[1];
            if (J.def && J.defId) O[J.defId] = J.def
        }
        if (!K.external && Object.keys(O).length > 0)
            if (this.target === "draft-2020-12") $.$defs = O;
            else $.definitions = O;
        try {
            return JSON.parse(JSON.stringify($))
        } catch (_) {
            throw Error("Error converting schema to JSON.")
        }
    }
}
// @from(Ln 45648, Col 0)
function RQ(A, q) {
    if (A instanceof zv1) {
        let Y = new _s1(q),
            z = {};
        for (let $ of A._idmap.entries()) {
            let [O, _] = $;
            Y.process(_)
        }
        let w = {},
            H = {
                registry: A,
                uri: q?.uri || (($) => $),
                defs: z
            };
        for (let $ of A._idmap.entries()) {
            let [O, _] = $;
            w[O] = Y.emit(_, {
                ...q,
                external: H
            })
        }
        if (Object.keys(z).length > 0) {
            let $ = Y.target === "draft-2020-12" ? "$defs" : "definitions";
            w.__shared = {
                [$]: z
            }
        }
        return {
            schemas: w
        }
    }
    let K = new _s1(q);
    return K.process(A), K.emit(A, q)
}
// @from(Ln 45683, Col 0)
function kD(A, q) {
    let K = q ?? {
        seen: new Set
    };
    if (K.seen.has(A)) return !1;
    K.seen.add(A);
    let z = A._zod.def;
    switch (z.type) {
        case "string":
        case "number":
        case "bigint":
        case "boolean":
        case "date":
        case "symbol":
        case "undefined":
        case "null":
        case "any":
        case "unknown":
        case "never":
        case "void":
        case "literal":
        case "enum":
        case "nan":
        case "file":
        case "template_literal":
            return !1;
        case "array":
            return kD(z.element, K);
        case "object": {
            for (let w in z.shape)
                if (kD(z.shape[w], K)) return !0;
            return !1
        }
        case "union": {
            for (let w of z.options)
                if (kD(w, K)) return !0;
            return !1
        }
        case "intersection":
            return kD(z.left, K) || kD(z.right, K);
        case "tuple": {
            for (let w of z.items)
                if (kD(w, K)) return !0;
            if (z.rest && kD(z.rest, K)) return !0;
            return !1
        }
        case "record":
            return kD(z.keyType, K) || kD(z.valueType, K);
        case "map":
            return kD(z.keyType, K) || kD(z.valueType, K);
        case "set":
            return kD(z.valueType, K);
        case "promise":
        case "optional":
        case "nonoptional":
        case "nullable":
        case "readonly":
            return kD(z.innerType, K);
        case "lazy":
            return kD(z.getter(), K);
        case "default":
            return kD(z.innerType, K);
        case "prefault":
            return kD(z.innerType, K);
        case "custom":
            return !1;
        case "transform":
            return !0;
        case "pipe":
            return kD(z.in, K) || kD(z.out, K);
        case "success":
            return !1;
        case "catch":
            return !1;
        default:
    }
    throw Error(`Unknown schema type: ${z.type}`)
}
// @from(Ln 45761, Col 4)
b28 = v(() => {
    fB6();
    A3()
})
// @from(Ln 45765, Col 4)
u28 = {}
// @from(Ln 45766, Col 4)
B28 = () => {}
// @from(Ln 45767, Col 4)
rx = {}
// @from(Ln 46009, Col 4)
IG = v(() => {
    A3();
    Sa1();
    ga1();
    B28();
    Bw1();
    ya1();
    xx6();
    Kv1();
    xa1();
    yb6();
    fB6();
    x28();
    Hm6();
    b28()
})
// @from(Ln 46025, Col 4)
_m6 = v(() => {
    IG()
})
// @from(Ln 46028, Col 4)
rw1 = {}
// @from(Ln 46040, Col 0)
function Jm6(A) {
    return vB6(Js1, A)
}
// @from(Ln 46044, Col 0)
function Xm6(A) {
    return EB6(Xs1, A)
}
// @from(Ln 46048, Col 0)
function Dm6(A) {
    return kB6(Ds1, A)
}
// @from(Ln 46052, Col 0)
function jm6(A) {
    return LB6(js1, A)
}
// @from(Ln 46055, Col 4)
Js1
// @from(Ln 46055, Col 9)
Xs1
// @from(Ln 46055, Col 14)
Ds1
// @from(Ln 46055, Col 19)
js1
// @from(Ln 46056, Col 4)
Ms1 = v(() => {
    IG();
    Ps1();
    Js1 = XA("ZodISODateTime", (A, q) => {
        Ub6.init(A, q), KH.init(A, q)
    });
    Xs1 = XA("ZodISODate", (A, q) => {
        pb6.init(A, q), KH.init(A, q)
    });
    Ds1 = XA("ZodISOTime", (A, q) => {
        db6.init(A, q), KH.init(A, q)
    });
    js1 = XA("ZodISODuration", (A, q) => {
        cb6.init(A, q), KH.init(A, q)
    })
})
// @from(Ln 46072, Col 4)
F28 = (A, q) => {
        iT1.init(A, q), A.name = "ZodError", Object.defineProperties(A, {
            format: {
                value: (K) => rT1(A, K)
            },
            flatten: {
                value: (K) => nT1(A, K)
            },
            addIssue: {
                value: (K) => A.issues.push(K)
            },
            addIssues: {
                value: (K) => A.issues.push(...K)
            },
            isEmpty: {
                get() {
                    return A.issues.length === 0
                }
            }
        })
    }
// @from(Ln 46093, Col 4)
QHK
// @from(Ln 46093, Col 9)
ow1
// @from(Ln 46094, Col 4)
Mm6 = v(() => {
    IG();
    IG();
    QHK = XA("ZodError", F28), ow1 = XA("ZodError", F28, {
        Parent: Error
    })
})
// @from(Ln 46101, Col 4)
Pm6
// @from(Ln 46101, Col 9)
Wm6
// @from(Ln 46101, Col 14)
Gm6
// @from(Ln 46101, Col 19)
Zm6
// @from(Ln 46102, Col 4)
fm6 = v(() => {
    IG();
    Mm6();
    Pm6 = Ea1(ow1), Wm6 = ka1(ow1), Gm6 = La1(ow1), Zm6 = Ra1(ow1)
})
// @from(Ln 46108, Col 0)
function p6(A) {
    return VB6(Vv1, A)
}
// @from(Ln 46112, Col 0)
function UHK(A) {
    return pa1(Tm6, A)
}
// @from(Ln 46116, Col 0)
function pHK(A) {
    return wv1(Ws1, A)
}
// @from(Ln 46120, Col 0)
function dHK(A) {
    return da1(yQ, A)
}
// @from(Ln 46124, Col 0)
function cHK(A) {
    return ca1(yQ, A)
}
// @from(Ln 46128, Col 0)
function lHK(A) {
    return la1(yQ, A)
}
// @from(Ln 46132, Col 0)
function iHK(A) {
    return ia1(yQ, A)
}
// @from(Ln 46136, Col 0)
function Em6(A) {
    return na1(vm6, A)
}
// @from(Ln 46140, Col 0)
function nHK(A) {
    return ra1(km6, A)
}
// @from(Ln 46144, Col 0)
function rHK(A) {
    return oa1(Lm6, A)
}
// @from(Ln 46148, Col 0)
function oHK(A) {
    return aa1(Rm6, A)
}
// @from(Ln 46152, Col 0)
function aHK(A) {
    return sa1(ym6, A)
}
// @from(Ln 46156, Col 0)
function sHK(A) {
    return ta1(Cm6, A)
}
// @from(Ln 46160, Col 0)
function tHK(A) {
    return ea1(Sm6, A)
}
// @from(Ln 46164, Col 0)
function eHK(A) {
    return As1(hm6, A)
}
// @from(Ln 46168, Col 0)
function A$K(A) {
    return qs1(Im6, A)
}
// @from(Ln 46172, Col 0)
function q$K(A) {
    return Ks1(xm6, A)
}
// @from(Ln 46176, Col 0)
function K$K(A) {
    return Ys1(bm6, A)
}
// @from(Ln 46180, Col 0)
function Y$K(A) {
    return zs1(um6, A)
}
// @from(Ln 46184, Col 0)
function z$K(A) {
    return ws1(Bm6, A)
}
// @from(Ln 46188, Col 0)
function w$K(A) {
    return Hs1(mm6, A)
}
// @from(Ln 46192, Col 0)
function H$K(A) {
    return $s1(Fm6, A)
}
// @from(Ln 46196, Col 0)
function $$K(A) {
    return Os1(Qm6, A)
}
// @from(Ln 46200, Col 0)
function O$K(A, q, K = {}) {
    return wm6(Q28, A, q, K)
}
// @from(Ln 46204, Col 0)
function Yz(A) {
    return RB6(Nv1, A)
}
// @from(Ln 46208, Col 0)
function Vm6(A) {
    return CB6(aw1, A)
}
// @from(Ln 46212, Col 0)
function _$K(A) {
    return SB6(aw1, A)
}
// @from(Ln 46216, Col 0)
function J$K(A) {
    return hB6(aw1, A)
}
// @from(Ln 46220, Col 0)
function X$K(A) {
    return IB6(aw1, A)
}
// @from(Ln 46224, Col 0)
function D$K(A) {
    return xB6(aw1, A)
}
// @from(Ln 46228, Col 0)
function c2(A) {
    return bB6(Tv1, A)
}
// @from(Ln 46232, Col 0)
function j$K(A) {
    return BB6(vv1, A)
}
// @from(Ln 46236, Col 0)
function M$K(A) {
    return FB6(gm6, A)
}
// @from(Ln 46240, Col 0)
function P$K(A) {
    return QB6(gm6, A)
}
// @from(Ln 46244, Col 0)
function W$K(A) {
    return gB6(g28, A)
}
// @from(Ln 46248, Col 0)
function G$K(A) {
    return UB6(U28, A)
}
// @from(Ln 46252, Col 0)
function Ev1(A) {
    return pB6(p28, A)
}
// @from(Ln 46256, Col 0)
function Um6() {
    return dB6(d28)
}
// @from(Ln 46260, Col 0)
function KJ() {
    return cw1(c28)
}
// @from(Ln 46264, Col 0)
function fs1(A) {
    return cB6(l28, A)
}
// @from(Ln 46268, Col 0)
function Z$K(A) {
    return lB6(i28, A)
}
// @from(Ln 46272, Col 0)
function f$K(A) {
    return iB6(Vs1, A)
}
// @from(Ln 46276, Col 0)
function B7(A, q) {
    return Zv1(n28, A, q)
}
// @from(Ln 46280, Col 0)
function V$K(A) {
    let q = A._zod.def.shape;
    return Hq(Object.keys(q))
}
// @from(Ln 46285, Col 0)
function H7(A, q) {
    let K = {
        type: "object",
        get shape() {
            return u7.assignProp(this, "shape", {
                ...A
            }), this.shape
        },
        ...u7.normalizeParams(q)
    };
    return new Ns1(K)
}
// @from(Ln 46298, Col 0)
function N$K(A, q) {
    return new Ns1({
        type: "object",
        get shape() {
            return u7.assignProp(this, "shape", {
                ...A
            }), this.shape
        },
        catchall: fs1(),
        ...u7.normalizeParams(q)
    })
}
// @from(Ln 46311, Col 0)
function rj(A, q) {
    return new Ns1({
        type: "object",
        get shape() {
            return u7.assignProp(this, "shape", {
                ...A
            }), this.shape
        },
        catchall: KJ(),
        ...u7.normalizeParams(q)
    })
}
// @from(Ln 46324, Col 0)
function l2(A, q) {
    return new pm6({
        type: "union",
        options: A,
        ...u7.normalizeParams(q)
    })
}
// @from(Ln 46332, Col 0)
function Ts1(A, q, K) {
    return new r28({
        type: "union",
        options: q,
        discriminator: A,
        ...u7.normalizeParams(K)
    })
}
// @from(Ln 46341, Col 0)
function kv1(A, q) {
    return new o28({
        type: "intersection",
        left: A,
        right: q
    })
}
// @from(Ln 46349, Col 0)
function T$K(A, q, K) {
    let Y = q instanceof N3,
        z = Y ? K : q;
    return new a28({
        type: "tuple",
        items: A,
        rest: Y ? q : null,
        ...u7.normalizeParams(z)
    })
}
// @from(Ln 46360, Col 0)
function P_(A, q, K) {
    return new dm6({
        type: "record",
        keyType: A,
        valueType: q,
        ...u7.normalizeParams(K)
    })
}
// @from(Ln 46369, Col 0)
function v$K(A, q, K) {
    return new dm6({
        type: "record",
        keyType: l2([A, fs1()]),
        valueType: q,
        ...u7.normalizeParams(K)
    })
}
// @from(Ln 46378, Col 0)
function E$K(A, q, K) {
    return new s28({
        type: "map",
        keyType: A,
        valueType: q,
        ...u7.normalizeParams(K)
    })
}
// @from(Ln 46387, Col 0)
function k$K(A, q) {
    return new t28({
        type: "set",
        valueType: A,
        ...u7.normalizeParams(q)
    })
}
// @from(Ln 46395, Col 0)
function V0(A, q) {
    let K = Array.isArray(A) ? Object.fromEntries(A.map((Y) => [Y, Y])) : A;
    return new fv1({
        type: "enum",
        entries: K,
        ...u7.normalizeParams(q)
    })
}
// @from(Ln 46404, Col 0)
function L$K(A, q) {
    return new fv1({
        type: "enum",
        entries: A,
        ...u7.normalizeParams(q)
    })
}
// @from(Ln 46412, Col 0)
function Hq(A, q) {
    return new e28({
        type: "literal",
        values: Array.isArray(A) ? A : [A],
        ...u7.normalizeParams(q)
    })
}
// @from(Ln 46420, Col 0)
function R$K(A) {
    return qm6(Aw8, A)
}
// @from(Ln 46424, Col 0)
function lm6(A) {
    return new cm6({
        type: "transform",
        transform: A
    })
}
// @from(Ln 46431, Col 0)
function Wq(A) {
    return new im6({
        type: "optional",
        innerType: A
    })
}
// @from(Ln 46438, Col 0)
function Gs1(A) {
    return new qw8({
        type: "nullable",
        innerType: A
    })
}
// @from(Ln 46445, Col 0)
function y$K(A) {
    return Wq(Gs1(A))
}
// @from(Ln 46449, Col 0)
function Yw8(A, q) {
    return new Kw8({
        type: "default",
        innerType: A,
        get defaultValue() {
            return typeof q === "function" ? q() : q
        }
    })
}
// @from(Ln 46459, Col 0)
function ww8(A, q) {
    return new zw8({
        type: "prefault",
        innerType: A,
        get defaultValue() {
            return typeof q === "function" ? q() : q
        }
    })
}
// @from(Ln 46469, Col 0)
function Hw8(A, q) {
    return new nm6({
        type: "nonoptional",
        innerType: A,
        ...u7.normalizeParams(q)
    })
}
// @from(Ln 46477, Col 0)
function C$K(A) {
    return new $w8({
        type: "success",
        innerType: A
    })
}
// @from(Ln 46484, Col 0)
function _w8(A, q) {
    return new Ow8({
        type: "catch",
        innerType: A,
        catchValue: typeof q === "function" ? q : () => q
    })
}
// @from(Ln 46492, Col 0)
function S$K(A) {
    return rB6(Jw8, A)
}
// @from(Ln 46496, Col 0)
function Zs1(A, q) {
    return new rm6({
        type: "pipe",
        in: A,
        out: q
    })
}
// @from(Ln 46504, Col 0)
function Dw8(A) {
    return new Xw8({
        type: "readonly",
        innerType: A
    })
}
// @from(Ln 46511, Col 0)
function h$K(A, q) {
    return new jw8({
        type: "template_literal",
        parts: A,
        ...u7.normalizeParams(q)
    })
}
// @from(Ln 46519, Col 0)
function Pw8(A) {
    return new Mw8({
        type: "lazy",
        getter: A
    })
}
// @from(Ln 46526, Col 0)
function I$K(A) {
    return new Ww8({
        type: "promise",
        innerType: A
    })
}
// @from(Ln 46533, Col 0)
function Gw8(A, q) {
    let K = new vO({
        check: "custom",
        ...u7.normalizeParams(q)
    });
    return K._zod.check = A, K
}
// @from(Ln 46541, Col 0)
function om6(A, q) {
    return Km6(vs1, A ?? (() => !0), q)
}
// @from(Ln 46545, Col 0)
function Zw8(A, q = {}) {
    return Ym6(vs1, A, q)
}
// @from(Ln 46549, Col 0)
function fw8(A, q) {
    let K = Gw8((Y) => {
        return Y.addIssue = (z) => {
            if (typeof z === "string") Y.issues.push(u7.issue(z, Y.value, K._zod.def));
            else {
                let w = z;
                if (w.fatal) w.continue = !1;
                w.code ?? (w.code = "custom"), w.input ?? (w.input = Y.value), w.inst ?? (w.inst = K), w.continue ?? (w.continue = !K._zod.def.abort), Y.issues.push(u7.issue(w))
            }
        }, A(Y.value, Y)
    }, q);
    return K
}
// @from(Ln 46563, Col 0)
function x$K(A, q = {
    error: `Input not instance of ${A.name}`
}) {
    let K = new vs1({
        type: "custom",
        check: "custom",
        fn: (Y) => Y instanceof A,
        abort: !0,
        ...u7.normalizeParams(q)
    });
    return K._zod.bag.Class = A, K
}
// @from(Ln 46576, Col 0)
function u$K(A) {
    let q = Pw8(() => {
        return l2([p6(A), Yz(), c2(), Ev1(), B7(q), P_(p6(), q)])
    });
    return q
}
// @from(Ln 46583, Col 0)
function Es1(A, q) {
    return Zs1(lm6(A), q)
}
// @from(Ln 46586, Col 4)
A9
// @from(Ln 46586, Col 8)
Nm6
// @from(Ln 46586, Col 13)
Vv1
// @from(Ln 46586, Col 18)
KH
// @from(Ln 46586, Col 22)
Tm6
// @from(Ln 46586, Col 27)
Ws1
// @from(Ln 46586, Col 32)
yQ
// @from(Ln 46586, Col 36)
vm6
// @from(Ln 46586, Col 41)
km6
// @from(Ln 46586, Col 46)
Lm6
// @from(Ln 46586, Col 51)
Rm6
// @from(Ln 46586, Col 56)
ym6
// @from(Ln 46586, Col 61)
Cm6
// @from(Ln 46586, Col 66)
Sm6
// @from(Ln 46586, Col 71)
hm6
// @from(Ln 46586, Col 76)
Im6
// @from(Ln 46586, Col 81)
xm6
// @from(Ln 46586, Col 86)
bm6
// @from(Ln 46586, Col 91)
um6
// @from(Ln 46586, Col 96)
Bm6
// @from(Ln 46586, Col 101)
mm6
// @from(Ln 46586, Col 106)
Fm6
// @from(Ln 46586, Col 111)
Qm6
// @from(Ln 46586, Col 116)
Q28
// @from(Ln 46586, Col 121)
Nv1
// @from(Ln 46586, Col 126)
aw1
// @from(Ln 46586, Col 131)
Tv1
// @from(Ln 46586, Col 136)
vv1
// @from(Ln 46586, Col 141)
gm6
// @from(Ln 46586, Col 146)
g28
// @from(Ln 46586, Col 151)
U28
// @from(Ln 46586, Col 156)
p28
// @from(Ln 46586, Col 161)
d28
// @from(Ln 46586, Col 166)
c28
// @from(Ln 46586, Col 171)
l28
// @from(Ln 46586, Col 176)
i28
// @from(Ln 46586, Col 181)
Vs1
// @from(Ln 46586, Col 186)
n28
// @from(Ln 46586, Col 191)
Ns1
// @from(Ln 46586, Col 196)
pm6
// @from(Ln 46586, Col 201)
r28
// @from(Ln 46586, Col 206)
o28
// @from(Ln 46586, Col 211)
a28
// @from(Ln 46586, Col 216)
dm6
// @from(Ln 46586, Col 221)
s28
// @from(Ln 46586, Col 226)
t28
// @from(Ln 46586, Col 231)
fv1
// @from(Ln 46586, Col 236)
e28
// @from(Ln 46586, Col 241)
Aw8
// @from(Ln 46586, Col 246)
cm6
// @from(Ln 46586, Col 251)
im6
// @from(Ln 46586, Col 256)
qw8
// @from(Ln 46586, Col 261)
Kw8
// @from(Ln 46586, Col 266)
zw8
// @from(Ln 46586, Col 271)
nm6
// @from(Ln 46586, Col 276)
$w8
// @from(Ln 46586, Col 281)
Ow8
// @from(Ln 46586, Col 286)
Jw8
// @from(Ln 46586, Col 291)
rm6
// @from(Ln 46586, Col 296)
Xw8
// @from(Ln 46586, Col 301)
jw8
// @from(Ln 46586, Col 306)
Mw8
// @from(Ln 46586, Col 311)
Ww8
// @from(Ln 46586, Col 316)
vs1
// @from(Ln 46586, Col 321)
b$K = (...A) => zm6({
    Pipe: rm6,
    Boolean: Tv1,
    String: Vv1,
    Transform: cm6
}, ...A)
// @from(Ln 46592, Col 4)
Ps1 = v(() => {
    IG();
    IG();
    _m6();
    Ms1();
    fm6();
    A9 = XA("ZodType", (A, q) => {
        return N3.init(A, q), A.def = q, Object.defineProperty(A, "_def", {
            value: q
        }), A.check = (...K) => {
            return A.clone({
                ...q,
                checks: [...q.checks ?? [], ...K.map((Y) => typeof Y === "function" ? {
                    _zod: {
                        check: Y,
                        def: {
                            check: "custom"
                        },
                        onattach: []
                    }
                } : Y)]
            })
        }, A.clone = (K, Y) => fT(A, K, Y), A.brand = () => A, A.register = (K, Y) => {
            return K.add(A, Y), A
        }, A.parse = (K, Y) => Pm6(A, K, Y, {
            callee: A.parse
        }), A.safeParse = (K, Y) => Gm6(A, K, Y), A.parseAsync = async (K, Y) => Wm6(A, K, Y, {
            callee: A.parseAsync
        }), A.safeParseAsync = async (K, Y) => Zm6(A, K, Y), A.spa = A.safeParseAsync, A.refine = (K, Y) => A.check(Zw8(K, Y)), A.superRefine = (K) => A.check(fw8(K)), A.overwrite = (K) => A.check(LQ(K)), A.optional = () => Wq(A), A.nullable = () => Gs1(A), A.nullish = () => Wq(Gs1(A)), A.nonoptional = (K) => Hw8(A, K), A.array = () => B7(A), A.or = (K) => l2([A, K]), A.and = (K) => kv1(A, K), A.transform = (K) => Zs1(A, lm6(K)), A.default = (K) => Yw8(A, K), A.prefault = (K) => ww8(A, K), A.catch = (K) => _w8(A, K), A.pipe = (K) => Zs1(A, K), A.readonly = () => Dw8(A), A.describe = (K) => {
            let Y = A.clone();
            return nx.add(Y, {
                description: K
            }), Y
        }, Object.defineProperty(A, "description", {
            get() {
                return nx.get(A)?.description
            },
            configurable: !0
        }), A.meta = (...K) => {
            if (K.length === 0) return nx.get(A);
            let Y = A.clone();
            return nx.add(Y, K[0]), Y
        }, A.isOptional = () => A.safeParse(void 0).success, A.isNullable = () => A.safeParse(null).success, A
    }), Nm6 = XA("_ZodString", (A, q) => {
        s61.init(A, q), A9.init(A, q);
        let K = A._zod.bag;
        A.format = K.format ?? null, A.minLength = K.minimum ?? null, A.maxLength = K.maximum ?? null, A.regex = (...Y) => A.check($v1(...Y)), A.includes = (...Y) => A.check(Jv1(...Y)), A.startsWith = (...Y) => A.check(Xv1(...Y)), A.endsWith = (...Y) => A.check(Dv1(...Y)), A.min = (...Y) => A.check(Li(...Y)), A.max = (...Y) => A.check(iw1(...Y)), A.length = (...Y) => A.check(nw1(...Y)), A.nonempty = (...Y) => A.check(Li(1, ...Y)), A.lowercase = (Y) => A.check(Ov1(Y)), A.uppercase = (Y) => A.check(_v1(Y)), A.trim = () => A.check(Pv1()), A.normalize = (...Y) => A.check(Mv1(...Y)), A.toLowerCase = () => A.check(Wv1()), A.toUpperCase = () => A.check(Gv1())
    }), Vv1 = XA("ZodString", (A, q) => {
        s61.init(A, q), Nm6.init(A, q), A.email = (K) => A.check(pa1(Tm6, K)), A.url = (K) => A.check(na1(vm6, K)), A.jwt = (K) => A.check(Os1(Qm6, K)), A.emoji = (K) => A.check(ra1(km6, K)), A.guid = (K) => A.check(wv1(Ws1, K)), A.uuid = (K) => A.check(da1(yQ, K)), A.uuidv4 = (K) => A.check(ca1(yQ, K)), A.uuidv6 = (K) => A.check(la1(yQ, K)), A.uuidv7 = (K) => A.check(ia1(yQ, K)), A.nanoid = (K) => A.check(oa1(Lm6, K)), A.guid = (K) => A.check(wv1(Ws1, K)), A.cuid = (K) => A.check(aa1(Rm6, K)), A.cuid2 = (K) => A.check(sa1(ym6, K)), A.ulid = (K) => A.check(ta1(Cm6, K)), A.base64 = (K) => A.check(ws1(Bm6, K)), A.base64url = (K) => A.check(Hs1(mm6, K)), A.xid = (K) => A.check(ea1(Sm6, K)), A.ksuid = (K) => A.check(As1(hm6, K)), A.ipv4 = (K) => A.check(qs1(Im6, K)), A.ipv6 = (K) => A.check(Ks1(xm6, K)), A.cidrv4 = (K) => A.check(Ys1(bm6, K)), A.cidrv6 = (K) => A.check(zs1(um6, K)), A.e164 = (K) => A.check($s1(Fm6, K)), A.datetime = (K) => A.check(Jm6(K)), A.date = (K) => A.check(Xm6(K)), A.time = (K) => A.check(Dm6(K)), A.duration = (K) => A.check(jm6(K))
    });
    KH = XA("ZodStringFormat", (A, q) => {
        fw.init(A, q), Nm6.init(A, q)
    }), Tm6 = XA("ZodEmail", (A, q) => {
        Ib6.init(A, q), KH.init(A, q)
    });
    Ws1 = XA("ZodGUID", (A, q) => {
        Sb6.init(A, q), KH.init(A, q)
    });
    yQ = XA("ZodUUID", (A, q) => {
        hb6.init(A, q), KH.init(A, q)
    });
    vm6 = XA("ZodURL", (A, q) => {
        xb6.init(A, q), KH.init(A, q)
    });
    km6 = XA("ZodEmoji", (A, q) => {
        bb6.init(A, q), KH.init(A, q)
    });
    Lm6 = XA("ZodNanoID", (A, q) => {
        ub6.init(A, q), KH.init(A, q)
    });
    Rm6 = XA("ZodCUID", (A, q) => {
        Bb6.init(A, q), KH.init(A, q)
    });
    ym6 = XA("ZodCUID2", (A, q) => {
        mb6.init(A, q), KH.init(A, q)
    });
    Cm6 = XA("ZodULID", (A, q) => {
        Fb6.init(A, q), KH.init(A, q)
    });
    Sm6 = XA("ZodXID", (A, q) => {
        Qb6.init(A, q), KH.init(A, q)
    });
    hm6 = XA("ZodKSUID", (A, q) => {
        gb6.init(A, q), KH.init(A, q)
    });
    Im6 = XA("ZodIPv4", (A, q) => {
        lb6.init(A, q), KH.init(A, q)
    });
    xm6 = XA("ZodIPv6", (A, q) => {
        ib6.init(A, q), KH.init(A, q)
    });
    bm6 = XA("ZodCIDRv4", (A, q) => {
        nb6.init(A, q), KH.init(A, q)
    });
    um6 = XA("ZodCIDRv6", (A, q) => {
        rb6.init(A, q), KH.init(A, q)
    });
    Bm6 = XA("ZodBase64", (A, q) => {
        ab6.init(A, q), KH.init(A, q)
    });
    mm6 = XA("ZodBase64URL", (A, q) => {
        sb6.init(A, q), KH.init(A, q)
    });
    Fm6 = XA("ZodE164", (A, q) => {
        tb6.init(A, q), KH.init(A, q)
    });
    Qm6 = XA("ZodJWT", (A, q) => {
        eb6.init(A, q), KH.init(A, q)
    });
    Q28 = XA("ZodCustomStringFormat", (A, q) => {
        Au6.init(A, q), KH.init(A, q)
    });
    Nv1 = XA("ZodNumber", (A, q) => {
        ma1.init(A, q), A9.init(A, q), A.gt = (Y, z) => A.check(kQ(Y, z)), A.gte = (Y, z) => A.check(pf(Y, z)), A.min = (Y, z) => A.check(pf(Y, z)), A.lt = (Y, z) => A.check(EQ(Y, z)), A.lte = (Y, z) => A.check(Jk(Y, z)), A.max = (Y, z) => A.check(Jk(Y, z)), A.int = (Y) => A.check(Vm6(Y)), A.safe = (Y) => A.check(Vm6(Y)), A.positive = (Y) => A.check(kQ(0, Y)), A.nonnegative = (Y) => A.check(pf(0, Y)), A.negative = (Y) => A.check(EQ(0, Y)), A.nonpositive = (Y) => A.check(Jk(0, Y)), A.multipleOf = (Y, z) => A.check(e61(Y, z)), A.step = (Y, z) => A.check(e61(Y, z)), A.finite = () => A;
        let K = A._zod.bag;
        A.minValue = Math.max(K.minimum ?? Number.NEGATIVE_INFINITY, K.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null, A.maxValue = Math.min(K.maximum ?? Number.POSITIVE_INFINITY, K.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null, A.isInt = (K.format ?? "").includes("int") || Number.isSafeInteger(K.multipleOf ?? 0.5), A.isFinite = !0, A.format = K.format ?? null
    });
    aw1 = XA("ZodNumberFormat", (A, q) => {
        qu6.init(A, q), Nv1.init(A, q)
    });
    Tv1 = XA("ZodBoolean", (A, q) => {
        tT1.init(A, q), A9.init(A, q)
    });
    vv1 = XA("ZodBigInt", (A, q) => {
        Fa1.init(A, q), A9.init(A, q), A.gte = (Y, z) => A.check(pf(Y, z)), A.min = (Y, z) => A.check(pf(Y, z)), A.gt = (Y, z) => A.check(kQ(Y, z)), A.gte = (Y, z) => A.check(pf(Y, z)), A.min = (Y, z) => A.check(pf(Y, z)), A.lt = (Y, z) => A.check(EQ(Y, z)), A.lte = (Y, z) => A.check(Jk(Y, z)), A.max = (Y, z) => A.check(Jk(Y, z)), A.positive = (Y) => A.check(kQ(BigInt(0), Y)), A.negative = (Y) => A.check(EQ(BigInt(0), Y)), A.nonpositive = (Y) => A.check(Jk(BigInt(0), Y)), A.nonnegative = (Y) => A.check(pf(BigInt(0), Y)), A.multipleOf = (Y, z) => A.check(e61(Y, z));
        let K = A._zod.bag;
        A.minValue = K.minimum ?? null, A.maxValue = K.maximum ?? null, A.format = K.format ?? null
    });
    gm6 = XA("ZodBigIntFormat", (A, q) => {
        Ku6.init(A, q), vv1.init(A, q)
    });
    g28 = XA("ZodSymbol", (A, q) => {
        Yu6.init(A, q), A9.init(A, q)
    });
    U28 = XA("ZodUndefined", (A, q) => {
        zu6.init(A, q), A9.init(A, q)
    });
    p28 = XA("ZodNull", (A, q) => {
        wu6.init(A, q), A9.init(A, q)
    });
    d28 = XA("ZodAny", (A, q) => {
        Hu6.init(A, q), A9.init(A, q)
    });
    c28 = XA("ZodUnknown", (A, q) => {
        pw1.init(A, q), A9.init(A, q)
    });
    l28 = XA("ZodNever", (A, q) => {
        $u6.init(A, q), A9.init(A, q)
    });
    i28 = XA("ZodVoid", (A, q) => {
        Ou6.init(A, q), A9.init(A, q)
    });
    Vs1 = XA("ZodDate", (A, q) => {
        _u6.init(A, q), A9.init(A, q), A.min = (Y, z) => A.check(pf(Y, z)), A.max = (Y, z) => A.check(Jk(Y, z));
        let K = A._zod.bag;
        A.minDate = K.minimum ? new Date(K.minimum) : null, A.maxDate = K.maximum ? new Date(K.maximum) : null
    });
    n28 = XA("ZodArray", (A, q) => {
        eT1.init(A, q), A9.init(A, q), A.element = q.element, A.min = (K, Y) => A.check(Li(K, Y)), A.nonempty = (K) => A.check(Li(1, K)), A.max = (K, Y) => A.check(iw1(K, Y)), A.length = (K, Y) => A.check(nw1(K, Y)), A.unwrap = () => A.element
    });
    Ns1 = XA("ZodObject", (A, q) => {
        Ju6.init(A, q), A9.init(A, q), u7.defineLazy(A, "shape", () => q.shape), A.keyof = () => V0(Object.keys(A._zod.def.shape)), A.catchall = (K) => A.clone({
            ...A._zod.def,
            catchall: K
        }), A.passthrough = () => A.clone({
            ...A._zod.def,
            catchall: KJ()
        }), A.loose = () => A.clone({
            ...A._zod.def,
            catchall: KJ()
        }), A.strict = () => A.clone({
            ...A._zod.def,
            catchall: fs1()
        }), A.strip = () => A.clone({
            ...A._zod.def,
            catchall: void 0
        }), A.extend = (K) => {
            return u7.extend(A, K)
        }, A.merge = (K) => u7.merge(A, K), A.pick = (K) => u7.pick(A, K), A.omit = (K) => u7.omit(A, K), A.partial = (...K) => u7.partial(im6, A, K[0]), A.required = (...K) => u7.required(nm6, A, K[0])
    });
    pm6 = XA("ZodUnion", (A, q) => {
        Qa1.init(A, q), A9.init(A, q), A.options = q.options
    });
    r28 = XA("ZodDiscriminatedUnion", (A, q) => {
        pm6.init(A, q), Xu6.init(A, q)
    });
    o28 = XA("ZodIntersection", (A, q) => {
        Du6.init(A, q), A9.init(A, q)
    });
    a28 = XA("ZodTuple", (A, q) => {
        t61.init(A, q), A9.init(A, q), A.rest = (K) => A.clone({
            ...A._zod.def,
            rest: K
        })
    });
    dm6 = XA("ZodRecord", (A, q) => {
        ju6.init(A, q), A9.init(A, q), A.keyType = q.keyType, A.valueType = q.valueType
    });
    s28 = XA("ZodMap", (A, q) => {
        Mu6.init(A, q), A9.init(A, q), A.keyType = q.keyType, A.valueType = q.valueType
    });
    t28 = XA("ZodSet", (A, q) => {
        Pu6.init(A, q), A9.init(A, q), A.min = (...K) => A.check(AA1(...K)), A.nonempty = (K) => A.check(AA1(1, K)), A.max = (...K) => A.check(lw1(...K)), A.size = (...K) => A.check(Hv1(...K))
    });
    fv1 = XA("ZodEnum", (A, q) => {
        Wu6.init(A, q), A9.init(A, q), A.enum = q.entries, A.options = Object.values(q.entries);
        let K = new Set(Object.keys(q.entries));
        A.extract = (Y, z) => {
            let w = {};
            for (let H of Y)
                if (K.has(H)) w[H] = q.entries[H];
                else throw Error(`Key ${H} not found in enum`);
            return new fv1({
                ...q,
                checks: [],
                ...u7.normalizeParams(z),
                entries: w
            })
        }, A.exclude = (Y, z) => {
            let w = {
                ...q.entries
            };
            for (let H of Y)
                if (K.has(H)) delete w[H];
                else throw Error(`Key ${H} not found in enum`);
            return new fv1({
                ...q,
                checks: [],
                ...u7.normalizeParams(z),
                entries: w
            })
        }
    });
    e28 = XA("ZodLiteral", (A, q) => {
        Gu6.init(A, q), A9.init(A, q), A.values = new Set(q.values), Object.defineProperty(A, "value", {
            get() {
                if (q.values.length > 1) throw Error("This schema contains multiple valid literal values. Use `.values` instead.");
                return q.values[0]
            }
        })
    });
    Aw8 = XA("ZodFile", (A, q) => {
        Zu6.init(A, q), A9.init(A, q), A.min = (K, Y) => A.check(AA1(K, Y)), A.max = (K, Y) => A.check(lw1(K, Y)), A.mime = (K, Y) => A.check(jv1(Array.isArray(K) ? K : [K], Y))
    });
    cm6 = XA("ZodTransform", (A, q) => {
        Av1.init(A, q), A9.init(A, q), A._zod.parse = (K, Y) => {
            K.addIssue = (w) => {
                if (typeof w === "string") K.issues.push(u7.issue(w, K.value, q));
                else {
                    let H = w;
                    if (H.fatal) H.continue = !1;
                    H.code ?? (H.code = "custom"), H.input ?? (H.input = K.value), H.inst ?? (H.inst = A), H.continue ?? (H.continue = !0), K.issues.push(u7.issue(H))
                }
            };
            let z = q.transform(K.value, K);
            if (z instanceof Promise) return z.then((w) => {
                return K.value = w, K
            });
            return K.value = z, K
        }
    });
    im6 = XA("ZodOptional", (A, q) => {
        fu6.init(A, q), A9.init(A, q), A.unwrap = () => A._zod.def.innerType
    });
    qw8 = XA("ZodNullable", (A, q) => {
        Vu6.init(A, q), A9.init(A, q), A.unwrap = () => A._zod.def.innerType
    });
    Kw8 = XA("ZodDefault", (A, q) => {
        Nu6.init(A, q), A9.init(A, q), A.unwrap = () => A._zod.def.innerType, A.removeDefault = A.unwrap
    });
    zw8 = XA("ZodPrefault", (A, q) => {
        Tu6.init(A, q), A9.init(A, q), A.unwrap = () => A._zod.def.innerType
    });
    nm6 = XA("ZodNonOptional", (A, q) => {
        vu6.init(A, q), A9.init(A, q), A.unwrap = () => A._zod.def.innerType
    });
    $w8 = XA("ZodSuccess", (A, q) => {
        Eu6.init(A, q), A9.init(A, q), A.unwrap = () => A._zod.def.innerType
    });
    Ow8 = XA("ZodCatch", (A, q) => {
        ku6.init(A, q), A9.init(A, q), A.unwrap = () => A._zod.def.innerType, A.removeCatch = A.unwrap
    });
    Jw8 = XA("ZodNaN", (A, q) => {
        Lu6.init(A, q), A9.init(A, q)
    });
    rm6 = XA("ZodPipe", (A, q) => {
        qv1.init(A, q), A9.init(A, q), A.in = q.in, A.out = q.out
    });
    Xw8 = XA("ZodReadonly", (A, q) => {
        Ru6.init(A, q), A9.init(A, q)
    });
    jw8 = XA("ZodTemplateLiteral", (A, q) => {
        yu6.init(A, q), A9.init(A, q)
    });
    Mw8 = XA("ZodLazy", (A, q) => {
        Su6.init(A, q), A9.init(A, q), A.unwrap = () => A._zod.def.getter()
    });
    Ww8 = XA("ZodPromise", (A, q) => {
        Cu6.init(A, q), A9.init(A, q), A.unwrap = () => A._zod.def.innerType
    });
    vs1 = XA("ZodCustom", (A, q) => {
        hu6.init(A, q), A9.init(A, q)
    })
})
// @from(Ln 46897, Col 0)
function B$K(A) {
    KX({
        customError: A
    })
}
// @from(Ln 46903, Col 0)
function m$K() {
    return KX().customError
}
// @from(Ln 46906, Col 4)
am6
// @from(Ln 46907, Col 4)
Vw8 = v(() => {
    IG();
    am6 = {
        invalid_type: "invalid_type",
        too_big: "too_big",
        too_small: "too_small",
        invalid_format: "invalid_format",
        not_multiple_of: "not_multiple_of",
        unrecognized_keys: "unrecognized_keys",
        invalid_union: "invalid_union",
        invalid_key: "invalid_key",
        invalid_element: "invalid_element",
        invalid_value: "invalid_value",
        custom: "custom"
    }
})
// @from(Ln 46923, Col 4)
Lv1 = {}
// @from(Ln 46932, Col 0)
function F$K(A) {
    return NB6(Vv1, A)
}
// @from(Ln 46936, Col 0)
function Q$K(A) {
    return yB6(Nv1, A)
}
// @from(Ln 46940, Col 0)
function g$K(A) {
    return uB6(Tv1, A)
}
// @from(Ln 46944, Col 0)
function U$K(A) {
    return mB6(vv1, A)
}
// @from(Ln 46948, Col 0)
function p$K(A) {
    return nB6(Vs1, A)
}
// @from(Ln 46951, Col 4)
Nw8 = v(() => {
    IG();
    Ps1()
})
// @from(Ln 46955, Col 4)
u = {}
// @from(Ln 47165, Col 4)
sm6 = v(() => {
    IG();
    IG();
    Fu6();
    IG();
    ga1();
    Ms1();
    Ms1();
    Nw8();
    Ps1();
    _m6();
    Mm6();
    fm6();
    Vw8();
    KX(Yv1())
})
// @from(Ln 47181, Col 4)
Tw8
// @from(Ln 47182, Col 4)
tm6 = v(() => {
    sm6();
    sm6();
    Tw8 = u
})
// @from(Ln 47187, Col 4)
y4
// @from(Ln 47188, Col 4)
i7 = v(() => {
    tm6();
    tm6();
    y4 = Tw8
})
// @from(Ln 47193, Col 4)
qA1
// @from(Ln 47193, Col 9)
d$K
// @from(Ln 47193, Col 14)
ox
// @from(Ln 47194, Col 4)
em6 = v(() => {
    qA1 = ["acceptEdits", "bypassPermissions", "default", "delegate", "dontAsk", "plan"], d$K = [...qA1], ox = d$K
})
// @from(Ln 47198, Col 0)
function KA1(A) {
    switch (A) {
        case "acceptEdits":
        case "bypassPermissions":
        case "default":
        case "delegate":
        case "dontAsk":
        case "plan":
            return A
    }
}
// @from(Ln 47210, Col 0)
function jC(A) {
    switch (A) {
        case "bypassPermissions":
            return "bypassPermissions";
        case "acceptEdits":
            return "acceptEdits";
        case "plan":
            return "plan";
        case "delegate":
            return "delegate";
        case "dontAsk":
            return "dontAsk";
        case "default":
            return "default";
        default:
            return "default"
    }
}
// @from(Ln 47229, Col 0)
function CQ(A) {
    switch (A) {
        case "default":
            return "Default";
        case "plan":
            return "Plan Mode";
        case "delegate":
            return "Delegate Mode";
        case "acceptEdits":
            return "Accept edits";
        case "bypassPermissions":
            return "Bypass Permissions";
        case "dontAsk":
            return "Don't Ask"
    }
}
// @from(Ln 47246, Col 0)
function Lw8(A) {
    return A === "default" || A === void 0
}
// @from(Ln 47250, Col 0)
function Rv1(A) {
    switch (A) {
        case "default":
            return "";
        case "plan":
            return "⏸";
        case "delegate":
            return "⇢";
        case "acceptEdits":
            return "⏵⏵";
        case "bypassPermissions":
            return "⏵⏵";
        case "dontAsk":
            return "⏵⏵"
    }
}
// @from(Ln 47267, Col 0)
function cP(A) {
    switch (A) {
        case "default":
            return "text";
        case "plan":
            return "planMode";
        case "delegate":
            return "delegateMode";
        case "acceptEdits":
            return "autoAccept";
        case "bypassPermissions":
            return "error";
        case "dontAsk":
            return "error"
    }
}
// @from(Ln 47283, Col 4)
Ew8
// @from(Ln 47283, Col 9)
kw8
// @from(Ln 47284, Col 4)
oj = v(() => {
    i7();
    em6();
    Ew8 = y4.enum(ox), kw8 = y4.enum(qA1)
})
// @from(Ln 47290, Col 0)
function c$K(A) {
    return A.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)")
}
// @from(Ln 47294, Col 0)
function l$K(A) {
    return A.replace(/\\\(/g, "(").replace(/\\\)/g, ")").replace(/\\\\/g, "\\")
}
// @from(Ln 47298, Col 0)
function lP(A) {
    let q = i$K(A, "(");
    if (q === -1) return {
        toolName: A
    };
    let K = n$K(A, ")");
    if (K === -1 || K <= q) return {
        toolName: A
    };
    if (K !== A.length - 1) return {
        toolName: A
    };
    let Y = A.substring(0, q),
        z = A.substring(q + 1, K);
    if (!Y) return {
        toolName: A
    };
    if (z === "" || z === "*") return {
        toolName: Y
    };
    let w = l$K(z);
    return {
        toolName: Y,
        ruleContent: w
    }
}
// @from(Ln 47325, Col 0)
function M9(A) {
    if (!A.ruleContent) return A.toolName;
    let q = c$K(A.ruleContent);
    return `${A.toolName}(${q})`
}
// @from(Ln 47331, Col 0)
function i$K(A, q) {
    for (let K = 0; K < A.length; K++)
        if (A[K] === q) {
            let Y = 0,
                z = K - 1;
            while (z >= 0 && A[z] === "\\") Y++, z--;
            if (Y % 2 === 0) return K
        } return -1
}
// @from(Ln 47341, Col 0)
function n$K(A, q) {
    for (let K = A.length - 1; K >= 0; K--)
        if (A[K] === q) {
            let Y = 0,
                z = K - 1;
            while (z >= 0 && A[z] === "\\") Y++, z--;
            if (Y % 2 === 0) return K
        } return -1
}
// @from(Ln 47351, Col 0)
function Rw8(A) {
    return AF6.filePatternTools.includes(A)
}
// @from(Ln 47355, Col 0)
function yw8(A) {
    return AF6.bashPrefixTools.includes(A)
}
// @from(Ln 47359, Col 0)
function Cw8(A) {
    return AF6.customValidation[A]
}
// @from(Ln 47362, Col 4)
AF6
// @from(Ln 47363, Col 4)
Sw8 = v(() => {
    AF6 = {
        filePatternTools: ["Read", "Write", "Edit", "Glob", "NotebookRead", "NotebookEdit"],
        bashPrefixTools: ["Bash"],
        customValidation: {
            WebSearch: (A) => {
                if (A.includes("*") || A.includes("?")) return {
                    valid: !1,
                    error: "WebSearch does not support wildcards",
                    suggestion: "Use exact search terms without * or ?",
                    examples: ["WebSearch(claude ai)", "WebSearch(typescript tutorial)"]
                };
                return {
                    valid: !0
                }
            },
            WebFetch: (A) => {
                if (A.includes("://") || A.startsWith("http")) return {
                    valid: !1,
                    error: "WebFetch permissions use domain format, not URLs",
                    suggestion: 'Use "domain:hostname" format',
                    examples: ["WebFetch(domain:example.com)", "WebFetch(domain:github.com)"]
                };
                if (!A.startsWith("domain:")) return {
                    valid: !1,
                    error: 'WebFetch permissions must use "domain:" prefix',
                    suggestion: 'Use "domain:hostname" format',
                    examples: ["WebFetch(domain:example.com)", "WebFetch(domain:*.google.com)"]
                };
                return {
                    valid: !0
                }
            }
        }
    }
})
// @from(Ln 47400, Col 0)
function hw8(A, q) {
    let K = 0,
        Y = q - 1;
    while (Y >= 0 && A[Y] === "\\") K++, Y--;
    return K % 2 !== 0
}
// @from(Ln 47407, Col 0)
function qF6(A, q) {
    let K = 0;
    for (let Y = 0; Y < A.length; Y++)
        if (A[Y] === q && !hw8(A, Y)) K++;
    return K
}
// @from(Ln 47414, Col 0)
function r$K(A) {
    for (let q = 0; q < A.length - 1; q++)
        if (A[q] === "(" && A[q + 1] === ")") {
            if (!hw8(A, q)) return !0
        } return !1
}
// @from(Ln 47421, Col 0)
function o$K(A) {
    if (!A || A.trim() === "") return {
        valid: !1,
        error: "Permission rule cannot be empty"
    };
    let q = qF6(A, "("),
        K = qF6(A, ")");
    if (q !== K) return {
        valid: !1,
        error: "Mismatched parentheses",
        suggestion: "Ensure all opening parentheses have matching closing parentheses"
    };
    if (r$K(A)) {
        let H = A.substring(0, A.indexOf("("));
        if (!H) return {
            valid: !1,
            error: "Empty parentheses with no tool name",
            suggestion: "Specify a tool name before the parentheses"
        };
        return {
            valid: !1,
            error: "Empty parentheses",
            suggestion: `Either specify a pattern or use just "${H}" without parentheses`,
            examples: [`${H}`, `${H}(some-pattern)`]
        }
    }
    let Y = lP(A),
        z = VD(Y.toolName);
    if (z) {
        if (Y.ruleContent !== void 0 || qF6(A, "(") > 0) return {
            valid: !1,
            error: "MCP rules do not support patterns in parentheses",
            suggestion: `Use "${Y.toolName}" without parentheses, or use "mcp__${z.serverName}__*" for all tools`,
            examples: [`mcp__${z.serverName}`, `mcp__${z.serverName}__*`, z.toolName && z.toolName !== "*" ? `mcp__${z.serverName}__${z.toolName}` : void 0].filter(Boolean)
        };
        return {
            valid: !0
        }
    }
    if (!Y.toolName || Y.toolName.length === 0) return {
        valid: !1,
        error: "Tool name cannot be empty"
    };
    if (Y.toolName[0] !== Y.toolName[0]?.toUpperCase()) return {
        valid: !1,
        error: "Tool names must start with uppercase",
        suggestion: `Use "${String(Y.toolName).charAt(0).toUpperCase()+String(Y.toolName).slice(1)}"`
    };
    let w = Cw8(Y.toolName);
    if (w && Y.ruleContent !== void 0) {
        let H = w(Y.ruleContent);
        if (!H.valid) return H
    }
    if (yw8(Y.toolName) && Y.ruleContent !== void 0) {
        let H = Y.ruleContent;
        if (H.includes(":*") && !H.endsWith(":*")) return {
            valid: !1,
            error: "The :* pattern must be at the end",
            suggestion: "Move :* to the end for prefix matching, or use * for wildcard matching",
            examples: ["Bash(npm run:*) - prefix matching (legacy)", "Bash(npm run *) - wildcard matching"]
        };
        if (H === ":*") return {
            valid: !1,
            error: "Prefix cannot be empty before :*",
            suggestion: "Specify a command prefix before :*",
            examples: ["Bash(npm:*)", "Bash(git:*)"]
        }
    }
    if (Rw8(Y.toolName) && Y.ruleContent !== void 0) {
        let H = Y.ruleContent;
        if (H.includes(":*")) return {
            valid: !1,
            error: 'The ":*" syntax is only for Bash prefix rules',
            suggestion: 'Use glob patterns like "*" or "**" for file matching',
            examples: [`${Y.toolName}(*.ts) - matches .ts files`, `${Y.toolName}(src/**) - matches all files in src`, `${Y.toolName}(**/*.test.ts) - matches test files`]
        };
        if (H.includes("*") && !H.match(/^\*|\*$|\*\*|\/\*|\*\.|\*\)/) && !H.includes("**")) return {
            valid: !1,
            error: "Wildcard placement might be incorrect",
            suggestion: "Wildcards are typically used at path boundaries",
            examples: [`${Y.toolName}(*.js) - all .js files`, `${Y.toolName}(src/*) - all files directly in src`, `${Y.toolName}(src/**) - all files recursively in src`]
        }
    }
    return {
        valid: !0
    }
}
// @from(Ln 47508, Col 4)
ks1
// @from(Ln 47509, Col 4)
Iw8 = v(() => {
    i7();
    _T();
    Sw8();
    ks1 = u.string().superRefine((A, q) => {
        let K = o$K(A);
        if (!K.valid) {
            let Y = K.error;
            if (K.suggestion) Y += `. ${K.suggestion}`;
            if (K.examples && K.examples.length > 0) Y += `. Examples: ${K.examples.join(", ")}`;
            q.addIssue({
                code: u.ZodIssueCode.custom,
                message: Y,
                params: {
                    received: A
                }
            })
        }
    })
})
// @from(Ln 47529, Col 4)
ax
// @from(Ln 47530, Col 4)
xw8 = v(() => {
    ax = ["PreToolUse", "PostToolUse", "PostToolUseFailure", "Notification", "UserPromptSubmit", "SessionStart", "SessionEnd", "Stop", "SubagentStart", "SubagentStop", "PreCompact", "PermissionRequest", "Setup", "TeammateIdle", "TaskCompleted"]
})
// @from(Ln 47533, Col 4)
bw8 = () => {}
// @from(Ln 47534, Col 4)
sw1 = v(() => {
    xw8();
    bw8()
})
// @from(Ln 47538, Col 4)
a$K
// @from(Ln 47538, Col 9)
s$K
// @from(Ln 47538, Col 14)
t$K
// @from(Ln 47538, Col 19)
uw8
// @from(Ln 47538, Col 24)
Bw8
// @from(Ln 47538, Col 29)
Xk