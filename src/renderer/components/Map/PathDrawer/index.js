import L from "leaflet";
import GeoToDofusCoord from "owl/utils/GeoToDofusCoord.js";
import { join } from "path";
import { MapControl, withLeaflet } from "react-leaflet";
import { connect } from "react-redux";
import { handleChanges } from "renderer/actions/actions.js";
import { SCRIPT_ACTIONS } from "renderer/actions/types";
import store from "renderer/store";
import fs from "fs";
const iconSize = JSON.parse(
  fs.readFileSync(__static + "/assets/path/iconSize.json", "utf8")
);

class PathDrawer extends MapControl {
  constructor(props) {
    super(props);
    this.state = {
      map: props.leaflet.map,
      handleChanges: props.handleChanges
    };
  }

  getDofusMapBounds(dofusMapCoord, map) {
    const topLeftCornerCorner = GeoToDofusCoord.dofusCoordsToPixelCoords(
      dofusMapCoord
    );
    topLeftCornerCorner.x -= 69.5 / 2;
    topLeftCornerCorner.y -= 50 / 2;
    const bottomRightCornerCorner = L.point(
      topLeftCornerCorner.x + 69.5 / 2,
      topLeftCornerCorner.y + 50 / 2
    );
    //   const nW = pixelCoordsToGeoCoords(topLeftCornerCorner, map);
    const sE = GeoToDofusCoord.pixelCoordsToGeoCoords(
      bottomRightCornerCorner,
      map
    );
    return sE;
  }

  getArrowSize(size) {
    const zoom = this.state.map.getZoom();
    let scale = 0;
    switch (zoom) {
      case 4:
        scale = 1;
        break;
      case 3:
        scale = 0.5;
        break;
      case 2:
        scale = 0.25;
        break;
      case 1:
        scale = 0.125;
        break;
      case 0:
        scale = 0.0625;
        break;

      default:
        break;
    }
    return {
      width: size.width * scale,
      height: size.height * scale,
      marginLeft: size.marginLeft * scale,
      topMargin: size.topMargin * scale
    };
  }

  resizeMarkers() {
    const actionsList = store.getState().addMarker.scriptActions;
    actionsList.forEach(action => {
      action.markers.forEach(marker => {
        const markerSize = iconSize.size.amakna.move[marker.direction];
        const icon = marker.marker.options.icon;
        const newIconSize = this.getArrowSize(markerSize);
        icon.options.iconSize = [newIconSize.width, newIconSize.height];
        icon.options.iconAnchor = [
          newIconSize.marginLeft,
          newIconSize.topMargin
        ];
        marker.marker.setIcon(icon);
      });
    });
  }

  addMarker(coords, map, direction) {
    // eslint-disable-next-line no-console
    console.log("addMarker");
    let markers = [];
    const markerSize = iconSize.size.amakna.move[direction];
    const newIconSize = this.getArrowSize(markerSize);
    markers = [
      ...markers,
      {
        marker: L.marker(this.getDofusMapBounds(coords, map), {
          icon: L.icon({
            iconUrl: join(__static, `/assets/path/move/${direction}.svg`),
            iconSize: [newIconSize.width, newIconSize.height],
            iconAnchor: [newIconSize.marginLeft, newIconSize.topMargin]
          })
        }).addTo(map),
        direction
      }
    ];

    this.state.handleChanges(SCRIPT_ACTIONS, [
      ...store.getState().addMarker.scriptActions,
      { directions: [direction], coords, markers }
    ]);
    // eslint-disable-next-line no-console
    console.log(store.getState().addMarker.scriptActions);
  }

  appendMarker(coords, map, direction) {
    // eslint-disable-next-line no-console
    console.log("appendMarker");
    const actionsList = store.getState().addMarker.scriptActions;
    const actionIndex = this.getActionIndex(coords);
    const markerSize = iconSize.size.amakna.move[direction];
    const newIconSize = this.getArrowSize(markerSize);
    actionsList[actionIndex].markers = [
      ...actionsList[actionIndex].markers,
      {
        marker: L.marker(this.getDofusMapBounds(coords, map), {
          icon: L.icon({
            iconUrl: join(__static, `/assets/path/move/${direction}.svg`),
            iconSize: [newIconSize.width, newIconSize.height],
            iconAnchor: [newIconSize.marginLeft, newIconSize.topMargin]
          })
        }).addTo(map),
        direction
      }
    ];
    actionsList[actionIndex].directions = [
      ...actionsList[actionIndex].directions,
      direction
    ];
    this.state.handleChanges(SCRIPT_ACTIONS, actionsList);
  }

  removeMarker(coords, map, direction) {
    const actionsList = store.getState().addMarker.scriptActions;
    const actionIndex = this.getActionIndex(coords);
    const action = actionsList[actionIndex];
    action.markers.forEach(marker => {
      if (direction == marker.direction) {
        marker.marker.removeFrom(map);
        action.markers.splice(
          action.markers.map(marker => marker.direction).indexOf(direction),
          1
        );
        action.directions.splice(action.directions.indexOf(direction), 1);
        if (action.directions.length === 0) {
          actionsList.splice(actionIndex, 1);
        }
      }
    });
    this.state.handleChanges(SCRIPT_ACTIONS, actionsList);
    // eslint-disable-next-line no-console
    console.log(store.getState().addMarker.scriptActions);
  }

  actionAlreadyExist(coords) {
    const actionsList = store.getState().addMarker.scriptActions;
    let exist = false;
    actionsList.forEach(action => {
      if (action.coords[0] == coords[0] && action.coords[1] == coords[1]) {
        exist = true;
      }
    });
    return exist;
  }

  actionDirectionsAlreadyExist(coords, actualDirection) {
    const actionsList = store.getState().addMarker.scriptActions;
    const actionIndex = this.getActionIndex(coords);
    let exist = false;
    actionsList[actionIndex].directions.forEach(direction => {
      if (direction == actualDirection) {
        exist = true;
      }
    });
    return exist;
  }

  getActionIndex(coords) {
    const actionsList = store.getState().addMarker.scriptActions;
    let index = -1;
    actionsList.forEach((action, i) => {
      if (action.coords[0] == coords[0] && action.coords[1] == coords[1]) {
        index = i;
      }
    });
    return index;
  }

  createLeafletElement() {
    //
  }

  componentDidMount() {
    this.state.map.addEventListener("click", event => {
      const dofusCoords = GeoToDofusCoord.geoCoordsToDofusCoords(
        event.latlng,
        this.state.map
      );
      const directions = store.getState().moveToggleButtons.moveDirection;
      directions.forEach(direction => {
        const actionAlreadyExist = this.actionAlreadyExist(dofusCoords);
        const actionDirectionsAlreadyExist =
          actionAlreadyExist &&
          this.actionDirectionsAlreadyExist(dofusCoords, direction);
        if (!actionAlreadyExist) {
          this.addMarker(dofusCoords, this.state.map, direction);
        } else if (actionDirectionsAlreadyExist) {
          this.removeMarker(dofusCoords, this.state.map, direction);
        } else {
          this.appendMarker(dofusCoords, this.state.map, direction);
        }
      });
    });
    this.state.map.addEventListener("zoom", () => {
      this.resizeMarkers();
    });
  }
}

export default connect(
  null,
  { handleChanges }
)(withLeaflet(PathDrawer));
