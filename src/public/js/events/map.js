import {
  drawDofusMapBoundsOnMouseMove,
  geoCoordsToDofusCoords,
  highlightSubArea,
  map,
} from '../map/map';
import { onMapClick, onMapMouseDown, resizeMarker } from '../scripts/pathMaker';

let mouseState;
let coordMem;

map.on('mousemove', (e) => {
  if (!mouseState && !map.dragging.enabled()) {
    const coord = geoCoordsToDofusCoords(e.latlng);
    coordMem = coordMem === undefined ? coord : coordMem;
    if (coordMem[0] !== coord[0] || coordMem[1] !== coord[1]) {
      coordMem = coord;
      onMapMouseDown(coord);
    } else {
      coordMem = coord;
    }
  }
  drawDofusMapBoundsOnMouseMove(e);
  highlightSubArea(e);
});

map.on('click', (e) => {
  onMapClick(geoCoordsToDofusCoords(e.latlng));
});

map.on('contextmenu', () => {
  map.dragging.enabled() ? map.dragging.disable() : map.dragging.enable();
});

map.on('mousedown', () => {
  mouseState = false;
});

map.on('mouseup', () => {
  mouseState = true;
});

map.on('zoom', () => {
  resizeMarker();
});
