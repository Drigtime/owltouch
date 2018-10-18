import sizeOf from "image-size";
import L from "leaflet";
import { dofusCoordsToGeoCoords, map, mapList } from "./map";
import { bpGetInformation, checkIfMapAlreadyExist, deleteAction, getScale, icon, movementType } from "./pathMaker";

const path = require("path");

function loadPath(paths, arrayType) {
    Object.values(paths).forEach(mapInfo => {
        let directions;
        if (Object.prototype.hasOwnProperty.call(mapInfo, "npcBank")) {
            const coord = [mapList[mapInfo.map].posX, mapList[mapInfo.map].posY];
            const data = bpGetInformation(coord);
            const index = checkIfMapAlreadyExist(coord, movementType.bank);
            const marker = L.marker(dofusCoordsToGeoCoords(coord), {
                icon: L.icon({
                    iconUrl: path.join(__dirname, "../../../data/assets/path/bank/bank.png"),
                    iconAnchor: [
                        sizeOf(path.join(__dirname, "../../../data/assets/path/bank/bank.png")).width / 2,
                        sizeOf(path.join(__dirname, "../../../data/assets/path/bank/bank.png")).height / 2
                    ],
                    className: "bank"
                }),
                zIndexOffset: icon.size.bank.zindex,
                interactive: false
            });
            if (index !== null) {
                if (index.data.bank) {
                    deleteAction(movementType.bank, index, "bank");
                } else {
                    index.data.bank = {
                        bank: true,
                        mapIdOutSide: data.mapIdOutSide,
                        doorIdOutSide: data.doorIdOutSide,
                        mapIdInSide: data.mapIdInSide,
                        sunIdInside: data.sunIdInside
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
                            sunIdInside: data.sunIdInside
                        }
                    },
                    marker: {
                        bank: marker.addTo(map)
                    }
                });
            }
        } else if (Object.prototype.hasOwnProperty.call(mapInfo, "phoenix")) {
            const coord = [parseInt(mapInfo.map.split(",")[0], 10), parseInt(mapInfo.map.split(",")[1], 10)];
            const data = bpGetInformation(coord);
            const index = checkIfMapAlreadyExist(coord, movementType.phoenix);
            const marker = L.marker(dofusCoordsToGeoCoords(coord), {
                icon: L.icon({
                    iconUrl: path.join(__dirname, "../../../data/assets/path/phoenix/phoenix.png"),
                    iconAnchor: [
                        sizeOf(path.join(__dirname, "../../../data/assets/path/phoenix/phoenix.png")).width / 2,
                        sizeOf(path.join(__dirname, "../../../data/assets/path/phoenix/phoenix.png")).height / 2
                    ],
                    className: "phoenix"
                }),
                zIndexOffset: icon.size.phoenix.zindex,
                interactive: false
            });
            if (index !== null) {
                if (index.data.phoenix) {
                    deleteAction(movementType.phoenix, index, "phoenix");
                } else {
                    index.data.phoenix = {
                        phoenix: true,
                        mapIdOutSide: data.mapIdOutSide,
                        doorIdOutSide: data.doorIdOutSide,
                        mapIdInSide: data.mapIdInSide,
                        sunIdInside: data.sunIdInside
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
                            actionAfterRevive: mapInfo.path
                        }
                    },
                    marker: {
                        phoenix: marker.addTo(map)
                    }
                });
            }
        } else if (Object.prototype.hasOwnProperty.call(mapInfo, "path") && typeof mapInfo.path === "string" && parseInt(mapInfo.path, 10)) {
            const coord = [mapList[mapInfo.map].posX, mapList[mapInfo.map].posY];
            const data = bpGetInformation(coord);
            const index = checkIfMapAlreadyExist(coord, movementType.move);
            if (index !== null) {
                if (index.data.move) {
                    deleteAction(movementType.move, index, "bankOut");
                } else {
                    index.data.bankOut = {
                        mapid: data.mapIdInSide,
                        sun: data.sunIdInside,
                        mapIdOutSide: data.mapIdOutSide
                    };
                }
            } else {
                movementType.move.push({
                    coord: [coord[0], coord[1]],
                    data: {
                        bankOut: {
                            mapid: data.mapIdInSide,
                            sun: data.sunIdInside,
                            mapIdOutSide: data.mapIdOutSide
                        }
                    }
                });
            }
        } else if (Object.prototype.hasOwnProperty.call(mapInfo, "path")) {
            directions = mapInfo.path.split("|");
            directions.forEach(direction => {
                const coord =
                    typeof mapInfo.map === "string"
                        ? [parseInt(mapInfo.map.split(",")[0], 10), parseInt(mapInfo.map.split(",")[1], 10)]
                        : [mapList[mapInfo.map].posX, mapList[mapInfo.map].posY];
                const dataType = arrayType;
                const scale = getScale(icon.size[arrayType][direction], map.getZoom());
                let type;
                if (Object.prototype.hasOwnProperty.call(mapInfo, "gather") && Object.prototype.hasOwnProperty.call(mapInfo, "fight")) {
                    type = "gatherfight";
                } else if (Object.prototype.hasOwnProperty.call(mapInfo, "gather")) {
                    type = "gather";
                } else if (Object.prototype.hasOwnProperty.call(mapInfo, "fight")) {
                    type = "fight";
                } else {
                    type = arrayType;
                }
                const index = checkIfMapAlreadyExist(coord, movementType[dataType]);
                const marker = L.marker(dofusCoordsToGeoCoords(coord), {
                    icon: L.icon({
                        iconUrl: icon[direction][type].iconUrl,
                        iconSize: [scale.width, scale.height],
                        iconAnchor: [scale.marginLeft, scale.topMargin],
                        className: direction
                    }),
                    zIndexOffset: icon.size[dataType].zindex,
                    interactive: false
                });
                if (index !== null) {
                    if (index.data[direction]) {
                        deleteAction(movementType[dataType], index, direction);
                    } else {
                        index.data[direction] = {
                            [type]: true
                        };
                        index.marker[direction] = marker.addTo(map);
                    }
                } else {
                    movementType[dataType].push({
                        coord: [coord[0], coord[1]],
                        data: {
                            [direction]: {
                                [type]: true
                            }
                        },
                        marker: {
                            [direction]: marker.addTo(map)
                        }
                    });
                }
            });
        }
    });
}

export default function loadScript(script) {
    const scriptTemp = script
        .replace(/(?!")map(?!")/g, '"map"')
        .replace(/(?!")path(?!")/g, '"path"')
        .replace(/(?!")door(?!")/g, '"door"')
        .replace(/(?!")gather(?!")/g, '"gather"')
        .replace(/(?!")fight(?!")/g, '"fight"')
        .replace(/(?!")phoenix(?!")/g, '"phoenix"')
        .replace(/(?!")npcBank(?!")/g, '"npcBank"');
    const config = {
        paths: {
            move: /move(?:[\s\S]*?)=(?:[\s\S]*?)(\[[\s\S]*?\])/gm.exec(scriptTemp)
                ? JSON.parse(/move(?:[\s\S]*?)=(?:[\s\S]*?)(\[[\s\S]*?\])/gm.exec(scriptTemp)[1])
                : [],
            bank: /bank(?:[\s\S]*?)=(?:[\s\S]*?)(\[[\s\S]*?\])/gm.exec(scriptTemp)
                ? JSON.parse(/bank(?:[\s\S]*?)=(?:[\s\S]*?)(\[[\s\S]*?\])/gm.exec(scriptTemp)[1])
                : [],
            phoenix: /phoenix(?:[\s\S]*?)=(?:[\s\S]*?)(\[[\s\S]*?\])/gm.exec(scriptTemp)
                ? JSON.parse(/phoenix(?:[\s\S]*?)=(?:[\s\S]*?)(\[[\s\S]*?\])/gm.exec(scriptTemp)[1])
                : []
        }
    };
    console.log(config.paths.move, config.paths.bank, config.paths.phoenix);
    Object.keys(config.paths).forEach(key => {
        loadPath(config.paths[key], key);
    });
}
