import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
  FormControl,
  FormControlLabel,
  Switch,
  InputAdornment,
  TextField,
  Grid
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import React, { Component } from "react";
import AutoComplete from "renderer/components/AutoComplete";
import { connect } from "react-redux";
import {
  checkFightCountSwitch,
  checkAutoRegenSwitch
} from "renderer/actions/scriptSettingActions/fightTabAction.js";
import styles from "renderer/views/Modal/ItinerarySettings/Fight/styles.js";

const Items = Object.values(require(__static + "/i18n/fr/Items.json")).map(
  item => ({
    value: item.iconId,
    label: item.nameId
  })
);

class FightTab extends Component {
  handleFightCountSwitchChange = event => {
    this.props.checkFightCountSwitch(event.target.checked);
  };
  handleAutoRegenSwitchChange = event => {
    this.props.checkAutoRegenSwitch(event.target.checked);
  };

  render() {
    const { classes, fightCount, autoRegen } = this.props;
    return (
      <div className={classes.root}>
        <Grid container={true} spacing={24}>
          <Grid item={true} xs={3}>
            <FormControl style={{ width: "100%" }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={fightCount}
                    onChange={this.handleFightCountSwitchChange}
                    value="fightCount"
                  />
                }
                label="fight count"
              />
            </FormControl>
          </Grid>
          <Grid item={true} xs={3}>
            <FormControl style={{ width: "100%" }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoRegen}
                    onChange={this.handleAutoRegenSwitchChange}
                    value="autoRegen"
                  />
                }
                label="auto regen"
              />
            </FormControl>
          </Grid>
          <Grid item={true} xs={4}>
            <FormControl style={{ width: "100%" }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoRegen}
                    onChange={this.handleAutoRegenSwitchChange}
                    value="maxFight"
                  />
                }
                label="Max fight per map"
              />
            </FormControl>
          </Grid>
          <Grid item={true} xs={2}>
            <TextField
              id="max-fightper-map"
              type="number"
              className={classes.input}
              disabled={!autoRegen}
              InputLabelProps={{
                shrink: true
              }}
              inputProps={{
                min: 0
              }}
            />
          </Grid>
          <Grid item={true} xs={12}>
            <ExpansionPanel disabled={!autoRegen}>
              <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                <Typography className={classes.heading}>Auto regen</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails className={classes.expansionPanelDetails}>
                <Grid container={true} spacing={24}>
                  <Grid item={true} xs={6}>
                    <TextField
                      label="min regen"
                      id="min-regen"
                      type="number"
                      className={classes.input}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        )
                      }}
                      inputProps={{
                        min: 0,
                        max: 100
                      }}
                    />
                  </Grid>
                  <Grid item={true} xs={6}>
                    <TextField
                      label="max regen"
                      id="max-regen"
                      type="number"
                      className={classes.input}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        )
                      }}
                      inputProps={{
                        min: 0,
                        max: 100
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={24}>
                  <Grid item={true} xs={10}>
                    <AutoComplete
                      suggestions={Items}
                      label="Item to regen"
                      placeholder="ex : Pain au Blé Complet"
                    />
                  </Grid>
                  <Grid item={true} xs={2}>
                    <TextField
                      label="number of item to take from the bank"
                      id="nb-item-regen"
                      type="number"
                      className={classes.input}
                      inputProps={{
                        min: 0
                      }}
                    />
                  </Grid>
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Grid>
          <Grid item={true} xs={6}>
            <TextField
              label="min monster level"
              id="min-monster-lvl"
              type="number"
              className={classes.input}
              InputLabelProps={{
                shrink: true
              }}
              inputProps={{
                min: 0
              }}
            />
          </Grid>
          <Grid item={true} xs={6}>
            <TextField
              label="max monster level"
              id="max-monster-lvl"
              type="number"
              className={classes.input}
              InputLabelProps={{
                shrink: true
              }}
              inputProps={{
                min: 0
              }}
            />
          </Grid>
          <Grid item={true} xs={6}>
            <TextField
              label="min monster number"
              id="min-monster-number"
              type="number"
              className={classes.input}
              InputLabelProps={{
                shrink: true
              }}
              inputProps={{
                min: 0
              }}
            />
          </Grid>
          <Grid item={true} xs={6}>
            <TextField
              label="max monster number"
              id="max-monster-number"
              type="number"
              className={classes.input}
              InputLabelProps={{
                shrink: true
              }}
              inputProps={{
                min: 0
              }}
            />
          </Grid>
          <Grid item={true} xs={12}>
            <AutoComplete
              suggestions={Items}
              label="Forbidden monster"
              placeholder="ex : Piou bleu"
            />
          </Grid>
          <Grid item={true} xs={12}>
            <AutoComplete
              suggestions={Items}
              label="Mandatory monster"
              placeholder="ex : Piou bleu"
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

FightTab.propTypes = {
  classes: PropTypes.object.isRequired,
  fightCount: PropTypes.bool.isRequired,
  autoRegen: PropTypes.bool.isRequired,
  checkFightCountSwitch: PropTypes.func.isRequired,
  checkAutoRegenSwitch: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  fightCount: state.fightTab.fightCount,
  autoRegen: state.fightTab.autoRegen
});

export default connect(
  mapStateToProps,
  { checkFightCountSwitch, checkAutoRegenSwitch }
)(withStyles(styles)(FightTab));
