/*
 * L.Control.Area is used for displaying current area info on the map.
 */
import L from 'leaflet';
import { geoCoordsToDofusCoords, mapList, areas, getId } from '../map';
import { join } from 'path';
import { readFileSync } from 'fs';

const i18nAreas = {
  en: JSON.parse(readFileSync(join(__dirname, '../../../../data/i18n/en/Areas.json'))),
  fr: JSON.parse(readFileSync(join(__dirname, '../../../../data/i18n/fr/Areas.json'))),
  es: JSON.parse(readFileSync(join(__dirname, '../../../../data/i18n/es/Areas.json'))),
};

L.Control.Area = L.Control.extend({
  options: {
    position: 'topright',
  },

  onAdd(map) {
    this.map = map;

    const className = 'leaflet-control-area';

    this.container = L.DomUtil.create('div', className);
    const container = this.container;

    L.DomEvent.disableScrollPropagation(this.container);
    L.DomEvent.disableClickPropagation(this.container);
    L.DomEvent.addListener(container, 'mousemove', L.DomEvent.stop);

    // label containers
    this.labelcontainer = L.DomUtil.create('div', 'uiElement dark', container);
    this.labelcontainer.style.padding = '5 10 5 10';
    this.label = L.DomUtil.create('span', 'labelFirst', this.labelcontainer);

    // connect to mouseevents
    map.on('mousemove', this.update, this);
    // map.on("move", this.pause, this);
    // map.on("moveend", this.unpause, this);

    map.whenReady(this.update, this);

    return container;
  },

  onRemove(map) {
    map.off('move', this.pause, this);
    map.off('moveend', this.unpause, this);
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
        L.DomUtil.addClass(this.labelcontainer, 'uiHidden');
        this.label.innerHTML = '';
        return;
      }
      L.DomUtil.removeClass(this.labelcontainer, 'uiHidden');
      this.label.innerHTML = i18nAreas[$.i18n.language][subAreas.subAreaId].nameId;

      // if (this.subAreas[x][y].length > 1) {
      //     this.label.innerHTML += " & " + this.t("subArea." + this.subAreas[x][y][1].id);
      // }
    }
  },

  pause() {
    this.map.off('mousemove', this.update, this);
    L.DomUtil.addClass(this.labelcontainer, 'uiHidden');
  },

  unpause() {
    this.map.on('mousemove', this.update, this);
  },
});

// constructor registration
L.control.area = options => new L.Control.Area(options);
