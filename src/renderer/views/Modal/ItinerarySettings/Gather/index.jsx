import { FormControl, FormControlLabel, Grid, Switch } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import keycode from "keycode";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { handleChanges } from "renderer/actions/actions.js";
import {
  ELEMENT_TO_GATHER,
  GATHER_COUNT,
  OPEN_BAG
} from "renderer/actions/types.js";
import MultipleChoiceAutoComplete from "renderer/components/AutoComplete/MultipleChoiceAutoComplete";
import { GATHER } from "renderer/components/AutoComplete/types";
import Language from "renderer/configurations/language/LanguageManager.js";

const Interactives = Object.values(
  require(__static + "/langs/fr/Interactives.json")
).map(item => ({
  id: item.id,
  label: item.nameId
}));

class GatherTab extends Component {
  state = {
    elementToGatherInputValue: ""
  };

  handleSwitchChanges = type => event => {
    this.props.handleChanges(type, event.target.checked);
  };

  handleAutoCompleteChange = (
    type,
    autoCompleteProp,
    autoCompleteState
  ) => element => {
    if (autoCompleteProp.indexOf(element) === -1) {
      autoCompleteProp = [...autoCompleteProp, element];
    }
    this.setState({ [autoCompleteState]: "" });
    this.props.handleChanges(type, autoCompleteProp);
  };

  handleAutoCompleteKeyDown = (
    type,
    autoCompleteProp,
    autoCompleteState
  ) => event => {
    if (
      autoCompleteProp.length &&
      !this.state[autoCompleteState].length &&
      keycode(event) === "backspace"
    ) {
      this.props.handleChanges(
        type,
        autoCompleteProp.slice(0, autoCompleteProp.length - 1)
      );
    }
  };

  handleAutoCompleteInputChange = autoCompleteState => event => {
    this.setState({ [autoCompleteState]: event.target.value });
  };

  handleAutoCompleteDelete = (type, autoCompleteProp) => item => () => {
    const selectedItem = [...autoCompleteProp];
    selectedItem.splice(selectedItem.indexOf(item), 1);
    this.props.handleChanges(type, selectedItem);
  };

  render() {
    const { openBag, gatherCount, elementToGather } = this.props;

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
              <MultipleChoiceAutoComplete
                suggestions={Interactives}
                label={Language.trans("gatherTabElementToGather")}
                placeholder={Language.trans(
                  "gatherTabElementToGatherPlaceholder"
                )}
                type={GATHER}
                selectedItem={elementToGather}
                onChange={this.handleAutoCompleteChange(
                  ELEMENT_TO_GATHER,
                  elementToGather,
                  "elementToGatherInputValue"
                )}
                inputValue={this.state.elementToGatherInputValue}
                handleDelete={this.handleAutoCompleteDelete(
                  ELEMENT_TO_GATHER,
                  elementToGather
                )}
                handleInputChange={this.handleAutoCompleteInputChange(
                  "elementToGatherInputValue"
                )}
                handleKeyDown={this.handleAutoCompleteKeyDown(
                  ELEMENT_TO_GATHER,
                  elementToGather,
                  "elementToGatherInputValue"
                )}
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
  elementToGather: PropTypes.array.isRequired,
  handleChanges: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  gatherCount: state.gatherTab.gatherCount,
  openBag: state.gatherTab.openBag,
  elementToGather: state.gatherTab.elementToGather
});

export default connect(
  mapStateToProps,
  { handleChanges }
)(withStyles()(GatherTab));
