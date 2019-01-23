import { Typography } from "@material-ui/core";
import L from "leaflet";
import React from "react";
import { render } from "react-dom";
import { MapControl, withLeaflet } from "react-leaflet";
import {
  geoCoordsToDofusCoords,
  getId
} from "renderer/components/Map/HightLight/index";
import LeafletControl from "renderer/components/Map/LeafletControl/index";

class MapInfo extends MapControl {
  constructor(props) {
    super(props);
    this.map = this.props.leaflet.map;
  }

  createLeafletElement() {
    const mapInfo = L.Control.extend({
      onAdd: () => {
        this.areaName = L.DomUtil.create("div", "info");
        return this.areaName;
      },
      position: "topright"
    });
    return new mapInfo();
  }

  componentDidMount() {
    this.map.addEventListener("mousemove", event => {
      const dofusCoord = geoCoordsToDofusCoords(
        event.latlng,
        this.props.leaflet.map
      );
      const dofusAreaId = getId(dofusCoord[0], dofusCoord[1]);
      if (dofusAreaId.subAreaName !== null) {
        render(
          <LeafletControl>
            <Typography>{dofusAreaId.subAreaName}</Typography>
          </LeafletControl>,
          this.areaName
        );
      } else {
        render(<div />, this.areaName);
      }
    });
    this.leafletElement.addTo(this.map);
  }
}

export default withLeaflet(MapInfo);
