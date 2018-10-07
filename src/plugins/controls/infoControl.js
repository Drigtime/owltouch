/*
 * L.Control.Info is used for displaying information of the actual map.
 */
import { dofusCoordsToGeoCoords, geoCoordsToDofusCoords, map, getCoord, getId } from '../map';

L.Control.Info = L.Control.extend({
  options: {
    position: 'bottomright',
  },

  onAdd(map) {
    this._map = map;
    this._controlHint = hint;
    this._hints = json;
    this._transformer = {
      geoCoordsToDofusCoords,
    };

    let className = 'leaflet-control-info',
      container = this._container = L.DomUtil.create('div', className);

		// label containers
    this._listContainer = L.DomUtil.create('ul', 'list-group uiElement uiHidden blue-grey darken-5', container);

		// connect to mouseevents
    map.on('mousemove', this._update, this);
		// map.on("move", this._pause, this);
		// map.on("moveend", this._unpause, this);

    map.whenReady(this._update, this);

    return container;
  },

  onRemove(map) {
    map.off('move', this._pause, this);
    map.off('moveend', this._unpause, this);
  },

	/**
	 *	Mousemove callback function updating labels and input elements
	 */
  _update(evt) {
    const geoCoords = evt.latlng;
    if (geoCoords) {
      const [x, y] = this._transformer.geoCoordsToDofusCoords(geoCoords);
      const mapInfo = this._getMapInfo(x, y);
      if (!mapInfo) {
        L.DomUtil.addClass(this._listContainer, 'uiHidden');
        this._listContainer.innerHTML = '';
        return;
      }
      L.DomUtil.removeClass(this._listContainer, 'uiHidden');
      this._listContainer.innerHTML = '';
      for (const key in mapInfo) {
        L.DomUtil.create('li', 'list-group-item bg-dark', this._listContainer)
					.innerHTML = `<img src="../data/assets/hint/${mapInfo[key].gfx}.png" class="mr-2">${mapInfo[key].nameId}`;
      }

			// if (this._subAreas[x][y].length > 1) {
			//     thus._list.innerHTML += " & " + this._t("subArea." + this._subAreas[x][y][1].id);
			// }
    }
  },

  _getMapInfo(x, y) {
    let activatedHints = [],
      elementOnMap = [];
    for (const key in this._controlHint) {
      switch (key) {
        case 'Class':
          if (hint[key]._map) {
            if (hint[key]._map._loaded) {
              activatedHints.push(1);
            }
          }
          break;
        case 'Misc':
          if (hint[key]._map) {
            if (hint[key]._map._loaded) {
              activatedHints.push(4);
            }
          }
          break;
        case 'Workshop':
          if (hint[key]._map) {
            if (hint[key]._map._loaded) {
              activatedHints.push(3);
            }
          }
          break;
        case 'Market':
          if (hint[key]._map) {
            if (hint[key]._map._loaded) {
              activatedHints.push(2);
            }
          }
          break;
        case 'Dungeon':
          if (hint[key]._map) {
            if (hint[key]._map._loaded) {
              activatedHints.push(6);
            }
          }
          break;
        case 'Lair':
          if (hint[key]._map) {
            if (hint[key]._map._loaded) {
              activatedHints.push(9);
            }
          }
          break;
        default:
          break;
      }
    }
    for (const iterator of activatedHints) {
      for (const key of Object.keys(this._hints)) {
        for (const child in this._hints[key]) {
          if (this._hints[key][child].worldMapId === 1 && (this._hints[key][child].x === x || this._hints[key][child].posX === x) && (this._hints[key][child].y === y || this._hints[key][child].posY === y) && this._hints[key][child].categoryId === iterator) {
            elementOnMap.push(this._hints[key][child]);
          }
        }
      }
    }
    if (elementOnMap.length > 0) {
      return elementOnMap;
    }
    return false;
  },

  _pause(evt) {
    this._map.off('mousemove', this._update, this);
    L.DomUtil.addClass(this._listContainer, 'uiHidden');
  },

  _unpause(evt) {
    this._map.on('mousemove', this._update, this);
  },
});

// constructor registration
L.control.info = function (options) {
  return new L.Control.Info(options);
};

// map init hook
L.Map.mergeOptions({
  infoControl: false,
});

L.Map.addInitHook(function () {
  if (this.options.infoControl) {
    this.infoControl = new L.Control.Info();
    this.addControl(this.infoControl);
  }
});
