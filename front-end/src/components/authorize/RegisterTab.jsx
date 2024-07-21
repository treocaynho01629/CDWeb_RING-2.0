import styled from 'styled-components';
import { useState, useRef, useEffect } from 'react';
import { Stack } from '@mui/material';
import axios from "../../app/api/axios";
import CustomInput from '../custom/CustomInput';
import CustomButton from '../custom/CustomButton';

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

//Validate input
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%:]).{8,24}$/;
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const REGISTER_URL = '/api/v1/auth/register';

const RegisterTab = ({ setPending }) => {
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

    //Error and success message
    const [errMsg, setErrMsg] = useState('');
    const [err, setErr] = useState([]);

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

    //Register
    const handleSubmit = async (e) => {
        e.preventDefault();

        //Validation
        const v1 = USER_REGEX.test(username);
        const v2 = PWD_REGEX.test(password);
        const v3 = EMAIL_REGEX.test(email);

        if (!v1 || !v2 || !v3) {
            setErrMsg("Sai định dạng thông tin!");
            return;
        }
        const { enqueueSnackbar } = await import('notistack');
        setPending(true);

        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ userName: username, pass: password, email }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            setUsername('');
            setPassword('');
            setMatchPass('');
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
        <>
            <form onSubmit={handleSubmit}>
                <Title>Đăng ký tài khoản mới</Title>
                <Stack spacing={1} direction="column">
                    <Instruction ref={errRef}
                        display={errMsg ? "block" : "none"}
                        aria-live="assertive">
                        {errMsg}
                    </Instruction>
                    <CustomInput
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
                        error={(userFocus && username && !validName) || err?.response?.data?.errors?.userName}
                        helperText={userFocus && username && !validName ? "4 đến 24 kí tự." : err?.response?.data?.errors?.userName}
                        size="small"
                        margin="dense"
                    />
                    <CustomInput
                        label='Địa chỉ email'
                        type="email"
                        id="email"
                        autoComplete="off"
                        ref={userRef}
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        aria-invalid={validEmail ? "false" : "true"}
                        aria-describedby="uidnote"
                        onFocus={() => setEmailFocus(true)}
                        onBlur={() => setEmailFocus(false)}
                        error={(emailFocus && email && !validEmail) || err?.response?.data?.errors?.email}
                        helperText={emailFocus && email && !validEmail ? "Sai định dạng email." : err?.response?.data?.errors?.email}
                        size="small"
                        margin="dense"
                    />
                    <CustomInput
                        typeToggle={true}
                        label='Mật khẩu'
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        aria-invalid={validPass ? "false" : "true"}
                        aria-describedby="new password"
                        onFocus={() => setPassFocus(true)}
                        onBlur={() => setPassFocus(false)}
                        error={(password && !validPass) || err?.response?.data?.errors?.pass}
                        helperText={passFocus && password && !validPass ? "8 đến 24 kí tự. Phải bao gồm chữ in hoa và ký tự đặc biệt."
                            : err?.response?.data?.errors?.pass}
                        size="small"
                        margin="dense"
                    />
                    <CustomInput
                        typeToggle={true}
                        label='Nhập lại mật khẩu'
                        onChange={(e) => setMatchPass(e.target.value)}
                        value={matchPass}
                        aria-invalid={validMatch ? "false" : "true"}
                        aria-describedby="confirm new password"
                        error={(matchPass && !validMatch) || err?.response?.data?.errors?.pass}
                        helperText={matchPass && !validMatch ? "Không trùng mật khẩu."
                            : err?.response?.data?.errors?.pass}
                        size="small"
                        margin="dense"
                    />

                    <br />
                    <CustomButton
                        variant="contained"
                        color="secondary"
                        size="large"
                        type="submit"
                        sx={{ width: '50%' }}
                        disabled={!validName || !validPass || !validMatch || !validEmail ? true : false}
                    >
                        Đăng ký
                    </CustomButton>
                </Stack>
            </form>
        </>
    )
}

export default RegisterTab