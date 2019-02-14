import { FormControl, FormControlLabel, Grid, Switch } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { handleChanges } from "renderer/actions/actions.js";
import { GATHER_COUNT, OPEN_BAG } from "renderer/actions/types.js";
import AutoComplete from "renderer/components/AutoComplete";
import LanguageManager from "renderer/configurations/language/LanguageManager.js";
import { GATHER } from "renderer/components/AutoComplete/types";

const Language = new LanguageManager();

const Interactives = Object.values(
  require(__static + "/langs/fr/Interactives.json")
).map(item => ({
  value: item.id,
  label: item.nameId
}));

class GatherTab extends Component {
  handleSwitchChanges = type => event => {
    this.props.handleChanges(type, event.target.checked);
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
                    onChange={this.handleSwitchChanges(OPEN_BAG)}
                    value="openBag"
                  />
                }
                label={Language.trans("gatherTabOpenBag")}
              />
            </Grid>
            <Grid item={true} xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={gatherCount}
                    onChange={this.handleSwitchChanges(GATHER_COUNT)}
                    value="gatherCount"
                  />
                }
                label={Language.trans("gatherTabGatherCount")}
              />
            </Grid>
            <Grid item={true} xs={12}>
              <AutoComplete
                suggestions={Interactives}
                label={Language.trans("gatherTabElementToGather")}
                placeholder={Language.trans(
                  "gatherTabElementToGatherPlaceholder"
                )}
                type={GATHER}
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
  handleChanges: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  gatherCount: state.gatherTab.gatherCount,
  openBag: state.gatherTab.openBag
});

export default connect(
  mapStateToProps,
  { handleChanges }
)(withStyles()(GatherTab));
