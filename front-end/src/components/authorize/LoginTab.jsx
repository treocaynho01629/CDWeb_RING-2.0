import { useState, useRef, useEffect } from 'react';
import { Stack, Button, FormControlLabel, Checkbox, TextField } from '@mui/material';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { setAuth, setPersist } from '../../features/auth/authReducer';
import { useAuthenticateMutation } from '../../features/auth/authApiSlice';
import { Instruction } from '../custom/GlobalComponents';
import { AuthActionContainer, AuthForm, AuthHighlight, AuthText, AuthTitle, ConfirmButton } from '../custom/CustomAuthComponents';
import { Logout } from '@mui/icons-material';
import CustomPasswordInput from '../custom/CustomPasswordInput';
import useAuth from '../../hooks/useAuth';
import useLogout from '../../hooks/useLogout';

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
    const [cookies, setCookie] = useCookies(['refreshToken']);

    //Error
    const [errMsgLogin, setErrMsgLogin] = useState(location.state?.errorMsg ?? '');

    //Error message reset when reinput stuff
    useEffect(() => {
        setErrMsgLogin('');
    }, [username, password])

    const togglePersist = () => { setCurrPersist(prev => !prev) } //Toggle persist

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
                } else if (err?.status === 403 || err?.status === 400) {
                    setErrMsgLogin('Sai tên tài khoản hoặc mật khẩu!');
                } else if (err?.status === 429) {
                    setErrMsgLogin('Bạn đã thử quá nhiều lần, vui lòng thử lại sau!');
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
                <AuthTitle>Xin chào {loginedUser}</AuthTitle>
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
                <AuthForm onSubmit={handleSubmitLogin}>
                    <AuthTitle>Đăng nhập tài khoản</AuthTitle>
                    <Stack spacing={1.5} direction="column">
                        <Instruction ref={errRef}
                            display={errMsgLogin ? "block" : "none"}
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
                        <AuthActionContainer className="persistCheck">
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
                            <Link to={'/reset'}>
                                <AuthHighlight className="warning">Quên mật khẩu?</AuthHighlight>
                            </Link>
                        </AuthActionContainer>
                        <ConfirmButton
                            disabled={isLoading}
                            variant="contained"
                            color="primary"
                            size="large"
                            type="submit"
                            aria-label="submit login"
                        >
                            Đăng nhập
                        </ConfirmButton>
                    </Stack>
                    <AuthText>Chưa có tài khoản?&nbsp;
                        <Link to={'/auth/register'}>
                            <AuthHighlight>Đăng ký</AuthHighlight>
                        </Link>
                    </AuthText>
                </AuthForm>
            </>
    )
}

export default LoginTab