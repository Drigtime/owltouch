import { createStyles } from "@material-ui/core";

export const selectStyles = theme =>
  createStyles({
    formControl: {
      margin: theme.spacing.unit,
      minWidth: 120
    },
    root: {
      display: "flex",
      flexWrap: "wrap"
    }
  });
