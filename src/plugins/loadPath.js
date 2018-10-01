export function loadScript(script) {
    const config = {
        paths: {
            move: JSON.parse(`${/move(?:[\s\S]*?)=(?:[\s\S]*?)(\[[\s\S]*?\])/gm.exec(script)[1]}`),
            bank: JSON.parse(`${/bank(?:[\s\S]*?)=(?:[\s\S]*?)(\[[\s\S]*?\])/gm.exec(script)[1]}`),
            phoenix: JSON.parse(`${/phoenix(?:[\s\S]*?)=(?:[\s\S]*?)(\[[\s\S]*?\])/gm.exec(script)[1]}`)
        }
    }
    console.log(config.paths.move,
        config.paths.bank,
        config.paths.phoenix
    );
    Object.keys(config.paths).forEach(key => {
        loadPath(config.paths[key], key)
    });
};

function loadPath(path, arrayType) {
    Object.values(path).forEach((mapInfo) => {
        let directions;
        if (directions = Object.prototype.hasOwnProperty.call(mapInfo, 'path'))
            directions = mapInfo.path.split('|');
        directions.forEach(direction => {
            const coord = typeof (mapInfo.map) == 'string' ? [parseInt(mapInfo.map.split(',')[0]), parseInt(mapInfo.map.split(',')[1])] : getCoord([mapInfo.map])
            const dataType = arrayType
            const scale = getScale(icon.size[arrayType][direction], map.getZoom());
            let type;
            if (Object.prototype.hasOwnProperty.call(mapInfo, 'gather'))
                type = 'gather'
            else if (Object.prototype.hasOwnProperty.call(mapInfo, 'fight'))
                type = 'fight'
            else
                type = arrayType
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
    });
};