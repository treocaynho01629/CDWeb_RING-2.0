import styled from "styled-components"
import { useEffect, useState, lazy, Suspense } from "react";
import { Button, FormControlLabel, Radio, RadioGroup, MenuItem, Skeleton, TextField } from "@mui/material";
import { Check, KeyboardArrowLeft, KeyboardArrowRight, Person } from "@mui/icons-material";
import { PHONE_REGEX } from "../../ultils/regex";
import { useUpdateProfileMutation } from "../../features/users/usersApiSlice";
import { Instruction, MobileExtendButton, Title } from '../custom/GlobalComponents';
import { Link } from "react-router-dom";
import dayjs from 'dayjs';

const CustomDatePicker = lazy(() => import('../custom/CustomDatePicker'));

//#region styled
const TableContainer = styled.table`
    width: 100%;
`

const InfoText = styled.span`
    font-weight: 450;
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

const InfoRow = styled.tr`
    ${props => props.theme.breakpoints.down("sm")} {
        font-size: 15px;
    }
`

const InfoTitle = styled.td`
    width: 35%;  
`

const InfoStack = styled.td`
    padding-left: 10px;
`

const InfoStackContainer = styled.div`
    position: relative;
    height: 56px;
    display: flex;
    align-items: center;

    ${props => props.theme.breakpoints.down("sm")} {
        justify-content: space-between;
    }
`
//#endregion

const ProfileDetail = ({ pending, setPending, profile, loading, isSuccess, tabletMode }) => {
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
        if (!loading && isSuccess && profile) {
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
        if (updating || pending) return;

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

    return ( //FIX profile pic
        <>
            <Title className="primary">
                <Link to={'/profile/detail'}><KeyboardArrowLeft /></Link>
                <Person />&nbsp;Hồ sơ của bạn
            </Title>
            <Instruction display={errMsg ? "block" : "none"} aria-live="assertive">{errMsg}</Instruction>
            <TableContainer>
                <tbody>
                    <InfoRow>
                        <InfoTitle><InfoText>Tên đăng nhập </InfoText></InfoTitle>
                        <InfoStack><InfoStackContainer>
                            {loading
                                ?
                                <Skeleton variant="text" sx={{ fontSize: '16px' }} width="30%" />
                                :
                                <InfoText>{profile?.username}</InfoText>
                            }
                        </InfoStackContainer></InfoStack>
                    </InfoRow>
                    <InfoRow>
                        <InfoTitle><InfoText>Email </InfoText></InfoTitle>
                        <InfoStack>
                            <InfoStackContainer>
                                {loading
                                    ?
                                    <Skeleton variant="text" sx={{ fontSize: '16px' }} width="40%" />
                                    :
                                    <InfoText>{profile?.email.replace(/(\w{3})[\w.-]+@([\w.]+\w)/, "$1***@$2")}</InfoText>
                                }
                            </InfoStackContainer>
                        </InfoStack>
                    </InfoRow>
                    <InfoRow>
                        <InfoTitle><InfoText>Họ & Tên </InfoText></InfoTitle>
                        <InfoStack>
                            <InfoStackContainer>
                                {loading
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
                    </InfoRow>
                    <InfoRow>
                        <InfoTitle><InfoText>Số điện thoại </InfoText></InfoTitle>
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
                                        {loading
                                            ?
                                            <Skeleton variant="text" sx={{ fontSize: '16px' }} width="25%" />
                                            :
                                            <InfoText>{phone.replace(/\d(?=\d{2})/g, '*')}</InfoText>
                                        }
                                        <InfoText className={`edit ${loading ? 'disabled' : ''}`} onClick={() => setEditPhone(true)}>Thay đổi</InfoText>
                                    </>
                                }
                            </InfoStackContainer>
                        </InfoStack>
                    </InfoRow>
                    <InfoRow>
                        <InfoTitle><InfoText>Ngày sinh </InfoText></InfoTitle>
                        <InfoStack>
                            <InfoStackContainer>
                                {editDob ?
                                    <Suspense fallback={<>
                                        {loading ? <Skeleton variant="text" sx={{ fontSize: '16px' }} width="30%" />
                                            : <InfoText>{dob.format('DD/MM/YYYY')}</InfoText>}
                                        <InfoText className={`edit ${loading ? 'disabled' : ''}`} onClick={() => setEditDob(true)}>Thay đổi</InfoText>
                                    </>}>
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
                                    </Suspense>
                                    :
                                    <>
                                        {loading ? <Skeleton variant="text" sx={{ fontSize: '16px' }} width="30%" />
                                            : <InfoText>{dob.format('DD/MM/YYYY')}</InfoText>}
                                        <InfoText className={`edit ${loading ? 'disabled' : ''}`} onClick={() => setEditDob(true)}>Thay đổi</InfoText>
                                    </>
                                }
                            </InfoStackContainer>
                        </InfoStack>
                    </InfoRow>
                    <InfoRow>
                        <InfoTitle><InfoText>Giới tính </InfoText></InfoTitle>
                        <InfoStack>
                            <InfoStackContainer>
                                {tabletMode ?
                                    loading ? <Skeleton variant="rectangular" height={40} width="100%" />
                                        :
                                        <TextField
                                            required
                                            select
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                            size="small"
                                            fullWidth
                                        >
                                            <MenuItem value="Nam">Nam</MenuItem>
                                            <MenuItem value="Nữ">Nữ</MenuItem>
                                            <MenuItem value="">Không</MenuItem>
                                        </TextField>

                                    :
                                    loading ?
                                        <>
                                            <Skeleton variant="text" width={75} sx={{ fontSize: 14, mr: 2 }} />
                                            <Skeleton variant="text" width={75} sx={{ fontSize: 14, mr: 2 }} />
                                            <Skeleton variant="text" width={75} sx={{ fontSize: 14 }} />
                                        </>
                                        :
                                        <RadioGroup
                                            spacing={1}
                                            row
                                            value={gender}
                                            onChange={e => setGender(e.target.value)}
                                        >
                                            <FormControlLabel value="Nam" control={<Radio color="primary" />} label="Nam" />
                                            <FormControlLabel value="Nữ" control={<Radio color="primary" />} label="Nữ" />
                                            <FormControlLabel value="" control={<Radio color="primary" />} label="Không" />
                                        </RadioGroup>
                                }
                            </InfoStackContainer>
                        </InfoStack>
                    </InfoRow>
                    {tabletMode &&
                        <>
                            <InfoRow>
                                <InfoTitle><InfoText>Sổ địa chỉ </InfoText></InfoTitle>
                                <InfoStack>
                                    <Link to={'/profile/detail/address'}>
                                        <InfoStackContainer>
                                            <MobileExtendButton>
                                                <KeyboardArrowRight fontSize="small" />
                                            </MobileExtendButton>
                                        </InfoStackContainer>
                                    </Link>
                                </InfoStack>
                            </InfoRow>
                            <InfoRow>
                                <InfoTitle><InfoText>Thiết lập mật khẩu </InfoText></InfoTitle>
                                <InfoStack>
                                    <Link to={'/profile/detail/password'}>
                                        <InfoStackContainer>
                                            <MobileExtendButton>
                                                <KeyboardArrowRight fontSize="small" />
                                            </MobileExtendButton>
                                        </InfoStackContainer>
                                    </Link>
                                </InfoStack>
                            </InfoRow>
                        </>
                    }
                </tbody>
            </TableContainer>
            <Button
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                onClick={handleChangeInfo}
                sx={{ mt: 2, mb: 4 }}
                startIcon={<Check />}
            >
                Lưu thông tin
            </Button>
        </>
    )
}

export default ProfileDetail