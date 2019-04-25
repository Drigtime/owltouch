import { Button, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import fs from "fs";
import Language from "owl/configurations/language/LanguageManager.js";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { handleChanges } from "renderer/actions/actions.js";
import SimpleAutoComplete from "renderer/components/AutoComplete/SimpleAutoComplete";

const Items = Object.values(JSON.parse(fs.readFileSync(__static + "/langs/fr/Items.json"))).map(item => ({
  id: item.id,
  iconId: item.iconId,
  label: item.nameId
}));

const styles = () => ({
  root: {
    overflowX: "auto"
  },
  input: {
    width: "100%"
  },
  container: {
    alignItems: "center"
  }
});

class BankItemManager extends Component {
  state = {
    id: 0,
    quant: 0,
    itemName: ""
  };

  handleOnSelect = value => {
    this.setState({ itemName: value });
  };

  handleOnInputChange = event => {
    this.setState({ itemName: event.target.value });
  };

  handleQuantChange = event => {
    this.setState({ quant: event.target.value });
  };

  addItem = type => () => {
    const index = Items.findIndex(index => index.label === this.state.itemName);
    this.createData(Items[index].iconId, Items[index].id, Items[index].label, this.state.quant, this.deleteData, type);
  };

  createData = (icon, id, name, quant, action, type) => {
    this.props.handleChanges(type, [
      ...this.props.items,
      {
        id: this.state.id,
        itemId: id,
        icon: (
          <img
            src={`https://ankama.akamaized.net/games/dofus-tablette/assets/2.22.1/gfx/items/${icon}.png`}
            style={{ height: "46px" }}
          />
        ),
        name,
        quant,
        action: (
          <Button id={this.state.id} onClick={action(type)}>
            Delete
          </Button>
        )
      }
    ]);
    this.setState({ id: this.state.id + 1 });
  };

  deleteData = type => event => {
    const index = this.props.items.findIndex(index => index.id === Number(event.currentTarget.id));
    const tmpRows = this.props.items;
    tmpRows.splice(index, 1);
    this.props.handleChanges(type, tmpRows);
    this.forceUpdate();
  };

  render() {
    const { classes, suggestionsType, items, type } = this.props;
    return (
      <Grid container={true} spacing={24} className={classes.container}>
        <Grid item={true} xs={6}>
          <SimpleAutoComplete
            suggestions={Items}
            label={Language.trans("BankTabTakeItemAutoCompleteLabel")}
            placeholder={Language.trans("BankTabItemManagerAutoCompletePlaceHolder")}
            type={suggestionsType}
            onSelect={this.handleOnSelect}
            onInputChange={this.handleOnInputChange}
          />
        </Grid>
        <Grid item={true} xs={3}>
          <TextField
            label={Language.trans("BankTabItemManagerQuant")}
            id="nb-item-regen"
            type="number"
            onChange={this.handleQuantChange}
            className={classes.input}
            value={this.state.quant}
            inputProps={{
              min: 0
            }}
          />
        </Grid>
        <Grid item={true} xs={3}>
          <Button variant="contained" onClick={this.addItem(type)}>
            {Language.trans("BankTabItemManagerAddButton")}
          </Button>
        </Grid>
        <Grid item={true} xs={12}>
          <Paper className={classes.root}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" />
                  <TableCell align="left">{Language.trans("BankTabItemManagerName")}</TableCell>
                  <TableCell align="right">{Language.trans("BankTabItemManagerQuant")}</TableCell>
                  <TableCell align="center">{Language.trans("BankTabItemManagerAction")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map(row => (
                  <TableRow key={row.id}>
                    <TableCell padding="none" align="center">
                      {row.icon}
                    </TableCell>
                    <TableCell padding="none" align="left">
                      {row.name}
                    </TableCell>
                    <TableCell padding="none" align="right">
                      {row.quant}
                    </TableCell>
                    <TableCell padding="none" align="center">
                      {row.action}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

BankItemManager.propTypes = {
  classes: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  suggestionsType: PropTypes.string.isRequired,
  handleChanges: PropTypes.func.isRequired
  // type: PropTypes.string.isRequired
};

export default connect(
  null,
  { handleChanges }
)(withStyles(styles)(BankItemManager));
