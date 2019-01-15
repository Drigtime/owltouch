import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import React from "react";
import { selectStyles } from "renderer/components/ToolBar/SelectMovementType/type";

class SelectMovementType extends React.Component {
  state = {
    movementType: "top"
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { classes } = this.props;

    return (
      <form className={classes.root} autoComplete="off">
        <FormControl className={classes.formControl}>
          <Select
            onChange={this.handleChange}
            value={this.state.movementType}
            inputProps={{
              id: "movement-type",
              name: "movementType"
            }}
          >
            <MenuItem value={"top"}>Top</MenuItem>
            <MenuItem value={"bottom"}>Bottom</MenuItem>
            <MenuItem value={"left"}>Left</MenuItem>
            <MenuItem value={"right"}>Right</MenuItem>
          </Select>
        </FormControl>
      </form>
    );
  }
}

SelectMovementType.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(selectStyles)(SelectMovementType);
