import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import { useDispatch, useSelector } from 'react-redux';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
// import PropTypes from 'prop-types';
import React from 'react';
import { NavLink as RouterLink, useHistory } from 'react-router-dom';
// @ts-ignore
import MainListItems from './Helpers/ListItems.tsx';
// @ts-ignore
import BasicMenu from './Menu.tsx';
// @ts-ignore
import NotificationsMenu from './Notfication/NotificationsMenu.tsx';
import Copyright from './Helpers/Copyright';
// @ts-ignore
import { RootState, AppDispatch } from '../store.ts';
// @ts-ignore
import type { User, NotificationType } from '../types.ts';
// @ts-ignore
import { getBooks } from '../actions/books.tsx';
// @ts-ignore
import { getUsers } from '../actions/users.tsx';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginRight: 36,
  },
  title: {
    flexGrow: 1,
    color: 'white',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(7),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    minHeight: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(0),
    paddingLeft: '0px',
    paddingRight: '0px',
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    '&:hover': { backgroundColor: '#abc' },
  },
  fixedHeight: {
    height: 150,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  link: {
    color: 'red',
    textDecoration: 'none',
  },
  linkActive: {
    fontWeight: 'bold',
    color: 'red',
    textDecoration: 'none',
  },
  copyrightBox: {
    position: 'fixed',
    bottom: 0,
    backgroundColor: '#3f51b5',
    width: '100vw',
    padding: 4,
    color: 'white',
    marginTop: 4,
  },
}));

interface OwnProps {
  children: React.Component<any, any>;
  users: [User];
  Notification: NotificationType;
  wrapperType: React.RefObject<HTMLDivElement>;
}

type Props = RootState & AppDispatch & OwnProps;

const Dashboard: React.FC<OwnProps> = ({ children, Notification, wrapperType }: Props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState<boolean>(false);
  const [newNotifications, setNewNotifications] = React.useState<any>([]);

  const dispatch: AppDispatch = useDispatch();
  const { token, users, authUser } = useSelector((state: RootState) => state.users);
  const { roles } = authUser;

  const toggleDrawerOpen = () => {
    setOpen(!open);
  };

  const wrapper: typeof wrapperType = React.createRef();
  const isAdmin: boolean = roles.includes('Admin') || roles.includes('Librarian');
  const history = useHistory();

  const currentUser: User | undefined = users.filter(
    (u: User) => u.username === authUser.username
  )[0];

  const seeNotifications = () => {
    setNewNotifications([]);
  };

  React.useEffect(() => {
    if (currentUser && currentUser.notifications) {
      const notSeenNotifications: any = currentUser?.notifications?.filter(
        (n: typeof Notification) => n.seen === 'false'
      );
      if (notSeenNotifications && notSeenNotifications?.length > 0) {
        setNewNotifications(notSeenNotifications);
      }
    }
  }, [users]);

  React.useEffect(() => {
    dispatch(getBooks(token));
    dispatch(getUsers(token));
  }, []);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar)}>
        <Toolbar data-testid="toolbar">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            data-testid="menu-icon-link"
            onClick={toggleDrawerOpen}
            className={clsx(classes.menuButton)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            <RouterLink
              to="/"
              activeStyle={{
                fontWeight: 'bold',
                color: 'inherit',
                textDecoration: 'none',
              }}
              data-testid="elms-home-link"
            >
              Elms
            </RouterLink>
          </Typography>
          <NotificationsMenu
            badgeContent={newNotifications?.length || 0}
            notifications={currentUser?.notifications
              ?.slice(currentUser?.notifications.length - 3)
              .reverse()}
            username={authUser.username}
            resetBadge={seeNotifications}
            history={history}
          />
          <BasicMenu />
        </Toolbar>
      </AppBar>
      {isAdmin && (
        <Drawer
          variant="permanent"
          data-testid="dashboard-drawer"
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          open={open}
        >
          <List style={{ marginTop: '55px', alignItems: 'center', justifyContent: 'flex-end' }}>
            <MainListItems show={isAdmin} />
          </List>
        </Drawer>
      )}
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="xl" className={classes.container}>
          <div ref={wrapper}>{children}</div>
          <Box className={classes.copyrightBox}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
};

export default Dashboard;
