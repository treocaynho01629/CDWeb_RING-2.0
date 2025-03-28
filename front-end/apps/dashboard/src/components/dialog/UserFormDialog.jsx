import { useEffect, useState } from "react";
import { Button, useMediaQuery } from "@mui/material";
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2 as Grid,
  MenuItem,
} from "@mui/material";
import {
  Check,
  Close as CloseIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { Instruction, DatePicker, PasswordInput } from "@ring/ui";
import { PatternFormat } from "react-number-format";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from "../../features/users/usersApiSlice";
import { genderTypeItems, roleTypeItems } from "@ring/shared/user";
import { EMAIL_REGEX, PHONE_REGEX } from "@ring/shared/regex";
import dayjs from "dayjs";
import ImageSelect from "../custom/ImageSelect";

const UserFormDialog = ({ open, handleClose, user, pending, setPending }) => {
  //#region construct
  const fullScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [file, setFile] = useState([]);
  const [pic, setPic] = useState(user?.image || null);
  const [username, setUserName] = useState(user?.username || "");
  const [pass, setPass] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [dob, setDob] = useState(
    user?.dob ? dayjs(user?.dob) : dayjs("1970-01-01")
  );
  const [roles, setRoles] = useState(roleTypeItems[0].value);
  const [gender, setGender] = useState(genderTypeItems[0].value);
  const [err, setErr] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [validPhone, setValidPhone] = useState(false);
  const [validEmail, setValidEmail] = useState(false);

  const [createUser, { isLoading: creating }] = useCreateUserMutation();
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();

  useEffect(() => {
    if (user) {
      setPic(user?.image || null);
      setUserName(user?.username);
      setEmail(user?.email);
      setRoles(user?.roles);
      setName(user?.name || "");
      setPhone(user?.phone || "");
      setGender(user?.gender || "");
      setDob(dayjs(user?.dob));
      setErr([]);
      setErrMsg("");
    } else {
      clearInput();
    }
  }, [user]);

  useEffect(() => {
    const result = PHONE_REGEX.test(phone);
    setValidPhone(result);
  }, [phone]);

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    setValidEmail(result);
  }, [email]);

  const clearInput = () => {
    setPic("");
    setUserName("");
    setPass("");
    setEmail("");
    setName("");
    setPhone("");
    setRoles(roleTypeItems[0].value);
    setGender(genderTypeItems[0].value);
    setDob(dayjs("2001-01-01"));
    setErr([]);
    setErrMsg("");
  };

  const handleCloseDialog = () => {
    setFile([]);
    handleClose();
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setFile([]);
    if (pic == user?.image) {
      setPic(null);
    } else {
      setPic(user?.image);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (creating || updating || pending) return;

    setPending(true);
    const { enqueueSnackbar } = await import("notistack");

    //Set data
    const formData = new FormData();
    const json = JSON.stringify({
      username,
      email,
      roles,
      pass: pass || null,
      name: name || null,
      phone: phone || null,
      gender: gender || null,
      dob: dob.format("YYYY-MM-DD"),
      image: file ? null : pic,
      keepOldPass: user && !pass ? true : false,
    });
    const blob = new Blob([json], { type: "application/json" });

    formData.append("request", blob);
    if (file?.length) formData.append("image", file[0]);

    if (user) {
      //Update
      updateUser({ id: user?.id, updatedUser: formData })
        .unwrap()
        .then((data) => {
          setErrMsg("");
          setErr([]);
          enqueueSnackbar("Chỉnh sửa thành viên thành công!", {
            variant: "success",
          });
          setPending(false);
          handleCloseDialog();
        })
        .catch((err) => {
          console.error(err);
          setErr(err);
          if (!err?.status) {
            setErrMsg("Server không phản hồi");
          } else if (err?.status === 409) {
            setErrMsg(err?.data?.message);
          } else if (err?.status === 403) {
            setErrMsg("Chưa có ảnh kèm theo!");
          } else if (err?.status === 400) {
            setErrMsg("Sai định dạng thông tin!");
          } else if (err?.status === 417) {
            setErrMsg("File ảnh quá lớn (Tối đa 2MB)!");
          } else {
            setErrMsg("Chỉnh sửa thành vien thất bại!");
          }
          enqueueSnackbar("Chỉnh sửa thành viên thất bại!", {
            variant: "error",
          });
          setPending(false);
        });
    } else {
      //Create
      createUser(formData)
        .unwrap()
        .then((data) => {
          clearInput();
          setErrMsg("");
          setErr([]);
          enqueueSnackbar("Thêm thành viên thành công!", {
            variant: "success",
          });
          setPending(false);
        })
        .catch((err) => {
          console.error(err);
          setErr(err);
          if (!err?.status) {
            setErrMsg("Server không phản hồi");
          } else if (err?.status === 409) {
            setErrMsg(err?.data?.message);
          } else if (err?.status === 403) {
            setErrMsg("Chưa có ảnh kèm theo!");
          } else if (err?.status === 400) {
            setErrMsg("Sai định dạng thông tin!");
          } else if (err?.status === 417) {
            setErrMsg("File ảnh quá lớn (Tối đa 2MB)!");
          } else {
            setErrMsg("Thêm thành viên thất bại!");
          }
          enqueueSnackbar("Thêm thành viên thất bại!", { variant: "error" });
          setPending(false);
        });
    }
  };
  //#endregion

  return (
    <Dialog
      open={open}
      scroll={"paper"}
      maxWidth={"md"}
      fullWidth
      onClose={handleCloseDialog}
      fullScreen={fullScreen}
      aria-modal
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
        <PersonIcon />
        &nbsp;{user ? "Chỉnh sửa thành viên" : "Thêm thành viên"}
      </DialogTitle>
      <DialogContent sx={{ pt: 0, px: { xs: 1, sm: 3 } }}>
        <form onSubmit={handleSubmit}>
          <Instruction display={errMsg ? "block" : "none"}>
            {errMsg}
          </Instruction>
          <Grid container size="grow" spacing={1}>
            <Grid size={12} display="flex" justifyContent="center" py={2}>
              <ImageSelect
                {...{ image: pic, handleRemoveImage, file, setFile }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                id="username"
                label="Tên đăng nhập"
                fullWidth
                variant="outlined"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                error={err?.data?.errors?.username}
                helperText={err?.data?.errors?.username}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                id="email"
                label="Email"
                fullWidth
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={validEmail ? "false" : "true"}
                error={
                  (email && !validEmail) || err?.data?.errors?.email != null
                }
                helperText={
                  email && !validEmail
                    ? "Sai định dạng email."
                    : err?.data?.errors?.email
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <PasswordInput
                required={user != null}
                id="pass"
                label="Mật khẩu"
                fullWidth
                variant="outlined"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                error={err?.data?.errors?.pass}
                helperText={err?.data?.errors?.pass}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                id="name"
                label="Họ và tên"
                fullWidth
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={err?.data?.errors?.name}
                helperText={err?.data?.errors?.name}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <PatternFormat
                id="phone"
                label="Số điện thoại"
                onValueChange={(values) => setPhone(values.value)}
                value={phone}
                error={(phone && !validPhone) || err?.data?.errors?.phone}
                helperText={
                  phone && !validPhone
                    ? "Sai định dạng số điện thoại!"
                    : err?.data?.errors?.phone
                }
                fullWidth
                format="(+84) ### ### ###"
                allowEmptyFormatting
                customInput={TextField}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Giới tính"
                select
                fullWidth
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                {genderTypeItems.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DatePicker
                label="Ngày sinh"
                value={dob}
                className="custom-date-picker"
                onChange={(newValue) => setDob(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: err?.data?.errors?.dob,
                    helperText: err?.data?.errors?.dob,
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Quyền"
                select
                required
                fullWidth
                id="roles"
                value={roles}
                onChange={(e) => setRoles(e.target.value)}
              >
                {roleTypeItems.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="error"
          size="large"
          sx={{ marginY: "10px" }}
          onClick={handleClose}
          startIcon={<CloseIcon />}
        >
          Huỷ
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ marginY: "10px" }}
          onClick={handleSubmit}
          startIcon={<Check />}
        >
          Áp dụng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserFormDialog;
