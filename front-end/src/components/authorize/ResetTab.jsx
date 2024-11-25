import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router';
import { AuthForm, AuthTitle, ConfirmButton } from '../custom/CustomAuthComponents';
import { Stack } from '@mui/material';
import { Instruction } from '../custom/GlobalComponents';
import { PWD_REGEX } from '../../ultils/regex';
import { useResetMutation } from '../../features/auth/authApiSlice';
import CustomPasswordInput from '../custom/CustomPasswordInput';

//#region styled

//#endregion

const ResetTab = ({ token }) => {
    //Password validation
    const [password, setPassword] = useState('');
    const [validPass, setValidPass] = useState(false);
    const [passFocus, setPassFocus] = useState(false);
    const [matchPass, setMatchPass] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [err, setErr] = useState([]);

    //Other
    const errRef = useRef();
    const navigate = useNavigate();

    //Reset mutation
    const [reset, { isLoading: reseting }] = useResetMutation();

    //Password
    useEffect(() => {
        const result = PWD_REGEX.test(password);
        setValidPass(result);
        const match = password === matchPass;
        setValidMatch(match);
    }, [password, matchPass])

    //Error message reset when reinput stuff
    useEffect(() => {
        setErrMsg('');
    }, [password, matchPass])

    //Reset passowrd
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (reseting || pending) return;

        //Validation
        const v2 = PWD_REGEX.test(password);
        if (!v2) {
            setErrMsg("Sai định dạng thông tin!");
            return;
        }

        setPending(true);

        const { enqueueSnackbar } = await import('notistack');

        reset({
            token: token,
            newPass: password,
            newPassRe: matchPass
        }).unwrap()
            .then((data) => {
                //Reset input
                setPassword('');
                setMatchPass('');
                setErr([]);
                setErrMsg('');

                //Queue snack
                enqueueSnackbar('Đổi mật khẩu thành công!', { variant: 'success' });
                navigate('/auth/login');
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
                    setErrMsg('Link không hợp lệ!');
                } else {
                    setErrMsg('Khôi phục thất bại!')
                }
                errRef.current.focus();
                setPending(false);
            })
    }

    return (
        <AuthForm onSubmit={handleSubmit}>
            <AuthTitle>Khôi phục mật khẩu</AuthTitle>
            <Stack spacing={2} direction="column">
                <Instruction ref={errRef}
                    display={errMsg ? "block" : "none"}
                    aria-live="assertive">
                    {errMsg}
                </Instruction>
                <CustomPasswordInput
                    label='Mật khẩu mới'
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    aria-invalid={validPass ? "false" : "true"}
                    onFocus={() => setPassFocus(true)}
                    onBlur={() => setPassFocus(false)}
                    error={(password && !validPass) || err?.data?.errors?.newPass}
                    helperText={passFocus && password && !validPass ? "8 đến 24 kí tự. Phải bao gồm chữ in hoa và ký tự đặc biệt."
                        : err?.data?.errors?.newPass}
                />
                <CustomPasswordInput
                    label='Nhập lại mật khẩu mới'
                    onChange={(e) => setMatchPass(e.target.value)}
                    value={matchPass}
                    aria-invalid={validMatch ? "false" : "true"}
                    error={(matchPass && !validMatch) || err?.data?.errors?.newPassRe}
                    helperText={matchPass && !validMatch ? "Không trùng mật khẩu." : err?.data?.errors?.newPassRe}
                />
                <br/>
                <ConfirmButton
                    variant="contained"
                    color="primary"
                    size="large"
                    type="submit"
                    disabled={!validPass || !validMatch ? true : false}
                >
                    Khôi phục
                </ConfirmButton>
            </Stack>
        </AuthForm>
    )
}

export default ResetTab