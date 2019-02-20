import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, FormControl, FormControlLabel, Grid, InputAdornment, Switch, TextField, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { ExpandMore } from "@material-ui/icons";
import keycode from "keycode";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { handleChanges } from "renderer/actions/actions.js";
import { AUTO_DELETE, MAX_PODS, PUT_KAMAS, PUT_KAMAS_QUANT, TAKE_KAMAS, TAKE_KAMAS_QUANT } from "renderer/actions/types";
import AutoComplete from "renderer/components/AutoComplete";
import { ITEMS } from "renderer/components/AutoComplete/types";
import styles from "renderer/views/Modal/ItinerarySettings/Bank/styles.js";

const Items = Object.values(require(__static + "/langs/fr/Items.json")).map(
  item => ({
    id: item.id,
    iconId: item.iconId,
    label: item.nameId
  })
);

class BankTab extends Component {
  state = {
    autoDeleteInputValue: ""
  }

  handleSwitchChanges = type => event => {
    this.props.handleChanges(type, event.target.checked);
  };

  handleInputChanges = type => event => {
    this.props.handleChanges(type, Number(event.target.value));
  };

  handleInputWithLimitChanges = (type, max) => event => {
    this.props.handleChanges(
      type,
      Number(event.target.value > max ? max : event.target.value)
    );
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
    const {
      classes,
      maxPods,
      autoDelete,
      takeKamas,
      takeKamasQuant,
      putKamas,
      putKamasQuant
    } = this.props;
    return (
      <div className={classes.root}>
        <Grid container={true} spacing={24}>
          <Grid item={true} xs={12}>
            <TextField
              label="Pod max"
              id="pod-max"
              type="number"
              value={maxPods}
              onChange={this.handleInputWithLimitChanges(MAX_PODS, 100)}
              className={classes.input}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>
              }}
              inputProps={{
                min: 0,
                max: 100
              }}
            />
          </Grid>
          <Grid item={true} xs={12}>
            <AutoComplete
              suggestions={Items}
              label="Auto delete"
              placeholder="ex : Pain au Blé Complet"
              type={ITEMS}
              selectedItem={autoDelete}
              onChange={this.handleAutoCompleteChange(
                AUTO_DELETE,
                autoDelete,
                "autoDeleteInputValue"
              )}
              inputValue={this.state.autoDeleteInputValue}
              handleDelete={this.handleAutoCompleteDelete(
                AUTO_DELETE,
                autoDelete
              )}
              handleInputChange={this.handleAutoCompleteInputChange(
                "autoDeleteInputValue"
              )}
              handleKeyDown={this.handleAutoCompleteKeyDown(
                AUTO_DELETE,
                autoDelete,
                "autoDeleteInputValue"
              )}
            />
          </Grid>
          <Grid item={true} xs={6}>
            <FormControl style={{ width: "100%" }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={takeKamas}
                    onChange={this.handleSwitchChanges(TAKE_KAMAS)}
                  />
                }
                label="take kamas from bank"
              />
            </FormControl>
          </Grid>
          <Grid item={true} xs={6}>
            <TextField
              id="take-kamas-quant"
              type="number"
              disabled={!takeKamas}
              className={classes.input}
              value={takeKamasQuant}
              onChange={this.handleInputChanges(TAKE_KAMAS_QUANT)}
              InputLabelProps={{
                shrink: true
              }}
              inputProps={{
                min: 0
              }}
            />
          </Grid>
          <Grid item={true} xs={6}>
            <FormControl style={{ width: "100%" }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={putKamas}
                    onChange={this.handleSwitchChanges(PUT_KAMAS)}
                  />
                }
                label="put kamas to the bank"
              />
            </FormControl>
          </Grid>
          <Grid item={true} xs={6}>
            <TextField
              id="put-kamas-quant"
              type="number"
              disabled={!putKamas}
              className={classes.input}
              value={putKamasQuant}
              onChange={this.handleInputChanges(PUT_KAMAS_QUANT)}
              InputLabelProps={{
                shrink: true
              }}
              inputProps={{
                min: 0
              }}
            />
          </Grid>
          <Grid item={true} xs={12}>
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                <Typography className={classes.heading}>
                  item to get from the bank
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails className={classes.expansionPanelDetails}>
                <Grid container={true} spacing={24}>
                  <Grid item={true} xs={6} />
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Grid>
          <Grid item={true} xs={12}>
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                <Typography className={classes.heading}>
                  item to put in the bank
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails className={classes.expansionPanelDetails}>
                <Grid container={true} spacing={24}>
                  <Grid item={true} xs={6} />
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Grid>
        </Grid>
      </div>
    );
  }
}

BankTab.propTypes = {
  classes: PropTypes.object.isRequired,
  maxPods: PropTypes.number.isRequired,
  autoDelete: PropTypes.array.isRequired,
  takeKamas: PropTypes.bool.isRequired,
  takeKamasQuant: PropTypes.number.isRequired,
  putKamas: PropTypes.bool.isRequired,
  putKamasQuant: PropTypes.number.isRequired,
  handleChanges: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  maxPods: state.bankTab.maxPods,
  autoDelete: state.bankTab.autoDelete,
  takeKamas: state.bankTab.takeKamas,
  takeKamasQuant: state.bankTab.takeKamasQuant,
  putKamas: state.bankTab.putKamas,
  putKamasQuant: state.bankTab.putKamasQuant
});

export default connect(
  mapStateToProps,
  { handleChanges }
)(withStyles(styles)(BankTab));
