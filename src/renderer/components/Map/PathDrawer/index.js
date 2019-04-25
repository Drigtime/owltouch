import fs from "fs";
import L from "leaflet";
import GeoToDofusCoord, { mapTileLayer } from "owl/utils/GeoToDofusCoord.js";
import { join } from "path";
import { MapControl, withLeaflet } from "react-leaflet";
import { connect } from "react-redux";
import { handleChanges } from "renderer/actions/actions.js";
import { SCRIPT_ACTIONS_AMAKNA, SCRIPT_ACTIONS_INCARNAM } from "renderer/actions/types";
import store from "renderer/store";
const iconSize = JSON.parse(fs.readFileSync(__static + "/assets/path/iconSize.json", "utf8"));

class PathDrawer extends MapControl {
  constructor(props) {
    super(props);
    this.state = {
      map: props.leaflet.map,
      handleChanges: props.handleChanges
    };
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

  getType(type) {
    return type == "gather" || type == "fight" || type == "gatherfight" ? "move" : type;
  }

  resizeMarkers() {
    const actionsList = store.getState().scriptPath.scriptActions[mapTileLayer.actualLayerName];
    Object.keys(actionsList).forEach(type => {
      actionsList[type].forEach(action => {
        action.markers.forEach(marker => {
          const markerSize = iconSize.size[mapTileLayer.actualLayerName][this.getType(type)][marker.direction];
          const icon = marker.marker.options.icon;
          const newIconSize = this.getArrowSize(markerSize);
          icon.options.iconSize = [newIconSize.width, newIconSize.height];
          icon.options.iconAnchor = [newIconSize.marginLeft, newIconSize.topMargin];
          marker.marker.setIcon(icon);
        });
      });
    });
  }

  addMarker(coords, map, direction, type) {
    // eslint-disable-next-line no-console
    console.log("addMarker");
    let markers = [];
    const markerSize = iconSize.size[mapTileLayer.actualLayerName][this.getType(type)][direction];
    const newIconSize = this.getArrowSize(markerSize);
    markers = [
      ...markers,
      {
        marker: L.marker(GeoToDofusCoord.getDofusMapBounds(coords, map), {
          icon: L.icon({
            iconUrl: join(__static, `/assets/path/${type}/${direction}.svg`),
            iconSize: [newIconSize.width, newIconSize.height],
            iconAnchor: [newIconSize.marginLeft, newIconSize.topMargin]
          })
        }).addTo(map),
        direction
      }
    ];

    this.state.handleChanges(
      mapTileLayer.actualLayerName == "amakna" ? SCRIPT_ACTIONS_AMAKNA : SCRIPT_ACTIONS_INCARNAM,
      {
        value: [
          ...store.getState().scriptPath.scriptActions[mapTileLayer.actualLayerName][this.getType(type)],
          { directions: [{ direction, type }], coords, markers }
        ],
        type: this.getType(type)
      }
    );
    // eslint-disable-next-line no-console
    console.log(store.getState().scriptPath.scriptActions[mapTileLayer.actualLayerName]);
  }

  appendMarker(coords, map, direction, type) {
    // eslint-disable-next-line no-console
    console.log("appendMarker");
    const actionsList = store.getState().scriptPath.scriptActions[mapTileLayer.actualLayerName][this.getType(type)];
    const actionIndex = this.getActionIndex(coords, type);
    const markerSize = iconSize.size[mapTileLayer.actualLayerName][this.getType(type)][direction];
    const newIconSize = this.getArrowSize(markerSize);
    actionsList[actionIndex].markers = [
      ...actionsList[actionIndex].markers,
      {
        marker: L.marker(GeoToDofusCoord.getDofusMapBounds(coords, map), {
          icon: L.icon({
            iconUrl: join(__static, `/assets/path/${type}/${direction}.svg`),
            iconSize: [newIconSize.width, newIconSize.height],
            iconAnchor: [newIconSize.marginLeft, newIconSize.topMargin]
          })
        }).addTo(map),
        direction
      }
    ];
    actionsList[actionIndex].directions = [...actionsList[actionIndex].directions, { direction, type }];
    this.state.handleChanges(
      mapTileLayer.actualLayerName == "amakna" ? SCRIPT_ACTIONS_AMAKNA : SCRIPT_ACTIONS_INCARNAM,
      {
        value: actionsList,
        type: this.getType(type)
      }
    );
  }

  removeMarker(coords, map, direction, type) {
    const actionsList = store.getState().scriptPath.scriptActions[mapTileLayer.actualLayerName][this.getType(type)];
    const actionIndex = this.getActionIndex(coords, type);
    const action = actionsList[actionIndex];
    action.markers.forEach(marker => {
      if (direction == marker.direction) {
        marker.marker.removeFrom(map);
        action.markers.splice(action.markers.map(marker => marker.direction).indexOf(direction), 1);
        action.directions.splice(action.directions.map(direction => direction.direction).indexOf(direction), 1);
        if (action.directions.length === 0) {
          actionsList.splice(actionIndex, 1);
        }
      }
    });
    this.state.handleChanges(
      mapTileLayer.actualLayerName == "amakna" ? SCRIPT_ACTIONS_AMAKNA : SCRIPT_ACTIONS_INCARNAM,
      actionsList
    );
    // eslint-disable-next-line no-console
    console.log(store.getState().scriptPath.scriptActions[mapTileLayer.actualLayerName][this.getType(type)]);
  }

  removeAllMarkers(coords, map) {
    const types = ["move", "gather", "fight", "gatherfight", "bank", "phenix"];
    types.forEach(type => {
      const actionsList = store.getState().scriptPath.scriptActions[mapTileLayer.actualLayerName][this.getType(type)];
      const actionIndex = this.getActionIndex(coords, type);
      const action = actionsList[actionIndex];
      if (action === undefined) return;
      action.markers.forEach(marker => {
        marker.marker.removeFrom(map);
      });
      actionsList.splice(actionIndex, 1);
      this.state.handleChanges(
        mapTileLayer.actualLayerName == "amakna" ? SCRIPT_ACTIONS_AMAKNA : SCRIPT_ACTIONS_INCARNAM,
        actionsList
      );
      // eslint-disable-next-line no-console
      console.log(store.getState().scriptPath.scriptActions[mapTileLayer.actualLayerName]);
    });
  }

  actionAlreadyExist(coords, type) {
    const actionsList = store.getState().scriptPath.scriptActions[mapTileLayer.actualLayerName][this.getType(type)];
    let exist = false;
    actionsList.forEach(action => {
      if (action.coords[0] == coords[0] && action.coords[1] == coords[1]) {
        exist = true;
      }
    });
    return exist;
  }

  actionDirectionsAlreadyExist(coords, actualDirection, type) {
    const actionsList = store.getState().scriptPath.scriptActions[mapTileLayer.actualLayerName][this.getType(type)];
    const actionIndex = this.getActionIndex(coords, type);
    let exist = false;
    actionsList[actionIndex].directions.forEach(direction => {
      if (direction.direction == actualDirection) {
        exist = true;
      }
    });
    return exist;
  }

  getActionIndex(coords, type) {
    const actionsList = store.getState().scriptPath.scriptActions[mapTileLayer.actualLayerName][this.getType(type)];
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
      const dofusCoords = GeoToDofusCoord.geoCoordsToDofusCoords(event.latlng, this.state.map);
      const directions = store.getState().moveToggleButtons.moveDirection;
      const buildingPlacement = store.getState().moveToggleButtons.buildingPlacement;
      const formatTools = store.getState().moveToggleButtons.formatTools;
      const type = store.getState().moveType.type;
      if (directions.length > 0) {
        directions.forEach(direction => {
          const actionAlreadyExist = this.actionAlreadyExist(dofusCoords, type);
          const actionDirectionsAlreadyExist =
            actionAlreadyExist && this.actionDirectionsAlreadyExist(dofusCoords, direction, type);
          if (!actionAlreadyExist) {
            this.addMarker(dofusCoords, this.state.map, direction, type);
          } else if (actionDirectionsAlreadyExist) {
            this.removeMarker(dofusCoords, this.state.map, direction, type);
          } else {
            this.appendMarker(dofusCoords, this.state.map, direction, type);
          }
        });
      } else if (buildingPlacement !== null) {
        //
      } else if (formatTools !== null) {
        this.removeAllMarkers(dofusCoords, this.state.map);
      }
    });
    this.state.map.addEventListener("zoom", () => {
      const type = store.getState().moveType.type;
      this.resizeMarkers(type);
    });
  }
}

export default connect(
  null,
  { handleChanges }
)(withLeaflet(PathDrawer));
