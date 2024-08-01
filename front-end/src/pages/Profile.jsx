import styled from "styled-components"
import { styled as muiStyled } from '@mui/material/styles';
import { useState, useEffect, lazy, Suspense } from 'react'
import { Grid, TextField, List, ListItemButton, Collapse, Divider, Avatar, Box } from '@mui/material';
import { ExpandLess, ExpandMore, Edit as EditIcon, Person as PersonIcon, Receipt as ReceiptIcon, Try as TryIcon, LocationOn } from '@mui/icons-material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import ProfileDetail from "../components/profile/ProfileDetail";
import AddressComponent from "../components/address/AddressComponent";
import useAuth from "../hooks/useAuth";

const PendingIndicator = lazy(() => import('../components/layout/PendingIndicator'));

//#region styled
const Wrapper = styled.div`
`

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
        color: ${props => props.theme.palette.secondary.main};
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

const Instruction = styled.p`
    font-size: 14px;
    font-style: italic;
    color: red;
    display: ${props => props.display};
`

const ContentContainer = styled.div`
    padding: 0px 15px;
    border: 0.5px solid ${props => props.theme.palette.action.focus};
`

const Title = styled.h3`
    margin: 20px 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    border-bottom: 0.5px solid ${props => props.theme.palette.secondary.main};
    padding-bottom: 15px;
    color: ${props => props.theme.palette.secondary.main};

    ${props => props.theme.breakpoints.down("sm")} {
        font-size: 15px;
    }
`

const Button = styled.button`
  background-color: ${props => props.theme.palette.secondary.main};
  padding: 10px 20px;;
  font-size: 16px;
  font-weight: 500;
  border-radius: 0;
  border: none;
  transition: all 0.5s ease;
  display: flex;
  align-items: center;

  &:hover {
      background-color: lightgray;
      color: black;
  };

  &:focus {
      outline: none;
      border: none;
      border: 0;
  };

  outline: none;
  border: 0;
`

const ItemTitle = styled.p`
    font-size: 14px;
    font-weight: 500;
    text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
    margin: 0;
	
	@supports (-webkit-line-clamp: 1) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: initial;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
`

const Price = styled.p`
    font-size: 16px;
    font-weight: bold;
    color: ${props => props.theme.palette.secondary.main};
    margin: 0 0;
`

const StatusTag = styled.p`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: 0;
    font-weight: bold;
    font-size: 16px;
    color: ${props => props.theme.palette.secondary.main};
`

const Discount = styled.p`
    font-size: 12px;
    color: gray;
    margin: 0;
    text-decoration: line-through;
`

const Profiler = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 0px 10px;
    background-color: #f7f7f7;
    border-bottom: 0.5px solid ${props => props.theme.palette.secondary.main};
`

const RatingInfo = styled.p`
    font-size: 14px;
    margin-right: 10px;
    font-weight: 400;
    padding: 0;
    display: flex;
    align-items: center;
    text-transform: uppercase;
`

const StyledListItemButton = muiStyled(ListItemButton)(({ theme }) => ({
    py: '5px',
    justifyContent: 'space-between',

    '&:hover': {
        color: theme.palette.secondary.main,
        backgroundColor: theme.palette.background.default
    },

    '&.Mui-selected': {
        color: theme.palette.secondary.light,
        backgroundColor: 'transparent',
        textDecoration: 'underline',

        '&:hover': {
            backgroundColor: theme.palette.action.hover
        }
    },
}));
//#endregion

const Profile = () => {
    //#region construct
    const { tab } = useParams();
    const { username } = useAuth();
    const navigate = useNavigate();
    const [pending, setPending] = useState(false);

    //Password dialog open state
    const [open, setOpen] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);


    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'RING! - Hồ sơ';
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [tab])

    const handleOpen = () => {
        setOpen(prevState => !prevState);
    };

    const handleOpenDialog = () => {
        navigate('/profile/detail');
        setOpenDialog(true)
    };

    const handleCloseDialog = () => setOpenDialog(false);
    //#endregion

    return (
        <Wrapper>
            {(pending) ?
                <Suspense fallBack={<></>}>
                    <PendingIndicator open={pending} message="Đang gửi yêu cầu..." />
                </Suspense>
                : null
            }
            <Grid container columnSpacing={4}>
                <Grid item xs={12} md={3.5} lg={3} display={'flex'} justifyContent={'center'}>
                    <ListContainer>
                        <MiniProfile>
                            <Avatar sx={{ width: 55, height: 55, marginRight: 2 }} />
                            <Box>
                                <Username>{username}</Username>
                                <Link to={'/profile/detail'} style={{ color: 'inherit' }}>
                                    <ChangeText onClick={() => navigate('/profile/detail')}><EditIcon />Sửa hồ sơ</ChangeText>
                                </Link>
                            </Box>
                        </MiniProfile>
                        <Divider sx={{ margin: '20px 0px' }} />
                        <List
                            sx={{ width: '100%', py: 0 }}
                            component="nav"
                        >
                            <StyledListItemButton onClick={() => handleOpen()}>
                                <ItemText><PersonIcon />&nbsp;Tài khoản của tôi</ItemText>
                                {open ? <ExpandLess /> : <ExpandMore />}
                            </StyledListItemButton>
                            <Collapse in={open} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <Link to={'/profile/detail'} style={{ color: 'inherit' }}>
                                        <StyledListItemButton
                                            selected={tab == "detail"}
                                            sx={{ pl: 6, py: 0, color: 'primary.light' }}
                                        >
                                            <ItemText>Hồ sơ</ItemText>
                                        </StyledListItemButton>
                                    </Link>
                                </List>
                                <List component="div" disablePadding>
                                    <Link to={'/profile/address'} style={{ color: 'inherit' }}>
                                        <StyledListItemButton
                                            selected={tab == "address"}
                                            sx={{ pl: 6, py: 0, color: 'primary.light' }}
                                        >
                                            <ItemText>Địa chỉ</ItemText>
                                        </StyledListItemButton>
                                    </Link>
                                </List>
                                <List component="div" disablePadding>
                                    <StyledListItemButton
                                        selected={tab == "password"}
                                        sx={{ pl: 6, py: 0, color: 'primary.light' }}
                                    >
                                        <ItemText>Đổi mật khẩu</ItemText>
                                    </StyledListItemButton>
                                </List>
                            </Collapse>
                            <Link to={'/profile/receipts'} style={{ color: 'inherit' }}>
                                <StyledListItemButton selected={tab == "receipts"}>
                                    <ItemText><ReceiptIcon />&nbsp;Đơn hàng</ItemText>
                                </StyledListItemButton>
                            </Link>
                            <Link to={'/profile/receipts'} style={{ color: 'inherit' }}>
                                <StyledListItemButton selected={tab == "reviews"}>
                                    <ItemText><TryIcon />&nbsp;Đánh giá</ItemText>
                                </StyledListItemButton>
                            </Link>
                        </List>
                    </ListContainer>
                </Grid>
                <Grid item xs={12} md={8.5} lg={9}>
                    <TabContext value={tab}>
                        <TabPanel value="detail" sx={{ px: 0 }}>
                            <ContentContainer>
                                <ProfileDetail {...{ Title, pending, setPending, Instruction }} />
                            </ContentContainer>
                        </TabPanel>
                        <TabPanel value="address" sx={{ px: 0 }}>
                            <ContentContainer>
                                <AddressComponent {...{ pending, setPending }} />
                            </ContentContainer>
                        </TabPanel>
                        <TabPanel value="password" sx={{ px: 0 }}>
                        </TabPanel>
                        <TabPanel value="receipts">
                            {/* <ReceiptsDetail /> */}
                        </TabPanel>
                        <TabPanel value="reviews">
                            {/* <ReviewsDetail /> */}
                        </TabPanel>
                    </TabContext>
                </Grid>
            </Grid>
        </Wrapper >
    )
}

export default Profile  