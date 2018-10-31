import sizeOf from 'image-size';
import L from 'leaflet';
import {
  elementWithAutoComplete,
  itemsBank,
  lifeMinMax,
  monsterQuantMinMax,
} from '../events/htmlElementInstance';
import { dofusCoordsToGeoCoords, map, mapList, mapTileLayer } from '../map/map';
import {
  bpGetInformation,
  checkIfMapAlreadyExist,
  deleteAction,
  getIdOfAutoComplete,
  getScale,
  movementType,
} from '../scripts/pathMaker';
import icon from './iconProperties';

const esprima = require('esprima');
const { join } = require('path');
const { readFileSync } = require('fs');

function loadPath(paths, arrayType) {
  Object.values(paths).forEach((mapInfo) => {
    let directions;
    if (Object.prototype.hasOwnProperty.call(mapInfo, 'npcBank')) {
      const coord = [mapList[mapInfo.map].posX, mapList[mapInfo.map].posY];
      const data = bpGetInformation(coord);
      if (Object.prototype.hasOwnProperty.call(mapInfo, 'incarnam')) {
        mapTileLayer.setTileLayer('incarnam');
        const index = checkIfMapAlreadyExist(coord, movementType.incarnam.bank);
        const marker = L.marker(dofusCoordsToGeoCoords(coord), {
          icon: L.icon({
            iconUrl: join(__dirname, '../../../data/assets/path/bank/bank.png'),
            iconAnchor: [
              sizeOf(join(__dirname, '../../../data/assets/path/bank/bank.png')).width / 2,
              sizeOf(join(__dirname, '../../../data/assets/path/bank/bank.png')).height / 2,
            ],
            className: 'bank',
          }),
          zIndexOffset: icon.size.incarnam.bank.zindex,
          interactive: false,
        });
        if (index !== null) {
          if (index.data.bank) {
            deleteAction(movementType.incarnam.bank, index, 'bank');
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
          movementType.incarnam.bank.push({
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
      } else {
        mapTileLayer.setTileLayer('amakna');
        const index = checkIfMapAlreadyExist(coord, movementType.amakna.bank);
        const marker = L.marker(dofusCoordsToGeoCoords(coord), {
          icon: L.icon({
            iconUrl: join(__dirname, '../../../data/assets/path/bank/bank.png'),
            iconAnchor: [
              sizeOf(join(__dirname, '../../../data/assets/path/bank/bank.png')).width / 2,
              sizeOf(join(__dirname, '../../../data/assets/path/bank/bank.png')).height / 2,
            ],
            className: 'bank',
          }),
          zIndexOffset: icon.size.amakna.bank.zindex,
          interactive: false,
        });
        if (index !== null) {
          if (index.data.bank) {
            deleteAction(movementType.amakna.bank, index, 'bank');
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
          movementType.amakna.bank.push({
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
      }
    } else if (Object.prototype.hasOwnProperty.call(mapInfo, 'phenix')) {
      const coord = [
        parseInt(mapInfo.map.split(',')[0], 10),
        parseInt(mapInfo.map.split(',')[1], 10),
      ];
      const data = bpGetInformation(coord);
      if (Object.prototype.hasOwnProperty.call(mapInfo, 'incarnam')) {
        mapTileLayer.setTileLayer('incarnam');
        const index = checkIfMapAlreadyExist(coord, movementType.incarnam.phenix);
        const marker = L.marker(dofusCoordsToGeoCoords(coord), {
          icon: L.icon({
            iconUrl: join(__dirname, '../../../data/assets/path/phenix/phenix.png'),
            iconAnchor: [
              sizeOf(join(__dirname, '../../../data/assets/path/phenix/phenix.png')).width / 2,
              sizeOf(join(__dirname, '../../../data/assets/path/phenix/phenix.png')).height / 2,
            ],
            className: 'phenix',
          }),
          zIndexOffset: icon.size.phenix.zindex,
          interactive: false,
        });
        if (index !== null) {
          if (index.data.phenix) {
            deleteAction(movementType.incarnam.phenix, index, 'phenix');
          } else {
            index.data.phenix = {
              phenix: true,
              mapIdOutSide: data.mapIdOutSide,
              doorIdOutSide: data.doorIdOutSide,
              mapIdInSide: data.mapIdInSide,
              sunIdInside: data.sunIdInside,
            };
            index.marker.phenix = marker.addTo(map);
          }
        } else {
          movementType.amakna.phenix.push({
            coord: [coord[0], coord[1]],
            data: {
              phenix: {
                phenix: true,
                phenixCellid: data.cellId,
                actionAfterRevive: mapInfo.path,
              },
            },
            marker: {
              phenix: marker.addTo(map),
            },
          });
        }
      } else {
        mapTileLayer.setTileLayer('amakna');
        const index = checkIfMapAlreadyExist(coord, movementType.amakna.phenix);
        const marker = L.marker(dofusCoordsToGeoCoords(coord), {
          icon: L.icon({
            iconUrl: join(__dirname, '../../../data/assets/path/phenix/phenix.png'),
            iconAnchor: [
              sizeOf(join(__dirname, '../../../data/assets/path/phenix/phenix.png')).width / 2,
              sizeOf(join(__dirname, '../../../data/assets/path/phenix/phenix.png')).height / 2,
            ],
            className: 'phenix',
          }),
          zIndexOffset: icon.size.phenix.zindex,
          interactive: false,
        });
        if (index !== null) {
          if (index.data.phenix) {
            deleteAction(movementType.amakna.phenix, index, 'phenix');
          } else {
            index.data.phenix = {
              phenix: true,
              mapIdOutSide: data.mapIdOutSide,
              doorIdOutSide: data.doorIdOutSide,
              mapIdInSide: data.mapIdInSide,
              sunIdInside: data.sunIdInside,
            };
            index.marker.phenix = marker.addTo(map);
          }
        } else {
          movementType.amakna.phenix.push({
            coord: [coord[0], coord[1]],
            data: {
              phenix: {
                phenix: true,
                phenixCellid: data.cellId,
                actionAfterRevive: mapInfo.path,
              },
            },
            marker: {
              phenix: marker.addTo(map),
            },
          });
        }
      }
    } else if (
      typeof mapInfo.map === 'number' &&
      mapInfo.map ===
        (bpGetInformation([mapList[mapInfo.map].posX, mapList[mapInfo.map].posY]).mapIdInSide ||
          bpGetInformation([mapList[mapInfo.map].posX, mapList[mapInfo.map].posY]).mapIdOutSide)
    ) {
      const coord = [mapList[mapInfo.map].posX, mapList[mapInfo.map].posY];
      const data = bpGetInformation(coord);
      if (Object.prototype.hasOwnProperty.call(mapInfo, 'incarnam')) {
        mapTileLayer.setTileLayer('incarnam');
        const index = checkIfMapAlreadyExist(coord, movementType.incarnam.move);
        if (index !== null) {
          if (index.data.move) {
            deleteAction(movementType.incarnam.move, index, 'bankOut');
          } else {
            index.data.bankOut = {
              mapid: data.mapIdInSide,
              sun: data.sunIdInside,
              mapIdOutSide: data.mapIdOutSide,
            };
          }
        } else {
          movementType.incarnam.move.push({
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
      } else {
        mapTileLayer.setTileLayer('amakna');
        const index = checkIfMapAlreadyExist(coord, movementType.amakna.move);
        if (index !== null) {
          if (index.data.move) {
            deleteAction(movementType.amakna.move, index, 'bankOut');
          } else {
            index.data.bankOut = {
              mapid: data.mapIdInSide,
              sun: data.sunIdInside,
              mapIdOutSide: data.mapIdOutSide,
            };
          }
        } else {
          movementType.amakna.move.push({
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
      }
    } else if (Object.prototype.hasOwnProperty.call(mapInfo, 'path')) {
      directions = mapInfo.path.split('|');
      directions.forEach((direction) => {
        const coord =
          typeof mapInfo.map === 'string'
            ? [parseInt(mapInfo.map.split(',')[0], 10), parseInt(mapInfo.map.split(',')[1], 10)]
            : [mapList[mapInfo.map].posX, mapList[mapInfo.map].posY];
        const dataType = arrayType;
        let type;
        if (
          Object.prototype.hasOwnProperty.call(mapInfo, 'gather') &&
          Object.prototype.hasOwnProperty.call(mapInfo, 'fight')
        ) {
          type = 'gatherfight';
        } else if (Object.prototype.hasOwnProperty.call(mapInfo, 'gather')) {
          type = 'gather';
        } else if (Object.prototype.hasOwnProperty.call(mapInfo, 'fight')) {
          type = 'fight';
        } else {
          type = arrayType;
        }
        if (Object.prototype.hasOwnProperty.call(mapInfo, 'incarnam')) {
          mapTileLayer.setTileLayer('incarnam');

          const scale = getScale(icon.size.incarnam[arrayType][direction], map.getZoom());
          const index = checkIfMapAlreadyExist(coord, movementType.incarnam[dataType]);
          const marker = L.marker(dofusCoordsToGeoCoords(coord), {
            icon: L.icon({
              iconUrl: icon[direction][type].iconUrl,
              iconSize: [scale.width, scale.height],
              iconAnchor: [scale.marginLeft, scale.topMargin],
              className: direction,
            }),
            zIndexOffset: icon.size.incarnam[dataType].zindex,
            interactive: false,
          });
          if (index !== null) {
            if (index.data[direction]) {
              deleteAction(movementType.incarnam[dataType], index, direction);
            } else {
              index.data[direction] = {
                [type]: true,
              };
              index.marker[direction] = marker.addTo(map);
            }
          } else {
            movementType.incarnam[dataType].push({
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
        } else {
          mapTileLayer.setTileLayer('amakna');
          const scale = getScale(icon.size.amakna[arrayType][direction], map.getZoom());
          const index = checkIfMapAlreadyExist(coord, movementType.amakna[dataType]);
          const marker = L.marker(dofusCoordsToGeoCoords(coord), {
            icon: L.icon({
              iconUrl: icon[direction][type].iconUrl,
              iconSize: [scale.width, scale.height],
              iconAnchor: [scale.marginLeft, scale.topMargin],
              className: direction,
            }),
            zIndexOffset: icon.size.amakna[dataType].zindex,
            interactive: false,
          });
          if (index !== null) {
            if (index.data[direction]) {
              deleteAction(movementType.amakna[dataType], index, direction);
            } else {
              index.data[direction] = {
                [type]: true,
              };
              index.marker[direction] = marker.addTo(map);
            }
          } else {
            movementType.amakna[dataType].push({
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
        }
      });
    } else if (Object.prototype.hasOwnProperty.call(mapInfo, 'door')) {
      const coord =
        typeof mapInfo.map === 'string'
          ? [parseInt(mapInfo.map.split(',')[0], 10), parseInt(mapInfo.map.split(',')[1], 10)]
          : [mapList[mapInfo.map].posX, mapList[mapInfo.map].posY];
      if (bpGetInformation(coord)) return;
      const dataType = arrayType;
      let type;
      if (
        Object.prototype.hasOwnProperty.call(mapInfo, 'gather') &&
        Object.prototype.hasOwnProperty.call(mapInfo, 'fight')
      ) {
        type = 'gatherfight';
      } else if (Object.prototype.hasOwnProperty.call(mapInfo, 'gather')) {
        type = 'gather';
      } else if (Object.prototype.hasOwnProperty.call(mapInfo, 'fight')) {
        type = 'fight';
      } else {
        type = arrayType;
      }
      if (Object.prototype.hasOwnProperty.call(mapInfo, 'incarnam')) {
        mapTileLayer.setTileLayer('incarnam');
        const scale = getScale(icon.size.incarnam[arrayType].door, map.getZoom());
        const index = checkIfMapAlreadyExist(coord, movementType.incarnam[dataType]);
        const marker = L.marker(dofusCoordsToGeoCoords(coord), {
          icon: L.icon({
            iconUrl: icon.door[type].iconUrl,
            iconSize: [scale.width, scale.height],
            iconAnchor: [scale.marginLeft, scale.topMargin],
            className: 'door',
          }),
          zIndexOffset: icon.size.incarnam[dataType].zindex,
          interactive: false,
        });
        if (index !== null) {
          if (index.data.door) {
            deleteAction(movementType.incarnam[dataType], index, 'door');
          } else {
            index.data.door = {
              cellid: mapInfo.door,
            };
            index.marker.door = marker.addTo(map);
          }
        } else {
          movementType.incarnam[dataType].push({
            coord: [coord[0], coord[1]],
            data: {
              door: {
                cellid: mapInfo.door,
              },
            },
            marker: {
              door: marker.addTo(map),
            },
          });
        }
      } else {
        mapTileLayer.setTileLayer('amakna');
        const scale = getScale(icon.size.amakna[arrayType].door, map.getZoom());
        const index = checkIfMapAlreadyExist(coord, movementType.amakna[dataType]);
        const marker = L.marker(dofusCoordsToGeoCoords(coord), {
          icon: L.icon({
            iconUrl: icon.door[type].iconUrl,
            iconSize: [scale.width, scale.height],
            iconAnchor: [scale.marginLeft, scale.topMargin],
            className: 'door',
          }),
          zIndexOffset: icon.size.amakna[dataType].zindex,
          interactive: false,
        });
        if (index !== null) {
          if (index.data.door) {
            deleteAction(movementType.amakna[dataType], index, 'door');
          } else {
            index.data.door = {
              cellid: mapInfo.door,
            };
            index.marker.door = marker.addTo(map);
          }
        } else {
          movementType.amakna[dataType].push({
            coord: [coord[0], coord[1]],
            data: {
              door: {
                cellid: mapInfo.door,
              },
            },
            marker: {
              door: marker.addTo(map),
            },
          });
        }
      }
    }
  });
}

export function getChipsOfId(ids, database) {
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
  const items = JSON.parse(
    readFileSync(join(__dirname, `../../../data/i18n/${$.i18n.language}/Items.json`)),
  );
  $('.delete-item').off();
  const name = itemName || $(`#${type}ItemName`).val();
  const ids = getIdOfAutoComplete(name, items);
  const quant = itemQuant || $(`#${type}ItemQuant`).val();
  if (name.length > 0) {
    const html = `<tr>
    <td><img src="https://ankama.akamaized.net/games/dofus-tablette/assets/2.22.1/gfx/items/${
  ids.iconId
}.png" width="40" height="40"/></td>
    <td>${name}</td>
    <td>${quant}</td>
    <td><a class="waves-effect waves-light btn amber accent-3 delete-item" data-id="${
  ids.id
}">X</a></td>
    </tr>`;
    itemsBank[type].push({
      id: ids.id,
      quantity: parseInt(quant, 10),
    });
    console.log(itemsBank[type]);
    $(`#${type}ItemTable`).append(html);
    $('.delete-item').on('click', (e) => {
      itemsBank[type].splice(
        itemsBank[type].indexOf(parseInt({ item: e.target.dataset.id }, 10)),
        1,
      );
      console.log(itemsBank[type]);
      $(e.target.parentNode.parentNode).remove();
    });
  }
}

function loadSettings(settings) {
  const items = JSON.parse(
    readFileSync(join(__dirname, `../../../data/i18n/${$.i18n.language}/Items.json`)),
  );
  const interactive = JSON.parse(
    readFileSync(join(__dirname, `../../../data/i18n/${$.i18n.language}/Interactives.json`)),
  );
  const monsters = JSON.parse(
    readFileSync(join(__dirname, `../../../data/i18n/${$.i18n.language}/Monsters.json`)),
  );
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
      elementWithAutoComplete.elementToGather[0].addChip({
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
      elementWithAutoComplete.regenItems[0].addChip({
        tag: item,
      });
    });
    $('#regenItemValue').val(settings.AUTO_REGEN.store);
  } else {
    $('#autoRegenCheckbox').prop('checked', false);
  }
  if (
    Object.prototype.hasOwnProperty.call(settings, 'MIN_MONSTERS') &&
    Object.prototype.hasOwnProperty.call(settings, 'MAX_MONSTERS')
  ) {
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
      elementWithAutoComplete.monsterForbidden[0].addChip({
        tag: monster,
      });
    });
  }
  if (Object.prototype.hasOwnProperty.call(settings, 'MANDATORY_MONSTERS')) {
    getChipsOfId(settings.MANDATORY_MONSTERS, monsters).forEach((monster) => {
      elementWithAutoComplete.monsterMandatory[0].addChip({
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
      elementWithAutoComplete.autoDelete[0].addChip({
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
    $('#bankItemTable').html('');
    settings.BANK_PUT_ITEMS.forEach((element) => {
      putGetItem('put', items[element.item].nameId, element.quantity);
    });
  }
  if (Object.prototype.hasOwnProperty.call(settings, 'BANK_GET_ITEMS')) {
    $('#phenixItemTable').html('');
    settings.BANK_GET_ITEMS.forEach((element) => {
      putGetItem('get', items[element.item].nameId, element.quantity);
    });
  }
}

export default function loadScript(script) {
  const scriptEsprima = esprima.parse(script).body;
  const body = {};
  scriptEsprima.forEach((variableDeclaration) => {
    if (variableDeclaration.type === 'VariableDeclaration') {
      variableDeclaration.declarations.forEach((declarations) => {
        if (declarations.init.type === 'ObjectExpression') {
          body[declarations.id.name] = {};
          declarations.init.properties.forEach((properties) => {
            if (properties.value.type === 'ArrayExpression') {
              body[declarations.id.name][properties.key.value || properties.key.name] = [];
              properties.value.elements.forEach((elements) => {
                if (elements.type === 'ObjectExpression') {
                  const props = {};
                  elements.properties.forEach((propertie) => {
                    props[propertie.key.value || propertie.key.name] = propertie.value.value;
                  });
                  body[declarations.id.name][properties.key.value || properties.key.name].push(
                    props,
                  );
                } else if (elements.type === 'Literal') {
                  body[declarations.id.name][properties.key.value || properties.key.name].push(
                    elements.value,
                  );
                }
              });
            } else if (properties.value.type === 'ObjectExpression') {
              const props = {};
              properties.value.properties.forEach((propertie) => {
                if (propertie.value.type === 'ArrayExpression') {
                  props[propertie.key.value || propertie.key.name] = [];
                  propertie.value.elements.forEach((elements) => {
                    props[propertie.key.value || propertie.key.name].push(elements.value);
                  });
                } else {
                  props[propertie.key.value || propertie.key.name] = propertie.value.value;
                }
              });
              body[declarations.id.name][properties.key.value || properties.key.name] = props;
            } else {
              if ((properties.key.value || properties.key.name) === 'map') {
                if (Number(properties.value.value)) {
                  properties.value.value = Number(properties.value.value);
                }
              }
              body[declarations.id.name][properties.key.value || properties.key.name] =
                properties.value.value;
            }
          });
        } else if (declarations.init.type === 'ArrayExpression') {
          body[declarations.id.name] = [];
          declarations.init.elements.forEach((elements) => {
            const props = {};
            elements.properties.forEach((properties) => {
              if ((properties.key.value || properties.key.name) === 'map') {
                if (Number(properties.value.value)) {
                  properties.value.value = Number(properties.value.value);
                }
              }
              props[properties.key.value || properties.key.name] = properties.value.value;
            });
            body[declarations.id.name].push(props);
          });
        }
      });
    }
  });

  console.log(body);

  ['move', 'bank', 'phenix'].forEach((key) => {
    body[key] && loadPath(body[key], key);
  });
  loadSettings(body.config);
}
