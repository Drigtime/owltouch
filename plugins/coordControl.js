/*
 * L.Control.Coordinates is used for displaying current mouse coordinates on the map.
 */

L.Control.Coordinates = L.Control.extend({
    options: {
        position: "topright",
        decimals: 4,
        decimalSeperator: ".",
        labelTemplateLat: "Lat: {y}",
        labelTemplateLng: "Lng: {x}",
        labelFormatterLat: undefined,
        labelFormatterLng: undefined,
        enableUserInput: false,
        useDMS: false,
        useLatLngOrder: false,
        centerUserCoordinates: false,
        markerType: L.marker,
        markerProps: {},
        customLabelFcn: function (dofusCoords, opts) { return "[ " + dofusCoords.x + " , " + dofusCoords.y + " ]"; }
    },

    onAdd: function (map) {
        this._map = map;

        var className = 'leaflet-control-coordinates',
            container = this._container = L.DomUtil.create('div', className),
            options = this.options;

        L.DomEvent.disableScrollPropagation(this._container);
        L.DomEvent.disableClickPropagation(this._container);
        L.DomEvent.addListener(container, 'mousemove', L.DomEvent.stop);


        //label containers
        //this._labelcontainer = L.DomUtil.create("div", "uiElement label", container);
        //this._label = L.DomUtil.create("span", "labelFirst", this._labelcontainer);


        //input containers
        this._inputcontainer = L.DomUtil.create("div", "uiElement input", container);
        this._inputX = this._createInput("inputX", this._inputcontainer);
        commaSpan = L.DomUtil.create("span", "no-class", this._inputcontainer);
        commaSpan.innerHTML = ",";
        commaSpan.style.font = '18px/1.5 "Helvetica Neue", Arial, Helvetica, sans-serif';
        this._inputY = this._createInput("inputY", this._inputcontainer);
        this._mapId = L.DomUtil.create("input", "mapId", this._inputcontainer);
        this._mapId.style.width = "65px";
        L.DomEvent.on(this._inputX, 'keyup', this._handleKeypress, this);
        L.DomEvent.on(this._inputY, 'keyup', this._handleKeypress, this);
        L.DomEvent.on(this._mapId, 'keyup', this._handleKeypress, this);
        $(this._inputX).blur(function () {
            if ($(this).attr("data-selected-all")) {
                //Remove atribute to allow select all again on focus        
                $(this).removeAttr("data-selected-all");
            }
        });
        $(this._inputY).blur(function () {
            if ($(this).attr("data-selected-all")) {
                //Remove atribute to allow select all again on focus        
                $(this).removeAttr("data-selected-all");
            }
        });
        $(this._mapId).blur(function () {
            if ($(this).attr("data-selected-all")) {
                //Remove atribute to allow select all again on focus        
                $(this).removeAttr("data-selected-all");
            }
        });
        $(this._inputX).click(function () {
            if (!$(this).attr("data-selected-all")) {
                try {
                    $(this).selectionStart = 0;
                    $(this).selectionEnd = $(this).value.length + 1;
                    //add atribute allowing normal selecting post focus
                    $(this).attr("data-selected-all", true);
                } catch (err) {
                    $(this).select();
                    //add atribute allowing normal selecting post focus
                    $(this).attr("data-selected-all", true);
                }
            }
        });
        $(this._inputY).click(function () {
            if (!$(this).attr("data-selected-all")) {
                try {
                    $(this).selectionStart = 0;
                    $(this).selectionEnd = $(this).value.length + 1;
                    //add atribute allowing normal selecting post focus
                    $(this).attr("data-selected-all", true);
                } catch (err) {
                    $(this).select();
                    //add atribute allowing normal selecting post focus
                    $(this).attr("data-selected-all", true);
                }
            }
        });
        $(this._mapId).click(function () {
            if (!$(this).attr("data-selected-all")) {
                try {
                    $(this).selectionStart = 0;
                    $(this).selectionEnd = $(this).value.length + 1;
                    //add atribute allowing normal selecting post focus
                    $(this).attr("data-selected-all", true);
                } catch (err) {
                    $(this).select();
                    //add atribute allowing normal selecting post focus
                    $(this).attr("data-selected-all", true);
                }
            }
        });

        //connect to mouseevents
        map.on("mousemove", this._update, this);
        //map.on('dragstart', this.collapse, this);
        map.on("move", this._pause, this);
        map.on("moveend", this._unpause, this);

        map.whenReady(this._update, this);

        this._showsCoordinates = true;
        //wether or not to show inputs on click
        if (options.enableUserInput) {
            L.DomEvent.addListener(this._container, "click", this._switchUI, this);
        }

        return container;
    },

	/**
	 *	Creates an input HTML element in given container with given classname
	 */
    _createInput: function (classname, container) {
        var input = L.DomUtil.create("input", classname, container);
        input.type = "text";
        input.size = 3;
        input.maxLength = 3;
        input.style.width = "30px";
        return input;
    },

    _clearMarker: function () {
        this._map.removeLayer(this._marker);
    },

	/**
	 *	Called onkeyup of input fields
	 */
    _handleKeypress: function (e) {
        switch (e.keyCode) {
            case 13: //Enter
                this._handleSubmit(e);
                break;
            default: //All keys
                break;
        }
    },

	/**
	 *	Called on each keyup except ESC
	 */
    _handleSubmit: function (e) {
        if (e.target.className == 'mapId') {
            var mapid = this._mapId.value;
            if (mapid !== undefined) {
                var coord = this._getCoord([mapid])
                var geoCoords = dofusCoordsToGeoCoords([coord[0].x, coord[0].y]);
                geoCoords.latlng = geoCoords;
                map.flyTo(geoCoords, 4);
            }
        } else {
            var x = this._inputX.value;//L.NumberFormatter.createValidNumber(this._inputX.value, this.options.decimalSeperator);
            var y = this._inputY.value;//L.NumberFormatter.createValidNumber(this._inputY.value, this.options.decimalSeperator);
            if (x !== undefined && y !== undefined) {
                var geoCoords = dofusCoordsToGeoCoords([x, y]);
                geoCoords.latlng = geoCoords;
                map.flyTo(geoCoords, 4);
                // L.HighlightMap.drawDofusMapBoundsOnMouseMove(geoCoords);
            }
        }
    },

	/**
	 *	Shows inputs fields
	 */
    expand: function () {
        this._showsCoordinates = false;

        this._map.off("mousemove", this._update, this);

        L.DomEvent.addListener(this._container, "mousemove", L.DomEvent.stop);
        L.DomEvent.removeListener(this._container, "click", this._switchUI, this);

        L.DomUtil.addClass(this._labelcontainer, "uiHidden");
        L.DomUtil.removeClass(this._inputcontainer, "uiHidden");
    },

	/**
	 *	Creates the label according to given options and formatters
	 */
    _createCoordinateLabel: function (ll) {
        var opts = this.options,
            x, y;
        if (opts.customLabelFcn) {
            return opts.customLabelFcn(ll, opts);
        }
        if (opts.labelFormatterLat) {
            x = opts.labelFormatterLng(ll.lng);
        } else {
            x = L.Util.template(opts.labelTemplateLng, {
                x: this._getNumber(ll.lng, opts)
            });
        }
        if (opts.labelFormatterLat) {
            y = opts.labelFormatterLat(ll.lat);
        } else {
            y = L.Util.template(opts.labelTemplateLat, {
                y: this._getNumber(ll.lat, opts)
            });
        }
        if (opts.useLatLngOrder) {
            return y + " " + x;
        }
        return x + " " + y;
    },

	/**
	 *	Returns a Number according to options (DMS or decimal)
	 */
    _getNumber: function (n, opts) {
        var res;
        if (opts.useDMS) {
            res = n;//L.NumberFormatter.toDMS(n);
        } else {
            res = n;//L.NumberFormatter.round(n, opts.decimals, opts.decimalSeperator);
        }
        return res;
    },

	/**
	 *	Shows coordinate labels after user input has ended. Also
	 *	displays a marker with popup at the last input position.
	 */
    collapse: function () {
        if (!this._showsCoordinates) {
            this._map.on("mousemove", this._update, this);
            this._showsCoordinates = true;
            var opts = this.options;
            L.DomEvent.addListener(this._container, "click", this._switchUI, this);
            L.DomEvent.removeListener(this._container, "mousemove", L.DomEvent.stop);

            L.DomUtil.addClass(this._inputcontainer, "uiHidden");
            L.DomUtil.removeClass(this._labelcontainer, "uiHidden");

            if (this._marker) {
                var m = this._createNewMarker(),
                    ll = this._marker.getLatLng();
                m.setLatLng(ll);

                var container = L.DomUtil.create("div", "");
                var label = L.DomUtil.create("div", "", container);
                label.innerHTML = this._ordinateLabel(ll);

                var close = L.DomUtil.create("a", "", container);
                close.innerHTML = "Remove";
                close.href = "#";
                var stop = L.DomEvent.stopPropagation;

                L.DomEvent
                    .on(close, 'click', stop)
                    .on(close, 'mousedown', stop)
                    .on(close, 'dblclick', stop)
                    .on(close, 'click', L.DomEvent.preventDefault)
                    .on(close, 'click', function () {
                        this._map.removeLayer(m);
                    }, this);

                m.bindPopup(container);
                m.addTo(this._map);
                this._map.removeLayer(this._marker);
                this._marker = null;
            }
        }
    },

	/**
	 *	Click callback for UI
	 */
    _switchUI: function (evt) {
        L.DomEvent.stop(evt);
        L.DomEvent.stopPropagation(evt);
        L.DomEvent.preventDefault(evt);
        if (this._showsCoordinates) {
            //show textfields
            this.expand();
        } else {
            //show coordinates
            this.collapse();
        }
    },

    onRemove: function (map) {
        map.off("mousemove", this._update, this);
    },

	/**
	 *	Mousemove callback function updating labels and input elements
	 */
    _update: function (evt) {
        var geoCoords = evt.latlng,
            opts = this.options;
        if (geoCoords) {
            const [x, y] = geoCoordsToDofusCoords(geoCoords);
            var subAreas = this._getId(x, y)
            if (!subAreas.subAreaId) {
                if (this._showsCoordinates) {
                    //L.DomUtil.addClass(this._labelcontainer, "uiHidden"); 
                    //this._label.innerHTML = this._createCoordinateLabel({ x: "-", y: "-" });
                    this._inputX.value = "";
                    this._inputY.value = "";
                    this._mapId.value = "";
                    this._showsCoordinates = false;
                }
                return;
            }
            this._showsCoordinates = true;
            //L.DomUtil.removeClass(this._labelcontainer, "uiHidden");
            this._mapId.value = subAreas.id;
            //this._inputX.value = L.NumberFormatter.round(geoCoords.lng, opts.decimals, opts.decimalSeperator);
            //this._label.innerHTML = this._createCoordinateLabel(dofusCoords);
            this._inputX.value = x;
            this._inputY.value = y;
            // this._areaName.innerHTML = areas[subAreas.subAreaId].nameId;
            // let coords = this._getCoord(subAreas.mapIds)
            // if (highlight !== undefined) {
            //     for (const iterator of highlight) {
            //         L.map.removeLayer(highlight[iterator])
            //     }
            // }
            // var highlight = []
            // for (const key in coords) {
            //     const bounds = getDofusMapBounds([coords[key].x, coords[key].y]);
            //     highlight.push(L.rectangle(bounds, { color: "#00ffcc", weight: 0, fillOpacity: 0.25, interactive: false, }).addTo(map))
            //     // dofusMapSubAreaHighlight.push(highlight);
            // }
        }
    },

    _getCoord: function (mapIds) {
        let list = []
        for (const iterator of mapIds) {
            if (mapList[iterator].hasPriorityOnWorldmap && mapList[iterator].worldMap == 1) {
                list.push({ x: mapList[iterator].posX, y: mapList[iterator].posY })
            }
        }
        return list;
    },

    _getId: function (x, y) {
        for (const key in mapList) {
            if (mapList[key].posX == x && mapList[key].posY == y && mapList[key].worldMap == 1 && mapList[key].hasPriorityOnWorldmap) {
                return { id: mapList[key].id, subAreaId: mapList[key].subAreaId, worldMap: mapList[key].worldMap, mapIds: areas[mapList[key].subAreaId].mapIds }
            }
        }
        return false
    },

    _createNewMarker: function () {
        return this.options.markerType(null, this.options.markerProps);
    },
    _pause: function (evt) {
        this._map.off("mousemove", this._update, this);
        //L.DomUtil.addClass(this._labelcontainer, "uiHidden");
    },

    _unpause: function (evt) {
        this._map.on("mousemove", this._update, this);
    }

});

//constructor registration
L.control.coordinates = function (options) {
    return new L.Control.Coordinates(options);
};

//map init hook
L.Map.mergeOptions({
    coordinateControl: false
});

L.Map.addInitHook(function () {
    if (this.options.coordinateControl) {
        this.coordinateControl = new L.Control.Coordinates();
        this.addControl(this.coordinateControl);
    }
});
