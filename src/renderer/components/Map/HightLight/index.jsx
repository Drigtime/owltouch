import L from "leaflet";
import fs from "fs";
import { MapControl, withLeaflet } from "react-leaflet";
const mapList = JSON.parse(fs.readFileSync(__static + "/d2o/map.json", "utf8"))
const areas = JSON.parse(fs.readFileSync(__static + "/d2o/areas.json", "utf8"))

const actualDofusCoords = { x: 0, y: 0 };
const dofusMapSubAreaHighlight = [];
let dofusMapUnderMouse;
let actualID = -1;

export function getId(x, y) {
  for (const key in mapList) {
    if (
      mapList[key].posX === x &&
      mapList[key].posY === y &&
      mapList[key].hasPriorityOnWorldmap &&
      (mapList[key].worldMap === 1 || mapList[key].worldMap === -1)
    ) {
      return {
        id: mapList[key].id,
        mapIds: areas[mapList[key].subAreaId].mapIds,
        subAreaId: mapList[key].subAreaId,
        subAreaName: areas[mapList[key].subAreaId].nameId,
        worldMap: mapList[key].worldMap
      };
    }
  }
  return {
    id: "MAPID",
    mapIds: null,
    subAreaId: null,
    subAreaName: null,
    worldMap: null
  };
}

function mapidToCoord(mapIds) {
  const list = [];
  mapIds.forEach(element => {
    if (
      mapList[element] &&
      mapList[element].hasPriorityOnWorldmap &&
      (mapList[element].worldMap === 1 || mapList[element].worldMap === -1)
    ) {
      list.push({
        x: mapList[element].posX,
        y: mapList[element].posY
      });
    }
  });
  return list;
}
function geoCoordsToPixelCoords(geoCoords, map) {
  return map.project(geoCoords, map.getMaxZoom());
}
function pixelCoordsToGeoCoords(pixelCoords, map) {
  return map.unproject(pixelCoords, map.getMaxZoom());
}
function pixelCoordsToDofusCoords(pixelCoords) {
  const coordsTransform = new L.Transformation(69.5, 6517, 50, 4973);
  const { x, y } = coordsTransform.untransform(pixelCoords).round();
  return [x, y];
}
// in: dofus [x,y] out: pixel coords (x,y) of the [x,y] map's center pixel
function dofusCoordsToPixelCoords(dofusMapCoord) {
  const newDofusCoords = L.point(dofusMapCoord);
  const coordsTransform = new L.Transformation(69.5, 6517, 50, 4973);
  return coordsTransform.transform(newDofusCoords);
}
export function geoCoordsToDofusCoords(geoCoords, map) {
  const pixelCoords = geoCoordsToPixelCoords(geoCoords, map);
  return pixelCoordsToDofusCoords(pixelCoords);
}

function getDofusMapBounds(dofusMapCoord, map) {
  const topLeftCornerCorner = dofusCoordsToPixelCoords(dofusMapCoord);
  topLeftCornerCorner.x -= 69.5 / 2;
  topLeftCornerCorner.y -= 50 / 2;
  const bottomRightCornerCorner = L.point(
    topLeftCornerCorner.x + 69.5,
    topLeftCornerCorner.y + 50
  );
  const nW = pixelCoordsToGeoCoords(topLeftCornerCorner, map);
  const sE = pixelCoordsToGeoCoords(bottomRightCornerCorner, map);
  return L.latLngBounds(nW, sE);
}

function drawRectangle(point, map) {
  const bounds = getDofusMapBounds(point, map);
  dofusMapUnderMouse = L.rectangle(bounds, {
    color: "black",
    fillOpacity: 0,
    interactive: false,
    opacity: 1,
    weight: 1.2
  }).addTo(map);
}
function resetHighlightArea(map) {
  dofusMapSubAreaHighlight.forEach(hilightedMap => {
    map.removeLayer(hilightedMap);
  });
  dofusMapSubAreaHighlight.length = 0;
}
function highlightSubArea(event, map) {
  const geoCoords = event.latlng;
  const [x, y] = geoCoordsToDofusCoords(geoCoords, map);
  if (actualDofusCoords.x === x && actualDofusCoords.y === y) {
    return;
  }
  actualDofusCoords.x = x;
  actualDofusCoords.y = y;
  const subAreas = getId(x, y);
  if (!subAreas.subAreaId) {
    resetHighlightArea(map);
    actualID = -1;
    return;
  }
  const subAreaId = subAreas.subAreaId;
  if (actualID === subAreaId) {
    return;
  }
  resetHighlightArea(map);
  actualID = subAreaId;
  const subAreaMapIds = mapidToCoord(subAreas.mapIds);
  Object.keys(subAreaMapIds).forEach(key => {
    const bounds = getDofusMapBounds(
      [subAreaMapIds[key].x, subAreaMapIds[key].y],
      map
    );
    const highlight = L.rectangle(bounds, {
      color: "#00ffcc",
      fillOpacity: 0.25,
      interactive: false,
      weight: 0
    }).addTo(map);
    dofusMapSubAreaHighlight.push(highlight);
  });
}
function drawDofusMapBoundsOnMouseMove(event, map) {
  const geoCoords = event.latlng;
  const dofusCoords = geoCoordsToDofusCoords(geoCoords, map);
  if (dofusMapUnderMouse !== null) {
    if (map.hasLayer(dofusMapUnderMouse)) {
      if (dofusMapUnderMouse.getBounds().contains(event.latlng)) {
        return;
      }
      dofusMapUnderMouse.setBounds(getDofusMapBounds(dofusCoords, map));
    } else {
      drawRectangle(dofusCoords, map);
    }
  } else {
    drawRectangle(dofusCoords, map);
  }
}
class MapInfo extends MapControl {
  constructor(props) {
    super(props);
    this.map = props.leaflet.map;
  }
  createLeafletElement() {
    //
  }
  componentDidMount() {
    this.map.addEventListener("mousemove", event => {
      drawDofusMapBoundsOnMouseMove(event, this.map);
      highlightSubArea(event, this.map);
    });
  }
}

export default withLeaflet(MapInfo);
