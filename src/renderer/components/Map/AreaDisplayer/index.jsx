import { Typography } from "@material-ui/core";
import L from "leaflet";
import GeoToDofusCoord, { mapTileLayer } from "owl/utils/GeoToDofusCoord.js";
import React from "react";
import { render } from "react-dom";
import { MapControl, withLeaflet } from "react-leaflet";
import { getId } from "renderer/components/Map/HightLight/index";
import LeafletControl from "renderer/components/Map/LeafletControl/index";

class MapInfo extends MapControl {
  constructor(props) {
    super(props);
    this.map = this.props.leaflet.map;
  }

  createLeafletElement() {
    const mapInfo = L.Control.extend({
      onAdd: () => {
        this.container = L.DomUtil.create("div", "info");
        L.DomEvent.disableScrollPropagation(this.container);
        L.DomEvent.disableClickPropagation(this.container);
        L.DomEvent.addListener(this.container, "mousemove", L.DomEvent.stop);
        return this.container;
      },
      options: {
        position: "topright"
      }
    });
    return new mapInfo();
  }

  componentDidMount() {
    this.map.addEventListener("mousemove", event => {
      const dofusCoord = GeoToDofusCoord.geoCoordsToDofusCoords(event.latlng, this.props.leaflet.map);
      const dofusAreaId = getId(dofusCoord[0], dofusCoord[1], mapTileLayer.getTileLayer());
      if (dofusAreaId.subAreaName !== null) {
        render(
          <LeafletControl>
            <Typography>{dofusAreaId.subAreaName}</Typography>
          </LeafletControl>,
          this.container
        );
      } else {
        render(<div />, this.container);
      }
    });
    this.leafletElement.addTo(this.map);
  }
}

export default withLeaflet(MapInfo);
