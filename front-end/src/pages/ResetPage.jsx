import styled from 'styled-components'
import { useRef, useState, useEffect, lazy, Suspense } from "react";
import { Stack } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SimpleNavbar from "../components/navbar/SimpleNavbar";
import axios from "../api/axios";
import CustomInput from '../components/custom/CustomInput';
import CustomButton from '../components/custom/CustomButton';

const PendingIndicator = lazy(() => import('../components/authorize/PendingIndicator'));

//#region styled
const Container = styled.div`
`

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
`

const Tab = styled.div`
    display: flex;
    justify-content: center;
    width: 450px;
`

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
    const [searchParams] = useSearchParams();

    //Other
    const token = searchParams.get("token"); //Token from params
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

    //Reset passowrd
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
                JSON.stringify({ token: token, newPass: pwd, newPassRe: matchPwd }),
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
            <SimpleNavbar />
            {pending ?
                <Suspense fallBack={<></>}>
                    <PendingIndicator />
                </Suspense>
                : null
            }
            <Wrapper>
                <Tab>
                    <form onSubmit={handleSubmit}>
                        <Title>Khôi phục mật khẩu</Title>
                        <Stack spacing={1} direction="column">
                            <Instruction ref={errRef}
                                display={errMsg ? "block" : "none"}
                                aria-live="assertive">
                                {errMsg}
                            </Instruction>
                            <CustomInput
                                typeToggle={true}
                                label='Mật khẩu mới'
                                onChange={(e) => setPwd(e.target.value)}
                                value={pwd}
                                aria-invalid={validPwd ? "false" : "true"}
                                aria-describedby="pwdnote"
                                onFocus={() => setPwdFocus(true)}
                                onBlur={() => setPwdFocus(false)}
                                error={(pwd && !validPwd) || err?.response?.data?.errors?.newPass}
                                helperText={pwdFocus && pwd && !validPwd ? "8 đến 24 kí tự. Phải bao gồm chữ in hoa và ký tự đặc biệt."
                                    : err?.response?.data?.errors?.newPass}
                                size="small"
                                margin="dense"
                            />
                            <CustomInput
                                typeToggle={true}
                                label='Nhập lại mật khẩu mới'
                                onChange={(e) => setMatchPwd(e.target.value)}
                                value={matchPwd}
                                aria-invalid={validMatch ? "false" : "true"}
                                aria-describedby="confirmnote"
                                error={(matchPwd && !validMatch) || err?.response?.data?.errors?.newPassRe}
                                helperText={matchPwd && !validMatch ? "Không trùng mật khẩu." : err?.response?.data?.errors?.newPassRe}
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
                                disabled={!validPwd || !validMatch ? true : false}
                            >
                                Khôi phục
                            </CustomButton>
                        </Stack>
                    </form>
                </Tab>
            </Wrapper>
        </Container>
    )
}

export default ResetPage