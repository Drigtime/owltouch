import {
  FormControl,
  FormControlLabel,
  FormGroup,
  Switch
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import React, { Component } from "react";
import AutoComplete from "renderer/components/Modal/AutoComplete";

const style = () => ({});

const Interactives = Object.values(
  require(__static + "/i18n/fr/Interactives.json")
).map(item => ({
  value: item.id,
  label: item.nameId
}));

class GatherTab extends Component {
  state = {
    openBag: true,
    gatherCount: true
  };

  handleSwitchChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  render() {
    return (
      <div>
        <FormControl style={{ width: "100%" }}>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.openBag}
                  onChange={this.handleSwitchChange("openBag")}
                  value="openBag"
                />
              }
              label="Open bags"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.gatherCount}
                  onChange={this.handleSwitchChange("gatherCount")}
                  value="gatherCount"
                />
              }
              label="Gather count"
            />
            <AutoComplete
              suggestions={Interactives}
              label="Resource to harvest"
              placeholder="ex : Blé"
            />
          </FormGroup>
        </FormControl>
      </div>
    );
  }
}

GatherTab.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(style)(GatherTab);
