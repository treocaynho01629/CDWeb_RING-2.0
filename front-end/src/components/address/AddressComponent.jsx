import styled from "styled-components"
import { useEffect, useState } from 'react'
import { useGetProfileQuery, useUpdateProfileMutation } from '../../features/users/usersApiSlice';
import { Box, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { AddHome, Delete, Home, LocationOn } from '@mui/icons-material';
import AddressItem from './AddressItem'
import AddressDialog from './AddressDialog'
import useCart from '../../hooks/useCart';
import CustomButton from '../custom/CustomButton';

//#region styled
const Title = styled.h3`
    margin: 20px 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    text-align: center;
    border-bottom: 0.5px solid ${props => props.theme.palette.secondary.main};
    padding-bottom: 15px;
    color: ${props => props.theme.palette.secondary.main};

    ${props => props.theme.breakpoints.down("sm")} {
        font-size: 15px;
    }
`
//#endregion

const AddressComponent = ({ pending, setPending }) => {
  const { addresses, addNewAddress, removeAddress } = useCart();
  const [open, setOpen] = useState(false); //Dialog open state
  const [err, setErr] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [contextAddress, setContextAddress] = useState(null);
  const openContext = Boolean(anchorEl);

  //Initial default address
  const [addressInfo, setAddressInfo] = useState({
    name: '',
    phone: '',
    address: ''
  })

  //Fetch current profile address
  const { data: profile, isLoading: loadProfile, isSuccess: profileDone } = useGetProfileQuery();

  //Update profile hook
  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();

  useEffect(() => { //Load default address info
    if (profile && !loadProfile && profileDone) {
      setAddressInfo({
        address: profile?.address,
        phone: profile?.phone,
        name: profile?.name
      });
    }
  }, [profile])

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
    setErr('');
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
    if (!loadProfile) { addNewAddress(addressInfo); }
  }

  const handleUpdateAddress = (newAddress) => {
    if (loadProfile || pending) return;

    setPending(true);
    updateProfile({
      name: newAddress.name,
      phone: newAddress.phone,
      address: newAddress.address,
      gender: profile.gender,
      dob: profile.dob,
    }).unwrap()
      .then((data) => {
        setErrMsg('');
        setErr([]);
        setPending(false);
      })
      .catch((err) => {
        setPending(false);
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
    defaultAddressToStore(); //Move current default address to redux store
    handleRemoveAddress(newAddress?.id); //Remove select address from redux store
    handleUpdateAddress(newAddress); //Update profile's address
  }

  const isDefault = (contextAddress != null && contextAddress?.id == null);

  return (
    <>
      <Title>
        <Box display={'flex'} alignItems={'center'}>
          <LocationOn />&nbsp;ĐỊA CHỈ CỦA BẠN
        </Box>
        <CustomButton variant="contained" color="secondary" onClick={() => handleOpen()}>
          Thêm địa chỉ <AddHome />
        </CustomButton>
      </Title>
      <AddressItem {...{ addressInfo, handleOpen, handleClick }} />
      {addresses?.map((address, index) => (
        <AddressItem key={`${address?.id}-${index}`} {...{ addressInfo: address, handleOpen, handleClick }} />
      ))}
      <br />
      <AddressDialog {...{
        open, handleClose, addressInfo: contextAddress, err, setErr, errMsg, setErrMsg, getFullAddress,
        addNewAddress, pending, setPending, handleRemoveAddress, handleUpdateAddress, defaultAddressToStore
      }} />
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
  )
}

export default AddressComponent