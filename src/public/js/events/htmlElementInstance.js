import noUiSlider from '../nouislider';
import M from '../materialize.min.js';

M.AutoInit();

export function objectMap(object, imageUrl, imageProperty) {
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

export const elementWithAutoComplete = {
  elementToGather: null,
  regenItems: null,
  monsterMandatory: null,
  monsterForbidden: null,
  autoDelete: null,
  putItemName: null,
  getItemName: null,
};

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

export const collapsible = M.Collapsible.init(
  document.querySelectorAll('.collapsible.expandable'),
  {
    accordion: false,
  },
);

export const itemsBank = {
  put: [],
  get: [],
};
