import { Grid, TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { handleChanges } from "renderer/actions/actions.js";
import {
  SCRIPT_AREA,
  SCRIPT_AUTHOR_NAME,
  SCRIPT_NAME,
  SCRIPT_TYPE
} from "renderer/actions/types.js";
import styles from "renderer/views/Modal/ItinerarySettings/Information/styles.js";

class InformationTab extends Component {

  handleInputChanges = type => event => {
    this.props.handleChanges(type, event.target.value);
  };

  render() {
    const {
      classes,
      scriptName,
      scriptType,
      scriptArea,
      scriptAuthorName
    } = this.props;

    return (
      <div className={classes.root}>
        <Grid container={true} spacing={24}>
          <Grid item={true} xs={12}>
            <TextField
              label={"Script name"}
              value={scriptName}
              className={classes.input}
              onChange={this.handleInputChanges(SCRIPT_NAME)}
            />
          </Grid>
          <Grid item={true} xs={12}>
            <TextField
              label={"Creator name"}
              value={scriptType}
              className={classes.input}
              onChange={this.handleInputChanges(SCRIPT_AREA)}
            />
          </Grid>
          <Grid item={true} xs={12}>
            <TextField
              label={"Area"}
              value={scriptArea}
              className={classes.input}
              onChange={this.handleInputChanges(SCRIPT_TYPE)}
            />
          </Grid>
          <Grid item={true} xs={12}>
            <TextField
              label={"Type"}
              value={scriptAuthorName}
              className={classes.input}
              onChange={this.handleInputChanges(SCRIPT_AUTHOR_NAME)}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

InformationTab.propTypes = {
  classes: PropTypes.object.isRequired,
  handleChanges: PropTypes.func.isRequired,
  scriptName: PropTypes.string.isRequired,
  scriptType: PropTypes.string.isRequired,
  scriptArea: PropTypes.string.isRequired,
  scriptAuthorName: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  scriptName: state.informationTab.scriptName,
  scriptType: state.informationTab.scriptType,
  scriptArea: state.informationTab.scriptArea,
  scriptAuthorName: state.informationTab.scriptAuthorName
});

export default connect(
  mapStateToProps,
  { handleChanges }
)(withStyles(styles)(InformationTab));
