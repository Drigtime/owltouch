import {
  Card,
  CardContent,
  MuiThemeProvider,
  withStyles
} from "@material-ui/core";
import { mainTheme } from "renderer/main/types";
import PropTypes from "prop-types";
import React from "react";
import { mapControlStyle } from "./type";

class MapControl extends React.Component {
  render() {
    const { classes, children } = this.props;
    return (
      <MuiThemeProvider theme={mainTheme}>
        <Card>
          <CardContent className={classes.cardContent}>{children}</CardContent>
        </Card>
      </MuiThemeProvider>
    );
  }
}

MapControl.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired
};

export default withStyles(mapControlStyle)(MapControl);