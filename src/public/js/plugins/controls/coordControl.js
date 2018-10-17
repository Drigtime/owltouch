/*
 * L.Control.Coordinates is used for displaying current mouse coordinates on the map.
 */
import L from 'leaflet';
import { dofusCoordsToGeoCoords, geoCoordsToDofusCoords, map, getCoord, getId } from '../map';

L.Control.Coordinates = L.Control.extend({
  options: {
    position: 'topright',
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
    customLabelFcn(dofusCoords) {
      return `[ ${dofusCoords.x} , ${dofusCoords.y} ]`;
    },
  },

  onAdd() {
    this.map = map;

    const className = 'leaflet-control-coordinates';
    this.container = L.DomUtil.create('div', className);
    const container = this.container;
    const options = this.options;

    L.DomEvent.disableScrollPropagation(this.container);
    L.DomEvent.disableClickPropagation(this.container);
    L.DomEvent.addListener(container, 'mousemove', L.DomEvent.stop);

    // input containers
    this.inputcontainer = L.DomUtil.create('div', 'uiElement dark', container);
    this.inputcontainer.style.width = '125px';
    this.inputcontainer.style.padding = '5px';
    this.coordcontainer = L.DomUtil.create('div', 'row', this.inputcontainer);
    this.coordcontainer.style.marginBottom = '5px';
    this.inputxcontainer = L.DomUtil.create('div', 'col s6', this.coordcontainer);
    this.inputX = this.createInput('inputX', this.inputxcontainer);
    this.inputX.placeholder = 'X';
    this.inputycontainer = L.DomUtil.create('div', 'col s6', this.coordcontainer);
    this.inputY = this.createInput('inputY', this.inputycontainer);
    this.inputY.placeholder = 'Y';
    this.idcontainer = L.DomUtil.create('div', 'row', this.inputcontainer);
    this.idcontainer.style.marginTop = '5px';
    this.idcontainer.style.marginBottom = '5px';
    this.mapidcontainer = L.DomUtil.create('div', 'col s12', this.idcontainer);
    this.mapId = this.createInput('input', this.mapidcontainer);
    this.mapId.placeholder = 'MapId';
    this.mapId.maxLength = 10;
    this.mapId.id = 'mapId';
    L.DomEvent.on(this.inputX, 'keyup', this.handleKeypress, this);
    L.DomEvent.on(this.inputY, 'keyup', this.handleKeypress, this);
    L.DomEvent.on(this.mapId, 'keyup', this.handleKeypress, this);
    $(this.inputX).blur(() => {
      if ($(this).attr('data-selected-all')) {
        // Remove atribute to allow select all again on focus
        $(this).removeAttr('data-selected-all');
      }
    });
    $(this.inputY).blur(() => {
      if ($(this).attr('data-selected-all')) {
        // Remove atribute to allow select all again on focus
        $(this).removeAttr('data-selected-all');
      }
    });
    $(this.mapId).blur(() => {
      if ($(this).attr('data-selected-all')) {
        // Remove atribute to allow select all again on focus
        $(this).removeAttr('data-selected-all');
      }
    });
    $(this.inputX).click(() => {
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
    $(this.inputY).click(() => {
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
    $(this.mapId).click(() => {
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
    map.on('mousemove', this.update, this);
    // map.on('dragstart', this.collapse, this);
    map.on('move', this.pause, this);
    map.on('moveend', this.unpause, this);

    map.whenReady(this.update, this);

    this.showsCoordinates = true;
    // wether or not to show inputs on click
    if (options.enableUserInput) {
      L.DomEvent.addListener(this.container, 'click', this.switchUI, this);
    }

    return container;
  },

  /**
     *	Creates an input HTML element in given container with given classname
     */
  createInput(classname, container) {
    const input = L.DomUtil.create('input', classname, container);
    input.type = 'text';
    input.className = 'input-field';
    input.maxLength = 3;
    return input;
  },

  clearMarker() {
    this.map.removeLayer(this.marker);
  },

  /**
     *	Called onkeyup of input fields
     */
  handleKeypress(e) {
    switch (e.keyCode) {
      case 13: // Enter
        this.handleSubmit(e);
        break;
      default:
        // All keys
        break;
    }
  },

  /**
     *	Called on each keyup except ESC
     */
  handleSubmit(e) {
    if (e.target.id === 'mapId') {
      const mapid = this.mapId.value;
      if (mapid !== undefined) {
        const coord = getCoord([mapid]);
        const geoCoords = dofusCoordsToGeoCoords([coord[0].x, coord[0].y]);
        geoCoords.latlng = geoCoords;
        map.flyTo(geoCoords, 4);
      }
    } else {
      const x = this.inputX.value; // L.NumberFormatter.createValidNumber(this.inputX.value, this.options.decimalSeperator);
      const y = this.inputY.value; // L.NumberFormatter.createValidNumber(this.inputY.value, this.options.decimalSeperator);
      if (x !== undefined && y !== undefined) {
        const geoCoords = dofusCoordsToGeoCoords([x, y]);
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
    this.showsCoordinates = false;

    this.map.off('mousemove', this.update, this);

    L.DomEvent.addListener(this.container, 'mousemove', L.DomEvent.stop);
    L.DomEvent.removeListener(this.container, 'click', this.switchUI, this);

    L.DomUtil.addClass(this.labelcontainer, 'uiHidden');
    L.DomUtil.removeClass(this.inputcontainer, 'uiHidden');
  },

  /**
     *	Creates the label according to given options and formatters
     */
  createCoordinateLabel(ll) {
    const opts = this.options;


    let x;


    let y;
    if (opts.customLabelFcn) {
      return opts.customLabelFcn(ll, opts);
    }
    if (opts.labelFormatterLat) {
      x = opts.labelFormatterLng(ll.lng);
    } else {
      x = L.Util.template(opts.labelTemplateLng, {
        x: this.getNumber(ll.lng, opts),
      });
    }
    if (opts.labelFormatterLat) {
      y = opts.labelFormatterLat(ll.lat);
    } else {
      y = L.Util.template(opts.labelTemplateLat, {
        y: this.getNumber(ll.lat, opts),
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
  getNumber(n, opts) {
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
    if (!this.showsCoordinates) {
      this.map.on('mousemove', this.update, this);
      this.showsCoordinates = true;
      L.DomEvent.addListener(this.container, 'click', this.switchUI, this);
      L.DomEvent.removeListener(this.container, 'mousemove', L.DomEvent.stop);

      L.DomUtil.addClass(this.inputcontainer, 'uiHidden');
      L.DomUtil.removeClass(this.labelcontainer, 'uiHidden');

      if (this.marker) {
        const m = this.createNewMarker();


        const ll = this.marker.getLatLng();
        m.setLatLng(ll);

        const container = L.DomUtil.create('div', '');
        const label = L.DomUtil.create('div', '', container);
        label.innerHTML = this.ordinateLabel(ll);

        const close = L.DomUtil.create('a', '', container);
        close.innerHTML = 'Remove';
        close.href = '#';
        const stop = L.DomEvent.stopPropagation;

        L.DomEvent.on(close, 'click', stop)
          .on(close, 'mousedown', stop)
          .on(close, 'dblclick', stop)
          .on(close, 'click', L.DomEvent.preventDefault)
          .on(
            close,
            'click',
            () => {
              this.map.removeLayer(m);
            },
            this,
          );

        m.bindPopup(container);
        m.addTo(this.map);
        this.map.removeLayer(this.marker);
        this.marker = null;
      }
    }
  },

  /**
     *	Click callback for UI
     */
  switchUI(evt) {
    L.DomEvent.stop(evt);
    L.DomEvent.stopPropagation(evt);
    L.DomEvent.preventDefault(evt);
    if (this.showsCoordinates) {
      // show textfields
      this.expand();
    } else {
      // show coordinates
      this.collapse();
    }
  },

  onRemove() {
    map.off('mousemove', this.update, this);
  },

  /**
     *	Mousemove callback function updating labels and input elements
     */
  update(evt) {
    const geoCoords = evt.latlng;
    if (geoCoords) {
      const [x, y] = geoCoordsToDofusCoords(geoCoords);
      const subAreas = getId(x, y);
      if (!subAreas.subAreaId) {
        if (this.showsCoordinates) {
          this.inputX.value = '';
          this.inputY.value = '';
          this.mapId.value = '';
          this.showsCoordinates = false;
        }
        return;
      }
      this.showsCoordinates = true;
      this.mapId.value = subAreas.id;

      this.inputX.value = x;
      this.inputY.value = y;
    }
  },

  createNewMarker() {
    return this.options.markerType(null, this.options.markerProps);
  },

  pause() {
    this.map.off('mousemove', this.update, this);
    // L.DomUtil.addClass(this.labelcontainer, "uiHidden");
  },

  unpause() {
    this.map.on('mousemove', this.update, this);
  },
});

// constructor registration
L.control.coordinates = options => new L.Control.Coordinates(options);
