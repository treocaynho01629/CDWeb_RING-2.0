import { Button, DialogContent, DialogActions, Dialog, TextField, DialogTitle } from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useForgotMutation } from '../../features/auth/authApiSlice';
import { EMAIL_REGEX } from '../../ultils/regex';
import { Instruction } from '../custom/GlobalComponents';

const ForgotDialog = ({ open, setOpen }) => {
    //Initial value
    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    
    //Error
    const [err, setErr] = useState([]);
    const [errMsgReset, setErrMsgReset] = useState('');
    
    const [sendForgot, { isLoading: sending }] = useForgotMutation(); //Request forgot hook

    //Validation email
    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        setValidEmail(result);
    }, [email])

    const handleClose = () => {
        setOpen(false);
        setEmail('');
        setErr([]);
        setErrMsgReset('');
    }

    //Forgot pass
    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (pending) return;

        setPending(true);

        //Validation
        if (!validEmail) {
            setErrMsgReset('Sai định dạng email!');
            return;
        }

        const { enqueueSnackbar } = await import('notistack');

        //Send mutation
        sendForgot(email).unwrap()
            .then((data) => {
                //Reset input
                setEmail('');
                setErr([]);
                setErrMsgReset('');

                //Queue snack
                enqueueSnackbar('Đã gửi yêu cầu về email!', { variant: 'success' });
                setPending(false);
            })
            .catch((err) => {
                console.error(err);
                setErr(err);
                if (!err?.status) {
                    setErrMsgReset('Server không phản hồi');
                } else if (err?.status === 404) {
                    setErrMsgReset('Tài khoản với email không tồn tại!');
                } else if (err?.status === 400) {
                    setErrMsgReset('Sai định dạng thông tin!');
                } else {
                    setErrMsgReset('Gửi yêu cầu thất bại');
                }
                setPending(false);
            })
    }

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>Nhập email tài khoản</DialogTitle>
            <DialogContent sx={{ overflow: 'visible' }}>
                <form onSubmit={handleForgotPassword}>
                    <Instruction
                        style={{ display: errMsgReset ? "block" : "none" }}
                        aria-live="assertive">
                        {errMsgReset}
                    </Instruction>
                    <TextField
                        placeholder='Nhập email tài khoản cần khôi phục'
                        id="email"
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        fullWidth
                        error={(email && !validEmail) || err?.data?.errors?.email}
                        helperText={email && !validEmail ? "Email không hợp lệ!" : err?.data?.errors?.email}
                        size="small"
                    />
                </form>
            </DialogContent>
            <DialogActions sx={{ marginBottom: '10px' }}>
                <Button variant="outlined" color="error" size="large" onClick={handleClose}>Huỷ</Button>
                <Button
                    disabled={!email || !validEmail || sending}
                    variant="contained"
                    color="primary"
                    type="submit"
                    size="large"
                    aria-label="submit sending recover email"
                    onClick={handleForgotPassword}
                    startIcon={<CheckIcon />}
                >
                    Gửi
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ForgotDialog