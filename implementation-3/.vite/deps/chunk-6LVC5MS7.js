// node_modules/cm-web-modules/src/i18n/I18n.js
var I18n = class {
  constructor(props = {}) {
    this.props = {
      locale: null,
      fallbackLang: "en"
      // used, when the translation was not found for locale
    };
    Object.assign(this.props, props);
    this.locale = this.props.locale;
    if (!this.locale) {
      const htmlLang = document.documentElement.getAttribute("lang");
      if (htmlLang) {
        this.locale = htmlLang;
      }
      if (!this.locale) {
        this.locale = navigator.language;
      }
    }
    this.lang = this.locale.substr(0, 2);
    this.translations = {};
  }
  load(dictionary) {
    let fetchPromises = [];
    for (const lang in dictionary) {
      if (dictionary.hasOwnProperty(lang)) {
        if (!this.translations[lang]) {
          this.translations[lang] = {};
        }
        const translations = dictionary[lang];
        if (typeof translations === "string") {
          fetchPromises.push(new Promise((resolve) => {
            fetch(translations).then((res) => res.json()).then((json) => {
              Object.assign(this.translations[lang], json);
              resolve();
            }).catch((err) => {
              throw err;
            });
          }));
        } else {
          Object.assign(this.translations[lang], translations);
        }
      }
    }
    if (fetchPromises.length > 0) {
      return Promise.all(fetchPromises);
    } else {
      return Promise.resolve();
    }
  }
  t(code, ...values) {
    let translation;
    if (this.translations[this.locale] && this.translations[this.locale][code]) {
      translation = this.translations[this.locale][code];
    } else if (this.translations[this.lang] && this.translations[this.lang][code]) {
      translation = this.translations[this.lang][code];
    } else if (this.translations[this.props.fallbackLang][code]) {
      translation = this.translations[this.props.fallbackLang][code];
    } else {
      console.warn(
        "Error, no translation found for locale:",
        this.locale,
        ", lang: ",
        this.lang,
        ", code: ",
        code
      );
      return "?" + code + "?";
    }
    if (values && values.length > 0) {
      let i = 0;
      for (const value of values) {
        translation = translation.replace(new RegExp("\\$" + i, "g"), value);
        i++;
      }
    }
    return translation;
  }
};

export {
  I18n
};
//# sourceMappingURL=chunk-6LVC5MS7.js.map
