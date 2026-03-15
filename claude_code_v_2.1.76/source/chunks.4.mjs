
// @from(Ln 9716, Col 4)
Joq = () => {
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
            let _ = typeof z;
            switch (_) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "tall";
                case "object": {
                    if (Array.isArray(z)) return "liste";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return _
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
                if (z.values.length === 1) return `Ugyldig verdi: forventet ${I7(z.values[0])}`;
                return `Ugyldig valg: forventet en av ${_A(z.values,"|")}`;
            case "too_big": {
                let _ = z.inclusive ? "<=" : "<",
                    w = q(z.origin);
                if (w) return `For stor(t): forventet ${z.origin??"value"} til å ha ${_}${z.maximum.toString()} ${w.unit??"elementer"}`;
                return `For stor(t): forventet ${z.origin??"value"} til å ha ${_}${z.maximum.toString()}`
            }
            case "too_small": {
                let _ = z.inclusive ? ">=" : ">",
                    w = q(z.origin);
                if (w) return `For lite(n): forventet ${z.origin} til å ha ${_}${z.minimum.toString()} ${w.unit}`;
                return `For lite(n): forventet ${z.origin} til å ha ${_}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let _ = z;
                if (_.format === "starts_with") return `Ugyldig streng: må starte med "${_.prefix}"`;
                if (_.format === "ends_with") return `Ugyldig streng: må ende med "${_.suffix}"`;
                if (_.format === "includes") return `Ugyldig streng: må inneholde "${_.includes}"`;
                if (_.format === "regex") return `Ugyldig streng: må matche mønsteret ${_.pattern}`;
                return `Ugyldig ${Y[_.format]??z.format}`
            }
            case "not_multiple_of":
                return `Ugyldig tall: må være et multiplum av ${z.divisor}`;
            case "unrecognized_keys":
                return `${z.keys.length>1?"Ukjente nøkler":"Ukjent nøkkel"}: ${_A(z.keys,", ")}`;
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
// @from(Ln 9824, Col 4)
a7A = E(() => {
    QK()
})
// @from(Ln 9828, Col 0)
function sg1() {
    return {
        localeError: Moq()
    }
}
// @from(Ln 9833, Col 4)
Moq = () => {
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
            let _ = typeof z;
            switch (_) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "numara";
                case "object": {
                    if (Array.isArray(z)) return "saf";
                    if (z === null) return "gayb";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return _
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
                if (z.values.length === 1) return `Fâsit giren: umulan ${I7(z.values[0])}`;
                return `Fâsit tercih: mûteberler ${_A(z.values,"|")}`;
            case "too_big": {
                let _ = z.inclusive ? "<=" : "<",
                    w = q(z.origin);
                if (w) return `Fazla büyük: ${z.origin??"value"}, ${_}${z.maximum.toString()} ${w.unit??"elements"} sahip olmalıydı.`;
                return `Fazla büyük: ${z.origin??"value"}, ${_}${z.maximum.toString()} olmalıydı.`
            }
            case "too_small": {
                let _ = z.inclusive ? ">=" : ">",
                    w = q(z.origin);
                if (w) return `Fazla küçük: ${z.origin}, ${_}${z.minimum.toString()} ${w.unit} sahip olmalıydı.`;
                return `Fazla küçük: ${z.origin}, ${_}${z.minimum.toString()} olmalıydı.`
            }
            case "invalid_format": {
                let _ = z;
                if (_.format === "starts_with") return `Fâsit metin: "${_.prefix}" ile başlamalı.`;
                if (_.format === "ends_with") return `Fâsit metin: "${_.suffix}" ile bitmeli.`;
                if (_.format === "includes") return `Fâsit metin: "${_.includes}" ihtivâ etmeli.`;
                if (_.format === "regex") return `Fâsit metin: ${_.pattern} nakşına uymalı.`;
                return `Fâsit ${Y[_.format]??z.format}`
            }
            case "not_multiple_of":
                return `Fâsit sayı: ${z.divisor} katı olmalıydı.`;
            case "unrecognized_keys":
                return `Tanınmayan anahtar ${z.keys.length>1?"s":""}: ${_A(z.keys,", ")}`;
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
// @from(Ln 9941, Col 4)
s7A = E(() => {
    QK()
})
// @from(Ln 9945, Col 0)
function tg1() {
    return {
        localeError: Doq()
    }
}
// @from(Ln 9950, Col 4)
Doq = () => {
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
            let _ = typeof z;
            switch (_) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "عدد";
                case "object": {
                    if (Array.isArray(z)) return "ارې";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return _
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
                if (z.values.length === 1) return `ناسم ورودي: باید ${I7(z.values[0])} وای`;
                return `ناسم انتخاب: باید یو له ${_A(z.values,"|")} څخه وای`;
            case "too_big": {
                let _ = z.inclusive ? "<=" : "<",
                    w = q(z.origin);
                if (w) return `ډیر لوی: ${z.origin??"ارزښت"} باید ${_}${z.maximum.toString()} ${w.unit??"عنصرونه"} ولري`;
                return `ډیر لوی: ${z.origin??"ارزښت"} باید ${_}${z.maximum.toString()} وي`
            }
            case "too_small": {
                let _ = z.inclusive ? ">=" : ">",
                    w = q(z.origin);
                if (w) return `ډیر کوچنی: ${z.origin} باید ${_}${z.minimum.toString()} ${w.unit} ولري`;
                return `ډیر کوچنی: ${z.origin} باید ${_}${z.minimum.toString()} وي`
            }
            case "invalid_format": {
                let _ = z;
                if (_.format === "starts_with") return `ناسم متن: باید د "${_.prefix}" سره پیل شي`;
                if (_.format === "ends_with") return `ناسم متن: باید د "${_.suffix}" سره پای ته ورسيږي`;
                if (_.format === "includes") return `ناسم متن: باید "${_.includes}" ولري`;
                if (_.format === "regex") return `ناسم متن: باید د ${_.pattern} سره مطابقت ولري`;
                return `${Y[_.format]??z.format} ناسم دی`
            }
            case "not_multiple_of":
                return `ناسم عدد: باید د ${z.divisor} مضرب وي`;
            case "unrecognized_keys":
                return `ناسم ${z.keys.length>1?"کلیډونه":"کلیډ"}: ${_A(z.keys,", ")}`;
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
// @from(Ln 10058, Col 4)
t7A = E(() => {
    QK()
})
// @from(Ln 10062, Col 0)
function eg1() {
    return {
        localeError: Xoq()
    }
}
// @from(Ln 10067, Col 4)
Xoq = () => {
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
            let _ = typeof z;
            switch (_) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "liczba";
                case "object": {
                    if (Array.isArray(z)) return "tablica";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return _
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
                if (z.values.length === 1) return `Nieprawidłowe dane wejściowe: oczekiwano ${I7(z.values[0])}`;
                return `Nieprawidłowa opcja: oczekiwano jednej z wartości ${_A(z.values,"|")}`;
            case "too_big": {
                let _ = z.inclusive ? "<=" : "<",
                    w = q(z.origin);
                if (w) return `Za duża wartość: oczekiwano, że ${z.origin??"wartość"} będzie mieć ${_}${z.maximum.toString()} ${w.unit??"elementów"}`;
                return `Zbyt duż(y/a/e): oczekiwano, że ${z.origin??"wartość"} będzie wynosić ${_}${z.maximum.toString()}`
            }
            case "too_small": {
                let _ = z.inclusive ? ">=" : ">",
                    w = q(z.origin);
                if (w) return `Za mała wartość: oczekiwano, że ${z.origin??"wartość"} będzie mieć ${_}${z.minimum.toString()} ${w.unit??"elementów"}`;
                return `Zbyt mał(y/a/e): oczekiwano, że ${z.origin??"wartość"} będzie wynosić ${_}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let _ = z;
                if (_.format === "starts_with") return `Nieprawidłowy ciąg znaków: musi zaczynać się od "${_.prefix}"`;
                if (_.format === "ends_with") return `Nieprawidłowy ciąg znaków: musi kończyć się na "${_.suffix}"`;
                if (_.format === "includes") return `Nieprawidłowy ciąg znaków: musi zawierać "${_.includes}"`;
                if (_.format === "regex") return `Nieprawidłowy ciąg znaków: musi odpowiadać wzorcowi ${_.pattern}`;
                return `Nieprawidłow(y/a/e) ${Y[_.format]??z.format}`
            }
            case "not_multiple_of":
                return `Nieprawidłowa liczba: musi być wielokrotnością ${z.divisor}`;
            case "unrecognized_keys":
                return `Nierozpoznane klucze${z.keys.length>1?"s":""}: ${_A(z.keys,", ")}`;
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
// @from(Ln 10175, Col 4)
e7A = E(() => {
    QK()
})
// @from(Ln 10179, Col 0)
function AF1() {
    return {
        localeError: Poq()
    }
}
// @from(Ln 10184, Col 4)
Poq = () => {
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
            let _ = typeof z;
            switch (_) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "número";
                case "object": {
                    if (Array.isArray(z)) return "array";
                    if (z === null) return "nulo";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return _
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
                if (z.values.length === 1) return `Entrada inválida: esperado ${I7(z.values[0])}`;
                return `Opção inválida: esperada uma das ${_A(z.values,"|")}`;
            case "too_big": {
                let _ = z.inclusive ? "<=" : "<",
                    w = q(z.origin);
                if (w) return `Muito grande: esperado que ${z.origin??"valor"} tivesse ${_}${z.maximum.toString()} ${w.unit??"elementos"}`;
                return `Muito grande: esperado que ${z.origin??"valor"} fosse ${_}${z.maximum.toString()}`
            }
            case "too_small": {
                let _ = z.inclusive ? ">=" : ">",
                    w = q(z.origin);
                if (w) return `Muito pequeno: esperado que ${z.origin} tivesse ${_}${z.minimum.toString()} ${w.unit}`;
                return `Muito pequeno: esperado que ${z.origin} fosse ${_}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let _ = z;
                if (_.format === "starts_with") return `Texto inválido: deve começar com "${_.prefix}"`;
                if (_.format === "ends_with") return `Texto inválido: deve terminar com "${_.suffix}"`;
                if (_.format === "includes") return `Texto inválido: deve incluir "${_.includes}"`;
                if (_.format === "regex") return `Texto inválido: deve corresponder ao padrão ${_.pattern}`;
                return `${Y[_.format]??z.format} inválido`
            }
            case "not_multiple_of":
                return `Número inválido: deve ser múltiplo de ${z.divisor}`;
            case "unrecognized_keys":
                return `Chave${z.keys.length>1?"s":""} desconhecida${z.keys.length>1?"s":""}: ${_A(z.keys,", ")}`;
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
// @from(Ln 10292, Col 4)
A4A = E(() => {
    QK()
})
// @from(Ln 10296, Col 0)
function q4A(A, q, K, Y) {
    let z = Math.abs(A),
        _ = z % 10,
        w = z % 100;
    if (w >= 11 && w <= 19) return Y;
    if (_ === 1) return q;
    if (_ >= 2 && _ <= 4) return K;
    return Y
}
// @from(Ln 10306, Col 0)
function qF1() {
    return {
        localeError: Woq()
    }
}
// @from(Ln 10311, Col 4)
Woq = () => {
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
            let _ = typeof z;
            switch (_) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "число";
                case "object": {
                    if (Array.isArray(z)) return "массив";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return _
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
                if (z.values.length === 1) return `Неверный ввод: ожидалось ${I7(z.values[0])}`;
                return `Неверный вариант: ожидалось одно из ${_A(z.values,"|")}`;
            case "too_big": {
                let _ = z.inclusive ? "<=" : "<",
                    w = q(z.origin);
                if (w) {
                    let O = Number(z.maximum),
                        $ = q4A(O, w.unit.one, w.unit.few, w.unit.many);
                    return `Слишком большое значение: ожидалось, что ${z.origin??"значение"} будет иметь ${_}${z.maximum.toString()} ${$}`
                }
                return `Слишком большое значение: ожидалось, что ${z.origin??"значение"} будет ${_}${z.maximum.toString()}`
            }
            case "too_small": {
                let _ = z.inclusive ? ">=" : ">",
                    w = q(z.origin);
                if (w) {
                    let O = Number(z.minimum),
                        $ = q4A(O, w.unit.one, w.unit.few, w.unit.many);
                    return `Слишком маленькое значение: ожидалось, что ${z.origin} будет иметь ${_}${z.minimum.toString()} ${$}`
                }
                return `Слишком маленькое значение: ожидалось, что ${z.origin} будет ${_}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let _ = z;
                if (_.format === "starts_with") return `Неверная строка: должна начинаться с "${_.prefix}"`;
                if (_.format === "ends_with") return `Неверная строка: должна заканчиваться на "${_.suffix}"`;
                if (_.format === "includes") return `Неверная строка: должна содержать "${_.includes}"`;
                if (_.format === "regex") return `Неверная строка: должна соответствовать шаблону ${_.pattern}`;
                return `Неверный ${Y[_.format]??z.format}`
            }
            case "not_multiple_of":
                return `Неверное число: должно быть кратным ${z.divisor}`;
            case "unrecognized_keys":
                return `Нераспознанн${z.keys.length>1?"ые":"ый"} ключ${z.keys.length>1?"и":""}: ${_A(z.keys,", ")}`;
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
// @from(Ln 10443, Col 4)
K4A = E(() => {
    QK()
})
// @from(Ln 10447, Col 0)
function KF1() {
    return {
        localeError: Zoq()
    }
}
// @from(Ln 10452, Col 4)
Zoq = () => {
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
            let _ = typeof z;
            switch (_) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "število";
                case "object": {
                    if (Array.isArray(z)) return "tabela";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return _
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
                if (z.values.length === 1) return `Neveljaven vnos: pričakovano ${I7(z.values[0])}`;
                return `Neveljavna možnost: pričakovano eno izmed ${_A(z.values,"|")}`;
            case "too_big": {
                let _ = z.inclusive ? "<=" : "<",
                    w = q(z.origin);
                if (w) return `Preveliko: pričakovano, da bo ${z.origin??"vrednost"} imelo ${_}${z.maximum.toString()} ${w.unit??"elementov"}`;
                return `Preveliko: pričakovano, da bo ${z.origin??"vrednost"} ${_}${z.maximum.toString()}`
            }
            case "too_small": {
                let _ = z.inclusive ? ">=" : ">",
                    w = q(z.origin);
                if (w) return `Premajhno: pričakovano, da bo ${z.origin} imelo ${_}${z.minimum.toString()} ${w.unit}`;
                return `Premajhno: pričakovano, da bo ${z.origin} ${_}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let _ = z;
                if (_.format === "starts_with") return `Neveljaven niz: mora se začeti z "${_.prefix}"`;
                if (_.format === "ends_with") return `Neveljaven niz: mora se končati z "${_.suffix}"`;
                if (_.format === "includes") return `Neveljaven niz: mora vsebovati "${_.includes}"`;
                if (_.format === "regex") return `Neveljaven niz: mora ustrezati vzorcu ${_.pattern}`;
                return `Neveljaven ${Y[_.format]??z.format}`
            }
            case "not_multiple_of":
                return `Neveljavno število: mora biti večkratnik ${z.divisor}`;
            case "unrecognized_keys":
                return `Neprepoznan${z.keys.length>1?"i ključi":" ključ"}: ${_A(z.keys,", ")}`;
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
// @from(Ln 10560, Col 4)
Y4A = E(() => {
    QK()
})
// @from(Ln 10564, Col 0)
function YF1() {
    return {
        localeError: Goq()
    }
}
// @from(Ln 10569, Col 4)
Goq = () => {
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
            let _ = typeof z;
            switch (_) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "antal";
                case "object": {
                    if (Array.isArray(z)) return "lista";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return _
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
                if (z.values.length === 1) return `Ogiltig inmatning: förväntat ${I7(z.values[0])}`;
                return `Ogiltigt val: förväntade en av ${_A(z.values,"|")}`;
            case "too_big": {
                let _ = z.inclusive ? "<=" : "<",
                    w = q(z.origin);
                if (w) return `För stor(t): förväntade ${z.origin??"värdet"} att ha ${_}${z.maximum.toString()} ${w.unit??"element"}`;
                return `För stor(t): förväntat ${z.origin??"värdet"} att ha ${_}${z.maximum.toString()}`
            }
            case "too_small": {
                let _ = z.inclusive ? ">=" : ">",
                    w = q(z.origin);
                if (w) return `För lite(t): förväntade ${z.origin??"värdet"} att ha ${_}${z.minimum.toString()} ${w.unit}`;
                return `För lite(t): förväntade ${z.origin??"värdet"} att ha ${_}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let _ = z;
                if (_.format === "starts_with") return `Ogiltig sträng: måste börja med "${_.prefix}"`;
                if (_.format === "ends_with") return `Ogiltig sträng: måste sluta med "${_.suffix}"`;
                if (_.format === "includes") return `Ogiltig sträng: måste innehålla "${_.includes}"`;
                if (_.format === "regex") return `Ogiltig sträng: måste matcha mönstret "${_.pattern}"`;
                return `Ogiltig(t) ${Y[_.format]??z.format}`
            }
            case "not_multiple_of":
                return `Ogiltigt tal: måste vara en multipel av ${z.divisor}`;
            case "unrecognized_keys":
                return `${z.keys.length>1?"Okända nycklar":"Okänd nyckel"}: ${_A(z.keys,", ")}`;
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
// @from(Ln 10677, Col 4)
z4A = E(() => {
    QK()
})
// @from(Ln 10681, Col 0)
function zF1() {
    return {
        localeError: foq()
    }
}
// @from(Ln 10686, Col 4)
foq = () => {
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
            let _ = typeof z;
            switch (_) {
                case "number":
                    return Number.isNaN(z) ? "எண் அல்லாதது" : "எண்";
                case "object": {
                    if (Array.isArray(z)) return "அணி";
                    if (z === null) return "வெறுமை";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return _
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
                if (z.values.length === 1) return `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${I7(z.values[0])}`;
                return `தவறான விருப்பம்: எதிர்பார்க்கப்பட்டது ${_A(z.values,"|")} இல் ஒன்று`;
            case "too_big": {
                let _ = z.inclusive ? "<=" : "<",
                    w = q(z.origin);
                if (w) return `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${z.origin??"மதிப்பு"} ${_}${z.maximum.toString()} ${w.unit??"உறுப்புகள்"} ஆக இருக்க வேண்டும்`;
                return `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${z.origin??"மதிப்பு"} ${_}${z.maximum.toString()} ஆக இருக்க வேண்டும்`
            }
            case "too_small": {
                let _ = z.inclusive ? ">=" : ">",
                    w = q(z.origin);
                if (w) return `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${z.origin} ${_}${z.minimum.toString()} ${w.unit} ஆக இருக்க வேண்டும்`;
                return `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${z.origin} ${_}${z.minimum.toString()} ஆக இருக்க வேண்டும்`
            }
            case "invalid_format": {
                let _ = z;
                if (_.format === "starts_with") return `தவறான சரம்: "${_.prefix}" இல் தொடங்க வேண்டும்`;
                if (_.format === "ends_with") return `தவறான சரம்: "${_.suffix}" இல் முடிவடைய வேண்டும்`;
                if (_.format === "includes") return `தவறான சரம்: "${_.includes}" ஐ உள்ளடக்க வேண்டும்`;
                if (_.format === "regex") return `தவறான சரம்: ${_.pattern} முறைபாட்டுடன் பொருந்த வேண்டும்`;
                return `தவறான ${Y[_.format]??z.format}`
            }
            case "not_multiple_of":
                return `தவறான எண்: ${z.divisor} இன் பலமாக இருக்க வேண்டும்`;
            case "unrecognized_keys":
                return `அடையாளம் தெரியாத விசை${z.keys.length>1?"கள்":""}: ${_A(z.keys,", ")}`;
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
// @from(Ln 10794, Col 4)
_4A = E(() => {
    QK()
})
// @from(Ln 10798, Col 0)
function _F1() {
    return {
        localeError: Toq()
    }
}
// @from(Ln 10803, Col 4)
Toq = () => {
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
            let _ = typeof z;
            switch (_) {
                case "number":
                    return Number.isNaN(z) ? "ไม่ใช่ตัวเลข (NaN)" : "ตัวเลข";
                case "object": {
                    if (Array.isArray(z)) return "อาร์เรย์ (Array)";
                    if (z === null) return "ไม่มีค่า (null)";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return _
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
                if (z.values.length === 1) return `ค่าไม่ถูกต้อง: ควรเป็น ${I7(z.values[0])}`;
                return `ตัวเลือกไม่ถูกต้อง: ควรเป็นหนึ่งใน ${_A(z.values,"|")}`;
            case "too_big": {
                let _ = z.inclusive ? "ไม่เกิน" : "น้อยกว่า",
                    w = q(z.origin);
                if (w) return `เกินกำหนด: ${z.origin??"ค่า"} ควรมี${_} ${z.maximum.toString()} ${w.unit??"รายการ"}`;
                return `เกินกำหนด: ${z.origin??"ค่า"} ควรมี${_} ${z.maximum.toString()}`
            }
            case "too_small": {
                let _ = z.inclusive ? "อย่างน้อย" : "มากกว่า",
                    w = q(z.origin);
                if (w) return `น้อยกว่ากำหนด: ${z.origin} ควรมี${_} ${z.minimum.toString()} ${w.unit}`;
                return `น้อยกว่ากำหนด: ${z.origin} ควรมี${_} ${z.minimum.toString()}`
            }
            case "invalid_format": {
                let _ = z;
                if (_.format === "starts_with") return `รูปแบบไม่ถูกต้อง: ข้อความต้องขึ้นต้นด้วย "${_.prefix}"`;
                if (_.format === "ends_with") return `รูปแบบไม่ถูกต้อง: ข้อความต้องลงท้ายด้วย "${_.suffix}"`;
                if (_.format === "includes") return `รูปแบบไม่ถูกต้อง: ข้อความต้องมี "${_.includes}" อยู่ในข้อความ`;
                if (_.format === "regex") return `รูปแบบไม่ถูกต้อง: ต้องตรงกับรูปแบบที่กำหนด ${_.pattern}`;
                return `รูปแบบไม่ถูกต้อง: ${Y[_.format]??z.format}`
            }
            case "not_multiple_of":
                return `ตัวเลขไม่ถูกต้อง: ต้องเป็นจำนวนที่หารด้วย ${z.divisor} ได้ลงตัว`;
            case "unrecognized_keys":
                return `พบคีย์ที่ไม่รู้จัก: ${_A(z.keys,", ")}`;
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
// @from(Ln 10911, Col 4)
w4A = E(() => {
    QK()
})
// @from(Ln 10915, Col 0)
function wF1() {
    return {
        localeError: Noq()
    }
}
// @from(Ln 10920, Col 4)
voq = (A) => {
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
// @from(Ln 10933, Col 4)
Noq = () => {
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
                    return `Geçersiz değer: beklenen ${Y.expected}, alınan ${voq(Y.input)}`;
                case "invalid_value":
                    if (Y.values.length === 1) return `Geçersiz değer: beklenen ${I7(Y.values[0])}`;
                    return `Geçersiz seçenek: aşağıdakilerden biri olmalı: ${_A(Y.values,"|")}`;
                case "too_big": {
                    let z = Y.inclusive ? "<=" : "<",
                        _ = q(Y.origin);
                    if (_) return `Çok büyük: beklenen ${Y.origin??"değer"} ${z}${Y.maximum.toString()} ${_.unit??"öğe"}`;
                    return `Çok büyük: beklenen ${Y.origin??"değer"} ${z}${Y.maximum.toString()}`
                }
                case "too_small": {
                    let z = Y.inclusive ? ">=" : ">",
                        _ = q(Y.origin);
                    if (_) return `Çok küçük: beklenen ${Y.origin} ${z}${Y.minimum.toString()} ${_.unit}`;
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
                    return `Tanınmayan anahtar${Y.keys.length>1?"lar":""}: ${_A(Y.keys,", ")}`;
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
// @from(Ln 11028, Col 4)
O4A = E(() => {
    QK()
})
// @from(Ln 11032, Col 0)
function OF1() {
    return {
        localeError: Voq()
    }
}
// @from(Ln 11037, Col 4)
Voq = () => {
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
            let _ = typeof z;
            switch (_) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "число";
                case "object": {
                    if (Array.isArray(z)) return "масив";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return _
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
                if (z.values.length === 1) return `Неправильні вхідні дані: очікується ${I7(z.values[0])}`;
                return `Неправильна опція: очікується одне з ${_A(z.values,"|")}`;
            case "too_big": {
                let _ = z.inclusive ? "<=" : "<",
                    w = q(z.origin);
                if (w) return `Занадто велике: очікується, що ${z.origin??"значення"} ${w.verb} ${_}${z.maximum.toString()} ${w.unit??"елементів"}`;
                return `Занадто велике: очікується, що ${z.origin??"значення"} буде ${_}${z.maximum.toString()}`
            }
            case "too_small": {
                let _ = z.inclusive ? ">=" : ">",
                    w = q(z.origin);
                if (w) return `Занадто мале: очікується, що ${z.origin} ${w.verb} ${_}${z.minimum.toString()} ${w.unit}`;
                return `Занадто мале: очікується, що ${z.origin} буде ${_}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let _ = z;
                if (_.format === "starts_with") return `Неправильний рядок: повинен починатися з "${_.prefix}"`;
                if (_.format === "ends_with") return `Неправильний рядок: повинен закінчуватися на "${_.suffix}"`;
                if (_.format === "includes") return `Неправильний рядок: повинен містити "${_.includes}"`;
                if (_.format === "regex") return `Неправильний рядок: повинен відповідати шаблону ${_.pattern}`;
                return `Неправильний ${Y[_.format]??z.format}`
            }
            case "not_multiple_of":
                return `Неправильне число: повинно бути кратним ${z.divisor}`;
            case "unrecognized_keys":
                return `Нерозпізнаний ключ${z.keys.length>1?"і":""}: ${_A(z.keys,", ")}`;
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
// @from(Ln 11145, Col 4)
$4A = E(() => {
    QK()
})
// @from(Ln 11149, Col 0)
function $F1() {
    return {
        localeError: koq()
    }
}
// @from(Ln 11154, Col 4)
koq = () => {
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
            let _ = typeof z;
            switch (_) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "نمبر";
                case "object": {
                    if (Array.isArray(z)) return "آرے";
                    if (z === null) return "نل";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return _
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
                if (z.values.length === 1) return `غلط ان پٹ: ${I7(z.values[0])} متوقع تھا`;
                return `غلط آپشن: ${_A(z.values,"|")} میں سے ایک متوقع تھا`;
            case "too_big": {
                let _ = z.inclusive ? "<=" : "<",
                    w = q(z.origin);
                if (w) return `بہت بڑا: ${z.origin??"ویلیو"} کے ${_}${z.maximum.toString()} ${w.unit??"عناصر"} ہونے متوقع تھے`;
                return `بہت بڑا: ${z.origin??"ویلیو"} کا ${_}${z.maximum.toString()} ہونا متوقع تھا`
            }
            case "too_small": {
                let _ = z.inclusive ? ">=" : ">",
                    w = q(z.origin);
                if (w) return `بہت چھوٹا: ${z.origin} کے ${_}${z.minimum.toString()} ${w.unit} ہونے متوقع تھے`;
                return `بہت چھوٹا: ${z.origin} کا ${_}${z.minimum.toString()} ہونا متوقع تھا`
            }
            case "invalid_format": {
                let _ = z;
                if (_.format === "starts_with") return `غلط سٹرنگ: "${_.prefix}" سے شروع ہونا چاہیے`;
                if (_.format === "ends_with") return `غلط سٹرنگ: "${_.suffix}" پر ختم ہونا چاہیے`;
                if (_.format === "includes") return `غلط سٹرنگ: "${_.includes}" شامل ہونا چاہیے`;
                if (_.format === "regex") return `غلط سٹرنگ: پیٹرن ${_.pattern} سے میچ ہونا چاہیے`;
                return `غلط ${Y[_.format]??z.format}`
            }
            case "not_multiple_of":
                return `غلط نمبر: ${z.divisor} کا مضاعف ہونا چاہیے`;
            case "unrecognized_keys":
                return `غیر تسلیم شدہ کی${z.keys.length>1?"ز":""}: ${_A(z.keys,"، ")}`;
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
// @from(Ln 11262, Col 4)
H4A = E(() => {
    QK()
})
// @from(Ln 11266, Col 0)
function HF1() {
    return {
        localeError: Eoq()
    }
}
// @from(Ln 11271, Col 4)
Eoq = () => {
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
            let _ = typeof z;
            switch (_) {
                case "number":
                    return Number.isNaN(z) ? "NaN" : "số";
                case "object": {
                    if (Array.isArray(z)) return "mảng";
                    if (z === null) return "null";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return _
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
                if (z.values.length === 1) return `Đầu vào không hợp lệ: mong đợi ${I7(z.values[0])}`;
                return `Tùy chọn không hợp lệ: mong đợi một trong các giá trị ${_A(z.values,"|")}`;
            case "too_big": {
                let _ = z.inclusive ? "<=" : "<",
                    w = q(z.origin);
                if (w) return `Quá lớn: mong đợi ${z.origin??"giá trị"} ${w.verb} ${_}${z.maximum.toString()} ${w.unit??"phần tử"}`;
                return `Quá lớn: mong đợi ${z.origin??"giá trị"} ${_}${z.maximum.toString()}`
            }
            case "too_small": {
                let _ = z.inclusive ? ">=" : ">",
                    w = q(z.origin);
                if (w) return `Quá nhỏ: mong đợi ${z.origin} ${w.verb} ${_}${z.minimum.toString()} ${w.unit}`;
                return `Quá nhỏ: mong đợi ${z.origin} ${_}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let _ = z;
                if (_.format === "starts_with") return `Chuỗi không hợp lệ: phải bắt đầu bằng "${_.prefix}"`;
                if (_.format === "ends_with") return `Chuỗi không hợp lệ: phải kết thúc bằng "${_.suffix}"`;
                if (_.format === "includes") return `Chuỗi không hợp lệ: phải bao gồm "${_.includes}"`;
                if (_.format === "regex") return `Chuỗi không hợp lệ: phải khớp với mẫu ${_.pattern}`;
                return `${Y[_.format]??z.format} không hợp lệ`
            }
            case "not_multiple_of":
                return `Số không hợp lệ: phải là bội số của ${z.divisor}`;
            case "unrecognized_keys":
                return `Khóa không được nhận dạng: ${_A(z.keys,", ")}`;
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
// @from(Ln 11379, Col 4)
j4A = E(() => {
    QK()
})
// @from(Ln 11383, Col 0)
function jF1() {
    return {
        localeError: yoq()
    }
}
// @from(Ln 11388, Col 4)
yoq = () => {
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
            let _ = typeof z;
            switch (_) {
                case "number":
                    return Number.isNaN(z) ? "非数字(NaN)" : "数字";
                case "object": {
                    if (Array.isArray(z)) return "数组";
                    if (z === null) return "空值(null)";
                    if (Object.getPrototypeOf(z) !== Object.prototype && z.constructor) return z.constructor.name
                }
            }
            return _
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
                if (z.values.length === 1) return `无效输入：期望 ${I7(z.values[0])}`;
                return `无效选项：期望以下之一 ${_A(z.values,"|")}`;
            case "too_big": {
                let _ = z.inclusive ? "<=" : "<",
                    w = q(z.origin);
                if (w) return `数值过大：期望 ${z.origin??"值"} ${_}${z.maximum.toString()} ${w.unit??"个元素"}`;
                return `数值过大：期望 ${z.origin??"值"} ${_}${z.maximum.toString()}`
            }
            case "too_small": {
                let _ = z.inclusive ? ">=" : ">",
                    w = q(z.origin);
                if (w) return `数值过小：期望 ${z.origin} ${_}${z.minimum.toString()} ${w.unit}`;
                return `数值过小：期望 ${z.origin} ${_}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let _ = z;
                if (_.format === "starts_with") return `无效字符串：必须以 "${_.prefix}" 开头`;
                if (_.format === "ends_with") return `无效字符串：必须以 "${_.suffix}" 结尾`;
                if (_.format === "includes") return `无效字符串：必须包含 "${_.includes}"`;
                if (_.format === "regex") return `无效字符串：必须满足正则表达式 ${_.pattern}`;
                return `无效${Y[_.format]??z.format}`
            }
            case "not_multiple_of":
                return `无效数字：必须是 ${z.divisor} 的倍数`;
            case "unrecognized_keys":
                return `出现未知的键(key): ${_A(z.keys,", ")}`;
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
// @from(Ln 11496, Col 4)
J4A = E(() => {
    QK()
})
// @from(Ln 11500, Col 0)
function JF1() {
    return {
        localeError: Loq()
    }
}
// @from(Ln 11505, Col 4)
Loq = () => {
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
                if (z.values.length === 1) return `無效的輸入值：預期為 ${I7(z.values[0])}`;
                return `無效的選項：預期為以下其中之一 ${_A(z.values,"|")}`;
            case "too_big": {
                let _ = z.inclusive ? "<=" : "<",
                    w = q(z.origin);
                if (w) return `數值過大：預期 ${z.origin??"值"} 應為 ${_}${z.maximum.toString()} ${w.unit??"個元素"}`;
                return `數值過大：預期 ${z.origin??"值"} 應為 ${_}${z.maximum.toString()}`
            }
            case "too_small": {
                let _ = z.inclusive ? ">=" : ">",
                    w = q(z.origin);
                if (w) return `數值過小：預期 ${z.origin} 應為 ${_}${z.minimum.toString()} ${w.unit}`;
                return `數值過小：預期 ${z.origin} 應為 ${_}${z.minimum.toString()}`
            }
            case "invalid_format": {
                let _ = z;
                if (_.format === "starts_with") return `無效的字串：必須以 "${_.prefix}" 開頭`;
                if (_.format === "ends_with") return `無效的字串：必須以 "${_.suffix}" 結尾`;
                if (_.format === "includes") return `無效的字串：必須包含 "${_.includes}"`;
                if (_.format === "regex") return `無效的字串：必須符合格式 ${_.pattern}`;
                return `無效的 ${Y[_.format]??z.format}`
            }
            case "not_multiple_of":
                return `無效的數字：必須為 ${z.divisor} 的倍數`;
            case "unrecognized_keys":
                return `無法識別的鍵值${z.keys.length>1?"們":""}：${_A(z.keys,"、")}`;
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
// @from(Ln 11613, Col 4)
M4A = E(() => {
    QK()
})
// @from(Ln 11616, Col 4)
wO6 = {}
// @from(Ln 11658, Col 4)
Je6 = E(() => {
    L7A();
    R7A();
    S7A();
    C7A();
    I7A();
    b7A();
    bg1();
    x7A();
    u7A();
    m7A();
    B7A();
    g7A();
    F7A();
    p7A();
    Q7A();
    U7A();
    d7A();
    c7A();
    l7A();
    i7A();
    n7A();
    r7A();
    o7A();
    a7A();
    s7A();
    t7A();
    e7A();
    A4A();
    K4A();
    Y4A();
    z4A();
    _4A();
    w4A();
    O4A();
    $4A();
    H4A();
    j4A();
    J4A();
    M4A()
})
// @from(Ln 11699, Col 0)
class EE6 {
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
// @from(Ln 11732, Col 0)
function Me6() {
    return new EE6
}
// @from(Ln 11735, Col 4)
MF1
// @from(Ln 11735, Col 9)
DF1
// @from(Ln 11735, Col 14)
Cx
// @from(Ln 11736, Col 4)
XF1 = E(() => {
    MF1 = Symbol("ZodOutput"), DF1 = Symbol("ZodInput");
    Cx = Me6()
})
// @from(Ln 11741, Col 0)
function PF1(A, q) {
    return new A({
        type: "string",
        ...M7(q)
    })
}
// @from(Ln 11748, Col 0)
function WF1(A, q) {
    return new A({
        type: "string",
        coerce: !0,
        ...M7(q)
    })
}
// @from(Ln 11756, Col 0)
function De6(A, q) {
    return new A({
        type: "string",
        format: "email",
        check: "string_format",
        abort: !1,
        ...M7(q)
    })
}
// @from(Ln 11766, Col 0)
function yE6(A, q) {
    return new A({
        type: "string",
        format: "guid",
        check: "string_format",
        abort: !1,
        ...M7(q)
    })
}
// @from(Ln 11776, Col 0)
function Xe6(A, q) {
    return new A({
        type: "string",
        format: "uuid",
        check: "string_format",
        abort: !1,
        ...M7(q)
    })
}
// @from(Ln 11786, Col 0)
function Pe6(A, q) {
    return new A({
        type: "string",
        format: "uuid",
        check: "string_format",
        abort: !1,
        version: "v4",
        ...M7(q)
    })
}
// @from(Ln 11797, Col 0)
function We6(A, q) {
    return new A({
        type: "string",
        format: "uuid",
        check: "string_format",
        abort: !1,
        version: "v6",
        ...M7(q)
    })
}
// @from(Ln 11808, Col 0)
function Ze6(A, q) {
    return new A({
        type: "string",
        format: "uuid",
        check: "string_format",
        abort: !1,
        version: "v7",
        ...M7(q)
    })
}
// @from(Ln 11819, Col 0)
function Ge6(A, q) {
    return new A({
        type: "string",
        format: "url",
        check: "string_format",
        abort: !1,
        ...M7(q)
    })
}
// @from(Ln 11829, Col 0)
function fe6(A, q) {
    return new A({
        type: "string",
        format: "emoji",
        check: "string_format",
        abort: !1,
        ...M7(q)
    })
}
// @from(Ln 11839, Col 0)
function Te6(A, q) {
    return new A({
        type: "string",
        format: "nanoid",
        check: "string_format",
        abort: !1,
        ...M7(q)
    })
}
// @from(Ln 11849, Col 0)
function ve6(A, q) {
    return new A({
        type: "string",
        format: "cuid",
        check: "string_format",
        abort: !1,
        ...M7(q)
    })
}
// @from(Ln 11859, Col 0)
function Ne6(A, q) {
    return new A({
        type: "string",
        format: "cuid2",
        check: "string_format",
        abort: !1,
        ...M7(q)
    })
}
// @from(Ln 11869, Col 0)
function Ve6(A, q) {
    return new A({
        type: "string",
        format: "ulid",
        check: "string_format",
        abort: !1,
        ...M7(q)
    })
}
// @from(Ln 11879, Col 0)
function ke6(A, q) {
    return new A({
        type: "string",
        format: "xid",
        check: "string_format",
        abort: !1,
        ...M7(q)
    })
}
// @from(Ln 11889, Col 0)
function Ee6(A, q) {
    return new A({
        type: "string",
        format: "ksuid",
        check: "string_format",
        abort: !1,
        ...M7(q)
    })
}
// @from(Ln 11899, Col 0)
function ye6(A, q) {
    return new A({
        type: "string",
        format: "ipv4",
        check: "string_format",
        abort: !1,
        ...M7(q)
    })
}
// @from(Ln 11909, Col 0)
function Le6(A, q) {
    return new A({
        type: "string",
        format: "ipv6",
        check: "string_format",
        abort: !1,
        ...M7(q)
    })
}
// @from(Ln 11919, Col 0)
function Re6(A, q) {
    return new A({
        type: "string",
        format: "cidrv4",
        check: "string_format",
        abort: !1,
        ...M7(q)
    })
}
// @from(Ln 11929, Col 0)
function he6(A, q) {
    return new A({
        type: "string",
        format: "cidrv6",
        check: "string_format",
        abort: !1,
        ...M7(q)
    })
}
// @from(Ln 11939, Col 0)
function Se6(A, q) {
    return new A({
        type: "string",
        format: "base64",
        check: "string_format",
        abort: !1,
        ...M7(q)
    })
}
// @from(Ln 11949, Col 0)
function Ce6(A, q) {
    return new A({
        type: "string",
        format: "base64url",
        check: "string_format",
        abort: !1,
        ...M7(q)
    })
}
// @from(Ln 11959, Col 0)
function Ie6(A, q) {
    return new A({
        type: "string",
        format: "e164",
        check: "string_format",
        abort: !1,
        ...M7(q)
    })
}
// @from(Ln 11969, Col 0)
function be6(A, q) {
    return new A({
        type: "string",
        format: "jwt",
        check: "string_format",
        abort: !1,
        ...M7(q)
    })
}
// @from(Ln 11979, Col 0)
function GF1(A, q) {
    return new A({
        type: "string",
        format: "datetime",
        check: "string_format",
        offset: !1,
        local: !1,
        precision: null,
        ...M7(q)
    })
}
// @from(Ln 11991, Col 0)
function fF1(A, q) {
    return new A({
        type: "string",
        format: "date",
        check: "string_format",
        ...M7(q)
    })
}
// @from(Ln 12000, Col 0)
function TF1(A, q) {
    return new A({
        type: "string",
        format: "time",
        check: "string_format",
        precision: null,
        ...M7(q)
    })
}
// @from(Ln 12010, Col 0)
function vF1(A, q) {
    return new A({
        type: "string",
        format: "duration",
        check: "string_format",
        ...M7(q)
    })
}
// @from(Ln 12019, Col 0)
function NF1(A, q) {
    return new A({
        type: "number",
        checks: [],
        ...M7(q)
    })
}
// @from(Ln 12027, Col 0)
function VF1(A, q) {
    return new A({
        type: "number",
        coerce: !0,
        checks: [],
        ...M7(q)
    })
}
// @from(Ln 12036, Col 0)
function kF1(A, q) {
    return new A({
        type: "number",
        check: "number_format",
        abort: !1,
        format: "safeint",
        ...M7(q)
    })
}
// @from(Ln 12046, Col 0)
function EF1(A, q) {
    return new A({
        type: "number",
        check: "number_format",
        abort: !1,
        format: "float32",
        ...M7(q)
    })
}
// @from(Ln 12056, Col 0)
function yF1(A, q) {
    return new A({
        type: "number",
        check: "number_format",
        abort: !1,
        format: "float64",
        ...M7(q)
    })
}
// @from(Ln 12066, Col 0)
function LF1(A, q) {
    return new A({
        type: "number",
        check: "number_format",
        abort: !1,
        format: "int32",
        ...M7(q)
    })
}
// @from(Ln 12076, Col 0)
function RF1(A, q) {
    return new A({
        type: "number",
        check: "number_format",
        abort: !1,
        format: "uint32",
        ...M7(q)
    })
}
// @from(Ln 12086, Col 0)
function hF1(A, q) {
    return new A({
        type: "boolean",
        ...M7(q)
    })
}
// @from(Ln 12093, Col 0)
function SF1(A, q) {
    return new A({
        type: "boolean",
        coerce: !0,
        ...M7(q)
    })
}
// @from(Ln 12101, Col 0)
function CF1(A, q) {
    return new A({
        type: "bigint",
        ...M7(q)
    })
}
// @from(Ln 12108, Col 0)
function IF1(A, q) {
    return new A({
        type: "bigint",
        coerce: !0,
        ...M7(q)
    })
}
// @from(Ln 12116, Col 0)
function bF1(A, q) {
    return new A({
        type: "bigint",
        check: "bigint_format",
        abort: !1,
        format: "int64",
        ...M7(q)
    })
}
// @from(Ln 12126, Col 0)
function xF1(A, q) {
    return new A({
        type: "bigint",
        check: "bigint_format",
        abort: !1,
        format: "uint64",
        ...M7(q)
    })
}
// @from(Ln 12136, Col 0)
function uF1(A, q) {
    return new A({
        type: "symbol",
        ...M7(q)
    })
}
// @from(Ln 12143, Col 0)
function mF1(A, q) {
    return new A({
        type: "undefined",
        ...M7(q)
    })
}
// @from(Ln 12150, Col 0)
function BF1(A, q) {
    return new A({
        type: "null",
        ...M7(q)
    })
}
// @from(Ln 12157, Col 0)
function gF1(A) {
    return new A({
        type: "any"
    })
}
// @from(Ln 12163, Col 0)
function OO6(A) {
    return new A({
        type: "unknown"
    })
}
// @from(Ln 12169, Col 0)
function FF1(A, q) {
    return new A({
        type: "never",
        ...M7(q)
    })
}
// @from(Ln 12176, Col 0)
function pF1(A, q) {
    return new A({
        type: "void",
        ...M7(q)
    })
}
// @from(Ln 12183, Col 0)
function QF1(A, q) {
    return new A({
        type: "date",
        ...M7(q)
    })
}
// @from(Ln 12190, Col 0)
function UF1(A, q) {
    return new A({
        type: "date",
        coerce: !0,
        ...M7(q)
    })
}
// @from(Ln 12198, Col 0)
function dF1(A, q) {
    return new A({
        type: "nan",
        ...M7(q)
    })
}
// @from(Ln 12205, Col 0)
function fp(A, q) {
    return new Ke6({
        check: "less_than",
        ...M7(q),
        value: A,
        inclusive: !1
    })
}
// @from(Ln 12214, Col 0)
function eE(A, q) {
    return new Ke6({
        check: "less_than",
        ...M7(q),
        value: A,
        inclusive: !0
    })
}
// @from(Ln 12223, Col 0)
function Tp(A, q) {
    return new Ye6({
        check: "greater_than",
        ...M7(q),
        value: A,
        inclusive: !1
    })
}
// @from(Ln 12232, Col 0)
function ZT(A, q) {
    return new Ye6({
        check: "greater_than",
        ...M7(q),
        value: A,
        inclusive: !0
    })
}
// @from(Ln 12241, Col 0)
function cF1(A) {
    return Tp(0, A)
}
// @from(Ln 12245, Col 0)
function lF1(A) {
    return fp(0, A)
}
// @from(Ln 12249, Col 0)
function iF1(A) {
    return eE(0, A)
}
// @from(Ln 12253, Col 0)
function nF1(A) {
    return ZT(0, A)
}
// @from(Ln 12257, Col 0)
function PA6(A, q) {
    return new zB1({
        check: "multiple_of",
        ...M7(q),
        value: A
    })
}
// @from(Ln 12265, Col 0)
function $O6(A, q) {
    return new OB1({
        check: "max_size",
        ...M7(q),
        maximum: A
    })
}
// @from(Ln 12273, Col 0)
function WA6(A, q) {
    return new $B1({
        check: "min_size",
        ...M7(q),
        minimum: A
    })
}
// @from(Ln 12281, Col 0)
function LE6(A, q) {
    return new HB1({
        check: "size_equals",
        ...M7(q),
        size: A
    })
}
// @from(Ln 12289, Col 0)
function HO6(A, q) {
    return new jB1({
        check: "max_length",
        ...M7(q),
        maximum: A
    })
}
// @from(Ln 12297, Col 0)
function Rn(A, q) {
    return new JB1({
        check: "min_length",
        ...M7(q),
        minimum: A
    })
}
// @from(Ln 12305, Col 0)
function jO6(A, q) {
    return new MB1({
        check: "length_equals",
        ...M7(q),
        length: A
    })
}
// @from(Ln 12313, Col 0)
function RE6(A, q) {
    return new DB1({
        check: "string_format",
        format: "regex",
        ...M7(q),
        pattern: A
    })
}
// @from(Ln 12322, Col 0)
function hE6(A) {
    return new XB1({
        check: "string_format",
        format: "lowercase",
        ...M7(A)
    })
}
// @from(Ln 12330, Col 0)
function SE6(A) {
    return new PB1({
        check: "string_format",
        format: "uppercase",
        ...M7(A)
    })
}
// @from(Ln 12338, Col 0)
function CE6(A, q) {
    return new WB1({
        check: "string_format",
        format: "includes",
        ...M7(q),
        includes: A
    })
}
// @from(Ln 12347, Col 0)
function IE6(A, q) {
    return new ZB1({
        check: "string_format",
        format: "starts_with",
        ...M7(q),
        prefix: A
    })
}
// @from(Ln 12356, Col 0)
function bE6(A, q) {
    return new GB1({
        check: "string_format",
        format: "ends_with",
        ...M7(q),
        suffix: A
    })
}
// @from(Ln 12365, Col 0)
function rF1(A, q, K) {
    return new fB1({
        check: "property",
        property: A,
        schema: q,
        ...M7(K)
    })
}
// @from(Ln 12374, Col 0)
function xE6(A, q) {
    return new TB1({
        check: "mime_type",
        mime: A,
        ...M7(q)
    })
}
// @from(Ln 12382, Col 0)
function vp(A) {
    return new vB1({
        check: "overwrite",
        tx: A
    })
}
// @from(Ln 12389, Col 0)
function uE6(A) {
    return vp((q) => q.normalize(A))
}
// @from(Ln 12393, Col 0)
function mE6() {
    return vp((A) => A.trim())
}
// @from(Ln 12397, Col 0)
function BE6() {
    return vp((A) => A.toLowerCase())
}
// @from(Ln 12401, Col 0)
function gE6() {
    return vp((A) => A.toUpperCase())
}
// @from(Ln 12405, Col 0)
function FE6(A, q, K) {
    return new A({
        type: "array",
        element: q,
        ...M7(K)
    })
}
// @from(Ln 12413, Col 0)
function Roq(A, q, K) {
    return new A({
        type: "union",
        options: q,
        ...M7(K)
    })
}
// @from(Ln 12421, Col 0)
function hoq(A, q, K, Y) {
    return new A({
        type: "union",
        options: K,
        discriminator: q,
        ...M7(Y)
    })
}
// @from(Ln 12430, Col 0)
function Soq(A, q, K) {
    return new A({
        type: "intersection",
        left: q,
        right: K
    })
}
// @from(Ln 12438, Col 0)
function oF1(A, q, K, Y) {
    let z = K instanceof _5;
    return new A({
        type: "tuple",
        items: q,
        rest: z ? K : null,
        ...M7(z ? Y : K)
    })
}
// @from(Ln 12448, Col 0)
function Coq(A, q, K, Y) {
    return new A({
        type: "record",
        keyType: q,
        valueType: K,
        ...M7(Y)
    })
}
// @from(Ln 12457, Col 0)
function Ioq(A, q, K, Y) {
    return new A({
        type: "map",
        keyType: q,
        valueType: K,
        ...M7(Y)
    })
}
// @from(Ln 12466, Col 0)
function boq(A, q, K) {
    return new A({
        type: "set",
        valueType: q,
        ...M7(K)
    })
}
// @from(Ln 12474, Col 0)
function xoq(A, q, K) {
    let Y = Array.isArray(q) ? Object.fromEntries(q.map((z) => [z, z])) : q;
    return new A({
        type: "enum",
        entries: Y,
        ...M7(K)
    })
}
// @from(Ln 12483, Col 0)
function uoq(A, q, K) {
    return new A({
        type: "enum",
        entries: q,
        ...M7(K)
    })
}
// @from(Ln 12491, Col 0)
function moq(A, q, K) {
    return new A({
        type: "literal",
        values: Array.isArray(q) ? q : [q],
        ...M7(K)
    })
}
// @from(Ln 12499, Col 0)
function aF1(A, q) {
    return new A({
        type: "file",
        ...M7(q)
    })
}
// @from(Ln 12506, Col 0)
function Boq(A, q) {
    return new A({
        type: "transform",
        transform: q
    })
}
// @from(Ln 12513, Col 0)
function goq(A, q) {
    return new A({
        type: "optional",
        innerType: q
    })
}
// @from(Ln 12520, Col 0)
function Foq(A, q) {
    return new A({
        type: "nullable",
        innerType: q
    })
}
// @from(Ln 12527, Col 0)
function poq(A, q, K) {
    return new A({
        type: "default",
        innerType: q,
        get defaultValue() {
            return typeof K === "function" ? K() : K
        }
    })
}
// @from(Ln 12537, Col 0)
function Qoq(A, q, K) {
    return new A({
        type: "nonoptional",
        innerType: q,
        ...M7(K)
    })
}
// @from(Ln 12545, Col 0)
function Uoq(A, q) {
    return new A({
        type: "success",
        innerType: q
    })
}
// @from(Ln 12552, Col 0)
function doq(A, q, K) {
    return new A({
        type: "catch",
        innerType: q,
        catchValue: typeof K === "function" ? K : () => K
    })
}
// @from(Ln 12560, Col 0)
function coq(A, q, K) {
    return new A({
        type: "pipe",
        in: q,
        out: K
    })
}
// @from(Ln 12568, Col 0)
function loq(A, q) {
    return new A({
        type: "readonly",
        innerType: q
    })
}
// @from(Ln 12575, Col 0)
function ioq(A, q, K) {
    return new A({
        type: "template_literal",
        parts: q,
        ...M7(K)
    })
}
// @from(Ln 12583, Col 0)
function noq(A, q) {
    return new A({
        type: "lazy",
        getter: q
    })
}
// @from(Ln 12590, Col 0)
function roq(A, q) {
    return new A({
        type: "promise",
        innerType: q
    })
}
// @from(Ln 12597, Col 0)
function sF1(A, q, K) {
    let Y = M7(K);
    return Y.abort ?? (Y.abort = !0), new A({
        type: "custom",
        check: "custom",
        fn: q,
        ...Y
    })
}
// @from(Ln 12607, Col 0)
function tF1(A, q, K) {
    return new A({
        type: "custom",
        check: "custom",
        fn: q,
        ...M7(K)
    })
}
// @from(Ln 12616, Col 0)
function eF1(A, q) {
    let K = M7(q),
        Y = K.truthy ?? ["true", "1", "yes", "on", "y", "enabled"],
        z = K.falsy ?? ["false", "0", "no", "off", "n", "disabled"];
    if (K.case !== "sensitive") Y = Y.map((X) => typeof X === "string" ? X.toLowerCase() : X), z = z.map((X) => typeof X === "string" ? X.toLowerCase() : X);
    let _ = new Set(Y),
        w = new Set(z),
        O = A.Pipe ?? NE6,
        $ = A.Boolean ?? fE6,
        H = A.String ?? DA6,
        J = new(A.Transform ?? vE6)({
            type: "transform",
            transform: (X, P) => {
                let W = X;
                if (K.case !== "sensitive") W = W.toLowerCase();
                if (_.has(W)) return !0;
                else if (w.has(W)) return !1;
                else return P.issues.push({
                    code: "invalid_value",
                    expected: "stringbool",
                    values: [..._, ...w],
                    input: P.value,
                    inst: J
                }), {}
            },
            error: K.error
        }),
        M = new O({
            type: "pipe",
            in: new H({
                type: "string",
                error: K.error
            }),
            out: J,
            error: K.error
        });
    return new O({
        type: "pipe",
        in: M,
        out: new $({
            type: "boolean",
            error: K.error
        }),
        error: K.error
    })
}
// @from(Ln 12663, Col 0)
function Ap1(A, q, K, Y = {}) {
    let z = M7(Y),
        _ = {
            ...M7(Y),
            check: "string_format",
            type: "string",
            format: q,
            fn: typeof K === "function" ? K : (O) => K.test(O),
            ...z
        };
    if (K instanceof RegExp) _.pattern = K;
    return new A(_)
}
// @from(Ln 12676, Col 4)
ZF1
// @from(Ln 12677, Col 4)
qp1 = E(() => {
    ze6();
    VE6();
    QK();
    ZF1 = {
        Any: null,
        Minute: -1,
        Second: 0,
        Millisecond: 3,
        Microsecond: 6
    }
})
// @from(Ln 12689, Col 0)
class Kp1 {
    constructor(A) {
        this._def = A, this.def = A
    }
    implement(A) {
        if (typeof A !== "function") throw Error("implement() must be called with a function");
        let q = (...K) => {
            let Y = this._def.input ? WE6(this._def.input, K, void 0, {
                callee: q
            }) : K;
            if (!Array.isArray(Y)) throw Error("Invalid arguments schema: not an array or tuple schema.");
            let z = A(...Y);
            return this._def.output ? WE6(this._def.output, z, void 0, {
                callee: q
            }) : z
        };
        return q
    }
    implementAsync(A) {
        if (typeof A !== "function") throw Error("implement() must be called with a function");
        let q = async (...K) => {
            let Y = this._def.input ? await ZE6(this._def.input, K, void 0, {
                callee: q
            }) : K;
            if (!Array.isArray(Y)) throw Error("Invalid arguments schema: not an array or tuple schema.");
            let z = await A(...Y);
            return this._def.output ? ZE6(this._def.output, z, void 0, {
                callee: q
            }) : z
        };
        return q
    }
    input(...A) {
        let q = this.constructor;
        if (Array.isArray(A[0])) return new q({
            type: "function",
            input: new XA6({
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
// @from(Ln 12747, Col 0)
function Yp1(A) {
    return new Kp1({
        type: "function",
        input: Array.isArray(A?.input) ? oF1(XA6, A?.input) : A?.input ?? FE6(TE6, OO6(_O6)),
        output: A?.output ?? OO6(_O6)
    })
}
// @from(Ln 12754, Col 4)
D4A = E(() => {
    qp1();
    et6();
    VE6();
    VE6()
})