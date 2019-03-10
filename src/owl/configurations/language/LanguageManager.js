import GlobalConfiguration from "owl/configurations/GlobalConfiguration";
import { Languages } from "owl/configurations/language/Languages";
import * as fs from "fs";
import * as path from "path";
import { Map } from "core-js";

class LanguageManager {
  constructor() {
    const enFile = fs.readFileSync(path.join(__static, "./langs/en/en.json"));
    const en = JSON.parse(enFile.toString());
    const frFile = fs.readFileSync(path.join(__static, "./langs/fr/fr.json"));
    const fr = JSON.parse(frFile.toString());
    const esFile = fs.readFileSync(path.join(__static, "./langs/es/es.json"));
    const es = JSON.parse(esFile.toString());

    this.langs = new Map([
      [Languages.FRENCH, fr],
      [Languages.ENGLISH, en],
      [Languages.SPANISH, es]
    ]);
  }

  trans(key) {
    const lang = new GlobalConfiguration().lang;
    let value = this.langs.get(lang)[key];
    if (!value) {
      value = this.langs.get(Languages.ENGLISH)[key];
      if (!value) {
        return "<empty>";
      }
    }
    return value;
  }
}

export default new LanguageManager();
