import fs from "fs";
import L from "leaflet";
import GeoToDofusCoord, { mapTileLayer } from "owl/utils/GeoToDofusCoord.js";
import { MapControl, withLeaflet } from "react-leaflet";
const mapList = JSON.parse(fs.readFileSync(__static + "/d2o/map.json", "utf8"));
const areas = JSON.parse(fs.readFileSync(__static + "/d2o/areas.json", "utf8"));

const actualDofusCoords = { x: 0, y: 0 };
const dofusMapSubAreaHighlight = [];
let dofusMapUnderMouse;
let actualID = -1;

export function getId(x, y, world) {
  for (const key in mapList) {
    if (
      mapList[key].posX === x &&
      mapList[key].posY === y &&
      mapList[key].hasPriorityOnWorldmap &&
      mapList[key].subAreaId !== -1 &&
      (mapList[key].worldMap === world.worldMap || mapList[key].worldMap === -1)
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

function mapidToCoord(mapIds, world) {
  const list = [];
  mapIds.forEach(element => {
    if (
      mapList[element] &&
      mapList[element].hasPriorityOnWorldmap &&
      (mapList[element].worldMap === world.worldMap || mapList[element].worldMap === -1)
    ) {
      list.push({
        x: mapList[element].posX,
        y: mapList[element].posY
      });
    }
  });
  return list;
}

function getDofusMapBounds(dofusMapCoord, map, world) {
  const topLeftCornerCorner = GeoToDofusCoord.dofusCoordsToPixelCoords(dofusMapCoord);
  topLeftCornerCorner.x -= world.topLeftCornerCorner / 2;
  topLeftCornerCorner.y -= world.bottomRightCornerCorner / 2;
  const bottomRightCornerCorner = L.point(
    topLeftCornerCorner.x + world.topLeftCornerCorner,
    topLeftCornerCorner.y + world.bottomRightCornerCorner
  );
  const nW = GeoToDofusCoord.pixelCoordsToGeoCoords(topLeftCornerCorner, map);
  const sE = GeoToDofusCoord.pixelCoordsToGeoCoords(bottomRightCornerCorner, map);
  return L.latLngBounds(nW, sE);
}

function drawRectangle(point, map, world) {
  const bounds = getDofusMapBounds(point, map, world);
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

function highlightSubArea(event, map, world) {
  const geoCoords = event.latlng;
  const [x, y] = GeoToDofusCoord.geoCoordsToDofusCoords(geoCoords, map);
  if (actualDofusCoords.x === x && actualDofusCoords.y === y) {
    return;
  }
  actualDofusCoords.x = x;
  actualDofusCoords.y = y;
  const subAreas = getId(x, y, world);
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
  const subAreaMapIds = mapidToCoord(subAreas.mapIds, world);
  Object.keys(subAreaMapIds).forEach(key => {
    const bounds = getDofusMapBounds([subAreaMapIds[key].x, subAreaMapIds[key].y], map, world);
    const highlight = L.rectangle(bounds, {
      color: "#00ffcc",
      fillOpacity: 0.25,
      interactive: false,
      weight: 0
    }).addTo(map);
    dofusMapSubAreaHighlight.push(highlight);
  });
}

function drawDofusMapBoundsOnMouseMove(event, map, world) {
  const geoCoords = event.latlng;
  const dofusCoords = GeoToDofusCoord.geoCoordsToDofusCoords(geoCoords, map);
  if (dofusMapUnderMouse !== null) {
    if (map.hasLayer(dofusMapUnderMouse)) {
      if (dofusMapUnderMouse.getBounds().contains(event.latlng)) {
        return;
      }
      dofusMapUnderMouse.setBounds(getDofusMapBounds(dofusCoords, map, world));
    } else {
      drawRectangle(dofusCoords, map, world);
    }
  } else {
    drawRectangle(dofusCoords, map, world);
  }
}

class MapInfo extends MapControl {
  constructor(props) {
    super(props);
    this.map = props.leaflet.map;
    this.world = props.world;
  }
  createLeafletElement() {
    //
  }

  componentDidMount() {
    this.map.addEventListener("mousemove", event => {
      drawDofusMapBoundsOnMouseMove(event, this.map, mapTileLayer.getTileLayer());
      highlightSubArea(event, this.map, mapTileLayer.getTileLayer());
    });
  }
}

export default withLeaflet(MapInfo);
