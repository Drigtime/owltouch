import { createStyles } from "@material-ui/core";

export const toolBarStyles = theme =>
  createStyles({
    formControl: { margin: theme.spacing.unit },
    grow: {
      flexGrow: 1
    },
    menuButton: {
      // marginLeft: -12,
      // marginRight: 20
    },
    root: {
      flexGrow: 1
    }
  });
