import styled from 'styled-components'
import { useState } from 'react'
import { LocationOn as LocationOnIcon, Check, Person as PersonIcon, Phone as PhoneIcon, Home as HomeIcon, Close as CloseIcon } from '@mui/icons-material';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Stack, useMediaQuery } from '@mui/material'
import { useTheme } from 'styled-components';
import { location } from '../../ultils/location';
import CustomButton from '../custom/CustomButton';
import CustomInput from '../custom/CustomInput';

//#region styled
const Instruction = styled.p`
    font-size: 14px;
    font-style: italic;
    color: ${props => props.theme.palette.error.main};
`

const UserInfo = styled.b`
    ${props => props.theme.breakpoints.down("sm")} {
        font-size: 13px;
    }
`
//#endregion

const AddressComponent = ({ addressInfo, setAddressInfo, fullAddress, errMsg, err, validPhone }) => {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const clearInput = () => {
        setAddressInfo({
            fullName: '',
            phone: '',
            city: '',
            ward: '',
            address: ''
        })
    }

    const selectedCity = location.filter(city => {
        return city.name == addressInfo.city
    });

    let selectWards;

    if (!selectedCity) {
        selectWards = (
            <CustomInput label='Phường/Xã'
                select
                error={!addressInfo.ward}
                defaultValue=""
                fullWidth
                size="small"
            >
                <MenuItem disabled value=""><em>--Phường/Xã--</em></MenuItem>
            </CustomInput>
        )
    } else {
        selectWards = (
            <CustomInput label='Phường/Xã'
                value={addressInfo.ward}
                onChange={(e) => setAddressInfo({ ...addressInfo, ward: e.target.value })}
                select
                error={!addressInfo.ward}
                defaultValue=""
                fullWidth
                size="small"
            >
                <MenuItem disabled value=""><em>--Phường/Xã--</em></MenuItem>
                {selectedCity[0]?.wards?.map((ward) => (
                    <MenuItem key={ward} value={ward}>
                        {ward}
                    </MenuItem>
                ))}
            </CustomInput>
        )
    }

    return (
        <>
            <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                <Box display={'flex'} flexDirection={{ xs: 'column', md: 'row' }}>
                    <Box display={'flex'} flexDirection={{ xs: 'row', md: 'column' }} marginRight={2}>
                        <UserInfo>{addressInfo.fullName}&nbsp;</UserInfo>
                        {addressInfo?.phone && <UserInfo>{`(+84) ${addressInfo.phone}`}</UserInfo>}
                    </Box>
                    <Box>{fullAddress}</Box>
                </Box>
                <CustomButton variant="outlined" color={errMsg ? "error" : "secondary"} onClick={handleOpen}>Thay đổi</CustomButton>
            </Box>
            <Dialog open={open} scroll={'paper'} maxWidth={'sm'} fullWidth onClose={handleClose} fullScreen={fullScreen}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}><LocationOnIcon />&nbsp;Địa chỉ người nhận</DialogTitle>
                <DialogContent sx={{ marginX: '10px' }}>
                    <Stack spacing={1} direction="column">
                        <Instruction display={errMsg ? "block" : "none"} aria-live="assertive">{errMsg}</Instruction>
                        <Grid container spacing={1}>
                            <Grid container item spacing={1}>
                                <Grid item xs={12} sm={6}>
                                    <CustomInput label='Họ và tên'
                                        type="text"
                                        id="fullName"
                                        required
                                        onChange={(e) => setAddressInfo({ ...addressInfo, fullName: e.target.value })}
                                        value={addressInfo.fullName}
                                        error={!addressInfo.fullName || err?.response?.data?.errors?.firstName || err?.response?.data?.errors?.lastName}
                                        helperText={err?.response?.data?.errors?.firstName || err?.response?.data?.errors?.lastName}
                                        size="small"
                                        fullWidth
                                        InputProps={{
                                            endAdornment: <PersonIcon style={{ color: "gray" }} />
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <CustomInput placeholder='Số điện thoại (+84)'
                                        id="phone"
                                        required
                                        onChange={(e) => setAddressInfo({ ...addressInfo, phone: e.target.value })}
                                        value={addressInfo.phone}
                                        error={!addressInfo.phone || (addressInfo.phone && !validPhone) || err?.response?.data?.errors?.phone}
                                        helperText={(addressInfo.phone && !validPhone) ? "Sai định dạng số điện thoại!" : err?.response?.data?.errors?.phone}
                                        fullWidth
                                        size="small"
                                        InputProps={{
                                            endAdornment: <PhoneIcon style={{ color: "gray" }} />
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container item spacing={1}>
                                <Grid item xs={12} sm={6}>
                                    <CustomInput label='Tỉnh/Thành phố'
                                        value={addressInfo.city}
                                        onChange={(e) => setAddressInfo({ ...addressInfo, city: e.target.value, ward: '' })}
                                        select
                                        defaultValue=""
                                        error={!addressInfo.city}
                                        fullWidth
                                        size="small"
                                    >
                                        <MenuItem disabled value=""><em>--Tỉnh/Thành phố--</em></MenuItem>
                                        {location.map((city) => (
                                            <MenuItem key={city.name} value={city.name}>
                                                {city.name}
                                            </MenuItem>
                                        ))}
                                    </CustomInput>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    {selectWards}
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <CustomInput placeholder='Địa chỉ nhận hàng'
                                    type="text"
                                    autoComplete="on"
                                    onChange={(e) => setAddressInfo({ ...addressInfo, address: e.target.value })}
                                    value={addressInfo.address}
                                    error={!addressInfo.address || err?.response?.data?.errors?.address}
                                    helperText={err?.response?.data?.errors?.address}
                                    fullWidth
                                    size="small"
                                    InputProps={{
                                        endAdornment: <HomeIcon style={{ color: "gray" }} />
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <CustomButton
                        variant="outlined"
                        color="error"
                        size="large"
                        sx={{ marginY: '10px' }}
                        onClick={clearInput}
                    >
                        <CloseIcon />Đặt lại
                    </CustomButton>
                    <CustomButton
                        variant="contained"
                        color="secondary"
                        size="large"
                        sx={{ marginY: '10px' }}
                        onClick={handleClose}>
                        <Check />Áp dụng
                    </CustomButton>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default AddressComponent