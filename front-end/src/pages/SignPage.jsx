import { useRef, useState, useEffect, lazy, Suspense } from "react";
import styled from 'styled-components'
import { styled as muiStyled } from '@mui/material/styles';

import { Stack, TextField, IconButton, InputAdornment, FormControlLabel, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions} from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon, Visibility, VisibilityOff } from '@mui/icons-material';

import { useNavigate, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import jwt from 'jwt-decode';

import SimpleNavbar from "../components/SimpleNavbar";
const Pending = lazy(() => import('../components/authorize/Pending'));

//#region styled
const Container = styled.div`
`

const CustomDialog = muiStyled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
      borderRadius: 0,
      width: '350px',
      padding: '15px 10px 15px 20px',
    },
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
}));

const Wrapper = styled.div`
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;

    display: flex;
    justify-content: center;
    flex-direction: column;

    @media (min-width: 768px) {
        width: 750px;
        flex-direction: row;
    }
    @media (min-width: 992px) {
        width: 970px;
    }
    @media (min-width: 1200px) {
        width: 1170px;
    }
`

const Left = styled.div`
    display: flex;

    @media (min-width: 900px) {
        justify-content: flex-start;
    }
`

const Right = styled.div`
    display: flex;

    @media (min-width: 900px) {
        display: flex;
    }
`   

const Title = styled.h1`
    font-size: 30px;
    font-weight: 400;
    color: inherit;
`

const CustomInput = muiStyled(TextField)(({ theme }) => ({
    '& .MuiInputBase-root': {
        borderRadius: 0,
        width: '300px',
    },
    '& label.Mui-focused': {
        color: '#b4a0a8'
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#B2BAC2',
    },
    '& .MuiOutlinedInput-root': {
    borderRadius: 0,
        '& fieldset': {
            borderRadius: 0,
            borderColor: '#E0E3E7',
        },
        '&:hover fieldset': {
            borderRadius: 0,
            borderColor: '#B2BAC2',
        },
        '&.Mui-focused fieldset': {
            borderRadius: 0,
            borderColor: '#6F7E8C',
        },
    },
    '& input:valid + fieldset': {
        borderColor: 'lightgray',
        borderRadius: 0,
        borderWidth: 1,
    },
    '& input:invalid + fieldset': {
        borderColor: '#e66161',
        borderRadius: 0,
        borderWidth: 1,
    },
    '& input:valid:focus + fieldset': {
        borderColor: '#63e399',
        borderLeftWidth: 4,
        borderRadius: 0,
        padding: '4px !important', 
    },
}));

const Button = styled.button`
    background-color: #63e399;
    padding: 10px 10px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 0;
    max-width: 130px;
    border: none;
    transition: all 0.5s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        background-color: lightgray;
        color: black;
    }

    &:disabled {
        background-color: gray;
        color: darkslategray;
    }

    &:focus {
        outline: none;
        border: none;
    }
`

const Instruction = styled.p`
    font-size: 14px;
    font-style: italic;
    color: red;
    display: ${props=>props.display};;
`

const OrBox = styled.h3`
    background-color: #63e399;
    color: white;
    border-radius: 50px;
    text-align: center;
    justify-content: center;
    align-items: center;
    display: flex;
    width: 60px;
    height: 60px;
`
//#endregion

//Validate input
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%:]).{8,24}$/;
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const REGISTER_URL = '/api/v1/auth/register';
const LOGIN_URL = '/api/v1/auth/authenticate';
const FORGOT_URL = '/api/v1/auth/forgot-password?email=';

const LoginTab = ({setPending}) => {
    const { setAuth, persist, setPersist } = useAuth(); //Authorize context

    //Router
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    //LOGIN
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [err, setErr] = useState([]);
    const [errMsgLogin, setErrMsgLogin] = useState('');
    const [errMsgReset, setErrMsgReset] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [open, setOpen] = useState(false);
    const [cookies, setCookie] = useCookies(['refreshToken']);

    useEffect(() => {
        localStorage.setItem("persist", persist);
    }, [persist])

    //Error message reset when reinput stuff
    useEffect(() => {
        setErrMsgLogin('');
    }, [userName, password])

    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        setValidEmail(result);
    }, [email])

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const togglePersist = () => {
        setPersist(prev => !prev);
    }

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setEmail('');
        setErr([]);
        setErrMsgReset('');
    }

    const endAdornment=
    <InputAdornment position="end">
        <IconButton
            aria-label="toggle password visibility"
            onClick={handleClickShowPassword}
            onMouseDown={handleMouseDownPassword}
            edge="end"
        >
            {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
    </InputAdornment>

    const handleSubmitLogin = async (e) => {
        e.preventDefault();
        const { enqueueSnackbar } = await import('notistack');

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ userName, pass: password}),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            //Store token with user info
            const accessToken = response?.data?.token;
            const refreshToken = response?.data?.refreshToken;
            const roles = response?.data?.roles;
            const authorize = { userName, roles, accessToken };

            //Set auth
            setAuth(authorize);
            
            if (persist){
                //Set refresh token lên cookie nếu ghi nhớ PERSIST
                const refreshTokenData = jwt(refreshToken);
                const expires = new Date(0);
                expires.setUTCSeconds(refreshTokenData.exp);
                setCookie('refreshToken', refreshToken, {path: '/', expires});
            }

            enqueueSnackbar('Đăng nhập thành công', { variant: 'success' });
            //Về trang vừa rồi
            navigate(from, { replace: true });
        } catch (err) {
            console.log(err);
            if (!err?.response) {
                setErrMsgLogin('Server không phản hồi');
            } else if (err.response?.status === 404) {
                setErrMsgLogin('Sai tên tài khoản hoặc mật khẩu!');
            } else if (err.response?.status === 400) {
                setErrMsgLogin('Sai định dạng thông tin!');
            } else {
                setErrMsgLogin('Đăng nhập thất bại');
            }
            errRef.current.focus();
            enqueueSnackbar('Đăng nhập thất bại', { variant: 'error' });
        }
    }

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
        <Left>
            <form onSubmit={handleSubmitLogin}>
                <Title>Đăng nhập</Title>
                <Stack spacing={1} direction="column">
                    <Instruction ref={errRef}
                    display={errMsgLogin ? "block" : "none"}
                    aria-live="assertive">
                        {errMsgLogin}
                    </Instruction>
                    <CustomInput label="Tên đăng nhập"
                        type="text"
                        id="UserName"
                        ref={userRef}
                        autoComplete="on"
                        onChange={(e) => setUserName(e.target.value)}
                        value={userName}
                        size="small"
                        margin="dense"
                    />
                    <CustomInput label='Mật khẩu' 
                        type={showPassword ? 'text' : 'password'}
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        size="small"
                        margin="dense"
                        InputProps={{
                            endAdornment: endAdornment
                        }}
                    />
                    <div className="persistCheck" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <FormControlLabel control={
                            <Checkbox id="persist"
                                checked={persist} 
                                onChange={togglePersist} 
                                disableRipple
                                name="Persist"
                                sx={{ fontSize: '12px',
                                '&.Mui-checked': {
                                color: '#63e399',
                                }}} />
                            }   
                        label="Lưu đăng nhập"
                        />
                        <a style={{textDecoration: 'underline', cursor: 'pointer', color: '#63e399'}}
                        onClick={handleOpen}>Quên mật khẩu</a>
                    </div>
                    <br/>
                    <Button>Đăng nhập</Button>
                </Stack>
            </form>
            <CustomDialog open={open} 
            scroll="body"
            onClose={handleClose}>
                <DialogTitle sx={{display: 'flex', alignItems: 'center'}}>Nhập email khôi phục mật khẩu</DialogTitle>
                <DialogContent sx={{display: 'flex', justifyContent: 'flex-end', flexDirection: 'column'}}>
                    <Instruction display={errMsgReset ? "block" : "none"} aria-live="assertive">{errMsgReset}</Instruction>
                    <CustomInput placeholder='Nhập email tài khoản' 
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        fullWidth
                        error = {(email && !validEmail) || err?.response?.data?.errors?.email}
                        helperText= {email && !validEmail ? "Email không hợp lệ!" : err?.response?.data?.errors?.email}
                        size="small"
                    />
                </DialogContent>
                <DialogActions sx={{width: '90%'}}>
                    <Button onClick={handleForgotPassword}><CheckIcon sx={{marginRight: '5px'}}/>Gửi</Button>
                </DialogActions>
            </CustomDialog>
        </Left>
    )
}

const RegisterTab = ({setPending}) => {
    const userRef = useRef();
    const errRef = useRef();

    //REGISTER
    //User validation
    const [user, setUser] = useState(''); //user input
    const [validName, setValidName] = useState(false); //check name validate or not
    const [userFocus, setUserFocus] = useState(false); //focus on field or not

    //Password validation
    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [showRegPassword, setShowRegPassword] = useState(false);

    //Email vlidation
    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    //Error and success message
    const [errMsg, setErrMsg] = useState('');
    const [err, setErr] = useState([]);

    const handleClickShowRegPassword = () => setShowRegPassword((show) => !show);

    const handleMouseDownRegPassword = (event) => {
        event.preventDefault();
    };

    const endAdornmentReg=
    <InputAdornment position="end">
        <IconButton
            aria-label="toggle password visibility"
            onClick={handleClickShowRegPassword}
            onMouseDown={handleMouseDownRegPassword}
            edge="end"
        >
            {showRegPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
    </InputAdornment>

    //Focus username
    useEffect(() => {
        userRef.current.focus();
    }, [])

    //Username
    useEffect(() => {
        const result = USER_REGEX.test(user);
        setValidName(result);
    }, [user])

    //Password
    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        setValidPwd(result);
        const match = pwd === matchPwd;
        setValidMatch(match);
    }, [pwd, matchPwd])
    
    //Email
    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        setValidEmail(result);
    }, [email])

    //Error message reset when reinput stuff
    useEffect(() => {
        setErrMsg('');
    }, [user, email, pwd, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        const v3 = EMAIL_REGEX.test(email);

        if (!v1 || !v2 || !v3) {
            setErrMsg("Sai định dạng thông tin!");
            return;
        }
        const { enqueueSnackbar } = await import('notistack');
        setPending(true);

        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ userName: user, pass: pwd , email}),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            
            setUser('');
            setPwd('');
            setMatchPwd('');
            setEmail('');
            setErr([]);
            setErrMsg('');
            enqueueSnackbar('Đăng ký thành công!', { variant: 'success' });
            setPending(false);
        } catch (err) {

            console.log(err);
            setErr(err);
            if (!err?.response) {
                setErrMsg('Server không phản hồi');
            } else if (err.response?.status === 409) {
                setErrMsg(err.response?.data?.errors?.errorMessage);
            } else if (err.response?.status === 400) {
                setErrMsg('Sai định dạng thông tin!');  
            } else {
                setErrMsg('Đăng ký thất bại!')
            }
            errRef.current.focus();
            enqueueSnackbar('Đăng ký thất bại!', { variant: 'error' });
            setPending(false);
        }
    }

    return (
        <Right>
            <form onSubmit={handleSubmit}>
                <Title>Đăng ký tài khoản mới</Title>
                <Stack spacing={1} direction="column">
                    <Instruction ref={errRef}
                    display={errMsg ? "block" : "none"}
                    aria-live="assertive">
                    {errMsg}
                    </Instruction>
                    <CustomInput label="Tên đăng nhập"
                        type="text"
                        id="regUser"
                        ref={userRef}
                        onChange={(e) => setUser(e.target.value)}
                        value={user}
                        aria-invalid={validName ? "false" : "true"}
                        aria-describedby="uidnote"
                        onFocus={() => setUserFocus(true)}
                        onBlur={() => setUserFocus(false)}
                        error = {(userFocus && user && !validName) || err?.response?.data?.errors?.userName}
                        helperText= {userFocus && user && !validName ? "4 đến 24 kí tự." : err?.response?.data?.errors?.userName}
                        size="small"
                        margin="dense"
                    />
                    <CustomInput label='Địa chỉ email' 
                        type="email"
                        id="regEmail"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        aria-invalid={validEmail ? "false" : "true"}
                        aria-describedby="uidnote"
                        onFocus={() => setEmailFocus(true)}
                        onBlur={() => setEmailFocus(false)}
                        error = {(emailFocus && email && !validEmail) || err?.response?.data?.errors?.email}
                        helperText= {emailFocus && email && !validEmail ? "Sai định dạng email." : err?.response?.data?.errors?.email}
                        size="small"
                        margin="dense"
                    />
                    <CustomInput label='Mật khẩu' 
                        type={showRegPassword ? 'text' : 'password'}
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        aria-invalid={validPwd ? "false" : "true"}
                        aria-describedby="pwdnote"
                        onFocus={() => setPwdFocus(true)}
                        onBlur={() => setPwdFocus(false)}
                        error = {(pwd && !validPwd) || err?.response?.data?.errors?.pass}
                        helperText= {pwdFocus && pwd && !validPwd ? "8 đến 24 kí tự. Phải bao gồm chữ in hoa và ký tự đặc biệt." 
                        : err?.response?.data?.errors?.pass}
                        size="small"
                        margin="dense"
                        InputProps={{
                            endAdornment: endAdornmentReg
                        }}
                    />
                    <CustomInput label='Nhập lại mật khẩu' 
                        type={showRegPassword ? 'text' : 'password'}
                        onChange={(e) => setMatchPwd(e.target.value)}
                        value={matchPwd}
                        aria-invalid={validMatch ? "false" : "true"}
                        aria-describedby="confirmnote"
                        error = {(matchPwd && !validMatch) || err?.response?.data?.errors?.pass}
                        helperText= {matchPwd && !validMatch ? "Không trùng mật khẩu." 
                        : err?.response?.data?.errors?.pass}
                        size="small"
                        margin="dense"
                        InputProps={{
                            endAdornment: endAdornmentReg
                        }}
                    />

                    <br/>
                    <Button disabled={!validName || !validPwd || !validMatch || !validEmail ? true : false}>Đăng ký</Button>
                </Stack>
            </form>
        </Right>
    )
}

function SignPage() {
    const [pending, setPending] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = `RING! - Chào mừng`;
    }, [])
    
  return (
    <Container>
        <SimpleNavbar/>
        {pending ?
        <Suspense fallBack={<></>}>
            <Pending/>
        </Suspense>
        : null
        }
        <Wrapper>
            <LoginTab setPending={setPending}/>
                <div style={{display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 80px'}}>
                    <OrBox> HOẶC</OrBox>
                </div>
            <RegisterTab setPending={setPending}/>
        </Wrapper>
    </Container>
  )
}

export default SignPage