import { useState } from 'react'
import { useGetProfileQuery, useUpdateProfileMutation } from '../../features/users/usersApiSlice';
import { Box, Button, CircularProgress, Dialog, ListItemIcon, ListItemText, Menu, MenuItem, useTheme, useMediaQuery } from '@mui/material';
import { AddHome, Delete, Home, LocationOn } from '@mui/icons-material';
import { Title } from "../custom/GlobalComponents";
import AddressItem from './AddressItem'
import AddressForm from './AddressForm'
import useCart from '../../hooks/useCart';

const AddressComponent = ({ pending, setPending }) => {
  const { addresses, addNewAddress, removeAddress } = useCart();
  const [open, setOpen] = useState(false); //Dialog open state
  const [err, setErr] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [contextAddress, setContextAddress] = useState(null);
  const openContext = Boolean(anchorEl);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  //Fetch current profile address
  const { data: profile, isLoading: loadProfile, isSuccess: profileDone } = useGetProfileQuery();

  //Update profile hook
  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();

  const getFullAddress = (addressInfo) => {
    const tempAddress = [];
    if (addressInfo?.city) tempAddress.push(addressInfo?.city);
    if (addressInfo?.ward) tempAddress.push(addressInfo?.ward);
    if (addressInfo?.address) tempAddress.push(addressInfo?.address);
    return tempAddress.join(", ");
  }

  //Dialog
  const handleOpen = (addressInfo) => {
    setContextAddress(addressInfo);
    setOpen(true);
  }

  const handleClose = () => {
    setContextAddress(null);
    setErrMsg('');
    setErr([]);
    setOpen(false);
  }

  //Context
  const handleClick = (event, address) => {
    setAnchorEl(event.currentTarget);
    setContextAddress(address);
  };

  const handleCloseContext = () => {
    setAnchorEl(null);
    setContextAddress(null);
  }

  const handleRemoveAddress = (addressId) => {
    removeAddress(addressId);
    handleCloseContext();
    handleClose();
  }

  //Move current default address to redux store
  const defaultAddressToStore = () => {
    if (!loadProfile) {
      const newAddress = {
        name: profile?.name,
        phone: profile?.phone,
        address: profile?.address
      }
      addNewAddress(newAddress);
    }
  }

  const handleUpdateAddress = (newAddress) => {
    if (loadProfile || updating) return;

    updateProfile({
      name: newAddress.name,
      phone: newAddress.phone,
      address: newAddress.address,
      gender: profile.gender,
      dob: profile.dob,
    })
      .unwrap()
      .then((data) => {
        handleClose();
      })
      .catch((err) => {
        console.error(err);
        setErr(err);
        if (!err?.status) {
          setErrMsg('Server không phản hồi');
        } else if (err?.status === 400) {
          setErrMsg('Sai định dạng thông tin!');
        } else {
          setErrMsg('Cập nhật thất bại');
        }
      })
  }

  const handleSetDefault = (newAddress) => {
    if (pending) return;
    setPending(true);
    try {
      defaultAddressToStore(); //Move current default address to redux store
      handleRemoveAddress(newAddress?.id); //Remove select address from redux store
      handleUpdateAddress(newAddress); //Update profile's address

      setErrMsg('');
      setErr([]);
      setPending(false);
    } catch (err) {
      console.error(err);
      setErr(err);
      if (!err?.status) {
        setErrMsg('Server không phản hồi');
      } else if (err?.status === 400) {
        setErrMsg('Sai định dạng thông tin!');
      } else {
        setErrMsg('Cập nhật thất bại');
      }
      setPending(false);
    }
  }

  const isDefault = (contextAddress != null && contextAddress?.id == null);

  return (
    <>
      <Box padding={{ xs: '0 15px', sm: 0 }}>
        <Title className="primary">
          <Box display="flex" alignItems="center" flexGrow={1}>
            <LocationOn />&nbsp;Địa chỉ của bạn
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpen}
            endIcon={<AddHome />}
          >
            Thêm địa chỉ
          </Button>
        </Title>
      </Box>
      {
        (loadProfile && !profile)
          ?
          <Box display="flex" alignItems="center" justifyContent="center" height={'40dvh'}>
            <CircularProgress
              color="primary"
              size={40}
              thickness={5}
            />
          </Box>
          :
          <>
            <Box sx={{ marginBottom: '5px' }}>
              <AddressItem {...{ addressInfo: profile, handleOpen, handleClick }} />
            </Box>
            {addresses?.map((address, index) => (
              <Box key={`${address?.id}-${index}`} sx={{ marginBottom: '5px' }}>
                <AddressItem {...{ addressInfo: address, handleOpen, handleClick }} />
              </Box>
            ))}
            <br />
            <Dialog open={open} scroll={'paper'} maxWidth={'sm'} fullWidth onClose={handleClose} fullScreen={fullScreen}>
              <AddressForm {...{
                open, handleClose, addressInfo: contextAddress, err, setErr, errMsg, setErrMsg, getFullAddress,
                addNewAddress, pending, setPending, handleRemoveAddress, handleUpdateAddress, defaultAddressToStore
              }} />
            </Dialog>
            <Menu
              open={openContext}
              onClose={handleCloseContext}
              anchorEl={anchorEl}
              sx={{ display: { xs: 'none', sm: 'block' } }}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem disabled={isDefault} onClick={() => handleRemoveAddress(contextAddress?.id)}>
                <ListItemIcon >
                  <Delete sx={{ color: 'error.main' }} fontSize="small" />
                </ListItemIcon>
                <ListItemText sx={{ color: 'error.main' }}>Xoá địa chỉ</ListItemText>
              </MenuItem>
              <MenuItem disabled={isDefault} onClick={() => handleSetDefault(contextAddress)}>
                <ListItemIcon>
                  <Home fontSize="small" />
                </ListItemIcon>
                <ListItemText>Đặt làm mặc định</ListItemText>
              </MenuItem>
            </Menu >
          </>
      }
    </>
  )
}

export default AddressComponent