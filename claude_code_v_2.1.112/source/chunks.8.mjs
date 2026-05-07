
// @from(Ln 18936, Col 4)
zN5 = (q) => {
        let K = typeof q;
        switch (K) {
            case "number":
                return Number.isNaN(q) ? "NaN" : "number";
            case "object": {
                if (Array.isArray(q)) return "array";
                if (q === null) return "null";
                if (Object.getPrototypeOf(q) !== Object.prototype && q.constructor) return q.constructor.name
            }
        }
        return K
    }
// @from(Ln 18949, Col 4)
YN5 = () => {
        let q = {
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

        function K(z) {
            return q[z] ?? null
        }
        let _ = {
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
                    return `Invalid input: expected ${z.expected}, received ${zN5(z.input)}`;
                case "invalid_value":
                    if (z.values.length === 1) return `Invalid input: expected ${H4(z.values[0])}`;
                    return `Invalid option: expected one of ${h7(z.values,"|")}`;
                case "too_big": {
                    let Y = z.inclusive ? "<=" : "<",
                        A = K(z.origin);
                    if (A) return `Too big: expected ${z.origin??"value"} to have ${Y}${z.maximum.toString()} ${A.unit??"elements"}`;
                    return `Too big: expected ${z.origin??"value"} to be ${Y}${z.maximum.toString()}`
                }
                case "too_small": {
                    let Y = z.inclusive ? ">=" : ">",
                        A = K(z.origin);
                    if (A) return `Too small: expected ${z.origin} to have ${Y}${z.minimum.toString()} ${A.unit}`;
                    return `Too small: expected ${z.origin} to be ${Y}${z.minimum.toString()}`
                }
                case "invalid_format": {
                    let Y = z;
                    if (Y.format === "starts_with") return `Invalid string: must start with "${Y.prefix}"`;
                    if (Y.format === "ends_with") return `Invalid string: must end with "${Y.suffix}"`;
                    if (Y.format === "includes") return `Invalid string: must include "${Y.includes}"`;
                    if (Y.format === "regex") return `Invalid string: must match pattern ${Y.pattern}`;
                    return `Invalid ${_[Y.format]??z.format}`
                }
                case "not_multiple_of":
                    return `Invalid number: must be a multiple of ${z.divisor}`;
                case "unrecognized_keys":
                    return `Unrecognized key${z.keys.length>1?"s":""}: ${h7(z.keys,", ")}`;
                case "invalid_key":
                    return `Invalid key in ${z.origin}`;
                case "invalid_union":
                    return "Invalid input";
                case "invalid_element":
                    return `Invalid value in ${z.origin}`;
                default:
                    return "Invalid input"
            }
        }
    }
// @from(Ln 19044, Col 4)
DK1 = L(() => {
    c3()
})
// @from(Ln 19048, Col 0)
function ZK1() {
    return {
        localeError: ON5()
    }
}
// @from(Ln 19053, Col 4)
AN5 = (q) => {
        let K = typeof q;
        switch (K) {
            case "number":
                return Number.isNaN(q) ? "NaN" : "nombro";
            case "object": {
                if (Array.isArray(q)) return "tabelo";
                if (q === null) return "senvalora";
                if (Object.getPrototypeOf(q) !== Object.prototype && q.constructor) return q.constructor.name
            }
        }
        return K
    }
// @from(Ln 19066, Col 4)
ON5 = () => {
        let q = {
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

        function K(z) {
            return q[z] ?? null
        }
        let _ = {
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
        return (z) => {
            switch (z.code) {
                case "invalid_type":
                    return `Nevalida enigo: atendiĝis ${z.expected}, riceviĝis ${AN5(z.input)}`;
                case "invalid_value":
                    if (z.values.length === 1) return `Nevalida enigo: atendiĝis ${H4(z.values[0])}`;
                    return `Nevalida opcio: atendiĝis unu el ${h7(z.values,"|")}`;
                case "too_big": {
                    let Y = z.inclusive ? "<=" : "<",
                        A = K(z.origin);
                    if (A) return `Tro granda: atendiĝis ke ${z.origin??"valoro"} havu ${Y}${z.maximum.toString()} ${A.unit??"elementojn"}`;
                    return `Tro granda: atendiĝis ke ${z.origin??"valoro"} havu ${Y}${z.maximum.toString()}`
                }
                case "too_small": {
                    let Y = z.inclusive ? ">=" : ">",
                        A = K(z.origin);
                    if (A) return `Tro malgranda: atendiĝis ke ${z.origin} havu ${Y}${z.minimum.toString()} ${A.unit}`;
                    return `Tro malgranda: atendiĝis ke ${z.origin} estu ${Y}${z.minimum.toString()}`
                }
                case "invalid_format": {
                    let Y = z;
                    if (Y.format === "starts_with") return `Nevalida karaktraro: devas komenciĝi per "${Y.prefix}"`;
                    if (Y.format === "ends_with") return `Nevalida karaktraro: devas finiĝi per "${Y.suffix}"`;
                    if (Y.format === "includes") return `Nevalida karaktraro: devas inkluzivi "${Y.includes}"`;
                    if (Y.format === "regex") return `Nevalida karaktraro: devas kongrui kun la modelo ${Y.pattern}`;
                    return `Nevalida ${_[Y.format]??z.format}`
                }
                case "not_multiple_of":
                    return `Nevalida nombro: devas esti oblo de ${z.divisor}`;
                case "unrecognized_keys":
                    return `Nekonata${z.keys.length>1?"j":""} ŝlosilo${z.keys.length>1?"j":""}: ${h7(z.keys,", ")}`;
                case "invalid_key":
                    return `Nevalida ŝlosilo en ${z.origin}`;
                case "invalid_union":
                    return "Nevalida enigo";
                case "invalid_element":
                    return `Nevalida valoro en ${z.origin}`;
                default:
                    return "Nevalida enigo"
            }
        }
    }
// @from(Ln 19161, Col 4)
Ek7 = L(() => {
    c3()
})
// @from(Ln 19165, Col 0)
function fK1() {
    return {
        localeError: wN5()
    }
}
// @from(Ln 19170, Col 4)
wN5 = () => {
    let q = {
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

    function K(Y) {
        return q[Y] ?? null
    }
    let _ = (Y) => {
            let A = typeof Y;
            switch (A) {
                case "number":
                    return Number.isNaN(Y) ? "NaN" : "número";
                case "object": {
                    if (Array.isArray(Y)) return "arreglo";
                    if (Y === null) return "nulo";
                    if (Object.getPrototypeOf(Y) !== Object.prototype) return Y.constructor.name
                }
            }
            return A
        },
        z = {
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
    return (Y) => {
        switch (Y.code) {
            case "invalid_type":
                return `Entrada inválida: se esperaba ${Y.expected}, recibido ${_(Y.input)}`;
            case "invalid_value":
                if (Y.values.length === 1) return `Entrada inválida: se esperaba ${H4(Y.values[0])}`;
                return `Opción inválida: se esperaba una de ${h7(Y.values,"|")}`;
            case "too_big": {
                let A = Y.inclusive ? "<=" : "<",
                    O = K(Y.origin);
                if (O) return `Demasiado grande: se esperaba que ${Y.origin??"valor"} tuviera ${A}${Y.maximum.toString()} ${O.unit??"elementos"}`;
                return `Demasiado grande: se esperaba que ${Y.origin??"valor"} fuera ${A}${Y.maximum.toString()}`
            }
            case "too_small": {
                let A = Y.inclusive ? ">=" : ">",
                    O = K(Y.origin);
                if (O) return `Demasiado pequeño: se esperaba que ${Y.origin} tuviera ${A}${Y.minimum.toString()} ${O.unit}`;
                return `Demasiado pequeño: se esperaba que ${Y.origin} fuera ${A}${Y.minimum.toString()}`
            }
            case "invalid_format": {
                let A = Y;
                if (A.format === "starts_with") return `Cadena inválida: debe comenzar con "${A.prefix}"`;
                if (A.format === "ends_with") return `Cadena inválida: debe terminar en "${A.suffix}"`;
                if (A.format === "includes") return `Cadena inválida: debe incluir "${A.includes}"`;
                if (A.format === "regex") return `Cadena inválida: debe coincidir con el patrón ${A.pattern}`;
                return `Inválido ${z[A.format]??Y.format}`
            }
            case "not_multiple_of":
                return `Número inválido: debe ser múltiplo de ${Y.divisor}`;
            case "unrecognized_keys":
                return `Llave${Y.keys.length>1?"s":""} desconocida${Y.keys.length>1?"s":""}: ${h7(Y.keys,", ")}`;
            case "invalid_key":
                return `Llave inválida en ${Y.origin}`;
            case "invalid_union":
                return "Entrada inválida";
            case "invalid_element":
                return `Valor inválido en ${Y.origin}`;
            default:
                return "Entrada inválida"
        }
    }
}
// @from(Ln 19278, Col 4)
yk7 = L(() => {
    c3()
})
// @from(Ln 19282, Col 0)
function GK1() {
    return {
        localeError: $N5()
    }
}
// @from(Ln 19287, Col 4)
$N5 = () => {
    let q = {
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

    function K(Y) {
        return q[Y] ?? null
    }
    let _ = (Y) => {
            let A = typeof Y;
            switch (A) {
                case "number":
                    return Number.isNaN(Y) ? "NaN" : "عدد";
                case "object": {
                    if (Array.isArray(Y)) return "آرایه";
                    if (Y === null) return "null";
                    if (Object.getPrototypeOf(Y) !== Object.prototype && Y.constructor) return Y.constructor.name
                }
            }
            return A
        },
        z = {
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
    return (Y) => {
        switch (Y.code) {
            case "invalid_type":
                return `ورودی نامعتبر: می‌بایست ${Y.expected} می‌بود، ${_(Y.input)} دریافت شد`;
            case "invalid_value":
                if (Y.values.length === 1) return `ورودی نامعتبر: می‌بایست ${H4(Y.values[0])} می‌بود`;
                return `گزینه نامعتبر: می‌بایست یکی از ${h7(Y.values,"|")} می‌بود`;
            case "too_big": {
                let A = Y.inclusive ? "<=" : "<",
                    O = K(Y.origin);
                if (O) return `خیلی بزرگ: ${Y.origin??"مقدار"} باید ${A}${Y.maximum.toString()} ${O.unit??"عنصر"} باشد`;
                return `خیلی بزرگ: ${Y.origin??"مقدار"} باید ${A}${Y.maximum.toString()} باشد`
            }
            case "too_small": {
                let A = Y.inclusive ? ">=" : ">",
                    O = K(Y.origin);
                if (O) return `خیلی کوچک: ${Y.origin} باید ${A}${Y.minimum.toString()} ${O.unit} باشد`;
                return `خیلی کوچک: ${Y.origin} باید ${A}${Y.minimum.toString()} باشد`
            }
            case "invalid_format": {
                let A = Y;
                if (A.format === "starts_with") return `رشته نامعتبر: باید با "${A.prefix}" شروع شود`;
                if (A.format === "ends_with") return `رشته نامعتبر: باید با "${A.suffix}" تمام شود`;
                if (A.format === "includes") return `رشته نامعتبر: باید شامل "${A.includes}" باشد`;
                if (A.format === "regex") return `رشته نامعتبر: باید با الگوی ${A.pattern} مطابقت داشته باشد`;
                return `${z[A.format]??Y.format} نامعتبر`
            }
            case "not_multiple_of":
                return `عدد نامعتبر: باید مضرب ${Y.divisor} باشد`;
            case "unrecognized_keys":
                return `کلید${Y.keys.length>1?"های":""} ناشناس: ${h7(Y.keys,", ")}`;
            case "invalid_key":
                return `کلید ناشناس در ${Y.origin}`;
            case "invalid_union":
                return "ورودی نامعتبر";
            case "invalid_element":
                return `مقدار نامعتبر در ${Y.origin}`;
            default:
                return "ورودی نامعتبر"
        }
    }
}
// @from(Ln 19395, Col 4)
Lk7 = L(() => {
    c3()
})
// @from(Ln 19399, Col 0)
function vK1() {
    return {
        localeError: jN5()
    }
}
// @from(Ln 19404, Col 4)
jN5 = () => {
    let q = {
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

    function K(Y) {
        return q[Y] ?? null
    }
    let _ = (Y) => {
            let A = typeof Y;
            switch (A) {
                case "number":
                    return Number.isNaN(Y) ? "NaN" : "number";
                case "object": {
                    if (Array.isArray(Y)) return "array";
                    if (Y === null) return "null";
                    if (Object.getPrototypeOf(Y) !== Object.prototype && Y.constructor) return Y.constructor.name
                }
            }
            return A
        },
        z = {
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
    return (Y) => {
        switch (Y.code) {
            case "invalid_type":
                return `Virheellinen tyyppi: odotettiin ${Y.expected}, oli ${_(Y.input)}`;
            case "invalid_value":
                if (Y.values.length === 1) return `Virheellinen syöte: täytyy olla ${H4(Y.values[0])}`;
                return `Virheellinen valinta: täytyy olla yksi seuraavista: ${h7(Y.values,"|")}`;
            case "too_big": {
                let A = Y.inclusive ? "<=" : "<",
                    O = K(Y.origin);
                if (O) return `Liian suuri: ${O.subject} täytyy olla ${A}${Y.maximum.toString()} ${O.unit}`.trim();
                return `Liian suuri: arvon täytyy olla ${A}${Y.maximum.toString()}`
            }
            case "too_small": {
                let A = Y.inclusive ? ">=" : ">",
                    O = K(Y.origin);
                if (O) return `Liian pieni: ${O.subject} täytyy olla ${A}${Y.minimum.toString()} ${O.unit}`.trim();
                return `Liian pieni: arvon täytyy olla ${A}${Y.minimum.toString()}`
            }
            case "invalid_format": {
                let A = Y;
                if (A.format === "starts_with") return `Virheellinen syöte: täytyy alkaa "${A.prefix}"`;
                if (A.format === "ends_with") return `Virheellinen syöte: täytyy loppua "${A.suffix}"`;
                if (A.format === "includes") return `Virheellinen syöte: täytyy sisältää "${A.includes}"`;
                if (A.format === "regex") return `Virheellinen syöte: täytyy vastata säännöllistä lauseketta ${A.pattern}`;
                return `Virheellinen ${z[A.format]??Y.format}`
            }
            case "not_multiple_of":
                return `Virheellinen luku: täytyy olla luvun ${Y.divisor} monikerta`;
            case "unrecognized_keys":
                return `${Y.keys.length>1?"Tuntemattomat avaimet":"Tuntematon avain"}: ${h7(Y.keys,", ")}`;
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
// @from(Ln 19528, Col 4)
hk7 = L(() => {
    c3()
})
// @from(Ln 19532, Col 0)
function TK1() {
    return {
        localeError: HN5()
    }
}
// @from(Ln 19537, Col 4)
HN5 = () => {
    let q = {
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

    function K(Y) {
        return q[Y] ?? null
    }
    let _ = (Y) => {
            let A = typeof Y;
            switch (A) {
                case "number":
                    return Number.isNaN(Y) ? "NaN" : "nombre";
                case "object": {
                    if (Array.isArray(Y)) return "tableau";
                    if (Y === null) return "null";
                    if (Object.getPrototypeOf(Y) !== Object.prototype && Y.constructor) return Y.constructor.name
                }
            }
            return A
        },
        z = {
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
    return (Y) => {
        switch (Y.code) {
            case "invalid_type":
                return `Entrée invalide : ${Y.expected} attendu, ${_(Y.input)} reçu`;
            case "invalid_value":
                if (Y.values.length === 1) return `Entrée invalide : ${H4(Y.values[0])} attendu`;
                return `Option invalide : une valeur parmi ${h7(Y.values,"|")} attendue`;
            case "too_big": {
                let A = Y.inclusive ? "<=" : "<",
                    O = K(Y.origin);
                if (O) return `Trop grand : ${Y.origin??"valeur"} doit ${O.verb} ${A}${Y.maximum.toString()} ${O.unit??"élément(s)"}`;
                return `Trop grand : ${Y.origin??"valeur"} doit être ${A}${Y.maximum.toString()}`
            }
            case "too_small": {
                let A = Y.inclusive ? ">=" : ">",
                    O = K(Y.origin);
                if (O) return `Trop petit : ${Y.origin} doit ${O.verb} ${A}${Y.minimum.toString()} ${O.unit}`;
                return `Trop petit : ${Y.origin} doit être ${A}${Y.minimum.toString()}`
            }
            case "invalid_format": {
                let A = Y;
                if (A.format === "starts_with") return `Chaîne invalide : doit commencer par "${A.prefix}"`;
                if (A.format === "ends_with") return `Chaîne invalide : doit se terminer par "${A.suffix}"`;
                if (A.format === "includes") return `Chaîne invalide : doit inclure "${A.includes}"`;
                if (A.format === "regex") return `Chaîne invalide : doit correspondre au modèle ${A.pattern}`;
                return `${z[A.format]??Y.format} invalide`
            }
            case "not_multiple_of":
                return `Nombre invalide : doit être un multiple de ${Y.divisor}`;
            case "unrecognized_keys":
                return `Clé${Y.keys.length>1?"s":""} non reconnue${Y.keys.length>1?"s":""} : ${h7(Y.keys,", ")}`;
            case "invalid_key":
                return `Clé invalide dans ${Y.origin}`;
            case "invalid_union":
                return "Entrée invalide";
            case "invalid_element":
                return `Valeur invalide dans ${Y.origin}`;
            default:
                return "Entrée invalide"
        }
    }
}
// @from(Ln 19645, Col 4)
Rk7 = L(() => {
    c3()
})
// @from(Ln 19649, Col 0)
function VK1() {
    return {
        localeError: JN5()
    }
}
// @from(Ln 19654, Col 4)
JN5 = () => {
    let q = {
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

    function K(Y) {
        return q[Y] ?? null
    }
    let _ = (Y) => {
            let A = typeof Y;
            switch (A) {
                case "number":
                    return Number.isNaN(Y) ? "NaN" : "number";
                case "object": {
                    if (Array.isArray(Y)) return "array";
                    if (Y === null) return "null";
                    if (Object.getPrototypeOf(Y) !== Object.prototype && Y.constructor) return Y.constructor.name
                }
            }
            return A
        },
        z = {
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
    return (Y) => {
        switch (Y.code) {
            case "invalid_type":
                return `Entrée invalide : attendu ${Y.expected}, reçu ${_(Y.input)}`;
            case "invalid_value":
                if (Y.values.length === 1) return `Entrée invalide : attendu ${H4(Y.values[0])}`;
                return `Option invalide : attendu l'une des valeurs suivantes ${h7(Y.values,"|")}`;
            case "too_big": {
                let A = Y.inclusive ? "≤" : "<",
                    O = K(Y.origin);
                if (O) return `Trop grand : attendu que ${Y.origin??"la valeur"} ait ${A}${Y.maximum.toString()} ${O.unit}`;
                return `Trop grand : attendu que ${Y.origin??"la valeur"} soit ${A}${Y.maximum.toString()}`
            }
            case "too_small": {
                let A = Y.inclusive ? "≥" : ">",
                    O = K(Y.origin);
                if (O) return `Trop petit : attendu que ${Y.origin} ait ${A}${Y.minimum.toString()} ${O.unit}`;
                return `Trop petit : attendu que ${Y.origin} soit ${A}${Y.minimum.toString()}`
            }
            case "invalid_format": {
                let A = Y;
                if (A.format === "starts_with") return `Chaîne invalide : doit commencer par "${A.prefix}"`;
                if (A.format === "ends_with") return `Chaîne invalide : doit se terminer par "${A.suffix}"`;
                if (A.format === "includes") return `Chaîne invalide : doit inclure "${A.includes}"`;
                if (A.format === "regex") return `Chaîne invalide : doit correspondre au motif ${A.pattern}`;
                return `${z[A.format]??Y.format} invalide`
            }
            case "not_multiple_of":
                return `Nombre invalide : doit être un multiple de ${Y.divisor}`;
            case "unrecognized_keys":
                return `Clé${Y.keys.length>1?"s":""} non reconnue${Y.keys.length>1?"s":""} : ${h7(Y.keys,", ")}`;
            case "invalid_key":
                return `Clé invalide dans ${Y.origin}`;
            case "invalid_union":
                return "Entrée invalide";
            case "invalid_element":
                return `Valeur invalide dans ${Y.origin}`;
            default:
                return "Entrée invalide"
        }
    }
}
// @from(Ln 19762, Col 4)
Sk7 = L(() => {
    c3()
})
// @from(Ln 19766, Col 0)
function kK1() {
    return {
        localeError: XN5()
    }
}
// @from(Ln 19771, Col 4)
XN5 = () => {
    let q = {
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

    function K(Y) {
        return q[Y] ?? null
    }
    let _ = (Y) => {
            let A = typeof Y;
            switch (A) {
                case "number":
                    return Number.isNaN(Y) ? "NaN" : "number";
                case "object": {
                    if (Array.isArray(Y)) return "array";
                    if (Y === null) return "null";
                    if (Object.getPrototypeOf(Y) !== Object.prototype && Y.constructor) return Y.constructor.name
                }
            }
            return A
        },
        z = {
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
    return (Y) => {
        switch (Y.code) {
            case "invalid_type":
                return `קלט לא תקין: צריך ${Y.expected}, התקבל ${_(Y.input)}`;
            case "invalid_value":
                if (Y.values.length === 1) return `קלט לא תקין: צריך ${H4(Y.values[0])}`;
                return `קלט לא תקין: צריך אחת מהאפשרויות  ${h7(Y.values,"|")}`;
            case "too_big": {
                let A = Y.inclusive ? "<=" : "<",
                    O = K(Y.origin);
                if (O) return `גדול מדי: ${Y.origin??"value"} צריך להיות ${A}${Y.maximum.toString()} ${O.unit??"elements"}`;
                return `גדול מדי: ${Y.origin??"value"} צריך להיות ${A}${Y.maximum.toString()}`
            }
            case "too_small": {
                let A = Y.inclusive ? ">=" : ">",
                    O = K(Y.origin);
                if (O) return `קטן מדי: ${Y.origin} צריך להיות ${A}${Y.minimum.toString()} ${O.unit}`;
                return `קטן מדי: ${Y.origin} צריך להיות ${A}${Y.minimum.toString()}`
            }
            case "invalid_format": {
                let A = Y;
                if (A.format === "starts_with") return `מחרוזת לא תקינה: חייבת להתחיל ב"${A.prefix}"`;
                if (A.format === "ends_with") return `מחרוזת לא תקינה: חייבת להסתיים ב "${A.suffix}"`;
                if (A.format === "includes") return `מחרוזת לא תקינה: חייבת לכלול "${A.includes}"`;
                if (A.format === "regex") return `מחרוזת לא תקינה: חייבת להתאים לתבנית ${A.pattern}`;
                return `${z[A.format]??Y.format} לא תקין`
            }
            case "not_multiple_of":
                return `מספר לא תקין: חייב להיות מכפלה של ${Y.divisor}`;
            case "unrecognized_keys":
                return `מפתח${Y.keys.length>1?"ות":""} לא מזוה${Y.keys.length>1?"ים":"ה"}: ${h7(Y.keys,", ")}`;
            case "invalid_key":
                return `מפתח לא תקין ב${Y.origin}`;
            case "invalid_union":
                return "קלט לא תקין";
            case "invalid_element":
                return `ערך לא תקין ב${Y.origin}`;
            default:
                return "קלט לא תקין"
        }
    }
}
// @from(Ln 19879, Col 4)
Ck7 = L(() => {
    c3()
})
// @from(Ln 19883, Col 0)
function NK1() {
    return {
        localeError: MN5()
    }
}
// @from(Ln 19888, Col 4)
MN5 = () => {
    let q = {
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

    function K(Y) {
        return q[Y] ?? null
    }
    let _ = (Y) => {
            let A = typeof Y;
            switch (A) {
                case "number":
                    return Number.isNaN(Y) ? "NaN" : "szám";
                case "object": {
                    if (Array.isArray(Y)) return "tömb";
                    if (Y === null) return "null";
                    if (Object.getPrototypeOf(Y) !== Object.prototype && Y.constructor) return Y.constructor.name
                }
            }
            return A
        },
        z = {
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
    return (Y) => {
        switch (Y.code) {
            case "invalid_type":
                return `Érvénytelen bemenet: a várt érték ${Y.expected}, a kapott érték ${_(Y.input)}`;
            case "invalid_value":
                if (Y.values.length === 1) return `Érvénytelen bemenet: a várt érték ${H4(Y.values[0])}`;
                return `Érvénytelen opció: valamelyik érték várt ${h7(Y.values,"|")}`;
            case "too_big": {
                let A = Y.inclusive ? "<=" : "<",
                    O = K(Y.origin);
                if (O) return `Túl nagy: ${Y.origin??"érték"} mérete túl nagy ${A}${Y.maximum.toString()} ${O.unit??"elem"}`;
                return `Túl nagy: a bemeneti érték ${Y.origin??"érték"} túl nagy: ${A}${Y.maximum.toString()}`
            }
            case "too_small": {
                let A = Y.inclusive ? ">=" : ">",
                    O = K(Y.origin);
                if (O) return `Túl kicsi: a bemeneti érték ${Y.origin} mérete túl kicsi ${A}${Y.minimum.toString()} ${O.unit}`;
                return `Túl kicsi: a bemeneti érték ${Y.origin} túl kicsi ${A}${Y.minimum.toString()}`
            }
            case "invalid_format": {
                let A = Y;
                if (A.format === "starts_with") return `Érvénytelen string: "${A.prefix}" értékkel kell kezdődnie`;
                if (A.format === "ends_with") return `Érvénytelen string: "${A.suffix}" értékkel kell végződnie`;
                if (A.format === "includes") return `Érvénytelen string: "${A.includes}" értéket kell tartalmaznia`;
                if (A.format === "regex") return `Érvénytelen string: ${A.pattern} mintának kell megfelelnie`;
                return `Érvénytelen ${z[A.format]??Y.format}`
            }
            case "not_multiple_of":
                return `Érvénytelen szám: ${Y.divisor} többszörösének kell lennie`;
            case "unrecognized_keys":
                return `Ismeretlen kulcs${Y.keys.length>1?"s":""}: ${h7(Y.keys,", ")}`;
            case "invalid_key":
                return `Érvénytelen kulcs ${Y.origin}`;
            case "invalid_union":
                return "Érvénytelen bemenet";
            case "invalid_element":
                return `Érvénytelen érték: ${Y.origin}`;
            default:
                return "Érvénytelen bemenet"
        }
    }
}
// @from(Ln 19996, Col 4)
bk7 = L(() => {
    c3()
})
// @from(Ln 20000, Col 0)
function EK1() {
    return {
        localeError: PN5()
    }
}
// @from(Ln 20005, Col 4)
PN5 = () => {
    let q = {
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

    function K(Y) {
        return q[Y] ?? null
    }
    let _ = (Y) => {
            let A = typeof Y;
            switch (A) {
                case "number":
                    return Number.isNaN(Y) ? "NaN" : "number";
                case "object": {
                    if (Array.isArray(Y)) return "array";
                    if (Y === null) return "null";
                    if (Object.getPrototypeOf(Y) !== Object.prototype && Y.constructor) return Y.constructor.name
                }
            }
            return A
        },
        z = {
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
    return (Y) => {
        switch (Y.code) {
            case "invalid_type":
                return `Input tidak valid: diharapkan ${Y.expected}, diterima ${_(Y.input)}`;
            case "invalid_value":
                if (Y.values.length === 1) return `Input tidak valid: diharapkan ${H4(Y.values[0])}`;
                return `Pilihan tidak valid: diharapkan salah satu dari ${h7(Y.values,"|")}`;
            case "too_big": {
                let A = Y.inclusive ? "<=" : "<",
                    O = K(Y.origin);
                if (O) return `Terlalu besar: diharapkan ${Y.origin??"value"} memiliki ${A}${Y.maximum.toString()} ${O.unit??"elemen"}`;
                return `Terlalu besar: diharapkan ${Y.origin??"value"} menjadi ${A}${Y.maximum.toString()}`
            }
            case "too_small": {
                let A = Y.inclusive ? ">=" : ">",
                    O = K(Y.origin);
                if (O) return `Terlalu kecil: diharapkan ${Y.origin} memiliki ${A}${Y.minimum.toString()} ${O.unit}`;
                return `Terlalu kecil: diharapkan ${Y.origin} menjadi ${A}${Y.minimum.toString()}`
            }
            case "invalid_format": {
                let A = Y;
                if (A.format === "starts_with") return `String tidak valid: harus dimulai dengan "${A.prefix}"`;
                if (A.format === "ends_with") return `String tidak valid: harus berakhir dengan "${A.suffix}"`;
                if (A.format === "includes") return `String tidak valid: harus menyertakan "${A.includes}"`;
                if (A.format === "regex") return `String tidak valid: harus sesuai pola ${A.pattern}`;
                return `${z[A.format]??Y.format} tidak valid`
            }
            case "not_multiple_of":
                return `Angka tidak valid: harus kelipatan dari ${Y.divisor}`;
            case "unrecognized_keys":
                return `Kunci tidak dikenali ${Y.keys.length>1?"s":""}: ${h7(Y.keys,", ")}`;
            case "invalid_key":
                return `Kunci tidak valid di ${Y.origin}`;
            case "invalid_union":
                return "Input tidak valid";
            case "invalid_element":
                return `Nilai tidak valid di ${Y.origin}`;
            default:
                return "Input tidak valid"
        }
    }
}
// @from(Ln 20113, Col 4)
Ik7 = L(() => {
    c3()
})
// @from(Ln 20117, Col 0)
function yK1() {
    return {
        localeError: WN5()
    }
}
// @from(Ln 20122, Col 4)
WN5 = () => {
    let q = {
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

    function K(Y) {
        return q[Y] ?? null
    }
    let _ = (Y) => {
            let A = typeof Y;
            switch (A) {
                case "number":
                    return Number.isNaN(Y) ? "NaN" : "numero";
                case "object": {
                    if (Array.isArray(Y)) return "vettore";
                    if (Y === null) return "null";
                    if (Object.getPrototypeOf(Y) !== Object.prototype && Y.constructor) return Y.constructor.name
                }
            }
            return A
        },
        z = {
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
    return (Y) => {
        switch (Y.code) {
            case "invalid_type":
                return `Input non valido: atteso ${Y.expected}, ricevuto ${_(Y.input)}`;
            case "invalid_value":
                if (Y.values.length === 1) return `Input non valido: atteso ${H4(Y.values[0])}`;
                return `Opzione non valida: atteso uno tra ${h7(Y.values,"|")}`;
            case "too_big": {
                let A = Y.inclusive ? "<=" : "<",
                    O = K(Y.origin);
                if (O) return `Troppo grande: ${Y.origin??"valore"} deve avere ${A}${Y.maximum.toString()} ${O.unit??"elementi"}`;
                return `Troppo grande: ${Y.origin??"valore"} deve essere ${A}${Y.maximum.toString()}`
            }
            case "too_small": {
                let A = Y.inclusive ? ">=" : ">",
                    O = K(Y.origin);
                if (O) return `Troppo piccolo: ${Y.origin} deve avere ${A}${Y.minimum.toString()} ${O.unit}`;
                return `Troppo piccolo: ${Y.origin} deve essere ${A}${Y.minimum.toString()}`
            }
            case "invalid_format": {
                let A = Y;
                if (A.format === "starts_with") return `Stringa non valida: deve iniziare con "${A.prefix}"`;
                if (A.format === "ends_with") return `Stringa non valida: deve terminare con "${A.suffix}"`;
                if (A.format === "includes") return `Stringa non valida: deve includere "${A.includes}"`;
                if (A.format === "regex") return `Stringa non valida: deve corrispondere al pattern ${A.pattern}`;
                return `Invalid ${z[A.format]??Y.format}`
            }
            case "not_multiple_of":
                return `Numero non valido: deve essere un multiplo di ${Y.divisor}`;
            case "unrecognized_keys":
                return `Chiav${Y.keys.length>1?"i":"e"} non riconosciut${Y.keys.length>1?"e":"a"}: ${h7(Y.keys,", ")}`;
            case "invalid_key":
                return `Chiave non valida in ${Y.origin}`;
            case "invalid_union":
                return "Input non valido";
            case "invalid_element":
                return `Valore non valido in ${Y.origin}`;
            default:
                return "Input non valido"
        }
    }
}
// @from(Ln 20230, Col 4)
xk7 = L(() => {
    c3()
})
// @from(Ln 20234, Col 0)
function LK1() {
    return {
        localeError: DN5()
    }
}
// @from(Ln 20239, Col 4)
DN5 = () => {
    let q = {
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

    function K(Y) {
        return q[Y] ?? null
    }
    let _ = (Y) => {
            let A = typeof Y;
            switch (A) {
                case "number":
                    return Number.isNaN(Y) ? "NaN" : "数値";
                case "object": {
                    if (Array.isArray(Y)) return "配列";
                    if (Y === null) return "null";
                    if (Object.getPrototypeOf(Y) !== Object.prototype && Y.constructor) return Y.constructor.name
                }
            }
            return A
        },
        z = {
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
    return (Y) => {
        switch (Y.code) {
            case "invalid_type":
                return `無効な入力: ${Y.expected}が期待されましたが、${_(Y.input)}が入力されました`;
            case "invalid_value":
                if (Y.values.length === 1) return `無効な入力: ${H4(Y.values[0])}が期待されました`;
                return `無効な選択: ${h7(Y.values,"、")}のいずれかである必要があります`;
            case "too_big": {
                let A = Y.inclusive ? "以下である" : "より小さい",
                    O = K(Y.origin);
                if (O) return `大きすぎる値: ${Y.origin??"値"}は${Y.maximum.toString()}${O.unit??"要素"}${A}必要があります`;
                return `大きすぎる値: ${Y.origin??"値"}は${Y.maximum.toString()}${A}必要があります`
            }
            case "too_small": {
                let A = Y.inclusive ? "以上である" : "より大きい",
                    O = K(Y.origin);
                if (O) return `小さすぎる値: ${Y.origin}は${Y.minimum.toString()}${O.unit}${A}必要があります`;
                return `小さすぎる値: ${Y.origin}は${Y.minimum.toString()}${A}必要があります`
            }
            case "invalid_format": {
                let A = Y;
                if (A.format === "starts_with") return `無効な文字列: "${A.prefix}"で始まる必要があります`;
                if (A.format === "ends_with") return `無効な文字列: "${A.suffix}"で終わる必要があります`;
                if (A.format === "includes") return `無効な文字列: "${A.includes}"を含む必要があります`;
                if (A.format === "regex") return `無効な文字列: パターン${A.pattern}に一致する必要があります`;
                return `無効な${z[A.format]??Y.format}`
            }
            case "not_multiple_of":
                return `無効な数値: ${Y.divisor}の倍数である必要があります`;
            case "unrecognized_keys":
                return `認識されていないキー${Y.keys.length>1?"群":""}: ${h7(Y.keys,"、")}`;
            case "invalid_key":
                return `${Y.origin}内の無効なキー`;
            case "invalid_union":
                return "無効な入力";
            case "invalid_element":
                return `${Y.origin}内の無効な値`;
            default:
                return "無効な入力"
        }
    }
}
// @from(Ln 20347, Col 4)
uk7 = L(() => {
    c3()
})
// @from(Ln 20351, Col 0)
function hK1() {
    return {
        localeError: ZN5()
    }
}
// @from(Ln 20356, Col 4)
ZN5 = () => {
    let q = {
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

    function K(Y) {
        return q[Y] ?? null
    }
    let _ = (Y) => {
            let A = typeof Y;
            switch (A) {
                case "number":
                    return Number.isNaN(Y) ? "មិនមែនជាលេខ (NaN)" : "លេខ";
                case "object": {
                    if (Array.isArray(Y)) return "អារេ (Array)";
                    if (Y === null) return "គ្មានតម្លៃ (null)";
                    if (Object.getPrototypeOf(Y) !== Object.prototype && Y.constructor) return Y.constructor.name
                }
            }
            return A
        },
        z = {
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
    return (Y) => {
        switch (Y.code) {
            case "invalid_type":
                return `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ ${Y.expected} ប៉ុន្តែទទួលបាន ${_(Y.input)}`;
            case "invalid_value":
                if (Y.values.length === 1) return `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ ${H4(Y.values[0])}`;
                return `ជម្រើសមិនត្រឹមត្រូវ៖ ត្រូវជាមួយក្នុងចំណោម ${h7(Y.values,"|")}`;
            case "too_big": {
                let A = Y.inclusive ? "<=" : "<",
                    O = K(Y.origin);
                if (O) return `ធំពេក៖ ត្រូវការ ${Y.origin??"តម្លៃ"} ${A} ${Y.maximum.toString()} ${O.unit??"ធាតុ"}`;
                return `ធំពេក៖ ត្រូវការ ${Y.origin??"តម្លៃ"} ${A} ${Y.maximum.toString()}`
            }
            case "too_small": {
                let A = Y.inclusive ? ">=" : ">",
                    O = K(Y.origin);
                if (O) return `តូចពេក៖ ត្រូវការ ${Y.origin} ${A} ${Y.minimum.toString()} ${O.unit}`;
                return `តូចពេក៖ ត្រូវការ ${Y.origin} ${A} ${Y.minimum.toString()}`
            }
            case "invalid_format": {
                let A = Y;
                if (A.format === "starts_with") return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវចាប់ផ្តើមដោយ "${A.prefix}"`;
                if (A.format === "ends_with") return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវបញ្ចប់ដោយ "${A.suffix}"`;
                if (A.format === "includes") return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវមាន "${A.includes}"`;
                if (A.format === "regex") return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវតែផ្គូផ្គងនឹងទម្រង់ដែលបានកំណត់ ${A.pattern}`;
                return `មិនត្រឹមត្រូវ៖ ${z[A.format]??Y.format}`
            }
            case "not_multiple_of":
                return `លេខមិនត្រឹមត្រូវ៖ ត្រូវតែជាពហុគុណនៃ ${Y.divisor}`;
            case "unrecognized_keys":
                return `រកឃើញសោមិនស្គាល់៖ ${h7(Y.keys,", ")}`;
            case "invalid_key":
                return `សោមិនត្រឹមត្រូវនៅក្នុង ${Y.origin}`;
            case "invalid_union":
                return "ទិន្នន័យមិនត្រឹមត្រូវ";
            case "invalid_element":
                return `ទិន្នន័យមិនត្រឹមត្រូវនៅក្នុង ${Y.origin}`;
            default:
                return "ទិន្នន័យមិនត្រឹមត្រូវ"
        }
    }
}
// @from(Ln 20464, Col 4)
mk7 = L(() => {
    c3()
})
// @from(Ln 20468, Col 0)
function RK1() {
    return {
        localeError: fN5()
    }
}
// @from(Ln 20473, Col 4)
fN5 = () => {
    let q = {
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

    function K(Y) {
        return q[Y] ?? null
    }
    let _ = (Y) => {
            let A = typeof Y;
            switch (A) {
                case "number":
                    return Number.isNaN(Y) ? "NaN" : "number";
                case "object": {
                    if (Array.isArray(Y)) return "array";
                    if (Y === null) return "null";
                    if (Object.getPrototypeOf(Y) !== Object.prototype && Y.constructor) return Y.constructor.name
                }
            }
            return A
        },
        z = {
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
    return (Y) => {
        switch (Y.code) {
            case "invalid_type":
                return `잘못된 입력: 예상 타입은 ${Y.expected}, 받은 타입은 ${_(Y.input)}입니다`;
            case "invalid_value":
                if (Y.values.length === 1) return `잘못된 입력: 값은 ${H4(Y.values[0])} 이어야 합니다`;
                return `잘못된 옵션: ${h7(Y.values,"또는 ")} 중 하나여야 합니다`;
            case "too_big": {
                let A = Y.inclusive ? "이하" : "미만",
                    O = A === "미만" ? "이어야 합니다" : "여야 합니다",
                    w = K(Y.origin),
                    $ = w?.unit ?? "요소";
                if (w) return `${Y.origin??"값"}이 너무 큽니다: ${Y.maximum.toString()}${$} ${A}${O}`;
                return `${Y.origin??"값"}이 너무 큽니다: ${Y.maximum.toString()} ${A}${O}`
            }
            case "too_small": {
                let A = Y.inclusive ? "이상" : "초과",
                    O = A === "이상" ? "이어야 합니다" : "여야 합니다",
                    w = K(Y.origin),
                    $ = w?.unit ?? "요소";
                if (w) return `${Y.origin??"값"}이 너무 작습니다: ${Y.minimum.toString()}${$} ${A}${O}`;
                return `${Y.origin??"값"}이 너무 작습니다: ${Y.minimum.toString()} ${A}${O}`
            }
            case "invalid_format": {
                let A = Y;
                if (A.format === "starts_with") return `잘못된 문자열: "${A.prefix}"(으)로 시작해야 합니다`;
                if (A.format === "ends_with") return `잘못된 문자열: "${A.suffix}"(으)로 끝나야 합니다`;
                if (A.format === "includes") return `잘못된 문자열: "${A.includes}"을(를) 포함해야 합니다`;
                if (A.format === "regex") return `잘못된 문자열: 정규식 ${A.pattern} 패턴과 일치해야 합니다`;
                return `잘못된 ${z[A.format]??Y.format}`
            }
            case "not_multiple_of":
                return `잘못된 숫자: ${Y.divisor}의 배수여야 합니다`;
            case "unrecognized_keys":
                return `인식할 수 없는 키: ${h7(Y.keys,", ")}`;
            case "invalid_key":
                return `잘못된 키: ${Y.origin}`;
            case "invalid_union":
                return "잘못된 입력";
            case "invalid_element":
                return `잘못된 값: ${Y.origin}`;
            default:
                return "잘못된 입력"
        }
    }
}
// @from(Ln 20585, Col 4)
Bk7 = L(() => {
    c3()
})
// @from(Ln 20589, Col 0)
function SK1() {
    return {
        localeError: GN5()
    }
}
// @from(Ln 20594, Col 4)
GN5 = () => {
    let q = {
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

    function K(Y) {
        return q[Y] ?? null
    }
    let _ = (Y) => {
            let A = typeof Y;
            switch (A) {
                case "number":
                    return Number.isNaN(Y) ? "NaN" : "број";
                case "object": {
                    if (Array.isArray(Y)) return "низа";
                    if (Y === null) return "null";
                    if (Object.getPrototypeOf(Y) !== Object.prototype && Y.constructor) return Y.constructor.name
                }
            }
            return A
        },
        z = {
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
    return (Y) => {
        switch (Y.code) {
            case "invalid_type":
                return `Грешен внес: се очекува ${Y.expected}, примено ${_(Y.input)}`;
            case "invalid_value":
                if (Y.values.length === 1) return `Invalid input: expected ${H4(Y.values[0])}`;
                return `Грешана опција: се очекува една ${h7(Y.values,"|")}`;
            case "too_big": {
                let A = Y.inclusive ? "<=" : "<",
                    O = K(Y.origin);
                if (O) return `Премногу голем: се очекува ${Y.origin??"вредноста"} да има ${A}${Y.maximum.toString()} ${O.unit??"елементи"}`;
                return `Премногу голем: се очекува ${Y.origin??"вредноста"} да биде ${A}${Y.maximum.toString()}`
            }
            case "too_small": {
                let A = Y.inclusive ? ">=" : ">",
                    O = K(Y.origin);
                if (O) return `Премногу мал: се очекува ${Y.origin} да има ${A}${Y.minimum.toString()} ${O.unit}`;
                return `Премногу мал: се очекува ${Y.origin} да биде ${A}${Y.minimum.toString()}`
            }
            case "invalid_format": {
                let A = Y;
                if (A.format === "starts_with") return `Неважечка низа: мора да започнува со "${A.prefix}"`;
                if (A.format === "ends_with") return `Неважечка низа: мора да завршува со "${A.suffix}"`;
                if (A.format === "includes") return `Неважечка низа: мора да вклучува "${A.includes}"`;
                if (A.format === "regex") return `Неважечка низа: мора да одгоара на патернот ${A.pattern}`;
                return `Invalid ${z[A.format]??Y.format}`
            }
            case "not_multiple_of":
                return `Грешен број: мора да биде делив со ${Y.divisor}`;
            case "unrecognized_keys":
                return `${Y.keys.length>1?"Непрепознаени клучеви":"Непрепознаен клуч"}: ${h7(Y.keys,", ")}`;
            case "invalid_key":
                return `Грешен клуч во ${Y.origin}`;
            case "invalid_union":
                return "Грешен внес";
            case "invalid_element":
                return `Грешна вредност во ${Y.origin}`;
            default:
                return "Грешен внес"
        }
    }
}
// @from(Ln 20702, Col 4)
pk7 = L(() => {
    c3()
})
// @from(Ln 20706, Col 0)
function CK1() {
    return {
        localeError: vN5()
    }
}
// @from(Ln 20711, Col 4)
vN5 = () => {
    let q = {
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

    function K(Y) {
        return q[Y] ?? null
    }
    let _ = (Y) => {
            let A = typeof Y;
            switch (A) {
                case "number":
                    return Number.isNaN(Y) ? "NaN" : "nombor";
                case "object": {
                    if (Array.isArray(Y)) return "array";
                    if (Y === null) return "null";
                    if (Object.getPrototypeOf(Y) !== Object.prototype && Y.constructor) return Y.constructor.name
                }
            }
            return A
        },
        z = {
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
    return (Y) => {
        switch (Y.code) {
            case "invalid_type":
                return `Input tidak sah: dijangka ${Y.expected}, diterima ${_(Y.input)}`;
            case "invalid_value":
                if (Y.values.length === 1) return `Input tidak sah: dijangka ${H4(Y.values[0])}`;
                return `Pilihan tidak sah: dijangka salah satu daripada ${h7(Y.values,"|")}`;
            case "too_big": {
                let A = Y.inclusive ? "<=" : "<",
                    O = K(Y.origin);
                if (O) return `Terlalu besar: dijangka ${Y.origin??"nilai"} ${O.verb} ${A}${Y.maximum.toString()} ${O.unit??"elemen"}`;
                return `Terlalu besar: dijangka ${Y.origin??"nilai"} adalah ${A}${Y.maximum.toString()}`
            }
            case "too_small": {
                let A = Y.inclusive ? ">=" : ">",
                    O = K(Y.origin);
                if (O) return `Terlalu kecil: dijangka ${Y.origin} ${O.verb} ${A}${Y.minimum.toString()} ${O.unit}`;
                return `Terlalu kecil: dijangka ${Y.origin} adalah ${A}${Y.minimum.toString()}`
            }
            case "invalid_format": {
                let A = Y;
                if (A.format === "starts_with") return `String tidak sah: mesti bermula dengan "${A.prefix}"`;
                if (A.format === "ends_with") return `String tidak sah: mesti berakhir dengan "${A.suffix}"`;
                if (A.format === "includes") return `String tidak sah: mesti mengandungi "${A.includes}"`;
                if (A.format === "regex") return `String tidak sah: mesti sepadan dengan corak ${A.pattern}`;
                return `${z[A.format]??Y.format} tidak sah`
            }
            case "not_multiple_of":
                return `Nombor tidak sah: perlu gandaan ${Y.divisor}`;
            case "unrecognized_keys":
                return `Kunci tidak dikenali: ${h7(Y.keys,", ")}`;
            case "invalid_key":
                return `Kunci tidak sah dalam ${Y.origin}`;
            case "invalid_union":
                return "Input tidak sah";
            case "invalid_element":
                return `Nilai tidak sah dalam ${Y.origin}`;
            default:
                return "Input tidak sah"
        }
    }
}
// @from(Ln 20819, Col 4)
Fk7 = L(() => {
    c3()
})
// @from(Ln 20823, Col 0)
function bK1() {
    return {
        localeError: TN5()
    }
}
// @from(Ln 20828, Col 4)
TN5 = () => {
    let q = {
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

    function K(Y) {
        return q[Y] ?? null
    }
    let _ = (Y) => {
            let A = typeof Y;
            switch (A) {
                case "number":
                    return Number.isNaN(Y) ? "NaN" : "getal";
                case "object": {
                    if (Array.isArray(Y)) return "array";
                    if (Y === null) return "null";
                    if (Object.getPrototypeOf(Y) !== Object.prototype && Y.constructor) return Y.constructor.name
                }
            }
            return A
        },
        z = {
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
    return (Y) => {
        switch (Y.code) {
            case "invalid_type":
                return `Ongeldige invoer: verwacht ${Y.expected}, ontving ${_(Y.input)}`;
            case "invalid_value":
                if (Y.values.length === 1) return `Ongeldige invoer: verwacht ${H4(Y.values[0])}`;
                return `Ongeldige optie: verwacht één van ${h7(Y.values,"|")}`;
            case "too_big": {
                let A = Y.inclusive ? "<=" : "<",
                    O = K(Y.origin);
                if (O) return `Te lang: verwacht dat ${Y.origin??"waarde"} ${A}${Y.maximum.toString()} ${O.unit??"elementen"} bevat`;
                return `Te lang: verwacht dat ${Y.origin??"waarde"} ${A}${Y.maximum.toString()} is`
            }
            case "too_small": {
                let A = Y.inclusive ? ">=" : ">",
                    O = K(Y.origin);
                if (O) return `Te kort: verwacht dat ${Y.origin} ${A}${Y.minimum.toString()} ${O.unit} bevat`;
                return `Te kort: verwacht dat ${Y.origin} ${A}${Y.minimum.toString()} is`
            }
            case "invalid_format": {
                let A = Y;
                if (A.format === "starts_with") return `Ongeldige tekst: moet met "${A.prefix}" beginnen`;
                if (A.format === "ends_with") return `Ongeldige tekst: moet op "${A.suffix}" eindigen`;
                if (A.format === "includes") return `Ongeldige tekst: moet "${A.includes}" bevatten`;
                if (A.format === "regex") return `Ongeldige tekst: moet overeenkomen met patroon ${A.pattern}`;
                return `Ongeldig: ${z[A.format]??Y.format}`
            }
            case "not_multiple_of":
                return `Ongeldig getal: moet een veelvoud van ${Y.divisor} zijn`;
            case "unrecognized_keys":
                return `Onbekende key${Y.keys.length>1?"s":""}: ${h7(Y.keys,", ")}`;
            case "invalid_key":
                return `Ongeldige key in ${Y.origin}`;
            case "invalid_union":
                return "Ongeldige invoer";
            case "invalid_element":
                return `Ongeldige waarde in ${Y.origin}`;
            default:
                return "Ongeldige invoer"
        }
    }
}
// @from(Ln 20932, Col 4)
gk7 = L(() => {
    c3()
})
// @from(Ln 20936, Col 0)
function IK1() {
    return {
        localeError: VN5()
    }
}
// @from(Ln 20941, Col 4)
VN5 = () => {
    let q = {
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

    function K(Y) {
        return q[Y] ?? null
    }
    let _ = (Y) => {
            let A = typeof Y;
            switch (A) {
                case "number":
                    return Number.isNaN(Y) ? "NaN" : "tall";
                case "object": {
                    if (Array.isArray(Y)) return "liste";
                    if (Y === null) return "null";
                    if (Object.getPrototypeOf(Y) !== Object.prototype && Y.constructor) return Y.constructor.name
                }
            }
            return A
        },
        z = {
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
    return (Y) => {
        switch (Y.code) {
            case "invalid_type":
                return `Ugyldig input: forventet ${Y.expected}, fikk ${_(Y.input)}`;
            case "invalid_value":
                if (Y.values.length === 1) return `Ugyldig verdi: forventet ${H4(Y.values[0])}`;
                return `Ugyldig valg: forventet en av ${h7(Y.values,"|")}`;
            case "too_big": {
                let A = Y.inclusive ? "<=" : "<",
                    O = K(Y.origin);
                if (O) return `For stor(t): forventet ${Y.origin??"value"} til å ha ${A}${Y.maximum.toString()} ${O.unit??"elementer"}`;
                return `For stor(t): forventet ${Y.origin??"value"} til å ha ${A}${Y.maximum.toString()}`
            }
            case "too_small": {
                let A = Y.inclusive ? ">=" : ">",
                    O = K(Y.origin);
                if (O) return `For lite(n): forventet ${Y.origin} til å ha ${A}${Y.minimum.toString()} ${O.unit}`;
                return `For lite(n): forventet ${Y.origin} til å ha ${A}${Y.minimum.toString()}`
            }
            case "invalid_format": {
                let A = Y;
                if (A.format === "starts_with") return `Ugyldig streng: må starte med "${A.prefix}"`;
                if (A.format === "ends_with") return `Ugyldig streng: må ende med "${A.suffix}"`;
                if (A.format === "includes") return `Ugyldig streng: må inneholde "${A.includes}"`;
                if (A.format === "regex") return `Ugyldig streng: må matche mønsteret ${A.pattern}`;
                return `Ugyldig ${z[A.format]??Y.format}`
            }
            case "not_multiple_of":
                return `Ugyldig tall: må være et multiplum av ${Y.divisor}`;
            case "unrecognized_keys":
                return `${Y.keys.length>1?"Ukjente nøkler":"Ukjent nøkkel"}: ${h7(Y.keys,", ")}`;
            case "invalid_key":
                return `Ugyldig nøkkel i ${Y.origin}`;
            case "invalid_union":
                return "Ugyldig input";
            case "invalid_element":
                return `Ugyldig verdi i ${Y.origin}`;
            default:
                return "Ugyldig input"
        }
    }
}
// @from(Ln 21049, Col 4)
Uk7 = L(() => {
    c3()
})
// @from(Ln 21053, Col 0)
function xK1() {
    return {
        localeError: kN5()
    }
}
// @from(Ln 21058, Col 4)
kN5 = () => {
    let q = {
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

    function K(Y) {
        return q[Y] ?? null
    }
    let _ = (Y) => {
            let A = typeof Y;
            switch (A) {
                case "number":
                    return Number.isNaN(Y) ? "NaN" : "numara";
                case "object": {
                    if (Array.isArray(Y)) return "saf";
                    if (Y === null) return "gayb";
                    if (Object.getPrototypeOf(Y) !== Object.prototype && Y.constructor) return Y.constructor.name
                }
            }
            return A
        },
        z = {
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
    return (Y) => {
        switch (Y.code) {
            case "invalid_type":
                return `Fâsit giren: umulan ${Y.expected}, alınan ${_(Y.input)}`;
            case "invalid_value":
                if (Y.values.length === 1) return `Fâsit giren: umulan ${H4(Y.values[0])}`;
                return `Fâsit tercih: mûteberler ${h7(Y.values,"|")}`;
            case "too_big": {
                let A = Y.inclusive ? "<=" : "<",
                    O = K(Y.origin);
                if (O) return `Fazla büyük: ${Y.origin??"value"}, ${A}${Y.maximum.toString()} ${O.unit??"elements"} sahip olmalıydı.`;
                return `Fazla büyük: ${Y.origin??"value"}, ${A}${Y.maximum.toString()} olmalıydı.`
            }
            case "too_small": {
                let A = Y.inclusive ? ">=" : ">",
                    O = K(Y.origin);
                if (O) return `Fazla küçük: ${Y.origin}, ${A}${Y.minimum.toString()} ${O.unit} sahip olmalıydı.`;
                return `Fazla küçük: ${Y.origin}, ${A}${Y.minimum.toString()} olmalıydı.`
            }
            case "invalid_format": {
                let A = Y;
                if (A.format === "starts_with") return `Fâsit metin: "${A.prefix}" ile başlamalı.`;
                if (A.format === "ends_with") return `Fâsit metin: "${A.suffix}" ile bitmeli.`;
                if (A.format === "includes") return `Fâsit metin: "${A.includes}" ihtivâ etmeli.`;
                if (A.format === "regex") return `Fâsit metin: ${A.pattern} nakşına uymalı.`;
                return `Fâsit ${z[A.format]??Y.format}`
            }
            case "not_multiple_of":
                return `Fâsit sayı: ${Y.divisor} katı olmalıydı.`;
            case "unrecognized_keys":
                return `Tanınmayan anahtar ${Y.keys.length>1?"s":""}: ${h7(Y.keys,", ")}`;
            case "invalid_key":
                return `${Y.origin} için tanınmayan anahtar var.`;
            case "invalid_union":
                return "Giren tanınamadı.";
            case "invalid_element":
                return `${Y.origin} için tanınmayan kıymet var.`;
            default:
                return "Kıymet tanınamadı."
        }
    }
}
// @from(Ln 21166, Col 4)
Qk7 = L(() => {
    c3()
})
// @from(Ln 21170, Col 0)
function uK1() {
    return {
        localeError: NN5()
    }
}
// @from(Ln 21175, Col 4)
NN5 = () => {
    let q = {
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

    function K(Y) {
        return q[Y] ?? null
    }
    let _ = (Y) => {
            let A = typeof Y;
            switch (A) {
                case "number":
                    return Number.isNaN(Y) ? "NaN" : "عدد";
                case "object": {
                    if (Array.isArray(Y)) return "ارې";
                    if (Y === null) return "null";
                    if (Object.getPrototypeOf(Y) !== Object.prototype && Y.constructor) return Y.constructor.name
                }
            }
            return A
        },
        z = {
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
    return (Y) => {
        switch (Y.code) {
            case "invalid_type":
                return `ناسم ورودي: باید ${Y.expected} وای, مګر ${_(Y.input)} ترلاسه شو`;
            case "invalid_value":
                if (Y.values.length === 1) return `ناسم ورودي: باید ${H4(Y.values[0])} وای`;
                return `ناسم انتخاب: باید یو له ${h7(Y.values,"|")} څخه وای`;
            case "too_big": {
                let A = Y.inclusive ? "<=" : "<",
                    O = K(Y.origin);
                if (O) return `ډیر لوی: ${Y.origin??"ارزښت"} باید ${A}${Y.maximum.toString()} ${O.unit??"عنصرونه"} ولري`;
                return `ډیر لوی: ${Y.origin??"ارزښت"} باید ${A}${Y.maximum.toString()} وي`
            }
            case "too_small": {
                let A = Y.inclusive ? ">=" : ">",
                    O = K(Y.origin);
                if (O) return `ډیر کوچنی: ${Y.origin} باید ${A}${Y.minimum.toString()} ${O.unit} ولري`;
                return `ډیر کوچنی: ${Y.origin} باید ${A}${Y.minimum.toString()} وي`
            }
            case "invalid_format": {
                let A = Y;
                if (A.format === "starts_with") return `ناسم متن: باید د "${A.prefix}" سره پیل شي`;
                if (A.format === "ends_with") return `ناسم متن: باید د "${A.suffix}" سره پای ته ورسيږي`;
                if (A.format === "includes") return `ناسم متن: باید "${A.includes}" ولري`;
                if (A.format === "regex") return `ناسم متن: باید د ${A.pattern} سره مطابقت ولري`;
                return `${z[A.format]??Y.format} ناسم دی`
            }
            case "not_multiple_of":
                return `ناسم عدد: باید د ${Y.divisor} مضرب وي`;
            case "unrecognized_keys":
                return `ناسم ${Y.keys.length>1?"کلیډونه":"کلیډ"}: ${h7(Y.keys,", ")}`;
            case "invalid_key":
                return `ناسم کلیډ په ${Y.origin} کې`;
            case "invalid_union":
                return "ناسمه ورودي";
            case "invalid_element":
                return `ناسم عنصر په ${Y.origin} کې`;
            default:
                return "ناسمه ورودي"
        }
    }
}
// @from(Ln 21283, Col 4)
dk7 = L(() => {
    c3()
})
// @from(Ln 21287, Col 0)
function mK1() {
    return {
        localeError: EN5()
    }
}
// @from(Ln 21292, Col 4)
EN5 = () => {
    let q = {
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

    function K(Y) {
        return q[Y] ?? null
    }
    let _ = (Y) => {
            let A = typeof Y;
            switch (A) {
                case "number":
                    return Number.isNaN(Y) ? "NaN" : "liczba";
                case "object": {
                    if (Array.isArray(Y)) return "tablica";
                    if (Y === null) return "null";
                    if (Object.getPrototypeOf(Y) !== Object.prototype && Y.constructor) return Y.constructor.name
                }
            }
            return A
        },
        z = {
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
    return (Y) => {
        switch (Y.code) {
            case "invalid_type":
                return `Nieprawidłowe dane wejściowe: oczekiwano ${Y.expected}, otrzymano ${_(Y.input)}`;
            case "invalid_value":
                if (Y.values.length === 1) return `Nieprawidłowe dane wejściowe: oczekiwano ${H4(Y.values[0])}`;
                return `Nieprawidłowa opcja: oczekiwano jednej z wartości ${h7(Y.values,"|")}`;
            case "too_big": {
                let A = Y.inclusive ? "<=" : "<",
                    O = K(Y.origin);
                if (O) return `Za duża wartość: oczekiwano, że ${Y.origin??"wartość"} będzie mieć ${A}${Y.maximum.toString()} ${O.unit??"elementów"}`;
                return `Zbyt duż(y/a/e): oczekiwano, że ${Y.origin??"wartość"} będzie wynosić ${A}${Y.maximum.toString()}`
            }
            case "too_small": {
                let A = Y.inclusive ? ">=" : ">",
                    O = K(Y.origin);
                if (O) return `Za mała wartość: oczekiwano, że ${Y.origin??"wartość"} będzie mieć ${A}${Y.minimum.toString()} ${O.unit??"elementów"}`;
                return `Zbyt mał(y/a/e): oczekiwano, że ${Y.origin??"wartość"} będzie wynosić ${A}${Y.minimum.toString()}`
            }
            case "invalid_format": {
                let A = Y;
                if (A.format === "starts_with") return `Nieprawidłowy ciąg znaków: musi zaczynać się od "${A.prefix}"`;
                if (A.format === "ends_with") return `Nieprawidłowy ciąg znaków: musi kończyć się na "${A.suffix}"`;
                if (A.format === "includes") return `Nieprawidłowy ciąg znaków: musi zawierać "${A.includes}"`;
                if (A.format === "regex") return `Nieprawidłowy ciąg znaków: musi odpowiadać wzorcowi ${A.pattern}`;
                return `Nieprawidłow(y/a/e) ${z[A.format]??Y.format}`
            }
            case "not_multiple_of":
                return `Nieprawidłowa liczba: musi być wielokrotnością ${Y.divisor}`;
            case "unrecognized_keys":
                return `Nierozpoznane klucze${Y.keys.length>1?"s":""}: ${h7(Y.keys,", ")}`;
            case "invalid_key":
                return `Nieprawidłowy klucz w ${Y.origin}`;
            case "invalid_union":
                return "Nieprawidłowe dane wejściowe";
            case "invalid_element":
                return `Nieprawidłowa wartość w ${Y.origin}`;
            default:
                return "Nieprawidłowe dane wejściowe"
        }
    }
}
// @from(Ln 21400, Col 4)
ck7 = L(() => {
    c3()
})
// @from(Ln 21404, Col 0)
function BK1() {
    return {
        localeError: yN5()
    }
}
// @from(Ln 21409, Col 4)
yN5 = () => {
    let q = {
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

    function K(Y) {
        return q[Y] ?? null
    }
    let _ = (Y) => {
            let A = typeof Y;
            switch (A) {
                case "number":
                    return Number.isNaN(Y) ? "NaN" : "número";
                case "object": {
                    if (Array.isArray(Y)) return "array";
                    if (Y === null) return "nulo";
                    if (Object.getPrototypeOf(Y) !== Object.prototype && Y.constructor) return Y.constructor.name
                }
            }
            return A
        },
        z = {
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
    return (Y) => {
        switch (Y.code) {
            case "invalid_type":
                return `Tipo inválido: esperado ${Y.expected}, recebido ${_(Y.input)}`;
            case "invalid_value":
                if (Y.values.length === 1) return `Entrada inválida: esperado ${H4(Y.values[0])}`;
                return `Opção inválida: esperada uma das ${h7(Y.values,"|")}`;
            case "too_big": {
                let A = Y.inclusive ? "<=" : "<",
                    O = K(Y.origin);
                if (O) return `Muito grande: esperado que ${Y.origin??"valor"} tivesse ${A}${Y.maximum.toString()} ${O.unit??"elementos"}`;
                return `Muito grande: esperado que ${Y.origin??"valor"} fosse ${A}${Y.maximum.toString()}`
            }
            case "too_small": {
                let A = Y.inclusive ? ">=" : ">",
                    O = K(Y.origin);
                if (O) return `Muito pequeno: esperado que ${Y.origin} tivesse ${A}${Y.minimum.toString()} ${O.unit}`;
                return `Muito pequeno: esperado que ${Y.origin} fosse ${A}${Y.minimum.toString()}`
            }
            case "invalid_format": {
                let A = Y;
                if (A.format === "starts_with") return `Texto inválido: deve começar com "${A.prefix}"`;
                if (A.format === "ends_with") return `Texto inválido: deve terminar com "${A.suffix}"`;
                if (A.format === "includes") return `Texto inválido: deve incluir "${A.includes}"`;
                if (A.format === "regex") return `Texto inválido: deve corresponder ao padrão ${A.pattern}`;
                return `${z[A.format]??Y.format} inválido`
            }
            case "not_multiple_of":
                return `Número inválido: deve ser múltiplo de ${Y.divisor}`;
            case "unrecognized_keys":
                return `Chave${Y.keys.length>1?"s":""} desconhecida${Y.keys.length>1?"s":""}: ${h7(Y.keys,", ")}`;
            case "invalid_key":
                return `Chave inválida em ${Y.origin}`;
            case "invalid_union":
                return "Entrada inválida";
            case "invalid_element":
                return `Valor inválido em ${Y.origin}`;
            default:
                return "Campo inválido"
        }
    }
}
// @from(Ln 21517, Col 4)
lk7 = L(() => {
    c3()
})
// @from(Ln 21521, Col 0)
function nk7(q, K, _, z) {
    let Y = Math.abs(q),
        A = Y % 10,
        O = Y % 100;
    if (O >= 11 && O <= 19) return z;
    if (A === 1) return K;
    if (A >= 2 && A <= 4) return _;
    return z
}
// @from(Ln 21531, Col 0)
function pK1() {
    return {
        localeError: LN5()
    }
}
// @from(Ln 21536, Col 4)
LN5 = () => {
    let q = {
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

    function K(Y) {
        return q[Y] ?? null
    }
    let _ = (Y) => {
            let A = typeof Y;
            switch (A) {
                case "number":
                    return Number.isNaN(Y) ? "NaN" : "число";
                case "object": {
                    if (Array.isArray(Y)) return "массив";
                    if (Y === null) return "null";
                    if (Object.getPrototypeOf(Y) !== Object.prototype && Y.constructor) return Y.constructor.name
                }
            }
            return A
        },
        z = {
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
    return (Y) => {
        switch (Y.code) {
            case "invalid_type":
                return `Неверный ввод: ожидалось ${Y.expected}, получено ${_(Y.input)}`;
            case "invalid_value":
                if (Y.values.length === 1) return `Неверный ввод: ожидалось ${H4(Y.values[0])}`;
                return `Неверный вариант: ожидалось одно из ${h7(Y.values,"|")}`;
            case "too_big": {
                let A = Y.inclusive ? "<=" : "<",
                    O = K(Y.origin);
                if (O) {
                    let w = Number(Y.maximum),
                        $ = nk7(w, O.unit.one, O.unit.few, O.unit.many);
                    return `Слишком большое значение: ожидалось, что ${Y.origin??"значение"} будет иметь ${A}${Y.maximum.toString()} ${$}`
                }
                return `Слишком большое значение: ожидалось, что ${Y.origin??"значение"} будет ${A}${Y.maximum.toString()}`
            }
            case "too_small": {
                let A = Y.inclusive ? ">=" : ">",
                    O = K(Y.origin);
                if (O) {
                    let w = Number(Y.minimum),
                        $ = nk7(w, O.unit.one, O.unit.few, O.unit.many);
                    return `Слишком маленькое значение: ожидалось, что ${Y.origin} будет иметь ${A}${Y.minimum.toString()} ${$}`
                }
                return `Слишком маленькое значение: ожидалось, что ${Y.origin} будет ${A}${Y.minimum.toString()}`
            }
            case "invalid_format": {
                let A = Y;
                if (A.format === "starts_with") return `Неверная строка: должна начинаться с "${A.prefix}"`;
                if (A.format === "ends_with") return `Неверная строка: должна заканчиваться на "${A.suffix}"`;
                if (A.format === "includes") return `Неверная строка: должна содержать "${A.includes}"`;
                if (A.format === "regex") return `Неверная строка: должна соответствовать шаблону ${A.pattern}`;
                return `Неверный ${z[A.format]??Y.format}`
            }
            case "not_multiple_of":
                return `Неверное число: должно быть кратным ${Y.divisor}`;
            case "unrecognized_keys":
                return `Нераспознанн${Y.keys.length>1?"ые":"ый"} ключ${Y.keys.length>1?"и":""}: ${h7(Y.keys,", ")}`;
            case "invalid_key":
                return `Неверный ключ в ${Y.origin}`;
            case "invalid_union":
                return "Неверные входные данные";
            case "invalid_element":
                return `Неверное значение в ${Y.origin}`;
            default:
                return "Неверные входные данные"
        }
    }
}
// @from(Ln 21668, Col 4)
ik7 = L(() => {
    c3()
})
// @from(Ln 21672, Col 0)
function FK1() {
    return {
        localeError: hN5()
    }
}