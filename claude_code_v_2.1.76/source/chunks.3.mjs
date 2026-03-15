
// @from(Ln 6963, Col 4)
prq = () => {
    let A = {
        string: {
            unit: "حرف",
            verb: "أن يحوي"
        },
        file: {
            unit: "بايت",
            verb: "أن يحوي"
        },
        array: {
            unit: "عنصر",
            verb: "أن يحوي"
        },
        set: {
            unit: "عنصر",
            verb: "أن يحوي"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let _ = typeof z;
            switch (_) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "number";
                case "object": {
                    if (Array.isArray(z)) return "array";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return _
        },
        Y = {
            regex: "مدخل",
            email: "بريد إلكتروني",
            url: "رابط",
            emoji: "إيموجي",
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
            datetime: "تاريخ ووقت بمعيار ISO",
            date: "تاريخ بمعيار ISO",
            time: "وقت بمعيار ISO",
            duration: "مدة بمعيار ISO",
            ipv4: "عنوان IPv4",
            ipv6: "عنوان IPv6",
            cidrv4: "مدى عناوين بصيغة IPv4",
            cidrv6: "مدى عناوين بصيغة IPv6",
            base64: "نَص بترميز base64-encoded",
            base64url: "نَص بترميز base64url-encoded",
            json_string: "نَص على هيئة JSON",
            e164: "رقم هاتف بمعيار E.164",
            jwt: "JWT",
            template_literal: "مدخل"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `مدخلات غير مقبولة: يفترض إدخال ${z.expected}، ولكن تم إدخال ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `مدخلات غير مقبولة: يفترض إدخال ${I7(z.values[0])}`;
                return `اختيار غير مقبول: يتوقع انتقاء أحد هذه الخيارات: ${_A(z.values,"|")}`;
            case "too_big": {
                let _ = z.inclusive ? "<=" : "<",
                    w = q(z.origin);
                if (w) return ` أكبر من اللازم: يفترض أن تكون ${z.origin??"القيمة"} ${_} ${z.maximum.toString()} ${w.unit??"عنصر"}`;
                return `أكبر من اللازم: يفترض أن تكون ${z.origin??"القيمة"} ${_} ${z.maximum.toString()}`
            }
            case "too_small": {
                let _ = z.inclusive ? ">=" : ">",
                    w = q(z.origin);
                if (w) return `أصغر من اللازم: يفترض لـ ${z.origin} أن يكون ${_} ${z.minimum.toString()} ${w.unit}`;
                return `أصغر من اللازم: يفترض لـ ${z.origin} أن يكون ${_} ${z.minimum.toString()}`
            }
            case "invalid_format": {
                let _ = z;
                if (_.format === "starts_with") return `نَص غير مقبول: يجب أن يبدأ بـ "${z.prefix}"`;
                if (_.format === "ends_with") return `نَص غير مقبول: يجب أن ينتهي بـ "${_.suffix}"`;
                if (_.format === "includes") return `نَص غير مقبول: يجب أن يتضمَّن "${_.includes}"`;
                if (_.format === "regex") return `نَص غير مقبول: يجب أن يطابق النمط ${_.pattern}`;
                return `${Y[_.format]??z.format} غير مقبول`
            }
            case "not_multiple_of":
                return `رقم غير مقبول: يجب أن يكون من مضاعفات ${z.divisor}`;
            case "unrecognized_keys":
                return `معرف${z.keys.length>1?"ات":""} غريب${z.keys.length>1?"ة":""}: ${_A(z.keys,"، ")}`;
            case "invalid_key":
                return `معرف غير مقبول في ${z.origin}`;
            case "invalid_union":
                return "مدخل غير مقبول";
            case "invalid_element":
                return `مدخل غير مقبول في ${z.origin}`;
            default:
                return "مدخل غير مقبول"
        }
    }
}
// @from(Ln 7071, Col 4)
L7A = E(() => {
    QK()
})
// @from(Ln 7075, Col 0)
function Rg1() {
    return {
        localeError: Qrq()
    }
}
// @from(Ln 7080, Col 4)
Qrq = () => {
    let A = {
        string: {
            unit: "simvol",
            verb: "olmalıdır"
        },
        file: {
            unit: "bayt",
            verb: "olmalıdır"
        },
        array: {
            unit: "element",
            verb: "olmalıdır"
        },
        set: {
            unit: "element",
            verb: "olmalıdır"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let _ = typeof z;
            switch (_) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "number";
                case "object": {
                    if (Array.isArray(z)) return "array";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return _
        },
        Y = {
            regex: "input",
            email: "email address",
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
            datetime: "ISO datetime",
            date: "ISO date",
            time: "ISO time",
            duration: "ISO duration",
            ipv4: "IPv4 address",
            ipv6: "IPv6 address",
            cidrv4: "IPv4 range",
            cidrv6: "IPv6 range",
            base64: "base64-encoded string",
            base64url: "base64url-encoded string",
            json_string: "JSON string",
            e164: "E.164 number",
            jwt: "JWT",
            template_literal: "input"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `Yanlış dəyər: gözlənilən ${z.expected}, daxil olan ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `Yanlış dəyər: gözlənilən ${I7(z.values[0])}`;
                return `Yanlış seçim: aşağıdakılardan biri olmalıdır: ${_A(z.values,"|")}`;
            case "too_big": {
                let _ = z.inclusive ? "<=" : "<",
                    w = q(z.origin);
                if (w) return `Çox böyük: gözlənilən ${z.origin??"dəyər"} ${_}${z.maximum.toString()} ${w.unit??"element"}`;
                return `Çox böyük: gözlənilən ${z.origin??"dəyər"} ${_}${z.maximum.toString()}`
            }
            case "too_small": {
                let _ = z.inclusive ? ">=" : ">",
                    w = q(z.origin);
                if (w) return `Çox kiçik: gözlənilən ${z.origin} ${_}${z.minimum.toString()} ${w.unit}`;
                return `Çox kiçik: gözlənilən ${z.origin} ${_}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let _ = z;
                if (_.format === "starts_with") return `Yanlış mətn: "${_.prefix}" ilə başlamalıdır`;
                if (_.format === "ends_with") return `Yanlış mətn: "${_.suffix}" ilə bitməlidir`;
                if (_.format === "includes") return `Yanlış mətn: "${_.includes}" daxil olmalıdır`;
                if (_.format === "regex") return `Yanlış mətn: ${_.pattern} şablonuna uyğun olmalıdır`;
                return `Yanlış ${Y[_.format]??z.format}`
            }
            case "not_multiple_of":
                return `Yanlış ədəd: ${z.divisor} ilə bölünə bilən olmalıdır`;
            case "unrecognized_keys":
                return `Tanınmayan açar${z.keys.length>1?"lar":""}: ${_A(z.keys,", ")}`;
            case "invalid_key":
                return `${z.origin} daxilində yanlış açar`;
            case "invalid_union":
                return "Yanlış dəyər";
            case "invalid_element":
                return `${z.origin} daxilində yanlış dəyər`;
            default:
                return "Yanlış dəyər"
        }
    }
}
// @from(Ln 7188, Col 4)
R7A = E(() => {
    QK()
})
// @from(Ln 7192, Col 0)
function h7A(A, q, K, Y) {
    let z = Math.abs(A),
        _ = z % 10,
        w = z % 100;
    if (w >= 11 && w <= 19) return Y;
    if (_ === 1) return q;
    if (_ >= 2 && _ <= 4) return K;
    return Y
}
// @from(Ln 7202, Col 0)
function hg1() {
    return {
        localeError: Urq()
    }
}
// @from(Ln 7207, Col 4)
Urq = () => {
    let A = {
        string: {
            unit: {
                one: "сімвал",
                few: "сімвалы",
                many: "сімвалаў"
            },
            verb: "мець"
        },
        array: {
            unit: {
                one: "элемент",
                few: "элементы",
                many: "элементаў"
            },
            verb: "мець"
        },
        set: {
            unit: {
                one: "элемент",
                few: "элементы",
                many: "элементаў"
            },
            verb: "мець"
        },
        file: {
            unit: {
                one: "байт",
                few: "байты",
                many: "байтаў"
            },
            verb: "мець"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let _ = typeof z;
            switch (_) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "лік";
                case "object": {
                    if (Array.isArray(z)) return "масіў";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return _
        },
        Y = {
            regex: "увод",
            email: "email адрас",
            url: "URL",
            emoji: "эмодзі",
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
            datetime: "ISO дата і час",
            date: "ISO дата",
            time: "ISO час",
            duration: "ISO працягласць",
            ipv4: "IPv4 адрас",
            ipv6: "IPv6 адрас",
            cidrv4: "IPv4 дыяпазон",
            cidrv6: "IPv6 дыяпазон",
            base64: "радок у фармаце base64",
            base64url: "радок у фармаце base64url",
            json_string: "JSON радок",
            e164: "нумар E.164",
            jwt: "JWT",
            template_literal: "увод"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `Няправільны ўвод: чакаўся ${z.expected}, атрымана ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `Няправільны ўвод: чакалася ${I7(z.values[0])}`;
                return `Няправільны варыянт: чакаўся адзін з ${_A(z.values,"|")}`;
            case "too_big": {
                let _ = z.inclusive ? "<=" : "<",
                    w = q(z.origin);
                if (w) {
                    let O = Number(z.maximum),
                        $ = h7A(O, w.unit.one, w.unit.few, w.unit.many);
                    return `Занадта вялікі: чакалася, што ${z.origin??"значэнне"} павінна ${w.verb} ${_}${z.maximum.toString()} ${$}`
                }
                return `Занадта вялікі: чакалася, што ${z.origin??"значэнне"} павінна быць ${_}${z.maximum.toString()}`
            }
            case "too_small": {
                let _ = z.inclusive ? ">=" : ">",
                    w = q(z.origin);
                if (w) {
                    let O = Number(z.minimum),
                        $ = h7A(O, w.unit.one, w.unit.few, w.unit.many);
                    return `Занадта малы: чакалася, што ${z.origin} павінна ${w.verb} ${_}${z.minimum.toString()} ${$}`
                }
                return `Занадта малы: чакалася, што ${z.origin} павінна быць ${_}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let _ = z;
                if (_.format === "starts_with") return `Няправільны радок: павінен пачынацца з "${_.prefix}"`;
                if (_.format === "ends_with") return `Няправільны радок: павінен заканчвацца на "${_.suffix}"`;
                if (_.format === "includes") return `Няправільны радок: павінен змяшчаць "${_.includes}"`;
                if (_.format === "regex") return `Няправільны радок: павінен адпавядаць шаблону ${_.pattern}`;
                return `Няправільны ${Y[_.format]??z.format}`
            }
            case "not_multiple_of":
                return `Няправільны лік: павінен быць кратным ${z.divisor}`;
            case "unrecognized_keys":
                return `Нераспазнаны ${z.keys.length>1?"ключы":"ключ"}: ${_A(z.keys,", ")}`;
            case "invalid_key":
                return `Няправільны ключ у ${z.origin}`;
            case "invalid_union":
                return "Няправільны ўвод";
            case "invalid_element":
                return `Няправільнае значэнне ў ${z.origin}`;
            default:
                return "Няправільны ўвод"
        }
    }
}
// @from(Ln 7339, Col 4)
S7A = E(() => {
    QK()
})
// @from(Ln 7343, Col 0)
function Sg1() {
    return {
        localeError: drq()
    }
}
// @from(Ln 7348, Col 4)
drq = () => {
    let A = {
        string: {
            unit: "caràcters",
            verb: "contenir"
        },
        file: {
            unit: "bytes",
            verb: "contenir"
        },
        array: {
            unit: "elements",
            verb: "contenir"
        },
        set: {
            unit: "elements",
            verb: "contenir"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let _ = typeof z;
            switch (_) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "number";
                case "object": {
                    if (Array.isArray(z)) return "array";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return _
        },
        Y = {
            regex: "entrada",
            email: "adreça electrònica",
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
            datetime: "data i hora ISO",
            date: "data ISO",
            time: "hora ISO",
            duration: "durada ISO",
            ipv4: "adreça IPv4",
            ipv6: "adreça IPv6",
            cidrv4: "rang IPv4",
            cidrv6: "rang IPv6",
            base64: "cadena codificada en base64",
            base64url: "cadena codificada en base64url",
            json_string: "cadena JSON",
            e164: "número E.164",
            jwt: "JWT",
            template_literal: "entrada"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `Tipus invàlid: s'esperava ${z.expected}, s'ha rebut ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `Valor invàlid: s'esperava ${I7(z.values[0])}`;
                return `Opció invàlida: s'esperava una de ${_A(z.values," o ")}`;
            case "too_big": {
                let _ = z.inclusive ? "com a màxim" : "menys de",
                    w = q(z.origin);
                if (w) return `Massa gran: s'esperava que ${z.origin??"el valor"} contingués ${_} ${z.maximum.toString()} ${w.unit??"elements"}`;
                return `Massa gran: s'esperava que ${z.origin??"el valor"} fos ${_} ${z.maximum.toString()}`
            }
            case "too_small": {
                let _ = z.inclusive ? "com a mínim" : "més de",
                    w = q(z.origin);
                if (w) return `Massa petit: s'esperava que ${z.origin} contingués ${_} ${z.minimum.toString()} ${w.unit}`;
                return `Massa petit: s'esperava que ${z.origin} fos ${_} ${z.minimum.toString()}`
            }
            case "invalid_format": {
                let _ = z;
                if (_.format === "starts_with") return `Format invàlid: ha de començar amb "${_.prefix}"`;
                if (_.format === "ends_with") return `Format invàlid: ha d'acabar amb "${_.suffix}"`;
                if (_.format === "includes") return `Format invàlid: ha d'incloure "${_.includes}"`;
                if (_.format === "regex") return `Format invàlid: ha de coincidir amb el patró ${_.pattern}`;
                return `Format invàlid per a ${Y[_.format]??z.format}`
            }
            case "not_multiple_of":
                return `Número invàlid: ha de ser múltiple de ${z.divisor}`;
            case "unrecognized_keys":
                return `Clau${z.keys.length>1?"s":""} no reconeguda${z.keys.length>1?"s":""}: ${_A(z.keys,", ")}`;
            case "invalid_key":
                return `Clau invàlida a ${z.origin}`;
            case "invalid_union":
                return "Entrada invàlida";
            case "invalid_element":
                return `Element invàlid a ${z.origin}`;
            default:
                return "Entrada invàlida"
        }
    }
}
// @from(Ln 7456, Col 4)
C7A = E(() => {
    QK()
})
// @from(Ln 7460, Col 0)
function Cg1() {
    return {
        localeError: crq()
    }
}
// @from(Ln 7465, Col 4)
crq = () => {
    let A = {
        string: {
            unit: "znaků",
            verb: "mít"
        },
        file: {
            unit: "bajtů",
            verb: "mít"
        },
        array: {
            unit: "prvků",
            verb: "mít"
        },
        set: {
            unit: "prvků",
            verb: "mít"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let _ = typeof z;
            switch (_) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "číslo";
                case "string":
                    return "řetězec";
                case "boolean":
                    return "boolean";
                case "bigint":
                    return "bigint";
                case "function":
                    return "funkce";
                case "symbol":
                    return "symbol";
                case "undefined":
                    return "undefined";
                case "object": {
                    if (Array.isArray(z)) return "pole";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return _
        },
        Y = {
            regex: "regulární výraz",
            email: "e-mailová adresa",
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
            datetime: "datum a čas ve formátu ISO",
            date: "datum ve formátu ISO",
            time: "čas ve formátu ISO",
            duration: "doba trvání ISO",
            ipv4: "IPv4 adresa",
            ipv6: "IPv6 adresa",
            cidrv4: "rozsah IPv4",
            cidrv6: "rozsah IPv6",
            base64: "řetězec zakódovaný ve formátu base64",
            base64url: "řetězec zakódovaný ve formátu base64url",
            json_string: "řetězec ve formátu JSON",
            e164: "číslo E.164",
            jwt: "JWT",
            template_literal: "vstup"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `Neplatný vstup: očekáváno ${z.expected}, obdrženo ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `Neplatný vstup: očekáváno ${I7(z.values[0])}`;
                return `Neplatná možnost: očekávána jedna z hodnot ${_A(z.values,"|")}`;
            case "too_big": {
                let _ = z.inclusive ? "<=" : "<",
                    w = q(z.origin);
                if (w) return `Hodnota je příliš velká: ${z.origin??"hodnota"} musí mít ${_}${z.maximum.toString()} ${w.unit??"prvků"}`;
                return `Hodnota je příliš velká: ${z.origin??"hodnota"} musí být ${_}${z.maximum.toString()}`
            }
            case "too_small": {
                let _ = z.inclusive ? ">=" : ">",
                    w = q(z.origin);
                if (w) return `Hodnota je příliš malá: ${z.origin??"hodnota"} musí mít ${_}${z.minimum.toString()} ${w.unit??"prvků"}`;
                return `Hodnota je příliš malá: ${z.origin??"hodnota"} musí být ${_}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let _ = z;
                if (_.format === "starts_with") return `Neplatný řetězec: musí začínat na "${_.prefix}"`;
                if (_.format === "ends_with") return `Neplatný řetězec: musí končit na "${_.suffix}"`;
                if (_.format === "includes") return `Neplatný řetězec: musí obsahovat "${_.includes}"`;
                if (_.format === "regex") return `Neplatný řetězec: musí odpovídat vzoru ${_.pattern}`;
                return `Neplatný formát ${Y[_.format]??z.format}`
            }
            case "not_multiple_of":
                return `Neplatné číslo: musí být násobkem ${z.divisor}`;
            case "unrecognized_keys":
                return `Neznámé klíče: ${_A(z.keys,", ")}`;
            case "invalid_key":
                return `Neplatný klíč v ${z.origin}`;
            case "invalid_union":
                return "Neplatný vstup";
            case "invalid_element":
                return `Neplatná hodnota v ${z.origin}`;
            default:
                return "Neplatný vstup"
        }
    }
}
// @from(Ln 7585, Col 4)
I7A = E(() => {
    QK()
})
// @from(Ln 7589, Col 0)
function Ig1() {
    return {
        localeError: lrq()
    }
}
// @from(Ln 7594, Col 4)
lrq = () => {
    let A = {
        string: {
            unit: "Zeichen",
            verb: "zu haben"
        },
        file: {
            unit: "Bytes",
            verb: "zu haben"
        },
        array: {
            unit: "Elemente",
            verb: "zu haben"
        },
        set: {
            unit: "Elemente",
            verb: "zu haben"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let _ = typeof z;
            switch (_) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "Zahl";
                case "object": {
                    if (Array.isArray(z)) return "Array";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return _
        },
        Y = {
            regex: "Eingabe",
            email: "E-Mail-Adresse",
            url: "URL",
            emoji: "Emoji",
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
            datetime: "ISO-Datum und -Uhrzeit",
            date: "ISO-Datum",
            time: "ISO-Uhrzeit",
            duration: "ISO-Dauer",
            ipv4: "IPv4-Adresse",
            ipv6: "IPv6-Adresse",
            cidrv4: "IPv4-Bereich",
            cidrv6: "IPv6-Bereich",
            base64: "Base64-codierter String",
            base64url: "Base64-URL-codierter String",
            json_string: "JSON-String",
            e164: "E.164-Nummer",
            jwt: "JWT",
            template_literal: "Eingabe"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `Ungültige Eingabe: erwartet ${z.expected}, erhalten ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `Ungültige Eingabe: erwartet ${I7(z.values[0])}`;
                return `Ungültige Option: erwartet eine von ${_A(z.values,"|")}`;
            case "too_big": {
                let _ = z.inclusive ? "<=" : "<",
                    w = q(z.origin);
                if (w) return `Zu groß: erwartet, dass ${z.origin??"Wert"} ${_}${z.maximum.toString()} ${w.unit??"Elemente"} hat`;
                return `Zu groß: erwartet, dass ${z.origin??"Wert"} ${_}${z.maximum.toString()} ist`
            }
            case "too_small": {
                let _ = z.inclusive ? ">=" : ">",
                    w = q(z.origin);
                if (w) return `Zu klein: erwartet, dass ${z.origin} ${_}${z.minimum.toString()} ${w.unit} hat`;
                return `Zu klein: erwartet, dass ${z.origin} ${_}${z.minimum.toString()} ist`
            }
            case "invalid_format": {
                let _ = z;
                if (_.format === "starts_with") return `Ungültiger String: muss mit "${_.prefix}" beginnen`;
                if (_.format === "ends_with") return `Ungültiger String: muss mit "${_.suffix}" enden`;
                if (_.format === "includes") return `Ungültiger String: muss "${_.includes}" enthalten`;
                if (_.format === "regex") return `Ungültiger String: muss dem Muster ${_.pattern} entsprechen`;
                return `Ungültig: ${Y[_.format]??z.format}`
            }
            case "not_multiple_of":
                return `Ungültige Zahl: muss ein Vielfaches von ${z.divisor} sein`;
            case "unrecognized_keys":
                return `${z.keys.length>1?"Unbekannte Schlüssel":"Unbekannter Schlüssel"}: ${_A(z.keys,", ")}`;
            case "invalid_key":
                return `Ungültiger Schlüssel in ${z.origin}`;
            case "invalid_union":
                return "Ungültige Eingabe";
            case "invalid_element":
                return `Ungültiger Wert in ${z.origin}`;
            default:
                return "Ungültige Eingabe"
        }
    }
}
// @from(Ln 7702, Col 4)
b7A = E(() => {
    QK()
})
// @from(Ln 7706, Col 0)
function kE6() {
    return {
        localeError: nrq()
    }
}
// @from(Ln 7711, Col 4)
irq = (A) => {
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
// @from(Ln 7724, Col 4)
nrq = () => {
        let A = {
            string: {
                unit: "characters",
                verb: "to have"
            },
            file: {
                unit: "bytes",
                verb: "to have"
            },
            array: {
                unit: "items",
                verb: "to have"
            },
            set: {
                unit: "items",
                verb: "to have"
            }
        };

        function q(Y) {
            return A[Y] ?? null
        }
        let K = {
            regex: "input",
            email: "email address",
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
            datetime: "ISO datetime",
            date: "ISO date",
            time: "ISO time",
            duration: "ISO duration",
            ipv4: "IPv4 address",
            ipv6: "IPv6 address",
            cidrv4: "IPv4 range",
            cidrv6: "IPv6 range",
            base64: "base64-encoded string",
            base64url: "base64url-encoded string",
            json_string: "JSON string",
            e164: "E.164 number",
            jwt: "JWT",
            template_literal: "input"
        };
        return (Y) => {
            switch (Y.code) {
                case "invalid_type":
                    return `Invalid input: expected ${Y.expected}, received ${irq(Y.input)}`;
                case "invalid_value":
                    if (Y.values.length === 1) return `Invalid input: expected ${I7(Y.values[0])}`;
                    return `Invalid option: expected one of ${_A(Y.values,"|")}`;
                case "too_big": {
                    let z = Y.inclusive ? "<=" : "<",
                        _ = q(Y.origin);
                    if (_) return `Too big: expected ${Y.origin??"value"} to have ${z}${Y.maximum.toString()} ${_.unit??"elements"}`;
                    return `Too big: expected ${Y.origin??"value"} to be ${z}${Y.maximum.toString()}`
                }
                case "too_small": {
                    let z = Y.inclusive ? ">=" : ">",
                        _ = q(Y.origin);
                    if (_) return `Too small: expected ${Y.origin} to have ${z}${Y.minimum.toString()} ${_.unit}`;
                    return `Too small: expected ${Y.origin} to be ${z}${Y.minimum.toString()}`
                }
                case "invalid_format": {
                    let z = Y;
                    if (z.format === "starts_with") return `Invalid string: must start with "${z.prefix}"`;
                    if (z.format === "ends_with") return `Invalid string: must end with "${z.suffix}"`;
                    if (z.format === "includes") return `Invalid string: must include "${z.includes}"`;
                    if (z.format === "regex") return `Invalid string: must match pattern ${z.pattern}`;
                    return `Invalid ${K[z.format]??Y.format}`
                }
                case "not_multiple_of":
                    return `Invalid number: must be a multiple of ${Y.divisor}`;
                case "unrecognized_keys":
                    return `Unrecognized key${Y.keys.length>1?"s":""}: ${_A(Y.keys,", ")}`;
                case "invalid_key":
                    return `Invalid key in ${Y.origin}`;
                case "invalid_union":
                    return "Invalid input";
                case "invalid_element":
                    return `Invalid value in ${Y.origin}`;
                default:
                    return "Invalid input"
            }
        }
    }
// @from(Ln 7819, Col 4)
bg1 = E(() => {
    QK()
})
// @from(Ln 7823, Col 0)
function xg1() {
    return {
        localeError: orq()
    }
}
// @from(Ln 7828, Col 4)
rrq = (A) => {
        let q = typeof A;
        switch (q) {
            case "number":
                return Number.isNaN(A) ? "NaN" : "nombro";
            case "object": {
                if (Array.isArray(A)) return "tabelo";
                if (A === null) return "senvalora";
                if (Object.getPrototypeOf(A) !== Object.prototype && A.constructor) return A.constructor.name
            }
        }
        return q
    }
// @from(Ln 7841, Col 4)
orq = () => {
        let A = {
            string: {
                unit: "karaktrojn",
                verb: "havi"
            },
            file: {
                unit: "bajtojn",
                verb: "havi"
            },
            array: {
                unit: "elementojn",
                verb: "havi"
            },
            set: {
                unit: "elementojn",
                verb: "havi"
            }
        };

        function q(Y) {
            return A[Y] ?? null
        }
        let K = {
            regex: "enigo",
            email: "retadreso",
            url: "URL",
            emoji: "emoĝio",
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
            datetime: "ISO-datotempo",
            date: "ISO-dato",
            time: "ISO-tempo",
            duration: "ISO-daŭro",
            ipv4: "IPv4-adreso",
            ipv6: "IPv6-adreso",
            cidrv4: "IPv4-rango",
            cidrv6: "IPv6-rango",
            base64: "64-ume kodita karaktraro",
            base64url: "URL-64-ume kodita karaktraro",
            json_string: "JSON-karaktraro",
            e164: "E.164-nombro",
            jwt: "JWT",
            template_literal: "enigo"
        };
        return (Y) => {
            switch (Y.code) {
                case "invalid_type":
                    return `Nevalida enigo: atendiĝis ${Y.expected}, riceviĝis ${rrq(Y.input)}`;
                case "invalid_value":
                    if (Y.values.length === 1) return `Nevalida enigo: atendiĝis ${I7(Y.values[0])}`;
                    return `Nevalida opcio: atendiĝis unu el ${_A(Y.values,"|")}`;
                case "too_big": {
                    let z = Y.inclusive ? "<=" : "<",
                        _ = q(Y.origin);
                    if (_) return `Tro granda: atendiĝis ke ${Y.origin??"valoro"} havu ${z}${Y.maximum.toString()} ${_.unit??"elementojn"}`;
                    return `Tro granda: atendiĝis ke ${Y.origin??"valoro"} havu ${z}${Y.maximum.toString()}`
                }
                case "too_small": {
                    let z = Y.inclusive ? ">=" : ">",
                        _ = q(Y.origin);
                    if (_) return `Tro malgranda: atendiĝis ke ${Y.origin} havu ${z}${Y.minimum.toString()} ${_.unit}`;
                    return `Tro malgranda: atendiĝis ke ${Y.origin} estu ${z}${Y.minimum.toString()}`
                }
                case "invalid_format": {
                    let z = Y;
                    if (z.format === "starts_with") return `Nevalida karaktraro: devas komenciĝi per "${z.prefix}"`;
                    if (z.format === "ends_with") return `Nevalida karaktraro: devas finiĝi per "${z.suffix}"`;
                    if (z.format === "includes") return `Nevalida karaktraro: devas inkluzivi "${z.includes}"`;
                    if (z.format === "regex") return `Nevalida karaktraro: devas kongrui kun la modelo ${z.pattern}`;
                    return `Nevalida ${K[z.format]??Y.format}`
                }
                case "not_multiple_of":
                    return `Nevalida nombro: devas esti oblo de ${Y.divisor}`;
                case "unrecognized_keys":
                    return `Nekonata${Y.keys.length>1?"j":""} ŝlosilo${Y.keys.length>1?"j":""}: ${_A(Y.keys,", ")}`;
                case "invalid_key":
                    return `Nevalida ŝlosilo en ${Y.origin}`;
                case "invalid_union":
                    return "Nevalida enigo";
                case "invalid_element":
                    return `Nevalida valoro en ${Y.origin}`;
                default:
                    return "Nevalida enigo"
            }
        }
    }
// @from(Ln 7936, Col 4)
x7A = E(() => {
    QK()
})
// @from(Ln 7940, Col 0)
function ug1() {
    return {
        localeError: arq()
    }
}
// @from(Ln 7945, Col 4)
arq = () => {
    let A = {
        string: {
            unit: "caracteres",
            verb: "tener"
        },
        file: {
            unit: "bytes",
            verb: "tener"
        },
        array: {
            unit: "elementos",
            verb: "tener"
        },
        set: {
            unit: "elementos",
            verb: "tener"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let _ = typeof z;
            switch (_) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "número";
                case "object": {
                    if (Array.isArray(z)) return "arreglo";
                    if (z === null) return "nulo";
                    if (Object.getPrototypeOf(z) !== Object.prototype) return z.constructor.name
                }
            }
            return _
        },
        Y = {
            regex: "entrada",
            email: "dirección de correo electrónico",
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
            datetime: "fecha y hora ISO",
            date: "fecha ISO",
            time: "hora ISO",
            duration: "duración ISO",
            ipv4: "dirección IPv4",
            ipv6: "dirección IPv6",
            cidrv4: "rango IPv4",
            cidrv6: "rango IPv6",
            base64: "cadena codificada en base64",
            base64url: "URL codificada en base64",
            json_string: "cadena JSON",
            e164: "número E.164",
            jwt: "JWT",
            template_literal: "entrada"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `Entrada inválida: se esperaba ${z.expected}, recibido ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `Entrada inválida: se esperaba ${I7(z.values[0])}`;
                return `Opción inválida: se esperaba una de ${_A(z.values,"|")}`;
            case "too_big": {
                let _ = z.inclusive ? "<=" : "<",
                    w = q(z.origin);
                if (w) return `Demasiado grande: se esperaba que ${z.origin??"valor"} tuviera ${_}${z.maximum.toString()} ${w.unit??"elementos"}`;
                return `Demasiado grande: se esperaba que ${z.origin??"valor"} fuera ${_}${z.maximum.toString()}`
            }
            case "too_small": {
                let _ = z.inclusive ? ">=" : ">",
                    w = q(z.origin);
                if (w) return `Demasiado pequeño: se esperaba que ${z.origin} tuviera ${_}${z.minimum.toString()} ${w.unit}`;
                return `Demasiado pequeño: se esperaba que ${z.origin} fuera ${_}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let _ = z;
                if (_.format === "starts_with") return `Cadena inválida: debe comenzar con "${_.prefix}"`;
                if (_.format === "ends_with") return `Cadena inválida: debe terminar en "${_.suffix}"`;
                if (_.format === "includes") return `Cadena inválida: debe incluir "${_.includes}"`;
                if (_.format === "regex") return `Cadena inválida: debe coincidir con el patrón ${_.pattern}`;
                return `Inválido ${Y[_.format]??z.format}`
            }
            case "not_multiple_of":
                return `Número inválido: debe ser múltiplo de ${z.divisor}`;
            case "unrecognized_keys":
                return `Llave${z.keys.length>1?"s":""} desconocida${z.keys.length>1?"s":""}: ${_A(z.keys,", ")}`;
            case "invalid_key":
                return `Llave inválida en ${z.origin}`;
            case "invalid_union":
                return "Entrada inválida";
            case "invalid_element":
                return `Valor inválido en ${z.origin}`;
            default:
                return "Entrada inválida"
        }
    }
}
// @from(Ln 8053, Col 4)
u7A = E(() => {
    QK()
})
// @from(Ln 8057, Col 0)
function mg1() {
    return {
        localeError: srq()
    }
}
// @from(Ln 8062, Col 4)
srq = () => {
    let A = {
        string: {
            unit: "کاراکتر",
            verb: "داشته باشد"
        },
        file: {
            unit: "بایت",
            verb: "داشته باشد"
        },
        array: {
            unit: "آیتم",
            verb: "داشته باشد"
        },
        set: {
            unit: "آیتم",
            verb: "داشته باشد"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let _ = typeof z;
            switch (_) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "عدد";
                case "object": {
                    if (Array.isArray(z)) return "آرایه";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return _
        },
        Y = {
            regex: "ورودی",
            email: "آدرس ایمیل",
            url: "URL",
            emoji: "ایموجی",
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
            datetime: "تاریخ و زمان ایزو",
            date: "تاریخ ایزو",
            time: "زمان ایزو",
            duration: "مدت زمان ایزو",
            ipv4: "IPv4 آدرس",
            ipv6: "IPv6 آدرس",
            cidrv4: "IPv4 دامنه",
            cidrv6: "IPv6 دامنه",
            base64: "base64-encoded رشته",
            base64url: "base64url-encoded رشته",
            json_string: "JSON رشته",
            e164: "E.164 عدد",
            jwt: "JWT",
            template_literal: "ورودی"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `ورودی نامعتبر: می‌بایست ${z.expected} می‌بود، ${K(z.input)} دریافت شد`;
            case "invalid_value":
                if (z.values.length === 1) return `ورودی نامعتبر: می‌بایست ${I7(z.values[0])} می‌بود`;
                return `گزینه نامعتبر: می‌بایست یکی از ${_A(z.values,"|")} می‌بود`;
            case "too_big": {
                let _ = z.inclusive ? "<=" : "<",
                    w = q(z.origin);
                if (w) return `خیلی بزرگ: ${z.origin??"مقدار"} باید ${_}${z.maximum.toString()} ${w.unit??"عنصر"} باشد`;
                return `خیلی بزرگ: ${z.origin??"مقدار"} باید ${_}${z.maximum.toString()} باشد`
            }
            case "too_small": {
                let _ = z.inclusive ? ">=" : ">",
                    w = q(z.origin);
                if (w) return `خیلی کوچک: ${z.origin} باید ${_}${z.minimum.toString()} ${w.unit} باشد`;
                return `خیلی کوچک: ${z.origin} باید ${_}${z.minimum.toString()} باشد`
            }
            case "invalid_format": {
                let _ = z;
                if (_.format === "starts_with") return `رشته نامعتبر: باید با "${_.prefix}" شروع شود`;
                if (_.format === "ends_with") return `رشته نامعتبر: باید با "${_.suffix}" تمام شود`;
                if (_.format === "includes") return `رشته نامعتبر: باید شامل "${_.includes}" باشد`;
                if (_.format === "regex") return `رشته نامعتبر: باید با الگوی ${_.pattern} مطابقت داشته باشد`;
                return `${Y[_.format]??z.format} نامعتبر`
            }
            case "not_multiple_of":
                return `عدد نامعتبر: باید مضرب ${z.divisor} باشد`;
            case "unrecognized_keys":
                return `کلید${z.keys.length>1?"های":""} ناشناس: ${_A(z.keys,", ")}`;
            case "invalid_key":
                return `کلید ناشناس در ${z.origin}`;
            case "invalid_union":
                return "ورودی نامعتبر";
            case "invalid_element":
                return `مقدار نامعتبر در ${z.origin}`;
            default:
                return "ورودی نامعتبر"
        }
    }
}
// @from(Ln 8170, Col 4)
m7A = E(() => {
    QK()
})
// @from(Ln 8174, Col 0)
function Bg1() {
    return {
        localeError: trq()
    }
}
// @from(Ln 8179, Col 4)
trq = () => {
    let A = {
        string: {
            unit: "merkkiä",
            subject: "merkkijonon"
        },
        file: {
            unit: "tavua",
            subject: "tiedoston"
        },
        array: {
            unit: "alkiota",
            subject: "listan"
        },
        set: {
            unit: "alkiota",
            subject: "joukon"
        },
        number: {
            unit: "",
            subject: "luvun"
        },
        bigint: {
            unit: "",
            subject: "suuren kokonaisluvun"
        },
        int: {
            unit: "",
            subject: "kokonaisluvun"
        },
        date: {
            unit: "",
            subject: "päivämäärän"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let _ = typeof z;
            switch (_) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "number";
                case "object": {
                    if (Array.isArray(z)) return "array";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return _
        },
        Y = {
            regex: "säännöllinen lauseke",
            email: "sähköpostiosoite",
            url: "URL-osoite",
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
            datetime: "ISO-aikaleima",
            date: "ISO-päivämäärä",
            time: "ISO-aika",
            duration: "ISO-kesto",
            ipv4: "IPv4-osoite",
            ipv6: "IPv6-osoite",
            cidrv4: "IPv4-alue",
            cidrv6: "IPv6-alue",
            base64: "base64-koodattu merkkijono",
            base64url: "base64url-koodattu merkkijono",
            json_string: "JSON-merkkijono",
            e164: "E.164-luku",
            jwt: "JWT",
            template_literal: "templaattimerkkijono"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `Virheellinen tyyppi: odotettiin ${z.expected}, oli ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `Virheellinen syöte: täytyy olla ${I7(z.values[0])}`;
                return `Virheellinen valinta: täytyy olla yksi seuraavista: ${_A(z.values,"|")}`;
            case "too_big": {
                let _ = z.inclusive ? "<=" : "<",
                    w = q(z.origin);
                if (w) return `Liian suuri: ${w.subject} täytyy olla ${_}${z.maximum.toString()} ${w.unit}`.trim();
                return `Liian suuri: arvon täytyy olla ${_}${z.maximum.toString()}`
            }
            case "too_small": {
                let _ = z.inclusive ? ">=" : ">",
                    w = q(z.origin);
                if (w) return `Liian pieni: ${w.subject} täytyy olla ${_}${z.minimum.toString()} ${w.unit}`.trim();
                return `Liian pieni: arvon täytyy olla ${_}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let _ = z;
                if (_.format === "starts_with") return `Virheellinen syöte: täytyy alkaa "${_.prefix}"`;
                if (_.format === "ends_with") return `Virheellinen syöte: täytyy loppua "${_.suffix}"`;
                if (_.format === "includes") return `Virheellinen syöte: täytyy sisältää "${_.includes}"`;
                if (_.format === "regex") return `Virheellinen syöte: täytyy vastata säännöllistä lauseketta ${_.pattern}`;
                return `Virheellinen ${Y[_.format]??z.format}`
            }
            case "not_multiple_of":
                return `Virheellinen luku: täytyy olla luvun ${z.divisor} monikerta`;
            case "unrecognized_keys":
                return `${z.keys.length>1?"Tuntemattomat avaimet":"Tuntematon avain"}: ${_A(z.keys,", ")}`;
            case "invalid_key":
                return "Virheellinen avain tietueessa";
            case "invalid_union":
                return "Virheellinen unioni";
            case "invalid_element":
                return "Virheellinen arvo joukossa";
            default:
                return "Virheellinen syöte"
        }
    }
}
// @from(Ln 8303, Col 4)
B7A = E(() => {
    QK()
})
// @from(Ln 8307, Col 0)
function gg1() {
    return {
        localeError: erq()
    }
}
// @from(Ln 8312, Col 4)
erq = () => {
    let A = {
        string: {
            unit: "caractères",
            verb: "avoir"
        },
        file: {
            unit: "octets",
            verb: "avoir"
        },
        array: {
            unit: "éléments",
            verb: "avoir"
        },
        set: {
            unit: "éléments",
            verb: "avoir"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let _ = typeof z;
            switch (_) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "nombre";
                case "object": {
                    if (Array.isArray(z)) return "tableau";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return _
        },
        Y = {
            regex: "entrée",
            email: "adresse e-mail",
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
            datetime: "date et heure ISO",
            date: "date ISO",
            time: "heure ISO",
            duration: "durée ISO",
            ipv4: "adresse IPv4",
            ipv6: "adresse IPv6",
            cidrv4: "plage IPv4",
            cidrv6: "plage IPv6",
            base64: "chaîne encodée en base64",
            base64url: "chaîne encodée en base64url",
            json_string: "chaîne JSON",
            e164: "numéro E.164",
            jwt: "JWT",
            template_literal: "entrée"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `Entrée invalide : ${z.expected} attendu, ${K(z.input)} reçu`;
            case "invalid_value":
                if (z.values.length === 1) return `Entrée invalide : ${I7(z.values[0])} attendu`;
                return `Option invalide : une valeur parmi ${_A(z.values,"|")} attendue`;
            case "too_big": {
                let _ = z.inclusive ? "<=" : "<",
                    w = q(z.origin);
                if (w) return `Trop grand : ${z.origin??"valeur"} doit ${w.verb} ${_}${z.maximum.toString()} ${w.unit??"élément(s)"}`;
                return `Trop grand : ${z.origin??"valeur"} doit être ${_}${z.maximum.toString()}`
            }
            case "too_small": {
                let _ = z.inclusive ? ">=" : ">",
                    w = q(z.origin);
                if (w) return `Trop petit : ${z.origin} doit ${w.verb} ${_}${z.minimum.toString()} ${w.unit}`;
                return `Trop petit : ${z.origin} doit être ${_}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let _ = z;
                if (_.format === "starts_with") return `Chaîne invalide : doit commencer par "${_.prefix}"`;
                if (_.format === "ends_with") return `Chaîne invalide : doit se terminer par "${_.suffix}"`;
                if (_.format === "includes") return `Chaîne invalide : doit inclure "${_.includes}"`;
                if (_.format === "regex") return `Chaîne invalide : doit correspondre au modèle ${_.pattern}`;
                return `${Y[_.format]??z.format} invalide`
            }
            case "not_multiple_of":
                return `Nombre invalide : doit être un multiple de ${z.divisor}`;
            case "unrecognized_keys":
                return `Clé${z.keys.length>1?"s":""} non reconnue${z.keys.length>1?"s":""} : ${_A(z.keys,", ")}`;
            case "invalid_key":
                return `Clé invalide dans ${z.origin}`;
            case "invalid_union":
                return "Entrée invalide";
            case "invalid_element":
                return `Valeur invalide dans ${z.origin}`;
            default:
                return "Entrée invalide"
        }
    }
}
// @from(Ln 8420, Col 4)
g7A = E(() => {
    QK()
})
// @from(Ln 8424, Col 0)
function Fg1() {
    return {
        localeError: Aoq()
    }
}
// @from(Ln 8429, Col 4)
Aoq = () => {
    let A = {
        string: {
            unit: "caractères",
            verb: "avoir"
        },
        file: {
            unit: "octets",
            verb: "avoir"
        },
        array: {
            unit: "éléments",
            verb: "avoir"
        },
        set: {
            unit: "éléments",
            verb: "avoir"
        }
    };

    function q(z) {
        return A[z] ?? null
    }
    let K = (z) => {
            let _ = typeof z;
            switch (_) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "number";
                case "object": {
                    if (Array.isArray(z)) return "array";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return _
        },
        Y = {
            regex: "entrée",
            email: "adresse courriel",
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
            datetime: "date-heure ISO",
            date: "date ISO",
            time: "heure ISO",
            duration: "durée ISO",
            ipv4: "adresse IPv4",
            ipv6: "adresse IPv6",
            cidrv4: "plage IPv4",
            cidrv6: "plage IPv6",
            base64: "chaîne encodée en base64",
            base64url: "chaîne encodée en base64url",
            json_string: "chaîne JSON",
            e164: "numéro E.164",
            jwt: "JWT",
            template_literal: "entrée"
        };
    return (z) => {
        switch (z.code) {
            case "invalid_type":
                return `Entrée invalide : attendu ${z.expected}, reçu ${K(z.input)}`;
            case "invalid_value":
                if (z.values.length === 1) return `Entrée invalide : attendu ${I7(z.values[0])}`;
                return `Option invalide : attendu l'une des valeurs suivantes ${_A(z.values,"|")}`;
            case "too_big": {
                let _ = z.inclusive ? "≤" : "<",
                    w = q(z.origin);
                if (w) return `Trop grand : attendu que ${z.origin??"la valeur"} ait ${_}${z.maximum.toString()} ${w.unit}`;
                return `Trop grand : attendu que ${z.origin??"la valeur"} soit ${_}${z.maximum.toString()}`
            }
            case "too_small": {
                let _ = z.inclusive ? "≥" : ">",
                    w = q(z.origin);
                if (w) return `Trop petit : attendu que ${z.origin} ait ${_}${z.minimum.toString()} ${w.unit}`;
                return `Trop petit : attendu que ${z.origin} soit ${_}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let _ = z;
                if (_.format === "starts_with") return `Chaîne invalide : doit commencer par "${_.prefix}"`;
                if (_.format === "ends_with") return `Chaîne invalide : doit se terminer par "${_.suffix}"`;
                if (_.format === "includes") return `Chaîne invalide : doit inclure "${_.includes}"`;
                if (_.format === "regex") return `Chaîne invalide : doit correspondre au motif ${_.pattern}`;
                return `${Y[_.format]??z.format} invalide`
            }
            case "not_multiple_of":
                return `Nombre invalide : doit être un multiple de ${z.divisor}`;
            case "unrecognized_keys":
                return `Clé${z.keys.length>1?"s":""} non reconnue${z.keys.length>1?"s":""} : ${_A(z.keys,", ")}`;
            case "invalid_key":
                return `Clé invalide dans ${z.origin}`;
            case "invalid_union":
                return "Entrée invalide";
            case "invalid_element":
                return `Valeur invalide dans ${z.origin}`;
            default:
                return "Entrée invalide"
        }
    }
}
// @from(Ln 8537, Col 4)
F7A = E(() => {
    QK()
})
// @from(Ln 8541, Col 0)
function pg1() {
    return {
        localeError: qoq()
    }
}
// @from(Ln 8546, Col 4)
qoq = () => {
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
            let _ = typeof z;
            switch (_) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "number";
                case "object": {
                    if (Array.isArray(z)) return "array";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return _
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
                if (z.values.length === 1) return `קלט לא תקין: צריך ${I7(z.values[0])}`;
                return `קלט לא תקין: צריך אחת מהאפשרויות  ${_A(z.values,"|")}`;
            case "too_big": {
                let _ = z.inclusive ? "<=" : "<",
                    w = q(z.origin);
                if (w) return `גדול מדי: ${z.origin??"value"} צריך להיות ${_}${z.maximum.toString()} ${w.unit??"elements"}`;
                return `גדול מדי: ${z.origin??"value"} צריך להיות ${_}${z.maximum.toString()}`
            }
            case "too_small": {
                let _ = z.inclusive ? ">=" : ">",
                    w = q(z.origin);
                if (w) return `קטן מדי: ${z.origin} צריך להיות ${_}${z.minimum.toString()} ${w.unit}`;
                return `קטן מדי: ${z.origin} צריך להיות ${_}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let _ = z;
                if (_.format === "starts_with") return `מחרוזת לא תקינה: חייבת להתחיל ב"${_.prefix}"`;
                if (_.format === "ends_with") return `מחרוזת לא תקינה: חייבת להסתיים ב "${_.suffix}"`;
                if (_.format === "includes") return `מחרוזת לא תקינה: חייבת לכלול "${_.includes}"`;
                if (_.format === "regex") return `מחרוזת לא תקינה: חייבת להתאים לתבנית ${_.pattern}`;
                return `${Y[_.format]??z.format} לא תקין`
            }
            case "not_multiple_of":
                return `מספר לא תקין: חייב להיות מכפלה של ${z.divisor}`;
            case "unrecognized_keys":
                return `מפתח${z.keys.length>1?"ות":""} לא מזוה${z.keys.length>1?"ים":"ה"}: ${_A(z.keys,", ")}`;
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
// @from(Ln 8654, Col 4)
p7A = E(() => {
    QK()
})
// @from(Ln 8658, Col 0)
function Qg1() {
    return {
        localeError: Koq()
    }
}
// @from(Ln 8663, Col 4)
Koq = () => {
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
            let _ = typeof z;
            switch (_) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "szám";
                case "object": {
                    if (Array.isArray(z)) return "tömb";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return _
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
                if (z.values.length === 1) return `Érvénytelen bemenet: a várt érték ${I7(z.values[0])}`;
                return `Érvénytelen opció: valamelyik érték várt ${_A(z.values,"|")}`;
            case "too_big": {
                let _ = z.inclusive ? "<=" : "<",
                    w = q(z.origin);
                if (w) return `Túl nagy: ${z.origin??"érték"} mérete túl nagy ${_}${z.maximum.toString()} ${w.unit??"elem"}`;
                return `Túl nagy: a bemeneti érték ${z.origin??"érték"} túl nagy: ${_}${z.maximum.toString()}`
            }
            case "too_small": {
                let _ = z.inclusive ? ">=" : ">",
                    w = q(z.origin);
                if (w) return `Túl kicsi: a bemeneti érték ${z.origin} mérete túl kicsi ${_}${z.minimum.toString()} ${w.unit}`;
                return `Túl kicsi: a bemeneti érték ${z.origin} túl kicsi ${_}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let _ = z;
                if (_.format === "starts_with") return `Érvénytelen string: "${_.prefix}" értékkel kell kezdődnie`;
                if (_.format === "ends_with") return `Érvénytelen string: "${_.suffix}" értékkel kell végződnie`;
                if (_.format === "includes") return `Érvénytelen string: "${_.includes}" értéket kell tartalmaznia`;
                if (_.format === "regex") return `Érvénytelen string: ${_.pattern} mintának kell megfelelnie`;
                return `Érvénytelen ${Y[_.format]??z.format}`
            }
            case "not_multiple_of":
                return `Érvénytelen szám: ${z.divisor} többszörösének kell lennie`;
            case "unrecognized_keys":
                return `Ismeretlen kulcs${z.keys.length>1?"s":""}: ${_A(z.keys,", ")}`;
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
// @from(Ln 8771, Col 4)
Q7A = E(() => {
    QK()
})
// @from(Ln 8775, Col 0)
function Ug1() {
    return {
        localeError: Yoq()
    }
}
// @from(Ln 8780, Col 4)
Yoq = () => {
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
            let _ = typeof z;
            switch (_) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "number";
                case "object": {
                    if (Array.isArray(z)) return "array";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return _
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
                if (z.values.length === 1) return `Input tidak valid: diharapkan ${I7(z.values[0])}`;
                return `Pilihan tidak valid: diharapkan salah satu dari ${_A(z.values,"|")}`;
            case "too_big": {
                let _ = z.inclusive ? "<=" : "<",
                    w = q(z.origin);
                if (w) return `Terlalu besar: diharapkan ${z.origin??"value"} memiliki ${_}${z.maximum.toString()} ${w.unit??"elemen"}`;
                return `Terlalu besar: diharapkan ${z.origin??"value"} menjadi ${_}${z.maximum.toString()}`
            }
            case "too_small": {
                let _ = z.inclusive ? ">=" : ">",
                    w = q(z.origin);
                if (w) return `Terlalu kecil: diharapkan ${z.origin} memiliki ${_}${z.minimum.toString()} ${w.unit}`;
                return `Terlalu kecil: diharapkan ${z.origin} menjadi ${_}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let _ = z;
                if (_.format === "starts_with") return `String tidak valid: harus dimulai dengan "${_.prefix}"`;
                if (_.format === "ends_with") return `String tidak valid: harus berakhir dengan "${_.suffix}"`;
                if (_.format === "includes") return `String tidak valid: harus menyertakan "${_.includes}"`;
                if (_.format === "regex") return `String tidak valid: harus sesuai pola ${_.pattern}`;
                return `${Y[_.format]??z.format} tidak valid`
            }
            case "not_multiple_of":
                return `Angka tidak valid: harus kelipatan dari ${z.divisor}`;
            case "unrecognized_keys":
                return `Kunci tidak dikenali ${z.keys.length>1?"s":""}: ${_A(z.keys,", ")}`;
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
// @from(Ln 8888, Col 4)
U7A = E(() => {
    QK()
})
// @from(Ln 8892, Col 0)
function dg1() {
    return {
        localeError: zoq()
    }
}
// @from(Ln 8897, Col 4)
zoq = () => {
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
            let _ = typeof z;
            switch (_) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "numero";
                case "object": {
                    if (Array.isArray(z)) return "vettore";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return _
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
                if (z.values.length === 1) return `Input non valido: atteso ${I7(z.values[0])}`;
                return `Opzione non valida: atteso uno tra ${_A(z.values,"|")}`;
            case "too_big": {
                let _ = z.inclusive ? "<=" : "<",
                    w = q(z.origin);
                if (w) return `Troppo grande: ${z.origin??"valore"} deve avere ${_}${z.maximum.toString()} ${w.unit??"elementi"}`;
                return `Troppo grande: ${z.origin??"valore"} deve essere ${_}${z.maximum.toString()}`
            }
            case "too_small": {
                let _ = z.inclusive ? ">=" : ">",
                    w = q(z.origin);
                if (w) return `Troppo piccolo: ${z.origin} deve avere ${_}${z.minimum.toString()} ${w.unit}`;
                return `Troppo piccolo: ${z.origin} deve essere ${_}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let _ = z;
                if (_.format === "starts_with") return `Stringa non valida: deve iniziare con "${_.prefix}"`;
                if (_.format === "ends_with") return `Stringa non valida: deve terminare con "${_.suffix}"`;
                if (_.format === "includes") return `Stringa non valida: deve includere "${_.includes}"`;
                if (_.format === "regex") return `Stringa non valida: deve corrispondere al pattern ${_.pattern}`;
                return `Invalid ${Y[_.format]??z.format}`
            }
            case "not_multiple_of":
                return `Numero non valido: deve essere un multiplo di ${z.divisor}`;
            case "unrecognized_keys":
                return `Chiav${z.keys.length>1?"i":"e"} non riconosciut${z.keys.length>1?"e":"a"}: ${_A(z.keys,", ")}`;
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
// @from(Ln 9005, Col 4)
d7A = E(() => {
    QK()
})
// @from(Ln 9009, Col 0)
function cg1() {
    return {
        localeError: _oq()
    }
}
// @from(Ln 9014, Col 4)
_oq = () => {
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
            let _ = typeof z;
            switch (_) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "数値";
                case "object": {
                    if (Array.isArray(z)) return "配列";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return _
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
                if (z.values.length === 1) return `無効な入力: ${I7(z.values[0])}が期待されました`;
                return `無効な選択: ${_A(z.values,"、")}のいずれかである必要があります`;
            case "too_big": {
                let _ = z.inclusive ? "以下である" : "より小さい",
                    w = q(z.origin);
                if (w) return `大きすぎる値: ${z.origin??"値"}は${z.maximum.toString()}${w.unit??"要素"}${_}必要があります`;
                return `大きすぎる値: ${z.origin??"値"}は${z.maximum.toString()}${_}必要があります`
            }
            case "too_small": {
                let _ = z.inclusive ? "以上である" : "より大きい",
                    w = q(z.origin);
                if (w) return `小さすぎる値: ${z.origin}は${z.minimum.toString()}${w.unit}${_}必要があります`;
                return `小さすぎる値: ${z.origin}は${z.minimum.toString()}${_}必要があります`
            }
            case "invalid_format": {
                let _ = z;
                if (_.format === "starts_with") return `無効な文字列: "${_.prefix}"で始まる必要があります`;
                if (_.format === "ends_with") return `無効な文字列: "${_.suffix}"で終わる必要があります`;
                if (_.format === "includes") return `無効な文字列: "${_.includes}"を含む必要があります`;
                if (_.format === "regex") return `無効な文字列: パターン${_.pattern}に一致する必要があります`;
                return `無効な${Y[_.format]??z.format}`
            }
            case "not_multiple_of":
                return `無効な数値: ${z.divisor}の倍数である必要があります`;
            case "unrecognized_keys":
                return `認識されていないキー${z.keys.length>1?"群":""}: ${_A(z.keys,"、")}`;
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
// @from(Ln 9122, Col 4)
c7A = E(() => {
    QK()
})
// @from(Ln 9126, Col 0)
function lg1() {
    return {
        localeError: woq()
    }
}
// @from(Ln 9131, Col 4)
woq = () => {
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
            let _ = typeof z;
            switch (_) {
                case "number":
                    return Number.isNaN(z) ? "មិនមែនជាលេខ (NaN)" : "លេខ";
                case "object": {
                    if (Array.isArray(z)) return "អារេ (Array)";
                    if (z === null) return "គ្មានតម្លៃ (null)";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return _
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
                if (z.values.length === 1) return `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ ${I7(z.values[0])}`;
                return `ជម្រើសមិនត្រឹមត្រូវ៖ ត្រូវជាមួយក្នុងចំណោម ${_A(z.values,"|")}`;
            case "too_big": {
                let _ = z.inclusive ? "<=" : "<",
                    w = q(z.origin);
                if (w) return `ធំពេក៖ ត្រូវការ ${z.origin??"តម្លៃ"} ${_} ${z.maximum.toString()} ${w.unit??"ធាតុ"}`;
                return `ធំពេក៖ ត្រូវការ ${z.origin??"តម្លៃ"} ${_} ${z.maximum.toString()}`
            }
            case "too_small": {
                let _ = z.inclusive ? ">=" : ">",
                    w = q(z.origin);
                if (w) return `តូចពេក៖ ត្រូវការ ${z.origin} ${_} ${z.minimum.toString()} ${w.unit}`;
                return `តូចពេក៖ ត្រូវការ ${z.origin} ${_} ${z.minimum.toString()}`
            }
            case "invalid_format": {
                let _ = z;
                if (_.format === "starts_with") return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវចាប់ផ្តើមដោយ "${_.prefix}"`;
                if (_.format === "ends_with") return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវបញ្ចប់ដោយ "${_.suffix}"`;
                if (_.format === "includes") return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវមាន "${_.includes}"`;
                if (_.format === "regex") return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវតែផ្គូផ្គងនឹងទម្រង់ដែលបានកំណត់ ${_.pattern}`;
                return `មិនត្រឹមត្រូវ៖ ${Y[_.format]??z.format}`
            }
            case "not_multiple_of":
                return `លេខមិនត្រឹមត្រូវ៖ ត្រូវតែជាពហុគុណនៃ ${z.divisor}`;
            case "unrecognized_keys":
                return `រកឃើញសោមិនស្គាល់៖ ${_A(z.keys,", ")}`;
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
// @from(Ln 9239, Col 4)
l7A = E(() => {
    QK()
})
// @from(Ln 9243, Col 0)
function ig1() {
    return {
        localeError: Ooq()
    }
}
// @from(Ln 9248, Col 4)
Ooq = () => {
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
            let _ = typeof z;
            switch (_) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "number";
                case "object": {
                    if (Array.isArray(z)) return "array";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return _
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
                if (z.values.length === 1) return `잘못된 입력: 값은 ${I7(z.values[0])} 이어야 합니다`;
                return `잘못된 옵션: ${_A(z.values,"또는 ")} 중 하나여야 합니다`;
            case "too_big": {
                let _ = z.inclusive ? "이하" : "미만",
                    w = _ === "미만" ? "이어야 합니다" : "여야 합니다",
                    O = q(z.origin),
                    $ = O?.unit ?? "요소";
                if (O) return `${z.origin??"값"}이 너무 큽니다: ${z.maximum.toString()}${$} ${_}${w}`;
                return `${z.origin??"값"}이 너무 큽니다: ${z.maximum.toString()} ${_}${w}`
            }
            case "too_small": {
                let _ = z.inclusive ? "이상" : "초과",
                    w = _ === "이상" ? "이어야 합니다" : "여야 합니다",
                    O = q(z.origin),
                    $ = O?.unit ?? "요소";
                if (O) return `${z.origin??"값"}이 너무 작습니다: ${z.minimum.toString()}${$} ${_}${w}`;
                return `${z.origin??"값"}이 너무 작습니다: ${z.minimum.toString()} ${_}${w}`
            }
            case "invalid_format": {
                let _ = z;
                if (_.format === "starts_with") return `잘못된 문자열: "${_.prefix}"(으)로 시작해야 합니다`;
                if (_.format === "ends_with") return `잘못된 문자열: "${_.suffix}"(으)로 끝나야 합니다`;
                if (_.format === "includes") return `잘못된 문자열: "${_.includes}"을(를) 포함해야 합니다`;
                if (_.format === "regex") return `잘못된 문자열: 정규식 ${_.pattern} 패턴과 일치해야 합니다`;
                return `잘못된 ${Y[_.format]??z.format}`
            }
            case "not_multiple_of":
                return `잘못된 숫자: ${z.divisor}의 배수여야 합니다`;
            case "unrecognized_keys":
                return `인식할 수 없는 키: ${_A(z.keys,", ")}`;
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
// @from(Ln 9360, Col 4)
i7A = E(() => {
    QK()
})
// @from(Ln 9364, Col 0)
function ng1() {
    return {
        localeError: $oq()
    }
}
// @from(Ln 9369, Col 4)
$oq = () => {
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
            let _ = typeof z;
            switch (_) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "број";
                case "object": {
                    if (Array.isArray(z)) return "низа";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return _
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
                if (z.values.length === 1) return `Invalid input: expected ${I7(z.values[0])}`;
                return `Грешана опција: се очекува една ${_A(z.values,"|")}`;
            case "too_big": {
                let _ = z.inclusive ? "<=" : "<",
                    w = q(z.origin);
                if (w) return `Премногу голем: се очекува ${z.origin??"вредноста"} да има ${_}${z.maximum.toString()} ${w.unit??"елементи"}`;
                return `Премногу голем: се очекува ${z.origin??"вредноста"} да биде ${_}${z.maximum.toString()}`
            }
            case "too_small": {
                let _ = z.inclusive ? ">=" : ">",
                    w = q(z.origin);
                if (w) return `Премногу мал: се очекува ${z.origin} да има ${_}${z.minimum.toString()} ${w.unit}`;
                return `Премногу мал: се очекува ${z.origin} да биде ${_}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let _ = z;
                if (_.format === "starts_with") return `Неважечка низа: мора да започнува со "${_.prefix}"`;
                if (_.format === "ends_with") return `Неважечка низа: мора да завршува со "${_.suffix}"`;
                if (_.format === "includes") return `Неважечка низа: мора да вклучува "${_.includes}"`;
                if (_.format === "regex") return `Неважечка низа: мора да одгоара на патернот ${_.pattern}`;
                return `Invalid ${Y[_.format]??z.format}`
            }
            case "not_multiple_of":
                return `Грешен број: мора да биде делив со ${z.divisor}`;
            case "unrecognized_keys":
                return `${z.keys.length>1?"Непрепознаени клучеви":"Непрепознаен клуч"}: ${_A(z.keys,", ")}`;
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
// @from(Ln 9477, Col 4)
n7A = E(() => {
    QK()
})
// @from(Ln 9481, Col 0)
function rg1() {
    return {
        localeError: Hoq()
    }
}
// @from(Ln 9486, Col 4)
Hoq = () => {
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
            let _ = typeof z;
            switch (_) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "nombor";
                case "object": {
                    if (Array.isArray(z)) return "array";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return _
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
                if (z.values.length === 1) return `Input tidak sah: dijangka ${I7(z.values[0])}`;
                return `Pilihan tidak sah: dijangka salah satu daripada ${_A(z.values,"|")}`;
            case "too_big": {
                let _ = z.inclusive ? "<=" : "<",
                    w = q(z.origin);
                if (w) return `Terlalu besar: dijangka ${z.origin??"nilai"} ${w.verb} ${_}${z.maximum.toString()} ${w.unit??"elemen"}`;
                return `Terlalu besar: dijangka ${z.origin??"nilai"} adalah ${_}${z.maximum.toString()}`
            }
            case "too_small": {
                let _ = z.inclusive ? ">=" : ">",
                    w = q(z.origin);
                if (w) return `Terlalu kecil: dijangka ${z.origin} ${w.verb} ${_}${z.minimum.toString()} ${w.unit}`;
                return `Terlalu kecil: dijangka ${z.origin} adalah ${_}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let _ = z;
                if (_.format === "starts_with") return `String tidak sah: mesti bermula dengan "${_.prefix}"`;
                if (_.format === "ends_with") return `String tidak sah: mesti berakhir dengan "${_.suffix}"`;
                if (_.format === "includes") return `String tidak sah: mesti mengandungi "${_.includes}"`;
                if (_.format === "regex") return `String tidak sah: mesti sepadan dengan corak ${_.pattern}`;
                return `${Y[_.format]??z.format} tidak sah`
            }
            case "not_multiple_of":
                return `Nombor tidak sah: perlu gandaan ${z.divisor}`;
            case "unrecognized_keys":
                return `Kunci tidak dikenali: ${_A(z.keys,", ")}`;
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
// @from(Ln 9594, Col 4)
r7A = E(() => {
    QK()
})
// @from(Ln 9598, Col 0)
function og1() {
    return {
        localeError: joq()
    }
}
// @from(Ln 9603, Col 4)
joq = () => {
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
            let _ = typeof z;
            switch (_) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "getal";
                case "object": {
                    if (Array.isArray(z)) return "array";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return _
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
                if (z.values.length === 1) return `Ongeldige invoer: verwacht ${I7(z.values[0])}`;
                return `Ongeldige optie: verwacht één van ${_A(z.values,"|")}`;
            case "too_big": {
                let _ = z.inclusive ? "<=" : "<",
                    w = q(z.origin);
                if (w) return `Te lang: verwacht dat ${z.origin??"waarde"} ${_}${z.maximum.toString()} ${w.unit??"elementen"} bevat`;
                return `Te lang: verwacht dat ${z.origin??"waarde"} ${_}${z.maximum.toString()} is`
            }
            case "too_small": {
                let _ = z.inclusive ? ">=" : ">",
                    w = q(z.origin);
                if (w) return `Te kort: verwacht dat ${z.origin} ${_}${z.minimum.toString()} ${w.unit} bevat`;
                return `Te kort: verwacht dat ${z.origin} ${_}${z.minimum.toString()} is`
            }
            case "invalid_format": {
                let _ = z;
                if (_.format === "starts_with") return `Ongeldige tekst: moet met "${_.prefix}" beginnen`;
                if (_.format === "ends_with") return `Ongeldige tekst: moet op "${_.suffix}" eindigen`;
                if (_.format === "includes") return `Ongeldige tekst: moet "${_.includes}" bevatten`;
                if (_.format === "regex") return `Ongeldige tekst: moet overeenkomen met patroon ${_.pattern}`;
                return `Ongeldig: ${Y[_.format]??z.format}`
            }
            case "not_multiple_of":
                return `Ongeldig getal: moet een veelvoud van ${z.divisor} zijn`;
            case "unrecognized_keys":
                return `Onbekende key${z.keys.length>1?"s":""}: ${_A(z.keys,", ")}`;
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
// @from(Ln 9707, Col 4)
o7A = E(() => {
    QK()
})
// @from(Ln 9711, Col 0)
function ag1() {
    return {
        localeError: Joq()
    }
}