import { AppBar, IconButton, Menu, MenuItem, Toolbar } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import MoreVert from "@material-ui/icons/MoreVert";
import PropTypes from "prop-types";
import React from "react";
import SelectMovementType from "renderer/components/ToolBar/SelectMoveType/index";
import ToggleButton from "renderer/components/ToolBar/ToggleButton/index";
import { toolBarStyles } from "renderer/views/ToolBar/type";

import Itinerary from "renderer/views/Modal/ItinerarySettings";

class ButtonAppBar extends React.Component {
  state = {
    anchorEl: null,
    modalGlobalSettingsOpen: false
  };

  modalHandleOpen = () => {
    this.setState({ modalGlobalSettingsOpen: true });
    this.menuHandleCLose();
  };

  modalHandleClose = () => {
    this.setState({ modalGlobalSettingsOpen: false });
  };

  menuHandleOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  menuHandleCLose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar variant="dense">
            <SelectMovementType />
            <ToggleButton />
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              aria-owns={anchorEl ? "simple-menu" : undefined}
              aria-haspopup="true"
              onClick={this.menuHandleOpen}
            >
              <MoreVert />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.menuHandleCLose}
            >
              <MenuItem onClick={this.modalHandleOpen}>
                Global settings
              </MenuItem>
              <MenuItem onClick={this.modalHandleOpen}>
                Itinerary settings
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Itinerary
          open={this.state.modalGlobalSettingsOpen}
          onClose={this.modalHandleClose}
        >
          {<div />}
        </Itinerary>
      </div>
    );
  }
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(toolBarStyles)(ButtonAppBar);
