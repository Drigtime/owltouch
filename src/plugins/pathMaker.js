const icon = {
  move: ['top', 'bottom', 'left', 'right'],
  type: ['move', 'gather', 'fight', 'bank', 'phoenix'],
  size: {
    path: {
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
      iconUrl: `./data/assets/path/${type}/${name}.svg`,
    };
  });
});

const movementType = {
  path: [],
  bank: [],
  phoenix: [],
};

const checkIfMapAlreadyExist = (coord, array) => {
  for (const map of Object.values(array)) {
    if (map.coord[0] === coord[0] && map.coord[1] === coord[1]) {
      return map;
    }
  }
  return null;
};

const getScale = (size, zoom) => {
  switch (zoom) {
    case 4:
      zoom = 1;
      break;
    case 3:
      zoom = 0.5;
      break;
    case 2:
      zoom = 0.25;
      break;
    case 1:
      zoom = 0.125;
      break;
    case 0:
      zoom = 0.0625;
      break;
    default:
      break;
  }
  return {
    width: size.width * zoom,
    height: size.height * zoom,
    marginLeft: size.marginLeft * zoom,
    topMargin: size.topMargin * zoom,
  };
};

const resizeMarker = () => {
  Object.keys(movementType).forEach((dataType) => {
    Object.values(movementType[dataType]).forEach((object) => {
      icon.move.forEach((name) => {
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
};

const deleteAction = (dataType, index, name) => {
  if (!Object.prototype.hasOwnProperty.call(index.marker, name)) return;
  index.marker[name].remove();
  delete index.data[name];
  delete index.marker[name];
  if ($.isEmptyObject(index.data)) dataType.splice(dataType.indexOf(index), 1);
};

const onMapClick = (coord) => {
  console.log(coord);
  icon.move.forEach((name) => {
      // loop through list of possible mouvement : ['top', 'bottom', 'left', 'right'],
    if ($(`#${name}`).hasClass('selected')) {
      const dataType = $('#type')[0].selectedOptions[0].dataset.arrayType;
      const scale = getScale(icon.size[dataType][name], map.getZoom());
      const type = $('#type')[0].selectedOptions[0].dataset.type;
      const index = checkIfMapAlreadyExist(coord, movementType[dataType]);
      const arrowMarker = L.marker(dofusCoordsToGeoCoords([coord[0], coord[1]]), {
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
        index = checkIfMapAlreadyExist(coord, dataType);
        if (index !== null) deleteAction(dataType, index, name);
      });
    }
  });
  console.log(movementType);
};

const getIdOfChips = (chips, database) => {
  const elementIds = [];
  Object.values(chips.chipsData).forEach((data) => {
    Object.values(database).forEach((item) => {
      if (data.tag === item.nameId) {
        elementIds.push(item.id);
      }
    });
  });
  return elementIds;
};

const getIdOfAutoComplete = (value, database) => {
  let elementIds = {};
  for (const iterator of Object.values(database)) {
    if (value == iterator.nameId) {
      elementIds = {
        id: iterator.id,
        iconId: iterator.iconId,
      };
      return elementIds;
    }
  }
};

const generateMove = (type) => {
  const maps = [];
  movementType[type].forEach((object) => {
    const map = {};
    let firstAction = true;
    map.map = `${object.coord[0]},${object.coord[1]}`;
    map.path = '';
    Object.keys(object.data).forEach((key) => {
      if (firstAction) {
        map.path += `${key}`;
      } else {
        map.path += `|${key}`;
      }
      if (object.data[key].gather) { map.gather = true; } else if (object.data[key].fight) { map.fight = true; }
      firstAction = false;
    });
    maps.push(map);
  });
  return maps;
};

const generateScript = () => {
  const config = {
    information: {
      author: document.querySelector('#scriptAuthor').value,
      name: document.querySelector('#scriptName').value,
      type: document.querySelector('#scriptType').value,
      area: document.querySelector('#scriptArea').value,
      job: document.querySelector('#scriptJob').value,
    },
    monster: {
      min: monsterQuantMinMax.noUiSlider.get()[0],
      max: monsterQuantMinMax.noUiSlider.get()[1],
      minLevel: document.querySelector('#monsterMin').value,
      maxLevel: document.querySelector('#monsterMax').value,
      forbiddenMonsters: JSON.stringify(getIdOfChips(monsterForbidden, monsters)),
      mandatoryMonsters: JSON.stringify(getIdOfChips(monsterMandatory, monsters)),
      maxFightPerMap: document.querySelector('#maxFightPerMapValue').value,
    },
    bank: {
      putKamas: document.querySelector('#putKamasValue').value,
      getKamas: document.querySelector('#getKamasValue').value,
      putItems: JSON.stringify(itemsBank.put),
      getItems: JSON.stringify(itemsBank.get),
    },
    autoRegen: {
      minLife: lifeMinMax.noUiSlider.get()[0],
      maxLife: lifeMinMax.noUiSlider.get()[1],
      items: JSON.stringify(getIdOfChips(regenItems, items)),
      store: document.querySelector('#regenItemValue').value,
    },
    display: {
      gather: document.querySelector('#displayGatherCountCheckbox').checked,
      fight: document.querySelector('#displayFightCountCheckbox').checked,
    },
    paths: {
      move: JSON.stringify(generateMove('path')).replace(/({.+?}(?:,|))/g, '\n\t$&').replace(/}\]/g, '}\n]'),
      bank: JSON.stringify(generateMove('bank')).replace(/({.+?}(?:,|))/g, '\n\t$&').replace(/}\]/g, '}\n]'),
      phoenix: JSON.stringify(generateMove('phoenix')).replace(/({.+?}(?:,|))/g, '\n\t$&').replace(/}\]/g, '}\n]'),
    },
    delete: JSON.stringify(getIdOfChips(autoDelete, items)),
    maxPods: document.querySelector('#maxpods').value,
    openBags: document.querySelector('#openBagsCheckbox').checked,
    elementToGather: JSON.stringify(getIdOfChips(elementToGather, interactive)),
  };

  const script =
`//---------------------------------------------
//-- Script created with OwlTouch
//---------------------------------------------
//-- Créateur : ${config.information.author}
//-- Type : ${config.information.type}
//-- Zone : ${config.information.area}
//-- Métier : ${config.information.job}
//---------------------------------------------
const config = {
  MAX_PODS : ${config.maxPods},
  MIN_MONSTERS : ${config.monster.min},
  MAX_MONSTERS : ${config.monster.max},
  MIN_MONSTERS_LEVEL: ${config.monster.minLevel},
  MAX_MONSTERS_LEVEL: ${config.monster.maxLevel},
  FORBIDDEN_MONSTERS : ${config.monster.forbiddenMonsters},
  MANDATORY_MONSTERS : ${config.monster.mandatoryMonsters},
  ${document.querySelector('#maxFightPerMapCheckbox').checked ? `MAX_FIGHTS_PER_MAP : ${config.monster.maxFightPerMap},` : `// MAX_FIGHTS_PER_MAP : ${config.monster.maxFightPerMap},`}
  ELEMENTS_TO_GATHER : ${config.elementToGather},
  BANK_PUT_ITEMS: ${config.bank.putItems},
  BANK_GET_ITEMS: ${config.bank.getItems},
  ${document.querySelector('#putKamasCheckbox').checked ? `BANK_PUT_KAMAS: ${config.bank.putKamas},` : `// BANK_PUT_KAMAS: ${config.bank.putKamas},`}
  ${document.querySelector('#getKamasCheckbox').checked ? `BANK_GET_KAMAS: ${config.bank.getKamas},` : `// BANK_GET_KAMAS: ${config.bank.getKamas},`}
  ${document.querySelector('#autoRegenCheckbox').checked ? `AUTO_REGEN: {
    minLife: ${config.autoRegen.minLife},
    maxLife: ${config.autoRegen.maxLife},
    items: ${config.autoRegen.items},
    store: ${config.autoRegen.store}
  },` : `/* AUTO_REGEN: {
    minLife: ${config.autoRegen.minLife},
    maxLife: ${config.autoRegen.maxLife},
    items: ${config.autoRegen.items},
    store: ${config.autoRegen.store}
  }, */`}
  AUTO_DELETE: ${config.delete},
  OPEN_BAGS : ${config.openBags},
  DISPLAY_GATHER_COUNT: ${config.display.gather},
  DISPLAY_FIGHT_COUNT: ${config.display.fight}
}

const move = ${config.paths.move}

const bank = ${config.paths.bank}

const phoenix = ${config.paths.phoenix}`;
  return script;
};
