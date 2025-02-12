import { Alert } from "@mui/material";
import { SnackbarContent, useSnackbar } from "notistack";
import { forwardRef, useCallback } from "react";

const Snackbar = forwardRef(({ id, ...props }, ref) => {
  const { closeSnackbar } = useSnackbar();

  const handleCloseSnackbar = useCallback(() => {
    closeSnackbar(id);
  }, [id, closeSnackbar]);

  return (
    <SnackbarContent
      ref={ref}
      style={{ width: "100%", backgroundColor: "red" }}
    >
      <Alert
        onClose={handleCloseSnackbar}
        severity={props.variant ?? "success"}
        variant="filled"
        sx={{ width: "100%", color: "white" }}
      >
        {props.message}
      </Alert>
    </SnackbarContent>
  );
});

export default Snackbar;
