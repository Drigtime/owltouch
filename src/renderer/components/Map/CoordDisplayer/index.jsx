import { Grid, TextField } from "@material-ui/core";
import {
  geoCoordsToDofusCoords,
  getId
} from "renderer/components/Map/HightLight/index";
import LeafletControl from "renderer/components/Map/LeafletControl/index";
import L from "leaflet";
import React from "react";
import { render } from "react-dom";
import { MapControl, withLeaflet } from "react-leaflet";

class MapInfo extends MapControl {
  dofusCoord;
  constructor(props) {
    super(props);
    this.state = {};
    this.map = this.props.leaflet.map;
  }

  createLeafletElement() {
    const mapInfo = L.Control.extend({
      onAdd: () => {
        this.dofusCoord = L.DomUtil.create("div", "info");
        this.dofusCoord.style.width = "150px";
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
          this.dofusCoord
        );
        return this.dofusCoord;
      },
      position: "topright"
    });
    return new mapInfo();
  }

  componentDidMount() {
    this.map.addEventListener("mousemove", event => {
      const dofusCoord = geoCoordsToDofusCoords(event.latlng, this.map);
      const dofusMapId = getId(dofusCoord[0], dofusCoord[1]);
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
        this.dofusCoord
      );
    });
    this.leafletElement.addTo(this.map);
  }
}

export default withLeaflet(MapInfo);
