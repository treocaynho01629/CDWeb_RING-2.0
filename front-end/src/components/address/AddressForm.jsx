import { useEffect, useState } from 'react'
import { LocationOn as LocationOnIcon, Check, Person as PersonIcon, Phone as PhoneIcon, Home as HomeIcon, Close as CloseIcon, Delete } from '@mui/icons-material';
import { Checkbox, Button, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid2 as Grid, MenuItem, TextField } from '@mui/material'
import { location } from '../../ultils/location'
import { PHONE_REGEX } from '../../ultils/regex';
import { Instruction } from '../custom/GlobalComponents';

const splitAddress = (addressInfo) => {
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

    return {
        id: addressInfo?.id || '',
        name: addressInfo?.name || '',
        phone: addressInfo?.phone || '',
        city,
        ward,
        address,
    }
}

const AddressForm = ({ handleClose, addressInfo, err, setErr, errMsg, setErrMsg, getFullAddress, selectedValue,
    addNewAddress, pending, setPending, handleRemoveAddress, handleUpdateAddress, defaultAddressToStore }) => {
    const [validPhone, setValidPhone] = useState(PHONE_REGEX.test(addressInfo?.phone) || true);
    const [currAddress, setCurrAddress] = useState(splitAddress(addressInfo));
    const [selectDefault, setSelectDefault] = useState(false);

    //Error message reset when reinput stuff
    useEffect(() => {
        setErrMsg('');
    }, [currAddress])

    setPending(false);

    useEffect(() => { //Check phone number
        const result = PHONE_REGEX.test(currAddress.phone);
        setValidPhone(result);
    }, [currAddress.phone])

    const createDefaultAddress = (newAddress) => {
        if (pending) return;

        setPending(true);
        try {
            defaultAddressToStore();
            handleUpdateAddress(newAddress);
            setPending(false);
        } catch (err) {
            console.error(err);
            setErr(err);
            setPending(false);
        }
    }

    const updateDefaultAddress = (newAddress) => {
        if (pending) return;

        setPending(true);
        try {
            handleUpdateAddress(newAddress);
            setPending(false);
        } catch (err) {
            console.error(err);
            setErr(err);
            setPending(false);
        }
    }

    const changeToDefaultAddress = (newAddress) => {
        if (pending) return;

        setPending(true);
        try {
            defaultAddressToStore(); //Move current default address to redux store
            handleRemoveAddress(addressInfo?.id); //Remove select address from redux store
            handleUpdateAddress(newAddress); //Update profile's address
            setPending(false);
        } catch (err) {
            console.error(err);
            setErr(err);
            setPending(false);
        }
    }

    const updateStoreAddress = (newAddress) => {
        setPending(true);
        try {
            addNewAddress(newAddress);
            handleClose();
            setPending(false);
        } catch (err) {
            console.error(err);
            setErr(err);
            handleClose();
            setPending(false);
        }
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

        const { enqueueSnackbar } = await import('notistack');

        const newAddress = {
            id: currAddress.id,
            name: currAddress.name,
            phone: currAddress.phone,
            address: getFullAddress(currAddress)
        }

        if (!addressInfo) { //Create
            selectDefault ? createDefaultAddress(newAddress) : updateStoreAddress(newAddress);
            //Queue snack
            enqueueSnackbar('Đã thêm địa chỉ mới!', { variant: 'success' });
        } else { //Update
            if (addressInfo.id == null) { //Default address
                updateDefaultAddress(newAddress);
            } else { //Store address
                selectDefault ? changeToDefaultAddress(newAddress) : updateStoreAddress(newAddress);
                //Queue snack
                enqueueSnackbar('Đã cập nhật địa chỉ mới!', { variant: 'success' });
            }
        }
    }

    const selectedCity = location.filter(city => {
        return city.name == currAddress?.city;
    });

    let selectWards;

    if (!selectedCity) {
        selectWards = (
            <TextField label='Phường/Xã'
                select
                error={(errMsg != '' || addressInfo) && !currAddress?.ward}
                defaultValue=""
                fullWidth
                size="small"
            >
                <MenuItem disabled value=""><em>--Phường/Xã--</em></MenuItem>
            </TextField>
        )
    } else {
        selectWards = (
            <TextField label='Phường/Xã'
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
            </TextField>
        )
    }

    const isDefault = (addressInfo != null && addressInfo?.id == null);
    const isSelected = (selectedValue != null && selectedValue == addressInfo?.id);

    return (
        <>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}><LocationOnIcon />&nbsp;Địa chỉ người nhận</DialogTitle>
            <DialogContent sx={{ marginX: '10px' }}>
                <form style={{ paddingTop: 10 }} onSubmit={handleSubmit}>
                    <Instruction display={errMsg ? "block" : "none"} aria-live="assertive">{errMsg}</Instruction>
                    <Grid container size="grow" spacing={1}>
                        <Grid container size={12} spacing={1}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField label='Họ và tên'
                                    type="text"
                                    id="fullName"
                                    required
                                    onChange={(e) => setCurrAddress({ ...currAddress, name: e.target.value })}
                                    value={currAddress?.name}
                                    error={((errMsg != '' || addressInfo) && !currAddress?.name) || err?.data?.errors?.name}
                                    helperText={err?.data?.errors?.name}
                                    size="small"
                                    fullWidth
                                    slotProps={{
                                        input: {
                                            endAdornment: <PersonIcon style={{ color: "gray" }} />
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField placeholder='Số điện thoại (+84)'
                                    id="phone"
                                    required
                                    onChange={(e) => setCurrAddress({ ...currAddress, phone: e.target.value })}
                                    value={currAddress?.phone}
                                    error={((errMsg != '' || addressInfo) && !currAddress?.phone)
                                        || (currAddress.phone && !validPhone) || err?.data?.errors?.phone}
                                    helperText={(currAddress.phone && !validPhone) ? "Sai định dạng số điện thoại!" : err?.data?.errors?.phone}
                                    fullWidth
                                    size="small"
                                    slotProps={{
                                        input: {
                                            endAdornment: <PhoneIcon style={{ color: "gray" }} />
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container size={12} spacing={1}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField label='Tỉnh/Thành phố'
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
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                {selectWards}
                            </Grid>
                        </Grid>
                        <Grid size={12}>
                            <TextField placeholder='Địa chỉ nhận hàng'
                                type="text"
                                autoComplete="on"
                                required
                                onChange={(e) => setCurrAddress({ ...currAddress, address: e.target.value })}
                                value={currAddress?.address}
                                error={(errMsg != '' || addressInfo) && !currAddress?.address || err?.data?.errors?.address}
                                helperText={err?.data?.errors?.address}
                                fullWidth
                                size="small"
                                slotProps={{
                                    input: {
                                        endAdornment: <HomeIcon style={{ color: "gray" }} />
                                    }
                                }}
                            />
                        </Grid>
                        <Grid container size={12} spacing={1}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            disableRipple
                                            disableFocusRipple
                                            disabled={isDefault || isSelected}
                                            checked={selectDefault}
                                            color="primary"
                                            inputProps={{ 'aria-label': 'select' }}
                                            onChange={() => setSelectDefault(prev => !prev)}
                                        />
                                    }
                                    label="Chọn làm địa chỉ mặc định" />
                            </Grid>
                            {(addressInfo && !isDefault && !isSelected)
                                &&
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Button
                                        disabled={isDefault || isSelected}
                                        variant="contained"
                                        color="error"
                                        size="large"
                                        fullWidth
                                        onClick={() => handleRemoveAddress(addressInfo?.id)}
                                    >
                                        Xoá địa chỉ&nbsp;<Delete />
                                    </Button>
                                </Grid>
                            }
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="outlined"
                    color="error"
                    size="large"
                    sx={{ marginY: '10px' }}
                    onClick={handleClose}
                    startIcon={<CloseIcon />}
                >
                    Huỷ
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ marginY: '10px' }}
                    onClick={handleSubmit}
                    startIcon={<Check />}
                >
                    Áp dụng
                </Button>
            </DialogActions>
        </>
    )
}

export default AddressForm