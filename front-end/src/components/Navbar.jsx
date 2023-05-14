import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { styled as muiStyled } from '@mui/system';
import PropTypes from 'prop-types';

import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import MenuIcon from '@mui/icons-material/Menu';

import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import LockIcon from '@mui/icons-material/Lock';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import Avatar from '@mui/material/Avatar';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/Help';
import Logout from '@mui/icons-material/Logout';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import AppBar from '@mui/material/AppBar';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Slide from '@mui/material/Slide';

import { useNavigate, Link } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import { useSelector } from "react-redux";
import useAuth from "../hooks/useAuth";

const Container = styled.div`
    background-color: white;
    border-bottom: 0.5px solid;
    border-color: lightgray;
    align-items: center;
    margin-bottom: 150px;
`

const Wrapper = styled.div`
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
    display: flex;
    flex-direction: column;

    padding: 5px 30px;
    justify-content: space-between;
    align-items: center;

    @media (min-width: 768px) {
        width: 750px;
    }
    @media (min-width: 992px) {
        width: 970px;
    }
    @media (min-width: 1200px) {
        width: 1170px;
    }
`

const TopHeader = styled.div`
    height: 50%;
    padding: 0 30px;
    background-color: #ebebeb;
    color: #424242;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
    font-weight: bold;
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
        background-color: #${props=>props.color};
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
      marginLeft: '50px'
    },
    '& label.Mui-focused': {
      color: '#A0AAB4'
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#B2BAC2',
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: 0,
      '& fieldset': {
        borderRadius: 0,
        borderColor: '#E0E3E7',
      },
      '&:hover fieldset': {
        borderRadius: 0,
        borderColor: '#B2BAC2',
      },
      '&.Mui-focused fieldset': {
        borderRadius: 0,
        borderColor: '#6F7E8C',
      },
    },
    '& input:valid + fieldset': {
      borderColor: 'lightgray',
      borderRadius: 0,
      borderWidth: 1,
    },
    '& input:invalid + fieldset': {
      borderColor: '#e66161',
      borderRadius: 0,
      borderWidth: 1,
    },
    '& input:valid:focus + fieldset': {
      borderColor: '#63e399',
      borderLeftWidth: 4,
      borderRadius: 0,
      padding: '4px !important', 
    },
});

const Logo = styled.h2`
    position: relative;
    font-family: abel;
    font-size: 27px;
    text-transform: uppercase;
    font-weight: 500;
    color: #63e399;
    cursor: pointer;
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    margin: 5px 0px 5px 15px;
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

const MiniCartContainer = styled.div`
    width: 400px;
    padding: 10px 20px;
`

const ProductTitle = styled.h5`
    font-size: 14px;
    margin: 0;
    text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	
	@supports (-webkit-line-clamp: 1) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: initial;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
`

const ProductPrice = styled.span`
    font-size: 16px;
    font-weight: bold;
    color: #63e399;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
`

const StyledIconButton = muiStyled(IconButton)(({ theme }) => ({
    '&:hover': {
        backgroundColor: 'transparent',
        color: '#63e399',
    },

    '&:focus':{
        outline: 'none',
    },

    outline: 'none',
    border: '0',
    borderRadius: '0',
}));

const StyledBadge = muiStyled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      left: -3,
      top: 4,
      border: `2px solid`,
      padding: '0 4px',
      color: 'white',
      backgroundColor: '#63e399'
    },
}));

const Button = styled.button`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    justify-content: center;
    border-radius: 0;
    padding: 0;
    margin-right: 10px;
    width: 40px;
    height: 40px;
    background-color: transparent;
    color: black;
    outline: none;
    border: none;
    transition: all 0.5s ease;

    &:hover {
        background-color: #63e399;
        color: white;
    }

    @media (min-width: 900px) {
        display: none
    }
`

const CartButton = styled.button`
    background-color: #63e399;
    padding: 0px 15px;
    height: 40px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 0;
    border: none;
    transition: all 0.5s ease;

    &:hover {
        background-color: lightgray;
        color: black;
    }
`

function HideOnScroll(props) {
    const { children, window } = props;
    const [ display, setDisplay ] = useState(['block'])

    const trigger = useScrollTrigger({
      target: window ? window() : undefined,
    });

    useEffect(() => {
        if (!trigger){
            setDisplay('block');
        }
    }, [trigger])

    return (
      <Slide className={"top-header"} style={{display: display}} 
        appear={false} direction="down" in={!trigger} 
        addEndListener={() => {if (trigger) setDisplay('none')}}>
        {children}
      </Slide>
    );
  }
  
  HideOnScroll.propTypes = {
    children: PropTypes.element.isRequired,
    window: PropTypes.func,
};

const Navbar = (props) => {
    const products = useSelector(state => state.cart.products); //Lấy products trong giỏ từ redux
    const [openDrawer, setOpen] = useState(false);
    const [searchField, setSearchField] = useState('');
    const { auth } = useAuth();
    const navigate = useNavigate();
    const logout = useLogout();
    
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

    const signOut = async () => {
        await logout();
        navigate('/');
    }

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const toggleDrawer = () => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
    }
        setOpen(!openDrawer)
    };

    const handleSubmitSearch = async (e) => {
        e.preventDefault();
        navigate(`/filters?keyword=${searchField}`);
    }

    let sublist;
    if (auth.userName){
        sublist = 
        <Grid>
            <List>
                <ListItem disablePadding>
                <ListItemButton>
                    <ListItemIcon>
                        <Avatar /> 
                    </ListItemIcon>
                    <ListItemText primary={auth.userName}  />
                </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                <ListItemButton>
                    <ListItemIcon>
                        <DeliveryDiningIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Đơn giao"  />
                </ListItemButton>
                </ListItem>
            </List>
            <Divider/>
            <List>
                <ListItem disablePadding>
                <ListItemButton>
                    <ListItemIcon>
                        <HelpIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Trợ giúp"  />
                </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                <ListItemButton onClick={signOut}>
                    <ListItemIcon>
                        <Logout/>
                    </ListItemIcon>
                    <ListItemText primary="Đăng xuất"  />
                </ListItemButton>
                </ListItem>
            </List>
        </Grid>
    } else {
        sublist = 
        <List>
            <ListItem disablePadding>
                <ListItemButton>
                    <ListItemIcon>
                        <HelpIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Trợ giúp"  />
                </ListItemButton>
            </ListItem>

            <Link to={`/login`}>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <LockIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Đăng nhập"  />
                    </ListItemButton>
                </ListItem>
            </Link>
        </List>
    }
    
    const list = (anchor) => (
    <Box
        sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 300 }}
        role="presentation"
    >
        <Link to={`/`} style={{paddingLeft: '20px'}}>
            <Logo>
                <ImageLogo src="/bell.svg" className="logo" alt="RING! logo" />RING!&nbsp; <p style={{color: '#424242', margin: 0}}>- BOOKSTORES</p>
            </Logo>
        </Link>
        <List>
            <ListItem disablePadding>
                <ListItemButton>
                    <ListItemIcon>
                        <NotificationsActiveIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Thông báo (4)" />
                </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
                <Link to={`/cart`}>
                    <ListItemButton>
                        <ListItemIcon>
                            <ShoppingCartIcon/>
                        </ListItemIcon>
                        <ListItemText>Giỏ hàng ({products.length})</ListItemText>
                    </ListItemButton>
                </Link>
            </ListItem>
        </List>
        <Divider />
        {sublist}
    </Box>
    );

    let profile = <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
        elevation: 0,
        sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            borderRadius: 0,
            '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
            },
            '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
            },
        },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
        <MenuItem>
            <Avatar /> Thông tin tài khoản
        </MenuItem>
        <MenuItem>
            <ListItemIcon>
                <DeliveryDiningIcon fontSize="small"/> 
            </ListItemIcon>
            Đơn giao
        </MenuItem>
        <Divider />
        <MenuItem>
            <ListItemIcon>
                <HelpIcon fontSize="small" />
            </ListItemIcon>
            Trợ giúp
        </MenuItem>
        <MenuItem onClick={signOut}>
            <ListItemIcon>
                <Logout fontSize="small" />
            </ListItemIcon>
            Đăng xuất
        </MenuItem>
    </Menu>

    let miniCart = <Popover  
        id="mouse-over-popover"
        sx={{
        pointerEvents: 'none',
        }}
        open={openCart}
        anchorEl={anchorElCart}
        onClose={handlePopoverClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        disableRestoreFocus
        PaperProps={{
            elevation: 0,
            sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                borderRadius: 0,
                pointerEvents: 'auto',
                
                '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
                },
            },
            // onMouseEnter: handlePopoverOpen,
            onMouseLeave: handlePopoverClose
        }}
        >
        <MiniCartContainer>
        <div style={{margin: '20px 0px'}}><b>Sản phẩm trong giỏ hàng</b></div>
        {products.length == 0 ?
            <p>Trống</p>
        :
            <>
            {products.slice(0, 5).map((product, index) => (
            <Card key={index} mt={0} sx={{ display: 'flex', alignItems: 'center' }}>
                <CardMedia
                    component="img"
                    sx={{ width: 50, height: 50 }}
                    image={product.image}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent >
                        <ProductTitle>{product.title}</ProductTitle>
                        <ProductPrice>{product.price.toLocaleString()} đ</ProductPrice>
                    </CardContent>
                </Box>
            </Card>
            ))}
            <Box sx={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between' }}>
                {products.length <= 5 ? <p>&nbsp;</p> : <p>Và còn lại {products.length - 5} trong giỏ</p>}
                <CartButton onClick={() =>  navigate('/cart')}>Xem giỏ hàng</CartButton>
            </Box>
            </>
        }
        </MiniCartContainer>
    </Popover>

  return (
    <Container>
        <AppBar sx={{backgroundColor: 'white'}} position="fixed">
            <Stack>
                <HideOnScroll {...props}>
                    <TopHeader>
                        <Grid container>
                            <Grid item xs={12} md={6}>
                                <ContactContainer>
                                    <Contact><PhoneIcon sx={{fontSize: 18, marginRight: 1}}/>+12345678890</Contact>
                                    <Contact><MailIcon sx={{fontSize: 18, marginRight: 1}}/>daihocnonglam@hcmuaf.edu.vn</Contact>
                                </ContactContainer>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <SocialContainer>
                                    <Social color="3B5999"><FacebookIcon sx={{fontSize: 18}}/></Social>
                                    <Social color="FF0000"><YouTubeIcon sx={{fontSize: 18}}/></Social>
                                    <Social color="E4405F"><InstagramIcon sx={{fontSize: 18}}/></Social>
                                    <Social color="55ACEE"><TwitterIcon sx={{fontSize: 18}}/></Social>
                                </SocialContainer>
                            </Grid>
                        </Grid>
                    </TopHeader>
                </HideOnScroll>
                <Wrapper>
                    <Grid container>
                        <Grid item xs={12} md={7}>
                            <Left>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <Button onClick={toggleDrawer()}><MenuIcon/></Button>
                                    <Drawer
                                        anchor='left'
                                        open={openDrawer}
                                        onClose={toggleDrawer()}
                                        >
                                        {list()}
                                    </Drawer>
                                    <Link to={`/`}>
                                    <Logo>
                                        <ImageLogo src="/bell.svg" className="logo" alt="RING! logo" />RING!&nbsp; <p style={{color: '#424242', margin: 0}}>- BOOKSTORE</p>
                                    </Logo>
                                    </Link>
                                </div>
                                <form onSubmit={handleSubmitSearch}>
                                    <SearchInput placeholder='Tìm kiếm... '
                                    onChange={(e) => setSearchField(e.target.value)}
                                    value={searchField}
                                    id="search"
                                    size="small"
                                    InputProps={{
                                        endAdornment: <SearchIcon style={{color:"gray"}}/>
                                    }}
                                    />
                                </form>
                            </Left>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <Right>
                                <NavItem>
                                    <Stack spacing={1} direction="row" sx={{ color: 'action.active' }}>
                                        <StyledIconButton disableRipple disableFocusRipple aria-label="notification">
                                            <StyledBadge badgeContent={4} anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}>
                                                <NotificationsActiveIcon/>
                                            </StyledBadge>
                                            <p style={{fontSize: '13px', marginLeft: '5px'}}>Thông báo</p>
                                        </StyledIconButton>
                                        <Link to={`/cart`}>
                                            <StyledIconButton disableRipple disableFocusRipple 
                                            aria-label="cart"
                                            aria-owns={openCart ? "mouse-over-popover" : undefined}
                                            aria-haspopup="true"
                                            onMouseEnter={handlePopoverOpen}
                                            onMouseLeave={handlePopoverClose}>
                                                <StyledBadge badgeContent={products.length} anchorOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'left',
                                                }}>
                                                    <ShoppingCartIcon/>
                                                </StyledBadge>
                                                <p style={{fontSize: '13px', marginLeft: '5px'}}>Giỏ hàng</p>
                                                <>
                                                {miniCart}
                                                </>
                                            </StyledIconButton>
                                        </Link>
                                        {auth.userName ? (
                                        <Tooltip title="Tài khoản">
                                            <StyledIconButton
                                                disableRipple disableFocusRipple
                                                onClick={handleClick}
                                                size="small"
                                                sx={{ ml: 2 }}
                                                aria-controls={open ? 'account-menu' : undefined}
                                                aria-haspopup="true"
                                                aria-expanded={open ? 'true' : undefined}
                                            >
                                                <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
                                                <p style={{fontSize: '13px', marginLeft: '5px'}}>{auth.userName}</p>
                                            </StyledIconButton>
                                        </Tooltip>
                                        ) : (
                                        <Link to={`/login`}>
                                            <StyledIconButton disableRipple disableFocusRipple aria-label="login">
                                                <LockIcon/>
                                                <p style={{fontSize: '13px', marginLeft: '5px'}}>Đăng nhập</p>
                                            </StyledIconButton>
                                        </Link>
                                        )}
                                    </Stack>
                                    <>
                                    {profile}
                                    </>
                                </NavItem>
                            </Right>
                        </Grid>
                    </Grid>
                </Wrapper>
            </Stack>
        </AppBar>
    </Container>
  )
}

export default Navbar