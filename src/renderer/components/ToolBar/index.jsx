import { AppBar, IconButton, Menu, MenuItem, Toolbar } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import MoreVert from "@material-ui/icons/MoreVert";
import PropTypes from "prop-types";
import React from "react";
import SelectMovementType from "renderer/components/ToolBar/SelectMovementType/index";
import ToggleButton from "renderer/components/ToolBar/ToggleButton/index";
import { toolBarStyles } from "renderer/components/ToolBar/type";

class ButtonAppBar extends React.Component {
  state = {
    anchorEl: null
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
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
              onClick={this.handleClick}
            >
              <MoreVert />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.handleClose}
            >
              <MenuItem onClick={this.handleClose}>Global settings</MenuItem>
              <MenuItem onClick={this.handleClose}>Itinary settings</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(toolBarStyles)(ButtonAppBar);
