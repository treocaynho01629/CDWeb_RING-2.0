import styled from "styled-components"
import { styled as muiStyled } from '@mui/material/styles';
import { useState } from "react";
import { List, Collapse, Divider, Avatar, Box, ListItemButton } from '@mui/material';
import { ExpandLess, ExpandMore, Edit as EditIcon, Person as PersonIcon, Receipt as ReceiptIcon, Try as TryIcon } from '@mui/icons-material';
import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

//#region styled
const ListContainer = styled.div`
    width: 100%;
`

const Username = styled.h3`
    margin: 5px 0;
`

const ChangeText = styled.p`
    display: flex;
    align-items: center;
    font-weight: 500;
    margin: 0;
    padding: 2px 10px;
    font-size: 13px;
    border-radius: 15px;
    white-space: nowrap;
    background-color: ${props => props.theme.palette.action.focus};
    cursor: pointer;

    svg {
        font-size: 16px;
        margin-right: 3px;
    }

    &:hover {
        text-decoration: underline;
        color: ${props => props.theme.palette.primary.main};
        background-color: ${props => props.theme.palette.action.hover};
        transition: .25s ease;
    }
`

const ItemText = styled.h3`
    font-size: 16px;
    margin: 5px 0px;
    color: inherit;
    display: flex;
    align-items: center;
    white-space: nowrap;
`

const MiniProfile = styled.div`
    display: flex;
    align-items: center;
    padding: 15px 10px 0px 15px;
`

const StyledListItemButton = muiStyled(ListItemButton)(({ theme }) => ({
    justifyContent: 'space-between',

    '&.secondary': {
        padding: 0,
        paddingLeft: 48,
        color: theme.palette.text.secondary,
    },

    '&:hover': {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.background.default
    },

    '&.Mui-selected': {
        color: theme.palette.primary.light,
        backgroundColor: 'transparent',
        textDecoration: 'underline',

        '&:hover': {
            backgroundColor: theme.palette.action.hover
        }
    },
}));
//#endregion

const ProfileTabsList = () => {
    const { username } = useAuth();
    const [open, setOpen] = useState(true);

    const handleOpen = () => {
        setOpen(prevState => !prevState);
    };

    return (
        <ListContainer>
            <MiniProfile>
                <Avatar sx={{
                    width: 55,
                    height: 55,
                    marginRight: 2
                }} />
                <Box>
                    <Username>{username}</Username>
                    <NavLink to={'/profile/detail'}>
                        <ChangeText><EditIcon />Sửa hồ sơ</ChangeText>
                    </NavLink>
                </Box>
            </MiniProfile>
            <Divider sx={{ margin: '20px 0px' }} />
            <List sx={{ width: '100%', py: 0 }} component="nav">
                <StyledListItemButton onClick={() => handleOpen()}>
                    <ItemText><PersonIcon />&nbsp;Tài khoản của tôi</ItemText>
                    {open ? <ExpandLess /> : <ExpandMore />}
                </StyledListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <NavLink to={'/profile/detail'} end>
                            {({ isActive }) => (
                                <StyledListItemButton selected={isActive} className="secondary">
                                    <ItemText>Hồ sơ</ItemText>
                                </StyledListItemButton>
                            )}
                        </NavLink>
                    </List>
                    <List component="div" disablePadding>
                        <NavLink to={'/profile/detail/address'} end>
                            {({ isActive }) => (
                                <StyledListItemButton selected={isActive}className="secondary" >
                                    <ItemText>Địa chỉ</ItemText>
                                </StyledListItemButton>
                            )}
                        </NavLink>
                    </List>
                    <List component="div" disablePadding>
                        <NavLink to={'/profile/detail/password'} end>
                            {({ isActive }) => (
                                <StyledListItemButton selected={isActive} className="secondary">
                                    <ItemText>Đổi mật khẩu</ItemText>
                                </StyledListItemButton>
                            )}
                        </NavLink>
                    </List>
                </Collapse>
                <NavLink to={'/profile/orders'} end>
                    {({ isActive }) => (
                        <StyledListItemButton selected={isActive}>
                            <ItemText><ReceiptIcon />&nbsp;Đơn hàng</ItemText>
                        </StyledListItemButton>
                    )}
                </NavLink>
                <NavLink to={'/profile/reviews'} end>
                    {({ isActive }) => (
                        <StyledListItemButton selected={isActive}>
                            <ItemText><TryIcon />&nbsp;Đánh giá</ItemText>
                        </StyledListItemButton>
                    )}
                </NavLink>
            </List>
        </ListContainer>
    )
}

export default ProfileTabsList