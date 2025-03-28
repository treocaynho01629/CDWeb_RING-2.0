import { SnackbarProvider as NotistackProvider } from "notistack";
import { makeStyles } from "@mui/styles";
import Snackbar from "../components/Snackbar";

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down("sm")]: {
      bottom: -4,
      left: 0,
      maxWidth: "100%",
    },
  },
}));

const SnackbarProvider = ({ children }) => {
  const classes = useStyles();

  return (
    <NotistackProvider
      maxSnack={3}
      autoHideDuration={1500}
      dense
      classes={{
        containerRoot: classes.root,
      }}
      Components={{
        default: Snackbar,
        success: Snackbar,
        error: Snackbar,
        warning: Snackbar,
        info: Snackbar,
      }}
    >
      {children}
    </NotistackProvider>
  );
};

export default SnackbarProvider;
