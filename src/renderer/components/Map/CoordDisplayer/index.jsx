import { Grid, TextField } from "@material-ui/core";
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
    this.state = {};
    this.map = this.props.leaflet.map;
  }

  createLeafletElement() {
    const mapInfo = L.Control.extend({
      onAdd: () => {
        this.container = L.DomUtil.create("div", "info");
        L.DomEvent.disableScrollPropagation(this.container);
        L.DomEvent.disableClickPropagation(this.container);
        L.DomEvent.addListener(this.container, "mousemove", L.DomEvent.stop);
        this.container.style.width = "105px";
        render(
          <LeafletControl>
            <form noValidate={true} autoComplete="off">
              <Grid container={true} spacing={8}>
                <Grid item={true} xs={6}>
                  <TextField value={"X"} />
                </Grid>
                <Grid item={true} xs={6}>
                  <TextField value={"Y"} />
                </Grid>
                <Grid item={true} xs={12}>
                  <TextField value={"MAPID"} />
                </Grid>
              </Grid>
            </form>
          </LeafletControl>,
          this.container
        );
        return this.container;
      }
    });
    return new mapInfo();
  }

  componentDidMount() {
    this.map.addEventListener("mousemove", event => {
      const dofusCoord = GeoToDofusCoord.geoCoordsToDofusCoords(event.latlng, this.map);
      const dofusMapId = getId(dofusCoord[0], dofusCoord[1], mapTileLayer.getTileLayer());
      render(
        <LeafletControl>
          <form noValidate={true} autoComplete="off">
            <Grid container={true} spacing={8}>
              <Grid item={true} xs={6}>
                <TextField value={dofusCoord[0]} />
              </Grid>
              <Grid item={true} xs={6}>
                <TextField value={dofusCoord[1]} />
              </Grid>
              <Grid item={true} xs={12}>
                <TextField value={dofusMapId.id} />
              </Grid>
            </Grid>
          </form>
        </LeafletControl>,
        this.container
      );
    });
    this.leafletElement.addTo(this.map);
  }
}

export default withLeaflet(MapInfo);
