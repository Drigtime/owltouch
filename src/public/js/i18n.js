import i18next from 'i18next';
import jqueryI18next from 'jquery-i18next';
import { elementWithAutoComplete, objectMap } from './events/htmlElementInstance';
import M from './materialize.min.js';
import store from './events/settings';

const { join } = require('path');
const fs = require('fs');

const en = require('../../data/i18n/en/en');
const fr = require('../../data/i18n/fr/fr');
const es = require('../../data/i18n/es/es');

function resetMaterialElement() {
  $(document).localize();
  $('select').formSelect();
  const items = JSON.parse(
    fs.readFileSync(join(__dirname, `../../data/i18n/${$.i18n.language}/Items.json`)),
  );
  const interactives = JSON.parse(
    fs.readFileSync(join(__dirname, `../../data/i18n/${$.i18n.language}/Interactives.json`)),
  );
  const monsters = JSON.parse(
    fs.readFileSync(join(__dirname, `../../data/i18n/${$.i18n.language}/Monsters.json`)),
  );
  const i18nStore = $.i18n.store.data[$.i18n.language].translation.config;
  elementWithAutoComplete.elementToGather = M.Chips.init($('#gatherElementChips'), {
    autocompleteOptions: {
      data: objectMap(interactives, null, null),
      limit: 5,
      minLength: 1,
    },
    placeholder: i18nStore.gather.gather.placeholder,
  });
  elementWithAutoComplete.regenItems = M.Chips.init($('#regenItemChips'), {
    autocompleteOptions: {
      data: objectMap(
        items,
        'https://ankama.akamaized.net/games/dofus-tablette/assets/2.22.1/gfx/items/',
        'iconId',
      ),
      limit: 5,
      minLength: 1,
    },
    placeholder: i18nStore.fight.regen.items.placeholder,
  });
  elementWithAutoComplete.monsterMandatory = M.Chips.init($('#monsterMandatory'), {
    autocompleteOptions: {
      data: objectMap(
        monsters,
        'https://ankama.akamaized.net/games/dofus-tablette/assets/2.22.1/gfx/monsters/',
        'id',
      ),
      limit: 5,
      minLength: 1,
    },
    placeholder: i18nStore.fight.monster.mandatory.placeholder,
  });
  elementWithAutoComplete.monsterForbidden = M.Chips.init($('#monsterForbidden'), {
    autocompleteOptions: {
      data: objectMap(
        monsters,
        'https://ankama.akamaized.net/games/dofus-tablette/assets/2.22.1/gfx/monsters/',
        'id',
      ),
      limit: 5,
      minLength: 1,
    },
    placeholder: i18nStore.fight.monster.forbidden.placeholder,
  });
  elementWithAutoComplete.autoDelete = M.Chips.init($('#autoDelete'), {
    autocompleteOptions: {
      data: objectMap(
        items,
        'https://ankama.akamaized.net/games/dofus-tablette/assets/2.22.1/gfx/items/',
        'iconId',
      ),
      limit: 5,
      minLength: 1,
    },
    placeholder: i18nStore.bank.autoDelete.placeholder,
  });
  elementWithAutoComplete.putItemName = M.Autocomplete.init($('#putItemName'), {
    data: objectMap(
      items,
      'https://ankama.akamaized.net/games/dofus-tablette/assets/2.22.1/gfx/items/',
      'iconId',
    ),
    limit: 5,
    minLength: 1,
  });
  elementWithAutoComplete.getItemName = M.Autocomplete.init($('#getItemName'), {
    data: objectMap(
      items,
      'https://ankama.akamaized.net/games/dofus-tablette/assets/2.22.1/gfx/items/',
      'iconId',
    ),
    limit: 5,
    minLength: 1,
  });
}

i18next.init(
  {
    lng: store.get('language'),
    resources: {
      en,
      fr,
      es,
    },
  },
  () => {
    jqueryI18next.init(i18next, $);
    resetMaterialElement();
  },
);

export default function changeHtmlInstanceLanguage(e) {
  i18next.init(
    {
      lng: e.originalEvent.target.value,
    },
    () => {
      store.set('language', $.i18n.language);
      resetMaterialElement();
    },
  );
}
