import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import {
  CancelPresentationRounded,
  BiotechRounded,
  LibraryBooks,
  CheckRounded,
  AppRegistration,
  MedicationRounded,
  Vaccines,
  PestControlRounded,
  AccessTimeRounded,
  Bloodtype,
  MedicationLiquidRounded,
  Domain,
  LocalHospitalRounded,
  PeopleRounded,
  GroupsRounded,
  DescriptionRounded,
  Message,
  ChatBubble,
  ChatBubbleRounded,
} from '@mui/icons-material';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCookie, setCookie } from '../lib/cookie';
import { Tooltip, IconButton, Avatar, Button, Container } from '@mui/material';
import {
  PivotTableChart,
  Dashboard,
  ListAlt,
  People,
  Settings,
  ScheduleSend,
  DocumentScanner,
  ExpandLess,
  ExpandMore,
  Edit,
  DescriptionOutlined,
  BallotRounded,
  PregnantWomanRounded,
} from '@mui/icons-material';
import Menu from '@mui/material/Menu';
import { MenuItem } from '@mui/material';
import { apiHost } from '../lib/api';
import { makeStyles, createStyles } from '@mui/styles';
import appRoutes from '../routes';
const drawerWidth = 250;

const useStyles = makeStyles(theme =>
  createStyles({
    appMenu: {
      width: '100%',
    },
    navList: {
      width: drawerWidth,
    },
    menuItem: {
      width: drawerWidth,
    },
    menuItemIcon: {
      color: '#97c05c',
    },
  })
);

export default function HeaderDrawer({ children }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(null);
  const [userData, setUserData] = useState(null);

  function handleClick(item) {
    setOpen(open === item ? null : item);
  }

  let title = "FarmHub";
  let navigate = useNavigate();
  let [role, setRole] = useState(getCookie('role'));
  const settings = [{ 'My Account': '/account' }, { Logout: '/logout' }];
  let pages = settings;
  let [activeTab, setActiveTab] = useState('dashboard');

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = event => {
    setAnchorElNav(event.currentTarget);
    return;
  };
  const handleOpenUserMenu = event => {
    setAnchorElUser(event.currentTarget);
    return;
  };

  let getProfile = async () => {
    let { data } = await (
      await fetch(`${apiHost}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getCookie('token')}`,
        },
      })
    ).json();
    setUserData(data);
    setRole(data.role);
    setCookie('role', data.role, 1 / 60);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
    return;
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
    return;
  };

  useEffect(() => {
    let token = getCookie('token');
    if (token) {
      getProfile();
      return;
    } else {
      navigate('/login');
      // window.localStorage.setItem("next_page", "/")
      return;
    }
  }, []);

  let isActiveTab = tab => {
    return tab === activeTab;
  };

  let activateTab = tab => {
    window.localStorage.setItem('activeTab', tab);
    return;
  };

  useEffect(() => {
    setActiveTab(window.localStorage.getItem('activeTab'));
  }, [window.localStorage.getItem('activeTab')]);

  const routes = [
    {
      name: 'Dashboard',
      icon: <Dashboard />,
      path: '/',
      roles: ['ADMINISTRATOR'],
    },
    {
      name: 'Messaging',
      icon: <ChatBubbleRounded />,
      path: '/messaging',
      roles: ['SPECIALIST'],
    },
    {
      name: 'Reports',
      icon: <DescriptionRounded />,
      path: '/reports',
      roles: ['USER', 'NURSE'],
      children: [
        {
          name: 'Sample',
          icon: <PivotTableChart />,
          path: '/moh-reports',
          roles: ['USER', 'NURSE'],
        },
      ],
    },
    {
      name: 'Users',
      icon: <People />,
      path: '/users',
      roles: ['ADMINISTRATOR', 'USER'],
    },
    {
      name: 'Account & Settings',
      icon: <Settings />,
      path: '/account',
      roles: ['ADMINISTRATOR', 'USER', 'SPECIALIST'],
    },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position='fixed'
        sx={{
          zIndex: theme => theme.zIndex.drawer + 1,
          backgroundColor: 'green',
        }}
        elevation={0}
      >
        <Container maxWidth='xl'>
          <Toolbar disableGutters>
            <img
              onClick={e => {
                navigate('/');
              }}
              src='/vite.svg'
              height='50px'
              alt='logo'
            />
            <Typography
              variant='h6'
              noWrap
              component='div'
              sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
              onClick={e => {
                navigate('/');
              }}
            >
              {title}
            </Typography>
            <Box
              sx={{ flexGrow: 1, display: { xs: 'flex', md: 'inline-block' } }}
            ></Box>
            <Typography
              variant='h6'
              noWrap
              component='div'
              sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
              onClick={e => {
                navigate('/');
              }}
            >
              {title}
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {/* {pages.map(page => (
                <Button
                  key={Object.keys(page)[0]}
                  onClick={e => {
                    navigate(`${page[Object.keys(page)[0]]}`);
                    handleCloseNavMenu();
                  }}
                  sx={{ my: 2, color: 'green', display: 'block' }}
                >
                  {Object.keys(page)[0]}
                </Button>
              ))} */}
            </Box>
            {getCookie('token') ? (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title='Open settings'>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id='menu-appbar'
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map(setting => (
                    <MenuItem
                      key={Object.keys(setting)[0]}
                      onClick={handleCloseNavMenu}
                    >
                      <Typography
                        textAlign='center'
                        onClick={e => {
                          navigate(`${setting[Object.keys(setting)[0]]}`);
                        }}
                      >
                        {Object.keys(setting)[0]}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            ) : (
              <Button
                variant='outlined'
                onClick={e => {
                  navigate('/login');
                }}
                sx={{ color: 'white', '&:hover': { backgroundColor: 'gray' } }}
              >
                LOGIN
              </Button>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer
        variant='permanent'
        sx={{
          width: drawerWidth,
          backgroundColor: 'green',
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box
          sx={{
            overflow: 'auto',
            backgroundColor: 'green',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <List>
            {role &&
              routes
                .filter(item => item.roles.includes(role))
                .map((route, index) =>
                  route.children ? (
                    <>
                      <ListItem
                        onClick={() => handleClick(index)}
                        sx={{
                          backgroundColor: isActiveTab(route.name)
                            ? 'white'
                            : 'green',
                          color: isActiveTab(route.name) ? 'green' : 'white',
                          '&:hover': { backgroundColor: 'gray' },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: isActiveTab(route.name)
                              ? 'green'
                              : 'white',
                          }}
                        >
                          {route.icon}
                        </ListItemIcon>
                        <ListItemText
                          primaryTypographyProps={{ fontSize: '13px' }}
                          primary={route.name}
                        />
                        {open === index ? <ExpandLess /> : <ExpandMore />}
                      </ListItem>
                      <Collapse
                        in={open === index}
                        timeout='auto'
                        unmountOnExit
                      >
                        <Divider />
                        <List disablePadding>
                          {route.children
                            .filter(item => item.roles.includes(role))
                            .map(form => (
                              <ListItem
                                button
                                key={form.name}
                                onClick={e => {
                                  navigate(form.path);
                                  activateTab(form.name);
                                }}
                                sx={{
                                  backgroundColor: isActiveTab(form.name)
                                    ? 'white'
                                    : 'green',
                                  marginLeft: '10px',
                                  color: isActiveTab(form.name)
                                    ? 'green'
                                    : 'white',
                                  '&:hover': { backgroundColor: 'gray' },
                                }}
                              >
                                <ListItemIcon
                                  sx={{
                                    color: isActiveTab(form.name)
                                      ? 'green'
                                      : 'white',
                                  }}
                                >
                                  {form.icon}
                                </ListItemIcon>
                                <ListItemText
                                  primaryTypographyProps={{ fontSize: '13px' }}
                                  primary={form.name}
                                />
                              </ListItem>
                            ))}
                        </List>
                      </Collapse>
                    </>
                  ) : (
                    <ListItem
                      sx={{
                        backgroundColor: isActiveTab(route.name)
                          ? 'white'
                          : 'green',
                        color: isActiveTab(route.name) ? 'green' : 'white',
                        '&:hover': { backgroundColor: 'gray' },
                      }}
                      key={route.name}
                      onClick={e => {
                        navigate(`${route.path}`);
                        activateTab(route.name);
                        handleCloseNavMenu();
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: isActiveTab(route.name) ? 'green' : 'white',
                        }}
                      >
                        {route.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={route.name}
                        primaryTypographyProps={{ fontSize: '13px' }}
                      />
                    </ListItem>
                  )
                )}
          </List>
        </Box>
      </Drawer>
      <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
        <br />
        <br />
        <br />
        <Container>
          <Routes>
            {userData &&
              appRoutes.map((route, index) => (
                <Route
                  path={route.path}
                  key={index}
                  element={<route.element userData={userData} />}
                />
              ))}
          </Routes>
        </Container>
      </Box>
    </Box>
  );
}
