import L from "leaflet";
import { join } from "path";
import store from "renderer/store";

class World {
  constructor(props) {
    this.tileLayer = L.tileLayer(join(__static, `./tiles/${props.worldName}/{z}/{x}/{y}.jpg`), {
      minZoom: props.minZoom,
      maxZoom: props.maxZoom,
      center: { lat: props.view.lat, lng: props.view.lng },
      noWrap: props.noWrap
    });
    this.zoom = props.zoom;
    this.coordsTransform = new L.Transformation(
      props.coordsTransform.a,
      props.coordsTransform.b,
      props.coordsTransform.c,
      props.coordsTransform.d
    );
    this.view = { lat: props.view.lat, lng: props.view.lng };
    this.topLeftCornerCorner = props.topLeftCornerCorner;
    this.bottomRightCornerCorner = props.bottomRightCornerCorner;
    this.worldMap = props.worldMap;
  }
}

export const mapTileLayer = {
  amakna: new World({
    worldName: "amakna",
    minZoom: 0,
    maxZoom: 4,
    zoom: 3,
    noWrap: true,
    coordsTransform: { a: 69.5, b: 6517, c: 50, d: 4973 },
    view: { lat: -250, lng: 425 },
    topLeftCornerCorner: 69.5,
    bottomRightCornerCorner: 50,
    worldMap: 1
  }),
  incarnam: new World({
    worldName: "incarnam",
    minZoom: 0,
    maxZoom: 4,
    zoom: 2,
    noWrap: true,
    coordsTransform: { a: 213, b: 1992, c: 153, d: 970 },
    view: { lat: -90, lng: 150 },
    topLeftCornerCorner: 213,
    bottomRightCornerCorner: 153,
    worldMap: 2
  }),
  actualLayerName: "amakna",
  hideMarkers(map) {
    const types = ["move", "bank", "phenix"];
    const actualLayer = store.getState().scriptPath.scriptActions[this.actualLayerName];
    const resourceLayer = store.getState().resourceMarker.markers;
    types.forEach(type => {
      actualLayer[type].forEach(action => {
        action.markers.forEach(marker => {
          marker.marker.removeFrom(map);
        });
      });
    });
    Object.values(resourceLayer).forEach(resource => {
      Object.values(resource).forEach(world => {
        world.forEach(marker => {
          // marker.removeFrom(map);
          store.getState().resourceMarker.cluster.removeLayer(marker);
        });
      });
    });
  },
  showMarkers(map) {
    const types = ["move", "bank", "phenix"];
    const currentWorldMap = this.getTileLayer().worldMap;
    const actualLayer = store.getState().scriptPath.scriptActions[this.actualLayerName];
    const resourceLayer = store.getState().resourceMarker.markers;
    types.forEach(type => {
      actualLayer[type].forEach(action => {
        action.markers.forEach(marker => {
          marker.marker.addTo(map);
        });
      });
    });
    Object.values(resourceLayer).forEach(resource => {
      if (resource[currentWorldMap] !== undefined)
        resource[currentWorldMap].forEach(marker => {
          // marker.addTo(map);
          store.getState().resourceMarker.cluster.addLayer(marker);
        });
    });
  },
  setTileLayer(tileLayer, map) {
    this.hideMarkers(map);
    this.getTileLayer().tileLayer.removeFrom(map);
    this.actualLayerName = tileLayer;
    this.getTileLayer().tileLayer.addTo(map);
    this.showMarkers(map);
    map.setView(this.getTileLayer().view, this.getTileLayer().zoom);
  },
  getTileLayer() {
    return this[this.actualLayerName];
  }
};

class GeoToDofusCoord {
  geoCoordsToPixelCoords(geoCoords, map) {
    return map.project(geoCoords, map.getMaxZoom());
  }
  pixelCoordsToGeoCoords(pixelCoords, map) {
    return map.unproject(pixelCoords, map.getMaxZoom());
  }
  pixelCoordsToDofusCoords(pixelCoords) {
    const { x, y } = mapTileLayer
      .getTileLayer()
      .coordsTransform.untransform(pixelCoords)
      .round();
    return [x, y];
  }
  // in: dofus [x,y] out: pixel coords (x,y) of the [x,y] map's center pixel
  dofusCoordsToPixelCoords(dofusMapCoord, layer = mapTileLayer.getTileLayer()) {
    const newDofusCoords = L.point(dofusMapCoord);
    return layer.coordsTransform.transform(newDofusCoords);
  }
  geoCoordsToDofusCoords(geoCoords, map) {
    const pixelCoords = this.geoCoordsToPixelCoords(geoCoords, map);
    return this.pixelCoordsToDofusCoords(pixelCoords);
  }
  getDofusMapBounds(dofusMapCoord, map, layer = mapTileLayer.getTileLayer()) {
    const topLeftCornerCorner = this.dofusCoordsToPixelCoords(dofusMapCoord, layer);
    topLeftCornerCorner.x -= layer.topLeftCornerCorner / 2;
    topLeftCornerCorner.y -= layer.bottomRightCornerCorner / 2;
    const bottomRightCornerCorner = L.point(
      topLeftCornerCorner.x + layer.topLeftCornerCorner / 2,
      topLeftCornerCorner.y + layer.bottomRightCornerCorner / 2
    );
    const bound = this.pixelCoordsToGeoCoords(bottomRightCornerCorner, map);
    return bound;
  }
}

export default new GeoToDofusCoord();
