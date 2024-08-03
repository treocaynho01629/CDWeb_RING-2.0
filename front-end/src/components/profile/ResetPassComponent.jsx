import { useEffect, useState } from 'react'
import { Box, Stack } from '@mui/material';
import { Check, Password } from "@mui/icons-material";
import { PWD_REGEX } from "../../ultils/regex";
import { useChangePasswordMutation } from '../../features/users/usersApiSlice';
import CustomInput from "../custom/CustomInput";
import CustomButton from "../custom/CustomButton";

const ResetPassComponent = ({ Instruction, Title, Wrapper, pending, setPending }) => {
    const [err, setErr] = useState([]);
    const [errMsg, setErrMsg] = useState('');
    const [pass, setPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [newPassRe, setNewPassRe] = useState('');
    const [validNewPass, setValidNewPass] = useState(true);
    const [validNewPassRe, setValidNewPassRe] = useState(true);
    const [newPassFocus, setNewPassFocus] = useState(false);

    //Change pass hook
    const [changePass, { isLoading: changing }] = useChangePasswordMutation();

    //Submit change pass mutation
    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (pending || changing) return;

        //Validation
        const validPass = PWD_REGEX.test(newPass);

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
        const { enqueueSnackbar } = await import('notistack');

        changePass({
            pass,
            newPass,
            newPassRe
        }).unwrap()
            .then((data) => {
                enqueueSnackbar('Đổi mật khẩu thành công!', { variant: 'success' });
                setErr([]);
                setErrMsg("");
                setPass("");
                setNewPass("");
                setNewPassRe("");
                setPending(false);
            })
            .catch((err) => {
                console.error(err);
                setErr(err);
                if (!err?.status) {
                    setErrMsg('Server không phản hồi');
                } else if (err?.status === 409) {
                    setErrMsg(err?.data?.errors?.errorMessage);
                } else if (err?.status === 400) {
                    setErrMsg('Sai định dạng thông tin!');
                } else {
                    setErrMsg('Cập nhật hồ sơ thất bại');
                }
                setPending(false);
            })
    }

    //Validation
    useEffect(() => {
        const result = PWD_REGEX.test(newPass);
        setValidNewPass(result);
        const match = newPass === newPassRe;
        setValidNewPassRe(match);
    }, [newPass, newPassRe])

    useEffect(() => {
        setErrMsg('');
    }, [newPass, newPassRe, pass])

    const validReset = [pass, newPass, newPassRe, validNewPass, validNewPassRe].every(Boolean);

    return (
        <>
            <Title><Password />&nbsp;THAY ĐỔI MẬT KHẨU</Title>
            <Wrapper>
                <Instruction display={errMsg ? "block" : "none"} aria-live="assertive">{errMsg}</Instruction>
                <form style={{ marginTop: '30px' }} onSubmit={handleChangePassword}>
                    <Stack spacing={2} direction="column" alignItems={{ xs: 'center', md: 'start' }}>
                        <CustomInput
                            label='Nhập mật khẩu hiện tại'
                            onChange={e => setPass(e.target.value)}
                            value={pass}
                            error={err?.data?.errors?.password}
                            helperText={err?.data?.errors?.password}
                            fullWidth
                            size="small"
                            sx={{ width: { xs: '100%', sm: '80%' } }}
                            typeToggle={true}
                        />
                        <CustomInput
                            label='Nhập mật khẩu mới'
                            onChange={e => setNewPass(e.target.value)}
                            value={newPass}
                            aria-invalid={validNewPass ? "false" : "true"}
                            onFocus={() => setNewPassFocus(true)}
                            onBlur={() => setNewPassFocus(false)}
                            error={newPass && !validNewPass || err?.data?.errors?.newPass}
                            helperText={newPassFocus &&
                                newPass &&
                                !validNewPass ?
                                "8 đến 24 kí tự. Bao gồm chữ in hoa và ký tự đặc biệt."
                                : err?.data?.errors?.newPass}
                            fullWidth
                            size="small"
                            sx={{ width: { xs: '100%', sm: '80%' } }}
                            typeToggle={true}
                        />
                        <CustomInput
                            label='Nhập lại mật khẩu mới'
                            onChange={e => setNewPassRe(e.target.value)}
                            value={newPassRe}
                            aria-invalid={validNewPassRe ? "false" : "true"}
                            error={newPassRe &&
                                !validNewPassRe ||
                                err?.data?.errors?.newPassRe}
                            helperText={newPassRe &&
                                !validNewPassRe ?
                                "Không trùng mật khẩu." :
                                err?.data?.errors?.newPassRe}
                            fullWidth
                            size="small"
                            sx={{ width: { xs: '100%', sm: '80%' } }}
                            typeToggle={true}
                        />
                        <Box sx={{ width: { xs: '100%', sm: '80%' } }}>
                            <CustomButton
                                variant="contained"
                                color="secondary"
                                onClick={handleChangePassword}
                                disabled={!validReset || pending || changing}
                            >
                                <Check sx={{ marginRight: '10px' }} />Xác nhận
                            </CustomButton>
                        </Box>
                    </Stack>
                </form>
            </Wrapper>
        </>
    )
}

export default ResetPassComponent