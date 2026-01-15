
// @from(Ln 341410, Col 4)
uW1 = U((Zc5) => {
  var AU0 = ME(),
    Kf2 = hHA(),
    Ac5 = hW1(),
    bO = BD(),
    Vf2 = tC0(),
    Qc5 = eC0(),
    Sc = Zc5.elements = {},
    PbA = Object.create(null);
  Zc5.createElement = function (A, Q, B) {
    var G = PbA[Q] || Gc5;
    return new G(A, Q, B)
  };

  function w2(A) {
    return Qc5(A, g9, Sc, PbA)
  }

  function GD(A) {
    return {
      get: function () {
        var Q = this._getattr(A);
        if (Q === null) return "";
        var B = this.doc._resolve(Q);
        return B === null ? Q : B
      },
      set: function (Q) {
        this._setattr(A, Q)
      }
    }
  }

  function gW1(A) {
    return {
      get: function () {
        var Q = this._getattr(A);
        if (Q === null) return null;
        if (Q.toLowerCase() === "use-credentials") return "use-credentials";
        return "anonymous"
      },
      set: function (Q) {
        if (Q === null || Q === void 0) this.removeAttribute(A);
        else this._setattr(A, Q)
      }
    }
  }
  var uHA = {
      type: ["", "no-referrer", "no-referrer-when-downgrade", "same-origin", "origin", "strict-origin", "origin-when-cross-origin", "strict-origin-when-cross-origin", "unsafe-url"],
      missing: ""
    },
    Bc5 = {
      A: !0,
      LINK: !0,
      BUTTON: !0,
      INPUT: !0,
      SELECT: !0,
      TEXTAREA: !0,
      COMMAND: !0
    },
    Wx = function (A, Q, B) {
      g9.call(this, A, Q, B), this._form = null
    },
    g9 = Zc5.HTMLElement = w2({
      superclass: Kf2,
      name: "HTMLElement",
      ctor: function (Q, B, G) {
        Kf2.call(this, Q, B, bO.NAMESPACE.HTML, G)
      },
      props: {
        dangerouslySetInnerHTML: {
          set: function (A) {
            this._innerHTML = A
          }
        },
        innerHTML: {
          get: function () {
            return this.serialize()
          },
          set: function (A) {
            var Q = this.ownerDocument.implementation.mozHTMLParser(this.ownerDocument._address, this);
            Q.parse(A === null ? "" : String(A), !0);
            var B = this instanceof PbA.template ? this.content : this;
            while (B.hasChildNodes()) B.removeChild(B.firstChild);
            B.appendChild(Q._asDocumentFragment())
          }
        },
        style: {
          get: function () {
            if (!this._style) this._style = new Ac5(this);
            return this._style
          },
          set: function (A) {
            if (A === null || A === void 0) A = "";
            this._setattr("style", String(A))
          }
        },
        blur: {
          value: function () {}
        },
        focus: {
          value: function () {}
        },
        forceSpellCheck: {
          value: function () {}
        },
        click: {
          value: function () {
            if (this._click_in_progress) return;
            this._click_in_progress = !0;
            try {
              if (this._pre_click_activation_steps) this._pre_click_activation_steps();
              var A = this.ownerDocument.createEvent("MouseEvent");
              A.initMouseEvent("click", !0, !0, this.ownerDocument.defaultView, 1, 0, 0, 0, 0, !1, !1, !1, !1, 0, null);
              var Q = this.dispatchEvent(A);
              if (Q) {
                if (this._post_click_activation_steps) this._post_click_activation_steps(A)
              } else if (this._cancelled_activation_steps) this._cancelled_activation_steps()
            } finally {
              this._click_in_progress = !1
            }
          }
        },
        submit: {
          value: bO.nyi
        }
      },
      attributes: {
        title: String,
        lang: String,
        dir: {
          type: ["ltr", "rtl", "auto"],
          missing: ""
        },
        draggable: {
          type: ["true", "false"],
          treatNullAsEmptyString: !0
        },
        spellcheck: {
          type: ["true", "false"],
          missing: ""
        },
        enterKeyHint: {
          type: ["enter", "done", "go", "next", "previous", "search", "send"],
          missing: ""
        },
        autoCapitalize: {
          type: ["off", "on", "none", "sentences", "words", "characters"],
          missing: ""
        },
        autoFocus: Boolean,
        accessKey: String,
        nonce: String,
        hidden: Boolean,
        translate: {
          type: ["no", "yes"],
          missing: ""
        },
        tabIndex: {
          type: "long",
          default: function () {
            if (this.tagName in Bc5 || this.contentEditable) return 0;
            else return -1
          }
        }
      },
      events: ["abort", "canplay", "canplaythrough", "change", "click", "contextmenu", "cuechange", "dblclick", "drag", "dragend", "dragenter", "dragleave", "dragover", "dragstart", "drop", "durationchange", "emptied", "ended", "input", "invalid", "keydown", "keypress", "keyup", "loadeddata", "loadedmetadata", "loadstart", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "mousewheel", "pause", "play", "playing", "progress", "ratechange", "readystatechange", "reset", "seeked", "seeking", "select", "show", "stalled", "submit", "suspend", "timeupdate", "volumechange", "waiting", "blur", "error", "focus", "load", "scroll"]
    }),
    Gc5 = w2({
      name: "HTMLUnknownElement",
      ctor: function (Q, B, G) {
        g9.call(this, Q, B, G)
      }
    }),
    Kx = {
      form: {
        get: function () {
          return this._form
        }
      }
    };
  w2({
    tag: "a",
    name: "HTMLAnchorElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    props: {
      _post_click_activation_steps: {
        value: function (A) {
          if (this.href) this.ownerDocument.defaultView.location = this.href
        }
      }
    },
    attributes: {
      href: GD,
      ping: String,
      download: String,
      target: String,
      rel: String,
      media: String,
      hreflang: String,
      type: String,
      referrerPolicy: uHA,
      coords: String,
      charset: String,
      name: String,
      rev: String,
      shape: String
    }
  });
  Vf2._inherit(PbA.a.prototype);
  w2({
    tag: "area",
    name: "HTMLAreaElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    attributes: {
      alt: String,
      target: String,
      download: String,
      rel: String,
      media: String,
      href: GD,
      hreflang: String,
      type: String,
      shape: String,
      coords: String,
      ping: String,
      referrerPolicy: uHA,
      noHref: Boolean
    }
  });
  Vf2._inherit(PbA.area.prototype);
  w2({
    tag: "br",
    name: "HTMLBRElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    attributes: {
      clear: String
    }
  });
  w2({
    tag: "base",
    name: "HTMLBaseElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    attributes: {
      target: String
    }
  });
  w2({
    tag: "body",
    name: "HTMLBodyElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    events: ["afterprint", "beforeprint", "beforeunload", "blur", "error", "focus", "hashchange", "load", "message", "offline", "online", "pagehide", "pageshow", "popstate", "resize", "scroll", "storage", "unload"],
    attributes: {
      text: {
        type: String,
        treatNullAsEmptyString: !0
      },
      link: {
        type: String,
        treatNullAsEmptyString: !0
      },
      vLink: {
        type: String,
        treatNullAsEmptyString: !0
      },
      aLink: {
        type: String,
        treatNullAsEmptyString: !0
      },
      bgColor: {
        type: String,
        treatNullAsEmptyString: !0
      },
      background: String
    }
  });
  w2({
    tag: "button",
    name: "HTMLButtonElement",
    ctor: function (Q, B, G) {
      Wx.call(this, Q, B, G)
    },
    props: Kx,
    attributes: {
      name: String,
      value: String,
      disabled: Boolean,
      autofocus: Boolean,
      type: {
        type: ["submit", "reset", "button", "menu"],
        missing: "submit"
      },
      formTarget: String,
      formAction: GD,
      formNoValidate: Boolean,
      formMethod: {
        type: ["get", "post", "dialog"],
        invalid: "get",
        missing: ""
      },
      formEnctype: {
        type: ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"],
        invalid: "application/x-www-form-urlencoded",
        missing: ""
      }
    }
  });
  w2({
    tag: "dl",
    name: "HTMLDListElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    attributes: {
      compact: Boolean
    }
  });
  w2({
    tag: "data",
    name: "HTMLDataElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    attributes: {
      value: String
    }
  });
  w2({
    tag: "datalist",
    name: "HTMLDataListElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    }
  });
  w2({
    tag: "details",
    name: "HTMLDetailsElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    attributes: {
      open: Boolean
    }
  });
  w2({
    tag: "div",
    name: "HTMLDivElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    attributes: {
      align: String
    }
  });
  w2({
    tag: "embed",
    name: "HTMLEmbedElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    attributes: {
      src: GD,
      type: String,
      width: String,
      height: String,
      align: String,
      name: String
    }
  });
  w2({
    tag: "fieldset",
    name: "HTMLFieldSetElement",
    ctor: function (Q, B, G) {
      Wx.call(this, Q, B, G)
    },
    props: Kx,
    attributes: {
      disabled: Boolean,
      name: String
    }
  });
  w2({
    tag: "form",
    name: "HTMLFormElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    attributes: {
      action: String,
      autocomplete: {
        type: ["on", "off"],
        missing: "on"
      },
      name: String,
      acceptCharset: {
        name: "accept-charset"
      },
      target: String,
      noValidate: Boolean,
      method: {
        type: ["get", "post", "dialog"],
        invalid: "get",
        missing: "get"
      },
      enctype: {
        type: ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"],
        invalid: "application/x-www-form-urlencoded",
        missing: "application/x-www-form-urlencoded"
      },
      encoding: {
        name: "enctype",
        type: ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"],
        invalid: "application/x-www-form-urlencoded",
        missing: "application/x-www-form-urlencoded"
      }
    }
  });
  w2({
    tag: "hr",
    name: "HTMLHRElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    attributes: {
      align: String,
      color: String,
      noShade: Boolean,
      size: String,
      width: String
    }
  });
  w2({
    tag: "head",
    name: "HTMLHeadElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    }
  });
  w2({
    tags: ["h1", "h2", "h3", "h4", "h5", "h6"],
    name: "HTMLHeadingElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    attributes: {
      align: String
    }
  });
  w2({
    tag: "html",
    name: "HTMLHtmlElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    attributes: {
      xmlns: GD,
      version: String
    }
  });
  w2({
    tag: "iframe",
    name: "HTMLIFrameElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    attributes: {
      src: GD,
      srcdoc: String,
      name: String,
      width: String,
      height: String,
      seamless: Boolean,
      allow: Boolean,
      allowFullscreen: Boolean,
      allowUserMedia: Boolean,
      allowPaymentRequest: Boolean,
      referrerPolicy: uHA,
      loading: {
        type: ["eager", "lazy"],
        treatNullAsEmptyString: !0
      },
      align: String,
      scrolling: String,
      frameBorder: String,
      longDesc: GD,
      marginHeight: {
        type: String,
        treatNullAsEmptyString: !0
      },
      marginWidth: {
        type: String,
        treatNullAsEmptyString: !0
      }
    }
  });
  w2({
    tag: "img",
    name: "HTMLImageElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    attributes: {
      alt: String,
      src: GD,
      srcset: String,
      crossOrigin: gW1,
      useMap: String,
      isMap: Boolean,
      sizes: String,
      height: {
        type: "unsigned long",
        default: 0
      },
      width: {
        type: "unsigned long",
        default: 0
      },
      referrerPolicy: uHA,
      loading: {
        type: ["eager", "lazy"],
        missing: ""
      },
      name: String,
      lowsrc: GD,
      align: String,
      hspace: {
        type: "unsigned long",
        default: 0
      },
      vspace: {
        type: "unsigned long",
        default: 0
      },
      longDesc: GD,
      border: {
        type: String,
        treatNullAsEmptyString: !0
      }
    }
  });
  w2({
    tag: "input",
    name: "HTMLInputElement",
    ctor: function (Q, B, G) {
      Wx.call(this, Q, B, G)
    },
    props: {
      form: Kx.form,
      _post_click_activation_steps: {
        value: function (A) {
          if (this.type === "checkbox") this.checked = !this.checked;
          else if (this.type === "radio") {
            var Q = this.form.getElementsByName(this.name);
            for (var B = Q.length - 1; B >= 0; B--) {
              var G = Q[B];
              G.checked = G === this
            }
          }
        }
      }
    },
    attributes: {
      name: String,
      disabled: Boolean,
      autofocus: Boolean,
      accept: String,
      alt: String,
      max: String,
      min: String,
      pattern: String,
      placeholder: String,
      step: String,
      dirName: String,
      defaultValue: {
        name: "value"
      },
      multiple: Boolean,
      required: Boolean,
      readOnly: Boolean,
      checked: Boolean,
      value: String,
      src: GD,
      defaultChecked: {
        name: "checked",
        type: Boolean
      },
      size: {
        type: "unsigned long",
        default: 20,
        min: 1,
        setmin: 1
      },
      width: {
        type: "unsigned long",
        min: 0,
        setmin: 0,
        default: 0
      },
      height: {
        type: "unsigned long",
        min: 0,
        setmin: 0,
        default: 0
      },
      minLength: {
        type: "unsigned long",
        min: 0,
        setmin: 0,
        default: -1
      },
      maxLength: {
        type: "unsigned long",
        min: 0,
        setmin: 0,
        default: -1
      },
      autocomplete: String,
      type: {
        type: ["text", "hidden", "search", "tel", "url", "email", "password", "datetime", "date", "month", "week", "time", "datetime-local", "number", "range", "color", "checkbox", "radio", "file", "submit", "image", "reset", "button"],
        missing: "text"
      },
      formTarget: String,
      formNoValidate: Boolean,
      formMethod: {
        type: ["get", "post"],
        invalid: "get",
        missing: ""
      },
      formEnctype: {
        type: ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"],
        invalid: "application/x-www-form-urlencoded",
        missing: ""
      },
      inputMode: {
        type: ["verbatim", "latin", "latin-name", "latin-prose", "full-width-latin", "kana", "kana-name", "katakana", "numeric", "tel", "email", "url"],
        missing: ""
      },
      align: String,
      useMap: String
    }
  });
  w2({
    tag: "keygen",
    name: "HTMLKeygenElement",
    ctor: function (Q, B, G) {
      Wx.call(this, Q, B, G)
    },
    props: Kx,
    attributes: {
      name: String,
      disabled: Boolean,
      autofocus: Boolean,
      challenge: String,
      keytype: {
        type: ["rsa"],
        missing: ""
      }
    }
  });
  w2({
    tag: "li",
    name: "HTMLLIElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    attributes: {
      value: {
        type: "long",
        default: 0
      },
      type: String
    }
  });
  w2({
    tag: "label",
    name: "HTMLLabelElement",
    ctor: function (Q, B, G) {
      Wx.call(this, Q, B, G)
    },
    props: Kx,
    attributes: {
      htmlFor: {
        name: "for",
        type: String
      }
    }
  });
  w2({
    tag: "legend",
    name: "HTMLLegendElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    attributes: {
      align: String
    }
  });
  w2({
    tag: "link",
    name: "HTMLLinkElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    attributes: {
      href: GD,
      rel: String,
      media: String,
      hreflang: String,
      type: String,
      crossOrigin: gW1,
      nonce: String,
      integrity: String,
      referrerPolicy: uHA,
      imageSizes: String,
      imageSrcset: String,
      charset: String,
      rev: String,
      target: String
    }
  });
  w2({
    tag: "map",
    name: "HTMLMapElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    attributes: {
      name: String
    }
  });
  w2({
    tag: "menu",
    name: "HTMLMenuElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    attributes: {
      type: {
        type: ["context", "popup", "toolbar"],
        missing: "toolbar"
      },
      label: String,
      compact: Boolean
    }
  });
  w2({
    tag: "meta",
    name: "HTMLMetaElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    attributes: {
      name: String,
      content: String,
      httpEquiv: {
        name: "http-equiv",
        type: String
      },
      scheme: String
    }
  });
  w2({
    tag: "meter",
    name: "HTMLMeterElement",
    ctor: function (Q, B, G) {
      Wx.call(this, Q, B, G)
    },
    props: Kx
  });
  w2({
    tags: ["ins", "del"],
    name: "HTMLModElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    attributes: {
      cite: GD,
      dateTime: String
    }
  });
  w2({
    tag: "ol",
    name: "HTMLOListElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    props: {
      _numitems: {
        get: function () {
          var A = 0;
          return this.childNodes.forEach(function (Q) {
            if (Q.nodeType === AU0.ELEMENT_NODE && Q.tagName === "LI") A++
          }), A
        }
      }
    },
    attributes: {
      type: String,
      reversed: Boolean,
      start: {
        type: "long",
        default: function () {
          if (this.reversed) return this._numitems;
          else return 1
        }
      },
      compact: Boolean
    }
  });
  w2({
    tag: "object",
    name: "HTMLObjectElement",
    ctor: function (Q, B, G) {
      Wx.call(this, Q, B, G)
    },
    props: Kx,
    attributes: {
      data: GD,
      type: String,
      name: String,
      useMap: String,
      typeMustMatch: Boolean,
      width: String,
      height: String,
      align: String,
      archive: String,
      code: String,
      declare: Boolean,
      hspace: {
        type: "unsigned long",
        default: 0
      },
      standby: String,
      vspace: {
        type: "unsigned long",
        default: 0
      },
      codeBase: GD,
      codeType: String,
      border: {
        type: String,
        treatNullAsEmptyString: !0
      }
    }
  });
  w2({
    tag: "optgroup",
    name: "HTMLOptGroupElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    attributes: {
      disabled: Boolean,
      label: String
    }
  });
  w2({
    tag: "option",
    name: "HTMLOptionElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    props: {
      form: {
        get: function () {
          var A = this.parentNode;
          while (A && A.nodeType === AU0.ELEMENT_NODE) {
            if (A.localName === "select") return A.form;
            A = A.parentNode
          }
        }
      },
      value: {
        get: function () {
          return this._getattr("value") || this.text
        },
        set: function (A) {
          this._setattr("value", A)
        }
      },
      text: {
        get: function () {
          return this.textContent.replace(/[ \t\n\f\r]+/g, " ").trim()
        },
        set: function (A) {
          this.textContent = A
        }
      }
    },
    attributes: {
      disabled: Boolean,
      defaultSelected: {
        name: "selected",
        type: Boolean
      },
      label: String
    }
  });
  w2({
    tag: "output",
    name: "HTMLOutputElement",
    ctor: function (Q, B, G) {
      Wx.call(this, Q, B, G)
    },
    props: Kx,
    attributes: {
      name: String
    }
  });
  w2({
    tag: "p",
    name: "HTMLParagraphElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    attributes: {
      align: String
    }
  });
  w2({
    tag: "param",
    name: "HTMLParamElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    attributes: {
      name: String,
      value: String,
      type: String,
      valueType: String
    }
  });
  w2({
    tags: ["pre", "listing", "xmp"],
    name: "HTMLPreElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    attributes: {
      width: {
        type: "long",
        default: 0
      }
    }
  });
  w2({
    tag: "progress",
    name: "HTMLProgressElement",
    ctor: function (Q, B, G) {
      Wx.call(this, Q, B, G)
    },
    props: Kx,
    attributes: {
      max: {
        type: Number,
        float: !0,
        default: 1,
        min: 0
      }
    }
  });
  w2({
    tags: ["q", "blockquote"],
    name: "HTMLQuoteElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    attributes: {
      cite: GD
    }
  });
  w2({
    tag: "script",
    name: "HTMLScriptElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    props: {
      text: {
        get: function () {
          var A = "";
          for (var Q = 0, B = this.childNodes.length; Q < B; Q++) {
            var G = this.childNodes[Q];
            if (G.nodeType === AU0.TEXT_NODE) A += G._data
          }
          return A
        },
        set: function (A) {
          if (this.removeChildren(), A !== null && A !== "") this.appendChild(this.ownerDocument.createTextNode(A))
        }
      }
    },
    attributes: {
      src: GD,
      type: String,
      charset: String,
      referrerPolicy: uHA,
      defer: Boolean,
      async: Boolean,
      nomodule: Boolean,
      crossOrigin: gW1,
      nonce: String,
      integrity: String
    }
  });
  w2({
    tag: "select",
    name: "HTMLSelectElement",
    ctor: function (Q, B, G) {
      Wx.call(this, Q, B, G)
    },
    props: {
      form: Kx.form,
      options: {
        get: function () {
          return this.getElementsByTagName("option")
        }
      }
    },
    attributes: {
      autocomplete: String,
      name: String,
      disabled: Boolean,
      autofocus: Boolean,
      multiple: Boolean,
      required: Boolean,
      size: {
        type: "unsigned long",
        default: 0
      }
    }
  });
  w2({
    tag: "span",
    name: "HTMLSpanElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    }
  });
  w2({
    tag: "style",
    name: "HTMLStyleElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    attributes: {
      media: String,
      type: String,
      scoped: Boolean
    }
  });
  w2({
    tag: "caption",
    name: "HTMLTableCaptionElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    attributes: {
      align: String
    }
  });
  w2({
    name: "HTMLTableCellElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    attributes: {
      colSpan: {
        type: "unsigned long",
        default: 1
      },
      rowSpan: {
        type: "unsigned long",
        default: 1
      },
      scope: {
        type: ["row", "col", "rowgroup", "colgroup"],
        missing: ""
      },
      abbr: String,
      align: String,
      axis: String,
      height: String,
      width: String,
      ch: {
        name: "char",
        type: String
      },
      chOff: {
        name: "charoff",
        type: String
      },
      noWrap: Boolean,
      vAlign: String,
      bgColor: {
        type: String,
        treatNullAsEmptyString: !0
      }
    }
  });
  w2({
    tags: ["col", "colgroup"],
    name: "HTMLTableColElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    attributes: {
      span: {
        type: "limited unsigned long with fallback",
        default: 1,
        min: 1
      },
      align: String,
      ch: {
        name: "char",
        type: String
      },
      chOff: {
        name: "charoff",
        type: String
      },
      vAlign: String,
      width: String
    }
  });
  w2({
    tag: "table",
    name: "HTMLTableElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    props: {
      rows: {
        get: function () {
          return this.getElementsByTagName("tr")
        }
      }
    },
    attributes: {
      align: String,
      border: String,
      frame: String,
      rules: String,
      summary: String,
      width: String,
      bgColor: {
        type: String,
        treatNullAsEmptyString: !0
      },
      cellPadding: {
        type: String,
        treatNullAsEmptyString: !0
      },
      cellSpacing: {
        type: String,
        treatNullAsEmptyString: !0
      }
    }
  });
  w2({
    tag: "template",
    name: "HTMLTemplateElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G), this._contentFragment = Q._templateDoc.createDocumentFragment()
    },
    props: {
      content: {
        get: function () {
          return this._contentFragment
        }
      },
      serialize: {
        value: function () {
          return this.content.serialize()
        }
      }
    }
  });
  w2({
    tag: "tr",
    name: "HTMLTableRowElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    props: {
      cells: {
        get: function () {
          return this.querySelectorAll("td,th")
        }
      }
    },
    attributes: {
      align: String,
      ch: {
        name: "char",
        type: String
      },
      chOff: {
        name: "charoff",
        type: String
      },
      vAlign: String,
      bgColor: {
        type: String,
        treatNullAsEmptyString: !0
      }
    }
  });
  w2({
    tags: ["thead", "tfoot", "tbody"],
    name: "HTMLTableSectionElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    props: {
      rows: {
        get: function () {
          return this.getElementsByTagName("tr")
        }
      }
    },
    attributes: {
      align: String,
      ch: {
        name: "char",
        type: String
      },
      chOff: {
        name: "charoff",
        type: String
      },
      vAlign: String
    }
  });
  w2({
    tag: "textarea",
    name: "HTMLTextAreaElement",
    ctor: function (Q, B, G) {
      Wx.call(this, Q, B, G)
    },
    props: {
      form: Kx.form,
      type: {
        get: function () {
          return "textarea"
        }
      },
      defaultValue: {
        get: function () {
          return this.textContent
        },
        set: function (A) {
          this.textContent = A
        }
      },
      value: {
        get: function () {
          return this.defaultValue
        },
        set: function (A) {
          this.defaultValue = A
        }
      },
      textLength: {
        get: function () {
          return this.value.length
        }
      }
    },
    attributes: {
      autocomplete: String,
      name: String,
      disabled: Boolean,
      autofocus: Boolean,
      placeholder: String,
      wrap: String,
      dirName: String,
      required: Boolean,
      readOnly: Boolean,
      rows: {
        type: "limited unsigned long with fallback",
        default: 2
      },
      cols: {
        type: "limited unsigned long with fallback",
        default: 20
      },
      maxLength: {
        type: "unsigned long",
        min: 0,
        setmin: 0,
        default: -1
      },
      minLength: {
        type: "unsigned long",
        min: 0,
        setmin: 0,
        default: -1
      },
      inputMode: {
        type: ["verbatim", "latin", "latin-name", "latin-prose", "full-width-latin", "kana", "kana-name", "katakana", "numeric", "tel", "email", "url"],
        missing: ""
      }
    }
  });
  w2({
    tag: "time",
    name: "HTMLTimeElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    attributes: {
      dateTime: String,
      pubDate: Boolean
    }
  });
  w2({
    tag: "title",
    name: "HTMLTitleElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    props: {
      text: {
        get: function () {
          return this.textContent
        }
      }
    }
  });
  w2({
    tag: "ul",
    name: "HTMLUListElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    attributes: {
      type: String,
      compact: Boolean
    }
  });
  w2({
    name: "HTMLMediaElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    attributes: {
      src: GD,
      crossOrigin: gW1,
      preload: {
        type: ["metadata", "none", "auto", {
          value: "",
          alias: "auto"
        }],
        missing: "auto"
      },
      loop: Boolean,
      autoplay: Boolean,
      mediaGroup: String,
      controls: Boolean,
      defaultMuted: {
        name: "muted",
        type: Boolean
      }
    }
  });
  w2({
    name: "HTMLAudioElement",
    tag: "audio",
    superclass: Sc.HTMLMediaElement,
    ctor: function (Q, B, G) {
      Sc.HTMLMediaElement.call(this, Q, B, G)
    }
  });
  w2({
    name: "HTMLVideoElement",
    tag: "video",
    superclass: Sc.HTMLMediaElement,
    ctor: function (Q, B, G) {
      Sc.HTMLMediaElement.call(this, Q, B, G)
    },
    attributes: {
      poster: GD,
      width: {
        type: "unsigned long",
        min: 0,
        default: 0
      },
      height: {
        type: "unsigned long",
        min: 0,
        default: 0
      }
    }
  });
  w2({
    tag: "td",
    name: "HTMLTableDataCellElement",
    superclass: Sc.HTMLTableCellElement,
    ctor: function (Q, B, G) {
      Sc.HTMLTableCellElement.call(this, Q, B, G)
    }
  });
  w2({
    tag: "th",
    name: "HTMLTableHeaderCellElement",
    superclass: Sc.HTMLTableCellElement,
    ctor: function (Q, B, G) {
      Sc.HTMLTableCellElement.call(this, Q, B, G)
    }
  });
  w2({
    tag: "frameset",
    name: "HTMLFrameSetElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    }
  });
  w2({
    tag: "frame",
    name: "HTMLFrameElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    }
  });
  w2({
    tag: "canvas",
    name: "HTMLCanvasElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    props: {
      getContext: {
        value: bO.nyi
      },
      probablySupportsContext: {
        value: bO.nyi
      },
      setContext: {
        value: bO.nyi
      },
      transferControlToProxy: {
        value: bO.nyi
      },
      toDataURL: {
        value: bO.nyi
      },
      toBlob: {
        value: bO.nyi
      }
    },
    attributes: {
      width: {
        type: "unsigned long",
        default: 300
      },
      height: {
        type: "unsigned long",
        default: 150
      }
    }
  });
  w2({
    tag: "dialog",
    name: "HTMLDialogElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    props: {
      show: {
        value: bO.nyi
      },
      showModal: {
        value: bO.nyi
      },
      close: {
        value: bO.nyi
      }
    },
    attributes: {
      open: Boolean,
      returnValue: String
    }
  });
  w2({
    tag: "menuitem",
    name: "HTMLMenuItemElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    props: {
      _label: {
        get: function () {
          var A = this._getattr("label");
          if (A !== null && A !== "") return A;
          return A = this.textContent, A.replace(/[ \t\n\f\r]+/g, " ").trim()
        }
      },
      label: {
        get: function () {
          var A = this._getattr("label");
          if (A !== null) return A;
          return this._label
        },
        set: function (A) {
          this._setattr("label", A)
        }
      }
    },
    attributes: {
      type: {
        type: ["command", "checkbox", "radio"],
        missing: "command"
      },
      icon: GD,
      disabled: Boolean,
      checked: Boolean,
      radiogroup: String,
      default: Boolean
    }
  });
  w2({
    tag: "source",
    name: "HTMLSourceElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    attributes: {
      srcset: String,
      sizes: String,
      media: String,
      src: GD,
      type: String,
      width: String,
      height: String
    }
  });
  w2({
    tag: "track",
    name: "HTMLTrackElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    attributes: {
      src: GD,
      srclang: String,
      label: String,
      default: Boolean,
      kind: {
        type: ["subtitles", "captions", "descriptions", "chapters", "metadata"],
        missing: "subtitles",
        invalid: "metadata"
      }
    },
    props: {
      NONE: {
        get: function () {
          return 0
        }
      },
      LOADING: {
        get: function () {
          return 1
        }
      },
      LOADED: {
        get: function () {
          return 2
        }
      },
      ERROR: {
        get: function () {
          return 3
        }
      },
      readyState: {
        get: bO.nyi
      },
      track: {
        get: bO.nyi
      }
    }
  });
  w2({
    tag: "font",
    name: "HTMLFontElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    attributes: {
      color: {
        type: String,
        treatNullAsEmptyString: !0
      },
      face: {
        type: String
      },
      size: {
        type: String
      }
    }
  });
  w2({
    tag: "dir",
    name: "HTMLDirectoryElement",
    ctor: function (Q, B, G) {
      g9.call(this, Q, B, G)
    },
    attributes: {
      compact: Boolean
    }
  });
  w2({
    tags: ["abbr", "address", "article", "aside", "b", "bdi", "bdo", "cite", "content", "code", "dd", "dfn", "dt", "em", "figcaption", "figure", "footer", "header", "hgroup", "i", "kbd", "main", "mark", "nav", "noscript", "rb", "rp", "rt", "rtc", "ruby", "s", "samp", "section", "small", "strong", "sub", "summary", "sup", "u", "var", "wbr", "acronym", "basefont", "big", "center", "nobr", "noembed", "noframes", "plaintext", "strike", "tt"]
  })
})
// @from(Ln 343035, Col 4)
GU0 = U((Wc5) => {
  var Ff2 = hHA(),
    Jc5 = eC0(),
    Xc5 = BD(),
    Ic5 = hW1(),
    Dc5 = Wc5.elements = {},
    Hf2 = Object.create(null);
  Wc5.createElement = function (A, Q, B) {
    var G = Hf2[Q] || BU0;
    return new G(A, Q, B)
  };

  function QU0(A) {
    return Jc5(A, BU0, Dc5, Hf2)
  }
  var BU0 = QU0({
    superclass: Ff2,
    name: "SVGElement",
    ctor: function (Q, B, G) {
      Ff2.call(this, Q, B, Xc5.NAMESPACE.SVG, G)
    },
    props: {
      style: {
        get: function () {
          if (!this._style) this._style = new Ic5(this);
          return this._style
        }
      }
    }
  });
  QU0({
    name: "SVGSVGElement",
    ctor: function (Q, B, G) {
      BU0.call(this, Q, B, G)
    },
    tag: "svg",
    props: {
      createSVGRect: {
        value: function () {
          return Wc5.createElement(this.ownerDocument, "rect", null)
        }
      }
    }
  });
  QU0({
    tags: ["a", "altGlyph", "altGlyphDef", "altGlyphItem", "animate", "animateColor", "animateMotion", "animateTransform", "circle", "clipPath", "color-profile", "cursor", "defs", "desc", "ellipse", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "filter", "font", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignObject", "g", "glyph", "glyphRef", "hkern", "image", "line", "linearGradient", "marker", "mask", "metadata", "missing-glyph", "mpath", "path", "pattern", "polygon", "polyline", "radialGradient", "rect", "script", "set", "stop", "style", "switch", "symbol", "text", "textPath", "title", "tref", "tspan", "use", "view", "vkern"]
  })
})
// @from(Ln 343083, Col 4)
$f2 = U((a0Y, zf2) => {
  zf2.exports = {
    VALUE: 1,
    ATTR: 2,
    REMOVE_ATTR: 3,
    REMOVE: 4,
    MOVE: 5,
    INSERT: 6
  }
})
// @from(Ln 343093, Col 4)
dW1 = U((o0Y, _f2) => {
  _f2.exports = xbA;
  var I$ = ME(),
    Kc5 = p6A(),
    Lf2 = RW1(),
    ts = hHA(),
    Vc5 = bC0(),
    Fc5 = hC0(),
    SbA = SHA(),
    Hc5 = uC0(),
    Ec5 = dC0(),
    zc5 = ybA(),
    $c5 = ub2(),
    Cc5 = ib2(),
    Cf2 = jbA(),
    Uf2 = fW1(),
    qf2 = SW1(),
    Uc5 = sC0(),
    mW1 = _W1(),
    ZU0 = uW1(),
    qc5 = GU0(),
    r7 = BD(),
    mHA = $f2(),
    cHA = r7.NAMESPACE,
    YU0 = LW1().isApiWritable;

  function xbA(A, Q) {
    Lf2.call(this), this.nodeType = I$.DOCUMENT_NODE, this.isHTML = A, this._address = Q || "about:blank", this.readyState = "loading", this.implementation = new zc5(this), this.ownerDocument = null, this._contentType = A ? "text/html" : "application/xml", this.doctype = null, this.documentElement = null, this._templateDocCache = null, this._nodeIterators = null, this._nid = 1, this._nextnid = 2, this._nodes = [null, this], this.byId = Object.create(null), this.modclock = 0
  }
  var Nc5 = {
      event: "Event",
      customevent: "CustomEvent",
      uievent: "UIEvent",
      mouseevent: "MouseEvent"
    },
    wc5 = {
      events: "event",
      htmlevents: "event",
      mouseevents: "mouseevent",
      mutationevents: "mutationevent",
      uievents: "uievent"
    },
    dHA = function (A, Q, B) {
      return {
        get: function () {
          var G = A.call(this);
          if (G) return G[Q];
          return B
        },
        set: function (G) {
          var Z = A.call(this);
          if (Z) Z[Q] = G
        }
      }
    };

  function Nf2(A, Q) {
    var B, G, Z;
    if (A === "") A = null;
    if (!mW1.isValidQName(Q)) r7.InvalidCharacterError();
    if (B = null, G = Q, Z = Q.indexOf(":"), Z >= 0) B = Q.substring(0, Z), G = Q.substring(Z + 1);
    if (B !== null && A === null) r7.NamespaceError();
    if (B === "xml" && A !== cHA.XML) r7.NamespaceError();
    if ((B === "xmlns" || Q === "xmlns") && A !== cHA.XMLNS) r7.NamespaceError();
    if (A === cHA.XMLNS && !(B === "xmlns" || Q === "xmlns")) r7.NamespaceError();
    return {
      namespace: A,
      prefix: B,
      localName: G
    }
  }
  xbA.prototype = Object.create(Lf2.prototype, {
    _setMutationHandler: {
      value: function (A) {
        this.mutationHandler = A
      }
    },
    _dispatchRendererEvent: {
      value: function (A, Q, B) {
        var G = this._nodes[A];
        if (!G) return;
        G._dispatchEvent(new SbA(Q, B), !0)
      }
    },
    nodeName: {
      value: "#document"
    },
    nodeValue: {
      get: function () {
        return null
      },
      set: function () {}
    },
    documentURI: {
      get: function () {
        return this._address
      },
      set: r7.nyi
    },
    compatMode: {
      get: function () {
        return this._quirks ? "BackCompat" : "CSS1Compat"
      }
    },
    createTextNode: {
      value: function (A) {
        return new Vc5(this, String(A))
      }
    },
    createComment: {
      value: function (A) {
        return new Fc5(this, A)
      }
    },
    createDocumentFragment: {
      value: function () {
        return new Hc5(this)
      }
    },
    createProcessingInstruction: {
      value: function (A, Q) {
        if (!mW1.isValidName(A) || Q.indexOf("?>") !== -1) r7.InvalidCharacterError();
        return new Ec5(this, A, Q)
      }
    },
    createAttribute: {
      value: function (A) {
        if (A = String(A), !mW1.isValidName(A)) r7.InvalidCharacterError();
        if (this.isHTML) A = r7.toASCIILowerCase(A);
        return new ts._Attr(null, A, null, null, "")
      }
    },
    createAttributeNS: {
      value: function (A, Q) {
        A = A === null || A === void 0 || A === "" ? null : String(A), Q = String(Q);
        var B = Nf2(A, Q);
        return new ts._Attr(null, B.localName, B.prefix, B.namespace, "")
      }
    },
    createElement: {
      value: function (A) {
        if (A = String(A), !mW1.isValidName(A)) r7.InvalidCharacterError();
        if (this.isHTML) {
          if (/[A-Z]/.test(A)) A = r7.toASCIILowerCase(A);
          return ZU0.createElement(this, A, null)
        } else if (this.contentType === "application/xhtml+xml") return ZU0.createElement(this, A, null);
        else return new ts(this, A, null, null)
      },
      writable: YU0
    },
    createElementNS: {
      value: function (A, Q) {
        A = A === null || A === void 0 || A === "" ? null : String(A), Q = String(Q);
        var B = Nf2(A, Q);
        return this._createElementNS(B.localName, B.namespace, B.prefix)
      },
      writable: YU0
    },
    _createElementNS: {
      value: function (A, Q, B) {
        if (Q === cHA.HTML) return ZU0.createElement(this, A, B);
        else if (Q === cHA.SVG) return qc5.createElement(this, A, B);
        return new ts(this, A, Q, B)
      }
    },
    createEvent: {
      value: function (Q) {
        Q = Q.toLowerCase();
        var B = wc5[Q] || Q,
          G = Uc5[Nc5[B]];
        if (G) {
          var Z = new G;
          return Z._initialized = !1, Z
        } else r7.NotSupportedError()
      }
    },
    createTreeWalker: {
      value: function (A, Q, B) {
        if (!A) throw TypeError("root argument is required");
        if (!(A instanceof I$)) throw TypeError("root not a node");
        return Q = Q === void 0 ? Cf2.SHOW_ALL : +Q, B = B === void 0 ? null : B, new $c5(A, Q, B)
      }
    },
    createNodeIterator: {
      value: function (A, Q, B) {
        if (!A) throw TypeError("root argument is required");
        if (!(A instanceof I$)) throw TypeError("root not a node");
        return Q = Q === void 0 ? Cf2.SHOW_ALL : +Q, B = B === void 0 ? null : B, new Cc5(A, Q, B)
      }
    },
    _attachNodeIterator: {
      value: function (A) {
        if (!this._nodeIterators) this._nodeIterators = [];
        this._nodeIterators.push(A)
      }
    },
    _detachNodeIterator: {
      value: function (A) {
        var Q = this._nodeIterators.indexOf(A);
        this._nodeIterators.splice(Q, 1)
      }
    },
    _preremoveNodeIterators: {
      value: function (A) {
        if (this._nodeIterators) this._nodeIterators.forEach(function (Q) {
          Q._preremove(A)
        })
      }
    },
    _updateDocTypeElement: {
      value: function () {
        this.doctype = this.documentElement = null;
        for (var Q = this.firstChild; Q !== null; Q = Q.nextSibling)
          if (Q.nodeType === I$.DOCUMENT_TYPE_NODE) this.doctype = Q;
          else if (Q.nodeType === I$.ELEMENT_NODE) this.documentElement = Q
      }
    },
    insertBefore: {
      value: function (Q, B) {
        return I$.prototype.insertBefore.call(this, Q, B), this._updateDocTypeElement(), Q
      }
    },
    replaceChild: {
      value: function (Q, B) {
        return I$.prototype.replaceChild.call(this, Q, B), this._updateDocTypeElement(), B
      }
    },
    removeChild: {
      value: function (Q) {
        return I$.prototype.removeChild.call(this, Q), this._updateDocTypeElement(), Q
      }
    },
    getElementById: {
      value: function (A) {
        var Q = this.byId[A];
        if (!Q) return null;
        if (Q instanceof xc) return Q.getFirst();
        return Q
      }
    },
    _hasMultipleElementsWithId: {
      value: function (A) {
        return this.byId[A] instanceof xc
      }
    },
    getElementsByName: {
      value: ts.prototype.getElementsByName
    },
    getElementsByTagName: {
      value: ts.prototype.getElementsByTagName
    },
    getElementsByTagNameNS: {
      value: ts.prototype.getElementsByTagNameNS
    },
    getElementsByClassName: {
      value: ts.prototype.getElementsByClassName
    },
    adoptNode: {
      value: function (Q) {
        if (Q.nodeType === I$.DOCUMENT_NODE) r7.NotSupportedError();
        if (Q.nodeType === I$.ATTRIBUTE_NODE) return Q;
        if (Q.parentNode) Q.parentNode.removeChild(Q);
        if (Q.ownerDocument !== this) Rf2(Q, this);
        return Q
      }
    },
    importNode: {
      value: function (Q, B) {
        return this.adoptNode(Q.cloneNode(B))
      },
      writable: YU0
    },
    origin: {
      get: function () {
        return null
      }
    },
    characterSet: {
      get: function () {
        return "UTF-8"
      }
    },
    contentType: {
      get: function () {
        return this._contentType
      }
    },
    URL: {
      get: function () {
        return this._address
      }
    },
    domain: {
      get: r7.nyi,
      set: r7.nyi
    },
    referrer: {
      get: r7.nyi
    },
    cookie: {
      get: r7.nyi,
      set: r7.nyi
    },
    lastModified: {
      get: r7.nyi
    },
    location: {
      get: function () {
        return this.defaultView ? this.defaultView.location : null
      },
      set: r7.nyi
    },
    _titleElement: {
      get: function () {
        return this.getElementsByTagName("title").item(0) || null
      }
    },
    title: {
      get: function () {
        var A = this._titleElement,
          Q = A ? A.textContent : "";
        return Q.replace(/[ \t\n\r\f]+/g, " ").replace(/(^ )|( $)/g, "")
      },
      set: function (A) {
        var Q = this._titleElement,
          B = this.head;
        if (!Q && !B) return;
        if (!Q) Q = this.createElement("title"), B.appendChild(Q);
        Q.textContent = A
      }
    },
    dir: dHA(function () {
      var A = this.documentElement;
      if (A && A.tagName === "HTML") return A
    }, "dir", ""),
    fgColor: dHA(function () {
      return this.body
    }, "text", ""),
    linkColor: dHA(function () {
      return this.body
    }, "link", ""),
    vlinkColor: dHA(function () {
      return this.body
    }, "vLink", ""),
    alinkColor: dHA(function () {
      return this.body
    }, "aLink", ""),
    bgColor: dHA(function () {
      return this.body
    }, "bgColor", ""),
    charset: {
      get: function () {
        return this.characterSet
      }
    },
    inputEncoding: {
      get: function () {
        return this.characterSet
      }
    },
    scrollingElement: {
      get: function () {
        return this._quirks ? this.body : this.documentElement
      }
    },
    body: {
      get: function () {
        return wf2(this.documentElement, "body")
      },
      set: r7.nyi
    },
    head: {
      get: function () {
        return wf2(this.documentElement, "head")
      }
    },
    images: {
      get: r7.nyi
    },
    embeds: {
      get: r7.nyi
    },
    plugins: {
      get: r7.nyi
    },
    links: {
      get: r7.nyi
    },
    forms: {
      get: r7.nyi
    },
    scripts: {
      get: r7.nyi
    },
    applets: {
      get: function () {
        return []
      }
    },
    activeElement: {
      get: function () {
        return null
      }
    },
    innerHTML: {
      get: function () {
        return this.serialize()
      },
      set: r7.nyi
    },
    outerHTML: {
      get: function () {
        return this.serialize()
      },
      set: r7.nyi
    },
    write: {
      value: function (A) {
        if (!this.isHTML) r7.InvalidStateError();
        if (!this._parser) return;
        if (!this._parser);
        var Q = arguments.join("");
        this._parser.parse(Q)
      }
    },
    writeln: {
      value: function (Q) {
        this.write(Array.prototype.join.call(arguments, "") + `
`)
      }
    },
    open: {
      value: function () {
        this.documentElement = null
      }
    },
    close: {
      value: function () {
        if (this.readyState = "interactive", this._dispatchEvent(new SbA("readystatechange"), !0), this._dispatchEvent(new SbA("DOMContentLoaded"), !0), this.readyState = "complete", this._dispatchEvent(new SbA("readystatechange"), !0), this.defaultView) this.defaultView._dispatchEvent(new SbA("load"), !0)
      }
    },
    clone: {
      value: function () {
        var Q = new xbA(this.isHTML, this._address);
        return Q._quirks = this._quirks, Q._contentType = this._contentType, Q
      }
    },
    cloneNode: {
      value: function (Q) {
        var B = I$.prototype.cloneNode.call(this, !1);
        if (Q)
          for (var G = this.firstChild; G !== null; G = G.nextSibling) B._appendChild(B.importNode(G, !0));
        return B._updateDocTypeElement(), B
      }
    },
    isEqual: {
      value: function (Q) {
        return !0
      }
    },
    mutateValue: {
      value: function (A) {
        if (this.mutationHandler) this.mutationHandler({
          type: mHA.VALUE,
          target: A,
          data: A.data
        })
      }
    },
    mutateAttr: {
      value: function (A, Q) {
        if (this.mutationHandler) this.mutationHandler({
          type: mHA.ATTR,
          target: A.ownerElement,
          attr: A
        })
      }
    },
    mutateRemoveAttr: {
      value: function (A) {
        if (this.mutationHandler) this.mutationHandler({
          type: mHA.REMOVE_ATTR,
          target: A.ownerElement,
          attr: A
        })
      }
    },
    mutateRemove: {
      value: function (A) {
        if (this.mutationHandler) this.mutationHandler({
          type: mHA.REMOVE,
          target: A.parentNode,
          node: A
        });
        Mf2(A)
      }
    },
    mutateInsert: {
      value: function (A) {
        if (Of2(A), this.mutationHandler) this.mutationHandler({
          type: mHA.INSERT,
          target: A.parentNode,
          node: A
        })
      }
    },
    mutateMove: {
      value: function (A) {
        if (this.mutationHandler) this.mutationHandler({
          type: mHA.MOVE,
          target: A
        })
      }
    },
    addId: {
      value: function (Q, B) {
        var G = this.byId[Q];
        if (!G) this.byId[Q] = B;
        else {
          if (!(G instanceof xc)) G = new xc(G), this.byId[Q] = G;
          G.add(B)
        }
      }
    },
    delId: {
      value: function (Q, B) {
        var G = this.byId[Q];
        if (r7.assert(G), G instanceof xc) {
          if (G.del(B), G.length === 1) this.byId[Q] = G.downgrade()
        } else this.byId[Q] = void 0
      }
    },
    _resolve: {
      value: function (A) {
        return new Uf2(this._documentBaseURL).resolve(A)
      }
    },
    _documentBaseURL: {
      get: function () {
        var A = this._address;
        if (A === "about:blank") A = "/";
        var Q = this.querySelector("base[href]");
        if (Q) return new Uf2(A).resolve(Q.getAttribute("href"));
        return A
      }
    },
    _templateDoc: {
      get: function () {
        if (!this._templateDocCache) {
          var A = new xbA(this.isHTML, this._address);
          this._templateDocCache = A._templateDocCache = A
        }
        return this._templateDocCache
      }
    },
    querySelector: {
      value: function (A) {
        return qf2(A, this)[0]
      }
    },
    querySelectorAll: {
      value: function (A) {
        var Q = qf2(A, this);
        return Q.item ? Q : new Kc5(Q)
      }
    }
  });
  var Lc5 = ["abort", "canplay", "canplaythrough", "change", "click", "contextmenu", "cuechange", "dblclick", "drag", "dragend", "dragenter", "dragleave", "dragover", "dragstart", "drop", "durationchange", "emptied", "ended", "input", "invalid", "keydown", "keypress", "keyup", "loadeddata", "loadedmetadata", "loadstart", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "mousewheel", "pause", "play", "playing", "progress", "ratechange", "readystatechange", "reset", "seeked", "seeking", "select", "show", "stalled", "submit", "suspend", "timeupdate", "volumechange", "waiting", "blur", "error", "focus", "load", "scroll"];
  Lc5.forEach(function (A) {
    Object.defineProperty(xbA.prototype, "on" + A, {
      get: function () {
        return this._getEventHandler(A)
      },
      set: function (Q) {
        this._setEventHandler(A, Q)
      }
    })
  });

  function wf2(A, Q) {
    if (A && A.isHTML) {
      for (var B = A.firstChild; B !== null; B = B.nextSibling)
        if (B.nodeType === I$.ELEMENT_NODE && B.localName === Q && B.namespaceURI === cHA.HTML) return B
    }
    return null
  }

  function Oc5(A) {
    if (A._nid = A.ownerDocument._nextnid++, A.ownerDocument._nodes[A._nid] = A, A.nodeType === I$.ELEMENT_NODE) {
      var Q = A.getAttribute("id");
      if (Q) A.ownerDocument.addId(Q, A);
      if (A._roothook) A._roothook()
    }
  }

  function Mc5(A) {
    if (A.nodeType === I$.ELEMENT_NODE) {
      var Q = A.getAttribute("id");
      if (Q) A.ownerDocument.delId(Q, A)
    }
    A.ownerDocument._nodes[A._nid] = void 0, A._nid = void 0
  }

  function Of2(A) {
    if (Oc5(A), A.nodeType === I$.ELEMENT_NODE)
      for (var Q = A.firstChild; Q !== null; Q = Q.nextSibling) Of2(Q)
  }

  function Mf2(A) {
    Mc5(A);
    for (var Q = A.firstChild; Q !== null; Q = Q.nextSibling) Mf2(Q)
  }

  function Rf2(A, Q) {
    if (A.ownerDocument = Q, A._lastModTime = void 0, Object.prototype.hasOwnProperty.call(A, "_tagName")) A._tagName = void 0;
    for (var B = A.firstChild; B !== null; B = B.nextSibling) Rf2(B, Q)
  }

  function xc(A) {
    this.nodes = Object.create(null), this.nodes[A._nid] = A, this.length = 1, this.firstNode = void 0
  }
  xc.prototype.add = function (A) {
    if (!this.nodes[A._nid]) this.nodes[A._nid] = A, this.length++, this.firstNode = void 0
  };
  xc.prototype.del = function (A) {
    if (this.nodes[A._nid]) delete this.nodes[A._nid], this.length--, this.firstNode = void 0
  };
  xc.prototype.getFirst = function () {
    if (!this.firstNode) {
      var A;
      for (A in this.nodes)
        if (this.firstNode === void 0 || this.firstNode.compareDocumentPosition(this.nodes[A]) & I$.DOCUMENT_POSITION_PRECEDING) this.firstNode = this.nodes[A]
    }
    return this.firstNode
  };
  xc.prototype.downgrade = function () {
    if (this.length === 1) {
      var A;
      for (A in this.nodes) return this.nodes[A]
    }
    return this
  }
})
// @from(Ln 343736, Col 4)
pW1 = U((r0Y, Tf2) => {
  Tf2.exports = cW1;
  var Rc5 = ME(),
    jf2 = vC0(),
    _c5 = xW1();

  function cW1(A, Q, B, G) {
    jf2.call(this), this.nodeType = Rc5.DOCUMENT_TYPE_NODE, this.ownerDocument = A || null, this.name = Q, this.publicId = B || "", this.systemId = G || ""
  }
  cW1.prototype = Object.create(jf2.prototype, {
    nodeName: {
      get: function () {
        return this.name
      }
    },
    nodeValue: {
      get: function () {
        return null
      },
      set: function () {}
    },
    clone: {
      value: function () {
        return new cW1(this.ownerDocument, this.name, this.publicId, this.systemId)
      }
    },
    isEqual: {
      value: function (Q) {
        return this.name === Q.name && this.publicId === Q.publicId && this.systemId === Q.systemId
      }
    }
  });
  Object.defineProperties(cW1.prototype, _c5)
})