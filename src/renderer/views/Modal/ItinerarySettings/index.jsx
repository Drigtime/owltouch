import React from "react";
import PropTypes from "prop-types";
import { AppBar, Tabs, Tab } from "@material-ui/core";
import Modal from "renderer/components/Modal";
import { withStyles } from "@material-ui/core/styles";
import TabContainer from "renderer/components/Modal/TabContainer";
import GatherTab from 'renderer/views/Modal/ItinerarySettings/Gather'
import Fight from 'renderer/views/Modal/ItinerarySettings/Fight'
import Bank from 'renderer/views/Modal/ItinerarySettings/Bank'
import Information from 'renderer/views/Modal/ItinerarySettings/Information'

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  }
});

class ItineraryModal extends React.Component {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes, open, onClose } = this.props;
    const { value } = this.state;
    return (
      <Modal open={open} onClose={onClose}>
        <div className={classes.root}>
          <AppBar position="static">
            <Tabs value={value} onChange={this.handleChange}>
              <Tab label="Gather" />
              <Tab label="Fight" />
              <Tab label="Bank" />
              <Tab label="Inforamtion" />
            </Tabs>
          </AppBar>
          {value === 0 && <TabContainer><GatherTab/></TabContainer>}
          {value === 1 && <TabContainer><Fight/></TabContainer>}
          {value === 2 && <TabContainer><Bank/></TabContainer>}
          {value === 3 && <TabContainer><Information/></TabContainer>}
        </div>
      </Modal>
    );
  }
}

ItineraryModal.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default withStyles(styles)(ItineraryModal);
