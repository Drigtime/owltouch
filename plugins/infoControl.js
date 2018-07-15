L.Control.Informations = L.Control.extend({
    options: {
		position: 'topright'
    },
    
	onAdd: function (map) {
		this._map = map;
		this._transformer = {
			geoCoordsToDofusCoords
		};

		var className = 'leaflet-control-info',
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

})