import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, FormControl, FormControlLabel, Grid, InputAdornment, Switch, TextField, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { ExpandMore } from "@material-ui/icons";
import Slider from "@material-ui/lab/Slider";
import PropTypes from "prop-types";
import React, { Component } from "react";
import AutoComplete from "renderer/components/AutoComplete";

const Items = Object.values(require(__static + "/i18n/fr/Items.json")).map(
  item => ({
    value: item.iconId,
    label: item.nameId
  })
);

const style = () => ({});

class BankTab extends Component {
  state = {
    putKamas: true,
    getKamas: true,
    podMax: 80
  };

  handleSwitchChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleSliderChange = (event, podMax) => {
    this.setState({ podMax });
  };

  handleInputChange = event => {
    this.setState({
      podMax: event.target.value > 100 ? 100 : event.target.value
    });
  };

  render() {
    const { classes } = this.props;
    const { podMax } = this.state;

    return (
      <div className={classes.root}>
        <Grid container={true} spacing={24}>
          <Grid
            item={true}
            xs={10}
            style={{ display: "flex", "align-items": "center" }}
          >
            <Slider
              classes={{ container: classes.slider }}
              value={podMax}
              min={0}
              max={100}
              step={1}
              onChange={this.handleSliderChange}
            />
          </Grid>
          <Grid item={true} xs={2}>
            <TextField
              label="max regen"
              id="max-regen"
              type="number"
              value={podMax}
              onChange={this.handleInputChange}
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
                    checked={true}
                    // onChange={this.handleAutoRegenSwitchChange}
                    // value="maxFight"
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
              // className={classes.input}
              //
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
                    checked={true}
                    // onChange={this.handleAutoRegenSwitchChange}
                    // value="maxFight"
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
              // className={classes.input}
              //
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
                <Typography>item to get from the bank</Typography>
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
                <Typography>item to put in the bank</Typography>
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
  classes: PropTypes.object.isRequired
};

export default withStyles(style)(BankTab);
