import { createStyles } from "@material-ui/core";

export const mapControlStyle = () =>
  createStyles({
    cardContent: {
      "&:last-child": {
        padding: 10
      },
      padding: 10
    }
  });
