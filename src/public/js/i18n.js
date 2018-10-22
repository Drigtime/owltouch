import i18next from 'i18next';
import jqueryI18next from 'jquery-i18next';
import { elementWithAutoComplete, objectMap } from './events/htmlElementInstance';
import M from './materialize.min.js';

const { join } = require('path');
const fs = require('fs');

const settings = require('../../data/json/settings');
const en = require('../../data/i18n/en/en');
const fr = require('../../data/i18n/fr/fr');
const es = require('../../data/i18n/es/es');

function resetMaterialElement() {
  $(document).localize();
  $('select').formSelect();
  const items = JSON.parse(
    fs.readFileSync(join(__dirname, `../../data/i18n/${$.i18n.language}/items.json`)),
  );
  const interactives = JSON.parse(
    fs.readFileSync(join(__dirname, `../../data/i18n/${$.i18n.language}/Interactives.json`)),
  );
  const monsters = JSON.parse(
    fs.readFileSync(join(__dirname, `../../data/i18n/${$.i18n.language}/monsters.json`)),
  );
  const store = $.i18n.store.data[$.i18n.language].translation.config;
  elementWithAutoComplete.elementToGather = M.Chips.init($('#gatherElementChips'), {
    autocompleteOptions: {
      data: objectMap(interactives, null, null),
      limit: 5,
      minLength: 1,
    },
    placeholder: store.gather.gather.placeholder,
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
    placeholder: store.fight.regen.items.placeholder,
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
    placeholder: store.fight.monster.mandatory.placeholder,
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
    placeholder: store.fight.monster.forbidden.placeholder,
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
    placeholder: store.bank.autoDelete.placeholder,
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
    lng: settings.language,
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
      settings.language = $.i18n.language;
      fs.writeFileSync(
        join(__dirname, '../../data/json/settings.json'),
        JSON.stringify(settings, null, 4),
      );
      resetMaterialElement();
    },
  );
}
