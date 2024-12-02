import { Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForgotMutation } from '../../features/auth/authApiSlice';
import { EMAIL_REGEX } from '../../ultils/regex';
import { Instruction } from '../custom/GlobalComponents';
import { AuthForm, AuthTitle, ConfirmButton } from '../custom/CustomAuthComponents';

const ForgotTab = ({ pending, setPending }) => {
    //Initial value
    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);

    //Error
    const [err, setErr] = useState([]);
    const [errMsg, setErrMsg] = useState('');

    const [sendForgot, { isLoading: sending }] = useForgotMutation(); //Request forgot hook

    //Validation email
    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        setValidEmail(result);
    }, [email])

    //Forgot pass
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (sending || pending) return;

        setPending(true);

        //Validation
        if (!validEmail) {
            setErrMsg('Sai định dạng email!');
            return;
        }

        const { enqueueSnackbar } = await import('notistack');

        //Send mutation
        sendForgot(email).unwrap()
            .then((data) => {
                //Reset input
                setEmail('');
                setErr([]);
                setErrMsg('');

                //Queue snack
                enqueueSnackbar('Đã gửi yêu cầu về email!', { variant: 'success' });
                setPending(false);
            })
            .catch((err) => {
                console.error(err);
                setErr(err);
                if (!err?.status) {
                    setErrMsg('Server không phản hồi');
                } else if (err?.status === 404) {
                    setErrMsg('Tài khoản với email không tồn tại!');
                } else if (err?.status === 400) {
                    setErrMsg('Sai định dạng thông tin!');
                } else {
                    setErrMsg('Gửi yêu cầu thất bại');
                }
                setPending(false);
            })
    }

    return (
        <AuthForm onSubmit={handleSubmit}>
            <AuthTitle>Khôi phục mật khẩu</AuthTitle>
            <Stack spacing={2} direction="column">
                <Instruction
                    display={errMsg ? "block" : "none"}
                    aria-live="assertive">
                    {errMsg}
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
                <br />
                <ConfirmButton
                    variant="contained"
                    color="primary"
                    size="large"
                    type="submit"
                    disabled={!email || !validEmail || sending} 
                >
                    Gửi email khôi phục
                </ConfirmButton>
            </Stack>
        </AuthForm>


    )
}

export default ForgotTab