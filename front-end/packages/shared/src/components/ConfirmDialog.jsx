import { Check, Close } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

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
      aria-labelledby="confirmation-dialog"
    >
      <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
      <DialogContent sx={{ minWidth: "30vw" }}>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
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
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
