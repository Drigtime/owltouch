import sizeOf from 'image-size';
import L from 'leaflet';
import { autoDelete, elementToGather, itemsBank, lifeMinMax, monsterForbidden, monsterMandatory, monsterQuantMinMax, regenItems } from '../events/htmlElementInstance';
import { dofusCoordsToGeoCoords, map, mapList } from '../map/map';
import { bpGetInformation, checkIfMapAlreadyExist, deleteAction, getScale, icon, movementType, getIdOfAutoComplete } from '../scripts/pathMaker';

const path = require('path');
const { readFileSync } = require('fs');

const items = JSON.parse(readFileSync(path.join(__dirname, '../../../data/json/d2o/Items.json')));
const monsters = JSON.parse(readFileSync(path.join(__dirname, '../../../data/json/d2o/Monsters.json')));
const interactive = JSON.parse(readFileSync(path.join(__dirname, '../../../data/json/d2o/Interactive.json')));

function loadPath(paths, arrayType) {
  Object.values(paths).forEach((mapInfo) => {
    let directions;
    if (Object.prototype.hasOwnProperty.call(mapInfo, 'npcBank')) {
      const coord = [mapList[mapInfo.map].posX, mapList[mapInfo.map].posY];
      const data = bpGetInformation(coord);
      const index = checkIfMapAlreadyExist(coord, movementType.bank);
      const marker = L.marker(dofusCoordsToGeoCoords(coord), {
        icon: L.icon({
          iconUrl: path.join(__dirname, '../../../data/assets/path/bank/bank.png'),
          iconAnchor: [
            sizeOf(path.join(__dirname, '../../../data/assets/path/bank/bank.png')).width / 2,
            sizeOf(path.join(__dirname, '../../../data/assets/path/bank/bank.png')).height / 2,
          ],
          className: 'bank',
        }),
        zIndexOffset: icon.size.bank.zindex,
        interactive: false,
      });
      if (index !== null) {
        if (index.data.bank) {
          deleteAction(movementType.bank, index, 'bank');
        } else {
          index.data.bank = {
            bank: true,
            mapIdOutSide: data.mapIdOutSide,
            doorIdOutSide: data.doorIdOutSide,
            mapIdInSide: data.mapIdInSide,
            sunIdInside: data.sunIdInside,
          };
          index.marker.bank = marker.addTo(map);
        }
      } else {
        movementType.bank.push({
          coord: [coord[0], coord[1]],
          data: {
            bank: {
              bank: true,
              mapIdOutSide: data.mapIdOutSide,
              doorIdOutSide: data.doorIdOutSide,
              mapIdInSide: data.mapIdInSide,
              sunIdInside: data.sunIdInside,
            },
          },
          marker: {
            bank: marker.addTo(map),
          },
        });
      }
    } else if (Object.prototype.hasOwnProperty.call(mapInfo, 'phoenix')) {
      const coord = [parseInt(mapInfo.map.split(',')[0], 10), parseInt(mapInfo.map.split(',')[1], 10)];
      const data = bpGetInformation(coord);
      const index = checkIfMapAlreadyExist(coord, movementType.phoenix);
      const marker = L.marker(dofusCoordsToGeoCoords(coord), {
        icon: L.icon({
          iconUrl: path.join(__dirname, '../../../data/assets/path/phoenix/phoenix.png'),
          iconAnchor: [
            sizeOf(path.join(__dirname, '../../../data/assets/path/phoenix/phoenix.png')).width / 2,
            sizeOf(path.join(__dirname, '../../../data/assets/path/phoenix/phoenix.png')).height / 2,
          ],
          className: 'phoenix',
        }),
        zIndexOffset: icon.size.phoenix.zindex,
        interactive: false,
      });
      if (index !== null) {
        if (index.data.phoenix) {
          deleteAction(movementType.phoenix, index, 'phoenix');
        } else {
          index.data.phoenix = {
            phoenix: true,
            mapIdOutSide: data.mapIdOutSide,
            doorIdOutSide: data.doorIdOutSide,
            mapIdInSide: data.mapIdInSide,
            sunIdInside: data.sunIdInside,
          };
          index.marker.phoenix = marker.addTo(map);
        }
      } else {
        movementType.phoenix.push({
          coord: [coord[0], coord[1]],
          data: {
            phoenix: {
              phoenix: true,
              phoenixCellid: data.cellId,
              actionAfterRevive: mapInfo.path,
            },
          },
          marker: {
            phoenix: marker.addTo(map),
          },
        });
      }
    } else if (typeof mapInfo.map === 'number' && mapInfo.map === (bpGetInformation([mapList[mapInfo.map].posX, mapList[mapInfo.map].posY]).mapIdInSide || bpGetInformation([mapList[mapInfo.map].posX, mapList[mapInfo.map].posY]).mapIdOutSide)) {
      const coord = [mapList[mapInfo.map].posX, mapList[mapInfo.map].posY];
      const data = bpGetInformation(coord);
      const index = checkIfMapAlreadyExist(coord, movementType.move);
      if (index !== null) {
        if (index.data.move) {
          deleteAction(movementType.move, index, 'bankOut');
        } else {
          index.data.bankOut = {
            mapid: data.mapIdInSide,
            sun: data.sunIdInside,
            mapIdOutSide: data.mapIdOutSide,
          };
        }
      } else {
        movementType.move.push({
          coord: [coord[0], coord[1]],
          data: {
            bankOut: {
              mapid: data.mapIdInSide,
              sun: data.sunIdInside,
              mapIdOutSide: data.mapIdOutSide,
            },
          },
        });
      }
    } else if (Object.prototype.hasOwnProperty.call(mapInfo, 'path')) {
      directions = mapInfo.path.split('|');
      directions.forEach((direction) => {
        const coord =
          typeof mapInfo.map === 'string'
            ? [parseInt(mapInfo.map.split(',')[0], 10), parseInt(mapInfo.map.split(',')[1], 10)]
            : [mapList[mapInfo.map].posX, mapList[mapInfo.map].posY];
        const dataType = arrayType;
        const scale = getScale(icon.size[arrayType][direction], map.getZoom());
        let type;
        if (Object.prototype.hasOwnProperty.call(mapInfo, 'gather') && Object.prototype.hasOwnProperty.call(mapInfo, 'fight')) {
          type = 'gatherfight';
        } else if (Object.prototype.hasOwnProperty.call(mapInfo, 'gather')) {
          type = 'gather';
        } else if (Object.prototype.hasOwnProperty.call(mapInfo, 'fight')) {
          type = 'fight';
        } else {
          type = arrayType;
        }
        const index = checkIfMapAlreadyExist(coord, movementType[dataType]);
        const marker = L.marker(dofusCoordsToGeoCoords(coord), {
          icon: L.icon({
            iconUrl: icon[direction][type].iconUrl,
            iconSize: [scale.width, scale.height],
            iconAnchor: [scale.marginLeft, scale.topMargin],
            className: direction,
          }),
          zIndexOffset: icon.size[dataType].zindex,
          interactive: false,
        });
        if (index !== null) {
          if (index.data[direction]) {
            deleteAction(movementType[dataType], index, direction);
          } else {
            index.data[direction] = {
              [type]: true,
            };
            index.marker[direction] = marker.addTo(map);
          }
        } else {
          movementType[dataType].push({
            coord: [coord[0], coord[1]],
            data: {
              [direction]: {
                [type]: true,
              },
            },
            marker: {
              [direction]: marker.addTo(map),
            },
          });
        }
      });
    }
  });
}

function getChipsOfId(ids, database) {
  const list = [];
  Object.values(database).forEach((element) => {
    Object.values(ids).forEach((id) => {
      if (element.id === id) {
        list.push(element.nameId);
      }
    });
  });
  return list;
}


export function putGetItem(type, itemName, itemQuant) {
  $('.delete-item').off();
  const name = itemName || $(`#${type}ItemName`).val();
  const ids = getIdOfAutoComplete(name, items);
  const quant = itemQuant || $(`#${type}ItemQuant`).val();
  if (name.length > 0) {
    const html = `<tr>
    <td><img src="https://ankama.akamaized.net/games/dofus-tablette/assets/2.22.1/gfx/items/${ids.iconId}.png" width="40" height="40"/></td>
    <td>${name}</td>
    <td>${quant}</td>
    <td><a class="waves-effect waves-light btn amber accent-3 delete-item" data-id="${ids.id}">X</a></td>
    </tr>`;
    itemsBank[type].push({
      item: ids.id,
      quantity: parseInt(quant, 10),
    });
    console.log(itemsBank[type]);
    $(`#${type}ItemTable`).append(html);
    $('.delete-item').on('click', (e) => {
      itemsBank[type].splice(itemsBank[type].indexOf(parseInt({ item: e.target.dataset.id }, 10)), 1);
      console.log(itemsBank[type]);
      $(e.target.parentNode.parentNode).remove();
    });
  }
}

function loadSettings(settings, info) {
  if (Object.prototype.hasOwnProperty.call(settings, 'DISPLAY_GATHER_COUNT')) {
    $('#displayGatherCountCheckbox').prop('checked', !!settings.DISPLAY_GATHER_COUNT);
  } else {
    $('#displayGatherCountCheckbox').prop('checked', false);
  }
  if (Object.prototype.hasOwnProperty.call(settings, 'OPEN_BAGS')) {
    $('#openBagsCheckbox').prop('checked', !!settings.OPEN_BAGS);
  } else {
    $('#openBagsCheckbox').prop('checked', false);
  }
  if (Object.prototype.hasOwnProperty.call(settings, 'ELEMENTS_TO_GATHER')) {
    getChipsOfId(settings.ELEMENTS_TO_GATHER, interactive).forEach((resource) => {
      elementToGather.addChip({
        tag: resource,
      });
    });
  }
  if (Object.prototype.hasOwnProperty.call(settings, 'DISPLAY_FIGHT_COUNT')) {
    $('#displayFightCountCheckbox').prop('checked', !!settings.DISPLAY_FIGHT_COUNT);
  } else {
    $('#displayFightCountCheckbox').prop('checked', false);
  }
  if (Object.prototype.hasOwnProperty.call(settings, 'AUTO_REGEN')) {
    $('#autoRegenCheckbox').prop('checked', true);
    lifeMinMax.noUiSlider.set([settings.AUTO_REGEN.minLife, settings.AUTO_REGEN.maxLife]);
    getChipsOfId(settings.AUTO_REGEN.items, items).forEach((item) => {
      regenItems.addChip({
        tag: item,
      });
    });
    $('#regenItemValue').val(settings.AUTO_REGEN.store);
  } else {
    $('#autoRegenCheckbox').prop('checked', false);
  }
  if (Object.prototype.hasOwnProperty.call(settings, 'MIN_MONSTERS') && Object.prototype.hasOwnProperty.call(settings, 'MAX_MONSTERS')) {
    monsterQuantMinMax.noUiSlider.set([settings.MIN_MONSTERS, settings.MAX_MONSTERS]);
  }
  if (Object.prototype.hasOwnProperty.call(settings, 'MIN_MONSTERS_LEVEL')) {
    $('#monsterMin').val(settings.MIN_MONSTERS_LEVEL);
  }
  if (Object.prototype.hasOwnProperty.call(settings, 'MAX_MONSTERS_LEVEL')) {
    $('#monsterMax').val(settings.MAX_MONSTERS_LEVEL);
  }
  if (Object.prototype.hasOwnProperty.call(settings, 'FORBIDDEN_MONSTERS')) {
    getChipsOfId(settings.FORBIDDEN_MONSTERS, monsters).forEach((monster) => {
      monsterForbidden.addChip({
        tag: monster,
      });
    });
  }
  if (Object.prototype.hasOwnProperty.call(settings, 'MANDATORY_MONSTERS')) {
    getChipsOfId(settings.MANDATORY_MONSTERS, monsters).forEach((monster) => {
      monsterMandatory.addChip({
        tag: monster,
      });
    });
  }
  if (Object.prototype.hasOwnProperty.call(settings, 'MAX_FIGHTS_PER_MAP')) {
    $('#maxFightPerMapCheckbox').prop('checked', true);
    $('#maxFightPerMapValue').val(settings.MAX_FIGHTS_PER_MAP);
  } else {
    $('#maxFightPerMapCheckbox').prop('checked', false);
  }
  if (Object.prototype.hasOwnProperty.call(settings, 'MAX_PODS')) {
    $('#maxPods').val(settings.MAX_PODS);
  }
  if (Object.prototype.hasOwnProperty.call(settings, 'AUTO_DELETE')) {
    getChipsOfId(settings.AUTO_DELETE, items).forEach((item) => {
      autoDelete.addChip({
        tag: item,
      });
    });
  }
  if (Object.prototype.hasOwnProperty.call(settings, 'BANK_PUT_KAMAS')) {
    $('#putKamasCheckbox').prop('checked', true);
    $('#putKamasValue').val(settings.BANK_PUT_KAMAS);
  } else {
    $('#putKamasCheckbox').prop('checked', false);
  }
  if (Object.prototype.hasOwnProperty.call(settings, 'BANK_GET_KAMAS')) {
    $('#getKamasCheckbox').prop('checked', true);
    $('#getKamasValue').val(settings.BANK_GET_KAMAS);
  } else {
    $('#getKamasCheckbox').prop('checked', false);
  }
  if (Object.prototype.hasOwnProperty.call(settings, 'BANK_PUT_ITEMS')) {
    settings.BANK_PUT_ITEMS.forEach((element) => {
      putGetItem('put', items[element.item].nameId, element.quantity);
    });
  }
  if (Object.prototype.hasOwnProperty.call(settings, 'BANK_GET_ITEMS')) {
    settings.BANK_GET_ITEMS.forEach((element) => {
      putGetItem('get', items[element.item].nameId, element.quantity);
    });
  }
  $('#scriptAuthor').val(info.author);
  $('#scriptName').val(info.name);
  $('#scriptType').val(info.type);
  $('#scriptArea').val(info.area);
  $('#scriptJob').val(info.job);
}

export default function loadScript(script) {
  const scriptTemp = script
    .replace(/(?!")map(?!")/g, '"map"')
    .replace(/(?!")path(?!")/g, '"path"')
    .replace(/(?!")door(?!")/g, '"door"')
    .replace(/(?!")gather(?!")/g, '"gather"')
    .replace(/(?!")fight(?!")/g, '"fight"')
    .replace(/(?!")phoenix(?!")/g, '"phoenix"')
    .replace(/(?!")npcBank(?!")/g, '"npcBank"')
    .replace(/(?!")MAX_PODS(?!")/g, '"MAX_PODS"')
    .replace(/(?!")MAX_MONSTERS_LEVEL(?!")/g, '"MAX_MONSTERS_LEVEL"')
    .replace(/(?!")MIN_MONSTERS_LEVEL(?!")/g, '"MIN_MONSTERS_LEVEL"')
    .replace(/(?!")MIN_MONSTERS(?!"|_)/g, '"MIN_MONSTERS"')
    .replace(/(?!")MAX_MONSTERS(?!"|_)/g, '"MAX_MONSTERS"')
    .replace(/(?!")FORBIDDEN_MONSTERS(?!")/g, '"FORBIDDEN_MONSTERS"')
    .replace(/(?!")MANDATORY_MONSTERS(?!")/g, '"MANDATORY_MONSTERS"')
    .replace(/(?!")ELEMENTS_TO_GATHER(?!")/g, '"ELEMENTS_TO_GATHER"')
    .replace(/(?!")BANK_PUT_ITEMS(?!")/g, '"BANK_PUT_ITEMS"')
    .replace(/(?!")BANK_GET_ITEMS(?!")/g, '"BANK_GET_ITEMS"')
    .replace(/(?!")AUTO_DELETE(?!")/g, '"AUTO_DELETE"')
    .replace(/(?!")OPEN_BAGS(?!")/g, '"OPEN_BAGS"')
    .replace(/(?!")DISPLAY_GATHER_COUNT(?!")/g, '"DISPLAY_GATHER_COUNT"')
    .replace(/(?!")DISPLAY_FIGHT_COUNT(?!")/g, '"DISPLAY_FIGHT_COUNT"')
    .replace(/(?!")MAX_FIGHTS_PER_MAP(?!")/g, '"MAX_FIGHTS_PER_MAP"')
    .replace(/(?!")BANK_PUT_KAMAS(?!")/g, '"BANK_PUT_KAMAS"')
    .replace(/(?!")BANK_GET_KAMAS(?!")/g, '"BANK_GET_KAMAS"')
    .replace(/(?!")AUTO_REGEN(?!")/g, '"AUTO_REGEN"')
    .replace(/(?!")minLife(?!")/g, '"minLife"')
    .replace(/(?!")maxLife(?!")/g, '"maxLife"')
    .replace(/(?!")items(?!")/g, '"items"')
    .replace(/(?!")store(?!")/g, '"store"')
    .replace(/,(?:\s*?)(\]|})/g, '\n$1');

  const regex = {
    move: /move(?:[\s\S]*?)=(?:[\s\S]*?)(\[[\s\S]*?\])/gm.exec(scriptTemp),
    bank: /bank(?:[\s\S]*?)=(?:[\s\S]*?)(\[[\s\S]*?\])/gm.exec(scriptTemp),
    phoenix: /phoenix(?:[\s\S]*?)=(?:[\s\S]*?)(\[[\s\S]*?\])/gm.exec(scriptTemp),
    settings: /config(?:[\s\S]*?)=(?:[\s\S]*?)({[\s\S]*\n[\s]*?})[\s\S]*?(?:const|let|var|function|async)/gm.exec(scriptTemp),
    author: /Créateur(?:[\s\S]*?):(?:[\s\S]*?)\b([\w\d]*?)\n/g.exec(scriptTemp),
    name: /Name(?:[\s\S]*?):(?:[\s\S]*?)\b([\w\d]*?)\n/g.exec(scriptTemp),
    type: /Type(?:[\s\S]*?):(?:[\s\S]*?)\b([\w\d]*?)\n/g.exec(scriptTemp),
    area: /Zone(?:[\s\S]*?):(?:[\s\S]*?)\b([\w\d]*?)\n/g.exec(scriptTemp),
    job: /Métier(?:[\s\S]*?):(?:[\s\S]*?)\b([\w\d]*?)\n/g.exec(scriptTemp),
  };

  const config = {
    paths: {
      move: regex.move ? JSON.parse(regex.move[1]) : [],
      bank: regex.bank ? JSON.parse(regex.bank[1]) : [],
      phoenix: regex.phoenix ? JSON.parse(regex.phoenix[1]) : [],
    },
  };
  const settings = regex.settings ? JSON.parse(regex.settings[1]) : {};
  const srciptInfo = {
    author: regex.author ? regex.author[1] : '',
    name: regex.name ? regex.name[1] : '',
    type: regex.type ? regex.type[1] : '',
    area: regex.area ? regex.area[1] : '',
    job: regex.job ? regex.job[1] : '',
  };
  console.log(config.paths.move, config.paths.bank, config.paths.phoenix);
  Object.keys(config.paths).forEach((key) => {
    loadPath(config.paths[key], key);
  });
  loadSettings(settings, srciptInfo);
}
