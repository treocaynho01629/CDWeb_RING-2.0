import styled from "styled-components"
import { styled as muiStyled } from '@mui/material/styles';
import { useEffect, useState } from "react";
import { useGetProfileQuery } from "../../features/users/usersApiSlice";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Box, FormControl, FormControlLabel, Grid, Radio, RadioGroup, Stack, Avatar } from "@mui/material";
import { Person } from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from 'dayjs';
import ResetPassDialog from "./ResetPassDialog";
import CustomProgress from "../custom/CustomProgress"
import CustomInput from "../custom/CustomInput";
import CustomButton from "../custom/CustomButton";

//#region styled
const InfoText = styled.h4`
    margin: 15px 0px;
`

const InfoStack = styled.div`
    height: 56px;
    display: flex;
    align-items: center;
`

const CustomDatePicker = muiStyled(DatePicker)(({ theme }) => ({
    '& .MuiInputBase-root': {
        borderRadius: 0,
        width: '80%',
    },
    '& label.Mui-focused': {
        color: theme.palette.action.focus
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: theme.palette.action.focus,
    },
    '& .MuiOutlinedInput-root': {
        borderRadius: 0,
        '& fieldset': {
            borderRadius: 0,
            borderColor: theme.palette.action.focus,
        },
        '&:hover fieldset': {
            borderRadius: 0,
            borderColor: theme.palette.action.hover,
        },
        '&.Mui-focused fieldset': {
            borderRadius: 0,
            borderColor: theme.palette.action.focus,
        },
    },
    '& input:valid + fieldset': {
        borderColor: theme.palette.action.focus,
        borderRadius: 0,
        borderWidth: 1,
    },
    '& input:invalid + fieldset': {
        borderColor: theme.palette.error.main,
        borderRadius: 0,
        borderWidth: 1,
    },
    '& input:valid:focus + fieldset': {
        borderColor: theme.palette.secondary.main,
        borderLeftWidth: 4,
        borderRadius: 0,
        padding: '4px !important',
    },
}));
//#endregion

const PHONE_REGEX = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;

const ProfileDetail = ({ ContentContainer, Title, openDialog, handleCloseDialog }) => {
    //Initial value
    const [err, setErr] = useState([]);
    const [name, setName] = useState('');
    const [validPhone, setValidPhone] = useState(false);
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState(dayjs('2000-01-01'));

    //Fetch current profile
    const { data, isLoading, isSuccess } = useGetProfileQuery();

    useEffect(() => {
        if (!isLoading && isSuccess && data) {
            setName(data?.name);
            setPhone(data?.phone);
            setAddress(data?.address);
            setGender(data?.gender);
            setDob(dayjs(data?.dob));
        }
    }, [isLoading])

    useEffect(() => {
        const result = PHONE_REGEX.test(phone);
        setValidPhone(result);
    }, [phone])

    const handleChangeInfo = async (e) => {
        e.preventDefault();

        const valid = PHONE_REGEX.test(phone);

        if (!valid && phone) {
            return;
        }

        try {
            const response = await axiosPrivate.put(PROFILE_URL,
                JSON.stringify({
                    name: name,
                    phone: phone,
                    gender: gender,
                    address: address,
                    dob: dob.format('YYYY-MM-DD')
                }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            setErr([]);
            const { enqueueSnackbar } = await import('notistack');
            enqueueSnackbar('Sửa thông tin thành công!', { variant: 'success' });
            refetch();
        } catch (err) {
            console.error(err);
            setErr(err);
            if (!err?.response) {
            } else if (err.response?.status === 409) {
            } else if (err.response?.status === 400) {
            } else {
            }
        }
    }

    return <>
        <ContentContainer>
            <Title><Person />&nbsp;HỒ SƠ CỦA BẠN</Title>
            {isLoading ? <CustomProgress color="secondary" /> : <Box sx={{ paddingBottom: '100px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={4} lg={3}>
                        <Stack spacing={0}>
                            <InfoStack><InfoText>Tên đăng nhập: </InfoText></InfoStack>
                            <InfoStack><InfoText>Email: </InfoText></InfoStack>
                            <InfoStack><InfoText>Tên: </InfoText></InfoStack>
                            <InfoStack><InfoText>Số điện thoại: </InfoText></InfoStack>
                            <InfoStack><InfoText>Ngày sinh: </InfoText></InfoStack>
                            <InfoStack><InfoText>Địa chỉ: </InfoText></InfoStack>
                            <InfoStack><InfoText>Giới tính: </InfoText></InfoStack>
                        </Stack>
                    </Grid>
                    <Grid item xs={8} lg={6}>
                        <Stack spacing={0}>
                            <InfoStack><InfoText>{data?.userName} </InfoText></InfoStack>
                            <InfoStack><InfoText>{data?.email.replace(/(\w{3})[\w.-]+@([\w.]+\w)/, "$1***@$2")}</InfoText></InfoStack>
                            <InfoStack>
                                <CustomInput
                                    type="text"
                                    id="name"
                                    onChange={e => setName(e.target.value)}
                                    value={name}
                                    error={err?.data?.errors?.firstName}
                                    helperText={err?.data?.errors?.firstName}
                                    size="small"
                                    sx={{ width: '80%' }}
                                />
                            </InfoStack>
                            <InfoStack>
                                <CustomInput
                                    id="phone"
                                    onChange={e => setPhone(e.target.value)}
                                    value={phone.replace(/\d(?=\d{2})/g, '*')}
                                    error={phone && !validPhone || err?.data?.errors?.phone}
                                    helperText={phone && !validPhone ? "Sai định dạng số điện thoại!" : err?.data?.errors?.phone}
                                    size="small"
                                    sx={{ width: '80%' }}
                                />
                            </InfoStack>
                            <InfoStack>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <FormControl margin="dense" fullWidth>
                                        <CustomDatePicker value={dob} className="DatePicker" onChange={newValue => setDob(newValue)} size="small" slotProps={{
                                            textField: {
                                                size: "small",
                                                error: err?.response?.data?.errors?.dob,
                                                helperText: err?.response?.data?.errors?.dob
                                            }
                                        }} />
                                    </FormControl>
                                </LocalizationProvider>
                            </InfoStack>
                            <InfoStack>
                                <CustomInput type="text" id="address" onChange={e => setAddress(e.target.value)} value={address} error={err?.response?.data?.errors?.address} helperText={err?.response?.data?.errors?.address} size="small" sx={{
                                    width: '80%'
                                }} />
                            </InfoStack>
                            <InfoStack>
                                <RadioGroup spacing={1} row value={gender} onChange={e => setGender(e.target.value)}>
                                    <FormControlLabel value="Nam" control={<Radio sx={{
                                        '&.Mui-checked': {
                                            color: '#63e399'
                                        }
                                    }} />} label="Nam" />
                                    <FormControlLabel value="Nữ" control={<Radio sx={{
                                        '&.Mui-checked': {
                                            color: '#63e399'
                                        }
                                    }} />} label="Nữ" />
                                    <FormControlLabel value="" control={<Radio sx={{
                                        '&.Mui-checked': {
                                            color: '#63e399'
                                        }
                                    }} />} label="Không" />
                                </RadioGroup>
                            </InfoStack>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} lg={3}
                        display={{ xs: 'none', lg: 'flex' }}
                        justifyContent={'center'}
                    >
                        <Avatar sx={{
                            height: 150,
                            width: 150
                        }} />
                    </Grid>
                </Grid>
                <InfoStack>
                    <CustomButton
                        variant="contained"
                        color="secondary"
                        onClick={handleChangeInfo}
                    >
                        Lưu thông tin
                    </CustomButton>
                </InfoStack>
            </Box>}
        </ContentContainer>
        <ResetPassDialog {...{ openDialog, handleCloseDialog }} />
    </>;
}

export default ProfileDetail