import styled from "@emotion/styled";
import {
  ShoppingCartOutlined,
  DeliveryDiningOutlined,
  LockOutlined,
  Logout,
  NotificationsOutlined,
  Storefront,
  KeyboardArrowLeft,
  NightlightOutlined,
  LightModeOutlined,
  ContrastOutlined,
} from "@mui/icons-material";
import {
  Avatar,
  ListItemIcon,
  Divider,
  Box,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
} from "@mui/material";
import { Link } from "react-router";
import { LogoImage } from "@ring/ui/Components";

//#region styled
const DrawerLogo = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
  width: 100%;
`;

const DrawerContainer = styled(Box)`
  padding-left: ${({ theme }) => theme.spacing(1.5)};
  padding-right: ${({ theme }) => theme.spacing(1.5)};
  width: auto;

  @media (min-width: 450px) {
    width: 400px;
  }
`;
//#endregion

const NavDrawer = ({
  location,
  openDrawer,
  handleOpen,
  handleClose,
  username,
  image,
  products,
  signOut,
  mode,
  toggleMode,
}) => {
  return (
    <SwipeableDrawer
      anchor="left"
      open={openDrawer}
      onOpen={handleOpen}
      onClose={handleClose}
      disableBackdropTransition
      disableDiscovery
      swipeAreaWidth={8}
      disableSwipeToOpen={false}
    >
      <DrawerContainer>
        <Box
          sx={{
            marginY: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link to={"/"} onClick={handleClose}>
            <DrawerLogo>
              <LogoImage
                src="/full-logo.svg"
                className="logo"
                alt="RING! logo"
              />
            </DrawerLogo>
          </Link>
          <IconButton onClick={handleClose}>
            <KeyboardArrowLeft sx={{ fontSize: 26 }} />
          </IconButton>
        </Box>
        <Divider />
        <List>
          <Link to={"/store"}>
            <ListItem disablePadding onClick={handleClose}>
              <ListItemButton>
                <ListItemIcon>
                  <Storefront />
                </ListItemIcon>
                <ListItemText primary="Cửa hàng" />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>
        <Divider />
        <List>
          <ListItem disablePadding onClick={handleClose}>
            <ListItemButton>
              <ListItemIcon>
                <NotificationsOutlined />
              </ListItemIcon>
              <ListItemText primary="Thông báo" />
            </ListItemButton>
          </ListItem>
          <Link to={"/cart"}>
            <ListItem disablePadding onClick={handleClose}>
              <ListItemButton>
                <ListItemIcon>
                  <ShoppingCartOutlined />
                </ListItemIcon>
                <ListItemText
                  primary={`Giỏ hàng (${products?.length} sản phẩm)`}
                />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>
        <Divider />
        {username ? (
          <Box>
            <List>
              <ListItem disablePadding>
                <Link to={"/profile/detail"}>
                  <ListItemButton onClick={handleClose}>
                    <ListItemIcon>
                      <Avatar
                        sx={{ width: 32, height: 32, ml: -0.5 }}
                        src={image ? image + "?size=tiny" : null}
                      />
                    </ListItemIcon>
                    <ListItemText primary={username} />
                  </ListItemButton>
                </Link>
              </ListItem>

              <ListItem disablePadding>
                <Link to={"/profile/order"}>
                  <ListItemButton onClick={handleClose}>
                    <ListItemIcon>
                      <DeliveryDiningOutlined />
                    </ListItemIcon>
                    <ListItemText primary="Đơn giao" />
                  </ListItemButton>
                </Link>
              </ListItem>
            </List>
            <Divider />
            <List>
              {mode && (
                <ListItem disablePadding>
                  <ListItemButton onClick={toggleMode}>
                    <ListItemIcon>
                      {mode === "dark" ? (
                        <NightlightOutlined fontSize="small" />
                      ) : mode === "light" ? (
                        <LightModeOutlined fontSize="small" />
                      ) : mode === "system" ? (
                        <ContrastOutlined fontSize="small" />
                      ) : (
                        ""
                      )}{" "}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        mode === "dark"
                          ? "Chủ đề tối"
                          : mode === "light"
                            ? "Chủ đề mặc định"
                            : mode === "system"
                              ? "Theo hệ thống"
                              : ""
                      }
                    />
                  </ListItemButton>
                </ListItem>
              )}
              <ListItem disablePadding>
                <ListItemButton onClick={() => signOut()}>
                  <ListItemIcon>
                    <Logout />
                  </ListItemIcon>
                  <ListItemText primary="Đăng xuất" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        ) : (
          <List>
            <Link
              to={"/auth/login"}
              state={{ from: location }}
              title="Đăng nhập"
            >
              <ListItem disablePadding onClick={handleClose}>
                <ListItemButton>
                  <ListItemIcon>
                    <LockOutlined />
                  </ListItemIcon>
                  <ListItemText primary="Đăng nhập" />
                </ListItemButton>
              </ListItem>
            </Link>
          </List>
        )}
      </DrawerContainer>
    </SwipeableDrawer>
  );
};

export default NavDrawer;
