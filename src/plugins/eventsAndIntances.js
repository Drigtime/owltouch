const { dialog } = require('electron').remote;
const fs = require('fs')
import { ipcRenderer } from 'electron';
import { loadScript } from "./plugins/loadPath";

M.AutoInit();

function deleteAll() {
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

ipcRenderer.on('newFile', () => {
  const rep = confirm('Voulez vous vraiment créer un nouveau trajet et supprimer toute les actions présente sur la map ?');
  if (rep) {
    deleteAll()
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
      if (err) throw err;
      deleteAll()
      loadScript(data.toString('utf8'))
    });
  });
});

$('#defineBankCoordConfirm').click(() => {
  const coord = $('#defineBankCoord').data('coord')
  const index = checkIfMapAlreadyExist([coord[0], coord[1]], movementType.bank);
  const marker = L.marker(dofusCoordsToGeoCoords([coord[0], coord[1]]), {
    icon: L.icon({
      iconUrl: './data/assets/path/bank/bank.png',
      iconAnchor: [
        sizeOf(`./src/data/assets/path/bank/bank.png`).width / 2,
        sizeOf(`./src/data/assets/path/bank/bank.png`).height / 2
      ],
      className: 'bank',
    }),
    zIndexOffset: 10000,
    interactive: false,
  });
  if (index !== null) {
    if (index.data.bank) {
      deleteAction(movementType.bank, index, 'bank');
    } else {
      index.data.bank = {
        bank: true,
        mapIdOutSide: $('#mapIdOutSide').val(),
        doorIdOutSide: $('#doorIdOutSide').val(),
        mapIdInSide: $('#mapIdInSide').val(),
        sunIdInside: $('#sunIdInside').val()
      },
        index.marker.bank = marker.addTo(map);
    }
  } else {
    movementType.bank.push({
      coord: [coord[0], coord[1]],
      data: {
        bank: {
          bank: true,
          mapIdOutSide: $('#mapIdOutSide').val(),
          doorIdOutSide: $('#doorIdOutSide').val(),
          mapIdInSide: $('#mapIdInSide').val(),
          sunIdInside: $('#sunIdInside').val()
        },
      },
      marker: {
        bank: marker.addTo(map),
      },
    });
  }
})

$('#definePhoenixCoordConfirm').click(() => {
  const coord = $('#definePhoenixCoord').data('coord')
  const index = checkIfMapAlreadyExist([coord[0], coord[1]], movementType.phoenix);
  const marker = L.marker(dofusCoordsToGeoCoords([coord[0], coord[1]]), {
    icon: L.icon({
      iconUrl: './data/assets/path/phoenix/phoenix.png',
      iconAnchor: [
        sizeOf(`./src/data/assets/path/phoenix/phoenix.png`).width / 2,
        sizeOf(`./src/data/assets/path/phoenix/phoenix.png`).height / 2
      ],
      className: 'phoenix',
    }),
    zIndexOffset: 10000,
    interactive: false,
  });
  if (index !== null) {
    if (index.data.phoenix) {
      deleteAction(movementType.phoenix, index, 'phoenix');
    } else {
      index.data.phoenix = {
        phoenix: true,
        phoenixCellid: $('#phoenixCellid').val(),
        actionAfterRevive: $('#actionAfterRevive')[0].selectedOptions[0].dataset.direction
      };
      index.marker.phoenix = marker.addTo(map);
    }
  } else {
    movementType.phoenix.push({
      coord: [coord[0], coord[1]],
      data: {
        phoenix: {
          phoenix: true,
          phoenixCellid: $('#phoenixCellid').val(),
          actionAfterRevive: $('#actionAfterRevive')[0].selectedOptions[0].dataset.direction
        },
      },
      marker: {
        phoenix: marker.addTo(map),
      },
    });
  }
})

$('#phoenixPlacement').click((e) => {
  $(e.currentTarget).toggleClass('selected')
  if ($(e.currentTarget).hasClass('selected')) {
    bankLayerGroup.remove()
    phoenixLayerGroup.addTo(map)
    for (const key of ['top', 'bottom', 'left', 'right', 'delete', 'bankPlacement']) {
      $(`#${key}`).removeClass('selected');
    }
  } else {
    phoenixLayerGroup.remove()
  }
})

$('#bankPlacement').click((e) => {
  $(e.currentTarget).toggleClass('selected')
  if ($(e.currentTarget).hasClass('selected')) {
    phoenixLayerGroup.remove()
    bankLayerGroup.addTo(map)
    for (const key of ['top', 'bottom', 'left', 'right', 'delete', 'phoenixPlacement']) {
      $(`#${key}`).removeClass('selected');
    }
  } else {
    bankLayerGroup.remove()
  }
})

$('#delete').click((e) => {
  $(e.currentTarget).toggleClass('selected')
  if ($(e.currentTarget).hasClass('selected')) {
    phoenixLayerGroup.remove()
    bankLayerGroup.remove()
    for (const key of ['top', 'bottom', 'left', 'right', 'phoenixPlacement', 'bankPlacement']) {
      $(`#${key}`).removeClass('selected');
    }
  }
})

$('#top, #bottom, #left, #right').click((e) => {
  $(e.currentTarget).toggleClass('selected')
  if ($(e.currentTarget).hasClass('selected')) {
    phoenixLayerGroup.remove()
    bankLayerGroup.remove()
    for (const key of ['delete', 'phoenixPlacement', 'bankPlacement']) {
      $(`#${key}`).removeClass('selected');
    }
  }
})

function objectMap(object, imageUrl, imageProperty) {
  let list = {}
  Object.values(object).forEach(element => {
    if (imageUrl !== null) {
      list[element.nameId] = `${imageUrl}${element[imageProperty]}.png`;
    } else {
      list[element.nameId] = null;
    }
  });
  return list
}

const elementToGather = M.Chips.init(document.querySelector('#gatherElementChips'), {
  autocompleteOptions: {
    data: objectMap(interactive, null),
    limit: 5,
    minLength: 1,
  },
  placeholder: 'ex : Orge ...',
});

const regenItems = M.Chips.init(document.querySelector('#regenItemChips'), {
  autocompleteOptions: {
    data: objectMap(items, `https://ankama.akamaized.net/games/dofus-tablette/assets/2.22.1/gfx/items/`, 'iconId'),
    limit: 5,
    minLength: 1,
  },
  placeholder: 'ex : Pain ...',
});

const monsterMandatory = M.Chips.init(document.querySelector('#monsterMandatory'), {
  autocompleteOptions: {
    data: objectMap(monsters, `https://ankama.akamaized.net/games/dofus-tablette/assets/2.22.1/gfx/monsters/`, 'id'),
    limit: 5,
    minLength: 1,
  },
  placeholder: 'ex : Piou ...',
});

const monsterForbidden = M.Chips.init(document.querySelector('#monsterForbidden'), {
  autocompleteOptions: {
    data: objectMap(monsters, `https://ankama.akamaized.net/games/dofus-tablette/assets/2.22.1/gfx/monsters/`, 'id'),
    limit: 5,
    minLength: 1,
  },
  placeholder: 'ex : Piou ...',
});

const autoDelete = M.Chips.init(document.querySelector('#autoDelete'), {
  autocompleteOptions: {
    data: objectMap(items, `https://ankama.akamaized.net/games/dofus-tablette/assets/2.22.1/gfx/items/`, 'iconId'),
    limit: 5,
    minLength: 1,
  },
  placeholder: 'ex : Plume ...',
});

const putItemName = M.Autocomplete.init(document.querySelector('#putItemName'), {
  data: objectMap(items, `https://ankama.akamaized.net/games/dofus-tablette/assets/2.22.1/gfx/items/`, 'iconId'),
  limit: 5,
  minLength: 1,
});

const getItemName = M.Autocomplete.init(document.querySelector('#getItemName'), {
  data: objectMap(items, `https://ankama.akamaized.net/games/dofus-tablette/assets/2.22.1/gfx/items/`, 'iconId'),
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

const itemsBank = {
  put: [],
  get: []
}

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
