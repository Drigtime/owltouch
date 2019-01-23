import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
  FormControl,
  FormControlLabel,
  Switch
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import React, { Component } from "react";
import AutoComplete from "renderer/components/Modal/AutoComplete";

const Items = Object.values(require(__static + "/i18n/fr/Items.json")).map(
  item => ({
    value: item.iconId,
    label: item.nameId
  })
);

const styles = theme => ({
  root: {
    width: "100%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
  expansionPanelDetails : {
    display: "block"
  }
});

class FightTab extends Component {
  state = {
    fightCount: true,
    autoRegen: true
  };

  handleSwitchChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <FormControl style={{ width: "100%" }}>
          <FormControlLabel
            control={
              <Switch
                checked={this.state.fightCount}
                onChange={this.handleSwitchChange("fightCount")}
                value="fightCount"
              />
            }
            label="fight count"
          />
        </FormControl>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMore />}>
            <Typography className={classes.heading}>Auto regen</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.expansionPanelDetails}>
            <FormControl style={{ width: "100%" }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.autoRegen}
                    onChange={this.handleSwitchChange("autoRegen")}
                    value="autoRegen"
                  />
                }
                label="auto regen"
              />
            </FormControl>
            <AutoComplete
              suggestions={Items}
              label="Item to regen"
              placeholder="ex : Pain au Blé Complet"
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

FightTab.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FightTab);
