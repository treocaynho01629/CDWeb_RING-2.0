import styled from 'styled-components';
import { useState } from 'react';
import { styled as muiStyled } from '@mui/system';
import {
    Search as SearchIcon, ShoppingCart as ShoppingCartIcon, Mail as MailIcon, Phone as PhoneIcon, Facebook as FacebookIcon, YouTube as YouTubeIcon,
    Instagram as InstagramIcon, Twitter as TwitterIcon, Menu as MenuIcon, Lock as LockIcon, NotificationsActive as NotificationsActiveIcon, Storefront
} from '@mui/icons-material';
import { Stack, Badge, IconButton, Avatar, Tooltip, Box, Grid, TextField, AppBar, useScrollTrigger, Collapse, Toolbar } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from 'prop-types';
import useLogout from "../../hooks/useLogout";
import useAuth from "../../hooks/useAuth";
import NavDrawer from './NavDrawer';
import MiniCart from './MiniCart';
import ProfilePopover from './ProfilePopover';

//#region styled
const Container = styled.div`
`

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 5px 20px;
    justify-content: space-between;
    align-items: center;

    @media (min-width: 768px) {
        width: 750px;
        margin-left: auto;
        margin-right: auto;
    }
    @media (min-width: 992px) {
        width: 970px;
    }
    @media (min-width: 1200px) {
        width: 1170px;
    }
`

const TopHeader = styled.div`
    padding: 0 30px;
    background-color: #ebebeb;
    color: #424242;
    display: none;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
    font-weight: bold;

    @media (min-width: 900px) {
        display: flex
    }
`

const ContactContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    @media (min-width: 900px) {
        justify-content: flex-start;
    }
`

const SocialContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    @media (min-width: 900px) {
        justify-content: flex-end;
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
    color: #424242;
`

const Social = styled.p`
    background-color: 'transparent';
    color: #424242;
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
    justify-content: space-between;

    @media (min-width: 900px) {
        justify-content: flex-start;
    }
`

const Right = styled.div`
    flex: 1;
    display: none;
    align-items: center;
    justify-content: space-evenly;

    @media (min-width: 900px) {
        justify-content: flex-end;
        display: flex;
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
    margin: 5px 0px 5px 0px;
    width: 110px;
    white-space: nowrap;
    overflow: hidden;
    transform: translateX(20px);
    transition: all .3s ease;

    p { width: 0; }

    &.active {
        width: 0px;

        @media (min-width: 600px) {
            width: 110px;
        }
    }

    @media (min-width: 768px) {
        width: 251px;
        margin: 5px 0px 5px 15px;

        p {
            width: auto;
        }
    }

    @media (min-width: 900px) {
        transform: none;
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
    '&:hover': {
        backgroundColor: 'transparent',
        color: theme.palette.secondary.main,
    },

    '&:focus': {
        outline: 'none',
    },

    outline: 'none',
    border: '0',
    borderRadius: '0',
}));

const Button = styled.button`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    justify-content: center;
    border-radius: 0;
    padding: 0;
    width: 40px;
    height: 40px;
    background-color: transparent;
    color: gray;
    outline: none;
    border: none;
    transition: all 0.25s ease;

    &:hover {
        transform: scaleY(1.1);
        color: black,
    }

    &:focus {
        outline: none;
        border: none;
    }

    @media (min-width: 900px) {
        display: none
    }
`
//#endregion

//Hide top header bar onscroll
function HideOnScroll(props) {
    const { children, window } = props;

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 100,
        target: window ? window() : undefined,
    });

    return (
        <Collapse className={"top-header"} in={!trigger} sx={{ display: { xs: 'none', md: 'block' } }}>
            {children}
        </Collapse>
    );
}

HideOnScroll.propTypes = {
    children: PropTypes.element.isRequired,
    window: PropTypes.func,
};

const Navbar = (props) => {
    //#region construct
    const products = useSelector(state => state.cart.products); //Products from redux carts

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

    const handlePopoverOpen = (event) => {
        setAnchorElCart(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorElCart(null);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    //Logout
    const signOut = async () => {
        await logout();
        const { enqueueSnackbar } = await import('notistack');
        navigate('/');
        enqueueSnackbar('Đã đăng xuất!', { variant: 'error' });
    }

    //Toggle drawer open state
    const toggleDrawer = (open) => (e) => {
        setOpen(open)
    };

    //Confirm search
    const handleSubmitSearch = (e) => {
        e.preventDefault();
        navigate(`/filters?keyword=${searchField}`);
        setSearchField('');
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
        <Container>
            <AppBar sx={{ backgroundColor: 'background.default' }} position="fixed">
                <Stack>
                    <HideOnScroll {...props}>
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
                    </HideOnScroll>
                    <Wrapper>
                        <Grid container>
                            <Grid item xs={12} md={6.5} sx={{ display: 'flex', alignItems: 'center' }}>
                                <Left>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Button onClick={toggleDrawer(true)}><MenuIcon sx={{ fontSize: 26 }} /></Button>
                                        <NavDrawer {...{ openDrawer, setOpen, toggleDrawer, username, roles, products, navigate, signOut, ImageLogo, Button }} />
                                    </Box>
                                    <Link to={`/`}>
                                        <Logo className={searchField || hover || focus ? 'active' : ''}>
                                            <ImageLogo src="/bell.svg" className="logo" alt="RING! Logo" />RING!&nbsp; <p style={{ color: '#424242', margin: 0 }}>- BOOKSTORE</p>
                                        </Logo>
                                    </Link>
                                    <Box sx={{ display: 'flex' }} flexDirection={{ xs: 'row-reverse', md: 'row' }}>
                                        <Tooltip title="Duyệt cửa hàng">
                                            <StyledIconButton aria-label="explore"
                                                onClick={() => navigate('/filters')}
                                                sx={{
                                                    marginLeft: 2,
                                                    marginRight: 0,
                                                    zIndex: 10,
                                                }}>
                                                <Storefront sx={{ fontSize: '26px' }} />
                                            </StyledIconButton>
                                        </Tooltip>
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
                            <Grid item xs={12} md={5.5}>
                                <Right>
                                    <NavItem>
                                        <Stack spacing={1} direction="row" sx={{ color: 'action.active' }}>
                                            <StyledIconButton aria-label="notification">
                                                <Badge badgeContent={0} anchorOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'left',
                                                }}>
                                                    <NotificationsActiveIcon />
                                                </Badge>
                                                <p style={{ fontSize: '13px', marginLeft: '5px' }}>Thông báo</p>
                                            </StyledIconButton>
                                            <div
                                                aria-owns={openCart ? "mouse-over-popover" : undefined}
                                                aria-haspopup="true"
                                                onMouseEnter={handlePopoverOpen}
                                                onMouseLeave={handlePopoverClose}
                                            >
                                                <Link to={`/cart`}>
                                                    <StyledIconButton aria-label="cart">
                                                        <Badge color="secondary" badgeContent={products?.length} anchorOrigin={{
                                                            vertical: 'top',
                                                            horizontal: 'left',
                                                        }}>
                                                            <ShoppingCartIcon />
                                                        </Badge>
                                                        <p style={{ fontSize: '13px', marginLeft: '5px' }}>Giỏ hàng</p>
                                                    </StyledIconButton>
                                                </Link>
                                                <MiniCart {...{ openCart, anchorElCart, handlePopoverClose, products }} />
                                            </div>
                                            {username ? (
                                                <Tooltip title="Tài khoản">
                                                    <StyledIconButton
                                                        onClick={handleClick}
                                                        size="small"
                                                        sx={{ ml: 2 }}
                                                        aria-controls={open ? 'account-menu' : undefined}
                                                        aria-haspopup="true"
                                                        aria-expanded={open ? 'true' : undefined}
                                                    >
                                                        <Avatar sx={{ width: 32, height: 32 }}>{username?.charAt(0) ?? 'P'}</Avatar>
                                                        <p style={{ fontSize: '13px', marginLeft: '5px' }}>{username}</p>
                                                    </StyledIconButton>
                                                </Tooltip>
                                            ) : (
                                                <Link to={`/login`}>
                                                    <StyledIconButton aria-label="login">
                                                        <LockIcon />
                                                        <p style={{ fontSize: '13px', marginLeft: '5px' }}>Đăng nhập</p>
                                                    </StyledIconButton>
                                                </Link>
                                            )}
                                        </Stack>
                                        <ProfilePopover {...{ open, anchorEl, handleClose, navigate, roles, signOut }} />
                                    </NavItem>
                                </Right>
                            </Grid>
                        </Grid>
                    </Wrapper>
                </Stack>
            </AppBar>
            <Toolbar sx={{ marginTop: { xs: 0, md: '35px' }, marginBottom: '9px' }} />
        </Container>
    )
}

export default Navbar