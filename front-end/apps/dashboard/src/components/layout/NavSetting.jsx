import styled from '@emotion/styled'
import { useState } from 'react'
import { Drawer } from '@mui/material';
import { useAuth } from "@ring/auth";

//#region preStyled
const drawerWidth = 250;

const StyledMobileDrawer = styled(Drawer)(({ theme }) => ({

}));
//#endregion

const NavSetting = ({ open, setOpen, mobileMode }) => {
  const { roles } = useAuth();
  const isAdmin = roles?.length >= 3;

  const handleDrawerClose = () => { setOpen(false) };

  return (
    <StyledMobileDrawer
      variant="temporary"
      anchor="right"
      open={open}
      onClose={handleDrawerClose}
      ModalProps={{ keepMounted: true }}
      slotProps={{ backdrop: { invisible: true } }}
    >
      <p>STUFF THAT I WILL ADD LATER</p>
    </StyledMobileDrawer>
  )
}

export default NavSetting