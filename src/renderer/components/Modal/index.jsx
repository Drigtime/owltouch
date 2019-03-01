import {
  Dialog,
  DialogActions,
  DialogContent,
  Button
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import React from "react";

const styles = () => ({
  dialog: {
    width: "50%",
    height: "60%"
  },
  dialogContent: {
    padding: "0px 8px 0px 8px",
    "&:first-child": {
      paddingTop: "8px"
    }
  }
});

class SimpleModal extends React.Component {
  render() {
    const { classes, open, onClose, children, actions } = this.props;

    return (
      <Dialog
        classes={{
          paper: classes.dialog
        }}
        open={open}
        onClose={onClose}
      >
        <DialogContent
          classes={{
            root: classes.dialogContent
          }}
        >
          {children}
        </DialogContent>
        <DialogActions>
          {actions.map((action, index) => {
            return (
              <Button key={index} onClick={action.onClick}>
                {action.label}
              </Button>
            );
          })}
        </DialogActions>
      </Dialog>
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
export default withStyles(styles)(SimpleModal);
