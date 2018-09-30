const { dialog } = require('electron').remote;
const fs = require('fs')
import { ipcRenderer } from 'electron';

M.AutoInit();

ipcRenderer.on('newFile', () => {
  const rep = confirm('Voulez vous vraiment créer un nouveau trajet et supprimer toute les actions présente sur la map ?');
  if (rep) {
    Object.keys(movementType).forEach((key) => {
      const dataTypeBackup = movementType[key].slice(0);
      movementType[key].forEach((index) => {
        icon.move.forEach((name) => {
          deleteAction(dataTypeBackup, index, name);
        });
      });
      movementType[key] = dataTypeBackup.slice(0);
    });
    console.log(movementType);
  }
});

ipcRenderer.on('saveFile', () => {
  const config = {
    name: document.querySelector('#scriptName').value,
    type: document.querySelector('#scriptType').value,
    area: document.querySelector('#scriptArea').value,
  };
  dialog.showSaveDialog({
    filters: [{ name: 'JavaScript', extensions: ['js'] }],
    defaultPath: `${config.name} [${config.area}][${config.type}]`,
  }, (filename) => {
    if (filename) {
      fs.writeFile(filename, generateScript(), (err) => {
        if (err) throw err;
        console.log(`${filename} Saved!`);
      });
    }
  });
});

ipcRenderer.on('openFile', () => {
  dialog.showOpenDialog({
    filters: [{ name: 'JavaScript', extensions: ['js'] }],
    properties: ['openFile'],
  }, (filename) => {
    fs.readFile(filename[0], (err, data) => {
      console.log(data);
    });
  });
});


$('.btn-group>a.btn-flat').on('click', (e) => {
  $(e.currentTarget).toggleClass('selected');
  if ($('#delete').hasClass('selected')) {
    const buttonMoveSets = ['up', 'down', 'left', 'right'];
    for (const key of buttonMoveSets) {
      if (e.currentTarget.id == key) {
        $('#delete').removeClass('selected');
      } else {
        $(`#${key}`).removeClass('selected');
      }
    }
  }
});

const gatherListList = {};
for (const iterator of Object.values(interactive)) {
  gatherListList[iterator.nameId] = null;
}

const elementToGather = M.Chips.init(document.querySelector('#gatherElementChips'), {
  autocompleteOptions: {
    data: gatherListList,
    limit: 5,
    minLength: 1,
  },
  placeholder: 'ex : Orge ...',
});

const regenItemsList = {};
for (const iterator of Object.values(items)) {
  if (iterator._type == 'Item' && iterator.usable) {
    regenItemsList[iterator.nameId] = `https://ankama.akamaized.net/games/dofus-tablette/assets/2.22.1/gfx/items/${iterator.iconId}.png`;
  }
}

const regenItems = M.Chips.init(document.querySelector('#regenItemChips'), {
  autocompleteOptions: {
    data: regenItemsList,
    limit: 5,
    minLength: 1,
  },
  placeholder: 'ex : Pain ...',
});

const monstersList = {};
for (const iterator of Object.values(monsters)) {
  monstersList[iterator.nameId] = `https://ankama.akamaized.net/games/dofus-tablette/assets/2.22.1/gfx/monsters/${iterator.id}.png`;
}

const monsterMandatory = M.Chips.init(document.querySelector('#monsterMandatory'), {
  autocompleteOptions: {
    data: monstersList,
    limit: 5,
    minLength: 1,
  },
  placeholder: 'ex : Piou ...',
});

const monsterForbidden = M.Chips.init(document.querySelector('#monsterForbidden'), {
  autocompleteOptions: {
    data: monstersList,
    limit: 5,
    minLength: 1,
  },
  placeholder: 'ex : Piou ...',
});

const itemsList = {};
for (const iterator of Object.values(items)) {
  itemsList[iterator.nameId] = `https://ankama.akamaized.net/games/dofus-tablette/assets/2.22.1/gfx/items/${iterator.iconId}.png`;
}

const autoDelete = M.Chips.init(document.querySelector('#autoDelete'), {
  autocompleteOptions: {
    data: itemsList,
    limit: 5,
    minLength: 1,
  },
  placeholder: 'ex : Plume ...',
});

const putItemName = M.Autocomplete.init(document.querySelector('#putItemName'), {
  data: itemsList,
  limit: 5,
  minLength: 1,
});

const getItemName = M.Autocomplete.init(document.querySelector('#getItemName'), {
  data: itemsList,
  limit: 5,
  minLength: 1,
});

const lifeMinMax = document.getElementById('lifeMinMax');
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

const monsterQuantMinMax = document.getElementById('monsterQuantMinMax');
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

const collapsible = M.Collapsible.init(document.querySelectorAll('.collapsible.expandable'), {
  accordion: false,
});

const itemsBank = {};
itemsBank.put = [];
itemsBank.get = [];

$('#addPutItem').on('click', () => {
  $('.delete-item').off();
  const name = $('#putItemName').val();
  const ids = getIdOfAutoComplete(name, items);
  const quant = $('#putItemQuant').val();
  if (name.length > 0) {
    const html =
      `<tr>
    <td><img src="https://ankama.akamaized.net/games/dofus-tablette/assets/2.22.1/gfx/items/${ids.iconId}.png" width="40" height="40"/></td>
    <td>${name}</td>
    <td>${quant}</td>
    <td><a class="waves-effect waves-light btn amber accent-3 delete-item" data-id="${ids.id}">X</a></td>
    </tr>`;
    itemsBank.put.push({
      item: ids.id,
      quantity: quant,
    });
    console.log(itemsBank.put);
    $('#putItemTable').append(html);
    $('.delete-item').on('click', (e) => {
      itemsBank.put.splice(itemsBank.put.indexOf(parseInt({
        item: e.target.dataset.id,
      })), 1);
      console.log(itemsBank.put);
      $(e.target.parentNode.parentNode).remove();
    });
  }
});

$('#addGetItem').on('click', () => {
  $('.delete-item').off();
  const name = $('#getItemName').val();
  const ids = getIdOfAutoComplete(name, items);
  const quant = $('#getItemQuant').val();
  if (name.length > 0) {
    const html =
      `<tr>
    <td><img src="https://ankama.akamaized.net/games/dofus-tablette/assets/2.22.1/gfx/items/${ids.iconId}.png" width="40" height="40"/></td>
    <td>${name}</td>
    <td>${quant}</td>
    <td><a class="waves-effect waves-light btn amber accent-3 delete-item" data-id="${ids.id}">X</a></td>
    </tr>`;
    itemsBank.get.push({
      item: ids.id,
      quantity: quant,
    });
    console.log(itemsBank.get);
    $('#getItemTable').append(html);
    $('.delete-item').on('click', (e) => {
      itemsBank.get.splice(itemsBank.get.indexOf(parseInt({
        item: e.target.dataset.id,
      })), 1);
      console.log(itemsBank.get);
      $(e.target.parentNode.parentNode).remove();
    });
  }
});
