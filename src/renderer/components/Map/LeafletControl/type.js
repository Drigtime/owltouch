import { createStyles } from "@material-ui/core";

export const mapControlStyle = () =>
  createStyles({
    cardContent: {
      "&:last-child": {
        padding: 15
      },
      padding: 15
    }
  });
