import styled from 'styled-components';
import { useState, useRef, useEffect } from 'react';
import { Stack, FormControlLabel, Checkbox, DialogContent, DialogActions, Dialog, DialogTitle } from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { setAuth, setPersist } from '../../features/auth/authSlice';
import CustomInput from '../custom/CustomInput';
import CustomButton from '../custom/CustomButton';
import axios from '../../app/api/axios';
import useAuth from '../../hooks/useAuth';

//#region styled
const Title = styled.h1`
    font-size: 30px;
    font-weight: 400;
    color: inherit;
`

const Instruction = styled.p`
    font-size: 14px;
    font-style: italic;
    color: red;
    display: ${props => props.display};;
`
//#endregion

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const FORGOT_URL = '/api/v1/auth/forgot-password?email=';

const LoginTab = ({ setPending, authenticate }) => {
    const dispatch = useDispatch();
    const { persist } = useAuth();

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
    const togglePersist = () => { dispatch(setPersist({ persist: !persist }))}

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
        const { enqueueSnackbar } = await import('notistack');

        try {
            const { token, refreshToken } = await authenticate({ userName: username, pass: password }).unwrap();

            //Store access token to auth
            dispatch(setAuth({ token }));

            if (persist) { //Set refresh token on cookie
                const refreshTokenData = jwtDecode(refreshToken);
                const expires = new Date(0);
                expires.setUTCSeconds(refreshTokenData.exp);
                console.log(refreshToken);
                setCookie('refreshToken', refreshToken, { path: '/', expires });
            }

            enqueueSnackbar('Đăng nhập thành công', { variant: 'success' });
            //Redirect to previous page
            navigate(from, { replace: true });
        } catch (err) {
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
            enqueueSnackbar('Đăng nhập thất bại', { variant: 'error' });
        }
    }

    //Forgot pass
    const handleForgotPassword = async (e) => {
        e.preventDefault();

        setPending(true);
        setOpen(false);
        try {
            const response = await axios.post(FORGOT_URL + email);

            setEmail('');
            setErr([]);
            setErrMsgReset('');
            const { enqueueSnackbar } = await import('notistack');
            enqueueSnackbar('Đã gửi yêu cầu về email!', { variant: 'success' });
            setPending(false);
            setOpen(true);
        } catch (err) {
            console.log(err);
            setErr(err);
            if (!err?.response) {
                setErrMsgReset('Server không phản hồi');
            } else if (err.response?.status === 404) {
                setErrMsgReset('Tài khoản với email không tồn tại!');
            } else if (err.response?.status === 400) {
                setErrMsgReset('Sai định dạng thông tin!');
            } else {
                setErrMsgReset('Gửi yêu cầu thất bại');
            }
            setPending(false);
            setOpen(true);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmitLogin}>
                <Title>Đăng nhập</Title>
                <Stack spacing={1} direction="column">
                    <Instruction ref={errRef}
                        display={errMsgLogin ? "block" : "none"}
                        aria-live="assertive">
                        {errMsgLogin}
                    </Instruction>
                    <CustomInput
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
                    <CustomInput
                        typeToggle={true}
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
                                checked={persist}
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
                        variant="contained"
                        color="secondary"
                        size="large"
                        sx={{ width: '50%' }}
                        type="submit"
                    >
                        Đăng nhập
                    </CustomButton>
                </Stack>
            </form>
            <Dialog open={open} onClose={handleClose} maxWidth="md">
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>Nhập email tài khoản</DialogTitle>
                <DialogContent sx={{ minWidth: '275px', overflow: 'visible' }}>
                    <Instruction display={errMsgReset ? "block" : "none"} aria-live="assertive">{errMsgReset}</Instruction>
                    <CustomInput
                        placeholder='Nhập email tài khoản'
                        id="email"
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        fullWidth
                        error={(email && !validEmail) || err?.response?.data?.errors?.email}
                        helperText={email && !validEmail ? "Email không hợp lệ!" : err?.response?.data?.errors?.email}
                        size="small"

                    />
                </DialogContent>
                <DialogActions sx={{ width: '90%', marginBottom: '10px' }}>
                    <CustomButton variant="outlined" color="error" size="large" onClick={handleClose}>Huỷ</CustomButton>
                    <CustomButton
                        variant="contained"
                        color="secondary"
                        type="submit"
                        size="large"
                        onClick={handleForgotPassword}
                    >
                        <CheckIcon sx={{ marginRight: '5px' }} />Gửi
                    </CustomButton>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default LoginTab