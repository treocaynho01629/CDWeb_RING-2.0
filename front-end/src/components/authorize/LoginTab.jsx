import { useState, useRef, useEffect } from 'react';
import { Stack, Button, FormControlLabel, Checkbox, TextField } from '@mui/material';
import { useNavigate, useLocation, Link } from 'react-router';
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
    const [authenticate, { isLoading, isSuccess, isUninitialized }] = useAuthenticateMutation();
    const signOut = useLogout();

    //Router
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    const errRef = useRef();

    //Login value
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [currPersist, setCurrPersist] = useState(true);

    //Error
    const [errMsg, setErrMsg] = useState(location.state?.errorMsg || '');

    const togglePersist = () => { setCurrPersist(prev => !prev) } //Toggle persist

    //Login
    const handleSubmitLogin = async (e) => {
        e.preventDefault();
        if (pending) return;

        setPending(true);
        const { enqueueSnackbar } = await import('notistack');

        authenticate({
            persist: currPersist,
            credentials: { username, pass: password }
        }).unwrap()
            .then((data) => {
                const { token } = data;

                //Store access token to auth
                dispatch(setAuth({ token }));

                if (currPersist) { //Set persist in state to refresh token
                    dispatch(setPersist({ persist: true }));
                }

                //Queue snack
                enqueueSnackbar('Đăng nhập thành công', { variant: 'success' });
                navigate(from, { replace: true }); //Redirect to previous page
                setPending(false);
            })
            .catch((err) => {
                console.error(err);
                if (!err?.status) {
                    setErrMsg('Server không phản hồi');
                } else if (err?.status === 404 || err?.status === 403 || err?.status === 400) {
                    setErrMsg('Sai tên tài khoản hoặc mật khẩu!');
                } else if (err?.status === 429) {
                    setErrMsg('Bạn đã thử quá nhiều lần, vui lòng thử lại sau!');
                } else {
                    setErrMsg('Đăng nhập thất bại');
                }
                errRef.current.focus();
                setPending(false);
            })
    }

    return (
        (isUninitialized && (persist || loginedUser)) ?
            <div>
                <AuthTitle>Xin chào {loginedUser}</AuthTitle>
                <Button
                    color="error"
                    size="large"
                    onClick={() => signOut()}
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
                            display={errMsg ? "block" : "none"}
                            aria-live="assertive"
                        >
                            {errMsg}
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
                            disabled={isLoading || isSuccess}
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