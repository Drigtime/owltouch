import L from 'leaflet';
import {
  autoDelete,
  elementToGather,
  itemsBank,
  lifeMinMax,
  monsterForbidden,
  monsterMandatory,
  monsterQuantMinMax,
  regenItems,
} from './htmlElementInstance';
import { dofusCoordsToGeoCoords, map, bankPos, phoenixPos } from './map';

const path = require('path');
const { readFileSync } = require('fs');

const items = JSON.parse(readFileSync(path.join(__dirname, '../../../data/json/d2o/Items.json')));
const monsters = JSON.parse(readFileSync(path.join(__dirname, '../../../data/json/d2o/Monsters.json')));
const interactive = JSON.parse(readFileSync(path.join(__dirname, '../../../data/json/d2o/Interactive.json')));

export const icon = {
  move: ['top', 'bottom', 'left', 'right', 'bank', 'phoenix', 'bankOut'],
  type: ['move', 'gather', 'fight', 'gatherfight', 'bank', 'phoenix'],
  size: {
    move: {
      top: {
        width: 17.22,
        height: 25,
        marginLeft: 17.22 / 2,
        topMargin: 25,
      },
      bottom: {
        width: 17.22,
        height: 25,
        marginLeft: 17.22 / 2,
        topMargin: 0,
      },
      left: {
        width: 32.04,
        height: 17.22,
        marginLeft: 34.75,
        topMargin: 17.22 / 2,
      },
      right: {
        width: 32.04,
        height: 17.22,
        marginLeft: 32.04 - 34.75,
        topMargin: 17.22 / 2,
      },
      zindex: 9999,
    },
    bank: {
      top: {
        width: 17.22,
        height: 25,
        marginLeft: -2.5,
        topMargin: 25,
      },
      bottom: {
        width: 17.22,
        height: 25,
        marginLeft: -2.5,
        topMargin: 0,
      },
      left: {
        width: 32.04,
        height: 17.22,
        marginLeft: 34.75,
        topMargin: -2.5,
      },
      right: {
        width: 32.04,
        height: 17.22,
        marginLeft: 32.04 - 34.75,
        topMargin: -2.5,
      },
      zindex: 9998,
    },
    phoenix: {
      top: {
        width: 17.22,
        height: 25,
        marginLeft: 20,
        topMargin: 25,
      },
      bottom: {
        width: 17.22,
        height: 25,
        marginLeft: 20,
        topMargin: 0,
      },
      left: {
        width: 32.04,
        height: 17.22,
        marginLeft: 34.75,
        topMargin: 20,
      },
      right: {
        width: 32.04,
        height: 17.22,
        marginLeft: 32.04 - 34.75,
        topMargin: 20,
      },
      zindex: 9997,
    },
  },
};

icon.move.forEach((name) => {
  icon[name] = {};
  icon.type.forEach((type) => {
    icon[name][type] = {
      iconUrl: path.join(__dirname, `../../../data/assets/path/${type}/${name}.svg`),
    };
  });
});

export const movementType = {
  move: [],
  bank: [],
  phoenix: [],
};

export function checkIfMapAlreadyExist(coord, array) {
  let returnResult;
  Object.values(array).forEach((mapInfo) => {
    if (mapInfo.coord[0] === coord[0] && mapInfo.coord[1] === coord[1]) {
      returnResult = mapInfo;
    }
  });
  return returnResult || null;
}

export function getScale(size, zoom) {
  let newZoom = zoom;
  switch (newZoom) {
    case 4:
      newZoom = 1;
      break;
    case 3:
      newZoom = 0.5;
      break;
    case 2:
      newZoom = 0.25;
      break;
    case 1:
      newZoom = 0.125;
      break;
    case 0:
      newZoom = 0.0625;
      break;
    default:
      break;
  }
  return {
    width: size.width * newZoom,
    height: size.height * newZoom,
    marginLeft: size.marginLeft * newZoom,
    topMargin: size.topMargin * newZoom,
  };
}

export function resizeMarker() {
  Object.keys(movementType).forEach((dataType) => {
    Object.values(movementType[dataType]).forEach((object) => {
      ['top', 'bottom', 'left', 'right'].forEach((name) => {
        if (!Object.prototype.hasOwnProperty.call(object.marker, name)) return;
        const zoom = getScale(icon.size[dataType][name], map.getZoom());
        object.marker[name].setIcon(
          L.icon({
            iconUrl: object.marker[name]._icon.src,
            iconSize: [zoom.width, zoom.height],
            iconAnchor: [zoom.marginLeft, zoom.topMargin],
            className: name,
          }),
        );
      });
    });
  });
}

export function bpGetInformation(coord) {
  const data = {};
  Object.values(bankPos).forEach((element) => {
    if (element.posX === coord[0] && element.posY === coord[1]) {
      data.mapIdOutSide = element.mapIdOutSide;
      data.mapIdInSide = element.mapIdInSide;
      data.doorIdOutSide = element.doorIdOutSide;
      data.sunIdInside = element.sunIdInside;
    }
  });
  Object.values(phoenixPos).forEach((element) => {
    if (element.posX === coord[0] && element.posY === coord[1]) {
      data.cellId = element.cellId;
    }
  });
  return data;
}

export function deleteAction(dataType, index, name) {
  const newIndex = index;
  if (!Object.prototype.hasOwnProperty.call(newIndex.marker, name) && !(name === 'bankOut')) return;
  if (!(name === 'bankOut')) newIndex.marker[name].remove();
  delete newIndex.data[name];
  if (!(name === 'bankOut')) delete newIndex.marker[name];
  if ($.isEmptyObject(newIndex.data)) dataType.splice(dataType.indexOf(newIndex), 1);
}

export function onMapClick(coord) {
  // loop through list of possible mouvement : ['top', 'bottom', 'left', 'right'],
  icon.move.forEach((name) => {
    if ($(`#${name}`).hasClass('selected')) {
      const dataType = $('#type')[0].selectedOptions[0].dataset.arrayType;
      const scale = getScale(icon.size[dataType][name], map.getZoom());
      const type = $('#type')[0].selectedOptions[0].dataset.type;
      const index = checkIfMapAlreadyExist(coord, movementType[dataType]);
      const arrowMarker = L.marker(dofusCoordsToGeoCoords(coord), {
        icon: L.icon({
          iconUrl: icon[name][type].iconUrl,
          iconSize: [scale.width, scale.height],
          iconAnchor: [scale.marginLeft, scale.topMargin],
          className: name,
        }),
        zIndexOffset: icon.size[dataType].zindex,
        interactive: false,
      });
      if (index !== null) {
        if (index.data[name]) {
          deleteAction(movementType[dataType], index, name);
        } else {
          index.data[name] = {
            [type]: true,
          };
          index.marker[name] = arrowMarker.addTo(map);
        }
      } else {
        movementType[dataType].push({
          coord: [coord[0], coord[1]],
          data: {
            [name]: {
              [type]: true,
            },
          },
          marker: {
            [name]: arrowMarker.addTo(map),
          },
        });
      }
    } else if ($('#delete').hasClass('selected')) {
      let index;
      Object.values(movementType).forEach((dataType) => {
        // get the object {coord: Array(), data: {…}, marker: {…}}
        index = checkIfMapAlreadyExist(coord, dataType);
        if (index !== null) deleteAction(dataType, index, name);
      });
    } else if ($('#phoenixPlacement').hasClass('selected')) {
      const data = bpGetInformation(coord);
      $('#definePhoenixCoord').data('coord', coord);
      $('#phoenixCellid').val(data.cellId);
      $('#definePhoenixCoord').modal('open');
    } else if ($('#bankPlacement').hasClass('selected')) {
      const data = bpGetInformation(coord);
      $('#defineBankCoord').data('coord', coord);
      $('#mapIdOutSide').val(data.mapIdOutSide);
      $('#doorIdOutSide').val(data.doorIdOutSide);
      $('#mapIdInSide').val(data.mapIdInSide);
      $('#sunIdInside').val(data.sunIdInside);
      $('#defineBankCoord').modal('open');
    }
  });
  console.log(coord, movementType);
}

function getIdOfChips(chips, database) {
  const elementIds = [];
  Object.values(chips.chipsData).forEach((data) => {
    Object.values(database).forEach((item) => {
      if (data.tag === item.nameId) {
        elementIds.push(item.id);
      }
    });
  });
  return elementIds;
}

export function getIdOfAutoComplete(value, database) {
  let returnResult;
  Object.values(database).forEach((iterator) => {
    if (value === iterator.nameId) {
      returnResult = {
        id: iterator.id,
        iconId: iterator.iconId,
      };
    }
  });
  return returnResult || null;
}

function generateMove(type) {
  const maps = [];
  movementType[type].forEach((object) => {
    const mapInfo = {};
    const secondarymap = {};
    let firstAction = true;
    mapInfo.map = `${object.coord[0]},${object.coord[1]}`;
    Object.keys(object.data).forEach((key) => {
      if (key === 'bank') {
        mapInfo.map = parseInt(object.data[key].mapIdOutSide, 10);
        mapInfo.door = parseInt(object.data[key].doorIdOutSide, 10);
        secondarymap.map = parseInt(object.data[key].mapIdInSide, 10);
        secondarymap.npcBank = true;
        return;
      }
      if (key === 'phoenix') {
        mapInfo.phoenix = parseInt(object.data[key].phoenixCellid, 10);
        return;
      }
      if (key === 'bankOut') {
        secondarymap.map = parseInt(object.data[key].mapid, 10);
        secondarymap.path = object.data[key].sun;
        if (object.data.top || object.data.bottom || object.data.left || object.data.right) {
          mapInfo.map = parseInt(object.data[key].mapIdOutSide, 10);
        }
        return;
      }
      if (firstAction) {
        mapInfo.path = `${key}`;
      } else {
        mapInfo.path += `|${key}`;
      }
      if (object.data[key].gather) {
        mapInfo.gather = true;
      } else if (object.data[key].fight) {
        mapInfo.fight = true;
      } else if (object.data[key].gatherfight) {
        mapInfo.gather = true;
        mapInfo.fight = true;
      }
      firstAction = false;
    });
    $.isEmptyObject(secondarymap) ? maps.push(mapInfo) : maps.push(mapInfo, secondarymap);
  });
  return maps;
}

export function generateScript() {
  const config = {
    information: {
      author: $('#scriptAuthor').val(),
      name: $('#scriptName').val(),
      type: $('#scriptType').val(),
      area: $('#scriptArea').val(),
      job: $('#scriptJob').val(),
    },
    monster: {
      min: monsterQuantMinMax.noUiSlider.get()[0],
      max: monsterQuantMinMax.noUiSlider.get()[1],
      minLevel: parseInt($('#monsterMin').val(), 10),
      maxLevel: parseInt($('#monsterMax').val(), 10),
      forbiddenMonsters: getIdOfChips(monsterForbidden, monsters),
      mandatoryMonsters: getIdOfChips(monsterMandatory, monsters),
      maxFightPerMap: parseInt($('#maxFightPerMapValue').val(), 10),
    },
    bank: {
      putKamas: parseInt($('#putKamasValue').val(), 10),
      getKamas: parseInt($('#getKamasValue').val(), 10),
      putItems: itemsBank.put,
      getItems: itemsBank.get,
    },
    autoRegen: {
      minLife: lifeMinMax.noUiSlider.get()[0],
      maxLife: lifeMinMax.noUiSlider.get()[1],
      items: getIdOfChips(regenItems, items),
      store: parseInt($('#regenItemValue').val(), 10),
    },
    display: {
      gather: $('#displayGatherCountCheckbox').prop('checked'),
      fight: $('#displayFightCountCheckbox').prop('checked'),
    },
    paths: {
      move: JSON.stringify(generateMove('move'))
        .replace(/({.+?}(?:,|))/g, '\n\t$&')
        .replace(/}\]/g, '}\n]'),
      bank: JSON.stringify(generateMove('bank'))
        .replace(/({.+?}(?:,|))/g, '\n\t$&')
        .replace(/}\]/g, '}\n]'),
      phoenix: JSON.stringify(generateMove('phoenix'))
        .replace(/({.+?}(?:,|))/g, '\n\t$&')
        .replace(/}\]/g, '}\n]'),
    },
    delete: getIdOfChips(autoDelete, items),
    maxPods: parseInt($('#maxPods').val(), 10),
    openBags: $('#openBagsCheckbox').prop('checked'),
    elementToGather: getIdOfChips(elementToGather, interactive),
  };

  const configScript = {
    MAX_PODS: config.maxPods,
    MIN_MONSTERS: config.monster.min,
    MAX_MONSTERS: config.monster.max,
    MAX_MONSTERS_LEVEL: config.monster.minLevel,
    MIN_MONSTERS_LEVEL: config.monster.maxLevel,
    FORBIDDEN_MONSTERS: config.monster.forbiddenMonsters,
    MANDATORY_MONSTERS: config.monster.mandatoryMonsters,
    ELEMENTS_TO_GATHER: config.elementToGather,
    BANK_PUT_ITEMS: config.bank.putItems,
    BANK_GET_ITEMS: config.bank.getItems,
    AUTO_DELETE: config.delete,
    OPEN_BAGS: config.openBags,
    DISPLAY_GATHER_COUNT: config.display.gather,
    DISPLAY_FIGHT_COUNT: config.display.fight,
  };
  if ($('#maxFightPerMapCheckbox').prop('checked')) {
    configScript.MAX_FIGHTS_PER_MAP = config.monster.maxFightPerMap;
  }
  if ($('#putKamasCheckbox').prop('checked')) {
    configScript.BANK_PUT_KAMAS = config.bank.putKamas;
  }
  if ($('#getKamasCheckbox').prop('checked')) {
    configScript.BANK_GET_KAMAS = config.bank.getKamas;
  }
  if ($('#autoRegenCheckbox').prop('checked')) {
    configScript.AUTO_REGEN = {
      minLife: config.autoRegen.minLife,
      maxLife: config.autoRegen.maxLife,
      items: config.autoRegen.items,
      store: config.autoRegen.store,
    };
  }
  const script = `//---------------------------------------------
//-- Script created with OwlTouch
//---------------------------------------------
//-- Créateur : ${config.information.author}
//-- Type : ${config.information.type}
//-- Zone : ${config.information.area}
//-- Métier : ${config.information.job}
//---------------------------------------------
const config = ${JSON.stringify(configScript, null, 4)}

const move = ${config.paths.move}

const bank = ${config.paths.bank}

const phoenix = ${config.paths.phoenix}`;
  return script;
}
