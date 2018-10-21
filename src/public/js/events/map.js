import { drawDofusMapBoundsOnMouseMove, geoCoordsToDofusCoords, highlightSubArea, map } from '../map/map';
import { onMapClick, resizeMarker } from '../scripts/pathMaker';

let mouseState;

map.on('mousemove', (e) => {
  mouseState ? console.log('mouse down') : console.log('mouse up');

  drawDofusMapBoundsOnMouseMove(e);
  highlightSubArea(e);
});

map.on('click', (e) => {
  onMapClick(geoCoordsToDofusCoords(e.latlng));
});

map.on('contextmenu', (e) => {
  map.dragging.enabled() ? map.dragging.disable() : map.dragging.enable();
});

map.on('mousedown', (e) => {
  mouseState = true;
});

map.on('mouseup', (e) => {
  mouseState = false;
});

map.on('zoom', () => {
  resizeMarker();
});

