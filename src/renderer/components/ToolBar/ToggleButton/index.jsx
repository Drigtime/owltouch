import { faPhoenixFramework } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid, Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import PropTypes from "prop-types";
import React from "react";
import { toggleButtonStyles } from "renderer/components/ToolBar/ToggleButton/type";
import { connect } from "react-redux";
import {
  changeMoveDirection,
  changeBuildingPlacement,
  changeFormatTools
} from "renderer/actions/moveDirectionAction";

class ToggleButtons extends React.Component {
  handleMoveDirections = (event, directions) => {
    this.props.changeMoveDirection(directions);
  };
  handleSpecialMovementPlacement = (event, building) => {
    this.props.changeBuildingPlacement(building);
  };
  handleFormats = (event, format) => {
    this.props.changeFormatTools(format);
  };
  render() {
    const { classes, directions, format, building } = this.props;

    return (
      <Grid container={true} spacing={16}>
        <Grid item={true}>
          <div className={classes.toggleContainer}>
            <ToggleButtonGroup
              value={directions}
              onChange={this.handleMoveDirections}
            >
              <ToggleButton value="top">
                <FontAwesomeIcon size="lg" icon="arrow-up" />
              </ToggleButton>
              <ToggleButton value="bottom">
                <FontAwesomeIcon size="lg" icon="arrow-down" />
              </ToggleButton>
              <ToggleButton value="left">
                <FontAwesomeIcon size="lg" icon="arrow-left" />
              </ToggleButton>
              <ToggleButton value="right">
                <FontAwesomeIcon size="lg" icon="arrow-right" />
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
        </Grid>
        <Grid item={true}>
          <div className={classes.toggleContainer}>
            <ToggleButtonGroup
              value={building}
              exclusive={true}
              onChange={this.handleSpecialMovementPlacement}
            >
              <ToggleButton value="door">
                <Tooltip title="porte">
                  <FontAwesomeIcon size="lg" icon="dungeon" />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="custom">
                <Tooltip title="custom">
                  <FontAwesomeIcon size="lg" icon="code" />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="bank">
                <Tooltip title="banque">
                  <FontAwesomeIcon size="lg" icon="university" />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="phoenix">
                <Tooltip title="phenix">
                  <FontAwesomeIcon size="lg" icon={faPhoenixFramework} />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
        </Grid>
        <Grid item={true}>
          <div className={classes.toggleContainer}>
            <ToggleButtonGroup
              value={format}
              exclusive={true}
              onChange={this.handleFormats}
            >
              <ToggleButton value="delete">
                <FontAwesomeIcon size="lg" icon="eraser" />
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
        </Grid>
      </Grid>
    );
  }
}

ToggleButtons.propTypes = {
  classes: PropTypes.object.isRequired,
  directions: PropTypes.array,
  format: PropTypes.string,
  building: PropTypes.string,
  changeMoveDirection: PropTypes.func.isRequired,
  changeBuildingPlacement: PropTypes.func.isRequired,
  changeFormatTools: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  directions: state.moveToggleButtons.moveDirection,
  format: state.moveToggleButtons.formatTools,
  building: state.moveToggleButtons.buildingPlacement
});

export default connect(
  mapStateToProps,
  {
    changeMoveDirection,
    changeBuildingPlacement,
    changeFormatTools
  }
)(withStyles(toggleButtonStyles)(ToggleButtons));
