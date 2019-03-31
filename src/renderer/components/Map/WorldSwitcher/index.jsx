import { FormControl, MenuItem, Select } from "@material-ui/core";
import L from "leaflet";
import React from "react";
import { render } from "react-dom";
import { mapTileLayer } from "owl/utils/GeoToDofusCoord.js";
import { MapControl, withLeaflet } from "react-leaflet";
import { connect } from "react-redux";
import { handleChanges } from "renderer/actions/actions.js";
import { SWITCH_WORLD } from "renderer/actions/types.js";
import LeafletControl from "renderer/components/Map/LeafletControl/index";
import store from "renderer/store";

class MapWorldSwitcher extends MapControl {
  constructor(props) {
    super(props);
    this.map = props.leaflet.map;
    this.handleChanges = props.handleChanges;
    this.onChange = props.onChange;
  }

  handleSelectChanges = type => event => {
    this.handleChanges(type, event.target.value);
    mapTileLayer.setTileLayer(event.target.value, this.map);
    this.onChange();
    render(
      <LeafletControl>
        <form autoComplete="off">
          <FormControl>
            <Select
              onChange={this.handleSelectChanges(SWITCH_WORLD)}
              value={store.getState().worldSwitch.world}
              inputProps={{
                id: "world",
                name: "world"
              }}
            >
              <MenuItem value={"amakna"}>Amakna</MenuItem>
              <MenuItem value={"incarnam"}>Incarnam</MenuItem>
            </Select>
          </FormControl>
        </form>
      </LeafletControl>,
      this.container
    );
  };

  createLeafletElement() {
    const worldSwitcher = L.Control.extend({
      onAdd: () => {
        this.container = L.DomUtil.create("div", "world");
        L.DomEvent.disableScrollPropagation(this.container);
        L.DomEvent.disableClickPropagation(this.container);
        L.DomEvent.addListener(this.container, "mousemove", L.DomEvent.stop);
        // this.container.style.width = "150px";
        render(
          <LeafletControl>
            <form autoComplete="off">
              <FormControl>
                <Select
                  onChange={this.handleSelectChanges(SWITCH_WORLD)}
                  value={store.getState().worldSwitch.world}
                  inputProps={{
                    id: "world",
                    name: "world"
                  }}
                >
                  <MenuItem value={"amakna"}>Amakna</MenuItem>
                  <MenuItem value={"incarnam"}>Incarnam</MenuItem>
                </Select>
              </FormControl>
            </form>
          </LeafletControl>,
          this.container
        );
        return this.container;
      },
      options: {
        position: "bottomright"
      }
    });
    return new worldSwitcher();
  }

  componentDidMount() {
    mapTileLayer.setTileLayer(mapTileLayer.actualLayerName, this.map);
    this.leafletElement.addTo(this.map);
  }
}

export default connect(
  null,
  { handleChanges }
)(withLeaflet(MapWorldSwitcher));
