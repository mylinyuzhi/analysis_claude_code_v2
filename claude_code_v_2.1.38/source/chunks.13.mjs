
// @from(Ln 40932, Col 4)
cwK = () => {
    let A = {
        string: {
            unit: "אותיות",
            verb: "לכלול"
        },
        file: {
            unit: "בייטים",
            verb: "לכלול"
        },
        array: {
            unit: "פריטים",
            verb: "לכלול"
        },
        set: {
            unit: "פריטים",
            verb: "לכלול"
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
            regex: "קלט",
            email: "כתובת אימייל",
            url: "כתובת רשת",
            emoji: "אימוג'י",
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
            datetime: "תאריך וזמן ISO",
            date: "תאריך ISO",
            time: "זמן ISO",
            duration: "משך זמן ISO",
            ipv4: "כתובת IPv4",
            ipv6: "כתובת IPv6",
            cidrv4: "טווח IPv4",
            cidrv6: "טווח IPv6",
            base64: "מחרוזת בבסיס 64",
            base64url: "מחרוזת בבסיס 64 לכתובות רשת",
            json_string: "מחרוזת JSON",
            e164: "מספר E.164",
            jwt: "JWT",
            template_literal: "קלט"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `קלט לא תקין: צריך ${z.expected}, התקבל ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `קלט לא תקין: צריך ${Q7(z.values[0])}`;
                return `קלט לא תקין: צריך אחת מהאפשרויות  ${J8(z.values,"|")}`;
            case "too_big": {
                let w = z.inclusive ? "<=" : "<",
                    H = q(z.origin);
                if (H) return `גדול מדי: ${z.origin??"value"} צריך להיות ${w}${z.maximum.toString()} ${H.unit??"elements"}`;
                return `גדול מדי: ${z.origin??"value"} צריך להיות ${w}${z.maximum.toString()}`
            }
            case "too_small": {
                let w = z.inclusive ? ">=" : ">",
                    H = q(z.origin);
                if (H) return `קטן מדי: ${z.origin} צריך להיות ${w}${z.minimum.toString()} ${H.unit}`;
                return `קטן מדי: ${z.origin} צריך להיות ${w}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let w = z;
                if (w.format === "starts_with") return `מחרוזת לא תקינה: חייבת להתחיל ב"${w.prefix}"`;
                if (w.format === "ends_with") return `מחרוזת לא תקינה: חייבת להסתיים ב "${w.suffix}"`;
                if (w.format === "includes") return `מחרוזת לא תקינה: חייבת לכלול "${w.includes}"`;
                if (w.format === "regex") return `מחרוזת לא תקינה: חייבת להתאים לתבנית ${w.pattern}`;
                return `${Y[w.format]??z.format} לא תקין`
            }
            case "not_multiple_of":
                return `מספר לא תקין: חייב להיות מכפלה של ${z.divisor}`;
            case "unrecognized_keys":
                return `מפתח${z.keys.length>1?"ות":""} לא מזוה${z.keys.length>1?"ים":"ה"}: ${J8(z.keys,", ")}`;
            case "invalid_key":
                return `מפתח לא תקין ב${z.origin}`;
            case "invalid_union":
                return "קלט לא תקין";
            case "invalid_element":
                return `ערך לא תקין ב${z.origin}`;
            default:
                return "קלט לא תקין"
        }
    }
}
// @from(Ln 41040, Col 4)
H28 = v(() => {
    A3()
})
// @from(Ln 41044, Col 0)
function iu6() {
    return {
        localeError: lwK()
    }
}
// @from(Ln 41049, Col 4)
lwK = () => {
    let A = {
        string: {
            unit: "karakter",
            verb: "legyen"
        },
        file: {
            unit: "byte",
            verb: "legyen"
        },
        array: {
            unit: "elem",
            verb: "legyen"
        },
        set: {
            unit: "elem",
            verb: "legyen"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let w = typeof z;
            switch (w) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "szám";
                case "object": {
                    if (Array.isArray(z)) return "tömb";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return w
        },
        Y = {
            regex: "bemenet",
            email: "email cím",
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
            datetime: "ISO időbélyeg",
            date: "ISO dátum",
            time: "ISO idő",
            duration: "ISO időintervallum",
            ipv4: "IPv4 cím",
            ipv6: "IPv6 cím",
            cidrv4: "IPv4 tartomány",
            cidrv6: "IPv6 tartomány",
            base64: "base64-kódolt string",
            base64url: "base64url-kódolt string",
            json_string: "JSON string",
            e164: "E.164 szám",
            jwt: "JWT",
            template_literal: "bemenet"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `Érvénytelen bemenet: a várt érték ${z.expected}, a kapott érték ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `Érvénytelen bemenet: a várt érték ${Q7(z.values[0])}`;
                return `Érvénytelen opció: valamelyik érték várt ${J8(z.values,"|")}`;
            case "too_big": {
                let w = z.inclusive ? "<=" : "<",
                    H = q(z.origin);
                if (H) return `Túl nagy: ${z.origin??"érték"} mérete túl nagy ${w}${z.maximum.toString()} ${H.unit??"elem"}`;
                return `Túl nagy: a bemeneti érték ${z.origin??"érték"} túl nagy: ${w}${z.maximum.toString()}`
            }
            case "too_small": {
                let w = z.inclusive ? ">=" : ">",
                    H = q(z.origin);
                if (H) return `Túl kicsi: a bemeneti érték ${z.origin} mérete túl kicsi ${w}${z.minimum.toString()} ${H.unit}`;
                return `Túl kicsi: a bemeneti érték ${z.origin} túl kicsi ${w}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let w = z;
                if (w.format === "starts_with") return `Érvénytelen string: "${w.prefix}" értékkel kell kezdődnie`;
                if (w.format === "ends_with") return `Érvénytelen string: "${w.suffix}" értékkel kell végződnie`;
                if (w.format === "includes") return `Érvénytelen string: "${w.includes}" értéket kell tartalmaznia`;
                if (w.format === "regex") return `Érvénytelen string: ${w.pattern} mintának kell megfelelnie`;
                return `Érvénytelen ${Y[w.format]??z.format}`
            }
            case "not_multiple_of":
                return `Érvénytelen szám: ${z.divisor} többszörösének kell lennie`;
            case "unrecognized_keys":
                return `Ismeretlen kulcs${z.keys.length>1?"s":""}: ${J8(z.keys,", ")}`;
            case "invalid_key":
                return `Érvénytelen kulcs ${z.origin}`;
            case "invalid_union":
                return "Érvénytelen bemenet";
            case "invalid_element":
                return `Érvénytelen érték: ${z.origin}`;
            default:
                return "Érvénytelen bemenet"
        }
    }
}
// @from(Ln 41157, Col 4)
$28 = v(() => {
    A3()
})
// @from(Ln 41161, Col 0)
function nu6() {
    return {
        localeError: iwK()
    }
}
// @from(Ln 41166, Col 4)
iwK = () => {
    let A = {
        string: {
            unit: "karakter",
            verb: "memiliki"
        },
        file: {
            unit: "byte",
            verb: "memiliki"
        },
        array: {
            unit: "item",
            verb: "memiliki"
        },
        set: {
            unit: "item",
            verb: "memiliki"
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
            regex: "input",
            email: "alamat email",
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
            datetime: "tanggal dan waktu format ISO",
            date: "tanggal format ISO",
            time: "jam format ISO",
            duration: "durasi format ISO",
            ipv4: "alamat IPv4",
            ipv6: "alamat IPv6",
            cidrv4: "rentang alamat IPv4",
            cidrv6: "rentang alamat IPv6",
            base64: "string dengan enkode base64",
            base64url: "string dengan enkode base64url",
            json_string: "string JSON",
            e164: "angka E.164",
            jwt: "JWT",
            template_literal: "input"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `Input tidak valid: diharapkan ${z.expected}, diterima ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `Input tidak valid: diharapkan ${Q7(z.values[0])}`;
                return `Pilihan tidak valid: diharapkan salah satu dari ${J8(z.values,"|")}`;
            case "too_big": {
                let w = z.inclusive ? "<=" : "<",
                    H = q(z.origin);
                if (H) return `Terlalu besar: diharapkan ${z.origin??"value"} memiliki ${w}${z.maximum.toString()} ${H.unit??"elemen"}`;
                return `Terlalu besar: diharapkan ${z.origin??"value"} menjadi ${w}${z.maximum.toString()}`
            }
            case "too_small": {
                let w = z.inclusive ? ">=" : ">",
                    H = q(z.origin);
                if (H) return `Terlalu kecil: diharapkan ${z.origin} memiliki ${w}${z.minimum.toString()} ${H.unit}`;
                return `Terlalu kecil: diharapkan ${z.origin} menjadi ${w}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let w = z;
                if (w.format === "starts_with") return `String tidak valid: harus dimulai dengan "${w.prefix}"`;
                if (w.format === "ends_with") return `String tidak valid: harus berakhir dengan "${w.suffix}"`;
                if (w.format === "includes") return `String tidak valid: harus menyertakan "${w.includes}"`;
                if (w.format === "regex") return `String tidak valid: harus sesuai pola ${w.pattern}`;
                return `${Y[w.format]??z.format} tidak valid`
            }
            case "not_multiple_of":
                return `Angka tidak valid: harus kelipatan dari ${z.divisor}`;
            case "unrecognized_keys":
                return `Kunci tidak dikenali ${z.keys.length>1?"s":""}: ${J8(z.keys,", ")}`;
            case "invalid_key":
                return `Kunci tidak valid di ${z.origin}`;
            case "invalid_union":
                return "Input tidak valid";
            case "invalid_element":
                return `Nilai tidak valid di ${z.origin}`;
            default:
                return "Input tidak valid"
        }
    }
}
// @from(Ln 41274, Col 4)
O28 = v(() => {
    A3()
})
// @from(Ln 41278, Col 0)
function ru6() {
    return {
        localeError: nwK()
    }
}
// @from(Ln 41283, Col 4)
nwK = () => {
    let A = {
        string: {
            unit: "caratteri",
            verb: "avere"
        },
        file: {
            unit: "byte",
            verb: "avere"
        },
        array: {
            unit: "elementi",
            verb: "avere"
        },
        set: {
            unit: "elementi",
            verb: "avere"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let w = typeof z;
            switch (w) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "numero";
                case "object": {
                    if (Array.isArray(z)) return "vettore";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return w
        },
        Y = {
            regex: "input",
            email: "indirizzo email",
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
            datetime: "data e ora ISO",
            date: "data ISO",
            time: "ora ISO",
            duration: "durata ISO",
            ipv4: "indirizzo IPv4",
            ipv6: "indirizzo IPv6",
            cidrv4: "intervallo IPv4",
            cidrv6: "intervallo IPv6",
            base64: "stringa codificata in base64",
            base64url: "URL codificata in base64",
            json_string: "stringa JSON",
            e164: "numero E.164",
            jwt: "JWT",
            template_literal: "input"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `Input non valido: atteso ${z.expected}, ricevuto ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `Input non valido: atteso ${Q7(z.values[0])}`;
                return `Opzione non valida: atteso uno tra ${J8(z.values,"|")}`;
            case "too_big": {
                let w = z.inclusive ? "<=" : "<",
                    H = q(z.origin);
                if (H) return `Troppo grande: ${z.origin??"valore"} deve avere ${w}${z.maximum.toString()} ${H.unit??"elementi"}`;
                return `Troppo grande: ${z.origin??"valore"} deve essere ${w}${z.maximum.toString()}`
            }
            case "too_small": {
                let w = z.inclusive ? ">=" : ">",
                    H = q(z.origin);
                if (H) return `Troppo piccolo: ${z.origin} deve avere ${w}${z.minimum.toString()} ${H.unit}`;
                return `Troppo piccolo: ${z.origin} deve essere ${w}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let w = z;
                if (w.format === "starts_with") return `Stringa non valida: deve iniziare con "${w.prefix}"`;
                if (w.format === "ends_with") return `Stringa non valida: deve terminare con "${w.suffix}"`;
                if (w.format === "includes") return `Stringa non valida: deve includere "${w.includes}"`;
                if (w.format === "regex") return `Stringa non valida: deve corrispondere al pattern ${w.pattern}`;
                return `Invalid ${Y[w.format]??z.format}`
            }
            case "not_multiple_of":
                return `Numero non valido: deve essere un multiplo di ${z.divisor}`;
            case "unrecognized_keys":
                return `Chiav${z.keys.length>1?"i":"e"} non riconosciut${z.keys.length>1?"e":"a"}: ${J8(z.keys,", ")}`;
            case "invalid_key":
                return `Chiave non valida in ${z.origin}`;
            case "invalid_union":
                return "Input non valido";
            case "invalid_element":
                return `Valore non valido in ${z.origin}`;
            default:
                return "Input non valido"
        }
    }
}
// @from(Ln 41391, Col 4)
_28 = v(() => {
    A3()
})
// @from(Ln 41395, Col 0)
function ou6() {
    return {
        localeError: rwK()
    }
}
// @from(Ln 41400, Col 4)
rwK = () => {
    let A = {
        string: {
            unit: "文字",
            verb: "である"
        },
        file: {
            unit: "バイト",
            verb: "である"
        },
        array: {
            unit: "要素",
            verb: "である"
        },
        set: {
            unit: "要素",
            verb: "である"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let w = typeof z;
            switch (w) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "数値";
                case "object": {
                    if (Array.isArray(z)) return "配列";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return w
        },
        Y = {
            regex: "入力値",
            email: "メールアドレス",
            url: "URL",
            emoji: "絵文字",
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
            datetime: "ISO日時",
            date: "ISO日付",
            time: "ISO時刻",
            duration: "ISO期間",
            ipv4: "IPv4アドレス",
            ipv6: "IPv6アドレス",
            cidrv4: "IPv4範囲",
            cidrv6: "IPv6範囲",
            base64: "base64エンコード文字列",
            base64url: "base64urlエンコード文字列",
            json_string: "JSON文字列",
            e164: "E.164番号",
            jwt: "JWT",
            template_literal: "入力値"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `無効な入力: ${z.expected}が期待されましたが、${K(z.input)}が入力されました`;
            case "invalid_value":
                if (z.values.length === 1) return `無効な入力: ${Q7(z.values[0])}が期待されました`;
                return `無効な選択: ${J8(z.values,"、")}のいずれかである必要があります`;
            case "too_big": {
                let w = z.inclusive ? "以下である" : "より小さい",
                    H = q(z.origin);
                if (H) return `大きすぎる値: ${z.origin??"値"}は${z.maximum.toString()}${H.unit??"要素"}${w}必要があります`;
                return `大きすぎる値: ${z.origin??"値"}は${z.maximum.toString()}${w}必要があります`
            }
            case "too_small": {
                let w = z.inclusive ? "以上である" : "より大きい",
                    H = q(z.origin);
                if (H) return `小さすぎる値: ${z.origin}は${z.minimum.toString()}${H.unit}${w}必要があります`;
                return `小さすぎる値: ${z.origin}は${z.minimum.toString()}${w}必要があります`
            }
            case "invalid_format": {
                let w = z;
                if (w.format === "starts_with") return `無効な文字列: "${w.prefix}"で始まる必要があります`;
                if (w.format === "ends_with") return `無効な文字列: "${w.suffix}"で終わる必要があります`;
                if (w.format === "includes") return `無効な文字列: "${w.includes}"を含む必要があります`;
                if (w.format === "regex") return `無効な文字列: パターン${w.pattern}に一致する必要があります`;
                return `無効な${Y[w.format]??z.format}`
            }
            case "not_multiple_of":
                return `無効な数値: ${z.divisor}の倍数である必要があります`;
            case "unrecognized_keys":
                return `認識されていないキー${z.keys.length>1?"群":""}: ${J8(z.keys,"、")}`;
            case "invalid_key":
                return `${z.origin}内の無効なキー`;
            case "invalid_union":
                return "無効な入力";
            case "invalid_element":
                return `${z.origin}内の無効な値`;
            default:
                return "無効な入力"
        }
    }
}
// @from(Ln 41508, Col 4)
J28 = v(() => {
    A3()
})
// @from(Ln 41512, Col 0)
function au6() {
    return {
        localeError: owK()
    }
}
// @from(Ln 41517, Col 4)
owK = () => {
    let A = {
        string: {
            unit: "តួអក្សរ",
            verb: "គួរមាន"
        },
        file: {
            unit: "បៃ",
            verb: "គួរមាន"
        },
        array: {
            unit: "ធាតុ",
            verb: "គួរមាន"
        },
        set: {
            unit: "ធាតុ",
            verb: "គួរមាន"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let w = typeof z;
            switch (w) {
                case "number":
                    return Number.isNaN(z) ? "មិនមែនជាលេខ (NaN)" : "លេខ";
                case "object": {
                    if (Array.isArray(z)) return "អារេ (Array)";
                    if (z === null) return "គ្មានតម្លៃ (null)";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return w
        },
        Y = {
            regex: "ទិន្នន័យបញ្ចូល",
            email: "អាសយដ្ឋានអ៊ីមែល",
            url: "URL",
            emoji: "សញ្ញាអារម្មណ៍",
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
            datetime: "កាលបរិច្ឆេទ និងម៉ោង ISO",
            date: "កាលបរិច្ឆេទ ISO",
            time: "ម៉ោង ISO",
            duration: "រយៈពេល ISO",
            ipv4: "អាសយដ្ឋាន IPv4",
            ipv6: "អាសយដ្ឋាន IPv6",
            cidrv4: "ដែនអាសយដ្ឋាន IPv4",
            cidrv6: "ដែនអាសយដ្ឋាន IPv6",
            base64: "ខ្សែអក្សរអ៊ិកូដ base64",
            base64url: "ខ្សែអក្សរអ៊ិកូដ base64url",
            json_string: "ខ្សែអក្សរ JSON",
            e164: "លេខ E.164",
            jwt: "JWT",
            template_literal: "ទិន្នន័យបញ្ចូល"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ ${z.expected} ប៉ុន្តែទទួលបាន ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ ${Q7(z.values[0])}`;
                return `ជម្រើសមិនត្រឹមត្រូវ៖ ត្រូវជាមួយក្នុងចំណោម ${J8(z.values,"|")}`;
            case "too_big": {
                let w = z.inclusive ? "<=" : "<",
                    H = q(z.origin);
                if (H) return `ធំពេក៖ ត្រូវការ ${z.origin??"តម្លៃ"} ${w} ${z.maximum.toString()} ${H.unit??"ធាតុ"}`;
                return `ធំពេក៖ ត្រូវការ ${z.origin??"តម្លៃ"} ${w} ${z.maximum.toString()}`
            }
            case "too_small": {
                let w = z.inclusive ? ">=" : ">",
                    H = q(z.origin);
                if (H) return `តូចពេក៖ ត្រូវការ ${z.origin} ${w} ${z.minimum.toString()} ${H.unit}`;
                return `តូចពេក៖ ត្រូវការ ${z.origin} ${w} ${z.minimum.toString()}`
            }
            case "invalid_format": {
                let w = z;
                if (w.format === "starts_with") return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវចាប់ផ្តើមដោយ "${w.prefix}"`;
                if (w.format === "ends_with") return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវបញ្ចប់ដោយ "${w.suffix}"`;
                if (w.format === "includes") return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវមាន "${w.includes}"`;
                if (w.format === "regex") return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវតែផ្គូផ្គងនឹងទម្រង់ដែលបានកំណត់ ${w.pattern}`;
                return `មិនត្រឹមត្រូវ៖ ${Y[w.format]??z.format}`
            }
            case "not_multiple_of":
                return `លេខមិនត្រឹមត្រូវ៖ ត្រូវតែជាពហុគុណនៃ ${z.divisor}`;
            case "unrecognized_keys":
                return `រកឃើញសោមិនស្គាល់៖ ${J8(z.keys,", ")}`;
            case "invalid_key":
                return `សោមិនត្រឹមត្រូវនៅក្នុង ${z.origin}`;
            case "invalid_union":
                return "ទិន្នន័យមិនត្រឹមត្រូវ";
            case "invalid_element":
                return `ទិន្នន័យមិនត្រឹមត្រូវនៅក្នុង ${z.origin}`;
            default:
                return "ទិន្នន័យមិនត្រឹមត្រូវ"
        }
    }
}
// @from(Ln 41625, Col 4)
X28 = v(() => {
    A3()
})
// @from(Ln 41629, Col 0)
function su6() {
    return {
        localeError: awK()
    }
}
// @from(Ln 41634, Col 4)
awK = () => {
    let A = {
        string: {
            unit: "문자",
            verb: "to have"
        },
        file: {
            unit: "바이트",
            verb: "to have"
        },
        array: {
            unit: "개",
            verb: "to have"
        },
        set: {
            unit: "개",
            verb: "to have"
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
            regex: "입력",
            email: "이메일 주소",
            url: "URL",
            emoji: "이모지",
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
            datetime: "ISO 날짜시간",
            date: "ISO 날짜",
            time: "ISO 시간",
            duration: "ISO 기간",
            ipv4: "IPv4 주소",
            ipv6: "IPv6 주소",
            cidrv4: "IPv4 범위",
            cidrv6: "IPv6 범위",
            base64: "base64 인코딩 문자열",
            base64url: "base64url 인코딩 문자열",
            json_string: "JSON 문자열",
            e164: "E.164 번호",
            jwt: "JWT",
            template_literal: "입력"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `잘못된 입력: 예상 타입은 ${z.expected}, 받은 타입은 ${K(z.input)}입니다`;
            case "invalid_value":
                if (z.values.length === 1) return `잘못된 입력: 값은 ${Q7(z.values[0])} 이어야 합니다`;
                return `잘못된 옵션: ${J8(z.values,"또는 ")} 중 하나여야 합니다`;
            case "too_big": {
                let w = z.inclusive ? "이하" : "미만",
                    H = w === "미만" ? "이어야 합니다" : "여야 합니다",
                    $ = q(z.origin),
                    O = $?.unit ?? "요소";
                if ($) return `${z.origin??"값"}이 너무 큽니다: ${z.maximum.toString()}${O} ${w}${H}`;
                return `${z.origin??"값"}이 너무 큽니다: ${z.maximum.toString()} ${w}${H}`
            }
            case "too_small": {
                let w = z.inclusive ? "이상" : "초과",
                    H = w === "이상" ? "이어야 합니다" : "여야 합니다",
                    $ = q(z.origin),
                    O = $?.unit ?? "요소";
                if ($) return `${z.origin??"값"}이 너무 작습니다: ${z.minimum.toString()}${O} ${w}${H}`;
                return `${z.origin??"값"}이 너무 작습니다: ${z.minimum.toString()} ${w}${H}`
            }
            case "invalid_format": {
                let w = z;
                if (w.format === "starts_with") return `잘못된 문자열: "${w.prefix}"(으)로 시작해야 합니다`;
                if (w.format === "ends_with") return `잘못된 문자열: "${w.suffix}"(으)로 끝나야 합니다`;
                if (w.format === "includes") return `잘못된 문자열: "${w.includes}"을(를) 포함해야 합니다`;
                if (w.format === "regex") return `잘못된 문자열: 정규식 ${w.pattern} 패턴과 일치해야 합니다`;
                return `잘못된 ${Y[w.format]??z.format}`
            }
            case "not_multiple_of":
                return `잘못된 숫자: ${z.divisor}의 배수여야 합니다`;
            case "unrecognized_keys":
                return `인식할 수 없는 키: ${J8(z.keys,", ")}`;
            case "invalid_key":
                return `잘못된 키: ${z.origin}`;
            case "invalid_union":
                return "잘못된 입력";
            case "invalid_element":
                return `잘못된 값: ${z.origin}`;
            default:
                return "잘못된 입력"
        }
    }
}
// @from(Ln 41746, Col 4)
D28 = v(() => {
    A3()
})
// @from(Ln 41750, Col 0)
function tu6() {
    return {
        localeError: swK()
    }
}
// @from(Ln 41755, Col 4)
swK = () => {
    let A = {
        string: {
            unit: "знаци",
            verb: "да имаат"
        },
        file: {
            unit: "бајти",
            verb: "да имаат"
        },
        array: {
            unit: "ставки",
            verb: "да имаат"
        },
        set: {
            unit: "ставки",
            verb: "да имаат"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let w = typeof z;
            switch (w) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "број";
                case "object": {
                    if (Array.isArray(z)) return "низа";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return w
        },
        Y = {
            regex: "внес",
            email: "адреса на е-пошта",
            url: "URL",
            emoji: "емоџи",
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
            datetime: "ISO датум и време",
            date: "ISO датум",
            time: "ISO време",
            duration: "ISO времетраење",
            ipv4: "IPv4 адреса",
            ipv6: "IPv6 адреса",
            cidrv4: "IPv4 опсег",
            cidrv6: "IPv6 опсег",
            base64: "base64-енкодирана низа",
            base64url: "base64url-енкодирана низа",
            json_string: "JSON низа",
            e164: "E.164 број",
            jwt: "JWT",
            template_literal: "внес"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `Грешен внес: се очекува ${z.expected}, примено ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `Invalid input: expected ${Q7(z.values[0])}`;
                return `Грешана опција: се очекува една ${J8(z.values,"|")}`;
            case "too_big": {
                let w = z.inclusive ? "<=" : "<",
                    H = q(z.origin);
                if (H) return `Премногу голем: се очекува ${z.origin??"вредноста"} да има ${w}${z.maximum.toString()} ${H.unit??"елементи"}`;
                return `Премногу голем: се очекува ${z.origin??"вредноста"} да биде ${w}${z.maximum.toString()}`
            }
            case "too_small": {
                let w = z.inclusive ? ">=" : ">",
                    H = q(z.origin);
                if (H) return `Премногу мал: се очекува ${z.origin} да има ${w}${z.minimum.toString()} ${H.unit}`;
                return `Премногу мал: се очекува ${z.origin} да биде ${w}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let w = z;
                if (w.format === "starts_with") return `Неважечка низа: мора да започнува со "${w.prefix}"`;
                if (w.format === "ends_with") return `Неважечка низа: мора да завршува со "${w.suffix}"`;
                if (w.format === "includes") return `Неважечка низа: мора да вклучува "${w.includes}"`;
                if (w.format === "regex") return `Неважечка низа: мора да одгоара на патернот ${w.pattern}`;
                return `Invalid ${Y[w.format]??z.format}`
            }
            case "not_multiple_of":
                return `Грешен број: мора да биде делив со ${z.divisor}`;
            case "unrecognized_keys":
                return `${z.keys.length>1?"Непрепознаени клучеви":"Непрепознаен клуч"}: ${J8(z.keys,", ")}`;
            case "invalid_key":
                return `Грешен клуч во ${z.origin}`;
            case "invalid_union":
                return "Грешен внес";
            case "invalid_element":
                return `Грешна вредност во ${z.origin}`;
            default:
                return "Грешен внес"
        }
    }
}
// @from(Ln 41863, Col 4)
j28 = v(() => {
    A3()
})
// @from(Ln 41867, Col 0)
function eu6() {
    return {
        localeError: twK()
    }
}
// @from(Ln 41872, Col 4)
twK = () => {
    let A = {
        string: {
            unit: "aksara",
            verb: "mempunyai"
        },
        file: {
            unit: "bait",
            verb: "mempunyai"
        },
        array: {
            unit: "elemen",
            verb: "mempunyai"
        },
        set: {
            unit: "elemen",
            verb: "mempunyai"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let w = typeof z;
            switch (w) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "nombor";
                case "object": {
                    if (Array.isArray(z)) return "array";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return w
        },
        Y = {
            regex: "input",
            email: "alamat e-mel",
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
            datetime: "tarikh masa ISO",
            date: "tarikh ISO",
            time: "masa ISO",
            duration: "tempoh ISO",
            ipv4: "alamat IPv4",
            ipv6: "alamat IPv6",
            cidrv4: "julat IPv4",
            cidrv6: "julat IPv6",
            base64: "string dikodkan base64",
            base64url: "string dikodkan base64url",
            json_string: "string JSON",
            e164: "nombor E.164",
            jwt: "JWT",
            template_literal: "input"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `Input tidak sah: dijangka ${z.expected}, diterima ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `Input tidak sah: dijangka ${Q7(z.values[0])}`;
                return `Pilihan tidak sah: dijangka salah satu daripada ${J8(z.values,"|")}`;
            case "too_big": {
                let w = z.inclusive ? "<=" : "<",
                    H = q(z.origin);
                if (H) return `Terlalu besar: dijangka ${z.origin??"nilai"} ${H.verb} ${w}${z.maximum.toString()} ${H.unit??"elemen"}`;
                return `Terlalu besar: dijangka ${z.origin??"nilai"} adalah ${w}${z.maximum.toString()}`
            }
            case "too_small": {
                let w = z.inclusive ? ">=" : ">",
                    H = q(z.origin);
                if (H) return `Terlalu kecil: dijangka ${z.origin} ${H.verb} ${w}${z.minimum.toString()} ${H.unit}`;
                return `Terlalu kecil: dijangka ${z.origin} adalah ${w}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let w = z;
                if (w.format === "starts_with") return `String tidak sah: mesti bermula dengan "${w.prefix}"`;
                if (w.format === "ends_with") return `String tidak sah: mesti berakhir dengan "${w.suffix}"`;
                if (w.format === "includes") return `String tidak sah: mesti mengandungi "${w.includes}"`;
                if (w.format === "regex") return `String tidak sah: mesti sepadan dengan corak ${w.pattern}`;
                return `${Y[w.format]??z.format} tidak sah`
            }
            case "not_multiple_of":
                return `Nombor tidak sah: perlu gandaan ${z.divisor}`;
            case "unrecognized_keys":
                return `Kunci tidak dikenali: ${J8(z.keys,", ")}`;
            case "invalid_key":
                return `Kunci tidak sah dalam ${z.origin}`;
            case "invalid_union":
                return "Input tidak sah";
            case "invalid_element":
                return `Nilai tidak sah dalam ${z.origin}`;
            default:
                return "Input tidak sah"
        }
    }
}
// @from(Ln 41980, Col 4)
M28 = v(() => {
    A3()
})
// @from(Ln 41984, Col 0)
function AB6() {
    return {
        localeError: ewK()
    }
}
// @from(Ln 41989, Col 4)
ewK = () => {
    let A = {
        string: {
            unit: "tekens"
        },
        file: {
            unit: "bytes"
        },
        array: {
            unit: "elementen"
        },
        set: {
            unit: "elementen"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let w = typeof z;
            switch (w) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "getal";
                case "object": {
                    if (Array.isArray(z)) return "array";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return w
        },
        Y = {
            regex: "invoer",
            email: "emailadres",
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
            datetime: "ISO datum en tijd",
            date: "ISO datum",
            time: "ISO tijd",
            duration: "ISO duur",
            ipv4: "IPv4-adres",
            ipv6: "IPv6-adres",
            cidrv4: "IPv4-bereik",
            cidrv6: "IPv6-bereik",
            base64: "base64-gecodeerde tekst",
            base64url: "base64 URL-gecodeerde tekst",
            json_string: "JSON string",
            e164: "E.164-nummer",
            jwt: "JWT",
            template_literal: "invoer"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `Ongeldige invoer: verwacht ${z.expected}, ontving ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `Ongeldige invoer: verwacht ${Q7(z.values[0])}`;
                return `Ongeldige optie: verwacht één van ${J8(z.values,"|")}`;
            case "too_big": {
                let w = z.inclusive ? "<=" : "<",
                    H = q(z.origin);
                if (H) return `Te lang: verwacht dat ${z.origin??"waarde"} ${w}${z.maximum.toString()} ${H.unit??"elementen"} bevat`;
                return `Te lang: verwacht dat ${z.origin??"waarde"} ${w}${z.maximum.toString()} is`
            }
            case "too_small": {
                let w = z.inclusive ? ">=" : ">",
                    H = q(z.origin);
                if (H) return `Te kort: verwacht dat ${z.origin} ${w}${z.minimum.toString()} ${H.unit} bevat`;
                return `Te kort: verwacht dat ${z.origin} ${w}${z.minimum.toString()} is`
            }
            case "invalid_format": {
                let w = z;
                if (w.format === "starts_with") return `Ongeldige tekst: moet met "${w.prefix}" beginnen`;
                if (w.format === "ends_with") return `Ongeldige tekst: moet op "${w.suffix}" eindigen`;
                if (w.format === "includes") return `Ongeldige tekst: moet "${w.includes}" bevatten`;
                if (w.format === "regex") return `Ongeldige tekst: moet overeenkomen met patroon ${w.pattern}`;
                return `Ongeldig: ${Y[w.format]??z.format}`
            }
            case "not_multiple_of":
                return `Ongeldig getal: moet een veelvoud van ${z.divisor} zijn`;
            case "unrecognized_keys":
                return `Onbekende key${z.keys.length>1?"s":""}: ${J8(z.keys,", ")}`;
            case "invalid_key":
                return `Ongeldige key in ${z.origin}`;
            case "invalid_union":
                return "Ongeldige invoer";
            case "invalid_element":
                return `Ongeldige waarde in ${z.origin}`;
            default:
                return "Ongeldige invoer"
        }
    }
}
// @from(Ln 42093, Col 4)
P28 = v(() => {
    A3()
})
// @from(Ln 42097, Col 0)
function qB6() {
    return {
        localeError: AHK()
    }
}
// @from(Ln 42102, Col 4)
AHK = () => {
    let A = {
        string: {
            unit: "tegn",
            verb: "å ha"
        },
        file: {
            unit: "bytes",
            verb: "å ha"
        },
        array: {
            unit: "elementer",
            verb: "å inneholde"
        },
        set: {
            unit: "elementer",
            verb: "å inneholde"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let w = typeof z;
            switch (w) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "tall";
                case "object": {
                    if (Array.isArray(z)) return "liste";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return w
        },
        Y = {
            regex: "input",
            email: "e-postadresse",
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
            datetime: "ISO dato- og klokkeslett",
            date: "ISO-dato",
            time: "ISO-klokkeslett",
            duration: "ISO-varighet",
            ipv4: "IPv4-område",
            ipv6: "IPv6-område",
            cidrv4: "IPv4-spekter",
            cidrv6: "IPv6-spekter",
            base64: "base64-enkodet streng",
            base64url: "base64url-enkodet streng",
            json_string: "JSON-streng",
            e164: "E.164-nummer",
            jwt: "JWT",
            template_literal: "input"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `Ugyldig input: forventet ${z.expected}, fikk ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `Ugyldig verdi: forventet ${Q7(z.values[0])}`;
                return `Ugyldig valg: forventet en av ${J8(z.values,"|")}`;
            case "too_big": {
                let w = z.inclusive ? "<=" : "<",
                    H = q(z.origin);
                if (H) return `For stor(t): forventet ${z.origin??"value"} til å ha ${w}${z.maximum.toString()} ${H.unit??"elementer"}`;
                return `For stor(t): forventet ${z.origin??"value"} til å ha ${w}${z.maximum.toString()}`
            }
            case "too_small": {
                let w = z.inclusive ? ">=" : ">",
                    H = q(z.origin);
                if (H) return `For lite(n): forventet ${z.origin} til å ha ${w}${z.minimum.toString()} ${H.unit}`;
                return `For lite(n): forventet ${z.origin} til å ha ${w}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let w = z;
                if (w.format === "starts_with") return `Ugyldig streng: må starte med "${w.prefix}"`;
                if (w.format === "ends_with") return `Ugyldig streng: må ende med "${w.suffix}"`;
                if (w.format === "includes") return `Ugyldig streng: må inneholde "${w.includes}"`;
                if (w.format === "regex") return `Ugyldig streng: må matche mønsteret ${w.pattern}`;
                return `Ugyldig ${Y[w.format]??z.format}`
            }
            case "not_multiple_of":
                return `Ugyldig tall: må være et multiplum av ${z.divisor}`;
            case "unrecognized_keys":
                return `${z.keys.length>1?"Ukjente nøkler":"Ukjent nøkkel"}: ${J8(z.keys,", ")}`;
            case "invalid_key":
                return `Ugyldig nøkkel i ${z.origin}`;
            case "invalid_union":
                return "Ugyldig input";
            case "invalid_element":
                return `Ugyldig verdi i ${z.origin}`;
            default:
                return "Ugyldig input"
        }
    }
}
// @from(Ln 42210, Col 4)
W28 = v(() => {
    A3()
})
// @from(Ln 42214, Col 0)
function KB6() {
    return {
        localeError: qHK()
    }
}
// @from(Ln 42219, Col 4)
qHK = () => {
    let A = {
        string: {
            unit: "harf",
            verb: "olmalıdır"
        },
        file: {
            unit: "bayt",
            verb: "olmalıdır"
        },
        array: {
            unit: "unsur",
            verb: "olmalıdır"
        },
        set: {
            unit: "unsur",
            verb: "olmalıdır"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let w = typeof z;
            switch (w) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "numara";
                case "object": {
                    if (Array.isArray(z)) return "saf";
                    if (z === null) return "gayb";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return w
        },
        Y = {
            regex: "giren",
            email: "epostagâh",
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
            datetime: "ISO hengâmı",
            date: "ISO tarihi",
            time: "ISO zamanı",
            duration: "ISO müddeti",
            ipv4: "IPv4 nişânı",
            ipv6: "IPv6 nişânı",
            cidrv4: "IPv4 menzili",
            cidrv6: "IPv6 menzili",
            base64: "base64-şifreli metin",
            base64url: "base64url-şifreli metin",
            json_string: "JSON metin",
            e164: "E.164 sayısı",
            jwt: "JWT",
            template_literal: "giren"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `Fâsit giren: umulan ${z.expected}, alınan ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `Fâsit giren: umulan ${Q7(z.values[0])}`;
                return `Fâsit tercih: mûteberler ${J8(z.values,"|")}`;
            case "too_big": {
                let w = z.inclusive ? "<=" : "<",
                    H = q(z.origin);
                if (H) return `Fazla büyük: ${z.origin??"value"}, ${w}${z.maximum.toString()} ${H.unit??"elements"} sahip olmalıydı.`;
                return `Fazla büyük: ${z.origin??"value"}, ${w}${z.maximum.toString()} olmalıydı.`
            }
            case "too_small": {
                let w = z.inclusive ? ">=" : ">",
                    H = q(z.origin);
                if (H) return `Fazla küçük: ${z.origin}, ${w}${z.minimum.toString()} ${H.unit} sahip olmalıydı.`;
                return `Fazla küçük: ${z.origin}, ${w}${z.minimum.toString()} olmalıydı.`
            }
            case "invalid_format": {
                let w = z;
                if (w.format === "starts_with") return `Fâsit metin: "${w.prefix}" ile başlamalı.`;
                if (w.format === "ends_with") return `Fâsit metin: "${w.suffix}" ile bitmeli.`;
                if (w.format === "includes") return `Fâsit metin: "${w.includes}" ihtivâ etmeli.`;
                if (w.format === "regex") return `Fâsit metin: ${w.pattern} nakşına uymalı.`;
                return `Fâsit ${Y[w.format]??z.format}`
            }
            case "not_multiple_of":
                return `Fâsit sayı: ${z.divisor} katı olmalıydı.`;
            case "unrecognized_keys":
                return `Tanınmayan anahtar ${z.keys.length>1?"s":""}: ${J8(z.keys,", ")}`;
            case "invalid_key":
                return `${z.origin} için tanınmayan anahtar var.`;
            case "invalid_union":
                return "Giren tanınamadı.";
            case "invalid_element":
                return `${z.origin} için tanınmayan kıymet var.`;
            default:
                return "Kıymet tanınamadı."
        }
    }
}
// @from(Ln 42327, Col 4)
G28 = v(() => {
    A3()
})
// @from(Ln 42331, Col 0)
function YB6() {
    return {
        localeError: KHK()
    }
}
// @from(Ln 42336, Col 4)
KHK = () => {
    let A = {
        string: {
            unit: "توکي",
            verb: "ولري"
        },
        file: {
            unit: "بایټس",
            verb: "ولري"
        },
        array: {
            unit: "توکي",
            verb: "ولري"
        },
        set: {
            unit: "توکي",
            verb: "ولري"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let w = typeof z;
            switch (w) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "عدد";
                case "object": {
                    if (Array.isArray(z)) return "ارې";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return w
        },
        Y = {
            regex: "ورودي",
            email: "بریښنالیک",
            url: "یو آر ال",
            emoji: "ایموجي",
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
            datetime: "نیټه او وخت",
            date: "نېټه",
            time: "وخت",
            duration: "موده",
            ipv4: "د IPv4 پته",
            ipv6: "د IPv6 پته",
            cidrv4: "د IPv4 ساحه",
            cidrv6: "د IPv6 ساحه",
            base64: "base64-encoded متن",
            base64url: "base64url-encoded متن",
            json_string: "JSON متن",
            e164: "د E.164 شمېره",
            jwt: "JWT",
            template_literal: "ورودي"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `ناسم ورودي: باید ${z.expected} وای, مګر ${K(z.input)} ترلاسه شو`;
            case "invalid_value":
                if (z.values.length === 1) return `ناسم ورودي: باید ${Q7(z.values[0])} وای`;
                return `ناسم انتخاب: باید یو له ${J8(z.values,"|")} څخه وای`;
            case "too_big": {
                let w = z.inclusive ? "<=" : "<",
                    H = q(z.origin);
                if (H) return `ډیر لوی: ${z.origin??"ارزښت"} باید ${w}${z.maximum.toString()} ${H.unit??"عنصرونه"} ولري`;
                return `ډیر لوی: ${z.origin??"ارزښت"} باید ${w}${z.maximum.toString()} وي`
            }
            case "too_small": {
                let w = z.inclusive ? ">=" : ">",
                    H = q(z.origin);
                if (H) return `ډیر کوچنی: ${z.origin} باید ${w}${z.minimum.toString()} ${H.unit} ولري`;
                return `ډیر کوچنی: ${z.origin} باید ${w}${z.minimum.toString()} وي`
            }
            case "invalid_format": {
                let w = z;
                if (w.format === "starts_with") return `ناسم متن: باید د "${w.prefix}" سره پیل شي`;
                if (w.format === "ends_with") return `ناسم متن: باید د "${w.suffix}" سره پای ته ورسيږي`;
                if (w.format === "includes") return `ناسم متن: باید "${w.includes}" ولري`;
                if (w.format === "regex") return `ناسم متن: باید د ${w.pattern} سره مطابقت ولري`;
                return `${Y[w.format]??z.format} ناسم دی`
            }
            case "not_multiple_of":
                return `ناسم عدد: باید د ${z.divisor} مضرب وي`;
            case "unrecognized_keys":
                return `ناسم ${z.keys.length>1?"کلیډونه":"کلیډ"}: ${J8(z.keys,", ")}`;
            case "invalid_key":
                return `ناسم کلیډ په ${z.origin} کې`;
            case "invalid_union":
                return "ناسمه ورودي";
            case "invalid_element":
                return `ناسم عنصر په ${z.origin} کې`;
            default:
                return "ناسمه ورودي"
        }
    }
}
// @from(Ln 42444, Col 4)
Z28 = v(() => {
    A3()
})
// @from(Ln 42448, Col 0)
function zB6() {
    return {
        localeError: YHK()
    }
}
// @from(Ln 42453, Col 4)
YHK = () => {
    let A = {
        string: {
            unit: "znaków",
            verb: "mieć"
        },
        file: {
            unit: "bajtów",
            verb: "mieć"
        },
        array: {
            unit: "elementów",
            verb: "mieć"
        },
        set: {
            unit: "elementów",
            verb: "mieć"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let w = typeof z;
            switch (w) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "liczba";
                case "object": {
                    if (Array.isArray(z)) return "tablica";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return w
        },
        Y = {
            regex: "wyrażenie",
            email: "adres email",
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
            datetime: "data i godzina w formacie ISO",
            date: "data w formacie ISO",
            time: "godzina w formacie ISO",
            duration: "czas trwania ISO",
            ipv4: "adres IPv4",
            ipv6: "adres IPv6",
            cidrv4: "zakres IPv4",
            cidrv6: "zakres IPv6",
            base64: "ciąg znaków zakodowany w formacie base64",
            base64url: "ciąg znaków zakodowany w formacie base64url",
            json_string: "ciąg znaków w formacie JSON",
            e164: "liczba E.164",
            jwt: "JWT",
            template_literal: "wejście"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `Nieprawidłowe dane wejściowe: oczekiwano ${z.expected}, otrzymano ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `Nieprawidłowe dane wejściowe: oczekiwano ${Q7(z.values[0])}`;
                return `Nieprawidłowa opcja: oczekiwano jednej z wartości ${J8(z.values,"|")}`;
            case "too_big": {
                let w = z.inclusive ? "<=" : "<",
                    H = q(z.origin);
                if (H) return `Za duża wartość: oczekiwano, że ${z.origin??"wartość"} będzie mieć ${w}${z.maximum.toString()} ${H.unit??"elementów"}`;
                return `Zbyt duż(y/a/e): oczekiwano, że ${z.origin??"wartość"} będzie wynosić ${w}${z.maximum.toString()}`
            }
            case "too_small": {
                let w = z.inclusive ? ">=" : ">",
                    H = q(z.origin);
                if (H) return `Za mała wartość: oczekiwano, że ${z.origin??"wartość"} będzie mieć ${w}${z.minimum.toString()} ${H.unit??"elementów"}`;
                return `Zbyt mał(y/a/e): oczekiwano, że ${z.origin??"wartość"} będzie wynosić ${w}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let w = z;
                if (w.format === "starts_with") return `Nieprawidłowy ciąg znaków: musi zaczynać się od "${w.prefix}"`;
                if (w.format === "ends_with") return `Nieprawidłowy ciąg znaków: musi kończyć się na "${w.suffix}"`;
                if (w.format === "includes") return `Nieprawidłowy ciąg znaków: musi zawierać "${w.includes}"`;
                if (w.format === "regex") return `Nieprawidłowy ciąg znaków: musi odpowiadać wzorcowi ${w.pattern}`;
                return `Nieprawidłow(y/a/e) ${Y[w.format]??z.format}`
            }
            case "not_multiple_of":
                return `Nieprawidłowa liczba: musi być wielokrotnością ${z.divisor}`;
            case "unrecognized_keys":
                return `Nierozpoznane klucze${z.keys.length>1?"s":""}: ${J8(z.keys,", ")}`;
            case "invalid_key":
                return `Nieprawidłowy klucz w ${z.origin}`;
            case "invalid_union":
                return "Nieprawidłowe dane wejściowe";
            case "invalid_element":
                return `Nieprawidłowa wartość w ${z.origin}`;
            default:
                return "Nieprawidłowe dane wejściowe"
        }
    }
}
// @from(Ln 42561, Col 4)
f28 = v(() => {
    A3()
})
// @from(Ln 42565, Col 0)
function wB6() {
    return {
        localeError: zHK()
    }
}
// @from(Ln 42570, Col 4)
zHK = () => {
    let A = {
        string: {
            unit: "caracteres",
            verb: "ter"
        },
        file: {
            unit: "bytes",
            verb: "ter"
        },
        array: {
            unit: "itens",
            verb: "ter"
        },
        set: {
            unit: "itens",
            verb: "ter"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let w = typeof z;
            switch (w) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "número";
                case "object": {
                    if (Array.isArray(z)) return "array";
                    if (z === null) return "nulo";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return w
        },
        Y = {
            regex: "padrão",
            email: "endereço de e-mail",
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
            datetime: "data e hora ISO",
            date: "data ISO",
            time: "hora ISO",
            duration: "duração ISO",
            ipv4: "endereço IPv4",
            ipv6: "endereço IPv6",
            cidrv4: "faixa de IPv4",
            cidrv6: "faixa de IPv6",
            base64: "texto codificado em base64",
            base64url: "URL codificada em base64",
            json_string: "texto JSON",
            e164: "número E.164",
            jwt: "JWT",
            template_literal: "entrada"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `Tipo inválido: esperado ${z.expected}, recebido ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `Entrada inválida: esperado ${Q7(z.values[0])}`;
                return `Opção inválida: esperada uma das ${J8(z.values,"|")}`;
            case "too_big": {
                let w = z.inclusive ? "<=" : "<",
                    H = q(z.origin);
                if (H) return `Muito grande: esperado que ${z.origin??"valor"} tivesse ${w}${z.maximum.toString()} ${H.unit??"elementos"}`;
                return `Muito grande: esperado que ${z.origin??"valor"} fosse ${w}${z.maximum.toString()}`
            }
            case "too_small": {
                let w = z.inclusive ? ">=" : ">",
                    H = q(z.origin);
                if (H) return `Muito pequeno: esperado que ${z.origin} tivesse ${w}${z.minimum.toString()} ${H.unit}`;
                return `Muito pequeno: esperado que ${z.origin} fosse ${w}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let w = z;
                if (w.format === "starts_with") return `Texto inválido: deve começar com "${w.prefix}"`;
                if (w.format === "ends_with") return `Texto inválido: deve terminar com "${w.suffix}"`;
                if (w.format === "includes") return `Texto inválido: deve incluir "${w.includes}"`;
                if (w.format === "regex") return `Texto inválido: deve corresponder ao padrão ${w.pattern}`;
                return `${Y[w.format]??z.format} inválido`
            }
            case "not_multiple_of":
                return `Número inválido: deve ser múltiplo de ${z.divisor}`;
            case "unrecognized_keys":
                return `Chave${z.keys.length>1?"s":""} desconhecida${z.keys.length>1?"s":""}: ${J8(z.keys,", ")}`;
            case "invalid_key":
                return `Chave inválida em ${z.origin}`;
            case "invalid_union":
                return "Entrada inválida";
            case "invalid_element":
                return `Valor inválido em ${z.origin}`;
            default:
                return "Campo inválido"
        }
    }
}
// @from(Ln 42678, Col 4)
V28 = v(() => {
    A3()
})
// @from(Ln 42682, Col 0)
function N28(A, q, K, Y) {
    let z = Math.abs(A),
        w = z % 10,
        H = z % 100;
    if (H >= 11 && H <= 19) return Y;
    if (w === 1) return q;
    if (w >= 2 && w <= 4) return K;
    return Y
}
// @from(Ln 42692, Col 0)
function HB6() {
    return {
        localeError: wHK()
    }
}
// @from(Ln 42697, Col 4)
wHK = () => {
    let A = {
        string: {
            unit: {
                one: "символ",
                few: "символа",
                many: "символов"
            },
            verb: "иметь"
        },
        file: {
            unit: {
                one: "байт",
                few: "байта",
                many: "байт"
            },
            verb: "иметь"
        },
        array: {
            unit: {
                one: "элемент",
                few: "элемента",
                many: "элементов"
            },
            verb: "иметь"
        },
        set: {
            unit: {
                one: "элемент",
                few: "элемента",
                many: "элементов"
            },
            verb: "иметь"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let w = typeof z;
            switch (w) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "число";
                case "object": {
                    if (Array.isArray(z)) return "массив";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return w
        },
        Y = {
            regex: "ввод",
            email: "email адрес",
            url: "URL",
            emoji: "эмодзи",
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
            datetime: "ISO дата и время",
            date: "ISO дата",
            time: "ISO время",
            duration: "ISO длительность",
            ipv4: "IPv4 адрес",
            ipv6: "IPv6 адрес",
            cidrv4: "IPv4 диапазон",
            cidrv6: "IPv6 диапазон",
            base64: "строка в формате base64",
            base64url: "строка в формате base64url",
            json_string: "JSON строка",
            e164: "номер E.164",
            jwt: "JWT",
            template_literal: "ввод"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `Неверный ввод: ожидалось ${z.expected}, получено ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `Неверный ввод: ожидалось ${Q7(z.values[0])}`;
                return `Неверный вариант: ожидалось одно из ${J8(z.values,"|")}`;
            case "too_big": {
                let w = z.inclusive ? "<=" : "<",
                    H = q(z.origin);
                if (H) {
                    let $ = Number(z.maximum),
                        O = N28($, H.unit.one, H.unit.few, H.unit.many);
                    return `Слишком большое значение: ожидалось, что ${z.origin??"значение"} будет иметь ${w}${z.maximum.toString()} ${O}`
                }
                return `Слишком большое значение: ожидалось, что ${z.origin??"значение"} будет ${w}${z.maximum.toString()}`
            }
            case "too_small": {
                let w = z.inclusive ? ">=" : ">",
                    H = q(z.origin);
                if (H) {
                    let $ = Number(z.minimum),
                        O = N28($, H.unit.one, H.unit.few, H.unit.many);
                    return `Слишком маленькое значение: ожидалось, что ${z.origin} будет иметь ${w}${z.minimum.toString()} ${O}`
                }
                return `Слишком маленькое значение: ожидалось, что ${z.origin} будет ${w}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let w = z;
                if (w.format === "starts_with") return `Неверная строка: должна начинаться с "${w.prefix}"`;
                if (w.format === "ends_with") return `Неверная строка: должна заканчиваться на "${w.suffix}"`;
                if (w.format === "includes") return `Неверная строка: должна содержать "${w.includes}"`;
                if (w.format === "regex") return `Неверная строка: должна соответствовать шаблону ${w.pattern}`;
                return `Неверный ${Y[w.format]??z.format}`
            }
            case "not_multiple_of":
                return `Неверное число: должно быть кратным ${z.divisor}`;
            case "unrecognized_keys":
                return `Нераспознанн${z.keys.length>1?"ые":"ый"} ключ${z.keys.length>1?"и":""}: ${J8(z.keys,", ")}`;
            case "invalid_key":
                return `Неверный ключ в ${z.origin}`;
            case "invalid_union":
                return "Неверные входные данные";
            case "invalid_element":
                return `Неверное значение в ${z.origin}`;
            default:
                return "Неверные входные данные"
        }
    }
}
// @from(Ln 42829, Col 4)
T28 = v(() => {
    A3()
})
// @from(Ln 42833, Col 0)
function $B6() {
    return {
        localeError: HHK()
    }
}
// @from(Ln 42838, Col 4)
HHK = () => {
    let A = {
        string: {
            unit: "znakov",
            verb: "imeti"
        },
        file: {
            unit: "bajtov",
            verb: "imeti"
        },
        array: {
            unit: "elementov",
            verb: "imeti"
        },
        set: {
            unit: "elementov",
            verb: "imeti"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let w = typeof z;
            switch (w) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "število";
                case "object": {
                    if (Array.isArray(z)) return "tabela";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return w
        },
        Y = {
            regex: "vnos",
            email: "e-poštni naslov",
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
            datetime: "ISO datum in čas",
            date: "ISO datum",
            time: "ISO čas",
            duration: "ISO trajanje",
            ipv4: "IPv4 naslov",
            ipv6: "IPv6 naslov",
            cidrv4: "obseg IPv4",
            cidrv6: "obseg IPv6",
            base64: "base64 kodiran niz",
            base64url: "base64url kodiran niz",
            json_string: "JSON niz",
            e164: "E.164 številka",
            jwt: "JWT",
            template_literal: "vnos"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `Neveljaven vnos: pričakovano ${z.expected}, prejeto ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `Neveljaven vnos: pričakovano ${Q7(z.values[0])}`;
                return `Neveljavna možnost: pričakovano eno izmed ${J8(z.values,"|")}`;
            case "too_big": {
                let w = z.inclusive ? "<=" : "<",
                    H = q(z.origin);
                if (H) return `Preveliko: pričakovano, da bo ${z.origin??"vrednost"} imelo ${w}${z.maximum.toString()} ${H.unit??"elementov"}`;
                return `Preveliko: pričakovano, da bo ${z.origin??"vrednost"} ${w}${z.maximum.toString()}`
            }
            case "too_small": {
                let w = z.inclusive ? ">=" : ">",
                    H = q(z.origin);
                if (H) return `Premajhno: pričakovano, da bo ${z.origin} imelo ${w}${z.minimum.toString()} ${H.unit}`;
                return `Premajhno: pričakovano, da bo ${z.origin} ${w}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let w = z;
                if (w.format === "starts_with") return `Neveljaven niz: mora se začeti z "${w.prefix}"`;
                if (w.format === "ends_with") return `Neveljaven niz: mora se končati z "${w.suffix}"`;
                if (w.format === "includes") return `Neveljaven niz: mora vsebovati "${w.includes}"`;
                if (w.format === "regex") return `Neveljaven niz: mora ustrezati vzorcu ${w.pattern}`;
                return `Neveljaven ${Y[w.format]??z.format}`
            }
            case "not_multiple_of":
                return `Neveljavno število: mora biti večkratnik ${z.divisor}`;
            case "unrecognized_keys":
                return `Neprepoznan${z.keys.length>1?"i ključi":" ključ"}: ${J8(z.keys,", ")}`;
            case "invalid_key":
                return `Neveljaven ključ v ${z.origin}`;
            case "invalid_union":
                return "Neveljaven vnos";
            case "invalid_element":
                return `Neveljavna vrednost v ${z.origin}`;
            default:
                return "Neveljaven vnos"
        }
    }
}
// @from(Ln 42946, Col 4)
v28 = v(() => {
    A3()
})
// @from(Ln 42950, Col 0)
function OB6() {
    return {
        localeError: $HK()
    }
}
// @from(Ln 42955, Col 4)
$HK = () => {
    let A = {
        string: {
            unit: "tecken",
            verb: "att ha"
        },
        file: {
            unit: "bytes",
            verb: "att ha"
        },
        array: {
            unit: "objekt",
            verb: "att innehålla"
        },
        set: {
            unit: "objekt",
            verb: "att innehålla"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let w = typeof z;
            switch (w) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "antal";
                case "object": {
                    if (Array.isArray(z)) return "lista";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return w
        },
        Y = {
            regex: "reguljärt uttryck",
            email: "e-postadress",
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
            datetime: "ISO-datum och tid",
            date: "ISO-datum",
            time: "ISO-tid",
            duration: "ISO-varaktighet",
            ipv4: "IPv4-intervall",
            ipv6: "IPv6-intervall",
            cidrv4: "IPv4-spektrum",
            cidrv6: "IPv6-spektrum",
            base64: "base64-kodad sträng",
            base64url: "base64url-kodad sträng",
            json_string: "JSON-sträng",
            e164: "E.164-nummer",
            jwt: "JWT",
            template_literal: "mall-literal"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `Ogiltig inmatning: förväntat ${z.expected}, fick ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `Ogiltig inmatning: förväntat ${Q7(z.values[0])}`;
                return `Ogiltigt val: förväntade en av ${J8(z.values,"|")}`;
            case "too_big": {
                let w = z.inclusive ? "<=" : "<",
                    H = q(z.origin);
                if (H) return `För stor(t): förväntade ${z.origin??"värdet"} att ha ${w}${z.maximum.toString()} ${H.unit??"element"}`;
                return `För stor(t): förväntat ${z.origin??"värdet"} att ha ${w}${z.maximum.toString()}`
            }
            case "too_small": {
                let w = z.inclusive ? ">=" : ">",
                    H = q(z.origin);
                if (H) return `För lite(t): förväntade ${z.origin??"värdet"} att ha ${w}${z.minimum.toString()} ${H.unit}`;
                return `För lite(t): förväntade ${z.origin??"värdet"} att ha ${w}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let w = z;
                if (w.format === "starts_with") return `Ogiltig sträng: måste börja med "${w.prefix}"`;
                if (w.format === "ends_with") return `Ogiltig sträng: måste sluta med "${w.suffix}"`;
                if (w.format === "includes") return `Ogiltig sträng: måste innehålla "${w.includes}"`;
                if (w.format === "regex") return `Ogiltig sträng: måste matcha mönstret "${w.pattern}"`;
                return `Ogiltig(t) ${Y[w.format]??z.format}`
            }
            case "not_multiple_of":
                return `Ogiltigt tal: måste vara en multipel av ${z.divisor}`;
            case "unrecognized_keys":
                return `${z.keys.length>1?"Okända nycklar":"Okänd nyckel"}: ${J8(z.keys,", ")}`;
            case "invalid_key":
                return `Ogiltig nyckel i ${z.origin??"värdet"}`;
            case "invalid_union":
                return "Ogiltig input";
            case "invalid_element":
                return `Ogiltigt värde i ${z.origin??"värdet"}`;
            default:
                return "Ogiltig input"
        }
    }
}
// @from(Ln 43063, Col 4)
E28 = v(() => {
    A3()
})
// @from(Ln 43067, Col 0)
function _B6() {
    return {
        localeError: OHK()
    }
}
// @from(Ln 43072, Col 4)
OHK = () => {
    let A = {
        string: {
            unit: "எழுத்துக்கள்",
            verb: "கொண்டிருக்க வேண்டும்"
        },
        file: {
            unit: "பைட்டுகள்",
            verb: "கொண்டிருக்க வேண்டும்"
        },
        array: {
            unit: "உறுப்புகள்",
            verb: "கொண்டிருக்க வேண்டும்"
        },
        set: {
            unit: "உறுப்புகள்",
            verb: "கொண்டிருக்க வேண்டும்"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let w = typeof z;
            switch (w) {
                case "number":
                    return Number.isNaN(z) ? "எண் அல்லாதது" : "எண்";
                case "object": {
                    if (Array.isArray(z)) return "அணி";
                    if (z === null) return "வெறுமை";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return w
        },
        Y = {
            regex: "உள்ளீடு",
            email: "மின்னஞ்சல் முகவரி",
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
            datetime: "ISO தேதி நேரம்",
            date: "ISO தேதி",
            time: "ISO நேரம்",
            duration: "ISO கால அளவு",
            ipv4: "IPv4 முகவரி",
            ipv6: "IPv6 முகவரி",
            cidrv4: "IPv4 வரம்பு",
            cidrv6: "IPv6 வரம்பு",
            base64: "base64-encoded சரம்",
            base64url: "base64url-encoded சரம்",
            json_string: "JSON சரம்",
            e164: "E.164 எண்",
            jwt: "JWT",
            template_literal: "input"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${z.expected}, பெறப்பட்டது ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${Q7(z.values[0])}`;
                return `தவறான விருப்பம்: எதிர்பார்க்கப்பட்டது ${J8(z.values,"|")} இல் ஒன்று`;
            case "too_big": {
                let w = z.inclusive ? "<=" : "<",
                    H = q(z.origin);
                if (H) return `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${z.origin??"மதிப்பு"} ${w}${z.maximum.toString()} ${H.unit??"உறுப்புகள்"} ஆக இருக்க வேண்டும்`;
                return `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${z.origin??"மதிப்பு"} ${w}${z.maximum.toString()} ஆக இருக்க வேண்டும்`
            }
            case "too_small": {
                let w = z.inclusive ? ">=" : ">",
                    H = q(z.origin);
                if (H) return `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${z.origin} ${w}${z.minimum.toString()} ${H.unit} ஆக இருக்க வேண்டும்`;
                return `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${z.origin} ${w}${z.minimum.toString()} ஆக இருக்க வேண்டும்`
            }
            case "invalid_format": {
                let w = z;
                if (w.format === "starts_with") return `தவறான சரம்: "${w.prefix}" இல் தொடங்க வேண்டும்`;
                if (w.format === "ends_with") return `தவறான சரம்: "${w.suffix}" இல் முடிவடைய வேண்டும்`;
                if (w.format === "includes") return `தவறான சரம்: "${w.includes}" ஐ உள்ளடக்க வேண்டும்`;
                if (w.format === "regex") return `தவறான சரம்: ${w.pattern} முறைபாட்டுடன் பொருந்த வேண்டும்`;
                return `தவறான ${Y[w.format]??z.format}`
            }
            case "not_multiple_of":
                return `தவறான எண்: ${z.divisor} இன் பலமாக இருக்க வேண்டும்`;
            case "unrecognized_keys":
                return `அடையாளம் தெரியாத விசை${z.keys.length>1?"கள்":""}: ${J8(z.keys,", ")}`;
            case "invalid_key":
                return `${z.origin} இல் தவறான விசை`;
            case "invalid_union":
                return "தவறான உள்ளீடு";
            case "invalid_element":
                return `${z.origin} இல் தவறான மதிப்பு`;
            default:
                return "தவறான உள்ளீடு"
        }
    }
}
// @from(Ln 43180, Col 4)
k28 = v(() => {
    A3()
})
// @from(Ln 43184, Col 0)
function JB6() {
    return {
        localeError: _HK()
    }
}
// @from(Ln 43189, Col 4)
_HK = () => {
    let A = {
        string: {
            unit: "ตัวอักษร",
            verb: "ควรมี"
        },
        file: {
            unit: "ไบต์",
            verb: "ควรมี"
        },
        array: {
            unit: "รายการ",
            verb: "ควรมี"
        },
        set: {
            unit: "รายการ",
            verb: "ควรมี"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let w = typeof z;
            switch (w) {
                case "number":
                    return Number.isNaN(z) ? "ไม่ใช่ตัวเลข (NaN)" : "ตัวเลข";
                case "object": {
                    if (Array.isArray(z)) return "อาร์เรย์ (Array)";
                    if (z === null) return "ไม่มีค่า (null)";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return w
        },
        Y = {
            regex: "ข้อมูลที่ป้อน",
            email: "ที่อยู่อีเมล",
            url: "URL",
            emoji: "อิโมจิ",
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
            datetime: "วันที่เวลาแบบ ISO",
            date: "วันที่แบบ ISO",
            time: "เวลาแบบ ISO",
            duration: "ช่วงเวลาแบบ ISO",
            ipv4: "ที่อยู่ IPv4",
            ipv6: "ที่อยู่ IPv6",
            cidrv4: "ช่วง IP แบบ IPv4",
            cidrv6: "ช่วง IP แบบ IPv6",
            base64: "ข้อความแบบ Base64",
            base64url: "ข้อความแบบ Base64 สำหรับ URL",
            json_string: "ข้อความแบบ JSON",
            e164: "เบอร์โทรศัพท์ระหว่างประเทศ (E.164)",
            jwt: "โทเคน JWT",
            template_literal: "ข้อมูลที่ป้อน"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `ประเภทข้อมูลไม่ถูกต้อง: ควรเป็น ${z.expected} แต่ได้รับ ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `ค่าไม่ถูกต้อง: ควรเป็น ${Q7(z.values[0])}`;
                return `ตัวเลือกไม่ถูกต้อง: ควรเป็นหนึ่งใน ${J8(z.values,"|")}`;
            case "too_big": {
                let w = z.inclusive ? "ไม่เกิน" : "น้อยกว่า",
                    H = q(z.origin);
                if (H) return `เกินกำหนด: ${z.origin??"ค่า"} ควรมี${w} ${z.maximum.toString()} ${H.unit??"รายการ"}`;
                return `เกินกำหนด: ${z.origin??"ค่า"} ควรมี${w} ${z.maximum.toString()}`
            }
            case "too_small": {
                let w = z.inclusive ? "อย่างน้อย" : "มากกว่า",
                    H = q(z.origin);
                if (H) return `น้อยกว่ากำหนด: ${z.origin} ควรมี${w} ${z.minimum.toString()} ${H.unit}`;
                return `น้อยกว่ากำหนด: ${z.origin} ควรมี${w} ${z.minimum.toString()}`
            }
            case "invalid_format": {
                let w = z;
                if (w.format === "starts_with") return `รูปแบบไม่ถูกต้อง: ข้อความต้องขึ้นต้นด้วย "${w.prefix}"`;
                if (w.format === "ends_with") return `รูปแบบไม่ถูกต้อง: ข้อความต้องลงท้ายด้วย "${w.suffix}"`;
                if (w.format === "includes") return `รูปแบบไม่ถูกต้อง: ข้อความต้องมี "${w.includes}" อยู่ในข้อความ`;
                if (w.format === "regex") return `รูปแบบไม่ถูกต้อง: ต้องตรงกับรูปแบบที่กำหนด ${w.pattern}`;
                return `รูปแบบไม่ถูกต้อง: ${Y[w.format]??z.format}`
            }
            case "not_multiple_of":
                return `ตัวเลขไม่ถูกต้อง: ต้องเป็นจำนวนที่หารด้วย ${z.divisor} ได้ลงตัว`;
            case "unrecognized_keys":
                return `พบคีย์ที่ไม่รู้จัก: ${J8(z.keys,", ")}`;
            case "invalid_key":
                return `คีย์ไม่ถูกต้องใน ${z.origin}`;
            case "invalid_union":
                return "ข้อมูลไม่ถูกต้อง: ไม่ตรงกับรูปแบบยูเนียนที่กำหนดไว้";
            case "invalid_element":
                return `ข้อมูลไม่ถูกต้องใน ${z.origin}`;
            default:
                return "ข้อมูลไม่ถูกต้อง"
        }
    }
}
// @from(Ln 43297, Col 4)
L28 = v(() => {
    A3()
})
// @from(Ln 43301, Col 0)
function XB6() {
    return {
        localeError: XHK()
    }
}
// @from(Ln 43306, Col 4)
JHK = (A) => {
        let q = typeof A;
        switch (q) {
            case "number":
                return Number.isNaN(A) ? "NaN" : "number";
            case "object": {
                if (Array.isArray(A)) return "array";
                if (A === null) return "null";
                if (Object.getPrototypeOf(A) !== Object.prototype && A.constructor) return A.constructor.name
            }
        }
        return q
    }
// @from(Ln 43319, Col 4)
XHK = () => {
        let A = {
            string: {
                unit: "karakter",
                verb: "olmalı"
            },
            file: {
                unit: "bayt",
                verb: "olmalı"
            },
            array: {
                unit: "öğe",
                verb: "olmalı"
            },
            set: {
                unit: "öğe",
                verb: "olmalı"
            }
        };

        function q(Y) {
            return A[Y] ?? null
        }
        let K = {
            regex: "girdi",
            email: "e-posta adresi",
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
            datetime: "ISO tarih ve saat",
            date: "ISO tarih",
            time: "ISO saat",
            duration: "ISO süre",
            ipv4: "IPv4 adresi",
            ipv6: "IPv6 adresi",
            cidrv4: "IPv4 aralığı",
            cidrv6: "IPv6 aralığı",
            base64: "base64 ile şifrelenmiş metin",
            base64url: "base64url ile şifrelenmiş metin",
            json_string: "JSON dizesi",
            e164: "E.164 sayısı",
            jwt: "JWT",
            template_literal: "Şablon dizesi"
        };
        return (Y) => {
            switch (Y.code) {
                case "invalid_type":
                    return `Geçersiz değer: beklenen ${Y.expected}, alınan ${JHK(Y.input)}`;
                case "invalid_value":
                    if (Y.values.length === 1) return `Geçersiz değer: beklenen ${Q7(Y.values[0])}`;
                    return `Geçersiz seçenek: aşağıdakilerden biri olmalı: ${J8(Y.values,"|")}`;
                case "too_big": {
                    let z = Y.inclusive ? "<=" : "<",
                        w = q(Y.origin);
                    if (w) return `Çok büyük: beklenen ${Y.origin??"değer"} ${z}${Y.maximum.toString()} ${w.unit??"öğe"}`;
                    return `Çok büyük: beklenen ${Y.origin??"değer"} ${z}${Y.maximum.toString()}`
                }
                case "too_small": {
                    let z = Y.inclusive ? ">=" : ">",
                        w = q(Y.origin);
                    if (w) return `Çok küçük: beklenen ${Y.origin} ${z}${Y.minimum.toString()} ${w.unit}`;
                    return `Çok küçük: beklenen ${Y.origin} ${z}${Y.minimum.toString()}`
                }
                case "invalid_format": {
                    let z = Y;
                    if (z.format === "starts_with") return `Geçersiz metin: "${z.prefix}" ile başlamalı`;
                    if (z.format === "ends_with") return `Geçersiz metin: "${z.suffix}" ile bitmeli`;
                    if (z.format === "includes") return `Geçersiz metin: "${z.includes}" içermeli`;
                    if (z.format === "regex") return `Geçersiz metin: ${z.pattern} desenine uymalı`;
                    return `Geçersiz ${K[z.format]??Y.format}`
                }
                case "not_multiple_of":
                    return `Geçersiz sayı: ${Y.divisor} ile tam bölünebilmeli`;
                case "unrecognized_keys":
                    return `Tanınmayan anahtar${Y.keys.length>1?"lar":""}: ${J8(Y.keys,", ")}`;
                case "invalid_key":
                    return `${Y.origin} içinde geçersiz anahtar`;
                case "invalid_union":
                    return "Geçersiz değer";
                case "invalid_element":
                    return `${Y.origin} içinde geçersiz değer`;
                default:
                    return "Geçersiz değer"
            }
        }
    }
// @from(Ln 43414, Col 4)
R28 = v(() => {
    A3()
})
// @from(Ln 43418, Col 0)
function DB6() {
    return {
        localeError: DHK()
    }
}
// @from(Ln 43423, Col 4)
DHK = () => {
    let A = {
        string: {
            unit: "символів",
            verb: "матиме"
        },
        file: {
            unit: "байтів",
            verb: "матиме"
        },
        array: {
            unit: "елементів",
            verb: "матиме"
        },
        set: {
            unit: "елементів",
            verb: "матиме"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let w = typeof z;
            switch (w) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "число";
                case "object": {
                    if (Array.isArray(z)) return "масив";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return w
        },
        Y = {
            regex: "вхідні дані",
            email: "адреса електронної пошти",
            url: "URL",
            emoji: "емодзі",
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
            datetime: "дата та час ISO",
            date: "дата ISO",
            time: "час ISO",
            duration: "тривалість ISO",
            ipv4: "адреса IPv4",
            ipv6: "адреса IPv6",
            cidrv4: "діапазон IPv4",
            cidrv6: "діапазон IPv6",
            base64: "рядок у кодуванні base64",
            base64url: "рядок у кодуванні base64url",
            json_string: "рядок JSON",
            e164: "номер E.164",
            jwt: "JWT",
            template_literal: "вхідні дані"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `Неправильні вхідні дані: очікується ${z.expected}, отримано ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `Неправильні вхідні дані: очікується ${Q7(z.values[0])}`;
                return `Неправильна опція: очікується одне з ${J8(z.values,"|")}`;
            case "too_big": {
                let w = z.inclusive ? "<=" : "<",
                    H = q(z.origin);
                if (H) return `Занадто велике: очікується, що ${z.origin??"значення"} ${H.verb} ${w}${z.maximum.toString()} ${H.unit??"елементів"}`;
                return `Занадто велике: очікується, що ${z.origin??"значення"} буде ${w}${z.maximum.toString()}`
            }
            case "too_small": {
                let w = z.inclusive ? ">=" : ">",
                    H = q(z.origin);
                if (H) return `Занадто мале: очікується, що ${z.origin} ${H.verb} ${w}${z.minimum.toString()} ${H.unit}`;
                return `Занадто мале: очікується, що ${z.origin} буде ${w}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let w = z;
                if (w.format === "starts_with") return `Неправильний рядок: повинен починатися з "${w.prefix}"`;
                if (w.format === "ends_with") return `Неправильний рядок: повинен закінчуватися на "${w.suffix}"`;
                if (w.format === "includes") return `Неправильний рядок: повинен містити "${w.includes}"`;
                if (w.format === "regex") return `Неправильний рядок: повинен відповідати шаблону ${w.pattern}`;
                return `Неправильний ${Y[w.format]??z.format}`
            }
            case "not_multiple_of":
                return `Неправильне число: повинно бути кратним ${z.divisor}`;
            case "unrecognized_keys":
                return `Нерозпізнаний ключ${z.keys.length>1?"і":""}: ${J8(z.keys,", ")}`;
            case "invalid_key":
                return `Неправильний ключ у ${z.origin}`;
            case "invalid_union":
                return "Неправильні вхідні дані";
            case "invalid_element":
                return `Неправильне значення у ${z.origin}`;
            default:
                return "Неправильні вхідні дані"
        }
    }
}
// @from(Ln 43531, Col 4)
y28 = v(() => {
    A3()
})
// @from(Ln 43535, Col 0)
function jB6() {
    return {
        localeError: jHK()
    }
}
// @from(Ln 43540, Col 4)
jHK = () => {
    let A = {
        string: {
            unit: "حروف",
            verb: "ہونا"
        },
        file: {
            unit: "بائٹس",
            verb: "ہونا"
        },
        array: {
            unit: "آئٹمز",
            verb: "ہونا"
        },
        set: {
            unit: "آئٹمز",
            verb: "ہونا"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let w = typeof z;
            switch (w) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "نمبر";
                case "object": {
                    if (Array.isArray(z)) return "آرے";
                    if (z === null) return "نل";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return w
        },
        Y = {
            regex: "ان پٹ",
            email: "ای میل ایڈریس",
            url: "یو آر ایل",
            emoji: "ایموجی",
            uuid: "یو یو آئی ڈی",
            uuidv4: "یو یو آئی ڈی وی 4",
            uuidv6: "یو یو آئی ڈی وی 6",
            nanoid: "نینو آئی ڈی",
            guid: "جی یو آئی ڈی",
            cuid: "سی یو آئی ڈی",
            cuid2: "سی یو آئی ڈی 2",
            ulid: "یو ایل آئی ڈی",
            xid: "ایکس آئی ڈی",
            ksuid: "کے ایس یو آئی ڈی",
            datetime: "آئی ایس او ڈیٹ ٹائم",
            date: "آئی ایس او تاریخ",
            time: "آئی ایس او وقت",
            duration: "آئی ایس او مدت",
            ipv4: "آئی پی وی 4 ایڈریس",
            ipv6: "آئی پی وی 6 ایڈریس",
            cidrv4: "آئی پی وی 4 رینج",
            cidrv6: "آئی پی وی 6 رینج",
            base64: "بیس 64 ان کوڈڈ سٹرنگ",
            base64url: "بیس 64 یو آر ایل ان کوڈڈ سٹرنگ",
            json_string: "جے ایس او این سٹرنگ",
            e164: "ای 164 نمبر",
            jwt: "جے ڈبلیو ٹی",
            template_literal: "ان پٹ"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `غلط ان پٹ: ${z.expected} متوقع تھا، ${K(z.input)} موصول ہوا`;
            case "invalid_value":
                if (z.values.length === 1) return `غلط ان پٹ: ${Q7(z.values[0])} متوقع تھا`;
                return `غلط آپشن: ${J8(z.values,"|")} میں سے ایک متوقع تھا`;
            case "too_big": {
                let w = z.inclusive ? "<=" : "<",
                    H = q(z.origin);
                if (H) return `بہت بڑا: ${z.origin??"ویلیو"} کے ${w}${z.maximum.toString()} ${H.unit??"عناصر"} ہونے متوقع تھے`;
                return `بہت بڑا: ${z.origin??"ویلیو"} کا ${w}${z.maximum.toString()} ہونا متوقع تھا`
            }
            case "too_small": {
                let w = z.inclusive ? ">=" : ">",
                    H = q(z.origin);
                if (H) return `بہت چھوٹا: ${z.origin} کے ${w}${z.minimum.toString()} ${H.unit} ہونے متوقع تھے`;
                return `بہت چھوٹا: ${z.origin} کا ${w}${z.minimum.toString()} ہونا متوقع تھا`
            }
            case "invalid_format": {
                let w = z;
                if (w.format === "starts_with") return `غلط سٹرنگ: "${w.prefix}" سے شروع ہونا چاہیے`;
                if (w.format === "ends_with") return `غلط سٹرنگ: "${w.suffix}" پر ختم ہونا چاہیے`;
                if (w.format === "includes") return `غلط سٹرنگ: "${w.includes}" شامل ہونا چاہیے`;
                if (w.format === "regex") return `غلط سٹرنگ: پیٹرن ${w.pattern} سے میچ ہونا چاہیے`;
                return `غلط ${Y[w.format]??z.format}`
            }
            case "not_multiple_of":
                return `غلط نمبر: ${z.divisor} کا مضاعف ہونا چاہیے`;
            case "unrecognized_keys":
                return `غیر تسلیم شدہ کی${z.keys.length>1?"ز":""}: ${J8(z.keys,"، ")}`;
            case "invalid_key":
                return `${z.origin} میں غلط کی`;
            case "invalid_union":
                return "غلط ان پٹ";
            case "invalid_element":
                return `${z.origin} میں غلط ویلیو`;
            default:
                return "غلط ان پٹ"
        }
    }
}
// @from(Ln 43648, Col 4)
C28 = v(() => {
    A3()
})
// @from(Ln 43652, Col 0)
function MB6() {
    return {
        localeError: MHK()
    }
}