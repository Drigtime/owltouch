import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import React from "react";
import { selectStyles } from "renderer/components/ToolBar/SelectMoveType/type";
import { connect } from "react-redux";
import { changeMoveType } from "renderer/actions/moveTypeAction";

class SelectMoveType extends React.Component {
  handleChange = event => {
    this.props.changeMoveType(event.target.value)
  };

  render() {
    const { classes } = this.props;

    return (
      <form className={classes.root} autoComplete="off">
        <FormControl className={classes.formControl}>
          <Select
            onChange={this.handleChange}
            value={this.props.moveType}
            inputProps={{
              id: "move-type",
              name: "moveType"
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

SelectMoveType.propTypes = {
  classes: PropTypes.object.isRequired,
  changeMoveType: PropTypes.func.isRequired,
  moveType: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  moveType: state.moveType.moveType
});

export default connect(
  mapStateToProps,
  { changeMoveType }
)(withStyles(selectStyles)(SelectMoveType));
