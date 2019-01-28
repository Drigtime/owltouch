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
    const { classes, type } = this.props;

    return (
      <form className={classes.root} autoComplete="off">
        <FormControl className={classes.formControl}>
          <Select
            onChange={this.handleChange}
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
  changeMoveType: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  type: state.moveType.type
});

export default connect(
  mapStateToProps,
  { changeMoveType }
)(withStyles(selectStyles)(SelectMoveType));
