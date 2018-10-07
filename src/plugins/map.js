import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster.layersupport';
import './controls/alch';
import './controls/areaControl';
import './controls/coordControl';
import './controls/farm';
import './controls/infoControl';
import './controls/lumb';
import './controls/mine';
import './controls/misc';

const sizeOf = require('image-size');
const path = require('path')

export const mapList = require(path.join(__dirname, '../data/json/d2o/map.json'));
export const areas = require(path.join(__dirname, '../data/json/d2o/Areas.json'));
export const bankPos = require(path.join(__dirname, '../data/json/miscellaneous/Bank.json'));
export const phoenixPos = require(path.join(__dirname, '../data/json/miscellaneous/Phoenix.json'));

export const json = {};
export const hint = {};
const dofusMapSubAreaHighlight = [];
const actualDofusCoords = {};

let actualID;
let dofusMapUnderMouse;

const amakna = L.tileLayer('./data/tiles/amakna/{z}/{x}/{y}.jpg', {
  minZoom: 0,
  maxZoom: 4,
  noWrap: true,
});
// incarnam = L.tileLayer('../data/tiles/incarnam/{z}/{x}/{y}.jpg', { minZoom: 0, maxZoom: 4, });

export const map = L.map('map', {
  crs: L.CRS.Simple,
  // center: [-250, 315],
  center: [-251.4375, 424.6875],
  // zoom: 0,
  zoom: 4,
  layers: [amakna],
  zoomControl: false,
});

const coordsTransform = new L.Transformation(69.5, 6517, 50, 4973);


export const getId = (x, y) => {
  for (const key in mapList) {
    if (
      mapList[key].posX === x &&
      mapList[key].posY === y &&
      mapList[key].hasPriorityOnWorldmap &&
      mapList[key].worldMap === 1
    ) {
      return {
        id: mapList[key].id,
        subAreaId: mapList[key].subAreaId,
        worldMap: mapList[key].worldMap,
        mapIds: areas[mapList[key].subAreaId].mapIds,
      };
    }
  }
  return false;
};

export const getCoord = (mapIds) => {
  const list = [];
  mapIds.forEach((element) => {
    if (mapList[element].hasPriorityOnWorldmap && mapList[element].worldMap === 1) {
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
  const {
    x,
    y,
  } = coordsTransform.untransform(pixelCoords).round();
  return [x, y];
};
// in: dofus [x,y] out: pixel coords (x,y) of the [x,y] map's center pixel
const dofusCoordsToPixelCoords = (dofusCoords) => {
  let newDofusCoords = dofusCoords;
  newDofusCoords = L.point(dofusCoords);
  return coordsTransform.transform(newDofusCoords);
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
  topLeftCornerCorner.x -= 34.75;
  topLeftCornerCorner.y -= 25;
  const bottomRightCornerCorner = L.point(
    topLeftCornerCorner.x + (34.75 * 2),
    topLeftCornerCorner.y + (25 * 2),
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
  const subAreaMapIds = getCoord(subAreas.mapIds);
  Object.keys(subAreaMapIds).forEach((key) => {
    const bounds = getDofusMapBounds([
      subAreaMapIds[key].x,
      subAreaMapIds[key].y,
    ]);
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

amakna.options.bounds = new L.LatLngBounds(
  pixelCoordsToGeoCoords([0, 0]),
  pixelCoordsToGeoCoords([10000, 8000]),
);

function bpMarkers(type) {
  const layer = [];
  type.forEach((element) => {
    layer.push(L.marker(
      dofusCoordsToGeoCoords([
        element.posX,
        element.posY,
      ]), {
        icon: L.icon({
          iconUrl: path.join(__dirname, `../data/assets/hint/${element.gfx}.png`),
          iconAnchor: [
            sizeOf(path.join(__dirname, `../data/assets/hint/${element.gfx}.png`)).width / 2,
            sizeOf(path.join(__dirname, `../data/assets/hint/${element.gfx}.png`)).height / 2,
          ],
        }),
        interactive: false,
      },
    ));
  });
  return layer;
}

export const bankLayerGroup = L.layerGroup(bpMarkers(bankPos));
export const phoenixLayerGroup = L.layerGroup(bpMarkers(phoenixPos));

export const mcgLayerSupportGroup = L.markerClusterGroup.layerSupport({
  maxClusterRadius: 1,
  iconCreateFunction(cluster) {
    const markers = cluster.getAllChildMarkers();
    return L.divIcon({
      html: `<img src="${markers[0].options.icon.options.iconUrl}"><div class="qnt">${cluster.getChildCount()}</div>`,
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
map.addControl(L.control.area());
map.addControl(L.control.farmer());
map.addControl(L.control.lumber());
map.addControl(L.control.miner());
map.addControl(L.control.alchimist());
map.addControl(L.control.miscellaneous());
