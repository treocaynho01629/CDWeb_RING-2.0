import styled, { useTheme } from 'styled-components'
import { useEffect, useState } from 'react'
import { LocationOn as LocationOnIcon, Check, Person as PersonIcon, Phone as PhoneIcon, Home as HomeIcon, Close as CloseIcon, Delete } from '@mui/icons-material';
import { Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, MenuItem, Skeleton, useMediaQuery } from '@mui/material'
import { location } from '../../ultils/location'
import { PHONE_REGEX } from '../../ultils/regex';
import CustomInput from '../custom/CustomInput';
import CustomButton from '../custom/CustomButton';

const Instruction = styled.p`
    font-size: 14px;
    font-style: italic;
    color: ${props => props.theme.palette.error.main};
`

const AddressDialog = ({ open, handleClose, addressInfo, err, setErr, errMsg, setErrMsg, getFullAddress,
    addNewAddress, pending, setPending, handleRemoveAddress, handleUpdateAddress, defaultAddressToStore }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [validPhone, setValidPhone] = useState(false);
    const [currAddress, setCurrAddress] = useState(null);
    const [selectDefault, setSelectDefault] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);

    //Set edit info
    useEffect(() => {
        if (open) {
            let city = '';
            let ward = '';
            let address = '';

            if (addressInfo?.address) {
                //Split address
                let addressSplit = addressInfo?.address.split(', ');
                address = addressSplit[addressSplit.length - 1];
                if (addressSplit.length > 1) city = addressSplit[0];
                if (addressSplit.length > 2) ward = addressSplit[1];
                if (addressSplit.length > 3) address = addressSplit.slice(2, addressSplit?.length).join(', ')
            }

            setCurrAddress({
                ...currAddress,
                id: addressInfo?.id || '',
                city: city,
                ward: ward,
                address: address,
                phone: addressInfo?.phone || '',
                name: addressInfo?.name || ''
            });
            setSelectDefault(addressInfo && addressInfo?.id == null);
            setErrMsg('');
            setIsLoadingData(false);
        }
    }, [addressInfo])

    //Error message reset when reinput stuff
    useEffect(() => {
        setErrMsg('');
    }, [currAddress])

    useEffect(() => { //Check phone number
        const result = PHONE_REGEX.test(currAddress?.phone);
        setValidPhone(result);
    }, [currAddress?.phone])

    const handleCloseDialog = () => {
        setIsLoadingData(true);
        handleClose();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (pending) return;

        //Validation
        const isNotValid = (!currAddress?.name || !currAddress?.phone || !currAddress?.address || !currAddress?.city || !currAddress?.ward || !validPhone);
        if (isNotValid) {
            setErrMsg("Vui lòng nhập đầy đủ thông tin!");
            return;
        }
        setPending(true);

        const { enqueueSnackbar } = await import('notistack');

        //#FIX TRY CATCH
        try {
            const newAddress = {
                id: currAddress.id,
                name: currAddress.name,
                phone: currAddress.phone,
                address: getFullAddress(currAddress)
            }

            if (!addressInfo) { //Create
                if (selectDefault) { //Change to default address
                    defaultAddressToStore();
                    handleUpdateAddress(newAddress);
                } else { //Add to store
                    addNewAddress(newAddress);
                }

                //Queue snack
                enqueueSnackbar('Đã thêm địa chỉ mới!', { variant: 'success' });
            } else { //Update
                if (addressInfo.id == null) { //Main address
                    handleUpdateAddress(newAddress);
                } else { //Store address
                    if (selectDefault) { //Update to default address
                        defaultAddressToStore(); //Move current default address to redux store
                        handleRemoveAddress(addressInfo?.id); //Remove select address from redux store
                        handleUpdateAddress(newAddress); //Update profile's address
                    } else { //Update in store
                        addNewAddress(newAddress);
                    }

                    //Queue snack
                    enqueueSnackbar('Đã cập nhật địa chỉ mới!', { variant: 'success' });
                }
            }

            setPending(false);
            handleCloseDialog();
        } catch (err) {
            console.error(err);
            setErr(err);
        }
    }

    const selectedCity = location.filter(city => {
        return city.name == currAddress?.city;
    });

    let selectWards;

    if (!selectedCity) {
        selectWards = (
            <CustomInput label='Phường/Xã'
                select
                error={(errMsg != '' || addressInfo) && !currAddress?.ward}
                defaultValue=""
                fullWidth
                size="small"
            >
                <MenuItem disabled value=""><em>--Phường/Xã--</em></MenuItem>
            </CustomInput>
        )
    } else {
        selectWards = (
            isLoadingData
                ?
                <Skeleton variant="rectangular" height={40} />
                :
                <CustomInput label='Phường/Xã'
                    required
                    value={currAddress?.ward || ''}
                    onChange={(e) => setCurrAddress({ ...currAddress, ward: e.target.value })}
                    select
                    error={(errMsg != '' || addressInfo) && !currAddress?.ward}
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

    const isDefault = (addressInfo != null && addressInfo?.id == null);

    return (
        <Dialog open={open} scroll={'paper'} maxWidth={'sm'} fullWidth onClose={handleCloseDialog} fullScreen={fullScreen}>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}><LocationOnIcon />&nbsp;Địa chỉ người nhận</DialogTitle>
            <DialogContent sx={{ marginX: '10px' }}>
                <form onSubmit={handleSubmit}>
                    <Instruction display={errMsg ? "block" : "none"} aria-live="assertive">{errMsg}</Instruction>
                    <Grid container spacing={1}>
                        <Grid container item spacing={1}>
                            <Grid item xs={12} sm={6}>
                                {isLoadingData
                                    ?
                                    <Skeleton variant="rectangular" height={40} />
                                    :
                                    <CustomInput label='Họ và tên'
                                        type="text"
                                        id="fullName"
                                        required
                                        onChange={(e) => setCurrAddress({ ...currAddress, name: e.target.value })}
                                        value={currAddress?.name}
                                        error={((errMsg != '' || addressInfo) && !currAddress?.name) || err?.data?.errors?.name}
                                        helperText={err?.data?.errors?.name}
                                        size="small"
                                        fullWidth
                                        InputProps={{
                                            endAdornment: <PersonIcon style={{ color: "gray" }} />
                                        }}
                                    />
                                }
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {isLoadingData
                                    ?
                                    <Skeleton variant="rectangular" height={40} />
                                    :
                                    <CustomInput placeholder='Số điện thoại (+84)'
                                        id="phone"
                                        required
                                        onChange={(e) => setCurrAddress({ ...currAddress, phone: e.target.value })}
                                        value={currAddress?.phone}
                                        error={((errMsg != '' || addressInfo) && !currAddress?.phone) || (currAddress?.phone && !validPhone) || err?.data?.errors?.phone}
                                        helperText={(currAddress?.phone && !validPhone) ? "Sai định dạng số điện thoại!" : err?.data?.errors?.phone}
                                        fullWidth
                                        size="small"
                                        InputProps={{
                                            endAdornment: <PhoneIcon style={{ color: "gray" }} />
                                        }}
                                    />
                                }
                            </Grid>
                        </Grid>
                        <Grid container item spacing={1}>
                            <Grid item xs={12} sm={6}>
                                {isLoadingData
                                    ?
                                    <Skeleton variant="rectangular" height={40} />
                                    :
                                    <CustomInput label='Tỉnh/Thành phố'
                                        required
                                        value={currAddress?.city || ''}
                                        onChange={(e) => setCurrAddress({ ...currAddress, city: e.target.value, ward: '' })}
                                        select
                                        defaultValue=""
                                        error={(errMsg != '' || addressInfo) && !currAddress?.city}
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
                                }
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {selectWards}
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            {isLoadingData
                                ?
                                <Skeleton variant="rectangular" height={40} />
                                :
                                <CustomInput placeholder='Địa chỉ nhận hàng'
                                    type="text"
                                    autoComplete="on"
                                    required
                                    onChange={(e) => setCurrAddress({ ...currAddress, address: e.target.value })}
                                    value={currAddress?.address}
                                    error={(errMsg != '' || addressInfo) && !currAddress?.address || err?.data?.errors?.address}
                                    helperText={err?.data?.errors?.address}
                                    fullWidth
                                    size="small"
                                    InputProps={{
                                        endAdornment: <HomeIcon style={{ color: "gray" }} />
                                    }}
                                />
                            }
                        </Grid>
                        <Grid container item spacing={1}>
                            <Grid item xs={12} sm={6}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            disableRipple
                                            disableFocusRipple
                                            disabled={isLoadingData || isDefault}
                                            checked={selectDefault}
                                            color="secondary"
                                            inputProps={{
                                                'aria-label': 'select',
                                            }}
                                            onChange={() => setSelectDefault(prev => !prev)}
                                        />
                                    }
                                    label="Chọn làm địa chỉ mặc định" />
                            </Grid>
                            {(addressInfo && !isDefault)
                                &&
                                <Grid item xs={12} sm={6}>
                                    <CustomButton
                                        disabled={isLoadingData || isDefault}
                                        variant="contained"
                                        color="error"
                                        size="large"
                                        fullWidth
                                        onClick={() => handleRemoveAddress(addressInfo?.id)}
                                    >
                                        Xoá địa chỉ&nbsp;<Delete/>
                                    </CustomButton>
                                </Grid>
                            }
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <CustomButton
                    variant="outlined"
                    color="error"
                    size="large"
                    sx={{ marginY: '10px' }}
                    onClick={handleCloseDialog}
                >
                    <CloseIcon />Huỷ
                </CustomButton>
                <CustomButton
                    variant="contained"
                    color="secondary"
                    size="large"
                    disabled={isLoadingData}
                    sx={{ marginY: '10px' }}
                    onClick={handleSubmit}
                >
                    <Check />Áp dụng
                </CustomButton>
            </DialogActions>
        </Dialog>
    )
}

export default AddressDialog