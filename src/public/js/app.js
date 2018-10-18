import { remote, ipcRenderer } from 'electron';
import L from 'leaflet';
import items from './data/json/d2o/Items.json';
import { itemsBank } from './public/js/plugins/htmlElementInstance';
import loadScript, { putGetItem } from './public/js/plugins/loadPath';
import {
  bankLayerGroup,
  dofusCoordsToGeoCoords,
  drawDofusMapBoundsOnMouseMove,
  geoCoordsToDofusCoords,
  highlightSubArea,
  map,
  phoenixLayerGroup,
} from './public/js/plugins/map';
import {
  checkIfMapAlreadyExist,
  deleteAction,
  generateScript,
  icon,
  movementType,
  onMapClick,
  resizeMarker,
} from './public/js/plugins/pathMaker';

const sizeOf = require('image-size');
const { dialog } = require('electron').remote;
const { writeFile, readFile } = require('fs');
const path = require('path');

map.on('mousemove', (e) => {
  drawDofusMapBoundsOnMouseMove(e);
  highlightSubArea(e);
});

map.on('click', (e) => {
  onMapClick(geoCoordsToDofusCoords(e.latlng));
});

map.on('zoom', () => {
  resizeMarker();
});

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

$('#NewFile').on('click', () => {
  const rep = confirm('Voulez vous vraiment créer un nouveau trajet et supprimer toute les actions présente sur la map ?');
  if (rep) {
    deleteAll();
  }
});

$('#SaveFile').on('click', () => {
  const config = {
    name: document.querySelector('#scriptName').value,
    type: document.querySelector('#scriptType').value,
    area: document.querySelector('#scriptArea').value,
  };
  dialog.showSaveDialog(
    {
      filters: [{ name: 'JavaScript', extensions: ['js'] }],
      defaultPath: `${config.name} [${config.area}][${config.type}]`,
    },
    (filename) => {
      if (filename) {
        writeFile(filename, generateScript(), (err) => {
          if (err) throw err;
          console.log(`${filename} Saved!`);
        });
      }
    },
  );
});

$('#LoadFile').on('click', () => {
  dialog.showOpenDialog(
    {
      filters: [{ name: 'JavaScript', extensions: ['js'] }],
      properties: ['openFile'],
    },
    (filename) => {
      readFile(filename[0], 'utf8', (err, data) => {
        if (err) throw err;
        deleteAll();
        loadScript(data);
      });
    },
  );
});

$('#RealoadApp').on('click', () => {
  remote.getCurrentWindow().reload();
});

$('#DevTools').on('click', () => {
  remote.getCurrentWindow().toggleDevTools();
});

$(document).on('keyup', (e) => {
  if (e.ctrlKey && e.key == 'n') {
    $('#NewFile').click();
  } else if (e.ctrlKey && e.key == 'o') {
    $('#LoadFile').click();
  } else if (e.ctrlKey && e.key == 's') {
    $('#SaveFile').click();
  } else if (e.ctrlKey && e.key == 'r') {
    $('#RealoadApp').click();
  } else if (e.ctrlKey && e.shitKey && e.key == 'i') {
    $('#DevTools').click();
  }
});

function bmHandler(data, coord, marker) {
  const indexBankOut = checkIfMapAlreadyExist([coord[0], coord[1]], movementType.move);
  if (indexBankOut !== null) {
    if (indexBankOut.data.bankOut) {
      deleteAction(movementType.move, indexBankOut, 'bankOut');
    } else {
      indexBankOut.data.bankOut = { mapid: data.mapIdInSide, sun: data.sunIdInside, mapIdOutSide: data.mapIdOutSide };
    }
  } else {
    movementType.move.push({
      coord: [coord[0], coord[1]],
      data: {
        bankOut: { mapid: data.mapIdInSide, sun: data.sunIdInside, mapIdOutSide: data.mapIdOutSide },
      },
      marker: {
        move: marker.addTo(map),
      },
    });
  }
}

function bpDefineCoord(coordElementId, type, data) {
  const coord = $(coordElementId).data('coord');
  const index = checkIfMapAlreadyExist([coord[0], coord[1]], movementType[type]);
  const marker = L.marker(dofusCoordsToGeoCoords([coord[0], coord[1]]), {
    icon: L.icon({
      iconUrl: path.join(__dirname, `./data/assets/path/${type}/${type}.png`),
      iconAnchor: [
        sizeOf(path.join(__dirname, `./data/assets/path/${type}/${type}.png`)).width / 2,
        sizeOf(path.join(__dirname, `./data/assets/path/${type}/${type}.png`)).height / 2,
      ],
      className: type,
    }),
    zIndexOffset: 10000,
    interactive: false,
  });
  if (index !== null) {
    if (index.data[type]) {
      deleteAction(movementType[type], index, type);
    } else {
      index.data[type] = data;
      index.marker[type] = marker.addTo(map);
    }
    bmHandler(data, coord, marker);
  } else if (type === 'bank') {
    movementType.bank.push({
      coord: [coord[0], coord[1]],
      data: {
        bank: {
          mapIdOutSide: data.mapIdOutSide,
          doorIdOutSide: data.doorIdOutSide,
          mapIdInSide: data.mapIdInSide,
        },
      },
      marker: {
        bank: marker.addTo(map),
      },
    });
    bmHandler(data, coord, marker);
  } else if (type === 'phoenix') {
    movementType[type].push({
      coord: [coord[0], coord[1]],
      data: {
        [type]: data,
      },
      marker: {
        [type]: marker.addTo(map),
      },
    });
  }
}

$('#defineBankCoordConfirm').on('click', () => {
  bpDefineCoord('#defineBankCoord', 'bank', {
    bank: true,
    mapIdOutSide: $('#mapIdOutSide').val(),
    doorIdOutSide: $('#doorIdOutSide').val(),
    mapIdInSide: $('#mapIdInSide').val(),
    sunIdInside: $('#sunIdInside').val(),
  });
});

$('#definePhoenixCoordConfirm').on('click', () => {
  bpDefineCoord('#definePhoenixCoord', 'phoenix', {
    phoenix: true,
    phoenixCellid: $('#phoenixCellid').val(),
  });
});

$('#phoenixPlacement').on('click', (e) => {
  $(e.currentTarget).toggleClass('selected');
  if ($(e.currentTarget).hasClass('selected')) {
    bankLayerGroup.remove();
    phoenixLayerGroup.addTo(map);
    ['top', 'bottom', 'left', 'right', 'delete', 'bankPlacement'].forEach((element) => {
      $(`#${element}`).removeClass('selected');
    });
  } else {
    phoenixLayerGroup.remove();
  }
});

$('#bankPlacement').on('click', (e) => {
  $(e.currentTarget).toggleClass('selected');
  if ($(e.currentTarget).hasClass('selected')) {
    phoenixLayerGroup.remove();
    bankLayerGroup.addTo(map);
    ['top', 'bottom', 'left', 'right', 'delete', 'phoenixPlacement'].forEach((element) => {
      $(`#${element}`).removeClass('selected');
    });
  } else {
    bankLayerGroup.remove();
  }
});

$('#delete').on('click', (e) => {
  $(e.currentTarget).toggleClass('selected');
  if ($(e.currentTarget).hasClass('selected')) {
    phoenixLayerGroup.remove();
    bankLayerGroup.remove();
    ['top', 'bottom', 'left', 'right', 'phoenixPlacement', 'bankPlacement'].forEach((element) => {
      $(`#${element}`).removeClass('selected');
    });
  }
});

$('#top, #bottom, #left, #right').on('click', (e) => {
  $(e.currentTarget).toggleClass('selected');
  if ($(e.currentTarget).hasClass('selected')) {
    phoenixLayerGroup.remove();
    bankLayerGroup.remove();
    ['delete', 'phoenixPlacement', 'bankPlacement'].forEach((element) => {
      $(`#${element}`).removeClass('selected');
    });
  }
});

$('#addPutItem').on('click', () => {
  putGetItem('put');
});

$('#addGetItem').on('click', () => {
  putGetItem('get');
});

$('#minimize-button').on('click', () => {
  remote.getCurrentWindow().minimize();
});

$('#min-max-button').on('click', () => {
  const currentWindow = remote.getCurrentWindow();
  if (currentWindow.isMaximized()) {
    currentWindow.unmaximize();
  } else {
    currentWindow.maximize();
  }
});

$('#close-button').on('click', () => {
  remote.app.quit();
});
