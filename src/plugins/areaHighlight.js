/* Mavvo.HighlightMap */

const dofusMapSubAreaHighlight = [];
let actualID;
let actualDofusCoords = {};
// const subAreas = Mavvo.SubAreas.subAreas;
// const subAreaMapDb = Mavvo.SubAreas.subAreaMapDb;

const highlightSubArea = (e) => {
    const geoCoords = e.latlng;
    const [x, y] = geoCoordsToDofusCoords(geoCoords);
    if (actualDofusCoords.x === x && actualDofusCoords.y === y) {
        return;
    }
    actualDofusCoords.x = x;
    actualDofusCoords.y = y;
    var subAreas = this.getId(x, y)
    if (!subAreas.subAreaId) {
        resetHighlightArea();
        actualID = -1;
        return;
    }
    const subAreaId = subAreas.subAreaId
    if (actualID === subAreaId) {
        return;
    }
    resetHighlightArea();
    actualID = subAreaId;
    const subAreaMapIds = subAreas.mapIds;
    for (const subAreaMapId of subAreaMapIds) {
        const bounds = getDofusMapBounds(subAreaMapId);
        const highlight = L.rectangle(bounds, {
            color: "#00ffcc",
            weight: 0,
            fillOpacity: 0.25,
            interactive: false,
        }).addTo(map);
        dofusMapSubAreaHighlight.push(highlight);
    }
};

function getId(x, y) {
    for (const key in mapList) {
        if (mapList[key].posX == x && mapList[key].posY == y && mapList[key].worldMap == 1) {
            return {
                id: mapList[key].id,
                subAreaId: mapList[key].subAreaId,
                worldMap: mapList[key].worldMap,
                mapIds: areas[mapList[key].subAreaId].mapIds
            }
        }
    }
    return false
}

function getCoord(mapIds) {
    let list = []
    for (const iterator of mapIds) {
        // if (mapList[iterator].hasPriorityOnWorldmap) {
        list.push({
            x: mapList[iterator].posX,
            y: mapList[iterator].posY
        })
        // }
    }
    return list;
}

function resetHighlightArea() {
    for (const hilightedMap of dofusMapSubAreaHighlight) {
        map.removeLayer(hilightedMap);
    }
    dofusMapSubAreaHighlight.length = 0;
}
const drawDofusMapBoundsOnMouseMove = (e) => {
    const geoCoords = e.latlng;
    const dofusCoords = geoCoordsToDofusCoords(geoCoords);
    if (map.hasLayer(dofusMapUnderMouse)) {
        if (dofusMapUnderMouse.getBounds().contains(e.latlng)) {
            return;
        }
        dofusMapUnderMouse.setBounds(getDofusMapBounds(dofusCoords));
    } else {
        drawRectangle(dofusCoords);
    }
}

function getDofusMapBounds(dofusMapCoord) {
    let topLeftCornerCorner = dofusCoordsToPixelCoords(dofusMapCoord);
    topLeftCornerCorner.x = topLeftCornerCorner.x - 34.75;
    topLeftCornerCorner.y = topLeftCornerCorner.y - 25;
    const bottomRightCornerCorner = L.point(topLeftCornerCorner.x + (34.75 * 2), topLeftCornerCorner.y + (25 * 2));
    const nW = pixelCoordsToGeoCoords(topLeftCornerCorner);
    const sE = pixelCoordsToGeoCoords(bottomRightCornerCorner);
    return [nW, sE];
}
const drawRectangle = (point) => {
    const bounds = getDofusMapBounds(point);
    dofusMapUnderMouse = L.rectangle(bounds, {
            color: 'black',
            opacity: 1,
            interactive: false,
            clickable: false,
            fillOpacity: 0,
            weight: 1.2,
        })
        .addTo(map);
};