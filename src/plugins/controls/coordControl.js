/*
 * L.Control.Coordinates is used for displaying current mouse coordinates on the map.
 */
import { dofusCoordsToGeoCoords, geoCoordsToDofusCoords, map, getCoord, getId } from '../map';

L.Control.Coordinates = L.Control.extend({
  options: {
    position: 'topright',
    decimals: 4,
    decimalSeperator: '.',
    labelTemplateLat: 'Lat: {y}',
    labelTemplateLng: 'Lng: {x}',
    labelFormatterLat: undefined,
    labelFormatterLng: undefined,
    enableUserInput: false,
    useDMS: false,
    useLatLngOrder: false,
    centerUserCoordinates: false,
    markerType: L.marker,
    markerProps: {},
    customLabelFcn(dofusCoords, opts) {
      return `[ ${dofusCoords.x} , ${dofusCoords.y} ]`;
    },
  },

  onAdd(map) {
    this._map = map;

    const className = 'leaflet-control-coordinates';
    const container = this._container = L.DomUtil.create('div', className);
    const options = this.options;

    L.DomEvent.disableScrollPropagation(this._container);
    L.DomEvent.disableClickPropagation(this._container);
    L.DomEvent.addListener(container, 'mousemove', L.DomEvent.stop);

        // input containers
    this._inputcontainer = L.DomUtil.create('div', 'uiElement blue-grey darken-5', container);
    this._inputcontainer.style.width = '125px';
    this._inputcontainer.style.padding = '5px';
    this._coordcontainer = L.DomUtil.create('div', 'row', this._inputcontainer);
    this._coordcontainer.style.marginBottom = '5px';
    this._inputxcontainer = L.DomUtil.create('div', 'col s6', this._coordcontainer);
    this._inputX = this._createInput('inputX', this._inputxcontainer);
    this._inputX.placeholder = 'X';
    this._inputycontainer = L.DomUtil.create('div', 'col s6', this._coordcontainer);
    this._inputY = this._createInput('inputY', this._inputycontainer);
    this._inputY.placeholder = 'Y';
    this._idcontainer = L.DomUtil.create('div', 'row', this._inputcontainer);
    this._idcontainer.style.marginTop = '5px';
    this._idcontainer.style.marginBottom = '5px';
    this._mapidcontainer = L.DomUtil.create('div', 'col s12', this._idcontainer);
    this._mapId = this._createInput('input', this._mapidcontainer);
    this._mapId.placeholder = 'MapId';
    this._mapId.maxLength = 10;
    this._mapId.id = 'mapId';
    L.DomEvent.on(this._inputX, 'keyup', this._handleKeypress, this);
    L.DomEvent.on(this._inputY, 'keyup', this._handleKeypress, this);
    L.DomEvent.on(this._mapId, 'keyup', this._handleKeypress, this);
    $(this._inputX).blur(function () {
      if ($(this).attr('data-selected-all')) {
                // Remove atribute to allow select all again on focus
        $(this).removeAttr('data-selected-all');
      }
    });
    $(this._inputY).blur(function () {
      if ($(this).attr('data-selected-all')) {
                // Remove atribute to allow select all again on focus
        $(this).removeAttr('data-selected-all');
      }
    });
    $(this._mapId).blur(function () {
      if ($(this).attr('data-selected-all')) {
                // Remove atribute to allow select all again on focus
        $(this).removeAttr('data-selected-all');
      }
    });
    $(this._inputX).click(function () {
      if (!$(this).attr('data-selected-all')) {
        try {
          $(this).selectionStart = 0;
          $(this).selectionEnd = $(this).value.length + 1;
                    // add atribute allowing normal selecting post focus
          $(this).attr('data-selected-all', true);
        } catch (err) {
          $(this).select();
                    // add atribute allowing normal selecting post focus
          $(this).attr('data-selected-all', true);
        }
      }
    });
    $(this._inputY).click(function () {
      if (!$(this).attr('data-selected-all')) {
        try {
          $(this).selectionStart = 0;
          $(this).selectionEnd = $(this).value.length + 1;
                    // add atribute allowing normal selecting post focus
          $(this).attr('data-selected-all', true);
        } catch (err) {
          $(this).select();
                    // add atribute allowing normal selecting post focus
          $(this).attr('data-selected-all', true);
        }
      }
    });
    $(this._mapId).click(function () {
      if (!$(this).attr('data-selected-all')) {
        try {
          $(this).selectionStart = 0;
          $(this).selectionEnd = $(this).value.length + 1;
                    // add atribute allowing normal selecting post focus
          $(this).attr('data-selected-all', true);
        } catch (err) {
          $(this).select();
                    // add atribute allowing normal selecting post focus
          $(this).attr('data-selected-all', true);
        }
      }
    });

        // connect to mouseevents
    map.on('mousemove', this._update, this);
        // map.on('dragstart', this.collapse, this);
    map.on('move', this._pause, this);
    map.on('moveend', this._unpause, this);

    map.whenReady(this._update, this);

    this._showsCoordinates = true;
        // wether or not to show inputs on click
    if (options.enableUserInput) {
      L.DomEvent.addListener(this._container, 'click', this._switchUI, this);
    }

    return container;
  },

    /**
     *	Creates an input HTML element in given container with given classname
     */
  _createInput(classname, container) {
    const input = L.DomUtil.create('input', classname, container);
    input.type = 'text';
    input.className = 'input-field';
    input.maxLength = 3;
    return input;
  },

  _clearMarker() {
    this._map.removeLayer(this._marker);
  },

    /**
     *	Called onkeyup of input fields
     */
  _handleKeypress(e) {
    switch (e.keyCode) {
      case 13: // Enter
        this._handleSubmit(e);
        break;
      default: // All keys
        break;
    }
  },

    /**
     *	Called on each keyup except ESC
     */
  _handleSubmit(e) {
    if (e.target.id == 'mapId') {
      const mapid = this._mapId.value;
      if (mapid !== undefined) {
        const coord = getCoord([mapid]);
        var geoCoords = dofusCoordsToGeoCoords([coord[0].x, coord[0].y]);
        geoCoords.latlng = geoCoords;
        map.flyTo(geoCoords, 4);
      }
    } else {
      const x = this._inputX.value; // L.NumberFormatter.createValidNumber(this._inputX.value, this.options.decimalSeperator);
      const y = this._inputY.value; // L.NumberFormatter.createValidNumber(this._inputY.value, this.options.decimalSeperator);
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
  expand() {
    this._showsCoordinates = false;

    this._map.off('mousemove', this._update, this);

    L.DomEvent.addListener(this._container, 'mousemove', L.DomEvent.stop);
    L.DomEvent.removeListener(this._container, 'click', this._switchUI, this);

    L.DomUtil.addClass(this._labelcontainer, 'uiHidden');
    L.DomUtil.removeClass(this._inputcontainer, 'uiHidden');
  },

    /**
     *	Creates the label according to given options and formatters
     */
  _createCoordinateLabel(ll) {
    let opts = this.options,
      x,
      y;
    if (opts.customLabelFcn) {
      return opts.customLabelFcn(ll, opts);
    }
    if (opts.labelFormatterLat) {
      x = opts.labelFormatterLng(ll.lng);
    } else {
      x = L.Util.template(opts.labelTemplateLng, {
        x: this._getNumber(ll.lng, opts),
      });
    }
    if (opts.labelFormatterLat) {
      y = opts.labelFormatterLat(ll.lat);
    } else {
      y = L.Util.template(opts.labelTemplateLat, {
        y: this._getNumber(ll.lat, opts),
      });
    }
    if (opts.useLatLngOrder) {
      return `${y} ${x}`;
    }
    return `${x} ${y}`;
  },

    /**
     *	Returns a Number according to options (DMS or decimal)
     */
  _getNumber(n, opts) {
    let res;
    if (opts.useDMS) {
      res = n; // L.NumberFormatter.toDMS(n);
    } else {
      res = n; // L.NumberFormatter.round(n, opts.decimals, opts.decimalSeperator);
    }
    return res;
  },

    /**
     *	Shows coordinate labels after user input has ended. Also
     *	displays a marker with popup at the last input position.
     */
  collapse() {
    if (!this._showsCoordinates) {
      this._map.on('mousemove', this._update, this);
      this._showsCoordinates = true;
      const opts = this.options;
      L.DomEvent.addListener(this._container, 'click', this._switchUI, this);
      L.DomEvent.removeListener(this._container, 'mousemove', L.DomEvent.stop);

      L.DomUtil.addClass(this._inputcontainer, 'uiHidden');
      L.DomUtil.removeClass(this._labelcontainer, 'uiHidden');

      if (this._marker) {
        let m = this._createNewMarker(),
          ll = this._marker.getLatLng();
        m.setLatLng(ll);

        const container = L.DomUtil.create('div', '');
        const label = L.DomUtil.create('div', '', container);
        label.innerHTML = this._ordinateLabel(ll);

        const close = L.DomUtil.create('a', '', container);
        close.innerHTML = 'Remove';
        close.href = '#';
        const stop = L.DomEvent.stopPropagation;

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
  _switchUI(evt) {
    L.DomEvent.stop(evt);
    L.DomEvent.stopPropagation(evt);
    L.DomEvent.preventDefault(evt);
    if (this._showsCoordinates) {
            // show textfields
      this.expand();
    } else {
            // show coordinates
      this.collapse();
    }
  },

  onRemove(map) {
    map.off('mousemove', this._update, this);
  },

    /**
     *	Mousemove callback function updating labels and input elements
     */
  _update(evt) {
    let geoCoords = evt.latlng,
      opts = this.options;
    if (geoCoords) {
      const [x, y] = geoCoordsToDofusCoords(geoCoords);
      const subAreas = getId(x, y);
      if (!subAreas.subAreaId) {
        if (this._showsCoordinates) {
          this._inputX.value = '';
          this._inputY.value = '';
          this._mapId.value = '';
          this._showsCoordinates = false;
        }
        return;
      }
      this._showsCoordinates = true;
      this._mapId.value = subAreas.id;

      this._inputX.value = x;
      this._inputY.value = y;
    }
  },

  _createNewMarker() {
    return this.options.markerType(null, this.options.markerProps);
  },

  _pause(evt) {
    this._map.off('mousemove', this._update, this);
        // L.DomUtil.addClass(this._labelcontainer, "uiHidden");
  },

  _unpause(evt) {
    this._map.on('mousemove', this._update, this);
  },

});

// constructor registration
L.control.coordinates = function (options) {
  return new L.Control.Coordinates(options);
};

// map init hook
L.Map.mergeOptions({
  coordinateControl: false,
});

L.Map.addInitHook(function () {
  if (this.options.coordinateControl) {
    this.coordinateControl = new L.Control.Coordinates();
    this.addControl(this.coordinateControl);
  }
});
