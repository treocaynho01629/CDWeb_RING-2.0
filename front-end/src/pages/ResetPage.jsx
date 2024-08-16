import styled from 'styled-components'
import { useRef, useState, useEffect, lazy, Suspense } from "react";
import { Stack, Button } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useResetMutation } from '../features/auth/authApiSlice';
import { PWD_REGEX } from '../ultils/regex';
import { Instruction } from '../components/custom/GlobalComponent';
import SimpleNavbar from "../components/navbar/SimpleNavbar";
import CustomPasswordInput from '../components/custom/CustomPasswordInput';

const PendingIndicator = lazy(() => import('../components/layout/PendingIndicator'));

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
//#endregion

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

    //Reset mutation
    const [reset, { isLoading }] = useResetMutation();

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
        if (pending) return;

        //Validation
        const v2 = PWD_REGEX.test(pwd);
        if (!v2) {
            setErrMsg("Sai định dạng thông tin!");
            return;
        }

        setPending(true);

        const { enqueueSnackbar } = await import('notistack');

        reset({
            token: token,
            newPass: pwd,
            newPassRe: matchPwd
        }).unwrap()
            .then((data) => {
                //Reset input
                setPwd('');
                setMatchPwd('');
                setErr([]);
                setErrMsg('');

                //Queue snack
                enqueueSnackbar('Đổi mật khẩu thành công!', { variant: 'success' });
                navigate('/login');
                setPending(false);
            })
            .catch((err) => {
                console.error(err);
                setErr(err);
                if (!err?.status) {
                    setErrMsg('Server không phản hồi');
                } else if (err?.status === 409) {
                    setErrMsg(err?.data?.errors?.errorMessage);
                } else if (err?.status === 400) {
                    setErrMsg('Sai định dạng thông tin!');
                } else if (err?.status === 404) {
                    setErrMsg('Token không tồn tại!');
                } else {
                    setErrMsg('Khôi phục thất bại!')
                }
                errRef.current.focus();
                setPending(false);
            })
    }

    return (
        <Container>
            <SimpleNavbar />
            {(pending) ?
                <Suspense fallBack={<></>}>
                    <PendingIndicator open={pending} message="Đang gửi yêu cầu..." />
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
                            <CustomPasswordInput
                                label='Mật khẩu mới'
                                onChange={(e) => setPwd(e.target.value)}
                                value={pwd}
                                aria-invalid={validPwd ? "false" : "true"}
                                aria-describedby="pwdnote"
                                onFocus={() => setPwdFocus(true)}
                                onBlur={() => setPwdFocus(false)}
                                error={(pwd && !validPwd) || err?.data?.errors?.newPass}
                                helperText={pwdFocus && pwd && !validPwd ? "8 đến 24 kí tự. Phải bao gồm chữ in hoa và ký tự đặc biệt."
                                    : err?.data?.errors?.newPass}
                                size="small"
                                margin="dense"
                            />
                            <CustomPasswordInput
                                label='Nhập lại mật khẩu mới'
                                onChange={(e) => setMatchPwd(e.target.value)}
                                value={matchPwd}
                                aria-invalid={validMatch ? "false" : "true"}
                                aria-describedby="confirmnote"
                                error={(matchPwd && !validMatch) || err?.data?.errors?.newPassRe}
                                helperText={matchPwd && !validMatch ? "Không trùng mật khẩu." : err?.data?.errors?.newPassRe}
                                size="small"
                                margin="dense"
                            />

                            <br />
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                type="submit"
                                sx={{ width: '50%' }}
                                disabled={!validPwd || !validMatch ? true : false}
                            >
                                Khôi phục
                            </Button>
                        </Stack>
                    </form>
                </Tab>
            </Wrapper>
        </Container>
    )
}

export default ResetPage