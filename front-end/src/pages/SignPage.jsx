import { useRef, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import styled from 'styled-components'

import SimpleNavbar from "../components/SimpleNavbar";
import { Stack } from "@mui/material";

import { useNavigate, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import jwt from 'jwt-decode';

//Style
const Container = styled.div`
`

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

const InputContainer = styled.div`
    border: 0.5px solid;
    border-color: ${props=>props.color};;
    align-items: center;
    padding: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 300px;
    height: 25px;
`

const Input = styled.input`
    border: none;
    background: transparent;
    color: black;
    resize: none;
    outline: none;
    display: flex;
    flex: 1;
`

const Button = styled.button`
    background-color: #63e399;
    padding: 7px 15px;
    width: 100px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 0;
    border: none;
    transition: all 0.5s ease;

    &:hover {
        background-color: lightgray;
        color: black;
    }

    &:disabled {
        background-color: gray;
        color: darkslategray;
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

//Validate input
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%:]).{8,24}$/;
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const REGISTER_URL = '/api/v1/auth/register';
const LOGIN_URL = '/api/v1/auth/authenticate';

function SignPage() {
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
    const [errMsgLogin, setErrMsgLogin] = useState('');
    const [cookies, setCookie] = useCookies(['refreshToken']);

    const togglePersist = () => {
        setPersist(prev => !prev);
    }

    useEffect(() => {
        localStorage.setItem("persist", persist);
    }, [persist])

    //Error message reset when reinput stuff
    useEffect(() => {
        setErrMsgLogin('');
    }, [userName, password])

    const handleSubmitLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ userName, pass: password}),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            // console.log(JSON.stringify(response?.data));

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

            //Về trang vừa rồi
            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsgLogin('No Server Response');
            } else if (err.response?.status === 404) {
                setErrMsgLogin('Sai tên tài khoản hoặc mật khẩu!');
            } else if (err.response?.status === 400) {
                setErrMsgLogin('Sai định dạng thông tin!');
            } else {
                setErrMsgLogin('Đăng nhập thất bại');
            }
            errRef.current.focus();
        }
    }

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
    const [matchFocus, setMatchFocus] = useState(false);

    //Email vlidation
    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    //Error and success message
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

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

        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ userName: user, pass: pwd , email}),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            setSuccess(true);

            setUser('');
            setPwd('');
            setMatchPwd('');
            setEmail('');
        } catch (err) {

            console.log(err);
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg(err.response?.data?.errors?.errorMessage);
            } else if (err.response?.status === 400) {
                setErrMsg('Sai định dạng thông tin!');  
            } else {
                setErrMsg('Đăng ký thất bại!')
            }
            errRef.current.focus();
        }
    }

  return (
    <>
    {success ? (
        <section>
            <h1>Success!</h1>
            <p>
                <a href="#">Sign In</a>
            </p>
        </section>
    ) : (
        <Container>
            <SimpleNavbar/>
            <Wrapper>
                <Left>
                    <form onSubmit={handleSubmitLogin}>
                        <Title>Đăng nhập</Title>
                        <Stack spacing={1} direction="column">
                            <p ref={errRef} className={errMsgLogin ? "errmsg" : "offscreen"} aria-live="assertive">{errMsgLogin}</p>
                            <InputContainer color="lightgray">
                                <Input placeholder="Tên đăng nhập"
                                type="text"
                                id="UserName"
                                ref={userRef}
                                autoComplete="on"
                                onChange={(e) => setUserName(e.target.value)}
                                value={userName}
                                />
                            </InputContainer>
                            <InputContainer color="lightgray">
                                <Input placeholder='Mật khẩu' 
                                type="password"
                                id="Pass"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                />
                            </InputContainer>

                            <div className="persistCheck" style={{display: 'flex', alignItems: 'center'}}>
                                <input
                                    type="checkbox"
                                    id="persist"
                                    onChange={togglePersist}
                                    checked={persist}
                                    style={{color: 'red'}}
                                />
                                <label htmlFor="persist" style={{fontSize: '14px'}}>Lưu đăng nhập</label>
                            </div>
                            <br/>
                            <Button>Đăng nhập</Button>
                        </Stack>
                    </form>
                </Left>
                <div style={{display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 80px'}}>
                    <OrBox> HOẶC</OrBox>
                </div>
                <Right>
                    <form onSubmit={handleSubmit}>
                        <Title>Đăng ký tài khoản mới</Title>
                        <Stack spacing={1} direction="column">
                            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                            <Instruction display={userFocus && user && !validName ? "block" : "none"}>
                                4 đến 24 kí tự.
                            </Instruction>
                        
                            <Instruction display={emailFocus && email && !validEmail ? "block" : "none"}>
                                Sai định dạng email.
                            </Instruction>

                            <Instruction display={pwdFocus && !validPwd ? "block" : "none"}>
                                8 đến 24 kí tự. Phải bao gồm chữ in hoa và ký tự đặc biệt.
                            </Instruction>

                            <Instruction display={matchFocus && !validMatch ? "block" : "none"}>
                                Không trùng mật khẩu.
                            </Instruction>
                            <InputContainer color={user && !validName ? "red" : "lightgray"}>
                                <Input placeholder="Tên đăng nhập"
                                type="text"
                                id="regUser"
                                ref={userRef}
                                autoComplete="off"
                                onChange={(e) => setUser(e.target.value)}
                                value={user}
                                required
                                aria-invalid={validName ? "false" : "true"}
                                aria-describedby="uidnote"
                                onFocus={() => setUserFocus(true)}
                                onBlur={() => setUserFocus(false)}/>
                            </InputContainer>
                            <InputContainer color={email && !validEmail ? "red" : "lightgray"}>
                                <Input placeholder='Địa chỉ email' 
                                type="email"
                                id="regEmail"
                                ref={userRef}
                                autoComplete="off"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                required
                                aria-invalid={validEmail ? "false" : "true"}
                                aria-describedby="uidnote"
                                onFocus={() => setEmailFocus(true)}
                                onBlur={() => setEmailFocus(false)}/>
                            </InputContainer>
                            <InputContainer color={pwd && !validPwd ? "red" : "lightgray"}>
                                <Input placeholder='Mật khẩu' 
                                type="password"
                                id="regPass"
                                onChange={(e) => setPwd(e.target.value)}
                                value={pwd}
                                required
                                aria-invalid={validPwd ? "false" : "true"}
                                aria-describedby="pwdnote"
                                onFocus={() => setPwdFocus(true)}
                                onBlur={() => setPwdFocus(false)}/>
                            </InputContainer>
                            <InputContainer color={matchPwd && !validMatch ? "red" : "lightgray"}>
                                <Input placeholder='Nhập lại mật khẩu' 
                                type="password"
                                id="regConfirmPass"
                                onChange={(e) => setMatchPwd(e.target.value)}
                                value={matchPwd}
                                required
                                aria-invalid={validMatch ? "false" : "true"}
                                aria-describedby="confirmnote"
                                onFocus={() => setMatchFocus(true)}
                                onBlur={() => setMatchFocus(false)}/>
                            </InputContainer>

                            <br/>
                            <Button disabled={!validName || !validPwd || !validMatch || !validEmail ? true : false}>Đăng ký</Button>
                        </Stack>
                    </form>
                </Right>
            </Wrapper>
        </Container>
    )}
    </>
  )
}

export default SignPage