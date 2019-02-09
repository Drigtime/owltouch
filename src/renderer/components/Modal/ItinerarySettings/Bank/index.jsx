import { InputAdornment, TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import React, { Component } from "react";
import Slider from "@material-ui/lab/Slider";

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
        <Slider
          classes={{ container: classes.slider }}
          value={podMax}
          min={0}
          max={100}
          step={1}
          onChange={this.handleSliderChange}
        />
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
      </div>
    );
  }
}

BankTab.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(style)(BankTab);
