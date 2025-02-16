import styled from "@emotion/styled";
import {
  AccountBoxOutlined,
  ContrastOutlined,
  HomeOutlined,
  LightModeOutlined,
  NightlightOutlined,
} from "@mui/icons-material";
import {
  ListItemText,
  Avatar,
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Typography,
  ButtonGroup,
  Button,
  ListSubheader,
  useColorScheme,
} from "@mui/material";
import { useLogout } from "@ring/auth";
import { Link } from "react-router";

//#region preStyled
const StyledMobileDrawer = styled(Drawer)(({ theme }) => ({}));

const DrawerContainer = styled(Box)`
  width: 320px;
`;
//#endregion

const NavSetting = ({ open, setOpen, image, username }) => {
  const { mode, setMode } = useColorScheme();
  const signOut = useLogout();
  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <StyledMobileDrawer
      variant="temporary"
      anchor="right"
      open={open}
      onClose={handleDrawerClose}
      ModalProps={{ keepMounted: true }}
      slotProps={{ backdrop: { invisible: true } }}
    >
      <DrawerContainer>
        <Box
          mt={3}
          padding={3}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Avatar
            alt={username}
            sx={{ width: 85, height: 85 }}
            src={image ? image + "?size=small" : null}
          />
          <Typography variant="h6" sx={{ mt: 2 }}>
            {username}
          </Typography>
        </Box>
        <Divider />
        <List sx={{ m: 1.5 }}>
          <Link to={"/"}>
            <ListItem disablePadding onClick={handleDrawerClose}>
              <ListItemButton>
                <ListItemIcon>
                  <HomeOutlined />
                </ListItemIcon>
                <ListItemText primary="Trang chủ" />
              </ListItemButton>
            </ListItem>
          </Link>
          <Link to={"/profile"}>
            <ListItem disablePadding onClick={handleDrawerClose}>
              <ListItemButton>
                <ListItemIcon>
                  <AccountBoxOutlined />
                </ListItemIcon>
                <ListItemText primary="Hồ sơ" />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>
        <Divider />
        <List
          sx={{ m: 1.5 }}
          subheader={
            <ListSubheader
              sx={{ backgroundColor: "transparent" }}
              id="management-list-subheader"
            >
              MÀU NỀN
            </ListSubheader>
          }
        >
          <ListItem disablePadding>
            <ButtonGroup
              fullWidth
              variant="outlined"
              color="success"
              aria-label="Theme button group"
            >
              <Button
                variant={mode === "light" ? "contained" : "outlined"}
                startIcon={<LightModeOutlined />}
                onClick={() => setMode("light")}
              >
                Sáng
              </Button>
              <Button
                variant={mode === "system" ? "contained" : "outlined"}
                startIcon={<ContrastOutlined />}
                onClick={() => setMode("system")}
                sx={{ whiteSpace: "nowrap", padding: 2 }}
              >
                Hệ thống
              </Button>
              <Button
                variant={mode === "dark" ? "contained" : "outlined"}
                startIcon={<NightlightOutlined />}
                onClick={() => setMode("dark")}
              >
                Tối
              </Button>
            </ButtonGroup>
          </ListItem>
        </List>
        <Box
          position="absolute"
          bottom={0}
          padding={2}
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Button
            variant="outlined"
            color="error"
            fullWidth
            size="large"
            onClick={() => signOut()}
          >
            Đăng xuất
          </Button>
        </Box>
      </DrawerContainer>
    </StyledMobileDrawer>
  );
};

export default NavSetting;
