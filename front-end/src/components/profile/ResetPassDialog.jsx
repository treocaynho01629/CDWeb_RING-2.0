import styled from "styled-components"
import { useEffect, useState } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import { Check, Close } from "@mui/icons-material";
import { PWD_REGEX } from "../../ultils/regex";
import CustomInput from "../custom/CustomInput";
import CustomButton from "../custom/CustomButton";

//#region styled
const Instruction = styled.p`
    font-size: 14px;
    margin-top: 0;
    font-style: italic;
    color: ${props => props.theme.palette.error.main};
`
//#endregion

const ResetPassDialog = ({ openDialog, handleCloseDialog }) => {
    const [errr, setErrr] = useState([]);
    const [otherErrMsg, setOtherErrMsg] = useState('');
    const [pass, setPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [newPassRe, setNewPassRe] = useState('');
    const [validNewPass, setValidNewPass] = useState(true);
    const [validNewPassRe, setValidNewPassRe] = useState(true);
    const [newPassFocus, setNewPassFocus] = useState(false);

    //Submit change pass mutation
    const handleChangePassword = async (e) => {
        e.preventDefault();

        const v1 = PWD_REGEX.test(newPass);

        if (!v1) {
            setOtherErrMsg("Sai định dạng thông tin!");
            return;
        }

        if (!newPass || !newPassRe) {
            setOtherErrMsg("Không được bỏ trống mật khẩu mới!");
            setValidNewPass(false);
            setValidNewPassRe(false);
            return;
        }

        if (newPass !== newPassRe) {
            setOtherErrMsg("Không trùng mật khẩu!");
            setValidNewPass(false);
            setValidNewPassRe(false);
            return;
        }

        setPending(true);
        setOpenDialog(false);

        try {
            const response = await axiosPrivate.put(CHANGE_PASS_URL,
                JSON.stringify({
                    pass: pass,
                    newPass: newPass,
                    newPassRe: newPassRe
                }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            setErrr([]);
            setOtherErrMsg("");
            setPass("");
            setNewPass("");
            setNewPassRe("");
            setValidNewPass(true);
            setValidNewPassRe(true);
            const { enqueueSnackbar } = await import('notistack');
            enqueueSnackbar('Đổi mật khẩu thành công!', { variant: 'success' });
            refetch();
            setPending(false);
            setOpenDialog(true);
        } catch (err) {
            console.error(err);
            setErrr(err);
            if (!err?.status) {
                setOtherErrMsg("Server không phản hồi!");
            } else if (err?.status === 409) {
                setOtherErrMsg(err?.data?.errors?.errorMessage);
            } else if (err?.status === 400) {
            } else {
                setOtherErrMsg("Đổi mật khẩu thất bại!");
            }
            setPending(false);
            setOpenDialog(true);
        }
    }

    //Validation
    useEffect(() => {
        const result = PWD_REGEX.test(newPass);
        setValidNewPass(result);
        const match = newPass === newPassRe;
        setValidNewPassRe(match);
    }, [newPass, newPassRe])

    useEffect(() => {
        setOtherErrMsg('');
    }, [newPass, newPassRe, pass])

    return (
        <Dialog open={openDialog} scroll="body" onClose={handleCloseDialog}>
            <DialogTitle sx={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '10px'
            }}>Thay đổi mật khẩu</DialogTitle>
            <DialogContent sx={{
                marginTop: 0,
                marginX: '10px'
            }}>
                <Stack spacing={2} direction="column">
                    <Instruction display={otherErrMsg ? "block" : "none"} aria-live="assertive">{otherErrMsg}</Instruction>
                    <CustomInput
                        label='Nhập mật khẩu hiện tại'
                        onChange={e => setPass(e.target.value)}
                        value={pass}
                        error={errr?.data?.errors?.password}
                        helperText={errr?.data?.errors?.password}
                        size="small"
                        typeToggle={true}
                    />
                    <CustomInput
                        label='Nhập mật khẩu mới'
                        onChange={e => setNewPass(e.target.value)}
                        value={newPass}
                        aria-invalid={validNewPass ? "false" : "true"}
                        onFocus={() => setNewPassFocus(true)}
                        onBlur={() => setNewPassFocus(false)}
                        error={newPass && !validNewPass || errr?.data?.errors?.newPass}
                        helperText={newPassFocus &&
                            newPass &&
                            !validNewPass ?
                            "8 đến 24 kí tự. Phải bao gồm chữ in hoa và ký tự đặc biệt."
                            : errr?.data?.errors?.newPass}
                        size="small"
                        typeToggle={true}
                    />
                    <CustomInput
                        label='Nhập lại mật khẩu mới'
                        onChange={e => setNewPassRe(e.target.value)}
                        value={newPassRe}
                        aria-invalid={validNewPassRe ? "false" : "true"}
                        error={newPassRe &&
                            !validNewPassRe ||
                            errr?.data?.errors?.newPassRe}
                        helperText={newPassRe &&
                            !validNewPassRe ?
                            "Không trùng mật khẩu." :
                            errr?.data?.errors?.newPassRe}
                        size="small"
                        typeToggle={true}
                    />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ marginBottom: '10px' }}>
                <CustomButton
                    variant="contained"
                    color="secondary"
                    onClick={handleChangePassword}
                >
                    <Check sx={{ marginRight: '10px' }} />Xác nhận
                </CustomButton>
                <CustomButton
                    variant="outlined"
                    color="error"
                    onClick={handleCloseDialog}
                >
                    <Close sx={{ marginRight: '10px' }} />Huỷ
                </CustomButton>
            </DialogActions>
        </Dialog>
    )
}

export default ResetPassDialog