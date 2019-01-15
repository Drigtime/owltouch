import { faPhoenixFramework } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid, Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import PropTypes from "prop-types";
import React from "react";
import { toggleButtonStyles } from "renderer/components/ToolBar/ToggleButton/type";

class ToggleButtons extends React.Component {
  state = {
    formats: null,
    movementType: [],
    specialMovementPlacement: null
  };
  handleMovementType = (event, movementType) => {
    this.setState({ movementType });
    this.setState({ formats: null });
    this.setState({ specialMovementPlacement: null });
  };
  handleSpecialMovementPlacement = (event, specialMovementPlacement) => {
    this.setState({ specialMovementPlacement });
    this.setState({ formats: null });
    this.setState({ movementType: [] });
  };
  handleFormats = (event, formats) => {
    this.setState({ formats });
    this.setState({ movementType: [] });
    this.setState({ specialMovementPlacement: null });
  };
  render() {
    const { classes } = this.props;
    const { specialMovementPlacement, movementType, formats } = this.state;

    return (
      <Grid container={true} spacing={16}>
        <Grid item={true}>
          <div className={classes.toggleContainer}>
            <ToggleButtonGroup
              value={movementType}
              onChange={this.handleMovementType}
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
              value={specialMovementPlacement}
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
              value={formats}
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
  classes: PropTypes.object.isRequired
};

export default withStyles(toggleButtonStyles)(ToggleButtons);
