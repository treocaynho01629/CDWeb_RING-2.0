import { useState, useRef, useEffect } from 'react';
import { Stack, TextField } from '@mui/material';
import { useRegisterMutation } from '../../features/auth/authApiSlice';
import { USER_REGEX, PWD_REGEX, EMAIL_REGEX } from '../../ultils/regex';
import { Instruction } from '../custom/GlobalComponents';
import { AuthForm, AuthHighlight, AuthText, AuthTitle, ConfirmButton } from '../custom/CustomAuthComponents';
import { Link } from 'react-router';
import { GoogleReCaptcha, GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import CustomPasswordInput from '../custom/CustomPasswordInput';

const RegisterTab = ({ pending, setPending }) => {
    const userRef = useRef();
    const errRef = useRef();

    //User validation
    const [username, setUsername] = useState(''); //user input
    const [validName, setValidName] = useState(false); //check name validate or not
    const [userFocus, setUserFocus] = useState(false); //focus on field or not

    //Password validation
    const [password, setPassword] = useState('');
    const [validPass, setValidPass] = useState(false);
    const [passFocus, setPassFocus] = useState(false);

    const [matchPass, setMatchPass] = useState('');
    const [validMatch, setValidMatch] = useState(false);

    //Email vlidation
    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    //Recaptcha
    const [token, setToken] = useState('');
    const [refreshReCaptcha, setRefreshReCaptcha] = useState(false);

    //Error and success message
    const [errMsg, setErrMsg] = useState('');
    const [err, setErr] = useState([]);

    //Register mutation
    const [register, { isLoading }] = useRegisterMutation();

    //Focus username
    useEffect(() => { userRef?.current?.focus() }, [])

    //Username
    useEffect(() => {
        const result = USER_REGEX.test(username);
        setValidName(result);
    }, [username])

    //Password
    useEffect(() => {
        const result = PWD_REGEX.test(password);
        setValidPass(result);
        const match = password === matchPass;
        setValidMatch(match);
    }, [password, matchPass])

    //Email
    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        setValidEmail(result);
    }, [email])

    //Error message reset when reinput stuff
    useEffect(() => {
        setErrMsg('');
    }, [username, email, password, matchPass])

    //Recaptcha token
    const setTokenFunc = (getToken) => {
        setToken(getToken);
    };

    //Register
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (pending) return;

        //Validation
        const v1 = USER_REGEX.test(username);
        const v2 = PWD_REGEX.test(password);
        const v3 = EMAIL_REGEX.test(email);

        if (!v1 || !v2 || !v3) {
            setErrMsg("Sai định dạng thông tin!");
            return;
        }
        setPending(true);

        const { enqueueSnackbar } = await import('notistack');

        register({
            username,
            pass: password,
            email
        }).unwrap()
            .then((data) => {
                //Reset input
                setUsername('');
                setPassword('');
                setMatchPass('');
                setEmail('');
                setErr([]);
                setErrMsg('');

                //Queue snack
                enqueueSnackbar('Đăng ký thành công!', { variant: 'success' });
                setPending(false);
            })
            .catch((err) => {
                setRefreshReCaptcha(!refreshReCaptcha);
                console.error(err);
                setErr(err);
                if (!err?.status) {
                    setErrMsg('Server không phản hồi');
                } else if (err?.status === 409) {
                    setErrMsg(err?.data?.errors?.errorMessage);
                } else if (err?.status === 400) {
                    setErrMsg('Sai định dạng thông tin!');
                } else {
                    setErrMsg('Đăng ký thất bại!')
                }
                errRef.current.focus();
                setPending(false);
            })
    }

    const validRegister = [validName, validPass, validMatch, validEmail].every(Boolean);

    return (
        <AuthForm onSubmit={handleSubmit}>
            <AuthTitle>Đăng ký tài khoản mới</AuthTitle>
            <Stack spacing={1.5} direction="column">
                <Instruction ref={errRef}
                    display={errMsg ? "block" : "none"}
                    aria-live="assertive">
                    {errMsg}
                </Instruction>
                <TextField
                    label="Tên đăng nhập"
                    type="text"
                    id="new-username"
                    autoComplete="username"
                    ref={userRef}
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    aria-invalid={validName ? "false" : "true"}
                    onFocus={() => setUserFocus(true)}
                    onBlur={() => setUserFocus(false)}
                    error={(userFocus && username && !validName) || err?.data?.errors?.username}
                    helperText={userFocus && username && !validName ? "4 đến 24 kí tự." : err?.data?.errors?.username}
                />
                <TextField
                    label='Địa chỉ email'
                    type="email"
                    id="email"
                    autoComplete="off"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    aria-invalid={validEmail ? "false" : "true"}
                    aria-describedby="uidnote"
                    onFocus={() => setEmailFocus(true)}
                    onBlur={() => setEmailFocus(false)}
                    error={(emailFocus && email && !validEmail) || err?.data?.errors?.email}
                    helperText={emailFocus && email && !validEmail ? "Sai định dạng email." : err?.data?.errors?.email}
                />
                <CustomPasswordInput
                    label='Mật khẩu'
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    aria-invalid={validPass ? "false" : "true"}
                    aria-describedby="new password"
                    onFocus={() => setPassFocus(true)}
                    onBlur={() => setPassFocus(false)}
                    error={(password && !validPass) || err?.data?.errors?.pass}
                    helperText={passFocus && password && !validPass ? "8 đến 24 kí tự. Phải bao gồm chữ in hoa và ký tự đặc biệt."
                        : err?.data?.errors?.pass}
                />
                <CustomPasswordInput
                    label='Nhập lại mật khẩu'
                    onChange={(e) => setMatchPass(e.target.value)}
                    value={matchPass}
                    aria-invalid={validMatch ? "false" : "true"}
                    aria-describedby="confirm new password"
                    error={(matchPass && !validMatch) || err?.data?.errors?.pass}
                    helperText={matchPass && !validMatch ? "Không trùng mật khẩu."
                        : err?.data?.errors?.pass}
                />
                <p style={{ textAlign: 'center' }}>Bằng việc đăng kí, bạn đã đồng ý với <br />
                    <AuthHighlight className="warning">Điều khoản dịch vụ</AuthHighlight>&nbsp;&&nbsp;
                    <AuthHighlight className="warning">Chính sách bảo mật</AuthHighlight>
                </p>
                <ConfirmButton
                    variant="contained"
                    color="primary"
                    size="large"
                    type="submit"
                    aria-label="submit register"
                    disabled={!validRegister || isLoading}
                >
                    Đăng ký
                </ConfirmButton>
            </Stack>
            <AuthText>Đã có tài khoản?&nbsp;
                <Link to={'/auth/login'}>
                    <AuthHighlight>Đăng nhập</AuthHighlight>
                </Link>
            </AuthText>
            <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}>
                <GoogleReCaptcha
                    className="google-recaptcha-custom-class"
                    onVerify={setTokenFunc}
                    refreshReCaptcha={refreshReCaptcha}
                />
            </GoogleReCaptchaProvider>
        </AuthForm>
    )
}

export default RegisterTab