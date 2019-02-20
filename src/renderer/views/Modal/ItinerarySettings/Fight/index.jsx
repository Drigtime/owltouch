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
import keycode from "keycode";
import React, { Component } from "react";
import { connect } from "react-redux";
import { handleChanges } from "renderer/actions/actions.js";
import {
  AUTO_REGEN,
  FIGHT_COUNT,
  MAX_FIGHT_NUMBER_PER_MAP,
  MAX_FIGHT_PER_MAP,
  MAX_MONSTER,
  FORBIDDEN_MONSTER,
  MANDATORY_MONSTER,
  MAX_MONSTER_LEVEL,
  MAX_REGEN,
  MIN_MONSTER,
  MIN_MONSTER_LEVEL,
  MIN_REGEN,
  REGEN_ITEM,
  REGEN_ITEM_QUANT
} from "renderer/actions/types";
import AutoComplete from "renderer/components/AutoComplete";
import styles from "renderer/views/Modal/ItinerarySettings/Fight/styles.js";
import { MONSTERS, ITEMS } from "renderer/components/AutoComplete/types";

const Items = Object.values(require(__static + "/langs/fr/Items.json")).map(
  item => ({
    id: item.id,
    iconId: item.iconId,
    label: item.nameId
  })
);

const Monsters = Object.values(
  require(__static + "/langs/fr/Monsters.json")
).map(monster => ({
  id: monster.id,
  iconId: monster.id,
  label: monster.nameId
}));

class FightTab extends Component {
  state = {
    regenItemsInputValue: "",
    mandatoryMonstersInputValue: "",
    forbiddenMonstersInputValue: ""
  };

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
      fightCount,
      autoRegen,
      maxFightPerMap,
      maxFightNumberPerMap,
      minRegen,
      maxRegen,
      regenItem,
      regenItemQuant,
      minMonsterLevel,
      maxMonsterLevel,
      minMonster,
      maxMonster,
      forbiddenMonster,
      mandatoryMonster
    } = this.props;
    return (
      <div className={classes.root}>
        <Grid container={true} spacing={24}>
          <Grid item={true} xs={3}>
            <FormControl style={{ width: "100%" }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={fightCount}
                    onChange={this.handleSwitchChanges(FIGHT_COUNT)}
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
                    onChange={this.handleSwitchChanges(AUTO_REGEN)}
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
                    checked={maxFightPerMap}
                    onChange={this.handleSwitchChanges(MAX_FIGHT_PER_MAP)}
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
              onChange={this.handleInputChanges(MAX_FIGHT_NUMBER_PER_MAP)}
              className={classes.input}
              disabled={!maxFightPerMap}
              value={maxFightNumberPerMap}
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
                      onChange={this.handleInputWithLimitChanges(
                        MIN_REGEN,
                        100
                      )}
                      value={minRegen}
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
                      onChange={this.handleInputWithLimitChanges(
                        MAX_REGEN,
                        100
                      )}
                      value={maxRegen}
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
                      type={ITEMS}
                      selectedItem={regenItem}
                      onChange={this.handleAutoCompleteChange(
                        REGEN_ITEM,
                        regenItem,
                        "regenItemsInputValue"
                      )}
                      inputValue={this.state.regenItemsInputValue}
                      handleDelete={this.handleAutoCompleteDelete(
                        REGEN_ITEM,
                        regenItem
                      )}
                      handleInputChange={this.handleAutoCompleteInputChange(
                        "regenItemsInputValue"
                      )}
                      handleKeyDown={this.handleAutoCompleteKeyDown(
                        REGEN_ITEM,
                        regenItem,
                        "regenItemsInputValue"
                      )}
                    />
                  </Grid>
                  <Grid item={true} xs={2}>
                    <TextField
                      label="number of item to take from the bank"
                      id="nb-item-regen"
                      type="number"
                      onChange={this.handleInputChanges(REGEN_ITEM_QUANT)}
                      className={classes.input}
                      value={regenItemQuant}
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
              onChange={this.handleInputChanges(MIN_MONSTER_LEVEL)}
              value={minMonsterLevel}
              className={classes.input}
              InputLabelProps={{
                shrink: true
              }}
              inputProps={{
                min: 1
              }}
            />
          </Grid>
          <Grid item={true} xs={6}>
            <TextField
              label="max monster level"
              id="max-monster-lvl"
              type="number"
              onChange={this.handleInputChanges(MAX_MONSTER_LEVEL)}
              value={maxMonsterLevel}
              className={classes.input}
              InputLabelProps={{
                shrink: true
              }}
              inputProps={{
                min: 1
              }}
            />
          </Grid>
          <Grid item={true} xs={6}>
            <TextField
              label="min monster number"
              id="min-monster-number"
              type="number"
              onChange={this.handleInputWithLimitChanges(MIN_MONSTER, 8)}
              value={minMonster}
              className={classes.input}
              InputLabelProps={{
                shrink: true
              }}
              inputProps={{
                min: 1,
                max: 8
              }}
            />
          </Grid>
          <Grid item={true} xs={6}>
            <TextField
              label="max monster number"
              id="max-monster-number"
              type="number"
              onChange={this.handleInputWithLimitChanges(MAX_MONSTER, 8)}
              value={maxMonster}
              className={classes.input}
              InputLabelProps={{
                shrink: true
              }}
              inputProps={{
                min: 1,
                max: 8
              }}
            />
          </Grid>
          <Grid item={true} xs={12}>
            <AutoComplete
              suggestions={Monsters}
              label="Forbidden monster"
              placeholder="ex : Piou bleu"
              type={MONSTERS}
              selectedItem={forbiddenMonster}
              onChange={this.handleAutoCompleteChange(
                FORBIDDEN_MONSTER,
                forbiddenMonster,
                "forbiddenMonstersInputValue"
              )}
              inputValue={this.state.forbiddenMonstersInputValue}
              handleDelete={this.handleAutoCompleteDelete(
                FORBIDDEN_MONSTER,
                forbiddenMonster
              )}
              handleInputChange={this.handleAutoCompleteInputChange(
                "forbiddenMonstersInputValue"
              )}
              handleKeyDown={this.handleAutoCompleteKeyDown(
                FORBIDDEN_MONSTER,
                forbiddenMonster,
                "forbiddenMonstersInputValue"
              )}
            />
          </Grid>
          <Grid item={true} xs={12}>
            <AutoComplete
              suggestions={Monsters}
              label="Mandatory monster"
              placeholder="ex : Piou bleu"
              type={MONSTERS}
              selectedItem={mandatoryMonster}
              onChange={this.handleAutoCompleteChange(
                MANDATORY_MONSTER,
                mandatoryMonster,
                "mandatoryMonstersInputValue"
              )}
              inputValue={this.state.mandatoryMonstersInputValue}
              handleDelete={this.handleAutoCompleteDelete(
                MANDATORY_MONSTER,
                mandatoryMonster
              )}
              handleInputChange={this.handleAutoCompleteInputChange(
                "mandatoryMonstersInputValue"
              )}
              handleKeyDown={this.handleAutoCompleteKeyDown(
                MANDATORY_MONSTER,
                mandatoryMonster,
                "mandatoryMonstersInputValue"
              )}
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
  maxFightPerMap: PropTypes.bool.isRequired,
  maxFightNumberPerMap: PropTypes.number.isRequired,
  minRegen: PropTypes.number.isRequired,
  maxRegen: PropTypes.number.isRequired,
  regenItem: PropTypes.array.isRequired,
  regenItemQuant: PropTypes.number.isRequired,
  minMonsterLevel: PropTypes.number.isRequired,
  maxMonsterLevel: PropTypes.number.isRequired,
  minMonster: PropTypes.number.isRequired,
  maxMonster: PropTypes.number.isRequired,
  forbiddenMonster: PropTypes.array.isRequired,
  mandatoryMonster: PropTypes.array.isRequired,
  handleChanges: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  fightCount: state.fightTab.fightCount,
  autoRegen: state.fightTab.autoRegen,
  maxFightPerMap: state.fightTab.maxFightPerMap,
  maxFightNumberPerMap: state.fightTab.maxFightNumberPerMap,
  minRegen: state.fightTab.minRegen,
  maxRegen: state.fightTab.maxRegen,
  regenItem: state.fightTab.regenItem,
  regenItemQuant: state.fightTab.regenItemQuant,
  minMonsterLevel: state.fightTab.minMonsterLevel,
  maxMonsterLevel: state.fightTab.maxMonsterLevel,
  minMonster: state.fightTab.minMonster,
  maxMonster: state.fightTab.maxMonster,
  forbiddenMonster: state.fightTab.forbiddenMonster,
  mandatoryMonster: state.fightTab.mandatoryMonster
});

export default connect(
  mapStateToProps,
  { handleChanges }
)(withStyles(styles)(FightTab));
