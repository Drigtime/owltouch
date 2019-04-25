import L from "leaflet";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Map } from "react-leaflet";
import { connect } from "react-redux";
// import MarkerClusterGroup from "react-leaflet-markercluster";
import MapArea from "renderer/components/Map/AreaDisplayer/index";
import MapCoord from "renderer/components/Map/CoordDisplayer/index";
import HightLight from "renderer/components/Map/HightLight/index";
import PathDraw from "renderer/components/Map/PathDrawer/index";
import WorldSwitch from "renderer/components/Map/WorldSwitcher/index";
import JobResourceContainer from "renderer/components/Map/ResourceDisplayer/jobResourceContainer";

class MapComponent extends Component {
  constructor(props) {
    super(props);
    this.HandleWorldSwitch = this.HandleWorldSwitch.bind(this);
  }

  state = {
    crs: L.CRS.Simple,
    maxZoom: 4,
    minZoom: 0,
    zoom: 3
  };

  HandleWorldSwitch() {
    this.setState({ world: this.props.world });
  }

  render() {
    const { zoom, crs, maxZoom, minZoom } = this.state;
    const { world } = this.props;

    return (
      <Map zoom={zoom} maxZoom={maxZoom} minZoom={minZoom} crs={crs} style={{ backgroundColor: "black" }}>
        <MapCoord world={world} />
        <MapArea world={world} />
        <HightLight world={world} />
        <PathDraw world={world} />
        <WorldSwitch onChange={this.HandleWorldSwitch} />
        <JobResourceContainer jobId={26} />
        <JobResourceContainer jobId={28} style={{ marginTop: "0px" }} />
        <JobResourceContainer jobId={24} style={{ marginTop: "0px" }} />
        <JobResourceContainer jobId={2} style={{ marginTop: "0px" }} />
        <JobResourceContainer jobId={36} style={{ marginTop: "0px" }} />
        <JobResourceContainer jobId={1} jobName={"Divers"} />
        {/* <MarkerClusterGroup>{}</MarkerClusterGroup> */}
      </Map>
    );
  }
}

MapComponent.propTypes = {
  world: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  world: state.worldSwitch.world
});

export default connect(
  mapStateToProps,
  null
)(MapComponent);
