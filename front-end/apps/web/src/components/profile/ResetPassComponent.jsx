import { useEffect, useState } from "react";
import { Box, Stack, Button, DialogContent } from "@mui/material";
import { Check, KeyboardArrowLeft, Password } from "@mui/icons-material";
import { useChangePasswordMutation } from "../../features/users/usersApiSlice";
import { Link } from "react-router";
import { StyledDialogTitle } from "../custom/ProfileComponents";
import { Instruction } from "@ring/ui/Components";
import PasswordInput from "@ring/ui/PasswordInput";
import PasswordEvaluate from "../custom/PasswordEvaluate";

const ResetPassComponent = ({ pending, setPending }) => {
  const [err, setErr] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [pass, setPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newPassRe, setNewPassRe] = useState("");
  const [validNewPass, setValidNewPass] = useState(true);
  const [validNewPassRe, setValidNewPassRe] = useState(true);
  const [newPassFocus, setNewPassFocus] = useState(false);

  //Change pass hook
  const [changePass, { isLoading: changing }] = useChangePasswordMutation();

  //Submit change pass mutation
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pending || changing) return;

    if (!validPass) {
      setErrMsg("Sai định dạng thông tin!");
      return;
    }

    if (!newPass || !newPassRe) {
      setErrMsg("Không được bỏ trống mật khẩu mới!");
      setValidNewPass(false);
      setValidNewPassRe(false);
      return;
    }

    if (newPass !== newPassRe) {
      setErrMsg("Không trùng mật khẩu!");
      setValidNewPass(false);
      setValidNewPassRe(false);
      return;
    }

    setPending(true);
    const { enqueueSnackbar } = await import("notistack");

    changePass({
      pass,
      newPass,
      newPassRe,
    })
      .unwrap()
      .then((data) => {
        setErr([]);
        setErrMsg("");
        setPass("");
        setNewPass("");
        setNewPassRe("");

        //Queue snack
        enqueueSnackbar("Đổi mật khẩu thành công!", { variant: "success" });
        setPending(false);
      })
      .catch((err) => {
        console.error(err);
        setErr(err);
        if (!err?.status) {
          setErrMsg("Server không phản hồi");
        } else if (err?.status === 409) {
          setErrMsg(err?.data?.message);
        } else if (err?.status === 400) {
          setErrMsg("Sai định dạng thông tin!");
        } else {
          setErrMsg("Cập nhật hồ sơ thất bại");
        }
        setPending(false);
      });
  };

  //Validation
  useEffect(() => {
    const match = newPass === newPassRe;
    setValidNewPassRe(match);
  }, [newPassRe]);

  useEffect(() => {
    setErrMsg("");
  }, [newPass, newPassRe, pass]);

  const validReset = [
    pass,
    newPass,
    newPassRe,
    validNewPass,
    validNewPassRe,
  ].every(Boolean);

  return (
    <div>
      <StyledDialogTitle>
        <Link to={-1}>
          <KeyboardArrowLeft />
        </Link>
        <Password />
        &nbsp;Thay đổi mật khẩu
      </StyledDialogTitle>
      <DialogContent sx={{ p: { xs: 1, sm: 2, md: 0 }, mt: { xs: 1, md: 0 } }}>
        <Instruction display={errMsg ? "block" : "none"} aria-live="assertive">
          {errMsg}
        </Instruction>
        <form onSubmit={handleChangePassword}>
          <Stack
            mt={2}
            spacing={1.5}
            direction="column"
            minHeight={"70dvh"}
            maxWidth={{ xs: "100%", md: 380 }}
          >
            <PasswordInput
              label="Nhập mật khẩu hiện tại"
              onChange={(e) => setPass(e.target.value)}
              value={pass}
              error={err?.data?.errors?.password}
              helperText={err?.data?.errors?.password}
              size="small"
            />
            <PasswordInput
              label="Nhập mật khẩu mới"
              onChange={(e) => setNewPass(e.target.value)}
              value={newPass}
              aria-invalid={validNewPass ? "false" : "true"}
              onFocus={() => setNewPassFocus(true)}
              onBlur={() => setNewPassFocus(false)}
              error={(newPass && !validNewPass) || err?.data?.errors?.newPass}
              helperText={
                newPassFocus && newPass && !validNewPass
                  ? "8 đến 24 kí tự. Bao gồm chữ in hoa và ký tự đặc biệt."
                  : err?.data?.errors?.newPass
              }
              size="small"
            />
            <PasswordInput
              label="Nhập lại mật khẩu mới"
              onChange={(e) => setNewPassRe(e.target.value)}
              value={newPassRe}
              aria-invalid={validNewPassRe ? "false" : "true"}
              error={
                (newPassRe && !validNewPassRe) || err?.data?.errors?.newPassRe
              }
              helperText={
                newPassRe && !validNewPassRe
                  ? "Không trùng mật khẩu."
                  : err?.data?.errors?.newPassRe
              }
              size="small"
            />
            <PasswordEvaluate
              {...{
                password: newPass,
                onValid: (value) => setValidNewPass(value),
              }}
            />
            <Box>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleChangePassword}
                disabled={!validReset || pending || changing}
                startIcon={<Check />}
              >
                Xác nhận
              </Button>
            </Box>
          </Stack>
        </form>
      </DialogContent>
    </div>
  );
};

export default ResetPassComponent;
