import {
  NightlightOutlined,
  LightModeOutlined,
  DeliveryDiningOutlined,
  LockOutlined,
  ContrastOutlined,
} from "@mui/icons-material";
import {
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Paper,
} from "@mui/material";
import { Link } from "react-router";

const ProfilePopover = ({
  open,
  image,
  anchorEl,
  handleClose,
  signOut,
  mode,
  toggleMode,
}) => {
  return (
    <Menu
      id="mouse-over-popover-profile"
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      onClick={handleClose}
      disableRestoreFocus
      disableScrollLock
      closeAfterTransition
      transitionDuration={150}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      sx={{ pointerEvents: "none" }}
      slotProps={{
        paper: {
          elevation: 2,
          sx: {
            overflow: "visible",
            mt: 1.5,
            borderRadius: 0,
            pointerEvents: "auto",
          },
          onMouseLeave: handleClose,
        },
      }}
    >
      <Paper
        elevation={2}
        sx={{
          display: "block",
          position: "absolute",
          top: 0,
          right: 14,
          width: 10,
          height: 10,
          bgcolor: "background.paper",
          transform: "translateY(-50%) rotate(45deg)",
          boxShadow: "none",
          zIndex: 0,
        }}
      />
      <Link to={"/profile/detail"}>
        <MenuItem>
          <Avatar
            sx={{ width: 30, height: 30, ml: -0.5, mr: 1 }}
            src={image ?? null}
          />
          Thông tin tài khoản
        </MenuItem>
      </Link>
      <Link to={"/profile/order"}>
        <MenuItem>
          <ListItemIcon>
            <DeliveryDiningOutlined fontSize="small" />
          </ListItemIcon>
          Đơn giao
        </MenuItem>
      </Link>
      <Divider />
      {mode && (
        <MenuItem
          aria-label="toggle-mode"
          onClick={(e) => {
            e.stopPropagation();
            toggleMode();
          }}
        >
          <ListItemIcon>
            {mode === "dark" ? (
              <NightlightOutlined fontSize="small" />
            ) : mode === "light" ? (
              <LightModeOutlined fontSize="small" />
            ) : mode === "system" ? (
              <ContrastOutlined fontSize="small" />
            ) : (
              ""
            )}
          </ListItemIcon>
          {mode === "dark"
            ? "Chủ đề tối"
            : mode === "light"
              ? "Chủ đề mặc định"
              : mode === "system"
                ? "Theo hệ thống"
                : ""}
        </MenuItem>
      )}
      <MenuItem onClick={() => signOut()}>
        <ListItemIcon>
          <LockOutlined fontSize="small" />
        </ListItemIcon>
        Đăng xuất
      </MenuItem>
    </Menu>
  );
};

export default ProfilePopover;
