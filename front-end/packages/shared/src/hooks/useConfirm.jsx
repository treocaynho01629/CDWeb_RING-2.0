import { useState } from "react";
import ConfirmDialog from "../components/ConfirmDialog";

const useConfirm = (title, message) => {
  const [promise, setPromise] = useState(null);

  const confirm = () =>
    new Promise((resolve, reject) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmationDialog = () => (
    <ConfirmDialog
      {...{
        open: promise !== null,
        title,
        message,
        handleConfirm,
        handleCancel,
      }}
    />
  );
  return [ConfirmationDialog, confirm];
};

export default useConfirm;
