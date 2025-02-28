import { Check, Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";
import styled from "@emotion/styled";

const StyledInput = styled(TextField)`
  width: 60px;

  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
    opacity: 1;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }
`;

const JumpPagination = ({ pagination, onPageChange, open, handleClose }) => {
  const [page, setPage] = useState(pagination?.number ?? 1);

  const handleChange = (value) => {
    let newValue = value;
    if (newValue < 1) newValue = 1;
    if (newValue > pagination?.totalPages) newValue = pagination?.totalPages;
    setPage(newValue);
  };

  const handleConfirm = () => {
    if (onPageChange) onPageChange(page);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="pagination-dialog"
    >
      <DialogTitle id="pagination-dialog-title">Đi đến trang?</DialogTitle>
      <DialogContent>
        <Box display="flex" justifyContent="center">
          <StyledInput
            required
            id="page"
            variant="outlined"
            type="number"
            value={page}
            onChange={(e) => handleChange(e.target.value)}
            slotProps={{
              input: {
                min: 1,
                max: pagination?.totalPages,
                type: "number",
                style: { textAlign: "center" },
              },
              htmlInput: {
                min: 1,
                max: pagination?.totalPages,
                type: "number",
                style: { textAlign: "center" },
              },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="error"
          size="large"
          autoFocus
          sx={{ mb: 1 }}
          onClick={handleClose}
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

export default JumpPagination;
