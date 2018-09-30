import 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster.layersupport';
import './plugins/areaHighlight';
import './plugins/controls/alch';
import './plugins/controls/areaControl';
import './plugins/controls/coordControl';
import './plugins/controls/farm';
import './plugins/controls/infoControl';
import './plugins/controls/lumb';
import './plugins/controls/mine';
// require('./plugins/fish')
import './plugins/controls/misc';
import './plugins/pathMaker';

const mapList = require('./data/json/d2o/map.json');
const areas = require('./data/json/d2o/Areas.json');
const interactive = require('./data/json/d2o/Interactive.json');
const items = require('./data/json/d2o/Items.json');
const monsters = require('./data/json/d2o/Monsters.json');
const sizeOf = require('image-size')
;

const json = {};
// const mapList = require('./json/d2o/map.json');

const amakna = L.tileLayer('./data/tiles/amakna/{z}/{x}/{y}.jpg', {
  minZoom: 0,
  maxZoom: 4,
  noWrap: true,
});
// incarnam = L.tileLayer('../data/tiles/incarnam/{z}/{x}/{y}.jpg', { minZoom: 0, maxZoom: 4, });

const map = L.map('map', {
  crs: L.CRS.Simple,
  // center: [-250, 315],
  center: [-251.4375, 424.6875],
  // zoom: 0,
  zoom: 4,
  layers: [amakna],
  zoomControl: false,
});

let coordsTransform;
coordsTransform = new L.Transformation(69.5, 6517, 50, 4973);

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
  dofusCoords = L.point(dofusCoords);
  return coordsTransform.transform(dofusCoords);
};
const geoCoordsToDofusCoords = (geoCoords) => {
  const pixelCoords = geoCoordsToPixelCoords(geoCoords);
  return pixelCoordsToDofusCoords(pixelCoords);
};
// in: dofus [x,y] out: geo coords (lat,lng) of the [x,y] map's center pixel
const dofusCoordsToGeoCoords = (dofusCoords) => {
  const pixelCoords = dofusCoordsToPixelCoords(dofusCoords);
  return pixelCoordsToGeoCoords(pixelCoords);
};

/* Mavvo.HighlightMap */

const dofusMapSubAreaHighlight = [];
let actualID;
const actualDofusCoords = {};

const highlightSubArea = (e) => {
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
  for (const key in subAreaMapIds) {
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
  }
};

function getId(x, y) {
  for (const key in mapList) {
    if (
      mapList[key].posX == x &&
      mapList[key].posY == y &&
      mapList[key].hasPriorityOnWorldmap &&
      mapList[key].worldMap == 1
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
}

function getCoord(mapIds) {
  const list = [];
  mapIds.forEach((element) => {
    if (mapList[element].hasPriorityOnWorldmap) {
      list.push({
        x: mapList[element].posX,
        y: mapList[element].posY,
      });
    }
  });
  return list;
}

function resetHighlightArea() {
  dofusMapSubAreaHighlight.forEach((hilightedMap) => {
    map.removeLayer(hilightedMap);
  });
  dofusMapSubAreaHighlight.length = 0;
}

let dofusMapUnderMouse;

const drawDofusMapBoundsOnMouseMove = (e) => {
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
};

function getDofusMapBounds(dofusMapCoord) {
  const topLeftCornerCorner = dofusCoordsToPixelCoords(dofusMapCoord);
  topLeftCornerCorner.x -= 34.75;
  topLeftCornerCorner.y -= 25;
  const bottomRightCornerCorner = L.point(
    topLeftCornerCorner.x + 34.75 * 2,
    topLeftCornerCorner.y + 25 * 2,
  );
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
  }).addTo(map);
};

amakna.options.bounds = new L.LatLngBounds(
  pixelCoordsToGeoCoords([0, 0]),
  pixelCoordsToGeoCoords([10000, 8000]),
);

const mcgLayerSupportGroup = L.markerClusterGroup.layerSupport({
  maxClusterRadius: 1,
  iconCreateFunction(cluster) {
    const markers = cluster.getAllChildMarkers();
    return L.divIcon({
      html: `<img src="../src/${markers[0].options.icon.options.iconUrl}"><div class="qnt">${cluster.getChildCount()}</div>`,
      className: 'mycluster',
      iconAnchor: [
        sizeOf(`./src/${markers[0].options.icon.options.iconUrl}`).width / 2,
        sizeOf(`./src/${markers[0].options.icon.options.iconUrl}`).height / 2,
      ],
    });
  },
  animate: false,
});
const hint = {};

mcgLayerSupportGroup.addTo(map);

map.addControl(L.control.coordinates());
map.addControl(L.control.area());
// map.addControl(L.control.info());
map.addControl(L.control.farmer());
map.addControl(L.control.lumber());
// map.addControl(L.control.fisher())
map.addControl(L.control.miner());
map.addControl(L.control.alchimist());
map.addControl(L.control.miscellaneous());
// L.control.layers(baseLayers, overlays, { position: 'topleft' }).addTo(map);

map.on('mousemove', (e) => {
  drawDofusMapBoundsOnMouseMove(e);
  highlightSubArea(e);
});

map.on('click', (e) => {
  onMapClick(geoCoordsToDofusCoords(e.latlng));
});

map.on('zoom', () => {
  resizeMarker();
});
