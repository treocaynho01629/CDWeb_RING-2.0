import styled from 'styled-components';
import { lazy, Suspense, useContext, useState } from 'react';
import { styled as muiStyled } from '@mui/system';
import {
    Search as SearchIcon, ShoppingCart, Mail as MailIcon, Phone as PhoneIcon, Facebook as FacebookIcon, YouTube as YouTubeIcon,
    Instagram as InstagramIcon, Twitter as TwitterIcon, Menu as MenuIcon, Lock as LockIcon, Storefront, Close, Notifications,
} from '@mui/icons-material';
import { Stack, Badge, IconButton, Avatar, Box, Grid2 as Grid, TextField, AppBar, useTheme, useMediaQuery, useScrollTrigger } from '@mui/material';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ColorModeContext } from '../../ThemeContextProvider';
import { LogoImage, LogoSubtitle, LogoTitle } from '../custom/GlobalComponents';
import useLogout from "../../hooks/useLogout";
import useAuth from "../../hooks/useAuth";
import useCart from '../../hooks/useCart';

const NavDrawer = lazy(() => import("./NavDrawer"));
const MiniCart = lazy(() => import("./MiniCart"));
const ProfilePopover = lazy(() => import("./ProfilePopover"));

//#region styled
const Wrapper = styled.div`
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
    display: flex;
    align-items: center;
    margin: 5px 10px 5px 15px;
    white-space: nowrap;
    overflow: hidden;
    transition: all .25s ease;

    &.active {
        ${LogoSubtitle} {width: 0;}
        
        ${props => props.theme.breakpoints.down("md")} {
            width: 0;
        }
    }

    ${props => props.theme.breakpoints.down("md_lg")} {
        margin: 5px 0px 5px 0px;
        width: 110px;

        ${LogoSubtitle} {width: 0;}
    }
`

const NavItem = styled.div`
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    margin-left: 15px;
`

const StyledAppBar = muiStyled(AppBar)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    borderBottom: '.5px solid',
    borderColor: theme.palette.divider,
    top: 0,
    transition: 'all .2s ease',

    '&.top': {
        backgroundColor: 'transparent',
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0))',
        borderColor: 'transparent',
    }
}));

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

const StyledSearchForm = styled.form`
    width: 100%;
    display: flex;
    align-items: center;

    ${props => props.theme.breakpoints.down("md")} {
        flex-direction: row-reverse;
    }
`

const StyledSearchInput = muiStyled(TextField)(({ theme }) => ({
    color: 'inherit',
    background: theme.palette.background.default,

    [theme.breakpoints.down('md')]: {
        width: '100%',
    },
    '& .MuiInputBase-input': {
        background: theme.palette.background.default,
        transition: theme.transitions.create('width'),
        width: '100%',

        [theme.breakpoints.up('md')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));
//#endregion

const Navbar = () => {
    //#region construct
    const { cartProducts } = useCart();
    const location = useLocation();
    const colorMode = useContext(ColorModeContext);
    const theme = useTheme();
    const mobileMode = useMediaQuery(theme.breakpoints.down('md'));

    //Test
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 100
    });

    //Drawer open state
    const [openDrawer, setOpenDrawer] = useState(undefined);

    //Search field expand
    const [searchField, setSearchField] = useState('');
    const [focus, setFocus] = useState(false);
    const [toggle, setToggle] = useState(searchField !== '');

    //Other
    const { username, image, roles } = useAuth();
    const navigate = useNavigate();
    const logout = useLogout();

    //Anchor for popoever & open state
    const [anchorEl, setAnchorEl] = useState(undefined);
    const [anchorElCart, setAnchorElCart] = useState(undefined);
    const open = Boolean(anchorEl);
    const openCart = Boolean(anchorElCart);

    const hanldeCartPopover = (e) => { setAnchorElCart(e.currentTarget) };
    const handleCartClose = () => { setAnchorElCart(null) };
    const handleProfilePopover = (e) => { setAnchorEl(e.currentTarget) };
    const handleProfileClose = () => { setAnchorEl(null) };

    //Toggle drawer open state
    const handleToggleDrawer = (value) => { setOpenDrawer(value) };
    const toggleSearch = () => { setToggle(prev => !prev) };

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
                <Grid container size="grow">
                    <Grid size={{ xs: 12, md: 6 }}>
                        <ContactContainer>
                            <Contact><PhoneIcon sx={{ fontSize: 18, marginRight: 1 }} />+8419130248</Contact>
                            <Contact><MailIcon sx={{ fontSize: 18, marginRight: 1 }} />haductrong01629@gmail.com</Contact>
                        </ContactContainer>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <SocialContainer>
                            <Social color="3B5999"><FacebookIcon sx={{ fontSize: 18 }} /></Social>
                            <Social color="FF0000"><YouTubeIcon sx={{ fontSize: 18 }} /></Social>
                            <Social color="E4405F"><InstagramIcon sx={{ fontSize: 18 }} /></Social>
                            <Social color="55ACEE"><TwitterIcon sx={{ fontSize: 18 }} /></Social>
                        </SocialContainer>
                    </Grid>
                </Grid>
            </TopHeader>
            <StyledAppBar
                sx={{
                    marginBottom: { xs: 0, md: 2 },
                    boxShadow: 'none'
                }}
                className={!mobileMode || trigger ? '' : 'top'}
                position="sticky"
            >
                <Wrapper>
                    <Grid container size="grow">
                        <Grid size={{ xs: 12, md: "grow" }} sx={{ display: 'flex', alignItems: 'center' }}>
                            <Left>
                                {mobileMode &&
                                    <>
                                        <Box
                                            display={isToggleSearch ? 'none' : 'flex'}
                                            flex={1}
                                            alignItems="center"
                                        >
                                            <IconButton onClick={() => handleToggleDrawer(true)}>
                                                <MenuIcon sx={{ fontSize: 26 }} />
                                            </IconButton>
                                        </Box>
                                        <Suspense fallback={<></>}>
                                            {openDrawer !== undefined &&
                                                <NavDrawer {...{
                                                    openDrawer, username, roles, location,
                                                    products: cartProducts, logout, theme, colorMode,
                                                    handleOpen: () => handleToggleDrawer(true),
                                                    handleClose: () => handleToggleDrawer(false)
                                                }} />
                                            }
                                        </Suspense>
                                    </>
                                }
                                <Link to={`/`}>
                                    <Logo className={isToggleSearch ? 'active' : ''}>
                                        <LogoImage src="/bell.svg" className="logo" alt="RING! logo" />
                                        <LogoTitle>RING!&nbsp;</LogoTitle>
                                        <LogoSubtitle>- BOOKSTORES</LogoSubtitle>
                                    </Logo>
                                </Link>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    flex={1}
                                    justifyContent={isToggleSearch ? { xs: 'space-between', md: 'flex-start' } : 'flex-start'}
                                    flexDirection={{ xs: 'row-reverse', md: 'row' }}
                                >
                                    <Link to={'/filters'} title="Duyệt cửa hàng">
                                        <StyledIconButton aria-label="explore">
                                            <Storefront sx={{ fontSize: '26px' }} />
                                        </StyledIconButton>
                                    </Link>
                                    <StyledSearchForm onSubmit={handleSubmitSearch}>
                                        {isToggleSearch &&
                                            <StyledSearchInput
                                                placeholder='Tìm kiếm... '
                                                autoFocus
                                                autoComplete="search"
                                                onFocus={() => setFocus(true)}
                                                onBlur={() => setFocus(false)}
                                                onChange={(e) => setSearchField(e.target.value)}
                                                value={searchField}
                                                id="search"
                                                size="small"
                                                slotProps={{
                                                    input: {
                                                        startAdornment: (< SearchIcon sx={{ marginRight: 1 }} />)
                                                    },
                                                }}
                                            />
                                        }
                                        <StyledIconButton aria-label="search toggle" onClick={() => toggleSearch()}>
                                            {isToggleSearch ? <Close sx={{ fontSize: '26px' }} /> : <SearchIcon sx={{ fontSize: '26px' }} />}
                                        </StyledIconButton>
                                    </StyledSearchForm>
                                </Box>
                            </Left>
                        </Grid>
                        {!mobileMode &&
                            <Grid size={{ xs: 12, md: "auto" }} sx={{ display: { xs: 'none', md: 'flex' } }}>
                                <Right>
                                    <NavItem>
                                        <Stack spacing={1} direction="row" sx={{ color: 'action.active' }} alignItems="center">
                                            <StyledIconButton className="nav" aria-label="notification">
                                                <Badge badgeContent={0} anchorOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'right',
                                                }}>
                                                    <Notifications />
                                                </Badge>
                                                <IconText>Thông báo</IconText>
                                            </StyledIconButton>
                                            <Box
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
                                                            <ShoppingCart />
                                                        </Badge>
                                                        <IconText>Giỏ hàng</IconText>
                                                    </StyledIconButton>
                                                </Link>
                                                <Suspense fallback={<></>}>
                                                    {anchorElCart !== undefined &&
                                                        <MiniCart {...{ openCart, anchorElCart, handleClose: handleCartClose, products: cartProducts }} />
                                                    }
                                                </Suspense>
                                            </Box>
                                            {username ? (
                                                <Box
                                                    aria-owns={open ? "mouse-over-popover" : undefined}
                                                    aria-haspopup="true"
                                                    onMouseEnter={handleProfilePopover}
                                                    onMouseLeave={handleProfileClose}
                                                >
                                                    <Link to={'/profile/detail'} title="Tài khoản">
                                                        <StyledIconButton className="nav" aria-label="profile">
                                                            <Avatar sx={{ width: 24, height: 24, fontSize: '16px' }} src={image ? image + '?size=tiny' : null} />
                                                            <IconText className="username">{username}</IconText>
                                                        </StyledIconButton>
                                                    </Link>
                                                    <Suspense fallback={<></>}>
                                                        {anchorEl !== undefined &&
                                                            <ProfilePopover {...{
                                                                open, anchorEl, handleClose: handleProfileClose,
                                                                roles, logout, theme, colorMode, image
                                                            }} />
                                                        }
                                                    </Suspense>
                                                </Box>
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
            </StyledAppBar >
        </>
    )
}

export default Navbar