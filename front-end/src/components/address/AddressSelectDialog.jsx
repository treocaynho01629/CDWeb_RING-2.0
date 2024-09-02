import { useTheme } from "styled-components"
import { useEffect, useState, lazy, Suspense } from 'react'
import { useUpdateProfileMutation } from '../../features/users/usersApiSlice';
import { Box, Dialog, Button, DialogActions, DialogContent, DialogTitle, ListItemIcon, ListItemText, Menu, MenuItem, Radio, styled, useMediaQuery } from '@mui/material';
import { AddHome, Check, Delete, Home, LocationOn, Close } from '@mui/icons-material';
import AddressItem from './AddressItem'
import useCart from '../../hooks/useCart';

const AddressForm = lazy(() => import('./AddressForm'));

const StyledRadio = styled(Radio)(({ theme }) => ({
  borderRadius: 0,
  backgroundColor: theme.palette.action.disabled,
  transition: 'all .25s ease',

  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },

  '&.Mui-checked': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

const AddressSelectDialog = ({ profile, pending, setPending, setAddressInfo, openDialog, handleCloseDialog }) => {
  const { addresses, addNewAddress, removeAddress } = useCart();
  const [openForm, setOpenForm] = useState(false); //Dialog open state
  const [err, setErr] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [contextAddress, setContextAddress] = useState(null);
  const [selectedValue, setSelectedValue] = useState(-1);
  const openContext = Boolean(anchorEl);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  //Update profile hook
  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();

  useEffect(() => {
    handleSetAddress();
  }, [profile, addresses])

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
    setOpenForm(true);
  }

  const handleClose = () => {
    setContextAddress(null);
    setErr('');
    setOpenForm(false);
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
    if (profile) {
      const newAddress = {
        name: profile?.name,
        phone: profile?.phone,
        address: profile?.address
      }
      addNewAddress(newAddress);
    }
  }

  const handleUpdateAddress = (newAddress) => {
    if (updating) return;

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

  const handleSetAddress = () => {
    if (selectedValue == -1) {
      if (profile) setAddressInfo(profile);
    } else {
      setAddressInfo(addresses.filter(item => item.id == selectedValue)[0]);
    }
  }

  const handleSubmit = () => {
    handleSetAddress();
    handleCloseDialog();
  }

  const isDefault = (contextAddress != null && contextAddress?.id == null);
  const isSelected = (selectedValue != null && selectedValue == contextAddress?.id);

  return (
    <Dialog open={openDialog} scroll={'paper'} maxWidth={'sm'} fullWidth onClose={handleCloseDialog} fullScreen={fullScreen}>
      {openForm
        ?
        <Suspense fallBack={<></>}>
          <AddressForm {...{
            open: openForm, handleClose, addressInfo: contextAddress, err, setErr, errMsg, setErrMsg, getFullAddress,
            addNewAddress, pending, setPending, handleRemoveAddress, handleUpdateAddress, defaultAddressToStore, selectedValue
          }} />
        </Suspense>
        :
        <>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}><LocationOn />&nbsp;Địa chỉ của bạn</DialogTitle>
          <DialogContent sx={{ padding: { xs: 1, sm: '20px 24px' }, paddingTop: 0 }}>
            <Box display={'flex'} mb={'5px'}>
              <StyledRadio
                checked={selectedValue == -1}
                onChange={(e) => setSelectedValue(e.target.value)}
                value={-1}
                name="radio-buttons"
              />
              <AddressItem {...{ addressInfo: profile, handleOpen, handleClick, selectedValue }} />
            </Box>
            {addresses?.map((address, index) => {
              return (
                <Box display={'flex'} mb={'5px'} key={`${address?.id}-${index}`} >
                  <StyledRadio
                    checked={selectedValue == address.id}
                    onChange={(e) => setSelectedValue(e.target.value)}
                    value={address.id}
                    name="radio-buttons"
                  />
                  <AddressItem {...{ addressInfo: address, handleOpen, handleClick, selectedValue }} />
                </Box>
              )
            })}
            <Button
              variant="outlined"
              size="large"
              color="primary"
              sx={{ width: '100%', padding: '10px' }}
              onClick={() => handleOpen()}
            >
              <AddHome />&nbsp;Thêm địa chỉ
            </Button>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              color="error"
              size="large"
              sx={{ marginY: '10px' }}
              onClick={handleCloseDialog}
              startIcon={<Close />}
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
              Chọn
            </Button>
          </DialogActions>
          <Menu
            open={openContext}
            onClose={handleCloseContext}
            anchorEl={anchorEl}
            sx={{ display: { xs: 'none', sm: 'block' } }}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem disabled={isDefault || isSelected} onClick={() => handleRemoveAddress(contextAddress?.id)}>
              <ListItemIcon >
                <Delete sx={{ color: 'error.main' }} fontSize="small" />
              </ListItemIcon>
              <ListItemText sx={{ color: 'error.main' }}>Xoá địa chỉ</ListItemText>
            </MenuItem>
            <MenuItem disabled={isDefault || isSelected} onClick={() => handleSetDefault(contextAddress)}>
              <ListItemIcon>
                <Home fontSize="small" />
              </ListItemIcon>
              <ListItemText>Đặt làm mặc định</ListItemText>
            </MenuItem>
          </Menu >
        </>
      }
    </Dialog>
  )
}

export default AddressSelectDialog