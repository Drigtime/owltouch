import { createStyles } from "@material-ui/core";
import amber from "@material-ui/core/colors/amber";
import grey from "@material-ui/core/colors/grey";
import { createMuiTheme } from "@material-ui/core/styles";

export const mainTheme = createMuiTheme({
  palette: {
    primary: {
      main: grey[900]
    },
    secondary: amber,
    type: "dark"
  },
  typography: {
    fontFamily: ["Roboto", '"Segoe UI"', "Tahoma", "sans-serif"].join(","),
    useNextVariants: true
  }
});

export const mainStyles = theme =>
  createStyles({
    paper: {
      color: theme.palette.text.secondary,
      margin: theme.spacing.unit,
      marginTop: 120,
      padding: theme.spacing.unit * 2,
      textAlign: "center"
    },
    root: {
      flexGrow: 1,
      paddingBottom: 28
    }
  });
