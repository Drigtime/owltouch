import { createStyles } from "@material-ui/core";

const mapControlStyle = () =>
  createStyles({
    cardContent: {
      "&:last-child": {
        padding: 2
      },
      padding: 2
    },
    button: {
      padding: "5px 5px",
      minWidth: "32px"
    },
    resourceContainer: {
      display: "none"
    },
    resourceContainerToggled: {
      height: "35px",
      display: "inline-flex"
    },
    resourceDivContainer: {
      display: "inline-flex"
    }
  });

export default mapControlStyle;
