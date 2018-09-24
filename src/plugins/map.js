const mapList = require("./data/json/d2o/map.json")
const areas = require("./data/json/d2o/Areas.json")
const sizeOf = require("image-size")
const json = {}
import "leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster.layersupport";
import "./plugins/areaHighlight";
import "./plugins/pathMaker";
import "./plugins/controls/areaControl";
import "./plugins/controls/coordControl";
import "./plugins/controls/infoControl";
import "./plugins/controls/farm";
import "./plugins/controls/lumb";
import "./plugins/controls/mine";
import "./plugins/controls/alch";
// require('./plugins/fish')
import "./plugins/controls/misc";
// const mapList = require('./json/d2o/map.json');

const amakna = L.tileLayer("./data/tiles/amakna/{z}/{x}/{y}.jpg", {
  minZoom: 0,
  maxZoom: 4,
  noWrap: true
});
// incarnam = L.tileLayer('../data/tiles/incarnam/{z}/{x}/{y}.jpg', { minZoom: 0, maxZoom: 4, });

const map = L.map("map", {
  crs: L.CRS.Simple,
  // center: [-250, 315],
  center: [-251.4375, 424.6875],
  // zoom: 0,
  zoom: 4,
  layers: [amakna],
  zoomControl: false
});

let coordsTransform;
coordsTransform = new L.Transformation(69.5, 6517, 50, 4973);

const geoCoordsToPixelCoords = geoCoords => {
  return map.project(geoCoords, map.getMaxZoom());
};
const pixelCoordsToGeoCoords = pixelCoords => {
  return map.unproject(pixelCoords, map.getMaxZoom());
};
const pixelCoordsToDofusCoords = pixelCoords => {
  const {
    x,
    y
  } = coordsTransform.untransform(pixelCoords).round();
  return [x, y];
};
//in: dofus [x,y] out: pixel coords (x,y) of the [x,y] map's center pixel
const dofusCoordsToPixelCoords = dofusCoords => {
  dofusCoords = L.point(dofusCoords);
  return coordsTransform.transform(dofusCoords);
};
const geoCoordsToDofusCoords = geoCoords => {
  const pixelCoords = geoCoordsToPixelCoords(geoCoords);
  return pixelCoordsToDofusCoords(pixelCoords);
};
//in: dofus [x,y] out: geo coords (lat,lng) of the [x,y] map's center pixel
const dofusCoordsToGeoCoords = dofusCoords => {
  const pixelCoords = dofusCoordsToPixelCoords(dofusCoords);
  return pixelCoordsToGeoCoords(pixelCoords);
};

/* Mavvo.HighlightMap */

const dofusMapSubAreaHighlight = [];
let actualID;
let actualDofusCoords = {};

const highlightSubArea = e => {
  const geoCoords = e.latlng;
  const [x, y] = geoCoordsToDofusCoords(geoCoords);
  if (actualDofusCoords.x === x && actualDofusCoords.y === y) {
    return;
  }
  actualDofusCoords.x = x;
  actualDofusCoords.y = y;
  let subAreas = getId(x, y);
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
      subAreaMapIds[key].y
    ]);
    const highlight = L.rectangle(bounds, {
      color: "#00ffcc",
      weight: 0,
      fillOpacity: 0.25,
      interactive: false
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
        mapIds: areas[mapList[key].subAreaId].mapIds
      };
    }
  }
  return false;
}

function getCoord(mapIds) {
  let list = [];
  for (const iterator of mapIds) {
    if (mapList[iterator].hasPriorityOnWorldmap) {
      list.push({
        x: mapList[iterator].posX,
        y: mapList[iterator].posY
      });
    }
  }
  return list;
}

function resetHighlightArea() {
  for (const hilightedMap of dofusMapSubAreaHighlight) {
    map.removeLayer(hilightedMap);
  }
  dofusMapSubAreaHighlight.length = 0;
}

var dofusMapUnderMouse;

const drawDofusMapBoundsOnMouseMove = e => {
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
  let topLeftCornerCorner = dofusCoordsToPixelCoords(dofusMapCoord);
  topLeftCornerCorner.x = topLeftCornerCorner.x - 34.75;
  topLeftCornerCorner.y = topLeftCornerCorner.y - 25;
  const bottomRightCornerCorner = L.point(
    topLeftCornerCorner.x + 34.75 * 2,
    topLeftCornerCorner.y + 25 * 2
  );
  const nW = pixelCoordsToGeoCoords(topLeftCornerCorner);
  const sE = pixelCoordsToGeoCoords(bottomRightCornerCorner);
  return [nW, sE];
}

const drawRectangle = point => {
  const bounds = getDofusMapBounds(point);
  dofusMapUnderMouse = L.rectangle(bounds, {
    color: "black",
    opacity: 1,
    interactive: false,
    clickable: false,
    fillOpacity: 0,
    weight: 1.2
  }).addTo(map);
};

amakna.options.bounds = new L.LatLngBounds(
  pixelCoordsToGeoCoords([0, 0]),
  pixelCoordsToGeoCoords([10000, 8000])
);

const mcgLayerSupportGroup = L.markerClusterGroup.layerSupport({
  maxClusterRadius: 1,
  iconCreateFunction: function (cluster) {
    let markers = cluster.getAllChildMarkers();
    return L.divIcon({
      html: `<img src="../src/${markers[0].options.icon.options.iconUrl}"><div class="qnt">${cluster.getChildCount()}</div>`,
      className: "mycluster",
      iconAnchor: [
        sizeOf(`./src/${markers[0].options.icon.options.iconUrl}`).width / 2,
        sizeOf(`./src/${markers[0].options.icon.options.iconUrl}`).height / 2
      ]
    });
  },
  animate: false
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

map.on("mousemove", e => {
  drawDofusMapBoundsOnMouseMove(e);
  highlightSubArea(e);
});

map.on("click", e => {
  onMapClick(geoCoordsToDofusCoords(e.latlng));
});

map.on("zoom", () => {
  resizeMarker();
});

M.AutoInit();

$(".btn-group>a.btn-flat").on("click", e => {
  $(e.currentTarget).toggleClass("selected");
  if ($("#delete").hasClass("selected")) {
    const buttonMoveSets = ["up", "down", "left", "right"];
    for (const key of buttonMoveSets) {
      if (e.currentTarget.id == key) {
        $(`#delete`).removeClass("selected");
      } else {
        $(`#${key}`).removeClass("selected");
      }
    }
  }
});

const elementToGather = M.Chips.init(document.querySelector('#gatherElementChips'), {
  autocompleteOptions: {
    data: {
      'Blé': null
    },
    limit: 10,
    minLength: 1
  },
  placeholder: 'ex : Orge ...'
});

const regenItems = M.Chips.init(document.querySelector('#regenItemChips'), {
  autocompleteOptions: {
    data: {
      'Pain d\'incarnam': null
    },
    limit: 10,
    minLength: 1
  },
  placeholder: 'ex : Pain ...'
});

const monsterMandatory = M.Chips.init(document.querySelector('#monsterMandatory'), {
  autocompleteOptions: {
    data: {
      'Piou bleu': null
    },
    limit: 10,
    minLength: 1
  },
  placeholder: 'ex : Piou ...'
});

const monsterForbidden = M.Chips.init(document.querySelector('#monsterForbidden'), {
  autocompleteOptions: {
    data: {
      'Piou bleu': null
    },
    limit: 10,
    minLength: 1
  },
  placeholder: 'ex : Piou ...'
});

const autoDelete = M.Chips.init(document.querySelector('#autoDelete'), {
  autocompleteOptions: {
    data: {
      "Plume de Piou Bleu": "https://ankama.akamaized.net/games/dofus-tablette/assets/2.22.1/gfx/items/53114.png"
    },
    limit: 10,
    minLength: 1
  },
  placeholder: 'ex : Plume ...'
});

const putItemName = M.Autocomplete.init(document.querySelector('#putItemName'), {
  data: {
    "Plume de Piou Bleu": "https://ankama.akamaized.net/games/dofus-tablette/assets/2.22.1/gfx/items/53114.png"
  }
});

const getItemName = M.Autocomplete.init(document.querySelector('#getItemName'), {
  data: {
    "Plume de Piou Bleu": "https://ankama.akamaized.net/games/dofus-tablette/assets/2.22.1/gfx/items/53114.png"
  }
});

const lifeMinMax = document.getElementById("lifeMinMax");
noUiSlider.create(lifeMinMax, {
  start: [80, 100],
  connect: true,
  step: 1,
  orientation: "horizontal", // 'horizontal' or 'vertical'
  range: {
    min: 0,
    max: 100
  },
  format: wNumb({
    decimals: 0
  })
});

const monsterQuantMinMax = document.getElementById("monsterQuantMinMax");
noUiSlider.create(monsterQuantMinMax, {
  start: [1, 8],
  connect: true,
  step: 1,
  orientation: "horizontal", // 'horizontal' or 'vertical'
  range: {
    min: 1,
    max: 8
  },
  format: wNumb({
    decimals: 0
  })
});

const collapsible = M.Collapsible.init(document.querySelectorAll('.collapsible.expandable'), {
  accordion: false
});

$("#addGetItem").on("click", () => {
  const picture =
    "https://ankama.akamaized.net/games/dofus-tablette/assets/2.22.1/gfx/items/53114.png";
  const name = $("#getItemName").val();
  const quant = $("#getItemQuant").val();
  if (name.length > 0) {
    const html =
      `<tr><td><img src="${picture}" width="40" height="40"/></td><td>${name}</td><td>${quant}</td><td><a class="waves-effect waves-light btn amber accent-3">X</a></td></tr>`;
    $("table tbody").append(html);
  }
});