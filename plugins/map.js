const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const hints = require('./data/json/d2o/Hints.json');
const sizeOf = require('image-size');
const settings = require('./data/settings.json')
const { ipcRenderer } = electron;
// const mapList = require('./json/d2o/map.json');

const amakna = L.tileLayer('./data/tiles/amakna/{z}/{x}/{y}.jpg', {
	minZoom: 0,
	maxZoom: 4,
});

var classStatue = L.markerClusterGroup({
	maxClusterRadius: 1, iconCreateFunction: function (cluster) {
		var markers = cluster.getAllChildMarkers();
		return L.divIcon({ html: `<img src="${markers[0].options.icon.options.iconUrl}"><div class="qnt">${cluster.getChildCount()}</div>`, className: 'mycluster', iconAnchor: [sizeOf(markers[0].options.icon.options.iconUrl).width / 2, sizeOf(markers[0].options.icon.options.iconUrl).height / 2] });
	}, animate: false
}), misc = L.markerClusterGroup({
	maxClusterRadius: 1, iconCreateFunction: function (cluster) {
		var markers = cluster.getAllChildMarkers();
		return L.divIcon({ html: `<img src="${markers[0].options.icon.options.iconUrl}"><div class="qnt">${cluster.getChildCount()}</div>`, className: 'mycluster', iconAnchor: [sizeOf(markers[0].options.icon.options.iconUrl).width / 2, sizeOf(markers[0].options.icon.options.iconUrl).height / 2] });
	}, animate: false
}), workshop = L.markerClusterGroup({
	maxClusterRadius: 1, iconCreateFunction: function (cluster) {
		var markers = cluster.getAllChildMarkers();
		return L.divIcon({ html: `<img src="${markers[0].options.icon.options.iconUrl}"><div class="qnt">${cluster.getChildCount()}</div>`, className: 'mycluster', iconAnchor: [sizeOf(markers[0].options.icon.options.iconUrl).width / 2, sizeOf(markers[0].options.icon.options.iconUrl).height / 2] });
	}, animate: false
}), market = L.markerClusterGroup({
	maxClusterRadius: 1, iconCreateFunction: function (cluster) {
		var markers = cluster.getAllChildMarkers();
		return L.divIcon({ html: `<img src="${markers[0].options.icon.options.iconUrl}"><div class="qnt">${cluster.getChildCount()}</div>`, className: 'mycluster', iconAnchor: [sizeOf(markers[0].options.icon.options.iconUrl).width / 2, sizeOf(markers[0].options.icon.options.iconUrl).height / 2] });
	}, animate: false
}), dungeon = L.markerClusterGroup({
	maxClusterRadius: 1, iconCreateFunction: function (cluster) {
		var markers = cluster.getAllChildMarkers();
		return L.divIcon({ html: `<img src="${markers[0].options.icon.options.iconUrl}"><div class="qnt">${cluster.getChildCount()}</div>`, className: 'mycluster', iconAnchor: [sizeOf(markers[0].options.icon.options.iconUrl).width / 2, sizeOf(markers[0].options.icon.options.iconUrl).height / 2] });
	}, animate: false
}), lairs = L.markerClusterGroup({
	maxClusterRadius: 1, iconCreateFunction: function (cluster) {
		var markers = cluster.getAllChildMarkers();
		return L.divIcon({ html: `<img src="${markers[0].options.icon.options.iconUrl}"><div class="qnt">${cluster.getChildCount()}</div>`, className: 'mycluster', iconAnchor: [sizeOf(markers[0].options.icon.options.iconUrl).width / 2, sizeOf(markers[0].options.icon.options.iconUrl).height / 2] });
	}, animate: false
});

const map = L.map('map', {
	crs: L.CRS.Simple,
	// center: [-250, 315],
	center: [-261.0625, 425.34375],
	// zoom: 0,
	zoom: 4,
	layers: [amakna, classStatue, misc, workshop, market, dungeon, lairs],
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
// const subAreas = Mavvo.SubAreas.subAreas;
// const subAreaMapDb = Mavvo.SubAreas.subAreaMapDb;

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
	dofusMapUnderMouse = L.rectangle(bounds, { color: 'black', opacity: 1, interactive: false, clickable: false, fillOpacity: 0, weight: 1.2}).addTo(map);
};

for (const key in hints) {
	if (hints[key].worldMapId == 1) {
		if (hints[key].categoryId == 1) {
			L.marker(dofusCoordsToGeoCoords([hints[key].x, hints[key].y]), { icon: L.icon({ iconUrl: `./data/assets/hint/${hints[key].gfx}.png`, iconAnchor: [sizeOf(`./data/assets/hint/${hints[key].gfx}.png`).width / 2, sizeOf(`./data/assets/hint/${hints[key].gfx}.png`).height / 2] }) }).bindPopup(hints[key].nameId).addTo(classStatue)
			// L.marker(dofusCoordsToGeoCoords([hints[key].x, hints[key].y]), { icon: L.icon({ iconUrl: `./data/assets/hint/${hints[key].gfx}.png`, iconAnchor: [sizeOf(`./data/assets/hint/${hints[key].gfx}.png`).width / 2, sizeOf(`./data/assets/hint/${hints[key].gfx}.png`).height / 2] }) }).bindPopup(hints[key].nameId).addTo(map)
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

// const hint = {
// 	classStatue: [],
// 	misc: [],
// 	workshop: [],
// 	market: [],
// 	dungeon: [],
// 	lairs: []
// }

// for (const key in hints) {
// 	if (hints[key].worldMapId == 1) {
// 		if (hints[key].categoryId == 1) {
// 			hint.classStatue.push(L.marker(dofusCoordsToGeoCoords([hints[key].x, hints[key].y]), { icon: L.icon({ iconUrl: `./data/assets/hint/${hints[key].gfx}.png`, iconAnchor: [sizeOf(`./data/assets/hint/${hints[key].gfx}.png`).width / 2, sizeOf(`./data/assets/hint/${hints[key].gfx}.png`).height / 2] }) }).bindPopup(hints[key].nameId))
// 		} else if (hints[key].categoryId == 4) {
// 			hint.misc.push(L.marker(dofusCoordsToGeoCoords([hints[key].x, hints[key].y]), { icon: L.icon({ iconUrl: `./data/assets/hint/${hints[key].gfx}.png`, iconAnchor: [sizeOf(`./data/assets/hint/${hints[key].gfx}.png`).width / 2, sizeOf(`./data/assets/hint/${hints[key].gfx}.png`).height / 2] }) }).bindPopup(hints[key].nameId))
// 		} else if (hints[key].categoryId == 3) {
// 			hint.workshop.push(L.marker(dofusCoordsToGeoCoords([hints[key].x, hints[key].y]), { icon: L.icon({ iconUrl: `./data/assets/hint/${hints[key].gfx}.png`, iconAnchor: [sizeOf(`./data/assets/hint/${hints[key].gfx}.png`).width / 2, sizeOf(`./data/assets/hint/${hints[key].gfx}.png`).height / 2] }) }).bindPopup(hints[key].nameId))
// 		} else if (hints[key].categoryId == 2) {
// 			hint.market.push(L.marker(dofusCoordsToGeoCoords([hints[key].x, hints[key].y]), { icon: L.icon({ iconUrl: `./data/assets/hint/${hints[key].gfx}.png`, iconAnchor: [sizeOf(`./data/assets/hint/${hints[key].gfx}.png`).width / 2, sizeOf(`./data/assets/hint/${hints[key].gfx}.png`).height / 2] }) }).bindPopup(hints[key].nameId))
// 		} else if (hints[key].categoryId == 6) {
// 			hint.dungeon.push(L.marker(dofusCoordsToGeoCoords([hints[key].x, hints[key].y]), { icon: L.icon({ iconUrl: `./data/assets/hint/${hints[key].gfx}.png`, iconAnchor: [sizeOf(`./data/assets/hint/${hints[key].gfx}.png`).width / 2, sizeOf(`./data/assets/hint/${hints[key].gfx}.png`).height / 2] }) }).bindPopup(hints[key].nameId))
// 		} else if (hints[key].categoryId == 9) {
// 			hint.lairs.push(L.marker(dofusCoordsToGeoCoords([hints[key].x, hints[key].y]), { icon: L.icon({ iconUrl: `./data/assets/hint/${hints[key].gfx}.png`, iconAnchor: [sizeOf(`./data/assets/hint/${hints[key].gfx}.png`).width / 2, sizeOf(`./data/assets/hint/${hints[key].gfx}.png`).height / 2] }) }).bindPopup(hints[key].nameId))
// 		}
// 	}
// }

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
// map.addControl(L.control.info())
L.control.layers(baseLayers, overlays).addTo(map);


map.on('mousemove', (e) => {
	// console.log(geoCoordsToDofusCoords(e.latlng))
	drawDofusMapBoundsOnMouseMove(e)
	highlightSubArea(e)
	// coords = geoCoordsToDofusCoords(e.latlng);
	// x = coords[0];
	// y = coords[1];
	// var divCoordinates = document.querySelector('#mapCoordinates');
	// divCoordinates.innerHTML = x + ', ' + y;
	// if (objOnMap.staticMarkersOver) {
	// 	divCoordinates.innerHTML += '<br/><span style="font-size:12px;font-weight:normal;">' + objOnMap.staticMarkersOver + '</span>';
	// }
	// divCoordinates.style.top = e.containerPoint.y + 6 + 'px';
	// divCoordinates.style.left = e.containerPoint.x + 6 + 'px';
	// divCoordinates.style.display = 'block';
	// objOnMap.rectangle.setLatLng(dofusCoordsToGeoCoords([x, y]));
})
