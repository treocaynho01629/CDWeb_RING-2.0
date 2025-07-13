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
import { useEffect } from "react";

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
  const [page, setPage] = useState(pagination?.number + 1);

  useEffect(() => {
    setPage(pagination?.number + 1);
  }, [pagination]);

  const handleChange = (value) => {
    let newValue = value;
    if (newValue > pagination?.totalPages) newValue = pagination?.totalPages;
    setPage(newValue);
  };

  const handleBlur = () => {
    if (page < 1) setPage(1);
    if (page > pagination?.totalPages) setPage(pagination?.totalPages);
  };

  const handleConfirm = () => {
    if (onPageChange) onPageChange(page);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      closeAfterTransition={false}
      aria-labelledby="pagination-dialog"
    >
      <DialogTitle id="pagination-dialog-title">Đi đến trang?</DialogTitle>
      <DialogContent>
        <Box display="flex" justifyContent="center" minWidth={220}>
          <StyledInput
            required
            id="page"
            variant="outlined"
            type="number"
            value={page}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
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
          fullWidth
          sx={{ mb: 1 }}
          onClick={handleClose}
          startIcon={<Close />}
        >
          Huỷ
        </Button>
        <Button
          variant="contained"
          size="large"
          fullWidth
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
