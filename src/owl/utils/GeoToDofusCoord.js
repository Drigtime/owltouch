import L from "leaflet";

class GeoToDofusCoord {
  geoCoordsToPixelCoords(geoCoords, map) {
    return map.project(geoCoords, map.getMaxZoom());
  }
  pixelCoordsToGeoCoords(pixelCoords, map) {
    return map.unproject(pixelCoords, map.getMaxZoom());
  }
  pixelCoordsToDofusCoords(pixelCoords) {
    const coordsTransform = new L.Transformation(69.5, 6517, 50, 4973);
    const { x, y } = coordsTransform.untransform(pixelCoords).round();
    return [x, y];
  }
  // in: dofus [x,y] out: pixel coords (x,y) of the [x,y] map's center pixel
  dofusCoordsToPixelCoords(dofusMapCoord) {
    const newDofusCoords = L.point(dofusMapCoord);
    const coordsTransform = new L.Transformation(69.5, 6517, 50, 4973);
    return coordsTransform.transform(newDofusCoords);
  }
  geoCoordsToDofusCoords(geoCoords, map) {
    const pixelCoords = this.geoCoordsToPixelCoords(geoCoords, map);
    return this.pixelCoordsToDofusCoords(pixelCoords);
  }
}

export default new GeoToDofusCoord();
