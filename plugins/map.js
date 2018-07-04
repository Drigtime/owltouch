const mapList = require('./data/json/d2o/map.json');
const areas = require('./data/json/d2o/Areas.json')
const hints = require('./data/json/d2o/Hints.json');
const sizeOf = require('image-size');
require('leaflet')
require('leaflet.markercluster')
require('leaflet.markercluster.layersupport')
require('./plugins/areaControl')
require('./plugins/areaHighlight')
require('./plugins/coordControl')
// const mapList = require('./json/d2o/map.json');

const amakna = L.tileLayer('./data/tiles/amakna/{z}/{x}/{y}.jpg', {
	minZoom: 0,
	maxZoom: 4,
});

const map = L.map('map', {
	crs: L.CRS.Simple,
	// center: [-250, 315],
	center: [-261.0625, 425.34375],
	// zoom: 0,
	zoom: 4,
	layers: [amakna],
	zoomControl: true
});

let coordsTransform;
coordsTransform = new L.Transformation(69.5, 6517, 50, 4973);

const geoCoordsToPixelCoords = (geoCoords) => {
	return map.project(geoCoords, map.getMaxZoom());
};
const pixelCoordsToGeoCoords = (pixelCoords) => {
	return map.unproject(pixelCoords, map.getMaxZoom());
};
const pixelCoordsToDofusCoords = (pixelCoords) => {
	const { x, y } = coordsTransform.untransform(pixelCoords).round();
	return [x, y];
};
//in: dofus [x,y] out: pixel coords (x,y) of the [x,y] map's center pixel   
const dofusCoordsToPixelCoords = (dofusCoords) => {
	dofusCoords = L.point(dofusCoords);
	return coordsTransform.transform(dofusCoords);
};
const geoCoordsToDofusCoords = (geoCoords) => {
	const pixelCoords = geoCoordsToPixelCoords(geoCoords);
	return pixelCoordsToDofusCoords(pixelCoords);
};
//in: dofus [x,y] out: geo coords (lat,lng) of the [x,y] map's center pixel   
const dofusCoordsToGeoCoords = (dofusCoords) => {
	const pixelCoords = dofusCoordsToPixelCoords(dofusCoords);
	return pixelCoordsToGeoCoords(pixelCoords);
};

/* Mavvo.HighlightMap */

const dofusMapSubAreaHighlight = [];
let actualID;
let actualDofusCoords = {};

const highlightSubArea = (e) => {
	const geoCoords = e.latlng;
	const [x, y] = geoCoordsToDofusCoords(geoCoords);
	if (actualDofusCoords.x === x && actualDofusCoords.y === y) { return; }
	actualDofusCoords.x = x;
	actualDofusCoords.y = y;
	var subAreas = getId(x, y)
	if (!subAreas.subAreaId) {
		resetHighlightArea();
		actualID = -1;
		return;
	}
	const subAreaId = subAreas.subAreaId
	if (actualID === subAreaId) { return; }
	resetHighlightArea();
	actualID = subAreaId;
	const subAreaMapIds = getCoord(subAreas.mapIds)
	for (const key in subAreaMapIds) {
		const bounds = getDofusMapBounds([subAreaMapIds[key].x, subAreaMapIds[key].y]);
		const highlight = L.rectangle(bounds, { color: "#00ffcc", weight: 0, fillOpacity: 0.25, interactive: false, }).addTo(map);
		dofusMapSubAreaHighlight.push(highlight);
	}
}

function getId(x, y) {
	for (const key in mapList) {
		if (mapList[key].posX == x && mapList[key].posY == y && mapList[key].hasPriorityOnWorldmap && mapList[key].worldMap == 1) {
			return { id: mapList[key].id, subAreaId: mapList[key].subAreaId, worldMap: mapList[key].worldMap, mapIds: areas[mapList[key].subAreaId].mapIds }
		}
	}
	return false
}

function getCoord(mapIds) {
	let list = []
	for (const iterator of mapIds) {
		if (mapList[iterator].hasPriorityOnWorldmap) {
			list.push({ x: mapList[iterator].posX, y: mapList[iterator].posY })
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

const drawDofusMapBoundsOnMouseMove = (e) => {
	const geoCoords = e.latlng;
	const dofusCoords = geoCoordsToDofusCoords(geoCoords);
	if (dofusMapUnderMouse !== null) {
		if (map.hasLayer(dofusMapUnderMouse)) {
			if (dofusMapUnderMouse.getBounds().contains(e.latlng)) { return; }
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
	const bottomRightCornerCorner = L.point(topLeftCornerCorner.x + (34.75 * 2), topLeftCornerCorner.y + (25 * 2));
	const nW = pixelCoordsToGeoCoords(topLeftCornerCorner);
	const sE = pixelCoordsToGeoCoords(bottomRightCornerCorner);
	return [nW, sE];
}
const drawRectangle = (point) => {
	const bounds = getDofusMapBounds(point);
	dofusMapUnderMouse = L.rectangle(bounds, { color: 'black', opacity: 1, interactive: false, clickable: false, fillOpacity: 0, weight: 1.2 }).addTo(map);
};


var mcgLayerSupportGroup = L.markerClusterGroup.layerSupport({
	maxClusterRadius: 1, iconCreateFunction: function (cluster) {
		var markers = cluster.getAllChildMarkers();
		return L.divIcon({ html: `<img src="${markers[0].options.icon.options.iconUrl}"><div class="qnt">${cluster.getChildCount()}</div>`, className: 'mycluster', iconAnchor: [sizeOf(markers[0].options.icon.options.iconUrl).width / 2, sizeOf(markers[0].options.icon.options.iconUrl).height / 2] });
	}, animate: false
}),
	classStatue = L.layerGroup(),
	misc = L.layerGroup(),
	workshop = L.layerGroup(),
	market = L.layerGroup(),
	dungeon = L.layerGroup(),
	lairs = L.layerGroup();

mcgLayerSupportGroup.addTo(map);

for (const key in hints) {
	if (hints[key].worldMapId == 1) {
		if (hints[key].categoryId == 1) {
			L.marker(dofusCoordsToGeoCoords([hints[key].x, hints[key].y]), { icon: L.icon({ iconUrl: `./data/assets/hint/${hints[key].gfx}.png`, iconAnchor: [sizeOf(`./data/assets/hint/${hints[key].gfx}.png`).width / 2, sizeOf(`./data/assets/hint/${hints[key].gfx}.png`).height / 2] }) }).bindPopup(hints[key].nameId).addTo(classStatue)
		} else if (hints[key].categoryId == 4) {
			L.marker(dofusCoordsToGeoCoords([hints[key].x, hints[key].y]), { icon: L.icon({ iconUrl: `./data/assets/hint/${hints[key].gfx}.png`, iconAnchor: [sizeOf(`./data/assets/hint/${hints[key].gfx}.png`).width / 2, sizeOf(`./data/assets/hint/${hints[key].gfx}.png`).height / 2] }) }).bindPopup(hints[key].nameId).addTo(misc)
		} else if (hints[key].categoryId == 3) {
			L.marker(dofusCoordsToGeoCoords([hints[key].x, hints[key].y]), { icon: L.icon({ iconUrl: `./data/assets/hint/${hints[key].gfx}.png`, iconAnchor: [sizeOf(`./data/assets/hint/${hints[key].gfx}.png`).width / 2, sizeOf(`./data/assets/hint/${hints[key].gfx}.png`).height / 2] }) }).bindPopup(hints[key].nameId).addTo(workshop)
		} else if (hints[key].categoryId == 2) {
			L.marker(dofusCoordsToGeoCoords([hints[key].x, hints[key].y]), { icon: L.icon({ iconUrl: `./data/assets/hint/${hints[key].gfx}.png`, iconAnchor: [sizeOf(`./data/assets/hint/${hints[key].gfx}.png`).width / 2, sizeOf(`./data/assets/hint/${hints[key].gfx}.png`).height / 2] }) }).bindPopup(hints[key].nameId).addTo(market)
		} else if (hints[key].categoryId == 6) {
			L.marker(dofusCoordsToGeoCoords([hints[key].x, hints[key].y]), { icon: L.icon({ iconUrl: `./data/assets/hint/${hints[key].gfx}.png`, iconAnchor: [sizeOf(`./data/assets/hint/${hints[key].gfx}.png`).width / 2, sizeOf(`./data/assets/hint/${hints[key].gfx}.png`).height / 2] }) }).bindPopup(hints[key].nameId).addTo(dungeon)
		} else if (hints[key].categoryId == 9) {
			L.marker(dofusCoordsToGeoCoords([hints[key].x, hints[key].y]), { icon: L.icon({ iconUrl: `./data/assets/hint/${hints[key].gfx}.png`, iconAnchor: [sizeOf(`./data/assets/hint/${hints[key].gfx}.png`).width / 2, sizeOf(`./data/assets/hint/${hints[key].gfx}.png`).height / 2] }) }).bindPopup(hints[key].nameId).addTo(lairs)
		}
	}
}

mcgLayerSupportGroup.addTo(map);
mcgLayerSupportGroup.checkIn([classStatue, misc, workshop, market, dungeon, lairs]); // <= this is where the magic happens!

var baseLayers = {
	"Amakna": amakna
};

var overlays = {
	"Class": classStatue,
	"Misc": misc,
	"Workshop": workshop,
	"Market": market,
	"Dungeon": dungeon,
	"Lairs": lairs
};


map.addControl(L.control.coordinates())
map.addControl(L.control.area())
L.control.layers(baseLayers, overlays).addTo(map);


map.on('mousemove', (e) => {
	drawDofusMapBoundsOnMouseMove(e)
	highlightSubArea(e)
})
