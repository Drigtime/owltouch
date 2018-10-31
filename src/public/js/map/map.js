import L from 'leaflet';
import sizeOf from 'image-size';
import 'leaflet.markercluster';
import 'leaflet.markercluster.layersupport';
import './controls/alch';
import './controls/areaControl';
import './controls/coordControl';
import './controls/worldControl';
import './controls/farm';
import './controls/infoControl';
import './controls/lumb';
import './controls/fish';
import './controls/mine';
import './controls/misc';

const { join } = require('path');
const { readFileSync } = require('fs');

export const mapList = JSON.parse(readFileSync(join(__dirname, '../../../data/json/d2o/map.json')));
export const areas = JSON.parse(readFileSync(join(__dirname, '../../../data/json/d2o/Areas.json')));
export const bankPos = JSON.parse(
  readFileSync(join(__dirname, '../../../data/json/miscellaneous/Bank.json')),
);
export const phenixPos = JSON.parse(
  readFileSync(join(__dirname, '../../../data/json/miscellaneous/Phenix.json')),
);

export const json = {};
export const hint = {};
const dofusMapSubAreaHighlight = [];
const actualDofusCoords = {};

let actualID;
let dofusMapUnderMouse;

export const mapTileLayer = {
  amakna: {
    tileLayer: L.tileLayer('./data/tiles/amakna/{z}/{x}/{y}.jpg', {
      minZoom: 0,
      maxZoom: 4,
      noWrap: true,
    }),
    coordsTransform: new L.Transformation(69.5, 6517, 50, 4973),
    view: { lat: -250, lng: 425 },
    topLeftCornerCorner: 69.5,
    bottomRightCornerCorner: 50,
    worldMap: 1,
  },
  incarnam: {
    tileLayer: L.tileLayer('./data/tiles/incarnam/{z}/{x}/{y}.jpg', {
      minZoom: 0,
      maxZoom: 4,
    }),
    coordsTransform: new L.Transformation(213, 1992, 153, 970),
    view: { lat: -90, lng: 120 },
    topLeftCornerCorner: 213,
    bottomRightCornerCorner: 153,
    worldMap: 2,
  },
  actualLayerName: '',
  default() {
    this.actualLayerName = 'amakna';
    return this.amakna;
  },
  setTileLayer(tileLayer) {
    this.actualLayerName = tileLayer;
    this.amakna.tileLayer.remove();
    this.incarnam.tileLayer.remove();
    this[tileLayer].tileLayer.addTo(map);
    map.setView(this[tileLayer].view);
  },
  getTileLayer() {
    return this[this.actualLayerName];
  },
};

export const map = L.map('map', {
  crs: L.CRS.Simple,
  // center: [-250, 315],
  center: [mapTileLayer.default().view.lat, mapTileLayer.default().view.lng],
  // zoom: 0,
  zoom: 4,
  layers: [mapTileLayer.default().tileLayer],
  zoomControl: false,
});

export const getId = (x, y) => {
  let result;
  Object.keys(mapList).forEach((key) => {
    if (
      mapList[key].posX === x &&
      mapList[key].posY === y &&
      mapList[key].hasPriorityOnWorldmap &&
      mapList[key].worldMap === mapTileLayer.getTileLayer().worldMap
    ) {
      result = {
        id: mapList[key].id,
        subAreaId: mapList[key].subAreaId,
        worldMap: mapList[key].worldMap,
        mapIds: areas[mapList[key].subAreaId].mapIds,
      };
    }
  });
  return result || false;
};

export const mapidToCoord = (mapIds) => {
  const list = [];
  mapIds.forEach((element) => {
    if (
      mapList[element].hasPriorityOnWorldmap &&
      mapList[element].worldMap === mapTileLayer.getTileLayer().worldMap
    ) {
      list.push({
        x: mapList[element].posX,
        y: mapList[element].posY,
      });
    }
  });
  return list;
};

const geoCoordsToPixelCoords = geoCoords => map.project(geoCoords, map.getMaxZoom());
const pixelCoordsToGeoCoords = pixelCoords => map.unproject(pixelCoords, map.getMaxZoom());
const pixelCoordsToDofusCoords = (pixelCoords) => {
  const { x, y } = mapTileLayer
    .getTileLayer()
    .coordsTransform.untransform(pixelCoords)
    .round();
  return [x, y];
};
// in: dofus [x,y] out: pixel coords (x,y) of the [x,y] map's center pixel
const dofusCoordsToPixelCoords = (dofusCoords) => {
  let newDofusCoords = dofusCoords;
  newDofusCoords = L.point(dofusCoords);
  return mapTileLayer.getTileLayer().coordsTransform.transform(newDofusCoords);
};
export const geoCoordsToDofusCoords = (geoCoords) => {
  const pixelCoords = geoCoordsToPixelCoords(geoCoords);
  return pixelCoordsToDofusCoords(pixelCoords);
};
// in: dofus [x,y] out: geo coords (lat,lng) of the [x,y] map's center pixel
export function dofusCoordsToGeoCoords(dofusCoords) {
  const pixelCoords = dofusCoordsToPixelCoords(dofusCoords);
  return pixelCoordsToGeoCoords(pixelCoords);
}

function resetHighlightArea() {
  dofusMapSubAreaHighlight.forEach((hilightedMap) => {
    map.removeLayer(hilightedMap);
  });
  dofusMapSubAreaHighlight.length = 0;
}

function getDofusMapBounds(dofusMapCoord) {
  const topLeftCornerCorner = dofusCoordsToPixelCoords(dofusMapCoord);
  topLeftCornerCorner.x -= mapTileLayer.getTileLayer().topLeftCornerCorner / 2;
  topLeftCornerCorner.y -= mapTileLayer.getTileLayer().bottomRightCornerCorner / 2;
  const bottomRightCornerCorner = L.point(
    topLeftCornerCorner.x + mapTileLayer.getTileLayer().topLeftCornerCorner,
    topLeftCornerCorner.y + mapTileLayer.getTileLayer().bottomRightCornerCorner,
  );
  const nW = pixelCoordsToGeoCoords(topLeftCornerCorner);
  const sE = pixelCoordsToGeoCoords(bottomRightCornerCorner);
  return [nW, sE];
}

function drawRectangle(point) {
  const bounds = getDofusMapBounds(point);
  dofusMapUnderMouse = L.rectangle(bounds, {
    color: 'black',
    opacity: 1,
    interactive: false,
    clickable: false,
    fillOpacity: 0,
    weight: 1.2,
  }).addTo(map);
}

export function highlightSubArea(e) {
  const geoCoords = e.latlng;
  const [x, y] = geoCoordsToDofusCoords(geoCoords);
  if (actualDofusCoords.x === x && actualDofusCoords.y === y) {
    return;
  }
  actualDofusCoords.x = x;
  actualDofusCoords.y = y;
  const subAreas = getId(x, y);
  if (!subAreas.subAreaId) {
    resetHighlightArea();
    actualID = -1;
    return;
  }
  const subAreaId = subAreas.subAreaId;
  if (actualID === subAreaId) {
    return;
  }
  resetHighlightArea();
  actualID = subAreaId;
  const subAreaMapIds = mapidToCoord(subAreas.mapIds);
  Object.keys(subAreaMapIds).forEach((key) => {
    const bounds = getDofusMapBounds([subAreaMapIds[key].x, subAreaMapIds[key].y]);
    const highlight = L.rectangle(bounds, {
      color: '#00ffcc',
      weight: 0,
      fillOpacity: 0.25,
      interactive: false,
    }).addTo(map);
    dofusMapSubAreaHighlight.push(highlight);
  });
}

export function drawDofusMapBoundsOnMouseMove(e) {
  const geoCoords = e.latlng;
  const dofusCoords = geoCoordsToDofusCoords(geoCoords);
  if (dofusMapUnderMouse !== null) {
    if (map.hasLayer(dofusMapUnderMouse)) {
      if (dofusMapUnderMouse.getBounds().contains(e.latlng)) {
        return;
      }
      dofusMapUnderMouse.setBounds(getDofusMapBounds(dofusCoords));
    } else {
      drawRectangle(dofusCoords);
    }
  } else {
    drawRectangle(dofusCoords);
  }
}

mapTileLayer.amakna.tileLayer.options.bounds = new L.LatLngBounds(
  pixelCoordsToGeoCoords([0, 0]),
  pixelCoordsToGeoCoords([10000, 8000]),
);

export function bpMarkers(type) {
  const layer = [];
  type.forEach((element) => {
    if (element.worldMap === mapTileLayer.getTileLayer().worldMap) {
      layer.push(
        L.marker(dofusCoordsToGeoCoords([element.posX, element.posY]), {
          icon: L.icon({
            iconUrl: join(__dirname, `../../../data/assets/hint/${element.gfx}.png`),
            iconAnchor: [
              sizeOf(join(__dirname, `../../../data/assets/hint/${element.gfx}.png`)).width / 2,
              sizeOf(join(__dirname, `../../../data/assets/hint/${element.gfx}.png`)).height / 2,
            ],
          }),
          interactive: false,
        }),
      );
    }
  });
  return layer;
}

export const bpLayers = {
  bank: L.layerGroup(bpMarkers(bankPos)),
  phenix: L.layerGroup(bpMarkers(phenixPos)),
};

export const mcgLayerSupportGroup = L.markerClusterGroup.layerSupport({
  maxClusterRadius: 1,
  iconCreateFunction(cluster) {
    const markers = cluster.getAllChildMarkers();
    return L.divIcon({
      html: `<img src="${
        markers[0].options.icon.options.iconUrl
      }"><div class="qnt">${cluster.getChildCount()}</div>`,
      className: 'mycluster',
      iconAnchor: [
        sizeOf(`${markers[0].options.icon.options.iconUrl}`).width / 2,
        sizeOf(`${markers[0].options.icon.options.iconUrl}`).height / 2,
      ],
    });
  },
  animate: false,
});

mcgLayerSupportGroup.addTo(map);

map.addControl(L.control.coordinates());
map.addControl(L.control.world());
map.addControl(L.control.area());
export const controls = {
  farmer: L.control.farmer(),
  lumber: L.control.lumber(),
  miner: L.control.miner(),
  alchimist: L.control.alchimist(),
  fisher: L.control.fisher(),
  miscellaneous: L.control.miscellaneous(),
};
map.addControl(controls.farmer);
map.addControl(controls.lumber);
map.addControl(controls.miner);
map.addControl(controls.alchimist);
map.addControl(controls.fisher);
map.addControl(controls.miscellaneous);

$('select').formSelect();
$('.leaflet-control-attribution.leaflet-control').hide();
