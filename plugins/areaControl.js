/*
 * L.Control.Area is used for displaying current area info on the map.
 */

L.Control.Area = L.Control.extend({
	options: {
		position: 'topright'
	},

	onAdd: function (map) {
		this._map = map;
		this._transformer = {
			geoCoordsToDofusCoords
		};

		var className = 'leaflet-control-area',
			container = this._container = L.DomUtil.create('div', className),
			options = this.options;

		//label containers
		this._labelcontainer = L.DomUtil.create("div", "uiElement label", container);
		this._label = L.DomUtil.create("span", "labelFirst", this._labelcontainer);

		//connect to mouseevents
		map.on("mousemove", this._update, this);
		map.on("move", this._pause, this);
		map.on("moveend", this._unpause, this);

		map.whenReady(this._update, this);

		return container;
	},

	onRemove: function (map) {
		map.off("move", this._pause, this);
		map.off("moveend", this._unpause, this);
	},

	/**
	 *	Mousemove callback function updating labels and input elements
	 */
	_update: function (evt) {
		var geoCoords = evt.latlng;

		if (geoCoords) {
			const [x, y] = this._transformer.geoCoordsToDofusCoords(geoCoords);
			var subAreas = this._getId(x, y)
			if (!subAreas.subAreaId) {
				L.DomUtil.addClass(this._labelcontainer, "uiHidden");
				this._label.innerHTML = "";
				return;
			}
			L.DomUtil.removeClass(this._labelcontainer, "uiHidden");
			this._label.innerHTML = areas[subAreas.subAreaId].nameId;

			// if (this._subAreas[x][y].length > 1) {
			//     this._label.innerHTML += " & " + this._t("subArea." + this._subAreas[x][y][1].id);
			// }
		}
	},

	_getId: function (x, y) {
        for (const key in mapList) {
            if (mapList[key].posX == x && mapList[key].posY == y && mapList[key].hasPriorityOnWorldmap && mapList[key].worldMap == 1) {
                return { id: mapList[key].id, subAreaId: mapList[key].subAreaId, worldMap: mapList[key].worldMap, mapIds: areas[mapList[key].subAreaId].mapIds }
            }
        }
        return false
    },

	_pause: function (evt) {
		this._map.off("mousemove", this._update, this);
		L.DomUtil.addClass(this._labelcontainer, "uiHidden");
	},

	_unpause: function (evt) {
		this._map.on("mousemove", this._update, this);
	}
});

//constructor registration
L.control.area = function (options) {
	return new L.Control.Area(options);
};

//map init hook
L.Map.mergeOptions({
	areaControl: false
});

L.Map.addInitHook(function () {
	if (this.options.areaControl) {
		this.areaControl = new L.Control.Area();
		this.addControl(this.areaControl);
	}
});
