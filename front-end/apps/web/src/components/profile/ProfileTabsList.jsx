import styled from "@emotion/styled";
import { useState } from "react";
import {
  List,
  Collapse,
  Avatar,
  ListItemButton,
  Badge,
  Divider,
  alpha,
  Skeleton,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  EditOutlined,
  Person as PersonIcon,
  RateReviewOutlined,
  KeyboardArrowRight,
  PersonAddAlt1,
  LocalShippingOutlined,
  Replay,
  DomainVerification,
  PendingOutlined,
  ReceiptLongOutlined,
  LocalActivityOutlined,
  LocalActivity,
  Today,
} from "@mui/icons-material";
import { NavLink } from "react-router";
import { MobileExtendButton } from "@ring/ui/Components";
import { useAuth } from "@ring/auth";
import { numFormat, orderTypes, roleTypes } from "@ring/shared";

//#region styled
const ListContainer = styled.div`
  position: relative;
  width: 100%;

  ${({ theme }) => theme.breakpoints.down("md")} {
    padding: 10px 12px;
  }
`;

const ProfileContainer = styled.div`
  position: relative;
  padding: 15px 10px;

  ${({ theme }) => theme.breakpoints.down("md")} {
    padding: 10px 2px;
    padding-top: 0;
  }
`;

const MainProfile = styled.div`
  display: flex;
  width: 100%;

  ${({ theme }) => theme.breakpoints.down("md")} {
    margin-bottom: ${({ theme }) => theme.spacing(1.5)};
  }
`;

const InfoContainer = styled.div`
  margin-left: ${({ theme }) => theme.spacing(1)};
  overflow: hidden;
  width: 100%;
`;

const StyledAvatar = styled(Avatar)`
  width: 45px;
  height: 45px;

  ${({ theme }) => theme.breakpoints.down("md")} {
    width: 55px;
    height: 55px;
  }
`;

const UserContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
`;

const Username = styled.span`
  font-size: 16px;
  font-weight: 500;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const Name = styled.p`
  margin-top: -4px;
  margin-bottom: -2px;
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.palette.text.secondary};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const Role = styled.span`
  font-weight: 450;
  padding: 2px 6px;
  margin-left: ${({ theme }) => theme.spacing(1)};
  font-size: 12px;
  border-radius: 15px;
  white-space: nowrap;
  border: 1px solid;
  border-color: ${({ theme, color }) => theme.palette[color]?.main};
  color: ${({ theme, color }) => theme.palette[color]?.main};
`;

const EditButton = styled.span`
  max-width: 100px;
  align-items: center;
  font-weight: 500;
  display: none;
  padding: 4px;
  border-radius: 50%;
  aspect-ratio: 1/1;
  font-size: 13px;
  justify-content: flex-end;
  color: ${({ theme }) => theme.palette.common.black};
  background-color: ${({ theme }) => theme.palette.grey[300]};
  border: 2px solid ${({ theme }) => theme.palette.background.default};
  cursor: pointer;

  svg {
    font-size: 16px;
    margin-right: 0;
  }

  &:hover {
    color: ${({ theme }) => theme.palette.primary.main};
    background-color: ${({ theme }) => theme.palette.grey[200]};
    transition: 0.25s ease;
  }

  ${({ theme }) => theme.breakpoints.down("md")} {
    display: flex;
  }
`;

const ItemText = styled.h3`
  position: relative;
  width: 100%;
  font-size: 16px;
  margin: 5px 0px;
  color: inherit;
  display: flex;
  align-items: center;
  white-space: nowrap;
`;

const StyledListItemButton = styled(ListItemButton)`
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.spacing(0.5)} ${theme.spacing(2)}`};

  &.secondary {
    padding: 0;
    padding-left: 48px;
    color: ${({ theme }) => theme.palette.text.secondary};
  }

  &:hover {
    color: ${({ theme }) => theme.palette.primary.main};
    background-color: ${({ theme }) => theme.palette.background.default};
  }

  &.Mui-selected {
    color: ${({ theme }) => theme.palette.primary.light};
    background-color: transparent;
    text-decoration: underline;

    &:hover {
      background-color: ${({ theme }) => theme.palette.action.hover};
    }
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: ${({ theme }) => theme.spacing(0.5)} 0;

    ${ItemText} {
      font-size: 14px;
    }
  }
`;

const AdditionalInfo = styled.div`
  width: 100%;
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const Additional = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  font-size: 14px;

  svg {
    font-size: 15px;
    margin-right: 3px;
  }

  b {
    margin-left: 5px;
    color: ${({ theme }) => theme.palette.warning.main};
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 12px;
  }
`;

const NavWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
`;

const NavItem = styled(NavLink)`
  width: 25%;
  padding: 4px 0;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.25s ease;

  p {
    margin: 5px 0;
    font-size: 12px;
    text-align: center;
  }

  svg {
    padding: 5px;
    border-radius: 5px;
    font-size: 2.6rem;
    color: ${({ theme }) => theme.palette.primary.dark};
    background-color: ${({ theme }) => alpha(theme.palette.primary.light, 0.3)};
  }
`;
//#endregion

const items = [
  {
    label: "Đang xử lý",
    icon: <PendingOutlined />,
    url: `/profile/order?status=${orderTypes.PENDING.value}`,
  },
  {
    label: "Đang vận chuyển",
    icon: <LocalShippingOutlined />,
    url: `/profile/order?status=${orderTypes.SHIPPING.value}`,
  },
  {
    label: "Đã giao",
    icon: <DomainVerification />,
    url: `/profile/order?status=${orderTypes.COMPLETED.value}`,
  },
  {
    label: "Đổi trả",
    icon: <Replay />,
    url: `/profile/order?status=${orderTypes.REFUNDED.value}`,
  },
];

const ProfileTabsList = ({ profile, loading, tabletMode }) => {
  const { username, image, roles } = useAuth();
  const [open, setOpen] = useState(true);
  const currRole = roleTypes[roles?.find((role) => role.startsWith("ROLE_"))];

  const toggleOpen = (e) => {
    e.preventDefault();
    setOpen((prevState) => !prevState);
  };

  return (
    <ListContainer>
      <ProfileContainer>
        <NavLink to={"/profile/detail/info"}>
          <MainProfile>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                <EditButton className="badge">
                  <EditOutlined />
                </EditButton>
              }
            >
              <StyledAvatar src={image ? image + "?size=tiny" : null} />
            </Badge>
            <InfoContainer>
              <UserContainer>
                <Username>
                  {username}
                  {loading ? (
                    <Name>
                      <Skeleton
                        variant="text"
                        sx={{ fontSize: "inherit", width: 95 }}
                      />
                    </Name>
                  ) : (
                    <Name>{profile?.name || "Sửa hồ sơ"}</Name>
                  )}
                </Username>
                <Role color={currRole?.color}>{currRole?.label}</Role>
              </UserContainer>
            </InfoContainer>
          </MainProfile>
        </NavLink>
        {tabletMode && (
          <AdditionalInfo>
            {loading ? (
              <>
                <Additional>
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "inherit", width: 110 }}
                  />
                </Additional>
                <Additional>
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "inherit", width: 110 }}
                  />
                </Additional>
                <Additional>
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "inherit", width: 115 }}
                  />
                </Additional>
              </>
            ) : (
              <>
                <Additional>
                  <PersonAddAlt1 color="warning" />
                  Theo dõi:<b>{numFormat.format(profile?.totalFollows || 0)}</b>
                </Additional>
                <Additional>
                  <LocalActivity color="warning" />
                  Đánh giá:<b>{numFormat.format(profile?.totalReviews || 0)}</b>
                </Additional>
                <Additional>
                  <Today color="warning" />
                  Tham gia:
                  <b>
                    {new Date(profile?.joinedDate).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "2-digit",
                    })}
                  </b>
                </Additional>
              </>
            )}
          </AdditionalInfo>
        )}
      </ProfileContainer>
      <Divider />
      <List sx={{ width: "100%", py: 0 }} component="profile-nav">
        {!tabletMode && (
          <>
            <NavLink to={"/profile/detail"}>
              {({ isActive }) => (
                <StyledListItemButton
                  selected={isActive}
                  onClick={toggleOpen}
                  tabIndex={-1}
                >
                  <ItemText>
                    <PersonIcon />
                    &nbsp;Tài khoản của tôi
                  </ItemText>
                  {open ? <ExpandLess /> : <ExpandMore />}
                </StyledListItemButton>
              )}
            </NavLink>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <NavLink to={"/profile/detail/info"} end>
                  {({ isActive }) => (
                    <StyledListItemButton
                      selected={isActive}
                      className="secondary"
                    >
                      <ItemText>Hồ sơ</ItemText>
                    </StyledListItemButton>
                  )}
                </NavLink>
              </List>
              <List component="div" disablePadding>
                <NavLink to={"/profile/detail/address"} end>
                  {({ isActive }) => (
                    <StyledListItemButton
                      selected={isActive}
                      className="secondary"
                    >
                      <ItemText>Sổ địa chỉ</ItemText>
                    </StyledListItemButton>
                  )}
                </NavLink>
              </List>
              <List component="div" disablePadding>
                <NavLink to={"/profile/detail/password"} end>
                  {({ isActive }) => (
                    <StyledListItemButton
                      selected={isActive}
                      className="secondary"
                    >
                      <ItemText>Đổi mật khẩu</ItemText>
                    </StyledListItemButton>
                  )}
                </NavLink>
              </List>
            </Collapse>
          </>
        )}
        <NavLink to={"/profile/order"}>
          {({ isActive }) => (
            <StyledListItemButton selected={isActive} tabIndex={-1}>
              <ItemText>
                <ReceiptLongOutlined />
                &nbsp;Đơn hàng
                <MobileExtendButton>
                  <KeyboardArrowRight fontSize="small" />
                </MobileExtendButton>
              </ItemText>
            </StyledListItemButton>
          )}
        </NavLink>
        {tabletMode && (
          <NavWrapper>
            {items.map((item, index) => (
              <NavItem key={`tab-${index}`} to={item?.url}>
                {item?.icon}
                <p>{item?.label}</p>
              </NavItem>
            ))}
          </NavWrapper>
        )}
        <Divider />
        <NavLink to={"/profile/review"} end>
          {({ isActive }) => (
            <StyledListItemButton selected={isActive} tabIndex={-1}>
              <ItemText>
                <RateReviewOutlined />
                &nbsp;Đánh giá
                <MobileExtendButton>
                  <KeyboardArrowRight fontSize="small" />
                </MobileExtendButton>
              </ItemText>
            </StyledListItemButton>
          )}
        </NavLink>
        <Divider />
        <NavLink to={"/profile/coupon"} end>
          {({ isActive }) => (
            <StyledListItemButton selected={isActive} tabIndex={-1}>
              <ItemText>
                <LocalActivityOutlined />
                &nbsp;Mã giảm giá
                <MobileExtendButton>
                  <KeyboardArrowRight fontSize="small" />
                </MobileExtendButton>
              </ItemText>
            </StyledListItemButton>
          )}
        </NavLink>
      </List>
    </ListContainer>
  );
};

export default ProfileTabsList;
