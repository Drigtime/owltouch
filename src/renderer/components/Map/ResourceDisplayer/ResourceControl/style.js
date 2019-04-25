import { createStyles } from "@material-ui/core";

const mapControlStyle = () =>
  createStyles({
    cardContent: {
      "&:last-child": {
        padding: 2
      },
      padding: 2,
      height: "100%"
    },
    toggleButtonGroup: {
      height: "100%"
    },
    toggleButton: {
      padding: "5px 5px",
      height: "100%",
      minWidth: "35px",
      width: "35px"
    },
    jobButton: {
      minWidth: "35px",
      // height: "100%",
      width: "35px"
    },
    resourceContainer: {
      display: "none"
    },
    resourceContainerToggled: {
      // height: "100%"
    },
    resourceDivContainer: {
      height: "40px",
      display: "inline-flex"
    }
  });

export default mapControlStyle;
