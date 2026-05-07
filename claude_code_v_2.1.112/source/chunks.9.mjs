
// @from(Ln 21677, Col 4)
hN5 = () => {
    let q = {
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

    function K(Y) {
        return q[Y] ?? null
    }
    let _ = (Y) => {
            let A = typeof Y;
            switch (A) {
                case "number":
                    return Number.isNaN(Y) ? "NaN" : "število";
                case "object": {
                    if (Array.isArray(Y)) return "tabela";
                    if (Y === null) return "null";
                    if (Object.getPrototypeOf(Y) !== Object.prototype && Y.constructor) return Y.constructor.name
                }
            }
            return A
        },
        z = {
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
    return (Y) => {
        switch (Y.code) {
            case "invalid_type":
                return `Neveljaven vnos: pričakovano ${Y.expected}, prejeto ${_(Y.input)}`;
            case "invalid_value":
                if (Y.values.length === 1) return `Neveljaven vnos: pričakovano ${H4(Y.values[0])}`;
                return `Neveljavna možnost: pričakovano eno izmed ${h7(Y.values,"|")}`;
            case "too_big": {
                let A = Y.inclusive ? "<=" : "<",
                    O = K(Y.origin);
                if (O) return `Preveliko: pričakovano, da bo ${Y.origin??"vrednost"} imelo ${A}${Y.maximum.toString()} ${O.unit??"elementov"}`;
                return `Preveliko: pričakovano, da bo ${Y.origin??"vrednost"} ${A}${Y.maximum.toString()}`
            }
            case "too_small": {
                let A = Y.inclusive ? ">=" : ">",
                    O = K(Y.origin);
                if (O) return `Premajhno: pričakovano, da bo ${Y.origin} imelo ${A}${Y.minimum.toString()} ${O.unit}`;
                return `Premajhno: pričakovano, da bo ${Y.origin} ${A}${Y.minimum.toString()}`
            }
            case "invalid_format": {
                let A = Y;
                if (A.format === "starts_with") return `Neveljaven niz: mora se začeti z "${A.prefix}"`;
                if (A.format === "ends_with") return `Neveljaven niz: mora se končati z "${A.suffix}"`;
                if (A.format === "includes") return `Neveljaven niz: mora vsebovati "${A.includes}"`;
                if (A.format === "regex") return `Neveljaven niz: mora ustrezati vzorcu ${A.pattern}`;
                return `Neveljaven ${z[A.format]??Y.format}`
            }
            case "not_multiple_of":
                return `Neveljavno število: mora biti večkratnik ${Y.divisor}`;
            case "unrecognized_keys":
                return `Neprepoznan${Y.keys.length>1?"i ključi":" ključ"}: ${h7(Y.keys,", ")}`;
            case "invalid_key":
                return `Neveljaven ključ v ${Y.origin}`;
            case "invalid_union":
                return "Neveljaven vnos";
            case "invalid_element":
                return `Neveljavna vrednost v ${Y.origin}`;
            default:
                return "Neveljaven vnos"
        }
    }
}
// @from(Ln 21785, Col 4)
rk7 = L(() => {
    c3()
})
// @from(Ln 21789, Col 0)
function gK1() {
    return {
        localeError: RN5()
    }
}
// @from(Ln 21794, Col 4)
RN5 = () => {
    let q = {
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

    function K(Y) {
        return q[Y] ?? null
    }
    let _ = (Y) => {
            let A = typeof Y;
            switch (A) {
                case "number":
                    return Number.isNaN(Y) ? "NaN" : "antal";
                case "object": {
                    if (Array.isArray(Y)) return "lista";
                    if (Y === null) return "null";
                    if (Object.getPrototypeOf(Y) !== Object.prototype && Y.constructor) return Y.constructor.name
                }
            }
            return A
        },
        z = {
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
    return (Y) => {
        switch (Y.code) {
            case "invalid_type":
                return `Ogiltig inmatning: förväntat ${Y.expected}, fick ${_(Y.input)}`;
            case "invalid_value":
                if (Y.values.length === 1) return `Ogiltig inmatning: förväntat ${H4(Y.values[0])}`;
                return `Ogiltigt val: förväntade en av ${h7(Y.values,"|")}`;
            case "too_big": {
                let A = Y.inclusive ? "<=" : "<",
                    O = K(Y.origin);
                if (O) return `För stor(t): förväntade ${Y.origin??"värdet"} att ha ${A}${Y.maximum.toString()} ${O.unit??"element"}`;
                return `För stor(t): förväntat ${Y.origin??"värdet"} att ha ${A}${Y.maximum.toString()}`
            }
            case "too_small": {
                let A = Y.inclusive ? ">=" : ">",
                    O = K(Y.origin);
                if (O) return `För lite(t): förväntade ${Y.origin??"värdet"} att ha ${A}${Y.minimum.toString()} ${O.unit}`;
                return `För lite(t): förväntade ${Y.origin??"värdet"} att ha ${A}${Y.minimum.toString()}`
            }
            case "invalid_format": {
                let A = Y;
                if (A.format === "starts_with") return `Ogiltig sträng: måste börja med "${A.prefix}"`;
                if (A.format === "ends_with") return `Ogiltig sträng: måste sluta med "${A.suffix}"`;
                if (A.format === "includes") return `Ogiltig sträng: måste innehålla "${A.includes}"`;
                if (A.format === "regex") return `Ogiltig sträng: måste matcha mönstret "${A.pattern}"`;
                return `Ogiltig(t) ${z[A.format]??Y.format}`
            }
            case "not_multiple_of":
                return `Ogiltigt tal: måste vara en multipel av ${Y.divisor}`;
            case "unrecognized_keys":
                return `${Y.keys.length>1?"Okända nycklar":"Okänd nyckel"}: ${h7(Y.keys,", ")}`;
            case "invalid_key":
                return `Ogiltig nyckel i ${Y.origin??"värdet"}`;
            case "invalid_union":
                return "Ogiltig input";
            case "invalid_element":
                return `Ogiltigt värde i ${Y.origin??"värdet"}`;
            default:
                return "Ogiltig input"
        }
    }
}
// @from(Ln 21902, Col 4)
ok7 = L(() => {
    c3()
})
// @from(Ln 21906, Col 0)
function UK1() {
    return {
        localeError: SN5()
    }
}
// @from(Ln 21911, Col 4)
SN5 = () => {
    let q = {
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

    function K(Y) {
        return q[Y] ?? null
    }
    let _ = (Y) => {
            let A = typeof Y;
            switch (A) {
                case "number":
                    return Number.isNaN(Y) ? "எண் அல்லாதது" : "எண்";
                case "object": {
                    if (Array.isArray(Y)) return "அணி";
                    if (Y === null) return "வெறுமை";
                    if (Object.getPrototypeOf(Y) !== Object.prototype && Y.constructor) return Y.constructor.name
                }
            }
            return A
        },
        z = {
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
    return (Y) => {
        switch (Y.code) {
            case "invalid_type":
                return `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${Y.expected}, பெறப்பட்டது ${_(Y.input)}`;
            case "invalid_value":
                if (Y.values.length === 1) return `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${H4(Y.values[0])}`;
                return `தவறான விருப்பம்: எதிர்பார்க்கப்பட்டது ${h7(Y.values,"|")} இல் ஒன்று`;
            case "too_big": {
                let A = Y.inclusive ? "<=" : "<",
                    O = K(Y.origin);
                if (O) return `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${Y.origin??"மதிப்பு"} ${A}${Y.maximum.toString()} ${O.unit??"உறுப்புகள்"} ஆக இருக்க வேண்டும்`;
                return `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${Y.origin??"மதிப்பு"} ${A}${Y.maximum.toString()} ஆக இருக்க வேண்டும்`
            }
            case "too_small": {
                let A = Y.inclusive ? ">=" : ">",
                    O = K(Y.origin);
                if (O) return `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${Y.origin} ${A}${Y.minimum.toString()} ${O.unit} ஆக இருக்க வேண்டும்`;
                return `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${Y.origin} ${A}${Y.minimum.toString()} ஆக இருக்க வேண்டும்`
            }
            case "invalid_format": {
                let A = Y;
                if (A.format === "starts_with") return `தவறான சரம்: "${A.prefix}" இல் தொடங்க வேண்டும்`;
                if (A.format === "ends_with") return `தவறான சரம்: "${A.suffix}" இல் முடிவடைய வேண்டும்`;
                if (A.format === "includes") return `தவறான சரம்: "${A.includes}" ஐ உள்ளடக்க வேண்டும்`;
                if (A.format === "regex") return `தவறான சரம்: ${A.pattern} முறைபாட்டுடன் பொருந்த வேண்டும்`;
                return `தவறான ${z[A.format]??Y.format}`
            }
            case "not_multiple_of":
                return `தவறான எண்: ${Y.divisor} இன் பலமாக இருக்க வேண்டும்`;
            case "unrecognized_keys":
                return `அடையாளம் தெரியாத விசை${Y.keys.length>1?"கள்":""}: ${h7(Y.keys,", ")}`;
            case "invalid_key":
                return `${Y.origin} இல் தவறான விசை`;
            case "invalid_union":
                return "தவறான உள்ளீடு";
            case "invalid_element":
                return `${Y.origin} இல் தவறான மதிப்பு`;
            default:
                return "தவறான உள்ளீடு"
        }
    }
}
// @from(Ln 22019, Col 4)
ak7 = L(() => {
    c3()
})
// @from(Ln 22023, Col 0)
function QK1() {
    return {
        localeError: CN5()
    }
}
// @from(Ln 22028, Col 4)
CN5 = () => {
    let q = {
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

    function K(Y) {
        return q[Y] ?? null
    }
    let _ = (Y) => {
            let A = typeof Y;
            switch (A) {
                case "number":
                    return Number.isNaN(Y) ? "ไม่ใช่ตัวเลข (NaN)" : "ตัวเลข";
                case "object": {
                    if (Array.isArray(Y)) return "อาร์เรย์ (Array)";
                    if (Y === null) return "ไม่มีค่า (null)";
                    if (Object.getPrototypeOf(Y) !== Object.prototype && Y.constructor) return Y.constructor.name
                }
            }
            return A
        },
        z = {
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
    return (Y) => {
        switch (Y.code) {
            case "invalid_type":
                return `ประเภทข้อมูลไม่ถูกต้อง: ควรเป็น ${Y.expected} แต่ได้รับ ${_(Y.input)}`;
            case "invalid_value":
                if (Y.values.length === 1) return `ค่าไม่ถูกต้อง: ควรเป็น ${H4(Y.values[0])}`;
                return `ตัวเลือกไม่ถูกต้อง: ควรเป็นหนึ่งใน ${h7(Y.values,"|")}`;
            case "too_big": {
                let A = Y.inclusive ? "ไม่เกิน" : "น้อยกว่า",
                    O = K(Y.origin);
                if (O) return `เกินกำหนด: ${Y.origin??"ค่า"} ควรมี${A} ${Y.maximum.toString()} ${O.unit??"รายการ"}`;
                return `เกินกำหนด: ${Y.origin??"ค่า"} ควรมี${A} ${Y.maximum.toString()}`
            }
            case "too_small": {
                let A = Y.inclusive ? "อย่างน้อย" : "มากกว่า",
                    O = K(Y.origin);
                if (O) return `น้อยกว่ากำหนด: ${Y.origin} ควรมี${A} ${Y.minimum.toString()} ${O.unit}`;
                return `น้อยกว่ากำหนด: ${Y.origin} ควรมี${A} ${Y.minimum.toString()}`
            }
            case "invalid_format": {
                let A = Y;
                if (A.format === "starts_with") return `รูปแบบไม่ถูกต้อง: ข้อความต้องขึ้นต้นด้วย "${A.prefix}"`;
                if (A.format === "ends_with") return `รูปแบบไม่ถูกต้อง: ข้อความต้องลงท้ายด้วย "${A.suffix}"`;
                if (A.format === "includes") return `รูปแบบไม่ถูกต้อง: ข้อความต้องมี "${A.includes}" อยู่ในข้อความ`;
                if (A.format === "regex") return `รูปแบบไม่ถูกต้อง: ต้องตรงกับรูปแบบที่กำหนด ${A.pattern}`;
                return `รูปแบบไม่ถูกต้อง: ${z[A.format]??Y.format}`
            }
            case "not_multiple_of":
                return `ตัวเลขไม่ถูกต้อง: ต้องเป็นจำนวนที่หารด้วย ${Y.divisor} ได้ลงตัว`;
            case "unrecognized_keys":
                return `พบคีย์ที่ไม่รู้จัก: ${h7(Y.keys,", ")}`;
            case "invalid_key":
                return `คีย์ไม่ถูกต้องใน ${Y.origin}`;
            case "invalid_union":
                return "ข้อมูลไม่ถูกต้อง: ไม่ตรงกับรูปแบบยูเนียนที่กำหนดไว้";
            case "invalid_element":
                return `ข้อมูลไม่ถูกต้องใน ${Y.origin}`;
            default:
                return "ข้อมูลไม่ถูกต้อง"
        }
    }
}
// @from(Ln 22136, Col 4)
sk7 = L(() => {
    c3()
})
// @from(Ln 22140, Col 0)
function dK1() {
    return {
        localeError: IN5()
    }
}
// @from(Ln 22145, Col 4)
bN5 = (q) => {
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
// @from(Ln 22158, Col 4)
IN5 = () => {
        let q = {
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

        function K(z) {
            return q[z] ?? null
        }
        let _ = {
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
        return (z) => {
            switch (z.code) {
                case "invalid_type":
                    return `Geçersiz değer: beklenen ${z.expected}, alınan ${bN5(z.input)}`;
                case "invalid_value":
                    if (z.values.length === 1) return `Geçersiz değer: beklenen ${H4(z.values[0])}`;
                    return `Geçersiz seçenek: aşağıdakilerden biri olmalı: ${h7(z.values,"|")}`;
                case "too_big": {
                    let Y = z.inclusive ? "<=" : "<",
                        A = K(z.origin);
                    if (A) return `Çok büyük: beklenen ${z.origin??"değer"} ${Y}${z.maximum.toString()} ${A.unit??"öğe"}`;
                    return `Çok büyük: beklenen ${z.origin??"değer"} ${Y}${z.maximum.toString()}`
                }
                case "too_small": {
                    let Y = z.inclusive ? ">=" : ">",
                        A = K(z.origin);
                    if (A) return `Çok küçük: beklenen ${z.origin} ${Y}${z.minimum.toString()} ${A.unit}`;
                    return `Çok küçük: beklenen ${z.origin} ${Y}${z.minimum.toString()}`
                }
                case "invalid_format": {
                    let Y = z;
                    if (Y.format === "starts_with") return `Geçersiz metin: "${Y.prefix}" ile başlamalı`;
                    if (Y.format === "ends_with") return `Geçersiz metin: "${Y.suffix}" ile bitmeli`;
                    if (Y.format === "includes") return `Geçersiz metin: "${Y.includes}" içermeli`;
                    if (Y.format === "regex") return `Geçersiz metin: ${Y.pattern} desenine uymalı`;
                    return `Geçersiz ${_[Y.format]??z.format}`
                }
                case "not_multiple_of":
                    return `Geçersiz sayı: ${z.divisor} ile tam bölünebilmeli`;
                case "unrecognized_keys":
                    return `Tanınmayan anahtar${z.keys.length>1?"lar":""}: ${h7(z.keys,", ")}`;
                case "invalid_key":
                    return `${z.origin} içinde geçersiz anahtar`;
                case "invalid_union":
                    return "Geçersiz değer";
                case "invalid_element":
                    return `${z.origin} içinde geçersiz değer`;
                default:
                    return "Geçersiz değer"
            }
        }
    }
// @from(Ln 22253, Col 4)
tk7 = L(() => {
    c3()
})
// @from(Ln 22257, Col 0)
function cK1() {
    return {
        localeError: xN5()
    }
}
// @from(Ln 22262, Col 4)
xN5 = () => {
    let q = {
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

    function K(Y) {
        return q[Y] ?? null
    }
    let _ = (Y) => {
            let A = typeof Y;
            switch (A) {
                case "number":
                    return Number.isNaN(Y) ? "NaN" : "число";
                case "object": {
                    if (Array.isArray(Y)) return "масив";
                    if (Y === null) return "null";
                    if (Object.getPrototypeOf(Y) !== Object.prototype && Y.constructor) return Y.constructor.name
                }
            }
            return A
        },
        z = {
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
    return (Y) => {
        switch (Y.code) {
            case "invalid_type":
                return `Неправильні вхідні дані: очікується ${Y.expected}, отримано ${_(Y.input)}`;
            case "invalid_value":
                if (Y.values.length === 1) return `Неправильні вхідні дані: очікується ${H4(Y.values[0])}`;
                return `Неправильна опція: очікується одне з ${h7(Y.values,"|")}`;
            case "too_big": {
                let A = Y.inclusive ? "<=" : "<",
                    O = K(Y.origin);
                if (O) return `Занадто велике: очікується, що ${Y.origin??"значення"} ${O.verb} ${A}${Y.maximum.toString()} ${O.unit??"елементів"}`;
                return `Занадто велике: очікується, що ${Y.origin??"значення"} буде ${A}${Y.maximum.toString()}`
            }
            case "too_small": {
                let A = Y.inclusive ? ">=" : ">",
                    O = K(Y.origin);
                if (O) return `Занадто мале: очікується, що ${Y.origin} ${O.verb} ${A}${Y.minimum.toString()} ${O.unit}`;
                return `Занадто мале: очікується, що ${Y.origin} буде ${A}${Y.minimum.toString()}`
            }
            case "invalid_format": {
                let A = Y;
                if (A.format === "starts_with") return `Неправильний рядок: повинен починатися з "${A.prefix}"`;
                if (A.format === "ends_with") return `Неправильний рядок: повинен закінчуватися на "${A.suffix}"`;
                if (A.format === "includes") return `Неправильний рядок: повинен містити "${A.includes}"`;
                if (A.format === "regex") return `Неправильний рядок: повинен відповідати шаблону ${A.pattern}`;
                return `Неправильний ${z[A.format]??Y.format}`
            }
            case "not_multiple_of":
                return `Неправильне число: повинно бути кратним ${Y.divisor}`;
            case "unrecognized_keys":
                return `Нерозпізнаний ключ${Y.keys.length>1?"і":""}: ${h7(Y.keys,", ")}`;
            case "invalid_key":
                return `Неправильний ключ у ${Y.origin}`;
            case "invalid_union":
                return "Неправильні вхідні дані";
            case "invalid_element":
                return `Неправильне значення у ${Y.origin}`;
            default:
                return "Неправильні вхідні дані"
        }
    }
}
// @from(Ln 22370, Col 4)
ek7 = L(() => {
    c3()
})
// @from(Ln 22374, Col 0)
function lK1() {
    return {
        localeError: uN5()
    }
}
// @from(Ln 22379, Col 4)
uN5 = () => {
    let q = {
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

    function K(Y) {
        return q[Y] ?? null
    }
    let _ = (Y) => {
            let A = typeof Y;
            switch (A) {
                case "number":
                    return Number.isNaN(Y) ? "NaN" : "نمبر";
                case "object": {
                    if (Array.isArray(Y)) return "آرے";
                    if (Y === null) return "نل";
                    if (Object.getPrototypeOf(Y) !== Object.prototype && Y.constructor) return Y.constructor.name
                }
            }
            return A
        },
        z = {
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
    return (Y) => {
        switch (Y.code) {
            case "invalid_type":
                return `غلط ان پٹ: ${Y.expected} متوقع تھا، ${_(Y.input)} موصول ہوا`;
            case "invalid_value":
                if (Y.values.length === 1) return `غلط ان پٹ: ${H4(Y.values[0])} متوقع تھا`;
                return `غلط آپشن: ${h7(Y.values,"|")} میں سے ایک متوقع تھا`;
            case "too_big": {
                let A = Y.inclusive ? "<=" : "<",
                    O = K(Y.origin);
                if (O) return `بہت بڑا: ${Y.origin??"ویلیو"} کے ${A}${Y.maximum.toString()} ${O.unit??"عناصر"} ہونے متوقع تھے`;
                return `بہت بڑا: ${Y.origin??"ویلیو"} کا ${A}${Y.maximum.toString()} ہونا متوقع تھا`
            }
            case "too_small": {
                let A = Y.inclusive ? ">=" : ">",
                    O = K(Y.origin);
                if (O) return `بہت چھوٹا: ${Y.origin} کے ${A}${Y.minimum.toString()} ${O.unit} ہونے متوقع تھے`;
                return `بہت چھوٹا: ${Y.origin} کا ${A}${Y.minimum.toString()} ہونا متوقع تھا`
            }
            case "invalid_format": {
                let A = Y;
                if (A.format === "starts_with") return `غلط سٹرنگ: "${A.prefix}" سے شروع ہونا چاہیے`;
                if (A.format === "ends_with") return `غلط سٹرنگ: "${A.suffix}" پر ختم ہونا چاہیے`;
                if (A.format === "includes") return `غلط سٹرنگ: "${A.includes}" شامل ہونا چاہیے`;
                if (A.format === "regex") return `غلط سٹرنگ: پیٹرن ${A.pattern} سے میچ ہونا چاہیے`;
                return `غلط ${z[A.format]??Y.format}`
            }
            case "not_multiple_of":
                return `غلط نمبر: ${Y.divisor} کا مضاعف ہونا چاہیے`;
            case "unrecognized_keys":
                return `غیر تسلیم شدہ کی${Y.keys.length>1?"ز":""}: ${h7(Y.keys,"، ")}`;
            case "invalid_key":
                return `${Y.origin} میں غلط کی`;
            case "invalid_union":
                return "غلط ان پٹ";
            case "invalid_element":
                return `${Y.origin} میں غلط ویلیو`;
            default:
                return "غلط ان پٹ"
        }
    }
}
// @from(Ln 22487, Col 4)
qN7 = L(() => {
    c3()
})
// @from(Ln 22491, Col 0)
function nK1() {
    return {
        localeError: mN5()
    }
}
// @from(Ln 22496, Col 4)
mN5 = () => {
    let q = {
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

    function K(Y) {
        return q[Y] ?? null
    }
    let _ = (Y) => {
            let A = typeof Y;
            switch (A) {
                case "number":
                    return Number.isNaN(Y) ? "NaN" : "số";
                case "object": {
                    if (Array.isArray(Y)) return "mảng";
                    if (Y === null) return "null";
                    if (Object.getPrototypeOf(Y) !== Object.prototype && Y.constructor) return Y.constructor.name
                }
            }
            return A
        },
        z = {
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
    return (Y) => {
        switch (Y.code) {
            case "invalid_type":
                return `Đầu vào không hợp lệ: mong đợi ${Y.expected}, nhận được ${_(Y.input)}`;
            case "invalid_value":
                if (Y.values.length === 1) return `Đầu vào không hợp lệ: mong đợi ${H4(Y.values[0])}`;
                return `Tùy chọn không hợp lệ: mong đợi một trong các giá trị ${h7(Y.values,"|")}`;
            case "too_big": {
                let A = Y.inclusive ? "<=" : "<",
                    O = K(Y.origin);
                if (O) return `Quá lớn: mong đợi ${Y.origin??"giá trị"} ${O.verb} ${A}${Y.maximum.toString()} ${O.unit??"phần tử"}`;
                return `Quá lớn: mong đợi ${Y.origin??"giá trị"} ${A}${Y.maximum.toString()}`
            }
            case "too_small": {
                let A = Y.inclusive ? ">=" : ">",
                    O = K(Y.origin);
                if (O) return `Quá nhỏ: mong đợi ${Y.origin} ${O.verb} ${A}${Y.minimum.toString()} ${O.unit}`;
                return `Quá nhỏ: mong đợi ${Y.origin} ${A}${Y.minimum.toString()}`
            }
            case "invalid_format": {
                let A = Y;
                if (A.format === "starts_with") return `Chuỗi không hợp lệ: phải bắt đầu bằng "${A.prefix}"`;
                if (A.format === "ends_with") return `Chuỗi không hợp lệ: phải kết thúc bằng "${A.suffix}"`;
                if (A.format === "includes") return `Chuỗi không hợp lệ: phải bao gồm "${A.includes}"`;
                if (A.format === "regex") return `Chuỗi không hợp lệ: phải khớp với mẫu ${A.pattern}`;
                return `${z[A.format]??Y.format} không hợp lệ`
            }
            case "not_multiple_of":
                return `Số không hợp lệ: phải là bội số của ${Y.divisor}`;
            case "unrecognized_keys":
                return `Khóa không được nhận dạng: ${h7(Y.keys,", ")}`;
            case "invalid_key":
                return `Khóa không hợp lệ trong ${Y.origin}`;
            case "invalid_union":
                return "Đầu vào không hợp lệ";
            case "invalid_element":
                return `Giá trị không hợp lệ trong ${Y.origin}`;
            default:
                return "Đầu vào không hợp lệ"
        }
    }
}
// @from(Ln 22604, Col 4)
KN7 = L(() => {
    c3()
})
// @from(Ln 22608, Col 0)
function iK1() {
    return {
        localeError: BN5()
    }
}
// @from(Ln 22613, Col 4)
BN5 = () => {
    let q = {
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

    function K(Y) {
        return q[Y] ?? null
    }
    let _ = (Y) => {
            let A = typeof Y;
            switch (A) {
                case "number":
                    return Number.isNaN(Y) ? "非数字(NaN)" : "数字";
                case "object": {
                    if (Array.isArray(Y)) return "数组";
                    if (Y === null) return "空值(null)";
                    if (Object.getPrototypeOf(Y) !== Object.prototype && Y.constructor) return Y.constructor.name
                }
            }
            return A
        },
        z = {
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
    return (Y) => {
        switch (Y.code) {
            case "invalid_type":
                return `无效输入：期望 ${Y.expected}，实际接收 ${_(Y.input)}`;
            case "invalid_value":
                if (Y.values.length === 1) return `无效输入：期望 ${H4(Y.values[0])}`;
                return `无效选项：期望以下之一 ${h7(Y.values,"|")}`;
            case "too_big": {
                let A = Y.inclusive ? "<=" : "<",
                    O = K(Y.origin);
                if (O) return `数值过大：期望 ${Y.origin??"值"} ${A}${Y.maximum.toString()} ${O.unit??"个元素"}`;
                return `数值过大：期望 ${Y.origin??"值"} ${A}${Y.maximum.toString()}`
            }
            case "too_small": {
                let A = Y.inclusive ? ">=" : ">",
                    O = K(Y.origin);
                if (O) return `数值过小：期望 ${Y.origin} ${A}${Y.minimum.toString()} ${O.unit}`;
                return `数值过小：期望 ${Y.origin} ${A}${Y.minimum.toString()}`
            }
            case "invalid_format": {
                let A = Y;
                if (A.format === "starts_with") return `无效字符串：必须以 "${A.prefix}" 开头`;
                if (A.format === "ends_with") return `无效字符串：必须以 "${A.suffix}" 结尾`;
                if (A.format === "includes") return `无效字符串：必须包含 "${A.includes}"`;
                if (A.format === "regex") return `无效字符串：必须满足正则表达式 ${A.pattern}`;
                return `无效${z[A.format]??Y.format}`
            }
            case "not_multiple_of":
                return `无效数字：必须是 ${Y.divisor} 的倍数`;
            case "unrecognized_keys":
                return `出现未知的键(key): ${h7(Y.keys,", ")}`;
            case "invalid_key":
                return `${Y.origin} 中的键(key)无效`;
            case "invalid_union":
                return "无效输入";
            case "invalid_element":
                return `${Y.origin} 中包含无效值(value)`;
            default:
                return "无效输入"
        }
    }
}
// @from(Ln 22721, Col 4)
_N7 = L(() => {
    c3()
})
// @from(Ln 22725, Col 0)
function rK1() {
    return {
        localeError: pN5()
    }
}
// @from(Ln 22730, Col 4)
pN5 = () => {
    let q = {
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
    return (Y) => {
        switch (Y.code) {
            case "invalid_type":
                return `無效的輸入值：預期為 ${Y.expected}，但收到 ${_(Y.input)}`;
            case "invalid_value":
                if (Y.values.length === 1) return `無效的輸入值：預期為 ${H4(Y.values[0])}`;
                return `無效的選項：預期為以下其中之一 ${h7(Y.values,"|")}`;
            case "too_big": {
                let A = Y.inclusive ? "<=" : "<",
                    O = K(Y.origin);
                if (O) return `數值過大：預期 ${Y.origin??"值"} 應為 ${A}${Y.maximum.toString()} ${O.unit??"個元素"}`;
                return `數值過大：預期 ${Y.origin??"值"} 應為 ${A}${Y.maximum.toString()}`
            }
            case "too_small": {
                let A = Y.inclusive ? ">=" : ">",
                    O = K(Y.origin);
                if (O) return `數值過小：預期 ${Y.origin} 應為 ${A}${Y.minimum.toString()} ${O.unit}`;
                return `數值過小：預期 ${Y.origin} 應為 ${A}${Y.minimum.toString()}`
            }
            case "invalid_format": {
                let A = Y;
                if (A.format === "starts_with") return `無效的字串：必須以 "${A.prefix}" 開頭`;
                if (A.format === "ends_with") return `無效的字串：必須以 "${A.suffix}" 結尾`;
                if (A.format === "includes") return `無效的字串：必須包含 "${A.includes}"`;
                if (A.format === "regex") return `無效的字串：必須符合格式 ${A.pattern}`;
                return `無效的 ${z[A.format]??Y.format}`
            }
            case "not_multiple_of":
                return `無效的數字：必須為 ${Y.divisor} 的倍數`;
            case "unrecognized_keys":
                return `無法識別的鍵值${Y.keys.length>1?"們":""}：${h7(Y.keys,"、")}`;
            case "invalid_key":
                return `${Y.origin} 中有無效的鍵值`;
            case "invalid_union":
                return "無效的輸入值";
            case "invalid_element":
                return `${Y.origin} 中有無效的值`;
            default:
                return "無效的輸入值"
        }
    }
}
// @from(Ln 22838, Col 4)
zN7 = L(() => {
    c3()
})
// @from(Ln 22841, Col 4)
hZ6 = {}
// @from(Ln 22883, Col 4)
l28 = L(() => {
    fk7();
    Gk7();
    Tk7();
    Vk7();
    kk7();
    Nk7();
    DK1();
    Ek7();
    yk7();
    Lk7();
    hk7();
    Rk7();
    Sk7();
    Ck7();
    bk7();
    Ik7();
    xk7();
    uk7();
    mk7();
    Bk7();
    pk7();
    Fk7();
    gk7();
    Uk7();
    Qk7();
    dk7();
    ck7();
    lk7();
    ik7();
    rk7();
    ok7();
    ak7();
    sk7();
    tk7();
    ek7();
    qN7();
    KN7();
    _N7();
    zN7()
})
// @from(Ln 22924, Col 0)
class oF6 {
    constructor() {
        this._map = new WeakMap, this._idmap = new Map
    }
    add(q, ...K) {
        let _ = K[0];
        if (this._map.set(q, _), _ && typeof _ === "object" && "id" in _) {
            if (this._idmap.has(_.id)) throw Error(`ID ${_.id} already exists in the registry`);
            this._idmap.set(_.id, q)
        }
        return this
    }
    remove(q) {
        return this._map.delete(q), this
    }
    get(q) {
        let K = q._zod.parent;
        if (K) {
            let _ = {
                ...this.get(K) ?? {}
            };
            return delete _.id, {
                ..._,
                ...this._map.get(q)
            }
        }
        return this._map.get(q)
    }
    has(q) {
        return this._map.has(q)
    }
}
// @from(Ln 22957, Col 0)
function n28() {
    return new oF6
}
// @from(Ln 22960, Col 4)
oK1
// @from(Ln 22960, Col 9)
aK1
// @from(Ln 22960, Col 14)
KU
// @from(Ln 22961, Col 4)
sK1 = L(() => {
    oK1 = Symbol("ZodOutput"), aK1 = Symbol("ZodInput");
    KU = n28()
})
// @from(Ln 22966, Col 0)
function tK1(q, K) {
    return new q({
        type: "string",
        ...Fq(K)
    })
}
// @from(Ln 22973, Col 0)
function eK1(q, K) {
    return new q({
        type: "string",
        coerce: !0,
        ...Fq(K)
    })
}
// @from(Ln 22981, Col 0)
function i28(q, K) {
    return new q({
        type: "string",
        format: "email",
        check: "string_format",
        abort: !1,
        ...Fq(K)
    })
}
// @from(Ln 22991, Col 0)
function aF6(q, K) {
    return new q({
        type: "string",
        format: "guid",
        check: "string_format",
        abort: !1,
        ...Fq(K)
    })
}
// @from(Ln 23001, Col 0)
function r28(q, K) {
    return new q({
        type: "string",
        format: "uuid",
        check: "string_format",
        abort: !1,
        ...Fq(K)
    })
}
// @from(Ln 23011, Col 0)
function o28(q, K) {
    return new q({
        type: "string",
        format: "uuid",
        check: "string_format",
        abort: !1,
        version: "v4",
        ...Fq(K)
    })
}
// @from(Ln 23022, Col 0)
function a28(q, K) {
    return new q({
        type: "string",
        format: "uuid",
        check: "string_format",
        abort: !1,
        version: "v6",
        ...Fq(K)
    })
}
// @from(Ln 23033, Col 0)
function s28(q, K) {
    return new q({
        type: "string",
        format: "uuid",
        check: "string_format",
        abort: !1,
        version: "v7",
        ...Fq(K)
    })
}
// @from(Ln 23044, Col 0)
function t28(q, K) {
    return new q({
        type: "string",
        format: "url",
        check: "string_format",
        abort: !1,
        ...Fq(K)
    })
}
// @from(Ln 23054, Col 0)
function e28(q, K) {
    return new q({
        type: "string",
        format: "emoji",
        check: "string_format",
        abort: !1,
        ...Fq(K)
    })
}
// @from(Ln 23064, Col 0)
function q$8(q, K) {
    return new q({
        type: "string",
        format: "nanoid",
        check: "string_format",
        abort: !1,
        ...Fq(K)
    })
}
// @from(Ln 23074, Col 0)
function K$8(q, K) {
    return new q({
        type: "string",
        format: "cuid",
        check: "string_format",
        abort: !1,
        ...Fq(K)
    })
}
// @from(Ln 23084, Col 0)
function _$8(q, K) {
    return new q({
        type: "string",
        format: "cuid2",
        check: "string_format",
        abort: !1,
        ...Fq(K)
    })
}
// @from(Ln 23094, Col 0)
function z$8(q, K) {
    return new q({
        type: "string",
        format: "ulid",
        check: "string_format",
        abort: !1,
        ...Fq(K)
    })
}
// @from(Ln 23104, Col 0)
function Y$8(q, K) {
    return new q({
        type: "string",
        format: "xid",
        check: "string_format",
        abort: !1,
        ...Fq(K)
    })
}
// @from(Ln 23114, Col 0)
function A$8(q, K) {
    return new q({
        type: "string",
        format: "ksuid",
        check: "string_format",
        abort: !1,
        ...Fq(K)
    })
}
// @from(Ln 23124, Col 0)
function O$8(q, K) {
    return new q({
        type: "string",
        format: "ipv4",
        check: "string_format",
        abort: !1,
        ...Fq(K)
    })
}
// @from(Ln 23134, Col 0)
function w$8(q, K) {
    return new q({
        type: "string",
        format: "ipv6",
        check: "string_format",
        abort: !1,
        ...Fq(K)
    })
}
// @from(Ln 23144, Col 0)
function $$8(q, K) {
    return new q({
        type: "string",
        format: "cidrv4",
        check: "string_format",
        abort: !1,
        ...Fq(K)
    })
}
// @from(Ln 23154, Col 0)
function j$8(q, K) {
    return new q({
        type: "string",
        format: "cidrv6",
        check: "string_format",
        abort: !1,
        ...Fq(K)
    })
}
// @from(Ln 23164, Col 0)
function H$8(q, K) {
    return new q({
        type: "string",
        format: "base64",
        check: "string_format",
        abort: !1,
        ...Fq(K)
    })
}
// @from(Ln 23174, Col 0)
function J$8(q, K) {
    return new q({
        type: "string",
        format: "base64url",
        check: "string_format",
        abort: !1,
        ...Fq(K)
    })
}
// @from(Ln 23184, Col 0)
function X$8(q, K) {
    return new q({
        type: "string",
        format: "e164",
        check: "string_format",
        abort: !1,
        ...Fq(K)
    })
}
// @from(Ln 23194, Col 0)
function M$8(q, K) {
    return new q({
        type: "string",
        format: "jwt",
        check: "string_format",
        abort: !1,
        ...Fq(K)
    })
}
// @from(Ln 23204, Col 0)
function K51(q, K) {
    return new q({
        type: "string",
        format: "datetime",
        check: "string_format",
        offset: !1,
        local: !1,
        precision: null,
        ...Fq(K)
    })
}
// @from(Ln 23216, Col 0)
function _51(q, K) {
    return new q({
        type: "string",
        format: "date",
        check: "string_format",
        ...Fq(K)
    })
}
// @from(Ln 23225, Col 0)
function z51(q, K) {
    return new q({
        type: "string",
        format: "time",
        check: "string_format",
        precision: null,
        ...Fq(K)
    })
}
// @from(Ln 23235, Col 0)
function Y51(q, K) {
    return new q({
        type: "string",
        format: "duration",
        check: "string_format",
        ...Fq(K)
    })
}
// @from(Ln 23244, Col 0)
function A51(q, K) {
    return new q({
        type: "number",
        checks: [],
        ...Fq(K)
    })
}
// @from(Ln 23252, Col 0)
function O51(q, K) {
    return new q({
        type: "number",
        coerce: !0,
        checks: [],
        ...Fq(K)
    })
}
// @from(Ln 23261, Col 0)
function w51(q, K) {
    return new q({
        type: "number",
        check: "number_format",
        abort: !1,
        format: "safeint",
        ...Fq(K)
    })
}
// @from(Ln 23271, Col 0)
function $51(q, K) {
    return new q({
        type: "number",
        check: "number_format",
        abort: !1,
        format: "float32",
        ...Fq(K)
    })
}
// @from(Ln 23281, Col 0)
function j51(q, K) {
    return new q({
        type: "number",
        check: "number_format",
        abort: !1,
        format: "float64",
        ...Fq(K)
    })
}
// @from(Ln 23291, Col 0)
function H51(q, K) {
    return new q({
        type: "number",
        check: "number_format",
        abort: !1,
        format: "int32",
        ...Fq(K)
    })
}
// @from(Ln 23301, Col 0)
function J51(q, K) {
    return new q({
        type: "number",
        check: "number_format",
        abort: !1,
        format: "uint32",
        ...Fq(K)
    })
}
// @from(Ln 23311, Col 0)
function X51(q, K) {
    return new q({
        type: "boolean",
        ...Fq(K)
    })
}
// @from(Ln 23318, Col 0)
function M51(q, K) {
    return new q({
        type: "boolean",
        coerce: !0,
        ...Fq(K)
    })
}
// @from(Ln 23326, Col 0)
function P51(q, K) {
    return new q({
        type: "bigint",
        ...Fq(K)
    })
}
// @from(Ln 23333, Col 0)
function W51(q, K) {
    return new q({
        type: "bigint",
        coerce: !0,
        ...Fq(K)
    })
}
// @from(Ln 23341, Col 0)
function D51(q, K) {
    return new q({
        type: "bigint",
        check: "bigint_format",
        abort: !1,
        format: "int64",
        ...Fq(K)
    })
}
// @from(Ln 23351, Col 0)
function Z51(q, K) {
    return new q({
        type: "bigint",
        check: "bigint_format",
        abort: !1,
        format: "uint64",
        ...Fq(K)
    })
}
// @from(Ln 23361, Col 0)
function f51(q, K) {
    return new q({
        type: "symbol",
        ...Fq(K)
    })
}
// @from(Ln 23368, Col 0)
function G51(q, K) {
    return new q({
        type: "undefined",
        ...Fq(K)
    })
}
// @from(Ln 23375, Col 0)
function v51(q, K) {
    return new q({
        type: "null",
        ...Fq(K)
    })
}
// @from(Ln 23382, Col 0)
function T51(q) {
    return new q({
        type: "any"
    })
}
// @from(Ln 23388, Col 0)
function RZ6(q) {
    return new q({
        type: "unknown"
    })
}
// @from(Ln 23394, Col 0)
function V51(q, K) {
    return new q({
        type: "never",
        ...Fq(K)
    })
}
// @from(Ln 23401, Col 0)
function k51(q, K) {
    return new q({
        type: "void",
        ...Fq(K)
    })
}
// @from(Ln 23408, Col 0)
function N51(q, K) {
    return new q({
        type: "date",
        ...Fq(K)
    })
}
// @from(Ln 23415, Col 0)
function E51(q, K) {
    return new q({
        type: "date",
        coerce: !0,
        ...Fq(K)
    })
}
// @from(Ln 23423, Col 0)
function y51(q, K) {
    return new q({
        type: "nan",
        ...Fq(K)
    })
}
// @from(Ln 23430, Col 0)
function qr(q, K) {
    return new m28({
        check: "less_than",
        ...Fq(K),
        value: q,
        inclusive: !1
    })
}
// @from(Ln 23439, Col 0)
function xC(q, K) {
    return new m28({
        check: "less_than",
        ...Fq(K),
        value: q,
        inclusive: !0
    })
}
// @from(Ln 23448, Col 0)
function Kr(q, K) {
    return new B28({
        check: "greater_than",
        ...Fq(K),
        value: q,
        inclusive: !1
    })
}
// @from(Ln 23457, Col 0)
function FN(q, K) {
    return new B28({
        check: "greater_than",
        ...Fq(K),
        value: q,
        inclusive: !0
    })
}
// @from(Ln 23466, Col 0)
function L51(q) {
    return Kr(0, q)
}
// @from(Ln 23470, Col 0)
function h51(q) {
    return qr(0, q)
}
// @from(Ln 23474, Col 0)
function R51(q) {
    return xC(0, q)
}
// @from(Ln 23478, Col 0)
function S51(q) {
    return FN(0, q)
}
// @from(Ln 23482, Col 0)
function iY6(q, K) {
    return new Uq1({
        check: "multiple_of",
        ...Fq(K),
        value: q
    })
}
// @from(Ln 23490, Col 0)
function SZ6(q, K) {
    return new cq1({
        check: "max_size",
        ...Fq(K),
        maximum: q
    })
}
// @from(Ln 23498, Col 0)
function rY6(q, K) {
    return new lq1({
        check: "min_size",
        ...Fq(K),
        minimum: q
    })
}
// @from(Ln 23506, Col 0)
function sF6(q, K) {
    return new nq1({
        check: "size_equals",
        ...Fq(K),
        size: q
    })
}
// @from(Ln 23514, Col 0)
function CZ6(q, K) {
    return new iq1({
        check: "max_length",
        ...Fq(K),
        maximum: q
    })
}
// @from(Ln 23522, Col 0)
function e86(q, K) {
    return new rq1({
        check: "min_length",
        ...Fq(K),
        minimum: q
    })
}
// @from(Ln 23530, Col 0)
function bZ6(q, K) {
    return new oq1({
        check: "length_equals",
        ...Fq(K),
        length: q
    })
}
// @from(Ln 23538, Col 0)
function tF6(q, K) {
    return new aq1({
        check: "string_format",
        format: "regex",
        ...Fq(K),
        pattern: q
    })
}
// @from(Ln 23547, Col 0)
function eF6(q) {
    return new sq1({
        check: "string_format",
        format: "lowercase",
        ...Fq(q)
    })
}
// @from(Ln 23555, Col 0)
function qg6(q) {
    return new tq1({
        check: "string_format",
        format: "uppercase",
        ...Fq(q)
    })
}
// @from(Ln 23563, Col 0)
function Kg6(q, K) {
    return new eq1({
        check: "string_format",
        format: "includes",
        ...Fq(K),
        includes: q
    })
}
// @from(Ln 23572, Col 0)
function _g6(q, K) {
    return new q41({
        check: "string_format",
        format: "starts_with",
        ...Fq(K),
        prefix: q
    })
}
// @from(Ln 23581, Col 0)
function zg6(q, K) {
    return new K41({
        check: "string_format",
        format: "ends_with",
        ...Fq(K),
        suffix: q
    })
}
// @from(Ln 23590, Col 0)
function C51(q, K, _) {
    return new _41({
        check: "property",
        property: q,
        schema: K,
        ...Fq(_)
    })
}
// @from(Ln 23599, Col 0)
function Yg6(q, K) {
    return new z41({
        check: "mime_type",
        mime: q,
        ...Fq(K)
    })
}
// @from(Ln 23607, Col 0)
function _r(q) {
    return new Y41({
        check: "overwrite",
        tx: q
    })
}
// @from(Ln 23614, Col 0)
function Ag6(q) {
    return _r((K) => K.normalize(q))
}
// @from(Ln 23618, Col 0)
function Og6() {
    return _r((q) => q.trim())
}
// @from(Ln 23622, Col 0)
function wg6() {
    return _r((q) => q.toLowerCase())
}
// @from(Ln 23626, Col 0)
function $g6() {
    return _r((q) => q.toUpperCase())
}
// @from(Ln 23630, Col 0)
function jg6(q, K, _) {
    return new q({
        type: "array",
        element: K,
        ...Fq(_)
    })
}
// @from(Ln 23638, Col 0)
function FN5(q, K, _) {
    return new q({
        type: "union",
        options: K,
        ...Fq(_)
    })
}
// @from(Ln 23646, Col 0)
function gN5(q, K, _, z) {
    return new q({
        type: "union",
        options: _,
        discriminator: K,
        ...Fq(z)
    })
}
// @from(Ln 23655, Col 0)
function UN5(q, K, _) {
    return new q({
        type: "intersection",
        left: K,
        right: _
    })
}
// @from(Ln 23663, Col 0)
function b51(q, K, _, z) {
    let Y = _ instanceof O9;
    return new q({
        type: "tuple",
        items: K,
        rest: Y ? _ : null,
        ...Fq(Y ? z : _)
    })
}
// @from(Ln 23673, Col 0)
function QN5(q, K, _, z) {
    return new q({
        type: "record",
        keyType: K,
        valueType: _,
        ...Fq(z)
    })
}
// @from(Ln 23682, Col 0)
function dN5(q, K, _, z) {
    return new q({
        type: "map",
        keyType: K,
        valueType: _,
        ...Fq(z)
    })
}
// @from(Ln 23691, Col 0)
function cN5(q, K, _) {
    return new q({
        type: "set",
        valueType: K,
        ...Fq(_)
    })
}
// @from(Ln 23699, Col 0)
function lN5(q, K, _) {
    let z = Array.isArray(K) ? Object.fromEntries(K.map((Y) => [Y, Y])) : K;
    return new q({
        type: "enum",
        entries: z,
        ...Fq(_)
    })
}
// @from(Ln 23708, Col 0)
function nN5(q, K, _) {
    return new q({
        type: "enum",
        entries: K,
        ...Fq(_)
    })
}
// @from(Ln 23716, Col 0)
function iN5(q, K, _) {
    return new q({
        type: "literal",
        values: Array.isArray(K) ? K : [K],
        ...Fq(_)
    })
}
// @from(Ln 23724, Col 0)
function I51(q, K) {
    return new q({
        type: "file",
        ...Fq(K)
    })
}
// @from(Ln 23731, Col 0)
function rN5(q, K) {
    return new q({
        type: "transform",
        transform: K
    })
}
// @from(Ln 23738, Col 0)
function oN5(q, K) {
    return new q({
        type: "optional",
        innerType: K
    })
}
// @from(Ln 23745, Col 0)
function aN5(q, K) {
    return new q({
        type: "nullable",
        innerType: K
    })
}
// @from(Ln 23752, Col 0)
function sN5(q, K, _) {
    return new q({
        type: "default",
        innerType: K,
        get defaultValue() {
            return typeof _ === "function" ? _() : _
        }
    })
}
// @from(Ln 23762, Col 0)
function tN5(q, K, _) {
    return new q({
        type: "nonoptional",
        innerType: K,
        ...Fq(_)
    })
}
// @from(Ln 23770, Col 0)
function eN5(q, K) {
    return new q({
        type: "success",
        innerType: K
    })
}
// @from(Ln 23777, Col 0)
function qE5(q, K, _) {
    return new q({
        type: "catch",
        innerType: K,
        catchValue: typeof _ === "function" ? _ : () => _
    })
}
// @from(Ln 23785, Col 0)
function KE5(q, K, _) {
    return new q({
        type: "pipe",
        in: K,
        out: _
    })
}
// @from(Ln 23793, Col 0)
function _E5(q, K) {
    return new q({
        type: "readonly",
        innerType: K
    })
}
// @from(Ln 23800, Col 0)
function zE5(q, K, _) {
    return new q({
        type: "template_literal",
        parts: K,
        ...Fq(_)
    })
}
// @from(Ln 23808, Col 0)
function YE5(q, K) {
    return new q({
        type: "lazy",
        getter: K
    })
}
// @from(Ln 23815, Col 0)
function AE5(q, K) {
    return new q({
        type: "promise",
        innerType: K
    })
}
// @from(Ln 23822, Col 0)
function x51(q, K, _) {
    let z = Fq(_);
    return z.abort ?? (z.abort = !0), new q({
        type: "custom",
        check: "custom",
        fn: K,
        ...z
    })
}
// @from(Ln 23832, Col 0)
function u51(q, K, _) {
    return new q({
        type: "custom",
        check: "custom",
        fn: K,
        ...Fq(_)
    })
}
// @from(Ln 23841, Col 0)
function m51(q, K) {
    let _ = Fq(K),
        z = _.truthy ?? ["true", "1", "yes", "on", "y", "enabled"],
        Y = _.falsy ?? ["false", "0", "no", "off", "n", "disabled"];
    if (_.case !== "sensitive") z = z.map((P) => typeof P === "string" ? P.toLowerCase() : P), Y = Y.map((P) => typeof P === "string" ? P.toLowerCase() : P);
    let A = new Set(z),
        O = new Set(Y),
        w = q.Pipe ?? nF6,
        $ = q.Boolean ?? dF6,
        j = q.String ?? lY6,
        J = new(q.Transform ?? lF6)({
            type: "transform",
            transform: (P, W) => {
                let D = P;
                if (_.case !== "sensitive") D = D.toLowerCase();
                if (A.has(D)) return !0;
                else if (O.has(D)) return !1;
                else return W.issues.push({
                    code: "invalid_value",
                    expected: "stringbool",
                    values: [...A, ...O],
                    input: W.value,
                    inst: J
                }), {}
            },
            error: _.error
        }),
        X = new w({
            type: "pipe",
            in: new j({
                type: "string",
                error: _.error
            }),
            out: J,
            error: _.error
        });
    return new w({
        type: "pipe",
        in: X,
        out: new $({
            type: "boolean",
            error: _.error
        }),
        error: _.error
    })
}
// @from(Ln 23888, Col 0)
function B51(q, K, _, z = {}) {
    let Y = Fq(z),
        A = {
            ...Fq(z),
            check: "string_format",
            type: "string",
            format: K,
            fn: typeof _ === "function" ? _ : (w) => _.test(w),
            ...Y
        };
    if (_ instanceof RegExp) A.pattern = _;
    return new q(A)
}
// @from(Ln 23901, Col 4)
q51
// @from(Ln 23902, Col 4)
p51 = L(() => {
    p28();
    iF6();
    c3();
    q51 = {
        Any: null,
        Minute: -1,
        Second: 0,
        Millisecond: 3,
        Microsecond: 6
    }
})
// @from(Ln 23914, Col 0)
class F51 {
    constructor(q) {
        this._def = q, this.def = q
    }
    implement(q) {
        if (typeof q !== "function") throw Error("implement() must be called with a function");
        let K = (..._) => {
            let z = this._def.input ? gF6(this._def.input, _, void 0, {
                callee: K
            }) : _;
            if (!Array.isArray(z)) throw Error("Invalid arguments schema: not an array or tuple schema.");
            let Y = q(...z);
            return this._def.output ? gF6(this._def.output, Y, void 0, {
                callee: K
            }) : Y
        };
        return K
    }
    implementAsync(q) {
        if (typeof q !== "function") throw Error("implement() must be called with a function");
        let K = async (..._) => {
            let z = this._def.input ? await UF6(this._def.input, _, void 0, {
                callee: K
            }) : _;
            if (!Array.isArray(z)) throw Error("Invalid arguments schema: not an array or tuple schema.");
            let Y = await q(...z);
            return this._def.output ? UF6(this._def.output, Y, void 0, {
                callee: K
            }) : Y
        };
        return K
    }
    input(...q) {
        let K = this.constructor;
        if (Array.isArray(q[0])) return new K({
            type: "function",
            input: new nY6({
                type: "tuple",
                items: q[0],
                rest: q[1]
            }),
            output: this._def.output
        });
        return new K({
            type: "function",
            input: q[0],
            output: this._def.output
        })
    }
    output(q) {
        return new this.constructor({
            type: "function",
            input: this._def.input,
            output: q
        })
    }
}
// @from(Ln 23972, Col 0)
function g51(q) {
    return new F51({
        type: "function",
        input: Array.isArray(q?.input) ? b51(nY6, q?.input) : q?.input ?? jg6(cF6, RZ6(LZ6)),
        output: q?.output ?? RZ6(LZ6)
    })
}
// @from(Ln 23979, Col 4)
YN7 = L(() => {
    p51();
    I28();
    iF6();
    iF6()
})
// @from(Ln 23985, Col 0)
class P$8 {
    constructor(q) {
        this.counter = 0, this.metadataRegistry = q?.metadata ?? KU, this.target = q?.target ?? "draft-2020-12", this.unrepresentable = q?.unrepresentable ?? "throw", this.override = q?.override ?? (() => {}), this.io = q?.io ?? "output", this.seen = new Map
    }
    process(q, K = {
        path: [],
        schemaPath: []
    }) {
        var _;
        let z = q._zod.def,
            Y = {
                guid: "uuid",
                url: "uri",
                datetime: "date-time",
                json_string: "json-string",
                regex: ""
            },
            A = this.seen.get(q);
        if (A) {
            if (A.count++, K.schemaPath.includes(q)) A.cycle = K.path;
            return A.schema
        }
        let O = {
            schema: {},
            count: 1,
            cycle: void 0,
            path: K.path
        };
        this.seen.set(q, O);
        let w = q._zod.toJSONSchema?.();
        if (w) O.schema = w;
        else {
            let H = {
                    ...K,
                    schemaPath: [...K.schemaPath, q],
                    path: K.path
                },
                J = q._zod.parent;
            if (J) O.ref = J, this.process(J, H), this.seen.get(J).isParent = !0;
            else {
                let X = O.schema;
                switch (z.type) {
                    case "string": {
                        let M = X;
                        M.type = "string";
                        let {
                            minimum: P,
                            maximum: W,
                            format: D,
                            patterns: Z,
                            contentEncoding: G
                        } = q._zod.bag;
                        if (typeof P === "number") M.minLength = P;
                        if (typeof W === "number") M.maxLength = W;
                        if (D) {
                            if (M.format = Y[D] ?? D, M.format === "") delete M.format
                        }
                        if (G) M.contentEncoding = G;
                        if (Z && Z.size > 0) {
                            let f = [...Z];
                            if (f.length === 1) M.pattern = f[0].source;
                            else if (f.length > 1) O.schema.allOf = [...f.map((v) => ({
                                ...this.target === "draft-7" ? {
                                    type: "string"
                                } : {},
                                pattern: v.source
                            }))]
                        }
                        break
                    }
                    case "number": {
                        let M = X,
                            {
                                minimum: P,
                                maximum: W,
                                format: D,
                                multipleOf: Z,
                                exclusiveMaximum: G,
                                exclusiveMinimum: f
                            } = q._zod.bag;
                        if (typeof D === "string" && D.includes("int")) M.type = "integer";
                        else M.type = "number";
                        if (typeof f === "number") M.exclusiveMinimum = f;
                        if (typeof P === "number") {
                            if (M.minimum = P, typeof f === "number")
                                if (f >= P) delete M.minimum;
                                else delete M.exclusiveMinimum
                        }
                        if (typeof G === "number") M.exclusiveMaximum = G;
                        if (typeof W === "number") {
                            if (M.maximum = W, typeof G === "number")
                                if (G <= W) delete M.maximum;
                                else delete M.exclusiveMaximum
                        }
                        if (typeof Z === "number") M.multipleOf = Z;
                        break
                    }
                    case "boolean": {
                        let M = X;
                        M.type = "boolean";
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
                        X.type = "null";
                        break
                    }
                    case "any":
                        break;
                    case "unknown":
                        break;
                    case "undefined":
                    case "never": {
                        X.not = {};
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
                        let M = X,
                            {
                                minimum: P,
                                maximum: W
                            } = q._zod.bag;
                        if (typeof P === "number") M.minItems = P;
                        if (typeof W === "number") M.maxItems = W;
                        M.type = "array", M.items = this.process(z.element, {
                            ...H,
                            path: [...H.path, "items"]
                        });
                        break
                    }
                    case "object": {
                        let M = X;
                        M.type = "object", M.properties = {};
                        let P = z.shape;
                        for (let Z in P) M.properties[Z] = this.process(P[Z], {
                            ...H,
                            path: [...H.path, "properties", Z]
                        });
                        let W = new Set(Object.keys(P)),
                            D = new Set([...W].filter((Z) => {
                                let G = z.shape[Z]._zod;
                                if (this.io === "input") return G.optin === void 0;
                                else return G.optout === void 0
                            }));
                        if (D.size > 0) M.required = Array.from(D);
                        if (z.catchall?._zod.def.type === "never") M.additionalProperties = !1;
                        else if (!z.catchall) {
                            if (this.io === "output") M.additionalProperties = !1
                        } else if (z.catchall) M.additionalProperties = this.process(z.catchall, {
                            ...H,
                            path: [...H.path, "additionalProperties"]
                        });
                        break
                    }
                    case "union": {
                        let M = X;
                        M.anyOf = z.options.map((P, W) => this.process(P, {
                            ...H,
                            path: [...H.path, "anyOf", W]
                        }));
                        break
                    }
                    case "intersection": {
                        let M = X,
                            P = this.process(z.left, {
                                ...H,
                                path: [...H.path, "allOf", 0]
                            }),
                            W = this.process(z.right, {
                                ...H,
                                path: [...H.path, "allOf", 1]
                            }),
                            D = (G) => ("allOf" in G) && Object.keys(G).length === 1,
                            Z = [...D(P) ? P.allOf : [P], ...D(W) ? W.allOf : [W]];
                        M.allOf = Z;
                        break
                    }
                    case "tuple": {
                        let M = X;
                        M.type = "array";
                        let P = z.items.map((Z, G) => this.process(Z, {
                            ...H,
                            path: [...H.path, "prefixItems", G]
                        }));
                        if (this.target === "draft-2020-12") M.prefixItems = P;
                        else M.items = P;
                        if (z.rest) {
                            let Z = this.process(z.rest, {
                                ...H,
                                path: [...H.path, "items"]
                            });
                            if (this.target === "draft-2020-12") M.items = Z;
                            else M.additionalItems = Z
                        }
                        if (z.rest) M.items = this.process(z.rest, {
                            ...H,
                            path: [...H.path, "items"]
                        });
                        let {
                            minimum: W,
                            maximum: D
                        } = q._zod.bag;
                        if (typeof W === "number") M.minItems = W;
                        if (typeof D === "number") M.maxItems = D;
                        break
                    }
                    case "record": {
                        let M = X;
                        M.type = "object", M.propertyNames = this.process(z.keyType, {
                            ...H,
                            path: [...H.path, "propertyNames"]
                        }), M.additionalProperties = this.process(z.valueType, {
                            ...H,
                            path: [...H.path, "additionalProperties"]
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
                        let M = X,
                            P = CF6(z.entries);
                        if (P.every((W) => typeof W === "number")) M.type = "number";
                        if (P.every((W) => typeof W === "string")) M.type = "string";
                        M.enum = P;
                        break
                    }
                    case "literal": {
                        let M = X,
                            P = [];
                        for (let W of z.values)
                            if (W === void 0) {
                                if (this.unrepresentable === "throw") throw Error("Literal `undefined` cannot be represented in JSON Schema")
                            } else if (typeof W === "bigint")
                            if (this.unrepresentable === "throw") throw Error("BigInt literals cannot be represented in JSON Schema");
                            else P.push(Number(W));
                        else P.push(W);
                        if (P.length === 0);
                        else if (P.length === 1) {
                            let W = P[0];
                            M.type = W === null ? "null" : typeof W, M.const = W
                        } else {
                            if (P.every((W) => typeof W === "number")) M.type = "number";
                            if (P.every((W) => typeof W === "string")) M.type = "string";
                            if (P.every((W) => typeof W === "boolean")) M.type = "string";
                            if (P.every((W) => W === null)) M.type = "null";
                            M.enum = P
                        }
                        break
                    }
                    case "file": {
                        let M = X,
                            P = {
                                type: "string",
                                format: "binary",
                                contentEncoding: "binary"
                            },
                            {
                                minimum: W,
                                maximum: D,
                                mime: Z
                            } = q._zod.bag;
                        if (W !== void 0) P.minLength = W;
                        if (D !== void 0) P.maxLength = D;
                        if (Z)
                            if (Z.length === 1) P.contentMediaType = Z[0], Object.assign(M, P);
                            else M.anyOf = Z.map((G) => {
                                return {
                                    ...P,
                                    contentMediaType: G
                                }
                            });
                        else Object.assign(M, P);
                        break
                    }
                    case "transform": {
                        if (this.unrepresentable === "throw") throw Error("Transforms cannot be represented in JSON Schema");
                        break
                    }
                    case "nullable": {
                        let M = this.process(z.innerType, H);
                        X.anyOf = [M, {
                            type: "null"
                        }];
                        break
                    }
                    case "nonoptional": {
                        this.process(z.innerType, H), O.ref = z.innerType;
                        break
                    }
                    case "success": {
                        let M = X;
                        M.type = "boolean";
                        break
                    }
                    case "default": {
                        this.process(z.innerType, H), O.ref = z.innerType, X.default = JSON.parse(JSON.stringify(z.defaultValue));
                        break
                    }
                    case "prefault": {
                        if (this.process(z.innerType, H), O.ref = z.innerType, this.io === "input") X._prefault = JSON.parse(JSON.stringify(z.defaultValue));
                        break
                    }
                    case "catch": {
                        this.process(z.innerType, H), O.ref = z.innerType;
                        let M;
                        try {
                            M = z.catchValue(void 0)
                        } catch {
                            throw Error("Dynamic catch values are not supported in JSON Schema")
                        }
                        X.default = M;
                        break
                    }
                    case "nan": {
                        if (this.unrepresentable === "throw") throw Error("NaN cannot be represented in JSON Schema");
                        break
                    }
                    case "template_literal": {
                        let M = X,
                            P = q._zod.pattern;
                        if (!P) throw Error("Pattern not found in template literal");
                        M.type = "string", M.pattern = P.source;
                        break
                    }
                    case "pipe": {
                        let M = this.io === "input" ? z.in._zod.def.type === "transform" ? z.out : z.in : z.out;
                        this.process(M, H), O.ref = M;
                        break
                    }
                    case "readonly": {
                        this.process(z.innerType, H), O.ref = z.innerType, X.readOnly = !0;
                        break
                    }
                    case "promise": {
                        this.process(z.innerType, H), O.ref = z.innerType;
                        break
                    }
                    case "optional": {
                        this.process(z.innerType, H), O.ref = z.innerType;
                        break
                    }
                    case "lazy": {
                        let M = q._zod.innerType;
                        this.process(M, H), O.ref = M;
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
        let $ = this.metadataRegistry.get(q);
        if ($) Object.assign(O.schema, $);
        if (this.io === "input" && EW(q)) delete O.schema.examples, delete O.schema.default;
        if (this.io === "input" && O.schema._prefault)(_ = O.schema).default ?? (_.default = O.schema._prefault);
        return delete O.schema._prefault, this.seen.get(q).schema
    }
    emit(q, K) {
        let _ = {
                cycles: K?.cycles ?? "ref",
                reused: K?.reused ?? "inline",
                external: K?.external ?? void 0
            },
            z = this.seen.get(q);
        if (!z) throw Error("Unprocessed schema. This is a bug in Zod.");
        let Y = (j) => {
                let H = this.target === "draft-2020-12" ? "$defs" : "definitions";
                if (_.external) {
                    let P = _.external.registry.get(j[0])?.id;
                    if (P) return {
                        ref: _.external.uri(P)
                    };
                    let W = j[1].defId ?? j[1].schema.id ?? `schema${this.counter++}`;
                    return j[1].defId = W, {
                        defId: W,
                        ref: `${_.external.uri("__shared")}#/${H}/${W}`
                    }
                }
                if (j[1] === z) return {
                    ref: "#"
                };
                let X = `${"#"}/${H}/`,
                    M = j[1].schema.id ?? `__schema${this.counter++}`;
                return {
                    defId: M,
                    ref: X + M
                }
            },
            A = (j) => {
                if (j[1].schema.$ref) return;
                let H = j[1],
                    {
                        ref: J,
                        defId: X
                    } = Y(j);
                if (H.def = {
                        ...H.schema
                    }, X) H.defId = X;
                let M = H.schema;
                for (let P in M) delete M[P];
                M.$ref = J
            };
        for (let j of this.seen.entries()) {
            let H = j[1];
            if (q === j[0]) {
                A(j);
                continue
            }
            if (_.external) {
                let X = _.external.registry.get(j[0])?.id;
                if (q !== j[0] && X) {
                    A(j);
                    continue
                }
            }
            if (this.metadataRegistry.get(j[0])?.id) {
                A(j);
                continue
            }
            if (H.cycle) {
                if (_.cycles === "throw") throw Error(`Cycle detected: #/${H.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
                else if (_.cycles === "ref") A(j);
                continue
            }
            if (H.count > 1) {
                if (_.reused === "ref") {
                    A(j);
                    continue
                }
            }
        }
        let O = (j, H) => {
            let J = this.seen.get(j),
                X = J.def ?? J.schema,
                M = {
                    ...X
                };
            if (J.ref === null) return;
            let P = J.ref;
            if (J.ref = null, P) {
                O(P, H);
                let W = this.seen.get(P).schema;
                if (W.$ref && H.target === "draft-7") X.allOf = X.allOf ?? [], X.allOf.push(W);
                else Object.assign(X, W), Object.assign(X, M)
            }
            if (!J.isParent) this.override({
                zodSchema: j,
                jsonSchema: X,
                path: J.path ?? []
            })
        };
        for (let j of [...this.seen.entries()].reverse()) O(j[0], {
            target: this.target
        });
        let w = {};
        if (this.target === "draft-2020-12") w.$schema = "https://json-schema.org/draft/2020-12/schema";
        else if (this.target === "draft-7") w.$schema = "http://json-schema.org/draft-07/schema#";
        else console.warn(`Invalid target: ${this.target}`);
        Object.assign(w, z.def);
        let $ = _.external?.defs ?? {};
        for (let j of this.seen.entries()) {
            let H = j[1];
            if (H.def && H.defId) $[H.defId] = H.def
        }
        if (!_.external && Object.keys($).length > 0)
            if (this.target === "draft-2020-12") w.$defs = $;
            else w.definitions = $;
        try {
            return JSON.parse(JSON.stringify(w))
        } catch (j) {
            throw Error("Error converting schema to JSON.")
        }
    }
}
// @from(Ln 24487, Col 0)
function zr(q, K) {
    if (q instanceof oF6) {
        let z = new P$8(K),
            Y = {};
        for (let w of q._idmap.entries()) {
            let [$, j] = w;
            z.process(j)
        }
        let A = {},
            O = {
                registry: q,
                uri: K?.uri || ((w) => w),
                defs: Y
            };
        for (let w of q._idmap.entries()) {
            let [$, j] = w;
            A[$] = z.emit(j, {
                ...K,
                external: O
            })
        }
        if (Object.keys(Y).length > 0) {
            let w = z.target === "draft-2020-12" ? "$defs" : "definitions";
            A.__shared = {
                [w]: Y
            }
        }
        return {
            schemas: A
        }
    }
    let _ = new P$8(K);
    return _.process(q), _.emit(q, K)
}
// @from(Ln 24522, Col 0)
function EW(q, K) {
    let _ = K ?? {
        seen: new Set
    };
    if (_.seen.has(q)) return !1;
    _.seen.add(q);
    let Y = q._zod.def;
    switch (Y.type) {
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
            return EW(Y.element, _);
        case "object": {
            for (let A in Y.shape)
                if (EW(Y.shape[A], _)) return !0;
            return !1
        }
        case "union": {
            for (let A of Y.options)
                if (EW(A, _)) return !0;
            return !1
        }
        case "intersection":
            return EW(Y.left, _) || EW(Y.right, _);
        case "tuple": {
            for (let A of Y.items)
                if (EW(A, _)) return !0;
            if (Y.rest && EW(Y.rest, _)) return !0;
            return !1
        }
        case "record":
            return EW(Y.keyType, _) || EW(Y.valueType, _);
        case "map":
            return EW(Y.keyType, _) || EW(Y.valueType, _);
        case "set":
            return EW(Y.valueType, _);
        case "promise":
        case "optional":
        case "nonoptional":
        case "nullable":
        case "readonly":
            return EW(Y.innerType, _);
        case "lazy":
            return EW(Y.getter(), _);
        case "default":
            return EW(Y.innerType, _);
        case "prefault":
            return EW(Y.innerType, _);
        case "custom":
            return !1;
        case "transform":
            return !0;
        case "pipe":
            return EW(Y.in, _) || EW(Y.out, _);
        case "success":
            return !1;
        case "catch":
            return !1;
        default:
    }
    throw Error(`Unknown schema type: ${Y.type}`)
}
// @from(Ln 24600, Col 4)
AN7 = L(() => {
    sK1();
    c3()
})
// @from(Ln 24604, Col 4)
ON7 = {}
// @from(Ln 24605, Col 4)
wN7 = () => {}
// @from(Ln 24606, Col 4)
_U = {}
// @from(Ln 24848, Col 4)
WV = L(() => {
    c3();
    u28();
    l28();
    wN7();
    TZ6();
    I28();
    Jq1();
    iF6();
    p28();
    O41();
    sK1();
    YN7();
    p51();
    AN7()
})
// @from(Ln 24864, Col 4)
$N7 = L(() => {
    WV()
})
// @from(Ln 24867, Col 4)
jN7 = () => {}
// @from(Ln 24868, Col 4)
HN7 = () => {}
// @from(Ln 24869, Col 4)
JN7 = () => {}
// @from(Ln 24870, Col 4)
XN7 = () => {}
// @from(Ln 24871, Col 4)
MN7 = L(() => {
    WV();
    l28();
    JN7();
    XN7();
    $N7();
    jN7();
    HN7()
})
// @from(Ln 24880, Col 4)
PN7 = L(() => {
    MN7()
})
// @from(Ln 24883, Col 4)
WN7 = L(() => {
    PN7()
})
// @from(Ln 24887, Col 0)
function q16(q) {
    return !!q._zod
}
// @from(Ln 24891, Col 0)
function DV(q, K) {
    if (q16(q)) return EZ6(q, K);
    return q.safeParse(K)
}
// @from(Ln 24896, Col 0)
function IZ6(q) {
    if (!q) return;
    let K;
    if (q16(q)) K = q._zod?.def?.shape;
    else K = q.shape;
    if (!K) return;
    if (typeof K === "function") try {
        return K()
    } catch {
        return
    }
    return K
}
// @from(Ln 24910, Col 0)
function DN7(q) {
    if (q16(q)) {
        let A = q._zod?.def;
        if (A) {
            if (A.value !== void 0) return A.value;
            if (Array.isArray(A.values) && A.values.length > 0) return A.values[0]
        }
    }
    let _ = q._def;
    if (_) {
        if (_.value !== void 0) return _.value;
        if (Array.isArray(_.values) && _.values.length > 0) return _.values[0]
    }
    let z = q.value;
    if (z !== void 0) return z;
    return
}
// @from(Ln 24927, Col 4)
Hg6 = L(() => {
    WN7()
})
// @from(Ln 24930, Col 4)
U51 = L(() => {
    WV()
})
// @from(Ln 24933, Col 4)
xZ6 = {}
// @from(Ln 24945, Col 0)
function Q51(q) {
    return K51(W$8, q)
}
// @from(Ln 24949, Col 0)
function d51(q) {
    return _51(D$8, q)
}
// @from(Ln 24953, Col 0)
function c51(q) {
    return z51(Z$8, q)
}
// @from(Ln 24957, Col 0)
function l51(q) {
    return Y51(f$8, q)
}
// @from(Ln 24960, Col 4)
W$8
// @from(Ln 24960, Col 9)
D$8
// @from(Ln 24960, Col 14)
Z$8
// @from(Ln 24960, Col 19)
f$8
// @from(Ln 24961, Col 4)
G$8 = L(() => {
    WV();
    v$8();
    W$8 = b1("ZodISODateTime", (q, K) => {
        G41.init(q, K), W$.init(q, K)
    });
    D$8 = b1("ZodISODate", (q, K) => {
        v41.init(q, K), W$.init(q, K)
    });
    Z$8 = b1("ZodISOTime", (q, K) => {
        T41.init(q, K), W$.init(q, K)
    });
    f$8 = b1("ZodISODuration", (q, K) => {
        V41.init(q, K), W$.init(q, K)
    })
})
// @from(Ln 24977, Col 4)
fN7 = (q, K) => {
        BF6.init(q, K), q.name = "ZodError", Object.defineProperties(q, {
            format: {
                value: (_) => FF6(q, _)
            },
            flatten: {
                value: (_) => pF6(q, _)
            },
            addIssue: {
                value: (_) => q.issues.push(_)
            },
            addIssues: {
                value: (_) => q.issues.push(..._)
            },
            isEmpty: {
                get() {
                    return q.issues.length === 0
                }
            }
        })
    }
// @from(Ln 24998, Col 4)
HE5
// @from(Ln 24998, Col 9)
uZ6
// @from(Ln 24999, Col 4)
n51 = L(() => {
    WV();
    WV();
    HE5 = b1("ZodError", fN7), uZ6 = b1("ZodError", fN7, {
        Parent: Error
    })
})
// @from(Ln 25006, Col 4)
i51
// @from(Ln 25006, Col 9)
r51
// @from(Ln 25006, Col 14)
o51
// @from(Ln 25006, Col 19)
a51
// @from(Ln 25007, Col 4)
s51 = L(() => {
    WV();
    n51();
    i51 = R28(uZ6), r51 = S28(uZ6), o51 = C28(uZ6), a51 = b28(uZ6)
})
// @from(Ln 25013, Col 0)
function O1(q) {
    return tK1(Xg6, q)
}
// @from(Ln 25017, Col 0)
function XE5(q) {
    return i28(q31, q)
}
// @from(Ln 25021, Col 0)
function ME5(q) {
    return aF6(T$8, q)
}
// @from(Ln 25025, Col 0)
function PE5(q) {
    return r28(Yr, q)
}
// @from(Ln 25029, Col 0)
function WE5(q) {
    return o28(Yr, q)
}
// @from(Ln 25033, Col 0)
function DE5(q) {
    return a28(Yr, q)
}
// @from(Ln 25037, Col 0)
function ZE5(q) {
    return s28(Yr, q)
}
// @from(Ln 25041, Col 0)
function _31(q) {
    return t28(K31, q)
}
// @from(Ln 25045, Col 0)
function fE5(q) {
    return e28(z31, q)
}
// @from(Ln 25049, Col 0)
function GE5(q) {
    return q$8(Y31, q)
}
// @from(Ln 25053, Col 0)
function vE5(q) {
    return K$8(A31, q)
}
// @from(Ln 25057, Col 0)
function TE5(q) {
    return _$8(O31, q)
}
// @from(Ln 25061, Col 0)
function VE5(q) {
    return z$8(w31, q)
}
// @from(Ln 25065, Col 0)
function kE5(q) {
    return Y$8($31, q)
}
// @from(Ln 25069, Col 0)
function NE5(q) {
    return A$8(j31, q)
}
// @from(Ln 25073, Col 0)
function EE5(q) {
    return O$8(H31, q)
}
// @from(Ln 25077, Col 0)
function yE5(q) {
    return w$8(J31, q)
}
// @from(Ln 25081, Col 0)
function LE5(q) {
    return $$8(X31, q)
}
// @from(Ln 25085, Col 0)
function hE5(q) {
    return j$8(M31, q)
}
// @from(Ln 25089, Col 0)
function RE5(q) {
    return H$8(P31, q)
}
// @from(Ln 25093, Col 0)
function SE5(q) {
    return J$8(W31, q)
}
// @from(Ln 25097, Col 0)
function CE5(q) {
    return X$8(D31, q)
}
// @from(Ln 25101, Col 0)
function bE5(q) {
    return M$8(Z31, q)
}
// @from(Ln 25105, Col 0)
function IE5(q, K, _ = {}) {
    return B51(GN7, q, K, _)
}
// @from(Ln 25109, Col 0)
function GY(q) {
    return A51(Mg6, q)
}
// @from(Ln 25113, Col 0)
function t51(q) {
    return w51(mZ6, q)
}
// @from(Ln 25117, Col 0)
function xE5(q) {
    return $51(mZ6, q)
}
// @from(Ln 25121, Col 0)
function uE5(q) {
    return j51(mZ6, q)
}
// @from(Ln 25125, Col 0)
function mE5(q) {
    return H51(mZ6, q)
}
// @from(Ln 25129, Col 0)
function BE5(q) {
    return J51(mZ6, q)
}
// @from(Ln 25133, Col 0)
function Xw(q) {
    return X51(Pg6, q)
}
// @from(Ln 25137, Col 0)
function pE5(q) {
    return P51(Wg6, q)
}
// @from(Ln 25141, Col 0)
function FE5(q) {
    return D51(f31, q)
}
// @from(Ln 25145, Col 0)
function gE5(q) {
    return Z51(f31, q)
}
// @from(Ln 25149, Col 0)
function UE5(q) {
    return f51(vN7, q)
}
// @from(Ln 25153, Col 0)
function QE5(q) {
    return G51(TN7, q)
}
// @from(Ln 25157, Col 0)
function N$8(q) {
    return v51(VN7, q)
}
// @from(Ln 25161, Col 0)
function G31() {
    return T51(kN7)
}
// @from(Ln 25165, Col 0)
function Kj() {
    return RZ6(NN7)
}
// @from(Ln 25169, Col 0)
function E$8(q) {
    return V51(EN7, q)
}
// @from(Ln 25173, Col 0)
function dE5(q) {
    return k51(yN7, q)
}
// @from(Ln 25177, Col 0)
function cE5(q) {
    return N51(y$8, q)
}
// @from(Ln 25181, Col 0)
function _4(q, K) {
    return jg6(LN7, q, K)
}
// @from(Ln 25185, Col 0)
function lE5(q) {
    let K = q._zod.def.shape;
    return RK(Object.keys(K))
}
// @from(Ln 25190, Col 0)
function G4(q, K) {
    let _ = {
        type: "object",
        get shape() {
            return K4.assignProp(this, "shape", {
                ...q
            }), this.shape
        },
        ...K4.normalizeParams(K)
    };
    return new L$8(_)
}
// @from(Ln 25203, Col 0)
function nE5(q, K) {
    return new L$8({
        type: "object",
        get shape() {
            return K4.assignProp(this, "shape", {
                ...q
            }), this.shape
        },
        catchall: E$8(),
        ...K4.normalizeParams(K)
    })
}
// @from(Ln 25216, Col 0)
function KP(q, K) {
    return new L$8({
        type: "object",
        get shape() {
            return K4.assignProp(this, "shape", {
                ...q
            }), this.shape
        },
        catchall: Kj(),
        ...K4.normalizeParams(K)
    })
}
// @from(Ln 25229, Col 0)
function dw(q, K) {
    return new v31({
        type: "union",
        options: q,
        ...K4.normalizeParams(K)
    })
}
// @from(Ln 25237, Col 0)
function h$8(q, K, _) {
    return new hN7({
        type: "union",
        options: K,
        discriminator: q,
        ...K4.normalizeParams(_)
    })
}
// @from(Ln 25246, Col 0)
function Dg6(q, K) {
    return new RN7({
        type: "intersection",
        left: q,
        right: K
    })
}
// @from(Ln 25254, Col 0)
function iE5(q, K, _) {
    let z = K instanceof O9,
        Y = z ? _ : K;
    return new SN7({
        type: "tuple",
        items: q,
        rest: z ? K : null,
        ...K4.normalizeParams(Y)
    })
}
// @from(Ln 25265, Col 0)
function cw(q, K, _) {
    return new T31({
        type: "record",
        keyType: q,
        valueType: K,
        ...K4.normalizeParams(_)
    })
}
// @from(Ln 25274, Col 0)
function rE5(q, K, _) {
    return new T31({
        type: "record",
        keyType: dw([q, E$8()]),
        valueType: K,
        ...K4.normalizeParams(_)
    })
}
// @from(Ln 25283, Col 0)
function oE5(q, K, _) {
    return new CN7({
        type: "map",
        keyType: q,
        valueType: K,
        ...K4.normalizeParams(_)
    })
}
// @from(Ln 25292, Col 0)
function aE5(q, K) {
    return new bN7({
        type: "set",
        valueType: q,
        ...K4.normalizeParams(K)
    })
}
// @from(Ln 25300, Col 0)
function ZV(q, K) {
    let _ = Array.isArray(q) ? Object.fromEntries(q.map((z) => [z, z])) : q;
    return new Jg6({
        type: "enum",
        entries: _,
        ...K4.normalizeParams(K)
    })
}
// @from(Ln 25309, Col 0)
function sE5(q, K) {
    return new Jg6({
        type: "enum",
        entries: q,
        ...K4.normalizeParams(K)
    })
}
// @from(Ln 25317, Col 0)
function RK(q, K) {
    return new IN7({
        type: "literal",
        values: Array.isArray(q) ? q : [q],
        ...K4.normalizeParams(K)
    })
}
// @from(Ln 25325, Col 0)
function tE5(q) {
    return I51(xN7, q)
}
// @from(Ln 25329, Col 0)
function k31(q) {
    return new V31({
        type: "transform",
        transform: q
    })
}
// @from(Ln 25336, Col 0)
function D$(q) {
    return new N31({
        type: "optional",
        innerType: q
    })
}
// @from(Ln 25343, Col 0)
function V$8(q) {
    return new uN7({
        type: "nullable",
        innerType: q
    })
}
// @from(Ln 25350, Col 0)
function eE5(q) {
    return D$(V$8(q))
}
// @from(Ln 25354, Col 0)
function BN7(q, K) {
    return new mN7({
        type: "default",
        innerType: q,
        get defaultValue() {
            return typeof K === "function" ? K() : K
        }
    })
}
// @from(Ln 25364, Col 0)
function FN7(q, K) {
    return new pN7({
        type: "prefault",
        innerType: q,
        get defaultValue() {
            return typeof K === "function" ? K() : K
        }
    })
}
// @from(Ln 25374, Col 0)
function gN7(q, K) {
    return new E31({
        type: "nonoptional",
        innerType: q,
        ...K4.normalizeParams(K)
    })
}
// @from(Ln 25382, Col 0)
function qy5(q) {
    return new UN7({
        type: "success",
        innerType: q
    })
}
// @from(Ln 25389, Col 0)
function dN7(q, K) {
    return new QN7({
        type: "catch",
        innerType: q,
        catchValue: typeof K === "function" ? K : () => K
    })
}
// @from(Ln 25397, Col 0)
function Ky5(q) {
    return y51(cN7, q)
}