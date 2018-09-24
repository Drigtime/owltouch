/*
 * L.Control.Fisher is used for displaying toggling fisher resource buttons.
 */

L.Control.Fisher = L.Control.extend({
	options: {
		position: 'topleft'
	},

	onAdd: function (map) {
		this._menuToggle = false;
		this._visible = [];
		this.prof = "fish";
		this.resources = [
			"1 - Breaded Fish",
			"1 - Contest Snapper",
			"1 - Crab Stick",
			"1 - Grawn",
			"1 - Gudgeon",
			"1 - Kittenfish",
			"1 - Trout",
			"10 - Pike",
			"20 - Shiny Sardine"
		];
		var className = 'leaflet-control-fisher container-resources';
		var container = this._container = L.DomUtil.create('div', className);
		L.DomEvent.addListener(container, 'dblclick', L.DomEvent.stop);
		L.DomEvent.addListener(container, 'click', L.DomEvent.stop);
		L.DomEvent.addListener(container, 'mousemove', L.DomEvent.stop);
		var options = this.options;

		this._aButton = L.DomUtil.create("a", "fish-control", container);
		this._aButton.setAttribute("href", "#");
		this._aButton.setAttribute('title', 'Pécheur');
		this._imgButton = L.DomUtil.create("img", "no-class", this._aButton);
		this._imgButton.setAttribute('src', './data/assets/fish/fish.png');

		L.DomEvent.addListener(this._aButton, 'click', this._click, this);

		map.on("move", this._close, this);
		map.on("click", this._close, this);

		this._magicContainer = L.DomUtil.create("div", "container-resources-magic", container);

		this._buttons = [];
		var resourcesLength = this.resources.length;
		for (var i = 0; i < resourcesLength; i++) {
			var aMagicButton = L.DomUtil.create("a", "scale-border-in-out " + this.resources[i], this._magicContainer);
			aMagicButton.setAttribute("href", "#");
			// aMagicButton.setAttribute('title', i18next.t(this.prof + "." + this.resources[i]));
			var imgMagicButton = L.DomUtil.create("img", "no-class", aMagicButton);
			imgMagicButton.setAttribute('src', "./data/assets/fish/" + this.resources[i] + ".png");
			L.DomEvent.addListener(aMagicButton, 'click', this._toggle, this);
		}

		// for (var j = 0; j < resourcesLength; j++) {
		// 	Mavvo.Markers.preLoadMarkers(this.prof, this.resources[j]);
		// }

		return container;
	},

	_click: function (evt) {
		if (evt.ctrlKey) {
			for (var i = 0; i < this.resources.length; i++) {
				if (this._visible[i]) {
					continue;
				}
				$(this._magicContainer.children[i])[0].click();
			}
			return;
		}
		if (evt.altKey) {
			for (var j = 0; j < this.resources.length; j++) {
				if (this._visible[j]) {
					$(this._magicContainer.children[j])[0].click();
				} else {
					continue;
				}
			}
			return;
		}
		if (this._menuToggle === false) {
			L.DomUtil.addClass(this._aButton, 'container-resources-open');
			L.DomUtil.addClass(this._magicContainer, 'in');
			this._menuToggle = true;
		} else {
			this._close();
		}
	},
	_close: function () {
		L.DomUtil.removeClass(this._magicContainer, 'in');
		L.DomUtil.removeClass(this._aButton, 'container-resources-open');
		this._menuToggle = false;
	},
	_toggle: function (a) {
		for (var i = 0; i < this.resources.length; i++) {
			if (L.DomUtil.hasClass(a.currentTarget, this.resources[i])) {
				if (this._visible[i]) {
					Mavvo.Markers.hideMarker(this.resources[i]);
					L.DomUtil.removeClass(a.currentTarget, 'selected');
					this._visible[i] = false;
				} else {
					Mavvo.Markers.displayResource(this.prof, this.resources[i]);
					L.DomUtil.addClass(a.currentTarget, 'selected');
					this._visible[i] = true;
				}
				break;
			}
		}
		return;
	},

	onRemove: function (map) {
		map.off("move", this._close, this);
		map.off("click", this._close, this);
		//todo remove toggle listeners?
	}
});

//constructor registration
L.control.fisher = function (options) {
	return new L.Control.Fisher(options);
};

//map init hook
L.Map.mergeOptions({
	fisherControl: false
});

L.Map.addInitHook(function () {
	if (this.options.fisherControl) {
		this.fisherControl = new L.Control.Fisher();
		this.addControl(this.fisherControl);
	}
});