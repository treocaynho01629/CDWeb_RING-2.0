import styled from "styled-components"
import { useEffect, useState } from "react";
import { Box, Button, FormControlLabel, Radio, RadioGroup, MenuItem, Skeleton, TextField } from "@mui/material";
import { Check, Person } from "@mui/icons-material";
import { PHONE_REGEX } from "../../ultils/regex";
import { useGetProfileQuery, useUpdateProfileMutation } from "../../features/users/usersApiSlice";
import { Instruction, Title } from '../custom/GlobalComponents';
import CustomDatePicker from "../custom/CustomDatePicker";
import dayjs from 'dayjs';

//#region styled
const Wrapper = styled.div`
    ${props => props.theme.breakpoints.down("sm")} {
        padding: 0 15px;
    }
`

const InfoText = styled.h4`
    margin: 15px 0px;
    white-space: nowrap;

    &.edit {
        white-space: nowrap;
        margin-left: 15px;
        text-decoration: underline;
        cursor: pointer;
        color: ${props => props.theme.palette.primary.main};
    }

    &.disabled {
        pointer-events: none;
        color: ${props => props.theme.palette.action.disabled};
    }
`

const InfoTitle = styled.td`
    height: 56px;
    width: 35%;
`

const InfoStack = styled.td`
    height: 56px;
    padding-left: 10px;
`

const InfoStackContainer = styled.div`
    height: 56px;
    display: flex;
    align-items: center;

    ${props => props.theme.breakpoints.down("sm")} {
        justify-content: space-between;
    }
`
//#endregion

const ProfileDetail = ({ pending, setPending }) => {
    //Fetch current profile
    const { data: profile, isLoading: loadProfile, isSuccess: profileDone, isError: profileError } = useGetProfileQuery();

    //Initial value
    const [errMsg, setErrMsg] = useState('');
    const [err, setErr] = useState([]);
    const [name, setName] = useState(profile?.name || '');
    const [dob, setDob] = useState(profile?.dob ? dayjs(profile?.dob) : dayjs('2000-01-01'));
    const [gender, setGender] = useState(profile?.gender || '');
    const [phone, setPhone] = useState(profile?.phone || '');
    const [validPhone, setValidPhone] = useState(false);
    const [editPhone, setEditPhone] = useState(false);
    const [editDob, setEditDob] = useState(false);

    //Update profile hook
    const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();

    //Set data
    useEffect(() => {
        if (!loadProfile && profileDone && profile) {
            setName(profile?.name);
            setPhone(profile?.phone);
            setGender(profile?.gender);
            setDob(dayjs(profile?.dob));
        }
    }, [profile])

    useEffect(() => {
        const result = PHONE_REGEX.test(phone);
        setValidPhone(result);
    }, [phone])

    const handleChangeInfo = async (e) => {
        e.preventDefault();
        if (pending) return;

        //Validation
        const valid = PHONE_REGEX.test(phone);
        if (!valid && phone) { return }

        setPending(true);
        const { enqueueSnackbar } = await import('notistack');

        updateProfile({
            name,
            phone,
            gender,
            dob: dob.format('YYYY-MM-DD'),
            address: profile?.address
        }).unwrap()
            .then((data) => {
                setErrMsg('');
                setErr([]);
                enqueueSnackbar('Sửa thông tin thành công!', { variant: 'success' });
                setPending(false);
            })
            .catch((err) => {
                console.error(err);
                setErr(err);
                if (!err?.status) {
                    setErrMsg('Server không phản hồi');
                } else if (err?.status === 400) {
                    setErrMsg('Sai định dạng thông tin!');
                } else {
                    setErrMsg('Cập nhật hồ sơ thất bại');
                }
                setPending(false);
            })
    }

    return (
        <Wrapper>
            <Title className="primary"><Person />&nbsp;Hồ sơ của bạn</Title>
            <Instruction display={errMsg ? "block" : "none"} aria-live="assertive">{errMsg}</Instruction>
            <Box sx={{ paddingBottom: '100px' }}>
                <table style={{ width: '100%' }}>
                    <tbody>
                        <tr>
                            <InfoTitle><InfoText>Tên đăng nhập: </InfoText></InfoTitle>
                            <InfoStack><InfoStackContainer>
                                {loadProfile
                                    ?
                                    <Skeleton variant="text" sx={{ fontSize: '16px' }} width="30%" />
                                    :
                                    <InfoText>{profile?.userName}</InfoText>
                                }
                            </InfoStackContainer></InfoStack>
                        </tr>
                        <tr>
                            <InfoTitle><InfoText>Email: </InfoText></InfoTitle>
                            <InfoStack>
                                <InfoStackContainer>
                                    {loadProfile
                                        ?
                                        <Skeleton variant="text" sx={{ fontSize: '16px' }} width="40%" />
                                        :
                                        <InfoText>{profile?.email.replace(/(\w{3})[\w.-]+@([\w.]+\w)/, "$1***@$2")}</InfoText>
                                    }
                                </InfoStackContainer>
                            </InfoStack>
                        </tr>
                        <tr>
                            <InfoTitle><InfoText>Tên: </InfoText></InfoTitle>
                            <InfoStack>
                                <InfoStackContainer>
                                    {loadProfile
                                        ?
                                        <Skeleton variant="rectangular" height={40} width={'100%'} />
                                        :
                                        <TextField
                                            required
                                            type="text"
                                            id="name"
                                            onChange={e => setName(e.target.value)}
                                            value={name}
                                            error={err?.data?.errors?.name}
                                            helperText={err?.data?.errors?.name}
                                            size="small"
                                            fullWidth
                                        />
                                    }
                                </InfoStackContainer>
                            </InfoStack>
                        </tr>
                        <tr>
                            <InfoTitle><InfoText>Số điện thoại: </InfoText></InfoTitle>
                            <InfoStack>
                                <InfoStackContainer>
                                    {editPhone
                                        ?
                                        <TextField
                                            required
                                            id="phone"
                                            onChange={e => setPhone(e.target.value)}
                                            value={phone}
                                            error={phone && !validPhone || err?.data?.errors?.phone}
                                            helperText={phone && !validPhone ? "Sai định dạng số điện thoại!" : err?.data?.errors?.phone}
                                            size="small"
                                            fullWidth
                                        />
                                        :
                                        <>
                                            {loadProfile
                                                ?
                                                <Skeleton variant="text" sx={{ fontSize: '16px' }} width="25%" />
                                                :
                                                <InfoText>{phone.replace(/\d(?=\d{2})/g, '*')}</InfoText>
                                            }
                                            <InfoText className={`edit ${loadProfile ? 'disabled' : ''}`} onClick={() => setEditPhone(true)}>Thay đổi</InfoText>
                                        </>
                                    }
                                </InfoStackContainer>
                            </InfoStack>
                        </tr>
                        <tr>
                            <InfoTitle><InfoText>Ngày sinh: </InfoText></InfoTitle>
                            <InfoStack>
                                <InfoStackContainer>
                                    {editDob
                                        ?
                                        <CustomDatePicker
                                            required
                                            value={dob}
                                            className="custom-date-picker"
                                            onChange={newValue => setDob(newValue)}
                                            size="small"
                                            slotProps={{
                                                textField: {
                                                    size: "small",
                                                    fullWidth: true,
                                                    error: err?.data?.errors?.dob,
                                                    helperText: err?.data?.errors?.dob,
                                                },
                                            }}
                                        />
                                        :
                                        <>
                                            {loadProfile
                                                ?
                                                <Skeleton variant="text" sx={{ fontSize: '16px' }} width="30%" />
                                                :
                                                <InfoText>{dob.format('DD/MM/YYYY')}</InfoText>
                                            }
                                            <InfoText className={`edit ${loadProfile ? 'disabled' : ''}`} onClick={() => setEditDob(true)}>Thay đổi</InfoText>
                                        </>
                                    }
                                </InfoStackContainer>
                            </InfoStack>
                        </tr>
                        <tr>
                            <InfoTitle><InfoText>Giới tính: </InfoText></InfoTitle>
                            <InfoStack>
                                <InfoStackContainer>
                                    <RadioGroup
                                        spacing={1}
                                        row
                                        value={gender}
                                        onChange={e => setGender(e.target.value)}
                                        sx={{ display: { xs: 'none', sm: 'block' } }}
                                    >
                                        <FormControlLabel disabled={loadProfile} value="Nam" control={<Radio color="primary" />} label="Nam" />
                                        <FormControlLabel disabled={loadProfile} value="Nữ" control={<Radio color="primary" />} label="Nữ" />
                                        <FormControlLabel disabled={loadProfile} value="" control={<Radio color="primary" />} label="Không" />
                                    </RadioGroup>
                                    {loadProfile
                                        ?
                                        <Skeleton variant="rectangular" height={40} width={'100%'} sx={{ display: { xs: 'flex', sm: 'none' } }} />
                                        :
                                        <TextField
                                            required
                                            select
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                            size="small"
                                            fullWidth
                                            sx={{ display: { xs: 'flex', sm: 'none' } }}
                                        >
                                            <MenuItem value="Nam">Nam</MenuItem>
                                            <MenuItem value="Nữ">Nữ</MenuItem>
                                            <MenuItem value="">Không</MenuItem>
                                        </TextField>
                                    }
                                </InfoStackContainer>
                            </InfoStack>
                        </tr>
                    </tbody>
                </table>
                <InfoStackContainer>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={loadProfile}
                        sx={{ marginTop: 5 }}
                        onClick={handleChangeInfo}
                        startIcon={<Check />}
                    >
                        Lưu thông tin
                    </Button>
                </InfoStackContainer>
            </Box>
        </Wrapper>
    )
}

export default ProfileDetail