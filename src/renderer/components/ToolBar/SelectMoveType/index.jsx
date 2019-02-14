import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import React from "react";
import { selectStyles } from "renderer/components/ToolBar/SelectMoveType/type";
import { connect } from "react-redux";
import { handleChanges } from "renderer/actions/actions.js";
import { MOVEMENT_TYPE } from "renderer/actions/types.js";

class SelectMoveType extends React.Component {
  handleSelectChanges = type => event => {
    this.props.handleChanges(type, event.target.value);
  };

  render() {
    const { classes, type } = this.props;

    return (
      <form className={classes.root} autoComplete="off">
        <FormControl className={classes.formControl}>
          <Select
            onChange={this.handleSelectChanges(MOVEMENT_TYPE)}
            value={type}
            inputProps={{
              id: "move-type",
              name: "type"
            }}
          >
            <MenuItem value={"move"}>Move</MenuItem>
            <MenuItem value={"gather"}>Gather</MenuItem>
            <MenuItem value={"fight"}>Fight</MenuItem>
            <MenuItem value={"gatherfight"}>Gather & Figher</MenuItem>
            <MenuItem value={"bank"}>Bank</MenuItem>
            <MenuItem value={"phoenix"}>Phoenix</MenuItem>
          </Select>
        </FormControl>
      </form>
    );
  }
}

SelectMoveType.propTypes = {
  classes: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  handleChanges: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  type: state.moveType.type
});

export default connect(
  mapStateToProps,
  { handleChanges }
)(withStyles(selectStyles)(SelectMoveType));
