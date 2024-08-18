import styled from 'styled-components';
import { useContext, useState } from 'react';
import { styled as muiStyled } from '@mui/system';
import {
    Search as SearchIcon, ShoppingCart as ShoppingCartIcon, Mail as MailIcon, Phone as PhoneIcon, Facebook as FacebookIcon, YouTube as YouTubeIcon,
    Instagram as InstagramIcon, Twitter as TwitterIcon, Menu as MenuIcon, Lock as LockIcon, NotificationsActive as NotificationsActiveIcon, Storefront,
    Close,
} from '@mui/icons-material';
import { Stack, Badge, IconButton, Avatar, Box, Grid, TextField, AppBar, Collapse, useTheme, useMediaQuery } from '@mui/material';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ColorModeContext } from '../../ThemeContextProvider';
import useLogout from "../../hooks/useLogout";
import useAuth from "../../hooks/useAuth";
import NavDrawer from './NavDrawer';
import MiniCart from './MiniCart';
import ProfilePopover from './ProfilePopover';
import useCart from '../../hooks/useCart';

//#region styled
const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    
    ${props => props.theme.breakpoints.up("sm_md")} {
        padding: 5px 20px;
        width: 750px;
        margin-left: auto;
        margin-right: auto;
    }

    ${props => props.theme.breakpoints.up("md_lg")} {
        width: 970px;
    }

    ${props => props.theme.breakpoints.up("lg")} {
        width: 1170px;
    }
`

const TopHeader = styled.div`
    padding: 0 30px;
    background-color: ${props => props.theme.palette.divider};
    justify-content: space-between;
    font-size: 15px;
    font-weight: bold;
    display: flex;
    align-items: center;
    margin-bottom: -1px;

    ${props => props.theme.breakpoints.down("md")} {
        display: none;
    }
`

const ContactContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;

    ${props => props.theme.breakpoints.down("md")} {
        justify-content: center;
    }
`

const SocialContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;

    ${props => props.theme.breakpoints.down("md")} {
        justify-content: center;
    }
`

const Contact = styled.p`
    height: 35px;
    font-size: 12px;
    margin-top: 0;
    margin-bottom: 0;
    margin-right: 20px;
    font-weight: 400;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    justify-content: center;
    color: ${props => props.theme.palette.text.secondary};
`

const Social = styled.p`
    color: ${props => props.theme.palette.text.secondary};
    background-color: 'transparent';
    font-size: 14px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-top: 0;
    margin-bottom: 0;
    padding: 0 10px;
    height: 35px;
    transition: all 0.5s ease;
    cursor: pointer;

    &:hover {
        background-color: #${props => props.color};
        color: white;
    }
`

const Left = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    ${props => props.theme.breakpoints.down("md")} {
        justify-content: space-between;
    }
`

const Right = styled.div`
    flex: 1;
    align-items: center;
    justify-content: flex-end;
    display: flex;

    ${props => props.theme.breakpoints.down("md")} {
        justify-content: space-evenly;
        display: none;
    }
`

const Logo = styled.h2`
    position: relative;
    font-family: abel;
    font-size: 27px;
    text-transform: uppercase;
    font-weight: 500;
    color: ${props => props.theme.palette.primary.main};
    align-items: center;
    display: flex;
    width: 251px;
    margin: 5px 10px 5px 15px;
    white-space: nowrap;
    overflow: hidden;
    transition: all .25s ease;

    p {
        color: ${props => props.theme.palette.text.secondary};
        margin: 0;
    }

    &.active {
        width: 110px;
        
        ${props => props.theme.breakpoints.down("sm")} {
            width: 0px;
        }
    }

    ${props => props.theme.breakpoints.down("md_lg")} {
        margin: 5px 0px 5px 0px;
        width: 110px;

        p { width: 0; }
    }
`

const ImageLogo = styled.img`
    width: 40px;
    height: 40px;
    margin: 0 10px 0 0;
    padding: 0;
`

const NavItem = styled.div`
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    margin-left: 15px;
`

const StyledIconButton = muiStyled(IconButton)(({ theme }) => ({
    borderRadius: 0,

    '&:hover': {
        backgroundColor: 'transparent',
        color: theme.palette.primary.main,
    },

    '&.nav': {
        display: 'flex',
        width: '90px',
        justifyContent: 'flex-start',

        [theme.breakpoints.down('md_lg')]: {
            justifyContent: 'center',
            flexDirection: 'column',
            width: '70px',
            transform: 'translateY(-5px)',
        }
    },
}));

const IconText = styled.p`
    font-size: 13px;
    margin: 0;
    margin-left: 5px;
    white-space: nowrap;
    text-overflow: ellipsis;
	
    ${props => props.theme.breakpoints.down("md_lg")} {
        height: 0;
    }
`
//#endregion

const Navbar = () => {
    //#region construct
    const { cartProducts, removeProduct } = useCart();
    const location = useLocation();
    const colorMode = useContext(ColorModeContext);
    const theme = useTheme();
    const mobileMode = useMediaQuery(theme.breakpoints.down('md'));

    //Drawer open state
    const [openDrawer, setOpen] = useState(false);

    //Search field expand
    const [searchField, setSearchField] = useState('');
    const [focus, setFocus] = useState(false);
    const [toggle, setToggle] = useState(searchField !== '');

    //Other
    const { username, roles } = useAuth();
    const navigate = useNavigate();
    const logout = useLogout();

    //Anchor for popoever & open state
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorElCart, setAnchorElCart] = useState(null);
    const open = Boolean(anchorEl);
    const openCart = Boolean(anchorElCart);

    const hanldeCartPopover = (event) => {
        setAnchorElCart(event.currentTarget);
    };

    const handleCartClose = () => {
        setAnchorElCart(null);
    };

    const handleProfilePopover = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileClose = () => {
        setAnchorEl(null);
    };

    //Toggle drawer open state
    const toggleDrawer = (open) => (e) => {
        setOpen(open)
    };

    const toggleSearch = () => {
        setToggle(prev => !prev);
    }

    //Confirm search
    const handleSubmitSearch = (e) => {
        e.preventDefault();
        navigate(`/filters?keyword=${searchField}`);
    }
    //#endregion

    const isToggleSearch = (focus || toggle);

    return (
        <>
            <TopHeader>
                <Grid container>
                    <Grid item xs={12} md={6}>
                        <ContactContainer>
                            <Contact><PhoneIcon sx={{ fontSize: 18, marginRight: 1 }} />+8419130248</Contact>
                            <Contact><MailIcon sx={{ fontSize: 18, marginRight: 1 }} />haductrong01629@gmail.com</Contact>
                        </ContactContainer>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <SocialContainer>
                            <Social color="3B5999"><FacebookIcon sx={{ fontSize: 18 }} /></Social>
                            <Social color="FF0000"><YouTubeIcon sx={{ fontSize: 18 }} /></Social>
                            <Social color="E4405F"><InstagramIcon sx={{ fontSize: 18 }} /></Social>
                            <Social color="55ACEE"><TwitterIcon sx={{ fontSize: 18 }} /></Social>
                        </SocialContainer>
                    </Grid>
                </Grid>
            </TopHeader>
            <AppBar sx={{ backgroundColor: 'background.default', marginBottom: 2 }} position="sticky">
                <Wrapper>
                    <Grid container>
                        <Grid item xs={12} md={6.5} sx={{ display: 'flex', alignItems: 'center' }}>
                            <Left>
                                {mobileMode &&
                                    <>
                                        <Box
                                            display={isToggleSearch ? 'none' : 'flex'}
                                            flex={1}
                                            alignItems={'center'}
                                        >
                                            <IconButton onClick={toggleDrawer(true)}>
                                                <MenuIcon sx={{ fontSize: 26 }} />
                                            </IconButton>
                                        </Box>
                                        <NavDrawer {...{
                                            openDrawer, setOpen, toggleDrawer, username, roles, location,
                                            products: cartProducts, navigate, logout, ImageLogo, theme, colorMode
                                        }} />
                                    </>
                                }
                                <Link to={`/`}>
                                    <Logo className={isToggleSearch ? 'active' : ''}>
                                        <ImageLogo src="/bell.svg" className="logo" alt="RING! Logo" />RING!&nbsp; <p>- BOOKSTORE</p>
                                    </Logo>
                                </Link>
                                <Box
                                    display={'flex'}
                                    alignItems={'center'}
                                    flex={1}
                                    justifyContent={isToggleSearch ? { xs: 'space-between', md: 'flex-start' } : 'flex-start'}
                                    flexDirection={{ xs: 'row-reverse', md: 'row' }}
                                >
                                    <Link to={'/filters'} title="Duyệt cửa hàng">
                                        <StyledIconButton aria-label="explore">
                                            <Storefront sx={{ fontSize: '26px' }} />
                                        </StyledIconButton>
                                    </Link>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}
                                        flexDirection={{ xs: 'row-reverse', md: 'row' }}>
                                        <Collapse
                                            orientation="horizontal"
                                            timeout={250}
                                            easing={'ease'}
                                            in={isToggleSearch}
                                        >
                                            <form onSubmit={handleSubmitSearch}>
                                                <TextField
                                                    placeholder='Tìm kiếm... '
                                                    onFocus={() => setFocus(true)}
                                                    onBlur={() => setFocus(false)}
                                                    onChange={(e) => setSearchField(e.target.value)}
                                                    value={searchField}
                                                    id="search"
                                                    size="small"
                                                    fullWidth
                                                    sx={{ width: '100%' }}
                                                    InputProps={{ startAdornment: <SearchIcon sx={{ marginRight: 1 }} /> }}
                                                />
                                            </form>
                                        </Collapse>
                                        <StyledIconButton aria-label="search toggle" onClick={() => toggleSearch()}>
                                            {isToggleSearch ? <Close sx={{ fontSize: '26px' }} /> : <SearchIcon sx={{ fontSize: '26px' }} />}
                                        </StyledIconButton>
                                    </Box>
                                </Box>
                            </Left>
                        </Grid>
                        {!mobileMode &&
                            <Grid item xs={12} md={5.5} sx={{ display: { xs: 'none', md: 'flex' } }}>
                                <Right>
                                    <NavItem>
                                        <Stack spacing={1} direction="row" sx={{ color: 'action.active' }} alignItems={'center'}>
                                            <StyledIconButton className="nav" aria-label="notification">
                                                <Badge badgeContent={0} anchorOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'right',
                                                }}>
                                                    <NotificationsActiveIcon />
                                                </Badge>
                                                <IconText>Thông báo</IconText>
                                            </StyledIconButton>
                                            <div
                                                aria-owns={openCart ? "mouse-over-popover" : undefined}
                                                aria-haspopup="true"
                                                onMouseEnter={hanldeCartPopover}
                                                onMouseLeave={handleCartClose}
                                            >
                                                <Link to={'/cart'} title="Giỏ hàng">
                                                    <StyledIconButton className="nav" aria-label="cart">
                                                        <Badge color="primary" badgeContent={cartProducts?.length} anchorOrigin={{
                                                            vertical: 'top',
                                                            horizontal: 'right',
                                                        }}>
                                                            <ShoppingCartIcon />
                                                        </Badge>
                                                        <IconText>Giỏ hàng</IconText>
                                                    </StyledIconButton>
                                                </Link>
                                                <MiniCart {...{ removeProduct, openCart, anchorElCart, handleClose: handleCartClose, products: cartProducts }} />
                                            </div>
                                            {username ? (
                                                <div
                                                    aria-owns={open ? "mouse-over-popover" : undefined}
                                                    aria-haspopup="true"
                                                    onMouseEnter={handleProfilePopover}
                                                    onMouseLeave={handleProfileClose}
                                                >
                                                    <Link to={'/profile/detail'} title="Tài khoản">
                                                        <StyledIconButton className="nav" aria-label="profile">
                                                            <Avatar sx={{ width: 24, height: 24, fontSize: '16px' }}>{username?.charAt(0) ?? 'P'}</Avatar>
                                                            <IconText className="username">{username}</IconText>
                                                        </StyledIconButton>
                                                    </Link>
                                                    <ProfilePopover {...{
                                                        open, anchorEl, handleClose: handleProfileClose,
                                                        navigate, roles, logout, theme, colorMode
                                                    }} />
                                                </div>
                                            ) : (
                                                <Link to={'/login'} state={{ from: location }} replace title="Đăng nhập">
                                                    <StyledIconButton className="nav" aria-label="login">
                                                        <LockIcon />
                                                        <IconText className="username">Đăng nhập</IconText>
                                                    </StyledIconButton>
                                                </Link>
                                            )}
                                        </Stack>
                                    </NavItem>
                                </Right>
                            </Grid>
                        }
                    </Grid>
                </Wrapper>
            </AppBar>
        </>
    )
}

export default Navbar