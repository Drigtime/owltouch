const icon = {
  move: ['up', 'down', 'left', 'right'],
  type: ['move', 'gather', 'fight', 'bank', 'phoenix'],
  size: {
    path: {
      up: {
        width: 17.22,
        height: 25,
        marginLeft: 17.22 / 2,
        topMargin: 25
      },
      down: {
        width: 17.22,
        height: 25,
        marginLeft: 17.22 / 2,
        topMargin: 0
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
      up: {
        width: 17.22,
        height: 25,
        marginLeft: -2.5,
        topMargin: 25
      },
      down: {
        width: 17.22,
        height: 25,
        marginLeft: -2.5,
        topMargin: 0
      },
      left: {
        width: 32.04,
        height: 17.22,
        marginLeft: 34.75,
        topMargin: -2.5
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
      up: {
        width: 17.22,
        height: 25,
        marginLeft: 20,
        topMargin: 25
      },
      down: {
        width: 17.22,
        height: 25,
        marginLeft: 20,
        topMargin: 0
      },
      left: {
        width: 32.04,
        height: 17.22,
        marginLeft: 34.75,
        topMargin: 20
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

for (const name of icon.move) {
  icon[name] = {};
  for (const type of icon.type) {
    icon[name][type] = {
      iconUrl: `./data/assets/path/${type}/${name}.svg`
    };
  }
}

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
  const scale = {
    width: size.width * zoom,
    height: size.height * zoom,
    marginLeft: size.marginLeft * zoom,
    topMargin: size.topMargin * zoom
  }
  return scale
}

const resizeMarker = () => {
  for (const dataType of Object.keys(movementType)) {
    for (const object of Object.values(movementType[dataType])) {
      for (const name of icon.move) {
        if (!object.marker.hasOwnProperty(name)) continue;
        const zoom = getScale(icon.size[dataType][name], map.getZoom());
        object.marker[name].setIcon(
          L.icon({
            iconUrl: object.marker[name]._icon.src,
            iconSize: [zoom.width, zoom.height],
            iconAnchor: [zoom.marginLeft, zoom.topMargin],
            className: name,
          }),
        );
      }
    }
  }
};

const deleteAction = (dataType, index, name) => {
  if (!index.marker.hasOwnProperty(name)) return;
  index.marker[name].remove();
  delete index.data[name];
  delete index.marker[name];
  if ($.isEmptyObject(index.data)) dataType.splice(dataType.indexOf(index), 1);
};

const onMapClick = (coord) => {
  console.log(coord);
  for (const name of icon.move) {
    // loop through list of possible mouvement : ['up', 'down', 'left', 'right'],
    if ($(`#${name}`).hasClass("selected")) {
      let dataType = $('#type')[0].selectedOptions[0].dataset.arrayType,
        scale = getScale(icon.size[dataType][name], map.getZoom()),
        type = $('#type')[0].selectedOptions[0].dataset.type,
        index = checkIfMapAlreadyExist(coord, movementType[dataType]),
        arrowMarker = L.marker(dofusCoordsToGeoCoords([coord[0], coord[1]]), {
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
    } else if ($('#delete').hasClass("selected")) {
      let index;
      for (const dataType of Object.values(movementType)) {
        index = checkIfMapAlreadyExist(coord, dataType);
        if (index !== null) deleteAction(dataType, index, name);
      }
    }
  }
  console.log(movementType);
};