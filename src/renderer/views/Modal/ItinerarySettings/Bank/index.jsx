import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  Switch,
  TextField,
  Typography
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { ExpandMore } from "@material-ui/icons";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import AutoComplete from "renderer/components/AutoComplete";
import styles from "renderer/views/Modal/ItinerarySettings/Bank/styles.js";
import { handleChanges } from "renderer/actions/actions.js";
import {
  MAX_PODS,
  TAKE_KAMAS,
  TAKE_KAMAS_QUANT,
  PUT_KAMAS,
  PUT_KAMAS_QUANT
} from "renderer/actions/types";

const Items = Object.values(require(__static + "/langs/fr/Items.json")).map(
  item => ({
    value: item.iconId,
    label: item.nameId
  })
);

class BankTab extends Component {
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

  render() {
    const {
      classes,
      maxPods,
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
              id="max-regen"
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
              id="max-fightper-map"
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
              id="max-fightper-map"
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
  takeKamas: PropTypes.bool.isRequired,
  takeKamasQuant: PropTypes.number.isRequired,
  putKamas: PropTypes.bool.isRequired,
  putKamasQuant: PropTypes.number.isRequired,
  handleChanges: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  maxPods: state.bankTab.maxPods,
  takeKamas: state.bankTab.takeKamas,
  takeKamasQuant: state.bankTab.takeKamasQuant,
  putKamas: state.bankTab.putKamas,
  putKamasQuant: state.bankTab.putKamasQuant
});

export default connect(
  mapStateToProps,
  { handleChanges }
)(withStyles(styles)(BankTab));
