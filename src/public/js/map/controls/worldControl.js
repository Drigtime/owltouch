/*
 * L.Control.World is used for displaying current mouse world on the map.
 */
import L from 'leaflet';
import { map, mapTileLayer, hint, controls, bpLayers, phenixPos, bankPos, bpMarkers } from '../map';
import { movementType, resizeMarker } from '../../scripts/pathMaker';
import '../controls/alch';
import '../controls/farm';
import '../controls/lumb';
import '../controls/fish';
import '../controls/mine';
import '../controls/misc';

L.Control.World = L.Control.extend({
  options: {
    position: 'bottomright',
  },

  onAdd() {
    this.map = map;

    const className = 'leaflet-control-world';

    this.container = L.DomUtil.create('div', className);
    const container = this.container;

    L.DomEvent.disableScrollPropagation(this.container);
    L.DomEvent.disableClickPropagation(this.container);
    L.DomEvent.addListener(container, 'mousemove', L.DomEvent.stop);

    // input containers
    // $(this.container).css('marginTop', '-122px');
    // $(this.container).css('marginRight', '145px');
    this.inputcontainer = L.DomUtil.create('div', 'uiElement dark', container);
    $(this.inputcontainer).css('width', '140px');
    $(this.inputcontainer).css('padding', '5px 10px 5px 10px');
    this.selectcontainer = L.DomUtil.create('div', 'input-field col s12', this.inputcontainer);
    $(this.selectcontainer).css('marginTop', '0px');
    $(this.selectcontainer).css('marginBottom', '0px');
    this.select = L.DomUtil.create('select', '', this.selectcontainer);
    this.amakna = L.DomUtil.create('option', '', this.select);
    $(this.amakna).attr('data-world', 'amakna');
    $(this.amakna).val('amakna');
    $(this.amakna).html('Amakna');
    this.incarnam = L.DomUtil.create('option', '', this.select);
    $(this.incarnam).attr('data-world', 'incarnam');
    $(this.incarnam).val('incarnam');
    $(this.incarnam).html('Incarnam');
    this.selectlabel = L.DomUtil.create('label', '', this.selectcontainer);
    $(this.select).val('amakna');

    L.DomEvent.on(this.select, 'change', this.handlechange, this);

    return container;
  },

  /**
   *	Called onkeyup of input fields
   */
  handlechange(e) {
    Object.values(movementType[mapTileLayer.actualLayerName]).forEach((type) => {
      type.forEach((element) => {
        Object.values(element.marker).forEach((marker) => {
          marker.removeFrom(map);
        });
      });
    });
    Object.keys(hint).forEach((key) => {
      hint[key].removeFrom(map);
      delete hint[key];
    });
    mapTileLayer.setTileLayer([
      $('.leaflet-control-world select')[0].selectedOptions[0].dataset.world,
    ]);
    Object.values(movementType[mapTileLayer.actualLayerName]).forEach((type) => {
      type.forEach((element) => {
        Object.values(element.marker).forEach((marker) => {
          marker.addTo(map);
        });
      });
    });
    map.removeControl(controls.farmer);
    controls.farmer = L.control.farmer();
    map.addControl(controls.farmer);
    map.removeControl(controls.lumber);
    controls.lumber = L.control.lumber();
    map.addControl(controls.lumber);
    map.removeControl(controls.miner);
    controls.miner = L.control.miner();
    map.addControl(controls.miner);
    map.removeControl(controls.alchimist);
    controls.alchimist = L.control.alchimist();
    map.addControl(controls.alchimist);
    map.removeControl(controls.fisher);
    controls.fisher = L.control.fisher();
    map.addControl(controls.fisher);
    map.removeControl(controls.miscellaneous);
    controls.miscellaneous = L.control.miscellaneous();
    map.addControl(controls.miscellaneous);
    bpLayers.bank.remove();
    bpLayers.bank = L.layerGroup(bpMarkers(bankPos));
    bpLayers.phenix.remove();
    bpLayers.phenix = L.layerGroup(bpMarkers(phenixPos));
    resizeMarker();
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
L.control.world = options => new L.Control.World(options);
