import styled from 'styled-components';
import { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { Stack, Button, FormControlLabel, Checkbox, TextField } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { setAuth, setPersist } from '../../features/auth/authReducer';
import { useAuthenticateMutation } from '../../features/auth/authApiSlice';
import { Instruction } from '../custom/GlobalComponents';
import { Logout } from '@mui/icons-material';
import CustomPasswordInput from '../custom/CustomPasswordInput';
import useAuth from '../../hooks/useAuth';
import useLogout from '../../hooks/useLogout';

const ForgotDialog = lazy(() => import("./ForgotDialog"));

//#region styled
const Title = styled.h1`
    font-size: 30px;
    font-weight: 400;
    color: inherit;
`

const LoginForm = styled.form`
    width: 90%;
    max-width: 450px;
`

const Forgot = styled.span`
    text-decoration: underline;
    color: ${props => props.theme.palette.primary.main};
    cursor: pointer;

    &:hover {
        color: ${props => props.theme.palette.primary.dark};
    }
`

const ActionContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`
//#endregion

const LoginTab = ({ pending, setPending }) => {
    const dispatch = useDispatch();
    const { persist, username: loginedUser } = useAuth(); //Is user logged in
    const [authenticate, { isLoading }] = useAuthenticateMutation();
    const logout = useLogout();

    //Router
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const errRef = useRef();

    //Login value
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [currPersist, setCurrPersist] = useState(false);

    //Error
    const [errMsgLogin, setErrMsgLogin] = useState(location.state?.errorMsg ?? '');

    //Other
    const [open, setOpen] = useState(undefined);
    const [cookies, setCookie] = useCookies(['refreshToken']);

    //Error message reset when reinput stuff
    useEffect(() => {
        setErrMsgLogin('');
    }, [username, password])

    const togglePersist = () => { setCurrPersist(prev => !prev) } //Toggle persist
    const handleOpen = () => setOpen(true); //Open dialog

    //Login
    const handleSubmitLogin = async (e) => {
        e.preventDefault();
        if (pending) return;

        setPending(true);
        const { enqueueSnackbar } = await import('notistack');

        authenticate({ username, pass: password }).unwrap()
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

    return (
        (persist || loginedUser) ?
            <div>
                <Title>Xin chào {loginedUser}</Title>
                <Button
                    color="error"
                    size="large"
                    onClick={logout}
                    startIcon={<Logout />}
                >
                    Kết thúc phiên đăng nhập?
                </Button>
            </div>
            :
            <>
                <LoginForm onSubmit={handleSubmitLogin}>
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
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                        />
                        <CustomPasswordInput
                            label="Mật khẩu"
                            autoComplete="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                        <ActionContainer className="persistCheck">
                            <FormControlLabel control={
                                <Checkbox
                                    checked={currPersist}
                                    onChange={togglePersist}
                                    disableRipple
                                    name="persist"
                                    color="primary"
                                />
                            }
                                label="Lưu đăng nhập"
                            />
                            <Forgot onClick={handleOpen}>Quên mật khẩu?</Forgot>
                        </ActionContainer>
                        <Button
                            disabled={isLoading}
                            variant="contained"
                            color="primary"
                            size="large"
                            type="submit"
                            aria-label="submit login"
                            sx={{ width: '150px' }}
                        >
                            Đăng nhập
                        </Button>
                    </Stack>
                </LoginForm>
                {open !== undefined &&
                    <Suspense fallback={<></>}>
                        <ForgotDialog {...{ open, setOpen }} />
                    </Suspense>
                }
            </>
    )
}

export default LoginTab