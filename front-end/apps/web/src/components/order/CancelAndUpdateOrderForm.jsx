import { Check, Close, HelpOutline } from "@mui/icons-material";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import { Instruction } from "@ring/ui";
import { useEffect, useState } from "react";
import {
  useCancelUnpaidOrdersMutation,
  useChangePaymentMethodMutation,
} from "../../features/orders/ordersApiSlice";
import { getPaymentType } from "@ring/shared";
import PaymentSelect from "../cart/PaymentSelect";

const cancelOptions = [
  "Muốn thay đổi địa chỉ giao hàng",
  "Muốn nhập/thay đổi mã giảm giá",
  "Muốn đổi sản phẩm trong đơn hàng",
  "Không thể thanh toán lúc này",
  "Tìm thấy sản phẩm rẻ hơn ở chỗ khác",
  "Đổi ý, không muốn mua nữa",
];

const CancelAndUpdateOrderForm = ({
  id,
  paymentMethod,
  pending,
  setPending,
  handleClose,
  isRefund: isUpdate,
}) => {
  const [value, setValue] = useState(
    isUpdate ? paymentMethod : cancelOptions[0]
  );
  const [otherReason, setOtherReason] = useState("");
  const [err, setErr] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [cancel, { isLoading: canceling }] = useCancelUnpaidOrdersMutation();
  const [changePayment, { isLoading: changing }] =
    useChangePaymentMethodMutation();

  useEffect(() => {
    setErr([]);
    setErrMsg("");
    setValue(isUpdate ? paymentMethod : cancelOptions[0]);
    setOtherReason("");
  }, [id, isUpdate]);

  const handleChangeMethod = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = async () => {
    if (canceling || changing || pending) return;
    setPending(true);

    const { enqueueSnackbar } = await import("notistack");

    if (isUpdate) {
      changePayment({ orderId: id, paymentMethod: value })
        .unwrap()
        .then((data) => {
          enqueueSnackbar("Thay đổi hình thức thanh toán thành công!", {
            variant: "success",
          });
          setErr([]);
          setErrMsg("");
          setValue(isUpdate ? paymentMethod : cancelOptions[0]);
          setOtherReason("");
          setPending(false);
          handleClose();
        })
        .catch((err) => {
          enqueueSnackbar("Thay đổi hình thức thanh toán thất bại!", {
            variant: "error",
          });
          setErr(err);
          setErrMsg("Hình thức thanh toán không hợp lệ!");
          setPending(false);
        });
    } else {
      cancel({ orderId: id, reason: value ? value : otherReason })
        .unwrap()
        .then((data) => {
          enqueueSnackbar("Huỷ đơn hàng thành công!", { variant: "success" });
          setErr([]);
          setErrMsg("");
          setValue(isUpdate ? paymentMethod : cancelOptions[0]);
          setOtherReason("");
          setPending(false);
          handleClose();
        })
        .catch((err) => {
          enqueueSnackbar("Huỷ đơn hàng thất bại!", { variant: "error" });
          setErr(err);
          setErrMsg("Lý do không hợp lệ!");
          setPending(false);
        });
    }
  };

  return (
    <>
      <DialogTitle
        id="cancel-dialog-title"
        sx={{ display: "flex", alignItems: "center" }}
      >
        <HelpOutline />
        &nbsp;{isUpdate ? "Chọn lý do hoàn trả" : "Chọn lý do huỷ đơn"}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Instruction
            display={errMsg ? "block" : "none"}
            aria-live="assertive"
          >
            {errMsg}
          </Instruction>
          {isUpdate ? (
            <PaymentSelect
              {...{
                value,
                handleChange: handleChangeMethod,
              }}
            />
          ) : (
            <>
              <RadioGroup
                aria-labelledby="cancel-radio-buttons-group-label"
                name="radio-buttons-group"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              >
                {cancelOptions.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={option}
                    label={option}
                    control={<Radio />}
                  />
                ))}
                <FormControlLabel value="" label="Khác" control={<Radio />} />
              </RadioGroup>
              <TextField
                placeholder="Nhập lý do khác"
                error={err?.data?.errors?.reason}
                helperText={err?.data?.errors?.reason}
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                fullWidth
                size="small"
                multiline
                minRows={3}
                slotProps={{
                  inputComponent: TextareaAutosize,
                  inputProps: {
                    minRows: 3,
                    style: { resize: "auto" },
                  },
                }}
                sx={{ mt: 1 }}
              />
            </>
          )}
        </form>
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
          onClick={handleSubmit}
          startIcon={<Check />}
        >
          Đồng ý
        </Button>
      </DialogActions>
    </>
  );
};

export default CancelAndUpdateOrderForm;
