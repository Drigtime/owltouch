import L from 'leaflet';
import { bpLayers, dofusCoordsToGeoCoords, map, mapTileLayer } from '../map/map';
import { checkIfMapAlreadyExist, deleteAction, getScale, movementType } from '../scripts/pathMaker';
import icon from '../scripts/iconProperties';

const sizeOf = require('image-size');
const path = require('path');

function bmHandler(data, coord, marker) {
  const indexBankOut = checkIfMapAlreadyExist(
    [coord[0], coord[1]],
    movementType[mapTileLayer.actualLayerName].move,
  );
  if (indexBankOut !== null) {
    if (indexBankOut.data.bankOut) {
      deleteAction(movementType[mapTileLayer.actualLayerName].move, indexBankOut, 'bankOut');
    } else {
      indexBankOut.data.bankOut = {
        mapid: data.mapIdInSide,
        sun: data.sunIdInside,
        mapIdOutSide: data.mapIdOutSide,
      };
    }
  } else {
    movementType[mapTileLayer.actualLayerName].move.push({
      coord: [coord[0], coord[1]],
      data: {
        bankOut: {
          mapid: data.mapIdInSide,
          sun: data.sunIdInside,
          mapIdOutSide: data.mapIdOutSide,
        },
      },
      marker: {
        move: marker.addTo(map),
      },
    });
  }
}

function bpDefineCoord(coordElementId, type, data) {
  const coord = $(coordElementId).data('coord');
  const index = checkIfMapAlreadyExist(
    [coord[0], coord[1]],
    movementType[mapTileLayer.actualLayerName][type],
  );
  const marker = L.marker(dofusCoordsToGeoCoords([coord[0], coord[1]]), {
    icon: L.icon({
      iconUrl: path.join(__dirname, `../../../data/assets/path/${type}/${type}.png`),
      iconAnchor: [
        sizeOf(path.join(__dirname, `../../../data/assets/path/${type}/${type}.png`)).width / 2,
        sizeOf(path.join(__dirname, `../../../data/assets/path/${type}/${type}.png`)).height / 2,
      ],
      className: type,
    }),
    zIndexOffset: 10000,
    interactive: false,
  });
  if (index !== null) {
    if (index.data[type]) {
      deleteAction(movementType[mapTileLayer.actualLayerName][type], index, type);
    } else {
      index.data[type] = data;
      index.marker[type] = marker.addTo(map);
    }
    bmHandler(data, coord, marker);
  } else if (type === 'bank') {
    movementType[mapTileLayer.actualLayerName].bank.push({
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
  } else if (type === 'phenix') {
    movementType[mapTileLayer.actualLayerName][type].push({
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

$('#definePhenixCoordConfirm').on('click', () => {
  bpDefineCoord('#definePhenixCoord', 'phenix', {
    phenix: true,
    phenixCellid: $('#phenixCellid').val(),
  });
});

$('#doorCellidModalConfirm').on('click', () => {
  const dataType = $('#type')[0].selectedOptions[0].dataset.arrayType;
  const coord = $('#doorCellidModal').data('coord');
  const scale = getScale(icon.size[mapTileLayer.actualLayerName][dataType].door, map.getZoom());
  const type = $('#type')[0].selectedOptions[0].dataset.type;
  const index = checkIfMapAlreadyExist(coord, movementType[mapTileLayer.actualLayerName][dataType]);
  const arrowMarker = L.marker(dofusCoordsToGeoCoords(coord), {
    icon: L.icon({
      iconUrl: icon.door[type].iconUrl,
      iconSize: [scale.width, scale.height],
      iconAnchor: [scale.marginLeft, scale.topMargin],
      className: name,
    }),
    zIndexOffset: icon.size[mapTileLayer.actualLayerName][dataType].zindex,
    interactive: false,
  });
  if (index !== null) {
    if (index.data.door) {
      deleteAction(movementType[mapTileLayer.actualLayerName][dataType], index, 'door');
    } else {
      index.data.door = {
        cellid: $('#doorCellid').val(),
      };
      index.marker.door = arrowMarker.addTo(map);
    }
  } else {
    movementType[mapTileLayer.actualLayerName][dataType].push({
      coord: [coord[0], coord[1]],
      data: {
        door: {
          cellid: $('#doorCellid').val(),
        },
      },
      marker: {
        door: arrowMarker.addTo(map),
      },
    });
  }
});

$('#phenixPlacement').on('click', (e) => {
  $(e.currentTarget).toggleClass('selected');
  if ($(e.currentTarget).hasClass('selected')) {
    bpLayers.bank.remove();
    bpLayers.phenix.addTo(map);
    ['top', 'bottom', 'left', 'right', 'door', 'delete', 'bankPlacement'].forEach((element) => {
      $(`#${element}`).removeClass('selected');
    });
  } else {
    bpLayers.phenix.remove();
  }
});

$('#bankPlacement').on('click', (e) => {
  $(e.currentTarget).toggleClass('selected');
  if ($(e.currentTarget).hasClass('selected')) {
    bpLayers.phenix.remove();
    bpLayers.bank.addTo(map);
    ['top', 'bottom', 'left', 'right', 'door', 'delete', 'phenixPlacement'].forEach((element) => {
      $(`#${element}`).removeClass('selected');
    });
  } else {
    bpLayers.bank.remove();
  }
});

$('#delete').on('click', (e) => {
  $(e.currentTarget).toggleClass('selected');
  if ($(e.currentTarget).hasClass('selected')) {
    bpLayers.phenix.remove();
    bpLayers.bank.remove();
    ['top', 'bottom', 'left', 'right', 'door', 'phenixPlacement', 'bankPlacement'].forEach(
      (element) => {
        $(`#${element}`).removeClass('selected');
      },
    );
  }
});

$('#top, #bottom, #left, #right, #door').on('click', (e) => {
  $(e.currentTarget).toggleClass('selected');
  if ($(e.currentTarget).hasClass('selected')) {
    bpLayers.phenix.remove();
    bpLayers.bank.remove();
    ['delete', 'phenixPlacement', 'bankPlacement'].forEach((element) => {
      $(`#${element}`).removeClass('selected');
    });
  }
});
