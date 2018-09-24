const mapList = require('./data/json/d2o/map.json'),
	areas = require('./data/json/d2o/Areas.json'),
	json = {
		hints: require('./data/json/d2o/Hints.json'),
		farmer: {
			whea: require('./data/json/farmer/ble.json'),
			barl: require('./data/json/farmer/Orge.json'),
			oats: require('./data/json/farmer/Avoine.json'),
			hop: require('./data/json/farmer/houblon.json'),
			flax: require('./data/json/farmer/Lin.json'),
			rice: require('./data/json/farmer/Riz.json'),
			rye: require('./data/json/farmer/Seigle.json'),
			malt: require('./data/json/farmer/Malt.json'),
			hemp: require('./data/json/farmer/Chanvre.json'),
			fros: require('./data/json/farmer/Frostriz.json')
		}
	}
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
	hint = {
		class: L.layerGroup(),
		misc: L.layerGroup(),
		workshop: L.layerGroup(),
		market: L.layerGroup(),
		dungeon: L.layerGroup(),
		lairs: L.layerGroup()
	},
	farmer = {
		whea: L.layerGroup(),
		barl: L.layerGroup(),
		oats: L.layerGroup(),
		hop: L.layerGroup(),
		flax: L.layerGroup(),
		rice: L.layerGroup(),
		rye: L.layerGroup(),
		malt: L.layerGroup(),
		hemp: L.layerGroup(),
		fros: L.layerGroup()
	},
	lumberjack = {

	},
	alchemist = {

	},
	fisherman = {

	},
	miner = {

	};

mcgLayerSupportGroup.addTo(map);

for (const key in json.hints) {
	if (json.hints[key].worldMapId == 1) {
		if (json.hints[key].categoryId == 1) {
			L.marker(dofusCoordsToGeoCoords([json.hints[key].x, json.hints[key].y]), { icon: L.icon({ iconUrl: `./data/assets/hint/${json.hints[key].gfx}.png`, iconAnchor: [sizeOf(`./data/assets/hint/${json.hints[key].gfx}.png`).width / 2, sizeOf(`./data/assets/hint/${json.hints[key].gfx}.png`).height / 2] }) }).bindPopup(json.hints[key].nameId).addTo(hint.class)
		} else if (json.hints[key].categoryId == 4) {
			L.marker(dofusCoordsToGeoCoords([json.hints[key].x, json.hints[key].y]), { icon: L.icon({ iconUrl: `./data/assets/hint/${json.hints[key].gfx}.png`, iconAnchor: [sizeOf(`./data/assets/hint/${json.hints[key].gfx}.png`).width / 2, sizeOf(`./data/assets/hint/${json.hints[key].gfx}.png`).height / 2] }) }).bindPopup(json.hints[key].nameId).addTo(hint.misc)
		} else if (json.hints[key].categoryId == 3) {
			L.marker(dofusCoordsToGeoCoords([json.hints[key].x, json.hints[key].y]), { icon: L.icon({ iconUrl: `./data/assets/hint/${json.hints[key].gfx}.png`, iconAnchor: [sizeOf(`./data/assets/hint/${json.hints[key].gfx}.png`).width / 2, sizeOf(`./data/assets/hint/${json.hints[key].gfx}.png`).height / 2] }) }).bindPopup(json.hints[key].nameId).addTo(hint.workshop)
		} else if (json.hints[key].categoryId == 2) {
			L.marker(dofusCoordsToGeoCoords([json.hints[key].x, json.hints[key].y]), { icon: L.icon({ iconUrl: `./data/assets/hint/${json.hints[key].gfx}.png`, iconAnchor: [sizeOf(`./data/assets/hint/${json.hints[key].gfx}.png`).width / 2, sizeOf(`./data/assets/hint/${json.hints[key].gfx}.png`).height / 2] }) }).bindPopup(json.hints[key].nameId).addTo(hint.market)
		} else if (json.hints[key].categoryId == 6) {
			L.marker(dofusCoordsToGeoCoords([json.hints[key].x, json.hints[key].y]), { icon: L.icon({ iconUrl: `./data/assets/hint/${json.hints[key].gfx}.png`, iconAnchor: [sizeOf(`./data/assets/hint/${json.hints[key].gfx}.png`).width / 2, sizeOf(`./data/assets/hint/${json.hints[key].gfx}.png`).height / 2] }) }).bindPopup(json.hints[key].nameId).addTo(hint.dungeon)
		} else if (json.hints[key].categoryId == 9) {
			L.marker(dofusCoordsToGeoCoords([json.hints[key].x, json.hints[key].y]), { icon: L.icon({ iconUrl: `./data/assets/hint/${json.hints[key].gfx}.png`, iconAnchor: [sizeOf(`./data/assets/hint/${json.hints[key].gfx}.png`).width / 2, sizeOf(`./data/assets/hint/${json.hints[key].gfx}.png`).height / 2] }) }).bindPopup(json.hints[key].nameId).addTo(hint.lairs)
		}
	}
}

for (const key in json.farmer.whea) {
	L.marker(dofusCoordsToGeoCoords([json.farmer.whea[key].posX, json.farmer.whea[key].posY])).addTo(farmer.whea)
}
for (const key in json.farmer.barl) {
	L.marker(dofusCoordsToGeoCoords([json.farmer.barl[key].posX, json.farmer.barl[key].posY])).addTo(farmer.barl)
}
for (const key in json.farmer.oats) {
	L.marker(dofusCoordsToGeoCoords([json.farmer.oats[key].posX, json.farmer.oats[key].posY])).addTo(farmer.oats)
}
for (const key in json.farmer.hop) {
	L.marker(dofusCoordsToGeoCoords([json.farmer.hop[key].posX, json.farmer.hop[key].posY])).addTo(farmer.hop)
}
for (const key in json.farmer.flax) {
	L.marker(dofusCoordsToGeoCoords([json.farmer.flax[key].posX, json.farmer.flax[key].posY])).addTo(farmer.flax)
}
for (const key in json.farmer.rice) {
	L.marker(dofusCoordsToGeoCoords([json.farmer.rice[key].posX, json.farmer.rice[key].posY])).addTo(farmer.rice)
}
for (const key in json.farmer.rye) {
	L.marker(dofusCoordsToGeoCoords([json.farmer.rye[key].posX, json.farmer.rye[key].posY])).addTo(farmer.rye)
}
for (const key in json.farmer.malt) {
	L.marker(dofusCoordsToGeoCoords([json.farmer.malt[key].posX, json.farmer.malt[key].posY])).addTo(farmer.malt)
}
for (const key in json.farmer.hemp) {
	L.marker(dofusCoordsToGeoCoords([json.farmer.hemp[key].posX, json.farmer.hemp[key].posY])).addTo(farmer.hemp)
}
for (const key in json.farmer.fros) {
	L.marker(dofusCoordsToGeoCoords([json.farmer.fros[key].posX, json.farmer.fros[key].posY])).addTo(farmer.fros)
}


mcgLayerSupportGroup.addTo(map);
mcgLayerSupportGroup.checkIn([
	hint.class,
	hint.misc,
	hint.workshop,
	hint.market,
	hint.dungeon,
	hint.lairs,
	farmer.barl,
	farmer.oats,
	farmer.hop,
	farmer.flax,
	farmer.rice,
	farmer.rye,
	farmer.malt,
	farmer.hemp,
	farmer.fros]); // <= this is where the magic happens!

var baseLayers = {
	"Amakna": amakna
};

var overlays = {
	"Class": hint.class,
	"Misc": hint.misc,
	"Workshop": hint.workshop,
	"Market": hint.market,
	"Dungeon": hint.dungeon,
	"Lairs": hint.lairs,

	"whea": farmer.whea,
	"barl": farmer.barl,
	"oats": farmer.oats,
	"hop": farmer.hop,
	"flax": farmer.flax,
	"rice": farmer.rice,
	"rye": farmer.rye,
	"malt": farmer.malt,
	"hemp": farmer.hemp,
	"fros": farmer.fros
};

map.addControl(L.control.coordinates())
map.addControl(L.control.area())
L.control.layers(baseLayers, overlays).addTo(map);

map.on('mousemove', (e) => {
	drawDofusMapBoundsOnMouseMove(e)
	highlightSubArea(e)
})
