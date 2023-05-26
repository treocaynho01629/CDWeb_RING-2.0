import { useRef, useState, useEffect, lazy, Suspense } from "react";
import styled from 'styled-components'
import { styled as muiStyled } from '@mui/material/styles';

import { Stack, TextField, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from "../api/axios";

import SimpleNavbar from "../components/SimpleNavbar";
const Pending = lazy(() => import('../components/authorize/Pending'));

//#region styled
const Container = styled.div`
`

const Wrapper = styled.div`
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 100px;

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
//#endregion

//Validate input
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%:]).{8,24}$/;
const RESET_URL = '/api/v1/auth/reset-password';

function ResetPage() {
    //Password validation
    const [pending, setPending] = useState(false);
    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);
    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [err, setErr] = useState([]);
    const [show, setShow] = useState(false);
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");
    const errRef = useRef();
    const navigate = useNavigate();

    //Password
    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        setValidPwd(result);
        const match = pwd === matchPwd;
        setValidMatch(match);
    }, [pwd, matchPwd])

    //Error message reset when reinput stuff
    useEffect(() => {
        setErrMsg('');
    }, [pwd, matchPwd])

    const handleClickShow = () => setShow((show) => !show);

    const handleMouseDown = (event) => {
        event.preventDefault();
    };

    const endAdornment=
    <InputAdornment position="end">
        <IconButton
            aria-label="toggle password visibility"
            onClick={handleClickShow}
            onMouseDown={handleMouseDown}
            edge="end"
        >
            {show ? <VisibilityOff /> : <Visibility />}
        </IconButton>
    </InputAdornment>

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v2 = PWD_REGEX.test(pwd);

        if (!v2) {
            setErrMsg("Sai định dạng thông tin!");
            return;
        }

        setPending(true);

        try {
            const response = await axios.put(RESET_URL,
                JSON.stringify({ token: token, newPass: pwd , newPassRe: matchPwd}),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            
            const { enqueueSnackbar } = await import('notistack');
            
            setPwd('');
            setMatchPwd('');
            setErr([]);
            setErrMsg('');
            enqueueSnackbar('Đổi mật khẩu thành công!', { variant: 'success' });
            navigate('/login');
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
            } else if (err.response?.status === 404) {
                setErrMsg('Token không tồn tại!');  
            } else {
                setErrMsg('Khôi phục thất bại!')
            }
            errRef.current.focus();
            setPending(false);
        }
    }
    
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
            <form onSubmit={handleSubmit}>
                <Title>Khôi phục mật khẩu</Title>
                <Stack spacing={1} direction="column">
                    <Instruction ref={errRef}
                    display={errMsg ? "block" : "none"}
                    aria-live="assertive">
                    {errMsg}
                    </Instruction>
                    <CustomInput label='Mật khẩu mới' 
                        type={show ? 'text' : 'password'}
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        aria-invalid={validPwd ? "false" : "true"}
                        aria-describedby="pwdnote"
                        onFocus={() => setPwdFocus(true)}
                        onBlur={() => setPwdFocus(false)}
                        error = {(pwd && !validPwd) || err?.response?.data?.errors?.newPass}
                        helperText= {pwdFocus && pwd && !validPwd ? "8 đến 24 kí tự. Phải bao gồm chữ in hoa và ký tự đặc biệt." 
                        : err?.response?.data?.errors?.newPass}
                        size="small"
                        margin="dense"
                        InputProps={{
                            endAdornment: endAdornment
                        }}
                    />
                    <CustomInput label='Nhập lại mật khẩu mới' 
                        type={show ? 'text' : 'password'}
                        onChange={(e) => setMatchPwd(e.target.value)}
                        value={matchPwd}
                        aria-invalid={validMatch ? "false" : "true"}
                        aria-describedby="confirmnote"
                        error = {(matchPwd && !validMatch) || err?.response?.data?.errors?.newPassRe}
                        helperText= {matchPwd && !validMatch ? "Không trùng mật khẩu." : err?.response?.data?.errors?.newPassRe}
                        size="small"
                        margin="dense"
                        InputProps={{
                            endAdornment: endAdornment
                        }}
                    />

                    <br/>
                    <Button disabled={!validPwd || !validMatch ? true : false}>Khôi phục</Button>
                </Stack>
            </form>
        </Wrapper>
    </Container>
  )
}

export default ResetPage