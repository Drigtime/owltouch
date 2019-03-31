import { Button, Card, CardContent, MuiThemeProvider, withStyles, Tooltip } from "@material-ui/core";
import path from "path";
import PropTypes from "prop-types";
import React from "react";
import { mainTheme } from "renderer/main/types";
import resourceControlStyle from "./style";

class ResourceControl extends React.Component {
  state = {
    active: false
  };

  toggleClass = () => {
    this.setState({ active: !this.state.active });
  };

  toggleResourceMarkers = () => {};

  render() {
    const { classes, resourceList, jobName } = this.props;
    return (
      <MuiThemeProvider theme={mainTheme}>
        <Card>
          <CardContent className={classes.cardContent}>
            <div className={classes.resourceDivContainer}>
              <Tooltip title={jobName} placement="right">
                <Button onClick={this.toggleClass} className={classes.button}>
                  <img src={path.join(__static, `assets/${jobName}/jobIcon.png`)} width={25} height={25} />
                </Button>
              </Tooltip>
              <div className={this.state.active ? classes.resourceContainerToggled : classes.resourceContainer}>
                {resourceList.map((resource, index) => (
                  <Tooltip title={resource.name} key={index}>
                    <Button onClick={this.toggleResourceMarkers} className={classes.button}>
                      <img src={resource.iconUrl} width={25} height={25} />
                    </Button>
                  </Tooltip>
                ))}
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
  jobName: PropTypes.string.isRequired
};

export default withStyles(resourceControlStyle)(ResourceControl);
