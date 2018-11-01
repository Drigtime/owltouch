import changeLanguage from '../i18n';
import '../materialize.min.js';
import Store from '../store';

const store = new Store({
  // We'll call our data file 'user-preferences'
  configName: 'settings',
  defaults: {
    top: 'z',
    bottom: 's',
    left: 'q',
    right: 'd',
    delete: 'e',
    bankPlacement: 'w',
    phenixPlacement: 'x',
    zaapPlacement: 'c',
    language: 'fr',
  },
});

const shortcutInputsId = {
  settingsShortcutTop: 'top',
  settingsShortcutBottom: 'bottom',
  settingsShortcutLeft: 'left',
  settingsShortcutRigth: 'right',
  settingsShortcutDelete: 'delete',
  settingsShortcutBank: 'bankPlacement',
  settingsShortcutPhenix: 'phenixPlacement',
  settingsShortcutZaap: 'zaapPlacement',
};

const defaultShortcuts = () => {
  Object.keys(shortcutInputsId).forEach((key) => {
    store.set(shortcutInputsId[key], store.getDefault(shortcutInputsId[key]));
    $(`#${key}`).val(String(store.getDefault(shortcutInputsId[key])).toUpperCase());
  });
};

const userShortcuts = () => {
  Object.keys(shortcutInputsId).forEach((key) => {
    store.set(shortcutInputsId[key], store.get(shortcutInputsId[key]));
    $(`#${key}`).val(String(store.get(shortcutInputsId[key])).toUpperCase());
  });
};

$('#settingsShortcut .input-field input').on('keydown', (event) => {
  event.stopPropagation(event);
  event.preventDefault(event);
  $(event.target).val(String(event.key).toUpperCase());
  store.set(event.target.dataset.shortcut, event.key);
});

$('#settingsShortcut .input-field input').on('focusout', (e) => {
  $(e.target).val(String(store.get(e.target.dataset.shortcut)).toUpperCase());
});

$('#SettingsBtnDefault').on('click', defaultShortcuts);

userShortcuts();

$(document).on('keydown', (e) => {
  Object.values(shortcutInputsId).forEach((key) => {
    if (store.get(key) === e.key) {
      $(`#${key}`).click();
    }
  });
});

$('#settingLanguageSelector')
  .val(store.get('language'))
  .formSelect();

$('#settingLanguageSelector').on('change', changeLanguage);

export default store;
