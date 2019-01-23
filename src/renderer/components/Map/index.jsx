import MapArea from "renderer/components/Map/AreaDisplayer/index";
import MapCoord from "renderer/components/Map/CoordDisplayer/index";
import HightLight from "renderer/components/Map/HightLight/index";
import L from "leaflet";
import { join } from "path";
import React, { Component } from "react";
import { Map, TileLayer } from "react-leaflet";

class MapComponent extends Component {
  state = {
    crs: L.CRS.Simple,
    hightLight: [],
    lat: -250,
    lng: 425,
    markers: [],
    maxZoom: 4,
    minZoom: 0,
    zoom: 3
  };
  render() {
    const { lat, lng, zoom, crs, maxZoom, minZoom } = this.state;
    const position = [lat, lng];

    return (
      <Map
        center={position}
        zoom={zoom}
        maxZoom={maxZoom}
        minZoom={minZoom}
        crs={crs}
      >
        <MapCoord />
        <MapArea />
        <HightLight />
        <TileLayer url={join(__static, "./tiles/amakna/{z}/{x}/{y}.jpg")} />
        {/* {this.state.hightLight.map((positions, idx) => ()} */}
      </Map>
    );
  }
}

export default MapComponent;
