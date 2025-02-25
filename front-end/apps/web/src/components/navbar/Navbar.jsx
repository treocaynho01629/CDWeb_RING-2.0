import { lazy, Suspense, useCallback, useState } from "react";
import {
  Search,
  Mail,
  Phone,
  Facebook,
  YouTube,
  LinkedIn,
  Twitter,
  Menu,
  LockOutlined,
  Storefront,
  Close,
  ShoppingCartOutlined,
  NotificationsOutlined,
} from "@mui/icons-material";
import {
  Stack,
  Badge,
  IconButton,
  Avatar,
  Box,
  Grid2 as Grid,
  TextField,
  AppBar,
  useMediaQuery,
  useTheme,
  useScrollTrigger,
  useColorScheme,
} from "@mui/material";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { LogoImage } from "@ring/ui/Components";
import { debounce } from "lodash-es";
import { useLogout, useAuth } from "@ring/auth";
import useCart from "../../hooks/useCart";
import styled from "@emotion/styled";

const NavDrawer = lazy(() => import("./NavDrawer"));
const MiniCart = lazy(() => import("./MiniCart"));
const ProfilePopover = lazy(() => import("./ProfilePopover"));

//#region styled
const Wrapper = styled.div`
  padding: 5px 10px;

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

  &:hover {
    background-color: #${({ color }) => color};
    color: white;
  }
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  ${({ theme }) => theme.breakpoints.down("md")} {
    justify-content: space-between;
  }
`;

const Right = styled.div`
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  display: flex;

  ${({ theme }) => theme.breakpoints.down("md")} {
    justify-content: space-evenly;
    display: none;
  }
`;

const Logo = styled.h2`
  position: relative;
  display: flex;
  align-items: center;
  margin: 5px 10px 5px 15px;
  white-space: nowrap;
  overflow: hidden;
  transition: width 0.25s ease;

  &.active {
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

const StyledAppBar = styled(AppBar)`
  position: sticky;
  top: -0.5px;
  margin-bottom: 2px;
  background-color: ${({ theme }) => theme.palette.background.paper};
  border-bottom: 0.5px solid ${({ theme }) => theme.palette.divider};
  box-shadow: none;
  transition: all 0.15s ease;

  &.top {
    background-color: transparent;
    border-color: transparent;

    ${Logo} {
      filter: drop-shadow(
        0px -1000px 0 ${({ theme }) => theme.palette.text.primary}
      );
      transform: translateY(1000px);
    }
  }

  ${({ theme }) => theme.breakpoints.down("md")} {
    margin-bottom: 0;
  }
`;

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: 0,

  "&:hover": {
    backgroundColor: "transparent",
    color: theme.palette.primary.main,
  },

  "&.nav": {
    display: "flex",
    width: "90px",
    justifyContent: "flex-start",

    [theme.breakpoints.down("md_lg")]: {
      justifyContent: "center",
      flexDirection: "column",
      width: "70px",
      transform: "translateY(-5px)",
    },
  },
}));

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

const StyledSearchForm = styled.form`
  width: 100%;
  display: flex;
  align-items: center;

  ${({ theme }) => theme.breakpoints.down("md")} {
    flex-direction: row-reverse;
  }
`;

const StyledSearchInput = styled(TextField)(({ theme }) => ({
  color: "inherit",
  background: theme.palette.background.paper,

  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
  "& .MuiInputBase-input": {
    background: theme.palette.background.paper,
    transition: theme.transitions.create("width"),
    width: "100%",

    [theme.breakpoints.up("md")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));
//#endregion

const Navbar = () => {
  //#region construct
  const { cartProducts } = useCart();
  const { mode, setMode } = useColorScheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const theme = useTheme();
  const tabletMode = useMediaQuery(theme.breakpoints.down("md"));

  //Transparent trigger
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 20,
  });

  //Drawer open state
  const [openDrawer, setOpenDrawer] = useState(undefined);

  //Search field expand
  const [searchField, setSearchField] = useState("");
  const [focus, setFocus] = useState(false);
  const [toggle, setToggle] = useState(searchField !== "");

  //Other
  const { username, image } = useAuth();
  const navigate = useNavigate();
  const signOut = useLogout();

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

  //Toggle drawer open state
  const handleToggleDrawer = (value) => {
    setOpenDrawer(value);
  };
  const toggleSearch = () => {
    setToggle((prev) => !prev);
  };

  //Toggle color mode
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

  //Confirm search
  const handleNavigateStore = (e, value) => {
    e.preventDefault();
    let { pathname } = location;
    let search;
    if (!pathname.startsWith("/store")) {
      pathname = "/store";
      search = value != "" ? `?q=${value}` : "";
    } else {
      value != "" ? searchParams.set("q", value) : searchParams.delete("q");
      search = searchParams.toString();
    }
    navigate({ pathname, search });
  };
  //#endregion

  const isToggleSearch = focus || toggle;

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
                <Facebook sx={{ fontSize: 18 }} />
              </Social>
              <Social color="FF0000">
                <YouTube sx={{ fontSize: 18 }} />
              </Social>
              <Social color="0A66C2">
                <LinkedIn sx={{ fontSize: 18 }} />
              </Social>
              <Social color="55ACEE">
                <Twitter sx={{ fontSize: 18 }} />
              </Social>
            </SocialContainer>
          </Grid>
        </Grid>
      </TopHeader>
      <StyledAppBar
        className={!tabletMode || trigger ? "" : "top"}
        elevation={0}
      >
        <Wrapper>
          <Grid container size="grow">
            <Grid
              size={{ xs: 12, md: "grow" }}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Left>
                {tabletMode && (
                  <>
                    <Box
                      display={isToggleSearch ? "none" : "flex"}
                      flex={1}
                      alignItems="center"
                    >
                      <IconButton onClick={() => handleToggleDrawer(true)}>
                        <Menu sx={{ fontSize: 26 }} />
                      </IconButton>
                    </Box>
                    <Suspense fallback={<></>}>
                      <NavDrawer
                        {...{
                          openDrawer,
                          username,
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
                  </>
                )}
                <Link to={`/`}>
                  <Logo className={isToggleSearch ? "active" : ""}>
                    <LogoImage src="/full-logo.svg" alt="RING! logo" />
                  </Logo>
                </Link>
                <Box
                  display="flex"
                  alignItems="center"
                  flex={1}
                  justifyContent={
                    isToggleSearch
                      ? { xs: "space-between", md: "flex-start" }
                      : "flex-start"
                  }
                  flexDirection={{ xs: "row-reverse", md: "row" }}
                >
                  <Link
                    onClick={(e) => handleNavigateStore(e, "")}
                    title="Duyệt cửa hàng"
                  >
                    <StyledIconButton aria-label="explore">
                      <Storefront sx={{ fontSize: "26px" }} />
                    </StyledIconButton>
                  </Link>
                  <StyledSearchForm
                    onSubmit={(e) => handleNavigateStore(e, searchField)}
                  >
                    {isToggleSearch && (
                      <StyledSearchInput
                        placeholder="Tìm kiếm... "
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
                            startAdornment: <Search sx={{ marginRight: 1 }} />,
                          },
                        }}
                      />
                    )}
                    <StyledIconButton
                      aria-label="search toggle"
                      onClick={() => toggleSearch()}
                    >
                      {isToggleSearch ? (
                        <Close sx={{ fontSize: "26px" }} />
                      ) : (
                        <Search sx={{ fontSize: "26px" }} />
                      )}
                    </StyledIconButton>
                  </StyledSearchForm>
                </Box>
              </Left>
            </Grid>
            {!tabletMode && (
              <Grid
                size={{ xs: 12, md: "auto" }}
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                <Right>
                  <NavItem>
                    <Stack
                      spacing={1}
                      direction="row"
                      sx={{ color: "action.active" }}
                      alignItems="center"
                    >
                      <StyledIconButton
                        className="nav"
                        aria-label="notification"
                      >
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
                        aria-owns={
                          openCart ? "mouse-over-popover-cart" : undefined
                        }
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
                        <Suspense fallback={null}>
                          {anchorElCart !== undefined && (
                            <MiniCart
                              {...{
                                openCart,
                                anchorElCart,
                                handleClose: handleCartClose,
                                products: cartProducts,
                              }}
                            />
                          )}
                        </Suspense>
                      </Box>
                      {username ? (
                        <Box
                          aria-owns={
                            open ? "mouse-over-popover-profile" : undefined
                          }
                          aria-haspopup="true"
                          onMouseEnter={handleProfilePopover}
                          onMouseLeave={handleProfileClose}
                        >
                          <Link to={"/profile/detail"} title="Tài khoản">
                            <StyledIconButton
                              className="nav"
                              aria-label="profile"
                            >
                              <Avatar
                                sx={{ width: 24, height: 24, fontSize: "16px" }}
                                src={image ? image + "?size=tiny" : null}
                              />
                              <IconText className="username">
                                {username}
                              </IconText>
                            </StyledIconButton>
                          </Link>
                          <Suspense fallback={null}>
                            {anchorEl !== undefined && (
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
                            )}
                          </Suspense>
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
                </Right>
              </Grid>
            )}
          </Grid>
        </Wrapper>
      </StyledAppBar>
    </>
  );
};

export default Navbar;
