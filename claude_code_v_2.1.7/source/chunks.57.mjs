
// @from(Ln 154251, Col 4)
DY8 = () => {
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

  function Q(Z) {
    return A[Z] ?? null
  }
  let B = (Z) => {
      let Y = typeof Z;
      switch (Y) {
        case "number":
          return Number.isNaN(Z) ? "មិនមែនជាលេខ (NaN)" : "លេខ";
        case "object": {
          if (Array.isArray(Z)) return "អារេ (Array)";
          if (Z === null) return "គ្មានតម្លៃ (null)";
          if (Object.getPrototypeOf(Z) !== Object.prototype && Z.constructor) return Z.constructor.name
        }
      }
      return Y
    },
    G = {
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
  return (Z) => {
    switch (Z.code) {
      case "invalid_type":
        return `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ ${Z.expected} ប៉ុន្តែទទួលបាន ${B(Z.input)}`;
      case "invalid_value":
        if (Z.values.length === 1) return `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ ${aB(Z.values[0])}`;
        return `ជម្រើសមិនត្រឹមត្រូវ៖ ត្រូវជាមួយក្នុងចំណោម ${FQ(Z.values,"|")}`;
      case "too_big": {
        let Y = Z.inclusive ? "<=" : "<",
          J = Q(Z.origin);
        if (J) return `ធំពេក៖ ត្រូវការ ${Z.origin??"តម្លៃ"} ${Y} ${Z.maximum.toString()} ${J.unit??"ធាតុ"}`;
        return `ធំពេក៖ ត្រូវការ ${Z.origin??"តម្លៃ"} ${Y} ${Z.maximum.toString()}`
      }
      case "too_small": {
        let Y = Z.inclusive ? ">=" : ">",
          J = Q(Z.origin);
        if (J) return `តូចពេក៖ ត្រូវការ ${Z.origin} ${Y} ${Z.minimum.toString()} ${J.unit}`;
        return `តូចពេក៖ ត្រូវការ ${Z.origin} ${Y} ${Z.minimum.toString()}`
      }
      case "invalid_format": {
        let Y = Z;
        if (Y.format === "starts_with") return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវចាប់ផ្តើមដោយ "${Y.prefix}"`;
        if (Y.format === "ends_with") return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវបញ្ចប់ដោយ "${Y.suffix}"`;
        if (Y.format === "includes") return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវមាន "${Y.includes}"`;
        if (Y.format === "regex") return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវតែផ្គូផ្គងនឹងទម្រង់ដែលបានកំណត់ ${Y.pattern}`;
        return `មិនត្រឹមត្រូវ៖ ${G[Y.format]??Z.format}`
      }
      case "not_multiple_of":
        return `លេខមិនត្រឹមត្រូវ៖ ត្រូវតែជាពហុគុណនៃ ${Z.divisor}`;
      case "unrecognized_keys":
        return `រកឃើញសោមិនស្គាល់៖ ${FQ(Z.keys,", ")}`;
      case "invalid_key":
        return `សោមិនត្រឹមត្រូវនៅក្នុង ${Z.origin}`;
      case "invalid_union":
        return "ទិន្នន័យមិនត្រឹមត្រូវ";
      case "invalid_element":
        return `ទិន្នន័យមិនត្រឹមត្រូវនៅក្នុង ${Z.origin}`;
      default:
        return "ទិន្នន័យមិនត្រឹមត្រូវ"
    }
  }
}
// @from(Ln 154359, Col 4)
wzB = w(() => {
  W6()
})
// @from(Ln 154363, Col 0)
function Me1() {
  return {
    localeError: WY8()
  }
}
// @from(Ln 154368, Col 4)
WY8 = () => {
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

  function Q(Z) {
    return A[Z] ?? null
  }
  let B = (Z) => {
      let Y = typeof Z;
      switch (Y) {
        case "number":
          return Number.isNaN(Z) ? "NaN" : "number";
        case "object": {
          if (Array.isArray(Z)) return "array";
          if (Z === null) return "null";
          if (Object.getPrototypeOf(Z) !== Object.prototype && Z.constructor) return Z.constructor.name
        }
      }
      return Y
    },
    G = {
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
  return (Z) => {
    switch (Z.code) {
      case "invalid_type":
        return `잘못된 입력: 예상 타입은 ${Z.expected}, 받은 타입은 ${B(Z.input)}입니다`;
      case "invalid_value":
        if (Z.values.length === 1) return `잘못된 입력: 값은 ${aB(Z.values[0])} 이어야 합니다`;
        return `잘못된 옵션: ${FQ(Z.values,"또는 ")} 중 하나여야 합니다`;
      case "too_big": {
        let Y = Z.inclusive ? "이하" : "미만",
          J = Y === "미만" ? "이어야 합니다" : "여야 합니다",
          X = Q(Z.origin),
          I = X?.unit ?? "요소";
        if (X) return `${Z.origin??"값"}이 너무 큽니다: ${Z.maximum.toString()}${I} ${Y}${J}`;
        return `${Z.origin??"값"}이 너무 큽니다: ${Z.maximum.toString()} ${Y}${J}`
      }
      case "too_small": {
        let Y = Z.inclusive ? "이상" : "초과",
          J = Y === "이상" ? "이어야 합니다" : "여야 합니다",
          X = Q(Z.origin),
          I = X?.unit ?? "요소";
        if (X) return `${Z.origin??"값"}이 너무 작습니다: ${Z.minimum.toString()}${I} ${Y}${J}`;
        return `${Z.origin??"값"}이 너무 작습니다: ${Z.minimum.toString()} ${Y}${J}`
      }
      case "invalid_format": {
        let Y = Z;
        if (Y.format === "starts_with") return `잘못된 문자열: "${Y.prefix}"(으)로 시작해야 합니다`;
        if (Y.format === "ends_with") return `잘못된 문자열: "${Y.suffix}"(으)로 끝나야 합니다`;
        if (Y.format === "includes") return `잘못된 문자열: "${Y.includes}"을(를) 포함해야 합니다`;
        if (Y.format === "regex") return `잘못된 문자열: 정규식 ${Y.pattern} 패턴과 일치해야 합니다`;
        return `잘못된 ${G[Y.format]??Z.format}`
      }
      case "not_multiple_of":
        return `잘못된 숫자: ${Z.divisor}의 배수여야 합니다`;
      case "unrecognized_keys":
        return `인식할 수 없는 키: ${FQ(Z.keys,", ")}`;
      case "invalid_key":
        return `잘못된 키: ${Z.origin}`;
      case "invalid_union":
        return "잘못된 입력";
      case "invalid_element":
        return `잘못된 값: ${Z.origin}`;
      default:
        return "잘못된 입력"
    }
  }
}
// @from(Ln 154480, Col 4)
LzB = w(() => {
  W6()
})
// @from(Ln 154484, Col 0)
function Re1() {
  return {
    localeError: KY8()
  }
}
// @from(Ln 154489, Col 4)
KY8 = () => {
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

  function Q(Z) {
    return A[Z] ?? null
  }
  let B = (Z) => {
      let Y = typeof Z;
      switch (Y) {
        case "number":
          return Number.isNaN(Z) ? "NaN" : "број";
        case "object": {
          if (Array.isArray(Z)) return "низа";
          if (Z === null) return "null";
          if (Object.getPrototypeOf(Z) !== Object.prototype && Z.constructor) return Z.constructor.name
        }
      }
      return Y
    },
    G = {
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
  return (Z) => {
    switch (Z.code) {
      case "invalid_type":
        return `Грешен внес: се очекува ${Z.expected}, примено ${B(Z.input)}`;
      case "invalid_value":
        if (Z.values.length === 1) return `Invalid input: expected ${aB(Z.values[0])}`;
        return `Грешана опција: се очекува една ${FQ(Z.values,"|")}`;
      case "too_big": {
        let Y = Z.inclusive ? "<=" : "<",
          J = Q(Z.origin);
        if (J) return `Премногу голем: се очекува ${Z.origin??"вредноста"} да има ${Y}${Z.maximum.toString()} ${J.unit??"елементи"}`;
        return `Премногу голем: се очекува ${Z.origin??"вредноста"} да биде ${Y}${Z.maximum.toString()}`
      }
      case "too_small": {
        let Y = Z.inclusive ? ">=" : ">",
          J = Q(Z.origin);
        if (J) return `Премногу мал: се очекува ${Z.origin} да има ${Y}${Z.minimum.toString()} ${J.unit}`;
        return `Премногу мал: се очекува ${Z.origin} да биде ${Y}${Z.minimum.toString()}`
      }
      case "invalid_format": {
        let Y = Z;
        if (Y.format === "starts_with") return `Неважечка низа: мора да започнува со "${Y.prefix}"`;
        if (Y.format === "ends_with") return `Неважечка низа: мора да завршува со "${Y.suffix}"`;
        if (Y.format === "includes") return `Неважечка низа: мора да вклучува "${Y.includes}"`;
        if (Y.format === "regex") return `Неважечка низа: мора да одгоара на патернот ${Y.pattern}`;
        return `Invalid ${G[Y.format]??Z.format}`
      }
      case "not_multiple_of":
        return `Грешен број: мора да биде делив со ${Z.divisor}`;
      case "unrecognized_keys":
        return `${Z.keys.length>1?"Непрепознаени клучеви":"Непрепознаен клуч"}: ${FQ(Z.keys,", ")}`;
      case "invalid_key":
        return `Грешен клуч во ${Z.origin}`;
      case "invalid_union":
        return "Грешен внес";
      case "invalid_element":
        return `Грешна вредност во ${Z.origin}`;
      default:
        return "Грешен внес"
    }
  }
}
// @from(Ln 154597, Col 4)
OzB = w(() => {
  W6()
})
// @from(Ln 154601, Col 0)
function _e1() {
  return {
    localeError: VY8()
  }
}
// @from(Ln 154606, Col 4)
VY8 = () => {
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

  function Q(Z) {
    return A[Z] ?? null
  }
  let B = (Z) => {
      let Y = typeof Z;
      switch (Y) {
        case "number":
          return Number.isNaN(Z) ? "NaN" : "nombor";
        case "object": {
          if (Array.isArray(Z)) return "array";
          if (Z === null) return "null";
          if (Object.getPrototypeOf(Z) !== Object.prototype && Z.constructor) return Z.constructor.name
        }
      }
      return Y
    },
    G = {
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
  return (Z) => {
    switch (Z.code) {
      case "invalid_type":
        return `Input tidak sah: dijangka ${Z.expected}, diterima ${B(Z.input)}`;
      case "invalid_value":
        if (Z.values.length === 1) return `Input tidak sah: dijangka ${aB(Z.values[0])}`;
        return `Pilihan tidak sah: dijangka salah satu daripada ${FQ(Z.values,"|")}`;
      case "too_big": {
        let Y = Z.inclusive ? "<=" : "<",
          J = Q(Z.origin);
        if (J) return `Terlalu besar: dijangka ${Z.origin??"nilai"} ${J.verb} ${Y}${Z.maximum.toString()} ${J.unit??"elemen"}`;
        return `Terlalu besar: dijangka ${Z.origin??"nilai"} adalah ${Y}${Z.maximum.toString()}`
      }
      case "too_small": {
        let Y = Z.inclusive ? ">=" : ">",
          J = Q(Z.origin);
        if (J) return `Terlalu kecil: dijangka ${Z.origin} ${J.verb} ${Y}${Z.minimum.toString()} ${J.unit}`;
        return `Terlalu kecil: dijangka ${Z.origin} adalah ${Y}${Z.minimum.toString()}`
      }
      case "invalid_format": {
        let Y = Z;
        if (Y.format === "starts_with") return `String tidak sah: mesti bermula dengan "${Y.prefix}"`;
        if (Y.format === "ends_with") return `String tidak sah: mesti berakhir dengan "${Y.suffix}"`;
        if (Y.format === "includes") return `String tidak sah: mesti mengandungi "${Y.includes}"`;
        if (Y.format === "regex") return `String tidak sah: mesti sepadan dengan corak ${Y.pattern}`;
        return `${G[Y.format]??Z.format} tidak sah`
      }
      case "not_multiple_of":
        return `Nombor tidak sah: perlu gandaan ${Z.divisor}`;
      case "unrecognized_keys":
        return `Kunci tidak dikenali: ${FQ(Z.keys,", ")}`;
      case "invalid_key":
        return `Kunci tidak sah dalam ${Z.origin}`;
      case "invalid_union":
        return "Input tidak sah";
      case "invalid_element":
        return `Nilai tidak sah dalam ${Z.origin}`;
      default:
        return "Input tidak sah"
    }
  }
}
// @from(Ln 154714, Col 4)
MzB = w(() => {
  W6()
})
// @from(Ln 154718, Col 0)
function je1() {
  return {
    localeError: FY8()
  }
}
// @from(Ln 154723, Col 4)
FY8 = () => {
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

  function Q(Z) {
    return A[Z] ?? null
  }
  let B = (Z) => {
      let Y = typeof Z;
      switch (Y) {
        case "number":
          return Number.isNaN(Z) ? "NaN" : "getal";
        case "object": {
          if (Array.isArray(Z)) return "array";
          if (Z === null) return "null";
          if (Object.getPrototypeOf(Z) !== Object.prototype && Z.constructor) return Z.constructor.name
        }
      }
      return Y
    },
    G = {
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
  return (Z) => {
    switch (Z.code) {
      case "invalid_type":
        return `Ongeldige invoer: verwacht ${Z.expected}, ontving ${B(Z.input)}`;
      case "invalid_value":
        if (Z.values.length === 1) return `Ongeldige invoer: verwacht ${aB(Z.values[0])}`;
        return `Ongeldige optie: verwacht één van ${FQ(Z.values,"|")}`;
      case "too_big": {
        let Y = Z.inclusive ? "<=" : "<",
          J = Q(Z.origin);
        if (J) return `Te lang: verwacht dat ${Z.origin??"waarde"} ${Y}${Z.maximum.toString()} ${J.unit??"elementen"} bevat`;
        return `Te lang: verwacht dat ${Z.origin??"waarde"} ${Y}${Z.maximum.toString()} is`
      }
      case "too_small": {
        let Y = Z.inclusive ? ">=" : ">",
          J = Q(Z.origin);
        if (J) return `Te kort: verwacht dat ${Z.origin} ${Y}${Z.minimum.toString()} ${J.unit} bevat`;
        return `Te kort: verwacht dat ${Z.origin} ${Y}${Z.minimum.toString()} is`
      }
      case "invalid_format": {
        let Y = Z;
        if (Y.format === "starts_with") return `Ongeldige tekst: moet met "${Y.prefix}" beginnen`;
        if (Y.format === "ends_with") return `Ongeldige tekst: moet op "${Y.suffix}" eindigen`;
        if (Y.format === "includes") return `Ongeldige tekst: moet "${Y.includes}" bevatten`;
        if (Y.format === "regex") return `Ongeldige tekst: moet overeenkomen met patroon ${Y.pattern}`;
        return `Ongeldig: ${G[Y.format]??Z.format}`
      }
      case "not_multiple_of":
        return `Ongeldig getal: moet een veelvoud van ${Z.divisor} zijn`;
      case "unrecognized_keys":
        return `Onbekende key${Z.keys.length>1?"s":""}: ${FQ(Z.keys,", ")}`;
      case "invalid_key":
        return `Ongeldige key in ${Z.origin}`;
      case "invalid_union":
        return "Ongeldige invoer";
      case "invalid_element":
        return `Ongeldige waarde in ${Z.origin}`;
      default:
        return "Ongeldige invoer"
    }
  }
}
// @from(Ln 154827, Col 4)
RzB = w(() => {
  W6()
})
// @from(Ln 154831, Col 0)
function Te1() {
  return {
    localeError: HY8()
  }
}
// @from(Ln 154836, Col 4)
HY8 = () => {
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

  function Q(Z) {
    return A[Z] ?? null
  }
  let B = (Z) => {
      let Y = typeof Z;
      switch (Y) {
        case "number":
          return Number.isNaN(Z) ? "NaN" : "tall";
        case "object": {
          if (Array.isArray(Z)) return "liste";
          if (Z === null) return "null";
          if (Object.getPrototypeOf(Z) !== Object.prototype && Z.constructor) return Z.constructor.name
        }
      }
      return Y
    },
    G = {
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
  return (Z) => {
    switch (Z.code) {
      case "invalid_type":
        return `Ugyldig input: forventet ${Z.expected}, fikk ${B(Z.input)}`;
      case "invalid_value":
        if (Z.values.length === 1) return `Ugyldig verdi: forventet ${aB(Z.values[0])}`;
        return `Ugyldig valg: forventet en av ${FQ(Z.values,"|")}`;
      case "too_big": {
        let Y = Z.inclusive ? "<=" : "<",
          J = Q(Z.origin);
        if (J) return `For stor(t): forventet ${Z.origin??"value"} til å ha ${Y}${Z.maximum.toString()} ${J.unit??"elementer"}`;
        return `For stor(t): forventet ${Z.origin??"value"} til å ha ${Y}${Z.maximum.toString()}`
      }
      case "too_small": {
        let Y = Z.inclusive ? ">=" : ">",
          J = Q(Z.origin);
        if (J) return `For lite(n): forventet ${Z.origin} til å ha ${Y}${Z.minimum.toString()} ${J.unit}`;
        return `For lite(n): forventet ${Z.origin} til å ha ${Y}${Z.minimum.toString()}`
      }
      case "invalid_format": {
        let Y = Z;
        if (Y.format === "starts_with") return `Ugyldig streng: må starte med "${Y.prefix}"`;
        if (Y.format === "ends_with") return `Ugyldig streng: må ende med "${Y.suffix}"`;
        if (Y.format === "includes") return `Ugyldig streng: må inneholde "${Y.includes}"`;
        if (Y.format === "regex") return `Ugyldig streng: må matche mønsteret ${Y.pattern}`;
        return `Ugyldig ${G[Y.format]??Z.format}`
      }
      case "not_multiple_of":
        return `Ugyldig tall: må være et multiplum av ${Z.divisor}`;
      case "unrecognized_keys":
        return `${Z.keys.length>1?"Ukjente nøkler":"Ukjent nøkkel"}: ${FQ(Z.keys,", ")}`;
      case "invalid_key":
        return `Ugyldig nøkkel i ${Z.origin}`;
      case "invalid_union":
        return "Ugyldig input";
      case "invalid_element":
        return `Ugyldig verdi i ${Z.origin}`;
      default:
        return "Ugyldig input"
    }
  }
}
// @from(Ln 154944, Col 4)
_zB = w(() => {
  W6()
})
// @from(Ln 154948, Col 0)
function Pe1() {
  return {
    localeError: EY8()
  }
}
// @from(Ln 154953, Col 4)
EY8 = () => {
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

  function Q(Z) {
    return A[Z] ?? null
  }
  let B = (Z) => {
      let Y = typeof Z;
      switch (Y) {
        case "number":
          return Number.isNaN(Z) ? "NaN" : "numara";
        case "object": {
          if (Array.isArray(Z)) return "saf";
          if (Z === null) return "gayb";
          if (Object.getPrototypeOf(Z) !== Object.prototype && Z.constructor) return Z.constructor.name
        }
      }
      return Y
    },
    G = {
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
  return (Z) => {
    switch (Z.code) {
      case "invalid_type":
        return `Fâsit giren: umulan ${Z.expected}, alınan ${B(Z.input)}`;
      case "invalid_value":
        if (Z.values.length === 1) return `Fâsit giren: umulan ${aB(Z.values[0])}`;
        return `Fâsit tercih: mûteberler ${FQ(Z.values,"|")}`;
      case "too_big": {
        let Y = Z.inclusive ? "<=" : "<",
          J = Q(Z.origin);
        if (J) return `Fazla büyük: ${Z.origin??"value"}, ${Y}${Z.maximum.toString()} ${J.unit??"elements"} sahip olmalıydı.`;
        return `Fazla büyük: ${Z.origin??"value"}, ${Y}${Z.maximum.toString()} olmalıydı.`
      }
      case "too_small": {
        let Y = Z.inclusive ? ">=" : ">",
          J = Q(Z.origin);
        if (J) return `Fazla küçük: ${Z.origin}, ${Y}${Z.minimum.toString()} ${J.unit} sahip olmalıydı.`;
        return `Fazla küçük: ${Z.origin}, ${Y}${Z.minimum.toString()} olmalıydı.`
      }
      case "invalid_format": {
        let Y = Z;
        if (Y.format === "starts_with") return `Fâsit metin: "${Y.prefix}" ile başlamalı.`;
        if (Y.format === "ends_with") return `Fâsit metin: "${Y.suffix}" ile bitmeli.`;
        if (Y.format === "includes") return `Fâsit metin: "${Y.includes}" ihtivâ etmeli.`;
        if (Y.format === "regex") return `Fâsit metin: ${Y.pattern} nakşına uymalı.`;
        return `Fâsit ${G[Y.format]??Z.format}`
      }
      case "not_multiple_of":
        return `Fâsit sayı: ${Z.divisor} katı olmalıydı.`;
      case "unrecognized_keys":
        return `Tanınmayan anahtar ${Z.keys.length>1?"s":""}: ${FQ(Z.keys,", ")}`;
      case "invalid_key":
        return `${Z.origin} için tanınmayan anahtar var.`;
      case "invalid_union":
        return "Giren tanınamadı.";
      case "invalid_element":
        return `${Z.origin} için tanınmayan kıymet var.`;
      default:
        return "Kıymet tanınamadı."
    }
  }
}
// @from(Ln 155061, Col 4)
jzB = w(() => {
  W6()
})
// @from(Ln 155065, Col 0)
function Se1() {
  return {
    localeError: zY8()
  }
}
// @from(Ln 155070, Col 4)
zY8 = () => {
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

  function Q(Z) {
    return A[Z] ?? null
  }
  let B = (Z) => {
      let Y = typeof Z;
      switch (Y) {
        case "number":
          return Number.isNaN(Z) ? "NaN" : "عدد";
        case "object": {
          if (Array.isArray(Z)) return "ارې";
          if (Z === null) return "null";
          if (Object.getPrototypeOf(Z) !== Object.prototype && Z.constructor) return Z.constructor.name
        }
      }
      return Y
    },
    G = {
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
  return (Z) => {
    switch (Z.code) {
      case "invalid_type":
        return `ناسم ورودي: باید ${Z.expected} وای, مګر ${B(Z.input)} ترلاسه شو`;
      case "invalid_value":
        if (Z.values.length === 1) return `ناسم ورودي: باید ${aB(Z.values[0])} وای`;
        return `ناسم انتخاب: باید یو له ${FQ(Z.values,"|")} څخه وای`;
      case "too_big": {
        let Y = Z.inclusive ? "<=" : "<",
          J = Q(Z.origin);
        if (J) return `ډیر لوی: ${Z.origin??"ارزښت"} باید ${Y}${Z.maximum.toString()} ${J.unit??"عنصرونه"} ولري`;
        return `ډیر لوی: ${Z.origin??"ارزښت"} باید ${Y}${Z.maximum.toString()} وي`
      }
      case "too_small": {
        let Y = Z.inclusive ? ">=" : ">",
          J = Q(Z.origin);
        if (J) return `ډیر کوچنی: ${Z.origin} باید ${Y}${Z.minimum.toString()} ${J.unit} ولري`;
        return `ډیر کوچنی: ${Z.origin} باید ${Y}${Z.minimum.toString()} وي`
      }
      case "invalid_format": {
        let Y = Z;
        if (Y.format === "starts_with") return `ناسم متن: باید د "${Y.prefix}" سره پیل شي`;
        if (Y.format === "ends_with") return `ناسم متن: باید د "${Y.suffix}" سره پای ته ورسيږي`;
        if (Y.format === "includes") return `ناسم متن: باید "${Y.includes}" ولري`;
        if (Y.format === "regex") return `ناسم متن: باید د ${Y.pattern} سره مطابقت ولري`;
        return `${G[Y.format]??Z.format} ناسم دی`
      }
      case "not_multiple_of":
        return `ناسم عدد: باید د ${Z.divisor} مضرب وي`;
      case "unrecognized_keys":
        return `ناسم ${Z.keys.length>1?"کلیډونه":"کلیډ"}: ${FQ(Z.keys,", ")}`;
      case "invalid_key":
        return `ناسم کلیډ په ${Z.origin} کې`;
      case "invalid_union":
        return "ناسمه ورودي";
      case "invalid_element":
        return `ناسم عنصر په ${Z.origin} کې`;
      default:
        return "ناسمه ورودي"
    }
  }
}
// @from(Ln 155178, Col 4)
TzB = w(() => {
  W6()
})
// @from(Ln 155182, Col 0)
function xe1() {
  return {
    localeError: $Y8()
  }
}
// @from(Ln 155187, Col 4)
$Y8 = () => {
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

  function Q(Z) {
    return A[Z] ?? null
  }
  let B = (Z) => {
      let Y = typeof Z;
      switch (Y) {
        case "number":
          return Number.isNaN(Z) ? "NaN" : "liczba";
        case "object": {
          if (Array.isArray(Z)) return "tablica";
          if (Z === null) return "null";
          if (Object.getPrototypeOf(Z) !== Object.prototype && Z.constructor) return Z.constructor.name
        }
      }
      return Y
    },
    G = {
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
  return (Z) => {
    switch (Z.code) {
      case "invalid_type":
        return `Nieprawidłowe dane wejściowe: oczekiwano ${Z.expected}, otrzymano ${B(Z.input)}`;
      case "invalid_value":
        if (Z.values.length === 1) return `Nieprawidłowe dane wejściowe: oczekiwano ${aB(Z.values[0])}`;
        return `Nieprawidłowa opcja: oczekiwano jednej z wartości ${FQ(Z.values,"|")}`;
      case "too_big": {
        let Y = Z.inclusive ? "<=" : "<",
          J = Q(Z.origin);
        if (J) return `Za duża wartość: oczekiwano, że ${Z.origin??"wartość"} będzie mieć ${Y}${Z.maximum.toString()} ${J.unit??"elementów"}`;
        return `Zbyt duż(y/a/e): oczekiwano, że ${Z.origin??"wartość"} będzie wynosić ${Y}${Z.maximum.toString()}`
      }
      case "too_small": {
        let Y = Z.inclusive ? ">=" : ">",
          J = Q(Z.origin);
        if (J) return `Za mała wartość: oczekiwano, że ${Z.origin??"wartość"} będzie mieć ${Y}${Z.minimum.toString()} ${J.unit??"elementów"}`;
        return `Zbyt mał(y/a/e): oczekiwano, że ${Z.origin??"wartość"} będzie wynosić ${Y}${Z.minimum.toString()}`
      }
      case "invalid_format": {
        let Y = Z;
        if (Y.format === "starts_with") return `Nieprawidłowy ciąg znaków: musi zaczynać się od "${Y.prefix}"`;
        if (Y.format === "ends_with") return `Nieprawidłowy ciąg znaków: musi kończyć się na "${Y.suffix}"`;
        if (Y.format === "includes") return `Nieprawidłowy ciąg znaków: musi zawierać "${Y.includes}"`;
        if (Y.format === "regex") return `Nieprawidłowy ciąg znaków: musi odpowiadać wzorcowi ${Y.pattern}`;
        return `Nieprawidłow(y/a/e) ${G[Y.format]??Z.format}`
      }
      case "not_multiple_of":
        return `Nieprawidłowa liczba: musi być wielokrotnością ${Z.divisor}`;
      case "unrecognized_keys":
        return `Nierozpoznane klucze${Z.keys.length>1?"s":""}: ${FQ(Z.keys,", ")}`;
      case "invalid_key":
        return `Nieprawidłowy klucz w ${Z.origin}`;
      case "invalid_union":
        return "Nieprawidłowe dane wejściowe";
      case "invalid_element":
        return `Nieprawidłowa wartość w ${Z.origin}`;
      default:
        return "Nieprawidłowe dane wejściowe"
    }
  }
}
// @from(Ln 155295, Col 4)
PzB = w(() => {
  W6()
})
// @from(Ln 155299, Col 0)
function ye1() {
  return {
    localeError: CY8()
  }
}
// @from(Ln 155304, Col 4)
CY8 = () => {
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

  function Q(Z) {
    return A[Z] ?? null
  }
  let B = (Z) => {
      let Y = typeof Z;
      switch (Y) {
        case "number":
          return Number.isNaN(Z) ? "NaN" : "número";
        case "object": {
          if (Array.isArray(Z)) return "array";
          if (Z === null) return "nulo";
          if (Object.getPrototypeOf(Z) !== Object.prototype && Z.constructor) return Z.constructor.name
        }
      }
      return Y
    },
    G = {
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
  return (Z) => {
    switch (Z.code) {
      case "invalid_type":
        return `Tipo inválido: esperado ${Z.expected}, recebido ${B(Z.input)}`;
      case "invalid_value":
        if (Z.values.length === 1) return `Entrada inválida: esperado ${aB(Z.values[0])}`;
        return `Opção inválida: esperada uma das ${FQ(Z.values,"|")}`;
      case "too_big": {
        let Y = Z.inclusive ? "<=" : "<",
          J = Q(Z.origin);
        if (J) return `Muito grande: esperado que ${Z.origin??"valor"} tivesse ${Y}${Z.maximum.toString()} ${J.unit??"elementos"}`;
        return `Muito grande: esperado que ${Z.origin??"valor"} fosse ${Y}${Z.maximum.toString()}`
      }
      case "too_small": {
        let Y = Z.inclusive ? ">=" : ">",
          J = Q(Z.origin);
        if (J) return `Muito pequeno: esperado que ${Z.origin} tivesse ${Y}${Z.minimum.toString()} ${J.unit}`;
        return `Muito pequeno: esperado que ${Z.origin} fosse ${Y}${Z.minimum.toString()}`
      }
      case "invalid_format": {
        let Y = Z;
        if (Y.format === "starts_with") return `Texto inválido: deve começar com "${Y.prefix}"`;
        if (Y.format === "ends_with") return `Texto inválido: deve terminar com "${Y.suffix}"`;
        if (Y.format === "includes") return `Texto inválido: deve incluir "${Y.includes}"`;
        if (Y.format === "regex") return `Texto inválido: deve corresponder ao padrão ${Y.pattern}`;
        return `${G[Y.format]??Z.format} inválido`
      }
      case "not_multiple_of":
        return `Número inválido: deve ser múltiplo de ${Z.divisor}`;
      case "unrecognized_keys":
        return `Chave${Z.keys.length>1?"s":""} desconhecida${Z.keys.length>1?"s":""}: ${FQ(Z.keys,", ")}`;
      case "invalid_key":
        return `Chave inválida em ${Z.origin}`;
      case "invalid_union":
        return "Entrada inválida";
      case "invalid_element":
        return `Valor inválido em ${Z.origin}`;
      default:
        return "Campo inválido"
    }
  }
}
// @from(Ln 155412, Col 4)
SzB = w(() => {
  W6()
})
// @from(Ln 155416, Col 0)
function xzB(A, Q, B, G) {
  let Z = Math.abs(A),
    Y = Z % 10,
    J = Z % 100;
  if (J >= 11 && J <= 19) return G;
  if (Y === 1) return Q;
  if (Y >= 2 && Y <= 4) return B;
  return G
}
// @from(Ln 155426, Col 0)
function ve1() {
  return {
    localeError: UY8()
  }
}
// @from(Ln 155431, Col 4)
UY8 = () => {
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

  function Q(Z) {
    return A[Z] ?? null
  }
  let B = (Z) => {
      let Y = typeof Z;
      switch (Y) {
        case "number":
          return Number.isNaN(Z) ? "NaN" : "число";
        case "object": {
          if (Array.isArray(Z)) return "массив";
          if (Z === null) return "null";
          if (Object.getPrototypeOf(Z) !== Object.prototype && Z.constructor) return Z.constructor.name
        }
      }
      return Y
    },
    G = {
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
  return (Z) => {
    switch (Z.code) {
      case "invalid_type":
        return `Неверный ввод: ожидалось ${Z.expected}, получено ${B(Z.input)}`;
      case "invalid_value":
        if (Z.values.length === 1) return `Неверный ввод: ожидалось ${aB(Z.values[0])}`;
        return `Неверный вариант: ожидалось одно из ${FQ(Z.values,"|")}`;
      case "too_big": {
        let Y = Z.inclusive ? "<=" : "<",
          J = Q(Z.origin);
        if (J) {
          let X = Number(Z.maximum),
            I = xzB(X, J.unit.one, J.unit.few, J.unit.many);
          return `Слишком большое значение: ожидалось, что ${Z.origin??"значение"} будет иметь ${Y}${Z.maximum.toString()} ${I}`
        }
        return `Слишком большое значение: ожидалось, что ${Z.origin??"значение"} будет ${Y}${Z.maximum.toString()}`
      }
      case "too_small": {
        let Y = Z.inclusive ? ">=" : ">",
          J = Q(Z.origin);
        if (J) {
          let X = Number(Z.minimum),
            I = xzB(X, J.unit.one, J.unit.few, J.unit.many);
          return `Слишком маленькое значение: ожидалось, что ${Z.origin} будет иметь ${Y}${Z.minimum.toString()} ${I}`
        }
        return `Слишком маленькое значение: ожидалось, что ${Z.origin} будет ${Y}${Z.minimum.toString()}`
      }
      case "invalid_format": {
        let Y = Z;
        if (Y.format === "starts_with") return `Неверная строка: должна начинаться с "${Y.prefix}"`;
        if (Y.format === "ends_with") return `Неверная строка: должна заканчиваться на "${Y.suffix}"`;
        if (Y.format === "includes") return `Неверная строка: должна содержать "${Y.includes}"`;
        if (Y.format === "regex") return `Неверная строка: должна соответствовать шаблону ${Y.pattern}`;
        return `Неверный ${G[Y.format]??Z.format}`
      }
      case "not_multiple_of":
        return `Неверное число: должно быть кратным ${Z.divisor}`;
      case "unrecognized_keys":
        return `Нераспознанн${Z.keys.length>1?"ые":"ый"} ключ${Z.keys.length>1?"и":""}: ${FQ(Z.keys,", ")}`;
      case "invalid_key":
        return `Неверный ключ в ${Z.origin}`;
      case "invalid_union":
        return "Неверные входные данные";
      case "invalid_element":
        return `Неверное значение в ${Z.origin}`;
      default:
        return "Неверные входные данные"
    }
  }
}
// @from(Ln 155563, Col 4)
yzB = w(() => {
  W6()
})
// @from(Ln 155567, Col 0)
function ke1() {
  return {
    localeError: qY8()
  }
}
// @from(Ln 155572, Col 4)
qY8 = () => {
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

  function Q(Z) {
    return A[Z] ?? null
  }
  let B = (Z) => {
      let Y = typeof Z;
      switch (Y) {
        case "number":
          return Number.isNaN(Z) ? "NaN" : "število";
        case "object": {
          if (Array.isArray(Z)) return "tabela";
          if (Z === null) return "null";
          if (Object.getPrototypeOf(Z) !== Object.prototype && Z.constructor) return Z.constructor.name
        }
      }
      return Y
    },
    G = {
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
  return (Z) => {
    switch (Z.code) {
      case "invalid_type":
        return `Neveljaven vnos: pričakovano ${Z.expected}, prejeto ${B(Z.input)}`;
      case "invalid_value":
        if (Z.values.length === 1) return `Neveljaven vnos: pričakovano ${aB(Z.values[0])}`;
        return `Neveljavna možnost: pričakovano eno izmed ${FQ(Z.values,"|")}`;
      case "too_big": {
        let Y = Z.inclusive ? "<=" : "<",
          J = Q(Z.origin);
        if (J) return `Preveliko: pričakovano, da bo ${Z.origin??"vrednost"} imelo ${Y}${Z.maximum.toString()} ${J.unit??"elementov"}`;
        return `Preveliko: pričakovano, da bo ${Z.origin??"vrednost"} ${Y}${Z.maximum.toString()}`
      }
      case "too_small": {
        let Y = Z.inclusive ? ">=" : ">",
          J = Q(Z.origin);
        if (J) return `Premajhno: pričakovano, da bo ${Z.origin} imelo ${Y}${Z.minimum.toString()} ${J.unit}`;
        return `Premajhno: pričakovano, da bo ${Z.origin} ${Y}${Z.minimum.toString()}`
      }
      case "invalid_format": {
        let Y = Z;
        if (Y.format === "starts_with") return `Neveljaven niz: mora se začeti z "${Y.prefix}"`;
        if (Y.format === "ends_with") return `Neveljaven niz: mora se končati z "${Y.suffix}"`;
        if (Y.format === "includes") return `Neveljaven niz: mora vsebovati "${Y.includes}"`;
        if (Y.format === "regex") return `Neveljaven niz: mora ustrezati vzorcu ${Y.pattern}`;
        return `Neveljaven ${G[Y.format]??Z.format}`
      }
      case "not_multiple_of":
        return `Neveljavno število: mora biti večkratnik ${Z.divisor}`;
      case "unrecognized_keys":
        return `Neprepoznan${Z.keys.length>1?"i ključi":" ključ"}: ${FQ(Z.keys,", ")}`;
      case "invalid_key":
        return `Neveljaven ključ v ${Z.origin}`;
      case "invalid_union":
        return "Neveljaven vnos";
      case "invalid_element":
        return `Neveljavna vrednost v ${Z.origin}`;
      default:
        return "Neveljaven vnos"
    }
  }
}
// @from(Ln 155680, Col 4)
vzB = w(() => {
  W6()
})
// @from(Ln 155684, Col 0)
function be1() {
  return {
    localeError: NY8()
  }
}
// @from(Ln 155689, Col 4)
NY8 = () => {
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

  function Q(Z) {
    return A[Z] ?? null
  }
  let B = (Z) => {
      let Y = typeof Z;
      switch (Y) {
        case "number":
          return Number.isNaN(Z) ? "NaN" : "antal";
        case "object": {
          if (Array.isArray(Z)) return "lista";
          if (Z === null) return "null";
          if (Object.getPrototypeOf(Z) !== Object.prototype && Z.constructor) return Z.constructor.name
        }
      }
      return Y
    },
    G = {
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
  return (Z) => {
    switch (Z.code) {
      case "invalid_type":
        return `Ogiltig inmatning: förväntat ${Z.expected}, fick ${B(Z.input)}`;
      case "invalid_value":
        if (Z.values.length === 1) return `Ogiltig inmatning: förväntat ${aB(Z.values[0])}`;
        return `Ogiltigt val: förväntade en av ${FQ(Z.values,"|")}`;
      case "too_big": {
        let Y = Z.inclusive ? "<=" : "<",
          J = Q(Z.origin);
        if (J) return `För stor(t): förväntade ${Z.origin??"värdet"} att ha ${Y}${Z.maximum.toString()} ${J.unit??"element"}`;
        return `För stor(t): förväntat ${Z.origin??"värdet"} att ha ${Y}${Z.maximum.toString()}`
      }
      case "too_small": {
        let Y = Z.inclusive ? ">=" : ">",
          J = Q(Z.origin);
        if (J) return `För lite(t): förväntade ${Z.origin??"värdet"} att ha ${Y}${Z.minimum.toString()} ${J.unit}`;
        return `För lite(t): förväntade ${Z.origin??"värdet"} att ha ${Y}${Z.minimum.toString()}`
      }
      case "invalid_format": {
        let Y = Z;
        if (Y.format === "starts_with") return `Ogiltig sträng: måste börja med "${Y.prefix}"`;
        if (Y.format === "ends_with") return `Ogiltig sträng: måste sluta med "${Y.suffix}"`;
        if (Y.format === "includes") return `Ogiltig sträng: måste innehålla "${Y.includes}"`;
        if (Y.format === "regex") return `Ogiltig sträng: måste matcha mönstret "${Y.pattern}"`;
        return `Ogiltig(t) ${G[Y.format]??Z.format}`
      }
      case "not_multiple_of":
        return `Ogiltigt tal: måste vara en multipel av ${Z.divisor}`;
      case "unrecognized_keys":
        return `${Z.keys.length>1?"Okända nycklar":"Okänd nyckel"}: ${FQ(Z.keys,", ")}`;
      case "invalid_key":
        return `Ogiltig nyckel i ${Z.origin??"värdet"}`;
      case "invalid_union":
        return "Ogiltig input";
      case "invalid_element":
        return `Ogiltigt värde i ${Z.origin??"värdet"}`;
      default:
        return "Ogiltig input"
    }
  }
}
// @from(Ln 155797, Col 4)
kzB = w(() => {
  W6()
})
// @from(Ln 155801, Col 0)
function fe1() {
  return {
    localeError: wY8()
  }
}
// @from(Ln 155806, Col 4)
wY8 = () => {
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

  function Q(Z) {
    return A[Z] ?? null
  }
  let B = (Z) => {
      let Y = typeof Z;
      switch (Y) {
        case "number":
          return Number.isNaN(Z) ? "எண் அல்லாதது" : "எண்";
        case "object": {
          if (Array.isArray(Z)) return "அணி";
          if (Z === null) return "வெறுமை";
          if (Object.getPrototypeOf(Z) !== Object.prototype && Z.constructor) return Z.constructor.name
        }
      }
      return Y
    },
    G = {
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
  return (Z) => {
    switch (Z.code) {
      case "invalid_type":
        return `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${Z.expected}, பெறப்பட்டது ${B(Z.input)}`;
      case "invalid_value":
        if (Z.values.length === 1) return `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${aB(Z.values[0])}`;
        return `தவறான விருப்பம்: எதிர்பார்க்கப்பட்டது ${FQ(Z.values,"|")} இல் ஒன்று`;
      case "too_big": {
        let Y = Z.inclusive ? "<=" : "<",
          J = Q(Z.origin);
        if (J) return `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${Z.origin??"மதிப்பு"} ${Y}${Z.maximum.toString()} ${J.unit??"உறுப்புகள்"} ஆக இருக்க வேண்டும்`;
        return `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${Z.origin??"மதிப்பு"} ${Y}${Z.maximum.toString()} ஆக இருக்க வேண்டும்`
      }
      case "too_small": {
        let Y = Z.inclusive ? ">=" : ">",
          J = Q(Z.origin);
        if (J) return `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${Z.origin} ${Y}${Z.minimum.toString()} ${J.unit} ஆக இருக்க வேண்டும்`;
        return `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${Z.origin} ${Y}${Z.minimum.toString()} ஆக இருக்க வேண்டும்`
      }
      case "invalid_format": {
        let Y = Z;
        if (Y.format === "starts_with") return `தவறான சரம்: "${Y.prefix}" இல் தொடங்க வேண்டும்`;
        if (Y.format === "ends_with") return `தவறான சரம்: "${Y.suffix}" இல் முடிவடைய வேண்டும்`;
        if (Y.format === "includes") return `தவறான சரம்: "${Y.includes}" ஐ உள்ளடக்க வேண்டும்`;
        if (Y.format === "regex") return `தவறான சரம்: ${Y.pattern} முறைபாட்டுடன் பொருந்த வேண்டும்`;
        return `தவறான ${G[Y.format]??Z.format}`
      }
      case "not_multiple_of":
        return `தவறான எண்: ${Z.divisor} இன் பலமாக இருக்க வேண்டும்`;
      case "unrecognized_keys":
        return `அடையாளம் தெரியாத விசை${Z.keys.length>1?"கள்":""}: ${FQ(Z.keys,", ")}`;
      case "invalid_key":
        return `${Z.origin} இல் தவறான விசை`;
      case "invalid_union":
        return "தவறான உள்ளீடு";
      case "invalid_element":
        return `${Z.origin} இல் தவறான மதிப்பு`;
      default:
        return "தவறான உள்ளீடு"
    }
  }
}
// @from(Ln 155914, Col 4)
bzB = w(() => {
  W6()
})
// @from(Ln 155918, Col 0)
function he1() {
  return {
    localeError: LY8()
  }
}
// @from(Ln 155923, Col 4)
LY8 = () => {
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

  function Q(Z) {
    return A[Z] ?? null
  }
  let B = (Z) => {
      let Y = typeof Z;
      switch (Y) {
        case "number":
          return Number.isNaN(Z) ? "ไม่ใช่ตัวเลข (NaN)" : "ตัวเลข";
        case "object": {
          if (Array.isArray(Z)) return "อาร์เรย์ (Array)";
          if (Z === null) return "ไม่มีค่า (null)";
          if (Object.getPrototypeOf(Z) !== Object.prototype && Z.constructor) return Z.constructor.name
        }
      }
      return Y
    },
    G = {
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
  return (Z) => {
    switch (Z.code) {
      case "invalid_type":
        return `ประเภทข้อมูลไม่ถูกต้อง: ควรเป็น ${Z.expected} แต่ได้รับ ${B(Z.input)}`;
      case "invalid_value":
        if (Z.values.length === 1) return `ค่าไม่ถูกต้อง: ควรเป็น ${aB(Z.values[0])}`;
        return `ตัวเลือกไม่ถูกต้อง: ควรเป็นหนึ่งใน ${FQ(Z.values,"|")}`;
      case "too_big": {
        let Y = Z.inclusive ? "ไม่เกิน" : "น้อยกว่า",
          J = Q(Z.origin);
        if (J) return `เกินกำหนด: ${Z.origin??"ค่า"} ควรมี${Y} ${Z.maximum.toString()} ${J.unit??"รายการ"}`;
        return `เกินกำหนด: ${Z.origin??"ค่า"} ควรมี${Y} ${Z.maximum.toString()}`
      }
      case "too_small": {
        let Y = Z.inclusive ? "อย่างน้อย" : "มากกว่า",
          J = Q(Z.origin);
        if (J) return `น้อยกว่ากำหนด: ${Z.origin} ควรมี${Y} ${Z.minimum.toString()} ${J.unit}`;
        return `น้อยกว่ากำหนด: ${Z.origin} ควรมี${Y} ${Z.minimum.toString()}`
      }
      case "invalid_format": {
        let Y = Z;
        if (Y.format === "starts_with") return `รูปแบบไม่ถูกต้อง: ข้อความต้องขึ้นต้นด้วย "${Y.prefix}"`;
        if (Y.format === "ends_with") return `รูปแบบไม่ถูกต้อง: ข้อความต้องลงท้ายด้วย "${Y.suffix}"`;
        if (Y.format === "includes") return `รูปแบบไม่ถูกต้อง: ข้อความต้องมี "${Y.includes}" อยู่ในข้อความ`;
        if (Y.format === "regex") return `รูปแบบไม่ถูกต้อง: ต้องตรงกับรูปแบบที่กำหนด ${Y.pattern}`;
        return `รูปแบบไม่ถูกต้อง: ${G[Y.format]??Z.format}`
      }
      case "not_multiple_of":
        return `ตัวเลขไม่ถูกต้อง: ต้องเป็นจำนวนที่หารด้วย ${Z.divisor} ได้ลงตัว`;
      case "unrecognized_keys":
        return `พบคีย์ที่ไม่รู้จัก: ${FQ(Z.keys,", ")}`;
      case "invalid_key":
        return `คีย์ไม่ถูกต้องใน ${Z.origin}`;
      case "invalid_union":
        return "ข้อมูลไม่ถูกต้อง: ไม่ตรงกับรูปแบบยูเนียนที่กำหนดไว้";
      case "invalid_element":
        return `ข้อมูลไม่ถูกต้องใน ${Z.origin}`;
      default:
        return "ข้อมูลไม่ถูกต้อง"
    }
  }
}
// @from(Ln 156031, Col 4)
fzB = w(() => {
  W6()
})
// @from(Ln 156035, Col 0)
function ge1() {
  return {
    localeError: MY8()
  }
}
// @from(Ln 156040, Col 4)
OY8 = (A) => {
    let Q = typeof A;
    switch (Q) {
      case "number":
        return Number.isNaN(A) ? "NaN" : "number";
      case "object": {
        if (Array.isArray(A)) return "array";
        if (A === null) return "null";
        if (Object.getPrototypeOf(A) !== Object.prototype && A.constructor) return A.constructor.name
      }
    }
    return Q
  }
// @from(Ln 156053, Col 2)
MY8 = () => {
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

    function Q(G) {
      return A[G] ?? null
    }
    let B = {
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
    return (G) => {
      switch (G.code) {
        case "invalid_type":
          return `Geçersiz değer: beklenen ${G.expected}, alınan ${OY8(G.input)}`;
        case "invalid_value":
          if (G.values.length === 1) return `Geçersiz değer: beklenen ${aB(G.values[0])}`;
          return `Geçersiz seçenek: aşağıdakilerden biri olmalı: ${FQ(G.values,"|")}`;
        case "too_big": {
          let Z = G.inclusive ? "<=" : "<",
            Y = Q(G.origin);
          if (Y) return `Çok büyük: beklenen ${G.origin??"değer"} ${Z}${G.maximum.toString()} ${Y.unit??"öğe"}`;
          return `Çok büyük: beklenen ${G.origin??"değer"} ${Z}${G.maximum.toString()}`
        }
        case "too_small": {
          let Z = G.inclusive ? ">=" : ">",
            Y = Q(G.origin);
          if (Y) return `Çok küçük: beklenen ${G.origin} ${Z}${G.minimum.toString()} ${Y.unit}`;
          return `Çok küçük: beklenen ${G.origin} ${Z}${G.minimum.toString()}`
        }
        case "invalid_format": {
          let Z = G;
          if (Z.format === "starts_with") return `Geçersiz metin: "${Z.prefix}" ile başlamalı`;
          if (Z.format === "ends_with") return `Geçersiz metin: "${Z.suffix}" ile bitmeli`;
          if (Z.format === "includes") return `Geçersiz metin: "${Z.includes}" içermeli`;
          if (Z.format === "regex") return `Geçersiz metin: ${Z.pattern} desenine uymalı`;
          return `Geçersiz ${B[Z.format]??G.format}`
        }
        case "not_multiple_of":
          return `Geçersiz sayı: ${G.divisor} ile tam bölünebilmeli`;
        case "unrecognized_keys":
          return `Tanınmayan anahtar${G.keys.length>1?"lar":""}: ${FQ(G.keys,", ")}`;
        case "invalid_key":
          return `${G.origin} içinde geçersiz anahtar`;
        case "invalid_union":
          return "Geçersiz değer";
        case "invalid_element":
          return `${G.origin} içinde geçersiz değer`;
        default:
          return "Geçersiz değer"
      }
    }
  }
// @from(Ln 156148, Col 4)
hzB = w(() => {
  W6()
})
// @from(Ln 156152, Col 0)
function ue1() {
  return {
    localeError: RY8()
  }
}
// @from(Ln 156157, Col 4)
RY8 = () => {
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

  function Q(Z) {
    return A[Z] ?? null
  }
  let B = (Z) => {
      let Y = typeof Z;
      switch (Y) {
        case "number":
          return Number.isNaN(Z) ? "NaN" : "число";
        case "object": {
          if (Array.isArray(Z)) return "масив";
          if (Z === null) return "null";
          if (Object.getPrototypeOf(Z) !== Object.prototype && Z.constructor) return Z.constructor.name
        }
      }
      return Y
    },
    G = {
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
  return (Z) => {
    switch (Z.code) {
      case "invalid_type":
        return `Неправильні вхідні дані: очікується ${Z.expected}, отримано ${B(Z.input)}`;
      case "invalid_value":
        if (Z.values.length === 1) return `Неправильні вхідні дані: очікується ${aB(Z.values[0])}`;
        return `Неправильна опція: очікується одне з ${FQ(Z.values,"|")}`;
      case "too_big": {
        let Y = Z.inclusive ? "<=" : "<",
          J = Q(Z.origin);
        if (J) return `Занадто велике: очікується, що ${Z.origin??"значення"} ${J.verb} ${Y}${Z.maximum.toString()} ${J.unit??"елементів"}`;
        return `Занадто велике: очікується, що ${Z.origin??"значення"} буде ${Y}${Z.maximum.toString()}`
      }
      case "too_small": {
        let Y = Z.inclusive ? ">=" : ">",
          J = Q(Z.origin);
        if (J) return `Занадто мале: очікується, що ${Z.origin} ${J.verb} ${Y}${Z.minimum.toString()} ${J.unit}`;
        return `Занадто мале: очікується, що ${Z.origin} буде ${Y}${Z.minimum.toString()}`
      }
      case "invalid_format": {
        let Y = Z;
        if (Y.format === "starts_with") return `Неправильний рядок: повинен починатися з "${Y.prefix}"`;
        if (Y.format === "ends_with") return `Неправильний рядок: повинен закінчуватися на "${Y.suffix}"`;
        if (Y.format === "includes") return `Неправильний рядок: повинен містити "${Y.includes}"`;
        if (Y.format === "regex") return `Неправильний рядок: повинен відповідати шаблону ${Y.pattern}`;
        return `Неправильний ${G[Y.format]??Z.format}`
      }
      case "not_multiple_of":
        return `Неправильне число: повинно бути кратним ${Z.divisor}`;
      case "unrecognized_keys":
        return `Нерозпізнаний ключ${Z.keys.length>1?"і":""}: ${FQ(Z.keys,", ")}`;
      case "invalid_key":
        return `Неправильний ключ у ${Z.origin}`;
      case "invalid_union":
        return "Неправильні вхідні дані";
      case "invalid_element":
        return `Неправильне значення у ${Z.origin}`;
      default:
        return "Неправильні вхідні дані"
    }
  }
}
// @from(Ln 156265, Col 4)
gzB = w(() => {
  W6()
})
// @from(Ln 156269, Col 0)
function me1() {
  return {
    localeError: _Y8()
  }
}
// @from(Ln 156274, Col 4)
_Y8 = () => {
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

  function Q(Z) {
    return A[Z] ?? null
  }
  let B = (Z) => {
      let Y = typeof Z;
      switch (Y) {
        case "number":
          return Number.isNaN(Z) ? "NaN" : "نمبر";
        case "object": {
          if (Array.isArray(Z)) return "آرے";
          if (Z === null) return "نل";
          if (Object.getPrototypeOf(Z) !== Object.prototype && Z.constructor) return Z.constructor.name
        }
      }
      return Y
    },
    G = {
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
  return (Z) => {
    switch (Z.code) {
      case "invalid_type":
        return `غلط ان پٹ: ${Z.expected} متوقع تھا، ${B(Z.input)} موصول ہوا`;
      case "invalid_value":
        if (Z.values.length === 1) return `غلط ان پٹ: ${aB(Z.values[0])} متوقع تھا`;
        return `غلط آپشن: ${FQ(Z.values,"|")} میں سے ایک متوقع تھا`;
      case "too_big": {
        let Y = Z.inclusive ? "<=" : "<",
          J = Q(Z.origin);
        if (J) return `بہت بڑا: ${Z.origin??"ویلیو"} کے ${Y}${Z.maximum.toString()} ${J.unit??"عناصر"} ہونے متوقع تھے`;
        return `بہت بڑا: ${Z.origin??"ویلیو"} کا ${Y}${Z.maximum.toString()} ہونا متوقع تھا`
      }
      case "too_small": {
        let Y = Z.inclusive ? ">=" : ">",
          J = Q(Z.origin);
        if (J) return `بہت چھوٹا: ${Z.origin} کے ${Y}${Z.minimum.toString()} ${J.unit} ہونے متوقع تھے`;
        return `بہت چھوٹا: ${Z.origin} کا ${Y}${Z.minimum.toString()} ہونا متوقع تھا`
      }
      case "invalid_format": {
        let Y = Z;
        if (Y.format === "starts_with") return `غلط سٹرنگ: "${Y.prefix}" سے شروع ہونا چاہیے`;
        if (Y.format === "ends_with") return `غلط سٹرنگ: "${Y.suffix}" پر ختم ہونا چاہیے`;
        if (Y.format === "includes") return `غلط سٹرنگ: "${Y.includes}" شامل ہونا چاہیے`;
        if (Y.format === "regex") return `غلط سٹرنگ: پیٹرن ${Y.pattern} سے میچ ہونا چاہیے`;
        return `غلط ${G[Y.format]??Z.format}`
      }
      case "not_multiple_of":
        return `غلط نمبر: ${Z.divisor} کا مضاعف ہونا چاہیے`;
      case "unrecognized_keys":
        return `غیر تسلیم شدہ کی${Z.keys.length>1?"ز":""}: ${FQ(Z.keys,"، ")}`;
      case "invalid_key":
        return `${Z.origin} میں غلط کی`;
      case "invalid_union":
        return "غلط ان پٹ";
      case "invalid_element":
        return `${Z.origin} میں غلط ویلیو`;
      default:
        return "غلط ان پٹ"
    }
  }
}
// @from(Ln 156382, Col 4)
uzB = w(() => {
  W6()
})
// @from(Ln 156386, Col 0)
function de1() {
  return {
    localeError: jY8()
  }
}
// @from(Ln 156391, Col 4)
jY8 = () => {
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

  function Q(Z) {
    return A[Z] ?? null
  }
  let B = (Z) => {
      let Y = typeof Z;
      switch (Y) {
        case "number":
          return Number.isNaN(Z) ? "NaN" : "số";
        case "object": {
          if (Array.isArray(Z)) return "mảng";
          if (Z === null) return "null";
          if (Object.getPrototypeOf(Z) !== Object.prototype && Z.constructor) return Z.constructor.name
        }
      }
      return Y
    },
    G = {
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
  return (Z) => {
    switch (Z.code) {
      case "invalid_type":
        return `Đầu vào không hợp lệ: mong đợi ${Z.expected}, nhận được ${B(Z.input)}`;
      case "invalid_value":
        if (Z.values.length === 1) return `Đầu vào không hợp lệ: mong đợi ${aB(Z.values[0])}`;
        return `Tùy chọn không hợp lệ: mong đợi một trong các giá trị ${FQ(Z.values,"|")}`;
      case "too_big": {
        let Y = Z.inclusive ? "<=" : "<",
          J = Q(Z.origin);
        if (J) return `Quá lớn: mong đợi ${Z.origin??"giá trị"} ${J.verb} ${Y}${Z.maximum.toString()} ${J.unit??"phần tử"}`;
        return `Quá lớn: mong đợi ${Z.origin??"giá trị"} ${Y}${Z.maximum.toString()}`
      }
      case "too_small": {
        let Y = Z.inclusive ? ">=" : ">",
          J = Q(Z.origin);
        if (J) return `Quá nhỏ: mong đợi ${Z.origin} ${J.verb} ${Y}${Z.minimum.toString()} ${J.unit}`;
        return `Quá nhỏ: mong đợi ${Z.origin} ${Y}${Z.minimum.toString()}`
      }
      case "invalid_format": {
        let Y = Z;
        if (Y.format === "starts_with") return `Chuỗi không hợp lệ: phải bắt đầu bằng "${Y.prefix}"`;
        if (Y.format === "ends_with") return `Chuỗi không hợp lệ: phải kết thúc bằng "${Y.suffix}"`;
        if (Y.format === "includes") return `Chuỗi không hợp lệ: phải bao gồm "${Y.includes}"`;
        if (Y.format === "regex") return `Chuỗi không hợp lệ: phải khớp với mẫu ${Y.pattern}`;
        return `${G[Y.format]??Z.format} không hợp lệ`
      }
      case "not_multiple_of":
        return `Số không hợp lệ: phải là bội số của ${Z.divisor}`;
      case "unrecognized_keys":
        return `Khóa không được nhận dạng: ${FQ(Z.keys,", ")}`;
      case "invalid_key":
        return `Khóa không hợp lệ trong ${Z.origin}`;
      case "invalid_union":
        return "Đầu vào không hợp lệ";
      case "invalid_element":
        return `Giá trị không hợp lệ trong ${Z.origin}`;
      default:
        return "Đầu vào không hợp lệ"
    }
  }
}
// @from(Ln 156499, Col 4)
mzB = w(() => {
  W6()
})
// @from(Ln 156503, Col 0)
function ce1() {
  return {
    localeError: TY8()
  }
}
// @from(Ln 156508, Col 4)
TY8 = () => {
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

  function Q(Z) {
    return A[Z] ?? null
  }
  let B = (Z) => {
      let Y = typeof Z;
      switch (Y) {
        case "number":
          return Number.isNaN(Z) ? "非数字(NaN)" : "数字";
        case "object": {
          if (Array.isArray(Z)) return "数组";
          if (Z === null) return "空值(null)";
          if (Object.getPrototypeOf(Z) !== Object.prototype && Z.constructor) return Z.constructor.name
        }
      }
      return Y
    },
    G = {
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
  return (Z) => {
    switch (Z.code) {
      case "invalid_type":
        return `无效输入：期望 ${Z.expected}，实际接收 ${B(Z.input)}`;
      case "invalid_value":
        if (Z.values.length === 1) return `无效输入：期望 ${aB(Z.values[0])}`;
        return `无效选项：期望以下之一 ${FQ(Z.values,"|")}`;
      case "too_big": {
        let Y = Z.inclusive ? "<=" : "<",
          J = Q(Z.origin);
        if (J) return `数值过大：期望 ${Z.origin??"值"} ${Y}${Z.maximum.toString()} ${J.unit??"个元素"}`;
        return `数值过大：期望 ${Z.origin??"值"} ${Y}${Z.maximum.toString()}`
      }
      case "too_small": {
        let Y = Z.inclusive ? ">=" : ">",
          J = Q(Z.origin);
        if (J) return `数值过小：期望 ${Z.origin} ${Y}${Z.minimum.toString()} ${J.unit}`;
        return `数值过小：期望 ${Z.origin} ${Y}${Z.minimum.toString()}`
      }
      case "invalid_format": {
        let Y = Z;
        if (Y.format === "starts_with") return `无效字符串：必须以 "${Y.prefix}" 开头`;
        if (Y.format === "ends_with") return `无效字符串：必须以 "${Y.suffix}" 结尾`;
        if (Y.format === "includes") return `无效字符串：必须包含 "${Y.includes}"`;
        if (Y.format === "regex") return `无效字符串：必须满足正则表达式 ${Y.pattern}`;
        return `无效${G[Y.format]??Z.format}`
      }
      case "not_multiple_of":
        return `无效数字：必须是 ${Z.divisor} 的倍数`;
      case "unrecognized_keys":
        return `出现未知的键(key): ${FQ(Z.keys,", ")}`;
      case "invalid_key":
        return `${Z.origin} 中的键(key)无效`;
      case "invalid_union":
        return "无效输入";
      case "invalid_element":
        return `${Z.origin} 中包含无效值(value)`;
      default:
        return "无效输入"
    }
  }
}
// @from(Ln 156616, Col 4)
dzB = w(() => {
  W6()
})
// @from(Ln 156620, Col 0)
function pe1() {
  return {
    localeError: PY8()
  }
}
// @from(Ln 156625, Col 4)
PY8 = () => {
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

  function Q(Z) {
    return A[Z] ?? null
  }
  let B = (Z) => {
      let Y = typeof Z;
      switch (Y) {
        case "number":
          return Number.isNaN(Z) ? "NaN" : "number";
        case "object": {
          if (Array.isArray(Z)) return "array";
          if (Z === null) return "null";
          if (Object.getPrototypeOf(Z) !== Object.prototype && Z.constructor) return Z.constructor.name
        }
      }
      return Y
    },
    G = {
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
  return (Z) => {
    switch (Z.code) {
      case "invalid_type":
        return `無效的輸入值：預期為 ${Z.expected}，但收到 ${B(Z.input)}`;
      case "invalid_value":
        if (Z.values.length === 1) return `無效的輸入值：預期為 ${aB(Z.values[0])}`;
        return `無效的選項：預期為以下其中之一 ${FQ(Z.values,"|")}`;
      case "too_big": {
        let Y = Z.inclusive ? "<=" : "<",
          J = Q(Z.origin);
        if (J) return `數值過大：預期 ${Z.origin??"值"} 應為 ${Y}${Z.maximum.toString()} ${J.unit??"個元素"}`;
        return `數值過大：預期 ${Z.origin??"值"} 應為 ${Y}${Z.maximum.toString()}`
      }
      case "too_small": {
        let Y = Z.inclusive ? ">=" : ">",
          J = Q(Z.origin);
        if (J) return `數值過小：預期 ${Z.origin} 應為 ${Y}${Z.minimum.toString()} ${J.unit}`;
        return `數值過小：預期 ${Z.origin} 應為 ${Y}${Z.minimum.toString()}`
      }
      case "invalid_format": {
        let Y = Z;
        if (Y.format === "starts_with") return `無效的字串：必須以 "${Y.prefix}" 開頭`;
        if (Y.format === "ends_with") return `無效的字串：必須以 "${Y.suffix}" 結尾`;
        if (Y.format === "includes") return `無效的字串：必須包含 "${Y.includes}"`;
        if (Y.format === "regex") return `無效的字串：必須符合格式 ${Y.pattern}`;
        return `無效的 ${G[Y.format]??Z.format}`
      }
      case "not_multiple_of":
        return `無效的數字：必須為 ${Z.divisor} 的倍數`;
      case "unrecognized_keys":
        return `無法識別的鍵值${Z.keys.length>1?"們":""}：${FQ(Z.keys,"、")}`;
      case "invalid_key":
        return `${Z.origin} 中有無效的鍵值`;
      case "invalid_union":
        return "無效的輸入值";
      case "invalid_element":
        return `${Z.origin} 中有無效的值`;
      default:
        return "無效的輸入值"
    }
  }
}
// @from(Ln 156733, Col 4)
czB = w(() => {
  W6()
})
// @from(Ln 156736, Col 4)
$IA = {}
// @from(Ln 156778, Col 4)
FQ1 = w(() => {
  ZzB();
  YzB();
  XzB();
  IzB();
  DzB();
  WzB();
  Ve1();
  KzB();
  VzB();
  FzB();
  HzB();
  EzB();
  zzB();
  $zB();
  CzB();
  UzB();
  qzB();
  NzB();
  wzB();
  LzB();
  OzB();
  MzB();
  RzB();
  _zB();
  jzB();
  TzB();
  PzB();
  SzB();
  yzB();
  vzB();
  kzB();
  bzB();
  fzB();
  hzB();
  gzB();
  uzB();
  mzB();
  dzB();
  czB()
})
// @from(Ln 156819, Col 0)
class jRA {
  constructor() {
    this._map = new WeakMap, this._idmap = new Map
  }
  add(A, ...Q) {
    let B = Q[0];
    if (this._map.set(A, B), B && typeof B === "object" && "id" in B) {
      if (this._idmap.has(B.id)) throw Error(`ID ${B.id} already exists in the registry`);
      this._idmap.set(B.id, A)
    }
    return this
  }
  remove(A) {
    return this._map.delete(A), this
  }
  get(A) {
    let Q = A._zod.parent;
    if (Q) {
      let B = {
        ...this.get(Q) ?? {}
      };
      return delete B.id, {
        ...B,
        ...this._map.get(A)
      }
    }
    return this._map.get(A)
  }
  has(A) {
    return this._map.has(A)
  }
}
// @from(Ln 156852, Col 0)
function HQ1() {
  return new jRA
}
// @from(Ln 156855, Col 4)
le1
// @from(Ln 156855, Col 9)
ie1
// @from(Ln 156855, Col 14)
Ek
// @from(Ln 156856, Col 4)
ne1 = w(() => {
  le1 = Symbol("ZodOutput"), ie1 = Symbol("ZodInput");
  Ek = HQ1()
})
// @from(Ln 156861, Col 0)
function ae1(A, Q) {
  return new A({
    type: "string",
    ...jB(Q)
  })
}
// @from(Ln 156868, Col 0)
function oe1(A, Q) {
  return new A({
    type: "string",
    coerce: !0,
    ...jB(Q)
  })
}
// @from(Ln 156876, Col 0)
function EQ1(A, Q) {
  return new A({
    type: "string",
    format: "email",
    check: "string_format",
    abort: !1,
    ...jB(Q)
  })
}
// @from(Ln 156886, Col 0)
function TRA(A, Q) {
  return new A({
    type: "string",
    format: "guid",
    check: "string_format",
    abort: !1,
    ...jB(Q)
  })
}
// @from(Ln 156896, Col 0)
function zQ1(A, Q) {
  return new A({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    ...jB(Q)
  })
}
// @from(Ln 156906, Col 0)
function $Q1(A, Q) {
  return new A({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v4",
    ...jB(Q)
  })
}
// @from(Ln 156917, Col 0)
function CQ1(A, Q) {
  return new A({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v6",
    ...jB(Q)
  })
}
// @from(Ln 156928, Col 0)
function UQ1(A, Q) {
  return new A({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v7",
    ...jB(Q)
  })
}
// @from(Ln 156939, Col 0)
function qQ1(A, Q) {
  return new A({
    type: "string",
    format: "url",
    check: "string_format",
    abort: !1,
    ...jB(Q)
  })
}
// @from(Ln 156949, Col 0)
function NQ1(A, Q) {
  return new A({
    type: "string",
    format: "emoji",
    check: "string_format",
    abort: !1,
    ...jB(Q)
  })
}
// @from(Ln 156959, Col 0)
function wQ1(A, Q) {
  return new A({
    type: "string",
    format: "nanoid",
    check: "string_format",
    abort: !1,
    ...jB(Q)
  })
}
// @from(Ln 156969, Col 0)
function LQ1(A, Q) {
  return new A({
    type: "string",
    format: "cuid",
    check: "string_format",
    abort: !1,
    ...jB(Q)
  })
}
// @from(Ln 156979, Col 0)
function OQ1(A, Q) {
  return new A({
    type: "string",
    format: "cuid2",
    check: "string_format",
    abort: !1,
    ...jB(Q)
  })
}
// @from(Ln 156989, Col 0)
function MQ1(A, Q) {
  return new A({
    type: "string",
    format: "ulid",
    check: "string_format",
    abort: !1,
    ...jB(Q)
  })
}
// @from(Ln 156999, Col 0)
function RQ1(A, Q) {
  return new A({
    type: "string",
    format: "xid",
    check: "string_format",
    abort: !1,
    ...jB(Q)
  })
}
// @from(Ln 157009, Col 0)
function _Q1(A, Q) {
  return new A({
    type: "string",
    format: "ksuid",
    check: "string_format",
    abort: !1,
    ...jB(Q)
  })
}
// @from(Ln 157019, Col 0)
function jQ1(A, Q) {
  return new A({
    type: "string",
    format: "ipv4",
    check: "string_format",
    abort: !1,
    ...jB(Q)
  })
}
// @from(Ln 157029, Col 0)
function TQ1(A, Q) {
  return new A({
    type: "string",
    format: "ipv6",
    check: "string_format",
    abort: !1,
    ...jB(Q)
  })
}
// @from(Ln 157039, Col 0)
function PQ1(A, Q) {
  return new A({
    type: "string",
    format: "cidrv4",
    check: "string_format",
    abort: !1,
    ...jB(Q)
  })
}
// @from(Ln 157049, Col 0)
function SQ1(A, Q) {
  return new A({
    type: "string",
    format: "cidrv6",
    check: "string_format",
    abort: !1,
    ...jB(Q)
  })
}
// @from(Ln 157059, Col 0)
function xQ1(A, Q) {
  return new A({
    type: "string",
    format: "base64",
    check: "string_format",
    abort: !1,
    ...jB(Q)
  })
}
// @from(Ln 157069, Col 0)
function yQ1(A, Q) {
  return new A({
    type: "string",
    format: "base64url",
    check: "string_format",
    abort: !1,
    ...jB(Q)
  })
}
// @from(Ln 157079, Col 0)
function vQ1(A, Q) {
  return new A({
    type: "string",
    format: "e164",
    check: "string_format",
    abort: !1,
    ...jB(Q)
  })
}
// @from(Ln 157089, Col 0)
function kQ1(A, Q) {
  return new A({
    type: "string",
    format: "jwt",
    check: "string_format",
    abort: !1,
    ...jB(Q)
  })
}
// @from(Ln 157099, Col 0)
function se1(A, Q) {
  return new A({
    type: "string",
    format: "datetime",
    check: "string_format",
    offset: !1,
    local: !1,
    precision: null,
    ...jB(Q)
  })
}
// @from(Ln 157111, Col 0)
function te1(A, Q) {
  return new A({
    type: "string",
    format: "date",
    check: "string_format",
    ...jB(Q)
  })
}
// @from(Ln 157120, Col 0)
function ee1(A, Q) {
  return new A({
    type: "string",
    format: "time",
    check: "string_format",
    precision: null,
    ...jB(Q)
  })
}
// @from(Ln 157130, Col 0)
function AA0(A, Q) {
  return new A({
    type: "string",
    format: "duration",
    check: "string_format",
    ...jB(Q)
  })
}
// @from(Ln 157139, Col 0)
function QA0(A, Q) {
  return new A({
    type: "number",
    checks: [],
    ...jB(Q)
  })
}
// @from(Ln 157147, Col 0)
function BA0(A, Q) {
  return new A({
    type: "number",
    coerce: !0,
    checks: [],
    ...jB(Q)
  })
}
// @from(Ln 157156, Col 0)
function GA0(A, Q) {
  return new A({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "safeint",
    ...jB(Q)
  })
}
// @from(Ln 157166, Col 0)
function ZA0(A, Q) {
  return new A({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "float32",
    ...jB(Q)
  })
}
// @from(Ln 157176, Col 0)
function YA0(A, Q) {
  return new A({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "float64",
    ...jB(Q)
  })
}
// @from(Ln 157186, Col 0)
function JA0(A, Q) {
  return new A({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "int32",
    ...jB(Q)
  })
}
// @from(Ln 157196, Col 0)
function XA0(A, Q) {
  return new A({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "uint32",
    ...jB(Q)
  })
}
// @from(Ln 157206, Col 0)
function IA0(A, Q) {
  return new A({
    type: "boolean",
    ...jB(Q)
  })
}
// @from(Ln 157213, Col 0)
function DA0(A, Q) {
  return new A({
    type: "boolean",
    coerce: !0,
    ...jB(Q)
  })
}
// @from(Ln 157221, Col 0)
function WA0(A, Q) {
  return new A({
    type: "bigint",
    ...jB(Q)
  })
}
// @from(Ln 157228, Col 0)
function KA0(A, Q) {
  return new A({
    type: "bigint",
    coerce: !0,
    ...jB(Q)
  })
}
// @from(Ln 157236, Col 0)
function VA0(A, Q) {
  return new A({
    type: "bigint",
    check: "bigint_format",
    abort: !1,
    format: "int64",
    ...jB(Q)
  })
}
// @from(Ln 157246, Col 0)
function FA0(A, Q) {
  return new A({
    type: "bigint",
    check: "bigint_format",
    abort: !1,
    format: "uint64",
    ...jB(Q)
  })
}
// @from(Ln 157256, Col 0)
function HA0(A, Q) {
  return new A({
    type: "symbol",
    ...jB(Q)
  })
}
// @from(Ln 157263, Col 0)
function EA0(A, Q) {
  return new A({
    type: "undefined",
    ...jB(Q)
  })
}
// @from(Ln 157270, Col 0)
function zA0(A, Q) {
  return new A({
    type: "null",
    ...jB(Q)
  })
}
// @from(Ln 157277, Col 0)
function $A0(A) {
  return new A({
    type: "any"
  })
}
// @from(Ln 157283, Col 0)
function CIA(A) {
  return new A({
    type: "unknown"
  })
}
// @from(Ln 157289, Col 0)
function CA0(A, Q) {
  return new A({
    type: "never",
    ...jB(Q)
  })
}
// @from(Ln 157296, Col 0)
function UA0(A, Q) {
  return new A({
    type: "void",
    ...jB(Q)
  })
}
// @from(Ln 157303, Col 0)
function qA0(A, Q) {
  return new A({
    type: "date",
    ...jB(Q)
  })
}
// @from(Ln 157310, Col 0)
function NA0(A, Q) {
  return new A({
    type: "date",
    coerce: !0,
    ...jB(Q)
  })
}
// @from(Ln 157318, Col 0)
function wA0(A, Q) {
  return new A({
    type: "nan",
    ...jB(Q)
  })
}
// @from(Ln 157325, Col 0)
function nu(A, Q) {
  return new ZQ1({
    check: "less_than",
    ...jB(Q),
    value: A,
    inclusive: !1
  })
}
// @from(Ln 157334, Col 0)
function lR(A, Q) {
  return new ZQ1({
    check: "less_than",
    ...jB(Q),
    value: A,
    inclusive: !0
  })
}
// @from(Ln 157343, Col 0)
function au(A, Q) {
  return new YQ1({
    check: "greater_than",
    ...jB(Q),
    value: A,
    inclusive: !1
  })
}
// @from(Ln 157352, Col 0)
function sq(A, Q) {
  return new YQ1({
    check: "greater_than",
    ...jB(Q),
    value: A,
    inclusive: !0
  })
}
// @from(Ln 157361, Col 0)
function LA0(A) {
  return au(0, A)
}
// @from(Ln 157365, Col 0)
function OA0(A) {
  return nu(0, A)
}
// @from(Ln 157369, Col 0)
function MA0(A) {
  return lR(0, A)
}
// @from(Ln 157373, Col 0)
function RA0(A) {
  return sq(0, A)
}
// @from(Ln 157377, Col 0)
function $BA(A, Q) {
  return new fs1({
    check: "multiple_of",
    ...jB(Q),
    value: A
  })
}
// @from(Ln 157385, Col 0)
function UIA(A, Q) {
  return new us1({
    check: "max_size",
    ...jB(Q),
    maximum: A
  })
}
// @from(Ln 157393, Col 0)
function CBA(A, Q) {
  return new ms1({
    check: "min_size",
    ...jB(Q),
    minimum: A
  })
}
// @from(Ln 157401, Col 0)
function PRA(A, Q) {
  return new ds1({
    check: "size_equals",
    ...jB(Q),
    size: A
  })
}
// @from(Ln 157409, Col 0)
function qIA(A, Q) {
  return new cs1({
    check: "max_length",
    ...jB(Q),
    maximum: A
  })
}
// @from(Ln 157417, Col 0)
function qa(A, Q) {
  return new ps1({
    check: "min_length",
    ...jB(Q),
    minimum: A
  })
}
// @from(Ln 157425, Col 0)
function NIA(A, Q) {
  return new ls1({
    check: "length_equals",
    ...jB(Q),
    length: A
  })
}
// @from(Ln 157433, Col 0)
function SRA(A, Q) {
  return new is1({
    check: "string_format",
    format: "regex",
    ...jB(Q),
    pattern: A
  })
}
// @from(Ln 157442, Col 0)
function xRA(A) {
  return new ns1({
    check: "string_format",
    format: "lowercase",
    ...jB(A)
  })
}
// @from(Ln 157450, Col 0)
function yRA(A) {
  return new as1({
    check: "string_format",
    format: "uppercase",
    ...jB(A)
  })
}
// @from(Ln 157458, Col 0)
function vRA(A, Q) {
  return new os1({
    check: "string_format",
    format: "includes",
    ...jB(Q),
    includes: A
  })
}
// @from(Ln 157467, Col 0)
function kRA(A, Q) {
  return new rs1({
    check: "string_format",
    format: "starts_with",
    ...jB(Q),
    prefix: A
  })
}
// @from(Ln 157476, Col 0)
function bRA(A, Q) {
  return new ss1({
    check: "string_format",
    format: "ends_with",
    ...jB(Q),
    suffix: A
  })
}
// @from(Ln 157485, Col 0)
function _A0(A, Q, B) {
  return new ts1({
    check: "property",
    property: A,
    schema: Q,
    ...jB(B)
  })
}
// @from(Ln 157494, Col 0)
function fRA(A, Q) {
  return new es1({
    check: "mime_type",
    mime: A,
    ...jB(Q)
  })
}
// @from(Ln 157502, Col 0)
function ou(A) {
  return new At1({
    check: "overwrite",
    tx: A
  })
}
// @from(Ln 157509, Col 0)
function hRA(A) {
  return ou((Q) => Q.normalize(A))
}
// @from(Ln 157513, Col 0)
function gRA() {
  return ou((A) => A.trim())
}
// @from(Ln 157517, Col 0)
function uRA() {
  return ou((A) => A.toLowerCase())
}
// @from(Ln 157521, Col 0)
function mRA() {
  return ou((A) => A.toUpperCase())
}
// @from(Ln 157525, Col 0)
function dRA(A, Q, B) {
  return new A({
    type: "array",
    element: Q,
    ...jB(B)
  })
}
// @from(Ln 157533, Col 0)
function SY8(A, Q, B) {
  return new A({
    type: "union",
    options: Q,
    ...jB(B)
  })
}
// @from(Ln 157541, Col 0)
function xY8(A, Q, B, G) {
  return new A({
    type: "union",
    options: B,
    discriminator: Q,
    ...jB(G)
  })
}
// @from(Ln 157550, Col 0)
function yY8(A, Q, B) {
  return new A({
    type: "intersection",
    left: Q,
    right: B
  })
}
// @from(Ln 157558, Col 0)
function jA0(A, Q, B, G) {
  let Z = B instanceof v6;
  return new A({
    type: "tuple",
    items: Q,
    rest: Z ? B : null,
    ...jB(Z ? G : B)
  })
}
// @from(Ln 157568, Col 0)
function vY8(A, Q, B, G) {
  return new A({
    type: "record",
    keyType: Q,
    valueType: B,
    ...jB(G)
  })
}
// @from(Ln 157577, Col 0)
function kY8(A, Q, B, G) {
  return new A({
    type: "map",
    keyType: Q,
    valueType: B,
    ...jB(G)
  })
}
// @from(Ln 157586, Col 0)
function bY8(A, Q, B) {
  return new A({
    type: "set",
    valueType: Q,
    ...jB(B)
  })
}
// @from(Ln 157594, Col 0)
function fY8(A, Q, B) {
  let G = Array.isArray(Q) ? Object.fromEntries(Q.map((Z) => [Z, Z])) : Q;
  return new A({
    type: "enum",
    entries: G,
    ...jB(B)
  })
}
// @from(Ln 157603, Col 0)
function hY8(A, Q, B) {
  return new A({
    type: "enum",
    entries: Q,
    ...jB(B)
  })
}
// @from(Ln 157611, Col 0)
function gY8(A, Q, B) {
  return new A({
    type: "literal",
    values: Array.isArray(Q) ? Q : [Q],
    ...jB(B)
  })
}
// @from(Ln 157619, Col 0)
function TA0(A, Q) {
  return new A({
    type: "file",
    ...jB(Q)
  })
}
// @from(Ln 157626, Col 0)
function uY8(A, Q) {
  return new A({
    type: "transform",
    transform: Q
  })
}
// @from(Ln 157633, Col 0)
function mY8(A, Q) {
  return new A({
    type: "optional",
    innerType: Q
  })
}
// @from(Ln 157640, Col 0)
function dY8(A, Q) {
  return new A({
    type: "nullable",
    innerType: Q
  })
}
// @from(Ln 157647, Col 0)
function cY8(A, Q, B) {
  return new A({
    type: "default",
    innerType: Q,
    get defaultValue() {
      return typeof B === "function" ? B() : B
    }
  })
}
// @from(Ln 157657, Col 0)
function pY8(A, Q, B) {
  return new A({
    type: "nonoptional",
    innerType: Q,
    ...jB(B)
  })
}
// @from(Ln 157665, Col 0)
function lY8(A, Q) {
  return new A({
    type: "success",
    innerType: Q
  })
}
// @from(Ln 157672, Col 0)
function iY8(A, Q, B) {
  return new A({
    type: "catch",
    innerType: Q,
    catchValue: typeof B === "function" ? B : () => B
  })
}
// @from(Ln 157680, Col 0)
function nY8(A, Q, B) {
  return new A({
    type: "pipe",
    in: Q,
    out: B
  })
}
// @from(Ln 157688, Col 0)
function aY8(A, Q) {
  return new A({
    type: "readonly",
    innerType: Q
  })
}
// @from(Ln 157695, Col 0)
function oY8(A, Q, B) {
  return new A({
    type: "template_literal",
    parts: Q,
    ...jB(B)
  })
}
// @from(Ln 157703, Col 0)
function rY8(A, Q) {
  return new A({
    type: "lazy",
    getter: Q
  })
}
// @from(Ln 157710, Col 0)
function sY8(A, Q) {
  return new A({
    type: "promise",
    innerType: Q
  })
}
// @from(Ln 157717, Col 0)
function PA0(A, Q, B) {
  let G = jB(B);
  return G.abort ?? (G.abort = !0), new A({
    type: "custom",
    check: "custom",
    fn: Q,
    ...G
  })
}
// @from(Ln 157727, Col 0)
function SA0(A, Q, B) {
  return new A({
    type: "custom",
    check: "custom",
    fn: Q,
    ...jB(B)
  })
}
// @from(Ln 157736, Col 0)
function xA0(A, Q) {
  let B = jB(Q),
    G = B.truthy ?? ["true", "1", "yes", "on", "y", "enabled"],
    Z = B.falsy ?? ["false", "0", "no", "off", "n", "disabled"];
  if (B.case !== "sensitive") G = G.map((H) => typeof H === "string" ? H.toLowerCase() : H), Z = Z.map((H) => typeof H === "string" ? H.toLowerCase() : H);
  let Y = new Set(G),
    J = new Set(Z),
    X = A.Pipe ?? MRA,
    I = A.Boolean ?? wRA,
    D = A.String ?? EBA,
    K = new(A.Transform ?? ORA)({
      type: "transform",
      transform: (H, E) => {
        let z = H;
        if (B.case !== "sensitive") z = z.toLowerCase();
        if (Y.has(z)) return !0;
        else if (J.has(z)) return !1;
        else return E.issues.push({
          code: "invalid_value",
          expected: "stringbool",
          values: [...Y, ...J],
          input: E.value,
          inst: K
        }), {}
      },
      error: B.error
    }),
    V = new X({
      type: "pipe",
      in: new D({
        type: "string",
        error: B.error
      }),
      out: K,
      error: B.error
    });
  return new X({
    type: "pipe",
    in: V,
    out: new I({
      type: "boolean",
      error: B.error
    }),
    error: B.error
  })
}
// @from(Ln 157783, Col 0)
function yA0(A, Q, B, G = {}) {
  let Z = jB(G),
    Y = {
      ...jB(G),
      check: "string_format",
      type: "string",
      format: Q,
      fn: typeof B === "function" ? B : (X) => B.test(X),
      ...Z
    };
  if (B instanceof RegExp) Y.pattern = B;
  return new A(Y)
}
// @from(Ln 157796, Col 4)
re1
// @from(Ln 157797, Col 4)
vA0 = w(() => {
  JQ1();
  RRA();
  W6();
  re1 = {
    Any: null,
    Minute: -1,
    Second: 0,
    Millisecond: 3,
    Microsecond: 6
  }
})
// @from(Ln 157809, Col 0)
class kA0 {
  constructor(A) {
    this._def = A, this.def = A
  }
  implement(A) {
    if (typeof A !== "function") throw Error("implement() must be called with a function");
    let Q = (...B) => {
      let G = this._def.input ? URA(this._def.input, B, void 0, {
        callee: Q
      }) : B;
      if (!Array.isArray(G)) throw Error("Invalid arguments schema: not an array or tuple schema.");
      let Z = A(...G);
      return this._def.output ? URA(this._def.output, Z, void 0, {
        callee: Q
      }) : Z
    };
    return Q
  }
  implementAsync(A) {
    if (typeof A !== "function") throw Error("implement() must be called with a function");
    let Q = async (...B) => {
      let G = this._def.input ? await qRA(this._def.input, B, void 0, {
        callee: Q
      }) : B;
      if (!Array.isArray(G)) throw Error("Invalid arguments schema: not an array or tuple schema.");
      let Z = await A(...G);
      return this._def.output ? qRA(this._def.output, Z, void 0, {
        callee: Q
      }) : Z
    };
    return Q
  }
  input(...A) {
    let Q = this.constructor;
    if (Array.isArray(A[0])) return new Q({
      type: "function",
      input: new zBA({
        type: "tuple",
        items: A[0],
        rest: A[1]
      }),
      output: this._def.output
    });
    return new Q({
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
// @from(Ln 157867, Col 0)
function bA0(A) {
  return new kA0({
    type: "function",
    input: Array.isArray(A?.input) ? jA0(zBA, A?.input) : A?.input ?? dRA(LRA, CIA(zIA)),
    output: A?.output ?? CIA(zIA)
  })
}
// @from(Ln 157874, Col 4)
pzB = w(() => {
  vA0();
  QQ1();
  RRA();
  RRA()
})