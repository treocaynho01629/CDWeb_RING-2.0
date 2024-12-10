import { useState, useRef, lazy, Suspense } from 'react';
import { Stack, Button, FormControlLabel, Checkbox, TextField } from '@mui/material';
import { useNavigate, useLocation, Link } from 'react-router';
import { useDispatch } from 'react-redux';
import { setAuth, setPersist } from '../../features/auth/authReducer';
import { useAuthenticateMutation } from '../../features/auth/authApiSlice';
import { Instruction } from '../custom/GlobalComponents';
import { AuthActionContainer, AuthHighlight, AuthText, AuthTitle, ConfirmButton } from '../custom/CustomAuthComponents';
import { Logout } from '@mui/icons-material';
import CustomPasswordInput from '../custom/CustomPasswordInput';
import useAuth from '../../hooks/useAuth';
import useLogout from '../../hooks/useLogout';

const ReCaptcha = lazy(() => import('./ReCaptcha'));

const LoginTab = ({ pending, setPending, reCaptchaLoaded, generateReCaptchaToken, hideBadge, showBadge }) => {
    const dispatch = useDispatch();
    const { persist, username: loginedUser } = useAuth();
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

    //Recaptcha v2
    const [challenge, setChallenge] = useState(false); //Toggle if marked suspicious by v3
    const [token, setToken] = useState('');

    //Error
    const [errMsg, setErrMsg] = useState(location.state?.errorMsg || '');

    const togglePersist = () => { setCurrPersist(prev => !prev) } //Toggle persist

    //Login
    const handleSubmitLogin = async (e) => {
        e.preventDefault();
        if (pending || !reCaptchaLoaded) return;

        setPending(true);
        const { enqueueSnackbar } = await import('notistack');

        const recaptchaToken = challenge ? token : await generateReCaptchaToken('login');
        authenticate({
            token: recaptchaToken,
            source: challenge ? 'v2' : 'v3',
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
                setUsername('');
                setPassword('');
                setErrMsg('');
                showBadge();
                setChallenge(false);
                setPending(false);
            })
            .catch((err) => {
                console.error(err);
                if (!err?.status) {
                    setErrMsg('Server không phản hồi');
                } else if (err?.status === 409) {
                    setErrMsg(err?.data?.message);
                } else if (err?.status === 404 || err?.status === 400) {
                    setErrMsg('Sai tên tài khoản hoặc mật khẩu!');
                } else if (err?.status === 403) {
                    setErrMsg('Lỗi xác thực!');
                } else if (err?.status === 412) {
                    setChallenge(true);
                    hideBadge();
                    setErrMsg('Yêu cầu của bạn cần xác thực lại!');
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
            <>
                <AuthTitle>Xin chào {loginedUser}</AuthTitle>
                <Button
                    color="error"
                    size="large"
                    onClick={() => signOut()}
                    startIcon={<Logout />}
                >
                    Kết thúc phiên đăng nhập?
                </Button>
            </>
            :
            <form onSubmit={handleSubmitLogin}>
                <AuthTitle>Đăng nhập tài khoản</AuthTitle>
                <Stack spacing={2.5} direction="column">
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
                        size="small"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                    />
                    <CustomPasswordInput
                        label="Mật khẩu"
                        autoComplete="password"
                        size="small"

                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                    {(reCaptchaLoaded && challenge) &&
                        <Suspense fallback={null}>
                            <ReCaptcha onVerify={(token) => setToken(token)} />
                        </Suspense>
                    }
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
                        disabled={isLoading || isSuccess || pending || !reCaptchaLoaded}
                        variant="contained"
                        color="primary"
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
            </form>
    )
}

export default LoginTab