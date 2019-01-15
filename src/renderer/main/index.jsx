import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import Map from "renderer/components/Map/index";
import ToolBar from "renderer/components/ToolBar/index";
import * as React from "react";
import { mainStyles, mainTheme } from "./types";

class Main extends React.Component {
  render() {
    // const { classes } = this.props;
    return (
      <MuiThemeProvider theme={mainTheme}>
        <CssBaseline />
        <ToolBar />
        <Map />
        {/* <div className={classes.root}>Test</div> */}
      </MuiThemeProvider>
    );
  }
}

export default withStyles(mainStyles)(Main);
