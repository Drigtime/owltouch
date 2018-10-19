import i18next from 'i18next';
import jqueryI18next from 'jquery-i18next';

const eng = require('./data/i18n/EN/en.json');
const fra = require('./data/i18n/FR/fr.json');
// use plugins and options as needed, for options, detail see
// http://i18next.com/docs/
i18next.init({
  lng: 'fr', // evtl. use language-detector https://github.com/i18next/i18next-browser-languageDetector
  resources: { // evtl. load via xhr https://github.com/i18next/i18next-xhr-backend
    en: eng,
    fr: fra,
  },
}, () => {
  jqueryI18next.init(i18next, $);
  $(document).localize();
});

$(document).on('contextmenu', () => {
  i18next.init({
    lng: 'en',
  }, () => {
    $(document).localize();
  });
});
