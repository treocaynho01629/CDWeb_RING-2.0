import styled from '@emotion/styled'
import { styled as muiStyled } from '@mui/material';
import { useState } from 'react'
import { ExpandLess, ExpandMore, Category, TrendingUp, AutoStories, Speed, Groups, Star } from '@mui/icons-material';
import { ListItem, ListItemButton, ListItemIcon, ListItemText, List, Collapse, ListSubheader, Drawer } from '@mui/material';
import { NavLink } from 'react-router';
import MuiDrawer from '@mui/material/Drawer';
import useAuth from "../../hooks/useAuth";

//#region preStyled
const drawerWidth = 250;

const ImageLogo = styled.img`
    width: 40px;
    height: 40px;
    padding: 0;
    transition: all .25s ease;
    margin: ${props => props.theme.spacing(0, 1)};

    &.open {
      margin: ${props => props.theme.spacing(0, 3)};
    }
`

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('all', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${props => props.theme.spacing(7)} + 1px)`,
});

const DrawerHeader = muiStyled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  ...theme.mixins.toolbar,
}));

const StyledDrawer = muiStyled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',

    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const StyledMobileDrawer = muiStyled(Drawer)(({ theme }) => ({
  ...openedMixin(theme),
  '& .MuiDrawer-paper': openedMixin(theme),
}),
);

const StyledListItemButton = muiStyled(ListItemButton)(({ theme }) => ({
  minHeight: 48,
  justifyContent: 'center',
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),

  '&.Mui-selected': {
    color: theme.palette.primary.main,

    '.MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    }
  },

  '&.open': {
    justifyContent: 'initial',
    margin: theme.spacing(0, 1.5),
  }
}));

const StyledListItemIcon = muiStyled(ListItemIcon)(({ theme }) => ({
  minWidth: 0,
  justifyContent: 'center',

  '&.open': { marginRight: theme.spacing(3) }
}));
//#endregion

const managementListItems = [
  {
    label: 'Sản phẩm',
    icon: <AutoStories />,
    url: '/manage-products',
    subItems: [
      {
        label: 'Tổng quan',
        url: '/manage-products',
      },
      {
        label: 'Thêm mới',
        url: '/temp',
      },
    ]
  },
  {
    isAdmin: true,
    label: 'Danh mục',
    icon: <Category />,
    url: '/temp',
    subItems: [
      {
        label: 'Tổng quan',
        url: '/temp',
      },
      {
        label: 'Thêm mới',
        url: '/temp',
      },
    ]
  },
  {
    isAdmin: true,
    label: 'Thành viên',
    icon: <Groups />,
    url: '/manage-users',
    subItems: [
      {
        label: 'Tổng quan',
        url: '/manage-users',
      },
      {
        label: 'Thêm mới',
        url: '/temp',
      },
    ]
  },
  {
    label: 'Đánh giá',
    icon: <Star />,
    url: '/manage-reviews',
  },
  {
    label: 'Doanh thu',
    icon: <TrendingUp />,
    url: '/manage-orders',
  },
];

const DashboardDrawer = ({ open, setOpen }) => {
  const { roles } = useAuth();
  const [openList, setOpenList] = useState(true);
  const isAdmin = useState((roles?.find(role => ['ROLE_ADMIN'].includes(role))));

  const handleClick = (e, id) => {
    setOpenList((prevState) => ({ ...prevState, [id]: !prevState[id] }));
    setOpen(true);
    e.stopPropagation();
    e.preventDefault();
  };

  const handleDrawerClose = () => { setOpen(false) };

  const drawerContent = (
    <>
      <DrawerHeader>
        <NavLink to={'/dashboard'}>
          <ImageLogo src="/logo.svg" className={open ? 'open' : ''} alt="RING! logo" />
        </NavLink>
      </DrawerHeader>
      <List disablePadding>
        <ListItem key={0} disablePadding sx={{ display: 'block' }}>
          <NavLink to={'/dashboard'}>
            {({ isActive }) => (
              <StyledListItemButton
                className={open ? 'open' : ''}
                selected={isActive}
              >
                <StyledListItemIcon className={open ? 'open' : ''}>
                  <Speed />
                </StyledListItemIcon>
                <ListItemText primary={"Dashboard"} sx={{ opacity: open ? 1 : 0 }} />
              </StyledListItemButton>
            )}
          </NavLink>
        </ListItem>
      </List>
      <List
        disablePadding
        subheader={open ?
          <ListSubheader component="div" id="management-list-subheader" sx={{ fontSize: 14 }}>
            QUẢN LÝ
          </ListSubheader>
          : null
        }
      >
        {
          managementListItems.map((item, index) => (
            (!item.isAdmin || isAdmin) &&
            <NavLink key={`link-${index}`} to={item.url}>
              {({ isActive }) => (
                <>
                  <ListItem key={`item-${index}`} disablePadding sx={{ display: 'block' }}>
                    <StyledListItemButton
                      className={open ? 'open' : ''}
                      selected={isActive}
                    >
                      <StyledListItemIcon className={open ? 'open' : ''}>
                        {item.icon}
                      </StyledListItemIcon>
                      <ListItemText primary={item.label} sx={{ opacity: open ? 1 : 0 }} />
                      {item.subItems &&
                        (openList[index] ? <ExpandLess sx={{ display: open ? 'block' : 'none' }} onClick={(e) => handleClick(e, index)} />
                          : <ExpandMore sx={{ display: open ? 'block' : 'none' }} onClick={(e) => handleClick(e, index)} />)
                      }
                    </StyledListItemButton>
                  </ListItem>
                  {item.subItems &&
                    <Collapse key={index} in={openList[index]} timeout={250} unmountOnExit sx={{ display: open ? 'block' : 'none' }}>
                      <List component="div" disablePadding>
                        {item.subItems?.map((sub, subIndex) => (
                          <NavLink key={`sub-${index}-${subIndex}`} to={sub.url}>
                            <ListItemButton sx={{ pl: 4 }}>
                              <ListItemText primary={sub.label} />
                            </ListItemButton>
                          </NavLink>
                        ))}
                      </List>
                    </Collapse>
                  }
                </>
              )}
            </NavLink>
          ))
        }
      </List>
    </>
  )

  return (
    <>
      <StyledMobileDrawer
        variant="temporary"
        open={open}
        onClose={handleDrawerClose}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        {drawerContent}
      </StyledMobileDrawer>
      <StyledDrawer
        variant="permanent"
        sx={{ display: { xs: 'none', md: 'block' } }}
        open={open}
      >
        {drawerContent}
      </StyledDrawer>
    </>
  )
}

export default DashboardDrawer