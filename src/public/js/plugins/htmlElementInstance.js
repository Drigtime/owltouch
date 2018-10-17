import interactive from '../../../data/json/d2o/Interactive.json';
import items from '../../../data/json/d2o/Items.json';
import monsters from '../../../data/json/d2o/Monsters.json';
import noUiSlider from '../nouislider';
import M from '../materialize.min.js';

M.AutoInit();

function objectMap(object, imageUrl, imageProperty) {
  const list = {};
  Object.values(object).forEach((element) => {
    if (imageUrl !== null) {
      list[element.nameId] = `${imageUrl}${element[imageProperty]}.png`;
    } else {
      list[element.nameId] = null;
    }
  });
  return list;
}

export const elementToGather = M.Chips.init(document.querySelector('#gatherElementChips'), {
  autocompleteOptions: {
    data: objectMap(interactive, null),
    limit: 5,
    minLength: 1,
  },
  placeholder: 'ex : Orge ...',
});

export const regenItems = M.Chips.init(document.querySelector('#regenItemChips'), {
  autocompleteOptions: {
    data: objectMap(items, 'https://ankama.akamaized.net/games/dofus-tablette/assets/2.22.1/gfx/items/', 'iconId'),
    limit: 5,
    minLength: 1,
  },
  placeholder: 'ex : Pain ...',
});

export const monsterMandatory = M.Chips.init(document.querySelector('#monsterMandatory'), {
  autocompleteOptions: {
    data: objectMap(monsters, 'https://ankama.akamaized.net/games/dofus-tablette/assets/2.22.1/gfx/monsters/', 'id'),
    limit: 5,
    minLength: 1,
  },
  placeholder: 'ex : Piou ...',
});

export const monsterForbidden = M.Chips.init(document.querySelector('#monsterForbidden'), {
  autocompleteOptions: {
    data: objectMap(monsters, 'https://ankama.akamaized.net/games/dofus-tablette/assets/2.22.1/gfx/monsters/', 'id'),
    limit: 5,
    minLength: 1,
  },
  placeholder: 'ex : Piou ...',
});

export const autoDelete = M.Chips.init(document.querySelector('#autoDelete'), {
  autocompleteOptions: {
    data: objectMap(items, 'https://ankama.akamaized.net/games/dofus-tablette/assets/2.22.1/gfx/items/', 'iconId'),
    limit: 5,
    minLength: 1,
  },
  placeholder: 'ex : Plume ...',
});

export const putItemName = M.Autocomplete.init(document.querySelector('#putItemName'), {
  data: objectMap(items, 'https://ankama.akamaized.net/games/dofus-tablette/assets/2.22.1/gfx/items/', 'iconId'),
  limit: 5,
  minLength: 1,
});

export const getItemName = M.Autocomplete.init(document.querySelector('#getItemName'), {
  data: objectMap(items, 'https://ankama.akamaized.net/games/dofus-tablette/assets/2.22.1/gfx/items/', 'iconId'),
  limit: 5,
  minLength: 1,
});

export const lifeMinMax = document.getElementById('lifeMinMax');
noUiSlider.create(lifeMinMax, {
  start: [80, 100],
  connect: true,
  step: 1,
  orientation: 'horizontal', // 'horizontal' or 'vertical'
  range: {
    min: 0,
    max: 100,
  },
  format: wNumb({
    decimals: 0,
  }),
});

export const monsterQuantMinMax = document.getElementById('monsterQuantMinMax');
noUiSlider.create(monsterQuantMinMax, {
  start: [1, 8],
  connect: true,
  step: 1,
  orientation: 'horizontal', // 'horizontal' or 'vertical'
  range: {
    min: 1,
    max: 8,
  },
  format: wNumb({
    decimals: 0,
  }),
});

export const collapsible = M.Collapsible.init(document.querySelectorAll('.collapsible.expandable'), {
  accordion: false,
});

export const itemsBank = {
  put: [],
  get: [],
};
