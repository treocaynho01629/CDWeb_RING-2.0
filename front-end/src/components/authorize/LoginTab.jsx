import styled from 'styled-components';
import { useState, useRef, useEffect } from 'react';
import { Stack, FormControlLabel, Checkbox, DialogContent, DialogActions, Dialog, DialogTitle, TextField } from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { setAuth, setPersist } from '../../features/auth/authReducer';
import { useAuthenticateMutation, useForgotMutation } from '../../features/auth/authApiSlice';
import { EMAIL_REGEX } from '../../ultils/regex';
import CustomPasswordInput from '../custom/CustomPasswordInput';
import CustomButton from '../custom/CustomButton';

//#region styled
const Title = styled.h1`
    font-size: 30px;
    font-weight: 400;
    color: inherit;
`

const Instruction = styled.p`
    font-size: 14px;
    margin-top: 0;
    font-style: italic;
    color: ${props => props.theme.palette.error.main};
`
//#endregion

const LoginTab = ({ pending, setPending }) => {
    const dispatch = useDispatch();
    const [authenticate, { isLoading }] = useAuthenticateMutation();
    const [sendForgot, { isLoading: sending }] = useForgotMutation();

    //Router
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    //Login value
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [currPersist, setCurrPersist] = useState(false);

    //Error
    const [err, setErr] = useState([]);
    const [errMsgLogin, setErrMsgLogin] = useState(location.state?.errorMsg ?? '');
    const [errMsgReset, setErrMsgReset] = useState('');

    //Other
    const [open, setOpen] = useState(false);
    const [cookies, setCookie] = useCookies(['refreshToken']);

    //Error message reset when reinput stuff
    useEffect(() => {
        setErrMsgLogin('');
    }, [username, password])

    //Validation email
    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        setValidEmail(result);
    }, [email])

    //Toggle persist
    const togglePersist = () => { setCurrPersist(prev => !prev) }

    //Forgot pass dialog open state 
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setEmail('');
        setErr([]);
        setErrMsgReset('');
    }

    //Login
    const handleSubmitLogin = async (e) => {
        e.preventDefault();
        if (pending) return;

        setPending(true);
        const { enqueueSnackbar } = await import('notistack');

        authenticate({ userName: username, pass: password }).unwrap()
            .then((data) => {
                const { token, refreshToken } = data;

                //Store access token to auth
                dispatch(setAuth({ token }));

                if (currPersist) { //Set refresh token on cookie
                    dispatch(setPersist({ persist: true })); //Set persist in state
                    const refreshTokenData = jwtDecode(refreshToken);
                    const expires = new Date(0);
                    expires.setUTCSeconds(refreshTokenData.exp);
                    setCookie('refreshToken', refreshToken, { path: '/', expires });
                }

                //Queue snack
                enqueueSnackbar('Đăng nhập thành công', { variant: 'success' });
                navigate(from, { replace: true }); //Redirect to previous page
                setPending(false);
            })
            .catch((err) => {
                console.error(err);
                if (!err?.status) {
                    setErrMsgLogin('Server không phản hồi');
                } else if (err?.status === 404) {
                    setErrMsgLogin('Sai tên tài khoản hoặc mật khẩu!');
                } else if (err?.status === 400) {
                    setErrMsgLogin('Sai định dạng thông tin!');
                } else {
                    setErrMsgLogin('Đăng nhập thất bại');
                }
                errRef.current.focus();
                setPending(false);
            })
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
        <>
            <form onSubmit={handleSubmitLogin}>
                <Title>Đăng nhập</Title>
                <Stack spacing={1} direction="column">
                    <Instruction ref={errRef}
                        style={{ display: errMsgLogin ? "block" : "none" }}
                        aria-live="assertive">
                        {errMsgLogin}
                    </Instruction>
                    <TextField
                        label="Tên đăng nhập"
                        type="text"
                        id="username"
                        autoComplete="username"
                        ref={userRef}
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        size="small"
                        margin="dense"
                    />
                    <CustomPasswordInput
                        label="Mật khẩu"
                        autoComplete="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        size="small"
                        margin="dense"
                    />
                    <div className="persistCheck" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <FormControlLabel control={
                            <Checkbox id="persist"
                                checked={currPersist}
                                onChange={togglePersist}
                                disableRipple
                                name="Persist"
                                sx={{
                                    fontSize: '12px',
                                    '&.Mui-checked': {
                                        color: '#63e399',
                                    }
                                }} />
                        }
                            label="Lưu đăng nhập"
                        />
                        <a style={{ textDecoration: 'underline', cursor: 'pointer', color: '#63e399' }}
                            onClick={handleOpen}>Quên mật khẩu</a>
                    </div>
                    <CustomButton
                        disabled={isLoading}
                        variant="contained"
                        color="primary"
                        size="large"
                        type="submit"
                        aria-label="submit login"
                        sx={{ width: '50%' }}
                    >
                        Đăng nhập
                    </CustomButton>
                </Stack>
            </form>
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
                    <CustomButton variant="outlined" color="error" size="large" onClick={handleClose}>Huỷ</CustomButton>
                    <CustomButton
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
                    </CustomButton>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default LoginTab