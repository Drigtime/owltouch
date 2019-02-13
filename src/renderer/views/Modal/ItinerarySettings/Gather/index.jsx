import {
  FormControl,
  FormControlLabel,
  Switch,
  Grid
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import React, { Component } from "react";
import AutoComplete from "renderer/components/AutoComplete";
import { connect } from "react-redux";
import {
  checkGatherCountSwitch,
  checkOpenBagSwitch
} from "renderer/actions/scriptSettingActions/gatherTabAction";

const style = () => ({});

const Interactives = Object.values(
  require(__static + "/i18n/fr/Interactives.json")
).map(item => ({
  value: item.id,
  label: item.nameId
}));

class GatherTab extends Component {
  handleGatherCountChange = event => {
    this.props.checkGatherCountSwitch(event.target.checked);
  };
  handleOpenbagChange = event => {
    this.props.checkOpenBagSwitch(event.target.checked);
  };

  render() {
    const { openBag, gatherCount } = this.props;

    return (
      <div>
        <FormControl style={{ width: "100%" }}>
          <Grid container={true} spacing={24}>
            <Grid item={true} xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={openBag}
                    onChange={this.handleOpenbagChange}
                    value="openBag"
                  />
                }
                label="Open bags"
              />
            </Grid>
            <Grid item={true} xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={gatherCount}
                    onChange={this.handleGatherCountChange}
                    value="gatherCount"
                  />
                }
                label="Gather count"
              />
            </Grid>
            <Grid item={true} xs={6}>
              <AutoComplete
                suggestions={Interactives}
                label="Resource to harvest"
                placeholder="ex : Blé"
              />
            </Grid>
          </Grid>
        </FormControl>
      </div>
    );
  }
}

GatherTab.propTypes = {
  classes: PropTypes.object.isRequired,
  gatherCount: PropTypes.bool.isRequired,
  openBag: PropTypes.bool.isRequired,
  checkGatherCountSwitch: PropTypes.func.isRequired,
  checkOpenBagSwitch: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  gatherCount: state.gatherTab.gatherCount,
  openBag: state.gatherTab.openBag
});

export default connect(
  mapStateToProps,
  { checkGatherCountSwitch, checkOpenBagSwitch }
)(withStyles(style)(GatherTab));
