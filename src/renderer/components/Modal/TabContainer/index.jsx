import { Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import React from "react";

const styles = theme => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: 8 * 3,
    outline: "none"
  }
});


class TabContainer extends React.Component {
  render() {
    const { children, classes } = this.props;
    return (
      <Typography component="div" className={classes.paper}>
        {children}
      </Typography>
    );
  }
}
TabContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node
};

export default withStyles(styles)(TabContainer);
