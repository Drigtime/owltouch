import { TextField, Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import React, { Component } from "react";
import styles from "renderer/views/Modal/ItinerarySettings/Information/styles.js";

class InformationTab extends Component {
  state = {};

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container={true} spacing={24}>
          <Grid item={true} xs={12}>
            <TextField label={"Creator name"} className={classes.input} />
          </Grid>
          <Grid item={true} xs={12}>
            <TextField label={"Area"} className={classes.input} />
          </Grid>
          <Grid item={true} xs={12}>
            <TextField label={"Type"} className={classes.input} />
          </Grid>
        </Grid>
      </div>
    );
  }
}

InformationTab.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(InformationTab);
