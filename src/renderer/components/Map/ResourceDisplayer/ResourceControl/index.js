import { Button, Card, CardContent, MuiThemeProvider, Tooltip, withStyles } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import imgSize from "image-size";
import L from "leaflet";
import GeoToDofusCoord, { mapTileLayer } from "owl/utils/GeoToDofusCoord.js";
import path from "path";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { handleChanges } from "renderer/actions/actions.js";
import { RESOURCE_MARKER } from "renderer/actions/types.js";
import { mainTheme } from "renderer/main/types";
import resourceControlStyle from "./style";

class ResourceControl extends React.Component {
  state = {
    active: false,
    elements: []
  };

  toggleClass = () => {
    this.setState({ active: !this.state.active });
  };

  toggleResourceMarkers = (event, value) => {
    const markers = this.props.markers;

    const checkMissingResource = (firstArray, secondArray) => {
      for (const firstValue of firstArray) {
        let flag = false;
        for (const secondValue of secondArray) {
          if (firstValue == secondValue) {
            flag = true;
          }
        }
        if (!flag) return firstValue;
      }
    };

    const findResourceId = name => {
      for (const resource of this.props.resourceList) {
        if (name === resource.name) {
          return resource;
        }
      }
      return false;
    };

    if (value.length < this.state.elements.length) {
      const removedResource = findResourceId(checkMissingResource(this.state.elements, value));
      markers[removedResource.id].forEach(resource => {
        resource.marker.removeFrom(this.props.map);
      });
      delete markers[removedResource.id];
    } else if (value.length > this.state.elements.length) {
      const newResource = findResourceId(checkMissingResource(value, this.state.elements));
      markers[newResource.id] = [];
      newResource.locations.forEach(location => {
        if (location.gfx && location.worldMapId !== undefined) {
          markers[newResource.id].push({
            worldMapId: location.worldMapId,
            marker: L.marker(
              GeoToDofusCoord.getDofusMapBounds(
                [location.posX, location.posY],
                this.props.map,
                mapTileLayer[location.worldMapId == 1 ? "amakna" : "incarnam"]
              ),
              {
                icon: L.icon({
                  iconUrl: path.join(__static, `assets/Divers/Hint/${location.gfx}.png`),
                  iconAnchor: [
                    imgSize(path.join(__static, `assets/Divers/Hint/${location.gfx}.png`)).width / 2,
                    imgSize(path.join(__static, `assets/Divers/Hint/${location.gfx}.png`)).height / 2
                  ]
                })
              }
            )
          });
        } else if (location.w !== undefined) {
          markers[newResource.id].push({
            worldMapId: location.w,
            marker: L.marker(
              GeoToDofusCoord.getDofusMapBounds(
                [location.posX, location.posY],
                this.props.map,
                mapTileLayer[location.w == 1 ? "amakna" : "incarnam"]
              ),
              {
                icon: L.icon({
                  iconUrl: newResource.iconUrl,
                  iconAnchor: [imgSize(newResource.iconUrl).width / 2, imgSize(newResource.iconUrl).height / 2]
                })
              }
            )
          });
        }
      });
      const currentWorldMap = mapTileLayer.getTileLayer().worldMap;
      markers[newResource.id].forEach(resource => {
        if (resource.worldMapId == currentWorldMap) {
          resource.marker.addTo(this.props.map);
        }
      });
    }
    this.props.handleChanges(RESOURCE_MARKER, markers);
    this.setState({ elements: value });
  };

  render() {
    const { classes, resourceList, jobName, jobId } = this.props;
    return (
      <MuiThemeProvider theme={mainTheme}>
        <Card>
          <CardContent className={classes.cardContent}>
            <div className={classes.resourceDivContainer}>
              <Tooltip title={jobName} placement="right">
                <Button onClick={this.toggleClass} className={classes.jobButton}>
                  <img src={path.join(__static, `assets/jobIcon/${jobId}.png`)} />
                </Button>
              </Tooltip>
              <div className={this.state.active ? classes.resourceContainerToggled : classes.resourceContainer}>
                <ToggleButtonGroup
                  value={this.state.elements}
                  onChange={this.toggleResourceMarkers}
                  className={classes.toggleButtonGroup}
                >
                  {resourceList.map((resource, index) => (
                    <Tooltip title={resource.name} value={resource.name} key={index}>
                      <ToggleButton className={classes.toggleButton}>
                        <img src={resource.iconUrl} />
                      </ToggleButton>
                    </Tooltip>
                  ))}
                </ToggleButtonGroup>
              </div>
            </div>
          </CardContent>
        </Card>
      </MuiThemeProvider>
    );
  }
}

ResourceControl.propTypes = {
  classes: PropTypes.object.isRequired,
  resourceList: PropTypes.array.isRequired,
  jobName: PropTypes.string.isRequired,
  jobId: PropTypes.number.isRequired,
  map: PropTypes.any.isRequired,
  handleChanges: PropTypes.func.isRequired,
  markers: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  markers: state.resourceMarker.markers
});

export default connect(
  mapStateToProps,
  { handleChanges }
)(withStyles(resourceControlStyle)(ResourceControl));
