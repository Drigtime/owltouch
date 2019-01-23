import { FormControl, FormControlLabel, FormGroup, Switch } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import React, { Component } from "react";
import AutoComplete from 'renderer/components/Modal/AutoComplete';

const style = () => ({})

const suggestions = [
    { label: "Afghanistan" },
    { label: "Aland Islands" },
    { label: "Albania" },
    { label: "Algeria" },
    { label: "American Samoa" },
    { label: "Andorra" },
    { label: "Angola" },
    { label: "Anguilla" },
    { label: "Antarctica" },
    { label: "Antigua and Barbuda" },
    { label: "Argentina" },
    { label: "Armenia" },
    { label: "Aruba" },
    { label: "Australia" },
    { label: "Austria" },
    { label: "Azerbaijan" },
    { label: "Bahamas" },
    { label: "Bahrain" },
    { label: "Bangladesh" },
    { label: "Barbados" },
    { label: "Belarus" },
    { label: "Belgium" },
    { label: "Belize" },
    { label: "Benin" },
    { label: "Bermuda" },
    { label: "Bhutan" },
    { label: "Bolivia, Plurinational State of" },
    { label: "Bonaire, Sint Eustatius and Saba" },
    { label: "Bosnia and Herzegovina" },
    { label: "Botswana" },
    { label: "Bouvet Island" },
    { label: "Brazil" },
    { label: "British Indian Ocean Territory" },
    { label: "Brunei Darussalam" }
  ].map(suggestion => ({
    value: suggestion.label,
    label: suggestion.label
  }));

class GatherTab extends Component {
  state = {
    openBag: true,
    gatherCount: true,
  };

  handleSwitchChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  render() {
    return (
      <div>
        <FormControl style={{width: "100%"}}>
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
            <AutoComplete suggestions={suggestions} label="Resource to harvest"/>
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