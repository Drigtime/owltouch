import {
  Dialog,
  DialogActions,
  DialogContent,
  Button
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import React from "react";

const MuiDialog = withStyles(() => ({
  paper: {
    width: "50%",
    height: "60%"
  }
}))(Dialog);

const MuiDialogContent = withStyles(() => ({
  root: {
    padding: "0px 8px 0px 8px"
  },
  rootFirstChild: {
    paddingTop: "8px"
  }
}))(DialogContent);

class SimpleModal extends React.Component {
  render() {
    const { open, onClose, children, actions } = this.props;

    return (
      <MuiDialog open={open} onClose={onClose}>
        <MuiDialogContent>{children}</MuiDialogContent>
        <DialogActions>
          {actions.map((action, index) => {
            return (
              <Button key={index} onClick={action.onClick}>
                {action.label}
              </Button>
            );
          })}
        </DialogActions>
      </MuiDialog>
    );
  }
}

SimpleModal.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  actions: PropTypes.array.isRequired
};

// We need an intermediary variable for handling the recursive nesting.
export default SimpleModal;
