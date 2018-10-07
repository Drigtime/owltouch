/*
 * L.Control.Farmer is used for displaying toggling farmer resource buttons.
 */
import sizeOf from 'image-size';
import { dofusCoordsToGeoCoords, map, json, hint, mcgLayerSupportGroup } from '../map';

const path = require('path')

L.Control.Lumber = L.Control.extend({
  options: {
    position: 'topleft',
  },

  onAdd(map) {
    this._menuToggle = false;
    this._visible = [];
    this.prof = 'lumb';
    this.resources = [
      'Ash',
      'Chestnut',
      'Walnut',
      'Oak',
      'Maple',
      'Bamboo',
      'Bombu',
      'Kaliptus',
      'Oliviolet',
      'Yew',
      'Cherry',
      'Dark',
      'Ebony',
      'Hornbeam',
      'Elm',
      'Aspen',
      'Holy',
    ];
    const className = 'leaflet-control-lumber container-resources';
    const container = (this._container = L.DomUtil.create('div', className));
    container.style.marginTop = '0px';
    L.DomEvent.addListener(container, 'dblclick', L.DomEvent.stop);
    L.DomEvent.addListener(container, 'click', L.DomEvent.stop);
    L.DomEvent.addListener(container, 'mousemove', L.DomEvent.stop);
    const options = this.options;

    this._aButton = L.DomUtil.create('a', 'lumb-control blue-grey darken-5', container);
    this._aButton.setAttribute('href', '#');
    this._aButton.setAttribute('title', 'Bucheron');
    this._aButton.style.borderTop = '2px solid #212529';
    this._imgButton = L.DomUtil.create('img', 'no-class', this._aButton);
    this._imgButton.setAttribute('src', './data/assets/lumb/lumb.png');

    L.DomEvent.addListener(this._aButton, 'click', this._click, this);

    map.on('move', this._close, this);
    map.on('click', this._close, this);

    this._magicContainer = L.DomUtil.create(
      'div',
      'container-resources-magic',
      container,
    );

    this._buttons = [];
    const resourcesLength = this.resources.length;
    for (let i = 0; i < resourcesLength; i++) {
      const aMagicButton = L.DomUtil.create(
        'a',
        `scale-border-in-out ${this.resources[i]}`,
        this._magicContainer,
      );
      aMagicButton.setAttribute('href', '#');
      // aMagicButton.setAttribute('title', this.resources[i].split')]);
      const imgMagicButton = L.DomUtil.create('img', 'no-class', aMagicButton);
      imgMagicButton.setAttribute(
        'src',
        path.join(__dirname, `../../data/assets/lumb/${this.resources[i]}.png`)
      );
      L.DomEvent.addListener(aMagicButton, 'click', this._toggle, this);
    }

    for (let j = 0; j < resourcesLength; j++) {
      json[this.resources[j]] = require(path.join(__dirname, `../../data/json/lumber/${this.resources[j]}.json`));
      hint[this.resources[j]] = L.layerGroup();
      for (const key in json[this.resources[j]]) {
        if (json[this.resources[j]][key].w === 1) {
          if (
          json[this.resources[j]][key].q > 1 &&
          json[this.resources[j]][key].q < 6
        ) {
            L.marker(
            dofusCoordsToGeoCoords([
              json[this.resources[j]][key].posX,
              json[this.resources[j]][key].posY,
            ]), {
              icon: L.divIcon({
                iconUrl: path.join(__dirname, `../../data/assets/lumb/${this.resources[j]}.png`),
                html: `<img src="${path.join(__dirname, `../../data/assets/lumb/${this.resources[j]}.png`)}"><div class="qnt1">${json[this.resources[j]][key].q}</div>`,
                className: 'mycluster',
                iconAnchor: [
                  sizeOf(path.join(__dirname, `../../data/assets/lumb/${this.resources[j]}.png`)).width /
                  2,
                  sizeOf(path.join(__dirname, `../../data/assets/lumb/${this.resources[j]}.png`)).height /
                  2,
                ],
              }),
              interactive: false,
            },
          ).addTo(hint[this.resources[j]]);
          } else if (
          json[this.resources[j]][key].q > 5 &&
          json[this.resources[j]][key].q < 11
        ) {
            L.marker(
            dofusCoordsToGeoCoords([
              json[this.resources[j]][key].posX,
              json[this.resources[j]][key].posY,
            ]), {
              icon: L.divIcon({
                iconUrl: path.join(__dirname, `../../data/assets/lumb/${this.resources[j]}.png`),
                html: `<img src="${path.join(__dirname, `../../data/assets/lumb/${this.resources[j]}.png`)}"><div class="qnt2">${json[this.resources[j]][key].q}</div>`,
                className: 'mycluster',
                iconAnchor: [
                  sizeOf(path.join(__dirname, `../../data/assets/lumb/${this.resources[j]}.png`)).width /
                  2,
                  sizeOf(path.join(__dirname, `../../data/assets/lumb/${this.resources[j]}.png`)).height /
                  2,
                ],
              }),
              interactive: false,
            },
          ).addTo(hint[this.resources[j]]);
          } else if (json[this.resources[j]][key].q > 10) {
            L.marker(
            dofusCoordsToGeoCoords([
              json[this.resources[j]][key].posX,
              json[this.resources[j]][key].posY,
            ]), {
              icon: L.divIcon({
                iconUrl: path.join(__dirname, `../../data/assets/lumb/${this.resources[j]}.png`),
                html: `<img src="${path.join(__dirname, `../../data/assets/lumb/${this.resources[j]}.png`)}"><div class="qnt3">${json[this.resources[j]][key].q}</div>`,
                className: 'mycluster',
                iconAnchor: [
                  sizeOf(path.join(__dirname, `../../data/assets/lumb/${this.resources[j]}.png`)).width /
                  2,
                  sizeOf(path.join(__dirname, `../../data/assets/lumb/${this.resources[j]}.png`)).height /
                  2,
                ],
              }),
              interactive: false,
            },
          ).addTo(hint[this.resources[j]]);
          } else {
            L.marker(
            dofusCoordsToGeoCoords([
              json[this.resources[j]][key].posX,
              json[this.resources[j]][key].posY,
            ]), {
              icon: L.icon({
                iconUrl: path.join(__dirname, `../../data/assets/lumb/${this.resources[j]}.png`),
                iconAnchor: [
                  sizeOf(path.join(__dirname, `../../data/assets/lumb/${this.resources[j]}.png`)).width /
                  2,
                  sizeOf(path.join(__dirname, `../../data/assets/lumb/${this.resources[j]}.png`)).height /
                  2,
                ],
              }),
              interactive: false,
            },
          ).addTo(hint[this.resources[j]]);
          }
        }
      }
      mcgLayerSupportGroup.checkIn([hint[this.resources[j]]]);
    }

    return container;
  },

  _click(evt) {
    if (evt.ctrlKey) {
      for (let i = 0; i < this.resources.length; i++) {
        if (this._visible[i]) {
          continue;
        }
        $(this._magicContainer.children[i])[0].click();
      }
      return;
    }
    if (evt.altKey) {
      for (let j = 0; j < this.resources.length; j++) {
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
  _close() {
    L.DomUtil.removeClass(this._magicContainer, 'in');
    L.DomUtil.removeClass(this._aButton, 'container-resources-open');
    this._menuToggle = false;
  },
  _toggle(a) {
    for (let i = 0; i < this.resources.length; i++) {
      if (L.DomUtil.hasClass(a.currentTarget, this.resources[i])) {
        if (this._visible[i]) {
          hint[this.resources[i]].removeFrom(map);
          L.DomUtil.removeClass(a.currentTarget, 'selected');
          this._visible[i] = false;
        } else {
          hint[this.resources[i]].addTo(map);
          L.DomUtil.addClass(a.currentTarget, 'selected');
          this._visible[i] = true;
        }
        break;
      }
    }
  },

  onRemove(map) {
    map.off('move', this._close, this);
    map.off('click', this._close, this);
    // todo remove toggle listeners?
  },
});

// constructor registration
L.control.lumber = function (options) {
  return new L.Control.Lumber(options);
};

// map init hook
L.Map.mergeOptions({
  lumberControl: false,
});

L.Map.addInitHook(function () {
  if (this.options.LumberControl) {
    this.LumberControl = new L.Control.Farmer();
    this.addControl(this.LumberControl);
  }
});
