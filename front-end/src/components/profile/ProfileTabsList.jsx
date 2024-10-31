import styled from "styled-components"
import { useState } from "react";
import { List, Collapse, Avatar, ListItemButton, Badge } from '@mui/material';
import { ExpandLess, ExpandMore, EditOutlined, Person as PersonIcon, Receipt as ReceiptIcon, Try as TryIcon } from '@mui/icons-material';
import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

//#region styled
const ListContainer = styled.div`
    position: relative;
    width: 100%;
`

const ProfileContainer = styled.div`
    position: relative;
    padding: 15px 10px;

    ${props => props.theme.breakpoints.down("md")} {
        padding: 10px 15px;
    }
`

const MainProfile = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: ${props => props.theme.spacing(1.5)};
`

const InfoContainer = styled.div`
    margin-left: ${props => props.theme.spacing(1)};
    overflow: hidden;
    width: 100%;
`

const UserContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2px; 
`

const Username = styled.span`
    font-size: 16px;
    font-weight: 500;
    text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
`

const Name = styled.p`
    margin: -2px 0;
    font-size: 14px;
    color: ${props => props.theme.palette.text.secondary};
    text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
`

const Role = styled.span`
    font-weight: 450;
    padding: 2px 6px;
    margin-left: ${props => props.theme.spacing(1)};
    font-size: 12px;
    border-radius: 15px;
    white-space: nowrap;
    border: 1px solid;
    border-color: ${props => props.theme.palette.primary.main};
    color: ${props => props.theme.palette.primary.main};

    &.admin {
        border-color: ${props => props.theme.palette.error.main};
        color: ${props => props.theme.palette.error.main};
    }

    &.seller {
        border-color: ${props => props.theme.palette.info.main};
        color: ${props => props.theme.palette.info.main};
    }
`

const EditButton = styled.span`
    display: flex;
    max-width: 100px;
    align-items: center;
    font-weight: 500;
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

    &.badge {
        display: none;
        padding: 4px;
        border-radius: 50%;
        aspect-ratio: 1/1;
        justify-content: flex-end;
        background-color: ${props => props.theme.palette.grey[300]};
        border: 2px solid ${props => props.theme.palette.background.default};

        svg {
            font-size: 16px; 
            margin-right: 0; 
        }
    }

    ${props => props.theme.breakpoints.down("md")} {
        display: none;

        &.badge {  display: flex; }
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

const StyledListItemButton = styled(ListItemButton)`
    justify-content: space-between;
    padding-top: ${props => props.theme.spacing(.5)};
    padding-bottom: ${props => props.theme.spacing(.5)};

    &.secondary {
        padding: 0;
        padding-left: 48px;
        color: ${props => props.theme.palette.text.secondary};
    }

    &:hover {
        color: ${props => props.theme.palette.primary.main};
        background-color: ${props => props.theme.palette.background.default};
    }

    &.Mui-selected {
        color: ${props => props.theme.palette.primary.light};
        background-color: transparent;
        text-decoration: underline;

        &:hover {
            background-color: ${props => props.theme.palette.action.hover};
        }
    }
`

const AdditionalInfo = styled.div`
    width: 100%;
    display: flex;
    gap: ${props => props.theme.spacing(1)};
`

const Additional = styled.span`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    padding: 1px 4px;
    border: .5px solid ${props => props.theme.palette.primary.main};
`

const AddContainer = styled.span`
    font-size: 14px;
    color: ${props => props.theme.palette.text.secondary};
`

const AddCount = styled.p`
    margin-top: -4px;
    margin-bottom: 0;
    font-size: 13px;
    font-weight: 500;
    color: ${props => props.theme.palette.text.primary};
`
//#endregion

const ProfileTabsList = ({ profile, loading, error, tabletMode }) => {
    const { username, image, roles } = useAuth();
    const [open, setOpen] = useState(true);
    const role = roles?.length;

    const toggleOpen = (e) => {
        e.preventDefault();
        setOpen(prevState => !prevState);
    };

    return (
        <ListContainer>
            <NavLink to={'/profile/detail/info'}>
                <ProfileContainer>
                    <MainProfile>
                        <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={<EditButton className="badge"><EditOutlined /></EditButton>}
                        >
                            <Avatar sx={{ width: 55, height: 55 }} src={image ? image + '?size=tiny' : null} />
                        </Badge>
                        <InfoContainer>
                            <UserContainer>
                                <Username>{username}<Name>{profile?.name}</Name></Username>
                                <Role className={role == 3 ? 'admin' : role == 2 ? 'seller' : ''}>
                                    {role == 3 ? 'Admin' : role == 2 ? 'Đối tác' : 'Thành viên'}
                                </Role>
                            </UserContainer>
                            <EditButton><EditOutlined />Sửa hồ sơ</EditButton>
                        </InfoContainer>
                    </MainProfile>
                    <AdditionalInfo>
                        <Additional>
                            <AddContainer>Theo dõi<AddCount>99 Shop</AddCount></AddContainer>
                        </Additional>
                        <Additional>
                            <AddContainer>Mã giảm<AddCount>99 Mã</AddCount></AddContainer>
                        </Additional>
                        <Additional>
                            <AddContainer>Địa chỉ<AddCount>99 Địa chỉ</AddCount></AddContainer>
                        </Additional>
                    </AdditionalInfo>
                </ProfileContainer>
            </NavLink>
            <List sx={{ width: '100%', py: 0 }} component="profile-nav">
                <NavLink to={'/profile/detail'}>
                    {({ isActive }) => (
                        <StyledListItemButton selected={isActive} onClick={toggleOpen} tabIndex={-1}>
                            <ItemText><PersonIcon />&nbsp;Tài khoản của tôi</ItemText>
                            {open ? <ExpandLess /> : <ExpandMore />}
                        </StyledListItemButton>
                    )}
                </NavLink>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <NavLink to={'/profile/detail/info'} end>
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
                                <StyledListItemButton selected={isActive} className="secondary" >
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
                        <StyledListItemButton selected={isActive} tabIndex={-1}>
                            <ItemText><ReceiptIcon />&nbsp;Đơn hàng</ItemText>
                        </StyledListItemButton>
                    )}
                </NavLink>
                <NavLink to={'/profile/reviews'} end>
                    {({ isActive }) => (
                        <StyledListItemButton selected={isActive} tabIndex={-1}>
                            <ItemText><TryIcon />&nbsp;Đánh giá</ItemText>
                        </StyledListItemButton>
                    )}
                </NavLink>
            </List>
        </ListContainer>
    )
}

export default ProfileTabsList