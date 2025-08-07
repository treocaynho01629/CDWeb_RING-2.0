import Close from "@mui/icons-material/Close";
import Check from "@mui/icons-material/Check";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const ConfirmDialog = ({
  open,
  title,
  message,
  handleConfirm,
  handleCancel,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      closeAfterTransition={false}
      aria-labelledby="confirmation-dialog"
    >
      <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
      <DialogContent sx={{ minWidth: "30vw" }}>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {handleCancel && (
          <Button
            variant="outlined"
            color="error"
            size="large"
            autoFocus
            sx={{ mb: 1 }}
            onClick={handleCancel}
            startIcon={<Close />}
          >
            Huỷ
          </Button>
        )}
        {handleConfirm && (
          <Button
            variant="contained"
            size="large"
            autoFocus
            sx={{ mb: 1 }}
            onClick={handleConfirm}
            startIcon={<Check />}
          >
            Đồng ý
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
