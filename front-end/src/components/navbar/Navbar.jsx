import styled from 'styled-components';
import { useState } from 'react';
import { styled as muiStyled } from '@mui/system';
import {
    Search as SearchIcon, ShoppingCart as ShoppingCartIcon, Mail as MailIcon, Phone as PhoneIcon, Facebook as FacebookIcon, YouTube as YouTubeIcon,
    Instagram as InstagramIcon, Twitter as TwitterIcon, Menu as MenuIcon, Lock as LockIcon, NotificationsActive as NotificationsActiveIcon, Storefront
} from '@mui/icons-material';
import { Stack, Badge, IconButton, Avatar, Box, Grid, TextField, AppBar, Collapse, useTheme, useMediaQuery } from '@mui/material';
import { Link, useLocation, useNavigate } from "react-router-dom";
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
    padding: 5px 20px;
    justify-content: space-between;
    align-items: center;

    ${props => props.theme.breakpoints.up("sm_md")} {
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

const SearchInput = styled(TextField)({
    '& .MuiInputBase-root': {
        borderRadius: 0,
        transition: 'all .3s ease',
    },
    '& label.Mui-focused': {
        color: '#A0AAB4',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#B2BAC2',
        background: 'transparent'
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'transparent',
        },
        '&:hover fieldset': {
            color: 'inherit',
            borderColor: '#B2BAC2',
            transition: 'all .3s ease',
        },
        '&.Mui-focused fieldset': {
            color: 'inherit',
            borderColor: '#63e399',
        },
    },
    '&.active': {
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#B2BAC2',
            },
        }
    }
});

const Logo = styled.h2`
    position: relative;
    font-family: abel;
    font-size: 27px;
    text-transform: uppercase;
    font-weight: 500;
    color: ${props => props.theme.palette.secondary.main};
    cursor: pointer;
    align-items: center;
    display: flex;
    width: 251px;
    margin: 5px 0px 5px 15px;
    white-space: nowrap;
    overflow: hidden;
    transition: all .3s ease;

    &.active {
        width: 110px;
        
        ${props => props.theme.breakpoints.down("sm")} {
            width: 0px;
        }
    }

    ${props => props.theme.breakpoints.down("md")} {
        transform: translateX(20px);
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
    borderRadius: '0',

    '&:hover': {
        backgroundColor: 'transparent',
        color: theme.palette.secondary.main,
    },

    '&:focus': {
        outline: 'none',
    },
}));

const IconText = styled.p`
    font-size: 13px;
    margin-left: 5px;

    ${props => props.theme.breakpoints.down("md_lg")} {
        display: none;

        &.username {
            display: block;
        }
    }
`
//#endregion

const Navbar = () => {
    //#region construct
    const { cartProducts } = useCart();
    const location = useLocation();
    const theme = useTheme();
    const mobileMode = useMediaQuery(theme.breakpoints.down('md'));

    //Drawer open state
    const [openDrawer, setOpen] = useState(false);

    //Search field expand
    const [hover, setHover] = useState(false);
    const [delayHandler, setDelayHandler] = useState(null);
    const [focus, setFocus] = useState(false);
    const [searchField, setSearchField] = useState('');

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

    //Confirm search
    const handleSubmitSearch = (e) => {
        e.preventDefault();
        navigate(`/filters?keyword=${searchField}`);
    }

    //Hover search field
    const handleMouseEnter = (e) => {
        setDelayHandler(setTimeout(() => {
            setHover(true)
        }, 250))
    }

    //Leave search field
    const handlOnMouseLeave = () => {
        setHover(false);
        clearTimeout(delayHandler);
    }
    //#endregion

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
                                    <Box display={{ xs: 'flex', md: 'none' }} alignItems={'center'}>
                                        <IconButton onClick={toggleDrawer(true)}><MenuIcon sx={{ fontSize: 26 }} /></IconButton>
                                        <NavDrawer {...{ openDrawer, setOpen, toggleDrawer, username, roles, location,
                                            products: cartProducts, navigate, logout, ImageLogo }} />
                                    </Box>
                                }
                                <Link to={`/`}>
                                    <Logo className={searchField || hover || focus ? 'active' : ''}>
                                        <ImageLogo src="/bell.svg" className="logo" alt="RING! Logo" />RING!&nbsp; <p style={{ color: '#424242', margin: 0 }}>- BOOKSTORE</p>
                                    </Logo>
                                </Link>
                                <Box sx={{ display: 'flex' }} flexDirection={{ xs: 'row-reverse', md: 'row' }}>
                                    <Link to={'/filters'} title="Duyệt cửa hàng">
                                        <StyledIconButton aria-label="explore"
                                            sx={{
                                                marginLeft: 2,
                                                marginRight: 0,
                                                zIndex: 10,
                                            }}>
                                            <Storefront sx={{ fontSize: '26px' }} />
                                        </StyledIconButton>
                                    </Link>
                                    <Box
                                        sx={{ display: 'flex', alignItems: 'center', marginLeft: '-40' }}
                                    >
                                        <Collapse
                                            orientation="horizontal"
                                            timeout={300}
                                            easing={'ease'}
                                            in={searchField || hover || focus}
                                            collapsedSize={40}
                                        >
                                            <form onSubmit={handleSubmitSearch}>
                                                <SearchInput
                                                    className={searchField ? 'active' : ''}
                                                    placeholder='Tìm kiếm... '
                                                    onMouseEnter={handleMouseEnter}
                                                    onMouseLeave={handlOnMouseLeave}
                                                    onFocus={() => setFocus(true)}
                                                    onBlur={() => setFocus(false)}
                                                    onChange={(e) => setSearchField(e.target.value)}
                                                    value={searchField}
                                                    id="search"
                                                    size="small"
                                                    width={50}
                                                    InputProps={{
                                                        endAdornment: <SearchIcon style={{ color: "gray" }} />
                                                    }}
                                                />
                                            </form>
                                        </Collapse>
                                    </Box>
                                </Box>
                            </Left>
                        </Grid>
                        {!mobileMode &&
                            <Grid item xs={12} md={5.5} sx={{ display: { xs: 'none', md: 'flex' } }}>
                                <Right>
                                    <NavItem>
                                        <Stack spacing={1} direction="row" sx={{ color: 'action.active' }} alignItems={'center'}>
                                            <StyledIconButton aria-label="notification">
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
                                                    <StyledIconButton aria-label="cart">
                                                        <Badge color="secondary" badgeContent={cartProducts?.length} anchorOrigin={{
                                                            vertical: 'top',
                                                            horizontal: 'right',
                                                        }}>
                                                            <ShoppingCartIcon />
                                                        </Badge>
                                                        <IconText>Giỏ hàng</IconText>
                                                    </StyledIconButton>
                                                </Link>
                                                <MiniCart {...{ openCart, anchorElCart, handleClose: handleCartClose, products: cartProducts }} />
                                            </div>
                                            {username ? (
                                                <div
                                                    aria-owns={open ? "mouse-over-popover" : undefined}
                                                    aria-haspopup="true"
                                                    onMouseEnter={handleProfilePopover}
                                                    onMouseLeave={handleProfileClose}
                                                >
                                                    <Link to={'/profile/detail'} title="Tài khoản">
                                                        <StyledIconButton aria-label="profile">
                                                            <Avatar sx={{ width: 32, height: 32 }}>{username?.charAt(0) ?? 'P'}</Avatar>
                                                            <IconText className="username">{username}</IconText>
                                                        </StyledIconButton>
                                                    </Link>
                                                    <ProfilePopover {...{ open, anchorEl, handleClose: handleProfileClose, navigate, roles, logout }} />
                                                </div>
                                            ) : (
                                                <Link to={'/login'} state={{ from: location }} replace title="Đăng nhập">
                                                    <StyledIconButton aria-label="login">
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