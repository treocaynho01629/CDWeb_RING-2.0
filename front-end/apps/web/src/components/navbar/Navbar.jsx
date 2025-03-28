import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Mail,
  Phone,
  Facebook,
  YouTube,
  LinkedIn,
  Twitter,
  Menu,
  LockOutlined,
  Storefront,
  ShoppingCartOutlined,
  NotificationsOutlined,
  Search,
  SearchOff,
  KeyboardArrowLeft,
  HomeOutlined,
} from "@mui/icons-material";
import {
  Stack,
  Badge,
  IconButton,
  Avatar,
  Box,
  Grid2 as Grid,
  AppBar,
  useMediaQuery,
  useColorScheme,
  alpha,
} from "@mui/material";
import { Link, useLocation, useMatch } from "react-router";
import { LogoImage } from "@ring/ui/Components";
import { debounce } from "lodash-es";
import { useLogout, useAuth } from "@ring/auth";
import useCart from "../../hooks/useCart";
import styled from "@emotion/styled";
import SearchInput from "./SearchInput";

const NavDrawer = lazy(() => import("./NavDrawer"));
const MiniCart = lazy(() => import("./MiniCart"));
const ProfilePopover = lazy(() => import("./ProfilePopover"));

//#region styled
const Wrapper = styled.div`
  padding: 5px;

  ${({ theme }) => theme.breakpoints.up("sm_md")} {
    padding: 5px 20px;
    width: 750px;
    margin-left: auto;
    margin-right: auto;
  }

  ${({ theme }) => theme.breakpoints.up("md_lg")} {
    width: 970px;
  }

  ${({ theme }) => theme.breakpoints.up("lg")} {
    width: 1170px;
  }
`;

const TopHeader = styled.div`
  padding: 0 30px;
  background-color: ${({ theme }) => theme.palette.divider};
  justify-content: space-between;
  font-size: 15px;
  font-weight: bold;
  display: flex;
  align-items: center;
  margin-bottom: -1px;

  ${({ theme }) => theme.breakpoints.down("md")} {
    display: none;
  }
`;

const ContactContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  ${({ theme }) => theme.breakpoints.down("md")} {
    justify-content: center;
  }
`;

const SocialContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  ${({ theme }) => theme.breakpoints.down("md")} {
    justify-content: center;
  }
`;

const Contact = styled.p`
  height: 35px;
  font-size: 12px;
  margin: 0;
  margin-right: 20px;
  font-weight: 400;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  text-align: center;
  justify-content: center;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const Social = styled.p`
  color: ${({ theme }) => theme.palette.text.secondary};
  background-color: "transparent";
  font-size: 14px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: 0;
  padding: 0 10px;
  height: 35px;
  transition: all 0.5s ease;
  cursor: pointer;

  svg {
    font-size: 18px;
  }

  &:hover {
    background-color: #${({ color }) => color};
    color: white;
  }
`;

const Logo = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  margin: 5px 10px 5px 15px;
  white-space: nowrap;
  overflow: hidden;

  &.hidden {
    ${({ theme }) => theme.breakpoints.down("md")} {
      width: 0;
    }
  }

  ${({ theme }) => theme.breakpoints.down("md_lg")} {
    margin: 5px 0px 5px 0px;
  }
`;

const NavItem = styled.div`
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  margin-left: 15px;
`;

const StyledIconButton = styled(IconButton)`
  border-radius: 0;

  &:hover {
    background-color: transparent;
    color: ${({ theme }) => theme.palette.primary.main};
  }

  &.nav {
    display: flex;
    justify-content: flex-start;

    ${({ theme }) => theme.breakpoints.down("md_lg")} {
      justify-content: center;
      flex-direction: column;
      width: 70px;
      transform: translateY(-5px);
    }
  }
`;

const StyledAppBar = styled(AppBar)`
  --scroll-progress: 1;

  position: sticky;
  top: -0.5px;
  margin-bottom: 2px;
  border-bottom: 0.5px solid;
  border-color: ${({ theme }) => theme.palette.action.focus};
  background-color: ${({ theme }) => theme.palette.background.paper};
  box-shadow: none;

  svg {
    font-size: 26px;
  }

  ${({ theme }) => theme.breakpoints.down("md")} {
    margin-bottom: 0;
    border-color: ${({ theme }) =>
      `rgb(from ${theme.palette.action.focus} r g b / calc(var(--scroll-progress) * ${theme.palette.action.focusOpacity}))`};
    background-color: ${({ theme }) =>
      `rgb(from ${theme.palette.background.paper} r g b / var(--scroll-progress))`};
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    ${Logo} {
      filter: ${({ theme }) =>
        `drop-shadow(0px -1000px 0 rgb(from ${theme.palette.grey[800]} r g b / calc(1 - var(--scroll-progress))))`};
      transform: translateY(calc((1 - round(var(--scroll-progress))) * 1000px));

      ${({ theme }) =>
        theme.palette.mode === "dark" &&
        ` filter: drop-shadow(0px -1000px 0 rgb(from ${theme.palette.text.primary} r g b / calc(1 - var(--scroll-progress))))`}
    }

    ${StyledIconButton} {
      border-radius: 50%;
      background-color: ${({ theme }) =>
        alpha(
          theme.palette.background.paper,
          theme.palette.action.activatedOpacity
        )};

      svg {
        font-size: 22px;
      }
    }
  }
`;

const IconText = styled.p`
  font-size: 13px;
  margin: 0;
  margin-left: 5px;
  white-space: nowrap;
  text-overflow: ellipsis;

  ${({ theme }) => theme.breakpoints.down("md_lg")} {
    height: 0;
  }
`;
//#endregion

const SearchComponent = ({
  tabletMode,
  show,
  toggle,
  setToggle,
  isSearch,
  isShop,
  products,
}) => {
  const mobileMode = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const toggleSearch = () => {
    setToggle(!show);
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      flex={1}
      flexDirection={{ xs: "row-reverse", md: "row" }}
    >
      {tabletMode && isSearch ? (
        <Link to={"/"} title="Trang chủ">
          <StyledIconButton aria-label="home">
            <HomeOutlined />
          </StyledIconButton>
        </Link>
      ) : (
        <Link to={"/store"} title="Duyệt cửa hàng">
          <StyledIconButton aria-label="explore">
            <Storefront />
          </StyledIconButton>
        </Link>
      )}
      <Box
        display="flex"
        alignItems="center"
        justifyContent={{ xs: "flex-end", md: "flex-start" }}
        flex={1}
      >
        <SearchInput
          {...{
            mobileMode,
            tabletMode,
            show,
            isFocus: toggle,
            isShop,
          }}
        />
        {tabletMode && isSearch ? (
          <Link to={"/cart"} title="Giỏ hàng">
            <StyledIconButton aria-label="cart">
              <Badge
                color="primary"
                badgeContent={products?.length}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <ShoppingCartOutlined />
              </Badge>
            </StyledIconButton>
          </Link>
        ) : (
          <StyledIconButton
            aria-label="search toggle"
            onClick={toggleSearch}
            sx={{ mr: { xs: 0.3, md: 0 } }}
          >
            {show ? <SearchOff /> : <Search />}
          </StyledIconButton>
        )}
      </Box>
    </Box>
  );
};

const PopoverComponents = ({
  mode,
  toggleMode,
  cartProducts,
  username,
  image,
  signOut,
  location,
}) => {
  //Anchor for popoever & open state
  const [anchorElCart, setAnchorElCart] = useState(undefined);
  const [anchorEl, setAnchorEl] = useState(undefined);
  const openCart = Boolean(anchorElCart);
  const open = Boolean(anchorEl);

  const hanldeCartPopover = (e) => {
    handleCartClose.cancel();
    setAnchorElCart(e.currentTarget);
  };
  const handleCartClose = useCallback(
    debounce(() => {
      setAnchorElCart(null);
    }, 500),
    [anchorElCart]
  );
  const handleProfilePopover = (e) => {
    handleProfileClose.cancel();
    setAnchorEl(e.currentTarget);
  };
  const handleProfileClose = useCallback(
    debounce(() => {
      setAnchorEl(null);
    }, 500),
    [anchorEl]
  );

  return (
    <Grid
      size={{ xs: 12, md: "auto" }}
      sx={{
        display: { xs: "none", md: "flex" },
        alignItems: "center",
        justifyContent: { xs: "space-evenly", md: "flex-end" },
      }}
    >
      <NavItem>
        <Stack
          direction="row"
          sx={{ color: "action.active" }}
          alignItems="center"
        >
          <StyledIconButton className="nav" aria-label="notification">
            <Badge
              badgeContent={0}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <NotificationsOutlined />
            </Badge>
            <IconText>Thông báo</IconText>
          </StyledIconButton>
          <Box
            aria-owns={openCart ? "mouse-over-popover-cart" : undefined}
            aria-haspopup="true"
            onMouseEnter={hanldeCartPopover}
            onMouseLeave={handleCartClose}
          >
            <Link to={"/cart"} title="Giỏ hàng">
              <StyledIconButton className="nav" aria-label="cart">
                <Badge
                  color="primary"
                  badgeContent={cartProducts?.length}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <ShoppingCartOutlined />
                </Badge>
                <IconText>Giỏ hàng</IconText>
              </StyledIconButton>
            </Link>
            {anchorElCart !== undefined && (
              <Suspense fallback={null}>
                <MiniCart
                  {...{
                    openCart,
                    anchorElCart,
                    handleClose: handleCartClose,
                    products: cartProducts,
                  }}
                />
              </Suspense>
            )}
          </Box>
          {username ? (
            <Box
              aria-owns={open ? "mouse-over-popover-profile" : undefined}
              aria-haspopup="true"
              onMouseEnter={handleProfilePopover}
              onMouseLeave={handleProfileClose}
            >
              <Link to={"/profile/detail"} title="Tài khoản">
                <StyledIconButton className="nav" aria-label="profile">
                  <Avatar
                    sx={{ width: 24, height: 24, fontSize: "16px" }}
                    src={image ?? null}
                  />
                  <IconText className="username">{username}</IconText>
                </StyledIconButton>
              </Link>
              {anchorEl !== undefined && (
                <Suspense fallback={null}>
                  <ProfilePopover
                    {...{
                      open,
                      anchorEl,
                      handleClose: handleProfileClose,
                      signOut,
                      mode,
                      toggleMode,
                      image,
                    }}
                  />
                </Suspense>
              )}
            </Box>
          ) : (
            <Link
              to={"/auth/login"}
              state={{ from: location }}
              title="Đăng nhập"
            >
              <StyledIconButton className="nav" aria-label="login">
                <LockOutlined />
                <IconText className="username">Đăng nhập</IconText>
              </StyledIconButton>
            </Link>
          )}
        </Stack>
      </NavItem>
    </Grid>
  );
};

const Navbar = () => {
  //#region construct
  const { cartProducts } = useCart();
  const location = useLocation();
  const isHome = useMatch("/");
  const isStore = useMatch("/store");
  const isShop = useMatch("/shop");
  const isSearch = isStore || isShop;
  const tabletMode = useMediaQuery((theme) => theme.breakpoints.down("md"));

  //Search
  const [toggle, setToggle] = useState(undefined);
  const show = (isSearch && toggle == undefined) || toggle;

  //Drawer open state
  const [openDrawer, setOpenDrawer] = useState(undefined);

  //Other
  const { username, image } = useAuth();
  const signOut = useLogout();

  //Toggle drawer open state
  const handleToggleDrawer = (value) => {
    setOpenDrawer(value);
  };

  //Toggle color mode
  const { mode, setMode } = useColorScheme();
  const toggleMode = () => {
    if (!mode) {
      return;
    } else if (mode === "system") {
      setMode("light");
    } else if (mode === "light") {
      setMode("dark");
    } else if (mode === "dark") {
      setMode("system");
    }
  };

  //Transparent trigger
  const opacityRef = useRef(0);
  const navRef = useRef(null);

  const handleWindowScroll = (e) => {
    let body = document.body; //IE 'quirks'
    let element = document.documentElement; //IE with doctype
    element = element.clientHeight ? element : body;

    let opacity = element.scrollTop / 300;

    if (opacity < 1) {
      opacityRef.current = opacity;
    } else {
      opacityRef.current = 1;
    }

    handleChangeStyles();
  };

  const handleChangeStyles = () => {
    if (navRef.current) {
      navRef.current.style.setProperty("--scroll-progress", opacityRef.current);
    }
  };

  const handleResetStyles = () => {
    if (navRef.current) {
      navRef.current.style.setProperty("--scroll-progress", "1");
    }
  };

  const handleResetOpacity = () => {
    if (navRef.current) {
      navRef.current.style.setProperty("--scroll-progress", "0");
    }
  };

  const windowScrollListener = useCallback(handleWindowScroll, []);

  useEffect(() => {
    if (tabletMode) {
      window.addEventListener("scroll", windowScrollListener);
      handleResetOpacity();
    } else {
      window.removeEventListener("scroll", windowScrollListener);
      handleResetStyles();
    }
    return () => {
      window.removeEventListener("scroll", windowScrollListener);
      handleResetStyles();
    };
  }, [tabletMode]);

  useEffect(() => {
    if (tabletMode) {
      handleResetOpacity();
      setToggle(undefined);
    }
  }, [location.pathname]);

  //Check for go back button
  const canGoBack = location.key !== "default";
  const href = canGoBack ? -1 : "/";
  //#endregion

  return (
    <>
      <TopHeader>
        <Grid container size="grow">
          <Grid size={{ xs: 12, md: 6 }}>
            <ContactContainer>
              <Contact>
                <Phone sx={{ fontSize: 18, marginRight: 1 }} />
                +8419130248
              </Contact>
              <Contact>
                <Mail sx={{ fontSize: 18, marginRight: 1 }} />
                haductrong01629@gmail.com
              </Contact>
            </ContactContainer>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SocialContainer>
              <Social color="3B5999">
                <Facebook />
              </Social>
              <Social color="FF0000">
                <YouTube />
              </Social>
              <Social color="0A66C2">
                <LinkedIn />
              </Social>
              <Social color="55ACEE">
                <Twitter />
              </Social>
            </SocialContainer>
          </Grid>
        </Grid>
      </TopHeader>
      <StyledAppBar elevation={0} ref={navRef} enableColorOnDark>
        <Wrapper>
          <Grid container size="grow">
            <Grid
              size={{ xs: 12, md: "grow" }}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: { xs: "space-between", md: "flex-start" },
              }}
            >
              {tabletMode && (
                <Box display="flex" alignItems="center" flex={show ? 0 : 1}>
                  {isHome ? (
                    <StyledIconButton onClick={() => handleToggleDrawer(true)}>
                      <Menu />
                    </StyledIconButton>
                  ) : (
                    <Link to={href} title="Quay lại">
                      <StyledIconButton>
                        <KeyboardArrowLeft />
                      </StyledIconButton>
                    </Link>
                  )}
                  <Suspense fallback={null}>
                    <NavDrawer
                      {...{
                        openDrawer,
                        username,
                        image,
                        location,
                        products: cartProducts,
                        signOut,
                        mode,
                        toggleMode,
                        handleOpen: () => handleToggleDrawer(true),
                        handleClose: () => handleToggleDrawer(false),
                      }}
                    />
                  </Suspense>
                </Box>
              )}
              <Link to={"/"} title="Trang chủ">
                <Logo className={show ? "hidden" : ""}>
                  <LogoImage src="/full-logo.svg" alt="RING! logo" />
                </Logo>
              </Link>
              <SearchComponent
                {...{
                  tabletMode,
                  show,
                  toggle,
                  setToggle,
                  isSearch,
                  isShop,
                  products: cartProducts,
                }}
              />
            </Grid>
            {!tabletMode && (
              <PopoverComponents
                {...{
                  mode,
                  toggleMode,
                  cartProducts,
                  username,
                  image,
                  signOut,
                  location,
                }}
              />
            )}
          </Grid>
        </Wrapper>
      </StyledAppBar>
    </>
  );
};

export default Navbar;
