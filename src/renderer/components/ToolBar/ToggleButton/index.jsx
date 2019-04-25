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
import { handleChanges } from "renderer/actions/actions.js";
import { MOVEMENT_DIRECTION, BUILDING_PLACEMENT, FORMAT_TOOL } from "renderer/actions/types.js";

class ToggleButtons extends React.Component {
  handleToggleChanges = type => (event, value) => {
    this.props.handleChanges(type, value);
  };

  compo;

  render() {
    const { classes, directions, format, building } = this.props;

    return (
      <Grid container={true} spacing={16}>
        <Grid item={true}>
          <div className={classes.toggleContainer}>
            <ToggleButtonGroup value={directions} onChange={this.handleToggleChanges(MOVEMENT_DIRECTION)}>
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
              onChange={this.handleToggleChanges(BUILDING_PLACEMENT)}
            >
              <Tooltip title="porte" value="door">
                <ToggleButton>
                  <FontAwesomeIcon size="lg" icon="dungeon" />
                </ToggleButton>
              </Tooltip>
              <Tooltip title="custom" value="custom">
                <ToggleButton>
                  <FontAwesomeIcon size="lg" icon="code" />
                </ToggleButton>
              </Tooltip>
              <Tooltip title="banque" value="bank">
                <ToggleButton>
                  <FontAwesomeIcon size="lg" icon="university" />
                </ToggleButton>
              </Tooltip>
              <Tooltip title="phenix" value="phoenix">
                <ToggleButton>
                  <FontAwesomeIcon size="lg" icon={faPhoenixFramework} />
                </ToggleButton>
              </Tooltip>
            </ToggleButtonGroup>
          </div>
        </Grid>
        <Grid item={true}>
          <div className={classes.toggleContainer}>
            <ToggleButtonGroup value={format} exclusive={true} onChange={this.handleToggleChanges(FORMAT_TOOL)}>
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
  handleChanges: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  directions: state.moveToggleButtons.moveDirection,
  format: state.moveToggleButtons.formatTools,
  building: state.moveToggleButtons.buildingPlacement
});

export default connect(
  mapStateToProps,
  { handleChanges }
)(withStyles(toggleButtonStyles)(ToggleButtons));
