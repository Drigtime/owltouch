/*
 * L.Control.Info is used for displaying information of the actual map.
 */
import L from 'leaflet';
import { json, hint, geoCoordsToDofusCoords } from '../map';

L.Control.Info = L.Control.extend({
  options: {
    position: 'bottomright',
  },

  onAdd(map) {
    this.map = map;
    this.controlHint = hint;
    this.hints = json;
    this.transformer = {
      geoCoordsToDofusCoords,
    };

    const className = 'leaflet-control-info';
    this.container = L.DomUtil.create('div', className);
    const container = this.container;

    // label containers
    this.listContainer = L.DomUtil.create('ul', 'list-group uiElement uiHidden dark', container);

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
    Mousemove callback function updating labels and input elements
*/
  update(evt) {
    const geoCoords = evt.latlng;
    if (geoCoords) {
      const [x, y] = this.transformer.geoCoordsToDofusCoords(geoCoords);
      const mapInfo = this.getMapInfo(x, y);
      if (!mapInfo) {
        L.DomUtil.addClass(this.listContainer, 'uiHidden');
        this.listContainer.innerHTML = '';
        return;
      }
      L.DomUtil.removeClass(this.listContainer, 'uiHidden');
      this.listContainer.innerHTML = '';
      Object.keys(mapInfo).forEach((key) => {
        L.DomUtil.create(
          'li',
          'list-group-item bg-dark',
          this.listContainer,
        ).innerHTML = `<img src="../data/assets/hint/${mapInfo[key].gfx}.png" class="mr-2">${
          mapInfo[key].nameId
        }`;
      });

      // if (this.subAreas[x][y].length > 1) {
      //     thus.list.innerHTML += " & " + this.t("subArea." + this.subAreas[x][y][1].id);
      // }
    }
  },

  getMapInfo(x, y) {
    const activatedHints = [];

    const elementOnMap = [];
    Object.keys(this.controlHint).forEach((key) => {
      switch (key) {
        case 'Class':
          if (hint[key].map) {
            if (hint[key].map.loaded) {
              activatedHints.push(1);
            }
          }
          break;
        case 'Misc':
          if (hint[key].map) {
            if (hint[key].map.loaded) {
              activatedHints.push(4);
            }
          }
          break;
        case 'Workshop':
          if (hint[key].map) {
            if (hint[key].map.loaded) {
              activatedHints.push(3);
            }
          }
          break;
        case 'Market':
          if (hint[key].map) {
            if (hint[key].map.loaded) {
              activatedHints.push(2);
            }
          }
          break;
        case 'Dungeon':
          if (hint[key].map) {
            if (hint[key].map.loaded) {
              activatedHints.push(6);
            }
          }
          break;
        case 'Lair':
          if (hint[key].map) {
            if (hint[key].map.loaded) {
              activatedHints.push(9);
            }
          }
          break;
        default:
          break;
      }
    });
    activatedHints.forEach((iterator) => {
      Object.keys(this.hints).forEach((key) => {
        Object.keys(this.hints[key]).forEach((child) => {
          if (
            this.hints[key][child].worldMapId === 1 &&
            (this.hints[key][child].x === x || this.hints[key][child].posX === x) &&
            (this.hints[key][child].y === y || this.hints[key][child].posY === y) &&
            this.hints[key][child].categoryId === iterator
          ) {
            elementOnMap.push(this.hints[key][child]);
          }
        });
      });
    });
    if (elementOnMap.length > 0) {
      return elementOnMap;
    }
    return false;
  },

  pause() {
    this.map.off('mousemove', this.update, this);
    L.DomUtil.addClass(this.listContainer, 'uiHidden');
  },

  unpause() {
    this.map.on('mousemove', this.update, this);
  },
});

// constructor registration
L.control.info = options => new L.Control.Info(options);
